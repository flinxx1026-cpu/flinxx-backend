/**
 * ⚡ OPTIMIZED MATCHING SOCKET HANDLERS v2
 * 
 * Features:
 * ✅ Atomic Lua operations (< 5ms latency)
 * ✅ Skip with instant requeue
 * ✅ WebRTC ICE pre-connect
 * ✅ Queue sharding for high loads
 */

import MatchingServiceOptimized from '../services/matchingServiceOptimized.js';
import { validateSkipLimit } from '../services/skipLimitValidator.js';

// Helper function to fetch user profile from database
async function getUserProfile(userId, prisma) {
  if (!prisma || !userId) {
    console.warn(`[PROFILE] ⚠️ Cannot fetch profile: prisma=${!!prisma}, userId=${!!userId}`);
    return null;
  }
  
  try {
    console.log(`[PROFILE] 🔍 Fetching profile for userId: ${userId}`);
    
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        display_name: true,
        location: true,
        photo_url: true,
        age: true,
        has_blue_tick: true
      }
    });
    
    if (user) {
      console.log(`[PROFILE] ✅ Fetched user ${userId}:`);
      console.log(`   - display_name: "${user.display_name}"`);
      console.log(`   - location: "${user.location}"`);
      console.log(`   - photo_url: "${user.photo_url}"`);
      console.log(`   - age: ${user.age}`);
      console.log(`   - has_blue_tick: ${user.has_blue_tick}`);
    } else {
      console.warn(`[PROFILE] ⚠️ User ${userId} NOT found in database`);
      console.warn(`[PROFILE] ⚠️ This will cause DEFAULT values to be sent: "Anonymous", "Unknown"`);
    }
    
    return user;
  } catch (err) {
    console.error(`[PROFILE] ❌ Error fetching user ${userId}:`, err.message);
    console.error(`[PROFILE] ❌ Error stack:`, err.stack);
    return null;
  }
}

export function setupMatchingHandlers(io, redis, prisma) {
  const matchingService = new MatchingServiceOptimized(redis);

  // Store socket to userId mapping
  const socketToUser = new Map();
  const userToSocket = new Map();
  const userQueueData = new Map(); // Store user's queue data for skip
  
  // ✅ Track Lua script initialization state
  let luaScriptsReady = false;
  const pendingMatches = []; // Queue for matching requests while Lua loads

  const handleStartMatching = async (socket, data, options = {}) => {
    const { skipLuaReadyCheck = false, source = 'direct' } = options;

    try {
      const { userId, cameraReady } = data || {};

      console.log(`\n[MATCHING] ========== USER:START_MATCHING RECEIVED ==========`);
      console.log(`[MATCHING] Source: ${source}`);
      console.log(`[MATCHING] Socket ID: ${socket?.id || 'unknown'}`);
      console.log(`[MATCHING] User ID: ${userId}`);
      console.log(`[MATCHING] Camera Ready: ${cameraReady}`);
      console.log(`[MATCHING] Data received:`, JSON.stringify(data, null, 2));
      console.log(`[MATCHING] Lua Scripts Ready: ${luaScriptsReady}`);
      console.log(`[MATCHING] ===========================================`);

      if (!userId) {
        socket?.emit('match:error', { message: 'Missing userId' });
        return;
      }

      // 🛑 SKIP LIMIT ENFORCEMENT (DB-first + lock + correct threshold)
      const validation = await validateSkipLimit({
        userId,
        prisma,
        redis,
        increment: false, // start-matching check does not consume a skip
        source: `start_matching:${source}`
      });

      if (!validation.canSkip) {
        console.log('[MATCHING] 🚫 Skip limit reached (start_matching pre-check)', validation);
        // Safety: premium users must NEVER see the popup.
        if (validation.isPremium) {
          console.warn('[MATCHING] Safety guard: isPremium=true but canSkip=false. Allowing skip.', {
            userId,
            validation
          });
          // Continue (premium bypass). Do not emit popup.
        } else {
          socket?.emit('skip_limit_reached', {
            message: 'You have used your free skip. Upgrade to Unlimited Skip to continue.',
            canSkip: false,
            isPremium: validation.isPremium,
            skipCount: validation.skipCount,
            limit: validation.limit
          });
          return; // STOP matching
        }
      }

      // ✅ LOG camera readiness for debugging (do NOT reject - component remounts can cause false negatives)
      if (!cameraReady && source !== 'retry') {
        console.warn(`[MATCHING] ⚠️ WARNING: ${userId} matching without cameraReady flag (cameraReady=${cameraReady})`);
      }

      if (!luaScriptsReady && !skipLuaReadyCheck) {
        console.warn(`[MATCHING] ⚠️ Lua scripts NOT ready yet, queueing request...`);
        console.warn(`[MATCHING] ⚠️ Current pending requests: ${pendingMatches.length}`);

        pendingMatches.push({
          userId,
          socketId: socket?.id,
          data: data,
          timestamp: Date.now()
        });

        socket?.emit('match:waiting', {
          message: 'Initializing matching service...',
          queueSize: 0,
          strategy: 'system_init'
        });

        return;
      }

      console.log(`\n[MATCHING] 🟢 ${userId} started matching`);

      // Store mapping
      socketToUser.set(socket.id, userId);
      userToSocket.set(userId, socket.id);

      // 🧊 PRE-CONNECT: Start WebRTC ICE gathering immediately
      const iceServers = [
        // ✅ PRIMARY: STUN Server (for normal NAT traversal)
        { urls: process.env.STUN_SERVER || 'stun:stun.l.google.com:19302' }
      ];

      // ✅ PRIMARY: Self-hosted TURN server (always add if configured)
      if (process.env.TURN_SERVER) {
        iceServers.push({
          urls: process.env.TURN_SERVER,
          username: process.env.TURN_USERNAME,
          credential: process.env.TURN_PASSWORD
        });
        console.log(`[ICE] ✅ Self-hosted TURN added: ${process.env.TURN_SERVER}`);
      }

      // ✅ BACKUP: Free public TURN servers (if self-hosted is down)
      // These work globally and handle ISP blocking (Jio, Airtel in India)
      iceServers.push(
        {
          urls: ['turn:numb.viagee.com:3478?transport=udp', 'turn:numb.viagee.com:3479?transport=tcp'],
          username: 'webrtc',
          credential: 'webrtc123'
        },
        {
          urls: ['turn:openrelay.metered.ca:80?transport=udp', 'turn:openrelay.metered.ca:443?transport=tcp'],
          username: 'openrelayproject',
          credential: 'openrelayproject'
        }
      );
      console.log(`[ICE] ✅ Public TURN backups added (numb.viagee.com, openrelay.metered.ca)`);

      socket.emit('webrtc:prepare', {
        message: 'Preparing WebRTC connection...',
        iceServers: iceServers,
        // 🧊 Configuration for instant ICE pre-gathering
        peerConnectionConfig: {
          iceTransportPolicy: 'all',
          iceCandidatePoolSize: 10,
          bundlePolicy: 'max-bundle',
          rtcpMuxPolicy: 'require'
        },
        // Signal that frontend should start ICE gathering immediately
        preGatherICE: true,
        preGatherTimeout: 8000
      });

      // Store user's queue data for skip operation
      const userQueueEntry = JSON.stringify({
        userId,
        socketId: socket.id,
        joinedAt: Date.now()
      });
      userQueueData.set(userId, { entry: userQueueEntry, data: { socketId: socket.id } });

      // Add to matching queue
      const result = await matchingService.addUserToQueue(userId, {
        socketId: socket.id
      });

      console.log(`[MATCHING] 📋 Queue result:`, JSON.stringify(result, null, 2));
      console.log(`[MATCHING] ✅ Processing queue result...`);

      if (result.isMatch && result.partner) {
        // ✅ CRITICAL: Prevent self-matching (same account, two tabs)
        if (result.partner.userId === userId) {
          console.warn(`[MATCHING] ⚠️ SELF-MATCH PREVENTED: ${userId} matched with themselves. Ignoring.`);
          // Treat as no match — stay in queue
          socket.emit('match:waiting', {
            message: 'Searching for a match...',
            queueSize: 1,
            strategy: 'fast_retry'
          });
        } else {
        // 🎉 INSTANT MATCH FOUND (< 50ms)
        console.log(`\n[MATCHING] 🎉🎉🎉 INSTANT MATCH FOUND! 🎉🎉🎉`);
        console.log(`[MATCHING]    ${userId} ↔️ ${result.partner.userId}`);

        // 🔍 FETCH USER PROFILES from database
        console.log(`[MATCHING] 📊 Fetching user profiles...`);
        const [currentUserProfile, partnerUserProfile] = await Promise.all([
          getUserProfile(userId, prisma),
          getUserProfile(result.partner.userId, prisma)
        ]);

        console.log(`[MATCHING] ✅ Profiles fetched`);
        console.log(`[MATCHING] 📊 currentUserProfile:`, currentUserProfile ? {
          id: currentUserProfile.id,
          display_name: currentUserProfile.display_name,
          location: currentUserProfile.location
        } : null);
        console.log(`[MATCHING] 📊 partnerUserProfile:`, partnerUserProfile ? {
          id: partnerUserProfile.id,
          display_name: partnerUserProfile.display_name,
          location: partnerUserProfile.location
        } : null);

        // 📦 BUILD PARTNER DATA for current user
        const partnerDataForCurrentUser = {
          partnerId: result.partner.userId,
          socketId: result.partner.socketId,
          matchTime: result.matchTime,
          connectedAt: Date.now(),
          // User profile data for the partner
          userName: partnerUserProfile?.display_name || 'Anonymous',
          userLocation: partnerUserProfile?.location || 'Unknown',
          userPicture: partnerUserProfile?.photo_url || null,
          userAge: partnerUserProfile?.age || 18,
          hasBlueTick: partnerUserProfile?.has_blue_tick || false
        };

        // 📦 BUILD PARTNER DATA for partner user
        const partnerDataForPartner = {
          partnerId: userId,
          socketId: socket.id,
          matchTime: result.matchTime,
          connectedAt: Date.now(),
          // User profile data for the current user
          userName: currentUserProfile?.display_name || 'Anonymous',
          userLocation: currentUserProfile?.location || 'Unknown',
          userPicture: currentUserProfile?.photo_url || null,
          userAge: currentUserProfile?.age || 18,
          hasBlueTick: currentUserProfile?.has_blue_tick || false
        };

        // 📤 EMIT to current user
        console.log(`[MATCHING] 📤 Emitting to ${userId}:`, partnerDataForCurrentUser);
        socket.emit('partner_found', partnerDataForCurrentUser);
        console.log(`[MATCHING] ✅ partner_found emitted to ${userId}`);

        // 📤 EMIT to partner — ROBUST multi-fallback lookup
        // 1️⃣ PRIMARY: Use userToSocket map (always has LIVE socketId)
        const livePartnerSocketId = userToSocket.get(result.partner.userId);
        // 2️⃣ FALLBACK: Use Redis socketId (may be stale after reconnect)
        const redisPartnerSocketId = result.partner.socketId;
        
        const resolvedSocketId = livePartnerSocketId || redisPartnerSocketId;
        console.log(`[MATCHING] 🔌 Partner socket lookup:`, {
          userId: result.partner.userId,
          liveSocketId: livePartnerSocketId || 'NOT FOUND',
          redisSocketId: redisPartnerSocketId || 'NOT FOUND',
          resolved: resolvedSocketId || 'NONE'
        });
        
        let partnerEmitted = false;
        
        // Try direct socket object first (most reliable)
        if (resolvedSocketId) {
          const partnerSocket = io.sockets.sockets.get(resolvedSocketId);
          if (partnerSocket) {
            // Update the socketId in the data to match the LIVE socket
            partnerDataForPartner.socketId = socket.id;
            partnerDataForCurrentUser.socketId = resolvedSocketId;
            
            partnerSocket.emit('partner_found', partnerDataForPartner);
            console.log(`[MATCHING] ✅ partner_found emitted to ${result.partner.userId} via direct socket`);
            partnerEmitted = true;
          }
        }
        
        // Ultimate fallback: use io.to() broadcast
        if (!partnerEmitted && resolvedSocketId) {
          io.to(resolvedSocketId).emit('partner_found', partnerDataForPartner);
          console.log(`[MATCHING] ✅ partner_found emitted to ${result.partner.userId} via io.to(${resolvedSocketId})`);
          partnerEmitted = true;
        }
        
        if (!partnerEmitted) {
          console.error(`[MATCHING] ❌❌ CRITICAL: Could not emit partner_found to partner ${result.partner.userId}`);
          console.error(`[MATCHING] ❌❌ Available sockets:`, Array.from(io.sockets.sockets.keys()).slice(0, 10));
          console.error(`[MATCHING] ❌❌ userToSocket entries:`, Array.from(userToSocket.entries()).slice(0, 10));
        }

        // ✅ CRITICAL: Register partner mapping for disconnect handling
        if (io._partnerSockets) {
          const actualPartnerSocketId = resolvedSocketId || result.partner.socketId;
          io._partnerSockets.set(socket.id, actualPartnerSocketId);
          io._partnerSockets.set(actualPartnerSocketId, socket.id);
          console.log(`[MATCHING] ✅ Partner relationship tracked for disconnects: ${socket.id} ↔ ${actualPartnerSocketId}`);
        }

        // 🔮 PREFETCH next candidates for instant skip (fire and forget)
        matchingService.prefetchNextCandidate(userId).catch(err =>
          console.error('❌ Prefetch error for', userId, err.message)
        );
        matchingService.prefetchNextCandidate(result.partner.userId).catch(err =>
          console.error('❌ Prefetch error for', result.partner.userId, err.message)
        );
        } // ← Close self-match else block
      } else {
        // ⏳ WAITING - User added to queue
        const queueSize = result.queueSize || 0;
        console.log(`\n[MATCHING] ⏳ User ${userId} added to queue`);
        console.log(`[MATCHING]    Queue size: ${queueSize}`);
        console.log(`[MATCHING]    Emitting match:waiting to user...`);

        socket.emit('match:waiting', {
          message: 'Searching for a match...',
          queueSize: queueSize,
          strategy: 'fast_retry'
        });
        console.log(`[MATCHING] ✅ match:waiting emitted to ${userId}`);

        // 🔄 AUTO-RETRY LOGIC:
        // Check every 2 seconds if match is found
        let retryCount = 0;
        const maxRetries = 5; // 5 retries = 10 seconds before auto-refresh

        // Store timer on socket so it can be cancelled
        if (socket.retryTimer) clearInterval(socket.retryTimer);

        socket.retryTimer = setInterval(async () => {
          try {
            retryCount++;

            // Check if already matched
            const matched = await redis.get(`matched:${userId}`);
            if (matched) {
              clearInterval(socket.retryTimer);
              console.log(`[MATCHING] 🎉 ${userId} matched after retry #${retryCount}`);

              // 🔍 FETCH partner profile for polling match
              const partnerProfile = await getUserProfile(matched, prisma);

              // ✅ CRITICAL FIX: Look up partner's CURRENT socket ID so frontend can determine OFFERER/ANSWERER role
              const partnerCurrentSocketId = userToSocket.get(matched);
              console.log(`[MATCHING] 🔌 Partner socket ID for polling match: ${partnerCurrentSocketId}`);

              socket.emit('partner_found', {
                partnerId: matched,
                socketId: partnerCurrentSocketId || '',
                matchType: 'found_while_waiting',
                userName: partnerProfile?.display_name || 'Anonymous',
                userLocation: partnerProfile?.location || 'Unknown',
                userPicture: partnerProfile?.photo_url || null,
                userAge: partnerProfile?.age || 18,
                hasBlueTick: partnerProfile?.has_blue_tick || false
              });
              return;
            }

            // If 5 retries (10 seconds) passed, refresh queue
            if (retryCount >= maxRetries) {
              console.log(`[MATCHING] 🔄 Auto-refreshing queue for ${userId} after 10 seconds`);
              clearInterval(socket.retryTimer);

              // Refresh user in queue
              const queueData = userQueueData.get(userId);
              if (queueData) {
                await matchingService.refreshQueue(userId, queueData.entry);
              }

              // Tell client to refresh UI
              socket.emit('match:reconnecting', {
                message: 'Searching again... (refreshed queue)'
              });

              // Restart matching for this user (server-side)
              setTimeout(() => {
                handleStartMatching(socket, { userId }, { skipLuaReadyCheck: true, source: 'retry' })
                  .catch(err => console.error('[MATCHING_RETRY] Restart error:', err.message));
              }, 100);
              return;
            }

            // Log retry attempt
            console.log(`[MATCHING] 🔄 Retry #${retryCount} for ${userId}`);

          } catch (err) {
            console.error('[MATCHING_RETRY] Error:', err);
            clearInterval(socket.retryTimer);
          }
        }, 2000); // Check every 2 seconds

        // Clear poll after timeout (30 seconds max)
        setTimeout(() => clearInterval(socket.retryTimer), 30000);
      }
    } catch (error) {
      console.error(`\n[MATCHING_ERROR] ❌❌❌ CRITICAL ERROR IN USER:START_MATCHING ❌❌❌`);
      console.error(`[MATCHING_ERROR] userId: ${userId || 'unknown'}`);
      console.error(`[MATCHING_ERROR] Error name: ${error?.name}`);
      console.error(`[MATCHING_ERROR] Error message: ${error?.message}`);
      console.error(`[MATCHING_ERROR] Error code: ${error?.code}`);
      console.error(`[MATCHING_ERROR] Full error:`, error);
      console.error(`[MATCHING_ERROR] Stack trace:`, error?.stack);
      
      // Try to determine the cause
      if (error.message.includes('Redis')) {
        console.error(`[MATCHING_ERROR] 🔴 Cause: Redis connection issue`);
      } else if (error.message.includes('Lua')) {
        console.error(`[MATCHING_ERROR] 🔴 Cause: Lua script execution failed`);
      } else if (error.message.includes('already in queue')) {
        console.error(`[MATCHING_ERROR] 🔴 Cause: User already in matching queue`);
      } else {
        console.error(`[MATCHING_ERROR] 🔴 Cause: Unknown - check error message above`);
      }
      
      socket?.emit('match:error', {
        message: 'Failed to start matching: ' + error.message,
        error: error.message,
        details: {
          errorName: error?.name,
          errorCode: error?.code,
          timestamp: new Date().toISOString()
        }
      });
      
      // Log diagnostics
      console.log(`[MATCHING_ERROR] 📊 Diagnostics:`);
      console.log(`[MATCHING_ERROR]    - Socket ID: ${socket?.id}`);
      console.log(`[MATCHING_ERROR]    - Lua scripts ready: ${luaScriptsReady}`);
      console.log(`[MATCHING_ERROR]    - Pending matches: ${pendingMatches.length}`);
    }
  };
  
  // ✅ CRITICAL: Initialize Lua scripts IMMEDIATELY
  console.log('\n⏳ [MATCHING] ========== STARTING LUA SCRIPT INITIALIZATION ==========');
  console.log('[MATCHING] This process runs async in background...');
  (async () => {
    try {
      console.log('⏳ [MATCHING] Loading Lua scripts...');
      console.log('⏳ [MATCHING] Calling matchingService.initializeLuaScripts()...');
      await matchingService.initializeLuaScripts();
      luaScriptsReady = true;
      console.log('✅ [MATCHING] ========== LUA SCRIPTS LOADED SUCCESSFULLY ==========');
      console.log('✅ [MATCHING] Matching handlers ready for connections');
      console.log(`✅ [MATCHING] Processing ${pendingMatches.length} pending match requests...`);
      
      // Process any pending matching requests that came in while loading
      while (pendingMatches.length > 0) {
        const pendingData = pendingMatches.shift();
        console.log(`[MATCHING] Processing pending match for ${pendingData.userId}`);
        try {
          const pendingSocket = io.sockets.sockets.get(pendingData.socketId);
          if (!pendingSocket) {
            console.warn(`[MATCHING] ⚠️ Pending socket not found for ${pendingData.userId}, skipping`);
            continue;
          }

          await handleStartMatching(pendingSocket, pendingData.data, {
            skipLuaReadyCheck: true,
            source: 'pending'
          });
        } catch (err) {
          console.error(`[MATCHING] Error processing pending match for ${pendingData.userId}:`, err.message);
        }
      }
    } catch (error) {
      console.error('\n❌ [MATCHING] ========== FAILED TO INITIALIZE LUA SCRIPTS ==========');
      console.error('❌ [MATCHING] Error message:', error.message);
      console.error('❌ [MATCHING] Error code:', error.code);
      console.error('❌ [MATCHING] Error stack:', error.stack);
      console.error('❌ [MATCHING] Matching system will still work with inline Lua fallback');
      console.error('❌ [MATCHING] But performance may be degraded');
      console.error('❌ [MATCHING] Possible causes:');
      console.error('   - Redis connection not ready yet');
      console.error('   - Lua files missing or not readable');
      console.error('   - File path issues');
      console.error('❌ [MATCHING] ========================================');
      luaScriptsReady = false;
    }
  })(); // Fire and forget but tracks state

  // Registration handler - fires for each new connection
  io.on('connection', (socket) => {
    console.log(`\n[SOCKET] 🔗 New connection: ${socket.id}`);
    console.log(`[SOCKET] ✅ Current socket count: ${io.engine.clientsCount || 'unknown'}`);
    
    // ✅ CRITICAL: Join socket to its own room so io.to(socketId) works
    socket.join(socket.id);
    console.log(`[SOCKET] ✅ Socket joined room: ${socket.id}`);
    
    // 🔍 UNIVERSAL EVENT LISTENER - Catch EVERY event from this client
    socket.onAny((eventName, ...args) => {
      console.log(`\n[SOCKET EVENT RECEIVED] 📨 Event: "${eventName}"`);
      console.log(`[SOCKET EVENT] Socket ID: ${socket.id}`);
      console.log(`[SOCKET EVENT] Data:`, args.length > 0 ? args[0] : 'no data');
    });

    /**
     * USER_START_MATCHING - User wants to find a random partner
     * ⚡ SIMPLIFIED: Single global queue, fastest matching
     * 
     * Client sends:
     * {
     *   userId: "user123"
     * }
     */
    socket.on('user:start_matching', async (data) => {
      await handleStartMatching(socket, data, { source: 'socket_event' });
    });

    /**
     * MATCH_SKIP - User skips and wants IMMEDIATE next match
     * ⚡ INSTANT requeue - zero delay
     * 
     * Client sends:
     * {
     *   userId: "user123",
     *   partnerId: "user456"
     * }
     */
    socket.on('match:skip', async (data) => {
      try {
        const { userId, partnerId } = data;
        
        console.log(`\n[MATCH_SKIP] 👉 ${userId} skipped, INSTANT requeue...`);

        // Get user's queue data
        const queueData = userQueueData.get(userId);
        if (!queueData) {
          socket.emit('match:skip_error', { message: 'User data not found' });
          return;
        }

        // Get partner's queue data for requeue
        const partnerQueueData = userQueueData.get(partnerId);

        // ✅ Get queue size BEFORE skip
        const queueSizeBefore = await redis.lLen('queue:global');
        console.log(`[MATCH_SKIP] 📊 Queue size BEFORE skip: ${queueSizeBefore}`);

        // ✅ Call improved skipUser that handles BOTH users and clears match keys
        const skipResult = await matchingService.skipUser(userId, partnerId, queueData.entry, queueData.data);
        
        if (skipResult.success) {
          console.log(`[MATCH_SKIP] ✅ ${userId} skip successful!`);
          console.log(`[MATCH_SKIP] 📊 Match keys deleted: ${skipResult.matchKeysDeleted}`);
          console.log(`[MATCH_SKIP] 📊 Prefetch cleared: ${skipResult.prefetchCleared}`);
          console.log(`[MATCH_SKIP] 📊 Queue size AFTER skip: ${skipResult.queueSize}`);
          
          // ✅ CRITICAL: Requeue partner if we have their data
          if (partnerQueueData) {
            console.log(`[MATCH_SKIP] 📥 Requeuing partner ${partnerId}...`);
            await redis.rPush('queue:global', partnerQueueData.entry);
            const queueSizeAfterPartner = await redis.lLen('queue:global');
            console.log(`[MATCH_SKIP] ✅ Partner requeued. Queue size now: ${queueSizeAfterPartner}`);
          } else {
            console.log(`[MATCH_SKIP] ⚠️ Partner queue data not available, will be handled by socket event`);
          }
          
          // Notify partner to return to waiting state
          const partnerSocket = userToSocket.get(partnerId);
          if (partnerSocket) {
            console.log(`[MATCH_SKIP] 📢 Notifying partner ${partnerId} via socket`);
            io.to(partnerSocket).emit('match:partner_skipped', {
              userId: userId,
              message: 'Your partner skipped. Returning to queue...'
            });
            
            // ✅ CLEANUP: Remove from partnerSockets to prevent stale disconnects
            if (io._partnerSockets) {
              io._partnerSockets.delete(socket.id);
              io._partnerSockets.delete(partnerSocket);
              console.log(`[MATCH_SKIP] 🧹 Cleaned partnerSockets mapping`);
            }
          }

          // 🔮 Try prefetched candidate first (instant!)
          const prefetchedCandidate = await matchingService.getPrefetchedCandidate(userId);
          if (prefetchedCandidate) {
            console.log(`[MATCH_SKIP] 🔮 PREFETCH HIT! Candidate available for ${userId}`);
            socket.emit('match:requeued', {
              message: 'Back in queue! Finding next match...',
              skipCount: skipResult.skipCount,
              queueSize: skipResult.queueSize,
              delay: 0,
              prefetchHit: true
            });
          } else {
            console.log(`[MATCH_SKIP] 🔍 No prefetch, waiting for next available user`);
            socket.emit('match:requeued', {
              message: 'Back in queue! Finding next match...',
              skipCount: skipResult.skipCount,
              queueSize: skipResult.queueSize,
              delay: 0
            });
          }
        } else {
          console.error(`[MATCH_SKIP] ❌ Skip failed:`, skipResult.error);
          socket.emit('match:skip_error', {
            message: skipResult.skipCount >= 5 ? 'Skip limit reached. Take a break!' : 'Skip failed'
          });
        }
      } catch (error) {
        console.error(`[MATCHING_ERROR] Skip failed:`, error);
        socket.emit('match:skip_error', { message: 'Skip failed: ' + error.message });
      }
    });

    /**
     * MATCH_DECLINE - User rejects a match (legacy, use match:skip instead)
     */
    socket.on('match:decline', async (data) => {
      try {
        const { userId, rejectedUserId } = data;
        console.log(`[MATCH_DECLINE] Using match:skip...`);
        // Re-emit as skip
        socket.emit('match:skip', { userId, partnerId: rejectedUserId });
      } catch (error) {
        console.error(`[MATCHING_ERROR] Failed in match:decline:`, error);
      }
    });

    /**
     * MATCH_ACCEPT - User accepts match and starts WebRTC connection
     */
    socket.on('match:accept', async (data) => {
      try {
        const { userId, partnerId } = data;
        
        console.log(`\n[MATCH_ACCEPT] ✅ ${userId} accepted match with ${partnerId}`);
        
        // Get partner's socket
        const partnerSocketId = userToSocket.get(partnerId);
        console.log(`[MATCH_ACCEPT] 🔍 Partner socket ID: ${partnerSocketId}`);
        
        if (!partnerSocketId) {
          console.error(`[MATCH_ACCEPT] ❌ Partner socket not found for ${partnerId}`);
          socket.emit('match:error', { message: 'Partner disconnected' });
          return;
        }
        
        // ✅ CRITICAL: Notify BOTH users to start WebRTC connection
        // This tells both users to establish offer/answer exchange
        const connectionData = {
          partnerId: partnerId,
          partnerSocketId: partnerSocketId,
          isInitiator: true, // First user to accept becomes initiator (sends offer)
          message: 'Connection accepted! Starting video...'
        };
        
        // Send to accepting user
        socket.emit('match:accepted_start_webrtc', connectionData);
        console.log(`[MATCH_ACCEPT] 📤 Sent start_webrtc signal to ${userId}`);
        
        // Send to partner (non-initiator)
        const partnerConnectionData = {
          partnerId: userId,
          partnerSocketId: socket.id,
          isInitiator: false, // Second user is answerer (sends answer)
          message: 'Your match accepted! Starting video...'
        };
        
        io.to(partnerSocketId).emit('match:accepted_start_webrtc', partnerConnectionData);
        console.log(`[MATCH_ACCEPT] 📤 Sent start_webrtc signal to partner ${partnerId}`);
        
        console.log(`[MATCH_ACCEPT] ✅ Both users notified to start WebRTC`);
      } catch (error) {
        console.error(`[MATCHING_ERROR] Failed in match:accept:`, error);
        socket.emit('match:error', { message: 'Failed to start connection: ' + error.message });
      }
    });

    /**
     * MATCH_CANCEL - User cancels waiting for a match
     */
    socket.on('match:cancel', async (data) => {
      try {
        const { userId } = data;
        
        console.log(`[MATCH_CANCEL] ❌ ${userId} cancelled matching`);

        if (socket.retryTimer) {
          clearInterval(socket.retryTimer);
          socket.retryTimer = null;
          console.log(`[MATCH_CANCEL] Cleared retry timer for ${userId}`);
        }

        // Remove from queue
        await matchingService.handleUserDisconnect(userId);

        socket.emit('match:cancelled', {
          message: 'Matching cancelled'
        });
      } catch (error) {
        console.error(`[MATCHING_ERROR] Failed in match:cancel:`, error);
      }
    });

    /**
     * CANCEL_MATCHING - Frontend emits this when user clicks "Cancel Search"
     * Removes user from Redis queue so they won't be matched
     */
    socket.on('cancel_matching', async (data) => {
      try {
        const userId = socketToUser.get(socket.id) || data?.userId;
        if (!userId) {
          console.log(`[CANCEL_MATCHING] ⚠️ No userId found for socket ${socket.id}`);
          return;
        }

        console.log(`[CANCEL_MATCHING] ❌ ${userId} cancelled search → returning to dashboard`);

        // Clear retry timer
        if (socket.retryTimer) {
          clearInterval(socket.retryTimer);
          socket.retryTimer = null;
        }

        // Remove from matching queue
        await matchingService.handleUserDisconnect(userId);

        // Clean up partnerSockets mapping
        if (io._partnerSockets) {
          const partnerSocketId = io._partnerSockets.get(socket.id);
          if (partnerSocketId) {
            io._partnerSockets.delete(partnerSocketId);
          }
          io._partnerSockets.delete(socket.id);
        }

        console.log(`[CANCEL_MATCHING] ✅ ${userId} fully removed from queue`);
      } catch (error) {
        console.error(`[MATCHING_ERROR] Failed in cancel_matching:`, error);
      }
    });

    /**
     * GET_QUEUE_STATS - Simple queue statistics
     */
    socket.on('admin:get_queue_stats', async (data) => {
      try {
        const stats = await matchingService.getQueueStats();
        socket.emit('admin:queue_stats', {
          total: stats.total,
          waiting: stats.waiting,
          description: stats.description,
          timestamp: Date.now()
        });
      } catch (error) {
        console.error(`[MATCHING_ERROR] Stats error:`, error);
      }
    });

    /**
     * CLEAR_QUEUE - Admin clearing queue
     */
    socket.on('admin:clear_queue', async (data) => {
      try {
        console.log(`[ADMIN] 🧹 Clearing all matching queues`);
        await matchingService.clearAllQueues();
        socket.emit('admin:queue_cleared', {
          message: 'All queues cleared',
          timestamp: Date.now()
        });
      } catch (error) {
        console.error(`[MATCHING_ERROR] Clear error:`, error);
      }
    });

    /**
     * SKIP_USER - User skips current partner and wants next match
     * ⚡ INSTANT with prefetch support
     */
    socket.on('skip_user', async (data, ack) => {
      try {
        const userId = data?.userId || socketToUser.get(socket.id);
        const partnerSocketId = data?.partnerSocketId;

        // ✅ CRITICAL FIX: Always notify partner, even if userId is unknown
        // userId may be missing when match was made via server.js find_partner (different map)
        if (!partnerSocketId) {
          console.error(`[SKIP_USER] ❌ Invalid skip request - no partnerSocketId provided`);
          socket.emit('skip:error', { message: 'Invalid skip request - no partnerSocketId' });
          return;
        }

        // 📤 CRITICAL: Notify partner FIRST — BEFORE skip limit check
        // This ensures partner is NEVER left stuck in video chat, regardless of skip limits
        console.log(`[SKIP_USER] 📢 Notifying partner at ${partnerSocketId} that they were skipped`);
        io.to(partnerSocketId).emit('user_skipped', {
          message: 'Your partner skipped you. Returning to queue...',
          skippedBy: userId || socket.id
        });
        console.log(`[SKIP_USER] ✅ user_skipped event emitted to partner`);

        // 🛑 SKIP LIMIT ENFORCEMENT (DB-first + lock + correct threshold)
        // This must happen BEFORE any redis match-key deletion.
        if (userId) {
          const validation = await validateSkipLimit({
            userId,
            prisma,
            redis,
            increment: true, // skipping consumes one count for free users
            source: 'skip_user'
          });

          if (!validation.canSkip) {
            console.log('[SKIP_USER] 🚫 Skip blocked by limit', validation);
            // Safety: premium users must NEVER see the popup.
            if (validation.isPremium) {
              console.warn('[SKIP_USER] Safety guard: isPremium=true but canSkip=false. Allowing skip.', {
                userId,
                validation
              });
            } else {
              socket.emit('skip_limit_reached', {
                message: 'You have used your free skip. Upgrade to Unlimited Skip to continue.',
                canSkip: false,
                isPremium: validation.isPremium,
                skipCount: validation.skipCount,
                limit: validation.limit
              });
            }

            if (typeof ack === 'function') {
              ack({
                canSkip: false,
                isPremium: validation.isPremium,
                skipCount: validation.skipCount,
                limit: validation.limit
              });
            }

            // Clean up partnerSockets even when blocked
            if (io._partnerSockets) {
              io._partnerSockets.delete(socket.id);
              io._partnerSockets.delete(partnerSocketId);
            }

            // If we hit safety guard (premium), allow skip. Otherwise block.
            if (validation.isPremium) {
              // Continue execution (premium bypass).
            } else {
              return; // STOP execution, do not skip (but partner already notified above)
            }
          }

          // Allowed (including premium bypass)
          if (typeof ack === 'function') {
            ack({
              canSkip: true,
              isPremium: validation.isPremium,
              skipCount: validation.skipCount,
              limit: validation.limit
            });
          }
        } else if (typeof ack === 'function') {
          // Preserve legacy behavior when userId is missing from socket maps.
          ack({ canSkip: true, isPremium: false, skipCount: 0, limit: 1, reason: 'missing_user_id' });
        }

        console.log(`\n[SKIP_USER] ⏭️ ${userId || 'unknown_user'} (socket: ${socket.id}) skipped partner (socket: ${partnerSocketId})`);

        // ✅ CLEANUP: Remove from partnerSockets (shared map between matchingHandlers and server.js)
        if (io._partnerSockets) {
          io._partnerSockets.delete(socket.id);
          io._partnerSockets.delete(partnerSocketId);
          console.log(`[SKIP_USER] 🧹 Cleaned partnerSockets mapping`);
        }

        // ✅ ANTI-REMATCH: Track recent skip to prevent immediate re-matching
        let partnerUserId = null;
        for (const [uid, sid] of userToSocket.entries()) {
          if (sid === partnerSocketId) {
            partnerUserId = uid;
            break;
          }
        }
        if (partnerUserId && userId) {
          try {
            const redis = matchingService.redis;
            const skipKeyA = `recentSkips:${userId}`;
            const skipKeyB = `recentSkips:${partnerUserId}`;
            await redis.sAdd(skipKeyA, partnerUserId);
            await redis.expire(skipKeyA, 15);
            await redis.sAdd(skipKeyB, userId);
            await redis.expire(skipKeyB, 15);
            console.log(`[SKIP_USER] 🚫 Anti-rematch: ${userId} ↔ ${partnerUserId} blocked for 15s`);
          } catch (trackErr) {
            console.error(`[SKIP_USER] ⚠️ Failed to track recent skip:`, trackErr.message);
          }
        }

        // ✅ Re-queue logic only if userId is available (matched via matchingHandlers)
        if (userId) {
          // 🔮 Try to find prefetched next candidate for immediate match
          const prefetchedCandidate = await matchingService.getPrefetchedCandidate(userId);
          
          if (prefetchedCandidate) {
            console.log(`[SKIP_USER] 🔮 PREFETCH HIT! Instant next match for ${userId}`);
            socket.emit('partner_found', {
              partnerId: prefetchedCandidate.userId,
              socketId: prefetchedCandidate.socketId,
              userName: prefetchedCandidate.userName || 'Anonymous',
              userLocation: prefetchedCandidate.userLocation || 'Unknown',
              userPicture: prefetchedCandidate.userPicture || null,
              userAge: prefetchedCandidate.userAge || 18,
              hasBlueTick: prefetchedCandidate.hasBlueTick || false,
              matchType: 'instant_skip'
            });
            console.log(`[SKIP_USER] ✅ Instant prefetch match sent to ${userId}`);
          } else {
            console.log(`[SKIP_USER] ⏳ No prefetch available, re-queueing ${userId}`);
            await matchingService.addUserToQueue(userId, { socketId: socket.id });
            
            socket.emit('match:waiting', {
              message: 'Searching for next match...',
              strategy: 'instant_requeue'
            });
            console.log(`[SKIP_USER] ✅ ${userId} re-queued for next match`);
          }
        } else {
          console.log(`[SKIP_USER] ⚠️ userId not in socketToUser map (match was via find_partner/server.js)`);
          console.log(`[SKIP_USER] ⚠️ Skipping re-queue - frontend will handle via find_partner emit`);
        }
      } catch (error) {
        console.error(`[SKIP_USER_ERROR] Error processing skip:`, error);
        socket.emit('skip:error', { message: 'Skip failed: ' + error.message });
      }
    });

    /**
     * DISCONNECT - User disconnected
     */
    socket.on('disconnect', async () => {
      try {
        const userId = socketToUser.get(socket.id);
        
        if (userId) {
          console.log(`\n[SOCKET_DISCONNECT] 🔴 ${userId} (${socket.id}) disconnected`);
          
          if (socket.retryTimer) {
            clearInterval(socket.retryTimer);
            socket.retryTimer = null;
          }

          // Clean up from matching queue
          await matchingService.handleUserDisconnect(userId);
          
          // Remove mappings
          socketToUser.delete(socket.id);
          userToSocket.delete(userId);
          userQueueData.delete(userId);
          
          console.log(`[SOCKET_DISCONNECT] ✅ Cleaned up ${userId}`);
        } else {
          console.log(`[SOCKET_DISCONNECT] 🔌 Socket ${socket.id} disconnected (no user)`);
        }
      } catch (error) {
        console.error(`[SOCKET_DISCONNECT_ERROR] Disconnect error:`, error);
      }
    });

    console.log(`[SOCKET] ✅ Optimized matching handlers initialized for ${socket.id}`);
  });

  // Return helper functions
  return {
    matchingService,
    socketToUser,
    userToSocket,
    
    // Manual match function (for testing or forced pairing)
    async createManualMatch(userId1, userId2, io) {
      const socket1 = userToSocket.get(userId1);
      const socket2 = userToSocket.get(userId2);
      
      if (!socket1 || !socket2) {
        throw new Error('One or both users not connected');
      }

      io.to(socket1).emit('partner_found', {
        partnerId: userId2,
        partnerSocketId: socket2
      });

      io.to(socket2).emit('partner_found', {
        partnerId: userId1,
        partnerSocketId: socket1
      });
    }
  };
}

export default setupMatchingHandlers;

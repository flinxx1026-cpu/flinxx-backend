/**
 * GestureEffects.jsx — v7
 * -----------------------
 * Fixes:
 *  - Socket listener uses polling interval to detect when socket becomes available
 *  - MediaPipe scripts preload immediately on mount (before partner connect)
 *  - Hearts spawn FROM hand position
 *  - Heart priority over kiss (kiss only with exactly 1 hand)
 *  - Receiver gets bigger + glow hearts
 *  - 1-hand wide fallback for overlapping hands
 */
import React, { useRef, useEffect } from 'react';

// ─── constants ──────────────────────────────────────────────────────
const DETECTION_INTERVAL_MS = 150;
const HEART_COOLDOWN_MS = 2500;
const KISS_COOLDOWN_MS = 2500;
const PARTICLE_LIFETIME_MS = 2200;
const HEART_FRAMES_NEEDED = 2;
const HEART_PROXIMITY_THRESHOLD = 0.40;
const HEART_MAX_Y = 0.75;
const SINGLE_HAND_WIDTH_THRESHOLD = 0.35;
const SINGLE_HAND_HEART_MAX_Y = 0.40; // single-hand heart only triggers above this Y (above face)

// ─── Particle ───────────────────────────────────────────────────────
class Particle {
  constructor(emoji, x, y, opts = {}) {
    this.emoji = emoji;
    this.x = x; this.y = y;
    this.startX = x; this.startY = y;
    this.born = performance.now();
    this.lifetime = PARTICLE_LIFETIME_MS + Math.random() * 600;
    const sizeBoost = opts.receiver ? 12 : 0;
    this.size = 28 + Math.random() * 24 + sizeBoost;
    this.vx = (Math.random() - 0.5) * 2.5;
    this.vy = -(2 + Math.random() * 2.5);
    this.rotation = (Math.random() - 0.5) * 0.4;
    this.wobbleAmp = 15 + Math.random() * 15;
    this.wobbleFreq = 2 + Math.random() * 2;
    this.receiver = opts.receiver || false;
  }
  get progress() { return Math.min(1, (performance.now() - this.born) / this.lifetime); }
  get alive() { return this.progress < 1; }
  update() {
    const t = this.progress;
    const ease = 1 - t * t;
    this.x = this.startX + this.vx * (performance.now() - this.born) * 0.03
           + Math.sin(t * Math.PI * this.wobbleFreq) * this.wobbleAmp * ease;
    this.y = this.startY + this.vy * (performance.now() - this.born) * 0.06;
  }
  draw(ctx) {
    const t = this.progress;
    let alpha = 1;
    if (t < 0.1) alpha = t / 0.1;
    else if (t > 0.7) alpha = (1 - t) / 0.3;
    const scale = 0.4 + 0.6 * Math.sin(t * Math.PI);
    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation * Math.sin(t * Math.PI * 3));
    ctx.font = `${this.size * (0.8 + scale * 0.4)}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const glowIntensity = this.receiver ? 28 : 18;
    ctx.shadowColor = this.emoji === '❤️' ? 'rgba(255,50,80,0.6)' : 'rgba(255,100,150,0.6)';
    ctx.shadowBlur = glowIntensity;
    ctx.fillText(this.emoji, 0, 0);
    if (this.receiver && this.emoji === '❤️') {
      ctx.shadowBlur = 40;
      ctx.shadowColor = 'rgba(255,30,60,0.4)';
      ctx.globalAlpha = Math.max(0, alpha * 0.5);
      ctx.fillText(this.emoji, 0, 0);
    }
    ctx.restore();
  }
}

// ─── helpers ────────────────────────────────────────────────────────
function landmarkDist(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + ((a.z || 0) - (b.z || 0)) ** 2);
}
function palmCenter(lm) {
  const w = lm[0], m = lm[9];
  return { x: (w.x + m.x) / 2, y: (w.y + m.y) / 2, z: ((w.z || 0) + (m.z || 0)) / 2 };
}
function detectSingleHandHeart(landmarks) {
  let minX = 1, maxX = 0, minY = 1, maxY = 0;
  for (const lm of landmarks) {
    if (lm.x < minX) minX = lm.x;
    if (lm.x > maxX) maxX = lm.x;
    if (lm.y < minY) minY = lm.y;
    if (lm.y > maxY) maxY = lm.y;
  }
  return (maxX - minX) > SINGLE_HAND_WIDTH_THRESHOLD && ((minY + maxY) / 2) < SINGLE_HAND_HEART_MAX_Y;
}

// ─── CDN script loader (deduplicated) ───────────────────────────────
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src; s.crossOrigin = 'anonymous';
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

// Preload MediaPipe scripts as early as possible (module-level, runs once)
let scriptsLoaded = false;
let scriptsLoadingPromise = null;
function preloadMediaPipeScripts() {
  if (scriptsLoaded) return Promise.resolve();
  if (scriptsLoadingPromise) return scriptsLoadingPromise;
  console.log('🚀 [GESTURE] Preloading MediaPipe scripts...');
  scriptsLoadingPromise = (async () => {
    await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');
    await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js');
    await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js');
    scriptsLoaded = true;
    console.log('✅ [GESTURE] MediaPipe scripts preloaded!');
  })();
  return scriptsLoadingPromise;
}

// Start preloading immediately when this module is imported
preloadMediaPipeScripts().catch(e => console.warn('⚠️ MediaPipe preload failed:', e));

// ─── Component ──────────────────────────────────────────────────────
const GestureEffects = ({ localStreamRef, isActive = true, socketRef }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);
  const mountedRef = useRef(true);
  const lastHeartRef = useRef(0);
  const lastKissRef = useRef(0);
  const heartFrameCountRef = useRef(0);
  const prevWristPositions = useRef({});
  const resultCountRef = useRef(0);
  const socketCurrent = useRef(null);
  const socketListenerAttached = useRef(false);

  // Kiss state machine refs
  const kissPhaseRef = useRef('IDLE'); // IDLE → NEAR_MOUTH → BLOWING
  const kissNearMouthTimeRef = useRef(0); // timestamp when hand first entered mouth zone
  const kissHandSnapshotRef = useRef(null); // hand position when near mouth (for tracking outward motion)
  const KISS_MOUTH_ZONE = { xMin: 0.20, xMax: 0.80, yMin: 0.20, yMax: 0.65 };
  const KISS_BLOW_WINDOW_MS = 800; // must blow within this time after mouth proximity

  // ─── Spawn functions ───
  function doSpawnHearts(receiver, handX, handY) {
    const now = performance.now();
    if (now - lastHeartRef.current < HEART_COOLDOWN_MS) return;
    lastHeartRef.current = now;
    const canvas = canvasRef.current;
    if (!canvas || canvas.width === 0 || canvas.height === 0) return;
    const spawnX = (1 - handX) * canvas.width;
    const spawnY = handY * canvas.height;
    const count = receiver ? 10 : 8;
    const spread = receiver ? 70 : 50;
    for (let i = 0; i < count; i++) {
      particlesRef.current.push(new Particle('❤️',
        spawnX + (Math.random() - 0.5) * spread,
        spawnY + (Math.random() - 0.5) * (spread * 0.5),
        { receiver }
      ));
    }
    console.log(receiver
      ? '💖💖 [GESTURE] Hearts from PARTNER! 💖💖'
      : `💖💖 [GESTURE] Hearts at (${handX.toFixed(2)},${handY.toFixed(2)}) 💖💖`);
  }

  function doSpawnKisses(receiver) {
    const now = performance.now();
    if (now - lastKissRef.current < KISS_COOLDOWN_MS) return;
    lastKissRef.current = now;
    const canvas = canvasRef.current;
    if (!canvas || canvas.width === 0 || canvas.height === 0) return;
    const cx = canvas.width * 0.3 + Math.random() * canvas.width * 0.4;
    const cy = canvas.height * 0.35;
    for (let i = 0; i < 5; i++) {
      particlesRef.current.push(new Particle('💋',
        cx + (Math.random() - 0.5) * 120,
        cy + (Math.random() - 0.5) * 60,
        { receiver }
      ));
    }
    console.log('💋 [GESTURE] Kiss spawned!');
  }

  // ─── Socket listener: poll until socket is available, then attach ───
  useEffect(() => {
    let gestureHandler = null;
    let pollTimer = null;

    const attachListener = () => {
      const sock = socketRef?.current;
      if (!sock || socketListenerAttached.current) return false;

      gestureHandler = (data) => {
        console.log('📩 [GESTURE] Received from partner:', data?.type);
        if (data?.type === 'heart') {
          doSpawnHearts(true, data?.handX ?? 0.5, data?.handY ?? 0.35);
        } else if (data?.type === 'kiss') {
          doSpawnKisses(true);
        }
      };

      sock.on('gesture_effect', gestureHandler);
      socketListenerAttached.current = true;
      socketCurrent.current = sock;
      console.log('✅ [GESTURE] Socket listener ATTACHED for gesture_effect!');
      return true;
    };

    // Try immediately
    if (!attachListener()) {
      // Poll every 500ms until socket is available
      console.log('⏳ [GESTURE] Socket not ready, polling...');
      pollTimer = setInterval(() => {
        if (attachListener()) {
          clearInterval(pollTimer);
          pollTimer = null;
        }
      }, 500);
    }

    return () => {
      if (pollTimer) clearInterval(pollTimer);
      const sock = socketRef?.current;
      if (sock && gestureHandler) {
        sock.off('gesture_effect', gestureHandler);
      }
      socketListenerAttached.current = false;
    };
  }, []);

  // ─── Sync socketCurrent ref continuously ───
  useEffect(() => {
    socketCurrent.current = socketRef?.current || null;
  });

  // ─── Animation loop ───
  useEffect(() => {
    mountedRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const animate = () => {
      if (!mountedRef.current) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const alive = [];
      for (const p of particlesRef.current) {
        p.update();
        if (p.alive) { p.draw(ctx); alive.push(p); }
      }
      particlesRef.current = alive;
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      mountedRef.current = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // ─── DETECTION PIPELINE ───
  useEffect(() => {
    if (!isActive) return;

    let cancelled = false;
    let hiddenVideo = null;
    let hands = null;

    const run = async () => {
      // ── STEP 1: Wait for preloaded scripts ──
      console.log('🚀 [GESTURE] STEP 1: Waiting for MediaPipe scripts...');
      try {
        await preloadMediaPipeScripts();
        console.log('✅ [GESTURE] STEP 1 done (scripts ready)');
      } catch (e) {
        console.error('❌ [GESTURE] Scripts failed:', e);
        return;
      }
      if (cancelled) return;

      // ── STEP 2: Init Hands ──
      if (!window.Hands) { console.error('❌ [GESTURE] window.Hands missing!'); return; }
      console.log('🚀 [GESTURE] STEP 2: Creating Hands...');
      try {
        hands = new window.Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });
        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 0,
          minDetectionConfidence: 0.35,
          minTrackingConfidence: 0.25
        });
        hands.onResults((results) => {
          if (cancelled) return;
          resultCountRef.current++;
          const numHands = results.multiHandLandmarks?.length || 0;
          if (resultCountRef.current % 20 === 1) {
            console.log(`🤚 [GESTURE] #${resultCountRef.current}: ${numHands} hand(s)`);
          }

          // ═══ HEART (Priority 1) ═══
          let heartDone = false;

          if (numHands >= 2) {
            const p1 = palmCenter(results.multiHandLandmarks[0]);
            const p2 = palmCenter(results.multiHandLandmarks[1]);
            const dist = landmarkDist(p1, p2);
            const ok = dist < HEART_PROXIMITY_THRESHOLD && p1.y < HEART_MAX_Y && p2.y < HEART_MAX_Y;
            if (ok) {
              heartFrameCountRef.current++;
              if (heartFrameCountRef.current >= HEART_FRAMES_NEEDED) {
                const mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2;
                doSpawnHearts(false, mx, my);
                try {
                  const s = socketCurrent.current || socketRef?.current;
                  if (s) s.emit('gesture_effect', { type: 'heart', handX: mx, handY: my });
                } catch (e) { /**/ }
                heartFrameCountRef.current = 0;
                heartDone = true;
              }
            } else {
              heartFrameCountRef.current = 0;
            }
          } else if (numHands === 1 && detectSingleHandHeart(results.multiHandLandmarks[0])) {
            heartFrameCountRef.current++;
            if (heartFrameCountRef.current >= HEART_FRAMES_NEEDED) {
              const cp = palmCenter(results.multiHandLandmarks[0]);
              doSpawnHearts(false, cp.x, cp.y);
              try {
                const s = socketCurrent.current || socketRef?.current;
                if (s) s.emit('gesture_effect', { type: 'heart', handX: cp.x, handY: cp.y });
              } catch (e) { /**/ }
              heartFrameCountRef.current = 0;
              heartDone = true;
            }
          } else {
            heartFrameCountRef.current = 0;
          }

          // ═══ KISS (Priority 2 — 2-Phase: mouth proximity → blow outward) ═══
          // Runs with ANY number of hands, as long as heart was NOT triggered
          if (!heartDone && numHands >= 1) {
            // Find the hand closest to mouth zone center (y~0.4, x~0.5)
            let bestHand = results.multiHandLandmarks[0];
            if (numHands >= 2) {
              const tip0 = results.multiHandLandmarks[0][8];
              const tip1 = results.multiHandLandmarks[1][8];
              const dist0 = Math.abs(tip0.y - 0.4) + Math.abs(tip0.x - 0.5);
              const dist1 = Math.abs(tip1.y - 0.4) + Math.abs(tip1.x - 0.5);
              bestHand = dist0 < dist1 ? results.multiHandLandmarks[0] : results.multiHandLandmarks[1];
            }

            const indexTip = bestHand[8];
            const now = performance.now();
            const tipX = indexTip.x;
            const tipY = indexTip.y;
            const tipZ = indexTip.z || 0;

            const isNearMouth = (
              tipX > KISS_MOUTH_ZONE.xMin && tipX < KISS_MOUTH_ZONE.xMax &&
              tipY > KISS_MOUTH_ZONE.yMin && tipY < KISS_MOUTH_ZONE.yMax
            );

            if (kissPhaseRef.current === 'IDLE') {
              if (isNearMouth) {
                kissPhaseRef.current = 'NEAR_MOUTH';
                kissNearMouthTimeRef.current = now;
                kissHandSnapshotRef.current = { x: tipX, y: tipY, z: tipZ };
                console.log('💋 [KISS] Phase 1: Hand near mouth!');
              }
            } else if (kissPhaseRef.current === 'NEAR_MOUTH') {
              const elapsed = now - kissNearMouthTimeRef.current;
              const snap = kissHandSnapshotRef.current;

              if (elapsed > KISS_BLOW_WINDOW_MS) {
                kissPhaseRef.current = 'IDLE';
                kissHandSnapshotRef.current = null;
              } else if (!isNearMouth && snap) {
                const dy = tipY - snap.y;
                const dz = snap.z - tipZ;
                const dx = Math.abs(tipX - 0.5) - Math.abs(snap.x - 0.5);

                const isBlowing = (dy > 0.02 || dz > 0.008 || dx > 0.015);

                if (isBlowing) {
                  console.log(`💋 [KISS] BLOW TRIGGERED! dy=${dy.toFixed(3)} dz=${dz.toFixed(3)} dx=${dx.toFixed(3)}`);
                  doSpawnKisses(false);
                  try {
                    const s = socketCurrent.current || socketRef?.current;
                    if (s) s.emit('gesture_effect', { type: 'kiss' });
                  } catch (e) { /**/ }
                  kissPhaseRef.current = 'IDLE';
                  kissHandSnapshotRef.current = null;
                }
              } else if (isNearMouth && snap) {
                kissHandSnapshotRef.current = { x: tipX, y: tipY, z: tipZ };
              }
            }
          } else if (numHands === 0) {
            // Only reset kiss state when NO hands visible
            kissPhaseRef.current = 'IDLE';
            kissHandSnapshotRef.current = null;
          }
        });
        console.log('✅ [GESTURE] STEP 2 done');
      } catch (e) {
        console.error('❌ [GESTURE] Hands init error:', e);
        return;
      }

      // ── STEP 3: Wait for camera ──
      console.log('🚀 [GESTURE] STEP 3: Waiting for camera...');
      for (let i = 0; i < 60 && !cancelled; i++) {
        const s = localStreamRef?.current;
        if (s) { const vt = s.getVideoTracks()[0]; if (vt && vt.readyState === 'live') break; }
        await new Promise(r => setTimeout(r, 500));
      }
      if (cancelled) return;
      if (!localStreamRef?.current?.getVideoTracks()[0]) {
        console.error('❌ [GESTURE] No camera stream after 30s');
        return;
      }
      console.log('✅ [GESTURE] STEP 3 done');

      // ── STEP 4: Hidden video ──
      console.log('🚀 [GESTURE] STEP 4: Hidden video...');
      const vt = localStreamRef.current.getVideoTracks()[0];
      hiddenVideo = document.createElement('video');
      hiddenVideo.setAttribute('playsinline', '');
      hiddenVideo.setAttribute('muted', '');
      hiddenVideo.muted = true;
      hiddenVideo.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:320px;height:240px;opacity:0;pointer-events:none;';
      document.body.appendChild(hiddenVideo);
      hiddenVideo.srcObject = new MediaStream([vt]);
      try { await hiddenVideo.play(); } catch (e) { console.warn('play warn:', e.message); }
      for (let i = 0; i < 50; i++) { if (hiddenVideo.readyState >= 2) break; await new Promise(r => setTimeout(r, 100)); }
      if (hiddenVideo.readyState < 2) { console.error('❌ Video not ready'); return; }
      console.log(`✅ [GESTURE] STEP 4 done (${hiddenVideo.videoWidth}x${hiddenVideo.videoHeight})`);

      // ── STEP 5: Warmup (retry 3x) ──
      console.log('🚀 [GESTURE] STEP 5: Model warmup...');
      for (let a = 1; a <= 3; a++) {
        try { await hands.send({ image: hiddenVideo }); console.log(`✅ Warmup ok (attempt ${a})`); break; }
        catch (e) { console.warn(`⚠️ Warmup attempt ${a}:`, e.message); await new Promise(r => setTimeout(r, 1000)); }
      }

      // ── STEP 6: Detection loop ──
      console.log('🚀🚀🚀 [GESTURE] STEP 6: DETECTION RUNNING! 🚀🚀🚀');
      while (!cancelled) {
        try {
          if (hiddenVideo && hiddenVideo.readyState >= 2 && hands) {
            await hands.send({ image: hiddenVideo });
          }
        } catch (e) { /* frame error, continue */ }
        await new Promise(r => setTimeout(r, DETECTION_INTERVAL_MS));
      }
    };

    run().catch(e => console.error('❌ [GESTURE] Pipeline crash:', e));

    return () => {
      cancelled = true;
      if (hiddenVideo) { hiddenVideo.srcObject = null; hiddenVideo.remove(); }
    };
  }, [isActive]);

  // ─── Resize canvas ───
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const p = canvas.parentElement;
      if (p) { canvas.width = p.offsetWidth; canvas.height = p.offsetHeight; }
    };
    resize();
    const obs = new ResizeObserver(resize);
    if (canvas.parentElement) obs.observe(canvas.parentElement);
    window.addEventListener('resize', resize);
    return () => { obs.disconnect(); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        zIndex: 25
      }}
    />
  );
};

export default GestureEffects;

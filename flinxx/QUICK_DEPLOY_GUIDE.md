# 🚀 QUICK DEPLOYMENT & MONITORING

## Deploy in 2 Commands

```bash
# 1️⃣ Start everything
cd /path/to/flinxx
docker-compose -f config/docker-compose.yml up -d

# 2️⃣ Verify all running
docker-compose ps
```

Expected output:
```
NAME              STATUS
flinxx-redis      Up 10 seconds (healthy)
flinxx-backend    Up 5 seconds
flinxx-frontend   Up 3 seconds
```

---

## Monitoring Commands

### 🟢 Redis Health
```bash
# Is Redis working?
docker exec flinxx-redis redis-cli ping
# Response: PONG

# How much memory used?
docker exec flinxx-redis redis-cli INFO memory | grep used_memory_human

# How many users in queue?
docker exec flinxx-redis redis-cli ZCARD queue:global

# Recent operations
docker exec flinxx-redis redis-cli INFO stats
```

### 🟢 Matching Performance
```bash
# Check queue stats via API
curl http://localhost:5000/queue-stats

# View real-time logs
docker-compose logs -f backend

# Check specific user session
curl http://localhost:5000/debug/user/[userId]

# View all Redis keys
docker exec flinxx-redis redis-cli KEYS "*"
```

### 🟢 Server Health
```bash
# CPU & Memory usage
docker stats flinxx-redis --no-stream

# Container logs (errors)
docker logs flinxx-redis --tail 50

# Disk space
df -h | grep docker

# Network connections
netstat -an | grep 6379
```

---

## Production Checklists

### 🔄 Daily Checklist
```bash
# 1. Redis running?
docker exec flinxx-redis redis-cli ping
# ✅ Should output: PONG

# 2. Memory under control?
docker exec flinxx-redis redis-cli INFO memory | grep used_memory_human
# ✅ Should be < 450MB (below 512MB limit)

# 3. Backend connected?
curl http://localhost:5000/health
# ✅ Should output: OK

# 4. Check for errors
docker logs flinxx-backend --tail 20 | grep -i error
# ✅ Should be empty or no critical errors
```

### 📊 Weekly Performance Audit
```bash
# Peak hour analysis
date
watch -n 5 'docker exec flinxx-redis redis-cli INFO stats | grep total_commands_processed'

# Memory trend
docker exec flinxx-redis redis-cli INFO memory

# Eviction check (should be 0 or very low)
docker exec flinxx-redis redis-cli INFO stats | grep evicted_keys
# ✅ Low number means users' matches not being auto-removed

# Connection quality
curl http://localhost:5000/server-stats
```

---

## Emergency Procedures

### 🚨 Restart Everything
```bash
# Stop all services
docker-compose -f config/docker-compose.yml down

# Remove old data (if needed)
docker-compose -f config/docker-compose.yml down -v

# Start fresh
docker-compose -f config/docker-compose.yml up -d
```

### 🚨 Clear Queue (Remove All Waiting Users)
```bash
# CAUTION: This will disconnect all searching users

# Clear the queue
docker exec flinxx-redis redis-cli FLUSHDB

# Or specific key
docker exec flinxx-redis redis-cli DEL queue:global
```

### 🚨 Reset Redis Memory Stats
```bash
# If you think memory is leaking
docker exec flinxx-redis redis-cli CONFIG SET maxmemory-policy noeviction
docker exec flinxx-redis redis-cli CONFIG SET maxmemory-policy allkeys-lru
```

---

## System Limits to Avoid

### ⚠️ Redis Memory
```
Current: 512MB limit
Max before eviction: 450MB used
Action: Monitor weekly, optimize if approaching 400MB used

To increase limit:
1. Edit config/docker-compose.yml
2. Change: --maxmemory 1gb (for 1GB)
3. Rebuild: docker-compose build --no-cache
4. Restart: docker-compose up -d
```

### ⚠️ Database Connections
```
Current: ~100 concurrent connections
If hitting limit:
- Add connection pool config
- Or increase database max_connections
```

### ⚠️ Network Bandwidth
```
Current: For 1000 concurrent users
- WebRTC: ~1-3 Mbps per call (peer-to-peer)
- Server signaling: ~10 Kbps per user
- Total required: ~50 Mbps for 1000 concurrent calls
```

---

## Auto-Monitoring Setup (Optional)

### Using crontab for Health Checks
```bash
# Edit crontab
crontab -e

# Add this line to check every 5 minutes
*/5 * * * * docker exec flinxx-redis redis-cli ping > /tmp/redis-health.log 2>&1 || docker restart flinxx-redis

# Add this line to check memory every hour
0 * * * * docker exec flinxx-redis redis-cli INFO memory >> /var/log/redis-memory.log
```

### Using Prometheus (Advanced)
```bash
# Install prometheus exporter for Redis
docker run -d \
  --name redis-exporter \
  -p 9121:9121 \
  oliver006/redis_exporter \
  --redis-addr=redis://flinxx-redis:6379
```

---

## Performance Tuning

### If Matching is Slow (> 100ms)
```bash
# 1. Check Redis latency
docker exec flinxx-redis redis-cli LATENCY DOCTOR

# 2. Check Lua scripts are loaded
docker exec flinxx-redis redis-cli SCRIPT LOAD
# Should show 3 hashes

# 3. Profile Lua script
docker exec flinxx-redis redis-cli --latency-sampling 5

# 4. Increase Redis priority
docker update --memory-reservation 256m flinxx-redis

# 5. Use RDB (faster snapshots)
# Already enabled: appendonly yes
```

### If Memory is Growing
```bash
# 1. Check what keys are taking space
docker exec flinxx-redis redis-cli --bigkeys

# 2. Check if TTL is working
docker exec flinxx-redis redis-cli TTL queue:global
# Should show TTL in seconds (negative if no TTL)

# 3. Manually trigger eviction
docker exec flinxx-redis redis-cli DEBUG OBJECT queue:global

# 4. Check eviction stats
docker exec flinxx-redis redis-cli INFO stats | grep evicted
```

---

## Useful One-Liners

```bash
# ✅ Redis stats every 2 seconds
watch -n 2 'docker exec flinxx-redis redis-cli INFO stats'

# ✅ Queue size in real-time
watch 'docker exec flinxx-redis redis-cli ZCARD queue:global'

# ✅ Memory usage graph
docker exec flinxx-redis redis-cli --stat --interval 1

# ✅ Connection count
docker exec flinxx-redis redis-cli DBSIZE

# ✅ Slowest commands
docker exec flinxx-redis redis-cli SLOWLOG GET 10

# ✅ Find old/unused keys (run at low traffic)
docker exec flinxx-redis redis-cli KEYS "waiting:*" | wc -l

# ✅ Check replication (if used)
docker exec flinxx-redis redis-cli INFO replication

# ✅ View AOF file size (persistence)
docker exec flinxx-redis ls -lh /data/appendonly.aof
```

---

## Log Tracking

### View Logs
```bash
# Last 100 lines
docker-compose logs backend --tail 100

# Follow real-time
docker-compose logs -f backend

# Filter for errors
docker-compose logs backend | grep -i error

# Filter for matches
docker-compose logs backend | grep -i "match"

# Show last 1 hour
docker-compose logs --since 1h backend
```

### Save Logs for Analysis
```bash
# Save to file
docker-compose logs backend > backend-logs.txt

# Save with timestamp
docker-compose logs backend > backend-logs-$(date +%Y%m%d-%H%M%S).txt

# Archive old logs
tar -czf backend-logs-archive-$(date +%Y%m).tar.gz backend-logs-*.txt
```

---

## Expected Metrics at Different Scales

### Small Scale (10-50 users)
```
Memory used:     ~50-80MB (Redis uses ~10MB per 50 users)
Match latency:   < 50ms
CPU usage:       < 5%
Connections:     10-15
Status:          ✅ OPTIMAL
```

### Medium Scale (100-500 users)
```
Memory used:     ~100-200MB
Match latency:   50-150ms
CPU usage:       10-30%
Connections:     100-150
Status:          ✅ GOOD
```

### Large Scale (1000+ users)
```
Memory used:     ~300-450MB (under 512MB limit)
Match latency:   < 100ms (still fast!)
CPU usage:       40-60%
Connections:     400-500
Status:          ✅ ACCEPTABLE (consider Redis Cluster)
```

---

## Before/After Deployment

### Before Going Live
```bash
# ✅ All services running
docker-compose ps

# ✅ Redis health check passes
docker exec flinxx-redis redis-cli PING

# ✅ Memory limits set
docker exec flinxx-redis redis-cli CONFIG GET maxmemory

# ✅ STUN servers configured
grep -r "stun:" backend/

# ✅ Database connected
curl http://localhost:5000/health

# ✅ No critical errors in logs
docker logs flinxx-backend | grep -i "error" | wc -l
# Should be 0 or very low
```

### Post-Launch Monitoring
```
Hour 1:  Watch for connection issues
Hour 4:  Check sustained match latency
Day 1:   Monitor memory growth
Week 1:  Analyze performance metrics
Month 1: Review and optimize
```

---

## 📞 Quick Reference Card

```
Service Ports:
- Frontend:   http://localhost:3000
- Backend:    http://localhost:5000
- Redis:      localhost:6379

Key Endpoints:
- Health:     GET /health
- Queue:      GET /queue-stats
- Debug:      GET /debug/user/[userId]

Redis Commands Cheat Sheet:
- Keys total:        DBSIZE
- Clear queue:       DEL queue:global
- View queue:        ZRANGE queue:global 0 -1
- Memory info:       INFO memory
- Stats:             INFO stats
- Slowlog:           SLOWLOG GET 10
- Flush all:         FLUSHALL (⚠️ destructive)

Docker Commands:
- Logs:              docker-compose logs -f backend
- Stats:             docker stats
- Exec:              docker exec flinxx-redis [command]
- Restart:           docker-compose restart
- Rebuild:           docker-compose build --no-cache
```

---

**Status: ✅ Production Ready**

All systems configured and monitored. System auto-recovers from failures via health checks and auto-restart policies.


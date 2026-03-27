/**
 * ReceivedGestureEffects.jsx
 * ─────────────────────────
 * Render-only canvas that shows gesture effects RECEIVED from the partner.
 * Placed INSIDE the remote video panel so hearts/kisses appear over the partner's video.
 */
import React, { useRef, useEffect } from 'react';

const PARTICLE_LIFETIME_MS = 2200;
const HEART_COOLDOWN_MS = 2500;
const KISS_COOLDOWN_MS = 2500;

class Particle {
  constructor(emoji, x, y, opts = {}) {
    this.emoji = emoji;
    this.x = x; this.y = y;
    this.startX = x; this.startY = y;
    this.born = performance.now();
    this.lifetime = PARTICLE_LIFETIME_MS + Math.random() * 600;
    const sizeBoost = 12; // always receiver style (bigger)
    this.size = 28 + Math.random() * 24 + sizeBoost;
    this.vx = (Math.random() - 0.5) * 2.5;
    this.vy = -(2 + Math.random() * 2.5);
    this.rotation = (Math.random() - 0.5) * 0.4;
    this.wobbleAmp = 15 + Math.random() * 15;
    this.wobbleFreq = 2 + Math.random() * 2;
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
    ctx.shadowColor = this.emoji === '❤️' ? 'rgba(255,50,80,0.6)' : 'rgba(255,100,150,0.6)';
    ctx.shadowBlur = 28;
    ctx.fillText(this.emoji, 0, 0);
    if (this.emoji === '❤️') {
      ctx.shadowBlur = 40;
      ctx.shadowColor = 'rgba(255,30,60,0.4)';
      ctx.globalAlpha = Math.max(0, alpha * 0.5);
      ctx.fillText(this.emoji, 0, 0);
    }
    ctx.restore();
  }
}

const ReceivedGestureEffects = ({ socketRef }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);
  const mountedRef = useRef(true);
  const lastHeartRef = useRef(0);
  const lastKissRef = useRef(0);
  const socketListenerAttached = useRef(false);

  function doSpawnHearts(handX, handY) {
    const now = performance.now();
    if (now - lastHeartRef.current < HEART_COOLDOWN_MS) return;
    lastHeartRef.current = now;
    const canvas = canvasRef.current;
    if (!canvas || canvas.width === 0 || canvas.height === 0) return;
    // NOTE: Do NOT mirror (no 1-handX) because this is the remote panel — partner's perspective
    const spawnX = handX * canvas.width;
    const spawnY = handY * canvas.height;
    for (let i = 0; i < 10; i++) {
      particlesRef.current.push(new Particle('❤️',
        spawnX + (Math.random() - 0.5) * 70,
        spawnY + (Math.random() - 0.5) * 35
      ));
    }
    console.log('💖💖 [RECEIVED] Hearts from PARTNER on REMOTE panel! 💖💖');
  }

  function doSpawnKisses() {
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
        cy + (Math.random() - 0.5) * 60
      ));
    }
    console.log('💋 [RECEIVED] Kiss from PARTNER on REMOTE panel!');
  }

  // ─── Socket listener ───
  useEffect(() => {
    let gestureHandler = null;
    let pollTimer = null;

    const attachListener = () => {
      const sock = socketRef?.current;
      if (!sock || socketListenerAttached.current) return false;

      gestureHandler = (data) => {
        console.log('📩 [RECEIVED] Gesture from partner:', data?.type);
        if (data?.type === 'heart') {
          doSpawnHearts(data?.handX ?? 0.5, data?.handY ?? 0.35);
        } else if (data?.type === 'kiss') {
          doSpawnKisses();
        }
      };

      sock.on('gesture_effect', gestureHandler);
      socketListenerAttached.current = true;
      console.log('✅ [RECEIVED] Socket listener ATTACHED on REMOTE panel!');
      return true;
    };

    if (!attachListener()) {
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

export default ReceivedGestureEffects;

'use client';
import { useEffect, useRef } from 'react';

export default function Starfield() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const c = canvasRef.current;
    function draw() {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
      const ctx = c.getContext('2d');
      const n = Math.floor((c.width * c.height) / 10000);
      for (let i = 0; i < n; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * c.width, Math.random() * c.height, Math.random() * 0.9 + 0.15, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.22 + 0.04})`;
        ctx.fill();
      }
    }
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, []);
  return (
    <canvas ref={canvasRef} style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 1, mixBlendMode: 'screen'
    }} />
  );
}

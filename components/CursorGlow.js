'use client';
import { useEffect, useRef } from 'react';

export default function CursorGlow({ color = 'rgba(79,142,247,0.06)' }) {
  const glowRef = useRef(null);
  useEffect(() => {
    const g = glowRef.current;
    const handler = (e) => {
      g.style.left = e.clientX + 'px';
      g.style.top = e.clientY + 'px';
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);
  return (
    <div ref={glowRef} style={{
      position: 'fixed', pointerEvents: 'none', zIndex: 9998,
      width: '360px', height: '360px', borderRadius: '50%',
      background: `radial-gradient(circle, ${color} 0%, transparent 68%)`,
      transform: 'translate(-50%,-50%)',
      transition: 'left 0.09s linear, top 0.09s linear',
      top: '-300px', left: '-300px', mixBlendMode: 'screen'
    }} />
  );
}

'use client';
import { useEffect } from 'react';

export default function ClickFlash({ color = 'rgba(79,142,247,0.55)' }) {
  useEffect(() => {
    const handler = (e) => {
      const f = document.createElement('div');
      f.style.cssText = `
        position: fixed; pointer-events: none; z-index: 9999999;
        border-radius: 50%; transform: translate(-50%, -50%);
        background: radial-gradient(circle, rgba(255,255,255,0.95) 0%, ${color} 22%, transparent 70%);
        left: ${e.clientX}px; top: ${e.clientY}px;
        width: 0; height: 0;
        animation: clickFlash 0.55s cubic-bezier(0.22,1,0.36,1) forwards;
      `;
      document.body.appendChild(f);
      setTimeout(() => f.remove(), 580);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);
  return null;
}

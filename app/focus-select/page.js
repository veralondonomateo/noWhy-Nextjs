'use client';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Starfield from '../../components/Starfield';
import CursorGlow from '../../components/CursorGlow';
import ClickFlash from '../../components/ClickFlash';

export default function FocusSelectPage() {
  const router = useRouter();
  const [overlayActive, setOverlayActive] = useState(false);
  const transitioning = useRef(false);

  function selectMode(mode) {
    if (transitioning.current) return;
    transitioning.current = true;
    sessionStorage.setItem('noWhy_mode', mode);
    setOverlayActive(true);
    setTimeout(() => {
      router.push('/focus-timer');
    }, 340);
  }

  return (
    <>
      <Starfield />
      <CursorGlow />
      <ClickFlash />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --accent:  #4f8ef7;
          --accent2: #a259ff;
          --dark:    #000000;
          --white:   #ffffff;
        }
        html, body {
          height: 100%;
          background: var(--dark);
          color: var(--white);
          font-family: 'Inter', sans-serif;
          font-weight: 300;
          overflow: hidden;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .transition-overlay {
          position: fixed;
          inset: 0;
          background: var(--dark);
          z-index: 99999;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.32s ease;
        }
        .transition-overlay.active {
          opacity: 1;
          pointer-events: all;
        }
        .page {
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px 6vw;
          position: relative;
          overflow: hidden;
        }
        .page::before {
          content: '';
          position: absolute;
          top: -30%;
          left: 50%;
          transform: translateX(-50%);
          width: 70vw;
          height: 70vw;
          background: radial-gradient(circle, rgba(79,142,247,0.055) 0%, transparent 65%);
          pointer-events: none;
        }
        .logo {
          position: absolute;
          top: 32px;
          left: 6vw;
          text-decoration: none;
          opacity: 0;
          animation: fadeIn 0.6s 0.1s ease forwards;
        }
        .logo img { height: 22px; width: auto; }
        .header {
          text-align: center;
          margin-bottom: clamp(28px, 4vh, 52px);
          opacity: 0;
          animation: fadeUp 0.85s 0.22s ease forwards;
        }
        h1 {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: clamp(2.8rem, 6.5vw, 5.5rem);
          letter-spacing: -0.04em;
          line-height: 1;
          color: var(--white);
          margin-bottom: 14px;
        }
        .subtitle {
          font-family: 'Inter', sans-serif;
          font-weight: 300;
          font-size: clamp(0.84rem, 1.3vw, 0.98rem);
          color: rgba(255,255,255,0.42);
          letter-spacing: 0.01em;
        }
        .cards {
          display: flex;
          gap: clamp(14px, 2vw, 28px);
          width: 100%;
          max-width: 860px;
          opacity: 0;
          animation: fadeUp 0.85s 0.42s ease forwards;
        }
        .card {
          flex: 1;
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          aspect-ratio: 3/4;
          max-height: calc(100vh - 250px);
          border: 1px solid rgba(255,255,255,0.07);
          transition: transform 0.35s cubic-bezier(0.23,1,0.32,1), box-shadow 0.35s ease;
          outline: none;
          background: none;
          padding: 0;
        }
        .card:focus-visible { box-shadow: 0 0 0 2px var(--accent); }
        .card:hover { transform: translateY(-8px) scale(1.015); }
        .card-work:hover {
          box-shadow:
            0 24px 64px rgba(79,142,247,0.28),
            0 0 0 1px rgba(79,142,247,0.22);
        }
        .card-study:hover {
          box-shadow:
            0 24px 64px rgba(162,89,255,0.28),
            0 0 0 1px rgba(162,89,255,0.22);
        }
        .card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 25%;
          display: block;
          transition: transform 0.55s cubic-bezier(0.23,1,0.32,1);
        }
        .card:hover img { transform: scale(1.05); }
        .card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(0,0,0,0.38)  0%,
            rgba(0,0,0,0.18)  30%,
            rgba(0,0,0,0.32)  60%,
            rgba(0,0,0,0.72)  85%,
            rgba(0,0,0,0.90) 100%
          );
          transition: background 0.35s ease;
        }
        .card-work:hover .card-overlay {
          background: linear-gradient(
            180deg,
            rgba(4,12,36,0.42)  0%,
            rgba(4,12,36,0.22)  30%,
            rgba(8,24,70,0.36)  60%,
            rgba(8,28,80,0.74)  85%,
            rgba(8,28,80,0.92) 100%
          );
        }
        .card-study:hover .card-overlay {
          background: linear-gradient(
            180deg,
            rgba(20,4,48,0.42)  0%,
            rgba(20,4,48,0.22)  30%,
            rgba(40,6,88,0.36)  60%,
            rgba(50,8,100,0.74) 85%,
            rgba(50,8,100,0.92) 100%
          );
        }
        .card-label {
          position: absolute;
          bottom: 26px;
          left: 0;
          right: 0;
          text-align: center;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: clamp(1rem, 1.8vw, 1.35rem);
          letter-spacing: 0.01em;
          color: var(--white);
          text-shadow: 0 2px 12px rgba(0,0,0,0.5);
        }
        .card.selected::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 20px;
          background: rgba(255,255,255,0.06);
        }
        @media (max-width: 600px) {
          html, body { overflow: auto; }
          .page { height: auto; min-height: 100vh; padding: 88px 5vw 48px; }
          .cards { flex-direction: column; max-width: 380px; }
          .card { aspect-ratio: 16/10; max-height: none; }
        }
      `}</style>

      <div className={`transition-overlay${overlayActive ? ' active' : ''}`}></div>

      <div className="page">
        <Link className="logo" href="/"><img src="/noWhy.png" alt="noWhy" /></Link>

        <div className="header">
          <h1>Empecemos</h1>
          <p className="subtitle">En qué te gustaría enfocarte hoy</p>
        </div>

        <div className="cards">
          <button
            className="card card-work"
            onClick={() => selectMode('trabajar')}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectMode('trabajar'); } }}
            tabIndex={0}
            role="button"
            aria-label="Seleccionar modo Trabajar"
          >
            <img src={`/ChatGPT%20Image%2024%20feb%202026%2C%2012_45_29%20p.m.%201.jpg`} alt="Persona trabajando con laptop y auriculares" />
            <div className="card-overlay"></div>
            <div className="card-label">Trabajar</div>
          </button>

          <button
            className="card card-study"
            onClick={() => selectMode('estudiar')}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectMode('estudiar'); } }}
            tabIndex={0}
            role="button"
            aria-label="Seleccionar modo Estudiar"
          >
            <img src={`/24%20feb%202026%2C%2012_46_29%20p.m.%201.jpg`} alt="Persona estudiando con libros y auriculares" />
            <div className="card-overlay"></div>
            <div className="card-label">Estudiar</div>
          </button>
        </div>
      </div>
    </>
  );
}

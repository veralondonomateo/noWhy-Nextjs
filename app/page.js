'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import Starfield from '../components/Starfield';
import CursorGlow from '../components/CursorGlow';
import ClickFlash from '../components/ClickFlash';
import './home.css';

export default function Home() {
  useEffect(() => {
    const statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;
    let animated = false;
    const items = [
      { el: statsSection.querySelectorAll('.stat-number')[0], target: 250, suffix: '%', decimals: 0 },
      { el: statsSection.querySelectorAll('.stat-number')[1], target: 18,  suffix: 'K', decimals: 0 },
      { el: statsSection.querySelectorAll('.stat-number')[2], target: 4.9, suffix: '',  decimals: 1 },
      { el: statsSection.querySelectorAll('.stat-number')[3], target: 60,  suffix: 's', decimals: 0 },
    ];
    function animateCount(item) {
      const duration = 1600;
      const start = performance.now();
      function step(now) {
        const t = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        const val = item.target * ease;
        item.el.textContent = (item.decimals ? val.toFixed(1) : Math.round(val)) + item.suffix;
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !animated) {
        animated = true;
        items.forEach(item => animateCount(item));
      }
    }, { threshold: 0.4 });
    observer.observe(statsSection);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Starfield />
      <CursorGlow />
      <ClickFlash />

      <nav>
        <Link className="logo" href="/"><img src="/noWhy.png" alt="noWhy" /></Link>
        <div className="nav-actions">
          <Link href="/waitlist" className="btn-nav-outline">Lista de espera</Link>
          <Link href="/register" className="btn-nav">Empieza gratis</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-eyebrow">Música · Enfoque · Pomodoro</div>
        <h1>
          <span className="h1-thin">Tu modo foco,</span>
          <span className="h1-bold">activado.</span>
        </h1>
        <p className="hero-subtitle">Música científica que activa tu cerebro cuando más lo necesitas. Binaural beats combinados con la técnica Pomodoro.</p>
        <div className="hero-cta">
          <Link href="/waitlist" className="btn-primary">Unirme a la lista de espera</Link>
          <a href="#features" className="btn-text">
            Ver cómo funciona
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </section>

      <hr className="section-divider" />

      <section className="features-section" id="features">
        <div className="section-eyebrow">Características</div>
        <div className="section-title">Todo lo que necesitas para entrar en zona</div>
        <div className="cards-grid">
          <div className="card"><div className="card-num">01</div><div className="card-title">Ondas binaurales</div><p className="card-body">Frecuencias alpha y theta sincronizadas para inducir estados de concentración profunda en minutos.</p></div>
          <div className="card"><div className="card-num">02</div><div className="card-title">Timer Pomodoro integrado</div><p className="card-body">Ciclos de 25 minutos de enfoque + 5 de descanso. La música se adapta automáticamente a cada fase.</p></div>
          <div className="card"><div className="card-num">03</div><div className="card-title">Estadísticas de sesión</div><p className="card-body">Visualiza tu progreso diario, racha de sesiones y el tiempo total en estado de hiperfoco.</p></div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item"><div className="stat-number">0%</div><div className="stat-label">Aumento en productividad</div></div>
          <div className="stat-item"><div className="stat-number">0K</div><div className="stat-label">Usuarios activos</div></div>
          <div className="stat-item"><div className="stat-number">0</div><div className="stat-label">Valoración media</div></div>
          <div className="stat-item"><div className="stat-number">0s</div><div className="stat-label">Para entrar en modo foco</div></div>
        </div>
      </section>

      <section className="how-section" id="how">
        <div className="section-eyebrow">Cómo funciona</div>
        <div className="section-title">4 pasos para activar tu modo foco</div>
        <div className="steps">
          <div className="step"><div className="step-num">01</div><div className="step-title">Elige tu tarea</div><p className="step-body">Indica qué tipo de trabajo vas a realizar: estudio, código, escritura o diseño. noWhy se adapta.</p></div>
          <div className="step"><div className="step-num">02</div><div className="step-title">Activa la música</div><p className="step-body">En menos de 60 segundos las ondas binaurales sincronizan tu cerebro al estado óptimo de concentración.</p></div>
          <div className="step"><div className="step-num">03</div><div className="step-title">Trabaja en ciclos</div><p className="step-body">El timer Pomodoro guía tus sesiones. La música cambia automáticamente entre foco y descanso.</p></div>
          <div className="step"><div className="step-num">04</div><div className="step-title">Analiza tu progreso</div><p className="step-body">Al finalizar, ve tus estadísticas: tiempo en foco, ciclos completados y racha semanal.</p></div>
        </div>
      </section>

      <section className="cta-section" id="cta">
        <div className="section-eyebrow">Empieza ahora</div>
        <div className="section-title">Tu cerebro está listo para el siguiente nivel</div>
        <Link href="/waitlist" className="btn-primary">Unirme a la lista de espera</Link>
      </section>

      <footer>
        <div className="footer-logo"><img src="/noWhy.png" alt="noWhy" /></div>
        <div className="footer-copy">© 2026 noWhy · Todos los derechos reservados</div>
      </footer>
    </>
  );
}

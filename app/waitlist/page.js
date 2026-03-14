'use client';
import { useState, useEffect } from 'react';
import CursorGlow from '../../components/CursorGlow';
import ClickFlash from '../../components/ClickFlash';

const SHEET_URL = 'https://script.google.com/a/macros/grupomsm.co/s/AKfycbzukOIXF2z97UkuSZC0rhncnPYmkH3Vl5RDEMSzuuVE3XqK4iSF7uRc7runE5eJWz6QDg/exec';

const FOCUS_SVG = (
  <svg width="522" height="121" viewBox="0 0 522 121" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_wl_nav)">
      <path d="M13.0948 14.3295V53.6677H66.0447V66.5371H13.0948V118.718H0V1.64929H73.9504V14.3295H13.0948Z" fill="white"/>
      <path d="M145.402 120.394C137.088 120.394 129.4 118.907 122.363 115.933C115.327 112.959 109.214 108.795 103.971 103.415C98.7275 98.0347 94.6795 91.6811 91.8269 84.3542C88.9471 77.0273 87.5344 68.9974 87.5344 60.2646C87.5344 51.5318 88.9743 43.5019 91.8269 36.175C94.7067 28.8481 98.7547 22.4675 103.971 17.0331C109.214 11.5988 115.327 7.40808 122.363 4.43406C129.4 1.46003 137.061 -0.0269775 145.402 -0.0269775C153.742 -0.0269775 161.566 1.46003 168.603 4.43406C175.639 7.40808 181.752 11.5988 186.995 17.0331C192.239 22.4675 196.287 28.8481 199.139 36.175C202.019 43.5019 203.432 51.5318 203.432 60.2646C203.432 68.9974 201.992 76.8651 199.139 84.192C196.26 91.5189 192.212 97.8996 186.995 103.334C181.752 108.768 175.639 112.959 168.603 115.933C161.566 118.907 153.851 120.394 145.402 120.394ZM145.402 107.471C151.813 107.471 157.736 106.335 163.196 104.037C168.657 101.739 173.357 98.4673 177.296 94.2226C181.236 89.9778 184.306 84.949 186.479 79.1902C188.653 73.4314 189.766 67.1319 189.766 60.2917C189.766 53.4514 188.68 46.9897 186.479 41.2309C184.279 35.4721 181.209 30.4703 177.296 26.1985C173.357 21.9538 168.657 18.6283 163.196 16.3031C157.736 13.9509 151.813 12.7884 145.402 12.7884C138.99 12.7884 133.067 13.9509 127.607 16.3031C122.146 18.6553 117.446 21.9538 113.507 26.1985C109.567 30.4433 106.525 35.4721 104.406 41.2309C102.259 46.9897 101.2 53.3433 101.2 60.2917C101.2 67.2401 102.259 73.4044 104.406 79.1902C106.552 84.949 109.567 89.9778 113.507 94.2226C117.446 98.4673 122.146 101.739 127.607 104.037C133.067 106.335 138.99 107.471 145.402 107.471Z" fill="white"/>
      <path d="M275.236 120.394C266.787 120.394 258.99 118.907 251.899 115.933C244.781 112.959 238.641 108.741 233.452 103.307C228.263 97.8725 224.242 91.4378 221.362 84.0298C218.483 76.6218 217.043 68.5378 217.043 59.778C217.043 51.0181 218.483 43.2045 221.362 35.9587C224.242 28.7129 228.317 22.3864 233.615 16.925C238.913 11.4906 245.053 7.29994 252.062 4.37999C259.044 1.46004 266.732 6.10352e-05 275.073 6.10352e-05C280.588 6.10352e-05 286.076 0.865232 291.482 2.62261C296.889 4.35295 301.887 6.75921 306.452 9.78731C311.016 12.8154 314.765 16.3031 317.699 20.2234L308.571 29.6592C305.745 26.2796 302.512 23.3867 298.845 20.8993C295.177 18.439 291.319 16.5194 287.244 15.1676C283.196 13.8158 279.121 13.1398 275.073 13.1398C268.743 13.1398 262.875 14.3024 257.387 16.6005C251.926 18.8986 247.199 22.116 243.26 26.2796C239.32 30.4433 236.25 35.3639 234.05 41.0957C231.849 46.8274 230.762 53.0459 230.762 59.778C230.762 66.5101 231.849 73.134 234.05 78.9739C236.25 84.8138 239.402 89.8426 243.531 94.0333C247.661 98.251 252.497 101.495 258.093 103.794C263.69 106.092 269.911 107.254 276.784 107.254C280.832 107.254 284.908 106.659 288.956 105.497C293.004 104.334 296.726 102.658 300.122 100.522C303.517 98.3862 306.37 95.98 308.761 93.2763L315.526 104.226C312.918 107.362 309.467 110.147 305.12 112.553C300.774 114.96 296.019 116.879 290.83 118.285C285.641 119.691 280.452 120.394 275.263 120.394H275.236Z" fill="white"/>
      <path d="M377.332 120.394C368.476 120.394 360.57 118.42 353.642 114.446C346.687 110.499 341.226 105.01 337.26 98.0617C333.293 91.0863 331.283 83.2186 331.283 74.4047V2.13589H344.405V72.8906C344.405 79.4605 345.872 85.3816 348.779 90.6267C351.686 95.8718 355.652 99.9813 360.624 103.009C365.596 106.01 371.192 107.525 377.332 107.525C383.825 107.525 389.639 106.01 394.719 103.009C399.827 100.008 403.821 95.8718 406.728 90.6267C409.635 85.3816 411.102 79.4876 411.102 72.8906V2.13589H423.707V74.3777C423.707 83.1916 421.724 91.0863 417.731 98.0347C413.764 105.01 408.249 110.472 401.267 114.419C394.258 118.366 386.27 120.367 377.305 120.367L377.332 120.394Z" fill="white"/>
      <path d="M480.325 120.394C474.348 120.394 468.751 119.556 463.454 117.88C458.156 116.203 453.32 113.689 448.946 110.309C444.572 106.957 440.687 102.82 437.291 97.8725L446.392 87.7878C451.69 95.277 457.096 100.549 462.666 103.577C468.235 106.605 474.511 108.119 481.493 108.119C486.546 108.119 491.165 107.281 495.321 105.605C499.478 103.929 502.738 101.577 505.102 98.5484C507.465 95.5203 508.634 92.0596 508.634 88.1393C508.634 85.5708 508.199 83.2727 507.357 81.245C506.515 79.2172 505.238 77.4328 503.553 75.8647C501.869 74.2966 499.777 72.8907 497.305 71.674C494.832 70.4304 491.98 69.3219 488.774 68.3215C485.568 67.3211 482.009 66.2938 478.07 65.2934C472.338 63.9416 467.312 62.3464 462.965 60.5079C458.645 58.6694 454.977 56.3984 451.989 53.6947C449.001 51.0181 446.746 47.9089 445.251 44.3671C443.73 40.8523 442.969 36.6616 442.969 31.8491C442.969 27.0366 443.947 23.0082 445.931 19.0879C447.887 15.1676 450.631 11.788 454.108 8.9221C457.585 6.05622 461.715 3.86626 466.415 2.29814C471.142 0.730015 476.195 -0.0540466 481.602 -0.0540466C487.687 -0.0540466 493.094 0.757051 497.875 2.37925C502.657 4.00144 506.895 6.38066 510.617 9.51691C514.339 12.6532 517.545 16.4112 520.234 20.7641L510.943 29.8214C508.579 26.1174 505.917 22.9271 502.928 20.2504C499.94 17.5738 496.68 15.519 493.148 14.1131C489.616 12.7072 485.704 12.0043 481.412 12.0043C476.467 12.0043 472.093 12.8424 468.344 14.5187C464.595 16.1949 461.634 18.5201 459.487 21.4941C457.341 24.4681 456.281 27.8477 456.281 31.6599C456.281 34.4446 456.798 36.9591 457.803 39.122C458.808 41.3119 460.411 43.2045 462.612 44.8267C464.812 46.4489 467.665 47.9089 471.224 49.1796C474.755 50.4773 479.021 51.667 483.965 52.8025C489.806 54.1543 495.077 55.7765 499.75 57.6691C504.423 59.5616 508.416 61.8327 511.731 64.4553C515.045 67.0778 517.572 70.1329 519.31 73.6207C521.049 77.0814 521.919 81.0557 521.919 85.5438C521.919 92.4922 520.18 98.5484 516.675 103.766C513.198 108.985 508.335 113.04 502.086 115.933C495.838 118.853 488.557 120.286 480.243 120.286L480.325 120.394Z" fill="white"/>
    </g>
    <defs>
      <clipPath id="clip0_wl_nav">
        <rect width="522" height="120.394" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

export default function WaitlistPage() {
  const [nameVal, setNameVal] = useState('');
  const [emailVal, setEmailVal] = useState('');
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function isValidEmail(email) {
    if (!email || email.includes(' ')) return false;
    const atIdx = email.indexOf('@');
    if (atIdx < 1) return false;
    const domain = email.slice(atIdx + 1);
    const dotIdx = domain.lastIndexOf('.');
    if (dotIdx < 1) return false;
    return domain.slice(dotIdx + 1).length >= 2;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const name = nameVal.trim();
    const email = emailVal.trim();
    const nameOk = name.length >= 2;
    const emailOk = isValidEmail(email);
    setNameError(!nameOk);
    setEmailError(!emailOk);
    if (!nameOk || !emailOk) return;

    setSubmitting(true);

    fetch(SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ name, email, timestamp: new Date().toISOString() }),
      redirect: 'follow',
    }).catch(() => {});

    setTimeout(() => {
      setSuccess(true);
      setSubmitting(false);
    }, 900);
  }

  return (
    <>
      <CursorGlow color="rgba(0,207,255,0.06)" />
      <ClickFlash color="rgba(0,207,255,0.35)" />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg:     #000000;
          --white:  #ffffff;
          --cyan:   #ffffff;
          --gray-1: #777777;
          --gray-2: #444444;
          --border: rgba(255, 255, 255, 0.18);
          --border-dim: rgba(255,255,255,0.06);
        }
        body {
          background: var(--bg);
          color: var(--white);
          font-family: 'Space Mono', monospace;
          font-weight: 400;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        nav {
          flex-shrink: 0;
          padding: 22px 6vw;
          border-bottom: 1px solid var(--cyan);
          display: flex;
          align-items: center;
          justify-content: space-between;
          animation: fadeIn 0.7s ease both;
        }
        .logo { display: flex; align-items: center; }
        .logo svg { height: 28px; width: auto; display: block; }
        main {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 80px 6vw 60px;
          animation: fadeUp 0.8s 0.1s ease both;
        }
        .eyebrow {
          font-size: 0.68rem;
          font-weight: 400;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--gray-1);
          margin-bottom: 2.4rem;
        }
        h1 {
          font-family: 'Space Mono', monospace;
          line-height: 1.05;
          letter-spacing: -0.01em;
          margin-bottom: 3rem;
        }
        .h1-thin {
          display: block;
          font-weight: 400;
          font-size: clamp(36px, 7vw, 96px);
          color: var(--cyan);
          text-transform: uppercase;
        }
        .h1-bold {
          display: block;
          font-weight: 700;
          font-size: clamp(36px, 7vw, 96px);
          color: var(--cyan);
          text-transform: uppercase;
        }
        .form-block { max-width: 720px; }
        @media (max-width: 680px) { .br-desktop { display: none; } }
        .subtitle {
          font-family: 'Space Mono', monospace;
          font-size: 0.80rem;
          font-weight: 400;
          color: var(--gray-1);
          line-height: 1.85;
          margin-bottom: 2.4rem;
          max-width: 560px;
        }
        .form-container {
          border: 1px solid var(--cyan);
          border-radius: 2px;
          padding: 28px 28px 24px;
          margin-bottom: 1.2rem;
        }
        .form-label {
          font-size: 0.60rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--cyan);
          margin-bottom: 20px;
          display: block;
        }
        .form-row {
          display: flex;
          gap: 0;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 2px;
          overflow: hidden;
          transition: border-color 0.25s;
        }
        .form-row:focus-within { border-color: rgba(0,207,255,0.4); }
        .form-row input {
          flex: 1;
          background: transparent;
          border: none;
          border-right: 1px solid rgba(255,255,255,0.10);
          outline: none;
          color: var(--white);
          font-family: 'Space Mono', monospace;
          font-weight: 400;
          font-size: 0.78rem;
          padding: 16px 20px;
          letter-spacing: 0.02em;
          min-width: 0;
          transition: background 0.2s;
        }
        .form-row input:focus { background: rgba(0,207,255,0.03); }
        .form-row input::placeholder { color: var(--gray-2); }
        .btn-submit {
          flex-shrink: 0;
          font-family: 'Space Mono', monospace;
          font-weight: 700;
          font-size: 0.70rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--bg);
          background: var(--cyan);
          border: none;
          padding: 16px 26px;
          cursor: pointer;
          transition: opacity 0.2s, box-shadow 0.3s;
          white-space: nowrap;
        }
        .btn-submit:hover { opacity: 0.85; box-shadow: 0 0 28px rgba(0,207,255,0.25); }
        .btn-submit:disabled { opacity: 0.35; cursor: not-allowed; }
        .social-proof {
          font-size: 0.65rem;
          font-weight: 400;
          color: var(--gray-2);
          letter-spacing: 0.08em;
          display: flex;
          align-items: center;
          gap: 8px;
          padding-top: 4px;
        }
        .proof-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: var(--cyan);
          flex-shrink: 0;
        }
        .field-errors {
          display: flex;
          flex-wrap: wrap;
          gap: 0.15rem 1.4rem;
          min-height: 0.9rem;
          margin-top: 10px;
        }
        .field-error {
          font-size: 0.64rem;
          font-weight: 400;
          color: #ff5a5a;
          letter-spacing: 0.01em;
        }
        .success-state { animation: fadeUp 0.6s ease both; }
        .success-num {
          font-family: 'Space Mono', monospace;
          font-weight: 700;
          font-size: clamp(64px, 11vw, 150px);
          letter-spacing: -0.03em;
          color: var(--cyan);
          line-height: 1;
          margin-bottom: 0.4rem;
          text-shadow: 0 0 60px rgba(0,207,255,0.3);
        }
        .success-label {
          font-size: 0.72rem;
          font-weight: 400;
          color: var(--gray-1);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 2.8rem;
        }
        .success-msg {
          font-size: 0.78rem;
          font-weight: 400;
          color: var(--gray-1);
          line-height: 2;
          max-width: 400px;
          border-top: 1px solid var(--border);
          padding-top: 2rem;
        }
        footer {
          flex-shrink: 0;
          padding: 20px 6vw;
          border-top: 1px solid var(--cyan);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .footer-logo svg { height: 16px; width: auto; opacity: 0.30; }
        .footer-copy {
          font-family: 'Space Mono', monospace;
          font-size: 0.63rem;
          font-weight: 400;
          color: var(--gray-2);
          letter-spacing: 0.06em;
        }
        @media (max-width: 680px) {
          nav { padding: 18px 5vw; }
          .logo svg { height: 20px; }
          main { padding: 40px 5vw 48px; justify-content: flex-start; }
          .eyebrow { font-size: 0.58rem; letter-spacing: 0.18em; margin-bottom: 1.6rem; }
          h1 { margin-bottom: 2rem; line-height: 1.08; }
          .subtitle { font-size: 0.73rem; line-height: 1.9; margin-bottom: 2rem; max-width: 100%; }
          .form-block { max-width: 100%; }
          .form-container { padding: 18px 14px 14px; margin-bottom: 1rem; }
          .form-row { flex-direction: column; }
          .form-row input { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.10); padding: 15px 14px; font-size: 0.80rem; }
          .btn-submit { padding: 16px 14px; text-align: center; font-size: 0.72rem; width: 100%; }
          .field-errors { margin-top: 8px; }
          .social-proof { font-size: 0.60rem; }
          footer { padding: 16px 5vw; flex-direction: column; align-items: flex-start; gap: 10px; }
          .footer-logo { display: none; }
          .footer-copy { font-size: 0.58rem; }
        }
      `}</style>

      <nav>
        <span className="logo">{FOCUS_SVG}</span>
      </nav>

      <main>
        <div className="eyebrow">Inscripción · Gratis · Solo 50 cupos</div>

        <h1>
          <span className="h1-thin">Corre, toma café,</span>
          <span className="h1-bold">repite.</span>
        </h1>

        {!success ? (
          <div className="form-block">
            <p className="subtitle">
              4 km · Café · La Unión, Antioquia · 23 de marzo<br className="br-desktop" />
              {' '}Un coffee run para quienes quieren empezar a correr y para quienes ya no pueden dejar de hacerlo.
            </p>
            <div className="form-container">
              <span className="form-label">Formulario</span>
              <form className="form-row" onSubmit={handleSubmit} noValidate>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  autoComplete="off"
                  value={nameVal}
                  onChange={e => { setNameVal(e.target.value); if (e.target.value.trim().length >= 2) setNameError(false); }}
                  required
                />
                <input
                  type="email"
                  placeholder="Tu correo"
                  autoComplete="off"
                  value={emailVal}
                  onChange={e => { setEmailVal(e.target.value); if (isValidEmail(e.target.value.trim())) setEmailError(false); }}
                  required
                />
                <button className="btn-submit" type="submit" disabled={submitting}>
                  {submitting ? 'Guardando...' : 'Reservar mi lugar →'}
                </button>
              </form>
              <div className="field-errors">
                {nameError && <span className="field-error">El nombre debe tener al menos 2 caracteres</span>}
                {emailError && <span className="field-error">Ingresa un correo válido</span>}
              </div>
            </div>
            <div className="social-proof">
              <span className="proof-dot"></span>
              Quedan pocos cupos disponibles
            </div>
          </div>
        ) : (
          <div className="success-state">
            <div className="eyebrow" style={{ marginBottom: '1.8rem' }}>Cupo reservado</div>
            <div className="success-msg" style={{ borderTop: 'none', paddingTop: 0, maxWidth: '480px' }}>
              Gracias por inscribirte — te esperamos el<br />
              <strong style={{ color: '#fff' }}>23 de marzo a las 7:00 a.m.</strong><br /><br />
              Lleva tu ropa de running y muchas ganas.<br />
              Esperamos que lo disfrutes muchísimo.
            </div>
          </div>
        )}
      </main>

      <footer>
        <div className="footer-logo">{FOCUS_SVG}</div>
        <div className="footer-copy">© 2026 FOCUS — Todos los derechos reservados</div>
      </footer>
    </>
  );
}

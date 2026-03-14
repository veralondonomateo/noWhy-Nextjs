'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import Starfield from '../../components/Starfield';
import CursorGlow from '../../components/CursorGlow';
import ClickFlash from '../../components/ClickFlash';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errGoogle, setErrGoogle] = useState('');
  const [errEmail, setErrEmail] = useState('');
  const [errPassword, setErrPassword] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  function saveUserAndRedirect(user) {
    sessionStorage.setItem('noWhy_user', JSON.stringify({
      displayName: user.displayName || '',
      email: user.email || '',
      photoURL: user.photoURL || '',
    }));
    router.push('/focus-select');
  }

  function authErrorMsg(code) {
    const map = {
      'auth/user-not-found': 'No existe una cuenta con ese correo',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/invalid-credential': 'Correo o contraseña incorrectos',
      'auth/invalid-email': 'El correo electrónico no es válido',
      'auth/network-request-failed': 'Error de red. Comprueba tu conexión',
      'auth/too-many-requests': 'Demasiados intentos. Inténtalo más tarde',
      'auth/popup-closed-by-user': '',
      'auth/cancelled-popup-request': '',
    };
    return map[code] ?? 'Ocurrió un error inesperado. Inténtalo de nuevo';
  }

  function clearAllErrors() {
    setErrGoogle('');
    setErrEmail('');
    setErrPassword('');
  }

  async function handleGoogle() {
    clearAllErrors();
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      saveUserAndRedirect(result.user);
    } catch (err) {
      const msg = authErrorMsg(err.code);
      if (msg) setErrGoogle(msg);
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    clearAllErrors();
    if (!email) { setErrEmail('Ingresa tu correo electrónico'); return; }
    if (!password) { setErrPassword('Ingresa tu contraseña'); return; }
    setSubmitLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      saveUserAndRedirect(cred.user);
    } catch (err) {
      const msg = authErrorMsg(err.code);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-email') {
        setErrEmail(msg);
      } else {
        setErrPassword(msg);
      }
    } finally {
      setSubmitLoading(false);
    }
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
        body {
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 72px 72px;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .page {
          display: grid;
          grid-template-columns: 1fr 1fr;
          height: 100vh;
        }
        .left-panel {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px 7vw 60px 8vw;
          position: relative;
          background: var(--dark);
          overflow: hidden;
        }
        .left-panel::before {
          content: '';
          position: absolute;
          top: -10%; left: -20%;
          width: 70%; height: 70%;
          background: radial-gradient(circle, rgba(79,142,247,0.08) 0%, transparent 65%);
          pointer-events: none;
        }
        .left-panel::after {
          content: '';
          position: absolute;
          bottom: -80px; right: -80px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(162,89,255,0.05) 0%, transparent 60%);
          pointer-events: none;
        }
        .top-link {
          position: absolute;
          top: 36px; right: 40px;
          font-family: 'Inter', sans-serif;
          font-weight: 300;
          font-size: 0.76rem;
          letter-spacing: 0.04em;
          color: rgba(255,255,255,0.38);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.25s;
        }
        .top-link span { color: var(--accent); font-weight: 400; }
        .top-link:hover { color: rgba(255,255,255,0.75); }
        .logo {
          display: inline-block;
          margin-bottom: 52px;
          text-decoration: none;
        }
        .logo img { height: 22px; width: auto; }
        h1 {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          font-size: clamp(2rem, 3.2vw, 2.8rem);
          line-height: 1.08;
          letter-spacing: -0.04em;
          margin-bottom: 12px;
          color: var(--white);
          max-width: 360px;
          opacity: 0;
          animation: fadeUp 0.85s 0.2s ease forwards;
        }
        .subtitle {
          font-family: 'Inter', sans-serif;
          font-weight: 300;
          font-size: 0.80rem;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.01em;
          margin-bottom: 42px;
          opacity: 0;
          animation: fadeUp 0.85s 0.35s ease forwards;
        }
        .subtitle a {
          color: var(--accent);
          text-decoration: none;
          font-weight: 400;
          transition: color 0.2s;
        }
        .subtitle a:hover { color: #7eb3ff; }
        .google-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 380px;
          opacity: 0;
          animation: fadeUp 0.85s 0.5s ease forwards;
        }
        .btn-google {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 20px;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.10);
          background: #ffffff;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: 0.84rem;
          letter-spacing: 0.01em;
          color: #0a0a0a;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .btn-google:hover {
          background: #f5f5f5;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(255,255,255,0.12);
        }
        .btn-google:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .auth-divider {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .auth-divider::before, .auth-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.07);
        }
        .auth-divider span {
          font-family: 'Inter', sans-serif;
          font-weight: 300;
          font-size: 0.70rem;
          color: rgba(255,255,255,0.22);
          letter-spacing: 0.06em;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 380px;
          opacity: 0;
          animation: fadeUp 0.85s 0.5s ease forwards;
        }
        .input-wrap { position: relative; }
        .input-wrap input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 4px;
          padding: 15px 16px;
          font-family: 'Inter', sans-serif;
          font-weight: 300;
          font-size: 0.83rem;
          color: var(--white);
          outline: none;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
        }
        .input-wrap input::placeholder { color: rgba(255,255,255,0.25); }
        .input-wrap input:focus {
          border-color: rgba(79,142,247,0.45);
          background: rgba(79,142,247,0.04);
          box-shadow: 0 0 0 3px rgba(79,142,247,0.07);
        }
        .input-wrap input:focus + .input-label,
        .input-wrap input:not(:placeholder-shown) + .input-label {
          top: -8px; font-size: 0.63rem;
          color: var(--accent);
          background: var(--dark);
          padding: 0 5px;
        }
        .input-label {
          position: absolute;
          top: 50%; left: 13px;
          transform: translateY(-50%);
          font-family: 'Inter', sans-serif;
          font-weight: 300;
          font-size: 0.80rem;
          color: rgba(255,255,255,0.25);
          pointer-events: none;
          transition: all 0.2s ease;
        }
        .forgot {
          text-align: right;
          font-family: 'Inter', sans-serif;
          font-weight: 300;
          font-size: 0.72rem;
          color: rgba(255,255,255,0.30);
          text-decoration: none;
          transition: color 0.2s;
          margin-top: -2px;
        }
        .forgot:hover { color: var(--accent); }
        .btn-submit {
          margin-top: 4px;
          width: 100%;
          background: #ffffff;
          border: none;
          border-radius: 4px;
          padding: 15px;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: 0.84rem;
          letter-spacing: 0.02em;
          color: #0a0a0a;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .btn-submit:hover {
          background: #f0f0f0;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(255,255,255,0.10);
        }
        .btn-submit:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
        .btn-arrow {
          width: 26px; height: 26px;
          background: rgba(0,0,0,0.10);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .form-footer {
          max-width: 380px;
          margin-top: 20px;
          font-family: 'Inter', sans-serif;
          font-weight: 300;
          font-size: 0.68rem;
          color: rgba(255,255,255,0.20);
          line-height: 1.65;
          opacity: 0;
          animation: fadeUp 0.85s 0.65s ease forwards;
        }
        .form-footer a {
          color: rgba(255,255,255,0.35);
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 0.2s;
        }
        .form-footer a:hover { color: var(--accent); }
        .right-panel {
          background: #0e0e11;
          padding: 40px 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .img-frame {
          width: 100%;
          max-width: 420px;
          max-height: calc(100vh - 120px);
          border-radius: 28px;
          overflow: hidden;
          position: relative;
          opacity: 0;
          animation: fadeIn 1s 0.4s ease forwards;
          box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06);
        }
        .img-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
        }
        .img-frame::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 28px;
          box-shadow: inset 0 0 50px rgba(0,0,0,0.25);
          pointer-events: none;
        }
        .field-error {
          font-family: 'Inter', sans-serif;
          font-size: 0.68rem;
          font-weight: 300;
          color: #f87171;
          letter-spacing: 0.01em;
          padding-left: 4px;
          margin-top: -4px;
        }
        @media (max-width: 768px) {
          html, body { overflow: auto; }
          .page {
            grid-template-columns: 1fr;
            height: auto;
            min-height: 100vh;
          }
          .right-panel { display: none; }
          .left-panel {
            padding: 70px 7vw 60px;
            min-height: 100vh;
            justify-content: center;
          }
          .top-link { top: 20px; right: 20px; }
          h1 { font-size: clamp(1.7rem, 7vw, 2.4rem); }
          form, .google-section { max-width: 100%; }
          .form-footer { max-width: 100%; }
        }
      `}</style>

      <div className="page">
        <div className="left-panel">
          <Link className="top-link" href="/register">
            ¿No tienes cuenta? <span>Crear Cuenta</span>
          </Link>

          <Link className="logo" href="/">
            <img src="/noWhy.png" alt="noWhy" />
          </Link>

          <h1>Ondas que elevan tu concentración</h1>
          <p className="subtitle">Bienvenido de nuevo · <Link href="/register">Crear Cuenta</Link></p>

          <div className="google-section">
            <button type="button" className="btn-google" onClick={handleGoogle} disabled={googleLoading}>
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {googleLoading ? 'Cargando...' : 'Continuar con Google'}
            </button>
            {errGoogle && <p className="field-error">{errGoogle}</p>}
            <div className="auth-divider"><span>o</span></div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="input-wrap">
              <input
                type="email"
                placeholder=" "
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <label className="input-label">Correo electrónico</label>
              {errEmail && <p className="field-error">{errEmail}</p>}
            </div>
            <div className="input-wrap">
              <input
                type="password"
                placeholder=" "
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <label className="input-label">Contraseña</label>
              {errPassword && <p className="field-error">{errPassword}</p>}
            </div>
            <a href="#" className="forgot">¿Olvidaste tu contraseña?</a>
            <button type="submit" className="btn-submit" disabled={submitLoading}>
              <span>{submitLoading ? 'Iniciando...' : 'Entrar en modo foco'}</span>
              <div className="btn-arrow">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M1 6h10M6.5 2l4 4-4 4" stroke="#0a0a0a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
          </form>

          <p className="form-footer">
            Al ingresar aceptas nuestros <a href="#">términos de servicio</a> y{' '}
            <a href="#">política de privacidad</a> de noWhy.
          </p>
        </div>

        <div className="right-panel">
          <div className="img-frame">
            <img
              src={`/a-striking-midcentury-modern-living-room_RetcxTcsQquEjHTah3py0g_WTg0s2YaS8OPGyE7D7eNRQ%201.png`}
              alt="noWhy focus device"
            />
          </div>
        </div>
      </div>
    </>
  );
}

'use client';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Starfield from '../../components/Starfield';
import CursorGlow from '../../components/CursorGlow';
import ClickFlash from '../../components/ClickFlash';

const WORK_SECS  = 30 * 60;
const STUDY_SECS = 25 * 60;
const BREAK_SECS = 5  * 60;

const BEAT_MODES = [
  { name: 'Scripted',   sub: 'High Neural Effect', freqL: 200, freqD: 40 },
  { name: 'Deep Focus', sub: 'Alpha Waves · 10Hz',  freqL: 200, freqD: 10 },
  { name: 'Calm Flow',  sub: 'Theta Waves · 6Hz',   freqL: 180, freqD:  6 },
];

function fmt(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function FocusTimerPage() {
  const router = useRouter();

  // Mode
  const [currentMode, setCurrentMode] = useState('trabajar');

  // Timer state
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerState, setTimerState] = useState('idle'); // 'idle' | 'running' | 'paused'
  const timerRemainRef = useRef(0);
  const timerTotalRef  = useRef(0);
  const [displayTime, setDisplayTime] = useState('00:00');
  const [seekPct, setSeekPct] = useState(0);
  const [elapsedDisplay, setElapsedDisplay] = useState('0:00');
  const [remainDisplay, setRemainDisplay] = useState('25:00');

  // Player visibility
  const [playerVisible, setPlayerVisible] = useState(false);
  const [kbdVisible, setKbdVisible] = useState(false);

  // Audio
  const audioCtxRef   = useRef(null);
  const oscLRef       = useRef(null);
  const oscRRef       = useRef(null);
  const masterGainRef = useRef(null);
  const audioActiveRef = useRef(false);
  const [audioPlayerPlaying, setAudioPlayerPlaying] = useState(false);
  const [repeatActive, setRepeatActive] = useState(false);
  const [liked, setLiked] = useState(false);
  const [volume, setVolume] = useState(65);
  const [beatModeIdx, setBeatModeIdx] = useState(0);

  // Break modal
  const [breakModalVisible, setBreakModalVisible] = useState(false);
  const [breakRemain, setBreakRemain] = useState(BREAK_SECS);
  const breakTickRef = useRef(null);

  // Streak
  const [streak, setStreak] = useState(7);

  // Entry overlay
  const [entryVisible, setEntryVisible] = useState(true);

  // Timer interval ref
  const timerTickRef = useRef(null);

  // Init from sessionStorage
  useEffect(() => {
    const mode = sessionStorage.getItem('noWhy_mode') || 'trabajar';
    setCurrentMode(mode);
    const secs = mode === 'trabajar' ? WORK_SECS : STUDY_SECS;
    timerTotalRef.current  = secs;
    timerRemainRef.current = secs;
    setDisplayTime('00:00');
    setRemainDisplay(fmt(secs));

    const savedStreak = parseInt(localStorage.getItem('noWhy_streak') || '7', 10);
    setStreak(savedStreak);

    // Entry fade
    requestAnimationFrame(() => {
      setTimeout(() => setEntryVisible(false), 50);
    });
  }, []);

  function getFocusSecs(mode) {
    return (mode || currentMode) === 'trabajar' ? WORK_SECS : STUDY_SECS;
  }

  function getStreakLabel(s) {
    const weeks = Math.floor(s / 7);
    if (weeks >= 1) return `${weeks} week${weeks > 1 ? 's' : ''} streak`;
    return `${s} day${s !== 1 ? 's' : ''} streak`;
  }

  // ── Audio ──
  function startBinaural() {
    if (audioActiveRef.current) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.connect(ctx.destination);
      masterGainRef.current = gain;

      const merger = ctx.createChannelMerger(2);
      merger.connect(gain);

      const panL = ctx.createStereoPanner();
      const panR = ctx.createStereoPanner();
      panL.pan.value = -1;
      panR.pan.value =  1;

      const oscL = ctx.createOscillator();
      const oscR = ctx.createOscillator();
      oscL.type = oscR.type = 'sine';
      const mode = BEAT_MODES[beatModeIdx];
      oscL.frequency.value = mode.freqL;
      oscR.frequency.value = mode.freqL + mode.freqD;

      oscL.connect(panL); panL.connect(merger, 0, 0);
      oscR.connect(panR); panR.connect(merger, 0, 1);

      oscL.start();
      oscR.start();
      oscLRef.current = oscL;
      oscRRef.current = oscR;
      audioActiveRef.current = true;

      const vol = volume / 100;
      gain.gain.linearRampToValueAtTime(vol * 0.32, ctx.currentTime + 1.8);
    } catch (e) {
      console.warn('Web Audio unavailable:', e);
    }
  }

  function stopBinaural(immediate = false) {
    if (!audioActiveRef.current || !audioCtxRef.current) return;
    try {
      const ctx  = audioCtxRef.current;
      const gain = masterGainRef.current;
      const oscL = oscLRef.current;
      const oscR = oscRRef.current;
      if (immediate) {
        try { oscL.stop(); oscR.stop(); } catch (_) {}
        try { ctx.close(); } catch (_) {}
        audioActiveRef.current = false;
        audioCtxRef.current = null;
      } else {
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
        setTimeout(() => {
          try { oscL.stop(); oscR.stop(); ctx.close(); } catch (_) {}
          audioActiveRef.current = false;
          audioCtxRef.current = null;
        }, 700);
      }
    } catch (_) {}
  }

  function setBinauralVolume(v) {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.linearRampToValueAtTime(
        v * 0.32,
        audioCtxRef.current.currentTime + 0.1
      );
    }
  }

  // ── Timer logic ──
  function updateTimerUI(remain, total) {
    setDisplayTime(fmt(remain));
    const elapsed = total - remain;
    const pct = total > 0 ? (elapsed / total) * 100 : 0;
    setSeekPct(pct);
    setElapsedDisplay(fmt(elapsed));
    setRemainDisplay(fmt(remain));
  }

  function startTimer() {
    const total = getFocusSecs();
    timerTotalRef.current  = total;
    timerRemainRef.current = total;
    setTimerState('running');
    setTimerRunning(true);
    updateTimerUI(total, total);

    timerTickRef.current = setInterval(() => {
      timerRemainRef.current--;
      updateTimerUI(timerRemainRef.current, timerTotalRef.current);
      if (timerRemainRef.current <= 0) {
        clearInterval(timerTickRef.current);
        setTimerRunning(false);
        setTimerState('idle');
        onSessionEnd();
      }
    }, 1000);

    startBinaural();
    setPlayerVisible(true);
    setKbdVisible(true);
    setAudioPlayerPlaying(true);
  }

  function pauseTimer() {
    clearInterval(timerTickRef.current);
    setTimerRunning(false);
    setTimerState('paused');
    stopBinaural(true);
  }

  function resumeTimer() {
    setTimerRunning(true);
    setTimerState('running');
    timerTickRef.current = setInterval(() => {
      timerRemainRef.current--;
      updateTimerUI(timerRemainRef.current, timerTotalRef.current);
      if (timerRemainRef.current <= 0) {
        clearInterval(timerTickRef.current);
        setTimerRunning(false);
        setTimerState('idle');
        onSessionEnd();
      }
    }, 1000);
    startBinaural();
  }

  function resetTimer() {
    clearInterval(timerTickRef.current);
    setTimerRunning(false);
    setTimerState('idle');
    const total = getFocusSecs();
    timerTotalRef.current  = total;
    timerRemainRef.current = total;
    stopBinaural(true);
    setPlayerVisible(false);
    setKbdVisible(false);
    setDisplayTime('00:00');
    setSeekPct(0);
    setElapsedDisplay('0:00');
    setRemainDisplay(fmt(total));
  }

  function applyMode(mode) {
    setCurrentMode(mode);
    sessionStorage.setItem('noWhy_mode', mode);
    if (!timerRunning) {
      const total = getFocusSecs(mode);
      timerTotalRef.current  = total;
      timerRemainRef.current = total;
      setRemainDisplay(fmt(total));
      setSeekPct(0);
      setElapsedDisplay('0:00');
    }
  }

  function selectMode(mode) {
    if (timerRunning) {
      clearInterval(timerTickRef.current);
      stopBinaural(true);
      setTimerRunning(false);
      setTimerState('idle');
      applyMode(mode);
      setTimeout(() => startTimer(), 0);
    } else {
      applyMode(mode);
    }
  }

  // ── Session end ──
  function playNotificationTone() {
    try {
      const ctx  = new (window.AudioContext || window.webkitAudioContext)();
      const gain = ctx.createGain();
      gain.connect(ctx.destination);
      [528, 660, 792].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.gain.value = 0.20;
        osc.start(ctx.currentTime + i * 0.22);
        osc.stop(ctx.currentTime  + i * 0.22 + 0.35);
      });
      setTimeout(() => { try { ctx.close(); } catch (_) {} }, 1800);
    } catch (_) {}
  }

  function onSessionEnd() {
    stopBinaural();
    playNotificationTone();
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem('noWhy_streak', String(newStreak));
    showBreakModal();
  }

  // ── Break modal ──
  function showBreakModal() {
    setBreakRemain(BREAK_SECS);
    setBreakModalVisible(true);
    breakTickRef.current = setInterval(() => {
      setBreakRemain(prev => {
        if (prev <= 1) {
          clearInterval(breakTickRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function handleContinue() {
    clearInterval(breakTickRef.current);
    setBreakModalVisible(false);
    resetTimer();
  }

  // ── Audio player controls ──
  function handleAudioPlay() {
    if (!timerRunning) return;
    if (audioPlayerPlaying) {
      stopBinaural();
      setAudioPlayerPlaying(false);
    } else {
      startBinaural();
      setAudioPlayerPlaying(true);
    }
  }

  function handleVolumeChange(e) {
    const v = Number(e.target.value);
    setVolume(v);
    setBinauralVolume(v / 100);
  }

  function handleBeatMode(delta) {
    const idx = ((beatModeIdx + delta) % BEAT_MODES.length + BEAT_MODES.length) % BEAT_MODES.length;
    setBeatModeIdx(idx);
    if (audioActiveRef.current && oscLRef.current && oscRRef.current && audioCtxRef.current) {
      const m = BEAT_MODES[idx];
      oscLRef.current.frequency.linearRampToValueAtTime(m.freqL, audioCtxRef.current.currentTime + 0.5);
      oscRRef.current.frequency.linearRampToValueAtTime(m.freqL + m.freqD, audioCtxRef.current.currentTime + 0.5);
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(timerTickRef.current);
      clearInterval(breakTickRef.current);
      stopBinaural(true);
    };
  }, []);

  const beatMode = BEAT_MODES[beatModeIdx];

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
        html, body { height: 100%; overflow: hidden; }
        body {
          background: var(--dark);
          color: var(--white);
          font-family: 'Inter', sans-serif;
          font-weight: 300;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .page-entry {
          position: fixed;
          inset: 0;
          background: var(--dark);
          z-index: 99999;
          opacity: 1;
          transition: opacity 0.38s ease;
          pointer-events: none;
        }
        .page-entry.gone { opacity: 0; }
        .bg {
          position: fixed;
          inset: 0;
          z-index: 0;
        }
        .bg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 20%;
          display: block;
          filter: brightness(0.85) saturate(0.9);
        }
        .bg-top {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,0,0,0.38) 0%, transparent 100%),
            linear-gradient(
              180deg,
              rgba(0,0,0,0.65) 0%,
              rgba(0,0,0,0.30) 25%,
              rgba(0,0,0,0.28) 55%,
              rgba(0,0,0,0.55) 80%,
              rgba(0,0,0,0.88) 100%
            );
        }
        .page {
          position: relative;
          z-index: 10;
          height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .top-bar {
          padding: 28px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
          opacity: 0;
          animation: fadeIn 0.6s 0.3s ease forwards;
        }
        .logo img { height: 22px; width: auto; display: block; }
        .btn-exit {
          font-family: 'Inter', sans-serif;
          font-weight: 300;
          font-size: 0.72rem;
          color: rgba(255,255,255,0.45);
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 100px;
          padding: 8px 18px;
          cursor: pointer;
          text-decoration: none;
          letter-spacing: 0.04em;
          transition: all 0.22s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .btn-exit:hover {
          background: rgba(0,0,0,0.55);
          color: var(--white);
          border-color: rgba(255,255,255,0.22);
        }
        .stage {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0;
          padding-bottom: 24px;
          opacity: 0;
          animation: fadeUp 0.85s 0.42s ease forwards;
        }
        .tabs {
          display: flex;
          background: rgba(0,0,0,0.42);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.13);
          border-radius: 100px;
          padding: 4px;
          gap: 3px;
          margin-bottom: 38px;
          transition: opacity 0.25s, transform 0.25s;
        }
        .tabs.hidden { opacity: 0; pointer-events: none; transform: translateY(-6px); }
        .tab {
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          font-size: 0.82rem;
          letter-spacing: 0.01em;
          padding: 9px 26px;
          border-radius: 100px;
          cursor: pointer;
          border: none;
          color: rgba(255,255,255,0.50);
          background: transparent;
          transition: all 0.22s ease;
        }
        .tab.active {
          background: rgba(0,0,0,0.78);
          color: var(--white);
          box-shadow: 0 2px 10px rgba(0,0,0,0.45);
        }
        .mode-badge {
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          font-size: 0.80rem;
          letter-spacing: 0.04em;
          color: rgba(255,255,255,0.80);
          background: rgba(0,0,0,0.45);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 100px;
          padding: 7px 20px;
          margin-bottom: 38px;
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 0.25s, transform 0.25s;
          display: none;
        }
        .mode-badge.visible {
          display: block;
          opacity: 1;
          transform: translateY(0);
        }
        .timer-display {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: clamp(82px, 15vw, 160px);
          letter-spacing: -0.05em;
          color: var(--white);
          line-height: 1;
          margin-bottom: 36px;
          font-variant-numeric: tabular-nums;
          text-shadow: 0 0 60px rgba(79,142,247,0.3), 0 4px 40px rgba(0,0,0,0.35);
          transition: opacity 0.2s;
          user-select: none;
        }
        .ctrl-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .btn-pill {
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: 0.84rem;
          letter-spacing: 0.01em;
          padding: 13px 36px;
          border-radius: 100px;
          border: none;
          cursor: pointer;
          transition: all 0.22s ease;
        }
        .btn-dark {
          background: rgba(0,0,0,0.72);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          color: var(--white);
          border: 1px solid rgba(255,255,255,0.14);
        }
        .btn-dark:hover { background: rgba(0,0,0,0.88); border-color: rgba(255,255,255,0.26); }
        .btn-ghost {
          background: rgba(255,255,255,0.10);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          color: rgba(255,255,255,0.65);
          border: 1px solid rgba(255,255,255,0.10);
          font-size: 0.80rem;
        }
        .btn-ghost:hover { background: rgba(255,255,255,0.17); color: var(--white); }
        .player {
          position: fixed;
          bottom: 0;
          left: 0; right: 0;
          z-index: 100;
          background: rgba(7,9,16,0.80);
          backdrop-filter: blur(36px) saturate(180%);
          -webkit-backdrop-filter: blur(36px) saturate(180%);
          border-top: 1px solid rgba(255,255,255,0.07);
          padding: 12px 24px 10px;
          display: grid;
          grid-template-columns: minmax(0,1fr) auto minmax(0,1fr);
          align-items: center;
          gap: 20px;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.38s ease, transform 0.38s ease;
          pointer-events: none;
        }
        .player.visible { opacity: 1; transform: translateY(0); pointer-events: all; }
        .track-left { display: flex; align-items: center; gap: 12px; min-width: 0; }
        .track-thumb {
          width: 44px; height: 44px;
          border-radius: 9px;
          background: linear-gradient(135deg, #1a1a2e 0%, #2e2254 50%, #1a1a2e 100%);
          flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.15rem;
          border: 1px solid rgba(255,255,255,0.07);
          box-shadow: 0 4px 16px rgba(0,0,0,0.4);
        }
        .track-meta { min-width: 0; }
        .track-name { font-weight: 500; font-size: 0.82rem; color: var(--white); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 1px; }
        .track-sub { font-size: 0.68rem; font-weight: 300; color: rgba(255,255,255,0.35); letter-spacing: 0.03em; white-space: nowrap; margin-bottom: 6px; }
        .track-tags { display: flex; align-items: center; gap: 5px; }
        .tag { font-size: 0.58rem; font-weight: 500; letter-spacing: 0.10em; text-transform: uppercase; padding: 2px 8px; border-radius: 100px; border: 1px solid rgba(255,255,255,0.16); color: rgba(255,255,255,0.50); }
        .track-actions { display: flex; align-items: center; gap: 8px; margin-left: 6px; flex-shrink: 0; }
        .act-btn { background: none; border: none; color: rgba(255,255,255,0.30); cursor: pointer; padding: 3px; display: flex; align-items: center; transition: color 0.2s; }
        .act-btn:hover { color: rgba(255,255,255,0.72); }
        .act-btn.liked { color: var(--accent); }
        .player-center { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .seekbar-row { display: flex; align-items: center; gap: 8px; width: 260px; }
        .seek-time { font-size: 0.60rem; color: rgba(255,255,255,0.28); letter-spacing: 0.02em; min-width: 32px; font-variant-numeric: tabular-nums; }
        .seek-time.right { text-align: right; }
        .seekbar { flex: 1; height: 3px; background: rgba(255,255,255,0.10); border-radius: 10px; position: relative; cursor: pointer; }
        .seek-fill { height: 100%; background: var(--white); border-radius: 10px; transition: width 1s linear; }
        .controls-row { display: flex; align-items: center; gap: 18px; }
        .ctrl-btn { background: none; border: none; color: rgba(255,255,255,0.55); cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center; transition: color 0.2s, transform 0.15s; }
        .ctrl-btn:hover { color: var(--white); transform: scale(1.12); }
        .ctrl-btn.play-btn { width: 36px; height: 36px; background: var(--white); border-radius: 50%; color: #0a0a0a; transform: none; }
        .ctrl-btn.play-btn:hover { background: #efefef; transform: scale(1.06); }
        .ctrl-btn.toggled { color: var(--accent); }
        .player-right { display: flex; align-items: center; justify-content: flex-end; gap: 16px; }
        .vol-wrap { display: flex; align-items: center; gap: 7px; }
        .vol-icon { color: rgba(255,255,255,0.35); display: flex; align-items: center; }
        input[type="range"].vol-slider {
          -webkit-appearance: none; appearance: none;
          width: 76px; height: 3px;
          background: rgba(255,255,255,0.15);
          border-radius: 10px; outline: none; cursor: pointer;
        }
        input[type="range"].vol-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 10px; height: 10px; border-radius: 50%;
          background: var(--white); cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.4);
        }
        .streak-badge { display: flex; align-items: center; gap: 5px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.09); border-radius: 100px; padding: 6px 14px; white-space: nowrap; }
        .streak-txt { font-size: 0.70rem; font-weight: 400; color: rgba(255,255,255,0.65); letter-spacing: 0.02em; }
        .kbd-row { position: fixed; bottom: 11px; right: 26px; z-index: 110; display: flex; align-items: center; gap: 3px; opacity: 0; transition: opacity 0.38s ease; pointer-events: none; }
        .kbd-row.visible { opacity: 1; }
        .kbd { font-family: 'Inter', sans-serif; font-size: 0.56rem; font-weight: 400; letter-spacing: 0.05em; color: rgba(255,255,255,0.17); background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 3px; padding: 2px 5px; line-height: 1.4; }
        .modal-overlay { position: fixed; inset: 0; z-index: 500; background: rgba(0,0,0,0.70); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.35s ease; }
        .modal-overlay.visible { opacity: 1; pointer-events: all; }
        .modal { background: rgba(10,11,18,0.95); border: 1px solid rgba(255,255,255,0.09); border-radius: 24px; padding: 52px 56px; text-align: center; max-width: 430px; width: 90%; transform: translateY(18px); transition: transform 0.35s ease; box-shadow: 0 40px 100px rgba(0,0,0,0.65); }
        .modal-overlay.visible .modal { transform: translateY(0); }
        .modal-chip { display: inline-block; font-size: 0.66rem; font-weight: 400; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.32); border: 1px solid rgba(255,255,255,0.10); border-radius: 100px; padding: 5px 14px; margin-bottom: 22px; }
        .modal-emoji { font-size: 2.6rem; display: block; margin-bottom: 16px; }
        .modal-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: clamp(1.6rem, 3vw, 2rem); letter-spacing: -0.035em; margin-bottom: 10px; }
        .modal-sub { font-size: 0.82rem; font-weight: 300; color: rgba(255,255,255,0.38); line-height: 1.7; margin-bottom: 28px; }
        .modal-timer { font-family: 'Inter', sans-serif; font-weight: 700; font-size: 3.2rem; letter-spacing: -0.04em; color: var(--white); line-height: 1; margin-bottom: 32px; font-variant-numeric: tabular-nums; }
        .modal-actions { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
        .modal-btn-primary { font-family: 'Inter', sans-serif; font-weight: 500; font-size: 0.84rem; letter-spacing: 0.01em; padding: 13px 32px; border-radius: 100px; border: none; background: var(--white); color: #0a0a0a; cursor: pointer; transition: background 0.2s, transform 0.15s; }
        .modal-btn-primary:hover { background: #efefef; transform: translateY(-1px); }
        .modal-btn-secondary { font-family: 'Inter', sans-serif; font-weight: 400; font-size: 0.82rem; letter-spacing: 0.01em; padding: 13px 24px; border-radius: 100px; border: 1px solid rgba(255,255,255,0.12); background: transparent; color: rgba(255,255,255,0.45); cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-block; }
        .modal-btn-secondary:hover { color: var(--white); border-color: rgba(255,255,255,0.25); }
        @media (max-width: 760px) {
          .top-bar { padding: 20px 20px; }
          .timer-display { font-size: clamp(64px, 19vw, 120px); }
          .player { grid-template-columns: 1fr; grid-template-rows: auto auto auto; gap: 10px; padding: 14px 16px 12px; }
          .track-left { justify-content: flex-start; }
          .player-center { width: 100%; }
          .seekbar-row { width: 100%; }
          .player-right { justify-content: center; }
          .kbd-row { display: none; }
          .modal { padding: 40px 28px; }
        }
      `}</style>

      {/* Entry overlay */}
      <div className={`page-entry${entryVisible ? '' : ' gone'}`}></div>

      {/* Background */}
      <div className="bg">
        <img className="bg-img" src="/fondo.jpg" alt="" />
        <div className="bg-top"></div>
      </div>

      {/* Main page */}
      <div className="page">
        <div className="top-bar">
          <Link href="/" className="logo"><img src="/noWhy.png" alt="noWhy" /></Link>
          <Link href="/focus-select" className="btn-exit">
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
              <path d="M13 7H1M6 11l-4-4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Cambiar modo
          </Link>
        </div>

        <div className="stage">
          {/* Tabs (idle) */}
          <div className={`tabs${timerState !== 'idle' ? ' hidden' : ''}`}>
            <button
              className={`tab${currentMode === 'trabajar' ? ' active' : ''}`}
              onClick={() => selectMode('trabajar')}
            >Trabajar</button>
            <button
              className={`tab${currentMode === 'estudiar' ? ' active' : ''}`}
              onClick={() => selectMode('estudiar')}
            >Estudiar</button>
          </div>

          {/* Mode badge (active) */}
          <div className={`mode-badge${timerState !== 'idle' ? ' visible' : ''}`}>
            {currentMode === 'trabajar' ? 'Trabajar' : 'Estudiar'}
          </div>

          {/* Timer */}
          <div className="timer-display">{displayTime}</div>

          {/* Controls */}
          <div className="ctrl-row">
            {timerState === 'idle' && (
              <button className="btn-pill btn-dark" onClick={startTimer}>Iniciar</button>
            )}
            {timerState === 'running' && (
              <>
                <button className="btn-pill btn-ghost" onClick={pauseTimer}>Pausar</button>
                <button className="btn-pill btn-dark" onClick={resetTimer}>Volver a empezar</button>
              </>
            )}
            {timerState === 'paused' && (
              <>
                <button className="btn-pill btn-ghost" onClick={resumeTimer}>Reanudar</button>
                <button className="btn-pill btn-dark" onClick={resetTimer}>Volver a empezar</button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Music player bar */}
      <div className={`player${playerVisible ? ' visible' : ''}`}>
        <div className="track-left">
          <div className="track-thumb">🎵</div>
          <div className="track-meta">
            <div className="track-name">{beatMode.name}</div>
            <div className="track-sub">{beatMode.sub}</div>
            <div className="track-tags">
              <span className="tag">LOFI</span>
              <span className="tag">+DETAILS</span>
            </div>
          </div>
          <div className="track-actions">
            <button className="act-btn" title="No me gusta">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/>
                <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
              </svg>
            </button>
            <button className={`act-btn${liked ? ' liked' : ''}`} title="Me gusta" onClick={() => setLiked(l => !l)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
                <path d="M7 22H4.72A2.31 2.31 0 0 1 2 20V13a2.31 2.31 0 0 1 2.33-2H7"/>
              </svg>
            </button>
            <button className="act-btn" title="Compartir">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="player-center">
          <div className="seekbar-row">
            <span className="seek-time">{elapsedDisplay}</span>
            <div className="seekbar">
              <div className="seek-fill" style={{ width: seekPct + '%' }}></div>
            </div>
            <span className="seek-time right">{remainDisplay}</span>
          </div>
          <div className="controls-row">
            <button className="ctrl-btn" title="Anterior" onClick={() => handleBeatMode(-1)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
              </svg>
            </button>
            <button className="ctrl-btn play-btn" title="Play/Pausa audio" onClick={handleAudioPlay}>
              {audioPlayerPlaying ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>
            <button className="ctrl-btn" title="Siguiente" onClick={() => handleBeatMode(1)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 18l8.5-6L6 6v12zm8.5-6v6h2V6h-2v6z"/>
              </svg>
            </button>
            <button className={`ctrl-btn${repeatActive ? ' toggled' : ''}`} title="Repetir" onClick={() => setRepeatActive(r => !r)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="17 1 21 5 17 9"/>
                <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                <polyline points="7 23 3 19 7 15"/>
                <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="player-right">
          <div className="vol-wrap">
            <span className="vol-icon">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
            </span>
            <input
              type="range"
              className="vol-slider"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
          <div className="streak-badge">
            <span>🚀</span>
            <span className="streak-txt">{getStreakLabel(streak)}</span>
          </div>
        </div>
      </div>

      {/* Keyboard shortcuts */}
      <div className={`kbd-row${kbdVisible ? ' visible' : ''}`}>
        <span className="kbd">SHIFT</span>
        <span className="kbd">Z</span>
        <span className="kbd">A</span>
        <span className="kbd">G</span>
        <span className="kbd">V</span>
        <span className="kbd">B</span>
        <span className="kbd">N</span>
        <span className="kbd">M</span>
      </div>

      {/* Break modal */}
      <div className={`modal-overlay${breakModalVisible ? ' visible' : ''}`}>
        <div className="modal">
          <div className="modal-chip">Sesión completada</div>
          <span className="modal-emoji">🧘</span>
          <h2 className="modal-title">¡Sesión completada!</h2>
          <p className="modal-sub">Tu cerebro necesita recuperarse. Tómate 5 minutos antes de la próxima sesión de enfoque profundo.</p>
          <div className="modal-timer">{fmt(breakRemain)}</div>
          <div className="modal-actions">
            <button className="modal-btn-primary" onClick={handleContinue}>Continuar otra sesión</button>
            <Link href="/focus-select" className="modal-btn-secondary">Cambiar modo</Link>
          </div>
        </div>
      </div>
    </>
  );
}

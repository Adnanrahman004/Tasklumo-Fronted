import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Coins,
  Ticket,
  Trophy,
  Sparkles,
  RotateCcw,
  Gift,
  Clock,
} from "lucide-react";

// 8 segments — change coin values or colors here anytime
const SEGMENTS = [
  { label: "5", value: 5, color: "#FFD54F" },
  { label: "10", value: 10, color: "#FFCA28" },
  { label: "15", value: 15, color: "#FFD700" },
  { label: "20", value: 20, color: "#FFB300" },
  { label: "30", value: 30, color: "#FFA000" },
  { label: "50", value: 50, color: "#FF8F00" },
  { label: "100", value: 100, color: "#FFC107" },
  { label: "TryAgain", value: 0, color: "#1c1c1c" },
];

const SEGMENT_ANGLE = 360 / SEGMENTS.length;
const CONFETTI_COLORS = ["#facc15", "#ffffff", "#ff9d3d", "#eab308"];

function timeAgo(ts) {
  const diff = Math.max(Date.now() - ts, 0);
  const min = Math.floor(diff / 60000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}

export default function LuckySpin() {
  const navigate = useNavigate();
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [confetti, setConfetti] = useState([]);
  const [, forceTick] = useState(0);
  const totalRotation = useRef(0);
  const spinIdRef = useRef(0);
  const spinLockRef = useRef(false);

  // Real values — loaded from backend, never guessed on the frontend
  const [coins, setCoins] = useState(0);
  const [spinsAvailable, setSpinsAvailable] = useState(0);
  const [totalWon, setTotalWon] = useState(0);
  const [bestWin, setBestWin] = useState(0);
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("taskNiriSpinHistory") || "[]");
    } catch {
      return [];
    }
  });

  // Fetch the logged-in user's real coins + spins from backend
  const loadUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "https://tasklumo-backend.vercel.app/api/auth/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();
      if (data.success) {
        setCoins(data.user.coins);
        setSpinsAvailable(data.user.luckySpins || 0);

        // Lucky Spin Stats
        setTotalWon(data.user.totalSpinWon || 0);
        setBestWin(data.user.bestSpinWin || 0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    loadUser();
  }, []);

  // Refresh "time ago" labels every 30s without needing new spins
  React.useEffect(() => {
    const t = setInterval(() => forceTick((n) => n + 1), 30000);
    return () => clearInterval(t);
  }, []);

  const pushHistory = (value) => {
    setHistory((prev) => {
      const next = [{ value, ts: Date.now() }, ...prev].slice(0, 10);
      localStorage.setItem("tasklumoSpinHistory", JSON.stringify(next));
      return next;
    });
  };

  const fireConfetti = () => {
    const pieces = Array.from({ length: 28 }).map((_, i) => ({
      id: `${Date.now()}-${i}`,
      left: Math.random() * 100,
      delay: Math.random() * 0.25,
      duration: 1.5 + Math.random() * 0.9,
      rotate: Math.floor(Math.random() * 360),
      size: 6 + Math.random() * 6,
      color:
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    }));
    setConfetti(pieces);
    setTimeout(() => setConfetti([]), 2600);
  };

  const canSpin = spinsAvailable > 0 && !spinning;

  const handleSpin = async () => {
    if (!canSpin) return;
    if (spinLockRef.current) return; // blocks double-click/double-tap before state re-renders
    spinLockRef.current = true;
    const mySpinId = ++spinIdRef.current;

    try {
      setSpinning(true);
      setResult(null);

      const token = localStorage.getItem("token");
      const res = await fetch(
        "https://tasklumo-backend.vercel.app/api/lucky-spin/spin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Spin Failed");
      }

      const reward = data.reward;
      const winnerIndex = SEGMENTS.findIndex((item) => item.value === reward);
      const safeIndex = winnerIndex === -1 ? 0 : winnerIndex;

      const extraSpins = 5 + Math.floor(Math.random() * 3);
      const targetCenter = safeIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
      const newRotation =
        totalRotation.current +
        (360 - (totalRotation.current % 360)) +
        extraSpins * 360 +
        (360 - targetCenter);

      totalRotation.current = newRotation;
      setRotation(newRotation);

      setTimeout(() => {
        // If a newer spin started (double click/tap race), ignore this stale result
        if (mySpinId !== spinIdRef.current) {
          spinLockRef.current = false;
          return;
        }

        setSpinning(false);
        setResult({
          label: String(reward),
          value: reward,
          color: SEGMENTS[safeIndex].color,
        });
        pushHistory(reward);

        if (reward > 0) {
          fireConfetti();
          setTotalWon((prev) => prev + reward);
          setBestWin((prev) => Math.max(prev, reward));
        }

        // Backend already updated coins + luckySpins — pull the real values
        loadUser();
        spinLockRef.current = false;
      }, 4200);
    } catch (err) {
      alert(err.message || "Spin Failed");
      setSpinning(false);
      spinLockRef.current = false;
    }
  };

  return (
    <div className="ls-page">
      <style>{`
        * { box-sizing: border-box; }

        .ls-page {
          --gold: #facc15;
          --gold-light: #ffe27a;
          --gold-deep: #b8860b;
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          background:
            radial-gradient(ellipse 80% 50% at 15% 0%, rgba(255,150,40,0.16), transparent 55%),
            radial-gradient(ellipse 70% 45% at 100% 15%, rgba(250,204,21,0.14), transparent 50%),
            radial-gradient(ellipse 60% 40% at 50% 100%, rgba(255,140,0,0.10), transparent 55%),
            linear-gradient(160deg, #050403 0%, #0a0806 35%, #100b06 65%, #08070a 100%);
          color: #fff;
          font-family: 'Poppins', sans-serif;
          padding: clamp(14px, 4vw, 26px) clamp(14px, 4.5vw, 32px) clamp(40px, 8vw, 64px);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .ls-page::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          z-index: 0;
        }

        .ls-sparkle {
          position: absolute;
          color: rgba(250,204,21,0.22);
          animation: lsFloat 6s ease-in-out infinite;
          pointer-events: none;
          z-index: 1;
        }

        @keyframes lsFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.18; }
          50% { transform: translateY(-14px) rotate(20deg); opacity: 0.5; }
        }

        .ls-content {
          width: 100%;
          max-width: 460px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .ls-topbar {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: clamp(14px, 3.5vw, 20px);
        }

        .ls-back {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(250,204,21,0.22);
          color: var(--gold);
          padding: 9px 16px;
          border-radius: 999px;
          font-size: clamp(11px, 2.8vw, 12.5px);
          font-weight: 600;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          transition: background 0.2s ease, transform 0.15s ease;
        }

        .ls-back:active {
          transform: scale(0.96);
          background: rgba(250,204,21,0.08);
        }

        .ls-coin-badge {
          display: flex;
          align-items: center;
          gap: 7px;
          background: linear-gradient(135deg, rgba(250,204,21,0.18), rgba(250,204,21,0.05));
          border: 1px solid rgba(250,204,21,0.32);
          color: var(--gold-light);
          padding: 9px 16px;
          border-radius: 999px;
          font-size: clamp(12px, 3vw, 13.5px);
          font-weight: 700;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 4px 14px rgba(0,0,0,0.3);
        }

        .ls-title-wrap {
          text-align: center;
          margin-bottom: 2px;
        }

        .ls-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #ffb84d;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .ls-title {
          font-size: clamp(26px, 8vw, 40px);
          font-weight: 800;
          margin: 0;
          letter-spacing: -0.5px;
          background: linear-gradient(to right, var(--gold-light), var(--gold) 45%, #fff8e1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 24px rgba(250,204,21,0.28));
        }

        .ls-subtitle {
          color: #a1a1aa;
          font-size: clamp(11.5px, 3vw, 13px);
          margin: 7px 0 0 0;
        }

        .ls-stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(8px, 2.5vw, 12px);
          width: 100%;
          max-width: 400px;
          margin: clamp(18px, 5vw, 26px) 0 clamp(2px, 1vw, 6px);
        }

        .ls-stat-card {
          background: linear-gradient(160deg, rgba(24,20,14,0.9), rgba(14,12,10,0.85));
          border: 1px solid rgba(250,204,21,0.14);
          border-radius: 16px;
          padding: clamp(10px, 3vw, 13px) 6px;
          text-align: center;
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          box-shadow: 0 6px 18px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04);
        }

        .ls-stat-icon {
          color: var(--gold);
          margin-bottom: 5px;
        }

        .ls-stat-value {
          font-size: clamp(14px, 4vw, 16px);
          font-weight: 800;
          color: #fff;
          line-height: 1.1;
        }

        .ls-stat-label {
          font-size: clamp(8.5px, 2.3vw, 9.5px);
          color: #8b8b93;
          margin-top: 3px;
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }

        .ls-wheel-zone {
          position: relative;
          width: min(320px, 78vw);
          height: min(320px, 78vw);
          margin: clamp(26px, 7vw, 40px) 0 clamp(12px, 3vw, 18px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ls-shimmer-ring {
          position: absolute;
          inset: -16px;
          border-radius: 50%;
          background: conic-gradient(from 0deg, transparent 0%, rgba(250,204,21,0.6) 10%, transparent 22%, transparent 48%, rgba(255,180,60,0.45) 60%, transparent 74%, transparent 88%, rgba(250,204,21,0.35) 96%, transparent 100%);
          animation: lsSpinRing 5s linear infinite;
          filter: blur(3px);
        }

        @keyframes lsSpinRing {
          to { transform: rotate(360deg); }
        }

        .ls-wheel-glow {
          position: absolute;
          inset: -30px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(250,204,21,0.18), transparent 68%);
          filter: blur(6px);
          pointer-events: none;
        }

        .ls-wheel {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          position: relative;
          border: 6px solid var(--gold);
          box-shadow:
            0 0 0 3px rgba(0,0,0,0.65),
            0 0 46px rgba(250,204,21,0.4),
            inset 0 0 22px rgba(0,0,0,0.45),
            0 14px 38px rgba(0,0,0,0.6);
          transition: transform 4.2s cubic-bezier(0.15,0.6,0.1,1);
        }

        .ls-label-wrap {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 50%;
          height: 2px;
          transform-origin: left center;
        }

        .ls-label-text {
          position: absolute;
          left: 66%;
          transform: translateX(-50%) rotate(90deg);
          font-weight: 800;
          font-size: clamp(11px, 3.4vw, 15px);
          white-space: nowrap;
          text-shadow: 0 1px 1px rgba(255,255,255,0.15);
        }

        .ls-pointer {
          position: absolute;
          top: -32px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 14px solid transparent;
          border-right: 14px solid transparent;
          border-top: 24px solid var(--gold);
          z-index: 6;
          filter: drop-shadow(0 0 10px rgba(250,204,21,0.75));
        }

        .ls-pointer::after {
          content: "";
          position: absolute;
          top: -24px;
          left: -6px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--gold);
          box-shadow: 0 0 10px rgba(250,204,21,0.8);
        }

        .ls-hub {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: clamp(64px, 19vw, 82px);
          height: clamp(64px, 19vw, 82px);
          border-radius: 50%;
          z-index: 6;
          padding: 0;
          border: 4px solid #0a0a0a;
          background: radial-gradient(circle at 32% 28%, #fff8dc, var(--gold) 45%, var(--gold-deep) 100%);
          color: #3a2600;
          font-weight: 800;
          font-size: clamp(12px, 3.4vw, 15px);
          letter-spacing: 0.5px;
          font-family: 'Poppins', sans-serif;
          box-shadow: 0 0 24px rgba(250,204,21,0.55), inset 0 2px 5px rgba(255,255,255,0.5), inset 0 -3px 6px rgba(0,0,0,0.15);
          transition: transform 0.15s ease, opacity 0.2s ease;
          cursor: pointer;
        }

        .ls-hub.ready {
          animation: lsPulseGlow 1.8s ease-in-out infinite;
        }

        @keyframes lsPulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(250,204,21,0.45), inset 0 2px 5px rgba(255,255,255,0.5), inset 0 -3px 6px rgba(0,0,0,0.15); }
          50% { box-shadow: 0 0 38px rgba(250,204,21,0.9), inset 0 2px 5px rgba(255,255,255,0.5), inset 0 -3px 6px rgba(0,0,0,0.15); }
        }

        .ls-hub:active:not(:disabled) {
          transform: translate(-50%, -50%) scale(0.94);
        }

        .ls-hub:disabled {
          opacity: 0.4;
          background: #2b2b2b;
          color: #777;
          box-shadow: none;
          animation: none;
          cursor: not-allowed;
        }

        .ls-confetti-piece {
          position: absolute;
          top: -20px;
          border-radius: 2px;
          animation: lsConfettiFall linear forwards;
          z-index: 8;
        }

        @keyframes lsConfettiFall {
          to {
            transform: translateY(360px) rotate(540deg);
            opacity: 0;
          }
        }

        .ls-result-box {
          margin-top: clamp(4px, 1.5vw, 8px);
          font-size: clamp(12.5px, 3.2vw, 14px);
          font-weight: 600;
          padding: 13px 22px;
          border-radius: 16px;
          text-align: center;
          display: flex;
          align-items: center;
          gap: 8px;
          animation: lsPop 0.35s cubic-bezier(0.2,0.9,0.3,1.3);
          max-width: 340px;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }

        .ls-result-box.win {
          background: linear-gradient(135deg, rgba(250,204,21,0.18), rgba(250,204,21,0.05));
          border: 1px solid rgba(250,204,21,0.5);
          color: var(--gold-light);
          box-shadow: 0 6px 20px rgba(250,204,21,0.12);
        }

        .ls-result-box.lose {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          color: #c7c7cd;
        }

        @keyframes lsPop {
          from { transform: scale(0.8) translateY(6px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }

        .ls-section {
          width: 100%;
          margin-top: clamp(22px, 6vw, 30px);
        }

        .ls-section-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          padding: 0 2px;
        }

        .ls-section-title {
          font-size: clamp(11px, 2.8vw, 12.5px);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          color: #d4d4d8;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ls-history-card {
          background: linear-gradient(160deg, rgba(20,17,12,0.9), rgba(12,10,8,0.85));
          border: 1px solid rgba(250,204,21,0.12);
          border-radius: 18px;
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }

        .ls-history-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 15px;
          border-bottom: 1px solid rgba(255,255,255,0.055);
        }

        .ls-history-row:last-child {
          border-bottom: none;
        }

        .ls-history-icon {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .ls-history-icon.win {
          background: rgba(250,204,21,0.16);
          color: var(--gold);
        }

        .ls-history-icon.lose {
          background: rgba(255,255,255,0.06);
          color: #737379;
        }

        .ls-history-body {
          flex: 1;
          min-width: 0;
        }

        .ls-history-main {
          font-size: clamp(12.5px, 3.2vw, 13.5px);
          font-weight: 700;
          color: #fff;
        }

        .ls-history-main.lose {
          color: #9a9aa0;
          font-weight: 600;
        }

        .ls-history-time {
          font-size: clamp(9.5px, 2.4vw, 10.5px);
          color: #77777d;
          margin-top: 1px;
        }

        .ls-history-empty {
          padding: 24px 14px;
          text-align: center;
          font-size: 12px;
          color: #77777d;
        }

        .ls-earn-card {
          margin-top: clamp(18px, 5vw, 24px);
          background: linear-gradient(135deg, rgba(250,204,21,0.1), rgba(255,140,0,0.03));
          border: 1px solid rgba(250,204,21,0.2);
          border-radius: 18px;
          padding: 15px 17px;
          width: 100%;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          box-shadow: 0 8px 22px rgba(0,0,0,0.25);
        }

        .ls-earn-icon {
          color: var(--gold);
          flex-shrink: 0;
          margin-top: 1px;
        }

        .ls-earn-card p {
          margin: 0;
          font-size: clamp(11.5px, 3vw, 12.5px);
          line-height: 18px;
          color: #b7b7bd;
        }

        .ls-earn-card b {
          color: var(--gold);
        }
      `}</style>

      <Sparkles
        className="ls-sparkle"
        size={16}
        style={{ top: "8%", left: "10%" }}
      />
      <Sparkles
        className="ls-sparkle"
        size={12}
        style={{ top: "18%", right: "12%", animationDelay: "1.2s" }}
      />
      <Sparkles
        className="ls-sparkle"
        size={14}
        style={{ bottom: "22%", left: "8%", animationDelay: "2.4s" }}
      />
      <Sparkles
        className="ls-sparkle"
        size={10}
        style={{ bottom: "12%", right: "10%", animationDelay: "0.6s" }}
      />

      <div className="ls-content">
        <div className="ls-topbar">
          <button className="ls-back" onClick={() => navigate("/home")}>
            <ArrowLeft size={14} /> Back
          </button>
          <div className="ls-coin-badge">
            <Coins size={14} /> {coins.toLocaleString()}
          </div>
        </div>

        <div className="ls-title-wrap">
          <span className="ls-eyebrow">
            <Sparkles size={11} /> Daily rewards
          </span>
          <h1 className="ls-title">Lucky Spin</h1>
          <p className="ls-subtitle">Spin the wheel and win bonus coins</p>
        </div>

        <div className="ls-stats-row">
          <div className="ls-stat-card">
            <Coins className="ls-stat-icon" size={16} />
            <div className="ls-stat-value">{totalWon.toLocaleString()}</div>
            <div className="ls-stat-label">Total won</div>
          </div>
          <div className="ls-stat-card">
            <Trophy className="ls-stat-icon" size={16} />
            <div className="ls-stat-value">{bestWin}</div>
            <div className="ls-stat-label">Best win</div>
          </div>
          <div className="ls-stat-card">
            <Ticket className="ls-stat-icon" size={16} />
            <div className="ls-stat-value">{spinsAvailable}</div>
            <div className="ls-stat-label">Spins left</div>
          </div>
        </div>

        <div className="ls-wheel-zone">
          <div className="ls-wheel-glow" />
          <div className="ls-shimmer-ring" />
          <div className="ls-pointer" />

          {confetti.map((c) => (
            <div
              key={c.id}
              className="ls-confetti-piece"
              style={{
                left: `${c.left}%`,
                width: c.size,
                height: c.size * 0.4,
                background: c.color,
                animationDuration: `${c.duration}s`,
                animationDelay: `${c.delay}s`,
                transform: `rotate(${c.rotate}deg)`,
              }}
            />
          ))}

          <div
            className="ls-wheel"
            style={{
              transform: `rotate(${rotation}deg)`,
              background: `conic-gradient(${SEGMENTS.map(
                (s, i) =>
                  `${s.color} ${i * SEGMENT_ANGLE}deg ${(i + 1) * SEGMENT_ANGLE}deg`,
              ).join(", ")})`,
            }}
          >
            {SEGMENTS.map((s, i) => {
              const angle = i * SEGMENT_ANGLE + SEGMENT_ANGLE / 2 - 90;
              return (
                <div
                  key={i}
                  className="ls-label-wrap"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <span
                    className="ls-label-text"
                    style={{ color: s.value === 0 ? "#fff" : "#241a00" }}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>

          <button
            className={`ls-hub ${canSpin ? "ready" : ""}`}
            onClick={handleSpin}
            disabled={!canSpin}
          >
            {spinning ? "..." : "SPIN"}
          </button>
        </div>

        {result && (
          <div className={`ls-result-box ${result.value > 0 ? "win" : "lose"}`}>
            {result.value > 0 ? <Trophy size={16} /> : <RotateCcw size={16} />}
            {result.value > 0
              ? `You won ${result.value} coins! Added to your wallet.`
              : "No luck this time — try again on your next spin!"}
          </div>
        )}

        {!spinning && spinsAvailable === 0 && !result && (
          <div className="ls-result-box lose">
            <Ticket size={16} />
            You're out of spins. Refer a friend to unlock more!
          </div>
        )}

        <div className="ls-section">
          <div className="ls-section-head">
            <span className="ls-section-title">
              <Clock size={13} /> Spin History
            </span>
          </div>
          <div className="ls-history-card">
            {history.length === 0 ? (
              <div className="ls-history-empty">
                No spins yet — your results will show up here.
              </div>
            ) : (
              history.map((h, i) => (
                <div className="ls-history-row" key={i}>
                  <div
                    className={`ls-history-icon ${h.value > 0 ? "win" : "lose"}`}
                  >
                    {h.value > 0 ? (
                      <Trophy size={15} />
                    ) : (
                      <RotateCcw size={15} />
                    )}
                  </div>
                  <div className="ls-history-body">
                    <div
                      className={`ls-history-main ${h.value > 0 ? "" : "lose"}`}
                    >
                      {h.value > 0 ? `+${h.value} coins` : "No win"}
                    </div>
                    <div className="ls-history-time">{timeAgo(h.ts)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="ls-earn-card">
          <Gift className="ls-earn-icon" size={18} />
          <p>
            You get <b>1 free spin</b> for every <b>1 friend</b> you refer to
            TaskLumo. Invite friends to keep spinning and earning coins.
          </p>
        </div>
      </div>
    </div>
  );
}

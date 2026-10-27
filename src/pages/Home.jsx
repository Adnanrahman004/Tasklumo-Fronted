import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { getProfile } from "../services/authServices";
import {
  Gift,
  ClipboardList,
  Wallet,
  Trophy,
  User,
  Users,
  RotateCw,
  MessageCircle,
  Flame,
  Coins,
  Bell,
  Home as HomeIcon,
  Sparkles,
  ChevronRight,
  AlertCircle,
  WifiOff,
  RefreshCw,
} from "lucide-react";
import Notification from "../components/Notification";

function getToday() {
  return new Date().toDateString();
}

function getISTHour() {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const istMs = utcMs + 5.5 * 60 * 60 * 1000;
  return new Date(istMs).getHours();
}

function getGreeting() {
  const h = getISTHour();
  if (h >= 5 && h < 12) return "Good morning";
  if (h >= 12 && h < 17) return "Good afternoon";
  if (h >= 17 && h < 21) return "Good evening";
  return "Good night";
}

function timeAgo(ts) {
  if (!ts) return "";
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 10) return "just now";
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const TRUST_MESSAGES = [
  "Priya just earned 45 coins",
  "Rohan withdrew ₹500 to UPI",
  "Ananya completed a task and earned 30 coins",
  "Vikram just hit a 7 day streak",
  "Sneha invited a friend and earned 200 coins",
  "Arjun just claimed the daily bonus",
];

const CLAMP_2_LINES = {
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const DESIGN_SYSTEM_CSS = `
  :root {
    --brand: #16a34a;
    --brand-soft: #22c55e;
    --highlight: #dcfce7;
    --border: #e5e7eb;
    --muted: #6b7280;
    --ink: #111827;
    --gold: #d97706;
    --gold-soft: #f59e0b;
    --gold-bg: #fef3c7;
    --gold-border: #fcd34d;
    --bg: #f2f5f3;
    --ease-premium: cubic-bezier(0.16, 1, 0.3, 1);
  }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes cardIn { from { opacity: 0; transform: translateY(14px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
  @keyframes toastIn { from { opacity: 0; transform: translate(-50%, -14px) scale(0.96); } to { opacity: 1; transform: translate(-50%, 0) scale(1); } }
  @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(220%); } }
  @keyframes pageFadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes tickerDot { 0%, 100% { opacity: 0.5; transform: scale(0.85); } 50% { opacity: 1; transform: scale(1); } }
  @keyframes spinOnce { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @media (prefers-reduced-motion: reduce) {
    * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
  }

  .tn-shell {
    max-width: 1180px;
    margin: 0 auto;
    padding-left: clamp(16px, 4vw, 40px);
    padding-right: clamp(16px, 4vw, 40px);
    padding-bottom: clamp(120px, 14vh, 140px);
    padding-top: 0;
  }

  .tn-header {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(242, 245, 243, 0.94);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--border);
    padding-top: max(clamp(10px, 1.4vw, 16px), env(safe-area-inset-top));
    padding-bottom: clamp(10px, 1.4vw, 14px);
    margin-left: calc(clamp(16px, 4vw, 40px) * -1);
    margin-right: calc(clamp(16px, 4vw, 40px) * -1);
    margin-bottom: 14px;
    padding-left: clamp(16px, 4vw, 40px);
    padding-right: clamp(16px, 4vw, 40px);
  }

  .tn-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: clamp(12px, 2vw, 20px);
  }
  @media (min-width: 640px) { .tn-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (min-width: 1024px) { .tn-grid { grid-template-columns: repeat(4, 1fr); } }
  @media (max-width: 340px) { .tn-grid { grid-template-columns: 1fr; } }

  .tn-card {
    transition: transform 0.35s var(--ease-premium), box-shadow 0.35s var(--ease-premium), border-color 0.35s var(--ease-premium);
  }
  @media (hover: hover) {
    .tn-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 28px rgba(34, 197, 94, 0.16);
      border-color: rgba(34, 197, 94, 0.45);
    }
    .tn-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(34, 197, 94, 0.32);
    }
    .tn-navlink:hover { color: var(--brand); }
  }
  .tn-btn, .tn-card, .tn-navlink, .tn-icon-btn { -webkit-tap-highlight-color: transparent; }
  .tn-btn:active:not(:disabled), .tn-icon-btn:active { transform: scale(0.94); }
  .tn-focusable:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }

  .tn-title      { font-size: clamp(20px, 1.2vw + 16px, 28px); }
  .tn-greeting   { font-size: clamp(13px, 0.5vw + 11px, 15px); }
  .tn-subtext    { font-size: clamp(10px, 0.35vw + 8.5px, 12px); }
  .tn-hero-title { font-size: clamp(20px, 2vw + 12px, 34px); }
  .tn-hero-desc  { font-size: clamp(11px, 0.4vw + 9.5px, 13px); line-height: 1.55; }
  .tn-card-title { font-size: clamp(12px, 0.4vw + 10.5px, 14px); }
  .tn-card-desc  { font-size: clamp(10px, 0.3vw + 9px, 12px); line-height: 1.45; }
  .tn-btn-text   { font-size: clamp(10px, 0.3vw + 9px, 12px); }
  .tn-chip       { font-size: clamp(10px, 0.3vw + 9px, 11.5px); }
  .tn-nav-label  { font-size: clamp(9px, 0.25vw + 8.5px, 10.5px); }
  .tn-badge      { font-size: clamp(10px, 0.3vw + 9px, 12px); }

  .tn-icon-badge { width: clamp(34px, 3vw, 40px); height: clamp(34px, 3vw, 40px); }
  .tn-avatar     { width: clamp(38px, 3.2vw, 44px); height: clamp(38px, 3.2vw, 44px); }
  .tn-level-pill { min-width: clamp(36px, 3vw, 44px); height: clamp(36px, 3vw, 44px); }
  .tn-card-min   { min-height: clamp(138px, 15vw, 168px); }
  .tn-card-pad   { padding: clamp(12px, 1.6vw, 18px); }
  .tn-icon-tile  { width: clamp(30px, 2.6vw, 36px); height: clamp(30px, 2.6vw, 36px); }
  .tn-btn-h      { height: clamp(32px, 2.8vw, 38px); }
  .tn-btn-pad    { padding-left: clamp(12px, 1.2vw, 16px); padding-right: clamp(12px, 1.2vw, 16px); }

  .tn-coin-gold {
    color: var(--gold);
    background: linear-gradient(180deg, #fffbeb 0%, var(--gold-bg) 100%);
    border-color: var(--gold-border) !important;
  }
  .tn-coin-gold svg { color: var(--gold); }
  .tn-coin-gold-pulse {
    box-shadow: 0 0 16px rgba(217, 119, 6, 0.35) !important;
    border-color: var(--gold-soft) !important;
  }

  .tn-ptr {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 90;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 999px;
    box-shadow: 0 2px 10px rgba(17,24,39,0.08);
    color: var(--brand);
    font-weight: 700;
    pointer-events: none;
    transition: transform 0.2s var(--ease-premium), opacity 0.2s var(--ease-premium);
  }
`;

const LOADER_CSS = `
  @keyframes spinRing { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes spinRingReverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
  @keyframes pulseGlow { 0%, 100% { opacity: 0.55; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }
  @keyframes floatCoin { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-6px) rotate(180deg); } }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes dotBounce { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }
  @media (prefers-reduced-motion: reduce) { * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; } }
`;

function Home() {
  const location = useLocation();
  const FONT = "font-[Poppins,sans-serif]";

  const [profile, setProfile] = useState(null);
  const firstName = profile?.name?.split(" ")[0] || "Earner";
  const initials = firstName.charAt(0).toUpperCase();

  const [showNotification, setShowNotification] = useState(false);
  const [notificationText, setNotificationText] = useState("");

  const [coins, setCoins] = useState(0);
  const [xp, setXp] = useState(
    () => Number(localStorage.getItem("earnzyroXp")) || 40,
  );
  const [streak, setStreak] = useState(1);
  const [lastClaim, setLastClaim] = useState(
    () => localStorage.getItem("earnzyroLastClaim") || "",
  );
  const [coinPulse, setCoinPulse] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);

  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const touchStartYRef = useRef(null);

  const isMountedRef = useRef(true);
  const pulseTimerRef = useRef(null);
  const toastTimerRef = useRef(null);
  const requestIdRef = useRef(0);
  const claimingRef = useRef(false);

  const [claimingBonus, setClaimingBonus] = useState(false);
  const [claimError, setClaimError] = useState("");

  const [pageLoading, setPageLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!profileLoading) setPageLoading(false);
  }, [profileLoading]);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const level = Math.floor(xp / 100) + 1;
  const xpInLevel = xp % 100;
  const xpToNext = 100 - xpInLevel;
  const bonusClaimedToday = lastClaim === getToday();

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  const pulseCoins = useCallback(() => {
    if (!isMountedRef.current) return;
    setCoinPulse(true);
    if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    pulseTimerRef.current = setTimeout(() => {
      if (isMountedRef.current) setCoinPulse(false);
    }, 500);
  }, []);

  const loadProfile = useCallback(
    async ({ silent = false } = {}) => {
      const reqId = ++requestIdRef.current;
      try {
        if (!silent && isMountedRef.current) setProfileLoading(true);
        const data = await getProfile();
        if (reqId !== requestIdRef.current) return;
        if (!isMountedRef.current) return;

        setProfile(data.user);

        setCoins((prev) => {
          const next = data.user.coins || 0;
          if (next !== prev) pulseCoins();
          return next;
        });

        setStreak(data.user.streak || 1);

        if (data.user.lastClaimDate) {
          const serverClaim =
            typeof data.user.lastClaimDate === "string"
              ? data.user.lastClaimDate
              : new Date(data.user.lastClaimDate).toDateString();
          setLastClaim(serverClaim);
          localStorage.setItem("earnzyroLastClaim", serverClaim);
        }

        setLastSyncedAt(Date.now());
        setClaimError("");
      } catch (err) {
        console.error("Failed to refresh profile from backend:", err);
        if (reqId === requestIdRef.current && isMountedRef.current) {
          setClaimError("Could not load your data. Pull to refresh.");
        }
      } finally {
        if (reqId === requestIdRef.current && isMountedRef.current) {
          if (!silent) setProfileLoading(false);
        }
      }
    },
    [pulseCoins],
  );

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    loadProfile({ silent: true });
  }, [location.pathname, loadProfile]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        loadProfile({ silent: true });
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [loadProfile]);

  useEffect(() => {
    localStorage.setItem("earnzyroXp", xp);
  }, [xp]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((i) => (i + 1) % TRUST_MESSAGES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showPopup = useCallback((message) => {
    if (!isMountedRef.current) return;
    setNotificationText(message);
    setShowNotification(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      if (isMountedRef.current) setShowNotification(false);
    }, 2500);
  }, []);

  const manualRefresh = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    await loadProfile({ silent: true });
    if (isMountedRef.current) {
      setRefreshing(false);
      showPopup("Refreshed ✓");
    }
  }, [loadProfile, refreshing, showPopup]);

  const resetPull = () => {
    setPullDistance(0);
    touchStartYRef.current = null;
  };

  const onTouchStart = (e) => {
    if (window.scrollY > 0) return;
    touchStartYRef.current = e.touches[0].clientY;
  };
  const onTouchMove = (e) => {
    if (touchStartYRef.current == null) return;
    if (window.scrollY > 0) {
      resetPull();
      return;
    }
    const delta = e.touches[0].clientY - touchStartYRef.current;
    if (delta > 0) setPullDistance(Math.min(delta, 80));
  };
  const onTouchEnd = async () => {
    if (pullDistance > 55) {
      await manualRefresh();
    }
    resetPull();
  };
  const onTouchCancel = () => resetPull();

  const claimDailyBonus = useCallback(async () => {
    if (bonusClaimedToday || claimingRef.current) return;
    claimingRef.current = true;
    setClaimingBonus(true);
    setClaimError("");

    try {
      const hasServerClaim = false;
      if (!hasServerClaim) {
        throw new Error("CLAIM_NOT_WIRED");
      }

      await loadProfile({ silent: true });
      setXp((x) => x + 10);
      pulseCoins();
      showPopup(`Day ${streak + 1} streak — bonus coins added!`);
    } catch (err) {
      if (err?.message === "CLAIM_NOT_WIRED") {
        setClaimError(
          "Daily bonus server is being set up. Please try again soon.",
        );
        showPopup("Bonus unavailable right now — please retry later.");
      } else {
        console.error("claimDailyBonus failed:", err);
        setClaimError("Could not claim bonus. Please try again.");
        showPopup("Claim failed — please try again.");
      }
    } finally {
      claimingRef.current = false;
      if (isMountedRef.current) setClaimingBonus(false);
    }
  }, [bonusClaimedToday, streak, loadProfile, pulseCoins, showPopup]);

  const navItems = [
    { to: "/home", icon: HomeIcon, label: "Home" },
    { to: "/tasks", icon: ClipboardList, label: "Tasks" },
    { to: "/wallet", icon: Wallet, label: "Wallet" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  const cards = [
    {
      key: "bonus",
      icon: Gift,
      title: "Daily Bonus",
      desc: bonusClaimedToday
        ? "Come back tomorrow for more coins."
        : "Claim free 20 coins every day instantly.",
      btn: bonusClaimedToday
        ? "Claimed Today"
        : claimingBonus
          ? "Claiming…"
          : "Claim Coins",
      onClick: claimDailyBonus,
      disabled: bonusClaimedToday || claimingBonus,
      highlight: true,
    },
    {
      key: "tasks",
      icon: ClipboardList,
      title: "Complete Tasks",
      desc: "Finish simple tasks and earn reward coins.",
      btn: "Complete Now",
      to: "/tasks",
    },
    {
      key: "wallet",
      icon: Wallet,
      title: "Wallet",
      desc: "Check your balance and withdrawal details.",
      btn: "Open Wallet",
      to: "/wallet",
    },
    {
      key: "leaderboard",
      icon: Trophy,
      title: "Leaderboard",
      desc: "See how you rank against top earners.",
      btn: "View Ranks",
      onClick: () => showPopup("Leaderboard — Coming Soon 🏆"),
    },
    {
      key: "profile",
      icon: User,
      title: "Profile",
      desc: "Manage your account and personal information.",
      btn: "Open Profile",
      to: "/profile",
    },
    {
      key: "referral",
      icon: Users,
      title: "Invite Friends",
      desc: "Earn ₹50 in coins for every friend who joins.",
      btn: "Invite Now",
      to: "/referral",
    },
    {
      key: "spin",
      icon: RotateCw,
      title: "Lucky Spin",
      desc: "Spin the wheel and win exciting bonus coins.",
      btn: "Spin Now",
      to: "/lucky-spin",
    },
    {
      key: "support",
      icon: MessageCircle,
      title: "Support Chat",
      desc: "Chat with Earnzyro support instantly.",
      btn: "Open Chat",
      to: "/support-chat",
    },
  ];

  if (pageLoading) {
    return (
      <div
        className={`min-h-[100dvh] flex flex-col items-center justify-center text-[#111827] ${FONT} bg-[#F2F5F3]`}
      >
        <style>{LOADER_CSS}</style>

        <div className="relative w-[110px] h-[110px] flex items-center justify-center mb-6">
          <div
            className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(234,179,8,0.3),transparent_70%)] blur-[6px]"
            style={{ animation: "pulseGlow 1.6s ease-in-out infinite" }}
          />
          <div
            className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#f59e0b] border-r-[#f59e0b]/40"
            style={{ animation: "spinRing 1.1s linear infinite" }}
          />
          <div
            className="absolute inset-[14px] rounded-full border-[3px] border-transparent border-b-[#d97706] border-l-[#d97706]/40"
            style={{ animation: "spinRingReverse 1.4s linear infinite" }}
          />
          <div
            className="relative w-11 h-11 rounded-full bg-gradient-to-br from-[#fbbf24] to-[#d97706] text-white flex items-center justify-center shadow-[0_0_18px_rgba(217,119,6,0.45)]"
            style={{ animation: "floatCoin 1.6s ease-in-out infinite" }}
          >
            <Coins size={20} />
          </div>
        </div>

        <p
          className="text-[15px] font-extrabold bg-gradient-to-r from-[#d97706] to-[#111827] bg-clip-text text-transparent m-0 mb-2 tracking-wide"
          style={{ animation: "fadeInUp 0.4s ease both" }}
        >
          Loading Earnzyro
        </p>

        <div
          className="flex gap-1.5"
          style={{ animation: "fadeInUp 0.4s ease 0.1s both" }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-[6px] h-[6px] rounded-full bg-[#f59e0b]"
              style={{
                animation: "dotBounce 1.2s ease-in-out infinite",
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-[100dvh] text-[#111827] ${FONT} bg-[#F2F5F3]`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchCancel}
    >
      <style>{DESIGN_SYSTEM_CSS}</style>

      <div
        className="tn-ptr tn-subtext"
        style={{
          transform: `translate(-50%, ${Math.min(pullDistance, 60)}px)`,
          opacity: pullDistance > 10 ? Math.min(pullDistance / 60, 1) : 0,
        }}
      >
        {pullDistance > 55 ? "Release to refresh" : "Pull to refresh"}
        <RefreshCw
          size={12}
          style={{
            animation: refreshing ? "spinOnce 0.8s linear infinite" : "none",
          }}
        />
      </div>

      <div
        className="relative z-0"
        style={{ animation: "pageFadeIn 0.4s var(--ease-premium) both" }}
      >
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-[380px] pointer-events-none">
          {showNotification && (
            <div
              className="pointer-events-auto"
              style={{ animation: "toastIn 0.3s var(--ease-premium) both" }}
            >
              <Notification text={notificationText} />
            </div>
          )}
        </div>

        <div className="tn-shell relative z-10">
          <div className="tn-header flex justify-between items-center gap-[10px]">
            <h1 className="tn-title font-extrabold bg-gradient-to-r from-[#16a34a] to-[#111827] bg-clip-text text-transparent m-0 tracking-tight shrink-0">
              Earnzyro
            </h1>
            <div className="flex items-center gap-[6px] sm:gap-[8px] shrink-0">
              <Link to="/notification" className="tn-focusable rounded-xl">
                <button
                  type="button"
                  aria-label="Notifications"
                  className="tn-icon-btn tn-icon-badge relative bg-white border border-[#e5e7eb] rounded-xl flex items-center justify-center text-[#16a34a] cursor-pointer transition-[transform,border-color] duration-200 hover:border-[#22c55e]/60"
                >
                  <Bell size={15} />
                  {claimError && (
                    <span className="absolute top-[6px] right-[6px] w-[7px] h-[7px] rounded-full bg-[#ef4444] border-2 border-white" />
                  )}
                </button>
              </Link>
              <div className="tn-chip tn-icon-badge bg-white border border-[#e5e7eb] rounded-xl text-[#16a34a] font-bold flex items-center justify-center gap-[4px] px-[8px]">
                <Flame size={12} /> {streak}
              </div>
              <div
                className={`tn-chip tn-icon-badge tn-coin-gold border rounded-xl font-bold flex items-center justify-center gap-[5px] px-[8px] transition-all duration-300 ${
                  coinPulse ? "scale-[1.1] tn-coin-gold-pulse" : ""
                }`}
              >
                <Coins size={12} /> {coins.toLocaleString()}
              </div>
            </div>
          </div>

          {!isOnline && (
            <div className="tn-subtext flex items-center gap-2 bg-[#fffbeb] border border-[#fcd34d] text-[#92400e] rounded-xl px-3 py-2 mb-3">
              <WifiOff size={13} className="shrink-0" />
              <span className="truncate">
                You're offline — showing last synced data
              </span>
            </div>
          )}

          <div className="flex items-center gap-[10px] mb-3">
            <div className="relative shrink-0">
              <div className="tn-avatar rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] text-white flex items-center justify-center font-extrabold text-[14px] ring-2 ring-[#dcfce7] ring-offset-2 ring-offset-[#F2F5F3]">
                {initials}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="tn-greeting m-0 font-bold truncate">
                {getGreeting()}, {firstName}
              </p>
              <span className="tn-subtext text-[#6b7280] flex items-center gap-1.5">
                {lastSyncedAt ? `Synced ${timeAgo(lastSyncedAt)}` : "Syncing…"}
                {isOnline && (
                  <button
                    type="button"
                    onClick={manualRefresh}
                    disabled={refreshing}
                    aria-label="Refresh"
                    className="inline-flex items-center justify-center text-[#16a34a] hover:text-[#15803d] disabled:opacity-50 cursor-pointer bg-transparent border-none p-0"
                  >
                    <RefreshCw
                      size={11}
                      style={{
                        animation: refreshing
                          ? "spinOnce 0.8s linear infinite"
                          : "none",
                      }}
                    />
                  </button>
                )}
              </span>
            </div>
          </div>

          {claimError && (
            <div className="tn-subtext flex items-center gap-2 bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c] rounded-xl px-3 py-2 mb-3">
              <AlertCircle size={13} className="shrink-0" />
              <span className="truncate">{claimError}</span>
            </div>
          )}

          <div className="tn-chip bg-[#dcfce7] border border-[#bbf7d0] rounded-xl px-[14px] py-[9px] mb-[16px] flex items-center gap-2 text-[#166534] overflow-hidden">
            <Sparkles
              size={13}
              className="shrink-0"
              style={{ animation: "tickerDot 2s ease-in-out infinite" }}
            />
            <span
              className="animate-[fadeIn_0.4s_ease] truncate"
              key={tickerIndex}
            >
              {TRUST_MESSAGES[tickerIndex]}
            </span>
          </div>

          <div className="bg-white border border-[#e5e7eb] rounded-2xl px-[16px] py-[12px] mb-[16px] flex items-center gap-[12px]">
            <div className="tn-level-pill rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] text-white flex items-center justify-center font-extrabold tn-badge shrink-0">
              Lv{level}
            </div>
            <div className="flex-1 min-w-0">
              <div className="tn-subtext flex justify-between text-[#6b7280] mb-1.5">
                <span>
                  Level {level}{" "}
                  <span className="text-[#9ca3af]">
                    · {xpToNext} XP to Lv{level + 1}
                  </span>
                </span>
                <span>{xpInLevel}/100 XP</span>
              </div>
              <div className="relative h-1.5 rounded-md bg-[#f3f4f6] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#22c55e] to-[#16a34a] rounded-md transition-[width] duration-500 relative overflow-hidden"
                  style={{ width: `${xpInLevel}%` }}
                >
                  <span
                    className="absolute inset-y-0 left-0 w-1/3 bg-white/40 blur-[2px]"
                    style={{ animation: "shimmer 2.2s ease-in-out infinite" }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="relative bg-white border border-[#e5e7eb] rounded-[20px] p-[clamp(16px,2.6vw,32px)] mb-[20px] shadow-[0_1px_3px_rgba(17,24,39,0.04)] overflow-hidden">
            <p className="tn-subtext relative text-[#16a34a] mb-2 font-semibold flex items-center gap-1.5 tracking-wide">
              <Sparkles size={12} /> KEEP GOING
            </p>
            <h2 className="tn-hero-title relative leading-[1.2] m-0 mb-3 font-extrabold tracking-[-0.4px] max-w-[620px] text-[#111827]">
              Complete Tasks
              <br />
              Earn Rewards Faster
            </h2>
            <p className="tn-hero-desc relative text-[#6b7280] mb-4 max-w-[680px]">
              Welcome to Earnzyro — complete daily tasks, invite friends, claim
              bonuses, and earn reward coins instantly.
            </p>
            <Link
              to="/tasks"
              className="relative inline-block no-underline tn-focusable rounded-full"
            >
              <button
                type="button"
                className={`tn-btn tn-btn-text tn-btn-h tn-btn-pad bg-gradient-to-br from-[#22c55e] to-[#16a34a] border-none rounded-full font-bold cursor-pointer text-white w-fit shadow-[0_0_12px_rgba(34,197,94,0.22)] transition-transform duration-200 flex items-center gap-1.5 ${FONT}`}
              >
                Get Started <ChevronRight size={13} />
              </button>
            </Link>
          </div>

          <div className="tn-grid relative z-10">
            {cards.map((card, i) => {
              const Icon = card.icon;
              const inner = (
                <>
                  <div>
                    <div className="tn-icon-tile rounded-[10px] bg-[#dcfce7] text-[#16a34a] flex items-center justify-center mb-[10px]">
                      <Icon size={15} />
                    </div>
                    <h3 className="tn-card-title m-0 mb-1.5 font-bold text-[#111827]">
                      {card.title}
                    </h3>
                    <p
                      className="tn-card-desc text-[#6b7280] m-0"
                      style={CLAMP_2_LINES}
                    >
                      {card.desc}
                    </p>
                  </div>
                  <button
                    type="button"
                    className={`tn-btn tn-btn-text tn-btn-h tn-btn-pad bg-gradient-to-br from-[#22c55e] to-[#16a34a] border-none rounded-full font-bold cursor-pointer mt-[10px] text-white w-fit shadow-[0_0_10px_rgba(34,197,94,0.2)] transition-transform duration-200 ${FONT} ${
                      card.disabled
                        ? "opacity-60 cursor-not-allowed !bg-none bg-[#f3f4f6] text-[#9ca3af] shadow-none"
                        : ""
                    }`}
                    disabled={card.disabled}
                    onClick={
                      card.onClick && !card.to
                        ? (e) => {
                            e.preventDefault();
                            card.onClick();
                          }
                        : undefined
                    }
                  >
                    {card.btn}
                  </button>
                </>
              );

              const style = {
                animation: `cardIn 0.5s var(--ease-premium) both`,
                animationDelay: `${i * 0.06}s`,
              };
              const cardClass = `tn-card tn-focusable tn-card-min tn-card-pad relative bg-white border rounded-2xl shadow-[0_1px_3px_rgba(17,24,39,0.04)] flex flex-col justify-between no-underline text-inherit ${
                card.highlight ? "border-[#86efac]" : "border-[#e5e7eb]"
              }`;

              if (card.to) {
                return (
                  <Link
                    key={card.key}
                    to={card.to}
                    className={cardClass}
                    style={style}
                  >
                    {inner}
                  </Link>
                );
              }

              return (
                <div
                  key={card.key}
                  className={cardClass.replace("tn-focusable", "")}
                  style={style}
                >
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Nav - OUTSIDE ANIMATION WRAPPER TO FIX SCROLL */}
      <div
        className="fixed bottom-[15px] left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[420px] bg-white/95 border border-[#e5e7eb] rounded-[22px] flex justify-around items-center shadow-[0_4px_20px_rgba(17,24,39,0.08)] h-[62px]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`tn-navlink tn-focusable no-underline text-center font-semibold tn-nav-label flex flex-col items-center justify-center gap-[3px] min-w-[48px] h-full rounded-xl transition-all duration-300 ${
                isActive ? "text-[#16a34a] -translate-y-0.5" : "text-[#6b7280]"
              }`}
            >
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Home;

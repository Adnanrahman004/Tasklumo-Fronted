import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
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
} from "lucide-react";
import Notification from "../components/Notification";

function getToday() {
  return new Date().toDateString();
}

const TRUST_MESSAGES = [
  "Priya just earned 45 coins",
  "Rohan withdrew ₹500 to UPI",
  "Ananya completed a task and earned 30 coins",
  "Vikram just hit a 7 day streak",
  "Sneha invited a friend and earned 200 coins",
  "Arjun just claimed the daily bonus",
];

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
    () => Number(localStorage.getItem("taskniriXp")) || 40,
  );
  const [streak, setStreak] = useState(1);
  const [lastClaim, setLastClaim] = useState(
    () => localStorage.getItem("taskniriLastClaim") || "",
  );
  const [coinPulse, setCoinPulse] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);

  // Page-entry animation state — shows a branded loader before the
  // actual home content is revealed.
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const level = Math.floor(xp / 100) + 1;
  const xpInLevel = xp % 100;

  const bonusClaimedToday = lastClaim === getToday();

  // Backend (Firebase) hi coins/streak ka single source of truth hai.
  // localStorage sirf XP jaise purely-local, non-critical data ke liye
  // use hota hai — coins ab kabhi localStorage se nahi padhe jaate,
  // taaki coin hamesha backend ke actual value ko reflect kare.
  const [profileLoading, setProfileLoading] = useState(true);

  const loadProfile = async ({ silent = false } = {}) => {
    try {
      if (!silent) setProfileLoading(true);
      const data = await getProfile();

      setProfile(data.user);

      setCoins((prev) => {
        const next = data.user.coins || 0;
        if (next !== prev) pulseCoins();
        return next;
      });

      setStreak(data.user.streak || 1);
    } catch (err) {
      console.error("Failed to refresh profile from backend:", err);
    } finally {
      if (!silent) setProfileLoading(false);
    }
  };

  // 1) Pehli baar page load hote hi backend se fetch karo
  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Jab bhi user kisi bhi page pe navigate kare (Tasks, Lucky Spin,
  //    Wallet — kahin se bhi wapas aaye), backend se fresh coins/streak
  //    dobara fetch karo. Yehi wo fix hai jo "har baar backend se poochna"
  //    guarantee karta hai.
  useEffect(() => {
    loadProfile({ silent: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // 3) Tab wapas active/visible hone par bhi refresh kar lo — kaafi baar
  //    user doosre tab me task complete karke wapas is tab pe aata hai
  //    bina route change kiye, tab ye catch karega.
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem("taskniriXp", xp);
  }, [xp]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((i) => (i + 1) % TRUST_MESSAGES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const pulseCoins = () => {
    setCoinPulse(true);
    setTimeout(() => setCoinPulse(false), 500);
  };

  const showPopup = (message) => {
    setNotificationText(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2500);
  };

  const claimDailyBonus = async () => {
    if (bonusClaimedToday) return;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const newStreak = lastClaim === yesterday ? streak + 1 : 1;

    // NOTE: is button ke liye bhi backend/Firebase write chahiye
    // (jaise aapke Tasks page me CPA lead complete hone par hota hai),
    // warna yeh +20 coins sirf is browser tab me dikhega, database me
    // save nahi hoga aur reload/dusre device pe gayab ho jayega.
    // Agar aapke paas already koi claimDailyBonus / addCoins backend
    // function hai (Firebase Cloud Function ya Firestore update), use
    // yahan await karo, phir loadProfile() se fresh value le lo:
    //
    // await claimDailyBonusOnServer();
    // await loadProfile({ silent: true });

    setStreak(newStreak);
    setCoins((c) => c + 20);
    setXp((x) => x + 10);
    setLastClaim(getToday());
    localStorage.setItem("taskniriLastClaim", getToday());
    pulseCoins();
    showPopup(`Day ${newStreak} streak — 20 coins added`);
  };

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
      btn: bonusClaimedToday ? "Claimed Today" : "Claim Coins",
      onClick: claimDailyBonus,
      disabled: bonusClaimedToday,
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
      desc: "Chat with TaskNiri support instantly.",
      btn: "Open Chat",
      to: "/support-chat",
    },
  ];

  const clamp2Lines = {
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  };

  // ---------- Premium Entry Loader (identical on every screen size) ----------
  if (pageLoading) {
    return (
      <div
        className={`min-h-screen min-h-[100dvh] flex flex-col items-center justify-center text-white ${FONT}
        bg-[radial-gradient(circle_at_bottom_left,rgba(255,120,40,0.35),transparent_35%),radial-gradient(circle_at_top_right,rgba(255,140,0,0.22),transparent_28%),linear-gradient(135deg,#050505_0%,#0a0a0a_40%,#120909_100%)]`}
      >
        <style>{`
          @keyframes spinRing {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes spinRingReverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
          @keyframes pulseGlow {
            0%, 100% { opacity: 0.55; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.08); }
          }
          @keyframes floatCoin {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-6px) rotate(180deg); }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes dotBounce {
            0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
            40% { transform: scale(1); opacity: 1; }
          }
          @media (prefers-reduced-motion: reduce) {
            * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; }
          }
        `}</style>

        <div className="fixed inset-0 opacity-[0.04] bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="relative w-[110px] h-[110px] flex items-center justify-center mb-6">
          <div
            className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.35),transparent_70%)] blur-[6px]"
            style={{ animation: "pulseGlow 1.6s ease-in-out infinite" }}
          />
          <div
            className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#facc15] border-r-[#facc15]/40"
            style={{ animation: "spinRing 1.1s linear infinite" }}
          />
          <div
            className="absolute inset-[14px] rounded-full border-[3px] border-transparent border-b-[#ff9d3d] border-l-[#ff9d3d]/40"
            style={{ animation: "spinRingReverse 1.4s linear infinite" }}
          />
          <div
            className="relative w-11 h-11 rounded-full bg-gradient-to-br from-[#facc15] to-[#ffb300] text-black flex items-center justify-center shadow-[0_0_18px_rgba(250,204,21,0.5)]"
            style={{ animation: "floatCoin 1.6s ease-in-out infinite" }}
          >
            <Coins size={20} />
          </div>
        </div>

        <p
          className="text-[15px] font-extrabold bg-gradient-to-r from-[#facc15] to-white bg-clip-text text-transparent m-0 mb-2 tracking-wide"
          style={{ animation: "fadeInUp 0.4s ease both" }}
        >
          Loading TaskNiri
        </p>

        <div
          className="flex gap-1.5"
          style={{ animation: "fadeInUp 0.4s ease 0.1s both" }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-[6px] h-[6px] rounded-full bg-[#facc15]"
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
      className={`min-h-screen min-h-[100dvh] text-white ${FONT}
      bg-[radial-gradient(circle_at_bottom_left,rgba(255,120,40,0.35),transparent_35%),radial-gradient(circle_at_top_right,rgba(255,140,0,0.22),transparent_28%),linear-gradient(135deg,#050505_0%,#0a0a0a_40%,#120909_100%)]`}
    >
      {/* keyframes + shared responsive tokens. Using clamp() everywhere means
          type/spacing scale smoothly between phone and laptop instead of
          "jumping" at breakpoints — this is what keeps the UI feeling like
          the same product at every width. */}
      <style>{`
        :root {
          --gold: #facc15;
          --gold-deep: #eab308;
          --amber: #ff9d3d;
          --ease-premium: cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translate(-50%, -14px) scale(0.96); }
          to { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(220%); }
        }
        @keyframes pageFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroGlowDrift {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.55; }
          50% { transform: translate(-14px, 10px) scale(1.08); opacity: 0.8; }
        }
        @keyframes tickerDot {
          0%, 100% { opacity: 0.5; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
        }

        .tn-shell {
          max-width: 1180px;
          margin: 0 auto;
          padding: clamp(16px, 3vw, 32px) clamp(16px, 4vw, 40px) clamp(120px, 14vh, 140px);
          padding-top: max(clamp(16px, 3vw, 32px), env(safe-area-inset-top));
        }
        .tn-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(12px, 2vw, 20px);
        }
        @media (min-width: 640px) {
          .tn-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 1024px) {
          .tn-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (max-width: 340px) {
          .tn-grid { grid-template-columns: 1fr; }
        }
        .tn-card {
          transition: transform 0.35s var(--ease-premium), box-shadow 0.35s var(--ease-premium), border-color 0.35s var(--ease-premium);
        }
        @media (hover: hover) {
          .tn-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 28px rgba(250, 204, 21, 0.14);
            border-color: rgba(250, 204, 21, 0.4);
          }
          .tn-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(250, 204, 21, 0.32);
          }
          .tn-navlink:hover {
            color: var(--gold);
          }
        }
        .tn-btn, .tn-card, .tn-navlink, .tn-icon-btn {
          -webkit-tap-highlight-color: transparent;
        }
        .tn-btn:active:not(:disabled), .tn-icon-btn:active {
          transform: scale(0.94);
        }
        .tn-focusable:focus-visible {
          outline: 2px solid var(--gold);
          outline-offset: 2px;
        }
      `}</style>

      <div
        className="relative z-0"
        style={{ animation: "pageFadeIn 0.4s var(--ease-premium) both" }}
      >
        {/* faint grid texture for depth, matches the rest of the app */}
        <div className="fixed inset-0 opacity-[0.04] bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />

        {/* Fixed, top-centered, high z-index wrapper so the toast never
            overlaps/clashes with the header row or gets clipped */}
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
          {/* ---------- Header ---------- */}
          <div className="flex justify-between items-center mb-[16px] gap-[10px]">
            <h1 className="text-[clamp(24px,3vw+16px,34px)] font-extrabold bg-gradient-to-r from-[#facc15] to-white bg-clip-text text-transparent m-0 tracking-tight shrink-0">
              TaskNiri
            </h1>
            <div className="flex items-center gap-[6px] sm:gap-[8px] shrink-0">
              <Link to="/notification" className="tn-focusable rounded-xl">
                <button
                  aria-label="Notifications"
                  className="tn-icon-btn relative bg-[#111] border border-[#facc15]/[0.18] w-10 h-10 rounded-xl flex items-center justify-center text-[#facc15] cursor-pointer transition-[transform,border-color] duration-200 hover:border-[#facc15]/40"
                >
                  <Bell size={16} />
                  {!bonusClaimedToday && (
                    <span className="absolute top-[7px] right-[7px] w-[8px] h-[8px] rounded-full bg-[#ff5c5c] border-2 border-[#0a0a0a]" />
                  )}
                </button>
              </Link>
              <div className="bg-[#111] border border-[#facc15]/[0.18] h-10 px-[10px] rounded-xl text-[#ff9d3d] font-bold text-[11px] flex items-center gap-[5px]">
                <Flame size={12} /> {streak}
              </div>
              <div
                className={`bg-[#111] border border-[#facc15]/[0.18] h-10 px-[10px] rounded-xl text-[#facc15] font-bold text-[11px] flex items-center gap-[5px] transition-all duration-300 ${
                  coinPulse
                    ? "scale-[1.14] shadow-[0_0_18px_rgba(250,204,21,0.45)] border-[#facc15]/60"
                    : ""
                }`}
              >
                <Coins size={12} /> {coins.toLocaleString()}
              </div>
            </div>
          </div>

          {/* ---------- Greeting ---------- */}
          <div className="flex items-center gap-[10px] mb-3">
            <div className="relative w-11 h-11 shrink-0">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#facc15] to-[#ffb300] opacity-30 blur-[6px]" />
              <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-[#facc15] to-[#ffb300] text-black flex items-center justify-center font-extrabold text-[15px] ring-2 ring-[#facc15]/25 ring-offset-2 ring-offset-[#0a0a0a]">
                {initials}
              </div>
            </div>
            <div className="min-w-0">
              <p className="m-0 text-[15px] font-bold truncate">
                Welcome back, {firstName}
              </p>
              <span className="text-[11px] text-[#a1a1aa]">
                Here's what's happening today
              </span>
            </div>
          </div>

          {/* ---------- Live ticker ---------- */}
          <div className="bg-[#facc15]/[0.06] border border-[#facc15]/[0.14] rounded-xl px-[14px] py-[9px] mb-[16px] flex items-center gap-2 text-[11px] text-[#facc15] overflow-hidden">
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

          {/* ---------- XP card ---------- */}
          <div className="bg-[#111111]/[0.88] border border-[#facc15]/10 rounded-2xl px-[18px] py-[14px] mb-[16px] backdrop-blur-[18px] flex items-center gap-[14px]">
            <div className="min-w-[42px] h-[42px] rounded-full bg-gradient-to-br from-[#facc15] to-[#ffb300] text-black flex items-center justify-center font-extrabold text-[14px] shrink-0">
              Lv{level}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between text-[11px] text-[#a1a1aa] mb-1.5">
                <span>Level {level}</span>
                <span>{xpInLevel}/100 XP</span>
              </div>
              <div className="relative h-1.5 rounded-md bg-white/[0.08] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#facc15] to-[#ffb300] rounded-md transition-[width] duration-500 relative overflow-hidden"
                  style={{ width: `${xpInLevel}%` }}
                >
                  <span
                    className="absolute inset-y-0 left-0 w-1/3 bg-white/30 blur-[2px]"
                    style={{ animation: "shimmer 2.2s ease-in-out infinite" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ---------- Hero ---------- */}
          <div className="relative bg-[#111111]/[0.88] border border-[#facc15]/10 rounded-[22px] p-[clamp(18px,3vw,34px)] mb-[20px] shadow-[0_0_25px_rgba(250,204,21,0.05)] backdrop-blur-[18px] overflow-hidden">
            <div
              className="absolute -top-10 -right-10 w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.16),transparent_70%)] pointer-events-none"
              style={{ animation: "heroGlowDrift 8s ease-in-out infinite" }}
            />
            <p className="relative text-[#facc15] mb-2 font-semibold text-[11px] flex items-center gap-1.5 tracking-wide">
              <Sparkles size={12} /> KEEP GOING
            </p>
            <h2 className="relative text-[clamp(22px,3vw+14px,38px)] leading-[1.2] m-0 mb-3 font-extrabold tracking-[-0.5px] max-w-[620px]">
              Complete Tasks
              <br />
              Earn Rewards Faster
            </h2>
            <p className="relative text-[#a1a1aa] leading-[21px] mb-4 max-w-[680px] text-[12px]">
              Welcome to TaskNiri — complete daily tasks, invite friends, claim
              bonuses, and earn reward coins instantly.
            </p>
            <Link
              to="/tasks"
              className="relative inline-block no-underline tn-focusable rounded-full"
            >
              <button
                className={`tn-btn bg-gradient-to-br from-[#facc15] to-[#eab308] border-none px-5 h-10 rounded-full font-bold cursor-pointer text-black text-[12px] w-fit shadow-[0_0_12px_rgba(250,204,21,0.18)] transition-transform duration-200 flex items-center gap-1.5 ${FONT}`}
              >
                Get Started <ChevronRight size={14} />
              </button>
            </Link>
          </div>

          {/* ---------- Card grid ---------- */}
          <div className="tn-grid relative z-10">
            {cards.map((card, i) => {
              const Icon = card.icon;
              const inner = (
                <>
                  <div>
                    <div className="w-[34px] h-[34px] rounded-[10px] bg-[#facc15]/10 text-[#facc15] flex items-center justify-center mb-[10px]">
                      <Icon size={16} />
                    </div>
                    <h3 className="text-[13px] m-0 mb-1.5 font-bold text-white">
                      {card.title}
                    </h3>
                    <p
                      className="text-[#a1a1aa] leading-[16px] text-[11px] m-0"
                      style={clamp2Lines}
                    >
                      {card.desc}
                    </p>
                  </div>
                  <button
                    className={`tn-btn bg-gradient-to-br from-[#facc15] to-[#eab308] border-none px-[14px] h-9 rounded-full font-bold cursor-pointer mt-[12px] text-black text-[11px] w-fit shadow-[0_0_10px_rgba(250,204,21,0.16)] transition-transform duration-200 ${FONT} ${
                      card.disabled
                        ? "opacity-50 cursor-not-allowed bg-white/[0.08] !bg-none text-[#a1a1aa] shadow-none"
                        : ""
                    }`}
                    disabled={card.disabled}
                    onClick={
                      card.onClick
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
              const cardClass = `tn-card tn-focusable relative bg-[#111111]/[0.88] border rounded-2xl p-[clamp(14px,2vw,18px)] backdrop-blur-[18px] shadow-[0_0_18px_rgba(250,204,21,0.05)] min-h-[152px] sm:min-h-[168px] flex flex-col justify-between no-underline text-inherit ${
                card.highlight
                  ? "border-[#facc15]/45"
                  : "border-[#facc15]/[0.14]"
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
                <div key={card.key} className={cardClass} style={style}>
                  {inner}
                </div>
              );
            })}
          </div>
        </div>

        {/* ---------- Bottom nav ---------- */}
        <div
          className="fixed bottom-[15px] left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-[420px] bg-[#111111]/90 border border-[#facc15]/[0.12] rounded-[22px] flex justify-around items-center backdrop-blur-[18px] shadow-[0_0_25px_rgba(0,0,0,0.35)] h-[62px]"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`tn-navlink tn-focusable no-underline text-center font-semibold text-[10px] flex flex-col items-center justify-center gap-[3px] min-w-[48px] h-full rounded-xl transition-all duration-300 ${
                  isActive
                    ? "text-[#facc15] -translate-y-0.5"
                    : "text-[#a1a1aa]"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Home;

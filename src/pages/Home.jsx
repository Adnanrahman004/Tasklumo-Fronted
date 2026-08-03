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
    () => Number(localStorage.getItem("tasklumoXp")) || 40,
  );
  const [streak, setStreak] = useState(1);
  const [lastClaim, setLastClaim] = useState(
    () => localStorage.getItem("tasklumoLastClaim") || "",
  );
  const [coinPulse, setCoinPulse] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);

  // Page-entry animation state — shows a 0.3s branded loader before the
  // actual home content is revealed.
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const level = Math.floor(xp / 100) + 1;
  const xpInLevel = xp % 100;

  const bonusClaimedToday = lastClaim === getToday();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();

        setProfile(data.user);
        setCoins(data.user.coins || 0);
        setStreak(data.user.streak || 1);
      } catch (err) {
        console.error(err);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    localStorage.setItem("tasklumoCoins", coins);
  }, [coins]);

  useEffect(() => {
    localStorage.setItem("tasklumoXp", xp);
  }, [xp]);

  useEffect(() => {
    localStorage.setItem("tasklumoStreak", streak);
  }, [streak]);

  // Jab bhi user Lucky Spin page se wapas Home pe aaye, coins ko localStorage se refresh kar lo
  useEffect(() => {
    const latest = Number(localStorage.getItem("tasklumoCoins")) || 0;
    if (latest !== coins) {
      setCoins(latest);
      pulseCoins();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

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

  const claimDailyBonus = () => {
    if (bonusClaimedToday) return;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const newStreak = lastClaim === yesterday ? streak + 1 : 1;
    setStreak(newStreak);
    setCoins((c) => c + 20);
    setXp((x) => x + 10);
    setLastClaim(getToday());
    localStorage.setItem("tasklumoLastClaim", getToday());
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
      desc: "Chat with TaskLumo support instantly.",
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

  // ---------- 0.3s Premium Entry Loader ----------
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
          {/* soft glow behind everything */}
          <div
            className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.35),transparent_70%)] blur-[6px]"
            style={{ animation: "pulseGlow 1.6s ease-in-out infinite" }}
          />

          {/* outer ring */}
          <div
            className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#facc15] border-r-[#facc15]/40"
            style={{ animation: "spinRing 1.1s linear infinite" }}
          />

          {/* inner ring, opposite direction */}
          <div
            className="absolute inset-[14px] rounded-full border-[3px] border-transparent border-b-[#ff9d3d] border-l-[#ff9d3d]/40"
            style={{ animation: "spinRingReverse 1.4s linear infinite" }}
          />

          {/* center coin */}
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
          Loading TaskLumo
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
      className={`min-h-screen min-h-[100dvh] p-4 pb-[120px] sm:p-5 text-white ${FONT}
      bg-[radial-gradient(circle_at_bottom_left,rgba(255,120,40,0.35),transparent_35%),radial-gradient(circle_at_top_right,rgba(255,140,0,0.22),transparent_28%),linear-gradient(135deg,#050505_0%,#0a0a0a_40%,#120909_100%)]`}
      style={{ paddingTop: "max(16px, env(safe-area-inset-top))" }}
    >
      {/* keyframes Tailwind's stock utilities can't express */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translate(-50%, -12px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(220%); }
        }
        @keyframes pageFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; }
        }
        @media (max-width: 340px) {
          .card-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div
        className="relative z-0"
        style={{ animation: "pageFadeIn 0.35s ease both" }}
      >
        {/* faint grid texture for depth, matches the rest of the app */}
        <div className="fixed inset-0 opacity-[0.04] bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />

        {/* Fixed, top-centered, high z-index wrapper so the toast never
            overlaps/clashes with the header row or gets clipped */}
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-[380px] pointer-events-none">
          {showNotification && (
            <div
              className="pointer-events-auto animate-[toastIn_0.25s_ease]"
              style={{ animationFillMode: "both" }}
            >
              <Notification text={notificationText} />
            </div>
          )}
        </div>

        <div className="relative z-10 flex justify-between items-center mb-[14px] gap-[10px]">
          <h1 className="text-[clamp(24px,7vw,40px)] font-extrabold bg-gradient-to-r from-[#facc15] to-white bg-clip-text text-transparent m-0 tracking-tight shrink-0">
            TASKLUMO
          </h1>
          <div className="flex items-center gap-[6px] sm:gap-[7px] shrink-0">
            {/* 40px tap target, kept visually tight via icon-only pill */}
            <Link to="/notification">
              <button
                aria-label="Notifications"
                className="relative bg-[#111] border border-[#facc15]/[0.18] w-10 h-10 rounded-xl flex items-center justify-center text-[#facc15] cursor-pointer active:scale-95 transition-transform hover:border-[#facc15]/40"
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
              className={`bg-[#111] border border-[#facc15]/[0.18] h-10 px-[10px] rounded-xl text-[#facc15] font-bold text-[11px] flex items-center gap-[5px] transition-all duration-200 ${
                coinPulse
                  ? "scale-[1.12] shadow-[0_0_16px_rgba(250,204,21,0.4)]"
                  : ""
              }`}
            >
              <Coins size={12} /> {coins.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-[10px] mb-3">
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

        <div className="relative z-10 bg-[#facc15]/[0.06] border border-[#facc15]/[0.14] rounded-xl px-[14px] py-[9px] mb-[14px] flex items-center gap-2 text-[11px] text-[#facc15] overflow-hidden">
          <Sparkles size={13} className="shrink-0" />
          <span
            className="animate-[fadeIn_0.4s_ease] truncate"
            key={tickerIndex}
          >
            {TRUST_MESSAGES[tickerIndex]}
          </span>
        </div>

        <div className="relative z-10 bg-[#111111]/[0.88] border border-[#facc15]/10 rounded-2xl px-[18px] py-[14px] mb-[14px] backdrop-blur-[18px] flex items-center gap-[14px]">
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
                className="h-full bg-gradient-to-r from-[#facc15] to-[#ffb300] rounded-md transition-[width] duration-[400ms] relative overflow-hidden"
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

        <div className="relative z-10 bg-[#111111]/[0.88] border border-[#facc15]/10 rounded-[22px] p-[18px] sm:p-[30px] mb-[18px] shadow-[0_0_25px_rgba(250,204,21,0.05)] backdrop-blur-[18px] overflow-hidden">
          <div className="absolute -top-10 -right-10 w-[160px] h-[160px] rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.14),transparent_70%)] pointer-events-none" />
          <p className="relative text-[#facc15] mb-2 font-semibold text-[11px] flex items-center gap-1.5">
            <Sparkles size={12} /> KEEP GOING
          </p>
          <h2 className="relative text-[clamp(22px,5vw,34px)] leading-[1.2] m-0 mb-3 font-extrabold tracking-[-0.5px] max-w-[620px]">
            Complete Tasks
            <br />
            Earn Rewards Faster
          </h2>
          <p className="relative text-[#a1a1aa] leading-[21px] mb-4 max-w-[680px] text-[12px]">
            Welcome to TaskLumo — complete daily tasks, invite friends, claim
            bonuses, and earn reward coins instantly.
          </p>
          <Link to="/tasks" className="relative inline-block no-underline">
            {/* pill CTA, 40px tall but reads compact due to rounded-full + tight text */}
            <button
              className={`bg-gradient-to-br from-[#facc15] to-[#eab308] border-none px-5 h-10 rounded-full font-bold cursor-pointer text-black text-[12px] w-fit shadow-[0_0_12px_rgba(250,204,21,0.18)] transition-all duration-200 active:scale-95 hover:-translate-y-0.5 hover:shadow-[0_4px_18px_rgba(250,204,21,0.3)] flex items-center gap-1.5 ${FONT}`}
            >
              Get Started <ChevronRight size={14} />
            </button>
          </Link>
        </div>

        <div className="card-grid relative z-10 grid grid-cols-2 sm:[grid-template-columns:repeat(auto-fit,minmax(190px,1fr))] gap-3 sm:gap-4">
          {cards.map((card, i) => {
            const Icon = card.icon;
            const inner = (
              <>
                <div>
                  <div className="w-[32px] h-[32px] rounded-[10px] bg-[#facc15]/10 text-[#facc15] flex items-center justify-center mb-[9px]">
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
                {/* pill button, 36px tall — reads premium, still comfortably tappable */}
                <button
                  className={`bg-gradient-to-br from-[#facc15] to-[#eab308] border-none px-[14px] h-9 rounded-full font-bold cursor-pointer mt-[10px] text-black text-[11px] w-fit shadow-[0_0_10px_rgba(250,204,21,0.16)] transition-all duration-150 active:scale-95 ${FONT} ${
                    card.disabled
                      ? "opacity-50 cursor-not-allowed bg-white/[0.08] !bg-none text-[#a1a1aa] shadow-none"
                      : "hover:-translate-y-0.5"
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

            const style = { animationDelay: `${i * 0.05}s` };
            const cardClass = `relative bg-[#111111]/[0.88] border rounded-2xl p-[14px] sm:p-4 backdrop-blur-[18px] shadow-[0_0_18px_rgba(250,204,21,0.05)] transition-all duration-200 min-h-[150px] xs:min-h-[160px] sm:min-h-[178px] flex flex-col justify-between no-underline text-inherit animate-[cardIn_0.4s_ease_both] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(250,204,21,0.12)] hover:border-[#facc15]/35 ${
              card.highlight ? "border-[#facc15]/45" : "border-[#facc15]/[0.14]"
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
                className={`no-underline text-center font-semibold text-[10px] flex flex-col items-center justify-center gap-[3px] min-w-[48px] h-full transition-all duration-200 ${
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

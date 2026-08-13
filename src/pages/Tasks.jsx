import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProfile } from "../services/authServices";
import {
  User,
  Home as HomeIcon,
  ClipboardList,
  Wallet as WalletIcon,
  BarChart3,
  Megaphone,
  Video,
  Download,
  Coins,
  Clock,
  Flame,
  ShieldCheck,
  X,
  Sparkles,
  LayoutGrid,
} from "lucide-react";

function Tasks() {
  const location = useLocation();
  const navigate = useNavigate();
  const FONT = "font-[Poppins,sans-serif]";

  const [coins, setCoins] = useState(0);
  const completedToday = 5;
  const totalToday = 12;
  const progressPct = Math.round((completedToday / totalToday) * 100);
  const coinsEarnedToday = 185;

  const [showPopup, setShowPopup] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  // Page-entry animation state — shows a 0.5s branded loader before the
  // actual tasks content is revealed.
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        setCoins(data.user.coins || 0);
      } catch (err) {
        console.error(err);
      }
    };
    loadProfile();
  }, []);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowPopup(true);
    // Future:
    // Open company offerwall here
  };

  const navItems = [
    { to: "/home", icon: HomeIcon, label: "Home" },
    { to: "/tasks", icon: ClipboardList, label: "Tasks" },
    { to: "/wallet", icon: WalletIcon, label: "Wallet" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  const tasks = [
    {
      key: "survey",
      icon: BarChart3,
      title: "Survey",
      desc: "Complete surveys and earn coins.",
      reward: 50,
      time: "5 min",
      action: "Start",
      category: "survey",
    },
    {
      key: "ads",
      icon: Megaphone,
      title: "Ads",
      desc: "Watch ads and collect rewards.",
      reward: 10,
      time: "30 sec",
      action: "Watch",
      category: "ads",
    },
    {
      key: "videos",
      icon: Video,
      title: "Videos",
      desc: "Watch videos and unlock rewards.",
      reward: 15,
      time: "2 min",
      action: "Play",
      category: "videos",
    },
    {
      key: "apps",
      icon: Download,
      title: "Apps",
      desc: "Install apps and earn coins.",
      reward: 80,
      time: "1 min",
      action: "Install",
      category: "apps",
    },
  ];

  const bestRewardKey = tasks.reduce((best, t) =>
    t.reward > best.reward ? t : best,
  ).key;

  const categories = [
    { key: "all", label: "All", icon: LayoutGrid },
    { key: "survey", label: "Survey", icon: BarChart3 },
    { key: "ads", label: "Ads", icon: Megaphone },
    { key: "videos", label: "Videos", icon: Video },
    { key: "apps", label: "Apps", icon: Download },
  ];

  const visibleTasks =
    activeCategory === "all"
      ? tasks
      : tasks.filter((t) => t.category === activeCategory);

  const clamp2Lines = {
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  };

  // ---------- 0.5s Premium Entry Loader ----------
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
          Loading your tasks
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
      className={`min-h-screen min-h-[100dvh] p-4 pb-[105px] sm:p-5 text-white ${FONT}
      bg-[radial-gradient(circle_at_bottom_left,rgba(255,120,40,0.35),transparent_35%),radial-gradient(circle_at_top_right,rgba(255,140,0,0.22),transparent_28%),linear-gradient(135deg,#050505_0%,#0a0a0a_40%,#120909_100%)]`}
      style={{ paddingTop: "max(16px, env(safe-area-inset-top))" }}
    >
      {/* keyframe Tailwind's stock utilities can't express */}
      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes overlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popupIn {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pageFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; }
        }
        @media (max-width: 340px) {
          .task-grid { grid-template-columns: 1fr !important; }
        }
        .cat-scroll::-webkit-scrollbar { display: none; }
        .task-btn {
          background: linear-gradient(135deg, #facc15, #eab308);
          border: none;
          padding: 9px 0;
          border-radius: 9px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 10px;
          color: #000;
          font-size: 11px;
          box-shadow: 0 0 12px rgba(250,204,21,0.18);
          transition: transform 0.15s ease;
          width: 100%;
          font-family: Poppins, sans-serif;
        }
        .task-btn:hover { transform: translateY(-2px); }
      `}</style>

      <div
        className="relative z-0"
        style={{ animation: "pageFadeIn 0.35s ease both" }}
      >
        {/* faint grid texture for depth, matches the rest of the app */}
        <div className="fixed inset-0 opacity-[0.04] bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />

        <div className="relative z-10 flex justify-between items-center mb-4 gap-2.5">
          <div className="min-w-0">
            <h1 className="text-[clamp(22px,6vw,34px)] font-extrabold bg-gradient-to-r from-[#facc15] to-white bg-clip-text text-transparent m-0 mb-1 flex items-center gap-2 truncate">
              <ClipboardList size={22} color="#facc15" className="shrink-0" />{" "}
              Tasks
            </h1>
            <p className="text-[#a1a1aa] text-[11px] m-0">
              Complete tasks and earn rewards instantly.
            </p>
          </div>

          <div className="bg-[#111] border border-[#facc15]/[0.18] px-3 py-[7px] rounded-[10px] text-[#facc15] font-bold text-[11px] max-[359px]:text-[10px] max-[359px]:px-2 max-[359px]:py-[5px] flex items-center gap-[5px] shrink-0">
            <Coins size={13} /> {coins.toLocaleString()}
          </div>
        </div>

        <div className="relative z-10 bg-[#111111]/[0.88] border border-[#facc15]/10 rounded-[18px] px-[18px] py-4 mb-4 backdrop-blur-[18px] animate-[cardIn_0.4s_ease_both]">
          <div className="flex justify-between items-center mb-[10px]">
            <p className="text-[12px] font-bold m-0 flex items-center gap-1.5">
              <Flame size={14} color="#facc15" /> Today's progress
            </p>
            <span className="text-[12px] text-[#facc15] font-bold">
              {completedToday}/{totalToday}
            </span>
          </div>
          <div className="w-full h-2 rounded-md bg-white/[0.06] overflow-hidden">
            <div
              className="h-full rounded-md bg-gradient-to-r from-[#facc15] to-[#eab308] transition-[width] duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-[#a1a1aa] text-[10px] m-0">
              Finish {totalToday - completedToday} more tasks today to keep your
              streak alive.
            </p>
            <span className="shrink-0 flex items-center gap-1 text-[10px] font-bold text-[#facc15] bg-[#facc15]/10 px-2 py-[3px] rounded-full whitespace-nowrap">
              <Coins size={10} /> +{coinsEarnedToday} today
            </span>
          </div>
        </div>

        <div className="relative z-10 flex gap-[8px] mb-4 overflow-x-auto cat-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((c) => {
            const CatIcon = c.icon;
            const isActive = activeCategory === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setActiveCategory(c.key)}
                className={`shrink-0 flex items-center gap-1.5 px-[13px] h-9 rounded-full text-[11.5px] font-bold border transition-colors duration-150 ${FONT} ${
                  isActive
                    ? "bg-gradient-to-br from-[#facc15] to-[#eab308] text-black border-transparent"
                    : "bg-[#111111]/[0.88] text-[#a1a1aa] border-[#facc15]/[0.14] hover:border-[#facc15]/35"
                }`}
              >
                <CatIcon size={13} /> {c.label}
              </button>
            );
          })}
        </div>

        {visibleTasks.length === 0 ? (
          <div className="relative z-10 bg-[#111111]/[0.88] border border-[#facc15]/[0.12] rounded-2xl p-8 text-center backdrop-blur-[18px]">
            <p className="text-[#a1a1aa] text-[12px] m-0">
              No tasks in this category right now.
            </p>
          </div>
        ) : (
          <div className="task-grid relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-[10px] sm:gap-4 max-[359px]:gap-2">
            {visibleTasks.map((t) => {
              const Icon = t.icon;
              const isBest = t.key === bestRewardKey;
              const isApps = t.key === "apps";
              return (
                <div
                  className={`relative bg-[#111111]/[0.88] border rounded-2xl p-[14px] sm:p-4 max-[359px]:p-[11px] backdrop-blur-[18px] shadow-[0_0_18px_rgba(250,204,21,0.05)] transition-all duration-[250ms] flex flex-col justify-between min-h-[165px] sm:min-h-[195px] max-[359px]:min-h-[155px] cursor-pointer animate-[cardIn_0.4s_ease_both] hover:-translate-y-1 hover:border-[#facc15]/35 ${
                    isBest ? "border-[#facc15]/40" : "border-[#facc15]/[0.12]"
                  }`}
                  key={t.key}
                >
                  {isBest && (
                    <span className="absolute -top-2 left-3 bg-gradient-to-r from-[#facc15] to-[#ff8f00] text-black text-[8.5px] font-extrabold px-2 py-[3px] rounded-full flex items-center gap-1 shadow-[0_2px_8px_rgba(250,204,21,0.35)]">
                      <Sparkles size={9} /> Best reward
                    </span>
                  )}

                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div className="w-[34px] h-[34px] rounded-[10px] bg-[#facc15]/10 text-[#facc15] flex items-center justify-center shrink-0">
                        <Icon size={17} />
                      </div>
                      <div className="bg-[#facc15]/10 text-[#facc15] text-[9px] font-bold px-[7px] py-1 rounded-[20px] flex items-center gap-[3px] whitespace-nowrap">
                        <Coins size={10} /> +{t.reward}
                      </div>
                    </div>

                    <h2 className="text-[14px] sm:text-[16px] max-[359px]:text-[12px] m-0 mb-[5px] font-bold">
                      {t.title}
                    </h2>
                    <p
                      className="text-[#a1a1aa] leading-4 sm:leading-[18px] text-[10px] sm:text-[12px] max-[359px]:text-[9px] m-0"
                      style={clamp2Lines}
                    >
                      {t.desc}
                    </p>

                    {!isApps && (
                      <div className="flex items-center gap-1 text-[#a1a1aa] text-[9px] mt-2">
                        <Clock size={11} /> {t.time}
                      </div>
                    )}
                  </div>

                  {isApps ? (
                    <button
                      onClick={() => navigate("/offerwall")}
                      className="task-btn"
                    >
                      Install App Tasks
                    </button>
                  ) : (
                    <button
                      onClick={() => handleTaskClick(t)}
                      className={`bg-gradient-to-br from-[#facc15] to-[#eab308] border-none py-[9px] rounded-[9px] font-bold cursor-pointer mt-[10px] text-black text-[11px] shadow-[0_0_12px_rgba(250,204,21,0.18)] transition-transform duration-150 w-full hover:-translate-y-0.5 ${FONT}`}
                    >
                      {t.action}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div
          className="fixed bottom-[15px] left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-[420px] h-16 bg-[#111111]/90 border border-[#facc15]/[0.12] rounded-[22px] flex justify-around items-center backdrop-blur-[18px] shadow-[0_0_25px_rgba(0,0,0,0.35)]"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`no-underline text-center font-semibold text-[10px] flex flex-col items-center gap-[3px] transition-all duration-200 ${
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

        {showPopup && selectedTask && (
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 px-4 sm:px-5"
            style={{ animation: "overlayIn 0.2s ease both" }}
            onClick={() => setShowPopup(false)}
          >
            <div
              className={`relative bg-[#111111] border border-[#facc15]/[0.18] rounded-[22px] p-5 sm:p-7 w-full max-w-[340px] sm:max-w-sm text-center shadow-[0_0_40px_rgba(0,0,0,0.55)] ${FONT}`}
              style={{
                animation: "popupIn 0.28s cubic-bezier(0.16,1,0.3,1) both",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* close button */}
              <button
                onClick={() => setShowPopup(false)}
                aria-label="Close"
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-[#a1a1aa] hover:text-white flex items-center justify-center transition-colors duration-150"
              >
                <X size={16} />
              </button>

              {/* icon badge */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#facc15]/10 border border-[#facc15]/20 text-[#facc15] flex items-center justify-center mx-auto mb-4">
                <selectedTask.icon size={26} />
              </div>

              <h2 className="text-[17px] sm:text-[19px] font-bold text-white m-0 mb-2">
                {selectedTask.title} — Coming Soon
              </h2>

              <p className="text-[#a1a1aa] text-[12px] sm:text-[13px] leading-[19px] m-0 px-1">
                This task type isn't live yet. We're onboarding verified,
                trusted partners so every reward you earn here is safe and
                guaranteed.
              </p>

              {/* trust badge */}
              <div className="flex items-center justify-center gap-1.5 mt-4 mb-5 text-[10px] sm:text-[11px] text-[#4ade80] font-semibold bg-[#4ade80]/10 border border-[#4ade80]/20 rounded-full px-3 py-[6px] w-fit mx-auto">
                <ShieldCheck size={13} /> Verified &amp; secure rewards
              </div>

              <button
                onClick={() => setShowPopup(false)}
                className={`w-full bg-gradient-to-br from-[#facc15] to-[#eab308] text-black font-bold py-3 rounded-[12px] text-[13px] shadow-[0_0_16px_rgba(250,204,21,0.2)] transition-transform duration-150 hover:-translate-y-0.5 ${FONT}`}
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Tasks;

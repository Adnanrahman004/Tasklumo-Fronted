import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { getProfile } from "../services/authServices";
import {
  User,
  Home as HomeIcon,
  ClipboardList,
  Wallet as WalletIcon,
  Megaphone,
  Video,
  Download,
  Coins,
  Clock,
  ShieldCheck,
  X,
  Sparkles,
  LayoutGrid,
  FileText,
  Search,
} from "lucide-react";

function Tasks() {
  const location = useLocation();
  const navigate = useNavigate();
  const FONT = "font-[Poppins,sans-serif]";

  const [coins, setCoins] = useState(0);
  const [coinPulse, setCoinPulse] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [pageLoading, setPageLoading] = useState(true);
  const [showCPXSurvey, setShowCPXSurvey] = useState(false);
  const [cpxUrl, setCpxUrl] = useState("");

  const [showCPXSuccess, setShowCPXSuccess] = useState(false);
  const [earnedCoins, setEarnedCoins] = useState(0);

  const [logoFailed, setLogoFailed] = useState({});
  const markLogoFailed = (key) =>
    setLogoFailed((prev) => ({ ...prev, [key]: true }));

  // Ad Banner Ref & Scale (for responsiveness)
  const adWrapRef = useRef(null);
  const [adScale, setAdScale] = useState(1);
  const AD_W = 728;
  const AD_H = 90;

  useEffect(() => {
    const computeScale = () => {
      if (!adWrapRef.current) return;
      const available = adWrapRef.current.offsetWidth;
      const next = Math.min(1, available / AD_W);
      setAdScale(next);
    };
    computeScale();
    window.addEventListener("resize", computeScale);
    return () => window.removeEventListener("resize", computeScale);
  }, []);

  // SINGLE AD BANNER SCRIPT
  const adBannerSrcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          html, body { margin: 0; padding: 0; width: 728px; height: 90px; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = { 'key' : '1daf843f1ff89f87c1aa7e1eb0a173a3', 'format' : 'iframe', 'height' : 90, 'width' : 728, 'params' : {} };
        </script>
        <script type="text/javascript" src="https://www.highperformanceformat.com/1daf843f1ff89f87c1aa7e1eb0a173a3/invoke.js"></script>
      </body>
    </html>
  `;

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const pulseCoins = useCallback(() => {
    setCoinPulse(true);
    setTimeout(() => setCoinPulse(false), 500);
  }, []);

  const loadProfile = useCallback(
    async ({ silent = false } = {}) => {
      try {
        const data = await getProfile();
        setCoins((prev) => {
          const next = data.user.coins || 0;
          if (next !== prev) pulseCoins();
          return next;
        });
      } catch (err) {
        console.error("Failed to refresh profile from backend:", err);
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
    const params = new URLSearchParams(window.location.search);
    const cpxStatus = params.get("cpx_status");
    const coinsParam = Number(params.get("coins") || 0);
    if (cpxStatus === "success") {
      setEarnedCoins(coinsParam);
      setShowCPXSuccess(true);
      loadProfile({ silent: true });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [loadProfile]);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowPopup(true);
  };

  const openCPXSurvey = async () => {
    try {
      const data = await getProfile();
      const user = data.user;
      const uniqueUserId = user.userId || user.uid || user.id || user._id;
      if (!uniqueUserId) {
        alert("User ID nahi mila. Please login again.");
        return;
      }
      const url =
        `https://offers.cpx-research.com/index.php` +
        `?app_id=35896` +
        `&ext_user_id=${encodeURIComponent(uniqueUserId)}` +
        `&username=${encodeURIComponent(user.username || "")}` +
        `&email=${encodeURIComponent(user.email || "")}` +
        `&subid_1=` +
        `&subid_2=`;
      setCpxUrl(url);
      setShowCPXSurvey(true);
    } catch (error) {
      console.error("CPX Survey error:", error);
      alert("Survey open nahi ho raha. Please try again.");
    }
  };

  const navItems = [
    { to: "/home", icon: HomeIcon, label: "Home" },
    { to: "/tasks", icon: ClipboardList, label: "Tasks" },
    { to: "/wallet", icon: WalletIcon, label: "Wallet" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  const tasks = [
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
      title: "CPAlead",
      desc: "Install apps and earn coins.",
      reward: 80,
      time: "1 min",
      action: "Open",
      category: "apps",
      direct: true,
      route: "/offerwall",
    },
    {
      key: "survey",
      icon: FileText,
      title: "CPX Research",
      desc: "Complete survey, earn high coin.",
      reward: 50,
      time: "3 min",
      action: "Open Survey",
      category: "survey",
      cpx: true,
    },
  ];

  const bestRewardKey = tasks.reduce((best, t) =>
    t.reward > best.reward ? t : best,
  ).key;

  const categories = [
    { key: "all", label: "All", icon: LayoutGrid },
    { key: "ads", label: "Ads", icon: Megaphone },
    { key: "videos", label: "Videos", icon: Video },
    { key: "apps", label: "CPAlead", icon: Download },
    { key: "survey", label: "CPX Research", icon: FileText },
  ];

  const visibleTasks = tasks.filter((t) => {
    const matchCategory =
      activeCategory === "all" || t.category === activeCategory;
    const matchSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const clamp2Lines = {
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  };

  if (pageLoading) {
    return (
      <div
        className={`min-h-[100dvh] flex flex-col items-center justify-center text-[#111827] ${FONT} bg-[#F2F5F3]`}
      >
        <style>{`
          @keyframes spinRing { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes spinRingReverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
          @keyframes pulseGlow { 0%, 100% { opacity: 0.55; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }
          @keyframes floatCoin { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-6px) rotate(180deg); } }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes dotBounce { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }
          @media (prefers-reduced-motion: reduce) { * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; } }
        `}</style>

        <div className="relative w-[110px] h-[110px] flex items-center justify-center mb-6">
          <div
            className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.3),transparent_70%)] blur-[6px]"
            style={{ animation: "pulseGlow 1.6s ease-in-out infinite" }}
          />
          <div
            className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#22c55e] border-r-[#22c55e]/40"
            style={{ animation: "spinRing 1.1s linear infinite" }}
          />
          <div
            className="absolute inset-[14px] rounded-full border-[3px] border-transparent border-b-[#16a34a] border-l-[#16a34a]/40"
            style={{ animation: "spinRingReverse 1.4s linear infinite" }}
          />
          <div
            className="relative w-11 h-11 rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] text-white flex items-center justify-center shadow-[0_0_18px_rgba(34,197,94,0.45)]"
            style={{ animation: "floatCoin 1.6s ease-in-out infinite" }}
          >
            <Coins size={20} />
          </div>
        </div>
        <p
          className="text-[15px] font-extrabold bg-gradient-to-r from-[#16a34a] to-[#111827] bg-clip-text text-transparent m-0 mb-2 tracking-wide"
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
              className="w-[6px] h-[6px] rounded-full bg-[#22c55e]"
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
    <div className={`min-h-[100dvh] text-[#111827] ${FONT} bg-[#F2F5F3]`}>
      <style>{`
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
          --ease-premium: cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes cardIn { from { opacity: 0; transform: translateY(14px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popupIn { from { opacity: 0; transform: translateY(16px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes pageFadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
        }

        .tn-shell {
          max-width: 1180px;
          margin: 0 auto;
          padding-left: clamp(16px, 4vw, 40px);
          padding-right: clamp(16px, 4vw, 40px);
          padding-bottom: clamp(100px, 14vh, 120px);
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

        .task-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(10px, 1.6vw, 16px);
        }
        @media (min-width: 640px) { .task-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1024px) { .task-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (max-width: 340px) { .task-grid { grid-template-columns: 1fr; } }

        .cat-scroll::-webkit-scrollbar { display: none; }

        .task-card {
          transition: transform 0.35s var(--ease-premium), box-shadow 0.35s var(--ease-premium), border-color 0.35s var(--ease-premium);
          animation: cardIn 0.5s var(--ease-premium) both;
        }
        @media (hover: hover) {
          .task-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 28px rgba(34, 197, 94, 0.16);
            border-color: rgba(34, 197, 94, 0.45);
          }
          .task-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(34, 197, 94, 0.32); }
          .cat-pill:hover { border-color: rgba(34, 197, 94, 0.4); }
        }

        /* Responsive Compact Button for Mobile */
        .task-btn {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          border: none;
          padding: clamp(6px, 1.2vw, 10px) 0;
          border-radius: 99px;
          font-weight: 700;
          cursor: pointer;
          margin-top: clamp(6px, 1vw, 12px);
          color: #fff;
          font-size: clamp(9.5px, 0.3vw + 9px, 12px);
          box-shadow: 0 0 12px rgba(34, 197, 94, 0.22);
          transition: transform 0.2s var(--ease-premium), box-shadow 0.2s var(--ease-premium);
          width: 100%;
          font-family: Poppins, sans-serif;
          -webkit-tap-highlight-color: transparent;
        }
        .task-btn:active { transform: scale(0.96); }

        .tn-focusable:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }
        
        .ad-slot {
          width: 100%; display: flex; justify-content: center; align-items: center; overflow: hidden;
          border-radius: 14px; background: #fff; border: 1px solid var(--border); padding: 8px 0;
        }

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
        
        .tn-chip { font-size: clamp(10px, 0.3vw + 9px, 11.5px); }
        .tn-icon-badge { width: clamp(34px, 3vw, 40px); height: clamp(34px, 3vw, 40px); }
      `}</style>

      {/* Main Content Area (Animated) */}
      <div
        className="relative z-0"
        style={{ animation: "pageFadeIn 0.4s var(--ease-premium) both" }}
      >
        <div className="tn-shell relative z-10">
          {/* Header with Fixed Golden Coin Box */}
          <div className="tn-header flex justify-between items-center gap-2.5">
            <div className="min-w-0">
              <h1 className="text-[clamp(20px,1.2vw+16px,28px)] font-extrabold bg-gradient-to-r from-[#16a34a] to-[#111827] bg-clip-text text-transparent m-0 mb-1 flex items-center gap-2 truncate">
                <ClipboardList size={22} className="text-[#16a34a] shrink-0" />{" "}
                Tasks
              </h1>
              <p className="text-[#6b7280] text-[clamp(10px,0.3vw+8px,12px)] m-0 truncate">
                Complete tasks and earn rewards instantly.
              </p>
            </div>

            {/* Golden Coin Box - Clean & Responsive */}
            <div
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl font-bold transition-all duration-300 shrink-0 ${
                coinPulse ? "scale-105 shadow-md" : ""
              }`}
              style={{
                background: "linear-gradient(180deg, #FFFBEB 0%, #FEF3C7 100%)",
                border: "1px solid #FCD34D",
                color: "#D97706",
              }}
            >
              <Coins size={14} className="shrink-0" />
              <span className="text-[clamp(11px,3vw,13px)]">
                {coins.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af]"
            />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#e5e7eb] text-[#111827] rounded-xl py-2 pl-10 pr-4 text-[12px] sm:text-[14px] outline-none focus:border-[#22c55e] transition-colors shadow-sm"
            />
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 mb-5 overflow-x-auto cat-scroll -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
            {categories.map((c) => {
              const CatIcon = c.icon;
              const isActive = activeCategory === c.key;
              return (
                <button
                  key={c.key}
                  onClick={() => setActiveCategory(c.key)}
                  className={`cat-pill tn-focusable shrink-0 flex items-center gap-1.5 px-3.5 h-8 rounded-full text-[11px] sm:text-[12px] font-bold border transition-colors duration-200 ${FONT} ${
                    isActive
                      ? "bg-gradient-to-br from-[#22c55e] to-[#16a34a] text-white border-transparent shadow-sm"
                      : "bg-white text-[#6b7280] border-[#e5e7eb]"
                  }`}
                >
                  <CatIcon size={13} /> {c.label}
                </button>
              );
            })}
          </div>

          {/* Task Grid */}
          {visibleTasks.length === 0 ? (
            <div className="bg-white border border-[#e5e7eb] rounded-2xl p-10 text-center shadow-sm">
              <Search size={32} className="mx-auto text-[#9ca3af] mb-3" />
              <h3 className="text-[#111827] font-bold text-[15px] m-0 mb-1">
                No tasks found
              </h3>
              <p className="text-[#6b7280] text-[13px] m-0">
                Try a different category or search term.
              </p>
            </div>
          ) : (
            <div className="task-grid">
              {visibleTasks.map((t, i) => {
                const Icon = t.icon;
                const isBest = t.key === bestRewardKey;
                const isDirect = !!t.direct;
                return (
                  <div
                    className={`task-card tn-focusable relative bg-white border rounded-2xl p-[clamp(10px,1.5vw,16px)] shadow-[0_1px_3px_rgba(17,24,39,0.04)] flex flex-col justify-between min-h-[clamp(130px,15vw,160px)] cursor-pointer ${
                      isBest ? "border-[#86efac]" : "border-[#e5e7eb]"
                    }`}
                    style={{ animationDelay: `${i * 0.06}s` }}
                    key={t.key}
                  >
                    {isBest && (
                      <span className="absolute -top-2 left-3 bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white text-[8px] uppercase tracking-wider font-bold px-2 py-[3px] rounded-full flex items-center gap-1 shadow-sm">
                        <Sparkles size={9} /> Top
                      </span>
                    )}

                    <div>
                      <div className="flex justify-between items-start mb-1.5">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] bg-[#dcfce7] text-[#16a34a] flex items-center justify-center shrink-0 overflow-hidden">
                          {t.key === "apps" && !logoFailed.apps ? (
                            <img
                              src="https://cdndn.s3.us-west-1.amazonaws.com/logo/logo.webp"
                              alt="CPAlead"
                              onError={() => markLogoFailed("apps")}
                              className="w-full h-full object-contain p-[4px] bg-white rounded-[10px]"
                            />
                          ) : t.key === "survey" && !logoFailed.survey ? (
                            <img
                              src="https://www.cpx-research.com/main/en/assets/img/logo.png"
                              alt="CPX Research"
                              referrerPolicy="no-referrer"
                              onError={() => markLogoFailed("survey")}
                              className="w-full h-full object-contain p-[4px] bg-white rounded-[10px]"
                            />
                          ) : (
                            <Icon size={15} />
                          )}
                        </div>
                      </div>

                      <h2 className="text-[13px] sm:text-[14px] m-0 mb-1 font-bold text-[#111827] leading-tight">
                        {t.title}
                      </h2>
                      <p
                        className="text-[#6b7280] text-[10px] sm:text-[11px] leading-[1.4] m-0"
                        style={clamp2Lines}
                      >
                        {t.desc}
                      </p>

                      {!isDirect && (
                        <div className="flex items-center gap-1 text-[#9ca3af] text-[9px] sm:text-[10px] mt-1.5 font-medium">
                          <Clock size={10} /> {t.time}
                        </div>
                      )}
                    </div>

                    {t.cpx ? (
                      <button
                        onClick={openCPXSurvey}
                        className="task-btn tn-focusable"
                      >
                        {t.action}
                      </button>
                    ) : isDirect ? (
                      <button
                        onClick={() => navigate(t.route)}
                        className="task-btn tn-focusable"
                      >
                        {t.action}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleTaskClick(t)}
                        className="task-btn tn-focusable"
                      >
                        {t.action}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Ad Banner - SINGLE & FIXED */}
          <div className="mt-6 mb-2">
            <div
              ref={adWrapRef}
              className="ad-slot"
              style={{ height: AD_H * adScale }}
            >
              <div
                style={{
                  width: AD_W,
                  height: AD_H,
                  transform: `scale(${adScale})`,
                  transformOrigin: "center center",
                }}
              >
                <iframe
                  title="ad-banner"
                  srcDoc={adBannerSrcDoc}
                  width={AD_W}
                  height={AD_H}
                  style={{
                    border: "none",
                    background: "transparent",
                    display: "block",
                  }}
                  scrolling="no"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Nav (Fixed & Unaffected by Scroll) */}
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
              className={`tn-focusable no-underline text-center font-semibold text-[10px] flex flex-col items-center justify-center gap-[3px] min-w-[48px] h-full rounded-xl transition-all duration-300 ${
                isActive ? "text-[#16a34a] -translate-y-0.5" : "text-[#6b7280]"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Popups & Modals */}
      {showCPXSurvey && cpxUrl && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="h-full w-full flex flex-col">
            <div
              className="h-14 shrink-0 flex items-center justify-between px-4 bg-white border-b border-[#e5e7eb]"
              style={{ paddingTop: "env(safe-area-inset-top)" }}
            >
              <h2 className={`text-[#111827] font-bold text-sm ${FONT}`}>
                Complete Survey
              </h2>
              <button
                onClick={() => setShowCPXSurvey(false)}
                aria-label="Close survey"
                className="tn-focusable w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-[#111827] flex items-center justify-center transition-colors duration-150"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 bg-white overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                src={cpxUrl}
                title="CPX Research Survey"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}

      {showCPXSuccess && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 sm:px-5"
          style={{ animation: "overlayIn 0.2s ease both" }}
          onClick={() => setShowCPXSuccess(false)}
        >
          <div
            className={`relative bg-white border border-[#e5e7eb] rounded-3xl p-5 sm:p-7 w-full max-w-[340px] sm:max-w-sm text-center shadow-xl ${FONT}`}
            style={{ animation: "popupIn 0.28s var(--ease-premium) both" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowCPXSuccess(false)}
              aria-label="Close"
              className="tn-focusable absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-[#6b7280] flex items-center justify-center transition-colors duration-150"
            >
              <X size={16} />
            </button>
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#dcfce7] text-[#16a34a] flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={26} />
            </div>
            <h2 className="text-[17px] sm:text-[19px] font-bold text-[#111827] m-0 mb-2">
              Task Completed!
            </h2>
            <p className="text-[#6b7280] text-[12px] sm:text-[13px] leading-[19px] m-0 px-1">
              Your survey has been completed successfully.
            </p>
            {earnedCoins > 0 && (
              <div className="flex items-center justify-center gap-1.5 mt-4 mb-1 text-[13px] sm:text-[14px] text-[#d97706] font-bold bg-[#fef3c7] border border-[#fcd34d] rounded-full px-4 py-[8px] w-fit mx-auto">
                <Coins size={14} /> +{earnedCoins} Coins
              </div>
            )}
            <button
              onClick={() => setShowCPXSuccess(false)}
              className={`tn-focusable w-full mt-5 bg-gradient-to-br from-[#22c55e] to-[#16a34a] text-white font-bold py-3 rounded-xl text-[13px] shadow-[0_4px_14px_rgba(34,197,94,0.3)] transition-transform duration-150 hover:-translate-y-0.5 ${FONT}`}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {showPopup && selectedTask && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4 sm:px-5"
          style={{ animation: "overlayIn 0.2s ease both" }}
          onClick={() => setShowPopup(false)}
        >
          <div
            className={`relative bg-white border border-[#e5e7eb] rounded-3xl p-5 sm:p-7 w-full max-w-[340px] sm:max-w-sm text-center shadow-xl ${FONT}`}
            style={{ animation: "popupIn 0.28s var(--ease-premium) both" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPopup(false)}
              aria-label="Close"
              className="tn-focusable absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-[#6b7280] flex items-center justify-center transition-colors duration-150"
            >
              <X size={16} />
            </button>
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#dcfce7] text-[#16a34a] flex items-center justify-center mx-auto mb-4">
              <selectedTask.icon size={26} />
            </div>
            <h2 className="text-[17px] sm:text-[19px] font-bold text-[#111827] m-0 mb-2">
              {selectedTask.title} — Coming Soon
            </h2>
            <p className="text-[#6b7280] text-[12px] sm:text-[13px] leading-[19px] m-0 px-1">
              This task type isn't live yet. We're onboarding verified, trusted
              partners so every reward you earn here is safe and guaranteed.
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-4 mb-5 text-[10px] sm:text-[11px] text-[#166534] font-semibold bg-[#dcfce7] border border-[#bbf7d0] rounded-full px-3 py-[6px] w-fit mx-auto">
              <ShieldCheck size={13} /> Verified &amp; secure rewards
            </div>
            <button
              onClick={() => setShowPopup(false)}
              className={`tn-focusable w-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] text-white font-bold py-3 rounded-xl text-[13px] shadow-[0_4px_14px_rgba(34,197,94,0.3)] transition-transform duration-150 hover:-translate-y-0.5 ${FONT}`}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;

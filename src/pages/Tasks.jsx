import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
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

  const [pageLoading, setPageLoading] = useState(true);
  const [showCPXSurvey, setShowCPXSurvey] = useState(false);
  const [cpxUrl, setCpxUrl] = useState("");

  // CPX Research redirect ke baad ka success popup — jab user survey
  // complete karke ?cpx_status=success&coins=XX ke saath wapas is page
  // par redirect hota hai.
  const [showCPXSuccess, setShowCPXSuccess] = useState(false);
  const [earnedCoins, setEarnedCoins] = useState(0);

  // Kuch third-party logos hotlink-protected hote hain ya kabhi load fail
  // ho sakte hain — agar image error de to us task ke liye chup-chaap
  // wapas normal lucide icon par fallback kar do, taaki box khaali na dikhe.
  const [logoFailed, setLogoFailed] = useState({});
  const markLogoFailed = (key) =>
    setLogoFailed((prev) => ({ ...prev, [key]: true }));

  // Ad banner ka script hardcoded 728x90 maangta hai — width/height ko
  // directly chhota karne se ad load hi nahi hota. Isliye asli size
  // fixed rakhte hain aur poore wrapper ko CSS transform:scale() se
  // container ki available width ke hisaab se sikoड़te hain. Iframe ke
  // baad wrapper ki height bhi scale ke hisaab se adjust hoti hai taaki
  // scale hone ke baad neeche khaali jagah na bache.
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

  // 728x90 leaderboard ad. srcDoc me isolated iframe document use kar rahe
  // hain kyunki yeh network document.write use karta hai jo React-rendered
  // page me directly daalne par silently fail ho jaata hai. Iframe ke
  // andar hi width/height fixed 728x90 di gayi hai — yeh script ka apna
  // requirement hai, ise chhote na karo warna ad load hi nahi hoga.
  const adBannerSrcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          html, body {
            margin: 0;
            padding: 0;
            width: 728px;
            height: 90px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: transparent;
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : '1daf843f1ff89f87c1aa7e1eb0a173a3',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highperformanceformat.com/1daf843f1ff89f87c1aa7e1eb0a173a3/invoke.js"></script>
      </body>
    </html>
  `;

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const pulseCoins = () => {
    setCoinPulse(true);
    setTimeout(() => setCoinPulse(false), 500);
  };

  const loadProfile = async ({ silent = false } = {}) => {
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
  };

  // 1) Page load hote hi backend se fetch
  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadProfile({ silent: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

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

  // CPX Research se success redirect handle karna. Jab user survey
  // complete karke ?cpx_status=success&coins=XX ke saath is page par
  // wapas aata hai, to success popup dikhao aur coins turant refresh
  // kar do (backend already postback se update kar chuka hoga).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cpxStatus = params.get("cpx_status");
    const coinsParam = Number(params.get("coins") || 0);
    if (cpxStatus === "success") {
      setEarnedCoins(coinsParam);
      setShowCPXSuccess(true);
      loadProfile({ silent: true });
      // URL se parameters hata do taaki refresh par dobara popup na aaye
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowPopup(true);
  };

  // secure_hash abhi intentionally frontend me nahi daala hai — CPX Research
  // ke docs ke hisaab se yeh MD5(ext_user_id + secret_key) hota hai, aur
  // secret_key sirf backend par hi rehna chahiye. Jab backend endpoint ready
  // ho jaye jo signed URL (ya sirf secure_hash) return kare, tab yahan use
  // wire karna hoga.
  const openCPXSurvey = async () => {
    try {
      const data = await getProfile();
      const user = data.user;
      // Tumhare backend user ka unique ID
      const uniqueUserId = user.userId || user.uid || user.id || user._id;
      if (!uniqueUserId) {
        alert("User ID nahi mila. Please login again.");
        return;
      }
      const url =
        `https://offers.cpx-research.com/index.php` +
        `?app_id=35548` +
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

  // "direct" tasks navigate straight to a route instead of opening the
  // "coming soon" popup — same pattern as the CPAlead card.
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

  // ---------- Premium loader (identical pattern across the whole app) ----------
  if (pageLoading) {
    return (
      <div
        className={`min-h-screen min-h-[100dvh] flex flex-col items-center justify-center text-white ${FONT}
        bg-[radial-gradient(circle_at_bottom_left,rgba(255,120,40,0.35),transparent_35%),radial-gradient(circle_at_top_right,rgba(255,140,0,0.22),transparent_28%),linear-gradient(135deg,#050505_0%,#0a0a0a_40%,#120909_100%)]`}
      >
        <style>{`
          @keyframes spinRing { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes spinRingReverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
          @keyframes pulseGlow { 0%, 100% { opacity: 0.55; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }
          @keyframes floatCoin { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-6px) rotate(180deg); } }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes dotBounce { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }
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
      className={`min-h-screen min-h-[100dvh] text-white ${FONT}
      bg-[radial-gradient(circle_at_bottom_left,rgba(255,120,40,0.35),transparent_35%),radial-gradient(circle_at_top_right,rgba(255,140,0,0.22),transparent_28%),linear-gradient(135deg,#050505_0%,#0a0a0a_40%,#120909_100%)]`}
    >
      {/* Shared responsive tokens — same system as Home.jsx so the whole
          app scales identically between phone and laptop instead of
          feeling like two different products. */}
      <style>{`
        :root { --ease-premium: cubic-bezier(0.16, 1, 0.3, 1); }
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
          padding: clamp(16px, 3vw, 32px) clamp(16px, 4vw, 40px) clamp(110px, 13vh, 130px);
          padding-top: max(clamp(16px, 3vw, 32px), env(safe-area-inset-top));
        }
        .task-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(10px, 1.6vw, 16px);
        }
        @media (min-width: 640px) {
          .task-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 1024px) {
          .task-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (max-width: 340px) {
          .task-grid { grid-template-columns: 1fr; }
        }

        .cat-scroll::-webkit-scrollbar { display: none; }

        .task-card {
          transition: transform 0.35s var(--ease-premium), box-shadow 0.35s var(--ease-premium), border-color 0.35s var(--ease-premium);
          animation: cardIn 0.5s var(--ease-premium) both;
        }
        @media (hover: hover) {
          .task-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 28px rgba(250, 204, 21, 0.14);
            border-color: rgba(250, 204, 21, 0.4);
          }
          .task-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(250,204,21,0.32); }
          .cat-pill:hover { border-color: rgba(250,204,21,0.4); }
        }

        .task-btn {
          background: linear-gradient(135deg, #facc15, #eab308);
          border: none;
          padding: 10px 0;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 10px;
          color: #000;
          font-size: 11px;
          box-shadow: 0 0 12px rgba(250,204,21,0.18);
          transition: transform 0.2s var(--ease-premium), box-shadow 0.2s var(--ease-premium);
          width: 100%;
          font-family: Poppins, sans-serif;
          -webkit-tap-highlight-color: transparent;
        }
        .task-btn:active { transform: scale(0.96); }

        .tn-focusable:focus-visible { outline: 2px solid #facc15; outline-offset: 2px; }

        /* Ad banner wrapper — asli iframe hamesha 728x90 hi rehta hai
           (ad script ki requirement), lekin poora block CSS transform se
           screen width ke hisaab se scale down hota hai, isliye mobile pe
           bahut lamba/wide nahi lagta aur horizontal scroll bhi nahi
           chahiye padta. */
        .ad-slot {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          border-radius: 14px;
          background: rgba(17,17,17,0.6);
          border: 1px solid rgba(250,204,21,0.10);
          padding: 8px 0;
        }
      `}</style>

      <div
        className="relative z-0"
        style={{ animation: "pageFadeIn 0.4s var(--ease-premium) both" }}
      >
        <div className="fixed inset-0 opacity-[0.04] bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />

        <div className="tn-shell relative z-10">
          {/* ---------- Header ---------- */}
          <div className="flex justify-between items-center mb-4 gap-2.5">
            <div className="min-w-0">
              <h1 className="text-[clamp(22px,3vw+12px,30px)] font-extrabold bg-gradient-to-r from-[#facc15] to-white bg-clip-text text-transparent m-0 mb-1 flex items-center gap-2 truncate">
                <ClipboardList size={22} color="#facc15" className="shrink-0" />{" "}
                Tasks
              </h1>
              <p className="text-[#a1a1aa] text-[11px] m-0">
                Complete tasks and earn rewards instantly.
              </p>
            </div>

            <div
              className={`bg-[#111] border border-[#facc15]/[0.18] px-3 py-[7px] rounded-[10px] text-[#facc15] font-bold text-[11px] max-[359px]:text-[10px] max-[359px]:px-2 max-[359px]:py-[5px] flex items-center gap-[5px] shrink-0 transition-all duration-300 ${
                coinPulse
                  ? "scale-[1.14] shadow-[0_0_18px_rgba(250,204,21,0.45)] border-[#facc15]/60"
                  : ""
              }`}
            >
              <Coins size={13} /> {coins.toLocaleString()}
            </div>
          </div>

          {/* ---------- Category pills ---------- */}
          <div className="flex gap-[8px] mb-5 overflow-x-auto cat-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((c) => {
              const CatIcon = c.icon;
              const isActive = activeCategory === c.key;
              return (
                <button
                  key={c.key}
                  onClick={() => setActiveCategory(c.key)}
                  className={`cat-pill tn-focusable shrink-0 flex items-center gap-1.5 px-[13px] h-9 rounded-full text-[11.5px] font-bold border transition-colors duration-200 ${FONT} ${
                    isActive
                      ? "bg-gradient-to-br from-[#facc15] to-[#eab308] text-black border-transparent"
                      : "bg-[#111111]/[0.88] text-[#a1a1aa] border-[#facc15]/[0.14]"
                  }`}
                >
                  <CatIcon size={13} /> {c.label}
                </button>
              );
            })}
          </div>

          {/* ---------- Task grid ---------- */}
          {visibleTasks.length === 0 ? (
            <div className="bg-[#111111]/[0.88] border border-[#facc15]/[0.12] rounded-2xl p-8 text-center backdrop-blur-[18px]">
              <p className="text-[#a1a1aa] text-[12px] m-0">
                No tasks in this category right now.
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
                    className={`task-card tn-focusable relative bg-[#111111]/[0.88] border rounded-2xl p-[clamp(13px,1.6vw,18px)] backdrop-blur-[18px] shadow-[0_0_18px_rgba(250,204,21,0.05)] flex flex-col justify-between min-h-[168px] sm:min-h-[195px] max-[359px]:min-h-[155px] cursor-pointer ${
                      isBest ? "border-[#facc15]/40" : "border-[#facc15]/[0.12]"
                    }`}
                    style={{ animationDelay: `${i * 0.06}s` }}
                    key={t.key}
                  >
                    {isBest && (
                      <span className="absolute -top-2 left-3 bg-gradient-to-r from-[#facc15] to-[#ff8f00] text-black text-[8.5px] font-extrabold px-2 py-[3px] rounded-full flex items-center gap-1 shadow-[0_2px_8px_rgba(250,204,21,0.35)]">
                        <Sparkles size={9} /> Best reward
                      </span>
                    )}

                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div className="w-[34px] h-[34px] rounded-[10px] bg-[#facc15]/10 text-[#facc15] flex items-center justify-center shrink-0 overflow-hidden">
                          {t.key === "apps" && !logoFailed.apps ? (
                            <img
                              src="https://cdndn.s3.us-west-1.amazonaws.com/logo/logo.webp"
                              alt="CPAlead"
                              onError={() => markLogoFailed("apps")}
                              className="w-full h-full object-contain p-[5px] bg-white rounded-[10px]"
                            />
                          ) : t.key === "survey" && !logoFailed.survey ? (
                            <img
                              src="https://www.cpx-research.com/main/en/assets/img/logo.png"
                              alt="CPX Research"
                              referrerPolicy="no-referrer"
                              onError={() => markLogoFailed("survey")}
                              className="w-full h-full object-contain p-[5px] bg-white rounded-[10px]"
                            />
                          ) : (
                            <Icon size={17} />
                          )}
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

                      {!isDirect && (
                        <div className="flex items-center gap-1 text-[#a1a1aa] text-[9px] mt-2">
                          <Clock size={11} /> {t.time}
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

          {/* ---------- Ad banner — cards ke neeche, bottom nav se upar ---------- */}
          <div className="mt-5 mb-2">
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

        {/* ---------- Bottom nav ---------- */}
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
                className={`tn-focusable no-underline text-center font-semibold text-[10px] flex flex-col items-center gap-[3px] rounded-xl transition-all duration-300 ${
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

        {/* ---------- CPX Research Survey (full-screen) ---------- */}
        {showCPXSurvey && cpxUrl && (
          <div className="fixed inset-0 z-50 bg-black">
            <div className="h-full w-full flex flex-col">
              {/* Header */}
              <div
                className="h-14 shrink-0 flex items-center justify-between px-4 bg-[#111] border-b border-[#facc15]/20"
                style={{ paddingTop: "env(safe-area-inset-top)" }}
              >
                <h2 className={`text-white font-bold text-sm ${FONT}`}>
                  Complete Survey
                </h2>
                <button
                  onClick={() => setShowCPXSurvey(false)}
                  aria-label="Close survey"
                  className="tn-focusable w-9 h-9 rounded-full bg-white/10 hover:bg-white/[0.18] text-white flex items-center justify-center transition-colors duration-150"
                >
                  <X size={18} />
                </button>
              </div>
              {/* CPX Research */}
              <div className="flex-1 bg-white overflow-hidden">
                <iframe
                  width="100%"
                  height="2000px"
                  frameBorder="0"
                  src={cpxUrl}
                  title="CPX Research Survey"
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          </div>
        )}

        {/* ---------- CPX Success Popup ---------- */}
        {showCPXSuccess && (
          <div
            className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm flex items-center justify-center px-4 sm:px-5"
            style={{ animation: "overlayIn 0.2s ease both" }}
            onClick={() => setShowCPXSuccess(false)}
          >
            <div
              className={`relative bg-[#111111] border border-[#facc15]/[0.18] rounded-[22px] p-5 sm:p-7 w-full max-w-[340px] sm:max-w-sm text-center shadow-[0_0_40px_rgba(0,0,0,0.55)] ${FONT}`}
              style={{ animation: "popupIn 0.28s var(--ease-premium) both" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowCPXSuccess(false)}
                aria-label="Close"
                className="tn-focusable absolute top-3 right-3 w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-[#a1a1aa] hover:text-white flex items-center justify-center transition-colors duration-150"
              >
                <X size={16} />
              </button>

              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={26} />
              </div>

              <h2 className="text-[17px] sm:text-[19px] font-bold text-white m-0 mb-2">
                Task Completed Successfully!
              </h2>

              <p className="text-[#a1a1aa] text-[12px] sm:text-[13px] leading-[19px] m-0 px-1">
                Your survey has been completed successfully.
              </p>

              {earnedCoins > 0 && (
                <div className="flex items-center justify-center gap-1.5 mt-4 mb-1 text-[13px] sm:text-[14px] text-[#facc15] font-bold bg-[#facc15]/10 border border-[#facc15]/20 rounded-full px-4 py-[8px] w-fit mx-auto">
                  <Coins size={14} /> +{earnedCoins} Coins
                </div>
              )}

              <button
                onClick={() => setShowCPXSuccess(false)}
                className={`tn-focusable w-full mt-5 bg-gradient-to-br from-[#facc15] to-[#eab308] text-black font-bold py-3 rounded-[12px] text-[13px] shadow-[0_0_16px_rgba(250,204,21,0.2)] transition-transform duration-150 hover:-translate-y-0.5 ${FONT}`}
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* ---------- Task popup ---------- */}
        {showPopup && selectedTask && (
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 px-4 sm:px-5"
            style={{ animation: "overlayIn 0.2s ease both" }}
            onClick={() => setShowPopup(false)}
          >
            <div
              className={`relative bg-[#111111] border border-[#facc15]/[0.18] rounded-[22px] p-5 sm:p-7 w-full max-w-[340px] sm:max-w-sm text-center shadow-[0_0_40px_rgba(0,0,0,0.55)] ${FONT}`}
              style={{
                animation: "popupIn 0.28s var(--ease-premium) both",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPopup(false)}
                aria-label="Close"
                className="tn-focusable absolute top-3 right-3 w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-[#a1a1aa] hover:text-white flex items-center justify-center transition-colors duration-150"
              >
                <X size={16} />
              </button>

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

              <div className="flex items-center justify-center gap-1.5 mt-4 mb-5 text-[10px] sm:text-[11px] text-[#4ade80] font-semibold bg-[#4ade80]/10 border border-[#4ade80]/20 rounded-full px-3 py-[6px] w-fit mx-auto">
                <ShieldCheck size={13} /> Verified &amp; secure rewards
              </div>

              <button
                onClick={() => setShowPopup(false)}
                className={`tn-focusable w-full bg-gradient-to-br from-[#facc15] to-[#eab308] text-black font-bold py-3 rounded-[12px] text-[13px] shadow-[0_0_16px_rgba(250,204,21,0.2)] transition-transform duration-150 hover:-translate-y-0.5 ${FONT}`}
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

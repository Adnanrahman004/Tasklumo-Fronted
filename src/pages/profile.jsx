import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfile, changePassword } from "../services/authServices";
import { getWallet } from "../services/walletService";
import {
  User,
  Home as HomeIcon,
  ClipboardList,
  Wallet,
  Settings,
  HelpCircle,
  Shield,
  FileText,
  Copy,
  Check,
  Phone,
  Lock,
  LogOut,
  RotateCcw,
  ChevronRight,
  Flame,
  Coins,
  X,
  Eye,
  EyeOff,
  BadgeCheck,
} from "lucide-react";

function Profile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const location = useLocation();
  const FONT = "font-[Poppins,sans-serif]";

  const [profile, setProfile] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [coinPulse, setCoinPulse] = useState(false);
  const [streakPulse, setStreakPulse] = useState(false);

  // Page-entry animation state — shows a branded loader before the
  // actual profile content is revealed.
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const pulseCoins = () => {
    setCoinPulse(true);
    setTimeout(() => setCoinPulse(false), 500);
  };

  // Backend (Firebase) hi coins/profile ka single source of truth hai.
  // Reusable function — mount ke alawa route change, tab-focus, aur
  // window-visibility par bhi fresh data backend se dobara mangaya
  // jaata hai, kabhi bhi stale local state pe bharosa nahi kiya jaata.
  const loadProfile = async ({ silent = false } = {}) => {
    try {
      const data = await getProfile();
      setProfile(data.user);
    } catch (err) {
      if (!silent) console.error(err);
    }

    try {
      const walletData = await getWallet();
      setWallet((prev) => {
        const nextCoins = walletData?.wallet?.coins ?? 0;
        const prevCoins = prev?.wallet?.coins ?? 0;
        if (prev && nextCoins !== prevCoins) pulseCoins();
        return walletData;
      });
    } catch (err) {
      if (!silent) console.error(err);
    }
  };

  // 1) Page load hote hi backend se fetch
  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Jab bhi route badle (user Home/Tasks/Wallet se wapas Profile pe
  //    aaye), fresh coins/profile backend se dobara le lo
  useEffect(() => {
    loadProfile({ silent: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // 3) Tab wapas visible/focused hone par bhi refresh — task complete
  //    karke doosre tab/app se wapas aane ka common case
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

  // 4) Har 30s me bhi ek halka background refresh — koi live event
  //    miss na ho (e.g. admin ne coins credit kiye ho)
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        loadProfile({ silent: true });
      }
    }, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const firstName = profile?.name?.split(" ")[0] || "User";
  const fullName = profile?.name || "User";
  const email = profile?.email || "user@gmail.com";
  const initials = firstName.charAt(0).toUpperCase();

  // Wallet API = live source of truth; profile fallback for first paint.
  const coins = wallet?.wallet?.coins ?? profile?.coins ?? 0;
  const totalWithdrawn =
    wallet?.wallet?.totalWithdrawn ?? profile?.totalWithdrawn ?? 0;
  const streak = profile?.streak || 1;

  const referralLink = `https://tasklumo.com/ref/${profile?.referralCode || ""}`;

  const rowBtnClass = `bg-gradient-to-br from-[#facc15] to-[#eab308] border-none px-[13px] py-[7px] rounded-[9px] font-bold cursor-pointer text-black text-[10px] whitespace-nowrap transition-all duration-150 hover:-translate-y-0.5 active:scale-95 ${FONT}`;

  const passwordStrength = (() => {
    if (!newPassword) return { label: "", pct: 0, color: "" };
    let score = 0;
    if (newPassword.length >= 6) score++;
    if (newPassword.length >= 10) score++;
    if (/[0-9]/.test(newPassword) && /[a-zA-Z]/.test(newPassword)) score++;
    if (/[^a-zA-Z0-9]/.test(newPassword)) score++;
    const levels = [
      { label: "Weak", pct: 33, color: "#ef4444" },
      { label: "Okay", pct: 60, color: "#facc15" },
      { label: "Good", pct: 80, color: "#4ade80" },
      { label: "Strong", pct: 100, color: "#22c55e" },
    ];
    return levels[Math.min(score, levels.length - 1)];
  })();

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
  };

  const handleChangePassword = async () => {
    try {
      if (!currentPassword || !newPassword || !confirmPassword) {
        return alert("Please fill all fields");
      }
      if (newPassword !== confirmPassword) {
        return alert("New password and confirm password do not match");
      }
      setPasswordLoading(true);
      const res = await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      alert(res.message);
      closePasswordModal();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Reset account? This will clear all your data.")) {
      localStorage.clear();
      navigate("/register");
    }
  };

  const navItems = [
    { to: "/home", icon: HomeIcon, label: "Home" },
    { to: "/tasks", icon: ClipboardList, label: "Tasks" },
    { to: "/wallet", icon: Wallet, label: "Wallet" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  const menuItems = [
    { to: "/support", icon: Settings, label: "Support" },
    { to: "/faq", icon: HelpCircle, label: "FAQ" },
    { to: "/privacy", icon: Shield, label: "Privacy Policy" },
    { to: "/terms", icon: FileText, label: "Terms & Conditions" },
  ];

  const stats = [
    {
      label: "Total Coins",
      value: coins.toLocaleString(),
      pulse: coinPulse,
    },
    {
      label: "Withdrawn",
      value: `₹${totalWithdrawn.toLocaleString()}`,
    },
    {
      label: "Tasks Done",
      value: profile?.tasksCompleted || 0,
    },
    {
      label: "Referral Coins",
      value: `${(profile?.referralEarnings || 0).toLocaleString()} Coins`,
    },
  ];

  const paymentRows = [
    {
      key: "referral",
      icon: Copy,
      title: "Referral Link",
      subtitle: referralLink,
      action: (
        <button className={rowBtnClass} onClick={handleCopy}>
          <span className="flex items-center gap-1">
            {copied ? <Check size={11} /> : null}
            {copied ? "Copied" : "Copy"}
          </span>
        </button>
      ),
    },
    {
      key: "upi",
      icon: Wallet,
      title: "Saved Payment",
      subtitle: "Manage your saved Bank / UPI",
      action: (
        <button
          className={rowBtnClass}
          onClick={() =>
            alert("Please contact Admin to update your payment details.")
          }
        >
          Edit
        </button>
      ),
    },
  ];

  const securityRows = [
    {
      key: "mobile",
      icon: Phone,
      title: "Mobile Number",
      subtitle: "Coming Soon",
      action: (
        <button
          className={rowBtnClass}
          onClick={() => alert("📱 Mobile number verification is coming soon!")}
        >
          Coming Soon
        </button>
      ),
    },
    {
      key: "password",
      icon: Lock,
      title: "Change Password",
      subtitle: "Last changed never",
      action: (
        <button
          className={rowBtnClass}
          onClick={() => setShowPasswordModal(true)}
        >
          Change
        </button>
      ),
    },
  ];

  const passwordInputClass = `w-full pl-[42px] pr-[42px] py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white outline-none text-[13px] ${FONT} transition-colors duration-200 placeholder:text-[#71717a] focus:border-[#facc15]/45 focus:shadow-[0_0_0_3px_rgba(250,204,21,0.08)]`;

  const SectionLabel = ({ children }) => (
    <p className="text-[10.5px] font-bold text-[#71717a] uppercase tracking-wider m-0 mb-2 px-1">
      {children}
    </p>
  );

  const Row = ({ row }) => {
    const Icon = row.icon;
    return (
      <div className="list-row flex items-center gap-3 px-4 py-[14px] border-b border-white/[0.04] last:border-b-0 transition-colors duration-150">
        <div className="w-[34px] h-[34px] rounded-[10px] bg-[#facc15]/10 text-[#facc15] flex items-center justify-center shrink-0">
          <Icon size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-white m-0 mb-0.5">
            {row.title}
          </p>
          <p className="text-[10px] text-[#a1a1aa] m-0 truncate">
            {row.subtitle}
          </p>
        </div>
        <div className="shrink-0">{row.action}</div>
      </div>
    );
  };

  // ---------- Premium Entry Loader ----------
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
          Loading your profile
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
      <style>{`
        :root { --ease-premium: cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pageFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes avatarGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.55; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
        }

        /* ---------- Fluid responsive shell ----------
           320px phones through 1440px+ laptops all read from the
           same clamp() scale, so nothing needs separate "mobile" vs
           "desktop" component trees. */
        .tn-shell {
          max-width: 1180px;
          margin: 0 auto;
          padding: clamp(14px, 3vw, 32px) clamp(14px, 4vw, 40px) clamp(110px, 13vh, 130px);
          padding-top: max(clamp(14px, 3vw, 32px), env(safe-area-inset-top));
        }

        /* Desktop: avatar card + stats side-by-side instead of stacked,
           so wide screens don't show a lonely centered column. */
        .profile-top-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(10px, 1.6vw, 16px);
          margin-bottom: clamp(14px, 2vw, 18px);
        }
        @media (min-width: 900px) {
          .profile-top-grid {
            grid-template-columns: minmax(260px, 340px) 1fr;
            align-items: stretch;
          }
        }

        .profile-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(8px, 1.4vw, 12px);
        }
        @media (min-width: 480px) {
          .profile-stats-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (min-width: 900px) {
          .profile-stats-grid { grid-template-columns: repeat(2, 1fr); height: 100%; }
        }

        /* Desktop: payments / security / account sit side-by-side in a
           2-column grid instead of one long stacked list. */
        .profile-sections-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(12px, 2vw, 18px);
        }
        @media (min-width: 900px) {
          .profile-sections-grid { grid-template-columns: repeat(2, 1fr); }
          .profile-sections-grid > div:last-child { grid-column: 1 / -1; }
        }

        .tn-focusable:focus-visible { outline: 2px solid #facc15; outline-offset: 2px; }

        @media (hover: hover) {
          .profile-card:hover { border-color: rgba(250,204,21,0.24); }
          .list-row:hover { background: rgba(255,255,255,0.025); }
        }
      `}</style>

      <div
        className="relative z-0"
        style={{ animation: "pageFadeIn 0.4s var(--ease-premium) both" }}
      >
        <div className="fixed inset-0 opacity-[0.04] bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />

        <div className="tn-shell relative z-10">
          {/* TOP BAR */}
          <div className="relative flex justify-between items-center mb-[18px] gap-2 flex-wrap">
            <div className="min-w-0">
              <h1 className="text-[clamp(22px,2vw+16px,32px)] font-extrabold bg-gradient-to-r from-[#facc15] to-white bg-clip-text text-transparent m-0 mb-1 truncate">
                Profile
              </h1>
              <p className="text-[#a1a1aa] text-[11px] sm:text-[12px] m-0">
                Manage your account details
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div
                className={`bg-[#111] border border-[#facc15]/[0.18] px-[11px] py-[7px] rounded-[10px] text-[#ff9d3d] font-bold text-[11px] max-[359px]:text-[10px] max-[359px]:px-2 max-[359px]:py-[5px] flex items-center gap-[5px] transition-all duration-300 ${
                  streakPulse
                    ? "scale-[1.12] shadow-[0_0_14px_rgba(255,157,61,0.4)]"
                    : ""
                }`}
              >
                <Flame size={13} /> {streak}
              </div>
              <div
                className={`bg-[#111] border border-[#facc15]/[0.18] px-3 py-[7px] rounded-[10px] text-[#facc15] font-bold text-[11px] max-[359px]:text-[10px] max-[359px]:px-2 max-[359px]:py-[5px] flex items-center gap-[5px] transition-all duration-300 ${
                  coinPulse
                    ? "scale-[1.14] shadow-[0_0_18px_rgba(250,204,21,0.45)] border-[#facc15]/60"
                    : ""
                }`}
              >
                <Coins size={13} /> {coins.toLocaleString()}
              </div>
              <button
                aria-label="Menu"
                className="tn-focusable bg-[#111111]/90 border border-[#facc15]/[0.12] w-[38px] h-[38px] rounded-[11px] text-[#facc15] cursor-pointer flex items-center justify-center shrink-0 hover:border-[#facc15]/35 active:scale-95 transition-all duration-150"
                onClick={() => setShowMenu(!showMenu)}
              >
                {showMenu ? <X size={17} /> : <Settings size={17} />}
              </button>
            </div>

            {showMenu && (
              <div className="absolute top-12 right-0 w-[200px] bg-[#111111]/[0.97] border border-[#facc15]/[0.12] rounded-2xl p-2 backdrop-blur-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-[999] animate-[fadeIn_0.18s_ease]">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setShowMenu(false)}
                      className="tn-focusable flex items-center gap-2.5 px-3 py-2.5 text-white no-underline text-[12px] rounded-xl transition-colors duration-150 hover:bg-white/5"
                    >
                      <Icon size={15} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* AVATAR CARD + STATS — side-by-side on desktop, stacked on mobile */}
          <div className="profile-top-grid">
            <div
              className="profile-card relative overflow-hidden bg-[#111111]/[0.88] border border-[#facc15]/[0.14] rounded-[22px] px-5 py-6 sm:py-7 backdrop-blur-[18px] text-center transition-colors duration-300 flex flex-col justify-center"
              style={{ animation: "cardIn 0.5s var(--ease-premium) both" }}
            >
              <div
                className="absolute -top-10 -right-10 w-[150px] h-[150px] rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.12),transparent_70%)] pointer-events-none"
                style={{ animation: "avatarGlow 3s ease-in-out infinite" }}
              />

              <div className="relative w-[72px] h-[72px] sm:w-20 sm:h-20 mx-auto mb-[14px]">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#facc15] to-[#ffb300] opacity-30 blur-[8px]" />
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#facc15] to-[#ffb300] text-black flex items-center justify-center font-extrabold text-[28px] sm:text-[32px] ring-2 ring-[#facc15]/25 ring-offset-2 ring-offset-[#0a0a0a]">
                  {initials}
                </div>
              </div>
              <h2 className="relative text-[20px] sm:text-[22px] font-bold m-0 mb-1.5 flex items-center justify-center gap-1.5">
                {fullName}
                <BadgeCheck
                  size={17}
                  className="text-[#3b9dff] drop-shadow-[0_0_6px_rgba(59,157,255,0.55)]"
                  fill="#1d4ed8"
                  strokeWidth={2}
                />
              </h2>
              <p className="relative text-[#a1a1aa] text-[11px] m-0 mb-1 truncate">
                {email}
              </p>
              <p className="relative text-[#a1a1aa] text-[11px] m-0 mb-1">
                User ID: {profile?.userId || "Loading..."}
              </p>
            </div>

            {/* STATS */}
            <div
              className="profile-stats-grid"
              style={{ animation: "cardIn 0.5s var(--ease-premium) both" }}
            >
              {stats.map((s, i) => (
                <div
                  className={`profile-card bg-[#111111]/[0.88] border border-[#facc15]/10 rounded-2xl p-[14px] backdrop-blur-[18px] transition-all duration-300 flex flex-col justify-center ${
                    s.pulse
                      ? "scale-[1.03] border-[#facc15]/50 shadow-[0_0_18px_rgba(250,204,21,0.18)]"
                      : ""
                  }`}
                  key={i}
                >
                  <p className="text-[10px] text-[#a1a1aa] m-0 mb-1.5 font-medium">
                    {s.label}
                  </p>
                  <p className="text-[19px] sm:text-[22px] max-[359px]:text-[16px] text-[#facc15] font-extrabold m-0 truncate">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* PAYMENTS / SECURITY / ACCOUNT — 2-col grid on desktop */}
          <div className="profile-sections-grid">
            <div>
              <SectionLabel>Payments</SectionLabel>
              <div
                className="profile-card bg-[#111111]/[0.88] border border-[#facc15]/10 rounded-[18px] overflow-hidden backdrop-blur-[18px] transition-colors duration-300"
                style={{ animation: "cardIn 0.5s var(--ease-premium) both" }}
              >
                {paymentRows.map((row) => (
                  <Row row={row} key={row.key} />
                ))}
              </div>
            </div>

            <div>
              <SectionLabel>Security</SectionLabel>
              <div
                className="profile-card bg-[#111111]/[0.88] border border-[#facc15]/10 rounded-[18px] overflow-hidden backdrop-blur-[18px] transition-colors duration-300"
                style={{ animation: "cardIn 0.5s var(--ease-premium) both" }}
              >
                {securityRows.map((row) => (
                  <Row row={row} key={row.key} />
                ))}
              </div>
            </div>

            <div>
              <SectionLabel>Account</SectionLabel>
              <div
                className="profile-card bg-[#111111]/[0.88] border border-[#facc15]/10 rounded-[18px] overflow-hidden backdrop-blur-[18px] transition-colors duration-300"
                style={{ animation: "cardIn 0.5s var(--ease-premium) both" }}
              >
                <button
                  type="button"
                  className={`list-row w-full text-left flex items-center gap-3 px-4 py-[14px] border-b border-white/[0.04] cursor-pointer transition-colors duration-150 bg-transparent border-x-0 border-t-0 ${FONT}`}
                  onClick={handleLogout}
                >
                  <div className="w-[34px] h-[34px] rounded-[10px] bg-[#facc15]/[0.08] text-[#facc15] flex items-center justify-center shrink-0">
                    <LogOut size={16} />
                  </div>
                  <p className="text-[13px] font-semibold text-white m-0 flex-1">
                    Logout
                  </p>
                  <ChevronRight size={15} color="#a1a1aa" />
                </button>
                <button
                  type="button"
                  className={`list-row w-full text-left flex items-center gap-3 px-4 py-[14px] cursor-pointer transition-colors duration-150 bg-transparent border-none ${FONT}`}
                  onClick={handleReset}
                >
                  <div className="w-[34px] h-[34px] rounded-[10px] bg-red-500/[0.12] text-red-500 flex items-center justify-center shrink-0">
                    <RotateCcw size={16} />
                  </div>
                  <p className="text-[13px] font-semibold text-red-500 m-0 flex-1">
                    Reset Account
                  </p>
                  <ChevronRight size={15} color="#ef4444" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM NAV */}
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
                className={`tn-focusable no-underline text-center font-semibold text-[10px] flex flex-col items-center gap-[3px] rounded-xl transition-all duration-200 ${
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

        {/* CHANGE PASSWORD MODAL */}
        {showPasswordModal && (
          <div
            className="fixed inset-0 bg-black/75 flex justify-center items-end sm:items-center z-[999] backdrop-blur-[4px] animate-[fadeIn_0.18s_ease] p-0 sm:p-4"
            onClick={closePasswordModal}
          >
            <div
              className={`w-full max-w-[420px] max-h-[92dvh] overflow-y-auto bg-[#161616] rounded-t-[24px] sm:rounded-[24px] px-5 pt-6 pb-9 border border-[#facc15]/[0.14] border-b-0 sm:border-b sm:border-b-[#facc15]/[0.14] animate-[slideUp_0.25s_ease_both] ${FONT}`}
              style={{
                paddingBottom: "max(36px, env(safe-area-inset-bottom))",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-9 h-1 bg-white/[0.12] rounded-sm mx-auto mb-5" />

              <div className="flex justify-between items-center mb-[18px]">
                <h2 className="text-[18px] font-bold m-0 flex items-center gap-2">
                  <Lock size={16} className="text-[#facc15]" /> Change Password
                </h2>
                <button
                  type="button"
                  className="tn-focusable bg-white/[0.06] border-none w-8 h-8 rounded-[9px] text-[#a1a1aa] cursor-pointer flex items-center justify-center"
                  onClick={closePasswordModal}
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-[10.5px] font-semibold text-[#d4d4d8] mb-1.5 ml-0.5">
                Current password
              </p>
              <div className="relative mb-3">
                <Lock
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none"
                />
                <input
                  type={showCurrent ? "text" : "password"}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={passwordInputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  tabIndex={-1}
                  aria-label={showCurrent ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#a1a1aa] cursor-pointer p-1 flex items-center hover:text-[#facc15] transition-colors"
                >
                  {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              <p className="text-[10.5px] font-semibold text-[#d4d4d8] mb-1.5 ml-0.5">
                New password
              </p>
              <div className="relative mb-1.5">
                <Lock
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none"
                />
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={passwordInputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  tabIndex={-1}
                  aria-label={showNew ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#a1a1aa] cursor-pointer p-1 flex items-center hover:text-[#facc15] transition-colors"
                >
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {newPassword && (
                <div className="mb-3">
                  <div className="h-1 rounded-md bg-white/[0.08] overflow-hidden mb-1">
                    <div
                      className="h-full rounded-md transition-all duration-300"
                      style={{
                        width: `${passwordStrength.pct}%`,
                        background: passwordStrength.color,
                      }}
                    />
                  </div>
                  <p
                    className="text-[10px] m-0 font-semibold"
                    style={{ color: passwordStrength.color }}
                  >
                    {passwordStrength.label} password
                  </p>
                </div>
              )}

              <p className="text-[10.5px] font-semibold text-[#d4d4d8] mb-1.5 ml-0.5">
                Confirm new password
              </p>
              <div className="relative mb-5">
                <Lock
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none"
                />
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={passwordInputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  tabIndex={-1}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#a1a1aa] cursor-pointer p-1 flex items-center hover:text-[#facc15] transition-colors"
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  className={`flex-1 bg-white/[0.06] hover:bg-white/[0.1] active:scale-[0.98] border-none py-[13px] rounded-xl font-bold cursor-pointer text-white text-[13px] transition-all duration-150 ${FONT}`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleChangePassword}
                  disabled={passwordLoading}
                  className={`flex-1 bg-gradient-to-br from-[#facc15] to-[#eab308] border-none py-[13px] rounded-xl font-extrabold cursor-pointer text-black text-[13px] transition-all duration-200 flex items-center justify-center gap-2 enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_4px_18px_rgba(250,204,21,0.3)] enabled:active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed ${FONT}`}
                >
                  {passwordLoading ? (
                    <>
                      <span className="w-[14px] h-[14px] border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;

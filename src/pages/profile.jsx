import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfile, changePassword } from "../services/authServices";
import { getWallet } from "../services/walletService";
import {
  User,
  Home as HomeIcon,
  ClipboardList,
  Wallet as WalletIcon,
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
  const location = useLocation();
  const FONT = "font-[Poppins,sans-serif]";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

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

  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const pulseCoins = () => {
    setCoinPulse(true);
    setTimeout(() => setCoinPulse(false), 500);
  };

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

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    loadProfile({ silent: true });
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
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        loadProfile({ silent: true });
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const firstName = profile?.name?.split(" ")[0] || "User";
  const fullName = profile?.name || "User";
  const email = profile?.email || "user@gmail.com";
  const initials = firstName.charAt(0).toUpperCase();

  const coins = wallet?.wallet?.coins ?? profile?.coins ?? 0;
  const totalWithdrawn =
    wallet?.wallet?.totalWithdrawn ?? profile?.totalWithdrawn ?? 0;
  const streak = profile?.streak || 1;

  const referralLink = `https://tasklumo.com/ref/${profile?.referralCode || ""}`;

  const rowBtnClass = `bg-gradient-to-br from-[#22c55e] to-[#16a34a] border-none px-[10px] sm:px-[13px] py-[6px] sm:py-[7px] rounded-lg font-bold cursor-pointer text-white text-[10px] sm:text-[11px] whitespace-nowrap transition-all duration-150 hover:-translate-y-0.5 active:scale-95 ${FONT}`;

  const passwordStrength = (() => {
    if (!newPassword) return { label: "", pct: 0, color: "" };
    let score = 0;
    if (newPassword.length >= 6) score++;
    if (newPassword.length >= 10) score++;
    if (/[0-9]/.test(newPassword) && /[a-zA-Z]/.test(newPassword)) score++;
    if (/[^a-zA-Z0-9]/.test(newPassword)) score++;
    const levels = [
      { label: "Weak", pct: 33, color: "#ef4444" },
      { label: "Okay", pct: 60, color: "#d97706" },
      { label: "Good", pct: 80, color: "#16a34a" },
      { label: "Strong", pct: 100, color: "#15803d" },
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
    { to: "/wallet", icon: WalletIcon, label: "Wallet" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  const menuItems = [
    { to: "/support", icon: Settings, label: "Support" },
    { to: "/faq", icon: HelpCircle, label: "FAQ" },
    { to: "/privacy", icon: Shield, label: "Privacy Policy" },
    { to: "/terms", icon: FileText, label: "Terms & Conditions" },
  ];

  const stats = [
    { label: "Total Coins", value: coins.toLocaleString(), pulse: coinPulse },
    { label: "Withdrawn", value: `₹${totalWithdrawn.toLocaleString()}` },
    { label: "Tasks Done", value: profile?.tasksCompleted || 0 },
    {
      label: "Referral Coins",
      value: `${(profile?.referralEarnings || 0).toLocaleString()}`,
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
      icon: WalletIcon,
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
          Soon
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

  const passwordInputClass = `w-full pl-[42px] pr-[42px] py-3 rounded-xl border border-[#e5e7eb] bg-white text-[#111827] outline-none text-[13px] ${FONT} transition-colors duration-200 placeholder:text-[#9ca3af] focus:border-[#22c55e] shadow-sm`;

  const SectionLabel = ({ children }) => (
    <p className="text-[10.5px] font-bold text-[#6b7280] uppercase tracking-wider m-0 mb-2 px-1">
      {children}
    </p>
  );

  const Row = ({ row }) => {
    const Icon = row.icon;
    return (
      <div className="list-row flex items-center gap-3 px-4 py-3.5 border-b border-[#e5e7eb] last:border-b-0 transition-colors duration-150 hover:bg-[#f9fafb]">
        <div className="w-8 h-8 rounded-lg bg-[#dcfce7] text-[#16a34a] flex items-center justify-center shrink-0">
          <Icon size={15} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-[#111827] m-0 mb-0.5">
            {row.title}
          </p>
          <p className="text-[10px] text-[#6b7280] m-0 truncate">
            {row.subtitle}
          </p>
        </div>
        <div className="shrink-0">{row.action}</div>
      </div>
    );
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
          Loading your profile
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
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes cardIn { from { opacity: 0; transform: translateY(12px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes pageFadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        
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

        .profile-top-grid { display: grid; grid-template-columns: 1fr; gap: clamp(10px, 1.6vw, 16px); margin-bottom: clamp(14px, 2vw, 18px); }
        @media (min-width: 900px) { .profile-top-grid { grid-template-columns: minmax(260px, 340px) 1fr; align-items: stretch; } }

        .profile-stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: clamp(8px, 1.4vw, 12px); }
        @media (min-width: 480px) { .profile-stats-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (min-width: 900px) { .profile-stats-grid { grid-template-columns: repeat(2, 1fr); height: 100%; } }

        .profile-sections-grid { display: grid; grid-template-columns: 1fr; gap: clamp(12px, 2vw, 18px); }
        @media (min-width: 900px) { .profile-sections-grid { grid-template-columns: repeat(2, 1fr); } .profile-sections-grid > div:last-child { grid-column: 1 / -1; } }

        .tn-focusable:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }
        @media (hover: hover) { .profile-card:hover { border-color: rgba(34, 197, 94, 0.4); } }

        .tn-coin-gold {
          color: var(--gold);
          background: linear-gradient(180deg, #fffbeb 0%, var(--gold-bg) 100%);
          border-color: var(--gold-border) !important;
        }
        .tn-coin-gold svg { color: var(--gold); }
        .tn-coin-gold-pulse { box-shadow: 0 0 16px rgba(217, 119, 6, 0.35) !important; border-color: var(--gold-soft) !important; }
      `}</style>

      <div
        className="relative z-0"
        style={{ animation: "pageFadeIn 0.4s var(--ease-premium) both" }}
      >
        <div className="tn-shell relative z-10">
          {/* TOP BAR */}
          <div className="tn-header relative flex justify-between items-center gap-2 flex-wrap">
            <div className="min-w-0">
              <h1 className="text-[clamp(20px,1.2vw+16px,28px)] font-extrabold bg-gradient-to-r from-[#16a34a] to-[#111827] bg-clip-text text-transparent m-0 mb-1 truncate">
                Profile
              </h1>
              <p className="text-[#6b7280] text-[clamp(10px,0.3vw+8px,12px)] m-0 truncate">
                Manage your account details
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-bold transition-all duration-300 bg-white border border-[#e5e7eb] text-[#d97706] ${streakPulse ? "scale-105 shadow-md" : ""}`}
              >
                <Flame size={14} />{" "}
                <span className="text-[clamp(11px,3vw,13px)]">{streak}</span>
              </div>

              <div
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl font-bold transition-all duration-300 shrink-0 ${coinPulse ? "scale-105 shadow-md tn-coin-gold-pulse" : ""} tn-coin-gold border`}
              >
                <Coins size={14} className="shrink-0" />
                <span className="text-[clamp(11px,3vw,13px)]">
                  {coins.toLocaleString()}
                </span>
              </div>

              <button
                aria-label="Menu"
                className="tn-focusable bg-white border border-[#e5e7eb] w-9 h-9 rounded-xl text-[#111827] cursor-pointer flex items-center justify-center shrink-0 hover:border-[#86efac] active:scale-95 transition-all duration-150"
                onClick={() => setShowMenu(!showMenu)}
              >
                {showMenu ? <X size={18} /> : <Settings size={18} />}
              </button>
            </div>

            {showMenu && (
              <div className="absolute top-[60px] right-[clamp(16px,4vw,40px)] w-[200px] bg-white border border-[#e5e7eb] rounded-2xl p-2 shadow-xl z-[999] animate-[fadeIn_0.18s_ease]">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setShowMenu(false)}
                      className="tn-focusable flex items-center gap-2.5 px-3 py-2.5 text-[#111827] no-underline text-[12.5px] font-medium rounded-xl transition-colors duration-150 hover:bg-[#f9fafb]"
                    >
                      <Icon size={16} className="text-[#16a34a]" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* AVATAR CARD + STATS */}
          <div className="profile-top-grid">
            <div
              className="profile-card relative overflow-hidden bg-white border border-[#e5e7eb] rounded-2xl px-5 py-6 sm:py-7 shadow-[0_1px_3px_rgba(17,24,39,0.04)] text-center transition-colors duration-300 flex flex-col justify-center"
              style={{ animation: "cardIn 0.5s var(--ease-premium) both" }}
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3">
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] text-white flex items-center justify-center font-extrabold text-[24px] sm:text-[28px] ring-2 ring-[#dcfce7] ring-offset-2 ring-offset-white">
                  {initials}
                </div>
              </div>
              <h2 className="relative text-[18px] sm:text-[20px] font-bold m-0 mb-1 flex items-center justify-center gap-1.5 text-[#111827]">
                {fullName}
                <BadgeCheck
                  size={18}
                  className="text-[#3b9dff]"
                  fill="#3b9dff"
                  stroke="white"
                  strokeWidth={2}
                />
              </h2>
              <p className="relative text-[#6b7280] text-[11px] m-0 mb-1 truncate">
                {email}
              </p>
              <p className="relative text-[#9ca3af] text-[10px] m-0">
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
                  className={`profile-card bg-white border border-[#e5e7eb] rounded-2xl p-3.5 shadow-[0_1px_3px_rgba(17,24,39,0.04)] transition-all duration-300 flex flex-col justify-center ${
                    s.pulse
                      ? "scale-[1.03] border-[#86efac] shadow-[0_4px_12px_rgba(34,197,94,0.15)]"
                      : ""
                  }`}
                  key={i}
                >
                  <p className="text-[10px] sm:text-[11px] text-[#6b7280] m-0 mb-1 font-medium truncate">
                    {s.label}
                  </p>
                  {/* Yahan Coins ka color Golden set kiya gaya hai */}
                  <p
                    className={`text-[16px] sm:text-[18px] font-extrabold m-0 truncate ${
                      s.label.includes("Coins")
                        ? "text-[#d97706]"
                        : "text-[#111827]"
                    }`}
                  >
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* PAYMENTS / SECURITY / ACCOUNT */}
          <div className="profile-sections-grid">
            <div>
              <SectionLabel>Payments</SectionLabel>
              <div
                className="profile-card bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(17,24,39,0.04)]"
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
                className="profile-card bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(17,24,39,0.04)]"
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
                className="profile-card bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(17,24,39,0.04)]"
                style={{ animation: "cardIn 0.5s var(--ease-premium) both" }}
              >
                <button
                  type="button"
                  className={`list-row w-full text-left flex items-center gap-3 px-4 py-3.5 border-b border-[#e5e7eb] cursor-pointer transition-colors duration-150 bg-transparent border-x-0 border-t-0 hover:bg-[#f9fafb] ${FONT}`}
                  onClick={handleLogout}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#f3f4f6] text-[#111827] flex items-center justify-center shrink-0">
                    <LogOut size={15} />
                  </div>
                  <p className="text-[13px] font-semibold text-[#111827] m-0 flex-1">
                    Logout
                  </p>
                  <ChevronRight size={16} color="#9ca3af" />
                </button>
                <button
                  type="button"
                  className={`list-row w-full text-left flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors duration-150 bg-transparent border-none hover:bg-[#fef2f2] ${FONT}`}
                  onClick={handleReset}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#fef2f2] text-[#ef4444] flex items-center justify-center shrink-0">
                    <RotateCcw size={15} />
                  </div>
                  <p className="text-[13px] font-semibold text-[#ef4444] m-0 flex-1">
                    Reset Account
                  </p>
                  <ChevronRight size={16} color="#ef4444" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM NAV */}
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

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 bg-black/60 flex justify-center items-end sm:items-center z-[999] backdrop-blur-sm animate-[fadeIn_0.18s_ease] p-0 sm:p-4"
          onClick={closePasswordModal}
        >
          <div
            className={`w-full max-w-[420px] max-h-[92dvh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl px-5 pt-6 pb-9 border border-[#e5e7eb] animate-[slideUp_0.25s_ease_both] ${FONT}`}
            style={{ paddingBottom: "max(36px, env(safe-area-inset-bottom))" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-9 h-1 bg-gray-200 rounded-sm mx-auto mb-5" />

            <div className="flex justify-between items-center mb-[18px]">
              <h2 className="text-[18px] font-bold m-0 flex items-center gap-2 text-[#111827]">
                <Lock size={16} className="text-[#16a34a]" /> Change Password
              </h2>
              <button
                type="button"
                className="tn-focusable bg-[#f3f4f6] border-none w-8 h-8 rounded-lg text-[#6b7280] cursor-pointer flex items-center justify-center"
                onClick={closePasswordModal}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-[11px] font-semibold text-[#6b7280] mb-1.5 ml-0.5">
              Current password
            </p>
            <div className="relative mb-3">
              <Lock
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none"
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
                className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#9ca3af] cursor-pointer p-1 flex items-center hover:text-[#16a34a] transition-colors"
              >
                {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            <p className="text-[11px] font-semibold text-[#6b7280] mb-1.5 ml-0.5">
              New password
            </p>
            <div className="relative mb-1.5">
              <Lock
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none"
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
                className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#9ca3af] cursor-pointer p-1 flex items-center hover:text-[#16a34a] transition-colors"
              >
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {newPassword && (
              <div className="mb-3">
                <div className="h-1 rounded-md bg-[#f3f4f6] overflow-hidden mb-1">
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

            <p className="text-[11px] font-semibold text-[#6b7280] mb-1.5 ml-0.5">
              Confirm new password
            </p>
            <div className="relative mb-5">
              <Lock
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none"
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
                className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#9ca3af] cursor-pointer p-1 flex items-center hover:text-[#16a34a] transition-colors"
              >
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={closePasswordModal}
                className={`flex-1 bg-[#f3f4f6] hover:bg-[#e5e7eb] active:scale-[0.98] border-none py-[13px] rounded-xl font-bold cursor-pointer text-[#111827] text-[13px] transition-all duration-150 ${FONT}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleChangePassword}
                disabled={passwordLoading}
                className={`flex-1 bg-gradient-to-br from-[#22c55e] to-[#16a34a] border-none py-[13px] rounded-xl font-extrabold cursor-pointer text-white text-[13px] transition-all duration-200 flex items-center justify-center gap-2 enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_4px_18px_rgba(34,197,94,0.3)] enabled:active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed ${FONT}`}
              >
                {passwordLoading ? (
                  <>
                    <span className="w-[14px] h-[14px] border-2 border-white/40 border-t-white rounded-full animate-spin" />
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
  );
}

export default Profile;

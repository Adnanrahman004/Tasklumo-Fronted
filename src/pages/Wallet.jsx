import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  User,
  Home as HomeIcon,
  ClipboardList,
  Wallet as WalletIcon,
  TrendingUp,
  Banknote,
  Building2,
  Smartphone,
  X,
  Coins,
  CheckCircle,
  Clock,
  Info,
  Copy,
  Check,
  Inbox,
  XCircle,
} from "lucide-react";

import {
  getWallet,
  withdrawMoney,
  addBank,
  addUpi,
  getWithdrawHistory,
} from "../services/walletService";

const COIN_RATE = 10; // 100 coins = ₹1

function Wallet() {
  const location = useLocation();
  const FONT = "font-[Poppins,sans-serif]";

  const [showBankPopup, setShowBankPopup] = useState(false);
  const [showUpiPopup, setShowUpiPopup] = useState(false);
  const [showWithdrawPopup, setShowWithdrawPopup] = useState(false);

  // Withdraw form state
  const [withdrawTab, setWithdrawTab] = useState("upi"); // "upi" | "bank"
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyFilter, setHistoryFilter] = useState("all");
  const [copiedField, setCopiedField] = useState("");
  const [coinPulse, setCoinPulse] = useState(false);

  // Page-entry animation state — shows a branded loader before the
  // actual wallet content is revealed.
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const [bankForm, setBankForm] = useState({
    accountHolder: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifsc: "",
    bankName: "",
  });

  const [upiForm, setUpiForm] = useState({
    upiId: "",
    appName: "",
  });
  const coins = wallet?.coins || 0;
  const totalEarning = wallet?.totalEarning || 0;
  const todayEarning = wallet?.todayEarning || 0;
  const totalWithdrawn = wallet?.totalWithdrawn || 0;
  const rupees = (coins / COIN_RATE).toFixed(2);
  const quickAmounts = [100, 250, 500, 1000];

  const hasUpi = Boolean(upiForm.upiId);
  const hasBank = Boolean(bankForm.accountNumber);

  const historyFilters = [
    { key: "all", label: "All" },
    { key: "approved", label: "Approved" },
    { key: "pending", label: "Pending" },
    { key: "rejected", label: "Rejected" },
  ];

  const filteredHistory = (history || []).filter((h) => {
    if (historyFilter === "all") return true;
    const status = String(h.status || "").toLowerCase();
    if (historyFilter === "approved")
      return status === "approved" || status === "success";
    return status === historyFilter;
  });

  const pulseCoins = () => {
    setCoinPulse(true);
    setTimeout(() => setCoinPulse(false), 500);
  };

  const copyToClipboard = (text, field) => {
    if (!text) return;
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedField(field);
    setTimeout(() => setCopiedField(""), 1800);
  };

  const handleSaveBank = async () => {
    try {
      if (
        !bankForm.accountHolder ||
        !bankForm.accountNumber ||
        !bankForm.confirmAccountNumber ||
        !bankForm.ifsc ||
        !bankForm.bankName
      ) {
        alert("Please fill all fields");
        return;
      }

      if (bankForm.accountNumber !== bankForm.confirmAccountNumber) {
        alert("Account numbers do not match");
        return;
      }

      await addBank({
        accountHolder: bankForm.accountHolder,
        accountNumber: bankForm.accountNumber,
        ifsc: bankForm.ifsc,
        bankName: bankForm.bankName,
      });

      alert("Bank account saved successfully");

      setShowBankPopup(false);

      setBankForm({
        accountHolder: "",
        accountNumber: "",
        confirmAccountNumber: "",
        ifsc: "",
        bankName: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save bank account");
    }
  };

  const handleSaveUpi = async () => {
    try {
      if (!upiForm.upiId || !upiForm.appName) {
        alert("Please fill all fields");
        return;
      }

      await addUpi({
        upiId: upiForm.upiId,
        upiApp: upiForm.appName,
      });

      alert("UPI saved successfully");

      setShowUpiPopup(false);

      setUpiForm({
        upiId: "",
        appName: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save UPI");
    }
  };

  const handleWithdraw = async () => {
    try {
      setWithdrawLoading(true);
      setWithdrawError("");

      const amt = Number(withdrawAmount);

      if (!amt || amt < 100) {
        setWithdrawError("Minimum withdrawal is ₹100");
        return;
      }

      await withdrawMoney({
        amount: amt,
        method: withdrawTab,
        accountId:
          withdrawTab === "upi" ? upiForm.upiId : bankForm.accountNumber,
      });

      await loadWallet({ silent: true });

      setWithdrawSuccess(true);
    } catch (error) {
      if (
        error.response?.data?.message ===
        "Please add your mobile number to unlock withdrawal."
      ) {
        alert(
          "Please add your mobile number from your Profile to unlock withdrawal.",
        );
        return;
      }
      setWithdrawError(error.response?.data?.message || "Withdrawal failed");
    } finally {
      setWithdrawLoading(false);
    }
  };

  const closeWithdraw = () => {
    setShowWithdrawPopup(false);
    setWithdrawSuccess(false);
    setWithdrawAmount("");
    setWithdrawError("");
    setWithdrawLoading(false);
    setWithdrawTab("upi");
  };

  const navItems = [
    { to: "/home", icon: HomeIcon, label: "Home" },
    { to: "/tasks", icon: ClipboardList, label: "Tasks" },
    { to: "/wallet", icon: WalletIcon, label: "Wallet" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  // Backend (Firebase) hi coins/earnings ka single source of truth hai.
  // Yeh function reusable hai taaki mount ke alawa bhi — route change,
  // tab-focus, ya withdraw ke baad — hamesha fresh data backend se
  // dobara mangaya ja sake, kabhi stale local state pe bharosa na kiya
  // jaaye.
  const loadWallet = async ({ silent = false } = {}) => {
    try {
      const walletData = await getWallet();

      setWallet((prev) => {
        const nextCoins = walletData.wallet?.coins || 0;
        const prevCoins = prev?.coins || 0;
        if (nextCoins !== prevCoins) pulseCoins();
        return walletData.wallet;
      });

      if (walletData.bank) {
        setBankForm({
          accountHolder: walletData.bank.accountHolder || "",
          accountNumber: walletData.bank.accountNumber || "",
          confirmAccountNumber: walletData.bank.accountNumber || "",
          ifsc: walletData.bank.ifsc || "",
          bankName: walletData.bank.bankName || "",
        });
      }

      if (walletData.upi) {
        setUpiForm({
          upiId: walletData.upi.upiId || "",
          appName: walletData.upi.upiApp || "",
        });
      }
    } catch (error) {
      if (!silent) console.log(error);
    }

    try {
      const historyData = await getWithdrawHistory();
      setHistory(historyData.history);
    } catch (error) {
      if (!silent) console.log(error);
    }
  };

  // 1) Page load hote hi backend se fetch
  useEffect(() => {
    loadWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Jab bhi route badle (user Tasks/Home se wapas Wallet pe aaye),
  //    fresh coins/earnings backend se dobara le lo
  useEffect(() => {
    loadWallet({ silent: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // 3) Tab wapas visible/focused hone par bhi refresh — offerwall ya
  //    doosre tab me task complete karke wapas aane ka common case
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        loadWallet({ silent: true });
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

  const popupInputClass = `w-full px-[14px] py-3 mb-[10px] rounded-xl border border-white/[0.08] bg-white/[0.04] text-white outline-none text-[13px] ${FONT} transition-colors duration-200 placeholder:text-[#71717a] focus:border-[#facc15]/45 focus:shadow-[0_0_0_3px_rgba(250,204,21,0.08)]`;

  const popupSaveClass = `w-full bg-gradient-to-br from-[#facc15] to-[#eab308] border-none py-[14px] rounded-xl font-extrabold cursor-pointer text-black text-[13px] mt-1 ${FONT} transition-all duration-200 flex items-center justify-center gap-2 enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_4px_18px_rgba(250,204,21,0.3)] disabled:opacity-60 disabled:cursor-not-allowed`;

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
          Loading your wallet
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
      {/* keyframes + shared responsive tokens, same system as Home/Tasks */}
      <style>{`
        :root { --ease-premium: cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pageFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
        }

        .tn-shell {
          max-width: 1180px;
          margin: 0 auto;
          padding: clamp(16px, 3vw, 32px) clamp(16px, 4vw, 40px) clamp(110px, 13vh, 130px);
          padding-top: max(clamp(16px, 3vw, 32px), env(safe-area-inset-top));
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(8px, 1.4vw, 14px);
        }
        @media (min-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(3, minmax(0, 260px)); justify-content: start; }
        }
        @media (max-width: 340px) {
          .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        .filter-scroll::-webkit-scrollbar { display: none; }
        .tn-focusable:focus-visible { outline: 2px solid #facc15; outline-offset: 2px; }

        @media (hover: hover) {
          .wallet-card:hover { border-color: rgba(250,204,21,0.28); }
          .action-btn:hover { transform: translateY(-2px); }
        }
      `}</style>

      <div
        className="relative z-0"
        style={{ animation: "pageFadeIn 0.4s var(--ease-premium) both" }}
      >
        {/* faint grid texture for depth, matches the rest of the app */}
        <div className="fixed inset-0 opacity-[0.04] bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />

        <div className="tn-shell relative z-10">
          {/* TOP BAR */}
          <div className="flex justify-between items-center mb-4 gap-2.5">
            <div className="min-w-0">
              <h1 className="text-[clamp(22px,3vw+12px,30px)] font-extrabold bg-gradient-to-r from-[#facc15] to-white bg-clip-text text-transparent m-0 mb-1 flex items-center gap-2 truncate">
                <WalletIcon size={22} color="#facc15" className="shrink-0" />{" "}
                Wallet
              </h1>
              <p className="text-[#a1a1aa] text-[11px] m-0">
                Manage earnings and withdrawals
              </p>
            </div>
            <div
              className={`bg-[#111] border border-[#facc15]/[0.18] px-3 py-[7px] rounded-[10px] text-[#facc15] font-bold text-[11px] max-[359px]:text-[10px] max-[359px]:px-2 max-[359px]:py-[5px] flex items-center gap-[5px] shrink-0 transition-all duration-300 ${
                coinPulse
                  ? "scale-[1.14] shadow-[0_0_18px_rgba(250,204,21,0.45)] border-[#facc15]/60"
                  : ""
              }`}
            >
              <Coins size={13} /> {coins.toLocaleString()} Coins
            </div>
          </div>

          {/* BALANCE CARD */}
          <div
            className="wallet-card relative overflow-hidden bg-[#111111]/[0.88] border border-[#facc15]/[0.14] rounded-[22px] px-5 py-[22px] mb-[16px] backdrop-blur-[18px] transition-colors duration-300"
            style={{ animation: "cardIn 0.5s var(--ease-premium) both" }}
          >
            <div className="absolute -top-10 -right-10 w-[160px] h-[160px] rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.12),transparent_70%)] pointer-events-none" />

            <p className="text-[#a1a1aa] text-[11px] m-0 mb-1">Your Coins</p>
            <h1 className="text-[clamp(30px,3vw+22px,52px)] text-[#facc15] m-0 mb-0.5 font-extrabold leading-none">
              {coins.toLocaleString()}
            </h1>
            <p className="text-[13px] text-[#a1a1aa] m-0 mb-1.5 flex items-center flex-wrap gap-x-1.5">
              ≈ <span className="text-[#4ade80] font-bold">₹{rupees}</span>{" "}
              withdrawable value
            </p>
            <p className="relative z-[1] flex items-center gap-1.5 text-[10px] text-[#71717a] m-0 mb-4">
              <Info size={11} /> {COIN_RATE} coins = ₹1
            </p>
            <div className="relative z-[1] flex gap-2 flex-wrap">
              <button
                type="button"
                className={`action-btn tn-focusable flex-1 justify-center whitespace-nowrap bg-[#facc15]/[0.08] border border-[#facc15]/[0.18] px-[14px] py-[9px] max-[359px]:px-[10px] max-[359px]:py-2 rounded-[10px] font-bold cursor-pointer text-[#facc15] text-[11px] max-[359px]:text-[10px] flex items-center gap-1.5 ${FONT} transition-all duration-200 hover:bg-[#facc15]/[0.14]`}
                onClick={() => setShowBankPopup(true)}
              >
                <Building2 size={14} /> {hasBank ? "Bank Saved" : "Add Bank"}
                {hasBank && (
                  <CheckCircle size={12} className="text-[#4ade80]" />
                )}
              </button>
              <button
                type="button"
                className={`action-btn tn-focusable flex-1 justify-center whitespace-nowrap bg-[#facc15]/[0.08] border border-[#facc15]/[0.18] px-[14px] py-[9px] max-[359px]:px-[10px] max-[359px]:py-2 rounded-[10px] font-bold cursor-pointer text-[#facc15] text-[11px] max-[359px]:text-[10px] flex items-center gap-1.5 ${FONT} transition-all duration-200 hover:bg-[#facc15]/[0.14]`}
                onClick={() => setShowUpiPopup(true)}
              >
                <Smartphone size={14} /> {hasUpi ? "UPI Saved" : "Add UPI"}
                {hasUpi && <CheckCircle size={12} className="text-[#4ade80]" />}
              </button>
              <button
                type="button"
                className={`action-btn tn-focusable flex-1 justify-center whitespace-nowrap bg-gradient-to-br from-[#facc15] to-[#eab308] border-none px-[14px] py-[9px] max-[359px]:px-[10px] max-[359px]:py-2 rounded-[10px] font-bold cursor-pointer text-black text-[11px] max-[359px]:text-[10px] flex items-center gap-1.5 shadow-[0_0_14px_rgba(250,204,21,0.2)] ${FONT} transition-all duration-200 hover:shadow-[0_4px_18px_rgba(250,204,21,0.3)]`}
                onClick={() => setShowWithdrawPopup(true)}
              >
                <Banknote size={14} /> Withdraw
              </button>
            </div>
          </div>

          {/* SAVED PAYMENT METHODS SUMMARY */}
          {(hasUpi || hasBank) && (
            <div
              className="wallet-card bg-[#111111]/[0.88] border border-[#facc15]/10 rounded-[18px] p-4 mb-[16px] backdrop-blur-[18px] flex flex-col gap-2.5 transition-colors duration-300"
              style={{ animation: "cardIn 0.5s var(--ease-premium) both" }}
            >
              {hasUpi && (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-[9px] bg-[#facc15]/10 text-[#facc15] flex items-center justify-center shrink-0">
                      <Smartphone size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-[#a1a1aa] m-0 leading-tight">
                        UPI
                      </p>
                      <p className="text-[12.5px] font-semibold m-0 truncate">
                        {upiForm.upiId}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(upiForm.upiId, "upi")}
                    aria-label="Copy UPI ID"
                    className="tn-focusable shrink-0 w-8 h-8 rounded-[9px] bg-white/[0.05] hover:bg-white/[0.1] text-[#a1a1aa] hover:text-[#facc15] flex items-center justify-center transition-colors duration-150"
                  >
                    {copiedField === "upi" ? (
                      <Check size={14} className="text-[#4ade80]" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              )}
              {hasBank && (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-[9px] bg-[#facc15]/10 text-[#facc15] flex items-center justify-center shrink-0">
                      <Building2 size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-[#a1a1aa] m-0 leading-tight">
                        Bank Account
                      </p>
                      <p className="text-[12.5px] font-semibold m-0 truncate">
                        •••• {bankForm.accountNumber.slice(-4)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(bankForm.accountNumber, "bank")
                    }
                    aria-label="Copy account number"
                    className="tn-focusable shrink-0 w-8 h-8 rounded-[9px] bg-white/[0.05] hover:bg-white/[0.1] text-[#a1a1aa] hover:text-[#facc15] flex items-center justify-center transition-colors duration-150"
                  >
                    {copiedField === "bank" ? (
                      <Check size={14} className="text-[#4ade80]" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STATS */}
          <div
            className="stats-grid mb-[16px]"
            style={{ animation: "cardIn 0.5s var(--ease-premium) both" }}
          >
            {/* Today's Earning */}
            <div className="wallet-card bg-[#111111]/[0.88] border border-[#facc15]/10 rounded-2xl p-[14px] backdrop-blur-[18px] transition-colors duration-300">
              <div className="w-[30px] h-[30px] rounded-[9px] bg-[#facc15]/10 text-[#facc15] flex items-center justify-center mb-2">
                <TrendingUp size={15} />
              </div>

              <p className="text-[11px] text-[#a1a1aa] m-0 mb-[5px] font-medium">
                Today's Earning
              </p>

              <p className="text-[16px] sm:text-[18px] text-[#facc15] font-extrabold m-0">
                {todayEarning.toLocaleString()} Coins
              </p>
            </div>

            {/* Total Earning */}
            <div className="wallet-card bg-[#111111]/[0.88] border border-[#facc15]/10 rounded-2xl p-[14px] backdrop-blur-[18px] transition-colors duration-300">
              <div className="w-[30px] h-[30px] rounded-[9px] bg-[#facc15]/10 text-[#facc15] flex items-center justify-center mb-2">
                <Coins size={15} />
              </div>

              <p className="text-[11px] text-[#a1a1aa] m-0 mb-[5px] font-medium">
                Total Earning
              </p>

              <p className="text-[16px] sm:text-[18px] text-[#facc15] font-extrabold m-0">
                {totalEarning.toLocaleString()} Coins
              </p>
            </div>

            {/* Total Withdrawn */}
            <div className="wallet-card bg-[#111111]/[0.88] border border-[#facc15]/10 rounded-2xl p-[14px] backdrop-blur-[18px] transition-colors duration-300">
              <div className="w-[30px] h-[30px] rounded-[9px] bg-[#facc15]/10 text-[#facc15] flex items-center justify-center mb-2">
                <Banknote size={15} />
              </div>

              <p className="text-[11px] text-[#a1a1aa] m-0 mb-[5px] font-medium">
                Total Withdrawn
              </p>

              <p className="text-[16px] sm:text-[18px] text-[#facc15] font-extrabold m-0">
                ₹{totalWithdrawn.toLocaleString()}
              </p>
            </div>
          </div>

          {/* HISTORY */}
          <div
            className="wallet-card bg-[#111111]/[0.88] border border-[#facc15]/10 rounded-[18px] overflow-hidden p-4 backdrop-blur-[18px] mb-[16px] transition-colors duration-300"
            style={{ animation: "cardIn 0.5s var(--ease-premium) both" }}
          >
            <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
              <h2 className="text-[14px] font-bold m-0">Withdrawal History</h2>
            </div>

            <div className="flex gap-[7px] mb-3.5 overflow-x-auto filter-scroll -mx-1 px-1">
              {historyFilters.map((f) => {
                const isActive = historyFilter === f.key;
                return (
                  <button
                    type="button"
                    key={f.key}
                    onClick={() => setHistoryFilter(f.key)}
                    className={`tn-focusable shrink-0 px-3 h-7 rounded-full text-[10.5px] font-bold border transition-colors duration-200 ${FONT} ${
                      isActive
                        ? "bg-gradient-to-br from-[#facc15] to-[#eab308] text-black border-transparent"
                        : "bg-white/[0.03] text-[#a1a1aa] border-white/[0.08] hover:border-[#facc15]/30"
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>

            {filteredHistory && filteredHistory.length > 0 ? (
              filteredHistory.map((h, i) => {
                const date = h.createdAt
                  ? new Date(
                      h.createdAt.seconds
                        ? h.createdAt.seconds * 1000
                        : h.createdAt,
                    )
                  : null;

                const status = String(h.status || "").toLowerCase();

                return (
                  <div
                    key={h.id || i}
                    className="bg-white/[0.03] rounded-xl px-4 py-3 mb-2 last:mb-0 border border-white/5 flex justify-between items-center gap-2"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#facc15]/10 flex items-center justify-center text-[#facc15] shrink-0">
                        {h.method === "upi" ? (
                          <Smartphone size={18} />
                        ) : (
                          <Banknote size={18} />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="text-white text-sm font-semibold truncate">
                          {h.method === "upi"
                            ? "UPI Transfer"
                            : "Bank Transfer"}
                        </p>

                        <p className="text-[#a1a1aa] text-[11px] truncate">
                          {date && !isNaN(date)
                            ? `${date.toLocaleDateString("en-IN")} • ${date.toLocaleTimeString("en-IN")}`
                            : "--"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-[#22c55e] font-bold text-sm">
                        ₹{h.amount}
                      </p>

                      {status === "approved" || status === "success" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] bg-green-500/15 text-green-400">
                          <CheckCircle size={10} />
                          Approved
                        </span>
                      ) : status === "rejected" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] bg-red-500/15 text-red-400">
                          <XCircle size={10} />
                          Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] bg-yellow-500/15 text-yellow-400">
                          <Clock size={10} />
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-9 text-[#a1a1aa]">
                <div className="w-12 h-12 rounded-full bg-white/[0.04] flex items-center justify-center mx-auto mb-3 text-[#71717a]">
                  <Inbox size={20} />
                </div>
                <p className="text-[12px] m-0">
                  {historyFilter === "all"
                    ? "No withdrawal history found."
                    : `No ${historyFilter} withdrawals found.`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ─── WITHDRAW MODAL (rendered via portal so it's never trapped by a transformed/animated ancestor) ─── */}
        {showWithdrawPopup &&
          createPortal(
            <div
              className="fixed inset-0 bg-black/75 flex justify-center items-end sm:items-center z-[999] backdrop-blur-[4px] animate-[fadeIn_0.18s_ease] p-0 sm:p-4"
              onClick={closeWithdraw}
            >
              <div
                className="w-full max-w-[480px] max-h-[92dvh] overflow-y-auto bg-[#161616] rounded-t-[24px] sm:rounded-[24px] px-5 pt-6 pb-9 border border-[#facc15]/[0.14] border-b-0 sm:border-b sm:border-b-[#facc15]/[0.14] animate-[slideUp_0.25s_ease_both]"
                style={{
                  paddingBottom: "max(36px, env(safe-area-inset-bottom))",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-9 h-1 bg-white/[0.12] rounded-sm mx-auto mb-5" />

                {withdrawSuccess ? (
                  <div className="text-center pt-2.5 pb-1">
                    <div className="w-16 h-16 rounded-full bg-[#22c55e]/[0.12] border-2 border-[#22c55e]/30 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} color="#22c55e" />
                    </div>
                    <h2 className="text-[20px] font-extrabold m-0 mb-1.5">
                      Request Submitted!
                    </h2>
                    <p className="text-[#a1a1aa] text-[12px] m-0 mb-5 leading-[18px] whitespace-pre-line">
                      Your withdrawal is being processed.{"\n"}
                      Amount will be credited within 24–48 hours.
                    </p>
                    <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-3 mb-5 text-left">
                      <div className="flex justify-between text-[12px] py-[5px] border-b border-white/5">
                        <span className="text-[#a1a1aa]">Amount</span>
                        <span className="text-white font-semibold">
                          ₹{withdrawAmount}
                        </span>
                      </div>
                      <div className="flex justify-between text-[12px] py-[5px] border-b border-white/5">
                        <span className="text-[#a1a1aa]">Method</span>
                        <span className="text-white font-semibold">
                          {withdrawTab === "upi" ? "UPI" : "Bank Transfer"}
                        </span>
                      </div>
                      <div className="flex justify-between text-[12px] py-[5px] border-b border-white/5">
                        <span className="text-[#a1a1aa]">Coins deducted</span>
                        <span className="text-white font-semibold">
                          {Number(withdrawAmount) * COIN_RATE}
                        </span>
                      </div>
                      <div className="flex justify-between text-[12px] py-[5px]">
                        <span className="text-[#a1a1aa]">Status</span>
                        <span className="text-[#fbbf24] font-semibold">
                          Pending
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`tn-focusable w-full bg-gradient-to-br from-[#facc15] to-[#eab308] border-none py-[13px] rounded-xl font-extrabold cursor-pointer text-black text-[13px] ${FONT}`}
                      onClick={closeWithdraw}
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-[18px]">
                      <h2 className="text-[18px] font-bold m-0">Withdraw</h2>
                      <button
                        type="button"
                        className="tn-focusable bg-white/[0.06] border-none w-8 h-8 rounded-[9px] text-[#a1a1aa] cursor-pointer flex items-center justify-center"
                        onClick={closeWithdraw}
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* UPI / BANK TOGGLE */}
                    <div className="flex bg-white/5 rounded-xl p-[3px] mb-[18px] gap-[3px]">
                      <button
                        type="button"
                        className={`tn-focusable flex-1 py-[9px] rounded-[10px] border-none text-[12px] font-semibold cursor-pointer ${FONT} flex items-center justify-center gap-1.5 transition-all duration-200 ${
                          withdrawTab === "upi"
                            ? "bg-gradient-to-br from-[#facc15] to-[#eab308] text-black"
                            : "bg-transparent text-[#a1a1aa]"
                        }`}
                        onClick={() => setWithdrawTab("upi")}
                      >
                        <Smartphone size={13} /> UPI
                      </button>
                      <button
                        type="button"
                        className={`tn-focusable flex-1 py-[9px] rounded-[10px] border-none text-[12px] font-semibold cursor-pointer ${FONT} flex items-center justify-center gap-1.5 transition-all duration-200 ${
                          withdrawTab === "bank"
                            ? "bg-gradient-to-br from-[#facc15] to-[#eab308] text-black"
                            : "bg-transparent text-[#a1a1aa]"
                        }`}
                        onClick={() => setWithdrawTab("bank")}
                      >
                        <Building2 size={13} /> Bank Transfer
                      </button>
                    </div>

                    {/* AMOUNT INPUT */}
                    <p className="text-[11px] text-[#a1a1aa] m-0 mb-2 ml-0.5">
                      Withdrawal Amount
                    </p>
                    <div className="relative mb-[10px]">
                      <span className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#facc15] text-[16px] font-bold">
                        ₹
                      </span>
                      <input
                        className={`w-full pl-7 pr-[14px] py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white outline-none text-[18px] font-bold ${FONT} transition-colors duration-200 placeholder:text-[#3f3f46] placeholder:text-[16px] placeholder:font-normal focus:border-[#facc15]/45 focus:shadow-[0_0_0_3px_rgba(250,204,21,0.08)]`}
                        type="number"
                        placeholder="0"
                        value={withdrawAmount}
                        onChange={(e) => {
                          setWithdrawAmount(e.target.value);
                          setWithdrawError("");
                        }}
                      />
                    </div>
                    {withdrawAmount && (
                      <p className="text-[10px] text-[#a1a1aa] -mt-1 mb-3">
                        Coins needed:{" "}
                        <span className="text-[#facc15] font-bold">
                          {Number(withdrawAmount) * COIN_RATE}
                        </span>{" "}
                        (You have{" "}
                        <span className="text-[#facc15] font-bold">
                          {coins}
                        </span>
                        )
                      </p>
                    )}

                    {/* QUICK AMOUNTS */}
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {quickAmounts.map((amt) => (
                        <button
                          type="button"
                          key={amt}
                          className={`tn-focusable flex-1 whitespace-nowrap text-center px-[10px] py-[7px] rounded-[9px] border text-[11px] max-[359px]:text-[10px] font-bold cursor-pointer ${FONT} transition-colors duration-150 ${
                            Number(withdrawAmount) === amt
                              ? "bg-[#facc15]/[0.18] border-[#facc15]/50 text-[#facc15]"
                              : "bg-[#facc15]/5 border-[#facc15]/20 text-[#facc15] hover:bg-[#facc15]/[0.18] hover:border-[#facc15]/50"
                          }`}
                          onClick={() => {
                            setWithdrawAmount(String(amt));
                            setWithdrawError("");
                          }}
                        >
                          ₹{amt}
                        </button>
                      ))}
                    </div>

                    {/* UPI OR BANK FIELDS */}
                    {withdrawTab === "upi" ? (
                      upiForm.upiId ? (
                        <div className="bg-white/5 border border-[#facc15]/20 rounded-xl p-4 mb-3">
                          <p className="text-[11px] text-[#a1a1aa] mb-1">
                            Saved UPI
                          </p>

                          <p className="text-[#facc15] text-[15px] font-bold">
                            {upiForm.upiId}
                          </p>

                          <p className="text-white text-[13px] mt-1">
                            App: {upiForm.appName}
                          </p>
                        </div>
                      ) : (
                        <>
                          <input
                            className={popupInputClass}
                            type="text"
                            placeholder="UPI ID (e.g. name@upi)"
                            value={upiForm.upiId}
                            onChange={(e) =>
                              setUpiForm({
                                ...upiForm,
                                upiId: e.target.value,
                              })
                            }
                          />

                          <input
                            className={popupInputClass}
                            type="text"
                            placeholder="UPI App Name (PhonePe, GPay...)"
                            value={upiForm.appName}
                            onChange={(e) =>
                              setUpiForm({
                                ...upiForm,
                                appName: e.target.value,
                              })
                            }
                          />
                        </>
                      )
                    ) : bankForm.accountNumber ? (
                      <div className="bg-white/5 border border-[#facc15]/20 rounded-xl p-4 mb-3">
                        <p className="text-[11px] text-[#a1a1aa] mb-1">
                          Saved Bank Account
                        </p>

                        <p className="text-white text-[13px]">
                          <b>Holder:</b> {bankForm.accountHolder}
                        </p>

                        <p className="text-white text-[13px]">
                          <b>Account:</b> {bankForm.accountNumber}
                        </p>

                        <p className="text-white text-[13px]">
                          <b>IFSC:</b> {bankForm.ifsc}
                        </p>
                      </div>
                    ) : (
                      <>
                        <input
                          className={popupInputClass}
                          type="text"
                          placeholder="Account Number"
                          value={bankForm.accountNumber}
                          onChange={(e) =>
                            setBankForm({
                              ...bankForm,
                              accountNumber: e.target.value,
                            })
                          }
                        />

                        <input
                          className={popupInputClass}
                          type="text"
                          placeholder="IFSC Code"
                          value={bankForm.ifsc}
                          onChange={(e) =>
                            setBankForm({
                              ...bankForm,
                              ifsc: e.target.value,
                            })
                          }
                        />

                        <input
                          className={popupInputClass}
                          type="text"
                          placeholder="Account Holder Name"
                          value={bankForm.accountHolder}
                          onChange={(e) =>
                            setBankForm({
                              ...bankForm,
                              accountHolder: e.target.value,
                            })
                          }
                        />
                      </>
                    )}

                    {withdrawError && (
                      <p className="text-[#ff5c5c] text-[11px] m-0 mb-[10px] text-center">
                        {withdrawError}
                      </p>
                    )}

                    <button
                      type="button"
                      className={popupSaveClass}
                      onClick={handleWithdraw}
                      disabled={withdrawLoading}
                    >
                      {withdrawLoading ? (
                        <>
                          <span className="w-[14px] h-[14px] border-2 border-black/20 border-t-black rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Banknote size={15} /> Confirm Withdrawal
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>,
            document.body,
          )}

        {/* ─── ADD BANK MODAL ─── */}
        {showBankPopup &&
          createPortal(
            <div
              className="fixed inset-0 bg-black/75 flex justify-center items-end sm:items-center z-[999] backdrop-blur-[4px] animate-[fadeIn_0.18s_ease] p-0 sm:p-4"
              onClick={() => setShowBankPopup(false)}
            >
              <div
                className="w-full max-w-[480px] max-h-[92dvh] overflow-y-auto bg-[#161616] rounded-t-[24px] sm:rounded-[24px] px-5 pt-6 pb-9 border border-[#facc15]/[0.14] border-b-0 sm:border-b sm:border-b-[#facc15]/[0.14] animate-[slideUp_0.25s_ease_both]"
                style={{
                  paddingBottom: "max(36px, env(safe-area-inset-bottom))",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-9 h-1 bg-white/[0.12] rounded-sm mx-auto mb-5" />

                <div className="flex justify-between items-center mb-[18px]">
                  <h2 className="text-[18px] font-bold m-0">
                    Add Bank Account
                  </h2>

                  <button
                    type="button"
                    className="tn-focusable bg-white/[0.06] border-none w-8 h-8 rounded-[9px] text-[#a1a1aa] cursor-pointer flex items-center justify-center"
                    onClick={() => setShowBankPopup(false)}
                  >
                    <X size={16} />
                  </button>
                </div>

                <input
                  className={popupInputClass}
                  type="text"
                  placeholder="Account Number"
                  value={bankForm.accountNumber}
                  onChange={(e) =>
                    setBankForm({
                      ...bankForm,
                      accountNumber: e.target.value,
                    })
                  }
                />

                <input
                  className={popupInputClass}
                  type="text"
                  placeholder="Confirm Account Number"
                  value={bankForm.confirmAccountNumber}
                  onChange={(e) =>
                    setBankForm({
                      ...bankForm,
                      confirmAccountNumber: e.target.value,
                    })
                  }
                />

                <input
                  className={popupInputClass}
                  type="text"
                  placeholder="IFSC Code"
                  value={bankForm.ifsc}
                  onChange={(e) =>
                    setBankForm({
                      ...bankForm,
                      ifsc: e.target.value,
                    })
                  }
                />

                <input
                  className={popupInputClass}
                  type="text"
                  placeholder="Bank Name"
                  value={bankForm.bankName}
                  onChange={(e) =>
                    setBankForm({
                      ...bankForm,
                      bankName: e.target.value,
                    })
                  }
                />

                <input
                  className={popupInputClass}
                  type="text"
                  placeholder="Account Holder Name"
                  value={bankForm.accountHolder}
                  onChange={(e) =>
                    setBankForm({
                      ...bankForm,
                      accountHolder: e.target.value,
                    })
                  }
                />

                <button
                  type="button"
                  className={popupSaveClass}
                  onClick={handleSaveBank}
                >
                  <Building2 size={15} />
                  Save Bank Account
                </button>
              </div>
            </div>,
            document.body,
          )}

        {/* ─── ADD UPI MODAL ─── */}
        {showUpiPopup &&
          createPortal(
            <div
              className="fixed inset-0 bg-black/75 flex justify-center items-end sm:items-center z-[999] backdrop-blur-[4px] animate-[fadeIn_0.18s_ease] p-0 sm:p-4"
              onClick={() => setShowUpiPopup(false)}
            >
              <div
                className="w-full max-w-[480px] max-h-[92dvh] overflow-y-auto bg-[#161616] rounded-t-[24px] sm:rounded-[24px] px-5 pt-6 pb-9 border border-[#facc15]/[0.14] border-b-0 sm:border-b sm:border-b-[#facc15]/[0.14] animate-[slideUp_0.25s_ease_both]"
                style={{
                  paddingBottom: "max(36px, env(safe-area-inset-bottom))",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-9 h-1 bg-white/[0.12] rounded-sm mx-auto mb-5" />

                <div className="flex justify-between items-center mb-[18px]">
                  <h2 className="text-[18px] font-bold m-0">Add UPI</h2>

                  <button
                    type="button"
                    className="tn-focusable bg-white/[0.06] border-none w-8 h-8 rounded-[9px] text-[#a1a1aa] cursor-pointer flex items-center justify-center"
                    onClick={() => setShowUpiPopup(false)}
                  >
                    <X size={16} />
                  </button>
                </div>

                <input
                  className={popupInputClass}
                  type="text"
                  placeholder="UPI ID (e.g. name@upi)"
                  value={upiForm.upiId}
                  onChange={(e) =>
                    setUpiForm({
                      ...upiForm,
                      upiId: e.target.value,
                    })
                  }
                />

                <input
                  className={popupInputClass}
                  type="text"
                  placeholder="UPI App Name (PhonePe, GPay...)"
                  value={upiForm.appName}
                  onChange={(e) =>
                    setUpiForm({
                      ...upiForm,
                      appName: e.target.value,
                    })
                  }
                />

                <button
                  type="button"
                  className={popupSaveClass}
                  onClick={handleSaveUpi}
                >
                  <Smartphone size={15} />
                  Save UPI
                </button>
              </div>
            </div>,
            document.body,
          )}

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
      </div>
    </div>
  );
}

export default Wallet;

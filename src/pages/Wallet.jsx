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
  ChevronRight,
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
  const [selectedHistory, setSelectedHistory] = useState(null);

  const [withdrawTab, setWithdrawTab] = useState("upi");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  const [wallet, setWallet] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyFilter, setHistoryFilter] = useState("all");
  const [copiedField, setCopiedField] = useState("");
  const [coinPulse, setCoinPulse] = useState(false);

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
      loadWallet({ silent: true });
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
      await addUpi({ upiId: upiForm.upiId, upiApp: upiForm.appName });
      alert("UPI saved successfully");
      setShowUpiPopup(false);
      setUpiForm({ upiId: "", appName: "" });
      loadWallet({ silent: true });
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

  useEffect(() => {
    loadWallet();
  }, []);

  useEffect(() => {
    loadWallet({ silent: true });
  }, [location.pathname]);

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
  }, []);

  const popupInputClass = `w-full px-[14px] py-3 mb-[10px] rounded-xl border border-[#e5e7eb] bg-white text-[#111827] outline-none text-[13px] ${FONT} transition-colors duration-200 placeholder:text-[#9ca3af] focus:border-[#22c55e] shadow-sm`;
  const popupSaveClass = `w-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] border-none py-[14px] rounded-xl font-extrabold cursor-pointer text-white text-[13px] mt-1 ${FONT} transition-all duration-200 flex items-center justify-center gap-2 enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_4px_18px_rgba(34,197,94,0.3)] disabled:opacity-60 disabled:cursor-not-allowed`;

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
          Loading your wallet
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
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
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
        
        /* Sticky Header Fix */
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

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(10px, 1.6vw, 16px);
        }
        @media (min-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(3, minmax(0, 260px)); justify-content: start; }
        }
        @media (max-width: 340px) {
          .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        .filter-scroll::-webkit-scrollbar { display: none; }
        .tn-focusable:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }

        @media (hover: hover) {
          .wallet-card:hover { border-color: rgba(34, 197, 94, 0.4); }
          .action-btn:hover { transform: translateY(-2px); }
          .history-item:hover { background: #f9fafb; }
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
      `}</style>

      <div
        className="relative z-0"
        style={{ animation: "pageFadeIn 0.4s var(--ease-premium) both" }}
      >
        <div className="tn-shell relative z-10">
          {/* TOP BAR - Yahan se khali space hata diya gaya hai */}
          <div className="tn-header flex justify-between items-center gap-2.5">
            <div className="min-w-0">
              <h1 className="text-[clamp(20px,1.2vw+16px,28px)] font-extrabold bg-gradient-to-r from-[#16a34a] to-[#111827] bg-clip-text text-transparent m-0 mb-1 flex items-center gap-2 truncate">
                <WalletIcon size={22} className="text-[#16a34a] shrink-0" />{" "}
                Wallet
              </h1>
              <p className="text-[#6b7280] text-[clamp(10px,0.3vw+8px,12px)] m-0 truncate">
                Manage earnings and withdrawals
              </p>
            </div>

            {/* Golden Coin Badge */}
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

          {/* Balance Card */}
          <div
            className="wallet-card relative overflow-hidden bg-white border border-[#e5e7eb] rounded-2xl px-5 py-5 mb-4 shadow-[0_1px_3px_rgba(17,24,39,0.04)] transition-colors duration-300"
            style={{ animation: "cardIn 0.5s var(--ease-premium) both" }}
          >
            <div className="absolute -top-10 -right-10 w-[160px] h-[160px] rounded-full bg-[radial-gradient(circle,rgba(220,252,231,0.8),transparent_70%)] pointer-events-none" />
            <p className="text-[#6b7280] text-[11px] m-0 mb-1">Your Coins</p>
            <h1 className="text-[clamp(28px,3vw+22px,46px)] text-[#d97706] m-0 mb-0.5 font-extrabold leading-none">
              {coins.toLocaleString()}
            </h1>
            <p className="text-[13px] text-[#6b7280] m-0 mb-1.5 flex items-center flex-wrap gap-x-1.5">
              ≈ <span className="text-[#16a34a] font-bold">₹{rupees}</span>{" "}
              withdrawable value
            </p>
            <p className="relative z-[1] flex items-center gap-1.5 text-[10px] text-[#9ca3af] m-0 mb-4">
              <Info size={11} /> {COIN_RATE} coins = ₹1
            </p>
            <div className="relative z-[1] flex gap-2 flex-wrap">
              <button
                type="button"
                className={`action-btn tn-focusable flex-1 justify-center whitespace-nowrap bg-[#f9fafb] border border-[#e5e7eb] px-3 py-2 rounded-xl font-bold cursor-pointer text-[#111827] text-[11px] flex items-center gap-1.5 ${FONT} transition-all duration-200 hover:bg-[#f3f4f6]`}
                onClick={() => setShowBankPopup(true)}
              >
                <Building2 size={14} /> {hasBank ? "Bank Saved" : "Add Bank"}
                {hasBank && (
                  <CheckCircle size={12} className="text-[#16a34a]" />
                )}
              </button>
              <button
                type="button"
                className={`action-btn tn-focusable flex-1 justify-center whitespace-nowrap bg-[#f9fafb] border border-[#e5e7eb] px-3 py-2 rounded-xl font-bold cursor-pointer text-[#111827] text-[11px] flex items-center gap-1.5 ${FONT} transition-all duration-200 hover:bg-[#f3f4f6]`}
                onClick={() => setShowUpiPopup(true)}
              >
                <Smartphone size={14} /> {hasUpi ? "UPI Saved" : "Add UPI"}
                {hasUpi && <CheckCircle size={12} className="text-[#16a34a]" />}
              </button>
              <button
                type="button"
                className={`action-btn tn-focusable flex-1 justify-center whitespace-nowrap bg-gradient-to-br from-[#22c55e] to-[#16a34a] border-none px-3 py-2 rounded-xl font-bold cursor-pointer text-white text-[11px] flex items-center gap-1.5 shadow-[0_2px_10px_rgba(34,197,94,0.2)] ${FONT} transition-all duration-200 hover:shadow-[0_4px_14px_rgba(34,197,94,0.3)]`}
                onClick={() => setShowWithdrawPopup(true)}
              >
                <Banknote size={14} /> Withdraw
              </button>
            </div>
          </div>

          {/* Saved Summary */}
          {(hasUpi || hasBank) && (
            <div
              className="wallet-card bg-white border border-[#e5e7eb] rounded-2xl p-4 mb-4 shadow-[0_1px_3px_rgba(17,24,39,0.04)] flex flex-col gap-2.5 transition-colors duration-300"
              style={{ animation: "cardIn 0.5s var(--ease-premium) both" }}
            >
              {hasUpi && (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#dcfce7] text-[#16a34a] flex items-center justify-center shrink-0">
                      <Smartphone size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-[#6b7280] m-0 leading-tight">
                        UPI
                      </p>
                      <p className="text-[12.5px] font-semibold m-0 truncate text-[#111827]">
                        {upiForm.upiId}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(upiForm.upiId, "upi")}
                    className="tn-focusable shrink-0 w-8 h-8 rounded-lg bg-[#f9fafb] hover:bg-[#f3f4f6] border border-[#e5e7eb] text-[#6b7280] hover:text-[#16a34a] flex items-center justify-center transition-colors duration-150"
                  >
                    {copiedField === "upi" ? (
                      <Check size={14} className="text-[#16a34a]" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              )}
              {hasBank && (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#dcfce7] text-[#16a34a] flex items-center justify-center shrink-0">
                      <Building2 size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-[#6b7280] m-0 leading-tight">
                        Bank Account
                      </p>
                      <p className="text-[12.5px] font-semibold m-0 truncate text-[#111827]">
                        •••• {bankForm.accountNumber.slice(-4)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(bankForm.accountNumber, "bank")
                    }
                    className="tn-focusable shrink-0 w-8 h-8 rounded-lg bg-[#f9fafb] hover:bg-[#f3f4f6] border border-[#e5e7eb] text-[#6b7280] hover:text-[#16a34a] flex items-center justify-center transition-colors duration-150"
                  >
                    {copiedField === "bank" ? (
                      <Check size={14} className="text-[#16a34a]" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Stats */}
          <div
            className="stats-grid mb-4"
            style={{ animation: "cardIn 0.5s var(--ease-premium) both" }}
          >
            <div className="wallet-card bg-white border border-[#e5e7eb] rounded-2xl p-3.5 shadow-[0_1px_3px_rgba(17,24,39,0.04)] transition-colors duration-300">
              <div className="w-7 h-7 rounded-lg bg-[#dcfce7] text-[#16a34a] flex items-center justify-center mb-2">
                <TrendingUp size={15} />
              </div>
              <p className="text-[10.5px] text-[#6b7280] m-0 mb-1 font-medium">
                Today's Earning
              </p>
              <p className="text-[15px] sm:text-[16px] text-[#111827] font-extrabold m-0">
                {todayEarning.toLocaleString()} Coins
              </p>
            </div>
            <div className="wallet-card bg-white border border-[#e5e7eb] rounded-2xl p-3.5 shadow-[0_1px_3px_rgba(17,24,39,0.04)] transition-colors duration-300">
              <div className="w-7 h-7 rounded-lg bg-[#dcfce7] text-[#16a34a] flex items-center justify-center mb-2">
                <Coins size={15} />
              </div>
              <p className="text-[10.5px] text-[#6b7280] m-0 mb-1 font-medium">
                Total Earning
              </p>
              <p className="text-[15px] sm:text-[16px] text-[#111827] font-extrabold m-0">
                {totalEarning.toLocaleString()} Coins
              </p>
            </div>
            <div className="wallet-card bg-white border border-[#e5e7eb] rounded-2xl p-3.5 shadow-[0_1px_3px_rgba(17,24,39,0.04)] transition-colors duration-300">
              <div className="w-7 h-7 rounded-lg bg-[#dcfce7] text-[#16a34a] flex items-center justify-center mb-2">
                <Banknote size={15} />
              </div>
              <p className="text-[10.5px] text-[#6b7280] m-0 mb-1 font-medium">
                Total Withdrawn
              </p>
              <p className="text-[15px] sm:text-[16px] text-[#111827] font-extrabold m-0">
                ₹{totalWithdrawn.toLocaleString()}
              </p>
            </div>
          </div>

          {/* History */}
          <div
            className="wallet-card bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden p-4 shadow-[0_1px_3px_rgba(17,24,39,0.04)] mb-4 transition-colors duration-300"
            style={{ animation: "cardIn 0.5s var(--ease-premium) both" }}
          >
            <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
              <h2 className="text-[14px] font-bold m-0 text-[#111827]">
                Withdrawal History
              </h2>
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
                        ? "bg-gradient-to-br from-[#22c55e] to-[#16a34a] text-white border-transparent"
                        : "bg-white text-[#6b7280] border-[#e5e7eb] hover:border-[#86efac]"
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
                    onClick={() => setSelectedHistory(h)}
                    className="history-item cursor-pointer bg-[#f9fafb] hover:bg-white rounded-xl px-3 py-2.5 mb-2 last:mb-0 border border-[#e5e7eb] flex justify-between items-center gap-2 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-[#dcfce7] flex items-center justify-center text-[#16a34a] shrink-0">
                        {h.method === "upi" ? (
                          <Smartphone size={16} />
                        ) : (
                          <Banknote size={16} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[#111827] text-[13px] font-semibold truncate">
                          {h.method === "upi"
                            ? "UPI Transfer"
                            : "Bank Transfer"}
                        </p>
                        <p className="text-[#6b7280] text-[10.5px] truncate">
                          {date && !isNaN(date)
                            ? `${date.toLocaleDateString("en-IN")}`
                            : "--"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <p className="text-[#16a34a] font-bold text-[13px]">
                          ₹{h.amount}
                        </p>
                        {status === "approved" || status === "success" ? (
                          <span className="inline-flex items-center gap-1 text-[9px] text-[#16a34a] font-semibold">
                            Approved
                          </span>
                        ) : status === "rejected" ? (
                          <span className="inline-flex items-center gap-1 text-[9px] text-[#ef4444] font-semibold">
                            Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[9px] text-[#d97706] font-semibold">
                            Pending
                          </span>
                        )}
                      </div>
                      <ChevronRight size={16} className="text-[#9ca3af]" />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-[#6b7280]">
                <div className="w-12 h-12 rounded-full bg-[#f3f4f6] flex items-center justify-center mx-auto mb-3 text-[#9ca3af]">
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
      </div>

      {/* --- ALL MODALS VIA PORTAL --- */}
      {showWithdrawPopup &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/60 flex justify-center items-end sm:items-center z-[999] backdrop-blur-sm animate-[fadeIn_0.18s_ease] p-0 sm:p-4"
            onClick={closeWithdraw}
          >
            <div
              className="w-full max-w-[480px] max-h-[92dvh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl px-5 pt-6 pb-9 border border-[#e5e7eb] animate-[slideUp_0.25s_ease_both]"
              style={{
                paddingBottom: "max(36px, env(safe-area-inset-bottom))",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-9 h-1 bg-gray-200 rounded-sm mx-auto mb-5" />
              {withdrawSuccess ? (
                <div className="text-center pt-2.5 pb-1">
                  <div className="w-16 h-16 rounded-full bg-[#dcfce7] flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-[#16a34a]" />
                  </div>
                  <h2 className="text-[20px] font-extrabold m-0 mb-1.5 text-[#111827]">
                    Request Submitted!
                  </h2>
                  <p className="text-[#6b7280] text-[12px] m-0 mb-5 leading-[18px] whitespace-pre-line">
                    Your withdrawal is being processed.{"\n"}Amount will be
                    credited within 24–48 hours.
                  </p>
                  <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-3 mb-5 text-left">
                    <div className="flex justify-between text-[12px] py-[5px] border-b border-[#e5e7eb]">
                      <span className="text-[#6b7280]">Amount</span>
                      <span className="text-[#111827] font-semibold">
                        ₹{withdrawAmount}
                      </span>
                    </div>
                    <div className="flex justify-between text-[12px] py-[5px] border-b border-[#e5e7eb]">
                      <span className="text-[#6b7280]">Method</span>
                      <span className="text-[#111827] font-semibold">
                        {withdrawTab === "upi" ? "UPI" : "Bank Transfer"}
                      </span>
                    </div>
                    <div className="flex justify-between text-[12px] py-[5px] border-b border-[#e5e7eb]">
                      <span className="text-[#6b7280]">Coins deducted</span>
                      <span className="text-[#111827] font-semibold">
                        {Number(withdrawAmount) * COIN_RATE}
                      </span>
                    </div>
                    <div className="flex justify-between text-[12px] py-[5px]">
                      <span className="text-[#6b7280]">Status</span>
                      <span className="text-[#d97706] font-semibold">
                        Pending
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={popupSaveClass}
                    onClick={closeWithdraw}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-[18px]">
                    <h2 className="text-[18px] font-bold m-0 text-[#111827]">
                      Withdraw
                    </h2>
                    <button
                      type="button"
                      className="tn-focusable bg-[#f3f4f6] border-none w-8 h-8 rounded-lg text-[#6b7280] cursor-pointer flex items-center justify-center"
                      onClick={closeWithdraw}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="flex bg-[#f3f4f6] rounded-xl p-[3px] mb-[18px] gap-[3px]">
                    <button
                      type="button"
                      className={`tn-focusable flex-1 py-[9px] rounded-lg border-none text-[12px] font-semibold cursor-pointer ${FONT} flex items-center justify-center gap-1.5 transition-all duration-200 ${withdrawTab === "upi" ? "bg-white shadow-sm text-[#111827]" : "bg-transparent text-[#6b7280]"}`}
                      onClick={() => setWithdrawTab("upi")}
                    >
                      <Smartphone size={13} /> UPI
                    </button>
                    <button
                      type="button"
                      className={`tn-focusable flex-1 py-[9px] rounded-lg border-none text-[12px] font-semibold cursor-pointer ${FONT} flex items-center justify-center gap-1.5 transition-all duration-200 ${withdrawTab === "bank" ? "bg-white shadow-sm text-[#111827]" : "bg-transparent text-[#6b7280]"}`}
                      onClick={() => setWithdrawTab("bank")}
                    >
                      <Building2 size={13} /> Bank Transfer
                    </button>
                  </div>
                  <p className="text-[11px] text-[#6b7280] m-0 mb-2 ml-0.5">
                    Withdrawal Amount
                  </p>
                  <div className="relative mb-[10px]">
                    <span className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#16a34a] text-[16px] font-bold">
                      ₹
                    </span>
                    <input
                      className={`w-full pl-7 pr-[14px] py-3 rounded-xl border border-[#e5e7eb] bg-white text-[#111827] outline-none text-[18px] font-bold ${FONT} transition-colors duration-200 placeholder:text-[#9ca3af] placeholder:text-[16px] placeholder:font-normal focus:border-[#22c55e] shadow-sm`}
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
                    <p className="text-[10px] text-[#6b7280] -mt-1 mb-3">
                      Coins needed:{" "}
                      <span className="text-[#d97706] font-bold">
                        {Number(withdrawAmount) * COIN_RATE}
                      </span>{" "}
                      (You have{" "}
                      <span className="text-[#d97706] font-bold">{coins}</span>)
                    </p>
                  )}
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {quickAmounts.map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        className={`tn-focusable flex-1 whitespace-nowrap text-center px-[10px] py-[7px] rounded-lg border text-[11px] font-bold cursor-pointer ${FONT} transition-colors duration-150 ${Number(withdrawAmount) === amt ? "bg-[#dcfce7] border-[#86efac] text-[#16a34a]" : "bg-white border-[#e5e7eb] text-[#6b7280] hover:bg-gray-50"}`}
                        onClick={() => {
                          setWithdrawAmount(String(amt));
                          setWithdrawError("");
                        }}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                  {withdrawTab === "upi" ? (
                    upiForm.upiId ? (
                      <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl p-4 mb-3">
                        <p className="text-[11px] text-[#6b7280] mb-1">
                          Saved UPI
                        </p>
                        <p className="text-[#16a34a] text-[15px] font-bold">
                          {upiForm.upiId}
                        </p>
                        <p className="text-[#111827] text-[13px] mt-1">
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
                            setUpiForm({ ...upiForm, upiId: e.target.value })
                          }
                        />
                        <input
                          className={popupInputClass}
                          type="text"
                          placeholder="UPI App Name (PhonePe, GPay...)"
                          value={upiForm.appName}
                          onChange={(e) =>
                            setUpiForm({ ...upiForm, appName: e.target.value })
                          }
                        />
                      </>
                    )
                  ) : bankForm.accountNumber ? (
                    <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl p-4 mb-3">
                      <p className="text-[11px] text-[#6b7280] mb-1">
                        Saved Bank Account
                      </p>
                      <p className="text-[#111827] text-[13px]">
                        <b>Holder:</b> {bankForm.accountHolder}
                      </p>
                      <p className="text-[#111827] text-[13px]">
                        <b>Account:</b> {bankForm.accountNumber}
                      </p>
                      <p className="text-[#111827] text-[13px]">
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
                          setBankForm({ ...bankForm, ifsc: e.target.value })
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
                    <p className="text-[#ef4444] text-[11px] m-0 mb-[10px] text-center">
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
                        <span className="w-[14px] h-[14px] border-2 border-white/40 border-t-white rounded-full animate-spin" />{" "}
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

      {showBankPopup &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/60 flex justify-center items-end sm:items-center z-[999] backdrop-blur-sm animate-[fadeIn_0.18s_ease] p-0 sm:p-4"
            onClick={() => setShowBankPopup(false)}
          >
            <div
              className="w-full max-w-[480px] max-h-[92dvh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl px-5 pt-6 pb-9 border border-[#e5e7eb] animate-[slideUp_0.25s_ease_both]"
              style={{
                paddingBottom: "max(36px, env(safe-area-inset-bottom))",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-9 h-1 bg-gray-200 rounded-sm mx-auto mb-5" />
              <div className="flex justify-between items-center mb-[18px]">
                <h2 className="text-[18px] font-bold m-0 text-[#111827]">
                  Add Bank Account
                </h2>
                <button
                  type="button"
                  className="tn-focusable bg-[#f3f4f6] border-none w-8 h-8 rounded-lg text-[#6b7280] cursor-pointer flex items-center justify-center"
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
                  setBankForm({ ...bankForm, accountNumber: e.target.value })
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
                  setBankForm({ ...bankForm, ifsc: e.target.value })
                }
              />
              <input
                className={popupInputClass}
                type="text"
                placeholder="Bank Name"
                value={bankForm.bankName}
                onChange={(e) =>
                  setBankForm({ ...bankForm, bankName: e.target.value })
                }
              />
              <input
                className={popupInputClass}
                type="text"
                placeholder="Account Holder Name"
                value={bankForm.accountHolder}
                onChange={(e) =>
                  setBankForm({ ...bankForm, accountHolder: e.target.value })
                }
              />
              <button
                type="button"
                className={popupSaveClass}
                onClick={handleSaveBank}
              >
                <Building2 size={15} /> Save Bank Account
              </button>
            </div>
          </div>,
          document.body,
        )}

      {showUpiPopup &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/60 flex justify-center items-end sm:items-center z-[999] backdrop-blur-sm animate-[fadeIn_0.18s_ease] p-0 sm:p-4"
            onClick={() => setShowUpiPopup(false)}
          >
            <div
              className="w-full max-w-[480px] max-h-[92dvh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl px-5 pt-6 pb-9 border border-[#e5e7eb] animate-[slideUp_0.25s_ease_both]"
              style={{
                paddingBottom: "max(36px, env(safe-area-inset-bottom))",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-9 h-1 bg-gray-200 rounded-sm mx-auto mb-5" />
              <div className="flex justify-between items-center mb-[18px]">
                <h2 className="text-[18px] font-bold m-0 text-[#111827]">
                  Add UPI
                </h2>
                <button
                  type="button"
                  className="tn-focusable bg-[#f3f4f6] border-none w-8 h-8 rounded-lg text-[#6b7280] cursor-pointer flex items-center justify-center"
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
                  setUpiForm({ ...upiForm, upiId: e.target.value })
                }
              />
              <input
                className={popupInputClass}
                type="text"
                placeholder="UPI App Name (PhonePe, GPay...)"
                value={upiForm.appName}
                onChange={(e) =>
                  setUpiForm({ ...upiForm, appName: e.target.value })
                }
              />
              <button
                type="button"
                className={popupSaveClass}
                onClick={handleSaveUpi}
              >
                <Smartphone size={15} /> Save UPI
              </button>
            </div>
          </div>,
          document.body,
        )}

      {/* --- HISTORY DETAILS MODAL (Arrow click) --- */}
      {selectedHistory &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/60 flex justify-center items-end sm:items-center z-[999] backdrop-blur-sm animate-[fadeIn_0.18s_ease] p-0 sm:p-4"
            onClick={() => setSelectedHistory(null)}
          >
            <div
              className="w-full max-w-[480px] bg-white rounded-t-3xl sm:rounded-3xl px-5 pt-6 pb-9 border border-[#e5e7eb] animate-[slideUp_0.25s_ease_both]"
              style={{
                paddingBottom: "max(36px, env(safe-area-inset-bottom))",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-9 h-1 bg-gray-200 rounded-sm mx-auto mb-5" />

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[18px] font-bold m-0 text-[#111827]">
                  Transaction Details
                </h2>
                <button
                  type="button"
                  className="tn-focusable bg-[#f3f4f6] border-none w-8 h-8 rounded-lg text-[#6b7280] cursor-pointer flex items-center justify-center"
                  onClick={() => setSelectedHistory(null)}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-[#f9fafb] border border-[#e5e7eb] flex items-center justify-center mx-auto mb-3">
                  {selectedHistory.method === "upi" ? (
                    <Smartphone size={28} className="text-[#16a34a]" />
                  ) : (
                    <Banknote size={28} className="text-[#16a34a]" />
                  )}
                </div>
                <h3 className="text-[28px] font-extrabold text-[#111827] m-0 mb-1">
                  ₹{selectedHistory.amount}
                </h3>
                <p className="text-[12px] text-[#6b7280] m-0">
                  via{" "}
                  {selectedHistory.method === "upi"
                    ? "UPI Transfer"
                    : "Bank Transfer"}
                </p>
              </div>

              <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl overflow-hidden mb-6">
                <div className="flex justify-between px-4 py-3 border-b border-[#e5e7eb]">
                  <span className="text-[12px] text-[#6b7280]">Status</span>
                  {String(selectedHistory.status).toLowerCase() ===
                    "approved" ||
                  String(selectedHistory.status).toLowerCase() === "success" ? (
                    <span className="text-[12px] text-[#16a34a] font-bold flex items-center gap-1">
                      <CheckCircle size={12} /> Approved
                    </span>
                  ) : String(selectedHistory.status).toLowerCase() ===
                    "rejected" ? (
                    <span className="text-[12px] text-[#ef4444] font-bold flex items-center gap-1">
                      <XCircle size={12} /> Rejected
                    </span>
                  ) : (
                    <span className="text-[12px] text-[#d97706] font-bold flex items-center gap-1">
                      <Clock size={12} /> Pending
                    </span>
                  )}
                </div>
                <div className="flex justify-between px-4 py-3 border-b border-[#e5e7eb]">
                  <span className="text-[12px] text-[#6b7280]">
                    Date & Time
                  </span>
                  <span className="text-[12px] font-semibold text-[#111827] text-right">
                    {selectedHistory.createdAt
                      ? new Date(
                          selectedHistory.createdAt.seconds
                            ? selectedHistory.createdAt.seconds * 1000
                            : selectedHistory.createdAt,
                        ).toLocaleString("en-IN")
                      : "--"}
                  </span>
                </div>
                <div className="flex justify-between px-4 py-3 border-b border-[#e5e7eb]">
                  <span className="text-[12px] text-[#6b7280]">
                    Transaction ID
                  </span>
                  <span className="text-[12px] font-semibold text-[#111827] truncate max-w-[150px]">
                    {selectedHistory.id || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between px-4 py-3">
                  <span className="text-[12px] text-[#6b7280]">
                    Account Used
                  </span>
                  <span className="text-[12px] font-semibold text-[#111827]">
                    {selectedHistory.method === "upi"
                      ? selectedHistory.upiId
                      : `•••• ${selectedHistory.accountNumber?.slice(-4) || ""}`}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className={popupSaveClass}
                onClick={() => setSelectedHistory(null)}
              >
                Close Details
              </button>
            </div>
          </div>,
          document.body,
        )}

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
    </div>
  );
}

export default Wallet;

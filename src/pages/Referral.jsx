import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProfile } from "../services/authServices";
import {
  User,
  Home as HomeIcon,
  ClipboardList,
  Wallet as WalletIcon,
  Gift,
  Users,
  TrendingUp,
  Flame,
  Copy,
  Check,
  Share2,
  Link2,
  CheckCircle2,
  Hourglass,
  Coins,
  MessageCircle,
  ChevronDown,
  Lock,
  Sparkles,
} from "lucide-react";

const DESIGN_SYSTEM_CSS = `
  :root {
    --brand: #16a34a;
    --brand-soft: #22c55e;
    --highlight: #dcfce7;
    --border: #e5e7eb;
    --muted: #6b7280;
    --ink: #111827;
    --bg: #F2F5F3;
    --surface: #FCFDFC;
    --surface-soft: #F6F9F6;
    --ease-premium: cubic-bezier(0.16, 1, 0.3, 1);
  }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes cardIn { from { opacity: 0; transform: translateY(14px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
  @keyframes pageFadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(220%); } }
  @keyframes tickerDot { 0%, 100% { opacity: 0.5; transform: scale(0.85); } 50% { opacity: 1; transform: scale(1); } }
  @media (prefers-reduced-motion: reduce) {
    * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
  }

  .rf-shell {
    max-width: 1180px;
    margin: 0 auto;
    padding-left: clamp(16px, 4vw, 40px);
    padding-right: clamp(16px, 4vw, 40px);
    padding-bottom: clamp(120px, 14vh, 140px);
    padding-top: 0;
  }

  .rf-header {
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

  .rf-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: clamp(14px, 1.8vw, 20px);
    box-shadow: 0 1px 3px rgba(17, 24, 39, 0.04);
    transition: transform 0.35s var(--ease-premium), box-shadow 0.35s var(--ease-premium), border-color 0.35s var(--ease-premium);
  }
  .rf-card-hi { border-color: #86efac; }

  @media (hover: hover) {
    .rf-card:hover {
      box-shadow: 0 10px 28px rgba(34, 197, 94, 0.10);
      border-color: rgba(34, 197, 94, 0.35);
    }
    .rf-btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(34, 197, 94, 0.32);
    }
    .rf-btn-ghost:hover {
      border-color: rgba(34, 197, 94, 0.45);
      color: var(--brand);
    }
    .rf-stat:hover { border-color: rgba(34, 197, 94, 0.45); transform: translateY(-2px); }
    .rf-navlink:hover { color: var(--brand); }
  }
  .rf-btn-primary:active:not(:disabled),
  .rf-btn-ghost:active,
  .rf-navlink:active { transform: scale(0.94); }
  .rf-focusable:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }

  .rf-title      { font-size: clamp(20px, 1.2vw + 16px, 28px); }
  .rf-hero-title { font-size: clamp(18px, 1.6vw + 12px, 24px); }
  .rf-hero-amt   { font-size: clamp(26px, 2.4vw + 14px, 36px); }
  .rf-card-title { font-size: clamp(12px, 0.4vw + 10.5px, 14px); }
  .rf-desc       { font-size: clamp(10.5px, 0.3vw + 9px, 12px); line-height: 1.55; }
  .rf-btn-text   { font-size: clamp(10.5px, 0.3vw + 9.5px, 12px); }
  .rf-chip       { font-size: clamp(9.5px, 0.3vw + 8.5px, 11px); }
  .rf-nav-label  { font-size: clamp(9px, 0.25vw + 8.5px, 10.5px); }

  .rf-stats {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: clamp(10px, 1.4vw, 14px);
  }
  @media (min-width: 640px) {
    .rf-stats { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  }

  .rf-tier {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .rf-linkbox {
    background: var(--surface-soft);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 11px 12px;
    color: var(--brand);
    font-size: clamp(10px, 0.3vw + 9px, 11.5px);
    word-break: break-all;
    margin-bottom: 10px;
    font-weight: 600;
  }
`;

function Referral() {
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const [profile, setProfile] = useState(null);
  const [coins, setCoins] = useState(0);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    pendingReferrals: 0,
    successfulReferrals: 0,
    referralEarnings: 0,
  });
  const [referralsList, setReferralsList] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();

        setProfile(data.user);
        setCoins(data.user.coins || 0);
        setStats({
          totalReferrals: data.user.totalReferrals || 0,
          pendingReferrals: data.user.pendingReferrals || 0,
          successfulReferrals: data.user.successfulReferrals || 0,
          referralEarnings: data.user.referralEarnings || 0,
        });

        const referralRes = await fetch(
          "https://tasklumo-backend.vercel.app/api/referrals",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        const referralData = await referralRes.json();

        if (referralData.success) {
          setReferralsList(referralData.referrals);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadProfile();
  }, []);

  const referralLink = profile
    ? `https://tasklumo.com/signup?ref=${profile.referralCode}`
    : "";
  const referralCount = 12;
  const nextMilestone = 15;
  const milestoneBonus = 100;
  const progressPct = Math.min(
    100,
    Math.round((referralCount / nextMilestone) * 100),
  );

  const navItems = [
    { to: "/home", icon: HomeIcon, label: "Home" },
    { to: "/tasks", icon: ClipboardList, label: "Tasks" },
    { to: "/wallet", icon: WalletIcon, label: "Wallet" },
    { to: "/referral", icon: Gift, label: "Invite" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  const rules = [
    "Friend signs up using your referral link.",
    "Friend verifies mobile number.",
    "Friend completes 2 genuine tasks.",
    "Friend earns 500 coins.",
    "You receive 200 coins.",
    "Your friend receives 100 bonus coins.",
  ];

  const statsData = [
    { icon: Users, value: stats.totalReferrals, label: "Total Referrals" },
    {
      icon: Hourglass,
      value: stats.pendingReferrals,
      label: "Pending Rewards",
    },
    {
      icon: CheckCircle2,
      value: stats.successfulReferrals,
      label: "Successful Referrals",
    },
    {
      icon: Coins,
      value: stats.referralEarnings,
      label: "Total Referral Coins",
    },
  ];

  const progressChecklist = [
    { label: "Friend Joined", state: "done" },
    { label: "Mobile Verified", state: "done" },
    { label: "2 Tasks Completed", state: "pending" },
    { label: "500 Coins Earned", state: "pending" },
    { label: "Reward Unlocked", state: "locked" },
  ];

  const history = referralsList.map((r) => ({
    name: r.referredName || "New User",
    status: r.status === "completed" ? "Completed" : "Pending",
    detail:
      r.status === "completed"
        ? "Reward: +200 Coins"
        : "Waiting for friend to complete requirements.",
    state: r.status === "completed" ? "done" : "pending",
  }));

  const faqs = [
    {
      q: "When will I get my reward?",
      a: "Your 200 coins are credited automatically as soon as your friend completes 2 genuine tasks and earns 500 coins.",
    },
    {
      q: "How many friends can I invite?",
      a: "There's no limit — invite as many friends as you like and earn rewards for every successful referral.",
    },
    {
      q: "Can I invite the same person twice?",
      a: "No, each referral link can only be used once per phone number or account.",
    },
    {
      q: "Why is my reward pending?",
      a: "Your reward stays pending until your friend finishes mobile verification and completes 2 genuine tasks.",
    },
  ];

  const steps = [
    {
      title: "Share your link",
      desc: "Send your unique invite link to friends via any app.",
    },
    {
      title: "Friend joins",
      desc: "They sign up on Earnzyro using your referral link.",
    },
    {
      title: "Both earn",
      desc: "You get rewarded instantly once they complete a task.",
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inviteNow = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Earnzyro",
          text: "Join Earnzyro and earn rewards daily using my referral link.",
          url: referralLink,
        })
        .catch(() => {});
    } else {
      handleCopy();
    }
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(
      `Join Earnzyro and earn rewards daily using my referral link: ${referralLink}`,
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const toggleFaq = (i) => {
    setOpenFaq(openFaq === i ? null : i);
  };

  return (
    <div
      className={`min-h-[100dvh] text-[#111827] font-[Poppins,sans-serif] bg-[#F2F5F3]`}
    >
      <style>{DESIGN_SYSTEM_CSS}</style>

      <div
        className="relative z-0"
        style={{ animation: "pageFadeIn 0.4s var(--ease-premium) both" }}
      >
        <div className="rf-shell relative z-10">
          {/* ===== Header ===== */}
          <div className="rf-header flex justify-between items-center gap-[10px]">
            <div className="flex items-center gap-2.5 min-w-0">
              <Link
                to="/home"
                aria-label="Back to Home"
                className="rf-focusable w-[36px] h-[36px] rounded-[11px] bg-[#FCFDFC] border border-[#e5e7eb] text-[#16a34a] flex items-center justify-center no-underline shrink-0 transition-[transform,border-color] duration-200 hover:border-[#22c55e]/60 active:scale-90"
              >
                <HomeIcon size={17} />
              </Link>
              <div className="min-w-0">
                <h1 className="rf-title font-extrabold bg-gradient-to-r from-[#16a34a] to-[#111827] bg-clip-text text-transparent m-0 tracking-tight truncate">
                  Invite &amp; Earn
                </h1>
                <p className="rf-chip text-[#6b7280] m-0 truncate">
                  Grow together, earn together.
                </p>
              </div>
            </div>
            <div className="rf-chip flex items-center gap-[5px] bg-[#dcfce7] border border-[#bbf7d0] px-[11px] py-[6px] rounded-full text-[#166534] font-bold whitespace-nowrap">
              <Coins size={11} /> {coins.toLocaleString()}
            </div>
          </div>

          {/* ===== Hero Card ===== */}
          <div
            className="rf-card rf-card-hi text-center mb-[16px]"
            style={{ animation: "cardIn 0.5s var(--ease-premium) both" }}
          >
            <div
              className="w-[64px] h-[64px] rounded-[18px] mx-auto mb-[14px] flex items-center justify-center shadow-[0_4px_20px_rgba(34,197,94,0.3)]"
              style={{
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                color: "#ffffff",
              }}
            >
              <Users size={30} />
            </div>

            <div className="rf-chip inline-flex items-center gap-[5px] bg-[#dcfce7] border border-[#bbf7d0] text-[#166534] px-[12px] py-[5px] rounded-full font-bold tracking-wide mb-[12px]">
              <Gift size={11} /> REFER &amp; EARN
            </div>

            <h2 className="rf-hero-title font-extrabold text-[#111827] m-0 mb-[4px]">
              Invite Friends &amp; Earn Rewards
            </h2>
            <p className="rf-hero-amt font-black text-[#16a34a] m-0 mb-[10px] leading-[1.1]">
              Get 200 Coins
            </p>

            <p className="rf-desc text-[#6b7280] max-w-[320px] mx-auto mb-[16px]">
              Reward unlocks after your friend completes 2 tasks and earns 500
              coins.
            </p>

            <div className="rf-tier">
              <div className="rf-chip flex items-center gap-[5px] bg-[#F6F9F6] border border-[#e5e7eb] px-[12px] py-[8px] rounded-xl font-bold text-[#111827]">
                <CheckCircle2 size={12} className="text-[#16a34a]" />
                You earn <span className="text-[#16a34a]">200 coins</span>
              </div>
              <div className="rf-chip flex items-center gap-[5px] bg-[#F6F9F6] border border-[#e5e7eb] px-[12px] py-[8px] rounded-xl font-bold text-[#111827]">
                <CheckCircle2 size={12} className="text-[#16a34a]" />
                Friend earns <span className="text-[#16a34a]">100 bonus</span>
              </div>
            </div>
          </div>

          {/* ===== Rules ===== */}
          <div
            className="rf-card mb-[16px]"
            style={{
              animation: "cardIn 0.5s var(--ease-premium) both",
              animationDelay: "0.05s",
            }}
          >
            <p className="rf-card-title font-extrabold m-0 mb-3 flex items-center gap-1.5 text-[#16a34a]">
              <Gift size={14} /> Referral Rules
            </p>
            <div className="flex flex-col gap-[9px]">
              {rules.map((r, i) => (
                <div
                  className="rf-desc flex items-start gap-2 text-[#374151] leading-[1.5]"
                  key={i}
                >
                  <CheckCircle2
                    size={13}
                    className="text-[#16a34a] shrink-0 mt-[2px]"
                  />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ===== Milestone ===== */}
          <div
            className="rf-card mb-[16px]"
            style={{
              animation: "cardIn 0.5s var(--ease-premium) both",
              animationDelay: "0.10s",
            }}
          >
            <div className="flex justify-between items-center mb-[10px]">
              <p className="rf-card-title font-extrabold m-0 flex items-center gap-1.5 text-[#111827]">
                <Flame size={14} className="text-[#d97706]" /> Next milestone
              </p>
              <span className="rf-btn-text text-[#16a34a] font-bold">
                {referralCount}/{nextMilestone}
              </span>
            </div>
            <div className="w-full h-[8px] rounded-md bg-[#f3f4f6] overflow-hidden">
              <div
                className="h-full rounded-md bg-gradient-to-r from-[#22c55e] to-[#16a34a] transition-[width] duration-500 relative overflow-hidden"
                style={{ width: `${progressPct}%` }}
              >
                <span
                  className="absolute inset-y-0 left-0 w-1/3 bg-white/40 blur-[2px]"
                  style={{ animation: "shimmer 2.2s ease-in-out infinite" }}
                />
              </div>
            </div>
            <p className="rf-chip text-[#6b7280] m-0 mt-2">
              Invite {nextMilestone - referralCount} more friends to unlock a ₹
              {milestoneBonus} bonus.
            </p>
          </div>

          {/* ===== Progress Checklist ===== */}
          <div
            className="rf-card mb-[16px]"
            style={{
              animation: "cardIn 0.5s var(--ease-premium) both",
              animationDelay: "0.15s",
            }}
          >
            <p className="rf-card-title font-extrabold m-0 mb-3 text-[#16a34a]">
              Referral Progress
            </p>
            {progressChecklist.map((item, i) => {
              const Icon =
                item.state === "done"
                  ? CheckCircle2
                  : item.state === "pending"
                    ? Hourglass
                    : Lock;
              const iconColor =
                item.state === "done"
                  ? "text-[#16a34a]"
                  : item.state === "pending"
                    ? "text-[#d97706]"
                    : "text-[#9ca3af]";
              const textColor =
                item.state === "done"
                  ? "text-[#374151]"
                  : item.state === "pending"
                    ? "text-[#6b7280]"
                    : "text-[#9ca3af]";
              return (
                <div
                  className={`rf-desc flex items-center justify-between py-2 border-b border-[#e5e7eb] last:border-b-0 font-semibold ${textColor}`}
                  key={i}
                >
                  <span>{item.label}</span>
                  <Icon size={14} className={iconColor} />
                </div>
              );
            })}
          </div>

          {/* ===== Stats Grid ===== */}
          <div className="rf-stats mb-[16px]">
            {statsData.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  className="rf-stat rf-card p-[14px] transition-all duration-200"
                  key={i}
                  style={{
                    animation: `cardIn 0.5s var(--ease-premium) both`,
                    animationDelay: `${0.2 + i * 0.04}s`,
                  }}
                >
                  <div className="w-[30px] h-[30px] rounded-[9px] bg-[#dcfce7] text-[#16a34a] flex items-center justify-center mb-2">
                    <Icon size={15} />
                  </div>
                  <p className="text-[19px] text-[#16a34a] font-extrabold m-0 mb-[2px]">
                    {s.value}
                  </p>
                  <p className="rf-chip text-[#6b7280] m-0">{s.label}</p>
                </div>
              );
            })}
          </div>

          {/* ===== Referral Link ===== */}
          <div
            className="rf-card mb-[16px]"
            style={{
              animation: "cardIn 0.5s var(--ease-premium) both",
              animationDelay: "0.35s",
            }}
          >
            <p className="rf-card-title font-extrabold m-0 mb-2.5 flex items-center gap-1.5 text-[#16a34a]">
              <Link2 size={14} /> Your referral link
            </p>
            <div className="rf-linkbox">{referralLink || "Loading…"}</div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleCopy}
                className="rf-btn-ghost rf-btn-text flex-1 min-w-[100px] py-[10px] rounded-full font-bold cursor-pointer font-[Poppins,sans-serif] flex items-center justify-center gap-[6px] bg-[#F6F9F6] border border-[#e5e7eb] text-[#16a34a] transition-all duration-150"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy link"}
              </button>
              <button
                onClick={shareOnWhatsApp}
                className="rf-btn-ghost rf-btn-text flex-1 min-w-[100px] py-[10px] rounded-full font-bold cursor-pointer font-[Poppins,sans-serif] flex items-center justify-center gap-[6px] bg-[#F6F9F6] border border-[#e5e7eb] text-[#16a34a] transition-all duration-150"
              >
                <MessageCircle size={14} /> WhatsApp
              </button>
              <button
                onClick={inviteNow}
                className="rf-btn-primary rf-btn-text flex-1 min-w-[100px] py-[10px] rounded-full font-bold cursor-pointer font-[Poppins,sans-serif] flex items-center justify-center gap-[6px] border-none bg-gradient-to-br from-[#22c55e] to-[#16a34a] text-white shadow-[0_6px_18px_rgba(34,197,94,0.28)] transition-transform duration-150"
              >
                <Share2 size={14} /> Share now
              </button>
            </div>
          </div>

          {/* ===== How it works ===== */}
          <div
            className="rf-card mb-[16px]"
            style={{
              animation: "cardIn 0.5s var(--ease-premium) both",
              animationDelay: "0.40s",
            }}
          >
            <p className="rf-card-title font-extrabold m-0 mb-3 flex items-center gap-1.5 text-[#16a34a]">
              <Sparkles size={14} /> How it works
            </p>
            {steps.map((s, i) => (
              <div key={i} className="flex gap-3 mb-[14px] last:mb-0">
                <div className="w-[26px] h-[26px] rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center text-[11px] font-extrabold shrink-0">
                  {i + 1}
                </div>
                <div>
                  <p className="rf-card-title font-bold m-0 mb-1 text-[#111827]">
                    {s.title}
                  </p>
                  <p className="rf-chip text-[#6b7280] m-0 leading-[1.5]">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ===== History ===== */}
          <div
            className="rf-card mb-[16px]"
            style={{
              animation: "cardIn 0.5s var(--ease-premium) both",
              animationDelay: "0.45s",
            }}
          >
            <p className="rf-card-title font-extrabold m-0 mb-3 text-[#16a34a]">
              Referral History
            </p>
            {history.length === 0 ? (
              <p className="rf-desc text-[#6b7280] m-0">
                No referrals yet — invite your first friend to start earning!
              </p>
            ) : (
              history.map((h, i) => (
                <div
                  key={i}
                  className="flex justify-between items-start gap-2.5 py-2.5 border-b border-[#e5e7eb] last:border-b-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="rf-card-title font-bold m-0 mb-1 text-[#111827]">
                      {h.name}
                    </p>
                    <p className="rf-chip text-[#6b7280] m-0 leading-[1.5]">
                      {h.detail}
                    </p>
                  </div>
                  <span
                    className={`rf-chip font-bold px-[9px] py-1 rounded-full whitespace-nowrap shrink-0 ${
                      h.state === "done"
                        ? "bg-[#dcfce7] border border-[#bbf7d0] text-[#166534]"
                        : "bg-[#fef3c7] border border-[#fcd34d] text-[#d97706]"
                    }`}
                  >
                    {h.status}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* ===== FAQ ===== */}
          <div
            className="rf-card mb-[16px]"
            style={{
              animation: "cardIn 0.5s var(--ease-premium) both",
              animationDelay: "0.50s",
            }}
          >
            <p className="rf-card-title font-extrabold m-0 mb-3 text-[#16a34a]">
              Frequently Asked Questions
            </p>
            {faqs.map((f, i) => (
              <div
                key={i}
                className="border-b border-[#e5e7eb] last:border-b-0"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full bg-transparent border-none text-[#111827] font-[Poppins,sans-serif] rf-card-title font-bold py-[11px] px-0 flex justify-between items-center cursor-pointer text-left gap-2"
                >
                  {f.q}
                  <ChevronDown
                    size={15}
                    className={`text-[#16a34a] shrink-0 transition-transform duration-200 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <p className="rf-chip text-[#6b7280] leading-[1.6] m-0 pb-3 pr-5 animate-[fadeIn_0.25s_ease]">
                    {f.a}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* ===== CTA ===== */}
          <div className="flex justify-center mb-[16px]">
            <button
              onClick={inviteNow}
              className="rf-btn-primary rf-btn-text w-full max-w-[360px] py-[14px] rounded-full font-extrabold font-[Poppins,sans-serif] cursor-pointer border-none flex items-center justify-center gap-2 bg-gradient-to-br from-[#22c55e] to-[#16a34a] text-white shadow-[0_6px_18px_rgba(34,197,94,0.3)] transition-transform duration-150"
            >
              <Share2 size={16} /> Invite now
            </button>
          </div>
        </div>
      </div>

      {/* ===== Bottom Nav ===== */}
      <div
        className="fixed bottom-[15px] left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[440px] bg-[#FCFDFC]/95 border border-[#e5e7eb] rounded-[22px] flex justify-around items-center shadow-[0_4px_20px_rgba(17,24,39,0.08)] h-[62px]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`rf-navlink rf-focusable no-underline text-center font-semibold rf-nav-label flex flex-col items-center justify-center gap-[3px] min-w-[48px] h-full rounded-xl transition-all duration-300 ${
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

export default Referral;

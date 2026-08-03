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
  Zap,
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
} from "lucide-react";

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
          console.log(referralData);
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
    {
      icon: Users,
      value: stats.totalReferrals,
      label: "Total Referrals",
    },
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
      desc: "They sign up on TaskLumo using your referral link.",
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
          title: "TaskLumo",
          text: "Join TaskLumo and earn rewards daily using my referral link.",
          url: referralLink,
        })
        .catch(() => {});
    } else {
      handleCopy();
    }
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(
      `Join TaskLumo and earn rewards daily using my referral link: ${referralLink}`,
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const toggleFaq = (i) => {
    setOpenFaq(openFaq === i ? null : i);
  };

  return (
    <div className="referral-wrapper">
      <style>{`
        * { box-sizing: border-box; }

        .referral-wrapper {
          min-height: 100vh;
          padding: 16px;
          padding-bottom: 105px;
          color: white;
          font-family: 'Poppins', sans-serif;
          background:
            radial-gradient(circle at bottom left, rgba(255,120,40,0.35), transparent 35%),
            radial-gradient(circle at top right, rgba(255,140,0,0.22), transparent 28%),
            linear-gradient(135deg, #050505 0%, #0a0a0a 40%, #120909 100%);
        }

        .top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          gap: 10px;
        }

        .page-title {
          font-size: 26px;
          font-weight: 800;
          background: linear-gradient(to right,#facc15,#fff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 4px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .page-sub {
          color: #a1a1aa;
          font-size: 11px;
          margin: 0;
        }

        .coin-badge {
          background: #111;
          border: 1px solid rgba(250,204,21,0.18);
          padding: 7px 12px;
          border-radius: 10px;
          color: #facc15;
          font-weight: 700;
          font-size: 11px;
          display: flex;
          align-items: center;
          gap: 5px;
          flex-shrink: 0;
        }

        @keyframes cardIn {
          from { opacity:0; transform:translateY(10px); }
          to { opacity:1; transform:translateY(0); }
        }

        .hero-card {
          background: rgba(17,17,17,0.90);
          border: 1px solid rgba(250,204,21,0.10);
          border-radius: 22px;
          padding: 22px 20px;
          margin-bottom: 14px;
          backdrop-filter: blur(18px);
          box-shadow: 0 0 30px rgba(250,204,21,0.05);
          animation: cardIn 0.4s ease both;
          position: relative;
          overflow: hidden;
          text-align: center;
        }

        .hero-card::after {
          content: "";
          position: absolute;
          top: -50px;
          right: -50px;
          width: 180px;
          height: 180px;
          background: radial-gradient(circle, rgba(250,204,21,0.14), transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        .hero-icon {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          background: linear-gradient(135deg,#facc15,#eab308);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 14px;
          box-shadow: 0 0 26px rgba(250,204,21,0.3);
          color: #000;
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(250,204,21,0.10);
          color: #facc15;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.4px;
          margin-bottom: 12px;
        }

        .hero-title {
          font-size: 22px;
          margin: 0 0 2px;
          font-weight: 800;
          color: white;
        }

        .hero-amount {
          font-size: 30px;
          margin: 2px 0 10px;
          color: #facc15;
          font-weight: 900;
          line-height: 1.1;
        }

        .hero-desc {
          color: #a1a1aa;
          font-size: 11px;
          line-height: 18px;
          margin: 0 auto 16px;
          max-width: 320px;
          position: relative;
          z-index: 1;
        }

        .tier-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
          position: relative;
          z-index: 1;
        }

        .tier-chip {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 8px 12px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .tier-chip .amt { color: #facc15; }

        .rules-card {
          background: rgba(17,17,17,0.88);
          border: 1px solid rgba(250,204,21,0.10);
          border-radius: 18px;
          padding: 16px 18px;
          margin-bottom: 14px;
          backdrop-filter: blur(18px);
          animation: cardIn 0.4s ease both;
        }

        .rules-title {
          font-size: 12px;
          font-weight: 700;
          margin: 0 0 12px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .rules-list {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .rule-row {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 11px;
          color: #d4d4d8;
          line-height: 16px;
        }

        .rule-row svg { flex-shrink: 0; margin-top: 1px; }

        .milestone-card {
          background: rgba(17,17,17,0.88);
          border: 1px solid rgba(250,204,21,0.10);
          border-radius: 18px;
          padding: 16px 18px;
          margin-bottom: 14px;
          backdrop-filter: blur(18px);
          animation: cardIn 0.4s ease both;
        }

        .milestone-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .milestone-label {
          font-size: 12px;
          font-weight: 700;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .milestone-count {
          font-size: 12px;
          color: #facc15;
          font-weight: 700;
        }

        .progress-track {
          width: 100%;
          height: 8px;
          border-radius: 6px;
          background: rgba(255,255,255,0.06);
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 6px;
          background: linear-gradient(90deg,#facc15,#eab308);
          transition: width 0.5s ease;
        }

        .milestone-hint {
          color: #a1a1aa;
          font-size: 10px;
          margin: 8px 0 0;
        }

        .checklist-card {
          background: rgba(17,17,17,0.88);
          border: 1px solid rgba(250,204,21,0.10);
          border-radius: 18px;
          padding: 16px 18px;
          margin-bottom: 14px;
          backdrop-filter: blur(18px);
          animation: cardIn 0.4s ease both;
        }

        .checklist-title {
          font-size: 12px;
          font-weight: 700;
          margin: 0 0 12px;
        }

        .checklist-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          font-size: 11px;
          font-weight: 600;
        }

        .checklist-row:last-child { border-bottom: none; }

        .checklist-row.done { color: #d4d4d8; }
        .checklist-row.pending { color: #a1a1aa; }
        .checklist-row.locked { color: #71717a; }

        .checklist-icon.done { color: #22c55e; }
        .checklist-icon.pending { color: #facc15; }
        .checklist-icon.locked { color: #71717a; }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 14px;
        }

        .stat-card {
          background: rgba(17,17,17,0.88);
          border: 1px solid rgba(250,204,21,0.10);
          border-radius: 16px;
          padding: 14px;
          backdrop-filter: blur(18px);
          animation: cardIn 0.4s ease both;
        }

        .stat-icon {
          width: 30px;
          height: 30px;
          border-radius: 9px;
          background: rgba(250,204,21,0.1);
          color: #facc15;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 19px;
          color: #facc15;
          font-weight: 800;
          margin: 0 0 2px;
        }

        .stat-label {
          font-size: 10px;
          color: #a1a1aa;
          margin: 0;
        }

        .link-card {
          background: rgba(17,17,17,0.88);
          border: 1px solid rgba(250,204,21,0.10);
          border-radius: 18px;
          padding: 16px 18px;
          margin-bottom: 14px;
          backdrop-filter: blur(18px);
          animation: cardIn 0.4s ease both;
        }

        .link-title {
          font-size: 12px;
          font-weight: 700;
          margin: 0 0 10px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .link-box {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 11px 12px;
          color: #facc15;
          font-size: 10px;
          word-break: break-all;
          margin-bottom: 10px;
        }

        .link-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .link-btn {
          flex: 1;
          min-width: 100px;
          border: none;
          padding: 10px;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          font-size: 11px;
          font-family: 'Poppins', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: transform 0.15s ease;
        }

        .link-btn:hover { transform: translateY(-1px); }

        .link-btn.copy {
          background: rgba(250,204,21,0.10);
          border: 1px solid rgba(250,204,21,0.2);
          color: #facc15;
        }

        .link-btn.share {
          background: linear-gradient(135deg,#22c55e,#16a34a);
          color: white;
          box-shadow: 0 0 16px rgba(34,197,94,0.25);
        }

        .link-btn.whatsapp {
          background: rgba(37,211,102,0.12);
          border: 1px solid rgba(37,211,102,0.3);
          color: #25d366;
        }

        .steps-card {
          background: rgba(17,17,17,0.88);
          border: 1px solid rgba(250,204,21,0.10);
          border-radius: 18px;
          padding: 16px 18px;
          margin-bottom: 14px;
          backdrop-filter: blur(18px);
          animation: cardIn 0.4s ease both;
        }

        .steps-title {
          font-size: 12px;
          font-weight: 700;
          margin: 0 0 14px;
        }

        .step-row {
          display: flex;
          gap: 12px;
          margin-bottom: 14px;
        }

        .step-row:last-child { margin-bottom: 0; }

        .step-num {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: rgba(250,204,21,0.1);
          color: #facc15;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
          flex-shrink: 0;
        }

        .step-title {
          font-size: 12px;
          font-weight: 700;
          margin: 0 0 3px;
        }

        .step-desc {
          font-size: 10px;
          color: #a1a1aa;
          margin: 0;
          line-height: 16px;
        }

        .history-card {
          background: rgba(17,17,17,0.88);
          border: 1px solid rgba(250,204,21,0.10);
          border-radius: 18px;
          padding: 16px 18px;
          margin-bottom: 14px;
          backdrop-filter: blur(18px);
          animation: cardIn 0.4s ease both;
        }

        .history-title {
          font-size: 12px;
          font-weight: 700;
          margin: 0 0 12px;
        }

        .history-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .history-row:last-child { border-bottom: none; padding-bottom: 0; }

        .history-name {
          font-size: 12px;
          font-weight: 700;
          margin: 0 0 3px;
        }

        .history-detail {
          font-size: 10px;
          color: #a1a1aa;
          margin: 0;
          line-height: 15px;
        }

        .history-badge {
          font-size: 9px;
          font-weight: 700;
          padding: 4px 9px;
          border-radius: 999px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .history-badge.done {
          background: rgba(34,197,94,0.12);
          color: #22c55e;
          border: 1px solid rgba(34,197,94,0.25);
        }

        .history-badge.pending {
          background: rgba(250,204,21,0.10);
          color: #facc15;
          border: 1px solid rgba(250,204,21,0.2);
        }

        .faq-card {
          background: rgba(17,17,17,0.88);
          border: 1px solid rgba(250,204,21,0.10);
          border-radius: 18px;
          padding: 16px 18px;
          margin-bottom: 14px;
          backdrop-filter: blur(18px);
          animation: cardIn 0.4s ease both;
        }

        .faq-title {
          font-size: 12px;
          font-weight: 700;
          margin: 0 0 12px;
        }

        .faq-item {
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .faq-item:last-child { border-bottom: none; }

        .faq-question {
          width: 100%;
          background: none;
          border: none;
          color: white;
          font-family: 'Poppins', sans-serif;
          font-size: 11px;
          font-weight: 700;
          padding: 11px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          text-align: left;
          gap: 8px;
        }

        .faq-chevron {
          transition: transform 0.2s ease;
          flex-shrink: 0;
          color: #facc15;
        }

        .faq-chevron.open { transform: rotate(180deg); }

        .faq-answer {
          font-size: 10px;
          color: #a1a1aa;
          line-height: 16px;
          margin: 0 0 12px;
          padding-right: 20px;
        }

        .cta-wrap {
          display: flex;
          justify-content: center;
        }

        .cta-btn {
          background: linear-gradient(135deg,#22c55e,#16a34a);
          border: none;
          padding: 14px 40px;
          border-radius: 16px;
          color: white;
          font-weight: 800;
          font-size: 13px;
          cursor: pointer;
          box-shadow: 0 0 22px rgba(34,197,94,0.3);
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Poppins', sans-serif;
          transition: transform 0.15s ease;
          width: 100%;
          justify-content: center;
          max-width: 360px;
        }

        .cta-btn:hover { transform: translateY(-1px); }

        .bottom-nav {
          position: fixed;
          bottom: 15px;
          left: 50%;
          transform: translateX(-50%);
          width: 95%;
          max-width: 440px;
          height: 64px;
          background: rgba(17,17,17,0.9);
          border: 1px solid rgba(250,204,21,0.12);
          border-radius: 22px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          backdrop-filter: blur(18px);
          box-shadow: 0 0 25px rgba(0,0,0,0.35);
          padding: 0 4px;
        }

        .nav-item {
          color: #a1a1aa;
          text-decoration: none;
          text-align: center;
          font-weight: 600;
          font-size: 9px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          transition: color 0.2s ease, transform 0.2s ease;
          flex: 1;
        }

        .nav-item.active {
          color: #facc15;
          transform: translateY(-2px);
        }

        @media (min-width: 640px) {
          .referral-wrapper { padding: 20px; }
          .page-title { font-size: 34px; }
          .stats-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          .hero-amount { font-size: 36px; }
          .hero-title { font-size: 26px; }
          .nav-item { font-size: 11px; }
        }

        @media (max-width: 359px) {
          .hero-amount { font-size: 24px; }
          .hero-title { font-size: 19px; }
          .coin-badge { font-size: 10px; padding: 5px 8px; }
          .cta-btn { font-size: 12px; padding: 12px 24px; }
        }
      `}</style>

      <div className="top-bar">
        <div>
          <h1 className="page-title">
            <Gift size={24} color="#facc15" /> Invite & Earn
          </h1>
          <p className="page-sub">Grow together, earn together.</p>
        </div>

        <div className="coin-badge">
          <TrendingUp size={13} /> ₹850 earned
        </div>
      </div>

      <div className="hero-card">
        <div className="hero-icon">
          <Users size={30} />
        </div>

        <div className="hero-eyebrow">
          <Gift size={11} /> REFER & EARN
        </div>

        <h2 className="hero-title">Invite Friends & Earn Rewards</h2>
        <p className="hero-amount">Get 200 Coins</p>

        <p className="hero-desc">
          Reward unlocks after your friend completes 2 tasks and earns 500
          coins.
        </p>

        <div className="tier-row">
          <div className="tier-chip">
            <CheckCircle2 size={12} color="#facc15" />
            You earn <span className="amt">200 coins</span>
          </div>
          <div className="tier-chip">
            <CheckCircle2 size={12} color="#facc15" />
            Friend earns <span className="amt">100 bonus</span>
          </div>
        </div>
      </div>

      <div className="rules-card">
        <p className="rules-title">
          <Gift size={14} color="#facc15" /> Referral Rules
        </p>
        <div className="rules-list">
          {rules.map((r, i) => (
            <div className="rule-row" key={i}>
              <CheckCircle2 size={13} color="#22c55e" />
              <span>{r}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="milestone-card">
        <div className="milestone-top">
          <p className="milestone-label">
            <Flame size={14} color="#facc15" /> Next milestone
          </p>
          <span className="milestone-count">
            {referralCount}/{nextMilestone}
          </span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <p className="milestone-hint">
          Invite {nextMilestone - referralCount} more friends to unlock a ₹
          {milestoneBonus} bonus.
        </p>
      </div>

      <div className="checklist-card">
        <p className="checklist-title">Referral Progress</p>
        {progressChecklist.map((item, i) => {
          const Icon =
            item.state === "done"
              ? CheckCircle2
              : item.state === "pending"
                ? Hourglass
                : Lock;
          return (
            <div className={`checklist-row ${item.state}`} key={i}>
              <span>{item.label}</span>
              <Icon size={14} className={`checklist-icon ${item.state}`} />
            </div>
          );
        })}
      </div>

      <div className="stats-grid">
        {statsData.map((s, i) => {
          const Icon = s.icon;
          return (
            <div className="stat-card" key={i}>
              <div className="stat-icon">
                <Icon size={15} />
              </div>
              <p className="stat-value">{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="link-card">
        <p className="link-title">
          <Link2 size={14} color="#facc15" /> Your referral link
        </p>
        <div className="link-box">{referralLink}</div>
        <div className="link-actions">
          <button className="link-btn copy" onClick={handleCopy}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy link"}
          </button>
          <button className="link-btn whatsapp" onClick={shareOnWhatsApp}>
            <MessageCircle size={14} /> WhatsApp
          </button>
          <button className="link-btn share" onClick={inviteNow}>
            <Share2 size={14} /> Share now
          </button>
        </div>
      </div>

      <div className="steps-card">
        <p className="steps-title">How it works</p>
        {steps.map((s, i) => (
          <div className="step-row" key={i}>
            <div className="step-num">{i + 1}</div>
            <div>
              <p className="step-title">{s.title}</p>
              <p className="step-desc">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="history-card">
        <p className="history-title">Referral History</p>
        {history.map((h, i) => (
          <div className="history-row" key={i}>
            <div>
              <p className="history-name">{h.name}</p>
              <p className="history-detail">{h.detail}</p>
            </div>
            <span className={`history-badge ${h.state}`}>{h.status}</span>
          </div>
        ))}
      </div>

      <div className="faq-card">
        <p className="faq-title">Frequently Asked Questions</p>
        {faqs.map((f, i) => (
          <div className="faq-item" key={i}>
            <button className="faq-question" onClick={() => toggleFaq(i)}>
              {f.q}
              <ChevronDown
                size={15}
                className={`faq-chevron ${openFaq === i ? "open" : ""}`}
              />
            </button>
            {openFaq === i && <p className="faq-answer">{f.a}</p>}
          </div>
        ))}
      </div>

      <div className="cta-wrap">
        <button className="cta-btn" onClick={inviteNow}>
          <Share2 size={16} /> Invite now
        </button>
      </div>

      <div className="bottom-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-item ${location.pathname === item.to ? "active" : ""}`}
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

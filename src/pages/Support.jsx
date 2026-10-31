import { Link } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft,
  Zap,
  Wallet,
  Shield,
  Radio,
  Mail,
  Copy,
  Check,
  ChevronDown,
  HelpCircle,
  CircleCheck,
  Send,
  RotateCcw,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import logo from "/logo.jpg.jpeg";

const ISSUE_LIST = [
  "Payment Problem",
  "Withdrawal Pending",
  "Task Not Credited",
  "Account Issue",
  "Technical Bug",
  "Referral Problem",
  "Login Problem",
  "Other",
];

const PRIORITIES = [
  { key: "low", label: "Low" },
  { key: "medium", label: "Medium" },
  { key: "high", label: "High" },
];

const FAQS = [
  {
    q: "How long does a withdrawal take?",
    a: "Withdrawals are usually credited within 24 to 48 hours. If it's been longer than that, please raise a ticket below with your UID.",
  },
  {
    q: "Why wasn't my task credited?",
    a: "Task rewards can take a few minutes to reflect after our ad partner confirms completion. If it's been over an hour, submit a ticket with the task name and your UID.",
  },
  {
    q: "How does the referral bonus work?",
    a: "You earn a bonus once your invited friend completes their first task. If they've done that and you still don't see it, share their referral code with us.",
  },
  {
    q: "What's the minimum withdrawal amount?",
    a: "The minimum withdrawal amount is ₹100. Once your wallet balance crosses that, the withdraw option unlocks automatically.",
  },
  {
    q: "Is Earnzyro free to use?",
    a: "Yes, completely free. There are no hidden charges — you simply complete tasks to earn coins and withdraw once you hit the minimum threshold.",
  },
];

const DESIGN_SYSTEM_CSS = `
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
    --bg: #F2F5F3;           /* page milky white */
    --surface: #FCFDFC;      /* card milk-white surface */
    --surface-soft: #F6F9F6; /* inner soft panels */
    --ease-premium: cubic-bezier(0.16, 1, 0.3, 1);
  }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes cardIn { from { opacity: 0; transform: translateY(14px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
  @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(220%); } }
  @keyframes pageFadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes tickerDot { 0%, 100% { opacity: 0.5; transform: scale(0.85); } 50% { opacity: 1; transform: scale(1); } }
  @media (prefers-reduced-motion: reduce) {
    * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
  }

  .sup-shell {
    max-width: 1180px;
    margin: 0 auto;
    padding-left: clamp(16px, 4vw, 40px);
    padding-right: clamp(16px, 4vw, 40px);
    padding-bottom: clamp(80px, 10vh, 100px);
    padding-top: 0;
  }

  .sup-header {
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

  .sup-grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: clamp(8px, 1.4vw, 12px);
  }
  @media (min-width: 640px) {
    .sup-grid-2 { grid-template-columns: repeat(4, 1fr); }
  }

  .sup-form-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
  }
  @media (min-width: 640px) {
    .sup-form-grid { grid-template-columns: repeat(2, 1fr); }
    .sup-form-grid .sup-span-2 { grid-column: span 2; }
  }

  /* Milk-white cards (same feel as Home.jsx but softly blended) */
  .sup-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: clamp(14px, 1.8vw, 20px);
    box-shadow: 0 1px 3px rgba(17, 24, 39, 0.04);
    transition: transform 0.35s var(--ease-premium), box-shadow 0.35s var(--ease-premium), border-color 0.35s var(--ease-premium);
  }
  .sup-card-hi { border-color: #86efac; }

  @media (hover: hover) {
    .sup-card:hover {
      box-shadow: 0 10px 28px rgba(34, 197, 94, 0.10);
      border-color: rgba(34, 197, 94, 0.35);
    }
    .sup-btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(34, 197, 94, 0.32);
    }
    .sup-btn-ghost:hover:not(:disabled) {
      border-color: rgba(34, 197, 94, 0.45);
      color: var(--brand);
    }
    .sup-tile:hover { border-color: rgba(34, 197, 94, 0.45); transform: translateY(-2px); }
  }

  .sup-btn-primary:active:not(:disabled),
  .sup-btn-ghost:active:not(:disabled) { transform: scale(0.94); }
  .sup-focusable:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }

  .sup-input {
    background: #ffffff;
    border: 1px solid var(--border);
    color: var(--ink);
    transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
  }
  .sup-input:focus {
    border-color: rgba(34, 197, 94, 0.55) !important;
    background: #ffffff !important;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12);
  }

  .sup-title      { font-size: clamp(20px, 1.2vw + 16px, 28px); }
  .sup-hero-title { font-size: clamp(22px, 2vw + 12px, 34px); }
  .sup-hero-desc  { font-size: clamp(11px, 0.4vw + 9.5px, 13px); line-height: 1.55; }
  .sup-card-title { font-size: clamp(13px, 0.4vw + 10.5px, 15px); }
  .sup-card-desc  { font-size: clamp(10.5px, 0.3vw + 9px, 12px); line-height: 1.5; }
  .sup-btn-text   { font-size: clamp(11px, 0.3vw + 9.5px, 12.5px); }
  .sup-label      { font-size: clamp(9.5px, 0.25vw + 8.5px, 10.5px); letter-spacing: 0.5px; text-transform: uppercase; font-weight: 700; color: #6b7280; margin-bottom: 6px; display: block; }
  .sup-chip       { font-size: clamp(9.5px, 0.3vw + 8.5px, 11px); }
`;

function Support() {
  const [issueType, setIssueType] = useState("Select Issue Type");
  const [priority, setPriority] = useState("medium");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");
  const [message, setMessage] = useState("");
  const [emailCopied, setEmailCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [requests, setRequests] = useState([]);
  const [showRequests, setShowRequests] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const MAX_CHARS = 500;
  const supportEmail = "tasklumosupport@gmail.com";
  const FONT = "font-[Poppins,sans-serif]";

  const copyEmail = () => {
    navigator.clipboard.writeText(supportEmail).then(() => {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    });
  };

  const resetForm = () => {
    setSubmitted(false);
    setIssueType("Select Issue Type");
    setPriority("medium");
    setName("");
    setEmail("");
    setUid("");
    setMessage("");
    setError("");
  };

  const handleSubmit = async () => {
    if (issueType === "Select Issue Type") {
      setError("Please select an issue type.");
      return;
    }
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in your name, email, and issue description.");
      return;
    }

    setError("");

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://tasklumo-backend.vercel.app/api/support/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            email,
            uid,
            issueType,
            priority,
            message,
          }),
        },
      );

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Something went wrong. Please try again.");
        return;
      }

      setTicketId(
        data.ticket?.id || `TL-${Math.floor(100000 + Math.random() * 900000)}`,
      );
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const loadMyRequests = async () => {
    if (showRequests) {
      setShowRequests(false);
      return;
    }

    try {
      setLoadingRequests(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://tasklumo-backend.vercel.app/api/support/my-tickets",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (data.success) {
        setRequests(data.tickets);
        setShowRequests(true);
      } else {
        setError(data.message || "Could not load your requests");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while loading your requests");
    } finally {
      setLoadingRequests(false);
    }
  };

  return (
    <div className={`min-h-[100dvh] text-[#111827] ${FONT} bg-[#F2F5F3]`}>
      <style>{DESIGN_SYSTEM_CSS}</style>

      <div
        className="relative z-0"
        style={{ animation: "pageFadeIn 0.4s var(--ease-premium) both" }}
      >
        <div className="sup-shell relative z-10">
          {/* ===== Header ===== */}
          <div className="sup-header flex justify-between items-center gap-[10px]">
            <div className="flex items-center gap-2.5 min-w-0">
              <Link
                to="/home"
                aria-label="Back to Home"
                className="sup-focusable w-[36px] h-[36px] rounded-[11px] bg-[#FCFDFC] border border-[#e5e7eb] text-[#16a34a] flex items-center justify-center no-underline shrink-0 transition-[transform,border-color] duration-200 hover:border-[#22c55e]/60 active:scale-90"
              >
                <ArrowLeft size={17} />
              </Link>
              <h1 className="sup-title font-extrabold bg-gradient-to-r from-[#16a34a] to-[#111827] bg-clip-text text-transparent m-0 tracking-tight truncate">
                Support
              </h1>
            </div>
            <div className="sup-chip flex items-center gap-[5px] bg-[#dcfce7] border border-[#bbf7d0] px-[11px] py-[6px] rounded-full text-[#166534] font-bold whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-[tickerDot_1.6s_ease-in-out_infinite]" />
              24/7 Active
            </div>
          </div>

          {/* ===== Hero Card ===== */}
          <div
            className="sup-card sup-card-hi mb-[16px]"
            style={{ animation: "cardIn 0.5s var(--ease-premium) both" }}
          >
            <div className="text-center mb-[18px]">
              <div
                className="w-[78px] h-[78px] rounded-full mx-auto p-[3px] flex items-center justify-center shadow-[0_4px_20px_rgba(34,197,94,0.25)]"
                style={{
                  background:
                    "conic-gradient(from 0deg, #22c55e, #16a34a, #22c55e)",
                }}
              >
                <img
                  src={logo}
                  alt="Earnzyro Logo"
                  className="w-full h-full rounded-full object-cover border-[3px] border-[#FCFDFC]"
                />
              </div>
              <div className="sup-chip inline-flex items-center gap-1 mt-[10px] font-bold text-[#16a34a] bg-[#dcfce7] border border-[#bbf7d0] px-[10px] py-1 rounded-full">
                <CircleCheck size={11} /> Verified Support Team
              </div>
            </div>

            <p className="sup-card-desc font-semibold text-[#16a34a] mb-[6px] flex items-center gap-1.5 tracking-wide">
              <Sparkles size={12} /> WE'RE HERE TO HELP
            </p>
            <h2 className="sup-hero-title font-extrabold leading-[1.15] m-0 mb-[10px] tracking-[-0.3px] text-[#111827]">
              Customer
              <br />
              Support
            </h2>
            <p className="sup-hero-desc text-[#6b7280] m-0 mb-[16px] max-w-[680px]">
              At Earnzyro, we're committed to providing fast and reliable
              support. If you're facing any issues related to tasks, earnings,
              withdrawals, referrals, or account access, submit your request
              below and our team will get back to you.
            </p>

            {/* Feature tiles */}
            <div className="sup-grid-2">
              {[
                { icon: Zap, text: "Fast response" },
                { icon: Wallet, text: "Withdrawal help" },
                { icon: Shield, text: "Secure support" },
                { icon: Radio, text: "Live assistance" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="sup-tile bg-[#F6F9F6] border border-[#e5e7eb] rounded-xl px-2 py-[12px] text-center transition-all duration-200 active:scale-[0.97]"
                  >
                    <div className="w-7 h-7 rounded-[9px] bg-[#dcfce7] text-[#16a34a] flex items-center justify-center mx-auto mb-[6px]">
                      <Icon size={15} />
                    </div>
                    <p className="sup-card-desc font-semibold m-0 text-[#374151]">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ===== Contact Info ===== */}
          <div
            className="sup-card mb-[16px]"
            style={{
              animation: "cardIn 0.5s var(--ease-premium) both",
              animationDelay: "0.06s",
            }}
          >
            <h2 className="sup-card-title font-extrabold m-0 mb-3 flex items-center gap-[7px] text-[#16a34a]">
              <Mail size={16} /> Contact information
            </h2>
            <div className="flex items-center justify-between gap-2 mb-[10px] flex-wrap">
              <span className="sup-card-desc font-bold text-[#16a34a] break-all">
                {supportEmail}
              </span>
              <button
                onClick={copyEmail}
                className={`sup-btn-ghost sup-btn-text shrink-0 flex items-center gap-1 bg-[#dcfce7] border border-[#bbf7d0] text-[#16a34a] font-bold px-[10px] py-[6px] rounded-lg cursor-pointer transition-all duration-150 active:scale-90 ${FONT}`}
              >
                {emailCopied ? <Check size={12} /> : <Copy size={12} />}
                {emailCopied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="sup-card-desc text-[#6b7280] m-0">
              Support hours:{" "}
              <span className="text-[#16a34a] font-bold">24/7</span>
            </p>
            <p className="sup-card-desc text-[#6b7280] m-0">
              Response time:{" "}
              <span className="text-[#16a34a] font-bold">
                Within 24-48 hours
              </span>
            </p>
          </div>

          {/* ===== FAQ ===== */}
          <div
            className="sup-card mb-[16px]"
            style={{
              animation: "cardIn 0.5s var(--ease-premium) both",
              animationDelay: "0.12s",
            }}
          >
            <h2 className="sup-card-title font-extrabold m-0 mb-3 flex items-center gap-[7px] text-[#16a34a]">
              <HelpCircle size={16} /> Frequently asked questions
            </h2>
            {FAQS.map((f, i) => (
              <div
                className="border-b border-[#e5e7eb] last:border-b-0"
                key={i}
              >
                <button
                  className={`w-full bg-transparent border-none text-[#111827] ${FONT} sup-card-title font-bold py-3 px-0.5 flex items-center justify-between gap-2 cursor-pointer text-left`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
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
                  <p className="sup-card-desc text-[#6b7280] px-0.5 pb-3 m-0">
                    {f.a}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* ===== Form ===== */}
          <div
            className="sup-card mb-[16px]"
            style={{
              animation: "cardIn 0.5s var(--ease-premium) both",
              animationDelay: "0.18s",
            }}
          >
            {submitted ? (
              <div className="text-center pt-[30px] px-3 pb-[10px] animate-[fadeIn_0.4s_ease_both]">
                <div className="w-[60px] h-[60px] rounded-full bg-[#dcfce7] border border-[#bbf7d0] text-[#16a34a] flex items-center justify-center mx-auto mb-4">
                  <CircleCheck size={30} />
                </div>
                <h3 className="sup-card-title font-extrabold m-0 mb-2 text-[#111827]">
                  Request submitted!
                </h3>
                <p className="sup-card-desc text-[#6b7280] leading-[19px] max-w-[320px] mx-auto mb-4">
                  Thanks, {name || "there"} — our team has received your request
                  and will follow up at {email || "your email"} within 24-48
                  hours.
                </p>
                <div className="sup-card-desc inline-block bg-[#fef3c7] border border-[#fcd34d] text-[#d97706] font-extrabold tracking-[1px] px-[18px] py-2 rounded-[10px] mb-5">
                  {ticketId}
                </div>
                <div className="flex gap-[10px] flex-wrap">
                  <button
                    onClick={resetForm}
                    className={`sup-btn-ghost sup-btn-text flex-1 py-[13px] rounded-full font-extrabold cursor-pointer ${FONT} flex items-center justify-center gap-[6px] bg-[#F6F9F6] border border-[#e5e7eb] text-[#16a34a] transition-transform duration-150 active:scale-[0.97]`}
                  >
                    <RotateCcw size={14} /> Submit another
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="sup-card-title font-extrabold m-0 mb-3 text-[#16a34a]">
                  Select your issue
                </h2>

                <div className="sup-form-grid">
                  <div>
                    <label className="sup-label">Issue type</label>
                    <select
                      className={`sup-input sup-btn-text w-full px-[14px] py-[13px] rounded-xl outline-none ${FONT}`}
                      value={issueType}
                      onChange={(e) => setIssueType(e.target.value)}
                    >
                      <option>Select Issue Type</option>
                      {ISSUE_LIST.map((item, index) => (
                        <option key={index}>{item}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="sup-label">Priority</label>
                    <div className="flex gap-2">
                      {PRIORITIES.map((p) => (
                        <div
                          key={p.key}
                          className={`sup-btn-text flex-1 text-center py-[11px] rounded-xl font-bold cursor-pointer border transition-all duration-150 ${FONT} ${
                            priority === p.key
                              ? "border-[#86efac] bg-[#dcfce7] text-[#16a34a]"
                              : "border-[#e5e7eb] bg-[#F6F9F6] text-[#6b7280]"
                          }`}
                          onClick={() => setPriority(p.key)}
                        >
                          {p.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="sup-label">Your name</label>
                    <input
                      className={`sup-input sup-btn-text w-full px-[14px] py-[13px] rounded-xl outline-none ${FONT} placeholder:text-[#9ca3af]`}
                      type="text"
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="sup-label">Your email</label>
                    <input
                      className={`sup-input sup-btn-text w-full px-[14px] py-[13px] rounded-xl outline-none ${FONT} placeholder:text-[#9ca3af]`}
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="sup-span-2">
                    <label className="sup-label">Your UID (optional)</label>
                    <input
                      className={`sup-input sup-btn-text w-full px-[14px] py-[13px] rounded-xl outline-none ${FONT} placeholder:text-[#9ca3af]`}
                      type="text"
                      placeholder="User ID"
                      value={uid}
                      onChange={(e) => setUid(e.target.value)}
                    />
                  </div>

                  <div className="sup-span-2">
                    <label className="sup-label">Describe your issue</label>
                    <textarea
                      className={`sup-input sup-btn-text w-full px-[14px] py-[13px] rounded-xl outline-none ${FONT} resize-none leading-5 placeholder:text-[#9ca3af]`}
                      placeholder="Tell us what's going on in as much detail as possible..."
                      rows="5"
                      maxLength={MAX_CHARS}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <div className="text-right text-[9.5px] text-[#9ca3af] mt-1">
                      {message.length}/{MAX_CHARS}
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="sup-card-desc flex items-center gap-2 bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c] px-3 py-2 rounded-xl mb-3 mt-3">
                    <AlertCircle size={13} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex gap-[10px] flex-wrap mt-2">
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className={`sup-btn-primary sup-btn-text flex-1 min-w-[160px] py-[13px] rounded-full font-extrabold cursor-pointer ${FONT} border-none flex items-center justify-center gap-[6px] bg-gradient-to-br from-[#22c55e] to-[#16a34a] text-white shadow-[0_6px_18px_rgba(34,197,94,0.28)] transition-transform duration-150 disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    <Send size={14} />{" "}
                    {submitting ? "Submitting..." : "Submit request"}
                  </button>
                  <button
                    onClick={loadMyRequests}
                    disabled={loadingRequests}
                    className={`sup-btn-ghost sup-btn-text flex-1 min-w-[160px] py-[13px] rounded-full font-extrabold cursor-pointer ${FONT} flex items-center justify-center gap-[6px] bg-[#F6F9F6] border border-[#e5e7eb] text-[#16a34a] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    {loadingRequests
                      ? "Loading..."
                      : showRequests
                        ? "Hide requests"
                        : "My requests"}
                  </button>
                </div>

                {showRequests && (
                  <div className="mt-4">
                    {requests.length === 0 ? (
                      <p className="sup-card-desc text-[#6b7280]">
                        No tickets found.
                      </p>
                    ) : (
                      requests.map((ticket) => (
                        <div
                          key={ticket.id}
                          className="bg-[#F6F9F6] border border-[#e5e7eb] rounded-xl p-3 mb-[10px]"
                        >
                          <h3 className="sup-card-desc font-extrabold m-0 mb-1 text-[#16a34a]">
                            {ticket.issueType}
                          </h3>
                          <p className="sup-card-desc text-[#374151] leading-[18px] m-0 mb-2">
                            {ticket.message}
                          </p>
                          <p className="sup-card-desc text-[#6b7280] m-0 mb-1">
                            Status:{" "}
                            <span className="text-[#16a34a] font-bold">
                              {ticket.status}
                            </span>
                          </p>
                          <p className="sup-card-desc text-[#6b7280] m-0">
                            Reply: {ticket.adminReply || "Waiting for reply..."}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* ===== Important Notice ===== */}
          <div
            className="sup-card mb-[16px]"
            style={{
              animation: "cardIn 0.5s var(--ease-premium) both",
              animationDelay: "0.24s",
            }}
          >
            <h2 className="sup-card-title font-extrabold m-0 mb-3 flex items-center gap-[7px] text-[#16a34a]">
              <AlertCircle size={16} /> Important notice
            </h2>
            <p className="sup-card-desc text-[#6b7280] m-0 leading-[1.6]">
              Submit only one request per issue to avoid delays. Ensure all
              information provided is accurate — fake or spam requests may lead
              to account suspension. Payments and rewards depend on verification
              from our advertising partners.
            </p>
          </div>

          {/* ===== Support Guidelines ===== */}
          <div
            className="sup-card mb-0"
            style={{
              animation: "cardIn 0.5s var(--ease-premium) both",
              animationDelay: "0.30s",
            }}
          >
            <h2 className="sup-card-title font-extrabold m-0 mb-3 flex items-center gap-[7px] text-[#16a34a]">
              <Shield size={16} /> Support guidelines
            </h2>
            <p className="sup-card-desc text-[#6b7280] m-0 leading-[1.6]">
              Our team reviews every request carefully. For faster resolution,
              provide clear details including your registered email and issue
              description. Payment and account-related issues are prioritized on
              a high-priority basis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Support;

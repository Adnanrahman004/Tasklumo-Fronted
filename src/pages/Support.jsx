import { Link } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft,
  Zap,
  Wallet,
  Shield,
  Radio,
  Mail,
  Clock,
  Copy,
  Check,
  ChevronDown,
  HelpCircle,
  CircleCheck,
  Send,
  RotateCcw,
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
    q: "Is TaskLumo free to use?",
    a: "Yes, completely free. There are no hidden charges — you simply complete tasks to earn coins and withdraw once you hit the minimum threshold.",
  },
];

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
    <div
      className={`min-h-screen p-[14px] pb-[40px] text-white ${FONT}
      bg-[radial-gradient(circle_at_top_left,rgba(255,140,0,0.18),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(250,204,21,0.10),transparent_30%),linear-gradient(135deg,#050505_0%,#0a0a0a_45%,#120909_100%)]`}
    >
      {/* keyframes that Tailwind utility classes alone can't define */}
      <style>{`
        @keyframes supIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes supPulse {
          0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
          70% { box-shadow: 0 0 0 6px rgba(34,197,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }
        @keyframes supShine {
          to { background-position: 200% center; }
        }
        .sup-inner ::-webkit-scrollbar { width: 5px; }
        .sup-inner ::-webkit-scrollbar-track { background: transparent; }
        .sup-inner ::-webkit-scrollbar-thumb {
          background: rgba(250,204,21,0.35);
          border-radius: 10px;
        }
        .sup-inner ::selection {
          background: rgba(250,204,21,0.35);
          color: #000;
        }
      `}</style>

      <div className="sup-inner w-full max-w-[480px] mx-auto">
        {/* Topbar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Link
              to="/home"
              className="w-[36px] h-[36px] rounded-[11px] bg-[#111111]/90 border border-[#facc15]/[0.16] text-white flex items-center justify-center no-underline shrink-0 transition-transform duration-150 active:scale-90 hover:border-[#facc15]/40"
            >
              <ArrowLeft size={17} />
            </Link>
            <h1 className="m-0 text-[21px] max-[340px]:text-[19px] font-black tracking-[-0.3px] bg-[linear-gradient(to_right,#ffe27a,#facc15,#ffffff)] bg-[length:200%_auto] bg-clip-text text-transparent animate-[supShine_4s_linear_infinite]">
              Support
            </h1>
          </div>
          <div className="flex items-center gap-[5px] bg-[#facc15]/10 border border-[#facc15]/[0.22] px-[11px] py-[6px] rounded-full text-[9px] text-[#facc15] font-bold whitespace-nowrap shadow-[0_0_14px_rgba(250,204,21,0.08)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-[supPulse_1.6s_infinite]" />
            24/7 Active
          </div>
        </div>

        {/* Main card */}
        <div className="relative bg-[linear-gradient(180deg,rgba(20,20,20,0.95),rgba(14,14,14,0.95))] border border-[#facc15]/[0.14] rounded-[24px] p-5 backdrop-blur-[18px] shadow-[0_20px_45px_rgba(0,0,0,0.45),0_0_30px_rgba(250,204,21,0.06)] animate-[supIn_0.4s_ease_both] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-[linear-gradient(90deg,transparent,rgba(250,204,21,0.6),transparent)]">
          <div className="text-center mb-[18px]">
            <div className="w-[78px] h-[78px] rounded-full mx-auto p-[3px] bg-[conic-gradient(from_0deg,#facc15,#ff8f00,#facc15)] flex items-center justify-center shadow-[0_4px_20px_rgba(250,204,21,0.3)]">
              <img
                src={logo}
                alt="TaskLumo Logo"
                className="w-full h-full rounded-full object-cover border-[3px] border-[#0a0a0a]"
              />
            </div>
            <div className="inline-flex items-center gap-1 mt-[10px] text-[9.5px] font-bold text-[#facc15] bg-[#facc15]/[0.08] border border-[#facc15]/20 px-[10px] py-1 rounded-full">
              <CircleCheck size={11} /> Verified Support Team
            </div>
          </div>

          <div>
            <p className="text-[#ffb84d] text-[10px] font-bold tracking-[1.5px] uppercase mb-[6px]">
              We're here to help
            </p>
            <h2 className="text-white text-[clamp(26px,8vw,38px)] max-[340px]:text-[24px] font-black leading-[1.05] m-0 mb-[14px]">
              Customer
              <br />
              Support
            </h2>
            <p className="text-[#a1a1aa] text-[12px] leading-[21px] m-0 mb-5">
              At TaskLumo, we're committed to providing fast and reliable
              support. If you're facing any issues related to tasks, earnings,
              withdrawals, referrals, or account access, submit your request
              below and our team will get back to you.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-5">
            {[
              { icon: Zap, text: "Fast response" },
              { icon: Wallet, text: "Withdrawal help" },
              { icon: Shield, text: "Secure support" },
              { icon: Radio, text: "Live assistance" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  className="bg-[linear-gradient(180deg,rgba(20,20,20,0.9),rgba(14,14,14,0.9))] border border-[#facc15]/[0.12] rounded-xl px-2 py-[12px] text-center transition-all duration-200 hover:border-[#facc15]/30 hover:-translate-y-0.5 active:scale-[0.97]"
                  key={i}
                >
                  <div className="w-7 h-7 rounded-[9px] bg-[#facc15]/[0.12] shadow-[0_0_12px_rgba(250,204,21,0.1)] flex items-center justify-center mx-auto mb-[6px]">
                    <Icon className="text-[#facc15]" size={15} />
                  </div>
                  <p className="text-[9px] text-[#d4d4d8] font-semibold m-0">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Contact information */}
          <div className="relative bg-[linear-gradient(180deg,rgba(20,20,20,0.9),rgba(14,14,14,0.9))] border border-[#facc15]/[0.12] rounded-2xl p-4 mb-[18px] shadow-[0_14px_30px_rgba(0,0,0,0.35)] before:content-[''] before:absolute before:top-0 before:left-4 before:right-4 before:h-px before:bg-[linear-gradient(90deg,transparent,rgba(250,204,21,0.4),transparent)]">
            <h2 className="text-[#facc15] text-[15px] font-extrabold m-0 mb-3 flex items-center gap-[7px]">
              <Mail size={16} /> Contact information
            </h2>
            <div className="flex items-center justify-between gap-2 mb-[10px]">
              <span className="text-[#facc15] font-bold text-[11px] break-all">
                {supportEmail}
              </span>
              <button
                className={`shrink-0 flex items-center gap-1 bg-[#facc15]/10 border border-[#facc15]/20 text-[#facc15] text-[9.5px] font-bold px-[9px] py-[6px] rounded-lg cursor-pointer transition-transform duration-150 active:scale-90 ${FONT}`}
                onClick={copyEmail}
              >
                {emailCopied ? <Check size={11} /> : <Copy size={11} />}
                {emailCopied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="text-[#d4d4d8] text-[11px] leading-[22px] m-0">
              Support hours:{" "}
              <span className="text-[#facc15] font-bold">24/7</span>
            </p>
            <p className="text-[#d4d4d8] text-[11px] leading-[22px] m-0">
              Response time:{" "}
              <span className="text-[#facc15] font-bold">
                Within 24-48 hours
              </span>
            </p>
          </div>

          {/* FAQ */}
          <div className="relative bg-[linear-gradient(180deg,rgba(20,20,20,0.9),rgba(14,14,14,0.9))] border border-[#facc15]/[0.12] rounded-2xl p-4 mb-[18px] shadow-[0_14px_30px_rgba(0,0,0,0.35)] before:content-[''] before:absolute before:top-0 before:left-4 before:right-4 before:h-px before:bg-[linear-gradient(90deg,transparent,rgba(250,204,21,0.4),transparent)]">
            <h2 className="text-[#facc15] text-[15px] font-extrabold m-0 mb-3 flex items-center gap-[7px]">
              <HelpCircle size={16} /> Frequently asked questions
            </h2>
            {FAQS.map((f, i) => (
              <div
                className="border-b border-white/[0.06] last:border-b-0"
                key={i}
              >
                <button
                  className={`w-full bg-transparent border-none text-white ${FONT} text-[11.5px] font-bold py-3 px-0.5 flex items-center justify-between cursor-pointer text-left`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {f.q}
                  <ChevronDown
                    size={15}
                    className={`text-[#facc15] shrink-0 transition-transform duration-200 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <p className="text-[#a1a1aa] text-[10.5px] leading-[19px] px-0.5 pb-3 m-0">
                    {f.a}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="relative bg-[linear-gradient(180deg,rgba(20,20,20,0.9),rgba(14,14,14,0.9))] border border-[#facc15]/[0.12] rounded-2xl p-4 mb-[18px] shadow-[0_14px_30px_rgba(0,0,0,0.35)] before:content-[''] before:absolute before:top-0 before:left-4 before:right-4 before:h-px before:bg-[linear-gradient(90deg,transparent,rgba(250,204,21,0.4),transparent)]">
            {submitted ? (
              <div className="text-center pt-[30px] px-3 pb-[10px] animate-[supIn_0.4s_ease_both]">
                <div className="w-[60px] h-[60px] rounded-full bg-green-500/[0.12] border border-green-500/[0.35] text-green-400 flex items-center justify-center mx-auto mb-4">
                  <CircleCheck size={30} />
                </div>
                <h3 className="text-[18px] font-extrabold m-0 mb-2">
                  Request submitted!
                </h3>
                <p className="text-[11.5px] text-[#a1a1aa] leading-[19px] max-w-[320px] mx-auto mb-4">
                  Thanks, {name || "there"} — our team has received your request
                  and will follow up at {email || "your email"} within 24-48
                  hours.
                </p>
                <div className="inline-block bg-[#facc15]/10 border border-[#facc15]/30 text-[#facc15] font-extrabold text-[13px] tracking-[1px] px-[18px] py-2 rounded-[10px] mb-5">
                  {ticketId}
                </div>
                <div className="flex gap-[10px] flex-wrap">
                  <button
                    className={`flex-1 py-[13px] rounded-xl font-extrabold text-[11.5px] cursor-pointer ${FONT} border-none flex items-center justify-center gap-[6px] bg-white/[0.04] border border-white/[0.08] text-white transition-transform duration-150 active:scale-[0.97]`}
                    onClick={resetForm}
                  >
                    <RotateCcw size={14} /> Submit another
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-[#facc15] text-[15px] font-extrabold m-0 mb-3">
                  Select your issue
                </h2>

                <label className="text-[10px] text-[#8b8b93] font-bold uppercase tracking-[0.5px] mb-[6px] block">
                  Issue type
                </label>
                <select
                  className={`w-full px-[14px] py-[13px] rounded-xl border border-white/[0.09] bg-white/[0.035] text-white outline-none mb-[14px] text-[11px] ${FONT} transition-colors duration-150 focus:border-[#facc15]/40 focus:bg-white/[0.05]`}
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                >
                  <option style={{ color: "black" }}>Select Issue Type</option>
                  {ISSUE_LIST.map((item, index) => (
                    <option key={index} style={{ color: "black" }}>
                      {item}
                    </option>
                  ))}
                </select>

                <label className="text-[10px] text-[#8b8b93] font-bold uppercase tracking-[0.5px] mb-[6px] block">
                  Priority
                </label>
                <div className="flex gap-2 mb-[14px]">
                  {PRIORITIES.map((p) => (
                    <div
                      key={p.key}
                      className={`flex-1 text-center py-[9px] rounded-[10px] text-[10.5px] font-bold cursor-pointer border transition-all duration-150 ${FONT} ${
                        priority === p.key
                          ? "border-[#facc15]/50 bg-[#facc15]/[0.12] text-[#facc15]"
                          : "border-white/[0.08] bg-white/[0.03] text-[#a1a1aa]"
                      }`}
                      onClick={() => setPriority(p.key)}
                    >
                      {p.label}
                    </div>
                  ))}
                </div>

                <label className="text-[10px] text-[#8b8b93] font-bold uppercase tracking-[0.5px] mb-[6px] block">
                  Your name
                </label>
                <input
                  className={`w-full px-[14px] py-[13px] rounded-xl border border-white/[0.09] bg-white/[0.035] text-white outline-none mb-[14px] text-[11px] ${FONT} transition-colors duration-150 focus:border-[#facc15]/40 focus:bg-white/[0.05]`}
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <label className="text-[10px] text-[#8b8b93] font-bold uppercase tracking-[0.5px] mb-[6px] block">
                  Your email
                </label>
                <input
                  className={`w-full px-[14px] py-[13px] rounded-xl border border-white/[0.09] bg-white/[0.035] text-white outline-none mb-[14px] text-[11px] ${FONT} transition-colors duration-150 focus:border-[#facc15]/40 focus:bg-white/[0.05]`}
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <label className="text-[10px] text-[#8b8b93] font-bold uppercase tracking-[0.5px] mb-[6px] block">
                  Your UID (optional)
                </label>
                <input
                  className={`w-full px-[14px] py-[13px] rounded-xl border border-white/[0.09] bg-white/[0.035] text-white outline-none mb-[14px] text-[11px] ${FONT} transition-colors duration-150 focus:border-[#facc15]/40 focus:bg-white/[0.05]`}
                  type="text"
                  placeholder="User ID"
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                />

                <label className="text-[10px] text-[#8b8b93] font-bold uppercase tracking-[0.5px] mb-[6px] block">
                  Describe your issue
                </label>
                <textarea
                  className={`w-full px-[14px] py-[13px] rounded-xl border border-white/[0.09] bg-white/[0.035] text-white outline-none mb-[14px] text-[11px] ${FONT} transition-colors duration-150 focus:border-[#facc15]/40 focus:bg-white/[0.05] resize-none leading-5`}
                  placeholder="Tell us what's going on in as much detail as possible..."
                  rows="5"
                  maxLength={MAX_CHARS}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <div className="text-right text-[9px] text-[#6f6f76] -mt-[9px] mb-[14px]">
                  {message.length}/{MAX_CHARS}
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-[11px] px-3 py-[10px] rounded-[10px] mb-[14px]">
                    {error}
                  </div>
                )}

                <div className="flex gap-[10px] flex-wrap">
                  <button
                    className={`flex-1 py-[13px] rounded-xl font-extrabold text-[11.5px] cursor-pointer ${FONT} border-none flex items-center justify-center gap-[6px] bg-[linear-gradient(135deg,#ffe27a,#facc15,#eab308)] text-[#1a1400] shadow-[0_6px_18px_rgba(250,204,21,0.28)] transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.97] disabled:opacity-60`}
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    <Send size={14} />{" "}
                    {submitting ? "Submitting..." : "Submit request"}
                  </button>
                  <button
                    className={`flex-1 py-[13px] rounded-xl font-extrabold text-[11.5px] cursor-pointer ${FONT} border-none flex items-center justify-center gap-[6px] bg-white/[0.045] border border-white/[0.09] text-white transition-transform duration-150 active:scale-[0.97] disabled:opacity-60`}
                    onClick={loadMyRequests}
                    disabled={loadingRequests}
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
                      <p className="text-[#a1a1aa] text-[11px]">
                        No tickets found.
                      </p>
                    ) : (
                      requests.map((ticket) => (
                        <div
                          key={ticket.id}
                          className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 mb-[10px]"
                        >
                          <h3 className="text-[#facc15] text-[12.5px] font-extrabold m-0 mb-1">
                            {ticket.issueType}
                          </h3>
                          <p className="text-[#d4d4d8] text-[11px] leading-[18px] m-0 mb-2">
                            {ticket.message}
                          </p>
                          <p className="text-[#a1a1aa] text-[10.5px] m-0 mb-1">
                            Status:{" "}
                            <span className="text-[#facc15] font-bold">
                              {ticket.status}
                            </span>
                          </p>
                          <p className="text-[#a1a1aa] text-[10.5px] m-0">
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

          {/* Important notice */}
          <div className="relative bg-[linear-gradient(180deg,rgba(20,20,20,0.9),rgba(14,14,14,0.9))] border border-[#facc15]/[0.12] rounded-2xl p-4 mb-[18px] shadow-[0_14px_30px_rgba(0,0,0,0.35)] before:content-[''] before:absolute before:top-0 before:left-4 before:right-4 before:h-px before:bg-[linear-gradient(90deg,transparent,rgba(250,204,21,0.4),transparent)]">
            <h2 className="text-[#facc15] text-[15px] font-extrabold m-0 mb-3">
              Important notice
            </h2>
            <p className="text-[#d4d4d8] text-[10.5px] leading-[23px] m-0">
              Submit only one request per issue to avoid delays. Ensure all
              information provided is accurate — fake or spam requests may lead
              to account suspension. Payments and rewards depend on verification
              from our advertising partners.
            </p>
          </div>

          {/* Support guidelines */}
          <div className="relative bg-[linear-gradient(180deg,rgba(20,20,20,0.9),rgba(14,14,14,0.9))] border border-[#facc15]/[0.12] rounded-2xl p-4 mb-0 shadow-[0_14px_30px_rgba(0,0,0,0.35)] before:content-[''] before:absolute before:top-0 before:left-4 before:right-4 before:h-px before:bg-[linear-gradient(90deg,transparent,rgba(250,204,21,0.4),transparent)]">
            <h2 className="text-[#facc15] text-[15px] font-extrabold m-0 mb-3">
              Support guidelines
            </h2>
            <p className="text-[#d4d4d8] text-[10.5px] leading-[23px] m-0">
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

import { Link } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft,
  Shield,
  FileText,
  Sparkles,
  AlertCircle,
  ChevronDown,
  Lock,
  Zap,
} from "lucide-react";
import logo from "/logo.jpg.jpeg";

const TERMS_DATA = [
  {
    title: "1. Acceptance of Terms",
    text: "By accessing or using Earnzyro, users agree to comply with all platform rules, policies, guidelines, and applicable laws. Continued use of the platform indicates acceptance of these Terms & Conditions.",
  },
  {
    title: "2. User Eligibility",
    text: "Users must meet the minimum legal age requirement in their country or region before creating an account or participating in any platform activities available on Earnzyro.",
  },
  {
    title: "3. Account Responsibility",
    text: "Users are responsible for maintaining account security, protecting passwords, and ensuring that all account information provided is accurate, updated, and genuine.",
  },
  {
    title: "4. Rewards & Earnings",
    text: "Earnzyro provides reward opportunities through tasks, surveys, advertisements, referrals, and promotional activities. Rewards may vary depending on offer availability, advertiser verification, and platform policies.",
  },
  {
    title: "5. Withdrawal Policy",
    text: "Withdrawals are subject to account verification, platform checks, minimum withdrawal limits, and payment system availability. Processing times may vary depending on verification requirements and payment providers.",
  },
  {
    title: "6. Fraud & Abuse Policy",
    text: "Fake referrals, automated activity, multiple accounts, spam behavior, manipulation attempts, or fraudulent actions are strictly prohibited and may result in account suspension or permanent removal from the platform.",
  },
  {
    title: "7. Referral System Rules",
    text: "Users may invite others using referral links. Referral rewards may only be granted for genuine users and valid activity completed according to Earnzyro referral policies.",
  },
  {
    title: "8. Third-Party Services",
    text: "Some tasks, surveys, advertisements, and promotional offers may be managed by third-party providers. Earnzyro is not directly responsible for third-party platform availability or advertiser decisions.",
  },
  {
    title: "9. Platform Availability",
    text: "We work continuously to maintain platform stability and performance. However, Earnzyro does not guarantee uninterrupted availability due to maintenance, technical updates, or external service interruptions.",
  },
  {
    title: "10. Account Suspension",
    text: "Earnzyro reserves the right to temporarily suspend or permanently terminate accounts involved in suspicious, fraudulent, abusive, or policy-violating activities without prior notice.",
  },
  {
    title: "11. Intellectual Property",
    text: "All Earnzyro branding, logos, designs, platform content, graphics, and system elements remain the property of Earnzyro and may not be copied or reused without authorization.",
  },
  {
    title: "12. Changes to Terms",
    text: "Earnzyro may modify or update these Terms & Conditions at any time to improve platform functionality, security, legal compliance, or operational policies.",
  },
  {
    title: "13. Limitation of Liability",
    text: "Earnzyro is not responsible for losses, delays, third-party service issues, advertiser actions, internet interruptions, or technical problems beyond platform control.",
  },
  {
    title: "14. Contact & Support",
    text: "Users may contact the official Earnzyro support team for assistance related to account issues, withdrawals, rewards, platform guidance, or policy-related questions.",
  },
];

const NOTICE_LIST = [
  "Users must follow all platform rules and community guidelines.",
  "Fake activity, spam behavior, or fraudulent usage is strictly prohibited.",
  "Rewards and withdrawals are subject to verification and advertiser approval systems.",
  "Continued use of Earnzyro indicates agreement with all platform policies and terms.",
];

const GUIDELINES_LIST = [
  "Respect platform rules and maintain fair usage behavior.",
  "Avoid misleading, harmful, or abusive activities.",
  "Use only genuine account information and payment details.",
  "Report suspicious activity to the official support team.",
];

const QUICK_CHIPS = [
  { icon: Zap, label: "Fair Usage" },
  { icon: Lock, label: "Secure Platform" },
  { icon: Shield, label: "Anti Fraud" },
  { icon: FileText, label: "Transparent Rules" },
];

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
  @keyframes tickerDot { 0%, 100% { opacity: 0.5; transform: scale(0.85); } 50% { opacity: 1; transform: scale(1); } }
  @media (prefers-reduced-motion: reduce) {
    * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
  }

  .tm-shell {
    max-width: 1180px;
    margin: 0 auto;
    padding-left: clamp(16px, 4vw, 40px);
    padding-right: clamp(16px, 4vw, 40px);
    padding-bottom: clamp(80px, 10vh, 100px);
    padding-top: 0;
  }

  .tm-header {
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

  .tm-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: clamp(14px, 1.8vw, 22px);
    box-shadow: 0 1px 3px rgba(17, 24, 39, 0.04);
    transition: transform 0.35s var(--ease-premium), box-shadow 0.35s var(--ease-premium), border-color 0.35s var(--ease-premium);
  }
  .tm-card-hi { border-color: #86efac; }

  @media (hover: hover) {
    .tm-card:hover {
      box-shadow: 0 10px 28px rgba(34, 197, 94, 0.10);
      border-color: rgba(34, 197, 94, 0.35);
    }
    .tm-btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(34, 197, 94, 0.32);
    }
    .tm-btn-ghost:hover {
      border-color: rgba(34, 197, 94, 0.45);
      color: var(--brand);
    }
    .tm-tile:hover { border-color: rgba(34, 197, 94, 0.45); transform: translateY(-2px); }
    .tm-acc-head:hover { background: rgba(34, 197, 94, 0.04); }
  }
  .tm-btn-primary:active,
  .tm-btn-ghost:active,
  .tm-tile:active { transform: scale(0.94); }
  .tm-focusable:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }

  .tm-title      { font-size: clamp(20px, 1.2vw + 16px, 28px); }
  .tm-hero-title { font-size: clamp(24px, 2vw + 14px, 34px); }
  .tm-hero-desc  { font-size: clamp(11px, 0.4vw + 9.5px, 13px); line-height: 1.7; }
  .tm-card-title { font-size: clamp(13px, 0.4vw + 10.5px, 15px); }
  .tm-acc-title  { font-size: clamp(12px, 0.4vw + 10.5px, 14px); }
  .tm-desc       { font-size: clamp(10.5px, 0.3vw + 9px, 12px); line-height: 1.75; }
  .tm-btn-text   { font-size: clamp(10.5px, 0.3vw + 9.5px, 12px); }
  .tm-chip       { font-size: clamp(9.5px, 0.3vw + 8.5px, 11px); }

  .tm-accordion-item {
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
    background: var(--surface-soft);
    transition: all 0.2s var(--ease-premium);
  }
  .tm-accordion-item-open {
    border-color: #86efac !important;
    background: rgba(220, 252, 231, 0.5) !important;
  }
  .tm-acc-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 14px 16px;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.2s;
  }
  .tm-acc-icon {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: 9999px;
    background: var(--highlight);
    border: 1px solid #bbf7d0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--brand);
    transition: transform 0.25s var(--ease-premium);
  }
  .tm-acc-body {
    overflow: hidden;
    transition: max-height 0.3s var(--ease-premium), padding 0.3s var(--ease-premium);
    padding: 0 16px;
  }
  .tm-acc-body-open {
    max-height: 400px;
    padding-bottom: 16px;
  }
  .tm-acc-body-closed {
    max-height: 0;
  }
`;

function Terms() {
  const [openIndex, setOpenIndex] = useState(null);
  const FONT = "font-[Poppins,-apple-system,sans-serif]";

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`min-h-[100dvh] text-[#111827] ${FONT} bg-[#F2F5F3]`}>
      <style>{DESIGN_SYSTEM_CSS}</style>

      <div
        className="relative z-0"
        style={{ animation: "pageFadeIn 0.4s var(--ease-premium) both" }}
      >
        <div className="tm-shell relative z-10">
          {/* ===== Header ===== */}
          <div className="tm-header flex justify-between items-center gap-[10px]">
            <div className="flex items-center gap-2.5 min-w-0">
              <Link
                to="/home"
                aria-label="Back to Home"
                className="tm-focusable w-[36px] h-[36px] rounded-[11px] bg-[#FCFDFC] border border-[#e5e7eb] text-[#16a34a] flex items-center justify-center no-underline shrink-0 transition-[transform,border-color] duration-200 hover:border-[#22c55e]/60 active:scale-90"
              >
                <ArrowLeft size={17} />
              </Link>
              <h1 className="tm-title font-extrabold bg-gradient-to-r from-[#16a34a] to-[#111827] bg-clip-text text-transparent m-0 tracking-tight truncate">
                Terms &amp; Conditions
              </h1>
            </div>
            <div className="tm-chip flex items-center gap-[5px] bg-[#dcfce7] border border-[#bbf7d0] px-[11px] py-[6px] rounded-full text-[#166534] font-bold whitespace-nowrap">
              <FileText size={11} /> 2026
            </div>
          </div>

          {/* ===== Main Card ===== */}
          <div
            className="tm-card tm-card-hi mb-[16px]"
            style={{ animation: "cardIn 0.5s var(--ease-premium) both" }}
          >
            {/* Hero */}
            <div className="text-center mb-[22px]">
              <div
                className="w-[76px] h-[76px] min-[960px]:w-[90px] min-[960px]:h-[90px] mx-auto mb-4 rounded-full p-[3px] flex items-center justify-center shadow-[0_4px_20px_rgba(34,197,94,0.25)]"
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
              <h2 className="tm-hero-title font-extrabold tracking-tight m-0 mb-[10px] text-[#111827]">
                Terms &amp; Conditions
              </h2>
              <p className="tm-hero-desc text-[#6b7280] max-w-[640px] mx-auto m-0">
                Please read these Terms &amp; Conditions carefully before using
                Earnzyro services. These terms explain platform rules, account
                responsibilities, reward systems, security policies, and
                acceptable platform usage guidelines.
              </p>
            </div>

            {/* Quick Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-[10px] mb-[22px]">
              {QUICK_CHIPS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="tm-tile bg-[#F6F9F6] border border-[#e5e7eb] rounded-xl px-2 py-[12px] text-center transition-all duration-200"
                  >
                    <div className="w-7 h-7 rounded-[9px] bg-[#dcfce7] text-[#16a34a] flex items-center justify-center mx-auto mb-[6px]">
                      <Icon size={14} />
                    </div>
                    <p className="tm-desc font-semibold m-0 text-[#374151]">
                      {item.label}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Important Notice */}
            <div className="rounded-2xl p-[clamp(14px,1.6vw,18px)] mb-[22px] bg-gradient-to-br from-[rgba(34,197,94,0.08)] to-[rgba(220,252,231,0.4)] border border-[#bbf7d0] border-l-[3px] border-l-[#16a34a]">
              <h2 className="tm-card-title font-extrabold m-0 mb-3 flex items-center gap-1.5 text-[#16a34a]">
                <AlertCircle size={14} /> Important User Notice
              </h2>
              <ul className="m-0 p-0 list-none">
                {NOTICE_LIST.map((li, i) => (
                  <li
                    key={i}
                    className="tm-desc text-[#374151] pl-4 relative mb-2 last:mb-0 before:content-[''] before:absolute before:left-0 before:top-[8px] before:w-[5px] before:h-[5px] before:rounded-full before:bg-[#16a34a]"
                  >
                    {li}
                  </li>
                ))}
              </ul>
            </div>

            {/* Accordion */}
            <div className="flex items-center gap-2.5 mt-[26px] mb-3">
              <span className="tm-chip tracking-[0.14em] text-[#6b7280] uppercase font-bold whitespace-nowrap">
                Full Terms
              </span>
              <span className="flex-1 h-px bg-gradient-to-r from-[#bbf7d0] to-transparent" />
            </div>
            <div className="flex flex-col gap-2">
              {TERMS_DATA.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={index}
                    className={`tm-accordion-item ${
                      isOpen ? "tm-accordion-item-open" : ""
                    }`}
                  >
                    <div className="tm-acc-head" onClick={() => toggle(index)}>
                      <span
                        className={`tm-acc-title font-bold tracking-tight ${
                          isOpen ? "text-[#16a34a]" : "text-[#111827]"
                        }`}
                      >
                        {item.title}
                      </span>
                      <span
                        className="tm-acc-icon"
                        style={{
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      >
                        <ChevronDown size={13} />
                      </span>
                    </div>
                    <div
                      className={`tm-acc-body ${
                        isOpen ? "tm-acc-body-open" : "tm-acc-body-closed"
                      }`}
                    >
                      <p className="tm-desc text-[#6b7280] m-0">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Community Guidelines */}
            <div className="rounded-2xl p-[clamp(14px,1.6vw,18px)] mt-6 bg-[#F6F9F6] border border-[#e5e7eb]">
              <h2 className="tm-card-title font-extrabold m-0 mb-3 flex items-center gap-1.5 text-[#16a34a]">
                <Sparkles size={14} /> Community Guidelines
              </h2>
              <ul className="m-0 p-0 list-none">
                {GUIDELINES_LIST.map((li, i) => (
                  <li
                    key={i}
                    className="tm-desc text-[#374151] pl-4 relative mb-2 last:mb-0 before:content-[''] before:absolute before:left-0 before:top-[8px] before:w-[5px] before:h-[5px] before:rounded-full before:bg-[#16a34a]"
                  >
                    {li}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ===== Support Card ===== */}
          <div
            className="tm-card text-center"
            style={{
              animation: "cardIn 0.5s var(--ease-premium) both",
              animationDelay: "0.10s",
            }}
          >
            <h2 className="tm-card-title font-extrabold m-0 mb-[10px] text-[#16a34a] flex items-center justify-center gap-1.5">
              <AlertCircle size={14} /> Need Assistance?
            </h2>
            <p className="tm-desc text-[#6b7280] max-w-[560px] mx-auto m-0 mb-4">
              Contact our support team for questions related to platform
              policies, rewards, withdrawals, verification, or account issues.
            </p>
            <div className="flex justify-center gap-[10px] flex-wrap">
              <Link
                to="/support"
                className={`tm-btn-primary tm-btn-text no-underline font-extrabold inline-flex items-center justify-center gap-[6px] px-[22px] py-[11px] rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] text-white shadow-[0_6px_18px_rgba(34,197,94,0.28)] transition-transform duration-150 ${FONT}`}
              >
                Contact Support
              </Link>
              <Link
                to="/privacy"
                className={`tm-btn-ghost tm-btn-text no-underline font-extrabold inline-flex items-center justify-center gap-[6px] px-[22px] py-[11px] rounded-full bg-[#F6F9F6] border border-[#e5e7eb] text-[#16a34a] transition-all duration-150 ${FONT}`}
              >
                <Shield size={14} /> Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Terms;

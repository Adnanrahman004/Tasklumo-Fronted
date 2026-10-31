import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  Lock,
  Zap,
  FileText,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import logo from "/logo.jpg.jpeg";

const LAST_UPDATED = "July 5, 2026";

const policyData = [
  {
    id: "introduction",
    icon: "👋",
    title: "1. Introduction",
    text: "Earnzyro values user privacy and is committed to protecting personal information. This Privacy Policy explains how we collect, store, manage, and protect user data while you use our platform and services. By using Earnzyro, you agree to the practices described below.",
  },
  {
    id: "information-we-collect",
    icon: "🗂️",
    title: "2. Information We Collect",
    text: "We may collect information such as your email address, username, referral details, wallet details, IP address, browser and device information, task activity, withdrawal details, and general platform usage data.",
  },
  {
    id: "how-we-use-information",
    icon: "⚙️",
    title: "3. How We Use Information",
    text: "Collected information may be used to improve platform performance, process rewards and withdrawals, verify accounts, prevent fraud, provide customer support, manage referrals, and improve your overall experience.",
  },
  {
    id: "cookies-tracking",
    icon: "🍪",
    title: "4. Cookies & Tracking",
    text: "Earnzyro may use cookies and analytics tools to improve website functionality, maintain user sessions, analyze traffic, personalize experiences, and strengthen our security systems.",
  },
  {
    id: "third-party-services",
    icon: "🔗",
    title: "5. Third-Party Services",
    text: "Some surveys, offers, advertisements, payment gateways, and promotional services available on Earnzyro may be managed by third-party partners. These services may have their own separate privacy policies and terms.",
  },
  {
    id: "account-security",
    icon: "🛡️",
    title: "6. Account & Security",
    text: "We use monitoring systems, verification methods, encryption technologies, and fraud-prevention systems to help protect user accounts and sensitive platform information.",
  },
  {
    id: "withdrawal-verification",
    icon: "💳",
    title: "7. Withdrawal Verification",
    text: "For security and fraud prevention purposes, users may be required to complete account verification before withdrawals are approved or processed.",
  },
  {
    id: "user-responsibilities",
    icon: "✅",
    title: "8. User Responsibilities",
    text: "Users are responsible for maintaining account security, protecting passwords, providing accurate information, and avoiding fraudulent or abusive activity on the platform.",
  },
  {
    id: "data-sharing",
    icon: "🤝",
    title: "9. Data Sharing",
    text: "Earnzyro does not sell personal user information. Limited information may only be shared with trusted partners, payment providers, or legal authorities when required for platform operations or legal compliance.",
  },
  {
    id: "data-retention",
    icon: "🗄️",
    title: "10. Data Retention",
    text: "We retain account and transaction data only for as long as it's needed to provide our services, meet legal or accounting requirements, and resolve disputes. Data tied to closed accounts may be retained for a limited period for fraud prevention before secure deletion.",
  },
  {
    id: "your-rights",
    icon: "🎛️",
    title: "11. Your Rights & Choices",
    text: "You can request a copy of the personal data we hold about you, ask us to correct inaccurate details, or request account deletion at any time by contacting support. We'll respond within a reasonable timeframe.",
  },
  {
    id: "children-privacy",
    icon: "🚸",
    title: "12. Children's Privacy",
    text: "Earnzyro services are not intended for children below the legal minimum age in their country or region. We do not knowingly collect personal data from underage users.",
  },
  {
    id: "policy-updates",
    icon: "📝",
    title: "13. Policy Updates",
    text: "We may update this Privacy Policy at any time to improve transparency, security, platform functionality, or legal compliance. Updated policies become effective immediately after publication, and the date above will reflect the latest revision.",
  },
  {
    id: "contact",
    icon: "📩",
    title: "14. Contact Information",
    text: "Users may contact the Earnzyro support team regarding privacy concerns, account security, or policy questions using the official support system or support email.",
  },
];

const trustBadges = [
  { icon: "🔒", label: "Encrypted Data" },
  { icon: "🛡️", label: "Fraud Protection" },
  { icon: "⚡", label: "Safe Withdrawals" },
  { icon: "📄", label: "Transparent Policy" },
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

  .pv-shell {
    max-width: 1180px;
    margin: 0 auto;
    padding-left: clamp(16px, 4vw, 40px);
    padding-right: clamp(16px, 4vw, 40px);
    padding-bottom: clamp(80px, 10vh, 100px);
    padding-top: 0;
  }

  .pv-header {
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

  .pv-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: clamp(14px, 1.8vw, 22px);
    box-shadow: 0 1px 3px rgba(17, 24, 39, 0.04);
    transition: transform 0.35s var(--ease-premium), box-shadow 0.35s var(--ease-premium), border-color 0.35s var(--ease-premium);
  }
  .pv-card-hi { border-color: #86efac; }

  @media (hover: hover) {
    .pv-card:hover {
      box-shadow: 0 10px 28px rgba(34, 197, 94, 0.10);
      border-color: rgba(34, 197, 94, 0.35);
    }
    .pv-btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(34, 197, 94, 0.32);
    }
    .pv-btn-ghost:hover {
      border-color: rgba(34, 197, 94, 0.45);
      color: var(--brand);
    }
    .pv-tile:hover { border-color: rgba(34, 197, 94, 0.45); transform: translateY(-2px); }
    .pv-toc-btn:hover { border-color: rgba(34, 197, 94, 0.45); color: var(--brand); }
  }
  .pv-btn-primary:active,
  .pv-btn-ghost:active,
  .pv-toc-btn:active { transform: scale(0.94); }
  .pv-focusable:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }

  .pv-title      { font-size: clamp(20px, 1.2vw + 16px, 28px); }
  .pv-hero-title { font-size: clamp(24px, 2vw + 14px, 34px); }
  .pv-hero-desc  { font-size: clamp(11px, 0.4vw + 9.5px, 13px); line-height: 1.7; }
  .pv-card-title { font-size: clamp(13px, 0.4vw + 10.5px, 15px); }
  .pv-sec-title  { font-size: clamp(13px, 0.4vw + 11px, 16px); }
  .pv-desc       { font-size: clamp(10.5px, 0.3vw + 9px, 12px); line-height: 1.75; }
  .pv-btn-text   { font-size: clamp(10.5px, 0.3vw + 9.5px, 12px); }
  .pv-chip       { font-size: clamp(9.5px, 0.3vw + 8.5px, 11px); }
  .pv-toc-text   { font-size: clamp(10.5px, 0.3vw + 9px, 11.5px); }

  .pv-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: clamp(14px, 2vw, 22px);
    align-items: start;
  }
  @media (min-width: 960px) {
    .pv-layout { grid-template-columns: 240px 1fr; }
  }

  .pv-toc {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 6px;
    scrollbar-width: none;
  }
  .pv-toc::-webkit-scrollbar { display: none; }
  @media (min-width: 960px) {
    .pv-toc {
      flex-direction: column;
      overflow-x: visible;
      position: sticky;
      top: 90px;
    }
  }

  .pv-toc-btn {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border-radius: 9999px;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
    border: 1px solid var(--border);
    background: var(--surface-soft);
    color: var(--muted);
    transition: all 0.2s var(--ease-premium);
  }
  @media (min-width: 960px) {
    .pv-toc-btn { width: 100%; border-radius: 12px; }
  }
  .pv-toc-btn-active {
    background: linear-gradient(135deg, #22c55e, #16a34a) !important;
    color: #ffffff !important;
    border-color: transparent !important;
    box-shadow: 0 4px 14px rgba(34, 197, 94, 0.28);
  }

  .pv-section-icon {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: var(--highlight);
    border: 1px solid #bbf7d0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    flex-shrink: 0;
  }

  .pv-trust-box {
    border-radius: 16px;
    padding: clamp(14px, 1.6vw, 18px);
    background: linear-gradient(135deg, rgba(34,197,94,0.08), rgba(220,252,231,0.4));
    border: 1px solid #bbf7d0;
  }
  .pv-safety-box {
    border-radius: 16px;
    padding: clamp(14px, 1.6vw, 18px);
    background: var(--surface-soft);
    border: 1px solid var(--border);
  }
`;

function Privacy() {
  const [activeSection, setActiveSection] = useState(policyData[0].id);
  const sectionRefs = useRef({});
  const FONT = "font-[Poppins,sans-serif]";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const el = sectionRefs.current[id];
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className={`min-h-[100dvh] text-[#111827] ${FONT} bg-[#F2F5F3]`}>
      <style>{DESIGN_SYSTEM_CSS}</style>

      <div
        className="relative z-0"
        style={{ animation: "pageFadeIn 0.4s var(--ease-premium) both" }}
      >
        <div className="pv-shell relative z-10">
          {/* ===== Header ===== */}
          <div className="pv-header flex justify-between items-center gap-[10px]">
            <div className="flex items-center gap-2.5 min-w-0">
              <Link
                to="/home"
                aria-label="Back to Home"
                className="pv-focusable w-[36px] h-[36px] rounded-[11px] bg-[#FCFDFC] border border-[#e5e7eb] text-[#16a34a] flex items-center justify-center no-underline shrink-0 transition-[transform,border-color] duration-200 hover:border-[#22c55e]/60 active:scale-90"
              >
                <ArrowLeft size={17} />
              </Link>
              <h1 className="pv-title font-extrabold bg-gradient-to-r from-[#16a34a] to-[#111827] bg-clip-text text-transparent m-0 tracking-tight truncate">
                Privacy Policy
              </h1>
            </div>
            <div className="pv-chip flex items-center gap-[5px] bg-[#dcfce7] border border-[#bbf7d0] px-[11px] py-[6px] rounded-full text-[#166534] font-bold whitespace-nowrap">
              <Shield size={11} /> Secure Platform
            </div>
          </div>

          {/* ===== Hero ===== */}
          <div
            className="pv-card pv-card-hi mb-[16px] text-center"
            style={{ animation: "cardIn 0.5s var(--ease-premium) both" }}
          >
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
            <h1 className="pv-hero-title font-extrabold tracking-tight m-0 mb-[10px] text-[#111827]">
              Privacy &amp; Data Protection
            </h1>
            <p className="pv-hero-desc text-[#6b7280] max-w-[640px] mx-auto mb-3">
              Your privacy, account security, and personal data protection
              matter to us. This policy explains how Earnzyro collects, stores,
              protects, and manages your information while you use our platform.
            </p>
            <span className="pv-chip inline-flex items-center gap-1.5 text-[#6b7280] bg-[#F6F9F6] border border-[#e5e7eb] px-3 py-[5px] rounded-full">
              🕒 Last updated:{" "}
              <strong className="text-[#16a34a] font-bold">
                {LAST_UPDATED}
              </strong>
            </span>
          </div>

          {/* ===== Trust Badges ===== */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-[10px] mb-[16px]">
            {trustBadges.map((b, i) => (
              <div
                key={i}
                className="pv-tile bg-[#FCFDFC] border border-[#e5e7eb] rounded-[14px] px-[10px] py-[14px] text-center transition-all duration-200 active:scale-[0.97]"
              >
                <span className="text-[18px] block mb-[6px]">{b.icon}</span>
                <span className="pv-chip text-[#374151] font-semibold">
                  {b.label}
                </span>
              </div>
            ))}
          </div>

          {/* ===== Layout: TOC + Content ===== */}
          <div className="pv-layout">
            {/* TOC */}
            <nav className="pv-toc" aria-label="Policy sections">
              {policyData.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`pv-toc-btn pv-toc-text ${FONT} ${
                    activeSection === item.id ? "pv-toc-btn-active" : ""
                  }`}
                  onClick={() => scrollToSection(item.id)}
                >
                  <span>{item.icon}</span>
                  <span>{item.title.replace(/^\d+\.\s*/, "")}</span>
                </button>
              ))}
            </nav>

            {/* Main Content Card */}
            <div
              className="pv-card"
              style={{
                animation: "cardIn 0.5s var(--ease-premium) both",
                animationDelay: "0.08s",
              }}
            >
              {/* Trust Box */}
              <div className="pv-trust-box mb-[22px]">
                <h2 className="pv-card-title font-extrabold m-0 mb-3 flex items-center gap-1.5 text-[#16a34a]">
                  <Sparkles size={14} /> Why Users Trust Earnzyro
                </h2>
                <ul className="pv-desc text-[#374151] m-0 pl-0 list-none space-y-[6px]">
                  <li>• Secure account systems and multi-step verification.</li>
                  <li>
                    • Continuous fraud monitoring and anti-spam protection.
                  </li>
                  <li>
                    • Transparent policies and fair platform usage guidelines.
                  </li>
                  <li>
                    • Fast, responsive support for account and withdrawal
                    issues.
                  </li>
                </ul>
              </div>

              {/* Policy Sections */}
              {policyData.map((item) => (
                <div
                  className="scroll-mt-24 mb-[18px] pb-[18px] border-b border-[#e5e7eb] last:border-b-0 last:mb-0 last:pb-0"
                  id={item.id}
                  key={item.id}
                  ref={(el) => (sectionRefs.current[item.id] = el)}
                >
                  <div className="flex items-center gap-2.5 mb-[10px]">
                    <span className="pv-section-icon">{item.icon}</span>
                    <h2 className="pv-sec-title font-extrabold m-0 text-[#111827]">
                      {item.title}
                    </h2>
                  </div>
                  <p className="pv-desc text-[#6b7280] m-0 pl-11">
                    {item.text}
                  </p>
                </div>
              ))}

              {/* User Safety Box */}
              <div className="pv-safety-box mt-[26px]">
                <h2 className="pv-card-title font-extrabold m-0 mb-3 flex items-center gap-1.5 text-[#16a34a]">
                  <Shield size={14} /> User Safety Guidelines
                </h2>
                <ul className="pv-desc text-[#374151] m-0 pl-0 list-none space-y-[6px]">
                  <li>• Never share your password or OTP with anyone.</li>
                  <li>
                    • Always use accurate payment and withdrawal information.
                  </li>
                  <li>
                    • Avoid fake referrals or spam activity that can flag your
                    account.
                  </li>
                  <li>
                    • Contact official Earnzyro support for any suspicious
                    activity.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ===== Support Card ===== */}
          <div
            className="pv-card mt-[16px] text-center"
            style={{
              animation: "cardIn 0.5s var(--ease-premium) both",
              animationDelay: "0.16s",
            }}
          >
            <h2 className="pv-card-title font-extrabold m-0 mb-[10px] text-[#16a34a] flex items-center justify-center gap-1.5">
              <AlertCircle size={14} /> Need Privacy Help?
            </h2>
            <p className="pv-desc text-[#6b7280] max-w-[560px] mx-auto m-0 mb-4">
              Contact our support team anytime for questions related to account
              security, privacy concerns, withdrawal verification, or platform
              safety.
            </p>
            <div className="flex justify-center gap-[10px] flex-wrap">
              <Link
                to="/support"
                className={`pv-btn-primary pv-btn-text no-underline font-extrabold inline-flex items-center justify-center gap-[6px] px-[22px] py-[11px] rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] text-white shadow-[0_6px_18px_rgba(34,197,94,0.28)] transition-transform duration-150 ${FONT}`}
              >
                Contact Support
              </Link>
              <Link
                to="/terms"
                className={`pv-btn-ghost pv-btn-text no-underline font-extrabold inline-flex items-center justify-center gap-[6px] px-[22px] py-[11px] rounded-full bg-[#F6F9F6] border border-[#e5e7eb] text-[#16a34a] transition-all duration-150 ${FONT}`}
              >
                <FileText size={14} /> Terms &amp; Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Privacy;

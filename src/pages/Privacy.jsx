import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import logo from "/logo.jpg.jpeg";

const LAST_UPDATED = "July 5, 2026";

const policyData = [
  {
    id: "introduction",
    icon: "👋",
    title: "1. Introduction",
    text: "TaskLumo values user privacy and is committed to protecting personal information. This Privacy Policy explains how we collect, store, manage, and protect user data while you use our platform and services. By using TaskLumo, you agree to the practices described below.",
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
    text: "TaskLumo may use cookies and analytics tools to improve website functionality, maintain user sessions, analyze traffic, personalize experiences, and strengthen our security systems.",
  },
  {
    id: "third-party-services",
    icon: "🔗",
    title: "5. Third-Party Services",
    text: "Some surveys, offers, advertisements, payment gateways, and promotional services available on TaskLumo may be managed by third-party partners. These services may have their own separate privacy policies and terms.",
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
    text: "TaskLumo does not sell personal user information. Limited information may only be shared with trusted partners, payment providers, or legal authorities when required for platform operations or legal compliance.",
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
    text: "TaskLumo services are not intended for children below the legal minimum age in their country or region. We do not knowingly collect personal data from underage users.",
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
    text: "Users may contact the TaskLumo support team regarding privacy concerns, account security, or policy questions using the official support system or support email.",
  },
];

const trustBadges = [
  { icon: "🔒", label: "Encrypted Data" },
  { icon: "🛡️", label: "Fraud Protection" },
  { icon: "⚡", label: "Safe Withdrawals" },
  { icon: "📄", label: "Transparent Policy" },
];

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
    <div
      className={`min-h-screen text-white ${FONT}
      bg-[radial-gradient(circle_at_top_left,rgba(255,140,0,0.18),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(250,204,21,0.10),transparent_30%),linear-gradient(135deg,#050505_0%,#0a0a0a_45%,#120909_100%)]`}
    >
      {/* TOPBAR */}
      <div className="sticky top-0 z-40 flex items-center justify-between gap-2.5 px-4 py-[14px] backdrop-blur-[14px] bg-[#050505]/[0.72] border-b border-[#facc15]/[0.08]">
        <Link
          to="/home"
          className="flex items-center gap-2.5 no-underline text-white"
        >
          <span className="text-[18px] font-bold w-8 h-8 flex items-center justify-center rounded-[10px] bg-white/5 border border-white/[0.08] shrink-0">
            ←
          </span>
          <span className="m-0 text-[18px] font-black tracking-[-0.02em] bg-gradient-to-r from-[#facc15] to-white bg-clip-text text-transparent">
            Privacy Policy
          </span>
        </Link>
        <div className="bg-[#facc15]/10 border border-[#facc15]/[0.18] px-3 py-[6px] rounded-full text-[10px] text-[#facc15] font-bold whitespace-nowrap">
          Secure Platform
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto px-4 pt-5 pb-[90px] sm:px-6 sm:pt-6 sm:pb-[100px]">
        {/* HERO */}
        <div className="text-center mb-[22px]">
          <div className="w-[76px] h-[76px] min-[960px]:w-24 min-[960px]:h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-[#facc15]/25 shadow-[0_0_22px_rgba(250,204,21,0.35)]">
            <img
              src={logo}
              alt="TaskLumo Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-[#facc15] text-[30px] sm:text-[36px] font-black tracking-[-0.02em] m-0 mb-[10px]">
            Privacy & Data Protection
          </h1>
          <p className="text-[#a1a1aa] text-[12.5px] sm:text-[13px] leading-[1.8] max-w-[640px] mx-auto mb-3">
            Your privacy, account security, and personal data protection matter
            to us. This policy explains how TaskLumo collects, stores, protects,
            and manages your information while you use our platform.
          </p>
          <span className="inline-flex items-center gap-1.5 text-[10.5px] text-[#71717a] bg-white/[0.03] border border-white/[0.06] px-3 py-[5px] rounded-full">
            🕒 Last updated:{" "}
            <strong className="text-[#d4d4d8] font-semibold">
              {LAST_UPDATED}
            </strong>
          </span>
        </div>

        {/* QUICK BADGES */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-[10px] my-[22px]">
          {trustBadges.map((b, i) => (
            <div
              className="bg-white/[0.03] border border-white/[0.06] rounded-[14px] px-[10px] py-[14px] text-center"
              key={i}
            >
              <span className="text-[18px] block mb-[6px]">{b.icon}</span>
              <span className="text-[10px] text-[#d4d4d8] font-semibold">
                {b.label}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 min-[960px]:grid-cols-[220px_1fr] gap-[22px] items-start">
          {/* TOC */}
          <nav
            className="flex min-[960px]:flex-col gap-2 overflow-x-auto min-[960px]:overflow-x-visible pb-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden min-[960px]:sticky min-[960px]:top-[88px]"
            aria-label="Policy sections"
          >
            {policyData.map((item) => (
              <button
                key={item.id}
                className={`shrink-0 min-[960px]:w-full flex items-center gap-1.5 px-[14px] py-2 rounded-full text-[11px] font-semibold cursor-pointer whitespace-nowrap transition-all duration-200 ${
                  activeSection === item.id
                    ? "text-[#050505] bg-gradient-to-br from-[#facc15] to-[#eab308] border-transparent"
                    : "text-[#a1a1aa] bg-white/[0.03] border border-white/[0.06]"
                }`}
                onClick={() => scrollToSection(item.id)}
                type="button"
              >
                <span>{item.icon}</span>
                <span>{item.title.replace(/^\d+\.\s*/, "")}</span>
              </button>
            ))}
          </nav>

          {/* MAIN CARD */}
          <div className="bg-[#111111]/[0.92] border border-[#facc15]/[0.08] rounded-[22px] p-[18px] sm:p-[26px] shadow-[0_0_22px_rgba(250,204,21,0.05)]">
            {/* TRUST BOX */}
            <div className="rounded-2xl p-[18px] mb-[22px] bg-gradient-to-br from-[#facc15]/[0.08] to-white/[0.02] border border-[#facc15]/[0.08]">
              <h2 className="text-[#facc15] text-[17px] font-extrabold m-0 mb-3">
                Why Users Trust TaskLumo
              </h2>
              <div>
                <div className="mb-[10px]">
                  <p className="text-[#d4d4d8] text-[11px] leading-[1.9] m-0">
                    • Secure account systems and multi-step verification.
                  </p>
                </div>
                <div className="mb-[10px]">
                  <p className="text-[#d4d4d8] text-[11px] leading-[1.9] m-0">
                    • Continuous fraud monitoring and anti-spam protection.
                  </p>
                </div>
                <div className="mb-[10px]">
                  <p className="text-[#d4d4d8] text-[11px] leading-[1.9] m-0">
                    • Transparent policies and fair platform usage guidelines.
                  </p>
                </div>
                <div className="mb-0">
                  <p className="text-[#d4d4d8] text-[11px] leading-[1.9] m-0">
                    • Fast, responsive support for account and withdrawal
                    issues.
                  </p>
                </div>
              </div>
            </div>

            {/* POLICY SECTIONS */}
            {policyData.map((item) => (
              <div
                className="scroll-mt-24 mb-5 pb-[18px] border-b border-white/5 last:border-b-0 last:mb-0 last:pb-0"
                id={item.id}
                key={item.id}
                ref={(el) => (sectionRefs.current[item.id] = el)}
              >
                <div className="flex items-center gap-2.5 mb-[10px]">
                  <span className="w-[34px] h-[34px] shrink-0 flex items-center justify-center text-[15px] rounded-[10px] bg-[#facc15]/[0.08] border border-[#facc15]/[0.15]">
                    {item.icon}
                  </span>
                  <h2 className="text-[#facc15] text-[16px] font-extrabold m-0">
                    {item.title}
                  </h2>
                </div>
                <p className="text-[#d4d4d8] text-[11.5px] sm:text-[12.5px] leading-[1.9] m-0 pl-11">
                  {item.text}
                </p>
              </div>
            ))}

            {/* USER SAFETY BOX */}
            <div className="rounded-2xl p-[18px] mt-[26px] bg-white/[0.03] border border-white/[0.06]">
              <h2 className="text-[#facc15] text-[17px] font-extrabold m-0 mb-3">
                User Safety Guidelines
              </h2>
              <div>
                <div className="mb-[10px]">
                  <p className="text-[#d4d4d8] text-[11px] leading-[1.9] m-0">
                    • Never share your password or OTP with anyone.
                  </p>
                </div>
                <div className="mb-[10px]">
                  <p className="text-[#d4d4d8] text-[11px] leading-[1.9] m-0">
                    • Always use accurate payment and withdrawal information.
                  </p>
                </div>
                <div className="mb-[10px]">
                  <p className="text-[#d4d4d8] text-[11px] leading-[1.9] m-0">
                    • Avoid fake referrals or spam activity that can flag your
                    account.
                  </p>
                </div>
                <div className="mb-0">
                  <p className="text-[#d4d4d8] text-[11px] leading-[1.9] m-0">
                    • Contact official TaskLumo support for any suspicious
                    activity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SUPPORT CARD */}
        <div className="bg-gradient-to-br from-[#facc15]/10 to-white/[0.03] border border-[#facc15]/[0.08] rounded-[20px] px-4 py-[22px] mt-5 text-center">
          <h2 className="text-[#facc15] text-[22px] font-black m-0 mb-[10px]">
            Need Privacy Help?
          </h2>
          <p className="text-[#d4d4d8] text-[11px] leading-[1.8] max-w-[560px] mx-auto">
            Contact our support team anytime for questions related to account
            security, privacy concerns, withdrawal verification, or platform
            safety.
          </p>
          <div className="flex justify-center gap-[10px] flex-wrap mt-[18px]">
            <Link
              to="/support"
              className="px-[22px] py-[11px] rounded-xl no-underline font-bold text-[11px] bg-gradient-to-br from-[#facc15] to-[#eab308] text-black"
            >
              Contact Support
            </Link>
            <Link
              to="/terms"
              className="px-[22px] py-[11px] rounded-xl no-underline font-bold text-[11px] bg-white/[0.04] border border-white/[0.08] text-white"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Privacy;

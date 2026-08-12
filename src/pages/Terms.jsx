import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "/logo.jpg.jpeg";

function Terms() {
  const [openIndex, setOpenIndex] = useState(null);
  const FONT = "font-[Poppins,-apple-system,sans-serif]";
  const GOLD = "#f5c451";
  const HAIRLINE = "rgba(245,196,81,0.14)";

  const termsData = [
    {
      title: "1. Acceptance of Terms",
      text: "By accessing or using TaskNiri, users agree to comply with all platform rules, policies, guidelines, and applicable laws. Continued use of the platform indicates acceptance of these Terms & Conditions.",
    },
    {
      title: "2. User Eligibility",
      text: "Users must meet the minimum legal age requirement in their country or region before creating an account or participating in any platform activities available on TaskLumo.",
    },
    {
      title: "3. Account Responsibility",
      text: "Users are responsible for maintaining account security, protecting passwords, and ensuring that all account information provided is accurate, updated, and genuine.",
    },
    {
      title: "4. Rewards & Earnings",
      text: "TaskNiri provides reward opportunities through tasks, surveys, advertisements, referrals, and promotional activities. Rewards may vary depending on offer availability, advertiser verification, and platform policies.",
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
      text: "Users may invite others using referral links. Referral rewards may only be granted for genuine users and valid activity completed according to TaskLumo referral policies.",
    },
    {
      title: "8. Third-Party Services",
      text: "Some tasks, surveys, advertisements, and promotional offers may be managed by third-party providers. TaskLumo is not directly responsible for third-party platform availability or advertiser decisions.",
    },
    {
      title: "9. Platform Availability",
      text: "We work continuously to maintain platform stability and performance. However, TaskNiri does not guarantee uninterrupted availability due to maintenance, technical updates, or external service interruptions.",
    },
    {
      title: "10. Account Suspension",
      text: "TaskNiri reserves the right to temporarily suspend or permanently terminate accounts involved in suspicious, fraudulent, abusive, or policy-violating activities without prior notice.",
    },
    {
      title: "11. Intellectual Property",
      text: "All TaskNiri branding, logos, designs, platform content, graphics, and system elements remain the property of TaskLumo and may not be copied or reused without authorization.",
    },
    {
      title: "12. Changes to Terms",
      text: "TaskNiri may modify or update these Terms & Conditions at any time to improve platform functionality, security, legal compliance, or operational policies.",
    },
    {
      title: "13. Limitation of Liability",
      text: "TaskNiri is not responsible for losses, delays, third-party service issues, advertiser actions, internet interruptions, or technical problems beyond platform control.",
    },
    {
      title: "14. Contact & Support",
      text: "Users may contact the official TaskNiri support team for assistance related to account issues, withdrawals, rewards, platform guidance, or policy-related questions.",
    },
  ];

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      className={`min-h-screen w-full box-border p-4 pb-[100px] sm:p-6 lg:p-8 text-white ${FONT}
      bg-[radial-gradient(circle_at_15%_0%,rgba(245,196,81,0.14),transparent_32%),radial-gradient(circle_at_100%_100%,rgba(245,196,81,0.07),transparent_35%),linear-gradient(160deg,#050505_0%,#0a0a0b_45%,#100c06_100%)]`}
    >
      {/* TOPBAR */}
      <div className="flex justify-between items-center mb-5 gap-2.5">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/home"
            aria-label="Go back"
            className="inline-flex items-center justify-center w-[34px] h-[34px] rounded-[10px] text-[#f5c451] no-underline text-[18px] font-bold bg-[#f5c451]/[0.08] border border-[#f5c451]/[0.14] shrink-0 transition-all duration-200 hover:bg-[#f5c451]/[0.16] hover:-translate-x-0.5"
          >
            ←
          </Link>
          <h1 className="m-0 text-[19px] sm:text-[24px] font-extrabold tracking-[-0.02em] bg-gradient-to-r from-white to-[#f5c451] bg-clip-text text-transparent whitespace-nowrap overflow-hidden text-ellipsis">
            Terms & Conditions
          </h1>
        </div>
        <div className="bg-[#f5c451]/10 border border-[#f5c451]/[0.14] px-[10px] py-[6px] sm:px-3 sm:py-[7px] rounded-[20px] text-[9px] sm:text-[10px] text-[#f5c451] font-bold tracking-[0.04em] whitespace-nowrap shrink-0">
          Last Updated 2026
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="bg-gradient-to-b from-[rgba(20,18,14,0.9)] to-[rgba(12,11,9,0.94)] border border-[#f5c451]/[0.14] rounded-[20px] sm:rounded-[24px] p-4 py-5 sm:px-[26px] sm:py-7 lg:px-11 lg:py-9 backdrop-blur-[18px] shadow-[0_0_40px_rgba(245,196,81,0.05),inset_0_1px_0_rgba(255,255,255,0.03)] lg:max-w-[900px] lg:mx-auto">
        {/* HERO */}
        <div className="text-center mb-[22px]">
          <img
            src={logo}
            alt="TaskNiri Logo"
            className="w-16 h-16 sm:w-[84px] sm:h-[84px] rounded-full object-cover border-2 border-[#f5c451]/[0.35] shadow-[0_0_28px_rgba(245,196,81,0.4)] mb-[14px] mx-auto"
          />
          <h2 className="text-[#f5c451] text-[26px] sm:text-[34px] lg:text-[40px] font-black tracking-[-0.02em] m-0 mb-[10px]">
            Terms & Conditions
          </h2>
          <p className="text-[#a8a8b3] text-[12px] sm:text-[12.5px] leading-[1.9] max-w-[640px] mx-auto">
            Please read these Terms & Conditions carefully before using TaskNiri
            services. These terms explain platform rules, account
            responsibilities, reward systems, security policies, and acceptable
            platform usage guidelines.
          </p>
        </div>

        {/* QUICK INFO CHIPS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-[10px] mb-[22px]">
          {[
            "⚡ Fair Usage",
            "🔒 Secure Platform",
            "🛡️ Anti Fraud",
            "📄 Transparent Rules",
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-2 py-3 sm:px-[10px] text-center text-[10.5px] sm:text-[11px] text-[#e4e4e9] font-semibold transition-all duration-200 hover:border-[#f5c451]/[0.14] hover:bg-[#f5c451]/5"
            >
              {item}
            </div>
          ))}
        </div>

        {/* IMPORTANT NOTICE */}
        <div className="bg-gradient-to-br from-[#f5c451]/[0.09] to-white/[0.02] border border-[#f5c451]/[0.14] border-l-[3px] border-l-[#f5c451] rounded-2xl p-4 sm:p-5 mb-[22px]">
          <h2 className="text-[#f5c451] text-[15px] sm:text-[18px] m-0 mb-[10px] font-extrabold">
            Important User Notice
          </h2>
          <ul className="m-0 p-0 list-none">
            {[
              "Users must follow all platform rules and community guidelines.",
              "Fake activity, spam behavior, or fraudulent usage is strictly prohibited.",
              "Rewards and withdrawals are subject to verification and advertiser approval systems.",
              "Continued use of TaskNiri indicates agreement with all platform policies and terms.",
            ].map((li, i) => (
              <li
                key={i}
                className="text-[#d6d6dc] text-[11px] sm:text-[12px] leading-[1.9] pl-4 relative mb-2 last:mb-0 before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-[5px] before:h-[5px] before:rounded-full before:bg-[#f5c451]"
              >
                {li}
              </li>
            ))}
          </ul>
        </div>

        {/* TERMS ACCORDION */}
        <div className="flex items-center gap-2.5 mt-[26px] mb-3">
          <span className="text-[10px] tracking-[0.14em] text-[#a8a8b3] uppercase font-bold whitespace-nowrap">
            Full Terms
          </span>
          <span className="flex-1 h-px bg-gradient-to-r from-[#f5c451]/[0.14] to-transparent" />
        </div>
        <div className="flex flex-col gap-2">
          {termsData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`border rounded-2xl overflow-hidden transition-colors duration-200 ${
                  isOpen
                    ? "border-[#f5c451]/[0.14] bg-[#f5c451]/[0.03]"
                    : "border-white/[0.06] bg-white/[0.015]"
                }`}
              >
                <div
                  className="flex items-center justify-between gap-2.5 px-4 py-[14px] cursor-pointer select-none [-webkit-tap-highlight-color:transparent]"
                  onClick={() => toggle(index)}
                >
                  <span
                    className={`text-[12.5px] sm:text-[14px] font-bold tracking-[-0.01em] ${
                      isOpen ? "text-[#f5c451]" : "text-[#f2f2f4]"
                    }`}
                  >
                    {item.title}
                  </span>
                  <span
                    className={`shrink-0 w-[22px] h-[22px] rounded-full bg-[#f5c451]/[0.08] flex items-center justify-center text-[#f5c451] text-[12px] font-bold transition-transform duration-[250ms] ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </div>
                <div
                  className={`overflow-hidden transition-[max-height,padding] duration-300 px-4 ${
                    isOpen ? "max-h-[300px] pb-4" : "max-h-0"
                  }`}
                >
                  <p className="text-[#d6d6dc] text-[11.5px] sm:text-[12.5px] leading-[1.9] m-0">
                    {item.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* COMMUNITY GUIDELINES */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 sm:p-5 mt-6">
          <h2 className="text-[#f5c451] text-[15px] sm:text-[18px] m-0 mb-3 font-extrabold">
            Community Guidelines
          </h2>
          <ul className="m-0 p-0 list-none">
            {[
              "Respect platform rules and maintain fair usage behavior.",
              "Avoid misleading, harmful, or abusive activities.",
              "Use only genuine account information and payment details.",
              "Report suspicious activity to the official support team.",
            ].map((li, i) => (
              <li
                key={i}
                className="text-[#d6d6dc] text-[11px] sm:text-[12px] leading-[1.9] pl-4 relative mb-2 last:mb-0 before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-[5px] before:h-[5px] before:rounded-full before:bg-[#f5c451]"
              >
                {li}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* SUPPORT CARD */}
      <div className="bg-gradient-to-br from-[#f5c451]/10 to-white/[0.03] border border-[#f5c451]/[0.14] rounded-[18px] px-4 py-[22px] sm:px-6 sm:py-7 mt-[18px] lg:mt-5 lg:max-w-[900px] lg:mx-auto text-center backdrop-blur-[14px]">
        <h2 className="text-[#f5c451] text-[20px] sm:text-[26px] m-0 mb-[10px] font-black">
          Need Assistance?
        </h2>
        <p className="text-[#d6d6dc] text-[11px] sm:text-[12px] leading-[1.85] max-w-[560px] mx-auto">
          Contact our support team for questions related to platform policies,
          rewards, withdrawals, verification, or account issues.
        </p>
        <div className="flex justify-center gap-[10px] flex-wrap mt-[18px]">
          <Link
            to="/support"
            className="px-5 py-[11px] rounded-xl no-underline font-bold text-[11px] bg-gradient-to-br from-[#f5c451] to-[#d99e1f] text-black shadow-[0_4px_18px_rgba(245,196,81,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(245,196,81,0.35)]"
          >
            Contact Support
          </Link>
          <Link
            to="/privacy"
            className="px-5 py-[11px] rounded-xl no-underline font-bold text-[11px] bg-white/[0.04] border border-white/10 text-white transition-all duration-200 hover:bg-white/[0.08] hover:-translate-y-0.5"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Terms;

import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft,
  MessageCircle,
  Info,
  HelpCircle,
  ChevronDown,
  Mail,
  Sparkles,
  Shield,
} from "lucide-react";

const FAQ_DATA = [
  {
    question: "How do I get free coins on Earnzyro?",
    answer:
      "You can earn coins by completing tasks, surveys, and app installs from your Tasks page. Use these coins to withdraw real cash. You can also earn coins by inviting your friends to try Earnzyro.",
  },
  {
    question: "How do I invite my friends and earn coins?",
    answer:
      "Invite your friends and earn coins by: a) Going to the Invite & Earn section and sharing your exclusive referral link with friends. b) Earning more coins by sharing on WhatsApp, Facebook, and other social apps. When your friends join and complete a task, you start earning coins which convert into real cash.",
  },
  {
    question: "I invited my friends but don't see any increase in coins, why?",
    answer:
      "You can earn coins by inviting friends, just make sure: a) Your friends install Earnzyro from your exclusive invite link only. b) Your friends complete at least one task successfully from Earnzyro. The amount of coins for the invite program may change from time to time.",
  },
  {
    question: "I did not get my withdrawal, why?",
    answer:
      "Usually all withdrawals are processed within 24-48 hours. In case of a delay, the amount stays safe in your wallet and our team will process it as soon as verification is complete. Don't worry, your earnings are always safe.",
  },
  {
    question: "What is a Promo Code and how can I use it?",
    answer:
      "A Promo Code is an optional code used at the time of registration. It provides special bonus coins and can be used by new users only.",
  },
  {
    question: "How do I know my referral link and how can I use it?",
    answer:
      "Every user has a unique referral link with which they can invite others to join Earnzyro and earn extra coin rewards. You can find your referral link on the Invite & Earn page, and share it directly via WhatsApp, Facebook, or by copying the link.",
  },
  {
    question:
      "Where can I see the result of a running contest or streak bonus?",
    answer:
      "Streak and contest rewards are automatically credited by our system. Results are usually updated the next working day, and you'll be notified inside the app once your bonus is credited.",
  },
  {
    question: "Why was my task not approved?",
    answer:
      "Tasks may be rejected if instructions were not completed fully or if our ad partner could not verify completion. Contact support with the task name and your UID for a manual review.",
  },
  {
    question: "Is Earnzyro free to use?",
    answer:
      "Yes, Earnzyro is completely free to use with no joining fee, subscription, or investment required at any step.",
  },
  {
    question: "How can I contact support?",
    answer:
      "You can chat with our support assistant or raise a formal ticket anytime from the Support page. Our team is active 24/7 and typically responds within 24-48 hours.",
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

  .faq-shell {
    max-width: 1180px;
    margin: 0 auto;
    padding-left: clamp(16px, 4vw, 40px);
    padding-right: clamp(16px, 4vw, 40px);
    padding-bottom: clamp(80px, 10vh, 100px);
    padding-top: 0;
  }

  .faq-header {
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

  .faq-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: clamp(14px, 1.8vw, 22px);
    box-shadow: 0 1px 3px rgba(17, 24, 39, 0.04);
    transition: transform 0.35s var(--ease-premium), box-shadow 0.35s var(--ease-premium), border-color 0.35s var(--ease-premium);
  }
  @media (hover: hover) {
    .faq-card:hover {
      box-shadow: 0 10px 28px rgba(34, 197, 94, 0.10);
      border-color: rgba(34, 197, 94, 0.35);
    }
    .faq-btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(34, 197, 94, 0.32);
    }
    .faq-btn-ghost:hover {
      border-color: rgba(34, 197, 94, 0.45);
      color: var(--brand);
    }
  }
  .faq-btn-primary:active,
  .faq-btn-ghost:active { transform: scale(0.94); }
  .faq-focusable:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }

  .faq-title      { font-size: clamp(20px, 1.2vw + 16px, 28px); }
  .faq-hero-title { font-size: clamp(22px, 2vw + 12px, 30px); }
  .faq-q-title    { font-size: clamp(12.5px, 0.4vw + 10.5px, 14.5px); }
  .faq-desc       { font-size: clamp(10.5px, 0.3vw + 9px, 12px); line-height: 1.6; }
  .faq-btn-text   { font-size: clamp(10.5px, 0.3vw + 9.5px, 12px); }
  .faq-chip       { font-size: clamp(9.5px, 0.3vw + 8.5px, 11px); }
  .faq-tab        { font-size: clamp(10px, 0.3vw + 9px, 11.5px); letter-spacing: 0.4px; }
`;

function Faq() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("faq");
  const [openFaq, setOpenFaq] = useState(null);
  const FONT = "font-[Poppins,sans-serif]";

  const supportEmail = "wecare@earnzyro.work";

  return (
    <div className={`min-h-[100dvh] text-[#111827] ${FONT} bg-[#F2F5F3]`}>
      <style>{DESIGN_SYSTEM_CSS}</style>

      <div
        className="relative z-0"
        style={{ animation: "pageFadeIn 0.4s var(--ease-premium) both" }}
      >
        <div className="faq-shell relative z-10">
          {/* ===== Header ===== */}
          <div className="faq-header flex justify-between items-center gap-[10px]">
            <div className="flex items-center gap-2.5 min-w-0">
              <Link
                to="/home"
                aria-label="Back to Home"
                className="faq-focusable w-[36px] h-[36px] rounded-[11px] bg-[#FCFDFC] border border-[#e5e7eb] text-[#16a34a] flex items-center justify-center no-underline shrink-0 transition-[transform,border-color] duration-200 hover:border-[#22c55e]/60 active:scale-90"
              >
                <ArrowLeft size={17} />
              </Link>
              <h1 className="faq-title font-extrabold bg-gradient-to-r from-[#16a34a] to-[#111827] bg-clip-text text-transparent m-0 tracking-tight truncate">
                FAQ's
              </h1>
            </div>
            <div className="faq-chip flex items-center gap-[5px] bg-[#dcfce7] border border-[#bbf7d0] px-[11px] py-[6px] rounded-full text-[#166534] font-bold whitespace-nowrap">
              <HelpCircle size={11} /> Help Center
            </div>
          </div>

          {/* ===== Tabs ===== */}
          <div className="flex gap-[22px] border-b border-[#e5e7eb] mb-[16px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Link to="/terms" className="no-underline">
              <button
                onClick={() => setActiveTab("terms")}
                className={`faq-tab bg-transparent border-none pb-3 font-bold cursor-pointer whitespace-nowrap border-b-2 transition-colors duration-200 ${FONT} ${
                  activeTab === "terms"
                    ? "text-[#16a34a] border-b-[#16a34a]"
                    : "text-[#6b7280] border-b-transparent"
                }`}
              >
                TERMS &amp; CONDITIONS
              </button>
            </Link>
            <Link to="/privacy" className="no-underline">
              <button
                onClick={() => setActiveTab("privacy")}
                className={`faq-tab bg-transparent border-none pb-3 font-bold cursor-pointer whitespace-nowrap border-b-2 transition-colors duration-200 ${FONT} ${
                  activeTab === "privacy"
                    ? "text-[#16a34a] border-b-[#16a34a]"
                    : "text-[#6b7280] border-b-transparent"
                }`}
              >
                PRIVACY POLICY
              </button>
            </Link>
            <button
              onClick={() => setActiveTab("faq")}
              className={`faq-tab bg-transparent border-none pb-3 font-bold cursor-pointer whitespace-nowrap border-b-2 transition-colors duration-200 ${FONT} ${
                activeTab === "faq"
                  ? "text-[#16a34a] border-b-[#16a34a]"
                  : "text-[#6b7280] border-b-transparent"
              }`}
            >
              FAQ'S
            </button>
          </div>

          {/* ===== FAQ Card ===== */}
          <div
            className="faq-card faq-card-hi mb-[16px]"
            style={{
              animation: "cardIn 0.5s var(--ease-premium) both",
            }}
          >
            <div className="text-center mb-[20px]">
              <div className="w-[60px] h-[60px] rounded-full mx-auto mb-3 flex items-center justify-center bg-[#dcfce7] border border-[#bbf7d0] shadow-[0_4px_20px_rgba(34,197,94,0.22)]">
                <HelpCircle size={26} className="text-[#16a34a]" />
              </div>
              <h2 className="faq-hero-title font-extrabold m-0 mb-[8px] text-[#111827]">
                FAQ's
              </h2>
              <p className="faq-desc text-[#6b7280] m-0 max-w-[560px] mx-auto">
                Hey, we tried to answer all your queries below. In case you need
                any assistance at any point of time, please write to us at{" "}
                <span className="text-[#16a34a] font-bold">{supportEmail}</span>
              </p>
            </div>

            <div>
              {FAQ_DATA.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    className="mb-[10px] pb-[10px] border-b border-[#e5e7eb] last:mb-0 last:pb-0 last:border-b-0"
                    key={index}
                  >
                    <button
                      className={`w-full bg-transparent border-none text-left ${FONT} flex items-start justify-between gap-3 cursor-pointer py-1 px-0`}
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                    >
                      <span className="faq-q-title font-extrabold leading-[1.45] text-[#111827]">
                        <span className="text-[#16a34a]">{index + 1}.</span>{" "}
                        {faq.question}
                      </span>
                      <ChevronDown
                        size={15}
                        className={`text-[#16a34a] shrink-0 mt-0.5 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="faq-desc text-[#6b7280] px-0 pt-1.5 pb-1.5 m-0 animate-[fadeIn_0.25s_ease]">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ===== Still Need Help ===== */}
          <div
            className="faq-card mb-0 text-center"
            style={{
              animation: "cardIn 0.5s var(--ease-premium) both",
              animationDelay: "0.08s",
            }}
          >
            <h2 className="faq-q-title font-extrabold m-0 mb-2 text-[#111827] flex items-center justify-center gap-1.5">
              <Sparkles size={14} className="text-[#16a34a]" /> Still need help?
            </h2>
            <p className="faq-desc text-[#6b7280] m-0 mb-4 max-w-[460px] mx-auto">
              Contact our support team anytime for issues related to your
              account, rewards, or withdrawals.
            </p>
            <div className="flex justify-center gap-[10px] flex-wrap">
              <Link
                to="/support"
                className={`faq-btn-primary faq-btn-text no-underline font-extrabold inline-flex items-center justify-center gap-[6px] px-[18px] py-[11px] rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] text-white shadow-[0_6px_18px_rgba(34,197,94,0.28)] transition-transform duration-150 ${FONT}`}
              >
                <MessageCircle size={14} /> Contact support
              </Link>
              <Link
                to="/about"
                className={`faq-btn-ghost faq-btn-text no-underline font-extrabold inline-flex items-center justify-center gap-[6px] px-[18px] py-[11px] rounded-full bg-[#F6F9F6] border border-[#e5e7eb] text-[#16a34a] transition-all duration-150 ${FONT}`}
              >
                <Info size={14} /> About platform
              </Link>
            </div>
          </div>

          {/* ===== Footer note ===== */}
          <div className="flex items-center justify-center gap-1.5 mt-4 text-[#9ca3af] faq-chip">
            <Shield size={11} /> Your data is safe with us
          </div>
        </div>
      </div>
    </div>
  );
}

export default Faq;

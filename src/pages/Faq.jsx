import { Link } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, MessageCircle, Info } from "lucide-react";

function Faq() {
  const [activeTab, setActiveTab] = useState("faq");
  const FONT = "font-[Poppins,sans-serif]";

  const faqData = [
    {
      question: "How do I get free coins on TaskLumo?",
      answer:
        "You can earn coins by completing tasks, surveys, and app installs from your Tasks page. Use these coins to withdraw real cash. You can also earn coins by inviting your friends to try TaskLumo.",
    },
    {
      question: "How do I invite my friends and earn coins?",
      answer:
        "Invite your friends and earn coins by: a) Going to the Invite & Earn section and sharing your exclusive referral link with friends. b) Earning more coins by sharing on WhatsApp, Facebook, and other social apps. When your friends join and complete a task, you start earning coins which convert into real cash.",
    },
    {
      question:
        "I invited my friends but don't see any increase in coins, why?",
      answer:
        "You can earn coins by inviting friends, just make sure: a) Your friends install TaskLumo from your exclusive invite link only. b) Your friends complete at least one task successfully from TaskLumo. The amount of coins for the invite program may change from time to time.",
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
        "Every user has a unique referral link with which they can invite others to join TaskLumo and earn extra coin rewards. You can find your referral link on the Invite & Earn page, and share it directly via WhatsApp, Facebook, or by copying the link.",
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
      question: "Is TaskLumo free to use?",
      answer:
        "Yes, TaskLumo is completely free to use with no joining fee, subscription, or investment required at any step.",
    },
    {
      question: "How can I contact support?",
      answer:
        "You can chat with our support assistant or raise a formal ticket anytime from the Support page. Our team is active 24/7 and typically responds within 24-48 hours.",
    },
  ];

  return (
    <div
      className={`min-h-screen p-4 pb-10 sm:p-6 text-white ${FONT}
      bg-[radial-gradient(circle_at_bottom_left,rgba(255,120,40,0.35),transparent_35%),radial-gradient(circle_at_top_right,rgba(255,140,0,0.22),transparent_28%),linear-gradient(135deg,#050505_0%,#0a0a0a_40%,#120909_100%)]`}
    >
      <div className="flex items-center gap-2.5 mb-4">
        <Link
          to="/home"
          className="w-[34px] h-[34px] rounded-[10px] bg-[#111111]/90 border border-[#facc15]/[0.14] text-white flex items-center justify-center no-underline shrink-0"
        >
          <ArrowLeft size={17} />
        </Link>
        <h1 className="m-0 text-[20px] font-extrabold text-white">FAQ's</h1>
      </div>

      <div className="flex gap-[22px] border-b border-white/[0.08] mb-[18px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Link to="/terms" className="no-underline">
          <button
            className={`bg-transparent border-none pb-3 text-[11px] font-bold tracking-[0.4px] cursor-pointer whitespace-nowrap border-b-2 ${FONT} ${
              activeTab === "terms"
                ? "text-[#facc15] border-b-[#facc15]"
                : "text-[#a1a1aa] border-b-transparent"
            }`}
            onClick={() => setActiveTab("terms")}
          >
            TERMS &amp; CONDITIONS
          </button>
        </Link>
        <Link to="/privacy" className="no-underline">
          <button
            className={`bg-transparent border-none pb-3 text-[11px] font-bold tracking-[0.4px] cursor-pointer whitespace-nowrap border-b-2 ${FONT} ${
              activeTab === "privacy"
                ? "text-[#facc15] border-b-[#facc15]"
                : "text-[#a1a1aa] border-b-transparent"
            }`}
            onClick={() => setActiveTab("privacy")}
          >
            PRIVACY POLICY
          </button>
        </Link>
        <button
          className={`bg-transparent border-none pb-3 text-[11px] font-bold tracking-[0.4px] cursor-pointer whitespace-nowrap border-b-2 ${FONT} ${
            activeTab === "faq"
              ? "text-[#facc15] border-b-[#facc15]"
              : "text-[#a1a1aa] border-b-transparent"
          }`}
          onClick={() => setActiveTab("faq")}
        >
          FAQ'S
        </button>
      </div>

      <div className="bg-[#111111]/[0.92] border border-[#facc15]/[0.08] rounded-[18px] px-[18px] py-[22px] sm:px-[34px] sm:py-[30px] backdrop-blur-[16px] shadow-[0_0_18px_rgba(250,204,21,0.05)]">
        <h2 className="text-center text-[#facc15] text-[22px] sm:text-[26px] max-[359px]:text-[19px] font-extrabold m-0 mb-[14px]">
          FAQ'S
        </h2>
        <p className="text-[#d4d4d8] text-[11.5px] leading-[21px] m-0 mb-[22px] text-center">
          Hey, we tried to answer all your queries below. In case you need any
          assistance at any point of time, please write to us at{" "}
          <span className="text-[#facc15] font-bold">wecare@tasklumo.work</span>
        </p>

        {faqData.map((faq, index) => (
          <div
            className="mb-5 pb-[18px] border-b border-white/[0.06] last:mb-0 last:pb-0 last:border-b-0"
            key={index}
          >
            <h3 className="text-[#facc15] text-[13.5px] sm:text-[15px] max-[359px]:text-[12.5px] font-extrabold m-0 mb-2 leading-5">
              {index + 1}. {faq.question}
            </h3>
            <p className="text-[#d4d4d8] text-[11.5px] sm:text-[12.5px] leading-[21px] m-0">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-[#111111]/[0.88] border border-[#facc15]/10 rounded-[18px] px-[18px] py-5 mt-4 text-center">
        <h2 className="text-white text-[15px] m-0 mb-2 font-bold">
          Still need help?
        </h2>
        <p className="text-[#a1a1aa] text-[11px] leading-[18px] m-0 mb-4">
          Contact our support team anytime for issues related to your account,
          rewards, or withdrawals.
        </p>
        <div className="flex justify-center gap-[10px] flex-wrap">
          <Link
            to="/support"
            className="px-[18px] py-[10px] rounded-[10px] no-underline font-bold text-[10.5px] inline-flex items-center gap-[6px] bg-gradient-to-br from-[#facc15] to-[#eab308] text-black"
          >
            <MessageCircle size={13} /> Contact support
          </Link>
          <Link
            to="/about"
            className="px-[18px] py-[10px] rounded-[10px] no-underline font-bold text-[10.5px] inline-flex items-center gap-[6px] bg-white/[0.04] border border-white/[0.08] text-white"
          >
            <Info size={13} /> About platform
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Faq;

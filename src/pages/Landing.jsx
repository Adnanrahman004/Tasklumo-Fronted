import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Zap,
  Wallet,
  Gift,
  ClipboardCheck,
  Flame,
  LogIn,
  ArrowRight,
  Lock,
  BadgeCheck,
  Share2,
  ChevronDown,
} from "lucide-react";
import logo from "/logo.jpg.jpeg";

function Landing() {
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    // 1. Loader Timer
    const timer = setTimeout(() => setLoading(false), 2500);

    // 2. Scroll Progress Tracker
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll) * 100);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Native Share Function
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Earnzyro - Free Task Earning",
          text: "Join Earnzyro and start earning real money by completing simple tasks!",
          url: window.location.origin,
        });
      } catch (error) {
        console.log("Error sharing", error);
      }
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };

  // Fully Fluid Design Classes
  const card =
    "relative w-full min-w-0 bg-white border border-[#e5e7eb] rounded-2xl p-[clamp(14px,2vw,20px)] shadow-[0_1px_3px_rgba(17,24,39,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#86efac] hover:shadow-[0_10px_28px_rgba(34,197,94,0.16)]";
  const title =
    "text-[clamp(13px,0.4vw+11px,15px)] font-extrabold mt-2.5 mb-1 text-[#111827] break-words";
  const text =
    "text-[#6b7280] text-[clamp(11px,0.3vw+9px,13px)] leading-[1.45] break-words";
  const footerLink =
    "inline-flex items-center justify-center min-h-[38px] px-1.5 text-[#6b7280] no-underline text-[clamp(11px,0.3vw+10px,13px)] font-semibold transition-colors duration-150 hover:text-[#16a34a] whitespace-nowrap touch-manipulation";
  const iconBadge =
    "w-[clamp(32px,2.6vw,38px)] h-[clamp(32px,2.6vw,38px)] rounded-[10px] bg-[#dcfce7] text-[#16a34a] flex items-center justify-center shrink-0";

  const STEPS = [
    {
      n: "01",
      t: "Create your account",
      d: "Sign up free in under a minute with just your email and phone number.",
    },
    {
      n: "02",
      t: "Complete simple tasks",
      d: "Pick from surveys, app installs, games, and daily offers to earn coins.",
    },
    {
      n: "03",
      t: "Withdraw real money",
      d: "Cash out instantly to your UPI or bank account once you hit ₹100.",
    },
  ];

  const TRUST_STRIP = [
    { icon: ShieldCheck, label: "Bank-grade secure" },
    { icon: Lock, label: "Encrypted payouts" },
    { icon: BadgeCheck, label: "Verified partners" },
  ];

  const FAQS = [
    {
      q: "How do I earn money on Earnzyro?",
      a: "You can earn by completing simple tasks, installing apps, participating in surveys, and claiming your daily login bonus.",
    },
    {
      q: "What is the minimum withdrawal amount?",
      a: "The minimum withdrawal amount is just ₹100. You can withdraw directly to your UPI or Bank Account.",
    },
    {
      q: "Is Earnzyro really free to use?",
      a: "Yes! Earnzyro is 100% free. We never ask for any investment or upfront payment to start earning.",
    },
    {
      q: "How long do withdrawals take?",
      a: "Withdrawals are processed instantly via our automated system, but may take up to 24 hours in case of server delays.",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center text-[#111827] font-['Poppins',sans-serif] bg-[#F2F5F3] overflow-hidden px-4">
        <style>{`
          @keyframes ldSpin { to { transform: rotate(360deg); } }
          @keyframes ldPulse { 0%, 100% { opacity: 0.55; transform: scale(0.96); } 50% { opacity: 1; transform: scale(1.04); } }
          @keyframes ldBar { from { width: 0%; } to { width: 100%; } }
          @keyframes ldFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        `}</style>

        <div className="relative flex items-center justify-center mb-6 shrink-0">
          <div
            className="absolute w-[clamp(92px,10vw,118px)] h-[clamp(92px,10vw,118px)] rounded-full border-2 border-transparent border-t-[#22c55e] border-r-[#22c55e]/40"
            style={{ animation: "ldSpin 1.1s linear infinite" }}
          />
          <div
            className="w-[clamp(78px,8vw,94px)] h-[clamp(78px,8vw,94px)] rounded-full p-[3px] bg-[conic-gradient(from_0deg,#22c55e,#16a34a,#22c55e)] flex items-center justify-center"
            style={{ animation: "ldPulse 1.6s ease-in-out infinite" }}
          >
            <img
              src={logo}
              alt="Earnzyro Logo"
              className="w-full h-full rounded-full object-cover border-[3px] border-white"
            />
          </div>
        </div>

        <h1
          className="bg-gradient-to-r from-[#16a34a] to-[#111827] bg-clip-text text-transparent text-[clamp(20px,2vw+14px,24px)] font-black tracking-[0.5px] m-0 mb-2.5 text-center"
          style={{ animation: "ldFloat 2.4s ease-in-out infinite" }}
        >
          Earnzyro
        </h1>
        <p className="text-[#6b7280] text-[clamp(11px,0.4vw+9px,13px)] mb-6 tracking-[0.5px] text-center px-2">
          Loading your earnings dashboard...
        </p>

        <div className="w-[clamp(160px,18vw,200px)] h-[3px] rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#16a34a]"
            style={{ animation: "ldBar 2.5s linear forwards" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full max-w-[100vw] text-[#111827] font-['Poppins',sans-serif] overflow-x-hidden flex justify-center bg-[#F2F5F3]">
      {/* 1. SCROLL PROGRESS BAR */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-transparent z-[9999]">
        <div
          className="h-full bg-[#16a34a] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <style>{`
        @keyframes lpFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        ::selection { background: rgba(34,197,94,0.3); color: #000; }
        .lp-safe-top { padding-top: env(safe-area-inset-top); }
        .lp-safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
        .lp-nav-btn { -webkit-tap-highlight-color: transparent; }
        html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; }
        }
      `}</style>

      <div className="w-full max-w-full md:max-w-[900px] lg:max-w-[1100px] xl:max-w-[1200px] mx-auto overflow-x-hidden">
        {/* HEADER / NAVBAR - Fixed Alignment & Gap */}
        <div className="lp-safe-top flex justify-between items-center gap-2 px-[clamp(16px,4vw,40px)] py-3 border-b border-[#e5e7eb] sticky top-0 bg-[#F2F5F3]/90 backdrop-blur-[16px] z-[999]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 min-w-0 no-underline">
            <div className="relative shrink-0">
              <img
                src={logo}
                alt="Earnzyro logo"
                className="w-[clamp(32px,3vw,38px)] h-[clamp(32px,3vw,38px)] rounded-full object-cover ring-1 ring-[#dcfce7] shadow-sm"
              />
              <span className="absolute -bottom-[2px] -right-[2px] w-[14px] h-[14px] rounded-full bg-white flex items-center justify-center">
                <BadgeCheck size={12} className="text-[#16a34a]" />
              </span>
            </div>
            <h1 className="bg-gradient-to-r from-[#16a34a] to-[#111827] bg-clip-text text-transparent text-[clamp(16px,1.2vw+14px,20px)] m-0 font-extrabold tracking-[0.3px] truncate leading-none">
              Earnzyro
            </h1>
          </Link>

          {/* Right Actions */}
          <div className="flex gap-2 items-center shrink-0">
            <button
              onClick={handleShare}
              aria-label="Share"
              className="lp-nav-btn hidden sm:flex items-center justify-center w-[clamp(34px,3vw,38px)] h-[clamp(34px,3vw,38px)] text-[#111827] bg-white border border-[#e5e7eb] rounded-xl transition-all duration-150 hover:text-[#16a34a] hover:border-[#86efac] cursor-pointer"
            >
              <Share2 size={16} />
            </button>

            <Link
              to="/login"
              className="lp-nav-btn hidden sm:inline-flex items-center justify-center gap-1.5 min-h-[clamp(34px,3vw,38px)] text-[#111827] no-underline text-[clamp(11px,0.3vw+10px,13px)] font-semibold px-3.5 py-1 rounded-xl border border-[#e5e7eb] bg-white transition-all duration-150 hover:text-[#16a34a] hover:border-[#86efac] whitespace-nowrap"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="lp-nav-btn inline-flex items-center justify-center gap-1.5 min-h-[clamp(34px,3vw,38px)] bg-gradient-to-br from-[#22c55e] to-[#16a34a] text-white px-3.5 py-1 rounded-xl no-underline font-bold text-[clamp(11px,0.3vw+10px,13px)] whitespace-nowrap shadow-[0_4px_14px_rgba(34,197,94,0.25)] transition-all duration-150 hover:-translate-y-0.5 active:scale-95"
            >
              Sign Up <ArrowRight size={14} className="shrink-0" />
            </Link>
          </div>
        </div>

        {/* TRUST STRIP */}
        <div className="px-[clamp(16px,4vw,40px)] py-2 border-b border-[#e5e7eb] bg-white/50 overflow-x-auto">
          <div className="flex items-center justify-center gap-x-4 gap-y-1 flex-nowrap sm:flex-wrap min-w-max sm:min-w-0 mx-auto w-fit">
            {TRUST_STRIP.map((t, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 text-[#6b7280] text-[clamp(10px,0.3vw+9px,11px)] font-semibold whitespace-nowrap"
              >
                <t.icon size={12} className="text-[#16a34a] shrink-0" />
                {t.label}
              </div>
            ))}
          </div>
        </div>

        {/* HERO */}
        <div className="px-[clamp(16px,4vw,40px)] pt-10 pb-10 text-center flex flex-col items-center">
          <div
            className="w-[clamp(80px,8vw,96px)] h-[clamp(80px,8vw,96px)] rounded-full mx-auto mb-5 p-[3px] bg-[conic-gradient(from_0deg,#22c55e,#16a34a,#22c55e)] flex items-center justify-center shadow-[0_0_28px_rgba(34,197,94,0.15)]"
            style={{ animation: "lpFloat 4s ease-in-out infinite" }}
          >
            <img
              src={logo}
              alt="Earnzyro Logo"
              className="w-full h-full rounded-full object-cover border-[3px] border-white"
            />
          </div>

          <div className="flex justify-center gap-2 flex-wrap mb-4 px-2 max-w-full">
            <div className="flex items-center gap-1.5 bg-[#dcfce7] px-3 py-1.5 rounded-full text-[clamp(10px,0.3vw+9px,12px)] text-[#16a34a] border border-[#bbf7d0] font-bold whitespace-nowrap shadow-sm">
              <Wallet size={13} /> 100% Free Earning
            </div>
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full text-[clamp(10px,0.3vw+9px,12px)] text-[#111827] border border-[#e5e7eb] font-bold whitespace-nowrap shadow-sm">
              <Zap size={13} className="text-[#16a34a]" /> Instant Withdraw
            </div>
          </div>

          <h1 className="text-[clamp(26px,3.5vw+16px,46px)] font-black leading-[1.15] mb-4 tracking-tight max-w-[700px] w-full mx-auto px-1 break-words text-[#111827]">
            Complete Tasks <br />
            <span className="bg-gradient-to-r from-[#16a34a] to-[#22c55e] bg-clip-text text-transparent">
              Earn Real Money
            </span>
          </h1>

          <p className="text-[#6b7280] text-[clamp(12px,0.5vw+11px,15px)] leading-[1.6] max-w-[580px] w-full mx-auto px-2 break-words">
            100% free task earning platform without investment. Complete simple
            tasks, surveys, app installs and offers to earn reward coins and
            withdraw real money directly to your UPI and bank account.
          </p>

          <div className="flex justify-center gap-3 flex-wrap mt-6 px-2 max-w-full w-full">
            <Link
              to="/register"
              className="touch-manipulation inline-flex items-center justify-center gap-2 bg-gradient-to-br from-[#22c55e] to-[#16a34a] text-white px-[clamp(20px,2vw,28px)] py-[clamp(12px,1.5vw,14px)] rounded-full font-bold text-[clamp(12px,0.4vw+11px,14px)] no-underline whitespace-nowrap shadow-[0_4px_14px_rgba(34,197,94,0.3)] transition-transform duration-150 hover:-translate-y-1 active:scale-95"
            >
              Start Earning <ArrowRight size={15} />
            </Link>
          </div>

          {/* STATS (100% Real Guarantees) */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-[clamp(12px,2vw,20px)] w-full max-w-[800px]">
            <div className={`${card} text-center`}>
              <h2 className="text-[#16a34a] text-[clamp(18px,1.5vw+14px,24px)] mb-1 font-black">
                ₹0
              </h2>
              <p className="text-[#6b7280] text-[clamp(10px,0.3vw+9px,12px)] font-semibold break-words">
                Joining Fee
              </p>
            </div>
            <div className={`${card} text-center`}>
              <h2 className="text-[#16a34a] text-[clamp(18px,1.5vw+14px,24px)] mb-1 font-black">
                ₹100
              </h2>
              <p className="text-[#6b7280] text-[clamp(10px,0.3vw+9px,12px)] font-semibold break-words">
                Min Withdrawal
              </p>
            </div>
            <div className={`${card} text-center`}>
              <h2 className="text-[#16a34a] text-[clamp(18px,1.5vw+14px,24px)] mb-1 font-black">
                UPI
              </h2>
              <p className="text-[#6b7280] text-[clamp(10px,0.3vw+9px,12px)] font-semibold break-words">
                Instant Payouts
              </p>
            </div>
            <div className={`${card} text-center`}>
              <h2 className="text-[#16a34a] text-[clamp(18px,1.5vw+14px,24px)] mb-1 font-black">
                24/7
              </h2>
              <p className="text-[#6b7280] text-[clamp(10px,0.3vw+9px,12px)] font-semibold break-words">
                Support Available
              </p>
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <div className="px-[clamp(16px,4vw,40px)] pb-12">
          <p className="text-center text-[#16a34a] text-[clamp(10px,0.3vw+9px,11px)] font-bold tracking-[1.5px] uppercase mb-2">
            Built for real earners
          </p>
          <h2 className="text-center text-[clamp(20px,2vw+16px,30px)] mb-2 font-black text-[#111827]">
            Why Choose Earnzyro?
          </h2>
          <p className="text-center text-[#6b7280] text-[clamp(12px,0.4vw+11px,14px)] mb-6 max-w-[500px] mx-auto px-2 break-words">
            A smart, fast, and reliable earning platform — built around a
            rewards system that actually pays.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-[clamp(12px,2vw,20px)]">
            <div className={card}>
              <div className={iconBadge}>
                <ClipboardCheck size={18} />
              </div>
              <h2 className={title}>Daily Tasks</h2>
              <p className={text}>
                Complete daily tasks and earn reward coins instantly.
              </p>
            </div>
            <div className={card}>
              <div className={iconBadge}>
                <Gift size={18} />
              </div>
              <h2 className={title}>Daily Bonus</h2>
              <p className={text}>
                Claim free reward bonuses every single day.
              </p>
            </div>
            <div className={card}>
              <div className={iconBadge}>
                <Zap size={18} />
              </div>
              <h2 className={title}>Fast Withdraw</h2>
              <p className={text}>
                Withdraw earnings directly to UPI and bank account.
              </p>
            </div>
            <div className={card}>
              <div className={iconBadge}>
                <Flame size={18} />
              </div>
              <h2 className={title}>Real Rewards</h2>
              <p className={text}>
                Earn real rewards from surveys and app offers.
              </p>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="px-[clamp(16px,4vw,40px)] pb-12">
          <p className="text-center text-[#16a34a] text-[clamp(10px,0.3vw+9px,11px)] font-bold tracking-[1.5px] uppercase mb-2">
            Getting started
          </p>
          <h2 className="text-center text-[clamp(20px,2vw+16px,30px)] mb-6 font-black text-[#111827]">
            How It Works
          </h2>

          <div className="flex flex-col md:grid md:grid-cols-3 gap-[clamp(12px,2vw,20px)]">
            {STEPS.map((s, i) => (
              <div key={i} className={`${card} flex items-start gap-3`}>
                <div className="shrink-0 w-[clamp(32px,3vw,36px)] h-[clamp(32px,3vw,36px)] rounded-full bg-[#dcfce7] border border-[#bbf7d0] text-[#16a34a] font-black text-[clamp(12px,0.4vw,14px)] flex items-center justify-center">
                  {s.n}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[#111827] text-[clamp(13px,0.4vw+11px,15px)] font-extrabold m-0 mb-1 break-words">
                    {s.t}
                  </h3>
                  <p className="text-[#6b7280] text-[clamp(11px,0.3vw+9px,13px)] leading-[1.45] m-0 break-words">
                    {s.d}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* INTERACTIVE FAQ SECTION */}
        <div className="px-[clamp(16px,4vw,40px)] pb-12">
          <h2 className="text-center text-[clamp(20px,2vw+16px,30px)] mb-6 font-black text-[#111827]">
            Frequently Asked Questions
          </h2>
          <div className="max-w-[700px] mx-auto flex flex-col gap-3">
            {FAQS.map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 bg-transparent border-none text-left cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <span className="text-[clamp(13px,0.4vw+11px,15px)] font-bold text-[#111827]">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-[#16a34a] transition-transform duration-300 ${openFaq === index ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className="px-4 overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: openFaq === index ? "100px" : "0px",
                    paddingBottom: openFaq === index ? "16px" : "0",
                  }}
                >
                  <p className="text-[#6b7280] text-[clamp(12px,0.3vw+10px,14px)] m-0">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA BANNER */}
        <div className="px-[clamp(16px,4vw,40px)] pb-12">
          <div className="relative overflow-hidden rounded-3xl border border-[#86efac] bg-[#dcfce7]/50 p-[clamp(20px,4vw,40px)] text-center shadow-sm">
            <div className="mx-auto mb-3 w-11 h-11 rounded-full bg-white text-[#16a34a] flex items-center justify-center shadow-sm">
              <ShieldCheck size={22} />
            </div>
            <h2 className="text-[clamp(18px,2vw+14px,24px)] font-black mb-2 break-words text-[#111827]">
              Ready to start earning?
            </h2>
            <p className="text-[#374151] text-[clamp(12px,0.4vw+11px,14px)] mb-5 max-w-[420px] w-full mx-auto break-words">
              Join Earnzyro today and start earning real money by completing
              tasks — it only takes a minute to sign up.
            </p>
            <Link
              to="/register"
              className="touch-manipulation inline-flex items-center justify-center gap-2 bg-gradient-to-br from-[#22c55e] to-[#16a34a] text-white px-[clamp(20px,2vw,28px)] py-[clamp(12px,1.5vw,14px)] rounded-full font-bold text-[clamp(12px,0.4vw+11px,14px)] no-underline whitespace-nowrap shadow-[0_4px_14px_rgba(34,197,94,0.3)] transition-transform duration-150 hover:-translate-y-1 active:scale-95"
            >
              Create Free Account <ArrowRight size={15} />
            </Link>
            <p className="text-[#6b7280] text-[clamp(10px,0.3vw+9px,11px)] mt-4 m-0 break-words px-2">
              No credit card required · Free forever · Withdraw anytime
            </p>
          </div>
        </div>

        {/* FOOTER LINKS */}
        <div className="lp-safe-bottom border-t border-[#e5e7eb] mt-2 px-[clamp(16px,4vw,40px)] pt-8 pb-6">
          <div className="text-center mb-5">
            <h3 className="bg-gradient-to-r from-[#16a34a] to-[#111827] bg-clip-text text-transparent text-[clamp(16px,1vw+14px,20px)] font-black m-0 mb-2 tracking-[0.3px]">
              Earnzyro
            </h3>
            <p className="text-[#6b7280] text-[clamp(10px,0.3vw+9px,12px)] max-w-[360px] w-full mx-auto leading-[1.5] break-words">
              India's trusted free task-earning platform — complete tasks, earn
              coins, withdraw real money.
            </p>
          </div>

          <div className="flex justify-center gap-x-4 gap-y-2 flex-wrap mb-5 px-2">
            <Link to="/about" className={footerLink}>
              About
            </Link>
            <Link to="/support" className={footerLink}>
              Support
            </Link>
            <Link to="/faq" className={footerLink}>
              FAQ
            </Link>
            <Link to="/privacy" className={footerLink}>
              Privacy
            </Link>
            <Link to="/terms" className={footerLink}>
              Terms
            </Link>
          </div>

          <div className="text-center text-[#9ca3af] text-[clamp(10px,0.3vw+9px,11px)] pb-3">
            © 2026 Earnzyro. All Rights Reserved.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;

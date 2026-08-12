import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "/logo.jpg.jpeg";

function Landing() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const card =
    "relative w-full min-w-0 bg-[linear-gradient(180deg,rgba(20,20,20,0.92),rgba(13,13,13,0.92))] border border-[#facc15]/[0.12] rounded-xl p-4 sm:p-4 md:p-4 backdrop-blur-[14px] shadow-[0_10px_22px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-[#facc15]/30 hover:shadow-[0_14px_30px_rgba(250,204,21,0.08)] before:content-[''] before:absolute before:top-0 before:left-4 before:right-4 before:h-px before:bg-[linear-gradient(90deg,transparent,rgba(250,204,21,0.4),transparent)]";
  const title =
    "text-[15px] sm:text-[14.5px] md:text-[13.5px] font-extrabold mt-[9px] mb-[4px] text-white break-words";
  const text =
    "text-[#a1a1aa] text-[12px] sm:text-[12px] md:text-[11px] leading-[17px] sm:leading-[17px] md:leading-[16px] break-words";
  const footerLink =
    "inline-flex items-center justify-center min-h-[38px] px-1.5 text-[#a1a1aa] no-underline text-[13px] sm:text-[13px] md:text-[11.5px] font-semibold transition-colors duration-150 hover:text-[#facc15] whitespace-nowrap touch-manipulation";

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

  if (loading) {
    return (
      <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center text-white font-['Poppins',_sans-serif] bg-[radial-gradient(circle_at_bottom_left,rgba(255,120,40,0.35),transparent_35%),radial-gradient(circle_at_top_right,rgba(255,140,0,0.22),transparent_28%),linear-gradient(135deg,#050505_0%,#0a0a0a_40%,#120909_100%)] overflow-hidden px-4">
        <style>{`
          @keyframes ldSpin { to { transform: rotate(360deg); } }
          @keyframes ldPulse {
            0%, 100% { opacity: 0.55; transform: scale(0.96); }
            50% { opacity: 1; transform: scale(1.04); }
          }
          @keyframes ldBar { from { width: 0%; } to { width: 100%; } }
          @keyframes ldFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
        `}</style>

        <div className="relative flex items-center justify-center mb-6 shrink-0">
          <div
            className="absolute w-[100px] h-[100px] sm:w-[104px] sm:h-[104px] md:w-[118px] md:h-[118px] rounded-full border-2 border-transparent border-t-[#facc15] border-r-[#facc15]/40"
            style={{ animation: "ldSpin 1.1s linear infinite" }}
          />
          <div
            className="w-[84px] h-[84px] sm:w-[88px] sm:h-[88px] md:w-[94px] md:h-[94px] rounded-full p-[3px] bg-[conic-gradient(from_0deg,#facc15,#ff8f00,#facc15)] flex items-center justify-center"
            style={{ animation: "ldPulse 1.6s ease-in-out infinite" }}
          >
            <img
              src={logo}
              alt="TaskNiri Logo"
              className="w-full h-full rounded-full object-cover border-[3px] border-[#0a0a0a]"
            />
          </div>
        </div>

        <h1
          className="bg-[linear-gradient(120deg,#ffe27a,#facc15,#fff8dc,#facc15)] bg-clip-text text-transparent text-[22px] sm:text-[23px] md:text-[24px] font-black tracking-[0.5px] m-0 mb-2.5 text-center"
          style={{ animation: "ldFloat 2.4s ease-in-out infinite" }}
        >
          TaskNiri
        </h1>
        <p className="text-[#a1a1aa] text-[12px] sm:text-[12px] md:text-[11.5px] mb-6 tracking-[0.5px] text-center">
          Loading your earnings dashboard...
        </p>

        <div className="w-[180px] sm:w-[190px] md:w-[200px] h-[3px] rounded-full bg-white/[0.08] overflow-hidden">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#ffe27a,#facc15,#eab308)]"
            style={{ animation: "ldBar 3s linear forwards" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-[100dvh] w-full max-w-[100vw] text-white font-['Poppins',_sans-serif] overflow-x-hidden flex justify-center
        bg-[radial-gradient(circle_at_bottom_left,rgba(255,120,40,0.35),transparent_35%),radial-gradient(circle_at_top_right,rgba(255,140,0,0.22),transparent_28%),linear-gradient(135deg,#050505_0%,#0a0a0a_40%,#120909_100%)]"
    >
      <style>{`
        @keyframes lpShine { to { background-position: 200% center; } }
        @keyframes lpFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        ::selection { background: rgba(250,204,21,0.35); color: #000; }
        .lp-inner ::-webkit-scrollbar { width: 5px; }
        .lp-inner ::-webkit-scrollbar-thumb {
          background: rgba(250,204,21,0.35);
          border-radius: 10px;
        }
        /* Respect notches / safe areas on mobile devices */
        .lp-safe-top { padding-top: env(safe-area-inset-top); }
        .lp-safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; }
        }
      `}</style>

      {/* Fluid width on phones/tablets, capped and centered on laptops/desktops */}
      <div className="lp-inner w-full max-w-full md:max-w-[900px] lg:max-w-[1100px] xl:max-w-[1200px] mx-auto overflow-x-hidden">
        {/* NAVBAR */}
        <div
          className="lp-safe-top flex justify-between items-center gap-2 px-4 sm:px-5 md:px-10 py-3 md:py-3.5
            border-b border-white/5 sticky top-0 bg-black/70 backdrop-blur-[14px] z-[999]"
        >
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <img
              src={logo}
              alt="logo"
              className="w-[32px] h-[32px] sm:w-[33px] sm:h-[33px] md:w-[32px] md:h-[32px] rounded-full object-cover shrink-0 shadow-[0_0_14px_rgba(250,204,21,0.3)]"
            />
            <h1 className="bg-[linear-gradient(120deg,#ffe27a,#facc15,#fff8dc,#facc15)] bg-clip-text text-transparent text-[17px] sm:text-[17.5px] md:text-[17px] m-0 font-extrabold tracking-[0.3px] truncate">
              TaskNiri
            </h1>
          </div>

          <div className="flex gap-2 md:gap-3 items-center shrink-0">
            <Link
              to="/login"
              className="inline-flex items-center justify-center min-h-[38px] text-white no-underline text-[13px] sm:text-[13px] md:text-[11.5px] font-semibold px-2 sm:px-2.5 py-1 transition-colors duration-150 hover:text-[#facc15] whitespace-nowrap touch-manipulation"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center justify-center min-h-[38px] bg-[linear-gradient(135deg,#ffe27a,#facc15,#eab308)] text-[#1a1400] px-4 sm:px-4 md:px-4 py-[9px] md:py-[8px] rounded-[9px]
                no-underline font-bold text-[13px] sm:text-[13px] md:text-[11.5px] whitespace-nowrap shadow-[0_4px_14px_rgba(250,204,21,0.3)] transition-transform duration-150 hover:-translate-y-0.5 active:scale-95 touch-manipulation"
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* HERO */}
        <div className="px-4 sm:px-5 md:px-10 pt-9 sm:pt-10 md:pt-12 pb-8 md:pb-10 text-center flex flex-col items-center">
          <div
            className="w-[88px] h-[88px] sm:w-[92px] sm:h-[92px] md:w-[96px] md:h-[96px] rounded-full mx-auto mb-4 sm:mb-4.5 md:mb-5 p-[3px]
              bg-[conic-gradient(from_0deg,#facc15,#ff8f00,#facc15)] flex items-center justify-center
              shadow-[0_0_28px_rgba(250,204,21,0.2)]"
            style={{ animation: "lpFloat 4s ease-in-out infinite" }}
          >
            <img
              src={logo}
              alt="TaskNiri Logo"
              className="w-full h-full rounded-full object-cover border-[3px] border-[#0a0a0a]"
            />
          </div>

          {/* TOP TAGS */}
          <div className="flex justify-center gap-2 sm:gap-2.5 flex-wrap mb-4 sm:mb-4.5 px-2 max-w-full">
            <div
              className="bg-[rgba(250,204,21,0.12)] px-3 sm:px-3.5 py-[6px] rounded-full text-[11.5px] sm:text-[12px] md:text-[10.5px]
              text-[#facc15] border border-[rgba(250,204,21,0.22)] font-semibold shadow-[0_0_14px_rgba(250,204,21,0.08)] whitespace-nowrap"
            >
              💰 100% Free Earning
            </div>
            <div
              className="bg-white/[0.05] px-3 sm:px-3.5 py-[6px] rounded-full text-[11.5px] sm:text-[12px] md:text-[10.5px] text-white
              border border-white/[0.08] font-semibold whitespace-nowrap"
            >
              ⚡ Instant Withdraw
            </div>
          </div>

          <h1 className="text-[29px] sm:text-[31px] md:text-[42px] font-black leading-[36px] sm:leading-[39px] md:leading-[48px] mb-3.5 sm:mb-4 tracking-[-0.5px] max-w-[640px] w-full mx-auto px-1 break-words">
            Complete Tasks
            <br />
            <span className="bg-[linear-gradient(to_right,#ffe27a,#facc15,#ffffff)] bg-[length:200%_auto] bg-clip-text text-transparent [animation:lpShine_4s_linear_infinite]">
              Earn Real Money
            </span>
          </h1>

          <p className="text-[#a1a1aa] text-[13px] sm:text-[13.5px] md:text-[13px] leading-[20px] md:leading-6 max-w-[330px] sm:max-w-[390px] md:max-w-[500px] w-full mx-auto px-2 break-words">
            100% free task earning platform without investment. Complete simple
            tasks, surveys, app installs and offers to earn reward coins and
            withdraw real money directly to your UPI and bank account.
          </p>

          {/* HERO BUTTONS */}
          <div className="flex justify-center gap-2 sm:gap-3 flex-wrap mt-5 sm:mt-6 px-2 max-w-full">
            <Link
              to="/register"
              className="touch-manipulation bg-[linear-gradient(135deg,#ffe27a,#facc15,#eab308)] text-[#1a1400] px-5 sm:px-5 md:px-6 py-[12px] sm:py-[12px] md:py-[11px]
                rounded-lg font-extrabold text-[13px] sm:text-[13px] md:text-[12px] no-underline whitespace-nowrap shadow-[0_6px_18px_rgba(250,204,21,0.3)]
                transition-transform duration-150 hover:-translate-y-1 active:scale-95"
            >
              Start Earning →
            </Link>
            <Link
              to="/login"
              className="touch-manipulation bg-white/[0.05] text-white px-5 sm:px-5 md:px-6 py-[12px] sm:py-[12px] md:py-[11px] rounded-lg font-extrabold
                text-[13px] sm:text-[13px] md:text-[12px] no-underline border border-white/[0.09] whitespace-nowrap transition-all duration-150
                hover:border-[#facc15]/30 hover:-translate-y-1 active:scale-95"
            >
              Learn More
            </Link>
          </div>

          {/* STATS */}
          <div className="mt-8 sm:mt-9 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-3 md:gap-4 w-full max-w-[620px]">
            {[
              ["100%", "Free Task Earning"],
              ["₹", "Real Money Rewards"],
              ["✔️", "Daily Tasks Available"],
              ["24/7", "Fast Support"],
            ].map((item, index) => (
              <div key={index} className={card}>
                <h2 className="text-[#facc15] text-[21px] sm:text-[22px] md:text-[24px] mb-1 font-black">
                  {item[0]}
                </h2>
                <p className="text-[#a1a1aa] text-[11.5px] sm:text-[12px] md:text-[10.5px] font-medium break-words">
                  {item[1]}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FEATURES */}
        <div className="px-4 sm:px-5 md:px-10 pb-9 md:pb-12">
          <p className="text-center text-[#ffb84d] text-[11.5px] sm:text-[12px] md:text-[10.5px] font-bold tracking-[1.5px] uppercase mb-2">
            Built for real earners
          </p>
          <h2 className="text-center text-[23px] sm:text-[25px] md:text-[28px] mb-2.5 font-black">
            Why Choose TaskNiri?
          </h2>
          <p className="text-center text-[#a1a1aa] text-[12px] sm:text-[12.5px] md:text-[12px] mb-5 sm:mb-6 max-w-[310px] sm:max-w-[350px] md:max-w-[480px] mx-auto px-2 break-words">
            A smart, fast, and reliable earning platform — built around a
            rewards system that actually pays.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-3 md:gap-4">
            <div className={card}>
              <div className="text-2xl sm:text-2xl md:text-2xl">📋</div>
              <h2 className={title}>Daily Tasks</h2>
              <p className={text}>
                Complete daily tasks and earn reward coins instantly.
              </p>
            </div>
            <div className={card}>
              <div className="text-2xl sm:text-2xl md:text-2xl">🎁</div>
              <h2 className={title}>Daily Bonus</h2>
              <p className={text}>
                Claim free reward bonuses every single day.
              </p>
            </div>
            <div className={card}>
              <div className="text-2xl sm:text-2xl md:text-2xl">⚡</div>
              <h2 className={title}>Fast Withdraw</h2>
              <p className={text}>
                Withdraw earnings directly to UPI and bank account.
              </p>
            </div>
            <div className={card}>
              <div className="text-2xl sm:text-2xl md:text-2xl">🔥</div>
              <h2 className={title}>Real Rewards</h2>
              <p className={text}>
                Earn real rewards from surveys and app offers.
              </p>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="px-4 sm:px-5 md:px-10 pb-9 md:pb-12">
          <p className="text-center text-[#ffb84d] text-[11.5px] sm:text-[12px] md:text-[10.5px] font-bold tracking-[1.5px] uppercase mb-2">
            Getting started
          </p>
          <h2 className="text-center text-[23px] sm:text-[25px] md:text-[28px] mb-5 sm:mb-6 font-black">
            How It Works
          </h2>

          <div className="flex flex-col md:grid md:grid-cols-3 gap-3 sm:gap-3 md:gap-4">
            {STEPS.map((s, i) => (
              <div
                key={i}
                className={`${card} flex items-start gap-3 sm:gap-3.5`}
              >
                <div className="shrink-0 w-9 h-9 sm:w-9 sm:h-9 md:w-9 md:h-9 rounded-full bg-[#facc15]/[0.12] border border-[#facc15]/25 text-[#facc15] font-black text-[13px] sm:text-[13px] md:text-[13px] flex items-center justify-center">
                  {s.n}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-white text-[14px] sm:text-[14.5px] md:text-[13px] font-extrabold m-0 mb-1 break-words">
                    {s.t}
                  </h3>
                  <p className="text-[#a1a1aa] text-[12px] sm:text-[12.5px] md:text-[11px] leading-[17px] sm:leading-[18px] md:leading-[17px] m-0 break-words">
                    {s.d}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA BANNER */}
        <div className="px-4 sm:px-5 md:px-10 pb-9 md:pb-12">
          <div className="relative overflow-hidden rounded-2xl border border-[#facc15]/20 bg-[linear-gradient(135deg,rgba(250,204,21,0.12),rgba(255,140,0,0.06))] p-5 sm:p-6 md:p-9 text-center shadow-[0_16px_36px_rgba(0,0,0,0.4)]">
            <h2 className="text-[20px] sm:text-[21px] md:text-[24px] font-black mb-2 break-words">
              Ready to start earning?
            </h2>
            <p className="text-[#d4d4d8] text-[12.5px] sm:text-[13px] md:text-[12px] mb-4 sm:mb-4.5 max-w-[280px] sm:max-w-[320px] md:max-w-[400px] w-full mx-auto break-words">
              Join thousands of users already earning real money on TaskNiri —
              it only takes a minute to sign up.
            </p>
            <Link
              to="/register"
              className="touch-manipulation inline-block bg-[linear-gradient(135deg,#ffe27a,#facc15,#eab308)] text-[#1a1400] px-5 sm:px-6 md:px-7 py-[12px] sm:py-[13px] md:py-[12px]
                rounded-lg font-extrabold text-[13px] sm:text-[13.5px] md:text-[12.5px] no-underline whitespace-nowrap shadow-[0_6px_18px_rgba(250,204,21,0.3)]
                transition-transform duration-150 hover:-translate-y-1 active:scale-95"
            >
              Create Free Account
            </Link>
            <p className="text-[#8b8b93] text-[10.5px] sm:text-[11px] md:text-[10.5px] mt-3 sm:mt-3.5 m-0 break-words">
              No credit card required · Free forever · Withdraw anytime
            </p>
          </div>
        </div>

        {/* FAQ TEASER */}
        <div className="px-4 sm:px-5 md:px-10 pb-9 md:pb-12">
          <div className={`${card} text-center md:py-7`}>
            <h2 className="text-white text-[15.5px] sm:text-[16px] md:text-[17px] font-extrabold m-0 mb-2 break-words">
              Got questions?
            </h2>
            <p className="text-[#a1a1aa] text-[12px] sm:text-[12.5px] md:text-[11.5px] leading-[18px] sm:leading-[19px] md:leading-[19px] mb-4 max-w-[280px] sm:max-w-[310px] md:max-w-[400px] w-full mx-auto break-words">
              Check our FAQ for answers on withdrawals, tasks, referrals, and
              account help — or reach our support team directly.
            </p>
            <div className="flex justify-center gap-2 sm:gap-2.5 flex-wrap">
              <Link
                to="/faq"
                className="touch-manipulation bg-white/[0.05] text-white px-4 sm:px-4.5 md:px-5 py-[10px] sm:py-[10px] md:py-2.5 rounded-lg font-bold
                  text-[12px] sm:text-[12.5px] md:text-[11.5px] no-underline border border-white/[0.09] whitespace-nowrap transition-all duration-150
                  hover:border-[#facc15]/30"
              >
                View FAQ
              </Link>
              <Link
                to="/support"
                className="touch-manipulation bg-[#facc15]/10 text-[#facc15] px-4 sm:px-4.5 md:px-5 py-[10px] sm:py-[10px] md:py-2.5 rounded-lg font-bold
                  text-[12px] sm:text-[12.5px] md:text-[11.5px] no-underline border border-[#facc15]/20 whitespace-nowrap transition-all duration-150
                  hover:bg-[#facc15]/[0.16]"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>

        {/* FOOTER LINKS */}
        <div className="lp-safe-bottom border-t border-white/5 mt-2 px-4 sm:px-5 md:px-10 pt-5 md:pt-6 pb-3 md:pb-5">
          <div className="text-center mb-4">
            <h3 className="bg-[linear-gradient(120deg,#ffe27a,#facc15,#fff8dc,#facc15)] bg-clip-text text-transparent text-[16.5px] sm:text-[17px] md:text-[17px] font-black m-0 mb-1.5 tracking-[0.3px]">
              TaskNiri
            </h3>
            <p className="text-[#71717a] text-[11.5px] sm:text-[12px] md:text-[10.5px] max-w-[290px] sm:max-w-[310px] md:max-w-[380px] w-full mx-auto leading-[17px] sm:leading-[18px] md:leading-[18px] break-words">
              India's trusted free task-earning platform — complete tasks, earn
              coins, withdraw real money.
            </p>
          </div>

          <div className="flex justify-center gap-x-3.5 gap-y-1.5 sm:gap-x-4 md:gap-x-6 flex-wrap mb-4 px-2">
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

          <div className="text-center text-[#71717a] text-[11px] sm:text-[11.5px] md:text-[10px] pb-3">
            © 2026 TaskNiri. All Rights Reserved.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;

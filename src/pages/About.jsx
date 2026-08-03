import { Link } from "react-router-dom";
import logo from "/logo.jpg.jpeg";

function About() {
  return (
    <div
      className="min-h-screen p-3 md:p-5 pb-[90px] text-white font-['Poppins',_sans-serif]
        bg-[radial-gradient(circle_at_bottom_left,rgba(255,120,40,0.35),transparent_35%),radial-gradient(circle_at_top_right,rgba(255,140,0,0.22),transparent_28%),linear-gradient(135deg,#050505_0%,#0a0a0a_40%,#120909_100%)]"
    >
      {/* TOP HEADING */}
      <div className="text-center mb-[22px]">
        {/* LOGO */}
        <img
          src={logo}
          alt="TaskLumo Logo"
          className="w-[65px] h-[65px] md:w-[85px] md:h-[85px] rounded-full object-cover mb-[14px]
            border-2 border-[rgba(250,204,21,0.25)] shadow-[0_0_20px_rgba(250,204,21,0.35)] inline-block"
        />

        <h1
          className="text-[28px] md:text-[40px] font-black mb-[10px]
            bg-gradient-to-r from-[#facc15] to-white bg-clip-text text-transparent"
        >
          About TaskLumo
        </h1>

        <p className="text-[#a1a1aa] text-[10px] md:text-[13px] leading-6 max-w-[700px] mx-auto">
          Learn more about TaskLumo, our mission, vision, rewards system, and
          future goals.
        </p>
      </div>

      {/* BIG MAIN CARD */}
      <div
        className="bg-[rgba(17,17,17,0.92)] border border-[rgba(250,204,21,0.08)] rounded-[22px]
          p-[18px] md:p-7 backdrop-blur-[18px] shadow-[0_0_24px_rgba(250,204,21,0.05)]"
      >
        {/* ABOUT */}
        <h2 className="text-[#facc15] text-[18px] md:text-[24px] mb-3 font-extrabold">
          🚀 About TaskLumo
        </h2>
        <p className="text-[#d4d4d8] text-[10px] md:text-[12px] leading-[26px] mb-[26px]">
          TaskLumo is a modern online earning and rewards platform created to
          help users earn real rewards through simple digital activities such as
          tasks, surveys, app installs, referrals, promotions, and
          engagement-based systems.
          <br />
          <br />
          Our platform is designed with simplicity, smooth performance, and
          user-friendly accessibility in mind so users can easily complete
          activities, collect reward coins, and manage earnings securely.
          <br />
          <br />
          TaskLumo focuses on creating a clean and trusted earning ecosystem
          where users can enjoy a rewarding online experience without
          complicated systems.
        </p>

        {/* MISSION */}
        <h2 className="text-[#facc15] text-[18px] md:text-[24px] mb-3 font-extrabold">
          🎯 Our Mission
        </h2>
        <p className="text-[#d4d4d8] text-[10px] md:text-[12px] leading-[26px] mb-[26px]">
          Our mission is to make online earning more accessible, transparent,
          and rewarding for everyone.
          <br />
          <br />
          We believe users should have the opportunity to earn online through
          simple activities without confusing processes or difficult systems.
          <br />
          <br />
          TaskLumo aims to build a trusted community-driven rewards platform
          that delivers fair opportunities, smooth experiences, and long-term
          growth.
        </p>

        {/* FEATURES */}
        <h2 className="text-[#facc15] text-[18px] md:text-[24px] mb-3 font-extrabold">
          💰 What We Offer
        </h2>
        <p className="text-[#d4d4d8] text-[10px] md:text-[12px] leading-[26px] mb-[26px]">
          TaskLumo offers multiple earning opportunities including daily tasks,
          reward bonuses, surveys, app testing, promotional offers, referral
          rewards, and engagement systems.
          <br />
          <br />
          Users can earn reward coins by completing activities and later
          withdraw earnings using available payment methods.
          <br />
          <br />
          We continuously improve the platform with new earning opportunities,
          bonus systems, and better user experiences.
        </p>

        {/* WHY CHOOSE */}
        <h2 className="text-[#facc15] text-[18px] md:text-[24px] mb-3 font-extrabold">
          ⭐ Why Choose TaskLumo
        </h2>
        <p className="text-[#d4d4d8] text-[10px] md:text-[12px] leading-[26px] mb-[26px]">
          TaskLumo is built with modern design, mobile responsiveness, fast
          performance, and smooth navigation systems.
          <br />
          <br />
          Our platform focuses on user-friendly experiences, reward
          transparency, secure account systems, and responsive support services.
          <br />
          <br />
          We aim to provide a platform where users can enjoy earning rewards in
          a simple, secure, and enjoyable environment.
        </p>

        {/* SECURITY */}
        <h2 className="text-[#facc15] text-[18px] md:text-[24px] mb-3 font-extrabold">
          🔒 Security & Trust
        </h2>
        <p className="text-[#d4d4d8] text-[10px] md:text-[12px] leading-[26px] mb-[26px]">
          Security and transparency are important priorities for us. We focus on
          maintaining secure systems, protected user accounts, and trusted
          reward processes.
          <br />
          <br />
          Our goal is to build long-term trust by improving platform quality,
          stability, and user confidence continuously.
        </p>

        {/* FUTURE */}
        <h2 className="text-[#facc15] text-[18px] md:text-[24px] mb-3 font-extrabold">
          🔥 Future Goals
        </h2>
        <p className="text-[#d4d4d8] text-[10px] md:text-[12px] leading-[26px] mb-[26px]">
          TaskLumo is continuously evolving to introduce better earning systems,
          smarter engagement features, and improved reward opportunities.
          <br />
          <br />
          We plan to build a stronger global community, advanced task systems,
          referral programs, and modern earning technologies in the future.
        </p>

        {/* THANK YOU */}
        <h2 className="text-[#facc15] text-[18px] md:text-[24px] mb-3 font-extrabold">
          ❤️ Thank You
        </h2>
        <p className="text-[#d4d4d8] text-[10px] md:text-[12px] leading-[26px] mb-[10px]">
          Thank you for supporting TaskLumo and being part of our growing
          journey.
          <br />
          <br />
          Your trust and support motivate us to continue improving the platform
          and creating better earning experiences for users around the world.
        </p>
      </div>

      {/* BUTTON */}
      <div className="text-center mt-[26px]">
        <Link
          to="/home"
          className="bg-gradient-to-br from-[#facc15] to-[#eab308] text-black px-[22px] py-3
            rounded-xl no-underline font-bold text-[11px] inline-block"
        >
          Back To Home
        </Link>
      </div>
    </div>
  );
}

export default About;

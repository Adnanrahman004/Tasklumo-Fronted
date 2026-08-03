import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  Zap,
  Wallet,
  Sparkles,
} from "lucide-react";
import logo from "/logo.jpg.jpeg";
import { loginUser } from "../services/authServices";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const FONT = "font-[Poppins,sans-serif]";

  const highlights = [
    { icon: Zap, label: "New tasks daily" },
    { icon: Wallet, label: "Fast withdrawals" },
    { icon: ShieldCheck, label: "Secure by design" },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser({
        email,
        password,
      });

      localStorage.setItem("token", data.token);

      if (rememberMe) {
        localStorage.setItem("tasklumoRemember", "true");
      }

      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen min-h-[100dvh] w-full flex flex-col lg:flex-row bg-[#08080a] text-white ${FONT}`}
    >
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.06); }
        }
        @keyframes ringExpand {
          0% { transform: scale(0.85); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; }
        }
        .input-shell:focus-within {
          border-color: rgba(250,204,21,0.5);
          background: rgba(255,255,255,0.05);
          box-shadow: 0 0 0 3px rgba(250,204,21,0.08);
        }
      `}</style>

      {/* LEFT / TOP — brand & trust panel (always visible, compact on mobile) */}
      <div className="w-full lg:w-[46%] relative flex flex-col justify-between px-5 py-7 sm:px-10 sm:py-10 lg:px-14 lg:py-12 overflow-hidden bg-[radial-gradient(circle_at_20%_100%,rgba(250,204,21,0.12),transparent_45%),linear-gradient(160deg,#0a0a0b_0%,#111013_55%,#161210_100%)]">
        {/* faint grid texture */}
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] bg-[size:28px_28px] sm:bg-[size:38px_38px] pointer-events-none" />

        {/* logo row */}
        <div className="relative flex items-center gap-2.5 z-10">
          <img
            src={logo}
            alt="TaskLumo Logo"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-[#facc15]/30"
          />
          <span className="font-black text-[15px] sm:text-[17px] tracking-tight">
            Task<span className="text-[#facc15]">Lumo</span>
          </span>
        </div>

        {/* signature glow + headline */}
        <div className="relative flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-start gap-5 sm:gap-8 lg:gap-10 mt-6 sm:mt-8 lg:flex-1 lg:justify-center z-10">
          <div className="relative w-[72px] h-[72px] sm:w-[110px] sm:h-[110px] lg:w-[150px] lg:h-[150px] shrink-0">
            <div className="absolute inset-0 rounded-full bg-[#facc15] blur-[20px] sm:blur-[30px] lg:blur-[36px] animate-[glowPulse_3.2s_ease-in-out_infinite]" />
            <div className="absolute inset-0 rounded-full border border-[#facc15]/40 animate-[ringExpand_2.6s_ease-out_infinite]" />
            <div className="absolute inset-0 rounded-full border border-[#facc15]/40 animate-[ringExpand_2.6s_ease-out_infinite_1.3s]" />
            <div className="absolute inset-[18px] sm:inset-[28px] lg:inset-[38px] rounded-full bg-gradient-to-br from-[#facc15] to-[#ff8f00] flex items-center justify-center shadow-[0_0_40px_rgba(250,204,21,0.5)]">
              <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 lg:w-[30px] lg:h-[30px] text-black" />
            </div>
          </div>

          <div>
            <h1 className="text-[21px] leading-[27px] sm:text-[32px] sm:leading-[38px] lg:text-[40px] lg:leading-[46px] font-black tracking-tight mb-2 sm:mb-3 lg:mb-4">
              Small tasks.
              <br />
              <span className="bg-gradient-to-r from-[#facc15] to-[#ff8f00] bg-clip-text text-transparent">
                Real earnings.
              </span>
            </h1>
            <p className="text-[#a1a1aa] text-[11.5px] sm:text-[13px] lg:text-[14px] leading-[17px] sm:leading-[20px] lg:leading-[22px] max-w-[340px]">
              Log back in to pick up where you left off — new tasks are added
              every day.
            </p>
          </div>
        </div>

        {/* highlight strip — real product qualities, no invented numbers */}
        <div className="relative grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-6 lg:pt-8 mt-5 sm:mt-8 lg:mt-0 border-t border-white/[0.06] z-10">
          {highlights.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col gap-1.5 sm:gap-2">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#facc15]/10 flex items-center justify-center">
                <Icon
                  size={12}
                  className="text-[#facc15] sm:w-[13px] sm:h-[13px]"
                />
              </div>
              <span className="text-[9.5px] sm:text-[11px] text-[#d4d4d8] font-semibold leading-tight">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT / BOTTOM — form panel */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative bg-[radial-gradient(circle_at_bottom_left,rgba(255,120,40,0.10),transparent_35%)]">
        <div className="w-full max-w-[380px] py-6 lg:py-0 animate-[fadeSlideUp_0.5s_ease_both]">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-[22px] sm:text-[28px] lg:text-[32px] font-black leading-tight m-0 mb-1.5">
              Welcome back
            </h2>
            <p className="text-[#a1a1aa] text-[11.5px] sm:text-[13px] m-0">
              Enter your details to access your dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} noValidate>
            <label
              htmlFor="login-email"
              className="block text-[10.5px] sm:text-[11px] font-semibold text-[#d4d4d8] mb-1.5"
            >
              Email address
            </label>
            <div className="input-shell relative mb-4 rounded-[12px] border border-white/[0.08] bg-white/[0.03] transition-all duration-200">
              <Mail
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none"
              />
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-[42px] pr-4 py-[12px] sm:py-[13px] rounded-[12px] border-none bg-transparent text-white outline-none text-[12.5px] sm:text-[13px] placeholder:text-[#52525b] ${FONT}`}
              />
            </div>

            <label
              htmlFor="login-password"
              className="block text-[10.5px] sm:text-[11px] font-semibold text-[#d4d4d8] mb-1.5"
            >
              Password
            </label>
            <div className="input-shell relative mb-4 rounded-[12px] border border-white/[0.08] bg-white/[0.03] transition-all duration-200">
              <Lock
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none"
              />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-[42px] pr-[42px] py-[12px] sm:py-[13px] rounded-[12px] border-none bg-transparent text-white outline-none text-[12.5px] sm:text-[13px] placeholder:text-[#52525b] ${FONT}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#a1a1aa] cursor-pointer p-1 flex items-center hover:text-[#facc15] transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            <div className="flex items-center justify-between mb-5 flex-wrap gap-y-2">
              <label className="flex items-center gap-[7px] text-[#a1a1aa] text-[11px] sm:text-[11.5px] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-[#facc15] w-[13px] h-[13px] cursor-pointer"
                />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="text-[#facc15] no-underline text-[11px] sm:text-[11.5px] font-semibold hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {error && (
              <p
                role="alert"
                className="flex items-center justify-center gap-1.5 text-[#ff5c5c] text-[11px] sm:text-[11.5px] m-0 mb-4 text-center bg-[#ff5c5c]/[0.08] border border-[#ff5c5c]/20 rounded-[10px] py-2.5 px-2"
              >
                <AlertCircle size={13} className="shrink-0" /> {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-[12px] sm:py-[13px] rounded-[12px] border-none bg-gradient-to-r from-[#facc15] to-[#ff8f00] text-black font-extrabold text-[13px] sm:text-[13.5px] cursor-pointer shadow-[0_4px_20px_rgba(250,204,21,0.22)] transition-all duration-200 flex items-center justify-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#facc15] ${FONT} ${
                loading
                  ? "opacity-75 cursor-not-allowed"
                  : "hover:-translate-y-0.5 hover:shadow-[0_6px_28px_rgba(250,204,21,0.35)] active:translate-y-0"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Login <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5 sm:my-6">
            <span className="flex-1 h-px bg-white/[0.07]" />
            <span className="text-[10px] sm:text-[10.5px] text-[#52525b] font-semibold">
              OR
            </span>
            <span className="flex-1 h-px bg-white/[0.07]" />
          </div>

          <div className="text-center">
            <p className="text-[#a1a1aa] text-[12px] sm:text-[12.5px] mb-0">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-[#facc15] no-underline font-bold hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

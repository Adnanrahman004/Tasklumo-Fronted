import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../services/authServices";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Zap,
  ArrowRight,
  Gift,
  Sparkles,
} from "lucide-react";
import logo from "/logo.jpg.jpeg";

function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [showReferral, setShowReferral] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const FONT = "font-[Poppins,sans-serif]";

  // ---- Password strength ----
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { label: "", score: 0 };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { label: "Weak", score: 1, color: "#ff5c5c" };
    if (score <= 2) return { label: "Medium", score: 2, color: "#facc15" };
    return { label: "Strong", score: 3, color: "#4ade80" };
  };

  const strength = getPasswordStrength(password);

  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const data = await registerUser({
        name: fullName,
        email,
        password,
        confirmPassword,
        referralCode: referralCode.trim() || undefined,
      });

      localStorage.setItem("token", data.token);

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen w-full flex justify-center items-center p-3 xs:p-4 sm:p-6 text-white ${FONT}
      bg-[radial-gradient(circle_at_bottom_left,rgba(255,120,40,0.32),transparent_35%),radial-gradient(circle_at_top_right,rgba(255,140,0,0.20),transparent_28%),linear-gradient(135deg,#050505_0%,#0a0a0a_40%,#120909_100%)]`}
    >
      {/* keyframes Tailwind's stock utilities can't express */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes floatGlow {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes pulseRing {
          0% { box-shadow: 0 0 0 0 rgba(250,204,21,0.35); }
          100% { box-shadow: 0 0 0 8px rgba(250,204,21,0); }
        }
        .brand-ring {
          background: conic-gradient(from 0deg, #facc15, #ff8f00, #facc15);
        }
        .shine-title {
          background: linear-gradient(110deg, #facc15 20%, #fff 40%, #ffb300 60%, #facc15 80%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 5s linear infinite;
        }
        .field-in { animation: fadeIn 0.35s ease both; }
        @media (prefers-reduced-motion: reduce) {
          .shine-title { animation: none; }
          .field-in { animation: none; }
        }
      `}</style>

      <div className="w-full max-w-[400px] relative mx-auto">
        {/* ambient glow behind the card */}
        <div className="absolute -inset-3 sm:-inset-6 bg-[radial-gradient(circle_at_50%_0%,rgba(250,204,21,0.16),transparent_70%)] blur-2xl pointer-events-none" />
        <div
          className="absolute -top-3 -right-3 text-[#facc15]/30 pointer-events-none hidden sm:block"
          style={{ animation: "floatGlow 3.5s ease-in-out infinite" }}
        >
          <Sparkles size={20} />
        </div>

        <div className="relative bg-[#111111]/[0.92] border border-[#facc15]/[0.12] rounded-[20px] sm:rounded-[24px] p-[20px_18px] xs:p-[22px_20px] sm:p-[28px_28px] backdrop-blur-[20px] shadow-[0_0_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.05)] animate-[fadeSlideUp_0.5s_ease_both]">
          {/* top accent hairline */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-px bg-gradient-to-r from-transparent via-[#facc15]/60 to-transparent rounded-full" />

          {/* Brand mark + heading combined row to save vertical space */}
          <div className="flex items-center gap-3 mb-5">
            <div
              className="brand-ring shrink-0 w-[46px] h-[46px] sm:w-[52px] sm:h-[52px] rounded-full p-[2px] flex items-center justify-center"
              style={{ animation: "pulseRing 2.4s ease-in-out infinite" }}
            >
              <img
                src={logo}
                alt="TaskLumo Logo"
                className="w-full h-full rounded-full object-cover border-[2px] border-[#0a0a0a]"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-[22px] sm:text-[25px] font-black leading-[1.1] m-0 shine-title truncate">
                Create Account
              </h1>
              <p className="text-[#a1a1aa] text-[10.5px] sm:text-[11.5px] m-0 mt-0.5 flex items-center gap-1">
                <ShieldCheck size={11} className="text-[#facc15] shrink-0" />
                Join TaskLumo &amp; start earning
              </p>
            </div>
          </div>

          <form onSubmit={handleRegister} className="w-full">
            <div className="relative mb-[11px]">
              <User
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none"
              />
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full pl-[42px] pr-4 py-[11px] sm:py-[12.5px] rounded-[13px] border border-white/[0.06] bg-white/[0.04] text-white outline-none text-[12.5px] sm:text-[13.5px] backdrop-blur-[10px] transition-all duration-200 placeholder:text-[#71717a] focus:border-[#facc15]/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(250,204,21,0.1)] ${FONT}`}
              />
            </div>

            <div className="relative mb-[11px]">
              <Mail
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-[42px] pr-4 py-[11px] sm:py-[12.5px] rounded-[13px] border border-white/[0.06] bg-white/[0.04] text-white outline-none text-[12.5px] sm:text-[13.5px] backdrop-blur-[10px] transition-all duration-200 placeholder:text-[#71717a] focus:border-[#facc15]/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(250,204,21,0.1)] ${FONT}`}
              />
            </div>

            <div className="relative mb-[11px]">
              <Lock
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none"
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-[42px] pr-[42px] py-[11px] sm:py-[12.5px] rounded-[13px] border border-white/[0.06] bg-white/[0.04] text-white outline-none text-[12.5px] sm:text-[13.5px] backdrop-blur-[10px] transition-all duration-200 placeholder:text-[#71717a] focus:border-[#facc15]/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(250,204,21,0.1)] ${FONT}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#a1a1aa] cursor-pointer p-1 flex items-center hover:text-[#facc15] transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {password.length > 0 && (
              <div className="field-in -mt-1 mb-[11px]">
                <div className="flex items-center justify-between mb-1">
                  <div className="h-[3px] flex-1 rounded-full bg-white/[0.08] overflow-hidden mr-2">
                    <div
                      className="h-full rounded-full transition-all duration-[250ms]"
                      style={{
                        width: `${(strength.score / 3) * 100}%`,
                        background: strength.color,
                      }}
                    />
                  </div>
                  <span
                    className="text-[9.5px] font-semibold whitespace-nowrap"
                    style={{ color: strength.color }}
                  >
                    {strength.label}
                  </span>
                </div>
              </div>
            )}

            <div className="relative mb-[6px]">
              <Lock
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none"
              />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full pl-[42px] pr-[42px] py-[11px] sm:py-[12.5px] rounded-[13px] border bg-white/[0.04] text-white outline-none text-[12.5px] sm:text-[13.5px] backdrop-blur-[10px] transition-all duration-200 placeholder:text-[#71717a] focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(250,204,21,0.1)] ${FONT} ${
                  passwordsMismatch
                    ? "border-[#ff5c5c]/60 focus:border-[#ff5c5c]/60"
                    : "border-white/[0.06] focus:border-[#facc15]/50"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                tabIndex={-1}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#a1a1aa] cursor-pointer p-1 flex items-center hover:text-[#facc15] transition-colors"
              >
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {passwordsMismatch && (
              <p className="field-in text-[#ff5c5c] text-[10px] mb-[10px] ml-0.5 flex items-center gap-1">
                <AlertCircle size={11} /> Passwords do not match
              </p>
            )}

            {/* Referral code — collapsed by default to save vertical space */}
            {!showReferral ? (
              <button
                type="button"
                onClick={() => setShowReferral(true)}
                className={`w-full flex items-center justify-center gap-1.5 text-[10.5px] font-semibold text-[#facc15]/80 border border-dashed border-[#facc15]/20 bg-[#facc15]/[0.03] rounded-[13px] py-2 mb-4 cursor-pointer transition-colors hover:text-[#facc15] hover:border-[#facc15]/40 hover:bg-[#facc15]/[0.06] ${FONT}`}
              >
                <Gift size={13} /> Have a referral code?
              </button>
            ) : (
              <div className="field-in mb-4">
                <div className="relative mb-1.5">
                  <Gift
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#facc15]/70 pointer-events-none"
                  />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Referral Code"
                    value={referralCode}
                    onChange={(e) =>
                      setReferralCode(e.target.value.toUpperCase())
                    }
                    className={`w-full pl-[42px] pr-4 py-[11px] sm:py-[12.5px] rounded-[13px] border border-dashed border-[#facc15]/25 bg-[#facc15]/[0.04] text-[#facc15] outline-none text-[12.5px] sm:text-[13.5px] tracking-wide backdrop-blur-[10px] transition-all duration-200 placeholder:text-[#a1861f] placeholder:tracking-normal focus:border-[#facc15]/60 focus:bg-[#facc15]/[0.07] focus:shadow-[0_0_0_3px_rgba(250,204,21,0.1)] ${FONT}`}
                  />
                </div>
                <p className="text-[#71717a] text-[9px] ml-0.5">
                  Unlocks bonus coins for both of you.
                </p>
              </div>
            )}

            {error && (
              <p className="field-in flex items-center justify-center gap-1.5 text-[#ff5c5c] text-[11px] m-0 mb-[10px] text-center">
                <AlertCircle size={13} /> {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-[12px] sm:py-[13.5px] rounded-[13px] border-none bg-gradient-to-br from-[#facc15] to-[#ffb300] text-black font-extrabold text-[13px] sm:text-[14px] cursor-pointer shadow-[0_0_18px_rgba(250,204,21,0.2)] transition-all duration-200 flex items-center justify-center gap-2 ${FONT} ${
                loading
                  ? "opacity-75 cursor-not-allowed"
                  : "hover:-translate-y-0.5 hover:shadow-[0_4px_24px_rgba(250,204,21,0.35)] active:translate-y-0"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Create Account <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* trust strip */}
          <div className="flex items-center justify-center gap-4 mt-4 text-[9px] sm:text-[10px] text-[#8b8b93] font-semibold">
            <span className="flex items-center gap-1">
              <ShieldCheck size={11} className="text-[#facc15]" /> Encrypted
            </span>
            <span className="w-px h-3 bg-white/10" />
            <span className="flex items-center gap-1">
              <Zap size={11} className="text-[#facc15]" /> Instant Setup
            </span>
          </div>

          <p className="text-center mt-4 text-[#a1a1aa] text-[11px] sm:text-[12px]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#facc15] no-underline font-bold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;

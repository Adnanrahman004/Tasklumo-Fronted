import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import {
  KeyRound,
  Mail,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Send,
  ArrowLeft,
  Loader2,
  Check,
} from "lucide-react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const FONT = "font-[Poppins,sans-serif]";

  const handleSend = async (e) => {
    e.preventDefault();
    if (!email) {
      setSent(false);
      setMessage("Please enter email");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password/send-otp",
        {
          email,
        },
      );
      setLoading(false);
      if (res.data.success) {
        setOtpSent(true);
        setSent(true);
        setMessage("OTP sent successfully. Check your Gmail.");
      }
    } catch (err) {
      setLoading(false);
      setSent(false);
      setMessage(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password/verify-otp",
        {
          email,
          otp,
        },
      );
      setLoading(false);
      if (res.data.success) {
        setOtpVerified(true);
        setSent(true);
        setMessage("OTP verified successfully");
      }
    } catch (err) {
      setLoading(false);
      setSent(false);
      setMessage(err.response?.data?.message || "Invalid OTP");
    }
  };

  const resetPassword = async () => {
    if (!password || !confirmPassword) {
      setSent(false);
      setMessage("Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      setSent(false);
      setMessage("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password/reset-password",
        {
          email,
          password,
        },
      );
      setLoading(false);
      if (res.data.success) {
        setSent(true);
        setMessage("Password changed successfully");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } catch (err) {
      setLoading(false);
      setSent(false);
      setMessage(err.response?.data?.message || "Failed to reset password");
    }
  };

  // step: 1 = enter email, 2 = enter otp, 3 = new password
  const step = otpVerified ? 3 : otpSent ? 2 : 1;

  const inputClass = `w-full pl-[42px] pr-4 py-[13px] rounded-[14px] border border-white/[0.07] bg-white/[0.035] text-white outline-none text-[13px] sm:text-[13.5px] backdrop-blur-[10px] transition-all duration-200 placeholder:text-[#6b6b72] focus:border-[#facc15]/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(250,204,21,0.1)] ${FONT}`;

  return (
    <div
      className={`min-h-screen w-full flex justify-center items-center p-4 sm:p-6 text-white ${FONT}
      bg-[radial-gradient(circle_at_bottom_left,rgba(255,120,40,0.32),transparent_35%),radial-gradient(circle_at_top_right,rgba(255,140,0,0.20),transparent_28%),linear-gradient(135deg,#050505_0%,#0a0a0a_40%,#120909_100%)]`}
    >
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fieldPop {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulseRing {
          0% { box-shadow: 0 0 0 0 rgba(250,204,21,0.35); }
          100% { box-shadow: 0 0 0 9px rgba(250,204,21,0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .field-in { animation: fadeIn 0.35s ease both; }
        .field-pop { animation: fieldPop 0.3s ease both; }
        .spin-icon { animation: spin 0.8s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .field-in, .field-pop { animation: none; }
        }
      `}</style>

      <div className="w-full max-w-[420px] relative mx-auto">
        {/* ambient glow behind the card */}
        <div className="absolute -inset-4 sm:-inset-8 bg-[radial-gradient(circle_at_50%_0%,rgba(250,204,21,0.16),transparent_70%)] blur-2xl pointer-events-none" />

        <div className="relative bg-[#0d0d0d]/[0.94] border border-[#facc15]/[0.14] rounded-[22px] sm:rounded-[26px] p-5 xs:p-6 sm:p-8 backdrop-blur-[20px] shadow-[0_0_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] animate-[fadeSlideUp_0.5s_ease_both]">
          {/* top accent hairline */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-px bg-gradient-to-r from-transparent via-[#facc15]/60 to-transparent rounded-full" />

          {/* Back link */}
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-[#a1a1aa] text-[10.5px] font-semibold no-underline mb-5 hover:text-[#facc15] transition-colors"
          >
            <ArrowLeft size={13} /> Back to login
          </Link>

          {/* Icon badge + heading */}
          <div className="flex items-center gap-3 mb-5">
            <div
              className="shrink-0 w-[50px] h-[50px] sm:w-[54px] sm:h-[54px] rounded-full bg-[#facc15]/[0.08] border border-[#facc15]/20 flex items-center justify-center"
              style={{ animation: "pulseRing 2.4s ease-in-out infinite" }}
            >
              <KeyRound size={21} className="text-[#facc15]" />
            </div>
            <div className="min-w-0">
              <h1 className="text-[23px] sm:text-[26px] font-black leading-[1.1] m-0 bg-gradient-to-br from-[#facc15] to-[#ffb300] bg-clip-text text-transparent truncate">
                Forgot Password
              </h1>
              <p className="text-[#a1a1aa] text-[10.5px] sm:text-[11.5px] m-0 mt-1 flex items-center gap-1">
                <ShieldCheck size={11} className="text-[#facc15] shrink-0" />
                Recover your TaskLumo account
              </p>
            </div>
          </div>

          {/* STEP INDICATOR */}
          <div className="flex items-center gap-1.5 mb-6 px-0.5">
            {[
              { n: 1, label: "Email" },
              { n: 2, label: "OTP" },
              { n: 3, label: "Password" },
            ].map((s, i) => (
              <div key={s.n} className="flex items-center gap-1.5 flex-1">
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-bold transition-all duration-300 border ${
                      step > s.n
                        ? "bg-[#facc15] border-[#facc15] text-black"
                        : step === s.n
                          ? "bg-[#facc15]/15 border-[#facc15] text-[#facc15]"
                          : "bg-white/[0.03] border-white/10 text-[#6b6b72]"
                    }`}
                  >
                    {step > s.n ? <Check size={12} /> : s.n}
                  </div>
                  <span
                    className={`text-[7.5px] sm:text-[8.5px] font-semibold tracking-wide uppercase ${
                      step >= s.n ? "text-[#facc15]" : "text-[#5f5f66]"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < 2 && (
                  <div
                    className={`h-px flex-1 -mt-3.5 transition-all duration-300 ${
                      step > s.n ? "bg-[#facc15]/60" : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* FORM */}
          <form onSubmit={handleSend}>
            {/* EMAIL */}
            <div className="relative mb-3">
              <Mail
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={otpSent}
                className={`${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`}
              />
              {otpSent && (
                <CheckCircle2
                  size={15}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4ade80]"
                />
              )}
            </div>

            {/* OTP */}
            {otpSent && !otpVerified && (
              <div className="field-pop mb-3">
                <div className="relative mb-2.5">
                  <ShieldCheck
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none"
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className={`${inputClass} tracking-[4px] font-semibold`}
                  />
                </div>
                <button
                  type="button"
                  onClick={verifyOtp}
                  disabled={loading || !otp}
                  className={`w-full py-[12.5px] rounded-[14px] border-none bg-gradient-to-br from-[#facc15] to-[#ffb300] text-black font-extrabold text-[12.5px] sm:text-[13.5px] cursor-pointer shadow-[0_0_16px_rgba(250,204,21,0.18)] transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${FONT}`}
                >
                  {loading ? (
                    <Loader2 size={15} className="spin-icon" />
                  ) : (
                    <ShieldCheck size={15} />
                  )}
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
                <p className="text-[#71717a] text-[9.5px] text-center mt-2.5">
                  Didn't get the code?{" "}
                  <button
                    type="button"
                    onClick={handleSend}
                    className="text-[#facc15] font-semibold hover:underline"
                  >
                    Resend
                  </button>
                </p>
              </div>
            )}

            {/* NEW PASSWORD */}
            {otpVerified && (
              <div className="field-pop">
                <div className="relative mb-2.5">
                  <Lock
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="relative mb-3">
                  <Lock
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none"
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <button
                  type="button"
                  onClick={resetPassword}
                  disabled={loading || !password || !confirmPassword}
                  className={`w-full py-[13px] rounded-[14px] border-none bg-gradient-to-br from-[#4ade80] to-[#22c55e] text-black font-extrabold text-[12.5px] sm:text-[13.5px] cursor-pointer shadow-[0_0_16px_rgba(74,222,128,0.2)] transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${FONT}`}
                >
                  {loading ? (
                    <Loader2 size={15} className="spin-icon" />
                  ) : (
                    <Lock size={15} />
                  )}
                  {loading ? "Updating..." : "Reset Password"}
                </button>
              </div>
            )}

            {/* MESSAGE */}
            {message && (
              <div
                className={`field-in flex items-center gap-2 text-[10.5px] sm:text-[11px] mt-3 mb-1 px-3 py-2.5 rounded-xl border ${
                  sent
                    ? "text-[#4ade80] bg-[#4ade80]/[0.08] border-[#4ade80]/20"
                    : "text-[#ff5c5c] bg-[#ff5c5c]/[0.08] border-[#ff5c5c]/20"
                }`}
              >
                {sent ? (
                  <CheckCircle2 size={14} className="shrink-0" />
                ) : (
                  <AlertCircle size={14} className="shrink-0" />
                )}
                {message}
              </div>
            )}

            {/* SEND OTP BUTTON */}
            {!otpSent && (
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-[13px] sm:py-[14px] rounded-[14px] border-none bg-gradient-to-br from-[#facc15] to-[#ffb300] text-black font-extrabold text-[13px] sm:text-[14px] cursor-pointer mt-1 shadow-[0_0_18px_rgba(250,204,21,0.22)] transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_4px_24px_rgba(250,204,21,0.35)] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${FONT}`}
              >
                {loading ? (
                  <Loader2 size={15} className="spin-icon" />
                ) : (
                  <Send size={15} />
                )}
                {loading ? "Sending..." : "Send Request"}
              </button>
            )}
          </form>

          {/* trust strip */}
          <div className="flex items-center justify-center gap-4 mt-5 text-[9px] sm:text-[10px] text-[#8b8b93] font-semibold">
            <span className="flex items-center gap-1">
              <ShieldCheck size={11} className="text-[#facc15]" /> Encrypted
            </span>
            <span className="w-px h-3 bg-white/10" />
            <span className="flex items-center gap-1">
              <KeyRound size={11} className="text-[#facc15]" /> Secure Reset
            </span>
          </div>

          {/* LOGIN */}
          <p className="text-center mt-4 text-[#a1a1aa] text-[11px] sm:text-[12px]">
            Remember your password?{" "}
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

export default ForgotPassword;

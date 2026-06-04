"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { signupApi, verifyOtpApi, resendOtpApi } from "@/lib/auth";
import { Eye, EyeOff, Loader2, Mail, CheckCircle2 } from "lucide-react";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore();

  const initialStep = searchParams.get("step") === "verify" ? 2 : 1;
  const initialEmail = searchParams.get("email") || "";

  const [step, setStep] = useState(initialStep);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown for resend OTP
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setIsLoading(true);
    try {
      await signupApi({ firstName, lastName, email, password });
      setStep(2);
      setCountdown(60);
    } catch (err: any) {
      setError(err.message || "Signup failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    if (val && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpStr = otp.join("");
    if (otpStr.length !== 6) { setError("Please enter the complete 6-digit OTP."); return; }
    setError(null);
    setIsLoading(true);
    try {
      const data = await verifyOtpApi({ email, otp: otpStr });
      setUser(data.user);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setError(null);
    try {
      await resendOtpApi({ email });
      setCountdown(60);
      setOtp(["", "", "", "", "", ""]);
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 bg-[#2d2d2d] rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">VedaAI</span>
          </Link>
          {step === 1 ? (
            <>
              <h1 className="text-2xl font-extrabold text-gray-900">Create your account</h1>
              <p className="text-gray-500 text-sm mt-1">Free forever. Start generating papers in seconds.</p>
            </>
          ) : (
            <>
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Mail size={26} className="text-[#f97316]" />
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900">Check your email</h1>
              <p className="text-gray-500 text-sm mt-1">
                We sent a 6-digit code to<br /><strong className="text-gray-700">{email}</strong>
              </p>
            </>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          {step === 1 ? (
            <form onSubmit={handleSignup} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">First Name</label>
                  <input
                    type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Rahul" required
                    className="w-full h-12 px-4 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none transition-all bg-gray-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Last Name</label>
                  <input
                    type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                    placeholder="Sharma" required
                    className="w-full h-12 px-4 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none transition-all bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@school.edu" required
                  className="w-full h-12 px-4 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none transition-all bg-gray-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"} value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters" required
                    className="w-full h-12 px-4 pr-12 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none transition-all bg-gray-50 focus:bg-white"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 font-medium">{error}</div>
              )}

              <button type="submit" disabled={isLoading}
                className="w-full h-12 bg-[#f97316] hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-all shadow-sm shadow-orange-200 disabled:opacity-70 flex items-center justify-center gap-2">
                {isLoading ? <><Loader2 size={18} className="animate-spin" /> Creating account...</> : "Create Account & Get OTP"}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              {/* OTP Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">Enter the 6-digit code</label>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text" inputMode="numeric" maxLength={1} value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none transition-all bg-gray-50 focus:bg-white"
                    />
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 font-medium text-center">{error}</div>
              )}

              <button onClick={handleVerifyOtp} disabled={isLoading}
                className="w-full h-12 bg-[#f97316] hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-all shadow-sm shadow-orange-200 disabled:opacity-70 flex items-center justify-center gap-2">
                {isLoading ? <><Loader2 size={18} className="animate-spin" /> Verifying...</> : <><CheckCircle2 size={18} /> Verify & Continue</>}
              </button>

              <div className="text-center">
                <button onClick={handleResend} disabled={countdown > 0}
                  className={`text-sm font-semibold transition-colors ${countdown > 0 ? "text-gray-400 cursor-not-allowed" : "text-[#f97316] hover:text-orange-600"}`}>
                  {countdown > 0 ? `Resend code in ${countdown}s` : "Didn't receive it? Resend code"}
                </button>
              </div>

              <div className="text-center">
                <button onClick={() => { setStep(1); setOtp(["", "", "", "", "", ""]); setError(null); }}
                  className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                  ← Change email address
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-[#f97316] font-bold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-orange-50"><Loader2 size={32} className="animate-spin text-orange-400" /></div>}>
      <SignupContent />
    </Suspense>
  );
}

import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AuthCard from "../../components/ui/AuthCard";
import PasswordInput from "../../components/ui/PasswordInput";
import { authApi } from "../../lib/api";

// ── Step indicator ────────────────────────────────────────────────────────

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[1, 2, 3].map((step, index) => (
        <div key={step} className="flex items-center gap-2">
          {/* Circle */}
          <div
            className={`w-3 h-3 rounded-full transition-colors ${
              step <= currentStep ? "bg-[#D32F2F]" : "bg-[#3a3a3a]"
            }`}
          />
          {/* Line between circles */}
          {index < 2 && (
            <div
              className={`w-16 h-0.5 transition-colors ${
                step < currentStep ? "bg-[#D32F2F]" : "bg-[#3a3a3a]"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Step 1 — Email ────────────────────────────────────────────────────────

function StepEmail({ onNext }: { onNext: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      await authApi.post("/auth/forgot-password/", { email });
      onNext(email);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-white mb-1">
        Reset your password
      </h1>
      <p className="text-sm text-gray-400 mb-6">
        Enter your email and we'll send you a 6-digit code
      </p>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm text-gray-300 mb-1.5">
            Email address
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl text-sm
              bg-[#2a2a2a] text-white placeholder-gray-500
              border ${error ? "border-red-500" : "border-[#3a3a3a]"}
              focus:outline-none focus:border-[#D32F2F] transition-colors`}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl font-semibold text-white text-sm
            bg-[#D32F2F] hover:bg-[#B71C1C] disabled:opacity-60
            disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending code...
            </span>
          ) : (
            "Send Code"
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="flex items-center justify-center gap-2 text-sm text-gray-400
            hover:text-gray-200 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to login
        </Link>
      </div>
    </>
  );
}

// ── Step 2 — OTP ──────────────────────────────────────────────────────────

function StepOtp({
  email,
  onNext,
}: {
  email: string;
  onNext: (otp: string) => void;
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    // Only allow single digit
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    // On backspace with empty field, go back
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasted)) return;
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    // Focus last filled input
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      await authApi.post("/auth/forgot-password/", { email });
      setCountdown(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch {
      setError("Failed to resend code. Try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const code = otp.join("");
    if (code.length < 6) {
      setError("Enter the complete 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      await authApi.post("/auth/verify-otp/", { email, otp: code });
      onNext(code);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Invalid code. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-white mb-1">Check your email</h1>
      <p className="text-sm text-gray-400 mb-6">
        We sent a 6-digit code to {email}
      </p>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OTP boxes */}
        <div className="flex gap-3 justify-between" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`
                w-12 h-12 text-center text-lg font-semibold rounded-xl
                bg-[#2a2a2a] text-white
                border-2 ${digit ? "border-[#D32F2F]" : "border-[#3a3a3a]"}
                focus:outline-none focus:border-[#D32F2F]
                transition-colors
              `}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl font-semibold text-white text-sm
            bg-[#D32F2F] hover:bg-[#B71C1C] disabled:opacity-60
            disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Verifying...
            </span>
          ) : (
            "Verify Code"
          )}
        </button>
      </form>

      {/* Resend countdown */}
      <div className="mt-6 text-center">
        {canResend ? (
          <button
            onClick={handleResend}
            className="text-sm text-[#D32F2F] hover:text-[#B71C1C] transition-colors"
          >
            Resend code
          </button>
        ) : (
          <p className="text-sm text-gray-500">
            Resend in {formatTime(countdown)}
          </p>
        )}
      </div>
    </>
  );
}

// ── Step 3 — New Password ─────────────────────────────────────────────────

function StepNewPassword({ email, otp }: { email: string; otp: string }) {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Must be at least 8 characters";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await authApi.post("/auth/reset-password/", {
        email,
        otp,
        newPassword: password,
        confirmPassword,
      });
      navigate("/login", {
        state: { message: "Password reset successful. Please log in." },
      });
    } catch (err: any) {
      setErrors({
        global:
          err?.response?.data?.message ||
          "Failed to reset password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-white mb-1">Set a new password</h1>
      <p className="text-sm text-gray-400 mb-6">
        Create a strong password for your account
      </p>

      {errors.global && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {errors.global}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm text-gray-300 mb-1.5"
          >
            New password
          </label>
          <PasswordInput
            id="newPassword"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm text-gray-300 mb-1.5"
          >
            Confirm new password
          </label>
          <PasswordInput
            id="confirmPassword"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl font-semibold text-white text-sm
            bg-[#D32F2F] hover:bg-[#B71C1C] disabled:opacity-60
            disabled:cursor-not-allowed transition-colors mt-2"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Resetting...
            </span>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  return (
    <AuthCard>
      <StepIndicator currentStep={step} />

      {step === 1 && (
        <StepEmail
          onNext={(submittedEmail) => {
            setEmail(submittedEmail);
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <StepOtp
          email={email}
          onNext={(submittedOtp) => {
            setOtp(submittedOtp);
            setStep(3);
          }}
        />
      )}

      {step === 3 && <StepNewPassword email={email} otp={otp} />}
    </AuthCard>
  );
}

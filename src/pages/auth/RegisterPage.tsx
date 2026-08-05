import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AuthCard from "../../components/ui/AuthCard";
import PasswordInput from "../../components/ui/PasswordInput";
import OAuthButtons from "../../components/ui/OAuthButtons";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }
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

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await register({ fullName, email, password, confirmPassword });
      navigate("/dashboard");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        "Registration failed. Please try again.";
      setErrors({ global: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard>
      <h1 className="text-2xl font-bold text-white mb-1">
        Create your account
      </h1>
      <p className="text-sm text-gray-400 mb-6">
        Start your learning journey with BigO Academy
      </p>

      {/* Global error */}
      {errors.global && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {errors.global}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full name */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm text-gray-300 mb-1.5"
          >
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl text-sm
              bg-[#2a2a2a] text-white placeholder-gray-500
              border ${errors.fullName ? "border-red-500" : "border-[#3a3a3a]"}
              focus:outline-none focus:border-[#D32F2F] transition-colors`}
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-400">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
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
              border ${errors.email ? "border-red-500" : "border-[#3a3a3a]"}
              focus:outline-none focus:border-[#D32F2F] transition-colors`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-400">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm text-gray-300 mb-1.5"
          >
            Password
          </label>
          <PasswordInput
            id="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          {!errors.password && (
            <p className="mt-1 text-xs text-gray-500">
              Must be at least 8 characters
            </p>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm text-gray-300 mb-1.5"
          >
            Confirm password
          </label>
          <PasswordInput
            id="confirmPassword"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
          />
        </div>

        {/* Submit */}
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
              Creating account...
            </span>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      {/* OAuth */}
      <OAuthButtons label="sign up" />

      {/* Login link */}
      <p className="text-center text-sm text-gray-400 mt-6">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-[#D32F2F] hover:text-[#B71C1C] font-medium transition-colors"
        >
          Log in
        </Link>
      </p>
    </AuthCard>
  );
}

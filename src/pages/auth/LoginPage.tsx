import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AuthCard from "../../components/ui/AuthCard";
import PasswordInput from "../../components/ui/PasswordInput";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(searchParams.get("error") || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password });

      // Redirect based on role — AuthContext stores the user
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const user = JSON.parse(savedUser);
        if (user.role === "ADMIN") navigate("/admin");
        else if (user.role === "TEACHER") navigate("/teacher");
        else navigate("/dashboard");
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        "Invalid email or password";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard>
      <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
      <p className="text-sm text-gray-400 mb-6">
        Log in to your account to continue learning
      </p>

      {/* Global error */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full px-4 py-3 rounded-xl text-sm
              bg-[#2a2a2a] text-white placeholder-gray-500
              border border-[#3a3a3a] focus:outline-none
              focus:border-[#D32F2F] transition-colors"
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="text-sm text-gray-300">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-[#D32F2F] hover:text-[#B71C1C] transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
              Logging in...
            </span>
          ) : (
            "Log In"
          )}
        </button>
      </form>

      {/* Admin Provisioning Note */}
      <p className="text-center text-xs text-gray-400 mt-6 leading-relaxed">
        BigO Academy accounts are provisioned exclusively by administrators. Use the login credentials emailed to you upon admission.
      </p>
    </AuthCard>
  );
}

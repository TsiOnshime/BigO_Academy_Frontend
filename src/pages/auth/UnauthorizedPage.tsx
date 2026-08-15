import { useNavigate } from "react-router-dom";
import AuthCard from "../../components/ui/AuthCard";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user.role === "ADMIN") {
          navigate("/admin");
          return;
        }
        if (user.role === "TEACHER") {
          navigate("/teacher");
          return;
        }
        if (user.role === "STUDENT") {
          navigate("/dashboard");
          return;
        }
      } catch {
        // ignore parse error
      }
    }
    navigate("/dashboard");
  };

  return (
    <AuthCard>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-sm text-gray-400 mb-6">
          You don't have permission to view this page.
        </p>
        <button
          onClick={handleBackToDashboard}
          className="w-full py-3 rounded-xl font-semibold text-white text-sm
            bg-[#D32F2F] hover:bg-[#B71C1C] transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </AuthCard>
  );
}

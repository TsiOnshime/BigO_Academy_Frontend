import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PasswordInput from "../../components/ui/PasswordInput";
import { authApi } from "../../lib/api";

export default function AdminSecurityPage() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.currentPassword)
      e.currentPassword = "Current password is required";
    if (!form.newPassword) e.newPassword = "New password is required";
    else if (form.newPassword.length < 8)
      e.newPassword = "Must be at least 8 characters";
    if (!form.confirmPassword)
      e.confirmPassword = "Please confirm your password";
    else if (form.newPassword !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setIsLoading(true);
    setSuccess(false);
    try {
      await authApi.post("/auth/change-password/", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });
      setSuccess(true);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setErrors({
        global:
          err?.response?.data?.message ||
          "Failed to update password. Check your current password.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout title="Security Settings">
      <div className="max-w-xl">
        <p className="text-gray-400 text-sm mb-6">
          Manage your password and account security
        </p>

        <div className="bg-[#242424] rounded-2xl p-6">
          <h2 className="text-white font-semibold text-lg mb-1">
            Change Password
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Update your password to keep your account secure
          </p>

          {errors.global && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {errors.global}
            </div>
          )}

          {success && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
              Password updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">
                Current password
              </label>
              <PasswordInput
                id="currentPassword"
                placeholder="Enter current password"
                value={form.currentPassword}
                onChange={(e) =>
                  setForm({ ...form, currentPassword: e.target.value })
                }
                error={errors.currentPassword}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1.5">
                New password
              </label>
              <PasswordInput
                id="newPassword"
                placeholder="Enter new password"
                value={form.newPassword}
                onChange={(e) =>
                  setForm({ ...form, newPassword: e.target.value })
                }
                error={errors.newPassword}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1.5">
                Confirm new password
              </label>
              <PasswordInput
                id="confirmPassword"
                placeholder="Re-enter new password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                error={errors.confirmPassword}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C]
                  text-white text-sm font-semibold disabled:opacity-60
                  transition-colors"
              >
                {isLoading ? "Updating..." : "Update Password"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                  setErrors({});
                  setSuccess(false);
                }}
                className="px-6 py-3 rounded-xl border border-[#3a3a3a]
                  text-gray-400 text-sm hover:text-white hover:border-gray-500
                  transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

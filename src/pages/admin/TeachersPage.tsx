import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  X,
  Wand2,
  CheckCircle2,
  Copy,
  Check,
  KeyRound,
  Mail,
  User,
  ShieldCheck,
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  getAllTeachers,
  activateTeacher,
  deactivateTeacher,
  createTeacher,
  createAuthAccount,
  activateAuthAccount,
  deactivateAuthAccount,
} from "../../lib/adminApi";

const statusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-400/10 text-green-400";
    case "PENDING":
      return "bg-yellow-400/10 text-yellow-400";
    default:
      return "bg-gray-400/10 text-gray-400";
  }
};

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    status: "ACTIVE",
  });
  const [formError, setFormError] = useState("");
  const [createdCredentials, setCreatedCredentials] = useState<{
    email: string;
    fullName: string;
    password: string;
    userId: string;
    status: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchTeachers = async () => {
    try {
      const res = await getAllTeachers();
      setTeachers(res.data.teachers || []);
      setFiltered(res.data.teachers || []);
    } catch {
      setError("Failed to load teachers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(teachers);
      return;
    }
    const q = search.toLowerCase();
    setFiltered(
      teachers.filter(
        (t) =>
          t.fullName?.toLowerCase().includes(q) ||
          t.email?.toLowerCase().includes(q),
      ),
    );
  }, [search, teachers]);

  const handleActivate = async (teacher: any) => {
    setActionLoading(teacher.id);
    try {
      await activateTeacher(teacher.id);
      if (teacher.userId) {
        try {
          await activateAuthAccount(teacher.userId);
        } catch {
          // Ignore if already active in auth
        }
      }
      await fetchTeachers();
    } catch {
      setError("Failed to activate teacher");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeactivate = async (teacher: any) => {
    setActionLoading(teacher.id);
    try {
      await deactivateTeacher(teacher.id);
      if (teacher.userId) {
        try {
          await deactivateAuthAccount(teacher.userId);
        } catch {
          // Ignore
        }
      }
      await fetchTeachers();
    } catch {
      setError("Failed to deactivate teacher");
    } finally {
      setActionLoading(null);
    }
  };

  const generatePassword = () => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pass = "";
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm((prev) => ({ ...prev, password: pass }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim()) {
      setFormError("Full Name and Email are required.");
      return;
    }
    setIsSubmitting(true);
    setFormError("");
    try {
      const finalPassword = form.password.trim() || undefined;

      // 1. Create User in auth-service
      const authRes = await createAuthAccount({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        role: "TEACHER",
        password: finalPassword,
        status: form.status,
      });

      const user = authRes.data;
      const assignedUserId = user.userId || user.id;
      const assignedPassword =
        finalPassword || user.temporaryPassword || "Temporary password sent via email";

      // 2. Create Teacher in academic-service
      const academicRes = await createTeacher({
        userId: assignedUserId,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
      });

      // 3. If ACTIVE was selected, activate in academic-service
      if (form.status === "ACTIVE" && academicRes.data?.id) {
        try {
          await activateTeacher(academicRes.data.id);
        } catch {
          // Ignore if already active
        }
      }

      setShowModal(false);
      setForm({ fullName: "", email: "", password: "", status: "ACTIVE" });
      setCreatedCredentials({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: assignedPassword,
        userId: assignedUserId,
        status: form.status,
      });
      await fetchTeachers();
    } catch (err: any) {
      setFormError(
        err?.response?.data?.message ||
          err?.response?.data?.detail ||
          "Failed to create teacher. Ensure email is unique.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyCredentials = () => {
    if (!createdCredentials) return;
    const text = `BigO Academy Teacher Credentials:\nName: ${createdCredentials.fullName}\nEmail: ${createdCredentials.email}\nPassword: ${createdCredentials.password}\nLogin URL: ${window.location.origin}/login`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <DashboardLayout title="Teachers">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Search teachers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#242424] border border-[#3a3a3a] text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#D32F2F] transition-colors"
          />
        </div>
        <button
          onClick={() => {
            generatePassword();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-sm font-medium transition-colors shadow-lg shadow-[#D32F2F]/20"
        >
          <Plus size={16} /> Add Teacher
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#D32F2F] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-[#242424] rounded-2xl overflow-visible border border-[#2A2A32]">
          <div className="grid grid-cols-12 px-5 py-3 border-b border-[#2a2a2a] text-gray-500 text-xs font-medium uppercase">
            <span className="col-span-4">Teacher</span>
            <span className="col-span-3">Cohorts</span>
            <span className="col-span-2">Status</span>
            <span className="col-span-3 text-right">Actions</span>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-500 text-sm">
              No teachers found
            </div>
          ) : (
            filtered.map((teacher) => (
              <div
                key={teacher.id}
                className="grid grid-cols-12 px-5 py-4 border-b border-[#2a2a2a] last:border-0 hover:bg-[#2a2a2a] transition-colors items-center"
              >
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-400/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-400 text-sm font-bold">
                      {teacher.fullName?.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {teacher.fullName}
                    </p>
                    <p className="text-gray-500 text-xs truncate">
                      {teacher.email}
                    </p>
                  </div>
                </div>

                <div className="col-span-3">
                  <span className="text-gray-300 text-sm">
                    {teacher.assignedCohortIds?.length || 0} cohort
                    {teacher.assignedCohortIds?.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="col-span-2">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full ${statusColor(
                      teacher.status,
                    )}`}
                  >
                    {teacher.status}
                  </span>
                </div>

                <div className="col-span-3 flex justify-end gap-2">
                  {actionLoading === teacher.id ? (
                    <div className="w-5 h-5 border-2 border-[#D32F2F] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      {teacher.status === "PENDING" && (
                        <button
                          onClick={() => handleActivate(teacher)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-green-400/10 text-green-400 hover:bg-green-400/20 transition-colors font-medium"
                        >
                          Activate Account
                        </button>
                      )}
                      {teacher.status === "ACTIVE" && (
                        <button
                          onClick={() => handleDeactivate(teacher)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-gray-400/10 text-gray-400 hover:bg-gray-400/20 transition-colors font-medium"
                        >
                          Deactivate
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Success Credentials Modal */}
      {createdCredentials && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-[#1E1E24] border border-[#2E2E38] rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-3 text-emerald-400 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Teacher Account Created</h3>
                <p className="text-xs text-gray-400">Account is ready for login</p>
              </div>
            </div>

            <p className="text-xs text-gray-300 mb-4 leading-relaxed">
              The teacher account has been created and synced with authentication. Share the login credentials below with the teacher:
            </p>

            <div className="bg-[#151518] rounded-xl p-4 border border-[#2A2A32] space-y-3 mb-5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <User size={14} /> Full Name:
                </span>
                <span className="text-white font-medium">{createdCredentials.fullName}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Mail size={14} /> Email Address:
                </span>
                <span className="text-white font-mono">{createdCredentials.email}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <KeyRound size={14} /> Password:
                </span>
                <span className="text-emerald-400 font-mono font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                  {createdCredentials.password}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <ShieldCheck size={14} /> Status:
                </span>
                <span className="text-emerald-400 font-semibold">{createdCredentials.status}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={copyCredentials}
                className="flex-1 py-2.5 rounded-xl bg-[#2A2A34] hover:bg-[#343440] text-white text-xs font-semibold flex items-center justify-center gap-2 border border-[#3A3A46] transition-colors"
              >
                {copied ? (
                  <>
                    <Check size={16} className="text-emerald-400" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} /> Copy Credentials
                  </>
                )}
              </button>
              <button
                onClick={() => setCreatedCredentials(null)}
                className="py-2.5 px-5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-semibold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create teacher modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-[#1E1E24] border border-[#2E2E38] rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-white font-bold text-lg">Add New Teacher</h3>
                <p className="text-xs text-gray-400">Creates an instructor login account and academic profile</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Full Name <span className="text-[#D32F2F]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  placeholder="e.g. Abel Getachew"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#24242C] border border-[#3a3a44] text-white text-sm focus:outline-none focus:border-[#D32F2F] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Email Address <span className="text-[#D32F2F]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. abel@bigo.edu"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#24242C] border border-[#3a3a44] text-white text-sm focus:outline-none focus:border-[#D32F2F] transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-gray-300">
                    Initial Password <span className="text-[#D32F2F]">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="text-xs text-[#EF5350] hover:underline flex items-center gap-1 font-medium"
                  >
                    <Wand2 size={12} /> Auto-generate
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="Enter initial password (min 8 characters)"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#24242C] border border-[#3a3a44] text-white text-sm font-mono focus:outline-none focus:border-[#D32F2F] transition-colors"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  The teacher will use this password to log in directly.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Account Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#24242C] border border-[#3a3a44] text-white text-sm focus:outline-none focus:border-[#D32F2F] transition-colors"
                >
                  <option value="ACTIVE">ACTIVE (Can log in immediately)</option>
                  <option value="PENDING">PENDING (Admin activates later)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#3a3a44] text-gray-400 text-xs font-medium hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-semibold disabled:opacity-60 transition-colors shadow-lg shadow-[#D32F2F]/20"
                >
                  {isSubmitting ? "Creating..." : "Create Teacher"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}


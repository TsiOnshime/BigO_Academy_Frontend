import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  Plus,
  X,
  Wand2,
  CheckCircle2,
  Copy,
  Check,
  KeyRound,
  Mail,
  User,
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  getAllStudents,
  updateStudentStatus,
  promoteStudent,
  graduateStudent,
  getAllCohorts,
  createAuthAccount,
  createStudent,
} from "../../lib/adminApi";

const STATUS_OPTIONS = ["ALL", "ACTIVE", "PROBATION", "DROPPED", "GRADUATED"];

const statusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-400/10 text-green-400";
    case "PROBATION":
      return "bg-yellow-400/10 text-yellow-400";
    case "GRADUATED":
      return "bg-blue-400/10 text-blue-400";
    case "DROPPED":
      return "bg-red-400/10 text-red-400";
    default:
      return "bg-gray-400/10 text-gray-400";
  }
};

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [cohortFilter, setCohortFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Add Student modal state
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    cohortId: "",
    codeforcesHandle: "",
    password: "",
    status: "ACTIVE",
  });
  const [createdCredentials, setCreatedCredentials] = useState<{
    fullName: string;
    email: string;
    cohortName: string;
    password: string;
    status: string;
    userId: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchCohorts = async () => {
    try {
      const res = await getAllCohorts();
      setCohorts(res.data.cohorts || []);
    } catch {
      // Non-blocking
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await getAllStudents({ size: 200 });
      setStudents(res.data.students || []);
      setFiltered(res.data.students || []);
    } catch {
      setError("Failed to load students");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCohorts();
    fetchStudents();
  }, []);

  useEffect(() => {
    let result = students;
    if (statusFilter !== "ALL") {
      result = result.filter((s) => s.status === statusFilter);
    }
    if (cohortFilter !== "ALL") {
      result = result.filter((s) => s.cohortId === cohortFilter || s.cohort_id === cohortFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.fullName?.toLowerCase().includes(q) ||
          s.full_name?.toLowerCase().includes(q) ||
          s.email?.toLowerCase().includes(q),
      );
    }
    setFiltered(result);
  }, [search, statusFilter, cohortFilter, students]);

  const generateRandomPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
    let pwd = "";
    for (let i = 0; i < 12; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm((prev) => ({ ...prev, password: pwd }));
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!form.fullName.trim() || !form.email.trim() || !form.cohortId) {
      setFormError("Full name, email address, and cohort are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Create Auth Account with role "STUDENT"
      const authRes = await createAuthAccount({
        email: form.email.trim(),
        fullName: form.fullName.trim(),
        role: "STUDENT",
        password: form.password.trim() || undefined,
        status: form.status,
      });

      const userId = authRes.data.userId || authRes.data.id || authRes.data.user?.id;
      const effectivePassword =
        form.password.trim() ||
        authRes.data.temporary_password ||
        authRes.data.temporaryPassword ||
        "Generated and sent to student email";

      // 2. Create Student Academic Record
      await createStudent({
        userId,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        cohortId: form.cohortId,
        codeforcesHandle: form.codeforcesHandle.trim() || undefined,
      });

      const assignedCohort = cohorts.find((c) => c.id === form.cohortId);
      const cohortName = assignedCohort ? assignedCohort.name : "Assigned Cohort";

      setCreatedCredentials({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        cohortName,
        password: effectivePassword,
        status: form.status,
        userId,
      });

      setShowModal(false);
      setForm({
        fullName: "",
        email: "",
        cohortId: "",
        codeforcesHandle: "",
        password: "",
        status: "ACTIVE",
      });

      await fetchStudents();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        (typeof err?.response?.data === "string" ? err.response.data : "") ||
        "Failed to onboard student. Please ensure the email is unique.";
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyCredentials = () => {
    if (!createdCredentials) return;
    const text = `BigO Academy - Student Portal Login Credentials\n\nStudent: ${createdCredentials.fullName}\nCohort: ${createdCredentials.cohortName}\nEmail: ${createdCredentials.email}\nPassword: ${createdCredentials.password}\nLogin URL: ${window.location.origin}/login\n\nPlease log in and change your password upon first access.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAction = async (
    studentId: string,
    action: "probation" | "active" | "promote" | "graduate",
  ) => {
    setActionLoading(studentId);
    setOpenMenu(null);
    try {
      if (action === "probation") {
        await updateStudentStatus(studentId, {
          status: "PROBATION",
          reason: "Admin action",
        });
      } else if (action === "active") {
        await updateStudentStatus(studentId, { status: "ACTIVE" });
      } else if (action === "promote") {
        await promoteStudent(studentId);
      } else if (action === "graduate") {
        await graduateStudent(studentId);
      }
      await fetchStudents();
    } catch {
      setError("Action failed. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <DashboardLayout title="Students">
      {/* Top action bar: Search, filters, and Add Student button */}
      <div className="flex flex-col md:flex-row gap-3 mb-6 items-stretch md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#242424] border
                border-[#3a3a3a] text-white placeholder-gray-500 text-sm
                focus:outline-none focus:border-[#D32F2F] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-[#242424] border border-[#3a3a3a]
                text-white text-sm focus:outline-none focus:border-[#D32F2F]"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s === "ALL" ? "All statuses" : s}
                </option>
              ))}
            </select>

            {cohorts.length > 0 && (
              <select
                value={cohortFilter}
                onChange={(e) => setCohortFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-[#242424] border border-[#3a3a3a]
                  text-white text-sm focus:outline-none focus:border-[#D32F2F]"
              >
                <option value="ALL">All cohorts</option>
                {cohorts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            setFormError("");
            if (cohorts.length > 0 && !form.cohortId) {
              setForm((prev) => ({ ...prev, cohortId: cohorts[0].id }));
            }
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-sm font-semibold shadow-lg shadow-[#D32F2F]/20 transition-colors"
        >
          <Plus size={16} />
          <span>Add Student</span>
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
        <div className="bg-[#242424] rounded-2xl border border-[#2a2a2a]">
          <div
            className="grid grid-cols-12 px-5 py-3 border-b border-[#2a2a2a]
            text-gray-500 text-xs font-medium uppercase"
          >
            <span className="col-span-4">Student</span>
            <span className="col-span-2">Cohort / Year</span>
            <span className="col-span-2">Attendance</span>
            <span className="col-span-2">Status</span>
            <span className="col-span-2 text-right">Actions</span>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-500 text-sm">
              No students found
            </div>
          ) : (
            filtered.map((student) => {
              const name = student.fullName || student.full_name || "Unknown";
              const email = student.email || "";
              const yearPhase = student.yearPhase || student.year_phase || 1;
              const cohortDisplay = student.cohort_name || student.cohortName || `Year ${yearPhase}`;
              const att =
                student.attendancePercentage !== undefined &&
                student.attendancePercentage !== null
                  ? Number(student.attendancePercentage)
                  : student.attendance_percentage !== undefined &&
                    student.attendance_percentage !== null
                  ? Number(student.attendance_percentage)
                  : 100;

              return (
                <div
                  key={student.id}
                  className={`grid grid-cols-12 px-5 py-4 border-b border-[#2a2a2a]
                    last:border-0 hover:bg-[#2a2a2a] transition-colors items-center relative ${
                      openMenu === student.id ? "z-30" : "z-0"
                    }`}
                >
                  {/* Name */}
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#D32F2F]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#D32F2F] text-sm font-bold">
                        {name.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-white text-sm font-medium truncate">
                          {name}
                        </p>
                        {(student.codeforcesHandle || student.codeforces_handle) && (
                          <a
                            href={`https://codeforces.com/profile/${student.codeforcesHandle || student.codeforces_handle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30 hover:bg-blue-500/25 transition-colors shrink-0"
                            title={`Codeforces: ${student.codeforcesHandle || student.codeforces_handle} (Rating: ${student.codeforcesRating || student.codeforces_rating || 'unrated'})`}
                          >
                            CF: {student.codeforcesHandle || student.codeforces_handle}
                          </a>
                        )}
                      </div>
                      <p className="text-gray-500 text-xs truncate">
                        {email}
                      </p>
                    </div>
                  </div>

                  {/* Cohort & Year */}
                  <div className="col-span-2">
                    <p className="text-gray-200 text-sm font-medium truncate">
                      {cohortDisplay}
                    </p>
                    <p className="text-gray-500 text-xs">
                      Phase {yearPhase}
                    </p>
                  </div>

                  {/* Attendance */}
                  <div className="col-span-2 flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-[#3a3a3a] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          att >= 80
                            ? "bg-green-400"
                            : att >= 60
                              ? "bg-yellow-400"
                              : "bg-red-400"
                        }`}
                        style={{ width: `${att}%` }}
                      />
                    </div>
                    <span className="text-gray-300 text-sm">
                      {Math.round(att)}%
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full ${statusColor(student.status)}`}
                    >
                      {student.status}
                    </span>
                  </div>

                  {/* Actions dropdown */}
                  <div className="col-span-2 flex justify-end relative">
                    {actionLoading === student.id ? (
                      <div className="w-5 h-5 border-2 border-[#D32F2F] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <button
                        onClick={() =>
                          setOpenMenu(openMenu === student.id ? null : student.id)
                        }
                        className="flex items-center gap-1 text-gray-400 hover:text-white
                          text-xs px-3 py-1.5 rounded-lg hover:bg-[#3a3a3a] transition-colors"
                      >
                        Actions <ChevronDown size={14} />
                      </button>
                    )}

                    {openMenu === student.id && (
                      <div
                        className="absolute right-0 top-full mt-1 z-50 bg-[#242424] border
                        border-[#3a3a3a] rounded-xl shadow-2xl min-w-[170px] overflow-hidden py-1"
                      >
                        {student.status === "ACTIVE" && (
                          <button
                            onClick={() => {
                              handleAction(student.id, "probation");
                              setOpenMenu(null);
                            }}
                            className="w-full text-left px-4 py-2.5 text-xs text-yellow-400
                              hover:bg-[#2e2e2e] transition-colors font-medium"
                          >
                            Set Probation
                          </button>
                        )}
                        {student.status === "PROBATION" && (
                          <button
                            onClick={() => {
                              handleAction(student.id, "active");
                              setOpenMenu(null);
                            }}
                            className="w-full text-left px-4 py-2.5 text-xs text-green-400
                              hover:bg-[#2e2e2e] transition-colors font-medium"
                          >
                            Set Active
                          </button>
                        )}
                        {student.status === "ACTIVE" &&
                          (yearPhase === 1 || student.yearPhase === 1) && (
                            <button
                              onClick={() => {
                                handleAction(student.id, "promote");
                                setOpenMenu(null);
                              }}
                              className="w-full text-left px-4 py-2.5 text-xs text-blue-400
                                hover:bg-[#2e2e2e] transition-colors font-medium"
                            >
                              Promote to Year 2
                            </button>
                          )}
                        {student.status === "ACTIVE" &&
                          (yearPhase === 2 || student.yearPhase === 2) && (
                            <button
                              onClick={() => {
                                handleAction(student.id, "graduate");
                                setOpenMenu(null);
                              }}
                              className="w-full text-left px-4 py-2.5 text-xs text-purple-400
                                hover:bg-[#2e2e2e] transition-colors font-medium"
                            >
                              Graduate
                            </button>
                          )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {!isLoading && (
        <p className="text-gray-500 text-sm mt-3">
          Showing {filtered.length} of {students.length} students
        </p>
      )}

      {/* Success Credentials Modal */}
      {createdCredentials && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-[#1E1E24] border border-[#2E2E38] rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-emerald-400 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Student Onboarded!</h3>
                <p className="text-xs text-gray-400">Account and cohort enrollment active</p>
              </div>
            </div>

            <p className="text-xs text-gray-300 mb-4 leading-relaxed">
              The accepted student has been registered in the authentication system and enrolled in their cohort. Share the login credentials below:
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
                  <BookOpen size={14} /> Cohort:
                </span>
                <span className="text-[#D32F2F] font-semibold">{createdCredentials.cohortName}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Mail size={14} /> Email:
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
                    <Check size={16} className="text-emerald-400" /> Copied to Clipboard!
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

      {/* Add Student Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-[#1E1E24] border border-[#2E2E38] rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-white font-bold text-lg">Add Accepted Student</h3>
                <p className="text-xs text-gray-400">Creates an active student account and cohort profile</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Full Name <span className="text-[#D32F2F]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="e.g. Abebe Kebede"
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
                  placeholder="student@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#24242C] border border-[#3a3a44] text-white text-sm focus:outline-none focus:border-[#D32F2F] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Codeforces Handle <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={form.codeforcesHandle}
                  onChange={(e) => setForm({ ...form, codeforcesHandle: e.target.value })}
                  placeholder="e.g. tourist, beamlak_f"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#24242C] border border-[#3a3a44] text-white text-sm focus:outline-none focus:border-[#D32F2F] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Assign Cohort <span className="text-[#D32F2F]">*</span>
                </label>
                {cohorts.length === 0 ? (
                  <p className="text-xs text-yellow-400">
                    No active cohorts found. Please create a cohort first in Cohorts Management.
                  </p>
                ) : (
                  <select
                    required
                    value={form.cohortId}
                    onChange={(e) => setForm({ ...form, cohortId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#24242C] border border-[#3a3a44] text-white text-sm focus:outline-none focus:border-[#D32F2F] transition-colors"
                  >
                    <option value="" disabled>Select Cohort</option>
                    {cohorts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.enrolled_student_count || c.enrolledStudentCount || 0}/{c.student_capacity || c.studentCapacity || 50} students)
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-gray-300">
                    Initial Password
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="text-xs text-[#D32F2F] hover:text-[#B71C1C] font-medium flex items-center gap-1 transition-colors"
                  >
                    <Wand2 size={12} /> Auto-generate
                  </button>
                </div>
                <input
                  type="text"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Leave blank to auto-generate"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#24242C] border border-[#3a3a44] text-white text-sm font-mono focus:outline-none focus:border-[#D32F2F] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Initial Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#24242C] border border-[#3a3a44] text-white text-sm focus:outline-none focus:border-[#D32F2F] transition-colors"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="PROBATION">PROBATION</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#24242C] hover:bg-[#2e2e38] text-gray-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || cohorts.length === 0}
                  className="flex-1 py-2.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-lg shadow-[#D32F2F]/20 transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Onboarding...</span>
                    </>
                  ) : (
                    <span>Add Student</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

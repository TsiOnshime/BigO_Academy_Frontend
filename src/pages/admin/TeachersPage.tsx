import { useEffect, useState } from "react";
import { Search, Plus, X } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  getAllTeachers,
  activateTeacher,
  deactivateTeacher,
  createTeacher,
} from "../../lib/adminApi";
import { v4 as uuidv4 } from "uuid";

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
  const [form, setForm] = useState({ fullName: "", email: "" });
  const [formError, setFormError] = useState("");

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

  const handleActivate = async (teacherId: string) => {
    setActionLoading(teacherId);
    try {
      await activateTeacher(teacherId);
      await fetchTeachers();
    } catch {
      setError("Failed to activate teacher");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeactivate = async (teacherId: string) => {
    setActionLoading(teacherId);
    try {
      await deactivateTeacher(teacherId);
      await fetchTeachers();
    } catch {
      setError("Failed to deactivate teacher");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email) {
      setFormError("All fields are required");
      return;
    }
    setIsSubmitting(true);
    setFormError("");
    try {
      await createTeacher({
        userId: uuidv4(),
        fullName: form.fullName,
        email: form.email,
      });
      setShowModal(false);
      setForm({ fullName: "", email: "" });
      await fetchTeachers();
    } catch (err: any) {
      setFormError(err?.response?.data?.message || "Failed to create teacher");
    } finally {
      setIsSubmitting(false);
    }
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
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#242424] border
              border-[#3a3a3a] text-white placeholder-gray-500 text-sm
              focus:outline-none focus:border-[#D32F2F] transition-colors"
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl
            bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-sm
            font-medium transition-colors"
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
        <div className="bg-[#242424] rounded-2xl overflow-hidden">
          <div
            className="grid grid-cols-12 px-5 py-3 border-b border-[#2a2a2a]
            text-gray-500 text-xs font-medium uppercase"
          >
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
                className="grid grid-cols-12 px-5 py-4 border-b border-[#2a2a2a]
                  last:border-0 hover:bg-[#2a2a2a] transition-colors items-center"
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
                    className={`text-xs px-2.5 py-1 rounded-full ${statusColor(teacher.status)}`}
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
                          onClick={() => handleActivate(teacher.id)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-green-400/10
                            text-green-400 hover:bg-green-400/20 transition-colors"
                        >
                          Activate
                        </button>
                      )}
                      {teacher.status === "ACTIVE" && (
                        <button
                          onClick={() => handleDeactivate(teacher.id)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-gray-400/10
                            text-gray-400 hover:bg-gray-400/20 transition-colors"
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

      {/* Create teacher modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="bg-[#242424] rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold text-lg">Add Teacher</h3>
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
                <label className="block text-sm text-gray-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  placeholder="Selam Tesfaye"
                  className="w-full px-4 py-3 rounded-xl bg-[#2a2a2a] border
                    border-[#3a3a3a] text-white text-sm focus:outline-none
                    focus:border-[#D32F2F] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="selam@a2sv.org"
                  className="w-full px-4 py-3 rounded-xl bg-[#2a2a2a] border
                    border-[#3a3a3a] text-white text-sm focus:outline-none
                    focus:border-[#D32F2F] transition-colors"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl border border-[#3a3a3a]
                    text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C]
                    text-white text-sm font-medium disabled:opacity-60 transition-colors"
                >
                  {isSubmitting ? "Adding..." : "Add Teacher"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

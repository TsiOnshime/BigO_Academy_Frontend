import { useEffect, useState } from "react";
import { Plus, X, Users, BookOpen } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getAllCohorts, createCohort, archiveCohort } from "../../lib/adminApi";

export default function AdminCohortsPage() {
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [archivingId, setArchivingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    startDate: "",
    expectedGraduationDate: "",
    studentCapacity: "",
  });
  const [formError, setFormError] = useState("");

  const fetchCohorts = async () => {
    try {
      const res = await getAllCohorts();
      setCohorts(res.data.cohorts || []);
    } catch {
      setError("Failed to load cohorts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCohorts();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.name ||
      !form.startDate ||
      !form.expectedGraduationDate ||
      !form.studentCapacity
    ) {
      setFormError("All fields are required");
      return;
    }
    setIsSubmitting(true);
    setFormError("");
    try {
      await createCohort({
        name: form.name,
        startDate: form.startDate,
        expectedGraduationDate: form.expectedGraduationDate,
        studentCapacity: parseInt(form.studentCapacity),
      });
      setShowModal(false);
      setForm({
        name: "",
        startDate: "",
        expectedGraduationDate: "",
        studentCapacity: "",
      });
      await fetchCohorts();
    } catch (err: any) {
      setFormError(err?.response?.data?.message || "Failed to create cohort");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArchive = async (cohortId: string) => {
    if (!window.confirm("Archive this cohort? This cannot be undone.")) return;
    setArchivingId(cohortId);
    try {
      await archiveCohort(cohortId);
      await fetchCohorts();
    } catch {
      setError("Failed to archive cohort");
    } finally {
      setArchivingId(null);
    }
  };

  return (
    <DashboardLayout title="Cohorts">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl
            bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-sm
            font-medium transition-colors"
        >
          <Plus size={16} /> New Cohort
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
      ) : cohorts.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
          <p>No cohorts yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cohorts.map((cohort) => (
            <div key={cohort.id} className="bg-[#242424] rounded-2xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white font-semibold">{cohort.name}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                      cohort.status === "ACTIVE"
                        ? "bg-green-400/10 text-green-400"
                        : "bg-gray-400/10 text-gray-400"
                    }`}
                  >
                    {cohort.status}
                  </span>
                </div>
                {cohort.status === "ACTIVE" && (
                  <button
                    onClick={() => handleArchive(cohort.id)}
                    disabled={archivingId === cohort.id}
                    className="text-xs px-3 py-1.5 rounded-lg bg-gray-400/10
                      text-gray-400 hover:bg-gray-400/20 disabled:opacity-50
                      transition-colors"
                  >
                    {archivingId === cohort.id ? "..." : "Archive"}
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <Users size={14} /> Students
                  </span>
                  <span className="text-white">
                    {cohort.enrolledStudentCount} / {cohort.studentCapacity}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#3a3a3a] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D32F2F] rounded-full"
                    style={{
                      width: `${Math.min(
                        ((cohort.enrolledStudentCount || 0) /
                          (cohort.studentCapacity || 1)) *
                          100,
                        100,
                      )}%`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Start date</span>
                  <span className="text-white">
                    {new Date(cohort.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Graduation</span>
                  <span className="text-white">
                    {new Date(cohort.expectedGraduationDate).toLocaleDateString(
                      "en-US",
                      { month: "short", year: "numeric" },
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="bg-[#242424] rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold text-lg">New Cohort</h3>
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
              {[
                {
                  label: "Cohort Name",
                  key: "name",
                  type: "text",
                  placeholder: "Batch 2025",
                },
                {
                  label: "Start Date",
                  key: "startDate",
                  type: "date",
                  placeholder: "",
                },
                {
                  label: "Expected Graduation",
                  key: "expectedGraduationDate",
                  type: "date",
                  placeholder: "",
                },
                {
                  label: "Student Capacity",
                  key: "studentCapacity",
                  type: "number",
                  placeholder: "50",
                },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm text-gray-300 mb-1.5">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={(form as any)[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl bg-[#2a2a2a] border
                      border-[#3a3a3a] text-white text-sm focus:outline-none
                      focus:border-[#D32F2F] transition-colors"
                  />
                </div>
              ))}

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
                  {isSubmitting ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

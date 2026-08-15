import { useEffect, useState } from "react";
import { Trophy, Plus, ExternalLink, AlertCircle } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getAdminContests, createAdminContest } from "../../lib/adminApi";

interface AdminContest {
  id: string;
  title: string;
  source?: string;
  scheduledAt: string;
  durationMinutes?: number;
  problemCount?: number;
  participantCount?: number;
  externalContestUrl?: string;
  status: "UPCOMING" | "LIVE" | "COMPLETED";
}

export default function AdminContestManagementPage() {
  const [contests, setContests] = useState<AdminContest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [problemCount, setProblemCount] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchContests = async () => {
    try {
      setError("");
      const res = await getAdminContests();
      setContests(res.data?.contests || []);
    } catch {
      setError("Failed to load contests from server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  const handleCreateContest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    setFormError("");
    try {
      const scheduledIso = scheduledDate
        ? new Date(scheduledDate).toISOString()
        : new Date().toISOString();

      await createAdminContest({
        title: title.trim(),
        externalContestUrl: url.trim() || "https://codeforces.com/group/bigo",
        scheduledAt: scheduledIso,
        problemCount: Number(problemCount) || 5,
      });

      setTitle("");
      setUrl("");
      setScheduledDate("");
      setShowModal(false);
      await fetchContests();
    } catch (err: any) {
      setFormError(
        err?.response?.data?.message ||
          err?.response?.data?.detail ||
          "Failed to create contest",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Contest Management">
      {/* Header Banner */}
      <div className="bg-[#242424] rounded-2xl p-6 border border-[#2A2A32] mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">
            Contest Publishing & Global Rankings Analytics
          </h2>
          <p className="text-gray-400 text-sm">
            Create weekly contests, link Codeforces rounds, and view participants.
          </p>
        </div>

        <button
          onClick={() => {
            const defaultDate = new Date(Date.now() + 86400000)
              .toISOString()
              .slice(0, 16);
            setScheduledDate(defaultDate);
            setShowModal(true);
          }}
          className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-[#D32F2F] text-white hover:bg-[#B71C1C] transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-[#D32F2F]/20"
        >
          <Plus size={16} /> Publish New Contest
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Contests Table */}
      <div className="bg-[#242424] rounded-2xl border border-[#2A2A32] overflow-hidden">
        <div className="p-5 border-b border-[#2A2A32] flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy size={20} className="text-amber-400" /> Academy Contests List
          </h3>
          <span className="text-xs text-gray-400 font-mono">
            {contests.length} total
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-[#D32F2F] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : contests.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            <Trophy size={36} className="mx-auto text-gray-600 mb-2 opacity-60" />
            <p>No contests published yet.</p>
            <p className="text-xs text-gray-500 mt-1">
              Click &quot;Publish New Contest&quot; above to create your first contest.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-[#1C1C20] text-xs uppercase text-gray-400 border-b border-[#2A2A32]">
                <tr>
                  <th className="py-4 px-5">Contest Title</th>
                  <th className="py-4 px-5">Source</th>
                  <th className="py-4 px-5">Schedule Date</th>
                  <th className="py-4 px-5 text-center">Problems</th>
                  <th className="py-4 px-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A32]">
                {contests.map((c) => (
                  <tr key={c.id} className="hover:bg-[#1E1E24] transition-colors">
                    <td className="py-4 px-5 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        {c.title}
                        {c.externalContestUrl && (
                          <a
                            href={c.externalContestUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-gray-500 hover:text-white"
                          >
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-5 text-xs text-gray-400 font-mono">
                      {c.source || "CODEFORCES"}
                    </td>
                    <td className="py-4 px-5 text-xs text-gray-300">
                      {c.scheduledAt
                        ? new Date(c.scheduledAt).toLocaleString([], {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "—"}
                    </td>
                    <td className="py-4 px-5 text-center font-mono text-xs">
                      {c.problemCount || 0}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                          c.status === "UPCOMING"
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : c.status === "LIVE"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse"
                              : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Publish Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateContest}
            className="bg-[#1C1C22] border border-[#2E2E38] rounded-2xl p-6 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-lg font-bold text-white mb-2">Publish New Contest</h3>
            <p className="text-xs text-gray-400 mb-5">
              Contest will be visible to all students in the portal immediately.
            </p>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {formError}
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs text-gray-300 font-medium block mb-1">
                  Contest Title <span className="text-[#D32F2F]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. BigO Weekly Contest #43"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#24242C] text-white border border-[#2E2E38] focus:outline-none focus:border-[#D32F2F] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 font-medium block mb-1">
                  Contest URL <span className="text-[#D32F2F]">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://codeforces.com/group/bigo"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#24242C] text-white border border-[#2E2E38] focus:outline-none focus:border-[#D32F2F] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-300 font-medium block mb-1">
                    Scheduled Date &amp; Time
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#24242C] text-white border border-[#2E2E38] focus:outline-none focus:border-[#D32F2F] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-medium block mb-1">
                    Problem Count
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={problemCount}
                    onChange={(e) => setProblemCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#24242C] text-white border border-[#2E2E38] focus:outline-none focus:border-[#D32F2F] transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 text-xs rounded-xl bg-[#2A2A34] text-gray-300 hover:bg-[#343440] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-[#D32F2F] text-white hover:bg-[#B71C1C] disabled:opacity-60 transition-colors shadow-lg shadow-[#D32F2F]/20"
              >
                {isSubmitting ? "Publishing..." : "Publish Contest"}
              </button>
            </div>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
}


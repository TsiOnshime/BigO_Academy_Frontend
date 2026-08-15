import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../hooks/useAuth";
import {
  getMentorshipSessions,
  scheduleMentorshipSession,
  updateMentorshipSession,
  getMyStudents,
} from "../../lib/teacherApi";

const STATUS_COLORS: Record<string, string> = {
  SCHEDULED: "bg-blue-400/10 text-blue-400",
  COMPLETED: "bg-green-400/10 text-green-400",
  CANCELLED: "bg-gray-400/10 text-gray-400",
};

export default function TeacherMentorshipPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // New session form state
  const [selectedStudent, setSelectedStudent] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");

  const fetchData = async () => {
    if (!user) return;
    const teacherId = user.id || user.userId;
    if (!teacherId) return;

    try {
      const [sessionsRes, studentsRes] = await Promise.all([
        getMentorshipSessions(teacherId),
        getMyStudents({ size: 100 }),
      ]);
      setSessions(sessionsRes.data.sessions || []);
      setStudents(studentsRes.data.students || []);
    } catch {
      setError("Failed to load mentorship sessions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    const teacherId = user?.id || user?.userId;
    if (!selectedStudent || !scheduledAt || !teacherId) return;

    setIsSubmitting(true);
    setError("");
    try {
      await scheduleMentorshipSession({
        teacherId: teacherId,
        studentId: selectedStudent,
        scheduledAt: new Date(scheduledAt).toISOString(),
      });
      setShowModal(false);
      setSelectedStudent("");
      setScheduledAt("");
      fetchData();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.detail ||
          "Failed to schedule session",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async (sessionId: string) => {
    try {
      await updateMentorshipSession(sessionId, { status: "CANCELLED" });
      fetchData();
    } catch {
      setError("Failed to cancel session");
    }
  };

  const handleComplete = async (sessionId: string) => {
    try {
      await updateMentorshipSession(sessionId, { status: "COMPLETED" });
      fetchData();
    } catch {
      setError("Failed to mark session as complete");
    }
  };

  return (
    <DashboardLayout title="Mentorship Sessions">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-400 text-sm">
          Schedule and manage one-on-one sessions with your students.
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl
            bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-sm
            font-medium transition-colors"
        >
          <Plus size={16} />
          Schedule Session
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
      ) : sessions.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p>No mentorship sessions yet</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-3 text-[#D32F2F] hover:text-[#B71C1C] text-sm"
          >
            Schedule your first session
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-[#242424] rounded-2xl p-5 flex items-center justify-between"
            >
              <div>
                <p className="text-white font-medium">{session.studentName}</p>
                <p className="text-gray-400 text-sm mt-0.5">
                  {new Date(session.scheduledAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                {session.notes && (
                  <p className="text-gray-500 text-xs mt-1">{session.notes}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full ${
                    STATUS_COLORS[session.status] || ""
                  }`}
                >
                  {session.status}
                </span>

                {session.status === "SCHEDULED" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleComplete(session.id)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-green-400/10
                        text-green-400 hover:bg-green-400/20 transition-colors"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => handleCancel(session.id)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-gray-400/10
                        text-gray-400 hover:bg-gray-400/20 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="bg-[#242424] rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold text-lg">
                Schedule Session
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSchedule} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">
                  Student
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#2a2a2a] border
                    border-[#3a3a3a] text-white text-sm focus:outline-none
                    focus:border-[#D32F2F] transition-colors"
                >
                  <option value="">Select a student</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1.5">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  required
                  min={new Date().toISOString().slice(0, 16)}
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
                    text-gray-400 text-sm hover:text-white hover:border-gray-500
                    transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C]
                    text-white text-sm font-medium disabled:opacity-60
                    transition-colors"
                >
                  {isSubmitting ? "Scheduling..." : "Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

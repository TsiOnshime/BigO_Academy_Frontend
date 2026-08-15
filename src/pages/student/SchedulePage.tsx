import { useEffect, useState } from "react";
import { Calendar, Clock, User } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../hooks/useAuth";
import { getMyMentorshipSessions } from "../../lib/studentAPI.ts";
import type {
  MentorshipSession,
  MentorshipSessionStatus,
} from "../../types/student";

const STATUS_COLORS: Record<MentorshipSessionStatus, string> = {
  SCHEDULED: "bg-blue-400/10 text-blue-400",
  COMPLETED: "bg-green-400/10 text-green-400",
  CANCELLED: "bg-red-400/10 text-red-400",
};

export default function StudentSchedule() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const studentId = user.id || user.userId;
      if (!studentId) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await getMyMentorshipSessions(studentId);
        setSessions(res.data.sessions || []);
      } catch {
        setError("Failed to load your schedule");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (isLoading) {
    return (
      <DashboardLayout title="Schedule">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#D32F2F] border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const now = new Date();
  const upcoming = sessions
    .filter((s) => s.status === "SCHEDULED" && new Date(s.scheduledAt) >= now)
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
  const past = sessions
    .filter((s) => s.status !== "SCHEDULED" || new Date(s.scheduledAt) < now)
    .sort((a, b) => b.scheduledAt.localeCompare(a.scheduledAt));

  const renderSession = (session: MentorshipSession) => (
    <div
      key={session.id}
      className="bg-[#242424] rounded-2xl p-5 flex items-start justify-between gap-4"
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-[#D32F2F]/10 flex items-center justify-center shrink-0">
          <User size={18} className="text-[#D32F2F]" />
        </div>
        <div className="min-w-0">
          <p className="text-white font-medium">
            {session.teacherName || "Mentorship session"}
          </p>
          <p className="text-gray-400 text-sm flex items-center gap-1.5 mt-0.5">
            <Clock size={13} />
            {new Date(session.scheduledAt).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          {session.notes && (
            <p className="text-gray-500 text-sm mt-2">{session.notes}</p>
          )}
        </div>
      </div>
      <span
        className={`text-xs px-2.5 py-1 rounded-full shrink-0 ${
          STATUS_COLORS[session.status]
        }`}
      >
        {session.status}
      </span>
    </div>
  );

  return (
    <DashboardLayout title="Schedule">
      <p className="text-gray-400 text-sm mb-6">
        Your one-on-one mentorship sessions.
      </p>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-white font-semibold mb-4">Upcoming</h3>
        {upcoming.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-[#242424] rounded-2xl">
            <Calendar size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No upcoming sessions scheduled</p>
          </div>
        ) : (
          <div className="space-y-3">{upcoming.map(renderSession)}</div>
        )}
      </div>

      <div>
        <h3 className="text-white font-semibold mb-4">Past</h3>
        {past.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-[#242424] rounded-2xl">
            <p className="text-sm">No past sessions yet</p>
          </div>
        ) : (
          <div className="space-y-3">{past.map(renderSession)}</div>
        )}
      </div>
    </DashboardLayout>
  );
}
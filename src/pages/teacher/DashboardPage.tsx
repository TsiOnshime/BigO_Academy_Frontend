import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Calendar, MessageSquare, TrendingUp } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../hooks/useAuth";
import { getMyStudents, getMentorshipSessions } from "../../lib/teacherApi";
import { getCached, setCached } from "../../lib/cache";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-[#242424] rounded-2xl p-5 flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const cached = getCached<any>("teacher-dashboard")
        if (cached){
          setStudents(cached.students)
          setSessions(cached.sessions)
          setIsLoading(false)
          return
        }
        const [studentsRes, sessionsRes] = await Promise.all([
          getMyStudents({ size: 100 }),
          getMentorshipSessions(user.userId),
        ]);

        const data = {
          students: studentsRes.data.students || [],
          sessions: sessionsRes.data.sessions || []
        }
        setCached("teacher-dashboard", data)
        setStudents(studentsRes.data.students || []);
        setSessions(sessionsRes.data.sessions || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const activeStudents = students.filter((s) => s.status === "ACTIVE");
  const probationStudents = students.filter((s) => s.status === "PROBATION");
  const upcomingSessions = sessions.filter(
    (s) => s.status === "SCHEDULED" && new Date(s.scheduledAt) > new Date(),
  );

  // Average attendance
  const avgAttendance =
    students.length > 0
      ? Math.round(
          students.reduce((sum, s) => sum + (s.attendancePercentage || 0), 0) /
            students.length,
        )
      : 0;

  if (isLoading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#D32F2F] border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard">
      {/* Welcome */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">
          Welcome back,{" "}
          <span className="text-[#D32F2F]">{user?.fullName}!</span>
        </h2>
        <p className="text-gray-400 mt-1">
          Here's an overview of your students and sessions.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Students"
          value={students.length}
          icon={<Users size={22} className="text-blue-400" />}
          color="bg-blue-400/10"
        />
        <StatCard
          label="Active Students"
          value={activeStudents.length}
          icon={<TrendingUp size={22} className="text-green-400" />}
          color="bg-green-400/10"
        />
        <StatCard
          label="On Probation"
          value={probationStudents.length}
          icon={<TrendingUp size={22} className="text-yellow-400" />}
          color="bg-yellow-400/10"
        />
        <StatCard
          label="Avg Attendance"
          value={`${avgAttendance}%`}
          icon={<Calendar size={22} className="text-[#D32F2F]" />}
          color="bg-[#D32F2F]/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent students */}
        <div className="bg-[#242424] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">My Students</h3>
            <Link
              to="/teacher/students"
              className="text-sm text-[#D32F2F] hover:text-[#B71C1C]"
            >
              View all
            </Link>
          </div>

          {students.length === 0 ? (
            <p className="text-gray-500 text-sm py-4 text-center">
              No students assigned yet
            </p>
          ) : (
            <div className="space-y-3">
              {students.slice(0, 5).map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between py-2 border-b border-[#2a2a2a] last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#D32F2F]/20 flex items-center justify-center">
                      <span className="text-[#D32F2F] text-xs font-bold">
                        {student.fullName?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">
                        {student.fullName}
                      </p>
                      <p className="text-gray-500 text-xs">
                        Year {student.yearPhase}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      student.status === "ACTIVE"
                        ? "bg-green-400/10 text-green-400"
                        : student.status === "PROBATION"
                          ? "bg-yellow-400/10 text-yellow-400"
                          : "bg-gray-400/10 text-gray-400"
                    }`}
                  >
                    {student.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming mentorship sessions */}
        <div className="bg-[#242424] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Upcoming Sessions</h3>
            <Link
              to="/teacher/mentorship"
              className="text-sm text-[#D32F2F] hover:text-[#B71C1C]"
            >
              View all
            </Link>
          </div>

          {upcomingSessions.length === 0 ? (
            <p className="text-gray-500 text-sm py-4 text-center">
              No upcoming mentorship sessions
            </p>
          ) : (
            <div className="space-y-3">
              {upcomingSessions.slice(0, 5).map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between py-2 border-b border-[#2a2a2a] last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-400/10 flex items-center justify-center">
                      <MessageSquare size={14} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">
                        {session.studentName}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {new Date(session.scheduledAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-400/10 text-blue-400">
                    Scheduled
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

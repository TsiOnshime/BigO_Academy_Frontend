import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../hooks/useAuth";
import {
  getStudent,
  getStudentProgress,
  getStudentWarnings,
  getMyMentorshipSessions,
  getCohortTopics,
} from "../../lib/studentAPI";

import type {
  Student,
  ProgressSheet,
  StudentWarnings,
  MentorshipSession,
} from "../../types/student";

const DEFAULT_COHORT_ID = "2f4855d9-bb92-473b-85db-79fe58db350b";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-[#242424] rounded-2xl p-5 flex items-center gap-4 border border-[#2A2A32] shadow-sm">
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

export default function StudentDashboard() {
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [progress, setProgress] = useState<ProgressSheet | null>(null);
  const [totalCurriculumProblems, setTotalCurriculumProblems] = useState<number>(39);
  const [warnings, setWarnings] = useState<StudentWarnings | null>(null);
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const [
          studentRes,
          progressRes,
          warningsRes,
          sessionsRes,
        ] = await Promise.allSettled([
          getStudent(user.userId),
          getStudentProgress(user.userId),
          getStudentWarnings(user.userId),
          getMyMentorshipSessions(user.userId),
        ]);

        let loadedStudent: Student | null = null;
        if (studentRes.status === "fulfilled") {
          loadedStudent = studentRes.value.data;
          setStudent(loadedStudent);
        }

        if (progressRes.status === "fulfilled") {
          setProgress(progressRes.value.data);
        }

        if (warningsRes.status === "fulfilled") {
          setWarnings(warningsRes.value.data);
        }

        if (sessionsRes.status === "fulfilled") {
          setSessions(sessionsRes.value.data.sessions || []);
        }

        // Fetch curriculum total problems for cohort
        const cohortId = loadedStudent?.cohortId || DEFAULT_COHORT_ID;
        try {
          const topicsRes = await getCohortTopics(cohortId);
          const topics = topicsRes.data.topics || [];
          const totalCount = topics.reduce(
            (acc, t) => acc + (t.problemCount || 0),
            0
          );
          if (totalCount > 0) setTotalCurriculumProblems(totalCount);
        } catch {
          // fallback to 39
        }
      } catch (err) {
        console.error("Dashboard data load error", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const upcomingSessions = sessions
    .filter(
      (s) => s.status === "SCHEDULED" && new Date(s.scheduledAt) > new Date()
    )
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));

  const solvedCount = progress?.solvedCount ?? 0;
  const completionPercent = totalCurriculumProblems
    ? Math.round((solvedCount / totalCurriculumProblems) * 100)
    : 0;

  if (isLoading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <div className="w-8 h-8 border-4 border-[#D32F2F] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-400">Loading dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Welcome back, <span className="text-[#D32F2F]">{user?.fullName}!</span>
          </h2>
          <p className="text-gray-400 mt-1 text-sm">
            {student?.cohortName || "BigO Academy - Cohort 6"} · Year{" "}
            {student?.yearPhase || 1} Student
          </p>
        </div>

        <Link
          to="/courses"
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#D32F2F] text-white hover:bg-[#B71C1C] transition-all self-start md:self-auto flex items-center gap-1.5 shadow-lg shadow-[#D32F2F]/20"
        >
          <BookOpen size={14} /> Go to My Courses
        </Link>
      </div>

      {warnings && warnings.activeWarningCount > 0 && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-sm">
          <AlertTriangle size={18} className="shrink-0" />
          You have {warnings.activeWarningCount} active warning
          {warnings.activeWarningCount > 1 ? "s" : ""}. Check in with your
          teacher to resolve it.
        </div>
      )}

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Attendance"
          value={`${Math.round(student?.attendancePercentage !== undefined && student?.attendancePercentage !== null ? student.attendancePercentage : 100)}%`}
          icon={<Calendar size={22} className="text-blue-400" />}
          color="bg-blue-400/10"
        />
        <StatCard
          label="Problems Solved"
          value={`${solvedCount} / ${totalCurriculumProblems}`}
          icon={<CheckCircle2 size={22} className="text-green-400" />}
          color="bg-green-400/10"
        />
        <StatCard
          label="Completion"
          value={`${completionPercent}%`}
          icon={<TrendingUp size={22} className="text-[#D32F2F]" />}
          color="bg-[#D32F2F]/10"
        />
        <StatCard
          label="Active Warnings"
          value={warnings?.activeWarningCount ?? 0}
          icon={<AlertTriangle size={22} className="text-yellow-400" />}
          color="bg-yellow-400/10"
        />
      </div>

      {/* Mentorship Section */}
      <div className="bg-[#242424] rounded-2xl p-5 border border-[#2A2A32]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Upcoming Mentorship</h3>
          <Link
            to="/schedule"
            className="text-xs text-[#D32F2F] hover:text-[#B71C1C] font-semibold"
          >
            View all &rarr;
          </Link>
        </div>

        {upcomingSessions.length === 0 ? (
          <p className="text-gray-500 text-sm py-6 text-center bg-[#1C1C20] rounded-xl border border-[#2A2A32]">
            No upcoming sessions scheduled
          </p>
        ) : (
          <div className="space-y-3">
            {upcomingSessions.slice(0, 5).map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-[#1C1C20] border border-[#2A2A32]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-400/10 flex items-center justify-center">
                    <Clock size={14} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">
                      {session.teacherName || "Mentorship session"}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {new Date(session.scheduledAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-blue-400/10 text-blue-400 font-medium">
                  Scheduled
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
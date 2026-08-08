import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Clock,
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../hooks/useAuth";
import {
  getStudent,
  getStudentProgress,
  getStudentWarnings,
  getMyMentorshipSessions,
} from "../../lib/studentAPI.ts";

import type {
  Student,
  ProgressSheet,
  StudentWarnings,
  MentorshipSession,
} from "../../types/student";

/** Flip to false once academic-service is reachable. See PaymentPage.tsx
 * for the same pattern. */
const DEV_MOCK_DATA = true;

function mockData() {
  const student: Student = {
    id: "1",
    fullName: "Meron Tadesse",
    email: "student@a2sv.org",
    status: "ACTIVE",
    yearPhase: 1,
    cohortId: "c1",
    cohortName: "Cohort 7",
    assignedTeacherId: "t1",
    attendancePercentage: 92,
    activeWarningCount: 1,
    joinedAt: "2026-01-10",
    createdAt: "2026-01-10T00:00:00Z",
    updatedAt: "2026-01-10T00:00:00Z",
  };
  const progress: ProgressSheet = {
    studentId: "1",
    totalProblems: 120,
    solvedCount: 47,
    completionPercentage: 39.2,
    progress: [],
  };
  const warnings: StudentWarnings = {
    studentId: "1",
    activeWarningCount: 1,
    warnings: [
      {
        id: "w1",
        studentId: "1",
        type: "LOW_CONSISTENCY",
        status: "ACTIVE",
        warningNumber: 1,
        issuedAt: "2026-08-01T00:00:00Z",
        dismissedAt: null,
        dismissedBy: null,
        dismissalNote: null,
      },
    ],
  };
  const sessions: MentorshipSession[] = [
    {
      id: "s1",
      teacherId: "t1",
      teacherName: "Abel Getachew",
      studentId: "1",
      studentName: "Meron Tadesse",
      scheduledAt: new Date(Date.now() + 86400000 * 2).toISOString(),
      status: "SCHEDULED",
      notes: null,
      createdAt: new Date().toISOString(),
    },
    {
      id: "s2",
      teacherId: "t1",
      teacherName: "Abel Getachew",
      studentId: "1",
      studentName: "Meron Tadesse",
      scheduledAt: new Date(Date.now() + 86400000 * 9).toISOString(),
      status: "SCHEDULED",
      notes: null,
      createdAt: new Date().toISOString(),
    },
  ];
  return { student, progress, warnings, sessions };
}

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

export default function StudentDashboard() {
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [progress, setProgress] = useState<ProgressSheet | null>(null);
  const [warnings, setWarnings] = useState<StudentWarnings | null>(null);
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      if (DEV_MOCK_DATA) {
        const m = mockData();
        setStudent(m.student);
        setProgress(m.progress);
        setWarnings(m.warnings);
        setSessions(m.sessions);
        setIsLoading(false);
        return;
      }

      try {
        const [studentRes, progressRes, warningsRes, sessionsRes] =
          await Promise.all([
            getStudent(user.userId),
            getStudentProgress(user.userId),
            getStudentWarnings(user.userId),
            getMyMentorshipSessions(user.userId),
          ]);
        setStudent(studentRes.data);
        setProgress(progressRes.data);
        setWarnings(warningsRes.data);
        setSessions(sessionsRes.data.sessions || []);
      } catch {
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const upcomingSessions = sessions
    .filter((s) => s.status === "SCHEDULED" && new Date(s.scheduledAt) > new Date())
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));

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
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">
          Welcome back, <span className="text-[#D32F2F]">{user?.fullName}!</span>
        </h2>
        <p className="text-gray-400 mt-1">
          {student?.cohortName
            ? `${student.cohortName} · Year ${student.yearPhase}`
            : "Here's an overview of your progress."}
        </p>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {warnings && warnings.activeWarningCount > 0 && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-sm">
          <AlertTriangle size={18} className="shrink-0" />
          You have {warnings.activeWarningCount} active warning
          {warnings.activeWarningCount > 1 ? "s" : ""}. Check in with your
          teacher to resolve it.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Attendance"
          value={`${Math.round(student?.attendancePercentage ?? 0)}%`}
          icon={<Calendar size={22} className="text-blue-400" />}
          color="bg-blue-400/10"
        />
        <StatCard
          label="Problems Solved"
          value={`${progress?.solvedCount ?? 0}/${progress?.totalProblems ?? 0}`}
          icon={<BookOpen size={22} className="text-green-400" />}
          color="bg-green-400/10"
        />
        <StatCard
          label="Completion"
          value={`${Math.round(progress?.completionPercentage ?? 0)}%`}
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

      <div className="bg-[#242424] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Upcoming Mentorship</h3>
          <Link
            to="/schedule"
            className="text-sm text-[#D32F2F] hover:text-[#B71C1C]"
          >
            View all
          </Link>
        </div>

        {upcomingSessions.length === 0 ? (
          <p className="text-gray-500 text-sm py-4 text-center">
            No upcoming sessions scheduled
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
    </DashboardLayout>
  );
}
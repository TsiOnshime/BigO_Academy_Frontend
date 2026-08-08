import { Link } from "react-router-dom";
import {
  Users,
  GraduationCap,
  BookOpen,
  CreditCard,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../hooks/useAuth";

function StatCard({
  label,
  value,
  icon,
  color,
  to,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="bg-[#242424] rounded-2xl p-5 flex items-center gap-4
      hover:bg-[#2a2a2a] transition-colors"
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
      >
        {icon}
      </div>

      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
      </div>
    </Link>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();

  // Fake data
  const stats = {
    totalStudents: 120,
    totalTeachers: 15,
    totalCohorts: 4,
    pendingPayments: 8,
    overduePayments: 3,
    studentsOnProbation: 6,
    avgPerformance: 78,
    avgAttendance: 86,
    pendingTeachers: 2,
  };

  return (
    <DashboardLayout title="Dashboard">
      {/* Welcome */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">
          Welcome back,{" "}
          <span className="text-[#D32F2F]">{user?.fullName || "Admin"}!</span>
        </h2>

        <p className="text-gray-400 mt-1">Platform overview at a glance.</p>
      </div>

      {/* Main Stats */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Total Students"
          value={stats.totalStudents}
          icon={<Users size={22} className="text-blue-400" />}
          color="bg-blue-400/10"
          to="/admin/students"
        />

        <StatCard
          label="Total Teachers"
          value={stats.totalTeachers}
          icon={<GraduationCap size={22} className="text-purple-400" />}
          color="bg-purple-400/10"
          to="/admin/teachers"
        />

        <StatCard
          label="Active Cohorts"
          value={stats.totalCohorts}
          icon={<BookOpen size={22} className="text-green-400" />}
          color="bg-green-400/10"
          to="/admin/cohorts"
        />
      </div>

      {/* Alerts */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Pending Payments"
          value={stats.pendingPayments}
          icon={<CreditCard size={22} className="text-yellow-400" />}
          color="bg-yellow-400/10"
          to="/admin/payments"
        />

        <StatCard
          label="Overdue Payments"
          value={stats.overduePayments}
          icon={<AlertTriangle size={22} className="text-red-400" />}
          color="bg-red-400/10"
          to="/admin/payments"
        />

        <StatCard
          label="On Probation"
          value={stats.studentsOnProbation}
          icon={<AlertTriangle size={22} className="text-orange-400" />}
          color="bg-orange-400/10"
          to="/admin/students"
        />

        <StatCard
          label="Performance"
          value={`${stats.avgPerformance}%`}
          icon={<TrendingUp size={22} className="text-[#D32F2F]" />}
          color="bg-[#D32F2F]/10"
          to="/admin/analytics"
        />
      </div>

      {/* Platform Health */}

      <div className="bg-[#242424] rounded-2xl p-5">
        <h3 className="text-white font-semibold mb-5">Platform Health</h3>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-sm">Attendance</span>

              <span className="text-white text-sm">{stats.avgAttendance}%</span>
            </div>

            <div className="h-2 bg-[#3a3a3a] rounded-full">
              <div
                className="h-full bg-green-400 rounded-full"
                style={{
                  width: `${stats.avgAttendance}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-sm">Performance</span>

              <span className="text-white text-sm">
                {stats.avgPerformance}%
              </span>
            </div>

            <div className="h-2 bg-[#3a3a3a] rounded-full">
              <div
                className="h-full bg-blue-400 rounded-full"
                style={{
                  width: `${stats.avgPerformance}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

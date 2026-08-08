import { useEffect, useState } from "react";
import { Trophy, TrendingUp, Users, AlertTriangle } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getPlatformAnalytics, getGlobalLeaderboard } from "../../lib/adminApi";

export default function AdminAnalyticsPage() {
  const [platform, setPlatform] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [platRes, lbRes] = await Promise.allSettled([
          getPlatformAnalytics(),
          getGlobalLeaderboard({ size: 10 }),
        ]);
        if (platRes.status === "fulfilled") setPlatform(platRes.value.data);
        if (lbRes.status === "fulfilled")
          setLeaderboard(lbRes.value.data.entries || []);
      } catch {
        setError("Failed to load analytics");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout title="Analytics">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#D32F2F] border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Analytics">
      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Platform stats */}
      {platform && (
        <>
          <h2 className="text-white font-semibold mb-4">Platform Overview</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Total Students",
                value: platform.totalStudents,
                icon: <Users size={20} className="text-blue-400" />,
                color: "bg-blue-400/10",
              },
              {
                label: "Avg Performance",
                value: `${Math.round(platform.overallAveragePerformanceScore || 0)}%`,
                icon: <TrendingUp size={20} className="text-green-400" />,
                color: "bg-green-400/10",
              },
              {
                label: "Avg Attendance",
                value: `${Math.round(platform.overallAverageAttendancePercentage || 0)}%`,
                icon: <TrendingUp size={20} className="text-purple-400" />,
                color: "bg-purple-400/10",
              },
              {
                label: "On Probation",
                value: platform.studentsOnProbation,
                icon: <AlertTriangle size={20} className="text-yellow-400" />,
                color: "bg-yellow-400/10",
              },
              {
                label: "Total Graduates",
                value: platform.totalGraduates,
                icon: <Trophy size={20} className="text-[#D32F2F]" />,
                color: "bg-[#D32F2F]/10",
              },
              {
                label: "Students Dropped",
                value: platform.studentsDropped,
                icon: <AlertTriangle size={20} className="text-red-400" />,
                color: "bg-red-400/10",
              },
              {
                label: "Active Cohorts",
                value: platform.totalActiveCohorts,
                icon: <Users size={20} className="text-cyan-400" />,
                color: "bg-cyan-400/10",
              },
              {
                label: "Warnings Issued",
                value: platform.totalWarningsIssued,
                icon: <AlertTriangle size={20} className="text-orange-400" />,
                color: "bg-orange-400/10",
              },
            ].map(({ label, value, icon, color }) => (
              <div
                key={label}
                className="bg-[#242424] rounded-2xl p-4 flex items-center gap-3"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}
                >
                  {icon}
                </div>
                <div>
                  <p className="text-gray-400 text-xs">{label}</p>
                  <p className="text-white text-xl font-bold">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Global leaderboard */}
      <h2 className="text-white font-semibold mb-4">
        Global Leaderboard — Top 10
      </h2>
      <div className="bg-[#242424] rounded-2xl overflow-hidden">
        <div
          className="grid grid-cols-12 px-5 py-3 border-b border-[#2a2a2a]
          text-gray-500 text-xs font-medium uppercase"
        >
          <span className="col-span-1">Rank</span>
          <span className="col-span-4">Student</span>
          <span className="col-span-3">Cohort</span>
          <span className="col-span-2">Rating</span>
          <span className="col-span-2">Performance</span>
        </div>

        {leaderboard.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-sm">
            No leaderboard data yet
          </div>
        ) : (
          leaderboard.map((entry, index) => (
            <div
              key={entry.studentId}
              className="grid grid-cols-12 px-5 py-4 border-b border-[#2a2a2a]
                last:border-0 hover:bg-[#2a2a2a] transition-colors items-center"
            >
              <div className="col-span-1">
                {index === 0 ? (
                  <Trophy size={18} className="text-yellow-400" />
                ) : index === 1 ? (
                  <Trophy size={18} className="text-gray-300" />
                ) : index === 2 ? (
                  <Trophy size={18} className="text-orange-400" />
                ) : (
                  <span className="text-gray-500 text-sm">{entry.rank}</span>
                )}
              </div>
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#D32F2F]/20 flex items-center justify-center">
                  <span className="text-[#D32F2F] text-xs font-bold">
                    {entry.studentName?.charAt(0)}
                  </span>
                </div>
                <span className="text-white text-sm font-medium truncate">
                  {entry.studentName}
                </span>
              </div>
              <div className="col-span-3">
                <span className="text-gray-400 text-sm truncate">
                  {entry.cohortName}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-white text-sm font-semibold">
                  {Math.round(entry.rating)}
                </span>
              </div>
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-1.5 bg-[#3a3a3a] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#D32F2F] rounded-full"
                      style={{ width: `${entry.performanceScore || 0}%` }}
                    />
                  </div>
                  <span className="text-gray-300 text-sm">
                    {Math.round(entry.performanceScore || 0)}%
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}

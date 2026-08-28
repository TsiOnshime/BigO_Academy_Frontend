import { useEffect, useState } from "react";
import { Trophy, TrendingUp, Users, AlertTriangle } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getPlatformAnalytics } from "../../lib/adminApi";
import { analyticsApi } from "../../lib/api";

export default function AdminAnalyticsPage() {
  const [platform, setPlatform] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const fetchLeaderboard = async (cursor?: number) => {
    try {
      const params = new URLSearchParams({ size: "10" });
      if (cursor !== undefined) params.append("cursor", cursor.toString());

      const lbRes = await analyticsApi.get(
        `/analytics/leaderboard/?${params.toString()}`,
      );
      const newEntries = lbRes.data.entries || [];

      if (cursor !== undefined) {
        setLeaderboard((prev) => [...prev, ...newEntries]);
      } else {
        setLeaderboard(newEntries);
      }

      setNextCursor(lbRes.data.pagination?.nextCursor ?? null);
      setHasMore(lbRes.data.pagination?.hasMore ?? false);
    } catch (err) {
      console.error("Failed to load leaderboard", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const platRes = await getPlatformAnalytics();
        setPlatform(platRes.data);
      } catch {
        setError("Failed to load platform analytics");
      }

      await fetchLeaderboard();
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleLoadMore = async () => {
    if (!nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);
    await fetchLeaderboard(nextCursor);
    setIsLoadingMore(false);
  };

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
          <h2
            className="font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Platform Overview
          </h2>
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
                className="rounded-2xl p-4 flex items-center gap-3"
                style={{ backgroundColor: "var(--bg-surface)" }}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}
                >
                  {icon}
                </div>
                <div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {label}
                  </p>
                  <p
                    className="text-xl font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Global leaderboard */}
      <h2
        className="font-semibold mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        Global Leaderboard
      </h2>
      <div
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: "var(--bg-surface)" }}
      >
        <div
          className="grid grid-cols-12 px-5 py-3 border-b text-xs font-medium uppercase"
          style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
        >
          <span className="col-span-1">Rank</span>
          <span className="col-span-4">Student</span>
          <span className="col-span-3">Cohort</span>
          <span className="col-span-2">Rating</span>
          <span className="col-span-2">Performance</span>
        </div>

        {leaderboard.length === 0 ? (
          <div
            className="text-center py-16 text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            No leaderboard data yet
          </div>
        ) : (
          <>
            {leaderboard.map((entry, index) => (
              <div
                key={entry.studentId}
                className="grid grid-cols-12 px-5 py-4 border-b last:border-0 transition-colors items-center"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="col-span-1">
                  {index === 0 ? (
                    <Trophy size={18} className="text-yellow-400" />
                  ) : index === 1 ? (
                    <Trophy
                      size={18}
                      style={{ color: "var(--text-secondary)" }}
                    />
                  ) : index === 2 ? (
                    <Trophy size={18} className="text-orange-400" />
                  ) : (
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {entry.rank}
                    </span>
                  )}
                </div>
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#D32F2F]/20 flex items-center justify-center">
                    <span className="text-[#D32F2F] text-xs font-bold">
                      {entry.studentName?.charAt(0)}
                    </span>
                  </div>
                  <span
                    className="text-sm font-medium truncate"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {entry.studentName}
                  </span>
                </div>
                <div className="col-span-3">
                  <span
                    className="text-sm truncate"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {entry.cohortName}
                  </span>
                </div>
                <div className="col-span-2">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {Math.round(entry.rating)}
                  </span>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-12 h-1.5 rounded-full overflow-hidden"
                      style={{ backgroundColor: "var(--border)" }}
                    >
                      <div
                        className="h-full bg-[#D32F2F] rounded-full"
                        style={{ width: `${entry.performanceScore || 0}%` }}
                      />
                    </div>
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {Math.round(entry.performanceScore || 0)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Load more */}
            {hasMore && (
              <div
                className="text-center py-4 border-t"
                style={{ borderColor: "var(--border)" }}
              >
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="px-4 py-2 text-sm text-[#D32F2F] hover:text-[#B71C1C]
                    disabled:opacity-50 transition-colors"
                >
                  {isLoadingMore ? "Loading..." : "Load more →"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

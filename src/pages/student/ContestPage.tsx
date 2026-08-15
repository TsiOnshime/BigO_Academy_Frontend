import { useEffect, useState } from "react";
import {
  Trophy,
  Award,
  Clock,
  Target,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../hooks/useAuth";
import { getContests, getStudentProgress } from "../../lib/studentAPI";

interface Contest {
  id: string;
  title: string;
  source?: string;
  scheduledAt: string;
  problemCount?: number;
  status: "UPCOMING" | "LIVE" | "COMPLETED";
  externalContestUrl?: string;
  myRank?: number;
  myScore?: number;
}

export default function StudentContestPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [contests, setContests] = useState<Contest[]>([]);
  const [metrics, setMetrics] = useState({
    rating: 1200,
    inContestSolved: 0,
    unsolved: 0,
    totalProblems: 0,
  });

  useEffect(() => {
    const loadContestData = async () => {
      setIsLoading(true);
      try {
        const studentId = user?.userId || user?.id;
        const [contestRes, progressRes] = await Promise.allSettled([
          getContests(),
          studentId ? getStudentProgress(studentId) : Promise.reject(),
        ]);

        if (contestRes.status === "fulfilled") {
          setContests(contestRes.value.data?.contests || []);
        }

        if (progressRes.status === "fulfilled") {
          const pData = progressRes.value.data;
          const solved = pData?.solvedCount || 0;
          const total = pData?.totalProblems || 0;
          setMetrics({
            rating: 1200 + solved * 10,
            inContestSolved: solved,
            unsolved: Math.max(0, total - solved),
            totalProblems: total,
          });
        }
      } catch {
        // Fallback to defaults
      } finally {
        setIsLoading(false);
      }
    };

    loadContestData();
  }, [user?.userId, user?.id]);

  return (
    <DashboardLayout title="Contests">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1E1E24] via-[#2E1E28] to-[#1E1E24] border border-[#3A2E34] p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#D32F2F]/20 text-[#EF5350] border border-[#D32F2F]/30 inline-flex items-center gap-1.5 mb-2">
              <Sparkles size={13} /> Competitive Programming Portal
            </span>
            <h1 className="text-2xl font-bold text-white mb-1">
              Contests &amp; Competitive Ratings
            </h1>
            <p className="text-gray-400 text-sm max-w-xl">
              Track your contest standings, live participation, competitive ratings, and problem solve stats.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#121216]/60 backdrop-blur-md rounded-xl p-3 border border-[#2A2A32] text-center min-w-[100px]">
              <div className="text-gray-400 text-xs mb-0.5">Rating</div>
              <div className="text-xl font-bold text-[#EF5350]">{metrics.rating}</div>
            </div>
            <div className="bg-[#121216]/60 backdrop-blur-md rounded-xl p-3 border border-[#2A2A32] text-center min-w-[100px]">
              <div className="text-gray-400 text-xs mb-0.5">Contests</div>
              <div className="text-xl font-bold text-amber-400">{contests.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Real Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="bg-[#242424] rounded-2xl p-4 border border-[#2A2A32] text-center">
          <div className="text-gray-400 text-xs mb-1 flex items-center justify-center gap-1">
            <Award size={14} className="text-[#EF5350]" /> Rating
          </div>
          <div className="text-lg font-bold text-white">{metrics.rating}</div>
        </div>

        <div className="bg-[#242424] rounded-2xl p-4 border border-[#2A2A32] text-center">
          <div className="text-gray-400 text-xs mb-1 flex items-center justify-center gap-1">
            <CheckCircle2 size={14} className="text-emerald-400" /> Solved
          </div>
          <div className="text-lg font-bold text-emerald-400">{metrics.inContestSolved}</div>
        </div>

        <div className="bg-[#242424] rounded-2xl p-4 border border-[#2A2A32] text-center">
          <div className="text-gray-400 text-xs mb-1 flex items-center justify-center gap-1">
            <XCircle size={14} className="text-rose-400" /> Unsolved
          </div>
          <div className="text-lg font-bold text-rose-400">{metrics.unsolved}</div>
        </div>

        <div className="bg-[#242424] rounded-2xl p-4 border border-[#2A2A32] text-center">
          <div className="text-gray-400 text-xs mb-1 flex items-center justify-center gap-1">
            <Target size={14} className="text-blue-400" /> Total Tracked
          </div>
          <div className="text-lg font-bold text-white">{metrics.totalProblems}</div>
        </div>
      </div>

      {/* Contests List */}
      <div className="bg-[#242424] rounded-2xl p-6 border border-[#2A2A32] mb-8">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Trophy size={20} className="text-[#D32F2F]" /> Active &amp; Upcoming Contests
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-[#D32F2F] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : contests.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            <Trophy size={36} className="mx-auto text-gray-600 mb-2 opacity-60" />
            <p>No active or scheduled contests yet.</p>
            <p className="text-xs text-gray-500 mt-1">
              Your instructors and admins will publish weekly contests here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {contests.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl bg-[#1C1C20] border border-[#2E2E38] hover:border-gray-600 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-bold rounded ${
                        c.status === "UPCOMING"
                          ? "bg-blue-500/20 text-blue-400"
                          : c.status === "LIVE"
                            ? "bg-emerald-500/20 text-emerald-400 animate-pulse"
                            : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {c.status}
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono">
                      {c.source || "CODEFORCES"}
                    </span>
                  </div>
                  <h4 className="text-base font-semibold text-white mb-1">
                    {c.title}
                  </h4>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Target size={13} /> {c.problemCount || 0} Problems
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} />{" "}
                      {c.scheduledAt
                        ? new Date(c.scheduledAt).toLocaleString([], {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "Scheduled"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {c.myRank && (
                    <div className="text-right mr-2">
                      <div className="text-xs text-gray-400">Your Standing</div>
                      <div className="text-sm font-bold text-amber-400">
                        Rank #{c.myRank} ({c.myScore} Solved)
                      </div>
                    </div>
                  )}

                  <a
                    href={c.externalContestUrl || "https://codeforces.com/group/bigo"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#D32F2F] text-white hover:bg-[#B71C1C] transition-all flex items-center gap-1.5 shrink-0 shadow-lg shadow-[#D32F2F]/20"
                  >
                    Enter Contest <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}


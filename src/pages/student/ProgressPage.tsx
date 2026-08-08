import { useEffect, useState } from "react";
import { CheckCircle2, Circle, ShieldCheck, TrendingUp } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../hooks/useAuth";
import { getStudentProgress } from "../../lib/studentAPI.ts";
import type { ProgressSheet } from "../../types/student";

/** Flip to false once academic-service is reachable. */
const DEV_MOCK_DATA = true;

function mockProgress(): ProgressSheet {
  return {
    studentId: "1",
    totalProblems: 12,
    solvedCount: 7,
    completionPercentage: 58.3,
    progress: [
      {
        problemId: "p1",
        problemTitle: "Two Sum",
        solved: true,
        attemptCount: 1,
        solveTimeMinutes: 12,
        verifiedByTeacher: true,
        solvedAt: "2026-07-20T10:00:00Z",
      },
      {
        problemId: "p2",
        problemTitle: "Longest Substring Without Repeating Characters",
        solved: true,
        attemptCount: 3,
        solveTimeMinutes: 35,
        verifiedByTeacher: false,
        solvedAt: "2026-07-22T14:00:00Z",
      },
      {
        problemId: "p3",
        problemTitle: "Merge Intervals",
        solved: false,
        attemptCount: 2,
        solveTimeMinutes: 0,
        verifiedByTeacher: false,
        solvedAt: null,
      },
      {
        problemId: "p4",
        problemTitle: "Binary Tree Level Order Traversal",
        solved: true,
        attemptCount: 1,
        solveTimeMinutes: 20,
        verifiedByTeacher: true,
        solvedAt: "2026-08-01T09:00:00Z",
      },
      {
        problemId: "p5",
        problemTitle: "Course Schedule",
        solved: false,
        attemptCount: 0,
        solveTimeMinutes: 0,
        verifiedByTeacher: false,
        solvedAt: null,
      },
    ],
  };
}

export default function StudentProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressSheet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "solved" | "unsolved">("all");

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      if (DEV_MOCK_DATA) {
        setProgress(mockProgress());
        setIsLoading(false);
        return;
      }

      try {
        const res = await getStudentProgress(user.userId);
        setProgress(res.data);
      } catch {
        setError("Failed to load progress");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (isLoading) {
    return (
      <DashboardLayout title="Progress">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#D32F2F] border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const items = (progress?.progress || []).filter((p) => {
    if (filter === "solved") return p.solved;
    if (filter === "unsolved") return !p.solved;
    return true;
  });

  return (
    <DashboardLayout title="Progress">
      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#242424] rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#D32F2F]/10">
            <TrendingUp size={22} className="text-[#D32F2F]" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Completion</p>
            <p className="text-white text-2xl font-bold">
              {Math.round(progress?.completionPercentage ?? 0)}%
            </p>
          </div>
        </div>
        <div className="bg-[#242424] rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-400/10">
            <CheckCircle2 size={22} className="text-green-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Solved</p>
            <p className="text-white text-2xl font-bold">
              {progress?.solvedCount ?? 0}
            </p>
          </div>
        </div>
        <div className="bg-[#242424] rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-400/10">
            <Circle size={22} className="text-blue-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Problems</p>
            <p className="text-white text-2xl font-bold">
              {progress?.totalProblems ?? 0}
            </p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="h-2 rounded-full bg-[#2a2a2a] overflow-hidden">
          <div
            className="h-full bg-[#D32F2F] transition-all"
            style={{ width: `${progress?.completionPercentage ?? 0}%` }}
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {(["all", "solved", "unsolved"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
              filter === f
                ? "bg-[#D32F2F] text-white"
                : "bg-[#242424] text-gray-400 hover:text-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <CheckCircle2 size={40} className="mx-auto mb-3 opacity-30" />
          <p>No problems in this view yet</p>
        </div>
      ) : (
        <div className="bg-[#242424] rounded-2xl overflow-hidden">
          {items.map((p) => (
            <div
              key={p.problemId}
              className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a] last:border-0 hover:bg-[#2a2a2a] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                {p.solved ? (
                  <CheckCircle2
                    size={18}
                    className="text-green-400 shrink-0"
                  />
                ) : (
                  <Circle size={18} className="text-gray-600 shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {p.problemTitle || "Untitled problem"}
                  </p>
                  {p.solved && (
                    <p className="text-gray-500 text-xs">
                      {p.attemptCount} attempt{p.attemptCount === 1 ? "" : "s"}{" "}
                      · {p.solveTimeMinutes} min
                    </p>
                  )}
                </div>
              </div>
              {p.verifiedByTeacher && (
                <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-green-400/10 text-green-400 shrink-0">
                  <ShieldCheck size={12} />
                  Verified
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
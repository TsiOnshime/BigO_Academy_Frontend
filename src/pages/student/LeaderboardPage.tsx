import { useEffect, useState, useRef, useCallback } from "react";
import {
  Trophy,
  Medal,
  Search,
  Flame,
  RefreshCw,
  TrendingUp,
  Sparkles,
  Award,
  CheckCircle2,
  Users,
  ExternalLink,
  Code2,
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getGlobalLeaderboard, getAllStudents } from "../../lib/adminApi";
import { useAuth } from "../../hooks/useAuth";

interface LeaderboardEntry {
  rank: number;
  studentId: string;
  fullName: string;
  email: string;
  cohortName: string;
  cohortId?: string;
  codeforcesHandle?: string;
  codeforcesRating?: number;
  codeforcesRank?: string;
  codeforcesMaxRating?: number;
  solvedCount: number;
  totalProblems: number;
  consistencyPercentage: number;
  rating: number;
  performanceScore?: number;
}

const getCodeforcesRankStyle = (rankTitle?: string) => {
  const r = (rankTitle || "").toLowerCase();
  if (
    r.includes("legendary") ||
    r.includes("international grandmaster") ||
    r.includes("grandmaster")
  ) {
    return {
      textColor: "text-red-500",
      bgColor: "bg-red-500/15",
      borderColor: "border-red-500/30",
      label: rankTitle || "Grandmaster",
    };
  }
  if (r.includes("master")) {
    return {
      textColor: "text-amber-500",
      bgColor: "bg-amber-500/15",
      borderColor: "border-amber-500/30",
      label: rankTitle || "Master",
    };
  }
  if (r.includes("candidate master")) {
    return {
      textColor: "text-purple-400",
      bgColor: "bg-purple-500/15",
      borderColor: "border-purple-500/30",
      label: "Candidate Master",
    };
  }
  if (r.includes("expert")) {
    return {
      textColor: "text-blue-400",
      bgColor: "bg-blue-500/15",
      borderColor: "border-blue-500/30",
      label: "Expert",
    };
  }
  if (r.includes("specialist")) {
    return {
      textColor: "text-cyan-400",
      bgColor: "bg-cyan-500/15",
      borderColor: "border-cyan-500/30",
      label: "Specialist",
    };
  }
  if (r.includes("pupil")) {
    return {
      textColor: "text-emerald-400",
      bgColor: "bg-emerald-500/15",
      borderColor: "border-emerald-500/30",
      label: "Pupil",
    };
  }
  return {
    textColor: "text-gray-400",
    bgColor: "bg-gray-500/15",
    borderColor: "border-gray-500/30",
    label: rankTitle && rankTitle !== "unrated" ? rankTitle : "Newbie",
  };
};

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCohort, setSelectedCohort] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<Date>(new Date());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchLeaderboard = useCallback(async (showRefreshingSpinner = false) => {
    if (showRefreshingSpinner) setIsRefreshing(true);
    try {
      // 1. Fetch from analytics service
      const res = await getGlobalLeaderboard({ size: 100 });
      const rawEntries = res.data?.entries || res.data?.leaderboard || [];

      // 2. Fetch students from academic-service for live Codeforces metadata & problem progress
      const stRes = await getAllStudents({ size: 100 });
      const dbStudents = stRes.data?.students || [];

      // Build quick lookup map by student ID / email
      const studentMap = new Map<string, any>();
      dbStudents.forEach((s: any) => {
        studentMap.set(String(s.id).toLowerCase(), s);
        if (s.email) studentMap.set(s.email.toLowerCase(), s);
      });

      let mergedList: LeaderboardEntry[] = [];

      if (rawEntries.length > 0) {
        mergedList = rawEntries.map((item: any) => {
          const match =
            studentMap.get(String(item.studentId).toLowerCase()) ||
            studentMap.get((item.email || "").toLowerCase());

          const cfHandle =
            match?.codeforcesHandle ||
            match?.codeforces_handle ||
            item.codeforcesHandle ||
            item.codeforces_handle;
          const cfRating = Number(
            match?.codeforcesRating ??
              match?.codeforces_rating ??
              item.codeforcesRating ??
              0,
          );
          const cfRank =
            match?.codeforcesRank ||
            match?.codeforces_rank ||
            item.codeforcesRank ||
            "unrated";
          const cfMaxRating = Number(
            match?.codeforcesMaxRating ?? match?.codeforces_max_rating ?? 0,
          );

          const solved =
            item.problemSolvedCount !== undefined
              ? Number(item.problemSolvedCount)
              : match?.solvedCount !== undefined
                ? Number(match.solvedCount)
                : 0;

          const total = match?.totalProblems || item.totalProblems || 0;
          const consistency = Math.round(
            Number(
              item.consistencyScore ??
                item.consistencyPercentage ??
                match?.attendancePercentage ??
                100,
            ),
          );

          // Rating calculation: if CF rating is linked, CF rating + 10 pts per solve. Else baseline 1200 + 25 per solve.
          const rating =
            cfRating > 0
              ? cfRating + solved * 10
              : item.rating && Number(item.rating) > 0
                ? Math.round(Number(item.rating))
                : 1200 + solved * 25;

          return {
            rank: item.rank || 0,
            studentId: item.studentId || match?.id || "",
            fullName:
              item.studentName ||
              match?.fullName ||
              item.fullName ||
              "Student",
            email: match?.email || item.email || "",
            cohortName:
              item.cohortName || match?.cohortName || "BigO Academy",
            cohortId: item.cohortId || match?.cohortId,
            codeforcesHandle: cfHandle,
            codeforcesRating: cfRating,
            codeforcesRank: cfRank,
            codeforcesMaxRating: cfMaxRating,
            solvedCount: solved,
            totalProblems: total,
            consistencyPercentage: consistency,
            rating,
            performanceScore: item.performanceScore,
          };
        });
      } else if (dbStudents.length > 0) {
        mergedList = dbStudents.map((s: any) => {
          const solved = Number(s.solvedCount || 0);
          const total = Number(s.totalProblems || 0);
          const consistency = Math.round(Number(s.attendancePercentage ?? 100));
          const cfRating = Number(s.codeforcesRating || s.codeforces_rating || 0);
          const rating = cfRating > 0 ? cfRating + solved * 10 : 1200 + solved * 25;

          return {
            rank: 0,
            studentId: s.id,
            fullName: s.fullName,
            email: s.email,
            cohortName: s.cohortName || "BigO Academy",
            cohortId: s.cohortId,
            codeforcesHandle: s.codeforcesHandle || s.codeforces_handle,
            codeforcesRating: cfRating,
            codeforcesRank: s.codeforcesRank || s.codeforces_rank || "unrated",
            codeforcesMaxRating: Number(s.codeforcesMaxRating || 0),
            solvedCount: solved,
            totalProblems: total,
            consistencyPercentage: consistency,
            rating,
          };
        });
      }

      // Re-sort with definitive live sorting:
      // 1. Overall Rating DESC (incorporates Codeforces rating)
      // 2. Solved Count DESC
      // 3. Consistency DESC
      mergedList.sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        if (b.solvedCount !== a.solvedCount) return b.solvedCount - a.solvedCount;
        return b.consistencyPercentage - a.consistencyPercentage;
      });

      // Assign live rank numbers 1..N
      const ranked = mergedList.map((entry, idx) => ({
        ...entry,
        rank: idx + 1,
      }));

      setEntries(ranked);
      setLastUpdatedTime(new Date());
    } catch (err) {
      console.error("Failed to load leaderboard", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load + 8-second live polling interval
  useEffect(() => {
    fetchLeaderboard();

    timerRef.current = setInterval(() => {
      fetchLeaderboard(false);
    }, 8000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchLeaderboard]);

  // Extract distinct cohorts for filtering
  const distinctCohorts = Array.from(
    new Set(entries.map((e) => e.cohortName).filter(Boolean)),
  );

  const filteredEntries = entries.filter((e) => {
    const matchesSearch =
      e.fullName.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      (e.codeforcesHandle &&
        e.codeforcesHandle.toLowerCase().includes(search.toLowerCase())) ||
      e.cohortName.toLowerCase().includes(search.toLowerCase());

    const matchesCohort =
      selectedCohort === "ALL" || e.cohortName === selectedCohort;

    return matchesSearch && matchesCohort;
  });

  const myStanding = entries.find(
    (e) =>
      e.email.toLowerCase() === user?.email.toLowerCase() ||
      e.studentId === user?.id,
  );

  const topThree = entries.slice(0, 3);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold shadow-lg shadow-amber-500/10">
            <Trophy size={16} />
          </div>
        );
      case 2:
        return (
          <div className="w-8 h-8 rounded-xl bg-slate-400/20 border border-slate-400/40 flex items-center justify-center text-slate-300 font-bold">
            <Medal size={16} />
          </div>
        );
      case 3:
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-700/20 border border-amber-700/40 flex items-center justify-center text-amber-600 font-bold">
            <Medal size={16} />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-[#18181D] border border-[#2A2A32] flex items-center justify-center text-gray-400 font-mono text-xs font-bold">
            #{rank}
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Global Leaderboard">
        <div className="flex flex-col items-center justify-center h-80 gap-3">
          <div className="w-10 h-10 border-4 border-[#D32F2F] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading live Codeforces & academy rankings...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Global Leaderboard">
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#18181E] via-[#22171E] to-[#18181E] border border-[#35252E] p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 inline-flex items-center gap-1.5 shadow-sm">
                  <Trophy size={13} /> Official Academy Leaderboard
                </span>
                <span className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 inline-flex items-center gap-1.5">
                  <Code2 size={12} /> Codeforces API Sync
                </span>
                <span className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Live (8s)
                </span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                Global Competitor Standings
              </h1>
              <p className="text-gray-400 text-sm max-w-xl mt-1">
                Real-time algorithmic ratings powered by official Codeforces contest rankings, curriculum problems solved, and consistency metrics.
              </p>
            </div>

            {/* Quick Action & Polling Indicator */}
            <div className="flex items-center gap-3 self-start lg:self-center">
              <button
                onClick={() => fetchLeaderboard(true)}
                disabled={isRefreshing}
                className="px-4 py-2.5 rounded-xl bg-[#24242C] hover:bg-[#2F2F3B] text-gray-300 hover:text-white border border-[#3A3A46] text-xs font-semibold inline-flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                title="Refresh Leaderboard"
              >
                <RefreshCw
                  size={14}
                  className={`${isRefreshing ? "animate-spin text-[#D32F2F]" : ""}`}
                />
                <span>{isRefreshing ? "Syncing..." : "Refresh Live"}</span>
              </button>
              <div className="hidden sm:block text-right">
                <p className="text-[11px] text-gray-500">Auto-refresh active</p>
                <p className="text-[10px] text-gray-600 font-mono">
                  Synced: {lastUpdatedTime.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Standing & Top Podium Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Standing Card */}
          {myStanding ? (
            <div className="lg:col-span-1 rounded-2xl bg-gradient-to-br from-[#1E161C] to-[#141418] border border-[#44232C] p-5 flex flex-col justify-between shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D32F2F]/10 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[#FF6B6B] flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles size={13} /> Your Live Standing
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D32F2F] text-white text-[11px] font-bold">
                    Rank #{myStanding.rank}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-0.5">
                  {myStanding.fullName}
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  <p className="text-xs text-gray-400">{myStanding.cohortName}</p>
                  {myStanding.codeforcesHandle && (
                    <a
                      href={`https://codeforces.com/profile/${myStanding.codeforcesHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-mono border border-blue-500/20 hover:bg-blue-500/20"
                    >
                      <Code2 size={10} /> {myStanding.codeforcesHandle}
                      <ExternalLink size={8} />
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-xl bg-[#0D0D10]/80 border border-[#2B1B22]">
                  <div className="text-center">
                    <div className="text-[10px] text-gray-500 uppercase font-semibold">Rating</div>
                    <div className="text-base font-extrabold text-white font-mono">
                      {myStanding.rating}
                    </div>
                  </div>
                  <div className="text-center border-x border-[#2B1B22]">
                    <div className="text-[10px] text-gray-500 uppercase font-semibold">Solved</div>
                    <div className="text-base font-extrabold text-emerald-400 font-mono">
                      {myStanding.solvedCount}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-gray-500 uppercase font-semibold">Consistency</div>
                    <div className="text-base font-extrabold text-amber-400 font-mono">
                      {myStanding.consistencyPercentage}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-400 flex items-center gap-2">
                <Flame size={14} className="text-amber-500 shrink-0" />
                <span>
                  {myStanding.codeforcesRating && myStanding.codeforcesRating > 0
                    ? `Codeforces ${myStanding.codeforcesRank || 'Rating'}: ${myStanding.codeforcesRating} + ${myStanding.solvedCount * 10} solve pts`
                    : myStanding.solvedCount > 0
                      ? `🔥 You've solved ${myStanding.solvedCount} problems! Keep climbing!`
                      : "Solve curriculum problems to gain rating points & climb the board!"}
                </span>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-1 rounded-2xl bg-[#1A1A20] border border-[#2A2A32] p-5 flex flex-col justify-center items-center text-center">
              <Award size={32} className="text-gray-500 mb-2" />
              <h4 className="text-sm font-semibold text-white">Academy Rankings</h4>
              <p className="text-xs text-gray-400 mt-1 max-w-xs">
                Solve problems in your curriculum courses to see your personal standing appear here.
              </p>
            </div>
          )}

          {/* Top 3 Champions Podium Card */}
          <div className="lg:col-span-2 rounded-2xl bg-[#1A1A20] border border-[#2A2A32] p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Trophy size={16} className="text-amber-400" />
                Top Performers Podium
              </h3>
              <span className="text-xs text-gray-500 font-mono">
                {entries.length} Enrolled Students
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {topThree.map((podium, index) => {
                const isFirst = index === 0;
                const borderClass = isFirst
                  ? "border-amber-500/40 bg-gradient-to-b from-amber-500/10 to-[#141418]"
                  : index === 1
                    ? "border-slate-400/30 bg-[#15151A]"
                    : "border-amber-700/30 bg-[#15151A]";

                const cfStyle = getCodeforcesRankStyle(podium.codeforcesRank);

                return (
                  <div
                    key={podium.studentId || podium.email}
                    className={`rounded-xl p-4 border ${borderClass} flex flex-col justify-between relative overflow-hidden transition-all hover:border-[#D32F2F]/60`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        {getRankBadge(podium.rank)}
                        <span className="text-xs font-bold text-gray-300">
                          #{podium.rank}
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#202028] text-white font-mono font-bold">
                        {podium.rating} pts
                      </span>
                    </div>

                    <div>
                      <div className="font-bold text-white text-sm truncate">
                        {podium.fullName}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 mb-2">
                        {podium.codeforcesHandle ? (
                          <a
                            href={`https://codeforces.com/profile/${podium.codeforcesHandle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${cfStyle.bgColor} ${cfStyle.textColor} ${cfStyle.borderColor} hover:underline inline-flex items-center gap-1`}
                          >
                            {podium.codeforcesHandle}
                          </a>
                        ) : (
                          <span className="text-[11px] text-gray-400 truncate">
                            {podium.cohortName}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                      <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                        <CheckCircle2 size={12} /> {podium.solvedCount} Solved
                      </span>
                      <span className="text-amber-400 font-mono text-[11px] flex items-center gap-1">
                        <Flame size={11} /> {podium.consistencyPercentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedCohort("ALL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCohort === "ALL"
                  ? "bg-[#D32F2F] text-white shadow-md shadow-[#D32F2F]/20"
                  : "bg-[#1E1E24] text-gray-400 hover:text-white border border-[#2A2A32]"
              }`}
            >
              All Cohorts ({entries.length})
            </button>
            {distinctCohorts.map((cName) => (
              <button
                key={cName}
                onClick={() => setSelectedCohort(cName)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCohort === cName
                    ? "bg-[#D32F2F] text-white shadow-md shadow-[#D32F2F]/20"
                    : "bg-[#1E1E24] text-gray-400 hover:text-white border border-[#2A2A32]"
                }`}
              >
                {cName}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-80">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by student, email, or Codeforces handle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#16161B] text-white placeholder-gray-500 border border-[#2A2A32] focus:outline-none focus:border-[#D32F2F]"
            />
          </div>
        </div>

        {/* Live Leaderboard Table */}
        <div className="bg-[#1A1A20] rounded-2xl border border-[#2A2A32] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-[#141418] text-xs uppercase text-gray-400 border-b border-[#2A2A32]">
                <tr>
                  <th className="py-4 px-5 w-20">Rank</th>
                  <th className="py-4 px-5">Student</th>
                  <th className="py-4 px-5">Codeforces</th>
                  <th className="py-4 px-5">Cohort</th>
                  <th className="py-4 px-5 text-center">Problems Solved</th>
                  <th className="py-4 px-5 text-center">Consistency</th>
                  <th className="py-4 px-5 text-right">Rating Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#24242C]">
                {filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-500">
                      <Users size={28} className="mx-auto mb-2 opacity-50" />
                      No students found matching the selected filter.
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map((e) => {
                    const isMe =
                      e.email.toLowerCase() === user?.email.toLowerCase() ||
                      e.studentId === user?.id;

                    const cfStyle = getCodeforcesRankStyle(e.codeforcesRank);

                    return (
                      <tr
                        key={e.studentId || e.email}
                        className={`transition-colors ${
                          isMe
                            ? "bg-[#D32F2F]/10 border-l-4 border-l-[#D32F2F]"
                            : "hover:bg-[#1F1F26]"
                        }`}
                      >
                        <td className="py-4 px-5 font-medium">
                          <div className="flex items-center gap-2">
                            {getRankBadge(e.rank)}
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#D32F2F]/20 text-[#D32F2F] font-bold text-xs flex items-center justify-center shrink-0 border border-[#D32F2F]/30">
                              {e.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-white flex items-center gap-2 text-sm">
                                {e.fullName}
                                {isMe && (
                                  <span className="px-2 py-0.5 text-[10px] rounded-full bg-[#D32F2F] text-white font-bold tracking-wider">
                                    YOU
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">{e.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          {e.codeforcesHandle ? (
                            <div className="flex flex-col gap-1">
                              <a
                                href={`https://codeforces.com/profile/${e.codeforcesHandle}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-xs font-bold text-white hover:text-[#D32F2F] inline-flex items-center gap-1"
                              >
                                {e.codeforcesHandle}
                                <ExternalLink size={10} className="text-gray-500" />
                              </a>
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${cfStyle.bgColor} ${cfStyle.textColor} ${cfStyle.borderColor} inline-flex items-center w-fit`}
                              >
                                {cfStyle.label} ({e.codeforcesRating || "unrated"})
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-600 italic">Not linked</span>
                          )}
                        </td>
                        <td className="py-4 px-5 text-xs text-gray-300">
                          <span className="px-2.5 py-1 rounded-lg bg-[#141418] border border-[#2A2A32]">
                            {e.cohortName}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-center font-mono">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                            <CheckCircle2 size={13} /> {e.solvedCount} Solved
                          </span>
                        </td>
                        <td className="py-4 px-5 text-center font-mono">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
                            <Flame size={12} /> {e.consistencyPercentage}%
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right font-bold text-white font-mono text-sm">
                          <span className="inline-flex items-center gap-1 text-white">
                            <TrendingUp size={13} className="text-emerald-400" />
                            {e.rating}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

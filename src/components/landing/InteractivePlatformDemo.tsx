import { useState } from "react";
import {
  Trophy,
  Activity,
  Calendar,
  Clock,
  CheckCircle2,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export default function InteractivePlatformDemo() {
  const [activeTab, setActiveTab] = useState<"contest" | "matrix" | "mentorship">("contest");

  return (
    <section className="py-24 bg-[#070A12] transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/50 text-red-400 text-xs font-semibold uppercase tracking-wider mb-3 border border-red-800/60">
            <Sparkles className="w-3.5 h-3.5" />
            Inside the Platform
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built for Elite Performance & <br className="hidden sm:inline" />
            <span className="text-red-500">Unrelenting Accountability</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Click through our interactive simulator to explore the dashboards our fellows and mentors use daily.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-2xl bg-[#0B0F1A] border border-slate-800 shadow-sm">
            <button
              onClick={() => setActiveTab("contest")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "contest"
                  ? "bg-slate-900 text-red-400 shadow-md border border-slate-700"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              Contest Arena
            </button>
            <button
              onClick={() => setActiveTab("matrix")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "matrix"
                  ? "bg-slate-900 text-red-400 shadow-md border border-slate-700"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-500" />
              Student Performance Matrix
            </button>
            <button
              onClick={() => setActiveTab("mentorship")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "mentorship"
                  ? "bg-slate-900 text-red-400 shadow-md border border-slate-700"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Calendar className="w-4 h-4 text-purple-500" />
              1-on-1 Mentorship Hub
            </button>
          </div>
        </div>

        {/* Interactive Simulator Shell */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900 text-slate-100 shadow-2xl overflow-hidden">
          {/* Top Window Bar */}
          <div className="px-6 py-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-3 text-xs font-mono text-slate-400">
                https://app.bigo.academy/{activeTab}
              </span>
            </div>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
              ● Live Sync
            </span>
          </div>

          {/* Tab 1: Contest Arena */}
          {activeTab === "contest" && (
            <div className="p-6 sm:p-8 space-y-6">
              {/* Contest Header Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider mb-1">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    Live Rated Round #42
                  </div>
                  <h3 className="text-xl font-black text-white">BigO Weekly Div 2 Championship</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Rated for all Cohort 2026 Fellows • ICPC scoring with 20min wrong submission penalty
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <div>
                    <p className="text-[10px] uppercase text-slate-400 font-bold">Time Remaining</p>
                    <p className="text-base font-mono font-black text-white">01:14:38</p>
                  </div>
                </div>
              </div>

              {/* Problems Scoreboard Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { tag: "A", title: "Bitwise XOR Subarrays", solved: "142 Solves", points: "500 pts", status: "ACCEPTED", time: "00:08:14" },
                  { tag: "B", title: "Eulerian Path Reconstruction", solved: "98 Solves", points: "1000 pts", status: "ACCEPTED", time: "00:24:50" },
                  { tag: "C", title: "Segment Tree Point Updates", solved: "45 Solves", points: "1500 pts", status: "ACCEPTED", time: "00:51:12" },
                  { tag: "D", title: "Tree Heavy-Light Decomp", solved: "12 Solves", points: "2250 pts", status: "IN_PROGRESS", time: "Attempting" },
                ].map((p, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-6 h-6 rounded-lg bg-red-600/20 text-red-400 font-bold text-xs flex items-center justify-center font-mono">
                        {p.tag}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        p.status === "ACCEPTED" ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-amber-950 text-amber-400 border border-amber-800"
                      }`}>
                        {p.status === "ACCEPTED" ? `AC (${p.time})` : p.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1 line-clamp-1">{p.title}</h4>
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                      <span>{p.points}</span>
                      <span>{p.solved}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Ranklist Table Preview */}
              <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950/50">
                <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-xs font-bold text-slate-400 flex items-center justify-between">
                  <span>Current Leaderboard Standings</span>
                  <span>Top 40 Cohort Fellows</span>
                </div>
                <div className="divide-y divide-slate-800/80 text-xs">
                  {[
                    { rank: 1, handle: "yared_solves", score: 3000, penalty: 84, rating: "1924 (+65)", avatar: "🏆" },
                    { rank: 2, handle: "meron_t", score: 3000, penalty: 102, rating: "1850 (+48)", avatar: "🥈" },
                    { rank: 3, handle: "alex_coder", score: 2500, penalty: 68, rating: "1740 (+32)", avatar: "🥉" },
                  ].map((row) => (
                    <div key={row.rank} className="px-4 py-3 flex items-center justify-between hover:bg-slate-800/30">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-slate-400 w-4">{row.rank}</span>
                        <span className="text-sm">{row.avatar}</span>
                        <span className="font-bold text-white font-mono">{row.handle}</span>
                      </div>
                      <div className="flex items-center gap-6 font-mono text-slate-300">
                        <span>Score: <strong className="text-emerald-400">{row.score}</strong></span>
                        <span>Penalty: {row.penalty}m</span>
                        <span className="text-amber-400 font-bold">{row.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Student Performance Matrix */}
          {activeTab === "matrix" && (
            <div className="p-6 sm:p-8 space-y-6">
              {/* Matrix Top Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Overall Attendance</span>
                    <span className="text-emerald-400 font-bold">100.0%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                    <div className="bg-emerald-500 h-full w-full rounded-full" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">24/24 Sessions Attended</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Codeforces Rating</span>
                    <span className="text-amber-400 font-bold font-mono">1,842 (Expert)</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-400">+320 pts this cohort</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Synced with @meron_dev</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Academic Standing</span>
                    <span className="text-emerald-400 font-bold">In Good Standing</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">0 Active Warnings</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Early Warning Sentinel clear</p>
                </div>
              </div>

              {/* Topic Mastery Radar Bars */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800">
                <h4 className="text-sm font-bold text-white mb-4">Algorithmic Skill Breakdown</h4>
                <div className="space-y-3.5">
                  {[
                    { topic: "Two Pointers & Sliding Window", solved: "32/32 Solved", pct: "100%", color: "bg-emerald-500" },
                    { topic: "Dynamic Programming (1D & 2D)", solved: "42/48 Solved", pct: "87.5%", color: "bg-red-500" },
                    { topic: "Graph Traversals & Shortest Path", solved: "38/40 Solved", pct: "95%", color: "bg-blue-500" },
                    { topic: "Trees, BST & Heaps", solved: "35/36 Solved", pct: "97.2%", color: "bg-purple-500" },
                  ].map((skill, sIdx) => (
                    <div key={sIdx}>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-200">{skill.topic}</span>
                        <span className="font-mono text-slate-400">{skill.solved} ({skill.pct})</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className={`${skill.color} h-full rounded-full`} style={{ width: skill.pct }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: 1-on-1 Mentorship Hub */}
          {activeTab === "mentorship" && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-2xl font-bold text-red-400">
                    NT
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-black text-white">Nahom Tadesse</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-400 border border-purple-800">
                        Senior Mentor (ex-Google)
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Assigned Teacher • Specializes in Advanced Graph Algorithms & Distributed Systems
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow-md">
                    Book Next 1-on-1 Slot
                  </button>
                </div>
              </div>

              {/* Recent Feedback Notes */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Recent Mentorship Audit Notes:
                </h4>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono">
                  <p className="text-emerald-400 mb-1">
                    [Mentor Feedback — Phase 2 Review Session]:
                  </p>
                  "Great work reducing your 2D knapsack DP state to 1D space in problem #416. For next week's contest, focus on edge cases with negative cycle detection in Bellman-Ford. Keep maintaining the 100% attendance rate."
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

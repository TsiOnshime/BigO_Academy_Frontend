import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Trophy,
  CheckCircle2,
  LogIn,
  Layers,
} from "lucide-react";

interface HeroSectionProps {
  onOpenApplyModal?: () => void;
}

export default function HeroSection({ onOpenApplyModal }: HeroSectionProps) {
  const milestones = [
    {
      phase: "Phase 1",
      name: "Core Data Structures & Complexity",
      complexity: "O(1) / O(log N)",
      color: "border-blue-500/40 text-blue-400 bg-blue-500/10",
    },
    {
      phase: "Phase 2",
      name: "Graph Theory, Trees & Shortest Paths",
      complexity: "O(V + E log V)",
      color: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
    },
    {
      phase: "Phase 3",
      name: "Dynamic Programming & Tabulation",
      complexity: "O(N · W)",
      color: "border-amber-500/40 text-amber-400 bg-amber-500/10",
    },
    {
      phase: "Phase 4",
      name: "Competitive Sprints & FAANG Mocks",
      complexity: "ICPC / FAANG",
      color: "border-red-500/40 text-red-400 bg-red-500/10",
    },
  ];

  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-[#070A12] bg-grid-pattern">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-red-600/15 via-rose-500/10 to-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Top Cohort Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/50 border border-red-800/60 shadow-sm mb-6">
              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-semibold text-red-400">
                🚀 Cohort 2026 Admissions
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-medium text-slate-400">
                Strict 40 Fellow Cap
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
              Master Algorithms. <br />
              <span className="bg-gradient-to-r from-red-500 via-rose-400 to-amber-400 bg-clip-text text-transparent">
                Crack Tier-1 Interviews.
              </span> <br />
              Join the Top 1%.
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed font-normal max-w-2xl">
              The high-intensity competitive programming & DSA academy. Structured 16-week sprints, automated Codeforces sync, rated contests, and FAANG-grade interview coaching.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <button
                onClick={onOpenApplyModal}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-2xl shadow-glow-red hover:shadow-glow-red-lg hover:-translate-y-0.5 transition-all"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                Apply for Cohort 2026
                <ArrowRight className="w-5 h-5" />
              </button>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-2xl border border-slate-700 transition-all"
              >
                <LogIn className="w-4 h-4 text-slate-400" />
                Fellow Login
              </Link>
            </div>

            {/* Social Trust Metrics */}
            <div className="mt-10 pt-8 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-slate-400 text-sm w-full">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span className="font-semibold text-slate-200">98.4%</span> Pass Rate
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <span className="font-semibold text-slate-200">+350 pts</span> Codeforces Growth
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-red-500" />
                <span className="font-semibold text-slate-200">Bi-Weekly</span> Rated Rounds
              </div>
            </div>
          </div>

          {/* Right Column: Sleek Algorithmic Mastery Showcase */}
          <div className="lg:col-span-5 relative">
            {/* Top Floating Badge */}
            <div className="absolute -top-4 -right-2 sm:-right-4 z-20 hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700 shadow-xl">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 font-black text-sm">
                🏆
              </div>
              <div>
                <p className="text-xs font-bold text-white">Alumni at FAANG</p>
                <p className="text-[10px] font-medium text-slate-400">Google • Meta • Amazon</p>
              </div>
            </div>

            {/* Showcase Card */}
            <div className="rounded-3xl p-6 sm:p-7 bg-[#0B0F1A] border border-slate-800 shadow-2xl relative overflow-hidden">
              {/* Subtle card glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-5 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">Algorithmic Journey</h3>
                    <p className="text-[11px] text-slate-400">Structured 4-Phase Progression</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                  16-Week Intensive
                </span>
              </div>

              {/* Milestones Progression */}
              <div className="mt-5 space-y-3">
                {milestones.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/90 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 font-mono">
                        {idx + 1}
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                          {m.phase}
                        </span>
                        <p className="text-xs font-bold text-white leading-tight">
                          {m.name}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-lg border ${m.color}`}>
                      {m.complexity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom Feature Pill */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-red-500" />
                  Daily Problem Verification
                </span>
                <span className="text-red-400 font-semibold font-mono">400+ Problems</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

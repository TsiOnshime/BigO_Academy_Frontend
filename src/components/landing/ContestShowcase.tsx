import { Trophy, Calendar, Users, Clock, ArrowRight } from "lucide-react";

interface ContestShowcaseProps {
  onOpenApplyModal?: () => void;
}

export default function ContestShowcase({ onOpenApplyModal }: ContestShowcaseProps) {
  const upcomingContests = [
    {
      id: 1,
      title: "BigO Weekly Div 2 Championship #43",
      date: "Saturday, 8:00 PM EAT",
      duration: "2 Hours",
      problems: "5 Problems (Easy to Hard)",
      registered: "128 Fellows",
      status: "Registration Open",
      tag: "RATED",
    },
    {
      id: 2,
      title: "Dynamic Programming & Trees Sprint",
      date: "Wednesday, 7:30 PM EAT",
      duration: "90 Minutes",
      problems: "4 Problems (DP & Tree Centroids)",
      registered: "94 Fellows",
      status: "Upcoming",
      tag: "THEMATIC",
    },
    {
      id: 3,
      title: "Monthly All-Cohort Grand Prix #11",
      date: "Last Sunday of Month",
      duration: "3 Hours",
      problems: "6 ICPC-Style Complex Problems",
      registered: "210 Fellows",
      status: "$1,500 Prize Pool",
      tag: "MAJOR",
    },
  ];

  return (
    <section id="contests" className="py-24 bg-[#070A12] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Contest Philosophy */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/50 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3 border border-amber-800/60">
              <Trophy className="w-3.5 h-3.5" />
              Rated Competition Arena
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Pressure Tests That <br />
              <span className="text-red-500">Forge Elite Speed & Accuracy</span>
            </h2>
            <p className="mt-4 text-base text-slate-300 leading-relaxed">
              Technical interviews are timed pressure cookers. Our bi-weekly rated rounds simulate real ICPC and Codeforces conditions so by interview day, 45 minutes feels like second nature.
            </p>

            {/* Feature List */}
            <div className="mt-6 space-y-3.5 text-sm text-slate-300 font-medium">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>Real-time Elo rating adjustments (+/- Codeforces curve)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>Frozen scoreboard in the final 30 minutes for suspense</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>Live video editorial breakdown by lead mentors immediately post-contest</span>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={onOpenApplyModal}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-600/20 hover:-translate-y-0.5 transition-all"
              >
                Apply for Next Cohort <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Upcoming Schedule Cards */}
          <div className="lg:col-span-7 space-y-4">
            {upcomingContests.map((c) => (
              <div
                key={c.id}
                className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm hover:shadow-xl hover:border-red-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        c.tag === "MAJOR"
                          ? "bg-amber-950 text-amber-400 border border-amber-800"
                          : "bg-red-950 text-red-400 border border-red-800"
                      }`}
                    >
                      {c.tag}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {c.date}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {c.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {c.duration}
                    </span>
                    <span>•</span>
                    <span>{c.problems}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-200 font-semibold">
                      <Users className="w-3.5 h-3.5" /> {c.registered}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <span className="inline-flex items-center gap-1 px-4 py-2 text-xs font-bold text-slate-200 bg-slate-800 rounded-xl border border-slate-700 shadow-sm">
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

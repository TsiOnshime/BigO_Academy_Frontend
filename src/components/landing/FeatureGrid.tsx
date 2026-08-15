import {
  Trophy,
  Users,
  Zap,
  Briefcase,
  Activity,
  Cpu,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

export default function FeatureGrid() {
  const features = [
    {
      id: "contests",
      title: "Bi-Weekly Rated Contests",
      badge: "Real-Time Ranking",
      description:
        "Compete in live, high-stakes contests with dynamic penalty points, frozen scoreboards, and instant rating recalculations modeled after ICPC and Codeforces Div 2.",
      icon: Trophy,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "hover:border-amber-500/40",
      stats: "2-hour timed rounds • Live standings",
    },
    {
      id: "mentorship",
      title: "1-on-1 Senior Mentorship",
      badge: "Personalized Coaching",
      description:
        "Book private weekly sessions with dedicated mentors. Review your code bottlenecks, optimize space-time complexity, and dissect challenging graph/DP patterns.",
      icon: Users,
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "hover:border-red-500/40",
      stats: "Ex-FAANG & ICPC finalists",
    },
    {
      id: "sync",
      title: "Automated Platform Tracking",
      badge: "Continuous Sync",
      description:
        "Link your Codeforces handle and LeetCode profile. Our backend automatically ingests accepted solutions, detects difficulty levels, and updates your radar mastery chart.",
      icon: Zap,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "hover:border-blue-500/40",
      stats: "Zero manual submission entry",
    },
    {
      id: "sentinel",
      title: "Academic Warning Sentinel",
      badge: "Accountability First",
      description:
        "Never fall behind. Our automated warning system monitors attendance, contest participation, and problem solving pace, alerting mentors for early intervention.",
      icon: Activity,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "hover:border-emerald-500/40",
      stats: "99.1% completion rate",
    },
    {
      id: "cohorts",
      title: "Selective Cohort Learning",
      badge: "Peer Community",
      description:
        "Learn alongside top-tier peers in capped cohorts of 35-40 students. Participate in daily standups, code walkthroughs, and collaborative problem-solving pods.",
      icon: Cpu,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "hover:border-purple-500/40",
      stats: "Daily live discussion sessions",
    },
    {
      id: "career",
      title: "Placement & Interview Sprints",
      badge: "Tier-1 Referrals",
      description:
        "Transition seamlessly from algorithmic problem solver to high-earning software engineer with our tailored mock technical panels and direct employer referrals.",
      icon: Briefcase,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "hover:border-rose-500/40",
      stats: "$120k+ avg global starting compensation",
    },
  ];

  return (
    <section id="features" className="py-24 bg-[#0B0F1A] border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/50 text-red-400 text-xs font-semibold uppercase tracking-wider mb-3 border border-red-800/60">
            <Sparkles className="w-3.5 h-3.5" />
            The BigO Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Everything You Need to Dominate <br className="hidden sm:inline" />
            <span className="text-red-500">Technical Interviews & Contests</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            We combined the rigor of competitive programming with the personalized attention of elite engineering mentorship.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group ${item.border}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>{item.stats}</span>
                  <a
                    href="#curriculum"
                    className="text-red-400 hover:text-red-300 group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5"
                  >
                    View Syllabus <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

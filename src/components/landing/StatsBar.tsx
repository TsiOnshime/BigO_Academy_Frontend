import { Trophy, TrendingUp, CheckCircle2, Award } from "lucide-react";

export default function StatsBar() {
  const stats = [
    {
      label: "Interview Pass Rate",
      value: "98.4%",
      description: "Fellows landing tier-1 software offers within 4 months",
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Alumni Placements",
      value: "450+",
      description: "Hired across North America, Europe & Africa",
      icon: Trophy,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Average Rating Surge",
      value: "+380",
      description: "Codeforces rating increase across active cohorts",
      icon: TrendingUp,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      label: "Curated Problems",
      value: "500+",
      description: "Handpicked patterns from LeetCode & Codeforces",
      icon: Award,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
  ];

  const companies = [
    "Google",
    "Meta",
    "Amazon",
    "Microsoft",
    "Bloomberg",
    "Stripe",
    "Uber",
    "Goldman Sachs",
  ];

  return (
    <section className="py-14 bg-[#0B0F1A] border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm hover:shadow-md hover:border-red-500/40 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                    {stat.value}
                  </span>
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">
                    {stat.label}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Company Logos Ribbon */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 whitespace-nowrap">
            Alumni Engineering Impact
          </span>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-8 gap-y-4">
            {companies.map((company, i) => (
              <span
                key={i}
                className="text-sm font-bold text-slate-400 hover:text-slate-200 transition-colors tracking-wide"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import { Star } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Yared Belay",
      role: "Software Engineer @ Google London",
      cohort: "Cohort 2025 Fellow",
      cfGrowth: "Codeforces 1320 → 1910",
      imageText: "YB",
      rating: 5,
      company: "Google",
      quote:
        "Before BigO Academy, I struggled with hard DP and graph questions during tech screens. The daily live sessions and 1-on-1 code reviews with Nahom gave me the exact intuition I needed. I passed my Google onsite with 0 hesitation.",
    },
    {
      name: "Meron Tadesse",
      role: "Software Engineer @ Meta Menlo Park",
      cohort: "Cohort 2025 Fellow",
      cfGrowth: "LeetCode: 520 Solved (Hard 140+)",
      imageText: "MT",
      rating: 5,
      company: "Meta",
      quote:
        "The bi-weekly rated contests are brutal in the best way possible. By the time I sat for my Meta technical screen, 45 minutes felt like plenty of time. The accountability sentinel system made sure I never skipped a problem.",
    },
    {
      name: "Abel Kassahun",
      role: "Software Engineer @ Bloomberg NYC",
      cohort: "Cohort 2024 Fellow",
      cfGrowth: "ICPC Regional Finalist",
      imageText: "AK",
      rating: 5,
      company: "Bloomberg",
      quote:
        "BigO Academy isn't a passive video tutorial course. It is an elite training camp. The teachers are active competitive programmers who teach you how to analyze time complexity on a mathematical level.",
    },
  ];

  return (
    <section className="py-24 bg-[#0B0F1A] border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/50 text-red-400 text-xs font-semibold uppercase tracking-wider mb-3 border border-red-800/60">
            <Star className="w-3.5 h-3.5 fill-current" />
            Alumni Outcomes
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Proof in Our Fellows' <br className="hidden sm:inline" />
            <span className="text-red-500">Placement & Rating Growth</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Read how ambitious engineers transformed their problem-solving ability and broke into world-class tech companies.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-sm text-slate-300 leading-relaxed mb-6 italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-6 border-t border-slate-800/80">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-700 text-white font-extrabold text-base flex items-center justify-center shadow-sm">
                    {t.imageText}
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-white">
                      {t.name}
                    </h4>
                    <p className="text-xs font-bold text-red-400">
                      {t.role}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {t.cfGrowth}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

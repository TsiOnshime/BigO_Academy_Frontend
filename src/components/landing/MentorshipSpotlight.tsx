import { Award, CheckCircle2 } from "lucide-react";

export default function MentorshipSpotlight() {
  const mentors = [
    {
      name: "Nahom Tadesse",
      role: "Lead Algorithms Coach",
      company: "ex-Google • L6 Senior SWE",
      rating: "Codeforces 2340 (Master)",
      specialty: "Dynamic Programming & Graph Theory",
      bio: "Coached 180+ fellows into Google, Meta, and Bloomberg. 2x ICPC Regional Gold Medalist.",
      sessions: "1,200+ 1-on-1s conducted",
      avatar: "NT",
      bgGradient: "from-red-600 to-rose-700",
    },
    {
      name: "Meron Assefa",
      role: "Competitive Programming Mentor",
      company: "ex-Meta • Staff Engineer",
      rating: "Codeforces 2410 (Grandmaster)",
      specialty: "Advanced Trees, Heaps & Math",
      bio: "Specializes in high-speed contest problem solving, segment trees, and binary search answer optimizations.",
      sessions: "950+ 1-on-1s conducted",
      avatar: "MA",
      bgGradient: "from-blue-600 to-indigo-700",
    },
    {
      name: "Samuel Gebre",
      role: "System Design & Interview Lead",
      company: "ex-Amazon Principal SWE",
      rating: "LeetCode 2750+ (Top 0.1%)",
      specialty: "Distributed Systems & Mock Grills",
      bio: "Conducted over 300 real hiring loops. Trains fellows on clear communication, whiteboarding, and concurrency.",
      sessions: "800+ Mock Interviews",
      avatar: "SG",
      bgGradient: "from-emerald-600 to-teal-700",
    },
  ];

  return (
    <section id="mentors" className="py-24 bg-[#0B0F1A] border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/50 text-red-400 text-xs font-semibold uppercase tracking-wider mb-3 border border-red-800/60">
            <Award className="w-3.5 h-3.5" />
            World-Class Mentorship
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Learn From Engineers Who Have <br className="hidden sm:inline" />
            <span className="text-red-500">Won ICPCs & Built Tier-1 Systems</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            You are not learning from generic tutorial creators. You receive weekly 1-on-1 coaching from competitive programmers and tech leads.
          </p>
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mentors.map((mentor, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Top Badge */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${mentor.bgGradient} text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-red-500/20`}>
                    {mentor.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">
                      {mentor.name}
                    </h3>
                    <p className="text-xs font-bold text-red-400">
                      {mentor.role}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                      {mentor.company}
                    </p>
                  </div>
                </div>

                {/* Rating & Specialty Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-amber-950/80 text-amber-400 border border-amber-800/60 font-mono">
                    {mentor.rating}
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300">
                    {mentor.specialty}
                  </span>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  {mentor.bio}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  {mentor.sessions}
                </span>
                <span className="text-red-400">1-on-1 Included</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

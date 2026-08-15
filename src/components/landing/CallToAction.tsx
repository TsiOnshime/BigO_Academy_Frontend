import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, ShieldCheck, Zap, LogIn } from "lucide-react";

interface CallToActionProps {
  onOpenApplyModal?: () => void;
}

export default function CallToAction({ onOpenApplyModal }: CallToActionProps) {
  return (
    <section className="py-20 relative overflow-hidden bg-[#070A12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-red-600 via-rose-600 to-red-800 p-8 sm:p-14 lg:p-16 text-white shadow-2xl shadow-red-600/30">
          {/* Ambient Glows & Grid Pattern */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-white text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-amber-300" />
              Cohort 2026 Admissions
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Ready to Master Algorithms & <br />
              Crack Tier-1 Tech Interviews?
            </h2>

            {/* Subhead */}
            <p className="mt-5 text-base sm:text-lg text-red-100 leading-relaxed font-normal">
              Join the ambitious developers who transformed their coding intuition, skyrocketed their Codeforces ratings, and broke into top tech companies worldwide.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onOpenApplyModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-extrabold text-red-600 bg-white hover:bg-red-50 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                <Sparkles className="w-5 h-5 text-red-600" />
                Apply for Cohort 2026
                <ArrowRight className="w-5 h-5" />
              </button>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-semibold text-white bg-white/15 hover:bg-white/25 rounded-2xl border border-white/20 backdrop-blur-sm transition-all"
              >
                <LogIn className="w-4 h-4" />
                Existing Fellow? Sign In
              </Link>
            </div>

            {/* Footer Trust Guarantee */}
            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-red-100/90">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                Admin-Provisioned Credentials
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-300" />
                16-Week Intensive Syllabus
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

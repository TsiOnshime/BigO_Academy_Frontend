import { Link } from "react-router-dom";

interface LandingFooterProps {
  onOpenApplyModal?: () => void;
}

export default function LandingFooter({ onOpenApplyModal }: LandingFooterProps) {
  return (
    <footer className="bg-[#05070D] text-slate-400 text-sm border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group focus:outline-none">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-md shadow-red-500/20">
                <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                  <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-white">
                  BigO<span className="text-red-500">.Academy</span>
                </span>
                <span className="text-[10px] font-medium tracking-widest text-slate-400 uppercase -mt-1">
                  Elite Algorithmic Hub
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The premier competitive programming & data structures academy. Designed by ICPC finalists and senior FAANG engineers to transform ambitious developers into top 1% problem solvers.
            </p>
          </div>

          {/* Col 3: Curriculum */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Curriculum
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#curriculum" className="hover:text-white transition-colors">
                  Phase 1: Foundations & Big-O
                </a>
              </li>
              <li>
                <a href="#curriculum" className="hover:text-white transition-colors">
                  Phase 2: Trees, Heaps & DP
                </a>
              </li>
              <li>
                <a href="#curriculum" className="hover:text-white transition-colors">
                  Phase 3: Graph Theory & DSU
                </a>
              </li>
              <li>
                <a href="#curriculum" className="hover:text-white transition-colors">
                  Phase 4: Sprints & FAANG Mocks
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#contests" className="hover:text-white transition-colors">
                  Live Rated Contests
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Automated Codeforces Sync
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Academic Warning Sentinel
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Fellow Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Academy & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Admissions
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Admissions FAQ
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenApplyModal}
                  className="text-red-400 font-bold hover:underline focus:outline-none text-left"
                >
                  Apply for Cohort 2026 →
                </button>
              </li>
              <li>
                <span className="text-slate-400">Terms of Service</span>
              </li>
              <li>
                <span className="text-slate-400">Privacy Policy</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

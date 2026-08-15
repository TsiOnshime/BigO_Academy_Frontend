import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Menu, X, ArrowRight, Sparkles, LayoutDashboard, LogIn } from "lucide-react";

interface LandingNavbarProps {
  onOpenApplyModal?: () => void;
}

export default function LandingNavbar({ onOpenApplyModal }: LandingNavbarProps) {
  const { user, isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Curriculum", href: "#curriculum" },
    { name: "Platform", href: "#features" },
    { name: "Live Contests", href: "#contests" },
    { name: "FAQ", href: "#faq" },
  ];

  const getDashboardPath = () => {
    if (!user) return "/dashboard";
    switch (user.role) {
      case "TEACHER":
        return "/teacher/dashboard";
      case "ADMIN":
        return "/admin/dashboard";
      default:
        return "/dashboard";
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#070A12]/90 backdrop-blur-md shadow-lg shadow-black/40 border-b border-slate-800/80 py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-red-400 transition-colors">
                BigO<span className="text-red-500">.Academy</span>
              </span>
              <span className="text-[10px] font-medium tracking-widest text-slate-400 uppercase -mt-1">
                Elite Algorithmic Hub
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-full border border-slate-800 backdrop-blur-sm">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-1.5 text-sm font-medium text-slate-300 hover:text-white rounded-full hover:bg-slate-800/80 transition-all"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to={getDashboardPath()}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm hover:shadow-red-600/30 transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  <LogIn className="w-4 h-4 text-slate-400" />
                  Sign In
                </Link>
                <button
                  onClick={onOpenApplyModal}
                  className="group inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl shadow-md shadow-red-600/25 hover:shadow-red-600/40 hover:-translate-y-0.5 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Apply for Cohort
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-200 hover:bg-slate-800 focus:outline-none"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-4 pb-6 bg-[#070A12]/95 backdrop-blur-xl border-b border-slate-800 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 text-base font-medium text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                {link.name}
              </a>
            ))}

            <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col gap-2.5">
              {isAuthenticated ? (
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center font-semibold text-white bg-red-600 rounded-xl"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 text-center font-semibold text-slate-200 bg-slate-800 rounded-xl"
                  >
                    Sign In
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenApplyModal?.();
                    }}
                    className="w-full py-2.5 text-center font-semibold text-white bg-red-600 rounded-xl flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    Apply for Cohort
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

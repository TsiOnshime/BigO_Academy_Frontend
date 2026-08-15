import { useState } from "react";
import { X, Bell, CheckCircle2, Sparkles, Send } from "lucide-react";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationUrl?: string | null;
}

export default function ApplicationModal({
  isOpen,
  onClose,
  applicationUrl = null,
}: ApplicationModalProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  // If an application link is provided, open it directly
  if (applicationUrl && applicationUrl.trim().length > 0) {
    window.open(applicationUrl, "_blank", "noopener,noreferrer");
    onClose();
    return null;
  }

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#0E1322] border border-slate-800 text-white shadow-2xl shadow-red-950/40">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        {!isSubmitted ? (
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/30 text-red-500 flex items-center justify-center mx-auto mb-5">
              <Bell className="w-7 h-7" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/60 text-red-400 text-[11px] font-bold uppercase tracking-wider mb-3 border border-red-800/60">
              <Sparkles className="w-3.5 h-3.5" />
              Admissions Status
            </div>

            <h3 className="text-2xl font-black tracking-tight text-white mb-2">
              Applications Are Not Open Yet
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Admissions for <strong className="text-white">Cohort 2026</strong> have not opened yet. Leave your email below to get notified the exact moment applications go live.
            </p>

            {/* Email Form */}
            <form onSubmit={handleNotifySubmit} className="space-y-3">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-red-600 hover:bg-red-500 shadow-glow-red hover:shadow-glow-red-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Adding you to waitlist...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Get Notified on Launch
                  </>
                )}
              </button>
            </form>

            <p className="text-[11px] text-slate-500 mt-4">
              Zero spam. We will only contact you when applications officially open.
            </p>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <h3 className="text-2xl font-black text-white mb-2">
              You're on the Priority List!
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              We've registered <strong className="text-white font-mono">{email}</strong>. You'll receive early access the moment Cohort 2026 admissions go live.
            </p>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl font-bold text-sm text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

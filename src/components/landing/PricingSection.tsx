import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Zap, ArrowRight, ShieldCheck } from "lucide-react";

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "cohort">("cohort");

  const tiers = [
    {
      id: "foundations",
      name: "Foundations Track",
      tagline: "Self-paced structured mastery for disciplined problem solvers.",
      price: billingCycle === "cohort" ? "$499" : "$149",
      billingNote: billingCycle === "cohort" ? "One-time payment for 16 weeks" : "Billed monthly",
      isPopular: false,
      features: [
        "Full access to 4-Phase Curriculum (500+ problems)",
        "Automated Codeforces & LeetCode tracking",
        "Bi-Weekly Rated Contests & live ranklists",
        "Discord fellow community & study pods",
        "Curated solution video editorials",
      ],
      ctaText: "Enroll in Foundations",
      ctaLink: "/register",
    },
    {
      id: "pro-fellow",
      name: "Pro Fellow",
      tagline: "The flagship cohort experience with live daily coaching & 1-on-1 mentorship.",
      price: billingCycle === "cohort" ? "$999" : "$299",
      billingNote: billingCycle === "cohort" ? "One-time payment for 16 weeks (Save 17%)" : "Billed monthly",
      isPopular: true,
      popularBadge: "MOST POPULAR",
      features: [
        "Everything in Foundations Track",
        "Daily Live Cohort Sessions & Standups",
        "Weekly 1-on-1 Dedicated Senior Mentorship",
        "Line-by-line Code Reviews & Bottleneck Audits",
        "Academic Warning Sentinel early support",
        "Full 16-Week Certificate of Algorithmic Mastery",
        "Priority contest review by ICPC coaches",
      ],
      ctaText: "Apply as Pro Fellow",
      ctaLink: "/register",
    },
    {
      id: "elite-placement",
      name: "Elite Placement",
      tagline: "Intensive career acceleration with unlimited mock technical grills & referrals.",
      price: billingCycle === "cohort" ? "$1,699" : "$499",
      billingNote: billingCycle === "cohort" ? "One-time payment for 16 weeks" : "Billed monthly",
      isPopular: false,
      features: [
        "Everything in Pro Fellow",
        "Unlimited 1-on-1 Mock Technical & Behavioral Panels",
        "Direct Employer Referrals (FAANG & Tier-1 Tech)",
        "System Design & Low-Level Concurrency Modules",
        "Resume Polishing & GitHub Portfolio Audit",
        "Dedicated Career Concierge & Offer Negotiation",
      ],
      ctaText: "Apply for Elite Placement",
      ctaLink: "/register",
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-[#070A12] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/50 text-red-400 text-xs font-semibold uppercase tracking-wider mb-3 border border-red-800/60">
            <Zap className="w-3.5 h-3.5" />
            Transparent Tuition
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Invest in Your Career & <br className="hidden sm:inline" />
            <span className="text-red-500">Master Algorithms for Life</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            No hidden fees. Choose between monthly installments or save with full cohort tuition.
          </p>

          {/* Billing Cycle Switcher */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className={`text-sm font-bold ${billingCycle === "monthly" ? "text-white" : "text-slate-500"}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "cohort" : "monthly")}
              className="w-14 h-8 rounded-full bg-slate-800 border border-slate-700 p-1 transition-colors relative focus:outline-none"
            >
              <div
                className={`w-6 h-6 rounded-full bg-red-600 shadow-md transition-transform ${
                  billingCycle === "cohort" ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-sm font-bold flex items-center gap-1.5 ${billingCycle === "cohort" ? "text-white" : "text-slate-500"}`}>
              Full 16-Week Cohort
              <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800">
                Save 17%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                tier.isPopular
                  ? "bg-slate-950 text-white shadow-2xl border-2 border-red-600 lg:-translate-y-2"
                  : "bg-slate-900/90 text-white border border-slate-800 shadow-sm hover:border-slate-700"
              }`}
            >
              {tier.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-red-600 text-white text-xs font-black tracking-wider uppercase shadow-md shadow-red-600/30">
                  {tier.popularBadge}
                </div>
              )}

              <div>
                <h3 className="text-xl font-black mb-2 text-white">{tier.name}</h3>
                <p className="text-xs leading-relaxed mb-6 text-slate-300">
                  {tier.tagline}
                </p>

                <div className="mb-6 pb-6 border-b border-slate-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">{tier.price}</span>
                    <span className="text-xs font-semibold text-slate-400">
                      {billingCycle === "cohort" ? " / 16 weeks" : " / month"}
                    </span>
                  </div>
                  <p className="text-[11px] mt-1 text-red-400 font-medium">
                    {tier.billingNote}
                  </p>
                </div>

                <div className="space-y-3.5 mb-8">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    What's included:
                  </p>
                  {tier.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-3">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 ${
                        tier.isPopular ? "bg-red-600 text-white" : "bg-emerald-500/20 text-emerald-400"
                      }`}>
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="text-xs leading-snug font-medium text-slate-200">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Link
                  to={tier.ctaLink}
                  className={`w-full py-3.5 rounded-xl text-sm font-bold text-center inline-flex items-center justify-center gap-2 transition-all ${
                    tier.isPopular
                      ? "bg-red-600 hover:bg-red-500 text-white shadow-glow-red hover:shadow-glow-red-lg"
                      : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 shadow-sm"
                  }`}
                >
                  {tier.ctaText}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantee Callout */}
        <div className="mt-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>7-Day Risk-Free Trial • 100% Refund if you don't find the cohort transformative</span>
        </div>
      </div>
    </section>
  );
}

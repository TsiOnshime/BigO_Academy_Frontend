import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Who is BigO Academy designed for?",
      answer:
        "BigO Academy is tailored for CS students, bootcamp graduates, and working software engineers who want to reach competitive programming fluency and crack Tier-1/FAANG technical interview loops. If you know basic syntax in Python, C++, or Java and want to master advanced DSA, this academy is for you.",
    },
    {
      question: "What is the expected weekly time commitment?",
      answer:
        "We recommend dedicating 12 to 16 hours per week. This includes daily 1-hour live cohort standups or recorded lecture reviews, solving 15-20 assigned problems, attending bi-weekly 2-hour rated contests, and your 1-on-1 mentor session.",
    },
    {
      question: "How do the 1-on-1 mentorship sessions work?",
      answer:
        "Each fellow is paired with an assigned senior mentor (ex-Google, ex-Meta, or ICPC finalist). You can book your private 45-minute slots weekly to review code bottlenecks, practice whiteboard mock interviews, and get personalized advice on problem intuition.",
    },
    {
      question: "What programming languages can I use?",
      answer:
        "You can solve problems in Python 3, C++ (20/17), Java, or TypeScript/JavaScript. Our automated sync engine supports all major languages on Codeforces and LeetCode. Our mentors provide language-specific optimizations and memory benchmarks.",
    },
    {
      question: "How does the Academic Warning Sentinel protect students?",
      answer:
        "Our platform monitors daily attendance and weekly solve rates. If your solve count or session attendance falls below 80%, our system triggers a supportive early-warning alert. Your assigned mentor is immediately notified to schedule an intervention session to get you back on track before you fall behind.",
    },
    {
      question: "How do I receive my account credentials?",
      answer:
        "BigO Academy accounts are provisioned exclusively by administrators. Once you are accepted into a cohort, the administration team creates your fellow account and emails your login credentials directly to you.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-[#0B0F1A] border-t border-slate-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/50 text-red-400 text-xs font-semibold uppercase tracking-wider mb-3 border border-red-800/60">
            <HelpCircle className="w-3.5 h-3.5" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Have Questions? We Have Answers.
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Everything you need to know about our cohorts, mentorship structure, and admissions.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-sm transition-colors"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-bold text-white">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-red-400" : "text-slate-400"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm text-slate-300 leading-relaxed border-t border-slate-800 pt-4 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

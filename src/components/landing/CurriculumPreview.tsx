import { useState } from "react";
import { BookOpen, CheckCircle2, ChevronRight, Code2, Flame, Sparkles } from "lucide-react";

interface TopicItem {
  name: string;
  problemsCount: number;
  tags: string[];
}

interface Phase {
  id: number;
  title: string;
  badge: string;
  subtitle: string;
  weeks: string;
  difficulty: string;
  description: string;
  topics: TopicItem[];
  sampleProblems: {
    title: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    source: "LeetCode" | "Codeforces";
    url?: string;
  }[];
}

const PHASES: Phase[] = [
  {
    id: 1,
    title: "Phase 1: Algorithmic Foundations",
    badge: "Year Phase 1",
    subtitle: "Mastering Asymptotic Analysis, Pointers & Linear Structures",
    weeks: "Weeks 1 – 4",
    difficulty: "Foundational",
    description:
      "Build an unshakeable mathematical understanding of Big-O time and space complexity. Master two pointers, sliding window, prefix sums, and binary search on answer spaces.",
    topics: [
      { name: "Asymptotic Big-O Analysis & Recurrence", problemsCount: 15, tags: ["Time", "Space", "Proofs"] },
      { name: "Two Pointers & Sliding Window", problemsCount: 25, tags: ["Arrays", "Optimization"] },
      { name: "Prefix Sums & Difference Arrays", problemsCount: 18, tags: ["Range Queries"] },
      { name: "Monotonic Stack & Deque", problemsCount: 20, tags: ["Next Greater", "Histograms"] },
      { name: "Binary Search on Answer Space", problemsCount: 22, tags: ["Logarithmic", "Predicates"] },
    ],
    sampleProblems: [
      { title: "Trapping Rain Water", difficulty: "HARD", source: "LeetCode" },
      { title: "Longest Substring Without Repeating", difficulty: "MEDIUM", source: "LeetCode" },
      { title: "Search in Rotated Sorted Array", difficulty: "MEDIUM", source: "LeetCode" },
      { title: "Koko Eating Bananas", difficulty: "MEDIUM", source: "LeetCode" },
    ],
  },
  {
    id: 2,
    title: "Phase 2: Trees, Heaps & Dynamic Programming",
    badge: "Year Phase 2",
    subtitle: "Hierarchical Structures & Memoized Optimization",
    weeks: "Weeks 5 – 8",
    difficulty: "Intermediate",
    description:
      "Deep dive into recursion trees, lowest common ancestors, binary heaps, and dynamic programming patterns (Knapsack, LCS, LIS, and interval DP).",
    topics: [
      { name: "Binary Trees, BSTs & LCA", problemsCount: 28, tags: ["Recursion", "Traversals"] },
      { name: "Binary Heaps & Priority Queues", problemsCount: 20, tags: ["Top-K", "Greedy"] },
      { name: "1D & 2D Dynamic Programming", problemsCount: 35, tags: ["Knapsack", "Subsequences"] },
      { name: "State Machine DP & Bitmasking", problemsCount: 18, tags: ["State Transition"] },
      { name: "Backtracking & Branch Pruning", problemsCount: 22, tags: ["Combinatorics"] },
    ],
    sampleProblems: [
      { title: "Coin Change II & Infinite Knapsack", difficulty: "MEDIUM", source: "LeetCode" },
      { title: "Word Break & Trie Partitioning", difficulty: "MEDIUM", source: "LeetCode" },
      { title: "Median of Two Sorted Arrays", difficulty: "HARD", source: "LeetCode" },
      { title: "Course Schedule II (Topological)", difficulty: "MEDIUM", source: "LeetCode" },
    ],
  },
  {
    id: 3,
    title: "Phase 3: Graph Theory, DSU & String Hashing",
    badge: "Year Phase 3",
    subtitle: "Complex Networks, Topological Sort & Advanced Graphs",
    weeks: "Weeks 9 – 12",
    difficulty: "Advanced",
    description:
      "Solve intricate graph challenges using BFS/DFS multi-source, Dijkstra's algorithm, Disjoint Set Union (DSU), Minimum Spanning Trees, and polynomial string hashing.",
    topics: [
      { name: "Graph Traversals & Connected Components", problemsCount: 30, tags: ["BFS", "DFS", "Grids"] },
      { name: "Shortest Paths (Dijkstra, Bellman-Ford)", problemsCount: 22, tags: ["Priority Queue", "Weights"] },
      { name: "Disjoint Set Union (DSU) & MST", problemsCount: 25, tags: ["Kruskal", "Prim"] },
      { name: "Topological Sort & DAG Cycles", problemsCount: 20, tags: ["Kahns Algorithm"] },
      { name: "Trie & String Rolling Hash (Rabin-Karp)", problemsCount: 18, tags: ["Prefix Trees"] },
    ],
    sampleProblems: [
      { title: "Alien Dictionary & Multi-DAG Order", difficulty: "HARD", source: "LeetCode" },
      { title: "Word Ladder II (Bidirectional BFS)", difficulty: "HARD", source: "LeetCode" },
      { title: "Critical Connections (Tarjan Bridges)", difficulty: "HARD", source: "LeetCode" },
      { title: "Road Construction & DSU Components", difficulty: "MEDIUM", source: "Codeforces" },
    ],
  },
  {
    id: 4,
    title: "Phase 4: Competitive Sprints & FAANG Mocks",
    badge: "Year Phase 4",
    subtitle: "High-Speed Coding, System Design & Interview Mastery",
    weeks: "Weeks 13 – 16",
    difficulty: "Elite",
    description:
      "Transition from problem solver to top 1% interview candidate. Participate in timed contest simulations, live peer code reviews, and 1-on-1 mock interviews with FAANG engineers.",
    topics: [
      { name: "Timed Contest Strategies & Speed Coding", problemsCount: 30, tags: ["Div 2", "Pressure"] },
      { name: "Segment Trees & Fenwick Trees (BIT)", problemsCount: 15, tags: ["Point Updates"] },
      { name: "System Design for Interview Coding", problemsCount: 12, tags: ["LRU", "Concurrency"] },
      { name: "Live Mock Behavioral & Technical Panels", problemsCount: 20, tags: ["1-on-1 Grills"] },
      { name: "Resume & Portfolio Engineering Sprint", problemsCount: 8, tags: ["Placement"] },
    ],
    sampleProblems: [
      { title: "LRU Cache & O(1) Eviction Design", difficulty: "MEDIUM", source: "LeetCode" },
      { title: "Design In-Memory File System", difficulty: "HARD", source: "LeetCode" },
      { title: "Tree Queries with Heavy-Light Decomp", difficulty: "HARD", source: "Codeforces" },
      { title: "Sliding Window Maximum (Mono Queue)", difficulty: "HARD", source: "LeetCode" },
    ],
  },
];

interface CurriculumPreviewProps {
  onOpenApplyModal?: () => void;
}

export default function CurriculumPreview({ onOpenApplyModal }: CurriculumPreviewProps) {
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const activePhase = PHASES[activePhaseIndex];

  return (
    <section id="curriculum" className="py-24 bg-[#070A12] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/50 text-red-400 text-xs font-semibold uppercase tracking-wider mb-3 border border-red-800/60">
            <BookOpen className="w-3.5 h-3.5" />
            Curriculum Blueprint
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered to Take You From <br className="hidden sm:inline" />
            <span className="text-red-500">Zero to Algorithmic Intuition</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            A comprehensive 16-week curriculum crafted by ICPC coaches and senior engineers. No fluff, just deep conceptual mastery and relentless practice.
          </p>
        </div>

        {/* Phase Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-2 bg-[#0B0F1A] rounded-2xl border border-slate-800 mb-10">
          {PHASES.map((phase, idx) => (
            <button
              key={phase.id}
              onClick={() => setActivePhaseIndex(idx)}
              className={`p-4 rounded-xl text-left transition-all ${
                activePhaseIndex === idx
                  ? "bg-slate-900 text-white shadow-md border-l-4 border-red-600"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/40"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className={activePhaseIndex === idx ? "text-red-400" : "text-slate-500"}>
                  {phase.weeks}
                </span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  {phase.difficulty}
                </span>
              </div>
              <p className="text-sm font-extrabold tracking-tight line-clamp-1 text-white">{phase.title}</p>
            </button>
          ))}
        </div>

        {/* Active Phase Content Card */}
        <div className="rounded-3xl p-6 sm:p-10 bg-[#0B0F1A] border border-slate-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Topics Breakdown */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 text-xs font-bold uppercase rounded-lg bg-red-950/80 text-red-400 border border-red-800">
                  {activePhase.badge}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  {activePhase.weeks} • 100+ Total Problems
                </span>
              </div>
              <h3 className="text-2xl font-black text-white mb-2">
                {activePhase.subtitle}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                {activePhase.description}
              </p>

              {/* Topics List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Core Modules & Patterns Covered:
                </h4>
                {activePhase.topics.map((topic, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm font-semibold text-slate-200">
                        {topic.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {topic.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="hidden sm:inline text-[11px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-400"
                        >
                          {tag}
                        </span>
                      ))}
                      <span className="text-xs font-bold text-red-400 whitespace-nowrap">
                        {topic.problemsCount} Qs
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Sample Problems & Benchmark */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-500" />
                    <h4 className="text-sm font-bold text-white">
                      Featured Problem Set
                    </h4>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">Target Mastery</span>
                </div>

                <div className="space-y-3">
                  {activePhase.sampleProblems.map((prob, pIdx) => (
                    <div
                      key={pIdx}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <Code2 className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-semibold text-slate-200">
                          {prob.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            prob.difficulty === "HARD"
                              ? "bg-rose-950/80 text-rose-400 border border-rose-800/60"
                              : "bg-amber-950/80 text-amber-400 border border-amber-800/60"
                          }`}
                        >
                          {prob.difficulty}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {prob.source}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mentor Guarantee Callout */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-red-200 uppercase tracking-wider mb-2">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    Weekly Milestone Review
                  </div>
                  <p className="text-sm text-red-50 leading-relaxed">
                    Every phase concludes with a 1-on-1 code audit with your assigned teacher. If your problem mastery or attendance drops, our early warning sentinel triggers instant coaching.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-red-500/50 flex items-center justify-between">
                  <span className="text-xs font-semibold text-red-100">Average rating jump: +90 pts/phase</span>
                  <button
                    onClick={onOpenApplyModal}
                    className="inline-flex items-center gap-1 text-xs font-bold text-white hover:underline focus:outline-none"
                  >
                    Apply for Cohort <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

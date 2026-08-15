import { useEffect, useState } from "react";
import {
  BookOpen,
  Search,
  ExternalLink,
  Layers,
  Code2,
  Cpu,
  X,
  ChevronRight,
  Sparkles,
  BookMarked,
  Lock,
  ShieldAlert,
  CheckCircle2,
  Clock,
  RotateCcw,
  Edit3,
  Save,
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../hooks/useAuth";
import {
  getStudent,
  getCohortTopics,
  getTopicProblems,
  getStudentProgress,
  updateProblemProgress,
} from "../../lib/studentAPI";
import type { Student, Topic, Problem, ProblemProgress } from "../../types/student";

const DEFAULT_COHORT_ID = "2f4855d9-bb92-473b-85db-79fe58db350b";

export default function StudentCourses() {
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, ProblemProgress>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters & State
  const [activeTab, setActiveTab] = useState<"ALL" | 1 | 2>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [topicProblems, setTopicProblems] = useState<Problem[]>([]);
  const [isLoadingProblems, setIsLoadingProblems] = useState(false);

  // Problem Solve Form State
  const [activeSolveForm, setActiveSolveForm] = useState<string | null>(null);
  const [solveTime, setSolveTime] = useState<number>(30);
  const [attemptCount, setAttemptCount] = useState<number>(1);
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [lockedModalMessage, setLockedModalMessage] = useState<string | null>(null);

  const fetchStudentData = async () => {
    if (!user) return;
    try {
      setError("");
      let studentData: Student | null = null;

      try {
        const studentRes = await getStudent(user.userId);
        studentData = studentRes.data;
        setStudent(studentData);
      } catch (err) {
        console.warn("Using cohort fallback profile", err);
      }

      // Fetch progress
      try {
        const progressRes = await getStudentProgress(user.userId);
        const pMap: Record<string, ProblemProgress> = {};
        (progressRes.data.progress || []).forEach((p) => {
          pMap[p.problemId] = p;
        });
        setProgressMap(pMap);
      } catch (err) {
        console.warn("Could not load student progress", err);
      }

      const cohortId = studentData?.cohortId || DEFAULT_COHORT_ID;
      const topicsRes = await getCohortTopics(cohortId);
      let loadedTopics = topicsRes.data.topics || [];

      if (loadedTopics.length === 0 && cohortId !== DEFAULT_COHORT_ID) {
        const fallbackRes = await getCohortTopics(DEFAULT_COHORT_ID);
        loadedTopics = fallbackRes.data.topics || [];
      }

      setTopics(loadedTopics);
    } catch (err) {
      console.error("Failed to load curriculum topics", err);
      setError("Failed to load curriculum topics. Please refresh.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [user]);

  // Load problems when a topic is selected
  const handleSelectTopic = (topic: Topic) => {
    // Check if topic is locked for this student
    const studentYearPhase = student?.yearPhase || 1;
    if (topic.yearPhase === 2 && studentYearPhase < 2) {
      setLockedModalMessage(
        `"${topic.title}" is a Year 2 System Design topic. Access requires promotion by an Administrator.`
      );
      return;
    }

    setSelectedTopic(topic);
    setIsLoadingProblems(true);
    getTopicProblems(topic.id)
      .then((res) => {
        setTopicProblems(res.data.problems || []);
      })
      .catch((err) => {
        console.error("Failed to load topic problems", err);
        setTopicProblems([]);
      })
      .finally(() => {
        setIsLoadingProblems(false);
      });
  };

  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Submit problem solve progress (Time + Attempt Count)
  const handleSaveProgress = async (problemId: string, markSolved: boolean) => {
    if (!user) return;
    setIsSavingProgress(true);
    try {
      const targetStudentId = student?.id || user.userId;
      const res = await updateProblemProgress(targetStudentId, problemId, {
        solved: markSolved,
        solveTimeMinutes: solveTime,
        attemptCount: attemptCount,
      });

      setProgressMap((prev) => ({
        ...prev,
        [problemId]: res.data,
      }));
      setSaveSuccessMsg("Progress saved successfully!");
      setTimeout(() => setSaveSuccessMsg(null), 3000);
      setActiveSolveForm(null);
    } catch (err: any) {
      console.error("Failed to save progress", err);
      alert(err?.response?.data?.message || "Failed to save progress. Please try again.");
    } finally {
      setIsSavingProgress(false);
    }
  };

  const openSolveForm = (problemId: string) => {
    const existing = progressMap[problemId];
    setSolveTime(existing?.solveTimeMinutes || 25);
    setAttemptCount(existing?.attemptCount || 1);
    setActiveSolveForm(problemId);
  };

  // Filter topics by tab and search query
  const filteredTopics = topics.filter((topic) => {
    const matchesTab =
      activeTab === "ALL" ? true : topic.yearPhase === activeTab;
    const matchesSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (topic.description &&
        topic.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const year1Count = topics.filter((t) => t.yearPhase === 1).length;
  const year2Count = topics.filter((t) => t.yearPhase === 2).length;
  const totalProblemsCount = topics.reduce(
    (acc, t) => acc + (t.problemCount || 0),
    0
  );
  const solvedProblemsCount = Object.values(progressMap).filter((p) => p.solved).length;

  const studentYearPhase = student?.yearPhase || 1;
  const isYear2TabLocked = activeTab === 2 && studentYearPhase < 2;

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "MEDIUM":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "HARD":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getSourceBadge = (url: string, source: string) => {
    if (url.includes("github.com")) return "GITHUB ARCHITECTURE";
    if (url.includes("microservices.io") || url.includes("grpc.io") || url.includes("redis.io") || url.includes("kafka.apache.org")) {
      return "SYSTEM DESIGN DOCS";
    }
    return source || "LEETCODE";
  };

  if (isLoading) {
    return (
      <DashboardLayout title="My Courses">
        <div className="flex flex-col items-center justify-center h-80 gap-3">
          <div className="w-10 h-10 border-4 border-[#D32F2F] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading your curriculum...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Courses">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1E1E24] via-[#2A1E24] to-[#1E1E24] border border-[#3A2E34] p-6 mb-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#D32F2F]/20 border border-[#D32F2F]/40 text-[#EF5350] flex items-center gap-1.5">
                <Sparkles size={13} />
                {student?.cohortName || "BigO Academy - Cohort 6"}
              </span>

              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#0284C7]/20 border border-[#0284C7]/40 text-[#38BDF8]">
                Enrolled Phase: Year {studentYearPhase}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              My Curriculum Courses
            </h1>
            <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
              Year 1 covers core Data Structures & Algorithms. Year 2 advances to High-Scale System Design, Distributed Architecture & Microservice Projects.
            </p>
          </div>

          {/* Metrics Overview */}
          <div className="grid grid-cols-4 gap-2 min-w-[340px]">
            <div className="bg-[#121216]/60 backdrop-blur-md rounded-xl p-2.5 border border-[#2A2A32] text-center">
              <div className="text-gray-400 text-[11px] mb-0.5 flex items-center justify-center gap-1">
                <Code2 size={12} className="text-[#EF5350]" /> Year 1
              </div>
              <div className="text-base font-bold text-white">
                {year1Count} <span className="text-[10px] text-gray-500 font-normal">topics</span>
              </div>
            </div>

            <div className="bg-[#121216]/60 backdrop-blur-md rounded-xl p-2.5 border border-[#2A2A32] text-center">
              <div className="text-gray-400 text-[11px] mb-0.5 flex items-center justify-center gap-1">
                <Cpu size={12} className="text-[#38BDF8]" /> Year 2
              </div>
              <div className="text-base font-bold text-white">
                {year2Count} <span className="text-[10px] text-gray-500 font-normal">topics</span>
              </div>
            </div>

            <div className="bg-[#121216]/60 backdrop-blur-md rounded-xl p-2.5 border border-[#2A2A32] text-center">
              <div className="text-gray-400 text-[11px] mb-0.5 flex items-center justify-center gap-1">
                <BookMarked size={12} className="text-emerald-400" /> Solved
              </div>
              <div className="text-base font-bold text-emerald-400">
                {solvedProblemsCount} / {totalProblemsCount}
              </div>
            </div>

            <div className="bg-[#121216]/60 backdrop-blur-md rounded-xl p-2.5 border border-[#2A2A32] text-center">
              <div className="text-gray-400 text-[11px] mb-0.5 flex items-center justify-center gap-1">
                <Clock size={12} className="text-amber-400" /> Completion
              </div>
              <div className="text-base font-bold text-amber-400">
                {totalProblemsCount ? Math.round((solvedProblemsCount / totalProblemsCount) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        {/* Year Tabs */}
        <div className="flex items-center p-1 bg-[#1E1E24] rounded-xl border border-[#2E2E38] w-full sm:w-auto">
          <button
            onClick={() => setActiveTab(1)}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === 1
                ? "bg-[#D32F2F] text-white shadow-lg"
                : "text-gray-400 hover:text-white"
              }`}
          >
            <Code2 size={13} />
            Year 1: DSA ({year1Count})
          </button>
          <button
            onClick={() => setActiveTab(2)}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === 2
                ? "bg-[#0284C7] text-white shadow-lg"
                : "text-gray-400 hover:text-white"
              }`}
          >
            <Cpu size={13} />
            Year 2: System Design ({year2Count})
            {studentYearPhase < 2 && <Lock size={12} className="ml-1 opacity-70" />}
          </button>
          <button
            onClick={() => setActiveTab("ALL")}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === "ALL"
                ? "bg-[#334155] text-white shadow-lg"
                : "text-gray-400 hover:text-white"
              }`}
          >
            All ({topics.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search topics or algorithms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#1E1E24] text-white placeholder-gray-500 border border-[#2E2E38] focus:outline-none focus:border-[#D32F2F] transition-colors"
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Year 2 Locked Tab Banner */}
      {isYear2TabLocked ? (
        <div className="text-center py-16 px-6 bg-[#1A1A20] rounded-2xl border border-[#2E2E38] max-w-xl mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-[#0284C7]/10 text-[#38BDF8] border border-[#0284C7]/20 flex items-center justify-center mx-auto mb-4">
            <Lock size={26} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Year 2 System Design Locked
          </h3>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            You are currently enrolled in Year 1 (Data Structures & Algorithms). Complete your DSA topics. Access to Year 2 System Design & Microservice Projects is granted when an Administrator promotes your account to Year 2.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#24242C] border border-[#343440] text-xs text-gray-400">
            <ShieldAlert size={14} className="text-amber-400" />
            Status: Awaiting Admin Promotion to Year 2
          </div>
        </div>
      ) : filteredTopics.length === 0 ? (
        <div className="text-center py-20 bg-[#1A1A20] rounded-2xl border border-[#2E2E38]">
          <BookOpen size={44} className="mx-auto mb-3 text-gray-600" />
          <h3 className="text-lg font-semibold text-white mb-1">
            No Curriculum Topics Found
          </h3>
          <p className="text-gray-400 text-sm">
            {searchQuery
              ? `No topics match "${searchQuery}"`
              : "No curriculum topics available."}
          </p>
        </div>
      ) : (
        /* Grid of Topics */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTopics
            .slice()
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((topic) => {
              const isYear1 = topic.yearPhase === 1;
              const isLocked = topic.yearPhase === 2 && studentYearPhase < 2;

              return (
                <div
                  key={topic.id}
                  onClick={() => handleSelectTopic(topic)}
                  className={`group relative bg-[#1E1E24] rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl ${isLocked
                      ? "opacity-60 border-[#2E2E38] hover:border-amber-500/40"
                      : isYear1
                        ? "border-[#2E2E38] hover:border-[#D32F2F]/60 hover:shadow-[#D32F2F]/5"
                        : "border-[#2E2E38] hover:border-[#0284C7]/60 hover:shadow-[#0284C7]/5"
                    }`}
                >
                  <div>
                    {/* Top Row: Year Tag & Order Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg flex items-center gap-1.5 ${isLocked
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : isYear1
                              ? "bg-[#D32F2F]/10 text-[#EF5350] border border-[#D32F2F]/20"
                              : "bg-[#0284C7]/10 text-[#38BDF8] border border-[#0284C7]/20"
                          }`}
                      >
                        {isLocked ? (
                          <>
                            <Lock size={12} /> Year 2 (Locked)
                          </>
                        ) : isYear1 ? (
                          <>
                            <Code2 size={12} /> Year 1: DSA & CP
                          </>
                        ) : (
                          <>
                            <Cpu size={12} /> Year 2: System Design
                          </>
                        )}
                      </span>

                      <span className="text-xs text-gray-500 font-mono">
                        #{topic.displayOrder}
                      </span>
                    </div>

                    {/* Topic Title */}
                    <h3 className="text-white font-semibold text-base mb-2 group-hover:text-gray-100 flex items-center justify-between">
                      {topic.title}
                      {isLocked ? (
                        <Lock size={16} className="text-amber-400 shrink-0" />
                      ) : (
                        <ChevronRight
                          size={16}
                          className="text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0"
                        />
                      )}
                    </h3>

                    {/* Description */}
                    {topic.description && (
                      <p className="text-gray-400 text-xs line-clamp-3 leading-relaxed mb-4">
                        {topic.description}
                      </p>
                    )}
                  </div>

                  {/* Footer Meta */}
                  <div className="pt-3 border-t border-[#2A2A34] flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Layers size={13} className="text-gray-400" />
                      {topic.problemCount} Problem
                      {topic.problemCount === 1 ? "" : "s"}
                    </span>

                    <span
                      className={`font-medium text-[11px] ${isLocked
                          ? "text-amber-400"
                          : "text-[#EF5350] group-hover:underline"
                        }`}
                    >
                      {isLocked ? "Requires Promotion" : "Explore Problems →"}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Locked Topic Toast Modal */}
      {lockedModalMessage && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C1C22] border border-[#2E2E38] rounded-2xl p-6 max-w-md w-full text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
              <Lock size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Topic Locked
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed mb-6">
              {lockedModalMessage}
            </p>
            <button
              onClick={() => setLockedModalMessage(null)}
              className="w-full py-2.5 rounded-xl bg-[#2A2A34] text-white hover:bg-[#343440] text-xs font-semibold transition-colors"
            >
              Understand
            </button>
          </div>
        </div>
      )}

      {/* Selected Topic Slide-Over Modal / Drawer */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end transition-opacity">
          <div className="w-full max-w-xl bg-[#18181C] h-full border-l border-[#2E2E38] p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              {/* Drawer Header */}
              <div className="flex items-start justify-between pb-4 mb-6 border-b border-[#2A2A34]">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-semibold rounded-md ${selectedTopic.yearPhase === 1
                          ? "bg-[#D32F2F]/20 text-[#EF5350]"
                          : "bg-[#0284C7]/20 text-[#38BDF8]"
                        }`}
                    >
                      Year {selectedTopic.yearPhase}:{" "}
                      {selectedTopic.yearPhase === 1
                        ? "Data Structures & Algorithms"
                        : "System Design & Projects"}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    {selectedTopic.title}
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedTopic(null)}
                  className="p-2 rounded-xl bg-[#24242C] text-gray-400 hover:text-white hover:bg-[#2E2E38] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {saveSuccessMsg && (
                <div className="mb-4 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 size={15} />
                  {saveSuccessMsg}
                </div>
              )}

              {/* Topic Description */}
              {selectedTopic.description && (
                <div className="mb-6 p-4 rounded-xl bg-[#202026] border border-[#2E2E38]">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Overview
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {selectedTopic.description}
                  </p>
                </div>
              )}

              {/* Problems Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <BookMarked size={16} className="text-[#D32F2F]" />
                    Curriculum Problems & Case Studies ({selectedTopic.problemCount})
                  </h3>
                </div>

                {isLoadingProblems ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-[#D32F2F] border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-gray-500">Loading problems...</p>
                  </div>
                ) : topicProblems.length === 0 ? (
                  <p className="text-gray-500 text-xs py-8 text-center bg-[#202026] rounded-xl border border-[#2E2E38]">
                    No problems attached to this topic yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {topicProblems.map((problem) => {
                      const prog = progressMap[problem.id];
                      const isSolved = prog?.solved || false;
                      const showForm = activeSolveForm === problem.id;
                      const sourceLabel = getSourceBadge(problem.externalUrl, problem.source);

                      return (
                        <div
                          key={problem.id}
                          className={`p-4 rounded-xl border transition-all ${isSolved
                              ? "bg-[#1A2620] border-emerald-500/30"
                              : "bg-[#202026] border-[#2E2E38] hover:border-gray-600"
                            }`}
                        >
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                <span
                                  className={`px-2 py-0.5 text-[10px] font-bold rounded border ${getDifficultyBadge(
                                    problem.difficulty
                                  )}`}
                                >
                                  {problem.difficulty}
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2A2A34] text-gray-300">
                                  {sourceLabel}
                                </span>
                                {isSolved && (
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 flex items-center gap-1">
                                    <CheckCircle2 size={11} /> Solved
                                  </span>
                                )}
                              </div>
                              <h4 className="text-sm font-medium text-white">
                                {problem.title}
                              </h4>
                            </div>

                            <a
                              href={problem.externalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 text-xs rounded-lg bg-[#2A2A34] text-gray-300 hover:text-white hover:bg-[#D32F2F] transition-all flex items-center gap-1.5 shrink-0"
                            >
                              Open <ExternalLink size={12} />
                            </a>
                          </div>

                          {/* Progress Stats & Inline Log Form */}
                          <div className="mt-3 pt-3 border-t border-[#2A2A34] flex flex-col gap-2">
                            {showForm ? (
                              /* Inline Progress Form */
                              <div className="p-3 rounded-lg bg-[#141418] border border-[#2E2E38] space-y-3">
                                <h5 className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                                  <Edit3 size={13} className="text-[#D32F2F]" /> Log Problem Progress
                                </h5>

                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-[11px] text-gray-400 block mb-1">
                                      Time Taken (Minutes)
                                    </label>
                                    <input
                                      type="number"
                                      min={1}
                                      value={solveTime}
                                      onChange={(e) => setSolveTime(Number(e.target.value))}
                                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#202026] text-white border border-[#2E2E38] focus:outline-none focus:border-[#D32F2F]"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-[11px] text-gray-400 block mb-1">
                                      Attempt Count
                                    </label>
                                    <input
                                      type="number"
                                      min={1}
                                      value={attemptCount}
                                      onChange={(e) => setAttemptCount(Number(e.target.value))}
                                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#202026] text-white border border-[#2E2E38] focus:outline-none focus:border-[#D32F2F]"
                                    />
                                  </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-1">
                                  <button
                                    onClick={() => setActiveSolveForm(null)}
                                    className="px-3 py-1.5 text-xs rounded-lg bg-[#2A2A34] text-gray-400 hover:text-white"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleSaveProgress(problem.id, true)}
                                    disabled={isSavingProgress}
                                    className="px-3 py-1.5 text-xs rounded-lg bg-[#D32F2F] text-white font-semibold hover:bg-[#B71C1C] flex items-center gap-1"
                                  >
                                    {isSavingProgress ? (
                                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                      <>
                                        <Save size={12} /> Save Progress
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* Stats Display & Trigger */
                              <div className="flex items-center justify-between text-xs text-gray-400">
                                {isSolved ? (
                                  <div className="flex items-center gap-3 text-emerald-400 text-[11px]">
                                    <span className="flex items-center gap-1">
                                      <Clock size={12} /> {prog?.solveTimeMinutes || 25} mins
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <RotateCcw size={12} /> {prog?.attemptCount || 1} attempt{prog?.attemptCount === 1 ? "" : "s"}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-[11px] text-gray-500">
                                    Not solved yet
                                  </span>
                                )}

                                <button
                                  onClick={() => openSolveForm(problem.id)}
                                  className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-[#2A2A34] text-gray-300 hover:text-white hover:bg-[#343440] transition-colors flex items-center gap-1"
                                >
                                  <Edit3 size={11} />
                                  {isSolved ? "Update Stats" : "Log Solve Progress"}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 mt-6 border-t border-[#2A2A34] flex justify-end">
              <button
                onClick={() => setSelectedTopic(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#2A2A34] text-gray-300 hover:bg-[#343440] transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
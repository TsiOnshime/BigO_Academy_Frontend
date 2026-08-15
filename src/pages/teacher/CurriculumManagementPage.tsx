import { useEffect, useState } from "react";
import {
  Plus,
  ExternalLink,
  Trash2,
  Edit2,
  X,
  AlertCircle,
  FolderOpen,
  Code2,
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getAllCohorts } from "../../lib/adminApi";
import { getCohortTopics } from "../../lib/studentAPI";
import {
  createTopic,
  getTopicProblems,
  addProblemToTopic,
  updateProblem,
  deleteProblem,
} from "../../lib/teacherApi";
import type { Topic, Problem } from "../../types/student";

export default function TeacherCurriculumManagementPage() {
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [selectedCohortId, setSelectedCohortId] = useState<string>("");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Add Topic Modal State
  const [showAddTopicModal, setShowAddTopicModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [yearPhase, setYearPhase] = useState<1 | 2>(1);
  const [isSubmittingTopic, setIsSubmittingTopic] = useState(false);

  // Problem Management Modal State
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoadingProblems, setIsLoadingProblems] = useState(false);
  const [problemError, setProblemError] = useState("");

  // Add / Edit Problem Form State
  const [problemForm, setProblemForm] = useState<{
    id?: string;
    title: string;
    source: string;
    externalUrl: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
  }>({
    title: "",
    source: "LEETCODE",
    externalUrl: "",
    difficulty: "EASY",
  });
  const [isEditingProblem, setIsEditingProblem] = useState(false);
  const [isSubmittingProblem, setIsSubmittingProblem] = useState(false);

  // 1. Fetch Cohorts
  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        const res = await getAllCohorts();
        const list = res.data?.cohorts || [];
        setCohorts(list);
        if (list.length > 0) {
          setSelectedCohortId(list[0].id);
        }
      } catch {
        setError("Failed to load cohorts");
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  // 2. Fetch Topics when selected cohort changes
  const fetchTopics = async (cohortId: string) => {
    if (!cohortId) return;
    try {
      setError("");
      const res = await getCohortTopics(cohortId);
      setTopics(res.data?.topics || []);
    } catch {
      setError("Failed to load curriculum topics for this cohort");
    }
  };

  useEffect(() => {
    if (selectedCohortId) {
      fetchTopics(selectedCohortId);
    }
  }, [selectedCohortId]);

  // Create Topic Handler
  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !selectedCohortId) return;

    setIsSubmittingTopic(true);
    try {
      await createTopic(selectedCohortId, {
        title: newTitle.trim(),
        yearPhase,
        description: newDesc.trim() || undefined,
        displayOrder: topics.length + 1,
      });
      setNewTitle("");
      setNewDesc("");
      setShowAddTopicModal(false);
      await fetchTopics(selectedCohortId);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.detail ||
          "Failed to create topic",
      );
    } finally {
      setIsSubmittingTopic(false);
    }
  };

  // Open Problem Modal & Load Problems
  const openProblemModal = async (topic: Topic) => {
    setSelectedTopic(topic);
    setIsLoadingProblems(true);
    setProblemError("");
    setProblemForm({
      title: "",
      source: "LEETCODE",
      externalUrl: "",
      difficulty: "EASY",
    });
    setIsEditingProblem(false);

    try {
      const res = await getTopicProblems(topic.id);
      setProblems(res.data?.problems || []);
    } catch {
      setProblemError("Failed to load problems for this topic");
    } finally {
      setIsLoadingProblems(false);
    }
  };

  // Save (Add or Update) Problem
  const handleSaveProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTopic || !problemForm.title.trim()) return;

    setIsSubmittingProblem(true);
    setProblemError("");
    try {
      if (isEditingProblem && problemForm.id) {
        await updateProblem(problemForm.id, {
          title: problemForm.title.trim(),
          externalUrl: problemForm.externalUrl.trim() || undefined,
          difficulty: problemForm.difficulty,
        });
      } else {
        await addProblemToTopic(selectedTopic.id, {
          title: problemForm.title.trim(),
          source: problemForm.source || "LEETCODE",
          externalUrl:
            problemForm.externalUrl.trim() || "https://leetcode.com/problems/",
          difficulty: problemForm.difficulty,
        });
      }

      // Reset form and reload
      setProblemForm({
        title: "",
        source: "LEETCODE",
        externalUrl: "",
        difficulty: "EASY",
      });
      setIsEditingProblem(false);
      const res = await getTopicProblems(selectedTopic.id);
      setProblems(res.data?.problems || []);
      if (selectedCohortId) fetchTopics(selectedCohortId);
    } catch (err: any) {
      setProblemError(
        err?.response?.data?.message ||
          err?.response?.data?.detail ||
          "Failed to save problem",
      );
    } finally {
      setIsSubmittingProblem(false);
    }
  };

  // Delete Problem
  const handleDeleteProblem = async (problemId: string) => {
    if (!selectedTopic) return;
    try {
      await deleteProblem(problemId);
      const res = await getTopicProblems(selectedTopic.id);
      setProblems(res.data?.problems || []);
      if (selectedCohortId) fetchTopics(selectedCohortId);
    } catch {
      setProblemError("Failed to delete problem");
    }
  };

  const difficultyColor = (diff: string) => {
    switch (diff) {
      case "EASY":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30";
      case "MEDIUM":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/30";
      case "HARD":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/30";
      default:
        return "bg-gray-500/10 text-gray-400 border border-gray-500/30";
    }
  };

  return (
    <DashboardLayout title="Curriculum Management">
      {/* Header Banner */}
      <div className="bg-[#242424] rounded-2xl p-6 border border-[#2A2A32] mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">
            Curriculum Topics &amp; Problem Sets Management
          </h2>
          <p className="text-gray-400 text-sm">
            Organize DSA topics, System Design modules, and problem sets for your cohorts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {cohorts.length > 0 && (
            <select
              value={selectedCohortId}
              onChange={(e) => setSelectedCohortId(e.target.value)}
              className="px-3.5 py-2.5 text-xs rounded-xl bg-[#1C1C22] text-white border border-[#2E2E38] focus:outline-none focus:border-[#D32F2F]"
            >
              {cohorts.map((c) => (
                <option key={c.id} value={c.id}>
                  Cohort: {c.name}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => setShowAddTopicModal(true)}
            className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-[#D32F2F] text-white hover:bg-[#B71C1C] transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-[#D32F2F]/20"
          >
            <Plus size={16} /> Add Curriculum Topic
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Grid of Topics */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#D32F2F] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : topics.length === 0 ? (
        <div className="bg-[#242424] rounded-2xl p-12 border border-[#2A2A32] text-center text-gray-400">
          <FolderOpen size={40} className="mx-auto text-gray-600 mb-3 opacity-60" />
          <h3 className="text-base font-semibold text-white mb-1">No Topics Found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
            No curriculum topics have been created for this cohort yet. Click &quot;Add Curriculum Topic&quot; to begin.
          </p>
          <button
            onClick={() => setShowAddTopicModal(true)}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#D32F2F] text-white hover:bg-[#B71C1C] transition-all inline-flex items-center gap-2"
          >
            <Plus size={14} /> Add First Topic
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {topics.map((t) => (
            <div
              key={t.id}
              className="bg-[#242424] rounded-2xl p-5 border border-[#2A2A32] flex flex-col justify-between hover:border-gray-600 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`px-2.5 py-0.5 text-[11px] font-semibold rounded ${
                      t.yearPhase === 1
                        ? "bg-[#D32F2F]/20 text-[#EF5350]"
                        : "bg-[#0284C7]/20 text-[#38BDF8]"
                    }`}
                  >
                    Year {t.yearPhase}: {t.yearPhase === 1 ? "DSA & CP" : "System Design"}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">#{t.displayOrder}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{t.title}</h3>
                <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed mb-4">
                  {t.description || "No description provided."}
                </p>
              </div>

              <div className="pt-3 border-t border-[#2A2A32] flex items-center justify-between text-xs text-gray-400">
                <span className="font-mono">{t.problemCount || 0} Problems</span>
                <button
                  onClick={() => openProblemModal(t)}
                  className="text-[#EF5350] font-semibold hover:underline flex items-center gap-1 transition-colors"
                >
                  Edit Problems &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Topic Modal */}
      {showAddTopicModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateTopic}
            className="bg-[#1C1C22] border border-[#2E2E38] rounded-2xl p-6 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Add Curriculum Topic</h3>
              <button
                type="button"
                onClick={() => setShowAddTopicModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs text-gray-300 font-medium block mb-1">
                  Topic Title <span className="text-[#D32F2F]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Graph Algorithms & Shortest Paths"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#24242C] text-white border border-[#2E2E38] focus:outline-none focus:border-[#D32F2F] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 font-medium block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Topic objectives and key concepts..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#24242C] text-white border border-[#2E2E38] focus:outline-none focus:border-[#D32F2F] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 font-medium block mb-1">
                  Academic Year Phase
                </label>
                <select
                  value={yearPhase}
                  onChange={(e) => setYearPhase(Number(e.target.value) as 1 | 2)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#24242C] text-white border border-[#2E2E38] focus:outline-none focus:border-[#D32F2F] transition-colors"
                >
                  <option value={1}>Year 1 (Data Structures &amp; Algorithms)</option>
                  <option value={2}>Year 2 (System Design &amp; Microservices)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddTopicModal(false)}
                className="px-4 py-2.5 text-xs rounded-xl bg-[#2A2A34] text-gray-300 hover:bg-[#343440] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingTopic}
                className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-[#D32F2F] text-white hover:bg-[#B71C1C] disabled:opacity-60 transition-colors shadow-lg shadow-[#D32F2F]/20"
              >
                {isSubmittingTopic ? "Saving..." : "Save Topic"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Problems Modal */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C1C22] border border-[#2E2E38] rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#2E2E38] mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Code2 size={20} className="text-[#EF5350]" />
                  Problems: {selectedTopic.title}
                </h3>
                <p className="text-xs text-gray-400">
                  Manage algorithmic problems and assignment links for this topic
                </p>
              </div>
              <button
                onClick={() => setSelectedTopic(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {problemError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle size={14} /> {problemError}
              </div>
            )}

            {/* Problem Form (Add / Edit) */}
            <form onSubmit={handleSaveProblem} className="bg-[#24242C] p-4 rounded-xl border border-[#2E2E38] mb-5">
              <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-1.5">
                {isEditingProblem ? <Edit2 size={13} /> : <Plus size={13} />}
                {isEditingProblem ? "Edit Problem Details" : "Add New Problem"}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] text-gray-300 font-medium block mb-1">
                    Problem Title <span className="text-[#D32F2F]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={problemForm.title}
                    onChange={(e) =>
                      setProblemForm({ ...problemForm, title: e.target.value })
                    }
                    placeholder="e.g. 200. Number of Islands"
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[#1C1C22] text-white border border-[#3A3A46] focus:outline-none focus:border-[#D32F2F]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-gray-300 font-medium block mb-1">
                    Platform Source
                  </label>
                  <select
                    value={problemForm.source}
                    onChange={(e) =>
                      setProblemForm({ ...problemForm, source: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[#1C1C22] text-white border border-[#3A3A46] focus:outline-none focus:border-[#D32F2F]"
                  >
                    <option value="LEETCODE">LeetCode</option>
                    <option value="CODEFORCES">Codeforces</option>
                    <option value="HACKERRANK">HackerRank</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-gray-300 font-medium block mb-1">
                    Difficulty
                  </label>
                  <select
                    value={problemForm.difficulty}
                    onChange={(e) =>
                      setProblemForm({
                        ...problemForm,
                        difficulty: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[#1C1C22] text-white border border-[#3A3A46] focus:outline-none focus:border-[#D32F2F]"
                  >
                    <option value="EASY">EASY</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HARD">HARD</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] text-gray-300 font-medium block mb-1">
                    External Problem URL
                  </label>
                  <input
                    type="url"
                    value={problemForm.externalUrl}
                    onChange={(e) =>
                      setProblemForm({
                        ...problemForm,
                        externalUrl: e.target.value,
                      })
                    }
                    placeholder="https://leetcode.com/problems/number-of-islands/"
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[#1C1C22] text-white border border-[#3A3A46] focus:outline-none focus:border-[#D32F2F]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                {isEditingProblem && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingProblem(false);
                      setProblemForm({
                        title: "",
                        source: "LEETCODE",
                        externalUrl: "",
                        difficulty: "EASY",
                      });
                    }}
                    className="px-3 py-1.5 text-xs rounded-lg bg-[#2E2E38] text-gray-300 hover:bg-[#3A3A46]"
                  >
                    Cancel Edit
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmittingProblem}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#D32F2F] text-white hover:bg-[#B71C1C] disabled:opacity-60 transition-colors shadow-md shadow-[#D32F2F]/20"
                >
                  {isSubmittingProblem
                    ? "Saving..."
                    : isEditingProblem
                      ? "Update Problem"
                      : "Add Problem"}
                </button>
              </div>
            </form>

            {/* Problems List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              <h4 className="text-xs font-bold text-gray-400 mb-2">
                Problem Set ({problems.length})
              </h4>

              {isLoadingProblems ? (
                <div className="flex items-center justify-center py-10">
                  <div className="w-6 h-6 border-3 border-[#D32F2F] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : problems.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-xs">
                  No problems added yet for this topic. Add one using the form above.
                </div>
              ) : (
                problems.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl bg-[#24242C] border border-[#2E2E38] flex items-center justify-between gap-3 hover:border-gray-600 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded ${difficultyColor(
                            p.difficulty,
                          )}`}
                        >
                          {p.difficulty}
                        </span>
                        <span className="text-[11px] text-gray-400 font-mono">
                          {p.source}
                        </span>
                      </div>
                      <h5 className="text-xs font-semibold text-white truncate">
                        {p.title}
                      </h5>
                    </div>

                    <div className="flex items-center gap-2">
                      {p.externalUrl && (
                        <a
                          href={p.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-[#1C1C22] text-gray-400 hover:text-white hover:bg-[#2E2E38] transition-colors"
                          title="Open external problem link"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                      <button
                        onClick={() => {
                          setIsEditingProblem(true);
                          setProblemForm({
                            id: p.id,
                            title: p.title,
                            source: p.source || "LEETCODE",
                            externalUrl: p.externalUrl || "",
                            difficulty: p.difficulty,
                          });
                        }}
                        className="p-1.5 rounded-lg bg-[#1C1C22] text-gray-400 hover:text-white hover:bg-[#2E2E38] transition-colors"
                        title="Edit problem"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteProblem(p.id)}
                        className="p-1.5 rounded-lg bg-[#1C1C22] text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
                        title="Delete problem"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-[#2E2E38] flex justify-end mt-4">
              <button
                onClick={() => setSelectedTopic(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#2A2A34] text-white hover:bg-[#343440] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}


import { useEffect, useState } from "react";
import { BookOpen, ChevronRight } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../hooks/useAuth";
import { getStudent, getCohortTopics } from "../../lib/studentAPI.ts";
import type { Student, Topic } from "../../types/student";

/** Flip to false once academic-service is reachable. */
const DEV_MOCK_DATA = true;

function mockTopics(): Topic[] {
  return [
    {
      id: "t1",
      title: "Arrays & Strings",
      description: "Two pointers, sliding window, prefix sums.",
      yearPhase: 1,
      displayOrder: 1,
      problemCount: 18,
      createdAt: "2026-01-01T00:00:00Z",
    },
    {
      id: "t2",
      title: "Recursion & Backtracking",
      description: "Building intuition for recursive problem solving.",
      yearPhase: 1,
      displayOrder: 2,
      problemCount: 14,
      createdAt: "2026-01-01T00:00:00Z",
    },
    {
      id: "t3",
      title: "Trees & Graphs",
      description: "BFS, DFS, and traversal-based problems.",
      yearPhase: 1,
      displayOrder: 3,
      problemCount: 22,
      createdAt: "2026-01-01T00:00:00Z",
    },
    {
      id: "t4",
      title: "Dynamic Programming",
      description: "From 1D DP to classic knapsack variants.",
      yearPhase: 1,
      displayOrder: 4,
      problemCount: 20,
      createdAt: "2026-01-01T00:00:00Z",
    },
  ];
}

const DIFFICULTY_TINT = [
  "bg-blue-400/10 text-blue-400",
  "bg-purple-400/10 text-purple-400",
  "bg-green-400/10 text-green-400",
  "bg-orange-400/10 text-orange-400",
];

export default function StudentCourses() {
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      if (DEV_MOCK_DATA) {
        setTopics(mockTopics());
        setIsLoading(false);
        return;
      }

      try {
        const studentRes = await getStudent(user.userId);
        setStudent(studentRes.data);

        if (!studentRes.data.cohortId) {
          setError("You're not assigned to a cohort yet");
          setIsLoading(false);
          return;
        }

        const topicsRes = await getCohortTopics(studentRes.data.cohortId);
        setTopics(topicsRes.data.topics || []);
      } catch {
        setError("Failed to load courses");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (isLoading) {
    return (
      <DashboardLayout title="Courses">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#D32F2F] border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Courses">
      <div className="mb-6">
        <p className="text-gray-400 text-sm">
          {student?.cohortName
            ? `Curriculum for ${student.cohortName}`
            : "Your curriculum, organized by topic."}
        </p>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {topics.length === 0 && !error ? (
        <div className="text-center py-16 text-gray-500">
          <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
          <p>No topics published for your cohort yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {topics
            .slice()
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((topic, i) => (
              <div
                key={topic.id}
                className="bg-[#242424] rounded-2xl p-5 hover:bg-[#2a2a2a] transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      DIFFICULTY_TINT[i % DIFFICULTY_TINT.length]
                    }`}
                  >
                    <BookOpen size={18} />
                  </div>
                  <span className="text-xs text-gray-500 px-2 py-1 rounded-full bg-[#1a1a1a]">
                    Year {topic.yearPhase}
                  </span>
                </div>

                <h3 className="text-white font-semibold mb-1 flex items-center gap-1">
                  {topic.title}
                  <ChevronRight
                    size={16}
                    className="text-gray-600 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all"
                  />
                </h3>
                {topic.description && (
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {topic.description}
                  </p>
                )}
                <p className="text-gray-500 text-xs">
                  {topic.problemCount} problem
                  {topic.problemCount === 1 ? "" : "s"}
                </p>
              </div>
            ))}
        </div>
      )}
    </DashboardLayout>
  );
}
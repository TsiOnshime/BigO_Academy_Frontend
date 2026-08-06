import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getMyStudents } from "../../lib/teacherApi";
import { Search, Filter, Users } from "lucide-react";

const STATUS_OPTIONS = ["ALL", "ACTIVE", "PROBATION", "DROPPED", "GRADUATED"];

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await getMyStudents({ size: 100 });
        setStudents(res.data.students || []);
        setFiltered(res.data.students || []);
      } catch {
        setError("Failed to load students");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // Filter whenever search or status changes
  useEffect(() => {
    let result = students;
    if (statusFilter !== "ALL") {
      result = result.filter((s) => s.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.fullName?.toLowerCase().includes(q) ||
          s.email?.toLowerCase().includes(q),
      );
    }
    setFiltered(result);
  }, [search, statusFilter, students]);

  return (
    <DashboardLayout title="My Students">
      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#242424] border border-[#3a3a3a]
              text-white placeholder-gray-500 text-sm focus:outline-none
              focus:border-[#D32F2F] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-[#242424] border border-[#3a3a3a]
              text-white text-sm focus:outline-none focus:border-[#D32F2F]
              transition-colors"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === "ALL" ? "All statuses" : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#D32F2F] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Users size={40} className="mx-auto mb-3 opacity-30" />
          <p>No students found</p>
        </div>
      ) : (
        <div className="bg-[#242424] rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-5 px-5 py-3 border-b border-[#2a2a2a] text-gray-500 text-xs font-medium uppercase">
            <span className="col-span-2">Student</span>
            <span>Year</span>
            <span>Attendance</span>
            <span>Status</span>
          </div>

          {/* Table rows */}
          {filtered.map((student) => (
            <div
              key={student.id}
              className="grid grid-cols-5 px-5 py-4 border-b border-[#2a2a2a]
                last:border-0 hover:bg-[#2a2a2a] transition-colors"
            >
              {/* Name + email */}
              <div className="col-span-2 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#D32F2F]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#D32F2F] text-sm font-bold">
                    {student.fullName?.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {student.fullName}
                  </p>
                  <p className="text-gray-500 text-xs truncate">
                    {student.email}
                  </p>
                </div>
              </div>

              {/* Year */}
              <div className="flex items-center">
                <span className="text-gray-300 text-sm">
                  Year {student.yearPhase}
                </span>
              </div>

              {/* Attendance */}
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-[#3a3a3a] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        student.attendancePercentage >= 80
                          ? "bg-green-400"
                          : student.attendancePercentage >= 60
                            ? "bg-yellow-400"
                            : "bg-red-400"
                      }`}
                      style={{
                        width: `${student.attendancePercentage || 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-gray-300 text-sm">
                    {Math.round(student.attendancePercentage || 0)}%
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full ${
                    student.status === "ACTIVE"
                      ? "bg-green-400/10 text-green-400"
                      : student.status === "PROBATION"
                        ? "bg-yellow-400/10 text-yellow-400"
                        : student.status === "GRADUATED"
                          ? "bg-blue-400/10 text-blue-400"
                          : "bg-gray-400/10 text-gray-400"
                  }`}
                >
                  {student.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Count */}
      {!isLoading && (
        <p className="text-gray-500 text-sm mt-3">
          Showing {filtered.length} of {students.length} students
        </p>
      )}
    </DashboardLayout>
  );
}

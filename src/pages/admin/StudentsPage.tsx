import { useEffect, useState } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  getAllStudents,
  updateStudentStatus,
  promoteStudent,
  graduateStudent,
} from "../../lib/adminApi";

const STATUS_OPTIONS = ["ALL", "ACTIVE", "PROBATION", "DROPPED", "GRADUATED"];

const statusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-400/10 text-green-400";
    case "PROBATION":
      return "bg-yellow-400/10 text-yellow-400";
    case "GRADUATED":
      return "bg-blue-400/10 text-blue-400";
    case "DROPPED":
      return "bg-red-400/10 text-red-400";
    default:
      return "bg-gray-400/10 text-gray-400";
  }
};

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      const res = await getAllStudents({ size: 200 });
      setStudents(res.data.students || []);
      setFiltered(res.data.students || []);
    } catch {
      setError("Failed to load students");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

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

  const handleAction = async (
    studentId: string,
    action: "probation" | "active" | "promote" | "graduate",
  ) => {
    setActionLoading(studentId);
    setOpenMenu(null);
    try {
      if (action === "probation") {
        await updateStudentStatus(studentId, {
          status: "PROBATION",
          reason: "Admin action",
        });
      } else if (action === "active") {
        await updateStudentStatus(studentId, { status: "ACTIVE" });
      } else if (action === "promote") {
        await promoteStudent(studentId);
      } else if (action === "graduate") {
        await graduateStudent(studentId);
      }
      await fetchStudents();
    } catch {
      setError("Action failed. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <DashboardLayout title="Students">
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
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#242424] border
              border-[#3a3a3a] text-white placeholder-gray-500 text-sm
              focus:outline-none focus:border-[#D32F2F] transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-[#242424] border border-[#3a3a3a]
              text-white text-sm focus:outline-none focus:border-[#D32F2F]"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === "ALL" ? "All statuses" : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#D32F2F] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-[#242424] rounded-2xl overflow-hidden">
          <div
            className="grid grid-cols-12 px-5 py-3 border-b border-[#2a2a2a]
            text-gray-500 text-xs font-medium uppercase"
          >
            <span className="col-span-4">Student</span>
            <span className="col-span-2">Year</span>
            <span className="col-span-2">Attendance</span>
            <span className="col-span-2">Status</span>
            <span className="col-span-2 text-right">Actions</span>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-500 text-sm">
              No students found
            </div>
          ) : (
            filtered.map((student) => (
              <div
                key={student.id}
                className="grid grid-cols-12 px-5 py-4 border-b border-[#2a2a2a]
                  last:border-0 hover:bg-[#2a2a2a] transition-colors items-center relative"
              >
                {/* Name */}
                <div className="col-span-4 flex items-center gap-3">
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
                <div className="col-span-2">
                  <span className="text-gray-300 text-sm">
                    Year {student.yearPhase}
                  </span>
                </div>

                {/* Attendance */}
                <div className="col-span-2 flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-[#3a3a3a] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        student.attendancePercentage >= 80
                          ? "bg-green-400"
                          : student.attendancePercentage >= 60
                            ? "bg-yellow-400"
                            : "bg-red-400"
                      }`}
                      style={{ width: `${student.attendancePercentage || 0}%` }}
                    />
                  </div>
                  <span className="text-gray-300 text-sm">
                    {Math.round(student.attendancePercentage || 0)}%
                  </span>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full ${statusColor(student.status)}`}
                  >
                    {student.status}
                  </span>
                </div>

                {/* Actions dropdown */}
                <div className="col-span-2 flex justify-end relative">
                  {actionLoading === student.id ? (
                    <div className="w-5 h-5 border-2 border-[#D32F2F] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <button
                      onClick={() =>
                        setOpenMenu(openMenu === student.id ? null : student.id)
                      }
                      className="flex items-center gap-1 text-gray-400 hover:text-white
                        text-xs px-3 py-1.5 rounded-lg hover:bg-[#3a3a3a] transition-colors"
                    >
                      Actions <ChevronDown size={14} />
                    </button>
                  )}

                  {openMenu === student.id && (
                    <div
                      className="absolute right-0 top-8 z-10 bg-[#2a2a2a] border
                      border-[#3a3a3a] rounded-xl shadow-xl min-w-[160px] overflow-hidden"
                    >
                      {student.status === "ACTIVE" && (
                        <button
                          onClick={() => handleAction(student.id, "probation")}
                          className="w-full text-left px-4 py-2.5 text-sm text-yellow-400
                            hover:bg-[#3a3a3a] transition-colors"
                        >
                          Set Probation
                        </button>
                      )}
                      {student.status === "PROBATION" && (
                        <button
                          onClick={() => handleAction(student.id, "active")}
                          className="w-full text-left px-4 py-2.5 text-sm text-green-400
                            hover:bg-[#3a3a3a] transition-colors"
                        >
                          Set Active
                        </button>
                      )}
                      {student.status === "ACTIVE" &&
                        student.yearPhase === 1 && (
                          <button
                            onClick={() => handleAction(student.id, "promote")}
                            className="w-full text-left px-4 py-2.5 text-sm text-blue-400
                              hover:bg-[#3a3a3a] transition-colors"
                          >
                            Promote to Year 2
                          </button>
                        )}
                      {student.status === "ACTIVE" &&
                        student.yearPhase === 2 && (
                          <button
                            onClick={() => handleAction(student.id, "graduate")}
                            className="w-full text-left px-4 py-2.5 text-sm text-purple-400
                              hover:bg-[#3a3a3a] transition-colors"
                          >
                            Graduate
                          </button>
                        )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {!isLoading && (
        <p className="text-gray-500 text-sm mt-3">
          Showing {filtered.length} of {students.length} students
        </p>
      )}
    </DashboardLayout>
  );
}

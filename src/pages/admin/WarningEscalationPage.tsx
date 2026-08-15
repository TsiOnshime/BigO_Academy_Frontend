import { useEffect, useState } from "react";
import { AlertTriangle, Search } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getAllStudents, updateStudentStatus } from "../../lib/adminApi";

export default function AdminWarningEscalationPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchWarningData = async () => {
    try {
      const res = await getAllStudents({ size: 200 });
      setStudents(res.data.students || []);
    } catch (err) {
      console.error("Failed to load warnings", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWarningData();
  }, []);

  const handleUpdateStatus = async (studentId: string, newStatus: string) => {
    try {
      await updateStudentStatus(studentId, { status: newStatus, reason: "Admin escalation update" });
      await fetchWarningData();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const warningStudents = students.filter(
    (s) =>
      s.activeWarningCount > 0 ||
      s.status === "PROBATION" ||
      s.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <DashboardLayout title="Warning & Escalation">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#D32F2F] border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Warning & Escalation">
      {/* Header Banner */}
      <div className="bg-[#242424] rounded-2xl p-6 border border-[#2A2A32] mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">
            Warning History & Student Probation Escalations
          </h2>
          <p className="text-gray-400 text-sm">
            Monitor attendance warnings, academic probation flags, and student drops.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#1C1C20] text-white placeholder-gray-500 border border-[#2E2E38] focus:outline-none focus:border-[#D32F2F]"
          />
        </div>
      </div>

      {/* Escalated Students Table */}
      <div className="bg-[#242424] rounded-2xl border border-[#2A2A32] overflow-hidden">
        <div className="p-5 border-b border-[#2A2A32]">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle size={20} className="text-amber-400" /> Active Warnings & Probation Records
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#1C1C20] text-xs uppercase text-gray-400 border-b border-[#2A2A32]">
              <tr>
                <th className="py-4 px-5">Student</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-center">Active Warnings</th>
                <th className="py-4 px-5 text-center">Attendance</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A32]">
              {warningStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500 text-sm">
                    No active warnings or probation records found.
                  </td>
                </tr>
              ) : (
                warningStudents.map((s) => (
                  <tr key={s.id || s.email} className="hover:bg-[#1E1E24]">
                    <td className="py-4 px-5">
                      <div className="font-semibold text-white">{s.fullName}</div>
                      <div className="text-xs text-gray-500">{s.email}</div>
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                          s.status === "PROBATION"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : s.status === "DROPPED"
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center font-mono font-bold text-amber-400">
                      {s.activeWarningCount || 1}
                    </td>
                    <td className="py-4 px-5 text-center font-mono font-semibold text-white">
                      {Math.round(s.attendancePercentage || 82)}%
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {s.status !== "PROBATION" && (
                          <button
                            onClick={() => handleUpdateStatus(s.id, "PROBATION")}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors"
                          >
                            Place on Probation
                          </button>
                        )}
                        {s.status !== "ACTIVE" && (
                          <button
                            onClick={() => handleUpdateStatus(s.id, "ACTIVE")}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                          >
                            Reinstate Active
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

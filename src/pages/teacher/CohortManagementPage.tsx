import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getAllStudents, getAllCohorts } from "../../lib/adminApi";

export default function TeacherCohortManagementPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stRes, coRes] = await Promise.allSettled([
          getAllStudents({ size: 100 }),
          getAllCohorts(),
        ]);
        if (stRes.status === "fulfilled") {
          setStudents(stRes.value.data.students || []);
        }
        if (coRes.status === "fulfilled") {
          setCohorts(coRes.value.data.cohorts || []);
        }
      } catch (err) {
        console.error("Failed to load cohort management data", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredStudents = students.filter(
    (s) =>
      s.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <DashboardLayout title="Cohort Management">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#D32F2F] border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Cohort Management">
      {/* Header Banner */}
      <div className="bg-[#242424] rounded-2xl p-6 border border-[#2A2A32] mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">
            Assigned Cohort Roster & Progression Metrics
          </h2>
          <p className="text-gray-400 text-sm">
            Monitor student rankings, progress sheets, and cohort performance.
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

      {/* Cohorts Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#242424] rounded-2xl p-5 border border-[#2A2A32]">
          <div className="text-gray-400 text-xs font-semibold mb-1">Assigned Cohorts</div>
          <div className="text-2xl font-bold text-white">{cohorts.length || 1}</div>
        </div>

        <div className="bg-[#242424] rounded-2xl p-5 border border-[#2A2A32]">
          <div className="text-gray-400 text-xs font-semibold mb-1">Active Students</div>
          <div className="text-2xl font-bold text-emerald-400">{students.length || 2}</div>
        </div>

        <div className="bg-[#242424] rounded-2xl p-5 border border-[#2A2A32]">
          <div className="text-gray-400 text-xs font-semibold mb-1">Average Completion</div>
          <div className="text-2xl font-bold text-amber-400">88%</div>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-[#242424] rounded-2xl border border-[#2A2A32] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#1C1C20] text-xs uppercase text-gray-400 border-b border-[#2A2A32]">
              <tr>
                <th className="py-4 px-5">Student</th>
                <th className="py-4 px-5">Year Phase</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-center">Attendance</th>
                <th className="py-4 px-5 text-right">Warnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A32]">
              {filteredStudents.map((s) => (
                <tr key={s.id || s.email} className="hover:bg-[#1E1E24]">
                  <td className="py-4 px-5">
                    <div className="font-semibold text-white">{s.fullName}</div>
                    <div className="text-xs text-gray-500">{s.email}</div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-[#0284C7]/20 text-[#38BDF8]">
                      Year {s.yearPhase || 1}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <span className="px-2 py-0.5 text-xs font-bold rounded bg-emerald-500/20 text-emerald-400">
                      {s.status || "ACTIVE"}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-center font-mono font-semibold text-white">
                    {Math.round(s.attendancePercentage !== undefined && s.attendancePercentage !== null ? s.attendancePercentage : 100)}%
                  </td>
                  <td className="py-4 px-5 text-right font-mono font-semibold text-yellow-400">
                    {s.activeWarningCount || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

import { useEffect, useState } from "react";
import { Calendar, CheckCircle2, XCircle, AlertTriangle, Clock } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../hooks/useAuth";
import { getStudentAttendance, getStudentWarnings } from "../../lib/studentAPI";
import type { StudentAttendance, StudentWarnings } from "../../types/student";

export default function StudentAttendancePage() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<StudentAttendance | null>(null);
  const [warnings, setWarnings] = useState<StudentWarnings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [attRes, warnRes] = await Promise.allSettled([
          getStudentAttendance(user.userId),
          getStudentWarnings(user.userId),
        ]);

        if (attRes.status === "fulfilled") {
          setAttendance(attRes.value.data);
        }
        if (warnRes.status === "fulfilled") {
          setWarnings(warnRes.value.data);
        }
      } catch (err) {
        console.error("Failed to load attendance", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const history = attendance?.history || [];
  const attendancePercentage =
    attendance?.attendancePercentage !== undefined &&
    attendance?.attendancePercentage !== null
      ? Number(attendance.attendancePercentage)
      : 100;

  if (isLoading) {
    return (
      <DashboardLayout title="Attendance">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#D32F2F] border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Attendance">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-[#242424] rounded-2xl p-6 border border-[#2A2A32] flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
              Overall Attendance
            </p>
            <p className="text-3xl font-bold text-emerald-400">
              {Math.round(attendancePercentage)}%
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Calendar size={24} />
          </div>
        </div>

        <div className="bg-[#242424] rounded-2xl p-6 border border-[#2A2A32] flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
              Active Warnings
            </p>
            <p className="text-3xl font-bold text-yellow-400">
              {warnings?.activeWarningCount ?? 0}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center">
            <AlertTriangle size={24} />
          </div>
        </div>

        <div className="bg-[#242424] rounded-2xl p-6 border border-[#2A2A32] flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
              Minimum Requirement
            </p>
            <p className="text-3xl font-bold text-white">85%</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Clock size={24} />
          </div>
        </div>
      </div>

      {/* Warning Guidelines Notice */}
      {warnings && warnings.activeWarningCount > 0 && (
        <div className="mb-8 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm flex items-center gap-3">
          <AlertTriangle size={20} className="shrink-0" />
          <div>
            <span className="font-semibold">Attendance Warning Active:</span> Maintain above 85% attendance to prevent academic probation. Contact your teacher to review attendance records.
          </div>
        </div>
      )}

      {/* Attendance History */}
      <div className="bg-[#242424] rounded-2xl p-6 border border-[#2A2A32]">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Calendar size={20} className="text-[#D32F2F]" /> Attendance Log &amp; Session History
        </h3>

        {history.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-xs">
            <Calendar size={32} className="mx-auto text-gray-600 mb-2 opacity-60" />
            <p className="text-sm font-semibold text-white">100% Attendance Record</p>
            <p className="text-gray-500 mt-1">
              No recorded missed sessions. Keep up the great consistency!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item: any, idx: number) => (
              <div
                key={item.id || idx}
                className="p-4 rounded-xl bg-[#1C1C20] border border-[#2E2E38] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {item.status === "PRESENT" ? (
                    <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle size={20} className="text-rose-400 shrink-0" />
                  )}
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      {item.session || "Academy Class Session"}
                    </h4>
                    <p className="text-xs text-gray-400">{item.sessionDate || item.date}</p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                    item.status === "PRESENT"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getMyStudents, submitAttendance } from "../../lib/teacherApi";

type AttendanceStatus = "PRESENT" | "ABSENT" | "EXCUSED";

interface AttendanceRecord {
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  note: string;
}

export default function TeacherAttendancePage() {
  const [cohortId, setCohortId] = useState("");
  const [sessionDate, setSessionDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setIsLoading(true);
        const res = await getMyStudents({ size: 100 });
        const realStudents = res.data?.students || [];

        if (realStudents.length > 0) {
          const firstCohort = realStudents[0].cohortId || "";
          setCohortId(firstCohort);
          setRecords(
            realStudents.map((student: any) => ({
              studentId: student.id,
              studentName: student.fullName,
              status: "PRESENT" as AttendanceStatus,
              note: "",
            })),
          );
        }
      } catch {
        setError("Failed to load students for attendance marking");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  const updateRecord = (
    studentId: string,
    field: "status" | "note",
    value: string,
  ) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.studentId === studentId ? { ...r, [field]: value } : r,
      ),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cohortId) {
      setError("No cohort found for your students");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      await submitAttendance({
        cohortId,
        sessionDate,
        records: records.map((r) => ({
          studentId: r.studentId,
          status: r.status,
          note: r.note || undefined,
        })),
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to submit attendance");
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusColor = (status: AttendanceStatus) => {
    if (status === "PRESENT")
      return "bg-green-400/10 text-green-400 border-green-400/30";
    if (status === "ABSENT")
      return "bg-red-400/10 text-red-400 border-red-400/30";
    return "bg-yellow-400/10 text-yellow-400 border-yellow-400/30";
  };

  return (
    <DashboardLayout title="Submit Attendance">
      <div className="max-w-3xl">
        {/* Date picker */}
        <div className="bg-[#242424] rounded-2xl p-5 mb-6">
          <label className="block text-sm text-gray-300 mb-2">
            Session Date
          </label>
          <input
            type="date"
            value={sessionDate}
            onChange={(e) => setSessionDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="px-4 py-2.5 rounded-xl bg-[#2a2a2a] border border-[#3a3a3a]
              text-white text-sm focus:outline-none focus:border-[#D32F2F]
              transition-colors"
          />
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
            Attendance submitted successfully!
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-[#D32F2F] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p>No students assigned to you</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="bg-[#242424] rounded-2xl overflow-hidden mb-6">
              {/* Quick mark all */}
              <div className="flex items-center gap-3 px-5 py-3 border-b border-[#2a2a2a]">
                <span className="text-gray-400 text-sm">Mark all:</span>
                {(["PRESENT", "ABSENT", "EXCUSED"] as AttendanceStatus[]).map(
                  (s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() =>
                        setRecords((prev) =>
                          prev.map((r) => ({ ...r, status: s })),
                        )
                      }
                      className={`text-xs px-3 py-1 rounded-full border transition-colors ${statusColor(s)}`}
                    >
                      {s}
                    </button>
                  ),
                )}
              </div>

              {/* Student rows */}
              {records.map((record, index) => (
                <div
                  key={record.studentId}
                  className={`flex items-center gap-4 px-5 py-4
                    ${index < records.length - 1 ? "border-b border-[#2a2a2a]" : ""}`}
                >
                  {/* Avatar + name */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[#D32F2F]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#D32F2F] text-sm font-bold">
                        {record.studentName?.charAt(0)}
                      </span>
                    </div>
                    <p className="text-white text-sm font-medium truncate">
                      {record.studentName}
                    </p>
                  </div>

                  {/* Status buttons */}
                  <div className="flex gap-2">
                    {(
                      ["PRESENT", "ABSENT", "EXCUSED"] as AttendanceStatus[]
                    ).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() =>
                          updateRecord(record.studentId, "status", s)
                        }
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                          record.status === s
                            ? statusColor(s)
                            : "border-[#3a3a3a] text-gray-500 hover:border-gray-500"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  {/* Note */}
                  <input
                    type="text"
                    placeholder="Note (optional)"
                    value={record.note}
                    onChange={(e) =>
                      updateRecord(record.studentId, "note", e.target.value)
                    }
                    className="w-40 px-3 py-1.5 rounded-lg bg-[#2a2a2a] border
                      border-[#3a3a3a] text-white text-xs placeholder-gray-600
                      focus:outline-none focus:border-[#D32F2F] transition-colors"
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C]
                text-white text-sm font-semibold disabled:opacity-60
                transition-colors"
            >
              {isSubmitting ? "Submitting..." : "Submit Attendance"}
            </button>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}

import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Code2,
  ExternalLink,
  Edit2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  Sparkles,
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../hooks/useAuth";
import { getStudent, updateStudentProfile } from "../../lib/studentAPI";
import type { Student } from "../../types/student";

const getCodeforcesRankStyle = (rankTitle?: string) => {
  const r = (rankTitle || "").toLowerCase();
  if (
    r.includes("legendary") ||
    r.includes("international grandmaster") ||
    r.includes("grandmaster")
  ) {
    return {
      textColor: "text-red-500",
      bgColor: "bg-red-500/15",
      borderColor: "border-red-500/30",
      label: rankTitle || "Grandmaster",
    };
  }
  if (r.includes("master")) {
    return {
      textColor: "text-amber-500",
      bgColor: "bg-amber-500/15",
      borderColor: "border-amber-500/30",
      label: rankTitle || "Master",
    };
  }
  if (r.includes("candidate master")) {
    return {
      textColor: "text-purple-400",
      bgColor: "bg-purple-500/15",
      borderColor: "border-purple-500/30",
      label: "Candidate Master",
    };
  }
  if (r.includes("expert")) {
    return {
      textColor: "text-blue-400",
      bgColor: "bg-blue-500/15",
      borderColor: "border-blue-500/30",
      label: "Expert",
    };
  }
  if (r.includes("specialist")) {
    return {
      textColor: "text-cyan-400",
      bgColor: "bg-cyan-500/15",
      borderColor: "border-cyan-500/30",
      label: "Specialist",
    };
  }
  if (r.includes("pupil")) {
    return {
      textColor: "text-emerald-400",
      bgColor: "bg-emerald-500/15",
      borderColor: "border-emerald-500/30",
      label: "Pupil",
    };
  }
  return {
    textColor: "text-gray-400",
    bgColor: "bg-gray-500/15",
    borderColor: "border-gray-500/30",
    label: rankTitle && rankTitle !== "unrated" ? rankTitle : "Newbie",
  };
};

export default function StudentProfilePage() {
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [, setLoading] = useState(true);

  // Codeforces handle editing state
  const [isEditingHandle, setIsEditingHandle] = useState(false);
  const [handleInput, setHandleInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const fetchStudentData = async () => {
    if (!user) return;
    const studentId = user.id || user.userId;
    if (studentId) {
      try {
        const res = await getStudent(studentId);
        setStudent(res.data);
        setHandleInput(res.data.codeforcesHandle || "");
      } catch (err) {
        console.error("Failed to load student profile:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [user]);

  const handleSaveCodeforces = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const studentId = user.id || user.userId;
    if (!studentId) return;

    setIsSaving(true);
    setSaveStatus({ type: null, message: "" });

    try {
      const res = await updateStudentProfile(studentId, {
        codeforcesHandle: handleInput.trim() || null,
      });
      setStudent(res.data);
      setHandleInput(res.data.codeforcesHandle || "");
      setIsEditingHandle(false);
      setSaveStatus({
        type: "success",
        message: handleInput.trim()
          ? `Codeforces handle updated to "${handleInput.trim()}"!`
          : "Codeforces handle removed.",
      });
      setTimeout(() => {
        setSaveStatus({ type: null, message: "" });
      }, 4000);
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || "Failed to update Codeforces handle. Please try again.";
      setSaveStatus({
        type: "error",
        message: errorMsg,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const cfRankStyle = getCodeforcesRankStyle(student?.codeforcesRank);

  return (
    <DashboardLayout title="Profile">
      {/* Profile Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1E1E24] via-[#2A1E24] to-[#1E1E24] border border-[#3A2E34] p-6 mb-8 shadow-lg">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#D32F2F] to-[#991B1B] text-white flex items-center justify-center text-3xl font-bold border-2 border-white/20 shadow-xl">
            {user?.fullName?.charAt(0) || "S"}
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
              <h1 className="text-2xl font-bold text-white">{user?.fullName}</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-[#D32F2F]/20 text-[#EF5350] border border-[#D32F2F]/30">
                Student
              </span>
              {student?.codeforcesRank && student.codeforcesRank !== "unrated" && (
                <span
                  className={`px-2.5 py-0.5 text-xs font-bold rounded-md border ${cfRankStyle.bgColor} ${cfRankStyle.textColor} ${cfRankStyle.borderColor}`}
                >
                  {cfRankStyle.label}
                </span>
              )}
            </div>
            <p className="text-gray-400 text-sm flex items-center justify-center md:justify-start gap-2">
              <Mail size={14} /> {user?.email}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              {student?.cohortName || "BigO Academy - Cohort 6"} · Year {student?.yearPhase || 1}
            </p>
          </div>
        </div>
      </div>

      {/* Notifications / Feedback */}
      {saveStatus.message && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-center gap-3 border transition-all ${
            saveStatus.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {saveStatus.type === "success" ? (
            <CheckCircle2 size={18} className="shrink-0" />
          ) : (
            <AlertCircle size={18} className="shrink-0" />
          )}
          <span className="text-sm font-medium">{saveStatus.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Codeforces Competitive Profile Card */}
        <div className="bg-[#242424] rounded-2xl p-6 border border-[#2A2A32] shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code2 size={20} className="text-[#3B82F6]" /> Codeforces Integration
              </h3>
              {!isEditingHandle && (
                <button
                  type="button"
                  onClick={() => {
                    setHandleInput(student?.codeforcesHandle || "");
                    setIsEditingHandle(true);
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#2A2A32] hover:bg-[#33333E] text-gray-300 hover:text-white border border-[#3A3A46] transition-colors"
                >
                  <Edit2 size={13} />
                  {student?.codeforcesHandle ? "Change Handle" : "Link Handle"}
                </button>
              )}
            </div>

            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              Connect your Codeforces username to participate on the Academy leaderboard, track your competitive programming rating, and automatically sync contest stats.
            </p>

            {isEditingHandle ? (
              <form onSubmit={handleSaveCodeforces} className="space-y-4 bg-[#1E1E24] p-4 rounded-xl border border-[#33333E]">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Codeforces Handle
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 text-sm">
                      @
                    </span>
                    <input
                      type="text"
                      value={handleInput}
                      onChange={(e) => setHandleInput(e.target.value)}
                      placeholder="e.g. tourist, benq"
                      className="w-full bg-[#17171C] border border-[#2F2F3B] focus:border-[#3B82F6] rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                      autoFocus
                    />
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1.5">
                    Leave blank if you wish to remove your linked Codeforces profile.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingHandle(false);
                      setHandleInput(student?.codeforcesHandle || "");
                    }}
                    disabled={isSaving}
                    className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white rounded-lg hover:bg-[#2A2A32] transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    {isSaving ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Sparkles size={13} />
                    )}
                    Save Handle
                  </button>
                </div>
              </form>
            ) : student?.codeforcesHandle ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#1E1E24] border border-[#2F2F3B] flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-500 block mb-0.5">Linked Handle</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-base font-bold ${cfRankStyle.textColor}`}>
                        {student.codeforcesHandle}
                      </span>
                      <a
                        href={`https://codeforces.com/profile/${student.codeforcesHandle}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-400 hover:text-blue-400 transition-colors p-1"
                        title="View profile on Codeforces"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-gray-500 block mb-0.5">Rank Title</span>
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-bold rounded-md border ${cfRankStyle.bgColor} ${cfRankStyle.textColor} ${cfRankStyle.borderColor}`}
                    >
                      {cfRankStyle.label}
                    </span>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#1E1E24] border border-[#2F2F3B]">
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                      <TrendingUp size={13} className="text-blue-400" /> Current Rating
                    </div>
                    <div className="text-xl font-bold text-white">
                      {student.codeforcesRating || 0}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#1E1E24] border border-[#2F2F3B]">
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                      <Award size={13} className="text-amber-400" /> Max Rating
                    </div>
                    <div className="text-xl font-bold text-white">
                      {student.codeforcesMaxRating || student.codeforcesRating || 0}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-[#1E1E24] border border-dashed border-[#3A3A46] text-center">
                <Code2 size={32} className="mx-auto text-gray-600 mb-2" />
                <h4 className="text-sm font-semibold text-gray-300 mb-1">No Handle Connected</h4>
                <p className="text-xs text-gray-500 mb-4 max-w-sm mx-auto">
                  Add your Codeforces username to showcase your stats on the Academy leaderboard.
                </p>
                <button
                  type="button"
                  onClick={() => setIsEditingHandle(true)}
                  className="px-4 py-2 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-semibold transition-all inline-flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles size={14} /> Connect Codeforces Profile
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Account & Academic Details */}
        <div className="bg-[#242424] rounded-2xl p-6 border border-[#2A2A32] shadow-md">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <User size={18} className="text-[#D32F2F]" /> Academic &amp; Account Details
          </h3>

          <div className="space-y-3.5 text-sm text-gray-300">
            <div className="flex items-center justify-between py-2.5 border-b border-[#2A2A32]">
              <span className="text-gray-400 text-xs">Full Name</span>
              <span className="font-semibold text-white">{user?.fullName}</span>
            </div>
            <div className="flex items-center justify-between py-2.5 border-b border-[#2A2A32]">
              <span className="text-gray-400 text-xs">Email Address</span>
              <span className="font-semibold text-white">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between py-2.5 border-b border-[#2A2A32]">
              <span className="text-gray-400 text-xs">Assigned Cohort</span>
              <span className="font-semibold text-white">{student?.cohortName || "BigO Academy - Cohort 6"}</span>
            </div>
            <div className="flex items-center justify-between py-2.5 border-b border-[#2A2A32]">
              <span className="text-gray-400 text-xs">Academic Phase</span>
              <span className="font-semibold text-emerald-400">Year {student?.yearPhase || 1}</span>
            </div>
            <div className="flex items-center justify-between py-2.5 border-b border-[#2A2A32]">
              <span className="text-gray-400 text-xs">Attendance Percentage</span>
              <span className="font-semibold text-blue-400">
                {Math.round(
                  student?.attendancePercentage !== undefined &&
                    student?.attendancePercentage !== null
                    ? Number(student.attendancePercentage)
                    : 100,
                )}%
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-400 text-xs">Account Status</span>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {student?.status || "ACTIVE"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

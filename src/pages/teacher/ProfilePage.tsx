import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../hooks/useAuth";
import { getTeacher } from "../../lib/teacherApi";

export default function TeacherProfilePage() {
  const { user } = useAuth();
  const [teacher, setTeacher] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const res = await getTeacher(user.userId);
        setTeacher(res.data);
      } catch {
        setError("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const statusColor =
    teacher?.status === "ACTIVE"
      ? "bg-green-400/10 text-green-400"
      : teacher?.status === "PENDING"
        ? "bg-yellow-400/10 text-yellow-400"
        : "bg-gray-400/10 text-gray-400";

  return (
    <DashboardLayout title="My Profile">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#D32F2F] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      ) : (
        <div className="max-w-lg space-y-6">
          {/* Profile card */}
          <div className="bg-[#242424] rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#D32F2F]/20 flex items-center justify-center">
                <span className="text-[#D32F2F] text-2xl font-bold">
                  {teacher?.fullName?.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-white text-xl font-semibold">
                  {teacher?.fullName}
                </h2>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full ${statusColor}`}
                >
                  {teacher?.status}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-gray-500 text-xs mb-1">Email</p>
                <p className="text-white text-sm">{teacher?.email}</p>
              </div>

              <div>
                <p className="text-gray-500 text-xs mb-1">Assigned Cohorts</p>
                {teacher?.assignedCohortIds?.length > 0 ? (
                  <p className="text-white text-sm">
                    {teacher.assignedCohortIds.length} cohort
                    {teacher.assignedCohortIds.length > 1 ? "s" : ""}
                  </p>
                ) : (
                  <p className="text-gray-500 text-sm">No cohorts assigned</p>
                )}
              </div>

              <div>
                <p className="text-gray-500 text-xs mb-1">Member since</p>
                <p className="text-white text-sm">
                  {teacher?.createdAt
                    ? new Date(teacher.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Note about profile editing */}
          <p className="text-gray-500 text-xs">
            Profile updates are managed by administrators. Contact an admin to
            change your name or email.
          </p>
        </div>
      )}
    </DashboardLayout>
  );
}

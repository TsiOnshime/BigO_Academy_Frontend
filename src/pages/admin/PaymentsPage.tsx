import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  getPendingVerifications,
  getOverdueStudents,
  getPendingTeacherPayments,
  updateStudentPaymentStatus,
  updateTeacherPaymentStatus,
  getPaymentSummary,
} from "../../lib/adminApi";

type Tab = "pending" | "overdue" | "teachers" | "summary";

export default function AdminPaymentsPage() {
  const [tab, setTab] = useState<Tab>("pending");
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [overduePayments, setOverduePayments] = useState<any[]>([]);
  const [teacherPayments, setTeacherPayments] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [pendRes, overRes, teachRes, sumRes] = await Promise.allSettled([
        getPendingVerifications(),
        getOverdueStudents(),
        getPendingTeacherPayments(),
        getPaymentSummary(),
      ]);
      setPendingPayments(
        pendRes.status === "fulfilled" ? pendRes.value.data.payments || [] : [],
      );
      setOverduePayments(
        overRes.status === "fulfilled" ? overRes.value.data.students || [] : [],
      );
      setTeacherPayments(
        teachRes.status === "fulfilled"
          ? teachRes.value.data.payments || []
          : [],
      );
      setSummary(sumRes.status === "fulfilled" ? sumRes.value.data : null);
    } catch {
      setError("Failed to load payments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleStudentPaymentAction = async (
    studentId: string,
    paymentId: string,
    status: "PAID" | "FAILED",
  ) => {
    setActionLoading(paymentId);
    setError("");
    try {
      await updateStudentPaymentStatus(studentId, paymentId, {
        status,
        note: status === "PAID" ? "Verified by admin" : "Rejected by admin",
      });
      await fetchAll();
    } catch {
      setError("Action failed. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleTeacherPaymentAction = async (
    teacherId: string,
    paymentId: string,
    status: "PAID" | "CANCELLED",
  ) => {
    setActionLoading(paymentId);
    setError("");
    try {
      await updateTeacherPaymentStatus(teacherId, paymentId, { status });
      await fetchAll();
    } catch {
      setError("Action failed. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const tabs: { key: Tab; label: string; count?: number }[] = [
    {
      key: "pending",
      label: "Pending Verification",
      count: pendingPayments.length,
    },
    { key: "overdue", label: "Overdue", count: overduePayments.length },
    {
      key: "teachers",
      label: "Teacher Payments",
      count: teacherPayments.length,
    },
    { key: "summary", label: "Summary" },
  ];

  return (
    <DashboardLayout title="Payments">
      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ backgroundColor: "var(--bg-surface)" }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-[#D32F2F] text-white"
                : "hover:text-white"
            }`}
            style={{
              color: tab === t.key ? "#ffffff" : "var(--text-secondary)",
            }}
          >
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span
                className="ml-2 text-xs px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: tab === t.key ? "rgba(255,255,255,0.2)" : "var(--border)",
                }}
              >
                {t.count}
              </span>
            )}
          </button>
        ))}
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
        <>
          {/* Pending verification */}
          {tab === "pending" && (
            <div className="space-y-3">
              {pendingPayments.length === 0 ? (
                <div className="text-center py-16 text-sm" style={{ color: "var(--text-muted)" }}>
                  No pending payments to verify
                </div>
              ) : (
                pendingPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="rounded-2xl p-5 flex items-center justify-between"
                    style={{ backgroundColor: "var(--bg-surface)" }}
                  >
                    <div>
                      <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                        Student ID: {payment.studentId?.slice(0, 8)}...
                      </p>
                      <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
                        {payment.paymentMonth} · {payment.currency}{" "}
                        {payment.amount}
                      </p>
                      {payment.referenceNumber && (
                        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                          Ref: {payment.referenceNumber}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {actionLoading === payment.id ? (
                        <div className="w-5 h-5 border-2 border-[#D32F2F] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <button
                            onClick={() =>
                              handleStudentPaymentAction(
                                payment.studentId,
                                payment.id,
                                "PAID",
                              )
                            }
                            className="flex items-center gap-1.5 text-xs px-3 py-2
                              rounded-lg bg-green-400/10 text-green-400
                              hover:bg-green-400/20 transition-colors"
                          >
                            <CheckCircle size={14} /> Verify
                          </button>
                          <button
                            onClick={() =>
                              handleStudentPaymentAction(
                                payment.studentId,
                                payment.id,
                                "FAILED",
                              )
                            }
                            className="flex items-center gap-1.5 text-xs px-3 py-2
                              rounded-lg bg-red-400/10 text-red-400
                              hover:bg-red-400/20 transition-colors"
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Overdue */}
          {tab === "overdue" && (
            <div className="space-y-3">
              {overduePayments.length === 0 ? (
                <div className="text-center py-16 text-sm" style={{ color: "var(--text-muted)" }}>
                  No overdue payments
                </div>
              ) : (
                overduePayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="rounded-2xl p-5 flex items-center justify-between"
                    style={{ backgroundColor: "var(--bg-surface)" }}
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle size={18} className="text-yellow-400" />
                      <div>
                        <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                          Student ID: {payment.studentId?.slice(0, 8)}...
                        </p>
                        <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
                          {payment.paymentMonth} · {payment.currency}{" "}
                          {payment.amount}
                        </p>
                        <p className="text-red-400 text-xs mt-0.5">
                          Due: {new Date(payment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-400/10 text-yellow-400">
                      OVERDUE
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Teacher payments */}
          {tab === "teachers" && (
            <div className="space-y-3">
              {teacherPayments.length === 0 ? (
                <div className="text-center py-16 text-sm" style={{ color: "var(--text-muted)" }}>
                  No pending teacher payments
                </div>
              ) : (
                teacherPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="rounded-2xl p-5 flex items-center justify-between"
                    style={{ backgroundColor: "var(--bg-surface)" }}
                  >
                    <div>
                      <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                        Teacher ID: {payment.teacherId?.slice(0, 8)}...
                      </p>
                      <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
                        {payment.paymentMonth} · {payment.currency}{" "}
                        {payment.amount}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {actionLoading === payment.id ? (
                        <div className="w-5 h-5 border-2 border-[#D32F2F] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <button
                            onClick={() =>
                              handleTeacherPaymentAction(
                                payment.teacherId,
                                payment.id,
                                "PAID",
                              )
                            }
                            className="flex items-center gap-1.5 text-xs px-3 py-2
                              rounded-lg bg-green-400/10 text-green-400
                              hover:bg-green-400/20 transition-colors"
                          >
                            <CheckCircle size={14} /> Mark Paid
                          </button>
                          <button
                            onClick={() =>
                              handleTeacherPaymentAction(
                                payment.teacherId,
                                payment.id,
                                "CANCELLED",
                              )
                            }
                            className="flex items-center gap-1.5 text-xs px-3 py-2
                              rounded-lg bg-gray-400/10 hover:bg-gray-400/20 transition-colors"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            <XCircle size={14} /> Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Summary */}
          {tab === "summary" && summary && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl p-5" style={{ backgroundColor: "var(--bg-surface)" }}>
                <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                  Student Payments — {summary.month}
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      label: "Total Paid",
                      value: summary.studentPayments?.totalPaid,
                      color: "text-green-400",
                    },
                    {
                      label: "Total Pending",
                      value: summary.studentPayments?.totalPending,
                      color: "text-yellow-400",
                    },
                    {
                      label: "Total Overdue",
                      value: summary.studentPayments?.totalOverdue,
                      color: "text-red-400",
                    },
                    {
                      label: "Amount Collected",
                      value: `${summary.studentPayments?.currency} ${summary.studentPayments?.totalAmountCollected?.toLocaleString()}`,
                      color: "",
                    },
                  ].map(({ label, value, color }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}</span>
                      <span className={`font-semibold ${color}`} style={!color ? { color: "var(--text-primary)" } : {}}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl p-5" style={{ backgroundColor: "var(--bg-surface)" }}>
                <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                  Teacher Payments — {summary.month}
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      label: "Total Paid",
                      value: summary.teacherPayments?.totalPaid,
                      color: "text-green-400",
                    },
                    {
                      label: "Total Pending",
                      value: summary.teacherPayments?.totalPending,
                      color: "text-yellow-400",
                    },
                    {
                      label: "Amount Paid",
                      value: `${summary.teacherPayments?.currency} ${summary.teacherPayments?.totalAmountPaid?.toLocaleString()}`,
                      color: "",
                    },
                    {
                      label: "Amount Pending",
                      value: `${summary.teacherPayments?.currency} ${summary.teacherPayments?.totalAmountPending?.toLocaleString()}`,
                      color: "text-yellow-400",
                    },
                  ].map(({ label, value, color }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}</span>
                      <span className={`font-semibold ${color}`} style={!color ? { color: "var(--text-primary)" } : {}}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}

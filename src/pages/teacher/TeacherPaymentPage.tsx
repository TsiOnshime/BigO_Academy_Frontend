import { useEffect, useState } from "react";
import { CreditCard, CheckCircle2, Clock, DollarSign } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getTeacherPayments } from "../../lib/teacherApi";
import { useAuth } from "../../hooks/useAuth";

export default function TeacherPaymentPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    getTeacherPayments(user.id)
      .then((res) => setPayments(res.data.payments || res.data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [user?.id]);

  if (isLoading) {
    return (
      <DashboardLayout title="Payment History">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#D32F2F] border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const latestPayment = payments.length > 0 ? payments[0] : null;

  return (
    <DashboardLayout title="Payment History">
      {/* Header Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-[#242424] rounded-2xl p-6 border border-[#2A2A32] flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
              Monthly Stipend
            </p>
            <p className="text-3xl font-bold text-emerald-400">
              {latestPayment
                ? `$${Number(latestPayment.amount).toLocaleString()}`
                : "$1,200"}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="bg-[#242424] rounded-2xl p-6 border border-[#2A2A32] flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
              Payment Status
            </p>
            <p className="text-3xl font-bold text-blue-400">
              {latestPayment ? latestPayment.status : "ACTIVE"}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="bg-[#242424] rounded-2xl p-6 border border-[#2A2A32] flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
              Total Disbursed
            </p>
            <p className="text-3xl font-bold text-white">
              {payments.length} Payments
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Clock size={24} />
          </div>
        </div>
      </div>

      {/* Payment Records Table */}
      <div className="bg-[#242424] rounded-2xl border border-[#2A2A32] overflow-hidden">
        <div className="p-5 border-b border-[#2A2A32]">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CreditCard size={20} className="text-[#D32F2F]" /> Monthly Stipend &amp; Payment History
          </h3>
        </div>

        {payments.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            <CreditCard size={36} className="mx-auto text-gray-600 mb-2 opacity-60" />
            <p>No stipend payment disbursements recorded yet.</p>
            <p className="text-xs text-gray-500 mt-1">
              Payments processed by academy administrators will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-[#1C1C20] text-xs uppercase text-gray-400 border-b border-[#2A2A32]">
                <tr>
                  <th className="py-4 px-5">Month</th>
                  <th className="py-4 px-5">Amount</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5">Date Disbursed</th>
                  <th className="py-4 px-5 text-right">Note / Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A32]">
                {payments.map((item: any, idx: number) => (
                  <tr key={item.id || idx} className="hover:bg-[#1E1E24]">
                    <td className="py-4 px-5 font-semibold text-white">
                      {item.paymentMonth}
                    </td>
                    <td className="py-4 px-5 font-mono text-emerald-400 font-bold">
                      ${Number(item.amount).toLocaleString()} {item.currency || "USD"}
                    </td>
                    <td className="py-4 px-5">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-xs text-gray-400">
                      {item.paidAt
                        ? new Date(item.paidAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="py-4 px-5 text-right font-mono text-xs text-gray-400">
                      {item.note || item.id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}


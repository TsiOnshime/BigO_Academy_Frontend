import { useEffect, useState } from "react";
import {
  CreditCard,
  Calendar,
  CheckCircle2,
  Clock,
  X,
  Receipt,
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../hooks/useAuth";
import {
  getStudentPaymentHistory,
  getSubscriptionStatus,
  submitPaymentReference,
} from "../../lib/paymentApi";
import type {
  StudentPayment,
  SubscriptionStatus,
  StudentPaymentStatus,
} from "../../types/payment";

const STATUS_COLORS: Record<StudentPaymentStatus, string> = {
  PAID: "bg-green-400/10 text-green-400",
  PENDING: "bg-yellow-400/10 text-yellow-400",
  OVERDUE: "bg-red-400/10 text-red-400",
  FAILED: "bg-gray-400/10 text-gray-400",
};

function currentMonth() {
  return new Date().toISOString().slice(0, 7); // "YYYY-MM"
}

function endOfMonth(month: string) {
  const [y, m] = month.split("-").map(Number);
  const last = new Date(y, m, 0).getDate();
  return `${month}-${String(last).padStart(2, "0")}`;
}

function formatMonth(month: string) {
  const [y, m] = month.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-[#242424] rounded-2xl p-5 flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-white text-lg font-bold truncate">{value}</p>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<StudentPayment[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Form state
  const [paymentMonth, setPaymentMonth] = useState(currentMonth());
  const [referenceNumber, setReferenceNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("ETB");
  const [dueDate, setDueDate] = useState(endOfMonth(currentMonth()));
  const [note, setNote] = useState("");

  const fetchData = async () => {
    if (!user) return;
    try {
      const [historyRes, subRes] = await Promise.all([
        getStudentPaymentHistory(user.userId),
        getSubscriptionStatus(user.userId),
      ]);
      setPayments(historyRes.data.payments || []);
      setSubscription(subRes.data);
    } catch {
      setError("Failed to load payment information");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const alreadyHasCurrentMonthRecord = payments.some(
    (p) => p.paymentMonth === currentMonth(),
  );

  const openModal = () => {
    const month = currentMonth();
    setPaymentMonth(month);
    setDueDate(endOfMonth(month));
    setReferenceNumber("");
    setAmount(subscription?.lastPaymentAmount?.toString() || "");
    setNote("");
    setFormError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!referenceNumber.trim() || referenceNumber.trim().length < 3) {
      setFormError("Reference number must be at least 3 characters");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setFormError("Enter a valid amount");
      return;
    }

    setIsSubmitting(true);
    setFormError("");
    try {
      await submitPaymentReference(user.userId, {
        paymentMonth,
        referenceNumber: referenceNumber.trim(),
        amount: Number(amount),
        currency,
        dueDate,
        note: note.trim() || undefined,
      });
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        (err?.response?.status === 409
          ? "A payment record already exists for this month"
          : "Failed to submit payment reference");
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Payment">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#D32F2F] border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Payment">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <p className="text-gray-400 text-sm">
          Track your monthly payments and submit a reference for admin
          verification.
        </p>
        <button
          onClick={openModal}
          disabled={alreadyHasCurrentMonthRecord}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl
            bg-[#D32F2F] hover:bg-[#B71C1C] disabled:opacity-40
            disabled:cursor-not-allowed text-white text-sm font-medium
            transition-colors whitespace-nowrap"
        >
          <CreditCard size={16} />
          Submit Payment
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Subscription status */}
      {subscription && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Subscription Status"
            value={subscription.subscriptionStatus}
            icon={<CreditCard size={22} className="text-[#D32F2F]" />}
            color="bg-[#D32F2F]/10"
          />
          <StatCard
            label="This Month"
            value={subscription.currentMonthPaid ? "Paid" : "Not paid"}
            icon={
              subscription.currentMonthPaid ? (
                <CheckCircle2 size={22} className="text-green-400" />
              ) : (
                <Clock size={22} className="text-yellow-400" />
              )
            }
            color={
              subscription.currentMonthPaid
                ? "bg-green-400/10"
                : "bg-yellow-400/10"
            }
          />
          <StatCard
            label="Next Due Date"
            value={
              subscription.nextDueDate
                ? new Date(subscription.nextDueDate).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric", year: "numeric" },
                  )
                : "—"
            }
            icon={<Calendar size={22} className="text-blue-400" />}
            color="bg-blue-400/10"
          />
          <StatCard
            label="Last Payment"
            value={
              subscription.lastPaymentAmount != null
                ? `${subscription.lastPaymentAmount} ${payments[0]?.currency || ""}`
                : "—"
            }
            icon={<Receipt size={22} className="text-gray-300" />}
            color="bg-gray-400/10"
          />
        </div>
      )}

      {/* Payment history */}
      {payments.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Receipt size={40} className="mx-auto mb-3 opacity-30" />
          <p>No payment records yet</p>
          <button
            onClick={openModal}
            className="mt-3 text-[#D32F2F] hover:text-[#B71C1C] text-sm"
          >
            Submit your first payment
          </button>
        </div>
      ) : (
        <div className="bg-[#242424] rounded-2xl overflow-hidden">
          <div className="grid grid-cols-5 px-5 py-3 border-b border-[#2a2a2a] text-gray-500 text-xs font-medium uppercase">
            <span>Month</span>
            <span>Amount</span>
            <span>Reference</span>
            <span>Due Date</span>
            <span>Status</span>
          </div>

          {payments
            .slice()
            .sort((a, b) => b.paymentMonth.localeCompare(a.paymentMonth))
            .map((payment) => (
              <div
                key={payment.id}
                className="grid grid-cols-5 px-5 py-4 border-b border-[#2a2a2a]
                  last:border-0 hover:bg-[#2a2a2a] transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-white text-sm font-medium">
                    {formatMonth(payment.paymentMonth)}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-300 text-sm">
                    {payment.amount} {payment.currency}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400 text-sm truncate">
                    {payment.referenceNumber || "—"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400 text-sm">
                    {new Date(payment.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full ${
                      STATUS_COLORS[payment.status]
                    }`}
                  >
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Submit payment modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="bg-[#242424] rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold text-lg">
                Submit Payment
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">
                  Payment Month
                </label>
                <input
                  type="month"
                  value={paymentMonth}
                  onChange={(e) => {
                    setPaymentMonth(e.target.value);
                    setDueDate(endOfMonth(e.target.value));
                  }}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#2a2a2a] border
                    border-[#3a3a3a] text-white text-sm focus:outline-none
                    focus:border-[#D32F2F] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-300 mb-1.5">
                    Amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#2a2a2a] border
                      border-[#3a3a3a] text-white placeholder-gray-500 text-sm
                      focus:outline-none focus:border-[#D32F2F] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1.5">
                    Currency
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#2a2a2a] border
                      border-[#3a3a3a] text-white text-sm focus:outline-none
                      focus:border-[#D32F2F] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1.5">
                  Reference Number
                </label>
                <input
                  type="text"
                  placeholder="Bank transfer / transaction reference"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  required
                  minLength={3}
                  maxLength={200}
                  className="w-full px-4 py-3 rounded-xl bg-[#2a2a2a] border
                    border-[#3a3a3a] text-white placeholder-gray-500 text-sm
                    focus:outline-none focus:border-[#D32F2F] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1.5">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#2a2a2a] border
                    border-[#3a3a3a] text-white text-sm focus:outline-none
                    focus:border-[#D32F2F] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1.5">
                  Note <span className="text-gray-500">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Any extra detail for the admin reviewing this"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#2a2a2a] border
                    border-[#3a3a3a] text-white placeholder-gray-500 text-sm
                    focus:outline-none focus:border-[#D32F2F] transition-colors
                    resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl border border-[#3a3a3a]
                    text-gray-400 text-sm hover:text-white hover:border-gray-500
                    transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C]
                    text-white text-sm font-medium disabled:opacity-60
                    transition-colors"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
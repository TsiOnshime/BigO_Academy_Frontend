// Matches adapters/inbound/rest/serializers.py in payment-service

export type StudentPaymentStatus = "PENDING" | "PAID" | "OVERDUE" | "FAILED";

export interface StudentPayment {
  id: string;
  studentId: string;
  paymentMonth: string; // "YYYY-MM"
  amount: number;
  currency: string;
  status: StudentPaymentStatus;
  referenceNumber: string | null;
  note: string | null;
  verifiedBy: string | null;
  verifiedAt: string | null;
  dueDate: string; // "YYYY-MM-DD"
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionStatus {
  studentId: string;
  subscriptionStatus: StudentPaymentStatus;
  currentMonthPaid: boolean;
  nextDueDate: string | null;
  lastPaymentDate: string | null;
  lastPaymentAmount: number | null;
}

export interface SubmitPaymentReferenceRequest {
  paymentMonth: string; // "YYYY-MM"
  referenceNumber: string;
  amount: number;
  currency: string;
  dueDate: string; // "YYYY-MM-DD"
  note?: string;
}

export interface StudentPaymentHistoryResponse {
  studentId: string;
  payments: StudentPayment[];
}
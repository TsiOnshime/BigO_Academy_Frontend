import { paymentApi } from "./api";
import type {
  StudentPaymentHistoryResponse,
  SubscriptionStatus,
  SubmitPaymentReferenceRequest,
  StudentPayment,
} from "../types/payment";

// ── Student payments ────────────────────────────────────────────────────
// Students can only access their own records (enforced server-side via
// requireAdminOrSelf — a STUDENT token only passes when studentId === self).

export const getStudentPaymentHistory = (studentId: string) =>
  paymentApi.get<StudentPaymentHistoryResponse>(
    `/payments/students/${studentId}/`,
  );

export const getSubscriptionStatus = (studentId: string) =>
  paymentApi.get<SubscriptionStatus>(
    `/payments/students/${studentId}/subscription/`,
  );

export const submitPaymentReference = (
  studentId: string,
  data: SubmitPaymentReferenceRequest,
) =>
  paymentApi.post<StudentPayment>(
    `/payments/students/${studentId}/submit-reference/`,
    data,
  );
import { authApi, academicApi, paymentApi, analyticsApi } from "./api";

// ── Auth Account Management ────────────────────────────────────────────────

export const createAuthAccount = (data: {
  email: string;
  fullName: string;
  role: "STUDENT" | "TEACHER" | "ADMIN";
  password?: string;
  status?: string;
}) => authApi.post("/auth/admin/accounts/", data);

export const activateAuthAccount = (userId: string) =>
  authApi.post(`/auth/admin/accounts/${userId}/activate/`);

export const deactivateAuthAccount = (userId: string) =>
  authApi.post(`/auth/admin/accounts/${userId}/deactivate/`);

// ── Academic ──────────────────────────────────────────────────────────────

export const getAllStudents = (params?: {
  cohortId?: string;
  status?: string;
  page?: number;
  size?: number;
}) => academicApi.get("/students/", { params });

export const createStudent = (data: {
  userId: string;
  fullName: string;
  email: string;
  cohortId: string;
  codeforcesHandle?: string;
  joinedAt?: string;
}) =>
  academicApi.post("/students/", {
    userId: data.userId,
    fullName: data.fullName,
    email: data.email,
    cohortId: data.cohortId,
    codeforcesHandle: data.codeforcesHandle,
    joinedAt: data.joinedAt,
  });

export const updateStudentStatus = (
  studentId: string,
  data: { status: string; reason?: string },
) => academicApi.patch(`/students/${studentId}/status/`, data);

export const promoteStudent = (studentId: string) =>
  academicApi.post(`/students/${studentId}/promote/`);

export const graduateStudent = (studentId: string) =>
  academicApi.post(`/students/${studentId}/graduate/`);

export const getAllTeachers = (params?: { status?: string }) =>
  academicApi.get("/teachers/", { params });

export const activateTeacher = (teacherId: string) =>
  academicApi.post(`/teachers/${teacherId}/activate/`);

export const deactivateTeacher = (teacherId: string) =>
  academicApi.post(`/teachers/${teacherId}/deactivate/`);

export const createTeacher = (data: {
  userId: string;
  fullName: string;
  email: string;
}) => academicApi.post("/teachers/", data);

export const getAllCohorts = () => academicApi.get("/cohorts/");

export const createCohort = (data: {
  name: string;
  startDate: string;
  expectedGraduationDate: string;
  studentCapacity: number;
}) => academicApi.post("/cohorts/", data);

export const archiveCohort = (cohortId: string) =>
  academicApi.post(`/cohorts/${cohortId}/archive/`);

export const assignTeacherToCohort = (cohortId: string, teacherId: string) =>
  academicApi.post(`/cohorts/${cohortId}/teachers/`, { teacherId });

// ── Payment ───────────────────────────────────────────────────────────────

export const getPendingVerifications = () =>
  paymentApi.get("/payments/students/pending-verification/");

export const getOverdueStudents = () =>
  paymentApi.get("/payments/students/overdue/");

export const getPendingTeacherPayments = () =>
  paymentApi.get("/payments/teachers/pending/");

export const updateStudentPaymentStatus = (
  studentId: string,
  paymentId: string,
  data: { status: string; note?: string },
) =>
  paymentApi.patch(
    `/payments/students/${studentId}/payments/${paymentId}/status/`,
    data,
  );

export const updateTeacherPaymentStatus = (
  teacherId: string,
  paymentId: string,
  data: { status: string; note?: string },
) =>
  paymentApi.patch(
    `/payments/teachers/${teacherId}/payments/${paymentId}/status/`,
    data,
  );

export const getPaymentSummary = (month?: string) =>
  paymentApi.get("/payments/reports/summary/", { params: { month } });

export const recordTeacherPayment = (
  teacherId: string,
  data: {
    paymentMonth: string;
    amount: number;
    currency: string;
    note?: string;
  },
) => paymentApi.post(`/payments/teachers/${teacherId}/`, data);

// ── Analytics ─────────────────────────────────────────────────────────────

export const getPlatformAnalytics = () =>
  analyticsApi.get("/analytics/admin/platform/");

export const getGlobalLeaderboard = (params?: {
  page?: number;
  size?: number;
}) => analyticsApi.get("/analytics/leaderboard/", { params });

export const getCohortAnalytics = (cohortId: string) =>
  analyticsApi.get(`/analytics/admin/cohorts/${cohortId}/`);

// ── Contests ──────────────────────────────────────────────────────────────

export const getAdminContests = (params?: {
  cohortId?: string;
  status?: string;
}) => academicApi.get("/contests/", { params });

export const createAdminContest = (data: {
  title: string;
  externalContestUrl: string;
  scheduledAt: string;
  cohortId?: string;
  problemCount?: number;
}) => academicApi.post("/contests/", data);


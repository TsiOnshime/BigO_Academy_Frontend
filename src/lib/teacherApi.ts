import { academicApi, paymentApi } from "./api";

// ── Teacher ───────────────────────────────────────────────────────────────

export const getTeacher = (teacherId: string) =>
  academicApi.get(`/teachers/${teacherId}/`);

export const getTeacherPayments = (teacherId: string) =>
  paymentApi.get(`/payments/teachers/${teacherId}/`);

// ── Students (teachers see only their assigned students) ──────────────────

export const getMyStudents = (params?: {
  cohortId?: string;
  status?: string;
  page?: number;
  size?: number;
}) => academicApi.get("/students/", { params });

export const getStudent = (studentId: string) =>
  academicApi.get(`/students/${studentId}/`);

export const getStudentAttendance = (
  studentId: string,
  params?: { fromDate?: string; toDate?: string },
) => academicApi.get(`/students/${studentId}/attendance/`, { params });

// ── Attendance ────────────────────────────────────────────────────────────

export const submitAttendance = (data: {
  cohortId: string;
  sessionDate: string;
  records: { studentId: string; status: string; note?: string }[];
}) => academicApi.post("/attendance/sessions/", data);

export const editAttendance = (
  sessionId: string,
  data: {
    records: { studentId: string; status: string; note?: string }[];
  },
) => academicApi.patch(`/attendance/sessions/${sessionId}/`, data);

export const getCohortAttendance = (
  cohortId: string,
  params?: { fromDate?: string; toDate?: string },
) => academicApi.get(`/cohorts/${cohortId}/attendance/`, { params });

// ── Mentorship ────────────────────────────────────────────────────────────

export const getMentorshipSessions = (teacherId: string) =>
  academicApi.get("/mentorship-sessions/", {
    params: { teacherId },
  });

export const scheduleMentorshipSession = (data: {
  teacherId: string;
  studentId: string;
  scheduledAt: string;
}) => academicApi.post("/mentorship-sessions/", data);

export const updateMentorshipSession = (
  sessionId: string,
  data: { status?: string; notes?: string; scheduledAt?: string },
) => academicApi.patch(`/mentorship-sessions/${sessionId}/`, data);

// ── Curriculum & Problems ──────────────────────────────────────────────────

export const createTopic = (
  cohortId: string,
  data: {
    title: string;
    yearPhase: 1 | 2;
    description?: string;
    displayOrder?: number;
  },
) => academicApi.post(`/cohorts/${cohortId}/topics/`, data);

export const updateTopic = (
  topicId: string,
  data: {
    title?: string;
    description?: string;
    displayOrder?: number;
  },
) => academicApi.patch(`/topics/${topicId}/`, data);

export const deleteTopic = (topicId: string) =>
  academicApi.delete(`/topics/${topicId}/`);

export const getTopicProblems = (topicId: string) =>
  academicApi.get(`/topics/${topicId}/problems/`);

export const addProblemToTopic = (
  topicId: string,
  data: {
    title: string;
    source: string;
    externalUrl: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
  },
) => academicApi.post(`/topics/${topicId}/problems/`, data);

export const updateProblem = (
  problemId: string,
  data: {
    title?: string;
    externalUrl?: string;
    difficulty?: "EASY" | "MEDIUM" | "HARD";
  },
) => academicApi.patch(`/problems/${problemId}/`, data);

export const deleteProblem = (problemId: string) =>
  academicApi.delete(`/problems/${problemId}/`);


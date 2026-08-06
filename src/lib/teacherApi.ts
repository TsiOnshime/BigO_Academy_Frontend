import { academicApi } from "./api";

// ── Teacher ───────────────────────────────────────────────────────────────

export const getTeacher = (teacherId: string) =>
  academicApi.get(`/teachers/${teacherId}/`);

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

import { academicApi } from "./api";
import type {
  Student,
  Topic,
  ProgressSheet,
  MentorshipSession,
  StudentAttendance,
  StudentWarnings,
} from "../types/student";

// NOTE ON IDS: the academic-service JWT payload only carries
// userId/email/role — it has no `studentId` claim, and there's no
// "get student by userId" lookup endpoint. Following the same
// convention already used for payment-service, these calls assume the
// academic-service `Student.id` is the same UUID as the auth `userId`.
// If that's not true in your setup, swap these call sites to whatever
// lookup actually resolves userId -> studentId.

export const getStudent = (studentId: string) =>
  academicApi.get<Student>(`/students/${studentId}/`);

export const getStudentAttendance = (studentId: string) =>
  academicApi.get<StudentAttendance>(`/students/${studentId}/attendance/`);

export const getStudentProgress = (studentId: string, topicId?: string) =>
  academicApi.get<ProgressSheet>(`/students/${studentId}/progress/`, {
    params: topicId ? { topicId } : undefined,
  });

export const getStudentWarnings = (studentId: string) =>
  academicApi.get<StudentWarnings>(`/students/${studentId}/warnings/`);

export const getCohortTopics = (cohortId: string, yearPhase?: 1 | 2) =>
  academicApi.get<{ topics: Topic[] }>(`/cohorts/${cohortId}/topics/`, {
    params: yearPhase ? { yearPhase } : undefined,
  });

export const getMyMentorshipSessions = (studentId: string) =>
  academicApi.get<{ sessions: MentorshipSession[] }>(`/mentorship-sessions/`, {
    params: { studentId },
  });
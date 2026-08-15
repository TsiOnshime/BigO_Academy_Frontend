import { academicApi } from "./api";
import type {
  Student,
  Topic,
  Problem,
  ProblemProgress,
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

// Helper functions for student management and academic progress tracking.
export const getStudent = (studentId: string) =>
  academicApi.get<Student>(`/students/${studentId}/`);

export const updateStudentProfile = (
  studentId: string,
  data: {
    fullName?: string;
    email?: string;
    codeforcesHandle?: string | null;
  }
) =>
  academicApi.patch<Student>(`/students/${studentId}/`, data);

export const getStudentAttendance = (studentId: string) =>
  academicApi.get<StudentAttendance>(`/students/${studentId}/attendance/`);

export const getStudentProgress = (studentId: string, topicId?: string) =>
  academicApi.get<ProgressSheet>(`/students/${studentId}/progress/`, {
    params: topicId ? { topicId } : undefined,
  });

export const updateProblemProgress = (
  studentId: string,
  problemId: string,
  data: { solved: boolean; attemptCount?: number; solveTimeMinutes?: number }
) =>
  academicApi.patch<ProblemProgress>(
    `/students/${studentId}/progress/${problemId}/`,
    data
  );

export const getStudentWarnings = (studentId: string) =>
  academicApi.get<StudentWarnings>(`/students/${studentId}/warnings/`);

export const getCohortTopics = (cohortId: string, yearPhase?: 1 | 2) =>
  academicApi.get<{ topics: Topic[] }>(`/cohorts/${cohortId}/topics/`, {
    params: yearPhase ? { yearPhase } : undefined,
  });

export const getTopicProblems = (topicId: string) =>
  academicApi.get<{ problems: Problem[] }>(`/topics/${topicId}/problems/`);

export const promoteStudent = (studentId: string) =>
  academicApi.post<Student>(`/students/${studentId}/promote/`);

export const getMyMentorshipSessions = (studentId: string) =>
  academicApi.get<{ sessions: MentorshipSession[] }>(`/mentorship-sessions/`, {
    params: { studentId },
  });

export const getContests = (params?: { cohortId?: string; status?: string }) =>
  academicApi.get<{ contests: any[] }>("/contests/", { params });

export const getContestResults = (contestId: string) =>
  academicApi.get(`/contests/${contestId}/results/`);
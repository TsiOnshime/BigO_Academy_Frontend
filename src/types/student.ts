// Matches adapters/inbound/rest/serializers/{student,curriculum,progress,
// mentorship,attendance,warning}.py in academic-service.

export type StudentStatus =
  | "ACTIVE"
  | "PROBATION"
  | "DROPPED"
  | "GRADUATED"
  | "ARCHIVED";

export type YearPhase = 1 | 2;

export interface Student {
  id: string;
  fullName: string;
  email: string;
  status: StudentStatus;
  yearPhase: YearPhase;
  cohortId: string | null;
  cohortName: string | null;
  assignedTeacherId: string | null;
  attendancePercentage: number;
  activeWarningCount: number;
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
}

// ── Curriculum (Courses page) ───────────────────────────────────────────
// Note: the backend has no "list problems for a topic" endpoint (see
// curriculum_views.py docstring) — only topic-level data is available.

export interface Topic {
  id: string;
  title: string;
  description: string | null;
  yearPhase: YearPhase;
  displayOrder: number;
  problemCount: number;
  createdAt: string;
}

// ── Progress ─────────────────────────────────────────────────────────────

export interface ProblemProgress {
  problemId: string;
  problemTitle?: string;
  solved: boolean;
  attemptCount: number;
  solveTimeMinutes: number;
  verifiedByTeacher: boolean;
  solvedAt: string | null;
}

export interface ProgressSheet {
  studentId: string;
  totalProblems: number;
  solvedCount: number;
  completionPercentage: number;
  progress: ProblemProgress[];
}

// ── Mentorship (Schedule page) ──────────────────────────────────────────

export type MentorshipSessionStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";

export interface MentorshipSession {
  id: string;
  teacherId: string;
  teacherName?: string;
  studentId: string;
  studentName?: string;
  scheduledAt: string;
  status: MentorshipSessionStatus;
  notes: string | null;
  createdAt: string;
}

// ── Attendance ───────────────────────────────────────────────────────────

export type AttendanceStatus = "PRESENT" | "ABSENT" | "EXCUSED";

export interface AttendanceHistoryEntry {
  sessionDate: string;
  status: AttendanceStatus;
  note?: string | null;
}

export interface StudentAttendance {
  studentId: string;
  attendancePercentage: number;
  totalSessions: number;
  presentCount: number;
  absentCount: number;
  excusedCount: number;
  history: AttendanceHistoryEntry[];
}

// ── Warnings ─────────────────────────────────────────────────────────────

export type WarningType =
  | "LOW_ATTENDANCE"
  | "LOW_PERFORMANCE"
  | "LOW_CONSISTENCY"
  | "WEAK_CONTEST_PARTICIPATION";

export type WarningStatus = "ACTIVE" | "DISMISSED" | "ESCALATED";

export interface Warning {
  id: string;
  studentId: string;
  type: WarningType;
  status: WarningStatus;
  warningNumber: number;
  issuedAt: string;
  dismissedAt: string | null;
  dismissedBy: string | null;
  dismissalNote: string | null;
}

export interface StudentWarnings {
  studentId: string;
  activeWarningCount: number;
  warnings: Warning[];
}
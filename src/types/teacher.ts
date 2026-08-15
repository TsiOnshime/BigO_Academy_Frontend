export interface Teacher {
  id: string;
  fullName: string;
  email: string;
  status: "PENDING" | "ACTIVE" | "INACTIVE";
  assignedCohortIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  fullName: string;
  email: string;
  status: "ACTIVE" | "PROBATION" | "DROPPED" | "GRADUATED" | "ARCHIVED";
  yearPhase: number;
  cohortId: string;
  cohortName?: string;
  assignedTeacherId: string | null;
  attendancePercentage: number;
  activeWarningCount: number;
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface MentorshipSession {
  id: string;
  studentId: string;
  teacherId: string;
  scheduledAt: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Cohort {
  id: string;
  name: string;
  status: "ACTIVE" | "ARCHIVED";
  startDate: string;
  expectedGraduationDate: string;
  studentCapacity: number;
  enrolledStudentCount: number;
  teacherCount: number;
}

export interface Pagination {
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

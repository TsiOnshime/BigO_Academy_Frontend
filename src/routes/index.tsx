import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Landing
import LandingPage from "../pages/landing/LandingPage";

// Auth
import LoginPage from "../pages/auth/LoginPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import UnauthorizedPage from "../pages/auth/UnauthorizedPage";
import OAuthCallbackPage from "../pages/auth/OAuthCallbackPage";

// Student
import StudentDashboard from "../pages/student/DashboardPage";
import StudentCourses from "../pages/student/CoursesPage";
import StudentSchedule from "../pages/student/SchedulePage";
import StudentProgress from "../pages/student/ProgressPage";
import StudentContests from "../pages/student/ContestPage";
import StudentLeaderboard from "../pages/student/LeaderboardPage";
import StudentAttendance from "../pages/student/AttendancePage";
import StudentProfile from "../pages/student/ProfilePage";

// Teacher
import TeacherDashboard from "../pages/teacher/DashboardPage";
import TeacherStudentsPage from "../pages/teacher/StudentsPage";
import TeacherMentorshipPage from "../pages/teacher/MentorshipPage";
import TeacherProfilePage from "../pages/teacher/ProfilePage";
import TeacherAttendancePage from "../pages/teacher/AttendancePage";
import TeacherCohortManagementPage from "../pages/teacher/CohortManagementPage";
import TeacherCurriculumManagementPage from "../pages/teacher/CurriculumManagementPage";
import TeacherPaymentPage from "../pages/teacher/TeacherPaymentPage";

// Admin
import AdminDashboard from "../pages/admin/DashboardPage";
import AdminStudentsPage from "../pages/admin/StudentsPage";
import AdminTeachersPage from "../pages/admin/TeachersPage";
import AdminCohortsPage from "../pages/admin/CohortsPage";
import AdminPaymentsPage from "../pages/admin/PaymentsPage";
import AdminAnalyticsPage from "../pages/admin/AnalyticsPage";
import AdminSecurityPage from "../pages/admin/SecurityPage";
import AdminWarningEscalationPage from "../pages/admin/WarningEscalationPage";
import AdminContestManagementPage from "../pages/admin/ContestManagementPage";

// Payment
import PaymentPage from "../pages/payment/PaymentPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Navigate to="/login" replace />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/oauth/callback" element={<OAuthCallbackPage />} />

      {/* Student Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentCourses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/progress"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentProgress />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contests"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentContests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentLeaderboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/schedule"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentSchedule />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <PaymentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentProfile />
          </ProtectedRoute>
        }
      />

      {/* Teacher Routes */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={["TEACHER"]}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/cohorts"
        element={
          <ProtectedRoute allowedRoles={["TEACHER"]}>
            <TeacherCohortManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/attendance"
        element={
          <ProtectedRoute allowedRoles={["TEACHER"]}>
            <TeacherAttendancePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/students"
        element={
          <ProtectedRoute allowedRoles={["TEACHER"]}>
            <TeacherStudentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/curriculum"
        element={
          <ProtectedRoute allowedRoles={["TEACHER"]}>
            <TeacherCurriculumManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/mentorship"
        element={
          <ProtectedRoute allowedRoles={["TEACHER"]}>
            <TeacherMentorshipPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/payments"
        element={
          <ProtectedRoute allowedRoles={["TEACHER"]}>
            <TeacherPaymentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/profile"
        element={
          <ProtectedRoute allowedRoles={["TEACHER"]}>
            <TeacherProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/cohorts"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminCohortsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/teachers"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminTeachersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminStudentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminAnalyticsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/warnings"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminWarningEscalationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/payments"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminPaymentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/contests"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminContestManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/security"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminSecurityPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminSecurityPage />
          </ProtectedRoute>
        }
      />

      {/* Public Landing & Marketing */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/landing" element={<LandingPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

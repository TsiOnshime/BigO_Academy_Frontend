import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Auth
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";

// Student
import StudentDashboard from "../pages/student/DashboardPage";
import StudentCourses from "../pages/student/CoursesPage";
import StudentSchedule from "../pages/student/SchedulePage";
import StudentMessages from "../pages/student/MessagesPage";
import StudentCertificates from "../pages/student/CertificatesPage";
import StudentProgress from "../pages/student/ProgressPage";

// Teacher
import TeacherDashboard from "../pages/teacher/DashboardPage";
import TeacherStudentsPage from "../pages/teacher/StudentsPage";
import TeacherMentorshipPage from "../pages/teacher/MentorshipPage";
import TeacherProfilePage from "../pages/teacher/ProfilePage";
import TeacherAttendancePage from "../pages/teacher/AttendancePage";

// Admin
import AdminDashboard from "../pages/admin/DashboardPage";
import AdminStudentsPage from "../pages/admin/StudentsPage";
import AdminTeachersPage from "../pages/admin/TeachersPage";
import AdminCohortsPage from "../pages/admin/CohortsPage";
import AdminPaymentsPage from "../pages/admin/PaymentsPage";
import AdminAnalyticsPage from "../pages/admin/AnalyticsPage";
import AdminSecurityPage from "../pages/admin/SecurityPage";


// Payment
import PaymentPage from "../pages/payment/PaymentPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Student */}
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
        path="/schedule"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentSchedule />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentMessages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/certificates"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentCertificates />
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
        path="/payment"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <PaymentPage />
          </ProtectedRoute>
        }
      />

      {/* Teacher */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={["TEACHER"]}>
            <TeacherDashboard />
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
        path="/teacher/mentorship"
        element={
          <ProtectedRoute allowedRoles={["TEACHER"]}>
            <TeacherMentorshipPage />
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
        path="/teacher/profile"
        element={
          <ProtectedRoute allowedRoles={["TEACHER"]}>
            <TeacherProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
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
        path="/admin/teachers"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminTeachersPage />
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
        path="/admin/payments"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminPaymentsPage />
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
        path="/admin/security"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminSecurityPage />
          </ProtectedRoute>
        }
      />

      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

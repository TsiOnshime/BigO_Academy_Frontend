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

// Admin
import AdminDashboard from "../pages/admin/DashboardPage";

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

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

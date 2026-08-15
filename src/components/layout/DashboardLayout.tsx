import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  Award,
  TrendingUp,
  Shield,
  Settings,
  LogOut,
  Menu,
  X,
  GraduationCap,
  CreditCard,
  BarChart2,
  Trophy,
  UserCheck,
  AlertTriangle,
  User,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const studentNav: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
  { label: "Curriculum", path: "/courses", icon: <BookOpen size={20} /> },
  { label: "Progress Sheet", path: "/progress", icon: <TrendingUp size={20} /> },
  { label: "Contests", path: "/contests", icon: <Trophy size={20} /> },
  { label: "Leaderboard", path: "/leaderboard", icon: <Award size={20} /> },
  { label: "Attendance", path: "/attendance", icon: <UserCheck size={20} /> },
  { label: "One-on-One Sessions", path: "/schedule", icon: <Calendar size={20} /> },
  { label: "Payment", path: "/payment", icon: <CreditCard size={20} /> },
  { label: "Profile", path: "/profile", icon: <User size={20} /> },
];

const teacherNav: NavItem[] = [
  { label: "Teacher Dashboard", path: "/teacher", icon: <LayoutDashboard size={20} /> },
  { label: "Cohort Management", path: "/teacher/cohorts", icon: <BookOpen size={20} /> },
  { label: "Attendance Management", path: "/teacher/attendance", icon: <Calendar size={20} /> },
  { label: "Student Monitoring", path: "/teacher/students", icon: <Users size={20} /> },
  { label: "Curriculum Management", path: "/teacher/curriculum", icon: <BookOpen size={20} /> },
  { label: "One-on-One Scheduling", path: "/teacher/mentorship", icon: <Calendar size={20} /> },
  { label: "Payment History", path: "/teacher/payments", icon: <CreditCard size={20} /> },
  { label: "Profile", path: "/teacher/profile", icon: <Settings size={20} /> },
];

const adminNav: NavItem[] = [
  { label: "Admin Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
  { label: "Cohort Management", path: "/admin/cohorts", icon: <BookOpen size={20} /> },
  { label: "Teacher Management", path: "/admin/teachers", icon: <GraduationCap size={20} /> },
  { label: "Student Management", path: "/admin/students", icon: <Users size={20} /> },
  { label: "Analytics Dashboard", path: "/admin/analytics", icon: <BarChart2 size={20} /> },
  { label: "Warning & Escalation", path: "/admin/warnings", icon: <AlertTriangle size={20} /> },
  { label: "Payment Management", path: "/admin/payments", icon: <CreditCard size={20} /> },
  { label: "Contest Management", path: "/admin/contests", icon: <Trophy size={20} /> },
  { label: "Security", path: "/admin/security", icon: <Shield size={20} /> },
  { label: "Settings", path: "/admin/settings", icon: <Settings size={20} /> },
];

function Sidebar({
  navItems,
  isOpen,
  onClose,
}: {
  navItems: NavItem[];
  isOpen: boolean;
  onClose: () => void;
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      {/* Overlay on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-60 z-30
          bg-[#1e1e1e] border-r border-[#2a2a2a]
          flex flex-col
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-[#2a2a2a]">
          <div className="w-8 h-8 bg-[#D32F2F] rounded-lg flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
            </svg>
          </div>
          <span className="font-semibold text-white text-sm">BigO Academy</span>

          {/* Close button on mobile */}
          <button
            onClick={onClose}
            className="ml-auto text-gray-500 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-[#D32F2F] text-white"
                    : "text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
                }`
              }
            >
              {item.icon}
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User profile section at bottom */}
        <div className="p-4 border-t border-[#2a2a2a] flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#D32F2F] flex items-center justify-center text-white font-bold text-xs shrink-0">
              {user?.fullName?.charAt(0) || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">
                {user?.fullName}
              </p>
              <p className="text-gray-500 text-[11px] truncate">{user?.role}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Log out"
            className="text-gray-500 hover:text-[#D32F2F] transition-colors p-1"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    </>
  );
}

export default function DashboardLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems =
    user?.role === "ADMIN"
      ? adminNav
      : user?.role === "TEACHER"
      ? teacherNav
      : studentNav;

  return (
    <div className="min-h-screen bg-[#121212] flex">
      <Sidebar
        navItems={navItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="h-16 border-b border-[#2a2a2a] bg-[#1a1a1a] flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-400 hover:text-white lg:hidden"
            >
              <Menu size={20} />
            </button>

            <h1 className="text-lg font-semibold text-white">{title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#2a2a2a] text-gray-300 font-medium">
              {user?.role}
            </span>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
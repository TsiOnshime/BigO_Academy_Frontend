import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  MessageSquare,
  Award,
  TrendingUp,
  Shield,
  Settings,
  LogOut,
  Menu,
  X,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const studentNav: NavItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  { label: "My Courses", path: "/courses", icon: <BookOpen size={20} /> },
  { label: "Schedule", path: "/schedule", icon: <Calendar size={20} /> },
  { label: "Messages", path: "/messages", icon: <MessageSquare size={20} /> },
  { label: "Progress", path: "/progress", icon: <TrendingUp size={20} /> },
  { label: "Certificates", path: "/certificates", icon: <Award size={20} /> },
];

const teacherNav: NavItem[] = [
  { label: "Dashboard", path: "/teacher", icon: <LayoutDashboard size={20} /> },
  {
    label: "My Students",
    path: "/teacher/students",
    icon: <Users size={20} />,
  },
  {
    label: "Mentorship",
    path: "/teacher/mentorship",
    icon: <MessageSquare size={20} />,
  },
  {
    label: "Attendance",
    path: "/teacher/attendance",
    icon: <Calendar size={20} />,
  },
  { label: "Profile", path: "/teacher/profile", icon: <Settings size={20} /> },
];

const adminNav: NavItem[] = [
  { label: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
  { label: "Students", path: "/admin/students", icon: <Users size={20} /> },
  {
    label: "Teachers",
    path: "/admin/teachers",
    icon: <GraduationCap size={20} />,
  },
  { label: "Cohorts", path: "/admin/cohorts", icon: <BookOpen size={20} /> },
  { label: "Payments", path: "/admin/payments", icon: <Award size={20} /> },
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
          fixed top-0 left-0 h-full w-56 z-30
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

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={
                item.path === "/dashboard" ||
                item.path === "/teacher" ||
                item.path === "/admin"
              }
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                transition-colors ${
                  isActive
                    ? "bg-[#D32F2F]/20 text-[#D32F2F] font-medium"
                    : "text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User info + logout */}
        <div className="px-3 py-4 border-t border-[#2a2a2a] space-y-1">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-[#D32F2F]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[#D32F2F] text-xs font-bold">
                {user?.fullName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">
                {user?.fullName}
              </p>
              <p className="text-gray-500 text-xs truncate capitalize">
                {user?.role?.toLowerCase()}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
              text-sm text-gray-400 hover:text-white hover:bg-[#2a2a2a]
              transition-colors"
          >
            <LogOut size={20} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function DashboardLayout({
  children,
  title,
}: DashboardLayoutProps) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems =
    user?.role === "ADMIN"
      ? adminNav
      : user?.role === "TEACHER"
        ? teacherNav
        : studentNav;

  return (
    <div className="flex h-screen bg-[#1a1a1a] overflow-hidden">
      <Sidebar
        navItems={navItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top navbar */}
        <header className="flex items-center gap-4 px-6 py-4 border-b border-[#2a2a2a] bg-[#1e1e1e]">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-white lg:hidden"
          >
            <Menu size={22} />
          </button>

          <h1 className="text-white font-semibold text-lg">{title}</h1>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

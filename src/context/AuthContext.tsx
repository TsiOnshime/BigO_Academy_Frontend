import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authApi } from "../lib/api";
import type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "../types/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Turn this OFF once the backend auth is ready.
 */
const DEV_LOGIN = true;

// Change this role to test different dashboards.
const DEV_USER: User = {
  userId: "1",
  fullName: "Meron Tadesse",
  email: "teacher@a2sv.org",
  role: "ADMIN",
  status: "ACTIVE",
  mustChangePassword: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
// Added missing required field
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Development mode
    if (DEV_LOGIN) {
      setUser(DEV_USER);

      localStorage.setItem("accessToken", "dev-token");
      localStorage.setItem("refreshToken", "dev-refresh-token");
      localStorage.setItem("user", JSON.stringify(DEV_USER));

      setIsLoading(false);
      return;
    }

    // Production mode
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");

    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.clear();
      }
    }

    setIsLoading(false);
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const response = await authApi.post<AuthResponse>("/auth/login/", data);

    const { user, accessToken, refreshToken } = response.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));

    setUser(user);
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const response = await authApi.post<AuthResponse>("/auth/register/", data);

    const { user, accessToken, refreshToken } = response.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));

    setUser(user);
  }, []);

  const logout = useCallback(async () => {
    if (DEV_LOGIN) {
      setUser(null);
      return;
    }

    try {
      const refreshToken = localStorage.getItem("refreshToken");
      await authApi.post("/auth/logout/", { refreshToken });
    } catch {
      // Ignore API errors
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

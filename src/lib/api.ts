import axios from "axios";

const createInstance = (baseURL: string) => {
  const instance = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
  });

  // Attach token to every outgoing request
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Handle 401 globally — token expired
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    },
  );

  return instance;
};

export const authApi = createInstance(
  import.meta.env.VITE_AUTH_SERVICE_URL || "http://localhost:8000/api/v1",
);
export const academicApi = createInstance(
  import.meta.env.VITE_ACADEMIC_SERVICE_URL || "http://localhost:8001/api/v1",
);
export const paymentApi = createInstance(
  import.meta.env.VITE_PAYMENT_SERVICE_URL || "http://localhost:8002/api/v1",
);
export const analyticsApi = createInstance(
  import.meta.env.VITE_ANALYTICS_SERVICE_URL || "http://localhost:8003/api/v1",
);

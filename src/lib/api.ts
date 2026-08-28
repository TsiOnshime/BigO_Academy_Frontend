import axios from "axios";

const AUTH_BASE_URL =
  import.meta.env.VITE_AUTH_SERVICE_URL || "http://localhost:8000/api/v1";
const etagCache = new Map<string, string>()

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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
    const url = config.url || ""
    const cachedEtag = etagCache.get(url)
    if (cachedEtag){
      config.headers["If-None-Match"] = cachedEtag
    }
    return config;
  });

  // Handle 401 globally with auto-refresh
  instance.interceptors.response.use(
    (response) => {
      const etag = response.headers["etag"]
      if (etag && response.config.url){
        etagCache.set(response.config.url, etag)
      }
      return response
    },
    async (error) => {
      const originalRequest = error.config;
      const url = originalRequest?.url || "";
      const isAuthRequest =
        url.includes("/auth/login") ||
        url.includes("/auth/register") ||
        url.includes("/auth/refresh");

      if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return instance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          try {
            const refreshRes = await axios.post(`${AUTH_BASE_URL}/auth/refresh/`, {
              refreshToken,
            });
            const newAccessToken =
              refreshRes.data.accessToken || refreshRes.data.access_token;
            const newRefreshToken =
              refreshRes.data.refreshToken || refreshRes.data.refresh_token;

            if (newAccessToken) {
              localStorage.setItem("accessToken", newAccessToken);
              if (newRefreshToken) {
                localStorage.setItem("refreshToken", newRefreshToken);
              }
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              processQueue(null, newAccessToken);
              return instance(originalRequest);
            }
          } catch (refreshErr) {
            processQueue(refreshErr, null);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            window.location.href = "/login";
            return Promise.reject(refreshErr);
          } finally {
            isRefreshing = false;
          }
        } else {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      }

      return Promise.reject(error);
    },
  );

  return instance;
};

export const authApi = createInstance(AUTH_BASE_URL);
export const academicApi = createInstance(
  import.meta.env.VITE_ACADEMIC_SERVICE_URL || "http://localhost:8001/api/v1",
);
export const paymentApi = createInstance(
  import.meta.env.VITE_PAYMENT_SERVICE_URL || "http://localhost:8002/api/v1",
);
export const analyticsApi = createInstance(
  import.meta.env.VITE_ANALYTICS_SERVICE_URL || "http://localhost:8003/api/v1",
);

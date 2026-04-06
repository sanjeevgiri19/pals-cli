import axios from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:3005" : "");

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is required in production");
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const { session } = useAuthStore.getState();
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - logout
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

export default apiClient;

import axios from "axios";
import { BACKUP_SERVER_URL } from "@/lib/utils";

export const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 503 &&
      !originalRequest?._retriedWithBackup &&
      originalRequest.url?.startsWith("/api")
    ) {
      console.warn("Primary server unavailable (503). Trying backup server...");
      originalRequest._retriedWithBackup = true;

      try {
        const backupRes = await axios({
          ...originalRequest,
          baseURL: BACKUP_SERVER_URL,
        });
        return backupRes;
      } catch (backupErr) {
        return Promise.reject(backupErr);
      }
    }

    return Promise.reject(error);
  }
);

import axios from "axios";
import { BACKUP_SERVER_URL, SERVER_URL } from "@/lib/utils";

export const axiosInstance = axios.create({
  baseURL: SERVER_URL,
});

// axiosInstance.interceptors.request.use((req) => {
//   req.baseURL = SERVER_URL;
//   return req;
// });

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 503 &&
        !originalRequest?._retriedWithBackup) ||
      error.code === "ERR_NETWORK"
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

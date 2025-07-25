import { SERVER_URL } from "../utils";
import { axiosInstance } from "@/app/api/axios-instance";

type AxiosProps = {
  success: boolean;
  message: string;
  key?: string;
  fileName: string;
};

export async function handleUploadFiles(formData: FormData) {
  const apiUrl = `${SERVER_URL}/file`;

  try {
    const { data } = await axiosInstance.post<AxiosProps>(apiUrl, formData, {
      timeout: 5 * (1000 * 60),
      timeoutErrorMessage: "Upload took longer than usual",
    });

    const { success, message, key, fileName } = data;

    if (!success) {
      console.log(message);

      return {
        success,
        message,
      };
    }
    return {
      success: true,
      key,
      fileName,
      message,
    };
  } catch (err) {
    console.log("POST_FILES_ERROR:", err);
    return {
      success: false,
      message: err instanceof Error ? err.message : "Internal error, try again",
    };
  }
}

import { axiosInstance } from "@/app/api/axios-instance";
import { isAxiosError } from "axios";
import { SERVER_URL } from "../utils";

interface FileResponse {
  fileName: string;
  url: string;
}

export async function fetchFileUrl(key: string) {
  const apiUrl = `${SERVER_URL}/file/${key}`;

  try {
    const response = await axiosInstance.get<FileResponse>(apiUrl);

    return {
      success: true,
      data: response.data,
      code: response.status,
    };
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.status === 404) {
        return {
          success: false,
          message: "File not found.",
          code: 404,
        };
      }
      return {
        success: false,
        message: error.response?.data.message || error.response?.data,
        code: 404,
      };
    }

    const err = error instanceof Error ? error : { message: "Internal Error" };

    return {
      success: false,
      message: err.message,
      status: 500,
    };
  }
}

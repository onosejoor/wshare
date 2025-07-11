import axios from "axios";

type AxiosProps = {
  success: boolean;
  message: string;
  key?: string;
  fileName: string;
};

export async function handleUploadFiles(formData: FormData) {
  const SERVER_URL = process.env.SERVER_URL!;

  const apiUrl = `${SERVER_URL}/file`;

  try {
    const { data } = await axios.post<AxiosProps>(apiUrl, formData, {
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

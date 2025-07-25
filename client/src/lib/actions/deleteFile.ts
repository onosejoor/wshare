"use server";

import { axiosInstance } from "@/app/api/axios-instance";
import { SERVER_URL } from "../utils";

export async function deleteData(key: string) {
  try {
    const { data } = await axiosInstance.delete<{
      success: boolean;
      message: string;
    }>(`${SERVER_URL}/file/${key}`);

    return { success: data.success, message: data.message };
  } catch (error) {
    console.log("DELETE_FILE_ERROR: ", error);

    return { success: false, message: "Failed to delete file" };
  }
}

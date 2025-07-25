"use server";

import { axiosInstance } from "@/app/api/axios-instance";

export async function deleteData(key: string) {
  try {
    const { data } = await axiosInstance.delete<{
      success: boolean;
      message: string;
    }>(`/file/${key}`);

    return { success: data.success, message: data.message };
  } catch (error) {
    console.log("DELETE_FILE_ERROR: ", error);

    return { success: false, message: "Failed to delete file" };
  }
}

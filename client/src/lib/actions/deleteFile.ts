"use server";

import axios from "axios";

export async function deleteData(key: string) {
  const SERVER_URL = process.env.SERVER_URL;

  try {
    const { data } = await axios.delete<{ success: boolean; message: string }>(
      `${SERVER_URL}/file/${key}`
    );

    return { success: data.success, message: data.message };
  } catch (error) {
    console.log("DELETE_FILE_ERROR: ", error);

    return { success: false, message: "Failed to delete file" };
  }
}

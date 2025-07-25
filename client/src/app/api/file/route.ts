import { NextRequest, NextResponse } from "next/server";
import { axiosInstance } from "../axios-instance";

type AxiosProps = {
  success: boolean;
  message: string;
  key?: string;
  fileName: string;
};

export async function POST(req: NextRequest) {
  const formData = await req.formData();


  try {
    const { data } = await axiosInstance.post<AxiosProps>("/file", formData, {
      timeout: 5 * (1000 * 60),
      timeoutErrorMessage: "Upload took longer than usual",
    });

    const { success, message, key, fileName } = data;

    if (!success) {
      console.log(message);

      return NextResponse.json({
        success,
        message,
      });
    }
    return NextResponse.json({
      success: true,
      key,
      fileName,
      message,
    });
  } catch (err) {
    console.log("POST_FILES_ERROR:", err);
    return NextResponse.json(
      {
        success: false,
        message:
          err instanceof Error ? err.message : "Internal error, try again",
      },
      { status: 500 }
    );
  }
}

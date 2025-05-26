import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

type AxiosProps = {
  success: boolean;
  message: string;
  key?: string;
  fileName: string;
};

export async function POST(req: NextRequest) {
  const formData = await req.formData();
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

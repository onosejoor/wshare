import { getFileIcon } from "@/app/(index)/_components/FileCard";
import DownloadBtn from "./download-btn";

type Data = {
  url: string;
  fileName: string;
};
export default function DownloadCard({ data }: { data: Data }) {
  return (
    <div className="flex items-center justify-center my-10 p-6">
      <div className="space-y-10 max-w-md mx-auto">
        <div className="w-full rounded-md  shadow-2xl bg-primary/10 border border-primary backdrop-blur-sm hover:shadow-3xl">
          <div className="p-8 !space-y-10">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 *:text-white bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  {getFileIcon(data.fileName)}
                </div>
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-accent to-primary text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                  {data.fileName?.split(".").pop()}
                </div>
              </div>
            </div>

            <div className="text-center space-y-4 mb-8">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold truncate text-muted leading-tight">
                  {data.fileName}
                </h2>
              </div>
            </div>

            <DownloadBtn url={data.url} />

            <div className="mt-6 pt-6 border-t border-background">
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Secure Download
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  Virus Free
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-primary/10 p-3 py-5 rounded-md flex gap-3 items-center border-accent border">
          <span className="text-muted whitespace-nowrap font-medium">
            Link didn&apos;t work?{" "}
          </span>
          <a
            href={data.url}
            download={data.fileName}
            className="text-secondary dark:text-accent hover:underline"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
}

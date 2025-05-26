import { Copy, Link2 } from "lucide-react";
import { handleCopy } from "./utils";

export const CopyBtn = ({ downloadUrl }: { downloadUrl: string }) => (
  <div className="mt-6 w-full bg-muted text-bg py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2">
    <Link2 size={20} className="shrink-0" />
    <a href={downloadUrl} className="truncate underline">
      {downloadUrl}
    </a>
    <button
      className="px-4 py-2 hover:bg-muted/50"
      title="Copy url"
      aria-label="copy url"
      onClick={() => handleCopy(downloadUrl)}
    >
      <Copy />
    </button>
  </div>
);

export const ProgressBar = ({ width }: { width: number }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 overflow-hidden">
    <div
      className="bg-primary h-2.5 rounded-full transition-all duration-200"
      style={{ width: `${width}%` }}
    ></div>
  </div>
);

export function checkStats(
  pending: boolean,
  fileLength: number,
  totalSize: number,
  progress: number
) {
  return pending ? (
    <span>Uploading... {progress > 0 && `${progress}%`}</span>
  ) : (
    <span>
      Upload {fileLength} file{fileLength > 1 ? "s" : ""}{" "}
      {`(${(totalSize / 1024 / 1024).toFixed(2)} mb)`}
    </span>
  );
}

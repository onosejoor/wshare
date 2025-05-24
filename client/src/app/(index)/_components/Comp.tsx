

import { Copy, Link2 } from "lucide-react";
import { handleCopy } from "./utils";

export const CopyBtn = ({downloadUrl}: {downloadUrl: string}) => (
  <div className="mt-6 w-full bg-muted text-bg py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2">
    <Link2 size={20} className="shrink-0" />
    <span className="truncate">{downloadUrl}</span>
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

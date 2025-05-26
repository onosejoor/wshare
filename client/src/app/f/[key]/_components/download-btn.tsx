"use client";

import { Download } from "lucide-react";

const DownloadBtn = ({ url }: { url: string }) => (
  <button
    onClick={() => downloadLink(url)}
    className={`w-full h-12 text-lg bg-secondary text-white dark:text-black dark:bg-accent flex items-center justify-center gap-3 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
  >
    <Download className="w-5 h-5" />
    Download File
  </button>
);

export default DownloadBtn;

function downloadLink(url: string) {
  const a = document.createElement("a");
  a.href = url;
  a.style.display = "none";
  a.setAttribute("download", "");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

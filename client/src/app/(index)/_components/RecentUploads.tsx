"use client";
import { getItems } from "@/hooks/useLocalStorage";
import { getFileIcon } from "./FileCard";
import { handleCopy } from "./utils";
import { CopyIcon, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import RecentUploadsLoader from "@/components/loaders/recent-posts";
import Link from "next/link";
type Props = {
  key: string;
  fileName: string;
};

export default function RecentUploads() {
  const [data, setData] = useState<Props[] | null>(null);

  useEffect(() => {
    const { data } = getItems();
    setTimeout(() => {
      setData(data);
    }, 5000);
  }, []);

  if (data === null) {
    return <RecentUploadsLoader />;
  }

  if (data.length < 1) {
    return null;
  }

  return (
    <section className="sm:px-10 px-5 py-5 grid gap-5 h-fit">
      <h4 className="font-medium text-accent">Recent Uploads</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 items-center">
        {data.map((file, idx) => (
          <UploadCard file={file} key={idx} />
        ))}
      </div>
    </section>
  );
}

const UploadCard = ({ file }: { file: Props }) =>{
  const url = `${window.location.href}/f/${file.key}`
  return  (
  <div className="bg-bg p-6 rounded-xl !space-y-3 shadow-sm border w-fit border-neutral/20 dark:border-accent/20">
    <div className="bg-accent/10 p-3 *:text-accent rounded-full w-12 h-12 flex items-center justify-center mb-4">
      {getFileIcon(file.fileName)}
    </div>

    <h3 className="text-xl dark:text-muted font-bold mb-2">{file.fileName}</h3>

    <p className="text-muted text-sm">{file.key}</p>

    <div className="flex gap-5 mt-5 items-center">
      <button
        className="p-3 rounded-full grid place-content-center size-12 bg-primary/20"
        onClick={() => handleCopy(url)}
      >
        <CopyIcon className="size-5 text-accent" />
      </button>
      <Link
        href={`/f/${file.key}`}
        className="p-3 rounded-full grid place-content-center size-12 bg-primary/20"
      >
        <ExternalLink className="size-5 text-accent" />
      </Link>
    </div>
  </div>
);

}
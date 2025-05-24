import { X, FileIcon, FileText, Archive, ImageIcon } from "lucide-react";

type Props = {
  file: File;
  removeFile: (idx: number) => void;
  index: number;
};

export default function FileCard({ file, removeFile, index }: Props) {
  return (
    <div className="flex items-start animate-in justify-start space-x-5 w-full bg-neutral dark:bg-background p-3 rounded-lg">
      <div className="text-secondary">{getFileIcon(file.name)}</div>

      <div className="overflow-hidden ">
        <p className="font-medium truncate">{file.name}</p>
        <p className="text-sm text-muted">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>

      <button
        onClick={() => removeFile(index)}
        className="text-muted hover:text-foreground ml-auto shrink-0"
      >
        <X size={20} />
      </button>
    </div>
  );
}

export const getFileIcon = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "pdf":
      return <FileText size={20} />;
    case "jpg":
    case "png":
    case "gif":
      return <ImageIcon size={20} />;
    case "zip":
    case "rar":
      return <Archive size={20} />;
    default:
      return <FileIcon size={20} />;
  }
};

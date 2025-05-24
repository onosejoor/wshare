import toast from "react-hot-toast";

const MAX_FILE_SIZE_MB = 100;

export function checkFileSize(files: FileList | File[]) {
  const selectedFiles = Array.from(files).filter(
    (file) => file.size / 1024 / 1024 <= MAX_FILE_SIZE_MB
  );

  const rejected = Array.from(files).filter(
    (file) => file.size / 1024 / 1024 > MAX_FILE_SIZE_MB
  );

  if (rejected.length > 0) {
    return { large: true, files: selectedFiles };
  }
  return { large: false, files: selectedFiles };
}

export const handleCopy = (url: string) => {
  navigator.clipboard
    .writeText(url)
    .then(() => toast.success("Url copied to clipboard"))
    .catch(() => toast.error("Failed to copy link"));
};


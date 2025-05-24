"use client";

import { useState, useCallback, FormEvent, useTransition } from "react";
import { Upload, CheckCircle} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import FileCard from "./FileCard";
import { checkFileSize } from "./utils";
import { CopyBtn } from "./Comp";
import { setItem } from "@/hooks/useLocalStorage";

type AxiosProps = {
  success: boolean;
  message: string;
  key?: string;
  fileName: string;
};

export default function FileUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [pending, startTransition] = useTransition();
  const [downloadUrl, setDownloadUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const totalSize =
    files.length > 0
      ? files.map((file) => file.size).reduce((sum, acc) => sum + acc)
      : 0;

  const addUniqueFiles = (incomingFiles: File[]) => {
    setFiles((prev) => {
      return [...prev, ...incomingFiles];
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const { files, large } = checkFileSize(droppedFiles);

    if (large) {
      toast.error("Some files exceed the 100MB limit and were skipped.");
    }

    addUniqueFiles(files);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const { files, large } = checkFileSize(e.target.files);

      if (large) {
        toast.error("Some files exceed the 100MB limit and were skipped.");
      }

      addUniqueFiles(files);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    for (const file of files) {
      formData.append("file", file);
    }

    startTransition(async () => {
      const interval = setInterval(() => {
        setUploadProgress((prev) => (prev === 90 ? prev : prev + 10));
      }, 800);
      try {
        const { data } = await axios.post<AxiosProps>(
          "http://localhost:8080/file",
          formData
        );

        const { success, message, key, fileName } = data;
        const option = success ? "success" : "error";
        toast[option](message);

        if (success) {
          setFiles([]);
          setDownloadUrl(`http://localhost:3000/${key!}`);
          setUploadProgress(0);
          setItem({key: key!, fileName})
        }
        clearInterval(interval);
      } catch (err) {
        console.log("Error uploading files:", err);

        toast.error("Upload failed");
        setUploadProgress(0);
        clearInterval(interval);
      }
    });
  };

  return (
    <div className="text-foreground p-5 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-5">
        <p className="text-muted text-center mb-8">
          Secure file sharing made simple
        </p>
        <form
          className="space-y-5"
          onSubmit={uploadFiles}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <label htmlFor="file_input" className="text-center">
            <div className="border-2 border-dashed rounded-lg py-10 bg-primary/10 p-8 mb-6 transition-all duration-200 border-secondary">
              <Upload
                className="size-7.5 mx-auto mb-4 text-primary"
                strokeWidth={1.5}
              />
              <p className="text-lg mb-2">
                Drag & drop your files here or{" "}
                <span className="text-primary cursor-pointer hover:underline">
                  browse
                  <input
                    type="file"
                    name="file_input"
                    id="file_input"
                    className="hidden"
                    multiple
                    disabled={pending}
                    onChange={handleFileInput}
                  />
                </span>
              </p>
              <p className="text-muted text-sm">
                Upload any type of file (max 100MB)
              </p>
            </div>
          </label>

          <button
            disabled={files.length === 0 || pending}
            className="mt-6 w-full bg-primary text-bg py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 hover:opacity-90"
          >
            <CheckCircle size={20} />
            {pending ? (
              <span>
                Uploading... {uploadProgress > 0 && `${uploadProgress}%`}
              </span>
            ) : (
              <span>
                Upload {files.length} file{files.length > 1 ? "s" : ""}{" "}
                {`(${(totalSize / 1024 / 1024).toFixed(2)} mb)`}
              </span>
            )}
          </button>

          {uploadProgress > 0 && pending && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 overflow-hidden">
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        </form>

        {downloadUrl && <CopyBtn downloadUrl={downloadUrl} />}

        {files.length > 0 && (
          <div className="bg-bg rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Selected Files</h2>
            <div className="space-y-3">
              {files.map((file, index) => (
                <FileCard
                  key={index}
                  file={file}
                  removeFile={removeFile}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

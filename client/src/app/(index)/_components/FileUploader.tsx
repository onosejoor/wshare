"use client";

import { useState, useCallback, FormEvent, useTransition } from "react";
import { Upload, CheckCircle } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import FileCard from "./FileCard";
import { checkFileSize } from "./utils";
import { checkStats, CopyBtn, ProgressBar } from "./Comp";
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

  const totalSize = files.reduce((sum, acc) => sum + acc.size, 0);

  const MAX_TOTAL_SIZE = 100 * 1024 * 1024;

  const addUniqueFiles = useCallback(
    (incomingFiles: File[]) => {
      let currentTotalSize = files.reduce((sum, f) => sum + f.size, 0);
      const newFiles: File[] = [];

      for (const file of incomingFiles) {
        if (currentTotalSize + file.size <= MAX_TOTAL_SIZE) {
          if (
            !files.some((p) => p.name === file.name && p.size === file.size)
          ) {
            newFiles.push(file);
            currentTotalSize += file.size;
          }
        } else {
          toast.error(`file ${file.name} was skipped due to total size limit`);
        }
      }
      setFiles((prev) => {
        return [...prev, ...newFiles];
      });
    },
    [MAX_TOTAL_SIZE, files]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (pending) return;
      const droppedFiles = Array.from(e.dataTransfer.files);
      const { files, large } = checkFileSize(droppedFiles);

      if (large) {
        toast.error("Some files exceed the 100MB limit and were skipped.");
      }

      addUniqueFiles(files);
    },
    [pending, addUniqueFiles]
  );

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

  const clearStates = () => {
    setFiles([]);
    setUploadProgress(0);
    return;
  };

  const uploadFiles = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    for (const file of files) {
      formData.append("file", file);
    }

    startTransition(async () => {
      const interval = setInterval(() => {
        setUploadProgress((prev) => (prev === 90 ? prev : prev + 5));
      }, 2000);
      try {
        const { data } = await axios.post<AxiosProps>("/api/file", formData);

        const { success, message, key, fileName } = data;
        const option = success ? "success" : "error";
        toast[option](message);

        if (success) {
          const url = `${window.location.href}/f/${key!}`;

          clearStates();
          setDownloadUrl(url);
          setItem({ key: key!, fileName });
        }
        clearInterval(interval);
      } catch (err) {
        console.log("Error uploading files:", err);

        toast.error(
          `Upload failed: ${
            err instanceof Error ? err.message : "Internal Error"
          }`
        );
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
            {checkStats(pending, files.length, totalSize, uploadProgress)}
          </button>

          {uploadProgress > 0 && pending && (
            <ProgressBar width={uploadProgress} />
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

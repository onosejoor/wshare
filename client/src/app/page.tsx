"use client";

import { useState, useCallback, FormEvent } from "react";
import { Upload, X, FileIcon, CheckCircle } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();

    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    for (const file of files) {
      formData.append("file", file);
    }

    const sendData = await axios.post<{ success: boolean; message: string }>(
      "http://localhost:8080/file",
      formData
    );

    const response = sendData.data;

    const { success, message } = response;
    const option = success ? "success" : "error";

    toast[option](message);

    console.log("Uploading files:", response);
  };

  return (
    <div className=" text-foreground p-8">
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
          <div
            className={`border-2 border-dashed rounded-lg py-10 bg-primary/10 p-8 mb-6 transition-all duration-200 border-secondary`}
          >
            <label htmlFor="file_input" className="text-center">
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
                    hidden
                    onChange={handleFileInput}
                  />
                </span>
              </p>
              <p className="text-muted text-sm">
                Upload any type of file (max 100MB)
              </p>
            </label>
          </div>
          <button
            disabled={files.length === 0}
            className="mt-6 w-full bg-primary text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 hover:opacity-90 "
          >
            <CheckCircle size={20} />
            <span>
              Upload {files.length} file{files.length !== 1 ? "s" : ""}
            </span>
          </button>
        </form>

        {files.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
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

const FileCard = ({
  file,
  removeFile,
  index,
}: {
  file: File;
  removeFile: (idx: number) => void;
  index: number;
}) => (
  <div className="file-item flex items-start animate-in justify-between bg-neutral  bg-opacity-20 p-3 rounded-lg">
    <div className="flex items-start space-x-3">
      <FileIcon className="text-secondary" />
      <div>
        <p className="font-medium line-clamp-2 w-fit">{file.name}</p>
        <p className="text-sm text-muted">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>
    </div>
    <button
      onClick={() => removeFile(index)}
      className="text-muted hover:text-foreground transition-colors"
    >
      <X size={20} />
    </button>
  </div>
);

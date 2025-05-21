# **WShare: Secure & Seamless File Sharing 🚀**

Effortlessly share files with anyone, anywhere! WShare offers a simple, secure, and modern solution for all your file-sharing needs. ✨

## 🛠️ Installation

Get started with WShare in just a few steps!

- ⬇️ **Clone the Repository:**

  ```bash
  git clone https://github.com/onosejoor/wshare.git
  ```

- 🧭 **Navigate to the Project Directories:**

  ```bash
  cd wshare/client
  ```

  ```bash
  cd wshare/server
  ```

- 📦 **Install Dependencies (Client):**

  ```bash
  cd client
  npm install
  ```

- ⚙️ **Configure Environment Variables (Server):**

  - Create a `.env` file in the `server` directory.
  - Add your Backblaze B2 API keys:
    ```
    B2_APPKEY=your_app_key
    B2_KEYID=your_key_id
    ```

- 🚀 **Run the Application (Client):**

  ```bash
  npm run dev
  ```

- 🏃 **Run the Application (Server):**
  ```bash
  cd server
  go run main.go
  ```

## 💡 Usage

### Uploading Files

1.  Open the client application in your browser.
2.  Drag and drop files into the designated area, or click to browse your local files.
3.  Click the upload button.
4.  A toast notification will let you know the file has been succesfully uploaded.

### Example

Upload a file to B2 cloud storage:

```tsx
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
```

## ✨ Features

- 📤 **Easy Uploads:** Drag and drop files or select them from your computer.
- 🔒 **Secure Storage:** Your files are stored securely in the cloud.
- ⚡ **Fast Transfers:** Enjoy quick and reliable file transfers.
- 🔗 **Shareable Links:** Generate shareable links for your files.

## 💻 Technologies Used

| Technology   | Description                            | Link                                                           |
| :----------- | :------------------------------------- | :------------------------------------------------------------- |
| Next.js      | React framework for building fast apps | [https://nextjs.org/](https://nextjs.org/)                     |
| Tailwind CSS | Utility-first CSS framework            | [https://tailwindcss.com/](https://tailwindcss.com/)           |
| Go           | Programming Language                   | [https://go.dev/](https://go.dev/)                             |
| Gin Gonic    | Web framework for Go                   | [https://gin-gonic.com/](https://gin-gonic.com/)               |
| Backblaze B2 | Cloud storage platform                 | [https://www.backblaze.com/b2/](https://www.backblaze.com/b2/) |

## 🤝 Contributing

We welcome contributions to WShare! 🎉

- 🐛 **Report Bugs:** Submit detailed bug reports to help us improve.
- 🛠️ **Suggest Features:** Propose new features and enhancements.
- 💻 **Submit Pull Requests:** Contribute code changes to address issues or add new functionality.

## 📜 License

This project is licensed under the [MIT License](LICENSE).

## 👨‍💻 Author Info

- **Onosetale Ojo**:
  - [GitHub](https://github.com/onosejoor)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)

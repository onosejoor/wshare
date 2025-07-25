# WShare: Effortless File Sharing 🚀

WShare is a robust and intuitive platform designed for seamless file sharing. Built with a powerful Go backend for rapid file processing and a dynamic Next.js frontend for a smooth user experience, WShare offers secure uploads, generates shareable links, and provides efficient file management. Say goodbye to cumbersome transfers and hello to effortless sharing! ✨

## ⚙️ Installation

To get WShare up and running on your local machine, follow these steps:

### 📥 Clone the Repository

First, clone the project repository from GitHub:

```bash
git clone https://github.com/onosejoor/wshare.git
cd wshare
```

### 🔐 Environment Variables

WShare requires a few environment variables for its backend to function correctly. Create a `.env` file in the `server` directory and populate it with your Backblaze B2 credentials and the desired origin for cron jobs:

```
# server/.env
B2_APPKEY="your_backblaze_application_key"
B2_KEYID="your_backblaze_key_id"
PORT="8080" # Or any port you prefer
ORIGIN="http://localhost:3000" # Set to your frontend URL
```

### 🚀 Backend Setup (Go)

Navigate to the `server` directory, download dependencies, and build the application:

```bash
cd server
go mod download
go build -o main ./main.go
./main
```

The Go server should now be running on the port specified in your `.env` file (default is `8080`).

### 📦 Frontend Setup (Next.js)

Open a new terminal, navigate to the `client` directory, install the necessary dependencies, and start the development server:

```bash
cd client
npm install # Or use yarn install / pnpm install
npm run dev
```

The Next.js frontend will typically start on `http://localhost:3000`.

## 💻 Usage

Once both the backend and frontend are running, you can start using WShare:

1.  **Access the Application**: Open your web browser and navigate to the frontend URL (e.g., `http://localhost:3000`).
2.  **Upload Files**:
    *   You'll see a prominent drag-and-drop area on the homepage.
    *   Drag one or more files into this area, or click the "browse" link to select files from your system.
    *   WShare supports uploading single files or multiple files (which will be automatically archived into a ZIP file on the server).
    *   There's a 100MB per-file limit, and a 100MB total size limit for multiple files.
3.  **Monitor Upload Progress**: After selecting files, click the "Upload" button. You'll see a progress bar indicating the upload status.
4.  **Get Shareable Links**: Upon successful upload, a unique shareable URL will be generated and displayed. Click the copy icon next to the URL to save it to your clipboard.
5.  **Download Files**: Share the generated URL with anyone. When accessed, the page will display the file name and a download button. Clicking the "Download File" button will initiate the download.
6.  **View Recent Uploads**: Scroll down the homepage to see your "Recent Uploads". This section displays files you've recently uploaded from your current browser session.
7.  **Delete Uploaded Files**: From the "Recent Uploads" section, you can click the trash icon next to a file to delete it from storage, along with its entry in your history.

## ✨ Features

*   **Instant File Sharing**: Effortlessly upload and share files with anyone via unique, direct links.
*   **Secure Cloud Storage**: Files are securely stored using Backblaze B2, ensuring reliability and data integrity.
*   **Multiple File Uploads**: Upload several files at once, which the backend automatically zips for convenience.
*   **Client-Side Upload History**: Keep track of your recent uploads directly in your browser's IndexedDB.
*   **Effortless File Deletion**: Easily remove uploaded files and their associated links directly from the frontend interface.
*   **Responsive User Interface**: Enjoy a seamless experience across various devices thanks to a modern, responsive design.
*   **Light & Dark Mode**: Switch between light and dark themes for a comfortable viewing experience.

## 🛠️ Technologies Used

WShare leverages a powerful combination of modern technologies to deliver a fast and reliable file-sharing experience.

| Category   | Technology   | Description                                            |
| :--------- | :----------- | :----------------------------------------------------- |
| **Backend**  | [Go](https://go.dev/)          | High-performance, concurrent programming language      |
|            | [Gin Web Framework](https://gin-gonic.com/) | HTTP web framework for Go, known for its performance   |
|            | [Backblaze B2](https://www.backblaze.com/b2/cloud-storage.html) | Cloud storage for robust and scalable file handling    |
|            | [Supabase](https://supabase.com/)  | Open-source Firebase alternative for database management |
| **Frontend** | [Next.js](https://nextjs.org/)     | React framework for production-grade web applications  |
|            | [React](https://react.dev/)        | JavaScript library for building user interfaces        |
|            | [TypeScript](https://www.typescriptlang.org/) | Strongly typed JavaScript for enhanced development     |
|            | [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework for rapid UI development   |
|            | [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) | Client-side database for storing recent upload history |
| **Deployment** | [Docker](https://www.docker.com/) | Containerization platform for consistent environments  |

## 👋 Contributing

I welcome contributions to WShare! If you're interested in improving the project, please follow these guidelines:

*   🍴 **Fork the repository**: Start by forking the `wshare` repository to your GitHub account.
*   🌲 **Clone your fork**: Clone your forked repository to your local machine.
*   🌿 **Create a new branch**: For each new feature or bug fix, create a dedicated branch (e.g., `feature/add-dark-mode` or `fix/upload-bug`).
*   📝 **Make your changes**: Implement your changes, ensuring code quality and adherence to existing patterns.
*   ✅ **Test your changes**: Thoroughly test your modifications to prevent introducing new issues.
*   ⬆️ **Commit your changes**: Write clear and descriptive commit messages.
*   📬 **Push to your branch**: Push your local branch to your forked repository on GitHub.
*   🤝 **Create a Pull Request**: Open a pull request against the `main` branch of the original `wshare` repository. Describe your changes and the problem they solve.

## 📄 License

This project is currently not licensed.

## 🧑‍💻 Author Info

**Onos**
*   Twitter: [Your Twitter Handle](https://twitter.com/DevText16)

---

[![GitHub Stars](https://img.shields.io/github/stars/onosejoor/wshare?style=for-the-badge&color=FED049)](https://github.com/onosejoor/wshare/stargazers)
[![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://go.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Backblaze B2](https://img.shields.io/badge/Backblaze%20B2-1B1B1B?style=for-the-badge&logo=backblaze&logoColor=white)](https://www.backblaze.com/b2/cloud-storage.html)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)
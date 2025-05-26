import Features from "./_components/About";
import FileUploader from "./_components/FileUploader";
import RecentUploads from "./_components/RecentUploads";

export default function Home() {
  return (
    <>
      <FileUploader />
      <Features />
      <RecentUploads />
    </>
  );
}

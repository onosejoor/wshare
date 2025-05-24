import RecentUploadsWrapper from "../_components/RecentWrapper";
import Features from "./_components/About";
import FileUploader from "./_components/FileUploader";

export default function Home() {
  return (
    <>
      <FileUploader />
      <Features />
      <RecentUploadsWrapper />
    </>
  );
}

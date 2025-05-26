import { notFound } from "next/navigation";
import DownloadCard from "./_components/DownloadCard";

type Params = {
  params: Promise<{ key: string }>;
};

export default async function DownloadPage({ params }: Params) {
  const key = (await params).key;
  const SERVER_URL = process.env.SERVER_URL!;

  const apiUrl = `${SERVER_URL}/file/${key}`;

  const getFileUrl = await fetch(apiUrl);
  if (!getFileUrl.ok && getFileUrl.status === 404) {
    return notFound();
  }

  const res = (await getFileUrl.json()) as {
    fileName: string;
    url: string;
  };

  return <DownloadCard data={res} />;
}

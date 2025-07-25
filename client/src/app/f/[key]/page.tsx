import { notFound } from "next/navigation";
import DownloadCard from "./_components/DownloadCard";
import { fetchFileUrl } from "@/lib/actions/getFile";

type Params = {
  params: Promise<{ key: string }>;
};

export default async function DownloadPage({ params }: Params) {
  const key = (await params).key;

  const { code, data } = await fetchFileUrl(key);

  if (code === 404) {
    notFound();
  }

  return <DownloadCard data={data!} />;
}

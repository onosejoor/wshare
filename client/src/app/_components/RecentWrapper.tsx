"use client";

import dynamic from "next/dynamic";

const RecentUploads = dynamic(() => import("../(index)/_components/RecentUploads"), {
  ssr: false,
});

export default function RecentUploadsWrapper() {
  return <RecentUploads />;
}

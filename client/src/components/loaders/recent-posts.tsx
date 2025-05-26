import Skeleton from "./Skeleton";

export default function RecentUploadsLoader() {
  return (
    <div className="space-y-5 sm:px-10 px-5">
      <h4 className="font-medium text-accent">Recent Uploads</h4>
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="bg-bg p-6 rounded-xl min-w-sm space-y-3 shadow-sm border w-fit border-neutral/20 dark:border-accent/20"
          >
            <Skeleton className="size-12" />

            <Skeleton />
            <Skeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

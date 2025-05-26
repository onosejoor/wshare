import { cx } from "@/lib/utils";
import { HTMLAttributes } from "react";

/** w-full h-5 bg-gray-400 rounded-full animate-pulse
 */
export default function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cx(
        "w-full h-5 bg-gray-400 rounded-full animate-pulse",
        className
      )}
    ></div>
  );
}

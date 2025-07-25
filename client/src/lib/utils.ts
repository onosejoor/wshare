import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cx(...args: ClassValue[]) {
  return twMerge(clsx(...args));
}

export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL!;
export const BACKUP_SERVER_URL = process.env.NEXT_PUBLIC_BACKUP_SERVER_URL!;

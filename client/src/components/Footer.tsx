import Link from "next/link";
import Img from "./Img";
import ThemeSwtich from "./theme-switch";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-neutral bg-background py-2 sm:px-10 px-5">
      <div>
        <div className="flex justify-between items-center">
          <div className="flex sm:flex-row flex-col space-x-3 sm:gap-5 sm:items-center">
            <Link href={"/"}>
              <Img
                src={"/images/logo.svg"}
                alt="logo"
                className="h-12.5 w-25 dark:invert object-cover "
              />
            </Link>

            <p className="text-muted mb-4 md:mb-0">
              © {new Date().getFullYear()}{" "}
              <span className="font-medium">WShare.</span> All rights reserved.
            </p>
          </div>

          <ThemeSwtich />
        </div>
      </div>
    </footer>
  );
}

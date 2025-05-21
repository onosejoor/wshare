import { GitBranch } from "lucide-react";
import Img from "./Img";

export default function Nav() {
  return (
    <nav className="px-4 py-2 sm:px-10 flex gap-5 justify-between border-b border-neutral bg-white items-center">
      <div className="flex gap-2.5 items-center">
        <Img
          src={"/images/logo.svg"}
          alt="logo"
          className="size-12.5 object-cover"
        />

        <span className="font-medium"> WShare</span>
      </div>

      {/* <button className="px-4 py-2.5 rounded-md bg-secondary text-white">Get Started</button> */}
      <GitBranch className="text-primary size-5" />
    </nav>
  );
}

import Img from "./Img";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-neutral bg-background py-2 sm:px-10 px-5">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex gap-5 items-center">
            <Img
              src={"/images/logo.svg"}
              alt="logo"
              className="size-12.5 object-cover "
            />

            <p className="text-muted mb-4 md:mb-0">
              © {new Date().getFullYear()}{" "}
              <span className="font-medium">WShare.</span> All rights reserved.
            </p>
          </div>

          <div className="flex gap-6">
            <a
              href="#"
              className="text-muted hover:text-foreground transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-muted hover:text-foreground transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-muted hover:text-foreground transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

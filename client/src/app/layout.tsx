import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WShare - Effortless File Sharing",
  description:
    "WShare is a modern, secure, and intuitive platform for seamless file sharing. Easily upload, manage, and share your files with protected links and lightning-fast speed.",
  openGraph: {
    title: "WShare - Effortless File Sharing",
    description:
      "Drag & drop uploads, secure links, and fast file transfers – all in one modern platform. Try WShare today.",
    url: "https://wshare.example.com",
    siteName: "WShare",
    // images: [
    //   {
    //     url: "https://wshare.example.com/og-image.png", // replace with your actual OG image
    //     width: 1200,
    //     height: 630,
    //     alt: "WShare - Secure and Fast File Sharing",
    //   },
    // ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WShare - Effortless File Sharing",
    description:
      "Experience modern file sharing with drag & drop uploads, protected links, and blazing speed.",
    site: "@DevText16",
    creator: "@DevText16",
    // images: ["https://wshare.example.com/og-image.png"], // same image
  },
  keywords: [
    "file sharing",
    "secure file upload",
    "fast file transfer",
    "drag and drop upload",
    "Next.js file uploader",
    "WShare app",
  ],
  authors: [{ name: "Onos", url: "https://github.com/onosejoor" }],
  creator: "Onos",
  publisher: "WShare",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} font-sans bg-background antialiased`}
      >
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: { backgroundColor: "var(--color-primary)", color: "white" },
          }}
        />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "PractoClone — Book doctor appointments online",
  description:
    "Search verified doctors, book in-clinic or video appointments, read health articles and subscribe to premium care plans.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0284c7",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="app-bg min-h-screen text-slate-800 antialiased">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

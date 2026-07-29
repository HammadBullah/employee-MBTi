import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "tandem° — Work has a personality",
  description:
    "A playful, ethical work-personality universe for understanding your vibe, finding your people, and collaborating better.",
  applicationName: "tandem°",
  keywords: [
    "work personality",
    "team collaboration",
    "employee experience",
    "ethical team insights",
  ],
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

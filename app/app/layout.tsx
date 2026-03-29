import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "BLVE Console",
  description: "Admin console for BLVE",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
}

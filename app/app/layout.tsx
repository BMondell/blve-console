import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "BLVΞ Command Center",
  description: "BLVΞ Routing + Attribution Engine",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body
        className="bg-[#0B0E11] text-white antialiased"
        style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}

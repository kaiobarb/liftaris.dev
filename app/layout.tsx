import { Spectral } from "next/font/google";
import "../styles/output.css";
import type { Metadata } from "next";

const spectral = Spectral({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-spectral",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KAIO",
  description: "Starter for a blog with Next.js.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={spectral.variable}>
      <body className={spectral.className}>{children}</body>
    </html>
  );
}

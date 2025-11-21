import type { Metadata } from "next";
import { Karla, Geist_Mono } from "next/font/google";
import "./globals.css";

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neuraguard Dashboard",
  description: "Advanced Digital Protection Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${karla.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

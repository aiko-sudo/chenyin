import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "光伏板积尘监测与告警系统",
  description: "基于物联网的光伏板积尘实时监测平台，提供高精度积尘识别与智能告警功能",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}

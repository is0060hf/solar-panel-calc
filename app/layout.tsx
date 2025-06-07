import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "太陽光発電・蓄電池キャッシュフロー分析システム",
  description: "住宅用太陽光発電システムと蓄電池の50年間の詳細なキャッシュフロー分析と投資回収シミュレーション",
  keywords: "太陽光発電, 蓄電池, キャッシュフロー, シミュレーション, 投資回収, NPV, IRR",
  authors: [{ name: "Solar Panel Calculator" }],
  openGraph: {
    title: "太陽光発電・蓄電池キャッシュフロー分析システム",
    description: "50年間の詳細なキャッシュフロー分析と投資回収シミュレーション",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

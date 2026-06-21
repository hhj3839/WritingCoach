import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 글코치",
  description: "초등학생을 위한 질문형 글쓰기 코칭 앱"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

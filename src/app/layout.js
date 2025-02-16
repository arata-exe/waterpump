import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// เปลี่ยนชื่อใน metadata ให้เป็นชื่อที่ต้องการ
export const metadata = {
  title: "Water Pump Dashboard",  // เปลี่ยนจาก "Create Next App" เป็นชื่อใหม่ที่ต้องการ
  description: "Dashboard for controlling water pump",  // เปลี่ยน description ได้ตามต้องการ
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SmartHalal – Cek Status Kehalalan Bahan Pangan",
  description:
    "Platform edukasi halal untuk memverifikasi status kehalalan zat tambahan pangan, E-Number, dan komposisi produk secara cepat dan akurat.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={inter.className}>
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <Navbar />
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

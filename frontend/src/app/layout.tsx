import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ModalProvider from "@/contexts/ModalContext";
import {ReactNode} from "react";
import {Metadata} from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stechuhr",
  description: "DHBW TINF25B5 How2CenterADiv Webengineering Projekt",
  icons: "/clock.svg"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ModalProvider>
          {children}
        </ModalProvider>
      </body>
    </html>
  );
}

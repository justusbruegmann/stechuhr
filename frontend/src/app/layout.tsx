import "./globals.css";
import ModalProvider from "@/contexts/ModalContext";
import {ReactNode} from "react";
import {Metadata} from "next";

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
    <html lang="en" suppressHydrationWarning>
      <body style={{ background: '#e6ebf580'}}>
        <ModalProvider>
          {children}
        </ModalProvider>
      </body>
    </html>
  );
}

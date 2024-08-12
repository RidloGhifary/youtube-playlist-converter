import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

import ToasterProvider from "@/providers/Toaster";
import Footer from "@/components/Footer";

const font = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Playlist Converter",
  description:
    "A web application that allows you to convert a playlist from YouTube to Spotify.",
  keywords: "playlist, converter, spotify, youtube, music",
  authors: [{ name: "Ridlo achmad ghifary" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className} bg-stone-950 text-white`}>
        <ToasterProvider />
        {children}
        <Footer />
      </body>
    </html>
  );
}

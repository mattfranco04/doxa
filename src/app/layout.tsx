import "@/styles/globals.css";

import { type Metadata } from "next";
import { Karla, Gasoek_One } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: "doxa",
  description: "Sing to the Lord a new song",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
});

const gasoekOne = Gasoek_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-gasoek-one",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${karla.variable} ${gasoekOne.variable}`}>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}

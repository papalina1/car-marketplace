import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Premium Cars Korea",
  description: "Importim veturash nga Korea e Jugut",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sq">
      <body>{children}</body>
    </html>
  );
}
import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "CKJS Finance — Multi-Project Cashflow",
  description: "Sistem cashflow dan pengelolaan keuangan multi-project untuk CV. Cipta Karya Jaya Sentosa.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "CKJS Finance",
    description: "Multi-Project Cashflow & Financial Management",
    images: [{ url: "/og.png", width: 1680, height: 945, alt: "CKJS Finance dashboard" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CKJS Finance",
    description: "Multi-Project Cashflow & Financial Management",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}

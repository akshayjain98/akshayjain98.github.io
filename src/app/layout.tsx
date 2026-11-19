import { Metadata } from "next";
import { getProfile } from "@/lib/content";
import localFont from "next/font/local";
import "./globals.css";


const poppins = localFont({
  src: [
    {
      path: "./fonts/poppins/Poppins-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/poppins/Poppins-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/poppins/Poppins-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/poppins/Poppins-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "./fonts/poppins/Poppins-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/poppins/Poppins-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/poppins/Poppins-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/poppins/Poppins-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/poppins/Poppins-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-poppins",
});

export function generateMetadata(): Metadata {
  const { firstName, lastName, title, headline, summary, siteUrl } = getProfile();
  const name = `${firstName} ${lastName}`;
  const fullTitle = `${name} · ${title}`;
  return {
    // Set "siteUrl" in content/profile.json (or NEXT_PUBLIC_SITE_URL) so link previews use absolute URLs.
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || siteUrl || 'http://localhost:3000'),
    title: { default: fullTitle, template: `%s · ${name}` },
    description: `${title} (${headline}). ${summary}`,
    authors: [{ name }],
    openGraph: { type: 'profile', title: fullTitle, description: summary, firstName, lastName },
    twitter: { card: 'summary_large_image', title: fullTitle, description: summary },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

import { Metadata } from "next";
import { getProfile } from "@/lib/content";
import "./globals.css";


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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

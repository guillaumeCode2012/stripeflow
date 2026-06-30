import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://stripeflow-mcp.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "StripeFlow — The most complete MCP server for Stripe",
    template: "%s | StripeFlow",
  },
  description:
    "StripeFlow is the most complete open-source MCP server for Stripe. 79 tools, 19 categories, one command. Manage customers, subscriptions, invoices, and analytics with natural language. Works with Claude, Cursor, Windsurf.",
  keywords: [
    "StripeFlow",
    "stripeflow mcp",
    "Stripe MCP server",
    "MCP server Stripe",
    "Model Context Protocol Stripe",
    "Stripe AI agent",
    "Stripe Claude",
    "Stripe Cursor",
    "Stripe Windsurf",
    "MCP",
    "Model Context Protocol",
    "Stripe analytics",
    "Stripe MRR",
    "open source Stripe MCP",
    "StripeFlow",
  ],
  authors: [{ name: "StripeFlow contributors" }],
  creator: "StripeFlow",
  publisher: "StripeFlow",
  applicationName: "StripeFlow",
  generator: "Next.js",
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icon.png",
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "StripeFlow — The most complete MCP server for Stripe",
    description:
      "79 tools. 19 categories. One command. Manage your entire Stripe account with natural language. Works with Claude, Cursor, Windsurf.",
    url: SITE_URL,
    siteName: "StripeFlow",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StripeFlow — The most complete MCP server for Stripe",
    description:
      "79 tools. 19 categories. One command. Manage your entire Stripe account with natural language. Works with Claude, Cursor, Windsurf.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "StripeFlow",
  description:
    "The most complete open-source MCP server for Stripe. Manage customers, subscriptions, invoices, and analytics with natural language.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "macOS, Windows, Linux",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  url: SITE_URL,
  author: {
    "@type": "Organization",
    name: "StripeFlow",
    url: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}

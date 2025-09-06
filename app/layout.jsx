import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./phone-input-custom.css";
import AuthProvider from "@/components/auth-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Nirmaya Pravasi - Healthcare Management for Migrant Workers | Government of Kerala",
  description: "Comprehensive healthcare management system for migrant workers in Kerala. Electronic health records, appointment scheduling, multilingual support. Government of Kerala initiative for accessible healthcare.",
  keywords: [
    "Nirmaya Pravasi",
    "Kerala healthcare",
    "migrant workers healthcare",
    "electronic health records",
    "appointment scheduling",
    "multilingual healthcare",
    "Government of Kerala",
    "healthcare management",
    "patient records",
    "medical appointments",
    "healthcare accessibility",
    "Kerala government initiative"
  ],
  authors: [{ name: "Government of Kerala" }],
  creator: "Government of Kerala",
  publisher: "Nirmaya Pravasi",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://niramaya-pravasi.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Nirmaya Pravasi - Healthcare Management for Migrant Workers",
    description: "Comprehensive healthcare management system for migrant workers in Kerala. Electronic health records, appointment scheduling, multilingual support.",
    url: 'https://niramaya-pravasi.vercel.app',
    siteName: 'Nirmaya Pravasi',
    images: [
      {
        url: '/nirmaya-pravasi-logo.png',
        width: 1200,
        height: 630,
        alt: 'Nirmaya Pravasi - Government of Kerala Healthcare Initiative',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Nirmaya Pravasi - Healthcare Management for Migrant Workers",
    description: "Comprehensive healthcare management system for migrant workers in Kerala. Government of Kerala initiative.",
    images: ['/nirmaya-pravasi-logo.png'],
    creator: '@KeralaGov',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'healthcare',
  classification: 'Government Healthcare Initiative',
  other: {
    'application-name': 'Nirmaya Pravasi',
    'msapplication-TileColor': '#2563eb',
    'theme-color': '#2563eb',
  },
};

export default function RootLayout({ children }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Nirmaya Pravasi",
    "description": "Comprehensive healthcare management system for migrant workers in Kerala",
    "url": "https://niramaya-pravasi.vercel.app",
    "publisher": {
      "@type": "Organization",
      "name": "Government of Kerala",
      "url": "https://kerala.gov.in"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://niramaya-pravasi.vercel.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "mainEntity": {
      "@type": "MedicalOrganization",
      "name": "Nirmaya Pravasi Healthcare System",
      "description": "Healthcare management system for migrant workers in Kerala",
      "url": "https://niramaya-pravasi.vercel.app",
      "sameAs": [
        "https://niramaya-pravasi.vercel.app/doctor/login",
        "https://niramaya-pravasi.vercel.app/admin/login"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Thiruvananthapuram",
        "addressRegion": "Kerala",
        "addressCountry": "IN"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "1800-XXX-XXXX",
        "contactType": "customer service",
        "availableLanguage": ["English", "Malayalam", "Hindi", "Bengali", "Tamil"]
      }
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/nirmaya-pravasi-logo.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Nirmaya Pravasi" />
        <meta name="application-name" content="Nirmaya Pravasi" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}

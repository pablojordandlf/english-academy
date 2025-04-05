import { Toaster } from "sonner";
import type { Metadata, Viewport } from "next";
import { Mona_Sans } from "next/font/google";
import CookieConsent from "@/components/CookieConsent";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { NotificationPrompt } from '@/components/NotificationPrompt';

import "./globals.css";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://hi-gabby.vercel.app'),
  title: {
    default: "Gabby - Tu Profesor de Inglés con IA",
    template: "%s | Gabby"
  },
  description: "Plataforma de aprendizaje de inglés con tutores de IA para estudiantes y profesionales. Practica inglés conversacional con un profesor virtual inteligente.",
  keywords: [
    "inglés",
    "aprendizaje de inglés",
    "profesor de inglés",
    "IA",
    "inteligencia artificial",
    "tutor virtual",
    "práctica de inglés",
    "clases de inglés",
    "inglés conversacional",
    "educación online"
  ],
  authors: [{ name: "Gabby Team" }],
  creator: "Gabby",
  publisher: "Gabby",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/gabby_2.png", sizes: "32x32", type: "image/png" },
      { url: "/gabby_2.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/gabby_2.png",
    apple: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://hi-gabby.vercel.app",
    siteName: "Gabby",
    title: "Gabby - Tu Profesor de Inglés con IA",
    description: "Plataforma de aprendizaje de inglés con tutores de IA para estudiantes y profesionales. Practica inglés conversacional con un profesor virtual inteligente.",
    images: [
      {
        url: "/gabby_2.png",
        width: 1200,
        height: 630,
        alt: "Gabby - Plataforma de aprendizaje de inglés con IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gabby - Tu Profesor de Inglés con IA",
    description: "Plataforma de aprendizaje de inglés con tutores de IA para estudiantes y profesionales. Practica inglés conversacional con un profesor virtual inteligente.",
    images: ["/gabby_2.png"],
    creator: "@Gabby",
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
    //google: "tu-codigo-de-verificacion-google",
    //yandex: "tu-codigo-de-verificacion-yandex",
  },
  alternates: {
    canonical: "https://hi-gabby.vercel.app",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Gabby",
  },
};

export const viewport: Viewport = {
  themeColor: "#111827",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <meta name="application-name" content="Gabby" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Gabby" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="shortcut icon" href="/gabby_2.png" />
        <link rel="canonical" href="https://hi-gabby.vercel.app" />
      </head>
      <body className={`${monaSans.className} antialiased pattern`}>
        {children}
        <Toaster />
        <CookieConsent />
        <GoogleAnalytics />
        <NotificationPrompt />
      </body>
    </html>
  );
}

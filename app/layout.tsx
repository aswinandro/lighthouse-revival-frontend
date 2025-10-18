import type React from "react"
import type { Metadata } from "next"
import { Geist, Manrope } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/providers/language-provider"
import { Navigation } from "@/components/layout/navigation"
import { Footer } from "@/components/layout/footer"
import { ChurchProvider } from "@/components/providers/church-context"

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
})

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
})

// TODO: Replace with your actual production URL
const siteUrl = "https://www.lighthouserevivalchurch.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Lighthouse Revival Church International | Abu Dhabi - Voices of Many Nations",
    template: `%s | Lighthouse Revival Church`,
  },
  description:
    "Join Lighthouse Revival Church in Abu Dhabi for worship services in English, Tamil, Hindi, and Malayalam. A welcoming Christian community for all.",
  keywords: [
    "church in abu dhabi",
    "christian fellowship abu dhabi",
    "lighthouse revival church",
    "english service",
    "tamil service",
    "hindi service",
    "malayalam service",
    "pentecostal church abu dhabi",
  ],
  authors: [{ name: "Aswin Andro", url: "https://github.com/aswin-andro" }],
  creator: "Aswin Andro",
  publisher: "Lighthouse Revival Church",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Lighthouse Revival Church International | Abu Dhabi",
    description:
      "Join our multi-lingual services in Abu Dhabi. We offer worship in English, Tamil, Hindi, and Malayalam.",
    url: siteUrl,
    siteName: "Lighthouse Revival Church International",
    // TODO: Replace with a URL to a high-quality image for social sharing (e.g., 1200x630px)
    images: [
      {
        url: `${siteUrl}/pastor.png`,
        width: 1200,
        height: 630,
        alt: "Lighthouse Revival Church International",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lighthouse Revival Church International | Abu Dhabi",
    description:
      "Join our multi-lingual services in Abu Dhabi. We offer worship in English, Malayalam, Tamil, Hindi, and Urdu",
    // TODO: Replace with a URL to a high-quality image for Twitter cards (e.g., 1200x630px)
    images: [`${siteUrl}/twitter-image.png`],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteUrl}/site.webmanifest`,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Structured Data for SEO (JSON-LD)
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Church",
      name: "Lighthouse Revival Church International",
      url: siteUrl,
      // TODO: Replace with a URL to your church's logo (e.g., a square PNG or SVG)
      logo: `${siteUrl}/logo.png`,
      // TODO: Replace with your church's main contact number
      telephone: "+971-50-987-6543",
      address: {
        "@type": "PostalAddress",
        // TODO: Replace with your church's actual address
        streetAddress: "9G79+GJM - Musaffah - Musaffah Industrial",
        addressLocality: "Abu Dhabi",
        addressCountry: "AE",
      },
      // TODO: Add URLs to your official social media profiles
      sameAs: [
        "https://www.facebook.com/lighthouserevivalabudhabi",
        "https://www.youtube.com/c/LIGHTHOUSEREVIVALCHURCH",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      url: siteUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ]


  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${manrope.variable} antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${geist.className} flex flex-col min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <ChurchProvider>
              <main className="flex-grow">{children}</main>
            </ChurchProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

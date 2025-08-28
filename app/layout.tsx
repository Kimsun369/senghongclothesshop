import type React from "react"
import type { Metadata } from "next"
import { Inter, Dancing_Script } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
})

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dancing-script",
  weight: ["400", "600", "700"],
})

export const metadata: Metadata = {
  title: "RedBox Restaurant - Delicious Food & Dining",
  description:
    "Experience authentic flavors at RedBox Restaurant. From main courses to snacks and fresh salads, we serve quality food with exceptional taste.",
  keywords: "restaurant, food, dining, main course, snacks, salad, seafood, RedBox Restaurant, authentic cuisine",
  authors: [{ name: "RedBox Restaurant" }],
  creator: "RedBox Restaurant",
  publisher: "RedBox Restaurant",
  openGraph: {
    title: "RedBox Restaurant - Delicious Food & Dining",
    description: "Experience authentic flavors at RedBox Restaurant with our diverse menu.",
    type: "website",
    locale: "en_US",
    siteName: "RedBox Restaurant",
  },
  twitter: {
    card: "summary_large_image",
    title: "RedBox Restaurant - Delicious Food & Dining",
    description: "Experience authentic flavors at RedBox Restaurant with our diverse menu.",
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} ${dancingScript.variable} antialiased`}>{children}</body>
    </html>
  )
}

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Store Finder",
  description: "Find stores near you",
}

// Add suppressHydrationWarning to the body element
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="__className_d65c78" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}



import './globals.css'
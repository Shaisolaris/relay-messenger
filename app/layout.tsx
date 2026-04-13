import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Relay - Messaging',
  description: 'Team messaging and collaboration platform',
  icons: {
    icon: [
      {
        url: '/relay-messenger/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/relay-messenger/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/relay-messenger/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/relay-messenger/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-background">
        {children}
        <Toaster position="bottom-right" richColors />
        
      </body>
    </html>
  )
}

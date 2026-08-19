import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Playfair_Display, EB_Garamond, Newsreader } from 'next/font/google'
import { SmoothScroll } from '@/components/SmoothScroll'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-garamond',
  display: 'swap',
})

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['200'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader-family',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Kim, Yeadam',
  description:
    'The portfolio of Kim, Yeadam — a contemporary painter. Exhibitions, paintings, and selected works.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f6f4f0',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${ebGaramond.variable} ${newsreader.variable} bg-background`}
    >
      <body className="font-serif antialiased">
        <SmoothScroll>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </SmoothScroll>
      </body>
    </html>
  )
}

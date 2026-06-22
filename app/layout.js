import './globals.css'
import { Inter, Syne, Space_Mono } from 'next/font/google'
import Providers from './providers'

// Body / UI — the quiet role.
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
// Display — wordmark, track titles, hero. Characterful, used with restraint.
const syne = Syne({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-display' })
// Mono — timecodes, durations, the millisecond cue point. Content-driven.
const spaceMono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-mono' })

const SITE_URL = process.env.NEXTAUTH_URL || 'https://transitions.ro-hith.com'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Transitions — the moment one song becomes another',
    template: '%s · Transitions',
  },
  description:
    'A curated feed of seamless hand-offs between two songs — discover the moment one song becomes another, or craft your own.',
  applicationName: 'Transitions',
  openGraph: {
    type: 'website',
    siteName: 'Transitions',
    title: 'Transitions — the moment one song becomes another',
    description:
      'A curated feed of seamless hand-offs between two songs. Discover the moment one song becomes another.',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Transitions — the moment one song becomes another',
    description:
      'A curated feed of seamless hand-offs between two songs. Discover the moment one song becomes another.',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${syne.variable} ${spaceMono.variable} ${inter.className}`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

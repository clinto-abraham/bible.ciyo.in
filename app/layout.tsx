import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#060814",
};

export const metadata: Metadata = {
  metadataBase: new URL('https://bible.ciyo.in'),
  title: {
    default: 'Sacred Scriptures | Multi-Language Biblical Codices (ciyo.in)',
    template: '%s | Sacred Scriptures',
  },
  description:
    'Read, listen, and cross-reference the Holy Scriptures across 15 ancient manuscripts and world translations: Westminster Leningrad Codex Hebrew, Textus Receptus Greek, Syriac Aramaic Peshitta, King James Version, Berean Standard Bible, Young\'s Literal Translation, Malayalam Sathyavedapusthakam, Latin Vulgate, German, French, Spanish, Russian, Chinese, Burmese, and Church Slavonic with audio pronunciation and verse bookmarks.',
  keywords: [
    'Bible',
    'Holy Bible',
    'Multi-language Bible',
    'Free Online Bible',
    'Audio Bible',
    'Bible Audio Recitation',
    'Comparative Bible Study',
    'Parallel Bible Translations',
    'Interlinear Bible',
    'Ancient Biblical Manuscripts',
    'Sacred Scriptures',
    'bible.ciyo.in',
    'ciyo.in',
    'Clinto Abraham',
    // Malayalam keywords
    'Malayalam Bible',
    'സത്യവേദപുസ്തകം',
    'മലയാളം ബൈബിൾ',
    'സത്യവേദപുസ്തകം ഓൺലൈൻ',
    'മലയാളം ബൈബിൾ ഓഡിയോ',
    'വേദപുസ്തകം',
    'ക്രിസ്തീയ വേദപുസ്തകം',
    'ഉല്പത്തി മലയാളം',
    'യോഹന്നാൻ മലയാളം',
    'സങ്കീർത്തനങ്ങൾ മലയാളം',
    // Hebrew & Tanakh keywords
    'Hebrew Bible',
    'Westminster Leningrad Codex',
    'WLC Hebrew',
    'Biblical Hebrew Tanakh',
    'Hebrew audio Bible',
    'Tanakh with vowels',
    'תנ״ך',
    'מקרא',
    'תנך עם ניקוד',
    'בראשית',
    // Greek & NT keywords
    'Greek New Testament',
    'Textus Receptus',
    'Stephanus 1550',
    'Scrivener 1894',
    'Koine Greek Bible',
    'Greek Bible audio',
    'Καινή Διαθήκη',
    // Aramaic & Syriac keywords
    'Aramaic Peshitta',
    'Syriac Bible',
    'Syriac Peshitta New Testament',
    'Aramaic Bible audio',
    'ܦܫܝܛܬܐ',
    // English versions
    'King James Version',
    'KJV Bible',
    'Berean Standard Bible',
    'BSB Bible',
    'Young\'s Literal Translation',
    'YLT Bible',
    // World Languages
    'Latin Vulgate',
    'Biblia Sacra Vulgata',
    'Vulgata Latina',
    'Elberfelder Bibel',
    'Deutsche Bibel',
    'Bible Augustin Crampon',
    'Sainte Bible Français',
    'Reina Valera 1909',
    'Biblia en Español',
    'Russian Synodal Bible',
    'Русская Синодальная Библия',
    'Chinese Union Version',
    '圣经和合本',
    'Burmese Judson Bible',
    'Church Slavonic Bible',
    // Features & Study Tools
    'Verse Bookmarks',
    'Text to speech Bible',
    'Side-by-side Scripture comparison',
    'Original Hebrew Greek Aramaic verification'
  ],
  category: 'Religion & Biblical Studies',
  authors: [{ name: 'Clinto Abraham', url: 'https://ciyo.in' }],
  creator: 'Clinto Abraham (care@ciyo.in)',
  publisher: 'ciyo.in',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bible.ciyo.in',
    title: 'Sacred Scriptures | Multi-Language Biblical Codices',
    description:
      'Explore the Holy Bible in 15 ancient & world languages with comparative lexical tools, audio recitation, and bookmark navigation.',
    siteName: 'Sacred Scriptures - ciyo.in',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sacred Scriptures | Multi-Language Biblical Codices',
    description:
      'Explore the Holy Bible in 15 ancient & world languages with comparative lexical tools, audio recitation, and bookmark navigation.',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
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
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-[#060814] text-white selection:bg-sky-500/30 selection:text-white">
        {children}
        <Analytics />
      </body>
    </html>
  );
}


import { notFound } from 'next/navigation';
import { getChapterData } from '@/lib/bible';
import ChapterReader from '@/components/ChapterReader';

export const revalidate = 604800; // Cache on Vercel CDN for 7 days

interface PageProps {
  params: Promise<{
    book: string;
    chapter: string;
  }>;
  searchParams?: Promise<{
    lang?: string;
    verse?: string;
  }>;
}

export function generateStaticParams() {
  return [
    { book: 'genesis', chapter: '1' },
    { book: 'matthew', chapter: '1' },
  ];
}

export async function generateMetadata({ params, searchParams }: PageProps) {
  const { book, chapter } = await params;
  const sParams = searchParams ? await searchParams : {};
  const lang = sParams.lang || 'english';
  const data = await getChapterData(book, chapter, lang);
  if (!data) return { title: 'Chapter Not Found' };
  const native = data.nativeName || data.hebrewName;
  const firstVerseSnippet = data.verses.slice(0, 2).map((v) => `${v.verse}. ${v.text}`).join(' ');
  const pageTitle = `${data.bookName} ${data.chapterNumber}${native ? ` (${native})` : ''} — ${data.translation}`;
  const pageDescription = `Read and listen to ${data.bookName} Chapter ${data.chapterNumber} in ${data.language} (${data.translation}): "${firstVerseSnippet.slice(0, 180)}..." Study with comparative Hebrew, Greek, and Aramaic translations on bible.ciyo.in.`;
  const canonicalUrl = `https://bible.ciyo.in/${data.bookSlug}/${data.chapterNumber}?lang=${lang}`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      `${data.bookName} ${data.chapterNumber}`,
      `${data.bookName} Chapter ${data.chapterNumber}`,
      `${data.bookName} in ${data.language}`,
      native ? `${native} ${data.chapterNumber}` : '',
      native ? `${native} അദ്ധ്യായം ${data.chapterNumber}` : '',
      native ? `${native} ${data.chapterNumber} ഓഡിയോ` : '',
      `${data.bookName} ${data.chapterNumber} audio`,
      `${data.bookName} ${data.chapterNumber} text to speech`,
      data.translation,
      `${data.language} Bible`,
      `${data.language} Bible online`,
      `${data.bookName} ${data.chapterNumber} Hebrew Greek Aramaic parallel`,
      'Comparative Bible Study',
      'Holy Bible',
      'Sacred Scriptures',
      'bible.ciyo.in',
      'ciyo.in',
    ].filter(Boolean),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title: pageTitle,
      description: pageDescription,
      siteName: 'Sacred Scriptures - ciyo.in',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
    },
  };
}

export default async function ChapterPage({ params, searchParams }: PageProps) {
  const { book, chapter } = await params;
  const sParams = searchParams ? await searchParams : {};
  const lang = sParams.lang || 'english';
  const initialVerse = sParams.verse || null;

  const data = await getChapterData(book, chapter, lang);

  if (!data) {
    notFound();
  }

  const isRtl = data.dir === 'rtl';

  // Schema.org JSON-LD Structured Data for Google Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Chapter',
    name: `${data.bookName} Chapter ${data.chapterNumber}`,
    position: data.chapterNumber,
    description: `Chapter ${data.chapterNumber} of ${data.bookName} from the ${data.translation}`,
    inLanguage: data.language,
    isPartOf: {
      '@type': 'Book',
      name: data.bookName,
      alternateName: data.nativeName || undefined,
      inLanguage: data.language,
      isPartOf: {
        '@type': 'CreativeWorkSeries',
        name: 'Sacred Scriptures Holy Bible',
        url: 'https://bible.ciyo.in',
      },
    },
    publisher: {
      '@type': 'Organization',
      name: 'ciyo.in',
      url: 'https://ciyo.in',
    },
  };

  return (
    <main className="max-w-4xl mx-auto py-6 sm:py-12 px-3 sm:px-8">
      {/* Schema.org JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Chapter Title & Heading */}
      <div className="text-center mb-8 sm:mb-12 relative">
        {/* Ciyo style pill tag */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 rounded-full border border-slate-700/60 bg-slate-900/80 shadow-md max-w-full">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse shrink-0"></span>
          <span className="text-[10px] sm:text-[11px] font-sans uppercase tracking-widest font-semibold bg-gradient-to-r from-sky-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent truncate">
            {data.translation}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-editorial-serif font-light tracking-tight text-white mb-2 sm:mb-3 break-words">
          {data.bookName}{' '}
          <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent font-medium">
            {data.chapterNumber}
          </span>
        </h1>

        {data.nativeName && data.nativeName !== data.bookName && (
          <div
            dir={isRtl ? 'rtl' : 'ltr'}
            className={`text-xl sm:text-2xl lg:text-3xl text-slate-400 font-normal tracking-wide mt-1.5 sm:mt-2 break-words ${
              data.language === 'hebrew'
                ? 'font-hebrew'
                : data.language === 'aramaic'
                ? 'font-aramaic'
                : data.language === 'greek'
                ? 'font-greek'
                : data.language === 'malayalam'
                ? 'font-malayalam'
                : data.language === 'chinese'
                ? 'font-chinese'
                : data.language === 'burmese'
                ? 'font-burmese'
                : data.language === 'slavic'
                ? 'font-slavic'
                : 'font-editorial-serif'
            }`}
          >
            {data.nativeName} {data.chapterNumber}
          </div>
        )}

        {/* Gradient divider line */}
        <div className="w-24 h-[2px] bg-gradient-to-r from-blue-500 via-sky-400 to-amber-400 mx-auto mt-6 rounded-full opacity-80"></div>
      </div>

      {/* Interactive Chapter Reader with Verse Highlights, Copy Toolbar & Jump Carousel */}
      <ChapterReader data={data} initialVerse={initialVerse} />
    </main>
  );
}

import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { getChapterData } from '@/lib/bible';
import { PREFERRED_LANG_COOKIE } from '@/lib/preferences';
import ChapterReader from '@/components/ChapterReader';

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
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get(PREFERRED_LANG_COOKIE)?.value;
  const lang = sParams.lang || cookieLang || 'english';
  const data = await getChapterData(book, chapter, lang);
  if (!data) return { title: 'Chapter Not Found' };
  const native = data.nativeName || data.hebrewName;
  return {
    title: `${data.bookName} ${data.chapterNumber}${native ? ` (${native})` : ''} | ${data.translation}`,
    description: `Read ${data.bookName} Chapter ${data.chapterNumber} in ${data.language} from ${data.translation}.`,
  };
}

export default async function ChapterPage({ params, searchParams }: PageProps) {
  const { book, chapter } = await params;
  const sParams = searchParams ? await searchParams : {};
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get(PREFERRED_LANG_COOKIE)?.value;
  const lang = sParams.lang || cookieLang || 'english';
  const initialVerse = sParams.verse || null;

  const data = await getChapterData(book, chapter, lang);

  if (!data) {
    notFound();
  }

  const isRtl = data.dir === 'rtl';

  return (
    <main className="max-w-4xl mx-auto py-12 px-4 sm:px-8">
      {/* Chapter Title & Heading */}
      <div className="text-center mb-12 relative">
        {/* Ciyo style pill tag */}
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-slate-700/60 bg-slate-900/80 shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
          <span className="text-[11px] font-sans uppercase tracking-widest font-semibold bg-gradient-to-r from-sky-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
            {data.translation}
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-editorial-serif font-light tracking-tight text-white mb-3">
          {data.bookName}{' '}
          <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent font-medium">
            {data.chapterNumber}
          </span>
        </h1>

        {data.nativeName && data.nativeName !== data.bookName && (
          <div
            dir={isRtl ? 'rtl' : 'ltr'}
            className={`text-2xl sm:text-3xl text-slate-400 font-normal tracking-wide mt-2 ${
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

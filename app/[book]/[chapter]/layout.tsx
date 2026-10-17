import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { getBooks, getChapterData, getLanguages, slugifyBook } from '@/lib/bible';
import { PREFERRED_LANG_COOKIE } from '@/lib/preferences';
import ChapterNav from '@/components/ChapterNav';
import SiteFooter from '@/components/SiteFooter';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    book: string;
    chapter: string;
  }>;
}

export default async function ChapterLayout({ children, params }: LayoutProps) {
  const { book, chapter } = await params;
  const languages = await getLanguages();
  const currentSlug = slugifyBook(book);
  const chapterNumber = Number.parseInt(chapter, 10) || 1;

  const cookieStore = await cookies();
  const cookieLang = cookieStore.get(PREFERRED_LANG_COOKIE)?.value;
  const defaultLang = cookieLang || 'english';

  const books = await getBooks(defaultLang);
  const chapterData = await getChapterData(currentSlug, chapterNumber, defaultLang);

  return (
    <div className="min-h-screen flex flex-col bg-[#060814] text-white selection:bg-sky-500/30 selection:text-white transition-colors relative">
      {/* Top ambient radial light */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-b from-blue-900/15 via-indigo-950/10 to-transparent pointer-events-none blur-3xl -z-10"
      />

      <Suspense fallback={<div className="h-16 border-b border-slate-800/80 bg-[#060814]/85" />}>
        <ChapterNav
          currentBook={currentSlug}
          currentChapter={chapterNumber}
          currentLang={defaultLang}
          languages={languages}
          books={books.map((b) => ({
            name: b.name,
            slug: b.slug,
            nativeName: b.nativeName || b.hebrewName,
            chapterCount: b.chapterCount,
          }))}
          prevChapter={chapterData?.prevChapter}
          nextChapter={chapterData?.nextChapter}
        />
      </Suspense>

      <div className="flex-1 relative z-10">{children}</div>

      <SiteFooter />
    </div>
  );
}

import { NextRequest, NextResponse } from 'next/server';
import { getVerseDetails } from '@/lib/bible';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const book = searchParams.get('book') || 'genesis';
  const chapter = searchParams.get('chapter') || '1';
  const verse = searchParams.get('verse') || '1';
  const lang = searchParams.get('lang') || 'hebrew';

  try {
    const details = await getVerseDetails(book, chapter, verse, lang);
    if (!details) {
      return NextResponse.json(
        { error: `Verse not found for ${book} ${chapter}:${verse}` },
        { status: 404 }
      );
    }
    return NextResponse.json(details, {
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

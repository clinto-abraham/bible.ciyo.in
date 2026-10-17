import { NextRequest, NextResponse } from 'next/server';
import { getChapterData } from '@/lib/bible';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ book: string; chapter: string }> }
) {
  const { book, chapter } = await params;
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'hebrew';

  try {
    const data = await getChapterData(book, chapter, lang);
    if (!data) {
      return NextResponse.json(
        { error: `Chapter not found for ${book} ${chapter}` },
        { status: 404 }
      );
    }
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

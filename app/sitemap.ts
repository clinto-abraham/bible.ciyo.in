import type { MetadataRoute } from 'next';
import { getBooks, getLanguages } from '@/lib/bible';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://bible.ciyo.in';
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];

  try {
    const languages = await getLanguages();
    const englishBooks = await getBooks('english');

    // 1. All canonical books & all chapters for the canonical Bible (1,189 chapters)
    for (const book of englishBooks) {
      for (let ch = 1; ch <= book.chapterCount; ch++) {
        entries.push({
          url: `${baseUrl}/${book.slug}/${ch}`,
          lastModified: now,
          changeFrequency: 'monthly',
          priority: ch === 1 ? 0.85 : 0.75,
        });
      }
    }

    // 2. High-priority language-specific index entries for each book across all 15 languages
    for (const lang of languages) {
      const langBooks = await getBooks(lang.id);
      for (const book of langBooks) {
        // Index chapter 1 for all books in all languages
        entries.push({
          url: `${baseUrl}/${book.slug}/1?lang=${lang.id}`,
          lastModified: now,
          changeFrequency: 'monthly',
          priority: 0.8,
        });

        // For major classical languages (Hebrew, Greek, Aramaic, Malayalam), index key chapters
        if (['hebrew', 'greek', 'aramaic', 'malayalam'].includes(lang.id)) {
          const maxChaptersToIndex = Math.min(book.chapterCount, 10);
          for (let ch = 2; ch <= maxChaptersToIndex; ch++) {
            entries.push({
              url: `${baseUrl}/${book.slug}/${ch}?lang=${lang.id}`,
              lastModified: now,
              changeFrequency: 'monthly',
              priority: 0.7,
            });
          }
        }
      }
    }
  } catch (err) {
    console.error('Error generating dynamic sitemap:', err);
  }

  return entries;
}

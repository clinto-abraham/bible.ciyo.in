import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: [
          'Bytespider',
          'PetalBot',
          'AhrefsBot',
          'SemrushBot',
          'MJ12bot',
          'DotBot',
          'ClaudeBot',
          'Amazonbot',
        ],
        disallow: '/',
      },
    ],
    sitemap: 'https://bible.ciyo.in/sitemap.xml',
  };
}

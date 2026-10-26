// Keep the production origin shared by Astro, metadata and crawler endpoints.
export const site = {
  url: 'https://partire-hakata-hotel.pages.dev/',
  language: 'ja-JP',
  locale: 'ja_JP',
  ogImage: {
    path: '/images/og/partire-hakata-hotel.jpg',
    width: 1200,
    height: 630,
    alt: 'パルティーレ博多ホテル 201号室の客室',
  },
};

export const absoluteUrl = (path = '/') => new URL(path, site.url).href;

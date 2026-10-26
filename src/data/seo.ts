import { hotel, mapUrl } from './hotel';
import roomImages from './room-images.json';
import { site, absoluteUrl } from './site.mjs';

export const pageTitle = `${hotel.name}｜福岡・春吉／キャナルシティ博多徒歩3分`;
export const pageDescription = `福岡市中央区春吉の${hotel.name}。キャナルシティ博多まで徒歩3分、天神南駅・櫛田神社前駅から徒歩約8分。最大${hotel.capacity}名様まで宿泊可能。客室写真、平日・週末の料金、チェックイン・荷物預かり・駐車場をご案内します。`;

const hotelId = absoluteUrl('/#hotel');
const websiteId = absoluteUrl('/#website');
const pageId = absoluteUrl('/#webpage');
const imageId = absoluteUrl('/#primaryimage');
const roomPhotoUrls = Object.values(roomImages)
  .flatMap(images => images[0] ? [absoluteUrl(images[0].src)] : []);

export const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Hotel',
      '@id': hotelId,
      name: hotel.name,
      url: site.url,
      description: pageDescription,
      telephone: `+81${hotel.tel.replace('tel:', '').replace(/^0/, '')}`,
      address: {
        '@type': 'PostalAddress',
        postalCode: hotel.postal.replace('〒', ''),
        addressRegion: '福岡県',
        addressLocality: '福岡市中央区',
        streetAddress: `${hotel.address.replace('福岡市中央区', '')} ${hotel.building}`,
        addressCountry: 'JP',
      },
      image: [absoluteUrl('/images/exterior.webp'), ...roomPhotoUrls],
      hasMap: mapUrl,
      checkinTime: hotel.checkIn,
      checkoutTime: hotel.checkOut,
      mainEntityOfPage: { '@id': pageId },
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: site.url,
      name: hotel.name,
      inLanguage: site.language,
      publisher: { '@id': hotelId },
    },
    {
      '@type': 'WebPage',
      '@id': pageId,
      url: site.url,
      name: pageTitle,
      description: pageDescription,
      inLanguage: site.language,
      isPartOf: { '@id': websiteId },
      about: { '@id': hotelId },
      mainEntity: { '@id': hotelId },
      primaryImageOfPage: { '@id': imageId },
    },
    {
      '@type': 'ImageObject',
      '@id': imageId,
      url: absoluteUrl(site.ogImage.path),
      contentUrl: absoluteUrl(site.ogImage.path),
      caption: site.ogImage.alt,
      width: site.ogImage.width,
      height: site.ogImage.height,
    },
  ],
};

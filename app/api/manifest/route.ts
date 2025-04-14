import { NextResponse } from 'next/server';

/**
 * API endpoint that returns the manifest.json for PWA
 */
export async function GET() {
  const manifest = {
    name: 'SpiritualFit',
    short_name: 'SpiritualFit',
    description: 'Islamic spiritual practice tracking application',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4f46e5',
    icons: [
      {
        src: '/icons/icon-72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-152.png',
        sizes: '152x152',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      }
    ],
    orientation: 'portrait',
    shortcuts: [
      {
        name: 'Dashboard',
        short_name: 'Dashboard',
        description: 'View your spiritual journey progress',
        url: '/',
        icons: [{ src: '/icons/icon-96.png', sizes: '96x96' }]
      },
      {
        name: 'Quran Reading',
        short_name: 'Quran',
        description: 'Continue your Quran reading',
        url: '/quran',
        icons: [{ src: '/icons/icon-96.png', sizes: '96x96' }]
      },
      {
        name: 'Calendar',
        short_name: 'Calendar',
        description: 'View your prayer calendar',
        url: '/calendar',
        icons: [{ src: '/icons/icon-96.png', sizes: '96x96' }]
      }
    ]
  };

  // Return the manifest with proper content type
  return NextResponse.json(manifest, {
    headers: {
      'content-type': 'application/manifest+json',
      'cache-control': 'public, max-age=3600'
    }
  });
}
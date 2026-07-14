// File: c:\dev\Corebit-Studio\app\[locale]\opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Corebit Studio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params: { locale } }: { params: { locale: string } }) {
  const titleMap: Record<string, string> = {
    en: 'Corebit Studio',
    ru: 'Corebit Studio',
    cnr: 'Corebit Studio',
    srb: 'Corebit Studio',
    sq: 'Corebit Studio'
  };

  const subtitleMap: Record<string, string> = {
    en: 'Web Development & Automation Systems',
    ru: 'Разработка сайтов и автоматизация бизнеса',
    cnr: 'Izrada sajtova i IT sistemi za biznis',
    srb: 'Izrada sajtova i IT sistemi za biznis',
    sq: 'Zhvillim ueb dhe sisteme automatizimi'
  };

  const title = titleMap[locale] || titleMap.en;
  const subtitle = subtitleMap[locale] || subtitleMap.en;

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #09090b, #020203)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          padding: '80px',
        }}
      >
        {/* Glow effect */}
        <div
          style={{
            position: 'absolute',
            top: '0px',
            right: '0px',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        {/* Frame */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '40px',
            padding: '60px 80px',
            width: '100%',
            height: '100%',
          }}
        >
          <div
            style={{
              fontSize: '84px',
              fontWeight: 'bold',
              color: '#ffffff',
              letterSpacing: '-2px',
              marginBottom: '20px',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: '32px',
              color: '#10b981',
              fontWeight: '100',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            {subtitle}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

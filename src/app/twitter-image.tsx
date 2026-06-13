import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'Visus - Advanced Speed Reading Platform';
export const size = {
  width: 1200,
  height: 600,
};

export const contentType = 'image/png';

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-200px',
            right: '-200px',
            width: '600px',
            height: '600px',
            background: 'rgba(99, 102, 241, 0.15)',
            borderRadius: '50%',
            filter: 'blur(100px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-200px',
            left: '-200px',
            width: '600px',
            height: '600px',
            background: 'rgba(99, 102, 241, 0.15)',
            borderRadius: '50%',
            filter: 'blur(100px)',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontSize: 120,
              fontWeight: 900,
              background: 'linear-gradient(to bottom right, #818cf8, #6366f1)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: 20,
              letterSpacing: '-0.05em',
            }}
          >
            Visus
          </div>
          <div
            style={{
              fontSize: 32,
              color: '#94a3b8',
              maxWidth: '800px',
              textAlign: 'center',
              lineHeight: 1.4,
            }}
          >
            Advanced Speed Reading Platform
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

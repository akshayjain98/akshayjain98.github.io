import { getProfile, getProjects } from '@/lib/content';
import { ImageResponse } from 'next/og';

// Link-preview image (LinkedIn, WhatsApp, Slack, X), generated at build time from /content.

export const alt = 'Portfolio preview';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const dynamic = 'force-static'; // render once at build time (required for static export)

export default function OpengraphImage() {
  const { firstName, lastName, title, headline, heroStats } = getProfile();
  const projectCount = getProjects().length;
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#000', color: '#fff', padding: 72 }}>
        <div style={{ display: 'flex', fontSize: 28, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
          {firstName} {lastName}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, textTransform: 'uppercase' }}>{title}</div>
          <div style={{ fontSize: 32, color: '#9ca3af' }}>{headline}</div>
        </div>
        <div style={{ display: 'flex', gap: 56, fontSize: 26, color: '#d1d5db' }}>
          <span>{heroStats[0]?.value} years</span>
          <span>{projectCount} projects</span>
          <span>{heroStats[2]?.value} commits</span>
        </div>
      </div>
    ),
    size,
  );
}

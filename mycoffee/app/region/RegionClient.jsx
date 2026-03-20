'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import './region.css';

const REGIONS = {
  'canada-en': {
    region: 'Canada',
    language: 'English',
    flag: '🇨🇦',
    description: 'Starbucks Canada operates over 1,500 stores coast to coast, delivering premium coffee experiences and warm hospitality to communities across the country.',
  },
  'canada-fr': {
    region: 'Canada',
    language: 'Français',
    flag: '🇨🇦',
    description: 'Starbucks Canada exploite plus de 1 500 établissements d\'un océan à l\'autre, offrant des expériences café d\'exception et une hospitalité chaleureuse dans tout le pays.',
  },
  'usa-en': {
    region: 'USA',
    language: 'English',
    flag: '🇺🇸',
    description: 'From the original Pike Place Market store in Seattle to thousands of locations nationwide, Starbucks has been at the heart of American coffee culture since 1971.',
  },
  'emea-en': {
    region: 'EMEA',
    language: 'English',
    flag: '🌍',
    description: 'Starbucks serves customers across Europe, the Middle East, and Africa, bringing a consistent coffee experience with local flavour to diverse communities.',
  },
  'latam-en': {
    region: 'Latin America',
    language: 'English',
    flag: '🌎',
    description: 'Starbucks is proud to source many of its finest coffees from Latin America, and serves communities across the region with warmth and connection.',
  },
  'latam-es': {
    region: 'Latin America',
    language: 'Español',
    flag: '🌎',
    description: 'Starbucks se enorgullece de obtener muchos de sus mejores cafés de América Latina y sirve a comunidades de toda la región con calidez y conexión.',
  },
  'latam-pt': {
    region: 'Latin America',
    language: 'Português',
    flag: '🌎',
    description: 'A Starbucks tem orgulho em obter muitos dos seus melhores cafés da América Latina e serve comunidades em toda a região com calor humano e conexão.',
  },
  'asia-en': {
    region: 'Asia',
    language: 'English',
    flag: '🌏',
    description: 'Across Asia, Starbucks brings its signature coffee craftsmanship and community spirit to millions of customers, blending global quality with local culture.',
  },
  'japan-ja': {
    region: 'Japan',
    language: '日本語',
    flag: '🇯🇵',
    description: 'スターバックスは1996年に日本に上陸して以来、コーヒーの素晴らしさと温かいひとときをお届けしています。',
  },
};

export default function RegionClient() {
  const params = useSearchParams();
  const router = useRouter();
  const key = params.get('r') || '';
  const data = REGIONS[key];

  return (
    <div className="rg-root">
      <div className="rg-card">
        {data ? (
          <>
            <span className="rg-flag">{data.flag}</span>
            <p className="rg-eyebrow">{data.region}</p>
            <h1 className="rg-title">{data.language}</h1>
            <div className="rg-divider" />
            <p className="rg-body">{data.description}</p>
          </>
        ) : (
          <>
            <p className="rg-eyebrow">Starbucks</p>
            <h1 className="rg-title">Region not found</h1>
            <div className="rg-divider" />
          </>
        )}
        <button className="rg-back" onClick={() => router.back()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Go back
        </button>
      </div>
    </div>
  );
}

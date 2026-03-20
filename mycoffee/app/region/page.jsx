import { Suspense } from 'react';
import RegionClient from './RegionClient';

export const metadata = { title: 'Region | Starbucks' };

export default function Page() {
  return (
    <Suspense>
      <RegionClient />
    </Suspense>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import ProductPage from '../../products/productpage';
import ItemAvailability, { addToCart } from '../itemavailability';

export default function DrinkPage({ params }) {
  const router = useRouter();
  const { slug } = params; // Next.js provides the URL part as "slug"

  return (
    <>
      <ProductPage
        slug={slug}
        onAddToCart={addToCart}
        onBack={() => router.push('/menupage')} // go back to menu or trending
      />
      <ItemAvailability />
    </>
  );
}
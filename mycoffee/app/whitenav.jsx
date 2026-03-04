'use client';

import { useRouter } from 'next/navigation';

export default function WhiteNav({ activePage }) {
  const router = useRouter();

  return (
    <>
      <header className="navbar">
        <div className="logo">
          <img src="/images/starbucks_logo.png" alt="Starbucks Logo" />
        </div>

        <ul className="nav-links">
          <li
            className={activePage === 'menu' ? 'active' : ''}
            onClick={() => router.push('/menupage')}
          >
            MENU
          </li>

          <li
            className={activePage === 'rewards' ? 'active' : ''}
            onClick={() => router.push('/rewards')}
          >
            REWARDS
          </li>

          <li
            className={activePage === 'gifts' ? 'active' : ''}
            onClick={() => router.push('/gifts')}
          >
            GIFT CARDS
          </li>
        </ul>

        <div className="nav-right">
          <div className="find-store">
            <img src="/images/location.png" alt="Location Icon" />
            <span>Find a store</span>
          </div>
          <button className="btn-outline">Sign in</button>
          <button className="btn-black">Join now</button>
        </div>
      </header>
    </>
  );
}
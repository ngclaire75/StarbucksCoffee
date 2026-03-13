'use client';

import './home.css';
import { useRouter } from 'next/navigation';
import WhiteNav from './whitenav';
import PagesList from './pageslist';

export default function Home() {
  const router = useRouter();
  return (
    <>
      <WhiteNav />

      {/* Green Strip */}
      <section className="green-bar">
        <h2>It&apos;s a great day for coffee</h2>
        <button className="start-order-btn" onClick={() => router.push('/menupage')}>Start an order</button>
      </section>

      <section className="spacer"></section>

      {/* Dubai Chocolate */}
      <section className="main-section">
        <div className="left-image">
          <img src="/images/dubaichoco.png" alt="Coffee" />
        </div>
        <div className="right-text">
          <h1>For the love of Dubai chocolate</h1>
          <p>
            Now there are two ways to experience the beloved pistachio and chocolate trend: returning Iced
            Dubai Chocolate Matcha and new Iced Dubai Chocolate Mocha with espresso. Enjoy for a limited time.
          </p>
          <button className="btn-outline-white" onClick={() => router.push('/menupage')}>Order Dubai chocolate</button>
        </div>
      </section>

      <section className="spacer"></section>

      {/* Caramel Protein */}
      <section className="roller-section">
        <div className="roller-left">
          <h1 className="tight-title">Caramel protein is here</h1>
          <p>
            Power up with a new Caramel Protein Latte or Matcha, with Protein-boosted Milk for up
            to 31g of protein per grande. Add Caramel Protein Cold Foam for up to an additional 17g of protein.
            Hot or iced and sugar-free options.
          </p>
          <button className="roller-btn" onClick={() => router.push('/menupage')}>Explore caramel protein</button>
        </div>
        <div className="roller-right">
          <img src="/images/caramelprotein.png" alt="Roller Rabbit Collection" />
        </div>
      </section>

      <section className="spacer"></section>

      {/* Khloé Kardashian */}
      <section className="main-section">
        <div className="left-image">
          <img src="/images/khole.png" alt="Send holiday joy" />
        </div>
        <div className="right-text holiday-green">
          <h1>Snack smart with Khloé Kardashian</h1>
          <p>
            Fuel your day and order Khloé&apos;s secret menu protein drink, only in the app.
            Pair it with a bag of Khloud popcorn, now available at Starbucks.
          </p>
          <button className="btn-outline-white" onClick={() => router.push('/orderinapp')}>Order in the app</button>
        </div>
      </section>

      <section className="spacer"></section>

      {/* Free Drink */}
      <section className="free-drink-section">
        <div className="free-drink-text">
          <h1>Free drink? It&apos;s yours.</h1>
          <p>
            When you join, enjoy a <strong>free handcrafted drink</strong> with purchase.
            It&apos;s our way of welcoming you to Starbucks® Rewards during your first week.*
          </p>
          <button className="free-drink-btn" onClick={() => router.push('/joinnow')}>Join now</button>
        </div>
        <div className="free-drink-image">
          <img src="/images/brownsugar.png" alt="Free drink" />
        </div>
      </section>

      <section className="spacer"></section>

      {/* Free Refills */}
      <section className="free-cheer-section">
        <div className="free-cheer-text">
          <h1>Grab a seat. Get free refills.</h1>
          <p>
            When you stay to enjoy your favorite beverage in the café,
            refills of hot and iced brewed coffee or tea are on us.**
          </p>
          <button className="free-cheer-btn" onClick={() => router.push('/menupage')}>Order now</button>
        </div>
        <div className="free-cheer-image">
          <img src="/images/freeref.png" alt="Free cup of cheer" />
        </div>
      </section>

      <section className="spacer"></section>

      {/* Legal Notice */}
      <section className="notice-section">
        <p>
          *Valid for new Starbucks Rewards members for 7 days from sign up.
          Coupon will be available in the offers tab of your Starbucks app following sign up and may take up to 48 hours to arrive.
          Good at participating U.S. stores for a handcrafted menu-sized beverage ($8 max value) with qualifying purchase.
          Qualifying purchase excludes alcohol, Starbucks Card and Starbucks Cards reloads. Limit one.
          Cannot be combined with other offers or discounts. Excludes delivery services. Sign up by 3/31/2026.
        </p>
        <p className="small-text">
          **Free refills of hot and iced brewed coffee and tea during same store visit.
          Excludes Cold Brew, Nitro Cold Brew, Iced Tea Lemonade, flavored Iced Tea and Starbucks Refreshers® base.
          At participating stores.
        </p>
      </section>

      <PagesList />
    </>
  );
}
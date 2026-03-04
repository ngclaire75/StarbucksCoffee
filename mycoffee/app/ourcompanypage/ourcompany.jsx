'use client';

import './ourcompany.css';
import '../home.css';

import WhiteNav from '../whitenav';
import PagesList from '../pageslist';

export default function OurCompany() {
  return (
    <>
          <WhiteNav />
          <div className="navbar-divider"></div> 
      {/* Page Title */}
      <section className="page-title-section">
        <h1>Our Company</h1>
      </section>

      {/* Hero Image */}
      <section className="image-section">
        <img src="/images/starbucks-store.png" alt="Starbucks storefront" />
      </section>

      {/* Our Heritage */}
      <section className="content-section">
        <h2>Our Heritage</h2>
        <p>
          Our story begins in 1971 along the cobblestone streets of Seattle&apos;s historic Pike Place Market.
          It was here where Starbucks opened its first store, offering fresh-roasted coffee beans, tea
          and spices from around the world for our customers to take home. Our name was inspired by
          the classic tale, &quot;Moby-Dick,&quot; evoking the seafaring tradition of the early coffee traders.
        </p>
        <p>
          Ten years later, a young New Yorker named Howard Schultz would walk through these doors and
          become captivated with Starbucks coffee from his first sip. After joining the company in
          1982, a different cobblestone road would lead him to another discovery. It was on a trip to
          Milan in 1983 that Howard first experienced Italy&apos;s coffeehouses, and he returned to Seattle
          inspired to bring the warmth and artistry of its coffee culture to Starbucks.
        </p>
        <p>
          Starbucks would soon expand to Chicago and Vancouver, Canada and then on to California,
          Washington, D.C. and New York. By 1996, we would cross the Pacific to open our first store in
          Japan, followed by Europe in 1998 and China in 1999.
        </p>
      </section>

      {/* Coffee & Craft Image */}
      <section className="image-section">
        <img src="/images/coffee-craft.png" alt="Coffee & Craft" />
      </section>

      {/* Coffee & Craft */}
      <section className="content-section">
        <h2>Coffee &amp; Craft</h2>
        <p>
          It takes many hands to craft the perfect cup of coffee – from the farmers who tend to the
          red-ripe coffee cherries, to the master roasters who coax the best from every bean, and to
          the barista who serves it with care.
        </p>
        <a href="/our-coffee" className="btn">Learn more</a>
      </section>

      {/* Our Partners Image */}
      <section className="image-section">
        <img src="/images/partners.png" alt="Our Partners" />
      </section>

      {/* Our Partners */}
      <section className="content-section">
        <h2>Our Partners</h2>
        <p>
          We like to say that we are not in the coffee business serving people, but in the people business
          serving coffee. Our employees – who we call partners – are at the heart of the Starbucks experience.
        </p>
        <p>
          We are committed to making our partners proud and investing in their health, well-being and
          success and to creating a culture of belonging where everyone is welcome.
        </p>
        <a href="#" className="btn">Explore Careers</a>
      </section>

      {/* Doing Good Image */}
      <section className="image-section">
        <img src="/images/land.png" alt="Doing Good" />
      </section>

      {/* Doing Good */}
      <section className="content-section">
        <h2>We Believe in the Pursuit of Doing Good</h2>
        <p>
          As it has been from the beginning, our purpose goes far beyond profit. We believe Starbucks
          can, and should, have a positive impact on the communities we serve.
        </p>
      </section>

      {/* People */}
      <section className="content-section">
        <h3>People</h3>
        <p>
          Our aspiration is to be people positive – investing in humanity and the well-being of
          everyone we connect with, from our partners to coffee farmers to the customers in our
          stores and beyond.
        </p>
        <a href="#" className="btn">Learn more</a>
      </section>

      {/* Planet */}
      <section className="content-section">
        <h3>Planet</h3>
        <p>
          We are striving to become resource positive – giving back more than we take from the
          planet. We are working to store more carbon than we emit, replenish more freshwater than
          we use, and eliminate waste.
        </p>
        <a href="#" className="btn">Learn more</a>
      </section>

      {/* Learn More */}
      <section className="content-section learn-more">
        <h2>Learn More About Us</h2>
      </section>

      <section className="content-section">
        <h3>Stories &amp; News</h3>
        <p>Behind every cup of coffee is a story.</p>
        <a href="#" className="btn">Check out Starbucks Stories</a>
      </section>

      <section className="content-section">
        <h3>Company Profile</h3>
        <p>Here&apos;s a closer look at our company.</p>
        <a href="#" className="btn">Learn more</a>
      </section>

      <section className="content-section">
        <h3>Company Timeline</h3>
        <p>Read a brief history of Starbucks.</p>
        <a href="#" className="btn">Learn more</a>
      </section>

      <section className="content-section">
        <h3>Ethics &amp; Compliance</h3>
        <a href="#" className="btn">Learn more</a>
      </section>

      <section className="content-section corporate-governance">
        <h3>Corporate Governance</h3>
        <a href="#" className="btn">Learn more</a>
      </section>
            <PagesList />
    </>
  );
}
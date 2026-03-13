'use client';

import { useState } from 'react';
import './ourcoffee.css';
import HeaderFooter from '../components/headerfooter';
import Footer from '../components/footer';
import HeroParallax from '../components/heroparallax';
import SearchPanel from '../components/searchpanel';
import NumbersSlider from '../components/numbersslider';
import VideoCard from '../components/videocard';

export default function OurCoffee() {
  const [storiesPage, setStoriesPage] = useState(1);
  const [fading, setFading] = useState(false);

  const goToPage = (pg) => {
    if (pg === storiesPage) return;
    setFading(true);
    setTimeout(() => { setStoriesPage(pg); setFading(false); }, 350);
  };

  return (
    <>
      {/* Header & Dropdown Navigation */}
      <HeaderFooter />

      {/* Search Panel */}
      <SearchPanel />

      {/* Our Coffee Story */}
      <section className="our-coffee-story">
        <div className="coffee-title">
          <p className="small-title">COFFEE</p>
          <h1>OUR COFFEE<br />STORY</h1>
        </div>
        <div className="coffee-image-top">
          <img src="/images/greenv.png" alt="Starbucks Coffee Bags" />
        </div>
        <div className="coffee-image-bottom">
          <img src="/images/greenv2.png" alt="Starbucks Cup and Coffee Bag" />
        </div>
        <div className="coffee-text">
          <p>
          The cup of Starbucks coffee you hold in your hand is more than just a drink. 
          It’s an expertly handcrafted beverage, a daily ritual, the final step in an incredible, global, 
          coffee-production story connecting you to farmers, agronomists, roasters, buyers, engineers, 
          Green Apron baristas and more. Starbucks was founded on a love for high-quality coffee. Coffee is our heart. 
          We invite you to learn about our story - the coffee fields to your stores, the many hands that nurture the coffee along the way, 
          the incredible journey of a little bean that ends in your cup.
          </p>
        </div>
      </section>

      <div className="white-separator"></div>

      {/* Cup Section */}
      <section className="cup-section">
        <div className="cup-content-wrapper">
          <div className="cup-text">
            <h1>
              Keeping your cup <br />full:
              How <br />Starbucks is <br />working to
              save <br />the future of <br />coffee
            </h1>
            <a href="#" className="cup-btn">
              <span className="circle">→</span>
              <span>Learn More</span>
            </a>
          </div>
          <img src="/images/banner.png" alt="Banner" className="cup-banner" />
        </div>
      </section>

      {/* Bean Section */}
      <section className="bean-section">
        <div className="bean-wrapper">
          <div className="bean-image">
            <img src="/images/bean.png" alt="Coffee Bean" />
          </div>
          <div className="bean-content">
            <h1>Starbucks Coffee, Bean-to-Cup</h1>
            <p>
              We&apos;re woven into the communities we serve. Our stores are gathering
              spaces for conversations, connection and joy, where our baristas
              share their love of coffee every single day.
            </p>
            <a href="#" className="bean-btn">
              <span className="icon">→</span>
              <span className="text">Learn More</span>
            </a>
          </div>
        </div>
      </section>

      {/* Numbers Slider */}
          <section className="numbers-section">
      <h2 className="numbers-title">BY THE NUMBERS</h2>

      <NumbersSlider>

        {/* Slide 1 */}
        <div className="numbers-grid">

          <div className="numbers-item">
            <div className="number-wrap width-450k">
              <span className="big-number">450K+</span>
            </div>
            <p>Farmers who work with Starbucks around the world</p>
          </div>

          <div className="numbers-divider"></div>

          <div className="numbers-item">
            <div className="number-wrap width-3percent">
              <span className="big-number">3%</span>
            </div>
            <p>Of the world&apos;s coffee is purchased by Starbucks annually</p>
          </div>

          <div className="numbers-divider"></div>

          <div className="numbers-item">
            <div className="number-wrap width-20">
              <span className="big-number">20</span>
            </div>
            <p>Years we&apos;ve offered Guatemala Casi Cielo, a barista favorite</p>
            <a href="#" className="explore-btn">
              <span className="circle">→</span>
              <span className="explore-text">Explore</span>
            </a>
          </div>

        </div>

        {/* Slide 2 */}
        <div className="numbers-grid">

          <div className="numbers-item">
            <div className="number-wrap width-3percent">
              <span className="big-number">3%</span>
            </div>
            <p>Of the world&apos;s coffee is purchased by Starbucks annually</p>
          </div>

          <div className="numbers-divider"></div>

          <div className="numbers-item">
            <div className="number-wrap width-20">
              <span className="big-number">20</span>
            </div>
            <p>Years we&apos;ve offered Guatemala Casi Cielo, a barista favorite</p>
            <a href="#" className="explore-btn">
              <span className="circle">→</span>
              <span className="explore-text">Explore</span>
            </a>
          </div>

          <div className="numbers-divider"></div>

          <div className="numbers-item">
            <div className="number-wrap width-70">
              <span className="big-number">70</span>
            </div>
            <p>Model coffee farms in Starbucks supply chain</p>
          </div>

        </div>

      </NumbersSlider>
    </section>
      
      {/* Global Coffee Creators */}
      <section className="global-creators-section">
        <div className="global-creators-content">
          <div className="global-creators-text">
            <h1>
              10 questions for Starbucks first<br />
              Global Coffee Creators
            </h1>
            <p>
              Josiah Varghese, a Starbucks barista, and Juliana Galofre, a longtime customer,
              were chosen from nearly 1,800 applicants to spend the next year traveling
              around the world to unique Starbucks locations to tell stories about coffee,
              craft and connection on social media.
            </p>
            <a href="#" className="cup-btn-global">
              <span className="circle">→</span>
              <span>Learn More</span>
            </a>
          </div>
          <img src="/images/twocoffee.webp" alt="Global Coffee Creators" className="global-creators-image" />
        </div>
      </section>

      {/* Coffee Stories Cards */}
      <section className="coffee-stories-section">
        <div className="coffee-stories-grid">
          <div className="story-card">
            <div className="story-card-inner">
              <img src="/images/basket.png" alt="Ethically Sourcing Coffee" />
              <div className="story-caption">
                <span>C.A.F.E. Practices: Starbucks Approach to Ethically Sourcing Coffee</span>
              </div>
            </div>
          </div>
          <div className="story-card">
            <div className="story-card-inner">
              <img src="/images/flour.png" alt="Guatemala Casi Cielo" />
              <div className="story-caption-different">
                <span>Starbucks Guatemala Casi Cielo Coffee</span>
              </div>
            </div>
          </div>
          <div className="story-card">
            <div className="story-card-inner">
              <img src="/images/ethiopia.png" alt="Ethiopia Coffee" />
              <div className="story-caption">
                <span>Starbucks celebrates Ethiopia&apos;s coffee legacy <br /> with new single-origin coffee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video / Pairings */}
          <section className="pairings-section">
      <div className="pairings-bg">
        <div className="pairings-content">

          <div className="pairings-text">
            <h1>
              6 Starbucks coffee
              <br />
              pairings that may
              <br />
              surprise you
            </h1>
            <p>
              Food pairings can help bring out those subtle differences in
              flavor, body, acidity and aroma — and may even change the
              way you think about coffee.
            </p>
            <a href="#" className="pairings-btn">
              <span className="circle">→</span>
              <span className="text-underline">Learn More</span>
            </a>
          </div>

          {/* video for display */}
          <VideoCard src="/images/greenapron.mp4" />

        </div>
      </div>
    </section>

      {/* Hero Parallax */}
            <HeroParallax>
        {(imagesRef) => (
          <>
            <div className="hero-images">
              <img
                src="/images/grass.png"
                alt="Coffee Farm"
                className="hero-img top-left"
                ref={(el) => (imagesRef.current[0] = el)}
              />
              <img
                src="/images/barista.png"
                alt="Barista"
                className="hero-img bottom-left"
                ref={(el) => (imagesRef.current[1] = el)}
              />
              <img
                src="/images/pour.png"
                alt="Pouring Coffee"
                className="hero-img top-right"
                ref={(el) => (imagesRef.current[2] = el)}
              />
              <img
                src="/images/cups.png"
                alt="Customer"
                className="hero-img bottom-right"
                ref={(el) => (imagesRef.current[3] = el)}
              />
            </div>
            <div className="hero-content">
              <div className="hero-vertical-line-top"></div>
              <h1>It&apos;s a Great <br /> Day for Coffee</h1>
              <p>
                Starbucks celebrates the farmers, roasters and baristas who work relentlessly
                to craft the perfect cup.
              </p>
              <button className="learn-more-btn">Learn More</button>
              <div className="hero-vertical-line-bottom"></div>
            </div>
          </>
        )}
      </HeroParallax>

      {/* Coffee Roast Section */}
      <section className="coffee-roast-section">
        <div className="coffee-roast-wrapper">
          <div className="coffee-roast-image">
            <img src="/images/seeds.png" alt="Starbucks Coffee Roast" />
          </div>
          <div className="coffee-roast-text">
            <h1>Starbucks Coffee roast spectrum explained</h1>
            <p>The art and science of the Starbucks® Roast Spectrum.</p>
            <a href="#" className="coffee-roast-btn">
              <div className="circle">→</div>
              <span>Learn More</span>
            </a>
          </div>
        </div>
      </section>

      {/* More Stories Section */}
      <section className="more-stories-section">
        <h2 className="more-stories-title">MORE STORIES</h2>

        <div className={`more-stories-wrapper${fading ? ' stories-fading' : ''}`}>
          {storiesPage === 1 ? (
            <>
              <div className="story-item">
                <img src="/images/story1.jpg" alt="Story 1 Image" className="story-img" />
                <div className="story-main">
                  <span className="story-category">Coffee</span>
                  <h3 className="story-title">
                    <span>Keeping your cup full: How Starbucks is working to save the future of coffee &gt;</span>
                  </h3>
                </div>
                <div className="story-side">
                  <p className="story-desc">
                    Your morning ritual of drinking coffee is easy to take for granted, but in some areas, farmers may not be able to grow arabica coffee in as soon as 10 years. Starbucks agronomists are fighting to change that.
                  </p>
                  <div className="story-meta">September 24, 2025 — 11 MIN READ</div>
                </div>
              </div>

              <hr />

              <div className="story-item">
                <img src="/images/story2.jpg" alt="Story 2 Image" className="story-img" />
                <div className="story-main">
                  <span className="story-category">Coffee &amp; Craft</span>
                  <h3 className="story-title">
                    <span>6 Starbucks coffee pairings that may surprise you &gt;</span>
                  </h3>
                </div>
                <div className="story-side">
                  <p className="story-desc">
                    Food pairings can help bring out those subtle differences in flavor, body, acidity and aroma – and may even change the way you think about coffee.
                  </p>
                  <div className="story-meta">May 8, 2025 — 3 MIN READ</div>
                </div>
              </div>

              <hr />

              <div className="story-item">
                <img src="/images/story3.jpg" alt="Story 3 Image" className="story-img" />
                <div className="story-main">
                  <span className="story-category">Coffee &amp; Craft</span>
                  <h3 className="story-title">
                    <span>Starbucks Reserve unveils new spring menu featuring botanical flavors &gt;</span>
                  </h3>
                </div>
                <div className="story-side">
                  <p className="story-desc">
                    Embrace the season with vibrant new flavors of ube, lavender, butterfly pea flower and sakura (cherry blossom)
                  </p>
                  <div className="story-meta">March 3, 2025 — 4 MIN READ</div>
                </div>
              </div>
            </>
          ) : (
            <div className="stories-coming-soon">
              <div className="stories-cs-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" width="38" height="38">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <h3 className="stories-cs-title">More stories are on the way</h3>
              <p className="stories-cs-text">More upcoming news will be added here soon. Check back to discover new stories from Starbucks.</p>
              <div className="stories-cs-dots">
                <span /><span /><span />
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button className={`page-number${storiesPage === 1 ? ' active' : ''}`} onClick={() => goToPage(1)}>1</button>
          <button className={`page-number${storiesPage === 2 ? ' active' : ''}`} onClick={() => goToPage(2)}>2</button>
          <button className="page-next" onClick={() => goToPage(storiesPage === 1 ? 2 : 1)}>
            {storiesPage === 1 ? 'Next Page →' : '← Back'}
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}
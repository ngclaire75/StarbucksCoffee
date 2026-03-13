'use client';

import './stories.css';
import HeaderFooter from '../components/headerfooter';
import SearchPanel from '../components/searchpanel';
import HeroParallax from '../components/heroparallax';
import Footer from '../components/footer';

export default function Stories() {
  return (
    <HeaderFooter>
      <SearchPanel />

      {/* Hero Section */}
      <section className="stories-hero">
        <div className="hero-inner">
          <div className="hero-title">
            <div className="hero-small">Starbucks Stories</div>
            <div className="hero-big">
              <span className="word-nurturing">{`NURTURING`}</span><br />
              <span className="word-human">{`THE HUMAN SPIRIT`}</span>
            </div>
          </div>
          <img src="/images/nurture1.png" className="hero-img-top" alt="Story Top Image" />
          <img src="/images/nurture2.png" className="hero-img-left" alt="Story Left Image" />
        </div>
      </section>

      {/* Description Section */}
      <section className="stories-desc">
        <div className="desc-inner">
          <p>
            At Starbucks, we believe in the power of human connection – the power of a cup
            of coffee to bring people together, spark conversation and inspire positive
            change. From local initiatives to global impact, learn about the people behind the
            brand, working to uplift their communities.
          </p>
        </div>
      </section>

      {/* Feature Story Section */}
      <section className="feature-story">
        <div className="feature-wrapper">
          <div className="feature-image-large">
            <img src="/images/carlos.png" alt="Coffee Farmer" />
          </div>
          <div className="feature-card">
            <span className="quote-mark">{`“`}</span>
            <h2>
              Keeping your cup full: How Starbucks is working to save the future of coffee
            </h2>
            <a href="#" className="feature-link">
              <span className="circle-arrow">
                <span className="arrow-char">→</span>
              </span>
              <span className="learn-more-text">Learn more</span>
            </a>
          </div>
          <div className="feature-image-small">
            <img src="/images/berries.png" alt="Coffee Beans" />
          </div>
        </div>
      </section>

      {/* Graduates' Story Section */}
      <section className="story-feature-alt">
        <div className="story-feature-inner">
          <div className="story-text-card">
            <span className="story-quote">{`“`}</span>
            <div className="story-text-content">
              <p>
                More than 18,000 partners have graduated from Arizona State University
                through the Starbucks College Achievement Plan. Every graduate has a
                unique story.
              </p>
            </div>
            <a href="#" className="story-link">
              <span className="story-arrow-circle">
                <span className="story-arrow">→</span>
              </span>
              <span className="story-link-text">See the photo essay</span>
            </a>
          </div>
          <div className="story-image-small">
            <img src="/images/graduatesmall.png" alt="" />
          </div>
          <div className="story-image-large">
            <img src="/images/graduatelarge.png" alt="" />
          </div>
        </div>
      </section>

      {/* Quote Feature Section */}
      <section className="quote-feature-section">
        <div className="quote-feature-wrapper">
          <div className="quote-image-large">
            <img src="/images/horse-dark.jpg" alt="" />
            <span className="image-overlay"></span>
            <span className="image-border"></span>
          </div>
          <div className="quote-image-small">
            <img src="/images/horse-light.jpg" alt="" />
          </div>
          <div className="quote-card">
            <span className="quote-mark-2">{`“`}</span>
            <p className="quote-text">
              It was a life-saving moment. When I sat on the back of that horse,
              that horse didn’t care that my legs didn’t work.
            </p>
            <span className="quote-author">Rebecca Hart, barista</span>
            <a href="#" className="quote-link">
              <span className="circle-arrow-2">
                <span className="arrow-char-2">→</span>
              </span>
              <span className="quote-link-text">{`Rebecca’s story`}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Decorative Border */}
      <div className="border-wrapper">
        <img src="/images/border.png" className="section-border" alt="Section Border" />
      </div>

      {/* Power of Connection Section */}
      <HeroParallax>
        {(imagesRef) => (
          <>
            <div className="poc-hero-images">
              <img
                src="/images/biddymason.jpg"
                alt="Biddy Mason"
                className="poc-hero-img top-left"
                ref={(el) => (imagesRef.current[0] = el)}
              />
              <img
                src="/images/gcw.jpg"
                alt="GCW"
                className="poc-hero-img bottom-left"
                ref={(el) => (imagesRef.current[1] = el)}
              />
              <img
                src="/images/costrarica.jpg"
                alt="Costa Rica"
                className="poc-hero-img top-right"
                ref={(el) => (imagesRef.current[2] = el)}
              />
              <img
                src="/images/wattson.jpg"
                alt="Wattson"
                className="poc-hero-img bottom-right"
                ref={(el) => (imagesRef.current[3] = el)}
              />
            </div>

            {/* Full-width background wrapper */}
            <div className="poc-hero-content-wrapper">
              <div className="poc-hero-content">
                <div className="poc-hero-vertical-line-top"></div>
                <h1>
                  THE POWER OF<br />CONNECTION
                </h1>
                <p>
                  At Starbucks, we believe in the power of human connection —
                  the power of a cup of coffee and how it can bring people together.
                </p>
                <div className="poc-hero-vertical-line-bottom"></div>
              </div>
            </div>
          </>
        )}
      </HeroParallax>

      {/* Hingakawa Section */}
      <section className="hingakawa-section">
        <div className="hingakawa-container">
          <div className="hingakawa-image-wrapper">
            <div className="image-frame"></div>
            <img src="/images/hingakawa.jpg" alt="Hingakawa Coffee Co-op" />
          </div>
          <div className="hingakawa-content">
            <h2>Hingakawa</h2>
            <p>
              This is the Hingakawa coffee co-op, more than 550 women strong,
              located in the mountainous region of the Gakenke district.
              Each year, the women bring the coffee they’ve grown to the
              co-op to be sorted, dried and then sold. As a group, they
              make business decisions, negotiate for the best prices and
              support each other. Here, at Hingakawa, they know that they
              are strongest together.
            </p>
            <a href="#" className="read-stories">
              <span className="arrow-circle-3">
                <span className="arrow-char-3">→</span>
              </span>
              <span className="text-underline">Read the stories</span>
            </a>
          </div>
        </div>
      </section>

      {/* Forgiveness Section */}
      <section className="forgiveness-section">
        <div className="forgiveness-container">
          <div className="forgiveness-text">
            <h2>Forgiveness is a <br />choice</h2>
            <p>
              Once on the opposite sides of war, these women experienced heartbreak in very
              different ways. Finding common ground through their shared livelihood of coffee,
              <br />they are no longer each other’s enemy, <br />they are each other’s strength.
            </p>
          </div>
          <div className="forgiveness-video">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/HfSSN7aHXAg?si=1kixanOiPT8493I8"
              title="HINGAKAWA : An Original Starbucks Productions Documentary"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </HeaderFooter>
  );
}
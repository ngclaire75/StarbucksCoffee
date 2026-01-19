<?php
// ourcoffee.php
?>
<!DOCTYPE html>
<html>
<head>
    <title>Our Coffee Story - Starbucks</title>

    <link rel="stylesheet" href="ourcoffee.css">
</head>
<body>

<!-- GREEN NAV BAR -->
<header class="top-green-bar">
    <div class="bar-content">
        <div class="logo-small">
            <img src="images/starbuckslogov2.png" alt="Starbucks">
        </div>

<nav class="green-nav-links">
  <a href="#" class="nav-link has-arrow" data-dropdown="coffee">Coffee & Craft</a>
  <a href="#" class="nav-link has-arrow" data-dropdown="people">People & Impact</a>
  <a href="#" class="nav-link has-arrow" data-dropdown="news">News</a>
  <a href="#" class="nav-link">Stories</a>
</nav>
        <div class="right-icons">
            <img src="images/searches.png" alt="Search Icon">
            <img src="images/globals.png" alt="Globe Icon">
        </div>
        </div>

        <!-- DROPDOWN MENU -->
        <div class="dropdown-menu" id="coffeeDropdown">
            <div class="dropdown-content">
                <div class="empty-grid-left"></div>
                <div class="dropdown-item">
                    <div class="dropdown-icon">
                        <img src="images/black.png" alt="Coffee">
                    </div>
                    <div class="dropdown-label">Coffee</div>
                </div>
                <div class="dropdown-item">
                    <div class="dropdown-icon">
                        <img src="images/coffeehouse.png" alt="Coffeehouse">
                    </div>
                    <div class="dropdown-label">Coffeehouse Experience</div>
                </div>
                <div class="dropdown-item">
                    <div class="dropdown-icon">
                        <img src="images/wintermerch.png" alt="Cups">
                    </div>
                    <div class="dropdown-label">Cups & Merch</div>
                </div>
                <div class="empty-grid-right"></div>
                <div class="dropdown-item">
                    <div class="dropdown-icon">
                        <img src="images/roastery.png" alt="Drinks">
                    </div>
                    <div class="dropdown-label">Drinks & Food</div>
                </div>
            </div>
        </div>

        <!-- PEOPLE & IMPACT DROPDOWN -->
        <div class="dropdown-menu" id="peopleDropdown">
            <div class="dropdown-content">
                <div class="empty-grid-left"></div>
                <div class="dropdown-item">
                    <div class="dropdown-icon">
                        <img src="images/esg.png" alt="Annual Report">
                    </div>
                    <div class="dropdown-label">Annual Impact Report (ESG)</div>
                </div>
                <div class="dropdown-item">
                    <div class="dropdown-icon">
                        <img src="images/belong.png" alt="Belonging">
                    </div>
                    <div class="dropdown-label">Belonging at Starbucks</div>
                </div>
                <div class="dropdown-item">
                    <div class="dropdown-icon">
                        <img src="images/communities.png" alt="Communities">
                    </div>
                    <div class="dropdown-label">Communities</div>
                </div>
                <div class="empty-grid-right"></div>
                <div class="dropdown-item">
                    <div class="dropdown-icon">
                        <img src="images/farmers.png" alt="Farmers">
                    </div>
                    <div class="dropdown-label">Farmers</div>
                </div>
                <div class="dropdown-item">
                    <div class="dropdown-icon">
                        <img src="images/employees.png" alt="Partners">
                    </div>
                    <div class="dropdown-label">Partners (Employees)</div>
                </div>
                <div class="dropdown-item">
                    <div class="dropdown-icon">
                        <img src="images/tsf.png" alt="Foundation">
                    </div>
                    <div class="dropdown-label">The Starbucks Foundation</div>
                </div>
                <div class="dropdown-item">
                    <div class="dropdown-icon">
                        <img src="images/sustainability.png" alt="Sustainability">
                    </div>
                    <div class="dropdown-label">Sustainability</div>
                </div>
            </div>
        </div>

        <!-- NEWS DROPDOWN -->
        <div class="dropdown-menu" id="newsDropdown">
    <div class="dropdown-content news-layout">

        <div class="news-item">
            <span>Contact Us</span>
        </div>

        <div class="news-item">
            <span>Media Library</span>
        </div>

        <div class="news-item">
            <span>News Blog</span>
        </div>

        <div class="news-item">
            <span>Press Releases</span>
        </div>

        <div class="news-item">
            <span>Starbucks for the Record</span>
        </div>

    </div>
</div>

    </header>

    <!-- BLUR OVERLAY -->
    <div class="dropdown-overlay" id="dropdownOverlay"></div>
    </div>
</header>

<!-- OUR COFFEE STORY -->
<section class="our-coffee-story">

    <div class="coffee-title">
        <p class="small-title">COFFEE</p>
        <h1>OUR COFFEE<br>STORY</h1>
    </div>

    <div class="coffee-image-top">
        <img src="images/products.png" alt="Starbucks Coffee Bags">
    </div>

    <div class="coffee-image-bottom">
        <img src="images/mug.png" alt="Starbucks Cup and Coffee Bag">
    </div>

    <div class="coffee-text">
        <p>
            The cup of Starbucks coffee you hold in your hand is more than just a drink. 
            It's an expertly handcrafted beverage, a daily ritual, the final step in an 
            incredible, global coffee-production story connecting you to farmers, agronomists, 
            roasters, buyers, engineers, and more.
        </p>
    </div>

</section>

<div class="white-separator"></div>

<section class="cup-section">
    <div class="cup-content-wrapper">
        
        <div class="cup-text">
            <h1>
                Keeping your cup full:<br>
                How Starbucks is working to<br>
                save the future of coffee
            </h1>

            <a href="#" class="cup-btn">
                <span class="circle">→</span>
                <span>Learn More</span>
            </a>
        </div>

        <img src="images/banner.png" alt="Banner" class="cup-banner">

    </div>
</section>

<section class="bean-section">
    <div class="bean-wrapper">

        <div class="bean-image">
            <img src="images/bean.png" alt="">
        </div>

        <div class="bean-content">
            <h1>Starbucks Coffee, Bean-to-Cup</h1>
            <p>
                We’re woven into the communities we serve. Our stores are gathering 
                spaces for conversations, connection and joy, where our baristas 
                share their love of coffee every single day.
            </p>

            <a href="#" class="bean-btn">
                <span class="icon">→</span>
                <span class="text">Learn More</span>
            </a>
        </div>

    </div>
</section>

<section class="numbers-section">

    <h2 class="numbers-title">BY THE NUMBERS</h2>

    <div class="numbers-slider">
        <div class="numbers-track">

            <!-- SLIDE 1 -->
            <div class="numbers-slide">
                <div class="numbers-grid">

                    <div class="numbers-item">
                        <div class="number-wrap width-450k">
                            <span class="big-number">450K+</span>
                        </div>
                        <p>Farmers who work with Starbucks around the world</p>
                    </div>

                    <div class="numbers-divider"></div>

                    <div class="numbers-item">
                        <div class="number-wrap width-3percent">
                            <span class="big-number">3%</span>
                        </div>
                        <p>Of the world’s coffee is purchased by Starbucks annually</p>
                    </div>

                    <div class="numbers-divider"></div>

                    <div class="numbers-item">
                        <div class="number-wrap width-20">
                            <span class="big-number">20</span>
                        </div>
                        <p>Years we've offered Guatemala Casi Cielo, a barista favorite</p>

                        <a href="#" class="explore-btn">
                            <span class="circle">→</span>
                            <span class="explore-text">Explore</span>
                        </a>
                    </div>

                </div>
            </div>

            <!-- SLIDE 2 -->
            <div class="numbers-slide">
                <div class="numbers-grid">

                    <div class="numbers-item">
                        <div class="number-wrap width-3percent">
                            <span class="big-number">3%</span>
                        </div>
                        <p>Of the world’s coffee is purchased by Starbucks annually</p>
                    </div>

                    <div class="numbers-divider"></div>

                    <div class="numbers-item">
                        <div class="number-wrap width-20">
                            <span class="big-number">20</span>
                        </div>
                        <p>Years we've offered Guatemala Casi Cielo, a barista favorite</p>

                        <a href="#" class="explore-btn">
                            <span class="circle">→</span>
                            <span class="explore-text">Explore</span>
                        </a>
                    </div>

                    <div class="numbers-divider"></div>

                    <div class="numbers-item">
                        <div class="number-wrap width-70">
                            <span class="big-number">70</span>
                        </div>
                        <p>Model coffee farms in Starbucks supply chain</p>
                    </div>

                </div>
            </div>

        </div>

        <div class="numbers-footer">

            <div class="numbers-dots">
                <div class="dot active"></div>
                <div class="dot"></div>
            </div>

            <div class="numbers-controls">
                <div class="arrow left" id="prevSlide">←</div>
                <div class="arrow right" id="nextSlide">→</div>
            </div>

        </div>

    </div>
</section>

<!-- GLOBAL COFFEE CREATORS SECTION -->
<section class="global-creators-section">

    <div class="global-creators-content">

        <div class="global-creators-text">
            <h1>
                10 questions for Starbucks first<br>
                Global Coffee Creators
            </h1>

            <p>
                Josiah Varghese, a Starbucks barista, and Juliana Galofre, a longtime customer,
                were chosen from nearly 1,800 applicants to spend the next year traveling
                around the world to unique Starbucks locations to tell stories about coffee,
                craft and connection on social media.
            </p>

            <a href="#" class="cup-btn">
                <span class="circle">→</span>
                <span>Learn More</span>
            </a>
        </div>

        <img src="images/twocoffee.webp" alt="Global Coffee Creators" class="global-creators-image">

    </div>

</section>

<!-- COFFEE STORIES SECTION -->
<section class="coffee-stories-section">

    <div class="coffee-stories-grid">

        <!-- CARD 1 -->
        <div class="story-card">
            <div class="story-card-inner">
                <img src="images/basket.png" alt="Ethically Sourcing Coffee">
                <div class="story-caption">
                   <span> C.A.F.E. Practices: Starbucks Approach to Ethically Sourcing Coffee </span>
                </div>

                
            </div>
        </div>

        <!-- CARD 2 -->
        <div class="story-card">
            <div class="story-card-inner">
                <img src="images/flour.png" alt="Guatemala Casi Cielo">
                <div class="story-caption-different">
                   <span> Starbucks Guatemala <br> Casi Cielo Coffee <br> Whole Bean 100% Arabic </span>
                </div>
            </div>
        </div>

        <!-- LARGE CARD -->
        <div class="story-card">
            <div class="story-card-inner">
                <img src="images/ethiopia.png" alt="Ethiopia Coffee">
                <div class="story-caption">
                   <span> Starbucks celebrates Ethiopia’s coffee legacy with new single-origin coffee </span>
                </div>
            </div>
        </div>

    </div>

</section>

<!-- 6 STARBUCKS COFFEE PAIRINGS SECTION -->
<section class="pairings-section">

    <div class="pairings-bg">

        <div class="pairings-content">

            <!-- LEFT TEXT -->
            <div class="pairings-text">
                <h1>
                    6 Starbucks coffee<br>
                    pairings that may<br>
                    surprise you
                </h1>

                <p>
                    Food pairings can help bring out those subtle differences in
                    flavor, body, acidity and aroma — and may even change the
                    way you think about coffee.
                </p>

                <a href="#" class="pairings-btn">
                    <span class="circle">→</span>
                    <span class="text-underline">Learn More</span>
                </a>
            </div>

            <!-- RIGHT VIDEO CARD -->
            <div class="pairings-card">
                <video 
                    src="images/greenapron.mp4" 
                    autoplay 
                    loop 
                    muted 
                    playsinline
                ></video>
                <div class="pause-icon">||</div>
            </div>

        </div>

    </div>

</section>

<!--  ITS A GREAT DAY FOR COFFEE SECTION  -->
<section class="hero-section">
    <div class="hero-images">
        <img src="images/grass.png" alt="Coffee Farm" class="hero-img top-left">
        <img src="images/barista.png" alt="Barista" class="hero-img bottom-left">
        <img src="images/pour.png" alt="Pouring Coffee" class="hero-img top-right">
        <img src="images/cups.png" alt="Customer" class="hero-img bottom-right">
    </div>
    
    <div class="hero-content">
        <div class="hero-vertical-line-top"></div>

        <h1>It's a Great <br> Day for Coffee</h1>
        <p>Starbucks celebrates the farmers, roasters and baristas who work relentlessly to craft the perfect cup.</p>

        <button class="learn-more-btn">Learn More</button>

        <div class="hero-vertical-line-bottom"></div>
    </div>
</section>
<br> <br>

<!-- STARBUCKS COFFEE ROAST SECTION -->
<section class="coffee-roast-section">
    <div class="coffee-roast-wrapper">

        <!-- LEFT IMAGE -->
        <div class="coffee-roast-image">
            <img src="images/seeds.png" alt="Starbucks Coffee Roast">
        </div>

        <!-- RIGHT TEXT -->
        <div class="coffee-roast-text">
            <h1>Starbucks Coffee roast spectrum explained</h1>
            <p>The art and science of the Starbucks® Roast Spectrum.</p>
            <a href="#" class="coffee-roast-btn">
                <div class="circle">→</div>
                <span>Learn More</span>
            </a>
        </div>

    </div>
</section>

<!-- More Stories Section -->
<section class="more-stories-section">

  <h2 class="more-stories-title">MORE STORIES</h2>

  <div class="more-stories-wrapper">

    <!-- Story 1 -->
    <div class="story-item">
      <img src="images/story1.jpg" alt="Story 1 Image" class="story-img">

      <div class="story-main">
        <span class="story-category">Coffee</span>
        <h3 class="story-title">
          <span>Keeping your cup full: How Starbucks is working to save the future of coffee &gt</span>
        </h3>
      </div>

      <div class="story-side">
        <p class="story-desc">
          Your morning ritual of drinking coffee is easy to take for granted, but in some areas, farmers may not be able to grow arabica coffee in as soon as 10 years. Starbucks agronomists are fighting to change that.
        </p>
        <div class="story-meta">
          September 24, 2025 — 11 MIN READ
        </div>
      </div>
    </div>

    <hr>

    <!-- Story 2 -->
    <div class="story-item">
      <img src="images/story2.jpg" alt="Story 2 Image" class="story-img">

      <div class="story-main">
        <span class="story-category">Coffee &amp; Craft</span>
        <h3 class="story-title">
          <span>6 Starbucks coffee pairings that may surprise you &gt</span>
        </h3>
      </div>

      <div class="story-side">
        <p class="story-desc">
          Food pairings can help bring out those subtle differences in flavor, body, acidity and aroma – and may even change the way you think about coffee.
        </p>
        <div class="story-meta">
          May 8, 2025 — 3 MIN READ
        </div>
      </div>
    </div>

    <hr>

    <!-- Story 3 -->
    <div class="story-item">
      <img src="images/story3.jpg" alt="Story 3 Image" class="story-img">

      <div class="story-main">
        <span class="story-category">Coffee &amp; Craft</span>
        <h3 class="story-title">
          <span>Starbucks Reserve unveils new spring menu featuring botanical flavors &gt</span>
        </h3>
      </div>

      <div class="story-side">
        <p class="story-desc">
          Embrace the season with vibrant new flavors of ube, lavender, butterfly pea flower and sakura (cherry blossom)
        </p>
        <div class="story-meta">
          March 3, 2025 — 4 MIN READ
        </div>
      </div>
    </div>

  </div>
</section>

  <!-- Pagination -->
  <div class="pagination">
    <button class="page-number active">1</button>
    <button class="page-number">2</button>
    <button class="page-next">Next Page →</button>
  </div>

</section>

<!-- FOOTER SECTION -->
<footer class="footer-section">

    <!-- Top Dark Green Section -->
    <div class="footer-top">
        <div class="footer-logo-text">
            THE STARBUCKS<br>
            COFFEE COMPANY
        </div>
        <a href="#" class="footer-values-link">
            <span class="arrow-circle">→</span>
            <span class="footer-link-text">Our Values & Commitment</span>
        </a>
    </div>

    <!-- Bottom White Section  -->
     <div class="footer-wrapper">
    <div class="footer-bottom">

        <!-- Footer Main Content -->
        <div class="footer-main">
            
            <!-- Left Column - Stay In Touch -->
            <div class="footer-column footer-stay-in-touch">
                <h3>Stay In Touch</h3>
                <p>Subscribe to all the latest Starbucks stories and news delivered right to your inbox.</p>
                
                <form class="footer-form">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" name="email" placeholder="">
                    <button type="submit" class="footer-signup-btn">Sign Up</button>
                </form>

                <div class="footer-social-icons">
                    <a href="#" class="social-icon"><img src="images/social-media.png" alt="Instagram"></a>
                    <a href="#" class="social-icon"><img src="images/threads.png" alt="Spotify"></a>
                    <a href="#" class="social-icon"><img src="images/tik-tok.png" alt="TikTok"></a>
                    <a href="#" class="social-icon"><img src="images/youtube-symbol.png" alt="YouTube"></a>
                </div>
            </div>

            <!-- Right Column - Press Center -->
            <div class="footer-column footer-press-center">
                <h3>Press Center</h3>
                <p>All the latest company news and leadership perspectives.</p>
                
                <ul class="footer-links">
                    <li><a href="#">Press Releases</a></li>
                    <li><a href="#">Company News</a></li>
                    <li><a href="#">Starbucks For The Record</a></li>
                    <li><a href="#">Leadership <span class="external-icon">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                    </span></a></li>
                </ul>
            </div>

        </div>

        <!-- Divider -->
        <div class="footer-divider">
            <hr>
            <img src="images/Starbucks-Logo.png" alt="Starbucks Logo" class="footer-divider-logo">
            <hr>
        </div>

        <!-- Bottom Links -->
        <div class="footer-bottom-links">
            <a href="#">Starbucks.com <span class="external-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
            </span></a>
            <a href="#">Career Center <span class="external-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
            </span></a>
            <a href="#">Reserve <span class="external-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
            </span></a>
            <a href="#">At Home <span class="external-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
            </span></a>
        </div>

        <!-- Footer Regions -->
        <div class="footer-regions">
            <div class="region-group">
                <h4>Canada</h4>
                <a href="#">English <span class="external-icon">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                </span></a>
                <a href="#">Français <span class="external-icon">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                </span></a>
            </div>
            <div class="region-group">
                <h4>USA</h4>
                <a href="#">English</a>
            </div>
            <div class="region-group">
                <h4>EMEA</h4>
                <a href="#">English <span class="external-icon">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                </span></a>
            </div>
            <div class="region-group">
                <h4>Latin America</h4>
                <a href="#">English <span class="external-icon">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                </span></a>
                <a href="#">Español <span class="external-icon">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                </span></a>
                <a href="#">Português <span class="external-icon">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                </span></a>
            </div>
            <div class="region-group">
                <h4>Asia</h4>
                <a href="#">English <span class="external-icon">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                </span></a>
            </div>
            <div class="region-group">
                <h4>Japan</h4>
                <a href="#">日本語 <span class="external-icon">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                </span></a>
            </div>
        </div>
        <hr class="footer-regions-line">

        <!-- Footer Legal -->
        <div class="footer-legal">
            <a href="#">Starbucks.com <span class="external-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
            </span></a>
            <a href="#">Accessibility <span class="external-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
            </span></a>
            <a href="#">Privacy Notice <span class="external-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
            </span></a>
            <a href="#">Do Not Share My Personal Information <span class="external-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
            </span></a>
            <a href="#">Cookie Preferences</a>
            <span class="copyright">© Claire's Starbucks Coffee Website.</span>
        </div>

    </div>
</footer>



<script src="ourcoffeefunction.js"></script>

</body>
</html>
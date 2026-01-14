<?php
// coffeecraftlearnmore.php
?>
<!DOCTYPE html>
<html>
<head>
    <title>Our Coffee Story - Starbucks</title>

    <!-- CSS -->
    <link rel="stylesheet" href="coffeecraft.css">
    <script src="script.js" defer></script>
</head>
<body>

<!-- GREEN NAV BAR -->
<header class="top-green-bar">
    <div class="bar-content">
        <div class="logo-small">
            <img src="images/starbuckslogov2.png" alt="Starbucks">
        </div>

        <nav class="green-nav-links">
            <a href="#">Coffee & Craft</a>
            <a href="#">People & Impact</a>
            <a href="#">News</a>
            <a href="#">Stories</a>
        </nav>

        <div class="right-icons">
            <img src="images/searches.png" alt="Search Icon">
            <img src="images/globals.png" alt="Globe Icon">
        </div>
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
                <span>Learn more</span>
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

            <?php
            // If you ever want to automate the slides in the future,
            // PHP can dynamically print slides from arrays here.
            ?>

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

        <!-- FLOATING IMAGE -->
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
                   <span> Starbucks Guatemala Casi Cielo <br> Coffee </span>
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

<!-- Hero Section -->
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
        <p>Discover the flavors, stories, and experiences that make every cup special.</p>

        <button class="learn-more-btn">Learn More</button>

        <div class="hero-vertical-line-bottom"></div>
    </div>
</section>
<br> <br>
<!-- JS -->
<script src="script.js"></script>

</body>
</html>

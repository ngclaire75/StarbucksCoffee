'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import PagesList from '../pageslist';
import './customerservice.css';

/* ── FAQ DATA ── */
const FAQ_CATEGORIES = [
  {
    id: 'rewards',
    label: 'Starbucks® Rewards',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
      </svg>
    ),
    desc: 'Stars, redemptions, tiers & account',
    faqs: [
      {
        q: 'How do I join Starbucks® Rewards?',
        a: `<p>Joining Starbucks® Rewards is free and easy! Here's how:</p><ul><li><strong>Download the Starbucks app</strong> and create an account, or</li><li>Sign up at <strong>starbucks.com/rewards</strong></li></ul><p>Once you join, you'll start earning Stars on every eligible purchase. New members receive a welcome offer to kickstart their rewards journey.</p>`
      },
      {
        q: 'How do I earn Stars?',
        a: `<p>You earn Stars in several ways:</p><ul><li><strong>2 Stars per $1</strong> when you pay with your registered Starbucks Card or through the app</li><li><strong>1 Star per $1</strong> when you pay with a credit/debit card linked to your account</li><li><strong>Bonus Stars</strong> during Double Star Days and special promotions</li><li><strong>Star Dashes</strong> — complete challenges to earn bonus Stars</li></ul><p>Tip: Always order through the app or pay with your Starbucks Card to maximize earning!</p>`
      },
      {
        q: 'How do I redeem my Stars?',
        a: `<p>You can redeem Stars at the following levels:</p><ul><li><strong>25 Stars</strong> — Free customization (extra shot, syrup, milk upgrade, etc.)</li><li><strong>100 Stars</strong> — Free hot or iced brewed coffee or tea, bakery item</li><li><strong>200 Stars</strong> — Free handcrafted drink, hot breakfast, or parfait</li><li><strong>300 Stars</strong> — Free lunch sandwich, protein box, or salad</li><li><strong>400 Stars</strong> — Free select Starbucks merchandise or select Starbucks Reserve® drink</li></ul><p>To redeem, tap "Redeem Rewards" in the app or tell your barista at checkout.</p>`
      },
      {
        q: 'When do my Stars expire?',
        a: `<p>Stars expire <strong>6 months</strong> after the end of the month they were earned, as long as your account remains active.</p><p>Your account is considered active if you earn at least 1 Star in a rolling 12-month period. If you have no earning activity for 12 months, your account becomes inactive and all Stars may be forfeited.</p><p>Check your expiration dates anytime in the app under your Rewards section.</p>`
      },
      {
        q: 'What are the Starbucks® Rewards tiers?',
        a: `<p>Starbucks® Rewards has two main levels:</p><ul><li><strong>Green level</strong> — Entry level, earned after your first purchase</li><li><strong>Gold level</strong> — Achieved by earning 300 Stars within a 12-month calendar year. Gold members receive a personalized Gold Card and exclusive benefits.</li></ul><p>Currently, all Rewards members earn at the same rate regardless of tier level, but promotions and offers may vary.</p>`
      },
      {
        q: "I didn't receive Stars for my purchase. What do I do?",
        a: `<p>If you're missing Stars, try these steps:</p><ul><li><strong>Wait 24–48 hours</strong> — Stars can sometimes take a little time to post</li><li><strong>Check your receipt</strong> — Make sure the purchase was tied to your Rewards account</li><li><strong>Report missing Stars</strong> in the app: tap Account → Activity → "Missing a receipt?"</li><li>Enter your receipt information within <strong>7 days</strong> of purchase</li></ul><p>If you still don't see your Stars after 48 hours, contact customer service with your receipt handy.</p>`
      },
      {
        q: 'Can I transfer Stars to another account?',
        a: `<p>Unfortunately, <strong>Stars cannot be transferred</strong> between accounts. However, you can:</p><ul><li>Send a Starbucks eGift card to a friend as a workaround</li><li>Consolidate multiple accounts by contacting customer service — they can help merge Star balances under certain conditions</li></ul>`
      },
    ]
  },
  {
    id: 'app',
    label: 'Mobile App & Orders',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="12" y1="18" x2="12.01" y2="18" strokeLinecap="round"/>
      </svg>
    ),
    desc: 'App issues, mobile ordering & pickup',
    faqs: [
      {
        q: 'How do I place a mobile order?',
        a: `<p>Placing a mobile order is simple:</p><ul><li>Open the Starbucks app and tap <strong>Order</strong></li><li>Select your items and customize them to your liking</li><li>Choose your <strong>pickup store</strong></li><li>Confirm your order and payment</li></ul><p>Your order starts being prepared as soon as it's placed. When you arrive, head to the <strong>handoff area</strong> (the counter with labeled drinks) — not the register.</p>`
      },
      {
        q: 'Why is mobile ordering unavailable at some stores?',
        a: `<p>Mobile ordering may be temporarily paused at a store due to:</p><ul><li>High order volume (the store is managing capacity)</li><li>Staffing constraints</li><li>Technical issues</li><li>The store is a licensed location (e.g., inside an airport or grocery store)</li></ul><p>If mobile ordering is unavailable, you can still order in person. Check back in the app later as availability typically restores quickly.</p>`
      },
      {
        q: 'How do I customize my mobile order?',
        a: `<p>Customization is one of the best parts of the Starbucks app! After selecting a drink:</p><ul><li>Tap the item to open customization options</li><li>Adjust <strong>size, milk type, shots, syrups, temperature, ice level</strong> and more</li><li>Save your creation as a <strong>Favorite</strong> for quick reordering</li><li>See calorie counts update in real time as you customize</li></ul>`
      },
      {
        q: 'The app is not working. How do I fix it?',
        a: `<p>Try these troubleshooting steps in order:</p><ul><li><strong>Force close</strong> the app completely and reopen it</li><li><strong>Check your internet</strong> — toggle Wi-Fi off/on or switch to cellular data</li><li><strong>Update the app</strong> to the latest version in the App Store or Google Play</li><li><strong>Restart your device</strong></li><li><strong>Reinstall the app</strong> — your account data will be saved when you log back in</li></ul><p>If the problem persists, contact us through the app or call 1-800-782-7282.</p>`
      },
      {
        q: 'How do I reorder my favorites?',
        a: `<p>The app makes reordering super easy:</p><ul><li>Tap the <strong>Order</strong> tab and scroll to "Favorites" or "Recent Orders"</li><li>Tap any favorite to add it directly to your cart</li><li>Or tap the <strong>star icon</strong> on any item during ordering to save it as a Favorite</li></ul><p>Your favorites sync across devices when you're logged in.</p>`
      },
      {
        q: 'How do I update my payment method in the app?',
        a: `<p>To update your payment method:</p><ul><li>Tap the <strong>Account</strong> tab (person icon)</li><li>Select <strong>Payment</strong></li><li>Add a new card or manage your Starbucks Card</li><li>Set your preferred payment method for ordering</li></ul><p>You can also reload your Starbucks Card balance directly in the app.</p>`
      },
    ]
  },
  {
    id: 'giftcards',
    label: 'Gift Cards',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="1" y1="10" x2="23" y2="10" strokeLinecap="round"/>
      </svg>
    ),
    desc: 'Balance, reloading, lost cards & eGifts',
    faqs: [
      {
        q: 'How do I check my Starbucks Card balance?',
        a: `<p>There are several easy ways to check your balance:</p><ul><li><strong>Starbucks app</strong> — Tap the Card icon; your balance is displayed instantly</li><li><strong>starbucks.com</strong> — Sign in and visit the Card section</li><li><strong>In store</strong> — Ask any partner to check your balance</li><li><strong>1-800-782-7282</strong> — Our automated system can read your balance</li></ul>`
      },
      {
        q: 'How do I reload my Starbucks Card?',
        a: `<p>You can reload your Starbucks Card in multiple ways:</p><ul><li><strong>In the app</strong> — Tap your Card, then "Add Money" and choose an amount and payment method</li><li><strong>Set up Auto-Reload</strong> — Automatically reload when your balance drops below a set amount</li><li><strong>In store</strong> — Hand cash, credit, or debit to a partner</li><li><strong>starbucks.com</strong> — Under the Card section</li></ul><p>Minimum reload amount is $10; maximum balance is $500.</p>`
      },
      {
        q: 'My Starbucks Card was lost or stolen. What do I do?',
        a: `<p>Act quickly to protect your balance:</p><ul><li>Call <strong>1-800-782-7282</strong> immediately</li><li>Or visit <strong>starbucks.com/card</strong> and report it lost/stolen</li></ul><p>If your card was <strong>registered</strong> to your account, we can transfer the remaining balance to a new card. Unregistered cards cannot be protected — which is why we strongly recommend registering your card in the app!</p>`
      },
      {
        q: 'How do I send a Starbucks eGift?',
        a: `<p>Sending a Starbucks eGift is quick:</p><ul><li>In the app, tap <strong>Pay → Send a Gift</strong></li><li>Or visit <strong>starbucks.com/gift</strong></li><li>Choose an amount ($5–$500), personalize a message, and send via email or text</li></ul><p>Recipients can add the eGift directly to their Starbucks app and start earning Stars on purchases!</p>`
      },
      {
        q: 'Can I merge multiple Starbucks Cards?',
        a: `<p>Yes! You can combine balances from multiple Starbucks Cards:</p><ul><li>In the app, tap your Card → <strong>Manage</strong> → <strong>Merge Cards</strong></li><li>Or visit starbucks.com and go to your Card section</li></ul><p>You can merge up to 5 cards at a time. The balance from the other cards will be transferred to your primary card.</p>`
      },
      {
        q: 'Where can I use my Starbucks Card?',
        a: `<p>Your Starbucks Card is accepted at:</p><ul><li>All <strong>company-operated Starbucks</strong> stores in the US, Canada, and some international locations</li><li>The <strong>Starbucks app</strong> for mobile orders</li><li><strong>starbucks.com</strong> for online purchases</li></ul><p>Note: Starbucks Cards may not be accepted at licensed stores (e.g., inside Target, airports, or grocery stores). Check the store's payment options before visiting.</p>`
      },
    ]
  },
  {
    id: 'menu',
    label: 'Menu & Drinks',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
      </svg>
    ),
    desc: 'Nutrition, allergens, customization & seasonal',
    faqs: [
      {
        q: 'How do I find nutritional information for menu items?',
        a: `<p>Starbucks provides full nutritional details in multiple places:</p><ul><li><strong>Starbucks app</strong> — Tap any menu item to see calories, fat, protein, sugar, and more. Calories update live as you customize!</li><li><strong>starbucks.com/menu</strong> — Full nutritional info and ingredient lists</li><li><strong>In store</strong> — Nutritional info is posted on menu boards for standard drinks; ask a partner for more details</li></ul>`
      },
      {
        q: 'Does Starbucks have dairy-free or plant-based options?',
        a: `<p>Absolutely! Starbucks offers a wide range of plant-based options:</p><ul><li><strong>Milk alternatives</strong>: Oatmilk, Almondmilk, Coconutmilk, Soymilk (additional charge may apply)</li><li><strong>Food</strong>: Several vegan and vegetarian items are available and clearly marked on the menu</li></ul><p>Note: Our stores handle dairy and other allergens, so cross-contact is possible. If you have a severe allergy, please speak with a store manager.</p>`
      },
      {
        q: 'How can I customize my drink?',
        a: `<p>Starbucks offers endless customization options:</p><ul><li><strong>Size</strong>: Tall, Grande, Venti, Trenta (for cold drinks)</li><li><strong>Milk</strong>: Whole, 2%, Nonfat, Oat, Almond, Coconut, Soy</li><li><strong>Espresso shots</strong>: Add, remove, or adjust shots</li><li><strong>Syrups &amp; sauces</strong>: Choose from 30+ flavors</li><li><strong>Temperature</strong>: Hot, iced, extra hot, or blended</li><li><strong>Ice level</strong>: Light, regular, or extra ice</li><li><strong>Toppings</strong>: Whipped cream, foam, drizzle, and more</li></ul><p>Use the app to see all customization options for each drink!</p>`
      },
      {
        q: 'What allergens are in Starbucks products?',
        a: `<p>Starbucks products may contain the following allergens:</p><ul><li>Milk, eggs, tree nuts (coconut, almond), soy, wheat, peanuts, fish, shellfish, sesame</li></ul><p>Because our stores prepare many products in shared spaces, <strong>cross-contact is possible</strong> for any allergen. We cannot guarantee any product is allergen-free.</p><p>For detailed allergen information on specific items, visit <strong>starbucks.com/menu</strong> or use the app. Always inform your barista of your allergies so they can take extra precautions.</p>`
      },
      {
        q: 'What seasonal beverages are currently available?',
        a: `<p>Starbucks rotates seasonal menus throughout the year, including:</p><ul><li><strong>Winter</strong>: Peppermint Mocha, Caramel Brulée Latte, Chestnut Praline Latte, Toasted White Chocolate Mocha</li><li><strong>Fall</strong>: Pumpkin Spice Latte, Pumpkin Cream Cold Brew, Salted Caramel Mocha, Apple Crisp Oat Milk Macchiato</li><li><strong>Spring/Summer</strong>: Strawberry Refreshers, Dragon Drink, Pink Drink, and various cold brew specials</li></ul><p>Check the app for current seasonal offerings at your local store. Availability may vary by location.</p>`
      },
      {
        q: 'What is Starbucks Reserve?',
        a: `<p>Starbucks Reserve® is our premium coffee experience, featuring:</p><ul><li><strong>Rare, small-lot coffees</strong> sourced from farms around the world</li><li><strong>Unique brewing methods</strong>: Clover® brewed, pour over, siphon, and more</li><li>Available at <strong>Starbucks Reserve® Roasteries</strong> (Seattle, Chicago, NYC, LA, Milan, Shanghai, Tokyo) and select Starbucks Reserve® Bar locations</li></ul><p>Starbucks Rewards Stars can be earned and redeemed at Reserve locations!</p>`
      },
    ]
  },
  {
    id: 'store',
    label: 'Store Experience',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
    ),
    desc: 'Store locator, Wi-Fi, hours & feedback',
    faqs: [
      {
        q: 'How do I find a Starbucks store near me?',
        a: `<p>Finding your nearest Starbucks is easy:</p><ul><li><strong>Starbucks app</strong> — Tap the store icon in the navigation bar to see a map of nearby locations</li><li><strong>starbucks.com/store-locator</strong> — Search by address, city, or zip code</li><li>Filter by store features: Drive-Thru, Mobile Order pickup, Outdoor Seating, Reserve, and more</li></ul><p>You can also use <strong>our site's Find a Store</strong> feature in the navigation bar above!</p>`
      },
      {
        q: 'Does Starbucks offer free Wi-Fi?',
        a: `<p>Yes! Starbucks offers <strong>free, unlimited Wi-Fi</strong> powered by Google at participating company-operated locations.</p><ul><li>Look for the <strong>"Google Starbucks"</strong> network</li><li>No password needed — simply connect</li><li>No time limit on browsing at most locations</li></ul><p>Wi-Fi availability may vary at licensed stores (inside airports, hospitals, or grocery stores).</p>`
      },
      {
        q: 'How do I share feedback about my store visit?',
        a: `<p>We'd love to hear from you! Here's how to share feedback:</p><ul><li><strong>In the app</strong>: After a purchase, you may receive a prompt to rate your experience</li><li><strong>starbucks.com/feedback</strong>: Submit detailed feedback including the store, date, and your experience</li><li><strong>Tell a partner or manager</strong> in the moment — they genuinely appreciate hearing from customers</li><li><strong>Call 1-800-782-7282</strong> for urgent concerns you'd like addressed directly</li></ul>`
      },
      {
        q: 'What are the store hours for my local Starbucks?',
        a: `<p>Store hours vary by location. The easiest ways to check:</p><ul><li><strong>Starbucks app</strong> — Find your store on the map; hours are listed on each store's detail page</li><li><strong>starbucks.com/store-locator</strong> — Search and tap a store to see current hours</li><li><strong>Google Maps</strong> — Search "Starbucks near me" for hours and real-time busy info</li></ul><p>Hours may vary on holidays, so we recommend checking the app before visiting on major holidays.</p>`
      },
      {
        q: 'Does Starbucks have accessibility accommodations?',
        a: `<p>Yes, Starbucks is committed to accessibility:</p><ul><li>Most company-operated stores are <strong>ADA-compliant</strong> with accessible entrances, seating, and restrooms</li><li><strong>Assistance animals</strong> are welcome in all Starbucks stores</li><li>Partners are trained to assist customers with disabilities</li><li>The Starbucks app includes <strong>VoiceOver and TalkBack</strong> support for visually impaired users</li><li>Large-print menus are available upon request</li></ul><p>If you need specific accommodations, feel free to contact the store or our customer service team.</p>`
      },
      {
        q: 'What is the Starbucks free refill policy?',
        a: `<p>Here's how free refills work:</p><ul><li>Starbucks® Rewards members can receive a <strong>free refill</strong> on hot or iced brewed coffee or tea (not cold brew, Nitro, or espresso drinks)</li><li>The refill must be consumed <strong>during the same store visit</strong></li><li>Show your Rewards account in the app at the handoff bar</li><li>Available at <strong>participating company-operated stores</strong> — not all licensed locations</li></ul>`
      },
    ]
  },
  {
    id: 'orders',
    label: 'Orders & Payments',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
      </svg>
    ),
    desc: 'Payment methods, refunds & billing',
    faqs: [
      {
        q: 'What payment methods does Starbucks accept?',
        a: `<p>Starbucks accepts a wide range of payment methods:</p><ul><li><strong>Starbucks Card</strong> (physical or in-app) — earns the most Stars!</li><li><strong>Credit &amp; debit cards</strong>: Visa, Mastercard, American Express, Discover</li><li><strong>Apple Pay &amp; Google Pay</strong></li><li><strong>Cash</strong> (at most locations)</li><li><strong>PayPal</strong> (via the app)</li></ul><p>Note: Accepted payment methods may vary at licensed stores.</p>`
      },
      {
        q: 'I was charged incorrectly. How do I get a refund?',
        a: `<p>We're sorry about the incorrect charge! Here's what to do:</p><ul><li><strong>In store</strong>: Ask a partner or manager immediately — they can issue a refund right away</li><li><strong>Via the app</strong>: Contact us through Help → Contact Us</li><li><strong>Call</strong> 1-800-782-7282 with your receipt handy</li></ul><p>For Starbucks Card charges: Refunds go back to your Starbucks Card balance. For credit/debit card charges: Processing takes 3–5 business days depending on your bank.</p>`
      },
      {
        q: "My order wasn't right. Can I get a remake?",
        a: `<p>Absolutely! Starbucks partners want every experience to be perfect. If your order isn't right:</p><ul><li><strong>In store</strong>: Simply let the barista or manager know — they'll remake your drink or food item gladly</li><li><strong>Mobile order</strong>: If something is wrong, bring your order receipt to the handoff counter and we'll fix it</li></ul><p>There's no need to feel awkward — we truly want you to love your Starbucks experience. If you've already left, reach out through the app or call us.</p>`
      },
      {
        q: 'Is tipping available at Starbucks?',
        a: `<p>Yes! You can tip your Starbucks partners in two ways:</p><ul><li><strong>In the app</strong>: After your purchase, you'll receive a tip prompt. You can tip within <strong>2 hours</strong> of your purchase</li><li><strong>Cash</strong>: Always appreciated at the counter or handoff bar</li></ul><p>Tip amounts in the app: $0.50, $1.00, $2.00, or a custom amount. 100% of tips go directly to the partners who served you.</p>`
      },
      {
        q: 'How do I use multiple payment methods?',
        a: `<p>You can split payment between your Starbucks Card and another form of payment:</p><ul><li>In the app, your <strong>Starbucks Card is charged first</strong>; if the balance is insufficient, the remainder is charged to your backup payment</li><li>Set up a <strong>backup payment method</strong> in the app under Account → Payment</li><li>In store, tell the barista you'd like to split payment between your Starbucks Card and another method</li></ul>`
      },
      {
        q: 'Do Starbucks gift cards expire?',
        a: `<p>Great news — <strong>Starbucks Cards and eGifts never expire</strong>, and there are no dormancy fees!</p><p>However, please note that <strong>Rewards Stars</strong> do expire 6 months after being earned with no account activity. The Stars expiration is separate from your Card balance.</p>`
      },
    ]
  },
  {
    id: 'account',
    label: 'Account & Privacy',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
      </svg>
    ),
    desc: 'Profile, password, data & privacy',
    faqs: [
      {
        q: 'How do I update my account information?',
        a: `<p>To update your profile:</p><ul><li>Open the app and tap the <strong>Account</strong> tab (person icon)</li><li>Tap <strong>Personal Info</strong> to update your name, email, phone, or birthday</li><li>Tap <strong>Password</strong> to change your password</li><li>Communication preferences can be updated under <strong>Account → Communication Preferences</strong></li></ul>`
      },
      {
        q: 'How do I reset my password?',
        a: `<p>To reset your password:</p><ul><li>On the sign-in screen, tap <strong>"Forgot password?"</strong></li><li>Enter your email address</li><li>Check your email for a reset link (check your spam folder if you don't see it)</li><li>Click the link and create a new password</li></ul><p>For security, reset links expire after 24 hours. If the link has expired, simply request a new one.</p>`
      },
      {
        q: 'How do I opt out of marketing emails?',
        a: `<p>To manage your email preferences:</p><ul><li>Open the app → <strong>Account → Communication Preferences</strong></li><li>Toggle off any categories you don't want to receive</li><li>Or click <strong>Unsubscribe</strong> at the bottom of any Starbucks marketing email</li></ul><p>Note: Even if you opt out of marketing emails, you'll still receive transactional emails (order confirmations, receipts, account security notifications).</p>`
      },
      {
        q: 'How do I delete my Starbucks account?',
        a: `<p>To request account deletion:</p><ul><li>Call <strong>1-800-782-7282</strong> to speak with a customer service representative</li><li>Or submit a request at <strong>starbucks.com/privacy</strong> under "Your Privacy Rights"</li></ul><p>Please note: Account deletion is permanent. Your Rewards Stars and Starbucks Card balance should be redeemed or transferred before deletion, as they cannot be recovered afterward.</p>`
      },
      {
        q: 'How does Starbucks use my personal data?',
        a: `<p>Starbucks collects data to improve your experience. Here's what we collect and why:</p><ul><li><strong>Purchase history</strong>: To personalize offers and recommendations</li><li><strong>Location data</strong> (with permission): To suggest nearby stores and enable mobile ordering</li><li><strong>App usage</strong>: To improve the app experience</li></ul><p>You can review the full Privacy Notice at <strong>starbucks.com/privacy</strong>. You have the right to access, delete, or restrict use of your personal data. Contact us at 1-800-782-7282 to exercise your rights.</p>`
      },
    ]
  },
];

const QUICK_REPLIES = [
  'How do I earn Stars?',
  'Check my balance',
  'App not working',
  'Free refills?',
  'Lost my card',
  'Refund request',
];

/* ── SVG icons used in the chatbot ── */
const CupIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 8h1a4 4 0 010 8h-1"/>
    <path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z"/>
    <line x1="6" y1="2" x2="6" y2="4"/>
    <line x1="10" y1="2" x2="10" y2="4"/>
    <line x1="14" y1="2" x2="14" y2="4"/>
  </svg>
);

const ThumbUpIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/>
    <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>
  </svg>
);

const ThumbDownIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z"/>
    <path d="M17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17"/>
  </svg>
);

const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
  </svg>
);

/* ── Chatbot component ── */
function ChatBot() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      content: "Hi there! I'm the Starbucks' Chatbot. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const [helpfulVotes, setHelpfulVotes] = useState({});
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  useEffect(() => {
    if (open) {
      setShowBadge(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const closePanel = () => {
    setClosing(true);
    setTimeout(() => { setOpen(false); setClosing(false); }, 200);
  };

  const sendMessage = useCallback(async (text) => {
    const userText = text || input.trim();
    if (!userText || isTyping) return;
    setInput('');

    const userMsg = { id: Date.now(), role: 'user', content: userText };
    const botMsgId = Date.now() + 1;

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    const history = [...messages, userMsg].map((m) => ({
      role: m.role === 'bot' ? 'assistant' : 'user',
      content: m.content,
    }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok) throw new Error('Network error');

      const contentType = res.headers.get('content-type') || '';

      if (contentType.includes('text/event-stream')) {
        setIsTyping(false);
        setMessages((prev) => [...prev, { id: botMsgId, role: 'bot', content: '' }]);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim();
              if (data === '[DONE]') break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  accumulated += parsed.text;
                  setMessages((prev) =>
                    prev.map((m) => (m.id === botMsgId ? { ...m, content: accumulated } : m))
                  );
                }
              } catch { /* skip */ }
            }
          }
        }
      } else {
        const data = await res.json();
        setIsTyping(false);
        setMessages((prev) => [...prev, { id: botMsgId, role: 'bot', content: data.content || 'Sorry, I encountered an error. Please try again.' }]);
      }
    } catch {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: botMsgId, role: 'bot', content: "I'm having trouble connecting right now. Please try again, or call us at 1-800-782-7282." },
      ]);
    }
  }, [input, isTyping, messages]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderContent = (text) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i}>
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
          )}
          {i < lines.length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <>
      {/* FAB button */}
      <button
        className="cs-chat-fab"
        onClick={() => open ? closePanel() : setOpen(true)}
        aria-label="Open chat support"
      >
        {open ? (
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
        )}
        {showBadge && !open && <span className="cs-chat-fab-badge">1</span>}
      </button>

      {/* Chat panel */}
      {open && (
        <div className={`cs-chat-panel${closing ? ' closing' : ''}`} role="dialog" aria-label="Starbucks Chat Support">
          {/* Header */}
          <div className="cs-chat-header">
            <div className="cs-chat-avatar">
              <img src="/images/Starbucks-Logo.png" alt="Starbucks" className="cs-chat-avatar-logo" />
            </div>
            <div className="cs-chat-header-info">
              <p className="cs-chat-header-name">Starbucks&apos; Chatbot</p>
              <div className="cs-chat-header-status">
                <span className="cs-chat-status-dot" />
                Online · Typically replies instantly
              </div>
            </div>
            <button className="cs-chat-close-btn" onClick={closePanel} aria-label="Close chat">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="cs-chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`cs-msg ${msg.role === 'user' ? 'user' : 'bot'}`}>
                <div className="cs-msg-bubble">
                  {renderContent(msg.content)}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="cs-msg bot">
                <div className="cs-msg-bubble">
                  <div className="cs-typing-dots">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          {messages.length <= 2 && (
            <div className="cs-chat-suggestions">
              {QUICK_REPLIES.map((q) => (
                <button key={q} className="cs-suggestion-chip" onClick={() => sendMessage(q)}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="cs-chat-input-wrap">
            <textarea
              ref={inputRef}
              className="cs-chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message…"
              rows={1}
              disabled={isTyping}
            />
            <button
              className="cs-chat-send"
              onClick={() => sendMessage()}
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>

          <div className="cs-chat-footer">
            Starbucks Virtual Assistant · Available 24/7
          </div>
        </div>
      )}
    </>
  );
}


/* ── Main page component ── */
export default function CustomerService() {
  const [activeCategory, setActiveCategory] = useState('rewards');
  const [openFaqs, setOpenFaqs] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [helpfulVotes, setHelpfulVotes] = useState({});

  const toggleFaq = (catId, idx) => {
    const key = `${catId}-${idx}`;
    setOpenFaqs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const voteHelpful = (key, val) => {
    setHelpfulVotes((prev) => ({ ...prev, [key]: val }));
  };

  const currentCategory = FAQ_CATEGORIES.find((c) => c.id === activeCategory);

  const filteredFaqs = searchQuery.trim()
    ? FAQ_CATEGORIES.flatMap((cat) =>
        cat.faqs
          .filter(
            (faq) =>
              faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
              faq.a.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((faq) => ({ ...faq, catId: cat.id, catLabel: cat.label }))
      )
    : null;

  return (
    <div className="cs-page">
      {/* Hero */}
      <div className="cs-hero">
        <div className="cs-hero-logo">
          <img src="/images/Starbucks-Logo.png" alt="Starbucks" className="cs-hero-brand-logo" />
          <span className="cs-hero-logo-divider" />
          <span className="cs-hero-logo-text">Help Center</span>
        </div>
        <h1>How can we help you?</h1>
        <p className="cs-hero-sub">Find answers, manage your account, and get in touch with us.</p>

        <div className="cs-search-wrap">
          <span className="cs-search-icon">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            className="cs-search"
            type="text"
            placeholder="Search for help (e.g. 'missing stars', 'refund', 'app issue')"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="cs-search-clear" onClick={() => setSearchQuery('')} aria-label="Clear search">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Quick contact strip */}
      <div className="cs-contact-strip">
        <div className="cs-contact-inner">
          <button className="cs-contact-btn" onClick={() => document.querySelector('.cs-chat-fab')?.click()}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            Chat with us
          </button>
          <div className="cs-contact-divider" />
          <a className="cs-contact-btn" href="tel:18007827282">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            1-800-782-7282
          </a>
          <div className="cs-contact-divider" />
          <button className="cs-contact-btn">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            Send us an email
          </button>
          <div className="cs-contact-divider" />
          <button className="cs-contact-btn">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Give feedback
          </button>
        </div>
      </div>

      {/* Search results or normal layout */}
      {searchQuery.trim() ? (
        <div className="cs-main" style={{ gridTemplateColumns: '1fr' }}>
          <div className="cs-content">
            <div className="cs-section-header">
              <div className="cs-section-icon">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <div>
                <h2 className="cs-section-title">
                  {filteredFaqs.length > 0
                    ? `${filteredFaqs.length} result${filteredFaqs.length !== 1 ? 's' : ''} for "${searchQuery}"`
                    : `No results for "${searchQuery}"`}
                </h2>
              </div>
            </div>

            {filteredFaqs.length === 0 ? (
              <div className="cs-no-results">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <h3>No results found</h3>
                <p>Try different keywords, or chat with us for personalized help.</p>
              </div>
            ) : (
              <div className="cs-faq-list">
                {filteredFaqs.map((faq, idx) => {
                  const key = `search-${idx}`;
                  const isOpen = openFaqs[key];
                  return (
                    <div key={key} className={`cs-faq-item${isOpen ? ' open' : ''}`}>
                      <button className="cs-faq-trigger" onClick={() => toggleFaq('search', idx)}>
                        <span>{faq.q}</span>
                        <svg className="cs-faq-chevron" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </button>
                      <div className="cs-faq-body">
                        <div className="cs-faq-answer" dangerouslySetInnerHTML={{ __html: faq.a }} />
                        <div className="cs-faq-helpful">
                          Was this helpful?
                          <button className={`cs-helpful-btn${helpfulVotes[key] === 'yes' ? ' voted' : ''}`} onClick={() => voteHelpful(key, 'yes')}>
                            <ThumbUpIcon /> Yes
                          </button>
                          <button className={`cs-helpful-btn${helpfulVotes[key] === 'no' ? ' voted' : ''}`} onClick={() => voteHelpful(key, 'no')}>
                            <ThumbDownIcon /> No
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="cs-main">
          {/* Sidebar */}
          <aside className="cs-sidebar">
            <p className="cs-sidebar-title">Help Topics</p>
            <nav className="cs-sidebar-nav">
              {FAQ_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className={`cs-sidebar-btn${activeCategory === cat.id ? ' active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* FAQ Content */}
          <div className="cs-content">
            {currentCategory && (
              <>
                <div className="cs-section-header">
                  <div className="cs-section-icon">{currentCategory.icon}</div>
                  <div>
                    <h2 className="cs-section-title">{currentCategory.label}</h2>
                    <p className="cs-section-desc">{currentCategory.desc}</p>
                  </div>
                </div>

                <div className="cs-faq-list">
                  {currentCategory.faqs.map((faq, idx) => {
                    const key = `${currentCategory.id}-${idx}`;
                    const isOpen = openFaqs[key];
                    return (
                      <div key={key} className={`cs-faq-item${isOpen ? ' open' : ''}`}>
                        <button className="cs-faq-trigger" onClick={() => toggleFaq(currentCategory.id, idx)}>
                          <span>{faq.q}</span>
                          <svg className="cs-faq-chevron" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9"/>
                          </svg>
                        </button>
                        <div className="cs-faq-body">
                          <div className="cs-faq-answer" dangerouslySetInnerHTML={{ __html: faq.a }} />
                          <div className="cs-faq-helpful">
                            Was this helpful?
                            <button className={`cs-helpful-btn${helpfulVotes[key] === 'yes' ? ' voted' : ''}`} onClick={() => voteHelpful(key, 'yes')}>
                              <ThumbUpIcon /> Yes
                            </button>
                            <button className={`cs-helpful-btn${helpfulVotes[key] === 'no' ? ' voted' : ''}`} onClick={() => voteHelpful(key, 'no')}>
                              <ThumbDownIcon /> No
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Contact cards */}
      <div className="cs-contact-section">
        <h2 className="cs-contact-title">Still need help?</h2>
        <div className="cs-contact-cards">
          <div className="cs-contact-card" onClick={() => document.querySelector('.cs-chat-fab')?.click()}>
            <div className="cs-contact-card-icon">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </div>
            <h3>Chat with us</h3>
            <p>Get instant answers from our virtual assistant, available 24/7</p>
            <span className="cs-contact-card-btn">Start Chat</span>
          </div>
          <a className="cs-contact-card" href="tel:18007827282" style={{ textDecoration: 'none' }}>
            <div className="cs-contact-card-icon">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
            </div>
            <h3>Call Us</h3>
            <p>Mon - Fri (5am - 8pm)   ·   Sat - Sun (6am - 5pm) </p>
            <span className="cs-contact-card-btn">1-800-782-7282</span>
          </a>
          <div className="cs-contact-card">
            <div className="cs-contact-card-icon">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3>Email Support</h3>
            <p>We'll respond within 1–2 business days with a full resolution</p>
            <span className="cs-contact-card-btn">Send Email</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <PagesList />

      {/* Chatbot widget */}
      <ChatBot />
    </div>
  );
}

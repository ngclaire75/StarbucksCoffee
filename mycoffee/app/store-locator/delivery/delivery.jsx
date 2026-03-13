"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { signIn, signOut, useSession } from "next-auth/react";
import "./delivery.css";

const CoffeeCup3D = dynamic(() => import("./CoffeeCup3D"), { ssr: false });

// ─── COUNTRY CODES ────────────────────────────────────────────────────────────
const COUNTRY_CODES = [
  { code: "+1",  label: "US +1"  },
  { code: "+44", label: "GB +44" },
  { code: "+60", label: "MY +60" },
  { code: "+65", label: "SG +65" },
  { code: "+61", label: "AU +61" },
  { code: "+91", label: "IN +91" },
  { code: "+81", label: "JP +81" },
  { code: "+49", label: "DE +49" },
  { code: "+33", label: "FR +33" },
  { code: "+86", label: "CN +86" },
];

// ─── MENU DATA ────────────────────────────────────────────────────────────────
const MENU_CATEGORIES = [
  { id: "trending",    label: "Trending"                },
  { id: "protein",     label: "Protein Beverages"       },
  { id: "hot-coffee",  label: "Hot Coffee"              },
  { id: "cold-coffee", label: "Cold Coffee"             },
  { id: "frappuccino", label: "Frappuccino® Blended"    },
  { id: "matcha",      label: "Matcha"                  },
  { id: "hot-tea",     label: "Hot Tea"                 },
  { id: "cold-tea",    label: "Cold Tea"                },
  { id: "refreshers",  label: "Refreshers"              },
  { id: "food",        label: "Food"                    },
];

const MENU_ITEMS = [
  // Trending
  { id: 1,  cat: "trending",    name: "Iced Ube Coconut Macchiato",           price: 7.35, desc: "Full-bodied espresso layered over creamy milk, toasted-coconut syrup, finished with ube cold foam.",        tag: "popular"  },
  { id: 2,  cat: "trending",    name: "Brown Sugar Oat Milk Shaken Espresso", price: 6.95, desc: "Starbucks® Blonde espresso, brown sugar syrup, oat milk, over ice.",                                        tag: "popular"  },
  { id: 3,  cat: "trending",    name: "Matcha Lemonade",                      price: 5.75, desc: "Matcha tea blend lemonade poured over ice.",                                                                tag: "new"      },
  { id: 4,  cat: "trending",    name: "Dragon Drink",                         price: 5.95, desc: "Mango dragonfruit refresher with coconut milk and real pieces of dragonfruit.",                             tag: "popular"  },
  { id: 5,  cat: "trending",    name: "Caramel Ribbon Crunch Frappuccino",    price: 7.25, desc: "Dark caramel sauce, caramel drizzle, whipped cream, blended with coffee.",                                  tag: null       },

  // Protein
  { id: 6,  cat: "protein",     name: "Chocolate Protein Latte",              price: 7.55, desc: "Rich espresso with chocolate, protein powder blend, oat milk.",                                             tag: "new"      },
  { id: 7,  cat: "protein",     name: "Vanilla Protein Cold Brew",            price: 6.85, desc: "Smooth cold brew with vanilla and protein blend, poured over ice.",                                         tag: null       },
  { id: 8,  cat: "protein",     name: "Strawberry Protein Refresher",         price: 6.45, desc: "Strawberry acai base with protein boost and ice.",                                                          tag: null       },

  // Hot Coffee
  { id: 9,  cat: "hot-coffee",  name: "Pike Place® Roast",                   price: 4.15, desc: "Smooth, well-rounded with subtle notes of cocoa and toasted nuts.",                                         tag: null       },
  { id: 10, cat: "hot-coffee",  name: "Caffè Americano",                      price: 4.45, desc: "Espresso shots topped with hot water for a rich, bold taste.",                                              tag: null       },
  { id: 11, cat: "hot-coffee",  name: "Cappuccino",                           price: 5.25, desc: "Dark espresso beneath a frothy layer of thick, creamy foam.",                                               tag: null       },
  { id: 12, cat: "hot-coffee",  name: "Caffè Latte",                          price: 5.45, desc: "Starbucks® espresso with steamed milk and light foam.",                                                     tag: null       },
  { id: 13, cat: "hot-coffee",  name: "Caramel Macchiato",                    price: 6.15, desc: "Freshly steamed milk vanilla syrup, espresso, caramel sauce.",                                             tag: "popular"  },
  { id: 14, cat: "hot-coffee",  name: "Flat White",                           price: 5.95, desc: "Ristretto shots of espresso with velvety steamed whole milk.",                                              tag: null       },
  { id: 15, cat: "hot-coffee",  name: "Starbucks Reserve® Dark Roast",        price: 4.95, desc: "Complex flavors from small-lot coffee, dark and bold.",                                                     tag: null       },

  // Cold Coffee
  { id: 16, cat: "cold-coffee", name: "Iced Caffè Americano",                 price: 4.65, desc: "Espresso shots topped with water and poured over ice.",                                                     tag: null       },
  { id: 17, cat: "cold-coffee", name: "Iced Caramel Macchiato",               price: 6.35, desc: "Vanilla syrup, milk, espresso and caramel drizzle over ice.",                                              tag: "popular"  },
  { id: 18, cat: "cold-coffee", name: "Cold Brew Coffee",                     price: 5.45, desc: "Slow-steeped for 20 hours, smooth and sweet without bitterness.",                                           tag: null       },
  { id: 19, cat: "cold-coffee", name: "Nitro Cold Brew",                      price: 5.95, desc: "Cold brew infused with nitrogen for a smooth, creamy texture.",                                             tag: "popular"  },
  { id: 20, cat: "cold-coffee", name: "Iced Shaken Espresso",                 price: 5.75, desc: "Classic espresso shaken with ice and poured over milk.",                                                    tag: null       },
  { id: 21, cat: "cold-coffee", name: "Pumpkin Cream Cold Brew",              price: 6.55, desc: "Cold brew topped with pumpkin cream cold foam and pumpkin spice.",                                          tag: "seasonal" },

  // Frappuccino
  { id: 22, cat: "frappuccino", name: "Caramel Frappuccino®",                 price: 6.75, desc: "Coffee, milk, ice, caramel syrup, topped with whipped cream.",                                             tag: "popular"  },
  { id: 23, cat: "frappuccino", name: "Mocha Frappuccino®",                   price: 6.75, desc: "Coffee, mocha sauce, milk and ice, topped with whipped cream.",                                             tag: null       },
  { id: 24, cat: "frappuccino", name: "Java Chip Frappuccino®",               price: 6.95, desc: "Mocha sauce, Frappuccino® chips, coffee, milk, ice, and whipped cream.",                                   tag: null       },
  { id: 25, cat: "frappuccino", name: "Vanilla Bean Crème Frappuccino®",      price: 6.45, desc: "Creamy blend of vanilla bean powder, ice and milk, topped with whipped cream.",                            tag: null       },
  { id: 26, cat: "frappuccino", name: "Strawberry Crème Frappuccino®",        price: 6.45, desc: "Strawberry puree, milk, ice, finished with whipped cream.",                                                tag: null       },

  // Matcha
  { id: 27, cat: "matcha",      name: "Iced Matcha Tea Latte",                price: 5.95, desc: "Sweetened matcha tea blend with milk, poured over ice.",                                                    tag: "popular"  },
  { id: 28, cat: "matcha",      name: "Hot Matcha Tea Latte",                 price: 5.75, desc: "Finely ground matcha with steamed milk, lightly sweet.",                                                    tag: null       },
  { id: 29, cat: "matcha",      name: "Matcha Crème Frappuccino®",            price: 6.55, desc: "Matcha tea blend, milk and ice finished with whipped cream.",                                               tag: null       },

  // Hot Tea
  { id: 30, cat: "hot-tea",     name: "Chai Tea Latte",                       price: 5.65, desc: "Black tea infused with cinnamon, clove and spices with steamed milk.",                                      tag: "popular"  },
  { id: 31, cat: "hot-tea",     name: "Mint Majesty™",                        price: 3.95, desc: "Peppermint and spearmint full-leaf herbal infusion.",                                                       tag: null       },
  { id: 32, cat: "hot-tea",     name: "Emperor's Clouds & Mist®",             price: 3.95, desc: "Mellow, rich green tea grown in the mist-shrouded mountains of China.",                                    tag: null       },
  { id: 33, cat: "hot-tea",     name: "Teavana® Earl Grey Tea",               price: 3.95, desc: "Smooth, full-bodied black tea with bergamot.",                                                              tag: null       },

  // Cold Tea
  { id: 34, cat: "cold-tea",    name: "Iced Chai Tea Latte",                  price: 5.85, desc: "Chai tea concentrate with milk over ice, smooth and spiced.",                                               tag: "popular"  },
  { id: 35, cat: "cold-tea",    name: "Iced Green Tea Lemonade",              price: 4.95, desc: "Teavana® green tea, mint, honey blend and lemonade over ice.",                                              tag: null       },
  { id: 36, cat: "cold-tea",    name: "Iced Black Tea Lemonade",              price: 4.75, desc: "Bold iced black tea with lemonade over ice.",                                                               tag: null       },
  { id: 37, cat: "cold-tea",    name: "Iced Peach Green Tea Lemonade",        price: 5.15, desc: "Peach-infused green tea with lemonade and ice.",                                                            tag: null       },

  // Refreshers
  { id: 38, cat: "refreshers",  name: "Mango Dragonfruit Refresher",          price: 5.45, desc: "Sweet and tangy tropical flavors with real fruit pieces over ice.",                                         tag: "popular"  },
  { id: 39, cat: "refreshers",  name: "Strawberry Açaí Refresher",            price: 5.45, desc: "Sweet strawberry and flavors from the açaí berry over ice.",                                               tag: "popular"  },
  { id: 40, cat: "refreshers",  name: "Pink Drink",                           price: 5.95, desc: "Strawberry acai refresher with coconut milk and freeze-dried strawberries.",                                tag: "popular"  },
  { id: 41, cat: "refreshers",  name: "Paradise Drink",                       price: 5.95, desc: "Pineapple passionfruit refresher with coconut milk.",                                                       tag: "new"      },
  { id: 42, cat: "refreshers",  name: "Violet Drink",                         price: 5.95, desc: "Very Berry Hibiscus Refresher with coconut milk.",                                                          tag: null       },

  // Food
  { id: 43, cat: "food",        name: "Butter Croissant",                     price: 3.75, desc: "Flaky, golden-brown croissant made with real butter.",                                                      tag: null       },
  { id: 44, cat: "food",        name: "Blueberry Muffin",                     price: 3.95, desc: "Moist, tender muffin bursting with blueberries.",                                                           tag: null       },
  { id: 45, cat: "food",        name: "Chicken & Bacon Sandwich",             price: 8.45, desc: "Grilled chicken and bacon with white cheddar on artisan bun.",                                              tag: "popular"  },
  { id: 46, cat: "food",        name: "Spinach, Feta & Egg White Wrap",       price: 7.25, desc: "Cage-free egg whites, spinach, feta and tomatoes in a multigrain wrap.",                                    tag: null       },
  { id: 47, cat: "food",        name: "Birthday Cake Pop",                    price: 3.25, desc: "Vanilla cake with pink frosting on a white-chocolate dipped stick.",                                        tag: "popular"  },
  { id: 48, cat: "food",        name: "Chocolate Croissant",                  price: 4.15, desc: "Buttery croissant filled with rich dark chocolate.",                                                        tag: null       },
  { id: 49, cat: "food",        name: "Marshmallow Dream Bar",                price: 3.45, desc: "A sweet rice cereal bar with marshmallow and white chocolate drizzle.",                                     tag: null       },
];

// ─── DRIVERS ──────────────────────────────────────────────────────────────────
const DRIVERS = [
  { name: "Marcus T.",  vehicle: "Toyota Camry",  plate: "7ACE312", rating: 4.97, trips: 1842, avatar: "MT" },
  { name: "Sarah K.",   vehicle: "Honda Civic",   plate: "8BDX509", rating: 4.93, trips:  976, avatar: "SK" },
  { name: "James R.",   vehicle: "Hyundai Elantra",plate: "3ZZK144", rating: 4.88, trips: 2310, avatar: "JR" },
  { name: "Priya N.",   vehicle: "Subaru Impreza", plate: "5MKL778", rating: 4.99, trips:  641, avatar: "PN" },
];

const PHASES = [
  { key: "placing",   label: "Order Placed",        iconKey: "Clipboard",   dur: 2000  },
  { key: "accepted",  label: "Order Accepted",       iconKey: "CheckCircle", dur: 4000  },
  { key: "preparing", label: "Being Prepared",       iconKey: "CoffeeIcon",  dur: 8000  },
  { key: "on_way",    label: "Driver on the way",    iconKey: "Scooter",     dur: 15000 },
  { key: "delivered", label: "Delivered!",           iconKey: "Confetti",    dur: null  },
];

// ─── UTILS ────────────────────────────────────────────────────────────────────
const lerp = (a, b, t) => a + (b - a) * t;

const haversineKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Ic = {
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Cart: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  ),
  Bell: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  User: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Plus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Minus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Close: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Star: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  MapPin: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  Truck: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
      <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
  Google: () => (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  ArrowLeft: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  Refresh: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  Trash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  ),
  Pencil: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  ShoppingCart: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  ),
  BellLarge: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  Clipboard: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  CoffeeIcon: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
    </svg>
  ),
  Scooter: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5 17H3v-4l2-5h7l1 5h-1"/><path d="M13 17h-2"/><path d="M19 17h2v-5l-3-4h-3"/>
    </svg>
  ),
  Confetti: () => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 22l5-12 7 7-12 5z"/><path d="M7 10l1-4"/><path d="M14 7l4-1"/><path d="M17 17l3 1"/><path d="M10 14l1 3"/>
      <circle cx="16" cy="8" r="1" fill="currentColor"/><circle cx="21" cy="5" r="1" fill="currentColor"/>
    </svg>
  ),
  StarFill: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#F5A623">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  UserX: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="18" y1="8" x2="23" y2="13"/><line x1="23" y1="8" x2="18" y2="13"/>
    </svg>
  ),
};

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div className="dd-toast-stack">
      {toasts.map(t => (
        <div key={t.id} className={`dd-toast dd-toast--${t.type || "info"}`}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── MENU CARD ────────────────────────────────────────────────────────────────
function MenuCard({ item, qty, onCart }) {
  return (
    <div className="dd-item-card">
      <div className="dd-item-img-wrap">
        <div className="dd-skeleton dd-item-img" />
        {item.tag && (
          <span className={`dd-item-badge dd-badge--${item.tag}`}>
            {item.tag === "popular" ? "Popular" : item.tag === "new" ? "New" : item.tag === "seasonal" ? "Seasonal" : item.tag}
          </span>
        )}
      </div>
      <div className="dd-item-body">
        <p className="dd-item-name">{item.name}</p>
        <p className="dd-item-desc">{item.desc}</p>
        <div className="dd-item-ft">
          <span className="dd-item-price">${item.price.toFixed(2)}</span>
          <div className="dd-item-ctrl">
            {qty > 0 && (
              <button className="dd-qty-btn" onClick={() => onCart({ ...item, delta: -1 })} aria-label="Remove one">
                <Ic.Minus />
              </button>
            )}
            {qty > 0 && <span className="dd-qty-num">{qty}</span>}
            <button className="dd-qty-btn dd-qty-btn--add" onClick={() => onCart({ ...item, delta: 1 })} aria-label="Add to cart">
              <Ic.Plus />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LOCATION CONSENT MODAL ───────────────────────────────────────────────────
function LocationConsentModal({ open, onAllow, onDeny }) {
  if (!open) return null;
  return (
    <div className="dd-modal-backdrop" onClick={onDeny}>
      <div className="dd-modal dd-modal--consent" onClick={e => e.stopPropagation()}>
        <div className="dd-modal-hd">
          <h2 className="dd-modal-title">Allow Location Access</h2>
          <button className="dd-modal-close" onClick={onDeny} aria-label="Close"><Ic.Close /></button>
        </div>
        <div className="dd-consent-body">
          <div className="dd-consent-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <p className="dd-consent-title">Find Starbucks near you</p>
          <p className="dd-consent-text">
            To show Starbucks stores in your area, we need access to your location.
            Your browser will ask for permission next — you can deny at any time.
          </p>
        </div>
        <div className="dd-consent-btns">
          <button className="dd-consent-btn-deny" onClick={onDeny}>No Thanks</button>
          <button className="dd-consent-btn-allow" onClick={onAllow}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            Allow Location
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── STORES NEAR YOU ─────────────────────────────────────────────────────────
function StoresNearYou({ userLat, userLng, onRequestLocation, locationLoading, locationDenied }) {
  const [stores, setStores]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const scrollRef             = useRef(null);

  useEffect(() => {
    if (!userLat || !userLng) return;
    setLoading(true);
    setError(null);
    fetch(`/api/stores/nearby?lat=${userLat}&lng=${userLng}`)
      .then(r => r.json())
      .then(d => { setStores(d.stores || []); setLoading(false); })
      .catch(() => { setError("Could not load stores."); setLoading(false); });
  }, [userLat, userLng]);

  const formatReviewCount = (count) => {
    if (!count) return "0";
    if (count >= 1000) return `${Math.floor(count / 1000)}k+`;
    return count.toString();
  };

  const scrollCarousel = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 300, behavior: "smooth" });
    }
  };

  if (!userLat) return (
    <section className="dd-stores-section">
      <div className="dd-stores-header">
        <h2 className="dd-section-title">Stores near you</h2>
      </div>
      <div className="dd-find-stores-wrap">
        {locationDenied ? (
          <>
            <div className="dd-find-stores-denied-icon">
              <Ic.MapPin />
            </div>
            <p className="dd-find-stores-denied-msg">Location access was denied.</p>
            <p className="dd-find-stores-hint">Please allow location access in your browser settings, then try again.</p>
            <button className="dd-find-stores-btn" onClick={onRequestLocation}>
              <Ic.MapPin /> Try again
            </button>
          </>
        ) : (
          <>
            <div className="dd-find-stores-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <p className="dd-find-stores-tagline">Find Starbucks stores in your country</p>
            <p className="dd-find-stores-hint">We&apos;ll ask for your location once to show nearby stores. You can deny at any time.</p>
            <button
              className="dd-find-stores-btn"
              onClick={onRequestLocation}
              disabled={locationLoading}
            >
              {locationLoading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin .8s linear infinite" }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Locating…
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  Find stores near you
                </>
              )}
            </button>
          </>
        )}
      </div>
    </section>
  );

  return (
    <section className="dd-stores-section">
      <div className="dd-stores-header">
        <h2 className="dd-section-title">Stores near you</h2>
        <div className="dd-stores-nav">
          <button className="dd-stores-nav-btn" onClick={() => scrollCarousel(-1)} aria-label="Previous">
            <Ic.ChevronLeft />
          </button>
          <button className="dd-stores-nav-btn" onClick={() => scrollCarousel(1)} aria-label="Next">
            <Ic.ChevronRight />
          </button>
        </div>
      </div>

      {loading && (
        <div className="dd-stores-carousel">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="dd-store-card-new dd-store-card--skeleton">
              <div className="dd-store-card-top">
                <div className="dd-skeleton dd-store-logo-circle" />
                <div style={{ flex: 1 }}>
                  <div className="dd-skeleton" style={{ height: 14, width: "80%", marginBottom: 8 }} />
                  <div className="dd-skeleton" style={{ height: 12, width: "60%" }} />
                </div>
              </div>
              <div className="dd-skeleton" style={{ height: 12, width: "100%" }} />
              <div className="dd-skeleton" style={{ height: 32, borderRadius: 99 }} />
            </div>
          ))}
        </div>
      )}

      {error && <p className="dd-stores-empty">{error}</p>}

      {!loading && !error && stores.length === 0 && (
        <p className="dd-stores-empty">No Starbucks stores found in your area.</p>
      )}

      {!loading && stores.length > 0 && (
        <div className="dd-stores-carousel" ref={scrollRef}>
          {stores.map(s => (
            <div key={s.id} className="dd-store-card-new">
              <div className="dd-store-card-top">
                <div className="dd-store-logo-circle">
                  <svg viewBox="0 0 44 44" width="44" height="44">
                    <circle cx="22" cy="22" r="22" fill="#00704A"/>
                    <text x="22" y="28" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="sans-serif">S</text>
                  </svg>
                </div>
                <div className="dd-store-card-info">
                  <span className="dd-store-card-name">{s.name}</span>
                  {s.rating && (
                    <div className="dd-store-card-rating-row">
                      <span className="dd-store-card-star"><Ic.StarFill /></span>
                      <span className="dd-store-card-rating-val">{s.rating.toFixed(1)}</span>
                      <span className="dd-store-card-rating-count">({formatReviewCount(s.reviewCount)} ratings)</span>
                    </div>
                  )}
                  <div className="dd-store-card-tags">
                    <span>Sandwiches</span>
                    <span className="dd-store-card-dot"> · </span>
                    <span>Coffee</span>
                    <span className="dd-store-card-dot"> · </span>
                    <span>Sweets</span>
                  </div>
                </div>
              </div>

              <p className="dd-store-card-addr">{s.address}</p>

              <div className="dd-store-card-actions">
                <button className="dd-store-btn-order">Order Now</button>
                <button className="dd-store-btn-menu">View Menu</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── CART DRAWER ──────────────────────────────────────────────────────────────
function CartDrawer({ open, onClose, cartItems, onCart, onPlaceOrder }) {
  const DELIVERY_FEE = 1.99;
  const TAX_RATE = 0.0875;

  const subtotal = useMemo(() =>
    cartItems.reduce((s, i) => s + i.price * i.qty, 0), [cartItems]);
  const tax   = subtotal * TAX_RATE;
  const total = subtotal + DELIVERY_FEE + tax;

  return (
    <>
      <div className={`dd-overlay ${open ? "dd-overlay--show" : ""}`} onClick={onClose} />
      <div className={`dd-cart-drawer ${open ? "dd-cart-drawer--open" : ""}`} role="dialog" aria-label="Cart">
        <div className="dd-cart-hd">
          <h2 className="dd-cart-title">Your Cart</h2>
          <button className="dd-icon-btn" onClick={onClose} aria-label="Close cart"><Ic.Close /></button>
        </div>

        {cartItems.length === 0 ? (
          <div className="dd-cart-empty">
            <span className="dd-cart-empty-icon"><Ic.ShoppingCart /></span>
            <p>Your cart is empty</p>
            <p className="dd-cart-empty-sub">Add items from the menu above</p>
          </div>
        ) : (
          <>
            <div className="dd-cart-items">
              {cartItems.map(ci => (
                <div key={ci.id} className="dd-cart-item">
                  <div className="dd-skeleton dd-cart-item-img" />
                  <div className="dd-cart-item-info">
                    <p className="dd-cart-item-name">{ci.name}</p>
                    <p className="dd-cart-item-price">${(ci.price * ci.qty).toFixed(2)}</p>
                  </div>
                  <div className="dd-cart-item-ctrl">
                    <button className="dd-qty-btn" onClick={() => onCart({ ...ci, delta: -1 })} aria-label="Decrease">
                      <Ic.Minus />
                    </button>
                    <span className="dd-qty-num">{ci.qty}</span>
                    <button className="dd-qty-btn dd-qty-btn--add" onClick={() => onCart({ ...ci, delta: 1 })} aria-label="Increase">
                      <Ic.Plus />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="dd-cart-ft">
              <div className="dd-cart-totals">
                <div className="dd-cart-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="dd-cart-row"><span>Delivery fee</span><span>${DELIVERY_FEE.toFixed(2)}</span></div>
                <div className="dd-cart-row"><span>Taxes &amp; fees</span><span>${tax.toFixed(2)}</span></div>
                <div className="dd-cart-row dd-cart-total"><span>Total</span><span>${total.toFixed(2)}</span></div>
              </div>
              <button className="dd-place-order-btn" onClick={onPlaceOrder}>
                Place Order · ${total.toFixed(2)}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ─── DELIVERY TRACKER ────────────────────────────────────────────────────────
function DeliveryTracker({ phase, phaseIdx, driver, driverPos, userLat, userLng, eta, cartItems, total }) {
  const GMAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const mapUrl = useMemo(() => {
  if (!driverPos || !userLat || !GMAPS_KEY) return null;
  const center = `${lerp(driverPos.lat, userLat, 0.5)},${lerp(driverPos.lng, userLng, 0.5)}`;
  const zoom   = 14;
  const dMarker = `color:green|label:D|${driverPos.lat},${driverPos.lng}`;
  const uMarker = `color:red|label:H|${userLat},${userLng}`;
  return `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=${zoom}&size=400x200&scale=2&markers=${encodeURIComponent(dMarker)}&markers=${encodeURIComponent(uMarker)}&key=${GMAPS_KEY}`;
}, [driverPos, userLat, userLng, GMAPS_KEY]);

  const distToUser = useMemo(() => {
    if (!driverPos || !userLat) return null;
    const km = haversineKm(driverPos.lat, driverPos.lng, userLat, userLng);
    return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
  }, [driverPos, userLat, userLng]);

  return (
    <div className="dd-tracker-wrap">
      {phase === "delivered" ? (
        <div className="dd-delivered-wrap">
          <div className="dd-delivered-icon"><Ic.Confetti /></div>
          <h3 className="dd-delivered-title">Your order was delivered!</h3>
          <p className="dd-delivered-sub">Enjoy your Starbucks. Have a great day!</p>
        </div>
      ) : (
        <>
          {/* ETA Banner */}
          {eta > 0 && (
            <div className="dd-eta-banner">
              <Ic.Truck />
              <div className="dd-eta-text">
                <span className="dd-eta-label">Estimated delivery</span>
                <span className="dd-eta-val">{eta} min away</span>
              </div>
              {distToUser && <span className="dd-eta-dist">{distToUser}</span>}
            </div>
          )}

          {/* Status Timeline */}
          <div className="dd-status-timeline">
            {PHASES.filter(p => p.key !== "delivered").map((p, i) => (
              <div key={p.key} className={`dd-step ${i < phaseIdx ? "dd-step--done" : i === phaseIdx ? "dd-step--active" : ""}`}>
                <div className="dd-step-dot">
                  {i < phaseIdx ? <Ic.Check /> : (Ic[p.iconKey] ? <span>{(() => { const C = Ic[p.iconKey]; return <C />; })()}</span> : null)}
                </div>
                <span className="dd-step-label">{p.label}</span>
                {i < PHASES.length - 2 && <div className="dd-step-line" />}
              </div>
            ))}
          </div>

          {/* Driver card */}
          {driver && phaseIdx >= 3 && (
            <div className="dd-driver-card">
              <div className="dd-driver-avatar">{driver.avatar}</div>
              <div className="dd-driver-info">
                <p className="dd-driver-name">{driver.name}</p>
                <p className="dd-driver-vehicle">{driver.vehicle} · {driver.plate}</p>
                <p className="dd-driver-rating">
                  <Ic.Star /> {driver.rating} · {driver.trips.toLocaleString()} deliveries
                </p>
              </div>
            </div>
          )}

          {/* 3D cup or map */}
          <div className="dd-tracker-visual">
            {phaseIdx < 3 ? (
              <div className="dd-tracker-3d">
                <CoffeeCup3D size={160} />
                <p className="dd-tracker-3d-label">
                  {phaseIdx === 0 ? "Placing your order…" : phaseIdx === 1 ? "Order confirmed!" : "Barista is brewing…"}
                </p>
              </div>
            ) : mapUrl ? (
              <div className="dd-tracker-map-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={mapUrl} alt="Driver location map" className="dd-tracker-map-img" />
                <span className="dd-tracker-map-badge">Live tracking</span>
              </div>
            ) : (
              <div className="dd-tracker-3d">
                <CoffeeCup3D size={160} />
                <p className="dd-tracker-3d-label">Driver is on the way!</p>
              </div>
            )}
          </div>

          {/* Order summary */}
          {cartItems && cartItems.length > 0 && (
            <div className="dd-tracker-order">
              <p className="dd-tracker-order-title">Order Summary</p>
              {cartItems.map(ci => (
                <div key={ci.id} className="dd-tracker-order-row">
                  <span>{ci.qty}× {ci.name}</span>
                  <span>${(ci.price * ci.qty).toFixed(2)}</span>
                </div>
              ))}
              <div className="dd-tracker-order-total">
                <span>Total</span><span>${total?.toFixed(2)}</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── NOTIFICATION PANEL ───────────────────────────────────────────────────────
function NotificationPanel({ open, onClose, phase, phaseIdx, driver, driverPos, userLat, userLng, eta, cartItems, total }) {
  return (
    <>
      <div className={`dd-overlay ${open ? "dd-overlay--show" : ""}`} onClick={onClose} />
      <div className={`dd-notif-panel ${open ? "dd-notif-panel--open" : ""}`} role="dialog" aria-label="Delivery tracking">
        <div className="dd-notif-hd">
          <h2 className="dd-notif-title">Notifications</h2>
          <button className="dd-icon-btn" onClick={onClose} aria-label="Close"><Ic.Close /></button>
        </div>
        <div className="dd-notif-body">
          {phase ? (
            <DeliveryTracker
              phase={phase}
              phaseIdx={phaseIdx}
              driver={driver}
              driverPos={driverPos}
              userLat={userLat}
              userLng={userLng}
              eta={eta}
              cartItems={cartItems}
              total={total}
            />
          ) : (
            <div className="dd-notif-empty">
              <span className="dd-notif-empty-icon"><Ic.BellLarge /></span>
              <p>No active orders</p>
              <p className="dd-notif-empty-sub">Place an order to track your delivery here</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── ACCOUNT NOT FOUND MODAL ──────────────────────────────────────────────────
function AccountNotFoundModal({ open, onClose, onSignUp }) {
  if (!open) return null;
  return (
    <div className="dd-modal-backdrop" onClick={onClose}>
      <div className="dd-modal" onClick={e => e.stopPropagation()}>
        <button className="dd-modal-close" onClick={onClose} aria-label="Close"><Ic.Close /></button>
        <div className="dd-anf-wrap">
          <div className="dd-anf-icon"><Ic.UserX /></div>
          <h2 className="dd-modal-title">Account Not Found</h2>
          <p className="dd-modal-sub">
            The Google account you used is not registered. Please sign up to create an account.
          </p>
          <button className="dd-primary-btn" onClick={onSignUp}>Sign Up</button>
          <button className="dd-text-btn" style={{ marginTop: 8 }} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── AUTH MODAL ───────────────────────────────────────────────────────────────
function AuthModal({ open, onClose }) {
  const [tab, setTab] = useState("signin");

  if (!open) return null;

  const handleGoogle = () => {
    localStorage.setItem("sbux_auth_intent", tab);
    signIn("google", { callbackUrl: window.location.href });
  };

  return (
    <div className="dd-modal-backdrop" onClick={onClose}>
      <div className="dd-modal" onClick={e => e.stopPropagation()}>

        <div className="dd-auth-tabs">
          <button className={`dd-auth-tab ${tab === "signin" ? "dd-auth-tab--active" : ""}`} onClick={() => setTab("signin")}>Sign in</button>
          <button className={`dd-auth-tab ${tab === "signup" ? "dd-auth-tab--active" : ""}`} onClick={() => setTab("signup")}>Sign up</button>
        </div>

        {tab === "signin" ? (
          <>
            <h2 className="dd-modal-title">Welcome back</h2>
            <p className="dd-modal-sub">Sign in to track your order and save addresses.</p>
          </>
        ) : (
          <>
            <h2 className="dd-modal-title">Create account</h2>
            <p className="dd-modal-sub">Join to get exclusive deals and faster checkout.</p>
          </>
        )}

        <button className="dd-google-btn" onClick={handleGoogle}>
          <Ic.Google />
          <span>{tab === "signin" ? "Continue with Google" : "Sign up with Google"}</span>
        </button>

        <p className="dd-modal-legal">
          By continuing you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}

// ─── ADDRESS MODAL ────────────────────────────────────────────────────────────
function AddressModal({ open, onClose, onSelect, savedAddresses, onSaveAddresses, session, currentAddress, onOpenAuth }) {
  const [step, setStep]         = useState("list");
  const [editingIdx, setEditingIdx] = useState(null);
  const [country, setCountry]   = useState("+1");
  const [phone, setPhone]       = useState("");
  const [otp, setOtp]           = useState("");
  const [loading, setLoading]   = useState(false);
  const [err, setErr]           = useState("");
  const [addrForm, setAddrForm] = useState({ street: "", apt: "", city: "", state: "", zip: "" });

  const resetForm = () => {
    setStep("list");
    setEditingIdx(null);
    setErr("");
    setPhone("");
    setOtp("");
    setAddrForm({ street: "", apt: "", city: "", state: "", zip: "" });
  };

  const sendOtp = async () => {
    if (!phone.trim()) { setErr("Enter a phone number."); return; }
    setLoading(true); setErr("");
    try {
      const res = await fetch("/api/delivery/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `${country}${phone}` }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Send failed");
      setStep("otp");
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  };

  const verifyOtp = async () => {
    if (!otp.trim()) { setErr("Enter the OTP code."); return; }
    setLoading(true); setErr("");
    try {
      const res = await fetch("/api/delivery/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `${country}${phone}`, code: otp }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Invalid code");
      setStep("form");
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  };

  const saveAddress = () => {
    const { street, city, state, zip } = addrForm;
    if (!street || !city || !state || !zip) { setErr("Fill all required fields."); return; }
    const fullAddress = `${street}${addrForm.apt ? ` ${addrForm.apt},` : ","} ${city}, ${state} ${zip}`;
    const entry = { ...addrForm, fullAddress, phone: `${country}${phone}`, country };
    let updated;
    if (editingIdx !== null) {
      updated = savedAddresses.map((a, i) => i === editingIdx ? entry : a);
    } else {
      updated = [entry, ...savedAddresses];
    }
    onSaveAddresses(updated);
    onSelect(fullAddress);
    onClose();
    resetForm();
  };

  const deleteAddress = (e, idx) => {
    e.stopPropagation();
    if (savedAddresses[idx].fullAddress === currentAddress) onSelect("");
    const updated = savedAddresses.filter((_, i) => i !== idx);
    onSaveAddresses(updated);
  };

  const startEdit = (e, idx) => {
    e.stopPropagation();
    const a = savedAddresses[idx];
    setAddrForm({ street: a.street || "", apt: a.apt || "", city: a.city || "", state: a.state || "", zip: a.zip || "" });
    setCountry(a.country || "+1");
    setPhone(a.phone ? a.phone.replace(a.country || "+1", "") : "");
    setEditingIdx(idx);
    setErr("");
    setStep("form");
  };

  if (!open) return null;

  return (
    <div className="dd-modal-backdrop" onClick={onClose}>
      <div className="dd-modal dd-modal--addr" onClick={e => e.stopPropagation()}>
        <div className="dd-modal-hd">
          {step !== "list" && (
            <button className="dd-icon-btn" onClick={() => { resetForm(); setStep("list"); }} aria-label="Back">
              <Ic.ArrowLeft />
            </button>
          )}
          <h2 className="dd-modal-title">
            {step === "list" ? "Delivery Address" : step === "phone" ? "Verify Phone" : step === "otp" ? "Enter Code" : editingIdx !== null ? "Edit Address" : "Add Address"}
          </h2>
          <button className="dd-modal-close" onClick={onClose} aria-label="Close"><Ic.Close /></button>
        </div>

        {step === "list" && (
          <div className="dd-addr-list">
            {savedAddresses.length > 0 && (
              <div className="dd-addr-saved">
                {savedAddresses.map((a, i) => (
                  <div key={i} className="dd-addr-item-wrap">
                    <button className="dd-addr-item" onClick={() => { onSelect(a.fullAddress); onClose(); }}>
                      <Ic.MapPin />
                      <div className="dd-addr-item-content">
                        <p className="dd-addr-street">{a.street}{a.apt ? ` ${a.apt}` : ""}</p>
                        <p className="dd-addr-city">{a.city}, {a.state} {a.zip}</p>
                      </div>
                    </button>
                    <div className="dd-addr-item-actions">
                      <button className="dd-addr-action-btn" onClick={(e) => startEdit(e, i)} aria-label="Edit address" title="Edit">
                        <Ic.Pencil />
                      </button>
                      <button className="dd-addr-action-btn dd-addr-action-btn--delete" onClick={(e) => deleteAddress(e, i)} aria-label="Delete address" title="Delete">
                        <Ic.Trash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button className="dd-add-addr-btn" onClick={() => {
              if (!session) { onClose(); onOpenAuth(); return; }
              setStep("phone"); setErr("");
            }}>
              <Ic.Plus /> Add new address
            </button>
          </div>
        )}

        {step === "phone" && (
          <div className="dd-addr-step">
            <p className="dd-step-desc">We'll send a one-time code to verify your number.</p>
            <div className="dd-phone-row">
              <select className="dd-country-sel" value={country} onChange={e => setCountry(e.target.value)}>
                {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
              </select>
              <input className="dd-phone-input" type="tel" placeholder="Phone number" value={phone}
                onChange={e => setPhone(e.target.value)} onKeyDown={e => e.key === "Enter" && sendOtp()} />
            </div>
            {err && <p className="dd-form-err">{err}</p>}
            <button className="dd-primary-btn" onClick={sendOtp} disabled={loading}>
              {loading ? "Sending…" : "Send Code"}
            </button>
          </div>
        )}

        {step === "otp" && (
          <div className="dd-addr-step">
            <p className="dd-step-desc">Enter the 6-digit code sent to {country}{phone}.</p>
            <input className="dd-otp-input" type="text" placeholder="123456" maxLength={6} value={otp}
              onChange={e => setOtp(e.target.value)} onKeyDown={e => e.key === "Enter" && verifyOtp()} />
            {err && <p className="dd-form-err">{err}</p>}
            <button className="dd-primary-btn" onClick={verifyOtp} disabled={loading}>
              {loading ? "Verifying…" : "Verify Code"}
            </button>
            <button className="dd-text-btn" onClick={sendOtp} disabled={loading}>Resend code</button>
          </div>
        )}

        {step === "form" && (
          <div className="dd-addr-step">
            <input className="dd-form-input" placeholder="Street address *" value={addrForm.street}
              onChange={e => setAddrForm(p => ({ ...p, street: e.target.value }))} />
            <input className="dd-form-input" placeholder="Apt / Suite (optional)" value={addrForm.apt}
              onChange={e => setAddrForm(p => ({ ...p, apt: e.target.value }))} />
            <div className="dd-form-row">
              <input className="dd-form-input" placeholder="City *" value={addrForm.city}
                onChange={e => setAddrForm(p => ({ ...p, city: e.target.value }))} />
              <input className="dd-form-input" placeholder="State *" value={addrForm.state}
                onChange={e => setAddrForm(p => ({ ...p, state: e.target.value }))} />
            </div>
            <input className="dd-form-input" placeholder="ZIP *" value={addrForm.zip}
              onChange={e => setAddrForm(p => ({ ...p, zip: e.target.value }))} />
            {err && <p className="dd-form-err">{err}</p>}
            <button className="dd-primary-btn" onClick={saveAddress}>
              {editingIdx !== null ? "Update Address" : "Save Address"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN DELIVERY COMPONENT ──────────────────────────────────────────────────
export default function Delivery() {
  const { data: session, status } = useSession();

  // ── UI state
  const [authOpen, setAuthOpen]         = useState(false);
  const [addrOpen, setAddrOpen]         = useState(false);
  const [cartOpen, setCartOpen]         = useState(false);
  const [notifOpen, setNotifOpen]       = useState(false);
  const [activeCat, setActiveCat]       = useState("trending");

  // ── Address
  const [address, setAddress]           = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [accountNotFoundOpen, setAccountNotFoundOpen] = useState(false);

  // ── Search
  const [search, setSearch]             = useState("");
  const [searchNoResult, setSearchNoResult] = useState(false);
  const searchTimerRef                  = useRef(null);

  // ── Cart
  const [cart, setCart]                 = useState([]);

  // ── Location
  const [userLat, setUserLat]           = useState(null);
  const [userLng, setUserLng]           = useState(null);
    const [locationConsentOpen, setLocationConsentOpen] = useState(false);

  // ── Delivery
  const [phase, setPhase]               = useState(null);
  const [phaseIdx, setPhaseIdx]         = useState(0);
  const [driver, setDriver]             = useState(null);
  const [driverPos, setDriverPos]       = useState(null);
  const [storeLat, setStoreLat]         = useState(null);
  const [storeLng, setStoreLng]         = useState(null);
  const [eta, setEta]                   = useState(0);
  const [orderCartSnap, setOrderCartSnap] = useState([]);
  const [orderTotal, setOrderTotal]     = useState(0);
  const timerRef                        = useRef(null);
  const driverTimerRef                  = useRef(null);

  // ── Toast
  const [toasts, setToasts]             = useState([]);

  // ── Refs for IntersectionObserver
  const sectionRefs = useRef({});
  const observerRef = useRef(null);

  const addToast = useCallback((msg, type = "info") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  const saveAddresses = useCallback((list) => {
    setSavedAddresses(list);
    if (session?.user?.id) {
      localStorage.setItem(`sbux_addrs_${session.user.id}`, JSON.stringify(list));
    }
  }, [session?.user?.id]);

  // Load/clear addresses and selected address based on auth status
  useEffect(() => {
    if (status === "unauthenticated") {
      setSavedAddresses([]);
      setAddress("");
    } else if (status === "authenticated" && session?.user?.id) {
      try {
        const raw = localStorage.getItem(`sbux_addrs_${session.user.id}`);
        setSavedAddresses(raw ? JSON.parse(raw) : []);
        const sel = localStorage.getItem(`sbux_sel_addr_${session.user.id}`);
        if (sel) setAddress(sel);
      } catch { setSavedAddresses([]); }
    }
  }, [status, session?.user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist selected address per user
  useEffect(() => {
    if (address && session?.user?.id) {
      localStorage.setItem(`sbux_sel_addr_${session.user.id}`, address);
    }
  }, [address, session?.user?.id]);

  // Check new user on sign-in / persist user to DB
  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;
    const intent = localStorage.getItem("sbux_auth_intent");
    const googleId = session.user.id || session.user.email;

    const upsertUser = () => fetch("/api/auth/upsert-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ googleId, email: session.user.email, name: session.user.name, image: session.user.image }),
    }).catch(() => {});

    if (intent === "signin") {
      localStorage.removeItem("sbux_auth_intent");
      fetch(`/api/auth/check-user?googleId=${encodeURIComponent(googleId)}`)
        .then(r => r.json())
        .then(d => {
          if (!d.exists) {
            signOut({ redirect: false });
            setAccountNotFoundOpen(true);
          } else {
            upsertUser();
          }
        })
        .catch(() => upsertUser());
    } else {
      if (intent) localStorage.removeItem("sbux_auth_intent");
      upsertUser();
    }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  // Search handler
  const handleSearch = useCallback((val) => {
    setSearch(val);
    setSearchNoResult(false);
    clearTimeout(searchTimerRef.current);
    if (!val.trim()) return;
    searchTimerRef.current = setTimeout(() => {
      const lower = val.toLowerCase().trim();
      const found = MENU_ITEMS.find(item => item.name.toLowerCase().includes(lower));
      if (found) {
        const section = sectionRefs.current[found.cat];
        if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        setSearchNoResult(true);
      }
    }, 300);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Geolocation — triggered manually by user clicking "Find stores near you"
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationDenied, setLocationDenied]   = useState(false);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      addToast("Geolocation is not supported by your browser.", "error");
      return;
    }
    setLocationLoading(true);
    setLocationDenied(false);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setUserLat(pos.coords.latitude);
        setUserLng(pos.coords.longitude);
        setLocationLoading(false);
      },
      () => {
        setLocationLoading(false);
        setLocationDenied(true);
        addToast("Location access denied. Please allow location in your browser.", "error");
      },
      { timeout: 10000 }
    );
  }, [addToast]);

  // IntersectionObserver for category tabs
  useEffect(() => {
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          const sorted = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActiveCat(sorted[0].target.dataset.cat);
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    Object.entries(sectionRefs.current).forEach(([, el]) => {
      if (el) observerRef.current.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  const scrollToCategory = (catId) => {
    const el = sectionRefs.current[catId];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCart = useCallback((item) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (item.delta === -1) {
        if (!existing || existing.qty <= 1) return prev.filter(c => c.id !== item.id);
        return prev.map(c => c.id === item.id ? { ...c, qty: c.qty - 1 } : c);
      }
      if (existing) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  }, []);

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);

  const DELIVERY_FEE = 1.99;
  const TAX_RATE     = 0.0875;
  const subtotal     = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);
  const totalPrice   = subtotal + DELIVERY_FEE + subtotal * TAX_RATE;

  // Start delivery simulation
  const startDelivery = useCallback((nearbyStoreLat, nearbyStoreLng) => {
    const chosenDriver = DRIVERS[Math.floor(Math.random() * DRIVERS.length)];
    setDriver(chosenDriver);
    setPhase("placing");
    setPhaseIdx(0);
    setEta(20);
    setNotifOpen(true);

    const sLat = nearbyStoreLat || (userLat ? userLat + 0.015 : 37.785);
    const sLng = nearbyStoreLng || (userLng ? userLng + 0.012 : -122.41);
    setStoreLat(sLat);
    setStoreLng(sLng);
    setDriverPos({ lat: sLat, lng: sLng });

    let idx = 0;
    const advance = () => {
      idx++;
      if (idx >= PHASES.length) return;
      const next = PHASES[idx];
      setPhase(next.key);
      setPhaseIdx(idx);
      setEta(prev => Math.max(0, prev - Math.floor(Math.random() * 5 + 2)));
      addToast(next.label, idx === PHASES.length - 1 ? "success" : "info");
      if (next.dur) timerRef.current = setTimeout(advance, next.dur);
    };
    timerRef.current = setTimeout(advance, PHASES[0].dur);

    // Driver position interpolation
    let progress = 0;
    driverTimerRef.current = setInterval(() => {
      progress = Math.min(progress + 0.01, 1);
      if (userLat && userLng) {
        setDriverPos({
          lat: lerp(sLat, userLat, progress),
          lng: lerp(sLng, userLng, progress),
        });
        setEta(Math.round((1 - progress) * 20));
      }
      if (progress >= 1) clearInterval(driverTimerRef.current);
    }, 1500);
  }, [userLat, userLng, addToast]);

  const handlePlaceOrder = useCallback(() => {
    if (!session) { setAuthOpen(true); return; }
    if (!address) { setAddrOpen(true); return; }
    if (cart.length === 0) return;
    const snap = [...cart];
    setOrderCartSnap(snap);
    setOrderTotal(totalPrice);
    setCart([]);
    setCartOpen(false);
    addToast("Order placed! Tracking your delivery.", "success");
    startDelivery();
  }, [session, address, cart, totalPrice, startDelivery, addToast]);

  // Cleanup timers
  useEffect(() => () => {
    clearTimeout(timerRef.current);
    clearInterval(driverTimerRef.current);
    clearTimeout(searchTimerRef.current);
  }, []);

  const groupedItems = useMemo(() =>
    MENU_CATEGORIES.map(cat => ({
      ...cat,
      items: MENU_ITEMS.filter(i => i.cat === cat.id),
    })), []);

  const hasActiveOrder = phase && phase !== "delivered";

  return (
    <div className="dd-page">
      {/* ── Navbar ──────────────────────────────────────────── */}
      <nav className="dd-nav">
        <div className="dd-nav-inner">
          <div className="dd-nav-left">
            <Image src="/images/doordash.png" alt="DoorDash" width={100} height={32} className="dd-nav-logo" style={{ objectFit: "contain" }} />
          </div>

          <button className="dd-addr-btn" onClick={() => setAddrOpen(true)}>
            <Ic.MapPin />
            <span className="dd-addr-btn-text">{address || "Set delivery address"}</span>
            <Ic.ChevronRight />
          </button>

          <div className="dd-nav-right">
            {session ? (
              <div className="dd-user-row">
                {session.user.image ? (
                  <Image src={session.user.image} alt={session.user.name} width={32} height={32} className="dd-user-avatar" />
                ) : (
                  <span className="dd-user-initials">{session.user.name?.[0]?.toUpperCase()}</span>
                )}
                <span className="dd-user-name">{session.user.name?.split(" ")[0]}</span>
                <button className="dd-sign-out-btn" onClick={() => signOut()}>Sign out</button>
              </div>
            ) : (
              <button className="dd-signin-btn" onClick={() => setAuthOpen(true)}>Sign in</button>
            )}

            <button className="dd-icon-btn" onClick={() => setNotifOpen(true)} aria-label="Notifications">
              <Ic.Bell />
              {hasActiveOrder && <span className="dd-icon-badge dd-bell-active" />}
            </button>

            <button className="dd-icon-btn dd-cart-icon-btn" onClick={() => setCartOpen(true)} aria-label="Cart">
              <Ic.Cart />
              {cartCount > 0 && <span className="dd-icon-badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Main Layout ─────────────────────────────────────── */}
      <div className="dd-main">
        {/* Category Sidebar */}
        <aside className="dd-sidebar">
          <div className="dd-sidebar-inner">
            <p className="dd-sidebar-label">Menu</p>
            <ul className="dd-cat-list">
              {MENU_CATEGORIES.map(cat => (
                <li key={cat.id}>
                  <button
                    className={`dd-cat-btn ${activeCat === cat.id ? "dd-cat-btn--active" : ""}`}
                    onClick={() => scrollToCategory(cat.id)}
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Menu Content */}
        <main className="dd-menu">
          {/* Search bar */}
          <div className="dd-search-row">
            <div className="dd-search-wrap">
              <Ic.Search />
              <input
                className="dd-search"
                type="search"
                placeholder="Search Starbucks menu…"
                value={search}
                onChange={e => handleSearch(e.target.value)}
              />
              {search && (
                <button
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-mu)", display: "flex", alignItems: "center" }}
                  onClick={() => { setSearch(""); setSearchNoResult(false); }}
                  aria-label="Clear search"
                >
                  <Ic.Close />
                </button>
              )}
            </div>
            {searchNoResult && (
              <p className="dd-search-not-found">
                No item found on menu matching &quot;{search}&quot;
              </p>
            )}
          </div>

          {/* Category sections */}
          {groupedItems.map(cat => (
            <section
              key={cat.id}
              id={`cat-${cat.id}`}
              data-cat={cat.id}
              ref={el => { sectionRefs.current[cat.id] = el; }}
              className="dd-cat-section"
            >
              <h2 className="dd-cat-title">{cat.label}</h2>
              <div className="dd-items-grid">
                {cat.items.map(item => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    qty={cart.find(c => c.id === item.id)?.qty || 0}
                    onCart={handleCart}
                  />
                ))}
              </div>
            </section>
          ))}

          {/* Stores Near You */}
              <StoresNearYou
            userLat={userLat}
            userLng={userLng}
            onRequestLocation={() => setLocationConsentOpen(true)}
            locationLoading={locationLoading}
            locationDenied={locationDenied}
          />
        </main>
      </div>


      {/* ── Floating Cart Button ─────────────────────────────── */}
      {cartCount > 0 && (
        <button className="dd-float-cart" onClick={() => setCartOpen(true)}>
          <span className="dd-float-cart-count">{cartCount}</span>
          <span>View Cart</span>
          <span className="dd-float-cart-total">${totalPrice.toFixed(2)}</span>
        </button>
      )}

            <LocationConsentModal
        open={locationConsentOpen}
        onAllow={() => { setLocationConsentOpen(false); requestLocation(); }}
        onDeny={() => setLocationConsentOpen(false)}
      />


      {/* ── Modals & Drawers ─────────────────────────────────── */}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

      <AccountNotFoundModal
        open={accountNotFoundOpen}
        onClose={() => setAccountNotFoundOpen(false)}
        onSignUp={() => { setAccountNotFoundOpen(false); setAuthOpen(true); }}
      />

      <AddressModal
        open={addrOpen}
        onClose={() => setAddrOpen(false)}
        onSelect={(addr) => setAddress(addr)}
        savedAddresses={savedAddresses}
        onSaveAddresses={saveAddresses}
        session={session}
        currentAddress={address}
        onOpenAuth={() => setAuthOpen(true)}
      />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cart}
        onCart={handleCart}
        onPlaceOrder={handlePlaceOrder}
      />

      <NotificationPanel
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        phase={phase}
        phaseIdx={phaseIdx}
        driver={driver}
        driverPos={driverPos}
        userLat={userLat}
        userLng={userLng}
        eta={eta}
        cartItems={orderCartSnap}
        total={orderTotal}
      />

      <Toast toasts={toasts} />
    </div>
  );
}

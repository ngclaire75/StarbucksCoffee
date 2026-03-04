'use client';

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import WhiteNav from "../whitenav";
import PagesList from "../pageslist";
import "./featured.css";
import "../home.css";

export default function Featured() {
    const router = useRouter();

useEffect(() => {
  window.history.pushState(null, '', window.location.href);

  const handlePopState = () => {
    router.push('/menupage');
  };

  window.addEventListener('popstate', handlePopState);
  return () => window.removeEventListener('popstate', handlePopState);
}, [router]);

  return (
    <div className="featured-page">

      
      {/* Header */}
      <WhiteNav />

      {/* 🔥 First Section - Hero Banner */}
      <section className="featured-hero">
        <h1 className="featured-hero-title">
          Explore bold spring picks
        </h1>
      </section>

      {/* 🌿 Featured Drinks Section */}
      <section className="featured-drinks-section">
        <div className="featured-drinks-grid">

          {/* Left Card */}
          <div className="featured-drink-card">
            <img 
              src="/images/iced-chai.png" 
              alt="Iced Chai" 
              className="featured-drink-image"
            />
            <div className="featured-drink-content">
              <h2>Iced Chai</h2>
              <p>
                New ways to customize chai are here. Keep the drink you know and 
                love with equal parts of sweet and chai. Or adjust the sweetness 
                and chai levels to find your perfect combination.
              </p>
              <button className="featured-btn">Order chai</button>
            </div>
          </div>

          {/* Right Card */}
          <div className="featured-drink-card">
            <img 
              src="/images/cream-chai.png" 
              alt="Iced Lavender Cream Chai" 
              className="featured-drink-image"
            />
            <div className="featured-drink-content">
              <h2>Iced Lavender Cream Chai</h2>
              <p>
                Spring’s iconic flavor is back in this beloved combination. Our 
                classic chai, milk and the sweet and subtle floral notes of velvety 
                lavender cream cold foam.
              </p>
              <button className="featured-btn">Order now</button>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <PagesList />

    </div>
  );
}
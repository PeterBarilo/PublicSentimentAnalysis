// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import './Home.css';
import { assets } from '../assets/assets'; // Import the assets (images)

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageArray = [assets.cover7, assets.cover8,   assets.cover6, assets.cover3, assets.cover1,  ]; 

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 8000);
    return () => clearInterval(interval); 
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageArray.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + imageArray.length) % imageArray.length
    ); 
  };

  return (
    <div className="home-container">
      <header className="carousel">
        <div
          className="carousel-inner"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {imageArray.map((image, index) => (
            <div className="carousel-item" key={index}>
              <div
                className="carousel-image"
                style={{ backgroundImage: `url(${image})` }}

              >
                <div className="banner-text">
                  <h1>Explore the World of Public Opinion</h1>
                  <p>View real-time sentiment analysis on hot debate topics from around the world.</p>
                  <a href="/topics" className="cta-button">View Hot Topics</a>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="prev-button" onClick={prevSlide}>
          &#10094;
        </button>
        <button className="next-button" onClick={nextSlide}>
          &#10095;
        </button>
      </header>

      <section className="features-section">
        <div className="feature">
          <h2>Current Debates</h2>
          <p>Stay updated on the most trending topics and see how public opinion shifts in real time.</p>
        </div>
        <div className="feature">
          <h2>Deep Analysis</h2>
          <p>Break down arguments and sentiments for each side of a debate with detailed insights.</p>
        </div>
        <div className="feature">
          <h2>Archived Data</h2>
          <p>Explore past debates and analyze how public sentiment has changed over time.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;

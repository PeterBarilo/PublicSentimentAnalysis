import React, { useEffect, useState } from 'react';
import './Home.css';
import { assets } from '../assets/assets'; 
import { FaBalanceScale, FaEye, FaChartLine, FaDatabase } from 'react-icons/fa'; 


const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageArray = [assets.cover7, assets.cover8, assets.cover6, assets.cover3, assets.cover1];

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

  const goToSlide = (index) => {
    setCurrentIndex(index);
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

        <div className="dots-container">
          {imageArray.map((_, index) => (
            <div
              key={index}
              className={`dot ${currentIndex === index ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            ></div>
          ))}
        </div>
      </header>

        {/* services */}
      <section className="values-section">
        <div className="values-container">
          <h2>Our Values</h2>
          <hr />
          <p>
            At Debate Insights, we stand for <strong>free speech</strong> and <strong>transparency</strong>. 
            We believe in creating a platform where diverse opinions can be heard and discussed openly. 
            Our goal is to provide honest, data-driven sentiment analysis on public opinions, ensuring that 
            everyone has access to a transparent and unbiased view of how society feels about important topics.
          </p>
        </div>

        <div className="services-container">
          <h2>Our Services</h2>
          <hr />

          <div className="services-grid">
            <div className="service">
              <FaBalanceScale className="service-icon" />
              <h3>Free Speech Platform</h3>
              <p>We aim to promote free speech by showcasing the voice of the people.</p>
            </div>
            <div className="service">
              <FaEye className="service-icon" />
              <h3>Transparent Analysis</h3>
              <p>Our sentiment analysis is data-driven and unbiased, offering full transparency.</p>
            </div>
            <div className="service">
              <FaChartLine className="service-icon" />
              <h3>Real-Time Insights</h3>
              <p>Access real-time public sentiment data on trending debate topics.</p>
            </div>
            <div className="service">
              <FaDatabase className="service-icon" />
              <h3>Accurate Historical Data</h3>
              <p>Explore archived data to understand how public opinion has shifted over time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* contact us */}
      <section className="contact-us-section">
        <h2>Contact Us</h2>
        <p>If you have any questions, suggestions, or would like to get in touch with our team, please fill out the form below.</p>
        <form className="contact-form">
          <input type="text" name="name" placeholder="Your Name" required />
          <input type="email" name="email" placeholder="Your Email" required />
          <textarea name="message" rows="5" placeholder="Your Message" required></textarea>
          <button type="submit" className="cta-button">Send Message</button>
        </form>
      </section>
    </div>
  );
};

export default Home;

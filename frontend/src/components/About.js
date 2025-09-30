import React from "react";
import "./About.css";

export default function About() {
  return (
    <div className="about-page-container">
      {/* Hero Section */}
      <section className="about-hero-section">
        <div className="about-hero-overlay">
          <h1 className="about-hero-title">About 📚 Librarium</h1>
          <p className="about-hero-subtitle">
            A modern digital library connecting students and knowledge worldwide.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision-section">
        <div className="mission-card">
          <h2 className="section-heading">Our Mission</h2>
          <p className="section-text">
            To make knowledge accessible to everyone, fostering learning and
            curiosity across all age groups.
          </p>
        </div>
        <div className="vision-card">
          <h2 className="section-heading">Our Vision</h2>
          <p className="section-text">
            To be a leading digital library that inspires lifelong learning,
            innovation, and exploration of ideas.
          </p>
        </div>
      </section>

      {/* History */}
      <section className="history-section">
        <h2 className="section-heading">Our Story</h2>
        <p className="section-text">
          Founded in 2025, Librarium started as a small initiative to digitize
          library resources. Today, we host thousands of books, provide
          borrowing services, and empower students to learn anytime, anywhere.
        </p>
      </section>

      {/* What We Offer */}
      <section className="what-we-offer-section">
        <h2 className="section-heading">What We Offer</h2>
        <div className="offer-grid">
          <div className="offer-card">
            <h3 className="offer-title">📖 Extensive Collection</h3>
            <p className="offer-text">Thousands of books across genres and categories.</p>
          </div>
          <div className="offer-card">
            <h3 className="offer-title">🕒 24/7 Access</h3>
            <p className="offer-text">Borrow and explore books anytime, anywhere online.</p>
          </div>
          <div className="offer-card">
            <h3 className="offer-title">🔐 Secure Accounts</h3>
            <p className="offer-text">Student and admin accounts with safe login and tracking.</p>
          </div>
          <div className="offer-card">
            <h3 className="offer-title">🌟 Featured Books</h3>
            <p className="offer-text">Showcasing trending and recommended reads every week.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta-section">
        <h2 className="about-cta-title">Join our library today and start your learning journey!</h2>
        <a href="/register" className="cta-button">
          Register Now
        </a>
      </section>
    </div>
  );
}
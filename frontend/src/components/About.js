import React from "react";
import "./About.css";

export default function About() {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-overlay">
          <h1>About 📚 My Library</h1>
          <p>
            A modern digital library connecting students and knowledge worldwide.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision">
        <div className="mission">
          <h2>Our Mission</h2>
          <p>
            To make knowledge accessible to everyone, fostering learning and
            curiosity across all age groups.
          </p>
        </div>
        <div className="vision">
          <h2>Our Vision</h2>
          <p>
            To be a leading digital library that inspires lifelong learning,
            innovation, and exploration of ideas.
          </p>
        </div>
      </section>

      {/* History */}
      <section className="history">
        <h2>Our Story</h2>
        <p>
          Founded in 2025, My Library started as a small initiative to digitize
          library resources. Today, we host thousands of books, provide
          borrowing services, and empower students to learn anytime, anywhere.
        </p>
      </section>

      {/* What We Offer */}
      <section className="what-we-offer">
        <h2>What We Offer</h2>
        <div className="offer-list">
          <div className="offer-card">
            <h3>📖 Extensive Collection</h3>
            <p>Thousands of books across genres and categories.</p>
          </div>
          <div className="offer-card">
            <h3>🕒 24/7 Access</h3>
            <p>Borrow and explore books anytime, anywhere online.</p>
          </div>
          <div className="offer-card">
            <h3>🔐 Secure Accounts</h3>
            <p>Student and admin accounts with safe login and tracking.</p>
          </div>
          <div className="offer-card">
            <h3>🌟 Featured Books</h3>
            <p>Showcasing trending and recommended reads every week.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <h2>Join our library today and start your learning journey!</h2>
        <a href="/register" className="btn btn-primary">
          Register Now
        </a>
      </section>
    </div>
  );
}

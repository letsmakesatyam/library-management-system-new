import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay">
          <h1>Welcome to 📚 My Library</h1>
          <p>Your digital gateway to knowledge & imagination</p>
          <div className="hero-buttons">
            <Link to="/login" className="btn btn-primary">Login</Link>
            <Link to="/register" className="btn btn-secondary">Register</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats">
        <h2>📊 Library at a Glance</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>5000+</h3>
            <p>Books Available</p>
          </div>
          <div className="stat-card">
            <h3>1200+</h3>
            <p>Registered Students</p>
          </div>
          <div className="stat-card">
            <h3>50+</h3>
            <p>Categories</p>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="featured">
        <h2>🔥 Popular Books</h2>
        <div className="books-grid">
          <div className="book-card">
            <img src="https://covers.openlibrary.org/b/id/10909258-L.jpg" alt="Atomic Habits" />
            <p>Atomic Habits – James Clear</p>
          </div>
          <div className="book-card">
            <img src="https://covers.openlibrary.org/b/id/10521270-L.jpg" alt="Rich Dad Poor Dad" />
            <p>Rich Dad Poor Dad – Robert Kiyosaki</p>
          </div>
          <div className="book-card">
            <img src="https://covers.openlibrary.org/b/id/8378236-L.jpg" alt="Harry Potter" />
            <p>Harry Potter Series – J.K. Rowling</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <h2>✨ What We Offer</h2>
        <div className="feature-list">
          <div className="feature-card">
            <h3>🔍 Easy Search</h3>
            <p>Find books by title, author, or category instantly.</p>
          </div>
          <div className="feature-card">
            <h3>⏳ Borrow & Return</h3>
            <p>Manage your borrowed books with one click.</p>
          </div>
          <div className="feature-card">
            <h3>📅 Events & Updates</h3>
            <p>Stay informed about new arrivals & library news.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Start your reading journey today!</h2>
        <Link to="/register" className="btn btn-accent">Join the Library</Link>
      </section>
    </div>
  );
}

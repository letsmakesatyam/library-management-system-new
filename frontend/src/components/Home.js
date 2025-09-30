import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import './Home.css';

// Enhanced animated counter with more features
const AnimatedCounter = ({ end, duration = 2.5, suffix = '' }) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.3,
    });

    return (
        <span ref={ref}>
            {inView ? (
                <CountUp 
                    end={end} 
                    duration={duration} 
                    separator="," 
                    suffix={suffix}
                />
            ) : (
                '0' + suffix
            )}
        </span>
    );
};

// Scroll animation component
const ScrollAnimate = ({ children, delay = 0 }) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <div
            ref={ref}
            className={`scroll-animate ${inView ? 'animate' : ''}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

export default function Home() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title animate-fade-in">
                        Your Digital Gateway to a Universe of{' '}
                        <span style={{ 
                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Librarium
                        </span>
                    </h1>
                    <p className="hero-subtitle animate-fade-in-delay">
                        Discover your next favorite book and embark on new adventures. 
                        Join thousands of readers in our digital library community.
                    </p>
                    <div className="hero-buttons animate-fade-in-delay-2">
                        <Link to="/login" className="btn btn-hero-primary">
                            <span>🚀</span>
                            Sign In
                        </Link>
                        <Link to="/register" className="btn btn-hero-secondary">
                            <span>✨</span>
                            Join Us Today
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <ScrollAnimate>
                    <h2 className="section-title">📊 Our Library at a Glance</h2>
                </ScrollAnimate>
                <div className="stats-grid">
                    <ScrollAnimate delay={200}>
                        <div className="stat-card">
                            <h3><AnimatedCounter end={5000} />+</h3>
                            <p>Books in Collection</p>
                        </div>
                    </ScrollAnimate>
                    <ScrollAnimate delay={400}>
                        <div className="stat-card">
                            <h3><AnimatedCounter end={1200} />+</h3>
                            <p>Happy Members</p>
                        </div>
                    </ScrollAnimate>
                    <ScrollAnimate delay={600}>
                        <div className="stat-card">
                            <h3><AnimatedCounter end={50} />+</h3>
                            <p>Genres & Categories</p>
                        </div>
                    </ScrollAnimate>
                </div>
            </section>

            {/* Featured Books Section */}
            <section className="featured-section">
                <div className="section-header">
                    <ScrollAnimate>
                        <h2 className="section-title">🔥 Popular Reads</h2>
                    </ScrollAnimate>
                    <ScrollAnimate delay={200}>
                        <Link to="/books" className="view-all-link">
                            View All Books →
                        </Link>
                    </ScrollAnimate>
                </div>
                <div className="books-slider">
                    {[
                        { id: 1, title: "Atomic Habits", author: "James Clear", cover: "https://covers.openlibrary.org/b/id/10909258-L.jpg" },
                        { id: 2, title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", cover: "https://covers.openlibrary.org/b/id/10521270-L.jpg" },
                        { id: 3, title: "Harry Potter Series", author: "J.K. Rowling", cover: "https://covers.openlibrary.org/b/id/8378236-L.jpg" },
                        { id: 4, title: "The Alchemist", author: "Paulo Coelho", cover: "https://covers.openlibrary.org/b/id/909090-L.jpg" },
                        { id: 5, title: "Dune", author: "Frank Herbert", cover: "https://covers.openlibrary.org/b/id/213567-L.jpg" }
                    ].map((book, index) => (
                        <ScrollAnimate key={book.id} delay={index * 100}>
                            <div className="book-card">
                                <img src={book.cover} alt={book.title} />
                                <div className="book-info">
                                    <h3>{book.title}</h3>
                                    <p>by {book.author}</p>
                                </div>
                            </div>
                        </ScrollAnimate>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <ScrollAnimate>
                    <h2 className="section-title">✨ What Makes Us Special</h2>
                </ScrollAnimate>
                <div className="features-grid">
                    <ScrollAnimate delay={200}>
                        <div className="feature-card">
                            <div className="feature-icon">🔍</div>
                            <h3>Intelligent Search</h3>
                            <p>Find books instantly by title, author, or keyword with our AI-powered search engine.</p>
                        </div>
                    </ScrollAnimate>
                    <ScrollAnimate delay={400}>
                        <div className="feature-card">
                            <div className="feature-icon">⏳</div>
                            <h3>Seamless Management</h3>
                            <p>Borrow and return books with a single click, hassle-free. Track your reading history.</p>
                        </div>
                    </ScrollAnimate>
                    <ScrollAnimate delay={600}>
                        <div className="feature-card">
                            <div className="feature-icon">📅</div>
                            <h3>Community Events</h3>
                            <p>Stay updated on new arrivals and engaging library events, book clubs, and author talks.</p>
                        </div>
                    </ScrollAnimate>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <ScrollAnimate>
                        <h2 className="cta-title">Start your reading journey today!</h2>
                    </ScrollAnimate>
                    <ScrollAnimate delay={200}>
                        <p className="cta-subtitle">
                            Unlock a world of stories waiting to be explored. Join our community of passionate readers.
                        </p>
                    </ScrollAnimate>
                    <ScrollAnimate delay={400}>
                        <div className="cta-buttons">
                            <Link to="/register" className="btn btn-cta-primary">
                                <span>📚</span>
                                Join the Library
                            </Link>
                            <Link to="/about" className="btn btn-cta-secondary">
                                <span>ℹ️</span>
                                Learn More
                            </Link>
                        </div>
                    </ScrollAnimate>
                </div>
            </section>
        </div>
    );
}
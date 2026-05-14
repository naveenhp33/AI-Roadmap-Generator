import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-page animate-fade-in">
            <header className="hero-section">
                <div className="container">
                    <h1 className="hero-title">Your AI-Powered <br /><span className="text-gradient">Career Co-Pilot</span></h1>
                    <p className="hero-subtitle">
                        Generate personalized learning roadmaps, track your progress, and get AI mentorship to land your dream tech role.
                    </p>
                    <div className="hero-actions">
                        <Link to="/register" className="btn-primary btn-large">Get Started for Free</Link>
                        <Link to="/login" className="btn-secondary btn-large">Login</Link>
                    </div>
                </div>
            </header>

            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">Why CareerPilot AI?</h2>
                    <div className="features-grid">
                        <div className="feature-card glass">
                            <h3>Personalized Roadmaps</h3>
                            <p>AI generates a tailored learning path based on your current skills and target role.</p>
                        </div>
                        <div className="feature-card glass">
                            <h3>Smart Project Ideas</h3>
                            <p>Get project recommendations that match your skill level and add value to your portfolio.</p>
                        </div>
                        <div className="feature-card glass">
                            <h3>AI Mentorship</h3>
                            <p>Stuck on a bug? Need interview tips? Chat with your 24/7 AI mentor anytime.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;

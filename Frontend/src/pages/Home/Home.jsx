import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Home.css";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">Monthly Prize Draws</div>
          <h1>
            Golf with <span className="highlight">Purpose</span>
          </h1>
          <p className="hero-sub">
            Enter your scores. Win prizes. Support a charity you love. The only
            golf platform that gives back every single month.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to="/dashboard" className="btn-primary">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary">
                  Start Playing →
                </Link>
                <Link to="/charities" className="btn-outline">
                  Explore Charities
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-visual">
          <div className="stats-grid">
            <div className="stat-card">
              <span>₹10L+</span>
              <p>Prize Pool</p>
            </div>
            <div className="stat-card">
              <span>50+</span>
              <p>Charities</p>
            </div>
            <div className="stat-card">
              <span>500+</span>
              <p>Members</p>
            </div>
            <div className="stat-card">
              <span>Monthly</span>
              <p>Draws</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-icon">1</div>
            <h3>Subscribe</h3>
            <p>
              Choose monthly or yearly plan. A portion goes directly to your
              chosen charity.
            </p>
          </div>
          <div className="step">
            <div className="step-icon">2</div>
            <h3>Enter Scores</h3>
            <p>
              Log your last 5 Stableford scores (1–45). They become your draw
              entries.
            </p>
          </div>
          <div className="step">
            <div className="step-icon">3</div>
            <h3>Win Prizes</h3>
            <p>
              Monthly draws match your scores. 3, 4, or 5 matches = prize money
              in your pocket.
            </p>
          </div>
          <div className="step">
            <div className="step-icon">4</div>
            <h3>Give Back</h3>
            <p>
              Every subscription automatically donates to your chosen charity —
              minimum 10%.
            </p>
          </div>
        </div>
      </section>

      {/* Prize Pool */}
      <section className="prize-section">
        <h2>Prize Pool Breakdown</h2>
        <div className="prize-cards">
          <div className="prize-card jackpot">
            <div className="prize-match">5-Number Match</div>
            <div className="prize-percent">40%</div>
            <div className="prize-label">Jackpot (Rolls Over)</div>
          </div>
          <div className="prize-card">
            <div className="prize-match">4-Number Match</div>
            <div className="prize-percent">35%</div>
            <div className="prize-label">of Prize Pool</div>
          </div>
          <div className="prize-card">
            <div className="prize-match">3-Number Match</div>
            <div className="prize-percent">25%</div>
            <div className="prize-label">of Prize Pool</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to Play for Good?</h2>
        <p>
          Join hundreds of golfers already winning prizes and supporting causes
          they care about.
        </p>
        {!user && (
          <Link to="/register" className="btn-primary btn-large">
            Sign Up & Start Today →
          </Link>
        )}
      </section>
    </div>
  );
}

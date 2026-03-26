import React, { useState, useEffect } from "react";
import { getDraws } from "../../services/drawService.js";
import "./Draw.css";

export default function Draw() {
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDraws()
      .then((r) => setDraws(r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="draw-page">
      <div className="draw-container">
        <div className="draw-header">
          <h1>Monthly Draws</h1>
          <p>
            Your Stableford scores are your entries. Match 3, 4, or 5 numbers to
            win.
          </p>
        </div>

        <div className="how-draw-works">
          <h2>How the Draw Works</h2>
          <div className="draw-steps">
            <div className="draw-step">
              <span>1</span>
              <p>5 winning numbers are drawn (1–45) each month</p>
            </div>
            <div className="draw-step">
              <span>2</span>
              <p>
                Your last 5 Stableford scores are checked against the winning
                numbers
              </p>
            </div>
            <div className="draw-step">
              <span>3</span>
              <p>Match 3, 4, or all 5 numbers to claim your prize</p>
            </div>
          </div>
        </div>

        <div className="prize-info">
          <div className="prize-tier jackpot-tier">
            <span>5 Match</span>
            <strong>40% Jackpot</strong>
            <small>Rolls over if unclaimed</small>
          </div>
          <div className="prize-tier">
            <span>4 Match</span>
            <strong>35% Pool</strong>
          </div>
          <div className="prize-tier">
            <span>3 Match</span>
            <strong>25% Pool</strong>
          </div>
        </div>

        <div className="draws-history">
          <h2>Draw History</h2>
          {loading ? (
            <p className="loading-text">Loading draws...</p>
          ) : draws.length === 0 ? (
            <p className="empty-text">No draws published yet. Stay tuned!</p>
          ) : (
            draws.map((draw) => (
              <div key={draw._id} className="draw-card">
                <div className="draw-meta">
                  <span className="draw-month">
                    {draw.month} {draw.year}
                  </span>
                  <span className="draw-type">{draw.drawType}</span>
                </div>
                <div className="draw-numbers">
                  {draw.winningNumbers.map((n, i) => (
                    <span key={i} className="draw-ball">
                      {n}
                    </span>
                  ))}
                </div>
                <div className="draw-pool-info">
                  <span>Total Pool: ₹{draw.totalPrizePool}</span>
                  {draw.jackpotRolledOver && (
                    <span className="rollover-badge">Jackpot Rolled Over</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

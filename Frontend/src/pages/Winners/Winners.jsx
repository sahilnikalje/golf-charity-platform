import React, { useState, useEffect } from "react";
import api from "../../services/api.js";
import "./Winners.css";

export default function Winners() {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/draws/winners")
      .then((r) =>
        setWinners(r.data.filter((w) => w.verificationStatus === "approved")),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="winners-page">
      <div className="winners-container">
        <div className="winners-header">
          <h1>Winners Hall of Fame</h1>
          <p>Verified winners from our monthly draws</p>
        </div>

        {loading ? (
          <p className="loading-text">Loading winners...</p>
        ) : winners.length === 0 ? (
          <p className="empty-text">
            No verified winners yet. Could you be the first?
          </p>
        ) : (
          <div className="winners-list">
            {winners.map((w) => (
              <div
                key={w._id}
                className={`winner-card ${w.matchType === "5-match" ? "jackpot-winner" : ""}`}
              >
                <div className="winner-avatar">
                  {w.user?.name?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="winner-info">
                  <h3>{w.user?.name || "Anonymous"}</h3>
                  <p>
                    {w.draw?.month} {w.draw?.year} — {w.matchType}
                  </p>
                </div>
                <div className="winner-prize">
                  ₹{w.prizeAmount?.toFixed(2)}
                  {w.matchType === "5-match" && (
                    <span className="jackpot-tag">JACKPOT</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

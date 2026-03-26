import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { getScores } from "../../services/scoreService.js";
import { getSubscriptionStatus } from "../../services/subscriptionService.js";
import { getLatestDraw } from "../../services/drawService.js";
import "./Dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();
  const [scores, setScores] = useState([]);
  const [sub, setSub] = useState(null);
  const [latestDraw, setLatestDraw] = useState(null);

  useEffect(() => {
    getScores()
      .then((r) => setScores(r.data.scores))
      .catch(() => {});
    getSubscriptionStatus()
      .then((r) => setSub(r.data))
      .catch(() => {});
    getLatestDraw()
      .then((r) => setLatestDraw(r.data))
      .catch(() => {});
  }, []);

  const charityPercent = user?.charityPercentage || 10;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dash-header">
          <h1>
            Welcome back, <span>{user?.name?.split(" ")[0]}</span>
          </h1>
          <p>Here's your GolfGives overview</p>
        </div>

        <div className="dash-grid">
          {/* Subscription Card */}
          <div className="dash-card">
            <div className="dash-card-title">Subscription</div>
            {sub && sub.status === "active" ? (
              <>
                <div className="dash-badge active">Active — {sub.plan}</div>
                <p className="dash-info">
                  Renews:{" "}
                  {sub.renewalDate
                    ? new Date(sub.renewalDate).toLocaleDateString()
                    : "N/A"}
                </p>
                <Link to="/subscription" className="dash-link">
                  Manage →
                </Link>
              </>
            ) : (
              <>
                <div className="dash-badge inactive">Not Subscribed</div>
                <Link to="/subscription" className="dash-link-btn">
                  Subscribe Now
                </Link>
              </>
            )}
          </div>

          {/* Scores Card */}
          <div className="dash-card">
            <div className="dash-card-title">My Scores</div>
            {scores.length > 0 ? (
              <div className="score-mini-list">
                {scores.slice(0, 3).map((s, i) => (
                  <div key={i} className="score-mini-item">
                    <span className="score-val">{s.value}</span>
                    <span className="score-date">
                      {new Date(s.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="dash-empty">No scores yet</p>
            )}
            <Link to="/scores" className="dash-link">
              Manage Scores →
            </Link>
          </div>

          {/* Charity Card */}
          <div className="dash-card">
            <div className="dash-card-title">Charity Contribution</div>
            <div className="charity-percent">{charityPercent}%</div>
            <p className="dash-info">of your subscription goes to charity</p>
            <Link to="/charities" className="dash-link">
              Change Charity →
            </Link>
          </div>

          {/* Latest Draw Card */}
          <div className="dash-card">
            <div className="dash-card-title">Latest Draw</div>
            {latestDraw ? (
              <>
                <div className="draw-numbers-mini">
                  {latestDraw.winningNumbers.map((n, i) => (
                    <span key={i} className="draw-num">
                      {n}
                    </span>
                  ))}
                </div>
                <p className="dash-info">
                  {latestDraw.month} {latestDraw.year}
                </p>
              </>
            ) : (
              <p className="dash-empty">No draw yet this month</p>
            )}
            <Link to="/draws" className="dash-link">
              View All Draws →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

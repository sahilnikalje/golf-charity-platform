import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCharities } from "../../services/charityService.js";
import "./Charities.css";

export default function Charities() {
  const [charities, setCharities] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCharities({ search })
      .then((r) => setCharities(r.data))
      .finally(() => setLoading(false));
  }, [search]);

  const featured = charities.filter((c) => c.isFeatured);
  const rest = charities.filter((c) => !c.isFeatured);

  return (
    <div className="charities-page">
      <div className="charities-container">
        <div className="charities-header">
          <h1>Our Charities</h1>
          <p>Choose a cause. Your subscription automatically donates.</p>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search charities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {featured.length > 0 && (
          <div className="charities-section">
            <h2>Featured Charities</h2>
            <div className="charities-grid">
              {featured.map((c) => (
                <CharityCard key={c._id} charity={c} featured />
              ))}
            </div>
          </div>
        )}

        <div className="charities-section">
          <h2>All Charities</h2>
          {loading ? (
            <p className="loading-text">Loading charities...</p>
          ) : rest.length > 0 ? (
            <div className="charities-grid">
              {rest.map((c) => (
                <CharityCard key={c._id} charity={c} />
              ))}
            </div>
          ) : (
            <p className="empty-text">No charities found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function CharityCard({ charity, featured }) {
  return (
    <Link
      to={`/charities/${charity._id}`}
      className={`charity-card ${featured ? "featured" : ""}`}
    >
      <div className="charity-img">
        {charity.image ? (
          <img src={charity.image} alt={charity.name} />
        ) : (
          <div className="charity-img-placeholder">C</div>
        )}
      </div>
      <div className="charity-info">
        <div className="charity-category">{charity.category}</div>
        <h3>{charity.name}</h3>
        <p>{charity.description.substring(0, 100)}...</p>
        <span className="charity-raised">
          ₹{charity.totalReceived?.toLocaleString() || 0} raised
        </span>
      </div>
    </Link>
  );
}

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCharityById } from "../../services/charityService.js";
import { updateProfile } from "../../services/authService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { toast } from "react-toastify";
import "./CharityDetail.css";

export default function CharityDetail() {
  const { id } = useParams();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [charity, setCharity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCharityById(id)
      .then((r) => setCharity(r.data))
      .catch(() => navigate("/charities"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSelect = async () => {
    if (!user) return navigate("/login");
    try {
      await updateProfile({ selectedCharity: id });
      updateUser({ selectedCharity: id });
      toast.success(`Now supporting ${charity.name}!`);
    } catch {
      toast.error("Failed to update charity");
    }
  };

  if (loading) return <div className="detail-loading">Loading...</div>;
  if (!charity) return null;

  return (
    <div className="charity-detail-page">
      <div className="charity-detail-container">
        <button className="back-btn" onClick={() => navigate("/charities")}>
          ← Back
        </button>
        <div className="charity-detail-hero">
          {charity.image && <img src={charity.image} alt={charity.name} />}
          <div className="charity-detail-info">
            <div className="charity-cat-tag">{charity.category}</div>
            <h1>{charity.name}</h1>
            <p>{charity.description}</p>
            <div className="charity-stats">
              <div className="charity-stat">
                <span>₹{charity.totalReceived?.toLocaleString() || 0}</span>
                <p>Total Raised</p>
              </div>
            </div>
            {user?.selectedCharity === id ? (
              <div className="selected-badge">Your Current Charity</div>
            ) : (
              <button className="btn-select-charity" onClick={handleSelect}>
                Support This Charity
              </button>
            )}
          </div>
        </div>

        {charity.upcomingEvents?.length > 0 && (
          <div className="charity-events">
            <h2>Upcoming Events</h2>
            <div className="events-grid">
              {charity.upcomingEvents.map((ev, i) => (
                <div key={i} className="event-card">
                  <h3>{ev.title}</h3>
                  <p className="event-date">
                    {new Date(ev.date).toLocaleDateString()}
                  </p>
                  <p>{ev.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

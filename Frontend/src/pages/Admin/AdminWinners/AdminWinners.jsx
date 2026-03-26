import React, { useEffect, useState } from "react";
import api from "../../../services/api.js";
import { toast } from "react-toastify";
import "./AdminWinners.css";

export default function AdminWinners() {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWinners = () => {
    api
      .get("/admin/winners")
      .then((r) => setWinners(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWinners();
  }, []);

  const handleVerify = async (id, status) => {
    try {
      await api.put(`/admin/winners/${id}/verify`, {
        verificationStatus: status,
      });
      toast.success(`Winner ${status}`);
      fetchWinners();
    } catch {
      toast.error("Failed to update");
    }
  };

  const handlePayout = async (id) => {
    try {
      await api.put(`/admin/winners/${id}/payout`);
      toast.success("Marked as paid");
      fetchWinners();
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-page-header">
          <h1>Winners & Payouts</h1>
          <p>Verify submissions and track payouts</p>
        </div>

        {loading ? (
          <p className="loading-text">Loading winners...</p>
        ) : winners.length === 0 ? (
          <p className="empty-text">No winners yet.</p>
        ) : (
          <div className="winners-admin-list">
            {winners.map((w) => (
              <div key={w._id} className="winner-admin-card">
                <div className="winner-admin-info">
                  <div className="winner-avatar-sm">
                    {w.user?.name?.[0] || "?"}
                  </div>
                  <div>
                    <h3>{w.user?.name || "Unknown"}</h3>
                    <p className="winner-email">{w.user?.email}</p>
                    <p className="winner-meta">
                      {w.draw?.month} {w.draw?.year} — {w.matchType}
                    </p>
                  </div>
                </div>

                <div className="winner-admin-right">
                  <div className="winner-prize-admin">
                    ₹{w.prizeAmount?.toFixed(2)}
                  </div>

                  <div className="winner-badges">
                    <span className={`verify-badge ${w.verificationStatus}`}>
                      {w.verificationStatus}
                    </span>
                    <span className={`pay-badge ${w.paymentStatus}`}>
                      {w.paymentStatus}
                    </span>
                  </div>

                  <div className="winner-admin-actions">
                    {w.verificationStatus === "pending" && (
                      <>
                        <button
                          className="btn-approve"
                          onClick={() => handleVerify(w._id, "approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() => handleVerify(w._id, "rejected")}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {w.verificationStatus === "approved" &&
                      w.paymentStatus === "pending" && (
                        <button
                          className="btn-payout"
                          onClick={() => handlePayout(w._id)}
                        >
                          Mark Paid
                        </button>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

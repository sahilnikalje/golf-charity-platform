import React, { useState, useEffect } from "react";
import {
  simulateDraw,
  publishDraw,
  getDraws,
} from "../../../services/drawService.js";
import { toast } from "react-toastify";
import "./AdminDraw.css";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function AdminDraw() {
  const [draws, setDraws] = useState([]);
  const [form, setForm] = useState({
    month: MONTHS[new Date().getMonth()],
    year: new Date().getFullYear(),
    drawType: "random",
  });
  const [simulated, setSimulated] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDraws = () => api_getDraws();
  const api_getDraws = () =>
    getDraws()
      .then((r) => setDraws(r.data))
      .catch(() => {});

  useEffect(() => {
    fetchDraws();
  }, []);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await simulateDraw(form);
      setSimulated(res.data.draw);
      toast.success("Draw simulated! Review before publishing.");
      fetchDraws();
    } catch (err) {
      toast.error(err.response?.data?.message || "Simulation failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id) => {
    if (!confirm("Publish this draw? This cannot be undone.")) return;
    try {
      await publishDraw(id);
      toast.success("Draw published and winners notified!");
      setSimulated(null);
      fetchDraws();
    } catch (err) {
      toast.error(err.response?.data?.message || "Publish failed");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-page-header">
          <h1>Draw Engine</h1>
          <p>Simulate and publish monthly draws</p>
        </div>

        <div className="draw-admin-layout">
          {/* Control Panel */}
          <div className="draw-control-card">
            <h2>Configure Draw</h2>
            <div className="draw-form">
              <div className="form-group">
                <label>Month</label>
                <select
                  value={form.month}
                  onChange={(e) => setForm({ ...form, month: e.target.value })}
                >
                  {MONTHS.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Year</label>
                <input
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Draw Type</label>
                <select
                  value={form.drawType}
                  onChange={(e) =>
                    setForm({ ...form, drawType: e.target.value })
                  }
                >
                  <option value="random">Random</option>
                  <option value="algorithmic">
                    Algorithmic (Score-Weighted)
                  </option>
                </select>
              </div>
              <button
                className="btn-simulate"
                onClick={handleSimulate}
                disabled={loading}
              >
                {loading ? "Simulating..." : "Run Simulation"}
              </button>
            </div>

            {simulated && (
              <div className="simulated-result">
                <h3>Simulated Draw</h3>
                <div className="sim-numbers">
                  {simulated.winningNumbers.map((n, i) => (
                    <span key={i} className="draw-ball">
                      {n}
                    </span>
                  ))}
                </div>
                <button
                  className="btn-publish"
                  onClick={() => handlePublish(simulated._id)}
                >
                  Publish This Draw
                </button>
              </div>
            )}
          </div>

          {/* History */}
          <div className="draw-history-card">
            <h2>Draw History</h2>
            {draws.length === 0 ? (
              <p className="empty-text">No draws published yet.</p>
            ) : (
              draws.map((d) => (
                <div key={d._id} className="admin-draw-item">
                  <div className="admin-draw-meta">
                    <span>
                      {d.month} {d.year}
                    </span>
                    <span className={`draw-status ${d.status}`}>
                      {d.status}
                    </span>
                  </div>
                  <div className="admin-draw-numbers">
                    {d.winningNumbers.map((n, i) => (
                      <span key={i} className="draw-ball-sm">
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

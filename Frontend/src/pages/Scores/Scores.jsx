import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getScores,
  addScore,
  editScore,
  deleteScore,
} from "../../services/scoreService.js";
import "./Scores.css";

export default function Scores() {
  const [scores, setScores] = useState([]);
  const [form, setForm] = useState({ value: "", date: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchScores = () =>
    getScores()
      .then((r) => setScores(r.data.scores))
      .catch(() => {});

  useEffect(() => {
    fetchScores();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.value || !form.date) return toast.error("Fill all fields");
    setLoading(true);
    try {
      if (editId) {
        await editScore(editId, { value: Number(form.value), date: form.date });
        toast.success("Score updated");
        setEditId(null);
      } else {
        if (scores.length >= 5)
          return toast.error("Max 5 scores — oldest will be replaced");
        await addScore({ value: Number(form.value), date: form.date });
        toast.success("Score added");
      }
      setForm({ value: "", date: "" });
      fetchScores();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving score");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (score) => {
    setEditId(score._id);
    setForm({ value: score.value, date: score.date.split("T")[0] });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this score?")) return;
    try {
      await deleteScore(id);
      toast.success("Score deleted");
      fetchScores();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="scores-page">
      <div className="scores-container">
        <div className="scores-header">
          <h1>My Golf Scores</h1>
          <p>
            Track your last 5 Stableford scores (1–45). These are your draw
            entries.
          </p>
        </div>

        <div className="scores-layout">
          {/* Form */}
          <div className="scores-form-card">
            <h2>{editId ? "Edit Score" : "Add Score"}</h2>
            <form onSubmit={handleSubmit} className="score-form">
              <div className="form-group">
                <label>Stableford Score (1–45)</label>
                <input
                  type="number"
                  min="1"
                  max="45"
                  placeholder="e.g. 32"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date Played</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>
              <div className="form-actions">
                <button
                  type="submit"
                  className="btn-primary-score"
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : editId
                      ? "Update Score"
                      : "Add Score"}
                </button>
                {editId && (
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => {
                      setEditId(null);
                      setForm({ value: "", date: "" });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List */}
          <div className="scores-list-card">
            <h2>
              Your Scores <span className="score-count">{scores.length}/5</span>
            </h2>
            {scores.length === 0 ? (
              <div className="scores-empty">
                <p>No scores yet. Add your first Stableford score!</p>
              </div>
            ) : (
              <div className="scores-list">
                {scores.map((s, i) => (
                  <div key={s._id} className="score-item">
                    <div className="score-rank">#{i + 1}</div>
                    <div className="score-value">{s.value}</div>
                    <div className="score-date">
                      {new Date(s.date).toLocaleDateString()}
                    </div>
                    <div className="score-actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(s)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(s._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../services/api.js";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api
      .get("/admin/stats")
      .then((r) => setStats(r.data))
      .catch(() => {});
  }, []);

  const cards = [
    {
      label: "Total Users",
      value: stats?.totalUsers ?? "—",
      icon: "",
      link: "/admin/users",
    },
    {
      label: "Active Subscribers",
      value: stats?.activeSubscribers ?? "—",
      icon: "",
      link: "/admin/users",
    },
    {
      label: "Total Charities",
      value: stats?.totalCharities ?? "—",
      icon: "",
      link: "/admin/charities",
    },
    {
      label: "Draws Published",
      value: stats?.totalDraws ?? "—",
      icon: "",
      link: "/admin/draw",
    },
    {
      label: "Total Winners",
      value: stats?.totalWinners ?? "—",
      icon: "",
      link: "/admin/winners",
    },
  ];

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-page-header">
          <h1>Admin Dashboard</h1>
          <p>Platform overview and controls</p>
        </div>
        <div className="admin-stats-grid">
          {cards.map((card, i) => (
            <Link to={card.link} key={i} className="admin-stat-card">
              <div className="admin-stat-icon">{card.icon}</div>
              <div className="admin-stat-value">{card.value}</div>
              <div className="admin-stat-label">{card.label}</div>
            </Link>
          ))}
        </div>
        <div className="admin-nav-grid">
          <Link to="/admin/users" className="admin-nav-card">
            <h3>Manage Users</h3>
            <p>View, edit, delete users and subscriptions</p>
          </Link>
          <Link to="/admin/draw" className="admin-nav-card">
            <h3>Draw Engine</h3>
            <p>Simulate and publish monthly draws</p>
          </Link>
          <Link to="/admin/charities" className="admin-nav-card">
            <h3>Manage Charities</h3>
            <p>Add, edit, and feature charities</p>
          </Link>
          <Link to="/admin/winners" className="admin-nav-card">
            <h3>Winners & Payouts</h3>
            <p>Verify submissions and mark payouts</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

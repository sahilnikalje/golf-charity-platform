import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <span className="footer-logo">GolfGives</span>
          <p>Play. Win. Give. Making golf meaningful.</p>
        </div>
        <div className="footer-links">
          <Link to="/charities">Charities</Link>
          <Link to="/draws">Draws</Link>
          <Link to="/winners">Winners</Link>
          <Link to="/register">Sign Up</Link>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} GolfGives. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

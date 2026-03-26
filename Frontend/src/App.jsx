import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';
import Home from './pages/Home/Home.jsx';
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Scores from './pages/Scores/Scores.jsx';
import Subscription from './pages/Subscription/Subscription.jsx';
import Charities from './pages/Charities/Charities.jsx';
import CharityDetail from './pages/Charities/CharityDetail.jsx';
import Draw from './pages/Draw/Draw.jsx';
import Winners from './pages/Winners/Winners.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard/AdminDashboard.jsx';
import AdminUsers from './pages/Admin/AdminUsers/AdminUsers.jsx';
import AdminDraw from './pages/Admin/AdminDraw/AdminDraw.jsx';
import AdminCharities from './pages/Admin/AdminCharities/AdminCharities.jsx';
import AdminWinners from './pages/Admin/AdminWinners/AdminWinners.jsx';
import './App.css';

export default function App() {
  return (
    <Router>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/charities" element={<Charities />} />
          <Route path="/charities/:id" element={<CharityDetail />} />
          <Route path="/draws" element={<Draw />} />
          <Route path="/winners" element={<Winners />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/scores" element={<ProtectedRoute><Scores /></ProtectedRoute>} />
          <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/draw" element={<ProtectedRoute adminOnly><AdminDraw /></ProtectedRoute>} />
          <Route path="/admin/charities" element={<ProtectedRoute adminOnly><AdminCharities /></ProtectedRoute>} />
          <Route path="/admin/winners" element={<ProtectedRoute adminOnly><AdminWinners /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}
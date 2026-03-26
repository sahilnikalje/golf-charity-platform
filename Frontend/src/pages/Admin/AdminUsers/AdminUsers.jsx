import React, { useEffect, useState } from 'react';
import api from '../../../services/api.js';
import { toast } from 'react-toastify';
import './AdminUsers.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    api.get('/admin/users').then(r => setUsers(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch { toast.error('Failed to delete'); }
  };

  const handleToggleSub = async (user) => {
    try {
      await api.put(`/admin/users/${user._id}`, { isSubscribed: !user.isSubscribed });
      toast.success('Subscription status updated');
      fetchUsers();
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-page-header">
          <h1>Manage Users 👤</h1>
          <p>{users.length} total users</p>
        </div>

        {loading ? (
          <p className="loading-text">Loading users...</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Subscribed</th>
                  <th>Plan</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                    <td>
                      <span className={`sub-badge ${u.isSubscribed ? 'active' : 'inactive'}`}>
                        {u.isSubscribed ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{u.subscriptionPlan || '—'}</td>
                    <td className="action-cell">
                      <button className="btn-toggle" onClick={() => handleToggleSub(u)}>
                        {u.isSubscribed ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="btn-del" onClick={() => handleDelete(u._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { getCharities, createCharity, updateCharity, deleteCharity } from '../../../services/charityService.js';
import Modal from '../../../components/Modal/Modal.jsx';
import { toast } from 'react-toastify';
import './AdminCharities.css';

const empty = { name: '', description: '', image: '', website: '', category: 'General', isFeatured: false };

export default function AdminCharities() {
  const [charities, setCharities] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);

  const fetchCharities = () => getCharities().then(r => setCharities(r.data)).catch(() => {});

  useEffect(() => { fetchCharities(); }, []);

  const openAdd = () => { setForm(empty); setEditId(null); setModalOpen(true); };
  const openEdit = (c) => { setForm(c); setEditId(c._id); setModalOpen(true); };

  const handleSave = async () => {
    try {
      if (editId) {
        await updateCharity(editId, form);
        toast.success('Charity updated');
      } else {
        await createCharity(form);
        toast.success('Charity created');
      }
      setModalOpen(false);
      fetchCharities();
    } catch { toast.error('Failed to save'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this charity?')) return;
    try {
      await deleteCharity(id);
      toast.success('Deleted');
      fetchCharities();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-page-header-row">
          <div>
            <h1>Manage Charities 💚</h1>
            <p>{charities.length} charities listed</p>
          </div>
          <button className="btn-add" onClick={openAdd}>+ Add Charity</button>
        </div>

        <div className="charities-admin-grid">
          {charities.map(c => (
            <div key={c._id} className="admin-charity-card">
              <div className="admin-charity-top">
                {c.isFeatured && <span className="featured-tag">⭐ Featured</span>}
                <h3>{c.name}</h3>
                <p className="charity-cat">{c.category}</p>
                <p className="charity-desc">{c.description.substring(0, 80)}...</p>
              </div>
              <div className="admin-charity-actions">
                <button className="btn-edit" onClick={() => openEdit(c)}>Edit</button>
                <button className="btn-del" onClick={() => handleDelete(c._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Charity' : 'Add Charity'}>
          <div className="charity-modal-form">
            <div className="form-group">
              <label>Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea rows="3" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Website</label>
              <input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
            </div>
            <div className="form-group form-check">
              <input type="checkbox" id="featured" checked={form.isFeatured}
                onChange={e => setForm({ ...form, isFeatured: e.target.checked })} />
              <label htmlFor="featured">Featured charity</label>
            </div>
            <button className="btn-save" onClick={handleSave}>
              {editId ? 'Update Charity' : 'Create Charity'}
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
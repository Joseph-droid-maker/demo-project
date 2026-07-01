import { useState } from 'react';
import { Search, Plus, Pencil, Trash2, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { CATEGORIES, MOCK_MENU_ITEMS } from '../data/menu.js';
import { useTableControls, useSimulatedFetch } from '../hooks/useTableControls.js';
import { Pagination, SkeletonRows, EmptyState } from '../components/ui/Feedback.jsx';
import Modal from '../components/ui/Modal.jsx';

const peso = (n) => `₱${n.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

const EMPTY_FORM = { name: '', category: CATEGORIES[0], price: '', description: '', prep_time: '', is_available: true, is_featured: false };

export default function MenuPage() {
  const { loading } = useSimulatedFetch(null, 500);
  // Local mutable copy — lets Add/Edit/Delete actually mutate what's
  // displayed, which is the "simulate realistic interactions" requirement.
  const [items, setItems] = useState(MOCK_MENU_ITEMS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = creating new; object = editing existing
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const table = useTableControls({
    items,
    searchFields: ['name', 'category'],
    pageSize: 8,
  });

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }
  function openEdit(item) {
    setEditing(item);
    setForm({ ...item, price: String(item.price), prep_time: String(item.prep_time ?? '') });
    setModalOpen(true);
  }

  function saveForm(e) {
    e.preventDefault();
    if (editing) {
      setItems((prev) => prev.map((it) => (it.id === editing.id ? { ...it, ...form, price: parseFloat(form.price) || 0, prep_time: parseInt(form.prep_time) || null } : it)));
      toast.success(`${form.name} updated`);
    } else {
      const newItem = { ...form, id: Math.max(...items.map((i) => i.id)) + 1, price: parseFloat(form.price) || 0, prep_time: parseInt(form.prep_time) || null, is_active: true, image: '🍽️' };
      setItems((prev) => [newItem, ...prev]);
      toast.success(`${form.name} added to menu`);
    }
    setModalOpen(false);
  }

  function confirmDelete() {
    // Soft delete only — matches the schema's "soft deletes everywhere" rule.
    setItems((prev) => prev.map((it) => (it.id === deleteTarget.id ? { ...it, is_active: false } : it)));
    toast.success(`${deleteTarget.name} archived`);
    setDeleteTarget(null);
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Menu Management</h1>
          <p>Manage your restaurant's menu items and categories</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn--primary" onClick={openCreate}><Plus size={16} /> Add Menu Item</button>
        </div>
      </div>

      <div className="table-toolbar">
        <div className="search-input">
          <Search size={16} />
          <input placeholder="Search by name..." value={table.query} onChange={(e) => table.setQuery(e.target.value)} />
        </div>
        <div className="table-filters">
          <select className="select-input" value={table.filters.category || 'All'} onChange={(e) => table.setFilter('category', e.target.value)}>
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Image</th>
              <th onClick={() => table.toggleSort('name')} style={{ cursor: 'pointer' }}>Item Name</th>
              <th>Category</th>
              <th onClick={() => table.toggleSort('price')} style={{ cursor: 'pointer' }}>Price</th>
              <th>Availability</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonRows rows={6} cols={7} />
            ) : table.items.length === 0 ? (
              <tr><td colSpan={7}><EmptyState title="No menu items found" message="Try a different search or category filter." /></td></tr>
            ) : (
              table.items.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontSize: 22 }}>{item.image}</td>
                  <td>
                    <strong>{item.name}</strong>
                    {item.is_featured && <Star size={12} style={{ marginLeft: 6, color: 'var(--amber)', display: 'inline' }} fill="var(--amber)" />}
                  </td>
                  <td>{item.category}</td>
                  <td>{peso(item.price)}</td>
                  <td><span className={`badge ${item.is_available ? 'badge--success' : 'badge--warning'}`}>{item.is_available ? 'Available' : 'Sold Out'}</span></td>
                  <td><span className={`badge ${item.is_active ? 'badge--active' : 'badge--inactive'}`}>{item.is_active ? 'Active' : 'Archived'}</span></td>
                  <td>
                    <div className="flex gap-1">
                      <button className="btn btn--ghost btn--icon" onClick={() => openEdit(item)}><Pencil size={14} /></button>
                      <button className="btn btn--ghost btn--icon" onClick={() => setDeleteTarget(item)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {!loading && <Pagination page={table.page} totalPages={table.totalPages} onChange={table.setPage} totalItems={table.totalItems} pageSize={table.pageSize} />}
      </div>

      {/* ---------- Add / Edit modal (one form, two modes) ---------- */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Menu Item' : 'Add Menu Item'} size="lg">
        <form onSubmit={saveForm}>
          <div className="form-row">
            <div className="form-group">
              <label>Item Name</label>
              <input className="text-input w-full" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select className="select-input w-full" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Price (₱)</label>
              <input className="text-input w-full" type="number" step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Preparation Time (min)</label>
              <input className="text-input w-full" type="number" value={form.prep_time} onChange={(e) => setForm({ ...form, prep_time: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="textarea-input" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="form-row">
            <label className="flex items-center gap-1"><input type="checkbox" checked={form.is_available} onChange={(e) => setForm({ ...form, is_available: e.target.checked })} /> Available for order</label>
            <label className="flex items-center gap-1"><input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} /> Featured item</label>
          </div>
          <div className="modal-footer" style={{ padding: '20px 0 0', borderTop: 'none' }}>
            <button type="button" className="btn btn--ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn--primary">{editing ? 'Save Changes' : 'Add Item'}</button>
          </div>
        </form>
      </Modal>

      {/* ---------- Delete/archive confirmation ---------- */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Archive Menu Item"
        footer={<><button className="btn btn--ghost" onClick={() => setDeleteTarget(null)}>Cancel</button><button className="btn btn--danger" onClick={confirmDelete}>Archive</button></>}
      >
        <p style={{ fontSize: 13.5 }}>
          Archive <strong>{deleteTarget?.name}</strong>? It will be hidden from the POS and Menu screens but its order history is preserved (soft delete — matches the audit trail requirement).
        </p>
      </Modal>
    </div>
  );
}

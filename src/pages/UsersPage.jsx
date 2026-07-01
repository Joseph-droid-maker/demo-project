import { useState } from 'react';
import { Search, Plus, Pencil, UserX, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { MOCK_USERS } from '../data/users.js';
import { useTableControls, useSimulatedFetch } from '../hooks/useTableControls.js';
import { Pagination, SkeletonRows, EmptyState } from '../components/ui/Feedback.jsx';
import Modal from '../components/ui/Modal.jsx';

const EMPTY_FORM = { username: '', full_name: '', email: '', role: 'cashier' };

export default function UsersPage() {
  const { loading } = useSimulatedFetch(null, 500);
  const [users, setUsers] = useState(MOCK_USERS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [statusTarget, setStatusTarget] = useState(null); // user being (de)activated
  const [reason, setReason] = useState('');

  const table = useTableControls({ items: users, searchFields: ['full_name', 'username', 'email'], pageSize: 8 });

  function openCreate() { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); }
  function openEdit(u) { setEditing(u); setForm(u); setModalOpen(true); }

  function saveForm(e) {
    e.preventDefault();
    if (editing) {
      setUsers((prev) => prev.map((u) => (u.id === editing.id ? { ...u, ...form } : u)));
      toast.success(`${form.full_name} updated`);
    } else {
      const newUser = { ...form, id: Math.max(...users.map((u) => u.id)) + 1, status: 'Active', last_login: 'Never' };
      setUsers((prev) => [newUser, ...prev]);
      toast.success(`${form.full_name} added`);
    }
    setModalOpen(false);
  }

  // Deactivating requires a mandatory reason per spec §9. Reactivating
  // does not (only deactivation is in the mandatory-reason list).
  function openStatusChange(u) {
    setStatusTarget(u);
    setReason('');
  }
  function confirmStatusChange() {
    const activating = statusTarget.status === 'Inactive';
    if (!activating && !reason.trim()) return; // safety net; button is disabled too
    setUsers((prev) => prev.map((u) => (u.id === statusTarget.id ? { ...u, status: activating ? 'Active' : 'Inactive' } : u)));
    toast.success(`${statusTarget.full_name} ${activating ? 'reactivated' : 'deactivated'}`);
    setStatusTarget(null);
  }

  const summary = {
    total: users.length,
    active: users.filter((u) => u.status === 'Active').length,
    inactive: users.filter((u) => u.status === 'Inactive').length,
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>User Management</h1>
          <p>Manage system users and their permissions</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn--primary" onClick={openCreate}><Plus size={16} /> Add User</button>
        </div>
      </div>

      <div className="three-col-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="kpi-card"><div className="kpi-card__label">Total Users</div><div className="kpi-card__value">{summary.total}</div></div>
        <div className="kpi-card"><div className="kpi-card__label">Active Users</div><div className="kpi-card__value" style={{ color: 'var(--green)' }}>{summary.active}</div></div>
        <div className="kpi-card"><div className="kpi-card__label">Inactive Users</div><div className="kpi-card__value" style={{ color: 'var(--red)' }}>{summary.inactive}</div></div>
      </div>

      <div className="table-toolbar">
        <div className="search-input">
          <Search size={16} />
          <input placeholder="Search by name or email..." value={table.query} onChange={(e) => table.setQuery(e.target.value)} />
        </div>
        <div className="table-filters">
          <select className="select-input" value={table.filters.role || 'All'} onChange={(e) => table.setFilter('role', e.target.value)}>
            <option value="All">All Roles</option>
            <option value="admin">Admin</option>
            <option value="cashier">Cashier</option>
            <option value="kitchen">Kitchen</option>
          </select>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr><th>Name</th><th>Username</th><th>Email</th><th>Role</th><th>Status</th><th>Last Login</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonRows rows={6} cols={7} />
            ) : table.items.length === 0 ? (
              <tr><td colSpan={7}><EmptyState title="No users found" message="Try a different search or filter." /></td></tr>
            ) : (
              table.items.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="flex items-center gap-1">
                      <div className="avatar" style={{ width: 30, height: 30, fontSize: 11, background: '#5B7088' }}>
                        {u.full_name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
                      </div>
                      <strong>{u.full_name}</strong>
                    </div>
                  </td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td><span className={`badge badge--role badge--${u.role}`}>{u.role}</span></td>
                  <td><span className={`badge ${u.status === 'Active' ? 'badge--active' : 'badge--inactive'}`}>{u.status}</span></td>
                  <td>{u.last_login}</td>
                  <td>
                    <div className="flex gap-1">
                      <button className="btn btn--ghost btn--icon" onClick={() => openEdit(u)}><Pencil size={14} /></button>
                      <button className="btn btn--ghost btn--icon" onClick={() => openStatusChange(u)}>
                        {u.status === 'Active' ? <UserX size={14} /> : <UserCheck size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {!loading && <Pagination page={table.page} totalPages={table.totalPages} onChange={table.setPage} totalItems={table.totalItems} pageSize={table.pageSize} />}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit User' : 'Add User'}>
        <form onSubmit={saveForm}>
          <div className="form-group"><label>Full Name</label><input className="text-input w-full" required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
          <div className="form-group"><label>Username</label><input className="text-input w-full" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></div>
          <div className="form-group"><label>Email</label><input className="text-input w-full" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="form-group">
            <label>Role</label>
            <select className="select-input w-full" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="cashier">Cashier — POS &amp; Orders access</option>
              <option value="kitchen">Kitchen — Kitchen Display only</option>
              <option value="admin">Admin — full access</option>
            </select>
          </div>
          <div className="modal-footer" style={{ padding: '20px 0 0', borderTop: 'none' }}>
            <button type="button" className="btn btn--ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn--primary">{editing ? 'Save Changes' : 'Add User'}</button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!statusTarget}
        onClose={() => setStatusTarget(null)}
        title={statusTarget?.status === 'Active' ? 'Deactivate User' : 'Reactivate User'}
        footer={
          <>
            <button className="btn btn--ghost" onClick={() => setStatusTarget(null)}>Cancel</button>
            <button
              className={statusTarget?.status === 'Active' ? 'btn btn--danger' : 'btn btn--primary'}
              disabled={statusTarget?.status === 'Active' && !reason.trim()}
              onClick={confirmStatusChange}
            >
              {statusTarget?.status === 'Active' ? 'Deactivate' : 'Reactivate'}
            </button>
          </>
        }
      >
        {statusTarget?.status === 'Active' ? (
          <div>
            <p style={{ fontSize: 13.5, marginBottom: 14 }}>
              Deactivate <strong>{statusTarget?.full_name}</strong>? They will be immediately blocked from logging in. This action is recorded in Activity Logs.
            </p>
            <div className="form-group">
              <label>Reason (required)</label>
              <textarea className="textarea-input" placeholder="Why is this account being deactivated?" value={reason} onChange={(e) => setReason(e.target.value)} />
            </div>
          </div>
        ) : (
          <p style={{ fontSize: 13.5 }}>Reactivate <strong>{statusTarget?.full_name}</strong>? They will be able to log in again immediately.</p>
        )}
      </Modal>
    </div>
  );
}

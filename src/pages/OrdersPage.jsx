import { useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { MOCK_ORDERS } from '../data/orders.js';
import { useTableControls, useSimulatedFetch } from '../hooks/useTableControls.js';
import { Pagination, SkeletonRows, EmptyState } from '../components/ui/Feedback.jsx';
import Modal from '../components/ui/Modal.jsx';

const STATUS_OPTIONS = ['All', 'pending', 'preparing', 'ready', 'served', 'completed'];

export default function OrdersPage() {
  const { loading } = useSimulatedFetch(null, 500);
  const [selected, setSelected] = useState(null);

  const table = useTableControls({
    items: MOCK_ORDERS,
    searchFields: ['order_number', 'table_number', 'cashier_name'],
    pageSize: 7,
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <p>Full order history across all statuses</p>
        </div>
      </div>

      <div className="table-toolbar">
        <div className="search-input">
          <Search size={16} />
          <input placeholder="Search order #, table, cashier..." value={table.query} onChange={(e) => table.setQuery(e.target.value)} />
        </div>
        <div className="table-filters">
          <select className="select-input" value={table.filters.status || 'All'} onChange={(e) => table.setFilter('status', e.target.value)}>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s[0].toUpperCase() + s.slice(1)}</option>)}
          </select>
          <select className="select-input" value={table.filters.order_type || 'All'} onChange={(e) => table.setFilter('order_type', e.target.value)}>
            <option value="All">All Types</option>
            <option value="dine_in">Dine-In</option>
            <option value="take_out">Take-Out</option>
          </select>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => table.toggleSort('order_number')} style={{ cursor: 'pointer' }}>Order #</th>
              <th>Type</th>
              <th>Table</th>
              <th>Cashier</th>
              <th>Items</th>
              <th onClick={() => table.toggleSort('created_at')} style={{ cursor: 'pointer' }}>Time</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonRows rows={6} cols={8} />
            ) : table.items.length === 0 ? (
              <tr><td colSpan={8}><EmptyState title="No orders found" message="Try adjusting your search or filters." /></td></tr>
            ) : (
              table.items.map((o) => (
                <tr key={o.id} className="clickable" onClick={() => setSelected(o)}>
                  <td><strong>{o.order_number}</strong></td>
                  <td>{o.order_type === 'dine_in' ? 'Dine-In' : 'Take-Out'}</td>
                  <td>{o.table_number || '—'}</td>
                  <td>{o.cashier_name}</td>
                  <td>{o.items.length} item{o.items.length !== 1 ? 's' : ''}</td>
                  <td>{o.created_at}</td>
                  <td><span className={`badge badge--${o.status}`}>{o.status}</span></td>
                  <td><button className="btn btn--ghost btn--icon" onClick={(e) => { e.stopPropagation(); setSelected(o); }}><Eye size={15} /></button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {!loading && (
          <Pagination page={table.page} totalPages={table.totalPages} onChange={table.setPage} totalItems={table.totalItems} pageSize={table.pageSize} />
        )}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.order_number}>
        {selected && (
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-muted">{selected.order_type === 'dine_in' ? `Table ${selected.table_number}` : 'Take-Out'}</span>
              <span className={`badge badge--${selected.status}`}>{selected.status}</span>
            </div>
            {selected.items.map((it, i) => (
              <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <div className="flex justify-between">
                  <span>{it.qty}× {it.name}</span>
                </div>
                {it.notes && <div className="text-muted" style={{ fontSize: 12 }}>Note: {it.notes}</div>}
              </div>
            ))}
            <div className="text-muted mt-2" style={{ fontSize: 12 }}>Placed by {selected.cashier_name} at {selected.created_at}</div>
          </div>
        )}
      </Modal>
    </div>
  );
}

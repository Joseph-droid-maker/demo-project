import { useState, useEffect } from 'react';
import { Clock, Volume2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { MOCK_ORDERS, KDS_COLUMNS, NEXT_STATUS } from '../data/orders.js';

const ACTION_LABEL = { pending: 'Accept', preparing: 'Mark Ready', ready: 'Mark Served' };

export default function KitchenPage() {
  // Local copy of orders so advancing status here is a real, working
  // interaction (per brief: "simulate realistic interactions") without
  // needing a shared global store for this demo's scope.
  const [orders, setOrders] = useState(MOCK_ORDERS.filter((o) => o.status !== 'completed'));
  const [now, setNow] = useState(Date.now());

  // Ticking clock for the topbar time + (in a real build) elapsed-time
  // timers per card. setInterval + cleanup is the standard React pattern
  // for any recurring side effect.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  function advance(orderId, currentStatus) {
    const next = NEXT_STATUS[currentStatus];
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: next } : o)));
    toast.success(next === 'served' ? 'Order marked as served' : `Order moved to ${next}`);
  }

  const timeLabel = new Date(now).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="kds-page">
      <div className="kds-header">
        <div>
          <h1>Kitchen Display System</h1>
          <p style={{ color: 'rgba(246,246,244,0.55)', fontSize: 13 }}>Live order queue — updates in real time</p>
        </div>
        <div className="flex items-center gap-2" style={{ color: 'white' }}>
          <Volume2 size={18} />
          <strong>{timeLabel}</strong>
        </div>
      </div>

      <div className="kds-columns">
        {KDS_COLUMNS.map((col) => {
          const colOrders = orders.filter((o) => o.status === col.key);
          return (
            <div className="kds-column" key={col.key}>
              <div className="kds-column__header">
                <strong>{col.label}</strong>
                <span className="kds-column__count">{colOrders.length}</span>
              </div>

              {colOrders.length === 0 ? (
                <p style={{ color: 'rgba(246,246,244,0.35)', fontSize: 12.5, textAlign: 'center', padding: '24px 0' }}>
                  No orders here
                </p>
              ) : (
                colOrders.map((o) => (
                  <div className={`kds-card ${o.priority === 'high' ? 'priority-high' : ''}`} key={o.id}>
                    <div className="kds-card__top">
                      <span className="kds-card__id">#{o.order_number.split('-').pop()}</span>
                      <span>{o.table_number ? `Table ${o.table_number}` : 'Take-Out'}</span>
                    </div>
                    <div className="kds-card__meta">{o.created_at}</div>
                    <ul className="kds-card__items">
                      {o.items.map((it, i) => (
                        <li key={i}>{it.qty}× {it.name}{it.notes && ` — ${it.notes}`}</li>
                      ))}
                    </ul>
                    <div className="kds-card__timer">
                      <Clock size={11} /> Placed at {o.created_at}
                    </div>
                    {col.key !== 'served' && (
                      <button className="btn btn--accent kds-card__action" onClick={() => advance(o.id, o.status)}>
                        {ACTION_LABEL[o.status]}
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>

      <div className="kds-overview">
        <div className="kds-overview__stat"><b>{orders.length}</b><span>Total Active Orders</span></div>
        <div className="kds-overview__stat"><b>{orders.filter((o) => o.status === 'pending').length}</b><span>New Orders</span></div>
        <div className="kds-overview__stat"><b>{orders.filter((o) => o.status === 'preparing').length}</b><span>Preparing</span></div>
        <div className="kds-overview__stat"><b>{orders.filter((o) => o.status === 'ready').length}</b><span>Ready</span></div>
        <div className="kds-overview__stat"><b>18 min</b><span>Avg Wait Time</span></div>
      </div>
    </div>
  );
}

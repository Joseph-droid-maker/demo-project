import { Link } from 'react-router-dom';
import {
  DollarSign, ShoppingBag, Table2, ChefHat, Receipt, Users as UsersIcon,
  TrendingUp, TrendingDown, ArrowRight,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DASHBOARD_KPIS, PAYMENT_BREAKDOWN, KITCHEN_STATUS, QUICK_ACTIONS } from '../data/dashboard.js';
import { SALES_TREND, TOP_SELLING_ITEMS } from '../data/transactions.js';
import { MOCK_ORDERS } from '../data/orders.js';
import { useSimulatedFetch } from '../hooks/useTableControls.js';
import { Skeleton } from '../components/ui/Feedback.jsx';

const peso = (n) => `₱${n.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

// KPI card config array — data-driven rendering instead of 6 near-identical
// JSX blocks copy-pasted with different props. Each `trend` is illustrative
// mock movement vs. yesterday, matching the spec's requirement for a trend line.
function useKpiCards() {
  const k = DASHBOARD_KPIS;
  return [
    { icon: DollarSign, label: "Today's Revenue", value: peso(k.todaysRevenue), trend: '+12.5%', up: true },
    { icon: ShoppingBag, label: 'Orders Today', value: k.ordersToday, trend: '+8.4%', up: true },
    { icon: Table2, label: 'Active Tables', value: `${k.activeTables.occupied}/${k.activeTables.total}`, trend: `${Math.round((k.activeTables.occupied / k.activeTables.total) * 100)}% Occupied`, up: true },
    { icon: ChefHat, label: 'Kitchen Queue', value: k.kitchenQueue, trend: 'Wait: 18 min', up: null },
    { icon: Receipt, label: 'Avg Order Value', value: peso(k.avgOrderValue), trend: '+6.2%', up: true },
    { icon: UsersIcon, label: 'Customer Count', value: k.customerCount, trend: '+10.1%', up: true },
  ];
}

export default function DashboardPage() {
  const { loading } = useSimulatedFetch(null, 600);
  const kpis = useKpiCards();
  const recentOrders = MOCK_ORDERS.slice(0, 4);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your restaurant's real-time performance</p>
        </div>
      </div>

      {/* --- 6-card KPI row, per spec §4 --- */}
      <div className="kpi-grid">
        {kpis.map((kpi, i) => (
          <div className="kpi-card" key={i}>
            {loading ? (
              <>
                <Skeleton height="36px" width="36px" style={{ borderRadius: 10, marginBottom: 10 }} />
                <Skeleton height="11px" width="60%" style={{ marginBottom: 8 }} />
                <Skeleton height="22px" width="70%" />
              </>
            ) : (
              <>
                <div className="kpi-card__top">
                  <div className="kpi-card__icon"><kpi.icon size={17} /></div>
                </div>
                <div className="kpi-card__label">{kpi.label}</div>
                <div className="kpi-card__value">{kpi.value}</div>
                <div className={`kpi-card__trend ${kpi.up === true ? 'up' : kpi.up === false ? 'down' : ''}`}>
                  {kpi.up === true && <TrendingUp size={12} />}
                  {kpi.up === false && <TrendingDown size={12} />}
                  {kpi.trend}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* --- Sales trend + payment breakdown --- */}
      <div className="analytics-row">
        <div className="card">
          <h3 className="card-title">Sales Trend (This Week)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={SALES_TREND}>
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#6B6A63' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B6A63' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}K`} />
              <Tooltip formatter={(v) => peso(v)} contentStyle={{ borderRadius: 10, border: '1px solid #E4E2DC', fontSize: 12 }} />
              <Bar dataKey="revenue" fill="#5B7088" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="card-title">Revenue by Payment Method</h3>
          {/* Cash-only per spec §5 — single-slice donut rather than a fake
              multi-method chart (one of the 8 flagged design violations). */}
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={PAYMENT_BREAKDOWN} dataKey="value" innerRadius={55} outerRadius={78} paddingAngle={2}>
                {PAYMENT_BREAKDOWN.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v, n, p) => peso(p.payload.amount)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-between items-center" style={{ padding: '0 8px' }}>
            <span className="text-muted" style={{ fontSize: 12.5 }}>Cash</span>
            <strong>{peso(DASHBOARD_KPIS.todaysRevenue)}</strong>
          </div>
        </div>
      </div>

      {/* --- Top items / recent orders / kitchen status --- */}
      <div className="three-col-row">
        <div className="card">
          <h3 className="card-title">Top Selling Items</h3>
          {TOP_SELLING_ITEMS.map((item) => (
            <div key={item.name} className="flex justify-between items-center" style={{ padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{item.name}</div>
                <div className="text-muted" style={{ fontSize: 11.5 }}>{item.qty} sold</div>
              </div>
              <strong style={{ fontSize: 13 }}>{peso(item.revenue)}</strong>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-2">
            <h3 className="card-title" style={{ marginBottom: 0 }}>Recent Orders</h3>
            <Link to="/orders" className="text-muted" style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
              View All <ArrowRight size={12} />
            </Link>
          </div>
          {recentOrders.map((o) => (
            <div key={o.id} className="flex justify-between items-center" style={{ padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{o.order_number}</div>
                <div className="text-muted" style={{ fontSize: 11.5 }}>{o.table_number ? `Table ${o.table_number}` : 'Take Out'}</div>
              </div>
              <span className={`badge badge--${o.status}`}>{o.status}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 className="card-title">Kitchen Status</h3>
          <div className="flex justify-between mb-2">
            <div>
              <div className="kpi-card__value" style={{ fontSize: 24 }}>{KITCHEN_STATUS.newOrders}</div>
              <div className="text-muted" style={{ fontSize: 11 }}>New Orders</div>
            </div>
            <div>
              <div className="kpi-card__value" style={{ fontSize: 24 }}>{KITCHEN_STATUS.preparing}</div>
              <div className="text-muted" style={{ fontSize: 11 }}>Preparing</div>
            </div>
            <div>
              <div className="kpi-card__value" style={{ fontSize: 24 }}>{KITCHEN_STATUS.ready}</div>
              <div className="text-muted" style={{ fontSize: 11 }}>Ready</div>
            </div>
          </div>
          <Link to="/kitchen" className="btn btn--secondary btn--block btn--sm">Open Kitchen Display</Link>
        </div>
      </div>

      {/* --- Quick Actions — locked set per spec §4 --- */}
      <div className="card">
        <h3 className="card-title">Quick Actions</h3>
        <div className="quick-actions-row">
          {QUICK_ACTIONS.map((qa) => (
            <Link key={qa.label} to={qa.to} className="quick-action-btn">
              <span style={{ fontWeight: 600, fontSize: 13 }}>{qa.label}</span>
              <ArrowRight size={14} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

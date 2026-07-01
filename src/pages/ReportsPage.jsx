import { useState } from 'react';
import { DollarSign, ShoppingBag, Users as UsersIcon, Receipt, TrendingUp, Download, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import {
  REPORT_KPIS, SALES_TREND, HOURLY_SALES, CATEGORY_DISTRIBUTION,
  MOCK_TRANSACTIONS, TRANSACTION_SUMMARY, REFUND_SUMMARY,
} from '../data/transactions.js';
import { useSimulatedFetch } from '../hooks/useTableControls.js';
import { Skeleton } from '../components/ui/Feedback.jsx';

const peso = (n) => `₱${n.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
const PRESETS = ['Daily', 'Weekly', 'Monthly', 'Yearly', 'Custom'];
const ORDER_TYPE_SPLIT = [
  { name: 'Dine-In', value: 68, color: '#33312D' },
  { name: 'Take-Out', value: 32, color: '#5B7088' },
];

export default function ReportsPage() {
  const { loading } = useSimulatedFetch(null, 650);
  const [preset, setPreset] = useState('Daily');
  const [tab, setTab] = useState('transactions');
  const [exporting, setExporting] = useState(false);

  const kpis = [
    { icon: DollarSign, label: 'Revenue', value: peso(REPORT_KPIS.revenue) },
    { icon: ShoppingBag, label: 'Total Orders', value: REPORT_KPIS.totalOrders },
    { icon: UsersIcon, label: 'Total Customers', value: REPORT_KPIS.totalCustomers },
    { icon: Receipt, label: 'Avg Order Value', value: peso(REPORT_KPIS.avgOrderValue) },
    { icon: TrendingUp, label: 'Gross Profit', value: peso(REPORT_KPIS.grossProfit) },
  ];

  // Simulated export — brief explicitly says no real PDF generation is
  // required, just a success message / preview affordance.
  function handleExport() {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      toast.success('Report exported — PDF ready for download');
    }, 900);
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Reports &amp; Analytics</h1>
          <p>Sales performance, transactions, and financial summaries</p>
        </div>
        <div className="page-header-actions">
          <div className="select-input flex items-center gap-1" style={{ position: 'relative' }}>
            <select className="select-input" style={{ border: 'none', padding: 0 }} value={preset} onChange={(e) => setPreset(e.target.value)}>
              {PRESETS.map((p) => <option key={p} value={p}>{p} Summary</option>)}
            </select>
          </div>
          {/* Single Export PDF button — no dropdown, per spec §8 (Excel/CSV removed from scope). */}
          <button className="btn btn--primary" onClick={handleExport} disabled={exporting}>
            <Download size={16} /> {exporting ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* --- 5-card KPI row, matches Dashboard's calculation, different label set --- */}
      <div className="kpi-grid kpi-grid--5">
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
                <div className="kpi-card__icon" style={{ marginBottom: 10 }}><kpi.icon size={17} /></div>
                <div className="kpi-card__label">{kpi.label}</div>
                <div className="kpi-card__value">{kpi.value}</div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* --- Full 2x2 analytics grid, per spec §8 --- */}
      <div className="analytics-grid-2x2">
        <div className="card">
          <h3 className="card-title">Sales Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={SALES_TREND}>
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#6B6A63' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B6A63' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}K`} />
              <Tooltip formatter={(v) => peso(v)} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              <Bar dataKey="revenue" fill="#5B7088" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="card-title">Category Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={CATEGORY_DISTRIBUTION} dataKey="value" nameKey="name" innerRadius={50} outerRadius={75} paddingAngle={2}>
                {CATEGORY_DISTRIBUTION.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="card-title">Hourly Sales</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={HOURLY_SALES}>
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#6B6A63' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B6A63' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}K`} />
              <Tooltip formatter={(v) => peso(v)} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              <Line type="monotone" dataKey="amount" stroke="#33312D" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="card-title">Order Type Split</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={ORDER_TYPE_SPLIT} dataKey="value" nameKey="name" innerRadius={50} outerRadius={75} paddingAngle={2}>
                {ORDER_TYPE_SPLIT.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- Three distinct table sections, per spec §8: none replaces another --- */}
      <div className="tabs">
        <button className={`tab-btn ${tab === 'transactions' ? 'active' : ''}`} onClick={() => setTab('transactions')}>Transaction Log</button>
        <button className={`tab-btn ${tab === 'summary' ? 'active' : ''}`} onClick={() => setTab('summary')}>Transaction Summary</button>
        <button className={`tab-btn ${tab === 'refunds' ? 'active' : ''}`} onClick={() => setTab('refunds')}>Refund Summary</button>
      </div>

      {tab === 'transactions' && (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Date</th><th>Order #</th><th>Cashier</th><th>Payment</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {MOCK_TRANSACTIONS.map((t) => (
                <tr key={t.id}>
                  <td>{t.date}</td><td>{t.code}</td><td>{t.cashier}</td><td>{t.method}</td>
                  <td>{peso(t.amount)}</td>
                  <td><span className={`badge badge--${t.status.toLowerCase()}`}>{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'summary' && (
        <div className="card">
          {Object.entries({
            'Gross Sales': TRANSACTION_SUMMARY.grossSales,
            'Less: Discounts': -TRANSACTION_SUMMARY.discounts,
            'Less: Refunds': -TRANSACTION_SUMMARY.refunds,
          }).map(([label, val]) => (
            <div key={label} className="summary-row" style={{ fontSize: 13.5 }}><span>{label}</span><span>{val < 0 ? '-' : ''}{peso(Math.abs(val))}</span></div>
          ))}
          <div className="summary-row total"><span>Net Sales</span><span>{peso(TRANSACTION_SUMMARY.netSales)}</span></div>
          <div className="summary-row" style={{ fontSize: 13.5, marginTop: 10 }}><span>Service Charge</span><span>{peso(TRANSACTION_SUMMARY.serviceCharge)}</span></div>
          <div className="summary-row" style={{ fontSize: 13.5 }}><span>Tax</span><span>{peso(TRANSACTION_SUMMARY.tax)}</span></div>
          <div className="summary-row total" style={{ background: 'var(--primary)', color: 'white', padding: '12px 14px', borderRadius: 10, marginTop: 8 }}>
            <span>Grand Total</span><span>{peso(TRANSACTION_SUMMARY.grandTotal)}</span>
          </div>
        </div>
      )}

      {tab === 'refunds' && (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Transaction</th><th>Amount</th><th>Reason</th><th>Processed By</th><th>Date</th></tr></thead>
            <tbody>
              {REFUND_SUMMARY.map((r) => (
                <tr key={r.id}>
                  <td>{r.transaction}</td><td>{peso(r.amount)}</td><td style={{ maxWidth: 260 }}>{r.reason}</td>
                  <td>{r.processed_by}</td><td>{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

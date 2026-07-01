export const DASHBOARD_KPIS = {
  todaysRevenue: 48760,
  ordersToday: 156,
  activeTables: { occupied: 23, total: 40 },
  kitchenQueue: 12,
  avgOrderValue: 313.33,
  customerCount: 198,
};

export const PAYMENT_BREAKDOWN = [
  // Cash only per spec §5 — kept as a single-slice chart rather than a fake
  // multi-method breakdown, since that was one of the 8 flagged violations
  // in the original design audit (Option A: cash only, no payment chart).
  { name: 'Cash', value: 100, amount: 48760, color: '#33312D' },
];

export const KITCHEN_STATUS = {
  newOrders: 12,
  preparing: 8,
  ready: 5,
};

export const STAFF_ON_DUTY = { total: 12, checkedIn: 9, onBreak: 3 };

// Locked set per spec §4 — treat as confirmed, not illustrative examples.
export const QUICK_ACTIONS = [
  { label: 'Open POS',          to: '/pos' },
  { label: 'New Order',         to: '/pos' },
  { label: 'View Kitchen',      to: '/kitchen' },
  { label: 'View Reports',      to: '/reports' },
  { label: 'Manage Menu',       to: '/menu' },
  { label: 'Activity Logs',     to: '/activity-logs' },
];

// 7-day sales trend for the Reports "Sales Trend" chart.
export const SALES_TREND = [
  { day: 'Mon', revenue: 28400 },
  { day: 'Tue', revenue: 31200 },
  { day: 'Wed', revenue: 26800 },
  { day: 'Thu', revenue: 33900 },
  { day: 'Fri', revenue: 41200 },
  { day: 'Sat', revenue: 48700 },
  { day: 'Sun', revenue: 39300 },
];

// Hourly sales for today, for the "Hourly Sales" chart.
export const HOURLY_SALES = [
  { hour: '6AM', amount: 0 }, { hour: '8AM', amount: 3200 }, { hour: '10AM', amount: 9800 },
  { hour: '12PM', amount: 24500 }, { hour: '2PM', amount: 18200 }, { hour: '4PM', amount: 12100 },
  { hour: '6PM', amount: 27800 }, { hour: '8PM', amount: 31400 }, { hour: '10PM', amount: 6200 },
];

// Category distribution for the "Category Distribution" donut chart.
export const CATEGORY_DISTRIBUTION = [
  { name: 'Main Course', value: 40.2, color: '#33312D' },
  { name: 'Pasta',       value: 22.2, color: '#5B7088' },
  { name: 'Rice Meals',  value: 16.4, color: '#8CA0B3' },
  { name: 'Drinks',      value: 12.1, color: '#B9C5D0' },
  { name: 'Desserts',    value: 8.5,  color: '#E4E8EC' },
  { name: 'Others',      value: 0.6,  color: '#F0F2F4' },
];

export const TOP_SELLING_ITEMS = [
  { name: 'Truffle Pasta',      qty: 186, revenue: 40920 },
  { name: 'Grilled Salmon',     qty: 142, revenue: 46860 },
  { name: 'Beef Burger',        qty: 118, revenue: 29500 },
  { name: 'Iced Caramel Latte', qty: 93,  revenue: 13020 },
  { name: 'Halo-Halo',          qty: 81,  revenue: 13365 },
];

// Individual transaction rows for the Reports transaction log table.
export const MOCK_TRANSACTIONS = [
  { id: 1, code: 'TXN-20260702-046', date: '2026-07-02 10:29 AM', cashier: 'Maria Santos', method: 'Cash', amount: 1250.00, status: 'Completed' },
  { id: 2, code: 'TXN-20260702-045', date: '2026-07-02 10:17 AM', cashier: 'Anna Garcia',   method: 'Cash', amount: 780.00,  status: 'Completed' },
  { id: 3, code: 'TXN-20260702-044', date: '2026-07-02 10:03 AM', cashier: 'Maria Santos', method: 'Cash', amount: 430.00,  status: 'Refunded' },
  { id: 4, code: 'TXN-20260702-043', date: '2026-07-02 09:51 AM', cashier: 'Anna Garcia',   method: 'Cash', amount: 620.00,  status: 'Completed' },
  { id: 5, code: 'TXN-20260702-042', date: '2026-07-02 09:40 AM', cashier: 'Maria Santos', method: 'Cash', amount: 1890.00, status: 'Completed' },
  { id: 6, code: 'TXN-20260701-058', date: '2026-07-01 08:55 PM', cashier: 'Anna Garcia',   method: 'Cash', amount: 990.00,  status: 'Voided' },
];

export const REFUND_SUMMARY = [
  { id: 1, transaction: 'TXN-20260702-044', amount: 430.00, reason: 'Customer changed order after payment', processed_by: 'Maria Santos', date: '2026-07-02 10:08 AM' },
  { id: 2, transaction: 'TXN-20260630-021', amount: 250.00, reason: 'Wrong item served, customer requested refund instead of replacement', processed_by: 'Anna Garcia', date: '2026-06-30 01:12 PM' },
];

// Report KPIs — must match the Dashboard's KPI definitions exactly per spec §8.
export const REPORT_KPIS = {
  revenue: 340780,
  totalOrders: 1248,
  totalCustomers: 1102,
  avgOrderValue: 273.54,
  grossProfit: 162250,
};

export const TRANSACTION_SUMMARY = {
  grossSales: 340780,
  discounts: 10450,
  refunds: 3250,
  netSales: 327080,
  serviceCharge: 32708,
  tax: 39249.60,
  grandTotal: 398037.60,
};

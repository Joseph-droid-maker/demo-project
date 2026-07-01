// action_type / entity_type mirror the real audit_logs schema so this data
// demonstrates the exact same columns and filters the production table uses.
export const MOCK_LOGS = [
  { id: 1, timestamp: '2026-07-02 10:29 AM', user: 'Maria Santos', role: 'cashier', action: 'login',  module: 'Auth',  target: '—',                    reason: null, status: 'Success' },
  { id: 2, timestamp: '2026-07-02 10:08 AM', user: 'Maria Santos', role: 'cashier', action: 'update', module: 'Order', target: 'TXN-20260702-044',      reason: 'Customer changed order after payment', status: null },
  { id: 3, timestamp: '2026-07-02 09:40 AM', user: 'Maria Santos', role: 'cashier', action: 'create', module: 'Order', target: 'ORD-20260702-042',      reason: null, status: null },
  { id: 4, timestamp: '2026-07-01 08:55 PM', user: 'Anna Garcia',  role: 'cashier', action: 'update', module: 'Order', target: 'ORD-20260701-058',      reason: 'Customer left without paying — kitchen already started prep', status: null },
  { id: 5, timestamp: '2026-07-01 07:30 PM', user: 'System Administrator', role: 'admin', action: 'update', module: 'Menu Item', target: 'Sizzling Sisig', reason: 'Marked unavailable — out of pork belly stock', status: null },
  { id: 6, timestamp: '2026-07-01 03:15 PM', user: 'System Administrator', role: 'admin', action: 'create', module: 'Menu Item', target: "Chef's Seafood Platter", reason: null, status: null },
  { id: 7, timestamp: '2026-07-01 11:02 AM', user: 'System Administrator', role: 'admin', action: 'update', module: 'User', target: 'lisa.wong', reason: 'Extended leave of absence', status: null },
  { id: 8, timestamp: '2026-06-30 01:12 PM', user: 'Anna Garcia',  role: 'cashier', action: 'update', module: 'Order', target: 'TXN-20260630-021', reason: 'Wrong item served, customer requested refund instead of replacement', status: null },
  { id: 9, timestamp: '2026-06-29 09:14 AM', user: 'unknown',      role: null,      action: 'login_failed', module: 'Auth', target: 'j.delacruz (attempted)', reason: null, status: 'Failed' },
  { id: 10, timestamp: '2026-06-28 06:02 PM', user: 'System Administrator', role: 'admin', action: 'create', module: 'User', target: 'kevin.reyes', reason: null, status: null },
  { id: 11, timestamp: '2026-06-28 05:58 PM', user: 'System Administrator', role: 'admin', action: 'logout', module: 'Auth', target: '—', reason: null, status: 'Success' },
  { id: 12, timestamp: '2026-06-25 09:10 AM', user: 'System Administrator', role: 'admin', action: 'update', module: 'User', target: 'lisa.wong', reason: 'Deactivated — role reassignment pending', status: null },
];

export const LOG_MODULES = ['Auth', 'Order', 'Menu Item', 'User'];
export const LOG_ACTIONS = ['create', 'update', 'delete', 'login', 'logout', 'login_failed'];

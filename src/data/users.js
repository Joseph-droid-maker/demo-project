// Demo accounts. Shown directly on the login page per the demo spec.
// Role model matches the REAL backend (admin / cashier / kitchen) —
// not the original demo brief's 5-role list (admin/manager/cashier/cook/server).
// "Cook" was folded into "kitchen"; "Manager" and "Server" don't exist in the
// real system, so they're intentionally excluded here rather than invented.
export const DEMO_USERS = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    full_name: 'System Administrator',
    role: 'admin',
    avatarColor: '#33312D',
  },
  {
    id: 2,
    username: 'cashier',
    password: 'cashier123',
    full_name: 'Maria Santos',
    role: 'cashier',
    avatarColor: '#5B7088',
  },
  {
    id: 3,
    username: 'kitchen',
    password: 'kitchen123',
    full_name: 'Kevin Reyes',
    role: 'kitchen',
    avatarColor: '#8C6D4F',
  },
];

// Full user list for the User Management module — includes inactive accounts
// and more history than the 3 accounts you can actually log in as, so the
// table/filters have enough realistic data to demonstrate against.
export const MOCK_USERS = [
  { id: 1, username: 'admin',        full_name: 'System Administrator', email: 'admin@onehotelsavenue.ph',   role: 'admin',   status: 'Active',   last_login: '2026-07-02 08:12 AM' },
  { id: 2, username: 'cashier',      full_name: 'Maria Santos',         email: 'maria.santos@onehotelsavenue.ph', role: 'cashier', status: 'Active', last_login: '2026-07-02 07:45 AM' },
  { id: 3, username: 'kitchen',      full_name: 'Kevin Reyes',          email: 'kevin.reyes@onehotelsavenue.ph',  role: 'kitchen', status: 'Active', last_login: '2026-07-02 07:50 AM' },
  { id: 4, username: 'anna.garcia',  full_name: 'Anna Garcia',          email: 'anna.garcia@onehotelsavenue.ph',  role: 'cashier', status: 'Active', last_login: '2026-07-01 06:30 PM' },
  { id: 5, username: 'lisa.wong',    full_name: 'Lisa Wong',            email: 'lisa.wong@onehotelsavenue.ph',    role: 'kitchen', status: 'Inactive', last_login: '2026-06-25 09:10 AM' },
  { id: 6, username: 'paul.delacruz',full_name: 'Paul Dela Cruz',       email: 'paul.delacruz@onehotelsavenue.ph',role: 'cashier', status: 'Inactive', last_login: '2026-06-20 11:02 AM' },
];

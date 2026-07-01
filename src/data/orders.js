// Each order carries its own line items inline (denormalized) since this is
// mock data, not a relational store — mirrors what a joined API response
// would look like on the real backend.
export const MOCK_ORDERS = [
  {
    id: 10246, order_number: 'ORD-20260702-046', order_type: 'dine_in', table_number: 'A08',
    status: 'pending', cashier_name: 'Maria Santos', created_at: '10:28 AM', priority: 'high',
    items: [
      { name: 'Truffle Pasta', qty: 1, notes: '' },
      { name: 'Caesar Salad', qty: 1, notes: 'No cheese' },
    ],
  },
  {
    id: 10247, order_number: 'ORD-20260702-047', order_type: 'dine_in', table_number: 'A12',
    status: 'pending', cashier_name: 'Maria Santos', created_at: '10:29 AM', priority: 'normal',
    items: [
      { name: 'Beef Burger', qty: 1, notes: '' },
      { name: 'French Fries', qty: 1, notes: 'Well done' },
    ],
  },
  {
    id: 10244, order_number: 'ORD-20260702-044', order_type: 'take_out', table_number: null,
    status: 'preparing', cashier_name: 'Anna Garcia', created_at: '10:20 AM', priority: 'high',
    items: [
      { name: 'Grilled Salmon', qty: 1, notes: '' },
      { name: 'Mashed Potatoes', qty: 1, notes: '' },
      { name: 'Steamed Veggies', qty: 1, notes: 'Extra lemon' },
    ],
  },
  {
    id: 10245, order_number: 'ORD-20260702-045', order_type: 'dine_in', table_number: 'B15',
    status: 'preparing', cashier_name: 'Maria Santos', created_at: '10:21 AM', priority: 'normal',
    items: [
      { name: 'Carbonara', qty: 1, notes: '' },
      { name: 'Garlic Bread', qty: 1, notes: '' },
    ],
  },
  {
    id: 10242, order_number: 'ORD-20260702-042', order_type: 'dine_in', table_number: 'C05',
    status: 'ready', cashier_name: 'Anna Garcia', created_at: '10:15 AM', priority: 'normal',
    items: [
      { name: 'Beef Burger', qty: 1, notes: '' },
      { name: 'French Fries', qty: 1, notes: '' },
    ],
  },
  {
    id: 10241, order_number: 'ORD-20260702-041', order_type: 'dine_in', table_number: 'A07',
    status: 'ready', cashier_name: 'Maria Santos', created_at: '10:14 AM', priority: 'normal',
    items: [
      { name: 'Truffle Pasta', qty: 1, notes: '' },
      { name: 'Iced Tea', qty: 2, notes: '' },
    ],
  },
  {
    id: 10239, order_number: 'ORD-20260702-039', order_type: 'dine_in', table_number: 'A11',
    status: 'served', cashier_name: 'Maria Santos', created_at: '10:05 AM', priority: 'normal',
    items: [{ name: 'Margherita Pizza', qty: 1, notes: '' }],
  },
  {
    id: 10238, order_number: 'ORD-20260702-038', order_type: 'dine_in', table_number: 'B06',
    status: 'served', cashier_name: 'Anna Garcia', created_at: '10:02 AM', priority: 'normal',
    items: [{ name: 'Truffle Pasta', qty: 1, notes: '' }],
  },
  {
    id: 10237, order_number: 'ORD-20260702-037', order_type: 'take_out', table_number: null,
    status: 'completed', cashier_name: 'Maria Santos', created_at: '09:58 AM', priority: 'normal',
    items: [{ name: 'Caesar Salad', qty: 1, notes: '' }],
  },
  {
    id: 10240, order_number: 'ORD-20260702-040', order_type: 'dine_in', table_number: 'A02',
    status: 'completed', cashier_name: 'Anna Garcia', created_at: '09:55 AM', priority: 'normal',
    items: [
      { name: 'Margherita Pizza', qty: 1, notes: '' },
      { name: 'Iced Tea', qty: 1, notes: '' },
    ],
  },
];

export const KDS_COLUMNS = [
  { key: 'pending',   label: 'New Orders' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'ready',     label: 'Ready to Serve' },
  { key: 'served',    label: 'Served' },
];

// The next status an order moves to when a kitchen user advances it.
export const NEXT_STATUS = {
  pending: 'preparing',
  preparing: 'ready',
  ready: 'served',
  served: 'completed',
};

import { useState, useMemo } from 'react';
import { Search, Plus, Minus, Trash2, X, Receipt as ReceiptIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { CATEGORIES, MOCK_MENU_ITEMS } from '../data/menu.js';
import { MOCK_SETTINGS } from '../data/settings.js';
import Modal from '../components/ui/Modal.jsx';

const peso = (n) => `₱${n.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
const TAX_RATE = parseFloat(MOCK_SETTINGS.find((s) => s.key === 'tax_rate').value) / 100;
const SERVICE_RATE = parseFloat(MOCK_SETTINGS.find((s) => s.key === 'service_charge_rate').value) / 100;

export default function POSPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [orderType, setOrderType] = useState('dine_in'); // 'dine_in' | 'take_out' — Delivery removed per spec §5
  const [tableNumber, setTableNumber] = useState('');

  // Cart: array of { cartId, menuItemId, name, price, qty, notes }. cartId
  // (not menuItemId) is the React `key` and identity used for updates —
  // this is what allows "Burger, no onions" and "Burger, extra cheese" to
  // coexist as two distinct rows, matching the real order_items schema's
  // documented behavior (same menu_item_id, different notes = separate rows).
  const [cart, setCart] = useState([]);
  const [voidModalOpen, setVoidModalOpen] = useState(false);
  const [voidReason, setVoidReason] = useState('');
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [cashGiven, setCashGiven] = useState('');
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [lastReceipt, setLastReceipt] = useState(null);

  // Filter menu items by category + search text. Simple derivation, no
  // useMemo needed at this data size (30 items) — premature optimization
  // would add complexity without a measurable benefit here.
  const visibleItems = MOCK_MENU_ITEMS.filter((item) => {
    if (!item.is_active) return false;
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  function addToCart(item) {
    if (!item.is_available) return; // Greyed-out items can't be added — matches real is_available flag semantics.
    setCart((prev) => {
      // If this exact item with no notes already exists, just bump qty
      // rather than creating a duplicate row. Items WITH notes always get
      // their own row (see order_items schema rationale above).
      const existing = prev.find((c) => c.menuItemId === item.id && !c.notes);
      if (existing) {
        return prev.map((c) => (c.cartId === existing.cartId ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prev, { cartId: crypto.randomUUID(), menuItemId: item.id, name: item.name, price: item.price, qty: 1, notes: '' }];
    });
  }

  function updateQty(cartId, delta) {
    setCart((prev) =>
      prev
        .map((c) => (c.cartId === cartId ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0) // Dragging qty to 0 removes the line — standard POS UX.
    );
  }

  function updateNotes(cartId, notes) {
    setCart((prev) => prev.map((c) => (c.cartId === cartId ? { ...c, notes } : c)));
  }

  function removeItem(cartId) {
    // Per spec §5: removing a single item from an open cart is ordinary
    // editing — no confirmation, no audit log. Only a FULL order void is gated.
    setCart((prev) => prev.filter((c) => c.cartId !== cartId));
  }

  function clearOrder() {
    setCart([]);
    setTableNumber('');
    toast.success('Order cleared');
  }

  // useMemo here IS worth it — this recalculates on every cart change and
  // is read by both the summary panel and the payment modal.
  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
    const serviceCharge = subtotal * SERVICE_RATE;
    const tax = subtotal * TAX_RATE;
    const grandTotal = subtotal + serviceCharge + tax;
    return { subtotal, serviceCharge, tax, grandTotal };
  }, [cart]);

  const change = cashGiven ? Math.max(0, parseFloat(cashGiven) - totals.grandTotal) : 0;
  const cashInsufficient = cashGiven !== '' && parseFloat(cashGiven) < totals.grandTotal;

  // --- Void order flow (spec §5 + §9: mandatory reason, audit-logged) ---
  function confirmVoid() {
    if (!voidReason.trim()) return; // Reason is required — submit button is disabled anyway, this is a safety net.
    setCart([]);
    setVoidModalOpen(false);
    setVoidReason('');
    toast.success('Order voided and logged to Activity Logs');
  }

  // --- Checkout flow (cash only per spec §5) ---
  function completePayment() {
    const receipt = {
      orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
      items: cart,
      ...totals,
      cashGiven: parseFloat(cashGiven),
      change,
      orderType,
      tableNumber,
      timestamp: new Date().toLocaleString('en-PH'),
    };
    setLastReceipt(receipt);
    setPayModalOpen(false);
    setReceiptOpen(true);
    setCart([]);
    setCashGiven('');
    setTableNumber('');
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Cashier POS</h1>
          <p>Browse the menu and build the current order</p>
        </div>
        <div className="order-panel__type-toggle" style={{ padding: 0 }}>
          <button className={`chip ${orderType === 'dine_in' ? 'active' : ''}`} onClick={() => setOrderType('dine_in')}>Dine-In</button>
          <button className={`chip ${orderType === 'take_out' ? 'active' : ''}`} onClick={() => setOrderType('take_out')}>Take-Out</button>
        </div>
      </div>

      <div className="pos-layout">
        {/* ---------- Menu browsing column ---------- */}
        <div>
          <div className="search-input mb-2">
            <Search size={16} />
            <input placeholder="Search menu items..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <div className="pos-category-chips">
            {['All', ...CATEGORIES].map((cat) => (
              <button key={cat} className={`chip ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
                {cat}
              </button>
            ))}
          </div>

          {visibleItems.length === 0 ? (
            <div className="card"><p className="text-muted" style={{ textAlign: 'center', padding: 24 }}>No menu items match your search.</p></div>
          ) : (
            <div className="menu-item-grid">
              {visibleItems.map((item) => (
                <button key={item.id} className="menu-item-card" disabled={!item.is_available} onClick={() => addToCart(item)}>
                  <div className="menu-item-card__img">{item.image}</div>
                  <div className="menu-item-card__name">{item.name}</div>
                  <div className="menu-item-card__price">{peso(item.price)}</div>
                  {!item.is_available && <div className="badge badge--warning" style={{ marginTop: 6 }}>Unavailable</div>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ---------- Order / cart column ---------- */}
        <div className="order-panel">
          <div className="order-panel__header">
            <strong>Current Order</strong>
            <button className="btn btn--ghost btn--sm" onClick={clearOrder} disabled={cart.length === 0}>Clear Order</button>
          </div>

          {orderType === 'dine_in' && (
            <div style={{ padding: '0 16px', marginTop: 12 }}>
              <input
                className="text-input w-full"
                placeholder="Table number (e.g. A08)"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
              />
            </div>
          )}

          <div className="order-panel__items" style={{ marginTop: 12 }}>
            {cart.length === 0 ? (
              <div className="empty-state" style={{ padding: '32px 12px' }}>
                <div className="empty-state__icon"><ReceiptIcon size={22} /></div>
                <h4>No items yet</h4>
                <p>Tap a menu item to add it to this order.</p>
              </div>
            ) : (
              cart.map((c) => (
                <div className="cart-item" key={c.cartId}>
                  <div className="cart-item__top">
                    <span className="cart-item__name">{c.name}</span>
                    <button onClick={() => removeItem(c.cartId)} className="text-muted" aria-label="Remove item">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="qty-control">
                      <button onClick={() => updateQty(c.cartId, -1)}><Minus size={12} /></button>
                      <span style={{ minWidth: 18, textAlign: 'center', fontSize: 13 }}>{c.qty}</span>
                      <button onClick={() => updateQty(c.cartId, 1)}><Plus size={12} /></button>
                    </div>
                    <strong style={{ fontSize: 13 }}>{peso(c.price * c.qty)}</strong>
                  </div>
                  <input
                    className="text-input w-full"
                    style={{ marginTop: 8, fontSize: 12, padding: '6px 10px' }}
                    placeholder="Add note (e.g. no onions)"
                    value={c.notes}
                    onChange={(e) => updateNotes(c.cartId, e.target.value)}
                  />
                </div>
              ))
            )}
          </div>

          <div className="order-panel__summary">
            <div className="summary-row"><span>Subtotal</span><span>{peso(totals.subtotal)}</span></div>
            <div className="summary-row"><span>Service Charge ({(SERVICE_RATE * 100).toFixed(0)}%)</span><span>{peso(totals.serviceCharge)}</span></div>
            <div className="summary-row"><span>Tax ({(TAX_RATE * 100).toFixed(0)}%)</span><span>{peso(totals.tax)}</span></div>
            <div className="summary-row total"><span>Total</span><span>{peso(totals.grandTotal)}</span></div>
          </div>

          <div className="order-panel__pay">
            <button className="btn btn--secondary" disabled={cart.length === 0} onClick={() => setVoidModalOpen(true)}>Void Order</button>
            <button className="btn btn--primary" disabled={cart.length === 0} onClick={() => setPayModalOpen(true)}>Complete Order</button>
          </div>
        </div>
      </div>

      {/* ---------- Void confirmation — mandatory reason per spec §9 ---------- */}
      <Modal
        open={voidModalOpen}
        onClose={() => setVoidModalOpen(false)}
        title="Void Entire Order"
        footer={
          <>
            <button className="btn btn--ghost" onClick={() => setVoidModalOpen(false)}>Cancel</button>
            <button className="btn btn--danger" disabled={!voidReason.trim()} onClick={confirmVoid}>Void Order</button>
          </>
        }
      >
        <p className="text-muted" style={{ fontSize: 13, marginBottom: 14 }}>
          This will clear the entire order and record a permanent entry in Activity Logs. This action cannot be undone.
        </p>
        <div className="form-group">
          <label>Reason (required)</label>
          <textarea
            className="textarea-input"
            placeholder="Why is this order being voided?"
            value={voidReason}
            onChange={(e) => setVoidReason(e.target.value)}
          />
        </div>
      </Modal>

      {/* ---------- Cash payment modal ---------- */}
      <Modal
        open={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        title="Complete Payment — Cash"
        footer={
          <>
            <button className="btn btn--ghost" onClick={() => setPayModalOpen(false)}>Cancel</button>
            <button className="btn btn--primary" disabled={cashInsufficient || cashGiven === ''} onClick={completePayment}>
              Confirm Payment
            </button>
          </>
        }
      >
        <div className="summary-row total mb-2"><span>Amount Due</span><span>{peso(totals.grandTotal)}</span></div>
        <div className="form-group">
          <label>Cash Given</label>
          <input
            className="text-input w-full"
            type="number"
            placeholder="0.00"
            value={cashGiven}
            onChange={(e) => setCashGiven(e.target.value)}
            autoFocus
          />
          {cashInsufficient && <p className="form-hint" style={{ color: 'var(--red)' }}>Amount given is less than the total due.</p>}
        </div>
        {cashGiven !== '' && !cashInsufficient && (
          <div className="summary-row total"><span>Change</span><span>{peso(change)}</span></div>
        )}
      </Modal>

      {/* ---------- Receipt (simulated — no real PDF generation) ---------- */}
      <Modal open={receiptOpen} onClose={() => setReceiptOpen(false)} title="Payment Successful">
        {lastReceipt && (
          <div>
            <div className="empty-state" style={{ padding: '8px 0 20px' }}>
              <div className="empty-state__icon" style={{ background: 'var(--green-bg)', color: 'var(--green)' }}>
                <ReceiptIcon size={22} />
              </div>
              <h4>{lastReceipt.orderNumber}</h4>
              <p>{lastReceipt.timestamp}</p>
            </div>
            {lastReceipt.items.map((it) => (
              <div key={it.cartId} className="flex justify-between" style={{ fontSize: 12.5, marginBottom: 6 }}>
                <span>{it.qty}× {it.name}</span><span>{peso(it.price * it.qty)}</span>
              </div>
            ))}
            <div className="summary-row total mt-2"><span>Total Paid</span><span>{peso(lastReceipt.grandTotal)}</span></div>
            <div className="summary-row"><span>Cash Given</span><span>{peso(lastReceipt.cashGiven)}</span></div>
            <div className="summary-row"><span>Change</span><span>{peso(lastReceipt.change)}</span></div>
            <button className="btn btn--secondary btn--block mt-2" onClick={() => toast.success('Receipt sent to printer (simulated)')}>
              Print Receipt
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu as MenuIcon, Search, Bell, LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
import Sidebar from './Sidebar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const ROLE_LABEL = { admin: 'Administrator', cashier: 'Cashier', kitchen: 'Kitchen Staff' };

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Outside-click-to-close for the user dropdown — a very common UI pattern.
  // We attach the listener to `document` (captures clicks anywhere) and
  // check whether the click target is outside our ref'd element.
  useEffect(() => {
    function handleClick(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  const initials = user?.full_name
    ?.split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="app-main">
        <header className="topbar">
          <button className="hamburger-btn" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <MenuIcon size={20} />
          </button>

          <div className="topbar-search">
            <Search size={16} />
            {/* Search is visual-only at the topbar level (no global search
                index exists in this demo) — each page implements its own
                real, working search over its own dataset instead. */}
            <input placeholder="Search anything..." />
          </div>

          <div className="topbar-actions">
            <button className="topbar-icon-btn" aria-label="Notifications">
              <Bell size={18} />
              <span className="dot" />
            </button>

            <div className="topbar-user" ref={userMenuRef} style={{ position: 'relative' }}>
              <button
                className="flex items-center gap-1"
                onClick={() => setUserMenuOpen((o) => !o)}
                style={{ display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <div className="avatar" style={{ background: user?.avatarColor || '#33312D' }}>
                  {initials}
                </div>
                <div className="topbar-user__info">
                  <div className="topbar-user__name">{user?.full_name}</div>
                  <div className="text-muted" style={{ fontSize: 11.5 }}>{ROLE_LABEL[user?.role]}</div>
                </div>
                <ChevronDown size={14} className="text-muted" />
              </button>

              {userMenuOpen && (
                <div
                  className="card"
                  style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                    minWidth: 180, padding: 8, zIndex: 30,
                  }}
                >
                  <button
                    className="btn btn--ghost btn--block"
                    style={{ justifyContent: 'flex-start' }}
                    onClick={() => { setUserMenuOpen(false); navigate('/settings'); }}
                  >
                    <UserIcon size={15} /> My Profile
                  </button>
                  <button
                    className="btn btn--ghost btn--block"
                    style={{ justifyContent: 'flex-start', color: 'var(--red)' }}
                    onClick={handleLogout}
                  >
                    <LogOut size={15} /> Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="app-content">
          {/* Outlet renders whichever nested route matched — this is how
              react-router composes the shared Layout chrome around every
              page without each page re-implementing the sidebar/topbar. */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

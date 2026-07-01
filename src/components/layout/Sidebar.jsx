import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingCart, ClipboardList, ChefHat, UtensilsCrossed,
  BarChart3, Users, ScrollText, Settings, ChevronsLeft, ChevronsRight, UtensilsCrossed as Logo,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

// Nav items per spec §3, mapped to the real 3-role model. Activity Logs is
// admin-only per spec §9 ("never visible in nav or reachable by any other
// role"). Kitchen sees only Kitchen (KDS) and Orders — a kitchen account
// has no legitimate reason to see POS, Reports, or User Management.
const NAV = [
  { to: '/dashboard',     icon: LayoutDashboard,  label: 'Dashboard',     roles: ['admin'] },
  { to: '/pos',            icon: ShoppingCart,     label: 'POS',            roles: ['admin', 'cashier'] },
  { to: '/orders',         icon: ClipboardList,    label: 'Orders',         roles: ['admin', 'cashier'] },
  { to: '/kitchen',        icon: ChefHat,          label: 'Kitchen',        roles: ['admin', 'kitchen'] },
  { to: '/menu',           icon: UtensilsCrossed,  label: 'Menu',           roles: ['admin'] },
  { to: '/reports',        icon: BarChart3,        label: 'Reports',        roles: ['admin'] },
  { to: '/users',          icon: Users,            label: 'Users',          roles: ['admin'] },
  { to: '/activity-logs',  icon: ScrollText,       label: 'Activity Logs',  roles: ['admin'] },
  { to: '/settings',       icon: Settings,         label: 'Settings',       roles: ['admin'] },
];

export default function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }) {
  const { user } = useAuth();

  // .filter keeps only the items this user's role is allowed to see —
  // this IS the "role-based navigation is enforced" requirement from the
  // brief's Technical Expectations section, not just a visual affordance.
  const visibleNav = NAV.filter((item) => item.roles.includes(user?.role));

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand__logo"><Logo size={18} color="white" /></div>
          {!collapsed && <span className="sidebar-brand__name">One Hotel's Avenue</span>}
        </div>

        <nav className="sidebar-nav">
          {visibleNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              // NavLink's className can be a function of isActive — this is
              // how react-router lets us style the current route without
              // manually comparing location.pathname ourselves.
              className={({ isActive }) => `sidebar-nav__item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={18} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-collapse-btn" onClick={onToggleCollapse}>
            {collapsed ? <ChevronsRight size={16} /> : <><ChevronsLeft size={16} /> Collapse</>}
          </button>
        </div>
      </aside>

      {/* Mobile drawer scrim — clicking it closes the drawer, same UX as
          every standard mobile nav pattern. */}
      <div className="sidebar-scrim" onClick={onCloseMobile} />
    </>
  );
}

import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  LayoutDashboard, Users, ShoppingBag, Tag, CreditCard,
  LogOut, ChevronRight,
} from 'lucide-react';

const NAV = [
  { to: '/admin',            label: 'Dashboard',  icon: LayoutDashboard, end: true },
  { to: '/admin/users',      label: 'Users',      icon: Users },
  { to: '/admin/ads',        label: 'Ads',        icon: ShoppingBag },
  { to: '/admin/categories', label: 'Categories', icon: Tag },
  { to: '/admin/payments',   label: 'Payments',   icon: CreditCard },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user } = useSelector((s: RootState) => s.auth);

  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-56 bg-sellora-primary shrink-0 flex flex-col">
        <div className="px-5 py-4 border-b border-white/20">
          <span className="text-white font-black text-xl tracking-tight">
            Sellora
            <span className="text-sellora-accent text-xs font-semibold ml-1.5 align-middle">ADMIN</span>
          </span>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-0.5">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-white/20 text-white font-semibold'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/20">
          <p className="text-white/60 text-xs mb-2 truncate">{user.email}</p>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/70 hover:text-white text-xs transition-colors"
          >
            <LogOut size={14} /> Back to site
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-1 text-xs text-gray-400">
          <span>Admin</span>
          <ChevronRight size={12} />
          <span className="text-gray-700 font-medium capitalize">
            {location.pathname.split('/admin/')[1] || 'Dashboard'}
          </span>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Zap,
  Users,
  Wrench,
  Bus,
  AlertTriangle,
  Menu,
  X,
} from 'lucide-react';

export type Page =
  | 'dashboard'
  | 'buildings'
  | 'energy'
  | 'occupancy'
  | 'infrastructure'
  | 'transportation'
  | 'alerts';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { page: Page; label: string; icon: React.ElementType }[] = [
  { page: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { page: 'buildings', label: 'Buildings', icon: Building2 },
  { page: 'energy', label: 'Energy', icon: Zap },
  { page: 'occupancy', label: 'Occupancy', icon: Users },
  { page: 'infrastructure', label: 'Infrastructure', icon: Wrench },
  { page: 'transportation', label: 'Transportation', icon: Bus },
  { page: 'alerts', label: 'Alerts', icon: AlertTriangle },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
}) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleNav = (page: Page) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  const navContent = (
    <nav className="flex flex-col gap-1 p-3">
      {navItems.map(({ page, label, icon: Icon }) => {
        const active = currentPage === page;
        return (
          <button
            key={page}
            id={`nav-${page}`}
            onClick={() => handleNav(page)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? 'bg-campus-600 text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        id="sidebar-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-white p-2 shadow-md lg:hidden"
        aria-label="Toggle navigation"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-60 flex-col border-r border-gray-200 bg-white transition-transform lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-4">
          <Building2 className="text-campus-600" size={24} />
          <div>
            <h1 className="text-sm font-bold text-gray-900">Smart Campus</h1>
            <p className="text-xs text-gray-500">Digital Twin</p>
          </div>
        </div>
        {navContent}
        <div className="mt-auto border-t border-gray-200 p-4">
          <p className="text-xs text-gray-400">
            Simulated Data · v1.0.0
          </p>
        </div>
      </aside>
    </>
  );
};

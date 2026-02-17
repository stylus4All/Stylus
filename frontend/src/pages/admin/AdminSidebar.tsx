import React from 'react';
import { User, Box, ShoppingCart, Settings2, FileText, Activity, PieChart, Wallet, ShieldCheck, LogOut, X } from 'lucide-react';

const AdminSidebar: React.FC<{ active?: string; onSelect?: (tab: string) => void; isMobileOpen?: boolean; onClose?: () => void; collapsed?: boolean }> = ({ active = 'analytics', onSelect, isMobileOpen = false, onClose, collapsed = false }) => {
  const items = [
    { key: 'analytics', label: 'Overview', icon: PieChart },
    { key: 'users', label: 'Users', icon: User },
    { key: 'global_activity', label: 'Activity', icon: Activity },
    { key: 'inventory', label: 'Inventory', icon: ShoppingCart },
    { key: 'verifications', label: 'Verifications', icon: ShieldCheck },
    { key: 'financials', label: 'Financials', icon: Wallet },
    { key: 'settings', label: 'Settings', icon: Settings2 }
  ];

  return (
    <>
      {/* Mobile slide-over */}
      <div className={`${isMobileOpen ? 'fixed inset-0 z-50' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black/60" onClick={onClose} />
        <div className="absolute left-0 top-0 bottom-0 w-64 bg-[#150905] p-4 border-r border-white/5 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-serif text-lg text-cream">Admin</h4>
            <button onClick={onClose} className="text-cream/70 hover:text-golden-orange"><X size={18} /></button>
          </div>
          <nav className="flex flex-col gap-2">
            {items.map(i => {
              const Icon = i.icon as any;
              const isActive = active === i.key;
              return (
                <button
                  key={i.key}
                  onClick={() => { onSelect && onSelect(i.key); onClose && onClose(); }}
                  className={`flex items-center gap-3 text-sm p-2 rounded transition-colors ${isActive ? 'bg-golden-orange text-espresso font-bold' : 'text-cream/70 hover:bg-white/5'}`}
                >
                  <Icon size={16} />
                  <span>{i.label}</span>
                </button>
              );
            })}

            <div className="mt-4 border-t border-white/5 pt-3">
              <button onClick={() => { onSelect && onSelect('signout'); onClose && onClose(); }} className="flex items-center gap-3 text-sm p-2 rounded text-cream/70 hover:bg-white/5">
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className={`${collapsed ? 'w-20' : 'w-64'} hidden md:block transition-all`}> 
        <div className="bg-[#150905] border border-white/5 rounded-sm p-4 sticky top-6 h-[calc(100vh-48px)] overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h4 className={`font-serif text-lg text-cream ${collapsed ? 'hidden' : ''}`}>Admin</h4>
          </div>
          <nav className="flex flex-col gap-2">
            {items.map(i => {
              const Icon = i.icon as any;
              const isActive = active === i.key;
              return (
                <button
                  key={i.key}
                  onClick={() => onSelect && onSelect(i.key)}
                  className={`flex items-center gap-3 text-sm p-2 rounded transition-colors ${isActive ? 'bg-golden-orange text-espresso font-bold' : 'text-cream/70 hover:bg-white/5'}`}
                >
                  <Icon size={16} />
                  <span className={`${collapsed ? 'hidden' : ''}`}>{i.label}</span>
                </button>
              );
            })}

            <div className="mt-4 border-t border-white/5 pt-3">
              <button onClick={() => onSelect && onSelect('signout')} className={`flex items-center gap-3 text-sm p-2 rounded text-cream/70 hover:bg-white/5`}>
                <LogOut size={16} />
                <span className={`${collapsed ? 'hidden' : ''}`}>Sign Out</span>
              </button>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;

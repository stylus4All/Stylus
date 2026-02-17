import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminUsers: React.FC<{ users?: any[] }> = ({ users = [] }) => {
  const { updateUserStatus, updateUserRole, approveVerification, rejectVerification, updateWallet } = useAuth();
  const [filter, setFilter] = useState<'all' | 'active' | 'partners'>('all');
  const [selected, setSelected] = useState<any | null>(null);

  const handleRoleMenu = (user: any) => {
    // simple inline role change prompt
    const choice = prompt(`Change role for ${user.name} (enter: User / Partner / Admin)`);
    if (!choice) return;
    const normalized = choice.trim();
    if (!['User', 'Partner', 'Admin'].includes(normalized)) {
      alert('Invalid role. Use User, Partner, or Admin.');
      return;
    }
    if (!updateUserRole) return;
    if (!confirm(`Change role of ${user.name} to ${normalized}?`)) return;
    updateUserRole(user.id, normalized as any);
    alert(`${user.name} is now ${normalized}`);
  };

  const handleApprove = (user: any) => {
    if (!approveVerification) return;
    if (!confirm(`Approve verification for ${user.name}?`)) return;
    approveVerification(user.id);
    alert(`${user.name} approved.`);
    setSelected(null);
  };

  const handleReject = (user: any) => {
    if (!rejectVerification) return;
    const reason = prompt('Provide rejection reason:') || 'Invalid documents';
    if (!confirm(`Reject verification for ${user.name}?`)) return;
    rejectVerification(user.id, reason);
    alert(`${user.name} rejected.`);
    setSelected(null);
  };

  const handleChangeRole = (user: any) => {
    handleRoleMenu(user);
  };

  const handleAdjustWallet = async (user: any) => {
    if (!updateWallet) return;
    const amtStr = prompt('Enter amount to add (positive) or deduct (negative) e.g. 5000 or -2000');
    if (!amtStr) return;
    const amount = Number(amtStr);
    if (isNaN(amount) || amount === 0) {
      alert('Invalid amount');
      return;
    }
    const reason = prompt('Reason for adjustment:') || 'Admin adjustment';
    try {
      await updateWallet(user.id, amount, reason);
      alert('Wallet updated.');
      setSelected(null);
    } catch (err) {
      console.error(err);
      alert('Failed to update wallet.');
    }
  };

  const visible = users.filter(u => {
    if (filter === 'all') return true;
    if (filter === 'active') return u.status === 'Active';
    if (filter === 'partners') return u.role === 'Partner';
    return true;
  });

  const toggleStatus = (user: any) => {
    if (!updateUserStatus) return;
    if (user.status === 'Active') {
      const reason = prompt(`Suspend ${user.name}? Provide a reason:`) || 'No reason provided';
      if (!confirm(`Confirm suspend ${user.name}?`)) return;
      updateUserStatus(user.id, 'Suspended', reason);
      alert(`${user.name} suspended.`);
    } else {
      if (!confirm(`Reactivate ${user.name}?`)) return;
      updateUserStatus(user.id, 'Active');
      alert(`${user.name} reactivated.`);
    }
  };

  return (
    <div className="bg-[#1f0c05] border border-white/10 rounded-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-xl text-cream">Users</h3>
        <div className="flex gap-2">
          <button onClick={() => setFilter('all')} className={`text-xs px-3 py-1 rounded ${filter === 'all' ? 'bg-golden-orange text-espresso' : 'text-cream/60 hover:text-golden-orange'}`}>All</button>
          <button onClick={() => setFilter('active')} className={`text-xs px-3 py-1 rounded ${filter === 'active' ? 'bg-golden-orange text-espresso' : 'text-cream/60 hover:text-golden-orange'}`}>Active</button>
          <button onClick={() => setFilter('partners')} className={`text-xs px-3 py-1 rounded ${filter === 'partners' ? 'bg-golden-orange text-espresso' : 'text-cream/60 hover:text-golden-orange'}`}>Partners</button>
        </div>
      </div>

      <div className="space-y-2">
        {visible.length === 0 ? (
          <p className="text-cream/50">No users available.</p>
        ) : (
          visible.map(u => (
            <div key={u.id} className="p-3 bg-black/20 rounded-sm flex justify-between items-center">
              <div>
                <div className="font-bold text-cream">{u.name} <span className="text-xs text-cream/50">· {u.role}</span></div>
                <div className="text-xs text-cream/50">{u.email} • {u.phone || '—'}</div>
                <div className="text-xs text-cream/40 mt-1">Status: <span className={`font-bold ${u.status === 'Active' ? 'text-green-400' : 'text-red-400'}`}>{u.status}</span></div>
                <div className="text-xs text-cream/40">Wallet: <span className="font-bold">₦{(u.walletBalance || 0).toLocaleString()}</span></div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => toggleStatus(u)} className={`text-xs px-3 py-1 rounded ${u.status === 'Active' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
                  {u.status === 'Active' ? 'Suspend' : 'Activate'}
                </button>
                <button onClick={() => setSelected(u)} className="text-xs px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-cream">Details</button>
                <div className="relative">
                  <button onClick={() => handleRoleMenu(u)} className="text-xs px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-cream">Role</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl bg-[#1f0c05] border border-golden-orange p-6 rounded-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-serif text-2xl text-cream">{selected.name}</h3>
                <p className="text-xs text-cream/50">{selected.role} · Joined: {selected.joined || '—'}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setSelected(null)} className="text-cream/60 hover:text-golden-orange">Close</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-cream/50 text-xs">Email</p>
                <p className="text-cream font-bold">{selected.email}</p>

                <p className="text-cream/50 text-xs mt-3">Phone</p>
                <p className="text-cream">{selected.phone || '—'}</p>

                <p className="text-cream/50 text-xs mt-3">Address</p>
                <p className="text-cream">{selected.address || '—'}</p>
              </div>

              <div>
                <p className="text-cream/50 text-xs">Wallet Balance</p>
                <p className="text-cream font-bold">₦{(selected.walletBalance || 0).toLocaleString()}</p>

                <p className="text-cream/50 text-xs mt-3">Verification</p>
                <p className="text-cream">{selected.verificationStatus}</p>

                <p className="text-cream/50 text-xs mt-3">Rental Count / Avg Spend</p>
                <p className="text-cream">{selected.rentalHistoryCount || 0} / {selected.avgSpend || '₦0'}</p>
              </div>
            </div>

            <div className="flex gap-2">
              {selected.verificationStatus === 'Pending' && (
                <>
                  <button onClick={() => handleApprove(selected)} className="px-3 py-2 bg-green-600 text-cream rounded text-sm">Approve</button>
                  <button onClick={() => handleReject(selected)} className="px-3 py-2 bg-red-600 text-cream rounded text-sm">Reject</button>
                </>
              )}

              <button onClick={() => handleChangeRole(selected)} className="px-3 py-2 bg-white/5 text-cream rounded text-sm">Change Role</button>
              <button onClick={() => handleAdjustWallet(selected)} className="px-3 py-2 bg-white/5 text-cream rounded text-sm">Adjust Wallet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

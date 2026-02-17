import React, { useState } from 'react';
import { 
    Check, Plus, Search, Trash2, ShieldCheck, Power, 
    AlertTriangle, Wallet, BarChart3, PieChart, Star, 
    Activity, TrendingUp, DollarSign, ArrowUp, X, 
    CheckCircle, XCircle, FileText, Eye, Building2, User,
    Download, Menu 
} from 'lucide-react';
import { Button } from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useProduct } from '../../context/ProductContext';
import { useOrders } from '../../context/OrderContext';
import { Category, Product } from '../../types';
import AdminSidebar from './AdminSidebar';
import AdminUsers from './AdminUsers';
import { inventoryItems, financialRecords, verificationRequests, activityLogs, settingsDefaults } from './adminData';
import { useEffect } from 'react';

export const AdminDashboard: React.FC = () => {
        const [activeTab, setActiveTab] = useState<'users' | 'rentals' | 'inventory' | 'marketing' | 'verifications' | 'global_activity' | 'financials' | 'analytics'>('analytics');
        const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<{ url: string, title: string } | null>(null);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [userFilter, setUserFilter] = useState<'All' | 'User' | 'Partner'>('All');
  
  const auth = useAuth();
  const { 
    logout, 
    registeredUsers: contextUsers, 
    deleteUser, 
    approveVerification, 
    rejectVerification, 
    updateUserStatus,
    transactions: contextTransactions,
    processWithdrawal,
    updateWallet
  } = auth || {};

  const registeredUsers = contextUsers || [];
  const transactions = contextTransactions || [];
  
    const productContext = useProduct();
    const { products: contextProducts, removeProduct, addProduct, updateProduct } = productContext || {};
    const products = contextProducts || [];

  const orderContext = useOrders();
  const { orders: contextOrders, updateOrderItemStatus } = orderContext || {};
  const orders = contextOrders || [];
  
  const navigate = useNavigate();

  const pendingVerifications = registeredUsers.filter(u => u && u.verificationStatus === 'Pending');

  const [newItem, setNewItem] = useState<Partial<Product>>({
    name: '', brand: '', category: Category.WOMEN, rentalPrice: 0, retailPrice: 0, buyPrice: 0, isForSale: false, description: '', availableSizes: [], images: [], color: '', occasion: '', autoSellAfterRentals: 0
  });
  const [sizeInput, setSizeInput] = useState('');

  const filteredUsers = registeredUsers.filter(u => {
      if (userFilter === 'All') return true;
      return u?.role === userFilter;
  });

    // Analytics helpers
    const totalUsers = registeredUsers.length;
    const activePartners = registeredUsers.filter(u => u.role === 'Partner' && u.status === 'Active').length;
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
    const totalRentedItems = orders.reduce((s, o) => s + o.items.filter(i => i.type === 'rent').length, 0);
    const totalSalesAmount = orders.reduce((s, o) => s + o.items.filter(i => i.type === 'buy').reduce((a, b) => a + (b.price || 0), 0), 0);

    // Monthly revenue for last 6 months
    const getMonthKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()+1}`;
    const months: string[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
        const dt = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push(getMonthKey(dt));
    }
    const monthLabels = months.map(m => {
        const [y, mon] = m.split('-');
        const date = new Date(Number(y), Number(mon)-1, 1);
        return date.toLocaleString('default', { month: 'short', year: 'numeric' });
    });

    const monthlyRevenue = months.map(mk => {
        const [y, mon] = mk.split('-');
        const sum = orders.reduce((s, o) => {
            const d = new Date(o.date);
            const key = getMonthKey(d);
            if (key === mk) return s + (o.total || 0);
            return s;
        }, 0);
        return sum;
    });

    // Category distribution for pie chart
    const categoryCounts = products.reduce((acc: Record<string, number>, p) => {
        const k = p.category || 'Other';
        acc[k] = (acc[k] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const categoryEntries = Object.entries(categoryCounts);

    // Top rented products
    const topRented = [...products].sort((a,b) => (b.rentalCount||0) - (a.rentalCount||0)).slice(0,8);

  const handleLogout = () => { 
      if (logout) logout(); 
      navigate('/login'); 
  };

  const handleSuspendToggle = (userId: string, currentStatus: string) => {
      const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
      const reason = newStatus === 'Suspended' ? prompt("Enter reason for suspension:") : undefined;
      if (newStatus === 'Suspended' && !reason) return; // Cancel if no reason provided
      
      if (updateUserStatus) updateUserStatus(userId, newStatus, reason || undefined);
  };

  const handleDeleteUser = (userId: string) => {
      if(confirm("Are you sure you want to PERMANENTLY DELETE this user? This action cannot be undone.")) {
          if (deleteUser) deleteUser(userId);
      }
  };
  
  const handleApprove = (userId: string, userName: string) => {
      if(confirm(`Approve verification for ${userName}?`)) {
        if (approveVerification) approveVerification(userId);
      }
  };

  const handleReject = (userId: string) => {
      const reason = prompt("Please provide a reason for rejection (this will be sent to the user):", "Document ID number did not match upload.");
      if (reason) {
          if (rejectVerification) rejectVerification(userId, reason);
          alert("User rejected and notified.");
      }
  };

  const handleManualVerify = (userId: string, userName: string) => {
      if(confirm(`FORCE VERIFY: Are you sure you want to manually verify ${userName} without waiting for document submission?`)) {
          if (approveVerification) approveVerification(userId);
      }
  }

  // ESV SYSTEM (Export Save View)
  const handleExportData = (type: 'users' | 'products' | 'transactions') => {
      let headers: string[] = [];
      let rows: any[] = [];
      let filename = `stylus_export_${type}_${new Date().toISOString().split('T')[0]}.csv`;

      if (type === 'users') {
          headers = ["ID", "Name", "Email", "Role", "Status", "Joined", "Verification", "Wallet"];
          rows = registeredUsers.map(u => [u.id, u.name, u.email, u.role, u.status, u.joined, u.verificationStatus, u.walletBalance]);
      } else if (type === 'products') {
          headers = ["ID", "Name", "Brand", "Category", "Rental Price", "Buy Price", "Owner", "Rentals"];
          rows = products.map(p => [p.id, p.name, p.brand, p.category, p.rentalPrice, p.buyPrice, p.ownerId, p.rentalCount]);
      } else if (type === 'transactions') {
          headers = ["ID", "Date", "User", "Type", "Amount", "Status", "Description"];
          rows = transactions.map(t => [t.id, t.date, t.userName, t.type, t.amount, t.status, t.description]);
      }
      
      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handleDeleteProduct = (id: string) => {
      if(confirm("Are you sure you want to delete this product from the global inventory?")) {
          if (removeProduct) removeProduct(id);
      }
  };
  
  const handleForceStatus = (orderId: string, itemId: string, status: any) => {
      if(confirm(`Are you sure you want to FORCE update this transaction to '${status}'? This overrides partner control.`)) {
          if (updateOrderItemStatus) updateOrderItemStatus(orderId, itemId, status);
      }
  };
  
  const handleProcessWithdrawal = (txId: string) => {
      if(confirm("Confirm that you have transferred funds to the partner's bank account?")) {
          if (processWithdrawal) processWithdrawal(txId);
          alert("Withdrawal marked as completed.");
      }
  }

  const handleAddStockSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const product: Product = {
        id: Math.random().toString(36).substr(2, 9),
        name: newItem.name!,
        brand: newItem.brand!,
        category: newItem.category as Category,
        rentalPrice: Number(newItem.rentalPrice),
        retailPrice: Number(newItem.retailPrice),
        buyPrice: Number(newItem.buyPrice),
        isForSale: newItem.isForSale,
        autoSellAfterRentals: Number(newItem.autoSellAfterRentals) || undefined,
        ownerId: 'stylus-official', // Admin adds as Official
        description: newItem.description || '',
        images: newItem.images && newItem.images.length > 0 ? newItem.images : ['https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=1000&auto=format&fit=crop'],
        availableSizes: sizeInput.split(',').map(s => s.trim()).filter(s => s),
        color: newItem.color || 'Multi',
        occasion: newItem.occasion || 'General',
        reviews: [],
        rentalCount: 0
    };
    if (addProduct) addProduct(product);
    setShowAddStockModal(false);
    setNewItem({ name: '', brand: '', category: Category.WOMEN, rentalPrice: 0, retailPrice: 0, buyPrice: 0, isForSale: false, description: '', availableSizes: [], images: [], color: '', occasion: '', autoSellAfterRentals: 0 });
    setSizeInput('');
    alert("Item added to global inventory.");
  };

    // local admin-data state for demo purposes
    const [localInventory, setLocalInventory] = useState(inventoryItems);
    const [localFinancials, setLocalFinancials] = useState(financialRecords);
    const [localVerifications, setLocalVerifications] = useState(verificationRequests);
    const [localActivity, setLocalActivity] = useState(activityLogs);
    const [settings, setSettings] = useState(() => ({ ...settingsDefaults }));

    useEffect(() => {
        // keep some demo activity synced when actions occur
    }, [localInventory, localFinancials, localVerifications]);

  // Mock Data for Charts
  const categoryData = [
      { name: 'Women', value: 45, color: '#e1af4d' }, // Golden Orange
      { name: 'Men', value: 25, color: '#ebc35b' },   // Golden Light
      { name: 'Bags', value: 20, color: '#f9edd2' },   // Cream
      { name: 'Watches', value: 10, color: '#854d0e' } // Darker Gold/Brown
  ];

  const getConicGradient = () => {
      let currentDeg = 0;
      return `conic-gradient(${categoryData.map(d => {
          const deg = (d.value / 100) * 360;
          const str = `${d.color} ${currentDeg}deg ${currentDeg + deg}deg`;
          currentDeg += deg;
          return str;
      }).join(', ')})`;
  };

  if (!auth) return <div className="min-h-screen bg-espresso flex items-center justify-center text-cream">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-espresso pt-8 pb-20 animate-fade-in relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-6">
                <AdminSidebar
                    active={activeTab === 'users' ? 'users' : activeTab === 'rentals' ? 'dashboard' : activeTab}
                    onSelect={(k: string) => setActiveTab(k as any)}
                    isMobileOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    collapsed={sidebarCollapsed}
                />

                {/* Desktop collapse toggle placed close to the sidebar */}
                <div className="hidden md:flex items-start">
                    <button onClick={() => setSidebarCollapsed(s => !s)} className="p-2 bg-black/20 rounded text-cream/90 ml-[-6px]" title="Toggle sidebar">
                        <Menu size={16} />
                    </button>
                </div>

        <main className="flex-1">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-white/10 pb-6">
              <div>
                  <h1 className="font-serif text-4xl text-cream mt-2">Executive Dashboard</h1>
                  <p className="text-golden-orange text-xs uppercase tracking-widest mt-1">Admin Control Panel</p>
              </div>
                            <div className="flex gap-2 flex-wrap mt-4 md:mt-0 items-center">
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setSidebarOpen(s => !s)} className="p-2 bg-black/20 rounded text-cream/90" title="Toggle menu"><Menu size={16} /></button>
                                </div>
                                {/* Controls moved to sidebar per request - header left intentionally minimal */}
                            </div>
          </div>

                    {/* Mobile tab nav (visible on small screens) */}
                    <div className="md:hidden mb-4">
                        <div className="overflow-x-auto">
                            <div className="flex gap-2 px-1">
                                {[
                                    { key: 'analytics', label: 'Overview' },
                                    { key: 'users', label: 'Users' },
                                    { key: 'global_activity', label: 'Activity' },
                                    { key: 'inventory', label: 'Inventory' },
                                    { key: 'verifications', label: 'Verify' },
                                    { key: 'financials', label: 'Financials' },
                                    { key: 'settings', label: 'Settings' }
                                ].map(tab => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key as any)}
                                        className={`whitespace-nowrap px-3 py-2 rounded text-xs ${activeTab === tab.key ? 'bg-golden-orange text-espresso font-bold' : 'bg-black/20 text-cream/80 hover:bg-white/5'}`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

          {/* ESV / EXPORT DATA SECTION */}
          <div className="mb-8 p-6 bg-white/5 border border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                  <h3 className="text-cream font-bold mb-1 flex items-center gap-2"><Download size={16}/> Data Export (ESV)</h3>
                  <p className="text-xs text-cream/50">Export system data for external analysis.</p>
              </div>
              <div className="flex gap-2">
                  <button onClick={() => handleExportData('users')} className="bg-white/5 hover:bg-golden-orange hover:text-espresso border border-white/10 text-cream px-4 py-2 text-xs uppercase font-bold transition-all rounded-sm">Export Users</button>
                  <button onClick={() => handleExportData('products')} className="bg-white/5 hover:bg-golden-orange hover:text-espresso border border-white/10 text-cream px-4 py-2 text-xs uppercase font-bold transition-all rounded-sm">Export Inventory</button>
                  <button onClick={() => handleExportData('transactions')} className="bg-white/5 hover:bg-golden-orange hover:text-espresso border border-white/10 text-cream px-4 py-2 text-xs uppercase font-bold transition-all rounded-sm">Export Financials</button>
              </div>
          </div>

          {/* 1. USER MANAGEMENT TAB */}
          {activeTab === 'users' && (
              <div className="animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                  <h2 className="font-serif text-2xl text-cream">User Management</h2>
                  <div className="flex gap-2 items-center flex-wrap">
                       <div className="bg-black/20 p-1 rounded border border-white/10 flex">
                           <button onClick={() => setUserFilter('All')} className={`px-3 py-1 text-xs uppercase rounded ${userFilter === 'All' ? 'bg-golden-orange text-espresso font-bold' : 'text-cream/50'}`}>All</button>
                           <button onClick={() => setUserFilter('User')} className={`px-3 py-1 text-xs uppercase rounded ${userFilter === 'User' ? 'bg-golden-orange text-espresso font-bold' : 'text-cream/50'}`}>Users</button>
                           <button onClick={() => setUserFilter('Partner')} className={`px-3 py-1 text-xs uppercase rounded ${userFilter === 'Partner' ? 'bg-golden-orange text-espresso font-bold' : 'text-cream/50'}`}>Partners</button>
                       </div>
                  </div>
                </div>

                <AdminUsers users={filteredUsers} />
              </div>
          )}

          {activeTab === 'global_activity' && (
               <div className="space-y-4 animate-fade-in">
                   <h3 className="font-serif text-2xl text-cream mb-6">Global Rental Activity</h3>
                   {orders.length === 0 ? <p className="text-cream/50">No active orders.</p> : orders.map(order => (
                       <div key={order.id} className="bg-white/5 p-6 border border-white/10 rounded-sm">
                           <div className="flex justify-between mb-4 border-b border-white/5 pb-2">
                               <div>
                                   <span className="font-bold text-cream">Order {order.id}</span>
                                   <span className="text-xs text-cream/50 ml-2">by {order.userName}</span>
                               </div>
                               <span className="text-xs text-cream/50">{order.date}</span>
                           </div>
                           <div className="space-y-2">
                               {order.items.map(item => (
                                   <div key={item.id} className="flex justify-between items-center bg-black/20 p-3 rounded-sm">
                                       <div className="flex items-center gap-4">
                                           <img src={item.product.images[0]} className="w-10 h-10 object-cover rounded-sm" />
                                           <div>
                                               <p className="text-sm text-cream font-bold">{item.product.name}</p>
                                               <p className="text-xs text-cream/50">Owner: {item.product.ownerId}</p>
                                           </div>
                                       </div>
                                       <div className="flex items-center gap-4">
                                           <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${item.status === 'Pending Approval' ? 'bg-yellow-500/10 text-yellow-500' : item.status === 'Accepted' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                               {item.status}
                                           </span>
                                           {item.status === 'Pending Approval' && (
                                               <div className="flex gap-2">
                                                   <button onClick={() => {
                                                       if (updateOrderItemStatus) {
                                                           updateOrderItemStatus(order.id, item.id, 'Accepted');
                                                           alert("Forced accepted.");
                                                       }
                                                   }} className="p-1 hover:text-green-400 border border-white/10 rounded" title="Force Accept"><CheckCircle size={14}/></button>
                                                    
                                                   <button onClick={() => {
                                                       if(confirm("Force Decline? This will refund the user.")) {
                                                           if (updateOrderItemStatus && updateWallet) {
                                                               updateOrderItemStatus(order.id, item.id, 'Rejected');
                                                               // Admin refund trigger
                                                               updateWallet(order.userId, item.price, `Refund: Admin Declined - ${item.product.name}`, 'Credit');
                                                               alert("Forced declined & user refunded.");
                                                           }
                                                       }
                                                   }} className="p-1 hover:text-red-400 border border-white/10 rounded" title="Force Decline"><XCircle size={14}/></button>
                                               </div>
                                           )}
                                       </div>
                                   </div>
                               ))}
                           </div>
                       </div>
                   ))}
               </div>
          )}

          {/* OTHER TABS OMITTED FOR BREVITY - logic remains in original dashboard */}
                    {activeTab === 'analytics' && (
                        <div className="space-y-6 animate-fade-in">
                            {/* Metric Blocks */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
                                    <p className="text-cream/50 text-xs">Total Users</p>
                                    <p className="text-3xl font-serif text-cream font-bold">{totalUsers}</p>
                                </div>
                                <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
                                    <p className="text-cream/50 text-xs">Active Partners</p>
                                    <p className="text-3xl font-serif text-cream font-bold">{activePartners}</p>
                                </div>
                                <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
                                    <p className="text-cream/50 text-xs">Total Products</p>
                                    <p className="text-3xl font-serif text-cream font-bold">{totalProducts}</p>
                                </div>
                                <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
                                    <p className="text-cream/50 text-xs">Total Orders</p>
                                    <p className="text-3xl font-serif text-cream font-bold">{totalOrders}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="col-span-2 p-4 bg-white/5 border border-white/10 rounded-sm">
                                    <h4 className="text-cream font-bold mb-3">Monthly Revenue (Last 6 months)</h4>
                                    <div className="w-full h-56 flex items-end gap-2">
                                        <svg viewBox={`0 0 ${monthlyRevenue.length * 40} 120`} className="w-full h-full">
                                            {(() => {
                                                const max = Math.max(...monthlyRevenue, 1);
                                                return monthlyRevenue.map((val, idx) => {
                                                    const w = 24;
                                                    const x = idx * 40 + 8;
                                                    const h = Math.round((val / max) * 80) + 10;
                                                    const y = 100 - h;
                                                    return (
                                                        <g key={idx}>
                                                            <rect x={x} y={y} width={w} height={h} rx={4} fill="#e1af4d" />
                                                            <text x={x + w/2} y={115} fontSize={10} fill="#f7f3ea" textAnchor="middle">{monthLabels[idx].split(' ')[0]}</text>
                                                            <title>{monthLabels[idx]}: ₦{val.toLocaleString()}</title>
                                                        </g>
                                                    );
                                                });
                                            })()}
                                        </svg>
                                    </div>
                                    <p className="text-cream/50 text-xs mt-2">Total revenue: <span className="font-bold">₦{totalRevenue.toLocaleString()}</span></p>
                                </div>

                                <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
                                    <h4 className="text-cream font-bold mb-3">Product Categories</h4>
                                    <div className="flex items-center gap-4">
                                        <svg viewBox="0 0 120 120" className="w-36 h-36">
                                            {(() => {
                                                if (!categoryEntries || categoryEntries.length === 0) {
                                                    return (
                                                        <>
                                                            <circle cx={60} cy={60} r={50} fill="#1f0c05" />
                                                            <text x={60} y={66} fontSize={10} fill="#f7f3ea" textAnchor="middle">No data</text>
                                                        </>
                                                    );
                                                }

                                                const total = categoryEntries.reduce((s, e) => s + (Number(e[1]) || 0), 0) || 1;
                                                let start = 0;
                                                const colors = ['#e1af4d','#ebc35b','#f9edd2','#854d0e','#c49a43','#7c4a1f'];
                                                return categoryEntries.map(([k, v], i) => {
                                                    const portion = (Number(v) || 0) / total;
                                                    const end = start + portion;
                                                    const large = portion > 0.5 ? 1 : 0;
                                                    const startRad = start * Math.PI * 2 - Math.PI/2;
                                                    const endRad = end * Math.PI * 2 - Math.PI/2;
                                                    const x1 = 60 + 50 * Math.cos(startRad);
                                                    const y1 = 60 + 50 * Math.sin(startRad);
                                                    const x2 = 60 + 50 * Math.cos(endRad);
                                                    const y2 = 60 + 50 * Math.sin(endRad);
                                                    const d = `M60,60 L ${x1},${y1} A 50 50 0 ${large} 1 ${x2} ${y2} Z`;
                                                    start = end;
                                                    return <path key={k} d={d} fill={colors[i % colors.length]} stroke="#1f0c05" />;
                                                });
                                            })()}
                                        </svg>

                                        <div className="text-cream text-sm">
                                            {categoryEntries.map(([k,v],i) => (
                                                <div key={k} className="flex items-center gap-2 mb-1">
                                                    <span style={{width:12,height:12,background: ['#e1af4d','#ebc35b','#f9edd2','#854d0e','#c49a43','#7c4a1f'][i % 6]}} className="inline-block rounded-sm" />
                                                    <span className="text-cream/60">{k}</span>
                                                    <span className="ml-2 font-bold">{v}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
                                <h4 className="text-cream font-bold mb-3">Top Rented Products</h4>
                                <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="text-cream/60 text-xs">
                                                <th className="pb-2">Product</th>
                                                <th className="pb-2">Rentals</th>
                                                <th className="pb-2">Rental Price</th>
                                                <th className="pb-2">Owner</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {topRented.map(p => (
                                                <tr key={p.id} className="border-t border-white/5">
                                                    <td className="py-2 text-cream">{p.name}</td>
                                                    <td className="py-2 text-cream/60">{p.rentalCount || 0}</td>
                                                    <td className="py-2 text-cream/60">₦{(p.rentalPrice || 0).toLocaleString()}</td>
                                                    <td className="py-2 text-cream/60">{p.ownerId || 'Stylus'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Products Pending Approval Panel */}
                    {activeTab === 'inventory' && (
                        <div className="space-y-6 animate-fade-in mt-4">
                            <h3 className="font-serif text-2xl text-cream">Products Pending Approval</h3>
                            {products.filter(p => p.ownerId && p.ownerId !== 'stylus-official' && p.approval?.status !== 'Approved').length === 0 ? (
                                <p className="text-cream/50">No partner-submitted products pending approval.</p>
                            ) : (
                                products.filter(p => p.ownerId && p.ownerId !== 'stylus-official' && p.approval?.status !== 'Approved').map(p => (
                                    <div key={p.id} className="bg-white/5 p-4 border border-white/10 rounded-sm flex flex-col md:flex-row gap-4">
                                        <div className="w-full md:w-40">
                                            <img src={p.images?.[0] || '/placeholder.png'} className="w-full h-32 object-cover rounded-sm" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="text-cream font-bold">{p.name}</h4>
                                                    <div className="text-cream/60 text-xs">By: {p.ownerId} • Category: {p.category}</div>
                                                </div>
                                                <div className="text-cream/50 text-sm">Status: <span className="font-bold">{p.approval?.status || 'Pending'}</span></div>
                                            </div>

                                            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                                                <div className="p-2 bg-black/20 rounded">
                                                    <p className="text-cream/60 text-xs">Images</p>
                                                    <p className="text-cream font-bold">{p.approval?.images || 'Pending'}</p>
                                                    <div className="flex gap-2 mt-2">
                                                        <button onClick={() => {
                                                            if (!updateProduct) return;
                                                            updateProduct(p.id, { approval: { ...(p.approval || {}), images: 'Approved', status: (p.approval && p.approval.price === 'Approved' && p.approval.description === 'Approved') ? 'Approved' : 'Pending' } });
                                                        }} className="px-2 py-1 rounded bg-green-600 text-cream text-xs">Approve</button>
                                                        <button onClick={() => {
                                                            const reason = prompt('Reason for rejecting images:') || 'Rejected by admin';
                                                            if (!updateProduct) return;
                                                            updateProduct(p.id, { approval: { ...(p.approval || {}), images: 'Rejected', status: 'Rejected', notes: reason } });
                                                        }} className="px-2 py-1 rounded bg-red-600 text-cream text-xs">Reject</button>
                                                    </div>
                                                </div>

                                                <div className="p-2 bg-black/20 rounded">
                                                    <p className="text-cream/60 text-xs">Price</p>
                                                    <p className="text-cream font-bold">₦{(p.rentalPrice || 0).toLocaleString()}</p>
                                                    <div className="flex gap-2 mt-2">
                                                        <button onClick={() => {
                                                            if (!updateProduct) return;
                                                            updateProduct(p.id, { approval: { ...(p.approval || {}), price: 'Approved', status: (p.approval && p.approval.images === 'Approved' && p.approval.description === 'Approved') ? 'Approved' : 'Pending' } });
                                                        }} className="px-2 py-1 rounded bg-green-600 text-cream text-xs">Approve</button>
                                                        <button onClick={() => {
                                                            const reason = prompt('Reason for rejecting price:') || 'Price too high';
                                                            if (!updateProduct) return;
                                                            updateProduct(p.id, { approval: { ...(p.approval || {}), price: 'Rejected', status: 'Rejected', notes: reason } });
                                                        }} className="px-2 py-1 rounded bg-red-600 text-cream text-xs">Reject</button>
                                                    </div>
                                                </div>

                                                <div className="p-2 bg-black/20 rounded">
                                                    <p className="text-cream/60 text-xs">Description</p>
                                                    <p className="text-cream text-sm line-clamp-3">{p.description}</p>
                                                    <div className="flex gap-2 mt-2">
                                                        <button onClick={() => {
                                                            if (!updateProduct) return;
                                                            updateProduct(p.id, { approval: { ...(p.approval || {}), description: 'Approved', status: (p.approval && p.approval.images === 'Approved' && p.approval.price === 'Approved') ? 'Approved' : 'Pending' } });
                                                        }} className="px-2 py-1 rounded bg-green-600 text-cream text-xs">Approve</button>
                                                        <button onClick={() => {
                                                            const reason = prompt('Reason for rejecting description:') || 'Description unclear';
                                                            if (!updateProduct) return;
                                                            updateProduct(p.id, { approval: { ...(p.approval || {}), description: 'Rejected', status: 'Rejected', notes: reason } });
                                                        }} className="px-2 py-1 rounded bg-red-600 text-cream text-xs">Reject</button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-3 flex gap-2">
                                                <button onClick={() => {
                                                    if (!updateProduct) return;
                                                    updateProduct(p.id, { approval: { images: 'Approved', price: 'Approved', description: 'Approved', status: 'Approved' } });
                                                    setLocalActivity(prev => [{ id: 'a' + Date.now(), date: new Date().toISOString(), actor: 'Admin', action: `Approved product ${p.name}`, details: p.id }, ...prev]);
                                                    alert('Product fully approved and will appear in collections.');
                                                }} className="px-3 py-2 bg-golden-orange text-espresso rounded">Approve All</button>

                                                <button onClick={() => {
                                                    if (!updateProduct) return;
                                                    const reason = prompt('Reason for rejecting product entirely:') || 'Rejected by admin';
                                                    updateProduct(p.id, { approval: { images: 'Rejected', price: 'Rejected', description: 'Rejected', status: 'Rejected', notes: reason } });
                                                    setLocalActivity(prev => [{ id: 'a' + Date.now(), date: new Date().toISOString(), actor: 'Admin', action: `Rejected product ${p.name}`, details: reason }, ...prev]);
                                                }} className="px-3 py-2 bg-red-600 text-cream rounded">Reject Product</button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'rentals' && <div className="p-4 bg-white/5 border border-white/10"><p className="text-center text-cream/50">Rentals Overview (see Inventory & Activity for details)</p></div>}

                    {activeTab === 'financials' && (
                        <div className="space-y-4 animate-fade-in">
                            <h3 className="font-serif text-2xl text-cream">Financial Ledger</h3>
                            <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="text-cream/60">Showing recent transactions</div>
                                    <div className="text-cream/50">Total: <span className="font-bold">₦{localFinancials.reduce((s, r) => s + r.amount, 0).toLocaleString()}</span></div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="text-cream/60 text-xs">
                                                <th className="pb-2">Date</th>
                                                <th className="pb-2">User</th>
                                                <th className="pb-2">Type</th>
                                                <th className="pb-2">Amount</th>
                                                <th className="pb-2">Status</th>
                                                <th className="pb-2">Notes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {localFinancials.map(f => (
                                                <tr key={f.id} className="border-t border-white/5">
                                                    <td className="py-2 text-cream/60">{f.date}</td>
                                                    <td className="py-2 text-cream">{f.userName}</td>
                                                    <td className="py-2 text-cream/60">{f.type}</td>
                                                    <td className="py-2 text-cream font-bold">₦{f.amount.toLocaleString()}</td>
                                                    <td className="py-2 text-cream/60">{f.status}</td>
                                                    <td className="py-2 text-cream/50 text-xs">{f.description}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'inventory' && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="flex justify-between items-center">
                                <h3 className="font-serif text-2xl text-cream">Global Inventory</h3>
                                <button onClick={() => setShowAddStockModal(true)} className="px-3 py-2 bg-golden-orange text-espresso rounded text-sm">Add Item</button>
                            </div>
                            <div className="p-4 bg-white/5 border border-white/10 rounded-sm overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="text-cream/60 text-xs">
                                            <th className="pb-2">SKU</th>
                                            <th className="pb-2">Item</th>
                                            <th className="pb-2">Category</th>
                                            <th className="pb-2">Qty</th>
                                            <th className="pb-2">Rental</th>
                                            <th className="pb-2">Owner</th>
                                            <th className="pb-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {localInventory.map(it => (
                                            <tr key={it.id} className="border-t border-white/5">
                                                <td className="py-2 text-cream/60">{it.sku}</td>
                                                <td className="py-2 text-cream">{it.name}</td>
                                                <td className="py-2 text-cream/60">{it.category}</td>
                                                <td className="py-2 text-cream/60">{it.quantity}</td>
                                                <td className="py-2 text-cream/60">₦{it.rentalPrice.toLocaleString()}</td>
                                                <td className="py-2 text-cream/60">{it.owner}</td>
                                                <td className="py-2 text-cream/60">
                                                    <button onClick={() => {
                                                        if(confirm('Delete this inventory item?')) {
                                                            setLocalInventory(prev => prev.filter(p => p.id !== it.id));
                                                            setLocalActivity(prev => [{ id: 'a' + Date.now(), date: new Date().toISOString(), actor: 'Admin', action: `Deleted inventory ${it.name}`, details: it.id }, ...prev]);
                                                        }
                                                    }} className="text-xs px-2 py-1 rounded bg-red-600 text-cream">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'verifications' && (
                        <div className="space-y-4 animate-fade-in">
                            <h3 className="font-serif text-2xl text-cream">Verifications</h3>
                            <div className="p-4 bg-white/5 border border-white/10 rounded-sm space-y-2">
                                {localVerifications.length === 0 ? (
                                    <p className="text-cream/50">No verification requests.</p>
                                ) : localVerifications.map(v => (
                                    <div key={v.id} className="flex justify-between items-center p-3 bg-black/20 rounded-sm">
                                        <div>
                                            <div className="font-bold text-cream">{v.name} <span className="text-xs text-cream/50">· {v.submittedAt}</span></div>
                                            <div className="text-xs text-cream/50">Status: {v.status} • {v.notes}</div>
                                        </div>
                                        <div className="flex gap-2">
                                            {v.status === 'Pending' && (
                                                <>
                                                    <button onClick={() => {
                                                        if (approveVerification) approveVerification(v.userId || v.id);
                                                        setLocalVerifications(prev => prev.map(x => x.id === v.id ? { ...x, status: 'Approved' } : x));
                                                        setLocalActivity(prev => [{ id: 'a' + Date.now(), date: new Date().toISOString(), actor: 'Admin', action: `Approved verification ${v.name}` , details: v.id}, ...prev]);
                                                    }} className="px-3 py-1 rounded bg-green-600 text-cream text-xs">Approve</button>
                                                    <button onClick={() => {
                                                        const reason = prompt('Reason for rejection:') || 'Rejected by admin';
                                                        if (rejectVerification) rejectVerification(v.userId || v.id, reason);
                                                        setLocalVerifications(prev => prev.map(x => x.id === v.id ? { ...x, status: 'Rejected', notes: reason } : x));
                                                        setLocalActivity(prev => [{ id: 'a' + Date.now(), date: new Date().toISOString(), actor: 'Admin', action: `Rejected verification ${v.name}` , details: reason}, ...prev]);
                                                    }} className="px-3 py-1 rounded bg-red-600 text-cream text-xs">Reject</button>
                                                </>
                                            )}
                                            <button onClick={() => alert(JSON.stringify(v, null, 2))} className="px-3 py-1 rounded bg-white/5 text-cream text-xs">View</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'global_activity' && (
                        <div className="space-y-4 animate-fade-in">
                            <h3 className="font-serif text-2xl text-cream mb-6">Global Rental Activity</h3>
                            {orders.length === 0 ? (
                                localActivity.map(a => (
                                    <div key={a.id} className="bg-white/5 p-4 border border-white/10 rounded-sm">
                                        <div className="text-cream font-bold">{a.action}</div>
                                        <div className="text-cream/60 text-xs">{a.actor} • {new Date(a.date).toLocaleString()}</div>
                                        <div className="text-cream/50 text-xs mt-2">{a.details}</div>
                                    </div>
                                ))
                            ) : (
                                orders.map(order => (
                                    <div key={order.id} className="bg-white/5 p-4 border border-white/10 rounded-sm">{/* existing order rendering */}
                                        <div className="flex justify-between mb-4 border-b border-white/5 pb-2">
                                            <div>
                                                <span className="font-bold text-cream">Order {order.id}</span>
                                                <span className="text-xs text-cream/50 ml-2">by {order.userName}</span>
                                            </div>
                                            <span className="text-xs text-cream/50">{order.date}</span>
                                        </div>
                                        <div className="space-y-2">
                                            {order.items.map(item => (
                                                <div key={item.id} className="flex justify-between items-center bg-black/20 p-3 rounded-sm">
                                                    <div className="flex items-center gap-4">
                                                        <img src={item.product.images[0]} className="w-10 h-10 object-cover rounded-sm" />
                                                        <div>
                                                            <p className="text-sm text-cream font-bold">{item.product.name}</p>
                                                            <p className="text-xs text-cream/50">Owner: {item.product.ownerId}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${item.status === 'Pending Approval' ? 'bg-yellow-500/10 text-yellow-500' : item.status === 'Accepted' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                            {item.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="p-4 bg-white/5 border border-white/10 rounded-sm space-y-4">
                            <h3 className="font-serif text-2xl text-cream">Settings</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-cream/60 text-xs">Site Name</label>
                                    <input value={settings.siteName} onChange={e => setSettings(s => ({ ...s, siteName: e.target.value }))} className="w-full mt-1 p-2 bg-black/20 border border-white/5 rounded text-cream" />
                                </div>
                                <div>
                                    <label className="text-cream/60 text-xs">Support Email</label>
                                    <input value={settings.supportEmail} onChange={e => setSettings(s => ({ ...s, supportEmail: e.target.value }))} className="w-full mt-1 p-2 bg-black/20 border border-white/5 rounded text-cream" />
                                </div>
                                <div>
                                    <label className="text-cream/60 text-xs">Currency</label>
                                    <input value={settings.currency} onChange={e => setSettings(s => ({ ...s, currency: e.target.value }))} className="w-full mt-1 p-2 bg-black/20 border border-white/5 rounded text-cream" />
                                </div>
                                <div>
                                    <label className="text-cream/60 text-xs">Items Per Page</label>
                                    <input type="number" value={settings.itemsPerPage} onChange={e => setSettings(s => ({ ...s, itemsPerPage: Number(e.target.value) }))} className="w-full mt-1 p-2 bg-black/20 border border-white/5 rounded text-cream" />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => { alert('Settings saved (demo)'); }} className="px-4 py-2 bg-golden-orange text-espresso rounded">Save</button>
                                <button onClick={() => setSettings({ ...settingsDefaults })} className="px-4 py-2 bg-white/5 text-cream rounded">Reset</button>
                            </div>
                        </div>
                    )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

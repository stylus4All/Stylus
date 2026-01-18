import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, VerificationStatus, Transaction } from '../types';
import { authAPI, userAPI } from '../services/api';

// Extended User Interface
export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  tier: string;
  role: Role;
  status: 'Active' | 'Suspended';
  verificationStatus: VerificationStatus;
  verificationDocs?: {
    bvn?: string;
    idType?: string; // Added idType
    govIdUrl?: string; 
    state?: string;
    lga?: string;
    cacNumber?: string;
    businessName?: string;
    cacCertUrl?: string; 
  };
  walletBalance: number;
  suspensionReason?: string;
  adminNotes?: string;
  joined: string;
  lastActive: string;
  avgSpend: string;
  rentalHistoryCount: number;
  searchHistory: string[]; // Added search history
  location?: string; // Added location for delivery calc
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  currentUser: RegisteredUser | null;
  registeredUsers: RegisteredUser[];
  transactions: Transaction[];
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  registerUser: (name: string, email: string, password: string, role?: Role) => Promise<void>;
  updateUserStatus: (id: string, newStatus: 'Active' | 'Suspended', reason?: string) => void;
  updateUserRole: (id: string, newRole: Role) => void;
  updateUserNotes: (id: string, notes: string) => void;
  submitVerification: (id: string, docs: Partial<RegisteredUser['verificationDocs']>) => Promise<void>;
  approveVerification: (id: string) => void;
  rejectVerification: (id: string, reason: string) => void;
  updateWallet: (id: string, amount: number, description: string, type?: Transaction['type']) => Promise<void>;
  transferFunds: (fromId: string, toId: string, amount: number, description: string) => void;
  requestWithdrawal: (id: string, amount: number, bankDetails: string) => void;
  processWithdrawal: (transactionId: string) => void;
  deleteUser: (id: string) => void;
  addToSearchHistory: (query: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAdmin: false,
  currentUser: null,
  registeredUsers: [],
  transactions: [],
  login: async () => false,
  logout: () => {},
  registerUser: async () => {},
  updateUserStatus: () => {},
  updateUserRole: () => {},
  updateUserNotes: () => {},
  submitVerification: async () => {},
  approveVerification: () => {},
  rejectVerification: () => {},
  updateWallet: async () => {},
  transferFunds: () => {},
  requestWithdrawal: () => {},
  processWithdrawal: () => {},
  deleteUser: () => {},
  addToSearchHistory: () => {},
});

export const useAuth = () => useContext(AuthContext);

// Initial Mock Data
const MOCK_USERS_DB: RegisteredUser[] = [
  { 
    id: '1', 
    name: 'Stylus Partner', 
    email: 'partner@stylus.com', 
    phone: '+44 20 7946 0958', 
    address: '85 Albert Embankment, London', 
    tier: 'Platinum', 
    role: 'Partner', 
    status: 'Active', 
    verificationStatus: 'Verified', 
    joined: 'Nov 02, 2023', 
    lastActive: '1 day ago', 
    avgSpend: '$0', 
    rentalHistoryCount: 0, 
    walletBalance: 5200, 
    location: 'London, UK',
    searchHistory: [],
    verificationDocs: { 
        businessName: 'Luxe Attire Ltd', 
        cacNumber: 'RC-998877',
        cacCertUrl: 'https://images.unsplash.com/photo-1555601568-c9e61309063d?q=80&w=1000&auto=format&fit=crop' // Mock Cert
    } 
  },
  { 
    id: '2', 
    name: 'Stylus User', 
    email: 'user@stylus.com', 
    phone: '+1 (555) 019-2834', 
    address: '1984 Cyberdyne Ln, LA', 
    tier: 'Gold', 
    role: 'User', 
    status: 'Active', 
    verificationStatus: 'Unverified', 
    joined: 'Dec 10, 2023', 
    lastActive: '3 months ago', 
    avgSpend: '$150', 
    rentalHistoryCount: 1, 
    walletBalance: 200,
    location: 'Los Angeles, USA',
    searchHistory: ['Cocktail Dresses', 'Gucci Bags']
  },
  { 
    id: '3', 
    name: 'Ellen Ripley', 
    email: 'e.ripley@example.com', 
    phone: '+1 (555) 011-3344', 
    address: 'Nostromo Station', 
    tier: 'Diamond', 
    role: 'Admin', 
    status: 'Active', 
    verificationStatus: 'Verified', 
    joined: 'Jan 05, 2024', 
    lastActive: '5 hours ago', 
    avgSpend: '$1,200', 
    rentalHistoryCount: 8, 
    walletBalance: 0,
    location: 'New York, USA',
    searchHistory: []
  },
  { 
    id: '4', 
    name: 'Victoria Sterling', 
    email: 'v.sterling@example.com', 
    phone: '+1 (555) 010-9988', 
    address: '125 Park Ave, NYC', 
    tier: 'Diamond', 
    role: 'User', 
    status: 'Active', 
    verificationStatus: 'Verified', 
    joined: 'Oct 15, 2023', 
    lastActive: '2 mins ago', 
    avgSpend: '$450', 
    rentalHistoryCount: 12, 
    walletBalance: 1500,
    location: 'New York, USA',
    searchHistory: ['Gala Gowns', 'Velvet', 'Chanel'],
    verificationDocs: {
        bvn: '22299911188',
        idType: 'NIN',
        state: 'New York',
        lga: 'Manhattan',
        govIdUrl: 'https://images.unsplash.com/photo-1633265486064-084b2195299b?q=80&w=1000&auto=format&fit=crop'
    }
  },
];

// Mock Transactions
const MOCK_TRANSACTIONS: Transaction[] = [
    { id: 'tx-1', userId: '1', userName: 'Stylus Partner', type: 'Fee', amount: 20000, description: 'Partnership Verification Fee', date: 'Nov 02, 2023', status: 'Completed', paymentMethod: 'Card ending 4242' },
    { id: 'tx-2', userId: '1', userName: 'Stylus Partner', type: 'Credit', amount: 5000, description: 'Rental Earnings: Order #ORD-8821', date: 'Jan 10, 2024', status: 'Completed', paymentMethod: 'Wallet' },
    { id: 'tx-3', userId: '4', userName: 'Victoria Sterling', type: 'Credit', amount: 1500, description: 'Wallet Deposit', date: 'Feb 15, 2024', status: 'Completed', paymentMethod: 'Card ending 8811' },
];

// Helper function to map backend user to frontend RegisteredUser format
const mapBackendUserToRegisteredUser = (backendUser: any): RegisteredUser => {
  const verificationDocs = typeof backendUser.verificationDocs === 'string' 
    ? JSON.parse(backendUser.verificationDocs || '{}')
    : backendUser.verificationDocs || {};
  
  const searchHistory = typeof backendUser.searchHistory === 'string'
    ? JSON.parse(backendUser.searchHistory || '[]')
    : backendUser.searchHistory || [];
  
  return {
    id: backendUser.id.toString(),
    name: backendUser.name,
    email: backendUser.email,
    phone: backendUser.phone || '',
    address: backendUser.address || '',
    tier: backendUser.tier || 'Gold',
    role: backendUser.role,
    status: backendUser.status,
    verificationStatus: backendUser.verificationStatus,
    verificationDocs,
    walletBalance: backendUser.walletBalance || 0,
    suspensionReason: backendUser.suspensionReason,
    adminNotes: backendUser.adminNotes,
    joined: new Date(backendUser.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    lastActive: backendUser.lastActive ? new Date(backendUser.lastActive).toLocaleDateString() : 'Just now',
    avgSpend: '$0', // TODO: Calculate from orders
    rentalHistoryCount: 0, // TODO: Count from orders
    searchHistory,
    location: backendUser.location || 'New York, USA',
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load data on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem('stylus_users_db');
    if (storedUsers) {
      setRegisteredUsers(JSON.parse(storedUsers));
    } else {
      setRegisteredUsers(MOCK_USERS_DB);
    }
    
    const storedTx = localStorage.getItem('stylus_transactions');
    if (storedTx) {
        setTransactions(JSON.parse(storedTx));
    } else {
        setTransactions(MOCK_TRANSACTIONS);
    }

    // Check session
    const storedAuth = localStorage.getItem('stylus_auth');
    const storedUserId = localStorage.getItem('stylus_user_id');
    if (storedAuth === 'true' && storedUserId) {
      const users = storedUsers ? JSON.parse(storedUsers) : MOCK_USERS_DB;
      const user = users.find((u: RegisteredUser) => u.id === storedUserId);
      if (user) {
        setIsAuthenticated(true);
        setCurrentUser(user);
        setIsAdmin(user.role === 'Admin');
      }
    }
  }, []);

  // CROSS-TAB SYNC: Listen for storage changes to update state in other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'stylus_users_db') {
            const newUsers = e.newValue ? JSON.parse(e.newValue) : [];
            setRegisteredUsers(newUsers);
            
            // If the currently logged in user was updated, reflect changes immediately
            if (currentUser) {
                const updatedMe = newUsers.find((u: RegisteredUser) => u.id === currentUser.id);
                if (updatedMe) {
                    setCurrentUser(updatedMe);
                    // Also update admin status if role changed
                    setIsAdmin(updatedMe.role === 'Admin');
                }
            }
        }
        if (e.key === 'stylus_transactions') {
            const newTx = e.newValue ? JSON.parse(e.newValue) : [];
            setTransactions(newTx);
        }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentUser]);

  // Save DB changes
  useEffect(() => {
    if (registeredUsers.length > 0) {
      localStorage.setItem('stylus_users_db', JSON.stringify(registeredUsers));
    }
  }, [registeredUsers]);

  useEffect(() => {
      localStorage.setItem('stylus_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const login = async (emailOrName: string, password?: string) => {
    // 1. Check for SPECIAL Credentials logic as requested (demo mode)
    if (emailOrName === 'Stylus') {
      if (password === 'Sty!usAdm1n#29XQ') {
        const adminUser = registeredUsers.find(u => u.role === 'Admin') || MOCK_USERS_DB[2];
        return performLogin(adminUser);
      } else if (password === 'StylusUser#4829') {
        const defaultUser = registeredUsers.find(u => u.email === 'user@stylus.com') || MOCK_USERS_DB[1];
        return performLogin(defaultUser);
      } else if (password === 'StylusPartner@9931') {
        const defaultPartner = registeredUsers.find(u => u.email === 'partner@stylus.com') || MOCK_USERS_DB[0];
        return performLogin(defaultPartner);
      } else {
        return false;
      }
    }

    // Call backend API for real authentication
    if (!password) return false;
    
    try {
      const response = await authAPI.login({ email: emailOrName, password });
      const { user, token } = response;
      
      // Store token
      localStorage.setItem('authToken', token);
      localStorage.setItem('stylus_auth', 'true');
      localStorage.setItem('stylus_user_id', user.id.toString());
      
      // Convert backend user to RegisteredUser format
      const mappedUser = mapBackendUserToRegisteredUser(user);
      setIsAuthenticated(true);
      setCurrentUser(mappedUser);
      setIsAdmin(user.role === 'Admin');
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const performLogin = (user: RegisteredUser) => {
    localStorage.setItem('stylus_auth', 'true');
    localStorage.setItem('stylus_user_id', user.id);
    setIsAuthenticated(true);
    setCurrentUser(user);
    setIsAdmin(user.role === 'Admin');
    return true;
  };

  const registerUser = async (name: string, email: string, password: string, role: Role = 'User') => {
    try {
      const response = await authAPI.register({ name, email, password, role });
      const { user, token } = response;
      
      // Store token
      localStorage.setItem('authToken', token);
      localStorage.setItem('stylus_auth', 'true');
      localStorage.setItem('stylus_user_id', user.id.toString());
      
      // Convert backend user to RegisteredUser format
      const mappedUser = mapBackendUserToRegisteredUser(user);
      setIsAuthenticated(true);
      setCurrentUser(mappedUser);
      setIsAdmin(user.role === 'Admin');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const updateUserStatus = (id: string, newStatus: 'Active' | 'Suspended', reason?: string) => {
    const updatedUsers = registeredUsers.map(u => {
      if (u.id === id) {
        return { ...u, status: newStatus, suspensionReason: reason };
      }
      return u;
    });
    setRegisteredUsers(updatedUsers);
    if (currentUser?.id === id) setCurrentUser(updatedUsers.find(u => u.id === id) || null);
  };

  const updateUserRole = (id: string, newRole: Role) => {
    const updatedUsers = registeredUsers.map(u => u.id === id ? { ...u, role: newRole } : u);
    setRegisteredUsers(updatedUsers);
    if (currentUser?.id === id) setCurrentUser(updatedUsers.find(u => u.id === id) || null);
  }

  const updateUserNotes = (id: string, notes: string) => {
    setRegisteredUsers(prev => prev.map(u => u.id === id ? { ...u, adminNotes: notes } : u));
  };

  const submitVerification = async (id: string, docs: Partial<RegisteredUser['verificationDocs']>) => {
    try {
      // Call backend API
      const response = await userAPI.submitVerification(parseInt(id), docs);
      const updatedUser = mapBackendUserToRegisteredUser(response);
      
      // Update local state
      const updatedUsers = registeredUsers.map(u => 
         u.id === id ? updatedUser : u
      );
      setRegisteredUsers(updatedUsers);
      
      // Update current user if it's the same
      if (currentUser?.id === id) setCurrentUser(updatedUser);
      
      // If it's a partner, log the registration fee transaction (simulate for demo)
      if (updatedUser.role === 'Partner') {
          const feeTx: Transaction = {
              id: `tx-fee-${Date.now()}`,
              userId: id,
              userName: updatedUser.name,
              type: 'Fee',
              amount: 20000,
              description: 'One-Time Partnership Verification Fee',
              date: new Date().toLocaleDateString(),
              status: 'Completed',
              paymentMethod: 'Card ending ****'
          };
          setTransactions(prev => [feeTx, ...prev]);
      }
    } catch (error) {
      console.error('Verification submission failed:', error);
      throw error;
    }
  };

  const approveVerification = (id: string) => {
    const updatedUsers = registeredUsers.map(u => u.id === id ? { ...u, verificationStatus: 'Verified' as VerificationStatus } : u);
    setRegisteredUsers(updatedUsers);
    // Explicitly update current user if it matches, to trigger immediate UI refresh in single-page context
    if (currentUser?.id === id) setCurrentUser(updatedUsers.find(u => u.id === id) || null);
  };

  const rejectVerification = (id: string, reason: string) => {
    const updatedUsers = registeredUsers.map(u => u.id === id ? { ...u, verificationStatus: 'Rejected' as VerificationStatus, adminNotes: reason } : u);
    setRegisteredUsers(updatedUsers);
    if (currentUser?.id === id) setCurrentUser(updatedUsers.find(u => u.id === id) || null);
  };

  const updateWallet = async (id: string, amount: number, description: string, type: Transaction['type'] = amount > 0 ? 'Credit' : 'Debit') => {
    try {
      // Call backend API
      const response = await userAPI.updateWallet(parseInt(id), amount);
      const updatedUser = mapBackendUserToRegisteredUser(response);
      
      // Update local state
      const updatedUsers = registeredUsers.map(u => u.id === id ? updatedUser : u);
      setRegisteredUsers(updatedUsers);
      
      // Create transaction record (could be moved to backend)
      const newTx: Transaction = {
          id: `tx-${Date.now()}`,
          userId: id,
          userName: updatedUser.name,
          type: type,
          amount: Math.abs(amount),
          description: description,
          date: new Date().toLocaleDateString(),
          status: 'Completed',
          paymentMethod: 'Wallet'
      };
      setTransactions(prev => [newTx, ...prev]);

      if (currentUser?.id === id) setCurrentUser(updatedUser);
    } catch (error) {
      console.error('Wallet update failed:', error);
      throw error;
    }
  };
  
  const transferFunds = (fromId: string, toId: string, amount: number, description: string) => {
      // Deduct from Sender
      updateWallet(fromId, -amount, `Payment Out: ${description}`, 'Debit');
      // Credit to Receiver
      updateWallet(toId, amount, `Payment In: ${description}`, 'Credit');
  };

  const requestWithdrawal = (id: string, amount: number, bankDetails: string) => {
      // 1. Deduct from wallet balance immediately (Escrow)
      const updatedUsers = registeredUsers.map(u => u.id === id ? { ...u, walletBalance: u.walletBalance - amount } : u);
      setRegisteredUsers(updatedUsers);
      
      const user = registeredUsers.find(u => u.id === id);
      
      // 2. Create Pending Transaction
      const withdrawalTx: Transaction = {
          id: `tx-wd-${Date.now()}`,
          userId: id,
          userName: user?.name || 'Unknown',
          type: 'Withdrawal',
          amount: amount,
          description: `Withdrawal to ${bankDetails}`,
          date: new Date().toLocaleDateString(),
          status: 'Pending',
          paymentMethod: 'Bank Transfer'
      };
      setTransactions(prev => [withdrawalTx, ...prev]);
      
      if (currentUser?.id === id) setCurrentUser(updatedUsers.find(u => u.id === id) || null);
  };

  const processWithdrawal = (transactionId: string) => {
      setTransactions(prev => prev.map(t => 
          t.id === transactionId ? { ...t, status: 'Completed' } : t
      ));
  };

  const deleteUser = (id: string) => {
    setRegisteredUsers(prev => prev.filter(u => u.id !== id));
    if (currentUser?.id === id) logout();
  };
  
  const addToSearchHistory = (query: string) => {
      if (!currentUser) return;
      const history = currentUser.searchHistory || [];
      const newHistory = [query, ...history].slice(0, 5); // Keep last 5
      
      const updatedUsers = registeredUsers.map(u => u.id === currentUser.id ? { ...u, searchHistory: newHistory } : u);
      setRegisteredUsers(updatedUsers);
      setCurrentUser({ ...currentUser, searchHistory: newHistory });
  };

  const logout = () => {
    localStorage.removeItem('stylus_auth');
    localStorage.removeItem('stylus_user_id');
    setIsAuthenticated(false);
    setIsAdmin(false);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isAdmin, 
      currentUser, 
      registeredUsers,
      transactions,
      login, 
      logout, 
      registerUser,
      updateUserStatus,
      updateUserRole,
      updateUserNotes,
      submitVerification,
      approveVerification,
      rejectVerification,
      updateWallet,
      transferFunds,
      requestWithdrawal,
      processWithdrawal,
      deleteUser,
      addToSearchHistory
    }}>
      {children}
    </AuthContext.Provider>
  );
};
// Dummy admin data for development and previews
export type InventoryItem = {
  id: string;
  name: string;
  sku?: string;
  quantity: number;
  rentalPrice: number;
  buyPrice?: number;
  owner?: string;
  category?: string;
};

export type FinancialRecord = {
  id: string;
  date: string;
  userName: string;
  type: 'Deposit' | 'Withdrawal' | 'Rental' | 'Sale' | 'Refund';
  amount: number;
  status: 'Pending' | 'Completed' | 'Failed';
  description?: string;
};

export type VerificationRequest = {
  id: string;
  userId?: string;
  name: string;
  submittedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  notes?: string;
};

export type ActivityLog = {
  id: string;
  date: string;
  actor: string;
  action: string;
  details?: string;
};

export const inventoryItems: InventoryItem[] = [
  { id: 'inv_1', name: 'Amber Silk Dress', sku: 'ASD-001', quantity: 6, rentalPrice: 4500, buyPrice: 32000, owner: 'Stylus', category: 'Women' },
  { id: 'inv_2', name: 'Midnight Suit', sku: 'MS-011', quantity: 3, rentalPrice: 6500, buyPrice: 85000, owner: 'Partner A', category: 'Men' },
  { id: 'inv_3', name: 'Classic Handbag', sku: 'HB-210', quantity: 12, rentalPrice: 2500, buyPrice: 42000, owner: 'Partner B', category: 'Bags' },
  { id: 'inv_4', name: 'Gold Chrono Watch', sku: 'WC-77', quantity: 2, rentalPrice: 9000, buyPrice: 150000, owner: 'Stylus', category: 'Watches' }
];

export const financialRecords: FinancialRecord[] = [
  { id: 'tx_1001', date: '2026-02-10', userName: 'Ada Onwudi', type: 'Rental', amount: 4500, status: 'Completed', description: 'Rental payment for order OR-1001' },
  { id: 'tx_1002', date: '2026-02-11', userName: 'Bayo Falobi', type: 'Deposit', amount: 20000, status: 'Completed', description: 'Wallet top-up' },
  { id: 'tx_1003', date: '2026-02-12', userName: 'Partner A', type: 'Withdrawal', amount: 120000, status: 'Pending', description: 'Payout request #WD-321' },
  { id: 'tx_1004', date: '2026-02-14', userName: 'Chinwe', type: 'Sale', amount: 42000, status: 'Completed', description: 'Buy transaction for product HB-210' }
];

export const verificationRequests: VerificationRequest[] = [
  { id: 'v_1', userId: 'u_22', name: 'Fola Ade', submittedAt: '2026-02-12', status: 'Pending', notes: 'Government ID + Selfie' },
  { id: 'v_2', userId: 'u_45', name: 'Ngozi', submittedAt: '2026-02-08', status: 'Approved', notes: 'Business documents verified' },
  { id: 'v_3', userId: 'u_78', name: 'Kelechi', submittedAt: '2026-02-15', status: 'Pending', notes: 'Missing proof of address' }
];

export const activityLogs: ActivityLog[] = [
  { id: 'a1', date: '2026-02-15T09:12:00', actor: 'System', action: 'Daily cron executed', details: 'Cleaned temp files and pruned expired sessions' },
  { id: 'a2', date: '2026-02-15T11:03:00', actor: 'Admin: Chidi', action: 'Forced refund', details: 'Refunded ₦4,500 to user u_19 for OR-1001' },
  { id: 'a3', date: '2026-02-16T14:22:00', actor: 'Partner A', action: 'Requested withdrawal', details: 'WD-321 for ₦120,000' },
  { id: 'a4', date: '2026-02-16T15:40:00', actor: 'System', action: 'Backup created', details: 'DB backup saved: backup-2026-02-16.sql' }
];

export const settingsDefaults = {
  siteName: 'Stylus Admin',
  currency: 'NGN',
  itemsPerPage: 20,
  allowGuestCheckout: false,
  supportEmail: 'support@stylus.example'
};

export default {};

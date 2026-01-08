const API_BASE_URL = 'http://localhost:4000';

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `API error: ${response.status}`);
  }

  return response.json();
}

// User APIs
export const userAPI = {
  getAll: () => apiCall('/users'),
  getById: (id: number) => apiCall(`/users/${id}`),
  create: (data: any) => apiCall('/users', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  updateStatus: (id: number, status: string, reason?: string) =>
    apiCall(`/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, reason }) }),
  updateRole: (id: number, role: string) =>
    apiCall(`/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
  submitVerification: (id: number, docs: any) =>
    apiCall(`/users/${id}/verify`, { method: 'POST', body: JSON.stringify(docs) }),
  approveVerification: (id: number) =>
    apiCall(`/users/${id}/approve-verification`, { method: 'POST' }),
  rejectVerification: (id: number, reason: string) =>
    apiCall(`/users/${id}/reject-verification`, { method: 'POST', body: JSON.stringify({ reason }) }),
  updateWallet: (id: number, amount: number) =>
    apiCall(`/users/${id}/wallet`, { method: 'PATCH', body: JSON.stringify({ amount }) }),
  delete: (id: number) => apiCall(`/users/${id}`, { method: 'DELETE' }),
};

// Product APIs
export const productAPI = {
  getAll: (filters?: any) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.searchQuery) params.append('searchQuery', filters.searchQuery);
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    return apiCall(`/products${params.toString() ? '?' + params : ''}`);
  },
  getById: (id: string) => apiCall(`/products/${id}`),
  create: (data: any) => apiCall('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiCall(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  incrementRental: (id: string) => apiCall(`/products/${id}/increment-rental`, { method: 'PATCH' }),
  delete: (id: string) => apiCall(`/products/${id}`, { method: 'DELETE' }),
  getByOwner: (ownerId: number) => apiCall(`/products/owner/${ownerId}`),
};

// Order APIs
export const orderAPI = {
  getAll: () => apiCall('/orders'),
  getById: (id: string) => apiCall(`/orders/${id}`),
  getByUserId: (userId: number) => apiCall(`/orders/user/${userId}`),
  create: (data: any) => apiCall('/orders', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id: string, status: string) =>
    apiCall(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  updateItemStatus: (orderId: string, itemId: string, status: string) =>
    apiCall(`/orders/${orderId}/item/${itemId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  delete: (id: string) => apiCall(`/orders/${id}`, { method: 'DELETE' }),
};

// Cart APIs
export const cartAPI = {
  getCart: (userId: number) => apiCall(`/cart/${userId}`),
  addItem: (userId: number, data: any) => apiCall(`/cart/${userId}/add`, { method: 'POST', body: JSON.stringify(data) }),
  updateItem: (userId: number, cartItemId: string, data: any) =>
    apiCall(`/cart/${userId}/item/${cartItemId}`, { method: 'PATCH', body: JSON.stringify(data) }),
  removeItem: (userId: number, productId: string) =>
    apiCall(`/cart/${userId}/remove/${productId}`, { method: 'DELETE' }),
  clearCart: (userId: number) => apiCall(`/cart/${userId}/clear`, { method: 'DELETE' }),
};

// Wishlist APIs
export const wishlistAPI = {
  getWishlist: (userId: number) => apiCall(`/wishlist/${userId}`),
  addItem: (userId: number, productId: string) =>
    apiCall(`/wishlist/${userId}/add`, { method: 'POST', body: JSON.stringify({ productId }) }),
  removeItem: (userId: number, productId: string) =>
    apiCall(`/wishlist/${userId}/remove/${productId}`, { method: 'DELETE' }),
  isInWishlist: (userId: number, productId: string) =>
    apiCall(`/wishlist/${userId}/contains/${productId}`),
};

// Review APIs
export const reviewAPI = {
  getProductReviews: (productId: string) => apiCall(`/reviews/product/${productId}`),
  create: (data: any) => apiCall('/reviews', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiCall(`/reviews/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) => apiCall(`/reviews/${id}`, { method: 'DELETE' }),
};

// Transaction APIs
export const transactionAPI = {
  getAll: () => apiCall('/transactions'),
  getByUserId: (userId: number) => apiCall(`/transactions/user/${userId}`),
  create: (data: any) => apiCall('/transactions', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id: string, status: string) =>
    apiCall(`/transactions/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  requestWithdrawal: (data: any) =>
    apiCall('/transactions/withdrawal/request', { method: 'POST', body: JSON.stringify(data) }),
  processWithdrawal: (id: string) =>
    apiCall(`/transactions/${id}/withdrawal/process`, { method: 'POST' }),
  transfer: (data: any) => apiCall('/transactions/transfer', { method: 'POST', body: JSON.stringify(data) }),
};

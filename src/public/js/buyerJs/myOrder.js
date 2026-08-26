/* =========================================================
   BIHARI KISAN — My Orders
   Frontend logic — fetches live orders from the backend
   (GET /api/orders/view — see CONFIG below)
   ========================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     ICONS — inlined Lucide SVG paths (no external CDN/script
     dependency, so icons always render immediately and never
     depend on network timing or a page refresh).
  --------------------------------------------------------- */
  const ICONS = {
    'badge-check': `<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" /> <path d="m9 12 2 2 4-4" />`,
    'bell': `<path d="M10.268 21a2 2 0 0 0 3.464 0" /> <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />`,
    'calendar-clock': `<path d="M16 14v2.2l1.6 1" /> <path d="M16 2v3" /> <path d="M21 7.338V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h2.338" /> <path d="M3 9h5.859" /> <path d="M8 2v3" /> <circle cx="16" cy="16" r="6" />`,
    'check-circle-2': `<circle cx="12" cy="12" r="10" /> <path d="m9 12 2 2 4-4" />`,
    'check': `<path d="M20 6 9 17l-5-5" />`,
    'chevron-down': `<path d="m6 9 6 6 6-6" />`,
    'circle-check-big': `<path d="M21.801 10A10 10 0 1 1 17 3.335" /> <path d="m9 11 3 3L22 4" />`,
    'circle-dot': `<circle cx="12" cy="12" r="10" /> <circle cx="12" cy="12" r="1" />`,
    'circle-help': `<circle cx="12" cy="12" r="10" /> <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /> <path d="M12 17h.01" />`,
    'circle-x': `<circle cx="12" cy="12" r="10" /> <path d="m15 9-6 6" /> <path d="m9 9 6 6" />`,
    'circle': `<circle cx="12" cy="12" r="10" />`,
    'clipboard-list': `<rect width="8" height="4" x="8" y="2" rx="1" ry="1" /> <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /> <path d="M12 11h4" /> <path d="M12 16h4" /> <path d="M8 11h.01" /> <path d="M8 16h.01" />`,
    'file-text': `<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" /> <path d="M14 2v5a1 1 0 0 0 1 1h5" /> <path d="M10 9H8" /> <path d="M16 13H8" /> <path d="M16 17H8" />`,
    'flame': `<path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4" />`,
    'flower': `<circle cx="12" cy="12" r="3" /> <path d="M12 16.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 1 1 4.5 4.5 4.5 4.5 0 1 1-4.5 4.5" /> <path d="M12 7.5V9" /> <path d="M7.5 12H9" /> <path d="M16.5 12H15" /> <path d="M12 16.5V15" /> <path d="m8 8 1.88 1.88" /> <path d="M14.12 9.88 16 8" /> <path d="m8 16 1.88-1.88" /> <path d="M14.12 14.12 16 16" />`,
    'hand-heart': `<path d="M11 14h2a2 2 0 0 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16" /> <path d="m14.45 13.39 5.05-4.694C20.196 8 21 6.85 21 5.75a2.75 2.75 0 0 0-4.797-1.837.276.276 0 0 1-.406 0A2.75 2.75 0 0 0 11 5.75c0 1.2.802 2.248 1.5 2.946L16 11.95" /> <path d="m2 15 6 6" /> <path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a1 1 0 0 0-2.75-2.91" />`,
    'info': `<circle cx="12" cy="12" r="10" /> <path d="M12 16v-4" /> <path d="M12 8h.01" />`,
    'layout-grid': `<rect width="7" height="7" x="3" y="3" rx="1" /> <rect width="7" height="7" x="14" y="3" rx="1" /> <rect width="7" height="7" x="14" y="14" rx="1" /> <rect width="7" height="7" x="3" y="14" rx="1" />`,
    'leaf': `<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /> <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />`,
    'loader': `<path d="M12 2v4" /> <path d="m16.2 7.8 2.9-2.9" /> <path d="M18 12h4" /> <path d="m16.2 16.2 2.9 2.9" /> <path d="M12 18v4" /> <path d="m4.9 19.1 2.9-2.9" /> <path d="M2 12h4" /> <path d="m4.9 4.9 2.9 2.9" />`,
    'log-out': `<path d="m16 17 5-5-5-5" /> <path d="M21 12H9" /> <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />`,
    'map-pin': `<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /> <circle cx="12" cy="10" r="3" />`,
    'menu': `<path d="M4 5h16" /> <path d="M4 12h16" /> <path d="M4 19h16" />`,
    'package-check': `<path d="M12 22V12" /> <path d="m16 17 2 2 4-4" /> <path d="M21 11.127V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.729l7 4a2 2 0 0 0 2 .001l1.32-.753" /> <path d="M3.29 7 12 12l8.71-5" /> <path d="m7.5 4.27 8.997 5.148" />`,
    'package-search': `<path d="M12 22V12" /> <path d="M20.27 18.27 22 20" /> <path d="M21 10.498V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.729l7 4a2 2 0 0 0 2 .001l.98-.559" /> <path d="M3.29 7 12 12l8.71-5" /> <path d="m7.5 4.27 8.997 5.148" /> <circle cx="18.5" cy="16.5" r="2.5" />`,
    'rotate-cw': `<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /> <path d="M21 3v5h-5" />`,
    'search': `<path d="m21 21-4.34-4.34" /> <circle cx="11" cy="11" r="8" />`,
    'settings': `<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" /> <circle cx="12" cy="12" r="3" />`,
    'shopping-basket': `<path d="m15 11-1 9" /> <path d="m19 11-4-7" /> <path d="M2 11h20" /> <path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4" /> <path d="M4.5 15.5h15" /> <path d="m5 11 4-7" /> <path d="m9 11 1 9" />`,
    'sprout': `<path d="M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3" /> <path d="M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4" /> <path d="M5 21h14" />`,
    'store': `<path d="M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5" /> <path d="M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244" /> <path d="M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05" />`,
    'truck': `<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /> <path d="M15 18H9" /> <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /> <circle cx="17" cy="18" r="2" /> <circle cx="7" cy="18" r="2" />`,
    'user-round': `<circle cx="12" cy="8" r="5" /> <path d="M20 21a8 8 0 0 0-16 0" />`,
    'users': `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /> <path d="M16 3.128a4 4 0 0 1 0 7.744" /> <path d="M22 21v-2a4 4 0 0 0-3-3.87" /> <circle cx="9" cy="7" r="4" />`,
    'wallet': `<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" /> <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />`,
    'wheat': `<path d="M2 22 16 8" /> <path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" /> <path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" /> <path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" /> <path d="M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z" /> <path d="M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" /> <path d="M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" /> <path d="M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" />`,
    'wifi-off': `<path d="M12 20h.01" /> <path d="M8.5 16.429a5 5 0 0 1 7 0" /> <path d="M5 12.859a10 10 0 0 1 5.17-2.69" /> <path d="M19 12.859a10 10 0 0 0-2.007-1.523" /> <path d="M2 8.82a15 15 0 0 1 4.177-2.643" /> <path d="M22 8.82a15 15 0 0 0-11.288-3.764" /> <path d="m2 2 20 20" />`,
    'x-circle': `<circle cx="12" cy="12" r="10" /> <path d="m15 9-6 6" /> <path d="m9 9 6 6" />`,
    'x': `<path d="M18 6 6 18" /> <path d="m6 6 12 12" />`,
  };
  function icon(name, cls) {
    const paths = ICONS[name] || '';
    return `<svg class="lucide-ico${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  }

  /* ---------------------------------------------------------
     CONFIG — update to match your actual mounted route
  --------------------------------------------------------- */
const CONFIG = {
  API_BASE_URL: 'https://biharikisan.onrender.com',
  ORDERS_ENDPOINT: '/biharikisan/buyer/view-Orders',
  LOGIN_URL: '/'
};

  /* ---------------------------------------------------------
     FALLBACK / DEV MOCK DATA
     Used only if USE_MOCK_DATA is set to true below — handy for
     building the UI before the backend is reachable. Leave false
     to always hit the live API.
  --------------------------------------------------------- */
  const USE_MOCK_DATA = false;

  const MOCK_ORDERS = [
    
  ];

  // Live orders, populated by fetchOrders(). Empty until the API responds.
  let ORDERS = [];

  /* ---------------------------------------------------------
     NORMALIZE — maps raw backend order documents to the shape
     this UI expects. Your orderModel.find() result field names
     may differ from these guesses (e.g. "amount" vs "totalAmount",
     or a nested "products" array instead of flat fields).
     Adjust the right-hand side of each line to match your real
     Order mongoose schema once you can confirm it.
  --------------------------------------------------------- */
  // Backend enum values → UI labels
  const ORDER_STATUS_MAP = {
    pending: 'Confirmed',
    confirmed: 'Confirmed',
    processing: 'Preparing',
    shipped: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  };

  const PAYMENT_STATUS_MAP = {
    pending: 'Pending',
    paid: 'Successful',
    failed: 'Failed',
    refunded: 'Refunded'
  };

  const PAYMENT_METHOD_MAP = {
    cod: 'Cash on Delivery',
    upi: 'UPI',
    card: 'Card',
    netbanking: 'Net Banking'
  };

  function normalizeOrder(raw) {
    const product = raw.productId || {};
    const seller = raw.sellerId || {};

    return {
      id: raw._id || raw.orderId || raw.id || '',
      productName: product.productDesc || raw.productName || 'Product',
      quantity: raw.quantity || 1,
      unit: raw.unit || 'KG',
      pricePerUnit: raw.priceAtOrder || product.productPrice || 0,
      farmerName: seller.sellerName || seller.fullName || raw.farmerName || 'Farmer',
      farmerLocation: seller.address
        ? `${seller.address.village || ''}, ${seller.address.state || ''}`
        : (raw.farmerLocation || ''),
      verified: raw.verified ?? false,
      totalAmount: raw.totalAmount || 0,
      orderDate: raw.orderDate || raw.createdAt || new Date().toISOString(),
      status: ORDER_STATUS_MAP[raw.orderStatus] || raw.status || 'Confirmed',
      paymentMethod: PAYMENT_METHOD_MAP[raw.paymentMethod] || raw.paymentMethod || 'UPI',
      paymentStatus: PAYMENT_STATUS_MAP[raw.paymentStatus] || raw.paymentStatus || 'Pending',
      expectedDelivery: raw.expectedDelivery || '',
      deliveredOn: raw.deliveredOn || raw.deliveredAt || null
    };
  }

  const PRODUCT_ICONS = {
    'Desi Aloo': 'circle', 'Fresh Tomato': 'circle-dot', 'Green Chilli': 'flame',
    'Basmati Rice': 'wheat', 'Seasonal Onion': 'circle', 'Fresh Cauliflower': 'flower',
    'Organic Wheat': 'wheat', 'Mustard Seeds': 'sprout'
  };

  const TRACK_STEPS = ['Confirmed', 'Preparing', 'Picked Up', 'Out for Delivery', 'Delivered'];
  const STATUS_TO_STEP_INDEX = {
    'Confirmed': 0, 'Preparing': 1, 'Out for Delivery': 3, 'Delivered': 4
  };

  const STATUS_BADGE_CLASS = {
    'Confirmed': 'bk-status-badge--confirmed',
    'Preparing': 'bk-status-badge--preparing',
    'Out for Delivery': 'bk-status-badge--transit',
    'Delivered': 'bk-status-badge--delivered',
    'Cancelled': 'bk-status-badge--cancelled'
  };

  /* ---------------------------------------------------------
     STATE
  --------------------------------------------------------- */
  let state = {
    statFilter: 'All',
    statusFilter: 'All',
    dateFilter: 'All',
    sort: 'newest',
    search: '',
    visibleCount: 6
  };

  const PAGE_SIZE = 6;

  /* ---------------------------------------------------------
     DOM REFS
  --------------------------------------------------------- */
  const els = {
    ordersList: document.getElementById('ordersList'),
    emptyState: document.getElementById('emptyState'),
    emptyStateIcon: document.getElementById('emptyStateIcon'),
    emptyStateHeading: document.getElementById('emptyStateHeading'),
    emptyStateMessage: document.getElementById('emptyStateMessage'),
    loadingState: document.getElementById('loadingState'),
    loadMoreBtn: document.getElementById('loadMoreBtn'),
    clearFiltersBtn: document.getElementById('clearFiltersBtn'),
    orderSearch: document.getElementById('orderSearch'),
    globalSearch: document.getElementById('globalSearch'),
    statusFilter: document.getElementById('statusFilter'),
    dateFilter: document.getElementById('dateFilter'),
    sortOrder: document.getElementById('sortOrder'),
    statCards: document.querySelectorAll('.bk-stat-card'),
    cardTemplate: document.getElementById('orderCardTemplate'),
    trackModal: document.getElementById('trackModal'),
    trackModalBody: document.getElementById('trackModalBody'),
    detailsModal: document.getElementById('detailsModal'),
    detailsModalBody: document.getElementById('detailsModalBody'),
    cancelModal: document.getElementById('cancelModal'),
    confirmCancelBtn: document.getElementById('confirmCancelBtn'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage'),
    heroTotalCount: document.getElementById('heroTotalCount'),
    sidebar: document.getElementById('sidebar'),
    sidebarOverlay: document.getElementById('sidebarOverlay'),
    menuToggle: document.getElementById('menuToggle')
  };

  let pendingCancelId = null;
  let toastTimer = null;

  /* ---------------------------------------------------------
     HELPERS
  --------------------------------------------------------- */
  function formatCurrency(n) {
    return '₹' + Number(n).toLocaleString('en-IN');
  }

  function toSafeDate(dateStr) {
    if (!dateStr) return new Date(NaN);
    // Plain "YYYY-MM-DD" from mock data needs a time appended so it
    // parses in local time rather than UTC midnight. Full ISO strings
    // from MongoDB (e.g. createdAt) already include time and parse fine.
    const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
    return new Date(isDateOnly ? dateStr + 'T00:00:00' : dateStr);
  }

  function formatDate(dateStr) {
    const d = toSafeDate(dateStr);
    if (isNaN(d)) return '—';
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function daysAgo(dateStr) {
    const d = toSafeDate(dateStr);
    if (isNaN(d)) return Infinity;
    const now = new Date();
    return Math.floor((now - d) / (1000 * 60 * 60 * 24));
  }

  // No-op: icons are inlined as real SVG at render time (see icon() above),
  // so there is no external icon library left to "refresh". Kept as a
  // stub so existing call sites don't need to be touched one by one.
  function refreshIcons() {}

  function showToast(message) {
    els.toastMessage.textContent = message;
    els.toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { els.toast.hidden = true; }, 3200);
    refreshIcons();
  }

  /* ---------------------------------------------------------
     STATS
  --------------------------------------------------------- */
  function computeStatCounts() {
    const counts = { All: ORDERS.length, Preparing: 0, 'Out for Delivery': 0, Delivered: 0, Cancelled: 0 };
    ORDERS.forEach(o => {
      if (counts[o.status] !== undefined) counts[o.status]++;
    });
    return counts;
  }

  function renderStatCounts() {
    const counts = computeStatCounts();
    document.querySelectorAll('[data-count]').forEach(el => {
      const key = el.getAttribute('data-count');
      el.textContent = counts[key] !== undefined ? counts[key] : 0;
    });
    els.heroTotalCount.textContent = counts.All;
  }

  /* ---------------------------------------------------------
     FILTER / SORT / SEARCH PIPELINE
  --------------------------------------------------------- */
  function getFilteredOrders() {
    let list = ORDERS.slice();

    // Stat card quick filter
    if (state.statFilter !== 'All') {
      list = list.filter(o => o.status === state.statFilter);
    }

    // Status dropdown filter (applies in addition, only if not "All")
    if (state.statusFilter !== 'All') {
      list = list.filter(o => o.status === state.statusFilter);
    }

    // Date filter
    if (state.dateFilter !== 'All') {
      if (state.dateFilter === '30') {
        list = list.filter(o => daysAgo(o.orderDate) <= 30);
      } else if (state.dateFilter === '90') {
        list = list.filter(o => daysAgo(o.orderDate) <= 90);
      } else if (state.dateFilter === 'year') {
        const currentYear = String(new Date().getFullYear());
        list = list.filter(o => toSafeDate(o.orderDate).getFullYear() === Number(currentYear));
      }
    }

    // Search (order id, product, farmer)
    if (state.search.trim()) {
      const q = state.search.trim().toLowerCase();
      list = list.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.productName.toLowerCase().includes(q) ||
        o.farmerName.toLowerCase().includes(q) ||
        o.farmerLocation.toLowerCase().includes(q)
      );
    }

    // Sort
    list.sort((a, b) => {
      switch (state.sort) {
        case 'oldest': return toSafeDate(a.orderDate) - toSafeDate(b.orderDate);
        case 'amount-high': return b.totalAmount - a.totalAmount;
        case 'amount-low': return a.totalAmount - b.totalAmount;
        case 'newest':
        default: return toSafeDate(b.orderDate) - toSafeDate(a.orderDate);
      }
    });

    return list;
  }

  /* ---------------------------------------------------------
     RENDER ORDER CARDS
  --------------------------------------------------------- */
  function buildTracker(order) {
    const ol = document.createElement('ol');
    ol.className = 'bk-tracker';
    const currentIndex = STATUS_TO_STEP_INDEX[order.status] ?? 0;

    TRACK_STEPS.forEach((step, i) => {
      const li = document.createElement('li');
      li.className = 'bk-tracker__step';
      if (i < currentIndex) li.classList.add('is-done');
      else if (i === currentIndex) li.classList.add('is-current');

      const iconName = i < currentIndex ? 'check' : (i === currentIndex ? 'circle-dot' : 'circle');
      li.innerHTML = `
        <span class="bk-tracker__dot">${icon(iconName)}</span>
        <span class="bk-tracker__label">${step}</span>
      `;
      ol.appendChild(li);
    });
    return ol;
  }

  function renderOrderCard(order) {
    const node = els.cardTemplate.content.cloneNode(true);
    const card = node.querySelector('.bk-order-card');
    card.dataset.orderId = order.id;

    node.querySelector('.bk-order-card__id').textContent = 'Order ID: ' + order.id;
    node.querySelector('.bk-order-card__date').textContent = 'Ordered on ' + formatDate(order.orderDate);

    const badge = node.querySelector('.bk-status-badge');
    badge.textContent = order.status;
    badge.classList.add(STATUS_BADGE_CLASS[order.status]);

    const iconName = PRODUCT_ICONS[order.productName] || 'leaf';
    node.querySelector('.bk-product-img').innerHTML = icon(iconName);
    node.querySelector('.bk-product-name').textContent = order.productName;
    node.querySelector('.bk-product-qty').textContent =
      `${order.quantity} ${order.unit} × ₹${order.pricePerUnit} / ${order.unit}`;
    node.querySelector('.bk-farmer-name').textContent = 'Farmer: ' + order.farmerName;
    node.querySelector('.bk-location-text').textContent = order.farmerLocation;

    const verifiedBadge = node.querySelector('.bk-verified-badge');
    if (!order.verified) verifiedBadge.style.display = 'none';

    node.querySelector('.bk-amount-value').textContent = formatCurrency(order.totalAmount);
    const paymentInfo = node.querySelector('.bk-payment-info');
    const isPaid = order.paymentStatus === 'Successful';
    paymentInfo.textContent = `Paid via ${order.paymentMethod} — ${isPaid ? 'Payment Successful' : 'Payment Pending'}`;
    if (order.paymentMethod === 'Cash on Delivery' && !isPaid) {
      paymentInfo.textContent = `Cash on Delivery — Payment Pending`;
    }
    paymentInfo.classList.add(isPaid ? 'is-success' : 'is-pending');

    // Tracker / delivery note / cancelled note
    const trackerWrap = node.querySelector('.bk-tracker-wrap');
    const cancelledNote = node.querySelector('.bk-cancelled-note');
    const deliveryNote = node.querySelector('.bk-delivery-note');

    if (order.status === 'Cancelled') {
      trackerWrap.remove();
      cancelledNote.hidden = false;
    } else {
      cancelledNote.remove();
      trackerWrap.querySelector('.bk-tracker').replaceWith(buildTracker(order));
      if (order.status === 'Delivered') {
        deliveryNote.innerHTML = `${icon('package-check', 'bk-inline-icon bk-inline-icon--success')} Delivered on <strong>${formatDate(order.deliveredOn)}</strong>`;
      } else {
        deliveryNote.innerHTML = `${icon('calendar-clock', 'bk-inline-icon bk-inline-icon--sky')} Expected Delivery <strong>${order.expectedDelivery}</strong>`;
      }
    }

    // Actions
    const actions = node.querySelector('.bk-order-card__actions');
    actions.appendChild(buildActionButtons(order));

    return node;
  }

  function buildActionButtons(order) {
    const frag = document.createDocumentFragment();

    function makeBtn(label, variant, iconName, handler) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `bk-btn bk-btn--${variant}`;
      btn.innerHTML = `${iconName ? icon(iconName) : ''}${label}`;
      btn.addEventListener('click', handler);
      return btn;
    }

    const viewDetailsBtn = makeBtn('View Details', 'outline', 'file-text', () => openDetailsModal(order));

    if (order.status === 'Delivered') {
      frag.appendChild(viewDetailsBtn);
      frag.appendChild(makeBtn('Buy Again', 'primary', 'rotate-cw', () => handleBuyAgain(order)));
    } else if (order.status === 'Cancelled') {
      frag.appendChild(viewDetailsBtn);
      frag.appendChild(makeBtn('Buy Again', 'primary', 'rotate-cw', () => handleBuyAgain(order)));
    } else if (order.status === 'Preparing' || order.status === 'Confirmed') {
      frag.appendChild(viewDetailsBtn);
      frag.appendChild(makeBtn('Cancel Order', 'danger', 'x-circle', () => openCancelModal(order.id)));
    } else {
      // Out for Delivery / active
      frag.appendChild(makeBtn('Track Order', 'primary', 'map-pin', () => openTrackModal(order)));
      frag.appendChild(viewDetailsBtn);
    }

    return frag;
  }

  function renderOrders() {
    const filtered = getFilteredOrders();
    const visible = filtered.slice(0, state.visibleCount);

    els.ordersList.innerHTML = '';

    if (filtered.length === 0) {
      showNoResultsState();
      els.loadMoreBtn.style.display = 'none';
    } else {
      els.emptyState.hidden = true;
      visible.forEach(order => {
        els.ordersList.appendChild(renderOrderCard(order));
      });
      els.loadMoreBtn.style.display = state.visibleCount < filtered.length ? 'inline-flex' : 'none';
    }

    refreshIcons();
  }

  /* ---------------------------------------------------------
     STAT CARD FILTER
  --------------------------------------------------------- */
  function setStatFilter(value) {
    state.statFilter = value;
    state.visibleCount = PAGE_SIZE;
    els.statCards.forEach(card => {
      card.classList.toggle('is-active', card.dataset.statFilter === value);
    });
    // Keep status dropdown roughly in sync for clarity
    if (['Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].includes(value)) {
      els.statusFilter.value = value;
      state.statusFilter = value;
    } else {
      els.statusFilter.value = 'All';
      state.statusFilter = 'All';
    }
    renderOrders();
  }

  els.statCards.forEach(card => {
    card.addEventListener('click', () => setStatFilter(card.dataset.statFilter));
  });

  /* ---------------------------------------------------------
     TOOLBAR EVENTS
  --------------------------------------------------------- */
  function syncSearchInputs(value) {
    state.search = value;
    state.visibleCount = PAGE_SIZE;
    els.orderSearch.value = value;
    els.globalSearch.value = value;
    renderOrders();
  }

  els.orderSearch.addEventListener('input', (e) => syncSearchInputs(e.target.value));
  els.globalSearch.addEventListener('input', (e) => syncSearchInputs(e.target.value));

  els.statusFilter.addEventListener('change', (e) => {
    state.statusFilter = e.target.value;
    state.statFilter = e.target.value === 'All' ? 'All' : e.target.value;
    state.visibleCount = PAGE_SIZE;
    els.statCards.forEach(card => {
      card.classList.toggle('is-active', card.dataset.statFilter === state.statFilter);
    });
    renderOrders();
  });

  els.dateFilter.addEventListener('change', (e) => {
    state.dateFilter = e.target.value;
    state.visibleCount = PAGE_SIZE;
    renderOrders();
  });

  els.sortOrder.addEventListener('change', (e) => {
    state.sort = e.target.value;
    renderOrders();
  });

  els.loadMoreBtn.addEventListener('click', () => {
    state.visibleCount += PAGE_SIZE;
    renderOrders();
  });

  els.clearFiltersBtn.addEventListener('click', () => {
    if (els.clearFiltersBtn.dataset.mode === 'retry') {
      fetchOrders();
      return;
    }
    state = { statFilter: 'All', statusFilter: 'All', dateFilter: 'All', sort: 'newest', search: '', visibleCount: PAGE_SIZE };
    els.orderSearch.value = '';
    els.globalSearch.value = '';
    els.statusFilter.value = 'All';
    els.dateFilter.value = 'All';
    els.sortOrder.value = 'newest';
    els.statCards.forEach(card => card.classList.toggle('is-active', card.dataset.statFilter === 'All'));
    renderOrders();
  });

  /* ---------------------------------------------------------
     EMPTY / ERROR STATE HELPERS
  --------------------------------------------------------- */
  function showNoResultsState() {
    els.emptyStateIcon.innerHTML = icon('package-search');
    els.emptyStateHeading.textContent = 'No orders found';
    els.emptyStateMessage.textContent = 'Try changing your filters or search for another order.';
    els.clearFiltersBtn.textContent = 'Clear Filters';
    els.clearFiltersBtn.dataset.mode = 'clear';
    els.emptyState.hidden = false;
  }

  function showErrorState(message) {
    els.ordersList.innerHTML = '';
    els.loadMoreBtn.style.display = 'none';
    els.emptyStateIcon.innerHTML = icon('wifi-off');
    els.emptyStateHeading.textContent = 'Couldn\'t load your orders';
    els.emptyStateMessage.textContent = message || 'Something went wrong while fetching your orders. Please try again.';
    els.clearFiltersBtn.textContent = 'Retry';
    els.clearFiltersBtn.dataset.mode = 'retry';
    els.emptyState.hidden = false;
  }

  /* ---------------------------------------------------------
     SIDEBAR (mobile off-canvas)
  --------------------------------------------------------- */
  function openSidebar() {
    els.sidebar.classList.add('is-open');
    els.sidebarOverlay.hidden = false;
    els.menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    els.sidebar.classList.remove('is-open');
    els.sidebarOverlay.hidden = true;
    els.menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (els.menuToggle) {
    els.menuToggle.addEventListener('click', () => {
      const isOpen = els.sidebar.classList.contains('is-open');
      isOpen ? closeSidebar() : openSidebar();
    });
  }

  if (els.sidebarOverlay) {
    els.sidebarOverlay.addEventListener('click', closeSidebar);
  }

  // Close the mobile sidebar after selecting a nav link
  document.querySelectorAll('.bk-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 900) closeSidebar();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && els.sidebar && els.sidebar.classList.contains('is-open')) {
      closeSidebar();
    }
  });

  /* ---------------------------------------------------------
     MODALS — generic open/close
  --------------------------------------------------------- */
  let lastFocusedEl = null;

  function openModal(modalEl) {
    lastFocusedEl = document.activeElement;
    modalEl.hidden = false;
    document.body.style.overflow = 'hidden';
    const closeBtn = modalEl.querySelector('.bk-modal__close');
    if (closeBtn) closeBtn.focus();
    refreshIcons();
  }

  function closeModal(modalEl) {
    modalEl.hidden = true;
    document.body.style.overflow = '';
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(document.getElementById(btn.getAttribute('data-close-modal')));
    });
  });

  document.querySelectorAll('.bk-modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.bk-modal-overlay').forEach(overlay => {
        if (!overlay.hidden) closeModal(overlay);
      });
    }
  });

  /* ---------------------------------------------------------
     TRACK ORDER MODAL
  --------------------------------------------------------- */
  function openTrackModal(order) {
    const currentIndex = STATUS_TO_STEP_INDEX[order.status] ?? 0;
    const timelineData = [
      { label: 'Order Confirmed', time: formatDate(order.orderDate) + ', 10:30 AM' },
      { label: 'Farmer Preparing Produce', time: formatDate(order.orderDate) + ', 02:15 PM' },
      { label: 'Picked Up', time: 'Next day, 09:00 AM' },
      { label: 'Out for Delivery', time: currentIndex >= 3 ? 'Current Status' : 'Pending' },
      { label: 'Delivered', time: order.status === 'Delivered' ? formatDate(order.deliveredOn) : 'Pending' }
    ];

    let html = '<ol class="bk-track-timeline">';
    timelineData.forEach((step, i) => {
      let cls = '';
      if (i < currentIndex) cls = 'is-done';
      else if (i === currentIndex) cls = 'is-current';
      const iconName = i < currentIndex ? 'check' : (i === currentIndex ? 'circle-dot' : 'circle');
      html += `
        <li class="${cls}">
          <span class="bk-track-dot">${icon(iconName)}</span>
          <div>
            <div class="bk-track-title">${step.label}</div>
            <div class="bk-track-time">${step.time}</div>
          </div>
        </li>`;
    });
    html += '</ol>';
    html += `
      <div class="bk-track-eta">
        ${icon('calendar-clock')}
        <span>Expected Delivery <strong>${order.expectedDelivery}</strong></span>
      </div>`;

    els.trackModalBody.innerHTML = html;
    openModal(els.trackModal);
  }

  /* ---------------------------------------------------------
     VIEW DETAILS MODAL
  --------------------------------------------------------- */
  function openDetailsModal(order) {
    const productPrice = order.quantity * order.pricePerUnit;
    const deliveryCharge = 40;
    const platformFee = 10;
    const farmerSupportFee = 5;
    const total = order.totalAmount;

    els.detailsModalBody.innerHTML = `
      <div class="bk-detail-section-title">Order Info</div>
      <div class="bk-detail-row"><span>Order ID</span><span>${order.id}</span></div>
      <div class="bk-detail-row"><span>Order Date</span><span>${formatDate(order.orderDate)}</span></div>
      <div class="bk-detail-row"><span>Status</span><span>${order.status}</span></div>

      <div class="bk-detail-section-title">Product</div>
      <div class="bk-detail-row"><span>Product</span><span>${order.productName}</span></div>
      <div class="bk-detail-row"><span>Quantity</span><span>${order.quantity} ${order.unit}</span></div>
      <div class="bk-detail-row"><span>Farmer</span><span>${order.farmerName}</span></div>

      <div class="bk-detail-section-title">Delivery</div>
      <div class="bk-detail-row"><span>Delivery Address</span><span>House 12, Kadamkuan, Patna, Bihar – 800003</span></div>

      <div class="bk-detail-section-title">Payment</div>
      <div class="bk-detail-row"><span>Payment Method</span><span>${order.paymentMethod}</span></div>
      <div class="bk-detail-row"><span>Payment Status</span><span>${order.paymentStatus}</span></div>

      <div class="bk-detail-section-title">Price Breakdown</div>
      <div class="bk-price-breakdown">
        <div class="bk-price-row"><span>Product Price</span><span>${formatCurrency(productPrice)}</span></div>
        <div class="bk-price-row"><span>Delivery Charge</span><span>${formatCurrency(deliveryCharge)}</span></div>
        <div class="bk-price-row"><span>Platform Fee</span><span>${formatCurrency(platformFee)}</span></div>
        <div class="bk-price-row"><span>Farmer Support Fee</span><span>${formatCurrency(farmerSupportFee)}</span></div>
        <div class="bk-price-row total"><span>Total Amount</span><span>${formatCurrency(total)}</span></div>
      </div>

      <div class="bk-support-note">
        ${icon('hand-heart')}
        <span>You are supporting a local farmer with this purchase.</span>
      </div>
    `;
    openModal(els.detailsModal);
  }

  /* ---------------------------------------------------------
     CANCEL ORDER
  --------------------------------------------------------- */
  function openCancelModal(orderId) {
    pendingCancelId = orderId;
    openModal(els.cancelModal);
  }

  els.confirmCancelBtn.addEventListener('click', () => {
    // NOTE: this only updates local UI state. You've only shared the
    // viewOrders controller so far — once you have a cancel-order
    // endpoint (e.g. PATCH /api/orders/:id/cancel), call it here with
    // fetch(..., { method: 'PATCH', credentials: 'include' }) before
    // (or instead of) updating the local array below.
    const order = ORDERS.find(o => o.id === pendingCancelId);
    if (order) {
      order.status = 'Cancelled';
      order.paymentStatus = order.paymentMethod === 'Cash on Delivery' ? 'Pending' : order.paymentStatus;
    }
    closeModal(els.cancelModal);
    renderStatCounts();
    renderOrders();
    showToast(`Order ${pendingCancelId} has been cancelled.`);
    pendingCancelId = null;
  });

  /* ---------------------------------------------------------
     BUY AGAIN
  --------------------------------------------------------- */
  function handleBuyAgain(order) {
    showToast(`${order.productName} has been added to your order list.`);
  }

  /* ---------------------------------------------------------
     FETCH ORDERS — calls your viewOrders controller
  --------------------------------------------------------- */
  async function fetchOrders() {
    els.loadingState.hidden = false;
    els.emptyState.hidden = true;
    els.ordersList.innerHTML = '';
    els.loadMoreBtn.style.display = 'none';

    if (USE_MOCK_DATA) {
      ORDERS = MOCK_ORDERS.slice();
      els.loadingState.hidden = true;
      renderStatCounts();
      renderOrders();
      return;
    }

    try {
      const res = await fetch(CONFIG.API_BASE_URL + CONFIG.ORDERS_ENDPOINT, {
        method: 'GET',
        credentials: 'include', // sends the httpOnly refreshToken cookie
        headers: { 'Accept': 'application/json' }
      });

      // Not logged in / refresh token missing or invalid
      if (res.status === 401) {
        els.loadingState.hidden = true;
        showErrorState('Your session has expired. Please log in again.');
        setTimeout(() => { window.location.href = CONFIG.LOGIN_URL; }, 1500);
        return;
      }

      // Logged in but not a buyer account
      if (res.status === 403) {
        els.loadingState.hidden = true;
        showErrorState('This page is only available to buyer accounts.');
        return;
      }

      const data = await res.json();

      if (!res.ok || !data.success) {
        els.loadingState.hidden = true;
        showErrorState(data.message || 'Could not fetch your orders.');
        return;
      }

      const rawOrders = Array.isArray(data.orders) ? data.orders : [];
      ORDERS = rawOrders.map(normalizeOrder);

      els.loadingState.hidden = true;
      renderStatCounts();
      renderOrders();

    } catch (err) {
      console.error('fetchOrders failed:', err);
      els.loadingState.hidden = true;
      showErrorState('Network error. Please check your connection and try again.');
    }
  }

  /* ---------------------------------------------------------
     INIT
  --------------------------------------------------------- */
  function init() {
    refreshIcons();
    fetchOrders();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
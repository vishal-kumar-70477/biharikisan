/* =========================================================
   BIHARI KISAN — My Orders
   ========================================================= */

(function () {
  'use strict';

  /* ---------------------------------------------------------
     ICONS
  --------------------------------------------------------- */

  const ICONS = {
    'badge-check': `<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" /><path d="m9 12 2 2 4-4" />`,
    'calendar-clock': `<path d="M16 14v2.2l1.6 1" /><path d="M16 2v3" /><path d="M21 7.338V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h2.338" /><path d="M3 9h5.859" /><path d="M8 2v3" /><circle cx="16" cy="16" r="6" />`,
    'check': `<path d="M20 6 9 17l-5-5" />`,
    'circle': `<circle cx="12" cy="12" r="10" />`,
    'circle-dot': `<circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="1" />`,
    'circle-x': `<circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" />`,
    'file-text': `<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" /><path d="M14 2v5a1 1 0 0 0 1 1h5" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />`,
    'flame': `<path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4" />`,
    'flower': `<circle cx="12" cy="12" r="3" /><path d="M12 16.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 1 1 4.5 4.5 4.5 4.5 0 1 1-4.5 4.5" />`,
    'hand-heart': `<path d="M11 14h2a2 2 0 0 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16" /><path d="m2 15 6 6" /><path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a1 1 0 0 0-2.75-2.91" />`,
    'leaf': `<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />`,
    'map-pin': `<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" />`,
    'package-check': `<path d="M12 22V12" /><path d="m16 17 2 2 4-4" /><path d="M21 11.127V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.729l7 4a2 2 0 0 0 2 .001l1.32-.753" />`,
    'package-search': `<path d="M12 22V12" /><path d="M20.27 18.27 22 20" /><path d="M21 10.498V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.729l7 4a2 2 0 0 0 2 .001l.98-.559" /><circle cx="18.5" cy="16.5" r="2.5" />`,
    'rotate-cw': `<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" />`,
    'sprout': `<path d="M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3" /><path d="M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4" /><path d="M5 21h14" />`,
    'wheat': `<path d="M2 22 16 8" /><path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" /><path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />`,
    'wifi-off': `<path d="M12 20h.01" /><path d="M8.5 16.429a5 5 0 0 1 7 0" /><path d="M5 12.859a10 10 0 0 1 5.17-2.69" /><path d="M19 12.859a10 10 0 0 0-2.007-1.523" /><path d="M2 8.82a15 15 0 0 1 4.177-2.643" /><path d="M22 8.82a15 15 0 0 0-11.288-3.764" /><path d="m2 2 20 20" />`,
    'x-circle': `<circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" />`
  };

  function icon(name, cls = '') {
    return `
      <svg
        class="lucide-ico ${cls}"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        ${ICONS[name] || ''}
      </svg>
    `;
  }

  /* ---------------------------------------------------------
     CONFIG
  --------------------------------------------------------- */

  const CONFIG = {
    API_BASE_URL: '',
    ORDERS_ENDPOINT: '/biharikisan/buyer/view-Orders',
    LOGIN_URL: '/'
  };

  /* ---------------------------------------------------------
     STATUS MAPS
  --------------------------------------------------------- */

  const ORDER_STATUS_MAP = {
    pending: 'Confirmed',
    confirmed: 'Confirmed',
    processing: 'Preparing',
    preparing: 'Preparing',
    pickedup: 'Picked Up',
    picked_up: 'Picked Up',
    shipped: 'Out for Delivery',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    canceled: 'Cancelled'
  };

  const PAYMENT_STATUS_MAP = {
    pending: 'Pending',
    paid: 'Successful',
    successful: 'Successful',
    failed: 'Failed',
    refunded: 'Refunded'
  };

  const PAYMENT_METHOD_MAP = {
    cod: 'Cash on Delivery',
    upi: 'UPI',
    card: 'Card',
    netbanking: 'Net Banking'
  };

  /* ---------------------------------------------------------
     DATA
  --------------------------------------------------------- */

  let ORDERS = [];

  function normalizeOrder(raw) {
    const product = raw.productId || {};
    const seller = raw.sellerId || {};

    const quantity = Number(raw.quantity ?? 1);

    const pricePerUnit = Number(
      raw.priceAtOrder ??
      product.productPrice ??
      raw.pricePerUnit ??
      0
    );

    const sellerAddress = seller.address || {};

    const farmerLocation = [
      sellerAddress.village,
      sellerAddress.city,
      sellerAddress.district,
      sellerAddress.state
    ]
      .filter(Boolean)
      .join(', ');

    const rawStatus = String(
      raw.orderStatus ?? raw.status ?? 'pending'
    ).toLowerCase();

    const rawPaymentStatus = String(
      raw.paymentStatus ?? 'pending'
    ).toLowerCase();

    const rawPaymentMethod = String(
      raw.paymentMethod ?? ''
    ).toLowerCase();

    return {
      id: String(raw._id ?? raw.orderId ?? raw.id ?? ''),

      productName:
        product.productDesc ??
        product.productName ??
        raw.productName ??
        'Product',

      quantity,

      unit:
        raw.unit ??
        product.unit ??
        product.productUnit ??
        'KG',

      pricePerUnit,

      farmerName:
        seller.sellerName ??
        seller.fullName ??
        seller.name ??
        raw.farmerName ??
        'Farmer',

      farmerLocation:
        farmerLocation ||
        raw.farmerLocation ||
        'Location not available',

      verified:
        raw.verified ??
        seller.verified ??
        false,

      totalAmount: Number(
        raw.totalAmount ??
        raw.amount ??
        quantity * pricePerUnit
      ),

      orderDate:
        raw.orderDate ??
        raw.createdAt ??
        new Date().toISOString(),

      status:
        ORDER_STATUS_MAP[rawStatus] ??
        raw.orderStatus ??
        raw.status ??
        'Confirmed',

      paymentMethod:
        PAYMENT_METHOD_MAP[rawPaymentMethod] ??
        raw.paymentMethod ??
        'Not specified',

      paymentStatus:
        PAYMENT_STATUS_MAP[rawPaymentStatus] ??
        raw.paymentStatus ??
        'Pending',

      expectedDelivery:
        raw.expectedDelivery ??
        raw.expectedDeliveryDate ??
        '',

      deliveredOn:
        raw.deliveredOn ??
        raw.deliveredAt ??
        null
    };
  }

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

  const STATUS_BADGE_CLASS = {
    Confirmed: 'bk-status-badge--confirmed',
    Preparing: 'bk-status-badge--preparing',
    'Picked Up': 'bk-status-badge--preparing',
    'Out for Delivery': 'bk-status-badge--transit',
    Delivered: 'bk-status-badge--delivered',
    Cancelled: 'bk-status-badge--cancelled'
  };

  /* ---------------------------------------------------------
     DOM
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
    heroTotalCount: document.getElementById('heroTotalCount')
  };

  /* ---------------------------------------------------------
     HELPERS
  --------------------------------------------------------- */

  function formatCurrency(value) {
    const amount = Number(value);

    return `₹${Number.isFinite(amount)
      ? amount.toLocaleString('en-IN')
      : '0'
    }`;
  }

  function toSafeDate(dateStr) {
    if (!dateStr) return new Date(NaN);

    const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dateStr);

    return new Date(
      isDateOnly
        ? `${dateStr}T00:00:00`
        : dateStr
    );
  }

  function formatDate(dateStr) {
    const date = toSafeDate(dateStr);

    if (Number.isNaN(date.getTime())) return '—';

    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  function daysAgo(dateStr) {
    const date = toSafeDate(dateStr);

    if (Number.isNaN(date.getTime())) return Infinity;

    return Math.floor(
      (Date.now() - date.getTime()) /
      (1000 * 60 * 60 * 24)
    );
  }

  /* ---------------------------------------------------------
     STATS
  --------------------------------------------------------- */

  function renderStatCounts() {
    const counts = {
      All: ORDERS.length,
      Preparing: 0,
      'Out for Delivery': 0,
      Delivered: 0,
      Cancelled: 0
    };

    ORDERS.forEach(order => {
      if (counts[order.status] !== undefined) {
        counts[order.status]++;
      }
    });

    document.querySelectorAll('[data-count]').forEach(element => {
      const key = element.dataset.count;
      element.textContent = counts[key] ?? 0;
    });

    if (els.heroTotalCount) {
      els.heroTotalCount.textContent = counts.All;
    }
  }

  /* ---------------------------------------------------------
     FILTER / SEARCH / SORT
  --------------------------------------------------------- */

  function getFilteredOrders() {
    let list = [...ORDERS];

    if (state.statFilter !== 'All') {
      list = list.filter(
        order => order.status === state.statFilter
      );
    }

    if (state.statusFilter !== 'All') {
      list = list.filter(
        order => order.status === state.statusFilter
      );
    }

    if (state.dateFilter === '30') {
      list = list.filter(order => daysAgo(order.orderDate) <= 30);
    }

    if (state.dateFilter === '90') {
      list = list.filter(order => daysAgo(order.orderDate) <= 90);
    }

    if (state.dateFilter === 'year') {
      const year = new Date().getFullYear();

      list = list.filter(
        order => toSafeDate(order.orderDate).getFullYear() === year
      );
    }

    if (state.search.trim()) {
      const query = state.search.trim().toLowerCase();

      list = list.filter(order => {
        return [
          order.id,
          order.productName,
          order.farmerName,
          order.farmerLocation
        ].some(value =>
          String(value ?? '')
            .toLowerCase()
            .includes(query)
        );
      });
    }

    list.sort((a, b) => {
      if (state.sort === 'oldest') {
        return toSafeDate(a.orderDate) - toSafeDate(b.orderDate);
      }

      if (state.sort === 'amount-high') {
        return b.totalAmount - a.totalAmount;
      }

      if (state.sort === 'amount-low') {
        return a.totalAmount - b.totalAmount;
      }

      return toSafeDate(b.orderDate) - toSafeDate(a.orderDate);
    });

    return list;
  }

  /* ---------------------------------------------------------
     RENDER CARD
  --------------------------------------------------------- */

  function renderOrderCard(order) {
    const node = els.cardTemplate.content.cloneNode(true);

    const card = node.querySelector('.bk-order-card');

    if (card) {
      card.dataset.orderId = order.id;
    }

    const setText = (selector, value) => {
      const element = node.querySelector(selector);

      if (element) {
        element.textContent = value;
      }
    };

    setText(
      '.bk-order-card__id',
      `Order ID: ${order.id}`
    );

    setText(
      '.bk-order-card__date',
      `Ordered on ${formatDate(order.orderDate)}`
    );

    const badge = node.querySelector('.bk-status-badge');

    if (badge) {
      badge.textContent = order.status;

      const badgeClass = STATUS_BADGE_CLASS[order.status];

      if (badgeClass) {
        badge.classList.add(badgeClass);
      }
    }

    const productImage = node.querySelector('.bk-product-img');

    if (productImage) {
      productImage.innerHTML = icon('leaf');
    }

    setText('.bk-product-name', order.productName);

    setText(
      '.bk-product-qty',
      `${order.quantity} ${order.unit} × ₹${order.pricePerUnit} / ${order.unit}`
    );

    setText(
      '.bk-farmer-name',
      `Farmer: ${order.farmerName}`
    );

    setText(
      '.bk-location-text',
      order.farmerLocation
    );

    const verifiedBadge = node.querySelector('.bk-verified-badge');

    if (verifiedBadge && !order.verified) {
      verifiedBadge.style.display = 'none';
    }

    setText(
      '.bk-amount-value',
      formatCurrency(order.totalAmount)
    );

    const paymentInfo = node.querySelector('.bk-payment-info');

    if (paymentInfo) {
      const isPaid = order.paymentStatus === 'Successful';

      paymentInfo.textContent =
        order.paymentMethod === 'Cash on Delivery' && !isPaid
          ? 'Cash on Delivery — Payment Pending'
          : `Paid via ${order.paymentMethod} — ${
              isPaid
                ? 'Payment Successful'
                : 'Payment Pending'
            }`;

      paymentInfo.classList.add(
        isPaid ? 'is-success' : 'is-pending'
      );
    }

    return node;
  }

  /* ---------------------------------------------------------
     EMPTY STATE
  --------------------------------------------------------- */

  function showNoResultsState() {
    if (els.emptyStateIcon) {
      els.emptyStateIcon.innerHTML = icon('package-search');
    }

    if (els.emptyStateHeading) {
      els.emptyStateHeading.textContent = 'No orders found';
    }

    if (els.emptyStateMessage) {
      els.emptyStateMessage.textContent =
        'Try changing your filters or search for another order.';
    }

    if (els.clearFiltersBtn) {
      els.clearFiltersBtn.textContent = 'Clear Filters';
      els.clearFiltersBtn.dataset.mode = 'clear';
    }

    if (els.emptyState) {
      els.emptyState.hidden = false;
    }
  }

  function showErrorState(message) {
    if (els.ordersList) {
      els.ordersList.innerHTML = '';
    }

    if (els.loadMoreBtn) {
      els.loadMoreBtn.style.display = 'none';
    }

    if (els.emptyStateIcon) {
      els.emptyStateIcon.innerHTML = icon('wifi-off');
    }

    if (els.emptyStateHeading) {
      els.emptyStateHeading.textContent =
        "Couldn't load your orders";
    }

    if (els.emptyStateMessage) {
      els.emptyStateMessage.textContent = message;
    }

    if (els.clearFiltersBtn) {
      els.clearFiltersBtn.textContent = 'Retry';
      els.clearFiltersBtn.dataset.mode = 'retry';
    }

    if (els.emptyState) {
      els.emptyState.hidden = false;
    }
  }

  /* ---------------------------------------------------------
     RENDER
  --------------------------------------------------------- */

  function renderOrders() {
    const filteredOrders = getFilteredOrders();

    const visibleOrders = filteredOrders.slice(
      0,
      state.visibleCount
    );

    els.ordersList.innerHTML = '';

    if (filteredOrders.length === 0) {
      showNoResultsState();

      if (els.loadMoreBtn) {
        els.loadMoreBtn.style.display = 'none';
      }

      return;
    }

    if (els.emptyState) {
      els.emptyState.hidden = true;
    }

    visibleOrders.forEach(order => {
      els.ordersList.appendChild(
        renderOrderCard(order)
      );
    });

    if (els.loadMoreBtn) {
      els.loadMoreBtn.style.display =
        state.visibleCount < filteredOrders.length
          ? 'inline-flex'
          : 'none';
    }
  }

  /* ---------------------------------------------------------
     EVENTS
  --------------------------------------------------------- */

  els.statCards.forEach(card => {
    card.addEventListener('click', () => {
      state.statFilter =
        card.dataset.statFilter || 'All';

      state.statusFilter = 'All';
      state.visibleCount = PAGE_SIZE;

      if (els.statusFilter) {
        els.statusFilter.value = 'All';
      }

      els.statCards.forEach(item => {
        item.classList.toggle(
          'is-active',
          item === card
        );
      });

      renderOrders();
    });
  });

  function handleSearch(value) {
    state.search = value;
    state.visibleCount = PAGE_SIZE;

    if (els.orderSearch &&
        els.orderSearch.value !== value) {
      els.orderSearch.value = value;
    }

    if (els.globalSearch &&
        els.globalSearch.value !== value) {
      els.globalSearch.value = value;
    }

    renderOrders();
  }

  if (els.orderSearch) {
    els.orderSearch.addEventListener('input', event => {
      handleSearch(event.target.value);
    });
  }

  if (els.globalSearch) {
    els.globalSearch.addEventListener('input', event => {
      handleSearch(event.target.value);
    });
  }

  if (els.statusFilter) {
    els.statusFilter.addEventListener('change', event => {
      state.statusFilter = event.target.value;
      state.statFilter = 'All';
      state.visibleCount = PAGE_SIZE;

      els.statCards.forEach(card => {
        card.classList.toggle(
          'is-active',
          card.dataset.statFilter === 'All'
        );
      });

      renderOrders();
    });
  }

  if (els.dateFilter) {
    els.dateFilter.addEventListener('change', event => {
      state.dateFilter = event.target.value;
      state.visibleCount = PAGE_SIZE;

      renderOrders();
    });
  }

  if (els.sortOrder) {
    els.sortOrder.addEventListener('change', event => {
      state.sort = event.target.value;
      renderOrders();
    });
  }

  if (els.loadMoreBtn) {
    els.loadMoreBtn.addEventListener('click', () => {
      state.visibleCount += PAGE_SIZE;
      renderOrders();
    });
  }

  if (els.clearFiltersBtn) {
    els.clearFiltersBtn.addEventListener('click', () => {
      if (els.clearFiltersBtn.dataset.mode === 'retry') {
        fetchOrders();
        return;
      }

      state = {
        statFilter: 'All',
        statusFilter: 'All',
        dateFilter: 'All',
        sort: 'newest',
        search: '',
        visibleCount: PAGE_SIZE
      };

      if (els.orderSearch) els.orderSearch.value = '';
      if (els.globalSearch) els.globalSearch.value = '';
      if (els.statusFilter) els.statusFilter.value = 'All';
      if (els.dateFilter) els.dateFilter.value = 'All';
      if (els.sortOrder) els.sortOrder.value = 'newest';

      els.statCards.forEach(card => {
        card.classList.toggle(
          'is-active',
          card.dataset.statFilter === 'All'
        );
      });

      renderOrders();
    });
  }

  /* ---------------------------------------------------------
     FETCH ORDERS
  --------------------------------------------------------- */

  async function fetchOrders() {
    if (els.loadingState) {
      els.loadingState.hidden = false;
    }

    if (els.emptyState) {
      els.emptyState.hidden = true;
    }

    if (els.ordersList) {
      els.ordersList.innerHTML = '';
    }

    if (els.loadMoreBtn) {
      els.loadMoreBtn.style.display = 'none';
    }

    try {
      const url =
        `${CONFIG.API_BASE_URL}${CONFIG.ORDERS_ENDPOINT}`;

      console.log('Fetching orders:', url);

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: 'application/json'
        }
      });

      console.log(
        'Orders API status:',
        response.status
      );

      let data;

      try {
        data = await response.json();
      } catch (error) {
        throw new Error(
          'Server returned invalid JSON response'
        );
      }

      console.log(
        'Orders API response:',
        data
      );

      if (response.status === 401) {
        showErrorState(
          data.message ||
          'Your session has expired. Please log in again.'
        );

        return;
      }

      if (response.status === 403) {
        showErrorState(
          data.message ||
          'This page is only available to buyer accounts.'
        );

        return;
      }

      if (!response.ok) {
        showErrorState(
          data.message ||
          `Could not fetch orders. Error ${response.status}`
        );

        return;
      }

      if (data.success === false) {
        showErrorState(
          data.message ||
          'Could not fetch your orders.'
        );

        return;
      }

      const rawOrders =
        Array.isArray(data.orders)
          ? data.orders
          : Array.isArray(data.data)
            ? data.data
            : [];

      console.log(
        'Raw orders:',
        rawOrders
      );

      ORDERS = rawOrders.map(normalizeOrder);

      console.log(
        'Normalized orders:',
        ORDERS
      );

      renderStatCounts();
      renderOrders();

    } catch (error) {
      console.error(
        'fetchOrders failed:',
        error
      );

      showErrorState(
        error.message ||
        'Network error. Please check your connection and try again.'
      );

    } finally {
      if (els.loadingState) {
        els.loadingState.hidden = true;
      }
    }
  }

  /* ---------------------------------------------------------
     INIT
  --------------------------------------------------------- */

  function init() {
    fetchOrders();
  }

  document.addEventListener(
    'DOMContentLoaded',
    init
  );

})();
/* =========================================================
   BIHARI KISAN — My Orders
   Frontend logic — fetches live orders from the backend
   (GET /api/orders/view — see CONFIG below)
   ========================================================= */
(function () {
  'use strict';

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
    {
      id: 'BK-2026-001245', productName: 'Desi Aloo', quantity: 5, unit: 'KG', pricePerUnit: 200,
      farmerName: 'Piyush Kumar', farmerLocation: 'Bihar, India', verified: true,
      totalAmount: 1055, orderDate: '2026-08-16', status: 'Out for Delivery',
      paymentMethod: 'UPI', paymentStatus: 'Successful', expectedDelivery: '18–20 August 2026'
    },
    {
      id: 'BK-2026-001240', productName: 'Fresh Tomato', quantity: 10, unit: 'KG', pricePerUnit: 45,
      farmerName: 'Ramesh Kumar', farmerLocation: 'Nalanda, Bihar', verified: true,
      totalAmount: 505, orderDate: '2026-08-14', status: 'Delivered',
      paymentMethod: 'UPI', paymentStatus: 'Successful', expectedDelivery: '15–16 August 2026',
      deliveredOn: '2026-08-15'
    },
    {
      id: 'BK-2026-001233', productName: 'Green Chilli', quantity: 3, unit: 'KG', pricePerUnit: 90,
      farmerName: 'Suresh Yadav', farmerLocation: 'Muzaffarpur, Bihar', verified: true,
      totalAmount: 325, orderDate: '2026-08-10', status: 'Delivered',
      paymentMethod: 'Cash on Delivery', paymentStatus: 'Successful', expectedDelivery: '11–12 August 2026',
      deliveredOn: '2026-08-11'
    },
    {
      id: 'BK-2026-001229', productName: 'Basmati Rice', quantity: 25, unit: 'KG', pricePerUnit: 85,
      farmerName: 'Anil Prasad', farmerLocation: 'Buxar, Bihar', verified: true,
      totalAmount: 2170, orderDate: '2026-08-08', status: 'Preparing',
      paymentMethod: 'UPI', paymentStatus: 'Successful', expectedDelivery: '20–22 August 2026'
    },
    {
      id: 'BK-2026-001221', productName: 'Seasonal Onion', quantity: 15, unit: 'KG', pricePerUnit: 30,
      farmerName: 'Manoj Singh', farmerLocation: 'Vaishali, Bihar', verified: false,
      totalAmount: 505, orderDate: '2026-08-05', status: 'Delivered',
      paymentMethod: 'UPI', paymentStatus: 'Successful', expectedDelivery: '07–08 August 2026',
      deliveredOn: '2026-08-07'
    },
    {
      id: 'BK-2026-001215', productName: 'Fresh Cauliflower', quantity: 6, unit: 'KG', pricePerUnit: 40,
      farmerName: 'Deepak Mahto', farmerLocation: 'Gaya, Bihar', verified: true,
      totalAmount: 295, orderDate: '2026-08-02', status: 'Cancelled',
      paymentMethod: 'Cash on Delivery', paymentStatus: 'Pending', expectedDelivery: '04–05 August 2026'
    },
    {
      id: 'BK-2026-001208', productName: 'Organic Wheat', quantity: 40, unit: 'KG', pricePerUnit: 32,
      farmerName: 'Piyush Kumar', farmerLocation: 'Bihar, India', verified: true,
      totalAmount: 1335, orderDate: '2026-07-28', status: 'Delivered',
      paymentMethod: 'UPI', paymentStatus: 'Successful', expectedDelivery: '30–31 July 2026',
      deliveredOn: '2026-07-30'
    },
    {
      id: 'BK-2026-001199', productName: 'Mustard Seeds', quantity: 8, unit: 'KG', pricePerUnit: 120,
      farmerName: 'Ramesh Kumar', farmerLocation: 'Nalanda, Bihar', verified: true,
      totalAmount: 1015, orderDate: '2026-07-22', status: 'Delivered',
      paymentMethod: 'UPI', paymentStatus: 'Successful', expectedDelivery: '24–25 July 2026',
      deliveredOn: '2026-07-24'
    },
    {
      id: 'BK-2026-001185', productName: 'Desi Aloo', quantity: 12, unit: 'KG', pricePerUnit: 195,
      farmerName: 'Suresh Yadav', farmerLocation: 'Muzaffarpur, Bihar', verified: true,
      totalAmount: 2395, orderDate: '2026-07-15', status: 'Delivered',
      paymentMethod: 'UPI', paymentStatus: 'Successful', expectedDelivery: '17–18 July 2026',
      deliveredOn: '2026-07-17'
    },
    {
      id: 'BK-2026-001170', productName: 'Fresh Tomato', quantity: 6, unit: 'KG', pricePerUnit: 42,
      farmerName: 'Anil Prasad', farmerLocation: 'Buxar, Bihar', verified: true,
      totalAmount: 307, orderDate: '2026-06-30', status: 'Delivered',
      paymentMethod: 'Cash on Delivery', paymentStatus: 'Successful', expectedDelivery: '02–03 July 2026',
      deliveredOn: '2026-07-02'
    },
    {
      id: 'BK-2026-001162', productName: 'Green Chilli', quantity: 4, unit: 'KG', pricePerUnit: 85,
      farmerName: 'Manoj Singh', farmerLocation: 'Vaishali, Bihar', verified: false,
      totalAmount: 395, orderDate: '2026-06-18', status: 'Confirmed',
      paymentMethod: 'UPI', paymentStatus: 'Successful', expectedDelivery: '22–24 August 2026'
    },
    {
      id: 'BK-2026-001150', productName: 'Basmati Rice', quantity: 10, unit: 'KG', pricePerUnit: 88,
      farmerName: 'Deepak Mahto', farmerLocation: 'Gaya, Bihar', verified: true,
      totalAmount: 935, orderDate: '2026-06-05', status: 'Delivered',
      paymentMethod: 'UPI', paymentStatus: 'Successful', expectedDelivery: '07–08 June 2026',
      deliveredOn: '2026-06-07'
    }
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
  function normalizeOrder(raw) {
    const firstProduct = Array.isArray(raw.products) ? raw.products[0] : null;

    return {
      id: raw.orderId || raw._id || raw.id || '',
      productName: raw.productName || firstProduct?.name || firstProduct?.productName || 'Product',
      quantity: raw.quantity || firstProduct?.quantity || 1,
      unit: raw.unit || firstProduct?.unit || 'KG',
      pricePerUnit: raw.pricePerUnit || firstProduct?.pricePerUnit || firstProduct?.price || 0,
      farmerName: raw.farmerName || raw.farmer?.name || firstProduct?.farmerName || 'Farmer',
      farmerLocation: raw.farmerLocation || raw.farmer?.location || firstProduct?.farmerLocation || '',
      verified: raw.verified ?? raw.farmer?.verified ?? firstProduct?.verified ?? false,
      totalAmount: raw.totalAmount || raw.amount || raw.total || 0,
      orderDate: raw.orderDate || raw.createdAt || new Date().toISOString(),
      status: raw.status || raw.orderStatus || 'Confirmed',
      paymentMethod: raw.paymentMethod || 'UPI',
      paymentStatus: raw.paymentStatus || 'Pending',
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

  function refreshIcons() {
    if (window.lucide) window.lucide.createIcons();
  }

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
        <span class="bk-tracker__dot"><i data-lucide="${iconName}"></i></span>
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
    node.querySelector('.bk-product-img i').setAttribute('data-lucide', iconName);
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
        deliveryNote.innerHTML = `<i data-lucide="package-check" style="width:15px;height:15px;color:var(--success);"></i> Delivered on <strong>${formatDate(order.deliveredOn)}</strong>`;
      } else {
        deliveryNote.innerHTML = `<i data-lucide="calendar-clock" style="width:15px;height:15px;color:var(--sky);"></i> Expected Delivery <strong>${order.expectedDelivery}</strong>`;
      }
    }

    // Actions
    const actions = node.querySelector('.bk-order-card__actions');
    actions.appendChild(buildActionButtons(order));

    return node;
  }

  function buildActionButtons(order) {
    const frag = document.createDocumentFragment();

    function makeBtn(label, variant, icon, handler) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `bk-btn bk-btn--${variant}`;
      btn.innerHTML = `${icon ? `<i data-lucide="${icon}"></i>` : ''}${label}`;
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
    els.emptyStateIcon.querySelector('i').setAttribute('data-lucide', 'package-search');
    els.emptyStateHeading.textContent = 'No orders found';
    els.emptyStateMessage.textContent = 'Try changing your filters or search for another order.';
    els.clearFiltersBtn.textContent = 'Clear Filters';
    els.clearFiltersBtn.dataset.mode = 'clear';
    els.emptyState.hidden = false;
    refreshIcons();
  }

  function showErrorState(message) {
    els.ordersList.innerHTML = '';
    els.loadMoreBtn.style.display = 'none';
    els.emptyStateIcon.querySelector('i').setAttribute('data-lucide', 'wifi-off');
    els.emptyStateHeading.textContent = 'Couldn\'t load your orders';
    els.emptyStateMessage.textContent = message || 'Something went wrong while fetching your orders. Please try again.';
    els.clearFiltersBtn.textContent = 'Retry';
    els.clearFiltersBtn.dataset.mode = 'retry';
    els.emptyState.hidden = false;
    refreshIcons();
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
          <span class="bk-track-dot"><i data-lucide="${iconName}"></i></span>
          <div>
            <div class="bk-track-title">${step.label}</div>
            <div class="bk-track-time">${step.time}</div>
          </div>
        </li>`;
    });
    html += '</ol>';
    html += `
      <div class="bk-track-eta">
        <i data-lucide="calendar-clock"></i>
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
        <i data-lucide="hand-heart"></i>
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
  /* ---------------------------------------------------------
   FETCH ORDERS
--------------------------------------------------------- */
async function fetchOrders() { 
    els.loadingState.hidden = false; 
    els.emptyState.hidden = true; 
    els.ordersList.innerHTML = ''; 
    els.loadMoreBtn.style.display = 'none'; 
 
    try { 
        const res = await fetch('/biharikisan/buyer/view-Orders', { 
            method: 'GET', 
            credentials: 'include', 
            headers: { 
                'Accept': 'application/json' 
            } 
        }); 
 
        console.log("Status:", res.status); 
        console.log("URL:", res.url); 
 
        const data = await res.json(); 
 
        console.log("Orders response:", data); 
 
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
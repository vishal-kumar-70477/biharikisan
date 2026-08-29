(function(){

  const API_BASE = '/biharikisan/seller';
  const productsEndpoint = `${API_BASE}/view-Products`;
  const deleteEndpoint = id => `${API_BASE}/delete-Products/${id}`;
  const editEndpoint = id => `${API_BASE}/edit-Products/${id}`;

  let products = [];

  const state = { search:"", category:"all", status:"all", sort:"newest", page:1, perPage:9, mode:"normal", editingId:null, pendingDeleteId:null };

  const grid = document.getElementById('productGrid');
  const paginationInfo = document.getElementById('paginationInfo');
  const paginationControls = document.getElementById('paginationControls');
  const toast = document.getElementById('toast');

  function showToast(msg){
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(()=>toast.classList.remove('show'), 2200);
  }

  const statusMeta = {
    active:   { label:"Active",    badge:"status-active" },
    lowstock: { label:"Low Stock", badge:"status-lowstock" },
    soldout:  { label:"Sold Out",  badge:"status-soldout" },
    draft:    { label:"Draft",     badge:"status-draft" }
  };

  function updateSummary(){
    document.getElementById('statTotal').textContent = products.length;
    document.getElementById('statActive').textContent = products.filter(p=>p.status==='active').length;
    document.getElementById('statLow').textContent = products.filter(p=>p.status==='lowstock').length;
    document.getElementById('statSold').textContent = products.filter(p=>p.status==='soldout').length;
  }

  function normalizeProduct(product){
    const stock = Number(product.productQuantity) || 0;
    const status = stock <= 0 ? 'soldout' : stock <= 10 ? 'lowstock' : 'active';
    return {
      id: String(product._id),
      name: product.productDesc || 'Untitled product',
      category: product.category || 'Other',
      price: Number(product.productPrice) || 0,
      unit: 'kg',
      stock,
      capacity: Math.max(stock, 1),
      status,
      views: Number(product.viewCount) || 0,
      orders: Number(product.orderCount) || 0,
      image: product.productImageUri || '',
      createdAt: new Date(product.createdAt || 0).getTime()
    };
  }

  async function loadProducts(){
    state.mode = 'loading';
    render();
    try {
      const response = await fetch(productsEndpoint, { credentials: 'include' });
      const result = await response.json().catch(() => ({}));
      if(!response.ok || !result.success){
        throw new Error(result.message || `Request failed (${response.status})`);
      }
      products = Array.isArray(result.data) ? result.data.map(normalizeProduct) : [];
      state.mode = 'normal';
      render();
    } catch(error) {
      console.error('Load farmer products error:', error);
      products = [];
      state.mode = 'normal';
      grid.innerHTML = `<div class="empty-state"><h3>Could not load products</h3><p>${error.message}</p><button class="btn-sell" id="retryProductsBtn">Try Again</button></div>`;
      paginationInfo.textContent = '';
      paginationControls.innerHTML = '';
      document.getElementById('retryProductsBtn')?.addEventListener('click', loadProducts);
      updateSummary();
    }
  }

  function getFiltered(){
    let list = products.filter(p=>{
      if(state.search && !p.name.toLowerCase().includes(state.search.toLowerCase())) return false;
      if(state.category!=="all" && p.category!==state.category) return false;
      if(state.status!=="all" && p.status!==state.status) return false;
      return true;
    });
    switch(state.sort){
      case "newest": list.sort((a,b)=>b.createdAt-a.createdAt); break;
      case "oldest": list.sort((a,b)=>a.createdAt-b.createdAt); break;
      case "price-asc": list.sort((a,b)=>a.price-b.price); break;
      case "price-desc": list.sort((a,b)=>b.price-a.price); break;
      case "stock-asc": list.sort((a,b)=>a.stock-b.stock); break;
    }
    return list;
  }

  function productMedia(p){
    if(p.image){
      return `<img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.parentElement.innerHTML=this.parentElement.dataset.fallback">`;
    }
    return placeholderHTML();
  }
  function placeholderHTML(){
    return `<div class="placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg></div>`;
  }

  function stockBarHTML(p){
    if(p.status==='soldout' || p.stock<=0){
      return `<div class="stock-block">
        <div class="stock-labels"><span>Stock Level</span><span>0 ${p.unit} / ${p.capacity} ${p.unit}</span></div>
        <div class="stock-bar disabled"><div class="stock-bar-fill empty"></div></div>
      </div>`;
    }
    const pct = Math.max(2, Math.min(100, Math.round((p.stock/p.capacity)*100)));
    const warn = p.status==='lowstock';
    return `<div class="stock-block">
      <div class="stock-labels"><span>Stock Level</span><span>${p.stock} ${p.unit} / ${p.capacity} ${p.unit}</span></div>
      <div class="stock-bar"><div class="stock-bar-fill ${warn?'warning':''}" style="width:${pct}%"></div></div>
    </div>`;
  }

  function cardHTML(p){
    const sm = statusMeta[p.status];
    return `
    <div class="product-card" data-id="${p.id}">
      <div class="product-media" data-fallback='${placeholderHTML().replace(/'/g,"&apos;")}'>
        ${productMedia(p)}
        <span class="status-badge ${sm.badge}">${sm.label}</span>
      </div>
      <div class="product-body">
        <h4 class="product-name">${p.name}</h4>
        <p class="product-meta">${p.category} • ${p.stock} ${p.unit} available</p>
        <p class="product-price">₹${p.price} <span>/ ${p.unit}</span></p>
        <div class="product-stats">
          <span>Stock <b>${p.stock}${p.unit}</b></span>
          <span class="stat-sep">|</span>
          <span>Views <b>${p.views}</b></span>
          <span class="stat-sep">|</span>
          <span>Orders <b>${p.orders}</b></span>
        </div>
        ${stockBarHTML(p)}
      </div>
      <div class="product-actions">
        <button class="act-btn act-edit" data-action="edit" data-id="${p.id}">Edit</button>
        <button class="act-btn act-view" data-action="view" data-id="${p.id}">View</button>
        <div class="more-wrap">
          <button class="more-btn" data-action="toggle-menu" data-id="${p.id}" aria-label="More options">⋮</button>
          <div class="more-menu" id="menu-${p.id}">
            <button data-action="edit" data-id="${p.id}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>Edit Product</button>
            <button data-action="duplicate" data-id="${p.id}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Duplicate Listing</button>
            <button data-action="mark-soldout" data-id="${p.id}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>Mark as Sold Out</button>
            <button class="danger" data-action="delete" data-id="${p.id}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>Delete Product</button>
          </div>
        </div>
      </div>
    </div>`;
  }

  function skeletonHTML(){
    let out = "";
    for(let i=0;i<6;i++){
      out += `<div class="skeleton-card">
        <div class="sk-media"></div>
        <div class="sk-body">
          <div class="sk-line w60"></div>
          <div class="sk-line w40"></div>
          <div class="sk-line w80"></div>
        </div>
        <div class="sk-actions"><div class="sk-btn"></div><div class="sk-btn"></div><div class="sk-btn"></div></div>
      </div>`;
    }
    return out;
  }

  function emptyHTML(){
    return `<div class="empty-state">
      <div class="empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
      </div>
      <h3>No products listed yet</h3>
      <p>Start selling your farm produce by adding your first product.</p>
      <button class="btn-sell" id="emptyAddBtn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add Your First Product
      </button>
    </div>`;
  }

  function render(){
    updateSummary();

    if(state.mode === 'loading'){
      grid.innerHTML = skeletonHTML();
      paginationInfo.textContent = "";
      paginationControls.innerHTML = "";
      return;
    }
    if(state.mode === 'empty' || products.length === 0){
      grid.innerHTML = emptyHTML();
      paginationInfo.textContent = "";
      paginationControls.innerHTML = "";
      const btn = document.getElementById('emptyAddBtn');
      if(btn) btn.addEventListener('click', openAddModal);
      return;
    }

    const filtered = getFiltered();
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total/state.perPage));
    state.page = Math.min(state.page, totalPages);
    const startIdx = (state.page-1)*state.perPage;
    const pageItems = filtered.slice(startIdx, startIdx+state.perPage);

    if(pageItems.length === 0){
      grid.innerHTML = `<div class="empty-state">
        <div class="empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
        <h3>No matching products</h3>
        <p>Try adjusting your search or filters.</p>
      </div>`;
    } else {
      grid.innerHTML = pageItems.map(cardHTML).join("");
    }

    const from = total===0 ? 0 : startIdx+1;
    const to = Math.min(startIdx+state.perPage, total);
    paginationInfo.textContent = `Showing ${from}–${to} of ${total} products`;

    let pagesHTML = `<button class="page-btn" data-page="prev" ${state.page===1?'disabled':''}>Previous</button>`;
    for(let i=1;i<=totalPages;i++){
      pagesHTML += `<button class="page-btn ${i===state.page?'active':''}" data-page="${i}">${i}</button>`;
    }
    pagesHTML += `<button class="page-btn" data-page="next" ${state.page===totalPages?'disabled':''}>Next</button>`;
    paginationControls.innerHTML = pagesHTML;
  }

  /* ---------------- events: toolbar ---------------- */
  document.getElementById('searchInput').addEventListener('input', e=>{ state.search = e.target.value; state.page=1; render(); });
  document.getElementById('categoryFilter').addEventListener('change', e=>{ state.category = e.target.value; state.page=1; render(); });
  document.getElementById('statusFilter').addEventListener('change', e=>{ state.status = e.target.value; state.page=1; render(); });
  document.getElementById('sortFilter').addEventListener('change', e=>{ state.sort = e.target.value; render(); });

  paginationControls.addEventListener('click', e=>{
    const btn = e.target.closest('.page-btn');
    if(!btn || btn.disabled) return;
    const p = btn.dataset.page;
    if(p==='prev') state.page = Math.max(1, state.page-1);
    else if(p==='next') state.page = state.page+1;
    else state.page = parseInt(p,10);
    render();
    document.querySelector('.products-section').scrollIntoView({behavior:'smooth', block:'start'});
  });

  /* ---------------- events: grid actions (delegated) ---------------- */
  grid.addEventListener('click', e=>{
    const menuToggle = e.target.closest('[data-action="toggle-menu"]');
    if(menuToggle){
      const id = menuToggle.dataset.id;
      document.querySelectorAll('.more-menu.open').forEach(m=>{ if(m.id!== 'menu-'+id) m.classList.remove('open'); });
      document.getElementById('menu-'+id).classList.toggle('open');
      return;
    }
    const actionBtn = e.target.closest('[data-action]');
    if(!actionBtn) return;
    const action = actionBtn.dataset.action;
    const id = actionBtn.dataset.id;
    document.querySelectorAll('.more-menu.open').forEach(m=>m.classList.remove('open'));

    if(action==='edit') openEditModal(id);
    else if(action==='view') openViewModal(id);
    else if(action==='delete') openDeleteModal(id);
    else if(action==='duplicate') duplicateProduct(id);
    else if(action==='mark-soldout') markSoldOut(id);
  });

  document.addEventListener('click', e=>{
    if(!e.target.closest('.more-wrap')){
      document.querySelectorAll('.more-menu.open').forEach(m=>m.classList.remove('open'));
    }
  });

  function duplicateProduct(id){
    const p = products.find(x=>x.id===id);
    if(!p) return;
    const copy = {...p, id: Date.now(), name: p.name + " (Copy)", createdAt: Date.now(), views:0, orders:0};
    products.unshift(copy);
    render();
    showToast("Listing duplicated");
  }
  function markSoldOut(id){
    const p = products.find(x=>x.id===id);
    if(!p) return;
    p.status = 'soldout'; p.stock = 0;
    render();
    showToast(`${p.name} marked as sold out`);
  }

  /* ---------------- Add / Edit modal ---------------- */
  const productModalOverlay = document.getElementById('productModalOverlay');
  const productModalTitle = document.getElementById('productModalTitle');
  const productForm = document.getElementById('productForm');

  function openAddModal(){
    window.location.href = '/farmerProduct';
  }
  function openEditModal(id){
    const p = products.find(x=>x.id===id);
    if(!p) return;
    state.editingId = id;
    productModalTitle.textContent = "Edit Product";
    document.getElementById('fProductName').value = p.name;
    document.getElementById('fCategory').value = p.category;
    document.getElementById('fStatus').value = p.status;
    document.getElementById('fPrice').value = p.price;
    document.getElementById('fUnit').value = p.unit;
    document.getElementById('fStock').value = p.stock;
    document.getElementById('fCapacity').value = p.capacity;
    document.getElementById('fImage').value = p.image || "";
    productModalOverlay.classList.add('open');
  }
  function closeProductModal(){ productModalOverlay.classList.remove('open'); }

  document.getElementById('productModalClose').addEventListener('click', closeProductModal);
  document.getElementById('productCancelBtn').addEventListener('click', closeProductModal);
  productModalOverlay.addEventListener('click', e=>{ if(e.target===productModalOverlay) closeProductModal(); });

  document.getElementById('productSaveBtn').addEventListener('click', async ()=>{
    if(!productForm.reportValidity()) return;
    const data = {
      name: document.getElementById('fProductName').value.trim(),
      category: document.getElementById('fCategory').value,
      status: document.getElementById('fStatus').value,
      price: parseFloat(document.getElementById('fPrice').value)||0,
      unit: document.getElementById('fUnit').value,
      stock: parseInt(document.getElementById('fStock').value,10)||0,
      capacity: parseInt(document.getElementById('fCapacity').value,10)||1,
      image: document.getElementById('fImage').value.trim()
    };
    if(data.stock<=0 && data.status!=='draft') data.status='soldout';

    if(!state.editingId){
      window.location.href = '/farmerProduct';
      return;
    }

    const formData = new FormData();
    formData.append('productDesc', data.name);
    formData.append('productQuantity', data.stock);
    formData.append('productPrice', data.price);
    try {
      const response = await fetch(editEndpoint(state.editingId), {
        method: 'PATCH', credentials: 'include', body: formData
      });
      const result = await response.json().catch(() => ({}));
      if(!response.ok || !result.success) throw new Error(result.message || 'Product update failed');
      closeProductModal();
      showToast(result.message || 'Product updated');
      await loadProducts();
    } catch(error) {
      showToast(error.message);
    }
  });

  /* ---------------- View modal ---------------- */
  const viewModalOverlay = document.getElementById('viewModalOverlay');
  const viewModalBody = document.getElementById('viewModalBody');
  let viewingId = null;

  function openViewModal(id){
    const p = products.find(x=>x.id===id);
    if(!p) return;
    viewingId = id;
    const sm = statusMeta[p.status];
    viewModalBody.innerHTML = `
      <div class="product-media" style="border-radius:var(--radius-md); margin-bottom:16px;">
        ${productMedia(p)}
        <span class="status-badge ${sm.badge}">${sm.label}</span>
      </div>
      <h3 style="margin:0 0 4px;">${p.name}</h3>
      <p style="margin:0 0 14px; color:var(--muted); font-size:13.5px;">${p.category}</p>
      <div class="view-detail-row"><span>Price</span><span>₹${p.price} / ${p.unit}</span></div>
      <div class="view-detail-row"><span>Current Stock</span><span>${p.stock} ${p.unit}</span></div>
      <div class="view-detail-row"><span>Max Capacity</span><span>${p.capacity} ${p.unit}</span></div>
      <div class="view-detail-row"><span>Views</span><span>${p.views}</span></div>
      <div class="view-detail-row"><span>Orders</span><span>${p.orders}</span></div>
    `;
    viewModalOverlay.classList.add('open');
  }
  document.getElementById('viewModalClose').addEventListener('click', ()=>viewModalOverlay.classList.remove('open'));
  document.getElementById('viewCloseBtn').addEventListener('click', ()=>viewModalOverlay.classList.remove('open'));
  document.getElementById('viewEditBtn').addEventListener('click', ()=>{
    viewModalOverlay.classList.remove('open');
    if(viewingId) openEditModal(viewingId);
  });
  viewModalOverlay.addEventListener('click', e=>{ if(e.target===viewModalOverlay) viewModalOverlay.classList.remove('open'); });

  /* ---------------- Delete modal ---------------- */
  const deleteModalOverlay = document.getElementById('deleteModalOverlay');
  const deleteProductName = document.getElementById('deleteProductName');

  function openDeleteModal(id){
    state.pendingDeleteId = id;
    const p = products.find(x=>x.id===id);
    deleteProductName.textContent = p ? `“${p.name}” will be permanently removed from your listings.` : "This action cannot be undone.";
    deleteModalOverlay.classList.add('open');
  }
  document.getElementById('deleteCancelBtn').addEventListener('click', ()=>deleteModalOverlay.classList.remove('open'));
  deleteModalOverlay.addEventListener('click', e=>{ if(e.target===deleteModalOverlay) deleteModalOverlay.classList.remove('open'); });
  document.getElementById('deleteConfirmBtn').addEventListener('click', async ()=>{
    const id = state.pendingDeleteId;
    if(!id) return;
    try {
      const response = await fetch(deleteEndpoint(id), { method: 'DELETE', credentials: 'include' });
      const result = await response.json().catch(() => ({}));
      if(!response.ok || !result.success) throw new Error(result.message || 'Product deletion failed');
      deleteModalOverlay.classList.remove('open');
      showToast(result.message || 'Product deleted');
      await loadProducts();
    } catch(error) {
      showToast(error.message);
    }
  });

  /* ---------------- demo state toggles ---------------- */
  document.querySelectorAll('.dev-toggle button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.dev-toggle button').forEach(b=>b.classList.remove('on'));
      btn.classList.add('on');
      state.mode = btn.dataset.demo;
      render();
    });
  });

  /* ---------------- sidebar mobile ---------------- */
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  document.getElementById('hamburgerBtn').addEventListener('click', ()=>{
    sidebar.classList.add('open'); overlay.classList.add('open');
  });
  overlay.addEventListener('click', ()=>{
    sidebar.classList.remove('open'); overlay.classList.remove('open');
  });

  /* ---------------- keyboard: Esc closes modals ---------------- */
  document.addEventListener('keydown', e=>{
    if(e.key==='Escape'){
      closeProductModal();
      viewModalOverlay.classList.remove('open');
      deleteModalOverlay.classList.remove('open');
    }
  });

  loadProducts();
})();
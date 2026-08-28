/* =========================================================================
   NAVBAR REDESIGN — append this block to dash.js.
   Nothing here touches existing auth, cart, search, or routing logic.
   It only wires up the new hamburger drawer and category active-state,
   plus exposes two small helpers your existing code can call:
     - updateLoginState(isLoggedIn, name)
     - updateCartCount(count)
   ========================================================================= */

(function () {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const closeDrawerBtn = document.getElementById('closeDrawer');

  function openDrawer() {
    if (!drawer || !overlay || !hamburgerBtn) return;
    drawer.classList.add('open');
    overlay.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!drawer || !overlay || !hamburgerBtn) return;
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // ---- Category active-state (visual only; does not change any routing) ----
  document.querySelectorAll('.cat-link[data-cat]').forEach((link) => {
    link.addEventListener('click', function () {
      document.querySelectorAll('.cat-link').forEach((el) => el.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // ---- Helper: call this from your existing auth check on page load ----
  // Example: if (userIsLoggedIn) updateLoginState(true, user.firstName);
  window.updateLoginState = function (isLoggedIn, name) {
    const loginBtn = document.getElementById('loginBtn');
    const loginLabel = document.getElementById('loginLabel');
    if (!loginBtn || !loginLabel) return;
    if (isLoggedIn) {
      loginBtn.classList.add('is-logged-in');
      loginLabel.textContent = name ? name.split(' ')[0] : 'Account';
      loginBtn.setAttribute('aria-label', 'View your account');
      loginBtn.setAttribute('title', 'Account');
      // loginBtn.href stays "/dash/register" unless your app has a
      // separate "/dash/account" route — update this line if so:
      // loginBtn.href = '/dash/account';
    } else {
      loginBtn.classList.remove('is-logged-in');
      loginLabel.textContent = 'Login';
      loginBtn.setAttribute('aria-label', 'Login or sign up');
      loginBtn.setAttribute('title', 'Login');
    }
  };

  // ---- Helper: call this wherever your existing cart logic updates count ----
  // Example: updateCartCount(cartItems.length);
  window.updateCartCount = function (count) {
    const el = document.getElementById('cartCount');
    if (!el) return;
    el.textContent = count > 99 ? '99+' : String(count);
    const cartLink = document.getElementById('cartLink');
    if (cartLink) cartLink.setAttribute('aria-label', `View cart, ${count} items`);
  };
})();
/* REVOGUE - shared navbar behaviour: mobile toggle, active link, auth-aware nav slot */

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }

  const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-links a[data-page]').forEach(a => {
    if (a.dataset.page === page) a.classList.add('active');
  });

  const slot = document.getElementById('navAuthSlot');
  if (slot) {
    const user = Store.getCurrentUser();
    if (user) {
      slot.innerHTML = `
        <a href="dashboard.html" class="btn btn-outline" style="padding:9px 20px;">My Closet</a>
        <button id="navLogoutBtn" class="btn btn-primary" style="padding:9px 20px;">Log out</button>
      `;
      document.getElementById('navLogoutBtn').addEventListener('click', () => {
        Store.clearSession();
        location.href = 'index.html';
      });
    } else {
      slot.innerHTML = `<a href="login.html" class="btn btn-primary" style="padding:9px 20px;">Login / Sign Up</a>`;
    }
  }
});

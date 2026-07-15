/* REVOGUE - login / signup logic. Demo-only auth: no backend, credentials live in this browser's localStorage. */

document.addEventListener('DOMContentLoaded', () => {
  if (Store.getCurrentUser()) {
    location.href = 'dashboard.html';
    return;
  }

  const tabLogin = document.getElementById('tabLogin');
  const tabSignup = document.getElementById('tabSignup');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const errorBox = document.getElementById('loginError');

  function showLogin() {
    tabLogin.classList.add('active');
    tabSignup.classList.remove('active');
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
    hideError();
  }

  function showSignup() {
    tabSignup.classList.add('active');
    tabLogin.classList.remove('active');
    signupForm.style.display = 'block';
    loginForm.style.display = 'none';
    hideError();
  }

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.classList.add('show');
  }

  function hideError() {
    errorBox.classList.remove('show');
  }

  tabLogin.addEventListener('click', showLogin);
  tabSignup.addEventListener('click', showSignup);
  document.getElementById('goSignup').addEventListener('click', (e) => { e.preventDefault(); showSignup(); });
  document.getElementById('goLogin').addEventListener('click', (e) => { e.preventDefault(); showLogin(); });

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const user = Store.findUserByEmail(email);
    if (!user || user.password !== password) {
      showError('No matching account found. Check your email and password, or sign up.');
      return;
    }
    Store.setSession(user.id);
    location.href = 'dashboard.html';
  });

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const age = parseInt(document.getElementById('signupAge').value, 10);
    const locationCity = document.getElementById('signupLocation').value.trim();

    if (Store.findUserByEmail(email)) {
      showError('An account with this email already exists. Try logging in instead.');
      showLogin();
      return;
    }

    const user = Store.createUser({ name, email, password, age, location: locationCity });
    Store.setSession(user.id);
    location.href = 'dashboard.html';
  });
});

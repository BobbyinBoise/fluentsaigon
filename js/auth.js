// ── AUTH & SUBSCRIPTION SYSTEM ──────────────────────────────────────────────
// Real Netlify Identity auth — custom UI only, widget UI suppressed

const Auth = {
  getUser() {
    try {
      const ni = window.netlifyIdentity;
      return ni ? ni.currentUser() : null;
    } catch { return null; }
  },

  isLoggedIn() { return !!this.getUser(); },

  isPro() {
    const user = this.getUser();
    if (!user) return false;
    const roles = user.app_metadata?.roles || [];
    return roles.includes('pro');
  },

  getUserDisplayName() {
    const user = this.getUser();
    if (!user) return null;
    return user.user_metadata?.full_name ||
           user.user_metadata?.name ||
           user.email.split('@')[0];
  },

  async login(email, password) {
    const response = await fetch('https://fluentsaigon.com/.netlify/identity/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'grant_type=password&username=' + encodeURIComponent(email) + '&password=' + encodeURIComponent(password)
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error_description || 'Login failed');
    }
    const data = await response.json();
    localStorage.setItem('gotrue.user', JSON.stringify(data));
    return data;
  },

  async signup(email, password, name) {
    const response = await fetch('https://fluentsaigon.com/.netlify/identity/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, data: { full_name: name } })
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.msg || 'Signup failed');
    }
    return response.json();
  },

  logout() {
    const ni = window.netlifyIdentity;
    if (ni) ni.logout();
  },

  loginWithGoogle() {
    window.location.href = 'https://fluentsaigon.com/.netlify/identity/authorize?provider=google';
  },

  upgradeToPro() {
    if (!this.isLoggedIn()) {
      AuthModal.open('signup');
      return;
    }
    window.location.href = '/pages/pricing.html';
  }
};

// ── AUTH MODAL ───────────────────────────────────────────────────────────────
const AuthModal = {
  open(mode = 'login') {
    const backdrop = document.getElementById('authModal');
    if (!backdrop) return;
    backdrop.classList.add('open');
    this.setMode(mode);
  },

  setMode(mode) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const title = document.getElementById('modalTitle');
    if (mode === 'signup') {
      if (loginForm) loginForm.style.display = 'none';
      if (signupForm) signupForm.style.display = '';
      if (title) title.textContent = 'Create Account';
    } else {
      if (loginForm) loginForm.style.display = '';
      if (signupForm) signupForm.style.display = 'none';
      if (title) title.textContent = 'Welcome Back';
    }
  },

  async forgotPassword() {
    const email = document.getElementById('loginEmail').value.trim();
    if (!email) {
      showToast('Enter your email address first, then click Forgot password.', 'error');
      return;
    }
    try {
      const response = await fetch('https://fluentsaigon.com/.netlify/identity/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!response.ok) throw new Error('Request failed');
      AuthModal.close();
      showToast('Password reset email sent! Check your inbox.', 'info');
    } catch (err) {
      console.error('forgotPassword failed:', err);
      showToast('Could not send reset email. Make sure that address has an account.', 'error');
    }
  },

  close() {
    const backdrop = document.getElementById('authModal');
    if (backdrop) backdrop.classList.remove('open');
  },

  async handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const btn = e.target.querySelector('button[type=submit]');
    btn.textContent = 'Signing in...';
    btn.disabled = true;
    try {
      await Auth.login(email, password);
      AuthModal.close();
      updateNavForUser();
      showToast('Welcome back!');
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
      btn.textContent = 'Sign In';
      btn.disabled = false;
    }
  },

  async handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const btn = e.target.querySelector('button[type=submit]');
    btn.textContent = 'Creating account...';
    btn.disabled = true;
    try {
      await Auth.signup(email, password, name);
      AuthModal.close();
      showToast('Almost there! Check your email to confirm.', 'info');
      btn.textContent = 'Create Free Account';
      btn.disabled = false;
    } catch (err) {
      showToast(err.message || 'Signup failed', 'error');
      btn.textContent = 'Create Free Account';
      btn.disabled = false;
    }
  }
};

// ── PAYWALL ──────────────────────────────────────────────────────────────────
function checkPaywall(difficulty) {
  if (difficulty === 'beginner') return false;
  if (Auth.isPro()) return false;
  return true;
}

function showPaywall() {
  const pw = document.getElementById('paywallOverlay');
  if (pw) pw.style.display = 'flex';
}

function hidePaywall() {
  const pw = document.getElementById('paywallOverlay');
  if (pw) pw.style.display = 'none';
}

// ── NAV STATE ────────────────────────────────────────────────────────────────
function updateNavForUser() {
  const user = Auth.getUser();
  const navSignIn = document.getElementById('navSignIn');
  const navCta = document.getElementById('navCta');
  const navUser = document.getElementById('navUser');
  const navLogout = document.getElementById('navLogout');

  if (user) {
    if (navSignIn) navSignIn.style.display = 'none';
    if (navCta) navCta.style.display = 'none';
    if (navUser) {
      navUser.style.display = 'flex';
      const nameEl = document.getElementById('navUserName');
      if (nameEl) nameEl.textContent = Auth.getUserDisplayName();
      const planEl = document.getElementById('navUserPlan');
      if (planEl) planEl.textContent = Auth.isPro() ? 'PRO' : 'Free';
    }
    if (navLogout) navLogout.style.display = 'list-item';
  } else {
    if (navSignIn) navSignIn.style.display = 'list-item';
    if (navCta) navCta.style.display = 'list-item';
    if (navUser) navUser.style.display = 'none';
    if (navLogout) navLogout.style.display = 'none';
  }
}

// ── TOAST ────────────────────────────────────────────────────────────────────
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  const bg = type === 'error' ? '#e74c3c' : type === 'info' ? '#3498db' : '#2ecc71';
  toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:' + bg + ';color:white;padding:12px 24px;border-radius:50px;font-family:var(--font-body);font-weight:700;font-size:0.9rem;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,0.3);';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ── NAV HAMBURGER ────────────────────────────────────────────────────────────
function initNav() {
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  }
  updateNavForUser();
}

// ── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const ni = window.netlifyIdentity;

  if (ni) {
    ni.on('init', (user) => {
      ni.close();
      initNav();
      if (window.location.hash.includes('access_token')) {
        updateNavForUser();
        showToast('Welcome!');
        history.replaceState(null, '', window.location.pathname);
      }
    });

    ni.on('login', (user) => {
      ni.close();
      updateNavForUser();
      showToast('Welcome back, ' + Auth.getUserDisplayName() + '!');
    });

    ni.on('logout', () => {
      updateNavForUser();
      showToast('You have been logged out.', 'info');
      window.location.href = '/index.html';
    });

    ni.on('error', (err) => {
      showToast(err.message || 'Something went wrong', 'error');
    });

    ni.init({ container: '#modal-placeholder' });
  } else {
    initNav();
  }

  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  if (loginForm) loginForm.addEventListener('submit', AuthModal.handleLogin);
  if (signupForm) signupForm.addEventListener('submit', AuthModal.handleSignup);

  const backdrop = document.getElementById('authModal');
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) AuthModal.close();
    });
  }
});

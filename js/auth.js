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
    const ni = window.netlifyIdentity;
    if (!ni) throw new Error('Auth not loaded');
    return new Promise((resolve, reject) => {
      ni.login(email, password)
        .then(resolve)
        .catch(reject);
    });
  },

  async signup(email, password, name) {
    const ni = window.netlifyIdentity;
    if (!ni) throw new Error('Auth not loaded');
    return ni.signup(email, password, { full_name: name });
  },

  logout() {
    const ni = window.netlifyIdentity;
    if (ni) {
      ni.logout();
    }
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

  close() {
    const backdrop = document.getElementById('authModal');
    if (backdrop) backdrop.classList.remove('open');
  },

  setMode(mode) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const modalTitle = document.getElementById('modalTitle');
    const modalSub = document.getElementById('modalSub');
    if (!loginForm) return;
    if (mode === 'login') {
      loginForm.style.display = 'block';
      signupForm.style.display = 'none';
      modalTitle.textContent = 'Welcome Back';
      modalSub.textContent = 'Sign in to continue your Vietnamese journey';
    } else {
      loginForm.style.display = 'none';
      signupForm.style.display = 'block';
      modalTitle.textContent = 'Start Learning Free';
      modalSub.textContent = '7-day Pro trial included — no charge until day 8';
    }
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
      showToast('Welcome back! 👋');
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
      showToast('Almost there! Check your email to confirm 📧', 'info');
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
      if (planEl) planEl.textContent = Auth.isPro() ? '⭐ PRO' : 'Free';
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
  toast.style.cssText = `
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    background: ${bg}; color: white; padding: 12px 24px; border-radius: 50px;
    font-family: var(--font-body); font-weight: 700; font-size: 0.9rem;
    z-index: 9999; box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    animation: fadeUp 0.3s ease;
  `;
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
    // Suppress the default Netlify widget UI entirely
    ni.on('init', (user) => {
      // Close any widget popup immediately
      ni.close();
      initNav();
      // Handle OAuth callback — clean up hash from URL
      if (window.location.hash.includes('access_token')) {
        updateNavForUser();
        showToast('Welcome! 🎉');
        history.replaceState(null, '', window.location.pathname);
      }
    });

    ni.on('login', (user) => {
      ni.close();
      updateNavForUser();
      showToast('Welcome back, ' + Auth.getUserDisplayName() + '! 👋');
    });

    ni.on('logout', () => {
      updateNavForUser();
      showToast('You\'ve been logged out.', 'info');
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
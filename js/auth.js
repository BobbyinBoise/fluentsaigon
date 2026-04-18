// ── AUTH & SUBSCRIPTION SYSTEM ──────────────────────────────────────────────
// Real Netlify Identity auth — replaces localStorage simulation

const Auth = {
  getUser() {
    const netlifyIdentity = window.netlifyIdentity;
    if (!netlifyIdentity) return null;
    return netlifyIdentity.currentUser();
  },

  isLoggedIn() {
    return !!this.getUser();
  },

  isPro() {
    const user = this.getUser();
    if (!user) return false;
    const roles = user.app_metadata?.roles || [];
    return roles.includes('pro');
  },

  getUserDisplayName() {
    const user = this.getUser();
    if (!user) return null;
    return user.user_metadata?.full_name || user.email.split('@')[0];
  },

  getUserPlan() {
    return this.isPro() ? 'pro' : 'free';
  },

  login(email, password) {
    return new Promise((resolve, reject) => {
      const netlifyIdentity = window.netlifyIdentity;
      if (!netlifyIdentity) return reject(new Error('Auth not loaded'));
      netlifyIdentity.open('login');
      resolve();
    });
  },

  signup(email, password, name) {
    return new Promise((resolve, reject) => {
      const netlifyIdentity = window.netlifyIdentity;
      if (!netlifyIdentity) return reject(new Error('Auth not loaded'));
      netlifyIdentity.open('signup');
      resolve();
    });
  },

  logout() {
    const netlifyIdentity = window.netlifyIdentity;
    if (netlifyIdentity) {
      netlifyIdentity.logout();
    }
  },

  loginWithGoogle() {
    const netlifyIdentity = window.netlifyIdentity;
    if (!netlifyIdentity) {
      showToast('Auth not loaded', 'error');
      return;
    }
    netlifyIdentity.open('login');
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
    const netlifyIdentity = window.netlifyIdentity;
    if (netlifyIdentity) {
      netlifyIdentity.open(mode === 'signup' ? 'signup' : 'login');
    }
  },

  close() {
    const netlifyIdentity = window.netlifyIdentity;
    if (netlifyIdentity) netlifyIdentity.close();
  },

  setMode(mode) {
    this.open(mode);
  },

  handleLogin(e) {
    if (e) e.preventDefault();
    AuthModal.open('login');
  },

  handleSignup(e) {
    if (e) e.preventDefault();
    AuthModal.open('signup');
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

// ── NETLIFY IDENTITY INIT ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNav();

  const netlifyIdentity = window.netlifyIdentity;
  if (!netlifyIdentity) {
    console.warn('Netlify Identity not loaded');
    return;
  }

  // Init
  netlifyIdentity.init();

  // After login
  netlifyIdentity.on('login', (user) => {
    netlifyIdentity.close();
    updateNavForUser();
    const name = Auth.getUserDisplayName();
    showToast('Welcome back, ' + name + '! 👋');
  });

  // After signup
  netlifyIdentity.on('init', (user) => {
    updateNavForUser();
  });

  // After logout
  netlifyIdentity.on('logout', () => {
    updateNavForUser();
    showToast('You\'ve been logged out.', 'info');
    window.location.href = '/index.html';
  });

  // Handle email confirmation redirects
  if (window.location.hash && window.location.hash.includes('confirmation_token')) {
    netlifyIdentity.on('init', () => netlifyIdentity.open());
  }
});
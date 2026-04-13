// FluentSaigon Auth — Powered by Netlify Identity
// Real accounts, real passwords, real forgot password emails

const Auth = {
  adminEmails: ['helpmegrowquestion@gmail.com'],

  getUser() {
    if (typeof netlifyIdentity === 'undefined') return null;
    return netlifyIdentity.currentUser();
  },

  isLoggedIn() { return !!this.getUser(); },

  isPro() {
    const user = this.getUser();
    if (!user) return false;
    if (this.adminEmails.includes(user.email)) return true;
    const meta = user.app_metadata || {};
    return meta.plan === 'pro' || (meta.roles && meta.roles.includes('pro'));
  },

  getName() {
    const user = this.getUser();
    if (!user) return '';
    return (user.user_metadata && user.user_metadata.full_name) || user.email.split('@')[0];
  },

  getEmail() {
    const user = this.getUser();
    return user ? user.email : '';
  },

  logout() {
    if (typeof netlifyIdentity !== 'undefined') netlifyIdentity.logout();
  },

  upgradeToPro() {
    window.location.href = '/pages/pricing.html';
  }
};

function checkPaywall(difficulty) {
  if (difficulty === 'beginner') return false;
  if (Auth.isPro()) return false;
  return true;
}

function showPaywall(subject, from) {
  const s = subject || 'pro';
  const f = from || window.location.pathname.split('/').pop().replace('.html', '');
  window.location.href = '/pages/upgrade.html?subject=' + s + '&from=' + f;
}

function hidePaywall() {
  const pw = document.getElementById('paywallOverlay');
  if (pw) pw.style.display = 'none';
}

function updateNavForUser() {
  const user = Auth.getUser();
  const navCta = document.getElementById('navCta');
  const navSignIn = document.getElementById('navSignIn');
  const navUser = document.getElementById('navUser');
  if (!navCta) return;
  if (user) {
    navCta.style.display = 'none';
    if (navSignIn) navSignIn.style.display = 'none';
    if (navUser) {
      navUser.style.display = 'flex';
      const nameEl = document.getElementById('navUserName');
      if (nameEl) nameEl.textContent = Auth.getName();
      const planEl = document.getElementById('navUserPlan');
      if (planEl) planEl.textContent = Auth.isPro() ? '⭐ PRO' : 'Free';
    }
  } else {
    navCta.style.display = 'inline-flex';
    if (navSignIn) navSignIn.style.display = 'flex';
    if (navUser) navUser.style.display = 'none';
  }
}

function showToast(message, type) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:' + (type === 'error' ? '#e74c3c' : '#2ecc71') + ';color:white;padding:12px 24px;border-radius:50px;font-family:var(--font-body);font-weight:700;font-size:0.9rem;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,0.3);white-space:nowrap;';
  document.body.appendChild(toast);
  setTimeout(function() { toast.remove(); }, 3500);
}

document.addEventListener('DOMContentLoaded', function() {
  if (typeof netlifyIdentity === 'undefined') {
    console.warn('Netlify Identity not loaded');
    return;
  }

  netlifyIdentity.on('login', function(user) {
    netlifyIdentity.close();
    updateNavForUser();
    showToast('Welcome back, ' + Auth.getName() + '! 👋');
    var pending = localStorage.getItem('pending_checkout');
    if (pending) {
      localStorage.removeItem('pending_checkout');
      window.location.href = '/.netlify/functions/create-checkout?plan=' + pending + '&email=' + encodeURIComponent(user.email);
    }
  });

  netlifyIdentity.on('signup', function(user) {
    netlifyIdentity.close();
    updateNavForUser();
    showToast('Account created! Check your email to confirm 🎉');
  });

  netlifyIdentity.on('logout', function() {
    updateNavForUser();
    var protectedPages = ['account.html'];
    var currentPage = window.location.pathname.split('/').pop();
    if (protectedPages.includes(currentPage)) {
      window.location.href = '/index.html';
    }
  });

  netlifyIdentity.on('init', function() {
    updateNavForUser();
  });

  netlifyIdentity.init();
});

var AuthModal = {
  open: function(mode) {
    if (typeof netlifyIdentity !== 'undefined') {
      netlifyIdentity.open(mode === 'signup' ? 'signup' : 'login');
    }
  },
  close: function() {
    if (typeof netlifyIdentity !== 'undefined') netlifyIdentity.close();
  }
};

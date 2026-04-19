// Shared HTML components injected into every page

function getNav(activePage = '') {
  return `
<nav>
  <a class="nav-logo" href="/index.html">🇻🇳 <span>Fluent</span>Saigon</a>
  <ul class="nav-links" id="navLinks">
    <li><a href="/index.html" ${activePage==='home'?'class="active"':''}>Home</a></li>
    <li><a href="/pages/subjects.html" ${activePage==='subjects'?'class="active"':''}>Subjects</a></li>
    <li><a href="/pages/pricing.html" ${activePage==='pricing'?'class="active"':''}>Pricing</a></li>
    <li><a href="/pages/about.html" ${activePage==='about'?'class="active"':''}>About</a></li>
    <li id="navSignIn"><a href="#" onclick="AuthModal.open('login'); return false;" style="color:rgba(255,255,255,0.65);">Sign In</a></li>
    <li id="navCta"><a href="#" class="nav-cta btn" onclick="AuthModal.open('signup'); return false;">Start Free</a></li>
    <li id="navUser" style="display:none">
      <a href="/pages/account.html" style="display:flex;align-items:center;gap:6px;">
        <span id="navUserName"></span>
        <span id="navUserPlan" style="font-size:0.65rem;color:var(--gold);"></span>
      </a>
    </li>
    <li id="navLogout" style="display:none">
      <a href="#" onclick="Auth.logout(); return false;" style="color:rgba(255,255,255,0.45);font-size:0.85rem;">Log Out</a>
    </li>
  </ul>
  <button class="nav-hamburger" aria-label="Menu">☰</button>
</nav>`;
}

function getAuthModal() {
  return `
<div class="modal-backdrop" id="authModal">
  <div class="modal">
    <button class="modal-close" onclick="AuthModal.close()">✕</button>
    <h2 id="modalTitle">Welcome Back</h2>
    <p id="modalSub">Sign in to continue your Vietnamese journey</p>

    <!-- Social login buttons -->
    <div id="socialButtons" style="display:flex;flex-direction:column;gap:10px;margin-bottom:16px;">
      <button type="button" class="btn" onclick="Auth.loginWithGoogle()" style="width:100%;justify-content:center;background:white;color:#333;border:1px solid #ddd;gap:10px;">
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" style="width:18px;height:18px;" alt="Google">
        Continue with Google
      </button>
    </div>

    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
      <div style="flex:1;height:1px;background:rgba(255,255,255,0.15);"></div>
      <span style="font-size:0.75rem;color:rgba(255,255,255,0.35);">or</span>
      <div style="flex:1;height:1px;background:rgba(255,255,255,0.15);"></div>
    </div>

    <form id="loginForm" onsubmit="AuthModal.handleLogin(event)">
      <div class="form-group">
        <label>Email</label>
        <input type="email" id="loginEmail" placeholder="you@example.com" required>
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" id="loginPassword" placeholder="••••••••" required>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;">Sign In</button>
      <div style="text-align:center;margin-top:14px;margin-bottom:16px;">
        <a href="#" id="forgotPasswordLink" onclick="AuthModal.forgotPassword();return false;" style="font-size:0.85rem;color:rgba(255,255,255,0.75);text-decoration:underline;">Forgot password?</a>
      </div>
      <div class="form-switch">Don't have an account? <a href="#" onclick="AuthModal.setMode('signup');return false;">Sign up free</a></div>
    </form>

    <form id="signupForm" style="display:none" onsubmit="AuthModal.handleSignup(event)">
      <div class="form-group">
        <label>Your Name</label>
        <input type="text" id="signupName" placeholder="Bobby" required>
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" id="signupEmail" placeholder="you@example.com" required>
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" id="signupPassword" placeholder="6+ characters" required>
      </div>
      <div class="form-group" style="display:flex;align-items:flex-start;gap:10px;">
        <input type="checkbox" id="signupTrial" style="margin-top:3px;flex-shrink:0;" checked>
        <label for="signupTrial" style="font-size:0.8rem;color:rgba(255,255,255,0.6);cursor:pointer;">
          Start my 7-day free Pro trial — credit card required after trial ends
        </label>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;">Create Free Account</button>
      <div class="form-switch">Already have an account? <a href="#" onclick="AuthModal.setMode('login');return false;">Sign in</a></div>
    </form>

    <form id="resetForm" style="display:none" onsubmit="AuthModal.handleResetPassword(event)">
      <p style="font-size:0.85rem;color:rgba(255,255,255,0.6);margin-bottom:20px;line-height:1.5;">Choose a new password for your account.</p>
      <div class="form-group">
        <label>New Password</label>
        <input type="password" id="resetPassword" placeholder="6+ characters" required minlength="6">
      </div>
      <div class="form-group">
        <label>Confirm New Password</label>
        <input type="password" id="resetPasswordConfirm" placeholder="••••••••" required minlength="6">
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;">Set New Password</button>
    </form>

  </div>
</div>`;
}

function getFooter() {
  return `
<footer>
  <div class="footer-logo">🇻🇳 FluentSaigon</div>
  <div class="footer-tagline" style="font-size:0.85rem;color:rgba(255,255,255,0.4);margin-bottom:12px;">Speak Vietnamese Like a Local, Not a Tourist</div>
  <div class="footer-links">
    <a href="/index.html">Home</a>
    <a href="/pages/subjects.html">Subjects</a>
    <a href="/pages/pricing.html">Pricing</a>
    <a href="/pages/about.html">About</a>
    <a href="/pages/terms.html">Terms & Conditions</a>
    <a href="/pages/privacy.html">Privacy Policy</a>
  </div>
  <p>© 2026 FluentSaigon · A HelpMeGrow LLC product · Built in Boise, Idaho 🥔<br>
  <span style="font-size:0.7rem;opacity:0.4;">FluentSaigon is not affiliated with any Vietnamese government entity.</span></p>
</footer>`;
}

function getPaywallOverlay() {
  return `
<div class="paywall-overlay" id="paywallOverlay" style="display:none">
  <div class="paywall-card">
    <div class="paywall-icon">🔒</div>
    <h2>Unlock Pro Access</h2>
    <p>Intermediate and Expert levels — plus all subjects — are available with a FluentSaigon Pro subscription.</p>
    <div style="display:flex;flex-direction:column;gap:12px;">
      <button class="btn btn-primary" style="justify-content:center;font-size:1rem;" onclick="Auth.upgradeToPro()">
        Start 7-Day Free Trial — $9.99/mo after
      </button>
      <button class="btn btn-secondary" style="justify-content:center;" onclick="hidePaywall()">
        Continue with Beginner (Free)
      </button>
    </div>
    <p style="margin-top:16px;font-size:0.75rem;color:rgba(255,255,255,0.35);">Cancel anytime before day 7 and you won't be charged.</p>
  </div>
</div>`;
}

// Inject shared components
document.addEventListener('DOMContentLoaded', () => {
  const navPlaceholder = document.getElementById('nav-placeholder');
  const footerPlaceholder = document.getElementById('footer-placeholder');
  const modalPlaceholder = document.getElementById('modal-placeholder');
  const paywallPlaceholder = document.getElementById('paywall-placeholder');

  if (navPlaceholder) navPlaceholder.innerHTML = getNav(navPlaceholder.dataset.page);
  if (footerPlaceholder) footerPlaceholder.innerHTML = getFooter();
  if (modalPlaceholder) modalPlaceholder.innerHTML = getAuthModal();
  if (paywallPlaceholder) paywallPlaceholder.innerHTML = getPaywallOverlay();
});

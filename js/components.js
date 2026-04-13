function getNav(activePage = '') {
  return `
<nav>
  <a class="nav-logo" href="/index.html">
    🇻🇳 FluentSaigon
    <span class="logo-sub">Speak Like a Local</span>
  </a>
  <ul class="nav-links" id="navLinks">
    <li><a href="/index.html" ${activePage==='home'?'class="active"':''}>Home</a></li>
    <li><a href="/pages/subjects.html" ${activePage==='subjects'?'class="active"':''}>Subjects</a></li>
    <li><a href="/pages/pricing.html" ${activePage==='pricing'?'class="active"':''}>Pricing</a></li>
    <li><a href="/pages/about.html" ${activePage==='about'?'class="active"':''}>About</a></li>
    <li id="navSignIn"><a href="#" onclick="AuthModal.open('login'); return false;" style="color:rgba(255,255,255,0.65);">Sign In</a></li>
    <li id="navCta"><a href="#" class="nav-cta" onclick="AuthModal.open('signup'); return false;">Start Free</a></li>
    <li id="navUser" style="display:none">
      <a href="/pages/account.html" style="display:flex;align-items:center;gap:8px;color:rgba(255,255,255,0.8);">
        <span style="font-size:1.2rem;">👤</span>
        <span style="display:flex;flex-direction:column;gap:1px;">
          <span id="navUserName" style="font-size:0.8rem;font-weight:800;"></span>
          <span id="navUserPlan" style="font-size:0.6rem;color:var(--gold);font-weight:800;letter-spacing:0.08em;"></span>
        </span>
      </a>
    </li>
  </ul>
  <button class="nav-hamburger" onclick="document.getElementById('navLinks').classList.toggle('open')" aria-label="Menu">☰</button>
</nav>`;
}

function getAuthModal() {
  // Netlify Identity handles its own modal UI
  // No custom modal HTML needed
  return '<div id="authModal"></div>';
}


function getFooter() {
  return `
<footer>
  <div class="footer-logo">🇻🇳 FluentSaigon</div>
  <div class="footer-tagline">Speak Vietnamese Like a Local, Not a Tourist</div>
  <div class="footer-links">
    <a href="/index.html">Home</a>
    <a href="/pages/subjects.html">Subjects</a>
    <a href="/pages/pricing.html">Pricing</a>
    <a href="/pages/about.html">About</a>
    <a href="/pages/terms.html">Terms & Conditions</a>
    <a href="/pages/privacy.html">Privacy Policy</a>
  </div>
  <div class="footer-copy">
    © 2026 FluentSaigon · A HelpMeGrow LLC product · Built in Boise, Idaho 🥔<br>
    <span style="font-size:0.7rem;opacity:0.6;">FluentSaigon is not affiliated with any Vietnamese government entity.</span>
  </div>
</footer>`;
}

function getPaywallOverlay() {
  return `
<div class="paywall-overlay" id="paywallOverlay" style="display:none">
  <div class="paywall-card">
    <div class="paywall-icon">🔒</div>
    <h2>Unlock Pro Access</h2>
    <p>Intermediate and Expert levels — plus all 12+ subjects — are available with a FluentSaigon Pro subscription. Less than a coffee a month.</p>
    <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:16px;">
      <button class="btn btn-primary" style="justify-content:center;font-size:1rem;" onclick="Auth.upgradeToPro()">
        Start 7-Day Free Trial — $7.99/mo
      </button>
      <button class="btn btn-secondary" style="justify-content:center;" onclick="hidePaywall()">
        Keep Playing Beginner (Free)
      </button>
    </div>
    <p style="font-size:0.72rem;color:rgba(255,255,255,0.3);">Cancel anytime. No questions asked.</p>
  </div>
</div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  const navEl = document.getElementById('nav-placeholder');
  const footerEl = document.getElementById('footer-placeholder');
  const modalEl = document.getElementById('modal-placeholder');
  const paywallEl = document.getElementById('paywall-placeholder');
  if (navEl) navEl.innerHTML = getNav(navEl.dataset.page);
  if (footerEl) footerEl.innerHTML = getFooter();
  if (modalEl) modalEl.innerHTML = getAuthModal();
  if (paywallEl) paywallEl.innerHTML = getPaywallOverlay();
});

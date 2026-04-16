// Global JS (used later for navbar, theme, analytics, etc.)

// Dynamically load the global analytics script site-wide
(function loadAnalytics() {
  const script = document.createElement('script');
  script.src = '/assets/js/analytics.js';
  script.defer = true;
  document.head.appendChild(script);
})();
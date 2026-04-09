// ── Nav scroll ──
var nav = document.getElementById('nav');
var navBackdrop = document.getElementById('navBackdrop');
if (nav && navBackdrop) {
  window.addEventListener('scroll', function() {
    var scrolled = window.scrollY > 20;
    nav.classList.toggle('scrolled', scrolled);
    navBackdrop.classList.toggle('scrolled', scrolled);
  }, { passive: true });
}

// ── Scroll reveals ──
var revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(function(el) { revealObserver.observe(el); });

// ── Staggered children ──
var childObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      var parent = entry.target.closest('.features-grid, .quotes-grid, .events-grid, .articles-grid, .values-grid, .jobs-grid');
      if (parent) {
        parent.querySelectorAll('.reveal-child').forEach(function(child, i) {
          setTimeout(function() { child.classList.add('visible'); }, i * 80);
        });
      }
      childObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal-child:first-child').forEach(function(el) { childObserver.observe(el); });

// ── Problem cards settle ──
var problemDesk = document.getElementById('problemDesk');
if (problemDesk) {
  var problemObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.pain-card').forEach(function(card, i) {
          setTimeout(function() { card.classList.add('settled'); }, i * 120);
        });
        problemObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  problemObserver.observe(problemDesk);
}

// ── FAQ ──
function toggleFaq(btn) {
  var answer = btn.nextElementSibling;
  var chevron = btn.querySelector('.faq-chevron');
  var isOpen = answer.classList.toggle('open');
  chevron.style.transform = isOpen ? 'rotate(180deg)' : '';
}

// ── Flow Tabs ──
var flowTabs = document.querySelectorAll('.flow-tab');
var flowPanels = document.querySelectorAll('.flow-preview-panel');
if (flowTabs.length) {
  flowTabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      var target = tab.dataset.tab;
      flowTabs.forEach(function(t) { t.classList.toggle('active', t.dataset.tab === target); });
      flowPanels.forEach(function(p) { p.classList.toggle('active', p.dataset.panel === target); });
    });
  });
}

// ── Content filter tabs ──
var filterTabs = document.querySelectorAll('.filter-tab');
var filterItems = document.querySelectorAll('[data-category]');
if (filterTabs.length) {
  filterTabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      var cat = tab.dataset.filter;
      filterTabs.forEach(function(t) { t.classList.toggle('active', t === tab); });
      filterItems.forEach(function(item) {
        item.style.display = (cat === 'all' || item.dataset.category === cat) ? '' : 'none';
      });
    });
  });
}

// ── Theme Switcher (Light / Dark / System) ──
var switcher = document.getElementById('themeSwitcher');
if (switcher) {
  var buttons = switcher.querySelectorAll('button');

  function applyTheme(mode) {
    buttons.forEach(function(b) { b.classList.toggle('active', b.dataset.theme === mode); });
    if (mode === 'system') {
      localStorage.removeItem('lumonic-theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else if (mode === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('lumonic-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('lumonic-theme', 'light');
    }
  }

  var savedTheme = localStorage.getItem('lumonic-theme');
  applyTheme(savedTheme || 'light');

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
    if (!localStorage.getItem('lumonic-theme')) applyTheme('system');
  });

  buttons.forEach(function(btn) {
    btn.addEventListener('click', function() { applyTheme(btn.dataset.theme); });
  });
}

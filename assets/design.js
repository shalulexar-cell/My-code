/* Progressive enhancement: links and content remain usable without JavaScript. */
(() => {
  const phone = matchMedia('(max-width:767px)');
  const footerGroups = document.querySelectorAll('.qd-footer-group');
  const setFooterLayout = () => footerGroups.forEach(group => { group.open = !phone.matches; });
  setFooterLayout();
  phone.addEventListener('change', setFooterLayout);
  document.querySelectorAll('.qd-menu').forEach(menu => {
    menu.addEventListener('click', event => { if (event.target.closest('a')) menu.open = false; });
    menu.addEventListener('keydown', event => {
      if (event.key === 'Escape') { menu.open = false; menu.querySelector('summary').focus(); }
    });
    document.addEventListener('click', event => { if (!menu.contains(event.target)) menu.open = false; });
  });
  const here = location.pathname;
  document.querySelectorAll('.qd-desktop-nav a').forEach(link => {
    if (!link.hash && new URL(link.href).pathname === here) link.setAttribute('aria-current', 'page');
  });
  const filters = document.querySelector('.qd-service-filters');
  if (filters) {
    const cards = [...document.querySelectorAll('.qd-service-card[data-category]')];
    filters.hidden = false;
    filters.addEventListener('click', event => {
      const button = event.target.closest('button[data-filter]');
      if (!button) return;
      filters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      cards.forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; });
      document.getElementById('qd-service-count').textContent = `${cards.filter(card => !card.hidden).length} services shown`;
    });
  }
  const categoryLinks = [...document.querySelectorAll('nav[aria-label="Guide categories"] a')];
  if (categoryLinks.length) {
    const mark = hash => categoryLinks.forEach(link => {
      if (link.hash === hash) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    mark(location.hash || categoryLinks[0].hash);
    addEventListener('hashchange', () => mark(location.hash));
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) mark('#' + visible[0].target.id);
      }, {rootMargin:'-90px 0px -55% 0px', threshold:0});
      categoryLinks.forEach(link => { const target = document.querySelector(link.hash); if (target) observer.observe(target); });
    }
  }
})();

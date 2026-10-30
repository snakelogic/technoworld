import './styles.css';

const phone = '+917942637520';

const departmentCategories = [
  ['All products', 'Everything', 'grid'],
  ['RGB displays', 'RGB displays', 'display'],
  ['Event & video walls', 'Events & video walls', 'event'],
  ['Neon & personal', 'Personal signs', 'home']
];
const categoryIcon = kind => {
  const paths = {
    grid: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
    display: '<rect x="3" y="5" width="18" height="13" rx="2"/><path d="M8 21h8M12 18v3M7 10h.01M10 10h.01M13 10h.01M16 10h1"/>',
    event: '<path d="m12 3 2.2 5.3L20 6l-2.3 5.8L23 14l-5.5 2.1L20 22l-5.8-2.3L12 25l-2.2-5.3L4 22l2.3-5.8L1 14l5.5-2.1L4 6l5.8 2.3L12 3Z" transform="translate(0 -2) scale(.92)"/><path d="M8 12h8M10 15h4"/>',
    home: '<path d="m3 11 9-7 9 7v9a1 1 0 0 1-1 1h-6v-6h-4v6H4a1 1 0 0 1-1-1z"/><path d="m13 9-2 4h3l-2 4"/>'
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths[kind]}</svg>`;
};
const products = [
  {
    id: 'rgb-running-board', name: 'RGB Running Display Board', category: 'RGB displays', audience: 'Business',
    price: 1150, unit: 'piece', badge: 'Bestseller',
    image: 'https://5.imimg.com/data5/SELLER/PDFImage/2026/5/608203807/FW/UE/VR/266428665/rgb-running-display-board-1000x1000.png',
    summary: 'Full-color motion for shop fronts, announcements and promotions.',
    specs: [['Display', 'Full-color RGB'], ['Pixel pitch', '5 mm'], ['Use', 'Outdoor'], ['Connectivity', 'Wi-Fi · USB · Ethernet · RS232'], ['Power', '230 V AC']],
    description: 'Keep your message moving with a bright, programmable RGB display. Share promotions, announcements and updates with content that is easy to notice.'
  },
  {
    id: 'running-display', name: 'LED Running Display', category: 'RGB displays', audience: 'Business',
    price: 650, unit: 'sq ft', badge: 'Custom sizes',
    image: 'https://5.imimg.com/data5/SELLER/Default/2026/5/608179145/TH/QN/WV/266428665/led-running-display-500x500.jpg',
    summary: 'A versatile scrolling message board for storefronts and public spaces.',
    specs: [['Display', 'Full-color RGB'], ['Pixel pitch', '6 mm'], ['Use', 'Outdoor'], ['Connectivity', 'Wi-Fi · USB · Bluetooth · Ethernet'], ['Power', '230 V AC']],
    description: 'An adaptable digital board for shop branding, notices, advertising and promotional messages. Ask us to size it for your space.'
  },
  {
    id: 'event-led-display', name: 'Event LED Display', category: 'Event & video walls', audience: 'Event',
    price: 5000, unit: 'sq ft', badge: 'For events',
    image: 'https://5.imimg.com/data5/SELLER/Default/2026/5/608187939/US/FD/PH/266428665/event-led-display-1000x1000.jpg',
    summary: 'Bring weddings, stages, exhibitions and celebrations to life.',
    specs: [['Display', 'Full-color RGB'], ['Pixel pitch', 'P6'], ['Screen size', '56–65 in listing'], ['Use', 'Outdoor / semi-outdoor'], ['IP rating', 'IP66']],
    description: 'A vivid screen for stage shows, weddings, concerts, exhibitions and corporate gatherings. Configurations can be tailored to the venue and event.'
  },
  {
    id: 'outdoor-video-wall', name: 'Outdoor LED Video Wall', category: 'Event & video walls', audience: 'Business',
    price: 4500, unit: 'sq ft', badge: 'High brightness',
    image: 'https://5.imimg.com/data5/SELLER/Default/2026/5/608187939/US/FD/PH/266428665/event-led-display-1000x1000.jpg',
    summary: 'Weather-ready full-color visuals for advertising and outdoor venues.',
    specs: [['Pixel pitch', 'P6'], ['Brightness', '5,000 nits'], ['Refresh rate', '≥ 3840 Hz'], ['IP rating', 'IP67'], ['Use', 'Outdoor']],
    description: 'A high-visibility display for outdoor advertising, showrooms and public spaces. Select a pixel pitch and screen size to suit viewing distance.'
  },
  {
    id: 'birthday-neon', name: 'Happy Birthday Neon Sign', category: 'Neon & personal', audience: 'Personal',
    price: null, unit: 'custom quote', badge: 'Made for your moment',
    image: null,
    summary: 'A bright finishing touch for birthdays, parties and celebrations.',
    specs: [['Style', 'Neon sign'], ['Design', 'Celebration / custom'], ['Use', 'Events & interiors'], ['Order', 'Request a quote']],
    description: 'Give your celebration a little extra glow. Get in touch to discuss a birthday design, size and finish that suits your space.'
  },
  {
    id: 'night-glow-nameplate', name: 'Night Glow Nameplate', category: 'Neon & personal', audience: 'Personal',
    price: null, unit: 'custom quote', badge: 'Personalised',
    image: null,
    summary: 'A personalised nameplate that stays easy to spot after dark.',
    specs: [['Style', 'Night glow'], ['Design', 'Personalised name'], ['Use', 'Home / office'], ['Order', 'Request a quote']],
    description: 'A personal welcome for your home or office. Share the name, preferred style and approximate size to receive a tailored quote.'
  }
];

const state = {
  filter: 'All products',
  audience: 'all',
  previewText: 'YOUR MESSAGE HERE',
  previewColor: 'rgb',
  previewFrame: 0,
  customer: null,
  query: '',
  cart: JSON.parse(localStorage.getItem('tw-cart') || '{}'),
  selected: products[0],
  order: null
};

const money = value => `₹${Number(value).toLocaleString('en-IN')}`;
const cartCount = () => Object.values(state.cart).reduce((a, b) => a + b, 0);
const cartItems = () => Object.entries(state.cart).map(([id, qty]) => ({ product: products.find(p => p.id === id), qty })).filter(x => x.product);

function productCard(p, index) {
  return `<article class="product-card" style="--i:${index}">
    <button class="product-image ${p.image ? '' : 'image-fallback'} ${p.id === 'birthday-neon' ? 'birthday-art' : ''} ${p.id === 'night-glow-nameplate' ? 'nameplate-art' : ''}" data-product="${p.id}" aria-label="View ${p.name}">
      ${p.image ? `<img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.parentElement.classList.add('image-fallback');this.remove()">` : ''}
      <span class="image-fallback-art" aria-hidden="true"><i>✳</i><b>${p.category === 'Neon & personal' ? 'YOUR LIGHT' : 'RGB / FULL COLOR'}</b></span>
      ${p.id === 'birthday-neon' ? '<span class="personal-preview birthday-preview"><small>LET’S CELEBRATE</small><strong>HAPPY<br>BIRTHDAY</strong><i>✳</i></span>' : ''}
      ${p.id === 'night-glow-nameplate' ? '<span class="personal-preview name-preview"><small>WELCOME HOME</small><strong>THE SHARMAS</strong><i>MADE FOR YOUR HOME</i></span>' : ''}
      <span class="badge">${p.badge}</span><span class="image-open">↗</span>
    </button>
    <div class="card-info"><div class="card-kicker">${p.category} <span>·</span> ${p.audience}</div><button class="card-name" data-product="${p.id}">${p.name}</button><p>${p.summary}</p>
      <div class="card-bottom"><div class="price">${p.price ? `${money(p.price)} <small>/ ${p.unit}</small>` : '<small>Price on request</small>'}</div>${p.price ? `<button class="ask-button" data-add="${p.id}">Add to bag <span>+</span></button>` : `<button class="ask-button" data-ask="${p.id}">Ask for price <span>↗</span></button>`}</div>
    </div>
  </article>`;
}

function filteredProducts() {
  const q = state.query.trim().toLowerCase();
  return products.filter(p => (state.filter === 'All products' || p.category === state.filter) && (state.audience === 'all' || p.audience.toLowerCase() === state.audience) && (!q || `${p.name} ${p.summary} ${p.category} ${p.audience}`.toLowerCase().includes(q)));
}

function render() {
  const previousTrack = document.querySelector('.horizontal-track');
  const previousPanel = previousTrack ? Math.round(previousTrack.scrollLeft / Math.max(1, previousTrack.clientWidth)) : 0;
  document.querySelector('#app').innerHTML = `
    <div class="announcement"><div class="container announcement-inner"><span>Custom signs & RGB displays, made for your space</span><a href="tel:${phone}">Questions? Call <b>07942 637 520</b> <span aria-hidden="true">↗</span></a></div></div>
    <header class="site-header container">
      <a class="brand" href="#offers" aria-label="TechnoWorld home"><span class="brand-mark">T<span>W</span></span><span class="brand-name">TECHNOWORLD<small>RGB · LED · SIGNAGE</small></span></a>
      <nav class="main-nav" aria-label="Main navigation"><a href="#offers">Home</a><a href="#shop">Products</a><a href="#preview-section">RGB</a><a href="#spaces">Uses</a><a href="#how-it-works">Order</a></nav>
      <div class="header-search"><span aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" stroke-width="1.8"/><path d="m16 16 4.2 4.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></span><input id="product-search" type="search" placeholder="Search displays, signs and more" value="${escapeText(state.query)}" aria-label="Search products"><kbd>⌘ K</kbd></div><div class="header-actions"><button class="account-trigger" data-action="account" aria-label="${state.customer ? 'Open customer profile' : 'Log in or create an account'}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M4.8 20a7.2 7.2 0 0 1 14.4 0"/></svg><span>${state.customer ? `Hi, ${escapeText(state.customer.name.split(' ')[0])}` : 'Login'}</span></button><button class="cart-trigger" data-action="cart">Enquiry bag <span class="cart-count">${cartCount()}</span></button></div>
    </header>
    <nav class="department-bar" aria-label="Shop categories"><div class="container department-inner">${departmentCategories.map(([value,label,icon]) => `<button class="department-link ${state.filter === value ? 'active' : ''}" data-filter="${value}"><span class="category-icon">${categoryIcon(icon)}</span><span>${label}</span></button>`).join('')}</div></nav>
    <main id="home">
      <div class="horizontal-track" tabindex="0" aria-label="Product pages. Use arrow keys or scroll horizontally to explore."><section class="horizontal-panel panel-hero"><section class="festive-offer container" id="offers"><div class="festive-copy"><span class="offer-tag"><i>✦</i> TECHNOWORLD FESTIVE OFFER</span><h1>Light up your<br><em>celebrations.</em></h1><p>Full-colour RGB running displays. Custom sizes for shops, events and home.</p><div class="offer-price"><span>RGB running display</span><strong>₹1,150 <small>/ piece*</small></strong><small>Listed price · custom sizes quoted separately</small></div><div class="offer-actions"><button class="button-primary" data-add="rgb-running-board">Add to bag <span>+</span></button><a href="#shop">Explore products <span>→</span></a></div></div><div class="festive-product"><div class="rangoli-orbit orbit-a"></div><div class="rangoli-orbit orbit-b"></div><span class="festive-badge">FESTIVE<br><b>PICK</b></span><img src="https://5.imimg.com/data5/SELLER/PDFImage/2026/5/608203807/FW/UE/VR/266428665/rgb-running-display-board-1000x1000.png" alt="Full-colour RGB running display board" onerror="this.style.display='none'"><div class="festive-product-label"><span>RGB RUNNING DISPLAY</span><b>Custom sizes · Full colour</b></div></div></section></section>
      <section class="horizontal-panel panel-shop"><section class="market-intro container"><div><div class="breadcrumbs">Home <span>›</span> Lighting & displays</div><h1>Shop displays & signs</h1></div></section>
      <section class="shop-section container" id="shop">
        <div class="shop-toolbar"><span class="result-count">${filteredProducts().length} products</span></div>
        <div class="product-grid">${filteredProducts().map(productCard).join('') || '<div class="no-results">No products match that search. <button data-action="reset-search">Clear search</button></div>'}</div>
      </section></section>
      <section class="horizontal-panel panel-rgb"><section class="scroll-feature" id="preview-section"><div class="container scroll-feature-inner"><div class="feature-display"><div class="feature-display-glow"></div><div class="feature-display-window"><span>YOUR MESSAGE</span></div><div class="feature-display-caption"><span>FULL-COLOUR RGB</span><span>5 MM PIXEL PITCH</span></div></div><div class="scroll-feature-copy"><div class="eyebrow">YOUR MESSAGE, IN LIGHT</div><h2>Make every<br><em>moment visible.</em></h2><p>Choose a display, try a message in the RGB preview, then send us the size and setting. We’ll help you get the right fit.</p><div class="feature-specs"><span><b>01</b> Full-colour RGB</span><span><b>02</b> Indoor & outdoor options</span><span><b>03</b> Custom sizing</span></div><button class="button-primary" data-action="live-preview">Try the RGB preview <span>↗</span></button></div></div></section></section>
      <section class="horizontal-panel panel-uses"><section class="use-cases container" id="spaces"><div class="section-title"><div class="eyebrow">MADE FOR YOUR KIND OF MOMENT</div><h2>One bright idea.<br><em>Many ways to use it.</em></h2></div><div class="use-case-grid"><article><span class="use-icon">${categoryIcon('display')}</span><h3>For your business</h3><p>Running displays for storefront messages and promotions.</p><button data-action="shop-category" data-category="RGB displays">Shop RGB displays <b>↗</b></button></article><article><span class="use-icon event">${categoryIcon('event')}</span><h3>For your event</h3><p>Full-colour screens for celebrations, stages and gatherings.</p><button data-action="shop-category" data-category="Event & video walls">View event displays <b>↗</b></button></article><article><span class="use-icon home">${categoryIcon('home')}</span><h3>For your home</h3><p>Personal name signs and a little extra glow for your space.</p><button data-action="shop-category" data-category="Neon & personal">View personal signs <b>↗</b></button></article></div></section></section>
      <section class="horizontal-panel panel-order"><section class="order-steps" id="how-it-works"><div class="container steps-inner"><div class="section-title"><div class="eyebrow">SIMPLE TO GET STARTED</div><h2>From idea to<br><em>made for you.</em></h2></div><div class="steps-grid"><article><span>01</span><h3>Pick your product</h3><p>Choose a display or sign from the collection.</p></article><article><span>02</span><h3>Share your details</h3><p>Tell us your size, location, message or occasion.</p></article><article><span>03</span><h3>Get your quote</h3><p>Our team confirms configuration, pricing and next steps.</p></article></div><button class="button-primary" data-action="quote">Start an enquiry <span>↗</span></button></div></section>
      <section class="contact-section container" id="contact"><div><div class="eyebrow">NEED A HAND?</div><h2>We’re one call away.</h2><p>Ask about products, custom sizes, or an order you already placed.</p></div><a href="tel:${phone}">Call 07942 637 520 <span>↗</span></a></section><footer class="compact-footer"><span>© ${new Date().getFullYear()} TechnoWorld · Prices are indicative; confirm your quote.</span><a href="https://www.technoworldpro.com/" target="_blank" rel="noreferrer">Visit TechnoWorld ↗</a></footer></section></div>
      <nav class="carousel-controls" aria-label="Carousel controls"><button class="carousel-arrow" type="button" data-carousel-prev aria-label="Previous slide"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg></button><div class="carousel-pagination" role="group" aria-label="Choose a slide"><button type="button" data-carousel-slide="0" aria-label="Slide 1: Home"></button><button type="button" data-carousel-slide="1" aria-label="Slide 2: Products"></button><button type="button" data-carousel-slide="2" aria-label="Slide 3: RGB details"></button><button type="button" data-carousel-slide="3" aria-label="Slide 4: Uses"></button><button type="button" data-carousel-slide="4" aria-label="Slide 5: Order"></button></div><span class="carousel-count" aria-live="polite"><b>01</b> / 05</span><button class="carousel-arrow" type="button" data-carousel-next aria-label="Next slide"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></button></nav>
    </main>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>
    <div class="overlay" id="overlay" aria-hidden="true"><div class="scrim" data-action="close-overlay"></div><aside class="drawer" id="drawer" aria-label="Enquiry bag"></aside></div>
    <div class="modal-layer" id="modal-layer" aria-hidden="true"><div class="modal-scrim" data-action="close-modal"></div><section class="dialog" id="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title"></section></div>`;
  bindEvents();
  setupHorizontalNavigation(previousPanel);
}

function goToSlide(index) {
  const track = document.querySelector('.horizontal-track');
  const panels = track ? [...track.querySelectorAll('.horizontal-panel')] : [];
  if (!panels.length) return;
  const wrapped = (index + panels.length) % panels.length;
  track.scrollTo({ left: wrapped * track.clientWidth, behavior: 'smooth' });
}
function goToPanel(target) {
  const section = document.querySelector(target), panel = section?.closest('.horizontal-panel'), track = document.querySelector('.horizontal-track');
  if (panel && track) { const index = [...track.querySelectorAll('.horizontal-panel')].indexOf(panel); track.scrollTo({ left: index * track.clientWidth, behavior: 'smooth' }); }
}
function setupHorizontalNavigation(previousPanel = 0) {
  const track = document.querySelector('.horizontal-track'); if (!track) return;
  const panels = [...track.querySelectorAll('.horizontal-panel')];
  track.scrollLeft = Math.min(previousPanel, panels.length - 1) * track.clientWidth;
  const updatePagination = () => {
    const current = Math.max(0, Math.min(panels.length - 1, Math.round(track.scrollLeft / track.clientWidth)));
    document.querySelectorAll('[data-carousel-slide]').forEach((dot, index) => { if (index === current) dot.setAttribute('aria-current', 'true'); else dot.removeAttribute('aria-current'); });
    const count = document.querySelector('.carousel-count');
    if (count) count.innerHTML = `<b>${String(current + 1).padStart(2, '0')}</b> / ${String(panels.length).padStart(2, '0')}`;
  };
  document.querySelector('[data-carousel-prev]')?.addEventListener('click', () => goToSlide(Math.round(track.scrollLeft / track.clientWidth) - 1));
  document.querySelector('[data-carousel-next]')?.addEventListener('click', () => goToSlide(Math.round(track.scrollLeft / track.clientWidth) + 1));
  document.querySelectorAll('[data-carousel-slide]').forEach(dot => dot.addEventListener('click', () => goToSlide(Number(dot.dataset.carouselSlide))));
  let scrollFrame = 0;
  track.addEventListener('scroll', () => { if (scrollFrame) return; scrollFrame = requestAnimationFrame(() => { scrollFrame = 0; updatePagination(); }); }, { passive: true });
  updatePagination();
  document.querySelectorAll('.main-nav a[href^="#"], .brand[href^="#"], .horizontal-track a[href^="#"]').forEach(link => link.addEventListener('click', event => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target?.closest('.horizontal-panel')) return;
    event.preventDefault();
    const href = link.getAttribute('href');
    goToPanel(href);
    history.pushState({ panel: [...track.querySelectorAll('.horizontal-panel')].indexOf(target.closest('.horizontal-panel')) }, '', href);
  }));
  let wheelBusy = false;
  track.addEventListener('wheel', event => {
    if (Math.abs(event.deltaY) < Math.abs(event.deltaX) || event.ctrlKey) return;
    const panel = event.target.closest('.horizontal-panel');
    if (panel && panel.scrollHeight > panel.clientHeight + 3) {
      const canScroll = event.deltaY < 0 ? panel.scrollTop > 0 : panel.scrollTop + panel.clientHeight < panel.scrollHeight - 2;
      if (canScroll) return;
    }
    event.preventDefault(); if (wheelBusy) return; wheelBusy = true;
    track.scrollBy({ left: Math.sign(event.deltaY) * track.clientWidth, behavior: 'smooth' });
    setTimeout(() => { wheelBusy = false; }, 500);
  }, { passive: false });
  track.addEventListener('keydown', event => {
    if (['INPUT','TEXTAREA','SELECT','BUTTON'].includes(event.target.tagName)) return;
    if (event.key === 'ArrowRight' || event.key === 'PageDown') { event.preventDefault(); track.scrollBy({left:track.clientWidth,behavior:'smooth'}); }
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); track.scrollBy({left:-track.clientWidth,behavior:'smooth'}); }
  });
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    const active = entry.isIntersecting && entry.intersectionRatio > .55;
    entry.target.classList.toggle('is-active', active);
    if (active) document.querySelectorAll('.main-nav a').forEach(link => link.classList.toggle('active', entry.target.contains(document.querySelector(link.hash))));
  }), { root: track, threshold: [.2, .55, .8] });
  panels.forEach(panel => observer.observe(panel));
  panels[Math.min(previousPanel, panels.length - 1)]?.classList.add('is-active');
}

function persistCart() { localStorage.setItem('tw-cart', JSON.stringify(state.cart)); }
function showToast(text) { const t = document.querySelector('#toast'); t.textContent = text; t.classList.add('visible'); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => t.classList.remove('visible'), 2200); }
function addToCart(id, qty = 1) { state.cart[id] = (state.cart[id] || 0) + qty; persistCart(); render(); showToast('Added to your enquiry bag'); }
function setQty(id, qty) { if (qty < 1) delete state.cart[id]; else state.cart[id] = qty; persistCart(); renderDrawer(); document.querySelectorAll('.cart-count').forEach(el => el.textContent = cartCount()); }

function renderDrawer() {
  const drawer = document.querySelector('#drawer');
  const items = cartItems();
  const total = items.reduce((sum, x) => sum + (x.product.price || 0) * x.qty, 0);
  drawer.innerHTML = `<div class="drawer-head"><div><span class="eyebrow">YOUR SELECTION</span><h2>Your enquiry bag <small>${cartCount()}</small></h2></div><button class="close-button" data-action="close-overlay" aria-label="Close bag">×</button></div>${items.length ? `<div class="drawer-items">${items.map(({ product:p, qty }) => `<article class="drawer-item"><img src="${p.image}" alt="" onerror="this.style.visibility='hidden'"><div class="drawer-item-copy"><b>${p.name}</b><span>${p.price ? `${money(p.price)} / ${p.unit}` : 'Price on request'}</span><div class="qty-control"><button data-qty="${p.id}" data-delta="-1" aria-label="Remove one ${p.name}">−</button><output>${qty}</output><button data-qty="${p.id}" data-delta="1" aria-label="Add one ${p.name}">+</button><button class="remove" data-remove="${p.id}">Remove</button></div></div></article>`).join('')}</div><div class="drawer-summary"><p><span>Indicative product total</span><b>${total ? money(total) : 'Quote required'}</b></p><small>We’ll confirm final pricing, configuration and delivery with you.</small><button class="button-primary full" data-action="checkout">Continue to enquiry <span>↗</span></button><button class="continue-shopping" data-action="close-overlay">Continue browsing</button></div>` : `<div class="empty-bag"><div>✳</div><h3>Your bag is waiting for an idea.</h3><p>Add products to ask about pricing and availability.</p><button class="button-primary" data-action="close-overlay">Explore products <span>↘</span></button></div>`}`;
  bindEvents(drawer);
}

function openDrawer() { renderDrawer(); document.querySelector('#overlay').classList.add('open'); document.querySelector('#overlay').setAttribute('aria-hidden', 'false'); document.body.classList.add('locked'); }
function closeDrawer() { document.querySelector('#overlay').classList.remove('open'); document.querySelector('#overlay').setAttribute('aria-hidden', 'true'); document.body.classList.remove('locked'); }

function showModal(html) { const layer = document.querySelector('#modal-layer'); document.querySelector('#dialog').innerHTML = html; layer.classList.add('open'); layer.setAttribute('aria-hidden', 'false'); document.body.classList.add('locked'); bindEvents(document.querySelector('#dialog')); }
function closeModal() { if (state.previewFrame) cancelAnimationFrame(state.previewFrame); state.previewFrame = 0; const layer = document.querySelector('#modal-layer'); layer.classList.remove('open'); layer.setAttribute('aria-hidden', 'true'); document.body.classList.remove('locked'); }

function openProduct(id) {
  const p = products.find(item => item.id === id); if (!p) return;
  state.selected = p;
  showModal(`<button class="close-button dialog-close" data-action="close-modal" aria-label="Close product">×</button><div class="product-detail"><div class="detail-image ${p.image ? '' : 'image-fallback'} ${p.id === 'birthday-neon' ? 'birthday-art' : ''} ${p.id === 'night-glow-nameplate' ? 'nameplate-art' : ''}">${p.image ? `<img src="${p.image}" alt="${p.name}" onerror="this.parentElement.classList.add('image-fallback');this.remove()">` : ''}<span class="image-fallback-art"><i>✳</i><b>${p.category}</b></span>${p.id === 'birthday-neon' ? '<span class="personal-preview birthday-preview"><small>LET’S CELEBRATE</small><strong>HAPPY<br>BIRTHDAY</strong><i>✳</i></span>' : ''}${p.id === 'night-glow-nameplate' ? '<span class="personal-preview name-preview"><small>WELCOME HOME</small><strong>THE SHARMAS</strong><i>MADE FOR YOUR HOME</i></span>' : ''}</div><div class="detail-copy"><div class="eyebrow">${p.category} · ${p.audience}</div><h2 id="dialog-title">${p.name}</h2><p class="detail-summary">${p.description}</p><div class="detail-price">${p.price ? `${money(p.price)} <small>/ ${p.unit} · indicative listing price</small>` : 'Price on request'}</div><div class="specs"><h3>PRODUCT DETAILS</h3>${p.specs.map(([a,b]) => `<div><span>${a}</span><b>${b}</b></div>`).join('')}</div><div class="detail-actions"><button class="button-primary" data-add="${p.id}">Add to enquiry bag <span>+</span></button>${p.price ? '' : `<button class="button-text" data-ask="${p.id}">Request custom price ↗</button>`}</div></div></div>`);
}


function openAuth(mode = 'login') {
  const registering = mode === 'register';
  showModal(`<button class="close-button dialog-close" data-action="close-modal" aria-label="Close account dialog">×</button><div class="quote-form-wrap account-modal"><div class="eyebrow">TECHNOWORLD CUSTOMER ACCOUNT</div><div class="auth-tabs" role="tablist" aria-label="Account access"><button type="button" role="tab" aria-selected="${!registering}" class="${!registering ? 'active' : ''}" data-auth-mode="login">Log in</button><button type="button" role="tab" aria-selected="${registering}" class="${registering ? 'active' : ''}" data-auth-mode="register">Create account</button></div><h2 id="dialog-title">${registering ? 'Create your account.' : 'Welcome back.'}</h2><p>${registering ? 'Save your details for faster enquiries and easy profile updates.' : 'Log in to view and update your customer profile.'}</p><form data-auth-form="${mode}">${registering ? `<label>Full name<input name="name" autocomplete="name" maxlength="80" required placeholder="Your name"></label>` : ''}<label>Email address<input type="email" name="email" autocomplete="email" maxlength="160" required placeholder="you@example.com"></label>${registering ? `<label>Phone number <span>(optional)</span><input type="tel" name="phone" autocomplete="tel" placeholder="+91"></label>` : ''}<label>Password<input type="password" name="password" autocomplete="${registering ? 'new-password' : 'current-password'}" minlength="${registering ? '10' : '1'}" maxlength="128" required placeholder="${registering ? 'At least 10 characters' : 'Your password'}"></label><p class="api-error" role="alert" hidden></p><button class="button-primary full" type="submit">${registering ? 'Create account' : 'Log in'} <span>↗</span></button></form></div>`);
}

function openProfile() {
  const customer = state.customer;
  if (!customer) return openAuth('login');
  showModal(`<button class="close-button dialog-close" data-action="close-modal" aria-label="Close profile">×</button><div class="quote-form-wrap account-modal"><div class="eyebrow">YOUR TECHNOWORLD ACCOUNT</div><h2 id="dialog-title">Customer profile</h2><p>Keep your contact and delivery details up to date.</p><form data-profile-form><label>Full name<input name="name" autocomplete="name" maxlength="80" required value="${escapeText(customer.name || '')}"></label><label>Email address<input type="email" value="${escapeText(customer.email || '')}" readonly></label><div class="form-row"><label>Phone number<input type="tel" name="phone" autocomplete="tel" value="${escapeText(customer.phone || '')}" placeholder="+91"></label><label>City<input name="city" autocomplete="address-level2" value="${escapeText(customer.city || '')}" placeholder="Your city"></label></div><label>Delivery address<input name="address" autocomplete="street-address" maxlength="180" value="${escapeText(customer.address || '')}" placeholder="Street, area, landmark"></label><label>Postal code<input name="postalCode" autocomplete="postal-code" maxlength="20" value="${escapeText(customer.postalCode || '')}" placeholder="PIN code"></label><p class="api-error" role="alert" hidden></p><div class="profile-actions"><button class="button-primary" type="submit">Save profile <span>✓</span></button><button class="button-text" type="button" data-action="logout">Log out</button></div></form></div>`);
}

async function restoreCustomerSession() {
  try {
    const response = await fetch('/api/auth/me');
    if (!response.ok) return;
    const result = await response.json();
    state.customer = result.customer;
    render();
  } catch { /* account service may be offline while browsing the static build */ }
}

async function submitAccountForm(form) {
  const submit = form.querySelector('button[type="submit"]'), errorBox = form.querySelector('.api-error');
  const mode = form.dataset.authForm;
  if (submit) { submit.disabled = true; submit.textContent = mode === 'register' ? 'Creating account…' : 'Logging in…'; }
  try {
    const payload = Object.fromEntries(new FormData(form).entries());
    const response = await fetch(`/api/auth/${mode}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Please try again.');
    state.customer = result.customer; closeModal(); render(); showToast(mode === 'register' ? 'Your account is ready' : `Welcome back, ${state.customer.name.split(' ')[0]}`);
  } catch (error) { errorBox.hidden = false; errorBox.textContent = error.message || 'We could not sign you in right now.'; if (submit) { submit.disabled = false; submit.textContent = mode === 'register' ? 'Create account' : 'Log in'; } }
}

async function saveProfile(form) {
  const submit = form.querySelector('button[type="submit"]'), errorBox = form.querySelector('.api-error');
  if (submit) { submit.disabled = true; submit.textContent = 'Saving…'; }
  try {
    const payload = Object.fromEntries(new FormData(form).entries());
    const response = await fetch('/api/auth/profile', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Please try again.');
    state.customer = result.customer; closeModal(); render(); showToast('Profile saved');
  } catch (error) { errorBox.hidden = false; errorBox.textContent = error.message || 'We could not save your profile.'; if (submit) { submit.disabled = false; submit.textContent = 'Save profile ✓'; } }
}

async function logout() {
  try { await fetch('/api/auth/logout', { method: 'POST' }); } finally { state.customer = null; closeModal(); render(); showToast('You are logged out'); }
}

function openPreview() {
  showModal(`<button class="close-button dialog-close" data-action="close-modal" aria-label="Close preview">×</button><div class="quote-form-wrap preview-modal"><div class="eyebrow">RGB DISPLAY PREVIEW</div><h2 id="dialog-title">See your message in real LEDs.</h2><p class="preview-intro">A running-text sign uses rows of individual RGB pixels. Type a message and watch it scroll.</p><div class="demo-workspace"><div class="led-housing"><span class="housing-screw screw-a"></span><span class="housing-screw screw-b"></span><span class="housing-screw screw-c"></span><span class="housing-screw screw-d"></span><div class="demo-screen"><canvas id="led-canvas" width="800" height="200" role="img" aria-label="Animated full-colour LED running display"></canvas></div><div class="demo-screen-caption"><span>5 MM PIXEL PITCH</span><span>FULL-COLOUR RGB · LIVE</span></div></div><div class="demo-controls"><label class="message-label" for="preview-text">YOUR MESSAGE<input id="preview-text" type="text" maxlength="42" value="${escapeText(state.previewText)}" placeholder="Type your message"></label><div class="color-picker"><span>LED MODE</span><div>${[['rgb','RGB'],['#ffcf56','Warm'],['#63ffd4','Mint'],['#67bfff','Blue'],['#ff68a8','Pink']].map(([color,label]) => `<button class="color-choice ${state.previewColor === color ? 'selected' : ''} ${color === 'rgb' ? 'rainbow-choice' : ''}" style="--swatch:${color === 'rgb' ? 'conic-gradient(#ff385d,#ffca3a,#70ef72,#38d9ff,#ab68ff,#ff385d)' : color}" data-color="${color}" aria-label="${label}" title="${label}"></button>`).join('')}</div></div><button class="button-primary demo-cta" data-action="quote-preview">Get a quote <span>↗</span></button></div></div></div>`);
  drawLedPreview();
}

function drawLedPreview() {
  if (state.previewFrame) cancelAnimationFrame(state.previewFrame);
  const canvas = document.querySelector('#led-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cols = 80, rows = 20, cw = canvas.width / cols, ch = canvas.height / rows;
  const textCanvas = document.createElement('canvas'); textCanvas.width = cols; textCanvas.height = rows;
  const textCtx = textCanvas.getContext('2d', { willReadFrequently: true });
  let offset = 0;
  const draw = () => {
    const message = (state.previewText || 'YOUR MESSAGE HERE').toUpperCase();
    textCtx.clearRect(0, 0, cols, rows);
    textCtx.fillStyle = '#fff'; textCtx.textAlign = 'left'; textCtx.textBaseline = 'middle';
    textCtx.font = `bold ${Math.min(15, Math.floor(rows * 0.8))}px Arial`;
    const width = textCtx.measureText(message).width;
    const long = width > cols - 8;
    if (long) { textCtx.fillText(message, cols - (offset % (width + cols)), rows / 2); offset += 0.32; }
    else { textCtx.textAlign = 'center'; textCtx.fillText(message, cols / 2, rows / 2); }
    const pixels = textCtx.getImageData(0, 0, cols, rows).data;
    const bg = ctx.createLinearGradient(0,0,0,canvas.height); bg.addColorStop(0,'#090d13'); bg.addColorStop(1,'#111922'); ctx.fillStyle = bg; ctx.fillRect(0,0,canvas.width,canvas.height);
    for (let y=0; y<rows; y++) for (let x=0; x<cols; x++) {
      const on = pixels[(y*cols+x)*4+3] > 90;
      const hue = state.previewColor === 'rgb' ? (x / cols * 360 + performance.now() * 0.018) % 360 : null;
      const color = hue === null ? state.previewColor : `hsl(${hue} 100% 58%)`;
      const px=x*cw+cw/2, py=y*ch+ch/2, radius=on?3.4:2.35;
      ctx.beginPath(); ctx.arc(px,py,radius,0,Math.PI*2); ctx.fillStyle=on?color:'#202a35';
      if(on){ctx.shadowColor=color;ctx.shadowBlur=8;} else ctx.shadowBlur=0;
      ctx.fill(); ctx.shadowBlur=0;
      if(on){ctx.beginPath();ctx.arc(px-0.45,py-0.45,0.9,0,Math.PI*2);ctx.fillStyle='#ffffffb8';ctx.fill();}
    }
    state.previewFrame = requestAnimationFrame(draw);
  };
  draw();
}

function openQuote(productId = '') {
  const selected = productId ? products.find(p => p.id === productId) : null;
  showModal(`<button class="close-button dialog-close" data-action="close-modal" aria-label="Close enquiry">×</button><div class="quote-form-wrap"><div class="eyebrow">LET’S TALK DETAILS</div><h2 id="dialog-title">${selected ? `Ask about ${selected.name}` : 'Tell us what you have in mind.'}</h2><p>Share a few details and our team will help with product fit, configuration and a quote.</p><form id="quote-form" data-form="quote"><label>Your name<input name="name" autocomplete="name" placeholder="Name" required></label><div class="form-row"><label>Phone<input name="phone" type="tel" autocomplete="tel" placeholder="+91" required></label><label>Email <span>(optional)</span><input name="email" type="email" autocomplete="email" placeholder="you@example.com"></label></div><label>Product or project<select name="product" required><option value="" disabled selected>Choose one</option>${products.map(p => `<option value="${p.name}" ${selected?.id === p.id ? 'selected' : ''}>${p.name}</option>`).join('')}<option>Something custom</option></select></label><label>What do you need?<textarea name="message" placeholder="Size, indoor/outdoor use, event date, quantity or your idea" rows="3">${selected ? `I’m interested in ${selected.name}. ${state.previewText !== 'YOUR MESSAGE HERE' ? `Please show this message: ${escapeText(state.previewText)}` : ''}` : ''}</textarea></label><button class="button-primary full" type="submit">Send enquiry <span>↗</span></button><small class="form-note">Your details go to our order team so we can confirm sizing, availability and final pricing.</small></form></div>`);
}

function checkout() {
  if (!cartCount()) { showToast('Add a product before continuing'); return; }
  const items = cartItems();
  const lines = items.map(({product:p,qty}) => `${qty} × ${p.name}`).join(', ');
  showModal(`<button class="close-button dialog-close" data-action="close-modal" aria-label="Close checkout">×</button><div class="quote-form-wrap"><div class="eyebrow">ENQUIRY CHECKOUT · ${cartCount()} ITEMS</div><h2 id="dialog-title">Let’s get your order started.</h2><p>Send your selection to the Techno World team. We’ll confirm exact specifications, final pricing, delivery and payment directly with you.</p><div class="checkout-list">${items.map(({product:p,qty}) => `<div><span>${p.name} <small>× ${qty}</small></span><b>${p.price ? `${money(p.price * qty)} <small>/ ${p.unit}</small>` : 'Quote needed'}</b></div>`).join('')}</div><form id="checkout-form" data-form="checkout"><label>Your name<input name="name" autocomplete="name" required placeholder="Name"></label><div class="form-row"><label>Phone<input name="phone" type="tel" autocomplete="tel" required placeholder="+91"></label><label>Email <span>(optional)</span><input name="email" type="email" autocomplete="email" placeholder="you@example.com"></label></div><label>Delivery city<input name="city" autocomplete="address-level2" placeholder="City"></label><label>Notes<textarea name="notes" rows="2" placeholder="Size, preferred finish, delivery timeline…">${lines}</textarea></label><button class="button-primary full" type="submit">Send order enquiry <span>↗</span></button><small class="form-note">No payment is collected online in this prototype. A team member will confirm the order.</small></form></div>`);
}

async function showConfirmation(form, type) {
  const submit = form.querySelector('button[type="submit"]');
  const originalLabel = submit?.innerHTML;
  const formData = Object.fromEntries(new FormData(form).entries());
  if (submit) { submit.disabled = true; submit.textContent = 'Sending…'; }
  let payload;
  let endpoint;
  if (type === 'order') {
    endpoint = '/api/orders';
    payload = {
      customer: { name: formData.name, phone: formData.phone, email: formData.email, city: formData.city },
      notes: formData.notes,
      items: cartItems().map(({ product, qty }) => ({ productId: product.id, quantity: qty }))
    };
  } else {
    endpoint = '/api/enquiries';
    payload = { customer: { name: formData.name, phone: formData.phone, email: formData.email }, product: formData.product, message: formData.message };
  }
  try {
    const response = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Please try again.');
    if (type === 'order') { state.cart = {}; persistCart(); }
    document.querySelector('#dialog').innerHTML = `<div class="confirmation"><div class="confirm-icon">✓</div><div class="eyebrow">${type === 'order' ? 'ORDER ENQUIRY RECEIVED' : 'ENQUIRY RECEIVED'}</div><h2 id="dialog-title">Thanks, ${escapeText(formData.name)}.</h2><p>Your reference is <b>${escapeText(result.reference)}</b>. Your enquiry has been recorded. Our team can follow up using the details you provided. For urgent help, call <a href="tel:${phone}">07942 637 520</a>.</p><button class="button-primary" data-action="close-modal">Back to the store <span>↗</span></button></div>`;
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = cartCount());
    bindEvents(document.querySelector('#dialog'));
  } catch (error) {
    let message = form.querySelector('.api-error');
    if (!message) { message = document.createElement('p'); message.className = 'api-error'; message.setAttribute('role', 'alert'); form.append(message); }
    message.textContent = error.message || 'We could not send your enquiry. Please try again or call us.';
    if (submit) { submit.disabled = false; submit.innerHTML = originalLabel; }
  }
}

function escapeText(value = '') { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

function bindEvents(root = document) {
  root.querySelectorAll('[data-audience]').forEach(el => el.addEventListener('click', () => { state.audience = el.dataset.audience; state.filter = 'All products'; render(); }));
  root.querySelectorAll('[data-filter]').forEach(el => el.addEventListener('click', () => { state.filter = el.dataset.filter; state.audience = 'all'; render(); }));
  root.querySelectorAll('[data-product]').forEach(el => el.addEventListener('click', () => openProduct(el.dataset.product)));
  root.querySelectorAll('[data-add]').forEach(el => el.addEventListener('click', event => { event.stopPropagation(); const id = el.dataset.add; closeModal(); addToCart(id); }));
  root.querySelectorAll('[data-ask]').forEach(el => el.addEventListener('click', () => openQuote(el.dataset.ask)));
  root.querySelectorAll('[data-auth-mode]').forEach(el => el.addEventListener('click', () => openAuth(el.dataset.authMode)));
  root.querySelectorAll('form[data-auth-form]').forEach(form => form.addEventListener('submit', event => { event.preventDefault(); submitAccountForm(event.currentTarget); }));
  root.querySelectorAll('form[data-profile-form]').forEach(form => form.addEventListener('submit', event => { event.preventDefault(); saveProfile(event.currentTarget); }));
  root.querySelectorAll('[data-action]').forEach(el => el.addEventListener('click', event => {
    const action = el.dataset.action;
    if (action === 'cart') openDrawer();
    if (action === 'account') openProfile();
    if (action === 'logout') logout();
    if (action === 'close-overlay') closeDrawer();
    if (action === 'close-modal') closeModal();
    if (action === 'quote') openQuote();
    if (action === 'quote-preview') openQuote('rgb-running-board');
    if (action === 'quote-festive') openQuote('rgb-running-board');
    if (action === 'live-preview') openPreview();
    if (action === 'shop-category') { state.filter = el.dataset.category; state.audience = 'all'; render(); goToPanel('#shop'); }
    if (action === 'checkout') checkout();
    if (action === 'reset-search') { state.query = ''; render(); }
    if (action === 'search') document.querySelector('#product-search')?.focus();
  }));
  root.querySelectorAll('[data-qty]').forEach(el => el.addEventListener('click', () => setQty(el.dataset.qty, (state.cart[el.dataset.qty] || 0) + Number(el.dataset.delta))));
  root.querySelectorAll('[data-remove]').forEach(el => el.addEventListener('click', () => setQty(el.dataset.remove, 0)));
  const previewInput = root.querySelector('#preview-text');
  if (previewInput) previewInput.addEventListener('input', event => { state.previewText = event.target.value.slice(0,42); });
  root.querySelectorAll('[data-color]').forEach(el => el.addEventListener('click', () => { state.previewColor = el.dataset.color; root.querySelectorAll('[data-color]').forEach(item => item.classList.toggle('selected', item.dataset.color === state.previewColor)); }));
  const search = root.querySelector('#product-search');
  if (search) search.addEventListener('input', event => { const pos = event.target.selectionStart; state.query = event.target.value; const oldTrack = document.querySelector('.horizontal-track'); const slide = oldTrack ? Math.round(oldTrack.scrollLeft / Math.max(1, oldTrack.clientWidth)) : 0; render(); const newTrack = document.querySelector('.horizontal-track'); newTrack?.scrollTo({left:slide * newTrack.clientWidth}); const next = document.querySelector('#product-search'); next.focus(); next.setSelectionRange(pos,pos); });
  root.querySelectorAll('form[data-form]').forEach(form => form.addEventListener('submit', event => { event.preventDefault(); showConfirmation(event.currentTarget, form.dataset.form === 'checkout' ? 'order' : 'quote'); }));
}

document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); goToPanel('#shop'); setTimeout(() => document.querySelector('#product-search')?.focus(), 450); }
  if (event.key === 'Escape') { closeDrawer(); closeModal(); }
});
window.addEventListener('popstate', () => {
  if (location.hash && document.querySelector(location.hash)?.closest('.horizontal-panel')) goToPanel(location.hash);
  else goToSlide(0);
});
window.addEventListener('storage', event => { if (event.key === 'tw-cart') { state.cart = JSON.parse(event.newValue || '{}'); render(); } });

render();
if (location.hash && document.querySelector(location.hash)?.closest('.horizontal-panel')) goToPanel(location.hash);
restoreCustomerSession();

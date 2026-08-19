/* =========================================================
   X SPANISH — storefront scripts
   ========================================================= */

/* ---------------------------------------------------------
   Catalogue
   Each product may belong to several merchandising groups
   via `groups` (new | best | shirts | ethnic | casual).

   These entries are the fallback shown before Supabase responds,
   and if it is unreachable or not configured yet. Once products
   exist in the dashboard they replace this list entirely.
   --------------------------------------------------------- */
let PRODUCTS = [
    { id: 1,  name: 'Linen Cuban-Collar Shirt',  brand: 'Heniis',         price: 1899, oldPrice: 2499, badge: 'New',  cat: 'shirts',
      groups: ['new', 'shirts', 'casual'],
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80' },

    { id: 2,  name: 'Slim-Fit Oxford Shirt',     brand: 'Peter England',  price: 1599, oldPrice: null, badge: null,   cat: 'shirts',
      groups: ['best', 'shirts'],
      image: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&auto=format&fit=crop&q=80' },

    { id: 3,  name: 'Printed Resort Shirt',      brand: 'North Republic', price: 1299, oldPrice: 1799, badge: 'Sale', cat: 'shirts',
      groups: ['new', 'shirts', 'casual'],
      image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&auto=format&fit=crop&q=80' },

    { id: 4,  name: 'Premium Cotton Polo',       brand: 'Allen Solly',    price: 999,  oldPrice: null, badge: 'New',  cat: 'tshirts',
      groups: ['new', 'casual'],
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=80' },

    { id: 5,  name: 'Oversized Graphic Tee',     brand: 'Nelly',          price: 799,  oldPrice: 1199, badge: 'Sale', cat: 'tshirts',
      groups: ['best', 'casual'],
      image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80' },

    { id: 6,  name: 'Crew-Neck Henley',          brand: 'Heniis',         price: 899,  oldPrice: null, badge: null,   cat: 'tshirts',
      groups: ['new', 'casual'],
      image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80' },

    { id: 7,  name: 'Distressed Slim Jeans',     brand: "Levi's",         price: 2299, oldPrice: 2999, badge: 'Sale', cat: 'jeans',
      groups: ['best', 'casual'],
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop&q=80' },

    { id: 8,  name: 'Tapered Dark-Wash Jeans',   brand: 'North Republic', price: 1899, oldPrice: null, badge: null,   cat: 'jeans',
      groups: ['new', 'casual'],
      image: 'https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?w=800&auto=format&fit=crop&q=80' },

    { id: 9,  name: 'Ivory Silk Sherwani',       brand: 'Manyavar',       price: 8499, oldPrice: null, badge: 'New',  cat: 'ethnic',
      groups: ['new', 'ethnic'],
      image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=800&auto=format&fit=crop&q=80' },

    { id: 10, name: 'Embroidered Kurta Set',     brand: 'Heniis',         price: 2799, oldPrice: 3499, badge: 'Sale', cat: 'ethnic',
      groups: ['best', 'ethnic'],
      image: 'https://images.unsplash.com/photo-1617886322207-6f504e7472c5?w=800&auto=format&fit=crop&q=80' },

    { id: 11, name: 'Tailored Wool Trousers',    brand: 'Van Heusen',     price: 2499, oldPrice: null, badge: null,   cat: 'trousers',
      groups: ['best'],
      image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80' },

    { id: 12, name: 'Heritage Plaid Overshirt',  brand: 'Allen Solly',    price: 2199, oldPrice: 2799, badge: 'Sale', cat: 'shirts',
      groups: ['new', 'shirts', 'casual'],
      image: 'https://images.unsplash.com/photo-1564859228273-274232fdb516?w=800&auto=format&fit=crop&q=80' },

    { id: 13, name: 'Mandarin-Collar Kurta',     brand: 'Heniis',         price: 1699, oldPrice: null, badge: null,   cat: 'ethnic',
      groups: ['ethnic', 'new'],
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80' },

    { id: 14, name: 'Satin Evening Shirt',       brand: 'Nelly',          price: 2099, oldPrice: null, badge: 'New',  cat: 'shirts',
      groups: ['shirts', 'new'],
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80' },

    { id: 15, name: 'Washed Chino Trousers',     brand: 'Peter England',  price: 1499, oldPrice: 1899, badge: 'Sale', cat: 'trousers',
      groups: ['casual', 'best'],
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80' },

    { id: 16, name: 'Banded-Collar Linen Shirt', brand: 'North Republic', price: 1799, oldPrice: null, badge: null,   cat: 'shirts',
      groups: ['shirts', 'casual'],
      image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80' },
];

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

/* Used when a product has no colours set in the dashboard. */
const DEFAULT_COLORS = [
    { name: 'Black', hex: '#1c1c1c' },
    { name: 'Navy',  hex: '#26364f' },
    { name: 'Beige', hex: '#d8cbb5' },
    { name: 'Olive', hex: '#5c6247' },
];

/* ---------- Helpers ---------- */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const money = n => '₹' + n.toLocaleString('en-IN');

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
}

/* =========================================================
   Boot
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileNav();
    initSearch();
    initHero();
    initMarquee();
    renderCarousels();
    initTabs();
    initCarouselNav();
    initQuickView();
    initCart();
    initReveal();
    initBackToTop();
    initNewsletter();

    // Swap in the live catalogue once it arrives; the fallback is
    // already on screen so there is nothing to wait for.
    loadCatalogue();
});

/* =========================================================
   Live catalogue (Supabase)
   ========================================================= */

/* Map a dashboard row onto the shape the storefront renders. */
function fromRow(row) {
    return {
        id: row.id,
        name: row.name,
        brand: row.brand || '',
        price: Number(row.price),
        oldPrice: row.old_price != null ? Number(row.old_price) : null,
        image: row.image_url || '',
        cat: row.category,
        groups: Array.isArray(row.collections) ? row.collections : [],
        sizes: Array.isArray(row.sizes) && row.sizes.length ? row.sizes : SIZES,
        colors: Array.isArray(row.colors) ? row.colors : [],
        isNew: !!row.is_new,
        offerTag: row.offer_tag || null,
        inStock: row.in_stock !== false,
    };
}

async function loadCatalogue() {
    if (!window.XS_API || !window.XS_API.isConfigured()) return;

    try {
        const rows = await window.XS_API.listProducts();
        if (!Array.isArray(rows) || !rows.length) return;   // keep fallback rather than emptying the page

        PRODUCTS = rows.filter(r => r.in_stock !== false).map(fromRow);
        renderCarousels();
        initCarouselNav();
    } catch (err) {
        // Storefront stays on the fallback catalogue; nothing user-facing breaks.
        console.warn('Live catalogue unavailable, using fallback.', err);
    }
}

/* =========================================================
   Header — solid on scroll, drops the announcement offset
   ========================================================= */
function initHeader() {
    const header = $('#header');
    const announcement = $('#announcement');
    if (!header) return;

    const announcementH = announcement ? announcement.offsetHeight : 0;

    // Inner pages have no full-bleed hero behind the header, so it stays solid.
    const alwaysSolid = header.classList.contains('header--static');

    const onScroll = () => {
        const y = window.scrollY;
        header.classList.toggle('is-solid', alwaysSolid || y > 40);
        header.classList.toggle('is-below-announcement', y < announcementH);
        if (y >= announcementH) {
            header.style.top = '0px';
        } else {
            header.style.top = (announcementH - y) + 'px';
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
}

/* =========================================================
   Mobile nav
   ========================================================= */
function initMobileNav() {
    const nav = $('#mobileNav');
    const burger = $('#burger');
    const closeBtn = $('#mobileNavClose');
    if (!nav || !burger) return;

    const open = () => {
        nav.classList.add('is-open');
        burger.classList.add('is-open');
        burger.setAttribute('aria-expanded', 'true');
        showOverlay();
    };

    const close = () => {
        nav.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        hideOverlay();
    };

    burger.addEventListener('click', () => {
        nav.classList.contains('is-open') ? close() : open();
    });
    closeBtn?.addEventListener('click', close);
    $$('a', nav).forEach(a => a.addEventListener('click', close));

    registerCloser(close);
}

/* =========================================================
   Overlay coordination
   Every drawer/panel registers a close fn; the overlay and
   the Escape key call all of them.
   ========================================================= */
const closers = [];
function registerCloser(fn) { closers.push(fn); }
function closeAll() { closers.forEach(fn => fn()); }

function showOverlay() {
    $('#overlay')?.classList.add('is-visible');
    document.body.classList.add('no-scroll');
}

function hideOverlay() {
    $('#overlay')?.classList.remove('is-visible');
    document.body.classList.remove('no-scroll');
}

document.addEventListener('click', e => {
    if (e.target.id === 'overlay') closeAll();
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAll();
});

/* =========================================================
   Search
   ========================================================= */
function initSearch() {
    const panel = $('#searchPanel');
    const btn = $('#searchBtn');
    const closeBtn = $('#searchClose');
    const input = $('#searchInput');
    const results = $('#searchResults');
    const empty = $('#searchEmpty');
    if (!panel || !btn) return;

    const open = () => {
        panel.classList.add('is-open');
        panel.setAttribute('aria-hidden', 'false');
        showOverlay();
        setTimeout(() => input?.focus(), 250);
    };

    const close = () => {
        panel.classList.remove('is-open');
        panel.setAttribute('aria-hidden', 'true');
        hideOverlay();
    };

    btn.addEventListener('click', open);
    closeBtn?.addEventListener('click', close);
    $('#searchForm')?.addEventListener('submit', e => e.preventDefault());

    input?.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        if (!q) {
            results.innerHTML = '';
            empty.textContent = 'Start typing to search our catalogue.';
            empty.style.display = '';
            return;
        }

        const hits = PRODUCTS.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.cat.toLowerCase().includes(q)
        );

        results.innerHTML = hits.map(productCardHTML).join('');
        empty.style.display = hits.length ? 'none' : '';
        if (!hits.length) empty.textContent = `No matches for "${input.value.trim()}".`;
    });

    registerCloser(close);
}

/* =========================================================
   Hero slider
   ========================================================= */
function initHero() {
    const slides = $$('.hero__slide');
    const dotsWrap = $('#heroDots');
    if (slides.length < 2 || !dotsWrap) return;

    let index = 0;
    let timer;

    dotsWrap.innerHTML = slides.map((_, i) =>
        `<button class="hero__dot${i === 0 ? ' is-active' : ''}" role="tab" aria-label="Slide ${i + 1}"></button>`
    ).join('');
    const dots = $$('.hero__dot', dotsWrap);

    const go = i => {
        slides[index].classList.remove('is-active');
        dots[index].classList.remove('is-active');
        index = (i + slides.length) % slides.length;
        slides[index].classList.add('is-active');
        dots[index].classList.add('is-active');
    };

    const start = () => { timer = setInterval(() => go(index + 1), 6000); };
    const stop = () => clearInterval(timer);

    dots.forEach((dot, i) => dot.addEventListener('click', () => {
        stop(); go(i); start();
    }));

    start();
}

/* =========================================================
   Marquee — duplicate the content so the -50% loop is seamless
   ========================================================= */
function initMarquee() {
    const track = $('#marqueeTrack');
    if (!track) return;
    track.innerHTML += track.innerHTML;
}

/* =========================================================
   Product cards + carousels
   ========================================================= */
function productCardHTML(p) {
    /* An offer tag wins the prominent slot; "New" sits alongside it.
       `badge` is the shape used by the built-in fallback entries. */
    const badges = [];
    if (p.offerTag) {
        badges.push(`<span class="product-card__badge product-card__badge--sale">${escapeHtml(p.offerTag)}</span>`);
    }
    if (p.isNew) {
        badges.push('<span class="product-card__badge product-card__badge--new">New</span>');
    }
    if (!badges.length && p.badge) {
        badges.push(`<span class="product-card__badge${p.badge === 'Sale' ? ' product-card__badge--sale' : ''}">${escapeHtml(p.badge)}</span>`);
    }
    const badge = badges.length ? `<div class="product-card__badges">${badges.join('')}</div>` : '';

    const oldPrice = p.oldPrice ? `<del>${money(p.oldPrice)}</del>` : '';

    return `
    <article class="product-card" data-id="${p.id}">
        <div class="product-card__media">
            ${badge}
            <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy">
            <button class="product-card__wish" aria-label="Add ${escapeHtml(p.name)} to wishlist">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.6-7-9.4A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.6C19 15.4 12 20 12 20Z"/></svg>
            </button>
            <button class="product-card__quick" data-quick="${p.id}">Quick View</button>
        </div>
        <div class="product-card__info">
            <h3 class="product-card__name">${escapeHtml(p.name)}</h3>
            <p class="product-card__price">${money(p.price)} ${oldPrice}</p>
        </div>
    </article>`;
}

function renderCarousels() {
    $$('.carousel__track').forEach(track => {
        const group = track.dataset.carousel;
        const items = PRODUCTS.filter(p => p.groups.includes(group));
        track.innerHTML = items.map(productCardHTML).join('');
    });

    // Wishlist toggles (delegated once, document-wide)
    document.addEventListener('click', e => {
        const wish = e.target.closest('.product-card__wish');
        if (wish) {
            e.preventDefault();
            wish.classList.toggle('is-active');
        }
    });
}

/* Tabs — New Arrivals / Bestsellers */
function initTabs() {
    const tabs = $$('.tab');
    if (!tabs.length) return;

    tabs.forEach(tab => tab.addEventListener('click', () => {
        tabs.forEach(t => {
            t.classList.remove('is-active');
            t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');

        $$('.tab-panel').forEach(p => p.classList.remove('is-active'));
        $(`#panel-${tab.dataset.tab}`)?.classList.add('is-active');
    }));
}

/* Carousel arrows */
function initCarouselNav() {
    $$('.carousel').forEach(carousel => {
        const track = $('.carousel__track', carousel);
        const prev = $('.carousel__nav--prev', carousel);
        const next = $('.carousel__nav--next', carousel);
        if (!track || !prev || !next) return;

        const step = () => {
            const first = track.firstElementChild;
            if (!first) return track.clientWidth;
            const gap = parseFloat(getComputedStyle(track).columnGap || '24');
            return first.getBoundingClientRect().width + gap;
        };

        const sync = () => {
            const max = track.scrollWidth - track.clientWidth - 2;
            prev.disabled = track.scrollLeft <= 2;
            next.disabled = track.scrollLeft >= max;
        };

        prev.addEventListener('click', () => track.scrollBy({ left: -step() * 2, behavior: 'smooth' }));
        next.addEventListener('click', () => track.scrollBy({ left:  step() * 2, behavior: 'smooth' }));

        track.addEventListener('scroll', sync, { passive: true });
        window.addEventListener('resize', sync);
        sync();
    });
}

/* =========================================================
   Quick view
   ========================================================= */
let currentProduct = null;

function initQuickView() {
    const modal = $('#quickView');
    if (!modal) return;

    document.addEventListener('click', e => {
        const trigger = e.target.closest('[data-quick]');
        if (trigger) {
            e.preventDefault();
            openQuickView(Number(trigger.dataset.quick));
        }
    });

    $$('[data-close-modal]', modal).forEach(el => el.addEventListener('click', closeQuickView));

    // Swatches + sizes
    $('#qvSwatches')?.addEventListener('click', e => {
        const sw = e.target.closest('.swatch');
        if (!sw) return;
        $$('.swatch').forEach(s => s.classList.remove('is-active'));
        sw.classList.add('is-active');
    });

    $('#qvSizes')?.addEventListener('click', e => {
        const btn = e.target.closest('.size-btn');
        if (!btn) return;
        $$('.size-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
    });

    // Quantity
    const qty = $('#qtyInput');
    $('#qtyMinus')?.addEventListener('click', () => {
        qty.value = Math.max(1, Number(qty.value) - 1);
    });
    $('#qtyPlus')?.addEventListener('click', () => {
        qty.value = Number(qty.value) + 1;
    });

    $('#addToCart')?.addEventListener('click', () => {
        if (!currentProduct) return;
        addToCart({
            id: currentProduct.id,
            name: currentProduct.name,
            brand: currentProduct.brand,
            price: currentProduct.price,
            image: currentProduct.image,
            color: $('.swatch.is-active')?.dataset.color || 'Black',
            size: $('.size-btn.is-active')?.textContent.trim() || 'M',
            qty: Math.max(1, Number(qty.value) || 1),
        });
        closeQuickView();
        openCart();
    });

    registerCloser(closeQuickView);
}

function openQuickView(id) {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    currentProduct = p;

    $('#qvImage').src = p.image;
    $('#qvImage').alt = p.name;
    $('#qvBrand').textContent = p.brand;
    $('#qvName').textContent = p.name;
    $('#qvPrice').innerHTML = money(p.price) + (p.oldPrice ? ` <del>${money(p.oldPrice)}</del>` : '');

    /* Options come from the product itself so the dashboard controls them. */
    const colors = (p.colors && p.colors.length) ? p.colors : DEFAULT_COLORS;
    $('#qvSwatches').innerHTML = colors.map((c, i) => `
        <button type="button" class="swatch${i === 0 ? ' is-active' : ''}"
                data-color="${escapeHtml(c.name)}"
                style="background:${escapeHtml(c.hex)}"
                aria-label="${escapeHtml(c.name)}"></button>`).join('');

    const sizes = (p.sizes && p.sizes.length) ? p.sizes : SIZES;
    $('#qvSizes').innerHTML = sizes.map((s, i) =>
        `<button type="button" class="size-btn${i === 0 ? ' is-active' : ''}">${escapeHtml(s)}</button>`
    ).join('');

    $('#qtyInput').value = 1;

    const modal = $('#quickView');
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
}

function closeQuickView() {
    const modal = $('#quickView');
    if (!modal || !modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    if (!$('#cartDrawer')?.classList.contains('is-open')) {
        document.body.classList.remove('no-scroll');
    }
}

/* =========================================================
   Cart
   ========================================================= */
const cart = [];

function lineKey(item) {
    return `${item.id}|${item.color}|${item.size}`;
}

function addToCart(item) {
    const existing = cart.find(l => lineKey(l) === lineKey(item));
    if (existing) {
        existing.qty += item.qty;
    } else {
        cart.push({ ...item });
    }
    renderCart();
}

function removeFromCart(key) {
    const i = cart.findIndex(l => lineKey(l) === key);
    if (i > -1) cart.splice(i, 1);
    renderCart();
}

function renderCart() {
    const body = $('#cartBody');
    const foot = $('#cartFoot');
    const count = $('#cartCount');
    if (!body) return;

    const totalQty = cart.reduce((n, l) => n + l.qty, 0);
    const total = cart.reduce((n, l) => n + l.price * l.qty, 0);

    if (count) {
        count.textContent = totalQty;
        count.classList.toggle('is-empty', totalQty === 0);
    }

    if (!cart.length) {
        body.innerHTML = `
        <div class="cart-empty">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 7h12l-1 14H7L6 7Z"/><path d="M9 7V5.5a3 3 0 0 1 6 0V7"/></svg>
            <p>Your bag is empty.</p>
        </div>`;
        if (foot) foot.hidden = true;
        return;
    }

    body.innerHTML = cart.map(l => `
        <div class="cart-item">
            <img src="${l.image}" alt="${escapeHtml(l.name)}">
            <div>
                <p class="cart-item__name">${escapeHtml(l.name)}</p>
                <p class="cart-item__opts">${escapeHtml(l.color)} &middot; ${escapeHtml(l.size)} &middot; Qty ${l.qty}</p>
                <p class="cart-item__price">${money(l.price * l.qty)}</p>
            </div>
            <button class="cart-item__remove" data-remove="${escapeHtml(lineKey(l))}">Remove</button>
        </div>
    `).join('');

    $('#cartTotal').textContent = money(total);
    if (foot) foot.hidden = false;
}

function openCart() {
    $('#cartDrawer')?.classList.add('is-open');
    $('#cartDrawer')?.setAttribute('aria-hidden', 'false');
    showOverlay();
}

function closeCart() {
    const drawer = $('#cartDrawer');
    if (!drawer || !drawer.classList.contains('is-open')) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    hideOverlay();
}

function initCart() {
    $('#cartBtn')?.addEventListener('click', openCart);
    $('#cartClose')?.addEventListener('click', closeCart);

    $('#cartBody')?.addEventListener('click', e => {
        const btn = e.target.closest('[data-remove]');
        if (btn) removeFromCart(btn.dataset.remove);
    });

    registerCloser(closeCart);
    renderCart();
}

/* =========================================================
   Reveal on scroll
   ========================================================= */
function initReveal() {
    let els = $$('.reveal');
    if (!els.length) return;

    let ticking = false;

    const check = () => {
        ticking = false;
        const limit = window.innerHeight - 60;

        els = els.filter(el => {
            // Reveal anything that has reached the trigger line, including
            // everything already scrolled past on a deep link.
            if (el.getBoundingClientRect().top < limit) {
                el.classList.add('is-visible');
                return false;
            }
            return true;
        });

        if (!els.length) {
            window.removeEventListener('scroll', request);
            window.removeEventListener('resize', request);
        }
    };

    const request = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(check);
    };

    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    window.addEventListener('load', check);
    // Background tabs freeze rAF, so catch up once the page is looked at.
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) check();
    });
    check();
}

/* =========================================================
   Back to top
   ========================================================= */
function initBackToTop() {
    const btn = $('#backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('is-visible', window.scrollY > 600);
    }, { passive: true });

    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* =========================================================
   Newsletter
   ========================================================= */
function initNewsletter() {
    const form = $('#newsletterForm');
    const status = $('#formStatus');
    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const email = $('#newsletterEmail').value.trim();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            status.textContent = 'Please enter a valid email address.';
            status.className = 'form-status is-err';
            return;
        }

        status.textContent = 'Subscribing…';
        status.className = 'form-status';

        try {
            const res = await fetch('submit.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ email, source: 'newsletter' }),
            });
            if (!res.ok) throw new Error('Request failed');
            status.textContent = 'Thank you — you are on the list.';
            status.className = 'form-status is-ok';
            form.reset();
        } catch (err) {
            // Static hosting without PHP still gives the visitor a clear outcome.
            status.textContent = 'Could not subscribe right now. Please email fashion@xspanish.in.';
            status.className = 'form-status is-err';
        }
    });
}

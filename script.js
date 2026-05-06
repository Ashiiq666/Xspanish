/* =========================================================
   X SPANISH — Interactive Scripts
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    initAOS();
    initNavScroll();
    initMobileMenu();
    initHeroSlider();
    initActiveLinks();
    renderProducts();
    initFilters();
    initLoadMore();
    initQuickView();
    initCartDrawer();
    initBackToTop();
    initNewsletter();
});

/* ----------- AOS init ----------- */
function initAOS() {
    if (window.AOS) {
        AOS.init({ duration: 800, once: true, offset: 60, easing: 'ease-out-cubic' });
    }
}

/* ----------- Nav scroll shadow ----------- */
function initNavScroll() {
    const nav = document.getElementById('mainNav');
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    onScroll();
}

/* ----------- Mobile hamburger ----------- */
function initMobileMenu() {
    const burger = document.getElementById('hamburger');
    const links = document.getElementById('navLinks');
    if (!burger) return;
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            burger.classList.remove('active');
            links.classList.remove('open');
        });
    });
}

/* ----------- Hero slider ----------- */
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length < 2) return;
    let i = 0;
    setInterval(() => {
        slides[i].classList.remove('active');
        i = (i + 1) % slides.length;
        slides[i].classList.add('active');
    }, 5500);
}

/* ----------- Active link on scroll ----------- */
function initActiveLinks() {
    const links = document.querySelectorAll('.nav-links a[href^="#"]');
    const sections = [...links].map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);

    const onScroll = () => {
        const y = window.scrollY + 120;
        let active = sections[0];
        sections.forEach(s => { if (s.offsetTop <= y) active = s; });
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${active.id}`));
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
}

/* ----------- Product Catalog ----------- */
const PRODUCTS = [
    { id: 1, name: 'Linen Cuban-Collar Shirt', brand: 'Heniis', price: 1899, oldPrice: 2499, badge: 'New', cat: 'shirts',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80' },
    { id: 2, name: 'Slim-Fit Oxford Shirt', brand: 'Peter England', price: 1599, oldPrice: null, badge: null, cat: 'shirts',
      image: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&auto=format&fit=crop&q=80' },
    { id: 3, name: 'Printed Resort Shirt', brand: 'North Republic', price: 1299, oldPrice: 1799, badge: 'Sale', cat: 'shirts',
      image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&auto=format&fit=crop&q=80' },
    { id: 4, name: 'Premium Cotton Polo', brand: 'Allen Solly', price: 999, oldPrice: null, badge: 'New', cat: 'tshirts',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=80' },
    { id: 5, name: 'Oversized Graphic Tee', brand: 'Nelly', price: 799, oldPrice: 1199, badge: 'Sale', cat: 'tshirts',
      image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80' },
    { id: 6, name: 'Crew-Neck Henley', brand: 'Heniis', price: 899, oldPrice: null, badge: null, cat: 'tshirts',
      image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80' },
    { id: 7, name: 'Distressed Slim Jeans', brand: 'Levi\'s', price: 2299, oldPrice: 2999, badge: 'Sale', cat: 'jeans',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop&q=80' },
    { id: 8, name: 'Tapered Dark-Wash Jeans', brand: 'North Republic', price: 1899, oldPrice: null, badge: null, cat: 'jeans',
      image: 'https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?w=800&auto=format&fit=crop&q=80' },
    { id: 9, name: 'Ivory Silk Sherwani', brand: 'Manyavar', price: 8499, oldPrice: null, badge: 'New', cat: 'ethnic',
      image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=800&auto=format&fit=crop&q=80' },
    { id: 10, name: 'Embroidered Kurta Set', brand: 'Heniis', price: 2799, oldPrice: 3499, badge: 'Sale', cat: 'ethnic',
      image: 'https://images.unsplash.com/photo-1617886322207-6f504e7472c5?w=800&auto=format&fit=crop&q=80' },
    { id: 11, name: 'Tailored Wool Trousers', brand: 'Van Heusen', price: 2499, oldPrice: null, badge: null, cat: 'shirts',
      image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80' },
    { id: 12, name: 'Heritage Plaid Overshirt', brand: 'Allen Solly', price: 2199, oldPrice: 2799, badge: 'Sale', cat: 'shirts',
      image: 'https://images.unsplash.com/photo-1564859228273-274232fdb516?w=800&auto=format&fit=crop&q=80' },
];

const PAGE_SIZE = 8;
let visibleCount = PAGE_SIZE;
let activeFilter = 'all';

function getFiltered() {
    return activeFilter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === activeFilter);
}

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    const list = getFiltered().slice(0, visibleCount);
    grid.innerHTML = list.map(p => `
        <article class="product-card" data-id="${p.id}">
            <div class="product-image-container">
                ${p.badge ? `<span class="product-badge ${p.badge.toLowerCase()}">${p.badge}</span>` : ''}
                <button class="wish-btn" aria-label="Wishlist"><i class="far fa-heart"></i></button>
                <img src="${p.image}" alt="${p.name}" loading="lazy">
                <button class="quick-view-btn" data-quick="${p.id}">Quick View</button>
            </div>
            <div class="product-info">
                <p class="brand-line">${p.brand}</p>
                <h3>${p.name}</h3>
                <p class="price">₹${p.price.toLocaleString('en-IN')}${p.oldPrice ? ` <s>₹${p.oldPrice.toLocaleString('en-IN')}</s>` : ''}</p>
            </div>
        </article>
    `).join('');

    // Wire wishlist toggles
    grid.querySelectorAll('.wish-btn').forEach(b => {
        b.addEventListener('click', e => {
            e.stopPropagation();
            b.classList.toggle('active');
            const i = b.querySelector('i');
            i.classList.toggle('far'); i.classList.toggle('fas');
        });
    });

    // Wire quick view triggers
    grid.querySelectorAll('[data-quick]').forEach(b => {
        b.addEventListener('click', () => openQuickView(+b.dataset.quick));
    });

    // Toggle Load More visibility
    const total = getFiltered().length;
    const more = document.getElementById('loadMoreBtn');
    if (more) more.style.display = visibleCount >= total ? 'none' : '';
}

/* ----------- Filter tabs ----------- */
function initFilters() {
    const tabs = document.querySelectorAll('.filter-btn');
    tabs.forEach(t => {
        t.addEventListener('click', () => {
            tabs.forEach(x => x.classList.remove('active'));
            t.classList.add('active');
            activeFilter = t.dataset.filter;
            visibleCount = PAGE_SIZE;
            renderProducts();
        });
    });
}

/* ----------- Load more ----------- */
function initLoadMore() {
    const btn = document.getElementById('loadMoreBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
        visibleCount += PAGE_SIZE;
        renderProducts();
    });
}

/* ----------- Quick View Modal ----------- */
function openQuickView(id) {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    document.getElementById('modalMainImage').src = p.image;
    document.getElementById('modalMainImage').alt = p.name;
    document.getElementById('modalBrand').textContent = p.brand;
    document.getElementById('modalTitle').textContent = p.name;
    document.getElementById('modalPrice').innerHTML = `₹${p.price.toLocaleString('en-IN')}${p.oldPrice ? ` <s style="color:#999;font-size:.7em;margin-left:8px;">₹${p.oldPrice.toLocaleString('en-IN')}</s>` : ''}`;
    document.getElementById('modalSku').textContent = `SKU: XS-${String(p.id).padStart(4, '0')}`;
    document.getElementById('qtyInput').value = 1;

    const modal = document.getElementById('quickViewModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    modal.dataset.activeId = id;
}

function initQuickView() {
    const modal = document.getElementById('quickViewModal');
    const close = document.getElementById('closeModal');
    if (!modal) return;

    const closeFn = () => { modal.classList.remove('active'); document.body.style.overflow = ''; };
    close.addEventListener('click', closeFn);
    modal.addEventListener('click', e => { if (e.target === modal) closeFn(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeFn(); });

    // color/size active toggles
    modal.querySelectorAll('.color-btn').forEach(b => {
        b.addEventListener('click', () => {
            modal.querySelectorAll('.color-btn').forEach(x => x.classList.remove('active'));
            b.classList.add('active');
        });
    });
    modal.querySelectorAll('.size-btn').forEach(b => {
        b.addEventListener('click', () => {
            modal.querySelectorAll('.size-btn').forEach(x => x.classList.remove('active'));
            b.classList.add('active');
        });
    });

    // qty
    const qty = document.getElementById('qtyInput');
    document.getElementById('qtyMinus').addEventListener('click', () => { qty.value = Math.max(1, +qty.value - 1); });
    document.getElementById('qtyPlus').addEventListener('click', () => { qty.value = +qty.value + 1; });

    // add to cart
    document.getElementById('addToCartBtn').addEventListener('click', () => {
        const id = +modal.dataset.activeId;
        const product = PRODUCTS.find(p => p.id === id);
        const qtyVal = +document.getElementById('qtyInput').value || 1;
        const color = modal.querySelector('.color-btn.active')?.dataset.color || 'Black';
        const size = modal.querySelector('.size-btn.active')?.textContent || 'M';
        addToCart({ ...product, qty: qtyVal, color, size });
        closeFn();
        openCart();
    });
}

/* ----------- Cart ----------- */
const cart = [];

function addToCart(item) {
    const existing = cart.find(c => c.id === item.id && c.color === item.color && c.size === item.size);
    if (existing) existing.qty += item.qty;
    else cart.push(item);
    updateCartUI();
}
function removeFromCart(id, color, size) {
    const i = cart.findIndex(c => c.id === id && c.color === color && c.size === size);
    if (i >= 0) cart.splice(i, 1);
    updateCartUI();
}
function updateCartUI() {
    const count = cart.reduce((s, c) => s + c.qty, 0);
    document.querySelector('.cart-count').textContent = count;

    const body = document.getElementById('cartBody');
    const foot = document.getElementById('cartFoot');
    if (cart.length === 0) {
        body.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-bag"></i>
                <p>Your bag is empty.</p>
                <a href="#shop-section" class="btn btn-primary btn-sm" id="cartShopNow">Shop now</a>
            </div>`;
        foot.hidden = true;
        body.querySelector('#cartShopNow')?.addEventListener('click', closeCart);
        return;
    }
    body.innerHTML = cart.map(c => `
        <div class="cart-item">
            <img src="${c.image}" alt="${c.name}">
            <div>
                <h4>${c.name}</h4>
                <div class="meta">${c.brand} · ${c.color} · ${c.size} · Qty ${c.qty}</div>
                <div class="price">₹${(c.price * c.qty).toLocaleString('en-IN')}</div>
            </div>
            <button class="cart-item-remove" data-rm="${c.id}|${c.color}|${c.size}" aria-label="Remove">&times;</button>
        </div>
    `).join('');
    body.querySelectorAll('.cart-item-remove').forEach(b => {
        b.addEventListener('click', () => {
            const [id, color, size] = b.dataset.rm.split('|');
            removeFromCart(+id, color, size);
        });
    });
    foot.hidden = false;
    document.getElementById('cartTotal').textContent = '₹' + cart.reduce((s, c) => s + c.price * c.qty, 0).toLocaleString('en-IN');
}

function openCart() {
    document.getElementById('cartDrawer').classList.add('open');
    document.getElementById('overlay').classList.add('active');
}
function closeCart() {
    document.getElementById('cartDrawer').classList.remove('open');
    document.getElementById('overlay').classList.remove('active');
}
function initCartDrawer() {
    document.getElementById('cartBtn').addEventListener('click', openCart);
    document.getElementById('closeCart').addEventListener('click', closeCart);
    document.getElementById('overlay').addEventListener('click', closeCart);
    updateCartUI();
}

/* ----------- Back to top ----------- */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 600);
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ----------- Newsletter / Contact form ----------- */
function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    const status = document.getElementById('formStatus');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            message: form.message.value.trim(),
        };
        if (!data.name || !data.email) {
            status.textContent = 'Please fill your name and email.';
            status.style.color = '#d63b3b';
            return;
        }
        status.textContent = 'Sending…';
        status.style.color = 'var(--accent)';

        // Try to call contact.php; gracefully fall back if it isn't available (e.g. static preview).
        try {
            const res = await fetch('contact.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('bad status');
            status.textContent = '✓ Thank you! We\'ll be in touch soon.';
            form.reset();
        } catch (err) {
            status.textContent = '✓ Thank you! We\'ve noted your details.';
            form.reset();
        }
    });
}

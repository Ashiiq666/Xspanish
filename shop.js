/* =========================================================
   X SPANISH — category and style browsing
   ---------------------------------------------------------
   Two states on one page:
     shop.html?cat=shirts          -> style cards for that category
     shop.html?cat=shirts&style=X  -> products filed under that style

   Every count and card is derived from real stock. Categories and
   styles with nothing in them are never rendered.
   ========================================================= */

(function () {
    'use strict';

    const $ = (s, c = document) => c.querySelector(s);
    const CAT = window.XS_CATALOG;

    const esc = s => String(s ?? '').replace(/[&<>"']/g,
        c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    const params = new URLSearchParams(location.search);
    const category = (params.get('cat') || '').trim();
    const style = (params.get('style') || '').trim();

    document.addEventListener('DOMContentLoaded', async () => {
        // script.js kicks off the catalogue fetch; wait on the same promise
        // rather than issuing a second request.
        try { await window.XS_CATALOGUE_READY; } catch (_) { /* falls back below */ }

        const products = (window.PRODUCTS || []).filter(p => p.inStock !== false);

        buildNav(products);
        render(products);
        hide($('#loadingState'));
    });

    function hide(el) { if (el) el.hidden = true; }
    function show(el) { if (el) el.hidden = false; }

    /* ---------- shared nav / footer links ---------- */
    function buildNav(products) {
        const cats = CAT.categoriesWithCounts(products).filter(c => c.count > 0);

        const links = cats.map(c =>
            `<a href="${CAT.shopUrl(c.key)}">${esc(c.label)}</a>`).join('');
        const dropdown = $('#navShopMenu');
        const mobile = $('#mobileShopMenu');
        if (dropdown) dropdown.innerHTML = links;
        if (mobile) mobile.innerHTML = links;

        const footer = $('#footerShopLinks');
        if (footer) {
            footer.innerHTML = cats.map(c =>
                `<li><a href="${CAT.shopUrl(c.key)}">${esc(c.label)}</a></li>`).join('')
                || '<li><a href="index.html#new">New Arrivals</a></li>';
        }
    }

    /* ---------- routing ---------- */
    function render(products) {
        if (!category) return renderAllCategories(products);

        const label = CAT.categoryLabel(category);
        const inCategory = products.filter(p => p.cat === category);

        if (!inCategory.length) {
            return renderEmpty(label, 'Nothing in this category yet.',
                [{ label: 'Shop', url: 'index.html#categories' }]);
        }

        return style
            ? renderProducts(products, label)
            : renderStyles(inCategory, label);
    }

    /* ---------- landing: all categories ---------- */
    function renderAllCategories(products) {
        const cats = CAT.categoriesWithCounts(products).filter(c => c.count > 0);
        setHead('Shop', cats.length ? 'Browse the full range by category.' : '', []);

        if (!cats.length) {
            return renderEmpty('Shop', 'No products yet — check back shortly.', []);
        }

        const grid = $('#styleGrid');
        grid.innerHTML = cats.map(c => cardHTML(CAT.shopUrl(c.key), c.image, c.label, itemLabel(c.count))).join('');
        show(grid);
    }

    /* ---------- category: style cards ---------- */
    function renderStyles(inCategory, label) {
        const styles = CAT.stylesWithCounts(inCategory, category);
        const unfiled = inCategory.filter(p => !(p.style || '').trim()).length;

        setHead(label, 'Choose a style.', [{ label: 'Shop', url: 'shop.html' }]);

        const grid = $('#styleGrid');
        const cards = styles.map(s =>
            cardHTML(CAT.shopUrl(category, s.style), s.image, s.style, itemLabel(s.count)));

        // Products with no style set would otherwise be unreachable
        if (unfiled) {
            const p = inCategory.find(x => !(x.style || '').trim() && x.image);
            cards.push(cardHTML(CAT.shopUrl(category, '__all'), p ? p.image : null,
                'All ' + label, itemLabel(inCategory.length)));
        }

        if (!cards.length) {
            return renderEmpty(label, 'No styles set for this category yet.',
                [{ label: 'Shop', url: 'shop.html' }]);
        }

        grid.innerHTML = cards.join('');
        show(grid);
    }

    /* ---------- style: product grid ---------- */
    function renderProducts(products, label) {
        const showAll = style === '__all';
        const items = products.filter(p =>
            p.cat === category && (showAll || (p.style || '').trim() === style));

        const heading = showAll ? 'All ' + label : style;
        setHead(heading, itemLabel(items.length), [
            { label: 'Shop', url: 'shop.html' },
            { label, url: CAT.shopUrl(category) },
        ]);

        if (!items.length) {
            return renderEmpty(heading, 'Nothing in this style yet.',
                [{ label, url: CAT.shopUrl(category) }]);
        }

        const grid = $('#productGrid');
        grid.innerHTML = items.map(window.productCardHTML).join('');
        show(grid);
    }

    /* ---------- helpers ---------- */
    const itemLabel = n => n + (n === 1 ? ' item' : ' items');

    function cardHTML(url, image, title, sub) {
        const media = image
            ? `<img src="${esc(image)}" alt="${esc(title)}" loading="lazy">`
            : '<span class="style-card__blank"></span>';
        return `
        <a class="style-card" href="${esc(url)}">
            <span class="style-card__media">${media}</span>
            <span class="style-card__label">
                <span class="style-card__title">${esc(title)}</span>
                <span class="style-card__count">${esc(sub)}</span>
            </span>
        </a>`;
    }

    function setHead(title, sub, crumbs) {
        document.title = title + ' — X SPANISH';
        $('#pageTitle').textContent = title;
        $('#pageSub').textContent = sub || '';

        const trail = [{ label: 'Home', url: 'index.html' }, ...crumbs];
        $('#crumbs').innerHTML =
            trail.map(c => `<a href="${esc(c.url)}">${esc(c.label)}</a>`).join('<span>/</span>') +
            `<span>/</span><em>${esc(title)}</em>`;
    }

    function renderEmpty(title, message, crumbs) {
        setHead(title, '', crumbs);
        $('#emptyText').textContent = message;
        show($('#emptyState'));
    }
})();

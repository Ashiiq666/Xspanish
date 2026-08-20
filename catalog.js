/* =========================================================
   X SPANISH — catalogue taxonomy
   ---------------------------------------------------------
   One definition of categories and their styles, shared by the
   storefront, the style pages and the dashboard.

   Counts and style cards are always DERIVED from real products —
   nothing here asserts that a category or style has stock. A
   category with no products is hidden, and a style card only
   appears once something is filed under it.
   ========================================================= */

(function (global) {
    'use strict';

    /* Order here is the order shown on the homepage. `image` is only a
       fallback: a category shows its newest product photo when it has one. */
    const CATEGORIES = [
        { key: 'shirts',      label: 'Shirts',      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1200&auto=format&fit=crop&q=80' },
        { key: 'tshirts',     label: 'T-Shirts',    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&auto=format&fit=crop&q=80' },
        { key: 'jeans',       label: 'Jeans',       image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=700&auto=format&fit=crop&q=80' },
        { key: 'trousers',    label: 'Trousers',    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=700&auto=format&fit=crop&q=80' },
        { key: 'ethnic',      label: 'Ethnic',      image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=700&auto=format&fit=crop&q=80' },
        { key: 'accessories', label: 'Accessories', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=700&auto=format&fit=crop&q=80' },
    ];

    /* Suggestions offered in the dashboard. Editors can type their own —
       any style that ends up on a product gets its own card automatically. */
    const STYLES = {
        shirts:      ['Formal', 'Casual', 'Printed', 'Solid', 'Linen', 'Embroidery', 'Ceremonial'],
        tshirts:     ['Plain', 'Graphic', 'Polo', 'Oversized', 'Henley'],
        jeans:       ['Slim Fit', 'Straight', 'Tapered', 'Distressed', 'Dark Wash'],
        trousers:    ['Formal', 'Chino', 'Cargo', 'Pleated'],
        ethnic:      ['Kurta', 'Kurta Set', 'Sherwani', 'Nehru Jacket', 'Dhoti Set'],
        accessories: ['Belts', 'Wallets', 'Watches', 'Caps', 'Socks'],
    };

    const categoryLabel = key => {
        const c = CATEGORIES.find(x => x.key === key);
        return c ? c.label : key;
    };

    /* URL for a category's style listing, or a style's product listing. */
    const shopUrl = (category, style) =>
        'shop.html?cat=' + encodeURIComponent(category) +
        (style ? '&style=' + encodeURIComponent(style) : '');

    /* Group products by style, preserving the suggested order first and
       appending any custom styles the editor invented. */
    function stylesWithCounts(products, category) {
        const inCategory = products.filter(p => p.cat === category || p.category === category);

        const buckets = new Map();
        inCategory.forEach(p => {
            const style = (p.style || '').trim();
            if (!style) return;                       // unfiled products still show under the category
            if (!buckets.has(style)) buckets.set(style, []);
            buckets.get(style).push(p);
        });

        const suggested = STYLES[category] || [];
        const ordered = [
            ...suggested.filter(s => buckets.has(s)),
            ...[...buckets.keys()].filter(s => !suggested.includes(s)).sort(),
        ];

        return ordered.map(style => {
            const items = buckets.get(style);
            const withImage = items.find(p => p.image || p.image_url);
            return {
                style,
                count: items.length,
                image: withImage ? (withImage.image || withImage.image_url) : null,
            };
        });
    }

    function categoriesWithCounts(products) {
        return CATEGORIES.map(c => {
            const items = products.filter(p => (p.cat || p.category) === c.key);
            const withImage = items.find(p => p.image || p.image_url);
            return {
                ...c,
                count: items.length,
                // Prefer real stock photography over the placeholder
                image: withImage ? (withImage.image || withImage.image_url) : c.image,
            };
        });
    }

    global.XS_CATALOG = {
        CATEGORIES, STYLES,
        categoryLabel, shopUrl,
        stylesWithCounts, categoriesWithCounts,
    };
})(window);

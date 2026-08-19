/* =========================================================
   X SPANISH — Dashboard logic
   ========================================================= */

(function () {
    'use strict';

    const $ = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => [...c.querySelectorAll(s)];

    const API = window.XS_API;

    /* Colours offered by default; editors can add their own too. */
    const PRESET_COLORS = [
        { name: 'Black',  hex: '#1c1c1c' },
        { name: 'White',  hex: '#f5f5f5' },
        { name: 'Navy',   hex: '#26364f' },
        { name: 'Beige',  hex: '#d8cbb5' },
        { name: 'Olive',  hex: '#5c6247' },
        { name: 'Grey',   hex: '#8a8a8a' },
        { name: 'Maroon', hex: '#6d2b2b' },
        { name: 'Blue',   hex: '#3f6fa8' },
    ];

    const CATEGORY_LABELS = {
        shirts: 'Shirts', tshirts: 'T-Shirts', jeans: 'Jeans',
        trousers: 'Trousers', ethnic: 'Ethnic', accessories: 'Accessories',
    };

    let products = [];       // everything loaded from Supabase
    let editingId = null;    // null = creating
    let pendingImage = null; // {path, url} uploaded but not yet saved
    let currentColors = [];  // colours on the product being edited
    let deleteTarget = null;

    const money = n => '₹' + Number(n).toLocaleString('en-IN');
    const esc = s => String(s ?? '').replace(/[&<>"']/g,
        c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    /* =====================================================
       Boot
       ===================================================== */
    document.addEventListener('DOMContentLoaded', () => {
        if (!API || !API.isConfigured()) {
            show($('#setupGate'));
            return;
        }
        bindLogin();
        bindApp();
        bindEditor();
        bindConfirm();

        const session = API.readSession();
        if (session) enterApp(session);
        else show($('#loginView'));
    });

    function show(el) { if (el) el.hidden = false; }
    function hide(el) { if (el) el.hidden = true; }

    function toast(message, isError) {
        const el = $('#toast');
        el.textContent = message;
        el.classList.toggle('is-error', !!isError);
        el.hidden = false;
        requestAnimationFrame(() => el.classList.add('is-visible'));
        clearTimeout(toast._t);
        toast._t = setTimeout(() => {
            el.classList.remove('is-visible');
            setTimeout(() => { el.hidden = true; }, 250);
        }, 2800);
    }

    /* =====================================================
       Login
       ===================================================== */
    function bindLogin() {
        $('#loginForm').addEventListener('submit', async e => {
            e.preventDefault();
            const btn = $('#loginBtn');
            const err = $('#loginError');
            err.textContent = '';
            btn.disabled = true;
            btn.textContent = 'Signing in…';

            try {
                const session = await API.signIn($('#loginEmail').value.trim(), $('#loginPassword').value);
                $('#loginPassword').value = '';
                hide($('#loginView'));
                enterApp(session);
            } catch (ex) {
                err.textContent = friendlyAuthError(ex.message);
            } finally {
                btn.disabled = false;
                btn.textContent = 'Sign in';
            }
        });
    }

    function friendlyAuthError(msg) {
        if (/invalid login credentials/i.test(msg)) return 'That email and password combination is not recognised.';
        if (/email not confirmed/i.test(msg)) return 'This account still needs its email confirmed in Supabase.';
        if (/failed to fetch/i.test(msg)) return 'Could not reach Supabase. Check the URL in config.js.';
        return msg;
    }

    function enterApp(session) {
        hide($('#loginView'));
        show($('#appView'));
        const email = session && session.user && session.user.email;
        $('#currentUser').textContent = email || '';
        loadProducts();
    }

    function bindApp() {
        $('#signOutBtn').addEventListener('click', () => {
            API.signOut();
            hide($('#appView'));
            show($('#loginView'));
        });

        $('#addBtn').addEventListener('click', () => openEditor(null));
        $('#emptyAddBtn').addEventListener('click', () => openEditor(null));
        $('#searchInput').addEventListener('input', render);
        $('#filterCategory').addEventListener('change', render);
    }

    /* =====================================================
       Load + render
       ===================================================== */
    async function loadProducts() {
        const err = $('#listError');
        hide(err);
        show($('#loadingState'));

        try {
            products = await API.listProducts();
            render();
        } catch (ex) {
            err.textContent = ex.message;
            show(err);
            $('#productRows').innerHTML = '';
        } finally {
            hide($('#loadingState'));
        }
    }

    function visibleProducts() {
        const q = $('#searchInput').value.trim().toLowerCase();
        const cat = $('#filterCategory').value;

        return products.filter(p => {
            if (cat && p.category !== cat) return false;
            if (!q) return true;
            return (p.name || '').toLowerCase().includes(q) ||
                   (p.brand || '').toLowerCase().includes(q);
        });
    }

    function render() {
        const rows = visibleProducts();
        const tbody = $('#productRows');

        $('#productCount').textContent = products.length;

        if (!rows.length) {
            tbody.innerHTML = '';
            $('#emptyText').textContent = products.length
                ? 'No products match your search.'
                : 'No products yet.';
            $('#emptyAddBtn').hidden = products.length > 0;
            show($('#emptyState'));
            return;
        }

        hide($('#emptyState'));

        tbody.innerHTML = rows.map(p => {
            const tags = [];
            if (p.is_new) tags.push('<span class="pill pill--new">New</span>');
            if (p.offer_tag) tags.push(`<span class="pill pill--offer">${esc(p.offer_tag)}</span>`);
            if (!p.in_stock) tags.push('<span class="pill pill--out">Out of stock</span>');
            (p.colors || []).forEach(c => {
                tags.push(`<span class="pill"><span class="swatch-dot" style="background:${esc(c.hex)}"></span>${esc(c.name)}</span>`);
            });

            const img = p.image_url
                ? `<img class="thumb" src="${esc(p.image_url)}" alt="">`
                : '<div class="thumb thumb--empty">No image</div>';

            return `
            <tr>
                <td class="col-img">${img}</td>
                <td>
                    <div class="cell-name">${esc(p.name)}</div>
                    ${p.brand ? `<div class="cell-brand">${esc(p.brand)}</div>` : ''}
                </td>
                <td>${esc(CATEGORY_LABELS[p.category] || p.category)}</td>
                <td>
                    <span class="price-now">${money(p.price)}</span>
                    ${p.old_price ? `<span class="price-was">${money(p.old_price)}</span>` : ''}
                </td>
                <td>${tags.join('') || '<span class="cell-brand">—</span>'}</td>
                <td class="sizes-cell">${(p.sizes || []).join(' · ') || '—'}</td>
                <td class="col-actions">
                    <div class="row-actions">
                        <button class="icon-btn" data-edit="${esc(p.id)}">Edit</button>
                        <button class="icon-btn icon-btn--danger" data-del="${esc(p.id)}">Delete</button>
                    </div>
                </td>
            </tr>`;
        }).join('');

        $$('[data-edit]', tbody).forEach(b =>
            b.addEventListener('click', () => openEditor(b.dataset.edit)));
        $$('[data-del]', tbody).forEach(b =>
            b.addEventListener('click', () => askDelete(b.dataset.del)));
    }

    /* =====================================================
       Editor
       ===================================================== */
    function bindEditor() {
        $$('[data-close-editor]').forEach(el => el.addEventListener('click', closeEditor));

        $('#chooseImageBtn').addEventListener('click', () => $('#imageInput').click());
        $('#imageInput').addEventListener('change', handleImagePick);
        $('#removeImageBtn').addEventListener('click', clearImage);

        $('#addColorBtn').addEventListener('click', addCustomColor);
        $('#customColorName').addEventListener('keydown', e => {
            if (e.key === 'Enter') { e.preventDefault(); addCustomColor(); }
        });

        $('#productForm').addEventListener('submit', saveProduct);
        $('#deleteBtn').addEventListener('click', () => askDelete(editingId));

        document.addEventListener('keydown', e => {
            if (e.key !== 'Escape') return;
            if (!$('#confirmModal').hidden) closeConfirm();
            else if (!$('#editorModal').hidden) closeEditor();
        });
    }

    function openEditor(id) {
        editingId = id;
        pendingImage = null;

        const p = id ? products.find(x => x.id === id) : null;

        $('#editorTitle').textContent = p ? 'Edit product' : 'Add product';
        $('#deleteBtn').hidden = !p;
        hide($('#formError'));
        $('#uploadStatus').textContent = '';
        $('#uploadStatus').className = 'upload-status';

        $('#fName').value = p ? p.name : '';
        $('#fBrand').value = p ? (p.brand || '') : '';
        $('#fCategory').value = p ? p.category : 'shirts';
        $('#fPrice').value = p ? p.price : '';
        $('#fOldPrice').value = p && p.old_price ? p.old_price : '';
        $('#fIsNew').checked = p ? !!p.is_new : false;
        $('#fInStock').checked = p ? !!p.in_stock : true;
        $('#fOfferTag').value = p ? (p.offer_tag || '') : '';
        $('#fSortOrder').value = p ? p.sort_order : 0;

        setChecked('#sizeChips', p ? p.sizes : ['S', 'M', 'L', 'XL']);
        setChecked('#collectionChips', p ? p.collections : ['new']);

        currentColors = p && Array.isArray(p.colors) ? p.colors.map(c => ({ ...c })) : [];
        renderColorChips();

        setPreview(p ? p.image_url : null);

        show($('#editorModal'));
        document.body.classList.add('is-locked');
        setTimeout(() => $('#fName').focus(), 50);
    }

    function closeEditor() {
        // An image uploaded but never saved would otherwise be orphaned.
        if (pendingImage) {
            API.deleteImage(pendingImage.path);
            pendingImage = null;
        }
        hide($('#editorModal'));
        document.body.classList.remove('is-locked');
    }

    function setChecked(scope, values) {
        const set = new Set(values || []);
        $$(`${scope} input[type="checkbox"]`).forEach(cb => { cb.checked = set.has(cb.value); });
    }

    function getChecked(scope) {
        return $$(`${scope} input[type="checkbox"]`).filter(cb => cb.checked).map(cb => cb.value);
    }

    /* ---------- colours ---------- */
    function renderColorChips() {
        const chosen = new Map(currentColors.map(c => [c.name.toLowerCase(), c]));
        const custom = currentColors.filter(c =>
            !PRESET_COLORS.some(p => p.name.toLowerCase() === c.name.toLowerCase()));

        const all = PRESET_COLORS.concat(custom);

        $('#colorChips').innerHTML = all.map((c, i) => `
            <label class="chip">
                <input type="checkbox" data-color-name="${esc(c.name)}" data-color-hex="${esc(c.hex)}"
                       ${chosen.has(c.name.toLowerCase()) ? 'checked' : ''}>
                <span><span class="swatch-dot" style="background:${esc(c.hex)}"></span>${esc(c.name)}</span>
            </label>`).join('');

        $$('#colorChips input').forEach(cb => cb.addEventListener('change', syncColors));
    }

    function syncColors() {
        currentColors = $$('#colorChips input:checked').map(cb => ({
            name: cb.dataset.colorName,
            hex: cb.dataset.colorHex,
        }));
    }

    function addCustomColor() {
        const name = $('#customColorName').value.trim();
        const hex = $('#customColorHex').value;
        if (!name) { toast('Give the colour a name first.', true); return; }

        if (currentColors.some(c => c.name.toLowerCase() === name.toLowerCase()) ||
            PRESET_COLORS.some(c => c.name.toLowerCase() === name.toLowerCase())) {
            toast('That colour is already listed.', true);
            return;
        }

        currentColors.push({ name, hex });
        $('#customColorName').value = '';
        renderColorChips();
    }

    /* ---------- image ---------- */
    function setPreview(url) {
        const box = $('#imagePreview');
        if (url) {
            box.innerHTML = `<img src="${esc(url)}" alt="">`;
            $('#removeImageBtn').hidden = false;
        } else {
            box.innerHTML = '<span class="uploader__placeholder">No image yet</span>';
            $('#removeImageBtn').hidden = true;
        }
    }

    async function handleImagePick(e) {
        const file = e.target.files && e.target.files[0];
        e.target.value = '';               // allow re-picking the same file
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            return uploadMsg('That file is not an image.', 'is-error');
        }
        if (file.size > 5 * 1024 * 1024) {
            return uploadMsg('Image is larger than 5MB — please compress it first.', 'is-error');
        }

        uploadMsg('Uploading…');
        $('#saveBtn').disabled = true;

        try {
            // Drop a previous pending upload so we never leave two orphans.
            if (pendingImage) await API.deleteImage(pendingImage.path);

            pendingImage = await API.uploadImage(file);
            setPreview(pendingImage.url);
            uploadMsg('Image uploaded.', 'is-ok');
        } catch (ex) {
            uploadMsg(ex.message, 'is-error');
        } finally {
            $('#saveBtn').disabled = false;
        }
    }

    function uploadMsg(text, cls) {
        const el = $('#uploadStatus');
        el.textContent = text;
        el.className = 'upload-status' + (cls ? ' ' + cls : '');
    }

    function clearImage() {
        if (pendingImage) {
            API.deleteImage(pendingImage.path);
            pendingImage = null;
        }
        // Marker: an existing image should be cleared on save.
        setPreview(null);
        clearImage.cleared = true;
        uploadMsg('');
    }

    /* ---------- save ---------- */
    async function saveProduct(e) {
        e.preventDefault();
        syncColors();

        const price = Number($('#fPrice').value);
        const oldPriceRaw = $('#fOldPrice').value.trim();
        const oldPrice = oldPriceRaw === '' ? null : Number(oldPriceRaw);

        if (!Number.isFinite(price) || price < 0) return formError('Enter a valid price.');
        if (oldPrice !== null && (!Number.isFinite(oldPrice) || oldPrice < 0)) {
            return formError('Enter a valid "was" price, or leave it blank.');
        }
        if (oldPrice !== null && oldPrice <= price) {
            return formError('The "was" price should be higher than the current price.');
        }

        const existing = editingId ? products.find(p => p.id === editingId) : null;

        const fields = {
            name: $('#fName').value.trim(),
            brand: $('#fBrand').value.trim() || null,
            category: $('#fCategory').value,
            price,
            old_price: oldPrice,
            sizes: getChecked('#sizeChips'),
            colors: currentColors,
            is_new: $('#fIsNew').checked,
            in_stock: $('#fInStock').checked,
            offer_tag: $('#fOfferTag').value.trim() || null,
            collections: getChecked('#collectionChips'),
            sort_order: Number($('#fSortOrder').value) || 0,
        };

        if (pendingImage) {
            fields.image_url = pendingImage.url;
            fields.image_path = pendingImage.path;
        } else if (clearImage.cleared) {
            fields.image_url = null;
            fields.image_path = null;
        }

        const btn = $('#saveBtn');
        btn.disabled = true;
        btn.textContent = 'Saving…';
        hide($('#formError'));

        try {
            if (editingId) {
                // Replacing or clearing an image? Bin the old file afterwards.
                const oldPath = existing && existing.image_path;
                const replacing = (pendingImage || clearImage.cleared) && oldPath &&
                                  oldPath !== (pendingImage && pendingImage.path);

                await API.updateProduct(editingId, fields);
                if (replacing) await API.deleteImage(oldPath);
                toast('Product updated.');
            } else {
                await API.createProduct(fields);
                toast('Product added.');
            }

            pendingImage = null;      // now owned by the saved row
            clearImage.cleared = false;
            hide($('#editorModal'));
            document.body.classList.remove('is-locked');
            await loadProducts();
        } catch (ex) {
            formError(ex.message);
        } finally {
            btn.disabled = false;
            btn.textContent = 'Save product';
        }
    }

    function formError(msg) {
        const el = $('#formError');
        el.textContent = msg;
        show(el);
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    /* =====================================================
       Delete
       ===================================================== */
    function bindConfirm() {
        $$('[data-close-confirm]').forEach(el => el.addEventListener('click', closeConfirm));
        $('#confirmDeleteBtn').addEventListener('click', doDelete);
    }

    function askDelete(id) {
        const p = products.find(x => x.id === id);
        if (!p) return;
        deleteTarget = p;
        $('#confirmName').textContent = p.name;
        show($('#confirmModal'));
        document.body.classList.add('is-locked');
    }

    function closeConfirm() {
        hide($('#confirmModal'));
        deleteTarget = null;
        if ($('#editorModal').hidden) document.body.classList.remove('is-locked');
    }

    async function doDelete() {
        if (!deleteTarget) return;
        const btn = $('#confirmDeleteBtn');
        btn.disabled = true;
        btn.textContent = 'Deleting…';

        try {
            await API.deleteProduct(deleteTarget.id);
            if (deleteTarget.image_path) await API.deleteImage(deleteTarget.image_path);
            toast('Product deleted.');

            closeConfirm();
            hide($('#editorModal'));
            document.body.classList.remove('is-locked');
            await loadProducts();
        } catch (ex) {
            toast(ex.message, true);
        } finally {
            btn.disabled = false;
            btn.textContent = 'Delete';
        }
    }
})();

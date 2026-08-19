/* =========================================================
   X SPANISH — Supabase data layer
   ---------------------------------------------------------
   Plain fetch against Supabase's REST endpoints, so neither the
   storefront nor the dashboard pulls in an SDK. Shared by
   script.js (read only) and admin.js (read + write).
   ========================================================= */

(function (global) {
    'use strict';

    const cfg = global.XS_CONFIG || {};
    const URL_BASE = (cfg.SUPABASE_URL || '').replace(/\/+$/, '');
    const ANON = cfg.SUPABASE_ANON_KEY || '';
    const BUCKET = cfg.STORAGE_BUCKET || 'product-images';

    const TOKEN_KEY = 'xs_admin_session';

    /* Treat the untouched placeholders as "not set up yet" so the
       storefront can fall back instead of throwing. */
    const isConfigured = () =>
        !!URL_BASE && !!ANON &&
        !URL_BASE.includes('YOUR-PROJECT-REF') &&
        !ANON.includes('YOUR-PUBLIC-ANON-KEY');

    /* ---------- session ---------- */
    function readSession() {
        try {
            const raw = localStorage.getItem(TOKEN_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (_) {
            return null;
        }
    }

    function writeSession(session) {
        if (session) localStorage.setItem(TOKEN_KEY, JSON.stringify(session));
        else localStorage.removeItem(TOKEN_KEY);
    }

    function sessionValid(s) {
        return !!(s && s.access_token && s.expires_at && s.expires_at > Date.now() + 30_000);
    }

    function stamp(session) {
        // Supabase returns a lifetime in seconds; store an absolute deadline.
        session.expires_at = Date.now() + (session.expires_in || 3600) * 1000;
        return session;
    }

    /* ---------- low level ---------- */
    function headers(extra, token) {
        return Object.assign({
            apikey: ANON,
            Authorization: 'Bearer ' + (token || ANON),
        }, extra || {});
    }

    async function readError(res, fallback) {
        let detail = '';
        try {
            const body = await res.json();
            detail = body.message || body.error_description || body.error || body.msg || '';
        } catch (_) { /* non-JSON error body */ }
        return new Error(detail || fallback || `Request failed (${res.status})`);
    }

    /* ---------- auth ---------- */
    async function signIn(email, password) {
        const res = await fetch(`${URL_BASE}/auth/v1/token?grant_type=password`, {
            method: 'POST',
            headers: { apikey: ANON, 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) throw await readError(res, 'Could not sign in.');
        const session = stamp(await res.json());
        writeSession(session);
        return session;
    }

    async function refresh(session) {
        const res = await fetch(`${URL_BASE}/auth/v1/token?grant_type=refresh_token`, {
            method: 'POST',
            headers: { apikey: ANON, 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: session.refresh_token }),
        });
        if (!res.ok) throw await readError(res, 'Session expired.');
        const next = stamp(await res.json());
        writeSession(next);
        return next;
    }

    /* Returns a usable access token, refreshing transparently. */
    async function requireToken() {
        let session = readSession();
        if (!session) throw new Error('Not signed in.');
        if (sessionValid(session)) return session.access_token;

        if (!session.refresh_token) {
            writeSession(null);
            throw new Error('Session expired. Please sign in again.');
        }
        try {
            session = await refresh(session);
            return session.access_token;
        } catch (err) {
            writeSession(null);
            throw err;
        }
    }

    function signOut() {
        writeSession(null);
    }

    /* ---------- products ---------- */
    async function listProducts() {
        const res = await fetch(
            `${URL_BASE}/rest/v1/products?select=*&order=sort_order.asc,created_at.desc`,
            { headers: headers() }
        );
        if (!res.ok) throw await readError(res, 'Could not load products.');
        return res.json();
    }

    async function createProduct(fields) {
        const token = await requireToken();
        const res = await fetch(`${URL_BASE}/rest/v1/products`, {
            method: 'POST',
            headers: headers({ 'Content-Type': 'application/json', Prefer: 'return=representation' }, token),
            body: JSON.stringify(fields),
        });
        if (!res.ok) throw await readError(res, 'Could not save product.');
        return (await res.json())[0];
    }

    async function updateProduct(id, fields) {
        const token = await requireToken();
        const res = await fetch(`${URL_BASE}/rest/v1/products?id=eq.${encodeURIComponent(id)}`, {
            method: 'PATCH',
            headers: headers({ 'Content-Type': 'application/json', Prefer: 'return=representation' }, token),
            body: JSON.stringify(fields),
        });
        if (!res.ok) throw await readError(res, 'Could not update product.');
        return (await res.json())[0];
    }

    async function deleteProduct(id) {
        const token = await requireToken();
        const res = await fetch(`${URL_BASE}/rest/v1/products?id=eq.${encodeURIComponent(id)}`, {
            method: 'DELETE',
            headers: headers({}, token),
        });
        if (!res.ok) throw await readError(res, 'Could not delete product.');
    }

    /* ---------- image storage ---------- */
    function publicUrl(path) {
        return `${URL_BASE}/storage/v1/object/public/${BUCKET}/${path}`;
    }

    async function uploadImage(file) {
        const token = await requireToken();

        const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

        const res = await fetch(`${URL_BASE}/storage/v1/object/${BUCKET}/${path}`, {
            method: 'POST',
            headers: headers({ 'Content-Type': file.type || 'application/octet-stream' }, token),
            body: file,
        });
        if (!res.ok) throw await readError(res, 'Image upload failed.');

        return { path, url: publicUrl(path) };
    }

    async function deleteImage(path) {
        if (!path) return;
        const token = await requireToken();
        // A failed cleanup shouldn't block the product delete itself.
        await fetch(`${URL_BASE}/storage/v1/object/${BUCKET}/${path}`, {
            method: 'DELETE',
            headers: headers({}, token),
        }).catch(() => {});
    }

    global.XS_API = {
        isConfigured,
        readSession, sessionValid, signIn, signOut, requireToken,
        listProducts, createProduct, updateProduct, deleteProduct,
        uploadImage, deleteImage, publicUrl,
    };
})(window);

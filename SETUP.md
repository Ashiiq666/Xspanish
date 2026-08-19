# X SPANISH — Dashboard setup

The dashboard at `/admin.html` lets you add products, upload real photos, change
prices, and switch "New" and offer tags on and off. Changes appear on the site
immediately — no rebuild, no code edits.

This is a **one-time setup, about 15 minutes**. You only need to do it once.

---

## What you are setting up

| Piece | What it does | Cost |
|---|---|---|
| Supabase database | Stores product details | Free |
| Supabase storage | Stores uploaded photos | Free |
| Supabase auth | The dashboard login | Free |

The free tier (500MB database, 1GB images) is far more than this catalogue needs.

---

## Step 1 — Create the Supabase project

1. Go to **https://supabase.com** and sign up.
2. Click **New project**.
3. Name it `xspanish`.
4. Set a database password and save it somewhere safe (you won't need it day to day).
5. Choose the region closest to you — **Mumbai (ap-south-1)** is best for Kerala.
6. Click **Create new project** and wait ~2 minutes while it provisions.

## Step 2 — Create the database tables

1. In the left sidebar click **SQL Editor**.
2. Click **New query**.
3. Open the file `supabase/schema.sql` from this project, copy **all** of it, and
   paste it into the editor.
4. Click **Run**.

You should see "Success. No rows returned". That is correct — it created the
products table, the image bucket, and the security rules.

## Step 3 — Copy your two keys into `config.js`

1. In Supabase go to **Project Settings** (gear icon) → **Data API**.
2. Copy the **Project URL** — it looks like `https://abcdefgh.supabase.co`.
3. Copy the **anon public** key — a long string starting with `eyJ...`.
4. Open `config.js` in this project and paste both in:

```js
window.XS_CONFIG = {
    SUPABASE_URL: 'https://abcdefgh.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOi...',

    STORAGE_BUCKET: 'product-images',
};
```

> **Which key?** Use the one labelled **anon / public**. It is designed to sit in
> public website code, and the security rules from Step 2 are what actually stop
> strangers editing anything.
>
> **Never** paste the **service_role** key here. That key ignores all security
> rules. If it ever ends up in this file, anyone could wipe your catalogue.

## Step 4 — Create the two admin logins

1. In Supabase go to **Authentication** → **Users**.
2. Click **Add user** → **Create new user**.
3. Enter your email and a strong password. Tick **Auto Confirm User**.
4. Repeat for the owner's email.

Only these accounts can change anything. Anyone else visiting `/admin.html` sees
the login screen and gets no further.

## Step 5 — Publish

Commit and push. Vercel redeploys automatically:

```bash
git add -A && git commit -m "Connect dashboard to Supabase" && git push
```

Then open **https://xspanish.in/admin.html** and sign in.

---

## Using the dashboard

Go to **https://xspanish.in/admin.html** and sign in.

### Adding a product

Click **+ Add product** and fill in:

| Field | Notes |
|---|---|
| **Product image** | JPG/PNG/WebP, under 5MB. Portrait 4:5 crops fit the layout best — around 1000×1250px. |
| **Product name** | Required. Shown under the photo. |
| **Brand** | Optional. |
| **Category** | Shirts, T-Shirts, Jeans, Trousers, Ethnic, Accessories. |
| **Price** | Required, in rupees. |
| **Was price** | Optional. Set it to show a struck-through original price. Must be higher than the current price. |
| **Available sizes** | Tap to toggle S / M / L / XL / XXL. |
| **Colours** | Tap the presets, or type a name, pick a swatch and click **Add colour**. |
| **Show "New" badge** | Puts a black **NEW** label on the photo. |
| **In stock** | Untick to hide it from the website without deleting it. |
| **Offer tag** | Free text, e.g. `20% OFF`. Shows as a red badge. Leave blank for none. |
| **Show in these sections** | Which homepage carousels it appears in. |
| **Sort order** | Lower numbers appear first. |

### Where products appear

"Show in these sections" maps directly to the homepage carousels:

- **New Arrivals** / **Bestsellers** — the two tabs near the top
- **Featured: Shirts** / **Ethnic** / **Casual** — the three carousels further down

A product can be in several at once. One with no sections ticked stays in the
catalogue and search but won't appear in any carousel.

### Running an offer

Type the wording into **Offer tag** (e.g. `FESTIVE 25% OFF`), set **Was price**
to the original, and save. To end it, clear both fields.

### Taking something off sale

Untick **In stock**. It disappears from the website but stays in the dashboard,
so you can put it back with one tick. **Delete** is permanent and also removes
the photo.

---

## Good to know

**Photos** are resized by the browser for display but stored at full size, so
compressing before upload keeps the site fast. Around 1000×1250px is plenty.

**Until you add products**, the site shows the original demo items with stock
photography. Your first saved product replaces that list entirely — so add your
real range in one sitting rather than a few at a time.

**If Supabase is ever unreachable**, the site falls back to the demo list rather
than showing an empty shop.

**Two people editing at once** is fine, but the last save wins — avoid both
editing the same product simultaneously.

---

## Troubleshooting

**"The dashboard isn't connected to Supabase yet"**
`config.js` still has the placeholder values. Redo Step 3.

**"That email and password combination is not recognised"**
The account doesn't exist yet, or the password is wrong. Add the user in
Supabase under Authentication → Users (Step 4).

**"This account still needs its email confirmed"**
You didn't tick **Auto Confirm User**. In Supabase open the user and confirm
them manually.

**"Could not reach Supabase. Check the URL in config.js"**
Usually a typo in `SUPABASE_URL`, or a missing `https://`.

**Products save but don't show on the website**
Check **In stock** is ticked and at least one section under "Show in these
sections" is selected.

**Image upload fails**
Confirm Step 2 ran fully — it creates the `product-images` bucket. In Supabase,
Storage should list a bucket by that name marked **Public**.

---

## A note on the newsletter form

Separate from the dashboard: the newsletter signup posts to `submit.php`, and
Vercel does not run PHP, so it currently returns an error to visitors. It needs
either a Vercel serverless function or a hosted form service. Ask and it can be
wired up.

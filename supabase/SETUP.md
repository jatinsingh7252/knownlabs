# KnownLabs Website — Setup Guide

Everything is copy-paste. Follow the steps in order; each one ends with how to check it worked.

## What you're setting up

- **Public website** (6 pages) — works immediately, even with zero configuration.
- **Supabase backend** — saves contact-form inquiries, powers the admin panel, and lets you edit projects/services/testimonials/FAQs without touching code.
- **Admin panel** at `/admin/` — secure login, inquiry inbox, content manager, image uploads.

Without Supabase configured, the site runs fully static and the contact form opens WhatsApp instead. Nothing breaks.

---

## Step 1 — Create the Supabase project

1. Go to https://supabase.com and sign in (or create a free account).
2. Click **New project**.
3. Name: `knownlabs` · set a strong database password (save it somewhere safe) · pick the region closest to you.
4. Click **Create new project** and wait ~2 minutes.

✅ Check: you land on the project dashboard.

## Step 2 — Create the database tables

1. In the left sidebar, click **SQL Editor**.
2. Click **New query**.
3. Open `supabase/schema.sql` from this folder, copy the **entire** file, paste it into the query box.
4. Click **Run** (or press `Ctrl+Enter`).

✅ Check: you see "Success. No rows returned."

5. Click **New query** again.
6. Copy the entire `supabase/seed.sql`, paste, **Run**.

✅ Check: "Success."

7. Quick verify: left sidebar → **Table Editor** → you should see `inquiries`, `projects`, `services`, `testimonials`, `faqs` — with projects/services/faqs already filled.

## Step 3 — Create the admin login

1. Left sidebar → **Authentication** → **Users** tab → **Add user** → **Create new user**.
2. Enter your email + a strong password. Leave "Auto Confirm User" **on**.
3. Click **Create user**.

✅ Check: your email appears in the users list.

## Step 3b — Allowlist the admin login (important)

Only users in the `admin_users` table can manage content. Everyone else — even if they somehow sign in — gets read-only public access.

1. Left sidebar → **SQL Editor** → **New query**.
2. Paste this (use your own login email), then **Run**:

```sql
insert into public.admin_users (user_id)
select id from auth.users where email = 'you@example.com';
```

✅ Check: `select * from public.admin_users;` shows one row.

> 🔐 Rotate any test password before launch. Never share admin credentials.

## Step 4 — Connect the website to Supabase

1. Left sidebar → **Project Settings** (gear icon) → **API**.
2. Copy the **Project URL** (looks like `https://xyzcompany.supabase.co`).
3. Copy the **anon public** key (the long one under "Project API keys").
4. Open `assets/js/supabase-client.js` and paste them here:

```js
KL.config = {
  supabaseUrl: "https://xyzcompany.supabase.co",
  supabaseKey: "paste-your-anon-key-here"
};
```

✅ Check: open `index.html` in a browser, open DevTools console (F12) — no red errors, and submitting the contact form shows the green success message instead of opening WhatsApp.

## Step 5 — Test the admin panel

1. Serve the folder locally (any one of these):
   - `python3 -m http.server 8000` inside the `website/` folder, then open http://localhost:8000/admin/
   - Or use the VS Code "Live Server" extension.
2. Sign in with the email + password from Step 3.
3. You should see the dashboard. Try: **Inquiries** tab (empty for now), **Projects** → Edit → change something → Save → check it on the site.

✅ Check: dashboard loads, counts show, editing a project updates the site after refresh.

> The `site-images` storage bucket is created by `schema.sql`. If image uploads fail, go to **Storage** in Supabase and confirm the `site-images` bucket exists and is **public**.

## Step 6 — Deploy the site

Any static host works. Two easy options:

**Netlify (drag & drop):**
1. Go to https://app.netlify.com/drop
2. Drag the entire `website/` folder onto the page.
3. Done — you get a public URL. Admin lives at `your-url/admin/`.

**Vercel:**
1. `npm i -g vercel` then run `vercel` inside the `website/` folder, accept defaults.

✅ Check: open your public URL → site loads. Open `your-url/admin/` → login works.

---

## After launch

- **Add testimonials**: admin → Testimonials → Add. They appear on the homepage automatically; the section stays hidden until you add the first one.
- **Add projects**: admin → Projects → Add. Upload the screenshot in **Images** first, copy its URL, paste into the project's Image URL field.
- **Inquiries**: admin → Inquiries. New ones arrive with status `new`; mark them `read` / `replied` / `archived`.
- **WhatsApp number**: to change it later, search all files for `919835059241` and replace.

## Troubleshooting

| Problem | Fix |
|---|---|
| Contact form opens WhatsApp instead of saving | Supabase URL/key not pasted correctly in `supabase-client.js` |
| Admin login says "Invalid login credentials" | Wrong email/password, or user not confirmed — check Authentication → Users |
| Admin login says "not on the admin allowlist" | You signed in fine, but Step 3b was skipped — run the `insert into public.admin_users …` query with your login email |
| "Could not load data" in admin | `schema.sql` wasn't run, or RLS policies missing — re-run `schema.sql` |
| Image upload fails | Create the `site-images` bucket in Storage and make it **public** |
| Site shows old content after editing | Hard refresh (`Ctrl+Shift+R`) — or check the item is marked Published |

## Project structure

```
website/
├── index.html          homepage
├── about.html          about us
├── services.html       services + bundles
├── projects.html       project case cards
├── founder.html        founder page
├── faq.html            full FAQ
├── admin/
│   └── index.html      admin panel (login + dashboard)
├── assets/
│   ├── css/style.css   shared styles
│   ├── js/supabase-client.js  ← paste Supabase keys here
│   ├── js/main.js      nav, animations, forms, dynamic content
│   └── img/            logo, favicon, project screenshots
└── supabase/
    ├── schema.sql      tables, RLS policies, storage bucket
    └── seed.sql        starter projects / services / FAQs
```

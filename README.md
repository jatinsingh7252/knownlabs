# KnownLabs Website

Full-code, self-hosted website for **KnownLabs** — a full-stack digital agency (websites, apps, UI/UX, SEO, social media, video editing) based in Bengaluru, India.

## Pages

| Page | File |
|---|---|
| Homepage — hero, difference, projects, services, process, contact, FAQ | `index.html` |
| About Us | `about.html` |
| Services + bundles | `services.html` |
| Projects | `projects.html` |
| Founder (Jatin Singh) | `founder.html` |
| FAQ | `faq.html` |
| Admin panel | `admin/index.html` |

## Quick start

```bash
cd website
python3 -m http.server 8000
# open http://localhost:8000
# admin: http://localhost:8000/admin/
```

## Backend (optional but recommended)

The site works fully static out of the box. To save contact inquiries and unlock the admin panel, connect Supabase — full steps in [`supabase/SETUP.md`](supabase/SETUP.md):

1. Create a Supabase project
2. Run `supabase/schema.sql`, then `supabase/seed.sql`
3. Create an auth user for admin login
4. Paste the project URL + anon key into `assets/js/supabase-client.js`

## Branding

- `assets/img/logo-k.png` — black K + amber dot (light backgrounds: navbar, hero)
- `assets/img/logo-k-white.png` — white K + amber dot (dark backgrounds: footer, dark bands)
- `assets/img/favicon.png` — favicon

## Notes

- WhatsApp number `919835059241` is referenced across pages; search-and-replace to change it.
- Testimonials section hides itself until the first testimonial is added (admin panel or Supabase).
- Contact form saves to Supabase when configured; otherwise it falls back to WhatsApp with the message pre-filled.
- No ratings, statistics, or testimonials are invented anywhere — add real ones via the admin panel.

-- ============ KnownLabs — seed data ============
-- Run AFTER schema.sql in the SQL Editor.

-- ---------- projects ----------
insert into public.projects (title, slug, description, categories, image_url, live_url, deliverables, sort_order, is_published)
values
  ('Madhukar Clinic & Lung Hospital', 'madhukar-lung-hospital',
   'A clear, trustworthy web presence for a lung hospital and clinic — designed so patients can find the right information and reach out with zero friction.',
   array['Website Development','UI/UX','Healthcare'],
   'assets/img/proj-madhukar.png', 'https://www.madhukarlunghospital.com',
   array['Responsive website — designed and built end to end',
         'Patient-first UI/UX with clear navigation and calls to action',
         'SEO-friendly structure and on-page basics',
         'Fast, mobile-first performance'],
   1, true),
  ('Airvana Foundation', 'airvana-foundation',
   'A warm, credible website for a foundation — communicating its mission and impact while making it effortless for visitors to connect and contribute.',
   array['Website Development','UI/UX','Non-profit'],
   'assets/img/proj-airvana.png', 'https://www.airvanafoundation.com',
   array['Responsive website — designed and built end to end',
         'Mission-led UI/UX with storytelling-first layouts',
         'SEO-friendly structure and on-page basics',
         'Fast, mobile-first performance'],
   2, true)
on conflict (slug) do nothing;

-- ---------- services ----------
insert into public.services (title, slug, description, deliverables, sort_order, is_published)
values
  ('Website Development', 'web-development',
   'Fast, responsive, SEO-ready websites — designed and built end to end.',
   array['Custom design, no bloated templates','Mobile-first responsive build','SEO-friendly structure','Launch + handover support'], 1, true),
  ('UI/UX Design', 'ui-ux',
   'Interfaces that look sharp and feel effortless — researched, wireframed, and polished.',
   array['User research & flows','Wireframes to hi-fi UI','Design systems','Clickable prototypes'], 2, true),
  ('App Development', 'app-development',
   'Mobile apps that launch clean and scale — from idea to app store.',
   array['iOS & Android builds','Clean, maintainable code','Backend & database setup','Store submission support'], 3, true),
  ('SEO', 'seo',
   'Get found on Google — technical fixes, content structure, and ongoing growth.',
   array['Technical SEO audit','On-page optimisation','Local SEO setup','Monthly reporting'], 4, true),
  ('Social Media Management', 'social-media',
   'Content that keeps your brand active and growing — planned, designed, posted.',
   array['Content calendar','Designs & creatives','Posting & scheduling','Growth reporting'], 5, true),
  ('Video Editing', 'video-editing',
   'Scroll-stopping edits for reels, ads, and brand films.',
   array['Reels & shorts','Brand films','Ad creatives','Subtitles & sound design'], 6, true)
on conflict (slug) do nothing;

-- ---------- faqs ----------
insert into public.faqs (question, answer, sort_order, is_published)
values
  ('What services does KnownLabs offer?',
   'We''re a full-stack digital agency: website development, UI/UX design, app development, SEO, social media management, and video editing — all under one roof, so you never juggle multiple vendors.', 1, true),
  ('How much does a website cost?',
   'Every project is scoped on what you need — pages, features, and timeline. Tell us about your project on WhatsApp or through the contact form and we''ll send a clear, itemised quote before anything starts.', 2, true),
  ('How long does a typical project take?',
   'Timelines depend on scope — a simple site moves faster than a custom app. We''ll give you an honest estimate before we start, and keep you updated throughout.', 3, true),
  ('Do you work with clients outside Bangalore?',
   'Yes. We''re based in Bengaluru, India, and work with clients anywhere — the whole process (discovery, design reviews, launch) runs smoothly over calls and WhatsApp.', 4, true),
  ('Will my website rank on Google?',
   'Every website we build is SEO-ready: fast loading, mobile-first, and structured so search engines can read it. For ongoing growth we offer SEO as a dedicated service.', 5, true),
  ('Do you provide support after launch?',
   'Yes — we help with launch and handover, and we offer ongoing maintenance plans for updates and improvements after go-live.', 6, true),
  ('Who will work on my project?',
   'You work directly with our founder — no layers of account managers. You always know who''s building your brand.', 7, true);

-- testimonials: intentionally left empty — add real client reviews via the admin panel.

/* ============ KnownLabs — data layer (Supabase optional) ============ */
window.KL = window.KL || {};

/* Paste your Supabase project URL + anon key here (see SETUP.md).
   Leave empty to run the site fully static — forms fall back to WhatsApp. */
KL.config = {
  supabaseUrl: "https://tksddoqiaglwadxlyvae.supabase.co",
  supabaseKey: "sb_publishable_jPJJ_IRCreI-zsd8jhVkSw_wGUs8iih"
};

KL.WA_NUMBER = "919835059241";
KL.waLink = (msg) => "https://wa.me/" + KL.WA_NUMBER + "?text=" + encodeURIComponent(msg);

/* ---------- static fallback content (used when Supabase is not configured) ---------- */
KL.fallback = {
  projects: [
    {
      title: "Madhukar Clinic & Lung Hospital",
      slug: "madhukar-lung-hospital",
      categories: ["Website Development", "UI/UX", "Healthcare"],
      description: "A clear, trustworthy web presence for a lung hospital and clinic — designed so patients can find the right information and reach out with zero friction.",
      image: "assets/img/proj-madhukar.png",
      live_url: "https://www.madhukarlunghospital.com",
      deliverables: ["Responsive website — designed and built end to end", "Patient-first UI/UX with clear navigation and calls to action", "SEO-friendly structure and on-page basics", "Fast, mobile-first performance"]
    },
    {
      title: "Airvana Foundation",
      slug: "airvana-foundation",
      categories: ["Website Development", "UI/UX", "Non-profit"],
      description: "A warm, credible website for a foundation — communicating its mission and impact while making it effortless for visitors to connect and contribute.",
      image: "assets/img/proj-airvana.png",
      live_url: "https://www.airvanafoundation.com",
      deliverables: ["Responsive website — designed and built end to end", "Mission-led UI/UX with storytelling-first layouts", "SEO-friendly structure and on-page basics", "Fast, mobile-first performance"]
    }
  ],
  services: [
    { title: "Website Development", slug: "web-development", description: "Fast, responsive, SEO-ready websites — designed and built end to end.", deliverables: ["Custom design, no bloated templates", "Mobile-first responsive build", "SEO-friendly structure", "Launch + handover support"] },
    { title: "UI/UX Design", slug: "ui-ux", description: "Interfaces that look sharp and feel effortless — researched, wireframed, and polished.", deliverables: ["User research & flows", "Wireframes to hi-fi UI", "Design systems", "Clickable prototypes"] },
    { title: "App Development", slug: "app-development", description: "Mobile apps that launch clean and scale — from idea to app store.", deliverables: ["iOS & Android builds", "Clean, maintainable code", "Backend & database setup", "Store submission support"] },
    { title: "SEO", slug: "seo", description: "Get found on Google — technical fixes, content structure, and ongoing growth.", deliverables: ["Technical SEO audit", "On-page optimisation", "Local SEO setup", "Monthly reporting"] },
    { title: "Social Media Management", slug: "social-media", description: "Content that keeps your brand active and growing — planned, designed, posted.", deliverables: ["Content calendar", "Designs & creatives", "Posting & scheduling", "Growth reporting"] },
    { title: "Video Editing", slug: "video-editing", description: "Scroll-stopping edits for reels, ads, and brand films.", deliverables: ["Reels & shorts", "Brand films", "Ad creatives", "Subtitles & sound design"] }
  ],
  faqs: [
    { question: "What services does KnownLabs offer?", answer: "We're a full-stack digital agency: website development, UI/UX design, app development, SEO, social media management, and video editing — all under one roof, so you never juggle multiple vendors." },
    { question: "How much does a website cost?", answer: "Every project is scoped on what you need — pages, features, and timeline. Tell us about your project on WhatsApp or through the contact form and we'll send a clear, itemised quote before anything starts." },
    { question: "How long does a typical project take?", answer: "Timelines depend on scope — a simple site moves faster than a custom app. We'll give you an honest estimate before we start, and keep you updated throughout." },
    { question: "Do you work with clients outside Bangalore?", answer: "Yes. We're based in Bengaluru, India, and work with clients across India — the whole process (discovery, design reviews, launch) runs smoothly over calls and WhatsApp." },
    { question: "Will my website rank on Google?", answer: "Every website we build is SEO-ready: fast loading, mobile-first, and structured so search engines can read it. For ongoing growth we offer SEO as a dedicated service." },
    { question: "Do you provide support after launch?", answer: "Yes — we help with launch and handover, and we offer ongoing maintenance plans for updates and improvements after go-live." },
    { question: "Who will work on my project?", answer: "You work directly with our founder — no layers of account managers. You always know who's building your brand." }
  ],
  testimonials: [] // add via admin panel once client reviews come in; section hides itself when empty
};

/* ---------- supabase (optional) ---------- */
KL.sb = null;
KL.initSupabase = function () {
  if (!KL.config.supabaseUrl || !KL.config.supabaseKey) return false;
  if (typeof supabase === "undefined") return false;
  try {
    KL.sb = supabase.createClient(KL.config.supabaseUrl, KL.config.supabaseKey);
    return true;
  } catch (e) { console.warn("Supabase init failed:", e); return false; }
};

KL.getProjects = async function () {
  if (KL.sb) {
    const { data, error } = await KL.sb.from("projects").select("*").eq("is_published", true).order("sort_order");
    if (!error && data) return data;
  }
  return KL.fallback.projects;
};
KL.getServices = async function () {
  if (KL.sb) {
    const { data, error } = await KL.sb.from("services").select("*").eq("is_published", true).order("sort_order");
    if (!error && data) return data;
  }
  return KL.fallback.services;
};
KL.getTestimonials = async function () {
  if (KL.sb) {
    const { data, error } = await KL.sb.from("testimonials").select("*").eq("is_published", true).order("sort_order");
    if (!error && data) return data;
  }
  return KL.fallback.testimonials;
};
KL.getFaqs = async function () {
  if (KL.sb) {
    const { data, error } = await KL.sb.from("faqs").select("*").eq("is_published", true).order("sort_order");
    if (!error && data) return data;
  }
  return KL.fallback.faqs;
};
KL.submitInquiry = async function (payload) {
  if (KL.sb) {
    const { error } = await KL.sb.from("inquiries").insert([{ ...payload, status: "new" }]);
    if (error) throw error;
    return true;
  }
  return false; // caller falls back to WhatsApp
};

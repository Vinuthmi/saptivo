<script setup>
defineOptions({ name: 'SiteFooter' })
const year = new Date().getFullYear()
const logoSrc = `${import.meta.env.BASE_URL}saptivo-logo.png`

// Brand icons that orbit around the circle (inline SVGs, no external assets)
const orbitIcons = [
  { name: 'Instagram', svg: '<path fill="#E1306C" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.4 5.6 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.6 18.4 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>' },
  { name: 'YouTube', svg: '<path fill="#FF0000" d="M10 15l5.19-3L10 9m11.56-1.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/>' },
  { name: 'Facebook', svg: '<circle cx="12" cy="12" r="10" fill="#1877F2"/><path fill="#fff" d="M13.5 21v-7h2.4l.4-3h-2.8V9.3c0-.8.3-1.3 1.4-1.3h1.5V5.3c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8V11H8v3h2.5v7z"/>' },
  { name: 'Discord', svg: '<path fill="#5865F2" d="M19 5.5A16 16 0 0 0 15 4.3l-.5 1a14 14 0 0 0-5 0l-.5-1A16 16 0 0 0 5 5.5C2.5 9.2 1.8 12.8 2.1 16.4A16 16 0 0 0 7 19l1-1.6a10 10 0 0 1-1.6-.8l.4-.3a11.500 11.500 0 0 0 10.400 0l.4.3a10 10 0 0 1-1.600.8L17 19a16 16 0 0 0 4.900-2.600c.4-4.200-.7-7.800-2.900-10.900zM9 14.200c-1 0-1.800-.9-1.800-2s.8-2 1.800-2 1.800.9 1.800 2-.8 2-1.800 2zm6 0c-1 0-1.800-.9-1.800-2s.8-2 1.800-2 1.800.9 1.800 2-.8 2-1.800 2z"/>' },
  { name: 'WordPress', svg: '<circle cx="12" cy="12" r="10.5" fill="#21759b"/><path fill="#fff" d="m4.7 8.1 3.4 9.3 2.1-5.6-1.3-3.7H7.5v-1h5v1h-1.2l3.1 8.5 2.8-7.6c.1-.3.2-.6.2-.9 0-.8-.5-1.2-1.1-1.2v-1h3.6v1c-.8.1-1.3.8-1.7 1.8l-3.7 10.1c-.5.2-1 .3-1.5.4l-2.4-6.6-2.4 6.6c-.5-.1-1-.3-1.5-.5L2.7 8.1z"/>' },
  { name: '3CX', viewBox: '0 0 72 32', svg: '<text x="36" y="24" text-anchor="middle" font-family="Arial,sans-serif" font-size="25" font-weight="700" letter-spacing="-1.5" fill="#0b8ed8">3CX</text>' },
  { name: 'Google Calendar', svg: '<rect x="3" y="4" width="18" height="17" rx="3" fill="#4285f4"/><path d="M6 4h4v4H6z" fill="#ea4335"/><path d="M10 4h4v4h-4z" fill="#fbbc04"/><path d="M14 4h4v4h-4z" fill="#34a853"/><path d="M6 8h12v10H6z" fill="#fff"/><path d="M6 8h12v2H6z" fill="#4285f4"/><text x="12" y="16" text-anchor="middle" font-family="Arial,sans-serif" font-size="7" font-weight="700" fill="#4285f4">31</text>' },
]

// Links taken from the site menu
const menuLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Industries', href: '#industries' },
  { label: 'Pricing', href: '#pricing' },
]
const partnerLinks = [
  { label: 'Reseller', href: '#reseller' },
  { label: 'Reseller Signup', href: '#reseller-signup' },
  { label: 'Contact Us', href: '#contact' },
]
</script>

<template>
  <footer id="contact" class="site-footer">
    <!-- CTA + rotating orbit -->
    <section class="cta">
      <h2 class="cta-title">
        Ready to run
        <span class="grad">every store as one?</span>
      </h2>
      <p class="cta-sub">
        One connected workspace for customers, sales, and every store you run.
        Work smarter, move faster and make every opportunity count.
      </p>
      <div class="cta-actions">
        <a class="btn btn-primary" href="mailto:hello@saptivo.com">
          Talk to our team <span aria-hidden="true">↗</span>
        </a>
        <a class="btn btn-dark" href="#workflow">See how it works</a>
      </div>

      <div class="orbit-wrap" aria-hidden="true">
        <!-- outer ring with brand icons -->
        <div class="orbit">
          <div
            v-for="(icon, i) in orbitIcons"
            :key="icon.name"
            class="orbit-item"
            :style="{ '--a': `${(360 / orbitIcons.length) * i}deg` }"
          >
            <span class="orbit-badge">
              <svg :viewBox="icon.viewBox || '0 0 24 24'" width="30" height="30" v-html="icon.svg"></svg>
            </span>
          </div>
        </div>
        <!-- inner dashed ring with a travelling dot -->
        <div class="orbit-inner"><i class="orbit-dot"></i></div>
      </div>
    </section>

    <!-- White footer card -->
    <div class="footer-card">
      <div class="footer-main">
        <div class="footer-brand-block">
          <a class="footer-brand" href="#top" aria-label="Saptivo home"><img :src="logoSrc" alt="Saptivo" /></a>
          <p>One connected workspace for customers, sales, and every store you run.</p>
        </div>
        <nav class="footer-links" aria-label="Product">
          <b>Product</b>
          <a v-for="l in menuLinks" :key="l.label" :href="l.href">{{ l.label }}</a>
          <a href="#workflow">How it works</a>
        </nav>
        <nav class="footer-links" aria-label="Partners">
          <b>Partners</b>
          <a v-for="l in partnerLinks" :key="l.label" :href="l.href">{{ l.label }}</a>
        </nav>
        <div class="footer-contact">
          <b>Ready to get started?</b>
          <a class="footer-cta" href="mailto:hello@saptivo.com">Talk to our team <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© {{ year }} Saptivo. All rights reserved.</span>
        <a href="#top">Back to top ↑</a>
      </div>
    </div>
  </footer>
</template>

<!-- Inter (same family as the hero). Remove if already loaded globally. -->
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
</style>

<style scoped>
.site-footer {
  --radius: 340px; /* outer orbit radius */
  position: relative;
  padding: 0 clamp(16px, 6vw, 88px) 40px;
  background: #17191d;
  color: #fff;
  font-family: 'Poppins', Arial, sans-serif;
  overflow: hidden;
}
.site-footer::before { /* soft orange glow like the hero */
  content: '';
  position: absolute;
  top: -120px; left: 50%;
  width: 900px; height: 500px;
  transform: translateX(-50%);
  background: radial-gradient(closest-side, rgba(240, 100, 43, 0.22), transparent);
  pointer-events: none;
}

/* ---------- CTA ---------- */
.cta {
  position: relative;
  max-width: 1300px;
  margin: 0 auto;
  padding-top: 90px;
  text-align: center;
}
.cta-title {
  margin: 0;
  font-size: clamp(34px, 3.5vw, 62px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -0.035em;
}
.grad {
  display: block;
  background: linear-gradient(90deg, #ffa24c 0%, #f47c30 45%, #f0642b 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
.cta-sub {
  max-width: 560px;
  margin: 22px auto 32px;
  color: #b4b5ba;
  font-size: 15px;
  line-height: 1.9;
}
.cta-actions { display: flex; justify-content: center; flex-wrap: wrap; gap: 14px; }
.btn {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 16px 28px; border-radius: 10px;
  font-size: 14px; font-weight: 600; text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s, filter 0.2s;
}
.btn:hover { transform: translateY(-2px); }
.btn-primary {
  color: #fff;
  background: linear-gradient(180deg, #fb7a3a, #ef5d22);
  box-shadow: 0 8px 22px rgba(240, 100, 43, 0.4);
}
.btn-primary:hover { filter: brightness(1.06); }
.btn-dark {
  color: #fff; background: #000;
  border: 1px solid rgba(255, 255, 255, 0.16);
}

/* ---------- Rotating orbit ---------- */
.orbit-wrap {
  position: relative;
  height: 300px;           /* only the top arc of the circles is visible */
  margin-top: 46px;
  overflow: hidden;
}
.orbit,
.orbit-inner {
  position: absolute;
  left: 50%;
  border-radius: 50%;
}
.orbit {
  top: 50px;
  width: calc(var(--radius) * 2);
  height: calc(var(--radius) * 2);
  margin-left: calc(var(--radius) * -1);
  border: 1px solid rgba(255, 255, 255, 0.16);
  animation: spin 60s linear infinite;
}
.orbit-item {
  position: absolute;
  top: 50%; left: 50%;
  width: 70px; height: 70px;
  margin: -35px 0 0 -35px;
  transform: rotate(var(--a)) translateY(calc(var(--radius) * -1));
}
.orbit-badge {
  display: grid; place-items: center;
  width: 100%; height: 100%;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.4);
  transform: rotate(calc(var(--a) * -1));          /* keep icons upright */
  animation: upright 60s linear infinite;
}
.orbit-badge svg { display: block; }

.orbit-inner {
  --r2: calc(var(--radius) - 95px);
  top: calc(50px + 95px);
  width: calc(var(--r2) * 2);
  height: calc(var(--r2) * 2);
  margin-left: calc(var(--r2) * -1);
  border: 1px dashed rgba(255, 255, 255, 0.22);
  animation: spin-rev 90s linear infinite;
}
.orbit-dot {
  position: absolute;
  top: -7px; left: 50%;
  width: 14px; height: 14px; margin-left: -7px;
  border-radius: 50%;
  background: #17191d;
  border: 2px solid #f0642b;
  box-shadow: 0 0 12px rgba(240, 100, 43, 0.8);
}

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes spin-rev { to { transform: rotate(-360deg); } }
@keyframes upright { to { transform: rotate(calc(var(--a) * -1 - 360deg)); } }

/* ---------- White footer card ---------- */
.footer-card {
  position: relative;
  z-index: 2;
  max-width: 1300px;
  margin: -70px auto 0;
  padding: 56px clamp(20px, 4vw, 56px) 22px;
  border-radius: 24px;
  background: #fff;
  color: #17191d;
}
.footer-main {
  display: grid;
  grid-template-columns: minmax(220px, 1.2fr) minmax(120px, 0.45fr) minmax(120px, 0.45fr) minmax(200px, 0.6fr);
  gap: 40px;
  padding-bottom: 44px;
}
.footer-brand { display: inline-flex; align-items: center; }
.footer-brand img { display: block; width: 160px; max-width: 100%; height: auto; }
.footer-brand-block p { max-width: 310px; margin: 15px 0 0; color: #6b6c72; font-size: 12px; line-height: 1.8; }
.footer-links, .footer-contact { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; }
.footer-links b, .footer-contact > b { margin-bottom: 4px; color: #17191d; font-size: 14px; font-weight: 600; }
.footer-links a, .footer-bottom a { color: #55565c; font-size: 13px; text-decoration: none; transition: color 0.2s; }
.footer-links a:hover, .footer-bottom a:hover { color: #f0642b; }
.footer-cta {
  display: inline-flex; align-items: center; gap: 24px;
  padding: 12px 18px; border: 1px solid #dcdce0; border-radius: 99px;
  color: #17191d; font-size: 12px; font-weight: 500; text-decoration: none;
  transition: all 0.2s;
}
.footer-cta span { color: #f0642b; font-size: 15px; }
.footer-cta:hover { border-color: #f0642b; background: #f0642b; color: #fff; }
.footer-cta:hover span { color: #fff; }
.footer-bottom {
  display: flex; justify-content: space-between; gap: 15px;
  padding-top: 19px; border-top: 1px solid #e8e8ec;
  color: #7a7b82; font-size: 11px;
}

@media (prefers-reduced-motion: reduce) {
  .orbit, .orbit-inner, .orbit-badge { animation: none; }
}

@media (max-width: 900px) {
  .footer-main { grid-template-columns: 1fr 1fr 1fr; }
  .footer-brand-block, .footer-contact { grid-column: 1 / -1; }
}
@media (max-width: 640px) {
  .site-footer { --radius: 200px; padding: 0 16px 24px; }
  .cta { padding-top: 60px; }
  .orbit-wrap { height: 230px; }
  .orbit-item { width: 52px; height: 52px; margin: -26px 0 0 -26px; }
  .orbit-badge { border-radius: 14px; }
  .orbit-badge svg { width: 24px; height: 24px; }
  .footer-card { margin-top: -50px; padding: 36px 20px 18px; }
  .footer-main { grid-template-columns: 1fr 1fr; gap: 30px 20px; padding-bottom: 32px; }
  .footer-bottom { font-size: 10px; }
}
</style>

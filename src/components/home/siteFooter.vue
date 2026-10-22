<script setup>
defineOptions({ name: 'SiteFooter' })
const year = new Date().getFullYear()
const logoSrc = `${import.meta.env.BASE_URL}saptivo-logo.png`

// Brand logos orbiting the circle: image files in /public/orbit (SVG = always sharp, PNG 512px as backup)
const orbitBase = `${import.meta.env.BASE_URL}orbit/`
const orbitIcons = [
  { name: 'Instagram', src: `${orbitBase}instagram.svg`, size: 40 },
  { name: 'YouTube', src: `${orbitBase}youtube.svg`, size: 42 },
  { name: 'Facebook', src: `${orbitBase}facebook.svg`, size: 40 },
  { name: 'Discord', src: `${orbitBase}discord.svg`, size: 42 },
  { name: 'WordPress', src: `${orbitBase}wordpress.svg`, size: 40 },
  { name: '3CX', src: `${orbitBase}3cx.svg`, size: 56 },
  { name: 'Google Calendar', src: `${orbitBase}google-calendar.svg`, size: 38 },
]

// Trust bar (from the design reference)
const trust = [
  {
    title: '99.99% Uptime SLA',
    sub: 'Enterprise cloud reliability',
    svg: '<path d="M12 3 4.5 6v5.5c0 4.6 3.1 8.4 7.5 9.5 4.4-1.1 7.5-4.9 7.5-9.5V6z"/><path d="m8.8 12 2.4 2.4 4.2-4.6"/>',
  },
  {
    title: 'Bank-Grade Security',
    sub: '256-bit encryption & RBAC',
    svg: '<rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
  },
  {
    title: 'Live Multi-Store Sync',
    sub: 'Sub-60s ledger updates',
    svg: '<path d="M20 11a8 8 0 0 0-14-4.5L4 9"/><path d="M4 4v5h5"/><path d="M4 13a8 8 0 0 0 14 4.5L20 15"/><path d="M20 20v-5h-5"/>',
  },
  {
    title: 'Dedicated Support',
    sub: '24/7 technical onboarding',
    svg: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3.5" y="14" width="4" height="6" rx="2"/><rect x="16.5" y="14" width="4" height="6" rx="2"/><path d="M20 19.5c0 1.4-1.6 2-4 2h-2"/>',
  },
]

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
    <!-- CTA + rotating orbit (light) -->
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
        <a class="btn btn-light" href="#workflow">See how it works</a>
      </div>

      <div class="orbit-wrap" aria-hidden="true">
        <div class="orbit">
          <div
            v-for="(icon, i) in orbitIcons"
            :key="icon.name"
            class="orbit-item"
            :style="{ '--a': `${(360 / orbitIcons.length) * i}deg` }"
          >
            <span class="orbit-badge">
              <img
                :src="icon.src"
                :alt="icon.name"
                :style="{ width: icon.size + 'px', height: icon.size + 'px' }"
                draggable="false"
              />
            </span>
          </div>
        </div>
        <div class="orbit-inner"><i class="orbit-dot"></i></div>
      </div>
    </section>

    <!-- Dark footer card -->
    <div class="footer-card">
      <!-- Trust bar -->
      <ul class="trust">
        <li v-for="t in trust" :key="t.title" class="trust-item">
          <span class="trust-icon">
            <svg
              viewBox="0 0 24 24"
              width="26"
              height="26"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              v-html="t.svg"
            ></svg>
          </span>
          <span class="trust-text">
            <b>{{ t.title }}</b>
            <small>{{ t.sub }}</small>
          </span>
        </li>
      </ul>

      <div class="footer-main">
        <div class="footer-brand-block">
          <a class="footer-brand" href="#top" aria-label="Saptivo home"><img :src="logoSrc" alt="Saptivo" /></a>
          <p>One connected workspace for customers, sales, and every store you run.</p>
          <span class="status"><i></i> All systems operational</span>
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

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
</style>

<style scoped>
.site-footer {
  --radius: 340px;
  position: relative;
  padding: 0 clamp(16px, 6vw, 88px) 40px;
  background: #f2f1ee;
  color: #17191d;
  font-family: 'Inter', 'Poppins', Arial, sans-serif;
  overflow: hidden;
}
.site-footer::before {
  content: '';
  position: absolute;
  top: -120px; left: 50%;
  width: 900px; height: 500px;
  transform: translateX(-50%);
  background: radial-gradient(closest-side, rgba(240, 100, 43, 0.18), transparent);
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
  color: #17191d;
  font-size: clamp(34px, 3.5vw, 62px);
  font-weight: 600;
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
  color: #6b6c72;
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
.btn-light {
  color: #17191d; background: #fff;
  border: 1px solid rgba(23, 25, 29, 0.14);
  box-shadow: 0 4px 14px rgba(23, 25, 29, 0.06);
}

/* ---------- Rotating orbit ---------- */
.orbit-wrap {
  position: relative;
  height: 300px;
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
  border: 1px solid rgba(23, 25, 29, 0.14);
  animation: spin 60s linear infinite;
}
.orbit-item {
  position: absolute;
  top: 50%; left: 50%;
  width: 76px; height: 76px;
  margin: -38px 0 0 -38px;
  transform: rotate(var(--a)) translateY(calc(var(--radius) * -1));
}
.orbit-badge {
  display: grid; place-items: center;
  width: 100%; height: 100%;
  border-radius: 20px;
  background: #fff;
  border: 1px solid rgba(23, 25, 29, 0.08);
  box-shadow: 0 12px 28px rgba(23, 25, 29, 0.14), 0 2px 6px rgba(23, 25, 29, 0.06);
  transform: rotate(calc(var(--a) * -1));
  animation: upright 60s linear infinite;
}
.orbit-badge img { display: block; object-fit: contain; user-select: none; }

.orbit-inner {
  --r2: calc(var(--radius) - 95px);
  top: calc(50px + 95px);
  width: calc(var(--r2) * 2);
  height: calc(var(--r2) * 2);
  margin-left: calc(var(--r2) * -1);
  border: 1px dashed rgba(23, 25, 29, 0.24);
  animation: spin-rev 90s linear infinite;
}
.orbit-dot {
  position: absolute;
  top: -7px; left: 50%;
  width: 14px; height: 14px; margin-left: -7px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #f0642b;
  box-shadow: 0 0 12px rgba(240, 100, 43, 0.7);
}

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes spin-rev { to { transform: rotate(-360deg); } }
@keyframes upright { to { transform: rotate(calc(var(--a) * -1 - 360deg)); } }

/* ---------- Dark footer card ---------- */
.footer-card {
  position: relative;
  z-index: 2;
  max-width: 1300px;
  margin: -70px auto 0;
  padding: 44px clamp(20px, 4vw, 56px) 22px;
  border-radius: 24px;
  background: #17191d;
  color: #fff;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(23, 25, 29, 0.25);
}
.footer-card::before { /* orange glow in the corner */
  content: '';
  position: absolute;
  top: -160px; right: -120px;
  width: 460px; height: 360px;
  background: radial-gradient(closest-side, rgba(240, 100, 43, 0.25), transparent);
  pointer-events: none;
}
.footer-card::after { /* top accent line */
  content: '';
  position: absolute;
  top: 0; left: 8%; right: 8%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #f0642b, transparent);
}

/* trust bar */
.trust {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin: 0 0 40px;
  padding: 0 0 36px;
  list-style: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.trust-item { display: flex; align-items: center; gap: 14px; }
.trust-icon {
  flex: none;
  display: grid; place-items: center;
  width: 52px; height: 52px;
  border-radius: 15px;
  color: #ff6a2c;
  background: rgba(240, 100, 43, 0.12);
  border: 1px solid rgba(240, 100, 43, 0.3);
  transition: transform 0.25s, background 0.25s, color 0.25s;
}
.trust-item:hover .trust-icon { transform: translateY(-3px); background: #f0642b; color: #fff; }
.trust-text { display: flex; flex-direction: column; gap: 3px; }
.trust-text b { color: #fff; font-size: 15px; font-weight: 600; letter-spacing: -0.01em; }
.trust-text small { color: #9a9ba3; font-size: 13px; line-height: 1.4; }

.footer-main {
  position: relative;
  display: grid;
  grid-template-columns: minmax(220px, 1.2fr) minmax(120px, 0.45fr) minmax(120px, 0.45fr) minmax(200px, 0.6fr);
  gap: 40px;
  padding-bottom: 44px;
}
.footer-brand { display: inline-flex; align-items: center; }
.footer-brand img {
  display: block; width: 160px; max-width: 100%; height: auto;
  filter: brightness(0) invert(1); /* logo turns white on the dark card */
}
.footer-brand-block p { max-width: 310px; margin: 15px 0 18px; color: #9a9ba3; font-size: 13px; line-height: 1.8; }
.status {
  display: inline-flex; align-items: center; gap: 9px;
  padding: 7px 14px; border-radius: 99px;
  color: #c9cad0; font-size: 12px; font-weight: 500;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.status i {
  width: 8px; height: 8px; border-radius: 50%;
  background: #2ecc71;
  box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.6);
  animation: pulse 2s infinite;
}
@keyframes pulse {
  70% { box-shadow: 0 0 0 8px rgba(46, 204, 113, 0); }
  100% { box-shadow: 0 0 0 0 rgba(46, 204, 113, 0); }
}

.footer-links, .footer-contact { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; }
.footer-links b, .footer-contact > b { margin-bottom: 4px; color: #fff; font-size: 14px; font-weight: 600; }
.footer-links a, .footer-bottom a { color: #a4a5ac; font-size: 13px; text-decoration: none; transition: color 0.2s, transform 0.2s; }
.footer-links a:hover, .footer-bottom a:hover { color: #ff7a3a; }
.footer-links a:hover { transform: translateX(3px); }
.footer-cta {
  display: inline-flex; align-items: center; gap: 24px;
  padding: 12px 18px; border: 1px solid rgba(255, 255, 255, 0.22); border-radius: 99px;
  color: #fff; font-size: 12px; font-weight: 500; text-decoration: none;
  transition: all 0.2s;
}
.footer-cta span { color: #ff7a3a; font-size: 15px; }
.footer-cta:hover { border-color: #f0642b; background: #f0642b; color: #fff; }
.footer-cta:hover span { color: #fff; }
.footer-bottom {
  position: relative;
  display: flex; justify-content: space-between; gap: 15px;
  padding-top: 19px; border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #7f8088; font-size: 12px;
}

@media (prefers-reduced-motion: reduce) {
  .orbit, .orbit-inner, .orbit-badge, .status i { animation: none; }
}

@media (max-width: 900px) {
  .trust { grid-template-columns: 1fr 1fr; }
  .footer-main { grid-template-columns: 1fr 1fr 1fr; }
  .footer-brand-block, .footer-contact { grid-column: 1 / -1; }
}
@media (max-width: 640px) {
  .site-footer { --radius: 200px; padding: 0 16px 24px; }
  .cta { padding-top: 60px; }
  .orbit-wrap { height: 230px; }
  .orbit-item { width: 56px; height: 56px; margin: -28px 0 0 -28px; }
  .orbit-badge { border-radius: 15px; }
  .orbit-badge img { transform: scale(0.7); }
  .footer-card { margin-top: -50px; padding: 32px 20px 18px; }
  .trust { grid-template-columns: 1fr; gap: 18px; padding-bottom: 28px; }
  .footer-main { grid-template-columns: 1fr 1fr; gap: 30px 20px; padding-bottom: 32px; }
  .footer-bottom { font-size: 11px; }
}
</style>

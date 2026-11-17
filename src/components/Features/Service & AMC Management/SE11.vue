<template>
  <section id="faq" ref="root" class="faq" :class="{ in: seen, live }" aria-labelledby="faq-title">
    <h2 id="faq-title" class="title">
      <span>Frequently</span>
      <span class="soft">asked questions</span>
    </h2>

    <div class="grid">
      <!-- Accordion (Only 3 items from your content) -->
      <div class="list">
        <div v-for="(f, i) in faqs" :key="f.q" class="item" :class="{ open: open === i }">
          <h3>
            <button
              type="button"
              class="q"
              :id="`faq-q-${i}`"
              :aria-expanded="open === i"
              :aria-controls="`faq-a-${i}`"
              @click="toggle(i)"
            >
              <span class="num" aria-hidden="true">0{{ i + 1 }}</span>
              <span class="qt">{{ f.q }}</span>
              <span class="pm" aria-hidden="true"><i></i><i></i></span>
            </button>
          </h3>
          <div class="a" :id="`faq-a-${i}`" role="region" :aria-labelledby="`faq-q-${i}`">
            <div class="a-in">
              <p>
                <strong v-if="f.lead" class="yes">{{ f.lead }}</strong> {{ f.a }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Call to Action (threecolleagues-.jpg + White Font Color) -->
      <aside class="cta" :style="ctaStyle" aria-label="Get started">
        <span class="glow" aria-hidden="true"></span>
        <div class="cta-body">
          <span class="trial">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
            Service &amp; AMC Management
          </span>
          <h3>See Saptivo in action for your service team</h3>
          <div class="btns">
            <a class="btn primary" href="#demo">
              Book a service management demo
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
            </a>
          </div>
        </div>
      </aside>
    </div>

    <!-- Internal Links -->
    <div class="bottom-links">
      <a href="/features/inventory">Inventory</a>
      <span class="dot">·</span>
      <a href="/features/mobile-crm">Mobile CRM</a>
      <span class="dot">·</span>
      <a href="/industries/field-service">Field Service &amp; Maintenance</a>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "FaqSection" });

// Background photo for the CTA card
const bgImage = `${import.meta.env.BASE_URL}images/features/threecolleagues-.jpg`;

// Blue overlay so threecolleagues-.jpg is visible with crisp white text
const ctaStyle = bgImage
  ? {
      backgroundImage: `linear-gradient(105deg, rgba(12, 34, 68, 0.9) 0%, rgba(19, 54, 106, 0.75) 55%, rgba(30, 82, 158, 0.45) 100%), url("${bgImage}")`,
    }
  : {};

const faqs = [
  {
    q: "What is AMC management software?",
    lead: "",
    a: "It is software that manages annual maintenance contracts: which assets are covered, how many visits are included, when visits are due, what is chargeable and when contracts renew.",
  },
  {
    q: "Can schedules run on running hours instead of dates?",
    lead: "Yes.",
    a: "Generators and similar equipment can trigger service by running hours or other usage readings.",
  },
  {
    q: "Does the technician app work offline?",
    lead: "Yes.",
    a: "Technicians can complete jobs without signal, and data syncs automatically when they reconnect.",
  },
];

const open = ref(0);
function toggle(i) {
  open.value = open.value === i ? -1 : i;
}

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const st = { io: null, fallback: null };

onMounted(() => {
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window) || !root.value) {
    seen.value = true;
    return;
  }
  st.io = new IntersectionObserver(
    (entries) => {
      const e = entries[entries.length - 1];
      if (e && e.isIntersecting) { seen.value = true; live.value = true; }
      else live.value = false;
    },
    { threshold: 0, rootMargin: "0px 0px -8% 0px" }
  );
  st.io.observe(root.value);
  st.fallback = window.setTimeout(() => { if (!seen.value) seen.value = true; }, 2500);
});

onBeforeUnmount(() => {
  if (st.io) st.io.disconnect();
  window.clearTimeout(st.fallback);
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");
.faq {
  --blue: #2563eb;
  --blue-bright: #3b82f6;
  --blue-soft: #eff6ff;
  --blue-tint: #f4f8ff;
  --ink: #0f172a;
  --muted: #526077;
  --line: #dbeafe;
  position: relative;
  overflow: clip;
  scroll-margin-top: 100px;
  padding: 112px 0;
  color: var(--ink);
  background: linear-gradient(180deg, #ffffff 0%, var(--blue-tint) 100%);
  font-family: 'Urbanist', system-ui, sans-serif;
}
.faq *, .faq *::before, .faq *::after { box-sizing: border-box; }
.faq a:focus-visible, .faq button:focus-visible { outline: 2px solid var(--blue); outline-offset: 3px; }

.title {
  margin: 0 auto; width: min(900px, calc(100% - 40px)); text-align: center; text-wrap: balance;
  font-size: clamp(34px, 3.6vw, 56px); font-weight: 500; line-height: 1.15;
  letter-spacing: -0.03em; color: var(--ink);
  font-family: "Poppins", system-ui, sans-serif;
}
.title span { display: block; }
.title .soft { color: var(--muted); }

.grid {
  width: min(1180px, calc(100% - 40px)); margin: 64px auto 0;
  display: grid; grid-template-columns: 1.15fr 1fr; gap: 56px; align-items: stretch;
}

/* ---------- Accordion ---------- */
.list { display: grid; gap: 14px; align-content: start; min-width: 0; }
.item { border: 1px solid var(--line); border-radius: 20px; background: #fff; transition: border-color 0.3s, background 0.3s, box-shadow 0.4s; }
.item.open { border-color: rgba(37, 99, 235, 0.35); background: var(--blue-soft); box-shadow: 0 16px 36px rgba(37, 99, 235, 0.09); }
.item h3 { margin: 0; font: inherit; }
.q {
  width: 100%; display: flex; align-items: center; gap: 16px; padding: 22px 24px;
  border: 0; background: none; cursor: pointer; text-align: left; color: var(--ink);
  font-family: "Poppins", system-ui, sans-serif;
}
.num { flex: none; font-size: 12.5px; font-weight: 600; color: var(--blue); letter-spacing: 0.04em; }
.qt { flex: 1; min-width: 0; font-size: 17px; font-weight: 500; line-height: 1.4; letter-spacing: -0.01em; }
.pm { position: relative; flex: none; width: 34px; height: 34px; border-radius: 50%; background: var(--blue-soft); transition: background 0.3s, transform 0.5s cubic-bezier(0.3, 1.4, 0.5, 1); }
.pm i { position: absolute; top: 50%; left: 50%; width: 12px; height: 2px; border-radius: 2px; background: var(--blue); transform: translate(-50%, -50%); transition: transform 0.4s, background 0.3s; }
.pm i:last-child { transform: translate(-50%, -50%) rotate(90deg); }
.item.open .pm { background: var(--blue); transform: rotate(180deg); }
.item.open .pm i { background: #fff; }
.item.open .pm i:last-child { transform: translate(-50%, -50%) rotate(0deg); }

.a { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.5s cubic-bezier(0.2, 0.7, 0.2, 1); }
.item.open .a { grid-template-rows: 1fr; }
.a-in { overflow: hidden; min-height: 0; padding: 0 24px 0 58px; opacity: 0; transition: opacity 0.35s ease, padding 0.5s; }
.item.open .a-in { opacity: 1; padding-bottom: 24px; transition-delay: 0.1s, 0s; }
.a-in p { margin: 0; font-size: 15.5px; line-height: 1.75; color: var(--muted); max-width: 52ch; }
.yes { color: var(--blue); font-weight: 600; margin-right: 4px; }

/* ---------- CTA (threecolleagues-.jpg + White Font Color) ---------- */
.cta {
  position: relative; overflow: hidden; display: flex; align-items: center;
  min-height: 380px; padding: 44px 40px; border-radius: 28px;
  background-color: #0c2244; background-size: cover; background-position: center; background-repeat: no-repeat;
  color: #ffffff !important; min-width: 0; box-shadow: 0 24px 50px rgba(15, 38, 78, 0.24);
}
.glow {
  position: absolute; right: -90px; top: -90px; z-index: 0; width: 320px; height: 320px; border-radius: 50%;
  background: radial-gradient(circle, rgba(96, 165, 250, 0.55), rgba(96, 165, 250, 0) 68%);
  animation: drift 7s ease-in-out infinite; pointer-events: none;
}
.cta-body { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: flex-start; color: #ffffff !important; }
.trial {
  display: inline-flex; align-items: center; gap: 7px; padding: 6px 12px; border-radius: 99px;
  background: rgba(255, 255, 255, 0.14); border: 1px solid rgba(255, 255, 255, 0.28);
  backdrop-filter: blur(6px); font-size: 12px; font-weight: 500; color: #ffffff !important;
}
.trial svg { color: #ffffff !important; }
.cta h3 {
  margin: 20px 0 12px; font-size: clamp(28px, 2.8vw, 38px); font-weight: 500;
  line-height: 1.22; letter-spacing: -0.025em; text-wrap: balance;
  font-family: "Poppins", system-ui, sans-serif; color: #ffffff !important;
}
.btns { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 20px; }
.btn {
  position: relative; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; gap: 9px;
  padding: 14px 24px; border-radius: 99px; font-size: 14.5px; font-weight: 500; text-decoration: none; white-space: nowrap;
  color: #ffffff !important;
  transition: transform 0.35s cubic-bezier(0.3, 1.4, 0.5, 1), background 0.3s, border-color 0.3s, box-shadow 0.3s;
}
.btn svg { transition: transform 0.35s cubic-bezier(0.3, 1.4, 0.5, 1); color: #ffffff !important; }
.btn.primary { background: linear-gradient(180deg, #3b82f6, #2563eb); color: #ffffff !important; box-shadow: 0 12px 28px rgba(37, 99, 235, 0.42); }
.btn.primary:hover { transform: translateY(-2px); box-shadow: 0 16px 34px rgba(37, 99, 235, 0.55); color: #ffffff !important; }
.btn.primary:hover svg { transform: translateX(4px); }
.btn.primary::after { content: ""; position: absolute; inset: 0; background: linear-gradient(100deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%); transform: translateX(-100%); animation: sheen 3.6s ease-in-out infinite; }

/* ---------- Bottom Links ---------- */
.bottom-links {
  display: flex; justify-content: center; align-items: center; gap: 14px;
  margin-top: 56px; font-size: 14px; font-weight: 500; color: #94a3b8; flex-wrap: wrap;
}
.bottom-links a { color: var(--muted); text-decoration: none; transition: color 0.25s; }
.bottom-links a:hover { color: var(--blue); }
.dot { color: #cbd5e1; }

/* ---------- Entrance (runs once) ---------- */
.faq:not(.in) .list, .faq:not(.in) .cta, .faq:not(.in) .bottom-links { opacity: 0; }
.faq.in .title span { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.faq.in .title .soft { animation-delay: 0.1s; }
.faq.in .list { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 0.15s backwards; }
.faq.in .cta { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.3s backwards; }
.faq.in .bottom-links { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 0.45s backwards; }
.faq:not(.live) .glow, .faq:not(.live) .btn.primary::after { animation-play-state: paused; }

@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes sheen { 0%, 45% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
@keyframes drift { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-30px, 24px); } }

/* ---------- Responsive ---------- */
@media (max-width: 960px) {
  .grid { grid-template-columns: minmax(0, 1fr); gap: 36px; }
  .cta { min-height: 340px; }
}
@media (max-width: 760px) {
  .faq { padding: 72px 0; }
  .grid { width: calc(100% - 32px); margin-top: 40px; }
  .q { padding: 18px 16px; gap: 12px; }
  .qt { font-size: 15.5px; }
  .a-in { padding-left: 16px; padding-right: 16px; }
  .cta { padding: 32px 22px; border-radius: 22px; background-position: 70% center; }
  .cta-body { width: 100%; }
  .btns { flex-direction: column; align-items: stretch; width: 100%; }
}
@media (prefers-reduced-motion: reduce) {
  .faq *, .faq *::before, .faq *::after { animation: none !important; transition: none !important; }
  .faq:not(.in) .list, .faq:not(.in) .cta, .faq:not(.in) .bottom-links { opacity: 1; }
}
</style>

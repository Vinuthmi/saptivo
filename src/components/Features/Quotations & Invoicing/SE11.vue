<template>
  <section id="faq" ref="root" class="faq" :class="{ in: seen, live }" aria-labelledby="faq-title">
    <h2 id="faq-title" class="title">
      <span>Frequently</span>
      <span class="soft">asked questions</span>
    </h2>

    <div class="grid">
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
              <p>{{ f.a }}</p>
              <span class="chip">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
                {{ f.chip }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <aside class="cta" :style="ctaStyle" aria-label="Get started">
        <span class="glow" aria-hidden="true"></span>
        <div class="cta-body">
          <span class="trial">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
            14-day free trial
          </span>
          <h3>Create your first quotation free</h3>
          <p>Send branded quotations, track approvals, and turn accepted quotes into invoices with Saptivo.</p>
          <div class="btns">
            <a class="btn primary" href="#signup">
              Create your first quotation free
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
            </a>
            <a class="btn ghost" href="#demo">Book a demo</a>
          </div>
        </div>
      </aside>
    </div>

    <nav class="related-links" aria-label="Related features">
      <span>Explore more:</span>
      <RouterLink to="/features/sales-pipeline/">Sales Pipeline</RouterLink>
      <RouterLink to="/features/inventory-management/">Inventory</RouterLink>
      <RouterLink to="/industries/wholesale-distribution/">Wholesale &amp; Distribution</RouterLink>
    </nav>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "FeaturesSection8" });
const bgImage = `${import.meta.env.BASE_URL}images/features/threecolleagues-.jpg`;
const ctaStyle = {
  backgroundImage: `linear-gradient(100deg, rgba(20, 18, 15, 0.9) 0%, rgba(20, 18, 15, 0.72) 55%, rgba(20, 18, 15, 0.5) 100%), url("${bgImage}")`,
};

const faqs = [
  {
    q: "Can I put my own logo and terms on quotations?",
    a: "Yes. Every PDF uses your branding, and you can set default terms and validity periods.",
    chip: "Your brand on every quote",
  },
  {
    q: "Does Saptivo calculate VAT?",
    a: "Yes. Configure your tax rates once and Saptivo applies them to every quotation and invoice.",
    chip: "VAT calculated automatically",
  },
  {
    q: "Can customers accept quotes online?",
    a: "Yes. Through the Saptivo customer portal, customers can accept a quote with a digital signature.",
    chip: "Accept quotes online",
  },
  {
    q: "Can Saptivo bill customers automatically every month?",
    a: "Yes. Set up a recurring invoice schedule and, with a gateway that supports recurring billing, the customer's card is charged automatically each period.",
    chip: "Automate recurring invoices",
  },
  {
    q: "Can I track which quotes are about to expire?",
    a: "Yes. Quotes carry a validity date, and automations can remind the rep before a quote expires.",
    chip: "Stay ahead of expiring quotes",
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
.faq {
  --ink: #14152b;
  --muted: #6c7084;
  --line: rgba(20, 21, 43, 0.12);
  --accent: #33485d;
  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  padding: 112px 0;
  color: var(--ink);
  background: #fff;
  font-family: "Poppins", system-ui, sans-serif;
}
.faq *, .faq *::before, .faq *::after { box-sizing: border-box; }
.faq a:focus-visible, .faq button:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

.faq-layout {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 clamp(20px, 4vw, 40px);
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: clamp(32px, 5vw, 72px);
  align-items: center;
}
.faq-image {
  grid-column: 2;
  grid-row: 1;
  display: block;
  width: 100%;
  height: 100%;
  min-height: 500px;
  max-height: 680px;
  border-radius: 24px;
  object-fit: cover;
  object-position: 64% center;
}
.faq-content {
  grid-column: 1;
  grid-row: 1;
  min-width: 0;
}
.title {
  margin: 0 0 36px;
  text-align: left;
  text-wrap: balance;
  font-family: "Urbanist", system-ui, sans-serif;
  font-size: clamp(34px, 3.6vw, 56px);
  font-weight: 500;
  line-height: 1.15;
  letter-spacing: -0.03em;
  color: var(--ink);
}
.title span { display: block; }
.title .soft {
  color: var(--muted);
}
.list {
  list-style: none;
  min-width: 0;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 14px;
}
.item {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 20px;
  background: #fff;
  transition: border-color 0.3s, background 0.3s, box-shadow 0.4s;
}
.item.open {
  border-color: rgba(51, 72, 93, 0.35);
  background: #f5f7f8;
  box-shadow: 0 16px 36px rgba(51, 72, 93, 0.1);
}
.item h3 { margin: 0; font: inherit; }
.q {
  display: flex;
  width: 100%;
  gap: 16px;
  justify-content: space-between;
  align-items: center;
  padding: 22px 24px;
  border: 0;
  background: none;
  color: var(--ink);
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.qt {
  flex: 1;
  min-width: 0;
  font-size: 17px;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: -0.01em;
  transition: color 0.3s;
}
.item:not(.open) .q:hover .qt { color: var(--accent); }
.pm {
  position: relative;
  flex: none;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #f4efec;
  transition: background 0.3s, transform 0.5s cubic-bezier(0.3, 1.4, 0.5, 1);
}
.pm::before, .pm::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 12px;
  height: 2px;
  border-radius: 2px;
  background: var(--ink);
  transform: translate(-50%, -50%);
  transition: transform 0.4s, background 0.3s;
}
.pm::after { transform: translate(-50%, -50%) rotate(90deg); }
.item.open .pm { background: #33485d; transform: rotate(180deg); }
.item.open .pm::before, .item.open .pm::after { background: #fff; }
.item.open .pm::after { transform: translate(-50%, -50%) rotate(0); }
.a { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.5s var(--ease); }
.a > div { overflow: hidden; }
.a p {
  margin: 0;
  padding: 0 24px 24px;
  max-width: 72ch;
  color: var(--muted);
  font-size: 15.5px;
  line-height: 1.7;
  opacity: 0;
  transition: opacity 0.3s;
}
.item.open .a { grid-template-rows: 1fr; }
.item.open .a p { opacity: 1; transition-delay: 0.12s; }
.cta {
  position: relative;
  overflow: hidden;
  max-width: 1160px;
  min-height: 380px;
  margin: 52px auto 0;
  padding: 44px 40px;
  display: flex;
  align-items: center;
  border-radius: 28px;
  background-color: var(--ink);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: #fff;
  box-shadow: 0 24px 50px rgba(20, 18, 15, 0.25);
}
.glow {
  position: absolute;
  right: -90px;
  top: -90px;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(51, 72, 93, 0.3), rgba(51, 72, 93, 0) 68%);
  animation: drift 7s ease-in-out infinite;
  pointer-events: none;
}
.cta-body {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.trial {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  backdrop-filter: blur(6px);
}
.cta h3 {
  margin: 20px 0 12px;
  font: 500 clamp(24px, 2.4vw, 32px)/1.22 "Urbanist", system-ui, sans-serif;
  letter-spacing: -0.025em;
  text-wrap: balance;
}
.cta p {
  max-width: 40ch;
  margin: 0;
  color: rgba(255, 255, 255, 0.82);
  font-size: 15px;
  line-height: 1.7;
}
.btns {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 30px;
}
.btn {
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 24px;
  border-radius: 99px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  transition: transform 0.35s cubic-bezier(0.3, 1.4, 0.5, 1), background 0.3s, border-color 0.3s, box-shadow 0.3s;
}
.btn svg { transition: transform 0.35s cubic-bezier(0.3, 1.4, 0.5, 1); }
.btn.primary {
  box-shadow: 0 12px 28px rgba(51, 72, 93, 0.24);
  border: 1px solid #33485d;
  background: #33485d;
  color: #fff;
  isolation: isolate;
}
.btn.primary::after {
  position: absolute;
  z-index: -1;
  inset: 0;
  content: "";
  background: linear-gradient(100deg, transparent 30%, rgba(255, 255, 255, 0.28) 50%, transparent 70%);
  transform: translateX(-100%);
  animation: sheen 3.6s ease-in-out infinite;
}
.btn.primary:hover { transform: translateY(-2px); box-shadow: 0 16px 34px rgba(51, 72, 93, 0.32); }
.btn.primary:hover svg { transform: translateX(4px); }
.btn.ghost {
  border: 1px solid rgba(255, 255, 255, 0.45);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}
.btn.ghost:hover {
  transform: translateY(-2px);
  border-color: #fff;
  background: rgba(255, 255, 255, 0.16);
}
.related-links {
  width: min(1160px, calc(100% - 40px));
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px 16px;
  margin: 28px auto 0;
  color: var(--muted);
  font-size: 13px;
}
.related-links a { color: var(--accent); font-weight: 500; text-decoration: none; }
.related-links a:hover { text-decoration: underline; }
.title { margin: 0 auto; width: min(900px, calc(100% - 40px)); text-align: center; }
.grid {
  width: min(1180px, calc(100% - 40px));
  margin: 64px auto 0;
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 56px;
  align-items: stretch;
}
.list { align-content: start; }
.num { flex: none; color: var(--accent); font-size: 12.5px; font-weight: 600; letter-spacing: 0.04em; }
.q { align-items: center; font-family: "Poppins", system-ui, sans-serif; }
.pm::before, .pm::after { display: none; }
.pm i {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 2px;
  border-radius: 2px;
  background: var(--ink);
  transform: translate(-50%, -50%);
  transition: transform 0.4s, background 0.3s;
}
.pm i:last-child { transform: translate(-50%, -50%) rotate(90deg); }
.item.open .pm i { background: #fff; }
.item.open .pm i:last-child { transform: translate(-50%, -50%) rotate(0); }
.a > div { overflow: hidden; }
.a-in {
  overflow: hidden;
  min-height: 0;
  padding: 0 24px 0 58px;
  opacity: 0;
  transition: opacity 0.35s ease, padding 0.5s;
}
.item.open .a-in { opacity: 1; padding-bottom: 24px; transition-delay: 0.1s, 0s; }
.a-in p { margin: 0 0 14px; padding: 0; max-width: 52ch; line-height: 1.75; }
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 99px;
  background: #e6f6ec;
  color: #15803d;
  font-size: 12px;
  font-weight: 600;
}
.cta { max-width: none; min-height: 380px; margin: 0; min-width: 0; }
.trial { gap: 7px; }
.btn.primary { background: #33485d; }
.faq:not(.in) .list, .faq:not(.in) .cta { opacity: 0; }
.faq.in .title span { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.faq.in .title .soft { animation-delay: 0.1s; }
.faq.in .list { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 0.15s backwards; }
.faq.in .cta { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.3s backwards; }
.faq:not(.live) .glow, .faq:not(.live) .btn.primary::after { animation-play-state: paused; }
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
  .related-links { width: calc(100% - 32px); }
}
@keyframes sheen { 0%, 45% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
@keyframes drift { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-30px, 24px); } }
@media (prefers-reduced-motion: reduce) {
  .faq *, .faq *::before, .faq *::after { animation: none !important; transition: none !important; }
  .faq:not(.in) .list, .faq:not(.in) .cta { opacity: 1; }
}
</style>

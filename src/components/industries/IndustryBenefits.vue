<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineOptions({ name: 'IndustriesCore' })

const root = ref(null)
let io

onMounted(() => {
  if (!('IntersectionObserver' in window)) return root.value?.classList.add('in')
  io = new IntersectionObserver(
    (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add('in'), io.disconnect())),
    { threshold: 0.2 }
  )
  io.observe(root.value)
})
onBeforeUnmount(() => io && io.disconnect())
</script>

<template>
  <section class="ic" ref="root" aria-labelledby="ic-title">
    <div class="ic-in">
      <header class="ic-head">
        <h2 id="ic-title" class="ic-title">What every <em>industry gets</em></h2>
        <p class="ic-lead">
          Whatever your sector, every Saptivo workspace includes the core of a modern CRM. Industry workflows sit on top of that core, so a retail chain and a solar installer share the same reliable foundation but see the screens, fields and reports that matter to them.
        </p>
      </header>

      <div class="ic-grid">
        <!-- Lead capture (tall, photo) -->
        <article class="card photo c-leads" style="--d: 0">
          <div class="card-bg"></div>
          <span class="go" aria-hidden="true"><svg viewBox="0 0 20 20" width="20" height="20" fill="none"><path d="M6 14L14 6M7 6h7v7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg></span>
          <div class="card-tx">
            <h3>Lead capture</h3>
            <p>Lead capture from your website, Facebook and WhatsApp.</p>
            <div class="chips"><span>Website</span><span>Facebook</span><span>WhatsApp</span></div>
          </div>
        </article>

        <!-- Visual sales pipeline -->
        <article class="card navy c-pipe" style="--d: 1">
          <div class="pipe" aria-hidden="true">
            <span class="st"><i></i>Lead</span>
            <span class="ln"></span>
            <span class="st"><i></i>Quoted</span>
            <span class="ln"></span>
            <span class="st won"><i></i>Won</span>
          </div>
          <div class="card-tx"><h3>Sales pipeline</h3><p>A visual sales pipeline.</p></div>
        </article>

        <!-- Role-based security -->
        <article class="card orange c-sec" style="--d: 2">
          <svg class="lock" viewBox="0 0 48 48" width="44" height="44" fill="none" aria-hidden="true">
            <rect x="9" y="21" width="30" height="21" rx="6" stroke="#fff" stroke-width="2.4" />
            <path d="M16 21v-5a8 8 0 0116 0v5" stroke="#fff" stroke-width="2.4" stroke-linecap="round" />
            <circle cx="24" cy="31.5" r="3" fill="#fff" />
          </svg>
          <div class="card-tx"><h3>Security</h3><p>Role-based security.</p></div>
        </article>

        <!-- Quotations and invoices -->
        <article class="card peach c-quote" style="--d: 3">
          <span class="pill">Branded</span>
          <h3>Quotations and invoices</h3>
          <p>Branded quotations and invoices.</p>
          <div class="doc" aria-hidden="true">
            <div class="doc-h"><span class="logo"></span><b>Quotation</b><em>Sent</em></div>
            <div class="doc-r"><i></i><s></s></div>
            <div class="doc-r"><i style="width:58%"></i><s></s></div>
            <div class="doc-r"><i style="width:72%"></i><s></s></div>
            <div class="doc-t"><small>Total</small><b></b></div>
            <span class="stamp">Invoice paid</span>
          </div>
        </article>

        <!-- Real-time reports (photo) -->
        <article class="card photo c-rep" style="--d: 4">
          <div class="card-bg"></div>
          <div class="card-tx">
            <h3>Reports</h3>
            <p>Real-time reports.</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ic { font-family: 'Poppins', system-ui, sans-serif; color: #0f172a; background: #fff; padding: clamp(56px, 7vw, 110px) clamp(20px, 4vw, 40px); }
.ic-in { max-width: 1180px; margin: 0 auto; }

.ic-head { display: grid; grid-template-columns: 1fr; gap: 16px; justify-items: center; margin-bottom: clamp(32px, 4vw, 56px); text-align: center; }
.ic-title {
  margin: 0;
  font-family: 'Inter Display', Inter, system-ui, sans-serif;
  font-size: clamp(36px, 5vw, 64px);
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: -0.055em;
}
.ic-title em { font-style: normal; background: linear-gradient(100deg, #ff9a3d 0%, #ff6a1a 45%, #f2540c 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
.ic-lead {
  max-width: 820px;
  margin: 14px auto 0;
  font-family: 'Inter Display', Inter, system-ui, sans-serif;
  font-size: clamp(15px, 1.1vw, 18px);
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: -0.015em;
  color: #475569;
}

/* grid: tall | stacked | stacked */
.ic-grid {
  display: grid;
  grid-template-columns: 1.15fr 1fr 1fr;
  grid-template-rows: repeat(2, minmax(220px, 1fr));
  gap: 16px;
  min-height: clamp(520px, 56vw, 640px);
}
.c-leads { grid-column: 1; grid-row: 1 / 3; }
.c-pipe { grid-column: 2; grid-row: 1; }
.c-quote { grid-column: 2; grid-row: 2; }
.c-sec { grid-column: 3; grid-row: 1; }
.c-rep { grid-column: 3; grid-row: 2; }

.card {
  position: relative; overflow: hidden; isolation: isolate;
  border-radius: 24px; padding: clamp(18px, 2vw, 26px);
  display: flex; flex-direction: column; justify-content: flex-end;
  color: #fff;
  opacity: 0; transform: translateY(28px);
  transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1), box-shadow 0.35s ease;
  transition-delay: calc(var(--d) * 0.09s);
}
.in .card { opacity: 1; transform: none; }
.in .card:hover { transform: translateY(-4px); transition-delay: 0s; box-shadow: 0 24px 40px -24px rgba(15, 23, 42, 0.45); }
.card h3 { margin: 0; font-family: 'Inter Display', Inter, system-ui, sans-serif; font-size: clamp(20px, 2vw, 28px); font-weight: 500; letter-spacing: -0.035em; line-height: 1.12; }
.card p { margin: 8px 0 0; font-size: 14px; line-height: 1.5; opacity: 0.9; }
.card-tx { position: relative; z-index: 2; }

/* photo cards */
.photo { background: #1f2937; }
.card-bg { position: absolute; inset: 0; z-index: -1; background-size: cover; background-position: center; transition: transform 0.9s cubic-bezier(0.2, 0.7, 0.2, 1); }
.photo:hover .card-bg { transform: scale(1.05); }
.photo::after { content: ''; position: absolute; inset: 0; z-index: 0; background: linear-gradient(to top, rgba(15, 23, 42, 0.82) 8%, rgba(15, 23, 42, 0.18) 60%, rgba(15, 23, 42, 0.08)); }
.c-leads .card-bg { background-image: url('https://images.unsplash.com/photo-1789724920013-b88079687da2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D'), linear-gradient(160deg, #fb923c, #7c2d12); }
.la { position: absolute; z-index: 1; top: 22px; left: 22px; right: 80px; display: flex; flex-direction: column; gap: 12px; }
.la-msg, .la-lead { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 16px; background: rgba(255, 255, 255, 0.95); color: #0f172a; box-shadow: 0 14px 28px -16px rgba(15, 23, 42, 0.6); width: max-content; max-width: 100%; }
.la-msg b, .la-lead b { display: block; font-size: 12px; font-weight: 600; }
.la-msg span, .la-lead small { display: block; font-size: 11.5px; color: #64748b; }
.la-msg i { width: 28px; height: 28px; border-radius: 50%; flex: none; }
.la-msg .wa { background: #22c55e; } .la-msg .fb { background: #2563eb; } .la-msg .web { background: #0f172a; }
.m2 { margin-left: 28px; } .m3 { margin-left: 10px; }
.la-lead { background: #0f172a; color: #fff; margin-top: 6px; }
.la-lead small { color: #cbd5e1; }
.la-lead .av { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #ffb27a, #ff6818); flex: none; }
.la-lead em { font-style: normal; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 999px; background: #f2540c; margin-left: 6px; }
.in .la > * { animation: lain 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
.in .m1 { animation-delay: 0.4s; } .in .m2 { animation-delay: 0.65s; } .in .m3 { animation-delay: 0.9s; } .in .la-lead { animation-delay: 1.3s; }
@keyframes lain { from { opacity: 0; transform: translateY(14px) scale(0.96); } }
@media (prefers-reduced-motion: reduce) { .la > * { animation: none !important; } }
.c-rep .card-bg {
  background-image: url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80'), linear-gradient(160deg, #334155, #0f172a);
}
.go {
  position: absolute; top: 18px; right: 18px; z-index: 2;
  width: 48px; height: 48px; border-radius: 50%;
  background: rgba(255, 255, 255, 0.88); color: #0f172a; display: grid; place-items: center;
  transition: transform 0.3s ease, background 0.3s ease;
}
.card:hover .go { transform: rotate(45deg); background: #fff; }
.chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.chips span { font-size: 12px; padding: 6px 13px; border-radius: 999px; border: 1px solid rgba(255, 255, 255, 0.55); background: rgba(255, 255, 255, 0.12); backdrop-filter: blur(6px); }

/* navy pipeline card */
.navy { background: #f4efe9; color: #0f172a; }
.navy p { color: #64748b; opacity: 1; }
.navy::before { content: ''; position: absolute; width: 260px; height: 260px; right: -80px; top: -100px; border-radius: 50%; background: radial-gradient(circle, rgba(255, 104, 24, 0.28), transparent 70%); z-index: -1; }
.pipe { position: absolute; top: 24px; left: 24px; right: 24px; display: flex; align-items: center; gap: 8px; }
.pipe .st { display: inline-flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 500; padding: 7px 13px; border-radius: 999px; background: #fff; color: #475569; box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08); }
.pipe .st i { width: 7px; height: 7px; border-radius: 50%; background: #cbd5e1; }
.pipe .won { background: linear-gradient(135deg, #ff6818, #f2540c); color: #fff; }
.pipe .won i { background: #fff; }
.pipe .ln { flex: 1; height: 2px; border-radius: 2px; background: #ded6cc; transform-origin: left; }
.in .pipe > * { animation: pop 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
.in .pipe > :nth-child(2) { animation-delay: 0.5s; } .in .pipe > :nth-child(3) { animation-delay: 0.7s; }
.in .pipe > :nth-child(4) { animation-delay: 0.9s; } .in .pipe > :nth-child(5) { animation-delay: 1.1s; }
@keyframes pop { from { opacity: 0; transform: translateY(8px); } }

/* orange security card */
.orange { background: linear-gradient(140deg, #ff7a2a 0%, #f2540c 70%, #d9420a 100%); }
.orange::before { content: ''; position: absolute; inset: 0; z-index: -1; background-image: radial-gradient(rgba(255, 255, 255, 0.22) 1px, transparent 1.4px); background-size: 16px 16px; -webkit-mask-image: linear-gradient(135deg, #000, transparent 65%); mask-image: linear-gradient(135deg, #000, transparent 65%); }
.lock { position: absolute; top: 20px; left: 22px; transition: transform 0.4s ease; }
.card:hover .lock { transform: translateY(-3px) rotate(-6deg); }

/* peach quotations card */
.peach { background: #fdeee0; color: #0f172a; justify-content: flex-start; gap: 14px; }
.pill { align-self: flex-start; font-size: 12px; font-weight: 500; padding: 5px 13px; border-radius: 999px; border: 1px solid rgba(15, 23, 42, 0.35); }
.peach h3 { font-size: clamp(20px, 1.9vw, 26px); max-width: 12em; }
.peach p { margin: -6px 0 0; max-width: 9.5em; color: #475569; }
.doc { position: absolute; right: 16px; bottom: -22px; width: 148px; padding: 11px; border-radius: 12px 12px 0 0; background: #fff; box-shadow: 0 18px 34px -16px rgba(15, 23, 42, 0.45); display: flex; flex-direction: column; gap: 8px; transform: rotate(4deg); transform-origin: bottom right; transition: transform 0.45s cubic-bezier(0.2, 0.7, 0.2, 1); }
.peach:hover .doc { transform: rotate(0) translateY(-8px); }
.doc-h { display: flex; align-items: center; gap: 6px; font-size: 11px; }
.doc-h b { font-weight: 600; }
.doc-h em { margin-left: auto; font-style: normal; font-size: 9px; font-weight: 600; padding: 2px 7px; border-radius: 999px; background: #fff1e6; color: #c2410c; }
.logo { width: 14px; height: 14px; border-radius: 5px; background: linear-gradient(135deg, #ff9a3d, #f2540c); }
.doc-r { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.doc-r i { display: block; height: 5px; width: 80%; border-radius: 3px; background: #e4e7ec; }
.doc-r s { display: block; width: 22px; height: 5px; border-radius: 3px; background: #cfd5dd; }
.doc-t { display: flex; justify-content: space-between; align-items: center; padding: 8px 9px; border-radius: 8px; background: #fff3ea; margin-top: 2px; }
.doc-t small { font-size: 10px; color: #64748b; }
.doc-t b { width: 42px; height: 8px; border-radius: 4px; background: linear-gradient(135deg, #ff6818, #f2540c); }
.stamp { position: absolute; left: -26px; top: 58px; font-size: 10px; font-weight: 600; letter-spacing: 0.02em; padding: 5px 10px; border-radius: 999px; background: #16a34a; color: #fff; box-shadow: 0 8px 16px -8px rgba(22, 163, 74, 0.8); transform: rotate(-8deg) scale(0); }
.in .stamp { animation: stampin 0.5s cubic-bezier(0.3, 1.5, 0.5, 1) 1.2s both; }
@keyframes stampin { to { transform: rotate(-8deg) scale(1); } }

/* fit the whole section in one screen on desktop */
@media (min-width: 961px) {
  .ic { box-sizing: border-box; min-height: 100svh; display: flex; align-items: center; padding: clamp(20px, 3.5svh, 40px) clamp(20px, 4vw, 40px); }
  .ic-in { width: 100%; }
  .ic-head { gap: 8px; margin-bottom: clamp(16px, 3svh, 30px); }
  .ic-title { font-size: clamp(32px, min(4.4vw, 7.4svh), 56px); }
  .ic-lead { margin-top: 6px; max-width: 900px; font-size: clamp(13px, min(1vw, 2svh), 15.5px); line-height: 1.5; }
  .ic-grid { grid-template-rows: repeat(2, minmax(0, 1fr)); min-height: 0; height: clamp(340px, calc(100svh - 340px), 600px); }
}
@media (max-width: 960px) {
  .ic-grid { grid-template-columns: 1fr 1fr; grid-template-rows: none; grid-auto-rows: minmax(200px, auto); height: auto; }
  .c-leads { grid-column: 1 / 3; grid-row: auto; min-height: 320px; }
  .c-pipe, .c-quote, .c-sec, .c-rep { grid-column: auto; grid-row: auto; min-height: 210px; }
}
@media (max-width: 560px) {
  .ic-grid { grid-template-columns: 1fr; }
  .c-leads { grid-column: auto; }
}
@media (prefers-reduced-motion: reduce) {
  .card { opacity: 1; transform: none; transition: none; }
  .pipe > *, .stamp { animation: none !important; } .stamp { transform: rotate(-8deg) scale(1); }
}
</style>
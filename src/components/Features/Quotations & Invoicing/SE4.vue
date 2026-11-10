<template>
  <section id="invoicing" ref="root" class="inv" :class="{ in: seen, live }" aria-labelledby="inv-title">
    <div class="wrap">
      <!-- ============ copy ============ -->
      <div class="copy">
        <h2 id="inv-title" class="title">
          <span>Quote to invoice</span>
          <span class="soft">in one click</span>
        </h2>
        <p class="lead">
          When the customer accepts, convert the quotation into a tax invoice with one click. No retyping, no pricing
          mistakes. Saptivo's invoice software then handles the rest:
        </p>

        <ul class="feats">
          <li v-for="f in feats" :key="f.text">
            <span class="fi" :class="f.tone" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10" /></svg>
            </span>
            <span>{{ f.text }}</span>
          </li>
        </ul>

        <p class="lk">
          <span class="lkchip">LKR</span><span class="lkchip">VAT</span>
          For businesses in Sri Lanka, invoices support LKR and VAT out of the box.
        </p>
      </div>

      <!-- ============ visual ============ -->
      <div class="visual">
        <div class="photo" aria-hidden="true">
          <img
            v-if="imgOk"
            :src="photo"
            alt=""
            loading="lazy"
            decoding="async"
            @error="imgOk = false"
          />
          <span class="blob b1"></span>
          <span class="blob b2"></span>
        </div>

        <!-- accepted quotation -->
        <article class="card q" :class="{ accepted }" aria-label="Quotation">
          <div class="dh">
            <span class="badge qb">Quotation</span>
            <div class="dt"><b>QT-0142</b><small>Ceylon Motors</small></div>
            <span :key="accepted" class="chip" :class="{ ok: accepted }">{{ accepted ? "Accepted" : "Sent" }}</span>
          </div>
          <div class="convert" :class="{ press }">
            Convert to invoice
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </div>
        </article>

        <!-- tax invoice -->
        <article class="card i" :class="{ show: made }" aria-label="Tax invoice">
          <div class="dh">
            <span class="badge ib">Tax invoice</span>
            <div class="dt"><b>INV-0087</b><small>Ceylon Motors · LKR</small></div>
            <span :key="status" class="chip" :class="status">{{ statusLabel }}</span>
          </div>

          <ul class="rows">
            <li><span>Subtotal</span><b class="mono">Rs. 405,000</b></li>
            <li><span>VAT 18%</span><b class="mono">Rs. 72,900</b></li>
            <li class="tot"><span>Total</span><b class="mono">Rs. 477,900</b></li>
          </ul>

          <div class="pay">
            <div class="bar"><i :style="{ width: paid + '%' }"></i></div>
            <div class="pl">
              <span>{{ paidText }}</span>
              <span class="mono">{{ balanceText }}</span>
            </div>
          </div>
        </article>

        <div class="toast" :class="{ show: !!toast }" role="status">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
          {{ toast }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const photo = `${import.meta.env.BASE_URL}images/features/smiling-woman-using-smartphone-in-front-of-green-w-2026-10-27-20-08-47-utc.jpg`;

const feats = [
  { text: "Compliant tax invoices with your branding", tone: "peach" },
  { text: "Credit notes and customer credit balances", tone: "lav" },
  { text: "Partial payments and payment status (unpaid, partial, paid)", tone: "sky" },
  { text: "Optional integration with your accounting software", tone: "butter" },
];

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const imgOk = ref(true);
const accepted = ref(false);
const press = ref(false);
const made = ref(false);
const status = ref("unpaid"); // unpaid | partial | paid
const toast = ref("");

const statusLabel = computed(() => ({ unpaid: "Unpaid", partial: "Partial", paid: "Paid" })[status.value]);
const paid = computed(() => (status.value === "paid" ? 100 : status.value === "partial" ? 52 : 0));
const paidText = computed(() => (status.value === "paid" ? "Paid in full" : status.value === "partial" ? "Rs. 250,000 received" : "No payment yet"));
const balanceText = computed(() => (status.value === "paid" ? "Balance 0" : status.value === "partial" ? "Balance Rs. 227,900" : "Due Rs. 477,900"));

const st = { beat: 0, timer: null, io: null, fallback: null };
const LEN = 14; // beats of 1.2 s

function reset() {
  accepted.value = false;
  press.value = false;
  made.value = false;
  status.value = "unpaid";
  toast.value = "";
}

function tick() {
  const b = st.beat;
  if (b === 0) reset();
  if (b === 1) { accepted.value = true; toast.value = "Customer accepted QT-0142"; }
  if (b === 3) { press.value = true; toast.value = ""; }
  if (b === 4) { press.value = false; made.value = true; toast.value = "INV-0087 created"; }
  if (b === 6) toast.value = "";
  if (b === 8) { status.value = "partial"; toast.value = "Partial payment recorded"; }
  if (b === 11) { status.value = "paid"; toast.value = "Marked as paid"; }
  if (b === 13) toast.value = "";
  st.beat = (b + 1) % LEN;
}

function start() {
  seen.value = true;
  live.value = true;
  if (st.timer === null) st.timer = window.setInterval(tick, 1200);
}
function stop() {
  live.value = false;
  if (st.timer !== null) { window.clearInterval(st.timer); st.timer = null; }
}

onMounted(() => {
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window) || !root.value) {
    // static picture: invoice created, partly paid
    seen.value = true;
    for (let k = 0; k < 10; k++) tick();
    toast.value = "";
    return;
  }
  st.io = new IntersectionObserver(
    (entries) => {
      const e = entries[entries.length - 1];
      if (e && e.isIntersecting) start();
      else stop();
    },
    { threshold: 0, rootMargin: "0px 0px -8% 0px" }
  );
  st.io.observe(root.value);
  st.fallback = window.setTimeout(() => { if (!seen.value) seen.value = true; }, 2500);
});
onBeforeUnmount(() => {
  if (st.io) st.io.disconnect();
  window.clearTimeout(st.fallback);
  stop();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

.inv {
  --ink: #14120f;
  --muted: #6a6560;
  --peach: #ffe9df;
  --butter: #fff3cf;
  --sky: #e0f0ff;
  --lav: #f0ecff;
  --mint: #e3f6ec;
  --pink: #ffe4ee;
  position: relative;
  overflow: clip;
  scroll-margin-top: 100px;
  padding: 112px 0;
  color: var(--ink);
  background: #fff;
  font-family: "Poppins", system-ui, sans-serif;
}
.inv *, .inv *::before, .inv *::after { box-sizing: border-box; }
.mono { font-variant-numeric: tabular-nums; }

.wrap { width: min(1180px, calc(100% - 40px)); margin: 0 auto; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); gap: 72px; align-items: center; }

/* ---------- copy ---------- */
.title { margin: 0 0 22px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
.title span { display: block; }
.title .soft { color: var(--muted); }
.lead { margin: 0 0 28px; max-width: 52ch; font-size: 16.5px; line-height: 1.75; color: var(--muted); }
.feats { list-style: none; margin: 0 0 30px; padding: 0; display: grid; gap: 14px; }
.feats li { display: flex; align-items: center; gap: 14px; font-size: 15.5px; font-weight: 500; line-height: 1.45; }
.fi { flex: none; display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; color: var(--ink); }
.fi.peach { background: var(--peach); }
.fi.lav { background: var(--lav); }
.fi.sky { background: var(--sky); }
.fi.butter { background: var(--butter); }
.lk { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin: 0; max-width: 52ch; font-size: 14px; line-height: 1.6; color: var(--muted); }
.lkchip { padding: 4px 10px; border-radius: 99px; background: var(--mint); color: #15803d; font-size: 12px; font-weight: 600; }

/* ---------- visual ---------- */
.visual { position: relative; min-height: 560px; }
.photo { position: absolute; inset: 0 0 0 12%; border-radius: 34px; overflow: hidden; background: var(--mint); }
.photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%; }
.blob { position: absolute; border-radius: 50%; }
.b1 { width: 220px; height: 220px; right: -60px; top: -60px; background: var(--butter); opacity: 0.8; }
.b2 { width: 180px; height: 180px; left: -50px; bottom: 30px; background: var(--pink); opacity: 0.7; }
.photo img ~ .blob { display: none; }

.card { position: absolute; display: flex; flex-direction: column; gap: 14px; padding: 18px; border-radius: 26px; background: #fff; box-shadow: 0 30px 50px -28px rgba(20, 18, 15, 0.38); }
.q { left: 0; top: 36px; width: min(300px, 62%); background: var(--lav); }
.i { right: -10px; bottom: 36px; width: min(350px, 78%); background: var(--sky); opacity: 0; transform: translateY(22px) scale(0.96); transition: opacity 0.5s, transform 0.6s cubic-bezier(0.3, 1.4, 0.5, 1); }
.i.show { opacity: 1; transform: none; }

.dh { display: flex; align-items: center; gap: 10px; }
.badge { flex: none; padding: 5px 11px; border-radius: 99px; background: #fff; font-size: 11.5px; font-weight: 600; }
.qb { color: #5b45c9; }
.ib { color: #3b82c4; }
.dt { min-width: 0; flex: 1; }
.dt b { display: block; font-size: 14px; font-weight: 600; letter-spacing: -0.01em; }
.dt small { display: block; color: var(--muted); font-size: 11.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.chip { flex: none; padding: 4px 10px; border-radius: 99px; background: #fff; color: #8a857f; font-size: 11.5px; font-weight: 600; animation: bump 0.5s cubic-bezier(0.3, 1.6, 0.5, 1) both; }
.chip.ok { background: #15803d; color: #fff; }
.chip.unpaid { background: var(--pink); color: #b0245a; }
.chip.partial { background: var(--butter); color: #b45309; }
.chip.paid { background: #15803d; color: #fff; }

.convert { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 11px 16px; border-radius: 99px; background: var(--pink); color: #b0245a; font-size: 13px; font-weight: 600; box-shadow: 0 0 0 4px #fff; opacity: 0.55; transition: transform 0.25s, background 0.3s, opacity 0.4s; }
.q.accepted .convert { opacity: 1; }
.convert.press { transform: scale(0.92); background: #ffc9dc; }

.rows { list-style: none; margin: 0; padding: 12px 14px; border-radius: 16px; background: #fff; display: grid; gap: 7px; }
.rows li { display: flex; justify-content: space-between; gap: 10px; font-size: 12.5px; color: var(--muted); }
.rows b { font-weight: 600; color: var(--ink); white-space: nowrap; }
.rows .tot { margin-top: 3px; padding-top: 9px; border-top: 1px solid #e7eef6; font-size: 14px; font-weight: 600; color: var(--ink); }

.pay { display: grid; gap: 7px; }
.bar { height: 8px; border-radius: 99px; background: #fff; overflow: hidden; }
.bar i { display: block; height: 100%; border-radius: 99px; background: #3b82c4; transition: width 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.4s; }
.i:has(.chip.paid) .bar i { background: #15803d; }
.pl { display: flex; justify-content: space-between; gap: 10px; font-size: 11.5px; font-weight: 500; color: #4f6a85; }

.toast { position: absolute; left: 50%; top: 0; display: inline-flex; align-items: center; gap: 7px; padding: 9px 15px; border-radius: 99px; background: #fff; color: #15803d; font-size: 12px; font-weight: 600; white-space: nowrap; box-shadow: 0 12px 26px -10px rgba(21, 128, 61, 0.5); opacity: 0; transform: translate(-50%, 10px) scale(0.94); transition: opacity 0.35s, transform 0.45s cubic-bezier(0.3, 1.5, 0.5, 1); pointer-events: none; }
.toast.show { opacity: 1; transform: translate(-50%, 0) scale(1); }

/* ---------- entrance ---------- */
.inv:not(.in) .wrap { opacity: 0; }
.inv.in .copy { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.inv.in .photo { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.15s backwards; }
.inv.in .q { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.3s backwards; }

@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes bump { from { transform: scale(1.18); opacity: 0.4; } to { transform: none; opacity: 1; } }

/* ---------- responsive ---------- */
@media (max-width: 960px) {
  .wrap { grid-template-columns: minmax(0, 1fr); gap: 52px; max-width: 640px; }
  .visual { min-height: 540px; }
}
@media (max-width: 640px) {
  .inv { padding: 72px 0; }
  .wrap { width: calc(100% - 32px); }
  .lead { font-size: 15.5px; }
  .feats li { font-size: 14.5px; }
  .visual { min-height: 500px; }
  .photo { inset: 0 0 0 6%; border-radius: 26px; }
  .card { padding: 14px; border-radius: 22px; }
  .q { top: 24px; width: 64%; }
  .i { right: 0; bottom: 20px; width: 88%; }
  .dt small { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .inv *, .inv *::before, .inv *::after { animation: none !important; transition: none !important; }
  .inv:not(.in) .wrap { opacity: 1; }
}
</style>

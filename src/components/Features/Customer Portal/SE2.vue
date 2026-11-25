<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "PortalPaymentsSection" });

const root = ref(null);
const shown = ref(false);
const still = ref(false);
const n = ref(0);
const manual = ref(-1);
let timer = null;
let io = null;

const items = [
  "View every quotation and accept it with a digital signature",
  "Download invoices as PDFs and see payment status",
  "Pay online through",
  "Set up automatic recurring payments with a saved card for subscriptions, retainers and AMC contracts",
  "View upcoming recurring charges and update the card on file",
  "Download receipts and filter by date, status or amount",
];
const titles = ["Quotation", "Invoices", "Pay online", "Auto-pay", "Upcoming charges", "Receipts"];

const idx = computed(() => (manual.value >= 0 ? manual.value : Math.floor(n.value / 5) % 6));
const sub = computed(() => (still.value ? 4 : n.value % 5));
const method = computed(() => (still.value ? 0 : Math.min(Math.max(sub.value - 1, 0), 2)));
const methods = [
  { name: "PayHere", key: "payhere" },
  { name: "Stripe", key: "stripe" },
  { name: "PayPal", key: "paypal" },
];

const invoices = [
  { id: "INV-2041", a: "LKR 120,000", s: "Paid", c: "mint" },
  { id: "INV-2056", a: "LKR 45,000", s: "Due", c: "butter" },
  { id: "INV-2063", a: "LKR 86,500", s: "Overdue", c: "rose" },
];
const upcoming = [
  { n: "AMC contract", d: "1 Dec", a: "LKR 45,000" },
  { n: "Support retainer", d: "5 Dec", a: "LKR 30,000" },
  { n: "Software subscription", d: "12 Dec", a: "LKR 18,000" },
];
const receipts = [
  { id: "RC-884", d: "12 Nov", a: "LKR 120,000", s: "Paid" },
  { id: "RC-871", d: "02 Nov", a: "LKR 45,000", s: "Paid" },
  { id: "RC-860", d: "18 Oct", a: "LKR 30,000", s: "Paid" },
];

function tick() {
  n.value += 1;
}
function start() {
  if (timer || still.value) return;
  timer = setInterval(tick, 800);
}
function stop() {
  clearInterval(timer);
  timer = null;
}
function pick(i) {
  manual.value = i;
  n.value = 0;
}

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    still.value = true;
    shown.value = true;
    return;
  }
  io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        shown.value = true;
        start();
      } else stop();
    },
    { threshold: 0.2 }
  );
  io.observe(root.value);
});
onBeforeUnmount(() => {
  stop();
  if (io) io.disconnect();
});
</script>

<template>
  <section ref="root" class="pp" :class="{ in: shown }">
    <div class="wrap">
      <div class="left">
        <h2><span class="l1">Quotations, invoices</span> <span class="l2">and online payment</span></h2>
        <ol class="list">
          <li v-for="(t, i) in items" :key="i" :class="{ on: i === idx }">
            <button type="button" :aria-current="i === idx" @click="pick(i)">
              <span class="no">{{ i + 1 }}</span>
              <span class="tx">{{ t }}<span v-if="i === 2" class="provider-logos" aria-label="PayHere, Stripe and PayPal">
                <span v-for="provider in methods" :key="provider.key" class="provider-logo" :class="provider.key" role="img" :aria-label="provider.name">{{ provider.name }}</span>
              </span></span>
            </button>
          </li>
        </ol>
      </div>

      <div class="right">
        <div class="portal">
          <div class="bar">
            <span class="dots"><i></i><i></i><i></i></span>
            <span class="url">portal.yourcompany.com / {{ titles[idx] }}</span>
          </div>

          <div class="view" :key="idx">
            <!-- 0 quotation -->
            <div v-if="idx === 0" class="v">
              <div class="vh"><b>Quotation QT-1042</b><span :class="['pill', sub >= 3 ? 'mint' : 'butter']">{{ sub >= 3 ? "Accepted" : "Awaiting signature" }}</span></div>
              <div class="tbl">
                <div class="r"><span>AC servicing, 12 units</span><em>LKR 96,000</em></div>
                <div class="r"><span>Annual maintenance plan</span><em>LKR 54,000</em></div>
                <div class="r t"><span>Total</span><em>LKR 150,000</em></div>
              </div>
              <div class="sig">
                <small>Digital signature</small>
                <svg viewBox="0 0 220 56" class="sg" :class="{ draw: sub >= 1 || still }" aria-hidden="true"><path d="M8 38 C20 6 34 6 30 30 C28 46 44 14 56 22 C66 30 54 44 70 36 C86 28 90 22 100 30 C110 38 120 18 140 24 C156 30 170 34 210 20" pathLength="1" /></svg>
              </div>
              <div class="btn" :class="{ ok: sub >= 3 }">{{ sub >= 3 ? "Signed and accepted" : "Accept quotation" }}</div>
            </div>

            <!-- 1 invoices -->
            <div v-else-if="idx === 1" class="v">
              <div class="vh"><b>Your invoices</b><span class="pill sky">3 invoices</span></div>
              <div class="tbl">
                <div v-for="(r, i) in invoices" :key="r.id" class="r inv" :class="{ vis: sub >= i + 1 }">
                  <span><b>{{ r.id }}</b></span>
                  <em>{{ r.a }}</em>
                  <span :class="['pill', r.c]">{{ r.s }}</span>
                  <span class="pdf">PDF</span>
                </div>
              </div>
            </div>

            <!-- 2 pay online -->
            <div v-else-if="idx === 2" class="v">
              <div class="vh"><b>Pay INV-2056</b><span class="pill butter">LKR 45,000</span></div>
              <div class="meth">
                <span v-for="(provider, i) in methods" :key="provider.key" class="method-option" :class="[{ on: i === method }, provider.key]" :aria-label="provider.name">
                  <span class="provider-logo" :class="provider.key" role="img" :aria-label="provider.name">{{ provider.name }}</span>
                </span>
              </div>
              <div class="btn" :class="{ ok: sub >= 4 }">{{ sub >= 4 ? "Payment received" : "Pay LKR 45,000" }}</div>
            </div>

            <!-- 3 auto-pay -->
            <div v-else-if="idx === 3" class="v">
              <div class="vh"><b>Automatic payments</b><span :class="['pill', sub >= 3 ? 'mint' : 'sky']">{{ sub >= 3 ? "Auto-pay on" : "Saving card" }}</span></div>
              <div class="card"><span class="chip"></span><b>•••• •••• •••• 4242</b><small>Visa · 08/28</small></div>
              <div class="tbl">
                <div class="r"><span>Applies to</span><em>AMC contract</em></div>
                <div class="r"><span>Charge</span><em>LKR 45,000 monthly</em></div>
              </div>
            </div>

            <!-- 4 upcoming -->
            <div v-else-if="idx === 4" class="v">
              <div class="vh"><b>Upcoming charges</b><span class="pill sky">Card •••• 4242</span></div>
              <div class="tbl">
                <div v-for="(r, i) in upcoming" :key="r.n" class="r up" :class="{ vis: sub >= i + 1 }">
                  <span><b>{{ r.n }}</b><small>{{ r.d }}</small></span><em>{{ r.a }}</em>
                </div>
              </div>
              <div class="btn ghost" :class="{ ok: sub >= 4 }">{{ sub >= 4 ? "Card updated" : "Update card on file" }}</div>
            </div>

            <!-- 5 receipts -->
            <div v-else class="v">
              <div class="vh"><b>Receipts</b></div>
              <div class="fl"><span :class="{ on: sub >= 1 }">Date</span><span :class="{ on: sub >= 2 }">Status</span><span :class="{ on: sub >= 3 }">Amount</span></div>
              <div class="tbl">
                <div v-for="(r, i) in receipts" :key="r.id" class="r inv" :class="{ vis: sub >= i + 1 }">
                  <span><b>{{ r.id }}</b></span><small>{{ r.d }}</small><em>{{ r.a }}</em><span class="pdf">PDF</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pp {
  --ink: #14120f; --muted: #666b73; --line: rgba(20, 18, 15, .1);
  --lav: #eeeafd; --lav-i: #6a59d6;
  --sky: #e4f0fb; --sky-i: #3a7fbd;
  --mint: #dff3e8; --mint-i: #2c7a56;
  --butter: #fff4d2; --butter-i: #94700a;
  --rose: #fde7ed; --rose-i: #c94b73;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.pp *, .pp *::before, .pp *::after { box-sizing: border-box; }
.wrap { max-width: 1160px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, .95fr) minmax(0, 1.05fr); gap: 56px; align-items: center; }
.left, .right { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .left, .in .right { opacity: 1; transform: none; }
.in .right { transition-delay: .1s; }

h2 { margin: 0 0 32px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.pp h2 .l1 { color: #111111 !important; opacity: 1; }
.pp h2 .l2 { color: #8a8f97 !important; opacity: 1; }

.provider-logos { display: flex; flex-wrap: wrap; align-items: center; gap: 7px; margin-top: 9px; }
.provider-logo { display: inline-flex; align-items: center; justify-content: center; min-height: 27px; padding: 4px 9px; border: 1px solid #e5e7eb; border-radius: 7px; background: #fff; font-size: 12px; font-weight: 700; line-height: 1; white-space: nowrap; }
.provider-logo.payhere { color: #25364a; letter-spacing: -.04em; }
.provider-logo.stripe { color: #635bff; letter-spacing: -.04em; }
.provider-logo.paypal { color: #003087; font-style: italic; letter-spacing: -.05em; }
.method-option { display: flex; align-items: center; justify-content: center; min-height: 66px; padding: 10px 6px; border: 1.5px solid var(--line); border-radius: 14px; background: #fff; transition: all .3s; }
.method-option.on { border-color: var(--ink); background: #fafafb; box-shadow: 0 0 0 2px rgba(20, 18, 15, .06); }
.method-option .provider-logo { border: 0; padding: 0; font-size: 14px; }
.method-option.payhere .provider-logo { color: #25364a; }
.method-option.stripe .provider-logo { color: #635bff; }
.method-option.paypal .provider-logo { color: #003087; }

.list { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--line); }
.list li { border-bottom: 1px solid var(--line); position: relative; }
.list li::before { content: ""; position: absolute; left: 0; top: -1px; height: 2px; width: 0; background: var(--ink); transition: width .45s ease; }
.list li.on::before { width: 100%; }
.list button { all: unset; box-sizing: border-box; cursor: pointer; display: flex; gap: 16px; align-items: flex-start; width: 100%; padding: 16px 4px; }
.list button:focus-visible { outline: 2px solid var(--ink); outline-offset: -2px; }
.no { width: 26px; height: 26px; border-radius: 50%; background: #f1f2f4; color: var(--muted); display: grid; place-items: center; font-size: 12px; font-weight: 600; flex: none; transition: all .3s; }
.tx { font-size: 15px; line-height: 1.6; color: var(--muted); transition: color .3s; padding-top: 1px; }
.list li.on .no { background: var(--ink); color: #fff; }
.list li.on .tx { color: var(--ink); font-weight: 500; }

.portal { background: var(--lav); border-radius: 28px; padding: 14px; }
.bar { display: flex; align-items: center; gap: 12px; padding: 4px 6px 12px; }
.dots { display: flex; gap: 5px; }
.dots i { width: 8px; height: 8px; border-radius: 50%; background: rgba(20, 18, 15, .18); }
.url { flex: 1; background: rgba(255, 255, 255, .75); border-radius: 99px; padding: 5px 14px; font-size: 11.5px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.view { background: #fff; border-radius: 20px; padding: 20px; min-height: 380px; animation: vin .45s ease both; }
@keyframes vin { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.v { display: flex; flex-direction: column; gap: 14px; }
.vh { display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; }
.vh b { font-size: 15px; font-weight: 600; }
.pill { font-size: 11.5px; font-weight: 600; padding: 3px 11px; border-radius: 99px; transition: all .3s; white-space: nowrap; }
.pill.mint { background: var(--mint); color: var(--mint-i); }
.pill.butter { background: var(--butter); color: var(--butter-i); }
.pill.rose { background: var(--rose); color: var(--rose-i); }
.pill.sky { background: var(--sky); color: var(--sky-i); }

.tbl { border: 1px solid var(--line); border-radius: 16px; overflow: hidden; }
.r { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid var(--line); font-size: 13.5px; }
.r:last-child { border-bottom: 0; }
.r em { font-style: normal; font-weight: 600; }
.r.t { background: #f7f7f9; font-weight: 600; }
.r span { color: var(--muted); }
.r span b { color: var(--ink); font-weight: 500; display: block; }
.r small { color: var(--muted); font-size: 12px; }
.r.inv, .r.up { opacity: .25; transform: translateX(-6px); transition: all .4s ease; }
.r.inv.vis, .r.up.vis { opacity: 1; transform: none; }
.r.inv span:first-child { flex: 1; }
.pdf { font-size: 11px; font-weight: 600; border: 1px solid var(--line); border-radius: 6px; padding: 2px 8px; color: var(--ink) !important; }

.sig { border: 1px dashed rgba(20, 18, 15, .22); border-radius: 14px; padding: 10px 14px 6px; }
.sig small { font-size: 11px; color: var(--muted); letter-spacing: .04em; text-transform: uppercase; font-weight: 600; }
.sg { width: 100%; height: 56px; display: block; }
.sg path { fill: none; stroke: var(--ink); stroke-width: 2; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 1; }
.sg.draw path { animation: dr 1.4s ease forwards; }
@keyframes dr { to { stroke-dashoffset: 0; } }

.btn { text-align: center; font-size: 14px; font-weight: 500; padding: 12px; border-radius: 12px; background: var(--ink); color: #fff; transition: all .35s; }
.btn.ghost { background: #fff; color: var(--ink); border: 1px solid var(--ink); }
.btn.ok { background: var(--mint); color: var(--mint-i); border-color: transparent; }

.meth { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }

.card { background: var(--ink); color: #fff; border-radius: 16px; padding: 18px; display: flex; flex-direction: column; gap: 10px; }
.chip { width: 32px; height: 22px; border-radius: 5px; background: #d8b13a; }
.card b { font-size: 16px; font-weight: 500; letter-spacing: .08em; }
.card small { font-size: 12px; color: rgba(255, 255, 255, .6); }

.fl { display: flex; gap: 6px; }
.fl span { font-size: 12px; font-weight: 500; padding: 5px 14px; border-radius: 99px; border: 1px solid var(--line); color: var(--muted); transition: all .3s; }
.fl span.on { background: var(--ink); color: #fff; border-color: var(--ink); }

@media (max-width: 900px) {
  .wrap { grid-template-columns: 1fr; gap: 36px; }
}
@media (max-width: 640px) {
  .pp { padding: 64px 16px; }
  .portal { padding: 10px; border-radius: 22px; }
  .view { padding: 14px; min-height: 340px; }
  .meth span { padding: 18px 4px; font-size: 12.5px; }
}
@media (prefers-reduced-motion: reduce) {
  .left, .right { opacity: 1; transform: none; transition: none; }
  .view { animation: none; }
  .sg path { stroke-dashoffset: 0; animation: none; }
  * { transition-duration: 0s !important; }
}
</style>

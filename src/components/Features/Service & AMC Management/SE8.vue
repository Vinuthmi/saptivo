<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "ChargeableBillingSection" });

const root = ref(null);
const shown = ref(false);
const n = ref(0);
const photoOk = ref(true);
let timer = null;
let io = null;
let reduce = false;

const photo = "/saptivo/images/features/frustrated-man-on-phone-at-desk-with-laptop-2026-10-27-20-05-16-utc.webp";

const jobs = [
  { id: "JC-0905", what: "Six-monthly service", who: "Hasitha Traders", res: "amc", note: "Covered by AMC-112", at: 1 },
  { id: "JC-0908", what: "Compressor failure", who: "Dilani Perera", res: "war", note: "Under warranty until 14 Dec 2026", at: 2 },
  { id: "JC-0912", what: "Gas top-up and filter", who: "Sewwandi K.", res: "chg", note: "No contract, no warranty", at: 3 },
];
const label = { amc: "Covered by AMC", war: "Under warranty", chg: "Chargeable" };

const lines = [
  { t: "Labour", v: "3,500", at: 4 },
  { t: "Visit", v: "1,500", at: 5 },
  { t: "Parts · R32 gas, filter", v: "8,200", at: 6 },
];
const leak = [
  { id: "JC-0897", who: "Malini J.", amt: "14,800", age: "6 days" },
  { id: "JC-0901", who: "Kasun S.", amt: "12,600", age: "3 days" },
];

const step = computed(() => (reduce ? 10 : n.value % 13));
const paid = computed(() => step.value >= 9 && step.value < 13);
const invoiced = computed(() => step.value >= 7);

function tick() {
  n.value += 1;
}
function start() {
  if (timer || reduce) return;
  timer = setInterval(tick, 1300);
}
function stop() {
  clearInterval(timer);
  timer = null;
}
function replay() {
  stop();
  n.value = Math.floor(n.value / 13) * 13 + 13;
  start();
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    n.value = 10;
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
  <section ref="root" class="cb" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Billing that knows</span> <span class="l2">what's chargeable</span></h2>
        <p>
          Saptivo determines automatically whether a job is covered by an AMC, under warranty or chargeable, and only
          bills what should be billed. Service invoices are generated from completed job cards with labour, visit and
          parts lines; AMC invoices follow the contract's billing cycle and can be charged automatically to the
          customer's card as recurring payments; and technicians can collect payment on site. A revenue leakage report
          lists completed jobs not yet invoiced.
        </p>
      </header>

      <div class="board" role="img" aria-label="Completed jobs sorted into AMC covered, under warranty and chargeable, an invoice built from job card lines, payment collected on site, an AMC card payment and a revenue leakage report">
        <!-- photo -->
        <div class="ph">
          <div class="bg"></div>
          <img v-if="photoOk" :src="photo" alt="" @error="photoOk = false" />
          <div class="shade"></div>

          <div class="pay" :class="{ paid }">
            <div class="pt">
              <small>{{ paid ? "Payment received" : "Collect payment on site" }}</small>
              <b>LKR 13,200</b>
            </div>
            <div class="pm">
              <span>JC-0912 · Sewwandi K.</span>
              <strong>{{ paid ? "Paid by card · receipt sent" : "Awaiting card" }}</strong>
            </div>
          </div>
        </div>

        <!-- decision + panels -->
        <div class="main">
          <div class="dec">
            <div class="dh">
              <strong>Completed jobs</strong>
              <button type="button" class="replay" @click="replay">Replay</button>
            </div>

            <ul class="jl">
              <li v-for="j in jobs" :key="j.id" :class="[step >= j.at ? 'r-' + j.res : 'r-wait']">
                <span class="mk"></span>
                <div class="jt"><b>{{ j.what }}</b><small>{{ j.id }} · {{ j.who }}</small></div>
                <div class="jr">
                  <strong>{{ step >= j.at ? label[j.res] : "Checking…" }}</strong>
                  <small>{{ step >= j.at ? j.note : "Contract and warranty" }}</small>
                </div>
              </li>
            </ul>

            <div class="inv" :class="{ on: step >= 4 }">
              <div class="ih"><strong>Invoice for JC-0912</strong><span>{{ invoiced ? "Generated from the job card" : "Building…" }}</span></div>
              <ul>
                <li v-for="l in lines" :key="l.t" :class="{ on: step >= l.at }"><span>{{ l.t }}</span><b>{{ l.v }}</b></li>
              </ul>
              <div class="tt" :class="{ on: invoiced }"><span>Total</span><b>LKR 13,200</b></div>
            </div>
          </div>

          <div class="two">
            <div class="amc">
              <small>AMC invoices</small>
              <strong>AMC-112 · quarterly</strong>
              <p>Follows the contract billing cycle and is charged automatically to the customer's card.</p>
              <dl>
                <div><dt>Next charge</dt><dd>1 Dec · LKR 18,500</dd></div>
                <div><dt>Card</dt><dd>Visa •••• 4821</dd></div>
              </dl>
            </div>

            <div class="lk">
              <small>Revenue leakage report</small>
              <strong>Completed, not yet invoiced</strong>
              <ul>
                <li v-for="l in leak" :key="l.id">
                  <span>{{ l.id }} · {{ l.who }}</span>
                  <b>{{ l.amt }}</b>
                  <em>{{ l.age }}</em>
                </li>
              </ul>
              <div class="lt"><span>2 jobs</span><b>LKR 27,400</b></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cb {
  --ink: #14120f; --muted: #6b6f76; --line: #e4e2dc; --paper: #f6f5f1;
  --ok: #2c7a56; --blue: #2a5fa8; --warn: #9a6a00; --bad: #b3261e;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.wrap { max-width: 1160px; margin: 0 auto; }

.head { display: grid; grid-template-columns: 1fr 1.1fr; gap: 40px 64px; align-items: end; margin-bottom: 56px; }
h2 { margin: 0; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; }
h2 span { display: block; }
.cb h2 .l1 { color: #111111 !important; opacity: 1; }
.cb h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 15px; line-height: 1.75; color: var(--muted); }

.head, .board { opacity: 0; transform: translateY(12px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .board { opacity: 1; transform: none; }
.in .board { transition-delay: .08s; }

.board { display: grid; grid-template-columns: 1.4fr .85fr; gap: 28px; align-items: stretch; }

/* photo */
.ph { order: 2; position: relative; border-radius: 16px; overflow: hidden; min-height: 620px; background: #25232b; display: flex; align-items: flex-end; padding: 16px; }
.bg { position: absolute; inset: 0; background: linear-gradient(160deg, #3a3744, #1f1d25); }
.ph img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.shade { position: absolute; inset: 0; background: linear-gradient(0deg, rgba(10, 9, 14, .6), rgba(10, 9, 14, 0) 55%); }

.pay { position: relative; z-index: 1; width: 100%; background: #fff; border-radius: 12px; padding: 16px 18px; display: flex; flex-direction: column; gap: 12px; transition: background .4s; }
.pay .pt small { display: block; font-size: 11.5px; color: var(--muted); font-weight: 500; }
.pay .pt b { font-size: 32px; font-weight: 500; letter-spacing: -.02em; font-variant-numeric: tabular-nums; line-height: 1.1; }
.pm { display: flex; flex-direction: column; gap: 2px; padding-top: 12px; border-top: 1px solid var(--line); font-size: 12px; color: var(--muted); }
.pm strong { font-size: 13.5px; color: var(--warn); font-weight: 600; transition: color .3s; }
.pay.paid .pm strong { color: var(--ok); }

/* main */
.main { display: flex; flex-direction: column; gap: 20px; min-width: 0; }
.dec { border: 1px solid var(--line); border-radius: 16px; padding: 22px 24px; }
.dh { display: flex; justify-content: space-between; align-items: center; padding-bottom: 14px; }
.dh strong { font-size: 16px; font-weight: 600; }
.replay { all: unset; cursor: pointer; font-size: 12px; font-weight: 600; color: var(--muted); padding: 5px 12px; border: 1px solid var(--line); border-radius: 6px; }
.replay:hover { color: var(--ink); }
.replay:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

.jl { list-style: none; margin: 0; padding: 0; }
.jl li { position: relative; display: grid; grid-template-columns: 10px 1fr 1fr; gap: 16px; align-items: center; padding: 16px 0; border-top: 1px solid var(--line); }
.mk { width: 8px; height: 8px; border-radius: 2px; background: #c9c6bd; transition: background .4s; }
.jt b { display: block; font-size: 14px; font-weight: 600; }
.jt small, .jr small { font-size: 12px; color: var(--muted); }
.jr strong { display: block; font-size: 14px; font-weight: 600; color: var(--muted); transition: color .4s; }
.r-amc .mk { background: var(--ok); } .r-amc .jr strong { color: var(--ok); }
.r-war .mk { background: var(--blue); } .r-war .jr strong { color: var(--blue); }
.r-chg .mk { background: var(--ink); } .r-chg .jr strong { color: var(--ink); }

.inv { margin-top: 4px; padding: 16px 18px; border-radius: 10px; background: var(--paper); opacity: .35; transition: opacity .5s; }
.inv.on { opacity: 1; }
.ih { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; margin-bottom: 8px; flex-wrap: wrap; }
.ih strong { font-size: 13.5px; font-weight: 600; }
.ih span { font-size: 11.5px; color: var(--muted); }
.inv ul { list-style: none; margin: 0; padding: 0; }
.inv li { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--line); font-size: 13px; opacity: 0; transform: translateY(4px); transition: all .4s ease; }
.inv li.on { opacity: 1; transform: none; }
.inv li b { font-variant-numeric: tabular-nums; font-weight: 500; }
.tt { display: flex; justify-content: space-between; padding-top: 10px; font-size: 14px; font-weight: 600; opacity: 0; transition: opacity .4s; }
.tt.on { opacity: 1; }
.tt b { font-variant-numeric: tabular-nums; }

.two { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.amc, .lk { border: 1px solid var(--line); border-radius: 16px; padding: 20px 22px; display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.amc small, .lk small { font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
.amc strong, .lk strong { font-size: 15px; font-weight: 600; }
.amc p { margin: 2px 0 8px; font-size: 12.5px; line-height: 1.6; color: var(--muted); }
.amc dl { margin: auto 0 0; }
.amc dl div { display: flex; justify-content: space-between; gap: 10px; padding: 8px 0; border-top: 1px solid var(--line); font-size: 12.5px; }
.amc dt { color: var(--muted); }
.amc dd { margin: 0; font-weight: 600; font-variant-numeric: tabular-nums; }

.lk { border-color: #ecc9c5; background: #fffafa; }
.lk small { color: var(--bad); }
.lk ul { list-style: none; margin: 8px 0 0; padding: 0; }
.lk li { display: grid; grid-template-columns: 1fr auto; grid-template-areas: "a b" "c b"; gap: 0 10px; padding: 9px 0; border-top: 1px solid #f1dcd9; font-size: 12.5px; }
.lk li span { grid-area: a; }
.lk li b { grid-area: b; align-self: center; font-variant-numeric: tabular-nums; color: var(--bad); }
.lk li em { grid-area: c; font-style: normal; font-size: 11px; color: var(--muted); }
.lt { display: flex; justify-content: space-between; margin-top: auto; padding-top: 10px; border-top: 1px solid #ecc9c5; font-size: 13px; font-weight: 600; }
.lt b { color: var(--bad); font-variant-numeric: tabular-nums; }

@media (max-width: 960px) {
  .head { grid-template-columns: 1fr; gap: 20px; }
  .board { grid-template-columns: 1fr; }
  .ph { order: 0; min-height: 380px; }
}
@media (max-width: 640px) {
  .cb { padding: 64px 16px; }
  .two { grid-template-columns: 1fr; }
  .dec { padding: 18px; }
  .jl li { grid-template-columns: 10px 1fr; }
  .jr { grid-column: 2; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .board { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>

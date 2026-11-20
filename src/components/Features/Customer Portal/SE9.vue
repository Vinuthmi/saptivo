<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "WhoUsesPortalSection" });

const root = ref(null);
const shown = ref(false);
const ok = ref(true);
// the side image of this section, swap the path if you like
const photo = "/saptivo/images/features/threecolleagues-.jpg";
const idx = ref(0);
const open = ref(0);
let timer = null;
let io = null;
let reduce = false;
let touched = false;

const who = [
  { n: "Service companies", d: "Reports and visit history", on: [0, 1], c: "lav" },
  { n: "Contractors", d: "Project progress", on: [2], c: "sky" },
  { n: "Distributors", d: "Invoices and statements for dealers", on: [3, 4], c: "mint" },
  { n: "Software companies", d: "Support tickets", on: [5], c: "butter" },
];
const mods = ["Reports", "Visit history", "Project progress", "Invoices", "Statements", "Support tickets"];

const faqs = [
  { q: "Can the portal use my own domain?", a: "Yes. Map a subdomain such as portal.yourcompany.com." },
  { q: "Can customers set up automatic payments?", a: "Yes. Customers can authorise recurring card payments for subscriptions, retainers or AMC contracts through a supported payment gateway." },
  { q: "Can customers pay invoices online?", a: "Yes, through PayHere, Stripe or PayPal integration." },
];
const links = ["Help Desk", "Quotations & Invoicing", "Contractors & Services"];

const cur = computed(() => who[idx.value]);

function start() {
  if (timer || reduce || touched) return;
  timer = setInterval(() => {
    idx.value = (idx.value + 1) % who.length;
  }, 2600);
}
function stop() {
  clearInterval(timer);
  timer = null;
}
function pick(i) {
  touched = true;
  stop();
  idx.value = i;
}
function toggle(i) {
  open.value = open.value === i ? -1 : i;
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
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
  <section ref="root" class="wu" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Who uses the</span> <span class="l2">customer portal</span></h2>
        <p>
          Service companies sharing reports and visit history, contractors showing project progress, distributors giving
          dealers access to invoices and statements, and software companies handling support tickets. Each switches on
          only the portal modules their customers need.
        </p>
      </header>

      <div class="board">
        <div class="left">
          <span class="lb">Who uses it</span>
          <ul class="who" role="tablist">
            <li v-for="(w, i) in who" :key="w.n">
              <button type="button" role="tab" :aria-selected="i === idx" :class="[w.c, { on: i === idx }]" @click="pick(i)">
                <span class="dot"></span>
                <span class="tx"><b>{{ w.n }}</b><small>{{ w.d }}</small></span>
              </button>
            </li>
          </ul>
        </div>

        <div class="right">
          <div class="bar">
            <span class="dots"><i></i><i></i><i></i></span>
            <span class="url">portal.yourcompany.com</span>
          </div>
          <span class="lb">Portal modules for {{ cur.n.toLowerCase() }}</span>
          <ul class="mods">
            <li v-for="(m, i) in mods" :key="m" :class="[{ on: cur.on.includes(i) }, cur.c]">
              <span>{{ m }}</span>
              <span class="sw"><i></i></span>
            </li>
          </ul>
        </div>
      </div>

      <div class="qa">
        <div class="faq">
          <div v-for="(f, i) in faqs" :key="f.q" class="item" :class="{ open: open === i }">
            <h3>
              <button type="button" :aria-expanded="open === i" @click="toggle(i)">
                <span>{{ f.q }}</span>
                <i class="pl" aria-hidden="true"></i>
              </button>
            </h3>
            <div class="ans"><div><p>{{ f.a }}</p></div></div>
          </div>
        </div>
        <figure class="ph">
          <img v-if="ok" :src="photo" alt="" @error="ok = false" />
          <a href="/demo/" class="cta">See the customer portal in a demo</a>
        </figure>
      </div>

      <div class="foot">
        <nav class="links" aria-label="Related">
          <a v-for="l in links" :key="l" href="#">{{ l }}</a>
        </nav>
      </div>
    </div>
  </section>
</template>

<style scoped>
.wu {
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
.wu *, .wu *::before, .wu *::after { box-sizing: border-box; }
.wrap { max-width: 1040px; margin: 0 auto; }
.head { text-align: center; max-width: 820px; margin: 0 auto 48px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.wu h2 .l1 { color: #111111 !important; opacity: 1; }
.wu h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.75; color: var(--muted); }
.head, .board, .foot { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .board, .in .foot { opacity: 1; transform: none; }
.in .board { transition-delay: .08s; }
.in .foot { transition-delay: .2s; }

.lb { font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
.board { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); gap: 16px; padding: 16px; border-radius: 32px; background: #faf9ff; border: 1.5px solid #ece9f3; }
.left, .right { background: #fff; border-radius: 24px; padding: 22px; min-width: 0; display: flex; flex-direction: column; gap: 14px; }

.who { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.who button { all: unset; box-sizing: border-box; width: 100%; cursor: pointer; display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 18px; border: 1.5px solid var(--line); transition: all .3s; }
.who button:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.dot { width: 10px; height: 10px; border-radius: 50%; background: #c9ccd2; flex: none; transition: background .3s; }
.tx { display: flex; flex-direction: column; min-width: 0; }
.tx b { font-size: 14.5px; font-weight: 500; }
.tx small { font-size: 12.5px; color: var(--muted); }
.who button.lav.on { background: var(--lav); border-color: transparent; } .who button.lav.on .dot { background: var(--lav-i); }
.who button.sky.on { background: var(--sky); border-color: transparent; } .who button.sky.on .dot { background: var(--sky-i); }
.who button.mint.on { background: var(--mint); border-color: transparent; } .who button.mint.on .dot { background: var(--mint-i); }
.who button.butter.on { background: var(--butter); border-color: transparent; } .who button.butter.on .dot { background: #d8b13a; }

.bar { display: flex; align-items: center; gap: 12px; }
.dots { display: flex; gap: 5px; }
.dots i { width: 8px; height: 8px; border-radius: 50%; background: rgba(20, 18, 15, .15); }
.url { flex: 1; background: #f4f4f6; border-radius: 99px; padding: 5px 14px; font-size: 11.5px; color: var(--muted); }
.mods { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.mods li { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 12px 16px; border-radius: 14px; border: 1px solid var(--line); font-size: 13.5px; color: #a1a5ad; transition: all .4s; }
.sw { width: 36px; height: 20px; border-radius: 10px; background: #d9dce0; position: relative; flex: none; transition: background .3s; }
.sw i { position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: transform .3s; }
.mods li.on { color: var(--ink); font-weight: 500; border-color: transparent; }
.mods li.on .sw { background: var(--ink); }
.mods li.on .sw i { transform: translateX(16px); }
.mods li.on.lav { background: var(--lav); } .mods li.on.sky { background: var(--sky); } .mods li.on.mint { background: var(--mint); } .mods li.on.butter { background: var(--butter); }

.qa { margin: 56px auto 0; display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, .9fr); gap: 40px; align-items: stretch; opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .qa { opacity: 1; transform: none; transition-delay: .14s; }
.ph { position: relative; margin: 0; border-radius: 28px; overflow: hidden; min-height: 380px; background: linear-gradient(160deg, #e4ddfb, #d6e8f8); }
.ph img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.faq { border-top: 1px solid var(--line); align-self: start; opacity: 1 !important; transform: none !important; }
.item { border-bottom: 1px solid var(--line); }
.item h3 { margin: 0; }
.item button { all: unset; box-sizing: border-box; width: 100%; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 20px 4px; font-size: 16.5px; font-weight: 500; line-height: 1.45; }
.item button:focus-visible { outline: 2px solid var(--ink); outline-offset: -2px; }
.pl { position: relative; width: 14px; height: 14px; flex: none; }
.pl::before, .pl::after { content: ""; position: absolute; left: 0; right: 0; top: 6px; height: 2px; border-radius: 2px; background: var(--ink); transition: transform .3s; }
.pl::after { transform: rotate(90deg); }
.item.open .pl::after { transform: rotate(0); }
.ans { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .35s ease; }
.item.open .ans { grid-template-rows: 1fr; }
.ans > div { overflow: hidden; }
.ans p { margin: 0; padding: 0 4px 20px; font-size: 15px; line-height: 1.75; color: var(--muted); max-width: 66ch; }

.foot { margin: 36px 0 0; display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
.links { display: flex; flex-wrap: wrap; gap: 8px; }
.links a { font-size: 13px; font-weight: 500; color: var(--ink); text-decoration: none; padding: 8px 16px; border-radius: 99px; border: 1px solid var(--line); transition: all .25s; }
.links a:hover { background: var(--ink); color: #fff; border-color: var(--ink); }
.ph .cta { position: absolute; left: 20px; right: 20px; bottom: 20px; display: flex; justify-content: center; font-size: 14px; font-weight: 600; color: var(--ink); background: #fff; text-align: center; text-decoration: none; padding: 14px 20px; border-radius: 12px; box-shadow: 0 8px 24px rgba(20, 18, 15, .2); transition: transform .25s, background .25s; }
.ph .cta:hover { transform: translateY(-2px); background: #f4f4f6; }
.links a:focus-visible, .cta:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }

@media (max-width: 820px) {
  .board { grid-template-columns: 1fr; }
  .qa { grid-template-columns: 1fr; gap: 28px; }
  .ph { min-height: 300px; order: -1; }
}
@media (max-width: 640px) {
  .wu { padding: 64px 16px; }
  .board { padding: 10px; border-radius: 24px; }
  .left, .right { padding: 16px; border-radius: 20px; }
  .item button { font-size: 15.5px; }
  .foot { flex-direction: column; align-items: flex-start; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .board, .qa, .foot { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>

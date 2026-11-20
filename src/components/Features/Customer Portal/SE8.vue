<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "AccountSelfServiceSection" });

const root = ref(null);
const shown = ref(false);
const still = ref(false);
const n = ref(0);
let timer = null;
let io = null;

const team = [
  { n: "Dilani Perera", r: "You · Admin", c: "lav" },
  { n: "Kasun Jay", r: "Finance", c: "sky" },
  { n: "Ayesha Raheem", r: "Site contact", c: "mint" },
];

const sub = computed(() => (still.value ? 11 : n.value % 12));
const stage = computed(() => Math.min(Math.floor(sub.value / 2), 5));
const done = (i) => sub.value >= i * 2 + 1;
const act = (i) => stage.value === i && !still.value;

function tick() {
  n.value += 1;
}
function start() {
  if (timer || still.value) return;
  timer = setInterval(tick, 900);
}
function stop() {
  clearInterval(timer);
  timer = null;
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
  <section ref="root" class="ac" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Account</span> <span class="l2">self-service</span></h2>
        <p>
          Customers view and update their own profile, company details and communication preferences, see other team
          members under the same account, and can request account deactivation in line with data-privacy rights.
        </p>
      </header>

      <div class="grid">
        <!-- profile -->
        <article class="card lav" :class="{ act: act(0) }">
          <div class="ct"><span class="lb">My profile</span><em :class="{ vis: done(0) }">Saved</em></div>
          <div class="who"><span class="av">D</span><div><b>Dilani Perera</b><small>dilani@example.com</small></div></div>
          <div class="fd"><small>Mobile</small><div class="v">{{ done(0) ? "077 765 4321" : "077 123 4567" }}</div></div>
        </article>

        <!-- company -->
        <article class="card sky" :class="{ act: act(1) }">
          <div class="ct"><span class="lb">Company details</span><em :class="{ vis: done(1) }">Saved</em></div>
          <div class="fd"><small>Company</small><div class="v">Colombo Hotels (Pvt) Ltd</div></div>
          <div class="fd"><small>Billing address</small><div class="v">{{ done(1) ? "No. 12, Galle Road, Colombo 05" : "No. 12, Galle Road, Colombo 03" }}</div></div>
        </article>

        <!-- preferences -->
        <article class="card butter" :class="{ act: act(2) }">
          <div class="ct"><span class="lb">Communication preferences</span><em :class="{ vis: done(2) }">Saved</em></div>
          <ul class="pf">
            <li><span>Email updates</span><span class="sw" :class="{ on: !done(2) }"><i></i></span></li>
            <li><span>WhatsApp messages</span><span class="sw" :class="{ on: done(2) }"><i></i></span></li>
            <li><span>Monthly newsletter</span><span class="sw"><i></i></span></li>
          </ul>
        </article>

        <!-- team -->
        <article class="card mint wide" :class="{ act: act(3) }">
          <div class="ct"><span class="lb">Team members on this account</span><small>{{ team.length }} people</small></div>
          <ul class="tm">
            <li v-for="(m, i) in team" :key="m.n" :class="{ vis: sub >= 6 + i || stage < 3 && sub >= 6 }">
              <span class="av" :class="m.c">{{ m.n.charAt(0) }}</span>
              <span><b>{{ m.n }}</b><small>{{ m.r }}</small></span>
            </li>
          </ul>
        </article>

        <!-- privacy -->
        <article class="card rose" :class="{ act: act(4) || act(5) }">
          <div class="ct"><span class="lb">Data privacy</span></div>
          <p class="pv">You can ask us to deactivate your account at any time.</p>
          <div class="btn" :class="{ ok: sub >= 10 }">{{ sub >= 10 ? "Request sent" : "Request account deactivation" }}</div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ac {
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
.ac *, .ac *::before, .ac *::after { box-sizing: border-box; }
.wrap { max-width: 1160px; margin: 0 auto; }
.head { text-align: center; max-width: 780px; margin: 0 auto 48px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.ac h2 .l1 { color: #111111 !important; opacity: 1; }
.ac h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.75; color: var(--muted); }
.head, .grid { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .grid { opacity: 1; transform: none; }
.in .grid { transition-delay: .1s; }

.grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.card { border-radius: 28px; padding: 22px; display: flex; flex-direction: column; gap: 14px; border: 1.5px solid transparent; transition: border-color .3s; min-width: 0; }
.card.act { border-color: var(--ink); }
.card.lav { background: var(--lav); } .card.sky { background: var(--sky); } .card.butter { background: var(--butter); } .card.mint { background: var(--mint); } .card.rose { background: var(--rose); }
.card.wide { grid-column: span 2; }
.ct { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 22px; }
.ct small { font-size: 12px; color: var(--muted); }
.lb { font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
.ct em { font-style: normal; font-size: 11px; font-weight: 600; padding: 2px 10px; border-radius: 6px; background: #fff; color: var(--mint-i); opacity: 0; transition: opacity .4s; }
.ct em.vis { opacity: 1; }

.who { display: flex; align-items: center; gap: 12px; }
.who div { display: flex; flex-direction: column; min-width: 0; }
.who b { font-size: 14.5px; font-weight: 600; }
.who small { font-size: 12px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; }
.av { width: 38px; height: 38px; border-radius: 50%; background: #fff; color: var(--lav-i); display: grid; place-items: center; font-weight: 700; font-size: 14px; flex: none; }
.av.lav { background: var(--lav); color: var(--lav-i); } .av.sky { background: var(--sky); color: var(--sky-i); } .av.mint { background: #fff; color: var(--mint-i); }
.fd { display: flex; flex-direction: column; gap: 5px; }
.fd small { font-size: 12px; color: var(--muted); font-weight: 500; }
.v { background: #fff; border-radius: 12px; padding: 10px 14px; font-size: 13.5px; transition: all .3s; }

.pf { list-style: none; margin: 0; padding: 4px 16px; background: #fff; border-radius: 16px; }
.pf li { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 11px 0; border-bottom: 1px solid var(--line); font-size: 13.5px; }
.pf li:last-child { border-bottom: 0; }
.sw { width: 36px; height: 20px; border-radius: 10px; background: #d9dce0; position: relative; flex: none; transition: background .3s; }
.sw i { position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: transform .3s; }
.sw.on { background: var(--ink); }
.sw.on i { transform: translateX(16px); }

.tm { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.tm li { display: flex; align-items: center; gap: 12px; background: #fff; border-radius: 16px; padding: 12px 14px; opacity: .25; transform: translateY(6px); transition: all .45s ease; }
.tm li.vis { opacity: 1; transform: none; }
.tm li span:last-child { display: flex; flex-direction: column; min-width: 0; }
.tm b { font-size: 13px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tm small { font-size: 11.5px; color: var(--muted); }

.pv { margin: 0; font-size: 13.5px; line-height: 1.65; color: var(--muted); }
.btn { margin-top: auto; text-align: center; font-size: 13.5px; font-weight: 500; padding: 11px 12px; border-radius: 12px; background: #fff; color: var(--rose-i); border: 1px solid var(--rose-i); transition: all .35s; }
.btn.ok { background: var(--rose-i); color: #fff; }

@media (max-width: 960px) {
  .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .card.wide { grid-column: 1 / -1; }
}
@media (max-width: 640px) {
  .ac { padding: 64px 16px; }
  .grid { grid-template-columns: 1fr; }
  .card { padding: 16px; border-radius: 22px; }
  .tm { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .grid { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>

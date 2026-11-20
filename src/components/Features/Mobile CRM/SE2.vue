<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "BusinessCardScannerSection" });

const root = ref(null);
const shown = ref(false);
const still = ref(false);
const ok = ref(true);
const n = ref(0);
let timer = null;
let io = null;

const base = "/saptivo/images/features/";
// the big full image of this section, swap the path if you like
const photo = base + "young.jpg";

// 9-step loop: 0 idle, 1-3 scanning, 4-7 fields fill in, 8 saved
const p = computed(() => (still.value ? 8 : n.value % 9));
const scanning = computed(() => p.value >= 1 && p.value <= 3);
const found = computed(() => p.value >= 4);
const saved = computed(() => p.value >= 8);

const fields = [
  { k: "Name", v: "Dilani Perera" },
  { k: "Company", v: "Colombo Hotels PLC" },
  { k: "Phone", v: "+94 77 123 4567" },
  { k: "Email", v: "dilani@colombohotels.lk" },
];

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
  <section ref="root" class="bc" :class="{ in: shown }">
    <div class="stage">
      <img v-if="ok" class="bg" :src="photo" alt="" @error="ok = false" />
      <div class="shade"></div>

      <div class="wrap">
        <div class="copy">
          <h2>Business card scanner</h2>
          <p>Photograph a business card and Saptivo reads it with OCR to create the contact, ready to follow up.</p>
        </div>

        <div class="demo" aria-hidden="true">
          <!-- the physical card -->
          <div class="card" :class="{ scan: scanning }">
            <div class="logo">CH</div>
            <b>Dilani Perera</b>
            <small>Procurement Manager</small>
            <div class="co">Colombo Hotels PLC</div>
            <div class="ct">
              <span>+94 77 123 4567</span>
              <span>dilani@colombohotels.lk</span>
            </div>
            <i class="line" :class="{ run: scanning }"></i>
            <i class="c tl"></i><i class="c tr"></i><i class="c bl"></i><i class="c br"></i>
          </div>

          <!-- the created contact -->
          <div class="res" :class="{ vis: found }">
            <div class="rh">
              <span class="av">D</span>
              <span class="rt"><b>New contact</b><small>{{ saved ? "Saved to contacts" : "Reading card…" }}</small></span>
            </div>
            <ul>
              <li v-for="(f, i) in fields" :key="f.k" :class="{ vis: p >= i + 4 }">
                <small>{{ f.k }}</small><b>{{ f.v }}</b>
              </li>
            </ul>
            <div class="btn" :class="{ ok: saved }">{{ saved ? "Contact created" : "Create contact" }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bc {
  --ink: #14120f; --muted: #666b73; --line: rgba(20, 18, 15, .1);
  --lav: #eeeafd; --lav-i: #6a59d6;
  --mint: #dff3e8; --mint-i: #2c7a56;
  --scan: #7ee2b0;
  font-family: "Urbanist", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.bc *, .bc *::before, .bc *::after { box-sizing: border-box; }

/* big full image */
.stage {
  position: relative;
  max-width: 1360px;
  margin: 0 auto;
  min-height: 720px;
  border-radius: 32px;
  overflow: hidden;
  background: linear-gradient(160deg, #2b2547, #17324a);
  display: flex;
  align-items: center;
  opacity: 0;
  transform: translateY(14px);
  transition: opacity .6s ease, transform .6s ease;
}
.in .stage { opacity: 1; transform: none; }
.bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; }
.shade {
  position: absolute; inset: 0;
  background:
    linear-gradient(90deg, rgba(187, 186, 190, 0.82) 0%, rgba(0, 0, 0, 0.55) 42%, rgba(10, 9, 20, .15) 100%);
}

.wrap {
  position: relative;
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: 64px 40px;
  display: grid;
  grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr);
  gap: 48px;
  align-items: center;
}

.copy h2 { margin: 0 0 20px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; color: #fff; }
.copy p { margin: 0; max-width: 420px; font-size: 17px; line-height: 1.7; color: rgba(255, 255, 255, .8); }

/* demo area */
.demo { position: relative; min-height: 400px; }

.card {
  position: absolute; left: 0; top: 40px;
  width: 320px; height: 190px;
  padding: 22px 24px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, .4), 0 8px 20px rgba(0, 0, 0, .25);
  transform: rotate(-6deg);
  display: flex; flex-direction: column;
  transition: box-shadow .4s;
}
.card.scan { box-shadow: 0 0 0 2px var(--scan), 0 30px 60px rgba(0, 0, 0, .4); }
.logo { width: 34px; height: 34px; border-radius: 9px; background: var(--ink); color: #fff; display: grid; place-items: center; font-size: 13px; font-weight: 600; margin-bottom: 14px; }
.card b { font-size: 17px; font-weight: 600; }
.card small { font-size: 12px; color: var(--muted); }
.co { margin-top: 6px; font-size: 12.5px; font-weight: 500; }
.ct { margin-top: auto; display: flex; flex-direction: column; gap: 2px; font-size: 11.5px; color: var(--muted); }

.line { position: absolute; left: 0; right: 0; top: 0; height: 3px; background: var(--scan); box-shadow: 0 0 18px 4px rgba(126, 226, 176, .7); opacity: 0; border-radius: 2px; }
.line.run { animation: sweep 2.7s linear forwards; }
@keyframes sweep {
  0% { top: 0; opacity: 1; }
  100% { top: calc(100% - 3px); opacity: 1; }
}
.c { position: absolute; width: 16px; height: 16px; border: 0 solid var(--ink); opacity: 0; transition: opacity .3s; }
.card.scan .c { opacity: 1; border-color: var(--mint-i); }
.c.tl { left: 8px; top: 8px; border-width: 2px 0 0 2px; border-top-left-radius: 5px; }
.c.tr { right: 8px; top: 8px; border-width: 2px 2px 0 0; border-top-right-radius: 5px; }
.c.bl { left: 8px; bottom: 8px; border-width: 0 0 2px 2px; border-bottom-left-radius: 5px; }
.c.br { right: 8px; bottom: 8px; border-width: 0 2px 2px 0; border-bottom-right-radius: 5px; }

.res {
  position: absolute; right: 0; top: 150px;
  width: 290px;
  padding: 16px;
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, .4);
  display: flex; flex-direction: column; gap: 12px;
  opacity: 0; transform: translateY(24px);
  transition: opacity .5s ease, transform .6s cubic-bezier(.22, 1, .36, 1);
}
.res.vis { opacity: 1; transform: none; }
.rh { display: flex; align-items: center; gap: 10px; }
.av { width: 38px; height: 38px; border-radius: 50%; background: var(--lav); color: var(--lav-i); display: grid; place-items: center; font-size: 16px; font-weight: 600; flex: none; }
.rt { display: flex; flex-direction: column; }
.rt b { font-size: 14px; font-weight: 600; }
.rt small { font-size: 11.5px; color: var(--muted); }
.res ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.res li { display: flex; flex-direction: column; background: #f6f6f8; border-radius: 11px; padding: 8px 12px; opacity: .15; transition: opacity .4s; }
.res li.vis { opacity: 1; }
.res li small { font-size: 11px; color: var(--muted); }
.res li b { font-size: 12.5px; font-weight: 500; overflow-wrap: anywhere; }

.btn { text-align: center; font-size: 13px; font-weight: 500; padding: 10px; border-radius: 11px; background: var(--ink); color: #fff; transition: all .35s; }
.btn.ok { background: var(--mint); color: var(--mint-i); }

@media (max-width: 900px) {
  .stage { min-height: 0; }
  .shade { background: linear-gradient(180deg, rgba(10, 9, 20, .8) 0%, rgba(10, 9, 20, .5) 100%); }
  .wrap { grid-template-columns: 1fr; gap: 32px; padding: 48px 24px; }
  .demo { min-height: 440px; }
}
@media (max-width: 640px) {
  .bc { padding: 64px 16px; }
  .stage { border-radius: 24px; }
  .card { width: 270px; height: 165px; padding: 16px 18px; }
  .logo { margin-bottom: 8px; }
  .res { width: 100%; max-width: 290px; top: 170px; }
}
@media (prefers-reduced-motion: reduce) {
  .stage { opacity: 1; transform: none; transition: none; }
  .line.run { animation: none; opacity: 0; }
  .res { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>

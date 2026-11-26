<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "WeblookSuiteSection" });

const root = ref(null);
const shown = ref(false);
const still = ref(false);
const idx = ref(0);
const n = ref(0);
let timer = null;
let io = null;
let touched = false;

const logos = "/saptivo/images/clients/";
const features = "/saptivo/images/features/";
const products = [
  { k: "cart", n: "Cartinno", d: "E-commerce and POS", c: "lav", logo: logos + "cartinno.webp", bg: features + "Remove_words_and_high_quality_d416cd17.jpg" },
  { k: "vox", n: "Voxinnova", d: "Cloud phone systems built on 3CX", c: "sky", logo: logos + "voxinnova.png", bg: features + "Remove_words_keep_mobile_letters_9242dbf9.jpg" },
  { k: "mail", n: "Smardove", d: "Secure business email", c: "mint", logo: logos + "smardove.png", bg: features + "Remove_words_keep_mobile_letters_7cf84317.jpg" },
  { k: "book", n: "Saptify", d: "Appointment booking", c: "butter", logo: logos + "saptify.png", bg: features + "please_give_back_ground_image_9616f21e.jpg" },
  { k: "bed", n: "SaaSBeds", d: "Hotel reservations", c: "rose", logo: logos + "saasbeds.png", bg: features + "Remove_words_for_background_image_e927841d_2K.jpg" },
];
// the Saptivo logo (dark logo on white)
const hubLogo = encodeURI("/saptivo/images/clients/images.png");
const hubOk = ref(true);
const bad = reactive({}); // products whose logo file did not load

const cur = computed(() => products[idx.value]);
const sub = computed(() => (still.value ? 5 : n.value % 6));

// each product stays on screen for 6 ticks (about 4.8 s)
function tick() {
  n.value += 1;
  if (!touched && n.value % 6 === 0) idx.value = (idx.value + 1) % products.length;
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
  touched = true;
  idx.value = i;
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
  <section ref="root" class="ws" :class="[{ in: shown }, 'tone-' + cur.c]">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Part of the</span> <span class="l2">Weblook Business Suite</span></h2>
        <p>
          Saptivo works alongside Weblook's other products: Cartinno for e-commerce and POS, Voxinnova for cloud phone
          systems built on 3CX, Smardove for secure business email, Saptify for appointment booking and SaaSBeds for
          hotel reservations.
        </p>
      </header>

      <div class="grid">
        <!-- product list -->
        <ul class="list" role="tablist">
          <li v-for="(p, i) in products" :key="p.n">
            <button type="button" role="tab" :aria-selected="i === idx" :class="[p.c, { on: i === idx }]" @click="pick(i)">
              <span class="lg">
                <img v-if="!bad[p.n]" :src="p.logo" :alt="p.n" @error="bad[p.n] = true" />
                <b v-else>{{ p.n.charAt(0) }}</b>
              </span>
              <span class="tx"><b>{{ p.n }}</b><small>{{ p.d }}</small></span>
              <i class="bar"></i>
            </button>
          </li>
        </ul>

        <!-- stage -->
        <div class="stage" :style="{ '--stage-bg': `url('${cur.bg}')` }">
          <div class="mesh" aria-hidden="true"></div>

          <div class="link">
            <div class="node a">
              <img v-if="hubOk" :src="hubLogo" alt="Saptivo" @error="hubOk = false" />
              <b v-else>Saptivo</b>
            </div>

            <div class="wire" aria-hidden="true">
              <i class="dash"></i>
              <i class="packet p1"></i>
              <i class="packet p2"></i>
              <span class="tag">Works alongside</span>
            </div>

            <div class="node b" :key="cur.n">
              <img v-if="!bad[cur.n]" :src="cur.logo" :alt="cur.n" @error="bad[cur.n] = true" />
              <b v-else>{{ cur.n }}</b>
            </div>
          </div>

          <div class="ui" :key="'u' + cur.k">
            <div class="uh"><b>{{ cur.n }}</b><span>{{ cur.d }}</span></div>

            <!-- cart -->
            <div v-if="cur.k === 'cart'" class="body">
              <div class="r" :class="{ v: sub >= 1 }"><span>Item A</span><em>LKR 12,500</em></div>
              <div class="r" :class="{ v: sub >= 2 }"><span>Item B</span><em>LKR 12,000</em></div>
              <div class="r t" :class="{ v: sub >= 3 }"><span>Total</span><em>LKR 24,500</em></div>
              <div class="btn" :class="{ ok: sub >= 4 }">{{ sub >= 4 ? "Payment received" : "Charge at POS" }}</div>
            </div>

            <!-- call -->
            <div v-else-if="cur.k === 'vox'" class="body call">
              <span class="av" :class="{ ring: sub < 2 }">D</span>
              <b>Dilani Perera</b>
              <small>{{ sub < 2 ? "Incoming call…" : sub < 4 ? "Connected · 3CX" : "Call ended" }}</small>
              <span class="chipx" :class="{ v: sub >= 4 }">Call logged</span>
            </div>

            <!-- mail -->
            <div v-else-if="cur.k === 'mail'" class="body">
              <div class="r" :class="{ v: sub >= 0 }"><span>To</span><em>customer@example.com</em></div>
              <div class="r" :class="{ v: sub >= 1 }"><span>Subject</span><em>Your quotation</em></div>
              <div class="msg" :class="{ v: sub >= 2 }"><i></i><i></i><i class="s"></i></div>
              <div class="btn" :class="{ ok: sub >= 4 }">{{ sub >= 4 ? "Sent securely" : "Send" }}</div>
            </div>

            <!-- booking -->
            <div v-else-if="cur.k === 'book'" class="body">
              <div class="slots">
                <span v-for="(s, i) in ['09:00', '10:30', '12:00', '14:30']" :key="s" :class="{ on: sub >= 2 && i === 1 }">{{ s }}</span>
              </div>
              <div class="btn" :class="{ ok: sub >= 3 }">{{ sub >= 3 ? "Appointment booked" : "Choose a time" }}</div>
            </div>

            <!-- hotel -->
            <div v-else class="body">
              <div class="r" :class="{ v: sub >= 0 }"><span>Room</span><em>Deluxe, sea view</em></div>
              <div class="r" :class="{ v: sub >= 1 }"><span>Dates</span><em>2 nights</em></div>
              <div class="r" :class="{ v: sub >= 2 }"><span>Guests</span><em>2 adults</em></div>
              <div class="btn" :class="{ ok: sub >= 4 }">{{ sub >= 4 ? "Reservation confirmed" : "Reserve" }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ws {
  --ink: #14120f; --muted: #666b73; --line: rgba(20, 18, 15, .1);
  --lav: #eeeafd; --lav-i: #6a59d6;
  --sky: #e4f0fb; --sky-i: #3a7fbd;
  --mint: #dff3e8; --mint-i: #2c7a56;
  --butter: #fff4d2; --butter-i: #94700a;
  --rose: #fde7ed; --rose-i: #c94b73;
  --t: var(--lav); --ti: var(--lav-i);
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.ws.tone-lav { --t: var(--lav); --ti: var(--lav-i); }
.ws.tone-sky { --t: var(--sky); --ti: var(--sky-i); }
.ws.tone-mint { --t: var(--mint); --ti: var(--mint-i); }
.ws.tone-butter { --t: var(--butter); --ti: #d8b13a; }
.ws.tone-rose { --t: var(--rose); --ti: var(--rose-i); }
.ws *, .ws *::before, .ws *::after { box-sizing: border-box; }
.wrap { max-width: 1160px; margin: 0 auto; }
.head { text-align: center; max-width: 800px; margin: 0 auto 52px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.ws h2 .l1 { color: #111111 !important; opacity: 1; }
.ws h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.8; color: var(--muted); }
.head, .grid { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .grid { opacity: 1; transform: none; }
.in .grid { transition-delay: .1s; }

.grid { display: grid; grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr); gap: 16px; align-items: stretch; }

/* list */
.list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.list li { flex: 1; display: flex; }
.list button { all: unset; box-sizing: border-box; position: relative; overflow: hidden; width: 100%; cursor: pointer; display: flex; align-items: center; gap: 16px; padding: 16px 20px; border-radius: 22px; border: 1.5px solid var(--line); background: #fff; transition: all .35s ease; }
.list button:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
.list button.on { border-color: var(--ink); background: #fff; transform: translateX(6px); box-shadow: 0 16px 34px -20px rgba(20, 18, 15, .4); }
.lg { flex: none; width: 76px; height: 48px; border-radius: 12px; background: #f6f6f8; display: grid; place-items: center; padding: 6px 10px; overflow: hidden; transition: background .35s; }
.list button.lav.on .lg { background: var(--lav); } .list button.sky.on .lg { background: var(--sky); } .list button.mint.on .lg { background: var(--mint); } .list button.butter.on .lg { background: var(--butter); } .list button.rose.on .lg { background: var(--rose); }
.lg img { max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain; display: block; }
.lg b { font-size: 15px; font-weight: 700; }
.tx { display: flex; flex-direction: column; min-width: 0; gap: 1px; }
.tx b { font-size: 16px; font-weight: 600; letter-spacing: -.01em; }
.tx small { font-size: 12.5px; line-height: 1.5; color: var(--muted); }
.bar { position: absolute; left: 0; bottom: 0; height: 3px; width: 0; background: var(--ink); }
.list button.on .bar { width: 100%; animation: fill 4.8s linear; }
@keyframes fill { from { width: 0; } to { width: 100%; } }

/* stage */
.stage { position: relative; overflow: hidden; border-radius: 32px; padding: 26px; background: var(--t); transition: background .6s ease; display: flex; flex-direction: column; gap: 26px; min-height: 520px; }
.stage::before { content: ""; position: absolute; inset: 0; background: linear-gradient(var(--t), var(--t)), var(--stage-bg) center / cover no-repeat; background-blend-mode: multiply; opacity: .48; pointer-events: none; }
.mesh { position: absolute; inset: 0; background-image: radial-gradient(rgba(20, 18, 15, .12) 1px, transparent 1.4px); background-size: 22px 22px; -webkit-mask-image: linear-gradient(180deg, #000, transparent 75%); mask-image: linear-gradient(180deg, #000, transparent 75%); pointer-events: none; }
.link { position: relative; display: flex; align-items: center; gap: 0; }
.node { position: relative; z-index: 1; flex: none; width: 148px; height: 76px; border-radius: 22px; background: #fff; display: grid; place-items: center; padding: 12px 20px; box-shadow: 0 18px 36px -18px rgba(20, 18, 15, .45); }
.node img { max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain; display: block; }
.node b { font-size: 15px; font-weight: 700; text-align: center; }
.node.b { animation: pop .5s cubic-bezier(.3, 1.3, .5, 1) both; }
@keyframes pop { from { opacity: 0; transform: scale(.85); } to { opacity: 1; transform: none; } }

.wire { position: relative; flex: 1; height: 76px; display: grid; place-items: center; min-width: 40px; }
.dash { position: absolute; left: 0; right: 0; top: 50%; height: 2px; transform: translateY(-50%); background: repeating-linear-gradient(90deg, var(--ink) 0 8px, transparent 8px 16px); opacity: .5; animation: flow 1s linear infinite; animation-play-state: paused; }
.in .dash { animation-play-state: running; }
@keyframes flow { to { background-position: 16px 0; } }
.packet { position: absolute; top: 50%; width: 12px; height: 12px; margin-top: -6px; border-radius: 50%; background: var(--ink); box-shadow: 0 0 0 5px rgba(20, 18, 15, .12); animation: travel 2.4s ease-in-out infinite; animation-play-state: paused; left: 0; }
.in .packet { animation-play-state: running; }
.p2 { animation-delay: 1.2s; animation-direction: reverse; background: var(--ti); box-shadow: 0 0 0 5px rgba(255, 255, 255, .6); }
@keyframes travel { 0% { left: 0; opacity: 0; } 12% { opacity: 1; } 88% { opacity: 1; } 100% { left: calc(100% - 12px); opacity: 0; } }
.tag { position: relative; z-index: 1; margin-top: -2px; font-size: 11.5px; font-weight: 600; padding: 4px 12px; border-radius: 99px; background: var(--ink); color: #fff; white-space: nowrap; transform: translateY(-26px); }

.ui { position: relative; background: #fff; border-radius: 24px; padding: 22px; box-shadow: 0 24px 48px -26px rgba(20, 18, 15, .5); animation: pop .5s ease both; flex: 1; display: flex; flex-direction: column; gap: 16px; }
.uh { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
.uh b { font-size: 16px; font-weight: 600; }
.uh span { font-size: 12.5px; color: var(--muted); }
.body { flex: 1; display: flex; flex-direction: column; gap: 10px; justify-content: center; }
.r { display: flex; justify-content: space-between; gap: 10px; padding: 12px 16px; border-radius: 14px; background: #f6f6f8; font-size: 13.5px; opacity: .2; transform: translateX(-6px); transition: all .4s ease; }
.r.v { opacity: 1; transform: none; }
.r span { color: var(--muted); } .r em { font-style: normal; font-weight: 600; }
.r.t { background: var(--t); }
.btn { text-align: center; font-size: 13.5px; font-weight: 500; padding: 12px; border-radius: 12px; background: var(--ink); color: #fff; transition: all .35s; }
.btn.ok { background: var(--mint); color: var(--mint-i); }

.call { align-items: center; text-align: center; gap: 4px; }
.av { width: 64px; height: 64px; border-radius: 50%; background: var(--sky); color: var(--sky-i); display: grid; place-items: center; font-size: 24px; font-weight: 600; margin-bottom: 6px; }
.av.ring { animation: ringp 1s ease-out infinite; }
@keyframes ringp { 0% { box-shadow: 0 0 0 0 rgba(58, 127, 189, .45); } 100% { box-shadow: 0 0 0 16px rgba(58, 127, 189, 0); } }
.call b { font-size: 16px; font-weight: 600; }
.call small { font-size: 12.5px; color: var(--muted); }
.chipx { margin-top: 10px; font-size: 12px; font-weight: 600; padding: 5px 14px; border-radius: 99px; background: var(--mint); color: var(--mint-i); opacity: 0; transition: opacity .4s; }
.chipx.v { opacity: 1; }

.msg { border: 1px solid var(--line); border-radius: 14px; padding: 14px; display: flex; flex-direction: column; gap: 8px; opacity: .2; transition: opacity .4s; }
.msg.v { opacity: 1; }
.msg i { display: block; height: 7px; border-radius: 4px; background: #e3e5e9; }
.msg i.s { width: 60%; }

.slots { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
.slots span { text-align: center; padding: 16px 8px; border-radius: 14px; border: 1.5px solid var(--line); font-size: 14px; font-weight: 500; color: var(--muted); transition: all .3s; }
.slots span.on { background: var(--ink); color: #fff; border-color: var(--ink); }

@media (max-width: 960px) {
  .grid { grid-template-columns: 1fr; }
  .list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .list button.on { transform: none; }
}
@media (max-width: 600px) {
  .ws { padding: 64px 16px; }
  .list { grid-template-columns: 1fr; }
  .stage { padding: 16px; border-radius: 24px; min-height: 0; }
  .node { width: 108px; height: 64px; border-radius: 18px; padding: 8px 12px; }
  .wire { height: 64px; }
  .tag { font-size: 10.5px; padding: 3px 9px; }
  .ui { padding: 16px; border-radius: 20px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .grid { opacity: 1; transform: none; transition: none; }
  .dash, .packet, .av, .node.b, .ui, .list button.on .bar { animation: none !important; }
  .packet { display: none; }
  * { transition-duration: 0s !important; }
}
</style>

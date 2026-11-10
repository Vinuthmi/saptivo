<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "CustomerRecordTimelineSection" });

const root = ref(null);
const scroller = ref(null);
const shown = ref(false);
const ph = ref(0); // 0 customer says it, 1 scroll back, 2 found, 3 opened, 4 hold
const manual = ref(false);
const filter = ref("all");
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
const avatar = base + "smiling-woman-using-smartphone-in-front-of-green-w-2026-10-27-20-08-47-utc.jpg";
const avatarOk = ref(true);

const filters = [
  { k: "all", t: "All" },
  { k: "wa", t: "WhatsApp" },
  { k: "call", t: "Calls" },
  { k: "email", t: "Emails" },
  { k: "quote", t: "Quotations" },
  { k: "invoice", t: "Invoices" },
];

const kinds = {
  wa: { l: "WhatsApp", tone: "mint", ic: "M4 20l1.3-4.2A8 8 0 1 1 8.3 19z" },
  call: { l: "Call", tone: "sky", ic: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" },
  email: { l: "Email", tone: "lav", ic: "M4 6h16v12H4zM4 7l8 6 8-6" },
  quote: { l: "Quotation", tone: "butter", ic: "M7 3h8l4 4v14H7zM15 3v4h4M10 13h6M10 17h4" },
  invoice: { l: "Invoice", tone: "rose", ic: "M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6" },
};

const entries = [
  { id: "e1", k: "invoice", d: "Today · 09:20", t: "Invoice INV-3021 sent", s: "LKR 42,000 · due in 14 days" },
  { id: "e2", k: "wa", d: "Today · 09:14", t: "Dilani: Can you confirm the delivery date?", s: "Replied by Nimali" },
  { id: "e3", k: "email", d: "2 Nov · 16:02", t: "Order confirmation sent", s: "Order #1042" },
  { id: "e4", k: "call", d: "30 Oct · 11:30", t: "Outbound call · 6 min", s: "Hasitha" },
  { id: "e5", k: "quote", d: "28 Oct · 10:05", t: "Quotation Q-1042 sent", s: "LKR 42,000 · accepted" },
  { id: "target", k: "wa", d: "14 Oct · 15:41", t: "WhatsApp conversation · 5 messages", s: "Kasun", target: true },
  { id: "e7", k: "call", d: "2 Oct · 12:10", t: "Inbound call · 3 min", s: "Nimali" },
  { id: "e8", k: "wa", d: "20 Sep · 09:48", t: "First enquiry from website chat", s: "Hasitha" },
];

const list = computed(() => (filter.value === "all" ? entries : entries.filter((e) => e.k === filter.value)));
const isHl = (e) => e.target && ph.value >= 2 && filter.value === "all";
const isOpen = (e) => e.target && ph.value >= 3 && filter.value === "all";

function goTo(id) {
  const box = scroller.value;
  if (!box) return;
  if (!id) return box.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  const el = box.querySelector('[data-id="' + id + '"]');
  if (el) box.scrollTo({ top: Math.max(0, el.offsetTop - 12), behavior: reduce ? "auto" : "smooth" });
}

watch(ph, async (v) => {
  if (manual.value) return;
  await nextTick();
  if (v === 0) goTo(null);
  if (v === 1) goTo("target");
});

function advance() {
  ph.value = (ph.value + 1) % 5;
}
function setFilter(k) {
  manual.value = true;
  stop();
  filter.value = k;
  ph.value = 3;
  nextTick(() => goTo(k === "all" ? "target" : null));
}
function start() {
  if (timer || reduce || manual.value) return;
  timer = setInterval(advance, 1900);
}
function stop() {
  clearInterval(timer);
  timer = null;
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    ph.value = 3;
    nextTick(() => goTo("target"));
    return;
  }
  io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        shown.value = true;
        start();
      } else stop();
    },
    { threshold: 0.3 }
  );
  io.observe(root.value);
});
onBeforeUnmount(() => {
  stop();
  if (io) io.disconnect();
});
</script>

<template>
  <section ref="root" class="ct" :class="{ in: shown }">
    <div class="wrap">
      <!-- record -->
      <div class="rec" role="img" aria-label="A customer record with a timeline of WhatsApp chats, calls, emails, quotations and invoices">
        <div class="rtop">
          <span class="ava">
            <img v-if="avatarOk" :src="avatar" alt="" @error="avatarOk = false" />
            <b v-else>D</b>
          </span>
          <div class="who">
            <strong>Dilani Perera</strong>
            <span>Perera Hardware · Colombo 05</span>
          </div>
          <span class="stat"><b>8</b> activities</span>
        </div>

        <div class="chips">
          <button
            v-for="f in filters"
            :key="f.k"
            type="button"
            class="chip"
            :class="{ act: filter === f.k }"
            @click="setFilter(f.k)"
          >{{ f.t }}</button>
        </div>

        <div ref="scroller" class="tl">
          <TransitionGroup name="row" tag="ol">
            <li
              v-for="e in list"
              :key="e.id"
              :data-id="e.id"
              class="it"
              :class="['tone-' + kinds[e.k].tone, { hl: isHl(e), open: isOpen(e) }]"
            >
              <span class="ico">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path :d="kinds[e.k].ic" /></svg>
              </span>
              <div class="body">
                <div class="line">
                  <em>{{ kinds[e.k].l }}</em>
                  <time>{{ e.d }}</time>
                </div>
                <strong>{{ e.t }}</strong>
                <span class="sub">{{ e.s }}</span>
                <Transition name="exp">
                  <div v-if="isOpen(e)" class="conv">
                    <p class="c">I need delivery before the 15th, it is for a shop opening.</p>
                    <p class="a">Noted. Delivery before the 15th for order #1042. <small>Kasun</small></p>
                  </div>
                </Transition>
              </div>
            </li>
          </TransitionGroup>
          <p v-if="!list.length" class="empty">Nothing here yet.</p>
        </div>

        <Transition name="pop">
          <div v-if="ph >= 2 && filter === 'all'" class="found">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
            Found: WhatsApp · 14 Oct
          </div>
        </Transition>
      </div>

      <!-- copy -->
      <div class="copy">
        <h2>Every WhatsApp chat on the customer record</h2>
        <p>
          WhatsApp conversations appear on the contact's timeline beside calls, emails, quotations and invoices.
          When a customer says "as I told your colleague last month", your team can scroll back and see it.
        </p>

        <div class="say">
          <Transition name="pop">
            <div v-if="ph >= 0" key="b" class="bubble">
              <small>Dilani on WhatsApp</small>
              As I told your colleague last month, I need delivery before the 15th.
            </div>
          </Transition>
          <div class="arrowdown" :class="{ on: ph >= 1 }">
            <i></i>
            <span>{{ ph >= 3 ? "It is right there on the timeline." : ph >= 1 ? "Scrolling back on the record…" : "" }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ct {
  --ink: #17191d; --muted: #666b73; --line: #ece9f3;
  --lav: #e8e3ff; --lav-i: #7d6be6;
  --sky: #dcecfb; --sky-i: #3f87c7;
  --mint: #d3f0e1; --mint-i: #2f9c6b;
  --butter: #fff1c9; --butter-i: #a77d00;
  --rose: #fde3ea; --rose-i: #d8567f;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: linear-gradient(180deg, #fff 0%, #f8f6ff 100%);
  padding: 88px 16px;
}
.wrap { max-width: 1120px; margin: 0 auto; display: grid; grid-template-columns: 1.05fr 1fr; gap: 56px; align-items: center; }
.eyebrow { display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; background: var(--butter); color: var(--butter-i); padding: 6px 14px; border-radius: 99px; margin-bottom: 16px; }
h2 { font-size: clamp(34px, 3.4vw, 56px); line-height: 1.08; font-weight: 500; margin: 0 0 18px; letter-spacing: -0.06em; font-family: "Inter", system-ui, sans-serif; text-wrap: balance; }
.copy > p { margin: 0; font-size: 16px; line-height: 1.7; color: var(--muted); }

.rec, .copy { opacity: 0; transform: translateY(18px); transition: opacity .6s ease, transform .6s ease; }
.in .rec, .in .copy { opacity: 1; transform: none; }
.in .copy { transition-delay: .12s; }

/* record */
.rec { background: #fff; border: 1px solid var(--line); border-radius: 22px; box-shadow: 0 24px 60px rgba(60, 50, 120, .1); padding: 18px; position: relative; }
.rtop { display: flex; align-items: center; gap: 12px; padding-bottom: 14px; }
.ava { width: 46px; height: 46px; border-radius: 50%; overflow: hidden; background: var(--mint); color: var(--mint-i); display: grid; place-items: center; font-weight: 700; flex: none; }
.ava img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.who { flex: 1; min-width: 0; }
.who strong { display: block; font-size: 15px; }
.who span { font-size: 12px; color: var(--muted); }
.stat { font-size: 12px; color: var(--muted); background: #f6f5fb; padding: 6px 12px; border-radius: 99px; white-space: nowrap; }
.stat b { color: var(--ink); }
.chips { display: flex; gap: 6px; flex-wrap: wrap; padding-bottom: 14px; border-bottom: 1px solid var(--line); }
.chip { all: unset; box-sizing: border-box; cursor: pointer; font-size: 12px; font-weight: 600; padding: 7px 13px; border-radius: 99px; background: #f3f1fa; color: var(--muted); transition: background .3s, color .3s; }
.chip:hover { background: #e9e6f5; }
.chip.act { background: var(--ink); color: #fff; }
.chip:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

.tl { height: 400px; overflow-y: auto; padding: 14px 4px 14px 0; position: relative; scrollbar-width: thin; scrollbar-color: #d9d6e4 transparent; }
.tl ol { list-style: none; margin: 0; padding: 0; position: relative; }
.tl ol::before { content: ""; position: absolute; left: 19px; top: 8px; bottom: 8px; width: 2px; background: var(--line); }
.tone-mint { --t: var(--mint); --ti: var(--mint-i); }
.tone-sky { --t: var(--sky); --ti: var(--sky-i); }
.tone-lav { --t: var(--lav); --ti: var(--lav-i); }
.tone-butter { --t: var(--butter); --ti: var(--butter-i); }
.tone-rose { --t: var(--rose); --ti: var(--rose-i); }
.it { display: flex; gap: 14px; padding: 8px 10px 8px 0; position: relative; border-radius: 14px; transition: background .4s, box-shadow .4s; }
.ico { width: 40px; height: 40px; border-radius: 50%; background: var(--t); color: var(--ti); display: grid; place-items: center; flex: none; position: relative; z-index: 1; border: 3px solid #fff; box-sizing: border-box; width: 40px; }
.ico svg { width: 17px; height: 17px; }
.body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; padding-top: 1px; }
.line { display: flex; justify-content: space-between; gap: 8px; }
.line em { font-style: normal; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--ti); }
.line time { font-size: 11px; color: #9a9fa8; }
.body strong { font-size: 13px; line-height: 1.4; }
.sub { font-size: 11px; color: var(--muted); }
.it.hl { background: #f2fbf6; box-shadow: 0 0 0 1.5px var(--mint-i) inset; padding-left: 0; }
.conv { margin-top: 8px; display: flex; flex-direction: column; gap: 6px; }
.conv p { margin: 0; font-size: 12px; line-height: 1.45; padding: 7px 11px; border-radius: 12px; max-width: 88%; }
.conv .c { background: #fff; border: 1px solid var(--line); border-top-left-radius: 3px; align-self: flex-start; }
.conv .a { background: var(--mint); border-top-right-radius: 3px; align-self: flex-end; }
.conv small { display: block; font-size: 10px; color: var(--mint-i); font-weight: 600; }
.empty { text-align: center; color: var(--muted); font-size: 13px; padding: 40px 0; }

.found { position: absolute; right: 16px; bottom: 16px; display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; background: var(--ink); color: #fff; padding: 9px 16px; border-radius: 99px; box-shadow: 0 10px 24px rgba(0, 0, 0, .2); }
.found svg { width: 14px; height: 14px; }

/* copy side */
.say { margin-top: 28px; display: flex; flex-direction: column; gap: 10px; align-items: flex-start; }
.bubble { max-width: 340px; font-size: 14px; line-height: 1.55; background: var(--mint); padding: 12px 16px; border-radius: 18px; border-top-left-radius: 4px; }
.bubble small { display: block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--mint-i); margin-bottom: 3px; }
.arrowdown { display: flex; align-items: center; gap: 12px; padding-left: 14px; height: 40px; opacity: .35; transition: opacity .4s; }
.arrowdown.on { opacity: 1; }
.arrowdown i { width: 2px; height: 28px; background: repeating-linear-gradient(180deg, var(--ink) 0 4px, transparent 4px 8px); }
.arrowdown span { font-size: 13px; font-weight: 600; }

.row-enter-active, .row-leave-active { transition: all .35s ease; }
.row-enter-from, .row-leave-to { opacity: 0; transform: translateX(-10px); }
.exp-enter-active { transition: all .45s ease; }
.exp-enter-from { opacity: 0; transform: translateY(-6px); }
.pop-enter-active { transition: all .4s cubic-bezier(.2, 1.3, .4, 1); }
.pop-enter-from { opacity: 0; transform: scale(.9) translateY(8px); }

@media (max-width: 960px) {
  .wrap { grid-template-columns: 1fr; gap: 36px; }
  .copy { order: -1; }
}
@media (max-width: 560px) {
  .ct { padding: 64px 16px; }
  .rec { padding: 14px; }
  .tl { height: 360px; }
}
@media (prefers-reduced-motion: reduce) {
  .rec, .copy { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>

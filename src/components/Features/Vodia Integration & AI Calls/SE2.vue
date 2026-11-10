<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "AiVoiceAgentsSection" });

const root = ref(null);
const shown = ref(false);
const sc = ref(0);
const ph = ref(0);
const manual = ref(false);
let timer = null;
let io = null;
let reduce = false;
const END = 6;

const base = "/saptivo/images/features/";
const photoOk = ref([true, true, true, true]);

// m = true marks a word the agent personalised from CRM data
const scenarios = [
  {
    tab: "Appointment",
    dir: "Outbound",
    name: "Dilani Perera",
    num: "+94 71 555 0198",
    photo: base + "smiling-woman-using-smartphone-in-front-of-green-w-2026-10-27-20-08-47-utc.jpg",
    data: [
      { l: "Name", v: "Dilani Perera" },
      { l: "Appointment", v: "Tomorrow, 10:00 am" },
      { l: "Service", v: "AC servicing" },
      { l: "Technician", v: "Kasun" },
    ],
    a1: [{ t: "Hello " }, { t: "Dilani", m: 1 }, { t: ", this is the assistant from Saptivo Store. Your " }, { t: "AC servicing", m: 1 }, { t: " is booked for " }, { t: "tomorrow at 10 am", m: 1 }, { t: " with " }, { t: "Kasun", m: 1 }, { t: ". Does that still work?" }],
    c1: "Yes, that's fine.",
    a2: [{ t: "Great, I've confirmed it. See you tomorrow!" }],
    out: { tone: "mint", t: "Appointment confirmed", s: "Logged to Dilani's timeline" },
  },
  {
    tab: "Invoice",
    dir: "Outbound",
    name: "Ravi Fernando",
    num: "+94 77 210 8843",
    photo: base + "man-using-point-of-sale-system-in-cafe-2026-09-23-07-53-09-utc.jpg",
    data: [
      { l: "Name", v: "Ravi Fernando" },
      { l: "Invoice", v: "INV-3021" },
      { l: "Amount", v: "LKR 42,000" },
      { l: "Due date", v: "5 Nov · 4 days overdue" },
    ],
    a1: [{ t: "Hi " }, { t: "Ravi", m: 1 }, { t: ", I'm calling about invoice " }, { t: "INV-3021", m: 1 }, { t: " for " }, { t: "LKR 42,000", m: 1 }, { t: ", which was due on " }, { t: "5 November", m: 1 }, { t: ". Can we expect payment this week?" }],
    c1: "Sorry, I'll pay on Friday.",
    a2: [{ t: "Thanks, I've noted Friday and will send a payment link on WhatsApp." }],
    out: { tone: "butter", t: "Promise to pay · Friday", s: "Follow-up task created for Friday" },
  },
  {
    tab: "Inbound call",
    dir: "Inbound",
    name: "Malini Jayasuriya",
    num: "+94 76 400 2211",
    photo: base + "professional-woman-during-online-meeting-in-modern-2026-09-21-18-23-13-utc.jpg",
    data: [
      { l: "Caller", v: "Malini Jayasuriya" },
      { l: "Last order", v: "#1042 · out for delivery" },
      { l: "Open ticket", v: "Delivery delay" },
      { l: "Expected", v: "Today by 4 pm" },
    ],
    a1: [{ t: "Thank you for calling Saptivo Store, " }, { t: "Malini", m: 1 }, { t: ". Are you calling about your order " }, { t: "#1042", m: 1 }, { t: "?" }],
    c1: "Yes, where is it?",
    a2: [{ t: "It's out for delivery and should reach you " }, { t: "by 4 pm today", m: 1 }, { t: "." }],
    out: { tone: "mint", t: "Resolved without staff", s: "Ticket updated · call summary saved" },
  },
  {
    tab: "Needs a person",
    dir: "Outbound",
    name: "Hasitha Traders",
    num: "+94 11 245 6677",
    photo: base + "confident-man-uses-cellphone-near-modern-city-buil-2026-09-24-03-29-45-utc.jpg",
    data: [
      { l: "Name", v: "Hasitha Traders" },
      { l: "Contract", v: "SC-204 · service contract" },
      { l: "Renews", v: "30 Nov" },
      { l: "Value", v: "LKR 180,000 / year" },
    ],
    a1: [{ t: "Hello, this is Saptivo Store. Your service contract " }, { t: "SC-204", m: 1 }, { t: " renews on " }, { t: "30 November", m: 1 }, { t: ". Would you like to renew?" }],
    c1: "I want to discuss the pricing first.",
    a2: [{ t: "Of course. I'm connecting you with " }, { t: "Nimali", m: 1 }, { t: " now." }],
    out: { tone: "lav", t: "Transferred to Nimali", s: "She sees the call summary and contract" },
  },
];

const cur = computed(() => scenarios[sc.value]);
const status = computed(() => (ph.value < 2 ? (cur.value.dir === "Inbound" ? "Ringing…" : "Calling…") : ph.value >= 5 ? "Call ended · 0:38" : "Connected"));
const speaking = computed(() => (ph.value === 2 || ph.value === 4 ? "agent" : ph.value === 3 ? "customer" : ""));

function advance() {
  if (ph.value < END) ph.value++;
  else if (!manual.value) {
    sc.value = (sc.value + 1) % scenarios.length;
    ph.value = 0;
  }
}
function pick(i) {
  manual.value = true;
  sc.value = i;
  ph.value = 0;
  start();
}
function start() {
  if (timer || reduce) return;
  timer = setInterval(advance, 1700);
}
function stop() {
  clearInterval(timer);
  timer = null;
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    ph.value = 5;
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
  <section ref="root" class="av" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span>AI voice agents</span> <span class="soft">that make calls for your team</span></h2>
        <p>
          Vodia's AI voice agents hold natural phone conversations, answer inbound calls and place outbound calls on
          your behalf. With Saptivo, those agents work from live customer data. The CRM sends the customer's name,
          appointment, invoice or contract details when it starts a call, and the agent personalises the
          conversation. That turns Saptivo into an AI voice agent CRM that handles routine calls while your staff
          focus on the conversations that need a person.
        </p>
      </header>

      <div class="tabs" role="tablist">
        <button
          v-for="(s, i) in scenarios"
          :key="s.tab"
          type="button"
          role="tab"
          :aria-selected="sc === i"
          class="tab"
          :class="{ act: sc === i }"
          @click="pick(i)"
        >{{ s.tab }}</button>
      </div>

      <div class="board" role="img" aria-label="The CRM sends customer data to an AI voice agent, which holds the call and logs the result">
        <!-- CRM data -->
        <div class="crm">
          <div class="ct">
            <b class="logo">S</b>
            <div><strong>Saptivo CRM</strong><span>{{ ph === 0 ? "Starting call…" : "Data sent to the voice agent" }}</span></div>
          </div>
          <dl :key="sc" class="fields">
            <template v-if="ph >= 1">
              <div v-for="(f, i) in cur.data" :key="f.l" class="fl" :style="{ '--i': i }">
                <dt>{{ f.l }}</dt>
                <dd>{{ f.v }}</dd>
              </div>
            </template>
            <div v-else class="wait"><i></i><i></i><i></i></div>
          </dl>
          <div class="send" :class="{ on: ph >= 1 }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            <span>Sent to Vodia agent when the call starts</span>
          </div>
        </div>

        <!-- call -->
        <div class="call">
          <div class="ch">
            <span class="cav">
              <img v-if="photoOk[sc]" :src="cur.photo" alt="" @error="photoOk[sc] = false" />
              <b v-else>{{ cur.name[0] }}</b>
            </span>
            <div class="ci">
              <strong>{{ cur.name }}</strong>
              <span>{{ cur.num }}</span>
            </div>
            <span class="dir">{{ cur.dir }}</span>
            <span class="stat" :class="{ ok: ph >= 2 && ph < 5, end: ph >= 5 }">{{ status }}</span>
          </div>

          <div class="vo">
            <span class="ai">AI</span>
            <div class="wv" :class="speaking">
              <i v-for="n in 22" :key="n" :style="{ animationDelay: n * 55 + 'ms' }"></i>
            </div>
            <em>{{ speaking === "agent" ? "Agent speaking" : speaking === "customer" ? "Customer speaking" : ph >= 5 ? "Done" : "Waiting" }}</em>
          </div>

          <div class="tr">
            <Transition name="msg">
              <div v-if="ph >= 2" :key="'a1' + sc" class="ln ag">
                <small>AI agent</small>
                <p><template v-for="(s, i) in cur.a1" :key="i"><mark v-if="s.m">{{ s.t }}</mark><template v-else>{{ s.t }}</template></template></p>
              </div>
            </Transition>
            <Transition name="msg">
              <div v-if="ph >= 3" :key="'c1' + sc" class="ln cu">
                <small>{{ cur.name.split(" ")[0] }}</small>
                <p>{{ cur.c1 }}</p>
              </div>
            </Transition>
            <Transition name="msg">
              <div v-if="ph >= 4" :key="'a2' + sc" class="ln ag">
                <small>AI agent</small>
                <p><template v-for="(s, i) in cur.a2" :key="i"><mark v-if="s.m">{{ s.t }}</mark><template v-else>{{ s.t }}</template></template></p>
              </div>
            </Transition>
          </div>

          <Transition name="pop">
            <div v-if="ph >= 5" :key="'o' + sc" class="out" :class="'tone-' + cur.out.tone">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
              <div><strong>{{ cur.out.t }}</strong><span>{{ cur.out.s }}</span></div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.av {
  --ink: #17191d; --muted: #666b73; --line: #ece9f3;
  --lav: #e8e3ff; --lav-i: #7d6be6;
  --sky: #dcecfb; --sky-i: #3f87c7;
  --mint: #d3f0e1; --mint-i: #2f9c6b;
  --butter: #fff1c9; --butter-i: #a77d00;
  --rose: #fde3ea; --rose-i: #d8567f;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: linear-gradient(180deg, #f8f6ff 0%, #fff 100%);
  padding: 88px 16px;
}
.wrap { max-width: 1120px; margin: 0 auto; }
.head { text-align: center; max-width: 800px; margin: 0 auto 32px; }
.eyebrow { display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; background: var(--lav); color: var(--lav-i); padding: 6px 14px; border-radius: 99px; margin-bottom: 16px; }
h2 { margin: 0 0 16px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; color: #33485d; text-wrap: balance; }
h2 span { display: block; }
h2 span:first-child { color: #727a85; }
.head p { margin: 0; font-size: 16px; line-height: 1.7; color: var(--muted); }

.head, .tabs, .board { opacity: 0; transform: translateY(18px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .tabs, .in .board { opacity: 1; transform: none; }
.in .tabs { transition-delay: .08s; }
.in .board { transition-delay: .16s; }

.tabs { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
.tab { all: unset; box-sizing: border-box; cursor: pointer; font-size: 13px; font-weight: 600; padding: 10px 18px; border-radius: 99px; background: #f3f1fa; color: var(--muted); transition: all .3s; }
.tab:hover { background: #e9e6f5; }
.tab.act { background: var(--ink); color: #fff; }
.tab:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

.board { display: grid; grid-template-columns: 340px 1fr; gap: 20px; background: linear-gradient(160deg, #f1eeff, #e9f5ff 55%, #e6f7ee); border-radius: 28px; padding: 24px; align-items: stretch; }
.tone-mint { --t: var(--mint); --ti: var(--mint-i); }
.tone-butter { --t: var(--butter); --ti: var(--butter-i); }
.tone-lav { --t: var(--lav); --ti: var(--lav-i); }

/* crm */
.crm { background: #fff; border-radius: 20px; box-shadow: 0 18px 44px rgba(60, 50, 120, .12); padding: 18px; display: flex; flex-direction: column; gap: 14px; }
.ct { display: flex; align-items: center; gap: 10px; padding-bottom: 12px; border-bottom: 1px solid var(--line); }
.logo { width: 34px; height: 34px; border-radius: 10px; background: var(--ink); color: #fff; display: grid; place-items: center; font-size: 13px; }
.ct strong { display: block; font-size: 13px; }
.ct span { font-size: 11px; color: var(--muted); }
.fields { margin: 0; display: flex; flex-direction: column; gap: 8px; flex: 1; min-height: 190px; }
.fl { display: flex; justify-content: space-between; gap: 10px; padding: 10px 12px; border-radius: 12px; background: #f8f7fc; font-size: 12px; animation: rise .45s ease both; animation-delay: calc(var(--i) * .18s); }
.fl dt { color: var(--muted); flex: none; }
.fl dd { margin: 0; font-weight: 600; text-align: right; }
@keyframes rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.wait { display: flex; gap: 6px; padding: 16px 4px; }
.wait i { width: 8px; height: 8px; border-radius: 50%; background: #cfcbe0; animation: dot 1s ease-in-out infinite; }
.wait i:nth-child(2) { animation-delay: .15s; }
.wait i:nth-child(3) { animation-delay: .3s; }
@keyframes dot { 50% { transform: translateY(-6px); background: var(--lav-i); } }
.send { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 600; color: var(--muted); background: #f3f1fa; padding: 9px 12px; border-radius: 12px; transition: all .4s; }
.send svg { width: 14px; height: 14px; flex: none; }
.send.on { background: var(--lav); color: var(--lav-i); }

/* call */
.call { background: #fff; border-radius: 20px; box-shadow: 0 18px 44px rgba(60, 50, 120, .12); padding: 18px; display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.ch { display: flex; align-items: center; gap: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--line); }
.cav { width: 46px; height: 46px; border-radius: 50%; overflow: hidden; background: var(--mint); color: var(--mint-i); display: grid; place-items: center; font-weight: 700; flex: none; }
.cav img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.ci { flex: 1; min-width: 0; }
.ci strong { display: block; font-size: 14px; }
.ci span { font-size: 12px; color: var(--muted); }
.dir { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--sky-i); background: var(--sky); padding: 4px 10px; border-radius: 99px; }
.stat { font-size: 11px; font-weight: 600; padding: 5px 12px; border-radius: 99px; background: var(--butter); color: var(--butter-i); white-space: nowrap; transition: all .3s; }
.stat.ok { background: var(--mint); color: var(--mint-i); }
.stat.end { background: #f1f0f6; color: var(--muted); }

.vo { display: flex; align-items: center; gap: 12px; background: #f8f7fc; border-radius: 14px; padding: 10px 14px; }
.ai { width: 30px; height: 30px; border-radius: 50%; background: var(--ink); color: #fff; font-size: 11px; font-weight: 700; display: grid; place-items: center; flex: none; }
.wv { flex: 1; display: flex; align-items: center; gap: 3px; height: 30px; }
.wv i { flex: 1; max-width: 6px; height: 4px; border-radius: 3px; background: #d4d0e4; transition: background .3s; }
.wv.agent i { background: var(--lav-i); animation: wave .7s ease-in-out infinite alternate; }
.wv.customer i { background: var(--mint-i); animation: wave .7s ease-in-out infinite alternate; }
@keyframes wave { from { height: 4px; } to { height: 26px; } }
.vo em { font-style: normal; font-size: 11px; font-weight: 600; color: var(--muted); min-width: 110px; text-align: right; }

.tr { flex: 1; display: flex; flex-direction: column; gap: 10px; min-height: 190px; }
.ln { max-width: 86%; display: flex; flex-direction: column; gap: 3px; }
.ln small { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); }
.ln p { margin: 0; font-size: 13px; line-height: 1.6; padding: 10px 14px; border-radius: 16px; }
.ag p { background: #f3f1fa; border-top-left-radius: 4px; }
.cu { align-self: flex-end; align-items: flex-end; }
.cu p { background: var(--mint); border-top-right-radius: 4px; }
mark { background: var(--butter); color: var(--ink); font-weight: 600; padding: 1px 5px; border-radius: 5px; }

.out { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 14px; background: var(--t); }
.out svg { width: 28px; height: 28px; padding: 6px; border-radius: 50%; background: var(--ti); color: #fff; flex: none; }
.out strong { display: block; font-size: 13px; color: var(--ti); }
.out span { font-size: 11px; color: var(--muted); }

.msg-enter-active { transition: all .45s ease; }
.msg-enter-from { opacity: 0; transform: translateY(10px); }
.pop-enter-active { transition: all .5s cubic-bezier(.2, 1.3, .4, 1); }
.pop-enter-from { opacity: 0; transform: translateY(10px) scale(.96); }

@media (max-width: 900px) {
  .board { grid-template-columns: 1fr; padding: 16px; }
  .fields, .tr { min-height: 0; }
}
@media (max-width: 560px) {
  .av { padding: 64px 16px; }
  .dir { display: none; }
  .vo em { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .tabs, .board { opacity: 1; transform: none; transition: none; }
  .fl, .wait i, .wv i { animation: none; }
  .wv i { height: 12px; }
  * { transition-duration: 0s !important; }
}
</style>

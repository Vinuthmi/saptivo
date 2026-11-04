<template>
  <section id="channels" ref="root" class="chn" :class="{ in: seen, live }" aria-labelledby="chn-title">
    <h2 id="chn-title" class="title">
      <span>Talk to customers</span>
      <span class="soft">on every channel</span>
    </h2>

    <div class="grid" @mouseenter="paused = true" @mouseleave="paused = false">
      <!-- sliding visuals (same pattern as "Win more customers") -->
      <div class="visual">
        <div class="track" :style="{ transform: `translateX(-${active * 100}%)` }">
          <div
            v-for="(c, i) in channels"
            :key="c.key"
            class="slide"
            :class="{ on: i === active }"
            :style="slideStyle(c, i)"
            :aria-hidden="i !== active"
          >
            <div class="mock" aria-hidden="true">
              <!-- 1 · WhatsApp CRM -->
              <div v-if="c.key === 'whatsapp'" class="win">
                <div class="wh">
                  <span class="av">NP</span>
                  <div class="who"><b>Nimal Perera</b><small>WhatsApp Business · Shared inbox</small></div>
                  <span class="tagp">Sales · Colombo</span>
                </div>
                <div class="chat">
                  <div class="msg in rv" style="--i: 0">Hi! Do you install solar panels in Kandy?<em>10:42</em></div>
                  <div class="msg bot rv" style="--i: 1"><span class="by">Bot triage</span>Hi Nimal! Routing you to our sales team now.<em>10:42</em></div>
                  <div class="msg out rv" style="--i: 2"><span class="by">Template · Quotation</span>Your quotation QT-0142 is ready. Reply YES to accept.<em>10:44</em></div>
                  <div class="typing rv" style="--i: 3"><i></i><i></i><i></i></div>
                </div>
                <div class="foot rv" style="--i: 4">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10" /></svg>
                  Full chat history saved · 214 messages
                </div>
              </div>

              <!-- 2 · 3CX -->
              <div v-else-if="c.key === '3cx'" class="win">
                <div class="callcard rv" style="--i: 0">
                  <span class="ring"><span class="av">NP</span><i></i><i></i></span>
                  <div class="cinfo">
                    <small>Incoming call · 3CX</small>
                    <b>Nimal Perera</b>
                    <span>+94 77 123 4567</span>
                  </div>
                </div>
                <div class="kv rv" style="--i: 1"><span>Matched customer</span><b>#C-2041 · Colombo</b></div>
                <div class="kv rv" style="--i: 2"><span>Open deal</span><b>DL-0412 · Rs. 385,000</b></div>
                <div class="cbtns rv" style="--i: 3">
                  <span class="bt ans">Answer</span>
                  <span class="bt dial">Click-to-call</span>
                </div>
                <div class="foot rv" style="--i: 4">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10" /></svg>
                  Call logged automatically · 04:12
                </div>
              </div>

              <!-- 3 · Vodia + AI calls -->
              <div v-else-if="c.key === 'vodia'" class="win">
                <div class="wh">
                  <span class="av ai">AI</span>
                  <div class="who"><b>AI voice agent</b><small>Vodia PBX · Reminder call</small></div>
                  <span class="live"><i></i>Live</span>
                </div>
                <div class="wave rv" style="--i: 0">
                  <i v-for="(h, n) in bars" :key="n" :style="{ '--h': h, '--d': n * 0.06 + 's' }"></i>
                </div>
                <div class="tr rv" style="--i: 1"><b>AI</b>Hello Mr. Perera, your service visit is on 14 March at 10 AM. Shall I confirm?</div>
                <div class="tr cu rv" style="--i: 2"><b>Nimal</b>Yes, please confirm.</div>
                <div class="foot rv" style="--i: 3">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10" /></svg>
                  Visit confirmed · logged to Vodia PBX
                </div>
              </div>

              <!-- 4 · Customer portal -->
              <div v-else-if="c.key === 'portal'" class="win">
                <div class="wh">
                  <span class="av sq">PS</span>
                  <div class="who"><b>Perera Solar</b><small>Customer portal</small></div>
                  <span class="tagp">Signed in</span>
                </div>
                <div class="ptabs rv" style="--i: 0"><span class="on">Tickets</span><span>Quotes</span><span>Invoices</span><span>Documents</span></div>
                <div class="prow hot rv" style="--i: 1"><div><b>TK-318 · Inverter check</b><small>Technician assigned</small></div><span class="st o">In progress</span></div>
                <div class="prow rv" style="--i: 2"><div><b>QT-0142 · Quotation</b><small>Rs. 385,000</small></div><span class="st g">Accepted</span></div>
                <div class="prow rv" style="--i: 3"><div><b>INV-0087 · Tax invoice</b><small>Paid in full</small></div><span class="st g">Paid</span></div>
                <div class="prow rv" style="--i: 4"><div><b>Warranty certificate.pdf</b><small>Shared with you</small></div><span class="st b">Download</span></div>
              </div>

              <!-- 5 · Mobile CRM -->
              <div v-else class="phone rv" style="--i: 0">
                <span class="notch"></span>
                <div class="pt"><b>Scan business card</b><span class="off"><i></i>Offline</span></div>
                <div class="scanbox">
                  <div class="bc"><b>Kasun Silva</b><small>Director · Lanka Foods</small><small>+94 71 555 0198</small></div>
                  <i class="scan"></i>
                </div>
                <div class="fld rv" style="--i: 1"><span>Name</span><b>Kasun Silva</b></div>
                <div class="fld rv" style="--i: 2"><span>Company</span><b>Lanka Foods</b></div>
                <div class="sync rv" style="--i: 3">Saved offline · syncs when online</div>
              </div>
            </div>

            <div class="floats" aria-hidden="true">
              <div v-for="(f, fi) in c.cards" :key="f.k" class="float" :class="'f' + (fi + 1)" :style="{ '--n': fi }">
                <span class="k">{{ f.k }}</span>
                <span class="v">{{ f.v }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- feature tabs -->
      <ul class="tabs">
        <li v-for="(c, i) in channels" :key="c.key">
          <button
            type="button"
            class="tab"
            :class="{ on: i === active }"
            :aria-expanded="i === active"
            :aria-controls="'chn-d' + i"
            @click="active = i"
          >
            <span class="head">
              <span class="icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path v-for="(d, k) in c.icon" :key="k" :d="d" />
                </svg>
              </span>
              <span class="name">{{ c.name }}</span>
              <span class="num" aria-hidden="true">0{{ i + 1 }}</span>
            </span>
            <span :id="'chn-d' + i" class="desc">
              <span>
                <span class="desc-text">{{ c.text }}</span>
                <span class="chips">
                  <span v-for="f in c.feats" :key="f" class="chip">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
                    {{ f }}
                  </span>
                </span>
              </span>
            </span>
            <span class="line" aria-hidden="true">
              <span class="fill" :style="{ animationPlayState: running ? 'running' : 'paused' }" @animationend="next"></span>
            </span>
          </button>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
defineOptions({ name: "ChannelsSection" });

// Background photo behind every slide (set to "" for flat colour).
// Override per channel with `bg`.
const bgImage = "/images/features/channels-bg.jpg";

const channels = [
  {
    key: "whatsapp", name: "WhatsApp CRM",
    text: "A shared WhatsApp Business inbox with templates, bot triage and full chat history.",
    feats: ["Shared inbox", "Templates", "Bot triage", "Full chat history"],
    icon: ["M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-4.9A8.5 8.5 0 1 1 21 11.5z", "M8.5 10h7", "M8.5 13.5h4.5"],
    cards: [{ k: "New message", v: "Nimal P. · WhatsApp" }, { k: "Bot triage", v: "Routed to Sales" }, { k: "Template sent", v: "QT-0142 · Quotation" }],
  },
  {
    key: "3cx", name: "3CX call integration",
    text: "Caller ID pop-ups, automatic call logs and click-to-call.",
    feats: ["Caller ID pop-ups", "Automatic call logs", "Click-to-call"],
    icon: ["M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"],
    cards: [{ k: "Caller ID", v: "Nimal Perera" }, { k: "Call log", v: "Saved automatically" }, { k: "Click-to-call", v: "One tap" }],
  },
  {
    key: "vodia", name: "Vodia integration and AI calls",
    text: "Vodia PBX call logging plus AI voice agents for reminders and follow-ups.",
    feats: ["Vodia PBX call logging", "AI voice agents", "Reminders", "Follow-ups"],
    icon: ["M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z", "M19 10v2a7 7 0 0 1-14 0v-2", "M12 19v3"],
    cards: [{ k: "AI voice agent", v: "Reminder call" }, { k: "Vodia PBX", v: "Call logged" }, { k: "Follow-up", v: "Visit confirmed" }],
  },
  {
    key: "portal", name: "Customer portal",
    text: "A branded self-service portal for tickets, quotes, invoices and documents.",
    feats: ["Tickets", "Quotes", "Invoices", "Documents"],
    icon: ["M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z", "M3 9h18", "M7 13h6"],
    cards: [{ k: "Self-service", v: "Open 24/7" }, { k: "Ticket TK-318", v: "In progress" }, { k: "Invoice INV-0087", v: "Paid" }],
  },
  {
    key: "mobile", name: "Mobile CRM",
    text: "iOS and Android access with offline mode and a business card scanner.",
    feats: ["iOS and Android", "Offline mode", "Business card scanner"],
    icon: ["M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z", "M11 18h2"],
    cards: [{ k: "Platforms", v: "iOS and Android" }, { k: "Offline mode", v: "Syncs when online" }, { k: "Card scanned", v: "Kasun S. saved" }],
  },
];

const bars = [40, 70, 55, 90, 35, 80, 60, 100, 45, 75, 50, 85, 30, 65, 95, 55, 40, 70, 60, 85, 35, 75, 50, 65];

const tints = ["#ffd9c2", "#ffe0c9", "#ffd3bd", "#fbdcc8"];
const slideStyle = (c, i) => {
  const bg = c.bg ?? bgImage;
  return {
    backgroundColor: tints[i % tints.length],
    ...(bg ? { backgroundImage: `url("${bg}")` } : {}),
  };
};

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const active = ref(0);
const paused = ref(false);
const running = computed(() => live.value && !paused.value);
const next = () => { active.value = (active.value + 1) % channels.length; };

const st = { io: null, fallback: null };
onMounted(() => {
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window) || !root.value) {
    seen.value = true;
    live.value = !reduce; // reduced motion: no autoplay
    return;
  }
  st.io = new IntersectionObserver(
    (entries) => {
      const e = entries[entries.length - 1];
      if (e && e.isIntersecting) { seen.value = true; live.value = true; }
      else live.value = false;
    },
    { threshold: 0, rootMargin: "0px 0px -8% 0px" }
  );
  st.io.observe(root.value);
  // safety net so the content can never stay invisible
  st.fallback = window.setTimeout(() => { if (!seen.value) seen.value = true; }, 2500);
});
onBeforeUnmount(() => {
  if (st.io) st.io.disconnect();
  window.clearTimeout(st.fallback);
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

.chn {
  --orange: #ff6338;
  --orange-soft: #fff1ec;
  --ink: #14120f;
  --muted: #6a6560;
  --line: #f1e7e2;
  --dur: 6s;
  position: relative;
  overflow: clip;
  scroll-margin-top: 100px;
  padding: 112px 0;
  color: var(--ink);
  background: #fff;
  font-family: "Poppins", system-ui, sans-serif;
}
.chn *, .chn *::before, .chn *::after { box-sizing: border-box; }
.chn button:focus-visible { outline: 2px solid var(--orange); outline-offset: 3px; }

.title {
  margin: 0 auto; width: min(900px, calc(100% - 40px)); text-align: center; text-wrap: balance;
  font-size: clamp(34px, 3.6vw, 56px); font-weight: 500; line-height: 1.15;
  letter-spacing: -0.03em; color: var(--ink);
}
.title span { display: block; }
.title .soft { color: var(--muted); }

.grid {
  width: min(1180px, calc(100% - 40px)); margin: 64px auto 0;
  display: grid; grid-template-columns: 1fr 1.15fr; gap: 72px; align-items: center;
}
.visual { order: 2; }

/* ---------- visual: sliding panels ---------- */
.visual { position: relative; aspect-ratio: 4 / 3.7; overflow: hidden; border-radius: 28px; min-width: 0; background: #ffd9c2; }
.track { display: flex; height: 100%; transition: transform 0.7s cubic-bezier(0.65, 0, 0.35, 1); will-change: transform; }
.slide { position: relative; flex: none; width: 100%; height: 100%; background-size: cover; background-position: center; }

.mock { position: absolute; top: 0; bottom: 0; right: 4%; width: 68%; display: grid; place-items: center; }
.win { width: 100%; display: grid; gap: 9px; padding: 15px; border-radius: 22px; background: #fff; box-shadow: 0 20px 44px rgba(120, 50, 20, 0.22); }
.wh { display: flex; align-items: center; gap: 10px; }
.av { flex: none; display: grid; place-items: center; width: 36px; height: 36px; border-radius: 50%; background: var(--orange-soft); color: var(--orange); font-size: 12px; font-weight: 600; }
.av.ai { background: var(--orange); color: #fff; }
.av.sq { border-radius: 11px; background: var(--ink); color: #fff; }
.who { min-width: 0; flex: 1; }
.who b { display: block; font-size: 13px; font-weight: 600; }
.who small { display: block; color: var(--muted); font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tagp { padding: 4px 10px; border-radius: 99px; background: var(--orange-soft); color: var(--orange); font-size: 10.5px; font-weight: 600; white-space: nowrap; }
.foot { display: flex; align-items: center; gap: 7px; padding: 8px 12px; border-radius: 12px; background: #e6f6ec; color: #15803d; font-size: 11px; font-weight: 600; }

/* whatsapp */
.chat { display: grid; gap: 7px; padding: 11px; border-radius: 16px; background: #f7f3f0; }
.msg { max-width: 88%; padding: 7px 11px; border-radius: 14px; font-size: 12px; line-height: 1.5; }
.msg em { display: block; margin-top: 2px; font-style: normal; font-size: 9.5px; text-align: right; color: #9a948d; }
.msg .by { display: block; margin-bottom: 2px; font-size: 9.5px; font-weight: 600; color: var(--orange); }
.msg.in { justify-self: start; background: #fff; border-bottom-left-radius: 4px; }
.msg.bot { justify-self: start; background: var(--orange-soft); border-bottom-left-radius: 4px; }
.msg.out { justify-self: end; background: #e3f7e9; border-bottom-right-radius: 4px; }
.msg.out .by { color: #128a47; }
.typing { justify-self: end; display: inline-flex; gap: 4px; padding: 10px 12px; border-radius: 14px; border-bottom-right-radius: 4px; background: #e3f7e9; }
.typing i { width: 6px; height: 6px; border-radius: 50%; background: #128a47; animation: bounce 1.2s ease-in-out infinite; }
.typing i:nth-child(2) { animation-delay: 0.15s; }
.typing i:nth-child(3) { animation-delay: 0.3s; }

/* 3cx */
.callcard { display: flex; align-items: center; gap: 13px; padding: 13px; border-radius: 16px; background: var(--ink); color: #fff; }
.ring { position: relative; flex: none; width: 48px; height: 48px; }
.ring .av { position: relative; z-index: 1; width: 48px; height: 48px; background: var(--orange); color: #fff; font-size: 14px; }
.ring i { position: absolute; inset: 0; border-radius: 50%; border: 2px solid var(--orange); animation: halo 2s ease-out infinite; }
.ring i:nth-child(3) { animation-delay: 1s; }
.cinfo small { display: block; font-size: 10.5px; color: rgba(255, 255, 255, 0.62); }
.cinfo b { display: block; font-size: 15px; font-weight: 500; }
.cinfo span { font-size: 12px; color: rgba(255, 255, 255, 0.82); }
.kv { display: flex; justify-content: space-between; gap: 10px; padding: 9px 12px; border-radius: 12px; background: #faf8f6; font-size: 11.5px; }
.kv span { color: var(--muted); }
.kv b { font-weight: 600; }
.cbtns { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.bt { display: grid; place-items: center; padding: 9px; border-radius: 99px; font-size: 12px; font-weight: 600; }
.bt.ans { background: #22a55a; color: #fff; animation: pulse 2s ease-out infinite; }
.bt.dial { background: var(--orange-soft); color: var(--orange); }

/* vodia + ai */
.live { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 99px; background: var(--orange-soft); color: var(--orange); font-size: 10.5px; font-weight: 600; }
.live i { width: 6px; height: 6px; border-radius: 50%; background: currentColor; animation: blink 1.3s ease-in-out infinite; }
.wave { display: flex; align-items: center; justify-content: center; gap: 3px; height: 58px; border-radius: 14px; background: #fff8f5; }
.wave i { width: 4px; height: calc(var(--h) * 0.5px); border-radius: 3px; background: var(--orange); transform: scaleY(0.4); animation: wave 1.1s ease-in-out var(--d) infinite; }
.tr { padding: 8px 12px; border-radius: 12px; background: #faf8f6; font-size: 12px; line-height: 1.55; }
.tr b { display: block; font-size: 10px; font-weight: 600; letter-spacing: 0.04em; color: var(--orange); }
.tr.cu { background: #f4efec; }

/* portal */
.ptabs { display: flex; flex-wrap: wrap; gap: 6px; }
.ptabs span { padding: 5px 11px; border-radius: 99px; background: #f4efec; color: #8a857f; font-size: 11px; font-weight: 500; }
.ptabs .on { background: var(--orange); color: #fff; }
.prow { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 9px 12px; border-radius: 12px; background: #faf8f6; }
.prow b { display: block; font-size: 12px; font-weight: 500; }
.prow small { display: block; color: var(--muted); font-size: 10.5px; }
.prow.hot { animation: flash 2.8s ease-in-out 1.6s infinite; }
.st { flex: none; padding: 4px 10px; border-radius: 99px; font-size: 10.5px; font-weight: 600; }
.st.g { background: #e6f6ec; color: #15803d; }
.st.o { background: var(--orange-soft); color: var(--orange); }
.st.b { background: #e7f0ff; color: #0b57d0; }

/* mobile */
.phone { position: relative; width: 218px; display: grid; gap: 9px; padding: 22px 12px 14px; border: 6px solid var(--ink); border-radius: 34px; background: #fff; box-shadow: 0 24px 50px rgba(20, 18, 15, 0.35); }
.notch { position: absolute; left: 50%; top: 6px; width: 54px; height: 5px; border-radius: 4px; background: var(--ink); transform: translateX(-50%); }
.pt { display: flex; align-items: center; justify-content: space-between; gap: 6px; }
.pt b { font-size: 12.5px; font-weight: 600; }
.off { display: inline-flex; align-items: center; gap: 5px; padding: 3px 8px; border-radius: 99px; background: #fff0e8; color: #c4400f; font-size: 10px; font-weight: 600; }
.off i { width: 5px; height: 5px; border-radius: 50%; background: currentColor; animation: blink 1.3s ease-in-out infinite; }
.scanbox { position: relative; display: grid; place-items: center; height: 100px; overflow: hidden; border-radius: 14px; border: 1.5px dashed rgba(255, 99, 56, 0.55); background: #faf8f6; }
.bc { display: grid; gap: 2px; width: 82%; padding: 9px 11px; border-radius: 9px; background: #fff; box-shadow: 0 4px 12px rgba(20, 18, 15, 0.1); }
.bc b { font-size: 11.5px; font-weight: 600; }
.bc small { font-size: 9.5px; color: var(--muted); }
.scan { position: absolute; left: 0; right: 0; top: 0; height: 2px; background: var(--orange); box-shadow: 0 0 14px 3px rgba(255, 99, 56, 0.6); animation: scan 2.2s ease-in-out infinite alternate; }
.fld { display: flex; justify-content: space-between; gap: 6px; padding: 8px 10px; border-radius: 10px; background: #faf8f6; font-size: 11px; }
.fld span { color: var(--muted); }
.fld b { font-weight: 600; }
.sync { padding: 8px 10px; border-radius: 10px; background: #e6f6ec; color: #15803d; text-align: center; font-size: 10.5px; font-weight: 600; }

/* floating info cards (left column of each slide) */
.floats { position: absolute; inset: 0; pointer-events: none; }
.float {
  position: absolute; left: 2.5%; display: grid; gap: 1px; max-width: 26%;
  padding: 9px 12px; background: #fff; border-radius: 16px; box-shadow: 0 12px 28px rgba(120, 50, 20, 0.18);
}
.f1 { top: 9%; }
.f2 { top: 41%; }
.f3 { bottom: 9%; }
.k { font-size: 10.5px; color: var(--muted); }
.v { font-size: 12px; font-weight: 500; letter-spacing: -0.01em; line-height: 1.35; }

/* ---------- live animation: replays each time a slide becomes active ---------- */
/* hidden state resets only after the slide has slid out of view (0.75s) */
.rv, .float { opacity: 0; transform: translateY(14px); transition: opacity 0s linear 0.75s, transform 0s linear 0.75s; }
.float { transform: translateY(14px) scale(0.97); }
.chn.in .slide.on .rv {
  opacity: 1; transform: none;
  transition: opacity 0.5s ease calc(var(--i) * 0.14s + 0.3s), transform 0.65s cubic-bezier(0.2, 0.7, 0.2, 1) calc(var(--i) * 0.14s + 0.3s);
}
.chn.in .slide.on .float {
  opacity: 1; transform: none;
  transition: opacity 0.5s ease calc(0.7s + var(--n) * 0.2s), transform 0.7s cubic-bezier(0.3, 1.4, 0.5, 1) calc(0.7s + var(--n) * 0.2s);
  animation: bob 5s ease-in-out calc(1.6s + var(--n) * 0.3s) infinite;
}
.slide:not(.on) * { animation: none !important; }

/* ---------- tabs ---------- */
.tabs { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; min-width: 0; }
.tab {
  position: relative; display: block; width: 100%; overflow: hidden;
  padding: 20px 22px 24px; text-align: left; font: inherit; color: inherit;
  background: #fff; border: 1px solid var(--line); border-radius: 20px; cursor: pointer;
  transition: border-color 0.3s, background 0.3s, box-shadow 0.4s;
}
.tab:hover { border-color: rgba(255, 99, 56, 0.25); }
.tab.on { border-color: rgba(255, 99, 56, 0.35); background: #fff8f5; box-shadow: 0 16px 36px rgba(255, 99, 56, 0.1); }
.head { display: flex; align-items: center; gap: 14px; }
.icon {
  flex: none; display: grid; place-items: center; width: 42px; height: 42px;
  border-radius: 50%; color: #9a948d; background: #f4efec;
  transition: background 0.3s, color 0.3s, transform 0.5s cubic-bezier(0.3, 1.5, 0.5, 1);
}
.tab.on .icon { color: #fff; background: var(--orange); transform: scale(1.08); }
.name { flex: 1; min-width: 0; font-size: 17px; font-weight: 500; letter-spacing: -0.015em; line-height: 1.35; color: #8a857f; transition: color 0.3s; }
.tab:hover .name, .tab.on .name { color: var(--ink); }
.num { flex: none; font-size: 12px; font-weight: 600; letter-spacing: 0.04em; color: #c9c2bc; transition: color 0.3s; }
.tab.on .num { color: var(--orange); }

.desc { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.45s cubic-bezier(0.2, 0.7, 0.2, 1); }
.desc > span { overflow: hidden; display: block; }
.desc-text { display: block; padding: 12px 0 0 56px; font-size: 14.5px; line-height: 1.7; color: var(--muted); }
.chips { display: flex; flex-wrap: wrap; gap: 6px; padding: 12px 0 0 56px; }
.chip { display: inline-flex; align-items: center; gap: 6px; padding: 5px 11px; border-radius: 99px; background: #fff; border: 1px solid var(--line); font-size: 11.5px; font-weight: 500; color: var(--ink); }
.chip svg { color: var(--orange); }
.tab.on .desc { grid-template-rows: 1fr; }

.line { position: absolute; left: 0; right: 0; bottom: 0; height: 3px; background: rgba(255, 99, 56, 0.12); overflow: hidden; opacity: 0; transition: opacity 0.3s; }
.tab.on .line { opacity: 1; }
.fill { position: absolute; inset: 0; width: 0; background: var(--orange); border-radius: 0 3px 3px 0; }
.tab.on .fill { animation: fill var(--dur) linear forwards; }

/* ---------- entrance (runs once) + pause loops when off screen ---------- */
.chn:not(.in) .visual, .chn:not(.in) .tabs { opacity: 0; }
.chn.in .title span { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.chn.in .title .soft { animation-delay: 0.1s; }
.chn.in .visual { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.15s backwards; }
.chn.in .tabs { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 0.3s backwards; }
.chn:not(.live) .slide *, .chn:not(.live) .slide *::before { animation-play-state: paused; }

@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes fill { from { width: 0; } to { width: 100%; } }
@keyframes bob { 0%, 100% { translate: 0 0; } 50% { translate: 0 -7px; } }
@keyframes bounce { 0%, 60%, 100% { transform: translateY(0); opacity: 0.5; } 30% { transform: translateY(-4px); opacity: 1; } }
@keyframes halo { from { opacity: 0.8; transform: scale(1); } to { opacity: 0; transform: scale(1.9); } }
@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(34, 165, 90, 0.5); } 70%, 100% { box-shadow: 0 0 0 10px rgba(34, 165, 90, 0); } }
@keyframes wave { 0%, 100% { transform: scaleY(0.35); } 50% { transform: scaleY(1); } }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
@keyframes flash { 0%, 100% { background: #faf8f6; } 45% { background: #fff1ec; } }
@keyframes scan { from { top: 0; } to { top: calc(100% - 2px); } }

/* ---------- responsive ---------- */
@media (max-width: 960px) {
  .grid { grid-template-columns: minmax(0, 1fr); gap: 40px; }
  .visual { order: 0; }
}
@media (max-width: 760px) {
  .chn { padding: 72px 0; }
  .grid { width: calc(100% - 32px); margin-top: 40px; }
  .visual { border-radius: 22px; aspect-ratio: 4 / 4.6; }
  .mock { left: 4%; right: 4%; width: auto; }
  .float { display: none; }
  .tab { padding: 16px 16px 20px; border-radius: 18px; }
  .name { font-size: 15.5px; }
  .desc-text, .chips { padding-left: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .chn *, .chn *::before, .chn *::after { animation: none !important; transition: none !important; }
  .rv, .float { opacity: 1; transform: none; }
  .chn:not(.in) .visual, .chn:not(.in) .tabs { opacity: 1; }
  .tab.on .fill { width: 100%; }
}
</style>

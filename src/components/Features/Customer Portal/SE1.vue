<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "SecureBrandedAccessSection" });

const root = ref(null);
const shown = ref(false);
const seen = ref(false);
let io = null;
const timers = [];
let codeTimer = null;
let reduce = false;


const imgs = {
  cover: "/saptivo/images/features/data-security-and-encryption-technology-concept-2026-09-21-13-09-58-utc.webp",
  contacts: [
    "/saptivo/images/features/15.webp",
    "/saptivo/images/features/12.jpg",
    "/saptivo/images/features/10.jpg",
  ],
};
const coverOk = ref(true);
const contactOk = reactive([true, true, true]);

/* All names and details are SAMPLE data. */
const pills = ["One-click activation", "Password, magic link or Google", "Optional two-factor", "A login for every contact", "Automatic session timeout"];
const contacts = [
  { n: "Ravi Perera", i: "RP" },
  { n: "Nimal Fernando", i: "NF" },
  { n: "Dilani Wickrama", i: "DW" },
];

/* invitation */
const activated = ref(false);

/* sign in */
const methods = ["Password", "Magic link", "Google"];
const method = ref(0);
const twofa = ref(false);
const step = ref("form"); // form | code | done
const sent = ref(false);
const code = ref("");
const DIGITS = "482719";

function resetSoon() {
  timers.push(
    setTimeout(() => {
      step.value = "form";
      code.value = "";
      sent.value = false;
    }, 3600)
  );
}
function finish() {
  step.value = "done";
  resetSoon();
}
function startCode() {
  step.value = "code";
  code.value = "";
  if (reduce) {
    code.value = DIGITS;
    return finish();
  }
  let i = 0;
  codeTimer = setInterval(() => {
    i += 1;
    code.value = DIGITS.slice(0, i);
    if (i >= DIGITS.length) {
      clearInterval(codeTimer);
      timers.push(setTimeout(finish, 450));
    }
  }, 260);
}
function submit() {
  if (step.value !== "form") return;
  if (method.value === 1 && !sent.value) {
    sent.value = true;
    return;
  }
  if (twofa.value && method.value !== 2) return startCode();
  finish();
}
function pick(k) {
  method.value = k;
  sent.value = false;
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    seen.value = true;
    activated.value = true;
    return;
  }
  io = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting) return;
      shown.value = true;
      seen.value = true;
      io.disconnect();
      timers.push(setTimeout(() => (activated.value = true), 2200));
    },
    { threshold: 0.25 }
  );
  io.observe(root.value);
});
onBeforeUnmount(() => {
  if (io) io.disconnect();
  clearInterval(codeTimer);
  timers.forEach(clearTimeout);
});
</script>

<template>
  <section ref="root" class="hw" :class="{ in: shown }">
    <div class="wrap">
      <!-- text -->
      <div class="txt">
        <h2><span class="l1">Secure, branded</span> <span class="l2">access</span></h2>
        <p class="sub">
          Customers receive an invitation email and activate their account in one click. They sign in with a password, a magic link or Google, with optional two-factor authentication. Each contact at a company gets their own login, and sessions time out automatically.
        </p>
        <ul class="pills">
          <li v-for="(p, k) in pills" :key="p" :style="{ '--d': 0.5 + k * 0.1 + 's' }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>{{ p }}
          </li>
        </ul>
      </div>

      <!-- visual -->
      <div class="vis" :class="{ on: seen }">
        <!-- the invitation email -->
        <div class="mail" :class="{ ok: activated }">
          <span class="mi">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16v12H4zM4 7l8 6 8-6" /></svg>
          </span>
          <div>
            <small>Invitation email</small>
            <b>You're invited to the Harbour Hotel portal</b>
          </div>
          <button type="button" :disabled="activated" @click="activated = true">
            {{ activated ? "✓ Activated" : "Activate account" }}
          </button>
        </div>

        <!-- branded browser window -->
        <div class="win">
          <div class="bar">
            <i></i><i></i><i></i>
            <span class="url"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>portal.harbourhotel.lk</span>
          </div>

          <div class="body">
            <div class="cover">
              <img v-if="coverOk" :src="imgs.cover" alt="" loading="lazy" @error="coverOk = false" />
              <svg v-else class="fb" viewBox="0 0 200 380" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <defs>
                  <linearGradient id="sa-g" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="#7d6be6" />
                    <stop offset="1" stop-color="#a597ee" />
                  </linearGradient>
                </defs>
                <rect width="200" height="380" fill="url(#sa-g)" />
                <circle cx="150" cy="70" r="90" fill="#fff" opacity=".14" />
                <circle cx="30" cy="330" r="110" fill="#fff" opacity=".1" />
              </svg>
              <div class="shade"></div>
              <div class="brand"><span class="lg">H</span><b>Harbour Hotel</b><small>Your service portal</small></div>
            </div>

            <div class="form">
              <h4>Welcome back</h4>

              <!-- done -->
              <div v-if="step === 'done'" class="state done">
                <span class="tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg></span>
                <b>Signed in as Ravi</b>
                <small>Harbour Hotel · session ends after 15 min idle</small>
              </div>

              <!-- two-factor code -->
              <div v-else-if="step === 'code'" class="state">
                <small class="lab">Enter the 6-digit code</small>
                <div class="otp" aria-live="polite">
                  <span v-for="n in 6" :key="n" :class="{ f: code[n - 1] }">{{ code[n - 1] || "" }}</span>
                </div>
                <small>Sent to your authenticator app</small>
              </div>

              <!-- sign-in form -->
              <template v-else>
                <div class="seg" role="group" aria-label="Sign-in method">
                  <button v-for="(m, k) in methods" :key="m" type="button" :class="{ sel: method === k }" :aria-pressed="method === k" @click="pick(k)">{{ m }}</button>
                </div>

                <template v-if="method !== 2">
                  <label class="fld"><small>Email</small><span>ravi@harbourhotel.lk</span></label>
                  <label v-if="method === 0" class="fld"><small>Password</small><span class="pw">••••••••••</span></label>
                  <p v-else-if="sent" class="sentmsg">✓ Magic link sent. Check your inbox.</p>
                </template>
                <p v-else class="gnote">Use the Google account you were invited with.</p>

                <button type="button" class="go" :class="{ g: method === 2 }" @click="submit">
                  <span v-if="method === 2" class="gm" aria-hidden="true"></span>
                  {{ method === 2 ? "Continue with Google" : method === 1 ? (sent ? "Open the link" : "Send magic link") : "Sign in" }}
                </button>

                <label class="sw">
                  <button type="button" role="switch" :aria-checked="twofa" :class="{ on: twofa }" @click="twofa = !twofa"><i></i></button>
                  <span>Two-factor authentication <em>(optional)</em></span>
                </label>
              </template>
            </div>
          </div>
        </div>

        <!-- one login per contact -->
        <div class="who">
          <div class="avs">
            <span v-for="(c, k) in contacts" :key="c.n" class="av">
              <img v-if="contactOk[k]" :src="imgs.contacts[k]" alt="" @error="contactOk[k] = false" />
              <template v-else>{{ c.i }}</template>
            </span>
          </div>
          <b>Own login for every contact</b>
        </div>

        <!-- session timeout -->
        <div class="sess">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2.5 2M9 3h6" /></svg>
          <span>Sessions time out automatically</span>
        </div>
      </div>
    </div>

  </section>
</template>

<style scoped>
.hw {
  --ink: #14120f; --muted: #666b73; --line: #ece9f3;
  --lav: #e8e3ff; --lav-i: #7d6be6;
  --sky: #dcecfb; --sky-i: #3f87c7;
  --mint: #d3f0e1; --mint-i: #2f9c6b;
  --butter: #fff1c9; --butter-i: #a77d00;
  --rose: #fde3ea; --rose-i: #d8567f;
  position: relative;
  overflow: hidden;
  z-index: 1;
  margin-top: -48px;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: transparent;
  padding: 136px 16px 88px;
}
.wrap { position: relative; max-width: 1160px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: clamp(28px, 5vw, 64px); align-items: center; }

/* text */
.txt { opacity: 0; transform: translateY(20px); transition: opacity .8s ease, transform .8s ease; }
.in .txt { opacity: 1; transform: none; }
h2 { margin: 0; font-size: clamp(40px, 5vw, 68px); font-weight: 500; line-height: 1.06; letter-spacing: -0.04em; text-wrap: balance; }
h2 span { display: block; }
.hw h2 .l1 { color: #111111 !important; opacity: 1; }
.hw h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.sub { margin: 22px 0 0; max-width: 46ch; font-size: 16.5px; line-height: 1.75; color: var(--muted); }
.pills { list-style: none; margin: 28px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
.pills li { display: inline-flex; align-items: center; gap: 8px; padding: 8px 15px 8px 11px; border-radius: 99px; background: #fff; border: 1.5px solid var(--line); font-size: 12.5px; font-weight: 600; opacity: 0; transform: translateY(8px); }
.pills svg { width: 14px; height: 14px; padding: 3px; border-radius: 50%; background: var(--mint); color: var(--mint-i); box-sizing: content-box; }
.in .pills li { animation: up .6s cubic-bezier(.3, .8, .3, 1) both; animation-delay: var(--d); }
@keyframes up { to { opacity: 1; transform: none; } }

/* visual */
.vis { position: relative; padding: 38px 0 40px 22px; opacity: 0; transform: translateY(24px); transition: opacity .9s ease .2s, transform .9s cubic-bezier(.3, .8, .3, 1) .2s; }
.vis.on { opacity: 1; transform: none; }
.win { background: #fff; border-radius: 28px; overflow: hidden; box-shadow: 0 40px 80px rgba(60, 50, 120, .2), 0 0 0 1.5px var(--line); }
.bar { display: flex; align-items: center; gap: 7px; padding: 12px 16px; background: #f6f4ff; border-bottom: 1.5px solid var(--line); }
.bar i { width: 10px; height: 10px; border-radius: 50%; background: #ddd8f2; }
.url { display: inline-flex; align-items: center; gap: 7px; margin-left: 12px; padding: 5px 14px; border-radius: 99px; background: #fff; font-size: 11.5px; color: var(--muted); }
.url svg { width: 12px; height: 12px; color: var(--mint-i); }
.body { display: grid; grid-template-columns: 2fr 3fr; min-height: 400px; }

.cover { position: relative; overflow: hidden; background: var(--lav-i); }
.cover img, .cover .fb { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
.cover .shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(20, 18, 15, 0) 40%, rgba(20, 18, 15, .5) 100%); }
.brand { position: absolute; left: 20px; bottom: 20px; right: 20px; display: flex; flex-direction: column; gap: 2px; color: #fff; }
.lg { width: 38px; height: 38px; margin-bottom: 8px; border-radius: 13px; display: grid; place-items: center; background: #fff; color: var(--lav-i); font-size: 18px; font-weight: 700; }
.brand b { font-size: 16px; }
.brand small { font-size: 11.5px; opacity: .85; }

.form { padding: 26px 26px 22px; display: flex; flex-direction: column; gap: 12px; min-width: 0; }
h4 { margin: 0; font-size: 21px; font-weight: 600; letter-spacing: -.02em; }
.seg { display: flex; gap: 4px; padding: 4px; border-radius: 99px; background: #f1eff8; }
.seg button { flex: 1; padding: 8px 6px; border: 0; border-radius: 99px; background: transparent; font: inherit; font-size: 11.5px; font-weight: 600; color: var(--muted); cursor: pointer; transition: background .3s, color .3s, box-shadow .3s; white-space: nowrap; }
.seg button.sel { background: #fff; color: var(--ink); box-shadow: 0 4px 12px rgba(60, 50, 120, .14); }
.seg button:focus-visible, .go:focus-visible, .sw button:focus-visible, .mail button:focus-visible { outline: 2px solid var(--lav-i); outline-offset: 2px; }
.fld { display: block; padding: 9px 14px; border-radius: 14px; background: #f6f4ff; }
.fld small { display: block; font-size: 10px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--muted); }
.fld span { font-size: 13.5px; font-weight: 500; }
.fld .pw { letter-spacing: 2px; }
.sentmsg, .gnote { margin: 0; padding: 12px 14px; border-radius: 14px; font-size: 12.5px; line-height: 1.5; }
.sentmsg { background: var(--mint); color: var(--mint-i); font-weight: 600; }
.gnote { background: #f6f4ff; color: var(--muted); }
.go { display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 13px 18px; border: 0; border-radius: 99px; background: var(--ink); color: #fff; font: inherit; font-size: 13.5px; font-weight: 600; cursor: pointer; transition: transform .25s, box-shadow .25s; }
.go:hover { transform: translateY(-1px); box-shadow: 0 12px 24px -10px rgba(20, 18, 15, .5); }
.go.g { background: #fff; color: var(--ink); box-shadow: inset 0 0 0 1.5px var(--line); }
.gm { width: 18px; height: 18px; border-radius: 50%; background: conic-gradient(#ea4335 0 25%, #fbbc05 0 50%, #34a853 0 75%, #4285f4 0); -webkit-mask: radial-gradient(circle 5px, transparent 98%, #000 100%); mask: radial-gradient(circle 5px, transparent 98%, #000 100%); }
.sw { display: flex; align-items: center; gap: 10px; margin-top: 2px; font-size: 12px; color: var(--muted); cursor: pointer; }
.sw em { font-style: normal; color: #a3a6b4; }
.sw button { position: relative; flex: none; width: 38px; height: 22px; padding: 0; border: 0; border-radius: 99px; background: #d9d4ee; cursor: pointer; transition: background .3s; }
.sw button i { position: absolute; left: 3px; top: 3px; width: 16px; height: 16px; border-radius: 50%; background: #fff; box-shadow: 0 2px 6px rgba(0, 0, 0, .18); transition: transform .3s cubic-bezier(.3, 1.4, .5, 1); }
.sw button.on { background: var(--lav-i); }
.sw button.on i { transform: translateX(16px); }

.state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; text-align: center; animation: pop .5s cubic-bezier(.3, 1.3, .5, 1) both; }
@keyframes pop { from { opacity: 0; transform: scale(.94); } to { opacity: 1; transform: none; } }
.state small { font-size: 11.5px; color: var(--muted); }
.state .lab { font-size: 12.5px; font-weight: 600; color: var(--ink); }
.tick { width: 54px; height: 54px; border-radius: 50%; display: grid; place-items: center; background: var(--mint); color: var(--mint-i); }
.tick svg { width: 26px; height: 26px; }
.done b { font-size: 17px; }
.otp { display: flex; gap: 8px; }
.otp span { width: 38px; height: 46px; border-radius: 12px; display: grid; place-items: center; background: #f6f4ff; border: 1.5px solid transparent; font-size: 19px; font-weight: 700; transition: all .25s; }
.otp span.f { background: #fff; border-color: var(--lav-i); color: var(--lav-i); }

/* floating cards */
.mail { position: absolute; z-index: 2; left: -16px; top: 0; display: flex; align-items: center; gap: 12px; max-width: 360px; padding: 11px 12px 11px 11px; border-radius: 22px; background: #fff; box-shadow: 0 22px 44px rgba(60, 50, 120, .22); animation: bob 6s ease-in-out infinite; }
.mi { flex: none; width: 36px; height: 36px; border-radius: 12px; display: grid; place-items: center; background: var(--butter); color: var(--butter-i); transition: background .4s, color .4s; }
.mi svg { width: 18px; height: 18px; }
.mail.ok .mi { background: var(--mint); color: var(--mint-i); }
.mail small { display: block; font-size: 10px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--muted); }
.mail b { display: block; font-size: 12px; line-height: 1.35; }
.mail button { flex: none; padding: 8px 14px; border: 0; border-radius: 99px; background: var(--ink); color: #fff; font: inherit; font-size: 11.5px; font-weight: 700; cursor: pointer; white-space: nowrap; transition: background .3s; }
.mail button:disabled { background: var(--mint-i); cursor: default; }
.who { position: absolute; z-index: 2; left: 4px; bottom: 0; display: flex; align-items: center; gap: 12px; padding: 10px 16px 10px 10px; border-radius: 99px; background: #fff; box-shadow: 0 18px 38px rgba(60, 50, 120, .2); animation: bob 7s ease-in-out -2s infinite; }
.avs { display: flex; }
.av { width: 30px; height: 30px; margin-left: -8px; border-radius: 50%; overflow: hidden; display: grid; place-items: center; background: var(--ink); color: #fff; font-size: 10px; font-weight: 700; border: 2.5px solid #fff; }
.av:first-child { margin-left: 0; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; display: block; }
.who b { font-size: 12px; }
.sess { position: absolute; z-index: 2; right: -6px; bottom: 6px; display: inline-flex; align-items: center; gap: 9px; padding: 10px 16px; border-radius: 99px; background: var(--ink); color: #fff; font-size: 12px; font-weight: 600; box-shadow: 0 18px 38px rgba(20, 18, 15, .3); animation: bob 6.5s ease-in-out -4s infinite; }
.sess svg { width: 16px; height: 16px; color: #b8aef5; }
@keyframes bob { 50% { transform: translateY(-6px); } }

.note { position: relative; margin: 40px 0 0; text-align: center; font-size: 12px; color: #a3a6b4; }

@media (max-width: 960px) {
  .hw { padding-top: 104px; }
  .wrap { grid-template-columns: minmax(0, 1fr); }
  .vis { padding: 40px 0 44px; }
  .mail { left: 8px; }
}
@media (max-width: 640px) {
  .hw { padding: 88px 16px 64px; }
  .body { grid-template-columns: minmax(0, 1fr); }
  .cover { display: none; }
  .mail { position: relative; left: auto; top: auto; margin: 0 0 14px; max-width: none; animation: none; }
  .vis { padding: 0 0 8px; }
  .who, .sess { position: relative; left: auto; right: auto; bottom: auto; animation: none; margin-top: 12px; width: fit-content; }
}
@media (prefers-reduced-motion: reduce) {
  .txt, .vis { opacity: 1; transform: none; transition: none; }
  .pills li { opacity: 1; transform: none; animation: none !important; }
  .mail, .who, .sess, .state { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>

<template>
  <section class="sf" aria-labelledby="sf-title">
    <div class="sf-wrap">
      <div class="sf-content">
        <h2 id="sf-title" class="sf-title">
          <span>Why CRM data</span>
          <span class="sf-muted">security matters.</span>
        </h2>
        <p class="sf-intro">A CRM contains customer names, phone numbers, prices and the deals your competitors would love to see. A leaked spreadsheet or a shared password can cost you customers and trust. Saptivo's layered controls make sure that every person sees only what they need, and that every action leaves a trace.</p>

        <ul class="sf-list">
          <li v-for="(item, i) in items" :key="item.q" :class="{ on: open === i }">
            <h3 class="sf-question">
              <button
                :id="`sf-button-${i}`"
                type="button"
                :aria-expanded="open === i"
                :aria-controls="`sf-panel-${i}`"
                @click="open = open === i ? -1 : i"
              >
                <span>{{ item.q }}</span>
                <span class="sf-plus" aria-hidden="true"></span>
              </button>
            </h3>
            <div :id="`sf-panel-${i}`" class="sf-answer" role="region" :aria-labelledby="`sf-button-${i}`">
              <div><p>{{ item.a }}</p></div>
            </div>
          </li>
        </ul>

        <a class="sf-cta" :href="contactHref">
          Ask our team about security
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M5 12h14m-6-6 6 6-6 6" />
          </svg>
        </a>
      </div>

      <div class="sf-visual">
        <img :src="securityImage" alt="Secure server infrastructure" loading="lazy" />
        <div class="sf-image-shade" aria-hidden="true"></div>
        <div class="sf-image-caption" aria-hidden="true">
          <span class="sf-status"><span class="sf-dot"></span> SECURITY FIRST</span>
          <span class="sf-caption-title">Your data.<br />Your control.</span>
          <span class="sf-caption-sub">Protected at every step.</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'SecurityFaqSection' })

const open = ref(0)
// Replace this URL with a local asset if preferred.
const securityImage = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=85'
// Change this to your actual contact route.
const contactHref = '/contact'

const items = [
  {
    q: 'Who can see my data?',
    a: 'Only the users you create, and only to the extent their role allows.',
  },
  {
    q: 'Can I export my data?',
    a: 'Yes. Authorised users can export records to Excel or CSV at any time.',
  },
  {
    q: 'What happens if an employee leaves?',
    a: 'Deactivate their user in one click. Their records stay in Saptivo and can be reassigned to another team member.',
  },
  {
    q: 'Does Saptivo support two-factor authentication?',
    a: 'Yes, with one-time codes by SMS at login and by email for sensitive changes.',
  },
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800&display=swap');

.sf {
  --ink: #18202b;
  --muted: #68717e;
  --line: rgba(30, 43, 58, .12);
  --accent: #33485d;
  --ease: cubic-bezier(.2,.8,.2,1);
  padding: 100px 0;
  background: #fff;
  color: var(--ink);
  font-family: 'Urbanist', system-ui, sans-serif;
}
.sf *, .sf *::before, .sf *::after { box-sizing: border-box; }
.sf-wrap {
  max-width: 1360px;
  margin: 0 auto;
  padding: 0 clamp(20px, 4vw, 48px);
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(0, .92fr);
  gap: clamp(44px, 6vw, 90px);
  align-items: center;
}
.sf-content { min-width: 0; }
.sf-title {
  margin: 0 0 22px;
  font-size: clamp(38px, 4vw, 58px);
  line-height: 1.09;
  letter-spacing: -.045em;
  font-weight: 600;
}
.sf-title span { display: block; }
.sf-muted { color: #7e8793; }
.sf-intro {
  margin: 0 0 30px;
  max-width: 610px;
  color: #626c79;
  font-size: 16px;
  line-height: 1.75;
  font-weight: 500;
}
.sf-list { list-style: none; display: grid; gap: 12px; margin: 0; padding: 0; }
.sf-list li {
  overflow: hidden;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 17px;
  transition: background .3s, border-color .3s, box-shadow .3s;
}
.sf-list li.on { background: #f6f8fa; border-color: rgba(51,72,93,.24); box-shadow: 0 9px 25px rgba(31,47,64,.045); }
.sf-question { margin: 0; }
.sf-question button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  width: 100%;
  padding: 19px 21px;
  border: 0;
  background: transparent;
  text-align: left;
  font-family: inherit;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.35;
  color: var(--ink);
  cursor: pointer;
}
.sf-question button:focus-visible { outline: 2px solid var(--accent); outline-offset: -3px; }
.sf-plus { position: relative; flex: 0 0 30px; width: 30px; height: 30px; border-radius: 50%; background: #edf1f4; transition: background .3s; }
.sf-plus::before, .sf-plus::after { content: ''; position: absolute; top: 50%; left: 50%; width: 12px; height: 2px; border-radius: 2px; background: #33485d; transform: translate(-50%, -50%); transition: transform .3s, background .3s; }
.sf-plus::after { transform: translate(-50%, -50%) rotate(90deg); }
.sf-list li.on .sf-plus { background: #33485d; }
.sf-list li.on .sf-plus::before, .sf-list li.on .sf-plus::after { background: #fff; }
.sf-list li.on .sf-plus::after { transform: translate(-50%, -50%) rotate(0); }
.sf-answer { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .45s var(--ease); }
.sf-answer > div { overflow: hidden; }
.sf-answer p { margin: 0; padding: 0 21px 21px; color: #697380; font-size: 15.5px; font-weight: 500; line-height: 1.65; opacity: 0; transition: opacity .25s; }
.sf-list li.on .sf-answer { grid-template-rows: 1fr; }
.sf-list li.on .sf-answer p { opacity: 1; transition-delay: .1s; }
.sf-cta {
  display: inline-flex;
  align-items: center;
  gap: 18px;
  margin-top: 29px;
  padding: 15px 21px;
  border-radius: 100px;
  background: #33485d;
  color: #fff;
  text-decoration: none;
  font-size: 15px;
  font-weight: 700;
  transition: background .25s, transform .25s;
}
.sf-cta:hover { background: #24384d; transform: translateY(-2px); }
.sf-cta:focus-visible { outline: 3px solid #93a9c0; outline-offset: 3px; }
.sf-visual { position: relative; align-self: stretch; min-height: 590px; border-radius: 28px; overflow: hidden; background: #1a2735; }
.sf-visual img { display: block; position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; }
.sf-image-shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(8,17,27,.06) 25%, rgba(8,17,27,.22) 53%, rgba(8,17,27,.87) 100%); pointer-events: none; }
.sf-image-caption { position: absolute; left: clamp(24px, 3vw, 42px); right: 24px; bottom: 36px; color: #fff; display: flex; flex-direction: column; align-items: flex-start; }
.sf-status { display: inline-flex; align-items: center; gap: 8px; padding: 9px 13px; border: 1px solid rgba(255,255,255,.25); background: rgba(255,255,255,.12); border-radius: 100px; font-size: 11px; font-weight: 800; letter-spacing: .12em; }
.sf-dot { width: 7px; height: 7px; border-radius: 50%; background: #83d5b2; }
.sf-caption-title { margin-top: 18px; font-size: clamp(35px, 3.5vw, 51px); line-height: 1.06; font-weight: 700; letter-spacing: -.045em; }
.sf-caption-sub { margin-top: 13px; font-size: 15px; font-weight: 500; color: rgba(255,255,255,.85); }
@media (max-width: 900px) {
  .sf { padding: 70px 0; }
  .sf-wrap { grid-template-columns: 1fr; gap: 36px; }
  .sf-visual { min-height: 440px; }
}
@media (max-width: 600px) {
  .sf { padding: 54px 0; }
  .sf-title { font-size: clamp(34px, 9vw, 44px); }
  .sf-intro { font-size: 15px; }
  .sf-question button { padding: 17px; font-size: 16px; }
  .sf-answer p { padding: 0 17px 18px; font-size: 14.5px; }
  .sf-visual { min-height: 360px; border-radius: 22px; }
  .sf-caption-title { font-size: 38px; }
}
@media (prefers-reduced-motion: reduce) {
  .sf-list li, .sf-answer, .sf-answer p, .sf-plus, .sf-plus::before, .sf-plus::after, .sf-cta { transition: none; }
}
</style>

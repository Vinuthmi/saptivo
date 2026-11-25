<template>
  <main class="rs" :class="{ 'rs-js': mounted, 'rs-in': revealed }">
    <!-- ================= HERO ================= -->
    <section class="rs-hero" aria-labelledby="rs-title">
      <div class="rs-hero-wrap">
        <h1 id="rs-title">
          Apply to become a
          <span class="rs-accent">Saptivo reseller</span>
        </h1>
        <p class="rs-lead">
          Join the businesses growing recurring revenue with Saptivo. Tell us about your company and the clients you
          serve, and our partner team will contact you to discuss tiers, white-label options and next steps.
        </p>
      </div>
    </section>

    <!-- ================= FORM ================= -->
    <section ref="formWrap" class="rs-form-sec" aria-label="Reseller application">
      <div class="rs-card">
        <Transition name="rs-swap" mode="out-in">
          <!-- thank-you state -->
          <div v-if="sent" key="done" class="rs-done" role="status" aria-live="polite">
            <span class="rs-done-ico" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>
            </span>
            <h2 ref="doneTitle" class="rs-done-h" tabindex="-1">Thank you.</h2>
            <p class="rs-done-p">Our partner team will be in touch shortly.</p>
          </div>

          <!-- form -->
          <form v-else key="form" class="rs-form" novalidate @submit.prevent="onSubmit">
            <div class="rs-grid">
              <div v-for="f in fields" :key="f.k" class="rs-field" :class="{ 'rs-full': f.full, 'rs-bad': errors[f.k] }">
                <label :for="'rs-' + f.k" class="rs-label">{{ f.label }}<abbr v-if="f.req" title="required" class="rs-req">*</abbr></label>

                <select v-if="f.options" :id="'rs-' + f.k" v-model="form[f.k]" class="rs-input rs-select" :autocomplete="f.auto">
                  <option value="">Select</option>
                  <option v-for="o in f.options" :key="o" :value="o">{{ o }}</option>
                </select>

                <textarea v-else-if="f.type === 'textarea'" :id="'rs-' + f.k" v-model="form[f.k]" class="rs-input rs-area" rows="5" :placeholder="f.ph"></textarea>

                <input
                  v-else
                  :id="'rs-' + f.k"
                  v-model="form[f.k]"
                  class="rs-input"
                  :type="f.type"
                  :inputmode="f.mode"
                  :autocomplete="f.auto"
                  :placeholder="f.ph"
                  :aria-invalid="errors[f.k] ? 'true' : 'false'"
                  :aria-describedby="errors[f.k] ? 'rs-err-' + f.k : null"
                />

                <p v-if="errors[f.k]" :id="'rs-err-' + f.k" class="rs-err">{{ errors[f.k] }}</p>
              </div>

              <!-- honeypot: hidden from people, bots tend to fill it -->
              <div class="rs-hp" aria-hidden="true">
                <label>Leave this empty<input v-model="form.hp" type="text" tabindex="-1" autocomplete="off" /></label>
              </div>
            </div>

            <p v-if="formError" class="rs-formerr" role="alert">{{ formError }}</p>

            <div class="rs-actions">
              <button type="submit" class="rs-btn" :disabled="submitting">
                <span v-if="!submitting">Submit application</span>
                <span v-else class="rs-wait"><i></i><i></i><i></i></span>
              </button>
            </div>
          </form>
        </Transition>
      </div>
    </section>

    <!-- ================= WHAT HAPPENS NEXT ================= -->
    <section class="rs-next" aria-labelledby="rs-next-title">
      <div class="rs-next-wrap">
        <h2 id="rs-next-title" class="rs-h2">What happens next</h2>
        <ol class="rs-steps">
          <li v-for="(s, i) in steps" :key="s.id" class="rs-step" :style="{ '--i': i }">
            <img v-if="!failed[s.id]" class="rs-step-img" :src="s.img" alt="" loading="lazy" decoding="async" draggable="false" @error="failed[s.id] = true" />
            <span class="rs-step-shade" aria-hidden="true"></span>
            <span class="rs-step-ico" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" v-html="s.icon"></svg>
            </span>
            <span class="rs-step-n" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
            <p class="rs-step-t">{{ s.text }}</p>
          </li>
        </ol>
      </div>
    </section>
  </main>
</template>

<script setup>
defineOptions({ name: 'ResellerSignupPage' })
/**
 * ResellerSignupPage.vue — hero, application form and "What happens next" for the reseller signup page.
 * Hero follows the ResellerHero format; the step cards follow the light grey card style of the other sections.
 *
 * Form: validates in the browser, then either POSTs JSON to `submit-url` (if you pass one) or only emits `submit`
 * with the form data, and shows the thank-you message. Vue 3, <script setup>, SSR safe.
 */
import { ref, reactive, nextTick, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  /** Optional endpoint that receives the application as JSON (POST). Leave empty to handle the `submit` event yourself. */
  submitUrl: { type: String, default: '' },
})
const emit = defineEmits(['submit'])

const fields = [
  { k: 'name', label: 'Full name', type: 'text', req: true, auto: 'name', ph: 'Your full name' },
  { k: 'company', label: 'Company name', type: 'text', req: true, auto: 'organization', ph: 'Your company' },
  { k: 'country', label: 'Country', type: 'text', req: true, auto: 'country-name', ph: 'Country' },
  { k: 'phone', label: 'Phone or WhatsApp', type: 'tel', mode: 'tel', req: true, auto: 'tel', ph: '+94 77 123 4567' },
  { k: 'email', label: 'Email', type: 'email', mode: 'email', req: true, auto: 'email', ph: 'you@company.com' },
  { k: 'website', label: 'Website', type: 'url', mode: 'url', auto: 'url', ph: 'https://' },
  {
    k: 'type', label: 'Type of business', auto: 'off',
    options: ['IT firm or managed services', 'Consultancy', 'Web or software agency', 'Phone systems or telecom', 'Other'],
  },
  { k: 'clients', label: 'Approximate number of clients', auto: 'off', options: ['1 – 10', '11 – 50', '51 – 200', 'More than 200'] },
  { k: 'message', label: 'Message', type: 'textarea', full: true, ph: 'Tell us about your business and the clients you serve' },
]

const steps = [
  {
    id: 'review', img: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1000&q=80&auto=format&fit=crop', text: 'Our partner team reviews your application',
    icon: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>',
  },
  {
    id: 'call', img: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1000&q=80&auto=format&fit=crop', text: 'We schedule a call to understand your business and clients',
    icon: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  },
  {
    id: 'terms', img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1000&q=80&auto=format&fit=crop', text: 'You receive partner terms, your tier and access to the partner hub',
    icon: '<circle cx="12" cy="9" r="6"/><path d="m8.5 13.5-1.5 7.5 5-3 5 3-1.5-7.5"/>',
  },
]

const form = reactive({ name: '', company: '', country: '', phone: '', email: '', website: '', type: '', clients: '', message: '', hp: '' })
const errors = reactive({})
const failed = reactive({})
const sent = ref(false)
const submitting = ref(false)
const formError = ref('')
const doneTitle = ref(null)
const formWrap = ref(null)

const mounted = ref(false)
const revealed = ref(false)
let io = null

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k])
  if (!form.name.trim()) errors.name = 'Please enter your full name.'
  if (!form.company.trim()) errors.company = 'Please enter your company name.'
  if (!form.country.trim()) errors.country = 'Please enter your country.'
  if (!form.phone.trim()) errors.phone = 'Please enter a phone or WhatsApp number.'
  else if (form.phone.replace(/\D/g, '').length < 7) errors.phone = 'That number looks too short.'
  if (!form.email.trim()) errors.email = 'Please enter your email.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'Please enter a valid email address.'
  if (form.website.trim() && !/^(https?:\/\/)?[^\s.]+\.[^\s]{2,}$/i.test(form.website.trim())) errors.website = 'Please enter a valid website address.'
  return Object.keys(errors).length === 0
}

async function onSubmit() {
  formError.value = ''
  if (!validate()) {
    await nextTick()
    const first = formWrap.value?.querySelector('.rs-bad .rs-input')
    first?.focus()
    return
  }
  if (form.hp) { sent.value = true; return } // honeypot filled: pretend success
  const { hp, ...payload } = form
  submitting.value = true
  try {
    if (props.submitUrl) {
      const res = await fetch(props.submitUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('bad status')
    }
    emit('submit', { ...payload })
    sent.value = true
    await nextTick()
    doneTitle.value?.focus({ preventScroll: true })
    formWrap.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  } catch (e) {
    formError.value = 'Something went wrong while sending your application. Please try again.'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  mounted.value = true
  if (!('IntersectionObserver' in window)) { revealed.value = true; return }
  io = new IntersectionObserver(([en]) => {
    if (en.isIntersecting) { revealed.value = true; io.disconnect() }
  }, { threshold: 0.1 })
  io.observe(formWrap.value)
})
onBeforeUnmount(() => io?.disconnect())
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&display=swap');

.rs, .rs *, .rs *::before, .rs *::after { box-sizing: border-box; }
.rs { --ink: #17191d; --navy: #0f172a; --orange: #ff6b16; background: #fff; color: var(--ink); font-family: 'Urbanist', system-ui, sans-serif; }

/* ---------- hero (same format as ResellerHero) ---------- */
.rs-hero { position: relative; overflow: clip; text-align: center; background: #fff; }
.rs-hero-wrap { display: flex; flex-direction: column; align-items: center; width: min(980px, calc(100% - 40px)); margin: 0 auto; padding: clamp(104px, 11vw, 150px) 0 clamp(36px, 5vw, 64px); }
.rs-hero h1 { margin: 0; font-size: clamp(38px, 5vw, 68px); font-weight: 600; line-height: 1.08; letter-spacing: -0.05em; color: #0a0a0a; text-wrap: balance; animation: rs-rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
.rs-accent { display: block; color: #6b6866; }
.rs-lead { max-width: 760px; margin: 26px 0 0; font-size: clamp(15px, 1.25vw, 17px); line-height: 1.75; color: #4a4d55; text-wrap: pretty; animation: rs-rise 0.9s 0.1s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
@keyframes rs-rise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }

/* ---------- form card ---------- */
.rs-form-sec { padding: 0 clamp(10px, 1.3vw, 24px) clamp(48px, 7vw, 96px); }
.rs-card {
  max-width: 880px; margin: 0 auto; padding: clamp(24px, 4vw, 52px);
  background: #fff; border: 1px solid #ececec; border-radius: clamp(24px, 2.8vw, 36px);
  box-shadow: 0 40px 80px -48px rgba(15, 23, 42, 0.28);
  animation: rs-rise 0.9s 0.2s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
.rs-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 22px 18px; }
.rs-field { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.rs-full { grid-column: 1 / -1; }
.rs-label { font-size: 14px; font-weight: 600; color: #0a0a0a; }
.rs-req { margin-left: 3px; color: var(--orange); text-decoration: none; }

.rs-input {
  width: 100%; min-height: 54px; padding: 0 18px; border: 1.5px solid transparent; border-radius: 16px;
  background: #f4f4f5; color: #0a0a0a; font: inherit; font-size: 16px; outline: none;
  transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
}
.rs-input::placeholder { color: #9a9ca3; }
.rs-input:hover { background: #efeff1; }
.rs-input:focus { background: #fff; border-color: var(--navy); box-shadow: 0 0 0 4px rgba(255, 107, 22, 0.16); }
.rs-area { min-height: 140px; padding: 16px 18px; line-height: 1.55; resize: vertical; }
.rs-select {
  appearance: none; -webkit-appearance: none; padding-right: 46px; cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='%23525866' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m4 6 4 4 4-4'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 18px center;
}
.rs-bad .rs-input { border-color: #d92d3a; background: #fff7f7; }
.rs-bad .rs-input:focus { box-shadow: 0 0 0 4px rgba(217, 45, 58, 0.14); }
.rs-err { margin: 0; font-size: 13px; font-weight: 500; color: #c4252f; }
.rs-formerr { margin: 20px 0 0; padding: 14px 16px; border-radius: 14px; background: #fff1f1; color: #b42330; font-size: 14px; font-weight: 500; }
.rs-hp { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }

.rs-actions { margin-top: 28px; display: flex; }
.rs-btn {
  display: inline-flex; align-items: center; justify-content: center; min-width: 220px; min-height: 56px; padding: 0 34px; border: 0; border-radius: 999px;
  background: var(--navy); color: #fff !important; font: inherit; font-size: clamp(15px, 1.1vw, 16.5px); font-weight: 600; cursor: pointer;
  transition: background 0.3s, transform 0.3s, opacity 0.2s;
}
.rs-btn:hover { background: var(--orange); transform: translateY(-2px); }
.rs-btn:focus-visible { outline: 2px solid var(--orange); outline-offset: 3px; }
.rs-btn:disabled { opacity: 0.8; cursor: progress; transform: none; background: var(--navy); }
.rs-wait { display: inline-flex; gap: 6px; }
.rs-wait i { width: 8px; height: 8px; border-radius: 50%; background: #fff; animation: rs-dot 1s infinite ease-in-out; }
.rs-wait i:nth-child(2) { animation-delay: 0.15s; } .rs-wait i:nth-child(3) { animation-delay: 0.3s; }
@keyframes rs-dot { 0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); } 40% { opacity: 1; transform: scale(1); } }

/* thank-you */
.rs-done { display: flex; flex-direction: column; align-items: center; text-align: center; padding: clamp(20px, 4vw, 48px) 0; }
.rs-done-ico { display: grid; place-items: center; width: 76px; height: 76px; border-radius: 50%; background: #e8f6ee; color: #17924f; animation: rs-pop 0.6s cubic-bezier(0.2, 0.9, 0.3, 1.3) both; }
.rs-done-ico svg { width: 34px; height: 34px; }
.rs-done-h { margin: 22px 0 0; font-size: clamp(32px, 3.6vw, 48px); font-weight: 600; letter-spacing: -0.04em; line-height: 1.1; color: #0a0a0a; outline: none; }
.rs-done-p { margin: 12px 0 0; font-size: clamp(16px, 1.4vw, 19px); line-height: 1.6; color: #4a4d55; }
@keyframes rs-pop { from { transform: scale(0.5); opacity: 0; } }
.rs-swap-enter-active { transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); }
.rs-swap-leave-active { transition: opacity 0.2s ease; }
.rs-swap-enter-from { opacity: 0; transform: translateY(12px); }
.rs-swap-leave-to { opacity: 0; }

/* ---------- what happens next ---------- */
.rs-next-wrap { max-width: 1320px; margin: 0 auto; padding: clamp(40px, 6vw, 88px) clamp(10px, 1.3vw, 24px) clamp(56px, 8vw, 110px); }
.rs-h2 { margin: 0 0 clamp(24px, 3vw, 40px); font-family: 'Urbanist', 'Urbanist Placeholder', sans-serif; font-size: 54px; font-weight: 600; line-height: 65px; letter-spacing: -1px; color: #0a0a0a; }
.rs-steps { margin: 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
.rs-step {
  position: relative; display: flex; flex-direction: column; justify-content: space-between; min-height: clamp(260px, 22vw, 320px);
  padding: clamp(22px, 2.6vw, 38px); border-radius: clamp(22px, 2.4vw, 32px); background: linear-gradient(150deg, #4a5667, #14243a);
  isolation: isolate; overflow: hidden; transition: transform 0.4s ease;
}
.rs-step:hover { transform: translateY(-3px); }
.rs-step-img { position: absolute; inset: 0; z-index: 0; width: 100%; height: 100%; object-fit: cover; filter: saturate(1.08); transition: scale 1.2s cubic-bezier(0.2, 0.8, 0.2, 1); }
.rs-step:hover .rs-step-img { scale: 1.05; }
.rs-step-shade { position: absolute; inset: 0; z-index: 1; background: linear-gradient(180deg, rgba(10, 14, 20, 0.25) 0%, rgba(10, 14, 20, 0.12) 35%, rgba(10, 14, 20, 0.6) 65%, rgba(10, 14, 20, 0.86) 100%); }
.rs-js .rs-step { opacity: 0; translate: 0 26px; }
.rs-in .rs-step { opacity: 1; translate: 0 0; transition: opacity 0.8s ease, translate 0.9s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.3s ease, transform 0.4s ease; transition-delay: calc(var(--i) * 0.1s), calc(var(--i) * 0.1s), 0s, 0s; }
.rs-step-ico { position: relative; z-index: 2; display: grid; place-items: center; width: 52px; height: 52px; border-radius: 16px; background: #fff; color: #14243a; box-shadow: 0 6px 18px -10px rgba(20, 36, 58, 0.4); }
.rs-step-ico svg { width: 26px; height: 26px; }
.rs-step-n { position: absolute; top: clamp(22px, 2.6vw, 38px); right: clamp(22px, 2.6vw, 38px); font-size: 15px; font-weight: 700; letter-spacing: 0.04em; color: #fff; text-shadow: 0 1px 8px rgba(0,0,0,.4); z-index: 2; }
.rs-step-t { position: relative; z-index: 2; margin: 0; max-width: 13em; font-size: clamp(22px, 2vw, 29px); font-weight: 600; line-height: 1.15; letter-spacing: -0.03em; color: #fff; text-wrap: balance; }

/* keep text colours when the site's global styles recolour headings and paragraphs */
.rs .rs-hero h1 { color: #0a0a0a !important; }
.rs .rs-hero .rs-accent { color: #6b6866 !important; }
.rs .rs-step .rs-step-t { color: #fff !important; -webkit-text-fill-color: #fff !important; }
.rs .rs-h2, .rs .rs-done-h { color: #0a0a0a !important; }

/* ---------- responsive ---------- */
@media (max-width: 900px) {
  .rs-steps { grid-template-columns: minmax(0, 1fr); }
  .rs-step { min-height: 200px; }
  .rs-h2 { font-size: 40px; line-height: 1.2; }
}
@media (max-width: 680px) {
  .rs-grid { grid-template-columns: minmax(0, 1fr); gap: 18px; }
  .rs-btn { width: 100%; }
  .rs-hero-wrap { width: calc(100% - 32px); }
}
@media (max-width: 520px) { .rs-h2 { font-size: 32px; } }
@media (prefers-reduced-motion: reduce) {
  .rs-hero h1, .rs-lead, .rs-card, .rs-done-ico, .rs-wait i { animation: none; }
  .rs-js .rs-step { opacity: 1; translate: 0 0; }
  .rs *, .rs-swap-enter-active, .rs-swap-leave-active { transition-duration: 0.01s !important; transition-delay: 0s !important; }
}
</style>
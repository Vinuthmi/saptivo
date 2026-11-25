<template>
  <main class="contact-page">
    <section class="contact-intro" aria-labelledby="contact-title">
      <span class="eyebrow"><span></span> WE’RE HERE TO HELP</span>
      <h1 id="contact-title">Talk to <span>our team.</span></h1>
      <p class="intro-copy">
        Questions about features, pricing or moving from another CRM? Want to become a partner?
        Get in touch and the right person will reply.
      </p>
      <a class="intro-link" href="#contact-form">
        Tell us what you need
        <span aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
        </span>
      </a>
    </section>

    <section class="contact-visual" aria-label="Talk with the Saptivo team">
      <img
        v-if="imgOk"
        :src="heroImage"
        alt="A business team working together in a modern office"
        width="1320"
        height="620"
        fetchpriority="high"
        @error="imgOk = false"
      />
      <div v-else class="visual-fallback" aria-hidden="true"></div>
      <div class="visual-shade"></div>
      <div class="visual-copy visual-copy-left">
        <span>LET’S TALK</span>
        <p>Your business growth<br />starts here.</p>
      </div>
      <div class="visual-copy visual-copy-right">
        <span>HERE TO HELP</span>
        <p>Get guidance on the right<br />solution for your business.</p>
      </div>
      <div class="visual-pill" aria-hidden="true"><span>Connect</span><i></i><span>Plan</span><i></i><span>Grow</span></div>
    </section>

    <section class="contact-details" aria-label="Contact details">
      <div class="section-heading">
        <span class="eyebrow"><span></span> GET IN TOUCH</span>
        <h2>Contact our team</h2>
        <p>Reach us directly. We’ll make sure your message gets to the right person.</p>
      </div>
      <div class="details-grid">
        <a class="detail-card" href="tel:0112000569">
          <span class="detail-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>
          </span>
          <div class="detail-text"><small>PHONE</small><strong>0112 000 569</strong></div>
          <span class="detail-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8" /></svg></span>
        </a>

        <a class="detail-card" href="mailto:info@weblook.com">
          <span class="detail-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M4 6h16v12H4zM4 7l8 6 8-6" /></svg>
          </span>
          <div class="detail-text"><small>EMAIL</small><strong>info@weblook.com</strong></div>
          <span class="detail-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8" /></svg></span>
        </a>

        <div class="detail-card address-card">
          <span class="detail-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
          </span>
          <div class="detail-text">
            <small>VISIT OUR OFFICE</small>
            <strong>Weblook International (Pvt) Ltd.</strong>
            <address>207/23 Dharmapala Mawatha, Colombo 07, Sri Lanka</address>
          </div>
          <a class="detail-arrow" :href="mapsLink" target="_blank" rel="noopener noreferrer" aria-label="Open office address in Google Maps">
            <svg viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8" /></svg>
          </a>
        </div>
      </div>
    </section>

    <section id="contact-form" class="contact-form-section" aria-labelledby="form-title">
      <div class="form-heading">
        <span class="eyebrow"><span></span> START A CONVERSATION</span>
        <h2 id="form-title">Let’s talk about your business.</h2>
        <p>Tell us what you need and we’ll help you find the right solution.</p>
      </div>
      <div class="form-map-card">
        <form class="contact-form" @submit.prevent="sendMessage">
          <div class="form-fields">
            <label>
              <span>Full name <b>*</b></span>
              <input v-model.trim="form.name" autocomplete="name" name="name" placeholder="Your full name" required />
            </label>
            <label>
              <span>Company</span>
              <input v-model.trim="form.company" autocomplete="organization" name="company" placeholder="Your company" />
            </label>
            <label>
              <span>Phone or WhatsApp</span>
              <input v-model.trim="form.phone" autocomplete="tel" name="phone" type="tel" placeholder="Your phone number" />
            </label>
            <label>
              <span>Email <b>*</b></span>
              <input v-model.trim="form.email" autocomplete="email" name="email" type="email" placeholder="you@company.com" required />
            </label>
            <label class="field-wide">
              <span>I’m interested in <b>*</b></span>
              <select v-model="form.interest" name="interest" required>
                <option disabled value="">Choose a team</option>
                <option value="Sales">Sales</option>
                <option value="Support">Support</option>
                <option value="Partnership">Partnership</option>
              </select>
            </label>
            <label class="field-wide">
              <span>Message <b>*</b></span>
              <textarea v-model.trim="form.message" name="message" rows="5" placeholder="How can we help?" required></textarea>
            </label>
          </div>
          <div class="form-submit-row">
            <p>Your details will only be used to respond to your enquiry.</p>
            <button type="submit">
              Send message
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" /></svg>
            </button>
          </div>
        </form>

        <div class="map-panel">
          <iframe
            title="Map showing Weblook International in Colombo, Sri Lanka"
            :src="mapEmbedUrl"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen
          ></iframe>
          <div class="map-address">
            <span class="map-pin" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
            </span>
            <div>
              <small>VISIT OUR OFFICE</small>
              <strong>Weblook International (Pvt) Ltd.</strong>
              <address>207/23 Dharmapala Mawatha, Colombo 07, Sri Lanka</address>
            </div>
            <a :href="mapsLink" target="_blank" rel="noopener noreferrer">
              Get directions
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" /></svg>
            </a>
          </div>
        </div>
      </div>
    </section>

    <section class="team-section" aria-labelledby="team-title">
      <div class="team-heading">
        <span class="eyebrow"><span></span> THE RIGHT PEOPLE</span>
        <h2 id="team-title">Which team should I contact?</h2>
      </div>
      <div class="team-grid">
        <article v-for="(t, i) in teams" :key="t.name" class="team-card">
          <span class="team-number">0{{ i + 1 }}</span>
          <span class="team-symbol" aria-hidden="true"><svg viewBox="0 0 24 24"><path :d="t.icon" /></svg></span>
          <h3>{{ t.name }}</h3>
          <p>{{ t.text }}</p>
          <a :href="`mailto:info@weblook.com?subject=${encodeURIComponent(t.subject)}`">
            {{ t.cta }}
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </a>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue'

defineOptions({ name: 'ContactPage' })


const heroImage = '/saptivo/images/features/smiling-woman-answers-landline-phone-in-office-2026-09-24-08-00-48-utc.webp'
const imgOk = ref(true)

const officeAddress = 'Weblook International (Pvt) Ltd., 207/23 Dharmapala Mawatha, Colombo 07, Sri Lanka'
const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(officeAddress)}`
const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(officeAddress)}&output=embed`

const teams = [
  { name: 'Sales', text: 'Pricing, plans, demos and moving from another CRM.', cta: 'Talk to sales', subject: 'Sales enquiry', icon: 'M3 17l6-6 4 4 8-8M15 7h6v6' },
  { name: 'Support', text: 'Help for existing Saptivo customers.', cta: 'Contact support', subject: 'Customer support', icon: 'M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v5H5a1 1 0 0 1-1-1zM20 14h-3v5h2a1 1 0 0 0 1-1zM17 19c0 1.5-2 2-5 2' },
  { name: 'Partnerships', text: 'Our reseller and white-label program.', cta: 'Explore partnerships', subject: 'Partnership enquiry', icon: 'M12 5v14M5 12h14' },
]

const form = reactive({ name: '', company: '', phone: '', email: '', interest: '', message: '' })

function sendMessage() {
  const subject = encodeURIComponent(`${form.interest} enquiry from ${form.name}`)
  const body = encodeURIComponent([
    `Name: ${form.name}`,
    `Company: ${form.company || 'Not provided'}`,
    `Phone or WhatsApp: ${form.phone || 'Not provided'}`,
    `Email: ${form.email}`,
    `Interested in: ${form.interest}`,
    '',
    form.message,
  ].join('\n'))
  window.location.href = `mailto:info@weblook.com?subject=${subject}&body=${body}`
}
</script>

<style scoped>
.contact-page {
  --contact-ink: #23232b;
  --contact-muted: #777783;
  --contact-line: #e8e7e9;
  --contact-accent: #ff6818;
  color: var(--contact-ink);
  overflow: hidden;
  padding: 130px 24px 120px;
  font-family: 'Urbanist', 'Poppins', system-ui, sans-serif;
}
.contact-page *, .contact-page *::before, .contact-page *::after { box-sizing: border-box; }
.contact-page svg { fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; flex: none; }
.contact-intro, .contact-visual, .contact-details, .contact-form-section, .team-section { width: min(1320px, 100%); margin-inline: auto; }
.contact-intro { text-align: center; padding: 10px 20px 52px; }
.eyebrow { display: inline-flex; align-items: center; gap: 9px; color: #777782; font-size: 11px; font-weight: 800; letter-spacing: .15em; }
.eyebrow > span { width: 7px; height: 7px; border-radius: 50%; background: var(--contact-accent); }
h1, h2, h3, p { margin-top: 0; }
.contact-intro h1 { margin: 18px auto 14px; font-size: clamp(46px, 7vw, 82px); line-height: .98; letter-spacing: -.065em; font-weight: 800; }
.contact-intro h1 span { color: #111; }
.intro-copy { max-width: 670px; margin: 0 auto; color: var(--contact-muted); font-size: 17px; line-height: 1.65; }
.intro-link { display: inline-flex; align-items: center; gap: 10px; margin-top: 25px; color: var(--contact-ink); font-size: 14px; font-weight: 700; text-decoration: none; }
.intro-link span { display: grid; width: 30px; height: 30px; place-items: center; border: 1px solid var(--contact-line); border-radius: 50%; transition: background .2s, color .2s; }
.intro-link span svg { width: 15px; height: 15px; }
.intro-link:hover span { background: var(--contact-ink); color: #fff; }

.contact-visual { height: clamp(330px, 48vw, 620px); position: relative; overflow: hidden; border-radius: 32px; background: #d1b9a3; }
.contact-visual > img { width: 100%; height: 100%; object-fit: cover; object-position: center 42%; display: block; }
.visual-fallback { position: absolute; inset: 0; background: radial-gradient(520px 360px at 18% 20%, #f3e3d6, transparent 70%), linear-gradient(135deg, #d9c1ac, #b99f8c); }
.visual-shade { position: absolute; inset: 0; background: linear-gradient(90deg, rgb(25 23 25 / 52%), transparent 44%, transparent 68%, rgb(25 23 25 / 35%)); }
.visual-copy { position: absolute; color: #111; text-shadow: 0 2px 14px rgb(255 255 255 / 28%); }
.visual-copy-left { top: 11%; left: 6%; }
.visual-copy-right { right: 6%; bottom: 13%; text-align: right; }
.visual-copy-left > span, .visual-copy-right > span { color: #fff; text-shadow: 0 2px 14px rgb(0 0 0 / 30%); }
.visual-copy-left p { color: #fff; text-shadow: 0 2px 12px rgb(0 0 0 / 35%); }
.visual-copy-right p { color: #fff; text-shadow: 0 2px 12px rgb(0 0 0 / 35%); }
.visual-copy > span { font-size: clamp(32px, 5vw, 66px); line-height: .95; letter-spacing: -.055em; font-weight: 800; }
.visual-copy p { margin: 10px 0 0; font-size: clamp(14px, 1.4vw, 18px); font-weight: 600; line-height: 1.4; }
.visual-pill { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 18px; padding: 18px 30px 15px; border-radius: 22px 22px 0 0; background: white; color: #282830; font-size: 13px; font-weight: 700; }
.visual-pill i { height: 4px; width: 4px; border-radius: 50%; background: var(--contact-accent); }

.contact-details { padding: 115px 0 0; }
.section-heading h2, .form-heading h2, .team-heading h2 { margin: 12px 0 9px; font-size: clamp(34px, 4vw, 52px); letter-spacing: -.055em; line-height: 1.05; font-weight: 800; }
.section-heading > p, .form-heading > p { margin: 0; color: var(--contact-muted); font-size: 16px; }
.details-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 32px; }
.detail-card { min-width: 0; display: flex; align-items: center; gap: 15px; padding: 25px 22px; border: 1px solid var(--contact-line); border-radius: 20px; background: #fff; color: inherit; text-decoration: none; transition: border-color .2s, transform .2s, box-shadow .2s; }
.detail-card:hover { border-color: #d5d2d5; transform: translateY(-2px); box-shadow: 0 12px 30px rgb(35 35 43 / 6%); }
.detail-icon { display: grid; flex: 0 0 46px; width: 46px; height: 46px; place-items: center; border-radius: 14px; background: #f8f4f3; color: var(--contact-accent); }
.detail-icon svg { width: 21px; height: 21px; }
.detail-text { min-width: 0; display: grid; gap: 4px; }
.detail-card small, .map-address small { color: var(--contact-muted); font-size: 10px; letter-spacing: .12em; font-weight: 800; }
.detail-card strong { font-size: 17px; line-height: 1.25; overflow-wrap: anywhere; }
.detail-arrow { display: grid; place-items: center; margin-left: auto; color: #9999a1; text-decoration: none; transition: color .2s; }
.detail-arrow svg { width: 19px; height: 19px; }
.detail-card:hover .detail-arrow, a.detail-arrow:hover { color: var(--contact-accent); }
.detail-card address, .map-address address { color: var(--contact-muted); font-size: 13px; font-style: normal; line-height: 1.5; }

.contact-form-section { padding-top: 120px; scroll-margin-top: 90px; }
.form-heading { margin-bottom: 32px; text-align: center; }
.form-map-card { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, .85fr); gap: 22px; padding: 22px; border: 1px solid var(--contact-line); border-radius: 28px; background: #faf9f9; }
.contact-form { padding: 15px 12px 15px 10px; min-width: 0; }
.form-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 21px 16px; }
.form-fields label { display: grid; gap: 8px; color: #363640; font-size: 13px; font-weight: 700; }
.form-fields label > span b { color: var(--contact-accent); }
.field-wide { grid-column: 1 / -1; }
.form-fields input, .form-fields select, .form-fields textarea { width: 100%; border: 1px solid transparent; border-radius: 12px; outline: none; background: #f0eff0; padding: 14px 15px; color: var(--contact-ink); font: inherit; font-size: 14px; transition: border-color .2s, background .2s; }
.form-fields input, .form-fields select { min-height: 50px; }
.form-fields textarea { min-height: 132px; resize: vertical; }
.form-fields input::placeholder, .form-fields textarea::placeholder { color: #9b9ba3; }
.form-fields input:focus, .form-fields select:focus, .form-fields textarea:focus { border-color: #d4b4b6; background: white; }
.form-submit-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-top: 22px; }
.form-submit-row p { margin: 0; color: var(--contact-muted); font-size: 12px; }
.form-submit-row button { display: inline-flex; align-items: center; gap: 20px; border: 0; border-radius: 999px; padding: 15px 21px; background: var(--contact-ink); color: white; font: inherit; font-size: 14px; font-weight: 700; cursor: pointer; transition: background .2s, transform .2s; }
.form-submit-row button svg { width: 16px; height: 16px; }
.form-submit-row button:hover { background: var(--contact-accent); transform: translateY(-1px); }
.form-submit-row button:focus-visible, .contact-page a:focus-visible { outline: 2px solid var(--contact-accent); outline-offset: 3px; }

.map-panel { min-height: 520px; position: relative; overflow: hidden; border-radius: 21px; background: #e7e7e5; }
.map-panel iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
.map-address { position: absolute; right: 16px; bottom: 16px; left: 16px; display: grid; grid-template-columns: auto 1fr; gap: 12px; padding: 17px; border: 1px solid rgb(255 255 255 / 75%); border-radius: 16px; background: rgb(255 255 255 / 95%); box-shadow: 0 8px 26px rgb(20 20 30 / 12%); }
.map-pin { display: grid; width: 38px; height: 38px; place-items: center; border-radius: 12px; background: #f8f1f1; color: var(--contact-accent); }
.map-pin svg { width: 20px; height: 20px; }
.map-address > div { display: grid; gap: 3px; }
.map-address strong { font-size: 15px; }
.map-address address { font-size: 12px; }
.map-address > a { grid-column: 2; display: inline-flex; align-items: center; gap: 6px; color: var(--contact-accent); font-size: 13px; font-weight: 800; text-decoration: none; }
.map-address > a svg { width: 14px; height: 14px; }

.team-section { padding-top: 120px; }
.team-heading { margin-bottom: 30px; }
.team-heading h2 { max-width: 660px; margin-bottom: 0; }
.team-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.team-card { min-height: 250px; position: relative; display: flex; flex-direction: column; align-items: flex-start; padding: 28px; border: 1px solid var(--contact-line); border-radius: 22px; background: white; }
.team-number { color: #aaa9b0; font-size: 12px; font-weight: 800; letter-spacing: .08em; }
.team-symbol { position: absolute; top: 22px; right: 24px; display: grid; width: 42px; height: 42px; place-items: center; border-radius: 14px; background: #f8f4f3; color: var(--contact-accent); }
.team-symbol svg { width: 20px; height: 20px; }
.team-card h3 { margin: 35px 0 7px; font-size: 25px; letter-spacing: -.04em; }
.team-card p { max-width: 300px; margin: 0; color: var(--contact-muted); font-size: 15px; line-height: 1.55; }
.team-card a { display: inline-flex; align-items: center; gap: 9px; margin-top: auto; padding-top: 24px; color: var(--contact-ink); font-size: 13px; font-weight: 800; text-decoration: none; }
.team-card a svg { width: 17px; height: 17px; color: var(--contact-accent); transition: transform .2s; }
.team-card a:hover svg { transform: translateX(3px); }

@media (max-width: 980px) {
  .contact-page { padding-inline: 20px; }
  .details-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .address-card { grid-column: 1 / -1; }
  .form-map-card { grid-template-columns: 1fr; }
  .map-panel { min-height: 400px; }
  .team-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .team-card:last-child { grid-column: 1 / -1; }
  .form-submit-row { align-items: flex-start; }
  .form-submit-row p { max-width: 55%; }
}
@media (max-width: 620px) {
  .contact-page { padding: 96px 16px 75px; }
  .contact-intro { padding: 7px 3px 34px; }
  .contact-intro h1 { font-size: clamp(43px, 13vw, 62px); }
  .intro-copy { font-size: 15px; }
  .contact-visual { height: 390px; border-radius: 23px; }
  .contact-visual > img { object-position: 53% center; }
  .visual-shade { background: linear-gradient(180deg, rgb(20 20 22 / 43%), transparent 50%, rgb(20 20 22 / 38%)); }
  .visual-copy-left { top: 8%; left: 7%; }
  .visual-copy-right { right: 7%; bottom: 16%; }
  .visual-copy > span { font-size: 39px; }
  .visual-copy p { font-size: 13px; }
  .visual-pill { gap: 12px; padding: 14px 21px 12px; font-size: 11px; }
  .contact-details, .contact-form-section, .team-section { padding-top: 78px; }
  .section-heading h2, .form-heading h2, .team-heading h2 { font-size: 36px; }
  .section-heading > p, .form-heading > p { font-size: 14px; }
  .details-grid, .team-grid { grid-template-columns: 1fr; gap: 11px; }
  .address-card { grid-column: auto; }
  .team-card:last-child { grid-column: auto; }
  .detail-card { padding: 19px 16px; }
  .detail-card strong { font-size: 15px; }
  .detail-card address { font-size: 12px; }
  .form-heading { text-align: left; }
  .form-map-card { gap: 18px; padding: 12px; border-radius: 21px; }
  .contact-form { padding: 10px 5px 8px; }
  .form-fields { grid-template-columns: 1fr; gap: 16px; }
  .field-wide { grid-column: auto; }
  .form-submit-row { align-items: flex-start; flex-direction: column; }
  .form-submit-row button { width: 100%; justify-content: space-between; }
  .map-panel { min-height: 390px; }
  .map-address { right: 10px; bottom: 10px; left: 10px; padding: 13px; }
  .team-heading h2 { margin-top: 12px; }
  .team-card { min-height: 220px; padding: 23px; }
}
@media (max-width: 390px) {
  .contact-page { padding-inline: 13px; }
  .contact-intro { padding-inline: 0; }
  .contact-intro h1 { font-size: clamp(39px, 12vw, 47px); }
  .contact-visual { height: 350px; border-radius: 19px; }
  .visual-copy > span { font-size: 34px; }
  .visual-copy p { font-size: 12px; }
  .visual-copy-left { left: 6%; }
  .visual-copy-right { right: 6%; }
  .visual-pill { gap: 9px; padding: 12px 15px 10px; font-size: 10px; }
  .form-map-card { padding: 9px; }
  .map-panel { min-height: 350px; }
  .map-address { right: 8px; bottom: 8px; left: 8px; gap: 8px; padding: 11px; }
  .map-address strong { font-size: 13px; }
  .map-address address { font-size: 11px; }
}
@media (prefers-reduced-motion: reduce) {
  .contact-page * { transition-duration: 0s !important; }
}
</style>

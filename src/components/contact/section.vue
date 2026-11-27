<template>
  <main class="contact-page">

    <!-- HERO SECTION -->

    <section class="contact-hero" aria-labelledby="contact-title">
      <img
        v-if="imgOk"
        :src="heroImage"
        alt="A customer service representative answering a phone call"
        width="1320"
        height="620"
        fetchpriority="high"
        @error="imgOk = false"
      />

      <div
        v-else
        class="hero-fallback"
        aria-hidden="true"
      ></div>

      <div class="hero-shade" aria-hidden="true"></div>

      <div class="hero-copy">
        <h2 id="contact-title">
          Great things start with a conversation.
        </h2>

        <p>
          Whether you’re exploring Saptivo, ready to transform
          your business or looking to grow with us as a partner,
          we’re here to help you take the next step.
        </p>
      </div>
    </section>

    <!-- CONTACT INFORMATION CARDS -->

    <section class="info-section" aria-label="Contact details">
      <div class="info-grid">

        <!-- CARD 1: PHONE NUMBERS -->

        <div class="info-card info-contact-card">

          <span class="info-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path
                d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"
              />
            </svg>
          </span>

          <div class="info-body info-rows">

            <div class="info-phone-group">

              <small>PHONE</small>

              <div class="phone-list">

                <a
                  v-for="phone in phones"
                  :key="phone.country"
                  :href="phone.href"
                  :aria-label="phone.country + ': ' + phone.number"
                  class="phone-item"
                >
                  <img
                    :src="phone.flag"
                    :alt="phone.country + ' flag'"
                    class="country-flag"
                    width="30"
                    height="20"
                    loading="lazy"
                    draggable="false"
                  />

                  <strong>{{ phone.number }}</strong>
                </a>

              </div>
            </div>

          </div>
        </div>

        <!-- CARD 2: OFFICE ADDRESS -->

        <div class="info-card">

          <span class="info-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path
                d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"
              />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
          </span>

          <a
            class="info-go"
            :href="mapsLink"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open office address in Google Maps"
          >
            <svg viewBox="0 0 24 24">
              <path d="M7 17L17 7M9 7h8v8" />
            </svg>
          </a>

          <div class="info-body">

            <small>ADDRESS</small>

            <strong>
              Weblook International (Pvt) Ltd.
            </strong>

            <address>
              207/23 Dharmapala Mawatha, Colombo 07, Sri Lanka
            </address>

          </div>
        </div>

        <!-- CARD 3: PARTNERSHIP -->

        <div class="info-card info-card-q">

          <span class="info-quote" aria-hidden="true">
            &ldquo;
          </span>

          <p>
            Want to become a partner? Get in touch and
            the right person will reply.
          </p>

        </div>

      </div>
    </section>

    <!-- CONTACT FORM AND GOOGLE MAP -->

    <section
      id="contact-form"
      class="contact-form-section"
      aria-labelledby="form-title"
    >

      <div class="form-heading">

        <h2 id="form-title">
          Let’s talk <em>about your business.</em>
        </h2>

        <p>
          Tell us what you need and we’ll help you
          find the right solution.
        </p>

      </div>

      <div class="form-map-card">

        <!-- CONTACT FORM -->

        <form
          class="contact-form"
          @submit.prevent="sendMessage"
        >

          <div class="form-fields">

            <label>
              <span>Full name <b>*</b></span>

              <input
                v-model.trim="form.name"
                autocomplete="name"
                name="name"
                placeholder="Your full name"
                required
              />
            </label>

            <label>
              <span>Company</span>

              <input
                v-model.trim="form.company"
                autocomplete="organization"
                name="company"
                placeholder="Your company"
              />
            </label>

            <label>
              <span>Phone or WhatsApp</span>

              <input
                v-model.trim="form.phone"
                autocomplete="tel"
                name="phone"
                type="tel"
                placeholder="Your phone number"
              />
            </label>

            <label>
              <span>Email <b>*</b></span>

              <input
                v-model.trim="form.email"
                autocomplete="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                required
              />
            </label>

            <label class="field-wide">

              <span>I’m interested in <b>*</b></span>

              <select
                v-model="form.interest"
                name="interest"
                required
              >
                <option disabled value="">
                  Choose a team
                </option>

                <option value="Sales">
                  Sales
                </option>

                <option value="Support">
                  Support
                </option>

                <option value="Partnership">
                  Partnership
                </option>
              </select>

            </label>

            <label class="field-wide">

              <span>Message <b>*</b></span>

              <textarea
                v-model.trim="form.message"
                name="message"
                rows="5"
                placeholder="How can we help?"
                required
              ></textarea>

            </label>

          </div>

          <div class="form-submit-row">

            <p>
              Your details will only be used to
              respond to your enquiry.
            </p>

            <button type="submit">

              Send message

              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>

            </button>

          </div>

        </form>

        <!-- GOOGLE MAP -->

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

              <svg viewBox="0 0 24 24">
                <path
                  d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"
                />
                <circle cx="12" cy="10" r="2.5" />
              </svg>

            </span>

            <div>

              <small>VISIT OUR OFFICE</small>

              <strong>
                Weblook International (Pvt) Ltd.
              </strong>

              <address>
                207/23 Dharmapala Mawatha,
                Colombo 07, Sri Lanka
              </address>

            </div>

            <a
              :href="mapsLink"
              target="_blank"
              rel="noopener noreferrer"
            >

              Get directions

              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>

            </a>

          </div>

        </div>

      </div>

    </section>

    <!-- CONTACT OUR TEAMS -->

    <section
      class="team-section"
      aria-labelledby="team-title"
    >

      <div class="team-heading">

        <h2 id="team-title">
          Which team <em>should I contact?</em>
        </h2>

      </div>

      <div class="team-grid">

        <article
          v-for="t in teams"
          :key="t.name"
          class="team-card"
        >

          <img
            v-if="t.image && !teamImgFailed[t.name]"
            class="team-img"
            :src="t.image"
            alt=""
            loading="lazy"
            decoding="async"
            draggable="false"
            @error="teamImgFailed[t.name] = true"
          />

          <span class="team-shade" aria-hidden="true"></span>

          <div class="team-body">

            <h3>{{ t.name }}</h3>

            <p>{{ t.text }}</p>

            <a
              :href="`mailto:info@weblook.com?subject=${encodeURIComponent(t.subject)}`"
            >

              {{ t.cta }}

            </a>

          </div>

        </article>

      </div>

    </section>

  </main>
</template>

<script setup>
import { reactive, ref } from 'vue'

defineOptions({
  name: 'ContactPage'
})

/* =========================================
   HERO IMAGE
========================================= */

const heroImage =
  '/saptivo/images/features/smiling-woman-answers-landline-phone-in-office-2026-09-24-08-00-48-utc.webp'

const imgOk = ref(true)

/* =========================================
   INTERNATIONAL CONTACT NUMBERS
========================================= */

const phones = [
  {
    country: 'Sri Lanka',
    flag: 'https://flagcdn.com/w80/lk.png',
    number: '+94 11 200 0569',
    href: 'tel:+94112000569'
  },
  {
    country: 'Australia',
    flag: 'https://flagcdn.com/w80/au.png',
    number: '+61 2 8880 0333',
    href: 'tel:+61288800333'
  },
  {
    country: 'Canada',
    flag: 'https://flagcdn.com/w80/ca.png',
    number: '+1 403 800 0111',
    href: 'tel:+14038000111'
  }
]

/* =========================================
   OFFICE ADDRESS AND GOOGLE MAP
========================================= */

const officeAddress =
  'Weblook International (Pvt) Ltd., 207/23 Dharmapala Mawatha, Colombo 07, Sri Lanka'

const mapsLink =
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(officeAddress)}`

const mapEmbedUrl =
  `https://maps.google.com/maps?q=${encodeURIComponent(officeAddress)}&output=embed`

/* =========================================
   CONTACT TEAMS
========================================= */

/* Replace these image paths with your own photos */
const teamImgFailed = reactive({})

const teams = [
  {
    name: 'Sales',
    text: 'Pricing, plans, demos and moving from another CRM.',
    cta: 'Talk to sales',
    subject: 'Sales enquiry',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80&auto=format&fit=crop'
  },
  {
    name: 'Support',
    text: 'Help for existing Saptivo customers.',
    cta: 'Contact support',
    subject: 'Customer support',
    image: '/saptivo/images/features/smiling-woman-answers-landline-phone-in-office-2026-09-24-08-00-48-utc.webp'
  },
  {
    name: 'Partnerships',
    text: 'Our reseller and white-label program.',
    cta: 'Explore partnerships',
    subject: 'Partnership enquiry',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80&auto=format&fit=crop'
  }
]

/* =========================================
   CONTACT FORM
========================================= */

const form = reactive({
  name: '',
  company: '',
  phone: '',
  email: '',
  interest: '',
  message: ''
})

function sendMessage() {
  const subject = encodeURIComponent(
    `${form.interest} enquiry from ${form.name}`
  )

  const body = encodeURIComponent([
    `Name: ${form.name}`,
    `Company: ${form.company || 'Not provided'}`,
    `Phone or WhatsApp: ${form.phone || 'Not provided'}`,
    `Email: ${form.email}`,
    `Interested in: ${form.interest}`,
    '',
    form.message
  ].join('\n'))

  window.location.href =
    `mailto:info@weblook.com?subject=${subject}&body=${body}`
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800&display=swap');

/* =========================================
   BASE STYLES
========================================= */

.contact-page {
  --contact-ink: #23232b;
  --contact-muted: #777783;
  --contact-line: #e8e7e9;
  --contact-accent: #ff6818;

  color: var(--contact-ink);
  overflow: hidden;

  padding: 0 24px 120px;

  font-family:
    'Urbanist',
    'Poppins',
    system-ui,
    sans-serif;
}

.contact-page *,
.contact-page *::before,
.contact-page *::after {
  box-sizing: border-box;
}

.contact-page svg {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  flex: none;
}

.contact-hero,
.info-section,
.contact-form-section,
.team-section {
  width: min(1320px, 100%);
  margin-inline: auto;
}

h1,
h2,
h3,
p {
  margin-top: 0;
}

/* =========================================
   HERO SECTION
========================================= */

.contact-hero {
  position: relative;
  isolation: isolate;

  display: flex;
  align-items: flex-end;

  min-height: clamp(460px, 42vw, 580px);

  overflow: hidden;

  border-radius: clamp(24px, 2.6vw, 36px);

  background: linear-gradient(
    150deg,
    #4a5667,
    #14243a
  );
}

.contact-hero > img {
  position: absolute;
  inset: 0;
  z-index: 0;

  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;
  object-position: center 42%;

  filter: saturate(1.08);

  transition:
    scale 1.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.contact-hero:hover > img {
  scale: 1.04;
}

.hero-fallback {
  position: absolute;
  inset: 0;
  z-index: 0;

  background: linear-gradient(
    150deg,
    #4a5667,
    #14243a
  );
}

.hero-shade {
  position: absolute;
  inset: 0;
  z-index: 1;

  background: linear-gradient(
    180deg,
    rgba(10, 14, 20, 0.22) 0%,
    rgba(10, 14, 20, 0.14) 32%,
    rgba(10, 14, 20, 0.62) 62%,
    rgba(10, 14, 20, 0.88) 100%
  );
}

.hero-copy {
  position: relative;
  z-index: 2;

  max-width: 860px;

  padding: clamp(22px, 2.8vw, 40px);

  color: #ffffff;
}

.hero-copy h2 {
  margin: 0;

  color: #ffffff;

  font-size: clamp(36px, 4.6vw, 66px);
  font-weight: 600;
  line-height: 1.04;
  letter-spacing: -0.035em;

  text-wrap: balance;
}

.contact-page .contact-hero .hero-copy h2,
.contact-page .contact-hero .hero-copy p {
  color: #ffffff !important;
  -webkit-text-fill-color: #ffffff !important;
}

.hero-copy p {
  max-width: 640px;

  margin: 18px 0 0;

  color: #ffffff;

  font-size: clamp(16px, 1.5vw, 21px);
  font-weight: 500;
  line-height: 1.5;

  text-wrap: pretty;
}

/* =========================================
   CONTACT INFORMATION CARDS
========================================= */

.info-section {
  padding-top: 20px;
}

.info-grid {
  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 20px;
}

.info-card {
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  min-height: 270px;

  gap: 28px;

  padding: 26px;

  border-radius: 26px;

  background: #f3f3f3;
  color: var(--contact-ink);
}

.info-icon {
  display: grid;
  place-items: center;

  flex-shrink: 0;

  width: 52px;
  height: 52px;

  border-radius: 16px;

  background: #ffffff;
  color: var(--contact-ink);
}

.info-icon svg {
  width: 22px;
  height: 22px;
}

.info-body {
  display: grid;

  gap: 6px;

  min-width: 0;
}

.info-body small,
.info-row small {
  color: var(--contact-muted);

  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.info-body strong,
.info-row strong {
  font-size: clamp(20px, 1.9vw, 26px);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.035em;

  overflow-wrap: anywhere;
}

.info-body address {
  color: var(--contact-muted);

  font-size: 15px;
  font-style: normal;
  line-height: 1.5;
}

.info-rows {
  gap: 18px;
}

.info-row {
  display: grid;

  gap: 4px;

  color: inherit;
  text-decoration: none;
}

.info-row:hover strong {
  color: var(--contact-accent);
}

.info-row strong {
  transition: color 0.2s;
}

/* =========================================
   INTERNATIONAL PHONE NUMBERS AND FLAGS
========================================= */

.info-contact-card {
  gap: 20px;
}

.info-phone-group {
  display: flex;
  flex-direction: column;

  gap: 18px;
}

.phone-list {
  display: flex;
  flex-direction: column;

  gap: 22px;
}

.phone-item {
  display: flex;
  align-items: center;

  gap: 12px;

  width: fit-content;
  max-width: 100%;

  color: var(--contact-ink);
  text-decoration: none;
}

.country-flag {
  display: block;

  flex-shrink: 0;

  width: 30px;
  height: 20px;

  object-fit: contain;
  object-position: center;

  border-radius: 3px;
}

.phone-item strong {
  font-family: 'Urbanist', sans-serif;

  font-size: clamp(18px, 1.6vw, 23px);
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.025em;

  white-space: nowrap;

  color: var(--contact-ink);
}

.info-contact-card .info-rows {
  gap: 20px;
}

.info-contact-card .info-row strong {
  font-size: clamp(20px, 1.8vw, 25px);
}

/* =========================================
   ADDRESS CARD
========================================= */

.info-go {
  position: absolute;

  top: 26px;
  right: 26px;

  display: grid;
  place-items: center;

  width: 40px;
  height: 40px;

  border-radius: 50%;

  background: #ffffff;
  color: var(--contact-ink);

  text-decoration: none;

  transition:
    background 0.2s,
    color 0.2s;
}

.info-go svg {
  width: 17px;
  height: 17px;
}

.info-go:hover {
  background: var(--contact-accent);
  color: #ffffff;
}

/* =========================================
   PARTNERSHIP CARD
========================================= */

.info-card-q {
  justify-content: flex-start;

  gap: 12px;

  border: 1px solid var(--contact-line);

  background: #ffffff;
}

.info-quote {
  height: 30px;

  color: #111111;

  font-size: 64px;
  font-weight: 800;
  line-height: 0.7;
}

.info-card-q p {
  max-width: 380px;

  margin: 0;

  color: #111111;

  font-size: clamp(19px, 1.7vw, 24px);
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: -0.02em;
}

/* =========================================
   CONTACT FORM SECTION
========================================= */

.contact-form-section {
  padding-top: 120px;

  scroll-margin-top: 90px;
}

.form-heading {
  margin-bottom: 36px;

  text-align: center;
}

.form-map-card {
  display: grid;

  grid-template-columns:
    minmax(0, 1.15fr)
    minmax(0, 0.85fr);

  gap: 22px;

  padding: 22px;

  border: 1px solid var(--contact-line);
  border-radius: 28px;

  background: #faf9f9;
}

.contact-form {
  min-width: 0;

  padding: 15px 12px 15px 10px;
}

.form-fields {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 21px 16px;
}

.form-fields label {
  display: grid;

  gap: 8px;

  color: #363640;

  font-size: 13px;
  font-weight: 700;
}

.form-fields label > span b {
  color: var(--contact-accent);
}

.field-wide {
  grid-column: 1 / -1;
}

.form-fields input,
.form-fields select,
.form-fields textarea {
  width: 100%;

  padding: 14px 15px;

  border: 1px solid transparent;
  border-radius: 12px;

  outline: none;

  background: #f0eff0;
  color: var(--contact-ink);

  font: inherit;
  font-size: 14px;

  transition:
    border-color 0.2s,
    background 0.2s;
}

.form-fields input,
.form-fields select {
  min-height: 50px;
}

.form-fields textarea {
  min-height: 132px;

  resize: vertical;
}

.form-fields input::placeholder,
.form-fields textarea::placeholder {
  color: #9b9ba3;
}

.form-fields input:focus,
.form-fields select:focus,
.form-fields textarea:focus {
  border-color: #d4b4b6;

  background: #ffffff;
}

/* =========================================
   FORM SUBMIT BUTTON
========================================= */

.form-submit-row {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 16px;

  margin-top: 22px;
}

.form-submit-row p {
  margin: 0;

  color: var(--contact-muted);

  font-size: 12px;
}

.form-submit-row button {
  display: inline-flex;
  align-items: center;

  gap: 20px;

  padding: 15px 21px;

  border: 0;
  border-radius: 999px;

  background: var(--contact-ink);
  color: #ffffff;

  font: inherit;
  font-size: 14px;
  font-weight: 700;

  cursor: pointer;

  transition:
    background 0.2s,
    transform 0.2s;
}

.form-submit-row button svg {
  width: 16px;
  height: 16px;
}

.form-submit-row button:hover {
  background: var(--contact-accent);

  transform: translateY(-1px);
}

.form-submit-row button:focus-visible,
.contact-page a:focus-visible {
  outline: 2px solid var(--contact-accent);
  outline-offset: 3px;
}

/* =========================================
   GOOGLE MAP
========================================= */

.map-panel {
  position: relative;

  min-height: 520px;

  overflow: hidden;

  border-radius: 21px;

  background: #e7e7e5;
}

.map-panel iframe {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  border: 0;
}

.map-address {
  position: absolute;

  right: 16px;
  bottom: 16px;
  left: 16px;

  display: grid;

  grid-template-columns: auto 1fr;

  gap: 12px;

  padding: 17px;

  border: 1px solid rgb(255 255 255 / 75%);
  border-radius: 16px;

  background: rgb(255 255 255 / 95%);

  box-shadow:
    0 8px 26px rgb(20 20 30 / 12%);
}

.map-pin {
  display: grid;
  place-items: center;

  width: 38px;
  height: 38px;

  border-radius: 12px;

  background: #f8f1f1;
  color: var(--contact-accent);
}

.map-pin svg {
  width: 20px;
  height: 20px;
}

.map-address > div {
  display: grid;

  gap: 3px;
}

.map-address strong {
  font-size: 15px;
}

.map-address address {
  font-size: 12px;
}

.map-address > a {
  grid-column: 2;

  display: inline-flex;
  align-items: center;

  gap: 6px;

  color: var(--contact-accent);

  font-size: 13px;
  font-weight: 800;

  text-decoration: none;
}

.map-address > a svg {
  width: 14px;
  height: 14px;
}

/* =========================================
   CONTACT TEAM SECTION
========================================= */

.team-section {
  padding-top: 120px;
}

.team-heading {
  margin-bottom: 36px;
}

.team-heading h2 {
  margin-bottom: 0;
}

/* section H2 style (same as the other pages) */
.contact-page .form-heading h2,
.contact-page .team-heading h2 {
  max-width: 20em;
  margin: 0;
  padding-bottom: 0.12em;

  color: #0f172a !important;

  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(30px, 4vw, 58px);
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: -0.055em;

  text-wrap: balance;
}

.contact-page .form-heading h2 {
  margin-inline: auto;
}

.contact-page .form-heading h2 em,
.contact-page .team-heading h2 em {
  font-style: normal;

  background: linear-gradient(
    100deg,
    #a1a1aa 0%,
    #8b8b93 50%,
    #6f6f78 100%
  );

  -webkit-background-clip: text;
  background-clip: text;

  color: transparent !important;
  -webkit-text-fill-color: transparent !important;
}

.team-grid {
  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 16px;
}

.team-card {
  position: relative;
  isolation: isolate;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  min-height: 340px;

  overflow: hidden;

  border-radius: 26px;

  background: linear-gradient(150deg, #4a5667, #14243a);
}

.team-img {
  position: absolute;
  inset: 0;
  z-index: 0;

  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;

  transition: scale 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.team-card:hover .team-img {
  scale: 1.05;
}

.team-shade {
  position: absolute;
  inset: 0;
  z-index: 1;

  background: linear-gradient(
    180deg,
    rgba(8, 11, 16, 0.12) 0%,
    rgba(8, 11, 16, 0.55) 50%,
    rgba(8, 11, 16, 0.9) 100%
  );
}

.team-body {
  position: relative;
  z-index: 2;

  padding: 28px;
}

.contact-page .team-card h3 {
  margin: 0;

  color: #fff !important;
  -webkit-text-fill-color: #fff !important;

  font-size: clamp(24px, 2.2vw, 30px);
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.04em;
}

.contact-page .team-card p {
  max-width: 300px;

  margin: 10px 0 0;

  color: #fff !important;
  -webkit-text-fill-color: #fff !important;

  font-size: 15px;
  line-height: 1.55;

  opacity: 0.9;
}

.team-card a {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;

  gap: 14px;

  margin-top: 22px;
  padding: 12px 24px;

  border: 1px solid rgb(255 255 255 / 55%);
  border-radius: 999px;

  /* transparent / glass button */
  background: rgb(255 255 255 / 10%);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);

  font-size: 14px;
  font-weight: 700;

  text-decoration: none;

  transition:
    background 0.25s,
    border-color 0.25s,
    transform 0.25s;
}

.contact-page .team-card a {
  color: #ffffff !important;
  -webkit-text-fill-color: #ffffff !important;
}

.team-card a:hover {
  background: rgb(255 255 255 / 22%);
  border-color: #ffffff;

  transform: translateY(-2px);
}

/* =========================================
   TABLET RESPONSIVE
========================================= */

@media (max-width: 980px) {

  .contact-page {
    padding-inline: 20px;
  }

  .info-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .info-card-q {
    grid-column: 1 / -1;

    min-height: 200px;
  }

  .phone-item strong {
    font-size: 21px;
  }

  .form-map-card {
    grid-template-columns: 1fr;
  }

  .map-panel {
    min-height: 400px;
  }

  .team-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .team-card:last-child {
    grid-column: 1 / -1;
  }

  .form-submit-row {
    align-items: flex-start;
  }

  .form-submit-row p {
    max-width: 55%;
  }

}

/* =========================================
   MOBILE RESPONSIVE
========================================= */

@media (max-width: 620px) {

  .contact-page {
    padding: 0 16px 75px;
  }

  .contact-page .form-heading h2,
  .contact-page .team-heading h2 {
    font-size: 36px;
  }

  .contact-hero {
    min-height: 480px;
  }

  .contact-hero > img {
    object-position: 53% center;
  }

  .info-section {
    padding-top: 12px;
  }

  .info-grid,
  .team-grid {
    grid-template-columns: 1fr;

    gap: 12px;
  }

  .info-card,
  .info-card-q {
    grid-column: auto;

    min-height: 220px;

    padding: 20px;

    border-radius: 22px;
  }

  .info-contact-card {
    gap: 24px;
  }

  .phone-list {
    gap: 18px;
  }

  .phone-item strong {
    font-size: 21px;
  }

  .country-flag {
    width: 28px;
    height: 19px;
  }

  .info-contact-card .info-row strong {
    font-size: 23px;
  }

  .info-go {
    top: 20px;
    right: 20px;
  }

  .contact-form-section,
  .team-section {
    padding-top: 78px;
  }

  .form-heading > p {
    font-size: 14px;
  }

  .team-card:last-child {
    grid-column: auto;
  }

  .form-heading {
    text-align: left;
  }

  .form-map-card {
    gap: 18px;

    padding: 12px;

    border-radius: 21px;
  }

  .contact-form {
    padding: 10px 5px 8px;
  }

  .form-fields {
    grid-template-columns: 1fr;

    gap: 16px;
  }

  .field-wide {
    grid-column: auto;
  }

  .form-submit-row {
    align-items: flex-start;
    flex-direction: column;
  }

  .form-submit-row p {
    max-width: 100%;
  }

  .form-submit-row button {
    width: 100%;

    justify-content: space-between;
  }

  .map-panel {
    min-height: 390px;
  }

  .map-address {
    right: 10px;
    bottom: 10px;
    left: 10px;

    padding: 13px;
  }

  .team-card {
    min-height: 280px;
  }

  .team-body {
    padding: 22px;
  }

}

/* =========================================
   SMALL MOBILE
========================================= */

@media (max-width: 390px) {

  .contact-page {
    padding-inline: 13px;
  }

  .phone-item {
    gap: 10px;
  }

  .phone-item strong {
    font-size: 19px;
  }

  .country-flag {
    width: 26px;
    height: 18px;
  }

  .form-map-card {
    padding: 9px;
  }

  .map-panel {
    min-height: 350px;
  }

  .map-address {
    right: 8px;
    bottom: 8px;
    left: 8px;

    gap: 8px;

    padding: 11px;
  }

  .map-address strong {
    font-size: 13px;
  }

  .map-address address {
    font-size: 11px;
  }

}

/* =========================================
   REDUCED MOTION
========================================= */

@media (prefers-reduced-motion: reduce) {

  .contact-page * {
    transition-duration: 0s !important;
  }

  .contact-hero:hover > img {
    scale: 1;
  }

}
</style>
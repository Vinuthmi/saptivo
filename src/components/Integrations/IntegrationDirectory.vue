<script setup>
defineOptions({ name: 'IntegrationDirectory' })

const integrations = [
  {
    name: 'WhatsApp Business',
    category: 'Conversations',
    mark: 'WA',
    tone: 'green',
    description:
      'Keep team chats in one shared inbox. Sync conversations to customer records and send approved templates.',
    to: '/features/whatsapp-crm/',
    link: 'Explore WhatsApp CRM',
  },
  {
    name: '3CX',
    category: 'Phone systems',
    mark: '3CX',
    tone: 'blue',
    description:
      'Recognise callers, open the matching customer record, log calls automatically and click to call from Saptivo.',
    to: '/features/3cx-crm-integration/',
    link: 'Explore 3CX integration',
  },
  {
    name: 'Vodia & AI calls',
    category: 'Phone systems',
    mark: 'V',
    tone: 'purple',
    description:
      'Connect Vodia PBX calls to customer records and use AI voice agents for CRM-powered reminders and follow-ups.',
    to: '/features/vodia-integration/',
    link: 'Explore Vodia integration',
  },
  {
    name: 'WordPress forms',
    category: 'Lead capture',
    mark: 'WP',
    tone: 'slate',
    description:
      'Turn website form submissions into new inquiries, ready for your team to follow up.',
  },
  {
    name: 'Facebook Lead Ads',
    category: 'Lead capture',
    mark: 'f',
    tone: 'blue',
    description:
      'Bring ad responses into Saptivo as scored, assigned leads so new enquiries reach the right people.',
  },
  {
    name: 'Google Calendar',
    category: 'Team workflows',
    mark: 'G',
    tone: 'yellow',
    description:
      'Keep CRM follow-ups and meetings visible alongside your team’s calendar events.',
  },
  {
    name: 'REST API & webhooks',
    category: 'Developer tools',
    mark: 'API',
    tone: 'dark',
    description:
      'Connect accounting, e-commerce and in-house systems to Saptivo with your own integrations.',
  },
]
</script>

<template>
  <section class="integration-directory" aria-labelledby="integrations-title">
    <div class="directory-wrap">
      <header class="directory-heading">
        <p class="eyebrow">Connected workflows</p>
        <h2 id="integrations-title">
          Your tools, working
          <span>together in one CRM.</span>
        </h2>
        <p class="intro">
          Bring conversations, calls, new leads and follow-ups into the same customer view. Spend less time moving
          information between tools and more time helping customers.
        </p>
      </header>

      <div class="integration-grid">
        <article v-for="item in integrations" :key="item.name" class="integration-card">
          <div class="card-top">
            <span class="integration-mark" :class="`tone-${item.tone}`" aria-hidden="true">{{ item.mark }}</span>
            <span class="category">{{ item.category }}</span>
          </div>
          <h3>{{ item.name }}</h3>
          <p>{{ item.description }}</p>
          <router-link v-if="item.to" class="card-link" :to="item.to">
            {{ item.link }}
            <span aria-hidden="true">→</span>
          </router-link>
          <a
            v-else
            class="card-link"
            href="mailto:hello@saptivo.com?subject=Ask%20about%20Saptivo%20integrations"
          >
            Ask about this integration
            <span aria-hidden="true">→</span>
          </a>
        </article>
      </div>

      <aside class="integration-cta">
        <div>
          <p class="eyebrow">One connected workspace</p>
          <h2>Make every handoff feel effortless.</h2>
          <p>Talk with our team about connecting your sales and customer workflows.</p>
        </div>
        <a
          class="cta-button"
          href="mailto:hello@saptivo.com?subject=Book%20a%20Saptivo%20demo"
        >
          Talk to our team
          <span aria-hidden="true">→</span>
        </a>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.integration-directory {
  --ink: #17191d;
  --muted: #656b73;
  --line: #e8eaed;
  padding: clamp(72px, 9vw, 120px) 0;
  color: var(--ink);
  background:
    radial-gradient(ellipse at 50% 0, rgba(220, 229, 235, 0.48), transparent 45%),
    #fff;
  font-family: 'Urbanist', system-ui, sans-serif;
}

.integration-directory *,
.integration-directory *::before,
.integration-directory *::after {
  box-sizing: border-box;
}

.directory-wrap {
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
}

.directory-heading {
  max-width: 760px;
  margin: 0 auto 48px;
  text-align: center;
}

.eyebrow {
  margin: 0 0 14px;
  color: #615f5a;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.directory-heading h2 {
  margin: 0;
  color: #0a0a0a;
  font-size: clamp(36px, 4.5vw, 58px);
  font-weight: 600;
  line-height: 1.12;
  letter-spacing: -0.045em;
  text-wrap: balance;
}

.directory-heading h2 span {
  display: block;
  color: #615f5a;
}

.intro {
  max-width: 660px;
  margin: 20px auto 0;
  color: var(--muted);
  font-family: Inter, Arial, sans-serif;
  font-size: 16px;
  line-height: 1.75;
}

.integration-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.integration-card {
  display: flex;
  min-height: 260px;
  flex-direction: column;
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 10px 32px rgba(23, 25, 29, 0.035);
  transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
}

.integration-card:hover {
  transform: translateY(-3px);
  border-color: #cbd4db;
  box-shadow: 0 18px 38px rgba(23, 25, 29, 0.08);
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.integration-mark {
  display: grid;
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  place-items: center;
  border: 1px solid rgba(23, 25, 29, 0.06);
  border-radius: 15px;
  background: #f5f6f7;
  color: #30343a;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.tone-green { color: #18875b; background: #e9f7ef; }
.tone-blue { color: #2868bc; background: #edf4ff; }
.tone-purple { color: #7054b8; background: #f2effb; }
.tone-slate { color: #3e6178; background: #edf3f6; }
.tone-yellow { color: #9c7416; background: #fff7db; }
.tone-dark { color: #fff; background: #292d33; }

.category {
  padding: 7px 10px;
  border-radius: 999px;
  background: #f5f6f7;
  color: #646a72;
  font-family: Inter, Arial, sans-serif;
  font-size: 11px;
  font-weight: 600;
}

.integration-card h3 {
  margin: 20px 0 8px;
  font-size: 21px;
  font-weight: 700;
  letter-spacing: -0.025em;
}

.integration-card > p {
  margin: 0 0 22px;
  color: var(--muted);
  font-family: Inter, Arial, sans-serif;
  font-size: 14px;
  line-height: 1.65;
}

.card-link {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  color: #33485d;
  font-family: Inter, Arial, sans-serif;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
}

.card-link span,
.cta-button span {
  transition: transform 180ms ease;
}

.card-link:hover span,
.cta-button:hover span {
  transform: translateX(3px);
}

.card-link:focus-visible,
.cta-button:focus-visible {
  outline: 2px solid #33485d;
  outline-offset: 4px;
  border-radius: 4px;
}

.integration-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  margin-top: 30px;
  padding: clamp(26px, 4vw, 42px);
  border: 1px solid #dfe5e9;
  border-radius: 24px;
  background: linear-gradient(110deg, #f7f9fa, #fff 64%);
}

.integration-cta .eyebrow {
  margin-bottom: 8px;
}

.integration-cta h2 {
  margin: 0;
  font-size: clamp(24px, 3vw, 34px);
  font-weight: 700;
  letter-spacing: -0.04em;
}

.integration-cta p:not(.eyebrow) {
  margin: 8px 0 0;
  color: var(--muted);
  font-family: Inter, Arial, sans-serif;
  font-size: 14px;
  line-height: 1.6;
}

.cta-button {
  display: inline-flex;
  min-height: 50px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 0 20px;
  border-radius: 12px;
  background: #17191d;
  color: white;
  font-family: Inter, Arial, sans-serif;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  transition: background 180ms ease;
}

.cta-button:hover {
  background: #33485d;
}

@media (max-width: 900px) {
  .integration-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .directory-wrap {
    width: calc(100% - 32px);
  }

  .directory-heading {
    margin-bottom: 32px;
    text-align: left;
  }

  .directory-heading h2 span {
    display: inline;
  }

  .integration-grid {
    grid-template-columns: 1fr;
  }

  .integration-card {
    min-height: 0;
    padding: 22px;
  }

  .integration-cta {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (prefers-reduced-motion: reduce) {
  .integration-card,
  .card-link span,
  .cta-button,
  .cta-button span {
    transition: none;
  }

  .integration-card:hover {
    transform: none;
  }
}
</style>


<template>
  <section
    id="faq"
    ref="root"
    class="faq"
    :class="{ in: seen, live }"
    aria-labelledby="faq-title"
  >
    <h2 id="faq-title" class="title">
      <span>Frequently</span>
      <span class="soft">asked questions</span>
    </h2>

    <div class="grid">
      <!-- FAQ Accordion -->
      <div class="list">
        <div
          v-for="(f, i) in faqs"
          :key="f.q"
          class="item"
          :class="{ open: open === i }"
        >
          <h3>
            <button
              type="button"
              class="q"
              :id="`faq-q-${i}`"
              :aria-expanded="open === i"
              :aria-controls="`faq-a-${i}`"
              @click="toggle(i)"
            >
              <span class="num" aria-hidden="true">
                0{{ i + 1 }}
              </span>

              <span class="qt">{{ f.q }}</span>

              <span class="pm" aria-hidden="true">
                <i></i>
                <i></i>
              </span>
            </button>
          </h3>

          <div
            class="a"
            :id="`faq-a-${i}`"
            role="region"
            :aria-labelledby="`faq-q-${i}`"
          >
            <div class="a-in">
              <p>{{ f.a }}</p>

              <span class="chip">
                <svg
                  viewBox="0 0 24 24"
                  width="13"
                  height="13"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="m5 12 5 5 9-10" />
                </svg>

                {{ f.chip }}
              </span>
            </div>
          </div>
        </div>

        <!-- Related Internal Links -->
        <p class="rel">
          Related:

          <template v-for="(r, i) in related" :key="r.href">
            <a :href="r.href">{{ r.label }}</a>
            <span
              v-if="i < related.length - 1"
              aria-hidden="true"
            >
              ·
            </span>
          </template>
        </p>
      </div>

      <!-- 3CX CTA -->
      <aside
        class="cta"
        :style="ctaStyle"
        aria-label="3CX integration demo"
      >
        <span class="glow" aria-hidden="true"></span>

        <div class="cta-body">
          <span class="trial">
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>

            3CX Call Integration
          </span>

          <h3>Bring every customer call into Saptivo</h3>

          <p>
            Connect your 3CX phone system with Saptivo CRM.
            Match incoming calls to customers, track missed calls
            and manage call activity from one place.
          </p>

          <div class="btns">
            <a class="btn primary" href="#demo">
              See 3CX integration in a demo

              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </a>

            <a class="btn ghost" href="#signup">
              Get Started
            </a>
          </div>
        </div>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "FeaturesSection8" });

// CTA Background Image
const bgImage = `${import.meta.env.BASE_URL}images/features/threecolleagues-.jpg`;

const ctaStyle = bgImage
  ? {
      backgroundImage: `linear-gradient(
        100deg,
        rgba(20, 18, 15, 0.9) 0%,
        rgba(20, 18, 15, 0.72) 55%,
        rgba(20, 18, 15, 0.5) 100%
      ), url("${bgImage}")`,
    }
  : {};

// 3CX Frequently Asked Questions
const faqs = [
  {
    q: "Do I need 3CX already?",
    a: "Saptivo works with your existing 3CX system, or Weblook can provide one through Voxinnova.",
    chip: "Existing or new 3CX system",
  },
  {
    q: "Are calls matched to customers automatically?",
    a: "Yes. Saptivo matches the caller's number to contacts and accounts in under a second.",
    chip: "Automatic caller matching",
  },
  {
    q: "Can I see missed calls by extension?",
    a: "Yes. Filter the call journal by extension and call type to see missed calls and callbacks.",
    chip: "Missed call tracking",
  },
  {
    q: "Can calls be recorded?",
    a: "Yes. Call recordings from 3CX can be stored against the customer and played back from the timeline.",
    chip: "Call recordings in customer timeline",
  },
  {
    q: "Will this work for a call centre?",
    a: "Yes. Queues, extensions and agents map to Saptivo users, with reports on call volumes and missed calls.",
    chip: "Call centre management",
  },
];

// Related Internal Links
const related = [
  {
    label: "WhatsApp CRM",
    href: "/whatsapp-crm",
  },
  {
    label: "Help Desk",
    href: "/help-desk",
  },
  {
    label: "Contractors & Services",
    href: "/contractors-and-services",
  },
];

// Accordion Functionality
const open = ref(0);

function toggle(i) {
  open.value = open.value === i ? -1 : i;
}

// Scroll Animation
const root = ref(null);
const seen = ref(false);
const live = ref(false);

const st = {
  io: null,
  fallback: null,
};

onMounted(() => {
  const reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (
    reduce ||
    !("IntersectionObserver" in window) ||
    !root.value
  ) {
    seen.value = true;
    return;
  }

  st.io = new IntersectionObserver(
    (entries) => {
      const e = entries[entries.length - 1];

      if (e && e.isIntersecting) {
        seen.value = true;
        live.value = true;
      } else {
        live.value = false;
      }
    },
    {
      threshold: 0,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  st.io.observe(root.value);

  // Safety fallback
  st.fallback = window.setTimeout(() => {
    if (!seen.value) seen.value = true;
  }, 2500);
});

onBeforeUnmount(() => {
  if (st.io) st.io.disconnect();

  window.clearTimeout(st.fallback);
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

.faq {
  --orange: #33485d;
  --orange-soft: #edf1f4;
  --ink: #14120f;
  --muted: #6a6560;
  --line: #e4e9ed;

  position: relative;
  overflow: clip;
  scroll-margin-top: 100px;
  padding: 112px 0;
  color: var(--ink);
  background: #fff;
  font-family: "Inter", system-ui, sans-serif;
}

.faq *,
.faq *::before,
.faq *::after {
  box-sizing: border-box;
}

.faq a:focus-visible,
.faq button:focus-visible {
  outline: 2px solid var(--orange);
  outline-offset: 3px;
}

/* Heading */

.title {
  margin: 0 auto;
  width: min(900px, calc(100% - 40px));
  text-align: center;
  text-wrap: balance;
  font-size: clamp(34px, 3.6vw, 56px);
  font-weight: 500;
  line-height: 1.15;
  letter-spacing: -0.03em;
  color: var(--ink);
}

.title span {
  display: block;
}

.title .soft {
  color: var(--muted);
}

/* Main Grid */

.grid {
  width: min(1180px, calc(100% - 40px));
  margin: 64px auto 0;
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 56px;
  align-items: stretch;
}

/* FAQ Accordion */

.list {
  display: grid;
  gap: 14px;
  align-content: start;
  min-width: 0;
}

.item {
  border: 1px solid var(--line);
  border-radius: 20px;
  background: #fff;
  transition:
    border-color 0.3s,
    background 0.3s,
    box-shadow 0.4s;
}

.item.open {
  border-color: rgba(51, 72, 93, 0.35);
  background: #f5f7f8;
  box-shadow: 0 16px 36px rgba(51, 72, 93, 0.1);
}

.item h3 {
  margin: 0;
  font: inherit;
}

.q {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 22px 24px;
  border: 0;
  background: none;
  cursor: pointer;
  text-align: left;
  color: var(--ink);
  font-family: "Poppins", system-ui, sans-serif;
}

.num {
  flex: none;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--orange);
  letter-spacing: 0.04em;
}

.qt {
  flex: 1;
  min-width: 0;
  font-size: 17px;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: -0.01em;
}

.pm {
  position: relative;
  flex: none;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #f4efec;
  transition:
    background 0.3s,
    transform 0.5s cubic-bezier(0.3, 1.4, 0.5, 1);
}

.pm i {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 2px;
  border-radius: 2px;
  background: var(--ink);
  transform: translate(-50%, -50%);
  transition:
    transform 0.4s,
    background 0.3s;
}

.pm i:last-child {
  transform: translate(-50%, -50%) rotate(90deg);
}

.item.open .pm {
  background: var(--orange);
  transform: rotate(180deg);
}

.item.open .pm i {
  background: #fff;
}

.item.open .pm i:last-child {
  transform: translate(-50%, -50%) rotate(0deg);
}

/* Accordion Answer */

.a {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.5s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.item.open .a {
  grid-template-rows: 1fr;
}

.a-in {
  overflow: hidden;
  min-height: 0;
  padding: 0 24px 0 58px;
  opacity: 0;
  transition:
    opacity 0.35s ease,
    padding 0.5s;
}

.item.open .a-in {
  opacity: 1;
  padding-bottom: 24px;
  transition-delay: 0.1s, 0s;
}

.a-in p {
  margin: 0 0 14px;
  font-size: 15.5px;
  line-height: 1.75;
  color: var(--muted);
  max-width: 52ch;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 99px;
  background: #e6f6ec;
  color: #15803d;
  font-size: 12px;
  font-weight: 600;
}

/* Related Links */

.rel {
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 1.9;
  color: var(--muted);
}

.rel a {
  color: var(--ink);
  text-decoration: none;
  border-bottom: 1px solid var(--line);
  transition:
    color 0.25s,
    border-color 0.25s;
}

.rel a:hover {
  color: var(--orange);
  border-color: var(--orange);
}

/* CTA Section */

.cta {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  min-height: 380px;
  padding: 44px 40px;
  border-radius: 28px;
  background-color: var(--ink);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: #fff;
  min-width: 0;
  box-shadow: 0 24px 50px rgba(20, 18, 15, 0.25);
}

/* Decorative Glow */

.glow {
  position: absolute;
  right: -90px;
  top: -90px;
  z-index: 0;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(51, 72, 93, 0.24),
    rgba(51, 72, 93, 0) 68%
  );
  animation: drift 7s ease-in-out infinite;
  pointer-events: none;
}

.cta-body {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.trial {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 12px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(6px);
  font-size: 12px;
  font-weight: 500;
}

.trial svg {
  color: var(--orange);
}

/* CTA Text */

.cta h3 {
  margin: 20px 0 12px;
  font-size: clamp(24px, 2.4vw, 32px);
  font-weight: 500;
  line-height: 1.22;
  letter-spacing: -0.025em;
  text-wrap: balance;
}

.cta p {
  margin: 0;
  max-width: 40ch;
  font-size: 15px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.78);
}

/* CTA Buttons */

.btns {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 30px;
}

.btn {
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 14px 24px;
  border-radius: 99px;
  font-size: 14.5px;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  transition:
    transform 0.35s cubic-bezier(0.3, 1.4, 0.5, 1),
    background 0.3s,
    border-color 0.3s,
    box-shadow 0.3s;
}

.btn svg {
  transition: transform 0.35s cubic-bezier(0.3, 1.4, 0.5, 1);
}

.btn.primary {
  background: #33485d;
  color: #fff;
  box-shadow: 0 12px 28px rgba(51, 72, 93, 0.24);
}

.btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 34px rgba(51, 72, 93, 0.32);
}

.btn.primary:hover svg {
  transform: translateX(4px);
}

.btn.primary::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    100deg,
    transparent 30%,
    rgba(255, 255, 255, 0.28) 50%,
    transparent 70%
  );
  transform: translateX(-100%);
  animation: sheen 3.6s ease-in-out infinite;
}

.btn.ghost {
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(6px);
}

.btn.ghost:hover {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.6);
  transform: translateY(-2px);
}

/* Entrance Animations */

.faq:not(.in) .list,
.faq:not(.in) .cta {
  opacity: 0;
}

.faq.in .title span {
  animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards;
}

.faq.in .title .soft {
  animation-delay: 0.1s;
}

.faq.in .list {
  animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 0.15s backwards;
}

.faq.in .cta {
  animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.3s backwards;
}

.faq:not(.live) .glow,
.faq:not(.live) .btn.primary::after {
  animation-play-state: paused;
}

/* Keyframes */

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(16px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes sheen {
  0%,
  45% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

@keyframes drift {
  0%,
  100% {
    transform: translate(0, 0);
  }

  50% {
    transform: translate(-30px, 24px);
  }
}

/* Responsive Design */

@media (max-width: 960px) {
  .grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 36px;
  }

  .cta {
    min-height: 340px;
  }
}

@media (max-width: 760px) {
  .faq {
    padding: 72px 0;
  }

  .grid {
    width: calc(100% - 32px);
    margin-top: 40px;
  }

  .q {
    padding: 18px 16px;
    gap: 12px;
  }

  .qt {
    font-size: 15.5px;
  }

  .a-in {
    padding-left: 16px;
    padding-right: 16px;
  }

  .cta {
    padding: 32px 22px;
    border-radius: 22px;
    background-position: 70% center;
  }

  .cta-body {
    width: 100%;
  }

  .btns {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }

  .btn {
    white-space: normal;
    text-align: center;
  }
}

/* Reduced Motion Accessibility */

@media (prefers-reduced-motion: reduce) {
  .faq *,
  .faq *::before,
  .faq *::after {
    animation: none !important;
    transition: none !important;
  }

  .faq:not(.in) .list,
  .faq:not(.in) .cta {
    opacity: 1;
  }
}
</style>

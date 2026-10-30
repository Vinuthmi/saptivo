 <template>
  <section ref="root" class="cta" :class="{ in: visible }" aria-labelledby="cta-title">
    <div class="bg" aria-hidden="true"></div>

    <div
      ref="card"
      class="card"
      @pointermove="onMove"
      @pointerleave="onLeave"
    >
      <div class="left">
        <a href="#download" class="store">
          <img
            class="qr"
            src="/images/cta-qr.png"
            alt="QR code to download the app"
            width="86"
            height="77"
          />

          <span class="store-text">
            <strong>Download from app store</strong>
            <span>It's free, get started now</span>
          </span>
        </a>

        <div class="copy">
          

          <h2 id="cta-title">Ready to get <span>started?</span></h2>

          <p>Download Nexa CRM for free. No credit card required.</p>

          <a href="#contact" class="btn">
            Get Started
          </a>

          <span class="note">
            Free to start <span>·</span> Simple to use
          </span>
        </div>
      </div>

      <div class="shot">
        <div class="glow"></div>

        <img
          class="dash"
          src="/images/cta-dashboard.png"
          alt="Nexa CRM dashboard preview"
          width="1915"
          height="907"
          draggable="false"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "CtaSection" });

const root = ref(null);
const card = ref(null);
const visible = ref(false);

let io = null;
let reduce = false;

function onMove(e) {
  if (reduce || !card.value) return;

  const r = card.value.getBoundingClientRect();
  const x = ((e.clientX - r.left) / r.width) * 2 - 1;
  const y = ((e.clientY - r.top) / r.height) * 2 - 1;

  card.value.style.setProperty("--mx", x.toFixed(2));
  card.value.style.setProperty("--my", y.toFixed(2));
}

function onLeave() {
  if (!card.value) return;

  card.value.style.setProperty("--mx", "0");
  card.value.style.setProperty("--my", "0");
}

onMounted(() => {
  reduce = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reduce || !("IntersectionObserver" in window)) {
    visible.value = true;
    return;
  }

  io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        visible.value = true;
        io.disconnect();
      }
    },
    { threshold: 0.15 }
  );

  if (root.value) io.observe(root.value);
});

onBeforeUnmount(() => io?.disconnect());
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

.cta {
  --orange: #ff6338;
  --ink: #171717;
  --muted: #777982;
  --gutter: clamp(16px, 8vw, 150px);

  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding-top: clamp(55px, 8vw, 130px);
  background: #fff;
  color: var(--ink);
  font-family: "Inter", sans-serif;
}

.cta *,
.cta *::before,
.cta *::after {
  box-sizing: border-box;
}

.cta a:focus-visible {
  outline: 2px solid var(--orange);
  outline-offset: 4px;
}

/* Smooth orange-to-white background */

.bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;

  background:
    radial-gradient(
      ellipse 85% 55% at 50% 0%,
      rgba(255, 99, 56, 0.95) 0%,
      rgba(255, 120, 75, 0.65) 28%,
      rgba(255, 165, 130, 0.28) 58%,
      rgba(255, 255, 255, 0) 100%
    ),
    linear-gradient(
      180deg,
      #fff8f5 0%,
      #ffffff 100%
    );
}

/* Gradual white fluted-glass lines */

.bg::after {
  content: "";
  position: absolute;
  inset: 0;

  background:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.04) 15%,
      rgba(255, 255, 255, 0.20) 40%,
      rgba(255, 255, 255, 0.52) 72%,
      rgba(255, 255, 255, 0.88) 100%
    ),
    repeating-linear-gradient(
      90deg,
      transparent 0px,
      transparent 34px,
      rgba(255, 255, 255, 0.04) 38px,
      rgba(255, 255, 255, 0.16) 41px,
      rgba(255, 255, 255, 0.42) 43px,
      rgba(255, 255, 255, 0.12) 46px,
      transparent 51px,
      transparent 82px
    );

  -webkit-mask-image: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 0, 0, 0.15) 12%,
    #000 40%,
    #000 75%,
    transparent 100%
  );

  mask-image: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 0, 0, 0.15) 12%,
    #000 40%,
    #000 75%,
    transparent 100%
  );

  -webkit-backdrop-filter: blur(3px);
  backdrop-filter: blur(3px);
}

/* Main card */

.card {
  --mx: 0;
  --my: 0;

  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  position: relative;
  width: calc(100% - var(--gutter) * 2);
  min-height: clamp(500px, 38vw, 690px);
  margin: 0 auto;
  overflow: hidden;

  background: rgba(255, 255, 255, 0.93);
  border: 1px solid rgba(255, 99, 56, 0.12);
  border-bottom: 0;
  border-radius: clamp(24px, 2.5vw, 42px)
    clamp(24px, 2.5vw, 42px) 0 0;

  box-shadow: 0 -10px 45px rgba(255, 99, 56, 0.05);

  opacity: 0;
  transform: translateY(35px);

  transition:
    opacity 0.8s ease,
    transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.in .card {
  opacity: 1;
  transform: translateY(0);
}

/* Left content */

.left {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 48px;
  min-width: 0;

  padding:
    clamp(28px, 4.5vw, 78px)
    0
    clamp(36px, 4vw, 68px)
    clamp(24px, 4.5vw, 78px);
}

/* Glass download badge */

.store {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  max-width: 100%;
  padding: 12px 20px 12px 12px;

  color: inherit;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 18px;

  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.035);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);

  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.store:hover {
  transform: translateY(-3px);
  border-color: rgba(255, 99, 56, 0.25);
  box-shadow: 0 12px 30px rgba(255, 99, 56, 0.08);
}

.qr {
  display: block;
  width: clamp(58px, 5vw, 82px);
  height: auto;
  flex-shrink: 0;
  border-radius: 9px;
  image-rendering: pixelated;
}

.store-text {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.store-text strong {
  font-size: clamp(14px, 1.2vw, 19px);
  font-weight: 600;
  letter-spacing: -0.04em;
}

.store-text span {
  color: var(--muted);
  font-size: clamp(12px, 0.95vw, 15px);
}

/* Heading and copy */

.copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding-right: 20px;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 22px;

  color: #747474;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.13em;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--orange);
  box-shadow: 0 0 0 5px rgba(255, 99, 56, 0.10);
}

.copy h2 {
  max-width: 570px;
  margin: 0;

  color: #0f172a;
  font-family: "Inter Display", Inter, system-ui, sans-serif;
  font-size: clamp(46px, 4vw, 76px);
  font-weight: 500;
  line-height: 1.12;
  letter-spacing: -0.06em;
}

.copy h2 span {
  /* negative letter-spacing shrinks the last glyph's box, so the clipped gradient cut off the "?" */
  padding: 0 0.12em 0.1em 0;
  margin-right: -0.12em;
  background: linear-gradient(100deg, #ff9a3d 0%, #ff6a1a 45%, #f2540c 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.copy p {
  max-width: 390px;
  margin: 20px 0 0;

  color: #475569;
  font-family: 'Inter Display', Inter, system-ui, sans-serif;
  font-size: clamp(15px, 1vw, 18px);
  font-weight: 500;
  line-height: 1.45;
  letter-spacing: -0.02em;
}

/* CTA button */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  min-height: 54px;
  margin-top: 30px;
  padding: 0 24px;

  color: #fff;
  background: linear-gradient(180deg, #ff7a45, #f2531f);
  border: 0;
  border-radius: 12px;

  font-size: 15px;
  font-weight: 600;
  text-decoration: none;

  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.35), 0 10px 24px rgba(240, 75, 35, 0.3);

  transition: transform 0.2s, box-shadow 0.2s;
}

.btn .arrow {
  display: inline-block;
  transition: transform 0.25s;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.4), 0 16px 32px rgba(240, 75, 35, 0.4);
}

.btn:hover .arrow {
  transform: rotate(45deg);
}

.note {
  margin-top: 20px;
  color: #8a8b91;
  font-size: 12px;
}

.note span {
  padding: 0 6px;
  color: var(--orange);
}

/* Dashboard presentation */

/* Fades the card's bottom edge into the white footer */
.card::after {
  content: "";
  position: absolute;
  inset: auto 0 0;
  z-index: 3;
  height: 9%;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.45) 60%,
    #fff 100%
  );
  pointer-events: none;
}

.shot {
  position: relative;
  min-width: 0;
  min-height: 400px;
}

.glow {
  position: absolute;
  top: 18%;
  left: 15%;
  width: 75%;
  height: 60%;

  border-radius: 50%;
  background: rgba(255, 99, 56, 0.12);
  filter: blur(75px);
  pointer-events: none;
}

.dash {
  position: absolute;
  z-index: 1;
  top: 9%;
  left: 2%;

  display: block;
  width: 175%;
  max-width: none;
  height: auto;

  border: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 16px;

  box-shadow:
    0 35px 75px rgba(0, 0, 0, 0.13),
    0 8px 20px rgba(0, 0, 0, 0.04);

  transform-origin: 0% 30%;

  transform:
    perspective(1800px)
    rotateY(calc(12deg + var(--mx) * 2deg))
    rotateX(calc(3deg - var(--my) * 1.5deg))
    rotateZ(-2deg);

  opacity: 0;

  transition:
    transform 0.8s ease 0.1s,
    opacity 0.8s ease 0.1s;
}

.in .dash {
  opacity: 1;
}

.card:hover .dash {
  transition: transform 0.2s ease-out;
}

/* Tablet */

@media (max-width: 900px) {
  .cta {
    --gutter: 18px;
  }

  .card {
    grid-template-columns: 1fr;
    min-height: auto;
    border-bottom: 1px solid rgba(255, 99, 56, 0.12);
    border-radius: 26px;
  }

  .left {
    gap: 42px;
    padding: 30px 26px 10px;
  }

  .copy {
    padding-right: 0;
  }

  .copy h2 {
    max-width: 520px;
    font-size: clamp(46px, 7vw, 68px);
  }

  .shot {
    min-height: 0;
    height: clamp(260px, 55vw, 430px);
  }

  .dash {
    top: 12px;
    left: 7%;
    width: 120%;

    transform:
      perspective(1400px)
      rotateY(7deg)
      rotateZ(-1deg)
      translateY(30px);
  }

  .in .dash {
    transform:
      perspective(1400px)
      rotateY(7deg)
      rotateZ(-1deg);
  }
}

/* Mobile */

@media (max-width: 480px) {
  .cta {
    padding-top: 45px;
  }

  .left {
    gap: 38px;
    padding: 22px 18px 8px;
  }

  .store {
    gap: 12px;
    padding: 10px;
    border-radius: 14px;
  }

  .qr {
    width: 56px;
  }

  .store-text strong {
    font-size: 13px;
  }

  .store-text span {
    font-size: 11px;
  }

  .eyebrow {
    margin-bottom: 18px;
    font-size: 9px;
  }

  .copy h2 {
    font-size: clamp(38px, 10vw, 48px);
  }

  .copy p {
    margin-top: 14px;
  }

  .btn {
    min-height: 50px;
    margin-top: 24px;
    padding: 0 20px;
    font-size: 14px;
  }

  .shot {
    height: 260px;
  }

  .dash {
    top: 20px;
    left: 4%;
    width: 135%;
  }
}

/* Accessibility */

@media (prefers-reduced-motion: reduce) {
  .card,
  .dash,
  .store,
  .btn,
  .btn .arrow {
    transition: none !important;
  }

  .card,
  .in .card,
  .dash,
  .in .dash {
    opacity: 1;
    transform: none;
  }
}
</style>

<script setup>
defineOptions({ name: 'FooterCta' })

const baseUrl = import.meta.env.BASE_URL

const orbitIcons = [
  { name: 'Instagram', src: `${baseUrl}orbit/instagram.svg`, size: 40 },
  { name: 'Facebook', src: `${baseUrl}orbit/facebook.svg`, size: 40 },
  { name: 'WordPress', src: `${baseUrl}orbit/wordpress.svg`, size: 40 },
  { name: '3CX', src: `${baseUrl}orbit/3cx.svg`, size: 56 },
  { name: 'Google Calendar', src: `${baseUrl}orbit/google-calendar.svg`, size: 38 },
]
</script>

<template>
  <section id="contact" class="footer-cta">
    <div class="cta">
      <h2 class="cta-title">
        Ready to run
        <span class="grad">every store as one?</span>
      </h2>

      <p class="cta-sub">
        One connected workspace for customers, sales, and every store you run.
        Work smarter, move faster and make every opportunity count.
      </p>

      <div class="cta-actions">
        <router-link to="/free-trial/" class="btn btn-primary">
          Start your free trial
        </router-link>

        <router-link to="/demo/" class="btn btn-light">
          Book a Demo
        </router-link>
      </div>

      <!-- Rotating integration orbit -->
      <div class="orbit-wrap" aria-hidden="true">
        <div class="orbit">
          <div
            v-for="(icon, i) in orbitIcons"
            :key="icon.name"
            class="orbit-item"
            :style="{ '--a': `${(360 / orbitIcons.length) * i}deg` }"
          >
            <span class="orbit-badge">
              <img
                :src="icon.src"
                :alt="icon.name"
                :style="{ width: `${icon.size}px`, height: `${icon.size}px` }"
                draggable="false"
              />
            </span>
          </div>
        </div>

        <div class="orbit-inner">
          <i class="orbit-dot"></i>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.footer-cta {
  --radius: 340px;

  position: relative;
  width: 100%;
  overflow: hidden;
  background: #fff;
  color: #17191d;
  font-family: 'Urbanist', 'Poppins', Arial, sans-serif;
}

/* soft orange glow behind the heading */
.footer-cta::before {
  position: absolute;
  top: 40px;
  left: 50%;
  width: 1000px;
  height: 560px;
  transform: translateX(-50%);
  background: radial-gradient(
    closest-side,
    rgba(240, 100, 43, 0.14),
    rgba(240, 100, 43, 0.05) 60%,
    transparent
  );
  content: '';
  pointer-events: none;
}

.cta {
  position: relative;
  box-sizing: border-box;
  max-width: 1476px;
  margin: 0 auto;
  padding: clamp(65px, 8vw, 110px) 24px 0;
  text-align: center;
}

.cta-title {
  margin: 0;
  color: #0f172a;
  font-size: clamp(32px, 4.2vw, 62px);
  font-weight: 500;
  line-height: 1.12;
  letter-spacing: -0.05em;
}

.grad {
  display: block;
  background: linear-gradient(100deg, #ff9a3d 0%, #ff6a1a 45%, #f2540c 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.cta-sub {
  max-width: 560px;
  margin: 22px auto 32px;
  color: #475569;
  font-size: clamp(15px, 1vw, 18px);
  font-weight: 500;
  line-height: 1.6;
  letter-spacing: -0.02em;
}

.cta-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 14px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 54px;
  padding: 0 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-primary {
  color: #fff;
  background: linear-gradient(180deg, #ff7a45, #f2531f);
  box-shadow: 0 10px 24px rgba(240, 75, 35, 0.3);
}

.btn-primary:hover {
  box-shadow: 0 16px 32px rgba(240, 75, 35, 0.4);
}

.btn-light {
  color: #fff;
  background: #0b0c0e;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
}

.btn-light:hover {
  background: #292b30;
}

/* Orbit animation */

.orbit-wrap {
  position: relative;
  height: 230px;
  margin-top: 46px;
  overflow: hidden;
}

.orbit,
.orbit-inner {
  position: absolute;
  left: 50%;
  border-radius: 50%;
}

.orbit {
  top: 50px;
  width: calc(var(--radius) * 2);
  height: calc(var(--radius) * 2);
  margin-left: calc(var(--radius) * -1);
  border: 1px solid rgba(23, 25, 29, 0.14);
  animation: spin 60s linear infinite;
}

.orbit-item {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 76px;
  height: 76px;
  margin: -38px 0 0 -38px;
  transform: rotate(var(--a)) translateY(calc(var(--radius) * -1));
}

.orbit-badge {
  display: grid;
  width: 100%;
  height: 100%;
  place-items: center;
  border: 1px solid rgba(23, 25, 29, 0.08);
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 12px 28px rgba(23, 25, 29, 0.14);
  transform: rotate(calc(var(--a) * -1));
  animation: upright 60s linear infinite;
}

.orbit-badge img {
  display: block;
  object-fit: contain;
  user-select: none;
}

.orbit-inner {
  --r2: calc(var(--radius) - 95px);
  top: 145px;
  width: calc(var(--r2) * 2);
  height: calc(var(--r2) * 2);
  margin-left: calc(var(--r2) * -1);
  border: 1px dashed rgba(23, 25, 29, 0.24);
  animation: spin-rev 90s linear infinite;
}

.orbit-dot {
  position: absolute;
  top: -7px;
  left: 50%;
  width: 14px;
  height: 14px;
  margin-left: -7px;
  border: 2px solid #f0642b;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 12px rgba(240, 100, 43, 0.7);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes spin-rev {
  to {
    transform: rotate(-360deg);
  }
}

@keyframes upright {
  to {
    transform: rotate(calc(var(--a) * -1 - 360deg));
  }
}

@media (max-width: 640px) {
  .footer-cta {
    --radius: 200px;
  }

  .cta {
    padding-top: 55px;
  }

  .orbit-wrap {
    height: 180px;
  }

  .orbit-item {
    width: 56px;
    height: 56px;
    margin: -28px 0 0 -28px;
  }

  .orbit-badge {
    border-radius: 15px;
  }

  .orbit-badge img {
    transform: scale(0.7);
  }
}

@media (prefers-reduced-motion: reduce) {
  .orbit,
  .orbit-inner,
  .orbit-badge {
    animation: none;
  }

  .btn {
    transition: none;
  }
}
</style>
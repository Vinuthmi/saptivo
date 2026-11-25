<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "WhereToFindUsCardSection" });

const root = ref(null);
const shown = ref(false);
let io = null;
const flagImage = `${import.meta.env.BASE_URL}images/features/Flag_of_Sri_Lanka.svg.webp`;

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    shown.value = true;
    return;
  }
  io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        shown.value = true;
        io.disconnect();
      }
    },
    { threshold: 0.25 }
  );
  io.observe(root.value);
});
onBeforeUnmount(() => {
  if (io) io.disconnect();
});
</script>

<template>
  <section ref="root" class="wc" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Where to</span> <span class="l2">find us</span></h2>
      </header>

      <article class="card">
        <img class="flag" :src="flagImage" alt="Sri Lanka flag" width="78" height="52" />

        <h3>Weblook International (Pvt) Ltd.</h3>

        <p class="addr">
          <span>207/23 Dharmapala Mawatha</span>
          <span>Colombo 07</span>
          <span>Sri Lanka</span>
        </p>

        <p class="line">Phone: <a href="tel:0112000569">0112 000 569</a></p>
        <p class="line">Email: <a href="mailto:info@weblook.com">info@weblook.com</a></p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.wc {
  --ink: #14120f; --muted: #666b73; --line: #e6e7ea;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.wc *, .wc *::before, .wc *::after { box-sizing: border-box; }
.wrap { max-width: 720px; margin: 0 auto; }
.head { text-align: center; margin: 0 auto 40px; }
h2 { margin: 0; font-size: clamp(28px, 4.5vw, 52px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; white-space: nowrap; }
h2 span { display: inline; }
.wc h2 .l1 { color: #111111 !important; opacity: 1; }
.wc h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head, .card { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .card { opacity: 1; transform: none; }
.in .card { transition-delay: .1s; }

.card { background: #fff; border: 1px solid var(--line); border-radius: 32px; padding: 56px 32px 60px; text-align: center; display: flex; flex-direction: column; align-items: center; }
.flag { display: block; width: 78px; height: 52px; object-fit: contain; margin-bottom: 34px; }
h3 { margin: 0 0 22px; font-size: clamp(22px, 2.2vw, 26px); font-weight: 500; letter-spacing: -.02em; }
.addr { margin: 0 0 22px; display: flex; flex-direction: column; gap: 6px; font-size: 15.5px; line-height: 1.6; color: var(--muted); }
.line { margin: 0 0 14px; font-size: 15px; color: var(--muted); }
.line:last-child { margin-bottom: 0; color: var(--ink); }
.line a { color: var(--ink); font-weight: 600; text-decoration: none; transition: opacity .2s; }
.line a:hover { opacity: .65; }
.line a:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; border-radius: 4px; }

@media (max-width: 640px) {
  .wc { padding: 64px 16px; }
  .card { padding: 40px 20px 44px; border-radius: 26px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .card { opacity: 1; transform: none; transition: none; }
}
</style>

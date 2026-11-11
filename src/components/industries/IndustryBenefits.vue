<template>
  <section class="ei" aria-labelledby="ei-title">
    <header class="ei-head">
      <h2 id="ei-title" class="ei-title">What every industry gets</h2>
      <p class="ei-sub">
        Whatever your sector, every Saptivo workspace includes the core of a modern CRM: lead capture from your website,
        Facebook and WhatsApp, a visual sales pipeline, branded quotations and invoices, role-based security and
        real-time reports. Industry workflows sit on top of that core, so a retail chain and a solar installer share the
        same reliable foundation but see the screens, fields and reports that matter to them.
      </p>
    </header>

    <div class="ei-viewport">
      <div class="ei-track">
        <div v-for="n in 2" :key="n" class="ei-set" :aria-hidden="n === 2 ? 'true' : undefined">
          <article
            v-for="t in tiles"
            :key="t.key"
            class="ei-tile"
            :class="t.kind === 'photo' ? 'ei-photo' : 'ei-txt'"
            :style="{ '--w': t.w, background: t.kind === 'photo' ? t.bg : t.bg }"
          >
            <template v-if="t.kind === 'photo'">
              <img class="ei-img" :src="t.src" :style="{ objectPosition: t.pos }" alt="" loading="lazy" draggable="false" @error="$event.target.style.display = 'none'" />
            </template>
            <template v-else>
              <i class="ei-ti"><svg viewBox="0 0 24 24" aria-hidden="true"><path v-for="d in t.icon" :key="d" :d="d" /></svg></i>
              <div>
                <h3>{{ t.name }}</h3>
                <p>{{ t.text }}</p>
              </div>
            </template>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'EveryIndustryMarquee' })

/**
 * Continuously scrolling marquee (same mechanics as the CRM industries marquee):
 * the set is rendered twice and translated by -50% for a seamless loop; it pauses on hover and respects reduced motion.
 * Colours: the light tones from your palettes (cream, sand, blush, sky). Swap any photo URL in `items`.
 */
const items = [
  {
    id: 'leads', name: 'Lead capture', text: 'From your website, Facebook and WhatsApp.',
    icon: ['M4 5h16v11H8l-4 4Z', 'M8 9h8', 'M8 12.500h5'],
    src: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=900&q=80&auto=format&fit=crop', pos: '50% 40%',
    tbg: '#F4F1DE', pbg: '#D3ECFC',
  },
  {
    id: 'pipeline', name: 'A visual sales pipeline', text: 'Included in every Saptivo workspace.',
    icon: ['M4 5h4v14H4Z', 'M10 5h4v9h-4Z', 'M16 5h4v6h-4Z'],
    src: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=900&q=80&auto=format&fit=crop', pos: '50% 50%',
    tbg: '#DCE9F5', pbg: '#E8DCC6',
  },
  {
    id: 'docs', name: 'Branded quotations and invoices', text: 'Included in every Saptivo workspace.',
    icon: ['M7 3h8l4 4v14H7Z', 'M15 3v4h4', 'M10 12h6', 'M10 16h6'],
    src: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80&auto=format&fit=crop', pos: '50% 50%',
    tbg: '#E8DCC6', pbg: '#F4F1DE',
  },
  {
    id: 'security', name: 'Role-based security', text: 'Included in every Saptivo workspace.',
    icon: ['M12 3l8 3v6c0 4.500-3.200 8-8 9-4.800-1-8-4.500-8-9V6Z', 'M9 12l2.200 2.200L15.500 10'],
    src: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=900&q=80&auto=format&fit=crop', pos: '50% 50%',
    tbg: '#E6DDD6', pbg: '#DCE9F5',
  },
  {
    id: 'reports', name: 'Real-time reports', text: 'Included in every Saptivo workspace.',
    icon: ['M4 20V10', 'M10 20V4', 'M16 20v-7', 'M22 20H2'],
    src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80&auto=format&fit=crop', pos: '50% 50%',
    tbg: '#D3ECFC', pbg: '#E6DDD6',
  },
  {
    id: 'industry', name: 'Industry workflows on top', text: 'A retail chain and a solar installer share the same reliable foundation.',
    icon: ['M3 9l1.500-5h15L21 9', 'M4 9h16v11H4Z', 'M9.500 20v-5h5v5'],
    src: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=900&q=80&auto=format&fit=crop', pos: '50% 60%',
    tbg: '#F4F1DE', pbg: '#E8DCC6',
  },
]
const textW = [300, 320, 330, 310, 320, 340]
const photoW = [360, 400, 380, 420, 380, 400]

// order alternates: text + photo, photo + text, …
const tiles = items.flatMap((f, i) => {
  const txt = { kind: 'txt', key: f.id + '-t', w: textW[i], name: f.name, text: f.text, icon: f.icon, bg: f.tbg }
  const pho = { kind: 'photo', key: f.id + '-p', w: photoW[i], src: f.src, pos: f.pos, bg: f.pbg }
  return i % 2 ? [pho, txt] : [txt, pho]
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Urbanist:wght@500;600&display=swap');

.ei {
  --ink: #0d1b2a;
  --mute: #4a5563;
  --gap: 16px;
  --s: 1;
  position: relative;
  padding: clamp(40px, 6vw, 84px) 0 clamp(28px, 4vw, 52px);
  background: #fff;
  font-family: 'Poppins', system-ui, sans-serif;
  color: var(--ink);
  overflow: hidden;
  isolation: isolate;
}
.ei, .ei *, .ei *::before, .ei *::after { box-sizing: border-box; }
.ei svg { display: block; }

/* ---------- header ---------- */
.ei-head { display: flex; flex-direction: column; align-items: center; padding: 0 clamp(16px, 4vw, 48px) clamp(28px, 4vw, 52px); text-align: center; }
.ei-title { max-width: 980px; margin: 0; padding-bottom: 0.1em; color: #0a0a0a; font-family: Urbanist, "Urbanist Placeholder", sans-serif; font-size: 54px; font-weight: 600; line-height: 65px; letter-spacing: -1px; }
.ei-sub { max-width: 860px; margin: 14px 0 0; font-family: 'Urbanist', system-ui, sans-serif; font-size: clamp(15px, 1.1vw, 18px); font-weight: 500; line-height: 1.6; letter-spacing: -0.015em; color: #475569; }

/* ---------- marquee ---------- */
.ei-viewport { overflow: hidden; }
.ei-track { display: flex; width: max-content; animation: ei-loop 62s linear infinite; will-change: transform; }
.ei-viewport:hover .ei-track, .ei-viewport:active .ei-track { animation-play-state: paused; }
.ei-set { display: flex; gap: var(--gap); padding-right: var(--gap); }
@keyframes ei-loop { to { transform: translateX(-50%); } }

.ei-tile { position: relative; flex: none; width: calc(var(--w, 400) * var(--s) * 1px); height: calc(380px * var(--s)); border-radius: 22px; overflow: hidden; }
.ei-txt { display: flex; flex-direction: column; justify-content: space-between; gap: 20px; padding: calc(30px * var(--s)); }
.ei-ti { display: grid; place-items: center; width: 48px; height: 48px; border-radius: 50%; background: var(--ink); }
.ei-ti svg { width: 22px; height: 22px; fill: none; stroke: #fff; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
.ei-txt h3 { margin: 0; font-family: 'Urbanist', system-ui, sans-serif; font-size: clamp(20px, 1.7vw, 25px); font-weight: 600; line-height: 1.2; letter-spacing: -0.03em; }
.ei-txt p { margin: 10px 0 0; font-size: 14px; line-height: 1.6; color: var(--mute); }

.ei-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1); }
.ei-photo:hover .ei-img { transform: scale(1.04); }

@media (max-width: 900px) { .ei { --s: 0.88; } }
@media (max-width: 560px) { .ei { --s: 0.76; --gap: 12px; } .ei-track { animation-duration: 48s; } }
@media (prefers-reduced-motion: reduce) {
  .ei-track { animation: none; }
  .ei-viewport { overflow-x: auto; }
  .ei-set[aria-hidden='true'] { display: none; }
}
</style>
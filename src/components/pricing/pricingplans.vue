<template>
  <section class="ei" aria-labelledby="ei-title">
    <header class="ei-head">
      <h2 id="ei-title" class="ei-title">Every plan includes</h2>
    </header>

    <div class="ei-viewport">
      <div class="ei-track">
        <div v-for="n in 2" :key="n" class="ei-set" :aria-hidden="n === 2 ? 'true' : undefined">
          <article
            v-for="t in tiles"
            :key="t.key"
            class="ei-tile"
            :class="t.kind === 'photo' ? 'ei-photo' : 'ei-txt'"
            :style="{ '--w': t.w, '--fg': t.fg, '--ic': t.ic, background: t.bg }"
          >
            <template v-if="t.kind === 'photo'">
              <img class="ei-img" :src="t.src" :style="{ objectPosition: t.pos }" alt="" loading="lazy" draggable="false" @error="$event.target.style.display = 'none'" />
            </template>
            <template v-else>
              <i class="ei-ti"><svg viewBox="0 0 24 24" aria-hidden="true"><path v-for="d in t.icon" :key="d" :d="d" /></svg></i>
              <h3>{{ t.name }}</h3>
            </template>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'SectionEveryPlanMarquee' })

/**
 * "Every plan includes" as a continuously scrolling marquee (same mechanics as your EveryIndustryMarquee):
 * the set is rendered twice and translated by -50% for a seamless loop; it pauses on hover and respects reduced motion.
 * The eight inclusions are exactly as supplied (one text tile each, no added copy), each followed or preceded by a photo.
 * Swap any photo URL in `items`; if a photo fails to load, its tone colour shows instead.
 */
const items = [
  {
    id: 'cloud', name: 'Secure cloud hosting, backups and automatic updates',
    icon: ['M7 18a4 4 0 0 1-.6-7.960A5.500 5.500 0 0 1 17 9a4.500 4.500 0 0 1 .5 9Z', 'M12 11v6', 'M9.500 14.500 12 17l2.500-2.500'],
    src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=900&q=80&auto=format&fit=crop', pos: '50% 50%',
    tbg: '#F4F1DE', tfg: '#17172B', tic: '#FF6B16', pbg: '#E4DFD2',
  },
  {
    id: 'leads', name: 'Lead, contact and pipeline management',
    icon: ['M4 5h16l-6 7v6l-4 2v-8Z'],
    src: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900&q=80&auto=format&fit=crop', pos: '50% 30%',
    tbg: '#ECECEE', tfg: '#17172B', tic: '#FF6B16', pbg: '#DCDCDF',
  },
  {
    id: 'quotes', name: 'Quotations and invoicing with VAT and multi-currency',
    icon: ['M7 3h8l4 4v14H7Z', 'M15 3v4h4', 'M10 12h6', 'M10 16h6'],
    src: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=900&q=80&auto=format&fit=crop', pos: '50% 50%',
    tbg: '#F1EEE9', tfg: '#17172B', tic: '#FF6B16', pbg: '#E4DFD2',
  },
  {
    id: 'integrations', name: 'WhatsApp Business API, 3CX and Vodia integration options',
    icon: ['M9 7H6a3 3 0 0 0 0 6h3', 'M15 7h3a3 3 0 0 1 0 6h-3', 'M8 10h8'],
    src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80&auto=format&fit=crop', pos: '50% 50%',
    tbg: '#F4F1DE', tfg: '#17172B', tic: '#FF6B16', pbg: '#DCDCDF',
  },
  {
    id: 'recurring', name: 'Recurring invoices and automatic payments',
    icon: ['M4 12a8 8 0 0 1 13.700-5.600L20 8.500', 'M20 4v4.500h-4.500', 'M20 12a8 8 0 0 1-13.700 5.600L4 15.500', 'M4 20v-4.500h4.500'],
    src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=80&auto=format&fit=crop', pos: '50% 50%',
    tbg: '#ECECEE', tfg: '#17172B', tic: '#FF6B16', pbg: '#E4DFD2',
  },
  {
    id: 'roles', name: 'Role-based permissions, two-factor authentication and audit logs',
    icon: ['M12 3l8 3v6c0 4.500-3.200 8-8 9-4.800-1-8-4.500-8-9V6Z', 'M9 12l2.200 2.200L15.500 10'],
    src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=900&q=80&auto=format&fit=crop', pos: '50% 50%',
    tbg: '#F1EEE9', tfg: '#17172B', tic: '#FF6B16', pbg: '#DCDCDF',
  },
  {
    id: 'mobile', name: 'Mobile access',
    icon: ['M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z', 'M11 18h2'],
    src: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&q=80&auto=format&fit=crop', pos: '50% 50%',
    tbg: '#F4F1DE', tfg: '#17172B', tic: '#FF6B16', pbg: '#E4DFD2',
  },
  {
    id: 'onboarding', name: 'Onboarding help and local support',
    icon: ['M12 12a3.500 3.500 0 1 0 0-7 3.500 3.500 0 0 0 0 7Z', 'M5 20c0-3.500 3.100-6 7-6s7 2.500 7 6'],
    src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&q=80&auto=format&fit=crop', pos: '50% 40%',
    tbg: '#ECECEE', tfg: '#17172B', tic: '#FF6B16', pbg: '#DCDCDF',
  },
]
const textW = [330, 310, 330, 340, 320, 340, 300, 320]
const photoW = [380, 400, 360, 420, 380, 400, 360, 400]

// order alternates: text + photo, photo + text, ...
const tiles = items.flatMap((f, i) => {
  const txt = { kind: 'txt', key: f.id + '-t', w: textW[i], name: f.name, icon: f.icon, bg: f.tbg, fg: f.tfg, ic: f.tic }
  const pho = { kind: 'photo', key: f.id + '-p', w: photoW[i], src: f.src, pos: f.pos, bg: f.pbg }
  return i % 2 ? [pho, txt] : [txt, pho]
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@500;600&display=swap');
</style>

<style scoped>
.ei {
  --ink: #0d1b2a;
  --gap: 16px;
  --s: 1;
  position: relative;
  padding: clamp(40px, 6vw, 84px) 0 clamp(28px, 4vw, 52px);
  background: #fff;
  font-family: 'Urbanist', system-ui, sans-serif;
  color: var(--ink);
  overflow: hidden;
  isolation: isolate;
}
.ei, .ei *, .ei *::before, .ei *::after { box-sizing: border-box; }
.ei svg { display: block; }

.ei-head { display: flex; flex-direction: column; align-items: center; padding: 0 clamp(16px, 4vw, 48px) clamp(28px, 4vw, 52px); text-align: center; }
.ei-title { max-width: 980px; margin: 0; padding-bottom: 0.1em; color: #0a0a0a; font-size: clamp(34px, 4.2vw, 54px); font-weight: 600; line-height: 1.2; letter-spacing: -1px; }

.ei-viewport { overflow: hidden; }
.ei-track { display: flex; width: max-content; animation: ei-loop 70s linear infinite; will-change: transform; }
.ei-viewport:hover .ei-track, .ei-viewport:active .ei-track { animation-play-state: paused; }
.ei-set { display: flex; gap: var(--gap); padding-right: var(--gap); }
@keyframes ei-loop { to { transform: translateX(-50%); } }

.ei-tile { position: relative; flex: none; width: calc(var(--w, 400) * var(--s) * 1px); height: calc(380px * var(--s)); border-radius: 22px; overflow: hidden; }
.ei-txt { display: flex; flex-direction: column; justify-content: space-between; gap: 20px; padding: calc(30px * var(--s)); }
.ei-ti { display: grid; place-items: center; width: 48px; height: 48px; border-radius: 50%; background: var(--ic, var(--ink)); }
.ei-ti svg { width: 22px; height: 22px; fill: none; stroke: #fff; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
.ei-txt h3 { margin: 0; color: var(--fg, var(--ink)); font-size: clamp(22px, 1.8vw, 27px); font-weight: 600; line-height: 1.2; letter-spacing: -0.03em; }

.ei-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1); }
.ei-photo:hover .ei-img { transform: scale(1.04); }

@media (max-width: 900px) { .ei { --s: 0.88; } }
@media (max-width: 560px) { .ei { --s: 0.76; --gap: 12px; } .ei-track { animation-duration: 56s; } }
@media (prefers-reduced-motion: reduce) {
  .ei-track { animation: none; }
  .ei-viewport { overflow-x: auto; }
  .ei-set[aria-hidden='true'] { display: none; }
}
</style>
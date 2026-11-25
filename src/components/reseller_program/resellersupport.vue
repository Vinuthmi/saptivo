<template>
  <section class="rsp" :class="{ 'rsp-flip': flip }" aria-labelledby="rsp-title">
    <div class="rsp-wrap">
      <div class="rsp-vis" aria-hidden="true">
        <ul class="g">
          <li v-for="t in tiles" :key="t.l"><i><svg viewBox="0 0 24 24"><path v-for="d in t.icon" :key="d" :d="d" /></svg></i><span>{{ t.l }}</span></li>
        </ul>
      </div>
      <div class="rsp-txt">
        <h2 id="rsp-title" class="rsp-h">Training and sales support</h2>
        <p class="rsp-p">Partners receive product training, demo workspaces, sales materials and a dedicated partner contact at Weblook. We help with your first client deployments so you can sell with confidence.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'ResellerSupport' })
/** Copy exactly as supplied. The picture is a drawn mock-up (no photos). Set `flip` to put the picture on the right. */
defineProps({ flip: { type: Boolean, default: true } })

const tiles = [
  { l: 'Product training', icon: ['M3 8l9-4 9 4-9 4Z', 'M7 10.500V15c0 1.500 2.200 3 5 3s5-1.500 5-3v-4.500'] },
  { l: 'Demo workspaces', icon: ['M3 5h18v11H3Z', 'M8 20h8', 'M12 16v4'] },
  { l: 'Sales materials', icon: ['M7 3h8l4 4v14H7Z', 'M15 3v4h4', 'M10 12h6', 'M10 16h6'] },
  { l: 'A dedicated partner contact at Weblook', icon: ['M12 12a3.500 3.500 0 1 0 0-7 3.500 3.500 0 0 0 0 7Z', 'M5 20c0-3.500 3.100-6 7-6s7 2.500 7 6'] },
]
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&family=Urbanist:wght@400;500;600;700&display=swap');
</style>

<style scoped>
.rsp, .rsp * { box-sizing: border-box; }
.rsp { font-family: 'Poppins', system-ui, sans-serif; color: #17191d; background: #fff; }
.rsp-wrap { max-width: 1240px; margin: 0 auto; padding: clamp(40px, 6vw, 88px) clamp(16px, 3vw, 32px); display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); gap: clamp(28px, 6vw, 96px); align-items: center; }
.rsp-flip .rsp-vis { order: 2; }
.rsp-h { margin: 0; font-family: 'Urbanist', system-ui, sans-serif; font-size: clamp(30px, 3.6vw, 48px); font-weight: 600; line-height: 1.1; letter-spacing: -0.05em; color: #0a0a0a; text-wrap: balance; }
.rsp-p { margin: 20px 0 0; max-width: 520px; font-size: clamp(15px, 1.2vw, 17px); line-height: 1.75; color: #4a4d55; text-wrap: pretty; }
.rsp-vis { position: relative; container-type: inline-size; overflow: hidden; aspect-ratio: 1 / 0.9; border-radius: 28px; background: #f4f4f5; display: grid; place-items: center; }
.rsp-vis { background: #ececee; padding: 6%; }
.g { justify-self: stretch; margin: 0; padding: 0; list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 3.4cqw; width: 100%; }
.g li { display: flex; flex-direction: column; justify-content: space-between; gap: 8cqw; min-height: 33cqw; padding: 4.4cqw; border-radius: 4cqw; background: #fff; }
.g li:nth-child(2), .g li:nth-child(3) { background: #f4f1de; }
.g i { display: grid; place-items: center; width: 9cqw; height: 9cqw; border-radius: 50%; background: #ff6b16; }
.g svg { width: 4.6cqw; height: 4.6cqw; fill: none; stroke: #fff; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.g span { font-family: 'Urbanist', sans-serif; font-size: 4.4cqw; font-weight: 600; line-height: 1.15; letter-spacing: -0.03em; color: #17191d; }
@media (max-width: 900px) {
  .rsp-wrap { grid-template-columns: minmax(0, 1fr); }
  .rsp-flip .rsp-vis { order: 0; }
  .rsp-vis { aspect-ratio: 1 / 0.8; }
}
@media (max-width: 560px) { .rsp-vis { border-radius: 24px; aspect-ratio: 1 / 0.9; } }
</style>
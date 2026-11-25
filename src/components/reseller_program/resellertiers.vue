<template>
  <section class="rtr" :class="{ 'rtr-flip': flip }" aria-labelledby="rtr-title">
    <div class="rtr-wrap">
      <div class="rtr-vis" aria-hidden="true">
        <div class="card">
          <div class="cap">Wholesale discount</div>
          <div class="chart">
            <span class="b b1"></span><span class="b b2"></span><span class="b b3"></span><span class="b b4"><i></i></span>
          </div>
          <div class="axis">Monthly partner sales <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg></div>
        </div>
      </div>
      <div class="rtr-txt">
        <h2 id="rtr-title" class="rtr-h">Tiered wholesale pricing</h2>
        <p class="rtr-p">The more you sell, the bigger your wholesale discount. Pricing tiers rise with your monthly partner sales, so your margin grows as your client base grows.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'ResellerTiers' })
/** Copy exactly as supplied. The picture is a drawn mock-up (no photos). Set `flip` to put the picture on the right. */
defineProps({ flip: { type: Boolean, default: true } })
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&family=Urbanist:wght@400;500;600;700&display=swap');
</style>

<style scoped>
.rtr, .rtr * { box-sizing: border-box; }
.rtr { font-family: 'Poppins', system-ui, sans-serif; color: #17191d; background: #fff; }
.rtr-wrap { max-width: 1240px; margin: 0 auto; padding: clamp(40px, 6vw, 88px) clamp(16px, 3vw, 32px); display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); gap: clamp(28px, 6vw, 96px); align-items: center; }
.rtr-flip .rtr-vis { order: 2; }
.rtr-h { margin: 0; font-family: 'Urbanist', system-ui, sans-serif; font-size: clamp(30px, 3.6vw, 48px); font-weight: 600; line-height: 1.1; letter-spacing: -0.05em; color: #0a0a0a; text-wrap: balance; }
.rtr-p { margin: 20px 0 0; max-width: 520px; font-size: clamp(15px, 1.2vw, 17px); line-height: 1.75; color: #4a4d55; text-wrap: pretty; }
.rtr-vis { position: relative; container-type: inline-size; overflow: hidden; aspect-ratio: 1 / 0.9; border-radius: 28px; background: #f4f4f5; display: grid; place-items: center; }
.rtr-vis { background: #ececee; }
.card { width: 74%; padding: 5cqw 5.4cqw 4.4cqw; border-radius: 4.2cqw; background: #fff; box-shadow: 0 5cqw 9cqw -5cqw rgba(23, 25, 29, 0.3); }
.cap { font-family: 'Urbanist', sans-serif; font-size: 3.4cqw; font-weight: 700; color: #17191d; }
.chart { display: flex; align-items: flex-end; gap: 2.6cqw; height: 34cqw; margin-top: 4cqw; padding-bottom: 2cqw; border-bottom: 0.4cqw solid #e4e4e7; }
.b { position: relative; flex: 1; border-radius: 1.6cqw 1.6cqw 0.6cqw 0.6cqw; background: #e4e4e7; }
.b1 { height: 24%; } .b2 { height: 46%; } .b3 { height: 70%; background: #c9c9cd; } .b4 { height: 100%; background: #17191d; }
.b4 i { position: absolute; top: 2.4cqw; left: 50%; width: 3cqw; height: 3cqw; margin-left: -1.5cqw; border-radius: 50%; background: #ff6b16; }
.axis { display: flex; align-items: center; justify-content: flex-end; gap: 1.4cqw; margin-top: 3cqw; font-size: 2.7cqw; font-weight: 500; color: #4a4d55; }
.axis svg { width: 3.4cqw; height: 3.4cqw; fill: none; stroke: #ff6b16; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
@media (max-width: 900px) {
  .rtr-wrap { grid-template-columns: minmax(0, 1fr); }
  .rtr-flip .rtr-vis { order: 0; }
  .rtr-vis { aspect-ratio: 1 / 0.8; }
}
@media (max-width: 560px) { .rtr-vis { border-radius: 24px; aspect-ratio: 1 / 0.9; } }
</style>
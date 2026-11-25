<template>
  <section class="rwl" :class="{ 'rwl-flip': flip }" aria-labelledby="rwl-title">
    <div class="rwl-wrap">
      <div class="rwl-vis" aria-hidden="true">
        <div class="win">
          <div class="bar"><i></i><i></i><i></i><span class="url">Your domain</span></div>
          <div class="body">
            <div class="side">
              <div class="logo">Your logo</div>
              <b></b><b></b><b></b><b></b>
            </div>
            <div class="main">
              <div class="sw"><span class="s1"></span><span class="s2"></span><span class="s3"></span><em>Your colours</em></div>
              <div class="row"></div><div class="row s"></div><div class="row"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="rwl-txt">
        <h2 id="rwl-title" class="rwl-h">White-label CRM under your brand</h2>
        <p class="rwl-p">Offer Saptivo as your own product, with your logo, colours and domain on the CRM and customer portal. Saptivo's white-label CRM option lets you build a recurring software line without a development team.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'ResellerWhiteLabel' })
/** Copy exactly as supplied. The picture is a drawn mock-up (no photos). Set `flip` to put the picture on the right. */
defineProps({ flip: { type: Boolean, default: false } })
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&family=Urbanist:wght@400;500;600;700&display=swap');
</style>

<style scoped>
.rwl, .rwl * { box-sizing: border-box; }
.rwl { font-family: 'Poppins', system-ui, sans-serif; color: #17191d; background: #fff; }
.rwl-wrap { max-width: 1240px; margin: 0 auto; padding: clamp(40px, 6vw, 88px) clamp(16px, 3vw, 32px); display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); gap: clamp(28px, 6vw, 96px); align-items: center; }
.rwl-flip .rwl-vis { order: 2; }
.rwl-h { margin: 0; font-family: 'Urbanist', system-ui, sans-serif; font-size: clamp(30px, 3.6vw, 48px); font-weight: 600; line-height: 1.1; letter-spacing: -0.05em; color: #0a0a0a; text-wrap: balance; }
.rwl-p { margin: 20px 0 0; max-width: 520px; font-size: clamp(15px, 1.2vw, 17px); line-height: 1.75; color: #4a4d55; text-wrap: pretty; }
.rwl-vis { position: relative; container-type: inline-size; overflow: hidden; aspect-ratio: 1 / 0.9; border-radius: 28px; background: #f4f4f5; display: grid; place-items: center; }
.rwl-vis { background: #f4f1de; }
.win { width: 82%; overflow: hidden; border-radius: 4.2cqw; background: #fff; box-shadow: 0 5cqw 9cqw -5cqw rgba(23, 25, 29, 0.35); }
.bar { display: flex; align-items: center; gap: 1.4cqw; padding: 2.6cqw 3.2cqw; background: #ececee; }
.bar i { width: 2cqw; height: 2cqw; border-radius: 50%; background: #c9c9cd; }
.url { margin-left: 2cqw; flex: 1; padding: 1.2cqw 3cqw; border-radius: 99px; background: #fff; font-size: 2.6cqw; font-weight: 500; color: #4a4d55; }
.body { display: grid; grid-template-columns: 30% 1fr; min-height: 38cqw; }
.side { display: flex; flex-direction: column; gap: 2.4cqw; padding: 3.4cqw; border-right: 1px solid #ececee; }
.logo { display: grid; place-items: center; height: 9cqw; border: 0.4cqw dashed #ff6b16; border-radius: 2cqw; font-family: 'Urbanist', sans-serif; font-size: 2.8cqw; font-weight: 700; color: #ff6b16; }
.side b { height: 2.2cqw; border-radius: 99px; background: #ececee; }
.main { display: flex; flex-direction: column; gap: 2.6cqw; padding: 3.8cqw; }
.sw { display: flex; align-items: center; gap: 1.6cqw; margin-bottom: 1.4cqw; }
.sw span { width: 5.6cqw; height: 5.6cqw; border-radius: 50%; }
.s1 { background: #17191d; } .s2 { background: #ff6b16; } .s3 { background: #c9c9cd; }
.sw em { margin-left: 1.4cqw; font-style: normal; font-size: 2.6cqw; font-weight: 500; color: #4a4d55; }
.row { height: 7cqw; border-radius: 2cqw; background: #f4f4f5; }
.row.s { width: 70%; }
@media (max-width: 900px) {
  .rwl-wrap { grid-template-columns: minmax(0, 1fr); }
  .rwl-flip .rwl-vis { order: 0; }
  .rwl-vis { aspect-ratio: 1 / 0.8; }
}
@media (max-width: 560px) { .rwl-vis { border-radius: 24px; aspect-ratio: 1 / 0.9; } }
</style>
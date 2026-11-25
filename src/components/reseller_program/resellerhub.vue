<template>
  <section class="rhb" :class="{ 'rhb-flip': flip }" aria-labelledby="rhb-title">
    <div class="rhb-wrap">
      <div class="rhb-vis" aria-hidden="true">
        <div class="win">
          <ul class="nav">
            <li class="on">Workspaces</li><li>Accounts</li><li>Subscriptions</li><li>Commissions</li>
          </ul>
          <div class="main">
            <div class="stat">
              <span class="lb">Commissions earned this month</span>
              <div class="spark"><i></i><i></i><i></i><i></i><i></i><i></i><i class="hi"></i></div>
            </div>
            <div class="row"><b></b><em>Active</em></div>
            <div class="row"><b></b><em>Active</em></div>
            <div class="cta">Provision new client workspace</div>
          </div>
        </div>
      </div>
      <div class="rhb-txt">
        <h2 id="rhb-title" class="rhb-h">One partner hub for everything</h2>
        <p class="rhb-p">Provision new client workspaces in minutes, manage your accounts, track every client's subscription and see commissions earned this month, all from one central partner dashboard.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'ResellerHub' })
/** Copy exactly as supplied. The picture is a drawn mock-up (no photos). Set `flip` to put the picture on the right. */
defineProps({ flip: { type: Boolean, default: false } })
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&family=Urbanist:wght@400;500;600;700&display=swap');
</style>

<style scoped>
.rhb, .rhb * { box-sizing: border-box; }
.rhb { font-family: 'Poppins', system-ui, sans-serif; color: #17191d; background: #fff; }
.rhb-wrap { max-width: 1240px; margin: 0 auto; padding: clamp(40px, 6vw, 88px) clamp(16px, 3vw, 32px); display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); gap: clamp(28px, 6vw, 96px); align-items: center; }
.rhb-flip .rhb-vis { order: 2; }
.rhb-h { margin: 0; font-family: 'Urbanist', system-ui, sans-serif; font-size: clamp(30px, 3.6vw, 48px); font-weight: 600; line-height: 1.1; letter-spacing: -0.05em; color: #0a0a0a; text-wrap: balance; }
.rhb-p { margin: 20px 0 0; max-width: 520px; font-size: clamp(15px, 1.2vw, 17px); line-height: 1.75; color: #4a4d55; text-wrap: pretty; }
.rhb-vis { position: relative; container-type: inline-size; overflow: hidden; aspect-ratio: 1 / 0.9; border-radius: 28px; background: #f4f4f5; display: grid; place-items: center; }
.rhb-vis { background: #f4f1de; }
.win { display: grid; grid-template-columns: 31% 1fr; width: 86%; overflow: hidden; border-radius: 4.2cqw; background: #fff; box-shadow: 0 5cqw 9cqw -5cqw rgba(23, 25, 29, 0.35); }
.nav { margin: 0; padding: 4cqw 3cqw; list-style: none; display: flex; flex-direction: column; gap: 1.6cqw; background: #f4f4f5; }
.nav li { padding: 2.2cqw 2.6cqw; border-radius: 2cqw; font-size: 2.6cqw; font-weight: 500; color: #4a4d55; }
.nav li.on { background: #17191d; color: #fff; }
.main { display: flex; flex-direction: column; gap: 2.6cqw; padding: 4cqw; }
.stat { padding: 3.4cqw; border-radius: 3cqw; background: #f4f1de; }
.lb { font-size: 2.6cqw; font-weight: 500; color: #4a4d55; }
.spark { display: flex; align-items: flex-end; gap: 1.6cqw; height: 13cqw; margin-top: 3cqw; }
.spark i { flex: 1; border-radius: 1cqw; background: #c9c9cd; }
.spark i:nth-child(1) { height: 30%; } .spark i:nth-child(2) { height: 42%; } .spark i:nth-child(3) { height: 38%; } .spark i:nth-child(4) { height: 58%; } .spark i:nth-child(5) { height: 66%; } .spark i:nth-child(6) { height: 80%; } .spark i.hi { height: 100%; background: #ff6b16; }
.row { display: flex; align-items: center; justify-content: space-between; padding: 2.4cqw 3cqw; border-radius: 2.4cqw; background: #f4f4f5; }
.row b { width: 42%; height: 2.2cqw; border-radius: 99px; background: #dcdce0; }
.row em { padding: 0.8cqw 2.2cqw; border-radius: 99px; background: #fff; font-style: normal; font-size: 2.2cqw; font-weight: 600; color: #17191d; }
.cta { align-self: flex-start; padding: 2.4cqw 3.6cqw; border-radius: 99px; background: #ff6b16; font-size: 2.5cqw; font-weight: 600; color: #fff; }
@media (max-width: 900px) {
  .rhb-wrap { grid-template-columns: minmax(0, 1fr); }
  .rhb-flip .rhb-vis { order: 0; }
  .rhb-vis { aspect-ratio: 1 / 0.8; }
}
@media (max-width: 560px) { .rhb-vis { border-radius: 24px; aspect-ratio: 1 / 0.9; } }
</style>
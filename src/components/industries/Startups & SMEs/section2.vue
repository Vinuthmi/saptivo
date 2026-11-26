
<script setup>
defineOptions({ name: 'StartupBestCRM' })

const channels = [
  {
    name: 'WhatsApp',
    color: '#259D62',
    icon: 'M21 11.5a9 9 0 0 1-13.5 7.8L3 21l1.7-4.5A9 9 0 1 1 21 11.5zM8 9c1 4 3 6 7 7l2-2-3-2-1 1-2-2 1-1-2-3z'
  },
  {
    name: '3CX',
    color: '#4787C6',
    icon: 'M4 3h5l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v5c-10 3-20-7-17-17z'
  },
  {
    name: 'LKR invoicing',
    color: '#88765E',
    icon: 'M5 3h14v18l-3-2-4 2-4-2-3 2zM8 8h8M8 12h8M8 16h4'
  }
]

const menu = ['Contacts', 'Sales pipeline', 'Quotations']
</script>

<template>
  <section class="sbc" aria-labelledby="sbc-title">

    <div class="sbc-wrap">

      <!-- Main content -->

      <div class="sbc-copy">

        <h2 id="sbc-title">
          Is Saptivo the best
          <span>CRM for SMEs?</span>
        </h2>

        <p>
          The best CRM for an SME is affordable, quick
          to learn and fits local channels. Saptivo checks
          all three: transparent pricing, a clean interface
          and built-in WhatsApp, 3CX and LKR invoicing for
          businesses in Sri Lanka and beyond.
        </p>

      </div>

      <!-- Bento grid -->

      <div class="sbc-grid">

        <!-- Affordable -->

        <article class="sbc-card sbc-pricing">

          <div class="sbc-visual" aria-hidden="true">

            <div class="sbc-price-window">

              <div class="sbc-window-top">
                <span>Pricing overview</span>
                <span class="sbc-dots">
                  <i></i><i></i><i></i>
                </span>
              </div>

              <small>Simple and transparent</small>

              <strong>Flexible plans</strong>

              <div class="sbc-price-line">
                <span>Clear pricing</span>
                <span class="sbc-check">✓</span>
              </div>

              <div class="sbc-price-line">
                <span>Room to grow</span>
                <span class="sbc-check">✓</span>
              </div>

            </div>

          </div>

          <div class="sbc-card-copy">
            <h3>Affordable</h3>
            <p>Transparent pricing for small businesses.</p>
          </div>

        </article>

        <!-- Easy to learn -->

        <article class="sbc-card sbc-interface">

          <div class="sbc-visual" aria-hidden="true">

            <div class="sbc-app">

              <div class="sbc-window-top">
                <b>Saptivo</b>
                <span class="sbc-dots">
                  <i></i><i></i><i></i>
                </span>
              </div>

              <div class="sbc-app-body">

                <div class="sbc-sidebar">

                  <div
                    v-for="(item, index) in menu"
                    :key="item"
                    :class="{ selected: index === 1 }"
                  >
                    <i></i>
                    {{ item }}
                  </div>

                </div>

                <div class="sbc-app-content">

                  <strong>Overview</strong>

                  <div class="sbc-mini-stats">
                    <i></i><i></i>
                  </div>

                  <div class="sbc-mini-chart">
                    <i
                      v-for="(height, index) in [35, 55, 45, 75, 65, 90]"
                      :key="index"
                      :style="{
                        height: height + '%',
                        '--delay': index * .1 + 's'
                      }"
                    ></i>
                  </div>

                </div>

              </div>

            </div>

          </div>

          <div class="sbc-card-copy">
            <h3>Quick to learn</h3>
            <p>A clean and intuitive CRM interface.</p>
          </div>

        </article>

        <!-- Local channels -->

        <article class="sbc-card sbc-local">

          <div class="sbc-local-visual" aria-hidden="true">

            <div class="sbc-connection-line"></div>

            <div
              v-for="channel in channels"
              :key="channel.name"
              class="sbc-channel"
            >

              <span
                class="sbc-channel-icon"
                :style="{ color: channel.color }"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path :d="channel.icon"/>
                </svg>
              </span>

              <strong>{{ channel.name }}</strong>

              <span class="sbc-connected">
                <i></i>
                Connected
              </span>

            </div>

          </div>

          <div class="sbc-card-copy">
            <h3>Built for local businesses</h3>
            <p>Connect the channels your business already uses.</p>
          </div>

        </article>

      </div>

    </div>

  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800&family=Poppins:wght@400;500;600&display=swap');

.sbc,
.sbc * {
  box-sizing: border-box;
}

.sbc {
  width: 100%;
  background: #fff;
  padding: clamp(56px, 7vw, 110px) 0;
}

.sbc-wrap {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 clamp(24px, 6vw, 96px);
  display: grid;
  grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr);
  align-items: center;
  gap: clamp(40px, 6vw, 96px);
}

/* Main content */

.sbc-copy h2 {
  margin: 0 0 24px;
  font-family: 'Urbanist', sans-serif;
  font-size: clamp(34px, 4vw, 58px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -.05em;
  color: #111 !important;
}

.sbc-copy h2 span {
  display: block;
  background: linear-gradient(100deg, #a1a1aa, #777780);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.sbc-copy p {
  max-width: 54ch;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  line-height: 1.85;
  color: #666b73;
}

/* Bento layout */

.sbc-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.sbc-card {
  position: relative;
  isolation: isolate;
  min-width: 0;
  overflow: hidden;
  border-radius: 26px;
  padding: 24px;
}

.sbc-card::before {
  content: '';
  position: absolute;
  z-index: -1;
  width: 340px;
  height: 340px;
  top: -160px;
  right: -120px;
  border: 1px solid rgba(255,255,255,.8);
  border-radius: 50%;
  box-shadow: 0 0 0 28px rgba(255,255,255,.12);
}

.sbc-pricing {
  background: linear-gradient(145deg, #f5ede2, #e9dac7);
}

.sbc-interface {
  background: linear-gradient(145deg, #eef2f6, #dce4ef);
}

.sbc-local {
  grid-column: 1 / -1;
  background: linear-gradient(145deg, #edf3e9, #dce7d7);
}

.sbc-visual {
  min-height: 205px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sbc-card-copy {
  margin-top: 24px;
}

.sbc-card-copy h3 {
  margin: 0 0 8px;
  font-family: 'Urbanist', sans-serif;
  font-size: clamp(23px, 2.2vw, 30px);
  font-weight: 600;
  letter-spacing: -.035em;
  line-height: 1.15;
  color: #222;
}

.sbc-card-copy p {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  line-height: 1.7;
  color: #666b73;
}

/* Pricing illustration */

.sbc-price-window,
.sbc-app {
  width: 100%;
  max-width: 290px;
  background: #fff;
  border: 1px solid rgba(255,255,255,.9);
  border-radius: 16px;
  padding: 15px;
  box-shadow: 0 20px 35px -22px rgba(30,30,30,.35);
  font-family: 'Poppins', sans-serif;
}

.sbc-window-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
  font-size: 10px;
  font-weight: 600;
  color: #555;
}

.sbc-dots {
  display: flex;
  gap: 4px;
}

.sbc-dots i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #dcdce1;
}

.sbc-price-window > small {
  display: block;
  margin: 16px 0 5px;
  font-size: 9px;
  color: #999;
}

.sbc-price-window > strong {
  display: block;
  margin-bottom: 12px;
  font-family: 'Urbanist', sans-serif;
  font-size: 25px;
  letter-spacing: -.04em;
  color: #292929;
}

.sbc-price-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-top: 1px solid #f0f0f2;
  font-size: 10px;
  color: #666;
}

.sbc-check {
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #e2eddf;
  color: #63825e;
}

/* CRM interface */

.sbc-app {
  padding: 12px;
}

.sbc-app-body {
  display: grid;
  grid-template-columns: .85fr 1fr;
  gap: 10px;
  padding-top: 14px;
}

.sbc-sidebar {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.sbc-sidebar > div {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 5px;
  border-radius: 6px;
  font-size: 8px;
  color: #777;
}

.sbc-sidebar > div.selected {
  background: #e7edf5;
  color: #4e627d;
}

.sbc-sidebar i {
  flex: none;
  width: 9px;
  height: 9px;
  border: 1px solid currentColor;
  border-radius: 3px;
}

.sbc-app-content {
  min-width: 0;
}

.sbc-app-content > strong {
  font-size: 11px;
  color: #333;
}

.sbc-mini-stats {
  display: flex;
  gap: 5px;
  margin: 10px 0;
}

.sbc-mini-stats i {
  flex: 1;
  height: 30px;
  border-radius: 5px;
  background: #eef1f5;
}

.sbc-mini-chart {
  height: 65px;
  display: flex;
  align-items: flex-end;
  gap: 5px;
}

.sbc-mini-chart i {
  flex: 1;
  border-radius: 3px 3px 0 0;
  background: #aebed2;
  transform-origin: bottom;
  animation: sbc-grow 1s var(--delay) ease both;
}

@keyframes sbc-grow {
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
}

/* Local integrations */

.sbc-local-visual {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: center;
  gap: 14px;
  padding: 12px 0;
}

.sbc-connection-line {
  position: absolute;
  left: 10%;
  right: 10%;
  top: 50%;
  height: 1px;
  border-top: 2px dashed #a8b9a2;
}

.sbc-channel {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 18px 8px;
  border: 1px solid rgba(255,255,255,.9);
  border-radius: 16px;
  background: #fff;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 12px 25px -18px rgba(30,30,30,.3);
}

.sbc-channel-icon {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: #f7f7f8;
}

.sbc-channel-icon svg {
  width: 26px;
  height: 26px;
}

.sbc-channel strong {
  font-size: 11px;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.sbc-connected {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 9px;
  color: #688463;
}

.sbc-connected i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
}

/* Responsive */

@media (max-width: 1050px) {
  .sbc-wrap {
    grid-template-columns: minmax(0, 1fr);
    gap: 36px;
  }

  .sbc-copy p {
    max-width: 70ch;
  }
}

@media (max-width: 640px) {
  .sbc {
    padding: 48px 0;
  }

  .sbc-wrap {
    padding: 0 20px;
  }

  .sbc-copy h2 {
    font-size: 38px;
    margin-bottom: 18px;
  }

  .sbc-copy p {
    font-size: 14px;
  }

  .sbc-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .sbc-card {
    padding: 22px;
    border-radius: 22px;
  }

  .sbc-local-visual {
    gap: 7px;
  }

  .sbc-channel {
    padding: 14px 5px;
  }

  .sbc-channel strong {
    font-size: 9px;
  }

  .sbc-connected {
    font-size: 8px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sbc * {
    animation: none !important;
    transition: none !important;
  }
}
</style>

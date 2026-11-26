
<script setup>
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount
} from 'vue'

defineOptions({ name: 'StartupExcelMigration' })

const root = ref(null)
const stage = ref(0)
const still = ref(false)

let observer = null
let timer = null

const steps = [
  'Upload file',
  'Map columns',
  'Import contacts'
]

const contacts = [
  {
    name: 'Sarah Wilson',
    company: 'Studio Co.',
    initials: 'SW',
    phone: '077 ••• 1024',
    color: '#E9E1D5'
  },
  {
    name: 'Daniel Lee',
    company: 'Bright Tech',
    initials: 'DL',
    phone: '071 ••• 2048',
    color: '#E0E8F1'
  },
  {
    name: 'Alex Morgan',
    company: 'Urban Works',
    initials: 'AM',
    phone: '076 ••• 3096',
    color: '#E1EBDD'
  }
]

const fields = [
  { source: 'Customer Name', target: 'Contact name' },
  { source: 'Company', target: 'Company name' },
  { source: 'Phone', target: 'Phone number' }
]

const progress = computed(() => ((stage.value + 1) / 3) * 100)

function start() {
  if (timer || still.value) return

  timer = setInterval(() => {
    stage.value = (stage.value + 1) % 3
  }, 3000)
}

function stop() {
  clearInterval(timer)
  timer = null
}

function selectStage(index) {
  stop()
  stage.value = index
}

onMounted(() => {
  still.value = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches

  if (still.value || !('IntersectionObserver' in window)) {
    stage.value = 2
    return
  }

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        start()
      } else {
        stop()
      }
    },
    { threshold: .2 }
  )

  if (root.value) observer.observe(root.value)
})

onBeforeUnmount(() => {
  stop()
  observer?.disconnect()
})
</script>

<template>
  <section
    ref="root"
    class="sem"
    aria-labelledby="sem-title"
  >

    <div class="sem-wrap">

      <!-- Section heading -->

      <header class="sem-header">

        <h2 id="sem-title">
          Moving from Excel <span>to a CRM</span>
        </h2>

        <p>
          If your customer list lives in Excel, you're
          closer to a CRM than you think. Upload the file
          to Saptivo, map the columns and your data becomes
          searchable, shareable and connected to every
          quote and conversation from then on.
        </p>

      </header>

      <!-- Migration visual -->

      <div class="sem-panel">

        <span class="sem-orbit sem-orbit-one"></span>
        <span class="sem-orbit sem-orbit-two"></span>

        <div class="sem-migration">

          <!-- Excel window -->

          <div class="sem-window sem-excel">

            <div class="sem-window-header">

              <span class="sem-excel-icon">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="4" y="3" width="16" height="18" rx="2"/>
                  <path d="M4 9h16M4 15h16M12 3v18"/>
                </svg>

              </span>

              <div class="sem-window-title">

                <strong>Customers.xlsx</strong>

                <small>Existing customer spreadsheet</small>

              </div>

              <span class="sem-dots">
                <i></i><i></i><i></i>
              </span>

            </div>

            <div class="sem-sheet-scroll">

              <table class="sem-sheet">

                <thead>
                  <tr>
                    <th></th>
                    <th>A</th>
                    <th>B</th>
                    <th>C</th>
                  </tr>
                </thead>

                <tbody>

                  <tr class="sem-sheet-labels">
                    <td>1</td>
                    <td>Customer Name</td>
                    <td>Company</td>
                    <td>Phone</td>
                  </tr>

                  <tr
                    v-for="(contact, index) in contacts"
                    :key="contact.name"
                    :class="{ 'sem-selected': stage >= 1 }"
                  >
                    <td>{{ index + 2 }}</td>
                    <td>{{ contact.name }}</td>
                    <td>{{ contact.company }}</td>
                    <td>{{ contact.phone }}</td>
                  </tr>

                  <tr v-for="row in 3" :key="'empty-' + row">
                    <td>{{ row + 4 }}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>

                </tbody>

              </table>

            </div>

            <div class="sem-sheet-footer">

              <span class="sem-sheet-tab">Customers</span>

              <span>3 records</span>

            </div>

            <div class="sem-file-ready">

              <span class="sem-check">✓</span>

              <div>
                <strong>File ready to import</strong>
                <small>Customer records detected</small>
              </div>

            </div>

          </div>

          <!-- Connection animation -->

          <div class="sem-connection" aria-hidden="true">

            <span class="sem-line">
              <i></i>
            </span>

            <span
              class="sem-sync"
              :class="{ 'sem-sync-done': stage === 2 }"
            >

              <svg
                v-if="stage !== 2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 7v5h-5M4 17v-5h5"/>
                <path d="M6 7a7 7 0 0 1 12-1l2 3"/>
                <path d="m4 15 2 3a7 7 0 0 0 12-1"/>
              </svg>

              <svg
                v-else
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m5 12 5 5 9-10"/>
              </svg>

            </span>

            <span class="sem-line">
              <i></i>
            </span>

          </div>

          <!-- CRM window -->

          <div class="sem-window sem-crm">

            <div class="sem-window-header">

              <span class="sem-crm-icon">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="4"/>
                  <path d="M8 16v-4M12 16V8M16 16v-6"/>
                </svg>

              </span>

              <div class="sem-window-title">

                <strong>Saptivo CRM</strong>

                <small>Contact management</small>

              </div>

              <span class="sem-crm-status">
                <i></i>
                {{ stage === 2 ? 'Imported' : 'Importing' }}
              </span>

            </div>

            <div class="sem-crm-body">

              <Transition name="sem-switch" mode="out-in">

                <!-- Upload stage -->

                <div
                  v-if="stage === 0"
                  key="upload"
                  class="sem-upload"
                >

                  <span class="sem-upload-icon">

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M12 16V3m-5 5 5-5 5 5"/>
                      <path d="M3 16v4h18v-4"/>
                    </svg>

                  </span>

                  <strong>Import your contacts</strong>

                  <small>Customers.xlsx</small>

                  <div class="sem-upload-progress">
                    <i></i>
                  </div>

                  <span>Uploading spreadsheet...</span>

                </div>

                <!-- Column mapping stage -->

                <div
                  v-else-if="stage === 1"
                  key="mapping"
                  class="sem-mapping"
                >

                  <div class="sem-mapping-label">

                    <strong>Spreadsheet column</strong>

                    <strong>CRM field</strong>

                  </div>

                  <div
                    v-for="field in fields"
                    :key="field.source"
                    class="sem-map-row"
                  >

                    <span>{{ field.source }}</span>

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.6"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M4 12h16m-6-6 6 6-6 6"/>
                    </svg>

                    <span>{{ field.target }}</span>

                  </div>

                  <div class="sem-map-success">

                    <span class="sem-check">✓</span>

                    All columns matched

                  </div>

                </div>

                <!-- Imported contacts stage -->

                <div
                  v-else
                  key="contacts"
                  class="sem-contacts"
                >

                  <div class="sem-contacts-heading">

                    <strong>All contacts</strong>

                    <span>3 imported</span>

                  </div>

                  <div
                    v-for="contact in contacts"
                    :key="contact.name"
                    class="sem-contact"
                  >

                    <span
                      class="sem-avatar"
                      :style="{ background: contact.color }"
                    >
                      {{ contact.initials }}
                    </span>

                    <div class="sem-contact-copy">

                      <strong>{{ contact.name }}</strong>

                      <small>{{ contact.company }}</small>

                    </div>

                    <span class="sem-check">✓</span>

                  </div>

                </div>

              </Transition>

            </div>

            <div class="sem-crm-footer">

              <span>Import progress</span>

              <strong>{{ Math.round(progress) }}%</strong>

            </div>

            <div class="sem-progress">

              <i :style="{ width: progress + '%' }"></i>

            </div>

          </div>

        </div>

        <!-- Interactive stage controls -->

        <div class="sem-steps">

          <button
            v-for="(step, index) in steps"
            :key="step"
            type="button"
            class="sem-step"
            :class="{ 'sem-step-active': stage === index }"
            :aria-pressed="stage === index"
            @click="selectStage(index)"
          >

            <span class="sem-step-number">

              <span v-if="stage > index">✓</span>

              <span v-else>0{{ index + 1 }}</span>

            </span>

            {{ step }}

          </button>

        </div>

      </div>

    </div>

  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&family=Poppins:wght@400;500;600&display=swap');

.sem,
.sem * {
  box-sizing: border-box;
}

.sem {
  width: 100%;
  padding: clamp(56px, 7vw, 110px) 0;
  background: #fff;
}

.sem-wrap {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 clamp(24px, 5vw, 80px);
}

/* Heading */

.sem-header {
  max-width: 900px;
  margin: 0 auto 44px;
  text-align: center;
}

.sem-header h2 {
  margin: 0 0 20px;
  font-family: 'Urbanist', sans-serif;
  font-size: clamp(34px, 4vw, 58px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -.05em;
  color: #111 !important;
}

.sem-header h2 span {
  background: linear-gradient(100deg, #a1a1aa, #777780);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.sem-header p {
  max-width: 780px;
  margin: 0 auto;
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  line-height: 1.85;
  color: #666b73;
}

/* Main panel */

.sem-panel {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: clamp(32px, 5vw, 72px);
  border-radius: 36px;
  background: linear-gradient(
    135deg,
    #f5f1eb,
    #eae4da 55%,
    #e3dcd0
  );
}

.sem-orbit {
  position: absolute;
  z-index: -1;
  border: 1px solid rgba(255,255,255,.85);
  border-radius: 50%;
  pointer-events: none;
}

.sem-orbit-one {
  width: 900px;
  height: 900px;
  top: -450px;
  left: -150px;
}

.sem-orbit-two {
  width: 750px;
  height: 750px;
  top: -375px;
  left: -75px;
}

.sem-migration {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 100px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
}

/* Windows */

.sem-window {
  min-width: 0;
  padding: 22px;
  border-radius: 22px;
  background: #fff;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 25px 50px -25px rgba(40,35,30,.3);
}

.sem-window-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 18px;
  border-bottom: 1px solid #eee;
}

.sem-excel-icon,
.sem-crm-icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  color: #fff;
}

.sem-excel-icon {
  background: #217346;
}

.sem-crm-icon {
  background: #292929;
}

.sem-excel-icon svg,
.sem-crm-icon svg {
  width: 23px;
  height: 23px;
}

.sem-window-title {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 5px;
}

.sem-window-title strong {
  font-family: 'Urbanist', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #292929;
}

.sem-window-title small {
  font-size: 10px;
  color: #999;
}

.sem-dots {
  display: flex;
  gap: 4px;
}

.sem-dots i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #dedee4;
}

/* Excel spreadsheet */

.sem-sheet-scroll {
  margin-top: 18px;
  overflow-x: auto;
}

.sem-sheet {
  width: 100%;
  min-width: 340px;
  border-collapse: collapse;
  table-layout: auto;
  font-size: 10px;
  color: #555;
}

.sem-sheet th,
.sem-sheet td {
  height: 34px;
  padding: 7px 9px;
  border: 1px solid #e5e7e5;
  text-align: left;
  white-space: nowrap;
}

.sem-sheet thead th {
  background: #f1f3f1;
  text-align: center;
  font-weight: 500;
  color: #777;
}

.sem-sheet td:first-child {
  width: 25px;
  background: #f4f5f4;
  text-align: center;
  color: #999;
}

.sem-sheet-labels td:not(:first-child) {
  background: #e4eee5;
  font-weight: 600;
  color: #3b6342;
}

.sem-sheet .sem-selected td:not(:first-child) {
  background: #edf6ed;
  transition: background .5s ease;
}

.sem-sheet-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 0;
  font-size: 10px;
  color: #999;
}

.sem-sheet-tab {
  padding: 5px 10px;
  border-bottom: 2px solid #217346;
  font-weight: 600;
  color: #217346;
}

.sem-file-ready {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
  padding: 12px;
  border-radius: 10px;
  background: #eef4eb;
}

.sem-file-ready > div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sem-file-ready strong {
  font-size: 11px;
  font-weight: 600;
  color: #496a43;
}

.sem-file-ready small {
  font-size: 9px;
  color: #7c9277;
}

.sem-check {
  display: grid;
  place-items: center;
  flex: none;
  width: 21px;
  height: 21px;
  border-radius: 50%;
  background: #dfeadb;
  color: #64815f;
  font-size: 12px;
  font-weight: 600;
}

/* Connection */

.sem-connection {
  display: flex;
  align-items: center;
  justify-content: center;
}

.sem-line {
  position: relative;
  flex: 1;
  height: 2px;
  overflow: hidden;
  background: #c4bbae;
}

.sem-line i {
  position: absolute;
  inset: 0;
  background: #8a9f83;
  animation: sem-flow 1.4s linear infinite;
}

@keyframes sem-flow {
  from { transform: translateX(-100%); }
  to { transform: translateX(100%); }
}

.sem-sync {
  display: grid;
  place-items: center;
  flex: none;
  width: 46px;
  height: 46px;
  border: 1px solid #d6cdbf;
  border-radius: 50%;
  background: #fff;
  color: #8c7d69;
  transition: background .4s, color .4s;
}

.sem-sync svg {
  width: 23px;
  height: 23px;
  animation: sem-spin 2s linear infinite;
}

.sem-sync-done {
  background: #e2eddf;
  border-color: #d1dfcc;
  color: #63825e;
}

.sem-sync-done svg {
  animation: none;
}

@keyframes sem-spin {
  to { transform: rotate(360deg); }
}

/* CRM */

.sem-crm-status {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 8px;
  border-radius: 20px;
  background: #e8f0e5;
  color: #64815f;
  font-size: 9px;
}

.sem-crm-status i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
}

.sem-crm-body {
  min-height: 270px;
  padding: 20px 0;
}

/* Upload stage */

.sem-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 230px;
  padding: 20px;
  border: 1px dashed #d7d7dc;
  border-radius: 14px;
  background: #fafafa;
}

.sem-upload-icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #efede8;
  color: #8b7d69;
}

.sem-upload-icon svg {
  width: 26px;
  height: 26px;
}

.sem-upload > strong {
  font-size: 13px;
  color: #444;
}

.sem-upload > small,
.sem-upload > span:last-child {
  font-size: 10px;
  color: #999;
}

.sem-upload-progress {
  width: 80%;
  height: 5px;
  margin: 6px 0;
  overflow: hidden;
  border-radius: 5px;
  background: #e9e9ed;
}

.sem-upload-progress i {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background: #91a88a;
  transform-origin: left;
  animation: sem-uploading 2.5s ease both;
}

@keyframes sem-uploading {
  from { transform: scaleX(.1); }
  to { transform: scaleX(1); }
}

/* Mapping stage */

.sem-mapping-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.sem-mapping-label strong {
  font-size: 10px;
  font-weight: 600;
  color: #888;
}

.sem-map-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 24px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.sem-map-row span {
  padding: 12px 8px;
  border-radius: 8px;
  background: #f3f3f5;
  font-size: 10px;
  color: #666;
}

.sem-map-row span:last-child {
  background: #e8f0e5;
  color: #64815f;
}

.sem-map-row svg {
  width: 20px;
  height: 20px;
  color: #999;
}

.sem-map-success {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  font-size: 11px;
  color: #64815f;
}

/* Imported contacts */

.sem-contacts-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.sem-contacts-heading strong {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.sem-contacts-heading span {
  font-size: 10px;
  color: #64815f;
}

.sem-contact {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 10px;
  margin-bottom: 8px;
  border: 1px solid #eeeef0;
  border-radius: 10px;
}

.sem-avatar {
  display: grid;
  place-items: center;
  flex: none;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 600;
  color: #666;
}

.sem-contact-copy {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 5px;
}

.sem-contact-copy strong {
  font-size: 12px;
  font-weight: 600;
  color: #333;
}

.sem-contact-copy small {
  font-size: 10px;
  color: #999;
}

/* Progress */

.sem-crm-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 10px;
  color: #888;
}

.sem-crm-footer strong {
  font-weight: 600;
  color: #333;
}

.sem-progress {
  height: 5px;
  overflow: hidden;
  border-radius: 5px;
  background: #eee;
}

.sem-progress i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: #8da486;
  transition: width .6s ease;
}

/* Stage controls */

.sem-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  max-width: max-content;
  margin: 36px auto 0;
  padding: 6px;
  border: 1px solid rgba(255,255,255,.8);
  border-radius: 16px;
  background: rgba(255,255,255,.55);
}

.sem-step {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 20px;
  border: none;
  border-radius: 11px;
  background: transparent;
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #777;
  cursor: pointer;
  transition: background .3s, color .3s;
}

.sem-step-number {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e2ded6;
  color: #777;
  font-size: 10px;
}

.sem-step-active {
  background: #292929;
  color: #fff;
}

.sem-step-active .sem-step-number {
  background: rgba(255,255,255,.15);
  color: #fff;
}

/* Stage transition */

.sem-switch-enter-active,
.sem-switch-leave-active {
  transition: opacity .25s ease, transform .25s ease;
}

.sem-switch-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.sem-switch-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Responsive */

@media (max-width: 1150px) {
  .sem-migration {
    grid-template-columns: minmax(0, 1fr) 55px minmax(0, 1fr);
    gap: 6px;
  }

  .sem-window {
    padding: 16px;
  }

  .sem-sync {
    width: 36px;
    height: 36px;
  }

  .sem-sync svg {
    width: 19px;
    height: 19px;
  }

  .sem-dots {
    display: none;
  }
}

@media (max-width: 900px) {
  .sem-migration {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
  }

  .sem-window {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
  }

  .sem-connection {
    flex-direction: column;
    height: 80px;
  }

  .sem-line {
    width: 2px;
    height: auto;
  }

  .sem-line i {
    animation: sem-flow-vertical 1.4s linear infinite;
  }

  @keyframes sem-flow-vertical {
    from { transform: translateY(-100%); }
    to { transform: translateY(100%); }
  }
}

@media (max-width: 640px) {
  .sem {
    padding: 48px 0;
  }

  .sem-wrap {
    padding: 0 16px;
  }

  .sem-header {
    padding: 0 8px;
    margin-bottom: 30px;
  }

  .sem-header h2 {
    font-size: 36px;
  }

  .sem-header p {
    font-size: 14px;
  }

  .sem-panel {
    padding: 20px 12px;
    border-radius: 26px;
  }

  .sem-window {
    padding: 14px;
    border-radius: 18px;
  }

  .sem-window-header {
    gap: 8px;
  }

  .sem-window-title strong {
    font-size: 16px;
  }

  .sem-window-title small {
    font-size: 9px;
  }

  .sem-excel-icon,
  .sem-crm-icon {
    width: 34px;
    height: 34px;
  }

  .sem-crm-status {
    font-size: 8px;
  }

  .sem-steps {
    width: 100%;
    max-width: 100%;
    gap: 4px;
    margin-top: 24px;
  }

  .sem-step {
    flex: 1;
    flex-direction: column;
    gap: 6px;
    padding: 10px 5px;
    font-size: 9px;
  }

  .sem-contact-copy strong {
    font-size: 11px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sem *,
  .sem *::before,
  .sem *::after {
    animation: none !important;
    transition: none !important;
  }
}
</style>

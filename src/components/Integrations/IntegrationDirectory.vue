<template>
  <div ref="root" class="isc" :class="{ 'isc-arm': armed }" aria-label="Saptivo integrations" :style="{ '--logo': `url(${logoSrc})` }">
    <!-- shared icon sprite -->
    <svg width="0" height="0" style="position: absolute" aria-hidden="true" focusable="false">
      <symbol id="isc-check" viewBox="0 0 24 24"><path d="m6 12.5 4 4 8-9" /></symbol>
      <symbol id="isc-phone" viewBox="0 0 24 24"><path d="M6.6 3.5h3l1.3 4-2 1.3a11 11 0 0 0 5.3 5.3l1.3-2 4 1.3v3a2 2 0 0 1-2.2 2A15.8 15.8 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z" /></symbol>
      <symbol id="isc-sync" viewBox="0 0 24 24"><path d="M4 9a8 8 0 0 1 14-3l2 2M20 15a8 8 0 0 1-14 3l-2-2M20 4v4h-4M4 20v-4h4" /></symbol>
    </svg>

    <!-- every integration is its own section: visual on one side, heading and text on the other (alternating) -->
    <section
      v-for="(c, i) in cards"
      :key="c.key"
      class="sec"
      :class="['k-' + c.key, { flip: i % 2 === 1, in: seen[i] }]"
      :ref="(el) => (secs[i] = el)"
      :aria-labelledby="'isc-h-' + c.key"
    >
      <div class="sec-in">
        <!-- ===================== visual card ===================== -->
        <div class="visw"><div class="vis" aria-hidden="true">
          <img v-if="c.img" class="bgp" :src="c.img" alt="" loading="lazy" decoding="async" draggable="false" @error="$event.target.style.display = 'none'" />
          <span class="wash"></span>

            <!-- 01 · WordPress -->
            <template v-if="c.key === 'wordpress'">
              <div class="win w-wp">
                <div class="win-bar"><i></i><i></i><i></i><span class="url">yourwebsite.com/contact</span></div>
                <div class="win-body">
                  <b class="f-title">Contact us</b>
                  <div class="field"><small>Name</small><u></u></div>
                  <div class="field"><small>Email</small><u></u></div>
                  <div class="field"><small>Message</small><u class="tall"></u></div>
                  <span class="btn-navy">Send message</span>
                </div>
              </div>
              <span class="brand wpk float" style="--d: 0s; right: 7%; top: 6%" v-html="logos.wp"></span>
              <div class="glass g-wp-note float" style="--d: 1.2s">
                <div class="g-h"><span class="lg" aria-hidden="true"></span><b>New inquiry</b><em class="chip ok">just now</em></div>
                <div class="chips"><span>Customer details</span><span>Message</span><span>Page they came from</span></div>
              </div>
              <div class="glass g-wp-side float" style="--d: 2.4s">
                <div class="rw"><small>Customer</small><u></u></div>
                <div class="rw"><small>Assigned to</small><span class="av"></span><b>Round-robin</b></div>
                <div class="rw"><small>Status</small><em class="chip wip">New</em></div>
              </div>
            </template>

            <!-- 02 · Facebook -->
            <template v-else-if="c.key === 'facebook'">
              <div class="phone ph-fb float" style="--d: 0s">
                <div class="ph-screen">
                  <div class="fb-top"><i class="fbc" v-html="logos.fb"></i><div><b>Your Facebook Page</b><small>Instant Form</small></div></div>
                  <div class="field"><small>Full name</small><u></u></div>
                  <div class="field"><small>Email</small><u></u></div>
                  <div class="field"><small>Phone</small><u></u></div>
                  <span class="btn-fb">Submit</span>
                </div>
              </div>
              <span class="brand fbk float" style="--d: 0.8s; right: 7%; top: 6%" v-html="logos.fb"></span>
              <div class="glass g-fb-lead float" style="--d: 1.4s">
                <div class="g-h"><span class="lg" aria-hidden="true"></span><b>New lead</b></div>
                <div class="rw"><small>Lead score</small><span class="meter"><i></i></span></div>
                <div class="rw"><small>Routed to</small><span class="av"></span><b>Salesperson</b></div>
              </div>
              <div class="glass g-fb-sent float" style="--d: 2.6s"><i class="dot"></i>WhatsApp or SMS acknowledgement</div>
            </template>

            <!-- 03 · WhatsApp -->
            <template v-else-if="c.key === 'whatsapp'">
              <div class="phone ph-wa float" style="--d: 0s">
                <div class="ph-screen wa">
                  <div class="wa-top"><span class="av">NR</span><div><b>Nuwan R.</b><small>online</small></div></div>
                  <div class="bub in"><span class="tx">Hi, is my quotation ready?</span></div>
                  <div class="bub out"><span class="tag">Template</span><span class="tx">Quotation Q-1042 is ready to view</span></div>
                  <div class="bub in media"><span class="thumb">PDF</span><span class="tx">Quote-1042.pdf</span></div>
                  <div class="bub out"><span class="tx">Sent ✓✓</span></div>
                  <div class="wa-in"><span class="tx ph">Type a message</span></div>
                </div>
              </div>
              <span class="brand float" style="--d: 0.6s; right: 8%; top: 6%" v-html="logos.wa"></span>
              <div class="glass g-wa-b1 float" style="--d: 1s"><b>New message</b><small>Hi, is my quotation ready?</small></div>
              <div class="glass g-wa-crm float" style="--d: 2s">
                <div class="g-h"><span class="lg" aria-hidden="true"></span><b>Shared inbox</b><em class="chip ok">Synced</em></div>
                <div class="rw"><small>Assigned</small><span class="av">AS</span><b>Amal S.</b></div>
                <div class="rw"><small>Status</small><em class="chip ok">Open</em></div>
                <div class="rw"><small>Customer</small><b>Nuwan R.</b></div>
              </div>
            </template>

            <!-- 04 · 3CX -->
            <template v-else-if="c.key === '3cx'">
              <div class="deskphone">
                <div class="dp-screen"><small>Ext. 101</small><b>Ready</b></div>
                <div class="dp-keys"><i v-for="n in 12" :key="n"></i></div>
              </div>
              <span class="brand wide float" style="--d: 0.5s; right: 6%; top: 6%" v-html="logos.cx"></span>
              <div class="glass g-cx-call float" style="--d: 0s">
                <span class="av">KP</span>
                <div class="ic-t"><b>Incoming call</b><small>Kasun Perera</small></div>
                <span class="rb ok"><svg><use href="#isc-phone" /></svg></span>
                <span class="rb no"><svg><use href="#isc-phone" /></svg></span>
              </div>
              <div class="glass g-cx-rec float" style="--d: 1.6s">
                <div class="g-h"><span class="lg" aria-hidden="true"></span><b>Caller record</b></div>
                <div class="rw"><small>Duration</small><b class="tm">{{ clock }}</b></div>
                <div class="rw"><small>Last call</small><b>4:12 · Resolved</b></div>
                <div class="rw"><small>Missed</small><b>Callback task</b></div>
              </div>
            </template>

            <!-- 05 · Vodia -->
            <template v-else-if="c.key === 'vodia'">
              <span class="brand wide float" style="--d: 0.4s; right: 8%; top: 8%" v-html="logos.vo"></span>
              <div class="glass g-vo-ai float" style="--d: 0s">
                <span class="wave"><i v-for="n in 9" :key="n" :style="{ '--n': n }"></i></span>
                <div class="ic-t"><b>AI voice agent</b><small>Calling</small></div>
                <em class="chip wip">Live</em>
              </div>
              <div class="glass g-vo-act float" style="--d: 1.8s">
                <div class="g-h"><span class="lg" aria-hidden="true"></span><b>Call activity</b></div>
                <div class="li"><i class="d1"></i>Appointment reminder</div>
                <div class="li"><i class="d2"></i>Payment reminder</div>
                <div class="li"><i class="d3"></i>Renewal reminder</div>
                <div class="li back"><svg><use href="#isc-check" /></svg>Outcome back in the CRM</div>
              </div>
            </template>

            <!-- 06 · Google Calendar -->
            <template v-else-if="c.key === 'calendar'">
              <div class="win w-cal">
                <div class="cal-h"><b>November 2026</b><span>‹ ›</span></div>
                <div class="cal-days"><small v-for="(d, di) in 'SMTWTFS'.split('')" :key="di">{{ d }}</small></div>
                <div class="cal-grid">
                  <i v-for="(d, n) in calDays" :key="n" :class="[calClass(d), { today: d === 17, off: !d }]">{{ d || '' }}</i>
                </div>
              </div>
              <span class="brand float" style="--d: 0.3s; right: 8%; top: 6%" v-html="logos.gc"></span>
              <div class="glass g-cal-note float" style="--d: 1s">
                <span class="brand s" v-html="logos.gc"></span>
                <div class="ic-t"><b>Meeting booked</b><small>Demo · 10:30</small></div>
              </div>
              <div class="glass g-cal-task float" style="--d: 2.2s">
                <div class="g-h"><span class="lg" aria-hidden="true"></span><b>Tasks</b><svg class="sy"><use href="#isc-sync" /></svg></div>
                <div class="li"><i class="d1"></i>Follow-up<span class="when">Today</span></div>
                <div class="li"><i class="d3"></i>Service visit<span class="when">Fri</span></div>
              </div>
            </template>

            <!-- 07 · REST API -->
            <template v-else>
              <div class="code">
                <div class="code-bar"><i></i><i></i><i></i><span>request.http</span></div>
                <pre><span class="k">POST</span> /leads
  <span class="c">Authorization:</span> OAuth 2.0
  { <span class="s">"source"</span>: <span class="s">"webhook"</span> }
  <span class="ok">→ 200 OK</span></pre>
              </div>
              <svg class="wires" viewBox="0 0 100 44" preserveAspectRatio="none">
                <path d="M50 22 L14 8" /><path d="M50 22 L14 36" /><path d="M50 22 L86 8" /><path d="M50 22 L86 36" />
              </svg>
              <span class="node n0 float" style="--d: 0s" v-html="logos.api"></span>
              <span class="node n1">Accounting</span>
              <span class="node n2">E-commerce</span>
              <span class="node n3">Zapier</span>
              <span class="node n4">Make</span>
              <div class="glass g-api float" style="--d: 1.4s">
                <div class="g-h"><span class="lg" aria-hidden="true"></span><b>Saptivo API</b></div>
                <div class="li"><svg><use href="#isc-check" /></svg>API connected</div>
                <div class="li"><svg><use href="#isc-check" /></svg>Webhook delivered</div>
                <div class="act"><i v-for="n in 12" :key="n" :style="{ '--n': n }"></i></div>
              </div>
            </template>

        </div></div>

        <!-- ===================== copy ===================== -->
        <div class="txt">
          <h2 :id="'isc-h-' + c.key" class="t-h">{{ c.title }}</h2>
          <p class="t-p">{{ c.text }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
/**
 * IntegrationsShowcase.vue: seven integration sections (Vue 3, <script setup>, scoped CSS)
 *
 * Every integration is its own full-width section. The visual card sits on one side (a photo under a colour wash,
 * with a main mock-up and frosted-glass CRM panels that carry the Saptivo logo) and the heading and text on the other.
 * The sides alternate down the page. On phones each section stacks: visual first, then the text.
 * No carousel and no scripting beyond a gentle reveal and the small call timer in the 3CX mock-up.
 *
 * Content: all seven blocks are in the `cards` array below, word for word. Headings render as <h2>.
 * UI labels inside the mock-ups are illustrative; grey bars are placeholders and no statistics are invented.
 * Brand marks (W, f, WhatsApp, 3CX, V, 31) are simple stand-ins; swap in the official, permitted assets before launch.
 * Photos are Unsplash URLs in `img` (swap for your own); the soft tone colour shows if one fails to load.
 * The Saptivo logo is painted black through a CSS mask from /saptivo-logo.png (needs a transparent PNG).
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
defineOptions({ name: 'IntegrationsShowcase' })

const logoSrc = `${import.meta.env.BASE_URL}saptivo-logo.png`

// brand marks drawn as SVG (own drawings; swap in the official, permitted assets before launch)
const logos = {
  wa: '<svg viewBox="0 0 24 24"><rect width="24" height="24" rx="5.500" fill="#25d366"/><path transform="translate(3.800 3.800) scale(0.683)" fill="#fff" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.18 2.095 3.195 5.076 4.483.714.306 1.272.489 1.705.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>',
  cx: '<img src="data:image/png;base64,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" alt="3CX" />',
  vo: '<svg viewBox="0 0 205.87 100.71" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Vodia"><circle fill="#e2231a" cx="155.09" cy="45.22" r="6.45"/><circle fill="#e2231a" cx="193.59" cy="12.28" r="12.28"/><circle fill="#e2231a" cx="184.98" cy="36.61" r="9.71"/><circle fill="#e2231a" cx="165.39" cy="30.43" r="7.64"/><g fill="#231f20" transform="translate(-49.8 -15.79)"><path d="M104.85,56.91L84.68,115.48H69.73L49.8,56.91H64L76.22,97.67a29.24,29.24,0,0,1,1.18,5.84h0.25a33,33,0,0,1,1.27-6L91,56.91h13.8Z"/><path d="M120.11,116.5q-10.46,0-16.44-5.86t-6-15.91q0-10.37,6.21-16.23t16.79-5.86q10.41,0,16.34,5.86T142.94,94q0,10.41-6.11,16.46T120.11,116.5Zm0.33-34a8.61,8.61,0,0,0-7.11,3.14q-2.53,3.15-2.53,8.9,0,12,9.72,12,9.27,0,9.27-12.38Q129.79,82.52,120.44,82.52Z"/><path d="M190.24,115.48H177.33v-5.76h-0.16q-4.41,6.78-12.95,6.78A15.85,15.85,0,0,1,151.6,111q-4.78-5.53-4.78-15.46,0-10.37,5.27-16.62a17.18,17.18,0,0,1,13.8-6.25q8.09,0,11.27,5.8h0.16V53.56h12.91v61.92ZM177.57,95.14V92a9.9,9.9,0,0,0-2.37-6.78,8.37,8.37,0,0,0-12.87.67q-2.41,3.37-2.41,9.25,0,5.51,2.33,8.5a8.27,8.27,0,0,0,12.84-.16A13.11,13.11,0,0,0,177.57,95.14Z"/><rect x="197.1" y="73.65" width="12.91" height="41.82"/><path d="M251.67,115.48H239.45v-6h-0.16a13.63,13.63,0,0,1-12.46,7q-6.09,0-9.58-3.45a12.37,12.37,0,0,1-3.49-9.21q0-12.17,14.42-14l11.35-1.51q0-6.86-7.43-6.86a25.38,25.38,0,0,0-14.21,4.45V76.15a32,32,0,0,1,7.37-2.45,38.75,38.75,0,0,1,8.52-1.06q17.89,0,17.89,17.85v25Zm-12.13-17V95.67l-7.6,1q-6.29.82-6.29,5.68a4.69,4.69,0,0,0,1.53,3.61,5.89,5.89,0,0,0,4.15,1.41,7.64,7.64,0,0,0,5.92-2.51A9.07,9.07,0,0,0,239.54,98.49Z"/></g></svg>',
  fb: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Facebook"><path fill="#1877f2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
  wp: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="WordPress"><path fill="#21759b" d="M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.405-.026-.78-.07-1.11m-7.981.105c.647-.03 1.232-.105 1.232-.105.582-.075.514-.93-.067-.899 0 0-1.755.135-2.88.135-1.064 0-2.85-.15-2.85-.15-.585-.03-.661.855-.075.885 0 0 .54.061 1.125.09l1.68 4.605-2.37 7.08L5.354 6.9c.649-.03 1.234-.1 1.234-.1.585-.075.516-.93-.065-.896 0 0-1.746.138-2.874.138-.2 0-.438-.008-.69-.015C4.911 3.15 8.235 1.215 12 1.215c2.809 0 5.365 1.072 7.286 2.833-.046-.003-.091-.009-.141-.009-1.06 0-1.812.923-1.812 1.914 0 .89.513 1.643 1.06 2.531.411.72.89 1.643.89 2.977 0 .915-.354 1.994-.821 3.479l-1.075 3.585-3.9-11.61.001.014zM12 22.784c-1.059 0-2.081-.153-3.048-.437l3.237-9.406 3.315 9.087c.024.053.05.101.078.149-1.12.393-2.325.609-3.582.609M1.211 12c0-1.564.336-3.05.935-4.39L7.29 21.709C3.694 19.96 1.212 16.271 1.211 12M12 0C5.385 0 0 5.385 0 12s5.385 12 12 12 12-5.385 12-12S18.615 0 12 0"/></svg>',
  gc: '<svg viewBox="0 0 48 48"><defs><clipPath id="gcc"><rect x="3" y="3" width="42" height="42" rx="8"/></clipPath></defs><g clip-path="url(#gcc)"><rect x="3" y="3" width="42" height="42" fill="#fff"/><path d="M3 3h31v9H12v22H3z" fill="#4285f4"/><path d="M34 3h11v9H34z" fill="#1967d2"/><path d="M36 12h9v22h-9z" fill="#fbbc04"/><path d="M3 34h9v11H3z" fill="#188038"/><path d="M12 36h22v9H12z" fill="#34a853"/><path d="M34 34h11l-11 11z" fill="#ea4335"/><path d="M34 34v11l11-11z" fill="#c5221f" opacity="0"/></g><text x="24" y="31.500" text-anchor="middle" font-family="Poppins,Arial,sans-serif" font-size="17" font-weight="600" fill="#4285f4">31</text></svg>',
  api: '<svg viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="#14243a"/><path d="M19 16 11 24l8 8M29 16l8 8-8 8M26 14l-4 20" fill="none" stroke="#fff" stroke-width="3.200" stroke-linecap="round" stroke-linejoin="round"/></svg>',
}

const cards = [
  {
    key: 'wordpress',
    img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80&auto=format&fit=crop',
    title: 'WordPress website inquiry sync',
    text: "Your website is often the first place a customer reaches out. With Saptivo's WordPress CRM integration, every contact-form submission arrives in your CRM as a new inquiry within moments, with the customer's details, message and the page they came from.",
  },
  {
    key: 'facebook',
    img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80&auto=format&fit=crop',
    title: 'Facebook Lead Ads integration',
    text: "Paid social campaigns only pay off if leads are called back quickly. Saptivo's Facebook Lead Ads CRM integration creates a lead the moment someone submits an Instant Form on your Facebook Page, scores it and routes it to a salesperson.",
  },
  {
    key: 'whatsapp',
    img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=80&auto=format&fit=crop',
    title: 'WhatsApp Business API',
    text: 'Connect your official WhatsApp Business number and turn it into a shared team inbox. Chats, media and templates sync both ways, and every conversation is logged on the customer timeline.',
    cta: { label: 'Learn more about WhatsApp CRM.', href: '/features/whatsapp-crm/' },
  },
  {
    key: '3cx',
    img: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=1200&q=80&auto=format&fit=crop',
    title: '3CX phone system',
    text: "Map your 3CX DID, queues and extensions to Saptivo. Incoming calls open the caller's record before you answer, every call is logged with duration and outcome, and missed calls turn into callback tasks.",
    cta: { label: 'Learn more about 3CX call integration.', href: '/features/3cx-crm-integration/' },
  },
  {
    key: 'vodia',
    title: 'Vodia PBX and AI voice agents',
    text: "Connect a Vodia phone system to log calls, pop up caller details and click to call, just as with 3CX. Vodia's AI voice agents can also call customers for appointment, payment and renewal reminders using Saptivo data, and the outcome of each call comes back into the CRM.",
    cta: { label: 'Learn more about Vodia integration and AI calls.', href: '/integrations/vodia/' },
    img: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=900&q=80&auto=format&fit=crop',
  },
  {
    key: 'calendar',
    img: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=1200&q=80&auto=format&fit=crop',
    title: 'Google Calendar two-way sync',
    text: 'CRM follow-ups, demos and service visits appear in Google Calendar, and meetings booked in Google Calendar appear in Saptivo. Your team keeps one schedule, wherever they look.',
  },
  {
    key: 'api',
    img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80&auto=format&fit=crop',
    title: 'Open REST API and webhooks',
    text: "For everything else, Saptivo's RESTful API with OAuth 2.0 authentication and outbound webhooks connects accounting software, e-commerce platforms and in-house systems. Zapier and Make compatibility lets non-developers build connections too.",
  },
]

// decorative month grid for the calendar card: a few filled days
// November 2026 starts on a Sunday, so the 30 days fill five rows of a Sunday-first grid
const calDays = Array.from({ length: 35 }, (_, i) => (i < 30 ? i + 1 : 0))
const calEvents = { 4: 'e1', 6: 'e3', 10: 'e2', 13: 'e1', 17: 'e3', 19: 'e2', 20: 'e1', 25: 'e1', 27: 'e3' }
const calClass = (d) => (d ? calEvents[d] || '' : '')

/* ---------- reveal + timer ---------- */
const root = ref(null)
const armed = ref(false)
const secs = []
const seen = ref(cards.map(() => false))
const clock = ref('00:00')

let io = null
let tClock = null
let sec = 0

onMounted(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce || !('IntersectionObserver' in window)) {
    seen.value = cards.map(() => true)
  } else {
    armed.value = true
    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const i = secs.indexOf(e.target)
          if (i > -1) seen.value[i] = true
          io.unobserve(e.target)
        })
      },
      { threshold: 0.12 },
    )
    secs.forEach((el) => el && io.observe(el))
  }
  // tiny call timer for the 3CX mock-up
  tClock = setInterval(() => {
    if (document.hidden) return
    sec = (sec + 1) % 60
    clock.value = `00:${String(sec).padStart(2, '0')}`
  }, 1000)
})
onBeforeUnmount(() => {
  io?.disconnect()
  clearInterval(tClock)
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Urbanist:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
</style>

<style scoped>
.isc {
  --navy: #14243a;
  --orange: #ff6b16;
  --ivory: #f9f8f4;
  --beige: #f4f1de;
  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  width: 100%;
  background: #fff;
  color: var(--navy);
  font-family: 'Urbanist', Arial, Helvetica, sans-serif;
  overflow-x: clip;
}
.isc *,
.isc *::before,
.isc *::after {
  box-sizing: border-box;
}
.isc svg { display: block; }
.isc use { pointer-events: none; }

/* ---------- one section per integration ---------- */
.sec {
  padding: clamp(32px, 4.6vw, 68px) clamp(16px, 3vw, 40px);
}
.sec-in {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  gap: clamp(28px, 6vw, 96px);
  max-width: 1240px;
  margin: 0 auto;
}
.sec.flip .visw { order: 2; }

/* tones: the wash colour that sits on the photo */
.k-wordpress { --tone: #e8decb; --w1: rgba(232, 222, 203, 0.55); --w2: rgba(232, 222, 203, 0.86); }
.k-facebook { --tone: #4f8fe8; --w1: rgba(36, 126, 245, 0.18); --w2: rgba(10, 62, 150, 0.5); }
.k-whatsapp { --tone: #d4dec9; --w1: rgba(212, 222, 201, 0.55); --w2: rgba(212, 222, 201, 0.86); }
.k-3cx { --tone: #c5d9f1; --w1: rgba(197, 217, 241, 0.55); --w2: rgba(197, 217, 241, 0.86); }
.k-vodia { --tone: #dad4ee; --w1: rgba(218, 212, 238, 0.55); --w2: rgba(218, 212, 238, 0.86); }
.k-calendar { --tone: #dde3f6; --w1: rgba(221, 227, 246, 0.55); --w2: rgba(221, 227, 246, 0.86); }
.k-api { --tone: #d9d0c4; --w1: rgba(217, 208, 196, 0.55); --w2: rgba(217, 208, 196, 0.86); }

/* ---------- visual card (everything inside scales with the card width) ---------- */
.visw {
  position: relative;
  container-type: inline-size;
  width: 100%;
  aspect-ratio: 1 / 0.98;
  border-radius: 22px;
  overflow: hidden;
  isolation: isolate;
  background: var(--tone);
}
.vis {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.vis > * { position: absolute; }
.bgp { inset: 0; width: 100%; height: 100%; object-fit: cover; }
.wash { inset: 0; background: linear-gradient(180deg, var(--w1) 0%, var(--w2) 100%); }
.vis u {
  display: block;
  height: 1.8cqw;
  min-height: 5px;
  border-radius: 6px;
  background: #e6e8ee;
  text-decoration: none;
}
.vis u.s { width: 62%; margin-top: 1.4cqw; }
.vis u.tall { height: 5cqw; }
.vis small { font-size: clamp(8.5px, 2.4cqw, 10.5px); color: #8a93a1; }
.vis b { font-weight: 600; }

/* glass panels */
.glass {
  padding: 3cqw 3.4cqw;
  border: 1px solid rgba(255, 255, 255, 0.75);
  border-radius: clamp(12px, 3.6cqw, 18px);
  background: rgba(255, 255, 255, 0.5);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  backdrop-filter: blur(20px) saturate(140%);
  box-shadow: 0 18px 38px -20px rgba(20, 36, 58, 0.4);
  font-size: clamp(9.5px, 2.7cqw, 12px);
  color: var(--navy);
}
.g-h { display: flex; align-items: center; gap: 2cqw; margin-bottom: 2.2cqw; }
.g-h b { flex: 1; min-width: 0; font-size: clamp(10px, 2.9cqw, 12.5px); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lg { display: block; flex: none; height: clamp(10px, 3cqw, 14px); aspect-ratio: 4.1 / 1; background: #000; -webkit-mask: var(--logo) left center / contain no-repeat; mask: var(--logo) left center / contain no-repeat; }
.sy { width: clamp(12px, 3cqw, 15px); height: clamp(12px, 3cqw, 15px); fill: none; stroke: #556070; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.chip { display: inline-flex; align-items: center; padding: 0.5cqw 2cqw; border-radius: 7px; font-style: normal; font-size: clamp(8.5px, 2.3cqw, 10.5px); font-weight: 500; white-space: nowrap; }
.chip.ok { background: #e1f5ea; color: #16a05a; }
.chip.wip { background: #fff0d3; color: #b7740b; }
.chips { display: flex; flex-wrap: wrap; gap: 1.2cqw; }
.chips span { padding: 0.8cqw 2cqw; border-radius: 7px; background: rgba(255, 255, 255, 0.8); font-size: clamp(8.5px, 2.3cqw, 10.5px); color: #475569; }
.rw { display: flex; align-items: center; gap: 2cqw; padding: 1cqw 0; }
.rw small { flex: none; min-width: 15cqw; }
.rw u { flex: 1; }
.rw b { font-size: clamp(9.5px, 2.6cqw, 11.5px); }
.av { flex: none; display: grid; place-items: center; width: 6cqw; min-width: 20px; aspect-ratio: 1; border-radius: 50%; background: linear-gradient(145deg, #2a4263, #14243a); color: #fff; font-size: clamp(6.5px, 1.9cqw, 8.5px); font-weight: 600; letter-spacing: 0.02em; }
.li { display: flex; align-items: center; gap: 2cqw; padding: 1cqw 0; font-size: clamp(9.5px, 2.6cqw, 11.5px); font-weight: 500; }
.li i { flex: none; width: 2cqw; min-width: 7px; aspect-ratio: 1; border-radius: 50%; }
.li u { flex: 1; margin-left: 1cqw; }
.li svg { flex: none; width: 3.4cqw; min-width: 12px; aspect-ratio: 1; fill: none; stroke: #16a05a; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
.d1 { background: #ff6b16; } .d2 { background: #7c5cd6; } .d3 { background: #16a05a; }
.ic-t { flex: 1; min-width: 0; display: grid; gap: 0.4cqw; }
.ic-t b { font-size: clamp(10px, 2.8cqw, 12px); white-space: nowrap; }
.tm { font-variant-numeric: tabular-nums; }

/* window mockups */
.win {
  overflow: hidden;
  border-radius: clamp(10px, 3cqw, 16px);
  background: #fff;
  box-shadow: 0 24px 46px -26px rgba(20, 36, 58, 0.5);
}
.win-bar { display: flex; align-items: center; gap: 1.2cqw; padding: 2.4cqw 3cqw; background: #f3f4f7; }
.win-bar i { width: 1.8cqw; min-width: 6px; aspect-ratio: 1; border-radius: 50%; background: #d5d9e1; }
.url { flex: 1; margin-left: 2cqw; padding: 0.7cqw 2.4cqw; border-radius: 6px; background: #fff; font-size: clamp(8px, 2.2cqw, 10px); color: #8a93a1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.win-body { padding: 3.4cqw; }
.f-title { display: block; margin-bottom: 2cqw; font-family: Urbanist, sans-serif; font-size: clamp(11px, 3.4cqw, 15px); letter-spacing: -0.02em; }
.field { margin-bottom: 2cqw; }
.field small { display: block; margin-bottom: 0.6cqw; }
.field u { border: 1px solid #e3e6ec; background: #fff; height: 4.4cqw; min-height: 14px; border-radius: 6px; }
.field u.tall { height: 8cqw; }
.btn-navy { display: inline-block; margin-top: 1cqw; padding: 1.6cqw 3.6cqw; border-radius: 7px; background: var(--navy); font-size: clamp(8.5px, 2.4cqw, 10.5px); font-weight: 500; color: #fff; }

/* brand marks (stand-ins) */
.mk {
  display: grid;
  place-items: center;
  width: 10.5cqw;
  min-width: 34px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 10px 22px -10px rgba(20, 36, 58, 0.45);
  font-weight: 700;
}
.mk.s { width: 8cqw; min-width: 26px; box-shadow: none; flex: none; position: static; }
.mk-wp { font-family: Georgia, serif; font-size: clamp(15px, 5cqw, 22px); color: #21759b; }
.mk-fb { font-family: Arial, sans-serif; font-size: clamp(17px, 6cqw, 26px); color: #fff; background: #1877f2; }
.mk-wa { background: #25d366; color: #fff; }
.mk-wa svg { width: 58%; height: 58%; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linejoin: round; }
.mk-cx { font-family: Poppins, sans-serif; font-size: clamp(9px, 2.8cqw, 12px); letter-spacing: -0.3px; color: #14243a; }
.mk-vo { font-family: Urbanist, sans-serif; font-size: clamp(15px, 5cqw, 22px); color: #6d4fc2; }
.mk-gc { border-radius: 22%; background: #fff; border-top: 0.9cqw solid #4285f4; }
.mk-gc b { font-family: Poppins, sans-serif; font-size: clamp(10px, 3.4cqw, 15px); color: #4285f4; }

/* brand logos */

.brand { display: block; width: 8cqw; min-width: 30px; aspect-ratio: 1; border-radius: 24%; filter: drop-shadow(0 12px 18px rgba(20, 36, 58, 0.3)); }
.brand.s { position: static; width: 7cqw; min-width: 24px; flex: none; filter: drop-shadow(0 4px 6px rgba(20, 36, 58, 0.2)); }
.brand :deep(svg), .mini :deep(svg), .n0 :deep(svg) { display: block; width: 100%; height: 100%; }
.mini { display: block; flex: none; width: 5.6cqw; min-width: 20px; aspect-ratio: 1; border-radius: 24%; }
.tx { display: block; font-size: clamp(8.5px, 2.4cqw, 10.5px); line-height: 1.35; color: #334155; }
.tx.ph { color: #9aa3b0; }
.when { margin-left: auto; font-size: clamp(8.5px, 2.3cqw, 10.5px); color: #6b7280; }
.glass small { display: block; }
.glass .rw small { color: #475569; }
.g-wa-b1 b { font-size: clamp(9.5px, 2.6cqw, 11.5px); }
.g-wa-b1 small { margin-top: 0.6cqw; }
.g-cx-call small, .g-cal-note small { color: #6b7280; }
/* floating animation */
.float { animation: isc-float 6s ease-in-out infinite; animation-delay: var(--d, 0s); }
@keyframes isc-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1.6cqw); } }

/* phones */
.phone {
  padding: 1cqw;
  border-radius: 8cqw 8cqw 0 0;
  background: #111317;
  box-shadow: 0 30px 50px -26px rgba(20, 36, 58, 0.6);
}
.ph-screen { height: 100%; overflow: hidden; padding: 3.4cqw 3cqw; border-radius: 7cqw 7cqw 0 0; background: #fff; }
.fb-top { display: flex; align-items: center; gap: 2cqw; margin-bottom: 3cqw; }
.fb-top b { display: block; font-size: clamp(8.5px, 2.4cqw, 10.5px); line-height: 1.2; }
.fb-top small { display: block; font-size: clamp(7.5px, 2cqw, 9px); }
.fbc { overflow: hidden; display: grid; place-items: center; flex: none; width: 5.2cqw; min-width: 20px; aspect-ratio: 1; border-radius: 50%; background: #fff; font-style: normal; font-weight: 700; font-family: Arial, sans-serif; font-size: clamp(10px, 3.4cqw, 14px); color: #fff; }
.btn-fb { display: block; margin-top: 2cqw; padding: 1.8cqw 0; border-radius: 6px; background: #1877f2; text-align: center; font-size: clamp(8.5px, 2.4cqw, 10.5px); font-weight: 600; color: #fff; }

/* 01 WordPress */
.w-wp { left: 8%; top: 9%; width: 66%; }
.g-wp-note { left: 26%; top: 67%; width: 68%; }
.g-wp-side { right: 4%; top: 30%; width: 40%; }

/* 02 Facebook */
.ph-fb { left: 7%; top: 12%; width: 40%; height: 76%; border-radius: 8cqw; }
.ph-fb .ph-screen { border-radius: 7cqw; }
.g-fb-lead { right: 4%; top: 24%; width: 46%; }
.g-fb-lead .rw small { min-width: 0; }
.g-fb-lead .rw b { white-space: nowrap; }
.g-fb-sent { right: 4%; top: 60%; width: 46%; display: flex; align-items: center; gap: 2cqw; font-weight: 500; line-height: 1.35; }
/* Facebook card: white panels on the blue wash */
.k-facebook .glass { background: rgba(255, 255, 255, 0.93); border-color: rgba(255, 255, 255, 0.9); }
.fbc :deep(svg) { display: block; width: 100%; height: 100%; }
.brand.fbk, .brand.wpk { width: 8cqw; border-radius: 50%; background: #fff; filter: drop-shadow(0 8px 14px rgba(20, 36, 58, 0.3)); }
/* 3CX and Vodia: the logo only, no tab behind it */
.brand.wide { width: 15cqw; min-width: 58px; aspect-ratio: auto; border-radius: 0; background: none; filter: none; }
.brand.wide :deep(svg), .brand.wide :deep(img) { display: block; width: 100%; height: auto; }
.ph-fb .ph-screen { padding: 4cqw 3.6cqw; }
.ph-fb .field { margin-bottom: 3.4cqw; }
.ph-fb .field u { height: 6.4cqw; }
.ph-fb .btn-fb { margin-top: 4cqw; padding: 2.6cqw 0; }
.dot { width: 2.2cqw; min-width: 8px; aspect-ratio: 1; border-radius: 50%; background: #25d366; }
.meter { flex: 1; height: 1.8cqw; min-height: 6px; border-radius: 6px; background: rgba(20, 36, 58, 0.1); overflow: hidden; }
.meter i { display: block; width: 78%; height: 100%; border-radius: 6px; background: var(--orange); transform-origin: left; animation: isc-meter 4s ease-in-out infinite alternate; }
@keyframes isc-meter { from { transform: scaleX(0.55); } to { transform: scaleX(1); } }

/* 03 WhatsApp */
.ph-wa { left: 9%; top: 10%; width: 52%; height: 100%; }
.ph-screen.wa { background: #efeae2; padding: 0; }
.wa-top { display: flex; align-items: center; gap: 2cqw; padding: 3cqw; background: #1f8f5f; color: #fff; }
.wa-top b { display: block; font-size: clamp(8.5px, 2.5cqw, 11px); line-height: 1.2; }
.wa-top small { color: rgba(255, 255, 255, 0.8); }
.wa .bub { margin: 2cqw 3cqw 0; padding: 2cqw 2.4cqw; width: 66%; border-radius: 10px; background: #fff; }
.wa .bub.out { margin-left: auto; background: #d9f3dd; }
.wa .bub.media { display: flex; align-items: center; gap: 2cqw; width: 56%; }
.wa .bub u { background: #e6e8ee; }
.wa .bub.out u { background: #bfe3c7; }
.thumb { flex: none; display: grid; place-items: center; width: 8cqw; aspect-ratio: 1; border-radius: 6px; background: #e8564a; color: #fff; font-size: clamp(6px, 1.7cqw, 8px); font-weight: 700; }
.tag { display: inline-block; margin-bottom: 1.2cqw; padding: 0.4cqw 1.8cqw; border-radius: 5px; background: #fff; font-size: clamp(7.5px, 2cqw, 9px); color: #16a05a; }
.wa-in { margin: 3cqw; padding: 1.6cqw 2.4cqw; border-radius: 999px; background: #fff; }
.g-wa-b1 { right: 5%; top: 22%; width: 36%; border-radius: 16px 16px 16px 4px; }
.g-wa-crm { right: 4%; top: 50%; width: 50%; }

/* 04 3CX */
.deskphone { left: 14%; top: 38%; width: 72%; height: 70%; padding: 3.4cqw; border-radius: 5cqw 5cqw 0 0; background: #14243a; box-shadow: 0 30px 50px -26px rgba(20, 36, 58, 0.7); }
.dp-screen { padding: 2.4cqw 3cqw; border-radius: 8px; background: #263e5f; color: #cfe0f5; }
.dp-screen small { color: #8fa9c8; display: block; }
.dp-screen b { font-size: clamp(10px, 3cqw, 13px); }
.dp-keys { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2cqw; margin-top: 3cqw; padding: 0 12%; }
.dp-keys i { aspect-ratio: 2.2; border-radius: 6px; background: #31496c; }
.g-cx-call { left: 7%; top: 8%; width: 60%; display: flex; align-items: center; gap: 2.4cqw; }
.rb { display: grid; place-items: center; flex: none; width: 6.4cqw; min-width: 22px; aspect-ratio: 1; border-radius: 50%; color: #fff; }
.rb svg { width: 52%; height: 52%; fill: none; stroke: currentColor; stroke-width: 2; stroke-linejoin: round; }
.rb.ok { background: #16a05a; }
.rb.no { background: #e0483a; }
.rb.no svg { transform: rotate(135deg); }
.g-cx-rec { right: 5%; top: 40%; width: 58%; }
.mk-cx { background: rgba(255, 255, 255, 0.92); }

/* 05 Vodia */
.g-vo-ai { left: 14%; top: 36%; width: 72%; display: flex; align-items: center; gap: 2.6cqw; }
.wave { display: flex; align-items: center; gap: 0.7cqw; height: 6cqw; }
.wave i { width: 0.9cqw; min-width: 2px; height: 100%; border-radius: 2px; background: var(--navy); transform-origin: center; animation: isc-wave 1.1s ease-in-out infinite; animation-delay: calc(var(--n) * 0.09s); }
@keyframes isc-wave { 0%, 100% { transform: scaleY(0.25); } 50% { transform: scaleY(1); } }
.ic-t small { color: #6b7280; }
.g-vo-act { left: 8%; top: 56%; width: 68%; }
.li.back { margin-top: 1cqw; padding-top: 2cqw; border-top: 1px solid rgba(20, 36, 58, 0.1); color: #16a05a; }

/* 06 Google Calendar */
.w-cal { left: 8%; top: 9%; width: 62%; padding: 3.4cqw; }
.cal-h { display: flex; justify-content: space-between; margin-bottom: 2cqw; font-size: clamp(9.5px, 2.8cqw, 12px); }
.cal-days, .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.8cqw; }
.cal-days small { text-align: center; }
.cal-grid { margin-top: 1.2cqw; }
.cal-grid i { position: relative; display: grid; place-items: center; aspect-ratio: 1; border-radius: 50%; background: #f4f6fa; font-style: normal; font-size: clamp(7px, 2cqw, 9.5px); color: #475569; }
.cal-grid i.off { background: transparent; }
.cal-grid i.e1::after, .cal-grid i.e2::after, .cal-grid i.e3::after { content: ''; position: absolute; bottom: 9%; width: 20%; aspect-ratio: 1; border-radius: 50%; }
.cal-grid i.e1::after { background: #4285f4; }
.cal-grid i.e2::after { background: #f5a193; }
.cal-grid i.e3::after { background: #16a05a; }
.cal-grid i.today { background: #14243a; color: #fff; font-weight: 600; }
.g-cal-note { right: 4%; top: 34%; width: 54%; display: flex; align-items: center; gap: 2.4cqw; }
.g-cal-task { left: 10%; top: 64%; width: 72%; }
.g-cal-task .li { gap: 2cqw; }

/* 07 REST API */
.code { left: 8%; top: 8%; width: 70%; overflow: hidden; border-radius: clamp(10px, 3cqw, 16px); background: #1f2328; box-shadow: 0 24px 46px -26px rgba(0, 0, 0, 0.6); }
.code-bar { display: flex; align-items: center; gap: 1.2cqw; padding: 2.4cqw 3cqw; background: #2a2f36; }
.code-bar i { width: 1.8cqw; min-width: 6px; aspect-ratio: 1; border-radius: 50%; background: #4a515b; }
.code-bar span { margin-left: 2cqw; font-size: clamp(8px, 2.2cqw, 10px); color: #8b95a3; }
.code pre { margin: 0; padding: 3cqw 3.4cqw 3.6cqw; font-family: 'JetBrains Mono', ui-monospace, Menlo, monospace; font-size: clamp(8.5px, 2.35cqw, 11px); line-height: 1.75; color: #d6dae0; white-space: pre; overflow: hidden; }
.code .k { color: #c4a7ff; } .code .c { color: #8fb8e8; } .code .s { color: #e6b673; } .code .ok { color: #6fd3a1; }
.wires { left: 4%; top: 52%; width: 92%; height: 36%; overflow: visible; }
.wires path { fill: none; stroke: rgba(20, 36, 58, 0.35); stroke-width: 1.4; stroke-dasharray: 3 3; vector-effect: non-scaling-stroke; animation: isc-dash 2.4s linear infinite; }
@keyframes isc-dash { to { stroke-dashoffset: -12; } }
.node { padding: 1.4cqw 3cqw; border-radius: 999px; background: rgba(255, 255, 255, 0.85); box-shadow: 0 10px 20px -12px rgba(20, 36, 58, 0.45); font-size: clamp(8.5px, 2.5cqw, 11px); font-weight: 500; white-space: nowrap; }
.n0 { left: 50%; top: 70%; transform: translate(-50%, -50%); display: block; width: 12cqw; aspect-ratio: 1; padding: 0; border-radius: 26%; background: transparent; box-shadow: 0 14px 24px -10px rgba(20, 36, 58, 0.55); }
.n0.float { animation: none; }
.n1 { left: 3%; top: 56%; } .n2 { left: 3%; top: 84%; } .n3 { right: 3%; top: 56%; } .n4 { right: 3%; top: 84%; }
.g-api { right: 4%; top: 26%; width: 48%; }
.act { display: flex; align-items: flex-end; gap: 1cqw; height: 6cqw; margin-top: 1.6cqw; }
.act i { flex: 1; height: 100%; border-radius: 3px; background: rgba(20, 36, 58, 0.25); transform-origin: bottom; animation: isc-act 2.2s ease-in-out infinite; animation-delay: calc(var(--n) * 0.12s); }
@keyframes isc-act { 0%, 100% { transform: scaleY(0.3); } 50% { transform: scaleY(1); } }

/* ---------- copy ---------- */
.txt { min-width: 0; }
.t-h {
  margin: 0;
  font-family: Urbanist, Arial, Helvetica, sans-serif;
  font-size: 40px;
  line-height: 48px;
  font-weight: 600;
  letter-spacing: -0.8px;
  color: #000;
}
.t-p {
  margin: 20px 0 0;
  max-width: 520px;
  font-size: 17px;
  line-height: 1.65;
  color: #4b586a;
}

/* ---------- entrance ---------- */
.isc-arm .sec-in { opacity: 0; transform: translateY(28px); }
.isc-arm .sec.in .sec-in { opacity: 1; transform: none; transition: opacity 0.8s ease, transform 0.9s var(--ease); }

/* ---------- responsive ---------- */
@media (max-width: 1100px) {
  .t-h { font-size: 36px; line-height: 44px; }
}
@media (max-width: 860px) {
  .sec-in { grid-template-columns: minmax(0, 1fr); gap: 28px; }
  .sec.flip .visw { order: 0; }
  .visw { max-width: 620px; margin: 0 auto; }
  .txt { max-width: 620px; margin: 0 auto; width: 100%; }
}
@media (max-width: 560px) {
  .t-h { font-size: 30px; line-height: 38px; }
  .t-p { font-size: 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .isc *, .isc *::before, .isc *::after { animation: none !important; transition: none !important; }
  .isc-arm .sec-in { opacity: 1; transform: none; }
}
</style>
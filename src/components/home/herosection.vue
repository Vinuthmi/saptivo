<template>
  <section id="top" ref="hero" class="hero" aria-labelledby="hero-title">
    <div class="top">
    <div class="content">
      <h1 id="hero-title">
        Manage and automate
        <span class="accent">CRM, your way.</span>
      </h1>

      <p class="lead">
        Bring customers, conversations and your entire team into one
        connected workspace. Work smarter, move faster and make every
        opportunity count.
      </p>

      <div class="actions">
        <a href="#contact" class="btn btn-primary">
          Build your advantage <span class="arrow" aria-hidden="true">↗</span>
        </a>
        <a href="#features" class="btn btn-outline">See how it works</a>
      </div>
    </div>
    </div>

    <div ref="stage" class="stage">
      <!-- orbit lives BELOW the text, behind the video card -->
      <div class="orbit" aria-hidden="true">
        <div class="ring ring-c" :style="{ '--rot': rotC + 'deg' }">
          <i v-for="(d, i) in dotsC" :key="'c' + i" class="dot" :style="{ '--a': d.a + 'deg', '--s': d.s + 'px' }"></i>
        </div>

        <div class="ring ring-b" :style="{ '--rot': rotB + 'deg' }">
          <i v-for="(d, i) in dotsB" :key="'b' + i" class="dot" :style="{ '--a': d.a + 'deg', '--s': d.s + 'px' }"></i>
        </div>

        <div class="ring ring-a" :style="{ '--rot': rot + 'deg' }">
          <span
            v-for="(s, i) in ringIcons"
            :key="s.name + i"
            class="node"
            :style="{ '--a': i * (360 / ringIcons.length) + 'deg' }"
          >
            <img :src="s.img" alt="" width="32" height="32" draggable="false" />
          </span>
        </div>
      </div>

      <div class="sticky">
        <div class="video-card" :style="{ '--p': progress }">
          <video
            ref="heroVideo"
            class="video"
            autoplay
            muted
            loop
            playsinline
            preload="metadata"
            @play="isPlaying = true"
            @pause="isPlaying = false"
          >
            <source src="/video/crm-hero.mp4" type="video/mp4" />
          </video>
          <div class="video-shade" aria-hidden="true"></div>

          <h3
            class="video-copy"
            :style="{ opacity: copyOpacity, transform: 'translateY(' + copyShift + 'px)' }"
            aria-hidden="true"
          >
            One view.
            <span>Infinite momentum.</span>
          </h3>

          <button class="play" type="button" @click="togglePlay"
            :aria-label="isPlaying ? 'Pause video' : 'Play video'">
            <svg v-if="isPlaying" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14" /></svg>
            <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z" /></svg>
          </button>

          <button class="sound" type="button" @click="toggleMute"
            :aria-label="isMuted ? 'Unmute video' : 'Mute video'">
            <svg v-if="isMuted" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Z" /><path d="m17 9 4 6m0-6-4 6" /></svg>
            <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Z" /><path d="M17 9a5 5 0 0 1 0 6" /><path d="M19 6a9 9 0 0 1 0 12" /></svg>
          </button>
        </div>
      </div>
    </div>

    <div id="features" class="brands">
      <p class="brands-title">All your work. Working as one.</p>
      <div class="marquee">
        <div class="track">
          <span v-for="(f, i) in loop" :key="f + i" class="chip">{{ f }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
defineOptions({ name: "HeroSection" });

const hero = ref(null);
const stage = ref(null);
const heroVideo = ref(null);
const isMuted = ref(true);
const isPlaying = ref(true);
const rot = ref(0);
const progress = ref(0);

const rotB = computed(() => -rot.value * 0.7);
const rotC = computed(() => rot.value * 0.45);

// Real brand logos (simple-icons paths + brand colours) rendered as <img>.
// To use your own files instead, set `img: "/images/social/instagram.png"`.
const brands = [
  {
    "name": "Instagram",
    "hex": "E4405F",
    "path": "M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"
  },
  {
    "name": "YouTube",
    "hex": "FF0000",
    "path": "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
  },
  {
    "name": "Facebook",
    "hex": "0866FF",
    "path": "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"
  },
  {
    "name": "TikTok",
    "hex": "000000",
    "path": "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
  },
  {
    "name": "LinkedIn",
    "hex": "0A66C2",
    "path": "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
  },
  {
    "name": "X",
    "hex": "000000",
    "path": "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
  },
  {
    "name": "WhatsApp",
    "hex": "25D366",
    "path": "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
  },
  {
    "name": "Telegram",
    "hex": "26A5E4",
    "path": "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
  },
  {
    "name": "Pinterest",
    "hex": "BD081C",
    "path": "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"
  },
  {
    "name": "Reddit",
    "hex": "FF4500",
    "path": "M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0Zm4.388 3.199c1.104 0 1.999.895 1.999 1.999 0 1.105-.895 2-1.999 2-.946 0-1.739-.657-1.947-1.539v.002c-1.147.162-2.032 1.15-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363.473-.363 1.064-.58 1.707-.58 1.547 0 2.802 1.254 2.802 2.802 0 1.117-.655 2.081-1.601 2.531-.088 3.256-3.637 5.876-7.997 5.876-4.361 0-7.905-2.617-7.998-5.87-.954-.447-1.614-1.415-1.614-2.538 0-1.548 1.255-2.802 2.803-2.802.645 0 1.239.218 1.712.585 1.275-.79 2.881-1.291 4.64-1.365v-.01c0-1.663 1.263-3.034 2.88-3.207.188-.911.993-1.595 1.959-1.595Zm-8.085 8.376c-.784 0-1.459.78-1.506 1.797-.047 1.016.64 1.429 1.426 1.429.786 0 1.371-.369 1.418-1.385.047-1.017-.553-1.841-1.338-1.841Zm7.406 0c-.786 0-1.385.824-1.338 1.841.047 1.017.634 1.385 1.418 1.385.785 0 1.473-.413 1.426-1.429-.046-1.017-.721-1.797-1.506-1.797Zm-3.703 4.013c-.974 0-1.907.048-2.77.135-.147.015-.241.168-.183.305.483 1.154 1.622 1.964 2.953 1.964 1.33 0 2.47-.81 2.953-1.964.057-.137-.037-.29-.184-.305-.863-.087-1.795-.135-2.769-.135Z"
  },
  {
    "name": "Discord",
    "hex": "5865F2",
    "path": "M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"
  }
];

const toImg = (b) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#${b.hex}" d="${b.path}"/></svg>`
  );

const social = brands.map((b) => ({ name: b.name, img: toImg(b) }));
const ringIcons = [...social, ...social];

// hollow circles riding the inner rings (a = angle, s = size in px)
const dotsB = [
  { a: 18, s: 14 }, { a: 88, s: 28 }, { a: 158, s: 12 },
  { a: 228, s: 22 }, { a: 300, s: 16 },
];
const dotsC = [
  { a: 52, s: 20 }, { a: 140, s: 10 }, { a: 214, s: 30 }, { a: 322, s: 14 },
];

const features = [
  "Omnichannel CRM",
  "Multi-Store Sync",
  "Smart Quotes",
  "Sales Analytics",
  "3CX Call Journal",
];
const loop = computed(() => [...features, ...features, ...features, ...features]);
const copyOpacity = computed(() => Math.min(Math.max((progress.value - 0.35) / 0.4, 0), 1));
const copyShift = computed(() => (1 - copyOpacity.value) * 36);

async function togglePlay() {
  const v = heroVideo.value;
  if (!v) return;
  if (v.paused) {
    try { await v.play(); } catch { /* blocked */ }
  } else {
    v.pause();
  }
}
function toggleMute() {
  const v = heroVideo.value;
  if (!v) return;
  v.muted = !v.muted;
  isMuted.value = v.muted;
}

let ticking = false;
let raf = null;
function update() {
  rot.value = window.scrollY * 0.12;
  const el = stage.value;
  if (el) {
    const total = el.offsetHeight - window.innerHeight;
    const p = total > 0 ? -el.getBoundingClientRect().top / total : 0;
    progress.value = Math.min(Math.max(p, 0), 1);
  }
  ticking = false;
}
function onScroll() {
  if (ticking) return;
  ticking = true;
  raf = requestAnimationFrame(update);
}

onMounted(() => {
  const v = heroVideo.value;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    v?.pause();
    return;
  }
  v?.play().catch(() => { isPlaying.value = false; });
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onScroll);
  if (raf !== null) cancelAnimationFrame(raf);
  heroVideo.value?.pause();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

.hero {
  --orange: #ff6338;
  --orange-deep: #f04b23;
  --ink: #17191d;
  --paper: #fff;
  --muted: #5d6068;
  --title: clamp(46px, 3.5vw, 104px); /* headline + video text share this size */

  --ring: min(1560px, 175vw);   /* outer orbit diameter */
  --step: 95px;                 /* gap between concentric rings */
  --crest: 54px;                /* where the outer ring peaks inside the orbit strip */
  --top0: clamp(150px, 17vw, 220px); /* video card top offset (orbit strip height) */
  --w0: min(1180px, calc(100vw - 40px));
  --ratio: 0.53;
  --h0: min(calc(var(--w0) * var(--ratio)), calc(100svh - var(--top0) - 32px));

  position: relative;
  isolation: isolate;
  overflow: clip; /* "hidden" would break the sticky video */
  padding-bottom: 56px;
  text-align: center;
  color: var(--ink);
  background: var(--paper);
  font-family: "Inter", system-ui, sans-serif;
}
.hero *, .hero *::before, .hero *::after { box-sizing: border-box; }
.hero a:focus-visible, .hero button:focus-visible { outline: 2px solid var(--orange); outline-offset: 4px; }

.top { position: relative; }

/* ---------- content ---------- */
.content {
  display: flex; flex-direction: column; align-items: center;
  width: min(1040px, calc(100% - 40px)); margin: 0 auto;
  padding: 112px 0 28px;
}
h1 {
  margin: 0; font-weight: 500; line-height: 0.98; letter-spacing: -0.06em; color: #0b0c0e;
  font-size: var(--title);
  animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
.accent,
.video-copy span {
  display: block;
  width: fit-content; /* gradient spans the text itself */
  margin: 0 auto -0.14em;
  padding-bottom: 0.14em; /* keeps the "g" descender inside the clipped background */
  background: linear-gradient(100deg, #ff9a3d 0%, #ff6a1a 45%, #f2540c 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.lead {
  max-width: 560px; margin: 28px 0 0;
  font-size: 17px; line-height: 1.75; color: #4a4d55;
  animation: rise 0.9s 0.1s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
.actions {
  display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 36px;
  animation: rise 0.9s 0.2s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 12px;
  min-height: 54px; padding: 0 24px; border-radius: 12px;
  text-decoration: none; font-size: 15px; font-weight: 600;
  transition: transform 0.2s, background 0.2s, border-color 0.2s, box-shadow 0.2s;
}
.btn-primary { color: #fff; background: linear-gradient(180deg, #ff7a45, #f2531f); box-shadow: inset 0 0 0 1px rgba(255,255,255,.35), 0 10px 24px rgba(240,75,35,.3); }
.btn-primary:hover { transform: translateY(-2px); box-shadow: inset 0 0 0 1px rgba(255,255,255,.4), 0 16px 32px rgba(240,75,35,.4); }
.arrow { display: inline-block; transition: transform 0.25s; }
.btn-primary:hover .arrow { transform: rotate(45deg); }
.btn-outline { color: #fff; background: #0b0c0e; box-shadow: inset 0 0 0 1px rgba(255,255,255,.14), 0 10px 24px rgba(0,0,0,.18); }
.btn-outline:hover { transform: translateY(-2px); box-shadow: inset 0 0 0 1px rgba(255,255,255,.28), 0 16px 32px rgba(0,0,0,.28); }

/* ---------- stage ---------- */
.stage { position: relative; height: 250svh; }

/* ---------- orbit (below the text, behind the card) ---------- */
.orbit {
  position: absolute; z-index: 0; top: 0; left: 0; right: 0; height: 700px;
  overflow: hidden; pointer-events: none;
  -webkit-mask-image: linear-gradient(180deg, #000 0%, #000 55%, transparent 100%);
  mask-image: linear-gradient(180deg, #000 0%, #000 55%, transparent 100%);
}
.ring {
  position: absolute; left: 50%;
  width: var(--d); height: var(--d); top: var(--top); margin-left: calc(var(--d) / -2);
  border-radius: 50%; border: 1px solid rgba(23, 25, 29, 0.2);
  transform: rotate(var(--rot, 0deg)); will-change: transform;
}
.ring-a { --d: var(--ring); --top: var(--crest); }
.ring-b { --d: calc(var(--ring) - var(--step) * 2); --top: calc(var(--crest) + var(--step)); border: 1px dashed rgba(23, 25, 29, 0.3); }
.ring-c { --d: calc(var(--ring) - var(--step) * 4); --top: calc(var(--crest) + var(--step) * 2); border-color: rgba(23, 25, 29, 0.12); }

.node {
  position: absolute; top: 50%; left: 50%;
  display: grid; place-items: center; width: 66px; height: 66px;
  background: #fff; border-radius: 20px;
  box-shadow: 0 10px 28px rgba(23, 25, 29, 0.09), 0 1px 3px rgba(23, 25, 29, 0.06);
  transform:
    translate(-50%, -50%) rotate(var(--a))
    translateY(calc(var(--d) / -2))
    rotate(calc(var(--a) * -1 - var(--rot, 0deg)));
}
.node img { display: block; width: 32px; height: 32px; user-select: none; }

.dot {
  position: absolute; top: 50%; left: 50%; display: block;
  width: var(--s); height: var(--s);
  background: #fff; border: 2px solid var(--orange); border-radius: 50%;
  transform: translate(-50%, -50%) rotate(var(--a)) translateY(calc(var(--d) / -2));
}
.ring-c .dot { border-color: rgba(23, 25, 29, 0.55); border-width: 1.5px; }

/* ---------- scroll-driven video ---------- */
.sticky {
  position: sticky; top: 0; z-index: 1;
  display: grid; grid-template-rows: 100svh; justify-items: center; align-items: start;
  width: 100%; height: 100svh;
}
.video-card {
  --p: 0;
  position: relative; isolation: isolate; overflow: hidden; background: var(--ink);
  margin-top: calc(var(--top0) * (1 - var(--p)));
  width: calc(var(--w0) + (100% - var(--w0)) * var(--p));
  height: calc(var(--h0) + (100% - var(--h0)) * var(--p));
  border: calc(6px * (1 - var(--p))) solid #fff;
  border-radius: calc(28px * (1 - var(--p)));
  box-shadow: 0 calc(40px * (1 - var(--p))) calc(90px * (1 - var(--p))) rgba(23, 25, 29, 0.22);
  will-change: width, height;
}
.video { position: absolute; inset: 0; display: block; width: 100%; height: 100%; object-fit: cover; }
.video-shade {
  position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background: linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.8) 100%);
}
.video-copy {
  position: absolute; z-index: 2; margin: 0; left: 0; right: 0; bottom: clamp(40px, 10vh, 110px);
  padding: 0 24px; text-align: center; color: #fff; pointer-events: none;
  font-weight: 500; line-height: 0.98; letter-spacing: -0.06em; font-size: var(--title);
  will-change: transform, opacity;
}

.play, .sound {
  position: absolute; z-index: 4; display: grid; place-items: center;
  color: var(--ink); background: #fff; border: 0; cursor: pointer;
  transition: opacity 0.25s, transform 0.25s, background 0.2s, color 0.2s;
}
.play { top: 50%; left: 50%; width: 72px; height: 72px; border-radius: 20px; opacity: 0; transform: translate(-50%, -50%); }
.video-card:hover .play, .play:focus-visible { opacity: 1; }
.play:hover { color: #fff; background: var(--orange); transform: translate(-50%, -50%) scale(1.06); }
.sound { right: 22px; bottom: 22px; width: 48px; height: 48px; border-radius: 14px; }
.sound:hover { color: #fff; background: var(--orange); }
.play svg, .sound svg { fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.play svg { width: 26px; height: 26px; }
.sound svg { width: 21px; height: 21px; }
.play svg path[d^="M8 5l"] { fill: currentColor; }

/* ---------- marquee ---------- */
.brands { position: relative; margin-top: 64px; }
.brands-title { margin: 0 0 22px; font-size: 14px; font-weight: 500; color: var(--muted); }
.marquee {
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
}
.track { display: flex; width: max-content; animation: slide 36s linear infinite; }
.marquee:hover .track { animation-play-state: paused; }
.chip {
  display: inline-flex; align-items: center; gap: 16px; padding: 0 34px;
  font-size: 22px; font-weight: 600; letter-spacing: -0.02em; color: #34363d; white-space: nowrap;
}
.chip::before { content: ""; width: 8px; height: 8px; border-radius: 50%; background: var(--orange); }

@keyframes rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
@keyframes slide { to { transform: translateX(-50%); } }

/* ---------- responsive ---------- */
@media (max-width: 900px) {
  .content { padding-top: 96px; }
}
@media (max-width: 760px) {
  .hero { --ring: min(1100px, 230vw); --step: 58px; --crest: 44px; --top0: 150px; --w0: calc(100vw - 24px); --ratio: 0.85; --title: clamp(38px, 10.5vw, 64px); padding-bottom: 40px; }
  .content { width: calc(100% - 32px); padding: 76px 0 24px; }
  .lead { font-size: 15px; margin-top: 22px; }
  .actions { width: 100%; gap: 10px; margin-top: 28px; }
  .btn { min-height: 50px; padding: 0 20px; font-size: 14px; }
  .node { width: 52px; height: 52px; border-radius: 16px; }
  .node img { width: 26px; height: 26px; }
  .stage { height: 220svh; }
  .video-copy { bottom: 84px; padding: 0 16px; }
  .play { opacity: 1; width: 58px; height: 58px; border-radius: 17px; }
  .sound { right: 14px; bottom: 14px; width: 42px; height: 42px; border-radius: 12px; }
  .brands { margin-top: 44px; }
  .chip { padding: 0 22px; gap: 12px; font-size: 17px; }
}
@media (max-width: 380px) {
  .actions { flex-direction: column; align-items: stretch; }
}
@media (prefers-reduced-motion: reduce) {
  h1, .lead, .actions { animation: none; }
  .track { animation: none; }
  .stage { height: auto; padding-top: var(--top0); }
  .orbit { height: calc(var(--top0) + 160px); }
  .sticky { position: relative; height: auto; display: block; }
  .video-card { margin: 0 auto; width: var(--w0); height: auto; aspect-ratio: 16 / 9; border: 3px solid #fff; border-radius: 20px; }
  .play { opacity: 1; }
}
</style>
// Offline cache: the app works in the supermarket with no signal.
const CACHE = "kigali-kitchen-v2";
const IMAGES = ["shakshuka","porridge","pancakes","omelette","ful","bpotatoes","tomtoast","torrijas","smoothie","bolognese","friedrice",
  "shawarma","tortilla","kofta","sweetsour","shepherd","pizza","beefstir","chili","couscous","moussaka","tomegg","roastchicken",
  "arrabbiata","fajitas","syrianrice","alfredo","kungpao","tomsoup","lomein","cabbagebeef","beansoup","falafel","lentilsoup",
  "hummus","shopska","potsalad","pbcookies","rockcakes","flatbread"].map(n => `images/${n}.jpg`);
const ASSETS = ["./", "index.html", "styles.css", "data.js", "app.js", "manifest.json", "icons/icon-192.png", "icons/icon-512.png", ...IMAGES];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Network first (so updates show up), cache as the fallback when offline.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res && (res.ok || res.type === "opaque")) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match(e.request))
  );
});

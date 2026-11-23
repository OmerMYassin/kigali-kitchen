// Offline cache: the whole app works in the supermarket with no signal.
const CACHE = "kigali-kitchen-v1";
const IMAGES = ["shakshuka","porridge","pancakes","omelette","ful","bpotatoes","tomtoast","torrijas","bolognese","friedrice",
  "shawarma","tortilla","kofta","sweetsour","koshari","pizza","beefstir","chili","couscous","moussaka","tomegg","roastchicken",
  "arrabbiata","fajitas","syrianrice","alfredo","kungpao","tomsoup","lomein","cabbagebeef","beansoup","falafel","lentilsoup",
  "hummus","shopska","potsalad","pbcookies","rockcakes","flatbread"].map(n => `images/${n}.jpg`);
const ASSETS = ["./", "index.html", "styles.css", "data.js", "app.js", "manifest.json", "icons/icon-192.png", "icons/icon-512.png", ...IMAGES];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// network first (so edits show up), cache as fallback when offline
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request))
  );
});

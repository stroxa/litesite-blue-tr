let CACHE = "makarnaci-v20260306003250";
let CORE = ["/","/site.css","/site.js","/logo.png","/favicon.png","/favicon.ico"];
let PRODUCTS = ["/products/3-peynirli-yassi-spagetti.html","/products/aci-soslu-tavuklu-yassi-spagetti.html","/products/barbeku-soslu-tavuklu-yassi-spagetti.html","/products/fettuccine-alfredo.html","/products/kiymali-soslu-yassi-spagetti.html","/products/kori-tavuklu-yassi-spagetti.html","/products/kremali-mantarli-yassi-spagetti.html","/products/sade-tereyagli-yassi-spagetti.html","/products/ton-balikli-yassi-spagetti.html","/products/yogurtlu-yassi-spagetti.html","/img/products/3-peynirli-yassi-spagetti-k.webp","/img/products/3-peynirli-yassi-spagetti.webp","/img/products/aci-soslu-tavuklu-yassi-spagetti-k.webp","/img/products/aci-soslu-tavuklu-yassi-spagetti.webp","/img/products/barbeku-soslu-tavuklu-yassi-spagetti-k.webp","/img/products/barbeku-soslu-tavuklu-yassi-spagetti.webp","/img/products/fettuccine-alfredo-k.webp","/img/products/fettuccine-alfredo.webp","/img/products/kiymali-soslu-yassi-spagetti-k.webp","/img/products/kiymali-soslu-yassi-spagetti.webp","/img/products/kori-tavuklu-yassi-spagetti-k.webp","/img/products/kori-tavuklu-yassi-spagetti.webp","/img/products/kremali-mantarli-yassi-spagetti-k.webp","/img/products/kremali-mantarli-yassi-spagetti.webp","/img/products/sade-tereyagli-yassi-spagetti-k.webp","/img/products/sade-tereyagli-yassi-spagetti.webp","/img/products/ton-balikli-yassi-spagetti-k.webp","/img/products/ton-balikli-yassi-spagetti.webp","/img/products/yogurtlu-yassi-spagetti-k.webp","/img/products/yogurtlu-yassi-spagetti.webp"];
let PAGES = ["/pages/gizlilik-politikasi.html","/pages/satis-sozlesmesi.html","/pages/site-haritasi.html","/index.html","/404.html","/img/address.png","/img/basket.png","/img/delete.png","/img/email.png","/img/minus.png","/img/phone.png","/img/plus.png","/img/whatsapp.png","/img/pages/hero-header-k.webp","/img/pages/hero-header.webp"];

self.addEventListener("install", function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(c) { return c.addAll(CORE); })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("message", function(e) {
  if (e.data === "cache-all") {
    caches.open(CACHE).then(function(c) {
      c.addAll(PRODUCTS).then(function() {
        return c.addAll(PAGES);
      }, function() {
        return c.addAll(PAGES);
      });
    });
  }
});

self.addEventListener("fetch", function(e) {
  if (e.request.method !== "GET") return;

  let url = new URL(e.request.url);
  let isCore = CORE.indexOf(url.pathname) !== -1;

  if (isCore) {
    e.respondWith(
      fetch(e.request).then(function(res) {
        let clone = res.clone();
        caches.open(CACHE).then(function(c) { c.put(url.pathname, clone); });
        return res;
      }).catch(function() {
        return caches.match(url.pathname);
      })
    );
    return;
  }

  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(function(cached) {
      let fetched = fetch(e.request).then(function(res) {
        let clone = res.clone();
        caches.open(CACHE).then(function(c) { c.put(url.pathname, clone); });
        return res;
      }).catch(function() {
        return cached;
      });
      return cached || fetched;
    })
  );
});

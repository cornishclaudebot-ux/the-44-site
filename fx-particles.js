/* ============================================================
   THE 44 — hero spinning particle "44"  (fx-particles.js)
   Standalone classic script. Self-guards, reduced-motion fallback,
   rAF loop, IntersectionObserver pause, document.hidden pause,
   DPR clamped to 1.5.

   Reads the shared beat clock from window.THE44.beatEnv(performance.now()).
   Source art: assets/logo.png  (1400x1257 RGBA, same-origin).
   Brand: crimson #A52A2A, bright #E21B2C, white #fff, jet black #000.
   ============================================================ */
(function () {
  "use strict";

  var canvas = document.getElementById("heroParticles");
  if (!canvas) return; // self-guard: no mount, do nothing

  var heroLogo = document.getElementById("heroLogo");
  var hero = canvas.closest(".hero") || document.querySelector(".hero");

  // ---- fallback decisions ------------------------------------------------
  var reduceMotion = false;
  try {
    reduceMotion = matchMedia("(prefers-reduced-motion:reduce)").matches;
  } catch (e) {}
  var coarse = false;
  try {
    coarse = matchMedia("(pointer:coarse)").matches;
  } catch (e) {}

  function bail() {
    // leave the static #heroLogo img visible; do not touch canvas beyond hiding
    if (canvas) canvas.style.display = "none";
    if (heroLogo) heroLogo.style.opacity = "1";
  }

  if (reduceMotion) return bail();
  if (coarse && window.innerWidth < 480) return bail();

  var ctx = canvas.getContext("2d");
  if (!ctx) return bail();

  // ---- sizing / device knobs --------------------------------------------
  var MOBILE = window.innerWidth < 760;
  var STEP = MOBILE ? 7 : 4;
  var MAX_POINTS = MOBILE ? 1600 : 4800;
  var SAMPLE_W = 220; // offscreen sampling width
  var BRIGHT = "#E21B2C";
  var WHITE = "#fff";
  var SPARK = "#ff2536";

  function dpr() {
    return Math.min(1.5, window.devicePixelRatio || 1);
  }

  var points = [];
  var ready = false;

  // ---- build the point cloud from logo.png -------------------------------
  function buildPoints(img) {
    var ratio = img.naturalHeight / img.naturalWidth || (1257 / 1400);
    var w = SAMPLE_W;
    var h = Math.round(SAMPLE_W * ratio);

    var off = document.createElement("canvas");
    off.width = w;
    off.height = h;
    var octx = off.getContext("2d");
    if (!octx) throw new Error("no offscreen ctx");
    octx.drawImage(img, 0, 0, w, h);

    var data;
    try {
      data = octx.getImageData(0, 0, w, h).data; // may throw (taint/security)
    } catch (e) {
      throw e;
    }

    var pts = [];
    var cx = w / 2;
    var cy = h / 2;

    for (var y = 0; y < h; y += STEP) {
      for (var x = 0; x < w; x += STEP) {
        var idx = (y * w + x) * 4;
        var r = data[idx];
        var g = data[idx + 1];
        var b = data[idx + 2];
        var a = data[idx + 3];
        if (a <= 90) continue;

        var color;
        // redish pixel -> clamp to bright crimson, with a few percent sparkle
        if (r > 120 && r > g + 30 && r > b + 30) {
          color = Math.random() < 0.05 ? SPARK : BRIGHT;
        } else if (r > 170 && g > 170 && b > 170) {
          // white-ish -> white, occasional sparkle
          color = Math.random() < 0.04 ? SPARK : WHITE;
        } else {
          // anything else solid -> treat dark/mid as crimson glow
          color = Math.random() < 0.05 ? SPARK : BRIGHT;
        }

        pts.push({
          x: x - cx,
          y: y - cy,
          z: (Math.random() - 0.5) * 26,
          color: color
        });
      }
    }

    // cap the count by uniform thinning
    if (pts.length > MAX_POINTS) {
      var keep = [];
      var stride = pts.length / MAX_POINTS;
      for (var i = 0; i < MAX_POINTS; i++) {
        keep.push(pts[Math.floor(i * stride)]);
      }
      pts = keep;
    }
    return pts;
  }

  // ---- canvas resize -----------------------------------------------------
  var cw = 0,
    ch = 0;
  function resize() {
    var rect = canvas.getBoundingClientRect();
    var d = dpr();
    cw = Math.max(1, rect.width);
    ch = Math.max(1, rect.height);
    canvas.width = Math.round(cw * d);
    canvas.height = Math.round(ch * d);
    ctx.setTransform(d, 0, 0, d, 0, 0);
  }

  // ---- motion state ------------------------------------------------------
  var rot = 0;
  var idleAngle = 0;
  var explode = 0; // click-driven outward push, decays *0.92

  function heroHeight() {
    if (hero) {
      var hh = hero.getBoundingClientRect().height;
      if (hh > 0) return hh;
    }
    return window.innerHeight || 800;
  }

  // ---- click explode (reuse the existing #heroLogoWrap click feel) -------
  var clickTarget =
    document.getElementById("heroLogoWrap") || heroLogo || canvas;
  if (clickTarget) {
    clickTarget.addEventListener("click", function () {
      explode = 34; // px outward push that then decays
    });
  }

  // ---- the render loop ---------------------------------------------------
  var PERSP = 520;
  function frame() {
    var T44 = window.THE44 || {};
    var beat = 0;
    if (typeof T44.beatEnv === "function") {
      try {
        beat = T44.beatEnv(performance.now()) || 0;
      } catch (e) {
        beat = 0;
      }
    }

    // scroll-driven spin + idle drift, smoothed
    idleAngle += 0.0009;
    var hh = heroHeight();
    var targetRot =
      (window.scrollY / (hh || 1)) * Math.PI * 1.4 + idleAngle;
    rot += (targetRot - rot) * 0.1;

    // downbeat "breathe": push points outward + brightness lift (NOT a scale pulse)
    var breathe = beat * 3.5;
    var bright = 1 + beat * 0.55; // brightness lift on the downbeat
    explode *= 0.92;
    if (explode < 0.05) explode = 0;
    var outward = breathe + explode;

    var cosR = Math.cos(rot);
    var sinR = Math.sin(rot);

    // motion-trail clear
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(8,5,6,0.22)";
    ctx.fillRect(0, 0, cw, ch);

    ctx.globalCompositeOperation = "lighter";

    var ox = cw / 2;
    var oy = ch / 2;

    for (var i = 0; i < points.length; i++) {
      var p = points[i];

      // outward breathe along radial direction in the logo plane
      var px = p.x;
      var py = p.y;
      if (outward) {
        var len = Math.sqrt(px * px + py * py) || 1;
        px += (px / len) * outward;
        py += (py / len) * outward;
      }

      // rotate around vertical (y) axis: project x,z
      var xz = px * cosR - p.z * sinR;
      var zz = px * sinR + p.z * cosR;
      var persp = PERSP / (PERSP + zz);

      var sx = ox + xz * persp;
      var sy = oy + py * persp;

      var size = Math.max(0.6, persp * 1.7);
      ctx.globalAlpha = Math.min(1, (0.35 + 0.65 * persp) * bright);
      ctx.fillStyle = p.color;
      ctx.fillRect(sx, sy, size, size);
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  // ---- loop control: rAF, IntersectionObserver, document.hidden ----------
  var rafId = null;
  var onScreen = true;
  var running = false;

  function tick() {
    if (!running) return;
    frame();
    rafId = requestAnimationFrame(tick);
  }
  function start() {
    if (running || !ready || !onScreen || document.hidden) return;
    running = true;
    rafId = requestAnimationFrame(tick);
  }
  function stop() {
    running = false;
    if (rafId != null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  if ("IntersectionObserver" in window && hero) {
    var iob = new IntersectionObserver(
      function (ents) {
        onScreen = ents[0] ? ents[0].isIntersecting : true;
        if (onScreen) start();
        else stop();
      },
      { threshold: 0.01 }
    );
    iob.observe(hero);
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop();
    else start();
  });

  var resizeTimer = null;
  window.addEventListener(
    "resize",
    function () {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 120);
    },
    { passive: true }
  );

  // ---- boot --------------------------------------------------------------
  function boot() {
    var img = new Image();
    img.decoding = "async";
    img.src = "assets/logo.png"; // same-origin
    img.onload = function () {
      try {
        points = buildPoints(img);
      } catch (e) {
        return bail(); // getImageData / draw threw -> static fallback
      }
      if (!points.length) return bail();
      resize();
      ready = true;
      // canvas has booted: fade the static poster img out
      if (heroLogo) heroLogo.style.opacity = "0";
      start();
    };
    img.onerror = function () {
      bail();
    };
  }

  boot();
})();

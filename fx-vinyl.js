/* ============================================================
   THE 44 — fx-vinyl.js
   Rings flip into a spinning vinyl record on #vinyl scroll progress.
   Standalone classic script. Self-guards. Reduced-motion static fallback.
   Reads the shared beat clock from window.THE44 (beatEnv, BEAT_MS).
   Brand: crimson #A52A2A, bright #E21B2C, white #fff, jet black #000.
   No blue, no gold.
   ============================================================ */
(function(){
  'use strict';

  var canvas = document.getElementById('vinylCanvas');
  if(!canvas || !canvas.getContext) return;            // self-guard: no mount, do nothing
  var ctx = canvas.getContext('2d');
  if(!ctx) return;

  var section = canvas.closest('#vinyl') || document.getElementById('vinyl');
  // if there is no parent section to drive progress, treat the record as finished/static
  var hasSection = !!section;

  var reduce = false;
  try { reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches; } catch(e){}

  // ----- brand palette -----
  var CRIMSON = '#A52A2A';
  var BRIGHT  = '#E21B2C';
  var WHITE   = '#fff';

  // ----- beat clock (graceful if THE44 not present) -----
  function beat(){
    var T = window.THE44;
    if(T && typeof T.beatEnv === 'function'){
      return T.beatEnv(performance.now());
    }
    return 0;
  }

  // ----- center label logo (same-origin) -----
  var logo = new Image();
  var logoReady = false;
  logo.onload = function(){ logoReady = true; render(lastP, true); };
  logo.onerror = function(){ logoReady = false; };
  logo.src = 'assets/logo.png';

  // ----- sizing -----
  var DPR = 1;
  var cw = 0, ch = 0;     // CSS pixel size
  function resize(){
    DPR = Math.min(1.5, window.devicePixelRatio || 1);
    var rect = canvas.getBoundingClientRect();
    cw = rect.width  || canvas.clientWidth  || 600;
    ch = rect.height || canvas.clientHeight || 600;
    canvas.width  = Math.max(1, Math.round(cw * DPR));
    canvas.height = Math.max(1, Math.round(ch * DPR));
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  // ----- scroll progress p in [0,1] for the section -----
  function progress(){
    if(!hasSection) return 1;                 // no scroll driver: show finished record
    var r = section.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    // travel from when the section top reaches the bottom of the viewport
    // to when its bottom reaches the top: classic scrollytelling mapping.
    var total = r.height + vh;
    var p = (vh - r.top) / total;
    if(p < 0) p = 0; else if(p > 1) p = 1;
    return p;
  }

  // continuous spin angle once the record is finished
  var spin = 0;
  var lastP = reduce ? 1 : 0;

  // ----- drawing helpers -----
  function clear(){
    ctx.clearRect(0, 0, cw, ch);
  }

  // PHASE A: concentric crimson rings flipping edge-on toward the viewer
  function drawRings(cx, cy, R, flip, alphaMul){
    if(alphaMul == null) alphaMul = 1;
    var N = 7;
    // flip 0 = flat circle, flip 1 = edge-on (squashed). We want them to
    // START edge-on-ish and LAND flat as they settle onto the turntable.
    // scaleY = cos(flip * PI/2): flip 1 -> 0 (edge on), flip 0 -> 1 (flat).
    var scaleY = Math.cos(flip * Math.PI / 2);
    if(scaleY < 0.001) scaleY = 0.001;
    ctx.save();
    ctx.translate(cx, cy);
    for(var i = 0; i < N; i++){
      var t = i / (N - 1);                 // 0..1 outer..inner
      var rad = R * (1 - t * 0.82);
      // alternate the two crimsons for depth
      ctx.strokeStyle = (i % 2 === 0) ? CRIMSON : BRIGHT;
      ctx.lineWidth = Math.max(1.5, R * 0.018 * (1 - t * 0.35));
      ctx.globalAlpha = (0.55 + 0.45 * (1 - t)) * alphaMul;
      ctx.beginPath();
      ctx.ellipse(0, 0, rad, rad * scaleY, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // PHASE B: solid black grooved record with center label + spindle
  function drawRecord(cx, cy, R, angle, sheenPulse, morph){
    ctx.save();
    ctx.translate(cx, cy);

    // morph 0..1: record fades/scales in over the back half of phase A->B
    var rScale = 0.86 + 0.14 * morph;
    var rDisc = R * rScale;

    // --- disc body: radial #0a0708 to #000 ---
    var g = ctx.createRadialGradient(0, 0, rDisc * 0.04, 0, 0, rDisc);
    g.addColorStop(0, '#0a0708');
    g.addColorStop(1, '#000000');
    ctx.globalAlpha = morph;
    ctx.beginPath();
    ctx.arc(0, 0, rDisc, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();

    // subtle crimson edge so it reads against jet black
    ctx.lineWidth = Math.max(1, rDisc * 0.01);
    ctx.strokeStyle = 'rgba(165,42,42,0.45)';
    ctx.beginPath();
    ctx.arc(0, 0, rDisc, 0, Math.PI * 2);
    ctx.stroke();

    // --- grooves: 60 to 80 thin concentric arcs ---
    var labelR = rDisc * 0.32;
    var GR = 70;
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    for(var i = 0; i < GR; i++){
      var gr = labelR + (rDisc - labelR) * (i / GR) * 0.98 + (rDisc - labelR) * 0.01;
      ctx.beginPath();
      ctx.arc(0, 0, gr, 0, Math.PI * 2);
      ctx.stroke();
    }

    // --- rotating sheen wedge sweeping across (spins with the record) ---
    ctx.save();
    ctx.rotate(angle);
    var sheenAlpha = (0.05 + 0.16 * sheenPulse) * morph;
    var sg = ctx.createLinearGradient(-rDisc, 0, rDisc, 0);
    sg.addColorStop(0.0, 'rgba(255,255,255,0)');
    sg.addColorStop(0.48, 'rgba(255,255,255,0)');
    sg.addColorStop(0.5, 'rgba(255,255,255,' + sheenAlpha.toFixed(3) + ')');
    sg.addColorStop(0.52, 'rgba(255,255,255,0)');
    sg.addColorStop(1.0, 'rgba(255,255,255,0)');
    ctx.beginPath();
    ctx.arc(0, 0, rDisc, 0, Math.PI * 2);
    ctx.fillStyle = sg;
    ctx.fill();
    ctx.restore();

    // --- center label (logo clipped into a circle) ---
    ctx.save();
    ctx.rotate(angle);                 // label spins with the record
    ctx.beginPath();
    ctx.arc(0, 0, labelR, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    // crimson backing so the label has body even before the logo loads
    ctx.fillStyle = '#1a0d0d';
    ctx.fillRect(-labelR, -labelR, labelR * 2, labelR * 2);
    if(logoReady){
      var iw = logo.naturalWidth || 1400;
      var ih = logo.naturalHeight || 1257;
      var box = labelR * 1.7;                 // fit the logo inside the label circle
      var s = Math.min(box / iw, box / ih);
      var dw = iw * s, dh = ih * s;
      ctx.drawImage(logo, -dw / 2, -dh / 2, dw, dh);
    }
    ctx.restore();

    // label ring border (#A52A2A)
    ctx.lineWidth = Math.max(2, rDisc * 0.018);
    ctx.strokeStyle = CRIMSON;
    ctx.beginPath();
    ctx.arc(0, 0, labelR, 0, Math.PI * 2);
    ctx.stroke();

    // --- spindle hole dead center ---
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(2, rDisc * 0.014), 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(2, rDisc * 0.014), 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // ----- master render at progress p -----
  function render(p, forceFinished){
    if(!cw || !ch) resize();
    clear();
    var cx = cw / 2, cy = ch / 2;
    var R = Math.min(cw, ch) * 0.42;

    if(forceFinished || reduce){
      // static finished record, no spin, label visible
      drawRecord(cx, cy, R, 0, 0, 1);
      return;
    }

    var RINGS_END = 0.60;   // the rings journey (distant -> zoomed in) takes the first 60%
    var MORPH_END = 0.80;   // record fully formed by 80%, then it just spins

    if(p < RINGS_END){
      // JOURNEY: rings begin small, faint and high in the frame (distant, in the
      // background), then grow, brighten, flip flat and settle to center, as if the
      // record is being lowered onto the platter while you scroll down.
      var a = p / RINGS_END;                  // 0..1
      var ease = a * a * (3 - 2 * a);         // smoothstep
      var scale = 0.10 + 0.90 * ease;         // far away -> full size
      var yOff = (ch * 0.42) * (1 - ease);    // start high, settle to center
      var flip = 1 - ease;                    // edge-on -> flat
      var alpha = 0.20 + 0.80 * ease;         // faint when distant -> solid up close
      drawRings(cx, cy - yOff, R * scale, flip, alpha);
      if(a > 0.82){ var pre = (a - 0.82) / 0.18; drawRecord(cx, cy, R, spin, beat(), pre); }
    } else if(p < MORPH_END){
      // morph the settled rings into the solid record
      var b = (p - RINGS_END) / (MORPH_END - RINGS_END);   // 0..1
      var morph = Math.min(1, b * 1.7);
      if(b < 0.30){ drawRings(cx, cy, R, 0, 1 - b * 3); }  // brief flat-ring bleed
      drawRecord(cx, cy, R, spin, beat(), morph);
    } else {
      // finished record, continuous spin
      drawRecord(cx, cy, R, spin, beat(), 1);
    }
  }

  // ----- animation loop -----
  var running = false;
  var inView = !hasSection;     // if no section, behave as in-view/static
  var rafId = 0;

  function frame(){
    rafId = 0;
    if(!shouldRun()){ running = false; return; }
    lastP = progress();
    if(lastP >= 1){
      // finished: keep a continuous 33rpm-feel spin with beat sheen
      spin += 0.012;
      render(1);
    } else {
      // while flipping/morphing, also advance spin a touch so it has motion at p=1
      spin += 0.012 * (lastP > 0.60 ? 1 : 0);
      render(lastP);
    }
    running = true;
    rafId = requestAnimationFrame(frame);
  }

  function shouldRun(){
    if(reduce) return false;
    if(document.hidden) return false;
    if(!inView) return false;
    return true;
  }

  function start(){
    if(running || !shouldRun()) return;
    running = true;
    rafId = requestAnimationFrame(frame);
  }
  function stop(){
    running = false;
    if(rafId){ cancelAnimationFrame(rafId); rafId = 0; }
  }

  // ----- reduced-motion / no-section: render finished static frame once -----
  if(reduce || !hasSection){
    resize();
    var drawStatic = function(){ render(lastP, true); };
    drawStatic();
    if(logoReady) drawStatic();         // re-draw if logo already cached
    window.addEventListener('resize', drawStatic, { passive: true });
    return;
  }

  // ----- in-view gating -----
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        inView = en.isIntersecting;
        if(inView) start(); else { stop(); }
      });
    }, { threshold: 0.01 });
    io.observe(section);
  } else {
    inView = true;
  }

  document.addEventListener('visibilitychange', function(){
    if(document.hidden) stop(); else start();
  });

  window.addEventListener('resize', function(){
    resize();
    render(lastP);
  }, { passive: true });

  // first paint + boot
  resize();
  render(progress());
  start();

})();

/* ============================================================
   THE 44 — fx-dotfield.js
   Beating radial dot-field background engine.
   Animates EVERY <canvas class="dotfield"> (inset:0 inside a section,
   behind content). Concentric rings of dots pulse outward from center
   on every downbeat like a kick drum, with a half-tempo snare wave.

   Standalone classic <script> (NOT a module). Self-guards if there are
   no .dotfield canvases. Ships a reduced-motion / no-canvas static frame.
   Reads the shared beat clock from window.THE44.beatEnv(performance.now()).
   ============================================================ */
(function(){
  "use strict";

  // ---- self-guard: nothing to do if there are no dot-field canvases ----
  var canvases = [].slice.call(document.querySelectorAll('canvas.dotfield'));
  if(!canvases.length) return;

  // ---- brand palette (strict: crimson, bright red, white, black) ----
  var DIM   = { r:0xA5, g:0x2A, b:0x2A };  // #A52A2A crimson (dim)
  var PEAK  = { r:0xE2, g:0x1B, b:0x2C };  // #E21B2C bright (peak)
  var WHITE = { r:0xFF, g:0xFF, b:0xFF };  // #fff every 4th ring
  var CENTER= { r:0xFF, g:0x25, b:0x36 };  // #ff2536 center tint

  var MAX_ALPHA = 0.45;   // keep it a background
  var RING_STEP_DESKTOP = 26;
  var RING_STEP_MOBILE  = 34;
  var DOT_SPACING = 30;   // arc spacing along a ring

  var reduce = false;
  try { reduce = matchMedia('(prefers-reduced-motion:reduce)').matches; } catch(e){}

  function dpr(){ return Math.min(1.5, (window.devicePixelRatio || 1)); }
  function isMobile(){ return Math.min(window.innerWidth, window.innerHeight) < 700; }

  // shared beat clock (with a safe fallback if THE44 isn't present yet)
  function beat(t){
    var T = window.THE44;
    if(T && typeof T.beatEnv === 'function') return T.beatEnv(t);
    var BEAT_MS = (T && T.BEAT_MS) || 600;
    var phase = (t % BEAT_MS) / BEAT_MS;
    return Math.pow(1 - phase, 2.2);
  }

  function lerp(a,b,t){ return a + (b-a)*t; }
  function mix(c1,c2,t){
    return {
      r: Math.round(lerp(c1.r,c2.r,t)),
      g: Math.round(lerp(c1.g,c2.g,t)),
      b: Math.round(lerp(c1.b,c2.b,t))
    };
  }

  // ---- one field per canvas ----
  function Field(canvas){
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dots = [];      // {x,y,r,ring,white}
    this.maxR = 1;
    this.cx = 0; this.cy = 0;
    this.w = 0; this.h = 0;
    this.visible = false;
    this.built = false;
  }

  // rebuild the geometry for the current canvas size
  Field.prototype.resize = function(){
    var c = this.canvas;
    var rect = c.getBoundingClientRect();
    var w = Math.max(1, Math.round(rect.width));
    var h = Math.max(1, Math.round(rect.height));
    var d = dpr();
    c.width  = Math.round(w * d);
    c.height = Math.round(h * d);
    this.w = w; this.h = h;
    this.ctx.setTransform(d,0,0,d,0,0);
    this.cx = w/2; this.cy = h/2;
    this.maxR = Math.sqrt(this.cx*this.cx + this.cy*this.cy); // reach the corners
    this.build();
  };

  // build concentric rings of dots from center outward
  Field.prototype.build = function(){
    var dots = [];
    var step = isMobile() ? RING_STEP_MOBILE : RING_STEP_DESKTOP;
    var maxR = this.maxR;
    var ringIndex = 0;
    // center dot (ring 0)
    dots.push({ x:this.cx, y:this.cy, ring:0, white:false, center:true });
    for(var r = step; r <= maxR; r += step){
      ringIndex++;
      var isWhite = (ringIndex % 4 === 0);
      var dotsPerRing = Math.round(2 * Math.PI * r / DOT_SPACING);
      if(dotsPerRing < 1) dotsPerRing = 1;
      var phase0 = ringIndex * 0.6; // slight rotational offset per ring
      for(var k = 0; k < dotsPerRing; k++){
        var a = phase0 + (k / dotsPerRing) * Math.PI * 2;
        dots.push({
          x: this.cx + Math.cos(a) * r,
          y: this.cy + Math.sin(a) * r,
          ring: r,
          white: isWhite,
          center: false
        });
      }
    }
    this.dots = dots;
    this.built = true;
  };

  // draw one frame. `env` is the kick envelope [0,1] for this instant.
  Field.prototype.draw = function(env, snareEnv, calm){
    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);
    if(!this.built) return;
    var prev = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = 'lighter';

    var maxR = this.maxR;
    // expanding wavefronts travel OUTWARD from center
    var kickWave  = env * maxR;
    var snareWave = snareEnv * maxR;
    // gaussian width of the wavefront (px)
    var sigma = Math.max(34, maxR * 0.10);
    var twoS2 = 2 * sigma * sigma;
    var sigmaS = Math.max(26, maxR * 0.085);
    var twoS2S = 2 * sigmaS * sigmaS;

    var dots = this.dots;
    for(var i = 0; i < dots.length; i++){
      var dt = dots[i];
      var ring = dt.ring;

      // kick: how close is this ring to the kick wavefront
      var dk = ring - kickWave;
      var kick = Math.exp(-(dk*dk) / twoS2);
      // snare (half tempo, on 2 and 4): a second, softer wave
      var ds = ring - snareWave;
      var snare = 0.6 * Math.exp(-(ds*ds) / twoS2S);

      var pulse = kick + snare;
      if(pulse > 1) pulse = 1;

      // center dot always glows a touch
      if(dt.center) pulse = Math.max(pulse, 0.55);

      // base brightness so the field is always faintly present
      var bright = 0.18 + 0.82 * pulse;

      // color: dim crimson -> bright red as the wave passes;
      // every 4th ring goes white at peak; center tinted #ff2536
      var col;
      if(dt.center){
        col = CENTER;
      } else if(dt.white){
        col = mix(DIM, WHITE, Math.min(1, pulse));
      } else {
        col = mix(DIM, PEAK, Math.min(1, pulse));
      }

      var alpha = MAX_ALPHA * bright;

      // dot grows when the wavefront passes its ring
      var baseR = dt.center ? 2.6 : 1.4;
      var rad = baseR + pulse * (dt.center ? 4.5 : 2.6);

      if(calm){
        // static calm frame: gentle radial falloff, no animation
        var falloff = 1 - Math.min(1, ring / maxR);
        alpha = MAX_ALPHA * (0.22 + 0.30 * falloff);
        rad = baseR + 0.6;
        col = dt.center ? CENTER : (dt.white ? mix(DIM, WHITE, 0.25) : DIM);
      }

      ctx.globalAlpha = alpha;
      ctx.fillStyle = 'rgb(' + col.r + ',' + col.g + ',' + col.b + ')';
      ctx.beginPath();
      ctx.arc(dt.x, dt.y, rad, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = prev;
  };

  // ---- build all fields ----
  var fields = canvases.map(function(c){ return new Field(c); });
  fields.forEach(function(f){ f.resize(); });

  // ---- reduced motion / static fallback: draw ONE calm frame, done ----
  if(reduce){
    fields.forEach(function(f){ f.draw(0, 0, true); });
    // keep it correct on resize, still no animation loop
    var ro = null;
    window.addEventListener('resize', function(){
      fields.forEach(function(f){ f.resize(); f.draw(0,0,true); });
    }, { passive:true });
    return;
  }

  // ---- only animate the on-screen field (one at a time) ----
  var active = null;
  if('IntersectionObserver' in window){
    var iox = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        var f = fields.filter(function(x){ return x.canvas === en.target; })[0];
        if(!f) return;
        f.visible = en.isIntersecting && en.intersectionRatio > 0;
      });
      // pick the most-on-screen visible field as the single active one
      active = null;
      var best = 0;
      entries.length; // (kept for clarity)
      for(var i=0;i<fields.length;i++){
        if(fields[i].visible){ active = fields[i]; break; }
      }
    }, { threshold:[0, 0.01, 0.5] });
    fields.forEach(function(f){ iox.observe(f.canvas); });
  } else {
    // no IO support: animate the first field
    fields.forEach(function(f){ f.visible = true; });
    active = fields[0];
  }

  // resize handling (rebuild geometry, debounced via rAF)
  var resizePending = false;
  window.addEventListener('resize', function(){
    if(resizePending) return;
    resizePending = true;
    requestAnimationFrame(function(){
      resizePending = false;
      fields.forEach(function(f){ f.resize(); });
    });
  }, { passive:true });

  // ---- the loop: pause off-screen and when the tab is hidden ----
  var raf = 0;
  // slow, soothing breathing wave (deliberately far slower than the music beat)
  function slowWave(now, period, offset){
    var phase = ((now + (offset||0)) % period) / period;    // 0..1
    return 0.5 - 0.5*Math.cos(phase * Math.PI * 2);         // smooth 0 -> 1 -> 0
  }
  function frame(){
    raf = 0;
    if(!document.hidden){
      var now = performance.now();
      var env   = slowWave(now, 7600, 0);          // primary ripple, ~7.6s cycle
      var snare = slowWave(now, 7600, 3800) * 0.5; // softer offset ripple
      // draw EVERY on-screen field with the SAME wave, so adjacent sections stay in
      // sync and the dots read as one continuous field bleeding across the boundary
      for(var i=0;i<fields.length;i++){
        if(fields[i].visible) fields[i].draw(env, snare, false);
      }
    }
    schedule();
  }
  function schedule(){ if(!raf) raf = requestAnimationFrame(frame); }

  // pause/resume on visibility change
  document.addEventListener('visibilitychange', function(){
    if(document.hidden){
      if(raf){ cancelAnimationFrame(raf); raf = 0; }
    } else {
      schedule();
    }
  });

  schedule();
})();

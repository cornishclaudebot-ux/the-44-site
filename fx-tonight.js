/* ============================================================
   THE 44 — fx-tonight.js
   Auto-updating "tonight at the bar" line for #tonight.
   Pure DOM. No canvas, no animation dependency.
   Self-guards if #tonight is absent.
   ============================================================ */
(function(){
  "use strict";

  var mount = document.getElementById('tonight');
  if(!mount) return; // self-guard: nothing to do

  var T = window.THE44 || {};
  var CONFIG = T.CONFIG || {};
  var EVENTS = T.EVENTS || [];
  var splitTitle = T.splitTitle || function(t){ return {head:t, sup:""}; };
  var fmtDate = T.fmtDate || function(){ return {dow:"", dnum:"", mon:"", monthKey:""}; };

  var posh = CONFIG.posh || "#";
  var hours = CONFIG.hours || { open:13, close:26 };

  // ---- business-night date (2AM rollover): before 6AM, "tonight" is still the prior calendar date ----
  function businessDate(){
    var now = new Date();
    var ref = new Date(now.getTime());
    if(ref.getHours() < 6){
      ref.setDate(ref.getDate() - 1); // roll back to the prior calendar date
    }
    // LOCAL-time date string. CRITICAL: never toISOString (Arizona is MST -> off-by-one).
    var dateStr = ref.toLocaleDateString("en-CA");           // YYYY-MM-DD in local time
    var weekday = ref.toLocaleDateString("en-US", {weekday:"long"});
    return { dateStr:dateStr, weekday:weekday };
  }

  // ---- Open Now vs Opens 1PM, using hours.open (13) / hours.close (26 = 2AM next day) ----
  function openState(){
    var now = new Date();
    var h = now.getHours() + now.getMinutes()/60;
    var isOpen = (h >= hours.open) || (h < (hours.close - 24));
    return isOpen
      ? { open:true,  label:"Open Now" }
      : { open:false, label:"Opens 1PM" };
  }

  function esc(s){
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;');
  }

  function poshBtn(text){
    // Build href directly from CONFIG.posh. The global data-cfg resolver already ran,
    // so injected links are NOT auto-resolved; we set the href ourselves.
    return '<a class="btn btn-led btn-sm" href="' + esc(posh) + '" target="_blank" rel="noopener">' + esc(text) + '</a>';
  }

  function render(){
    var bn = businessDate();
    var st = openState();

    var tag = '<span class="tn-tag' + (st.open ? ' tn-open' : ' tn-closed') + '">' + esc(st.label) + '</span>';

    // Match an event to tonight's business date
    var tonightEv = null;
    for(var i=0;i<EVENTS.length;i++){
      if(EVENTS[i] && EVENTS[i].date === bn.dateStr){ tonightEv = EVENTS[i]; break; }
    }

    var html;
    if(tonightEv){
      var head = splitTitle(tonightEv.title).head;
      var time = tonightEv.time || "";
      html =
        tag +
        '<span class="tn-line">TONIGHT, ' + esc(bn.weekday) + ': ' + esc(head) +
        ', doors ' + esc(time) + '</span>' +
        poshBtn("Get Tickets");
    } else {
      // weekday house-vibe line + next up
      var nextEv = null;
      for(var j=0;j<EVENTS.length;j++){
        if(EVENTS[j] && EVENTS[j].date >= bn.dateStr){ nextEv = EVENTS[j]; break; }
      }
      var nextBit = '';
      if(nextEv){
        var nHead = splitTitle(nextEv.title).head;
        var f = fmtDate(nextEv.date); // {dow, dnum, mon, monthKey}
        var monDay = (f.mon || '') + ' ' + (f.dnum != null ? f.dnum : '');
        monDay = monDay.replace(/\s+/g,' ').trim();
        nextBit = '<span class="tn-next">Next up: ' + esc(nHead) + ', ' + esc(monDay) + '</span>';
      }
      html =
        tag +
        '<span class="tn-line">TONIGHT, ' + esc(bn.weekday) +
        ': Live music and a full bar, open til 2AM</span>' +
        nextBit +
        poshBtn("See Shows");
    }

    mount.innerHTML = html;

    // Re-observe any injected .reveal nodes if a global reveal observer exists.
    if(typeof observeReveals === 'function'){
      try { observeReveals(); } catch(e){}
    }
  }

  render();

  // Keep it current across the 6AM and 1PM boundaries without animation deps.
  // A light interval is plenty for a text line; refresh every minute.
  setInterval(render, 60 * 1000);

  // Refresh when the tab is shown again (covers long idle periods).
  document.addEventListener('visibilitychange', function(){
    if(!document.hidden) render();
  });

})();

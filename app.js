/* ============================================================
   THE 44 — shared app logic + data
   ============================================================ */
const CONFIG = {
  // --- ORDERING (replace with real store URLs) ---
  toast: "https://order.toasttab.com/online/the44live",   // REAL Toast online ordering
  uber:  "https://www.ubereats.com/store/the-44",          // TODO real Uber Eats store URL
  // --- TICKETS (REAL) ---
  posh:  "https://posh.vip/g/the44",
  // --- CONTACT (REAL) ---
  phone: "(623) 842-1053",
  phoneRaw: "+16238421053",
  address: "4494 W Peoria Ave, Glendale, AZ 85302",
  // --- EVENT EMAILS (one inbox per type — confirm/create) ---
  emails: {
    corporate: "corporate@the44.live",   // TODO confirm
    private:   "private@the44.live",      // TODO confirm
    talent:    "talent@the44.live",       // TODO confirm
    specialty: "specialty@the44.live",    // TODO confirm
    default:   "book@the44.live"          // REAL catch-all
  },
  // --- SOCIALS (REAL) ---
  ig: "https://instagram.com/the44sportsgrillandnightlife",
  fb: "https://facebook.com/The44AZ",
  tt: "https://tiktok.com/@the44livemusicbar",
  // --- HOURS (24h; close 26 = 2AM next day) ---
  hours: { open:13, close:26 }
};
// --- MAP DEEP LINKS (built from address) ---
CONFIG.mapGoogle = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.address);
CONFIG.mapApple  = "https://maps.apple.com/?q=" + encodeURIComponent(CONFIG.address);

/* ---- REAL upcoming events, pulled live from posh.vip/g/the44 ---- */
/* Each event deep-links to its own posh.vip/e/<slug> ticket page via `url`
   (slugs scraped + verified live 2026-07-01). Buttons fall back to CONFIG.posh
   only if a `url` is missing. */
const EVENTS = [
  {date:"2026-06-27", time:"6:00 PM", title:"Memorial Concert for our friend Dom Villegas", url:"https://posh.vip/e/memorial-concert-for-our-friend-dom-villegas"},
  {date:"2026-07-03", time:"7:00 PM", title:"The Meteors w/ Not Dead Yet, Red Shirts Die First, VicTims & The Kentucky Rifles, ChaChooga", url:"https://posh.vip/e/the-meteors-with-horns-up-red-shirts-die-first"},
  {date:"2026-07-10", time:"7:00 PM", title:"Adema w/ Navagon, Faultline & Tridon", url:"https://posh.vip/e/adema"},
  {date:"2026-07-11", time:"7:00 PM", title:"Gunshine w/ Atomic Kings & Jet Black Romance", url:"https://posh.vip/e/gunshine-w-atomic-kings-jet-black-romance"},
  {date:"2026-07-17", time:"7:00 PM", title:"Junk Drawer w/ Blonde, Horns Up, Dizzy Mavis & Blissful Intentions", url:"https://posh.vip/e/junk-drawer-w-blonde-horns-up-dizzy-mavis-blissful-intentions"},
  {date:"2026-07-18", time:"7:00 PM", title:"Bullet Boys w/ Whiskey Dogz, Ghost of 88 & RevUnion", url:"https://posh.vip/e/bullet-boys-wiskey-dogz-ghost-88"},
  {date:"2026-07-24", time:"8:00 PM", title:"Menace Mary w/ A Perfect Tool", url:"https://posh.vip/e/menace-mary-w-a-perfect-tool"},
  {date:"2026-07-25", time:"7:00 PM", title:"Fraxures w/ Dead Groove, Murderone, Beowulf, Knowing Forever & Hollow Riot", url:"https://posh.vip/e/fraxures-w-dead-groove-murderone-beowulf-knowing-forever-and-hollow-riot"},
  {date:"2026-07-28", time:"7:00 PM", title:"Ex-Faces w/ Saints of Solomon, Deep Within, Apex Nemesis & ShowMeGod", url:"https://posh.vip/e/exfaces-saints-of-solomon-deep-within-apex-nemesis-showmegod"},
  {date:"2026-07-31", time:"8:00 PM", title:"Dance Electra", url:"https://posh.vip/e/dance-electra"},
  {date:"2026-08-01", time:"7:00 PM", title:"Lucid Intent w/ Bleed the Fifth, Wrath Upon Eden & Street Creep", url:"https://posh.vip/e/lucid-intent-w-bleed-the-fifth-and-more-tba"},
  {date:"2026-08-08", time:"8:00 PM", title:"Missing Persons w/ Mills End, TwoFew & 24 B4 40", url:"https://posh.vip/e/missing-persons-w-mills-end-24-b4-40"},
  {date:"2026-08-15", time:"8:00 PM", title:"The Zeppelin IV", tag:"Tribute", url:"https://posh.vip/e/the-zeppelin-iv"},
  {date:"2026-08-21", time:"8:00 PM", title:"Soul Persuasion", url:"https://posh.vip/e/soul-persuasion-1"},
  {date:"2026-08-22", time:"8:00 PM", title:"Pity The Foo", url:"https://posh.vip/e/pity-the-foo"},
  {date:"2026-08-28", time:"8:00 PM", title:"Power Drive", url:"https://posh.vip/e/power-drive"},
  {date:"2026-08-29", time:"8:00 PM", title:"New Destiny", url:"https://posh.vip/e/new-destiny-1"},
  {date:"2026-09-04", time:"6:00 PM", title:"Kottonmouth Kings w/ Property Six, N2, Spook Squad, OG Clinto & Dizzy Vee", url:"https://posh.vip/e/kottonmouth-kings-w-property-six-n2-spook-squad-og-clinto-dizzy-vee"},
  {date:"2026-09-05", time:"7:00 PM", title:"The Dickies w/ Toxic Energy, Mike and the Molotov's, None & Scorpion vs. Tarantula", url:"https://posh.vip/e/the-dickies-w-toxic-energy-mike-and-the-molotovs-none-scorpion-vs-tarantula"},
  {date:"2026-09-11", time:"8:00 PM", title:"Menace Mary", url:"https://posh.vip/e/menace-mary"},
  {date:"2026-09-16", time:"7:00 PM", title:"TRAPT: The Then til Now Tour w/ Sygnal To Noise, TwoFew & Part Ridge Family", url:"https://posh.vip/e/trapt-the-then-til-now-tour-w-sygnal-to-noise-twofew-part-ridge-family"},
  {date:"2026-09-18", time:"8:00 PM", title:"Octane", url:"https://posh.vip/e/octane-1"},
  {date:"2026-09-26", time:"8:00 PM", title:"Animal Magnetism & AZ/DZ", tag:"Tribute", url:"https://posh.vip/e/azdz"},
  {date:"2026-10-03", time:"8:00 PM", title:"Without Fear", url:"https://posh.vip/e/without-fear"},
  {date:"2026-10-24", time:"8:00 PM", title:"RED WHITE AND NU", tag:"New Date", url:"https://posh.vip/e/elote-korn-tribute-w-be-quiet-and-drive-deftones-tribute"},
  {date:"2026-11-12", time:"6:00 PM", title:"Killer Dwarfs w/ Lit Up", url:"https://posh.vip/e/killer-dwarfs-wlit-up"},
  {date:"2026-11-20", time:"8:00 PM", title:"Green Jello", url:"https://posh.vip/e/green-jello"},
  {date:"2026-11-24", time:"6:00 PM", title:"A Killer's Confession w/ Dizasterpiece & Dead Things", url:"https://posh.vip/e/a-killers-confession-wdizasterpiece-dead-things"}
];

/* ---- menu / food (sample — swap copy + drop real photos in assets/food/) ---- */
const FOOD = [
  {n:"Wings",             d:"A dozen tossed in your sauce, with ranch or blue cheese, carrots and celery.", price:"$15", tag:"Crowd Favorite", img:"assets/food/wings.jpg", cat:"wings"},
  {n:"Burger Sliders",    d:"Three angus sliders with cheese and pickles, piled high with seasoned fries.", price:"$16", tag:"Signature", img:"assets/food/sliders.jpg", cat:"burger"},
  {n:"Chicken Strips",    d:"Hand-breaded and golden, served with fries and your choice of sauce.", price:"$8", tag:"", img:"assets/food/tenders.jpg", cat:"tenders"},
  {n:"Caprese Flatbread", d:"Fresh mozzarella, tomato, basil and a balsamic drizzle on crispy flatbread.", price:"$12", tag:"Shareable", img:"assets/food/flatbread.jpg", cat:"flatbread"},
  {n:"French Dip",        d:"Chopped steak and provolone on a toasted roll, with au jus and fries.", price:"$16", tag:"", img:"assets/food/frenchdip.jpg", cat:"sandwich"},
  {n:"Rice Bowl",         d:"Jasmine rice, steamed broccoli, cauliflower and carrots.", price:"$12", tag:"", img:"assets/food/ricebowl.jpg", cat:"bowl"},
  {n:"Drunken Nachos",     d:"Cheese sauce, cotija, jalapeños and pico. Built to share.", price:"$15", tag:"Signature", img:"assets/menu/the-44-drunken-nachos.jpg", cat:"nachos"},
  {n:"Tacos",              d:"Street style with cilantro, onions and fresh salsa.", price:"$3", tag:"Headliner", img:"assets/menu/tacos.jpg", cat:"tacos"},
  {n:"Philly Cheesesteak", d:"Shaved steak, peppers and melted provolone on a hoagie.", price:"$17", tag:"", img:"assets/menu/philly-cheesesteak.jpg", cat:"sandwich"},
  {n:"Pretzels & Queso",   d:"Warm soft pretzels with a side of house queso.", price:"$7", tag:"Shareable", img:"assets/menu/pretzels.jpg", cat:"pretzel"}
];

/* ---- inline-SVG plated-dish map (photo-ready CSS/SVG until real shots land) ---- */
const PLATES = {
  wings:`<svg class="food-svg" viewBox="0 0 120 120" aria-hidden="true"><g><path d="M38 70c-6-10 2-20 12-20s16 8 12 18c-3 8-18 10-24 2z" fill="#7a3410"/><path d="M40 66c-3-6 2-12 9-12s11 5 9 12c-2 6-14 7-18 0z" fill="#b5601f"/><path d="M64 74c-6-10 2-20 12-20s16 8 12 18c-3 8-18 10-24 2z" fill="#7a3410"/><path d="M66 70c-3-6 2-12 9-12s11 5 9 12c-2 6-14 7-18 0z" fill="#b5601f"/><path d="M52 56c-4-7 2-14 9-14s12 6 9 14c-2 6-14 7-18 0z" fill="#8a3d12"/><path d="M30 56q30 18 60 0" stroke="#E21B2C" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/></g></svg>`,
  burger:`<svg class="food-svg" viewBox="0 0 120 120" aria-hidden="true"><g><path d="M30 44q30-22 60 0z" fill="#d98a32"/><rect x="30" y="44" width="60" height="6" fill="#2faa3a"/><rect x="28" y="50" width="64" height="8" rx="3" fill="#7a3a18"/><path d="M28 58h64l-6 7q-26 8-52 0z" fill="#f4c542"/><rect x="30" y="64" width="60" height="9" rx="4" fill="#c79a55"/><circle cx="46" cy="40" r="1.4" fill="#fff8e1"/><circle cx="60" cy="37" r="1.4" fill="#fff8e1"/><circle cx="74" cy="40" r="1.4" fill="#fff8e1"/></g></svg>`,
  nachos:`<svg class="food-svg" viewBox="0 0 120 120" aria-hidden="true"><g><polygon points="48,44 64,44 56,62" fill="#e8b54a"/><polygon points="60,46 78,46 69,64" fill="#dca838"/><polygon points="42,52 60,52 51,70" fill="#e8b54a"/><polygon points="62,54 80,54 71,72" fill="#dca838"/><circle cx="56" cy="58" r="2.4" fill="#3fae45"/><circle cx="66" cy="60" r="2.4" fill="#E21B2C"/><circle cx="60" cy="66" r="2.4" fill="#3fae45"/><path d="M44 50q18 8 34 0" stroke="#f4d06a" stroke-width="2.5" fill="none" opacity=".7"/></g></svg>`,
  fries:`<svg class="food-svg" viewBox="0 0 120 120" aria-hidden="true"><g><rect x="44" y="40" width="6" height="38" rx="2" fill="#f0bb3e"/><rect x="53" y="36" width="6" height="42" rx="2" fill="#f4c84e"/><rect x="62" y="38" width="6" height="40" rx="2" fill="#f0bb3e"/><rect x="71" y="42" width="6" height="36" rx="2" fill="#f4c84e"/><path d="M40 70h44l-6 16q-16 6-32 0z" fill="#A52A2A"/><path d="M40 70h44l-1.5 4H41.5z" fill="#E21B2C"/></g></svg>`,
  cocktail:`<svg class="food-svg" viewBox="0 0 120 120" aria-hidden="true"><g><path d="M40 38h40L62 64v18h8v6H50v-6h8V64z" fill="rgba(255,255,255,.12)" stroke="rgba(255,255,255,.4)" stroke-width="1.5"/><path d="M46 44h28L62 62z" fill="#E21B2C" opacity=".85"/><circle cx="74" cy="40" r="4" fill="#ff5a45"/><path d="M62 40v-8" stroke="#3fae45" stroke-width="2"/></g></svg>`,
  draft:`<svg class="food-svg" viewBox="0 0 120 120" aria-hidden="true"><g><path d="M48 44h24v40a6 6 0 01-6 6H54a6 6 0 01-6-6z" fill="#e6a417" opacity=".9"/><path d="M48 44h24v8H48z" fill="#fff7e6"/><circle cx="52" cy="42" r="4" fill="#fff7e6"/><circle cx="60" cy="40" r="5" fill="#fff"/><circle cx="68" cy="42" r="4" fill="#fff7e6"/><path d="M72 54h8a6 6 0 016 6v8a6 6 0 01-6 6h-8z" fill="none" stroke="#e6a417" stroke-width="3"/><path d="M52 58v22M60 58v22M68 58v22" stroke="#c98a0e" stroke-width="1" opacity=".5"/></g></svg>`
};

const EVENT_TYPES = [
  {key:"corporate", title:"Corporate & Buyouts",
   desc:"Team nights, holiday parties, client mixers and full venue buyouts with a private stage and bar.",
   icon:'<path d="M3 21V7l9-4 9 4v14h-6v-6h-6v6zM9 11h2v2H9zm4 0h2v2h-2z"/>'},
  {key:"private", title:"Private Parties",
   desc:"Birthdays, bachelor & bachelorette bashes, reunions and celebrations. Your crowd, our stage.",
   icon:'<path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 7.7l5.4-.8z"/>'},
  {key:"talent", title:"Live Music & Artist Booking",
   desc:"Play our stage. Residencies, touring routes, open-mic slots and band booking. Talent, hit us.",
   icon:'<path d="M12 3v10.55A4 4 0 1014 17V7h4V3z"/>'},
  {key:"specialty", title:"Specialty Events",
   desc:"Themed nights, fundraisers & nonprofits, viewing parties, weddings, receptions and anything custom.",
   icon:'<path d="M5 3h14a1 1 0 011 1v7a8 8 0 01-16 0V4a1 1 0 011-1zm2 16h10v2H7zM2 6h2v3a2 2 0 01-2-2zm18 0h2v1a2 2 0 01-2 2z"/>'}
];

/* ---- icons ---- */
const IC = {
  ig:'<svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 3.3.15 4.8 1.7 5 5 .06 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.2 3.3-1.7 4.8-5 5-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-3.3-.2-4.8-1.7-5-5C2.04 15.6 2 15.2 2 12s0-3.6.07-4.9c.2-3.3 1.7-4.8 5-5C8.4 2.2 8.8 2.2 12 2.2zm0 4.8a5 5 0 100 10 5 5 0 000-10zm0 8.2a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4zm5.2-9.4a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z"/></svg>',
  fb:'<svg viewBox="0 0 24 24"><path d="M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.5 2.9h-2.3v7A10 10 0 0022 12z"/></svg>',
  tt:'<svg viewBox="0 0 24 24"><path d="M16.5 5.8a4.8 4.8 0 01-3-1.3v8.8a5.5 5.5 0 11-5.5-5.5c.3 0 .6 0 .8.07v2.8a2.7 2.7 0 102 2.6V2h2.7a4.8 4.8 0 003 4.2z"/></svg>',
  clock:'<svg viewBox="0 0 24 24"><path d="M12 1a11 11 0 100 22 11 11 0 000-22zm1 11h5v2h-7V6h2z"/></svg>',
  pin:'<svg viewBox="0 0 24 24"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z"/></svg>',
  phone:'<svg viewBox="0 0 24 24"><path d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.24 11 11 0 003.5.56 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11 11 0 00.56 3.5 1 1 0 01-.24 1z"/></svg>',
  mail:'<svg viewBox="0 0 24 24"><path d="M4 4h16v16H4zm2 4 6 4 6-4"/></svg>',
  ticket:'<svg viewBox="0 0 24 24"><path d="M3 7a2 2 0 012-2h14a2 2 0 012 2v3a2 2 0 000 4v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 000-4zm12 0v10h2V7z"/></svg>',
  arrow:'<svg viewBox="0 0 24 24"><path d="M5 12h12l-5-5 1.4-1.4L21 12l-7.6 7.4L12 18l5-5H5z"/></svg>',
  check:'<svg viewBox="0 0 24 24"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>'
};

/* ============================================================
   BUILD shared chrome (nav + footer + modal)
   ============================================================ */
const path = location.pathname.split('/').pop() || 'index.html';
const isHome = path === '' || path === 'index.html';
const home = isHome ? '' : 'index.html';

function buildNav(){
  const mount = document.getElementById('nav-mount'); if(!mount) return;
  const active = (h)=> (h===path || (isHome && h==='index.html')) ? ' class="active"' : '';
  // top-level items; some carry a dropdown of children
  const NAV = [
    {h:'index.html', t:'Home'},
    {h:'events.html', t:'Live Music'},
    {t:'Order', children:[
      {t:'Pickup on Toast', cfg:'toast', cls:'toast'},
      {t:'Late-Night Delivery on Uber Eats', cfg:'uber', cls:'uber'},
      {t:'See the Menu', h:'menu.html'}
    ]},
    {t:'Menu', children:[
      {t:'Full Menu', h:'menu.html'},
      {t:'Order Food', h:`${home}#order`},
      {t:'Pickup on Toast', cfg:'toast', cls:'toast'},
      {t:'Delivery on Uber Eats', cfg:'uber', cls:'uber'}
    ]},
    {h:'book.html', t:'Book an Event'}
  ];
  // a single child row -> <a>
  const ddRow = (c)=>{
    const cls = `dd-row${c.cls?(' '+c.cls):''}`;
    if(c.cfg) return `<a class="${cls}" data-cfg="${c.cfg}" target="_blank" rel="noopener">${c.t}</a>`;
    return `<a class="${cls}" href="${c.h}">${c.t}</a>`;
  };
  // desktop top-level item (plain link or dropdown)
  const topItem = (l)=>{
    if(l.children){
      return `<div class="nav-dd">
        <button class="nav-dd-trigger" aria-haspopup="true" aria-expanded="false">${l.t}<span class="dd-caret" aria-hidden="true">▾</span></button>
        <div class="nav-dd-menu">${l.children.map(ddRow).join('')}</div>
      </div>`;
    }
    return `<a href="${l.h}"${active(l.h)}>${l.t}</a>`;
  };
  // mobile: flatten children inline under their parent
  const mobileItem = (l)=>{
    if(l.children){
      return `<div class="mm-group"><span class="mm-group-label">${l.t}</span>${l.children.map(ddRow).join('')}</div>`;
    }
    return `<a href="${l.h}">${l.t}</a>`;
  };
  mount.outerHTML = `
  <header class="site" id="header">
    <nav class="nav">
      <a href="index.html" class="brand" aria-label="The 44 home"><img src="assets/logo.png" alt="The 44 Live Music Bar"></a>
      <div class="nav-links">${NAV.map(topItem).join('')}</div>
      <div class="nav-right">
        <div class="nav-social">
          <a href="${CONFIG.ig}" target="_blank" rel="noopener" aria-label="Instagram">${IC.ig}</a>
          <a href="${CONFIG.tt}" target="_blank" rel="noopener" aria-label="TikTok">${IC.tt}</a>
          <a href="${CONFIG.fb}" target="_blank" rel="noopener" aria-label="Facebook">${IC.fb}</a>
        </div>
        <a href="${home}#order" class="btn btn-primary btn-sm">Order Now</a>
        <button class="hamburger" id="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
      </div>
    </nav>
  </header>
  <div class="mobile-menu" id="mobileMenu">
    ${NAV.map(mobileItem).join('')}
    <a href="${home}#order" class="btn btn-primary">Order Now</a>
    <div class="mm-social">
      <a href="${CONFIG.ig}" target="_blank" rel="noopener" aria-label="Instagram">${IC.ig}</a>
      <a href="${CONFIG.tt}" target="_blank" rel="noopener" aria-label="TikTok">${IC.tt}</a>
      <a href="${CONFIG.fb}" target="_blank" rel="noopener" aria-label="Facebook">${IC.fb}</a>
    </div>
  </div>`;
}

/* ---------- nav dropdown wiring (hover desktop / tap mobile / Esc + outside-click) ---------- */
function wireNavDropdowns(){
  const dds=[...document.querySelectorAll('.nav-dd')]; if(!dds.length) return;
  const fine=matchMedia('(pointer:fine)').matches;
  const closeAll=(except)=>dds.forEach(dd=>{
    if(dd===except) return;
    dd.classList.remove('open');
    const t=dd.querySelector('.nav-dd-trigger'); if(t) t.setAttribute('aria-expanded','false');
  });
  dds.forEach(dd=>{
    const trig=dd.querySelector('.nav-dd-trigger');
    // click to open and HOLD it open (only closes on outside-click or Escape, never on mouse-out)
    trig.addEventListener('click',(e)=>{
      e.preventDefault();
      const willOpen=!dd.classList.contains('open');
      closeAll(dd);
      dd.classList.toggle('open',willOpen);
      trig.setAttribute('aria-expanded',String(willOpen));
    });
  });
  // outside click closes
  document.addEventListener('click',(e)=>{ if(!e.target.closest('.nav-dd')) closeAll(); });
  // Escape closes
  document.addEventListener('keydown',(e)=>{ if(e.key==='Escape') closeAll(); });
}

function buildFooter(){
  const mount = document.getElementById('footer-mount'); if(!mount) return;
  mount.outerHTML = `
  <footer class="site">
    <div class="foot-inner">
      <div class="foot-brand">
        <img src="assets/logo.png" alt="The 44">
        <p>Phoenix's live music bar. High-impact live experiences and rockin' food in the heart of the West Valley.</p>
        <div class="socials" style="margin-top:18px">
          <a href="${CONFIG.ig}" target="_blank" rel="noopener" aria-label="Instagram">${IC.ig}</a>
          <a href="${CONFIG.tt}" target="_blank" rel="noopener" aria-label="TikTok">${IC.tt}</a>
          <a href="${CONFIG.fb}" target="_blank" rel="noopener" aria-label="Facebook">${IC.fb}</a>
        </div>
      </div>
      <div class="foot-col"><h5>Explore</h5>
        <a href="events.html">Live Music</a><a href="menu.html">Menu</a><a href="book.html">Book an Event</a><a href="${home}#order">Order</a>
      </div>
      <div class="foot-col"><h5>Order &amp; Tickets</h5>
        <a href="${CONFIG.toast}" target="_blank" rel="noopener">Pickup on Toast</a>
        <a href="${CONFIG.uber}" target="_blank" rel="noopener">Delivery on Uber Eats</a>
        <a href="${CONFIG.posh}" target="_blank" rel="noopener">Event Tickets</a>
      </div>
      <div class="foot-col"><h5>Visit</h5>
        <a href="tel:${CONFIG.phoneRaw}">${CONFIG.phone}</a>
        <a href="mailto:${CONFIG.emails.default}">${CONFIG.emails.default}</a>
        <a href="${CONFIG.mapApple}" target="_blank" rel="noopener">Directions on Apple Maps</a>
        <a href="${CONFIG.mapGoogle}" target="_blank" rel="noopener">4494 W Peoria Ave</a>
      </div>
    </div>
    <div class="foot-bottom">
      <span>© 2026 The 44 Live Music Bar · Glendale, AZ</span>
      <span title="good intentions every day">Built for the crowd.</span>
    </div>
  </footer>`;
}

function buildModal(){
  if(document.getElementById('modal')) return;
  const d = document.createElement('div');
  d.innerHTML = `
  <div class="modal-overlay" id="modal">
    <div class="modal">
      <button class="modal-close" id="modalClose" aria-label="Close">✕</button>
      <div class="modal-top">
        <span class="eyebrow">Event Request</span>
        <h3 id="modalTitle">Book Your Event</h3>
        <div class="to">Goes straight to <b id="modalEmail">book@the44.live</b></div>
      </div>
      <div class="modal-body">
        <form id="bookForm">
          <input type="hidden" id="evtType">
          <div class="field-row">
            <div class="field"><label>Your Name</label><input type="text" id="fName" required placeholder="First &amp; last"></div>
            <div class="field"><label>Phone</label><input type="tel" id="fPhone" placeholder="(623) 000-0000"></div>
          </div>
          <div class="field"><label>Email</label><input type="email" id="fEmail" required placeholder="you@email.com"></div>
          <div class="field-row">
            <div class="field"><label>Preferred Date</label><input type="date" id="fDate"></div>
            <div class="field"><label>Headcount</label><input type="number" id="fGuests" min="1" placeholder="Approx. guests"></div>
          </div>
          <div class="field"><label>Tell us about your event</label><textarea id="fMsg" placeholder="Vibe, budget, live music, food &amp; bar needs, anything else..."></textarea></div>
          <button type="submit" class="btn btn-primary btn-block">Send Request</button>
        </form>
        <div class="modal-success" id="modalSuccess">
          <div class="check">${IC.check}</div>
          <h4>Your email is ready to send</h4>
          <p>We opened a pre-filled message to <span class="em" id="successEmail">book@the44.live</span>. Just hit send and we'll get right back to you.</p>
        </div>
      </div>
    </div>
  </div>`;
  document.body.appendChild(d.firstElementChild);
}

/* ============================================================
   INIT
   ============================================================ */
buildNav(); buildFooter(); buildModal();
wireNavDropdowns();

// resolve data-cfg links anywhere on the page
const mapUrl = CONFIG.mapGoogle; // back-compat alias for the Google search URL
const mapApple = CONFIG.mapApple, mapGoogle = CONFIG.mapGoogle;
document.querySelectorAll('[data-cfg]').forEach(el=>{
  const k = el.getAttribute('data-cfg');
  const map = {toast:CONFIG.toast,uber:CONFIG.uber,posh:CONFIG.posh,ig:CONFIG.ig,fb:CONFIG.fb,tt:CONFIG.tt,
               map:mapGoogle,mapgoogle:mapGoogle,mapapple:mapApple};
  if(k in map) el.href = map[k];
  else if(k==='tel'){ el.href="tel:"+CONFIG.phoneRaw; if(!el.textContent.trim())el.textContent=CONFIG.phone; }
  else if(k==='mailDefault') el.href="mailto:"+CONFIG.emails.default;
});

// header scroll state
const header=document.getElementById('header');
if(header) addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>40),{passive:true});

// mobile menu
const ham=document.getElementById('hamburger'), mm=document.getElementById('mobileMenu');
if(ham){ ham.addEventListener('click',()=>mm.classList.toggle('open'));
  mm.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mm.classList.remove('open'))); }

// cursor spotlight
const spot=document.querySelector('.spotlight');
if(spot && matchMedia('(pointer:fine)').matches){
  addEventListener('mousemove',e=>{spot.classList.add('on');spot.style.transform=`translate(${e.clientX}px,${e.clientY}px) translate(-50%,-50%)`;},{passive:true});
  addEventListener('mouseleave',()=>spot.classList.remove('on'));
}

// marquees
function fillMarquee(id, items){
  const t=document.getElementById(id); if(!t) return;
  const set=items.map(x=>`<span>${x}</span>`).join('');
  t.innerHTML=set+set;
}
const MQ=["Live Music 7 Nights","Cold Beer","Rockin' Food","Late Night Eats","Penny Beers Daily","Glendale AZ","Book Your Event","Open Til 2AM"];
fillMarquee('mq1',MQ); fillMarquee('mq2',MQ);

// equalizer visualizer bars (red gradient, moving up and down)
document.querySelectorAll('.eq').forEach(eq=>{
  eq.innerHTML='';
  for(let i=0;i<30;i++){
    const s=document.createElement('span');
    s.style.animationDelay=(-Math.random()*1.2).toFixed(2)+'s';
    s.style.animationDuration=(0.65+Math.random()*0.7).toFixed(2)+'s';
    eq.appendChild(s);
  }
});

// live open/closed badge
(function(){
  const pillEl=document.getElementById('livePill'); if(!pillEl) return;
  const now=new Date(); const h=now.getHours()+now.getMinutes()/60;
  const open=(h>=CONFIG.hours.open)||(h<(CONFIG.hours.close-24));
  const txt=document.getElementById('liveText');
  if(open){txt.textContent="Open Now · til 2AM";} else {pillEl.classList.add('closed');txt.textContent="Opens 1PM";}
})();

/* ---------- the rhythmic, clickable logo ---------- */
(function(){
  const wrap=document.getElementById('heroLogoWrap'); if(!wrap) return;
  const img=wrap.querySelector('img');
  const hint=wrap.querySelector('.logo-hint');
  wrap.addEventListener('click',()=>{
    // 1) strum punch
    wrap.classList.remove('struck'); void wrap.offsetWidth; wrap.classList.add('struck');
    // 2) crimson ripple (brain-style)
    const r=document.createElement('div'); r.className='ripple'; wrap.appendChild(r);
    setTimeout(()=>r.remove(),950);
    // reward the tapper: swap the hint copy (easter egg phrase B)
    if(hint) hint.textContent='good intentions every day';
    // 3) echoes that fall down the screen — measure the live canvas if it booted, else the img
    const target=document.getElementById('heroParticles')||document.getElementById('heroLogo')||img;
    const rect=target.getBoundingClientRect();
    const n=7;
    for(let i=0;i<n;i++){
      const e=document.createElement('img');
      e.src='assets/logo.png'; e.className='echo';
      e.style.left=(rect.left+rect.width/2-60+(Math.random()*60-30))+'px';
      e.style.top=(rect.top+rect.height/2-60)+'px';
      e.style.animationDelay=(i*0.08)+'s';
      e.style.width=(90-i*6)+'px';
      document.body.appendChild(e);
      setTimeout(()=>e.remove(),1700+i*90);
    }
    // 4) follow it down — scroll to the next section
    const next=document.getElementById('whatson')||document.querySelector('section + section');
    setTimeout(()=>{ if(next) next.scrollIntoView({behavior:'smooth'}); },360);
  });
})();

/* ---------- order toggle ---------- */
(function(){
  const tg=document.querySelector('.order-toggle'); if(!tg) return;
  const pill=document.getElementById('togglePill');
  tg.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{
    tg.querySelectorAll('button').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    const tab=b.dataset.tab;
    pill.classList.toggle('right',tab==='delivery');
    // platform identity: recolor the toggle pill (Toast orange on pickup, Uber green on delivery)
    const platform = tab==='delivery' ? 'uber' : 'toast';
    tg.dataset.platform = platform;
    document.body.classList.toggle('theme-toast', platform==='toast');
    document.body.classList.toggle('theme-uber',  platform==='uber');
    document.querySelectorAll('.order-panel').forEach(p=>p.classList.remove('active'));
    document.getElementById('panel-'+tab).classList.add('active');
  }));
})();

/* ---------- booking modal + per-type email routing ---------- */
(function(){
  const modal=document.getElementById('modal'); if(!modal) return;
  const mTitle=document.getElementById('modalTitle'), mEmail=document.getElementById('modalEmail');
  const evtTypeInput=document.getElementById('evtType');
  let activeEmail=CONFIG.emails.default;
  window.openBooking=function(key){
    const ev=EVENT_TYPES.find(e=>e.key===key);
    activeEmail=CONFIG.emails[key]||CONFIG.emails.default;
    mTitle.textContent=ev?ev.title:"Book Your Event";
    mEmail.textContent=activeEmail;
    evtTypeInput.value=ev?ev.title:"General";
    document.getElementById('bookForm').style.display='block';
    document.getElementById('modalSuccess').classList.remove('show');
    modal.classList.add('open'); document.body.style.overflow='hidden';
  };
  function close(){modal.classList.remove('open');document.body.style.overflow='';}
  document.getElementById('modalClose').addEventListener('click',close);
  modal.addEventListener('click',e=>{if(e.target===modal)close();});
  addEventListener('keydown',e=>{if(e.key==='Escape')close();});
  document.getElementById('bookForm').addEventListener('submit',e=>{
    e.preventDefault();
    const g=id=>document.getElementById(id).value;
    const type=evtTypeInput.value;
    const subject=`The 44 — ${type} Inquiry from ${g('fName')}`;
    const body=`Event type: ${type}\nName: ${g('fName')}\nEmail: ${g('fEmail')}\nPhone: ${g('fPhone')}\nPreferred date: ${g('fDate')||"Flexible"}\nHeadcount: ${g('fGuests')||"TBD"}\n\nDetails:\n${g('fMsg')}\n\n— Sent from the44.live`;
    window.location.href=`mailto:${activeEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    document.getElementById('bookForm').style.display='none';
    document.getElementById('successEmail').textContent=activeEmail;
    document.getElementById('modalSuccess').classList.add('show');
  });
})();

/* ---------- render event-type cards (book page) ---------- */
(function(){
  const host=document.getElementById('events-types'); if(!host) return;
  host.innerHTML=EVENT_TYPES.map(ev=>`
    <article class="evt reveal" data-key="${ev.key}">
      <div class="icon"><svg viewBox="0 0 24 24">${ev.icon}</svg></div>
      <h3>${ev.title}</h3>
      <p>${ev.desc}</p>
      <div class="route"><svg viewBox="0 0 24 24" width="14" height="14">${IC.mail.match(/<path[^>]*>/)[0]}</svg>Routes to <b>${CONFIG.emails[ev.key]}</b></div>
      <div class="req">Request This ${IC.arrow}</div>
    </article>`).join('');
  host.querySelectorAll('.evt').forEach(c=>c.addEventListener('click',()=>window.openBooking(c.dataset.key)));
})();

/* ---------- render events (calendar + home teaser) ---------- */
function fmtDate(iso){
  const d=new Date(iso+'T12:00:00');
  return {
    dow:d.toLocaleDateString('en-US',{weekday:'short'}).toUpperCase(),
    dnum:d.getDate(),
    mon:d.toLocaleDateString('en-US',{month:'short'}).toUpperCase(),
    monthKey:d.toLocaleDateString('en-US',{month:'long',year:'numeric'})
  };
}
function splitTitle(t){
  const i=t.search(/\sw\//i);
  if(i>-1) return {head:t.slice(0,i), sup:t.slice(i+1)};
  return {head:t, sup:""};
}
function eventRow(ev){
  const f=fmtDate(ev.date); const s=splitTitle(ev.title);
  const tag=ev.tag?`<span class="etag">${ev.tag}</span>`:'';
  return `<div class="erow reveal">
    <div class="edate"><div class="dow">${f.dow}</div><div class="dnum">${f.dnum}</div><div class="mon">${f.mon}</div></div>
    <div class="einfo"><div class="ehead">${s.head}${tag}</div>${s.sup?`<div class="esupport">${s.sup}</div>`:''}
      <div class="etime">${IC.clock} Doors ${ev.time}</div></div>
    <div class="eticket"><a href="${ev.url || CONFIG.posh}" target="_blank" rel="noopener" class="btn btn-led btn-sm" data-vibe="you will always feel good if your intentions are good"><img class="led-logo" src="assets/logo.png" alt="" width="18" height="18">Get Tickets</a></div>
  </div>`;
}
// full calendar (events page)
(function(){
  const host=document.getElementById('events-list'); if(!host) return;
  const today=new Date(); today.setHours(0,0,0,0);
  const upcoming=EVENTS.filter(e=>new Date(e.date+'T23:59:59')>=today);
  let html=''; let curMonth='';
  upcoming.forEach(ev=>{
    const mk=fmtDate(ev.date).monthKey;
    if(mk!==curMonth){curMonth=mk; html+=`<div class="month-label reveal">${mk}</div>`;}
    html+=eventRow(ev);
  });
  host.innerHTML=html||'<p class="sec-sub">New shows dropping soon. Check back.</p>';
})();
// home teaser (next few)
(function(){
  const host=document.getElementById('events-teaser'); if(!host) return;
  const today=new Date(); today.setHours(0,0,0,0);
  const next=EVENTS.filter(e=>new Date(e.date+'T23:59:59')>=today).slice(0,4);
  host.innerHTML=next.map(eventRow).join('');
})();

/* ---------- FOOD card-deck portal (spread on scroll) ---------- */
(function(){
  const stage=document.getElementById('deck-stage'); if(!stage) return;
  const pin=document.getElementById('deck-pin');
  const bar=document.getElementById('deckBar');
  const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;

  // build cards
  const platedInner=(f)=>`<div class="rimlight"></div>${PLATES[f.cat]||`<div class="emoji">${f.e}</div>`}<span class="steam"></span><span class="steam"></span><span class="steam"></span>`;
  const cardHTML=FOOD.map((f,i)=>`
    <article class="dcard" data-i="${i}">
      <div class="plate${f.img?' has-photo':' plated'}" data-cat="${f.cat||''}">${f.img?`<img src="${f.img}" alt="${f.n}">`:platedInner(f)}</div>
      <div class="meta">
        <div class="row"><h3>${f.n}</h3><span class="price">${f.price}</span></div>
        <p>${f.d}</p>
        ${f.tag?`<div class="tagline">${f.tag}</div>`:''}
      </div>
    </article>`).join('');

  if(reduce){
    pin.insertAdjacentHTML('beforeend',`<div class="deck-grid">${cardHTML}</div>`);
    return;
  }
  pin.insertAdjacentHTML('beforeend',cardHTML);
  const cards=[...pin.querySelectorAll('.dcard')];
  const N=cards.length;
  // taller stage so each card gets its own scroll window
  stage.style.height=(N*34+130)+'vh';

  // base centering for absolute cards
  cards.forEach(c=>{c.style.left='50%';c.style.top='50%';c.style.transition='none';c.style.willChange='transform,opacity';});

  // spread slots: fill the row edge-to-edge (5 cols on wide screens, fewer on small)
  let slots=[], endScale=0.76;
  function computeSlots(){
    const cwid=cards[0].offsetWidth||300, chei=cards[0].offsetHeight||440;
    const COLS = innerWidth>=1180 ? 5 : innerWidth>=760 ? 3 : 2;
    const rows = Math.ceil(N/COLS);
    const margin = innerWidth>=760 ? 30 : 14;
    const GAP = innerWidth>=760 ? 16 : 10;
    const availW = innerWidth - margin*2;
    // scale each card so a full row of COLS + gaps spans the whole width
    let es = (availW - GAP*(COLS-1)) / (cwid*COLS);
    es = Math.min(es, innerWidth>=760 ? 0.98 : 0.62);
    endScale = es;
    const colStep = cwid*es + GAP;               // center-to-center horizontally
    const rowStep = chei*es + GAP;               // center-to-center vertically
    const yBase = innerHeight*0.02;
    slots=cards.map((c,i)=>{
      const row=Math.floor(i/COLS), col=i%COLS;
      const inRow=Math.min(COLS, N-row*COLS);    // center a partial last row too
      return {x:(col-(inRow-1)/2)*colStep, y:(row-(rows-1)/2)*rowStep + yBase};
    });
  }
  computeSlots();
  const easeOut=t=>1-Math.pow(1-t,3);

  function onScroll(){
    const r=stage.getBoundingClientRect();
    const total=stage.offsetHeight-innerHeight;
    let p=(-r.top)/total; p=Math.max(0,Math.min(1,p));
    if(bar) bar.style.width=(p*100)+'%';
    // deal each card out of a center stack to its own slot, one after another
    const stagger=0.36/N, win=0.32;
    cards.forEach((c,i)=>{
      let dp=(p - i*stagger)/win; dp=Math.max(0,Math.min(1,dp)); dp=easeOut(dp);
      const slot=slots[i];
      // start: neat stacked deck at center (slight rotation), large
      // end: spread to its slot, smaller, so all six fit on screen
      const sx=0, sy=i*4, srot=(i-(N-1)/2)*3;
      const x=sx+(slot.x-sx)*dp;
      const y=sy+(slot.y-sy)*dp;
      const rot=srot*(1-dp);
      const sc=(endScale-0.06)+0.06*dp;
      c.style.visibility='visible';
      c.style.transform=`translate(-50%,-50%) translate(${x}px,${y}px) rotate(${rot}deg) scale(${sc})`;
      c.style.opacity=String(0.5+0.5*Math.min(1,dp*3+0.3));
      c.style.zIndex=String(100+Math.round(dp*20)+i);
    });
  }
  addEventListener('resize',()=>{computeSlots();onScroll();},{passive:true});
  addEventListener('scroll',onScroll,{passive:true});
  onScroll();
})();

/* ---------- menu item photo hover ---------- */
(function(){
  const list=[...document.querySelectorAll('.menu-list li')];
  if(!list.length || !window.MENU_PHOTOS) return;
  const PH=window.MENU_PHOTOS, keys=Object.keys(PH);
  const norm=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'');
  function findPhoto(name){
    const n=norm(name); if(!n) return null;
    if(PH[n]) return PH[n];
    for(const k of keys){ if(k.length>=4 && (k.indexOf(n)===0 || n.indexOf(k)===0)) return PH[k]; }
    for(const k of keys){ if(k.length>=5 && (k.includes(n) || n.includes(k))) return PH[k]; }
    return null;
  }
  const prev=document.createElement('div'); prev.className='menu-preview'; prev.setAttribute('aria-hidden','true');
  prev.innerHTML='<img alt="">'; document.body.appendChild(prev);
  const pimg=prev.querySelector('img'); let touchOpen=false;
  list.forEach(li=>{
    const nameEl=li.querySelector('.mi-name'); if(!nameEl) return;
    const name=(nameEl.childNodes[0]&&nameEl.childNodes[0].textContent)||nameEl.textContent;
    const photo=findPhoto(name); if(!photo) return;
    li.classList.add('has-photo');
    li.addEventListener('mouseenter',()=>{ if(pimg.getAttribute('src')!==photo) pimg.src=photo; prev.classList.add('show'); });
    li.addEventListener('mousemove',(e)=>{
      const x=Math.min(e.clientX+22, innerWidth-258), y=Math.min(Math.max(e.clientY-90,12), innerHeight-214);
      prev.style.transform='translate('+x+'px,'+y+'px)';
    });
    li.addEventListener('mouseleave',()=>{ prev.classList.remove('show'); });
    li.addEventListener('click',()=>{ pimg.src=photo; touchOpen=!touchOpen; prev.classList.toggle('show',touchOpen); prev.style.transform='translate('+Math.round(innerWidth/2-118)+'px,'+Math.round(innerHeight/2-110)+'px)'; });
  });
})();

/* ---------- scroll reveal ---------- */
const io=new IntersectionObserver((entries)=>{
  entries.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});
},{threshold:.12,rootMargin:"0px 0px -8% 0px"});
function observeReveals(){document.querySelectorAll('.reveal:not(.in)').forEach(el=>io.observe(el));}
observeReveals();

/* ---------- console easter eggs (phrase A) ---------- */
console.log('%cTHE 44','font:700 22px Oswald;color:#E21B2C');
console.log('%cyou will always feel good if your intentions are good','color:#A52A2A');

/* ============================================================
   SHARED BEAT CLOCK + GLOBAL EXPORT (fx modules read from window.THE44)
   ============================================================ */
const BEAT_MS = 600;
function beatEnv(tMs){ const phase=(tMs % BEAT_MS)/BEAT_MS; return Math.pow(1-phase, 2.2); }
window.THE44 = { CONFIG, EVENTS, FOOD, IC, mapUrl, mapApple, mapGoogle, fmtDate, splitTitle, beatEnv, BEAT_MS };

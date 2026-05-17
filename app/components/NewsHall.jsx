'use client';
import { useState, useRef, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";

const CITIES=[
 {n:"New York",s:"NY",c:"US",lat:40.7128,lon:-74.006},{n:"Los Angeles",s:"CA",c:"US",lat:34.0522,lon:-118.2437},
 {n:"Chicago",s:"IL",c:"US",lat:41.8781,lon:-87.6298},{n:"Houston",s:"TX",c:"US",lat:29.7604,lon:-95.3698},
 {n:"Phoenix",s:"AZ",c:"US",lat:33.4484,lon:-112.074},{n:"Philadelphia",s:"PA",c:"US",lat:39.9526,lon:-75.1652},
 {n:"San Antonio",s:"TX",c:"US",lat:29.4241,lon:-98.4936},{n:"San Diego",s:"CA",c:"US",lat:32.7157,lon:-117.1611},
 {n:"Dallas",s:"TX",c:"US",lat:32.7767,lon:-96.797},{n:"Austin",s:"TX",c:"US",lat:30.2672,lon:-97.7431},
 {n:"San Francisco",s:"CA",c:"US",lat:37.7749,lon:-122.4194},{n:"Seattle",s:"WA",c:"US",lat:47.6062,lon:-122.3321},
 {n:"Denver",s:"CO",c:"US",lat:39.7392,lon:-104.9903},{n:"Nashville",s:"TN",c:"US",lat:36.1627,lon:-86.7816},
 {n:"Boston",s:"MA",c:"US",lat:42.3601,lon:-71.0589},{n:"Portland",s:"OR",c:"US",lat:45.5231,lon:-122.6765},
 {n:"Las Vegas",s:"NV",c:"US",lat:36.1699,lon:-115.1398},{n:"Atlanta",s:"GA",c:"US",lat:33.749,lon:-84.388},
 {n:"Miami",s:"FL",c:"US",lat:25.7617,lon:-80.1918},{n:"Minneapolis",s:"MN",c:"US",lat:44.9778,lon:-93.265},
 {n:"Tampa",s:"FL",c:"US",lat:27.9506,lon:-82.4572},{n:"New Orleans",s:"LA",c:"US",lat:29.9511,lon:-90.0715},
 {n:"Kansas City",s:"MO",c:"US",lat:39.0997,lon:-94.5786},{n:"Columbus",s:"OH",c:"US",lat:39.9612,lon:-82.9988},
 {n:"Charlotte",s:"NC",c:"US",lat:35.2271,lon:-80.8431},{n:"Indianapolis",s:"IN",c:"US",lat:39.7684,lon:-86.1581},
 {n:"Salt Lake City",s:"UT",c:"US",lat:40.7608,lon:-111.891},{n:"Pittsburgh",s:"PA",c:"US",lat:40.4406,lon:-79.9959},
 {n:"Sacramento",s:"CA",c:"US",lat:38.5816,lon:-121.4944},{n:"Orlando",s:"FL",c:"US",lat:28.5383,lon:-81.3792},
 {n:"Green Bay",s:"WI",c:"US",lat:44.5133,lon:-88.0133},{n:"Milwaukee",s:"WI",c:"US",lat:43.0389,lon:-87.9065},
 {n:"Baltimore",s:"MD",c:"US",lat:39.2904,lon:-76.6122},{n:"Memphis",s:"TN",c:"US",lat:35.1495,lon:-90.049},
 {n:"Louisville",s:"KY",c:"US",lat:38.2527,lon:-85.7585},{n:"Buffalo",s:"NY",c:"US",lat:42.8864,lon:-78.8784},
 {n:"Honolulu",s:"HI",c:"US",lat:21.3069,lon:-157.8583},{n:"Anchorage",s:"AK",c:"US",lat:61.2181,lon:-149.9003},
 {n:"Raleigh",s:"NC",c:"US",lat:35.7796,lon:-78.6382},{n:"St. Louis",s:"MO",c:"US",lat:38.627,lon:-90.1994},
 {n:"Cincinnati",s:"OH",c:"US",lat:39.1031,lon:-84.512},{n:"Oklahoma City",s:"OK",c:"US",lat:35.4676,lon:-97.5164},
 {n:"London",s:"England",c:"UK",lat:51.5074,lon:-0.1278},{n:"Manchester",s:"England",c:"UK",lat:53.4808,lon:-2.2426},
 {n:"Glasgow",s:"Scotland",c:"UK",lat:55.8642,lon:-4.2518},{n:"Edinburgh",s:"Scotland",c:"UK",lat:55.9533,lon:-3.1883},
 {n:"Toronto",s:"Ontario",c:"Canada",lat:43.6532,lon:-79.3832},{n:"Vancouver",s:"BC",c:"Canada",lat:49.2827,lon:-123.1207},
 {n:"Montreal",s:"Quebec",c:"Canada",lat:45.5017,lon:-73.5673},{n:"Calgary",s:"Alberta",c:"Canada",lat:51.0447,lon:-114.0719},
 {n:"Paris",s:"France",c:"France",lat:48.8566,lon:2.3522},{n:"Berlin",s:"Germany",c:"Germany",lat:52.52,lon:13.405},
 {n:"Munich",s:"Bavaria",c:"Germany",lat:48.1351,lon:11.582},{n:"Madrid",s:"Spain",c:"Spain",lat:40.4168,lon:-3.7038},
 {n:"Barcelona",s:"Catalonia",c:"Spain",lat:41.3851,lon:2.1734},{n:"Rome",s:"Lazio",c:"Italy",lat:41.9028,lon:12.4964},
 {n:"Milan",s:"Lombardy",c:"Italy",lat:45.4654,lon:9.1859},{n:"Amsterdam",s:"Netherlands",c:"Netherlands",lat:52.3676,lon:4.9041},
 {n:"Zurich",s:"Switzerland",c:"Switzerland",lat:47.3769,lon:8.5417},{n:"Vienna",s:"Austria",c:"Austria",lat:48.2082,lon:16.3738},
 {n:"Stockholm",s:"Sweden",c:"Sweden",lat:59.3293,lon:18.0686},{n:"Oslo",s:"Norway",c:"Norway",lat:59.9139,lon:10.7522},
 {n:"Copenhagen",s:"Denmark",c:"Denmark",lat:55.6761,lon:12.5683},{n:"Warsaw",s:"Poland",c:"Poland",lat:52.2297,lon:21.0122},
 {n:"Prague",s:"Czech Rep.",c:"Czech Rep.",lat:50.0755,lon:14.4378},{n:"Athens",s:"Greece",c:"Greece",lat:37.9838,lon:23.7275},
 {n:"Lisbon",s:"Portugal",c:"Portugal",lat:38.7223,lon:-9.1393},{n:"Dublin",s:"Ireland",c:"Ireland",lat:53.3498,lon:-6.2603},
 {n:"Tokyo",s:"Japan",c:"Japan",lat:35.6762,lon:139.6503},{n:"Osaka",s:"Japan",c:"Japan",lat:34.6937,lon:135.5023},
 {n:"Seoul",s:"S.Korea",c:"S.Korea",lat:37.5665,lon:126.978},{n:"Beijing",s:"China",c:"China",lat:39.9042,lon:116.4074},
 {n:"Shanghai",s:"China",c:"China",lat:31.2304,lon:121.4737},{n:"Hong Kong",s:"",c:"HK",lat:22.3193,lon:114.1694},
 {n:"Singapore",s:"",c:"Singapore",lat:1.3521,lon:103.8198},{n:"Sydney",s:"NSW",c:"Australia",lat:-33.8688,lon:151.2093},
 {n:"Melbourne",s:"Victoria",c:"Australia",lat:-37.8136,lon:144.9631},{n:"Mumbai",s:"India",c:"India",lat:19.076,lon:72.8777},
 {n:"Delhi",s:"India",c:"India",lat:28.7041,lon:77.1025},{n:"Dubai",s:"UAE",c:"UAE",lat:25.2048,lon:55.2708},
 {n:"Cairo",s:"Egypt",c:"Egypt",lat:30.0444,lon:31.2357},{n:"Lagos",s:"Nigeria",c:"Nigeria",lat:6.5244,lon:3.3792},
 {n:"Nairobi",s:"Kenya",c:"Kenya",lat:-1.2921,lon:36.8219},{n:"Cape Town",s:"S.Africa",c:"S.Africa",lat:-33.9249,lon:18.4241},
 {n:"Sao Paulo",s:"Brazil",c:"Brazil",lat:-23.5505,lon:-46.6333},{n:"Buenos Aires",s:"Argentina",c:"Argentina",lat:-34.6037,lon:-58.3816},
 {n:"Mexico City",s:"Mexico",c:"Mexico",lat:19.4326,lon:-99.1332},
];

const SUGGESTIONS=[
 // News & World
 {name:"World News"},{name:"US Politics"},{name:"Science"},{name:"Climate"},
 // Business & Finance
 {name:"Stock Market"},{name:"Business"},{name:"Crypto"},{name:"Real Estate"},{name:"Startups"},{name:"Deals & M&A"},
 // Health & Wellness
 {name:"Health & Wellness"},{name:"Mental Health"},{name:"Nutrition"},{name:"Fitness"},
 // Lifestyle
 {name:"Fashion & Style"},{name:"Beauty"},{name:"Food & Dining"},{name:"Travel"},{name:"Home & Design"},{name:"Relationships"},
 // Culture & Entertainment
 {name:"Entertainment"},{name:"Celebrity News"},{name:"Books"},{name:"Film & TV"},{name:"Music"},
 // Tech
 {name:"Tech & AI"},{name:"Gaming"},{name:"Auto & EVs"},
 // Sports
 {name:"NFL"},{name:"NBA"},{name:"Soccer"},{name:"MLB"},{name:"NHL"},{name:"Golf"},{name:"Tennis"},{name:"WNBA"},{name:"Formula 1"},{name:"MMA / UFC"},
 // Society
 {name:"Women in Business"},{name:"Parenting"},{name:"Education"},{name:"Personal Finance"},
];

// Team colors and abbreviations for logo badges
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800&family=Inter:wght@300;400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
html,body{height:100%;}
:root{--ink:#0a0f1e;--ink-2:#374151;--ink-3:#6b7280;--ink-4:#9ca3af;--rule:#e5e7eb;--rule-2:#f3f4f6;--accent:#c8102e;--accent-2:#1a3a6b;--bg:#ffffff;--bg-2:#f9fafb;}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--ink);}

.page{display:none;}.page.active{display:block;}

/* ── TOPBAR ── */
.topbar{position:sticky;top:0;z-index:40;background:rgba(255,255,255,0.97);backdrop-filter:blur(20px);border-bottom:1px solid var(--rule);padding:0 48px;height:56px;display:flex;align-items:center;justify-content:space-between;}
.tb-wordmark{display:flex;align-items:center;gap:0;}
.tb-title{font-family:'Playfair Display',serif;font-size:1.45rem;font-weight:900;color:var(--ink);letter-spacing:-0.03em;line-height:1;}
.tb-edition{font-size:0.58rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-4);margin-left:10px;padding-left:10px;border-left:1px solid var(--rule);align-self:center;display:none;}
@media(min-width:600px){.tb-edition{display:block;}}
.tb-auth{display:flex;align-items:center;gap:8px;}
.auth-user{font-size:0.78rem;font-weight:500;color:var(--ink-3);}
.auth-btn{font-family:'Inter',sans-serif;font-size:0.78rem;font-weight:600;padding:7px 18px;border-radius:7px;cursor:pointer;transition:all 0.15s;border:none;letter-spacing:0.01em;}
.auth-btn-signin{background:transparent;color:var(--ink-2);border:1.5px solid var(--rule);}
.auth-btn-signin:hover{border-color:var(--ink);color:var(--ink);}
.auth-btn-getstarted{background:var(--ink);color:#fff;}
.auth-btn-getstarted:hover{background:var(--accent);}
.auth-btn-out{background:transparent;color:var(--ink-3);border:1.5px solid var(--rule);font-size:0.72rem;}
.auth-btn-out:hover{color:var(--ink);border-color:var(--ink-3);}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0.25}}

/* ── HERO ── */
.hero{background:var(--ink);padding:0;display:grid;grid-template-columns:1fr;position:relative;overflow:hidden;min-height:600px;}
.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 70% 100% at 0% 60%,rgba(26,58,107,0.65) 0%,transparent 60%),radial-gradient(ellipse 50% 60% at 100% 10%,rgba(200,16,46,0.08) 0%,transparent 55%);pointer-events:none;z-index:0;}
.hero-l{position:relative;z-index:2;padding:88px 56px 80px 52px;display:flex;flex-direction:column;justify-content:center;max-width:720px;}
.hero-date{font-size:0.7rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.38);margin-bottom:20px;}
.hero-eyebrow{display:none;}
.hero-h1{font-family:'Playfair Display',serif;font-size:clamp(3.2rem,5.8vw,6rem);font-weight:900;line-height:0.97;letter-spacing:-0.04em;color:#fff;margin-bottom:28px;}
.hero-h1 em{color:var(--accent);font-style:italic;}
.hero-h1 span{display:block;}
.hero-deck{font-size:1.05rem;line-height:1.72;color:rgba(255,255,255,0.45);max-width:440px;margin-bottom:32px;font-weight:300;}
.hero-badges{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:36px;}
.hero-badge{display:inline-flex;align-items:center;gap:7px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.13);border-radius:100px;padding:7px 16px;font-size:0.72rem;font-weight:600;color:rgba(255,255,255,0.72);letter-spacing:0.01em;}
.hero-badge-dot{width:5px;height:5px;border-radius:50%;background:var(--accent);flex-shrink:0;}
.hero-btns{display:flex;gap:12px;flex-wrap:wrap;}
.btn-p{background:var(--accent);color:#fff;font-weight:700;font-size:0.9rem;padding:14px 30px;border:none;border-radius:8px;cursor:pointer;transition:all 0.2s;letter-spacing:0.01em;}
.btn-p:hover{background:#e01535;transform:translateY(-1px);}
.btn-g{background:transparent;color:rgba(255,255,255,0.65);font-weight:500;font-size:0.9rem;padding:14px 28px;border:1px solid rgba(255,255,255,0.18);border-radius:8px;cursor:pointer;transition:all 0.2s;}
.btn-g:hover{background:rgba(255,255,255,0.07);color:#fff;}
.hero-r{position:relative;z-index:2;padding:40px 44px 40px 0;display:flex;align-items:center;}
.prev-card{width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:18px;overflow:hidden;backdrop-filter:blur(8px);}
.prev-hd{padding:18px 24px 14px;border-bottom:1px solid rgba(255,255,255,0.07);display:flex;align-items:center;justify-content:space-between;}
.prev-title{font-size:0.66rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.35);}
.prev-time{font-size:0.62rem;font-weight:500;color:rgba(255,255,255,0.2);}
.prev-item{display:flex;gap:12px;align-items:flex-start;padding:14px 24px;border-bottom:1px solid rgba(255,255,255,0.05);}
.prev-item:last-child{border-bottom:none;}
.prev-tag{font-size:0.58rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;background:var(--accent);color:#fff;padding:3px 9px;border-radius:5px;white-space:nowrap;margin-top:2px;flex-shrink:0;}
.prev-txt{font-size:0.84rem;color:rgba(255,255,255,0.5);line-height:1.55;font-weight:400;}
.prev-txt strong{color:rgba(255,255,255,0.85);font-weight:600;}
.hero-stats{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid rgba(255,255,255,0.06);position:relative;z-index:2;}
.hstat{padding:22px 52px;border-right:1px solid rgba(255,255,255,0.05);}
.hstat:last-child{border-right:none;}
.hstat-n{font-family:'Playfair Display',serif;font-size:2.6rem;font-weight:900;color:#fff;letter-spacing:-0.04em;line-height:1;}
.hstat-l{font-size:0.72rem;color:rgba(255,255,255,0.35);margin-top:6px;font-weight:400;letter-spacing:0.02em;}

/* ── LOGGED IN DASHBOARD ── */
.dashboard{max-width:1100px;margin:0 auto;padding:40px 48px 80px;}
.dashboard-hd{display:flex;align-items:flex-start;justify-content:space-between;padding-bottom:20px;border-bottom:3px solid var(--ink);margin-bottom:32px;gap:20px;}
.dashboard-hd-l{}
.dashboard-edition{font-size:0.6rem;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:var(--accent);margin-bottom:8px;display:flex;align-items:center;gap:8px;}
.dashboard-edition::before{content:'';width:20px;height:2px;background:var(--accent);display:block;}
.dashboard-title{font-family:'Playfair Display',serif;font-size:clamp(1.8rem,3vw,2.8rem);font-weight:900;color:var(--ink);letter-spacing:-0.03em;line-height:1;margin-bottom:6px;}
.dashboard-sub{font-size:0.78rem;color:var(--ink-3);font-weight:400;}
.dashboard-hd-r{display:flex;flex-direction:column;align-items:flex-end;gap:8px;flex-shrink:0;}
.dashboard-date{font-size:0.6rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-4);}
.dashboard-actions{display:flex;gap:8px;}
.dash-btn-regen{background:var(--ink);color:#fff;border:none;border-radius:7px;padding:9px 18px;font-size:0.78rem;font-weight:600;cursor:pointer;transition:all 0.15s;}
.dash-btn-regen:hover{background:var(--accent);}
.dash-btn-regen:disabled{opacity:0.5;cursor:not-allowed;}
.dash-btn-edit{background:transparent;color:var(--ink-2);border:1.5px solid var(--rule);border-radius:7px;padding:9px 18px;font-size:0.78rem;font-weight:500;cursor:pointer;transition:all 0.15s;}
.dash-btn-edit:hover{border-color:var(--ink);color:var(--ink);}
.editor-panel{background:var(--bg-2);border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);padding:32px 48px;margin-bottom:0;animation:fu 0.25s ease;}
/* ── NO BRIEF YET ── */
.no-brief{max-width:1100px;margin:0 auto;padding:60px 48px;}
.no-brief-inner{background:var(--ink);border-radius:20px;padding:64px;text-align:center;position:relative;overflow:hidden;}
.no-brief-inner::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 80% at 50% 50%,rgba(26,58,107,0.5) 0%,transparent 70%);pointer-events:none;}
.no-brief-eyebrow{font-size:0.62rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--accent);margin-bottom:16px;position:relative;z-index:1;}
.no-brief-title{font-family:'Playfair Display',serif;font-size:clamp(2rem,4vw,3.2rem);font-weight:900;color:#fff;letter-spacing:-0.03em;line-height:1.1;margin-bottom:14px;position:relative;z-index:1;}
.no-brief-title em{color:var(--accent);font-style:italic;}
.no-brief-sub{font-size:0.92rem;color:rgba(255,255,255,0.42);margin-bottom:36px;position:relative;z-index:1;max-width:400px;margin-left:auto;margin-right:auto;}
.no-brief-btn{background:var(--accent);color:#fff;border:none;border-radius:9px;padding:15px 36px;font-size:0.92rem;font-weight:700;cursor:pointer;transition:all 0.2s;position:relative;z-index:1;}
.no-brief-btn:hover{background:#e01535;transform:translateY(-1px);}
.no-brief-topics{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;margin-top:24px;position:relative;z-index:1;}
.no-brief-topic-tag{font-size:0.62rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.45);padding:4px 10px;border-radius:5px;}
/* ── TICKER TAPE ── */
.ticker-tape{background:var(--accent);padding:9px 0;overflow:hidden;position:relative;}
.ticker-inner{display:flex;align-items:center;gap:0;animation:ticker 45s linear infinite;white-space:nowrap;}
.ticker-inner:hover{animation-play-state:paused;}
.ticker-item{font-size:0.62rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.92);padding:0 20px;}
.ticker-dot{color:rgba(255,255,255,0.35);padding:0 4px;font-size:0.5rem;}
@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}

/* ── PILLARS (replaces old trust) ── */
.trust{display:none;}
.pillars{background:#fff;border-bottom:3px solid var(--ink);display:grid;grid-template-columns:repeat(4,1fr);}
.pillar{padding:32px 36px;border-right:1px solid var(--rule);}
.pillar:last-child{border-right:none;}
.pillar-label{font-size:0.6rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--accent);margin-bottom:6px;}
.pillar-title{font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:800;color:var(--ink);letter-spacing:-0.02em;margin-bottom:8px;}
.pillar-text{font-size:0.78rem;color:var(--ink-3);line-height:1.65;}

/* ── FEATURES ── */
.features{background:var(--ink);border-bottom:none;display:grid;grid-template-columns:repeat(3,1fr);}
.fb{padding:40px;border-right:1px solid rgba(255,255,255,0.07);display:flex;flex-direction:column;gap:0;align-items:flex-start;position:relative;overflow:hidden;}
.fb:last-child{border-right:none;}
.fb::before{content:attr(data-n);position:absolute;top:-12px;right:20px;font-family:'Playfair Display',serif;font-size:6rem;font-weight:900;color:rgba(255,255,255,0.03);line-height:1;pointer-events:none;}
.fi{display:none;}
.fi-b,.fi-c,.fi-g{display:none;}
.fb-num{font-size:0.56rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--accent);margin-bottom:16px;display:flex;align-items:center;gap:10px;}
.fb-num::after{content:'';flex:1;max-width:28px;height:1px;background:var(--accent);}
.fb h4{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:800;margin-bottom:12px;color:#fff;letter-spacing:-0.02em;line-height:1.2;}
.fb p{font-size:0.82rem;color:rgba(255,255,255,0.42);line-height:1.7;font-weight:300;}
.builder{max-width:1000px;margin:0 auto;padding:64px 48px;background:var(--bg);border-top:1px solid var(--rule);}
.step-hd{margin-bottom:32px;}
.step-tag{display:inline-flex;align-items:center;gap:6px;background:var(--accent);color:#fff;font-size:0.58rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;padding:4px 12px;border-radius:100px;margin-bottom:10px;}
.step-n{color:#fff;font-weight:700;}
.step-h2{font-family:'Playfair Display',serif;font-size:clamp(1.5rem,2.5vw,2.2rem);font-weight:800;letter-spacing:-0.03em;color:var(--ink);margin-bottom:6px;}
.step-sub{font-size:0.86rem;color:var(--ink-3);line-height:1.62;max-width:480px;}
.search-wrap{position:relative;margin-bottom:16px;}
.search-wrap input{width:100%;background:#fff;border:2px solid var(--rule);border-radius:10px;padding:14px 130px 14px 46px;font-size:0.92rem;color:var(--ink);outline:none;transition:all 0.15s;}
.search-wrap input:focus{border-color:var(--ink);}
.search-wrap input::placeholder{color:#b0b8c4;}
.search-ico{position:absolute;left:16px;top:50%;transform:translateY(-50%);font-size:1rem;pointer-events:none;}
.add-btn{position:absolute;right:8px;top:50%;transform:translateY(-50%);background:var(--ink);color:#fff;border:none;border-radius:7px;padding:8px 18px;font-weight:700;font-size:0.76rem;cursor:pointer;}
.sugg-lbl{font-size:0.62rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink-3);margin-bottom:12px;}
.sugg-wrap{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:22px;}
.sugg{display:inline-flex;align-items:center;gap:4px;background:#fff;border:1.5px solid var(--rule);border-radius:100px;padding:6px 14px;font-size:0.76rem;font-weight:500;cursor:pointer;transition:all 0.18s cubic-bezier(0.22,1,0.36,1);color:var(--ink-2);}
.sugg:hover{border-color:var(--accent-2);color:var(--accent-2);background:var(--bg-2);transform:translateY(-1px);}
.sugg.on{background:var(--ink);border-color:var(--ink);color:#fff;transform:scale(1.02);}
.sugg:active{transform:scale(0.97);}
.chips{min-height:48px;background:var(--bg-2);border:1.5px solid var(--rule);border-radius:12px;padding:10px 14px;display:flex;flex-wrap:wrap;align-items:center;gap:7px;}
.topic-counter{font-size:0.58rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-left:auto;padding:3px 10px;border-radius:100px;flex-shrink:0;}
.topic-counter.ok{color:var(--ink-3);background:var(--bg-2);}
.topic-counter.warn{color:#d97706;background:#fffbeb;}
.topic-counter.full{color:var(--accent);background:#fff2f2;font-weight:700;}
.chips-lbl{font-size:0.58rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink-4);flex-shrink:0;}
.chip{display:inline-flex;align-items:center;gap:5px;background:var(--ink);border:1px solid var(--ink);border-radius:7px;padding:4px 10px;font-size:0.74rem;font-weight:600;color:#fff;}
.chip-x{cursor:pointer;color:rgba(255,255,255,0.38);font-size:0.78rem;transition:color 0.1s;}
.chip-x:hover{color:#ff6b6b;}
.sgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
.sblock{background:#fff;border:1.5px solid var(--rule);border-radius:10px;padding:14px 16px;}
.fmt-pill{background:#fff;border:1.5px solid var(--rule);border-radius:10px;padding:14px 22px;cursor:pointer;transition:all 0.15s;min-width:120px;}
.fmt-pill:hover{border-color:var(--ink);}
.fmt-pill.on{background:var(--ink);border-color:var(--ink);}
.fmt-pill-label{font-size:0.88rem;font-weight:700;color:var(--ink);margin-bottom:3px;}
.fmt-pill.on .fmt-pill-label{color:#fff;}
.fmt-pill-sub{font-size:0.62rem;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink-3);}
.fmt-pill.on .fmt-pill-sub{color:rgba(255,255,255,0.45);}
.slbl{font-size:0.58rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink-3);margin-bottom:6px;}
.sinput{width:100%;background:transparent;border:none;outline:none;font-size:0.88rem;font-weight:500;color:var(--ink);appearance:none;cursor:pointer;}
.sinput option{background:#fff;}
.gen-wrap{max-width:1000px;margin:0 auto;padding:0 48px 80px;background:#fff;}
.gen-panel{background:var(--ink);border-radius:18px;padding:32px 40px;display:grid;grid-template-columns:1fr auto;align-items:center;gap:24px;position:relative;overflow:hidden;}
.gen-panel::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 55% 100% at 100% 50%,rgba(59,111,212,0.22) 0%,transparent 70%);pointer-events:none;}
.gen-title{font-family:'Playfair Display',serif;font-size:1.7rem;font-weight:800;color:#fff;letter-spacing:-0.03em;margin-bottom:4px;}
.gen-sub{font-size:0.8rem;color:rgba(255,255,255,0.38);}
.gen-btns{display:flex;gap:8px;position:relative;z-index:1;flex-shrink:0;}
.btn-gen{background:var(--accent);color:#fff;font-weight:700;font-size:0.88rem;padding:14px 28px;border:none;border-radius:8px;cursor:pointer;transition:all 0.2s;white-space:nowrap;}
.btn-gen:hover{background:#e01535;transform:translateY(-2px);box-shadow:0 8px 24px rgba(200,16,46,0.35);}
.btn-gen:active{transform:translateY(0);box-shadow:none;}
.btn-gen:disabled{opacity:0.5;cursor:not-allowed;transform:none;}
.btn-gen.ready{animation:btnReady 2.4s ease-in-out infinite;}
@keyframes btnReady{0%,100%{box-shadow:0 0 0 0 rgba(200,16,46,0)}50%{box-shadow:0 0 0 8px rgba(200,16,46,0.15)}}
.btn-sched{background:transparent;color:rgba(255,255,255,0.7);font-weight:500;font-size:0.88rem;padding:14px 24px;border:1px solid rgba(255,255,255,0.2);border-radius:8px;cursor:pointer;white-space:nowrap;}
.loading{max-width:1000px;margin:0 auto;padding:80px 36px;display:flex;flex-direction:column;align-items:center;text-align:center;}
.spin{width:36px;height:36px;border:2px solid rgba(15,23,41,0.08);border-top-color:var(--accent);border-radius:50%;animation:spin 0.8s linear infinite;margin-bottom:18px;}
@keyframes spin{to{transform:rotate(360deg)}}
.ld-h{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:800;color:var(--ink);letter-spacing:-0.02em;margin-bottom:5px;}
.ld-s{font-size:0.8rem;color:var(--ink-3);}
.ld-steps{margin-top:16px;display:flex;flex-direction:column;gap:5px;}
.ld-step{font-size:0.66rem;font-weight:500;letter-spacing:0.06em;color:var(--ink-4);}
.brief-wrap{max-width:1000px;margin:0 auto;padding:0 48px 80px;animation:fu 0.4s ease;}
@keyframes fu{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
/* Masthead */
.bmast{padding:40px 0 28px;margin-bottom:44px;border-bottom:1px solid var(--rule);}
.bmast-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;}
.bmast-pub{font-size:0.56rem;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;color:var(--ink-4);}
.bmast-date-sm{font-size:0.56rem;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-4);}
.bkicker{font-size:0.56rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--accent);margin-bottom:6px;}
.bhl{font-family:'Playfair Display',serif;font-size:clamp(1.9rem,3.5vw,3.2rem);font-weight:900;line-height:1.0;letter-spacing:-0.04em;color:var(--ink);}
.bmeta{font-size:0.6rem;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-4);margin-top:10px;}
.bmast-btns{display:flex;gap:8px;margin-top:18px;}
.brefresh{background:var(--ink);color:#fff;font-weight:600;font-size:0.7rem;padding:9px 18px;border:none;border-radius:7px;cursor:pointer;}
.btweak{background:transparent;color:var(--ink-2);font-weight:500;font-size:0.7rem;padding:9px 16px;border:1.5px solid var(--rule);border-radius:7px;cursor:pointer;}
.btweak:hover{background:var(--bg-2);}
/* Source labels */
.src-badge{display:inline-flex;align-items:center;border-radius:5px;padding:3px 8px;flex-shrink:0;}
.src-name{font-size:0.55rem;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;white-space:nowrap;line-height:1;}
/* Topic sections */
.brief-topic-section{margin-bottom:64px;}
.brief-topic-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;padding-bottom:12px;border-bottom:1px solid var(--rule);}
.brief-topic-name{font-size:0.6rem;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;color:var(--ink);display:flex;align-items:center;gap:10px;}
.brief-topic-name::before{content:'';width:18px;height:2px;background:var(--accent);display:block;flex-shrink:0;}
.brief-topic-count{font-size:0.56rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-4);}
/* Featured story card */
.brief-featured{display:block;text-decoration:none;border:1px solid var(--rule);border-radius:14px;overflow:hidden;margin-bottom:12px;transition:box-shadow 0.2s,transform 0.2s;background:#fff;}
.brief-featured:hover{box-shadow:0 8px 32px rgba(15,23,41,0.11);transform:translateY(-2px);}
.brief-feat-img{aspect-ratio:16/7;position:relative;display:flex;align-items:flex-end;padding:16px 20px;overflow:hidden;}
.brief-feat-img-over{position:absolute;inset:0;background:linear-gradient(to bottom,transparent 20%,rgba(0,0,0,0.6) 100%);}
.brief-feat-img-meta{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;width:100%;}
.brief-feat-label{font-size:0.48rem;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.9);background:rgba(255,255,255,0.18);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,0.22);border-radius:4px;padding:3px 8px;}
.brief-feat-body{padding:20px 22px 18px;background:#fff;}
.brief-feat-hl{font-family:'Playfair Display',serif;font-size:clamp(1.2rem,2.2vw,1.6rem);font-weight:800;line-height:1.15;letter-spacing:-0.025em;color:var(--ink);margin-bottom:8px;}
.brief-feat-sum{font-size:0.82rem;color:var(--ink-3);line-height:1.62;margin-bottom:14px;}
.brief-feat-read{font-size:0.6rem;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:var(--accent-2);transition:color 0.15s;}
.brief-featured:hover .brief-feat-read{color:var(--ink);}
/* Story grid */
.brief-story-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.brief-story-card{display:flex;flex-direction:column;text-decoration:none;padding:18px 20px;border:1px solid var(--rule);border-radius:12px;background:#fff;transition:box-shadow 0.15s,transform 0.15s;}
.brief-story-card:hover{box-shadow:0 4px 20px rgba(15,23,41,0.1);transform:translateY(-1px);}
.brief-story-src{margin-bottom:10px;}
.brief-story-hl{font-family:'Playfair Display',serif;font-size:0.96rem;font-weight:700;line-height:1.3;letter-spacing:-0.02em;color:var(--ink);margin-bottom:6px;}
.brief-story-sum{font-size:0.76rem;color:var(--ink-3);line-height:1.55;margin-bottom:12px;flex:1;}
.brief-story-read{font-size:0.58rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--accent-2);margin-top:auto;}
/* Sources footer */
.srcfooter{margin-top:8px;padding:12px 16px;background:var(--bg-2);border:1px solid var(--rule);border-radius:10px;font-size:0.6rem;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink-4);line-height:2;}
.srcfooter strong{color:var(--ink-2);}
.err-box{padding:28px 0;}
.err-msg{color:#e8654a;font-size:0.88rem;font-weight:600;margin-bottom:8px;}
.err-pre{font-size:0.64rem;color:var(--ink-3);background:#fff;padding:14px;border-radius:8px;white-space:pre-wrap;word-break:break-all;border:1px solid var(--rule);max-height:160px;overflow:auto;}
.wx-page,.scores-page,.markets-page,.daily-page{max-width:1000px;margin:0 auto;padding:32px 36px;}
.wx-permission{display:flex;flex-direction:column;align-items:center;text-align:center;padding:64px 32px;}
.wx-perm-icon{font-size:4rem;margin-bottom:20px;filter:drop-shadow(0 4px 16px rgba(0,0,0,0.1));}
.wx-perm-title{font-family:'Playfair Display',serif;font-size:1.7rem;font-weight:700;color:#0f1729;letter-spacing:-0.03em;margin-bottom:10px;}
.wx-perm-sub{font-size:0.86rem;color:#6b7280;line-height:1.65;max-width:360px;margin-bottom:28px;}
.wx-perm-btn{background:#0f1729;color:#fff;border:none;border-radius:11px;padding:14px 32px;font-family:'Inter',sans-serif;font-weight:700;font-size:0.9rem;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 16px rgba(15,23,41,0.2);margin-bottom:12px;}
.wx-perm-btn:hover{background:#1e2d55;transform:translateY(-1px);}
.wx-perm-skip{background:none;border:none;color:#9ca3af;font-size:0.78rem;cursor:pointer;padding:4px;}
.wx-perm-skip:hover{color:#6b7280;}
.wx-card{background:#0f1729;border-radius:14px;overflow:hidden;margin-bottom:14px;}
.wx-card-top{padding:28px;display:grid;grid-template-columns:auto 1fr auto;gap:20px;align-items:center;}
.wx-big-ico{font-size:4.5rem;line-height:1;filter:drop-shadow(0 6px 16px rgba(0,0,0,0.28));}
.wx-city-n{font-family:'Inter',sans-serif;font-size:0.58rem;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.33);margin-bottom:5px;}
.wx-temp{font-family:'Playfair Display',serif;font-size:4rem;font-weight:700;color:#fff;line-height:1;letter-spacing:-0.04em;}
.wx-unit-sm{font-size:1.4rem;font-weight:300;color:rgba(255,255,255,0.42);margin-left:2px;}
.wx-cond{font-size:0.9rem;color:rgba(255,255,255,0.55);margin-top:5px;font-weight:500;}
.wx-stats-g{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.wx-stat-b{background:rgba(255,255,255,0.06);border-radius:9px;padding:12px;}
.wx-sv{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:600;color:#fff;line-height:1;}
.wx-sl{font-family:'Inter',sans-serif;font-size:0.5rem;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.28);margin-top:3px;}
.wx-actions{display:flex;gap:7px;justify-content:flex-end;padding:0 28px 18px;}
.wx-ub{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.11);color:rgba(255,255,255,0.55);border-radius:7px;padding:5px 12px;font-family:'Inter',sans-serif;font-size:0.58rem;letter-spacing:0.08em;cursor:pointer;}
.wx-cb{background:none;border:1px solid rgba(255,255,255,0.09);color:rgba(255,255,255,0.28);border-radius:7px;padding:5px 12px;font-family:'Inter',sans-serif;font-size:0.58rem;letter-spacing:0.08em;cursor:pointer;}
.wx-hourly{padding:14px 28px 22px;border-top:1px solid rgba(255,255,255,0.07);display:grid;grid-template-columns:repeat(6,1fr);gap:0;}
.wx-hr{display:flex;flex-direction:column;align-items:center;gap:5px;padding:8px 4px;border-radius:9px;}
.wx-hr:hover{background:rgba(255,255,255,0.05);}
.wx-hr-t{font-family:'Inter',sans-serif;font-size:0.5rem;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.26);}
.wx-hr-i{font-size:1.25rem;}
.wx-hr-v{font-size:0.76rem;font-weight:600;color:rgba(255,255,255,0.68);}
.sport-toggles{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:24px;}
.sport-pill{display:inline-flex;align-items:center;gap:5px;padding:7px 13px;border-radius:100px;border:1.5px solid rgba(15,23,41,0.1);background:#fff;font-size:0.76rem;font-weight:600;cursor:pointer;transition:all 0.15s;box-shadow:0 1px 2px rgba(15,23,41,0.04);}
.sport-pill:hover{border-color:#3b6fd4;color:#3b6fd4;}
.sport-pill.on{background:#0f1729;border-color:#0f1729;color:#fff;}
.load-btn{background:#0f1729;color:#fff;border:none;border-radius:8px;padding:9px 18px;font-weight:700;font-size:0.76rem;cursor:pointer;margin-left:6px;}
.scores-sec{margin-bottom:28px;}
.scores-hd{display:flex;align-items:center;gap:9px;margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid #0f1729;}
.scores-sport-ico{font-size:1.2rem;}
.scores-sport-n{font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:700;color:#0f1729;letter-spacing:-0.02em;}
.games-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;}
.game-card{background:#fff;border:1px solid rgba(15,23,41,0.08);border-radius:11px;padding:14px;box-shadow:0 1px 2px rgba(15,23,41,0.04);}
.game-status{font-family:'Inter',sans-serif;font-size:0.52rem;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:9px;font-weight:500;}
.game-status.live{color:#ef4444;}.game-status.final{color:#6b7280;}.game-status.upcoming{color:#3b6fd4;}
.game-teams{display:flex;flex-direction:column;gap:7px;}
.game-team{display:flex;align-items:center;justify-content:space-between;gap:8px;}
.team-badge{flex-shrink:0;}
.game-team-n{font-size:0.82rem;font-weight:700;color:#0f1729;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.game-team.loser .game-team-n{color:#9ca3af;}
.game-score{font-family:'Playfair Display',serif;font-size:1.25rem;font-weight:700;color:#0f1729;min-width:28px;text-align:right;line-height:1;}
.game-team.loser .game-score{color:#9ca3af;}
.game-div{border:none;border-top:1px solid rgba(15,23,41,0.07);margin:5px 0;}
.game-time{font-family:'Inter',sans-serif;font-size:0.52rem;letter-spacing:0.08em;text-transform:uppercase;color:#9ca3af;margin-top:7px;}
.no-games{font-size:0.78rem;color:#9ca3af;font-style:italic;padding:10px 0;}
.mkt-filters{display:flex;gap:5px;margin-bottom:20px;flex-wrap:wrap;align-items:center;}
.mkt-fb{padding:5px 12px;border-radius:100px;border:1.5px solid rgba(15,23,41,0.1);background:#fff;font-size:0.74rem;font-weight:600;cursor:pointer;transition:all 0.15s;color:#6b7280;}
.mkt-fb:hover{border-color:#3b6fd4;color:#3b6fd4;}
.mkt-fb.on{background:#0f1729;border-color:#0f1729;color:#fff;}
.mkt-refresh{margin-left:auto;background:none;border:1.5px solid rgba(15,23,41,0.1);border-radius:8px;padding:5px 12px;font-weight:600;font-size:0.72rem;color:#6b7280;cursor:pointer;}
.mkt-sec{margin-bottom:28px;}
.mkt-sec-t{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:700;color:#0f1729;letter-spacing:-0.02em;margin-bottom:10px;padding-bottom:7px;border-bottom:1.5px solid rgba(15,23,41,0.08);}
.tickers-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;}
.ticker-card{background:#fff;border:1px solid rgba(15,23,41,0.08);border-radius:11px;padding:14px;box-shadow:0 1px 2px rgba(15,23,41,0.04);position:relative;}
.ticker-rm{position:absolute;top:9px;right:9px;background:none;border:none;color:#d1d5db;font-size:0.76rem;cursor:pointer;line-height:1;}
.ticker-rm:hover{color:#dc2626;}
.ticker-sym{font-family:'Inter',sans-serif;font-size:0.56rem;letter-spacing:0.1em;text-transform:uppercase;color:#9ca3af;margin-bottom:3px;}
.ticker-name{font-size:0.75rem;font-weight:600;color:#6b7280;margin-bottom:7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:16px;}
.ticker-price{font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:700;color:#0f1729;line-height:1;margin-bottom:3px;}
.ticker-chg{font-family:'Inter',sans-serif;font-size:0.64rem;font-weight:500;letter-spacing:0.04em;}
.ticker-chg.up{color:#16a34a;}.ticker-chg.down{color:#dc2626;}.ticker-chg.flat{color:#9ca3af;}
.mkt-add-row{display:flex;gap:7px;margin-top:14px;}
.mkt-add-in{flex:1;background:#fff;border:1.5px solid rgba(15,23,41,0.1);border-radius:8px;padding:8px 12px;font-family:'Inter',sans-serif;font-size:0.76rem;letter-spacing:0.06em;text-transform:uppercase;color:#0f1729;outline:none;}
.mkt-add-in:focus{border-color:#3b6fd4;}
.mkt-add-in::placeholder{color:#b0b8c4;text-transform:none;font-family:'Inter',sans-serif;letter-spacing:0;}
.mkt-add-btn{background:#0f1729;color:#fff;border:none;border-radius:8px;padding:8px 16px;font-weight:700;font-size:0.74rem;cursor:pointer;}
.daily-hero{background:linear-gradient(135deg,#0f1729,#1e2d55);border-radius:18px;padding:44px;margin-bottom:20px;position:relative;overflow:hidden;}
.daily-hero::before{content:'';position:absolute;top:-50px;right:-50px;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle,rgba(85,133,232,0.18),transparent 70%);pointer-events:none;}
.daily-date{font-family:'Inter',sans-serif;font-size:0.58rem;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.28);margin-bottom:18px;}
.daily-qm{font-family:'Playfair Display',serif;font-size:4.5rem;line-height:0.7;color:rgba(85,133,232,0.28);margin-bottom:6px;}
.daily-q{font-family:'Playfair Display',serif;font-size:clamp(1.3rem,2.3vw,1.85rem);font-weight:600;line-height:1.28;letter-spacing:-0.02em;color:#fff;margin-bottom:14px;font-style:italic;}
.daily-a{font-family:'Inter',sans-serif;font-size:0.62rem;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.38);}
.daily-cards{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;}
.dc{background:#fff;border:1px solid rgba(15,23,41,0.08);border-radius:13px;padding:20px;box-shadow:0 1px 3px rgba(15,23,41,0.05);}
.dc-ico{font-size:1.7rem;margin-bottom:10px;}
.dc-lbl{font-family:'Inter',sans-serif;font-size:0.54rem;letter-spacing:0.12em;text-transform:uppercase;color:#9ca3af;margin-bottom:7px;}
.dc-title{font-family:'Playfair Display',serif;font-size:0.96rem;font-weight:700;color:#0f1729;letter-spacing:-0.02em;margin-bottom:7px;}
.dc-text{font-size:0.77rem;color:#6b7280;line-height:1.62;}
.mover{position:fixed;inset:0;background:rgba(15,23,41,0.58);z-index:500;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);}
.mbox{background:#fff;border-radius:17px;padding:34px;width:min(490px,94vw);position:relative;box-shadow:0 24px 72px rgba(15,23,41,0.18);animation:mpop 0.22s ease;}
@keyframes mpop{from{opacity:0;transform:scale(0.96) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
.mx{position:absolute;top:14px;right:14px;background:#f0ece4;border:none;border-radius:50%;width:26px;height:26px;cursor:pointer;font-size:0.82rem;color:#6b7280;}
.mbox h3{font-family:'Playfair Display',serif;font-size:1.45rem;font-weight:700;letter-spacing:-0.03em;color:#0f1729;margin-bottom:4px;}
.mbox p{font-size:0.76rem;color:#6b7280;margin-bottom:16px;}
.msum{background:#fff;border:1.5px solid rgba(15,23,41,0.09);border-radius:9px;padding:13px;font-family:'Inter',sans-serif;font-size:0.61rem;line-height:2;color:#6b7280;margin-bottom:16px;white-space:pre-wrap;}
.mbtns{display:flex;gap:8px;justify-content:flex-end;}
.btn-cancel{background:#f0ece4;color:#1a1f2e;border:none;border-radius:8px;padding:8px 16px;font-weight:600;font-size:0.76rem;cursor:pointer;}
.btn-ok{background:#3b6fd4;color:#fff;border:none;border-radius:8px;padding:8px 16px;font-weight:700;font-size:0.76rem;cursor:pointer;box-shadow:0 4px 12px rgba(59,111,212,0.32);}
.toast{position:fixed;bottom:22px;left:50%;transform:translateX(-50%);background:#0f1729;color:#fff;font-weight:600;font-size:0.72rem;padding:10px 18px;border-radius:100px;z-index:9000;white-space:nowrap;box-shadow:0 8px 28px rgba(15,23,41,0.28);animation:tup 0.3s ease;pointer-events:none;}
@keyframes tup{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
/* ── HOME WEATHER WIDGET ── */
.home-wx{background:linear-gradient(135deg,#0f1729,#162040);padding:18px 36px;display:flex;align-items:center;gap:24px;flex-wrap:wrap;border-bottom:1px solid rgba(255,255,255,0.06);}
.home-wx-label{font-family:'Inter',sans-serif;font-size:0.52rem;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.28);white-space:nowrap;}
.home-wx-search{position:relative;flex:1;min-width:180px;max-width:280px;}
.home-wx-input{width:100%;background:rgba(255,255,255,0.09);border:1.5px solid rgba(255,255,255,0.14);border-radius:9px;padding:9px 13px;font-family:'Inter',sans-serif;font-size:0.83rem;color:#fff;outline:none;}
.home-wx-input::placeholder{color:rgba(255,255,255,0.28);}
.home-wx-dd{position:absolute;top:calc(100% + 6px);left:0;right:0;background:#1e2d55;border:1px solid rgba(255,255,255,0.12);border-radius:10px;box-shadow:0 10px 32px rgba(0,0,0,0.4);z-index:200;overflow:hidden;}
.home-wx-opt{padding:9px 13px;cursor:pointer;display:flex;justify-content:space-between;gap:8px;transition:background 0.1s;border-bottom:1px solid rgba(255,255,255,0.05);}
.home-wx-opt:last-child{border-bottom:none;}.home-wx-opt:hover{background:rgba(255,255,255,0.08);}
.home-wx-opt-n{font-size:0.82rem;font-weight:600;color:#fff;}
.home-wx-opt-s{font-size:0.66rem;color:rgba(255,255,255,0.36);}
.home-wx-card{display:flex;align-items:center;gap:16px;}
.home-wx-temp{font-family:'Playfair Display',serif;font-size:2.2rem;font-weight:700;color:#fff;line-height:1;letter-spacing:-0.04em;}
.home-wx-unit-sm{font-size:0.9rem;color:rgba(255,255,255,0.38);margin-left:1px;}
.home-wx-info{display:flex;flex-direction:column;gap:1px;}
.home-wx-city{font-family:'Inter',sans-serif;font-size:0.5rem;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.32);}
.home-wx-cond{font-size:0.78rem;color:rgba(255,255,255,0.55);font-weight:500;}
.home-wx-stats{display:flex;gap:12px;}
.home-wx-sv{font-size:0.76rem;font-weight:600;color:rgba(255,255,255,0.7);}
.home-wx-sl{font-family:'Inter',sans-serif;font-size:0.46rem;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.25);margin-top:1px;}
.home-wx-btns{display:flex;gap:6px;margin-left:auto;}
.home-wx-unit-btn{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.4);border-radius:6px;padding:4px 9px;font-family:'Inter',sans-serif;font-size:0.54rem;cursor:pointer;letter-spacing:0.06em;}
.home-wx-clear{background:none;border:1px solid rgba(255,255,255,0.09);color:rgba(255,255,255,0.22);border-radius:6px;padding:4px 9px;font-family:'Inter',sans-serif;font-size:0.5rem;letter-spacing:0.08em;cursor:pointer;}
/* ── BRIEF SCORES STRIP ── */
.brief-scores{margin-bottom:16px;border-radius:11px;overflow:hidden;border:1px solid rgba(15,23,41,0.08);}
.brief-scores-hd{background:#0f1729;padding:9px 14px;display:flex;align-items:center;justify-content:space-between;}
.brief-scores-title{font-family:'Inter',sans-serif;font-size:0.54rem;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.38);}
.brief-scores-league{font-family:'Inter',sans-serif;font-size:0.54rem;letter-spacing:0.08em;text-transform:uppercase;color:#5585e8;}
.brief-scores-games{background:#fff;display:flex;overflow-x:auto;gap:0;-webkit-overflow-scrolling:touch;}
.bs-game{min-width:140px;padding:11px 13px;border-right:1px solid rgba(15,23,41,0.07);flex-shrink:0;}
.bs-game:last-child{border-right:none;}
.bs-status{font-family:'Inter',sans-serif;font-size:0.46rem;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:7px;font-weight:600;}
.bs-status.live{color:#ef4444;}.bs-status.final{color:#6b7280;}.bs-status.upcoming{color:#3b6fd4;}
.bs-team{display:flex;align-items:center;justify-content:space-between;gap:5px;margin-bottom:3px;}
.bs-team:last-child{margin-bottom:0;}
.bs-name{font-size:0.74rem;font-weight:700;color:#0f1729;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;}
.bs-score{font-family:'Playfair Display',serif;font-size:0.95rem;font-weight:700;color:#0f1729;min-width:18px;text-align:right;}
.bs-team.loser .bs-name,.bs-team.loser .bs-score{color:#9ca3af;}
.bs-divider{border:none;border-top:1px solid rgba(15,23,41,0.07);margin:4px 0;}
/* ── BRIEF MARKETS STRIP ── */
.brief-markets{background:#0f1729;border-radius:11px;padding:14px 16px;margin-bottom:16px;}
.brief-markets-hd{font-family:'Inter',sans-serif;font-size:0.52rem;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:11px;display:flex;align-items:center;justify-content:space-between;}
.bm-live{display:inline-flex;align-items:center;gap:4px;font-family:'Inter',sans-serif;font-size:0.46rem;letter-spacing:0.08em;text-transform:uppercase;color:#4ade80;}
.bm-live-dot{width:4px;height:4px;border-radius:50%;background:#4ade80;animation:blink 2s infinite;}
.bm-closed{font-family:'Inter',sans-serif;font-size:0.46rem;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.2);}
.brief-markets-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;}
.bm-ticker{}
.bm-sym{font-family:'Inter',sans-serif;font-size:0.48rem;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.28);margin-bottom:2px;}
.bm-name{font-size:0.62rem;color:rgba(255,255,255,0.45);margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.bm-price{font-family:'Playfair Display',serif;font-size:0.92rem;font-weight:700;color:#fff;line-height:1;margin-bottom:2px;}
.bm-chg{font-family:'Inter',sans-serif;font-size:0.52rem;font-weight:500;}
.bm-chg.up{color:#4ade80;}.bm-chg.down{color:#f87171;}.bm-chg.flat{color:rgba(255,255,255,0.28);}
/* ── BRIEF BOOST SECTION ── */
.brief-boost{margin-top:32px;border-top:2px solid #0f1729;padding-top:24px;}
.brief-boost-hd{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:20px;}
.brief-boost-title{font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:700;color:#0f1729;letter-spacing:-0.02em;}
.brief-boost-date{font-family:'Inter',sans-serif;font-size:0.52rem;letter-spacing:0.1em;text-transform:uppercase;color:#9ca3af;}
.brief-boost-quote{background:linear-gradient(135deg,#0f1729,#1a2a4a);border-radius:12px;padding:24px 28px;margin-bottom:16px;position:relative;overflow:hidden;}
.brief-boost-quote::before{content:'"';position:absolute;top:-10px;left:16px;font-family:'Playfair Display',serif;font-size:6rem;line-height:1;color:rgba(85,133,232,0.18);pointer-events:none;}
.bbq-text{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:600;line-height:1.4;letter-spacing:-0.01em;color:#fff;font-style:italic;margin-bottom:10px;position:relative;z-index:1;}
.bbq-author{font-family:'Inter',sans-serif;font-size:0.54rem;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.38);position:relative;z-index:1;}
.brief-boost-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
.bb-card{background:#fff;border:1px solid rgba(15,23,41,0.08);border-radius:11px;padding:16px;box-shadow:0 1px 3px rgba(15,23,41,0.05);}
.bb-lbl{font-family:'Inter',sans-serif;font-size:0.52rem;letter-spacing:0.12em;text-transform:uppercase;color:#9ca3af;margin-bottom:6px;}
.bb-title{font-family:'Playfair Display',serif;font-size:0.9rem;font-weight:700;color:#0f1729;letter-spacing:-0.02em;margin-bottom:6px;}
.bb-text{font-size:0.76rem;color:#6b7280;line-height:1.58;}
.bb-src{display:inline-block;margin-top:10px;font-family:'Inter',sans-serif;font-size:0.5rem;letter-spacing:0.08em;text-transform:uppercase;color:#3b6fd4;text-decoration:none;border-bottom:1px solid rgba(59,111,212,0.22);}
.brief-boost-loading{text-align:center;padding:32px 0;color:var(--ink-4);font-size:0.8rem;}
/* ── ONBOARDING MODAL ── */
.ob-over{position:fixed;inset:0;background:rgba(10,15,30,0.75);z-index:600;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(12px);animation:fu 0.25s ease;}
.ob-box{background:#fff;border-radius:22px;padding:44px;width:min(480px,94vw);position:relative;box-shadow:0 32px 80px rgba(0,0,0,0.22);animation:mpop 0.28s cubic-bezier(0.22,1,0.36,1);}
.ob-icon{font-size:2.8rem;margin-bottom:16px;line-height:1;}
.ob-title{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:900;color:var(--ink);letter-spacing:-0.03em;margin-bottom:6px;}
.ob-sub{font-size:0.88rem;color:var(--ink-3);line-height:1.65;margin-bottom:28px;}
.ob-time-label{font-size:0.6rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--ink-3);margin-bottom:8px;display:block;}
.ob-time-input{width:100%;border:2px solid var(--rule);border-radius:10px;padding:14px 16px;font-size:1.1rem;font-weight:600;color:var(--ink);outline:none;transition:border 0.15s;margin-bottom:24px;font-family:'Inter',sans-serif;}
.ob-time-input:focus{border-color:var(--ink);}
.ob-topics-preview{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:24px;}
.ob-topic-chip{background:var(--bg-2);border:1px solid var(--rule);border-radius:100px;padding:5px 13px;font-size:0.74rem;font-weight:500;color:var(--ink-2);}
.ob-btn{width:100%;background:var(--ink);color:#fff;border:none;border-radius:10px;padding:16px;font-weight:700;font-size:0.95rem;cursor:pointer;transition:background 0.15s;margin-bottom:10px;}
.ob-btn:hover{background:var(--accent);}
.ob-skip{background:none;border:none;color:var(--ink-4);font-size:0.78rem;cursor:pointer;width:100%;padding:4px;}
.ob-skip:hover{color:var(--ink-3);}
.ob-denied{background:#fff2f2;border:1px solid #fca5a5;border-radius:8px;padding:11px 14px;font-size:0.8rem;color:#dc2626;margin-bottom:14px;}

/* ── AUTH MODAL ── */
.auth-modal-over{position:fixed;inset:0;background:rgba(10,15,30,0.72);z-index:600;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(10px);}
.auth-modal{background:#fff;border-radius:18px;padding:44px;width:min(440px,94vw);position:relative;box-shadow:0 24px 80px rgba(0,0,0,0.22);}
.auth-modal-close{position:absolute;top:14px;right:14px;background:var(--bg-2);border:none;border-radius:8px;width:30px;height:30px;cursor:pointer;font-size:0.9rem;color:var(--ink-3);display:flex;align-items:center;justify-content:center;}
.auth-modal-title{font-family:'Playfair Display',serif;font-size:1.7rem;font-weight:800;color:var(--ink);letter-spacing:-0.03em;margin-bottom:4px;}
.auth-modal-sub{font-size:0.8rem;color:var(--ink-3);margin-bottom:26px;}
.auth-divider{display:flex;align-items:center;gap:12px;margin:18px 0;color:var(--ink-4);font-size:0.72rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;}
.auth-divider::before,.auth-divider::after{content:'';flex:1;height:1px;background:var(--rule);}
.auth-field{margin-bottom:14px;}
.auth-field label{display:block;font-size:0.6rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--ink-3);margin-bottom:6px;}
.auth-field input{width:100%;border:1.5px solid var(--rule);border-radius:8px;padding:12px 14px;font-size:0.92rem;color:var(--ink);outline:none;transition:border 0.15s;}
.auth-field input:focus{border-color:var(--ink);}
.auth-submit{width:100%;background:var(--ink);color:#fff;border:none;border-radius:8px;padding:14px;font-weight:700;font-size:0.92rem;cursor:pointer;margin-top:6px;transition:background 0.15s;}
.auth-submit:hover{background:var(--accent);}
.auth-switch{text-align:center;font-size:0.78rem;color:var(--ink-3);margin-top:16px;}
.auth-switch button{background:none;border:none;color:var(--accent-2);font-weight:700;cursor:pointer;font-size:0.78rem;}
.oauth-btn{width:100%;display:flex;align-items:center;justify-content:center;gap:10px;padding:12px;border:1.5px solid var(--rule);border-radius:8px;background:#fff;cursor:pointer;font-size:0.88rem;font-weight:500;color:var(--ink);transition:all 0.15s;margin-bottom:10px;}
.oauth-btn:hover{background:var(--bg-2);border-color:var(--ink-3);}
.oauth-icon{width:18px;height:18px;}
.auth-error{background:#fff2f2;border:1px solid #fca5a5;border-radius:8px;padding:11px 14px;font-size:0.8rem;color:#dc2626;margin-bottom:14px;}

/* ── SAVED BRIEF BANNER ── */
.saved-brief-bar{background:var(--bg-2);border-bottom:1px solid var(--rule);padding:10px 48px;display:flex;align-items:center;justify-content:space-between;gap:12px;}
.saved-brief-bar-text{font-size:0.8rem;color:var(--ink-2);}
.saved-brief-bar-text strong{color:var(--ink);font-weight:600;}
.saved-brief-bar-time{font-size:0.6rem;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-4);}
.saved-brief-btn{font-size:0.78rem;font-weight:700;padding:7px 16px;border-radius:7px;cursor:pointer;border:none;background:var(--ink);color:#fff;}
.saved-brief-btn:hover{background:var(--accent);}
@media(max-width:860px){
 .hero{grid-template-columns:1fr;min-height:auto;}
 .hero-l{padding:56px 22px 48px;}
 .hero-r,.hero-stats{display:none;}
 .features{grid-template-columns:1fr;}
 .fb{border-right:none;border-bottom:1px solid rgba(255,255,255,0.07);}
 .fb:last-child{border-bottom:none;}
 .builder,.gen-wrap,.brief-wrap,.dashboard,.editor-panel{padding-left:22px;padding-right:22px;}
 .topbar{padding:0 22px;}
 .dashboard-hd{flex-direction:column;align-items:flex-start;gap:12px;}
 .dashboard-hd-r{align-items:flex-start;}
 .dashboard-actions{flex-wrap:wrap;}
 .hero-l,.hstat{padding-left:22px;padding-right:22px;}
 .pillars{grid-template-columns:1fr 1fr;}
 .pillar{border-bottom:1px solid var(--rule);}
 .sgrid{grid-template-columns:1fr 1fr;}
 .gen-panel{grid-template-columns:1fr;gap:16px;}
 .brief-story-grid{grid-template-columns:1fr;}
 .tg-stories,.tg-stories.n1,.tg-stories.n2,.tg-stories.n3,.tg-stories.n4,.tg-stories.n5,.tg-stories.n6,.tg-stories.n7,.tg-stories.n8,.tg-stories.n9,.tg-stories.n10{grid-template-columns:1fr 1fr;}
 .wx-page,.scores-page,.markets-page,.daily-page{padding:20px;}
 .wx-card-top{grid-template-columns:auto 1fr;}
 .wx-stats-g{grid-template-columns:1fr 1fr;}
 .wx-hourly{grid-template-columns:repeat(3,1fr);}
 .games-grid{grid-template-columns:1fr 1fr;}
 .tickers-grid{grid-template-columns:1fr 1fr;}
 .daily-cards{grid-template-columns:1fr;}
 .brief-boost-cards{grid-template-columns:1fr;}
 .loading{padding:56px 20px;}
 .no-brief-inner{padding:40px 24px;}
 .saved-brief-bar{padding:10px 22px;}
 .brief-story-card{padding:14px 16px;}
 .brief-feat-body{padding:16px 16px 14px;}
 .bmast{padding:28px 0 20px;}
 .bhl{font-size:clamp(1.4rem,6vw,3.2rem);}
 .dashboard-title{font-size:clamp(1.2rem,5vw,2.8rem);}
 .stats-inner{grid-template-columns:1fr 1fr;}
 .stat-block{border-bottom:1px solid var(--rule);padding:28px 22px;}
 .stat-block:nth-child(odd){border-right:1px solid var(--rule);}
 .stat-block:nth-child(even){border-right:none;}
 .how-steps{grid-template-columns:1fr;}
 .how-steps::before{display:none;}
 .how-section{padding:64px 22px;}
 .demo-section{padding:64px 22px;}
}
@media(max-width:500px){
 .sgrid,.tickers-grid,.games-grid{grid-template-columns:1fr;}
 .pillars{grid-template-columns:1fr;}
 .tg-stories,.tg-stories.n2,.tg-stories.n3,.tg-stories.n4,.tg-stories.n5,.tg-stories.n6,.tg-stories.n7,.tg-stories.n8,.tg-stories.n9,.tg-stories.n10{grid-template-columns:1fr;}
 .hero-badges{gap:6px;}
 .stats-inner{grid-template-columns:1fr 1fr;}
}

/* SCROLL ANIMATIONS */
.anim{opacity:0;transform:translateY(28px);transition:opacity 0.7s cubic-bezier(0.22,1,0.36,1),transform 0.7s cubic-bezier(0.22,1,0.36,1);}
.anim.visible{opacity:1;transform:translateY(0);}
.anim-d1{transition-delay:0.08s;}.anim-d2{transition-delay:0.16s;}.anim-d3{transition-delay:0.24s;}.anim-d4{transition-delay:0.32s;}

/* HERO BLOBS */
.hero-blob{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none;z-index:1;}
.hero-blob-1{width:580px;height:580px;background:rgba(200,16,46,0.12);top:-140px;right:-100px;animation:blob1 9s ease-in-out infinite;}
.hero-blob-2{width:440px;height:440px;background:rgba(26,58,107,0.45);bottom:-80px;left:35%;animation:blob2 11s ease-in-out infinite;}
.hero-blob-3{width:300px;height:300px;background:rgba(59,111,212,0.12);top:40%;left:-60px;animation:blob1 13s ease-in-out infinite reverse;}
@keyframes blob1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-28px,18px) scale(1.08)}}
@keyframes blob2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(18px,-28px) scale(0.92)}}

/* DEMO SECTION */
.demo-section{background:var(--ink);padding:100px 48px;position:relative;overflow:hidden;}
.demo-section::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at 50% 110%,rgba(26,58,107,0.5) 0%,transparent 65%);pointer-events:none;}
.demo-inner{max-width:620px;margin:0 auto;display:block;position:relative;z-index:2;}
.demo-card{display:none;}
.demo-eyebrow{font-size:0.64rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--accent);margin-bottom:14px;display:flex;align-items:center;gap:10px;}
.demo-eyebrow::before{content:'';width:24px;height:2px;background:var(--accent);flex-shrink:0;}
.demo-h2{font-family:'Playfair Display',serif;font-size:clamp(2rem,3.5vw,3.2rem);font-weight:900;color:#fff;letter-spacing:-0.04em;line-height:1.0;margin-bottom:18px;}
.demo-h2 em{color:var(--accent);font-style:italic;}
.demo-desc{font-size:0.95rem;line-height:1.78;color:rgba(255,255,255,0.4);margin-bottom:32px;font-weight:300;max-width:420px;}
.demo-points{display:flex;flex-direction:column;gap:16px;}
.demo-point{display:flex;align-items:flex-start;gap:14px;}
.demo-point-dot{width:6px;height:6px;border-radius:50%;background:var(--accent);flex-shrink:0;margin-top:8px;}
.demo-point-text{font-size:0.88rem;color:rgba(255,255,255,0.55);line-height:1.6;}
.demo-point-text strong{color:rgba(255,255,255,0.88);font-weight:600;}
.demo-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:20px;overflow:hidden;box-shadow:0 40px 100px rgba(0,0,0,0.5);}
.demo-card-top{background:rgba(255,255,255,0.03);border-bottom:1px solid rgba(255,255,255,0.07);padding:14px 20px;display:flex;align-items:center;justify-content:space-between;}
.demo-card-dots{display:flex;gap:6px;}
.demo-card-dots span{width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,0.12);}
.demo-card-kicker{font-size:0.56rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.22);}
.demo-story-section{padding:20px 20px 0;}
.demo-section-label{font-size:0.56rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--accent);margin-bottom:10px;padding-bottom:8px;border-bottom:1.5px solid rgba(200,16,46,0.25);}
.demo-featured-hl{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:800;color:rgba(255,255,255,0.88);line-height:1.25;letter-spacing:-0.02em;margin-bottom:6px;}
.demo-featured-sum{font-size:0.74rem;color:rgba(255,255,255,0.35);line-height:1.55;margin-bottom:14px;}
.demo-items{display:flex;flex-direction:column;}
.demo-item{padding:10px 0;border-top:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;gap:10px;}
.demo-item-tag{font-size:0.5rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.22);white-space:nowrap;flex-shrink:0;width:68px;}
.demo-item-txt{font-size:0.76rem;color:rgba(255,255,255,0.48);line-height:1.4;flex:1;}
.demo-item-arrow{font-size:0.6rem;color:rgba(255,255,255,0.2);flex-shrink:0;}
.demo-card-footer{padding:12px 20px;border-top:1px solid rgba(255,255,255,0.07);display:flex;align-items:center;justify-content:space-between;}
.demo-card-sources{font-size:0.54rem;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;color:rgba(255,255,255,0.18);}
.demo-card-badge{display:flex;align-items:center;gap:5px;font-size:0.54rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:rgba(74,222,128,0.7);}
.demo-badge-dot{width:4px;height:4px;border-radius:50%;background:#4ade80;animation:blink 2s infinite;}

/* STATS */
.stats-strip{background:#fff;border-bottom:1px solid var(--rule);}
.stats-inner{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);}
.stat-block{padding:40px 44px;border-right:1px solid var(--rule);}
.stat-block:last-child{border-right:none;}
.stat-n{font-family:'Playfair Display',serif;font-size:3rem;font-weight:900;color:var(--ink);letter-spacing:-0.05em;line-height:1;margin-bottom:6px;}
.stat-n em{color:var(--accent);font-style:normal;}
.stat-label{font-size:0.74rem;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;color:var(--ink-2);margin-bottom:3px;}
.stat-sub{font-size:0.74rem;color:var(--ink-4);}

/* HOW IT WORKS */
.how-section{background:var(--bg-2);border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);padding:100px 48px;}
.how-inner{max-width:1100px;margin:0 auto;}
.how-hd{text-align:center;margin-bottom:72px;}
.how-eyebrow{font-size:0.64rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--accent);margin-bottom:12px;}
.how-title{font-family:'Playfair Display',serif;font-size:clamp(2rem,3.5vw,3rem);font-weight:900;color:var(--ink);letter-spacing:-0.04em;line-height:1.0;margin-bottom:12px;}
.how-title em{color:var(--accent);font-style:italic;}
.how-sub{font-size:0.95rem;color:var(--ink-3);max-width:460px;margin:0 auto;line-height:1.72;}
.how-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
.how-step{background:#fff;border:1px solid var(--rule);border-radius:18px;padding:40px 36px;transition:transform 0.25s cubic-bezier(0.22,1,0.36,1),box-shadow 0.25s;}
.how-step:hover{transform:translateY(-6px);box-shadow:0 24px 56px rgba(10,15,30,0.12);}
.how-step-num{width:56px;height:56px;border-radius:16px;background:var(--ink);color:#fff;font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:900;display:flex;align-items:center;justify-content:center;margin-bottom:24px;transition:background 0.2s;}
.how-step:hover .how-step-num{background:var(--accent);}
.how-step-title{font-family:'Playfair Display',serif;font-size:1.35rem;font-weight:800;color:var(--ink);letter-spacing:-0.03em;margin-bottom:10px;}
.how-step-text{font-size:0.84rem;color:var(--ink-3);line-height:1.72;}
.how-step-tag{display:inline-block;margin-top:18px;font-size:0.6rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent);background:rgba(200,16,46,0.07);padding:5px 12px;border-radius:100px;}

/* TOPIC CLOUD */
.cloud-section{background:var(--ink);padding:88px 0;overflow:hidden;position:relative;}
.cloud-section::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 70% 80% at 50% 50%,rgba(26,58,107,0.45) 0%,transparent 70%);pointer-events:none;}
.cloud-hd{text-align:center;padding:0 48px;margin-bottom:52px;position:relative;z-index:2;}
.cloud-eyebrow{font-size:0.64rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--accent);margin-bottom:12px;}
.cloud-title{font-family:'Playfair Display',serif;font-size:clamp(1.8rem,3vw,2.8rem);font-weight:900;color:#fff;letter-spacing:-0.04em;line-height:1.05;}
.cloud-rows{display:flex;flex-direction:column;gap:12px;position:relative;z-index:2;}
.cloud-row{overflow:hidden;}
.cloud-row-inner{display:inline-flex;gap:10px;animation:cloudScroll 28s linear infinite;}
.cloud-row:nth-child(2) .cloud-row-inner{animation-direction:reverse;animation-duration:22s;}
.cloud-row:nth-child(3) .cloud-row-inner{animation-duration:34s;}
@keyframes cloudScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.cloud-pill{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:100px;padding:9px 20px;font-size:0.78rem;font-weight:600;color:rgba(255,255,255,0.6);white-space:nowrap;flex-shrink:0;}
.cloud-pill-dot{width:5px;height:5px;border-radius:50%;background:var(--accent);flex-shrink:0;}

/* BRIEF SECTION ANIMATION */
.brief-topic-section{animation:briefSectionIn 0.5s cubic-bezier(0.22,1,0.36,1) both;}
@keyframes briefSectionIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}

/* LOADING BAR */
.ld-bar-wrap{width:260px;height:2px;background:rgba(15,23,41,0.08);border-radius:2px;margin-top:22px;overflow:hidden;}
.ld-bar{height:100%;background:var(--accent);border-radius:2px;animation:ldBar 2.8s ease-in-out infinite;}
@keyframes ldBar{0%{width:5%;margin-left:0}50%{width:55%;margin-left:20%}100%{width:5%;margin-left:95%}}

/* LOADING TOPICS DOTS */
.ld-topics{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-top:20px;max-width:480px;}
.ld-topic-pill{display:inline-flex;align-items:center;gap:6px;padding:5px 13px;border-radius:100px;border:1px solid rgba(15,23,41,0.1);font-size:0.66rem;font-weight:600;letter-spacing:0.06em;color:var(--ink-3);background:#fff;animation:pillPop 0.4s cubic-bezier(0.22,1,0.36,1) both;}
.ld-topic-pill.scanning{border-color:var(--accent);color:var(--accent);background:rgba(200,16,46,0.04);animation:pillPop 0.4s cubic-bezier(0.22,1,0.36,1) both,pillPulse 1.4s ease-in-out infinite;}
.ld-topic-pill.done{border-color:rgba(22,163,74,0.4);color:#16a34a;background:rgba(22,163,74,0.06);}
.ld-pill-dot{width:4px;height:4px;border-radius:50%;background:currentColor;flex-shrink:0;}
@keyframes pillPop{from{opacity:0;transform:scale(0.85) translateY(6px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes pillPulse{0%,100%{opacity:1}50%{opacity:0.6}}
.ld-orbs{display:flex;gap:10px;margin-bottom:24px;}
.ld-orb{width:10px;height:10px;border-radius:50%;background:var(--ink);animation:orbPulse 1.2s ease-in-out infinite;}
.ld-orb:nth-child(2){animation-delay:0.2s;background:var(--accent);}
.ld-orb:nth-child(3){animation-delay:0.4s;}
@keyframes orbPulse{0%,100%{transform:scale(1);opacity:0.4}50%{transform:scale(1.4);opacity:1}}

/* SHIMMER EFFECT ON PRIMARY BUTTONS */
.btn-p,.btn-gen,.no-brief-btn,.auth-submit,.dash-btn-regen{position:relative;overflow:hidden;}
.btn-p::after,.btn-gen::after,.no-brief-btn::after{content:'';position:absolute;inset:0;background:linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.15) 50%,transparent 70%);transform:translateX(-100%);transition:transform 0.5s ease;}
.btn-p:hover::after,.btn-gen:hover::after,.no-brief-btn:hover::after{transform:translateX(100%);}

/* HOW STEP CONNECTOR */
.how-steps{position:relative;}
.how-steps::before{content:'';position:absolute;top:60px;left:calc(16.67% + 18px);right:calc(16.67% + 18px);height:1px;background:linear-gradient(90deg,var(--rule),var(--ink),var(--rule));opacity:0.4;z-index:0;}
.how-step{position:relative;z-index:1;}

/* STATS COUNTER ANIMATION */
.stat-n{transition:all 0.3s;}
.stat-block.visible .stat-n{animation:countUp 0.6s cubic-bezier(0.22,1,0.36,1) both;}
@keyframes countUp{from{opacity:0;transform:translateY(16px) scale(0.9)}to{opacity:1;transform:translateY(0) scale(1)}}

/* CLOUD PILL HOVER */
.cloud-pill{transition:all 0.2s;cursor:default;}
.cloud-pill:hover{background:rgba(255,255,255,0.12);border-color:rgba(255,255,255,0.2);color:#fff;transform:scale(1.04);}

/* GEN PANEL PULSE */
.gen-panel{transition:box-shadow 0.3s;}
.gen-panel:hover{box-shadow:0 0 0 1px rgba(255,255,255,0.08);}

/* TOPBAR SCROLL SHADOW */
.topbar{transition:box-shadow 0.2s;}
.topbar.scrolled{box-shadow:0 2px 20px rgba(10,15,30,0.08);}

/* SMOOTH BRIEF IN */
.brief-topic-section{animation:briefSectionIn 0.5s cubic-bezier(0.22,1,0.36,1) both;}
@keyframes briefSectionIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}

/* ── BOTTOM NAV ── */
.mob-nav{position:fixed;bottom:0;left:0;right:0;z-index:200;background:rgba(255,255,255,0.97);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-top:1px solid var(--rule);padding:8px 0 env(safe-area-inset-bottom,10px);}
.mob-nav-inner{display:flex;justify-content:space-around;max-width:480px;margin:0 auto;}
.mob-tab{display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 16px;cursor:pointer;flex:1;position:relative;}
.mob-tab-ico{font-size:1.5rem;line-height:1;transition:transform 0.15s;}
.mob-tab.active .mob-tab-ico{transform:scale(1.1);}
.mob-tab-lbl{font-size:0.48rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-4);transition:color 0.15s;}
.mob-tab.active .mob-tab-lbl{color:var(--ink);}
.mob-tab-bar{position:absolute;top:0;left:50%;transform:translateX(-50%);width:0;height:2px;background:var(--ink);border-radius:0 0 3px 3px;transition:width 0.2s;}
.mob-tab.active .mob-tab-bar{width:28px;}
/* TAB BODY */
.tab-body{padding-bottom:80px;}
/* ── PROFILE TAB ── */
.profile-page{max-width:500px;margin:0 auto;padding:36px 22px 32px;}
.profile-avatar-row{display:flex;flex-direction:column;align-items:center;gap:10px;margin-bottom:36px;padding-bottom:32px;border-bottom:1px solid var(--rule);}
.profile-avatar{width:68px;height:68px;border-radius:50%;background:var(--ink);color:#fff;font-family:'Playfair Display',serif;font-size:1.7rem;font-weight:900;display:flex;align-items:center;justify-content:center;}
.profile-name{font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:800;color:var(--ink);letter-spacing:-0.02em;}
.profile-email-txt{font-size:0.76rem;color:var(--ink-3);}
.profile-section{background:#fff;border:1px solid var(--rule);border-radius:16px;overflow:hidden;margin-bottom:16px;}
.profile-row{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--rule);gap:16px;}
.profile-row:last-child{border-bottom:none;}
.profile-row-l{}
.profile-row-lbl{font-size:0.86rem;font-weight:600;color:var(--ink);}
.profile-row-sub{font-size:0.72rem;color:var(--ink-3);margin-top:2px;}
.profile-time{border:none;outline:none;font-size:0.86rem;font-weight:600;color:var(--ink);font-family:'Inter',sans-serif;background:transparent;cursor:pointer;}
.profile-push-btn{background:var(--ink);color:#fff;border:none;border-radius:8px;padding:8px 16px;font-size:0.72rem;font-weight:700;cursor:pointer;white-space:nowrap;}
.profile-push-btn.ok{background:#16a34a;}
.profile-push-btn.denied{background:var(--ink-3);cursor:not-allowed;}
.profile-save-btn{width:100%;background:var(--ink);color:#fff;border:none;border-radius:12px;padding:15px;font-size:0.92rem;font-weight:700;cursor:pointer;margin-bottom:12px;}
.profile-save-btn:hover{background:var(--accent);}
.profile-signout{width:100%;background:transparent;border:1.5px solid var(--rule);border-radius:12px;padding:15px;font-size:0.9rem;font-weight:600;color:var(--ink-3);cursor:pointer;}
.profile-signout:hover{border-color:var(--accent);color:var(--accent);}
/* ── TOPICS TAB ── */
.topics-page{max-width:680px;margin:0 auto;padding:32px 22px 32px;}
.topics-page-hd{margin-bottom:28px;}
.topics-page-title{font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:900;color:var(--ink);letter-spacing:-0.03em;margin-bottom:4px;}
.topics-page-sub{font-size:0.84rem;color:var(--ink-3);}
/* ── BRIEF TAB HEADER ── */
.brief-tab-hd{max-width:1000px;margin:0 auto;padding:28px 22px 0;display:flex;align-items:flex-start;justify-content:space-between;gap:12px;}
.brief-tab-edition{font-size:0.52rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--accent);margin-bottom:6px;display:flex;align-items:center;gap:6px;}
.brief-tab-edition::before{content:'';width:14px;height:2px;background:var(--accent);}
.brief-tab-title{font-family:'Playfair Display',serif;font-size:clamp(1.1rem,4vw,1.8rem);font-weight:900;color:var(--ink);letter-spacing:-0.03em;line-height:1.1;}
.brief-tab-sub{font-size:0.68rem;color:var(--ink-3);margin-top:4px;}
.brief-refresh-btn{background:var(--ink);color:#fff;border:none;border-radius:8px;padding:10px 18px;font-size:0.76rem;font-weight:700;cursor:pointer;flex-shrink:0;margin-top:4px;}
.brief-refresh-btn:hover{background:var(--accent);}
.brief-refresh-btn:disabled{opacity:0.5;cursor:not-allowed;}

/* ── NEW USER ONBOARDING ── */
.nuo{position:fixed;inset:0;z-index:600;background:var(--ink);display:flex;flex-direction:column;overflow:hidden;animation:nuoIn 0.35s cubic-bezier(0.22,1,0.36,1);}
@keyframes nuoIn{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
.nuo-top{padding:20px 24px 0;display:flex;align-items:center;justify-content:space-between;}
.nuo-logo{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:900;color:#fff;letter-spacing:-0.02em;}
.nuo-step{font-size:0.58rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.3);}
.nuo-hd{padding:32px 24px 20px;}
.nuo-eyebrow{font-size:0.58rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--accent);margin-bottom:10px;display:flex;align-items:center;gap:8px;}
.nuo-eyebrow::before{content:'';width:18px;height:2px;background:var(--accent);}
.nuo-title{font-family:'Playfair Display',serif;font-size:clamp(1.9rem,7vw,2.8rem);font-weight:900;color:#fff;line-height:1.05;letter-spacing:-0.03em;margin-bottom:8px;}
.nuo-sub{font-size:0.88rem;color:rgba(255,255,255,0.42);line-height:1.65;}
.nuo-body{flex:1;overflow-y:auto;padding:0 24px 16px;}
.nuo-search-wrap{position:relative;margin-bottom:14px;}
.nuo-search{width:100%;background:rgba(255,255,255,0.08);border:1.5px solid rgba(255,255,255,0.14);border-radius:12px;padding:13px 16px 13px 42px;font-size:0.92rem;color:#fff;outline:none;transition:border-color 0.15s;}
.nuo-search:focus{border-color:rgba(255,255,255,0.35);}
.nuo-search::placeholder{color:rgba(255,255,255,0.28);}
.nuo-search-ico{position:absolute;left:14px;top:50%;transform:translateY(-50%);opacity:0.35;pointer-events:none;font-size:1rem;}
.nuo-sugg-lbl{font-size:0.58rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.28);margin-bottom:10px;}
.nuo-sugg-wrap{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;}
.nuo-sugg{padding:8px 14px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.1);border-radius:100px;font-size:0.8rem;font-weight:500;color:rgba(255,255,255,0.65);cursor:pointer;transition:all 0.15s;user-select:none;}
.nuo-sugg:hover{background:rgba(255,255,255,0.12);}
.nuo-sugg.on{background:var(--accent);border-color:var(--accent);color:#fff;font-weight:700;}
.nuo-chips{display:flex;flex-wrap:wrap;gap:7px;min-height:28px;margin-bottom:12px;}
.nuo-chip{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.18);border-radius:100px;padding:6px 12px;font-size:0.78rem;color:#fff;font-weight:500;}
.nuo-chip-x{cursor:pointer;opacity:0.55;font-size:1rem;line-height:1;}
.nuo-chip-x:hover{opacity:1;}
.nuo-footer{padding:16px 24px env(safe-area-inset-bottom,20px);background:linear-gradient(to top,var(--ink) 70%,transparent);}
.nuo-btn{width:100%;background:var(--accent);color:#fff;border:none;border-radius:14px;padding:18px;font-size:1rem;font-weight:700;cursor:pointer;transition:all 0.2s;opacity:0.35;pointer-events:none;}
.nuo-btn.ready{opacity:1;pointer-events:auto;}
.nuo-btn.ready:hover{background:#e01535;}
.nuo-hint{text-align:center;font-size:0.7rem;color:rgba(255,255,255,0.22);margin-top:10px;}

/* ── OFFLINE BANNER ── */
.offline-bar{position:fixed;top:0;left:0;right:0;z-index:999;background:#dc2626;color:#fff;text-align:center;font-size:0.72rem;font-weight:700;padding:9px 16px;letter-spacing:0.05em;animation:slideDown 0.25s ease;}
@keyframes slideDown{from{transform:translateY(-100%)}to{transform:translateY(0)}}
/* ── PULL TO REFRESH ── */
.ptr-wrap{display:flex;align-items:center;justify-content:center;height:0;overflow:hidden;transition:height 0.15s ease;color:var(--ink-3);font-size:0.75rem;gap:8px;font-weight:500;}
.ptr-wrap.visible{height:52px;}
.ptr-spinner{width:18px;height:18px;border:2.5px solid var(--rule);border-top-color:var(--ink);border-radius:50%;animation:spin 0.7s linear infinite;flex-shrink:0;}
.ptr-arrow{font-size:1.1rem;display:inline-block;transition:transform 0.2s;}
.ptr-arrow.ready{transform:rotate(180deg);}
/* ── LANDING SLIDES ── */
.ls{min-height:100dvh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:72px 32px 80px;text-align:center;position:relative;overflow:hidden;}
.ls-1{background:var(--ink);}
.ls-2{background:#fff;}
.ls-3{background:var(--bg-2);border-top:1px solid var(--rule);}
/* Slide 1 */
.ls1-hl{font-family:'Playfair Display',serif;font-size:clamp(4rem,16vw,7rem);font-weight:900;color:#fff;letter-spacing:-0.05em;line-height:0.88;margin-bottom:28px;}
.ls1-hl em{color:var(--accent);font-style:italic;}
.ls1-sub{font-size:1rem;color:rgba(255,255,255,0.42);line-height:1.7;max-width:320px;margin:0 auto 40px;font-weight:300;}
.ls1-btns{display:flex;flex-direction:column;gap:12px;width:100%;max-width:300px;}
.ls1-btn-p{background:var(--accent);color:#fff;border:none;border-radius:14px;padding:18px 32px;font-family:'Inter',sans-serif;font-size:1rem;font-weight:700;cursor:pointer;width:100%;}
.ls1-btn-p:hover{background:#e01535;}
.ls1-btn-g{background:#fff;color:var(--ink);border:none;border-radius:14px;padding:18px 32px;font-family:'Inter',sans-serif;font-size:1rem;font-weight:700;cursor:pointer;width:100%;}
.ls1-btn-g:hover{background:rgba(255,255,255,0.9);}
.ls1-scroll{position:absolute;bottom:24px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:4px;}
.ls1-scroll-line{width:1px;height:32px;background:rgba(255,255,255,0.25);animation:lsScroll 2s ease-in-out infinite;}
.ls1-scroll-label{font-size:0.46rem;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.2);margin-top:4px;}
@keyframes lsScroll{0%,100%{transform:scaleY(1);opacity:0.3}50%{transform:scaleY(0.55);opacity:0.9}}
/* Slide 2 */
.ls2-label{font-size:0.58rem;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:var(--ink-4);margin-bottom:40px;}
.ls2-list{display:flex;flex-direction:column;width:100%;max-width:420px;text-align:left;}
.ls2-item{padding:22px 0;border-top:1px solid var(--rule);}
.ls2-item:last-child{border-bottom:1px solid var(--rule);}
.ls2-n{font-size:0.52rem;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:var(--accent);margin-bottom:6px;}
.ls2-title{font-family:'Playfair Display',serif;font-size:clamp(1.2rem,4vw,1.5rem);font-weight:800;color:var(--ink);letter-spacing:-0.03em;line-height:1.1;margin-bottom:4px;}
.ls2-desc{font-size:0.78rem;color:var(--ink-3);line-height:1.6;}
/* Slide 3 */
.ls3-eyebrow{font-size:0.58rem;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:var(--accent);margin-bottom:10px;}
.ls3-hl{font-family:'Playfair Display',serif;font-size:clamp(2rem,7vw,3rem);font-weight:900;color:var(--ink);letter-spacing:-0.04em;line-height:1;margin-bottom:44px;}
.ls3-steps{display:flex;flex-direction:column;gap:22px;width:100%;max-width:380px;text-align:left;margin-bottom:44px;}
.ls3-step{display:flex;align-items:flex-start;gap:18px;}
.ls3-num{width:44px;height:44px;border-radius:12px;background:var(--ink);color:#fff;font-family:'Playfair Display',serif;font-size:0.92rem;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.ls3-step-title{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:800;color:var(--ink);letter-spacing:-0.02em;margin-bottom:3px;}
.ls3-step-text{font-size:0.78rem;color:var(--ink-3);line-height:1.6;}
.ls3-cta{background:var(--ink);color:#fff;border:none;border-radius:14px;padding:18px 40px;font-family:'Inter',sans-serif;font-size:1rem;font-weight:700;cursor:pointer;width:100%;max-width:300px;}
.ls3-cta:hover{background:var(--accent);}
`;

export default function NewsHall() {
 const supabase = createClient();

 // ── AUTH STATE ────────────────────────────────────────────────────────
 const [user, setUser] = useState(null);
 const [authModal, setAuthModal] = useState(null); // null | 'login' | 'signup'
 const [authEmail, setAuthEmail] = useState("");
 const [authPassword, setAuthPassword] = useState("");
 const [authError, setAuthError] = useState("");
 const [authLoading, setAuthLoading] = useState(false);
 const [showPassword, setShowPassword] = useState(false);
 const [authUsername, setAuthUsername] = useState("");
 const [savedBriefMeta, setSavedBriefMeta] = useState(null); // {generated_at}
 const [briefIsStale, setBriefIsStale] = useState(false); // true if brief is from a previous day
 const [isStreaming, setIsStreaming] = useState(false); // true while SSE stream is open
 const [streamedCount, setStreamedCount] = useState(0); // topics received so far

 useEffect(()=>{
   supabase.auth.getUser().then(({data:{user}})=>setUser(user??null));
   const {data:{subscription}} = supabase.auth.onAuthStateChange((_,session)=>{
     setUser(session?.user??null);
     if(session?.user) loadUserData(session.user);
   });
   return ()=>subscription.unsubscribe();
 },[]);

 const loadOgImages = (briefData) => {
   const items = (briefData?.topics||[]).map(tg=>({url:tg.stories?.[0]?.url||"",topic:tg.topic||""}));
   if (!items.length) return;
   fetch("/api/og-images",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({urls:items})})
     .then(r=>r.json()).then(({images})=>setOgImages(images||{})).catch(()=>{});
 };

 const loadUserData = async (u) => {
   // Load saved preferences
   const prefRes = await fetch('/api/preferences');
   const prefs = await prefRes.json();
   if(prefs?.topics?.length) setTopics(prefs.topics);
   if(prefs?.settings) setSettings(s=>({...s,...prefs.settings}));

   // Load saved brief from Supabase
   const {data:savedBrief} = await supabase.from("briefs").select("content,generated_at").eq("user_id",u.id).single();
   if(savedBrief?.content) {
     setBrief(savedBrief.content);
     setPhase("done");
     setSavedBriefMeta({generated_at: savedBrief.generated_at});
     loadOgImages(savedBrief.content);
     // Check freshness — is it from today?
     const genDate = new Date(savedBrief.generated_at);
     const todayDate = new Date();
     const isToday = genDate.getFullYear()===todayDate.getFullYear() &&
       genDate.getMonth()===todayDate.getMonth() &&
       genDate.getDate()===todayDate.getDate();
     setBriefIsStale(!isToday);
   } else {
     // No saved brief — check if user generated one before signing in
     try {
       const pending = localStorage.getItem("nh_pending_brief");
       if(pending) {
         const {brief:pb,topics:pt,ts} = JSON.parse(pending);
         // Only restore if generated within last 24h
         if(pb && Date.now()-ts < 86400000) {
           const now = new Date().toISOString();
           await supabase.from("briefs").upsert({user_id:u.id,content:pb,generated_at:now},{onConflict:"user_id"});
           if(pt?.length) await supabase.from("user_settings").upsert({user_id:u.id,topics:pt,updated_at:now},{onConflict:"user_id"});
           setBrief(pb); setPhase("done"); setSavedBriefMeta({generated_at:now}); loadOgImages(pb);
           if(pt?.length) setTopics(pt);
         }
         localStorage.removeItem("nh_pending_brief");
       }
     } catch(_) {}
   }

   // Load delivery time setting
   const {data:userSettings} = await supabase.from("user_settings").select("topics,delivery_time").eq("user_id",u.id).single();
   if(userSettings?.topics?.length) setTopics(userSettings.topics);
   if(userSettings?.delivery_time) setDeliveryTime(userSettings.delivery_time);

   // Check push permission state
   if("Notification" in window) {
     setPushStatus(Notification.permission === "granted" ? "granted" : "idle");
   }

   // New user onboarding — no brief AND no saved topics
   if(!savedBrief?.content && !prefs?.topics?.length) {
     setTimeout(()=>setShowNewUserOnboard(true), 400);
   } else if(!savedBrief?.content && Notification.permission !== "granted") {
     setTimeout(()=>setShowOnboarding(true), 800);
   }
 };

 const saveUserData = async (b, t) => {
   if(!user) return;
   const now = new Date().toISOString();
   await supabase.from("briefs").upsert({user_id:user.id, content:b, generated_at:now},{onConflict:"user_id"});
   // Compute delivery_hour_utc so new users are picked up by the cron
   const utcOffset = new Date().getTimezoneOffset(); // minutes behind UTC
   const [h, m] = (deliveryTime||"07:00").split(":").map(Number);
   const deliveryHourUtc = ((h * 60 + (m||0) + utcOffset) / 60 + 24) % 24 | 0;
   await supabase.from("user_settings").upsert({user_id:user.id, topics:t, delivery_time:deliveryTime, delivery_hour_utc:deliveryHourUtc, updated_at:now},{onConflict:"user_id"});
   setSavedBriefMeta({generated_at: now});
   setBriefIsStale(false);
 };

 const signInWithGoogle = async () => {
   await supabase.auth.signInWithOAuth({provider:'google',
     options:{redirectTo:`${window.location.origin}/api/auth/callback`}});
 };
 const signInWithApple = async () => {
   await supabase.auth.signInWithOAuth({provider:'apple',
     options:{redirectTo:`${window.location.origin}/api/auth/callback`}});
 };
 const signInWithEmail = async () => {
   setAuthLoading(true); setAuthError("");
   const {error} = await supabase.auth.signInWithPassword({email:authEmail,password:authPassword});
   if(error) setAuthError(error.message);
   else setAuthModal(null);
   setAuthLoading(false);
 };
 const signUpWithEmail = async () => {
   setAuthLoading(true); setAuthError("");
   const {error} = await supabase.auth.signUp({email:authEmail,password:authPassword,
     options:{emailRedirectTo:`${window.location.origin}/api/auth/callback`,
       data:{username:authUsername||authEmail.split('@')[0]}}});
   if(error) {
     if(error.message.toLowerCase().includes('already registered') || error.message.toLowerCase().includes('already exists') || error.message.toLowerCase().includes('email address is already')) {
       setAuthError('__already_exists__');
     } else {
       setAuthError(error.message);
     }
   } else {
     setAuthModal(null);
     showToast("Check your email to confirm your account!");
   }
   setAuthLoading(false);
 };
 const signOut = async () => {
   await supabase.auth.signOut();
   setUser(null); setBrief(null); setPhase("idle"); setSavedBriefMeta(null);
   showToast("Signed out");
 };

 const [tab, setTab] = useState("brief");
 const [topics, setTopics] = useState([]);
 const [_mounted, setMounted] = useState(false);
 const [pushStatus, setPushStatus] = useState("idle"); // idle | asking | granted | denied
 const [deliveryTime, setDeliveryTime] = useState("07:00");
 const [showOnboarding, setShowOnboarding] = useState(false);
 const [showNewUserOnboard, setShowNewUserOnboard] = useState(false);

 useEffect(()=>{
   setMounted(true);
   try{const s=localStorage.getItem("nh_topics");if(s)setTopics(JSON.parse(s));}catch{}
 },[]);

 const registerPush = async () => {
   if(!("serviceWorker" in navigator)||!("PushManager" in window)) return null;
   const reg = await navigator.serviceWorker.register("/sw.js");
   await navigator.serviceWorker.ready;
   const existing = await reg.pushManager.getSubscription();
   if(existing) return existing;
   const sub = await reg.pushManager.subscribe({
     userVisibleOnly: true,
     applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
   });
   return sub;
 };

 const urlBase64ToUint8Array = (base64String) => {
   const padding = "=".repeat((4 - base64String.length % 4) % 4);
   const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
   const rawData = window.atob(base64);
   return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
 };

 const saveSettings = async () => {
   if(!user) return;
   setPushStatus("asking");
   try {
     const permission = await Notification.requestPermission();
     if(permission !== "granted"){ setPushStatus("denied"); return; }
     const sub = await registerPush();
     const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
     const [h, m] = deliveryTime.split(":").map(Number);
     const utcOffset = new Date().getTimezoneOffset();
     const deliveryHourUtc = ((h * 60 + (m||0) + utcOffset) / 60 + 24) % 24 | 0;
     await fetch("/api/push/subscribe", {
       method: "POST",
       headers: {"Content-Type":"application/json"},
       body: JSON.stringify({
         subscription: sub?.toJSON(),
         delivery_time: deliveryTime,
         delivery_hour_utc: deliveryHourUtc,
         timezone: tz,
         topics,
       }),
     });
     setPushStatus("granted");
     setShowOnboarding(false);
     showToast("You're all set! Your brief will arrive at " + deliveryTime + " every morning.");
   } catch(e) {
     setPushStatus("idle");
   }
 };
 useEffect(()=>{
   if(!user) try{localStorage.setItem("nh_topics",JSON.stringify(topics));}catch{}
 },[topics, user]);

 const [failedOgImages, setFailedOgImages] = useState(new Set());
 const markOgFailed = useCallback((topic)=>setFailedOgImages(p=>new Set([...p,topic])),[]);

 // Online/offline + SW registration
 const [isOnline, setIsOnline] = useState(true);
 useEffect(()=>{
   if('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(()=>{});
   setIsOnline(navigator.onLine);
   const go=()=>setIsOnline(true);
   const bye=()=>setIsOnline(false);
   window.addEventListener('online', go);
   window.addEventListener('offline', bye);
   return()=>{ window.removeEventListener('online', go); window.removeEventListener('offline', bye); };
 },[]);

 // Pull-to-refresh
 const [ptrState, setPtrState] = useState("idle"); // idle | pulling | refreshing
 const ptrStartY = useRef(0);
 const ptrDist = useRef(0);
 const PTR_THRESHOLD = 72;

 const [input, setInput] = useState("");
 const [phase, setPhase] = useState("idle");
 const [cooldown, setCooldown] = useState(0);
 const [brief, setBrief] = useState(null);
 const [ogImages, setOgImages] = useState({});
 const [steps, setSteps] = useState([]);
 const [modal, setModal] = useState(false);
 const [toast, setToast] = useState("");
 const [showEditor, setShowEditor] = useState(false);
 const [settings, setSettings] = useState({time:"06:30",email:"",fmt:"standard",days:"Every day"});
 const [detectedTz, setDetectedTz] = useState("");
 const briefRef = useRef(null);
 const builderRef = useRef(null);
 const today = new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"});

 // Weather
 const [wx, setWx] = useState("idle"); // idle | asking | loading | data | denied
 const [wUnit, setWUnit] = useState("F");
 const c2f = c => Math.round(c*9/5+32);
 const showT = c => wUnit==="F" ? c2f(c)+" F" : Math.round(c)+" C";
 const showTN = c => wUnit==="F" ? c2f(c) : Math.round(c);
 const wIcon = code => {if(code<=1)return"Clear";if(code<=3)return"Partly Cloudy";if(code<=48)return"Foggy";if(code<=55)return"Drizzle";if(code<=65)return"Rain";if(code<=77)return"Snow";if(code<=82)return"Showers";return"Storm";};
 const wDesc = code => {if(code<=1)return"Clear skies";if(code<=3)return"Partly cloudy";if(code<=48)return"Foggy";if(code<=55)return"Drizzle";if(code<=65)return"Rain";if(code<=77)return"Snow";if(code<=82)return"Showers";return"Thunderstorm";};

 // Weather search state for home widget
 const [wxIn, setWxIn] = useState("");
 const [wxSuggs, setWxSuggs] = useState([]);

 const searchCities = val => {
   setWxIn(val);
   if(val.trim().length<1){setWxSuggs([]);return;}
   const q=val.toLowerCase().trim();
   setWxSuggs(CITIES.filter(c=>c.n.toLowerCase().startsWith(q)||c.n.toLowerCase().includes(q)).sort((a,b)=>{const as=a.n.toLowerCase().startsWith(q)?0:1,bs=b.n.toLowerCase().startsWith(q)?0:1;return as-bs||a.n.localeCompare(b.n);}).slice(0,6));
 };

 const pickCity = async city => {
   setWxSuggs([]);
   setWxIn([city.n,city.s,city.c].filter(Boolean).join(", "));
   fetchWxByCoords(city.lat, city.lon, [city.n,city.s,city.c].filter(Boolean).join(", "));
 };


 const fetchWxByCoords = async (lat, lon, label) => {
 setWx("loading");
 try {
 const r = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
 const d = await r.json();
 const cur = d.current;
 const nowH = new Date().getHours();
 const hrs = [];
 for(let i=0; i<d.hourly.time.length && hrs.length<6; i++){
 const hh = new Date(d.hourly.time[i]).getHours();
 if(hh >= nowH){
 const l = hh===0?"12am":hh<12?hh+"am":hh===12?"12pm":(hh-12)+"pm";
 hrs.push({label:l, tempC:d.hourly.temperature_2m[i], code:d.hourly.weathercode[i]});
 }
 }
 setWx({
 city: label,
 tempC: cur.temperature_2m, feelsC: cur.apparent_temperature,
 wind: Math.round(cur.windspeed_10m * 0.621),
 humidity: cur.relativehumidity_2m, code: cur.weathercode, hrs
 });
 } catch(e) { setWx("denied"); }
 };

 const requestLocation = () => {
 if(!navigator.geolocation){ setWx("denied"); return; }
 setWx("loading");
 navigator.geolocation.getCurrentPosition(
 async pos => {
 const {latitude:lat, longitude:lon} = pos.coords;
 // reverse geocode city name via nominatim
 let label = "Your Location";
 try {
 const g = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
 const gd = await g.json();
 const city = gd.address?.city || gd.address?.town || gd.address?.village || gd.address?.county || "Your Location";
 const state = gd.address?.state_code || gd.address?.state || "";
 label = state ? `${city}, ${state}` : city;
 } catch(e) {}
 fetchWxByCoords(lat, lon, label);
 },
 () => setWx("denied")
 );
 };

 // Auto-ask when weather tab is opened
 useEffect(() => {
 if(tab === "weather" && wx === "idle") setWx("asking");
 }, [tab]);

 // Scores
 // Inline scores for brief — auto-fetch when sport topics in brief
 const [briefScores, setBriefScores] = useState({});
 const SPORT_MAP = {
   "nfl":"football/nfl","nba":"basketball/nba","nhl":"hockey/nhl","mlb":"baseball/mlb",
   "wnba":"basketball/wnba","nfl football":"football/nfl","nba basketball":"basketball/nba",
   "college football":"football/college-football","ncaa football":"football/college-football",
   "college basketball":"basketball/mens-college-basketball","ncaa basketball":"basketball/mens-college-basketball",
   "mls":"soccer/usa.1","epl":"soccer/eng.1","premier league":"soccer/eng.1",
   "champions league":"soccer/uefa.champions","la liga":"soccer/esp.1",
   "bundesliga":"soccer/ger.1","formula 1":"racing/f1","f1":"racing/f1",
   "pga":"golf/pga","golf":"golf/pga","lpga":"golf/lpga",
   "ufc":"mma/ufc","mma":"mma/ufc",
 };
 const detectSports = (topicList) => {
   const found = [];
   topicList.forEach(t => {
     const key = t.toLowerCase().trim();
     if (SPORT_MAP[key] && !found.find(f=>f.path===SPORT_MAP[key])) {
       found.push({label:t, path:SPORT_MAP[key]});
     } else {
       Object.entries(SPORT_MAP).forEach(([k,v]) => {
         if (key.includes(k) && !found.find(f=>f.path===v)) found.push({label:t,path:v});
       });
     }
   });
   return found;
 };
 const fetchBriefScores = async (topicList) => {
   const sports = detectSports(topicList);
   if (!sports.length) { setBriefScores({}); return; }
   const results = {};
   await Promise.all(sports.map(async s => {
     try {
       const r = await fetch("/api/scores?sport="+encodeURIComponent(s.path));
       const d = await r.json();
       const games = (d?.events||[]).slice(0,6).map(ev => {
         const comps=ev.competitions?.[0]; const teams=comps?.competitors||[];
         const home=teams.find(t=>t.homeAway==="home")||teams[0];
         const away=teams.find(t=>t.homeAway==="away")||teams[1];
         const stype=comps?.status?.type?.name||"";
         return {
           home:home?.team?.shortDisplayName||home?.team?.name||"Home",
           away:away?.team?.shortDisplayName||away?.team?.name||"Away",
           homeScore:home?.score??null, awayScore:away?.score??null,
           status:stype==="STATUS_IN_PROGRESS"?"LIVE":stype==="STATUS_FINAL"?"FINAL":"UPCOMING",
           detail:comps?.status?.type?.shortDetail||"",
         };
       });
       if (games.length) results[s.label] = games;
     } catch(e) {}
   }));
   setBriefScores(results);
 };

 // Brief markets — auto-fetch when market/finance topics in brief
 const [briefMarkets, setBriefMarkets] = useState(null);
 const BRIEF_MARKET_TICKERS = ["^GSPC","^DJI","^IXIC","GC=F","CL=F","BTC-USD","ETH-USD"];
 const MARKET_KEYWORDS = ["market","stock","finance","invest","nasdaq","dow","s&p","nyse","wall street","crypto","bitcoin","commodit","oil","gold","trading","equit","fund","bond","treasury","federal reserve","fed ","interest rate","inflation","economy","economic"];
 const detectMarkets = (topicList) => topicList.some(t => MARKET_KEYWORDS.some(k => t.toLowerCase().includes(k)));
 const fetchBriefMarkets = async () => {
   try {
     const res = await fetch("/api/markets?tickers="+BRIEF_MARKET_TICKERS.map(encodeURIComponent).join(","));
     const data = await res.json();
     setBriefMarkets(data);
   } catch(e) { console.error(e); }
 };
 // Auto-refresh markets every 60s when brief is visible
 useEffect(()=>{
   if(!briefMarkets) return;
   const interval = setInterval(()=>fetchBriefMarkets(), 60000);
   return ()=>clearInterval(interval);
 },[briefMarkets]);

 // News
 const MAX_TOPICS = 5;
 const addTopic = name=>{
   const v=(name||input).trim();
   if(!v||topics.includes(v))return;
   if(topics.length>=MAX_TOPICS){showToast("Free plan is limited to 10 topics — remove one to add another");return;}
   setTopics(p=>[...p,v]);setInput("");
 };
 const rmTopic = t=>setTopics(p=>p.filter(x=>x!==t));
 const togSugg = n=>topics.includes(n)?rmTopic(n):addTopic(n);
 const showToast= msg=>{setToast(msg);setTimeout(()=>setToast(""),4000);};
 const SOURCE_COLORS = {
   "ap": "#c8102e", "associated press": "#c8102e", "ap news": "#c8102e",
   "reuters": "#f60", "bbc": "#b80000", "bbc news": "#b80000",
   "npr": "#4a90d9", "pbs": "#00a650", "pbs newshour": "#00a650",
   "nbc news": "#faa619", "nbc": "#faa619",
   "abc news": "#00438a", "abc": "#00438a",
   "cbs news": "#006db7", "cbs": "#006db7",
   "wsj": "#0274b6", "wall street journal": "#0274b6",
   "bloomberg": "#f60", "axios": "#ff4500",
   "the guardian": "#052962", "guardian": "#052962",
   "politico": "#007dc5", "c-span": "#064a87",
   "cnbc": "#005594", "financial times": "#c8102e",
   "espn": "#cc0000", "the athletic": "#1a1a1a", "athletic": "#1a1a1a",
   "techcrunch": "#0a0a0a", "the verge": "#e4192c", "verge": "#e4192c",
   "wired": "#000", "ars technica": "#f60",
 };
 const SOURCE_DOMAINS = {
   // Wire services
   "ap":"apnews.com","associated press":"apnews.com","ap news":"apnews.com",
   "reuters":"reuters.com","afp":"afp.com","agence france-presse":"afp.com",
   // Public broadcast
   "npr":"npr.org","pbs":"pbs.org","pbs newshour":"pbs.org","c-span":"c-span.org","c span":"c-span.org",
   "bbc":"bbc.com","bbc news":"bbc.com","bbc sport":"bbc.com","bbc sports":"bbc.com",
   // US broadcast networks
   "nbc news":"nbcnews.com","nbc":"nbcnews.com","nbc nightly news":"nbcnews.com","nbc sports":"nbcsports.com",
   "abc news":"abcnews.go.com","abc":"abcnews.go.com","abc sports":"espn.com",
   "cbs news":"cbsnews.com","cbs":"cbsnews.com","cbs evening news":"cbsnews.com",
   "cbs sports":"cbssports.com","cbs sports hq":"cbssports.com",
   "cnn":"cnn.com","cnn politics":"cnn.com","cnn business":"cnn.com","cnn sport":"cnn.com",
   "fox news":"foxnews.com","fox":"foxnews.com","fox business":"foxbusiness.com","fox sports":"foxsports.com",
   "msnbc":"msnbc.com","pbs frontline":"pbs.org",
   // Print / digital nationals
   "wsj":"wsj.com","wall street journal":"wsj.com","the wall street journal":"wsj.com",
   "new york times":"nytimes.com","the new york times":"nytimes.com","nyt":"nytimes.com",
   "washington post":"washingtonpost.com","the washington post":"washingtonpost.com","wapo":"washingtonpost.com",
   "usa today":"usatoday.com","los angeles times":"latimes.com","la times":"latimes.com",
   "new york post":"nypost.com","ny post":"nypost.com",
   "chicago tribune":"chicagotribune.com","boston globe":"bostonglobe.com",
   "miami herald":"miamiherald.com","dallas morning news":"dallasnews.com",
   "houston chronicle":"houstonchronicle.com","seattle times":"seattletimes.com",
   "san francisco chronicle":"sfchronicle.com","denver post":"denverpost.com",
   "philadelphia inquirer":"inquirer.com","star tribune":"startribune.com",
   "new york daily news":"nydailynews.com","nydn":"nydailynews.com",
   "minneapolis star tribune":"startribune.com","detroit free press":"freep.com",
   // Magazines / digital
   "time":"time.com","newsweek":"newsweek.com","the atlantic":"theatlantic.com","atlantic":"theatlantic.com",
   "new yorker":"newyorker.com","the new yorker":"newyorker.com",
   "rolling stone":"rollingstone.com","people":"people.com","variety":"variety.com",
   "entertainment weekly":"ew.com","vulture":"vulture.com","deadline":"deadline.com",
   "hollywood reporter":"hollywoodreporter.com","thr":"hollywoodreporter.com",
   // Digital natives
   "axios":"axios.com","vox":"vox.com","the verge":"theverge.com","verge":"theverge.com",
   "bloomberg":"bloomberg.com","bloomberg news":"bloomberg.com","bloomberg businessweek":"bloomberg.com",
   "business insider":"businessinsider.com","insider":"insider.com",
   "huffpost":"huffpost.com","huffington post":"huffpost.com",
   "politico":"politico.com","the hill":"thehill.com","hill":"thehill.com",
   "the guardian":"theguardian.com","guardian":"theguardian.com",
   "vice":"vice.com","vice news":"vice.com","slate":"slate.com",
   "salon":"salon.com","daily beast":"thedailybeast.com","the daily beast":"thedailybeast.com",
   "mother jones":"motherjones.com","propublica":"propublica.org","the intercept":"theintercept.com",
   "national review":"nationalreview.com","reason":"reason.com",
   "foreign policy":"foreignpolicy.com","foreign affairs":"foreignaffairs.com",
   "the dispatch":"thedispatch.com","dispatch":"thedispatch.com",
   "mediaite":"mediaite.com","rawstory":"rawstory.com","raw story":"rawstory.com",
   // Finance / business
   "cnbc":"cnbc.com","financial times":"ft.com","ft":"ft.com",
   "fortune":"fortune.com","forbes":"forbes.com","barron's":"barrons.com","barrons":"barrons.com",
   "marketwatch":"marketwatch.com","market watch":"marketwatch.com",
   "the economist":"economist.com","economist":"economist.com",
   "investopedia":"investopedia.com","seeking alpha":"seekingalpha.com",
   "yahoo finance":"finance.yahoo.com","yahoo news":"yahoo.com","yahoo":"yahoo.com",
   "morningstar":"morningstar.com","coindesk":"coindesk.com","coin desk":"coindesk.com",
   "cointelegraph":"cointelegraph.com","decrypt":"decrypt.co",
   // Tech
   "techcrunch":"techcrunch.com","wired":"wired.com","ars technica":"arstechnica.com",
   "the information":"theinformation.com","recode":"vox.com",
   "engadget":"engadget.com","9to5mac":"9to5mac.com","macrumors":"macrumors.com",
   "android police":"androidpolice.com","gsmarena":"gsmarena.com",
   "zdnet":"zdnet.com","cnet":"cnet.com","pcmag":"pcmag.com","tom's guide":"tomsguide.com",
   "mit technology review":"technologyreview.com","technology review":"technologyreview.com",
   "the register":"theregister.com","register":"theregister.com",
   "venturebeat":"venturebeat.com","venture beat":"venturebeat.com",
   "gizmodo":"gizmodo.com","lifehacker":"lifehacker.com","kotaku":"kotaku.com",
   "android authority":"androidauthority.com","xda":"xda-developers.com","xda developers":"xda-developers.com",
   "slashdot":"slashdot.org","hacker news":"news.ycombinator.com",
   // Sports — main
   "espn":"espn.com","the athletic":"theathletic.com","athletic":"theathletic.com",
   "sports illustrated":"si.com","bleacher report":"bleacherreport.com",
   "nfl.com":"nfl.com","nba.com":"nba.com","mlb.com":"mlb.com","nhl.com":"nhl.com",
   "golf digest":"golfdigest.com","golf channel":"golfchannel.com","golfweek":"golfweek.com",
   "tennis.com":"tennis.com","tennis channel":"tennischannel.com",
   "sky sports":"skysports.com","goal":"goal.com","the score":"thescore.com","score":"thescore.com",
   "mlssoccer":"mlssoccer.com","mls":"mlssoccer.com",
   "pga tour":"pgatour.com","lpga":"lpga.com","masters":"masters.com",
   "ufc":"ufc.com","bellator":"bellator.com","one championship":"onefc.com",
   "formula 1":"formula1.com","f1":"formula1.com","motorsport":"motorsport.com",
   "nascar":"nascar.com","indycar":"indycar.com","motogp":"motogp.com",
   "nbc sports":"nbcsports.com","turner sports":"nba.com","sportsline":"sportsline.com",
   "deadspin":"deadspin.com","fivethirtyeight":"fivethirtyeight.com","538":"fivethirtyeight.com",
   "pro football reference":"pro-football-reference.com","baseball reference":"baseball-reference.com",
   // Science / health
   "nature":"nature.com","science":"science.org","scientific american":"scientificamerican.com",
   "stat news":"statnews.com","stat":"statnews.com","medscape":"medscape.com",
   "mayo clinic":"mayoclinic.org","webmd":"webmd.com","healthline":"healthline.com",
   "new england journal of medicine":"nejm.org","nejm":"nejm.org",
   "the lancet":"thelancet.com","lancet":"thelancet.com","jama":"jamanetwork.com",
   "nih":"nih.gov","cdc":"cdc.gov","who":"who.int","fda":"fda.gov",
   "harvard health":"health.harvard.edu","cleveland clinic":"health.clevelandclinic.org",
   // International
   "al jazeera":"aljazeera.com","the times":"thetimes.co.uk","sky news":"skynews.com",
   "the independent":"independent.co.uk","independent":"independent.co.uk",
   "daily mail":"dailymail.co.uk","the telegraph":"telegraph.co.uk","telegraph":"telegraph.co.uk",
   "south china morning post":"scmp.com","scmp":"scmp.com","nikkei":"nikkei.com",
   "the sun":"thesun.co.uk","daily express":"express.co.uk","the mirror":"mirror.co.uk",
   "le monde":"lemonde.fr","der spiegel":"spiegel.de","the japan times":"japantimes.co.jp",
   "globo":"globo.com","euronews":"euronews.com","france 24":"france24.com",
   "dw":"dw.com","deutsche welle":"dw.com","rt":"rt.com",
   // Lifestyle
   "bon appétit":"bonappetit.com","bon appetit":"bonappetit.com","epicurious":"epicurious.com",
   "food network":"foodnetwork.com","eater":"eater.com","serious eats":"seriouseats.com",
   "architectural digest":"architecturaldigest.com","ad":"architecturaldigest.com",
   "house beautiful":"housebeautiful.com","better homes and gardens":"bhg.com",
   "condé nast traveler":"cntraveler.com","travel + leisure":"travelandleisure.com",
   "vogue":"vogue.com","gq":"gq.com","esquire":"esquire.com","elle":"elle.com",
   "harper's bazaar":"harpersbazaar.com","marie claire":"marieclaire.com",
   "cosmopolitan":"cosmopolitan.com","glamour":"glamour.com","allure":"allure.com",
   "men's health":"menshealth.com","women's health":"womenshealthmag.com",
   "shape":"shape.com","prevention":"prevention.com","self":"self.com",
   // Real estate / finance
   "zillow":"zillow.com","realtor.com":"realtor.com","redfin":"redfin.com",
   "bankrate":"bankrate.com","nerdwallet":"nerdwallet.com","the motley fool":"fool.com",
   "motley fool":"fool.com","kiplinger":"kiplinger.com",
 };
 const TOPIC_GRADIENTS = {
   "world news":["#0a1628","#1a3a6b"],"us politics":["#150a28","#3d1a6b"],
   "politics":["#150a28","#3d1a6b"],"tech & ai":["#051520","#0d4060"],
   "technology":["#051520","#0d4060"],"markets":["#051a0a","#0a4520"],
   "stock market":["#051a0a","#0a4520"],"business":["#0d1505","#264508"],
   "nba":["#0a0a1a","#1d3461"],"nfl":["#0a0a1a","#013369"],
   "mlb":["#0a1205","#0d3d1a"],"nhl":["#050a1a","#0d2561"],
   "sports":["#1a0505","#6b1010"],"soccer":["#051a0a","#1a6b1a"],
   "formula 1":["#1a0505","#c8102e"],"formula one":["#1a0505","#c8102e"],
   "health":["#05151a","#0a4040"],"health & wellness":["#05151a","#0a4040"],
   "science":["#05081a","#1a2566"],"climate":["#05150a","#1a6b2a"],
   "entertainment":["#1a0510","#6b1a40"],"film & tv":["#1a0510","#6b1a40"],
   "music":["#150a28","#5a1a8b"],"crypto":["#1a1205","#6b4a0a"],
   "real estate":["#0a0d1a","#1a2d5a"],"travel":["#050f1a","#0a3050"],
   "fashion & style":["#1a051a","#6b0a6b"],"food & dining":["#1a0a05","#6b3010"],
   "personal finance":["#051a0a","#0a4520"],"mental health":["#051520","#0a406b"],
 };
 const getTopicGradient = (topic) => {
   const c = TOPIC_GRADIENTS[(topic||"").toLowerCase().trim()] || ["#0a0f1e","#1a2a50"];
   return `linear-gradient(135deg, ${c[0]} 0%, ${c[1]} 100%)`;
 };

 // Client-side topic images — always available instantly, no API needed
 const CLIENT_TOPIC_IMAGES = {
   "world news":      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&q=80",
   "us politics":     "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=900&q=80",
   "politics":        "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=900&q=80",
   "tech & ai":       "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=900&q=80",
   "technology":      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=900&q=80",
   "markets":         "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900&q=80",
   "stock market":    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900&q=80",
   "business":        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80",
   "nba":             "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=900&q=80",
   "nfl":             "https://images.unsplash.com/photo-1567459169568-e1b872a93ec0?w=900&q=80",
   "mlb":             "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=900&q=80",
   "nhl":             "https://images.unsplash.com/photo-1580420919917-b3e0e0b8943c?w=900&q=80",
   "sports":          "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=900&q=80",
   "soccer":          "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=900&q=80",
   "formula 1":       "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&q=80",
   "formula one":     "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&q=80",
   "health":          "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=900&q=80",
   "health & wellness":"https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=900&q=80",
   "science":         "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=900&q=80",
   "climate":         "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=900&q=80",
   "entertainment":   "https://images.unsplash.com/photo-1603739903239-8b6e64c3b185?w=900&q=80",
   "film & tv":       "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=900&q=80",
   "music":           "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&q=80",
   "crypto":          "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=900&q=80",
   "real estate":     "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=80",
   "travel":          "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&q=80",
   "fashion & style": "https://images.unsplash.com/photo-1445205170230-053b83016050?w=900&q=80",
   "food & dining":   "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80",
   "personal finance":"https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=900&q=80",
   "mental health":   "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=900&q=80",
   "mma / ufc":       "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=900&q=80",
   "mma":             "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=900&q=80",
   "ufc":             "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=900&q=80",
   "golf":            "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=900&q=80",
   "tennis":          "https://images.unsplash.com/photo-1542144582-1ba00456b5e3?w=900&q=80",
   "education":       "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&q=80",
   "auto & evs":      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
   "gaming":          "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=900&q=80",
   "space":           "https://images.unsplash.com/photo-1446776709462-d6b525c57bd3?w=900&q=80",
   "economy":         "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900&q=80",
 };
 const getTopicImage = (topic) => CLIENT_TOPIC_IMAGES[(topic||"").toLowerCase().trim()] || null;

 // Source abbreviations + brand colors — no external API needed, always renders instantly
 const SOURCE_META = {
   // Wire
   "ap":{abbr:"AP",color:"#1a1a1a"},"associated press":{abbr:"AP",color:"#1a1a1a"},"ap news":{abbr:"AP",color:"#1a1a1a"},
   "reuters":{abbr:"Reuters",color:"#ff6200"},"afp":{abbr:"AFP",color:"#003399"},
   // Public broadcast
   "npr":{abbr:"NPR",color:"#1e4d8c"},"pbs":{abbr:"PBS",color:"#1e4d8c"},"pbs newshour":{abbr:"PBS",color:"#1e4d8c"},
   "bbc":{abbr:"BBC",color:"#bb1919"},"bbc news":{abbr:"BBC",color:"#bb1919"},"bbc sport":{abbr:"BBC",color:"#bb1919"},
   "c-span":{abbr:"C-SPAN",color:"#0072ce"},"c span":{abbr:"C-SPAN",color:"#0072ce"},
   // US TV networks
   "nbc news":{abbr:"NBC",color:"#f37021"},"nbc":{abbr:"NBC",color:"#f37021"},"nbc nightly news":{abbr:"NBC",color:"#f37021"},
   "nbc sports":{abbr:"NBC Sports",color:"#003f87"},
   "abc news":{abbr:"ABC",color:"#1c2d6b"},"abc":{abbr:"ABC",color:"#1c2d6b"},
   "cbs news":{abbr:"CBS",color:"#0033a0"},"cbs":{abbr:"CBS",color:"#0033a0"},"cbs evening news":{abbr:"CBS",color:"#0033a0"},
   "cbs sports":{abbr:"CBS Sports",color:"#223f99"},"cbs sports hq":{abbr:"CBS Sports",color:"#223f99"},
   "cnn":{abbr:"CNN",color:"#cc0000"},"cnn politics":{abbr:"CNN",color:"#cc0000"},"cnn business":{abbr:"CNN",color:"#cc0000"},
   "fox news":{abbr:"Fox News",color:"#003366"},"fox":{abbr:"Fox",color:"#003366"},"fox business":{abbr:"Fox Business",color:"#003366"},
   "fox sports":{abbr:"Fox Sports",color:"#002244"},
   "msnbc":{abbr:"MSNBC",color:"#00529b"},
   // Print nationals
   "wsj":{abbr:"WSJ",color:"#1a1a1a"},"wall street journal":{abbr:"WSJ",color:"#1a1a1a"},"the wall street journal":{abbr:"WSJ",color:"#1a1a1a"},
   "new york times":{abbr:"NYT",color:"#1a1a1a"},"the new york times":{abbr:"NYT",color:"#1a1a1a"},"nyt":{abbr:"NYT",color:"#1a1a1a"},
   "washington post":{abbr:"WaPo",color:"#1a1a1a"},"the washington post":{abbr:"WaPo",color:"#1a1a1a"},"wapo":{abbr:"WaPo",color:"#1a1a1a"},
   "usa today":{abbr:"USA Today",color:"#009bde"},
   "los angeles times":{abbr:"LA Times",color:"#1a1a1a"},"la times":{abbr:"LA Times",color:"#1a1a1a"},
   "new york post":{abbr:"NY Post",color:"#cc0000"},"ny post":{abbr:"NY Post",color:"#cc0000"},
   "chicago tribune":{abbr:"Tribune",color:"#cc0000"},"boston globe":{abbr:"Globe",color:"#1a1a1a"},
   // Digital
   "axios":{abbr:"Axios",color:"#ff4e45"},"vox":{abbr:"Vox",color:"#f7df1e"},
   "the verge":{abbr:"Verge",color:"#fa4848"},"verge":{abbr:"Verge",color:"#fa4848"},
   "bloomberg":{abbr:"Bloomberg",color:"#1a1a1a"},"bloomberg news":{abbr:"Bloomberg",color:"#1a1a1a"},
   "the guardian":{abbr:"Guardian",color:"#052962"},"guardian":{abbr:"Guardian",color:"#052962"},
   "politico":{abbr:"Politico",color:"#cc0000"},"the hill":{abbr:"The Hill",color:"#1a1a1a"},"hill":{abbr:"The Hill",color:"#1a1a1a"},
   "huffpost":{abbr:"HuffPost",color:"#00857c"},"huffington post":{abbr:"HuffPost",color:"#00857c"},
   "business insider":{abbr:"BI",color:"#1a1a1a"},"insider":{abbr:"Insider",color:"#1a1a1a"},
   "vice":{abbr:"Vice",color:"#1a1a1a"},"vice news":{abbr:"Vice",color:"#1a1a1a"},
   "slate":{abbr:"Slate",color:"#1a1a1a"},"propublica":{abbr:"ProPublica",color:"#5a2d82"},
   // Finance
   "cnbc":{abbr:"CNBC",color:"#1a7ac8"},"financial times":{abbr:"FT",color:"#fff1e5"},"ft":{abbr:"FT",color:"#fff1e5"},
   "fortune":{abbr:"Fortune",color:"#1a1a1a"},"forbes":{abbr:"Forbes",color:"#1a1a1a"},
   "barron's":{abbr:"Barron's",color:"#1a1a1a"},"barrons":{abbr:"Barron's",color:"#1a1a1a"},
   "marketwatch":{abbr:"MarketWatch",color:"#1a1a1a"},"market watch":{abbr:"MarketWatch",color:"#1a1a1a"},
   "the economist":{abbr:"Economist",color:"#e3120b"},"economist":{abbr:"Economist",color:"#e3120b"},
   "yahoo finance":{abbr:"Yahoo Finance",color:"#6001d2"},"yahoo news":{abbr:"Yahoo",color:"#6001d2"},"yahoo":{abbr:"Yahoo",color:"#6001d2"},
   "coindesk":{abbr:"CoinDesk",color:"#1652f0"},"cointelegraph":{abbr:"CT",color:"#4cae99"},
   // Tech
   "techcrunch":{abbr:"TechCrunch",color:"#0a8f08"},"wired":{abbr:"Wired",color:"#1a1a1a"},
   "ars technica":{abbr:"Ars",color:"#f04800"},"the information":{abbr:"The Information",color:"#1a1a1a"},
   "engadget":{abbr:"Engadget",color:"#cc0000"},"9to5mac":{abbr:"9to5Mac",color:"#1a1a1a"},
   "macrumors":{abbr:"MacRumors",color:"#cc0000"},"zdnet":{abbr:"ZDNet",color:"#cc0000"},
   "cnet":{abbr:"CNET",color:"#cc0000"},"pcmag":{abbr:"PCMag",color:"#cc0000"},
   "venturebeat":{abbr:"VentureBeat",color:"#cc0000"},"gizmodo":{abbr:"Gizmodo",color:"#1a1a1a"},
   "mit technology review":{abbr:"MIT Tech Review",color:"#a31f34"},"technology review":{abbr:"MIT Tech Review",color:"#a31f34"},
   // Sports
   "espn":{abbr:"ESPN",color:"#d50a0a"},"the athletic":{abbr:"Athletic",color:"#1a1a1a"},"athletic":{abbr:"Athletic",color:"#1a1a1a"},
   "sports illustrated":{abbr:"SI",color:"#cc0000"},"bleacher report":{abbr:"BR",color:"#cc0000"},
   "nfl.com":{abbr:"NFL",color:"#013369"},"nba.com":{abbr:"NBA",color:"#17408b"},"mlb.com":{abbr:"MLB",color:"#002d72"},"nhl.com":{abbr:"NHL",color:"#000080"},
   "golf digest":{abbr:"Golf Digest",color:"#1a4a1a"},"golf channel":{abbr:"Golf Channel",color:"#005c39"},
   "sky sports":{abbr:"Sky Sports",color:"#00a6e2"},"goal":{abbr:"Goal",color:"#1a1a1a"},
   "the score":{abbr:"The Score",color:"#e5231b"},"score":{abbr:"The Score",color:"#e5231b"},
   "nbc sports":{abbr:"NBC Sports",color:"#003f87"},"deadspin":{abbr:"Deadspin",color:"#1a1a1a"},
   "formula 1":{abbr:"F1",color:"#e10600"},"f1":{abbr:"F1",color:"#e10600"},"motorsport":{abbr:"Motorsport",color:"#cc0000"},
   "nascar":{abbr:"NASCAR",color:"#ffd700"},"ufc":{abbr:"UFC",color:"#d20a0a"},
   // Health / Science
   "nature":{abbr:"Nature",color:"#005c8a"},"scientific american":{abbr:"Sci Am",color:"#cc6600"},
   "stat news":{abbr:"STAT",color:"#1a1a1a"},"stat":{abbr:"STAT",color:"#1a1a1a"},
   "mayo clinic":{abbr:"Mayo Clinic",color:"#00558c"},"webmd":{abbr:"WebMD",color:"#00558c"},
   "healthline":{abbr:"Healthline",color:"#1c6b4a"},"nejm":{abbr:"NEJM",color:"#cc0000"},
   // International
   "al jazeera":{abbr:"Al Jazeera",color:"#cc0000"},"sky news":{abbr:"Sky News",color:"#0072c6"},
   "the independent":{abbr:"Independent",color:"#cc0000"},"independent":{abbr:"Independent",color:"#cc0000"},
   "daily mail":{abbr:"Daily Mail",color:"#cc0000"},"the telegraph":{abbr:"Telegraph",color:"#1a1a1a"},"telegraph":{abbr:"Telegraph",color:"#1a1a1a"},
   "south china morning post":{abbr:"SCMP",color:"#cc0000"},"scmp":{abbr:"SCMP",color:"#cc0000"},
   "euronews":{abbr:"Euronews",color:"#00489c"},"france 24":{abbr:"France 24",color:"#00489c"},
   "dw":{abbr:"DW",color:"#c72730"},"deutsche welle":{abbr:"DW",color:"#c72730"},
   // Entertainment
   "variety":{abbr:"Variety",color:"#7b2d8b"},"deadline":{abbr:"Deadline",color:"#cc0000"},
   "hollywood reporter":{abbr:"THR",color:"#cc0000"},"thr":{abbr:"THR",color:"#cc0000"},
   "rolling stone":{abbr:"Rolling Stone",color:"#cc0000"},"people":{abbr:"People",color:"#cc0000"},
   "vulture":{abbr:"Vulture",color:"#007f6e"},"entertainment weekly":{abbr:"EW",color:"#cc0000"},
 };

 const SourceLogo = ({source, dark=false}) => {
   const key = (source||'').toLowerCase().trim();
   // Look up meta: try exact key, then strip "The ", then keyword fallbacks
   let meta = SOURCE_META[key] || SOURCE_META[key.replace(/^the\s+/,'')];
   if (!meta) {
     if (/\bcbs\s*sports\b/i.test(key)) meta = SOURCE_META["cbs sports"];
     else if (/\bnbc\s*sports\b/i.test(key)) meta = SOURCE_META["nbc sports"];
     else if (/\bfox\s*sports\b/i.test(key)) meta = {abbr:"Fox Sports",color:"#002244"};
     else if (/\bcbs\s*news\b|\bcbs\b/i.test(key)) meta = SOURCE_META["cbs news"];
     else if (/\bnbc\s*news\b|\bnbc\b/i.test(key)) meta = SOURCE_META["nbc news"];
     else if (/\babc\s*news\b|\babc\b/i.test(key)) meta = SOURCE_META["abc news"];
     else if (/\bfox\s*news\b/i.test(key)) meta = SOURCE_META["fox news"];
     else if (/\bfox\b/i.test(key)) meta = SOURCE_META["fox"];
     else if (/\bcnn\b/i.test(key)) meta = SOURCE_META["cnn"];
     else if (/\bmsnbc\b/i.test(key)) meta = SOURCE_META["msnbc"];
     else if (/\bespn\b/i.test(key)) meta = SOURCE_META["espn"];
     else if (/\bbloomberg\b/i.test(key)) meta = SOURCE_META["bloomberg"];
     else if (/\breuters\b/i.test(key)) meta = SOURCE_META["reuters"];
     else if (/\b(ap|associated press)\b/i.test(key)) meta = SOURCE_META["ap"];
     else if (/\bnpr\b/i.test(key)) meta = SOURCE_META["npr"];
     else if (/\bbbc\b/i.test(key)) meta = SOURCE_META["bbc"];
     else if (/\bwsj\b/i.test(key)) meta = SOURCE_META["wsj"];
     else if (/\bnyt\b|\bnew york times\b/i.test(key)) meta = SOURCE_META["nyt"];
     else if (/\bguardian\b/i.test(key)) meta = SOURCE_META["guardian"];
     else if (/\bpolitico\b/i.test(key)) meta = SOURCE_META["politico"];
     else if (/\baxios\b/i.test(key)) meta = SOURCE_META["axios"];
     else if (/\bverge\b/i.test(key)) meta = SOURCE_META["verge"];
     else if (/\bathletic\b/i.test(key)) meta = SOURCE_META["athletic"];
     else if (/\bcnbc\b/i.test(key)) meta = SOURCE_META["cnbc"];
     else if (/\bforbes\b/i.test(key)) meta = SOURCE_META["forbes"];
     else if (/\bfortune\b/i.test(key)) meta = SOURCE_META["fortune"];
     else if (/\bnba\b/i.test(key)) meta = SOURCE_META["nba.com"];
     else if (/\bnfl\b/i.test(key)) meta = SOURCE_META["nfl.com"];
     else if (/\bmlb\b/i.test(key)) meta = SOURCE_META["mlb.com"];
     else if (/\bnhl\b/i.test(key)) meta = SOURCE_META["nhl.com"];
   }
   const abbr = meta?.abbr || (source ? source.replace(/^[Tt]he /i,'').slice(0,12) : '?');
   const brandColor = meta?.color || "#6b7280";
   if (dark) {
     // On dark hero: match the "LEAD STORY" badge style exactly — same class
     return (
       <span className="brief-feat-label" style={{color:'rgba(255,255,255,0.92)'}}>{abbr}</span>
     );
   }
   // Light mode: colored text on tinted background
   const pillBg = brandColor === "#1a1a1a" ? "#f3f4f6" : brandColor + "15";
   return (
     <span style={{display:'inline-flex',alignItems:'center',background:pillBg,borderRadius:5,padding:'3px 8px'}}>
       <span style={{fontSize:'0.55rem',fontWeight:800,letterSpacing:'0.06em',textTransform:'uppercase',color:brandColor,whiteSpace:'nowrap',lineHeight:1}}>{abbr}</span>
     </span>
   );
 };

 const clean = t=>(t||"").replace(/\*\*(.*?)\*\*/g,"$1").replace(/\*(.*?)\*/g,"$1").replace(/`([^`]+)`/g,"$1").replace(/^[-*]\s*/,"").trim();

 const generate = async () => {
   if(!topics.length){showToast("Add at least one topic first");return;}
   if(user) setTab("brief");
   setPhase("loading");setBrief(null);setSteps([]);setOgImages({});
   setIsStreaming(true);setStreamedCount(0);
   const stepMessages=["Searching live sources...","Scanning "+topics.length+" topic"+(topics.length>1?"s":"")+"...","Filtering for relevance...","Verifying source neutrality...","Writing your brief...","Almost ready..."];
   stepMessages.forEach((s,i)=>setTimeout(()=>setSteps(p=>[...p,s]),i*1800));
   try{
     const res=await fetch("/api/brief",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({topics,today})});
     if(!res.ok||!res.body)throw new Error(`HTTP ${res.status}`);
     const reader=res.body.getReader();
     const decoder=new TextDecoder();
     let buf="";
     let partialBrief={topics:[],headline:"Your Morning Brief"};
     let scrolled=false;
     while(true){
       const{done,value}=await reader.read();
       if(done)break;
       buf+=decoder.decode(value,{stream:true});
       const lines=buf.split("\n");
       buf=lines.pop()||"";
       for(const line of lines){
         if(!line.startsWith("data: "))continue;
         try{
           const msg=JSON.parse(line.slice(6));
           if(msg.type==="topic"){
             partialBrief={...partialBrief,topics:[...partialBrief.topics,msg.topic]};
             setBrief({...partialBrief});
             setStreamedCount(c=>c+1);
             setPhase("done"); // show UI as soon as first topic lands
             if(!scrolled){scrolled=true;setTimeout(()=>briefRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),100);}
           }else if(msg.type==="done"){
             partialBrief={...partialBrief,headline:msg.headline};
             setBrief({...partialBrief});
             setIsStreaming(false);
             saveUserData(partialBrief,topics);
             loadOgImages(partialBrief);
             try{localStorage.setItem("nh_pending_brief",JSON.stringify({brief:partialBrief,topics,ts:Date.now()}));}catch(_){}
             setCooldown(15);const cd=setInterval(()=>setCooldown(p=>{if(p<=1){clearInterval(cd);return 0;}return p-1;}),1000);
           }else if(msg.type==="error"){
             throw new Error(msg.message);
           }
         }catch(_){}
       }
     }
     setIsStreaming(false);
   }catch(err){
     setIsStreaming(false);
     setBrief({error:true,raw:String(err.message||err)});
     setPhase("done");
   }
 };

 const ExtIcon=()=>(<svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 2H2a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V7M7 1h4m0 0v4m0-4L5.5 6.5"/></svg>);

 // Daily Boost
  const [boost, setBoost]             = useState(null);
  const [boostLoading, setBoostLoading] = useState(false);
  const [boostError, setBoostError]     = useState(false);

  const fetchBoost = async () => {
    setBoostLoading(true); setBoostError(false);
    try {
      const res=await fetch("/api/boost");
      const parsed=await res.json();
      if(parsed.error)throw new Error(parsed.error);
      setBoost(parsed);
    } catch(err){ setBoostError(true); }
    setBoostLoading(false);
  };


  useEffect(()=>{
   const els=document.querySelectorAll('.anim');
   if(!els.length)return;
   const obs=new IntersectionObserver(entries=>{
     entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});
   },{threshold:0.12});
   els.forEach(el=>obs.observe(el));
   return()=>obs.disconnect();
 },[phase]);

 const ptrStart = useCallback((e)=>{
   if(window.scrollY===0) ptrStartY.current=e.touches[0].clientY;
 },[]);
 const ptrMove = useCallback((e)=>{
   if(!ptrStartY.current) return;
   const d=e.touches[0].clientY-ptrStartY.current;
   if(d>0&&window.scrollY===0){
     ptrDist.current=d;
     setPtrState(d>PTR_THRESHOLD?"pulling":"idle");
   }
 },[PTR_THRESHOLD]);
 const ptrEnd = useCallback(()=>{
   if(ptrDist.current>PTR_THRESHOLD&&phase!=="loading"&&tab==="brief"){
     setPtrState("refreshing");
     generate();
   } else {
     setPtrState("idle");
   }
   ptrStartY.current=0;
   ptrDist.current=0;
 },[generate,phase,tab,PTR_THRESHOLD]);

 useEffect(()=>{
   const onScroll=()=>{
     const tb=document.querySelector('.topbar');
     if(tb)tb.classList.toggle('scrolled',window.scrollY>10);
   };
   window.addEventListener('scroll',onScroll,{passive:true});
   return()=>window.removeEventListener('scroll',onScroll);
 },[]);

 const NAVS=[{id:"home",icon:"news",label:"Morning Brief"}];
 const PTITLES={home:"NewsHall"};
 const PSUBS={home:"Your morning news digest"};

 return (<>
 <style>{CSS}</style>

 <div className="topbar">
   <div className="tb-wordmark">
     <div className="tb-title">NewsHall</div>
     <div className="tb-edition">Morning Intelligence</div>
   </div>
   <div className="tb-auth">
     {user ? (
       <>
         <span className="auth-user">{user.user_metadata?.username||user.email?.split('@')[0]}</span>
         <button className="auth-btn auth-btn-out" onClick={signOut}>Sign out</button>
       </>
     ) : (
       <>
         <button className="auth-btn auth-btn-signin" onClick={()=>{setAuthModal('login');setAuthError('');}}>Sign in</button>
         <button className="auth-btn auth-btn-getstarted" onClick={()=>{setAuthModal('signup');setAuthError('');}}>Get started</button>
       </>
     )}
   </div>
 </div>

 {/* ── OFFLINE BANNER ── */}
 {!isOnline&&<div className="offline-bar">You're offline — showing your last saved brief</div>}

 {/* ── MAIN CONTENT ── */}
 {user ? (
 <>
 <div className="tab-body" onTouchStart={ptrStart} onTouchMove={ptrMove} onTouchEnd={ptrEnd}>

   {/* ── BRIEF TAB ── */}
   {tab==="brief"&&(<>
     {/* Pull-to-refresh indicator */}
     <div className={`ptr-wrap${ptrState!=="idle"?" visible":""}`}>
       {ptrState==="refreshing"
         ? <><div className="ptr-spinner"/><span>Refreshing…</span></>
         : <><span className={`ptr-arrow${ptrState==="pulling"?" ready":""}`}>↓</span><span>{ptrState==="pulling"?"Release to refresh":"Pull to refresh"}</span></>
       }
     </div>
     {phase==="loading"&&(
       <div className="loading">
         <div className="ld-orbs"><div className="ld-orb"/><div className="ld-orb"/><div className="ld-orb"/></div>
         <div className="ld-h">Building your Morning Brief</div>
         <div className="ld-s">Scanning live sources across {topics.length} topic{topics.length>1?"s":""}...</div>
         <div className="ld-bar-wrap"><div className="ld-bar"/></div>
         <div className="ld-topics">
           {topics.map((t,i)=>{const si=steps.length;const done=i<si-1;const scan=i===si-1||(!done&&i===0&&steps.length===0);return(<span key={t} className={`ld-topic-pill${scan?" scanning":done?" done":""}`} style={{animationDelay:`${i*0.1}s`}}><span className="ld-pill-dot"/>{t}</span>);})}
         </div>
         <div className="ld-steps">{steps.map((s,i)=><div key={i} className="ld-step">✓ {s}</div>)}</div>
       </div>
     )}
     {phase==="done"&&brief&&!brief.error&&(
       <div className="brief-tab-hd">
         <div>
           <div className="brief-tab-edition">Morning Brief</div>
           <div className="brief-tab-title">{brief.headline||"Your Morning Brief"}</div>
           <div className="brief-tab-sub">{topics.length} topic{topics.length!==1?"s":""} · {savedBriefMeta?new Date(savedBriefMeta.generated_at).toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"}):today}</div>
         </div>
         <button className="brief-refresh-btn" onClick={generate} disabled={isStreaming||cooldown>0}>{cooldown>0?`${cooldown}s`:"Refresh"}</button>
       </div>
     )}
     {isStreaming&&phase==="done"&&(
       <div style={{margin:'0 22px 10px',background:'var(--bg-2)',border:'1px solid var(--rule)',borderRadius:10,padding:'10px 16px',display:'flex',alignItems:'center',gap:12}}>
         <div style={{width:16,height:16,borderRadius:'50%',border:'2px solid var(--accent)',borderTopColor:'transparent',animation:'spin 0.8s linear infinite',flexShrink:0}}/>
         <div style={{flex:1}}>
           <div style={{fontSize:'0.75rem',fontWeight:600,color:'var(--ink)',marginBottom:4}}>
             {streamedCount} of {topics.length} topic{topics.length!==1?"s":""} ready
           </div>
           <div style={{height:3,background:'var(--rule)',borderRadius:2,overflow:'hidden'}}>
             <div style={{height:'100%',width:`${(streamedCount/topics.length)*100}%`,background:'var(--accent)',borderRadius:2,transition:'width 0.4s ease'}}/>
           </div>
         </div>
       </div>
     )}
     {phase==="done"&&brief&&!brief.error&&briefIsStale&&!isStreaming&&(
       <div style={{margin:'0 22px 8px',background:'#fffbeb',border:'1px solid #fde68a',borderRadius:10,padding:'10px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
         <div style={{display:'flex',alignItems:'center',gap:8}}>
           <span style={{fontSize:'1rem'}}>☀️</span>
           <span style={{fontSize:'0.78rem',color:'#92400e',fontWeight:600}}>This brief is from yesterday — refresh for today's news</span>
         </div>
         <button onClick={generate} disabled={phase==="loading"||cooldown>0} style={{fontSize:'0.72rem',fontWeight:700,color:'#92400e',background:'#fde68a',border:'none',borderRadius:6,padding:'5px 12px',cursor:'pointer',whiteSpace:'nowrap'}}>
           {cooldown>0?`${cooldown}s`:"Refresh now"}
         </button>
       </div>
     )}
     {phase==="done"&&brief&&(
       <div className="brief-wrap" ref={briefRef}>
         {brief.error?(
           <div className="err-box">
             <div className="err-msg">{brief.raw||"Could not generate brief — please try again."}</div>
             {brief.raw&&<pre className="err-pre">{brief.raw}</pre>}
           </div>
         ):(
           <>
             <div>
               {(brief.topics||[]).map((tg,ti)=>{
                 const stories=Array.isArray(tg.stories)?tg.stories:[];
                 const featured=stories[0];
                 const rest=stories.slice(1);
                 const fUrl=featured&&(featured.url&&featured.url.startsWith("http")?featured.url:"https://news.google.com/search?q="+encodeURIComponent(clean(featured.headline)+" "+(featured.source||"")));
                 const gradient=getTopicGradient(tg.topic);
                 return(
                   <div key={ti} className="brief-topic-section" style={{animationDelay:`${ti*0.08}s`}}>
                     <div className="brief-topic-header">
                       <span className="brief-topic-name">{tg.topic}</span>
                       <span className="brief-topic-count">{stories.length} {stories.length===1?"story":"stories"}</span>
                     </div>
                     {featured&&(
                       <a className="brief-featured" href={fUrl} target="_blank" rel="noopener noreferrer">
                         {(()=>{const tk=tg.topic.toLowerCase().trim();const apiImg=ogImages[tk]&&!failedOgImages.has(tk)?ogImages[tk]:null;const fallbackImg=getTopicImage(tg.topic);const imgSrc=apiImg||fallbackImg;return(
                         <div className="brief-feat-img" style={imgSrc?{backgroundImage:`linear-gradient(to bottom,transparent 25%,rgba(0,0,0,0.75) 100%),url(${imgSrc})`,backgroundSize:"cover",backgroundPosition:"center"}:{background:gradient}}>
                           {apiImg&&<img src={apiImg} alt="" style={{display:"none"}} onError={()=>markOgFailed(tk)}/>}
                           <div className="brief-feat-img-meta">
                             {featured.source&&<SourceLogo source={featured.source} dark/>}
                             <span className="brief-feat-label">Lead story</span>
                           </div>
                         </div>
                         );})()}
                         <div className="brief-feat-body">
                           <div className="brief-feat-hl">{clean(featured.headline)}</div>
                           {featured.summary&&<div className="brief-feat-sum">{clean(featured.summary)}</div>}
                           <span className="brief-feat-read">Read full story →</span>
                         </div>
                       </a>
                     )}
                     {rest.length>0&&(
                       <div className="brief-story-grid">
                         {rest.map((st,si)=>{
                           const hasUrl=st.url&&st.url.startsWith("http");
                           const url=hasUrl?st.url:"https://news.google.com/search?q="+encodeURIComponent(clean(st.headline)+" "+(st.source||""));
                           return(
                             <a key={si} className="brief-story-card" href={url} target="_blank" rel="noopener noreferrer">
                               {st.source&&<div className="brief-story-src"><SourceLogo source={st.source}/></div>}
                               <div className="brief-story-hl">{clean(st.headline)}</div>
                               {st.summary&&<div className="brief-story-sum">{clean(st.summary)}</div>}
                               <span className="brief-story-read">Read →</span>
                             </a>
                           );
                         })}
                       </div>
                     )}
                   </div>
                 );
               })}
             </div>
             {brief.topics?.some(tg=>tg.stories?.some(s=>s.source))&&(
               <div className="srcfooter"><strong>Sources: </strong>{[...new Set(brief.topics.flatMap(tg=>(tg.stories||[]).map(s=>s.source)).filter(Boolean))].join(" · ")}</div>
             )}
           </>
         )}
       </div>
     )}
     {phase!=="loading"&&(!brief||brief.error)&&(
       <div className="no-brief">
         <div className="no-brief-inner">
           <div className="no-brief-eyebrow">Good morning, {user.user_metadata?.username||user.email?.split('@')[0]}</div>
           <div className="no-brief-title">Your brief is<br/><em>ready to build</em></div>
           <div className="no-brief-sub">Pick your topics and we’ll build your brief in seconds.</div>
           <button className="no-brief-btn" onClick={()=>setTab("topics")}>Build my brief</button>
           {topics.length>0&&(
             <div className="no-brief-topics">
               {topics.map((t,i)=><span key={i} className="no-brief-topic-tag">{t}</span>)}
             </div>
           )}
         </div>
       </div>
     )}
   </>)}

   {/* ── TOPICS TAB ── */}
   {tab==="topics"&&(
     <div className="topics-page">
       <div className="topics-page-hd">
         <div className="topics-page-title">Your Topics</div>
         <div className="topics-page-sub">Choose what you want to wake up to every morning.</div>
       </div>
       <div className="search-wrap">
         <span className="search-ico"></span>
         <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTopic()} placeholder="Search topic"/>
         <button className="add-btn" onClick={()=>addTopic()} disabled={topics.length>=MAX_TOPICS} style={{opacity:topics.length>=MAX_TOPICS?0.4:1,cursor:topics.length>=MAX_TOPICS?"not-allowed":"pointer"}}>Add</button>
       </div>
       <div className="sugg-lbl">Popular topics — click to add</div>
       <div className="sugg-wrap">
         {SUGGESTIONS.map(s=><div key={s.name} className={`sugg${topics.includes(s.name)?" on":""}${topics.length>=MAX_TOPICS&&!topics.includes(s.name)?" disabled":""}`} onClick={()=>togSugg(s.name)} style={{opacity:topics.length>=MAX_TOPICS&&!topics.includes(s.name)?0.35:1,cursor:topics.length>=MAX_TOPICS&&!topics.includes(s.name)?"not-allowed":"pointer"}}>{s.name}</div>)}
       </div>
       <div className="chips">
         <span className="chips-lbl">Your topics:</span>
         {topics.length===0
           ? <span style={{fontSize:"0.72rem",color:"#b0b8c4"}}>Nothing yet — add topics above</span>
           : topics.map(t=><span key={t} className="chip">{t} <span className="chip-x" onClick={()=>rmTopic(t)}>×</span></span>)
         }
         {topics.length>0&&(
           <span className={`topic-counter ${topics.length>=MAX_TOPICS?"full":topics.length>=4?"warn":"ok"}`}>{topics.length}/5</span>
         )}
       </div>
       {topics.length>=MAX_TOPICS&&(
         <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:"#fff2f2",border:"1px solid #fca5a5",borderRadius:6,marginTop:6}}>
           <span style={{fontSize:"0.78rem",color:"#dc2626"}}>5 topic limit reached.</span>
           <span style={{fontSize:"0.78rem",color:"#6b7280"}}>Remove one to add another.</span>
         </div>
       )}
       <div className="gen-wrap" style={{padding:"24px 0 0"}}>
         <div className="gen-panel">
           <div>
             <div className="gen-title">Generate your brief</div>
             <div className="gen-sub">{topics.length===0?"Add topics above first":`${topics.length} topic${topics.length>1?"s":""} selected`}</div>
           </div>
           <div className="gen-btns">
             <button className={`btn-gen${topics.length>0&&!isStreaming&&phase!=="loading"&&!cooldown?" ready":""}`} onClick={generate} disabled={phase==="loading"||isStreaming||cooldown>0}>{phase==="loading"||isStreaming?"Generating...":cooldown>0?`Wait ${cooldown}s...`:"Generate brief"}</button>
           </div>
         </div>
       </div>
     </div>
   )}

   {/* ── PROFILE TAB ── */}
   {tab==="profile"&&(
     <div className="profile-page">
       <div className="profile-avatar-row">
         <div className="profile-avatar">{(user.user_metadata?.username||user.email||"?")[0].toUpperCase()}</div>
         <div className="profile-name">{user.user_metadata?.username||user.email?.split('@')[0]}</div>
         <div className="profile-email-txt">{user.email}</div>
       </div>
       <div className="profile-section">
         <div className="profile-row">
           <div className="profile-row-l">
             <div className="profile-row-lbl">Delivery time</div>
             <div className="profile-row-sub">When your brief is generated daily</div>
           </div>
           <input type="time" value={deliveryTime} onChange={e=>setDeliveryTime(e.target.value)} className="profile-time"/>
         </div>
         <div className="profile-row">
           <div className="profile-row-l">
             <div className="profile-row-lbl">Push notifications</div>
             <div className="profile-row-sub">{pushStatus==="granted"?"Enabled":"Get notified when your brief is ready"}</div>
           </div>
           {pushStatus==="granted"
             ? <span className="profile-push-btn ok">On</span>
             : pushStatus==="denied"
             ? <span className="profile-push-btn denied">Blocked</span>
             : <button className="profile-push-btn" onClick={saveSettings}>Enable</button>
           }
         </div>
       </div>
       <button className="profile-save-btn" onClick={saveSettings}>Save settings</button>
       <button className="profile-signout" onClick={signOut}>Sign out</button>
     </div>
   )}

 </div>

 {/* BOTTOM NAV */}
 <div className="mob-nav">
   <div className="mob-nav-inner">
     {[{id:"brief",label:"Brief"},{id:"topics",label:"Topics"},{id:"profile",label:"Profile"}].map(t=>(
       <button key={t.id} className={`mob-tab${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>
         <div className="mob-tab-bar"/>
         <span className="mob-tab-lbl">{t.label}</span>
       </button>
     ))}
   </div>
 </div>
 </>
 ) : (
 <>
 {/* SLIDE 1: INTRO */}
 <div className="ls ls-1">
   <div className="hero-blob hero-blob-1"/><div className="hero-blob hero-blob-2"/>
   <h1 className="ls1-hl">News<br/>without<br/>the <em>noise.</em></h1>
   <p className="ls1-sub">Your topics. Real sources. One brief, every morning.</p>
   <div className="ls1-btns">
     <button className="ls1-btn-p" onClick={()=>{setAuthModal('signup');setAuthError('');}}>Get started free</button>
     <button className="ls1-btn-g" onClick={()=>{setAuthModal('login');setAuthError('');}}>Sign in</button>
   </div>
   <div className="ls1-scroll"><div className="ls1-scroll-line"/><span className="ls1-scroll-label">scroll</span></div>
 </div>
 {/* SLIDE 2: WHY */}
 <div className="ls ls-2">
   <div className="ls2-label">Why NewsHall</div>
   <div className="ls2-list">
     {[
       {n:"01",title:"Straight-news sources only",desc:"We pull from outlets built for reporting — not opinion, not outrage."},
       {n:"02",title:"Every story linked and cited",desc:"Every headline goes straight to the original article. No paywalls, no dead ends."},
       {n:"03",title:"Built fresh every morning",desc:"Your brief is scanned and written for your exact topics. Nobody else gets yours."},
       {n:"04",title:"Ready before you wake up",desc:"Set a delivery time once and forget it. Your brief is there when your day starts."},
     ].map(item=>(
       <div className="ls2-item" key={item.n}>
         <div className="ls2-n">{item.n}</div>
         <div className="ls2-title">{item.title}</div>
         <div className="ls2-desc">{item.desc}</div>
       </div>
     ))}
   </div>
 </div>
 {/* SLIDE 3: HOW + CTA */}
 <div className="ls ls-3">
   <div className="ls3-eyebrow">How it works</div>
   <h2 className="ls3-hl">Up in 60 seconds</h2>
   <div className="ls3-steps">
     {[
       {n:"01",title:"Pick your topics",text:"Choose from 50+ categories or type anything — a team, a stock, a niche."},
       {n:"02",title:"We do the reading",text:"Every morning we scan hundreds of sources and write your brief."},
       {n:"03",title:"Wake up informed",text:"Your brief is waiting. Read it over coffee, no doomscrolling required."},
     ].map(s=>(
       <div className="ls3-step" key={s.n}>
         <div className="ls3-num">{s.n}</div>
         <div><div className="ls3-step-title">{s.title}</div><div className="ls3-step-text">{s.text}</div></div>
       </div>
     ))}
   </div>
   <button className="ls3-cta" onClick={()=>document.getElementById("builder")?.scrollIntoView({behavior:"smooth"})}>Start for free →</button>
 </div>
 {/* LOGGED-OUT BUILDER */}
 <div id="builder" className="builder" ref={builderRef}>
   <div className="step-hd">
     <div className="step-tag"><span className="step-n">01</span> Choose topics</div>
     <h2 className="step-h2">What do you want to wake up to?</h2>
     <p className="step-sub">Pick from popular categories, or type anything as broad or specific as you want.</p>
   </div>
   <div className="search-wrap">
     <span className="search-ico"></span>
     <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTopic()} placeholder="Search topic"/>
     <button className="add-btn" onClick={()=>addTopic()} disabled={topics.length>=MAX_TOPICS} style={{opacity:topics.length>=MAX_TOPICS?0.4:1,cursor:topics.length>=MAX_TOPICS?"not-allowed":"pointer"}}>Add topic</button>
   </div>
   <div className="sugg-lbl">Popular topics — click to add</div>
   <div className="sugg-wrap">
     {SUGGESTIONS.map(s=><div key={s.name} className={`sugg${topics.includes(s.name)?" on":""}${topics.length>=MAX_TOPICS&&!topics.includes(s.name)?" disabled":""}`} onClick={()=>togSugg(s.name)} style={{opacity:topics.length>=MAX_TOPICS&&!topics.includes(s.name)?0.35:1,cursor:topics.length>=MAX_TOPICS&&!topics.includes(s.name)?"not-allowed":"pointer"}}>{s.name}</div>)}
   </div>
   <div className="chips">
     <span className="chips-lbl">Your topics:</span>
     {topics.length===0
       ? <span style={{fontSize:"0.72rem",color:"#b0b8c4"}}>Nothing yet — add topics above</span>
       : topics.map(t=><span key={t} className="chip">{t} <span className="chip-x" onClick={()=>rmTopic(t)}>×</span></span>)
     }
     {topics.length>0&&(
       <span className={`topic-counter ${topics.length>=MAX_TOPICS?"full":topics.length>=4?"warn":"ok"}`}>{topics.length}/5</span>
     )}
   </div>
   {topics.length>=MAX_TOPICS&&(
     <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:"#fff2f2",border:"1px solid #fca5a5",borderRadius:6,marginTop:6}}>
       <span style={{fontSize:"0.78rem",color:"#dc2626"}}>You've reached the 5 topic limit on the free plan.</span>
       <span style={{fontSize:"0.78rem",color:"#6b7280"}}>Remove a topic to add a different one.</span>
     </div>
   )}
 </div>
 <div className="gen-wrap">
   <div className="gen-panel">
     <div>
       <div className="gen-title">Ready to preview?</div>
       <div className="gen-sub">{topics.length===0?"Add topics above first":`${topics.length} topic${topics.length>1?"s":""} ready — generate your digest`}</div>
     </div>
     <div className="gen-btns">
       <button className={`btn-gen${topics.length>0&&!isStreaming&&phase!=="loading"&&!cooldown?" ready":""}`} onClick={generate} disabled={phase==="loading"||isStreaming||cooldown>0}>{phase==="loading"||isStreaming?"Generating...":cooldown>0?`Wait ${cooldown}s...`:"Generate brief"}</button>
     </div>
   </div>
 </div>
 {phase==="loading"&&(
   <div className="loading">
     <div className="ld-orbs"><div className="ld-orb"/><div className="ld-orb"/><div className="ld-orb"/></div>
     <div className="ld-h">Building your Morning Brief</div>
     <div className="ld-s">Scanning live sources across {topics.length} topic{topics.length>1?"s":""}...</div>
     <div className="ld-bar-wrap"><div className="ld-bar"/></div>
     <div className="ld-topics">
       {topics.map((t,i)=>{const si=steps.length;const done=i<si-1;const scan=i===si-1||(!done&&i===0&&steps.length===0);return(<span key={t} className={`ld-topic-pill${scan?" scanning":done?" done":""}`} style={{animationDelay:`${i*0.1}s`}}><span className="ld-pill-dot"/>{t}</span>);})}
     </div>
     <div className="ld-steps">{steps.map((s,i)=><div key={i} className="ld-step">✓ {s}</div>)}</div>
   </div>
 )}
 {phase==="done"&&brief&&(
   <div className="brief-wrap" ref={briefRef}>
     {brief.error?(
       <div className="err-box">
         <div className="err-msg">{brief.raw||"Could not generate brief — please try again."}</div>
         {brief.raw&&<pre className="err-pre">{brief.raw}</pre>}
       </div>
     ):(
       <>
         <div className="bmast">
           <div className="bmast-top">
             <span className="bmast-pub">NewsHall</span>
             <span className="bmast-date-sm">{today}</span>
           </div>
           <div className="bkicker">Your Morning Brief</div>
           <div className="bhl">{brief.headline||"Morning Brief"}</div>
           <div className="bmeta">{topics.length} topic{topics.length!==1?"s":""} · {savedBriefMeta?new Date(savedBriefMeta.generated_at).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"}):new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}</div>
           {isStreaming&&(
             <div style={{margin:'12px 0 0',background:'var(--bg-2)',border:'1px solid var(--rule)',borderRadius:10,padding:'10px 16px',display:'flex',alignItems:'center',gap:12}}>
               <div style={{width:14,height:14,borderRadius:'50%',border:'2px solid var(--accent)',borderTopColor:'transparent',animation:'spin 0.8s linear infinite',flexShrink:0}}/>
               <div style={{flex:1}}>
                 <div style={{fontSize:'0.72rem',fontWeight:600,color:'var(--ink)',marginBottom:4}}>{streamedCount} of {topics.length} topic{topics.length!==1?"s":""} ready</div>
                 <div style={{height:3,background:'var(--rule)',borderRadius:2,overflow:'hidden'}}>
                   <div style={{height:'100%',width:`${(streamedCount/topics.length)*100}%`,background:'var(--accent)',borderRadius:2,transition:'width 0.4s ease'}}/>
                 </div>
               </div>
             </div>
           )}
           {briefIsStale&&!isStreaming&&(
             <div style={{margin:'12px 0 0',background:'#fffbeb',border:'1px solid #fde68a',borderRadius:10,padding:'10px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
               <span style={{fontSize:'0.78rem',color:'#92400e',fontWeight:600}}>☀️ This brief is from yesterday — refresh for today's news</span>
               <button onClick={generate} disabled={phase==="loading"||cooldown>0} style={{fontSize:'0.72rem',fontWeight:700,color:'#92400e',background:'#fde68a',border:'none',borderRadius:6,padding:'5px 12px',cursor:'pointer',whiteSpace:'nowrap'}}>{cooldown>0?`${cooldown}s`:"Refresh now"}</button>
             </div>
           )}
           <div className="bmast-btns">
             <button className="btweak" onClick={()=>builderRef.current?.scrollIntoView({behavior:"smooth",block:"start"})}>Edit topics</button>
             <button className="brefresh" onClick={generate}>Refresh brief</button>
           </div>
         </div>
         <div>
           {(brief.topics||[]).map((tg,ti)=>{
             const stories=Array.isArray(tg.stories)?tg.stories:[];
             const featured=stories[0];
             const rest=stories.slice(1);
             const fUrl=featured&&(featured.url&&featured.url.startsWith("http")?featured.url:"https://news.google.com/search?q="+encodeURIComponent(clean(featured.headline)+" "+(featured.source||"")));
             const gradient=getTopicGradient(tg.topic);
             return(
               <div key={ti} className="brief-topic-section" style={{animationDelay:`${ti*0.08}s`}}>
                 <div className="brief-topic-header">
                   <span className="brief-topic-name">{tg.topic}</span>
                   <span className="brief-topic-count">{stories.length} {stories.length===1?"story":"stories"}</span>
                 </div>
                 {featured&&(
                   <a className="brief-featured" href={fUrl} target="_blank" rel="noopener noreferrer">
                     <div className="brief-feat-img" style={ogImages[tg.topic.toLowerCase().trim()]?{backgroundImage:`linear-gradient(to bottom,transparent 30%,rgba(0,0,0,0.72) 100%),url(${ogImages[tg.topic.toLowerCase().trim()]})`,backgroundSize:"cover",backgroundPosition:"center"}:{background:gradient}}>
                       <div className="brief-feat-img-over" style={ogImages[tg.topic.toLowerCase().trim()]?{display:"none"}:{}}/>
                       <div className="brief-feat-img-meta">
                         {featured.source&&<SourceLogo source={featured.source} dark/>}
                         <span className="brief-feat-label">Lead story</span>
                       </div>
                     </div>
                     <div className="brief-feat-body">
                       <div className="brief-feat-hl">{clean(featured.headline)}</div>
                       {featured.summary&&<div className="brief-feat-sum">{clean(featured.summary)}</div>}
                       <span className="brief-feat-read">Read full story →</span>
                     </div>
                   </a>
                 )}
                 {rest.length>0&&(
                   <div className="brief-story-grid">
                     {rest.map((st,si)=>{
                       const hasUrl=st.url&&st.url.startsWith("http");
                       const url=hasUrl?st.url:"https://news.google.com/search?q="+encodeURIComponent(clean(st.headline)+" "+(st.source||""));
                       return(
                         <a key={si} className="brief-story-card" href={url} target="_blank" rel="noopener noreferrer">
                           {st.source&&<div className="brief-story-src"><SourceLogo source={st.source}/></div>}
                           <div className="brief-story-hl">{clean(st.headline)}</div>
                           {st.summary&&<div className="brief-story-sum">{clean(st.summary)}</div>}
                           <span className="brief-story-read">Read →</span>
                         </a>
                       );
                     })}
                   </div>
                 )}
               </div>
             );
           })}
         </div>
         {brief.topics?.some(tg=>tg.stories?.some(s=>s.source))&&(
           <div className="srcfooter"><strong>Sources: </strong>{[...new Set(brief.topics.flatMap(tg=>(tg.stories||[]).map(s=>s.source)).filter(Boolean))].join(" · ")}</div>
         )}
       </>
     )}
   </div>
 )}
 </>
 )}

 {showOnboarding&&user&&(
   <div className="ob-over" onClick={e=>e.target===e.currentTarget&&setShowOnboarding(false)}>
     <div className="ob-box">
       <div className="ob-icon">☀️</div>
       <div className="ob-title">Set up your morning brief</div>
       <div className="ob-sub">Pick a time and we'll automatically generate and deliver your personalized brief every morning — no need to open the app.</div>
       {pushStatus==="denied"&&<div className="ob-denied">Notifications blocked. Enable them in your browser settings, then try again.</div>}
       <label className="ob-time-label">What time do you want your brief?</label>
       <input className="ob-time-input" type="time" value={deliveryTime} onChange={e=>setDeliveryTime(e.target.value)}/>
       {topics.length>0&&(
         <>
           <label className="ob-time-label">Your topics ({topics.length}/5)</label>
           <div className="ob-topics-preview">
             {topics.map(t=><span key={t} className="ob-topic-chip">{t}</span>)}
           </div>
         </>
       )}
       <button className="ob-btn" onClick={saveSettings} disabled={pushStatus==="asking"}>
         {pushStatus==="asking"?"Setting up...":"Enable morning notifications"}
       </button>
       <button className="ob-skip" onClick={()=>setShowOnboarding(false)}>I'll set this up later</button>
     </div>
   </div>
 )}

 {/* ── NEW USER ONBOARDING ── */}
 {showNewUserOnboard&&user&&(
   <div className="nuo">
     <div className="nuo-top">
       <div className="nuo-logo">NewsHall</div>
       <div className="nuo-step">{topics.length}/5 topics</div>
     </div>
     <div className="nuo-hd">
       <div className="nuo-eyebrow">Welcome</div>
       <div className="nuo-title">What do you<br/>care about?</div>
       <div className="nuo-sub">Pick a few topics and we'll build your first brief in seconds.</div>
     </div>
     <div className="nuo-body">
       <div className="nuo-search-wrap">
         <span className="nuo-search-ico">🔍</span>
         <input
           className="nuo-search"
           value={input}
           onChange={e=>setInput(e.target.value)}
           onKeyDown={e=>e.key==="Enter"&&addTopic()}
           placeholder="Or type anything specific…"
         />
       </div>
       {topics.length>0&&(
         <div className="nuo-chips">
           {topics.map(t=>(
             <span key={t} className="nuo-chip">
               {t}
               <span className="nuo-chip-x" onClick={()=>rmTopic(t)}>×</span>
             </span>
           ))}
         </div>
       )}
       <div className="nuo-sugg-lbl">Popular topics</div>
       <div className="nuo-sugg-wrap">
         {SUGGESTIONS.map(s=>(
           <div
             key={s.name}
             className={`nuo-sugg${topics.includes(s.name)?" on":""}${topics.length>=MAX_TOPICS&&!topics.includes(s.name)?" disabled":""}`}
             onClick={()=>topics.length<MAX_TOPICS||topics.includes(s.name)?togSugg(s.name):null}
             style={{opacity:topics.length>=MAX_TOPICS&&!topics.includes(s.name)?0.3:1,cursor:topics.length>=MAX_TOPICS&&!topics.includes(s.name)?"not-allowed":"pointer"}}
           >
             {s.name}
           </div>
         ))}
       </div>
     </div>
     <div className="nuo-footer">
       <button
         className={`nuo-btn${topics.length>0?" ready":""}`}
         onClick={()=>{setShowNewUserOnboard(false);generate();}}
       >
         {topics.length===0?"Pick at least one topic →":`Build my brief — ${topics.length} topic${topics.length>1?"s":""} →`}
       </button>
       <div className="nuo-hint">Takes about 15 seconds</div>
     </div>
   </div>
 )}

 {authModal&&(
   <div className="auth-modal-over" onClick={e=>e.target===e.currentTarget&&setAuthModal(null)}>
     <div className="auth-modal">
       <button className="auth-modal-close" onClick={()=>setAuthModal(null)}>✕</button>
       <div className="auth-modal-title">{authModal==='login'?'Welcome back':'Join NewsHall'}</div>
       <div className="auth-modal-sub">{authModal==='login'?'Sign in to access your saved brief and topics.':'Your personalized morning intelligence, every day.'}</div>
       {authError&&(
         authError==='__already_exists__'
           ? <div className="auth-error" style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
               <span>An account with this email already exists.</span>
               <button onClick={()=>{setAuthModal('login');setAuthError('');}} style={{background:"none",border:"none",color:"var(--accent-2)",fontWeight:700,cursor:"pointer",fontSize:"0.78rem",whiteSpace:"nowrap"}}>Sign in instead</button>
             </div>
           : <div className="auth-error">{authError}</div>
       )}
       <button className="oauth-btn" onClick={signInWithGoogle}>
         <svg className="oauth-icon" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
         Continue with Google
       </button>
       <button className="oauth-btn" onClick={signInWithApple}>
         <svg className="oauth-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
         Continue with Apple
       </button>
       <div className="auth-divider">or</div>
       <div className="auth-field">
         <label>Email</label>
         <input type="email" value={authEmail} onChange={e=>setAuthEmail(e.target.value)} placeholder="you@example.com" onKeyDown={e=>e.key==="Enter"&&(authModal==='login'?signInWithEmail():signUpWithEmail())}/>
       </div>
       {authModal==='signup'&&(
         <div className="auth-field">
           <label>Username</label>
           <input type="text" value={authUsername} onChange={e=>setAuthUsername(e.target.value)} placeholder="Choose a username"/>
         </div>
       )}
       <div className="auth-field">
         <label>Password</label>
         <div style={{position:"relative"}}>
           <input type={showPassword?"text":"password"} value={authPassword} onChange={e=>setAuthPassword(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&(authModal==='login'?signInWithEmail():signUpWithEmail())} style={{width:"100%",paddingRight:"44px"}}/>
           <button onClick={()=>setShowPassword(p=>!p)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"var(--ink-3)",fontSize:"0.8rem",padding:4}}>{showPassword?"Hide":"Show"}</button>
         </div>
       </div>
       <button className="auth-submit" onClick={authModal==='login'?signInWithEmail:signUpWithEmail} disabled={authLoading}>
         {authLoading?"Loading...":(authModal==='login'?"Sign in":"Create account")}
       </button>
       <div className="auth-switch">
         {authModal==='login'?<>Don't have an account? <button onClick={()=>{setAuthModal('signup');setAuthError('');}}>Sign up</button></>:<>Already have an account? <button onClick={()=>{setAuthModal('login');setAuthError('');}}>Sign in</button></>}
       </div>
     </div>
   </div>
 )}

 {toast&&<div className="toast">{toast}</div>}
 </>);
}

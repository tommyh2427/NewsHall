'use client';
import { useState, useRef, useEffect } from "react";

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
 {name:"Stock Market"},{name:"World News"},{name:"Formula 1"},
 {name:"NFL"},{name:"NBA"},{name:"Soccer"},
 {name:"Tech & AI"},{name:"Business"},{icon:"",name:"Crypto"},
 {name:"US Politics"},{name:"Science"},{name:"Health"},
 {name:"Climate"},{name:"Entertainment"},{name:"Startups"},
 {name:"Real Estate"},{name:"NHL"},{name:"MLB"},
 {name:"MMA / UFC"},{name:"Golf"},{name:"Deals & M&A"},
 {name:"Auto & EVs"},{name:"Gaming"},{name:"Travel"},
];

// Team colors and abbreviations for logo badges
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,300;1,9..144,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
html,body{height:100%;}
body{font-family:'Plus Jakarta Sans',sans-serif;background:#faf7f2;color:#1a1f2e;}
.shell{display:flex;min-height:100vh;}
.sidebar{width:210px;flex-shrink:0;background:#0f1729;display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto;z-index:50;}
.sb-logo{padding:22px 18px 18px;border-bottom:1px solid rgba(255,255,255,0.06);}
.sb-logo-text{font-family:'Fraunces',serif;font-size:1.35rem;font-weight:700;color:#fff;letter-spacing:-0.03em;}
.sb-logo-text em{color:#5585e8;font-style:italic;}
.sb-logo-sub{font-family:'DM Mono',monospace;font-size:0.5rem;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.22);margin-top:4px;}
.sb-nav{padding:14px 10px;flex:1;}
.sb-lbl{font-family:'DM Mono',monospace;font-size:0.5rem;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.2);padding:0 8px;margin:14px 0 6px;}
.sb-lbl:first-child{margin-top:0;}
.sb-item{display:flex;align-items:center;gap:9px;padding:9px 11px;border-radius:9px;cursor:pointer;transition:all 0.15s;color:rgba(255,255,255,0.48);font-size:0.82rem;font-weight:600;border:1px solid transparent;}
.sb-item:hover{background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.82);}
.sb-item.active{background:rgba(85,133,232,0.18);color:#fff;border-color:rgba(85,133,232,0.28);}
.sb-icon{font-size:0.95rem;width:18px;text-align:center;flex-shrink:0;}
.sb-badge{margin-left:auto;background:rgba(85,133,232,0.28);color:#93b4f8;font-family:'DM Mono',monospace;font-size:0.48rem;letter-spacing:0.08em;padding:2px 5px;border-radius:100px;}
.sb-foot{padding:14px;border-top:1px solid rgba(255,255,255,0.06);}
.sb-date{font-family:'DM Mono',monospace;font-size:0.52rem;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.18);line-height:1.6;}
.live-row{display:flex;align-items:center;gap:5px;color:rgba(255,255,255,0.28);font-family:'DM Mono',monospace;font-size:0.5rem;letter-spacing:0.1em;text-transform:uppercase;margin-top:5px;}
.ldot{width:5px;height:5px;border-radius:50%;background:#4ade80;animation:blink 2s infinite;}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
.main{flex:1;min-width:0;overflow-x:hidden;}
.page{display:none;}.page.active{display:block;}
.topbar{position:sticky;top:0;z-index:40;background:rgba(250,247,242,0.95);backdrop-filter:blur(20px);border-bottom:1px solid rgba(15,23,41,0.08);padding:0 36px;height:56px;display:flex;align-items:center;justify-content:space-between;}
.tb-title{font-family:'Fraunces',serif;font-size:1.05rem;font-weight:700;color:#0f1729;letter-spacing:-0.02em;}
.tb-sub{font-family:'DM Mono',monospace;font-size:0.56rem;letter-spacing:0.1em;text-transform:uppercase;color:#9ca3af;}
.hero{background:#0f1729;padding:68px 36px 0;display:grid;grid-template-columns:1fr 1fr;gap:52px;align-items:flex-start;position:relative;overflow:hidden;}
.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 0% 60%,rgba(59,111,212,0.26) 0%,transparent 60%),radial-gradient(ellipse 50% 70% at 100% 10%,rgba(212,168,75,0.13) 0%,transparent 60%);pointer-events:none;}
.hero::after{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px);background-size:64px 64px;pointer-events:none;}
.hero-l{position:relative;z-index:2;padding-bottom:60px;}
.kicker{display:inline-flex;align-items:center;gap:7px;background:rgba(59,111,212,0.18);border:1px solid rgba(91,133,232,0.28);color:#93b4f8;border-radius:100px;font-family:'DM Mono',monospace;font-size:0.55rem;letter-spacing:0.12em;text-transform:uppercase;padding:5px 11px;margin-bottom:18px;}
.kicker-dot{width:4px;height:4px;border-radius:50%;background:#93b4f8;}
.hero-h1{font-family:'Fraunces',serif;font-size:clamp(2.2rem,3.8vw,3.6rem);font-weight:700;line-height:1.08;letter-spacing:-0.03em;color:#fff;margin-bottom:14px;}
.hero-h1 em{color:#93b4f8;font-style:italic;font-weight:300;}
.hero-sub{font-size:0.9rem;line-height:1.68;color:rgba(255,255,255,0.48);max-width:390px;margin-bottom:26px;}
.hero-btns{display:flex;gap:9px;flex-wrap:wrap;}
.btn-p{background:#5585e8;color:#fff;font-weight:700;font-size:0.8rem;padding:11px 20px;border:none;border-radius:9px;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 14px rgba(59,111,212,0.38);}
.btn-p:hover{background:#6b96ee;transform:translateY(-1px);}
.btn-g{background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.78);font-weight:600;font-size:0.8rem;padding:11px 20px;border:1px solid rgba(255,255,255,0.14);border-radius:9px;cursor:pointer;transition:all 0.2s;}
.btn-g:hover{background:rgba(255,255,255,0.13);}
.hero-r{position:relative;z-index:2;padding-bottom:60px;}
.prev-card{background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.1);border-radius:14px;padding:18px;backdrop-filter:blur(20px);}
.prev-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
.prev-title{font-family:'Fraunces',serif;font-size:0.82rem;font-weight:600;color:rgba(255,255,255,0.88);}
.prev-time{font-family:'DM Mono',monospace;font-size:0.52rem;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.28);}
.prev-item{display:flex;gap:9px;align-items:flex-start;padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.07);}
.prev-item:last-child{border-bottom:none;padding-bottom:0;}
.prev-tag{font-family:'DM Mono',monospace;font-size:0.46rem;letter-spacing:0.1em;text-transform:uppercase;background:rgba(59,111,212,0.25);color:#93b4f8;padding:2px 5px;border-radius:3px;white-space:nowrap;margin-top:2px;flex-shrink:0;}
.prev-txt{font-size:0.72rem;color:rgba(255,255,255,0.58);line-height:1.45;}
.prev-txt strong{color:rgba(255,255,255,0.86);font-weight:600;}
.hero-stats{grid-column:span 2;display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid rgba(255,255,255,0.08);position:relative;z-index:2;}
.hstat{padding:18px 0;}
.hstat-n{font-family:'Fraunces',serif;font-size:1.8rem;font-weight:700;color:#fff;letter-spacing:-0.03em;line-height:1;}
.hstat-l{font-size:0.72rem;color:rgba(255,255,255,0.36);margin-top:3px;}
.trust{background:#fff;border-bottom:1px solid rgba(15,23,41,0.08);padding:11px 36px;display:flex;align-items:flex-start;gap:9px;}
.trust p{font-size:0.72rem;color:#6b7280;line-height:1.58;}
.trust strong{color:#0f1729;font-weight:700;}
.features{background:#fff;border-bottom:1px solid rgba(15,23,41,0.08);display:grid;grid-template-columns:repeat(3,1fr);}
.fb{padding:26px 32px;border-right:1px solid rgba(15,23,41,0.08);display:flex;gap:13px;align-items:flex-start;}
.fb:last-child{border-right:none;}
.fi{width:34px;height:34px;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:0.9rem;}
.fi-b{background:rgba(59,111,212,0.09);}.fi-c{background:rgba(232,101,74,0.09);}.fi-g{background:rgba(212,168,75,0.09);}
.fb h4{font-size:0.83rem;font-weight:700;margin-bottom:3px;}
.fb p{font-size:0.72rem;color:#6b7280;line-height:1.52;}
.builder{max-width:1000px;margin:0 auto;padding:52px 36px;}
.step-hd{margin-bottom:28px;}
.step-tag{display:inline-flex;align-items:center;gap:5px;background:#0f1729;color:#fff;font-family:'DM Mono',monospace;font-size:0.52rem;letter-spacing:0.12em;text-transform:uppercase;padding:3px 10px;border-radius:100px;margin-bottom:9px;}
.step-n{color:#5585e8;}
.step-h2{font-family:'Fraunces',serif;font-size:clamp(1.3rem,2.3vw,1.9rem);font-weight:700;letter-spacing:-0.03em;color:#0f1729;margin-bottom:5px;}
.step-sub{font-size:0.82rem;color:#6b7280;line-height:1.58;max-width:460px;}
.search-wrap{position:relative;margin-bottom:16px;}
.search-wrap input{width:100%;background:#fff;border:2px solid rgba(15,23,41,0.09);border-radius:11px;padding:14px 124px 14px 43px;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.9rem;color:#1a1f2e;outline:none;transition:all 0.15s;box-shadow:0 1px 3px rgba(15,23,41,0.05),0 4px 10px rgba(15,23,41,0.04);}
.search-wrap input:focus{border-color:#3b6fd4;box-shadow:0 0 0 3px rgba(59,111,212,0.09);}
.search-wrap input::placeholder{color:#b0b8c4;}
.search-ico{position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:0.95rem;pointer-events:none;}
.add-btn{position:absolute;right:6px;top:50%;transform:translateY(-50%);background:#0f1729;color:#fff;border:none;border-radius:8px;padding:8px 16px;font-weight:700;font-size:0.73rem;cursor:pointer;}
.sugg-lbl{font-family:'DM Mono',monospace;font-size:0.54rem;letter-spacing:0.1em;text-transform:uppercase;color:#6b7280;margin-bottom:8px;}
.sugg-wrap{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:20px;}
.sugg{display:inline-flex;align-items:center;gap:4px;background:#fff;border:1.5px solid rgba(15,23,41,0.09);border-radius:100px;padding:5px 11px;font-size:0.74rem;font-weight:600;cursor:pointer;transition:all 0.15s;box-shadow:0 1px 2px rgba(15,23,41,0.04);}
.sugg:hover{border-color:#3b6fd4;color:#3b6fd4;}
.sugg.on{background:rgba(59,111,212,0.08);border-color:#3b6fd4;color:#3b6fd4;}
.chips{min-height:44px;background:#fff;border:1.5px solid rgba(15,23,41,0.09);border-radius:10px;padding:8px 12px;display:flex;flex-wrap:wrap;align-items:center;gap:6px;box-shadow:0 1px 2px rgba(15,23,41,0.04);}
.chips-lbl{font-family:'DM Mono',monospace;font-size:0.52rem;letter-spacing:0.1em;text-transform:uppercase;color:#9ca3af;flex-shrink:0;}
.chip{display:inline-flex;align-items:center;gap:4px;background:rgba(59,111,212,0.08);border:1px solid rgba(59,111,212,0.2);border-radius:100px;padding:2px 9px;font-size:0.7rem;font-weight:600;color:#3b6fd4;}
.chip-x{cursor:pointer;color:rgba(59,111,212,0.42);font-size:0.78rem;}
.chip-x:hover{color:#e8654a;}
.sgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
.sblock{background:#fff;border:1.5px solid rgba(15,23,41,0.09);border-radius:10px;padding:14px 13px;box-shadow:0 1px 2px rgba(15,23,41,0.04);}
.slbl{font-family:'DM Mono',monospace;font-size:0.52rem;letter-spacing:0.1em;text-transform:uppercase;color:#6b7280;margin-bottom:6px;}
.sinput{width:100%;background:transparent;border:none;outline:none;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.82rem;font-weight:600;color:#1a1f2e;appearance:none;cursor:pointer;}
.sinput option{background:#fff;}
.gen-wrap{max-width:1000px;margin:0 auto;padding:0 36px 60px;}
.gen-panel{background:#0f1729;border-radius:13px;padding:26px 32px;display:grid;grid-template-columns:1fr auto;align-items:center;gap:22px;position:relative;overflow:hidden;}
.gen-panel::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 100% at 100% 50%,rgba(59,111,212,0.26) 0%,transparent 70%);pointer-events:none;}
.gen-title{font-family:'Fraunces',serif;font-size:1.4rem;font-weight:700;color:#fff;letter-spacing:-0.03em;margin-bottom:3px;}
.gen-sub{font-size:0.78rem;color:rgba(255,255,255,0.36);}
.gen-btns{display:flex;gap:8px;position:relative;z-index:1;flex-shrink:0;}
.btn-gen{background:#5585e8;color:#fff;font-weight:700;font-size:0.8rem;padding:11px 20px;border:none;border-radius:8px;cursor:pointer;transition:all 0.2s;white-space:nowrap;box-shadow:0 4px 14px rgba(59,111,212,0.36);}
.btn-gen:hover{background:#6b96ee;transform:translateY(-1px);}
.btn-gen:disabled{opacity:0.5;cursor:not-allowed;transform:none;}
.btn-sched{background:rgba(255,255,255,0.1);color:#fff;font-weight:600;font-size:0.8rem;padding:11px 20px;border:1px solid rgba(255,255,255,0.14);border-radius:8px;cursor:pointer;white-space:nowrap;}
.loading{max-width:1000px;margin:0 auto;padding:60px 36px;display:flex;flex-direction:column;align-items:center;text-align:center;}
.spin{width:34px;height:34px;border:2px solid rgba(15,23,41,0.09);border-top-color:#3b6fd4;border-radius:50%;animation:spin 0.8s linear infinite;margin-bottom:14px;}
@keyframes spin{to{transform:rotate(360deg)}}
.ld-h{font-family:'Fraunces',serif;font-size:1.15rem;font-weight:700;color:#0f1729;letter-spacing:-0.02em;margin-bottom:3px;}
.ld-s{font-size:0.76rem;color:#6b7280;}
.ld-steps{margin-top:14px;display:flex;flex-direction:column;gap:4px;}
.ld-step{font-family:'DM Mono',monospace;font-size:0.58rem;color:#9ca3af;letter-spacing:0.06em;}
.brief-wrap{max-width:1000px;margin:0 auto;padding:0 36px 68px;animation:fu 0.4s ease;}
@keyframes fu{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.bmast{padding:28px 0 20px;border-bottom:2px solid #0f1729;margin-bottom:18px;display:grid;grid-template-columns:1fr auto;align-items:flex-start;gap:14px;}
.bkicker{font-family:'DM Mono',monospace;font-size:0.54rem;letter-spacing:0.14em;text-transform:uppercase;color:#3b6fd4;margin-bottom:7px;display:flex;align-items:center;gap:7px;}
.bkicker::before{content:'';width:14px;height:1.5px;background:#3b6fd4;display:block;}
.bhl{font-family:'Fraunces',serif;font-size:clamp(1.6rem,3.2vw,2.7rem);font-weight:700;line-height:1.05;letter-spacing:-0.03em;color:#0f1729;}
.bsummary{font-size:0.84rem;color:#6b7280;line-height:1.62;margin-top:7px;font-style:italic;}
.bmeta{font-family:'DM Mono',monospace;font-size:0.54rem;letter-spacing:0.08em;text-transform:uppercase;color:#9ca3af;margin-top:8px;}
.brefresh{background:#0f1729;color:#fff;font-weight:700;font-size:0.66rem;padding:8px 14px;border:none;border-radius:7px;cursor:pointer;}
.topic-group{margin-bottom:28px;}
.tg-header{display:flex;align-items:center;gap:9px;margin-bottom:11px;padding-bottom:8px;border-bottom:2px solid #0f1729;}
.tg-icon{font-size:1.15rem;line-height:1;}
.tg-name{font-family:'Fraunces',serif;font-size:1.15rem;font-weight:700;color:#0f1729;letter-spacing:-0.02em;}
.tg-count{font-family:'DM Mono',monospace;font-size:0.52rem;letter-spacing:0.1em;text-transform:uppercase;color:#9ca3af;margin-left:auto;}
.story-list{display:flex;flex-direction:column;border:1px solid rgba(15,23,41,0.08);border-radius:11px;overflow:hidden;background:#fff;box-shadow:0 1px 3px rgba(15,23,41,0.05);}
.story-row{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 18px;border-bottom:1px solid rgba(15,23,41,0.07);text-decoration:none;transition:background 0.12s;}
.story-row:last-child{border-bottom:none;}
.story-row:hover{background:#faf7f2;}
.story-row-main{flex:1;min-width:0;}
.story-row-hl{font-family:'Fraunces',serif;font-size:0.95rem;font-weight:700;line-height:1.25;letter-spacing:-0.02em;color:#0f1729;margin-bottom:3px;}
.story-row-sum{font-size:0.76rem;color:#6b7280;line-height:1.45;}
.story-row-meta{display:flex;align-items:center;gap:10px;flex-shrink:0;}
.story-row-src{font-family:'DM Mono',monospace;font-size:0.52rem;letter-spacing:0.08em;text-transform:uppercase;color:#9ca3af;white-space:nowrap;}
.story-row-arrow{font-family:'DM Mono',monospace;font-size:0.52rem;letter-spacing:0.08em;text-transform:uppercase;color:#3b6fd4;background:rgba(59,111,212,0.08);border:1px solid rgba(59,111,212,0.15);border-radius:4px;padding:3px 8px;white-space:nowrap;}
.watch{background:#0f1729;border-radius:10px;padding:14px 18px;display:flex;align-items:flex-start;gap:11px;margin-top:10px;}
.watch-lbl{font-family:'DM Mono',monospace;font-size:0.5rem;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.28);margin-bottom:2px;}
.watch-txt{font-size:0.82rem;color:#fff;line-height:1.52;font-weight:500;}
.srcfooter{margin-top:8px;padding:10px 14px;background:#fff;border:1px solid rgba(15,23,41,0.08);border-radius:8px;font-family:'DM Mono',monospace;font-size:0.52rem;letter-spacing:0.08em;text-transform:uppercase;color:#9ca3af;line-height:1.85;}
.srcfooter strong{color:#1a1f2e;}
.err-box{padding:24px 0;}
.err-msg{color:#e8654a;font-size:0.86rem;font-weight:600;margin-bottom:8px;}
.err-pre{font-size:0.62rem;color:#6b7280;background:#fff;padding:12px;border-radius:7px;white-space:pre-wrap;word-break:break-all;border:1px solid rgba(15,23,41,0.08);max-height:160px;overflow:auto;}
.wx-page,.scores-page,.markets-page,.daily-page{max-width:1000px;margin:0 auto;padding:32px 36px;}
.wx-permission{display:flex;flex-direction:column;align-items:center;text-align:center;padding:64px 32px;}
.wx-perm-icon{font-size:4rem;margin-bottom:20px;filter:drop-shadow(0 4px 16px rgba(0,0,0,0.1));}
.wx-perm-title{font-family:'Fraunces',serif;font-size:1.7rem;font-weight:700;color:#0f1729;letter-spacing:-0.03em;margin-bottom:10px;}
.wx-perm-sub{font-size:0.86rem;color:#6b7280;line-height:1.65;max-width:360px;margin-bottom:28px;}
.wx-perm-btn{background:#0f1729;color:#fff;border:none;border-radius:11px;padding:14px 32px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:0.9rem;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 16px rgba(15,23,41,0.2);margin-bottom:12px;}
.wx-perm-btn:hover{background:#1e2d55;transform:translateY(-1px);}
.wx-perm-skip{background:none;border:none;color:#9ca3af;font-size:0.78rem;cursor:pointer;padding:4px;}
.wx-perm-skip:hover{color:#6b7280;}
.wx-card{background:#0f1729;border-radius:14px;overflow:hidden;margin-bottom:14px;}
.wx-card-top{padding:28px;display:grid;grid-template-columns:auto 1fr auto;gap:20px;align-items:center;}
.wx-big-ico{font-size:4.5rem;line-height:1;filter:drop-shadow(0 6px 16px rgba(0,0,0,0.28));}
.wx-city-n{font-family:'DM Mono',monospace;font-size:0.58rem;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.33);margin-bottom:5px;}
.wx-temp{font-family:'Fraunces',serif;font-size:4rem;font-weight:700;color:#fff;line-height:1;letter-spacing:-0.04em;}
.wx-unit-sm{font-size:1.4rem;font-weight:300;color:rgba(255,255,255,0.42);margin-left:2px;}
.wx-cond{font-size:0.9rem;color:rgba(255,255,255,0.55);margin-top:5px;font-weight:500;}
.wx-stats-g{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.wx-stat-b{background:rgba(255,255,255,0.06);border-radius:9px;padding:12px;}
.wx-sv{font-family:'Fraunces',serif;font-size:1.2rem;font-weight:600;color:#fff;line-height:1;}
.wx-sl{font-family:'DM Mono',monospace;font-size:0.5rem;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.28);margin-top:3px;}
.wx-actions{display:flex;gap:7px;justify-content:flex-end;padding:0 28px 18px;}
.wx-ub{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.11);color:rgba(255,255,255,0.55);border-radius:7px;padding:5px 12px;font-family:'DM Mono',monospace;font-size:0.58rem;letter-spacing:0.08em;cursor:pointer;}
.wx-cb{background:none;border:1px solid rgba(255,255,255,0.09);color:rgba(255,255,255,0.28);border-radius:7px;padding:5px 12px;font-family:'DM Mono',monospace;font-size:0.58rem;letter-spacing:0.08em;cursor:pointer;}
.wx-hourly{padding:14px 28px 22px;border-top:1px solid rgba(255,255,255,0.07);display:grid;grid-template-columns:repeat(6,1fr);gap:0;}
.wx-hr{display:flex;flex-direction:column;align-items:center;gap:5px;padding:8px 4px;border-radius:9px;}
.wx-hr:hover{background:rgba(255,255,255,0.05);}
.wx-hr-t{font-family:'DM Mono',monospace;font-size:0.5rem;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.26);}
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
.scores-sport-n{font-family:'Fraunces',serif;font-size:1.15rem;font-weight:700;color:#0f1729;letter-spacing:-0.02em;}
.games-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;}
.game-card{background:#fff;border:1px solid rgba(15,23,41,0.08);border-radius:11px;padding:14px;box-shadow:0 1px 2px rgba(15,23,41,0.04);}
.game-status{font-family:'DM Mono',monospace;font-size:0.52rem;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:9px;font-weight:500;}
.game-status.live{color:#ef4444;}.game-status.final{color:#6b7280;}.game-status.upcoming{color:#3b6fd4;}
.game-teams{display:flex;flex-direction:column;gap:7px;}
.game-team{display:flex;align-items:center;justify-content:space-between;gap:8px;}
.team-badge{flex-shrink:0;}
.game-team-n{font-size:0.82rem;font-weight:700;color:#0f1729;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.game-team.loser .game-team-n{color:#9ca3af;}
.game-score{font-family:'Fraunces',serif;font-size:1.25rem;font-weight:700;color:#0f1729;min-width:28px;text-align:right;line-height:1;}
.game-team.loser .game-score{color:#9ca3af;}
.game-div{border:none;border-top:1px solid rgba(15,23,41,0.07);margin:5px 0;}
.game-time{font-family:'DM Mono',monospace;font-size:0.52rem;letter-spacing:0.08em;text-transform:uppercase;color:#9ca3af;margin-top:7px;}
.no-games{font-size:0.78rem;color:#9ca3af;font-style:italic;padding:10px 0;}
.mkt-filters{display:flex;gap:5px;margin-bottom:20px;flex-wrap:wrap;align-items:center;}
.mkt-fb{padding:5px 12px;border-radius:100px;border:1.5px solid rgba(15,23,41,0.1);background:#fff;font-size:0.74rem;font-weight:600;cursor:pointer;transition:all 0.15s;color:#6b7280;}
.mkt-fb:hover{border-color:#3b6fd4;color:#3b6fd4;}
.mkt-fb.on{background:#0f1729;border-color:#0f1729;color:#fff;}
.mkt-refresh{margin-left:auto;background:none;border:1.5px solid rgba(15,23,41,0.1);border-radius:8px;padding:5px 12px;font-weight:600;font-size:0.72rem;color:#6b7280;cursor:pointer;}
.mkt-sec{margin-bottom:28px;}
.mkt-sec-t{font-family:'Fraunces',serif;font-size:1.05rem;font-weight:700;color:#0f1729;letter-spacing:-0.02em;margin-bottom:10px;padding-bottom:7px;border-bottom:1.5px solid rgba(15,23,41,0.08);}
.tickers-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;}
.ticker-card{background:#fff;border:1px solid rgba(15,23,41,0.08);border-radius:11px;padding:14px;box-shadow:0 1px 2px rgba(15,23,41,0.04);position:relative;}
.ticker-rm{position:absolute;top:9px;right:9px;background:none;border:none;color:#d1d5db;font-size:0.76rem;cursor:pointer;line-height:1;}
.ticker-rm:hover{color:#dc2626;}
.ticker-sym{font-family:'DM Mono',monospace;font-size:0.56rem;letter-spacing:0.1em;text-transform:uppercase;color:#9ca3af;margin-bottom:3px;}
.ticker-name{font-size:0.75rem;font-weight:600;color:#6b7280;margin-bottom:7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:16px;}
.ticker-price{font-family:'Fraunces',serif;font-size:1.3rem;font-weight:700;color:#0f1729;line-height:1;margin-bottom:3px;}
.ticker-chg{font-family:'DM Mono',monospace;font-size:0.64rem;font-weight:500;letter-spacing:0.04em;}
.ticker-chg.up{color:#16a34a;}.ticker-chg.down{color:#dc2626;}.ticker-chg.flat{color:#9ca3af;}
.mkt-add-row{display:flex;gap:7px;margin-top:14px;}
.mkt-add-in{flex:1;background:#fff;border:1.5px solid rgba(15,23,41,0.1);border-radius:8px;padding:8px 12px;font-family:'DM Mono',monospace;font-size:0.76rem;letter-spacing:0.06em;text-transform:uppercase;color:#0f1729;outline:none;}
.mkt-add-in:focus{border-color:#3b6fd4;}
.mkt-add-in::placeholder{color:#b0b8c4;text-transform:none;font-family:'Plus Jakarta Sans',sans-serif;letter-spacing:0;}
.mkt-add-btn{background:#0f1729;color:#fff;border:none;border-radius:8px;padding:8px 16px;font-weight:700;font-size:0.74rem;cursor:pointer;}
.daily-hero{background:linear-gradient(135deg,#0f1729,#1e2d55);border-radius:18px;padding:44px;margin-bottom:20px;position:relative;overflow:hidden;}
.daily-hero::before{content:'';position:absolute;top:-50px;right:-50px;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle,rgba(85,133,232,0.18),transparent 70%);pointer-events:none;}
.daily-date{font-family:'DM Mono',monospace;font-size:0.58rem;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.28);margin-bottom:18px;}
.daily-qm{font-family:'Fraunces',serif;font-size:4.5rem;line-height:0.7;color:rgba(85,133,232,0.28);margin-bottom:6px;}
.daily-q{font-family:'Fraunces',serif;font-size:clamp(1.3rem,2.3vw,1.85rem);font-weight:600;line-height:1.28;letter-spacing:-0.02em;color:#fff;margin-bottom:14px;font-style:italic;}
.daily-a{font-family:'DM Mono',monospace;font-size:0.62rem;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.38);}
.daily-cards{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;}
.dc{background:#fff;border:1px solid rgba(15,23,41,0.08);border-radius:13px;padding:20px;box-shadow:0 1px 3px rgba(15,23,41,0.05);}
.dc-ico{font-size:1.7rem;margin-bottom:10px;}
.dc-lbl{font-family:'DM Mono',monospace;font-size:0.54rem;letter-spacing:0.12em;text-transform:uppercase;color:#9ca3af;margin-bottom:7px;}
.dc-title{font-family:'Fraunces',serif;font-size:0.96rem;font-weight:700;color:#0f1729;letter-spacing:-0.02em;margin-bottom:7px;}
.dc-text{font-size:0.77rem;color:#6b7280;line-height:1.62;}
.mover{position:fixed;inset:0;background:rgba(15,23,41,0.58);z-index:500;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);}
.mbox{background:#fff;border-radius:17px;padding:34px;width:min(490px,94vw);position:relative;box-shadow:0 24px 72px rgba(15,23,41,0.18);animation:mpop 0.22s ease;}
@keyframes mpop{from{opacity:0;transform:scale(0.96) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
.mx{position:absolute;top:14px;right:14px;background:#f0ece4;border:none;border-radius:50%;width:26px;height:26px;cursor:pointer;font-size:0.82rem;color:#6b7280;}
.mbox h3{font-family:'Fraunces',serif;font-size:1.45rem;font-weight:700;letter-spacing:-0.03em;color:#0f1729;margin-bottom:4px;}
.mbox p{font-size:0.76rem;color:#6b7280;margin-bottom:16px;}
.msum{background:#faf7f2;border:1.5px solid rgba(15,23,41,0.09);border-radius:9px;padding:13px;font-family:'DM Mono',monospace;font-size:0.61rem;line-height:2;color:#6b7280;margin-bottom:16px;white-space:pre-wrap;}
.mbtns{display:flex;gap:8px;justify-content:flex-end;}
.btn-cancel{background:#f0ece4;color:#1a1f2e;border:none;border-radius:8px;padding:8px 16px;font-weight:600;font-size:0.76rem;cursor:pointer;}
.btn-ok{background:#3b6fd4;color:#fff;border:none;border-radius:8px;padding:8px 16px;font-weight:700;font-size:0.76rem;cursor:pointer;box-shadow:0 4px 12px rgba(59,111,212,0.32);}
.toast{position:fixed;bottom:22px;left:50%;transform:translateX(-50%);background:#0f1729;color:#fff;font-weight:600;font-size:0.72rem;padding:10px 18px;border-radius:100px;z-index:9000;white-space:nowrap;box-shadow:0 8px 28px rgba(15,23,41,0.28);animation:tup 0.3s ease;pointer-events:none;}
@keyframes tup{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
.mob-nav{display:none;position:fixed;bottom:0;left:0;right:0;z-index:100;background:rgba(250,247,242,0.97);backdrop-filter:blur(20px);border-top:1px solid rgba(15,23,41,0.1);padding:6px 0 8px;}
.mob-nav-inner{display:flex;justify-content:space-around;}
.mob-tab{display:flex;flex-direction:column;align-items:center;gap:3px;padding:5px 12px;cursor:pointer;border-radius:10px;transition:all 0.15s;min-width:52px;}
.mob-tab.active{background:rgba(59,111,212,0.1);}
.mob-tab-ico{font-size:1.3rem;line-height:1;}
.mob-tab-lbl{font-family:'DM Mono',monospace;font-size:0.46rem;letter-spacing:0.08em;text-transform:uppercase;color:#9ca3af;font-weight:500;}
.mob-tab.active .mob-tab-lbl{color:#3b6fd4;font-weight:700;}
/* ── HOME WEATHER WIDGET ── */
.home-wx{background:linear-gradient(135deg,#0f1729,#162040);padding:18px 36px;display:flex;align-items:center;gap:24px;flex-wrap:wrap;border-bottom:1px solid rgba(255,255,255,0.06);}
.home-wx-label{font-family:'DM Mono',monospace;font-size:0.52rem;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.28);white-space:nowrap;}
.home-wx-search{position:relative;flex:1;min-width:180px;max-width:280px;}
.home-wx-input{width:100%;background:rgba(255,255,255,0.09);border:1.5px solid rgba(255,255,255,0.14);border-radius:9px;padding:9px 13px;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.83rem;color:#fff;outline:none;}
.home-wx-input::placeholder{color:rgba(255,255,255,0.28);}
.home-wx-dd{position:absolute;top:calc(100% + 6px);left:0;right:0;background:#1e2d55;border:1px solid rgba(255,255,255,0.12);border-radius:10px;box-shadow:0 10px 32px rgba(0,0,0,0.4);z-index:200;overflow:hidden;}
.home-wx-opt{padding:9px 13px;cursor:pointer;display:flex;justify-content:space-between;gap:8px;transition:background 0.1s;border-bottom:1px solid rgba(255,255,255,0.05);}
.home-wx-opt:last-child{border-bottom:none;}.home-wx-opt:hover{background:rgba(255,255,255,0.08);}
.home-wx-opt-n{font-size:0.82rem;font-weight:600;color:#fff;}
.home-wx-opt-s{font-size:0.66rem;color:rgba(255,255,255,0.36);}
.home-wx-card{display:flex;align-items:center;gap:16px;}
.home-wx-temp{font-family:'Fraunces',serif;font-size:2.2rem;font-weight:700;color:#fff;line-height:1;letter-spacing:-0.04em;}
.home-wx-unit-sm{font-size:0.9rem;color:rgba(255,255,255,0.38);margin-left:1px;}
.home-wx-info{display:flex;flex-direction:column;gap:1px;}
.home-wx-city{font-family:'DM Mono',monospace;font-size:0.5rem;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.32);}
.home-wx-cond{font-size:0.78rem;color:rgba(255,255,255,0.55);font-weight:500;}
.home-wx-stats{display:flex;gap:12px;}
.home-wx-sv{font-size:0.76rem;font-weight:600;color:rgba(255,255,255,0.7);}
.home-wx-sl{font-family:'DM Mono',monospace;font-size:0.46rem;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.25);margin-top:1px;}
.home-wx-btns{display:flex;gap:6px;margin-left:auto;}
.home-wx-unit-btn{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.4);border-radius:6px;padding:4px 9px;font-family:'DM Mono',monospace;font-size:0.54rem;cursor:pointer;letter-spacing:0.06em;}
.home-wx-clear{background:none;border:1px solid rgba(255,255,255,0.09);color:rgba(255,255,255,0.22);border-radius:6px;padding:4px 9px;font-family:'DM Mono',monospace;font-size:0.5rem;letter-spacing:0.08em;cursor:pointer;}
/* ── BRIEF SCORES STRIP ── */
.brief-scores{margin-bottom:16px;border-radius:11px;overflow:hidden;border:1px solid rgba(15,23,41,0.08);}
.brief-scores-hd{background:#0f1729;padding:9px 14px;display:flex;align-items:center;justify-content:space-between;}
.brief-scores-title{font-family:'DM Mono',monospace;font-size:0.54rem;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.38);}
.brief-scores-league{font-family:'DM Mono',monospace;font-size:0.54rem;letter-spacing:0.08em;text-transform:uppercase;color:#5585e8;}
.brief-scores-games{background:#fff;display:flex;overflow-x:auto;gap:0;-webkit-overflow-scrolling:touch;}
.bs-game{min-width:140px;padding:11px 13px;border-right:1px solid rgba(15,23,41,0.07);flex-shrink:0;}
.bs-game:last-child{border-right:none;}
.bs-status{font-family:'DM Mono',monospace;font-size:0.46rem;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:7px;font-weight:600;}
.bs-status.live{color:#ef4444;}.bs-status.final{color:#6b7280;}.bs-status.upcoming{color:#3b6fd4;}
.bs-team{display:flex;align-items:center;justify-content:space-between;gap:5px;margin-bottom:3px;}
.bs-team:last-child{margin-bottom:0;}
.bs-name{font-size:0.74rem;font-weight:700;color:#0f1729;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;}
.bs-score{font-family:'Fraunces',serif;font-size:0.95rem;font-weight:700;color:#0f1729;min-width:18px;text-align:right;}
.bs-team.loser .bs-name,.bs-team.loser .bs-score{color:#9ca3af;}
.bs-divider{border:none;border-top:1px solid rgba(15,23,41,0.07);margin:4px 0;}
/* ── BRIEF MARKETS STRIP ── */
.brief-markets{background:#0f1729;border-radius:11px;padding:14px 16px;margin-bottom:16px;}
.brief-markets-hd{font-family:'DM Mono',monospace;font-size:0.52rem;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:11px;}
.brief-markets-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;}
.bm-ticker{}
.bm-sym{font-family:'DM Mono',monospace;font-size:0.48rem;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.28);margin-bottom:2px;}
.bm-name{font-size:0.62rem;color:rgba(255,255,255,0.45);margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.bm-price{font-family:'Fraunces',serif;font-size:0.92rem;font-weight:700;color:#fff;line-height:1;margin-bottom:2px;}
.bm-chg{font-family:'DM Mono',monospace;font-size:0.52rem;font-weight:500;}
.bm-chg.up{color:#4ade80;}.bm-chg.down{color:#f87171;}.bm-chg.flat{color:rgba(255,255,255,0.28);}
@media(max-width:860px){
 .sidebar{display:none;}
 .mob-nav{display:block;}
 .main{padding-bottom:72px;}
 .hero{grid-template-columns:1fr;padding:56px 20px 0;}
 .hero-r,.hero-stats{display:none;}
 .features{grid-template-columns:1fr;}
 .fb{border-right:none;border-bottom:1px solid rgba(15,23,41,0.08);}
 .fb:last-child{border-bottom:none;}
 .builder,.gen-wrap,.brief-wrap{padding-left:20px;padding-right:20px;}
 .topbar{padding:0 18px;}
 .trust{padding:10px 18px;}
 .sgrid{grid-template-columns:1fr 1fr;}
 .gen-panel{grid-template-columns:1fr;gap:14px;}
 .bmast{grid-template-columns:1fr;}
 .tg-stories,.tg-stories.n1,.tg-stories.n2,.tg-stories.n3,.tg-stories.n4,.tg-stories.n5,.tg-stories.n6,.tg-stories.n7,.tg-stories.n8,.tg-stories.n9,.tg-stories.n10{grid-template-columns:1fr 1fr;}
 .wx-page,.scores-page,.markets-page,.daily-page{padding:18px;}
 .wx-card-top{grid-template-columns:auto 1fr;}
 .wx-stats-g{grid-template-columns:1fr 1fr;}
 .wx-hourly{grid-template-columns:repeat(3,1fr);}
 .games-grid{grid-template-columns:1fr 1fr;}
 .tickers-grid{grid-template-columns:1fr 1fr;}
 .daily-cards{grid-template-columns:1fr;}
 .loading{padding:44px 18px;}
}
@media(max-width:500px){
 .sgrid,.tickers-grid,.games-grid{grid-template-columns:1fr;}
 .tg-stories,.tg-stories.n2,.tg-stories.n3,.tg-stories.n4,.tg-stories.n5,.tg-stories.n6,.tg-stories.n7,.tg-stories.n8,.tg-stories.n9,.tg-stories.n10{grid-template-columns:1fr;}
}
`;

export default function NewsHall() {
 const [tab, setTab] = useState("home");
 const [topics, setTopics] = useState([]);
 const [input, setInput] = useState("");
 const [phase, setPhase] = useState("idle");
 const [brief, setBrief] = useState(null);
 const [steps, setSteps] = useState([]);
 const [modal, setModal] = useState(false);
 const [toast, setToast] = useState("");
 const [settings, setSettings] = useState({time:"06:30",email:"",fmt:"standard",days:"Every day"});
  const [detectedTz, setDetectedTz] = useState("");
 const briefRef = useRef(null);
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

 // News
 const addTopic = name=>{const v=(name||input).trim();if(!v||topics.includes(v))return;setTopics(p=>[...p,v]);setInput("");};
 const rmTopic = t=>setTopics(p=>p.filter(x=>x!==t));
 const togSugg = n=>topics.includes(n)?rmTopic(n):addTopic(n);
 const showToast= msg=>{setToast(msg);setTimeout(()=>setToast(""),4000);};
 const clean = t=>(t||"").replace(/\*\*(.*?)\*\*/g,"$1").replace(/\*(.*?)\*/g,"$1").replace(/`([^`]+)`/g,"$1").replace(/^[-*]\s*/,"").trim();

 const generate = async () => {
 if(!topics.length){showToast("Add at least one topic first");return;}
 setPhase("loading");setBrief(null);setSteps([]);
 ["Searching live sources...","Pulling top stories...","Writing your digest...","Formatting..."].forEach((s,i)=>setTimeout(()=>setSteps(p=>[...p,s]),i*1000));
 const fmtMap={flash:"3 bullets per section.",concise:"4 bullets main story, names/numbers, context, what's next.",standard:"5 bullets lead, key players, stat, reaction, implication.",deep:"6-7 bullets background, developments, sources, impact, what to watch."};
 const toneMap={sharp:"WSJ/Bloomberg sharp, direct, zero filler.",analytical:"Analytical causes, effects, long-term implications.",casual:"Smart friend texting you the news.",exec:"Executive briefing most critical fact first."};
 const system=`You are NewsHall's AI journalist. ${toneMap[settings.tone]} ONLY use sources with a strong reputation for straight factual news reporting. AVOID sources with strong editorial bias. For politics report ONLY verified facts. Use web_search. Extract real article URLs.`;
 const userMsg=`Today is ${today}. Morning brief for ${topics.length} topics:\n${topics.map((t,i)=>(i+1)+". "+t).join("\n")}\n\nFor each topic find 3-6 of the most important stories from the last 24 hours. Use only reputable straight-news sources. Include the real article URL for every story.\n\nOutput ONLY raw JSON:\n{"headline":"5-6 word brief headline","topics":[{"topic":"name","stories":[{"headline":"headline of the story","summary":"one sentence, max 20 words, just the key fact","source":"outlet name","url":"https://real-article-url"}]}]}\n\nExactly ${topics.length} topic entries in order. Keep summaries tight — one sentence, the single most important fact only.`;
 try{
      const res=await fetch("/api/brief",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({topics,fmt:settings.fmt,today})});
      const parsed=await res.json();
      if(parsed.error)throw new Error(parsed.error);
      if(!Array.isArray(parsed.topics)||!parsed.topics.length)throw new Error("No topics in response");
      setBrief(parsed);setPhase("done");fetchBriefScores(topics);if(detectMarkets(topics))fetchBriefMarkets();setTimeout(()=>briefRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),100);
    }catch(err){setBrief({error:true,raw:String(err.message||err)});setPhase("done");}
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
  useEffect(()=>{ if(tab==="daily"&&!boost&&!boostLoading)fetchBoost(); },[tab]);

  const NAVS=[{id:"home",icon:"news",label:"Morning Brief"},{id:"daily",label:"Daily Boost"}];
 const PTITLES={home:"NewsHall",daily:"Daily Boost"};
 const PSUBS={home:"Your personalized news digest",daily:"Your daily quote, tip & habit"};

 return (<>
 <style>{CSS}</style>
 <div className="shell">
 <aside className="sidebar">
 <div className="sb-logo">
 <div className="sb-logo-text">News<em>Hall</em></div>
 <div className="sb-logo-sub">Your morning intelligence</div>
 </div>
 <nav className="sb-nav">
 <div className="sb-lbl">Menu</div>
 {NAVS.map(item=>(
 <div key={item.id} className={`sb-item${tab===item.id?" active":""}`} onClick={()=>setTab(item.id)}>
 {item.label}
 </div>
 ))}
 </nav>
 <div className="sb-foot">
 <div className="sb-date">{today}</div>
 <div className="live-row"><span className="ldot"></span>Live</div>
 </div>
 </aside>

 <div className="main">
 <div className="topbar">
 <div className="tb-title">{PTITLES[tab]}</div>
 <div className="tb-sub">{PSUBS[tab]}</div>
 </div>

 {/* HOME */}
 <div className={`page${tab==="home"?" active":""}`}>
 <section className="hero">
 <div className="hero-l">
 <div className="kicker"><span style={{width:4,height:4,borderRadius:"50%",background:"#93b4f8",display:"inline-block",flexShrink:0}}></span>Fact-first - Editorially neutral - Live sources - Daily</div>
 <h1 className="hero-h1">Your world,<br/>in one <em>morning</em><br/>read.</h1>
 <p className="hero-sub">Every topic you care about. One brief. Every morning. Curated from trusted, straight-news sources fully informed, without the noise.</p>
 <div className="hero-btns">
 <button className="btn-p" onClick={()=>document.getElementById("builder")?.scrollIntoView({behavior:"smooth"})}>Build my brief</button>
 <button className="btn-g" onClick={()=>document.getElementById("builder")?.scrollIntoView({behavior:"smooth"})}>See how it works</button>
 </div>
 </div>
 <div className="hero-r">
 <div className="prev-card">
 <div className="prev-hd"><div className="prev-title"> Your Morning Brief</div><div className="prev-time">6:30 AM - Today</div></div>
 {[{tag:"Formula 1",txt:<><strong>Verstappen leads FP2 at Suzuka by 0.3s</strong>, Red Bull chasing balance</>},{tag:"NFL",txt:<><strong>Quarterback market heating up</strong> league-wide this offseason</>},{tag:"Markets",txt:<><strong>S&amp;P 500 +0.6%</strong>, Fed signals rate pause through Q2</>},{tag:"Tech & AI",txt:<><strong>New model launch</strong> shifts the competitive landscape among labs</>}].map((item,i)=>(
 <div className="prev-item" key={i}><span className="prev-tag">{item.tag}</span><div className="prev-txt">{item.txt}</div></div>
 ))}
 </div>
 </div>
 <div className="hero-stats">
 {[["Any","Topics"],["1","Brief per morning"],["100%","Live sourced & cited"]].map(([n,l])=>(
 <div className="hstat" key={l}><div className="hstat-n">{n}</div><div className="hstat-l">{l}</div></div>
 ))}
 </div>
 </section>
 {/* HOME WEATHER WIDGET */}
 <div className="home-wx">
   <span className="home-wx-label">Weather</span>
   <div className="home-wx-search">
     <input
       className="home-wx-input"
       placeholder="Search city..."
       value={wxIn}
       onChange={e=>searchCities(e.target.value)}
       autoComplete="off"
       spellCheck="false"
     />
     {wxSuggs.length>0&&(
       <div className="home-wx-dd">
         {wxSuggs.map((c,i)=>(
           <div key={i} className="home-wx-opt" onMouseDown={e=>{e.preventDefault();pickCity(c);}}>
             <span className="home-wx-opt-n">{c.n}</span>
             <span className="home-wx-opt-s">{[c.s,c.c].filter(Boolean).join(", ")}</span>
           </div>
         ))}
       </div>
     )}
   </div>
   {wx==="loading"&&<div className="spin" style={{width:18,height:18,borderWidth:2,margin:0,flexShrink:0}}/>}
   {wx&&wx.city&&(
     <div className="home-wx-card">
       <div>
         <div className="home-wx-temp">{showTN(wx.tempC)}<span className="home-wx-unit-sm">°{wUnit}</span></div>
       </div>
       <div className="home-wx-info">
         <div className="home-wx-city">{wx.city}</div>
         <div className="home-wx-cond">{wDesc(wx.code)}</div>
       </div>
       <div className="home-wx-stats">
         <div><div className="home-wx-sv">{showT(wx.feelsC)}</div><div className="home-wx-sl">Feels like</div></div>
         <div><div className="home-wx-sv">{wx.wind} mph</div><div className="home-wx-sl">Wind</div></div>
         <div><div className="home-wx-sv">{wx.humidity}%</div><div className="home-wx-sl">Humidity</div></div>
       </div>
       <div className="home-wx-btns">
         <button className="home-wx-unit-btn" onClick={()=>setWUnit(u=>u==="F"?"C":"F")}>°{wUnit==="F"?"C":"F"}</button>
         <button className="home-wx-clear" onClick={()=>{setWx("idle");setWxIn("");setWxSuggs([]);}}>Clear</button>
       </div>
     </div>
   )}
 </div>
 <div className="trust"><span></span><p><strong>Fact-first, editorially neutral.</strong> NewsHall sources exclusively from outlets with a demonstrated commitment to straight-news reporting. We deliberately avoid sources with strong editorial bias. You get the facts, not the spin.</p></div>
 <div className="features">
 {[{cls:"fi-b",title:"Fully personalized",body:"Choose from popular topics or type anything. Your brief, your way."},{cls:"fi-c",title:"Linked to the source",body:"Every story links directly to the original article. Read the full piece, verify the facts."},{cls:"fi-g",title:"Ready at dawn",body:"Set your time once. Your personalized digest lands before your alarm every morning."}].map(f=>(
 <div className="fb" key={f.title}><div className={`fi ${f.cls}`}>{f.icon}</div><div><h4>{f.title}</h4><p>{f.body}</p></div></div>
 ))}
 </div>
 <div id="builder" className="builder">
 <div className="step-hd">
 <div className="step-tag"><span className="step-n">01</span> Choose topics</div>
 <h2 className="step-h2">What do you want to wake up to?</h2>
 <p className="step-sub">Pick from popular categories, or type anything as broad or specific as you want.</p>
 </div>
 <div className="search-wrap">
 <span className="search-ico"></span>
 <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTopic()} placeholder="Search topic"/>
 <button className="add-btn" onClick={()=>addTopic()}>Add topic</button>
 </div>
 <div className="sugg-lbl">Popular topics click to add</div>
 <div className="sugg-wrap">
 {SUGGESTIONS.map(s=><div key={s.name} className={`sugg${topics.includes(s.name)?" on":""}`} onClick={()=>togSugg(s.name)}>{s.name}</div>)}
 </div>
 <div className="chips">
 <span className="chips-lbl">Your topics ({topics.length}):</span>
 {topics.length===0?<span style={{fontSize:"0.72rem",color:"#b0b8c4"}}>Nothing yet add topics above</span>:topics.map(t=><span key={t} className="chip">{t} <span className="chip-x" onClick={()=>rmTopic(t)}>x</span></span>)}
 </div>
 <div className="step-hd" style={{marginTop:48}}>
 <div className="step-tag"><span className="step-n">02</span> Set delivery</div>
 <h2 className="step-h2">When should it land?</h2>
 <p className="step-sub">Set your time once and we'll have it ready before your first coffee.</p>
 </div>
 <div className="sgrid">
 {[{lbl:"Delivery time",key:"time",type:"time"},{lbl:"Your email",key:"email",type:"email",ph:"you@email.com"},{lbl:"Brief length",key:"fmt",type:"select",opts:[["flash","Flash 60 sec"],["concise","Concise 2 min"],["standard","Standard 5 min"],["deep","Deep dive 10 min"]]},{lbl:"Delivery days",key:"days",type:"select",opts:["Every day","Weekdays only","Weekends only"]}].map(f=>(
 <div key={f.key} className="sblock"><div className="slbl">{f.lbl}</div>{f.type==="select"?<select className="sinput" value={settings[f.key]} onChange={e=>setSettings(s=>({...s,[f.key]:e.target.value}))}>{f.opts.map(o=>Array.isArray(o)?<option key={o[0]} value={o[0]}>{o[1]}</option>:<option key={o}>{o}</option>)}</select>:<input type={f.type} className="sinput" value={settings[f.key]} placeholder={f.ph||""} onChange={e=>setSettings(s=>({...s,[f.key]:e.target.value}))}/>}</div>
 ))}
 </div>
 </div>
 <div className="gen-wrap">
 <div className="gen-panel">
 <div>
 <div className="gen-title">Ready to preview?</div>
 <div className="gen-sub">{topics.length===0?"Add topics above first":`${topics.length} topic${topics.length>1?"s":""} ready generate your digest`}</div>
 </div>
 <div className="gen-btns">
 <button className="btn-gen" onClick={generate} disabled={phase==="loading"}>{phase==="loading"?"Generating...":"Generate brief"}</button>
 <button className="btn-sched" onClick={()=>{if(!topics.length){showToast("Add topics first");return;}setModal(true);}}>Schedule daily</button>
 </div>
 </div>
 </div>
 {phase==="loading"&&(<div className="loading"><div className="spin"/><div className="ld-h">Building your brief</div><div className="ld-s">Searching live sources for {topics.length} topic{topics.length>1?"s":""}...</div><div className="ld-steps">{steps.map((s,i)=><div key={i} className="ld-step">{s}</div>)}</div></div>)}
 {phase==="done"&&brief&&(
 <div className="brief-wrap" ref={briefRef}>
 {brief.error?(<div className="err-box"><div className="err-msg"> Could not generate brief please try again.</div>{brief.raw&&<pre className="err-pre">{brief.raw}</pre>}</div>):(
 <><div className="bmast"><div><div className="bkicker">NewsHall - {today}</div><div className="bhl">{brief.headline||"Your Morning Brief"}</div>{brief.summary&&<p className="bsummary">{brief.summary}</p>}<div className="bmeta">{topics.length} topics - {new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})} - <span style={{color:"#3b6fd4"}}> Fact-first</span></div></div><button className="brefresh" onClick={generate}>Refresh</button></div>
{Object.keys(briefScores).length>0&&(
<div style={{marginBottom:20}}>
{Object.entries(briefScores).map(([league,games])=>(
<div key={league} className="brief-scores">
<div className="brief-scores-hd">
<span className="brief-scores-title">Live Scores</span>
<span className="brief-scores-league">{league}</span>
</div>
<div className="brief-scores-games">
{games.map((g,i)=>{
const isFinal=g.status==="FINAL";const isLive=g.status==="LIVE";
const hScore=g.homeScore!=null?String(g.homeScore):null;
const aScore=g.awayScore!=null?String(g.awayScore):null;
const homeWin=isFinal&&hScore!=null&&aScore!=null&&Number(hScore)>Number(aScore);
const awayWin=isFinal&&hScore!=null&&aScore!=null&&Number(aScore)>Number(hScore);
return(<div key={i} className="bs-game">
<div className={`bs-status ${isLive?"live":isFinal?"final":"upcoming"}`}>{isLive?"LIVE":isFinal?"FINAL":g.detail||"UPCOMING"}</div>
<div className={`bs-team${awayWin?" winner":isFinal&&!awayWin?" loser":""}`}><span className="bs-name">{g.away}</span>{aScore&&<span className="bs-score">{aScore}</span>}</div>
<hr className="bs-divider"/>
<div className={`bs-team${homeWin?" winner":isFinal&&!homeWin?" loser":""}`}><span className="bs-name">{g.home}</span>{hScore&&<span className="bs-score">{hScore}</span>}</div>
</div>);
})}
</div>
</div>
))}
</div>
)}
{briefMarkets&&Object.keys(briefMarkets).length>0&&(
<div className="brief-markets">
<div className="brief-markets-hd">Markets</div>
<div className="brief-markets-grid">
{[{sym:"^GSPC",label:"S&P 500"},{sym:"^DJI",label:"Dow"},{sym:"^IXIC",label:"Nasdaq"},{sym:"GC=F",label:"Gold"},{sym:"CL=F",label:"Oil"},{sym:"BTC-USD",label:"Bitcoin"},{sym:"ETH-USD",label:"Ethereum"}].map(({sym,label})=>{
  const d=briefMarkets[sym];
  if(!d||d.error)return null;
  const chg=d.price&&d.prev?d.price-d.prev:null;
  const pct=chg&&d.prev?(chg/d.prev)*100:null;
  const dir=chg==null?"flat":chg>0?"up":chg<0?"down":"flat";
  const fmt=p=>{if(!p)return"--";if(p>10000)return p.toLocaleString("en-US",{maximumFractionDigits:0});if(p>100)return p.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});return p.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:4});};
  return(<div key={sym} className="bm-ticker"><div className="bm-sym">{label}</div><div className="bm-price">{fmt(d.price)}</div><div className={`bm-chg ${dir}`}>{dir==="up"?"+":" "}{pct!=null?pct.toFixed(2)+"%":"--"}</div></div>);
})}
</div>
</div>
)}
 <div>{(brief.topics||[]).map((tg,ti)=>{const stories=Array.isArray(tg.stories)?tg.stories:[];return(<div key={ti} className="topic-group"><div className="tg-header"><span className="tg-name">{tg.topic}</span><span className="tg-count">{stories.length} {stories.length===1?"story":"stories"}</span></div><div className="story-list">{stories.map((st,si)=>{const hasUrl=st.url&&st.url.startsWith("http");const url=hasUrl?st.url:"https://news.google.com/search?q="+encodeURIComponent(clean(st.headline)+" "+(st.source||""));return(<a key={si} className="story-row" href={url} target="_blank" rel="noopener noreferrer"><div className="story-row-main"><div className="story-row-hl">{clean(st.headline)}</div>{st.summary&&<div className="story-row-sum">{clean(st.summary)}</div>}</div><div className="story-row-meta">{st.source&&<span className="story-row-src">{st.source}</span>}<span className="story-row-arrow">Read</span></div></a>);})}</div></div>);})}</div>
 {brief.watchToday&&(<div className="watch"><div><div className="watch-lbl">Watch today</div><div className="watch-txt">{clean(brief.watchToday)}</div></div></div>)}
 {brief.topics?.some(tg=>tg.stories?.some(s=>s.source))&&(<div className="srcfooter"><strong>Sources </strong>{[...new Set(brief.topics.flatMap(tg=>(tg.stories||[]).map(s=>s.source)).filter(Boolean))].join(" - ")}</div>)}</>
 )}
 </div>
 )}
 </div>

          {/* DAILY BOOST */}
          <div className={`page${tab==="daily"?" active":""}`}>
            <div className="daily-page">

              {boostLoading && (
                <div style={{textAlign:"center",padding:"60px 0"}}>
                  <div className="spin" style={{margin:"0 auto 16px"}}/>
                  <div style={{fontFamily:"'Fraunces',serif",fontSize:"1.1rem",fontWeight:700,color:"#0f1729",marginBottom:4}}>Finding today's content</div>
                  <div style={{fontSize:"0.78rem",color:"#9ca3af"}}>Searching Harvard Health, Mayo Clinic, and more...</div>
                </div>
              )}

              {boostError && (
                <div style={{textAlign:"center",padding:"48px 0"}}>
                  <div style={{fontSize:"0.88rem",color:"#e8654a",marginBottom:12}}>Could not load today's content</div>
                  <button className="load-btn" onClick={fetchBoost}>Try again</button>
                </div>
              )}

              {boost && !boostLoading && (
                <>
                  <div className="daily-hero">
                    <div className="daily-date">{today}</div>
                    <div style={{fontFamily:"'Fraunces',serif",fontSize:"4rem",lineHeight:"0.7",color:"rgba(85,133,232,0.25)",marginBottom:8}}>"</div>
                    <div className="daily-q">{boost.quote}</div>
                    <div className="daily-a">- {boost.author}</div>
                  </div>

                  <div className="daily-cards">
                    <div className="dc">
                      <div className="dc-lbl">Health Tip</div>
                      <div className="dc-title">Today's tip</div>
                      <div className="dc-text">{boost.tip?.text}</div>
                      {boost.tip?.url && (
                        <a href={boost.tip.url} target="_blank" rel="noopener noreferrer" style={{display:"inline-block",marginTop:12,fontFamily:"'DM Mono',monospace",fontSize:"0.52rem",letterSpacing:"0.08em",textTransform:"uppercase",color:"#3b6fd4",textDecoration:"none",borderBottom:"1px solid rgba(59,111,212,0.25)"}}>
                          {boost.tip.source || "Read source"}
                        </a>
                      )}
                    </div>
                    <div className="dc">
                      <div className="dc-lbl">Daily Habit</div>
                      <div className="dc-title">Build this habit</div>
                      <div className="dc-text">{boost.habit?.text}</div>
                      {boost.habit?.url && (
                        <a href={boost.habit.url} target="_blank" rel="noopener noreferrer" style={{display:"inline-block",marginTop:12,fontFamily:"'DM Mono',monospace",fontSize:"0.52rem",letterSpacing:"0.08em",textTransform:"uppercase",color:"#3b6fd4",textDecoration:"none",borderBottom:"1px solid rgba(59,111,212,0.25)"}}>
                          {boost.habit.source || "Read source"}
                        </a>
                      )}
                    </div>
                    <div className="dc">
                      <div className="dc-lbl">Challenge</div>
                      <div className="dc-title">Push yourself</div>
                      <div className="dc-text">{boost.challenge?.text}</div>
                      {boost.challenge?.url && (
                        <a href={boost.challenge.url} target="_blank" rel="noopener noreferrer" style={{display:"inline-block",marginTop:12,fontFamily:"'DM Mono',monospace",fontSize:"0.52rem",letterSpacing:"0.08em",textTransform:"uppercase",color:"#3b6fd4",textDecoration:"none",borderBottom:"1px solid rgba(59,111,212,0.25)"}}>
                          {boost.challenge.source || "Read source"}
                        </a>
                      )}
                    </div>
                  </div>

                  <button className="load-btn" style={{marginTop:20,background:"#0f1729"}} onClick={()=>{setBoost(null);fetchBoost();}}>
                    Refresh for new content
                  </button>
                </>
              )}

            </div>
          </div>

 </div>
 </div>

 {/* MOBILE BOTTOM NAV */}
 <nav className="mob-nav">
 <div className="mob-nav-inner">
 {NAVS.map(item=>(
 <div key={item.id} className={`mob-tab${tab===item.id?" active":""}`} onClick={()=>setTab(item.id)}>
 
 <span className="mob-tab-lbl">{item.label.split(" ")[0]}</span>
 </div>
 ))}
 </div>
 </nav>

 {modal&&(<div className="mover" onClick={e=>e.target===e.currentTarget&&setModal(false)}><div className="mbox"><button className="mx" onClick={()=>setModal(false)}></button><h3>Schedule your brief</h3><p>Your personalized digest, delivered every morning before you wake up.</p><div className="msum">{`TOPICS   ${topics.join(", ")}\n\nTIME     ${settings.time}${detectedTz ? " ("+detectedTz+")" : ""}\nDAYS     ${settings.days}\nEMAIL    ${settings.email||"not entered"}\nFORMAT   ${settings.fmt}`}</div><div className="mbtns"><button className="btn-cancel" onClick={()=>setModal(false)}>Cancel</button><button className="btn-ok" onClick={()=>{if(!settings.email){setModal(false);showToast("Enter your email first");return;}setModal(false);showToast("Scheduled " + topics.length + " topics to " + settings.email + " daily");}}>Confirm</button></div></div></div>)}
 {toast&&<div className="toast">{toast}</div>}
 </>);
}

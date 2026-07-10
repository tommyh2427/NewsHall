'use client';
import { useState, useRef, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import { CSS } from "./newshall-styles";

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

 // Landing-page chrome: glass nav on scroll + top scroll-progress bar.
 // Progress width is written straight to the DOM (ref) so scrolling never re-renders.
 const [lpScrolled, setLpScrolled] = useState(false);
 const lpProgressRef = useRef(null);
 useEffect(()=>{
   const onScroll=()=>{
     const y=window.scrollY;
     setLpScrolled(prev=>{const next=y>24;return next===prev?prev:next;});
     const el=lpProgressRef.current;
     if(el){
       const max=document.documentElement.scrollHeight-window.innerHeight;
       el.style.width=max>0?`${Math.min(100,(y/max)*100)}%`:"0%";
     }
   };
   onScroll();
   window.addEventListener('scroll',onScroll,{passive:true});
   return()=>window.removeEventListener('scroll',onScroll);
 },[]);

 useEffect(()=>{
   supabase.auth.getUser().then(({data:{user}})=>setUser(user??null));
   const {data:{subscription}} = supabase.auth.onAuthStateChange((_,session)=>{
     setUser(session?.user??null);
     if(session?.user) loadUserData(session.user);
   });
   return ()=>subscription.unsubscribe();
 },[]);

 useEffect(()=>{
   if(user) return;
   const obs = new IntersectionObserver(
     entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('in-view'); }),
     { threshold:0.1, rootMargin:'0px 0px -40px 0px' }
   );
   document.querySelectorAll('.anim').forEach(el => obs.observe(el));
   return () => obs.disconnect();
 },[user]);

 const loadOgImages = (briefData) => {
   // Lead photo is now baked server-side (tg.leadImage). Only client-scrape for
   // older cached briefs that predate that — skip any topic that already has one.
   const items = [];
   for (const tg of (briefData?.topics||[])) {
     if (tg.leadImage) continue;
     const lead = tg.stories?.[0];
     if (lead?.url && String(lead.url).startsWith("http")) items.push({url:lead.url, topic:tg.topic||""});
   }
   if (!items.length) return;
   fetch("/api/og-images",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({urls:items})})
     .then(r=>r.json()).then(({images})=>setOgImages(images||{})).catch(()=>{});
 };

 const loadUserData = async (u) => {
   // Fetch all three independent reads in parallel (was 3 serial round-trips)
   const [prefs, briefRes, settingsRes] = await Promise.all([
     fetch('/api/preferences').then(r=>r.json()).catch(()=>null),
     supabase.from("briefs").select("content,generated_at").eq("user_id",u.id).single(),
     supabase.from("user_settings").select("topics,delivery_time").eq("user_id",u.id).single(),
   ]);
   const savedBrief = briefRes?.data;
   const userSettings = settingsRes?.data;

   // Apply saved preferences
   if(prefs?.topics?.length) setTopics(prefs.topics);
   if(prefs?.settings) setSettings(s=>({...s,...prefs.settings}));

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

   // Apply delivery time + topics from user_settings (fetched in parallel above)
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

 // Saves delivery time preference to Supabase — no push permission needed.
 // Used by the Profile "Save settings" button.
 const saveDeliveryTime = async () => {
   if(!user) return;
   try {
     const [h, m] = deliveryTime.split(":").map(Number);
     const utcOffset = new Date().getTimezoneOffset();
     const deliveryHourUtc = ((h * 60 + (m||0) + utcOffset) / 60 + 24) % 24 | 0;
     const now = new Date().toISOString();
     await supabase.from("user_settings").upsert(
       { user_id: user.id, delivery_time: deliveryTime, delivery_hour_utc: deliveryHourUtc, topics, updated_at: now },
       { onConflict: "user_id" }
     );
     showToast("Saved — your brief will generate at " + deliveryTime + " each morning.");
   } catch(e) {
     showToast("Could not save — please try again.");
   }
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
 const MAX_TOPICS = 10;
 const addTopic = name=>{
   const v=(name||input).trim();
   if(!v||topics.includes(v))return;
   if(topics.length>=MAX_TOPICS){showToast("Maximum 10 topics — remove one to add another");return;}
   setTopics(p=>[...p,v]);setInput("");
 };
 const rmTopic = t=>setTopics(p=>p.filter(x=>x!==t));
 const togSugg = n=>topics.includes(n)?rmTopic(n):addTopic(n);
 const showToast= (msg,dur=4000)=>{setToast(msg);setTimeout(()=>setToast(""),dur);};
 const shareBrief = async () => {
   const url = (typeof window!=="undefined" ? window.location.origin : "https://newshall.app");
   const data = {
     title: "NewsHall — Your Morning Brief",
     text: "I get my morning news on NewsHall — my topics, trusted sources, one quick brief. No noise, no opinions.",
     url,
   };
   try {
     if (typeof navigator!=="undefined" && navigator.share) { await navigator.share(data); }
     else { await navigator.clipboard.writeText(url); showToast("Link copied — share it anywhere!"); }
   } catch(e) {
     if (e && e.name === "AbortError") return; // user dismissed the share sheet
     try { await navigator.clipboard.writeText(url); showToast("Link copied!"); } catch {}
   }
 };
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
   // World / Politics
   "world news":       "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900&q=80",
   "us politics":      "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=900&q=80",
   "politics":         "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=900&q=80",
   // Tech
   "tech & ai":        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=900&q=80",
   "technology":       "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=900&q=80",
   "gaming":           "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=900&q=80",
   "auto & evs":       "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=900&q=80",
   "startups":         "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=900&q=80",
   // Business / Finance
   "stock market":     "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900&q=80",
   "markets":          "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900&q=80",
   "business":         "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80",
   "crypto":           "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=900&q=80",
   "personal finance": "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=900&q=80",
   "real estate":      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=80",
   "economy":          "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900&q=80",
   "deals & m&a":      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=80",
   "women in business":"https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=900&q=80",
   // Science / Health
   "science":          "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=900&q=80",
   "climate":          "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=900&q=80",
   "space":            "https://images.unsplash.com/photo-1446776709462-d6b525c57bd3?w=900&q=80",
   "health & wellness":"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80",
   "health":           "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80",
   "mental health":    "https://images.unsplash.com/photo-1499728603263-13726abce5fd?w=900&q=80",
   "nutrition":        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=900&q=80",
   "fitness":          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80",
   // Sports — every ID verified 200 OK
   "sports":           "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=900&q=80",
   "nba":              "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=900&q=80",
   "nfl":              "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=900&q=80",
   "mlb":              "https://images.unsplash.com/photo-1529768167801-9173d94c2a42?w=900&q=80",
   "nhl":              "https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=900&q=80",
   "soccer":           "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=900&q=80",
   "golf":             "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=900&q=80",
   "tennis":           "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=900&q=80",
   "formula 1":        "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&q=80",
   "formula one":      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&q=80",
   "mma / ufc":        "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=900&q=80",
   "mma":              "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=900&q=80",
   "ufc":              "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=900&q=80",
   "wnba":             "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=900&q=80",
   // Entertainment — every ID verified 200 OK
   "entertainment":    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=900&q=80",
   "film & tv":        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=900&q=80",
   "music":            "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&q=80",
   "celebrity news":   "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&q=80",
   "books":            "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=900&q=80",
   "fashion & style":  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=80",
   "beauty":           "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&q=80",
   // Lifestyle
   "travel":           "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=900&q=80",
   "food & dining":    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80",
   "education":        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&q=80",
   "parenting":        "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=900&q=80",
   "home & design":    "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=900&q=80",
   "relationships":    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=80",
 };

 // Category keyword → image. Catches niche/custom topics (farming, space, etc.)
 // that have no exact curated entry, so they show a relevant photo not a gradient.
 const TOPIC_KEYWORD_IMAGES = [
   { kw:["farm","agricultur","crop","livestock","ranch","harvest","dairy","grain"], src:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=80" },
   { kw:["space","nasa","astronom","rocket","satellite","galaxy","mars","spacex","cosmos"], src:"https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=900&q=80" },
   { kw:["energy","oil","gas ","solar","wind power","nuclear","power grid","renewable","petroleum"], src:"https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=900&q=80" },
   { kw:["election","campaign","senate","congress","ballot","primary","governor","parliament"], src:"https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=900&q=80" },
   { kw:["ai","artificial intelligence","machine learning","chatgpt","openai","llm","robot"], src:"https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=900&q=80" },
   { kw:["weather","storm","hurricane","tornado","forecast","flood"], src:"https://images.unsplash.com/photo-1592210454359-9043f067919b?w=900&q=80" },
 ];

 const getTopicImage = (topic) => {
   const key = (topic||"").toLowerCase().trim();
   // Curated Unsplash fallback by topic
   if (CLIENT_TOPIC_IMAGES[key]) return { type:"img", src: CLIENT_TOPIC_IMAGES[key] };
   // Keyword match — catches "2025 NBA Playoffs" → nba image, etc.
   for (const [k, src] of Object.entries(CLIENT_TOPIC_IMAGES)) {
     if (key.includes(k) || k.includes(key)) return { type:"img", src };
   }
   // Category keyword match — catches niche topics (farming, space, energy…)
   for (const { kw, src } of TOPIC_KEYWORD_IMAGES) {
     if (kw.some(w => key.includes(w))) return { type:"img", src };
   }
   // Unknown topic — gradient
   return { type:"gradient", css: getTopicGradient(key) };
 };

 // Lead story image: real article photo if we have one, else curated/gradient by topic
 const resolveLeadImage = (url, topic) => {
   if (url && ogImages[url]) return { type:"img", src: ogImages[url] };
   return getTopicImage(topic);
 };
 // Secondary thumbnail: real article photo if available, else a clean topic gradient
 const resolveThumb = (url, topic) => {
   if (url && ogImages[url]) return { type:"img", src: ogImages[url] };
   return { type:"gradient", css: getTopicGradient(topic) };
 };

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

 const resolveSource = (source) => {
   const key = (source||'').toLowerCase().trim();
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
   return meta;
 };

 const SourceLogo = ({source, dark=false}) => {
   const meta = resolveSource(source);
   // Unknown source — show raw name trimmed, grey pill. Never render empty.
   const abbr = meta?.abbr || (source||'').replace(/^[Tt]he /i,'').trim().slice(0,14);
   if (!abbr) return null;
   const brandColor = meta?.color || "#6b7280";

   if (dark) {
     // On the dark hero image: plain semi-transparent text, visually distinct from LEAD STORY badge
     return (
       <span style={{fontSize:'0.62rem',fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:'rgba(255,255,255,0.85)',whiteSpace:'nowrap'}}>{abbr}</span>
     );
   }
   // Light mode: colored pill
   const pillBg = brandColor === "#1a1a1a" ? "#f3f4f6" : brandColor + "18";
   return (
     <span style={{display:'inline-flex',alignItems:'center',background:pillBg,borderRadius:5,padding:'3px 8px'}}>
       <span style={{fontSize:'0.55rem',fontWeight:800,letterSpacing:'0.06em',textTransform:'uppercase',color:brandColor,whiteSpace:'nowrap',lineHeight:1}}>{abbr}</span>
     </span>
   );
 };

 const clean = t=>{
   let s=(t||"").replace(/\*\*(.*?)\*\*/g,"$1").replace(/\*(.*?)\*/g,"$1").replace(/`([^`]+)`/g,"$1").replace(/^[-*]\s*/,"").replace(/\s+/g," ").trim();
   // Collapse "Headline — Headline Publisher" duplication (Google News artifact)
   const norm=x=>x.toLowerCase().replace(/[^a-z0-9 ]/g,"").replace(/\s+/g," ").trim();
   for(let p=0;p<3;p++){
     let changed=false;
     for(const sep of [" — "," – "," - "]){
       const i=s.indexOf(sep);
       if(i>10){
         const a=s.slice(0,i).trim(),b=s.slice(i+sep.length).trim();
         const na=norm(a),nb=norm(b);
         if(na&&nb&&(nb.startsWith(na)||na.startsWith(nb))){s=na.length<=nb.length?a:b;changed=true;break;}
       }
     }
     if(!changed)break;
   }
   return s;
 };

 const getReadingTime = (briefData) => {
   if(!briefData?.topics) return null;
   let words = 0;
   for(const tg of briefData.topics){
     for(const st of (tg.stories||[])){
       words += (st.headline||"").split(/\s+/).length;
       words += (st.summary||"").split(/\s+/).length;
       words += (st.context||"").split(/\s+/).length;
     }
   }
   const mins = Math.max(1, Math.round(words / 238));
   return `${mins} min read`;
 };

 const getWatchItems = (briefData) => {
   if(!briefData?.topics) return [];
   const items = [];
   for(const tg of briefData.topics){
     for(const w of (tg.watch_for||[])){
       if(w && items.length < 5) items.push({text:w, topic:tg.topic});
     }
   }
   return items;
 };

 const generate = async () => {
   if(!topics.length){showToast("Add at least one topic first");return;}
   if(user) setTab("brief");

   // Stale-while-revalidate: if we already have a brief, keep showing it while we refresh in background
   const isRefresh = phase==="done" && brief && !brief.error;

   setSteps([]);
   setIsStreaming(true);
   setStreamedCount(0);

   if(!isRefresh){
     // First generation — show full loading screen
     setPhase("loading");
     setBrief(null);
     setOgImages({});
     const stepMessages=["Searching live sources...","Scanning "+topics.length+" topic"+(topics.length>1?"s":"")+"...","Filtering for relevance...","Verifying source neutrality...","Writing your brief...","Almost ready..."];
     stepMessages.forEach((s,i)=>setTimeout(()=>setSteps(p=>[...p,s]),i*1800));
   }
   // For refresh: keep existing brief visible — user can keep reading while we fetch

   // Hard 90s timeout — loading screen can never get permanently stuck
   const abortCtrl = new AbortController();
   const timeoutId = setTimeout(()=>abortCtrl.abort(),90000);
   try{
     const res=await fetch("/api/brief",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({topics,today}),signal:abortCtrl.signal});
     if(!res.ok||!res.body)throw new Error(`Server error ${res.status} — try again`);
     const reader=res.body.getReader();
     const decoder=new TextDecoder();
     let buf="";
     let incomingBrief={topics:[],headline:"Your Morning Brief"};
     let scrolled=false;
     let fatalErr=null;
     outer:while(true){
       const{done,value}=await reader.read();
       if(done)break;
       buf+=decoder.decode(value,{stream:true});
       const lines=buf.split("\n");
       buf=lines.pop()||"";
       for(const line of lines){
         if(!line.startsWith("data: "))continue;
         let msg;
         try{ msg=JSON.parse(line.slice(6)); }catch{ continue; } // skip malformed lines only
         if(msg.type==="topic"){
           incomingBrief={...incomingBrief,topics:[...incomingBrief.topics,msg.topic]};
           setStreamedCount(c=>c+1);
           if(!isRefresh){
             setBrief({...incomingBrief});
             setPhase("done");
             if(!scrolled){scrolled=true;setTimeout(()=>briefRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),100);}
           }
         }else if(msg.type==="done"){
           incomingBrief={...incomingBrief,headline:msg.headline};
           setBrief({...incomingBrief});
           setPhase("done");
           setIsStreaming(false);
           saveUserData(incomingBrief,topics);
           loadOgImages(incomingBrief);
           try{localStorage.setItem("nh_pending_brief",JSON.stringify({brief:incomingBrief,topics,ts:Date.now()}));}catch(_){}
           setCooldown(15);const cd=setInterval(()=>setCooldown(p=>{if(p<=1){clearInterval(cd);return 0;}return p-1;}),1000);
           if(isRefresh) showToast("Brief updated");
           break outer;
         }else if(msg.type==="error"){
           fatalErr=msg.message; break outer;
         }
       }
     }
     clearTimeout(timeoutId);
     if(fatalErr) throw new Error(fatalErr);
     setIsStreaming(false);
   }catch(err){
     clearTimeout(timeoutId);
     setIsStreaming(false);
     const rawMsg=err?.name==="AbortError"?"Request timed out — try again":String(err.message||err);
     // rate_limit: prefix means Groq hit its daily token cap
     const isRateLimit=rawMsg.startsWith("rate_limit:");
     const friendlyMsg=isRateLimit?rawMsg.slice(11):rawMsg;
     if(!isRefresh){ setBrief({error:true,raw:friendlyMsg}); setPhase("done"); }
     else showToast(isRateLimit?friendlyMsg:"Refresh failed — try again", isRateLimit?8000:4000);
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

 <div className={`topbar${!user?" lp":""}${!user&&lpScrolled?" scrolled":""}`}>
   <div className="tb-wordmark">
     <div className="tb-title">NewsHall</div>
     <div className="tb-edition">Morning Intelligence</div>
   </div>
   {!user&&(
     <nav className="lp-nav">
       {[["#live","Live"],["#why","Why"],["#how","How it works"]].map(([href,label])=>(
         <a key={href} href={href} onClick={e=>{e.preventDefault();document.querySelector(href)?.scrollIntoView({behavior:"smooth"});}}>{label}</a>
       ))}
     </nav>
   )}
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
   {!user&&<div className="lp-progress" ref={lpProgressRef}/>}
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
       <div className="sk-wrap">
         <div className="sk-status">
           <div className="sk-status-spin"/>
           <span className="sk-status-txt">Building your brief</span>
           <span className="sk-status-sub">· scanning live sources across {topics.length} topic{topics.length!==1?"s":""}</span>
         </div>
         <div className="sk-mast">
           <span className="sk sk-kicker"/>
           <span className="sk sk-hl"/>
           <span className="sk sk-hl two"/>
           <span className="sk sk-meta"/>
         </div>
         {Array.from({length:Math.min(Math.max(topics.length,2),3)}).map((_,ti)=>(
           <div className="sk-topic" key={ti}>
             <div className="sk-topic-hd">
               <span className="sk sk-topic-name"/>
               <span className="sk sk-topic-count"/>
             </div>
             <div className="sk-feat">
               <span className="sk sk-feat-img"/>
               <div className="sk-feat-body">
                 <span className="sk sk-feat-hl"/>
                 <span className="sk sk-feat-hl two"/>
                 <span className="sk sk-feat-sum"/>
                 <span className="sk sk-feat-sum"/>
                 <span className="sk sk-feat-sum short"/>
               </div>
             </div>
             {Array.from({length:2}).map((__,si)=>(
               <div className="sk-card" key={si}>
                 <span className="sk sk-card-src"/>
                 <span className="sk sk-card-hl"/>
                 <span className="sk sk-card-sum"/>
                 <span className="sk sk-card-sum short"/>
               </div>
             ))}
           </div>
         ))}
       </div>
     )}
     {phase==="done"&&brief&&!brief.error&&(
       <div className="brief-tab-hd">
         <div>
           <div className="brief-tab-edition">Morning Brief</div>
           <div className="brief-tab-title">{brief.headline||"Your Morning Brief"}</div>
           <div className="brief-tab-sub">{topics.length} topic{topics.length!==1?"s":""} · {savedBriefMeta?new Date(savedBriefMeta.generated_at).toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"}):today}{getReadingTime(brief)?" · "+getReadingTime(brief):""}</div>
         </div>
         <div style={{display:"flex",gap:8,flexShrink:0,marginTop:4}}>
           <button className="brief-share-btn" onClick={shareBrief}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5 8.6 10.5"/></svg>Share</button>
           <button className="brief-refresh-btn" onClick={generate} disabled={isStreaming||cooldown>0}>{cooldown>0?`${cooldown}s`:"Refresh"}</button>
         </div>
       </div>
     )}
     {isStreaming&&phase==="done"&&(
       <div style={{maxWidth:1000,margin:'0 auto',padding:'0 22px 10px',display:'flex',alignItems:'center',gap:10}}>
         <div style={{width:13,height:13,borderRadius:'50%',border:'2px solid var(--accent)',borderTopColor:'transparent',animation:'spin 0.8s linear infinite',flexShrink:0}}/>
         <span style={{fontSize:'0.7rem',color:'var(--ink-3)',fontWeight:500}}>Fetching today's news in the background — keep reading</span>
       </div>
     )}
     {phase==="done"&&brief&&!brief.error&&briefIsStale&&!isStreaming&&(
       <div className="stale-notice">
         <div className="stale-notice-inner">
           <span className="stale-notice-text">Generated <strong>yesterday</strong> — today's news is ready</span>
           <button className="stale-notice-btn" onClick={generate} disabled={phase==="loading"||cooldown>0}>
             {cooldown>0?`Wait ${cooldown}s`:"Refresh"}
           </button>
         </div>
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
                     {featured&&(()=>{const leadImg=tg.leadImage||(featured.url&&ogImages[featured.url])||null;return(
                       <a className={`brief-featured${leadImg?"":" no-photo"}`} href={fUrl} target="_blank" rel="noopener noreferrer">
                         {leadImg&&(
                         <div className="brief-feat-img" style={{background:getTopicGradient(tg.topic)}}>
                           <img className="brief-feat-photo" src={leadImg} alt="" loading="lazy" onLoad={e=>e.currentTarget.classList.add("loaded")} onError={e=>{e.currentTarget.closest(".brief-featured")?.classList.add("no-photo");e.currentTarget.parentElement.style.display="none";}}/>
                           <div className="brief-feat-img-grad"/>
                           <div className="brief-feat-img-meta">
                             {featured.source&&<SourceLogo source={featured.source} dark/>}
                             <span className="brief-feat-label">Lead story</span>
                           </div>
                         </div>
                         )}
                         <div className="brief-feat-body">
                           {!leadImg&&(
                             <div className="brief-feat-topmeta">
                               {featured.source&&<SourceLogo source={featured.source}/>}
                               <span className="brief-feat-label">Lead story</span>
                             </div>
                           )}
                           <div className="brief-feat-hl">{clean(featured.headline)}</div>
                           {featured.summary&&<div className="brief-feat-sum">{clean(featured.summary)}</div>}
                           <span className="brief-feat-read">Read full story →</span>
                         </div>
                       </a>
                     );})()}
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
                             </a>
                           );
                         })}
                       </div>
                     )}
                   </div>
                 );
               })}
             </div>
             {getWatchItems(brief).length>0&&(
               <div className="radar">
                 <div className="radar-hd">
                   <span className="radar-pulse"/>
                   <span className="radar-title">What to watch</span>
                 </div>
                 <div className="radar-list">
                   {getWatchItems(brief).map((item,i)=>(
                     <div key={i} className="radar-item">
                       <span className="radar-arrow">→</span>
                       <span className="radar-text">{item.text}</span>
                       <span className="radar-topic">{item.topic}</span>
                     </div>
                   ))}
                 </div>
               </div>
             )}
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
         <span className="search-ico"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7.5"/><path d="m21 21-3.8-3.8"/></svg></span>
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
           <span className={`topic-counter ${topics.length>=MAX_TOPICS?"full":topics.length>=8?"warn":"ok"}`}>{topics.length}/10</span>
         )}
       </div>
       {topics.length>=MAX_TOPICS&&(
         <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:"#fff2f2",border:"1px solid #fca5a5",borderRadius:6,marginTop:6}}>
           <span style={{fontSize:"0.78rem",color:"#dc2626"}}>You've reached the 10 topic limit.</span>
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
       <button className="profile-save-btn" onClick={saveDeliveryTime}>Save settings</button>
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
 {/* SLIDE 1: HERO */}
 <div className="ls ls-1">
   <div className="ls1-grid"/><div className="ls1-lamp"/><div className="ls1-aurora"/>
   <div className="ls1-orb ls1-orb-1"/><div className="ls1-orb ls1-orb-2"/><div className="ls1-orb ls1-orb-3"/>
   {/* Flowing gradient ribbons (newsbang-style) — pure SVG+CSS, drifts slowly */}
   <div className="ls1-wave" aria-hidden="true">
     <svg viewBox="0 0 1440 420" preserveAspectRatio="none">
       <defs>
         <linearGradient id="lswg" x1="0" y1="0" x2="1" y2="0">
           <stop offset="0" stopColor="#3b62f6"/>
           <stop offset="0.45" stopColor="#8b3df0"/>
           <stop offset="1" stopColor="#e0233e"/>
         </linearGradient>
       </defs>
       {[0,1,2,3,4,5,6,7].map(i=>{
         const y=150+i*26, a=54-i*4;
         const d=`M0,${y} C240,${y-a} 480,${y+a} 720,${y} S1200,${y-a} 1440,${y} S1920,${y+a} 2160,${y} S2640,${y-a} 2880,${y}`;
         return <path key={i} className={`wvp wvp-${i}`} d={d} fill="none" stroke="url(#lswg)" strokeWidth={i<2?2:1.4}/>;
       })}
     </svg>
   </div>
   <div className="ls1-inner">
     <div className="ls1-text">
       <div className="ls1-eyebrow anim">PERSONALIZED · MORNING · BRIEF</div>
       <h1 className="ls1-hl anim anim-d1">News without<br/>the <em>noise.</em></h1>
       <p className="ls1-sub anim anim-d2">Your topics. Trusted sources. One sharp brief, every morning.</p>
       <div className="ls1-btns anim anim-d3">
         <button className="ls1-btn-p" onClick={()=>{setAuthModal('signup');setAuthError('');}}>Get started free</button>
         <button className="ls1-btn-g" onClick={()=>{setAuthModal('login');setAuthError('');}}>Sign in</button>
       </div>
       <div className="ls1-sources anim anim-d4">
         <span className="ls1-src-label">Sources include</span>
         {["AP","Reuters","BBC","NPR","WSJ","Bloomberg"].map(s=><span key={s} className="ls1-src-pill">{s}</span>)}
       </div>
     </div>
     <div className="hero-phone anim anim-d2">
       <div className="hp-screen">
         <div className="hp-top">
           <div className="hp-kicker">Your Morning Brief</div>
           <div className="hp-title">Good morning.</div>
           <div className="hp-meta">3 topics · 2 min read</div>
         </div>
         <div className="hp-body">
           <div className="hp-sec"><span className="hp-sec-name">World News</span><span className="hp-sec-ct">4 stories</span></div>
           <div className="hp-feat">
             <div className="hp-feat-img" style={{backgroundImage:"linear-gradient(to bottom,transparent 30%,rgba(0,0,0,0.7) 100%),url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=70)"}}>
               <span className="hp-feat-pill">Lead</span>
             </div>
             <div className="hp-feat-body">
               <div className="hp-feat-hl">Global leaders reach landmark trade and climate deal</div>
               <div className="hp-feat-src">Reuters</div>
             </div>
           </div>
           <div className="hp-story"><div className="hp-story-hl">Fed holds rates steady, signals two cuts before year-end</div><div className="hp-story-src">AP · Markets</div></div>
           <div className="hp-story"><div className="hp-story-hl">Thunder beat Celtics to take 3–1 series lead</div><div className="hp-story-src">ESPN · NBA</div></div>
         </div>
       </div>
     </div>
   </div>
   <div className="ls1-marquee-wrap">
     <div className="ls1-marquee-track">
       {[...SUGGESTIONS,...SUGGESTIONS].map((s,i)=>(
         <span key={i} className="ls1-marquee-item">{s.name}<span className="ls1-marquee-dot"> ·</span></span>
       ))}
     </div>
   </div>
   <div className="ls1-scroll"><div className="ls1-scroll-line"/><span className="ls1-scroll-label">scroll</span></div>
 </div>
 {/* LIVE HEADLINES WALL */}
 <div id="live" className="ls-wall">
   <div className="ls-wall-head">
     <div className="ls-wall-live anim"><span className="ls-wall-live-dot"/>Live right now</div>
     <h2 className="ls-wall-hl anim anim-d1">The world's newsrooms,<br/><em>distilled.</em></h2>
     <p className="ls-wall-sub anim anim-d2">Thousands of stories cross the wire every hour. We read them so you don't have to — and hand you only what matters.</p>
   </div>
   {(()=>{
     const C={AP:"#e0383a",Reuters:"#ff8000",BBC:"#bb1919",Bloomberg:"#1f6fd6",NPR:"#2e6bb8","The Verge":"#6c3ce0",ESPN:"#cc0000"};
     const cols=[
       {dir:"up",items:[
         {s:"Reuters",t:"2m",h:"Fed holds rates steady, signals two cuts before year-end"},
         {s:"AP",t:"7m",h:"Global leaders reach landmark trade and climate deal"},
         {s:"Bloomberg",t:"12m",h:"Markets steady as tech earnings beat estimates"},
         {s:"BBC",t:"18m",h:"Scientists map deepest section of the ocean floor"},
         {s:"NPR",t:"25m",h:"Renewables overtake coal in the US power mix"},
       ]},
       {dir:"down",items:[
         {s:"AP",t:"4m",h:"Housing starts rise for a third straight month"},
         {s:"Reuters",t:"9m",h:"EU finalizes new AI safety framework"},
         {s:"The Verge",t:"15m",h:"SpaceX completes record 18th booster reflight"},
         {s:"BBC",t:"21m",h:"WHO reports sharp decline in global measles cases"},
         {s:"Bloomberg",t:"30m",h:"Quarterly GDP revised up to 3.1%"},
       ]},
       {dir:"up2",items:[
         {s:"Bloomberg",t:"3m",h:"Nvidia clinches AI chip deals with Korean giants"},
         {s:"ESPN",t:"8m",h:"Orioles climb back into the AL playoff race"},
         {s:"NPR",t:"14m",h:"New study links sleep quality to heart health"},
         {s:"AP",t:"19m",h:"Wildfire containment reaches 60% in California"},
         {s:"Reuters",t:"28m",h:"Dollar firms ahead of key inflation data"},
       ]},
     ];
     return(
     <div className="ls-wall-cols anim anim-d2">
       {cols.map((col,ci)=>(
         <div className="wall-col" key={ci}>
           <div className={`wall-track ${col.dir}`}>
             {[...col.items,...col.items].map((it,i)=>(
               <a key={i} className="wall-card" href="#builder" onClick={e=>{e.preventDefault();document.getElementById("builder")?.scrollIntoView({behavior:"smooth"});}}>
                 <div className="wall-card-top">
                   <span className="wall-src" style={{background:C[it.s]||"#444"}}>{it.s}</span>
                   <span className="wall-time">{it.t} ago</span>
                 </div>
                 <div className="wall-hl">{it.h}</div>
               </a>
             ))}
           </div>
         </div>
       ))}
     </div>
     );
   })()}
 </div>
 {/* FULL-BLEED PHOTO STATEMENT */}
 <div className="ls-statement">
   <div className="ls-statement-inner">
     <div className="ls-statement-badge anim"><span className="ls-statement-badge-dot"/>Why we built it</div>
     <h2 className="ls-statement-hl anim anim-d1">Mornings used to mean<br/><em>doomscrolling.</em></h2>
     <p className="ls-statement-sub anim anim-d2">Twelve open tabs, three paywalls, and a dozen hot takes before your coffee's even cool. NewsHall replaces all of it with one clean brief — just what happened, built for your topics, ready before you wake up.</p>
   </div>
 </div>
 {/* SLIDE 2: WHY */}
 <div id="why" className="ls ls-2">
   <div className="ls2-inner">
     <div className="ls2-eyebrow anim">WHY NEWSHALL</div>
     <h2 className="ls2-hl anim anim-d1">News that informs,<br/>not <em>inflames.</em></h2>
     <div className="ls2-grid">
       {[
         {n:"01",title:"Straight-news sources only",text:"We pull from AP, Reuters, BBC, NPR, WSJ, Bloomberg and more. No opinion sites, no outrage farms."},
         {n:"02",title:"Every story linked & cited",text:"Every headline links straight to the original article. No paywalls, no dead ends, no summaries without receipts."},
         {n:"03",title:"Built fresh every morning",text:"Your brief is scanned and written for your exact topics. Nobody else gets yours. It's ready before you wake up."},
         {n:"04",title:"Your topics, not an algorithm's",text:"You pick what you wake up to. World news, NBA, personal finance, Formula 1 — as specific as you want."},
       ].map((c,i)=>(
         <div className={`ls2-card anim anim-d${i+1}`} key={c.title}>
           <div className="ls2-card-num">{c.n}</div>
           <div className="ls2-card-title">{c.title}</div>
           <div className="ls2-card-text">{c.text}</div>
         </div>
       ))}
     </div>
   </div>
 </div>
 {/* SLIDE 3: HOW + CTA */}
 <div id="how" className="ls ls-3">
   <div className="ls3-inner">
     <div className="ls3-eyebrow anim">HOW IT WORKS</div>
     <h2 className="ls3-hl anim anim-d1">Ready in 60 seconds.</h2>
     <div className="ls3-steps">
       {[
         {n:"01",title:"Pick your topics",text:"Choose from 50+ categories or type anything — a team, a stock, a niche. Up to 10 topics."},
         {n:"02",title:"We do the reading",text:"Every morning we scan hundreds of sources, filter by relevance, and write your brief from scratch."},
         {n:"03",title:"Wake up informed",text:"Your brief is waiting when you open the app — or delivered by push notification at your chosen time."},
       ].map((s,i)=>(
         <div className={`ls3-step anim anim-d${i+2}`} key={s.n}>
           <div className="ls3-num">{s.n}</div>
           <div className="ls3-step-title">{s.title}</div>
           <div className="ls3-step-text">{s.text}</div>
         </div>
       ))}
     </div>
     <button className="ls3-cta anim anim-d5" onClick={()=>{setAuthModal('signup');setAuthError('');}}>Try it free →</button>
   </div>
 </div>
 {/* LOGGED-OUT BUILDER */}
 <div id="builder" className="builder" ref={builderRef}>
 <div className="builder-inner">
   <div className="step-hd">
     <div className="step-tag"><span className="step-n">01</span> Choose topics</div>
     <h2 className="step-h2">What do you want to wake up to?</h2>
     <p className="step-sub">Pick from popular categories, or type anything as broad or specific as you want.</p>
   </div>
   <div className="search-wrap">
     <span className="search-ico"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7.5"/><path d="m21 21-3.8-3.8"/></svg></span>
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
       <span className={`topic-counter ${topics.length>=MAX_TOPICS?"full":topics.length>=8?"warn":"ok"}`}>{topics.length}/10</span>
     )}
   </div>
   {topics.length>=MAX_TOPICS&&(
     <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:"#fff2f2",border:"1px solid #fca5a5",borderRadius:6,marginTop:6}}>
       <span style={{fontSize:"0.78rem",color:"#dc2626"}}>You've reached the 10 topic limit.</span>
       <span style={{fontSize:"0.78rem",color:"#6b7280"}}>Remove a topic to add a different one.</span>
     </div>
   )}
 </div>
 </div>
 <div className="gen-wrap">
 <div className="gen-wrap-inner">
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
 </div>
 {phase==="loading"&&(
   <div className="sk-wrap">
     <div className="sk-status">
       <div className="sk-status-spin"/>
       <span className="sk-status-txt">Building your brief</span>
       <span className="sk-status-sub">· scanning live sources across {topics.length} topic{topics.length!==1?"s":""}</span>
     </div>
     <div className="sk-mast">
       <span className="sk sk-kicker"/>
       <span className="sk sk-hl"/>
       <span className="sk sk-hl two"/>
       <span className="sk sk-meta"/>
     </div>
     {Array.from({length:Math.min(Math.max(topics.length,2),3)}).map((_,ti)=>(
       <div className="sk-topic" key={ti}>
         <div className="sk-topic-hd">
           <span className="sk sk-topic-name"/>
           <span className="sk sk-topic-count"/>
         </div>
         <div className="sk-feat">
           <span className="sk sk-feat-img"/>
           <div className="sk-feat-body">
             <span className="sk sk-feat-hl"/>
             <span className="sk sk-feat-hl two"/>
             <span className="sk sk-feat-sum"/>
             <span className="sk sk-feat-sum"/>
             <span className="sk sk-feat-sum short"/>
           </div>
         </div>
         {Array.from({length:2}).map((__,si)=>(
           <div className="sk-card" key={si}>
             <span className="sk sk-card-src"/>
             <span className="sk sk-card-hl"/>
             <span className="sk sk-card-sum"/>
             <span className="sk sk-card-sum short"/>
           </div>
         ))}
       </div>
     ))}
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
           <div className="bmast-glow" aria-hidden="true"/>
           <div className="bmast-grid" aria-hidden="true"/>
           <div className="bmast-top">
             <span className="bmast-pub">NewsHall</span>
             <span className="bmast-date-sm">{today}</span>
           </div>
           <div className="bkicker">Your Morning Brief</div>
           <div className="bhl">{brief.headline||"Morning Brief"}</div>
           <div className="bmeta">{topics.length} topic{topics.length!==1?"s":""} · {savedBriefMeta?new Date(savedBriefMeta.generated_at).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"}):new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}{getReadingTime(brief)?" · "+getReadingTime(brief):""}</div>
           {isStreaming&&(
             <div style={{marginTop:12,display:'flex',alignItems:'center',gap:8}}>
               <div style={{width:12,height:12,borderRadius:'50%',border:'2px solid rgba(255,255,255,0.4)',borderTopColor:'#fff',animation:'spin 0.8s linear infinite',flexShrink:0}}/>
               <span style={{fontSize:'0.7rem',color:'rgba(255,255,255,0.45)',fontWeight:500}}>Searching today's news…</span>
             </div>
           )}
           {briefIsStale&&!isStreaming&&(
             <div className="stale-inline">
               <span className="stale-inline-text">Generated yesterday — today's news is ready</span>
               <button className="stale-inline-btn" onClick={generate} disabled={phase==="loading"||cooldown>0}>{cooldown>0?`Wait ${cooldown}s`:"Refresh"}</button>
             </div>
           )}
           <div className="bmast-btns">
             <button className="btweak" onClick={()=>builderRef.current?.scrollIntoView({behavior:"smooth",block:"start"})}>Edit topics</button>
             <button className="brefresh" onClick={generate}>Refresh brief</button>
             <button className="bshare" onClick={shareBrief}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5 8.6 10.5"/></svg>Share</button>
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
                 {featured&&(()=>{const leadImg=tg.leadImage||(featured.url&&ogImages[featured.url])||null;return(
                   <a className={`brief-featured${leadImg?"":" no-photo"}`} href={fUrl} target="_blank" rel="noopener noreferrer">
                     {leadImg&&(
                     <div className="brief-feat-img" style={{background:getTopicGradient(tg.topic)}}>
                       <img className="brief-feat-photo" src={leadImg} alt="" loading="lazy" onLoad={e=>e.currentTarget.classList.add("loaded")} onError={e=>{e.currentTarget.closest(".brief-featured")?.classList.add("no-photo");e.currentTarget.parentElement.style.display="none";}}/>
                       <div className="brief-feat-img-grad"/>
                       <div className="brief-feat-img-meta">
                         {featured.source&&<SourceLogo source={featured.source} dark/>}
                         <span className="brief-feat-label">Lead story</span>
                       </div>
                     </div>
                     )}
                     <div className="brief-feat-body">
                       {!leadImg&&(
                         <div className="brief-feat-topmeta">
                           {featured.source&&<SourceLogo source={featured.source}/>}
                           <span className="brief-feat-label">Lead story</span>
                         </div>
                       )}
                       <div className="brief-feat-hl">{clean(featured.headline)}</div>
                       {featured.summary&&<div className="brief-feat-sum">{clean(featured.summary)}</div>}
                       <span className="brief-feat-read">Read full story →</span>
                     </div>
                   </a>
                 );})()}
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
                         </a>
                       );
                     })}
                   </div>
                 )}
               </div>
             );
           })}
         </div>
         {getWatchItems(brief).length>0&&(
           <div className="radar">
             <div className="radar-hd">
               <span className="radar-pulse"/>
               <span className="radar-title">What to watch</span>
             </div>
             <div className="radar-list">
               {getWatchItems(brief).map((item,i)=>(
                 <div key={i} className="radar-item">
                   <span className="radar-arrow">→</span>
                   <span className="radar-text">{item.text}</span>
                   <span className="radar-topic">{item.topic}</span>
                 </div>
               ))}
             </div>
           </div>
         )}
         {brief.topics?.some(tg=>tg.stories?.some(s=>s.source))&&(
           <div className="srcfooter"><strong>Sources: </strong>{[...new Set(brief.topics.flatMap(tg=>(tg.stories||[]).map(s=>s.source)).filter(Boolean))].join(" · ")}</div>
         )}
         <div className="brief-cta">
           <div className="brief-cta-inner">
             <div className="brief-cta-eyebrow">Your brief is ready</div>
             <div className="brief-cta-title">Get it <em>every morning.</em><br/>Automatically.</div>
             <div className="brief-cta-sub">Save your topics and wake up to a fresh personalized brief — free, every morning, before you open the app.</div>
             <div className="brief-cta-bullets">
               <div className="brief-cta-bullet">Your {topics.length} topic{topics.length!==1?"s":""} saved automatically</div>
               <div className="brief-cta-bullet">Fresh brief generated every morning at your chosen time</div>
               <div className="brief-cta-bullet">Push notification when it's ready</div>
             </div>
             <div className="brief-cta-btns">
               <button className="brief-cta-btn-p" onClick={()=>{setAuthModal('signup');setAuthError('');}}>Save my brief — it's free</button>
               <button className="brief-cta-btn-s" onClick={()=>{setAuthModal('login');setAuthError('');}}>Sign in</button>
             </div>
             {topics.length>0&&(
               <div className="brief-cta-chips">
                 {topics.map((t,i)=><span key={i} className="brief-cta-chip">{t}</span>)}
               </div>
             )}
             <div className="brief-cta-note">No credit card required · Takes 30 seconds</div>
           </div>
         </div>
       </>
     )}
   </div>
 )}
 </>
 )}

 {showOnboarding&&user&&(
   <div className="ob-over" onClick={e=>e.target===e.currentTarget&&setShowOnboarding(false)}>
     <div className="ob-box">
       <div className="ob-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg></div>
       <div className="ob-title">Set up your morning brief</div>
       <div className="ob-sub">Pick a time and we'll automatically generate and deliver your personalized brief every morning — no need to open the app.</div>
       {pushStatus==="denied"&&<div className="ob-denied">Notifications blocked. Enable them in your browser settings, then try again.</div>}
       <label className="ob-time-label">What time do you want your brief?</label>
       <input className="ob-time-input" type="time" value={deliveryTime} onChange={e=>setDeliveryTime(e.target.value)}/>
       {topics.length>0&&(
         <>
           <label className="ob-time-label">Your topics ({topics.length}/10)</label>
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
       <div className="nuo-step">{topics.length}/10 topics</div>
     </div>
     <div className="nuo-hd">
       <div className="nuo-eyebrow">Welcome</div>
       <div className="nuo-title">What do you<br/>care about?</div>
       <div className="nuo-sub">Pick a few topics and we'll build your first brief in seconds.</div>
     </div>
     <div className="nuo-body">
       <div className="nuo-search-wrap">
         <span className="nuo-search-ico"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7.5"/><path d="m21 21-3.8-3.8"/></svg></span>
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

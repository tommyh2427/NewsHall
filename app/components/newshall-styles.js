// Global CSS-in-JS for NewsHall, injected once via <style>{CSS}</style>.
// Extracted from NewsHall.jsx so the component file stays focused on logic;
// this is a static module-level string (no per-render cost).
export const CSS=`
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
.builder{width:100%;background:var(--ink);border-top:1px solid rgba(255,255,255,0.06);padding:72px 48px;}
.builder-inner{max-width:1000px;margin:0 auto;}
.step-hd{margin-bottom:36px;}
.step-tag{display:inline-flex;align-items:center;gap:6px;background:rgba(200,16,46,0.18);color:var(--accent);font-size:0.56rem;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;padding:5px 14px;border-radius:100px;margin-bottom:14px;border:1px solid rgba(200,16,46,0.25);}
.step-n{color:#fff;font-weight:700;}
.step-h2{font-family:'Playfair Display',serif;font-size:clamp(1.8rem,3vw,2.6rem);font-weight:900;letter-spacing:-0.04em;color:#fff;margin-bottom:8px;}
.step-sub{font-size:0.88rem;color:rgba(255,255,255,0.42);line-height:1.65;max-width:480px;font-weight:300;}
.search-wrap{position:relative;margin-bottom:20px;}
.search-wrap input{width:100%;background:rgba(255,255,255,0.06);border:1.5px solid rgba(255,255,255,0.1);border-radius:12px;padding:15px 140px 15px 48px;font-size:0.93rem;color:#fff;outline:none;transition:all 0.2s;}
.search-wrap input:focus{border-color:rgba(255,255,255,0.28);background:rgba(255,255,255,0.08);}
.search-wrap input::placeholder{color:rgba(255,255,255,0.28);}
.search-ico{position:absolute;left:16px;top:50%;transform:translateY(-50%);pointer-events:none;display:flex;align-items:center;color:rgba(255,255,255,0.35);}
.add-btn{position:absolute;right:8px;top:50%;transform:translateY(-50%);background:var(--accent);color:#fff;border:none;border-radius:8px;padding:9px 20px;font-weight:700;font-size:0.76rem;cursor:pointer;transition:background 0.15s;}
.add-btn:hover{background:#e01535;}
.sugg-lbl{font-size:0.56rem;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.28);margin-bottom:14px;}
.sugg-wrap{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px;}
.sugg{display:inline-flex;align-items:center;gap:4px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:100px;padding:7px 16px;font-size:0.76rem;font-weight:500;cursor:pointer;transition:all 0.18s cubic-bezier(0.22,1,0.36,1);color:rgba(255,255,255,0.6);}
.sugg:hover{border-color:rgba(255,255,255,0.28);color:#fff;background:rgba(255,255,255,0.1);transform:translateY(-1px);}
.sugg.on{background:var(--accent);border-color:var(--accent);color:#fff;transform:scale(1.02);}
.sugg:active{transform:scale(0.97);}
.chips{min-height:52px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:14px;padding:12px 16px;display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:4px;}
.topic-counter{font-size:0.56rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-left:auto;padding:3px 10px;border-radius:100px;flex-shrink:0;}
.topic-counter.ok{color:rgba(255,255,255,0.35);background:rgba(255,255,255,0.07);}
.topic-counter.warn{color:#fbbf24;background:rgba(251,191,36,0.12);}
.topic-counter.full{color:var(--accent);background:rgba(200,16,46,0.15);font-weight:700;}
.chips-lbl{font-size:0.56rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.28);flex-shrink:0;}
.chip{display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);border-radius:8px;padding:5px 12px;font-size:0.74rem;font-weight:600;color:#fff;}
.chip-x{cursor:pointer;color:rgba(255,255,255,0.4);font-size:0.82rem;transition:color 0.1s;}
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
.gen-wrap{width:100%;background:var(--ink);padding:0 48px 80px;}
.gen-wrap-inner{max-width:1000px;margin:0 auto;}
.gen-panel{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:32px 40px;display:grid;grid-template-columns:1fr auto;align-items:center;gap:24px;position:relative;overflow:hidden;}
.gen-panel::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 55% 100% at 100% 50%,rgba(200,16,46,0.1) 0%,transparent 70%);pointer-events:none;}
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
/* ── SKELETON LOADING ── */
.sk-wrap{max-width:860px;margin:0 auto;padding:0 48px 100px;animation:fu 0.4s ease;}
.sk-status{display:flex;align-items:center;gap:10px;padding:14px 18px;margin-bottom:36px;background:var(--ink);border-radius:12px;}
.sk-status-spin{width:15px;height:15px;border:2px solid rgba(255,255,255,0.25);border-top-color:#fff;border-radius:50%;animation:spin 0.8s linear infinite;flex-shrink:0;}
.sk-status-txt{font-size:0.78rem;font-weight:600;color:#fff;letter-spacing:0.01em;}
.sk-status-sub{font-size:0.78rem;font-weight:400;color:rgba(255,255,255,0.45);}
.sk{background:linear-gradient(100deg,#e4e8ee 20%,#f6f8fb 48%,#eef1f5 60%,#e4e8ee 80%);background-size:220% 100%;animation:shimmer 1.25s linear infinite;border-radius:7px;display:block;}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
.sk-feat-img{position:relative;background:linear-gradient(120deg,#dfe4ec 0%,#eef1f6 50%,#dfe4ec 100%);background-size:220% 100%;animation:shimmer 1.25s linear infinite;display:flex;align-items:center;justify-content:center;}
.sk-feat-img::after{content:'';width:54px;height:54px;border-radius:14px;background:rgba(255,255,255,0.55);box-shadow:0 2px 10px rgba(15,23,41,0.06);background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26' height='26' viewBox='0 0 24 24' fill='none' stroke='%23aab4c4' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpath d='m21 15-5-5L5 21'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:center;}
.sk-mast{padding-bottom:24px;margin-bottom:40px;border-bottom:3px solid var(--ink);}
.sk-kicker{width:130px;height:11px;margin-bottom:16px;border-radius:4px;}
.sk-hl{width:78%;height:38px;margin-bottom:14px;border-radius:8px;}
.sk-hl.two{width:52%;}
.sk-meta{width:200px;height:10px;border-radius:4px;}
.sk-topic{margin-bottom:60px;}
.sk-topic-hd{display:flex;align-items:center;justify-content:space-between;border-top:3px solid var(--ink);border-bottom:1px solid rgba(10,15,30,0.14);padding:8px 0 11px;margin-bottom:24px;}
.sk-topic-name{width:120px;height:11px;border-radius:4px;}
.sk-topic-count{width:48px;height:9px;border-radius:4px;}
.sk-feat{border-radius:16px;overflow:hidden;margin-bottom:16px;box-shadow:0 1px 4px rgba(15,23,41,0.06),0 4px 20px rgba(15,23,41,0.05);background:#fff;}
.sk-feat-img{aspect-ratio:16/7;border-radius:0;}
.sk-feat-body{padding:24px 28px 22px;}
.sk-feat-hl{width:92%;height:24px;margin-bottom:10px;border-radius:6px;}
.sk-feat-hl.two{width:60%;margin-bottom:18px;}
.sk-feat-sum{width:100%;height:12px;margin-bottom:8px;border-radius:4px;}
.sk-feat-sum.short{width:70%;}
.sk-card{padding:20px 0;border-bottom:1px solid var(--rule);}
.sk-card:first-of-type{border-top:1px solid var(--rule);}
.sk-card-src{width:60px;height:14px;margin-bottom:10px;border-radius:4px;}
.sk-card-hl{width:88%;height:16px;margin-bottom:9px;border-radius:5px;}
.sk-card-sum{width:100%;height:11px;margin-bottom:6px;border-radius:4px;}
.sk-card-sum.short{width:55%;}
.brief-wrap{max-width:860px;margin:0 auto;padding:0 48px 100px;animation:fu 0.4s ease;}
/* ── ON THE RADAR — end-of-brief forward look ── */
.radar{position:relative;overflow:hidden;background:linear-gradient(140deg,#0c1322 0%,#161f3a 100%);border:1px solid rgba(255,255,255,0.09);border-radius:20px;padding:30px 32px;margin:8px 0 8px;animation:fu 0.5s ease both;}
.radar::before{content:'';position:absolute;top:-60px;right:-60px;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle,rgba(200,16,46,0.18) 0%,transparent 70%);pointer-events:none;}
.radar::after{content:'';position:absolute;bottom:-80px;left:-40px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(26,58,107,0.4) 0%,transparent 70%);pointer-events:none;}
.radar-hd{display:flex;align-items:center;gap:11px;margin-bottom:20px;position:relative;z-index:1;}
.radar-eyebrow{font-size:0.56rem;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;color:var(--accent);}
.radar-title{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:900;color:#fff;letter-spacing:-0.03em;line-height:1;}
.radar-pulse{width:9px;height:9px;border-radius:50%;background:var(--accent);flex-shrink:0;box-shadow:0 0 0 0 rgba(200,16,46,0.6);animation:radarPulse 2s ease-out infinite;}
@keyframes radarPulse{0%{box-shadow:0 0 0 0 rgba(200,16,46,0.55)}70%{box-shadow:0 0 0 10px rgba(200,16,46,0)}100%{box-shadow:0 0 0 0 rgba(200,16,46,0)}}
.radar-list{display:flex;flex-direction:column;position:relative;z-index:1;}
.radar-item{display:flex;align-items:flex-start;gap:13px;padding:15px 0;border-bottom:1px solid rgba(255,255,255,0.08);}
.radar-item:last-child{border-bottom:none;padding-bottom:0;}
.radar-item:first-child{padding-top:0;}
.radar-arrow{color:var(--accent);font-size:0.95rem;font-weight:700;flex-shrink:0;line-height:1.5;}
.radar-text{flex:1;font-size:0.9rem;font-weight:500;color:rgba(255,255,255,0.92);line-height:1.5;}
.radar-topic{font-size:0.5rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.5);background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:5px 10px;white-space:nowrap;margin-top:2px;flex-shrink:0;}
@keyframes fu{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
/* Masthead */
.bmast{padding:36px 0 24px;margin-bottom:48px;}
.bmast-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid rgba(10,15,30,0.12);}
.bmast-pub{font-size:0.54rem;font-weight:800;letter-spacing:0.24em;text-transform:uppercase;color:var(--ink-4);}
.bmast-date-sm{font-size:0.54rem;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-4);}
.bkicker{font-size:0.54rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--accent);margin-bottom:8px;}
.bhl{font-family:'Playfair Display',serif;font-size:clamp(2rem,3.8vw,3.4rem);font-weight:900;line-height:0.98;letter-spacing:-0.04em;color:var(--ink);}
.bmeta{font-size:0.58rem;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-4);margin-top:12px;}
.bmast-btns{display:flex;gap:8px;margin-top:20px;border-top:3px solid var(--ink);padding-top:16px;}
.brefresh{background:var(--ink);color:#fff;font-weight:600;font-size:0.7rem;padding:9px 20px;border:none;border-radius:7px;cursor:pointer;transition:background 0.15s;}
.brefresh:hover{background:var(--accent);}
.bshare{background:transparent;color:var(--ink-2);font-weight:600;font-size:0.7rem;padding:9px 16px;border:1.5px solid var(--rule);border-radius:7px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all 0.15s;}
.bshare:hover{background:var(--ink);color:#fff;border-color:var(--ink);}
.btweak{background:transparent;color:var(--ink-2);font-weight:500;font-size:0.7rem;padding:9px 16px;border:1.5px solid var(--rule);border-radius:7px;cursor:pointer;transition:all 0.15s;}
.btweak:hover{background:var(--bg-2);border-color:var(--ink-3);}
/* Source labels */
.src-badge{display:inline-flex;align-items:center;border-radius:5px;padding:3px 8px;flex-shrink:0;}
.src-name{font-size:0.55rem;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;white-space:nowrap;line-height:1;}
/* ── TOPIC SECTIONS — WSJ newspaper style ── */
.brief-topic-section{margin-bottom:60px;}
/* WSJ double-rule: thick top + thin bottom with section label between */
.brief-topic-header{
  display:flex;align-items:baseline;justify-content:space-between;
  border-top:3px solid var(--ink);
  border-bottom:1px solid rgba(10,15,30,0.14);
  padding:6px 0 9px;
  margin-bottom:24px;
}
.brief-topic-name{
  font-size:0.6rem;font-weight:800;letter-spacing:0.22em;
  text-transform:uppercase;color:var(--ink);
  display:flex;align-items:center;gap:0;
}
.brief-topic-name::before{display:none;}
.brief-topic-count{font-size:0.52rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-4);}
/* ── FEATURED STORY — Apple News clean card ── */
.brief-featured{
  display:block;text-decoration:none;background:#fff;
  border-radius:16px;overflow:hidden;margin-bottom:16px;
  transition:transform 0.2s ease,box-shadow 0.2s ease;
  box-shadow:0 1px 4px rgba(15,23,41,0.06),0 4px 20px rgba(15,23,41,0.05);
  border:none;
}
.brief-featured:hover{transform:translateY(-3px);box-shadow:0 12px 44px rgba(15,23,41,0.13);}
.brief-feat-img{aspect-ratio:16/7;position:relative;display:flex;align-items:flex-end;padding:20px 24px;overflow:hidden;}
.brief-feat-img-over{position:absolute;inset:0;background:linear-gradient(to bottom,transparent 20%,rgba(0,0,0,0.72) 100%);}
.brief-feat-photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;opacity:0;transition:opacity 0.55s ease;}
.brief-feat-photo.loaded{opacity:1;}
.brief-feat-img-grad{position:absolute;inset:0;z-index:1;background:linear-gradient(to bottom,transparent 28%,rgba(0,0,0,0.74) 100%);}
.brief-feat-img-meta{position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;width:100%;}
.brief-feat-label{font-size:0.47rem;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#fff;background:var(--accent);border-radius:4px;padding:3px 9px;}
.brief-feat-body{padding:24px 28px 22px;background:#fff;}
/* Text-first editorial lead — used when no real article photo exists.
   Gradient accent bar + bigger serif headline; intentional, never "blank". */
.brief-featured.no-photo::before{content:'';display:block;height:5px;background:linear-gradient(90deg,var(--accent) 0%,#e0233e 40%,#b44bf0 100%);}
.brief-featured.no-photo .brief-feat-body{padding:26px 30px 24px;}
.brief-featured.no-photo .brief-feat-hl{font-size:clamp(1.55rem,2.9vw,2.2rem);line-height:1.08;}
.brief-feat-topmeta{display:flex;align-items:center;justify-content:space-between;margin-bottom:15px;}
.brief-feat-hl{
  font-family:'Playfair Display',serif;
  font-size:clamp(1.35rem,2.4vw,1.85rem);
  font-weight:800;line-height:1.11;letter-spacing:-0.03em;
  color:var(--ink);margin-bottom:11px;
}
.brief-feat-sum{font-size:0.87rem;color:var(--ink-3);line-height:1.7;margin-bottom:16px;}
.brief-feat-ctx{display:none;}
.brief-feat-read{
  font-size:0.58rem;font-weight:700;letter-spacing:0.1em;
  text-transform:uppercase;color:var(--accent);transition:color 0.15s;
  display:inline-flex;align-items:center;gap:5px;
}
.brief-feat-read::after{content:'→';font-size:0.7rem;}
.brief-featured:hover .brief-feat-read{color:var(--ink);}
/* ── SECONDARY STORIES — newspaper column list ── */
/* Secondary stories — clean newspaper-column text grid (consistent, no mismatched images) */
.brief-story-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 36px;}
.brief-story-card{
  display:flex;flex-direction:column;text-decoration:none;
  padding:20px 0 22px;border-top:1px solid var(--rule);
  background:transparent;transition:none;
}
.brief-story-card:hover .brief-story-hl{color:var(--accent);}
.brief-story-thumb{display:none;}
.brief-story-src{margin-bottom:9px;}
.brief-story-hl{
  font-family:'Playfair Display',serif;
  font-size:1.12rem;font-weight:800;line-height:1.22;
  letter-spacing:-0.025em;color:var(--ink);margin-bottom:8px;
  transition:color 0.15s;
}
.brief-story-sum{font-size:0.84rem;color:var(--ink-3);line-height:1.62;flex:1;}
.brief-story-ctx{display:none;}
.brief-story-read{display:none;}
/* Sources footer */
.srcfooter{
  margin-top:48px;padding:16px 0;
  border-top:1px solid var(--rule);
  font-size:0.58rem;font-weight:500;letter-spacing:0.05em;
  text-transform:uppercase;color:var(--ink-4);line-height:2;
  background:transparent;border-radius:0;border-left:none;border-right:none;border-bottom:none;
}
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
.ob-icon{width:52px;height:52px;border-radius:14px;background:var(--ink);display:flex;align-items:center;justify-content:center;margin-bottom:20px;}
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
 .builder,.gen-wrap{padding-left:20px;padding-right:20px;}
 .brief-wrap,.sk-wrap,.dashboard,.editor-panel{padding-left:20px;padding-right:20px;}
 .topbar{padding:0 22px;}
 .dashboard-hd{flex-direction:column;align-items:flex-start;gap:12px;}
 .dashboard-hd-r{align-items:flex-start;}
 .dashboard-actions{flex-wrap:wrap;}
 .hero-l,.hstat{padding-left:22px;padding-right:22px;}
 .pillars{grid-template-columns:1fr 1fr;}
 .pillar{border-bottom:1px solid var(--rule);}
 .sgrid{grid-template-columns:1fr 1fr;}
 .gen-panel{grid-template-columns:1fr;gap:16px;}
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
 .brief-story-grid{grid-template-columns:1fr;gap:22px;}
 .brief-feat-img{aspect-ratio:3/2;}
 .brief-feat-body{padding:18px 20px 16px;}
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
.brief-tab-hd{max-width:1000px;margin:0 auto;padding:36px 22px 20px;display:flex;align-items:flex-start;justify-content:space-between;gap:16px;border-bottom:1px solid var(--rule);}
.brief-tab-edition{font-size:0.52rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--accent);margin-bottom:6px;display:flex;align-items:center;gap:6px;}
.brief-tab-edition::before{content:'';width:14px;height:2px;background:var(--accent);}
.brief-tab-title{font-family:'Playfair Display',serif;font-size:clamp(1.1rem,4vw,1.8rem);font-weight:900;color:var(--ink);letter-spacing:-0.03em;line-height:1.1;}
.brief-tab-sub{font-size:0.68rem;color:var(--ink-3);margin-top:4px;}
.brief-refresh-btn{background:var(--ink);color:#fff;border:none;border-radius:8px;padding:10px 18px;font-size:0.76rem;font-weight:700;cursor:pointer;flex-shrink:0;margin-top:4px;}
.brief-refresh-btn:hover{background:var(--accent);}
.brief-refresh-btn:disabled{opacity:0.5;cursor:not-allowed;}
.brief-share-btn{background:transparent;color:var(--ink-2);border:1.5px solid var(--rule);border-radius:8px;padding:10px 16px;font-size:0.76rem;font-weight:700;cursor:pointer;flex-shrink:0;display:inline-flex;align-items:center;gap:6px;transition:all 0.15s;}
.brief-share-btn:hover{background:var(--ink);color:#fff;border-color:var(--ink);}
/* ── STALE NOTICE ── */
.stale-notice{max-width:1000px;margin:0 auto;padding:0 22px;}
.stale-notice-inner{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:10px 0;border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);}
.stale-notice-text{font-size:0.68rem;font-weight:500;color:var(--ink-3);letter-spacing:0.02em;}
.stale-notice-text strong{color:var(--ink-2);font-weight:600;}
.stale-notice-btn{font-size:0.68rem;font-weight:700;color:var(--ink);background:transparent;border:1.5px solid var(--rule);border-radius:6px;padding:5px 12px;cursor:pointer;white-space:nowrap;transition:all 0.15s;flex-shrink:0;}
.stale-notice-btn:hover{border-color:var(--ink);background:var(--ink);color:#fff;}
.stale-notice-btn:disabled{opacity:0.4;cursor:not-allowed;}
/* inline stale variant (inside masthead) */
.stale-inline{margin-top:14px;padding-top:14px;border-top:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:space-between;gap:12px;}
.stale-inline-text{font-size:0.68rem;color:rgba(255,255,255,0.45);font-weight:500;}
.stale-inline-btn{font-size:0.68rem;font-weight:700;color:#fff;background:transparent;border:1.5px solid rgba(255,255,255,0.2);border-radius:6px;padding:5px 12px;cursor:pointer;white-space:nowrap;transition:all 0.15s;flex-shrink:0;}
.stale-inline-btn:hover{background:rgba(255,255,255,0.12);border-color:rgba(255,255,255,0.35);}

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
/* Scroll animations */
.anim{opacity:0;transform:translateY(36px);transition:opacity 0.75s cubic-bezier(0.22,1,0.36,1),transform 0.75s cubic-bezier(0.22,1,0.36,1);}
.anim.in-view{opacity:1;transform:none;}
.anim-d1{transition-delay:0.1s;}.anim-d2{transition-delay:0.2s;}.anim-d3{transition-delay:0.3s;}.anim-d4{transition-delay:0.4s;}.anim-d5{transition-delay:0.5s;}

.ls{min-height:100dvh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:72px 32px 80px;text-align:center;position:relative;overflow:hidden;}
.ls-1{background:var(--ink);min-height:100dvh;justify-content:center;}
.ls-2{background:var(--ink);border-top:1px solid rgba(255,255,255,0.06);}
.ls-3{background:#0d1220;border-top:1px solid rgba(255,255,255,0.06);}

/* ── SLIDE 1: HERO ── */
.ls1-grid{position:absolute;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(to right,rgba(255,255,255,0.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.045) 1px,transparent 1px);background-size:62px 62px;-webkit-mask-image:radial-gradient(ellipse 75% 60% at 50% 32%,#000 45%,transparent 88%);mask-image:radial-gradient(ellipse 75% 60% at 50% 32%,#000 45%,transparent 88%);}
.ls1-lamp{position:absolute;top:0;left:50%;transform:translateX(-50%);z-index:0;width:min(520px,80vw);height:2px;background:linear-gradient(90deg,transparent,var(--accent),transparent);opacity:0.7;box-shadow:0 0 70px 10px rgba(200,16,46,0.45);}
.ls1-orb{position:absolute;border-radius:50%;filter:blur(110px);pointer-events:none;}
.ls1-orb-1{width:620px;height:620px;background:radial-gradient(circle,rgba(200,16,46,0.4) 0%,transparent 70%);top:-140px;right:-120px;animation:orbFloat 16s ease-in-out infinite;}
.ls1-orb-2{width:540px;height:540px;background:radial-gradient(circle,rgba(56,84,235,0.42) 0%,transparent 70%);bottom:-100px;left:-100px;animation:orbFloat 20s ease-in-out infinite reverse;}
.ls1-orb-3{width:420px;height:420px;background:radial-gradient(circle,rgba(150,44,210,0.34) 0%,transparent 70%);top:35%;left:42%;animation:orbFloat 24s ease-in-out infinite;}
@keyframes orbFloat{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(6%,-5%) scale(1.12)}}
.ls1-inner{width:100%;max-width:760px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:0;position:relative;z-index:1;}
.ls1-eyebrow{font-size:0.6rem;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:28px;}
.ls1-hl{font-family:'Playfair Display',serif;font-size:clamp(4rem,11vw,7rem);font-weight:900;color:#fff;letter-spacing:-0.05em;line-height:0.92;margin-bottom:28px;text-align:center;}
.ls1-hl em{font-style:italic;background:linear-gradient(100deg,#ff5a2e 0%,#e0233e 35%,#b44bf0 75%,#5b7cfa 100%);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:gradShift 7s ease-in-out infinite;}
@keyframes gradShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
/* Aurora band — newsbang-style flowing color wave along the hero base */
.ls1-aurora{position:absolute;left:-10%;right:-10%;bottom:-22%;height:56%;z-index:0;pointer-events:none;filter:blur(58px);opacity:0.6;
  background:
    radial-gradient(ellipse 42% 58% at 22% 78%, rgba(150,60,235,0.75) 0%, transparent 62%),
    radial-gradient(ellipse 46% 60% at 50% 92%, rgba(56,84,235,0.6) 0%, transparent 64%),
    radial-gradient(ellipse 40% 55% at 78% 76%, rgba(35,190,190,0.55) 0%, transparent 62%),
    radial-gradient(ellipse 34% 44% at 36% 96%, rgba(224,35,62,0.5) 0%, transparent 60%);
  animation:auroraFlow 16s ease-in-out infinite;}
@keyframes auroraFlow{0%,100%{transform:translateX(0) scaleY(1)}33%{transform:translateX(3.5%) scaleY(1.12)}66%{transform:translateX(-3%) scaleY(0.95)}}
.ls1-sub{font-size:1.1rem;color:rgba(255,255,255,0.48);line-height:1.72;max-width:420px;margin:0 0 40px;font-weight:300;text-align:center;}
.ls1-btns{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-bottom:40px;}
.ls1-btn-p{background:var(--accent);color:#fff;border:none;border-radius:100px;padding:16px 32px;font-family:'Inter',sans-serif;font-size:0.95rem;font-weight:700;cursor:pointer;white-space:nowrap;transition:background 0.2s,transform 0.2s,box-shadow 0.2s;}
.ls1-btn-p:hover{background:#e01535;transform:translateY(-2px);box-shadow:0 8px 24px rgba(200,16,46,0.4);}
.ls1-btn-g{background:rgba(255,255,255,0.06);color:#fff;border:1.5px solid rgba(255,255,255,0.22);border-radius:100px;backdrop-filter:blur(8px);padding:16px 32px;font-family:'Inter',sans-serif;font-size:0.95rem;font-weight:600;cursor:pointer;white-space:nowrap;transition:background 0.2s;}
.ls1-btn-g:hover{background:rgba(255,255,255,0.13);}
.ls1-sources{display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:center;}
.ls1-src-label{font-size:0.58rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.22);}
.ls1-src-pill{font-size:0.58rem;font-weight:700;letter-spacing:0.04em;color:rgba(255,255,255,0.32);background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:4px;padding:3px 8px;}
/* Marquee */
.ls1-marquee-wrap{position:absolute;bottom:0;left:0;right:0;border-top:1px solid rgba(255,255,255,0.07);overflow:hidden;padding:14px 0;background:rgba(255,255,255,0.02);}
.ls1-marquee-track{display:flex;gap:32px;width:max-content;animation:marquee 30s linear infinite;}
.ls1-marquee-track:hover{animation-play-state:paused;}
@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
.ls1-marquee-item{font-size:0.58rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.22);white-space:nowrap;}
.ls1-marquee-dot{color:var(--accent);margin-right:-16px;}
/* Scroll indicator */
.ls1-scroll{position:absolute;bottom:60px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:6px;pointer-events:none;}
.ls1-scroll-line{width:1px;height:36px;background:linear-gradient(to bottom,rgba(255,255,255,0.4),transparent);animation:lsScroll 2.2s ease-in-out infinite;}
.ls1-scroll-label{font-size:0.46rem;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.18);}
@keyframes lsScroll{0%,100%{opacity:0.3;transform:scaleY(1)}50%{opacity:1;transform:scaleY(0.6)}}

/* ── HERO PHONE MOCKUP ── */
.ls1-text{display:flex;flex-direction:column;align-items:center;text-align:center;}
.hero-phone{justify-self:center;width:290px;max-width:78vw;background:#11172a;border-radius:44px;padding:9px;box-shadow:0 50px 120px rgba(0,0,0,0.55),0 0 0 1px rgba(255,255,255,0.07);position:relative;}
.hero-phone::before{content:'';position:absolute;top:9px;left:50%;transform:translateX(-50%);width:108px;height:22px;background:#11172a;border-radius:0 0 14px 14px;z-index:3;}
.hp-screen{background:#fff;border-radius:36px;overflow:hidden;height:580px;display:flex;flex-direction:column;}
.hp-top{padding:38px 18px 14px;background:var(--ink);}
.hp-kicker{font-size:0.44rem;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:var(--accent);margin-bottom:6px;}
.hp-title{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:900;color:#fff;letter-spacing:-0.03em;line-height:0.95;}
.hp-meta{font-size:0.42rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-top:8px;}
.hp-body{flex:1;padding:14px 14px 0;background:#fff;overflow:hidden;}
.hp-sec{display:flex;align-items:center;justify-content:space-between;border-top:2.5px solid var(--ink);padding:5px 0 6px;border-bottom:1px solid rgba(10,15,30,0.12);margin-bottom:11px;}
.hp-sec-name{font-size:0.46rem;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;color:var(--ink);}
.hp-sec-ct{font-size:0.4rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-4);}
.hp-feat{border-radius:11px;overflow:hidden;box-shadow:0 2px 10px rgba(15,23,41,0.08);margin-bottom:12px;}
.hp-feat-img{aspect-ratio:16/8;background-size:cover;background-position:center;display:flex;align-items:flex-end;padding:8px;}
.hp-feat-pill{font-size:0.36rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:#fff;background:var(--accent);border-radius:3px;padding:2px 6px;}
.hp-feat-body{padding:9px 11px 11px;}
.hp-feat-hl{font-family:'Playfair Display',serif;font-size:0.72rem;font-weight:800;color:var(--ink);line-height:1.12;letter-spacing:-0.02em;margin-bottom:5px;}
.hp-feat-src{font-size:0.4rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-4);}
.hp-story{padding:9px 0;border-bottom:1px solid rgba(10,15,30,0.08);}
.hp-story-hl{font-family:'Playfair Display',serif;font-size:0.62rem;font-weight:700;color:var(--ink);line-height:1.2;letter-spacing:-0.01em;margin-bottom:4px;}
.hp-story-src{font-size:0.38rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-4);}
@media(min-width:900px){
  .ls1-inner{max-width:1140px;display:grid;grid-template-columns:1.05fr 0.95fr;gap:48px;align-items:center;}
  .ls1-text{align-items:flex-start;text-align:left;}
  .ls1-text .ls1-hl,.ls1-text .ls1-sub{text-align:left;}
  .ls1-text .ls1-btns,.ls1-text .ls1-sources{justify-content:flex-start;}
}
@media(max-width:899px){.hero-phone{margin-top:8px;}.ls1-scroll{display:none;}}

/* ── STATS BAND (Sunday-style big numbers) ── */
.ls-stats{min-height:auto;background:var(--ink);padding:88px 32px;border-top:1px solid rgba(255,255,255,0.06);}
.ls-stats-inner{width:100%;max-width:1040px;margin:0 auto;}
.ls-stats-eyebrow{font-size:0.58rem;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:var(--accent);margin-bottom:48px;text-align:center;}
.ls-stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;}
.stat-big{text-align:left;padding:0 8px;}
.stat-num{font-family:'Inter',sans-serif;font-size:clamp(2.6rem,5vw,4rem);font-weight:800;color:#fff;letter-spacing:-0.04em;line-height:1;margin-bottom:12px;}
.stat-num em{color:var(--accent);font-style:normal;}
.stat-lbl{font-size:0.84rem;color:rgba(255,255,255,0.5);line-height:1.45;font-weight:400;}
@media(max-width:760px){.ls-stats-grid{grid-template-columns:1fr 1fr;gap:40px 24px;}.ls-stats{padding:64px 24px;}}

/* ── LIVE HEADLINES WALL ── */
.ls-wall{position:relative;overflow:hidden;background:var(--ink);padding:90px 32px;border-top:1px solid rgba(255,255,255,0.06);}
.ls-wall-head{max-width:1140px;margin:0 auto 44px;text-align:center;position:relative;z-index:1;}
.ls-wall-live{display:inline-flex;align-items:center;gap:8px;font-size:0.58rem;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;color:var(--accent);margin-bottom:18px;}
.ls-wall-live-dot{width:8px;height:8px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 0 rgba(200,16,46,0.6);animation:radarPulse 1.8s ease-out infinite;}
.ls-wall-hl{font-family:'Playfair Display',serif;font-size:clamp(2rem,4.6vw,3.4rem);font-weight:900;color:#fff;letter-spacing:-0.04em;line-height:1.04;margin-bottom:14px;}
.ls-wall-hl em{color:var(--accent);font-style:italic;}
.ls-wall-sub{font-size:1rem;color:rgba(255,255,255,0.45);line-height:1.65;max-width:480px;margin:0 auto;font-weight:300;}
.ls-wall-cols{position:relative;z-index:1;max-width:1140px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:16px;height:440px;overflow:hidden;-webkit-mask-image:linear-gradient(to bottom,transparent 0%,#000 14%,#000 86%,transparent 100%);mask-image:linear-gradient(to bottom,transparent 0%,#000 14%,#000 86%,transparent 100%);}
.wall-col{overflow:hidden;}
.wall-track{display:flex;flex-direction:column;gap:16px;}
.wall-track.up{animation:wallUp 34s linear infinite;}
.wall-track.down{animation:wallDown 40s linear infinite;}
.wall-track.up2{animation:wallUp 46s linear infinite;}
@keyframes wallUp{from{transform:translateY(0)}to{transform:translateY(-50%)}}
@keyframes wallDown{from{transform:translateY(-50%)}to{transform:translateY(0)}}
.wall-card{background:rgba(255,255,255,0.045);border:1px solid rgba(255,255,255,0.09);border-radius:13px;padding:16px 18px;transition:background 0.2s,border-color 0.2s;}
.wall-card:hover{background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.16);}
.wall-card-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:9px;}
.wall-src{font-size:0.56rem;font-weight:800;letter-spacing:0.05em;text-transform:uppercase;color:#fff;border-radius:4px;padding:3px 8px;line-height:1;}
.wall-time{font-size:0.58rem;font-weight:600;letter-spacing:0.04em;color:rgba(255,255,255,0.3);}
.wall-hl{font-family:'Playfair Display',serif;font-size:0.92rem;font-weight:700;color:rgba(255,255,255,0.92);line-height:1.28;letter-spacing:-0.01em;}
@media(max-width:760px){.ls-wall-cols{grid-template-columns:1fr;height:400px;}.ls-wall-cols .wall-col:nth-child(3){display:none;}.ls-wall{padding:64px 22px;}}

/* ── FULL-BLEED PHOTO STATEMENT (Sunday-style) ── */
/* ── GRADIENT-MESH STATEMENT (modern AI-site look) ── */
.ls-statement{position:relative;overflow:hidden;background:#070710;display:flex;align-items:center;justify-content:center;text-align:center;padding:150px 32px;min-height:86vh;}
.ls-statement::before{content:'';position:absolute;inset:-25%;z-index:0;pointer-events:none;
  background:
    radial-gradient(ellipse 38% 46% at 18% 28%, rgba(200,16,46,0.55) 0%, transparent 62%),
    radial-gradient(ellipse 42% 52% at 82% 22%, rgba(56,84,235,0.5) 0%, transparent 62%),
    radial-gradient(ellipse 48% 50% at 65% 82%, rgba(150,44,210,0.45) 0%, transparent 62%),
    radial-gradient(ellipse 40% 46% at 28% 78%, rgba(255,92,46,0.4) 0%, transparent 62%);
  filter:blur(70px);animation:meshMove 20s ease-in-out infinite;}
@keyframes meshMove{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(4%,-3%) scale(1.1)}66%{transform:translate(-3%,4%) scale(1.06)}}
.ls-statement::after{content:'';position:absolute;inset:0;z-index:0;pointer-events:none;background:radial-gradient(ellipse 90% 70% at 50% 50%, transparent 30%, rgba(7,7,16,0.65) 100%);}
.ls-statement-inner{position:relative;z-index:1;max-width:920px;margin:0 auto;}
.ls-statement-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.16);backdrop-filter:blur(12px);border-radius:100px;padding:8px 18px;font-size:0.62rem;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.85);margin-bottom:34px;}
.ls-statement-badge-dot{width:7px;height:7px;border-radius:50%;background:#3effa0;box-shadow:0 0 10px #3effa0;}
.ls-statement-hl{font-family:'Playfair Display',serif;font-size:clamp(2.8rem,8vw,6rem);font-weight:900;color:#fff;letter-spacing:-0.05em;line-height:0.96;margin-bottom:30px;}
.ls-statement-hl em{font-style:italic;background:linear-gradient(120deg,#ff5a2e,#c8102e,#9c2cd2);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;}
.ls-statement-sub{font-size:1.15rem;color:rgba(255,255,255,0.72);line-height:1.7;max-width:600px;margin:0 auto;font-weight:300;}
@media(max-width:760px){.ls-statement{padding:100px 24px;min-height:auto;}}

/* ── SLIDE 2: WHY ── */
.ls2-inner{width:100%;max-width:1000px;}
.ls2-eyebrow{font-size:0.58rem;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:var(--accent);margin-bottom:18px;}
.ls2-hl{font-family:'Playfair Display',serif;font-size:clamp(2rem,5vw,3.2rem);font-weight:900;color:#fff;letter-spacing:-0.04em;line-height:1.05;margin-bottom:56px;}
.ls2-hl em{color:var(--accent);font-style:italic;}
.ls2-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.ls2-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-left:3px solid var(--accent);border-radius:12px;padding:32px 28px;text-align:left;transition:background 0.2s,transform 0.2s;}
.ls2-card:hover{background:rgba(255,255,255,0.06);transform:translateY(-2px);}
.ls2-card-num{font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:900;color:var(--accent);letter-spacing:-0.04em;line-height:1;margin-bottom:14px;opacity:0.7;}
.ls2-card-title{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:800;color:#fff;letter-spacing:-0.03em;margin-bottom:8px;}
.ls2-card-text{font-size:0.8rem;color:rgba(255,255,255,0.45);line-height:1.7;}
@media(max-width:600px){.ls2-grid{grid-template-columns:1fr;}}

/* ── SLIDE 3: HOW ── */
.ls3-inner{width:100%;max-width:1000px;}
.ls3-eyebrow{font-size:0.58rem;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:var(--accent);margin-bottom:18px;}
.ls3-hl{font-family:'Playfair Display',serif;font-size:clamp(2rem,5vw,3.2rem);font-weight:900;color:#fff;letter-spacing:-0.04em;line-height:1.05;margin-bottom:56px;}
.ls3-steps{display:grid;grid-template-columns:1fr;gap:16px;width:100%;margin-bottom:48px;}
.ls3-step{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:32px 28px;text-align:left;transition:background 0.2s,transform 0.2s;}
.ls3-step:hover{background:rgba(255,255,255,0.07);transform:translateY(-2px);}
.ls3-num{font-family:'Playfair Display',serif;font-size:2.2rem;font-weight:900;color:var(--accent);letter-spacing:-0.05em;line-height:1;margin-bottom:16px;opacity:0.6;}
.ls3-step-title{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:800;color:#fff;letter-spacing:-0.02em;margin-bottom:6px;}
.ls3-step-text{font-size:0.82rem;color:rgba(255,255,255,0.45);line-height:1.68;}
.ls3-cta{background:var(--accent);color:#fff;border:none;border-radius:10px;padding:16px 36px;font-family:'Inter',sans-serif;font-size:0.95rem;font-weight:700;cursor:pointer;transition:background 0.2s,transform 0.2s,box-shadow 0.2s;}
.ls3-cta:hover{background:#e01535;transform:translateY(-2px);box-shadow:0 8px 24px rgba(200,16,46,0.35);}
@media(min-width:700px){.ls3-steps{grid-template-columns:repeat(3,1fr);}}

/* ── POST-BRIEF SIGNUP CTA (logged-out) ── */
.brief-cta{background:var(--ink);border-radius:20px;padding:52px 48px;margin:48px 0 0;position:relative;overflow:hidden;text-align:center;animation:fu 0.5s ease 0.3s both;}
.brief-cta::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 70% 80% at 50% 50%,rgba(26,58,107,0.45) 0%,transparent 70%),radial-gradient(ellipse 40% 40% at 100% 0%,rgba(200,16,46,0.06) 0%,transparent 55%);pointer-events:none;}
.brief-cta-inner{position:relative;z-index:1;}
.brief-cta-eyebrow{font-size:0.62rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--accent);margin-bottom:16px;display:flex;align-items:center;justify-content:center;gap:10px;}
.brief-cta-eyebrow::before,.brief-cta-eyebrow::after{content:'';width:20px;height:2px;background:var(--accent);display:block;}
.brief-cta-title{font-family:'Playfair Display',serif;font-size:clamp(1.7rem,3.5vw,2.8rem);font-weight:900;color:#fff;letter-spacing:-0.04em;line-height:1.05;margin-bottom:12px;}
.brief-cta-title em{color:var(--accent);font-style:italic;}
.brief-cta-sub{font-size:0.92rem;color:rgba(255,255,255,0.42);line-height:1.72;max-width:420px;margin:0 auto 28px;font-weight:300;}
.brief-cta-bullets{display:flex;flex-direction:column;gap:6px;max-width:340px;margin:0 auto 28px;text-align:left;}
.brief-cta-bullet{display:flex;align-items:center;gap:10px;font-size:0.82rem;color:rgba(255,255,255,0.6);}
.brief-cta-bullet::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--accent);flex-shrink:0;}
.brief-cta-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:24px;}
.brief-cta-btn-p{background:var(--accent);color:#fff;font-weight:700;font-size:0.95rem;padding:16px 32px;border:none;border-radius:10px;cursor:pointer;transition:all 0.2s;letter-spacing:0.01em;position:relative;overflow:hidden;}
.brief-cta-btn-p::after{content:'';position:absolute;inset:0;background:linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.15) 50%,transparent 70%);transform:translateX(-100%);transition:transform 0.5s ease;}
.brief-cta-btn-p:hover{background:#e01535;transform:translateY(-1px);box-shadow:0 8px 24px rgba(200,16,46,0.35);}
.brief-cta-btn-p:hover::after{transform:translateX(100%);}
.brief-cta-btn-s{background:transparent;color:rgba(255,255,255,0.5);font-weight:500;font-size:0.95rem;padding:16px 24px;border:1px solid rgba(255,255,255,0.15);border-radius:10px;cursor:pointer;transition:all 0.2s;}
.brief-cta-btn-s:hover{background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.82);}
.brief-cta-chips{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;margin-top:4px;}
.brief-cta-chip{font-size:0.6rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.11);color:rgba(255,255,255,0.4);padding:5px 11px;border-radius:5px;}
.brief-cta-note{font-size:0.68rem;color:rgba(255,255,255,0.22);margin-top:16px;letter-spacing:0.03em;}
@media(max-width:500px){.brief-cta{padding:36px 22px;}.brief-cta-btns{flex-direction:column;align-items:center;}.brief-cta-btn-p,.brief-cta-btn-s{width:100%;max-width:300px;}}

/* ══ LANDING CHROME (newsbang-style): glass nav · progress bar · waves ══ */
html{scroll-behavior:smooth;}

/* Landing topbar: transparent over the dark hero, glass on scroll */
.topbar.lp{position:fixed;left:0;right:0;top:0;background:transparent;border-bottom:1px solid transparent;backdrop-filter:none;-webkit-backdrop-filter:none;transition:background 0.35s ease,border-color 0.35s ease,backdrop-filter 0.35s ease;}
.topbar.lp .tb-title{color:#fff;}
.topbar.lp .tb-edition{color:rgba(255,255,255,0.42);border-left-color:rgba(255,255,255,0.16);}
.topbar.lp .auth-btn-signin{color:rgba(255,255,255,0.85);border-color:rgba(255,255,255,0.25);}
.topbar.lp .auth-btn-signin:hover{color:#fff;border-color:rgba(255,255,255,0.6);}
.topbar.lp .auth-btn-getstarted{background:#fff;color:#0b0b10;}
.topbar.lp .auth-btn-getstarted:hover{background:var(--accent);color:#fff;}
.topbar.lp.scrolled{background:rgba(11,11,16,0.72);backdrop-filter:blur(18px) saturate(1.4);-webkit-backdrop-filter:blur(18px) saturate(1.4);border-bottom-color:rgba(255,255,255,0.08);}

/* Center nav links with grow-underline hover */
.lp-nav{display:none;align-items:center;gap:30px;position:absolute;left:50%;transform:translateX(-50%);}
@media(min-width:760px){.lp-nav{display:flex;}}
.lp-nav a{position:relative;font-size:0.8rem;font-weight:600;letter-spacing:0.02em;color:rgba(255,255,255,0.62);text-decoration:none;padding:6px 2px;transition:color 0.2s;}
.lp-nav a::after{content:'';position:absolute;left:0;right:0;bottom:0;height:2px;border-radius:2px;background:linear-gradient(90deg,#3b62f6,#b44bf0,#e0233e);transform:scaleX(0);transform-origin:left;transition:transform 0.28s cubic-bezier(0.22,1,0.36,1);}
.lp-nav a:hover{color:#fff;}
.lp-nav a:hover::after{transform:scaleX(1);}

/* Scroll progress: thin gradient bar pinned to the nav's bottom edge */
.lp-progress{position:absolute;left:0;bottom:-1px;height:2px;width:0;background:linear-gradient(90deg,#3b62f6,#b44bf0,#e0233e);border-radius:0 2px 2px 0;box-shadow:0 0 12px rgba(139,61,240,0.55);pointer-events:none;transition:width 0.1s linear;}

/* Flowing gradient ribbons in the hero (the newsbang signature) */
.ls1-wave{position:absolute;left:0;right:0;bottom:-4%;height:46%;z-index:0;pointer-events:none;
  -webkit-mask-image:linear-gradient(to bottom,transparent 0%,#000 30%,#000 78%,transparent 100%);
  mask-image:linear-gradient(to bottom,transparent 0%,#000 30%,#000 78%,transparent 100%);}
.ls1-wave svg{width:200%;height:100%;display:block;}
.wvp{opacity:0.34;animation:wvDrift 22s ease-in-out infinite alternate;}
.wvp-0{opacity:0.75;filter:drop-shadow(0 0 6px rgba(139,61,240,0.8));animation-duration:18s;}
.wvp-1{opacity:0.6;filter:drop-shadow(0 0 5px rgba(59,98,246,0.6));animation-duration:26s;animation-direction:alternate-reverse;}
.wvp-2{animation-duration:21s;}
.wvp-3{animation-duration:30s;animation-direction:alternate-reverse;}
.wvp-4{opacity:0.26;animation-duration:24s;}
.wvp-5{opacity:0.22;animation-duration:34s;animation-direction:alternate-reverse;}
.wvp-6{opacity:0.18;animation-duration:27s;}
.wvp-7{opacity:0.14;animation-duration:38s;animation-direction:alternate-reverse;}
@keyframes wvDrift{from{transform:translateX(0);}to{transform:translateX(-720px);}}

/* Card + CTA hover polish: lift, glow, gradient edge */
.ls2-card{transition:transform 0.35s cubic-bezier(0.22,1,0.36,1),box-shadow 0.35s ease,border-color 0.35s ease;}
.ls2-card:hover{transform:translateY(-6px);border-color:rgba(139,61,240,0.45);box-shadow:0 18px 44px rgba(0,0,0,0.35),0 0 0 1px rgba(139,61,240,0.25);}
.ls3-step{transition:transform 0.35s cubic-bezier(0.22,1,0.36,1),box-shadow 0.35s ease;}
.ls3-step:hover{transform:translateY(-5px);box-shadow:0 16px 36px rgba(0,0,0,0.1);}
.wall-card{transition:transform 0.3s cubic-bezier(0.22,1,0.36,1),box-shadow 0.3s ease,border-color 0.3s ease;}
.wall-card:hover{transform:translateY(-4px) scale(1.015);border-color:rgba(139,61,240,0.5);box-shadow:0 14px 34px rgba(0,0,0,0.4);}
.ls3-cta,.ls1-btn-p{position:relative;transition:transform 0.25s cubic-bezier(0.22,1,0.36,1),box-shadow 0.25s ease;}
.ls3-cta:hover,.ls1-btn-p:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(200,16,46,0.35),0 0 24px rgba(139,61,240,0.3);}

/* Respect reduced-motion: freeze the decorative drift */
@media(prefers-reduced-motion:reduce){
  .wvp,.ls1-orb,.ls1-marquee-track{animation:none!important;}
  html{scroll-behavior:auto;}
}
`;

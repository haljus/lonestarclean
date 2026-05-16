import { useState, useEffect, useRef } from "react";

// ── Palette & tokens ──────────────────────────────────────────────────────────
const C = {
  navy: "#1B2E4B",
  navyLight: "#243D61",
  teal: "#2ABFBF",
  tealLight: "#3DD6D6",
  tealPale: "#E8F9F9",
  gold: "#F5A623",
  white: "#FFFFFF",
  offWhite: "#F7F9FC",
  gray50: "#F0F4F8",
  gray200: "#CBD5E1",
  gray400: "#94A3B8",
  gray600: "#475569",
  gray800: "#1E293B",
  textBody: "#374151",
};

// ── Shared helpers ────────────────────────────────────────────────────────────
const Star = ({ filled = true }) => (
  <svg viewBox="0 0 20 20" width="18" height="18" fill={filled ? C.gold : C.gray200}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const Stars = ({ n = 5 }) => (
  <div style={{ display: "flex", gap: 2 }}>
    {Array.from({ length: 5 }).map((_, i) => <Star key={i} filled={i < n} />)}
  </div>
);

const Btn = ({ children, variant = "primary", href, onClick, small, style = {} }) => {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 8,
    fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
    borderRadius: 50, cursor: "pointer", border: "none",
    textDecoration: "none", transition: "all .22s ease",
    fontSize: small ? 14 : 16,
    padding: small ? "10px 22px" : "15px 32px",
    letterSpacing: ".3px",
  };
  const variants = {
    primary: { background: C.teal, color: C.white, boxShadow: `0 4px 18px ${C.teal}55` },
    navy: { background: C.navy, color: C.white, boxShadow: `0 4px 18px ${C.navy}44` },
    outline: { background: "transparent", color: C.navy, border: `2.5px solid ${C.navy}` },
    outlineWhite: { background: "transparent", color: C.white, border: "2.5px solid rgba(255,255,255,.7)" },
    gold: { background: C.gold, color: C.navy, boxShadow: `0 4px 18px ${C.gold}66` },
  };
  const Tag = href ? "a" : "button";
  return (
    <Tag href={href} onClick={onClick} style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 28px ${C.teal}66`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = variants[variant].boxShadow || ""; }}>
      {children}
    </Tag>
  );
};

const SectionLabel = ({ children }) => (
  <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: C.teal, margin: "0 0 12px" }}>
    {children}
  </p>
);

const SectionTitle = ({ children, center, white }) => (
  <h2 style={{
    fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,4vw,46px)",
    fontWeight: 700, lineHeight: 1.15, color: white ? C.white : C.navy,
    margin: "0 0 18px", textAlign: center ? "center" : undefined,
  }}>{children}</h2>
);

const SectionSub = ({ children, center, white }) => (
  <p style={{
    fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(15px,1.8vw,18px)",
    color: white ? "rgba(255,255,255,.8)" : C.gray600, lineHeight: 1.7,
    margin: "0 0 40px", textAlign: center ? "center" : undefined, maxWidth: 620,
    marginLeft: center ? "auto" : undefined, marginRight: center ? "auto" : undefined,
  }}>{children}</p>
);

// Icons as inline SVG components
const Icon = ({ name, size = 28, color = C.teal }) => {
  const icons = {
    home: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    sparkles: <><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></>,
    move: <><polyline points="5 9 2 12 5 15"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/></>,
    airbnb: <><circle cx="12" cy="8" r="3"/><path d="M12 2C9.24 2 7 4.24 7 7c0 3.5 5 9 5 9s5-5.5 5-9c0-2.76-2.24-5-5-5z"/></>,
    office: <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></>,
    repeat: <><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    dollar: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></>,
    leaf: <><path d="M2 22c0 0 4-2 8-6s6-8 6-8S7 5 3 9s-1 13-1 13z"/><path d="M22 2L12 12"/></>,
    check: <><polyline points="20 6 9 17 4 12"/></>,
    star: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
    phone: <><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013 4.18 2 2 0 015 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></>,
    mail: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></>,
    map: <><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></>,
    fb: <><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></>,
    ig: <><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></>,
    wa: <><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></>,
    quote: <><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></>,
    texas: <><path d="M9 2H4v8L2 12l2 2v4l3 2h2l1 2h4l2-2h2l2-4v-3l-2-1V4l-2-2H9z"/></>,
  };
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

// ── Coupon Banner ─────────────────────────────────────────────────────────────
const CouponBanner = () => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div style={{ background: `linear-gradient(90deg, ${C.navy}, ${C.navyLight})`, color: C.white, textAlign: "center", padding: "10px 20px", position: "relative", zIndex: 100 }}>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>
        🎉 <span style={{ color: C.gold, fontWeight: 800 }}>10% OFF</span> your first cleaning — Use code <strong style={{ color: C.tealLight }}>WELCOME10</strong> when booking!
      </span>
      <button onClick={() => setVisible(false)} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,.6)", cursor: "pointer", fontSize: 18 }}>✕</button>
    </div>
  );
};

// ── Navigation ────────────────────────────────────────────────────────────────
const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = [
    { label: "Services",  id: "services"  },
    { label: "Why Us",    id: "why-us"    },
    { label: "About",     id: "about"     },
    { label: "Reviews",   id: "reviews"   },
    { label: "Pricing",   id: "pricing"   },
    { label: "Contact",   id: "contact"   },
  ];
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 99,
      background: scrolled ? C.white : "transparent",
      boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,.1)" : "none",
      transition: "all .3s ease", padding: "0 24px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 70 }}>
        <button onClick={() => scrollTo("hero")} style={{ background: "none", border: "none", cursor: "pointer", textDecoration: "none", display: "flex", alignItems: "center", gap: 10, padding: 0 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 20 }}>✨</span>
          </div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: C.navy, lineHeight: 1 }}>Lone Star Clean</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: C.teal, letterSpacing: 2, textTransform: "uppercase", lineHeight: 1 }}>DFW Cleaning Services</div>
          </div>
        </button>
        {/* Desktop links */}
        <div style={{ display: "flex", gap: 28, alignItems: "center" }} className="nav-desktop">
          {links.map(({ label, id }) => (
            <button key={id} onClick={() => scrollTo(id)}
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: C.gray600, background: "none", border: "none", cursor: "pointer", padding: "4px 0", transition: "color .2s" }}
              onMouseEnter={e => e.target.style.color = C.teal} onMouseLeave={e => e.target.style.color = C.gray600}>{label}</button>
          ))}
          <Btn href="tel:+12145550100" variant="navy" small>📞 Call Now</Btn>
        </div>
        {/* Hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 8 }} className="nav-hamburger">
          <div style={{ width: 22, height: 2, background: C.navy, margin: "4px 0", transition: "all .3s" }} />
          <div style={{ width: 22, height: 2, background: C.navy, margin: "4px 0" }} />
          <div style={{ width: 22, height: 2, background: C.navy, margin: "4px 0" }} />
        </button>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: C.white, borderTop: `1px solid ${C.gray200}`, padding: "16px 24px" }}>
          {links.map(({ label, id }) => (
            <button key={id} onClick={() => { scrollTo(id); setMenuOpen(false); }}
              style={{ display: "block", width: "100%", textAlign: "left", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: C.navy, background: "none", border: "none", borderBottom: `1px solid ${C.gray50}`, cursor: "pointer", padding: "10px 0" }}>{label}</button>
          ))}
          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <Btn href="tel:+12145550100" variant="navy" small>📞 Call</Btn>
            <Btn onClick={() => { scrollTo("contact"); setMenuOpen(false); }} variant="primary" small>Get Quote</Btn>
          </div>
        </div>
      )}
    </nav>
  );
};

// ── Hero ──────────────────────────────────────────────────────────────────────
const Hero = () => (
  <section id="hero" style={{
    background: `linear-gradient(145deg, ${C.navy} 0%, ${C.navyLight} 50%, #1a4060 100%)`,
    color: C.white, padding: "80px 24px 100px", position: "relative", overflow: "hidden",
  }}>
    {/* Decorative blobs */}
    <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${C.teal}22, transparent 70%)`, pointerEvents: "none" }} />
    <div style={{ position: "absolute", bottom: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${C.teal}15, transparent 70%)`, pointerEvents: "none" }} />
    {/* Texas star subtle bg */}
    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 600, opacity: .02, pointerEvents: "none", userSelect: "none" }}>★</div>

    <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
      <div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${C.teal}22`, border: `1px solid ${C.teal}44`, borderRadius: 50, padding: "6px 16px", marginBottom: 24 }}>
          <span style={{ fontSize: 12 }}>⭐</span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: C.tealLight }}>5-Star Rated · DFW Family Business</span>
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px,4.5vw,56px)", fontWeight: 800, lineHeight: 1.1, margin: "0 0 20px", color: C.white }}>
          Professional Cleaning Services You Can <span style={{ color: C.tealLight, fontStyle: "italic" }}>Trust</span> in Dallas–Fort Worth
        </h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(16px,1.8vw,20px)", color: "rgba(255,255,255,.8)", lineHeight: 1.7, margin: "0 0 36px", maxWidth: 540 }}>
          Family-owned cleaning company delivering spotless homes and offices with reliable, personalized service. Serving DFW since 2010.
        </p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 40 }}>
          <Btn onClick={() => scrollTo("contact")} variant="primary" style={{ fontSize: 17, padding: "16px 36px" }}>✨ Get Free Quote</Btn>
          <Btn href="tel:+12145550100" variant="outlineWhite" style={{ fontSize: 17, padding: "16px 36px" }}>📞 Call Now</Btn>
        </div>
        {/* Trust badges */}
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[["🏠", "Family Owned"], ["🛡️", "Fully Insured"], ["✅", "Satisfaction Guaranteed"], ["📍", "Locally Trusted"]].map(([icon, label]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,.1)", borderRadius: 8, padding: "8px 14px" }}>
              <span style={{ fontSize: 16 }}>{icon}</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.9)" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Hero card */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ background: "rgba(255,255,255,.07)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 24, padding: 32, maxWidth: 400, width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 60, marginBottom: 8 }}>🧹</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.white }}>Book in 60 Seconds</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,.7)", marginTop: 4 }}>Fast, easy, no commitment</div>
          </div>
          {[["📅", "Choose your date & time"], ["🏡", "Pick your service type"], ["💬", "We confirm within 1 hour"], ["✨", "Enjoy your clean space!"]].map(([icon, text], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${C.teal}33`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18 }}>{icon}</div>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "rgba(255,255,255,.85)", fontWeight: 500 }}>{text}</span>
            </div>
          ))}
          <Btn onClick={() => scrollTo("contact")} variant="primary" style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>Get My Free Estimate →</Btn>
        </div>
      </div>
    </div>
    {/* Wave bottom */}
    <svg style={{ position: "absolute", bottom: -1, left: 0, width: "100%" }} viewBox="0 0 1440 60" preserveAspectRatio="none">
      <path d="M0,60 L0,30 Q360,0 720,30 Q1080,60 1440,20 L1440,60 Z" fill={C.offWhite} />
    </svg>
  </section>
);

// ── Stats Bar ─────────────────────────────────────────────────────────────────
const StatsBar = () => (
  <section id="stats" style={{ background: C.offWhite, padding: "40px 24px" }}>
    <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24, textAlign: "center" }}>
      {[["500+", "Happy Clients"], ["15+", "Years Serving DFW"], ["4.9★", "Google Rating"], ["100%", "Satisfaction Rate"]].map(([num, label]) => (
        <div key={label}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,3vw,42px)", fontWeight: 800, color: C.navy }}>{num}</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.gray600, fontWeight: 500, marginTop: 4 }}>{label}</div>
        </div>
      ))}
    </div>
  </section>
);

// ── Services ──────────────────────────────────────────────────────────────────
const services = [
  { icon: "home", title: "Residential Cleaning", emoji: "🏠", desc: "Regular home cleaning tailored to your lifestyle and schedule.", bullets: ["Full kitchen & bathrooms", "Dusting, vacuuming & mopping", "Customizable checklists"], color: C.teal },
  { icon: "sparkles", title: "Deep Cleaning", emoji: "✨", desc: "A thorough top-to-bottom clean for when your home needs extra love.", bullets: ["Inside appliances", "Baseboards & light fixtures", "Cabinet fronts & more"], color: "#6366F1" },
  { icon: "move", title: "Move-In / Move-Out", emoji: "📦", desc: "Leave your old place spotless or arrive to a fresh new start.", bullets: ["Deposit-back guarantee ready", "Inside cabinets & drawers", "Perfect for realtors too"], color: C.gold },
  { icon: "airbnb", title: "Airbnb / Short-Term", emoji: "🛏️", desc: "Quick turnovers and 5-star ready presentation for your rental.", bullets: ["Linen change & setup", "Fast same-day turnovers", "Guest-ready guarantee"], color: "#EC4899" },
  { icon: "office", title: "Office & Commercial", emoji: "🏢", desc: "Professional office cleaning that keeps your team productive.", bullets: ["After-hours availability", "Common areas & restrooms", "Flexible contracts"], color: "#10B981" },
  { icon: "repeat", title: "Recurring Cleaning", emoji: "🔁", desc: "Weekly, biweekly, or monthly plans with priority scheduling.", bullets: ["Locked-in pricing", "Same trusted cleaner", "Up to 20% savings"], color: C.navy },
];

const Services = () => (
  <section id="services" style={{ background: C.white, padding: "90px 24px" }}>
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ textAlign: "center" }}>
        <SectionLabel>What We Offer</SectionLabel>
        <SectionTitle center>Cleaning Services for Every Need</SectionTitle>
        <SectionSub center>From one-time deep cleans to weekly recurring service — we've got your home or office covered.</SectionSub>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        {services.map(({ emoji, title, desc, bullets, color }) => (
          <div key={title} style={{ background: C.offWhite, borderRadius: 20, padding: 28, border: "1px solid transparent", transition: "all .3s ease", cursor: "default" }}
            onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${color}44`; e.currentTarget.style.boxShadow = `0 12px 40px ${color}22`; e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseLeave={e => { e.currentTarget.style.border = "1px solid transparent"; e.currentTarget.style.boxShadow = ""; e.currentTarget.style.transform = ""; }}>
            <div style={{ width: 54, height: 54, borderRadius: 16, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, fontSize: 28 }}>{emoji}</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.navy, margin: "0 0 10px" }}>{title}</h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.gray600, lineHeight: 1.6, margin: "0 0 16px" }}>{desc}</p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px" }}>
              {bullets.map(b => (
                <li key={b} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.textBody, marginBottom: 6 }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: `${color}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 10, color }}>✓</span>
                  </div>
                  {b}
                </li>
              ))}
            </ul>
            <Btn onClick={() => scrollTo("contact")} variant="outline" small style={{ border: `2px solid ${color}`, color, width: "100%", justifyContent: "center" }}>Get a Quote →</Btn>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Why Choose Us ─────────────────────────────────────────────────────────────
const WhyUs = () => (
  <section id="why-us" style={{ background: C.offWhite, padding: "90px 24px" }}>
    <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 70, alignItems: "center" }}>
      <div>
        <SectionLabel>Why Choose Us</SectionLabel>
        <SectionTitle>The Lone Star Clean Difference</SectionTitle>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: C.gray600, lineHeight: 1.7, marginBottom: 36 }}>
          We're not a faceless franchise — we're your neighbors. Every job is done with the same care we'd bring to our own homes.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {[
            ["🧑‍💼", "Background-Checked Cleaners", "Every team member is vetted, insured & trained."],
            ["📅", "Flexible Scheduling", "Early mornings, evenings & weekends available."],
            ["💵", "Honest, Upfront Pricing", "No surprises — quotes before we start."],
            ["🌿", "Pet-Friendly Products", "Safe for kids, pets & sensitive households."],
            ["🔍", "Attention to Detail", "We clean what others miss, every single time."],
            ["💬", "Reliable Communication", "Real-time updates via text — always reachable."],
          ].map(([emoji, title, desc]) => (
            <div key={title} style={{ background: C.white, borderRadius: 16, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{emoji}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, color: C.navy, marginBottom: 6 }}>{title}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.gray600, lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "relative" }}>
        <div style={{ background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`, borderRadius: 28, padding: 40, color: C.white }}>
          <div style={{ fontSize: 50, marginBottom: 16 }}>🏆</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Our Satisfaction Guarantee</div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.7, opacity: .9, marginBottom: 24 }}>
            If you're not 100% happy with your cleaning, we come back within 24 hours to make it right — no questions asked.
          </p>
          <div style={{ background: "rgba(255,255,255,.15)", borderRadius: 16, padding: 20 }}>
            <div style={{ display: "flex", gap: 3, marginBottom: 8 }}>{Array(5).fill(0).map((_, i) => <Star key={i} />)}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontStyle: "italic", opacity: .95 }}>
              "They cleaned every corner. My house has never looked better. Highly recommend to anyone in Plano!"
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, marginTop: 10, opacity: .8 }}>— Maria G., Plano TX</div>
          </div>
        </div>
        <div style={{ position: "absolute", top: -16, right: -16, width: 80, height: 80, borderRadius: "50%", background: C.gold, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", boxShadow: `0 4px 20px ${C.gold}66` }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 20, color: C.navy, lineHeight: 1 }}>10%</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, color: C.navy }}>OFF 1ST</div>
        </div>
      </div>
    </div>
  </section>
);

// ── About ─────────────────────────────────────────────────────────────────────
const About = () => (
  <section id="about" style={{ background: C.white, padding: "90px 24px" }}>
    <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 70, alignItems: "center" }}>
      <div style={{ position: "relative" }}>
        <div style={{ background: C.tealPale, borderRadius: 24, padding: 48, textAlign: "center" }}>
          <div style={{ fontSize: 80 }}>👨‍👩‍👧‍👦</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.navy, marginTop: 16 }}>The Rodriguez Family</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.gray600, marginTop: 6 }}>Founded 2010 · Dallas, TX</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 3, marginTop: 12 }}>{Array(5).fill(0).map((_, i) => <Star key={i} />)}</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.gray600, marginTop: 6 }}>500+ five-star reviews</div>
        </div>
        {/* Texas badge */}
        <div style={{ position: "absolute", bottom: -18, right: -18, background: C.navy, borderRadius: 16, padding: "12px 18px", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>🤠</span>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: C.white }}>Proud Texas<br />Business</div>
        </div>
      </div>
      <div>
        <SectionLabel>Our Story</SectionLabel>
        <SectionTitle>We Clean Like It's Our Own Home</SectionTitle>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: C.gray600, lineHeight: 1.8, marginBottom: 20 }}>
          Lone Star Clean was started in 2010 by the Rodriguez family right here in Dallas. What began as a small operation with a mop, a bucket, and a lot of heart has grown into one of DFW's most trusted cleaning services.
        </p>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: C.gray600, lineHeight: 1.8, marginBottom: 20 }}>
          We treat every client like a neighbor — because you are. We know your name, your home, and what matters most to you. That personal touch is what sets us apart from the big franchises.
        </p>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: C.gray600, lineHeight: 1.8, marginBottom: 36 }}>
          Honest work, fair prices, and a spotless result — every time. That's our promise to the DFW community.
        </p>
        <div style={{ display: "flex", gap: 14 }}>
          <Btn onClick={() => scrollTo("contact")} variant="primary">Book Us Today</Btn>
          <Btn href="tel:+12145550100" variant="outline">📞 Talk to Us</Btn>
        </div>
      </div>
    </div>
  </section>
);

// ── Before & After Slider ─────────────────────────────────────────────────────
const BeforeAfterSlider = () => {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const ref = useRef(null);

  const rooms = [
    { label: "Kitchen", before: "#c8d6e0", after: "#e8f9f9", beforeLabel: "Before", afterLabel: "After" },
    { label: "Bathroom", before: "#d0c8e0", after: "#e8f0f9", beforeLabel: "Before", afterLabel: "After" },
    { label: "Living Room", before: "#e0d8c8", after: "#f9f4e8", beforeLabel: "Before", afterLabel: "After" },
  ];
  const [activeRoom, setActiveRoom] = useState(0);

  const handleMove = (e) => {
    if (!dragging || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const pct = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
    setPos(pct);
  };

  return (
    <section id="before-after" style={{ background: C.offWhite, padding: "90px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center" }}>
          <SectionLabel>Transformations</SectionLabel>
          <SectionTitle center>See the Lone Star Clean Difference</SectionTitle>
          <SectionSub center>Drag the slider to reveal incredible before & after results.</SectionSub>
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 28 }}>
          {rooms.map((r, i) => (
            <button key={r.label} onClick={() => { setActiveRoom(i); setPos(50); }}
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, padding: "8px 20px", borderRadius: 50, border: `2px solid ${i === activeRoom ? C.teal : C.gray200}`, background: i === activeRoom ? C.teal : "transparent", color: i === activeRoom ? C.white : C.gray600, cursor: "pointer", transition: "all .2s" }}>
              {r.label}
            </button>
          ))}
        </div>
        <div ref={ref} onMouseMove={handleMove} onMouseUp={() => setDragging(false)} onMouseLeave={() => setDragging(false)}
          onTouchMove={handleMove} onTouchEnd={() => setDragging(false)}
          style={{ position: "relative", borderRadius: 20, overflow: "hidden", height: 380, cursor: "col-resize", userSelect: "none", boxShadow: "0 20px 60px rgba(0,0,0,.15)" }}>
          {/* Before (full) */}
          <div style={{ position: "absolute", inset: 0, background: rooms[activeRoom].before, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 80 }}>🪣</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, color: "rgba(0,0,0,.4)", fontSize: 24 }}>BEFORE</div>
            </div>
          </div>
          {/* After (clipped) */}
          <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - pos}% 0 0)`, background: rooms[activeRoom].after, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 80 }}>✨</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, color: C.teal, fontSize: 24 }}>AFTER</div>
            </div>
          </div>
          {/* Divider */}
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, transform: "translateX(-50%)", width: 3, background: C.white, zIndex: 2 }}>
            <div onMouseDown={() => setDragging(true)} onTouchStart={() => setDragging(true)}
              style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 44, height: 44, borderRadius: "50%", background: C.white, boxShadow: "0 4px 20px rgba(0,0,0,.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "col-resize", fontSize: 18 }}>
              ↔
            </div>
          </div>
          {/* Labels */}
          <div style={{ position: "absolute", top: 16, left: 16, background: "rgba(0,0,0,.5)", borderRadius: 8, padding: "4px 12px", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: C.white }}>BEFORE</div>
          <div style={{ position: "absolute", top: 16, right: 16, background: C.teal, borderRadius: 8, padding: "4px 12px", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: C.white }}>AFTER</div>
        </div>
        <p style={{ textAlign: "center", fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.gray400, marginTop: 16 }}>← Drag to compare →</p>
      </div>
    </section>
  );
};

// ── Testimonials ──────────────────────────────────────────────────────────────
const reviews = [
  { name: "Maria G.", city: "Plano", rating: 5, text: "Absolutely incredible! They cleaned every corner of my house. I've used other services but Lone Star Clean is on a completely different level. Will be booking monthly from now on." },
  { name: "James & Lisa T.", city: "Frisco", rating: 5, text: "We use them for our Airbnb and our guests always comment on how spotless the place is. Turnaround is fast and they're so easy to communicate with. 10/10!" },
  { name: "Robert M.", city: "Dallas", rating: 5, text: "Hired them for a deep clean before we moved into our new home. The before and after difference was jaw-dropping. Fair price, professional team, zero complaints." },
  { name: "Ashley K.", city: "Arlington", rating: 5, text: "I have two dogs and was worried about finding a pet-safe service. They used all natural products and my pups didn't react at all. The house smells amazing now!" },
  { name: "Carlos P.", city: "Fort Worth", rating: 5, text: "Lone Star Clean handles our office twice a week. They're always on time, always thorough, and our employees love coming in to a clean workspace. Highly recommend!" },
  { name: "Jennifer R.", city: "Richardson", rating: 5, text: "As a realtor I send all my clients to Lone Star Clean for move-out cleanings. They're reliable, professional, and my clients always get their deposits back. Total pros!" },
];

const Testimonials = () => (
  <section id="reviews" style={{ background: `linear-gradient(150deg, ${C.navy}, #0f2038)`, padding: "90px 24px" }}>
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 50 }}>
        <SectionLabel>Customer Love</SectionLabel>
        <SectionTitle center white>What DFW Families Are Saying</SectionTitle>
        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 16 }}>
          {Array(5).fill(0).map((_, i) => <Star key={i} />)}
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "rgba(255,255,255,.6)" }}>4.9/5 based on 200+ Google Reviews</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
        {reviews.map(({ name, city, rating, text }) => (
          <div key={name} style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 20, padding: 28, transition: "all .3s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.12)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.07)"; e.currentTarget.style.transform = ""; }}>
            <div style={{ fontSize: 28, color: C.teal, marginBottom: 12 }}>"</div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "rgba(255,255,255,.85)", lineHeight: 1.7, margin: "0 0 20px", fontStyle: "italic" }}>"{text}"</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, color: C.white }}>{name}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.tealLight }}>📍 {city}, TX</div>
              </div>
              <Stars n={rating} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Btn onClick={() => scrollTo("contact")} variant="outlineWhite">See All Google Reviews →</Btn>
      </div>
    </div>
  </section>
);

// ── Service Area ──────────────────────────────────────────────────────────────
const cities = ["Dallas", "Fort Worth", "Plano", "Frisco", "McKinney", "Arlington", "Irving", "Garland", "Richardson", "Carrollton", "Denton", "Allen", "Lewisville", "Grapevine"];

const ServiceArea = () => (
  <section id="area" style={{ background: C.white, padding: "90px 24px" }}>
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ textAlign: "center" }}>
        <SectionLabel>Where We Serve</SectionLabel>
        <SectionTitle center>Proudly Serving the DFW Metroplex</SectionTitle>
        <SectionSub center>We cover the entire Dallas–Fort Worth area. Don't see your city? Give us a call — we likely cover it!</SectionSub>
      </div>
      <div style={{ background: C.offWhite, borderRadius: 24, padding: 40 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 32 }}>
          {cities.map(city => (
            <div key={city} style={{ background: C.white, border: `2px solid ${C.teal}44`, borderRadius: 50, padding: "10px 20px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
              <span style={{ color: C.teal, fontSize: 14 }}>📍</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15, color: C.navy }}>{city}</span>
            </div>
          ))}
        </div>
        <div style={{ background: `linear-gradient(135deg, ${C.tealPale}, ${C.white})`, borderRadius: 16, padding: "28px 32px", textAlign: "center", border: `1px solid ${C.teal}33` }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🤠</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Not sure if we cover your area?</div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: C.gray600, marginBottom: 20 }}>Text or call us — if you're in the DFW area, we'll be there!</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn href="tel:+12145550100" variant="navy">📞 Call Us</Btn>
            <Btn href="sms:+12145550100" variant="primary">💬 Text Us</Btn>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ── Pricing ───────────────────────────────────────────────────────────────────
const Pricing = () => (
  <section id="pricing" style={{ background: C.offWhite, padding: "90px 24px" }}>
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ textAlign: "center" }}>
        <SectionLabel>Transparent Pricing</SectionLabel>
        <SectionTitle center>Simple, Honest Starting Prices</SectionTitle>
        <SectionSub center>Pricing varies based on home size and condition. Get a custom quote for your exact needs — it's free!</SectionSub>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24, marginBottom: 24 }}>
        {[
          { name: "Standard Cleaning", price: "$120", freq: "starting at", features: ["Bedrooms & living areas", "Kitchen surfaces", "Bathrooms", "Floors & dusting"], color: C.teal, popular: false },
          { name: "Deep Cleaning", price: "$220", freq: "starting at", features: ["Everything in Standard", "Inside appliances", "Baseboards & vents", "Window sills & more"], color: C.navy, popular: true },
          { name: "Move-Out Cleaning", price: "$200", freq: "starting at", features: ["Whole home deep clean", "Inside all cabinets", "Appliances included", "Deposit-ready clean"], color: "#6366F1", popular: false },
        ].map(({ name, price, freq, features, color, popular }) => (
          <div key={name} style={{ background: C.white, borderRadius: 20, padding: 32, position: "relative", border: popular ? `2px solid ${C.navy}` : `1px solid ${C.gray200}`, boxShadow: popular ? `0 16px 48px ${C.navy}22` : "0 4px 16px rgba(0,0,0,.06)", transform: popular ? "scale(1.03)" : "" }}>
            {popular && <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: C.navy, color: C.white, borderRadius: 50, padding: "4px 18px", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>⭐ Most Popular</div>}
            <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 18, color: C.navy, margin: "0 0 8px" }}>{name}</h3>
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.gray400 }}>{freq} </span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 800, color }}>{price}</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px" }}>
              {features.map(f => (
                <li key={f} style={{ display: "flex", gap: 10, alignItems: "center", fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.textBody, marginBottom: 10 }}>
                  <span style={{ color, fontWeight: 700, flexShrink: 0 }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <Btn onClick={() => scrollTo("contact")} variant={popular ? "navy" : "outline"} style={{ width: "100%", justifyContent: "center" }}>Get Quote</Btn>
          </div>
        ))}
      </div>
      <p style={{ textAlign: "center", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.gray400, fontStyle: "italic" }}>
        * Pricing varies based on home size, condition, and specific requirements. Final quote provided before any work begins.
      </p>
      {/* Recurring discount banner */}
      <div style={{ background: `linear-gradient(90deg, ${C.teal}, ${C.navy})`, borderRadius: 16, padding: 24, display: "flex", alignItems: "center", gap: 20, marginTop: 32, flexWrap: "wrap" }}>
        <div style={{ fontSize: 40 }}>🔁</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 18, color: C.white }}>Save up to 20% with Recurring Service</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,.8)", marginTop: 4 }}>Weekly & biweekly plans with locked-in pricing and the same trusted cleaner every visit.</div>
        </div>
        <Btn onClick={() => scrollTo("contact")} variant="gold">Get My Discount →</Btn>
      </div>
    </div>
  </section>
);

// ── Lead Form ─────────────────────────────────────────────────────────────────
const LeadForm = () => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", zip: "", type: "", date: "", message: "" });
  const [sent, setSent] = useState(false);
  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const submit = (e) => { e.preventDefault(); setSent(true); };

  const inputStyle = { width: "100%", padding: "14px 16px", borderRadius: 10, border: `1.5px solid ${C.gray200}`, fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: C.navy, background: C.white, outline: "none", boxSizing: "border-box", transition: "border .2s" };

  return (
    <section id="contact" style={{ background: C.white, padding: "90px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 70, alignItems: "start" }}>
        <div>
          <SectionLabel>Get Your Free Quote</SectionLabel>
          <SectionTitle>Let's Get Your Space Sparkling Clean</SectionTitle>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: C.gray600, lineHeight: 1.7, marginBottom: 32 }}>
            Fill out the form and we'll reach out within 1 hour with your custom quote. No pressure, no commitment.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[["📞", "Call or Text Us", "(214) 555-0100", "tel:+12145550100"], ["📧", "Email Us", "hello@lonestarclean.com", "mailto:hello@lonestarclean.com"], ["💬", "WhatsApp", "Message us anytime", "https://wa.me/12145550100"]].map(([icon, label, val, href]) => (
              <a key={label} href={href} style={{ display: "flex", alignItems: "center", gap: 16, textDecoration: "none", background: C.offWhite, borderRadius: 14, padding: 18, transition: "all .2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = C.tealPale; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.offWhite; }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: C.teal, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{icon}</div>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, color: C.navy }}>{label}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.teal }}>{val}</div>
                </div>
              </a>
            ))}
          </div>
          {/* Referral */}
          <div style={{ background: C.navy, borderRadius: 16, padding: 20, marginTop: 24 }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, color: C.white, marginBottom: 4 }}>🎁 Referral Program</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,.75)" }}>Refer a friend and get $25 off your next cleaning when they book!</div>
          </div>
        </div>

        <div style={{ background: C.offWhite, borderRadius: 24, padding: 36 }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: 64 }}>🎉</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: C.navy, margin: "16px 0 8px" }}>We got your request!</div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", color: C.gray600, fontSize: 16 }}>We'll reach out within 1 hour with your free quote. Thank you!</p>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.navy, marginBottom: 4 }}>Get My Free Estimate</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <input name="name" placeholder="Full Name *" value={form.name} onChange={handle} required style={inputStyle} onFocus={e => e.target.style.border = `1.5px solid ${C.teal}`} onBlur={e => e.target.style.border = `1.5px solid ${C.gray200}`} />
                <input name="phone" placeholder="Phone Number *" value={form.phone} onChange={handle} required style={inputStyle} onFocus={e => e.target.style.border = `1.5px solid ${C.teal}`} onBlur={e => e.target.style.border = `1.5px solid ${C.gray200}`} />
              </div>
              <input name="email" type="email" placeholder="Email Address *" value={form.email} onChange={handle} required style={inputStyle} onFocus={e => e.target.style.border = `1.5px solid ${C.teal}`} onBlur={e => e.target.style.border = `1.5px solid ${C.gray200}`} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <input name="zip" placeholder="ZIP Code" value={form.zip} onChange={handle} style={inputStyle} onFocus={e => e.target.style.border = `1.5px solid ${C.teal}`} onBlur={e => e.target.style.border = `1.5px solid ${C.gray200}`} />
                <input name="date" type="date" value={form.date} onChange={handle} style={inputStyle} onFocus={e => e.target.style.border = `1.5px solid ${C.teal}`} onBlur={e => e.target.style.border = `1.5px solid ${C.gray200}`} />
              </div>
              <select name="type" value={form.type} onChange={handle} style={{ ...inputStyle, color: form.type ? C.navy : C.gray400 }}>
                <option value="">Type of Cleaning *</option>
                <option>Standard / Regular Cleaning</option>
                <option>Deep Cleaning</option>
                <option>Move-In / Move-Out Cleaning</option>
                <option>Airbnb / Short-Term Rental</option>
                <option>Office / Commercial</option>
                <option>Recurring Service (Weekly/Biweekly)</option>
              </select>
              <textarea name="message" placeholder="Any special requests or details?" value={form.message} onChange={handle} rows={3} style={{ ...inputStyle, resize: "vertical" }} onFocus={e => e.target.style.border = `1.5px solid ${C.teal}`} onBlur={e => e.target.style.border = `1.5px solid ${C.gray200}`} />
              <button type="submit" style={{ background: `linear-gradient(135deg, ${C.teal}, #1fa0a0)`, color: C.white, border: "none", borderRadius: 50, padding: "16px", fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 16, cursor: "pointer", letterSpacing: ".3px", transition: "all .2s", boxShadow: `0 6px 20px ${C.teal}55` }}
                onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = `0 10px 28px ${C.teal}77`; }}
                onMouseLeave={e => { e.target.style.transform = ""; e.target.style.boxShadow = `0 6px 20px ${C.teal}55`; }}>
                ✨ Get My Free Estimate
              </button>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.gray400, textAlign: "center", margin: 0 }}>
                🔒 Your info is safe. No spam, ever. We respond within 1 hour.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

// ── FAQ ───────────────────────────────────────────────────────────────────────
const faqs = [
  ["Are you insured and background-checked?", "Yes! All Lone Star Clean team members undergo thorough background checks and we carry full liability insurance. Your home and safety are our top priority."],
  ["Do I need to provide cleaning supplies?", "Nope! We bring everything — professional-grade, pet-safe, and eco-friendly products. If you have a preference for specific products, just let us know."],
  ["Do you offer recurring cleaning plans?", "Absolutely! We offer weekly, biweekly, and monthly plans with priority scheduling, locked-in pricing, and the same dedicated cleaner every visit."],
  ["How do I book a cleaning?", "You can fill out our quick quote form on this page, call or text us at (214) 555-0100, or message us on WhatsApp. We confirm within 1 hour!"],
  ["What areas of DFW do you serve?", "We serve Dallas, Fort Worth, Plano, Frisco, McKinney, Arlington, Irving, Garland, Richardson, Carrollton, and surrounding DFW cities."],
  ["What if I'm not satisfied with the cleaning?", "Your satisfaction is 100% guaranteed. If you're not happy, we'll return within 24 hours to make it right — at no extra charge."],
];

const FAQ = () => {
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" style={{ background: C.offWhite, padding: "90px 24px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <div style={{ textAlign: "center" }}>
          <SectionLabel>FAQ</SectionLabel>
          <SectionTitle center>Questions? We've Got Answers</SectionTitle>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map(([q, a], i) => (
            <div key={i} onClick={() => setOpen(open === i ? null : i)}
              style={{ background: C.white, borderRadius: 16, overflow: "hidden", border: open === i ? `1.5px solid ${C.teal}` : `1.5px solid ${C.gray200}`, cursor: "pointer", transition: "all .2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px" }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16, color: C.navy, flex: 1, paddingRight: 16 }}>{q}</span>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: open === i ? C.teal : C.gray50, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .2s", fontSize: 18, color: open === i ? C.white : C.gray600 }}>
                  {open === i ? "−" : "+"}
                </div>
              </div>
              {open === i && (
                <div style={{ padding: "0 24px 20px", fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: C.gray600, lineHeight: 1.7, borderTop: `1px solid ${C.gray50}`, paddingTop: 16 }}>{a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Final CTA ─────────────────────────────────────────────────────────────────
const FinalCTA = () => (
  <section style={{ background: `linear-gradient(135deg, ${C.teal} 0%, #1a8f8f 50%, ${C.navy} 100%)`, padding: "90px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,.06)" }} />
    <div style={{ position: "absolute", bottom: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,.04)" }} />
    <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🏠✨</div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(30px,4vw,50px)", fontWeight: 800, color: C.white, margin: "0 0 18px", lineHeight: 1.15 }}>Ready for a Cleaner Home?</h2>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, color: "rgba(255,255,255,.85)", lineHeight: 1.7, margin: "0 0 36px" }}>
        Join hundreds of happy DFW families who trust Lone Star Clean. Get your free quote today — no commitment, no hassle.
      </p>
      <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
        <Btn onClick={() => scrollTo("contact")} variant="gold" style={{ fontSize: 17, padding: "16px 38px" }}>✨ Request Free Quote</Btn>
        <Btn href="tel:+12145550100" variant="outlineWhite" style={{ fontSize: 17, padding: "16px 38px" }}>📞 Call Today</Btn>
      </div>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,.6)", marginTop: 24 }}>
        🔒 Satisfaction Guaranteed · Background-Checked · Locally Loved
      </p>
    </div>
  </section>
);

// ── Footer ────────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer style={{ background: C.gray800, color: "rgba(255,255,255,.75)", padding: "60px 24px 30px" }}>
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1.5fr", gap: 40, marginBottom: 48 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>✨</div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: C.white }}>Lone Star Clean</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: C.teal, letterSpacing: 2, textTransform: "uppercase" }}>DFW Cleaning Services</div>
            </div>
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.7, marginBottom: 20, maxWidth: 280 }}>Family-owned cleaning services trusted by hundreds of DFW homes and offices since 2010. Quality you can count on.</p>
          <div style={{ display: "flex", gap: 10 }}>
            {[["📘", "https://facebook.com"], ["📸", "https://instagram.com"], ["🟢", "https://wa.me/12145550100"]].map(([icon, href], i) => (
              <a key={i} href={href} style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontSize: 18, transition: "background .2s" }}
                onMouseEnter={e => e.currentTarget.style.background = C.teal} onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.1)"}>{icon}</a>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 14, color: C.white, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>Services</div>
          {["Residential", "Deep Cleaning", "Move-In/Out", "Airbnb Cleaning", "Office Cleaning", "Recurring Plans"].map(s => (
            <button key={s} onClick={() => scrollTo("services")} style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,.65)", background: "none", border: "none", cursor: "pointer", padding: "0 0 10px", textAlign: "left", transition: "color .2s" }}
              onMouseEnter={e => e.target.style.color = C.teal} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,.65)"}>{s}</button>
          ))}
        </div>
        <div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 14, color: C.white, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>Service Area</div>
          {["Dallas", "Fort Worth", "Plano", "Frisco", "McKinney", "Arlington"].map(c => (
            <div key={c} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,.65)", marginBottom: 10 }}>📍 {c}, TX</div>
          ))}
        </div>
        <div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 14, color: C.white, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>Contact</div>
          {[["📞", "(214) 555-0100", "tel:+12145550100"], ["📧", "hello@lonestarclean.com", "mailto:hello@lonestarclean.com"], ["💬", "Text/WhatsApp Us", "https://wa.me/12145550100"]].map(([icon, val, href]) => (
            <a key={val} href={href} style={{ display: "flex", gap: 10, alignItems: "center", fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,.65)", textDecoration: "none", marginBottom: 14, transition: "color .2s" }}
              onMouseEnter={e => e.currentTarget.style.color = C.teal} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,.65)"}>
              <span>{icon}</span> {val}
            </a>
          ))}
          <button onClick={() => scrollTo("reviews")} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.gold, color: C.navy, borderRadius: 50, padding: "10px 18px", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, marginTop: 6 }}>
            ⭐ Leave Us a Review
          </button>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>© 2024 Lone Star Clean LLC · Dallas–Fort Worth, TX · All rights reserved.</div>
        <div style={{ display: "flex", gap: 24 }}>
          {[["Privacy Policy", "contact"], ["Terms of Service", "contact"], ["Sitemap", "hero"]].map(([l, id]) => (
            <button key={l} onClick={() => scrollTo(id)} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,.5)", background: "none", border: "none", cursor: "pointer", padding: 0, transition: "color .2s" }}
              onMouseEnter={e => e.target.style.color = C.teal} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,.5)"}>{l}</button>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

// ── Sticky CTA (mobile) ───────────────────────────────────────────────────────
const StickyCTA = () => (
  <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 998, display: "flex", gap: 0, boxShadow: "0 -4px 20px rgba(0,0,0,.18)" }} className="mobile-sticky">
    <a href="tel:+12145550100" style={{ flex: 1, background: C.navy, color: C.white, textAlign: "center", padding: "14px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>📞 Call Now</a>
    <button onClick={() => scrollTo("contact")} style={{ flex: 1, background: C.teal, color: C.white, textAlign: "center", padding: "14px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>✨ Free Quote</button>
    <a href="sms:+12145550100" style={{ flex: 1, background: C.gold, color: C.navy, textAlign: "center", padding: "14px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>💬 Text Us</a>
  </div>
);

// ── Responsive CSS ────────────────────────────────────────────────────────────
const ResponsiveCSS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,800;1,700&family=DM+Sans:wght@400;500;600;700;800&display=swap');
    *, *::before, *::after { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { margin: 0; padding: 0; background: #F7F9FC; }
    .mobile-sticky { display: none; }
    @media (max-width: 768px) {
      .mobile-sticky { display: flex !important; }
      body { padding-bottom: 54px; }
      .nav-desktop { display: none !important; }
      .nav-hamburger { display: block !important; }
    }
    @media (max-width: 900px) {
      section > div { grid-template-columns: 1fr !important; }
    }
  `}</style>
);

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <ResponsiveCSS />
      {/* Local Business Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "LocalBusiness",
        "name": "Lone Star Clean", "image": "", "@id": "",
        "url": "https://lonestarclean.com", "telephone": "+12145550100",
        "address": { "@type": "PostalAddress", "addressLocality": "Dallas", "addressRegion": "TX", "postalCode": "75201", "addressCountry": "US" },
        "geo": { "@type": "GeoCoordinates", "latitude": 32.7767, "longitude": -96.797 },
        "openingHoursSpecification": [{ "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"], "opens": "07:00", "closes": "19:00" }],
        "sameAs": [], "priceRange": "$$", "description": "Family-owned professional cleaning services in Dallas-Fort Worth TX.",
      })}} />
      <CouponBanner />
      <Nav />
      <Hero />
      <StatsBar />
      <Services />
      <WhyUs />
      <About />
      <BeforeAfterSlider />
      <Testimonials />
      <ServiceArea />
      <Pricing />
      <LeadForm />
      <FAQ />
      <FinalCTA />
      <Footer />
      <StickyCTA />
    </>
  );
}

import { useEffect, useState } from "react";
import { bot, faq, features } from "./content";
import Waves from "./Waves";

const sections = [
  { id: "features", label: "Features" },
  { id: "faq", label: "FAQ" },
];

const observed = ["top", ...sections.map((s) => s.id)];

function useActiveSection(): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const elements = observed
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id === "top" ? null : entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return active;
}

function useScrolled(threshold = 8): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}

function Background() {
  return (
    <div className="bg" aria-hidden="true">
      <Waves />
    </div>
  );
}

const BAND = "M-40 70 C200 130 420 170 720 120 S1200 30 1640 50";

// x, y, radius, opacity
const STARS: [number, number, number, number][] = [
  [90, 40, 1.4, 0.5],
  [210, 150, 1.2, 0.5],
  [430, 180, 2.4, 0.9],
  [520, 60, 1, 0.4],
  [640, 30, 1.2, 0.4],
  [760, 175, 1.8, 0.7],
  [890, 95, 1.3, 0.6],
  [1010, 150, 1.4, 0.8],
  [1180, 35, 1.1, 0.5],
  [1320, 120, 1.6, 0.7],
  [1500, 25, 1.2, 0.5],
  [1560, 150, 1, 0.5],
];

function Divider({ id, flip = false }: { id: string; flip?: boolean }) {
  return (
    <div className={`divider${flip ? " is-flipped" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 1600 200" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id={`${id}-grid`} width="5" height="3" patternUnits="userSpaceOnUse">
            <rect width="3.4" height="1.4" fill="#7e98e6" fillOpacity="0.55" />
          </pattern>
          <linearGradient
            id={`${id}-fade`}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="1600"
            y2="0"
          >
            <stop offset="0" stopColor="#fff" stopOpacity="0.4" />
            <stop offset="0.55" stopColor="#fff" stopOpacity="1" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.7" />
          </linearGradient>
          <filter id={`${id}-soft`} x="-5%" y="-30%" width="110%" height="160%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
          <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="200">
            <path
              d={BAND}
              fill="none"
              stroke={`url(#${id}-fade)`}
              strokeWidth="84"
              filter={`url(#${id}-soft)`}
            />
          </mask>
        </defs>

        <rect
          width="1600"
          height="200"
          fill="#3c5090"
          fillOpacity="0.22"
          mask={`url(#${id}-mask)`}
        />
        <rect width="1600" height="200" fill={`url(#${id}-grid)`} mask={`url(#${id}-mask)`} />

        {STARS.map(([x, y, r, o]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#8aa4ee" fillOpacity={o} />
        ))}
      </svg>
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection();
  const scrolled = useScrolled();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`header${scrolled || open ? " is-solid" : ""}`}>
      <div className="container header-inner">
        <a className="brand" href="#top" onClick={close}>
          <span className="brand-mark" aria-hidden="true" />
          {bot.name}
        </a>

        <nav className="nav-links" aria-label="Main">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={active === s.id ? "true" : undefined}
            >
              {s.label}
            </a>
          ))}
        </nav>

        <a className="button button-small nav-cta" href={bot.inviteUrl}>
          Add to Discord
        </a>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav id="mobile-menu" className="mobile-menu container" aria-label="Mobile">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} onClick={close}>
              {s.label}
            </a>
          ))}
          <a className="button" href={bot.inviteUrl}>
            Add to Discord
          </a>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="hero container" id="top">
      <h1>{bot.tagline}</h1>
      <p className="lead">{bot.description}</p>
      <div className="actions">
        <a className="button" href={bot.inviteUrl}>
          Add to Discord
        </a>
        <a className="button button-ghost" href={bot.supportUrl}>
          Support server
        </a>
      </div>
    </section>
  );
}

function SectionHead({ title }: { title: string }) {
  return <h2 className="section-title">{title}</h2>;
}

function Features() {
  return (
    <section className="section container" id="features">
      <SectionHead title="Features" />
      <ol className="rows">
        {features.map((f, i) => (
          <li className="row" key={f.title}>
            <span className="row-index">{String(i + 1).padStart(2, "0")}</span>
            <h3>{f.title}</h3>
            <p>{f.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Faq() {
  return (
    <section className="section container" id="faq">
      <SectionHead title="FAQ" />
      <div className="faq">
        {faq.map((item) => (
          <details className="faq-item" key={item.q}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>{bot.name}</span>
        <span className="footer-links">
          <a href={bot.supportUrl}>Support</a>
          <a href={bot.inviteUrl}>Invite</a>
        </span>
        <span className="muted">Not affiliated with Discord.</span>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <Background />
      <Header />
      <main>
        <Hero />
        <Divider id="d1" />
        <Features />
        <Divider id="d2" flip />
        <Faq />
      </main>
      <Footer />
    </>
  );
}

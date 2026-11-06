import { useEffect, useMemo, useState } from "react";
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

// Centre line of the ribbon: dips on the left, rises on the right.
const BAND =
  "M-40 78 C160 112 300 142 520 142 C800 142 1000 65 1300 65 C1450 65 1560 68 1640 74";

type Star = {
  x: number;
  y: number;
  r: number;
  opacity: number;
  color: string;
  duration: number;
  delay: number;
  variant: number;
};

// Small seeded random generator so the star field is the same on every load.
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Mostly white, with a few cool blue and warm tints like real stars.
const STAR_COLORS = ["#ffffff", "#ffffff", "#d6e4ff", "#bcd0ff", "#fff1e0"];

// Four pointed star with slightly pinched sides, drawn at unit size.
const STAR_PATH =
  "M0 -1 Q0.14 -0.14 1 0 Q0.14 0.14 0 1 Q-0.14 0.14 -1 0 Q-0.14 -0.14 0 -1 Z";

function makeStars(seed: number, count = 60): Star[] {
  const rand = seededRandom(seed);
  return Array.from({ length: count }, () => {
    // Raising to a power makes most stars tiny and a few bright.
    const size = Math.pow(rand(), 5);
    return {
      x: rand() * 1600,
      y: rand() * 200,
      r: 0.4 + size * 1.0,
      opacity: 0.2 + 0.45 * Math.sqrt(size),
      color: STAR_COLORS[Math.floor(rand() * STAR_COLORS.length)],
      duration: 3 + rand() * 6,
      delay: rand() * 10,
      variant: Math.floor(rand() * 3),
    };
  });
}

function Divider({
  id,
  seed,
  flip = false,
}: {
  id: string;
  seed: number;
  flip?: boolean;
}) {
  const stars = useMemo(() => makeStars(seed), [seed]);
  return (
    <div className={`divider${flip ? " is-flipped" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 1600 200" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id={`${id}-grid`} width="4" height="2.6" patternUnits="userSpaceOnUse">
            <rect width="2.6" height="1" fill="#6f8bd8" fillOpacity="0.4" />
          </pattern>
          <linearGradient
            id={`${id}-fade`}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="1600"
            y2="0"
          >
            <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="1" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.6" />
          </linearGradient>
          <radialGradient id={`${id}-glow`}>
            <stop offset="0" stopColor="#bcd0ff" stopOpacity="0.12" />
            <stop offset="1" stopColor="#bcd0ff" stopOpacity="0" />
          </radialGradient>
          <filter id={`${id}-soft`} x="-5%" y="-40%" width="110%" height="180%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="200">
            <path
              d={BAND}
              fill="none"
              stroke={`url(#${id}-fade)`}
              strokeWidth="68"
              filter={`url(#${id}-soft)`}
            />
          </mask>
        </defs>

        <rect
          width="1600"
          height="200"
          fill="#34467f"
          fillOpacity="0.14"
          mask={`url(#${id}-mask)`}
        />
        <rect width="1600" height="200" fill={`url(#${id}-grid)`} mask={`url(#${id}-mask)`} />

        {stars.map((s, i) => (
          <g
            key={i}
            className={`star star-${s.variant}`}
            style={{ animationDuration: `${s.duration}s`, animationDelay: `-${s.delay}s` }}
          >
            {s.r > 1 && <circle cx={s.x} cy={s.y} r={s.r * 4} fill={`url(#${id}-glow)`} />}
            <path
              d={STAR_PATH}
              transform={`translate(${s.x} ${s.y}) scale(${s.r * 2.6})`}
              fill={s.color}
              fillOpacity={s.opacity}
            />
          </g>
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
      <Header />
      <main>
        <div className="landing">
          <Background />
          <Hero />
        </div>
        <Divider id="d1" seed={7} />
        <Features />
        <Divider id="d2" seed={21} flip />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
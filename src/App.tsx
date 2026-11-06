import { useEffect, useState } from "react";
import { bot, commands, example, faq, features } from "./content";

const sections = [
  { id: "features", label: "Features" },
  { id: "commands", label: "Commands" },
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

      <div className="example" aria-hidden="true">
        <div className="example-row">
          <span className="example-who">you</span>
          <code>{example.command}</code>
        </div>
        <div className="example-row">
          <span className="example-who is-bot">{bot.name}</span>
          <span>{example.reply}</span>
        </div>
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

function Commands() {
  return (
    <section className="section container" id="commands">
      <SectionHead title="Commands" />
      <ul className="rows">
        {commands.map((c) => (
          <li className="row row-command" key={c.name}>
            <code>{c.name}</code>
            <p>{c.description}</p>
          </li>
        ))}
      </ul>
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
        <Hero />
        <Features />
        <Commands />
        <Faq />
      </main>
      <Footer />
    </>
  );
}

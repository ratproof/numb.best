import { useState } from "react";
import { bot, commands, faq, features } from "./content";

function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <a className="brand" href="#top">
          {bot.name}
        </a>
        <nav className="nav" aria-label="Main">
          <a href="#features">Features</a>
          <a href="#commands">Commands</a>
          <a href="#faq">FAQ</a>
          <a className="button button-small" href={bot.inviteUrl}>
            Add to Discord
          </a>
        </nav>
      </div>
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

function Features() {
  return (
    <section className="section container" id="features">
      <h2>Features</h2>
      <div className="grid">
        {features.map((f) => (
          <article className="card" key={f.title}>
            <h3>{f.title}</h3>
            <p>{f.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Commands() {
  return (
    <section className="section container" id="commands">
      <h2>Commands</h2>
      <ul className="commands">
        {commands.map((c) => (
          <li key={c.name}>
            <code>{c.name}</code>
            <span>{c.description}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="section container" id="faq">
      <h2>FAQ</h2>
      <div className="faq">
        {faq.map((item, i) => {
          const isOpen = open === i;
          return (
            <div className="faq-item" key={item.q}>
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span>{item.q}</span>
                  <span className="faq-icon" aria-hidden="true">
                    {isOpen ? "-" : "+"}
                  </span>
                </button>
              </h3>
              {isOpen && (
                <p id={`faq-panel-${i}`} className="faq-answer">
                  {item.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>{bot.name}</span>
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

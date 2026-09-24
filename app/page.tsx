import Link from "next/link";

export default function HomePage() {
  return (
    <main className="og-home">
      <header className="og-nav">
        <div className="og-nav-inner">
          <Link href="/" className="og-brand">
            <span className="og-mark">OG</span>
            <span>OutcomeGuard</span>
          </Link>
          <nav className="og-nav-links">
            <Link href="/analyze">Analyze</Link>
            <Link href="/history">History</Link>
          </nav>
        </div>
      </header>

      <section className="og-hero">
        <div className="og-hero-copy">
          <div className="og-kicker"><span /> Evidence before effort</div>
          <h1>Stop asking whether a resource is good. Ask whether it gets <em>you</em> there.</h1>
          <p>
            OutcomeGuard checks a learning resource against the specific outcome
            you want to achieve — requirement by requirement, with evidence.
          </p>
          <div className="og-hero-actions">
            <Link href="/analyze" className="og-run-button">
              Analyze a resource →
            </Link>
            <Link href="/history" className="og-text-link">View previous analyses</Link>
          </div>
        </div>

        <div className="og-hero-note">
          <div className="og-note-top"><span>OUTCOME</span><span>01</span></div>
          <p>Build a production-ready Next.js CRUD application.</p>
          <div className="og-note-line" />
          <div className="og-note-row">✓ CRUD + database</div>
          <div className="og-note-row">✓ Authentication</div>
          <div className="og-note-row og-note-missing">× Testing is not covered</div>
          <div className="og-note-footer">VERDICT · NOT SUFFICIENT</div>
        </div>
      </section>

      <section className="og-principles">
        <article><span>01</span><h2>Decompose</h2><p>Turn a vague outcome into concrete requirements.</p></article>
        <article><span>02</span><h2>Trace</h2><p>Retrieve evidence from the actual resource.</p></article>
        <article><span>03</span><h2>Verify</h2><p>Check the conclusion before you spend the time.</p></article>
      </section>
    </main>
  );
}

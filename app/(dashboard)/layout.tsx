import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="og-shell min-h-screen">
      <header className="og-nav">
        <div className="og-nav-inner">
          <Link href="/" className="og-brand" aria-label="OutcomeGuard home">
            <span className="og-mark">OG</span>
            <span>OutcomeGuard</span>
          </Link>

          <nav className="og-nav-links" aria-label="Primary navigation">
            <Link href="/analyze">Analyze</Link>
            <Link href="/history">History</Link>
          </nav>
        </div>
      </header>

      {children}
    </div>
  );
}

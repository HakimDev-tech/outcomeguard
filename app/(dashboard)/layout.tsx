import Link from "next/link";
import { ArrowLeft, Clock3, ShieldCheck } from "lucide-react";

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
            <span className="og-mark"><ShieldCheck size={17} strokeWidth={2.2} /></span>
            <span>OutcomeGuard</span>
          </Link>

          <nav className="og-nav-links" aria-label="Primary navigation">
            <Link href="/analyze">Analyze</Link>
            <Link href="/history">
              <Clock3 size={15} />
              History
            </Link>
          </nav>
        </div>
      </header>

      {children}
    </div>
  );
}

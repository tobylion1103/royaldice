import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-brand">
          <span className="footer-wordmark">RoyalDice.eu</span>
          <p>A provably-fair color dice platform. Every roll is randomly generated and independently verifiable.</p>
        </div>
        <nav className="footer-links" aria-label="Footer">
          <Link href="/">Play</Link>
          <Link href="/verify">Verify a Result</Link>
          <Link href="/about">About</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/privacy">Privacy Policy</Link>
        </nav>
      </div>
      <div className="footer-copyright">© {new Date().getFullYear()} RoyalDice.eu</div>
    </footer>
  );
}

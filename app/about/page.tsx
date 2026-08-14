import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="shell">
      <div className="page-hero">
        <h1>About RoyalDice.eu</h1>
        <p>A premium color dice platform built around fairness, transparency, and a polished playing experience.</p>
      </div>
      <div className="panel">
        <h2>What RoyalDice is</h2>
        <p className="muted">
          RoyalDice.eu is an online color dice platform. Instead of numbered faces, each die resolves to one of six
          colours, making results fast to read and easy to follow. The platform is designed for online games, giveaways,
          board games, and any situation that calls for a quick, fair outcome.
        </p>
        <h2>How it works</h2>
        <p className="muted">
          Every roll is generated independently and recorded with a unique Result ID. That identifier lets anyone look up
          the exact outcome of a roll at any time, so results can always be confirmed after the fact.
        </p>
        <ol className="steps">
          <li>Choose how many dice you want to roll.</li>
          <li>Each die is assigned a colour with equal probability.</li>
          <li>The outcome is saved and given a Result ID.</li>
          <li>Anyone can verify that result using the ID.</li>
        </ol>
        <h2>Why players use it</h2>
        <p className="muted">
          Players choose RoyalDice.eu because results are consistent, transparent, and easy to verify. There is no
          sign-up required to play, the interface is built for both desktop and mobile, and several visual themes are
          available to suit your preference.
        </p>
      </div>
      <p className="muted">
        <Link href="/">Back to the game</Link>
      </p>
    </main>
  );
}

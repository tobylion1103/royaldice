import Creators from "@/components/Creators";
import DiceRoller from "@/components/DiceRoller";
import SabCounter from "@/components/SabCounter";
import ChancesOfWinning from "@/components/ChancesOfWinning";
import HowItWorks from "@/components/HowItWorks";

export default function HomePage() {
  return (
    <main className="shell home">
      <div className="home-logo">
        <img id="rd-home-logo" src="/logo.png" alt="RoyalDice.eu" />
      </div>
      <div className="home-columns">
        <div className="home-sab-slot">
          <SabCounter />
        </div>
        <Creators side="left" />
        <Creators side="right" />
        <div className="home-main-col">
          <DiceRoller />
          <Creators side="mobile" />
          <div style={{ marginTop: 18 }}>
            <div className="panel">
              <div className="section-head">
                <span className="section-eyebrow">About Us</span>
                <h2 className="section-title">What RoyalDice.eu Is</h2>
              </div>
              <p style={{ margin: 0, color: "var(--text-dim)", lineHeight: 1.6 }}>
                RoyalDice.eu is a premium, provably-fair color dice platform. Instead of numbered faces, each die
                resolves to one of six colours, making results fast to read and easy to follow. Every roll gets a unique
                Result ID so it can always be verified afterwards, no sign-up required to play.
              </p>
            </div>
          </div>
          <div style={{ marginTop: 18 }}>
            <ChancesOfWinning />
          </div>
          <div style={{ marginTop: 18 }}>
            <HowItWorks />
          </div>
        </div>
      </div>
    </main>
  );
}

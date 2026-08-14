import CoinFlipper from "@/components/CoinFlipper";

export default function CoinFlipPage() {
  return (
    <main className="shell">
      <div className="home-logo">
        <img src="/logo.png" alt="RoyalDice.eu" />
      </div>
      <CoinFlipper />
    </main>
  );
}

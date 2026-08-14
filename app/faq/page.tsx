import Link from "next/link";

const faqs = [
  {
    q: "How does RoyalDice work?",
    a: "You select a number of dice and roll. Each die is independently assigned one of six colours with equal probability. The result is recorded and given a unique Result ID.",
  },
  {
    q: "How are results verified?",
    a: "Every roll is stored with a Result ID. On the Verify page you can enter that ID to load the exact dice outcome that was generated for the roll, confirming it has not changed.",
  },
  {
    q: "What is a Result ID?",
    a: "A Result ID is a short, unique code attached to each roll. It acts as a permanent reference to that specific outcome and is what you use to verify a result later.",
  },
  {
    q: "How do payouts work?",
    a: "Payouts are based on how unlikely a combination is. Common outcomes such as all-different colours carry the base value, while rare outcomes such as all dice matching carry the highest value.",
  },
  {
    q: "Are results random?",
    a: "Yes. Every die is generated independently for each roll, and all six colours have an equal chance every time. Previous rolls have no influence on future rolls.",
  },
  {
    q: "Do I need an account?",
    a: "No. You can roll and verify results without creating an account. Your recent rolls are stored locally on your own device.",
  },
];

export default function FaqPage() {
  return (
    <main className="shell">
      <div className="page-hero">
        <h1>Frequently Asked Questions</h1>
        <p>Everything you need to know about playing and verifying on RoyalDice.eu.</p>
      </div>
      <div className="panel">
        {faqs.map((f) => (
          <div className="faq-item" key={f.q}>
            <h3>{f.q}</h3>
            <p className="muted">{f.a}</p>
          </div>
        ))}
      </div>
      <p className="muted">
        <Link href="/">Back to the game</Link>
      </p>
    </main>
  );
}

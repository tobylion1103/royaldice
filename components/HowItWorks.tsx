export default function HowItWorks() {
  const cards = [
    {
      kicker: "Basics",
      title: "How colours work",
      body: "Each die resolves to one of six colours: red, orange, yellow, green, blue and purple. Every colour has an equal chance on every roll, and previous rolls never influence the next.",
    },
    {
      kicker: "Outcomes",
      title: "Possible combinations",
      body: "Your result is read as a set across all of your dice. A roll can be all different colours, contain a matching pair, three or more of a kind, or land on a full matching set.",
    },
    {
      kicker: "Rarity",
      title: "How payouts are determined",
      body: "Payouts follow probability. The less likely a combination is to appear, the higher its value. Common spreads sit at the base, while matching sets reach the top of the scale.",
    },
    {
      kicker: "Probability",
      title: "Why some combinations are rarer",
      body: "With six equally likely colours, matching several dice at once becomes increasingly unlikely as the number of dice grows. That scarcity is exactly what makes the rarest results the most rewarding.",
    },
  ];
  return (
    <div>
      <div className="section-head" style={{ textAlign: "center" }}>
        <span className="section-eyebrow">Game Guide</span>
        <h2 className="section-title">Learn How Royal Dice Works</h2>
      </div>
      <div className="guide-grid">
        {cards.map((c) => (
          <article className="guide-card" key={c.title}>
            <span className="kicker">{c.kicker}</span>
            <h3>{c.title}</h3>
            <p>{c.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

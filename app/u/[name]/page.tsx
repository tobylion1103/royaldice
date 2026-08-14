import { findUser } from "@/lib/users";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function PublicProfile({ params }: { params: { name: string } }) {
  const user = findUser(params.name);
  if (!user) notFound();
  const shown = user.displayName || user.name;

  return (
    <main className="account-page">
      <section className="rd-card rd-profile">
        <div className="rd-pf-avatar" style={{ width: 88, height: 88, fontSize: 32 }}>
          {user.avatar ? <img src={user.avatar} alt="" /> : shown.slice(0, 1).toUpperCase()}
        </div>
        <div className="rd-profile-name">{shown}</div>
        <div className="rd-profile-bio">{user.bio || "No bio yet."}</div>
        <div className="rd-stats">
          <div className="rd-stat">
            <span className="rd-stat-emoji">🎲</span>
            <span className="rd-stat-num">{user.rolls || 0}</span>
            <span className="rd-stat-label">Rolls</span>
          </div>
          <div className="rd-stat">
            <span className="rd-stat-emoji">🪙</span>
            <span className="rd-stat-num">{user.flips || 0}</span>
            <span className="rd-stat-label">Flips</span>
          </div>
          <div className="rd-stat">
            <span className="rd-stat-emoji">🟣</span>
            <span className="rd-stat-num">{user.spins || 0}</span>
            <span className="rd-stat-label">Spins</span>
          </div>
        </div>
      </section>
      <p className="muted">
        <Link href="/">Back to the game</Link>
      </p>
    </main>
  );
}

import Link from "next/link";
import { DISCORD, TIKTOK } from "@/lib/site";

export default function PrivacyPage() {
  return (
    <main className="shell">
      <div className="page-hero">
        <h1>Privacy Policy</h1>
        <p>How RoyalDice.eu handles information when you use the platform.</p>
      </div>
      <div className="panel">
        <h2>Overview</h2>
        <p className="muted">
          RoyalDice.eu is designed to be used without an account. We aim to collect as little information as possible
          while keeping the platform secure and reliable.
        </p>
        <h2>Information we store</h2>
        <ul className="steps">
          <li>
            <b>Roll results:</b> each roll is stored with its Result ID and outcome so it can be verified later.
          </li>
          <li>
            <b>Your recent rolls:</b> a short history is kept locally in your browser and is not tied to your identity.
          </li>
          <li>
            <b>Technical data:</b> limited technical information may be processed to protect the service against abuse
            and automated traffic.
          </li>
        </ul>
        <h2>Cookies and local storage</h2>
        <p className="muted">
          The platform uses local storage to remember your selected theme and recent rolls, and a session identifier to
          keep your experience consistent. This information stays on your device and is not used for advertising.
        </p>
        <h2>How information is used</h2>
        <p className="muted">
          Information is used solely to operate the platform: generating and verifying rolls, maintaining performance,
          and preventing abuse. We do not sell personal data.
        </p>
        <h2>Contact</h2>
        <p className="muted">
          For any questions regarding this policy, reach out via <a href={DISCORD}>Discord</a> or <a href={TIKTOK}>TikTok</a>.
        </p>
      </div>
      <p className="muted">
        <Link href="/">Back to the game</Link>
      </p>
    </main>
  );
}

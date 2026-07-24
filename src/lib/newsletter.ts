/**
 * Push a new signup to whichever newsletter provider is configured via env.
 * Substack has no public write API, so wire an ESP that feeds the Substack
 * (Beehiiv or ConvertKit/Kit). Everything here is best-effort and non-blocking:
 * a provider being down or unset must never break sign-in.
 */
export async function subscribeToNewsletter(email: string, name?: string | null) {
  const tasks: Promise<void>[] = [];
  if (process.env.BEEHIIV_API_KEY && process.env.BEEHIIV_PUBLICATION_ID) {
    tasks.push(addToBeehiiv(email));
  }
  if (process.env.CONVERTKIT_API_KEY && process.env.CONVERTKIT_FORM_ID) {
    tasks.push(addToConvertKit(email, name));
  }
  if (tasks.length === 0) {
    console.warn("[newsletter] No provider configured — skipping:", email);
    return;
  }
  await Promise.allSettled(tasks);
}

async function addToBeehiiv(email: string) {
  try {
    const pub = process.env.BEEHIIV_PUBLICATION_ID;
    const res = await fetch(`https://api.beehiiv.com/v2/publications/${pub}/subscriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        reactivate_existing: true,
        send_welcome_email: true,
        utm_source: "noslop",
      }),
    });
    if (!res.ok) console.error("[beehiiv] failed:", res.status, await res.text());
  } catch (err) {
    console.error("[beehiiv] error:", err);
  }
}

async function addToConvertKit(email: string, name?: string | null) {
  try {
    const form = process.env.CONVERTKIT_FORM_ID;
    const res = await fetch(`https://api.convertkit.com/v3/forms/${form}/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: process.env.CONVERTKIT_API_KEY,
        email,
        first_name: name?.split(" ")[0] || undefined,
      }),
    });
    if (!res.ok) console.error("[convertkit] failed:", res.status, await res.text());
  } catch (err) {
    console.error("[convertkit] error:", err);
  }
}

# No Slop

Lead-magnet site for the **No Slop** Claude skills — free skills for marketers in
exchange for a newsletter signup. Read the pitch and a preview free; sign in with
Google to copy the full skill and join the newsletter.

Next.js 15 (App Router) · Tailwind v4 · TypeScript · NextAuth (Google) · Prisma.

## Run locally

```bash
npm install
npx prisma db push      # creates the local SQLite dev.db
npm run dev
```

There's a **dev login** button on `/login` (dev only) so you can see the unlocked
state without setting up Google OAuth.

## How the gate works

- The skill listing, pitch, and a safe `preview` excerpt are public — they drive
  signups.
- The full paste-able `install` block is **server-gated** (`/skills/[slug]`): it's
  only fetched and rendered when a session exists, so it never ships in
  logged-out HTML.
- On signup, the new user's email is pushed to the configured newsletter provider
  ([`src/lib/newsletter.ts`](src/lib/newsletter.ts)).

## Adding a skill

Append one entry to `SKILLS` in [`src/lib/skills.ts`](src/lib/skills.ts). It
renders a new landing section and a `/skills/<slug>` page automatically. This file
is the source of truth, kept in sync with the ClaudeMarketers repo.

## Environment

Copy `.env.example` to `.env` and fill in:

| Var | What |
|---|---|
| `DATABASE_URL` | SQLite locally; Postgres in prod (see below) |
| `NEXTAUTH_URL` / `NEXTAUTH_SECRET` | NextAuth (`openssl rand -base64 32`) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
| `BEEHIIV_API_KEY` / `BEEHIIV_PUBLICATION_ID` | Newsletter (Beehiiv), optional |
| `CONVERTKIT_API_KEY` / `CONVERTKIT_FORM_ID` | Newsletter (ConvertKit/Kit), optional |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata / OG tags |

Substack has no public write API, so a signup is subscribed via an ESP that feeds
your Substack (Beehiiv or ConvertKit). Set whichever you use; unset providers are
skipped and never block sign-in.

## Deploy to Vercel

Vercel's filesystem is ephemeral, so **switch off SQLite before deploying**:

1. In [`prisma/schema.prisma`](prisma/schema.prisma), set the datasource provider
   to `postgresql`.
2. Point `DATABASE_URL` at a Postgres database (Vercel Postgres or Neon).
3. Run `npx prisma db push` once against that database to create the tables.
4. Set every env var above in the Vercel project settings. Set `NEXTAUTH_URL` and
   `NEXT_PUBLIC_SITE_URL` to the production domain, and add that domain's
   `/api/auth/callback/google` as an authorized redirect URI in Google Cloud.

The models in `schema.prisma` are Postgres-safe as written — only the `provider`
line changes.

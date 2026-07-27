/**
 * The Slop Index — a leaderboard of real brand marketing copy ranked by
 * "AI-tell density," scored live by the same detector the No Slop skills run.
 *
 * These seed entries use each brand's REAL public marketing copy (fetched
 * 2026-07-27), quoted for commentary. The score is an objective count of
 * common AI-writing tells in that copy — not a judgment of the brand, its
 * products, or its writing quality. User submissions (stored in the DB) are
 * merged with these at render time.
 */

export interface SlopIndexEntry {
  /** The brand / subject shown on the leaderboard. */
  name: string;
  /** Short category tag. */
  note: string;
  /** Public page the copy came from. */
  url: string;
  /** The brand's real marketing copy — scored live by detectSlop. */
  sample: string;
}

export const SLOP_INDEX_SEED: SlopIndexEntry[] = [
  {
    name: "AG1",
    note: "Supplements",
    url: "https://drinkag1.com",
    sample:
      "It's AG1, now with creatine — and more. Our newest innovation, AG1 Pro, gives you everything in clinically backed AG1 Next Gen, plus creatine, Ca-HMB, and more. It's built for performance, longevity, or those on a GLP-1 journey. Experience the Daily Health Drink for all-in-one nutrition.",
  },
  {
    name: "HubSpot",
    note: "B2B SaaS",
    url: "https://www.hubspot.com",
    sample:
      "Where go-to-market teams go to grow, scale, close, retain, grow. Unite marketing, sales, and customer service on one agentic customer platform that delivers results fast. Connected data and tools make it easier to know, do, and connect everything across your business.",
  },
  {
    name: "Nespresso",
    note: "Coffee",
    url: "https://www.nespresso.com",
    sample:
      "Any coffee, any size. Be your own barista. Elevate your every sip with expert recipes you can easily recreate at home. Protecting the planet with every pour. As a certified B corp, Nespresso is committed to circularity.",
  },
  {
    name: "Lululemon",
    note: "Apparel",
    url: "https://corporate.lululemon.com",
    sample:
      "Our purpose and values guide our approach to creating products, programs and experiences that help improve the wellbeing of people and communities, and minimize our environmental impact. We move together to drive resilience and innovation for people and the planet.",
  },
  {
    name: "Calm",
    note: "Wellness app",
    url: "https://www.calm.com",
    sample:
      "Calm your mind. Change your life. The #1 app for sleep, meditation and relaxation. We're here to help you feel better. Get in-the-moment relief for stress and anxiety so you can get back to living. Fall asleep, and stay asleep, naturally and peacefully.",
  },
  {
    name: "Anthropic (Claude)",
    note: "AI",
    url: "https://www.anthropic.com",
    sample:
      "AI research and products that put safety at the frontier. AI will have a vast impact on the world. Anthropic is a public benefit corporation dedicated to securing its benefits and mitigating its risks. At Anthropic, we build AI to serve humanity's long-term well-being.",
  },
  {
    name: "OpenAI (ChatGPT)",
    note: "AI",
    url: "https://chatgpt.com",
    sample:
      "Get help with everyday questions and ideas, explaining concepts, drafting messaging, searching the web, generating an image, comparing options, or thinking through a decision. Use ChatGPT for work, life, and everything in between.",
  },
  {
    name: "Instacart",
    note: "Delivery",
    url: "https://www.instacart.com",
    sample:
      "Pick a store, we shop, we deliver it. Select items from your favorite grocery stores. Personal shoppers pick items with care. Chat as they shop and manage your order. Get your items same-day. Enjoy Instacart's 100% quality guarantee on every order.",
  },
  {
    name: "Hims & Hers",
    note: "Telehealth",
    url: "https://www.hims.com",
    sample:
      "The care you've always deserved. Your weight loss breakthrough is here. Lose up to 25% body weight with Wegovy, now with more options than ever. Access our wide GLP-1 lineup.",
  },
  {
    name: "LinkedIn",
    note: "Professional network",
    url: "https://about.linkedin.com",
    sample:
      "Create economic opportunity for every member of the global workforce. Connect the world's professionals to make them more productive and successful. The world's largest professional network with more than 1 billion members in more than 200 countries and territories worldwide.",
  },
  {
    name: "Uber",
    note: "Rideshare",
    url: "https://www.uber.com",
    sample:
      "Go anywhere with Uber. Reserve a ride that's ready when you are. Now more than ever, reservations are a way of life. Reserve a premium Uber experience, up to 90 days in advance, for whenever you're ready to ride.",
  },
  {
    name: "Stanley",
    note: "Drinkware",
    url: "https://www.stanley1913.com",
    sample:
      "Stay Liquid. Your muscles are 75% water. Drink like it. Stay hydrated. Stay liquid. The setup your day deserves. The new Assembly Collection keeps up. Function first. Style included.",
  },
  {
    name: "HBO Max",
    note: "Streaming",
    url: "https://www.hbomax.com",
    sample:
      "Must-see series, movies and more. Choose an HBO Max plan or bundle to start streaming. The plot twist everyone's been waiting for.",
  },
];

/**
 * The Slop Index — a ranked leaderboard of marketing's most AI-sounding genres,
 * scored live by the same detector the site runs. Entries are representative
 * ARCHETYPES of a genre, not quotes from a named company, so the ranking is
 * honest satire of the category, not a claim about anyone's exact copy.
 *
 * To feature a real named brand later: add an entry with its verified public
 * hero copy. Everything else (score, rank, share card) is computed from `sample`.
 */

export interface SlopIndexEntry {
  /** The archetype (or brand) name shown on the leaderboard. */
  name: string;
  /** Short category tag. */
  note: string;
  /** Representative hero copy — scored live by detectSlop. */
  sample: string;
}

export const SLOP_INDEX: SlopIndexEntry[] = [
  {
    name: "The AI-startup hero",
    note: "Seed-stage landing page",
    sample:
      "In today's fast-paced world, we leverage cutting-edge AI to seamlessly empower teams and supercharge productivity. Our robust, holistic platform is truly transformative. Ready to embark on a game-changing journey?",
  },
  {
    name: "The Web3 launch page",
    note: "Token / protocol",
    sample:
      "We're building the future of finance. Our disruptive, decentralized platform empowers a paradigm shift in how you harness value. It's worth noting that this is truly revolutionary.",
  },
  {
    name: "The enterprise platform",
    note: "B2B SaaS",
    sample:
      "Our comprehensive platform enables organizations to foster synergy and drive transformative outcomes at scale. Delve into a new era of operational excellence and unlock your full potential.",
  },
  {
    name: "The average SaaS homepage",
    note: "Mid-market tool",
    sample:
      "We help businesses streamline workflows and unlock their full potential. Our innovative solution facilitates seamless collaboration. Simply elevate your team today.",
  },
  {
    name: "The growth agency",
    note: "Marketing services",
    sample:
      "We craft meticulous, bespoke experiences that elevate brands. At the end of the day, we're passionate about fostering meaningful, transformative connections.",
  },
  {
    name: "The creator platform",
    note: "Creator economy",
    sample:
      "Empower your audience. Our platform facilitates seamless monetization so creators can truly thrive in the ever-evolving creator economy. It's a game changer.",
  },
  {
    name: "The fintech hero",
    note: "Consumer finance",
    sample:
      "Money, reimagined. We leverage technology to streamline your finances and empower smarter decisions. Honestly, it's a paradigm shift.",
  },
  {
    name: "The productivity app",
    note: "Focus / notes",
    sample:
      "Supercharge your workflow. Our intuitive tools help you harness focus and unlock deep work. Fundamentally, it just works.",
  },
  {
    name: "The DTC about page",
    note: "Consumer brand",
    sample:
      "Our journey began with a simple belief. We're on a mission to disrupt the industry and empower our community to embark on something meaningful.",
  },
  {
    name: "The strategy consultancy",
    note: "Advisory",
    sample:
      "We help ambitious companies navigate complexity and drive sustainable growth. Our holistic approach fosters transformative, needle-moving results.",
  },
];

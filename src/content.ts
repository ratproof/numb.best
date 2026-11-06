export const bot = {
  name: "numb",
  tagline: "A Discord bot that keeps your server quiet and organized.",
  description:
    "numb handles the boring parts of running a server so you can focus on the people in it.",
  // Replace these with your real links.
  inviteUrl: "https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&scope=bot&permissions=0",
  supportUrl: "https://discord.gg/YOUR_INVITE",
};

export type Feature = {
  title: string;
  body: string;
};

// Placeholder features. Edit these to match what numb actually does.
export const features: Feature[] = [
  {
    title: "Moderation",
    body: "Warn, mute, kick and ban with a reason and a log entry every time.",
  },
  {
    title: "Auto actions",
    body: "Set simple rules for spam, links and mentions and let numb enforce them.",
  },
  {
    title: "Logging",
    body: "Message edits, deletes, joins and leaves sent to the channel you choose.",
  },
];

export type Faq = {
  q: string;
  a: string;
};

export const faq: Faq[] = [
  {
    q: "What permissions does numb need?",
    a: "Only the ones for the features you turn on. The invite link lets you review them before adding the bot.",
  },
  {
    q: "Is it free?",
    a: "Yes. Update this answer if that changes.",
  },
  {
    q: "How do I get help?",
    a: "Join the support server and ask in the help channel.",
  },
];

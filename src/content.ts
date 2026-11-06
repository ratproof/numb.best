export const bot = {
  name: "numb",
  tagline: "A Discord bot that keeps your server quiet and organized.",
  description:
    "numb handles the boring parts of running a server so you can focus on the people in it.",
  // Replace these with your real links.
  inviteUrl: "https://discord.com/oauth2/authorize?client_id=1567433168489947278&scope=bot%20applications.commands&permissions=0",
  supportUrl: "https://discord.gg/numbot",
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

export type Command = {
  name: string;
  description: string;
};

// Placeholder commands. Edit these to match your bot.
export const commands: Command[] = [
  { name: ",warn", description: "Warn a member and record the reason." },
  { name: ",mute", description: "Time out a member for a set duration." },
  { name: ",kick", description: "Remove a member from the server." },
  { name: ",ban", description: "Ban a member, with optional message cleanup." },
  { name: ",logs", description: "Choose where moderation logs are posted." },
  { name: ",help", description: "List every command and what it does." },
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
    a: "Yes.",
  },
  {
    q: "How do I get help?",
    a: "Join the support server and ask in the help channel.",
  },
];

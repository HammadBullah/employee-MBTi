export type AppView =
  | "home"
  | "profile"
  | "squad"
  | "galaxy"
  | "challenges"
  | "wrapped"
  | "manager";

export type Person = {
  id: number;
  name: string;
  role: string;
  team: string;
  personality: string;
  emoji: string;
  match: number;
  avatar: string;
  color: string;
  glow: string;
  reason: string;
  tag: string;
  x: number;
  y: number;
};

export type QuizScenario = {
  scene: string;
  eyebrow: string;
  mascot: string;
  options: { emoji: string; label: string; sub: string; value: number }[];
};

export const people: Person[] = [
  {
    id: 1,
    name: "Hammad Safi",
    role: "Product Manager",
    team: "Product",
    personality: "Calm Chaos Controller",
    emoji: "🦦",
    match: 100,
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=360&w=360",
    color: "#9b87ff",
    glow: "rgba(155,135,255,.35)",
    reason: "That's you!",
    tag: "You",
    x: 50,
    y: 50,
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Product Designer",
    team: "Design",
    personality: "Creative Explorer",
    emoji: "🎨",
    match: 95,
    avatar:
      "https://images.pexels.com/photos/33680700/pexels-photo-33680700.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=360&w=360",
    color: "#ff6fae",
    glow: "rgba(255,111,174,.35)",
    reason: "You build the wild idea. Sarah makes it impossible to ignore.",
    tag: "Best creative match",
    x: 66,
    y: 26,
  },
  {
    id: 3,
    name: "Mike Ross",
    role: "Engineering Lead",
    team: "Engineering",
    personality: "Launch Day Addict",
    emoji: "🚀",
    match: 92,
    avatar:
      "https://images.pexels.com/photos/26150471/pexels-photo-26150471.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=360&w=360",
    color: "#8b7cff",
    glow: "rgba(139,124,255,.38)",
    reason: "You find the signal. Mike turns it into something shipped by Friday.",
    tag: "Momentum duo",
    x: 42,
    y: 18,
  },
  {
    id: 4,
    name: "Amina Noor",
    role: "People Partner",
    team: "People",
    personality: "Social Energy Source",
    emoji: "🐝",
    match: 89,
    avatar:
      "https://images.pexels.com/photos/37272329/pexels-photo-37272329.png?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=360&w=360",
    color: "#ffce57",
    glow: "rgba(255,206,87,.32)",
    reason: "Amina opens the room. You give the conversation somewhere useful to go.",
    tag: "Meeting magic",
    x: 78,
    y: 55,
  },
  {
    id: 5,
    name: "Jordan Ellis",
    role: "Data Scientist",
    team: "Data",
    personality: "Night Owl Builder",
    emoji: "🌙",
    match: 88,
    avatar:
      "https://images.pexels.com/photos/36434829/pexels-photo-36434829.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=360&w=360",
    color: "#58c8ff",
    glow: "rgba(88,200,255,.34)",
    reason: "You both enjoy disappearing into weird problems and returning with answers.",
    tag: "Deep work twins",
    x: 27,
    y: 64,
  },
  {
    id: 6,
    name: "Nia Carter",
    role: "Customer Success",
    team: "Experience",
    personality: "Idea Sprinkler",
    emoji: "🌈",
    match: 84,
    avatar:
      "https://images.pexels.com/photos/6497114/pexels-photo-6497114.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=360&w=360",
    color: "#55e6b1",
    glow: "rgba(85,230,177,.32)",
    reason: "Nia brings customer sparks. You turn the best ones into an actual plan.",
    tag: "Fresh perspective",
    x: 55,
    y: 75,
  },
  {
    id: 7,
    name: "Elena Ruiz",
    role: "Brand Strategist",
    team: "Marketing",
    personality: "Precision Machine",
    emoji: "🎯",
    match: 79,
    avatar:
      "https://images.pexels.com/photos/7752809/pexels-photo-7752809.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=360&w=360",
    color: "#ff866e",
    glow: "rgba(255,134,110,.32)",
    reason: "Your flexible chaos meets Elena’s legendary color-coded calendar.",
    tag: "Plot twist pairing",
    x: 17,
    y: 34,
  },
];

export const quizScenarios: QuizScenario[] = [
  {
    eyebrow: "SCENARIO 01 · PLOT TWIST",
    scene: "You get a message: “We need this in two hours.”",
    mascot: "Two hours? Plenty of time to open 37 tabs.",
    options: [
      { emoji: "😎", label: "No worries", sub: "We ride at dawn", value: 1 },
      { emoji: "😰", label: "Tiny panic", sub: "Professionally, though", value: 2 },
      { emoji: "🤔", label: "Need context", sub: "Define ‘this’ please", value: 3 },
      { emoji: "🔥", label: "Already started", sub: "Sent 12 mins ago", value: 4 },
    ],
  },
  {
    eyebrow: "SCENARIO 02 · THE MEETING",
    scene: "A 30-minute meeting is now entering hour two.",
    mascot: "Blink twice if this could have been a message.",
    options: [
      { emoji: "🫠", label: "Become the chair", sub: "Spirit has left", value: 1 },
      { emoji: "✋", label: "Wrap it up", sub: "Brave main character", value: 2 },
      { emoji: "📝", label: "Find the action", sub: "At least get a task", value: 3 },
      { emoji: "😂", label: "Send memes", sub: "Morale department", value: 4 },
    ],
  },
  {
    eyebrow: "SCENARIO 03 · BLANK CANVAS",
    scene: "Your team has a huge idea and absolutely no plan.",
    mascot: "Chaos is just a roadmap wearing sunglasses.",
    options: [
      { emoji: "🎨", label: "Go wider", sub: "Ten more ideas", value: 1 },
      { emoji: "🗺️", label: "Make a map", sub: "Sticky note supremacy", value: 2 },
      { emoji: "🧪", label: "Test a slice", sub: "Learn by doing", value: 3 },
      { emoji: "🧑‍🤝‍🧑", label: "Pull in people", sub: "Build the dream squad", value: 4 },
    ],
  },
  {
    eyebrow: "SCENARIO 04 · FEEDBACK DROP",
    scene: "Someone says: “It’s good, but something feels off.”",
    mascot: "Ah yes, the internationally recognised unit: something.",
    options: [
      { emoji: "🔍", label: "Get specific", sub: "Show me where", value: 1 },
      { emoji: "🚶", label: "Take a lap", sub: "Process, then return", value: 2 },
      { emoji: "🧠", label: "Think aloud", sub: "Let’s unpack it", value: 3 },
      { emoji: "⚡", label: "Try three fixes", sub: "Speed-run iteration", value: 4 },
    ],
  },
  {
    eyebrow: "SCENARIO 05 · FOCUS MODE",
    scene: "You finally have three hours with no meetings.",
    mascot: "Protect this calendar gap like it’s the last snack.",
    options: [
      { emoji: "🎧", label: "Headphones on", sub: "Do not perceive me", value: 1 },
      { emoji: "☕", label: "Coffee walk", sub: "Ideas need movement", value: 2 },
      { emoji: "💬", label: "Co-work", sub: "Silent but together", value: 3 },
      { emoji: "✅", label: "Clear the list", sub: "Inbox zero energy", value: 4 },
    ],
  },
  {
    eyebrow: "FINAL BOSS · LAUNCH DAY",
    scene: "The launch is live. The team chat is exploding.",
    mascot: "Choose your final form, workplace legend.",
    options: [
      { emoji: "📊", label: "Watch metrics", sub: "Refresh responsibly", value: 1 },
      { emoji: "🎉", label: "Hype the team", sub: "Emoji avalanche", value: 2 },
      { emoji: "🐛", label: "Hunt bugs", sub: "Calm chaos activated", value: 3 },
      { emoji: "🍕", label: "Order pizza", sub: "Essential leadership", value: 4 },
    ],
  },
];

export const profileStats = [
  { label: "Communication", score: 5, color: "pink" },
  { label: "Creativity", score: 4, color: "purple" },
  { label: "Leadership", score: 3, color: "blue" },
  { label: "Planning", score: 4, color: "mint" },
  { label: "Social battery", score: 2, color: "yellow" },
];

export const traits = [
  "Great listener",
  "Solves problems calmly",
  "Thinks before speaking",
  "Can disappear for hours",
  "Loves structured chaos",
];

export const insightCards = [
  { emoji: "🎯", title: "Direct > mysterious", copy: "You click with people who say what they mean—kindly and clearly.", color: "purple" },
  { emoji: "🧠", title: "30-min meeting max", copy: "Short meetings protect your thinking time and produce sharper decisions.", color: "blue" },
  { emoji: "☕", title: "Post-lunch power-up", copy: "Your steady execution energy tends to peak around 2:00 PM.", color: "yellow" },
  { emoji: "🌙", title: "Ideas after dark", copy: "Your most original thinking often arrives when notifications quiet down.", color: "pink" },
];

export const challenges = [
  { emoji: "☕", title: "Coffee side quest", copy: "Chat with someone outside Product", xp: 80, progress: 60, color: "orange" },
  { emoji: "💌", title: "Hype human", copy: "Send 3 genuine appreciation cards", xp: 50, progress: 67, color: "pink" },
  { emoji: "🎧", title: "Focus guardian", copy: "Protect two 90-minute focus blocks", xp: 100, progress: 50, color: "blue" },
  { emoji: "🧊", title: "Ice breaker", copy: "Use an AI prompt in your next team sync", xp: 40, progress: 0, color: "mint" },
];

export const achievements = [
  { emoji: "🛡️", name: "Meeting Survivor", note: "12 meetings. Still standing.", unlocked: true },
  { emoji: "🎙️", name: "Professional Yapper", note: "Made the team chat better.", unlocked: true },
  { emoji: "🧠", name: "Deep Work DJ", note: "5 focus blocks protected.", unlocked: true },
  { emoji: "🦄", name: "Rare Pairing", note: "Locked mystery achievement.", unlocked: false },
];

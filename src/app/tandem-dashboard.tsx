"use client";

import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Award,
  BarChart3,
  Bell,
  Bolt,
  Bot,
  Brain,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Coffee,
  Compass,
  Flame,
  Gamepad2,
  Gift,
  Globe2,
  Headphones,
  Heart,
  HeartHandshake,
  Home,
  LockKeyhole,
  Menu,
  MessageCircle,
  Mic2,
  Moon,
  MoreHorizontal,
  MousePointer2,
  Music2,
  Network,
  PartyPopper,
  Play,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Target,
  Trophy,
  Users,
  Volume2,
  VolumeX,
  WandSparkles,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import {
  achievements,
  challenges,
  insightCards,
  people,
  profileStats,
  quizScenarios,
  traits,
  type AppView,
  type Person,
} from "./tandem-data";

const viewMeta: Record<AppView, { label: string; icon: LucideIcon }> = {
  home: { label: "For you", icon: Home },
  profile: { label: "My vibe", icon: Sparkles },
  squad: { label: "My squad", icon: Users },
  galaxy: { label: "Team galaxy", icon: Globe2 },
  challenges: { label: "Quests", icon: Gamepad2 },
  wrapped: { label: "Wrapped", icon: Music2 },
  manager: { label: "Team studio", icon: BarChart3 },
};

const moods = [
  { id: "focused", emoji: "🎯", label: "Locked in", color: "purple" },
  { id: "sunny", emoji: "☀️", label: "Sunny", color: "yellow" },
  { id: "social", emoji: "🪩", label: "Social", color: "pink" },
  { id: "lowkey", emoji: "🫠", label: "Low-key", color: "blue" },
  { id: "chaos", emoji: "🌀", label: "Chaos mode", color: "mint" },
];

const managerSignals = [
  { icon: MessageCircle, label: "Communication mix", value: "Beautifully varied", note: "4 async-first · 3 talk-it-out", color: "purple" },
  { icon: WandSparkles, label: "Creative balance", value: "High range", note: "Builders + explorers are balanced", color: "pink" },
  { icon: HeartHandshake, label: "Collaboration energy", value: "Warm", note: "8 appreciation moments this week", color: "mint" },
  { icon: Bolt, label: "Team energy", value: "Steady", note: "Opt-in pulse · no individual tracking", color: "yellow" },
];

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand-lockup ${compact ? "compact" : ""}`}>
      <span className="brand-glyph"><i /><i /><b>✦</b></span>
      {!compact && <strong>tandem<span>°</span></strong>}
    </span>
  );
}

function Avatar({ person, size = "md" }: { person: Person; size?: "xs" | "sm" | "md" | "lg" | "xl" }) {
  return (
    <span className={`avatar-wrap avatar-${size}`} style={{ "--avatar-glow": person.glow } as React.CSSProperties}>
      <img src={person.avatar} alt={`${person.name} profile`} />
      <i style={{ background: person.color }} />
    </span>
  );
}

function Mascot({ mood = "happy", onClick }: { mood?: "happy" | "thinking" | "party"; onClick?: () => void }) {
  return (
    <motion.button
      className={`mascot mascot-${mood}`}
      onClick={onClick}
      aria-label="Ask Pip, your AI sidekick"
      animate={{ y: [0, -7, 0], rotate: mood === "party" ? [0, -4, 4, 0] : 0 }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <span className="mascot-ear left" />
      <span className="mascot-ear right" />
      <span className="mascot-face">
        <i className="eye left" /><i className="eye right" />
        <b className="mascot-mouth" />
        <em>✦</em>
      </span>
      <span className="mascot-feet"><i /><i /></span>
    </motion.button>
  );
}

function TiltCard({ children, className = "", onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  const reduceMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const move = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setTilt({
      x: ((event.clientY - rect.top) / rect.height - 0.5) * -5,
      y: ((event.clientX - rect.left) / rect.width - 0.5) * 5,
    });
  };
  return (
    <motion.div
      className={`tilt-card ${className}`}
      onMouseMove={move}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      onClick={onClick}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      style={{ transformPerspective: 900 }}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="eyebrow">{children}</span>;
}

function PageIntro({ eyebrow, title, copy, action }: { eyebrow: string; title: ReactNode; copy: string; action?: ReactNode }) {
  return (
    <div className="page-intro">
      <div><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1><p>{copy}</p></div>
      {action}
    </div>
  );
}

function ProgressRing({ value, color = "#9b87ff", children }: { value: number; color?: string; children: ReactNode }) {
  return (
    <div className="progress-ring" style={{ "--ring-value": `${value * 3.6}deg`, "--ring-color": color } as React.CSSProperties}>
      <div>{children}</div>
    </div>
  );
}

function Stars({ count }: { count: number }) {
  return <span className="stars" aria-label={`${count} out of 5`}>{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={16} fill={star <= count ? "currentColor" : "transparent"} className={star <= count ? "filled" : ""} />)}</span>;
}

function Confetti({ burst }: { burst: number }) {
  if (!burst) return null;
  const colors = ["#9b87ff", "#55e6b1", "#ff6fae", "#ffce57", "#58c8ff", "#ff866e"];
  return (
    <div className="confetti-layer" key={burst} aria-hidden="true">
      {Array.from({ length: 30 }, (_, index) => (
        <i key={index} style={{
          left: `${8 + ((index * 37) % 84)}%`,
          background: colors[index % colors.length],
          animationDelay: `${(index % 7) * 0.045}s`,
          animationDuration: `${1.5 + (index % 5) * 0.18}s`,
          transform: `rotate(${index * 31}deg)`,
        }} />
      ))}
    </div>
  );
}

function HomeView({
  navigate,
  openQuiz,
  openMood,
  openAppreciation,
  notify,
  mood,
  xp,
  people,
  user,
}: {
  navigate: (view: AppView) => void;
  openQuiz: () => void;
  openMood: () => void;
  openAppreciation: (person: Person) => void;
  notify: (message: string, party?: boolean) => void;
  mood: string;
  xp: number;
  level: number;
  archetype: string;
  people: Person[];
  user: { name: string };
}) {
  const currentMood = moods.find((item) => item.id === mood) ?? moods[0];
  return (
    <div className="view home-view">
      <PageIntro
        eyebrow="TUESDAY · 9:41 AM"
        title={<>Good morning, {user.name.split(" ")[0]} <motion.span className="wave" animate={{ rotate: [0, 20, -8, 20, 0] }} transition={{ duration: 1.8, delay: .5 }}>👋</motion.span></>}
        copy="Your work vibe is immaculate. Let’s keep it that way."
        action={<div className="streak-pill"><Flame size={17} fill="currentColor" /><span><strong>8 day streak</strong><small>Personal best: 12</small></span></div>}
      />

      <section className="daily-strip glass-card">
        <button className="daily-mood" onClick={openMood}>
          <span className={`mood-orb ${currentMood.color}`}>{currentMood.emoji}</span>
          <span><small>TODAY&apos;S MOOD</small><strong>{currentMood.label}</strong></span>
          <ChevronRight size={16} />
        </button>
        <div className="daily-stat"><span className="stat-icon yellow"><Zap size={18} /></span><span><small>ENERGY</small><strong>4.2 <em>/ 5</em></strong></span></div>
        <div className="daily-stat"><span className="stat-icon mint"><HeartHandshake size={18} /></span><span><small>COLLAB VIBE</small><strong>92 <em>/ 100</em></strong></span></div>
        <div className="daily-stat"><span className="stat-icon pink"><Music2 size={18} /></span><span><small>TODAY&apos;S VIBE</small><strong>Lo-fi launch</strong></span></div>
        <button className="daily-more" onClick={() => notify("Your daily vibe card is ready to share ✨")}><MoreHorizontal size={19} /></button>
      </section>

      <section className="home-hero-grid">
        <TiltCard className="personality-hero" onClick={() => navigate("profile")}>
          <div className="hero-noise" />
          <motion.div className="hero-blob blob-a" animate={{ x: [0, 20, -8, 0], y: [0, -13, 8, 0] }} transition={{ duration: 9, repeat: Infinity }} />
          <motion.div className="hero-blob blob-b" animate={{ x: [0, -18, 9, 0], y: [0, 15, -5, 0] }} transition={{ duration: 11, repeat: Infinity }} />
          <div className="personality-copy">
            <div className="hero-topline"><span className="live-chip"><Sparkles size={12} /> YOUR PERSONALITY</span><span>LEVEL {level}</span></div>
            <span className="hero-emoji">✨</span>
            <h2>{archetype.split(" ").slice(0, -1).join(" ")}<br />{archetype.split(" ").slice(-1)}</h2>
            <p>Part strategist. Part firefighter.<br />Somehow still chill.</p>
            <button>Open collectible <ArrowRight size={16} /></button>
          </div>
          <div className="hero-level">
            <ProgressRing value={(xp % 1000) / 10} color="#ffffff"><strong>{Math.floor((xp % 1000) / 10)}%</strong><small>to lvl {level + 1}</small></ProgressRing>
            <span>{xp.toLocaleString()} XP</span>
          </div>
          <span className="floating-sticker sticker-one">structured chaos</span>
          <span className="floating-sticker sticker-two">+ calm energy</span>
        </TiltCard>

        <div className="side-stack">
          <TiltCard className="quote-card">
            <div className="quote-icon"><Bot size={22} /></div>
            <div><Eyebrow>PIP&apos;S DAILY WISDOM</Eyebrow><blockquote>“Today&apos;s a great day to annoy your teammates with brilliant ideas.”</blockquote></div>
            <span className="quote-sign">— Pip, definitely qualified</span>
          </TiltCard>
          <button className="quiz-cta" onClick={openQuiz}>
            <span className="quiz-cta-icon"><Gamepad2 size={24} /></span>
            <span><small>PERSONALITY QUEST</small><strong>Unlock your next evolution</strong><em>6 chaotic scenarios · +120 XP</em></span>
            <span className="play-button"><Play size={15} fill="currentColor" /></span>
          </button>
        </div>
      </section>

      <section className="quick-grid">
        <button className="quick-card purple" onClick={() => navigate("squad")}><span><Users size={22} /></span><small>MY SQUAD</small><strong>{people.length} people</strong><em>3 vibe matches online</em><div className="mini-stack">{people.slice(0, 3).map((person) => <Avatar key={person.id} person={person} size="xs" />)}</div></button>
        <button className="quick-card blue" onClick={() => navigate("galaxy")}><span><Network size={22} /></span><small>TEAM GALAXY</small><strong>Explore orbit</strong><em>2 new connections</em><div className="orbit-mini"><i /><i /><i /><b /></div></button>
        <button className="quick-card coral" onClick={() => navigate("challenges")}><span><Gamepad2 size={22} /></span><small>ACTIVE QUESTS</small><strong>3 in progress</strong><em>230 XP up for grabs</em><div className="quest-bar"><i /></div></button>
        <button className="quick-card yellow" onClick={() => navigate("wrapped")}><span><Trophy size={22} /></span><small>WEEKLY WRAPPED</small><strong>Your week slapped</strong><em>Ready to unwrap</em><div className="wrapped-spark">✦</div></button>
      </section>

      <section className="section-block">
        <div className="section-title"><div><Eyebrow>ALGORITHM SAYS YES</Eyebrow><h2>People you&apos;ll click with</h2></div><button onClick={() => navigate("squad")}>See all matches <ArrowRight size={15} /></button></div>
        <div className="match-row">
          {people.slice(0, 3).map((person, index) => (
            <TiltCard className="match-card" key={person.id}>
              <div className="match-visual" style={{ "--person-color": person.color, "--person-glow": person.glow } as React.CSSProperties}>
                <span className="match-rank">0{index + 1}</span><Avatar person={person} size="lg" /><span className="personality-emoji">{person.emoji}</span>
              </div>
              <div className="match-copy"><div><strong>{person.name}</strong><span>{person.role}</span></div><span className="match-percent">{person.match}% <small>match</small></span></div>
              <h3>{person.emoji} {person.personality}</h3>
              <p>{person.reason}</p>
              <div className="match-actions"><button onClick={() => openAppreciation(person)}><Heart size={15} /> Appreciate</button><button onClick={() => navigate("squad")}><MessageCircle size={15} /></button></div>
            </TiltCard>
          ))}
        </div>
      </section>

      <section className="home-lower-grid">
        <div className="glass-card quest-preview">
          <div className="section-title compact"><div><Eyebrow>DAILY SIDE QUEST</Eyebrow><h2>Touch grass, virtually</h2></div><span className="xp-chip">+80 XP</span></div>
          <p>Start a 15-minute coffee chat with someone outside your usual crew.</p>
          <div className="quest-people"><div className="mini-stack">{people.slice(3, 6).map((person) => <Avatar key={person.id} person={person} size="sm" />)}</div><span>Jordan, Nia, and 4 others are game</span></div>
          <button className="primary-action" onClick={() => notify("Coffee roulette activated. May the vibes be with you ☕", true)}><Coffee size={17} /> Find my coffee match</button>
        </div>
        <div className="glass-card activity-feed">
          <div className="section-title compact"><div><Eyebrow>SQUAD ACTIVITY</Eyebrow><h2>What&apos;s popping</h2></div><button><MoreHorizontal size={18} /></button></div>
          <div className="feed-item"><span className="feed-emoji pink">💌</span><p><strong>Sarah</strong> gave Mike a <b>Clutch Save</b> badge<small>8 mins ago · 4 reactions</small></p><button onClick={() => notify("You added 🔥 to Sarah’s appreciation")}>🔥</button></div>
          <div className="feed-item"><span className="feed-emoji yellow">🏆</span><p><strong>Amina</strong> unlocked Professional Yapper<small>32 mins ago · iconic</small></p><button onClick={() => notify("You added 👏 to Amina’s achievement")}>👏</button></div>
          <div className="feed-item"><span className="feed-emoji blue">☕</span><p><strong>Jordan + Nia</strong> finished a coffee side quest<small>1 hour ago · +80 XP each</small></p><button onClick={() => notify("Coffee side quest saved for later")}>✨</button></div>
        </div>
      </section>
    </div>
  );
}

function ProfileView({ openQuiz, notify, user, level, archetype }: { openQuiz: () => void; notify: (message: string, party?: boolean) => void; user: { name: string }; level: number; archetype: string }) {
  const [theme, setTheme] = useState("cosmic");
  const [shared, setShared] = useState(true);
  return (
    <div className="view profile-view">
      <PageIntro eyebrow="COLLECTION · CARD 01 OF 12" title={<>Your work personality <span className="gradient-text">has lore.</span></>} copy="Not a box. Not a label. A profile that evolves as you do." action={<button className="outline-action" onClick={openQuiz}><Sparkles size={16} /> Evolve profile</button>} />
      <div className="profile-stage">
        <TiltCard className={`collectible-card theme-${theme}`}>
          <div className="collectible-shine" />
          <div className="card-corners"><span>✦</span><span>017</span></div>
          <div className="card-rarity">RARE · CORE PERSONALITY</div>
          <div className="otter-orb"><div className="otter-halo" /><span>🦦</span><i>✦</i><b>+</b></div>
          <div className="collectible-title"><small>{user.name.split(" ")[0].toUpperCase()}&apos;S WORK TYPE</small><h2>{archetype.split(" ").slice(0, -1).join(" ")}<br />{archetype.split(" ").slice(-1)}</h2><span>LEVEL {level}</span></div>
          <p>“Turns impossible deadlines into somehow-finished projects.”</p>
          <div className="card-xp"><div><i style={{ width: "72%" }} /></div><span>1,720 / 2,400 XP</span></div>
          <div className="card-footer"><span>#00017</span><b>TANDEM ORIGINAL</b><span>2025</span></div>
        </TiltCard>
        <div className="profile-details">
          <div className="profile-detail-head glass-card"><div className="hammad-avatar"><span>H</span><i /></div><div><Eyebrow>HAMMAD · PRODUCT</Eyebrow><h2>Calm Chaos Controller</h2><p>Strategy brain · builder energy · social battery on airplane mode</p></div><button className={shared ? "shared" : ""} onClick={() => setShared(!shared)}>{shared ? <><Globe2 size={15} /> Squad can see this</> : <><LockKeyhole size={15} /> Only me</>}</button></div>
          <div className="stat-board glass-card">
            <div className="board-title"><h3>Your stat stack</h3><span>Based on your editable answers</span></div>
            {profileStats.map((stat) => <div className="stat-row" key={stat.label}><span>{stat.label}</span><Stars count={stat.score} /><small className={stat.color}>{stat.score}/5</small></div>)}
          </div>
          <div className="work-mode-grid">
            <div className="work-mode-card glass-card"><span className="mode-icon purple"><Headphones size={22} /></span><div><Eyebrow>FAVOURITE WORK MODE</Eyebrow><h3>Headphones On</h3><p>Deep focus · async messages · snack nearby</p></div></div>
            <div className="work-mode-card glass-card"><span className="mode-icon yellow"><Zap size={22} /></span><div><Eyebrow>MOTIVATED BY</Eyebrow><h3>Visible progress</h3><p>Clear wins · real impact · a tiny bit of hype</p></div></div>
          </div>
        </div>
      </div>

      <section className="profile-content-grid">
        <div className="glass-card trait-panel"><div className="section-title compact"><div><Eyebrow>YOUR LORE</Eyebrow><h2>Traits unlocked</h2></div><span>5 / 8</span></div><div className="trait-cloud">{traits.map((trait, index) => <motion.span key={trait} whileHover={{ y: -4, rotate: index % 2 ? 2 : -2 }}><b>✦</b>{trait}</motion.span>)}</div><button onClick={openQuiz}>Discover hidden traits <ArrowRight size={15} /></button></div>
        <div className="glass-card power-card"><div className="power-icon">⚡</div><Eyebrow>SUPERPOWER</Eyebrow><h2>Deadline Alchemy</h2><p>Turns impossible deadlines into somehow-finished projects.</p><span className="rarity-bar">LEGENDARY SKILL</span></div>
        <div className="glass-card weakness-card"><div className="power-icon">🥪</div><Eyebrow>ADORABLE WEAKNESS</Eyebrow><h2>Lunch Amnesia</h2><p>Will forget lunch while fixing something nobody else noticed.</p><span className="rarity-bar">RELATABLE</span></div>
      </section>

      <section className="section-block">
        <div className="section-title"><div><Eyebrow>AI-POWERED · HUMAN-EDITABLE</Eyebrow><h2>Your operating manual</h2></div><button onClick={() => notify("Your AI summary is ready to edit—not set in stone.")}>Edit my insights <ArrowRight size={15} /></button></div>
        <div className="insight-grid">{insightCards.map((insight) => <motion.article key={insight.title} className={`insight-card ${insight.color}`} whileHover={{ y: -7 }}><span>{insight.emoji}</span><h3>{insight.title}</h3><p>{insight.copy}</p></motion.article>)}</div>
      </section>

      <section className="theme-picker glass-card"><div><Eyebrow>UNLOCKED THEMES</Eyebrow><h2>Dress your card</h2><p>Your personality, your rules, your suspicious amount of purple.</p></div><div className="theme-options">{[{ id: "cosmic", label: "Cosmic", color: "#8b7cff" }, { id: "mint", label: "Mint condition", color: "#55e6b1" }, { id: "sunset", label: "Sunset", color: "#ff866e" }].map((item) => <button key={item.id} className={theme === item.id ? "active" : ""} onClick={() => { setTheme(item.id); notify(`${item.label} theme equipped ✨`); }}><i style={{ background: item.color }} />{item.label}{theme === item.id && <Check size={14} />}</button>)}</div></section>
    </div>
  );
}

function SquadView({ openAppreciation, connect, connected, navigate, people }: { openAppreciation: (person: Person) => void; connect: (person: Person) => void; connected: Set<number>; navigate: (view: AppView) => void; people: Person[] }) {
  if (people.length === 0) return null;
  return (
    <div className="view squad-view">
      <PageIntro eyebrow="COMPATIBILITY LAB" title={<>Find your <span className="gradient-text">work people.</span></>} copy="Chemistry, complementary strengths, and the occasional beautifully chaotic pairing." action={<button className="outline-action" onClick={() => navigate("galaxy")}><Network size={16} /> Open team galaxy</button>} />
      <section className="best-match-grid">
        <TiltCard className="best-match-card">
          <div className="best-match-bg" /><span className="match-label"><Sparkles size={13} /> BEST MATCH</span><span className="giant-match">{people[0].match}<small>%</small></span>
          <div className="best-match-person"><Avatar person={people[0]} size="xl" /><span className="big-person-emoji">{people[0].emoji}</span><div><small>{people[0].role}</small><h2>{people[0].name}</h2><p>{people[0].personality}</p></div></div>
          <blockquote>“{people[0].reason}”</blockquote>
          <div className="chemistry-tags"><span>⚡ Fast chemistry</span><span>🎨 Creative contrast</span><span>💬 Easy communication</span></div>
          <div className="best-actions"><button onClick={() => connect(people[0])}>{connected.has(people[0].id) ? <><Check size={16} /> Coffee pending</> : <><Coffee size={16} /> Start a coffee chat</>}</button><button onClick={() => openAppreciation(people[0])}><Heart size={16} /> Send hype</button></div>
        </TiltCard>
        <div className="compatibility-explainer glass-card"><div className="explain-orbits"><span className="you-node">YOU</span><span className="them-node">SC</span><i /><b /></div><Eyebrow>WHY IT WORKS</Eyebrow><h2>Idea energy meets visual magic</h2><p>You bring calm direction when Sarah&apos;s ideas go interstellar. Sarah pulls you out of safe-mode when the idea needs more sparkle.</p><div className="complement-bars"><div><span>Ideas</span><i><b style={{ width: "92%" }} /></i></div><div><span>Execution</span><i><b style={{ width: "84%" }} /></i></div><div><span>Trust</span><i><b style={{ width: "96%" }} /></i></div></div></div>
      </section>

      <section className="section-block"><div className="section-title"><div><Eyebrow>THE REST OF YOUR ORBIT</Eyebrow><h2>More people worth knowing</h2></div><span className="soft-label">No ranks. Just useful chemistry.</span></div><div className="squad-grid">{people.slice(1).map((person, index) => <TiltCard key={person.id} className="squad-card"><div className="squad-card-top" style={{ "--person-color": person.color, "--person-glow": person.glow } as React.CSSProperties}><Avatar person={person} size="lg" /><span>{person.emoji}</span><div className="squad-match">{person.match}%</div></div><div className="squad-card-copy"><small>{person.tag}</small><h3>{person.name}</h3><p className="squad-type">{person.emoji} {person.personality}</p><p>{person.reason}</p><div><button onClick={() => connect(person)} className={connected.has(person.id) ? "connected" : ""}>{connected.has(person.id) ? <Check size={15} /> : <Coffee size={15} />}{connected.has(person.id) ? "Pinged" : "Coffee"}</button><button onClick={() => openAppreciation(person)}><Heart size={15} /></button></div></div></TiltCard>)}</div></section>

      <section className="meme-match glass-card"><span className="meme-emoji">😂</span><div><Eyebrow>PLOT TWIST PAIRING</Eyebrow><h2>Meetings may become memes</h2><p>You and Elena approach planning from opposite planets. With a clear agenda, the contrast is genuinely powerful. Without one… bring snacks.</p></div><div className="meme-pair"><Avatar person={people[5] || people[0]} size="md" /><span>×</span><span className="hammad-mini">H</span><b>79%</b></div><button onClick={() => connect(people[5] || people[0])}>Try the pairing <ArrowRight size={15} /></button></section>
    </div>
  );
}

function GalaxyView({ notify, people }: { notify: (message: string) => void; people: Person[] }) {
  const [selected, setSelected] = useState<Person | null>(people[0] || null);
  const constraintsRef = useRef<HTMLDivElement>(null);
  return (
    <div className="view galaxy-view">
      <PageIntro eyebrow="LIVE TEAM MAP · 42 PEOPLE" title={<>Welcome to the <span className="gradient-text">team galaxy.</span></>} copy="Drag people around. Discover clusters. Click a planet to see the human behind the vibe." action={<div className="galaxy-legend"><span><i className="purple" /> Creators</span><span><i className="blue" /> Builders</span><span><i className="mint" /> Connectors</span></div>} />
      <section className="galaxy-shell glass-card">
        <div className="galaxy-toolbar"><div className="galaxy-search"><Search size={16} /><input aria-label="Search team galaxy" placeholder="Find someone in the galaxy…" /></div><div><button className="active">Compatibility</button><button>Teams</button><button>Energy</button></div><button onClick={() => notify("Galaxy centred around your orbit") }><Compass size={16} /> Find me</button></div>
        <div className="galaxy-canvas" ref={constraintsRef}>
          <div className="star-field" aria-hidden="true">{Array.from({ length: 44 }, (_, index) => <i key={index} style={{ left: `${(index * 47) % 100}%`, top: `${(index * 29) % 94}%`, animationDelay: `${index % 5}s` }} />)}</div>
          <svg className="galaxy-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="lineGlow"><stop stopColor="#8b7cff" stopOpacity=".55" /><stop offset="1" stopColor="#55e6b1" stopOpacity=".18" /></linearGradient></defs>{people.map((person) => <line key={person.id} x1="50" y1="49" x2={person.x} y2={person.y} />)}<line x1={people[0]?.x || 50} y1={people[0]?.y || 50} x2={people[1]?.x || 60} y2={people[1]?.y || 60} /><line x1={people[3]?.x || 40} y1={people[3]?.y || 40} x2={people[4]?.x || 70} y2={people[4]?.y || 70} /></svg>
          <div className="galaxy-you"><span>H</span><b>YOU</b><i /></div>
          {people.map((person, index) => (
            <motion.button key={person.id} drag dragConstraints={constraintsRef} dragElastic={.15} whileDrag={{ scale: 1.16, zIndex: 20 }} whileHover={{ scale: 1.09 }} onClick={() => setSelected(person)} className={`galaxy-node ${selected?.id === person.id ? "selected" : ""}`} style={{ left: `${person.x}%`, top: `${person.y}%`, "--node-color": person.color, "--node-glow": person.glow } as React.CSSProperties} animate={{ y: [0, index % 2 ? -7 : 7, 0] }} transition={{ duration: 4 + index * .35, repeat: Infinity, ease: "easeInOut" }}><Avatar person={person} size={index < 2 ? "lg" : "md"} /><span>{person.emoji}</span><b>{person.name.split(" ")[0]}</b></motion.button>
          ))}
          <span className="cluster-label creator">CREATIVE CLOUD</span><span className="cluster-label builder">BUILDER BELT</span><span className="cluster-label connector">SOCIAL SOLAR SYSTEM</span>
          <div className="drag-tip"><MousePointer2 size={14} /> Drag any teammate</div>
        </div>
        <AnimatePresence mode="wait">{selected && <motion.aside key={selected.id} className="galaxy-detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><button className="close-detail" onClick={() => setSelected(null)}><X size={16} /></button><div className="galaxy-person-head"><Avatar person={selected} size="lg" /><span>{selected.emoji}</span><div><small>{selected.role} · {selected.team}</small><h2>{selected.name}</h2><p>{selected.personality}</p></div></div><div className="galaxy-score"><ProgressRing value={selected.match} color={selected.color}><strong>{selected.match}%</strong><small>match</small></ProgressRing><p>{selected.reason}</p></div><div className="shared-orbit"><span>Shared orbit</span><div><b>Deep work</b><b>Clear feedback</b><b>Curious brains</b></div></div><button onClick={() => notify(`Coffee signal sent to ${selected.name} ☕`)}><Coffee size={16} /> Send a coffee signal</button></motion.aside>}</AnimatePresence>
      </section>
    </div>
  );
}

function ChallengesView({ notify, xp, level }: { notify: (message: string, party?: boolean) => void; xp: number; level: number }) {
  const [claimed, setClaimed] = useState<Set<number>>(new Set());
  const claim = (index: number, amount: number) => { setClaimed((current) => new Set(current).add(index)); notify(`Quest claimed! +${amount} XP landed in your pocket`, true); };
  return (
    <div className="view challenges-view">
      <PageIntro eyebrow="QUEST BOARD · SEASON 04" title={<>Small quests. <span className="gradient-text">Main-character growth.</span></>} copy="Build better work habits without a leaderboard breathing down your neck." action={<div className="xp-wallet"><span><Zap size={17} fill="currentColor" /></span><div><small>YOUR WALLET</small><strong>{xp.toLocaleString()} XP</strong></div></div>} />
      <section className="season-pass glass-card"><div className="season-copy"><span className="season-badge">SEASON 04 · COSMIC COWORKERS</span><h2>Level {level}</h2><p>Play quests to unlock the <strong>Neon Nebula</strong> card theme.</p><div className="season-progress"><i><b style={{ width: `${(xp % 1000) / 10}%` }} /></i><span>{xp.toLocaleString()} XP</span></div></div><div className="season-reward"><span className="locked-theme"><i /><b>✦</b></span><div><small>NEXT REWARD</small><strong>Neon Nebula</strong><em>Profile theme</em></div><LockKeyhole size={17} /></div><div className="season-mascot"><Mascot mood="party" /></div></section>
      <section className="section-block"><div className="section-title"><div><Eyebrow>THIS WEEK</Eyebrow><h2>Choose your side quests</h2></div><span className="soft-label">Do what feels good. Skip what doesn&apos;t.</span></div><div className="challenge-grid">{challenges.map((challenge, index) => <motion.article key={challenge.title} className={`challenge-card glass-card ${challenge.color}`} whileHover={{ y: -7 }}><div className="challenge-top"><span>{challenge.emoji}</span><b>+{challenge.xp} XP</b></div><h3>{challenge.title}</h3><p>{challenge.copy}</p><div className="challenge-progress"><div><i style={{ width: `${challenge.progress}%` }} /></div><span>{challenge.progress}%</span></div><button className={claimed.has(index) ? "claimed" : ""} onClick={() => claim(index, challenge.xp)} disabled={claimed.has(index)}>{claimed.has(index) ? <><Check size={16} /> Added to quests</> : <><Plus size={16} /> Start quest</>}</button></motion.article>)}</div></section>
      <section className="section-block"><div className="section-title"><div><Eyebrow>TROPHY CABINET</Eyebrow><h2>Your questionable achievements</h2></div><button onClick={() => notify("Achievement gallery opened")}>View all 24 <ArrowRight size={15} /></button></div><div className="achievement-row">{achievements.map((achievement) => <motion.article key={achievement.name} className={`achievement-card glass-card ${achievement.unlocked ? "" : "locked"}`} whileHover={achievement.unlocked ? { y: -5, rotate: -1 } : {}}><span>{achievement.unlocked ? achievement.emoji : "❔"}</span><div><h3>{achievement.name}</h3><p>{achievement.note}</p></div>{achievement.unlocked ? <Check size={15} /> : <LockKeyhole size={15} />}</motion.article>)}</div></section>
      <section className="mystery-box glass-card"><div className="mystery-visual"><motion.span animate={{ rotate: [-3, 3, -3], y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>🎁</motion.span><i>?</i></div><div><Eyebrow>8 DAY STREAK REWARD</Eyebrow><h2>A mystery box is judging you</h2><p>Come back tomorrow to find out if it contains a rare theme or one very fancy sticker.</p></div><button onClick={() => notify("Not yet, time traveller. Come back tomorrow 👀")}>Opens tomorrow</button></section>
    </div>
  );
}

function WrappedView({ notify, user, level, archetype }: { notify: (message: string, party?: boolean) => void; user: { name: string }; level: number; archetype: string }) {
  const [slide, setSlide] = useState(0);
  const slides = [
    { kicker: "YOUR WEEK IN TANDEM", big: "You were\nkind of iconic.", emoji: "✨", note: "12–16 May · let’s unwrap the chaos", theme: "intro" },
    { kicker: "MESSAGE ENERGY", big: "127", emoji: "💬", note: "messages sent · 83% were actually helpful", theme: "purple" },
    { kicker: "COLLABORATION ERA", big: "17", emoji: "🤝", note: "people you built, brainstormed, or laughed with", theme: "mint" },
    { kicker: "UNOFFICIAL METRIC", big: "49", emoji: "😂", note: "teammates made to laugh · elite morale work", theme: "pink" },
    { kicker: "ACHIEVEMENT UNLOCKED", big: "Meeting\nSurvivor", emoji: "🛡️", note: "12 meetings. 4 action items. 1 resilient human.", theme: "yellow" },
  ];
  const current = slides[slide];
  return (
    <div className="view wrapped-view">
      <PageIntro eyebrow="FRIDAY DROP" title={<>Your weekly <span className="gradient-text">Wrapped.</span></>} copy="The numbers that matter, the moments that made work feel human." action={<button className="outline-action" onClick={() => notify("Your Wrapped share card is ready ✨", true)}><Send size={16} /> Share with squad</button>} />
      <section className={`wrapped-stage wrapped-${current.theme}`}>
        <div className="wrapped-grid-bg" />
        <motion.div key={slide} className="wrapped-slide" initial={{ opacity: 0, scale: .92, rotate: -2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ type: "spring", stiffness: 180, damping: 20 }}>
          <div className="wrapped-brand"><Brand /><span>WEEK 20</span></div><Eyebrow>{current.kicker}</Eyebrow><motion.span className="wrapped-emoji" animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.08, 1] }} transition={{ duration: 2.5, repeat: Infinity }}>{current.emoji}</motion.span><h2>{current.big.split("\n").map((line) => <span key={line}>{line}</span>)}</h2><p>{current.note}</p><div className="wrapped-person"><span>{user.name.charAt(0)}</span><div><b>{user.name.split(" ")[0]}</b><small>{archetype} · Lvl {level}</small></div></div>
        </motion.div>
        <div className="wrapped-dots">{slides.map((_, index) => <button aria-label={`Go to slide ${index + 1}`} key={index} onClick={() => setSlide(index)} className={index === slide ? "active" : ""}><i /></button>)}</div>
        <button className="wrapped-arrow prev" onClick={() => setSlide((slide - 1 + slides.length) % slides.length)}><ArrowLeft size={19} /></button><button className="wrapped-arrow next" onClick={() => setSlide((slide + 1) % slides.length)}><ArrowRight size={19} /></button>
      </section>
      <div className="wrapped-summary"><div><span>☕</span><small>COFFEES</small><strong>18</strong></div><div><span>🎯</span><small>TASKS LANDED</small><strong>12</strong></div><div><span>🔥</span><small>STREAK</small><strong>8 days</strong></div><div><span>💌</span><small>HYPE SENT</small><strong>6 cards</strong></div></div>
    </div>
  );
}

function ManagerView({ notify, people }: { notify: (message: string) => void; people: Person[] }) {
  return (
    <div className="view manager-view">
      <PageIntro eyebrow="TEAM STUDIO · PRODUCT" title={<>See patterns. <span className="gradient-text">Not people scores.</span></>} copy="Privacy-safe signals to help the whole team work better together." action={<button className="outline-action" onClick={() => notify("Team summary drafted with no individual answers included") }><WandSparkles size={16} /> Draft team summary</button>} />
      <div className="ethics-banner"><ShieldCheck size={21} /><div><strong>Built for better teamwork—not performance evaluation.</strong><span>Only aggregated, consented patterns appear here. Individual answers, moods, and private wellbeing signals never do.</span></div><button onClick={() => notify("Privacy controls opened")}>View privacy rules</button></div>
      <section className="manager-signal-grid">{managerSignals.map(({ icon: Icon, ...signal }) => <motion.article key={signal.label} className={`manager-signal glass-card ${signal.color}`} whileHover={{ y: -5 }}><span><Icon size={21} /></span><div><small>{signal.label}</small><h3>{signal.value}</h3><p>{signal.note}</p></div></motion.article>)}</section>
      <section className="manager-main-grid">
        <div className="glass-card balance-panel"><div className="section-title compact"><div><Eyebrow>TEAM RANGE · 11 OPTED IN</Eyebrow><h2>Collaboration spectrum</h2></div><span className="soft-label">No ideal side</span></div><div className="spectrum-list"><div><div><span>Think out loud</span><span>Reflect first</span></div><i className="purple"><b style={{ left: "58%" }} /></i><small>Nicely balanced</small></div><div><div><span>Move fast</span><span>Plan carefully</span></div><i className="pink"><b style={{ left: "44%" }} /></i><small>Slightly spontaneous</small></div><div><div><span>Talk it through</span><span>Write it down</span></div><i className="blue"><b style={{ left: "69%" }} /></i><small>Async-friendly</small></div><div><div><span>Flexible flow</span><span>Clear structure</span></div><i className="mint"><b style={{ left: "55%" }} /></i><small>Balanced structure</small></div></div></div>
        <div className="glass-card team-mix-panel"><div className="section-title compact"><div><Eyebrow>PERSONALITY MIX</Eyebrow><h2>Your team&apos;s superpowers</h2></div><button><MoreHorizontal size={17} /></button></div><div className="mix-donut"><div className="donut"><span><strong>11</strong><small>profiles</small></span></div><div className="mix-legend"><span><i className="purple" /> Builders <b>4</b></span><span><i className="pink" /> Explorers <b>3</b></span><span><i className="mint" /> Connectors <b>2</b></span><span><i className="yellow" /> Strategists <b>2</b></span></div></div><p className="mix-note"><Sparkles size={15} /> Strong execution range with room for one more social connector on cross-team projects.</p></div>
      </section>
      <section className="section-block"><div className="section-title"><div><Eyebrow>AI SUGGESTIONS · TRANSPARENT REASONS</Eyebrow><h2>Collaboration sparks</h2></div><button onClick={() => notify("Why these suggestions exist: complementary self-reported preferences")}>How suggestions work <ArrowRight size={15} /></button></div><div className="suggestion-grid"><article className="glass-card"><span className="suggestion-icon purple">🧪</span><div><small>PROJECT PAIRING</small><h3>Sarah + Mike could ship magic</h3><p>Sarah explores wide; Mike turns promising directions into quick experiments.</p><div className="suggested-people"><Avatar person={people[0]} size="sm" /><span>+</span><Avatar person={people[1]} size="sm" /></div><button onClick={() => notify("Private pairing suggestion drafted—send only if it feels right")}>Draft an intro <ArrowRight size={14} /></button></div></article><article className="glass-card"><span className="suggestion-icon mint">💡</span><div><small>INNOVATION SQUAD</small><h3>Three complementary brains</h3><p>A creator, builder, and connector for the next early-stage concept sprint.</p><div className="suggested-people">{[people[0], people[3], people[4]].map((person) => <Avatar key={person.id} person={person} size="sm" />)}</div><button onClick={() => notify("Project prompt drafted with an opt-in invitation")}>Explore this squad <ArrowRight size={14} /></button></div></article><article className="glass-card"><span className="suggestion-icon yellow">🛟</span><div><small>TEAM HABIT</small><h3>Add one async checkpoint</h3><p>Most teammates prefer context before decisions. A pre-read could unlock quieter ideas.</p><div className="habit-chip">10 min pre-read · editable</div><button onClick={() => notify("Async checkpoint added to the playbook draft")}>Add to playbook <ArrowRight size={14} /></button></div></article></div></section>
    </div>
  );
}

function QuizModal({ onClose, onComplete, sound, playTone }: { onClose: () => void; onComplete: (answers: number[]) => Promise<void>; sound: boolean; playTone: (frequency?: number) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const scenario = quizScenarios[step];
  const choose = (value: number) => {
    if (picked !== null || saving) return;
    setPicked(value);
    if (sound) playTone(430 + value * 90);
    const next = [...answers]; next[step] = value; setAnswers(next);
    window.setTimeout(async () => {
      if (step === quizScenarios.length - 1) { setSaving(true); await onComplete(next); setSaving(false); }
      else { setStep((current) => current + 1); setPicked(null); }
    }, 650);
  };
  return (
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => event.currentTarget === event.target && onClose()}>
      <motion.section className="quiz-modal" role="dialog" aria-modal="true" aria-labelledby="quiz-title" initial={{ y: 30, scale: .96 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: .97 }}>
        <header><button onClick={step ? () => { setStep(step - 1); setPicked(null); } : onClose}>{step ? <ArrowLeft size={20} /> : <X size={20} />}</button><Brand /><div className="quiz-step"><span>{step + 1} / {quizScenarios.length}</span><button onClick={() => sound ? playTone(500) : undefined}>{sound ? <Volume2 size={17} /> : <VolumeX size={17} />}</button></div></header>
        <div className="quiz-progress"><i style={{ width: `${((step + 1) / quizScenarios.length) * 100}%` }}><span /></i></div>
        <div className="quiz-body"><div className="quiz-mascot-wrap"><Mascot mood={picked ? "party" : "thinking"} /><motion.span key={`${step}-${picked}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>{picked ? "Ooh. That says a lot 👀" : scenario.mascot}</motion.span></div><AnimatePresence mode="wait"><motion.div key={step} className="scenario-copy" initial={{ opacity: 0, x: 35 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -35 }}><Eyebrow>{scenario.eyebrow}</Eyebrow><h2 id="quiz-title">{scenario.scene}</h2><div className="scenario-options">{scenario.options.map((option) => <motion.button key={option.value} onClick={() => choose(option.value)} className={picked === option.value ? "picked" : picked ? "not-picked" : ""} whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: .96 }}><span>{option.emoji}</span><strong>{option.label}</strong><small>{option.sub}</small>{picked === option.value && <motion.i initial={{ scale: 0 }} animate={{ scale: 1 }}><Check size={15} /></motion.i>}</motion.button>)}</div></motion.div></AnimatePresence>{saving && <div className="quiz-saving"><i /><span>Pip is connecting suspiciously accurate dots…</span></div>}</div>
        <footer><ShieldCheck size={15} /><span>Your answers build your editable profile. Managers never see individual responses.</span><b>Progress creature</b><div className="creature-progress">{Array.from({ length: quizScenarios.length }, (_, index) => <i key={index} className={index <= step ? "grown" : ""} />)}</div></footer>
      </motion.section>
    </motion.div>
  );
}

function MoodModal({ onClose, onSave }: { onClose: () => void; onSave: (mood: string, energy: number, share: boolean) => Promise<void> }) {
  const [selected, setSelected] = useState("focused");
  const [energy, setEnergy] = useState(4);
  const [share, setShare] = useState(false);
  const [saving, setSaving] = useState(false);
  return <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.section className="small-modal mood-modal" role="dialog" aria-modal="true" initial={{ scale: .92, y: 20 }} animate={{ scale: 1, y: 0 }}><header><div><Eyebrow>QUICK CHECK-IN</Eyebrow><h2>What&apos;s the vibe?</h2></div><button onClick={onClose}><X size={19} /></button></header><p>No analysis. No diagnosis. Just a moment for you.</p><div className="mood-options">{moods.map((mood) => <button key={mood.id} className={selected === mood.id ? `active ${mood.color}` : ""} onClick={() => setSelected(mood.id)}><span>{mood.emoji}</span><small>{mood.label}</small></button>)}</div><div className="energy-picker"><div><span>Energy right now</span><b>{energy}/5</b></div><input aria-label="Energy level" type="range" min="1" max="5" value={energy} onChange={(event) => setEnergy(Number(event.target.value))} /></div><label className="share-check"><input type="checkbox" checked={share} onChange={(event) => setShare(event.target.checked)} /><span><i><Check size={12} /></i><b>Share this mood with my squad</b><small>Optional. Managers only see anonymised team trends.</small></span></label><button className="modal-primary" disabled={saving} onClick={async () => { setSaving(true); await onSave(selected, energy, share); setSaving(false); }}>{saving ? "Saving the vibe…" : "Lock in today’s vibe"}<ArrowRight size={16} /></button></motion.section></motion.div>;
}

function AppreciationModal({ person, onClose, onSend }: { person: Person; onClose: () => void; onSend: (person: Person, badge: string, message: string) => Promise<void> }) {
  const badges = [{ emoji: "🛟", name: "Clutch Save" }, { emoji: "✨", name: "Good Vibes" }, { emoji: "💡", name: "Brain Spark" }, { emoji: "💛", name: "Kind Human" }];
  const [badge, setBadge] = useState(badges[0].name);
  const [message, setMessage] = useState("You made a tricky moment feel surprisingly easy. Absolute legend.");
  const [saving, setSaving] = useState(false);
  return <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.section className="small-modal appreciation-modal" role="dialog" aria-modal="true" initial={{ scale: .92, y: 20 }} animate={{ scale: 1, y: 0 }}><header><div><Eyebrow>SEND SOME HYPE</Eyebrow><h2>Appreciate {person.name.split(" ")[0]}</h2></div><button onClick={onClose}><X size={19} /></button></header><div className="appreciation-person"><Avatar person={person} size="md" /><div><strong>{person.name}</strong><span>{person.emoji} {person.personality}</span></div></div><div className="badge-picker"><span>Pick a badge</span><div>{badges.map((item) => <button key={item.name} className={badge === item.name ? "active" : ""} onClick={() => setBadge(item.name)}><span>{item.emoji}</span><small>{item.name}</small></button>)}</div></div><label className="appreciation-note"><span>Add the human bit</span><textarea maxLength={280} value={message} onChange={(event) => setMessage(event.target.value)} /><small>{message.length}/280 · Visible to {person.name.split(" ")[0]}</small></label><button className="modal-primary" disabled={saving || !message.trim()} onClick={async () => { setSaving(true); await onSend(person, badge, message); setSaving(false); }}>{saving ? "Launching kindness…" : "Send appreciation"}<Heart size={16} fill="currentColor" /></button></motion.section></motion.div>;
}

export default function TandemDashboard({ user, onLogout }: { user: { id: number; name: string; email: string }; onLogout?: () => void }) {
  const [view, setView] = useState<AppView>("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [moodOpen, setMoodOpen] = useState(false);
  const [appreciationPerson, setAppreciationPerson] = useState<Person | null>(null);
  const [mood, setMood] = useState("focused");
  const [connected, setConnected] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState("");
  const [burst, setBurst] = useState(0);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [archetype, setArchetype] = useState("Undiscovered Vibe");
  const [dynamicPeople, setDynamicPeople] = useState<Person[]>(people);
  const [loading, setLoading] = useState(true);
  const [sound, setSound] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mascotBubble, setMascotBubble] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/tandem?userId=${user.id}`);
        const data = await response.json();
        if (data.ok) {
          if (data.people && data.people.length > 0) {
            setDynamicPeople(data.people);
          }
          if (data.progress) {
            setXp(data.progress.xp);
            setLevel(data.progress.level);
          }
          if (data.profile && data.profile.archetype) {
            setArchetype(data.profile.archetype);
          }
        }
      } catch (error) {
        console.error("Failed to sync with the galaxy", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  useEffect(() => { const timer = window.setTimeout(() => setMascotBubble(false), 7000); return () => window.clearTimeout(timer); }, []);


  const notify = (message: string, party = false) => {
    setToast(message);
    if (party) setBurst(Date.now());
    window.setTimeout(() => setToast(""), 3400);
  };

  const playTone = (frequency = 560) => {
    if (!sound) return;
    try {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = frequency; oscillator.type = "sine"; gain.gain.setValueAtTime(.045, context.currentTime); gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + .16); oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + .17);
    } catch { /* Sound is a progressive enhancement. */ }
  };

  const navigate = (next: AppView) => { setView(next); setMobileOpen(false); setNotificationsOpen(false); window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); };

  const connect = async (person: Person) => {
    if (connected.has(person.id)) return;
    setConnected((current) => new Set(current).add(person.id));
    notify(`Coffee signal sent to ${person.name} ☕`);
    try {
      const response = await fetch("/api/tandem", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "connect", userId: user.id, toEmployeeId: person.id, note: "Coffee chat from our compatibility match" }) });
      if (!response.ok) throw new Error();
    } catch {
      setConnected((current) => { const next = new Set(current); next.delete(person.id); return next; });
      notify("The coffee signal got lost in space. Try again?");
    }
  };

  const completeQuiz = async (answers: number[]) => {
    const total = answers.reduce((sum, value) => sum + value, 0);
    const archetype = total >= 19 ? "Launch Day Addict" : total >= 14 ? "Calm Chaos Controller" : "Deep Thinker";
    try {
      const response = await fetch("/api/tandem", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "assessment", userId: user.id, answers, archetype }) });
      if (!response.ok) throw new Error();
      setXp((current) => current + 120); setQuizOpen(false); playTone(760); notify(`Profile evolved: ${archetype} · +120 XP`, true);
    } catch { notify("Pip dropped the personality cards. One more try?"); }
  };

  const saveMood = async (selectedMood: string, energy: number, share: boolean) => {
    try {
      const response = await fetch("/api/tandem", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "mood", userId: user.id, mood: selectedMood, energy, shareWithTeam: share }) });
      if (!response.ok) throw new Error();
      setMood(selectedMood); setMoodOpen(false); setXp((current) => current + 10); notify("Vibe checked. No overthinking required · +10 XP");
    } catch { notify("The vibe escaped. Try checking in again?"); }
  };

  const sendAppreciation = async (person: Person, badge: string, message: string) => {
    try {
      const response = await fetch("/api/tandem", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "appreciate", userId: user.id, toEmployeeId: person.id, badge, message }) });
      if (!response.ok) throw new Error();
      setAppreciationPerson(null); setXp((current) => current + 25); playTone(680); notify(`${badge} sent to ${person.name} · kindness looks good on you`, true);
    } catch { notify("The appreciation card hit turbulence. Try again?"); }
  };

  const desktopNav = useMemo(() => (["home", "profile", "squad", "galaxy", "challenges", "wrapped"] as AppView[]), []);
  if (loading) {
    return (
      <div className="app-loading">
        <div className="ambient-bg"><i /><i /><i /></div>
        <Mascot mood="thinking" />
        <p>Connecting to the team galaxy…</p>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="ambient-bg"><i /><i /><i /></div><Confetti burst={burst} />
      <aside className="server-rail">
        <button className="server-brand" onClick={() => navigate("home")}><Brand compact /></button><div className="rail-line" />
        <button className="server-icon active"><span>AC</span><i /></button>
        <button className="server-icon"><Plus size={20} /></button>
        <button className="server-icon"><Compass size={20} /></button>
        <div className="server-spacer" /><button className="server-icon" onClick={() => setSound(!sound)} aria-label={sound ? "Mute sounds" : "Enable sounds"}>{sound ? <Volume2 size={19} /> : <VolumeX size={19} />}</button><button className="server-icon"><Settings size={19} /></button>
      </aside>
      <aside className={`main-sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="sidebar-head"><Brand /><button onClick={() => setMobileOpen(false)}><X size={20} /></button></div>
        <button className="workspace-chip"><span>AC</span><div><strong>Arc & Co.</strong><small>46 humans · 12 online</small></div><ChevronDown size={15} /></button>
        <label className="sidebar-search"><Search size={16} /><input aria-label="Search Tandem" placeholder="Search anything" /><kbd>⌘K</kbd></label>
        <nav><Eyebrow>YOUR SPACE</Eyebrow>{desktopNav.map((item) => { const Icon = viewMeta[item].icon; return <button key={item} className={view === item ? "active" : ""} onClick={() => navigate(item)}><Icon size={18} /><span>{viewMeta[item].label}</span>{item === "challenges" && <b>3</b>}{item === "wrapped" && <em>NEW</em>}</button>; })}<Eyebrow>WORKSPACE</Eyebrow><button className={view === "manager" ? "active" : ""} onClick={() => navigate("manager")}><BriefcaseBusiness size={18} /><span>Team studio</span><i className="privacy-dot" /></button><button onClick={() => notify("Coffee roulette opens every Wednesday ☕")}><Coffee size={18} /><span>Coffee roulette</span></button><button onClick={() => notify("AI ice breakers loaded and ready") }><Bot size={18} /><span>AI ice breakers</span></button></nav>
        <div className="sidebar-level"><div className="level-top"><ProgressRing value={(xp % 1000) / 10} color="#9b87ff"><strong>{level}</strong></ProgressRing><div><small>LEVEL {level}</small><strong>{archetype}</strong><span>{xp.toLocaleString()} XP</span></div></div><div className="level-bar"><i style={{ width: `${(xp % 1000) / 10}%` }} /></div><button onClick={() => navigate("challenges")}>Keep playing to level up <ArrowRight size={13} /></button></div>
        <div className="sidebar-user"><span className="hammad-avatar-mini">{user.name.charAt(0)}<i /></span><div><strong>{user.name.split(" ")[0]}</strong><small>Product · Locked in 🎯</small></div><button onClick={() => { if(onLogout && confirm("Peace out?")) onLogout(); }}><MoreHorizontal size={18} /></button></div>
      </aside>
      {mobileOpen && <button className="sidebar-overlay" onClick={() => setMobileOpen(false)} aria-label="Close menu" />}
      <div className="app-main">
        <header className="topbar"><button className="menu-button" onClick={() => setMobileOpen(true)}><Menu size={21} /></button><div className="breadcrumb"><span>Arc & Co.</span><ChevronRight size={13} /><strong>{viewMeta[view].label}</strong></div><div className="top-actions"><button className="top-search"><Search size={16} /><span>Ask Pip anything…</span><kbd>⌘ /</kbd></button><button className="icon-action" onClick={() => setSound(!sound)}>{sound ? <Volume2 size={18} /> : <VolumeX size={18} />}</button><div className="notification-wrap"><button className="icon-action notification-button" onClick={() => setNotificationsOpen(!notificationsOpen)}><Bell size={18} /><i /></button><AnimatePresence>{notificationsOpen && <motion.div className="notification-popover" initial={{ opacity: 0, y: -8, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6 }}><div><strong>Fresh from your orbit</strong><span>2 new</span></div><button onClick={() => { setNotificationsOpen(false); navigate("wrapped"); }}><span className="notice-icon purple">✨</span><p><b>Your Weekly Wrapped just dropped</b><small>See the week you somehow survived · now</small></p></button><button onClick={() => { setNotificationsOpen(false); navigate("squad"); }}><span className="notice-icon mint">☕</span><p><b>Sarah accepted your coffee signal</b><small>Thursday at 2:00 PM · 12 min ago</small></p></button></motion.div>}</AnimatePresence></div><button className="manager-toggle" onClick={() => navigate(view === "manager" ? "home" : "manager")}><ShieldCheck size={15} />{view === "manager" ? "Employee mode" : "Team studio"}</button></div></header>
        <AnimatePresence mode="wait"><motion.main key={view} initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }} transition={{ duration: .22 }}>
          {view === "home" && <HomeView navigate={navigate} openQuiz={() => setQuizOpen(true)} openMood={() => setMoodOpen(true)} openAppreciation={setAppreciationPerson} notify={notify} mood={mood} xp={xp} level={level} archetype={archetype} people={dynamicPeople} user={user} />}
          {view === "profile" && <ProfileView openQuiz={() => setQuizOpen(true)} notify={notify} user={user} level={level} archetype={archetype} />}
          {view === "squad" && <SquadView openAppreciation={setAppreciationPerson} connect={connect} connected={connected} navigate={navigate} people={dynamicPeople} />}
          {view === "galaxy" && <GalaxyView notify={notify} people={dynamicPeople} />}
          {view === "challenges" && <ChallengesView notify={notify} xp={xp} level={level} />}
          {view === "wrapped" && <WrappedView notify={notify} user={user} level={level} archetype={archetype} />}
          {view === "manager" && <ManagerView notify={notify} people={dynamicPeople} />}
        </motion.main></AnimatePresence>
      </div>
      <div className="floating-mascot"><AnimatePresence>{mascotBubble && <motion.div className="mascot-bubble" initial={{ opacity: 0, x: 20, scale: .9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, scale: .9 }}>Legend says replying to teammates increases friendships.<button onClick={() => setMascotBubble(false)}><X size={12} /></button></motion.div>}</AnimatePresence><Mascot mood="happy" onClick={() => { setMascotBubble(true); notify("Pip says: your calendar needs one less meeting 👀"); }} /></div>
      <nav className="mobile-bottom-nav">{(["home", "squad", "profile", "challenges"] as AppView[]).map((item) => { const Icon = viewMeta[item].icon; return <button key={item} className={view === item ? "active" : ""} onClick={() => navigate(item)}><Icon size={19} /><span>{viewMeta[item].label}</span></button>; })}</nav>
      <AnimatePresence>{quizOpen && <QuizModal onClose={() => setQuizOpen(false)} onComplete={completeQuiz} sound={sound} playTone={playTone} />}{moodOpen && <MoodModal onClose={() => setMoodOpen(false)} onSave={saveMood} />}{appreciationPerson && <AppreciationModal person={appreciationPerson} onClose={() => setAppreciationPerson(null)} onSend={sendAppreciation} />}</AnimatePresence>
      <AnimatePresence>{toast && <motion.div className="toast" role="status" initial={{ opacity: 0, y: 18, scale: .94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10 }}><span><Check size={15} /></span><p>{toast}</p></motion.div>}</AnimatePresence>
    </div>
  );
}

export type EventItem = {
  name: string;
  category: 'TECH' | 'NON-TECH';
  icon: string;
  description: string;
  rules: string;
  teamSize: string;
};

export const events: EventItem[] = [
  {
    name: 'Paper Presentation',
    category: 'TECH',
    icon: '📄',
    description: 'Showcase your research and innovative ideas in front of a panel of expert judges. Present a technical paper on any topic related to Electronics, Communication, or Emerging Technologies.',
    rules: 'Team of 1–2 | PPT + report submission | 10 min presentation + 5 min Q&A | Topics must be original or review-based',
    teamSize: '1–2',
  },
  {
    name: 'Project Expo',
    category: 'TECH',
    icon: '⚙️',
    description: 'Bring your hardware or software project to life on the expo floor. Demonstrate real-world solutions from IoT systems to embedded designs with impact and elegance.',
    rules: 'Team of 1–2 | Working prototype preferred | Demo + explanation | Judged on innovation, execution, and impact',
    teamSize: '1–2',
  },
  {
    name: 'Circuit Breakers',
    category: 'TECH',
    icon: '⚡',
    description: 'Think fast. Wire smart. Circuit Breakers is a hands-on electronics challenge where participants solve circuit problems, identify faults, and build working solutions under the ticking clock.',
    rules: 'Team of 1–2 | Components provided on-spot | Timed rounds | Debugging, identification, and build rounds',
    teamSize: '1–2',
  },
  {
    name: 'Technical Quiz',
    category: 'TECH',
    icon: '🧠',
    description: 'From semiconductors to signal processing, the TechnoKings Quiz is a rapid-fire battle of electronics and communication fundamentals. Fast buzzers, sharp minds, zero mercy.',
    rules: 'Team of 1–2 | Multiple rounds: MCQ, rapid fire, visual | Elimination format | Topics: ECE core subjects',
    teamSize: '1–2',
  },
  {
    name: 'Minute to Win It',
    category: 'NON-TECH',
    icon: '⏱️',
    description: 'Can you complete wild, hilarious, and oddly satisfying challenges in under 60 seconds? Minute to Win It brings the party energy and testing your coordination.',
    rules: 'Team of 1–2 | Prop-based tasks | Fastest completion wins | Multi-round knockout',
    teamSize: '1–2',
  },
  {
    name: 'Detective',
    category: 'NON-TECH',
    icon: '🔍',
    description: 'A crime has been committed. Clues are scattered. Can you piece it all together before time runs out? Detective is a mystery-solving event that tests observation and deduction.',
    rules: 'Team of 1–2 | Clue-based puzzle hunt | Time-based scoring | Hidden clues across the venue',
    teamSize: '1–2',
  },
  {
    name: 'Box Hunt',
    category: 'NON-TECH',
    icon: '📦',
    description: 'Hidden across the campus, numbered boxes hold cryptic clues and surprises. Box Hunt blends logic, speed, and campus knowledge into a fast-paced scavenger hunt.',
    rules: 'Team of 1–2 | Campus-wide hunt | Clue sheets given at start | Judged on boxes found + time',
    teamSize: '1–2',
  },
  {
    name: 'Start Music',
    category: 'NON-TECH',
    icon: '🎵',
    description: 'The DJ drops a song. You name it before it hits 5 seconds. Start Music is the ultimate test of your music knowledge across genres and eras.',
    rules: 'Team of 1–2 | Audio clip rounds | Buzzer-based | Multiple genres: Tamil, English, Trending',
    teamSize: '1–2',
  },
];

export const eventOptions = events.map((event) => event.name);

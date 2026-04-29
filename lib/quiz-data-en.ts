/**
 * English translations for quiz data.
 * The FR version lives in quiz-data.ts (the source of truth for structure + FR copy).
 * This file provides text-only overrides consumed via getLocalizedArchetype / getLocalizedQuestions.
 */

import type { ArchetypeId, QuizQuestion, WeekPlan } from './quiz-data'

// ─── Archetype text overrides ────────────────────────────────────────────────

export interface ArchetypeTextOverride {
  name: string
  tagline: string
  description: string
  strengths: string[]
  watchOuts: string[]
  bestFormats: string[]
  topics: string[]
  diagnostics: Record<string, string>
  plan30: WeekPlan[]
}

export const ARCHETYPES_EN: Record<ArchetypeId, ArchetypeTextOverride> = {
  storyteller: {
    name: 'The Storyteller',
    tagline: 'You turn your life experiences into an audience magnet.',
    description:
      "You connect with your audience because you dare to share. You have rare raw material: your journey, your failures, your breakthroughs. When you give yourself permission to share them, people stop scrolling and read.",
    strengths: [
      'Strong emotional connection',
      'Posts that get shared in DMs',
      'Ultra-loyal audience',
    ],
    watchOuts: [
      'You may self-censor out of fear of judgment',
      "You struggle to structure a clear offer",
    ],
    bestFormats: ['LinkedIn narrative posts', 'X threads', 'Talking-head videos'],
    topics: [
      'The day I almost quit everything (and what made me stay)',
      'What nobody tells you about [your industry] — my experience after X years',
      "I made this mistake for 2 years. Here's what it cost me.",
      'The conversation that changed my career (and the lesson behind it)',
      "Why I said no to [obvious opportunity]. And why it was the best decision.",
      '3 things I would do differently if I started from scratch',
      'My worst client. What I learned.',
      "The advice I got at 25 that I didn't understand until [your age]",
      'My revenue month by month, year 1. Unfiltered.',
      'What I do every Monday morning that changed everything in my results',
    ],
    diagnostics: {
      fear: "You dilute your message so you don't offend anyone. Result: you don't reach anyone either. Your Storyteller archetype needs vulnerability to work — it's your strength, not your weakness.",
      no_traction: "You have the raw material but not the format. A Storyteller who posts tip lists loses their edge. Your posts should start with a lived moment, not a stat.",
      no_idea: "You think you need to be an expert to publish. Wrong. A Storyteller doesn't teach — they share. You already have the material: your failures, decisions, doubts. 1 post = 1 lived moment + 1 lesson.",
      no_time: "You think telling stories takes more time than teaching. It's the opposite. A lived experience writes itself in 15 min because you already know it. The problem isn't time — it's perfectionism.",
      no_money: "You move people but you never ask them for anything. Your audience is emotionally invested — that's gold. You're just missing a CTA and a funnel behind each post.",
    },
    plan30: [
      { week: 1, title: 'Foundations', tasks: [
        'List 10 key moments in your journey (failures, wins, turning points)',
        'Post 3 times: short story + lesson (LinkedIn or X)',
        'Set up 1 simple lead magnet (PDF "my 5 mistakes" or newsletter)',
      ]},
      { week: 2, title: 'Rhythm', tasks: [
        'Post 5 times (alternate short story / long story)',
        'Add a CTA at the end of each post (newsletter, DM, link)',
        'Measure: which post got the most saves/shares?',
      ]},
      { week: 3, title: 'Conversion', tasks: [
        'Write your first "vulnerable" post (the one that scares you)',
        'Reply to ALL comments via DM ("Thanks, what do you do?")',
        'Send your first newsletter to your email list',
      ]},
      { week: 4, title: 'System', tasks: [
        'Automate multi-channel republication (1 post = LinkedIn + X + newsletter)',
        'Identify your 3 "pillar posts" (best performers) and recycle them',
        'Book 3 calls with your most engaged leads',
      ]},
    ],
  },
  builder: {
    name: 'The Builder',
    tagline: "You document what you build — your best marketing.",
    description:
      "You don't want to pose — you want to build. And the good news: your process, trial and error, and wins are all gold content. 'Build in public' is your natural playground.",
    strengths: [
      'Instant credibility (you prove what you do)',
      'Business-qualified audience',
      'You attract partners and clients without pitching',
    ],
    watchOuts: [
      'You undervalue presentation and storytelling',
      "You publish in 'logbook' mode instead of narrating",
    ],
    bestFormats: ['Build in public X/LinkedIn', 'Newsletter with metrics', 'Product lives'],
    topics: [
      "I launched [project] X months ago. Here are my real numbers.",
      "What I spent vs what I earned — month by month, unfiltered.",
      "The feature nobody asked for but that changed everything.",
      "I automated [process]. Here's the before/after in time and €.",
      "My complete tech stack for [result]. Tool by tool.",
      "The €10k mistake I made and how to avoid it.",
      "Week 12: what works, what doesn't, what I'm changing.",
      "How I went from 0 to [number] without ads (exact process).",
      "The 3 tools that save me 10h/week.",
      "My process to turn 1 idea into 7 pieces of content in 45 min.",
    ],
    diagnostics: {
      no_time: "You document everything in your head but publish nothing. An invisible Builder is nobody. The fix: 15 min on Monday to write your 3 numbers of the week. That's it.",
      no_traction: "You post updates but nobody hooks. Why? Because you document without structure. No hook, no lesson, no CTA. Add 'What I learned' to every post and it changes everything.",
      no_idea: "You think documenting is boring. Wrong. People love behind-the-scenes — especially real numbers. Every business decision is a post. Every milestone is a thread.",
      fear: "You're afraid to show your numbers. Normal. But Builders who share their real numbers (even modest ones) earn more trust than those hiding behind generic content.",
      no_money: "You have credibility but no funnel. Every 'build in public' post should point to a newsletter, template, or call. Without that, your audience applauds and buys elsewhere.",
    },
    plan30: [
      { week: 1, title: 'Foundations', tasks: [
        'List 10 milestones in your business (launches, numbers, pivots)',
        'Post 3 times: 1 number + 1 lesson + 1 next step',
        'Create a "Behind the scenes" newsletter (even with 0 subscribers)',
      ]},
      { week: 2, title: 'Rhythm', tasks: [
        'Post 5 times (alternate milestone / process / tool)',
        'Share a real screenshot or number in each post',
        'Add a newsletter or DM CTA under each post',
      ]},
      { week: 3, title: 'Conversion', tasks: [
        'Publish your complete "process post" (step by step, tools, time)',
        'Reply to comments via DM with a question ("What are you working on?")',
        'Create a lead magnet (template, checklist, or Notion duplicate)',
      ]},
      { week: 4, title: 'System', tasks: [
        'Automate multi-channel distribution (1 post = LinkedIn + X + newsletter)',
        'Recycle your 3 best posts into different formats (carousel, short, thread)',
        'Identify your most engaged leads and book 3 calls',
      ]},
    ],
  },
  educator: {
    name: 'The Educator',
    tagline: 'You make simple what others make complicated.',
    description:
      "You have real expertise and a genuine desire to teach. Your weapon: turning dense knowledge into crystal-clear formats. With the right system, you become THE reference in your field within 12 months.",
    strengths: [
      'SEO traffic + natural word-of-mouth',
      'Expert credibility easy to monetize',
      'Audience ready to buy courses / consulting',
    ],
    watchOuts: [
      "You can fall into generic '10 tips for...' territory",
      "You under-monetize because you give too much before daring to sell",
    ],
    bestFormats: ['LinkedIn carousels', 'Long-format YouTube', 'Educational threads'],
    topics: [
      'The 3-step framework I use to [concrete result]',
      "Everyone does [common mistake]. Here's why it's wrong.",
      'I tested 7 methods for [goal]. Only one works.',
      'The complete guide to [topic] — from beginner to advanced in 1 post.',
      '[Complex concept] explained to a total beginner.',
      'The 5 myths about [your field] that cost you money.',
      'How I helped [client type] go from [before] to [after].',
      'The checklist I wish I had when I started [activity].',
      'Why 90% of people fail at [goal] (and the 3-point fix).',
      'The exact system I use to [result] in [time] per week.',
    ],
    diagnostics: {
      no_idea: "You know a lot but don't know where to start. Normal. An Educator needs to identify their 7 pillars first — then each pillar gives you 10+ topics. The problem isn't lack of ideas, it's lack of structure.",
      no_traction: "You publish educational content but it's too generic. '5 tips for...' is noise. What works: ONE proprietary framework, well-named, that people associate with you.",
      no_money: "You give too much free value without ever selling. Your audience thinks everything is free. The rule: 80% education, 20% pitch. And every educational post should point to your newsletter or offer.",
      no_time: "You spend 3h on a carousel for 47 likes. The problem isn't time, it's the lack of system. 1 video of 30 min = 7 carousels + 14 posts + 3 shorts. Automate the repurposing.",
      fear: "You're afraid someone will say 'you're not legitimate.' Nobody is 100%. But you know more than 95% of your audience — and that's enough. Publish what you know, not what you don't.",
    },
    plan30: [
      { week: 1, title: 'Foundations', tasks: [
        'Identify your 7 pillars of expertise (the 7 sub-topics you master)',
        'Post 3 times: 1 framework + 1 myth-busted + 1 checklist',
        'Create a weekly newsletter (even with 0 subscribers)',
      ]},
      { week: 2, title: 'Rhythm', tasks: [
        'Post 5 times (alternate carousel / thread / short post)',
        'Name your main framework (a proprietary name people remember)',
        'Add a lead magnet CTA under each post',
      ]},
      { week: 3, title: 'Conversion', tasks: [
        'Create your signature lead magnet (checklist, template, free mini-course)',
        'Reply to every comment via DM ("Want me to help you with [topic]?")',
        'Publish 1 clear "offer" post (what you offer, for whom, at what price)',
      ]},
      { week: 4, title: 'System', tasks: [
        'Record 1 video of 30 min and repurpose it into 7+ pieces of content',
        'Automate multi-channel publishing',
        'Book 3 calls with leads who downloaded your lead magnet',
      ]},
    ],
  },
  provocateur: {
    name: 'The Provocateur',
    tagline: 'You take a stand when others stay silent.',
    description:
      "You're not afraid to ruffle feathers and that's your biggest lever. One strong opinion well-articulated beats 10 consensus posts. The risk: confusing free provocation with an argued stance.",
    strengths: [
      'High natural reach (the algorithm loves debate)',
      'You attract a loyal tribe that defends you',
      "You position yourself 'top of mind' on your topic",
    ],
    watchOuts: [
      'Bad buzz if no substance behind the form',
      'Hard to scale in B2B without softening',
    ],
    bestFormats: ['X hot takes', 'LinkedIn opinion posts', 'Interview podcasts'],
    topics: [
      'Unpopular opinion: [belief in your industry] is completely wrong.',
      "Everyone does [common practice]. That's why everyone struggles.",
      'I stopped doing [thing everyone does]. Results in 30 days.',
      'The lie that "experts" in [your field] don\'t want you to know.',
      '3 "best practices" in [industry] that are actually traps.',
      'Why people who succeed in [field] do the exact opposite.',
      'I said [strong opinion] publicly. Here\'s what happened.',
      'The problem with [popular trend] that nobody dares to point out.',
      "If you're still doing [common mistake] in 2026, you deserve to struggle.",
      'The truth about [controversial topic] — with numbers to back it up.',
    ],
    diagnostics: {
      no_traction: "You provoke but nobody reacts. Why? Because you give an opinion without proof. A Provocateur without data is a troll. Add numbers, a lived example, a screenshot — and your provocation becomes a thesis.",
      no_time: "You think it takes 1h to write a hot take. No. 3 sentences + 1 strong opinion = 5 min. The problem is you want it to be perfect. The best provocations are raw, not polished.",
      fear: "You're afraid of backlash. Good news: the backlash IS the reach. The algorithm rewards debate. As long as your opinion is argued (not gratuitous), the 'hate' makes you visible.",
      no_idea: "You don't know what to take a stand on. Start by listing 5 things that annoy you in your industry. 5 beliefs you think are wrong. 5 practices you find absurd. Each one = 1 post.",
      no_money: "You make noise but your DMs are empty. Because you never offer anything after the buzz. Every viral post needs a CTA (newsletter, DM, call). Otherwise your reach evaporates in 24h.",
    },
    plan30: [
      { week: 1, title: 'Foundations', tasks: [
        'List 10 strong/contrarian opinions about your industry',
        'Post 3 hot takes: opinion + proof + "change my mind"',
        'Create a provocative lead magnet ("The 5 lies of [industry]")',
      ]},
      { week: 2, title: 'Rhythm', tasks: [
        'Post 1x/day minimum (short, punchy, 3-5 sentences)',
        'Test 3 formats: controversial question / myth-busted / "am I the only one who thinks"',
        'Reply to EVERY hater with facts (feeds the algorithm)',
      ]},
      { week: 3, title: 'Conversion', tasks: [
        'Publish 1 storytelling post ("I said X publicly. Here\'s what happened.")',
        'DM every person who comments "so true" ("You experience this too? Tell me.")',
        'Send your first newsletter with your 3 best posts of the week',
      ]},
      { week: 4, title: 'System', tasks: [
        'Automate: 1 LinkedIn post = auto-repost X + newsletter + short',
        'Recycle your 3 most viral posts into video / carousel / thread',
        'Book 3 calls with the most engaged leads in your DMs',
      ]},
    ],
  },
}

// ─── Questions EN ────────────────────────────────────────────────────────────

export interface QuestionTextOverride {
  id: string
  kicker: string
  question: string
  helper?: string
  options: { id: string; label: string }[]
}

export const QUESTIONS_EN: QuestionTextOverride[] = [
  {
    id: 'persona',
    kicker: 'Step 1 / 10',
    question: 'To guide you properly, you are primarily:',
    options: [
      { id: 'coach', label: 'Coach, consultant or service provider' },
      { id: 'founder', label: 'Founder or CEO (SMB, agency, SaaS)' },
      { id: 'solo', label: 'Solopreneur or freelancer' },
      { id: 'employee', label: 'Employee looking to launch / build a personal brand' },
      { id: 'creator', label: 'Already active content creator' },
    ],
  },
  {
    id: 'situation',
    kicker: 'Step 2 / 10',
    question: "Let's be honest. When it comes to content, you are:",
    options: [
      { id: 'zero', label: "I post nothing — I know I should" },
      { id: 'sometimes', label: 'I post from time to time, no system' },
      { id: 'regular_no_convert', label: "I post regularly but it doesn't convert" },
      { id: 'works_scaling', label: "I post + it works, but I want to scale" },
      { id: 'system_optimize', label: 'I have a working system, looking to optimize' },
    ],
  },
  {
    id: 'inspiration',
    kicker: 'Step 3 / 10',
    question: 'When you follow someone, what attracts you most is:',
    helper: 'Think of the 2-3 people you actually follow.',
    options: [
      { id: 'story', label: 'Their stories, their journey, their vulnerability' },
      { id: 'process', label: 'Their numbers, processes, behind-the-scenes' },
      { id: 'frameworks', label: 'Their frameworks, tutorials, pedagogical expertise' },
      { id: 'opinions', label: 'Their strong opinions, bold stances' },
    ],
  },
  {
    id: 'writing',
    kicker: 'Step 4 / 10',
    question: 'When you write (email, message, post), you tend to be:',
    options: [
      { id: 'narrative', label: 'Narrative — I tell stories, give context, share feelings' },
      { id: 'factual', label: 'Factual — I document facts, numbers, steps' },
      { id: 'pedagogic', label: 'Educational — I structure, explain, make things clear' },
      { id: 'punchy', label: 'Direct — straight to the point, no fluff, sometimes blunt' },
    ],
  },
  {
    id: 'angle',
    kicker: 'Step 5 / 10',
    question: 'If you had to publish ONE post tomorrow, your angle would be:',
    options: [
      { id: 'experience', label: 'A lived experience that marked your journey' },
      { id: 'data', label: 'A number, a result, or a business metric' },
      { id: 'method', label: 'A method or framework you master' },
      { id: 'take', label: 'A strong opinion nobody dares say in your industry' },
    ],
  },
  {
    id: 'business',
    kicker: 'Step 6 / 10',
    question: 'Today, your business generates roughly:',
    helper: 'To calibrate a realistic action plan for you.',
    options: [
      { id: 'pre_revenue', label: 'No recurring revenue yet' },
      { id: 'lt5k', label: '$0 to $5k/month' },
      { id: '5_20k', label: '$5k to $20k/month' },
      { id: '20_50k', label: '$20k to $50k/month' },
      { id: 'gt50k', label: 'Over $50k/month' },
    ],
  },
  {
    id: 'inaction_cost',
    kicker: 'Step 7 / 10',
    question: "How much is NOT having a content system that converts costing you today?",
    helper: "Be honest — this reveals whether we can truly help you.",
    options: [
      { id: 'never_thought', label: "I hadn't thought about it" },
      { id: 'few', label: 'A few missed opportunities' },
      { id: 'thousands', label: 'Thousands per month in lost clients' },
      { id: 'ten_plus', label: 'Probably $10k+/month in uncaptured revenue' },
      { id: 'biggest', label: "It's my biggest business loss right now" },
    ],
  },
  {
    id: 'frustration',
    kicker: 'Step 8 / 10',
    question: 'Your biggest frustration with content right now:',
    options: [
      { id: 'no_time', label: "I don't have time to produce consistently" },
      { id: 'no_idea', label: "I don't know what to say that has value" },
      { id: 'no_traction', label: "I post but it stagnates, doesn't take off" },
      { id: 'no_convert', label: 'I get likes but zero qualified leads' },
      { id: 'no_focus', label: "I scatter — I don't know what to prioritize" },
      { id: 'fear', label: 'Fear of judgment, fear of being exposed' },
    ],
  },
  {
    id: 'budget',
    kicker: 'Step 9 / 10',
    question: 'When it comes to investing in your business growth:',
    helper: "This lets us suggest the right solution without wasting your time.",
    options: [
      { id: 'high_decider', label: "I decide alone, I've already invested $5k+ in programs" },
      { id: 'mid_decider', label: 'I decide alone, budget up to $5k this quarter' },
      { id: 'low_test', label: 'I decide alone, but prefer to test small (<$1k)' },
      { id: 'need_partner', label: 'I need to discuss with a partner or co-founder' },
      { id: 'not_yet', label: "I don't invest until I'm convinced" },
    ],
  },
  {
    id: 'timing',
    kicker: 'Step 10 / 10',
    question: 'When do you want things to change?',
    options: [
      { id: 'now', label: 'Now — ready to act this week' },
      { id: 'month', label: "Within the month — I don't want to lose another 30 days" },
      { id: 'quarter', label: "Within the quarter — I'm organizing" },
      { id: 'six_months', label: "In 6-12 months — I'm preparing" },
      { id: 'no_pressure', label: "No pressure — I'm exploring" },
    ],
  },
]

// ─── Step messages EN ────────────────────────────────────────────────────────

export const STEP_MESSAGES_EN: Record<number, { emoji: string; text: string }> = {
  4: { emoji: '👏', text: "Nice, we're getting to know you!" },
  6: { emoji: '💪', text: "Halfway there, you're on a roll" },
  9: { emoji: '⚡', text: 'Final stretch!' },
}

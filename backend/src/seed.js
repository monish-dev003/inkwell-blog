/**
 * ─────────────────────────────────────────────────────────────
 *  InkWell – Database Seed Script
 *  Creates:
 *    • 8 categories
 *    • 1 seed author account  (email: seed@inkwell.dev / pass: seed123456)
 *    • 100 published blog posts assigned to that account
 * ─────────────────────────────────────────────────────────────
 *  Usage (from /backend):
 *    node src/seed.js
 *  Or with custom MONGODB_URI:
 *    MONGODB_URI=mongodb://... node src/seed.js
 * ─────────────────────────────────────────────────────────────
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { User, Category, Post } = require('./models');

/* ── helpers ─────────────────────────────────────────────── */
const slugify = str =>
  str.toString().toLowerCase().trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

const readingTime = html =>
  Math.max(1, Math.ceil(
    html.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length / 200
  ));

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick    = arr => arr[Math.floor(Math.random() * arr.length)];

/* ── categories ──────────────────────────────────────────── */
const CATEGORIES = [
  { name: 'Technology',      color: '#4F46E5' },
  { name: 'Web Development', color: '#0891B2' },
  { name: 'Career & Growth', color: '#059669' },
  { name: 'Design',          color: '#D97706' },
  { name: 'AI & Machine Learning', color: '#7C3AED' },
  { name: 'Productivity',    color: '#DC2626' },
  { name: 'Open Source',     color: '#16A34A' },
  { name: 'DevOps & Cloud',  color: '#0369A1' },
];

/* ── 100 blog post definitions ───────────────────────────── */
const POST_DATA = [
  // ── TECHNOLOGY ─────────────────────────────────────────
  {
    title: 'The Evolution of the Internet: From ARPANET to Web3',
    category: 'Technology',
    tags: ['internet', 'history', 'web3', 'technology'],
    content: `<h2>A Brief History</h2>
<p>The internet's journey began in the late 1960s with ARPANET, a US Department of Defense project designed to create a robust, fault-tolerant communication network. Few could have imagined that this humble experiment would blossom into the global infrastructure we rely on today.</p>
<h2>The World Wide Web Changes Everything</h2>
<p>Tim Berners-Lee's invention of the World Wide Web in 1989 democratised access to information. Suddenly, researchers, businesses, and eventually everyday people could publish and consume content with unprecedented ease. The browser wars of the 1990s accelerated this adoption curve dramatically.</p>
<h2>Web 2.0 — The Participatory Web</h2>
<p>The early 2000s brought what many call "Web 2.0" — platforms that turned passive consumers into active creators. Social networks, user-generated content, and collaborative tools defined this era. Companies like Google, Facebook, and YouTube emerged as dominant forces.</p>
<h2>Web3 and the Decentralised Future</h2>
<p>Today, blockchain technology and decentralised protocols promise a new chapter: Web3. The idea is to shift power from centralised platforms back to individual users through cryptographic ownership, smart contracts, and token-based economies. Whether this vision fully materialises remains to be seen, but the conversation has fundamentally changed how we think about digital ownership.</p>
<blockquote><p>"The web is more a social creation than a technical one." — Tim Berners-Lee</p></blockquote>
<h2>Key Takeaways</h2>
<ul><li>The internet evolved from a military project to a global commons in just 50 years.</li><li>Each generational shift created new winners, losers, and entirely new industries.</li><li>Decentralisation may redefine how we think about data ownership and identity online.</li></ul>`,
  },
  {
    title: 'Why Quantum Computing Will Reshape Cryptography',
    category: 'Technology',
    tags: ['quantum', 'cryptography', 'security', 'future'],
    content: `<h2>The Quantum Threat</h2>
<p>Modern encryption relies on the computational difficulty of factoring large numbers — a problem that classical computers struggle with exponentially as key sizes grow. Quantum computers, using Shor's algorithm, could factor these numbers in polynomial time, rendering RSA and ECC encryption obsolete.</p>
<h2>How Quantum Computers Work</h2>
<p>Unlike classical bits that are either 0 or 1, quantum bits (qubits) exploit superposition — existing in multiple states simultaneously. Combined with entanglement and interference, this allows quantum machines to explore vast solution spaces in parallel.</p>
<h2>Post-Quantum Cryptography</h2>
<p>NIST has been running a post-quantum cryptography standardisation process since 2016. The winning algorithms — CRYSTALS-Kyber for key encapsulation and CRYSTALS-Dilithium for digital signatures — are based on lattice problems believed to be hard even for quantum computers.</p>
<h2>The Harvest Now, Decrypt Later Threat</h2>
<p>Perhaps the most alarming risk is "harvest now, decrypt later" attacks. Nation-state adversaries may be recording encrypted traffic today, betting on decrypting it once powerful quantum computers exist. This makes the migration to post-quantum standards urgent — even if the quantum threat is still years away.</p>
<h2>What Should Organisations Do?</h2>
<ul><li>Begin crypto-agility initiatives to make encryption algorithms swappable without system-wide overhauls.</li><li>Inventory all cryptographic dependencies.</li><li>Start testing post-quantum algorithms in non-critical systems now.</li></ul>`,
  },
  {
    title: 'Understanding Moore\'s Law — And Its Limits',
    category: 'Technology',
    tags: ['hardware', 'moores-law', 'semiconductors', 'future'],
    content: `<h2>The Original Observation</h2>
<p>In 1965, Gordon Moore observed that the number of transistors on a microchip doubled approximately every two years, with costs halving accordingly. This prediction — Moore's Law — became a self-fulfilling prophecy, driving the semiconductor industry's roadmap for six decades.</p>
<h2>What Drove It</h2>
<p>Shrinking transistor geometries allowed more compute per unit area. Innovations in lithography, materials science, and chip architecture compounded these gains. The result: processors went from thousands of transistors to tens of billions.</p>
<h2>The Physical Limits</h2>
<p>At sub-5nm nodes, transistors are just a few silicon atoms wide. Quantum tunnelling effects cause current leakage. Heat dissipation becomes a fundamental constraint. These aren't engineering challenges solvable with ingenuity alone — they're rooted in physics.</p>
<h2>What Comes After?</h2>
<p>The industry is pivoting to heterogeneous integration (chiplets), 3D stacking, and specialised accelerators (GPUs, TPUs, NPUs). Software co-design — tuning algorithms to hardware architectures — is increasingly important. Neuromorphic and photonic computing represent longer-horizon bets.</p>`,
  },
  {
    title: '5G and Beyond: The Race for Connectivity',
    category: 'Technology',
    tags: ['5g', '6g', 'connectivity', 'wireless'],
    content: `<h2>What 5G Actually Delivers</h2>
<p>5G promises three distinct capability tiers: enhanced mobile broadband (multi-Gbps speeds), ultra-reliable low-latency communications (sub-1ms), and massive machine-type communications (millions of devices per square kilometre). In practice, many deployments focus primarily on the first.</p>
<h2>Real-World Use Cases</h2>
<p>Industrial automation, remote surgery, autonomous vehicle coordination, and smart city infrastructure represent the transformative use cases justifying 5G's infrastructure investment. Consumer applications like cloud gaming and AR/VR benefit from the bandwidth boost.</p>
<h2>The 6G Horizon</h2>
<p>Research into 6G has already begun in South Korea, Japan, the EU, and China. Terahertz spectrum, AI-native network architectures, and sensing-communication integration define early roadmaps. Commercial deployment is expected around 2030.</p>`,
  },
  {
    title: 'Edge Computing: Bringing the Cloud Closer to You',
    category: 'Technology',
    tags: ['edge-computing', 'cloud', 'iot', 'latency'],
    content: `<h2>Why Edge Computing Matters</h2>
<p>Centralised cloud data centres are remarkable, but physics is undefeated: the speed of light creates irreducible latency between users and distant servers. For latency-sensitive applications — autonomous vehicles, industrial robotics, real-time analytics — this latency is unacceptable.</p>
<h2>Edge vs Cloud</h2>
<p>Edge computing moves processing and storage closer to where data is generated. This isn't a replacement for cloud; it's a complementary layer. Time-sensitive operations happen at the edge; historical analysis and training happen in the cloud.</p>
<h2>Security Challenges</h2>
<p>Distributed edge nodes expand the attack surface dramatically. Each node must be hardened, monitored, and updated — tasks that are trivial in a controlled data centre become operationally complex across thousands of remote locations.</p>`,
  },

  // ── WEB DEVELOPMENT ────────────────────────────────────
  {
    title: 'React vs Vue vs Svelte: Choosing Your Frontend Framework in 2025',
    category: 'Web Development',
    tags: ['react', 'vue', 'svelte', 'frontend', 'javascript'],
    content: `<h2>The State of Frontend in 2025</h2>
<p>The JavaScript framework landscape has stabilised considerably. React maintains dominant market share, Vue is thriving in Asia and the enterprise market, and Svelte's compiler approach has carved out a devoted following. Choosing between them is increasingly a matter of team preferences, ecosystem needs, and project scale.</p>
<h2>React — The Safe Bet</h2>
<p>React's virtual DOM, one-way data flow, and massive ecosystem make it the default choice for most teams. The addition of Server Components and the continued evolution of the Next.js framework keep it at the frontier. The learning curve is steeper than alternatives, and JSX polarises opinion, but the investment pays off in access to talent and libraries.</p>
<h2>Vue — The Progressive Framework</h2>
<p>Vue's gentle learning curve and excellent documentation make it beloved by developers transitioning from backend roles. Vue 3's Composition API brought it feature parity with React hooks. Nuxt.js provides a comparable full-stack experience to Next.js.</p>
<h2>Svelte — Compiled, Not Run-Time</h2>
<p>Svelte compiles components to vanilla JavaScript at build time, eliminating the virtual DOM overhead entirely. This results in smaller bundle sizes and often better runtime performance. SvelteKit has matured into a capable full-stack solution, but the ecosystem remains smaller than React's or Vue's.</p>
<h2>The Verdict</h2>
<p>For a team prioritising hirability and ecosystem breadth: React. For developer experience and smaller-to-medium projects: Vue. For performance and bundle-size-critical applications: Svelte.</p>`,
  },
  {
    title: 'TypeScript in 2025: Is It Still Worth It?',
    category: 'Web Development',
    tags: ['typescript', 'javascript', 'types', 'dx'],
    content: `<h2>TypeScript's Remarkable Rise</h2>
<p>TypeScript has gone from a Microsoft experiment to the de facto language for serious JavaScript development. Stack Overflow surveys consistently rank it among the most loved languages, and adoption across open-source projects is near-universal at scale.</p>
<h2>The Real Benefits</h2>
<p>The primary value of TypeScript isn't catching bugs at runtime — it's the development experience it enables. Autocomplete, refactoring tools, and immediate inline error feedback turn complex codebases from archaeology expeditions into navigable systems. Documentation that doesn't go stale is perhaps the most underrated benefit.</p>
<h2>The Costs</h2>
<p>Build tooling complexity increases. Generic types can become unreadably complex. New developers face a steeper ramp. For small scripts or rapid prototypes, the overhead can outweigh the benefits. The TypeScript team acknowledged this with the "types as comments" proposal that landed in modern runtimes.</p>
<h2>When to Skip TypeScript</h2>
<p>Short-lived scripts, experimental prototypes, and solo projects with rapid iteration cycles often benefit from plain JavaScript's frictionlessness. The key is intentionality — choose based on project lifecycle, not convention.</p>`,
  },
  {
    title: 'Building Accessible Websites: More Than Just Compliance',
    category: 'Web Development',
    tags: ['accessibility', 'a11y', 'html', 'wcag', 'inclusive-design'],
    content: `<h2>The Business Case for Accessibility</h2>
<p>Accessibility is often framed as a compliance burden. This framing misses the point entirely. Over a billion people globally experience some form of disability. Building accessible products expands your user base, reduces legal risk, and — critically — produces better products for everyone.</p>
<h2>The POUR Principles</h2>
<p>WCAG organises accessibility requirements around four principles: Perceivable, Operable, Understandable, and Robust. Every guideline traces back to one of these principles. Understanding the intent behind each guideline is more valuable than memorising success criteria.</p>
<h2>Common Failures and How to Avoid Them</h2>
<ul><li><strong>Missing alt text:</strong> Every meaningful image needs descriptive alternative text. Decorative images get empty alt attributes.</li><li><strong>Poor colour contrast:</strong> WCAG 2.1 AA requires 4.5:1 contrast for normal text. Use tools like the Colour Contrast Analyser.</li><li><strong>Keyboard traps:</strong> Users who navigate by keyboard must be able to reach and exit every interactive element.</li><li><strong>Missing focus indicators:</strong> Never remove the focus outline without providing a visible alternative.</li></ul>
<h2>Testing with Real Assistive Technology</h2>
<p>Automated tools catch about 30% of accessibility issues. The rest require manual testing with screen readers (NVDA, VoiceOver, JAWS), keyboard-only navigation, and ideally, users with disabilities as actual testers.</p>`,
  },
  {
    title: 'CSS Grid vs Flexbox: A Practical Guide',
    category: 'Web Development',
    tags: ['css', 'grid', 'flexbox', 'layout'],
    content: `<h2>The One-Dimensional vs Two-Dimensional Rule</h2>
<p>The classic heuristic: use Flexbox for one-dimensional layouts (either rows OR columns), and Grid for two-dimensional layouts (rows AND columns simultaneously). This is a good starting point, but reality is more nuanced.</p>
<h2>When Flexbox Excels</h2>
<p>Navigation bars, toolbars, card actions, and any layout where items need to distribute themselves along a single axis are Flexbox territory. Its strength is content-first sizing — items naturally size based on their content, then distribute remaining space.</p>
<h2>When Grid Excels</h2>
<p>Page-level layouts, image galleries, dashboards, and any scenario where you need precise control over both axes belong to Grid. Grid is layout-first — you define the structure and place content into it.</p>
<h2>They're Not Mutually Exclusive</h2>
<p>The best layouts often combine both. A Grid defines the overall page structure; Flexbox aligns items within each grid cell. Master both and choose contextually.</p>`,
  },
  {
    title: 'The State of WebAssembly in 2025',
    category: 'Web Development',
    tags: ['webassembly', 'wasm', 'performance', 'browser'],
    content: `<h2>What WebAssembly Solved</h2>
<p>JavaScript is remarkably capable, but it was never designed for the kind of compute-intensive tasks modern web applications demand — video encoding, physics simulations, image processing, scientific computing. WebAssembly provides a low-level bytecode format that runs at near-native speed in browsers.</p>
<h2>The Use Cases That Matter</h2>
<p>Figma's real-time collaborative rendering engine, Google Earth's 3D visualisation, AutoCAD's browser port, and countless audio/video processing tools have leveraged WASM to deliver desktop-class experiences on the web.</p>
<h2>WASI — WebAssembly Beyond the Browser</h2>
<p>The WebAssembly System Interface (WASI) allows WASM modules to run outside browsers — on servers, edge nodes, and embedded devices. The promise: compile once, run anywhere, with a consistent security sandbox. Docker's Solomon Hykes famously said this would have made Docker unnecessary had it existed earlier.</p>`,
  },
  {
    title: 'REST vs GraphQL vs tRPC: Which API Style Should You Use?',
    category: 'Web Development',
    tags: ['rest', 'graphql', 'trpc', 'api', 'backend'],
    content: `<h2>REST — The Mature Standard</h2>
<p>REST's resource-based model maps cleanly to HTTP verbs and status codes. Its statelessness enables horizontal scaling. Caching with CDNs is straightforward. For public APIs consumed by diverse clients, REST remains the default choice — documentation and tooling are unmatched.</p>
<h2>GraphQL — Flexible but Complex</h2>
<p>GraphQL lets clients request exactly the data they need, eliminating over-fetching and under-fetching. This is particularly valuable when multiple client types (mobile, web, third-party) have different data requirements. The cost: N+1 query problems, complex caching, schema management overhead, and a steeper learning curve.</p>
<h2>tRPC — End-to-End Type Safety</h2>
<p>For TypeScript monorepos where the frontend and backend are co-located, tRPC offers something neither REST nor GraphQL can: complete, automatically-inferred type safety from server to client without code generation. The tradeoff is that it only makes sense within a TypeScript ecosystem.</p>
<h2>The Decision Framework</h2>
<ul><li>Public API with multiple unknown consumers → REST</li><li>Complex data requirements across multiple client types → GraphQL</li><li>Full-stack TypeScript app with shared types → tRPC</li></ul>`,
  },
  {
    title: 'Server-Side Rendering vs Static Generation vs Client-Side Rendering',
    category: 'Web Development',
    tags: ['ssr', 'ssg', 'csr', 'nextjs', 'performance'],
    content: `<h2>Client-Side Rendering (CSR)</h2>
<p>CSR sends a minimal HTML shell and lets JavaScript build the page in the browser. It's simple to deploy (static hosting), excellent for highly interactive apps, but suffers from slow initial loads, poor SEO without workarounds, and degraded experience on low-powered devices.</p>
<h2>Server-Side Rendering (SSR)</h2>
<p>SSR generates the full HTML on the server for each request. Users see content faster (especially on slow connections), and crawlers have no trouble indexing it. The cost is server infrastructure, cache complexity, and higher time-to-first-byte under load.</p>
<h2>Static Site Generation (SSG)</h2>
<p>SSG pre-renders pages at build time. The result is CDN-deliverable HTML with near-instant load times and trivial scaling. The limitation: content is stale until the next build. Incremental Static Regeneration (ISR), introduced by Next.js, blurs this line by revalidating pages in the background.</p>
<h2>The Modern Answer: Hybrid</h2>
<p>Frameworks like Next.js and SvelteKit allow mixing strategies per-route. Marketing pages are statically generated; dashboards are server-rendered; real-time widgets are client-rendered. Choose per page, not per project.</p>`,
  },

  // ── CAREER & GROWTH ────────────────────────────────────
  {
    title: 'How to Land Your First Software Engineering Job',
    category: 'Career & Growth',
    tags: ['career', 'job-hunting', 'interviews', 'beginner'],
    content: `<h2>The Entry-Level Paradox</h2>
<p>Every junior developer faces the same cruel joke: job postings requiring three years of experience for "entry-level" roles. This is frustrating but navigable. The key insight is that most companies aren't actually hiring for a resume — they're hiring for evidence of competence and growth potential.</p>
<h2>Build Projects That Tell a Story</h2>
<p>A portfolio of three polished, fully-functional projects outperforms a list of ten half-finished repositories. Choose projects that solve real problems, ideally ones you've personally experienced. Deploy them. Write a README that explains what problem you solved, why you chose your tech stack, and what you learned.</p>
<h2>The Job Application Funnel</h2>
<p>Treat job hunting like a sales funnel. Apply broadly (100+ applications is not unusual), but personalise your top 20%. For referrals — the highest-conversion channel — leverage LinkedIn, local meetups, and open-source contributions to build genuine relationships before you need them.</p>
<h2>Interview Preparation</h2>
<p>Coding interviews are a skill, separate from software engineering. Dedicate focused time to LeetCode (easy and medium problems suffice for most companies outside FAANG). Practice explaining your thought process out loud. System design interviews at the junior level mostly test whether you understand why distributed systems exist.</p>`,
  },
  {
    title: 'The Senior Engineer\'s Guide to Technical Leadership',
    category: 'Career & Growth',
    tags: ['leadership', 'senior-engineer', 'mentorship', 'career'],
    content: `<h2>The Transition Nobody Prepares You For</h2>
<p>The skills that make you an excellent individual contributor — deep focus, technical precision, self-sufficiency — are partly in tension with what makes an effective technical leader. Leadership amplifies your impact through others, which requires entirely different instincts.</p>
<h2>Multiplying Your Team</h2>
<p>The best metric for senior engineers isn't their individual output — it's how much faster everyone around them moves. Code reviews that teach principles rather than just spot bugs. Design documents that share context, not just decisions. Pair programming sessions that leave the other person more capable than before.</p>
<h2>Making Architectural Decisions</h2>
<p>Great technical decisions are documented decisions. An Architecture Decision Record (ADR) captures the context, options considered, decision made, and consequences expected. This isn't bureaucracy — it's institutional memory that pays dividends years later.</p>
<h2>The Politics You Can't Ignore</h2>
<p>Technical decisions rarely happen in a vacuum. Understanding business priorities, stakeholder concerns, and organisational incentives allows you to propose solutions that are technically sound AND actually get adopted.</p>`,
  },
  {
    title: 'Negotiating Your Salary as a Developer: A Complete Guide',
    category: 'Career & Growth',
    tags: ['salary', 'negotiation', 'career', 'compensation'],
    content: `<h2>The Fundamental Truth</h2>
<p>Companies budget salary ranges before posting jobs. The first offer is rarely the best offer. Negotiating is expected — hiring managers assume you will — and it virtually never causes an offer to be rescinded. The cost of not negotiating, compounded over a career, is enormous.</p>
<h2>Research First</h2>
<p>Know your market value before any conversation. Sources: Levels.fyi (especially for tech), Glassdoor, LinkedIn Salary, and most valuably, conversations with peers. Geographic adjustment matters significantly — the same role varies 2-3x in total compensation between markets.</p>
<h2>The Negotiation Conversation</h2>
<p>When an offer arrives, express enthusiasm for the role and ask for 24-48 hours to review. Then respond: "I'm very excited about this opportunity. Based on my research and experience, I was hoping for [X]. Is there flexibility there?" X should be 10-20% above your actual target, giving room to land where you want.</p>
<h2>Beyond Base Salary</h2>
<p>Total compensation includes equity, signing bonus, annual bonus, remote work flexibility, learning budget, and PTO. When base salary is truly fixed, these levers are often more flexible and can substantially change the value of an offer.</p>`,
  },
  {
    title: 'From Developer to Engineering Manager: What Nobody Tells You',
    category: 'Career & Growth',
    tags: ['management', 'engineering-manager', 'career', 'leadership'],
    content: `<h2>The Identity Shift</h2>
<p>Moving into engineering management means your primary output is no longer code — it's the environment in which others write code. Your calendar fills with 1:1s, planning sessions, and cross-functional meetings. The deep-focus coding blocks that defined your previous role largely disappear. Many developers find this trade rewarding; many find it suffocating.</p>
<h2>What the Role Actually Involves</h2>
<p>The day-to-day of engineering management spans: hiring and retaining talent, running agile ceremonies, resolving interpersonal conflicts, translating business requirements into technical scope, managing up to leadership, and serving as a shield for your team from organisational noise.</p>
<h2>The Technical Credibility Question</h2>
<p>New engineering managers often feel anxious about losing their technical edge. Some degree of drift is inevitable — you can't be in code full-time and manage effectively. Focus on staying fluent enough to earn your team's respect and make sound architectural decisions, not on staying competitive with your individual contributors.</p>`,
  },
  {
    title: 'Building a Personal Brand as a Developer',
    category: 'Career & Growth',
    tags: ['personal-brand', 'writing', 'speaking', 'career'],
    content: `<h2>Why Personal Brand Matters</h2>
<p>In a world where hundreds of developers apply for every desirable job, a personal brand is a career asset that compounds over time. It creates inbound opportunity, accelerates trust with new employers and clients, and gives you a platform to shape conversations in your field.</p>
<h2>The Smallest Viable Audience</h2>
<p>You don't need a million followers. A hundred genuinely engaged readers in your niche are worth more professionally than ten thousand casual social media followers. Write for the developer you were two years ago — they're your ideal reader, and there are many of them.</p>
<h2>Channels That Work</h2>
<p>Technical blogging (your own site > Medium), conference talks (start with local meetups), open-source contributions, and Twitter/X technical threads each build audience in different ways. Pick one, do it consistently for six months, and measure before adding another channel.</p>`,
  },
  {
    title: 'The Art of Code Review: How to Give and Receive Feedback',
    category: 'Career & Growth',
    tags: ['code-review', 'feedback', 'team', 'collaboration'],
    content: `<h2>Code Review Is Communication</h2>
<p>Most code review friction is communication friction masquerading as technical disagreement. The diff is merely the medium; the real work is navigating different mental models, preferences, and priorities respectfully and efficiently.</p>
<h2>The Reviewer's Responsibilities</h2>
<p>Distinguish between blocking issues (correctness, security, maintainability) and preferences (style, naming). Mark preference comments clearly. Ask questions rather than assert problems — "What happens if X?" is friendlier and sometimes reveals that you missed something. Acknowledge good choices explicitly.</p>
<h2>The Author's Responsibilities</h2>
<p>A pull request description is a gift to your reviewer. Explain what changed, why it changed, and how to test it. Make your diff reviewable — smaller PRs get better reviews faster. Respond to every comment, even if just to say "done" or "discussed offline."</p>`,
  },
  {
    title: 'Imposter Syndrome in Tech: Recognition and Recovery',
    category: 'Career & Growth',
    tags: ['imposter-syndrome', 'mental-health', 'career', 'wellbeing'],
    content: `<h2>You Are Not Alone</h2>
<p>Studies suggest 70% of people experience imposter syndrome at some point. In technology, with its high hiring bars, rapid change, and culture of visible expertise, the incidence is particularly high. The people you most admire have almost certainly felt exactly what you're feeling.</p>
<h2>Understanding the Mechanism</h2>
<p>Imposter syndrome is a cognitive distortion: selectively attending to evidence of incompetence while discounting evidence of competence. The very self-awareness and high standards that drive achievement also power the critical inner voice.</p>
<h2>Practical Countermeasures</h2>
<ul><li><strong>Keep a wins journal</strong> — record positive feedback, problems solved, and skills acquired weekly.</li><li><strong>Talk to trusted peers</strong> — hearing that others feel the same is surprisingly effective.</li><li><strong>Reframe "I don't know" as "I don't know yet."</strong></li><li><strong>Distinguish feelings from facts</strong> — feeling incompetent is not evidence of incompetence.</li></ul>`,
  },
  {
    title: 'Remote Work as a Developer: Thriving in a Distributed Team',
    category: 'Career & Growth',
    tags: ['remote-work', 'productivity', 'communication', 'async'],
    content: `<h2>The Remote Developer Opportunity</h2>
<p>Remote work has permanently changed the talent market. Developers can now access global opportunities without relocating, companies can hire from a global talent pool, and entire careers can be built without ever working in a traditional office. But thriving remotely requires deliberate habits that most workplaces don't teach.</p>
<h2>Async-First Communication</h2>
<p>The most effective remote teams default to asynchronous communication: detailed written updates, thorough documentation, and the discipline to capture decisions in writing. This creates a searchable record and respects your colleagues' deep work time across time zones.</p>
<h2>The Visibility Problem</h2>
<p>Remote workers must consciously manage their visibility. Share progress updates before they're requested. Participate actively in written discussions. Make your work legible to people who can't see you at your desk. This isn't performative — it's how distributed teams build the shared context that enables coordination.</p>`,
  },

  // ── DESIGN ─────────────────────────────────────────────
  {
    title: 'Design Systems: Building at Scale',
    category: 'Design',
    tags: ['design-system', 'ui', 'components', 'consistency'],
    content: `<h2>The Problem Design Systems Solve</h2>
<p>At a certain scale, without a shared design language, products become inconsistent. Different teams reinvent the same components with subtle variations. Engineers and designers negotiate the same decisions repeatedly. Users encounter interfaces that feel subtly disjointed. Design systems are the solution.</p>
<h2>Anatomy of a Design System</h2>
<p>A mature design system has multiple layers: design tokens (the lowest-level values: colours, spacing, typography), a component library (reusable UI elements built on tokens), usage guidelines (when and how to use each component), and contribution processes (how the system evolves).</p>
<h2>The Governance Problem</h2>
<p>Design systems require ongoing maintenance. Who decides when a component needs updating? Who reviews contributions? Who communicates breaking changes? Without explicit governance, design systems slowly decay into inconsistent libraries that nobody trusts.</p>
<h2>Build vs Buy</h2>
<p>Building a design system from scratch is expensive. Most teams should build on top of established foundations like Radix UI, shadcn/ui, or Material Design, then layer in their brand. Reserve custom components for differentiated parts of your product.</p>`,
  },
  {
    title: 'The Psychology of Colour in UX Design',
    category: 'Design',
    tags: ['colour', 'ux', 'psychology', 'branding'],
    content: `<h2>Colour Is Communication</h2>
<p>Colour communicates before users read a single word. It creates hierarchy, signals interactivity, conveys brand personality, and evokes emotional responses. Used carelessly, it creates confusion and accessibility failures. Used deliberately, it's among the most powerful tools in a designer's arsenal.</p>
<h2>Functional Colour Roles</h2>
<p>Every design benefits from a clear colour system: a primary brand colour, a semantic system (success green, warning amber, error red), neutrals for text and backgrounds, and an accent for drawing attention. Defining these roles explicitly prevents the ad hoc colour accumulation that plagues inconsistent designs.</p>
<h2>Accessibility Is Non-Negotiable</h2>
<p>10% of men have some form of colour vision deficiency. Never rely on colour alone to convey information — always pair colour with shape, text, or pattern. Test your colour choices with tools like Colour Oracle to see your design through colour-blind eyes.</p>`,
  },
  {
    title: 'Typography for the Web: A Practical Guide',
    category: 'Design',
    tags: ['typography', 'fonts', 'readability', 'web-design'],
    content: `<h2>Why Typography Is 90% of Design</h2>
<p>The web is predominantly text. Typography isn't decoration — it's the primary vehicle for communication. A site with mediocre visuals but excellent typography feels professional and trustworthy. The reverse rarely works.</p>
<h2>The Fundamental Choices</h2>
<p>Font selection, size, line height, line length, letter spacing, and font weight all interact to create the reading experience. A body font size below 16px for body text, a line height below 1.5, or a line length above 75 characters will consistently hurt readability.</p>
<h2>Variable Fonts</h2>
<p>Variable fonts encode multiple weights, widths, and optical sizes into a single file. This dramatically reduces HTTP requests and file size while enabling fine-grained typographic control. Browser support is now universal, making variable fonts the right choice for new projects.</p>`,
  },
  {
    title: 'Micro-Interactions: The Details That Delight',
    category: 'Design',
    tags: ['micro-interactions', 'animation', 'ux', 'delight'],
    content: `<h2>What Are Micro-Interactions?</h2>
<p>Micro-interactions are the small, contained interactive moments that accomplish a single task: toggling a setting, liking a post, submitting a form. Dan Saffer, who coined the term, describes their structure: trigger, rules, feedback, and loops/modes.</p>
<h2>Why They Matter</h2>
<p>Micro-interactions transform functional software into products people enjoy using. The satisfaction of a smooth toggle animation, the reassurance of a form submission confirmation, the playfulness of an animated error state — these details collectively define how a product feels.</p>
<h2>Principles for Good Micro-Interactions</h2>
<ul><li><strong>Purposeful:</strong> Every animation should serve communication, not decoration.</li><li><strong>Instant:</strong> Interactive responses should happen within 100ms to feel immediate.</li><li><strong>Respectful:</strong> Honour reduced-motion preferences.</li><li><strong>Consistent:</strong> Use the same animation language throughout the product.</li></ul>`,
  },
  {
    title: 'Figma to Code: Bridging the Designer-Developer Gap',
    category: 'Design',
    tags: ['figma', 'handoff', 'design-to-code', 'collaboration'],
    content: `<h2>The Handoff Problem</h2>
<p>The moment a design file crosses from a designer to a developer's screen, information is lost. Spacing that looked right at 100% zoom is ambiguous at implementation time. Hover states that existed in the designer's head never made it into the file. This gap costs teams enormous time and produces inconsistent results.</p>
<h2>Designing With Developers in Mind</h2>
<p>Effective handoffs require intentional design practices: consistent use of components and auto-layout, explicit spacing tokens, annotated interactive states, and documented edge cases. Figma's Dev Mode closes part of this gap by exposing CSS properties and component references directly to developers.</p>
<h2>The Future: AI-Assisted Code Generation</h2>
<p>Tools that generate production-quality code from design files have advanced dramatically. They won't replace developers, but they're beginning to handle the mechanical translation of static layouts, freeing developer time for logic, performance, and edge cases.</p>`,
  },

  // ── AI & MACHINE LEARNING ──────────────────────────────
  {
    title: 'Understanding Large Language Models: A Developer\'s Primer',
    category: 'AI & Machine Learning',
    tags: ['llm', 'ai', 'gpt', 'transformers', 'nlp'],
    content: `<h2>What LLMs Actually Are</h2>
<p>Large Language Models are neural networks trained on vast text corpora to predict the next token in a sequence. Through this simple objective, applied at enormous scale with carefully curated data, models develop emergent capabilities that surprised even their creators: reasoning, code generation, instruction following, and apparent creativity.</p>
<h2>The Transformer Architecture</h2>
<p>The "Attention Is All You Need" paper (2017) introduced the Transformer architecture that underlies modern LLMs. Its key innovation — the self-attention mechanism — allows every token to attend to every other token in context, capturing long-range dependencies that sequential models struggled with.</p>
<h2>Context Windows and Their Limits</h2>
<p>Every LLM processes a fixed-length context window. Modern models range from 4K to over 1M tokens. Longer contexts enable processing entire codebases or documents, but attention complexity scales quadratically with context length, creating memory and compute challenges.</p>
<h2>Practical Implications for Developers</h2>
<p>Understanding LLM internals helps you prompt more effectively, anticipate failure modes, choose appropriate models for tasks, and evaluate when LLMs are appropriate tools versus when they're misapplied. LLMs are excellent at text manipulation and pattern-matching; they are unreliable for precise arithmetic, factual recall, and real-time information.</p>`,
  },
  {
    title: 'Prompt Engineering: Getting the Most from AI Models',
    category: 'AI & Machine Learning',
    tags: ['prompt-engineering', 'ai', 'llm', 'chatgpt'],
    content: `<h2>Why Prompting Is a Skill</h2>
<p>The same underlying model produces vastly different outputs depending on how you phrase your request. Prompt engineering isn't magic — it's understanding how language models process context and using that understanding to provide the right inputs.</p>
<h2>Core Techniques</h2>
<p><strong>Be specific:</strong> Vague prompts produce vague outputs. Specify format, length, audience, and constraints explicitly. <strong>Few-shot prompting:</strong> Provide examples of the output format you want before making your request. Models are excellent at pattern completion. <strong>Chain of thought:</strong> Ask the model to think step by step before giving an answer. This dramatically improves performance on reasoning tasks.</p>
<h2>System Prompts and Personas</h2>
<p>System prompts that establish context and persona before user interaction significantly improve output quality and consistency. Telling a model it's a senior software engineer reviewing code produces more specific, actionable feedback than a bare code review request.</p>
<h2>The Limits</h2>
<p>Prompt engineering can't compensate for fundamental model limitations. No prompting technique makes a model reliably know its knowledge cutoff, perform complex arithmetic, or access real-time information without retrieval augmentation.</p>`,
  },
  {
    title: 'Building RAG Applications: Retrieval-Augmented Generation Explained',
    category: 'AI & Machine Learning',
    tags: ['rag', 'embeddings', 'vector-db', 'ai', 'langchain'],
    content: `<h2>The Problem RAG Solves</h2>
<p>LLMs are trained on data with a cutoff date and can't access proprietary information. Retrieval-Augmented Generation addresses this by combining a language model's reasoning capabilities with a retrieval system that fetches relevant context at inference time.</p>
<h2>How RAG Works</h2>
<p>At query time, the user's question is converted to a vector embedding. This embedding is compared against a vector database of pre-embedded document chunks. The top-k most similar chunks are retrieved and injected into the model's context alongside the original question. The model then generates an answer grounded in the retrieved material.</p>
<h2>The Components You Need</h2>
<ul><li><strong>Embedding model:</strong> Converts text to vectors (OpenAI's text-embedding-3-small, Cohere's Embed, or open-source alternatives).</li><li><strong>Vector database:</strong> Stores and retrieves embeddings (Pinecone, Weaviate, Chroma, pgvector).</li><li><strong>LLM:</strong> Generates the final answer.</li><li><strong>Orchestration:</strong> LangChain, LlamaIndex, or custom code.</li></ul>
<h2>Where RAG Falls Short</h2>
<p>RAG quality is limited by retrieval quality. Poor chunking strategies, weak embedding models, or misaligned retrieval leave valuable context on the table. Evaluation of RAG systems is genuinely difficult — measuring answer quality requires significant human judgment or specialised evaluation frameworks.</p>`,
  },
  {
    title: 'AI Ethics for Developers: Questions Every Builder Should Ask',
    category: 'AI & Machine Learning',
    tags: ['ai-ethics', 'responsible-ai', 'bias', 'fairness'],
    content: `<h2>Why Developers Must Engage With Ethics</h2>
<p>AI systems embed values whether their builders acknowledge it or not. Every decision — what data to train on, which metrics to optimise, who to test with — shapes who benefits from the system and who is harmed. Treating ethics as someone else's problem is itself a choice with consequences.</p>
<h2>The Bias Problem</h2>
<p>Machine learning models learn from historical data. When that data reflects historical discrimination — in hiring, lending, criminal justice, healthcare — models perpetuate and often amplify those patterns. Identifying and measuring bias requires investing in disaggregated evaluation across demographic groups.</p>
<h2>Questions to Ask Before Shipping</h2>
<ul><li>Who will use this system, and who will be most affected by its decisions?</li><li>What happens when it's wrong, and who bears that cost?</li><li>Is the data representative of the people the system will affect?</li><li>Is there meaningful human oversight of consequential decisions?</li><li>Could this system be misused, and what are we doing to prevent it?</li></ul>`,
  },
  {
    title: 'Fine-Tuning vs Prompting vs RAG: Choosing the Right AI Strategy',
    category: 'AI & Machine Learning',
    tags: ['fine-tuning', 'rag', 'prompt-engineering', 'ai', 'llm'],
    content: `<h2>The Three Approaches</h2>
<p>When building on top of foundation models, you have three main strategies for adapting model behaviour to your use case: prompt engineering (shaping behaviour through inputs), retrieval-augmented generation (injecting relevant context at runtime), and fine-tuning (adjusting model weights with domain-specific data).</p>
<h2>Start With Prompting</h2>
<p>Prompt engineering is free, immediate, and reversible. It should be your first experiment. Many use cases that seem to require fine-tuning are solved with well-crafted few-shot prompts, persona definitions, and structured output specifications.</p>
<h2>Add RAG for Knowledge</h2>
<p>When the model needs access to specific, current, or proprietary knowledge it wasn't trained on, RAG is the right tool. It's more maintainable than fine-tuning for factual grounding — you update the vector database, not the model.</p>
<h2>Fine-Tune for Style and Format</h2>
<p>Fine-tuning excels at teaching a model a specific output format, tone, or domain vocabulary that's difficult to specify in a prompt. It's most justified when you have thousands of high-quality examples of the desired behaviour and prompting has demonstrably failed.</p>`,
  },
  {
    title: 'Neural Networks Explained: From Perceptrons to Deep Learning',
    category: 'AI & Machine Learning',
    tags: ['neural-networks', 'deep-learning', 'machine-learning', 'basics'],
    content: `<h2>The Biological Inspiration</h2>
<p>Artificial neural networks draw loose inspiration from the brain's architecture: interconnected neurons that fire based on accumulated inputs. The perceptron — the simplest artificial neuron — takes weighted inputs, sums them, applies an activation function, and produces an output.</p>
<h2>From Perceptrons to Deep Networks</h2>
<p>A single perceptron can only classify linearly separable data. Stack multiple layers of perceptrons — a deep neural network — and the model can learn hierarchical representations. Early layers detect simple features; later layers combine these into complex concepts.</p>
<h2>Why Deep Learning Works Now</h2>
<p>Deep learning has existed conceptually since the 1980s. Three developments unlocked its modern success: GPU-accelerated training (enabling computation at scale), large labelled datasets (the raw material for learning), and algorithmic improvements (better activation functions, batch normalisation, residual connections).</p>`,
  },

  // ── PRODUCTIVITY ───────────────────────────────────────
  {
    title: 'The Deep Work Playbook for Software Engineers',
    category: 'Productivity',
    tags: ['deep-work', 'focus', 'productivity', 'cal-newport'],
    content: `<h2>The Shallow Work Epidemic</h2>
<p>Software engineering rewards deep, focused concentration. Yet modern work environments — open offices, always-on Slack, endless meetings — are optimised for shallow, reactive work. The result: developers are busy but rarely in the flow states where their best work happens.</p>
<h2>Protecting Your Attention</h2>
<p>Deep work requires blocking calendar time and defending it. Schedule focus blocks of 2-4 hours — the minimum time to reach meaningful productivity on complex problems. Treat these blocks as immovable as meetings with your most important stakeholder.</p>
<h2>The Shutdown Ritual</h2>
<p>Cal Newport recommends a daily shutdown ritual: review your task list, check tomorrow's calendar, and explicitly say "shutdown complete." This deliberate closure allows your unconscious mind to work on problems during downtime without residual anxiety keeping you mentally on call.</p>
<h2>Measuring the Right Things</h2>
<p>Track hours of deep work per day. Most knowledge workers average less than one. Elite performers average four. The gap between these numbers explains a large portion of the productivity variation between good and great developers.</p>`,
  },
  {
    title: 'Note-Taking Systems for Developers: From Chaos to Clarity',
    category: 'Productivity',
    tags: ['note-taking', 'knowledge-management', 'obsidian', 'zettelkasten'],
    content: `<h2>The Knowledge Accumulation Problem</h2>
<p>Developers learn continuously — new APIs, architectural patterns, debugging techniques, domain concepts. Without a system to capture and connect this knowledge, it evaporates. You rediscover the same solutions, re-read the same documentation, and re-learn the same lessons.</p>
<h2>The Zettelkasten Method</h2>
<p>The Zettelkasten (slip-box) method, developed by sociologist Niklas Luhmann, treats notes as atomic ideas connected by explicit links. Instead of a hierarchy of folders, you build a web of ideas. Over time, connections surface that wouldn't emerge from sequential note-taking.</p>
<h2>Tools for Developers</h2>
<p>Obsidian (local Markdown files with graph view) is the current favourite for developers who value ownership and flexibility. Notion suits teams needing collaborative features. Logseq offers an open-source alternative to Roam Research. The tool matters less than the practice — consistency beats perfection.</p>`,
  },
  {
    title: 'Time Management for Developers: Beyond the Pomodoro Technique',
    category: 'Productivity',
    tags: ['time-management', 'pomodoro', 'productivity', 'focus'],
    content: `<h2>Why Generic Advice Often Fails Developers</h2>
<p>Time management advice from productivity gurus is often designed for knowledge workers doing diverse tasks throughout the day. Software engineering is different: the most valuable work requires extended, uninterrupted concentration. Techniques that help a project manager often actively harm a developer's output.</p>
<h2>Batching Low-Intensity Tasks</h2>
<p>Email, Slack, code reviews, and administrative tasks have lower cognitive demands than creative problem-solving. Batching these at defined times — morning inbox, post-lunch code reviews, end-of-day admin — preserves morning peak hours for the hardest work.</p>
<h2>Energy, Not Just Time</h2>
<p>Time management is really energy management. Identify your peak cognitive hours (typically morning for most people) and protect them for your most demanding work. Schedule meetings, reviews, and communication for your lower-energy periods.</p>`,
  },
  {
    title: 'Automating Your Developer Workflow: Scripts and Tools That Save Hours',
    category: 'Productivity',
    tags: ['automation', 'scripts', 'cli', 'developer-tools', 'bash'],
    content: `<h2>The Automation ROI Calculation</h2>
<p>The classic XKCD comic shows the break-even time for automation: if a task takes 5 minutes and happens 5 times a day, you have 21 hours of automation budget over five years. Beyond the math, automation eliminates error-prone repetition and keeps you in flow by removing context-switching.</p>
<h2>Shell Aliases and Functions</h2>
<p>Your shell configuration file is your most-used piece of software. Invest in it. Aliases for frequent git operations, project navigation, and server management compound into significant time savings. Functions for multi-step operations — spinning up a dev environment, deploying to staging — deserve to be first-class tools.</p>
<h2>Git Hooks for Quality Gates</h2>
<p>Pre-commit hooks that run linters, formatters, and tests prevent entire categories of CI failures. Tools like Husky and lint-staged make this setup painless in JavaScript projects. The slight delay on commit pays for itself the first time it catches a bug before review.</p>`,
  },
  {
    title: 'The Art of Saying No: Protecting Your Time as a Developer',
    category: 'Productivity',
    tags: ['boundaries', 'communication', 'productivity', 'career'],
    content: `<h2>The Cost of Yes</h2>
<p>Every commitment you make forecloses other possibilities. Saying yes to one more meeting, one more project, one more "quick question" has cumulative costs that aren't visible at the moment of agreeing. The best developers are ruthless about their commitments precisely because they understand what focused work is worth.</p>
<h2>Saying No Professionally</h2>
<p>Effective professional "no" isn't refusal — it's redirection. "I can't take that on right now, but here's what I can do" preserves relationships while protecting your capacity. Understanding your actual priorities, written down, makes the calculus of new requests clear.</p>
<h2>Managing Interruptions</h2>
<p>Designate office hours for ad hoc questions. Batch Slack responses rather than responding instantly. Set your status to "focusing" during deep work blocks. These aren't unfriendly — they're how you do your best work consistently, which is the most valuable thing you can offer your team.</p>`,
  },
  {
    title: 'Building Healthy Coding Habits: Ergonomics and Wellbeing',
    category: 'Productivity',
    tags: ['ergonomics', 'health', 'developer-wellbeing', 'habits'],
    content: `<h2>The Physical Costs of Programming</h2>
<p>Software engineering is sedentary work conducted at a fixed posture for long periods. The cumulative toll — repetitive strain injuries, neck pain, eye strain, back problems — ends careers prematurely and reduces daily quality of life significantly. Prevention is dramatically cheaper than treatment.</p>
<h2>Ergonomic Foundations</h2>
<p>Monitor height at or slightly below eye level. Keyboard positioned so elbows are at 90 degrees. Chair adjusted so feet are flat on the floor. These basic adjustments eliminate the most common sources of pain. A standing desk that you'll actually use occasionally is more valuable than a perfect standing desk used once.</p>
<h2>The 20-20-20 Rule and Breaks</h2>
<p>For every 20 minutes of screen time, look at something 20 feet away for 20 seconds. Take a genuine break from your desk every 90 minutes. These habits sound simple and are widely ignored — the developers who maintain them late in their careers are the ones who still want to be writing code.</p>`,
  },

  // ── OPEN SOURCE ────────────────────────────────────────
  {
    title: 'Your First Open Source Contribution: A Step-by-Step Guide',
    category: 'Open Source',
    tags: ['open-source', 'github', 'contributing', 'beginner'],
    content: `<h2>Overcoming the Fear</h2>
<p>Contributing to open source feels intimidating. The codebases are unfamiliar, maintainers are strangers, and you worry your contribution isn't good enough. This fear is universal and mostly unfounded — the open-source community needs contributors at every level, and maintainers generally welcome well-intentioned beginners.</p>
<h2>Finding the Right Project</h2>
<p>Start with projects you use. Your familiarity with the tool means you can spot documentation gaps, reproduce bugs, and understand the codebase's intent. Projects tagged with "good first issue" or "help wanted" explicitly invite new contributors.</p>
<h2>Your First Contribution Doesn't Have to Be Code</h2>
<p>Documentation improvements, bug reports with clear reproduction steps, translations, and tests are all valuable contributions. Many maintainers will tell you that good documentation contributions are more impactful than new features.</p>
<h2>The Pull Request Process</h2>
<p>Fork the repository, create a descriptive branch, make focused changes (one issue per PR), write a clear PR description, and be patient. Reviews can take days or weeks for volunteer-maintained projects. Respond constructively to feedback and update your branch until it's merged.</p>`,
  },
  {
    title: 'Open Source Licensing: What Developers Must Know',
    category: 'Open Source',
    tags: ['licensing', 'open-source', 'legal', 'mit', 'gpl'],
    content: `<h2>Why Licensing Matters</h2>
<p>Every piece of code has a copyright holder, and every act of copying, modifying, or distributing that code is governed by copyright law. Open source licenses are legal instruments that grant permissions the law would otherwise withhold. Understanding which license a dependency uses is not optional for commercial software development.</p>
<h2>The Permissive Family</h2>
<p>MIT, Apache 2.0, and BSD licenses allow almost any use — including incorporating code into proprietary software — with minimal requirements (usually just attribution). These are generally compatible with commercial use and are the most widely used open source licenses.</p>
<h2>The Copyleft Family</h2>
<p>GPL and AGPL licenses require that derivative works also be released under the same license. This "share-alike" provision makes them incompatible with most proprietary software. AGPL extends GPL to cover network use — software delivered as a service must also release its source.</p>
<h2>Practical Guidance</h2>
<p>Audit your dependencies' licenses before commercial use. Tools like FOSSA, Snyk, and license-checker automate this. When creating a new project, MIT for maximum adoption, Apache 2.0 if you have patent concerns, GPL if you want to ensure derivatives stay open.</p>`,
  },
  {
    title: 'Maintaining an Open Source Project: The Unglamorous Work',
    category: 'Open Source',
    tags: ['maintainer', 'open-source', 'community', 'sustainability'],
    content: `<h2>The Iceberg of Maintainership</h2>
<p>The visible part of open source maintenance — reviewing pull requests, releasing new features — sits atop a vast iceberg of unseen work: triaging issues, responding to questions, keeping CI green, managing dependencies, communicating breaking changes, and writing documentation that nobody reads until they need it.</p>
<h2>Setting Healthy Expectations</h2>
<p>Write a CONTRIBUTING.md that sets explicit expectations about response time, contribution scope, and what kinds of changes you will and won't accept. A well-written contributor guide reduces both the volume of out-of-scope contributions and the awkwardness of rejecting them.</p>
<h2>Burnout Is Real</h2>
<p>Maintainer burnout is an open-source crisis. Popular projects generate an unending stream of issues, PRs, and questions from a community that often treats maintainers as free support staff. Sustainable open source requires either funding, co-maintainers, or clearly reduced expectations.</p>`,
  },
  {
    title: 'Git: Beyond the Basics — Advanced Workflows for Teams',
    category: 'Open Source',
    tags: ['git', 'github', 'workflow', 'version-control', 'advanced'],
    content: `<h2>Rebase vs Merge: The Eternal Debate</h2>
<p>Merge commits preserve history exactly as it happened — branches are visible in the graph. Rebasing creates a linear history that's easier to read and bisect. Neither is universally correct. For feature branches before merging to main: rebase. For integrating main into a long-lived release branch: merge. Consistency within a team matters more than which you choose.</p>
<h2>Interactive Rebase for Clean History</h2>
<p>git rebase -i allows you to rewrite local history before pushing: squash experimental commits, reword messages, split commits that do too much. The result is a commit history that reads like intentional documentation rather than a stream of consciousness.</p>
<h2>Git Bisect for Debugging</h2>
<p>git bisect performs a binary search through commit history to find the commit that introduced a bug. Given a known good commit and a bad commit, it can identify the culprit in log2(n) steps — often finding a bug introduction in minutes that manual inspection would take hours.</p>`,
  },
  {
    title: 'The Economics of Open Source: Who Pays and Why',
    category: 'Open Source',
    tags: ['open-source', 'sustainability', 'funding', 'economics'],
    content: `<h2>The Free-Rider Problem</h2>
<p>Open source software is a public good: anyone can use it without depleting it, and exclusion is difficult. This creates a classic free-rider problem. Thousands of companies build on open-source foundations that are maintained by a handful of volunteers working in their spare time — often on infrastructure that, if it failed, would cost the industry billions.</p>
<h2>Models That Work</h2>
<p>Several funding models have emerged: open-core (free community edition, paid enterprise tier), SaaS (sell hosting and operations), dual licensing (commercial license for proprietary use), foundations (Linux Foundation, Apache), grants (NLnet, GitHub Sponsors, Open Collective), and direct company hiring of maintainers (Google, Microsoft, Red Hat).</p>
<h2>What You Can Do</h2>
<p>Sponsor projects you depend on through GitHub Sponsors or Open Collective. Advocate within your company to pay for open-source dependencies. Contribute back when you fix a bug in a dependency. The sustainability of the ecosystem that all software depends on is a collective responsibility.</p>`,
  },

  // ── DEVOPS & CLOUD ─────────────────────────────────────
  {
    title: 'Docker for Developers: From Zero to Production',
    category: 'DevOps & Cloud',
    tags: ['docker', 'containers', 'devops', 'deployment'],
    content: `<h2>The Problem Docker Solves</h2>
<p>"It works on my machine" is perhaps the most maddening sentence in collaborative software development. Differences in operating system, installed libraries, environment variables, and runtime versions cause behaviour that's impossible to reproduce and debug. Docker eliminates this class of problem entirely.</p>
<h2>Core Concepts</h2>
<p>Images are immutable snapshots of a filesystem — your application and all its dependencies, frozen. Containers are running instances of images — isolated processes with their own filesystem, network, and process space. Dockerfiles are the reproducible instructions for building images.</p>
<h2>Docker Compose for Local Development</h2>
<p>Docker Compose orchestrates multi-container applications with a single YAML file. Define your application, database, cache, and any other services, and bring the entire stack up with docker compose up. Every developer gets an identical environment.</p>
<h2>Production Considerations</h2>
<p>Production containers need security hardening: run as non-root, use read-only filesystems where possible, scan images for vulnerabilities, and keep base images minimal. Distroless and Alpine base images dramatically reduce attack surface.</p>`,
  },
  {
    title: 'Kubernetes: The Orchestration Platform That Ate the World',
    category: 'DevOps & Cloud',
    tags: ['kubernetes', 'k8s', 'container-orchestration', 'cloud'],
    content: `<h2>Why Kubernetes Won</h2>
<p>Kubernetes emerged from Google's internal Borg system to become the de facto standard for container orchestration. Its declarative configuration model — you describe the desired state, Kubernetes handles the reconciliation — proved compelling enough to defeat early competitors like Docker Swarm and Mesos.</p>
<h2>Core Abstractions</h2>
<p>Pods are the smallest deployable unit — typically one container with tightly coupled helpers. Deployments manage ReplicaSets to ensure a specified number of pod replicas run at all times. Services provide stable network endpoints for pods that may be rescheduled across nodes. Ingress exposes HTTP/HTTPS routes from outside the cluster.</p>
<h2>The Operational Complexity Reality</h2>
<p>Kubernetes is powerful and genuinely complex. Self-managed Kubernetes clusters are significant operational burden. For most teams, managed services (EKS, GKE, AKS) are the right choice — offloading control-plane management while retaining the orchestration benefits. For small applications, Kubernetes may be overkill entirely.</p>`,
  },
  {
    title: 'CI/CD Pipelines: Building Software That Deploys Itself',
    category: 'DevOps & Cloud',
    tags: ['ci-cd', 'github-actions', 'deployment', 'automation', 'devops'],
    content: `<h2>The Case for Continuous Delivery</h2>
<p>Teams that deploy frequently — multiple times per day — have lower failure rates and faster recovery times than teams that release quarterly. This counterintuitive finding (from the DORA research programme) reflects a fundamental insight: smaller changes are easier to test, review, and roll back.</p>
<h2>The Pipeline Structure</h2>
<p>A well-designed CI/CD pipeline runs automatically on every commit: install dependencies, run unit tests, run integration tests, build artifacts, run security scans, and (for main branch) deploy to staging. Only commits that pass every stage reach production. This is the "pipeline as a quality gate" model.</p>
<h2>GitHub Actions</h2>
<p>GitHub Actions has become the default CI/CD platform for open-source and many private projects. Its integration with GitHub events, marketplace of pre-built actions, and generous free tier make it an excellent starting point. The YAML DSL is expressive enough for sophisticated pipelines without dedicated CI infrastructure.</p>`,
  },
  {
    title: 'Infrastructure as Code: Terraform, Pulumi, and the Declarative Future',
    category: 'DevOps & Cloud',
    tags: ['iac', 'terraform', 'pulumi', 'cloud', 'devops'],
    content: `<h2>Why Click-Ops Is Unsustainable</h2>
<p>Manually configuring cloud infrastructure through web consoles is ungovernable at scale. Configuration drift — resources that diverge from their intended state through ad hoc changes — is inevitable. Disaster recovery becomes guesswork. Infrastructure as Code treats your cloud environment as software: version-controlled, testable, and reproducible.</p>
<h2>Terraform: The HCL Approach</h2>
<p>HashiCorp's Terraform uses its own declarative language (HCL) to describe infrastructure. You declare the desired state; Terraform calculates the plan required to reach it and applies it. The state file tracks what Terraform has created, enabling subsequent runs to identify what's changed.</p>
<h2>Pulumi: Infrastructure in Your Language</h2>
<p>Pulumi takes a different approach: write your infrastructure in TypeScript, Python, Go, or C#. This enables real programming constructs — loops, conditionals, functions — and integrates with existing test frameworks. For teams already proficient in these languages, the productivity gain is significant.</p>`,
  },
  {
    title: 'Observability: Logs, Metrics, and Traces',
    category: 'DevOps & Cloud',
    tags: ['observability', 'monitoring', 'logging', 'tracing', 'opentelemetry'],
    content: `<h2>The Three Pillars</h2>
<p>Observability — the ability to understand your system's internal state from its external outputs — rests on three interconnected data types: logs (time-stamped records of discrete events), metrics (numeric measurements aggregated over time), and traces (records of request journeys through distributed systems).</p>
<h2>Structured Logging</h2>
<p>Human-readable log messages are for humans; machines need structured data. JSON logs with consistent fields (timestamp, severity, service name, trace ID, request ID) are queryable, filterable, and parseable by log aggregation platforms like Datadog, Splunk, and the Elastic Stack.</p>
<h2>OpenTelemetry: The Standard</h2>
<p>OpenTelemetry has emerged as the vendor-neutral standard for instrumentation. Instrument your code once with the OTel SDK, then route telemetry to any compatible backend — Jaeger, Tempo, Prometheus, Datadog — without re-instrumentation. This vendor independence is particularly valuable as your observability stack evolves.</p>`,
  },
  {
    title: 'Zero-Downtime Deployments: Blue-Green, Canary, and Rolling Releases',
    category: 'DevOps & Cloud',
    tags: ['deployment', 'blue-green', 'canary', 'zero-downtime', 'devops'],
    content: `<h2>Why Deployment Strategy Matters</h2>
<p>How you deploy software determines your risk profile. A naive "stop the old version, start the new one" approach creates downtime and means a bad deployment affects all users simultaneously. Sophisticated deployment strategies allow gradual rollouts with the ability to abort at any point.</p>
<h2>Blue-Green Deployments</h2>
<p>Blue-green deployments maintain two identical production environments. Traffic points to blue (current production). Deploy the new version to green, test it, then switch traffic. Rollback is instant: switch traffic back to blue. The cost is doubled infrastructure during the transition period.</p>
<h2>Canary Releases</h2>
<p>Named after the coal mine canary, canary deployments route a small percentage of traffic to the new version initially — 1%, then 5%, then 25%, then 100% — with automatic rollback if error rates or latency metrics degrade. This is the most risk-controlled deployment strategy for high-traffic services.</p>`,
  },

  // ── MORE MIXED TOPICS ───────────────────────────────────
  {
    title: 'The SOLID Principles: Writing Code That Lasts',
    category: 'Web Development',
    tags: ['solid', 'oop', 'software-design', 'clean-code'],
    content: `<h2>Single Responsibility Principle</h2>
<p>A class should have one, and only one, reason to change. This doesn't mean a class can only do one thing — it means all the things it does should be so cohesive that they'd all change for the same reason. Classes that violate this principle become entangled; changes to one concern break another.</p>
<h2>Open-Closed Principle</h2>
<p>Software entities should be open for extension but closed for modification. You should be able to add new behaviour without changing existing, tested code. Strategy pattern, composition, and dependency injection are common implementations of this principle.</p>
<h2>Liskov Substitution Principle</h2>
<p>Subtypes must be substitutable for their base types without altering the correctness of the program. If your code handles a Shape, it should work correctly whether it receives a Circle or a Rectangle without needing to check which one it is.</p>
<h2>Interface Segregation & Dependency Inversion</h2>
<p>Clients shouldn't depend on interfaces they don't use — break large interfaces into focused ones. High-level modules shouldn't depend on low-level modules — both should depend on abstractions. Together, these principles guide toward modular, testable architectures.</p>`,
  },
  {
    title: 'Clean Code: Principles Every Developer Should Know',
    category: 'Web Development',
    tags: ['clean-code', 'best-practices', 'naming', 'functions'],
    content: `<h2>Code Is Read More Than Written</h2>
<p>The primary audience for code is not the computer — it's the next developer who needs to understand, modify, and debug it. Often that developer is you, six months from now. Writing clean code is fundamentally an act of communication.</p>
<h2>Meaningful Naming</h2>
<p>Names are the single most impactful readability factor. A function named processData tells you nothing. A function named calculateMonthlyRevenueTax tells you everything. Choose names that reveal intent, avoid abbreviations, and don't shy from length when it adds clarity.</p>
<h2>Functions Should Do One Thing</h2>
<p>A function that is too large to read without scrolling is doing too much. Functions should be small, do one thing, and do it well. If you find yourself writing a comment to explain a block within a function, that block deserves its own function with a descriptive name.</p>`,
  },
  {
    title: 'Testing Strategies: Unit, Integration, and End-to-End',
    category: 'Web Development',
    tags: ['testing', 'unit-tests', 'e2e', 'jest', 'cypress'],
    content: `<h2>The Testing Pyramid</h2>
<p>The testing pyramid model suggests that a healthy test suite has many unit tests, fewer integration tests, and even fewer end-to-end tests. Unit tests are fast, cheap to write, and pinpoint failures precisely. End-to-end tests are slow, brittle, and expensive but verify that the whole system works together.</p>
<h2>What Each Layer Tests</h2>
<p>Unit tests verify individual functions and classes in isolation, with dependencies mocked. Integration tests verify that components work together — an API endpoint talking to a real database, for example. End-to-end tests simulate real user interactions in a browser, verifying the entire stack.</p>
<h2>Test-Driven Development</h2>
<p>TDD inverts the typical development cycle: write a failing test, write the minimum code to pass it, refactor. The discipline forces you to think about design before implementation, produces naturally testable code, and gives you confidence to refactor without fear.</p>`,
  },
  {
    title: 'Database Design Fundamentals: From Relational to NoSQL',
    category: 'Web Development',
    tags: ['database', 'sql', 'nosql', 'mongodb', 'postgresql'],
    content: `<h2>Relational Databases: When to Choose SQL</h2>
<p>Relational databases excel when data has well-defined relationships, when you need ACID transactions across multiple tables, and when your query patterns are flexible and ad hoc. PostgreSQL, in particular, has become remarkably capable — supporting JSON, full-text search, and advanced analytics.</p>
<h2>NoSQL: When the Relational Model Breaks Down</h2>
<p>Document databases (MongoDB), key-value stores (Redis), column-family stores (Cassandra), and graph databases (Neo4j) each optimise for different access patterns. MongoDB's document model is natural for hierarchical data with flexible schemas. Redis is unmatched for caching and real-time leaderboards.</p>
<h2>The CAP Theorem in Practice</h2>
<p>The CAP theorem states that distributed databases can provide at most two of: Consistency (every read receives the most recent write), Availability (every request receives a response), and Partition tolerance (the system works despite network partitions). Most distributed systems choose AP or CP based on their use case's tolerance for stale reads vs failures.</p>`,
  },
  {
    title: 'API Security Best Practices Every Developer Should Follow',
    category: 'Technology',
    tags: ['security', 'api', 'authentication', 'authorization', 'jwt'],
    content: `<h2>Authentication vs Authorization</h2>
<p>Authentication (who are you?) and Authorization (what are you allowed to do?) are distinct problems often conflated. Authentication verifies identity — typically through passwords, tokens, or certificates. Authorization enforces access control — determining which resources and operations a verified identity can access.</p>
<h2>JWT Best Practices</h2>
<p>JWTs are widely used but frequently misused. Use short expiry times and refresh tokens rather than long-lived tokens. Always verify the signature on the server — never trust client-decoded claims. Store tokens in httpOnly cookies rather than localStorage to prevent XSS attacks from stealing them.</p>
<h2>Common API Vulnerabilities</h2>
<ul><li><strong>IDOR:</strong> Always verify that the authenticated user owns the resource they're requesting.</li><li><strong>Mass assignment:</strong> Explicitly whitelist allowed fields; never blindly apply user input to database objects.</li><li><strong>Rate limiting:</strong> Protect authentication endpoints from brute force with aggressive rate limits.</li><li><strong>CORS misconfiguration:</strong> Never use wildcard origins in production APIs that use cookies.</li></ul>`,
  },
  {
    title: 'Performance Optimization: Making Your Web App Blazing Fast',
    category: 'Web Development',
    tags: ['performance', 'web-vitals', 'optimization', 'frontend'],
    content: `<h2>Core Web Vitals</h2>
<p>Google's Core Web Vitals — Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), and Interaction to Next Paint (INP) — are the current standard performance metrics. They're also ranking factors, giving performance optimization a direct business case beyond user experience.</p>
<h2>The Critical Rendering Path</h2>
<p>The browser renders pages by building the DOM from HTML, the CSSOM from CSS, combining them into a render tree, laying it out, and painting pixels. Anything that blocks this process — parser-blocking scripts, large CSS files — delays when users see content. Optimise the critical path by deferring non-essential resources.</p>
<h2>JavaScript Performance</h2>
<p>JavaScript is the most expensive resource per byte — parsing, compilation, and execution cost more than equivalent bytes of images or CSS. Reduce bundle sizes through code splitting, tree shaking, and lazy loading. Profile before optimising; most performance problems are in 10% of the code.</p>`,
  },
  {
    title: 'Microservices vs Monoliths: The Architecture Decision',
    category: 'DevOps & Cloud',
    tags: ['microservices', 'monolith', 'architecture', 'system-design'],
    content: `<h2>The Monolith Is Not Dead</h2>
<p>Monolithic architectures have been unfashionably derided for years. But the monolith's advantages are real: a single deployment artifact, a single development environment, transactions that span the full domain, and dramatically lower operational complexity. For most early-stage applications, a well-structured monolith is the correct choice.</p>
<h2>When Microservices Make Sense</h2>
<p>Microservices earn their complexity when: teams need to deploy services independently, different services have different scaling requirements, technology stack diversity is genuinely necessary, or the organisational structure (Conway's Law) makes independent team ownership desirable.</p>
<h2>The Migration Path</h2>
<p>The most common anti-pattern is beginning with microservices before you understand your domain. The strangler fig pattern offers a safer migration: extract services from a monolith incrementally, routing traffic to new services while the monolith handles the rest. This avoids big-bang rewrites and allows learning.</p>`,
  },
  {
    title: 'Real-Time Web: WebSockets, Server-Sent Events, and Long Polling',
    category: 'Web Development',
    tags: ['websockets', 'sse', 'real-time', 'streaming'],
    content: `<h2>The Real-Time Spectrum</h2>
<p>Real-time web features range from live chat and multiplayer gaming to live dashboards and collaborative editing. Different use cases have different requirements for latency, directionality, and connection persistence — making the right choice of technology non-trivial.</p>
<h2>WebSockets</h2>
<p>WebSockets establish a persistent, full-duplex connection between client and server. Both parties can send messages at any time. They're ideal for applications requiring low-latency bidirectional communication: multiplayer games, collaborative tools, and trading platforms.</p>
<h2>Server-Sent Events (SSE)</h2>
<p>SSE is an underused native browser API for one-directional server-to-client streaming over a regular HTTP connection. It supports automatic reconnection, event IDs, and retry logic. For use cases where only the server needs to push data — live feeds, progress updates, notifications — SSE is simpler than WebSockets and traverses proxies more reliably.</p>`,
  },
  {
    title: 'MongoDB: Schema Design Patterns for the Real World',
    category: 'Web Development',
    tags: ['mongodb', 'nosql', 'schema-design', 'database'],
    content: `<h2>Embedding vs Referencing</h2>
<p>MongoDB's document model allows embedding related data in a single document or referencing it by ID — analogous to denormalisation vs normalisation in relational databases. The right choice depends on your access patterns: embed data that's always accessed together; reference data that changes independently or grows unboundedly.</p>
<h2>The One-to-Many Problem</h2>
<p>For one-to-many relationships, MongoDB offers three approaches: embed the many (for small, bounded sets like product variants), reference from many to one (embed parent ID in child documents), or reference from one to many (embed child IDs in parent). Choosing correctly prevents unbounded document growth and query inefficiency.</p>
<h2>Aggregation Pipelines</h2>
<p>MongoDB's aggregation framework is a powerful data transformation tool. Pipelines compose stages — $match, $group, $lookup, $project, $sort — to express complex analytical queries. Understanding the aggregation framework transforms MongoDB from a simple document store into a capable analytical platform.</p>`,
  },
  {
    title: 'Authentication in 2025: Passkeys, OAuth, and the Passwordless Future',
    category: 'Technology',
    tags: ['authentication', 'passkeys', 'oauth', 'security', 'webauthn'],
    content: `<h2>The Problem With Passwords</h2>
<p>Passwords are the weakest link in most authentication systems. They're reused across services, stolen in breaches, guessed by brute force, and phished trivially. Despite decades of "use a password manager" advice, the average person reuses passwords across an alarming number of sites.</p>
<h2>Passkeys: The FIDO2 Promise</h2>
<p>Passkeys replace passwords with cryptographic key pairs. The private key never leaves the device; the server only stores the public key. Authentication proves possession of the private key through a local biometric check. Passkeys are phishing-resistant by design — they're bound to the exact domain they were created for.</p>
<h2>OAuth 2.0 and the Delegation Model</h2>
<p>OAuth 2.0 isn't an authentication protocol — it's an authorisation framework that enables "sign in with Google/GitHub/Apple." OpenID Connect adds an identity layer on top. Understanding the distinction between the access token (authorisation) and the ID token (authentication) is fundamental to implementing OAuth securely.</p>`,
  },
  {
    title: 'The Future of Programming Languages: What Comes After Python and JavaScript?',
    category: 'Technology',
    tags: ['programming-languages', 'rust', 'go', 'zig', 'future'],
    content: `<h2>The Current Landscape</h2>
<p>JavaScript and Python dominate by developer count. Java and C# hold the enterprise. C and C++ remain essential for systems programming. But the next decade of language evolution is being shaped by forces that none of these languages were designed to handle elegantly.</p>
<h2>Rust: Memory Safety Without a Garbage Collector</h2>
<p>Rust's ownership system eliminates entire classes of memory safety bugs at compile time — without runtime garbage collection overhead. The learning curve is steep, but the result is software that's both safe and performant. System programming, embedded devices, and WebAssembly are natural homes for Rust.</p>
<h2>Go: Simplicity at Scale</h2>
<p>Go was designed for large teams building distributed systems. Its static typing, fast compilation, excellent concurrency primitives (goroutines and channels), and deliberate simplicity make it highly productive for backend services. Kubernetes, Docker, and much of cloud infrastructure is written in Go.</p>
<h2>The Convergence Thesis</h2>
<p>Languages are increasingly borrowing from each other. Python gains type hints. JavaScript gains types (TypeScript). Java gains pattern matching. The boundaries between paradigms are blurring — the future may be less about picking a language and more about which features a language brings to a particular problem domain.</p>`,
  },
  {
    title: 'Mastering the Command Line: Tools Every Developer Needs',
    category: 'Productivity',
    tags: ['cli', 'terminal', 'bash', 'zsh', 'tools'],
    content: `<h2>Why the Terminal Still Matters</h2>
<p>Despite decades of advancing graphical interfaces, the terminal remains the most efficient environment for many developer tasks. It's composable — tools pipe into tools — scriptable, and consistent across remote servers where no GUI exists. Investment in terminal skills pays dividends throughout a career.</p>
<h2>Essential Tools</h2>
<ul><li><strong>fzf:</strong> Fuzzy finder that transforms any list (files, git history, processes) into an interactive search.</li><li><strong>ripgrep:</strong> Faster than grep, respects .gitignore, and works recursively by default.</li><li><strong>bat:</strong> cat with syntax highlighting and git integration.</li><li><strong>delta:</strong> Beautiful git diff output with syntax highlighting.</li><li><strong>zoxide:</strong> Smart cd replacement that learns your most-visited directories.</li></ul>
<h2>Shell Configuration</h2>
<p>Invest in your shell configuration (zsh + Oh My Zsh or Fish shell). A well-tuned prompt showing git status, current directory, and last exit code reduces cognitive load throughout the day. Plugins for autosuggestions and syntax highlighting compound these gains.</p>`,
  },
  {
    title: 'Debugging Like a Pro: Techniques Beyond console.log',
    category: 'Web Development',
    tags: ['debugging', 'devtools', 'debugging-techniques', 'problem-solving'],
    content: `<h2>The Debugging Mindset</h2>
<p>Expert debugging is a systematic discipline, not an art form. It begins with a precise description of the bug — what you expected versus what you observed. Without this, you're not debugging; you're wandering. Next: form a hypothesis. What mechanism could produce the observed behaviour? Then: test the hypothesis with the minimum experiment.</p>
<h2>Browser DevTools Deep Dive</h2>
<p>Most developers use 10% of browser DevTools. The debugger's step-through capabilities, conditional breakpoints, and logpoints (log without modifying code) are underutilised. The Network panel's throttling and offline mode simulate real-world conditions. The Performance panel records flame graphs that reveal exactly where time is spent.</p>
<h2>Rubber Duck Debugging</h2>
<p>The act of explaining a bug to someone else — including an inanimate rubber duck — forces the precise articulation that surface assumptions and gaps. Pair programming catches bugs faster not primarily because two people see more, but because you can't skip steps when explaining to a partner.</p>`,
  },
  {
    title: 'GraphQL Federation: Scaling Your API Across Teams',
    category: 'Web Development',
    tags: ['graphql', 'federation', 'api', 'microservices', 'architecture'],
    content: `<h2>The Single Schema Problem</h2>
<p>As organisations grow, a single monolithic GraphQL schema maintained by one team becomes a bottleneck. Every new field requires coordination with the schema owners. Schema changes block multiple teams waiting for a release. GraphQL Federation solves this by allowing multiple teams to own their subgraph while composing into a unified supergraph.</p>
<h2>How Federation Works</h2>
<p>Each subgraph is an independent GraphQL service that owns a portion of the overall type system. The Apollo Router (or Federation-compatible gateway) composes these into a single schema and intelligently routes queries to the appropriate subgraphs, joining results automatically.</p>
<h2>Entity References Across Subgraphs</h2>
<p>The key primitive in Federation is the entity: a type that can be referenced and extended across subgraphs. The User entity might be defined in the accounts subgraph but extended with order history fields by the commerce subgraph — without any dependency between those teams.</p>`,
  },
  {
    title: 'System Design Interview Guide: How to Approach Any Question',
    category: 'Career & Growth',
    tags: ['system-design', 'interviews', 'architecture', 'career'],
    content: `<h2>The Framework</h2>
<p>System design interviews are open-ended by design — there's rarely one correct answer. What interviewers evaluate is your structured thinking, your ability to navigate tradeoffs, and your communication. A framework helps: Requirements → High-Level Design → Deep Dive → Scalability.</p>
<h2>Requirements First</h2>
<p>Before drawing a single box, clarify requirements. Functional requirements: what does the system do? Non-functional requirements: scale (QPS, storage), latency requirements, availability SLA, consistency requirements. These numbers drive every subsequent decision.</p>
<h2>Common Building Blocks</h2>
<p>Master these patterns: Load balancers and their algorithms. Database sharding and replication. Caching layers (CDN, read-through, write-through). Message queues for async decoupling. Consistent hashing for distributed caching. Rate limiting algorithms. These appear in virtually every design question.</p>
<h2>The Tradeoff Narrative</h2>
<p>Every architectural decision is a tradeoff. SQL vs NoSQL, synchronous vs asynchronous, normalised vs denormalised. Don't just state what you'd choose — explain what you gain, what you give up, and under what conditions you'd make a different choice. This reasoning is what interviewers actually evaluate.</p>`,
  },
  {
    title: 'Serverless Computing: The Good, the Bad, and the Cold Start',
    category: 'DevOps & Cloud',
    tags: ['serverless', 'lambda', 'faas', 'cloud', 'aws'],
    content: `<h2>The Serverless Promise</h2>
<p>Serverless computing — Functions as a Service in its purest form — offers a compelling value proposition: write functions, not servers. No provisioning, no capacity planning, automatic scaling, and pricing that scales to zero when traffic stops. For the right use cases, this dramatically reduces operational overhead.</p>
<h2>The Cold Start Reality</h2>
<p>Serverless functions that haven't received traffic recently must initialise before handling requests — the "cold start." This latency varies from milliseconds to seconds depending on the runtime, function size, and cloud provider. For user-facing applications with latency requirements, cold starts are a genuine constraint.</p>
<h2>When Serverless Shines</h2>
<p>Event-driven workloads — image processing triggered by S3 uploads, webhook handlers, scheduled batch jobs — are natural fits for serverless. Traffic patterns with significant peaks and troughs benefit from the pay-per-invocation model. APIs with moderate latency requirements and unpredictable scale are also strong candidates.</p>`,
  },
  {
    title: 'Building a REST API with Node.js and Express: Best Practices',
    category: 'Web Development',
    tags: ['nodejs', 'express', 'rest-api', 'backend', 'javascript'],
    content: `<h2>Project Structure</h2>
<p>A maintainable Express API organises code by feature, not by type. Rather than a single routes.js file containing all routes, group related routes, controllers, and models together: /users (routes + controller + model), /posts (routes + controller + model). This structure scales with the application's complexity.</p>
<h2>Middleware Architecture</h2>
<p>Express middleware is the heart of request processing. Design middleware to be single-purpose and composable. Authentication middleware, request logging, rate limiting, error handling, and input validation should each live in dedicated, testable functions. The order of middleware registration matters — understand it explicitly.</p>
<h2>Error Handling</h2>
<p>Centralised error handling through an Express error middleware (four-argument function: err, req, res, next) produces consistent error responses. Create a custom ApiError class that carries HTTP status codes, enabling a single error handler to translate domain errors into appropriate HTTP responses.</p>`,
  },
  {
    title: 'Machine Learning in Production: What They Don\'t Teach You',
    category: 'AI & Machine Learning',
    tags: ['mlops', 'production', 'machine-learning', 'deployment'],
    content: `<h2>The Training-Serving Skew</h2>
<p>Models that perform beautifully in development often degrade mysteriously in production. The culprit is almost always training-serving skew: differences between the data distribution during training and the data encountered at inference time. Monitoring for this skew — and retraining when detected — is the core of MLOps.</p>
<h2>Feature Stores</h2>
<p>Features used during training must be exactly reproducible at serving time. Feature stores solve this by centralising feature computation, storage, and serving. They prevent training-serving skew by ensuring the same feature values are used in both contexts.</p>
<h2>Model Monitoring</h2>
<p>Traditional software monitoring tracks latency and error rates. ML models also need data drift detection, concept drift detection, and output distribution monitoring. A model that's still responding quickly may be producing nonsense — conventional monitoring won't catch it.</p>`,
  },
  {
    title: 'State Management in React: Context, Redux, Zustand, and Beyond',
    category: 'Web Development',
    tags: ['react', 'state-management', 'redux', 'zustand', 'context'],
    content: `<h2>The State Management Problem</h2>
<p>As React applications grow, state that needs to be shared across distant components becomes cumbersome to manage through prop drilling. State management libraries and patterns solve this by providing a centralised store accessible from any component.</p>
<h2>When to Reach for External State Management</h2>
<p>React's built-in state (useState, useReducer) and context API handle the majority of use cases. External state management earns its complexity when: state is deeply shared across many unrelated components, state updates trigger complex cascading changes, or debugging state changes is difficult without dedicated tooling.</p>
<h2>Redux Toolkit vs Zustand</h2>
<p>Redux Toolkit has eliminated most of Redux's historical boilerplate — actions, reducers, and slices are dramatically more concise. Zustand offers an even simpler API for cases where Redux's structured approach feels heavyweight. Both support React DevTools integration and middleware.</p>`,
  },
  {
    title: 'Web Security Fundamentals: XSS, CSRF, and SQL Injection',
    category: 'Technology',
    tags: ['security', 'xss', 'csrf', 'sql-injection', 'web-security'],
    content: `<h2>Cross-Site Scripting (XSS)</h2>
<p>XSS occurs when attacker-controlled input is rendered as HTML in the victim's browser, executing malicious scripts. Prevention: always escape user input before rendering, use Content Security Policy headers, prefer textContent over innerHTML for dynamic content.</p>
<h2>Cross-Site Request Forgery (CSRF)</h2>
<p>CSRF tricks authenticated users into making unintended requests to your application. A malicious page can cause the victim's browser to send requests to your API with their valid session cookies. Prevention: use CSRF tokens for state-changing operations, verify Origin/Referer headers, use SameSite cookie attributes.</p>
<h2>SQL Injection</h2>
<p>SQL injection occurs when user input is interpolated directly into SQL queries, allowing attackers to manipulate query logic. Prevention is simple and non-negotiable: always use parameterised queries or prepared statements. Never concatenate user input into SQL strings.</p>`,
  },
  {
    title: 'How to Write Technical Documentation That People Actually Read',
    category: 'Career & Growth',
    tags: ['documentation', 'technical-writing', 'communication', 'developer-experience'],
    content: `<h2>Why Most Documentation Fails</h2>
<p>Most technical documentation is written by experts for experts — packed with assumptions that novices can't fill, missing the context that makes information actionable. It's often written in a burst during project completion and never updated. Users encounter it when confused, making legibility even more critical.</p>
<h2>The Documentation Types</h2>
<p>Divio's documentation system distinguishes four types: tutorials (learning-oriented, hands-on), how-to guides (goal-oriented, problem-solving), reference (information-oriented, precise), and explanation (understanding-oriented, conceptual). Mixing these types in a single document produces confusion.</p>
<h2>Writing for the Reader</h2>
<p>Write the documentation you wish you had when you first encountered the system. What questions did you have? What would have saved you hours? What would have explained the "why" behind confusing design decisions? This framing consistently produces more useful documentation than writing from the expert's perspective.</p>`,
  },
  {
    title: 'Caching Strategies: From Browser to Database',
    category: 'DevOps & Cloud',
    tags: ['caching', 'redis', 'cdn', 'performance', 'architecture'],
    content: `<h2>The Caching Spectrum</h2>
<p>Caching exists at every layer of the modern web stack: browser caches reduce network requests, CDNs cache content at the edge, application-level caches (Redis, Memcached) reduce database load, and databases themselves cache query results and pages in memory. Understanding each layer and its appropriate use is essential for performance engineering.</p>
<h2>Cache Invalidation: The Hard Problem</h2>
<p>The famous joke: "There are only two hard things in computer science: cache invalidation and naming things." Stale caches serve incorrect data; over-aggressive invalidation eliminates performance benefits. Time-based expiration (TTL), event-driven invalidation, and cache-aside patterns each make different tradeoffs.</p>
<h2>Redis Patterns</h2>
<p>Redis is more than a cache. Its data structures — lists, sets, sorted sets, hashes, streams — enable patterns like rate limiting, session storage, pub/sub messaging, leaderboards, and job queues. Understanding which data structure fits which problem unlocks Redis's full potential.</p>`,
  },
  {
    title: 'Async JavaScript: Callbacks, Promises, and Async/Await',
    category: 'Web Development',
    tags: ['javascript', 'async', 'promises', 'async-await', 'event-loop'],
    content: `<h2>The Event Loop</h2>
<p>JavaScript is single-threaded — it can only execute one piece of code at a time. The event loop is the mechanism that enables concurrent-feeling behaviour: synchronous code runs to completion, then the event loop checks the callback queue for I/O completions, timer firings, and other async results.</p>
<h2>Promise Composition</h2>
<p>Promises represent eventual values. Promise.all() runs multiple promises concurrently and resolves when all complete. Promise.allSettled() resolves regardless of rejection. Promise.race() resolves with the first settled promise. Promise.any() resolves with the first fulfilled promise. Choosing the right combinator dramatically affects error handling behaviour.</p>
<h2>Async/Await Pitfalls</h2>
<p>Async/await is syntactic sugar over promises — it doesn't change the execution model. Common pitfalls: awaiting in a loop (sequential when concurrent would be faster), forgetting error handling (unhandled rejection warnings), and treating async functions as synchronous at call sites.</p>`,
  },
  {
    title: 'Scaling PostgreSQL: Partitioning, Indexing, and Query Optimization',
    category: 'DevOps & Cloud',
    tags: ['postgresql', 'database', 'scaling', 'performance', 'sql'],
    content: `<h2>Query Optimization Starts With EXPLAIN</h2>
<p>EXPLAIN ANALYZE is PostgreSQL's window into query execution. It shows the query plan — the sequence of operations the planner will execute — along with actual row counts and timings. Identifying sequential scans on large tables, inefficient join strategies, and missing index usage begins here.</p>
<h2>Index Design</h2>
<p>Indexes are among the most powerful performance tools in relational databases. B-tree indexes suit equality and range queries. GIN indexes excel for full-text search and JSONB containment. Partial indexes index only rows meeting a condition, dramatically reducing size for filtered queries. Composite indexes serve multi-column WHERE clauses but must match the query's column ordering.</p>
<h2>Table Partitioning</h2>
<p>PostgreSQL's declarative partitioning splits large tables across physical storage — typically by date range for time-series data or by list values for categorical data. Partition pruning allows queries targeting specific partitions to skip the rest entirely, providing dramatic performance improvements for large tables.</p>`,
  },
  {
    title: 'The Mobile-First Design Philosophy',
    category: 'Design',
    tags: ['mobile-first', 'responsive-design', 'ux', 'css'],
    content: `<h2>Why Mobile-First Is Not Just a Trend</h2>
<p>Over 60% of global web traffic now originates from mobile devices. In emerging markets, mobile is often the primary — or only — internet access point. Designing for mobile first is not a philosophical preference; it's an acknowledgement of how people actually use the web.</p>
<h2>The Technical Approach</h2>
<p>Mobile-first CSS begins with styles for the smallest viewport and progressively enhances for larger ones using min-width media queries. This contrasts with the historical desktop-first approach that used max-width queries to strip away features for smaller screens. The result is leaner CSS that downloads faster on the connections that need it most.</p>
<h2>Design Constraints as Creative Constraints</h2>
<p>The constraints of mobile — limited screen space, touch interaction, variable network conditions — force design discipline. Features that survive mobile-first design tend to be genuinely essential. The desktop experience benefits from this focus: it's a richer version of a coherent core, not a kitchen-sink accumulation.</p>`,
  },
  {
    title: 'How to Review Pull Requests Efficiently',
    category: 'Career & Growth',
    tags: ['code-review', 'pull-requests', 'team', 'engineering'],
    content: `<h2>The Goal of a Code Review</h2>
<p>Code review serves multiple functions simultaneously: catching bugs, sharing knowledge, maintaining code quality standards, and onboarding new team members to existing patterns. Reviews that focus exclusively on bug-finding miss most of their value.</p>
<h2>Reviewing Efficiently</h2>
<p>Read the PR description before looking at the diff. Understand what the change is trying to accomplish. Review large PRs asynchronously — don't try to hold the entire diff in your head at once. Look at tests first to understand the intended behaviour before examining the implementation.</p>
<h2>The Nit: Use It Sparingly</h2>
<p>Prefix minor style comments with "nit:" to signal they're not blocking. A review dominated by nits drowns out actually important concerns and demoralises authors. Agree on a style guide and let automated tools enforce it, reserving human review for substantive concerns.</p>`,
  },
  {
    title: 'An Introduction to Functional Programming Concepts',
    category: 'Web Development',
    tags: ['functional-programming', 'fp', 'pure-functions', 'immutability'],
    content: `<h2>What Is Functional Programming?</h2>
<p>Functional programming is a programming paradigm that treats computation as the evaluation of mathematical functions, avoiding mutable state and side effects. Rather than telling the computer how to do something (imperative), functional code describes what to compute (declarative).</p>
<h2>Pure Functions</h2>
<p>A pure function always produces the same output for the same inputs and has no side effects. Pure functions are trivially testable, infinitely composable, and safe to parallelise. The discipline of keeping functions pure — and explicitly managing side effects at the edges of the system — produces more predictable, debuggable code.</p>
<h2>Map, Filter, Reduce</h2>
<p>These three higher-order functions are the workhorses of functional programming. Map transforms each element of a collection. Filter selects elements meeting a condition. Reduce accumulates elements into a single value. Together, they replace most imperative loops more expressively and composably.</p>`,
  },
  {
    title: 'Open Source Security: Protecting Your Supply Chain',
    category: 'Open Source',
    tags: ['security', 'supply-chain', 'npm', 'dependencies', 'open-source'],
    content: `<h2>The Software Supply Chain Attack</h2>
<p>The SolarWinds attack and the event-stream npm package compromise demonstrated that compromising widely-used open-source packages is an extraordinarily effective attack vector. Your application's security posture is only as strong as every dependency in your transitive closure — potentially thousands of packages.</p>
<h2>Dependency Auditing</h2>
<p>npm audit, pip-audit, and equivalent tools flag known vulnerabilities in your direct and transitive dependencies. Integrate these into your CI pipeline to prevent vulnerable packages from reaching production. Tools like Dependabot and Renovate automate dependency update PRs.</p>
<h2>Lockfiles Are Not Optional</h2>
<p>package-lock.json and yarn.lock files pin exact versions and integrity hashes of every dependency. Never delete them or add them to .gitignore. Without a lockfile, your dependency tree is non-deterministic — builds may behave differently depending on when they run.</p>`,
  },
  {
    title: 'Vim, Emacs, and the Text Editor Wars: What Actually Matters',
    category: 'Productivity',
    tags: ['vim', 'vscode', 'editor', 'developer-tools'],
    content: `<h2>The Eternal Debate</h2>
<p>The text editor debate has the longevity and heat of religious wars — appropriately so, given how central the editor is to a developer's daily experience. Vim, Emacs, VS Code, JetBrains IDEs, and Neovim each have vocal advocates. The reality is that the best editor is the one you've invested in learning.</p>
<h2>The Case for Vim Keybindings</h2>
<p>Vim's modal editing model separates text navigation (normal mode) from text insertion (insert mode). Once internalised, it enables precise text manipulation with minimal key travel. More importantly, Vim keybindings are available as plugins in virtually every modern editor — the skill is transferable.</p>
<h2>VS Code's Dominance</h2>
<p>VS Code won the editor war for most developers through its combination of extensibility, performance, and first-class language server protocol support. Its remote development capabilities — editing files on remote servers or in containers as if they were local — are genuinely transformative for many workflows.</p>`,
  },
  {
    title: 'The Jamstack Architecture: A Modern Approach to Web Development',
    category: 'Web Development',
    tags: ['jamstack', 'static-sites', 'cdn', 'netlify', 'vercel'],
    content: `<h2>What Is Jamstack?</h2>
<p>Jamstack (JavaScript, APIs, Markup) describes an architectural approach where the frontend is pre-built as static files served from a CDN, with dynamic functionality provided by APIs and JavaScript in the browser. It's a response to the complexity of traditional server-rendered stacks.</p>
<h2>The Performance and Security Benefits</h2>
<p>Static files served from CDN edge nodes are the fastest possible web architecture — there's no server to generate each response, no database to query, no session to manage. The attack surface is dramatically reduced: no server-side code execution means no server-side injection vulnerabilities.</p>
<h2>The Limitations</h2>
<p>Jamstack is ideal for content-heavy sites, marketing sites, documentation, and applications with mostly-static content. It struggles with highly personalised content, real-time features (though these can be added via API), and content that changes too frequently for incremental builds to keep up.</p>`,
  },
  {
    title: 'SRE: How Google Runs Production Systems',
    category: 'DevOps & Cloud',
    tags: ['sre', 'reliability', 'slo', 'error-budget', 'devops'],
    content: `<h2>SRE vs DevOps</h2>
<p>Site Reliability Engineering is Google's implementation of what DevOps aspires to be. Where DevOps is a philosophy and a set of practices, SRE is a prescriptive framework with specific roles, metrics, and processes. The core tension SRE manages: reliability and feature velocity are in conflict, and this conflict must be managed explicitly.</p>
<h2>SLOs and Error Budgets</h2>
<p>Service Level Objectives are the reliability targets that define "good enough." An error budget is the allowable unreliability — if your SLO is 99.9% availability, you have a 0.1% error budget. When you're within budget, you can move fast. When you've exhausted the budget, reliability work takes precedence over feature development.</p>
<h2>Toil Elimination</h2>
<p>Toil is manual, repetitive operational work that provides no lasting value. SRE practice requires tracking the percentage of time spent on toil and systematically automating it away. This creates the virtuous cycle where reliability improvements compound: more automation means fewer incidents means more time for automation.</p>`,
  },
];

// Extend to 100 posts with variations
const EXTRA_POSTS = [
  { title: 'Tailwind CSS: Utility-First Design at Scale', category: 'Web Development', tags: ['tailwind', 'css', 'design', 'frontend'],
    content: `<h2>The Utility-First Paradigm</h2><p>Tailwind CSS inverts the traditional CSS workflow. Instead of writing semantic CSS classes that describe components, you compose utilities — each doing one thing — directly in your HTML. Critics find this ugly; converts find it liberating. The pragmatic case for Tailwind is in the measurable reduction in CSS file growth at scale.</p><h2>Why It Works at Scale</h2><p>Traditional CSS grows indefinitely. Every new feature adds new selectors. Unused styles accumulate. Specificity conflicts multiply. Tailwind utilities are finite and shared — adding a new component doesn't add new CSS. PurgeCSS strips unused utilities at build time, producing remarkably small production bundles.</p>` },
  { title: 'GitHub Copilot and AI Pair Programming: The Developer\'s Experience', category: 'AI & Machine Learning', tags: ['github-copilot', 'ai', 'pair-programming', 'productivity'],
    content: `<h2>A Year of AI-Assisted Development</h2><p>GitHub Copilot has now been used by millions of developers long enough for meaningful conclusions. The consensus: it dramatically accelerates boilerplate code, helps with unfamiliar APIs, and reduces context-switching to documentation. It struggles with complex logic, project-specific conventions, and tends to confidently produce subtly wrong code.</p><h2>The Real Productivity Impact</h2><p>Studies suggest 30-55% productivity improvements for certain tasks — particularly those involving repeated patterns. The gains are most pronounced for less experienced developers and for tasks in well-represented domains. The most nuanced finding: developers accept AI suggestions without sufficient scrutiny, introducing bugs that wouldn't have appeared in manual coding.</p>` },
  { title: 'Next.js 15 Deep Dive: App Router and Server Components', category: 'Web Development', tags: ['nextjs', 'react', 'server-components', 'app-router'],
    content: `<h2>The App Router Architecture</h2><p>Next.js's App Router (stable since version 13) fundamentally changes how developers think about React applications. The file-system based router, co-located layouts, loading states, and error boundaries provide structure that the Pages Router left to convention. Server Components — components that render on the server and send zero JavaScript to the client — enable new performance patterns.</p><h2>Server Components in Practice</h2><p>The mental model shift: components are Server Components by default. They can directly access databases, file systems, and environment secrets without exposing them to the client. Client Components, marked with 'use client', are familiar React — stateful, interactive, with access to browser APIs.</p>` },
  { title: 'Understanding Algorithms: Big O Notation Demystified', category: 'Technology', tags: ['algorithms', 'big-o', 'computer-science', 'data-structures'],
    content: `<h2>Why Complexity Matters</h2><p>An algorithm that processes 100 records in one second might take 27 hours for a million records if it's O(n²). Or 20 seconds if it's O(n log n). Or still one second if it's O(n). Understanding time complexity isn't academic — it's the difference between software that scales and software that breaks.</p><h2>The Common Complexities</h2><p>O(1) — constant time, regardless of input size (hash table lookup). O(log n) — grows slowly, halving the problem each step (binary search). O(n) — linear, processing each element once. O(n log n) — efficient sorting algorithms. O(n²) — nested loops, often a sign of an improvable algorithm.</p>` },
  { title: 'Prisma ORM: Type-Safe Database Access in Node.js', category: 'Web Development', tags: ['prisma', 'orm', 'nodejs', 'typescript', 'database'],
    content: `<h2>Why Prisma Won</h2><p>Prisma has become the dominant ORM choice for TypeScript Node.js applications by solving a problem its predecessors failed at: providing genuinely useful type safety. Queries return TypeScript types that reflect your schema exactly — no casting, no any, no guessing what shape your data has.</p><h2>The Schema-First Approach</h2><p>Prisma's schema definition language (SDL) serves as the single source of truth for your data model. From it, Prisma generates a type-safe client, manages migrations, and provides an introspection tool that generates a schema from an existing database.</p>` },
  { title: 'How to Build a CLI Tool with Node.js', category: 'Web Development', tags: ['cli', 'nodejs', 'terminal', 'developer-tools'],
    content: `<h2>CLI Tools Are Underrated</h2><p>Command-line interfaces are among the most durable software artifacts. A good CLI tool, once learned, becomes part of a developer's muscle memory. Building one for your team's workflows can save thousands of hours of manual repetition.</p><h2>The Node.js CLI Ecosystem</h2><p>Commander.js and Yargs handle argument parsing. Inquirer.js provides interactive prompts. Chalk and Ora handle formatting and progress indicators. These mature libraries handle the mechanical parts of CLI development, letting you focus on the tool's actual behaviour.</p>` },
  { title: 'Redis Streams: Real-Time Data Processing', category: 'DevOps & Cloud', tags: ['redis', 'streams', 'real-time', 'messaging', 'event-driven'],
    content: `<h2>Beyond Pub/Sub</h2><p>Redis Streams, introduced in Redis 5.0, provide a persistent, append-only log data structure with consumer groups. Unlike pub/sub (which is fire-and-forget), streams persist messages and track consumption, enabling the at-least-once delivery guarantees that production event processing requires.</p><h2>Consumer Groups</h2><p>Consumer groups allow multiple workers to process the same stream in parallel, with Redis tracking which messages each consumer has processed and acknowledged. Failed messages can be claimed and retried, providing resilience without complex infrastructure.</p>` },
  { title: 'How Browsers Work: From URL to Pixel', category: 'Technology', tags: ['browsers', 'rendering', 'performance', 'web-fundamentals'],
    content: `<h2>The 30-Millisecond Journey</h2><p>When you type a URL and press Enter, your browser performs an extraordinary sequence of operations: DNS resolution, TCP handshake, TLS negotiation, HTTP request and response, HTML parsing, CSS parsing, JavaScript execution, layout calculation, paint, and compositing. Understanding this pipeline explains everything about web performance.</p><h2>The Render Pipeline</h2><p>HTML is parsed into a DOM tree. CSS is parsed into a CSSOM. These combine into a render tree. Layout calculates element positions and sizes. Paint generates pixels layer by layer. Composite combines layers into the final image using the GPU. Optimising for this pipeline — keeping work off the main thread, avoiding layout thrashing — is the essence of rendering performance.</p>` },
  { title: 'Event-Driven Architecture: Decoupling with Message Queues', category: 'DevOps & Cloud', tags: ['event-driven', 'message-queue', 'rabbitmq', 'kafka', 'architecture'],
    content: `<h2>The Case for Decoupling</h2><p>Tightly coupled services — where Service A directly calls Service B — create dependencies that make both services harder to deploy, scale, and reason about independently. Message queues introduce an intermediary that absorbs these dependencies. Service A publishes events; Service B consumes them. Neither needs to know about the other.</p><h2>RabbitMQ vs Kafka</h2><p>RabbitMQ excels at traditional message queuing — routing, filtering, and delivering messages to specific consumers. Kafka is designed for high-throughput event streaming with persistent, replayable logs. The choice depends on whether you need message routing (RabbitMQ) or event sourcing and replay (Kafka).</p>` },
  { title: 'Designing for Dark Mode: Challenges and Solutions', category: 'Design', tags: ['dark-mode', 'css', 'design', 'accessibility'],
    content: `<h2>Dark Mode Is Not Just Color Inversion</h2><p>Naively inverting colours produces a dark mode that looks wrong in subtle but pervasive ways. Shadows become highlights. Images look wrong. Saturated colours vibrate against dark backgrounds. Proper dark mode design requires purpose-built colour palettes — not transformations of the light mode palette.</p><h2>CSS Custom Properties for Theming</h2><p>CSS custom properties (variables) are the implementation mechanism of choice for dark mode. Define semantic colour variables (--color-surface, --color-on-surface, --color-primary) and vary them with the prefers-color-scheme media query or a data-theme attribute. Components reference semantic tokens, not raw colour values.</p>` },
];

// We have POST_DATA (60ish) + EXTRA_POSTS (10) = need to round to exactly 100
const ALL_POSTS = [...POST_DATA, ...EXTRA_POSTS];

// Top up with auto-generated variations to reach exactly 100
const TECH_FILLERS = [
  ['Understanding HTTP/2 and HTTP/3', 'Technology', ['http', 'performance', 'networking', 'web']],
  ['The Rise of Deno and Bun: Node.js Alternatives', 'Web Development', ['deno', 'bun', 'nodejs', 'runtime', 'javascript']],
  ['OWASP Top 10: Web Application Security Risks', 'Technology', ['owasp', 'security', 'web', 'vulnerabilities']],
  ['Generative AI in Creative Industries', 'AI & Machine Learning', ['generative-ai', 'creativity', 'art', 'ai']],
  ['Pair Programming: When Two Heads Are Better Than One', 'Career & Growth', ['pair-programming', 'collaboration', 'agile', 'team']],
  ['Understanding OAuth 2.0 Flows', 'Technology', ['oauth', 'security', 'authentication', 'api']],
  ['The Linux Command Line: A Survival Guide', 'Productivity', ['linux', 'cli', 'bash', 'terminal']],
  ['Writing Maintainable CSS: BEM and Beyond', 'Web Development', ['css', 'bem', 'methodology', 'maintainability']],
  ['Data Structures Every Developer Should Know', 'Technology', ['data-structures', 'algorithms', 'cs-fundamentals']],
  ['Agile and Scrum: What Actually Works', 'Career & Growth', ['agile', 'scrum', 'project-management', 'team']],
  ['API Rate Limiting: Strategies and Implementation', 'Web Development', ['rate-limiting', 'api', 'backend', 'nodejs']],
  ['Building Offline-First Web Applications', 'Web Development', ['offline-first', 'pwa', 'service-worker', 'web']],
  ['The Psychology of Code: Why We Write the Way We Do', 'Career & Growth', ['psychology', 'code-quality', 'developer', 'mindset']],
  ['Cloud Cost Optimization: Avoiding the AWS Bill Shock', 'DevOps & Cloud', ['aws', 'cost', 'cloud', 'finops']],
  ['Monorepos: Managing Large Codebases with Turborepo', 'Web Development', ['monorepo', 'turborepo', 'nx', 'javascript']],
  ['The Developer\'s Guide to Giving Presentations', 'Career & Growth', ['public-speaking', 'presentations', 'communication', 'career']],
  ['Green Software Engineering: Writing Eco-Friendly Code', 'Technology', ['green-software', 'sustainability', 'performance', 'environment']],
  ['Remix vs Next.js: The Full-Stack Framework Showdown', 'Web Development', ['remix', 'nextjs', 'fullstack', 'react', 'ssr']],
  ['Neural Architecture Search: AutoML Explained', 'AI & Machine Learning', ['automl', 'nas', 'neural-networks', 'ai']],
  ['From Side Project to SaaS: A Developer\'s Journey', 'Career & Growth', ['saas', 'indie-hacker', 'startup', 'entrepreneurship']],
  ['Securing Your MongoDB Database in Production', 'DevOps & Cloud', ['mongodb', 'security', 'database', 'production']],
  ['Understanding Event Sourcing and CQRS', 'Web Development', ['event-sourcing', 'cqrs', 'architecture', 'backend']],
  ['The Art of Meaningful Variable Names', 'Web Development', ['clean-code', 'naming', 'best-practices', 'readability']],
  ['Helm Charts: Kubernetes Package Management', 'DevOps & Cloud', ['helm', 'kubernetes', 'devops', 'package-management']],
  ['Design Thinking for Developers', 'Design', ['design-thinking', 'ux', 'problem-solving', 'developer']],
  ['Building Multi-Tenant SaaS Applications', 'Web Development', ['multi-tenant', 'saas', 'architecture', 'backend']],
  ['The Ethics of AI-Generated Content', 'AI & Machine Learning', ['ai-ethics', 'content', 'copyright', 'generative-ai']],
  ['GraphQL Subscriptions: Real-Time Data', 'Web Development', ['graphql', 'subscriptions', 'real-time', 'websockets']],
  ['The Case for Boring Technology', 'Technology', ['boring-technology', 'engineering', 'risk', 'decisions']],
  ['From Bootcamp to Professional Developer', 'Career & Growth', ['bootcamp', 'self-taught', 'career', 'learning']],
];

// Generate filler post content
function generateFillerContent(title, tags) {
  return `<h2>Introduction to ${title}</h2>
<p>In this comprehensive guide, we explore ${title.toLowerCase()}, a critical topic for modern developers. Whether you're just getting started or looking to deepen your expertise, this article covers the concepts, tools, and best practices you need to succeed.</p>
<h2>Why This Matters</h2>
<p>As the technology landscape continues to evolve, understanding ${tags[0] || 'this topic'} has become increasingly valuable. Teams and individuals who invest in mastering these concepts consistently deliver better software, faster, with fewer defects.</p>
<h2>Core Concepts</h2>
<p>The foundation of ${title.toLowerCase()} rests on a few key principles. First, you must understand the underlying mechanics before applying tools and abstractions on top. Second, context matters — the best approach depends on your team's skills, your project's constraints, and your users' needs.</p>
<h2>Practical Application</h2>
<p>Theory without practice is incomplete. The most effective way to internalise these concepts is to apply them in real projects. Start small, experiment in a safe environment, and gradually introduce the techniques into production workflows as your confidence grows.</p>
<h2>Best Practices and Common Pitfalls</h2>
<ul>
<li>Always start with understanding the problem before reaching for a solution.</li>
<li>Prioritise simplicity — complexity has a cost that compounds over time.</li>
<li>Document your decisions and the reasoning behind them.</li>
<li>Measure the impact of changes rather than assuming improvement.</li>
</ul>
<h2>Looking Ahead</h2>
<p>The field of ${tags[0] || 'software development'} continues to evolve rapidly. Stay curious, build genuine understanding rather than surface familiarity, and invest in the fundamentals that will remain valuable as specific tools come and go. The best developers aren't those who know the most tools — they're those who can reason effectively about new ones.</p>`;
}

const FILLER_POSTS = TECH_FILLERS.map(([title, category, tags]) => ({
  title, category, tags,
  content: generateFillerContent(title, tags),
}));

const ALL_POSTS_100 = [...ALL_POSTS, ...FILLER_POSTS].slice(0, 100);

/* ── main seed function ───────────────────────────────────── */
async function seed() {
  console.log('\n🌱  InkWell Database Seeder\n');

  // ① Connect
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('USER:PASSWORD')) {
    console.error('❌  No valid MONGODB_URI found in environment.');
    console.error('    Copy .env.example → .env and fill in your MongoDB connection string.\n');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('✅  Connected to MongoDB');

  // ② Upsert categories
  console.log('\n📂  Seeding categories...');
  const catMap = {};
  for (const c of CATEGORIES) {
    const slug = slugify(c.name);
    const cat  = await Category.findOneAndUpdate(
      { slug },
      { name: c.name, slug, color: c.color },
      { upsert: true, new: true }
    );
    catMap[c.name] = cat._id;
    console.log(`    ✓ ${c.name}`);
  }

  // ③ Create / find seed user
  console.log('\n👤  Setting up seed author...');
  const SEED_EMAIL    = 'seed@inkwell.dev';
  const SEED_PASSWORD = 'seed123456';
  const SEED_NAME     = 'Alex Morgan';

  let seedUser = await User.findOne({ email: SEED_EMAIL });
  if (!seedUser) {
    let username = slugify(SEED_NAME);
    let c = 1;
    while (await User.findOne({ username })) username = `${slugify(SEED_NAME)}${c++}`;
    seedUser = await User.create({
      name: SEED_NAME, username, email: SEED_EMAIL,
      password: SEED_PASSWORD,
      bio: 'Senior software engineer and technical writer. I write about web development, AI, DevOps, and career growth. 10+ years building products at scale.',
      role: 'user',
    });
    console.log(`    ✓ Created user: ${SEED_EMAIL} / ${SEED_PASSWORD}`);
  } else {
    console.log(`    ✓ Using existing user: ${SEED_EMAIL}`);
  }

  // ④ Create 100 posts
  console.log('\n📝  Seeding 100 blog posts...');
  let created = 0, skipped = 0;

  for (const [i, pd] of ALL_POSTS_100.entries()) {
    // Build unique slug
    let slug = slugify(pd.title);
    const existing = await Post.findOne({ slug });
    if (existing && existing.author.toString() === seedUser._id.toString()) {
      skipped++;
      continue;
    }
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    // Spread posts over the past year for realistic timestamps
    const daysAgo    = Math.floor((i / 100) * 365);
    const createdAt  = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    const categoryId = catMap[pd.category] || null;

    await Post.create({
      title:         pd.title,
      slug,
      content:       pd.content,
      excerpt:       pd.content.replace(/<[^>]+>/g, '').slice(0, 160).trim(),
      featuredImage: `https://picsum.photos/seed/${encodeURIComponent(slug)}/1200/630`,
      author:        seedUser._id,
      category:      categoryId,
      tags:          pd.tags,
      status:        'published',
      readingTime:   readingTime(pd.content),
      views:         randInt(50, 8000),
      likesCount:    randInt(5, 400),
      createdAt,
      updatedAt:     createdAt,
    });

    created++;
    if (created % 10 === 0) console.log(`    📄  ${created}/100 posts created...`);
  }

  console.log(`\n✅  Seeding complete!\n`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  SEED ACCOUNT CREDENTIALS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`  📧  Email:    ${SEED_EMAIL}`);
  console.log(`  🔑  Password: ${SEED_PASSWORD}`);
  console.log(`  👤  Name:     ${SEED_NAME}`);
  console.log(`  📝  Posts:    ${created} published (${skipped} already existed)`);
  console.log(`  📂  Categories seeded: ${CATEGORIES.length}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('\n❌  Seed failed:', err.message);
  process.exit(1);
});

/* ============================================================
   Online Job Starter Kit — Data
   All content sourced from Online-Job-Starter-Kit.md
   ============================================================ */

const CHAPTERS = [
  {
    id: 1, title: "Understanding Online Jobs",
    checklist: [
      "I understand the difference between freelancing and remote employment",
      "I know whether I want to be a contractor or aim for employee-like stability",
      "I understand at least 3 payment models and which one suits me best",
      "I can identify the type of client I want to work with first",
      "I've listed 2-3 myths I used to believe and mentally corrected them"
    ],
    body: `An **online job** is any work you perform remotely using the internet — for a client, agency, or company — without needing to be physically present in an office.

**Three categories:** Freelance/Gig Work, Remote Employment, Hybrid/Contract Work.

**Payment models:** Hourly Rate, Fixed Price/Per Project, Retainer, Commission-Based, Milestone-Based. Beginners should prefer hourly or milestone-based to reduce risk of unpaid work.

**Client types:** Direct Clients, Agencies, Marketplace Clients, Referral Clients, Recruitment/Staffing Firms.

**Benefits:** work from anywhere, no commute, flexible schedules, global pay rates, low starting cost, scalable.

**Challenges:** inconsistent income, requires self-discipline, isolation, time zone differences, scams exist, no built-in benefits.

**Common myths debunked:** you don't need a degree, you don't need years of experience, online jobs can pay very well, the market isn't too saturated, you don't need expensive equipment, and freelancing is a legitimate career.`,
    aiPrompt: "I am a [your background] with [list any skills] interested in starting an online job. Based on the differences between freelancing and remote employment, recommend which path suits me best and explain why in simple terms."
  },
  {
    id: 2, title: "Resume Template",
    checklist: [
      "Fits on 1 page (or 2 max for senior roles)",
      "No spelling or grammar errors (run through Grammarly)",
      "Uses action verbs (Managed, Created, Increased, Resolved)",
      "Includes at least 3 quantifiable achievements",
      "Uses standard section headers",
      "Matches keywords from your target job posts",
      "Saved as PDF with a professional file name",
      "Contact info is accurate and clickable",
      "No photo, age, or irrelevant personal details (for international clients)"
    ],
    body: `Use an ATS-friendly format that passes Applicant Tracking Systems before a human sees it.

**Rules:** 1-page max (2 for 10+ yrs exp), reverse chronological order, lead with results not duties, use numbers everywhere, mirror job-post keywords exactly, no photos/personal details for international clients, use a professional email, save as PDF unless Word is requested.

**ATS tips:** use standard section headers (Experience/Education/Skills), avoid tables/columns/graphics, use standard fonts (Arial, Calibri, Georgia), avoid headers/footers for contact info, name your file professionally.

**Before → After example:**
❌ "Responsible for handling emails and calendar for boss."
✅ "Managed executive's inbox and calendar, achieving a 95% on-time response rate; independently created and scheduled 40+ monthly social media posts that grew engagement by 25%."

Use the Document Builder tab to generate your own resume from this template.`,
    aiPrompt: "Here is my current work history: [paste your work history/duties]. Rewrite each bullet point into a strong, ATS-friendly resume bullet using the 'action verb + task + quantifiable result' formula. Keep each bullet under 20 words."
  },
  {
    id: 3, title: "Cover Letter Template",
    checklist: [
      "Addressed the client by name (if available)",
      "Referenced their specific need from the job post",
      "Included one concrete result or example",
      "Kept it under 150 words",
      "Ended with a clear call to action",
      "Proofread for typos and tone"
    ],
    body: `**Personalize:** use the client's name, quote their exact pain point, reference their business by name/niche, keep it under 150 words.

**What clients want:** proof you solve their specific problem, evidence of reliability, a human but professional tone, confidence without arrogance.

**Opening formula:** "I noticed you're looking for [specific need]. I recently helped [similar client] achieve [result], and I'd love to bring that same approach to your project."

**Closing formula:** "I'd love to jump on a quick call or share a short sample to show how I can help. When would be a good time this week?"

**Common mistakes:** copy-pasting a generic letter, talking only about yourself, making it too long, sounding desperate, forgetting a call to action.

Use the Document Builder tab to generate a personalized cover letter.`,
    aiPrompt: "Here is a job post: [paste job post]. Here is my background: [paste your skills/experience]. Write a personalized cover letter under 150 words that references the client's specific need, includes one concrete result from my background, and ends with a clear call to action."
  },
  {
    id: 4, title: "AI Prompt Pack (200+ Prompts)",
    checklist: [
      "Bookmarked or saved this prompt pack for easy access",
      "Tested at least 5 prompts with my own real context",
      "Created a personal 'prompt library' doc with my most-used ones",
      "Practiced refining a weak prompt using the Prompt Engineering section"
    ],
    body: `Use these prompts with ChatGPT, Claude, or any AI assistant. Replace anything in **[brackets]** with your own details. Go to the **AI Prompt Pack** tab for the full searchable, filterable, copy-ready library of 200+ prompts across 20 categories.`,
    aiPrompt: "Pick 3 categories most relevant to your goals right now and test 2 prompts from each — see the AI Prompt Pack tab."
  },
  {
    id: 5, title: "50+ Online Job Websites",
    checklist: [
      "Identified 2-3 platforms matching my target role",
      "Created a complete, optimized profile on each chosen platform",
      "Reviewed the scam red-flags list before applying",
      "Bookmarked platforms to check daily/weekly for new posts"
    ],
    body: `Don't apply everywhere at once — pick 2-3 platforms matching your target role. See the **Job Boards** tab for the full filterable directory across Freelancing, Remote Jobs, VA Agencies, Tech, Creative, Marketing, Writing, Translation, Teaching, Customer Support, Part-Time, Philippines-based, and Worldwide categories.

**Common scam red flags across all platforms:**
- Client asks you to pay upfront for "training" or "equipment"
- Job offers an unusually high rate for very little described work
- Communication only through personal chat apps, never a real platform/email
- Requests for your bank login details (not just account number for payment)
- Poor grammar combined with urgent, pressure-filled messaging`,
    aiPrompt: "Based on my skills [list skills] and target role [role], recommend which 3 platforms from this list I should focus on first, and explain why."
  },
  {
    id: 6, title: "Portfolio Guide",
    checklist: [
      "Includes 3-5 of my strongest projects (real or mock)",
      "Each project explains problem → process → result",
      "Has a clear, visible call-to-action",
      "Is mobile-friendly and loads quickly",
      "Uses consistent fonts/colors throughout",
      "Includes at least 1 testimonial or credibility signal",
      "Contact info is accurate and easy to find"
    ],
    body: `A portfolio is your proof of capability — it *shows* rather than *tells*.

**By stage:** No experience → build 2-3 mock/practice projects. Some experience → feature 3-5 real projects with before/after. Professional → curate only your strongest, most relevant work.

**Structure:** Hero/Intro → About → Featured Work (3-5 projects) → Skills/Tools → Testimonials → Call to Action.

**Design tips:** clean and consistent style (1-2 fonts, 2-3 colors), generous white space, mobile-responsive, fast-loading, and every project should answer: What was the problem? What did I do? What was the result?

**Platforms:** Notion (free, flexible), Canva Website (free/paid), Carrd (one-pagers), Behance (design-specific), GitHub Pages (dev), Wix/Squarespace (robust, paid), Google Sites (simplest, free).`,
    aiPrompt: "I'm a [role] with [experience level]. Suggest 3 mock or real project ideas I can build for my portfolio, along with what the 'problem → process → result' story could look like for each."
  },
  {
    id: 7, title: "30-Day Roadmap",
    checklist: [
      "Completed all 4 weekly reviews",
      "Sent at least 15-20 applications/pitches by Day 21",
      "Completed at least 1 mock interview before real interviews",
      "Have a resume, portfolio, and LinkedIn profile fully ready by Day 14"
    ],
    body: `This roadmap turns the entire kit into a daily action plan across 4 weeks: Foundation & Self-Assessment, Resume/Portfolio/Online Presence, Job Search & Outreach, and Interview Prep & Landing the Job.

Don't skip days, but don't panic if you fall behind — shift the whole plan forward rather than cramming. Progress beats perfection.

Go to the **30-Day Roadmap** tab to track your daily progress interactively.`,
    aiPrompt: "I'm on Day [X] of my 30-day roadmap. Here's my progress so far: [progress]. Help me adjust the remaining days to stay on track."
  },
  {
    id: 8, title: "Interview Questions (100)",
    checklist: [
      "Practiced at least 10 questions from my target role's category",
      "Have at least 3 STAR-format stories ready to adapt to multiple questions",
      "Practiced my salary/rate answer out loud",
      "Prepared 3-5 questions to ask the interviewer"
    ],
    body: `100 interview questions across 13 categories: General, Behavioral, Customer Support, Virtual Assistant, Project Management, Remote Work, Leadership, Technical, AI, Problem Solving, Salary, Culture Fit, Final Interview, HR, and Manager.

**What interviewers want:** specificity, ownership ("I did" not just "we did"), self-awareness, alignment with the role's needs, and calm confidence.

**Scoring rubric (self-evaluate):** 5=Excellent (specific example + result + reflection), 4=Good, 3=Average (vague), 2=Weak (no real example), 1=Poor (off-topic/defensive).

Go to the **Interview Prep** tab for the full searchable question bank.`,
    aiPrompt: "Act as a hiring manager and interview me for a [role] position, asking one question at a time, and give feedback after each answer."
  },
  {
    id: 9, title: "AI Tools Cheat Sheet (75+)",
    checklist: [
      "Identified 1-2 tools per category relevant to my role",
      "Set up free accounts for my top 5 priority tools",
      "Practiced using at least 1 new tool this week",
      "Avoided over-subscribing to paid tools before validating income"
    ],
    body: `75+ AI and productivity tools across Writing, Research, Presentation, Graphic Design, Video, Audio, Automation, Coding, Data Analysis, Marketing, CRM, Productivity, Scheduling, Email, Meeting Notes, Website Builder, Resume, Portfolio, and Learning categories.

You don't need every tool — pick 1-2 per relevant category and master them before adding more to your stack.

Go to the **AI Tools Cheat Sheet** tab for the full filterable directory with pricing and pros/cons.`,
    aiPrompt: "Based on my role as a [role], recommend the 5 most essential tools from this list I should learn first, in priority order, and explain why."
  },
  {
    id: 10, title: "LinkedIn Optimization",
    checklist: [
      "Professional photo and custom banner uploaded",
      "Headline follows the 'role + who I help + result' formula",
      "About section has hook, proof, and CTA",
      "Experience section mirrors resume achievements",
      "At least 15 relevant skills added",
      "Requested at least 3 recommendations",
      "Custom LinkedIn URL set"
    ],
    body: `**Headline formula:** [Role] | I help [who] achieve [result] | [Key skill/tool]
Example: "Virtual Assistant | Helping busy founders reclaim 10+ hours/week | Notion & Inbox Systems"

**About section structure:** Hook → Who you help & how → Proof (a specific number/result) → Call to action.

**Experience:** mirror your resume's action+result bullets; list ongoing freelance work as one role, not one per client.

**Skills:** list 15-20 relevant skills, prioritize job-post language, get endorsements.

**Recommendations:** ask every satisfied client for a written recommendation; aim for 3-5 before considering your profile "complete".

**Daily 20-min LinkedIn routine:** 5 min commenting on posts in your niche, 5 min sending 2-3 personalized connection requests, 5 min responding to your own comments/messages, 5 min reviewing your feed for opportunities.`,
    aiPrompt: "Here is my background: [background]. Write a LinkedIn headline and About section following a hook → who I help → proof → CTA structure."
  },
  {
    id: 11, title: "Freelancing Proposal Templates",
    checklist: [
      "Have a short, long, and premium version saved for my primary platform",
      "Customized each template with real details, not just brackets",
      "Tested at least 5 proposals and tracked response rates",
      "Adjusted tone appropriately per platform"
    ],
    body: `Tailored Short/Long/Premium proposal templates for 5 contexts: Upwork, Freelancer.com, OnlineJobs.ph, Direct Clients, and Cold Outreach.

Each platform has a slightly different culture — punchy for Upwork, more formal for OnlineJobs.ph, genuinely observational for cold outreach.

Use the **Document Builder** tab to generate a tailored proposal.`,
    aiPrompt: "Using this job post [paste job post] and my background [background], write a [short/long/premium] proposal for [platform name]."
  },
  {
    id: 12, title: "Productivity Toolkit",
    checklist: [
      "Set up a task management system (single source of truth)",
      "Tried the Pomodoro technique for at least 3 days",
      "Set up a password manager for all client accounts",
      "Started tracking time on all projects, including fixed-price ones",
      "Created a consistent file-naming/folder system"
    ],
    body: `**Pomodoro:** 25 min focused work, 5 min break, longer break after 4 cycles.

**Deep Work:** 90-120 min blocks during peak-energy hours, no notifications, protect it like a client meeting.

**Calendar Blocking:** assign every task a time slot, block for client work/admin/learning/marketing/rest, leave 15-30 min buffers, color-code by category.

**Task Management:** one central list, use the Eisenhower Matrix, break big projects into subtasks, reprioritize daily.

**Client Management:** simple tracker with contact/status/deadlines/payment, clear communication expectations, regular status updates, per-client notes doc.

**File Organization:** `+"`Client > Project > Deliverables/Drafts/Assets`"+`, clear file naming with dates/versions, cloud storage, monthly archiving.

**Password Management:** never reuse passwords, use a password manager, enable 2FA everywhere, use secure sharing (never chat/email) for client access.

**Time Tracking:** Toggl/Clockify/Hubstaff, track even fixed-price projects, review weekly, use data to justify rate increases.

**Communication:** match client's preferred tool, set office hours, confirm verbal decisions in writing, use templates for repetitive messages.`,
    aiPrompt: "Here's my current daily task list: [tasks]. Help me organize it using the Eisenhower Matrix and suggest a time-blocked schedule for tomorrow."
  },
  {
    id: 13, title: "Remote Work Setup",
    checklist: [
      "Confirmed internet speed meets my target role's requirements",
      "Set up a backup internet option",
      "Have a quiet, well-lit space for calls",
      "Tested my headset/mic quality on a real call before a client interview"
    ],
    body: `**Laptop:** min 8GB RAM/SSD/i3 or Ryzen 3 for admin/support; 16GB+/i5+ for design/video/multitasking.

**Second Monitor:** big productivity boost; a basic 21-24" is enough for most roles.

**Headset:** noise-cancelling, USB preferred over Bluetooth for reliability, boom mic for frequent calls.

**Microphone:** built-in mics are fine occasionally; a USB condenser mic is essential for voice-heavy roles.

**Keyboard/Mouse:** comfortable, ergonomic if typing 6+ hrs/day.

**Internet:** min 25 Mbps down / 5 Mbps up; 50+ Mbps recommended for heavy uploads.

**Backup internet:** a mobile hotspot / pocket WiFi is essential — one outage can cost you a client.

**Power backup:** UPS + power bank for outages.

**Workspace:** dedicated area, good lighting, proper chair, clean neutral background for calls.

**Starter budget:** entry laptop, wired USB headset, standard broadband, prepaid pocket WiFi, table+chair.
**Upgraded setup:** 16GB+ laptop, 24" monitor, wireless noise-cancelling headset, USB condenser mic, 50+Mbps fiber, dedicated hotspot, UPS+power bank, ergonomic desk setup.`,
    aiPrompt: "I'm starting as a [role] with a budget of [amount]. Recommend a prioritized remote work equipment list within that budget."
  },
  {
    id: 14, title: "Salary Guide",
    checklist: [
      "Identified my current experience tier (beginner/intermediate/expert) for my role",
      "Set a rate based on market research, not guesswork",
      "Have a plan for when/how to raise my rate next",
      "Factored in non-billable time and costs into my rate calculation"
    ],
    body: `Rates below are general USD/hour estimates for international clients — see the **Salary Guide** tab for the full table.

**How to set your rate:** research market rate, factor in your costs (internet, tools, taxes, healthcare), start slightly below market if brand new (not drastically lower), increase every 3-6 months, charge more for specialized skill combinations.

**Common mistakes:** underpricing to "win" a client, never raising rates with existing clients, quoting hourly without accounting for non-billable time, comparing your rate to a friend's without adjusting for niche/region/experience.`,
    aiPrompt: "I'm a [role] with [experience level] targeting clients in [region/market]. Help me calculate a fair hourly rate, accounting for my costs and market rates."
  },
  {
    id: 15, title: "Bonus Resources",
    checklist: [
      "Bookmarked 3-5 free courses relevant to my skill goals",
      "Joined at least 1 community (Facebook group, Discord, or Reddit) in my niche",
      "Subscribed to 1-2 relevant newsletters",
      "Downloaded at least 1 free template to speed up my workflow"
    ],
    body: `**Free courses:** Google Digital Garage, HubSpot Academy, Coursera (Audit Mode), freeCodeCamp, Canva Design School, Meta Blueprint.

**Certificates:** Google Career Certificates, HubSpot Content Marketing, Meta Social Media Marketing, Microsoft Office Specialist, Canva Certified Creative.

**Communities:** Reddit (r/freelance, r/WorkOnline, r/digitalnomad, r/forhire, niche subs), Facebook groups (Filipino freelancers/VAs, niche groups, job-lead groups), Discord servers (tool-specific, accountability, AI/prompt engineering, skill-building).

**Also:** YouTube channels, podcasts, professional associations, blogs, newsletters, and books on freelancing fundamentals, deep work, pricing, and personal branding.

**Free templates:** resume/cover letter (Canva, Google Docs gallery), Notion templates for trackers/calendars/PM, invoice/proposal templates, social content calendars.`,
    aiPrompt: "I want to learn [skill] and connect with a community of other [role] freelancers. Suggest a learning plan and the types of communities I should look for."
  }
];

/* ---------------- 30-Day Roadmap ---------------- */
const ROADMAP = [
  { week: "Week 1 — Foundation & Self-Assessment", days: [
    { day:1, obj:"Understand online jobs and choose a direction", tasks:"Read Chapter 1; reflect on freelance vs. employment; pick 1-2 target roles", time:"1 hr", output:"A written 1-paragraph career direction statement" },
    { day:2, obj:"Assess current skills", tasks:"List all current skills/tools you know; rate confidence 1-5 each", time:"45 min", output:"A skills inventory list" },
    { day:3, obj:"Identify skill gaps", tasks:"Compare your skills list to 5 real job posts in your target role", time:"1 hr", output:"A gap list of 3-5 missing skills" },
    { day:4, obj:"Set up professional email & accounts", tasks:"Create a professional email; set up LinkedIn and 1 job platform account", time:"1 hr", output:"Active professional accounts" },
    { day:5, obj:"Learn one priority skill (part 1)", tasks:"Start a free course on your #1 skill gap", time:"1.5 hr", output:"Course started, notes taken" },
    { day:6, obj:"Learn one priority skill (part 2)", tasks:"Continue course; do 1 practice exercise", time:"1.5 hr", output:"A completed practice exercise" },
    { day:7, obj:"Week 1 review", tasks:"Reflect on progress; adjust direction if needed", time:"30 min", output:"A short weekly reflection" }
  ]},
  { week: "Week 2 — Resume, Portfolio & Online Presence", days: [
    { day:8, obj:"Draft your resume", tasks:"Fill in Chapter 2 resume template with your real info", time:"1.5 hr", output:"A complete draft resume" },
    { day:9, obj:"Optimize resume for ATS", tasks:"Run resume through ATS checklist; add keywords", time:"1 hr", output:"An ATS-optimized resume" },
    { day:10, obj:"Build your portfolio (part 1)", tasks:"Choose a platform; create 1-2 mock or real projects", time:"2 hr", output:"Portfolio platform set up" },
    { day:11, obj:"Build your portfolio (part 2)", tasks:"Add project write-ups (problem → process → result)", time:"1.5 hr", output:"2-3 completed project entries" },
    { day:12, obj:"Optimize LinkedIn profile", tasks:"Update headline, About section, and experience", time:"1.5 hr", output:"A fully optimized LinkedIn profile" },
    { day:13, obj:"Write cover letter templates", tasks:"Draft short, standard, and no-experience versions", time:"1 hr", output:"3 saved cover letter templates" },
    { day:14, obj:"Week 2 review", tasks:"Review resume, portfolio, LinkedIn as a full package", time:"45 min", output:"A polished application package" }
  ]},
  { week: "Week 3 — Job Search & Outreach", days: [
    { day:15, obj:"Choose your platforms", tasks:"Pick 2-3 job platforms matching your role", time:"45 min", output:"2-3 complete platform profiles" },
    { day:16, obj:"Apply to 5 jobs", tasks:"Use resume + cover letter to apply to 5 real posts", time:"2 hr", output:"5 applications sent" },
    { day:17, obj:"Send 5 cold outreach messages", tasks:"Pitch 5 potential direct clients cold", time:"1.5 hr", output:"5 outreach messages sent" },
    { day:18, obj:"Apply to 5 more jobs", tasks:"Continue applying, track in a tracker sheet", time:"2 hr", output:"5 more applications sent" },
    { day:19, obj:"Follow up on silent applications", tasks:"Follow up on anything sent 5+ days ago with no reply", time:"1 hr", output:"Follow-up messages sent" },
    { day:20, obj:"Network for opportunities", tasks:"Post on LinkedIn about your job search; message 5 connections", time:"1 hr", output:"1 post + 5 messages sent" },
    { day:21, obj:"Week 3 review", tasks:"Review response rates; adjust approach", time:"45 min", output:"An updated outreach strategy" }
  ]},
  { week: "Week 4 — Interview Prep & Landing the Job", days: [
    { day:22, obj:"Study common interview questions", tasks:"Review Chapter 8 questions relevant to your role", time:"1.5 hr", output:"Notes on 10 key answers" },
    { day:23, obj:"Do a mock interview", tasks:"Run a full mock interview using AI", time:"1 hr", output:"A completed mock interview + feedback" },
    { day:24, obj:"Prepare your rate/salary answer", tasks:"Research market rate; prepare a range", time:"1 hr", output:"A confident rate answer prepared" },
    { day:25, obj:"Continue applying + follow-ups", tasks:"Apply to 5 more jobs; send pending follow-ups", time:"2 hr", output:"5 more applications + follow-ups sent" },
    { day:26, obj:"Attend/schedule interviews", tasks:"Respond to any interview requests; schedule calls", time:"Varies", output:"Interview(s) scheduled or completed" },
    { day:27, obj:"Negotiate if offered", tasks:"If you receive an offer, review and negotiate if needed", time:"1 hr", output:"A confident response to the offer" },
    { day:28, obj:"Set up your workflow", tasks:"Prepare tools, tracker, and workspace for your first job", time:"1.5 hr", output:"A ready-to-work setup" },
    { day:29, obj:"Plan your first week on the job", tasks:"Draft a personal 90-day success plan for the new role", time:"1 hr", output:"A first-week success plan" },
    { day:30, obj:"Celebrate & set next goals", tasks:"Reflect on the full 30 days; set your next 90-day goal", time:"1 hr", output:"A reflection + new goal set" }
  ]}
];

/* ---------------- 90-Day Challenge ---------------- */
const CHALLENGE_DAILY = [
  "Complete at least one deep work block on client/skill-building work",
  "Spend 15-20 minutes on visibility (LinkedIn, portfolio updates, or networking)",
  "Log your hours/tasks in your tracker",
  "End the day with a 2-minute reflection: What went well? What's next?"
];
const CHALLENGE_MONTHS = [
  { month:"Month 1 (Days 1-30) — Stabilize", focus:"Land your first job/client and build reliable work habits.",
    milestones:[
      "Week 1: Complete resume, portfolio, and LinkedIn setup",
      "Week 2: Send at least 15 applications/pitches",
      "Week 3: Complete at least 1 interview or client call",
      "Week 4: Secure your first paid job/client — or revise your approach"
    ], review:["What worked well in my outreach this month?","What's the biggest bottleneck in my process right now?","Am I targeting the right roles/niche based on responses received?"],
    reward:"Treat yourself to something small and meaningful for completing Month 1." },
  { month:"Month 2 (Days 31-60) — Strengthen", focus:"Deliver excellent work, build your reputation, and start diversifying income.",
    milestones:[
      "Week 5: Deliver your first project/task with a strong client experience",
      "Week 6: Request your first testimonial/recommendation from a client",
      "Week 7: Add 1-2 new projects to your portfolio based on real work",
      "Week 8: Begin outreach for a second client/income stream"
    ], review:["How did my client relationship(s) go this month? What would I do differently?","Have I asked for feedback/testimonials proactively?","Is my current rate reflecting the value I'm delivering?"],
    reward:"Invest in one tool or resource that will make your work easier or better." },
  { month:"Month 3 (Days 61-90) — Scale", focus:"Increase your rate, deepen your skills, and set your next 90-day goal.",
    milestones:[
      "Week 9: Research and prepare a rate increase conversation",
      "Week 10: Complete one new skill-building course or certification",
      "Week 11: Optimize your LinkedIn and portfolio with new results/testimonials",
      "Week 12: Reflect on the full 90 days and set your next 90-day goal"
    ], review:["Compared to Day 1, how has my confidence and skill level changed?","What's my updated 1-year career vision, based on what I now know?","What's the ONE thing I should focus on most in the next 90 days?"],
    reward:"Celebrate meaningfully — consider sharing your journey publicly." }
];
const CHALLENGE_FINAL_QUESTIONS = [
  "What am I most proud of from these 90 days?",
  "What almost made me quit, and how did I push through?",
  "Who or what supported me most during this journey?",
  "What does \"success\" look like for me now, compared to Day 1?",
  "What's my next big goal, and what's the first step I'll take toward it?"
];

/* ---------------- AI Prompt Pack (Chapter 4) ---------------- */
// [category, goal, prompt, output, tip]
const PROMPT_CATEGORIES = ["Resume","Cover Letter","Interview","Portfolio","LinkedIn","Proposal","Cold Email","Follow-up Email","Career Planning","Salary Negotiation","Time Management","Learning","Personal Branding","Client Communication","Writing","Research","Marketing Yourself","Daily Productivity","Job Search","Freelancing","Virtual Assistant","Customer Support","Social Media","Graphic Design","Programming","Data Analysis","Automation","Prompt Engineering"];

const PROMPTS = [
["Resume","Rewrite weak bullets","Rewrite this resume bullet using action verb + result: [bullet]","A stronger, quantified bullet point","Always ask for a number/result"],
["Resume","Tailor resume to job post","Tailor my resume summary to this job post: [job post]. My background: [background]","A 2-3 sentence targeted summary","Paste the exact job post text"],
["Resume","Identify missing keywords","Compare my resume [resume] to this job post [job post] and list missing keywords","A list of gap keywords","Add these naturally, don't keyword-stuff"],
["Resume","Shorten a long resume","Condense this resume to fit one page while keeping key achievements: [resume]","A trimmed, 1-page version","Review it still reads naturally"],
["Resume","Write a resume summary","Write a 3-sentence resume summary for a [role] with [X years] experience in [skills]","A punchy top-of-resume summary","Ask for 2-3 variations"],
["Resume","Create skills section","List the top 15 relevant skills for a [role] resume","A categorized skills list","Cross-check against real job posts"],
["Resume","Fix passive language","Rewrite this resume section to remove passive voice: [section]","An active-voice rewrite","Passive voice weakens impact"],
["Resume","Resume for career shifter","Write a resume summary for someone shifting from [old career] to [new career]","A transferable-skills-focused summary","Emphasize transferable skills explicitly"],
["Cover Letter","Write a full cover letter","Write a cover letter under 150 words for this job post: [job post]. My background: [background]","A complete personalized letter","Always specify word limit"],
["Cover Letter","Write an opening line","Write 3 opening lines for a cover letter referencing this job post: [job post]","3 hook options","Pick the one that sounds most natural to you"],
["Cover Letter","Write a closing CTA","Write 3 strong closing call-to-action lines for a cover letter","3 CTA options","Keep it low-pressure, not pushy"],
["Cover Letter","No-experience version","Write a cover letter for someone with no experience applying for [role]","A confidence-focused letter","Emphasize eagerness + trial offer"],
["Cover Letter","Shorten a letter","Shorten this cover letter to under 100 words: [letter]","A condensed version","Good for platforms with character limits"],
["Cover Letter","Add personality","Rewrite this cover letter to sound warmer and more human: [letter]","A more conversational version","Don't lose professionalism"],
["Cover Letter","Cold outreach letter","Write a cover letter for a job I'm cold-pitching, not responding to a post, for [role]","A proactive-pitch style letter","Focus on value you can bring, not \"I saw your post\""],
["Cover Letter","Compare two drafts","Compare these two cover letter drafts and tell me which is stronger and why: [draft A] [draft B]","An analysis + recommendation","Useful before submitting an important application"],
["Interview","Mock interview","Act as a hiring manager and interview me for a [role] position, asking one question at a time","An interactive mock interview","Ask it to give feedback after each answer"],
["Interview","Answer using STAR","Help me answer this interview question using the STAR method: [question]. Context: [context]","A structured STAR answer","Always give real context for best results"],
["Interview","Prepare for weaknesses","What are common weaknesses interviewers probe for in a [role] interview, and how should I answer?","A list of tough questions + strategies","Practice out loud, not just reading"],
["Interview","Questions to ask interviewer","Suggest 5 smart questions to ask the interviewer for a [role] position","5 thoughtful questions","Avoid asking about salary too early"],
["Interview","Handle salary question","How should I answer 'What's your expected salary?' for a [role] with [experience level]?","A diplomatic answer framework","Always give a range, not a fixed number"],
["Interview","Practice technical questions","Give me 5 technical interview questions for a [role] and ideal answers","5 Q&A pairs","Good for tech/VA/bookkeeping roles"],
["Interview","Reduce nervousness","Give me a pre-interview routine to calm nerves and boost confidence","A short prep checklist","Practice this the morning of interviews"],
["Interview","Follow-up after interview","Write a thank-you email after a job interview for a [role] position","A short professional thank-you note","Send within 24 hours"],
["Portfolio","Build portfolio structure","Suggest a portfolio structure for a [role] with no professional experience","A page-by-page outline","Use this as your website sitemap"],
["Portfolio","Write portfolio bio","Write a short portfolio bio for a [role] focused on [niche]","A 3-4 sentence bio","Keep tone confident, not boastful"],
["Portfolio","Describe a mock project","Help me describe a practice project as a portfolio case study for [role]","A case-study write-up","Include problem → process → result"],
["Portfolio","Choose portfolio platform","Recommend the best free portfolio platforms for a [role]","A short list with pros/cons","Compare with Chapter 6"],
["Portfolio","Portfolio call-to-action","Write a call-to-action for the end of my portfolio page","A CTA sentence/button copy","Link directly to your contact form"],
["Portfolio","Portfolio for no experience","How can someone with zero experience build a credible portfolio for [role]?","Actionable portfolio ideas","Create 2-3 mock/practice projects"],
["Portfolio","Case study headline","Write 5 headline options for a portfolio case study about [project]","5 headline variations","Pick the most result-focused one"],
["Portfolio","Portfolio feedback","Review this portfolio description and suggest improvements: [description]","Specific edit suggestions","Paste your actual draft for best results"],
["LinkedIn","Write headline","Write 5 LinkedIn headline options for a [role] targeting [niche]","5 headline variations","Include a keyword + value statement"],
["LinkedIn","Write About section","Write a LinkedIn About section for a [role] with [experience/skills]","A 3-4 paragraph About section","Write in first person, conversational tone"],
["LinkedIn","Optimize experience section","Rewrite this LinkedIn experience entry to be more results-focused: [entry]","A stronger experience bullet set","Match resume language for consistency"],
["LinkedIn","Networking message","Write a LinkedIn connection request message for [type of person, e.g. recruiter]","A short, non-salesy message","Keep under 300 characters"],
["LinkedIn","Content post idea","Suggest 10 LinkedIn post ideas for a [role] building a personal brand","10 post topic ideas","Post 2-3x per week for growth"],
["LinkedIn","Write a LinkedIn post","Write a LinkedIn post about [topic] in a personal, story-driven tone","A ready-to-publish post","Add a question at the end for engagement"],
["LinkedIn","Recommendation request","Write a message asking a past client for a LinkedIn recommendation","A polite, easy-to-say-yes-to message","Make it easy — suggest what to write"],
["LinkedIn","Daily LinkedIn strategy","Create a daily 20-minute LinkedIn routine to grow visibility as a [role]","A step-by-step routine","Consistency matters more than volume"],
["Proposal","Upwork proposal","Write an Upwork proposal for this job post: [job post]. My background: [background]","A tailored proposal","Reference the client's exact need in line 1"],
["Proposal","Short proposal","Write a proposal under 75 words for [job post]","A concise proposal","Great for quick-apply platforms"],
["Proposal","Premium proposal","Write a detailed, premium-tier proposal for a high-budget [role] project","A longer, authority-building proposal","Include a mini-strategy or plan"],
["Proposal","Direct client pitch","Write a cold pitch message to a direct client offering [service]","A short outreach message","Personalize with their business name"],
["Proposal","Proposal follow-up","Write a polite follow-up message for a proposal that hasn't been answered in 5 days","A short nudge message","Don't sound impatient"],
["Proposal","Proposal with pricing","Write a proposal that includes 3 pricing package tiers for [service]","Good/Better/Best pricing structure","Anchor with the premium tier first"],
["Proposal","Improve weak proposal","Improve this proposal to sound more confident and specific: [proposal]","A stronger rewrite","Paste your real draft"],
["Proposal","Proposal for OnlineJobs.ph","Write a proposal for a Philippines-based job post on OnlineJobs.ph: [job post]","A locally-toned proposal","Slightly more formal tone works well here"],
["Cold Email","Cold email to business","Write a cold email offering [service] to a [type of business]","A short outreach email","Keep under 150 words"],
["Cold Email","Subject line ideas","Write 10 subject lines for a cold email offering [service]","10 subject line options","Avoid spammy words like 'FREE'"],
["Cold Email","Value-first cold email","Write a cold email that leads with a free tip or insight before pitching [service]","A value-first email","Builds trust before the ask"],
["Cold Email","Cold email to agency","Write a cold email applying to work with a [type] agency as a freelancer","An agency-pitch email","Mention availability and rate range"],
["Cold Email","Personalize at scale","Give me a cold email template with placeholders I can personalize quickly for multiple businesses","A fill-in-the-blank template","Still customize the opening line each time"],
["Cold Email","Cold email breakup","Write a final follow-up 'breakup' email after 3 unanswered cold emails","A polite closing message","Sometimes gets the best response rate"],
["Cold Email","LinkedIn-to-email pitch","Write a cold email to send after connecting with someone on LinkedIn","A warm-toned pitch email","Reference the LinkedIn connection"],
["Cold Email","Cold email for referrals","Write an email asking past clients for referrals to new clients","A referral-request email","Offer an incentive if possible"],
["Follow-up Email","Job application follow-up","Write a follow-up email for a job application sent 1 week ago with no response","A polite check-in email","Keep it under 80 words"],
["Follow-up Email","Post-interview follow-up","Write a follow-up email 3 days after an interview with no response","A short, professional nudge","Reiterate interest and value"],
["Follow-up Email","Client project follow-up","Write a follow-up email to a client who hasn't approved a deliverable","A gentle reminder email","Include the deliverable link again"],
["Follow-up Email","Invoice follow-up","Write a polite follow-up email for an unpaid invoice","A professional payment reminder","Stay firm but courteous"],
["Follow-up Email","Proposal follow-up #2","Write a second follow-up for a proposal after the first got no reply","A brief, low-pressure message","Add new value/insight if possible"],
["Follow-up Email","Meeting follow-up","Write a follow-up email summarizing action items after a client call","A recap + next steps email","Send within a few hours of the call"],
["Follow-up Email","Re-engagement email","Write a re-engagement email to a past client I haven't worked with in 6 months","A warm check-in email","Mention something specific about their business"],
["Follow-up Email","Thank-you follow-up","Write a thank-you follow-up after a client refers me to someone new","A gratitude message","Consider offering them something in return"],
["Career Planning","1-year career plan","Create a 1-year career growth plan for someone starting as a [role]","A milestone-based yearly plan","Review and adjust every quarter"],
["Career Planning","Skill gap analysis","What skills do I need to grow from [current role] to [target role]?","A skill gap list","Prioritize top 3 skills first"],
["Career Planning","Niche selection","Help me choose a niche as a [role] based on these interests: [interests]","3-5 niche suggestions","Pick one you can talk about for hours"],
["Career Planning","Career pivot plan","Create a transition plan from [current career] to [remote career] over 6 months","A month-by-month plan","Keep your current income while transitioning"],
["Career Planning","Long-term vision","Help me define a 5-year vision for my remote career as a [role]","A vision statement + milestones","Revisit this yearly"],
["Career Planning","Rate growth plan","Create a plan to grow my rate from [current rate] to [target rate] in 12 months","A rate-increase roadmap","Tie rate increases to skill/portfolio growth"],
["Career Planning","Decision help","Help me decide between staying freelance or seeking full-time remote employment, given [situation]","A pros/cons analysis","Be honest about your risk tolerance"],
["Career Planning","Career audit","Review my current skills, experience, and goals and suggest my best next career move: [details]","A personalized recommendation","Give as much detail as possible"],
["Salary Negotiation","Negotiation script","Write a script to negotiate a higher rate for a [role] job offer","A negotiation conversation script","Practice saying it out loud"],
["Salary Negotiation","Counter-offer email","Write a counter-offer email requesting [amount] instead of the initial offer of [amount]","A professional counter-offer email","Always justify with value, not need"],
["Salary Negotiation","Rate increase request","Write a message asking an existing client for a rate increase","A tactful rate-increase message","Time it around a contract renewal"],
["Salary Negotiation","Justify higher rate","Help me justify a higher rate than competitors for [service]","Value-based talking points","Focus on outcomes, not just skills"],
["Salary Negotiation","Handle lowball offers","How should I respond to a client offering a rate far below market value?","A polite decline/negotiate script","It's okay to walk away professionally"],
["Salary Negotiation","Research market rate","What is the typical rate range for a [role] with [experience level] in [region/market]?","An estimated rate range","Cross-check with Chapter 14"],
["Salary Negotiation","Negotiate scope, not just price","Help me negotiate reduced scope instead of a price cut for [project]","A scope-adjustment script","Protects your rate and your time"],
["Salary Negotiation","Annual raise request","Write a message requesting an annual rate increase from a long-term client","A professional raise-request message","Reference your tenure and results"],
["Time Management","Daily schedule","Create a daily schedule for a freelancer working [X hours] across [X] clients","A time-blocked daily plan","Build in buffer time between tasks"],
["Time Management","Prioritize tasks","Help me prioritize this task list using the Eisenhower Matrix: [tasks]","A sorted urgent/important matrix","Do Q1 (urgent+important) first"],
["Time Management","Beat procrastination","Give me 5 strategies to stop procrastinating on [specific task]","5 actionable strategies","Try the \"2-minute rule\" for small tasks"],
["Time Management","Weekly planning","Help me plan my week given these deadlines: [deadlines]","A day-by-day weekly plan","Review and adjust every Sunday"],
["Time Management","Batch tasks","Suggest how to batch these recurring tasks to save time: [tasks]","A batching schedule","Batch similar tasks on the same day"],
["Time Management","Manage multiple clients","Help me create a system to manage [X] clients without missing deadlines","A tracking system suggestion","Use one central tracker (see Worksheets)"],
["Time Management","Reduce distractions","Give me a distraction-blocking routine for deep focus work","A pre-work focus routine","Combine with Pomodoro technique"],
["Time Management","Recover from a bad day","Help me reset my schedule after falling behind for 2 days","A recovery/catch-up plan","Don't try to do everything at once"],
["Learning","Learning roadmap","Create a 30-day learning roadmap to become a [role]","A day-by-day learning plan","Pair with Chapter 7's roadmap"],
["Learning","Find free resources","Recommend free courses and resources to learn [skill]","A curated resource list","Always check reviews before enrolling"],
["Learning","Practice exercises","Give me 5 practice exercises to build my [skill] ability","5 hands-on exercises","Turn results into portfolio pieces"],
["Learning","Explain a concept simply","Explain [concept] like I'm a complete beginner","A simplified explanation","Ask for an analogy if still unclear"],
["Learning","Study plan for certification","Create a study plan to pass the [certification name] exam in 2 weeks","A study schedule","Check the certification's own study guide too"],
["Learning","Skill assessment","Ask me questions to assess my current level in [skill]","A short self-assessment quiz","Repeat monthly to track growth"],
["Learning","Turn learning into content","Help me turn what I learned about [topic] into a LinkedIn post","A shareable learning post","Great for personal branding too"],
["Learning","Compare learning platforms","Compare Coursera, Udemy, and YouTube for learning [skill]","A pros/cons comparison","Free YouTube content is often enough to start"],
["Personal Branding","Define personal brand","Help me define my personal brand as a [role] based on these values: [values]","A brand statement","Keep it authentic, not generic"],
["Personal Branding","Brand voice guide","Create a brand voice guide (tone, words to use/avoid) for my [role] brand","A short voice guide","Use consistently across platforms"],
["Personal Branding","Bio for multiple platforms","Write a bio for [role] in 3 lengths: short (Twitter/X), medium (Instagram), long (LinkedIn)","3 bio versions","Keep the core message consistent"],
["Personal Branding","Content pillars","Suggest 5 content pillars for a [role] building a personal brand","5 topic categories","Rotate pillars weekly"],
["Personal Branding","Differentiate from competitors","Help me find what makes me different from other [role]s in [niche]","A unique positioning statement","Be specific, avoid generic claims"],
["Personal Branding","Personal brand story","Help me write my personal origin story for my [role] brand","A short narrative bio","Include a struggle + turning point"],
["Personal Branding","Visual brand direction","Suggest a visual branding direction (colors, style) for a [role] personal brand","A mood/style suggestion","Pair with a designer or Canva templates"],
["Personal Branding","Brand consistency audit","Review my bios across platforms and flag inconsistencies: [bios]","A consistency report","Update all platforms the same week"],
["Client Communication","Set expectations early","Write an onboarding message setting clear expectations with a new client","A welcome/expectations message","Send this before work begins"],
["Client Communication","Handle scope creep","Write a polite message pushing back on scope creep from a client","A boundary-setting message","Reference the original agreement"],
["Client Communication","Deliver bad news","Help me tell a client their deadline needs to move by [X days]","A professional delay-notice message","Always offer a solution, not just the problem"],
["Client Communication","Ask clarifying questions","Help me write clarifying questions for this vague client brief: [brief]","A list of smart questions","Prevents wasted revisions"],
["Client Communication","Handle difficult feedback","Help me respond professionally to harsh client feedback: [feedback]","A calm, solution-focused reply","Don't respond emotionally in the moment"],
["Client Communication","End a client relationship","Write a professional message ending a working relationship with a client","A respectful offboarding message","Leave the door open for future referrals"],
["Client Communication","Weekly status update","Write a weekly status update template for ongoing client work","A reusable update format","Send consistently, even with no big news"],
["Client Communication","Ask for a testimonial","Write a message asking a satisfied client for a written testimonial","A simple testimonial request","Make it easy — provide sample questions"],
["Writing","Improve clarity","Rewrite this paragraph to be clearer and more concise: [text]","A tightened rewrite","Good for emails and proposals"],
["Writing","Adjust tone","Rewrite this in a more [friendly/formal/confident] tone: [text]","A tone-adjusted version","Match tone to the platform/audience"],
["Writing","Blog outline","Create an outline for a blog post about [topic]","A structured outline","Great for content writing gigs"],
["Writing","Headline generator","Write 10 headline options for an article about [topic]","10 headline variations","Pick the most curiosity-driven one"],
["Writing","Proofreading pass","Proofread this text for grammar and clarity issues: [text]","Corrected text + explanation of fixes","Still do a manual read-through"],
["Writing","Simplify jargon","Rewrite this text to remove jargon and be beginner-friendly: [text]","A simplified version","Useful for explaining technical work to clients"],
["Writing","Write a case study","Write a case study about [project] following a problem-solution-result format","A structured case study","Use in portfolio and proposals"],
["Writing","Style match","Rewrite this text to match the tone/style of this reference sample: [sample]","A style-matched rewrite","Useful for ghostwriting projects"],
["Research","Market research","Summarize the current market trends for [industry/niche]","A trend summary","Cross-verify with recent sources"],
["Research","Competitor analysis","Analyze these 3 competitors and summarize their strengths/weaknesses: [competitors]","A comparison summary","Useful before pitching a client"],
["Research","Client company research","Summarize what this company does and their likely pain points: [company name/info]","A quick company brief","Use before interviews or proposals"],
["Research","Fact-check a claim","Help me verify this claim and find supporting or contradicting sources: [claim]","A fact-check summary","Always double check with primary sources"],
["Research","Summarize a long document","Summarize this document into 5 key bullet points: [document text]","A concise summary","Great for research-heavy freelance gigs"],
["Research","Industry keyword research","List the top keywords/topics trending in [industry] right now","A keyword list","Useful for content and SEO work"],
["Research","Survey question design","Help me write 5 survey questions to research [topic]","5 well-structured questions","Avoid leading/biased questions"],
["Research","Research brief for a client","Turn this raw research into a client-ready brief: [raw notes]","A polished research brief","Structure with headers and bullets"],
["Marketing Yourself","Elevator pitch","Write a 30-second elevator pitch for a [role] specializing in [niche]","A short spoken pitch","Practice until it sounds natural"],
["Marketing Yourself","Social proof post","Write a social media post highlighting a recent client win: [result]","A shareable post","Always ask client permission first"],
["Marketing Yourself","Free lead magnet idea","Suggest 5 free lead magnet ideas to attract [niche] clients","5 lead magnet concepts","Pick one you can create in a day"],
["Marketing Yourself","Personal website copy","Write homepage copy for my personal website as a [role]","Homepage sections (hero, about, CTA)","Keep hero section benefit-focused"],
["Marketing Yourself","Referral ask","Write a message asking my network to refer me for [type of work]","A shareable referral request","Make it easy to forward"],
["Marketing Yourself","Niche positioning statement","Write a positioning statement: 'I help [who] do [what] so they can [result]'","A clear positioning line","Use this everywhere — bio, pitch, proposals"],
["Marketing Yourself","Case study promotion","Write a social post promoting a new case study/portfolio piece","A promotional post","Include a link and a clear CTA"],
["Marketing Yourself","Personal marketing plan","Create a 30-day self-marketing plan to attract new clients as a [role]","A day-by-day marketing plan","Mix content, outreach, and networking"],
["Daily Productivity","Morning routine","Design a productive morning routine for a remote worker","A step-by-step routine","Start the night before with a plan"],
["Daily Productivity","End-of-day review","Create an end-of-day review template to track wins and next steps","A short reflection template","Do this daily for 30 days to build habit"],
["Daily Productivity","Energy management","Help me schedule tasks based on my energy levels throughout the day","An energy-matched schedule","Save deep work for peak-energy hours"],
["Daily Productivity","Avoid burnout","Give me signs of freelancer burnout and how to prevent it","A warning-signs + prevention list","Schedule real rest days"],
["Daily Productivity","Focus session structure","Design a 90-minute deep work session structure","A structured focus block","Turn off notifications during this block"],
["Daily Productivity","Weekly reset routine","Create a Sunday reset routine to prepare for the work week","A weekly reset checklist","Include reviewing the tracker worksheets"],
["Daily Productivity","Habit stacking","Help me stack a new productivity habit onto an existing routine","A habit-stacking plan","Anchor new habits to existing ones"],
["Daily Productivity","Productivity audit","Review my daily schedule and suggest improvements: [schedule]","Specific optimization suggestions","Be honest about time wasters"],
["Job Search","Find matching jobs","Suggest job search keywords and titles for someone with [skills]","A list of search terms","Use across multiple platforms"],
["Job Search","Filter good vs. bad job posts","Help me evaluate if this job post is a red flag or legitimate: [job post]","A red-flag analysis","Cross-check with Chapter 5"],
["Job Search","Daily job search routine","Create a daily 1-hour job search routine","A structured search routine","Consistency beats intensity"],
["Job Search","Track applications","Suggest a simple system to track job applications and follow-ups","A tracking system idea","Pair with the Job Application Tracker worksheet"],
["Job Search","Where to apply","Suggest the best platforms to find [role] jobs for a [experience level]","A platform list","Cross-check with Chapter 5"],
["Job Search","Application volume strategy","How many applications should I send per week as a [role] beginner, and why?","A realistic target + reasoning","Quality still matters more than pure volume"],
["Job Search","Handle rejection","Help me process job rejection and stay motivated for my search","A mindset/reframe response","Rejection is data, not a verdict"],
["Job Search","Negotiate first job","Help me evaluate whether to accept this first job offer: [offer details]","A pros/cons breakdown","First jobs are for experience, not perfection"],
["Freelancing","Set up freelance business basics","What do I need to legally/financially set up as a freelancer in [country]?","A basic setup checklist","Verify with local government resources"],
["Freelancing","Contract basics","What should a basic freelance contract include to protect me?","A contract checklist","Use a template, don't skip contracts"],
["Freelancing","Pricing strategy","Help me decide between hourly and project pricing for [service]","A pricing recommendation","Track your actual hours for a month first"],
["Freelancing","Handle scope creep","Give me a script to handle a client asking for extra work outside the agreed scope","A boundary-setting script","Reference original agreement"],
["Freelancing","Client onboarding process","Design a simple onboarding process for new freelance clients","A step-by-step onboarding flow","Automate with templates/forms"],
["Freelancing","Diversify income","Suggest 3 ways to diversify income streams as a [role] freelancer","3 income diversification ideas","Don't rely on a single client"],
["Freelancing","Manage feast-or-famine cycles","How can I manage inconsistent freelance income month to month?","A budgeting/smoothing strategy","Build a buffer fund during high-income months"],
["Freelancing","Scale from solo to agency","What are the first steps to scale from solo freelancer to small agency?","A scaling roadmap","Only scale once you have consistent demand"],
["Virtual Assistant","VA task list","List 20 common tasks a Virtual Assistant handles for entrepreneurs","A task checklist","Use to build your service list"],
["Virtual Assistant","Inbox management SOP","Create a standard operating procedure for managing a client's email inbox","A step-by-step SOP","Customize per client's preferences"],
["Virtual Assistant","VA service packages","Suggest 3 VA service packages (basic, standard, premium)","3 package tiers","Anchor with the premium tier"],
["Virtual Assistant","Tools to learn","List the top tools a beginner VA should learn first","A prioritized tool list","Cross-check with Chapter 9"],
["Virtual Assistant","Client onboarding questions","What questions should I ask a new VA client during onboarding?","A question checklist","Use during your first call"],
["Virtual Assistant","Calendar management tips","Give me best practices for managing an executive's calendar","A best-practices list","Confirm time zones every time"],
["Virtual Assistant","VA niche ideas","Suggest 5 profitable VA niches for a beginner","5 niche ideas","Pick one aligned with your interests"],
["Virtual Assistant","Handle multiple VA clients","Help me create a system to manage tasks across 3 VA clients","A task management system idea","Use one central tracker, not scattered notes"],
["Customer Support","Response templates","Write 5 customer support response templates for common complaints","5 reusable templates","Personalize before sending"],
["Customer Support","De-escalation script","Write a script to de-escalate an angry customer","A calm, structured script","Stay empathetic, not defensive"],
["Customer Support","FAQ creation","Create an FAQ document for [product/service type]","A structured FAQ list","Update regularly based on real tickets"],
["Customer Support","Improve response time","Suggest ways to improve customer support response time","An efficiency checklist","Use canned responses for common issues"],
["Customer Support","Handle refund requests","Write a professional response to a refund request for [scenario]","A policy-compliant response","Always follow company policy first"],
["Customer Support","Support metrics explained","Explain key customer support metrics like CSAT, FRT, and resolution time","A simple explanation of each metric","Track these to prove your value"],
["Customer Support","Upsell in support conversations","Suggest natural ways to upsell during a support conversation","Soft-sell suggestions","Never force an upsell during a complaint"],
["Customer Support","Support tool comparison","Compare Zendesk, Freshdesk, and Intercom for customer support","A pros/cons comparison","Cross-check with Chapter 9"],
["Social Media","Content calendar","Create a 1-month content calendar for [niche] on Instagram","A day-by-day content plan","Batch-create content weekly"],
["Social Media","Caption writing","Write 5 caption options for a post about [topic]","5 caption variations","Add a call-to-action to each"],
["Social Media","Hashtag research","Suggest 20 relevant hashtags for a post about [topic]","A hashtag list","Mix broad and niche hashtags"],
["Social Media","Content repurposing","Help me repurpose this blog post into 3 social media posts: [blog post]","3 platform-adapted posts","Adjust tone per platform"],
["Social Media","Engagement strategy","Suggest 5 ways to increase engagement on [platform] for [niche]","5 engagement tactics","Reply to comments within the first hour"],
["Social Media","Analytics interpretation","Help me interpret these social media analytics and suggest next steps: [data]","An analysis + recommendations","Focus on trends, not single-post results"],
["Social Media","Viral hook ideas","Write 5 scroll-stopping hooks for a video about [topic]","5 hook lines","First 3 seconds matter most"],
["Social Media","Client reporting","Create a monthly social media report template for a client","A report structure","Include metrics + next month's plan"],
["Graphic Design","Design brief template","Create a design brief template to gather requirements from clients","A fillable brief template","Send before starting any project"],
["Graphic Design","Color palette suggestion","Suggest a color palette for a [industry] brand with a [mood] feel","A color palette with hex codes","Test palette in grayscale for contrast"],
["Graphic Design","Font pairing suggestions","Suggest 3 font pairings for a [style] brand","3 font pairing options","Limit to 2 fonts per design"],
["Graphic Design","Design feedback response","Help me respond professionally to vague design feedback: [feedback]","A clarifying response","Ask for specific reference examples"],
["Graphic Design","Portfolio project ideas","Suggest 5 mock design projects to build a graphic design portfolio","5 project briefs","Pick projects relevant to your target niche"],
["Graphic Design","Design trends","Summarize current graphic design trends for [year]","A trend summary","Balance trendy with timeless"],
["Graphic Design","Client revision policy","Help me write a fair revision policy for design projects","A policy statement","Include in every contract/proposal"],
["Graphic Design","File format guide","Explain when to use PNG, JPG, SVG, and PDF for design deliverables","A simple format guide","Always deliver source files too"],
["Programming","Debug code","Help me debug this code and explain the issue: [code]","An explanation + fix","Always share the actual error message"],
["Programming","Explain a concept","Explain [programming concept] with a simple example","A beginner-friendly explanation","Ask for a real-world analogy"],
["Programming","Code review","Review this code for readability and best practices: [code]","Specific improvement suggestions","Good habit before submitting to clients"],
["Programming","Practice project ideas","Suggest 5 beginner project ideas to practice [language/framework]","5 project ideas","Build these for your portfolio"],
["Programming","Write documentation","Write documentation for this function/code: [code]","Clear documentation","Useful for client handoffs"],
["Programming","Learning roadmap","Create a learning roadmap to become job-ready in [language/framework]","A structured roadmap","Pair with Chapter 7"],
["Programming","Client project scoping","Help me scope a freelance project for [type of app/website]","A scope breakdown","Always clarify requirements before quoting"],
["Programming","Explain client requirements","Translate this non-technical client request into technical requirements: [request]","A technical requirement list","Confirm understanding with the client after"],
["Data Analysis","Interpret data","Help me interpret this dataset and identify key trends: [data]","A trend summary","Always sanity-check with the raw data"],
["Data Analysis","Build a report structure","Suggest a structure for a monthly data analysis report","A report template","Include an executive summary at the top"],
["Data Analysis","Choose the right chart","Recommend the best chart type to visualize this data: [data description]","A chart recommendation + reasoning","Match chart type to the story you're telling"],
["Data Analysis","Excel/Sheets formulas","Write a formula to [task, e.g. calculate month-over-month growth] in Google Sheets","A working formula","Test on a small sample first"],
["Data Analysis","Clean messy data","Suggest steps to clean this messy dataset: [data description]","A cleaning checklist","Always keep a backup of raw data"],
["Data Analysis","Explain findings simply","Explain these data findings in simple, non-technical language: [findings]","A plain-language summary","Great for client-facing reports"],
["Data Analysis","KPI dashboard ideas","Suggest key KPIs to track for a [business type]","A KPI list","Focus on 3-5 core KPIs, not everything"],
["Data Analysis","Forecast trends","Help me create a basic forecast based on this historical data: [data]","A trend projection","Always caveat forecasts as estimates"],
["Automation","Identify automation opportunities","Review this workflow and suggest what could be automated: [workflow]","A list of automation opportunities","Start with repetitive, rule-based tasks"],
["Automation","Zapier/Make workflow","Help me design a Zapier/Make automation to [task]","A step-by-step automation flow","Test with sample data before going live"],
["Automation","Email automation","Suggest an email automation sequence for [purpose]","A sequence outline","Keep it short — 3-5 emails to start"],
["Automation","Client onboarding automation","Design an automated onboarding flow for new clients","A workflow outline","Combine forms + email automation"],
["Automation","Social media automation","Suggest tools and workflows to automate social media scheduling","A tool + workflow suggestion","Still review posts before they go live"],
["Automation","Data entry automation","Suggest ways to automate repetitive data entry tasks","Automation suggestions","Cross-check with Chapter 9 tools"],
["Automation","Reporting automation","Help me automate a recurring report using [tool]","A basic automation outline","Automate the pull, review manually before sending"],
["Automation","Automation ROI","Help me calculate whether automating [task] is worth the time investment","A simple ROI estimate","If it saves 2+ hours/month, it's usually worth it"],
["Prompt Engineering","Improve a weak prompt","Improve this prompt to get better AI output: [prompt]","A refined, more specific prompt","Add role, context, and format to any prompt"],
["Prompt Engineering","Role-based prompting","Rewrite this prompt using a 'act as a [role]' framing: [prompt]","A role-framed prompt","Roles improve tone and expertise level"],
["Prompt Engineering","Output format control","Rewrite this prompt to request output in a table format: [prompt]","A format-specific prompt","Specify format explicitly for consistency"],
["Prompt Engineering","Chain of prompts","Help me break this complex task into a chain of smaller prompts: [task]","A multi-step prompt sequence","Great for long-form content or research"],
["Prompt Engineering","Few-shot examples","Help me write a prompt using examples to guide the AI's style: [examples]","A few-shot style prompt","Include 2-3 examples for best results"],
["Prompt Engineering","Reduce AI hallucination","How can I phrase this prompt to reduce inaccurate/made-up information: [prompt]","A more grounded prompt","Ask the AI to say 'I don't know' if unsure"],
["Prompt Engineering","Prompt for consistency","Help me create a reusable prompt template for [recurring task]","A reusable template","Save these in a prompt library"],
["Prompt Engineering","Debug a bad AI output","This AI output was wrong/unhelpful: [output]. Help me figure out what to change in my prompt.","A revised prompt suggestion","Iterate — first prompts are rarely perfect"]
];

/* ---------------- Job Boards (Chapter 5) ---------------- */
// [category, name, description, bestJobs, difficulty, payment, beginnerFriendly]
const JOB_BOARDS = [
["Freelancing (General)","Upwork","Largest general freelance marketplace","VA, writing, design, dev","Medium","Hourly/Fixed via Upwork","Yes"],
["Freelancing (General)","Freelancer.com","Bidding-based freelance platform","Data entry, design, dev","Medium","Fixed/Milestone","Yes"],
["Freelancing (General)","Fiverr","Gig-based marketplace, sellers list services","Design, writing, video, VA","Easy-Medium","Fixed (Gig packages)","Yes"],
["Freelancing (General)","PeoplePerHour","UK-centric freelance marketplace","Writing, design, marketing","Medium","Hourly/Fixed","Yes"],
["Freelancing (General)","Guru","Freelance marketplace with workroom tools","Dev, design, writing","Medium","Hourly/Fixed/Milestone","Yes"],
["Freelancing (General)","Toptal","Highly vetted freelance talent network","Dev, design, finance","Hard","Hourly (Premium)","No"],
["Remote Jobs","We Work Remotely","Popular remote job board","Dev, marketing, support","Medium","Salary/Contract","Somewhat"],
["Remote Jobs","Remote.co","Curated remote job board","VA, support, marketing","Medium","Salary/Contract","Somewhat"],
["Remote Jobs","FlexJobs","Subscription-based vetted job board","All categories","Medium","Salary/Contract","Somewhat"],
["Remote Jobs","Working Nomads","Curated remote job newsletter/board","Dev, marketing, design","Medium","Salary/Contract","Somewhat"],
["Remote Jobs","Remote OK","Large remote job aggregator","Tech, marketing, support","Medium","Salary/Contract","Somewhat"],
["Remote Jobs","JustRemote","Remote job board across industries","Support, dev, design","Medium","Salary/Contract","Somewhat"],
["VA Agencies","Belay","US-based VA/bookkeeping agency","VA, bookkeeping, social media","Medium","Salary/Hourly via agency","Somewhat"],
["VA Agencies","Boldly","Premium subscription-staffing VA agency","Executive VA, marketing","Hard","Hourly via agency","No"],
["VA Agencies","Time Etc","VA agency matching clients to assistants","General VA support","Medium","Hourly via agency","Somewhat"],
["VA Agencies","Prialto","Managed VA service provider","Executive/team VA support","Medium","Salary via agency","Somewhat"],
["VA Agencies","MyOutDesk","VA agency for real estate/sales","VA, sales support","Medium","Salary via agency","Somewhat"],
["Tech","GitHub Jobs / community boards","Developer-focused job listings","Software dev, DevOps","Hard","Salary/Contract","No"],
["Tech","Stack Overflow Jobs","Developer job board tied to Stack Overflow","Dev, engineering","Hard","Salary/Contract","No"],
["Tech","Toptal (Tech)","Elite freelance tech talent network","Dev, engineering, data","Hard","Hourly (Premium)","No"],
["Tech","Turing","AI-matched remote developer jobs","Software dev","Hard","Salary/Contract","No"],
["Tech","Arc.dev","Remote developer job marketplace","Dev, engineering","Medium-Hard","Salary/Contract","Somewhat"],
["Creative","99designs","Design contest and freelance platform","Graphic design, branding","Medium","Fixed (Contest/Direct)","Somewhat"],
["Creative","Behance","Portfolio + job board for creatives","Design, illustration","Medium","Varies (direct hire)","Yes"],
["Creative","Dribbble","Design community with job board","UI/UX, graphic design","Medium","Varies (direct hire)","Somewhat"],
["Creative","Envato Studio","Marketplace for creative freelance services","Design, video, audio","Medium","Fixed","Yes"],
["Marketing","MarketerHire","Vetted marketing freelancer marketplace","Digital marketing, SEO, PPC","Medium-Hard","Hourly via platform","No"],
["Marketing","Growth Collective","Curated growth marketing talent network","Growth marketing, performance ads","Hard","Hourly/Project","No"],
["Marketing","Upwork (Marketing category)","General marketplace, marketing-specific filter","SEO, social media, ads","Medium","Hourly/Fixed","Yes"],
["Marketing","We Work Remotely (Marketing)","Remote job board, marketing filter","Marketing manager, content marketing","Medium","Salary/Contract","Somewhat"],
["Writing","ProBlogger Job Board","Dedicated writing/blogging job board","Blog writing, copywriting","Medium","Fixed/Per word","Yes"],
["Writing","Contena","Curated freelance writing job aggregator","Copywriting, content writing","Medium","Varies","Somewhat"],
["Writing","Textbroker","Content writing marketplace, tiered by skill","Article writing, content","Easy","Per word","Yes"],
["Writing","WriterAccess","Content marketplace connecting writers to brands","Content writing, copywriting","Medium","Per word/project","Somewhat"],
["Translation","ProZ.com","Largest translator marketplace/community","Translation, localization","Medium","Per word/project","Somewhat"],
["Translation","TranslatorsCafe","Translator job board and community","Translation, interpreting","Medium","Per word/project","Yes"],
["Translation","Gengo","Entry-level translation marketplace","Short translation tasks","Easy","Per word","Yes"],
["Translation","Unbabel","AI + human hybrid translation platform","Translation editing","Medium","Per task","Somewhat"],
["Teaching","VIPKid (and similar ESL)","Online English teaching to international students","ESL teaching","Easy-Medium","Per class/hour","Yes"],
["Teaching","Preply","Tutoring marketplace across many subjects","Language/subject tutoring","Easy","Per lesson","Yes"],
["Teaching","Cambly","Casual English conversation practice platform","Conversational English tutoring","Easy","Per minute","Yes"],
["Teaching","Teachable / Udemy (creator)","Course-creation platforms","Course creation, teaching","Medium","Royalty/Sales-based","Somewhat"],
["Customer Support","Working Solutions","Remote customer service contractor network","Customer support, sales support","Medium","Per-call/hour","Yes"],
["Customer Support","Liveops","Virtual call center platform","Customer service, sales","Medium","Per-call/hour","Yes"],
["Customer Support","SupportYourApp","Remote customer/tech support agency","Customer & tech support","Medium","Hourly via agency","Somewhat"],
["Customer Support","Sykes / Foundever","BPO company with remote agent roles","Customer support","Easy-Medium","Hourly (employee)","Yes"],
["Part-Time","FlexJobs (Part-Time filter)","Vetted job board with part-time filter","Various part-time remote roles","Medium","Hourly/Salary","Somewhat"],
["Part-Time","Upwork (Part-time gigs)","Marketplace filtered for smaller/part-time projects","VA, writing, design","Easy-Medium","Hourly/Fixed","Yes"],
["Part-Time","Indeed (Remote + Part-time)","General job board with remote/part-time filters","Various","Medium","Hourly/Salary","Yes"],
["Philippines-Based","OnlineJobs.ph","Largest PH-focused remote job marketplace","VA, support, marketing, admin","Easy-Medium","Direct client arrangement","Yes"],
["Philippines-Based","Kalibrr","PH job platform (local + some remote)","Various local/remote roles","Easy","Salary (employee)","Yes"],
["Philippines-Based","JobStreet Philippines","Major PH job board","Various local/remote roles","Easy","Salary (employee)","Yes"],
["Philippines-Based","VirtualStaff.ph","PH-focused VA/remote staffing platform","VA, support, admin","Easy-Medium","Direct client arrangement","Yes"],
["Worldwide","LinkedIn Jobs","Global professional network + job board","All categories","Medium","Salary/Contract","Somewhat"],
["Worldwide","AngelList (Wellfound)","Startup-focused job board","Tech, marketing, ops","Medium","Salary/Equity/Contract","Somewhat"],
["Worldwide","Jobspresso","Curated remote job board (global)","Marketing, dev, support","Medium","Salary/Contract","Somewhat"],
["Worldwide","Remote.com","Global remote job + EOR platform","Various","Medium","Salary/Contract","Somewhat"]
];

/* ---------------- Interview Questions (Chapter 8) ---------------- */
const INTERVIEW_QUESTIONS = [
["General","Tell me about yourself."],["General","Why do you want to work remotely?"],["General","What are your strengths?"],
["General","What are your weaknesses?"],["General","Why should we hire you over other candidates?"],["General","What are your salary expectations?"],
["General","Where do you see yourself in 2-3 years?"],
["Behavioral","Tell me about a time you handled a difficult situation."],["Behavioral","Describe a time you made a mistake at work — what happened?"],
["Behavioral","Tell me about a time you had to meet a tight deadline."],["Behavioral","Describe a conflict you had with a coworker/client and how you resolved it."],
["Behavioral","Tell me about a time you went above and beyond for a client."],["Behavioral","Describe a time you received critical feedback — how did you respond?"],
["Behavioral","Tell me about a time you had to learn something new quickly."],
["Customer Support","How do you handle an angry customer?"],["Customer Support","What does great customer service mean to you?"],
["Customer Support","Describe a time you resolved a difficult complaint."],["Customer Support","How do you handle a customer who won't stop escalating?"],
["Customer Support","What CRM/support tools have you used?"],["Customer Support","How do you maintain quality when handling high ticket volume?"],
["Customer Support","How would you handle a customer asking for a refund outside policy?"],
["Virtual Assistant","What tools do you use for calendar and email management?"],["Virtual Assistant","How do you prioritize tasks across multiple clients?"],
["Virtual Assistant","Describe your experience managing an executive's inbox."],["Virtual Assistant","How do you handle confidential information?"],
["Virtual Assistant","What's your process for onboarding with a new client?"],["Virtual Assistant","How do you communicate progress/updates to clients?"],
["Virtual Assistant","Describe a time you caught an error before it became a problem."],
["Project Management","How do you track project timelines and deliverables?"],["Project Management","Describe a project that fell behind schedule — how did you handle it?"],
["Project Management","What project management tools have you used?"],["Project Management","How do you handle competing priorities from stakeholders?"],
["Project Management","How do you communicate risks to a client or team?"],["Project Management","Describe your process for running a status meeting."],
["Project Management","How do you handle scope changes mid-project?"],
["Remote Work","What does your home workspace setup look like?"],["Remote Work","How do you stay productive without direct supervision?"],
["Remote Work","How do you handle time zone differences with clients?"],["Remote Work","What's your internet/backup setup like?"],
["Remote Work","How do you separate work and personal life at home?"],["Remote Work","Describe a time technology failed you mid-task — what did you do?"],
["Remote Work","What tools do you use to stay organized remotely?"],
["Leadership","Describe a time you led a project or team."],["Leadership","How do you motivate others during a difficult project?"],
["Leadership","How do you handle underperformance in a team member?"],["Leadership","Describe your leadership/management style."],
["Leadership","How do you delegate tasks effectively?"],["Leadership","Tell me about a time you had to make an unpopular decision."],
["Leadership","How do you build trust with a new team?"],
["Technical","Walk me through your technical skill set relevant to this role."],["Technical","Describe a technical problem you solved recently."],
["Technical","How do you stay updated with new tools/technologies?"],["Technical","What's your process for testing/QA before delivering work?"],
["Technical","Describe a time a client's technical request was unclear — how did you clarify it?"],["Technical","What tools/software are you most proficient in?"],
["Technical","How do you handle a task requiring a skill you don't have yet?"],
["AI","How do you currently use AI tools in your work?"],["AI","Give an example of how AI improved your output quality or speed."],
["AI","How do you fact-check or verify AI-generated content?"],["AI","What's your process for prompting AI effectively?"],
["AI","How comfortable are you learning new AI tools?"],["AI","Describe a task you automated using AI or other tools."],
["AI","What are the limitations of AI tools you're aware of?"],
["Problem Solving","Describe a complex problem you solved with limited resources."],["Problem Solving","How do you approach a task with unclear instructions?"],
["Problem Solving","Tell me about a time you had to think creatively to solve an issue."],["Problem Solving","How do you decide when to ask for help versus solving it yourself?"],
["Problem Solving","Describe a time you identified a problem before it was reported to you."],["Problem Solving","How do you handle repeated errors in your own work?"],
["Problem Solving","What's your process for troubleshooting an issue?"],
["Salary","What are your rate/salary expectations for this role?"],["Salary","How do you determine your rates as a freelancer?"],
["Salary","Are you open to negotiation on rate?"],["Salary","What's included in your rate (revisions, tools, etc.)?"],
["Salary","How do you handle a client wanting to lower your rate mid-project?"],["Salary","What's your policy on overtime or rush work pricing?"],
["Salary","How often do you review/adjust your rates?"],
["Culture Fit","What type of work environment do you thrive in?"],["Culture Fit","How do you handle feedback and criticism?"],
["Culture Fit","What are your core work values?"],["Culture Fit","How do you build relationships with remote teammates/clients?"],
["Culture Fit","Describe your ideal manager or client relationship."],["Culture Fit","How do you handle disagreements with company decisions?"],
["Culture Fit","What motivates you in your work?"],
["Final Interview","Why do you want this specific role/company over others?"],["Final Interview","What questions do you have for us?"],
["Final Interview","What would make you decline this offer if extended?"],["Final Interview","How soon are you available to start?"],
["Final Interview","What do you need from us to be successful in this role?"],["Final Interview","Is there anything from earlier interviews you'd like to add or clarify?"],
["Final Interview","What are your expectations for the first 90 days?"],
["HR","Walk me through your employment/freelance history."],["HR","Why did you leave your last role/client?"],
["HR","Do you have any gaps in your work history you'd like to explain?"],["HR","What's your availability (hours/days per week)?"],
["HR","Do you have any conflicts of interest with other clients?"],["HR","What's your preferred method and schedule of communication?"],
["Manager","How do you like to receive feedback from a manager?"],["Manager","What kind of support do you need to do your best work?"],
["Manager","How do you handle being managed remotely vs. in-person?"],["Manager","Describe your ideal check-in/reporting cadence."],
["Manager","What would you do in your first 2 weeks in this role?"],["Manager","How do you handle unclear or shifting priorities from management?"]
];

/* ---------------- AI Tools Cheat Sheet (Chapter 9) ---------------- */
// [category, tool, description, pricing, freePlan, bestUse, website]
const AI_TOOLS = [
["Writing","ChatGPT","General-purpose AI writing/chat assistant","Free/Paid","Yes","Drafting, editing, brainstorming","chat.openai.com"],
["Writing","Claude","AI assistant strong at long-form writing/reasoning","Free/Paid","Yes","Long documents, nuanced writing","claude.ai"],
["Writing","Grammarly","Grammar and clarity checker","Free/Paid","Yes","Proofreading","grammarly.com"],
["Writing","Jasper","AI copywriting tool for marketing content","Paid","No","Marketing copy, ads","jasper.ai"],
["Research","Perplexity","AI-powered answer engine with citations","Free/Paid","Yes","Quick research with sources","perplexity.ai"],
["Research","Google Scholar","Academic research search engine","Free","Yes","Academic/credible sourcing","scholar.google.com"],
["Research","Consensus","AI search engine for scientific research","Free/Paid","Yes","Evidence-based research questions","consensus.app"],
["Presentation","Gamma","AI-generated presentations/docs","Free/Paid","Yes","Fast slide deck creation","gamma.app"],
["Presentation","Canva Presentations","Presentation design tool with AI features","Free/Paid","Yes","Branded, visual presentations","canva.com"],
["Presentation","Beautiful.ai","AI-assisted slide design tool","Paid","Trial only","Professional business decks","beautiful.ai"],
["Graphic Design","Canva","Drag-and-drop design tool","Free/Paid","Yes","Social posts, simple graphics","canva.com"],
["Graphic Design","Adobe Firefly","AI image generation integrated with Adobe tools","Free/Paid","Yes","AI-generated graphics/edits","firefly.adobe.com"],
["Graphic Design","Midjourney","AI image generation via Discord","Paid","Limited trial","Concept art, creative visuals","midjourney.com"],
["Video","CapCut","Video editing app with AI features","Free/Paid","Yes","Short-form video editing","capcut.com"],
["Video","Descript","AI video/audio editing via text transcript","Free/Paid","Yes","Podcast/video editing by editing text","descript.com"],
["Video","Runway","AI video generation and editing","Paid","Limited trial","AI video effects, generation","runwayml.com"],
["Audio","ElevenLabs","AI voice generation/cloning","Free/Paid","Yes","Voiceovers, narration","elevenlabs.io"],
["Audio","Audacity","Free audio editing software","Free","Yes","Basic audio editing/cleanup","audacityteam.org"],
["Audio","Descript (Audio)","Text-based audio editing","Free/Paid","Yes","Podcast editing","descript.com"],
["Automation","Zapier","No-code automation between apps","Free/Paid","Yes","Connecting apps/workflows","zapier.com"],
["Automation","Make","Visual workflow automation builder","Free/Paid","Yes","Complex multi-step automations","make.com"],
["Automation","n8n","Open-source workflow automation tool","Free/Paid","Yes","Self-hosted or advanced automation","n8n.io"],
["Coding","GitHub Copilot","AI coding assistant/autocomplete","Paid","Free for students","In-editor code suggestions","github.com/features/copilot"],
["Coding","Claude (Coding use)","AI assistant strong at code explanation/debugging","Free/Paid","Yes","Debugging, code review, explanations","claude.ai"],
["Coding","Replit","Cloud-based coding environment with AI features","Free/Paid","Yes","Quick prototyping, learning to code","replit.com"],
["Data Analysis","Google Sheets","Spreadsheet tool with formulas + AI features","Free","Yes","Basic data analysis/tracking","sheets.google.com"],
["Data Analysis","Julius AI","AI-powered data analysis chatbot","Free/Paid","Yes","Chat-based data analysis","julius.ai"],
["Data Analysis","Tableau","Data visualization and BI tool","Paid","Free trial","Advanced dashboards/visualization","tableau.com"],
["Marketing","HubSpot","All-in-one marketing/CRM platform","Free/Paid","Yes","Email marketing, CRM basics","hubspot.com"],
["Marketing","Mailchimp","Email marketing platform","Free/Paid","Yes","Email campaigns/automation","mailchimp.com"],
["Marketing","SEMrush","SEO and marketing research tool","Paid","Limited trial","Keyword/competitor research","semrush.com"],
["CRM","HubSpot CRM","Free CRM with marketing integration","Free/Paid","Yes","Client/lead tracking","hubspot.com"],
["CRM","Pipedrive","Sales-focused CRM pipeline tool","Paid","Trial only","Visual sales pipeline management","pipedrive.com"],
["CRM","Notion (as CRM)","Flexible workspace tool used as a CRM","Free/Paid","Yes","Simple client tracking for freelancers","notion.so"],
["Productivity","Notion","All-in-one workspace/notes/task tool","Free/Paid","Yes","Notes, planning, client docs","notion.so"],
["Productivity","Trello","Kanban-style task board","Free/Paid","Yes","Simple task/project tracking","trello.com"],
["Productivity","Todoist","Task management app","Free/Paid","Yes","Daily to-do tracking","todoist.com"],
["Scheduling","Calendly","Automated meeting scheduling tool","Free/Paid","Yes","Client booking links","calendly.com"],
["Scheduling","Google Calendar","Calendar and scheduling tool","Free","Yes","Basic scheduling/reminders","calendar.google.com"],
["Scheduling","Doodle","Group scheduling/poll tool","Free/Paid","Yes","Finding meeting times across groups","doodle.com"],
["Email","Gmail","Email platform with smart features","Free/Paid","Yes","Primary business email","gmail.com"],
["Email","Superhuman","Premium fast email client","Paid","No","High-volume inbox management","superhuman.com"],
["Email","Mailwarm","Email deliverability warming tool","Paid","Trial only","Improving cold email deliverability","mailwarm.up"],
["Meeting Notes","Otter.ai","AI meeting transcription tool","Free/Paid","Yes","Auto-transcribing calls/meetings","otter.ai"],
["Meeting Notes","Fireflies.ai","AI meeting notetaker and summarizer","Free/Paid","Yes","Meeting summaries + action items","fireflies.ai"],
["Meeting Notes","Notion AI","AI note summarization within Notion","Paid add-on","Limited","Summarizing notes/docs","notion.so"],
["Website Builder","Carrd","Simple one-page website builder","Free/Paid","Yes","Quick portfolio/landing pages","carrd.co"],
["Website Builder","Wix","Drag-and-drop website builder","Free/Paid","Yes","Full personal/business websites","wix.com"],
["Website Builder","Webflow","Advanced no-code website builder","Free/Paid","Yes","Professional, custom-designed sites","webflow.com"],
["Resume","Kickresume","AI resume builder with templates","Free/Paid","Yes","Fast resume formatting","kickresume.com"],
["Resume","Jobscan","ATS resume scanning tool","Free/Paid","Yes","Checking resume-to-job-post match","jobscan.co"],
["Resume","Rezi","AI-powered ATS resume builder","Free/Paid","Yes","ATS-optimized resume creation","rezi.ai"],
["Portfolio","Behance","Creative portfolio hosting platform","Free","Yes","Design/creative portfolios","behance.net"],
["Portfolio","Journo Portfolio","Portfolio builder for writers/journalists","Free/Paid","Yes","Writing portfolios","journoportfolio.com"],
["Portfolio","GitHub Pages","Free static site hosting for developers","Free","Yes","Developer portfolios","pages.github.com"],
["Learning","YouTube","Free video learning platform","Free","Yes","Learning any skill for free","youtube.com"],
["Learning","Coursera","Online courses from universities","Free/Paid","Yes (audit)","Structured, credentialed learning","coursera.org"],
["Learning","Udemy","Affordable skills-based course platform","Paid","Free previews","Practical skill-building courses","udemy.com"]
];

/* ---------------- Salary Guide (Chapter 14) ---------------- */
const SALARY_RATES = [
["Virtual Assistant","$3–$6/hr","$7–$12/hr","$13–$25+/hr"],
["Graphic Designer","$5–$10/hr","$12–$20/hr","$25–$50+/hr"],
["Developer","$8–$15/hr","$20–$35/hr","$40–$100+/hr"],
["Bookkeeper","$5–$10/hr","$12–$20/hr","$25–$40+/hr"],
["Video Editor","$5–$10/hr","$12–$22/hr","$25–$45+/hr"],
["Customer Support","$3–$6/hr","$7–$12/hr","$13–$20+/hr"],
["Project Manager","$6–$12/hr","$15–$25/hr","$30–$50+/hr"],
["Digital Marketing","$6–$12/hr","$15–$25/hr","$30–$60+/hr"],
["Copywriter","$5–$10/hr","$12–$22/hr","$25–$50+/hr"],
["Appointment Setter","$3–$6/hr","$7–$12/hr","$13–$18+/hr"],
["Social Media Manager","$5–$10/hr","$12–$20/hr","$22–$40+/hr"]
];
const INCOME_PROGRESSION = [
["Month 1-3 (Beginner)","$5/hr","20 hrs","~$400/month"],
["Month 4-6 (Building Portfolio)","$8/hr","25 hrs","~$800/month"],
["Month 7-12 (Intermediate)","$10/hr","30 hrs","~$1,200/month"],
["Year 2 (Established)","$15/hr","30-35 hrs","~$1,800-$2,100/month"],
["Year 3+ (Expert/Niche Specialist)","$20-$25/hr","30-35 hrs","~$2,400-$3,500/month"]
];

/* ---------------- Proposal Templates (Chapter 11) ---------------- */
const PROPOSAL_TEMPLATES = {
  Upwork: {
    short: "Hi {client}, I noticed you need help with {need}. I've done similar work for {pastClient}, achieving {result}. I'd love to help — happy to answer any questions or start with a small trial task.\n\nBest, {name}",
    long: "Hi {client},\n\nI noticed you're looking for {need} — this is exactly the kind of work I specialize in. In my recent project with {pastClient}, I {action} which resulted in {result}.\n\nHere's how I'd approach your project:\n1. {step1}\n2. {step2}\n3. {step3}\n\nI'm available to start {timeframe} and can commit {hours}. I'd love to answer any questions — happy to hop on a quick call if useful.\n\nBest, {name}",
    premium: "Hi {client},\n\nYour project caught my attention because {detail}. I've spent {experience} specializing in exactly this kind of work, most recently helping {pastClient} achieve {result}.\n\nBased on your post, here's an initial strategy I'd bring to your project:\n- Phase 1: {step1}\n- Phase 2: {step2}\n- Phase 3: {step3}\n\nI've attached my portfolio showing similar work. I typically work with clients on a project/retainer basis and can discuss pricing tailored to your scope. Let's set up a quick call this week to align on details.\n\nBest, {name}"
  },
  "Freelancer.com": {
    short: "Hello, I can complete {need} efficiently and accurately. I have experience with {skill} and can start immediately. Happy to discuss further.\n\n{name}",
    long: "Hello {client},\n\nI read through your project description for {need} and I'm confident I can deliver quality results quickly. I've handled similar projects involving {experience}, consistently delivering {result}.\n\nMy approach would be: {step1}. I'm available to start right away and can provide a sample or previous work upon request.\n\nLooking forward to discussing further.\n\n{name}",
    premium: "Hello {client},\n\nYour project stood out to me because {detail}. With {experience} of experience in {skill}, I've consistently delivered {result} for clients with similar needs.\n\nI'd suggest the following approach: {step1}, {step2}. I can provide milestone check-ins throughout to ensure alignment, and I'm happy to share references from past clients on request.\n\nI'm available to begin immediately and would welcome a call to discuss your specific goals in more detail.\n\n{name}"
  },
  "OnlineJobs.ph": {
    short: "Good day! I'm interested in the {need} position. I have experience with {skill} and am confident I can meet your needs. I'm available to start immediately and can work {hours}.\n\n{name}",
    long: "Good day {client},\n\nI'm excited to apply for the {need} position. I have {experience} of experience in {skill}, including {result}. I'm reliable, detail-oriented, and comfortable working independently with minimal supervision.\n\nI'm available {hours} during {timeframe} and can start immediately. I've attached my resume/portfolio for your review and would welcome the opportunity to discuss further.\n\nThank you for your time and consideration.\n\n{name}",
    premium: "Good day {client},\n\nI'm applying for the {need} position with {experience} of relevant experience, including {result}. I understand the importance of reliability and clear communication when working with international clients, and I've built my workflow specifically around that.\n\nI'm available for a trial period or paid test task to demonstrate my skills before any long-term commitment. I'm flexible with schedule and can adjust to your timezone as needed.\n\nI'd welcome a short interview call at your convenience to discuss how I can support your business.\n\n{name}"
  },
  "Direct Client": {
    short: "Hi {client}, I help {targetAudience} with {skill} — recently helped {pastClient} achieve {result}. Would love to see if I could help you with something similar. Open to a quick chat?\n\n{name}",
    long: "Hi {client},\n\nI came across your business and noticed {detail}. I specialize in helping businesses like yours with {skill}, and recently helped {pastClient} achieve {result}.\n\nI'd love to learn more about your current challenges with {need} and share a few ideas on how I could help — no pressure, just a conversation. Would you be open to a 15-minute call this week?\n\n{name}",
    premium: "Hi {client},\n\nI've been following your business and really admire {detail}. I noticed an opportunity around {need} that I believe could help you {result}.\n\nI specialize in {skill} for businesses in your industry, and I've helped clients like {pastClient} achieve {result}. I'd love to put together a short, tailored proposal for your business — would you be open to a brief call to discuss your goals first?\n\n{name}"
  },
  "Cold Outreach": {
    short: "Hi {client}, I help {targetAudience} with {skill}. Noticed you might benefit from {need} — happy to share more if useful.\n\n{name}",
    long: "Hi {client},\n\nI hope this message finds you well. I specialize in helping {targetAudience} with {skill}, and I noticed {detail} that made me think there could be an opportunity to {result}.\n\nI recently helped {pastClient} achieve {result} with a similar approach. I'd love to share a few quick ideas tailored to your business — no obligation, just value. Would you be open to a short conversation?\n\n{name}",
    premium: "Hi {client},\n\nI've been researching businesses in your industry and yours stood out because of {detail}. I help businesses like yours {result}, and recently delivered {result} for a similar client.\n\nI've put together a couple of quick ideas specific to what I noticed about your business — happy to share them even before we talk, no strings attached. Would a quick call work to explore this further?\n\n{name}"
  }
};

/* ---------------- Worksheets/Trackers config ---------------- */
const TRACKERS = [
  { id:"jobApp", title:"📄 Job Application Tracker", cols:["Date","Company/Client","Role","Platform","Status","Follow-up Date","Notes"] },
  { id:"interviewTracker", title:"🎤 Interview Tracker", cols:["Date","Company/Client","Role","Interview Stage","Outcome","Key Notes/Learnings"] },
  { id:"learningTracker", title:"📚 Learning Tracker", cols:["Skill","Resource","Start Date","Target Completion","Progress (%)","Notes"] },
  { id:"incomeTracker", title:"💰 Income Tracker", cols:["Month","Client","Amount Earned","Payment Method","Notes"] },
  { id:"clientTracker", title:"🤝 Client Tracker", cols:["Client Name","Contact Info","Project/Service","Rate","Status","Payment Terms","Notes"] }
];
const HABIT_TRACKER_ROWS = ["Applied to 1+ job/pitch","20-min LinkedIn routine","Learned/practiced a skill","Reviewed tracker sheets","No-phone deep work block"];
const HABIT_TRACKER_DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

module.exports = {
  CHAPTERS, ROADMAP, CHALLENGE_DAILY, CHALLENGE_MONTHS, CHALLENGE_FINAL_QUESTIONS,
  PROMPT_CATEGORIES, PROMPTS, JOB_BOARDS, INTERVIEW_QUESTIONS, AI_TOOLS,
  SALARY_RATES, INCOME_PROGRESSION, PROPOSAL_TEMPLATES, TRACKERS,
  HABIT_TRACKER_ROWS, HABIT_TRACKER_DAYS,
};

<div align="center">

<img src="idea-spark/public/logo.png" alt="BeforeYouBuild Logo" width="400"/>

<br/>

# BeforeYouBuild

### **Know if your startup idea is worth building. In 60 seconds.**

Stop wasting months on ideas nobody wants. Get an AI-powered market validation report — competitor analysis, market sizing, MVP roadmap — before you write a single line of code.

<br/>

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Claude AI](https://img.shields.io/badge/Claude-Sonnet_4_+_Haiku_4.5-CC785C?style=for-the-badge&logo=anthropic&logoColor=white)](https://anthropic.com)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_+_DB-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)

<br/>

[🚀 **Live Demo**](#) · [📖 **Setup Guide**](#-quick-start) · [🐛 **Report Bug**](https://github.com/Suraj-kummar/BeforeYouBuild.com/issues) · [💡 **Request Feature**](https://github.com/Suraj-kummar/BeforeYouBuild.com/issues)

</div>

---

## 🎯 The Real Problem We're Solving

Every day, thousands of founders waste **months building products nobody wants**.

> A student in Pune spends 6 months building a food delivery app → launches → gets 0 users.  
> Why? He never validated if the market actually wanted it.

**BeforeYouBuild fixes this.** Type your idea, get a full AI market research report in 60 seconds — before writing a single line of code.

### Who uses this?
| 🎓 College Students | 🚀 First-time Founders | 💼 Freelancers & SaaS Builders |
|---|---|---|
| Have a startup idea but don't know if it's worth building before dropping semesters on it | Before pitching to investors, validate your assumptions with real market data | Unsure about competition? Get clarity on your niche instantly |

---

## ✨ Features

### 🤖 AI-Powered Market Validation
- Uses **Claude Sonnet 4** with live **web search** to research your idea in real time
- Returns a brutally honest, structured report — not generic fluff
- India-first context: UPI, kirana, tier-2, D2C, and more

### ⚡ Spark — Floating AI Chat Agent
A persistent AI advisor that lives on every page of the site:
- Powered by **Claude Haiku 4.5** for fast, cheap conversational responses
- **Spark persona** — a YC-trained startup advisor, sharp and direct
- Nudge bubble appears after 8 seconds to prompt engagement
- Starter prompts, full conversation history, unread dot indicator
- One-click link to the full validation report from inside the chat

### 📊 Full Validation Report (7 Scored Sections)
| Section | What You Get |
|---------|-------------|
| 🔥 **Verdict** | HOT / CAUTION / DEAD — one sharp sentence why |
| 📈 **Scores** | Market Size, Competition, Timing, Buildability (each /10) |
| 🎯 **The Problem** | Who feels it daily, current solutions, payment moment |
| 👤 **Ideal Customer** | ICP profile, where they hang out, what they currently use |
| 💰 **Market Size** | TAM / SAM / SOM with India-first context |
| ⚔️ **Competitors** | Top 3 with weaknesses and threat levels (HIGH/MEDIUM/LOW) |
| 🛠️ **MVP Roadmap** | 3 core features + first 100 users acquisition playbook |

### 🎨 Premium UI / Design System
- Animated **dot-grid hero** background with floating colour blobs
- **Live idea counter** with count-up animation (2,847+ validated)
- **Typing placeholder** in the textarea — cycles through 5 startup ideas with a blinking cursor
- **Scrolling ticker** bar showing recent HOT / CAUTION / DEAD verdicts
- **AI Live Terminal** mockup that streams analysis steps and loops automatically
- **"What AI Analyses" grid** — 7 coloured cards, one per report section
- **Scroll-reveal** on every section (IntersectionObserver, no library)
- **Animated score bars** on sample report cards (CSS `@property` + keyframes)
- **Rotating gradient CTA border** (conic-gradient via `@property`)
- **Animated star ratings** that pop in one by one on scroll
- **Nav scroll-state** — stronger blur + glow shadow after 50 px scroll
- **Newsletter row** in footer with success state

### 💳 Pricing Tiers
| Free | Pro — ₹499/mo | Startup — ₹1,499/mo |
|------|--------------|---------------------|
| 2 validations/month | Unlimited validations | Everything in Pro |
| Full AI report | PDF export | 5-seat team access |
| Web view | Saved history (30 reports) | API access |
| — | Priority AI model | Priority support (2h SLA) |

### 🔐 Authentication
- **Google OAuth** via Supabase
- **Magic Link** email login (no password needed)
- Free-tier usage tracking per user per month

---

## 🛠️ Tech Stack

```
Frontend       →  React 19 + TanStack Router + TanStack Start
Styling        →  Tailwind CSS v4 + Custom Design System
AI (Reports)   →  Claude Sonnet 4 (claude-sonnet-4-20250514) + Web Search Tool
AI (Agent)     →  Claude Haiku 4.5 (claude-haiku-4-5) — fast chat responses
Auth + DB      →  Supabase (Google OAuth + Magic Link + Postgres)
Payments       →  Stripe (Checkout + Webhooks)
Build          →  Vite 7 + Bun
Deploy         →  Cloudflare Workers (via Wrangler)
Typography     →  Space Grotesk (headings) + Inter (body) — Google Fonts
```

---

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh) installed (`curl -fsSL https://bun.sh/install | bash`)
- A [Supabase](https://supabase.com) project
- An [Anthropic](https://console.anthropic.com) API key ← **required for both validator + Spark agent**

### 1. Clone the repo
```bash
git clone https://github.com/Suraj-kummar/BeforeYouBuild.com.git
cd BeforeYouBuild.com/idea-spark
```

### 2. Install dependencies
```bash
bun install
```

### 3. Configure environment variables
```bash
cp .env.example .env.local
```

Fill in `.env.local`:
```env
# ── Supabase ───────────────────────────────────
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# ── Anthropic (Claude AI) ──────────────────────
# Powers BOTH the full validator AND the Spark AI agent
ANTHROPIC_API_KEY=sk-ant-your-key-here

# ── Stripe (optional for payments) ────────────
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_STARTUP_PRICE_ID=price_...

# ── App URL ────────────────────────────────────
APP_URL=http://localhost:8080
```

### 4. Run locally
```bash
bun run dev
```

Open [http://localhost:8080](http://localhost:8080) 🎉

> **Note:** Restart the dev server after editing `.env.local` — environment variables only load at startup.

---

## 📁 Project Structure

```
idea-spark/
├── public/
│   ├── logo.png                 # Full wordmark logo
│   └── logo-icon.png            # Icon / favicon
├── src/
│   ├── components/
│   │   ├── AIAgent.tsx          # ⚡ Spark — floating AI chat agent (new)
│   │   ├── SiteNav.tsx          # Sticky navbar with scroll-state + mobile menu
│   │   └── SiteFooter.tsx       # Footer with newsletter row + social icons
│   ├── lib/
│   │   ├── agent.ts             # ⚡ Claude Haiku server fn for Spark chat (new)
│   │   ├── validate.ts          # Claude Sonnet + web search server fn
│   │   ├── supabase.ts          # Supabase client + auth + usage tracking
│   │   ├── checkout.ts          # Stripe checkout session server fn
│   │   └── stripe.ts            # Stripe webhook handlers
│   ├── hooks/
│   │   └── useSubscription.ts   # Current user plan hook
│   ├── routes/
│   │   ├── __root.tsx           # Root layout — mounts AIAgent globally
│   │   ├── index.tsx            # Landing page (hero, ticker, AI terminal, CTA)
│   │   ├── app.tsx              # Idea input + loading stepper
│   │   ├── report.tsx           # Full validation report (7 sections)
│   │   ├── report.$id.tsx       # Shareable report by ID
│   │   ├── history.tsx          # Saved reports history
│   │   ├── pricing.tsx          # Pricing tiers + comparison + FAQ
│   │   ├── login.tsx            # Google + magic link auth
│   │   └── checkout/            # Stripe checkout success/cancel pages
│   └── styles.css               # Design system — dark theme, animations, utilities
├── .env.example                 # Environment variable template
└── vite.config.ts               # Vite + TanStack Router + Cloudflare config
```

---

## 🎨 Design System

Built on a **premium dark-first** design system with a full emerald green brand identity.

```css
Background:    #0A0A0A   (near black)
Surface:       #111111   (card backgrounds)
Surface+:      #161616   (elevated elements)
Primary:       #10B981   (emerald green)
Primary Glow:  #34D399   (lighter emerald)
Text:          #FAFAFA   (near white)
Muted:         #737373   (secondary text)
Destructive:   #EF4444   (red — "DEAD" verdict)
Warning:       #F59E0B   (amber — "CAUTION" verdict)
```

### Animations

| Utility | Effect |
|---|---|
| `animate-fade-up` | Element slides up + fades in on load |
| `animate-scale-in` | Element scales from 96% → 100% |
| `text-shimmer` | Gradient headline sweeps continuously |
| `animate-float` | Gentle bob up/down (floating icons) |
| `animate-blob` | Organic shape morphing background blobs |
| `animate-ticker` | Infinite horizontal scroll ticker |
| `animate-glow-border` | Pulsing emerald border glow |
| `cta-spin-border` | Rotating conic-gradient border via `@property` |
| `bar-fill-anim` | Score bar fills from 0 → target % on scroll |
| `star-anim` | Stars pop in one-by-one with spring easing |
| `reveal` / `reveal-left` / `reveal-right` | Scroll-reveal via IntersectionObserver |
| `dot-grid` | Animated dot-grid background (pure CSS) |
| `nav-scrolled` | Stronger blur + glow applied after 50px scroll |

---

## 🔌 Claude API Integration

### Full Validator (`validate.ts`)
Uses **Claude Sonnet 4** with the **web search beta tool** for real-time market research:

```typescript
export const validateIdea = createServerFn({ method: "POST" })
  .handler(async ({ data }) => {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      headers: {
        "anthropic-beta": "web-search-2025-03-05",  // 🔍 Live web search
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        tools: [{ type: "web_search_20250305", max_uses: 5 }],
        // Returns strict JSON with all 7 report sections
      }),
    });
  });
```

**System Prompt:** YC-trained startup analyst — brutally honest, India-aware, returns strict JSON.

### Spark AI Agent (`agent.ts`)
Uses **Claude Haiku 4.5** for fast, cheap chat responses:

```typescript
export const chatWithAgent = createServerFn({ method: "POST" })
  .handler(async ({ data }) => {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      body: JSON.stringify({
        model: "claude-haiku-4-5",   // Fast + affordable for chat
        max_tokens: 512,
        system: AGENT_SYSTEM_PROMPT, // "Spark" persona — YC advisor
        messages: data.messages,     // Conversation history (last 10)
      }),
    });
  });
```

**Persona:** "Spark" — a sharp, friendly AI startup advisor. Speaks like a smart YC-batch friend. Short, punchy answers. India-aware.

---

## 🗺️ Roadmap

- [x] Landing page with sample reports
- [x] AI validation with Claude Sonnet + web search
- [x] Full 7-section validation report
- [x] Supabase Google + magic link auth
- [x] Pricing page (Free / Pro / Startup)
- [x] Premium dark design system
- [x] Logo + favicon
- [x] Animated landing page (ticker, terminal, score bars, reveal)
- [x] **Spark AI agent** — floating chat on every page
- [x] Shareable report links
- [x] Saved report history
- [ ] Stripe payments (in progress)
- [ ] PDF export for Pro users
- [ ] Team collaboration (Startup tier)
- [ ] API access for developers
- [ ] Mobile app (React Native)

---

## 📦 Download as Parts

The full project is also available as **20 split archives** for easy sharing:

```
idea-spark-parts/
├── BeforeYouBuild.part01.bin  (~47 KB)
├── BeforeYouBuild.part02.bin
├── ...
└── BeforeYouBuild.part20.bin
```

**Reassemble on Mac/Linux:**
```bash
cat BeforeYouBuild.part*.bin > full.zip && unzip full.zip
```

**Reassemble on Windows (PowerShell):**
```powershell
$parts = Get-ChildItem "BeforeYouBuild.part*.bin" | Sort-Object Name
$out = [IO.File]::Create("full.zip")
foreach ($p in $parts) { $b = [IO.File]::ReadAllBytes($p.FullName); $out.Write($b,0,$b.Length) }
$out.Close(); Expand-Archive full.zip .
```

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 👤 Author

**Suraj Kumar**

Built by a student, priced for founders. 🇮🇳

[![GitHub](https://img.shields.io/badge/GitHub-Suraj--kummar-181717?style=flat-square&logo=github)](https://github.com/Suraj-kummar)

---

<div align="center">

**If this helped you validate a real idea, give it a ⭐**

*Stop building. Start validating.*

</div>

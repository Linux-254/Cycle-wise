# Cyclewise — Master Pitch Deck Prompt for Claude
> **Framework:** Guy Kawasaki 10-Slide Pitch Method (EY Challenge Innovation Standard)

This document contains both the **explanation of the PDF pitch structure** and the **complete Master Claude Prompt** designed to generate a pitch deck and presentation script for **Cyclewise**.

---

## 📊 Overview: The Guy Kawasaki / EY 10-Slide Pitch Framework

The provided PDF follows the famous **Guy Kawasaki 10-Slide Pitch Method**, augmented by EY for innovation challenges. The core philosophy is **Show > Tell**, focusing on solving the client's #1 pain with "underlying magic" technology, clear unit economics, and 10x differentiation.

### The 10 Slides + Cover & Closing:
1. **Title / Cover:** Company logo, name, challenge purpose ("Challenge Innovation Presentation"), slogan, presenter details, date.
2. **Problem / Opportunity:** Focus on the client's #1 burning pain (not 4th or 10th). Show the inefficiencies of current status-quo alternatives.
3. **Value Proposition:** A punchy 1-liner covering: (a) Product/Service, (b) Core pain solved, (c) Big vision.
4. **Underlying Magic / Technology:** Show > Tell! Diagram the secret sauce (Multi-Model AI + Bounded DFS Graph Search + Dual M-Pesa Escrow + KRA Vouchers). Transition directly to the live prototype.
5. **Business Model:** Who has your money temporarily, pricing model (1.5% clearing fee), unit math ($100 \text{ Clients} \times A \text{ Units} \times B \text{ Fee}$), ARPU, LTV.
6. **Go-To-Market Plan (TAM):** Target market size ($7.4\text{M}$ Kenya SMEs, 50k Nairobi MSMEs), customer profile, low-cost acquisition strategy.
7. **Competitive Analysis:** Position against status quo (shylocks @ 20%/mo interest, bank loans, direct barter). Explain why Cyclewise is **10x better**, not just 3x better.
8. **Team:** Core founders, relevant experience, war stories, why this team can execute.
9. **Financial Projections & Key Metrics:** Conservative 3-to-5 year forecast, client growth, free vs paid conversion, unit economics.
10. **Current Status, Timeline & Use of Funds:** Milestones achieved (Live Vercel prototype, 13/13 unit tests passed, M-Pesa sandbox integration), roadmap, funding ask.
11. **Closing Slide:** Logo big & in center, live site link (`https://cycle-wise-mocha.vercel.app/`), presenter contact info, Q&A invite.

---

## 🤖 Copy & Paste Master Prompt for Claude

Below is the complete prompt. Copy everything inside the box below and paste it directly into Claude:

```text
You are a world-class venture capitalist, pitch coach, and startup storyteller expert in the Guy Kawasaki 10-Slide Pitch Method (EY Challenge Innovation Standard).

Your task is to create a complete, high-converting 10-Slide Pitch Deck Content Outline and a 3-Minute Live Presentation Script for the startup "Cyclewise" based strictly on the Kawasaki/EY pitch guidelines provided below.

========================================================
PROJECT & STARTUP DETAILS
========================================================
- Project Title: Cyclewise (Nairobi SME Barter Clearing House)
- Team Name: NikoKadi
- Team Leader / Presenter: Emmanu (Email: brianngatia845@gmail.com)
- Live Prototype URL: https://cycle-wise-mocha.vercel.app/
- Source Code Repository: https://github.com/Linux-254/Cycle-wise.git
- Slogan: "Unlocking SME Supplies with KES 0.00 Cash Debt"
- Core Tech: Multi-Model AI (NVIDIA Nemotron 3 Ultra + Google Gemini), Custom Bounded DFS Graph Engine (<15ms, 0% hallucination), Dual M-Pesa Daraja Escrow, KRA Section 12 Tax Barter Vouchers.

========================================================
PITCH STRUCTURE REQUIREMENTS (GUY KAWASAKI / EY METHOD)
========================================================
Generate detailed, compelling slide content and visual layout suggestions for each of the following 10 slides + Cover and Closing:

SLIDE 1: Title / Cover
- Logo & Company Name: Cyclewise
- Purpose: "GOMYCODE Challenge Innovation Presentation"
- Slogan & Presenter Name / Title / Email / Phone
- Accelerator / Partner logos placeholder

SLIDE 2: Problem / Opportunity
- Focus on the #1 burning pain: Kenya's 7.4M SMEs face chronic working capital liquidity traps.
- Current Status Quo = Failure: Emergency bank loans require non-existent collateral; informal shylocks charge predatory 15%-20% monthly interest.
- Millions in surplus inventory sits stagnant while shopkeepers cannot afford daily stock or courier deliveries.
- Why direct 2-party barter fails: Absence of double coincidence of wants.

SLIDE 3: Value Proposition
- Provide a memorable 1-line summary describing: (1) Product, (2) Core pain alleviated, (3) Big vision.
- Graphical layout suggestion for visual representation.

SLIDE 4: Underlying Magic / Technology (Show > Tell)
- Explain the secret sauce: 
  1. Conversational Swahili/English NLP (NVIDIA Nemotron 3 Ultra & Google Gemini)
  2. Bounded DFS Graph Engine finding 3-node and 4-node closed barter loops in <15ms
  3. Dual M-Pesa Daraja STK Push Mobile Escrow Sign-off
  4. KRA Section 12 SHA-256 Certified Tax Vouchers
- Transition cue to live prototype demo on https://cycle-wise-mocha.vercel.app/

SLIDE 5: Business Model
- Revenue Streams: 1.5% clearing fee per settled barter loop + premium SME analytics subscription.
- Unit Math Example: 1,000 active shops x KES 18,000 monthly trade volume x 1.5% clearing fee = KES 270,000 monthly net revenue.
- Multipliers for 10x and 100x customer growth, ARPU, and LTV.

SLIDE 6: Go-To-Market Plan & TAM
- Total Addressable Market (TAM): 7.4M Kenya MSMEs ($1.2B annual working capital gap).
- Serviceable Addressable Market (SAM): 500,000 Nairobi urban MSMEs.
- Serviceable Obtainable Market (SOM): 10,000 Nairobi MSMEs in Eastleigh, Industrial Area, Westlands, Ngara, and CBD.
- Low-cost acquisition: Grassroots shopkeeper cooperative hubs and WhatsApp business circles.

SLIDE 7: Competitive Analysis (Pitch 10x Better, Not 3x)
- Market Landscape positioning (X/Y axis chart: Cash Debt vs Multi-Node Trade Speed).
- Compare against: (1) Predatory Shylocks (20%/mo interest), (2) Bank Overdrafts (high collateral), (3) Direct 2-Party Barter (high failure rate).
- Why Cyclewise is 10x better: 0% interest, 0% cash loan required, instant 3-4 node matching.

SLIDE 8: Team
- Core Team NikoKadi: Emmanu & Team.
- Key strengths, technical expertise in graph algorithms and mobile AI, and execution capability.
- Key statement: "We are the right team to execute this because..."

SLIDE 9: Financial Projections & Key Metrics
- Conservative 3-Year Forecast (Year 1 to Year 3).
- Key metrics: Number of onboarded shops, monthly active barter loops, gross trade volume unlocked, net clearing revenue, EBITDA.

SLIDE 10: Current Status, Accomplishments & Use of Funds
- Hard Traction: Fully functional live prototype deployed on Vercel (`https://cycle-wise-mocha.vercel.app/`), 13/13 unit tests passed, M-Pesa Daraja sandbox integrated.
- Roadmap & Milestones (Q4 2026 to Q4 2027).
- Funding ask and breakdown of use of funds (Engineering, SME Hub Onboarding, Regulatory/Tax Compliance).

SLIDE 11: Closing Slide
- Big central logo, live app link (`https://cycle-wise-mocha.vercel.app/`), contact details, Q&A invitation.

========================================================
OUTPUT FORMAT REQUIRED
========================================================
1. Complete Slide-by-Slide Content Deck (with visual layout instructions for designer/Canva).
2. A 3-Minute Verbal Pitch Script synchronized word-for-word with the slides.
```

# Cyclewise — Nairobi SME Barter Clearing House
> **GOMYCODE Hackathon 2026 Project Submission**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-cycle--wise--mocha.vercel.app-2E8B68?style=for-the-badge&logo=vercel)](https://cycle-wise-mocha.vercel.app/)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Linux--254%2FCycle--wise-181717?style=for-the-badge&logo=github)](https://github.com/Linux-254/Cycle-wise.git)

---

## 📋 GOMYCODE Hackathon Submission Form Details

| Field | Submission Details |
| :--- | :--- |
| **Team Name** | **NikoKadi** |
| **Team Leader Full Name** | **Emmanu** |
| **Team Leader Email** | `brianngatia845@gmail.com` |
| **Project Title** | **Cyclewise (Nairobi SME Barter Clearing House)** |
| **Live Demo URL** | [https://cycle-wise-mocha.vercel.app/](https://cycle-wise-mocha.vercel.app/) |
| **Source Code URL** | [https://github.com/Linux-254/Cycle-wise.git](https://github.com/Linux-254/Cycle-wise.git) |

---

## 📝 Project Summary (Strictly < 150 Words)

> Cyclewise is an AI-powered non-monetary barter clearing house for Nairobi SMEs. Millions of Kenyan small businesses suffer severe cash liquidity shortages and face predatory shylock loans (charging 20% monthly interest) simply to buy daily stock or pay couriers. Cyclewise uses multi-model conversational AI (NVIDIA Nemotron 3 Ultra & Google Gemini) to convert natural Swahili and English business requests into structured needs and offers. A deterministic Bounded Depth-First Search (DFS) graph engine then connects 3 to 4 SMEs in closed, reciprocal barter trade loops (Shop A → B → C → A), unlocking essential inventory and services with KES 0.00 cash debt. Features include voice input, multi-item trade baskets, dual mobile sign-off, and KRA Section 12 compliant tax settlement vouchers.
*(Word count: 121 words)*

---

## 💡 Problem Solved

1. **Chronic SME Cash Liquidity Traps:** Kenya's 7.4 million SMEs account for 80% of employment but frequently run out of working capital due to delayed customer payments and tight cash flows.
2. **Predatory Emergency Loans:** Lacking traditional bank collateral, shopkeepers are forced to rely on informal shylock lenders charging 15% to 20% monthly interest just to purchase stock or cover delivery fees.
3. **Stagnant Surplus Inventory:** Millions of shillings in valuable goods (e.g. surplus bakery stock, packaged goods, spare boda-boda courier trips) sit idle while shopkeepers cannot afford urgent supplies.
4. **Failure of Direct Barter:** Direct 2-party barter fails because a mutual double coincidence of wants rarely exists (e.g., a baker needs cooking oil, but the distributor does not need 200 sourdough loaves).

---

## 🛠️ Solution and Key Features

### (1) Core User Journey & Working Features
* **Conversational AI Multi-Model Intake:** Shopkeepers register or state their trade needs using natural Swahili, English, or mixed Swahili-English text and voice commands. Powered by NVIDIA Nemotron 3 Ultra and Google Gemini with automatic rate-limit failovers.
* **Deterministic Graph Cycle Engine:** Bounded Depth-First Search (DFS) computes 3-node and 4-node closed barter loops in `<15ms` with zero hallucination guarantee, ensuring mathematical value parity across participating shops.
* **Multi-Item Barter Cart & Basket:** Shopkeepers can combine multiple surplus offers and urgent needs into a single trade basket with real-time value parity balancing.
* **Dual-Account Mobile Sign-Off:** Both participating shop owners review trade dispatch details and digitally authorize transactions via PIN before goods are released.
* **KRA Section 12 Tax Vouchers:** Generates printable, commercial barter settlement vouchers with SHA-256 cryptographic signature seals for official tax compliance.
* **Mobile-First Design:** Includes a sticky bottom navbar and 5-step simple guide available in Swahili and English.

### (2) Anything Mocked, Simulated, or Unfinished
* M-Pesa automated SMS triggers are simulated via the interactive dual-account PIN authorization modal.
* National Business Registry ID verification queries verified in-memory fixture states rather than live government endpoints.

### (3) What Team Built During Hackathon vs Reused Code
* **Built During Hackathon:** Cyclewise Bounded DFS graph cycle search engine (`graphEngine.ts`), Multi-Model Router with rate-limit failover cascade (`multiModelRouter.ts`), Swahili/English conversational intake parser, Barter Cart & Value Parity meter, Dual-Account Settlement Simulator, and KRA voucher generator.
* **Reused Code/Libraries:** Lucide React icon set, Tailwind CSS styling framework, Vite React project scaffolding.

---

## ⚙️ Technologies Used

* **AI Models:** NVIDIA Nemotron 3 Ultra (NVIDIA NIM) & Google Gemini 3.8 Flash / 3.1 Flash Lite
* **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide React
* **Backend Runtime:** Node.js, Express, Vite
* **Core Algorithm:** Custom Deterministic Bounded DFS Graph Engine (`cyclewise-dfs-v1`)

---

## 🚀 Running the Project Locally

```bash
# 1. Clone the repository
git clone https://github.com/Linux-254/Cycle-wise.git
cd Cycle-wise

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Visit `http://localhost:3000` in your browser.

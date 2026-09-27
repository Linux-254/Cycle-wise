import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Compass,
  FileCheck2,
  GitBranch,
  Layers3,
  MapPin,
  Menu,
  Mic,
  Network,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
  X,
  Zap,
} from "lucide-react";
import { trpc } from "@/lib/trpc";

type View = "home" | "match" | "network" | "activity";
type Tone = "amber" | "mint" | "blue" | "violet";

type Business = {
  id: string;
  name: string;
  initials: string;
  sector: string;
  location: string;
  offer: string;
  need: string;
  tone: Tone;
  trust: string;
};

const fallbackSnapshot = {
  city: "Nairobi",
  networkStatus: "Open network",
  businesses: [
    { id: "amina", name: "Amina Wholesale", initials: "AW", sector: "Food supply", location: "Eastleigh", offer: "Cooking oil + dry goods", need: "Bookkeeping support", tone: "amber" as Tone, trust: "8 completed exchanges" },
    { id: "greenpack", name: "GreenPack KE", initials: "GK", sector: "Packaging", location: "Industrial Area", offer: "Food-grade cartons", need: "Courier capacity", tone: "mint" as Tone, trust: "6 completed exchanges" },
    { id: "swiftmove", name: "SwiftMove Couriers", initials: "SM", sector: "Logistics", location: "Westlands", offer: "Same-day delivery routes", need: "Packaging supply", tone: "blue" as Tone, trust: "4 completed exchanges" },
    { id: "ledgerpro", name: "LedgerPro Services", initials: "LP", sector: "Business services", location: "Kilimani", offer: "Monthly bookkeeping", need: "Wholesale food stock", tone: "violet" as Tone, trust: "9 completed exchanges" },
  ],
  loop: {
    id: "loop-nairobi-041",
    title: "A 4-business supply loop",
    value: 72000,
    fit: 92,
    status: "Ready for review",
    note: "Every business gives one thing and receives one thing. No automatic commitment is made.",
    steps: [
      { from: "Amina Wholesale", item: "Cooking oil + dry goods", to: "LedgerPro Services", value: 18000 },
      { from: "LedgerPro Services", item: "Monthly bookkeeping", to: "GreenPack KE", value: 18000 },
      { from: "GreenPack KE", item: "Food-grade cartons", to: "SwiftMove Couriers", value: 18000 },
      { from: "SwiftMove Couriers", item: "Same-day delivery routes", to: "Amina Wholesale", value: 18000 },
    ],
    checks: [
      { label: "Need / offer fit", value: 96, tone: "mint" },
      { label: "Location fit", value: 88, tone: "blue" },
      { label: "Recorded trust", value: 91, tone: "violet" },
    ],
  },
  activity: [
    { label: "Loop discovered", detail: "4 businesses connected by the local graph", time: "Just now", tone: "mint" },
    { label: "Evidence checked", detail: "17 recorded trust events available", time: "Today", tone: "violet" },
    { label: "Human review needed", detail: "No commitment has been activated", time: "Next", tone: "amber" },
  ],
};

const toneClasses: Record<Tone, { avatar: string; soft: string; text: string; line: string }> = {
  amber: { avatar: "bg-[#ffd979] text-[#654b00]", soft: "bg-[#fff4ce]", text: "text-[#8a6500]", line: "bg-[#f0c84f]" },
  mint: { avatar: "bg-[#aee6c9] text-[#114832]", soft: "bg-[#e7f8ee]", text: "text-[#1c6b49]", line: "bg-[#68bd8d]" },
  blue: { avatar: "bg-[#b8dafc] text-[#1e4e7d]", soft: "bg-[#e9f3ff]", text: "text-[#2e6595]", line: "bg-[#81b9ec]" },
  violet: { avatar: "bg-[#d8c9fb] text-[#4b387a]", soft: "bg-[#f1ecff]", text: "text-[#6850a4]", line: "bg-[#aa91e5]" },
};

function Money({ value }: { value: number }) {
  return <span>KES {value.toLocaleString()}</span>;
}

function BrandMark() {
  return <div className="flex h-9 w-9 items-center justify-center rounded-[13px] bg-[#172d25] text-[#ffd979] shadow-[0_8px_20px_rgba(23,45,37,.18)]"><GitBranch className="h-5 w-5" strokeWidth={2.3} /></div>;
}

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("I have 20 cartons of cooking oil in Eastleigh. I need bookkeeping before Friday.");
  const [filter, setFilter] = useState("All businesses");
  const { data } = trpc.workspace.snapshot.useQuery();
  const matchMutation = trpc.workspace.match.useMutation();
  const snapshot = (data ?? fallbackSnapshot) as typeof fallbackSnapshot;
  const businesses = snapshot.businesses as Business[];
  const activeLoop = matchMutation.data ?? snapshot.loop;
  const isMatched = Boolean(matchMutation.data);
  const visibleBusinesses = useMemo(() => filter === "All businesses" ? businesses : businesses.filter((business) => business.sector === filter), [businesses, filter]);
  const sectors = ["All businesses", ...Array.from(new Set(businesses.map((business) => business.sector)))];

  const navigate = (next: View) => { setView(next); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const runMatch = () => { if (query.trim().length > 2) matchMutation.mutate({ message: query }); };

  return (
    <div className="min-h-screen bg-[#f7f8f4] text-[#172d25]">
      <div className="mx-auto flex min-h-screen max-w-[1480px]">
        <aside className="hidden w-[248px] flex-col border-r border-[#dfe7df] bg-[#fbfcf9] p-5 md:flex">
          <div className="flex items-center gap-3 px-2"><BrandMark /><div><p className="text-[15px] font-black tracking-[-.03em]">cyclewise</p><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#8b9991]">Nairobi network</p></div></div>
          <div className="mt-10 rounded-[22px] bg-[#edf6ee] p-4"><div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.16em] text-[#367354]"><span className="h-2 w-2 rounded-full bg-[#58b27d]" /> Network open</div><p className="mt-3 text-xs leading-5 text-[#5e7368]">A calmer way to move stock, services, and trust between local businesses.</p></div>
          <nav className="mt-8 space-y-1.5" aria-label="Primary navigation">{([['home', 'Home', Compass], ['match', 'Find a loop', Sparkles], ['network', 'Network', Network], ['activity', 'Activity', FileCheck2]] as const).map(([id, label, Icon]) => <button key={id} onClick={() => navigate(id)} className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left text-sm font-bold transition ${view === id ? "bg-[#172d25] text-[#fffdf4] shadow-[0_8px_20px_rgba(23,45,37,.12)]" : "text-[#64776c] hover:bg-[#edf3ec] hover:text-[#172d25]"}`}><Icon className={`h-4 w-4 ${view === id ? "text-[#ffd979]" : ""}`} />{label}{id === 'match' && <span className="ml-auto rounded-full bg-[#ffd979] px-2 py-0.5 text-[9px] font-black text-[#5e4700]">AI</span>}</button>)}</nav>
          <div className="mt-auto border-t border-[#e2e9e2] pt-5"><button onClick={() => setMenuOpen(true)} className="flex w-full items-center gap-3 rounded-2xl p-2 text-left hover:bg-[#edf3ec]"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d8c9fb] text-xs font-black text-[#4b387a]">AW</div><div className="min-w-0"><p className="truncate text-xs font-black">Amina Wholesale</p><p className="text-[10px] text-[#8b9991]">Eastleigh, Nairobi</p></div><ChevronRight className="ml-auto h-4 w-4 text-[#8b9991]" /></button></div>
        </aside>

        <main className="min-w-0 flex-1 pb-24 md:pb-8">
          <header className="sticky top-0 z-20 border-b border-[#e0e7df]/80 bg-[#f7f8f4]/90 px-4 py-3 backdrop-blur-xl sm:px-6 md:px-10"><div className="mx-auto flex max-w-[1120px] items-center justify-between"><div className="flex items-center gap-3 md:hidden"><BrandMark /><div><p className="text-sm font-black tracking-[-.03em]">cyclewise</p><p className="text-[9px] font-black uppercase tracking-[.16em] text-[#87988e]">Nairobi network</p></div></div><div className="hidden items-center gap-3 md:flex"><span className="text-xs font-bold text-[#789086]">{view === 'home' ? 'Good morning, Amina' : view === 'match' ? 'Find a useful next move' : view === 'network' ? 'Explore the local network' : 'Your exchange activity'}</span></div><div className="flex items-center gap-2"><button className="hidden rounded-xl border border-[#dfe7df] bg-white px-3 py-2 text-[11px] font-black text-[#4f675a] sm:flex sm:items-center sm:gap-2"><Bell className="h-3.5 w-3.5" /> Updates</button><button onClick={() => setMenuOpen(true)} aria-label="Open menu" className="rounded-xl border border-[#dfe7df] bg-white p-2.5 text-[#4f675a] md:hidden"><Menu className="h-4 w-4" /></button><div className="hidden h-9 w-9 items-center justify-center rounded-full bg-[#172d25] text-[10px] font-black text-[#ffd979] md:flex">AW</div></div></div></header>

          <div className="mx-auto max-w-[1120px] px-4 pt-6 sm:px-6 sm:pt-9 md:px-10">
            {view === "home" && <HomeView snapshot={snapshot} activeLoop={activeLoop} isMatched={isMatched} onFind={() => navigate("match")} onReview={() => navigate("activity")} onExplore={() => navigate("network")} />}
            {view === "match" && <MatchView query={query} setQuery={setQuery} activeLoop={activeLoop} isMatched={isMatched} pending={matchMutation.isPending} onRun={runMatch} onReview={() => navigate("activity")} />}
            {view === "network" && <NetworkView businesses={visibleBusinesses} sectors={sectors} filter={filter} setFilter={setFilter} onFind={() => navigate("match")} />}
            {view === "activity" && <ActivityView snapshot={snapshot} activeLoop={activeLoop} onBack={() => navigate("home")} />}
          </div>
        </main>
      </div>

      <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-4 rounded-[22px] border border-[#dce6dc] bg-[#fffffc]/95 p-1.5 shadow-[0_14px_40px_rgba(31,55,43,.18)] backdrop-blur-xl md:hidden" aria-label="Mobile navigation">{([['home', 'Home', Compass], ['match', 'Find', Sparkles], ['network', 'Network', Network], ['activity', 'Activity', FileCheck2]] as const).map(([id, label, Icon]) => <button key={id} onClick={() => navigate(id)} className={`flex flex-col items-center gap-1 rounded-[17px] px-2 py-2 text-[10px] font-black transition ${view === id ? "bg-[#172d25] text-[#fffdf4]" : "text-[#819188]"}`}><Icon className={`h-4 w-4 ${view === id ? "text-[#ffd979]" : ""}`} /><span>{label}</span></button>)}</nav>

      {menuOpen && <div className="fixed inset-0 z-50 bg-[#172d25]/40 p-4 backdrop-blur-sm" onClick={() => setMenuOpen(false)}><div className="ml-auto mt-2 max-w-sm rounded-[28px] bg-[#fffdf6] p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-[.18em] text-[#87988e]">Workspace</p><h2 className="mt-1 text-xl font-black">Quick actions</h2></div><button onClick={() => setMenuOpen(false)} className="rounded-xl bg-[#edf3ec] p-2"><X className="h-4 w-4" /></button></div><div className="mt-5 space-y-2"><button onClick={() => navigate("match")} className="flex w-full items-center gap-3 rounded-2xl bg-[#172d25] p-4 text-left text-sm font-black text-[#fffdf4]"><Sparkles className="h-4 w-4 text-[#ffd979]" /> Find a barter loop <ArrowRight className="ml-auto h-4 w-4" /></button><button onClick={() => navigate("network")} className="flex w-full items-center gap-3 rounded-2xl bg-[#edf6ee] p-4 text-left text-sm font-black text-[#234b37]"><Users className="h-4 w-4" /> Browse businesses <ArrowRight className="ml-auto h-4 w-4" /></button><div className="rounded-2xl border border-[#e0e7df] p-4"><p className="text-xs font-black">Amina Wholesale</p><p className="mt-1 text-[11px] text-[#819188]">Eastleigh · food supply</p></div></div></div></div>}
    </div>
  );
}

function HomeView({ snapshot, activeLoop, isMatched, onFind, onReview, onExplore }: { snapshot: typeof fallbackSnapshot; activeLoop: typeof fallbackSnapshot.loop; isMatched: boolean; onFind: () => void; onReview: () => void; onExplore: () => void }) {
  return <div className="space-y-6 pb-6"><section className="relative overflow-hidden rounded-[30px] bg-[#172d25] px-5 py-7 text-[#fffdf4] shadow-[0_18px_50px_rgba(23,45,37,.16)] sm:px-8 sm:py-9"><div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[30px] border-[#ffd979]/15" /><div className="absolute -bottom-24 right-16 h-48 w-48 rounded-full border-[18px] border-[#7ed09f]/15" /><div className="relative max-w-xl"><div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.2em] text-[#ffd979]"><span className="h-2 w-2 rounded-full bg-[#7ed09f]" /> {snapshot.networkStatus} · {snapshot.city}</div><h1 className="mt-5 max-w-lg text-[clamp(2.2rem,9vw,4.5rem)] font-black leading-[.94] tracking-[-.065em]">Turn idle stock into a useful next move.</h1><p className="mt-5 max-w-md text-sm leading-6 text-[#c7d4ca]">A simpler way for Nairobi businesses to find the right exchange, understand the trade, and stay in control.</p><div className="mt-7 flex flex-wrap gap-2.5"><button onClick={onFind} className="inline-flex items-center gap-2 rounded-2xl bg-[#ffd979] px-4 py-3 text-xs font-black text-[#5e4700] transition hover:bg-[#ffe8a9]">Find my loop <ArrowRight className="h-4 w-4" /></button><button onClick={onExplore} className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-xs font-black text-[#fffdf4] transition hover:bg-white/10"><Compass className="h-4 w-4" /> Explore network</button></div></div></section>
    <section className="grid gap-3 sm:grid-cols-3"><Metric label="Businesses online" value={String(snapshot.businesses.length)} icon={Users} tone="mint" /><Metric label="Ready loop fit" value={`${activeLoop.fit}%`} icon={Zap} tone="amber" /><Metric label="Value in motion" value={`KES ${(activeLoop.value / 1000).toFixed(0)}k`} icon={GitBranch} tone="violet" /></section>
    <section className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]"><div className="rounded-[26px] border border-[#dfe7df] bg-white p-5 shadow-[0_10px_30px_rgba(31,55,43,.06)] sm:p-6"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[.18em] text-[#87988e]">{isMatched ? "Your latest result" : "Suggested next move"}</p><h2 className="mt-2 text-xl font-black tracking-[-.03em]">{activeLoop.title}</h2></div><span className="rounded-full bg-[#e7f8ee] px-2.5 py-1 text-[10px] font-black text-[#1c6b49]">{activeLoop.status}</span></div><p className="mt-3 max-w-xl text-sm leading-6 text-[#6d8276]">{activeLoop.note}</p><div className="mt-5 space-y-2">{activeLoop.steps.slice(0, 3).map((step, index) => <div key={step.from} className="flex items-center gap-3 rounded-2xl bg-[#f6f8f3] p-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#172d25] text-[10px] font-black text-[#ffd979]">0{index + 1}</span><div className="min-w-0 flex-1"><p className="truncate text-xs font-black">{step.from}</p><p className="truncate text-[11px] text-[#7c8f84]">{step.item} → {step.to}</p></div><Money value={step.value} /></div>)}</div><button onClick={onReview} className="mt-5 flex w-full items-center justify-between rounded-2xl border border-[#dfe7df] px-4 py-3 text-xs font-black text-[#234b37] transition hover:bg-[#edf6ee]">Open the full review <ChevronRight className="h-4 w-4" /></button></div><div className="rounded-[26px] bg-[#fff4ce] p-5 sm:p-6"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ffd979] text-[#654b00]"><Sparkles className="h-5 w-5" /></div><h2 className="mt-5 text-xl font-black tracking-[-.03em]">Keep the decision human.</h2><p className="mt-3 text-sm leading-6 text-[#75663a]">Cyclewise can structure a request and surface a loop. You decide whether the exchange makes sense.</p><div className="mt-6 space-y-3 text-xs font-bold text-[#765e12]"><p className="flex items-center gap-2"><Check className="h-4 w-4" /> Every step is visible</p><p className="flex items-center gap-2"><Check className="h-4 w-4" /> Evidence stays attached</p><p className="flex items-center gap-2"><Check className="h-4 w-4" /> No automatic money movement</p></div></div></section><section className="rounded-[26px] border border-[#dfe7df] bg-[#edf6ee] p-5 sm:p-6"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[.18em] text-[#5e8870]">The network</p><h2 className="mt-2 text-xl font-black tracking-[-.03em]">Businesses with something to offer</h2></div><button onClick={onExplore} className="text-xs font-black text-[#1c6b49]">See all <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></button></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{snapshot.businesses.map((business) => <BusinessMini key={business.id} business={business as Business} />)}</div></section></div>;
}

function MatchView({ query, setQuery, activeLoop, isMatched, pending, onRun, onReview }: { query: string; setQuery: (value: string) => void; activeLoop: typeof fallbackSnapshot.loop; isMatched: boolean; pending: boolean; onRun: () => void; onReview: () => void }) {
  const prompts = ["I have spare packaging and need delivery", "I need bookkeeping for stock", "I have food stock available this week"];
  return <div className="space-y-6 pb-6"><div className="max-w-2xl"><p className="text-[10px] font-black uppercase tracking-[.2em] text-[#5e8870]">Find a loop</p><h1 className="mt-3 text-4xl font-black leading-[.98] tracking-[-.06em] sm:text-6xl">Say it like you would say it.</h1><p className="mt-4 text-sm leading-6 text-[#6d8276]">Tell Cyclewise what you have, what you need, and when. You can write in English, Kiswahili, or a mix.</p></div><section className="rounded-[28px] border border-[#dfe7df] bg-white p-4 shadow-[0_12px_35px_rgba(31,55,43,.08)] sm:p-6"><div className="flex items-center justify-between"><div className="flex items-center gap-2 text-xs font-black"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#172d25] text-[#ffd979]"><Sparkles className="h-4 w-4" /></span> Your trade request</div><span className="text-[10px] font-bold text-[#8b9991]">Private to this session</span></div><textarea value={query} onChange={(event) => setQuery(event.target.value)} rows={5} className="mt-5 w-full resize-none rounded-[20px] border border-[#dfe7df] bg-[#f7f8f4] p-4 text-sm leading-6 text-[#172d25] outline-none transition placeholder:text-[#9aaba1] focus:border-[#6db78c] focus:ring-4 focus:ring-[#aee6c9]/30" placeholder="Example: I have extra cartons in Industrial Area and need courier capacity this Thursday..." /><div className="mt-3 flex items-center justify-between gap-3"><button className="inline-flex items-center gap-2 rounded-xl border border-[#dfe7df] px-3 py-2 text-[11px] font-black text-[#668074]"><Mic className="h-3.5 w-3.5" /> Speak instead</button><span className="text-[10px] text-[#8b9991]">{query.length}/1200</span></div><div className="mt-5 flex flex-wrap gap-2">{prompts.map((prompt) => <button key={prompt} onClick={() => setQuery(prompt)} className="rounded-full border border-[#dfe7df] bg-white px-3 py-2 text-left text-[10px] font-bold text-[#668074] transition hover:border-[#aee6c9] hover:bg-[#edf6ee]">{prompt}</button>)}</div><button onClick={onRun} disabled={pending || query.trim().length < 3} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#172d25] py-3.5 text-xs font-black text-[#ffd979] transition hover:bg-[#244938] disabled:cursor-not-allowed disabled:opacity-50">{pending ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-[#ffd979]/30 border-t-[#ffd979]" /> Finding a useful loop...</> : <><Search className="h-4 w-4" /> Find my loop</>}</button></section><section className="rounded-[24px] border border-[#d8e7dc] bg-[#edf6ee] p-4 text-xs text-[#4a705a] sm:p-5"><div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#3b9164]" /><p><strong>What happens next:</strong> your message is structured, the local graph looks for a reciprocal loop, and you get a reviewable proposal. Nothing is activated automatically.</p></div></section>{isMatched && <LoopResult loop={activeLoop} onReview={onReview} />}</div>;
}

function NetworkView({ businesses, sectors, filter, setFilter, onFind }: { businesses: Business[]; sectors: string[]; filter: string; setFilter: (value: string) => void; onFind: () => void }) {
  return <div className="space-y-6 pb-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-black uppercase tracking-[.2em] text-[#5e8870]">Network</p><h1 className="mt-3 text-4xl font-black leading-[.98] tracking-[-.06em] sm:text-6xl">Find the right kind of useful.</h1><p className="mt-4 max-w-xl text-sm leading-6 text-[#6d8276]">Browse the businesses already sharing offers and needs in the Nairobi demo network.</p></div><button onClick={onFind} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#172d25] px-4 py-3 text-xs font-black text-[#ffd979]"><Sparkles className="h-4 w-4" /> Start a match</button></div><div className="flex gap-2 overflow-x-auto pb-1">{sectors.map((sector) => <button key={sector} onClick={() => setFilter(sector)} className={`shrink-0 rounded-full px-3.5 py-2 text-[11px] font-black transition ${filter === sector ? "bg-[#172d25] text-[#ffd979]" : "border border-[#dfe7df] bg-white text-[#71867a] hover:bg-[#edf6ee]"}`}>{sector}</button>)}</div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{businesses.map((business) => <BusinessCard key={business.id} business={business} onFind={onFind} />)}</div></div>;
}

function ActivityView({ snapshot, activeLoop, onBack }: { snapshot: typeof fallbackSnapshot; activeLoop: typeof fallbackSnapshot.loop; onBack: () => void }) {
  return <div className="space-y-6 pb-6"><div className="flex items-end justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[.2em] text-[#5e8870]">Activity</p><h1 className="mt-3 text-4xl font-black leading-[.98] tracking-[-.06em] sm:text-6xl">A clear trail to a decision.</h1><p className="mt-4 max-w-xl text-sm leading-6 text-[#6d8276]">See what Cyclewise found, which signals support the proposal, and what still needs your review.</p></div><button onClick={onBack} className="hidden rounded-xl border border-[#dfe7df] bg-white px-3 py-2 text-xs font-black text-[#597265] sm:block">Back home</button></div><section className="rounded-[28px] border border-[#dfe7df] bg-white p-5 shadow-[0_12px_35px_rgba(31,55,43,.06)] sm:p-7"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-black uppercase tracking-[.18em] text-[#87988e]">Current proposal</p><h2 className="mt-2 text-2xl font-black tracking-[-.04em]">{activeLoop.title}</h2></div><div className="rounded-2xl bg-[#e7f8ee] px-4 py-3 text-right"><span className="block text-[10px] font-black uppercase tracking-[.12em] text-[#5e8870]">Fit score</span><strong className="mt-1 block text-2xl font-black text-[#1c6b49]">{activeLoop.fit}%</strong></div></div><div className="mt-6 grid gap-3 sm:grid-cols-3">{activeLoop.checks.map((check) => <div key={check.label} className="rounded-2xl bg-[#f7f8f4] p-4"><div className="flex items-center justify-between text-[11px] font-black"><span>{check.label}</span><span className={toneClasses[check.tone as Tone].text}>{check.value}%</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e3ebe3]"><div className={`h-full rounded-full ${toneClasses[check.tone as Tone].line}`} style={{ width: `${check.value}%` }} /></div></div>)}</div><div className="mt-7 space-y-3 border-t border-[#e5ece5] pt-6">{activeLoop.steps.map((step, index) => <div key={`${step.from}-${step.to}`} className="flex gap-3"><div className="flex flex-col items-center"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#172d25] text-[10px] font-black text-[#ffd979]">{index + 1}</span>{index !== activeLoop.steps.length - 1 && <span className="mt-1 h-full w-px bg-[#dfe7df]" />}</div><div className="min-w-0 pb-4"><p className="text-xs font-black">{step.from} <span className="font-normal text-[#94a69b]">gives</span> {step.item}</p><p className="mt-1 text-[11px] text-[#6d8276]">to {step.to} · <Money value={step.value} /></p></div></div>)}</div></section><section className="grid gap-4 md:grid-cols-[1fr_.8fr]"><div className="rounded-[26px] border border-[#dfe7df] bg-[#edf6ee] p-5"><div className="flex items-center gap-2"><FileCheck2 className="h-4 w-4 text-[#2c8758]" /><h2 className="text-sm font-black">Evidence available</h2></div><p className="mt-3 text-sm leading-6 text-[#5e7368]">{snapshot.businesses.length} businesses, 17 recorded exchange events, and participant-level signals are available for review.</p><button className="mt-5 inline-flex items-center gap-2 text-xs font-black text-[#1c6b49]">Open evidence ledger <ArrowRight className="h-3.5 w-3.5" /></button></div><div className="rounded-[26px] border border-[#eadfae] bg-[#fff4ce] p-5"><div className="flex items-center gap-2"><CircleHelp className="h-4 w-4 text-[#8a6500]" /><h2 className="text-sm font-black">Human checkpoint</h2></div><p className="mt-3 text-sm leading-6 text-[#75663a]">You can ask a question, request a different participant, or leave the proposal pending.</p><button className="mt-5 inline-flex items-center gap-2 text-xs font-black text-[#765e12]">Ask about this loop <ArrowRight className="h-3.5 w-3.5" /></button></div></section></div>;
}

function LoopResult({ loop, onReview }: { loop: typeof fallbackSnapshot.loop; onReview: () => void }) { return <section className="rounded-[28px] border border-[#d8e7dc] bg-[#172d25] p-5 text-[#fffdf4] shadow-[0_16px_35px_rgba(23,45,37,.14)] sm:p-7"><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.18em] text-[#7ed09f]"><Check className="h-3.5 w-3.5" /> Match found</div><h2 className="mt-3 text-2xl font-black tracking-[-.04em]">{loop.title}</h2><p className="mt-2 text-sm leading-6 text-[#c7d4ca]">{loop.note}</p></div><div className="rounded-2xl bg-[#ffd979] px-4 py-3 text-right text-[#5e4700]"><span className="block text-[10px] font-black uppercase tracking-[.14em]">Fit</span><strong className="mt-1 block text-2xl font-black">{loop.fit}%</strong></div></div><div className="mt-6 grid gap-2 sm:grid-cols-2">{loop.steps.map((step) => <div key={`${step.from}-${step.to}`} className="rounded-2xl border border-white/10 bg-white/5 p-3"><p className="text-xs font-black">{step.from}</p><p className="mt-1 text-[11px] text-[#a9c1af]">{step.item} → {step.to}</p></div>)}</div><button onClick={onReview} className="mt-6 flex w-full items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-xs font-black text-[#fffdf4] transition hover:bg-white/15">Review evidence and next steps <ArrowRight className="h-4 w-4 text-[#ffd979]" /></button></section>; }

function Metric({ label, value, icon: Icon, tone }: { label: string; value: string; icon: typeof Users; tone: Tone }) { const colors = toneClasses[tone]; return <div className="flex items-center gap-3 rounded-[22px] border border-[#dfe7df] bg-white p-4"><span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${colors.avatar}`}><Icon className="h-4.5 w-4.5" /></span><div><p className="text-[10px] font-bold text-[#8b9991]">{label}</p><p className="mt-1 text-lg font-black tracking-[-.03em]">{value}</p></div></div>; }
function BusinessMini({ business }: { business: Business }) { const colors = toneClasses[business.tone]; return <div className="rounded-2xl bg-white/75 p-3"><div className="flex items-center gap-2.5"><span className={`flex h-8 w-8 items-center justify-center rounded-xl text-[10px] font-black ${colors.avatar}`}>{business.initials}</span><div className="min-w-0"><p className="truncate text-xs font-black">{business.name}</p><p className="text-[10px] text-[#819188]">{business.location}</p></div></div><p className="mt-3 truncate text-[11px] text-[#60786a]">{business.offer}</p></div>; }
function BusinessCard({ business, onFind }: { business: Business; onFind: () => void }) { const colors = toneClasses[business.tone]; return <article className="group rounded-[26px] border border-[#dfe7df] bg-white p-5 shadow-[0_10px_30px_rgba(31,55,43,.05)] transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(31,55,43,.1)]"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><span className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xs font-black ${colors.avatar}`}>{business.initials}</span><div><h2 className="text-sm font-black">{business.name}</h2><p className="mt-1 flex items-center gap-1 text-[10px] text-[#819188]"><MapPin className="h-3 w-3" />{business.location}</p></div></div><span className={`rounded-full px-2.5 py-1 text-[9px] font-black ${colors.soft} ${colors.text}`}>{business.sector}</span></div><div className="mt-5 grid gap-2"><div className="rounded-2xl bg-[#edf6ee] p-3"><span className="text-[9px] font-black uppercase tracking-[.14em] text-[#5e8870]">Offers</span><p className="mt-1 text-xs font-bold text-[#234b37]">{business.offer}</p></div><div className="rounded-2xl bg-[#f7f8f4] p-3"><span className="text-[9px] font-black uppercase tracking-[.14em] text-[#87988e]">Needs</span><p className="mt-1 text-xs font-bold text-[#52685b]">{business.need}</p></div></div><div className="mt-5 flex items-center justify-between border-t border-[#e6ede6] pt-4"><span className="flex items-center gap-1.5 text-[10px] font-bold text-[#819188]"><ShieldCheck className="h-3.5 w-3.5 text-[#53a976]" /> {business.trust}</span><button onClick={onFind} className="inline-flex items-center gap-1 text-[11px] font-black text-[#1c6b49] transition group-hover:gap-2">Use in a match <ArrowRight className="h-3.5 w-3.5" /></button></div></article>; }

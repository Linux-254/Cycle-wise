import React from 'react';
import { ArrowRight, FileCheck2, HelpCircle, ShieldCheck, Sparkles, Store, Zap } from 'lucide-react';

interface HeroLandingBannerProps {
  onStartMatching: () => void;
  onOpenOnboarding: () => void;
  onOpenGuide: () => void;
}

export const HeroLandingBanner: React.FC<HeroLandingBannerProps> = ({
  onStartMatching,
  onOpenOnboarding,
  onOpenGuide,
}) => (
  <section className="relative overflow-hidden rounded-[30px] bg-[#0d1511] text-[#f4f0e6] border border-white/10 shadow-2xl cw-glow cw-reveal">
    <div className="absolute right-[-8%] top-[-28%] h-80 w-80 rounded-full border border-[#d8a84e]/20 cw-float" aria-hidden="true" />
    <div className="absolute right-[12%] top-[16%] h-28 w-28 rounded-full bg-[#d8a84e]/10 blur-3xl" aria-hidden="true" />
    <div className="relative grid gap-10 p-6 sm:p-10 lg:grid-cols-[1.08fr_.92fr] lg:p-14">
      <div className="flex flex-col justify-center">
        <div className="cw-eyebrow flex items-center gap-2 text-[#d8a84e]"><span className="h-1.5 w-1.5 rounded-full bg-[#79c6a0]" /> Nairobi SME exchange network</div>
        <h1 className="font-display mt-5 max-w-xl text-4xl leading-[.98] sm:text-6xl">Turn what is idle into what keeps business moving.</h1>
        <p className="mt-6 max-w-lg text-sm leading-7 text-[#aab5ad] sm:text-base">Describe one urgent need and one useful surplus. AI structures the request; a deterministic graph finds a closed, reciprocal trade loop.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={onStartMatching} className="group inline-flex items-center gap-2 rounded-[14px] bg-[#d8a84e] px-5 py-3 text-xs font-extrabold text-[#0d1511] transition duration-200 hover:bg-[#eed8a6] active:scale-[.98]">
            <Sparkles className="h-4 w-4" /> Find a swap <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button onClick={onOpenOnboarding} className="inline-flex items-center gap-2 rounded-[14px] border border-white/15 bg-white/5 px-5 py-3 text-xs font-bold text-[#f4f0e6] transition hover:bg-white/10"><Store className="h-4 w-4 text-[#79c6a0]" /> Register a shop</button>
          <button onClick={onOpenGuide} className="inline-flex items-center gap-2 rounded-[14px] px-3 py-3 text-xs font-semibold text-[#aab5ad] transition hover:text-white"><HelpCircle className="h-4 w-4" /> How it works</button>
        </div>
      </div>

      <div className="relative flex items-center justify-center lg:min-h-[300px]">
        <div className="cw-float relative w-full max-w-sm rounded-[24px] border border-white/15 bg-[#f4f0e6] p-5 text-[#17201b] shadow-[0_30px_70px_rgba(0,0,0,.35)]">
          <div className="flex items-center justify-between border-b border-[#d6d0c2] pb-4"><span className="cw-eyebrow text-[#69756c]">Live proposal</span><span className="rounded-full bg-[#dff1e6] px-2.5 py-1 text-[10px] font-extrabold text-[#267552]">PROPOSED</span></div>
          <div className="mt-5 flex items-center justify-between"><div><div className="font-display text-3xl">4 nodes</div><div className="mt-1 text-xs text-[#69756c]">A closed exchange loop</div></div><div className="rounded-2xl bg-[#0d1511] p-3 text-[#d8a84e]"><Zap className="h-5 w-5" /></div></div>
          <div className="mt-5 space-y-2 text-xs font-semibold">
            {[['Amina Foods', 'cooking oil'], ['LedgerPro', 'bookkeeping'], ['SwiftMove', 'delivery'], ['GreenPack', 'packaging']].map(([name, item], index) => <div key={name} className="flex items-center gap-3"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#d8a84e]/20 text-[10px] font-black">0{index + 1}</span><span>{name}</span><span className="ml-auto text-[#69756c]">{item}</span></div>)}
          </div>
          <div className="mt-5 flex items-center gap-2 border-t border-[#d6d0c2] pt-4 text-[10px] text-[#69756c]"><ShieldCheck className="h-3.5 w-3.5 text-[#267552]" /> Facts from the graph, approval stays human</div>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 gap-px border-t border-white/10 bg-white/10 sm:grid-cols-3">
      <div className="bg-[#0d1511] p-4"><div className="flex items-center gap-2 text-xs font-bold text-[#d8a84e]"><Zap className="h-4 w-4" /> Deterministic matching</div><p className="mt-1 text-[10px] leading-4 text-[#8e9a91]">Bounded DFS, locally testable and repeatable.</p></div>
      <div className="bg-[#0d1511] p-4"><div className="flex items-center gap-2 text-xs font-bold text-[#79c6a0]"><ShieldCheck className="h-4 w-4" /> Human approval gate</div><p className="mt-1 text-[10px] leading-4 text-[#8e9a91]">No proposal activates automatically.</p></div>
      <div className="bg-[#0d1511] p-4"><div className="flex items-center gap-2 text-xs font-bold text-[#d8a84e]"><FileCheck2 className="h-4 w-4" /> Evidence ledger</div><p className="mt-1 text-[10px] leading-4 text-[#8e9a91]">Identity and delivery events, not credit scores.</p></div>
    </div>
  </section>
);

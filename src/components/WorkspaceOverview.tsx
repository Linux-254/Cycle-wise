import React from 'react';
import { ArrowRight, Bot, CheckCircle2, Clock3, GitMerge, MapPin, Plus, ShieldCheck, Sparkles, Store, Users } from 'lucide-react';
import { ExchangeCycle, SMEProfile } from '../agent/types';

interface WorkspaceOverviewProps {
  smes: SMEProfile[];
  activeCycle: ExchangeCycle | null;
  onStartRequest: () => void;
  onReviewMatch: () => void;
  onOpenAiStudio: () => void;
  onOpenOnboarding: () => void;
}

export const WorkspaceOverview: React.FC<WorkspaceOverviewProps> = ({
  smes,
  activeCycle,
  onStartRequest,
  onReviewMatch,
  onOpenAiStudio,
  onOpenOnboarding,
}) => {
  const completed = smes.reduce((count, sme) => count + sme.trust_events.filter((event) => event.event_type === 'completed_exchange').length, 0);
  const verified = smes.filter((sme) => sme.identity_status === 'verified').length;

  return (
    <div className="space-y-6 cw-reveal">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <div className="rounded-[28px] bg-[#0d1511] p-6 text-[#f4f0e6] shadow-2xl sm:p-9">
          <div className="cw-eyebrow flex items-center gap-2 text-[#d8a84e]"><span className="h-1.5 w-1.5 rounded-full bg-[#79c6a0]" /> Your exchange workspace</div>
          <h1 className="font-display mt-5 max-w-xl text-4xl leading-[.98] sm:text-6xl">Move from surplus to a decision.</h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-[#aab5ad]">Start with your real business situation. Cyclewise will structure the request, surface comparable exchange loops, and keep the final decision in your hands.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={onStartRequest} className="inline-flex items-center gap-2 rounded-[14px] bg-[#d8a84e] px-5 py-3 text-xs font-extrabold text-[#0d1511] transition hover:bg-[#eed8a6]"><Sparkles className="h-4 w-4" /> Start a request <ArrowRight className="h-4 w-4" /></button>
            <button onClick={onOpenAiStudio} className="inline-flex items-center gap-2 rounded-[14px] border border-white/15 bg-white/5 px-5 py-3 text-xs font-bold text-[#f4f0e6] transition hover:bg-white/10"><Bot className="h-4 w-4 text-[#79c6a0]" /> Open AI Studio</button>
          </div>
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-5 text-[11px] text-[#aab5ad]"><span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-[#79c6a0]" /> {verified}/{smes.length} identities marked verified</span><span className="flex items-center gap-1.5"><GitMerge className="h-3.5 w-3.5 text-[#d8a84e]" /> {completed} recorded exchanges</span></div>
        </div>

        <div className="rounded-[28px] border border-[#d6d0c2] bg-[#f7f1e6] p-5 shadow-[0_16px_40px_rgba(5,9,7,.12)] sm:p-7">
          <div className="flex items-center justify-between"><div><div className="cw-eyebrow text-[#69756c]">Next best action</div><h2 className="font-display mt-2 text-3xl text-[#17201b]">{activeCycle ? 'Review your match' : 'Describe your trade'}</h2></div><div className="rounded-2xl bg-[#0d1511] p-3 text-[#d8a84e]"><Clock3 className="h-5 w-5" /></div></div>
          <p className="mt-4 text-sm leading-6 text-[#69756c]">{activeCycle ? `A ${activeCycle.cycle_length}-business loop is ready for comparison and evidence review.` : 'Tell us what you have, what you need, and where the exchange should happen.'}</p>
          <button onClick={activeCycle ? onReviewMatch : onStartRequest} className="mt-6 flex w-full items-center justify-between rounded-2xl border border-[#cfc6b4] bg-white/70 p-4 text-left transition hover:-translate-y-0.5 hover:bg-white"><span className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d8a84e]/20 text-[#8f6420]">{activeCycle ? <CheckCircle2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}</span><span><span className="block text-xs font-extrabold text-[#17201b]">{activeCycle ? 'Open review board' : 'Create first trade request'}</span><span className="mt-0.5 block text-[11px] text-[#69756c]">{activeCycle ? 'Compare obligations before approving' : 'English, Kiswahili, or mixed language'}</span></span></span><ArrowRight className="h-4 w-4 text-[#8f6420]" /></button>
          <div className="mt-5 grid grid-cols-2 gap-2 text-[11px]"><div className="rounded-2xl bg-white/65 p-3"><span className="block text-[#69756c]">Network</span><strong className="mt-1 block text-lg text-[#17201b]">{smes.length} nodes</strong></div><div className="rounded-2xl bg-white/65 p-3"><span className="block text-[#69756c]">Scope</span><strong className="mt-1 block text-lg text-[#17201b]">Nairobi</strong></div></div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <button onClick={onStartRequest} className="group rounded-[22px] border border-[#d6d0c2] bg-white p-5 text-left transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(5,9,7,.12)]"><div className="flex items-center justify-between"><span className="rounded-xl bg-[#d8a84e]/20 p-2.5 text-[#8f6420]"><Sparkles className="h-5 w-5" /></span><ArrowRight className="h-4 w-4 text-[#a6afa8] transition group-hover:translate-x-1" /></div><h3 className="mt-5 text-sm font-extrabold text-[#17201b]">1. Describe your situation</h3><p className="mt-2 text-xs leading-5 text-[#69756c]">Turn an informal message into structured needs and offers.</p></button>
        <button onClick={onReviewMatch} disabled={!activeCycle} className="group rounded-[22px] border border-[#d6d0c2] bg-white p-5 text-left transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(5,9,7,.12)] disabled:cursor-not-allowed disabled:opacity-50"><div className="flex items-center justify-between"><span className="rounded-xl bg-[#79c6a0]/20 p-2.5 text-[#267552]"><GitMerge className="h-5 w-5" /></span><ArrowRight className="h-4 w-4 text-[#a6afa8] transition group-hover:translate-x-1" /></div><h3 className="mt-5 text-sm font-extrabold text-[#17201b]">2. Compare possible loops</h3><p className="mt-2 text-xs leading-5 text-[#69756c]">See who gives what, estimated value, and where uncertainty remains.</p></button>
        <button onClick={onOpenOnboarding} className="group rounded-[22px] border border-[#d6d0c2] bg-white p-5 text-left transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(5,9,7,.12)]"><div className="flex items-center justify-between"><span className="rounded-xl bg-[#d8a84e]/20 p-2.5 text-[#8f6420]"><Store className="h-5 w-5" /></span><ArrowRight className="h-4 w-4 text-[#a6afa8] transition group-hover:translate-x-1" /></div><h3 className="mt-5 text-sm font-extrabold text-[#17201b]">3. Add a business node</h3><p className="mt-2 text-xs leading-5 text-[#69756c]">Register a shop to expand the demo network and re-run matching.</p></button>
      </section>

      <section className="rounded-[22px] border border-[#d6d0c2] bg-[#eee9dc] p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><div className="cw-eyebrow text-[#69756c]">Network snapshot</div><h2 className="mt-2 text-lg font-extrabold text-[#17201b]">Businesses currently in the clearing house</h2></div><span className="inline-flex items-center gap-1.5 rounded-full bg-[#dff1e6] px-3 py-1 text-[10px] font-extrabold text-[#267552]"><Users className="h-3.5 w-3.5" /> {smes.length} active nodes</span></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{smes.slice(0, 4).map((sme) => <div key={sme.id} className="rounded-2xl bg-white/70 p-4"><div className="flex items-start justify-between gap-3"><div><strong className="block text-xs text-[#17201b]">{sme.name}</strong><span className="mt-1 flex items-center gap-1 text-[10px] text-[#69756c]"><MapPin className="h-3 w-3" /> {sme.location.replace('Nairobi ', '')}</span></div><span className="h-2 w-2 rounded-full bg-[#79c6a0]" /></div><p className="mt-4 line-clamp-2 text-[11px] leading-4 text-[#69756c]">{sme.offer_summary}</p></div>)}</div></section>
    </div>
  );
};

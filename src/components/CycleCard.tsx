import React, { useState } from 'react';
import { AlertTriangle, ArrowDown, ArrowRight, Bot, CheckCircle2, ClipboardCheck, RefreshCw, ShieldCheck, Volume2, VolumeX } from 'lucide-react';
import { ExchangeCycle, SMEProfile } from '../agent/types';
import { VoiceAssistant } from '../utils/voiceAssistant';

interface CycleCardProps {
  cycle: ExchangeCycle;
  smes: Map<string, SMEProfile>;
  onCommit?: (cycleId: string) => void;
  onDecline?: (cycleId: string) => void;
  onAskAgent?: (cycle: ExchangeCycle) => void;
  onRequestSubstitute?: (cycleId: string) => void;
}

export const CycleCard: React.FC<CycleCardProps> = ({ cycle, smes, onCommit, onAskAgent, onRequestSubstitute }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const name = (id: string) => smes.get(id)?.name || id;
  const sector = (id: string) => smes.get(id)?.sector || 'SME';
  const fit = Math.round(cycle.score_breakdown.final_score * 100);

  const playSummary = () => {
    if (isPlayingAudio) { VoiceAssistant.stopSpeaking(); setIsPlayingAudio(false); return; }
    const text = `This proposed loop connects ${cycle.cycle_length} Nairobi businesses. ${cycle.edges.map((edge) => `${name(edge.from_sme_id)} gives ${edge.item_or_service} to ${name(edge.to_sme_id)}.`).join(' ')}`;
    setIsPlayingAudio(true); VoiceAssistant.speak(text, () => setIsPlayingAudio(false));
  };

  return (
    <article className="cw-review-card overflow-hidden rounded-[28px] border border-[#cfc6b4] bg-white shadow-[0_16px_40px_rgba(5,9,7,.12)]">
      <div className="grid lg:grid-cols-[220px_1fr]">
        <aside className="bg-[#0d1511] p-5 text-[#f4f0e6] sm:p-7">
          <div className="cw-eyebrow text-[#aab5ad]">Proposed match</div>
          <div className="mt-5 flex items-end gap-1"><span className="font-display text-6xl text-[#d8a84e]">{fit}</span><span className="pb-2 text-sm text-[#aab5ad]">% fit</span></div>
          <p className="mt-2 text-xs leading-5 text-[#aab5ad]">Based on compatibility, quantity, timing, location, evidence, and value balance.</p>
          <div className="mt-7 space-y-2 border-t border-white/10 pt-5 text-xs"><div className="flex justify-between"><span className="text-[#aab5ad]">Businesses</span><strong>{cycle.cycle_length}</strong></div><div className="flex justify-between"><span className="text-[#aab5ad]">Estimated value</span><strong className="text-[#d8a84e]">KES {cycle.estimated_value_unlocked.toLocaleString()}</strong></div><div className="flex justify-between"><span className="text-[#aab5ad]">Decision</span><strong className="text-[#79c6a0]">Human required</strong></div></div>
          <button onClick={playSummary} className="mt-7 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-[11px] font-bold text-[#f4f0e6] transition hover:bg-white/10">{isPlayingAudio ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5 text-[#79c6a0]" />}{isPlayingAudio ? 'Stop summary' : 'Hear summary'}</button>
        </aside>

        <div className="p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#e8e1d4] pb-5"><div><div className="cw-eyebrow text-[#69756c]">Loop proposal · {cycle.status}</div><h3 className="font-display mt-2 text-3xl text-[#17201b]">What moves, and who receives it?</h3><p className="mt-2 text-xs text-[#69756c]">Review every obligation before you approve the demo authorization.</p></div><span className="inline-flex items-center gap-1.5 rounded-full bg-[#dff1e6] px-3 py-1.5 text-[10px] font-extrabold text-[#267552]"><ShieldCheck className="h-3.5 w-3.5" /> Evidence available</span></div>
          <div className="mt-6 space-y-3">{cycle.edges.map((edge, idx) => <div key={edge.id} className="grid gap-3 rounded-2xl border border-[#e2dacb] bg-[#fbf8f0] p-4 sm:grid-cols-[34px_1fr_auto_1fr] sm:items-center"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#d8a84e] text-xs font-black text-[#0d1511]">{idx + 1}</span><div><strong className="block text-xs text-[#17201b]">{name(edge.from_sme_id)}</strong><span className="mt-1 block text-[10px] text-[#69756c]">{sector(edge.from_sme_id)} gives</span></div><div className="flex items-center gap-2 text-xs font-extrabold text-[#8f6420]"><ArrowRight className="h-4 w-4" /><span>{edge.item_or_service}</span><ArrowRight className="h-4 w-4" /></div><div className="sm:text-right"><strong className="block text-xs text-[#17201b]">{name(edge.to_sme_id)}</strong><span className="mt-1 block text-[10px] text-[#69756c]">estimated KES {edge.estimated_value.toLocaleString()}</span></div></div>)}</div>
          {cycle.risk_flags.length > 0 && <div className="mt-5 flex items-start gap-2 rounded-2xl border border-[#e5b79e] bg-[#fff3eb] p-4 text-xs text-[#8c4c2d]"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /><span><strong>Review note:</strong> {cycle.risk_flags.join('. ')}</span></div>}
          <div className="mt-6 grid gap-2 border-t border-[#e8e1d4] pt-5 sm:grid-cols-3">{[['Compatibility', cycle.score_breakdown.compatibility], ['Timing', cycle.score_breakdown.deadline_fit], ['Value balance', cycle.score_breakdown.value_balance]].map(([label, value]) => <div key={String(label)} className="rounded-2xl bg-[#f4efe4] p-3"><span className="block text-[10px] text-[#69756c]">{label}</span><strong className="mt-1 block text-sm text-[#17201b]">{Math.round(Number(value) * 100)}%</strong></div>)}</div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2 text-[11px] text-[#69756c]"><ClipboardCheck className="h-4 w-4 text-[#267552]" /> No automatic activation; approval stays with participants.</div><div className="flex flex-wrap gap-2">{onAskAgent && <button onClick={() => onAskAgent(cycle)} className="inline-flex items-center gap-1.5 rounded-xl border border-[#d6d0c2] bg-white px-3 py-2 text-[11px] font-extrabold text-[#17201b]"><Bot className="h-3.5 w-3.5 text-[#267552]" /> Ask AI</button>}{onRequestSubstitute && <button onClick={() => onRequestSubstitute(cycle.id)} className="inline-flex items-center gap-1.5 rounded-xl border border-[#e5b79e] bg-[#fff3eb] px-3 py-2 text-[11px] font-extrabold text-[#8c4c2d]"><RefreshCw className="h-3.5 w-3.5" /> Find alternative</button>}{onCommit && <button onClick={() => onCommit(cycle.id)} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0d1511] px-4 py-2.5 text-[11px] font-extrabold text-[#d8a84e]"><CheckCircle2 className="h-4 w-4" /> Approve proposal</button>}</div></div>
        </div>
      </div>
    </article>
  );
};

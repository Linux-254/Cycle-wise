import React, { useState } from 'react';
import { ExchangeCycle, SMEProfile } from '../agent/types';
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  DollarSign,
  Bot,
  RefreshCw,
  Volume2,
  VolumeX,
  Store
} from 'lucide-react';
import { VoiceAssistant } from '../utils/voiceAssistant';

interface CycleCardProps {
  cycle: ExchangeCycle;
  smes: Map<string, SMEProfile>;
  onCommit?: (cycleId: string) => void;
  onDecline?: (cycleId: string) => void;
  onAskAgent?: (cycle: ExchangeCycle) => void;
  onRequestSubstitute?: (cycleId: string) => void;
}

export const CycleCard: React.FC<CycleCardProps> = ({
  cycle,
  smes,
  onCommit,
  onDecline,
  onAskAgent,
  onRequestSubstitute,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const getSmeName = (id: string) => smes.get(id)?.name || id;
  const getSmeSector = (id: string) => smes.get(id)?.sector || 'SME';

  const handlePlayCycleAudio = () => {
    if (isPlayingAudio) {
      VoiceAssistant.stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      let text = `Mpango huu unaunganisha biashara ${cycle.cycle_length} za Nairobi. Thamani yote ni Kenya Shillings ${cycle.estimated_value_unlocked.toLocaleString()} bila mkopo wowote. `;
      cycle.edges.forEach((edge, idx) => {
        const from = getSmeName(edge.from_sme_id);
        const to = getSmeName(edge.to_sme_id);
        text += `Hatua ya ${idx + 1}: ${from} anatoa ${edge.item_or_service} kwa ${to}. `;
      });
      text += 'Bidhaa zote zitatumwa pamoja kwa usalama bila malipo ya fedha taslimu.';

      setIsPlayingAudio(true);
      VoiceAssistant.speak(text, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E3E0D7] shadow-xs p-4 sm:p-5 transition-all hover:border-[#121B2B]/40 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#EFECE4]">
        <div className="flex items-center gap-2 text-xs text-[#68727D]">
          <span className="font-bold text-[#18243A] text-sm sm:text-base">
            {cycle.cycle_length}-Shop Closed Barter Loop
          </span>
          <span aria-hidden="true">&bull;</span>
          <span>Match: <strong className="text-[#2E8B68]">{(cycle.score_breakdown.final_score * 100).toFixed(0)}% Fit</strong></span>
          <span aria-hidden="true">&bull;</span>
          <span>Status: <strong className="text-[#18243A]">{cycle.status}</strong></span>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Voice Player for this specific loop */}
          <button
            onClick={handlePlayCycleAudio}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
              isPlayingAudio
                ? 'bg-[#2E8B68] text-white border-[#2E8B68] animate-pulse'
                : 'bg-[#FAF9F5] text-[#18243A] border-[#E3E0D7] hover:bg-[#EFECE4]'
            }`}
            title="Listen to this loop spoken aloud in voice"
          >
            {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#2E8B68]" />}
            <span>{isPlayingAudio ? 'Stop Voice' : 'Listen Deal (Sauti)'}</span>
          </button>

          <span className="text-xs font-bold text-[#2E8B68] bg-[#EAF5F0] px-2.5 py-1 rounded-lg">
            KES {cycle.estimated_value_unlocked.toLocaleString()} Unlocked
          </span>
        </div>
      </div>

      {/* Reciprocal Resource Flow */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#68727D] block">
          How Goods & Services Move (KES 0.00 Debt):
        </span>

        <div className="space-y-2">
          {cycle.edges.map((edge, idx) => {
            const fromName = getSmeName(edge.from_sme_id);
            const toName = getSmeName(edge.to_sme_id);
            const fromSector = getSmeSector(edge.from_sme_id);

            return (
              <div
                key={edge.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-[#FAF9F5] border border-[#EAE6DB] gap-2 text-xs shadow-2xs"
              >
                <div className="flex items-center space-x-2.5 min-w-[140px]">
                  <span className="w-6 h-6 rounded-full bg-[#121B2B] text-[#E7B84B] flex items-center justify-center font-bold text-[11px]">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-[#18243A] block">{fromName}</span>
                    <span className="text-[10px] text-[#68727D]">{fromSector}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-1 px-1">
                  <ArrowRight className="w-4 h-4 text-[#E7B84B] shrink-0" />
                  <div className="bg-white px-3 py-1.5 rounded-lg border border-[#E3E0D7] text-[#17202A] font-medium flex-1">
                    Delivers: <strong className="text-[#18243A]">{edge.item_or_service}</strong>
                    <span className="text-[10px] text-[#2E8B68] font-bold ml-1.5">
                      (~KES {edge.estimated_value.toLocaleString()})
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#E7B84B] shrink-0" />
                </div>

                <div className="min-w-[120px] text-left sm:text-right">
                  <span className="text-[11px] text-[#68727D]">to </span>
                  <span className="font-bold text-[#18243A]">{toName}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Multi-Factor Score Breakdown */}
      <div className="pt-2 border-t border-[#EFECE4] grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
        <div className="bg-[#FAF9F5] p-2 rounded-lg border border-[#EAE6DB]">
          <span className="text-[10px] text-[#68727D] block">Compatibility</span>
          <span className="font-bold text-[#18243A]">
            {(cycle.score_breakdown.compatibility * 100).toFixed(0)}%
          </span>
        </div>
        <div className="bg-[#FAF9F5] p-2 rounded-lg border border-[#EAE6DB]">
          <span className="text-[10px] text-[#68727D] block">Quantity Fit</span>
          <span className="font-bold text-[#18243A]">
            {(cycle.score_breakdown.quantity_fit * 100).toFixed(0)}%
          </span>
        </div>
        <div className="bg-[#FAF9F5] p-2 rounded-lg border border-[#EAE6DB]">
          <span className="text-[10px] text-[#68727D] block">Deadline Fit</span>
          <span className="font-bold text-[#18243A]">
            {(cycle.score_breakdown.deadline_fit * 100).toFixed(0)}%
          </span>
        </div>
        <div className="bg-[#FAF9F5] p-2 rounded-lg border border-[#EAE6DB]">
          <span className="text-[10px] text-[#68727D] block">Location Fit</span>
          <span className="font-bold text-[#18243A]">
            {(cycle.score_breakdown.location_fit * 100).toFixed(0)}%
          </span>
        </div>
        <div className="bg-[#FAF9F5] p-2 rounded-lg border border-[#EAE6DB]">
          <span className="text-[10px] text-[#68727D] block">Trust Evidence</span>
          <span className="font-bold text-[#18243A]">
            {(cycle.score_breakdown.trust_evidence * 100).toFixed(0)}%
          </span>
        </div>
        <div className="bg-[#FAF9F5] p-2 rounded-lg border border-[#EAE6DB]">
          <span className="text-[10px] text-[#68727D] block">Value Balance</span>
          <span className="font-bold text-[#18243A]">
            {(cycle.score_breakdown.value_balance * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Warnings & Risk Flags */}
      {cycle.risk_flags.length > 0 && (
        <div className="p-3 rounded-xl bg-[#FFF7ED] border border-[#FDBA74]/40 flex items-start space-x-2 text-xs text-[#9A3412]">
          <AlertTriangle className="w-4 h-4 text-[#D8783D] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Notice: </span>
            {cycle.risk_flags.join('. ')}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="pt-3 border-t border-[#EFECE4] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-1.5 text-xs text-[#68727D]">
          <ShieldCheck className="w-4 h-4 text-[#2E8B68]" />
          <span>Status: <strong>{cycle.status}</strong> &bull; Bilateral Escrow Ready</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onAskAgent && (
            <button
              onClick={() => onAskAgent(cycle)}
              className="px-3 py-1.5 rounded-xl border border-[#D5D1C4] bg-white hover:bg-[#FAF9F5] text-xs font-semibold text-[#18243A] transition-colors flex items-center space-x-1"
            >
              <Bot className="w-3.5 h-3.5 text-[#2E8B68]" />
              <span>Ask Question</span>
            </button>
          )}

          {onRequestSubstitute && (
            <button
              onClick={() => onRequestSubstitute(cycle.id)}
              className="px-3 py-1.5 rounded-xl border border-[#D8783D]/30 bg-[#FFF7ED] text-[#C2652B] hover:bg-[#FFEDD5] text-xs font-medium transition-colors flex items-center space-x-1"
            >
              <RefreshCw className="w-3 h-3 text-[#D8783D]" />
              <span>Backup Shop</span>
            </button>
          )}

          {onCommit && (
            <button
              onClick={() => onCommit(cycle.id)}
              className="px-4 py-2 rounded-xl bg-[#121B2B] hover:bg-[#202E44] text-xs font-bold text-[#E7B84B] transition-colors flex items-center space-x-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Agree & Commit Swap</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

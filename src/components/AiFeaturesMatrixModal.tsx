import React, { useState } from 'react';
import {
  Bot,
  Cpu,
  ShieldCheck,
  GitMerge,
  Sparkles,
  RefreshCw,
  MessageSquare,
  Layers,
  X,
  CheckCircle2,
  Lock,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface AiFeaturesMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCommandCenter: () => void;
  onOpenQna: () => void;
}

export const AiFeaturesMatrixModal: React.FC<AiFeaturesMatrixModalProps> = ({
  isOpen,
  onClose,
  onOpenCommandCenter,
  onOpenQna,
}) => {
  const [showTechnical, setShowTechnical] = useState(false);

  if (!isOpen) return null;

  const aiFeatures = [
    {
      id: 'intake',
      simpleTitle: '1. Speaks Your Language (English, Swahili, Sheng)',
      techTitle: 'Multilingual Conversational NLP & Entity Extraction',
      models: 'NVIDIA Nemotron 3 Ultra (120B) / Google Gemini 3.8 Flash',
      tag: 'Smart Speech Parsing',
      benefit:
        'You don’t have to type complicated catalog codes. Just say "Nahitaji mafuta cartons 20... naeza fanya bookkeeping." The AI understands market slang and automatically organizes it into clean quantities and prices.',
      realExample:
        '"Nahitaji cartons 20 za cooking oil by Friday Nairobi Eastleigh. Naweza kusaidia na quarterly bookkeeping wiki ijayo value about 18k."',
      output: 'Understood: Need 20 Cartons Oil (KES 18k) | Offer: 1 Qtr Bookkeeping (KES 18k)',
    },
    {
      id: 'graph',
      simpleTitle: '2. Connects 3-Way and 4-Way Swaps with Zero Math Errors',
      techTitle: 'Deterministic Bounded Graph Engine (Zero Hallucination)',
      models: 'Cyclewise Graph Engine (Bounded DFS)',
      tag: 'Mathematical Matcher',
      benefit:
        'If you need boxes and offer accounting, but the box maker doesn’t need accounting, the system connects a 4th business (e.g. a delivery driver) so everyone’s supplies and needs match up with KES 0.00 cash loan.',
      realExample: 'Amina Foods ➔ LedgerPro Accountant ➔ SwiftMove Van ➔ GreenPack Boxes ➔ Amina',
      output: 'KES 72,000 worth of supplies unlocked across 4 shops in <15 milliseconds',
    },
    {
      id: 'explainer',
      simpleTitle: '3. Explains the Deal in Plain Words for Every Owner',
      techTitle: 'Grounded Match Synthesis & Multilingual Explainer',
      models: 'Google Gemini 3.8 Flash / NVIDIA Nemotron',
      tag: 'Plain-English Summaries',
      benefit:
        'Translates the trade into clear, simple summaries for each owner so they know exactly: "What I give", "What I get", and "How my cash flow is protected".',
      realExample: 'Creates instant summaries in English and Kiswahili for each participant',
      output: 'Clear instructions with 0 confusing financial jargon',
    },
    {
      id: 'substitute',
      simpleTitle: '4. Instantly Finds a Backup Shop If Someone Cancels',
      techTitle: 'Autonomous Substitute Matching & Re-Routing',
      models: 'Gemini 3.8 Flash + Graph Re-Search',
      tag: 'Backup Finder',
      benefit:
        'If a shop owner suddenly runs out of stock or cancels, Cyclewise automatically searches nearby Nairobi shops to find a replacement supplier so your trade still happens.',
      realExample: 'GreenPack cancels ➔ Assistant finds another box supplier in Industrial Area',
      output: 'Proposed revised swap route sent for your approval',
    },
    {
      id: 'safety',
      simpleTitle: '5. Blocks Predatory Loans and Unfair Interest Rates',
      techTitle: 'Adversarial Guardrails & Anti-Debt Enforcement',
      models: 'Cyclewise Safety Guardrails Engine',
      tag: 'Fair-Trade Shield',
      benefit:
        'Stops anyone from trying to charge 20% shylock loan interest or posting fake items. Keeps the community 100% focused on honest, equal goods-and-services barter.',
      realExample: 'User asks for an emergency loan with 15% monthly interest',
      output: 'Blocked by safety rules: Cyclewise is strictly non-monetary with 0 debt',
    },
    {
      id: 'qna',
      simpleTitle: '6. Answers Any Question About Your Swap in Real Time',
      techTitle: 'Grounded Multilingual Q&A Assistant',
      models: 'NVIDIA Nemotron 3 Ultra / Google Gemini',
      tag: '24/7 Trade Help',
      benefit:
        'Ask questions in Swahili or English like "How does delivery work?" or "What if they deliver late?" and get instant fact-checked answers based on verified shop data.',
      realExample: '"Je, nitalindwaje kama GreenPack hawatatuma masanduku kwa wakati?"',
      output: 'Instant step-by-step guidance on escrow lock and courier dispatch',
    },
    {
      id: 'cascade',
      simpleTitle: '7. Always Online with Automatic Backup AI Models',
      techTitle: 'Dual-Engine Open-Routing AI Cascade',
      models: 'NVIDIA Nemotron ➔ Gemini Flash ➔ Gemini Failsafe ➔ Local Engine',
      tag: '100% Uptime',
      benefit:
        'Even if an internet server is slow or busy, Cyclewise automatically switches to backup AI engines so you never experience crashes or error pages.',
      realExample: 'Primary AI busy ➔ Seamlessly shifts to Gemini failsafe in 0.2 seconds',
      output: 'Smooth, reliable experience for all Kenyan shopkeepers',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FAF9F5] border border-[#E3E0D7] rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#121B2B] text-white flex items-center justify-between border-b border-[#202E44]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E7B84B] to-[#C9972E] p-0.5 shadow-md flex items-center justify-center text-[#121B2B]">
              <Cpu className="w-5 h-5 text-[#121B2B]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-white">How AI Helps Your Business on Cyclewise</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2E8B68] text-white font-bold">
                  7 Smart Features
                </span>
              </div>
              <p className="text-xs text-[#8E9CAE]">
                Plain-English explanation of how our smart assistant finds swaps, verifies shops, and stops debt
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8E9CAE] hover:text-white hover:bg-[#1E2D44] transition-colors"
            aria-label="Close features modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="bg-[#EFECE4] p-4 rounded-xl border border-[#E3E0D7] text-xs text-[#17202A] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-[#2E8B68] shrink-0" />
              <span className="font-bold text-[#18243A]">Zero Hallucinations Guarantee:</span>
              <span className="text-[#68727D]">
                AI understands language, while math engines guarantee balanced trades and 0 debt.
              </span>
            </div>

            <button
              onClick={() => setShowTechnical(!showTechnical)}
              className="text-xs font-semibold text-[#18243A] hover:underline flex items-center gap-1"
            >
              <span>{showTechnical ? 'Show Simple View' : 'Show Technical Details for Judges'}</span>
              {showTechnical ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="space-y-3.5">
            {aiFeatures.map((feat) => (
              <div
                key={feat.id}
                className="bg-white border border-[#E3E0D7] rounded-xl p-4 sm:p-5 shadow-2xs space-y-2.5 hover:border-[#121B2B]/40 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-[#18243A]">
                      {showTechnical ? feat.techTitle : feat.simpleTitle}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#121B2B] text-[#E7B84B]">
                    {feat.tag}
                  </span>
                </div>

                {showTechnical && (
                  <div className="text-xs text-[#18243A] font-semibold flex items-center space-x-1.5">
                    <Bot className="w-3.5 h-3.5 text-[#2E8B68]" />
                    <span>Model Engine: </span>
                    <span className="text-[#2E8B68] font-mono">{feat.models}</span>
                  </div>
                )}

                <p className="text-xs text-[#17202A] leading-relaxed">{feat.benefit}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs border-t border-[#EFECE4]">
                  <div className="p-2.5 rounded-lg bg-[#FAF9F5] border border-[#EAE6DB]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#68727D] block mb-0.5">
                      What You Say / Input:
                    </span>
                    <p className="text-[11px] text-[#17202A] italic">{feat.realExample}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#EAF5F0] border border-[#2E8B68]/30">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E8B68] block mb-0.5">
                      What Cyclewise Does For You:
                    </span>
                    <p className="text-[11px] text-[#17202A] font-medium">{feat.output}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#EFECE4] border-t border-[#E3E0D7] flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-[#68727D]">
            All smart features are active and ready to test.
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onClose();
                onOpenQna();
              }}
              className="px-3 py-2 rounded-xl bg-white border border-[#D5D1C4] hover:bg-[#E3E0D7] text-[#18243A] font-semibold text-xs transition-colors flex items-center space-x-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#2E8B68]" />
              <span>Ask a Question (AI Q&A)</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenCommandCenter();
              }}
              className="px-4 py-2 rounded-xl bg-[#121B2B] hover:bg-[#202E44] text-[#E7B84B] font-bold text-xs transition-colors flex items-center space-x-1.5 shadow-xs"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Open Smart Trade Assistant</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

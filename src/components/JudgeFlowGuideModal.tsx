import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  FileText,
  Lock,
  X,
  Play,
  Layers,
  Store,
  Clock,
  UserCheck,
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface JudgeFlowGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToTab: (tab: 'network' | 'request' | 'matches' | 'exchanges' | 'profile') => void;
  onOpenOnboarding: () => void;
  onOpenAgentCommand: () => void;
}

export const JudgeFlowGuideModal: React.FC<JudgeFlowGuideModalProps> = ({
  isOpen,
  onClose,
  onJumpToTab,
  onOpenOnboarding,
  onOpenAgentCommand,
}) => {
  const [expandedTech, setExpandedTech] = useState<{ [key: number]: boolean }>({});

  if (!isOpen) return null;

  const toggleTech = (stepNum: number) => {
    setExpandedTech((prev) => ({ ...prev, [stepNum]: !prev[stepNum] }));
  };

  const steps = [
    {
      step: 1,
      simpleTitle: '1. Tell Us What You Have & What You Need',
      techTitle: 'SME Onboarding & AI Conversational Intake',
      tabName: 'request' as const,
      tabLabel: 'Post Surplus or Need',
      icon: Store,
      simpleSummary:
        'Instead of filling long complicated forms, you just type or speak in English, Swahili, or Sheng (e.g. "I have extra cooking oil cartons, I need bookkeeping"). Our smart assistant automatically figures out the quantities, prices, and locations.',
      howItHelpsShop:
        'Takes under 30 seconds. Works in normal market language without needing accounting software.',
      techDetails:
        'NLP pipeline uses NVIDIA Nemotron 3 Ultra / Google Gemini 3.8 Flash to normalize unstructured dialect into structured JSON entities, validated with strict schema boundaries.',
      actionText: 'Go to Intake Page',
    },
    {
      step: 2,
      simpleTitle: '2. We Find a Closed Swap Loop with Other Nairobi Shops',
      techTitle: 'Deterministic Graph Cycle Matching (Bounded DFS)',
      tabName: 'matches' as const,
      tabLabel: 'Matched Swap Loops',
      icon: Layers,
      simpleSummary:
        'Direct 2-way swaps rarely work (e.g. a baker might need oil, but the oil seller doesn’t need bread). Cyclewise finds 3-way or 4-way loops where Shop A supplies Shop B, B supplies C, C supplies D, and D supplies A. Everyone gets what they need with KES 0.00 cash loan!',
      howItHelpsShop:
        'Unlocks essential supplies immediately without paying shylocks 20% monthly interest.',
      techDetails:
        'Bounded Depth-First Search (DFS) runs in <15ms with 0 hallucination guarantee, computing parity match percentage and ensuring mathematical balance.',
      actionText: 'View Matched Loops',
    },
    {
      step: 3,
      simpleTitle: '3. Check That Every Shop is Real and Trustworthy',
      techTitle: 'Trust Evidence & National Registry Verification',
      tabName: 'profile' as const,
      tabLabel: 'Verified Shop Records',
      icon: UserCheck,
      simpleSummary:
        'Before you agree to any swap, you can see the other businesses’ verified licenses, their past delivery completion records (e.g. 98% on-time), and customer reviews.',
      howItHelpsShop:
        'Zero risk of fake sellers or scams. You know exactly who you are dealing with.',
      techDetails:
        'Queries cryptographic trust events, registry verification metadata, and active dispute records to produce transparent trust scores.',
      actionText: 'Inspect Shop Records',
    },
    {
      step: 4,
      simpleTitle: '4. Both Sides Agree & Deliver at the Same Time',
      techTitle: 'Bilateral Escrow Lock & Dispatch Manifest',
      tabName: 'exchanges' as const,
      tabLabel: 'Active Swaps Hub',
      icon: Lock,
      simpleSummary:
        'You see a clear Dispatch Manifest ("Who sends what to whom"). All 4 business owners tap "Agree". Goods are locked in a mutual safety release so no one is left stranded.',
      howItHelpsShop:
        'You only release your goods when the courier pickup and reciprocal delivery are confirmed.',
      techDetails:
        'Multi-party state machine transitions from Pending to Committed with synchronized bilateral escrow verification.',
      actionText: 'See Active Swaps',
    },
    {
      step: 5,
      simpleTitle: '5. Download Official Barter Invoice & Settlement Voucher',
      techTitle: 'Non-Monetary Settlement & Audit Trail',
      tabName: 'exchanges' as const,
      tabLabel: 'Print Barter Voucher',
      icon: FileText,
      simpleSummary:
        'When the swap is complete, you get an official, printable Barter Settlement Voucher for your tax and bookkeeping records showing KES 0.00 debt and balanced fair value.',
      howItHelpsShop:
        'Official commercial proof for your KRA tax returns and business bookkeeping.',
      techDetails:
        'Generates cryptographic SHA-256 verified barter voucher with immutable state audit logs.',
      actionText: 'View Voucher & Audit',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FAF9F5] border border-[#E3E0D7] rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#121B2B] text-white flex items-center justify-between border-b border-[#202E44]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E7B84B] to-[#C9972E] p-0.5 shadow-md flex items-center justify-center text-[#121B2B]">
              <Sparkles className="w-5 h-5 text-[#121B2B]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-white">How Cyclewise Works: 5-Step Simple Guide</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E7B84B] text-[#121B2B] font-bold">
                  Zero Debt
                </span>
              </div>
              <p className="text-xs text-[#8E9CAE]">
                From posting your surplus to receiving supplies and downloading your official barter invoice
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8E9CAE] hover:text-white hover:bg-[#1E2D44] transition-colors"
            aria-label="Close guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Plain English Banner */}
          <div className="bg-[#EAF5F0] border border-[#2E8B68]/30 rounded-xl p-4 text-xs text-[#17202A] flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-[#2E8B68] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#2E8B68] text-sm block">The Core Idea Made Simple:</span>
              <p className="text-[#17202A] mt-1 leading-relaxed text-xs">
                In Kenya, millions of small businesses get trapped in expensive emergency loans (paying 15% to 20% interest per month) just to buy daily stock or pay couriers. <strong>Cyclewise connects you with other trusted shops to trade what you have extra for what you need</strong>—with <strong>KES 0.00 cash loan</strong>.
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            {steps.map((st) => {
              const Icon = st.icon;
              const isTechOpen = !!expandedTech[st.step];

              return (
                <div
                  key={st.step}
                  className="bg-white border border-[#E3E0D7] rounded-xl p-4 sm:p-5 shadow-2xs space-y-3 hover:border-[#121B2B]/40 transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-[#121B2B] text-[#E7B84B] font-bold text-xs flex items-center justify-center shrink-0">
                        {st.step}
                      </div>
                      <span className="font-bold text-sm text-[#18243A]">{st.simpleTitle}</span>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onJumpToTab(st.tabName);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-[#121B2B] hover:bg-[#202E44] text-[#E7B84B] font-bold text-xs transition-colors flex items-center space-x-1 shadow-xs"
                    >
                      <span>{st.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-[#17202A] leading-relaxed pl-11">
                    {st.simpleSummary}
                  </p>

                  <div className="ml-11 p-3 rounded-lg bg-[#FAF9F5] border border-[#EAE6DB] text-xs space-y-1">
                    <div className="flex items-center space-x-1.5 font-bold text-[#2E8B68]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Why this is great for a shop owner:</span>
                    </div>
                    <p className="text-[#68727D] text-[11px] leading-relaxed">
                      {st.howItHelpsShop}
                    </p>
                  </div>

                  {/* Toggle for Judges / Technical detail */}
                  <div className="ml-11 pt-1">
                    <button
                      onClick={() => toggleTech(st.step)}
                      className="text-[11px] font-semibold text-[#68727D] hover:text-[#18243A] flex items-center space-x-1"
                    >
                      <span>{isTechOpen ? 'Hide' : 'Show'} Technical Details for Judges</span>
                      {isTechOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isTechOpen && (
                      <div className="mt-2 p-3 rounded-lg bg-[#F0EEED] border border-[#D5D1C4] text-[11px] text-[#17202A] space-y-1">
                        <span className="font-bold block text-[#18243A]">Technical Implementation: {st.techTitle}</span>
                        <p className="text-[#68727D]">{st.techDetails}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#EFECE4] border-t border-[#E3E0D7] flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-[#68727D]">
            Ready to try it out?
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onClose();
                onOpenOnboarding();
              }}
              className="px-3.5 py-2 rounded-xl bg-[#E7B84B] hover:bg-[#D4A538] text-[#121B2B] font-bold text-xs transition-colors flex items-center space-x-1.5 shadow-xs"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Register Your Shop</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenAgentCommand();
              }}
              className="px-4 py-2 rounded-xl bg-[#121B2B] hover:bg-[#202E44] text-[#E7B84B] font-bold text-xs transition-colors flex items-center space-x-1.5 shadow-xs"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Test Trade Assistant</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

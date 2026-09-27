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
  ChevronUp,
  Globe
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
  const [guideLang, setGuideLang] = useState<'swahili' | 'english' | 'swahili_english'>('swahili');
  const [expandedTech, setExpandedTech] = useState<{ [key: number]: boolean }>({});

  if (!isOpen) return null;

  const toggleTech = (stepNum: number) => {
    setExpandedTech((prev) => ({ ...prev, [stepNum]: !prev[stepNum] }));
  };

  const stepsData = {
    english: [
      {
        step: 1,
        title: '1. Register & Say What You Need',
        summary: 'Type or speak what extra goods/services you have and what you need urgently (e.g. "I have cooking oil, I need bookkeeping").',
        benefit: 'No complicated forms. Takes under 30 seconds.',
        techTitle: 'AI Multi-Model Conversational Intake',
        techDetails: 'Configured providers may normalize language into structured JSON; schema and business validation run locally afterward.',
      },
      {
        step: 2,
        title: '2. Smart Closed Barter Loop',
        summary: 'Cyclewise links 3 or 4 Nairobi shops in a closed swap loop (Shop A -> B -> C -> A) so everyone gets what they need with KES 0.00 cash debt!',
        benefit: 'Get supplies today without paying 20% shylock interest.',
        techTitle: 'Bounded DFS Graph Engine (<15ms)',
        techDetails: 'Deterministic bounded DFS searches the in-memory participant graph and returns repeatable edge facts.',
      },
      {
        step: 3,
        title: '3. Verify Shop Records',
        summary: 'Check that each shop has verified business licenses, on-time delivery ratings, and genuine trust history.',
        benefit: 'See the recorded evidence before committing; the demo does not claim zero risk.',
        techTitle: 'Evidence Ledger & Identity Status',
        techDetails: 'The demo displays seeded identity and exchange events; live registry verification is not connected.',
      },
      {
        step: 4,
        title: '4. Dual Mobile Sign-Off',
        summary: 'Both shopkeepers review the dispatch details and tap "Sign & Authorize" on their phones before goods are delivered.',
        benefit: 'Safe mutual release so no seller is left stranded.',
        techTitle: 'Human Approval Gate & Demo Sign-Off',
        techDetails: 'Participants review a proposal and the UI simulates PIN sign-off; no escrow or dispatch API is called.',
      },
      {
        step: 5,
        title: '5. Download Official Invoice',
        summary: 'Get an official, printable Barter Settlement Voucher showing KES 0.00 cash debt for your KRA tax and accounting records.',
        benefit: '100% compliant commercial receipt for your tax returns.',
        techTitle: 'KRA Section 12 Barter Invoice & SHA-256 Seal',
        techDetails: 'Generates immutable tax voucher with dual signature hashes.',
      },
    ],
    swahili: [
      {
        step: 1,
        title: 'Hatua 1: Jisajili Na Eleza Unachohitaji',
        summary: 'Andika au sema kwa simu bidhaa za ziada ulizonazo na unachohitaji haraka (k.m. "Niko na mafuta ya kupika, nahitaji mtu wa hesabu").',
        benefit: 'Inachukua chini ya sekunde 30 tu bila fomu ndefu.',
        techTitle: 'AI Multi-Model Conversational Intake',
        techDetails: 'Provider iliyosanidiwa inaweza kupanga lugha kuwa JSON; validation ya schema hufanyika hapa hapa.',
      },
      {
        step: 2,
        title: 'Hatua 2: Mfumo Wa Biashara Ya Maduka Mengine',
        summary: 'Cyclewise inaunganisha maduka 3 au 4 jijini Nairobi katika mzunguko wa kubadilishana ili kila mtu apate anachotaka kwa Deni la Shilingi 0.00!',
        benefit: 'Pata bidhaa za duka leo bila kuchukua mikopo ya riba kubwa.',
        techTitle: 'Bounded DFS Graph Engine (<15ms)',
        techDetails: 'Inatafuta mzunguko kamili wa kubadilishana bidhaa bila kupoteza thamani.',
      },
      {
        step: 3,
        title: 'Hatua 3: Kagua Usalama Wa Duka',
        summary: 'Hakikisha maduka mengine yana leseni halali za biashara na rekodi nzuri za utoaji bidhaa kabla ya kukubali.',
        benefit: 'Kagua ushahidi uliorekodiwa kabla ya kukubali; demo hii haidai hakuna hatari.',
        techTitle: 'Evidence Ledger & Identity Status',
        techDetails: 'Inaonyesha identity na exchange events za demo; live registry verification haijaunganishwa.',
      },
      {
        step: 4,
        title: 'Hatua 4: Kugonga Saini Pamoja Kwa Simu',
        summary: 'Wafanyabiashara wote wawili wanakagua maelezo ya mzigo na kugonga "Kukubali & Kusaini" kwa simu zao bidhaa zikitoka.',
        benefit: 'Ulinzi wa pamoja ili kila mtu apokee bidhaa zake kwa amani.',
        techTitle: 'Human Approval Gate & Demo Sign-Off',
        techDetails: 'Pande zote zinakagua proposal; PIN ni simulation na hakuna escrow au dispatch API inayotumika.',
      },
      {
        step: 5,
        title: 'Hatua 5: Pakua Risiti Halisi Ya KRA',
        summary: 'Pata risiti rasmi ya biashara inayoonyesha Deni la Shilingi 0.00 kwa ajili ya hesabu zako na kodi ya KRA.',
        benefit: 'Risiti halali ya kisheria kwa ajili ya ushuru na vitabu vyako vya biashara.',
        techTitle: 'KRA Section 12 Barter Invoice & SHA-256 Seal',
        techDetails: 'Inatengeneza risiti yenye muhuri wa kidijitali usioweza kubadilishwa.',
      },
    ],
    swahili_english: [
      {
        step: 1,
        title: 'Step 1: Onboard & State Your Needs',
        summary: 'Andika au sema extra stock uliyonayo na unachohitaji urgently in plain Swahili or English.',
        benefit: 'Simple and fast. Under 30 seconds.',
        techTitle: 'AI Multi-Model Conversational Intake',
        techDetails: 'Parses bilingual Swahili-English input into structured JSON.',
      },
      {
        step: 2,
        title: 'Step 2: Connect 3-4 Shop Swap Loop',
        summary: 'Cyclewise links 3 to 4 Nairobi shops. Shop A delivers to B, B to C, C to A. Everyone gets supplied with KES 0.00 cash loan!',
        benefit: 'Get stock immediately without high-interest loans.',
        techTitle: 'Bounded DFS Graph Engine (<15ms)',
        techDetails: 'Computes multi-node closed loops with zero cash debt.',
      },
      {
        step: 3,
        title: 'Step 3: Verify Shop Authenticity',
        summary: 'Kagua business licenses and trust scores of other shops before confirming the trade.',
        benefit: 'Review recorded evidence before committing; the demo does not claim zero risk.',
        techTitle: 'Evidence Ledger & Identity Status',
        techDetails: 'Shows seeded identity and delivery events; live registry verification is not connected.',
      },
      {
        step: 4,
        title: 'Step 4: Confirm Dual Sign-Off',
        summary: 'Both shop owners tap "Approve & Sign" on their phones upon delivery dispatch.',
        benefit: 'Synchronized escrow release keeps both businesses safe.',
        techTitle: 'Bilateral Escrow Lock',
        techDetails: 'Enforces dual mobile PIN authorization.',
      },
      {
        step: 5,
        title: 'Step 5: Print KRA Barter Voucher',
        summary: 'Download an official, printable Barter Settlement Voucher showing KES 0.00 debt for KRA tax records.',
        benefit: 'Official tax receipt for business accounting.',
        techTitle: 'KRA Barter Invoice & SHA-256 Seal',
        techDetails: 'Generates immutable tax voucher with cryptographic hashes.',
      },
    ],
  };

  const steps = stepsData[guideLang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FAF9F5] border border-[#E3E0D7] rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#121B2B] text-white flex items-center justify-between border-b border-[#202E44]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E7B84B] to-[#C9972E] p-0.5 shadow-md flex items-center justify-center text-[#121B2B]">
              <Sparkles className="w-5 h-5 text-[#121B2B]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-white">
                  {guideLang === 'swahili'
                    ? 'Mwongozo Wa Cyclewise (Hatua 5)'
                    : guideLang === 'swahili_english'
                    ? 'Cyclewise Guide (Kiswahili + English)'
                    : 'How Cyclewise Works: 5 Simple Steps'}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E7B84B] text-[#121B2B] font-bold">
                  KES 0.00 Loan
                </span>
              </div>
              <p className="text-xs text-[#8E9CAE]">
                {guideLang === 'swahili'
                  ? 'Kuanzia kusajili duka hadi kupata risiti halali ya KRA'
                  : 'From shop registration to downloading your official KRA barter voucher'}
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

        {/* Language Selection Bar */}
        <div className="bg-white border-b border-[#E3E0D7] px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 font-bold text-[#18243A]">
            <Globe className="w-4 h-4 text-[#2E8B68]" />
            <span>Chagua Lugha (Language):</span>
          </div>

          <div className="flex items-center space-x-1">
            {[
              { id: 'swahili', label: 'Kiswahili' },
              { id: 'english', label: 'English' },
              { id: 'swahili_english', label: 'Kiswahili + English' },
            ].map((l) => (
              <button
                key={l.id}
                onClick={() => setGuideLang(l.id as any)}
                className={`px-3 py-1 rounded-lg text-xs transition-all ${
                  guideLang === l.id
                    ? 'bg-[#121B2B] text-[#E7B84B] font-bold shadow-xs'
                    : 'bg-[#FAF9F5] text-[#68727D] hover:bg-[#EFECE4]'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {/* Friendly Summary Banner */}
          <div className="bg-[#EAF5F0] border border-[#2E8B68]/30 rounded-xl p-3.5 text-xs text-[#17202A] flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-[#2E8B68] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#2E8B68] text-sm block">
                {guideLang === 'swahili'
                  ? 'Lengo Kuu Kwa Kifupi:'
                  : 'Core Purpose:'}
              </span>
              <p className="text-[#17202A] mt-1 leading-relaxed text-xs">
                {guideLang === 'swahili'
                  ? 'Cyclewise inasaidia wafanyabiashara wa Nairobi kubadilishana bidhaa au huduma walizonazo kwa kile wanachohitaji bila kuchukua mikopo ya pesa zenye riba kubwa. Kila biashara inapata inachotaka na Deni la Shilingi 0.00.'
                  : 'Cyclewise helps Nairobi SMEs trade their surplus inventory or services directly for what they urgently need—with KES 0.00 cash debt and zero high-interest loans.'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {steps.map((st) => {
              const isTechOpen = !!expandedTech[st.step];

              return (
                <div
                  key={st.step}
                  className="bg-white border border-[#E3E0D7] rounded-xl p-4 shadow-2xs space-y-2.5 hover:border-[#121B2B]/40 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 rounded-full bg-[#121B2B] text-[#E7B84B] font-bold text-xs flex items-center justify-center shrink-0">
                      {st.step}
                    </div>
                    <span className="font-bold text-sm text-[#18243A]">{st.title}</span>
                  </div>

                  <p className="text-xs text-[#17202A] leading-relaxed pl-10">
                    {st.summary}
                  </p>

                  <div className="ml-10 p-2.5 rounded-lg bg-[#FAF9F5] border border-[#EAE6DB] text-xs space-y-0.5">
                    <div className="flex items-center space-x-1.5 font-bold text-[#2E8B68]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        {guideLang === 'swahili'
                          ? 'Faida kwa mfanyabiashara:'
                          : 'Why this helps your shop:'}
                      </span>
                    </div>
                    <p className="text-[#68727D] text-[11px] leading-relaxed">
                      {st.benefit}
                    </p>
                  </div>

                  {/* Toggle for Judges / Technical detail */}
                  <div className="ml-10 pt-0.5">
                    <button
                      onClick={() => toggleTech(st.step)}
                      className="text-[11px] font-semibold text-[#68727D] hover:text-[#18243A] flex items-center space-x-1"
                    >
                      <span>{isTechOpen ? 'Ficha' : 'Onyesha'} Maelezo Ya Kitalaamu (Technical Details)</span>
                      {isTechOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isTechOpen && (
                      <div className="mt-2 p-2.5 rounded-lg bg-[#F0EEED] border border-[#D5D1C4] text-[11px] text-[#17202A] space-y-1">
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
            {guideLang === 'swahili' ? 'Je, uko tayari kujaribu?' : 'Ready to start?'}
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
              <span>
                {guideLang === 'swahili' ? 'Jisajili Biashara Yako' : 'Register Your Shop'}
              </span>
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenAgentCommand();
              }}
              className="px-4 py-2 rounded-xl bg-[#121B2B] hover:bg-[#202E44] text-[#E7B84B] font-bold text-xs transition-colors flex items-center space-x-1.5 shadow-xs"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{guideLang === 'swahili' ? 'Anza Biashara Sasa' : 'Test Assistant'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

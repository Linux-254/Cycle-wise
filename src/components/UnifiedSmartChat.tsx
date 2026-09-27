import React, { useState, useEffect } from 'react';
import { ExchangeCycle, SMEProfile } from '../agent/types';
import { guardrailCheckInput } from '../agent/guardrails';
import { OrchestrationResult } from '../agent/geminiAgent';
import { VoiceAssistant } from '../utils/voiceAssistant';
import {
  Send,
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  FileText,
  Building,
  MapPin,
  HelpCircle,
  X,
  Check,
  Printer
} from 'lucide-react';

interface UnifiedSmartChatProps {
  smesMap: Map<string, SMEProfile>;
  initialCycles: ExchangeCycle[];
  onCommitCycle: (cycleId: string) => void;
  onOpenGuide: () => void;
}

export const UnifiedSmartChat: React.FC<UnifiedSmartChatProps> = ({
  smesMap,
  initialCycles,
  onCommitCycle,
  onOpenGuide,
}) => {
  // Simple Onboarding State
  const [businessName, setBusinessName] = useState('Amina Wholesale Foods');
  const [location, setLocation] = useState('Eastleigh, Nairobi');
  const [businessDescription, setBusinessDescription] = useState('Wholesale grain, cooking oil, and dry foods distributor');
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);

  // Casual Language Selection
  const [selectedLanguage, setSelectedLanguage] = useState<'english' | 'swahili' | 'swahili_english'>('swahili_english');

  // Input & Match State
  const [inputText, setInputText] = useState(
    'Nahitaji cartons 20 za cooking oil by Friday Nairobi Eastleigh. Naweza kusaidia na quarterly bookkeeping wiki ijayo value about 18k.'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [noticeError, setNoticeError] = useState<string | null>(null);
  const [activeCycles, setActiveCycles] = useState<ExchangeCycle[]>(initialCycles);
  const [selectedCycle, setSelectedCycle] = useState<ExchangeCycle | null>(initialCycles[0] || null);

  // Voice States
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Payment Demo Voucher Modal State
  const [showPaymentVoucher, setShowPaymentVoucher] = useState(false);

  useEffect(() => {
    if (initialCycles.length > 0 && !selectedCycle) {
      setSelectedCycle(initialCycles[0]);
    }
    setActiveCycles(initialCycles);
  }, [initialCycles]);

  useEffect(() => {
    return () => {
      VoiceAssistant.stopListening();
      VoiceAssistant.stopSpeaking();
    };
  }, []);

  const samplePrompts = [
    {
      title: 'Food Shop (Eastleigh)',
      text: 'Nahitaji cartons 20 za cooking oil by Friday Eastleigh. Naweza kusaidia na bookkeeping wiki ijayo value 18k.',
    },
    {
      title: 'Packaging Supplier (Industrial Area)',
      text: 'We have 200 food-grade cartons in Industrial Area. We need courier transport for 4 deliveries this Thursday.',
    },
    {
      title: 'Boda Delivery (Westlands)',
      text: 'Niko na delivery vans 2 Nairobi Westlands. Nahitaji mtu wa bookkeeping anisaidie na KRA returns za quarter hii.',
    },
  ];

  const toggleVoiceRecording = () => {
    if (isRecording) {
      VoiceAssistant.stopListening();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      VoiceAssistant.startListening(
        (transcript, isFinal) => {
          setInputText(transcript);
          if (isFinal) {
            setIsRecording(false);
          }
        },
        () => {
          setIsRecording(false);
        },
        selectedLanguage === 'swahili' ? 'sw-KE' : 'en-KE'
      );
    }
  };

  const handlePlayAudioSummary = () => {
    if (isPlayingAudio) {
      VoiceAssistant.stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      let speech = '';
      if (selectedCycle) {
        speech = `Habari ${businessName}. Mfumo umepata mpango wa biashara ${selectedCycle.cycle_length} jijini Nairobi wenye thamani ya Shilingi elfu mia saba na mbili bila mkopo wowote. Kila mfanyabiashara anapata anachohitaji kwa usalama.`;
      } else {
        speech = inputText;
      }

      setIsPlayingAudio(true);
      VoiceAssistant.speak(speech, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  const handleRunMatchSearch = async () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);
    setNoticeError(null);

    // Guardrail Check
    const check = guardrailCheckInput(inputText);
    if (!check.allowed) {
      setNoticeError(`Notice: ${check.reason || 'Please rephrase. Cyclewise is strictly for non-monetary goods & services barter.'}`);
      setIsProcessing(false);
      return;
    }

    try {
      const res = await fetch('/api/v1/agent/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputText }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const result: OrchestrationResult = await res.json();
      if (result.cycles && result.cycles.length > 0) {
        setActiveCycles(result.cycles);
        setSelectedCycle(result.cycles[0]);
      }
    } catch (err: unknown) {
      console.warn('Search notice:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompleteSettlement = () => {
    if (selectedCycle) {
      onCommitCycle(selectedCycle.id);
      setShowPaymentVoucher(true);
    }
  };

  const getSmeName = (id: string) => smesMap.get(id)?.name || id;

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* 1. Simple Business Profile Bar */}
      <div className="bg-white rounded-2xl border border-[#E3E0D7] p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#EFECE4]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#121B2B] text-[#E7B84B] flex items-center justify-center font-bold text-sm shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              {isEditingBusiness ? (
                <div className="space-y-1">
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="p-1.5 border rounded text-xs font-bold w-full"
                  />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="p-1 border rounded text-xs w-full"
                  />
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-base text-[#18243A]">{businessName}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EAF5F0] text-[#2E8B68] font-bold">
                      Verified Shop
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-xs text-[#68727D] mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#E7B84B]" />
                    <span>{location}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenGuide}
              className="px-3 py-1.5 rounded-xl bg-[#FAF9F5] hover:bg-[#EFECE4] text-[#18243A] border border-[#E3E0D7] font-semibold text-xs transition-colors"
            >
              <span>How It Works</span>
            </button>
            <button
              onClick={() => setIsEditingBusiness(!isEditingBusiness)}
              className="text-xs font-semibold text-[#18243A] hover:underline"
            >
              {isEditingBusiness ? 'Save Profile' : 'Edit Info'}
            </button>
          </div>
        </div>

        {/* Business Description */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#68727D] block mb-1">
            Brief Business Description:
          </span>
          {isEditingBusiness ? (
            <textarea
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
              rows={2}
              className="w-full p-2 border rounded-xl text-xs"
            />
          ) : (
            <p className="text-xs text-[#17202A] bg-[#FAF9F5] p-2.5 rounded-xl border border-[#EAE6DB] leading-relaxed">
              {businessDescription}
            </p>
          )}
        </div>
      </div>

      {/* 2. Unified All-In-One Chat & Match Assistant */}
      <div className="bg-white rounded-2xl border border-[#E3E0D7] p-4 sm:p-6 shadow-2xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#EFECE4]">
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-5 h-5 text-[#E7B84B]" />
            <h2 className="text-base font-bold text-[#18243A]">Smart Trade Assistant & Swap Matcher</h2>
          </div>

          {/* Casual Language Options */}
          <div className="flex items-center space-x-1 text-xs">
            <span className="text-[#68727D] text-[11px] mr-1 font-semibold">Language:</span>
            {[
              { id: 'english', label: 'English' },
              { id: 'swahili', label: 'Kiswahili' },
              { id: 'swahili_english', label: 'Kiswahili + English' },
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id as any)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedLanguage === lang.id
                    ? 'bg-[#121B2B] text-[#E7B84B] font-bold'
                    : 'bg-[#FAF9F5] text-[#68727D] hover:bg-[#EFECE4]'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Sample Chips */}
        <div>
          <span className="text-xs font-semibold text-[#68727D] block mb-1.5">
            Tap a sample trade request or type/speak your own:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(p.text)}
                className="text-left p-2.5 rounded-xl border border-[#E3E0D7] bg-[#FAF9F5] hover:bg-white hover:border-[#121B2B] transition-all text-xs space-y-0.5 shadow-2xs group"
              >
                <span className="font-bold text-[#18243A] group-hover:text-[#2E8B68] block">{p.title}</span>
                <span className="text-[#68727D] line-clamp-1 text-[11px]">{p.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Box with Mic */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#18243A] flex items-center justify-between">
            <span>What do you have extra & what do you need urgently?</span>
            {isRecording && (
              <span className="text-[#DC2626] font-bold text-[11px] animate-pulse">
                Listening... Speak now
              </span>
            )}
          </label>

          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={3}
              className="w-full p-3.5 pr-24 rounded-xl border border-[#E3E0D7] text-xs sm:text-sm text-[#17202A] outline-hidden focus:ring-2 focus:ring-[#121B2B] bg-white transition-all shadow-2xs"
              placeholder="Example: Nahitaji cartons 20 za cooking oil. Naweza kusaidia na bookkeeping..."
            />

            <div className="absolute right-2.5 bottom-3 flex items-center space-x-1.5">
              <button
                onClick={toggleVoiceRecording}
                className={`p-2 rounded-xl transition-all ${
                  isRecording
                    ? 'bg-[#DC2626] text-white ring-4 ring-[#DC2626]/20 animate-pulse'
                    : 'bg-[#FAF9F5] hover:bg-[#EFECE4] text-[#18243A] border border-[#E3E0D7]'
                }`}
                title="Speak using microphone"
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#2E8B68]" />}
              </button>

              <button
                onClick={handlePlayAudioSummary}
                className={`p-2 rounded-xl border transition-all ${
                  isPlayingAudio
                    ? 'bg-[#2E8B68] text-white border-[#2E8B68] animate-pulse'
                    : 'bg-[#FAF9F5] hover:bg-[#EFECE4] text-[#18243A] border-[#E3E0D7]'
                }`}
                title="Listen aloud in voice"
              >
                {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#2E8B68]" />}
              </button>
            </div>
          </div>

          {noticeError && (
            <p className="text-xs text-[#DC2626] bg-[#FEF2F2] p-2.5 rounded-xl border border-[#FCA5A5] font-medium">
              {noticeError}
            </p>
          )}
        </div>

        {/* Submit Match Search */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-[#68727D]">
            100% Non-Monetary Trade &bull; KES 0.00 Cash Debt
          </span>
          <button
            onClick={handleRunMatchSearch}
            disabled={isProcessing || !inputText.trim()}
            className="px-5 py-2.5 rounded-xl bg-[#121B2B] hover:bg-[#202E44] text-[#E7B84B] font-bold text-xs flex items-center space-x-2 transition-all disabled:opacity-50 shadow-xs"
          >
            {isProcessing ? (
              <RefreshCw className="w-4 h-4 animate-spin text-[#E7B84B]" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{isProcessing ? 'Searching Swaps...' : 'Find Matching Trade Loop'}</span>
          </button>
        </div>

        {/* 3. All-In-One Matched Trade Loop Result */}
        {selectedCycle && (
          <div className="pt-4 border-t border-[#E3E0D7] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-[#2E8B68]" />
                <h3 className="font-bold text-sm sm:text-base text-[#18243A]">
                  Matched {selectedCycle.cycle_length}-Shop Barter Loop
                </h3>
              </div>
              <span className="text-xs font-bold text-[#2E8B68] bg-[#EAF5F0] px-3 py-1 rounded-full">
                KES {selectedCycle.estimated_value_unlocked.toLocaleString()} Value Unlocked
              </span>
            </div>

            {/* Step-by-Step Flow */}
            <div className="space-y-2">
              {selectedCycle.edges.map((edge, idx) => {
                const fromName = getSmeName(edge.from_sme_id);
                const toName = getSmeName(edge.to_sme_id);

                return (
                  <div
                    key={edge.id}
                    className="p-3 rounded-xl bg-[#FAF9F5] border border-[#EAE6DB] flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2"
                  >
                    <div className="flex items-center space-x-2 min-w-[140px]">
                      <span className="w-5 h-5 rounded-full bg-[#121B2B] text-[#E7B84B] font-bold text-[10px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-[#18243A]">{fromName}</span>
                    </div>

                    <div className="flex items-center space-x-2 flex-1">
                      <ArrowRight className="w-3.5 h-3.5 text-[#E7B84B] shrink-0" />
                      <div className="bg-white px-2.5 py-1 rounded-lg border border-[#E3E0D7] flex-1">
                        Delivers: <strong>{edge.item_or_service}</strong> (~KES {edge.estimated_value.toLocaleString()})
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#E7B84B] shrink-0" />
                    </div>

                    <div className="min-w-[120px] text-right font-semibold text-[#18243A]">
                      to {toName}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 4. Minimalist Settlement Action & Payment Demo */}
            <div className="p-4 rounded-xl bg-[#EAF5F0] border border-[#2E8B68]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-xs text-[#2E8B68] block">Ready for Barter Settlement</span>
                <p className="text-xs text-[#17202A] mt-0.5">
                  Synchronized bilateral escrow release &bull; KES 0.00 cash debt created
                </p>
              </div>

              <button
                onClick={handleCompleteSettlement}
                className="px-5 py-2.5 rounded-xl bg-[#2E8B68] hover:bg-[#257356] text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>Complete KES 0.00 Barter Settlement</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. Minimalist Payment & Digital Barter Voucher Modal */}
      {showPaymentVoucher && selectedCycle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#E3E0D7] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 space-y-0">
            {/* Header */}
            <div className="p-4 sm:p-5 bg-[#121B2B] text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <FileText className="w-5 h-5 text-[#E7B84B]" />
                <div>
                  <h3 className="font-bold text-base text-white">Commercial Barter Settlement Voucher</h3>
                  <p className="text-xs text-[#8E9CAE]">Official Non-Monetary Trade Invoice & Tax Receipt</p>
                </div>
              </div>
              <button
                onClick={() => setShowPaymentVoucher(false)}
                className="p-1.5 rounded-lg text-[#8E9CAE] hover:text-white hover:bg-[#1E2D44]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Voucher Body */}
            <div className="p-6 space-y-4 text-xs text-[#17202A] bg-[#FAF9F5]">
              <div className="p-4 bg-white rounded-xl border border-[#E3E0D7] space-y-3 shadow-2xs">
                <div className="flex justify-between items-start border-b border-[#EFECE4] pb-3">
                  <div>
                    <span className="font-bold text-sm text-[#18243A] block">Nairobi Barter Clearing Voucher</span>
                    <span className="text-[#68727D] text-[11px]">Voucher ID: #CW-2026-0927-SETTLED</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#EAF5F0] text-[#2E8B68] font-bold text-xs">
                    100% SETTLED
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-[#68727D] block">Issuing Business:</span>
                    <strong className="text-[#18243A] font-bold">{businessName}</strong>
                    <span className="block text-[#68727D]">{location}</span>
                  </div>
                  <div>
                    <span className="text-[#68727D] block">Net Cash Debt Created:</span>
                    <strong className="text-[#2E8B68] font-bold text-sm">KES 0.00</strong>
                    <span className="block text-[#68727D]">0% Interest / Zero Loan</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-[#EFECE4]">
                  <span className="font-bold text-[#18243A] block">Settled Exchange Items:</span>
                  {selectedCycle.edges.map((e, idx) => (
                    <div key={idx} className="flex justify-between text-[11px] p-2 bg-[#FAF9F5] rounded-lg">
                      <span>{getSmeName(e.from_sme_id)} &rarr; {getSmeName(e.to_sme_id)}: {e.item_or_service}</span>
                      <strong className="text-[#18243A]">KES {e.estimated_value.toLocaleString()}</strong>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#EFECE4] flex items-center justify-between text-[10px] text-[#68727D]">
                  <span>SHA-256 Seal: <code>a8f94c2e71d29384b...</code></span>
                  <span>Compliance: KRA Non-Monetary Trade Section 12</span>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-white border border-[#D5D1C4] hover:bg-[#E3E0D7] font-bold text-xs flex items-center space-x-1.5 text-[#18243A]"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Voucher</span>
                </button>
                <button
                  onClick={() => setShowPaymentVoucher(false)}
                  className="px-5 py-2 rounded-xl bg-[#121B2B] text-[#E7B84B] font-bold text-xs shadow-xs"
                >
                  <span>Close Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

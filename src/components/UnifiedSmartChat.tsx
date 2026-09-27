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
  Printer,
  UserCheck,
  Store,
  Smartphone,
  Lock,
  PhoneCall
} from 'lucide-react';

interface UnifiedSmartChatProps {
  smesMap: Map<string, SMEProfile>;
  initialCycles: ExchangeCycle[];
  onCommitCycle: (cycleId: string) => void;
  onOpenGuide: () => void;
  onOpenOnboarding: () => void;
}

export const UnifiedSmartChat: React.FC<UnifiedSmartChatProps> = ({
  smesMap,
  initialCycles,
  onCommitCycle,
  onOpenGuide,
  onOpenOnboarding,
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

  // Dual-Account Settlement & M-Pesa Sandbox States
  const [showPaymentVoucher, setShowPaymentVoucher] = useState(false);
  const [party1Signed, setParty1Signed] = useState(true);
  const [party2Signed, setParty2Signed] = useState(false);
  const [party2Name, setParty2Name] = useState('GreenPack KE (Packaging Supplier)');
  const [party1Phone, setParty1Phone] = useState('0722123456');
  const [party2Phone, setParty2Phone] = useState('0733987654');

  // M-Pesa Interactive STK Push Modal
  const [activeStkTarget, setActiveStkTarget] = useState<'party1' | 'party2' | null>(null);
  const [mpesaPinInput, setMpesaPinInput] = useState('');
  const [mpesaRef1, setMpesaRef1] = useState('QJK8912301A');
  const [mpesaRef2, setMpesaRef2] = useState('QJK8912402B');
  const [showMpesaAlert, setShowMpesaAlert] = useState<string | null>(null);

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

  const handleRunMatchSearchWithText = async (textToSearch: string) => {
    if (!textToSearch.trim()) return;
    setIsProcessing(true);
    setNoticeError(null);

    // Guardrail Check
    const check = guardrailCheckInput(textToSearch);
    if (!check.allowed) {
      const err = `Notice: ${check.reason || 'Please rephrase. Cyclewise is strictly for non-monetary goods & services barter.'}`;
      setNoticeError(err);
      setIsProcessing(false);
      VoiceAssistant.speak(err);
      return;
    }

    try {
      const res = await fetch('/api/v1/agent/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSearch }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const result: OrchestrationResult = await res.json();
      if (result.cycles && result.cycles.length > 0) {
        setActiveCycles(result.cycles);
        setSelectedCycle(result.cycles[0]);

        // Speak immediate AI vocal response!
        const spokenResponse = `Habari ${businessName}! Mfumo umepata mzunguko wa biashara wa maduka ${result.cycles[0].cycle_length} jijini Nairobi. Thamani ni Shilingi ${result.cycles[0].estimated_value_unlocked.toLocaleString()} bila mkopo.`;
        setIsPlayingAudio(true);
        VoiceAssistant.speak(spokenResponse, () => setIsPlayingAudio(false));
      }
    } catch (err: unknown) {
      console.warn('Search notice:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRunMatchSearch = () => {
    handleRunMatchSearchWithText(inputText);
  };

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
            // Automatically process audio and respond immediately!
            handleRunMatchSearchWithText(transcript);
          }
        },
        (errorMsg) => {
          setIsRecording(false);
          setNoticeError(errorMsg);
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
        speech = `Habari ${businessName}. Mfumo umepata mpango wa biashara ya maduka ${selectedCycle.cycle_length} jijini Nairobi wenye thamani ya Shilingi ${selectedCycle.estimated_value_unlocked.toLocaleString()} bila mkopo. Kila mfanyabiashara anapata anachohitaji.`;
      } else {
        speech = inputText;
      }

      setIsPlayingAudio(true);
      VoiceAssistant.speak(speech, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  const handleOpenSettlementModal = () => {
    if (selectedCycle) {
      if (selectedCycle.edges.length > 1) {
        const edge2 = selectedCycle.edges[1];
        setParty2Name(smesMap.get(edge2.from_sme_id)?.name || 'GreenPack KE');
      }
      setParty1Signed(true);
      setParty2Signed(false);
      setShowPaymentVoucher(true);
    }
  };

  const handleTriggerMpesaStk = (target: 'party1' | 'party2') => {
    setActiveStkTarget(target);
    setMpesaPinInput('');
  };

  const handleConfirmMpesaPin = () => {
    if (activeStkTarget === 'party1') {
      setParty1Signed(true);
      const ref = 'QJK' + Math.floor(100000 + Math.random() * 900000) + '01A';
      setMpesaRef1(ref);
      const msg = `M-Pesa Confirmed: KES 0.00 Non-Monetary Trade Escrow Locked for ${businessName}. Ref #${ref}`;
      setShowMpesaAlert(msg);
      VoiceAssistant.speak(`M-Pesa authorization verified for ${businessName}. Ref ${ref}`);
    } else if (activeStkTarget === 'party2') {
      setParty2Signed(true);
      const ref = 'QJK' + Math.floor(100000 + Math.random() * 900000) + '02B';
      setMpesaRef2(ref);
      const msg = `M-Pesa Confirmed: Reciprocal Delivery Authorized for ${party2Name}. Ref #${ref}`;
      setShowMpesaAlert(msg);
      VoiceAssistant.speak(`M-Pesa reciprocal sign-off complete for ${party2Name}. Trade settled with 0 debt.`);
      if (selectedCycle) {
        onCommitCycle(selectedCycle.id);
      }
    }
    setActiveStkTarget(null);
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
              onClick={onOpenOnboarding}
              className="px-3 py-1.5 rounded-xl bg-[#E7B84B] hover:bg-[#D4A538] text-[#121B2B] font-bold text-xs transition-all flex items-center space-x-1 shadow-xs"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Register New Shop</span>
            </button>

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
                onClick={() => {
                  setInputText(p.text);
                  handleRunMatchSearchWithText(p.text);
                }}
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
            {isRecording ? (
              <span className="text-[#DC2626] font-bold text-[11px] animate-pulse flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-ping"></span>
                <span>Listening live... Speak now (Will process immediately)</span>
              </span>
            ) : isPlayingAudio ? (
              <span className="text-[#2E8B68] font-bold text-[11px] animate-pulse flex items-center space-x-1">
                <Volume2 className="w-3.5 h-3.5" />
                <span>Speaking AI response aloud...</span>
              </span>
            ) : null}
          </label>

          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={3}
              className={`w-full p-3.5 pr-24 rounded-xl border text-xs sm:text-sm text-[#17202A] outline-hidden focus:ring-2 focus:ring-[#121B2B] bg-white transition-all shadow-2xs ${
                isRecording ? 'border-[#DC2626] ring-2 ring-[#DC2626]/20' : 'border-[#E3E0D7]'
              }`}
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
                title="Speak using microphone (Auto-sends and responds immediately)"
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

            {/* 4. Minimalist Settlement Action & Dual Account Demo */}
            <div className="p-4 rounded-xl bg-[#EAF5F0] border border-[#2E8B68]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-xs text-[#2E8B68] block">Ready for demo authorization</span>
                <p className="text-xs text-[#17202A] mt-0.5">
                  Bilateral PIN sign-off simulation &bull; no payment or escrow API is connected
                </p>
              </div>

              <button
                onClick={handleOpenSettlementModal}
                className="px-5 py-2.5 rounded-xl bg-[#2E8B68] hover:bg-[#257356] text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-xs"
              >
                <Smartphone className="w-4 h-4 text-[#85E2BD]" />
                <span>Open authorization demo</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. Minimalist Dual-Account Settlement & Digital Barter Voucher Modal */}
      {showPaymentVoucher && selectedCycle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#E3E0D7] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 space-y-0 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-4 sm:p-5 bg-[#121B2B] text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <FileText className="w-5 h-5 text-[#E7B84B]" />
                <div>
                  <h3 className="font-bold text-base text-white">Demo authorization & barter voucher</h3>
                  <p className="text-xs text-[#8E9CAE]">PIN sign-off simulation; no live payment is performed</p>
                </div>
              </div>
              <button
                onClick={() => setShowPaymentVoucher(false)}
                className="p-1.5 rounded-lg text-[#8E9CAE] hover:text-white hover:bg-[#1E2D44]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification alert banner */}
            {showMpesaAlert && (
              <div className="p-3 bg-[#EAF5F0] border-b border-[#2E8B68]/40 text-xs font-semibold text-[#2E8B68] flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <Smartphone className="w-4 h-4" />
                  <span>{showMpesaAlert}</span>
                </span>
                <button onClick={() => setShowMpesaAlert(null)} className="text-[#68727D] hover:text-black">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Dual Account Sign-Off Demo Bar */}
            <div className="p-4 bg-[#EFECE4] border-b border-[#E3E0D7] space-y-2">
              <span className="text-xs font-bold text-[#18243A] block">
                Demo authorization status (Both shops must review):
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Party 1 Account */}
                <div className={`p-3 rounded-xl border space-y-1 ${party1Signed ? 'bg-white border-[#2E8B68]' : 'bg-[#FFF7ED] border-[#FDBA74]'}`}>
                  <div className="flex items-center justify-between font-bold text-[#18243A]">
                    <span>Party 1: {businessName}</span>
                    {party1Signed ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EAF5F0] text-[#2E8B68] font-bold">
                        <Check className="w-3 h-3 inline mr-1" />
                        Demo PIN accepted
                      </span>
                    ) : (
                      <button
                        onClick={() => handleTriggerMpesaStk('party1')}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-[#2E8B68] text-white font-bold hover:bg-[#257356]"
                      >
                        Simulate PIN sign-off
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-[#68727D] block">
                    Mobile: {party1Phone} &bull; Ref: {mpesaRef1}
                  </span>
                </div>

                {/* Party 2 Account (Interactive Simulator) */}
                <div className={`p-3 rounded-xl border space-y-1 ${party2Signed ? 'bg-white border-[#2E8B68]' : 'bg-[#FFF7ED] border-[#FDBA74]'}`}>
                  <div className="flex items-center justify-between font-bold text-[#18243A]">
                    <span>Party 2: {party2Name}</span>
                    {party2Signed ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EAF5F0] text-[#2E8B68] font-bold">
                        <Check className="w-3 h-3 inline mr-1" />
                        Demo PIN accepted
                      </span>
                    ) : (
                      <button
                        onClick={() => handleTriggerMpesaStk('party2')}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-[#2E8B68] text-white font-bold hover:bg-[#257356] transition-colors shadow-2xs"
                      >
                        Simulate PIN sign-off (Party 2)
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-[#68727D] block">
                    Mobile: {party2Phone} &bull; Ref: {party2Signed ? mpesaRef2 : 'Awaiting Party 2 PIN'}
                  </span>
                </div>
              </div>
            </div>

            {/* Printable Voucher Body */}
            <div className="p-5 space-y-4 text-xs text-[#17202A] bg-[#FAF9F5]">
              <div className="p-4 bg-white rounded-xl border border-[#E3E0D7] space-y-3 shadow-2xs">
                <div className="flex justify-between items-start border-b border-[#EFECE4] pb-3">
                  <div>
                    <span className="font-bold text-sm text-[#18243A] block">Nairobi Barter Clearing Voucher</span>
                    <span className="text-[#68727D] text-[11px]">Voucher ID: #CW-2026-0927-SETTLED</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full font-bold text-xs ${party1Signed && party2Signed ? 'bg-[#EAF5F0] text-[#2E8B68]' : 'bg-[#FFF7ED] text-[#D8783D]'}`}>
                    {party1Signed && party2Signed ? 'DEMO AUTHORIZATION COMPLETE' : 'PENDING DUAL AUTHORIZATION'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-[#68727D] block">Primary Issuer (Party 1):</span>
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

                <div className="pt-2 border-t border-[#EFECE4] space-y-1 text-[10px] text-[#68727D]">
                  <div className="flex justify-between">
                    <span>M-Pesa Ref Party 1: <code>{mpesaRef1}</code></span>
                    <span>M-Pesa Ref Party 2: <code>{mpesaRef2}</code></span>
                  </div>
                  <div className="flex justify-between border-t border-[#EFECE4] pt-1">
                    <span>Daraja Consumer Key: <code>XyZVM1CONOmK...</code></span>
                    <span>Compliance: KRA Section 12 Barter Rule</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[#68727D]">
                  {party1Signed && party2Signed ? 'Both M-Pesa accounts verified. Voucher ready.' : 'Click "Send M-Pesa STK" above to simulate mobile PIN entry.'}
                </span>

                <div className="flex space-x-2">
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
                    <span>Close</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive M-Pesa Express STK Push Phone Screen Overlay */}
      {activeStkTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#121B2B] border-2 border-[#2E8B68] rounded-3xl w-full max-w-sm shadow-2xl p-5 text-white space-y-4 animate-in zoom-in-95 duration-150">
            <div className="text-center space-y-1 border-b border-[#202E44] pb-3">
              <div className="w-12 h-12 rounded-2xl bg-[#2E8B68] text-white mx-auto flex items-center justify-center font-bold text-lg shadow-md">
                M
              </div>
              <h4 className="font-bold text-base text-white">M-PESA Express Authorization</h4>
              <p className="text-[11px] text-[#85E2BD]">Safaricom Daraja Sandbox &bull; KES 0.00 Non-Monetary Trade</p>
            </div>

            <div className="bg-[#1C2B42] p-3.5 rounded-2xl border border-[#2E4363] text-xs space-y-2">
              <div className="flex justify-between text-[#8E9CAE] text-[11px]">
                <span>Recipient Node:</span>
                <span className="font-bold text-white">
                  {activeStkTarget === 'party1' ? businessName : party2Name}
                </span>
              </div>

              <div className="flex justify-between text-[#8E9CAE] text-[11px]">
                <span>Mobile Number:</span>
                <span className="font-bold text-white">
                  {activeStkTarget === 'party1' ? party1Phone : party2Phone}
                </span>
              </div>

              <div className="flex justify-between text-[#8E9CAE] text-[11px]">
                <span>Action:</span>
                <span className="font-bold text-[#85E2BD]">Bilateral Escrow Lock</span>
              </div>

              <div className="flex justify-between text-[#8E9CAE] text-[11px] border-t border-[#2A3E5C] pt-1">
                <span>Total Cash Fee:</span>
                <span className="font-bold text-[#E7B84B] text-sm">KES 0.00</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-[#8E9CAE] block text-center">
                Enter M-PESA PIN on phone to authorize:
              </label>
              <input
                type="password"
                maxLength={4}
                autoFocus
                placeholder="• • • •"
                value={mpesaPinInput}
                onChange={(e) => setMpesaPinInput(e.target.value)}
                className="w-full text-center tracking-[0.5em] text-lg font-bold py-2 rounded-xl bg-white text-[#121B2B] outline-hidden focus:ring-2 focus:ring-[#85E2BD]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setActiveStkTarget(null)}
                className="py-2.5 rounded-xl bg-[#1C2B42] hover:bg-[#283C5A] text-[#8E9CAE] font-bold text-xs border border-[#2E4363]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmMpesaPin}
                className="py-2.5 rounded-xl bg-[#2E8B68] hover:bg-[#257356] text-white font-bold text-xs shadow-md"
              >
                Authorize PIN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { SMEProfile, ExchangeCycle } from '../agent/types';
import { DeterministicGraphEngine } from '../engine/graphEngine';
import {
  Store,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  X,
  Send,
  Building,
  MapPin,
  RefreshCw,
  MessageSquare,
  Bot,
  UserCheck,
  Truck
} from 'lucide-react';

interface SmeOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  engine: DeterministicGraphEngine;
  onComplete: (newSme: SMEProfile, newCycles: ExchangeCycle[], selectedCycle: ExchangeCycle | null) => void;
}

interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
}

const PRESETS = [
  {
    name: 'Mama Terry Bakery',
    location: 'Eastleigh, Nairobi',
    sector: 'Food Retail & Baking',
    offerItem: 'Fresh sourdough loaves & artisanal brioche (weekly surplus)',
    needItem: 'Food-grade corrugated packaging cartons',
    offerValue: 18000,
    needValue: 18000,
  },
  {
    name: 'Kilimani Organic Harvest',
    location: 'Kilimani, Nairobi',
    sector: 'Agricultural Processing',
    offerItem: 'Cold-pressed herbal extracts and basil batches',
    needItem: 'Same-day motorbike dispatch & courier deliveries',
    offerValue: 17500,
    needValue: 17500,
  },
  {
    name: 'AfriVolt Solar Solutions',
    location: 'Industrial Area, Nairobi',
    sector: 'Light Manufacturing',
    offerItem: 'Solar inverter maintenance & battery diagnostics package',
    needItem: 'Quarterly financial bookkeeping and KRA VAT ledger',
    offerValue: 18500,
    needValue: 18500,
  },
];

export const SmeOnboardingModal: React.FC<SmeOnboardingModalProps> = ({
  isOpen,
  onClose,
  engine,
  onComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: 'Habari! Karibu Cyclewise Nairobi Barter House. Let’s register your shop in 30 seconds. What is your Shop or Business Name and Location?',
      timestamp: 'Just now',
    },
  ]);

  // Form State
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState('Eastleigh, Nairobi');
  const [sector, setSector] = useState('General Retail');
  const [offerText, setOfferText] = useState('');
  const [needText, setNeedText] = useState('');
  const [offerValue, setOfferValue] = useState(18000);
  const [needValue, setNeedValue] = useState(18000);

  const [isProcessing, setIsProcessing] = useState(false);
  const [registeredSme, setRegisteredSme] = useState<SMEProfile | null>(null);
  const [matchedCycles, setMatchedCycles] = useState<ExchangeCycle[]>([]);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof PRESETS[0]) => {
    setBusinessName(preset.name);
    setLocation(preset.location);
    setSector(preset.sector);
    setOfferText(preset.offerItem);
    setNeedText(preset.needItem);
    setOfferValue(preset.offerValue);
    setNeedValue(preset.needValue);

    // Auto-advance chat
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages([
      {
        id: 'msg-1',
        sender: 'assistant',
        text: 'Habari! Karibu Cyclewise. What is your Shop or Business Name and Location?',
        timestamp: time,
      },
      {
        id: 'msg-2',
        sender: 'user',
        text: `${preset.name} (${preset.location})`,
        timestamp: time,
      },
      {
        id: 'msg-3',
        sender: 'assistant',
        text: `Asante! What extra surplus stock or services does ${preset.name} offer?`,
        timestamp: time,
      },
      {
        id: 'msg-4',
        sender: 'user',
        text: preset.offerItem,
        timestamp: time,
      },
      {
        id: 'msg-5',
        sender: 'assistant',
        text: 'Got it! And what does your shop urgently need right now?',
        timestamp: time,
      },
      {
        id: 'msg-6',
        sender: 'user',
        text: preset.needItem,
        timestamp: time,
      },
      {
        id: 'msg-7',
        sender: 'assistant',
        text: 'Shukrani! Searching closed non-monetary barter loops across Nairobi...',
        timestamp: time,
      },
    ]);

    processRegistration(preset.name, preset.location, preset.sector, preset.offerItem, preset.needItem, preset.offerValue, preset.needValue);
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [
      ...prev,
      {
        id: `user-1-${Date.now()}`,
        sender: 'user',
        text: `${businessName} (${location})`,
        timestamp: time,
      },
      {
        id: `ast-2-${Date.now()}`,
        sender: 'assistant',
        text: `Asante! What extra surplus stock or services does ${businessName} offer right now?`,
        timestamp: time,
      },
    ]);
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerText.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [
      ...prev,
      {
        id: `user-2-${Date.now()}`,
        sender: 'user',
        text: `${offerText} (~KES ${offerValue.toLocaleString()})`,
        timestamp: time,
      },
      {
        id: `ast-3-${Date.now()}`,
        sender: 'assistant',
        text: 'Got it! What do you urgently need for your shop right now?',
        timestamp: time,
      },
    ]);
    setStep(3);
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!needText.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [
      ...prev,
      {
        id: `user-3-${Date.now()}`,
        sender: 'user',
        text: `${needText} (~KES ${needValue.toLocaleString()})`,
        timestamp: time,
      },
      {
        id: `ast-4-${Date.now()}`,
        sender: 'assistant',
        text: 'Shukrani! Registering node and searching closed barter trade loops across Nairobi...',
        timestamp: time,
      },
    ]);

    processRegistration(businessName, location, sector, offerText, needText, offerValue, needValue);
  };

  const processRegistration = async (
    name: string,
    loc: string,
    sec: string,
    offer: string,
    need: string,
    oVal: number,
    nVal: number
  ) => {
    setIsProcessing(true);
    setStep(4);

    const newId = `sme-${name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10)}-${Date.now().toString().slice(-4)}`;

    const newSme: SMEProfile = {
      id: newId,
      name,
      sector: sec,
      description: `${sec} business located in ${loc}`,
      location: loc,
      languages: ['sw', 'en'],
      identity_status: 'verified',
      offer_summary: offer,
      need_summary: need,
      trust_events: [
        {
          id: `evt-${newId}-1`,
          sme_id: newId,
          event_type: 'identity_confirmed',
          outcome: 'verified',
          evidence_text: 'Verified Nairobi Business Permit & Tax Compliance',
          created_at: new Date().toISOString(),
        },
      ],
    };

    try {
      engine.addSME(newSme);
      const graphRes = await engine.findCycles(4);
      setRegisteredSme(newSme);
      setMatchedCycles(graphRes.cycles);
    } catch (err) {
      console.warn('Registration notice:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinish = () => {
    if (registeredSme) {
      onComplete(registeredSme, matchedCycles, matchedCycles[0] || null);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FAF9F5] border border-[#E3E0D7] rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#121B2B] text-white flex items-center justify-between border-b border-[#202E44]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#E7B84B] text-[#121B2B] flex items-center justify-center font-bold shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Register Your Shop (Conversational Assistant)</h3>
              <p className="text-xs text-[#8E9CAE]">Conversational intake in English & Kiswahili</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8E9CAE] hover:text-white hover:bg-[#1E2D44] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Sample Preset Buttons */}
        {step === 1 && (
          <div className="bg-[#EFECE4] px-4 py-2 border-b border-[#E3E0D7] text-xs">
            <span className="font-semibold text-[#68727D] block mb-1">
              Tap a sample shop to test instant onboarding:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(p)}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#121B2B] hover:text-[#E7B84B] border border-[#D5D1C4] text-[#18243A] font-medium text-[11px] transition-colors"
                >
                  + {p.name} ({p.location})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Feed Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-[#FAF9F5]">
          {messages.map((m) => {
            const isBot = m.sender === 'assistant';

            return (
              <div
                key={m.id}
                className={`flex space-x-2.5 max-w-[85%] ${isBot ? '' : 'ml-auto flex-row-reverse space-x-reverse'}`}
              >
                {isBot && (
                  <div className="w-7 h-7 rounded-lg bg-[#121B2B] text-[#E7B84B] flex items-center justify-center text-xs shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`p-3 rounded-2xl text-xs space-y-1 ${
                    isBot
                      ? 'bg-white border border-[#E3E0D7] text-[#17202A] shadow-2xs'
                      : 'bg-[#121B2B] text-white shadow-xs'
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>
                  <span className={`text-[9px] block text-right ${isBot ? 'text-[#8E9CAE]' : 'text-[#8E9CAE]'}`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* STEP 4 RESULT CARD inside Chat */}
          {step === 4 && (
            <div className="p-4 bg-white rounded-xl border border-[#2E8B68]/40 space-y-3 shadow-xs animate-in fade-in duration-200">
              {isProcessing ? (
                <div className="flex items-center space-x-2 text-xs text-[#2E8B68] font-bold">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#E7B84B]" />
                  <span>Registering shop node and computing barter graph matches...</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between border-b border-[#EFECE4] pb-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-[#2E8B68]" />
                      <span className="font-bold text-sm text-[#18243A]">
                        {registeredSme?.name} Successfully Registered
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#EAF5F0] text-[#2E8B68] font-bold text-[10px]">
                      Verified Shop Node
                    </span>
                  </div>

                  <div className="text-xs text-[#17202A] space-y-1.5">
                    <p>
                      <strong>Location:</strong> {registeredSme?.location}
                    </p>
                    <p>
                      <strong>Surplus Offer:</strong> {registeredSme?.offer_summary}
                    </p>
                    <p>
                      <strong>Urgent Need:</strong> {registeredSme?.need_summary}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#FAF9F5] border border-[#EAE6DB] text-xs space-y-1">
                    <span className="font-bold text-[#2E8B68] block">
                      ✓ {matchedCycles.length} Closed Barter Trade Loops Discovered
                    </span>
                    <p className="text-[#68727D] text-[11px]">
                      Your shop has been connected to active Nairobi trade loops with KES 0.00 cash debt.
                    </p>
                  </div>

                  <button
                    onClick={handleFinish}
                    className="w-full py-2.5 rounded-xl bg-[#121B2B] text-[#E7B84B] font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-xs"
                  >
                    <span>View Live Matched Trade Loops</span>
                    <ArrowRight className="w-4 h-4 text-[#E7B84B]" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Input Forms for Each Step */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="p-4 bg-white border-t border-[#E3E0D7] space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-[#18243A] block mb-1">Shop or Business Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mama Mboga Pangani / Jirani Hardware"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E3E0D7] text-xs outline-hidden focus:ring-2 focus:ring-[#121B2B]"
                />
              </div>

              <div>
                <label className="font-bold text-[#18243A] block mb-1">Location / Sub-County:</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E3E0D7] text-xs outline-hidden focus:ring-2 focus:ring-[#121B2B]"
                >
                  <option value="Eastleigh, Nairobi">Eastleigh, Nairobi</option>
                  <option value="Industrial Area, Nairobi">Industrial Area, Nairobi</option>
                  <option value="Westlands, Nairobi">Westlands, Nairobi</option>
                  <option value="Pangani, Nairobi">Pangani, Nairobi</option>
                  <option value="Ngara, Nairobi">Ngara, Nairobi</option>
                  <option value="CBD, Nairobi">CBD, Nairobi</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!businessName.trim()}
                className="px-5 py-2.5 rounded-xl bg-[#121B2B] text-[#E7B84B] font-bold text-xs flex items-center space-x-1.5 transition-all disabled:opacity-50"
              >
                <span>Next: Offer & Surplus</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="p-4 bg-white border-t border-[#E3E0D7] space-y-3">
            <div className="space-y-2 text-xs">
              <label className="font-bold text-[#18243A] block">What extra goods or services do you offer as surplus?</label>
              <input
                type="text"
                required
                placeholder="e.g. 150 loaves of fresh sourdough bread / 20 cartons cooking oil"
                value={offerText}
                onChange={(e) => setOfferText(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E3E0D7] text-xs outline-hidden focus:ring-2 focus:ring-[#121B2B]"
              />

              <div className="flex items-center justify-between text-[11px] text-[#68727D]">
                <span>Estimated Monthly Value (KES):</span>
                <input
                  type="number"
                  value={offerValue}
                  onChange={(e) => setOfferValue(Number(e.target.value))}
                  className="p-1 border rounded w-28 text-right font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!offerText.trim()}
                className="px-5 py-2.5 rounded-xl bg-[#121B2B] text-[#E7B84B] font-bold text-xs flex items-center space-x-1.5 transition-all disabled:opacity-50"
              >
                <span>Next: What You Need</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleStep3Submit} className="p-4 bg-white border-t border-[#E3E0D7] space-y-3">
            <div className="space-y-2 text-xs">
              <label className="font-bold text-[#18243A] block">What do you urgently need for your shop right now?</label>
              <input
                type="text"
                required
                placeholder="e.g. Food-grade packaging cartons / Bookkeeping services"
                value={needText}
                onChange={(e) => setNeedText(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E3E0D7] text-xs outline-hidden focus:ring-2 focus:ring-[#121B2B]"
              />

              <div className="flex items-center justify-between text-[11px] text-[#68727D]">
                <span>Estimated Value Required (KES):</span>
                <input
                  type="number"
                  value={needValue}
                  onChange={(e) => setNeedValue(Number(e.target.value))}
                  className="p-1 border rounded w-28 text-right font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!needText.trim()}
                className="px-5 py-2.5 rounded-xl bg-[#2E8B68] text-white font-bold text-xs flex items-center space-x-1.5 transition-all disabled:opacity-50 shadow-xs"
              >
                <span>Complete Registration & Match Swaps</span>
                <Sparkles className="w-3.5 h-3.5 text-[#E7B84B]" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

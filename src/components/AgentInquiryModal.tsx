import React, { useState, useEffect } from 'react';
import { ExchangeCycle, SMEProfile } from '../agent/types';
import {
  Bot,
  Sparkles,
  Send,
  X,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  CornerDownLeft,
  RefreshCw,
  MessageSquare,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { VoiceAssistant } from '../utils/voiceAssistant';

interface AgentInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  cycle: ExchangeCycle | null;
  smes: Map<string, SMEProfile>;
  onRunSubstitute?: (declinedSmeId: string) => void;
}

export const AgentInquiryModal: React.FC<AgentInquiryModalProps> = ({
  isOpen,
  onClose,
  cycle,
  smes,
  onRunSubstitute,
}) => {
  const [question, setQuestion] = useState('');
  const [modelPreference, setModelPreference] = useState<string>('auto');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  const [messages, setMessages] = useState<Array<{
    sender: 'user' | 'agent';
    text: string;
    model?: string;
    durationMs?: number;
    risk?: string;
    citations?: string[];
  }>>([
    {
      sender: 'agent',
        text: cycle
        ? `Jambo! I am the Cyclewise Smart Assistant. I can explain the returned facts for this ${cycle.cycle_length}-shop proposed loop (KES ${cycle.estimated_value_unlocked.toLocaleString()} estimated exchange value). Ask me anything in Swahili, Sheng, or English—you can also tap the mic to speak!`
        : 'Jambo! I am the Cyclewise Smart Assistant. Ask me any question about how Nairobi shops trade surplus supplies, how delivery works, or why this prevents debt.',
      citations: ['Cyclewise deterministic graph', 'Participant evidence ledger'],
    },
  ]);

  useEffect(() => {
    return () => {
      VoiceAssistant.stopListening();
      VoiceAssistant.stopSpeaking();
    };
  }, []);

  if (!isOpen) return null;

  const quickQuestions = [
    { label: 'Why no debt?', q: 'How does this trade protect SMEs from emergency cash loans or bad debt?' },
    { label: 'Amina details', q: 'What does Amina Foods give and receive in this exchange cycle?' },
    { label: 'Kiswahili summary', q: 'Eleza kwa Kiswahili jinsi biashara hizi 4 zinavyosaidiana bila mkopo.' },
    { label: 'Late delivery risk', q: 'What happens if a participant like GreenPack or SwiftMove delivers late?' },
  ];

  const handleAsk = async (userQ?: string) => {
    const textToAsk = userQ || question;
    if (!textToAsk.trim() || isLoading) return;

    setQuestion('');
    setMessages((prev) => [...prev, { sender: 'user', text: textToAsk }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/v1/agent/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToAsk,
          cycle: cycle || undefined,
          model_preference: modelPreference,
        }),
      });

      if (!res.ok) {
        throw new Error(`Inquiry error: HTTP ${res.status}`);
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: data.answer,
          model: data.model_used,
          durationMs: data.duration_ms,
          risk: data.risk_assessment,
          citations: data.grounded_citations,
        },
      ]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Inquiry request failed';
      setMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: `Samahani, network notice: ${msg}. Please retry.`,
          risk: 'Transient connection notice',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoiceRecording = () => {
    if (isRecording) {
      VoiceAssistant.stopListening();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      VoiceAssistant.startListening(
        (transcript, isFinal) => {
          setQuestion(transcript);
          if (isFinal) {
            setIsRecording(false);
            handleAsk(transcript);
          }
        },
        () => {
          setIsRecording(false);
        },
        'sw-KE'
      );
    }
  };

  const toggleSpeakMessage = (text: string, index: number) => {
    if (speakingIndex === index) {
      VoiceAssistant.stopSpeaking();
      setSpeakingIndex(null);
    } else {
      setSpeakingIndex(index);
      VoiceAssistant.speak(text, () => {
        setSpeakingIndex(null);
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FAF9F5] border border-[#E3E0D7] rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col h-[85vh] max-h-[700px] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 bg-[#121B2B] text-white flex items-center justify-between border-b border-[#202E44]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E7B84B] to-[#C9972E] p-0.5 shadow-xs flex items-center justify-center text-[#121B2B] shrink-0">
              <MessageSquare className="w-5 h-5 text-[#121B2B]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-white">Ask Cyclewise Trade Assistant</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2E8B68] text-white font-bold">
                  Voice & Q&A
                </span>
              </div>
              <p className="text-xs text-[#8E9CAE]">
                Speaks English, Swahili & Sheng &bull; Grounded answers on proposed trade loops
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8E9CAE] hover:text-white hover:bg-[#1E2D44] transition-colors"
            aria-label="Close dialogue"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`p-3.5 rounded-2xl max-w-[85%] text-xs sm:text-sm leading-relaxed shadow-2xs ${
                  m.sender === 'user'
                    ? 'bg-[#121B2B] text-white rounded-br-xs'
                    : 'bg-white border border-[#E3E0D7] text-[#17202A] rounded-bl-xs'
                }`}
              >
                {/* Agent Header with Voice Playback */}
                {m.sender === 'agent' && (
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#EFECE4] text-[11px]">
                    <div className="flex items-center space-x-1.5 text-[#2E8B68] font-bold">
                      <Bot className="w-3.5 h-3.5" />
                      <span>Cyclewise Assistant</span>
                    </div>

                    <button
                      onClick={() => toggleSpeakMessage(m.text, idx)}
                      className="flex items-center space-x-1 text-[10px] font-semibold text-[#18243A] hover:text-[#2E8B68] bg-[#FAF9F5] px-2 py-0.5 rounded-md border border-[#E3E0D7]"
                      title="Listen aloud in voice"
                    >
                      {speakingIndex === idx ? (
                        <>
                          <VolumeX className="w-3 h-3 text-[#DC2626]" />
                          <span className="text-[#DC2626]">Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3 text-[#2E8B68]" />
                          <span>Listen (Sauti)</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                <p className="whitespace-pre-wrap">{m.text}</p>

                {/* Agent Citations & Telemetry */}
                {m.sender === 'agent' && m.citations && m.citations.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-[#EFECE4] text-[10px] text-[#68727D] space-y-1">
                    <div className="flex flex-wrap items-center gap-1 font-semibold">
                      <span className="text-[#2E8B68]">Verified Sources:</span>
                      {m.citations.map((c, i) => (
                        <span key={i} className="bg-[#FAF9F5] px-1.5 py-0.5 rounded-sm border border-[#E3E0D7]">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-xs text-[#68727D] p-3 bg-white rounded-xl border border-[#E3E0D7] w-fit">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#2E8B68]" />
              <span>Grounded Assistant is answering...</span>
            </div>
          )}
        </div>

        {/* Quick Question Chips */}
        <div className="p-3 bg-[#EFECE4] border-t border-[#E3E0D7] space-y-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-bold text-[#68727D] mr-1 shrink-0">Quick Ask:</span>
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleAsk(q.q)}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#FAF9F5] text-[#18243A] border border-[#D5D1C4] text-[11px] font-medium whitespace-nowrap shadow-2xs transition-colors"
              >
                {q.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#68727D]">
            <span>Model path: <strong>Configured provider ➔ local deterministic fallback</strong></span>
            {isRecording && (
              <span className="text-[#DC2626] font-bold flex items-center gap-1 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[#DC2626]"></span>
                Listening... speak your question
              </span>
            )}
          </div>
        </div>

        {/* Input Box with Voice Mic */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#E3E0D7] flex items-center space-x-2">
          <button
            onClick={toggleVoiceRecording}
            className={`p-2.5 rounded-xl transition-all ${
              isRecording
                ? 'bg-[#DC2626] text-white ring-4 ring-[#DC2626]/20 animate-pulse'
                : 'bg-[#FAF9F5] hover:bg-[#EFECE4] text-[#18243A] border border-[#E3E0D7]'
            }`}
            title="Speak your question using microphone"
            aria-label="Voice input"
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#2E8B68]" />}
          </button>

          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAsk();
            }}
            placeholder="Type or speak a question in Swahili or English..."
            className="flex-1 p-2.5 rounded-xl border border-[#E3E0D7] text-xs sm:text-sm text-[#17202A] outline-hidden focus:ring-2 focus:ring-[#121B2B] bg-white"
          />

          <button
            onClick={() => handleAsk()}
            disabled={!question.trim() || isLoading}
            className="p-2.5 rounded-xl bg-[#121B2B] hover:bg-[#202E44] text-[#E7B84B] transition-all disabled:opacity-40 shadow-xs"
            aria-label="Send question"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

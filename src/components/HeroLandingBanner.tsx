import React from 'react';
import {
  Sparkles,
  Store,
  HelpCircle,
  Zap,
  ShieldCheck,
  Smartphone,
  FileCheck2,
  ArrowRight,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { CyclewiseLogo } from './CyclewiseLogo';

interface HeroLandingBannerProps {
  onStartMatching: () => void;
  onOpenOnboarding: () => void;
  onOpenGuide: () => void;
}

export const HeroLandingBanner: React.FC<HeroLandingBannerProps> = ({
  onStartMatching,
  onOpenOnboarding,
  onOpenGuide,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#0B132B] via-[#0F1C3F] to-[#0A1A2F] text-white rounded-3xl border border-[#1C2B4E] p-6 sm:p-8 shadow-xl space-y-6">
      {/* Decorative ambient glowing circles */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#F59E0B]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-3xl space-y-4">
        {/* Top Tagline Pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#132247] border border-[#233A6B] text-[11px] font-bold text-[#F59E0B] shadow-xs">
          <CyclewiseLogo size={18} variant="gold" />
          <span>Nairobi SME Non-Monetary Trade House &bull; KES 0.00 Debt</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
          Unlocking SME Potential <br />
          <span className="bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#34D399] bg-clip-text text-transparent">
            Without High-Interest Cash Loans
          </span>
        </h1>

        {/* Hero Description */}
        <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed max-w-2xl font-normal">
          Swap your surplus stock & services directly for what your shop urgently needs in closed 3-to-4 shop barter loops across Nairobi (Eastleigh, Industrial Area, Westlands, Ngara, CBD).
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onStartMatching}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#F59E0B] via-[#E7B84B] to-[#D97706] hover:brightness-110 text-[#0B132B] font-extrabold text-xs flex items-center space-x-2 transition-all shadow-md active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-[#0B132B]" />
            <span>Launch AI Swap Matcher</span>
            <ArrowRight className="w-4 h-4 text-[#0B132B]" />
          </button>

          <button
            onClick={onOpenOnboarding}
            className="px-4 py-3 rounded-2xl bg-[#132247] hover:bg-[#1C3260] text-white border border-[#233A6B] font-bold text-xs flex items-center space-x-2 transition-all shadow-xs"
          >
            <Store className="w-4 h-4 text-[#F59E0B]" />
            <span>Register Your Shop (30s)</span>
          </button>

          <button
            onClick={onOpenGuide}
            className="px-4 py-3 rounded-2xl bg-[#132247] hover:bg-[#1C3260] text-[#34D399] border border-[#233A6B] font-semibold text-xs flex items-center space-x-1.5 transition-all"
          >
            <HelpCircle className="w-4 h-4 text-[#10B981]" />
            <span>5-Step Guide</span>
          </button>
        </div>
      </div>

      {/* Proof & Feature Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#1C2B4E]">
        <div className="p-3 rounded-2xl bg-[#132247]/60 border border-[#233A6B]/60 space-y-1 backdrop-blur-xs">
          <div className="flex items-center space-x-1.5 text-[#F59E0B] font-bold text-xs">
            <Zap className="w-4 h-4" />
            <span>&lt;15ms Latency</span>
          </div>
          <p className="text-[10px] text-[#9CA3AF] leading-tight">Deterministic Bounded DFS graph search</p>
        </div>

        <div className="p-3 rounded-2xl bg-[#132247]/60 border border-[#233A6B]/60 space-y-1 backdrop-blur-xs">
          <div className="flex items-center space-x-1.5 text-[#34D399] font-bold text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>KES 0.00 Debt</span>
          </div>
          <p className="text-[10px] text-[#9CA3AF] leading-tight">0% interest shylock-free barter clearing</p>
        </div>

        <div className="p-3 rounded-2xl bg-[#132247]/60 border border-[#233A6B]/60 space-y-1 backdrop-blur-xs">
          <div className="flex items-center space-x-1.5 text-[#F59E0B] font-bold text-xs">
            <Smartphone className="w-4 h-4" />
            <span>M-Pesa Escrow</span>
          </div>
          <p className="text-[10px] text-[#9CA3AF] leading-tight">Bilateral mobile STK PIN authorization</p>
        </div>

        <div className="p-3 rounded-2xl bg-[#132247]/60 border border-[#233A6B]/60 space-y-1 backdrop-blur-xs">
          <div className="flex items-center space-x-1.5 text-[#34D399] font-bold text-xs">
            <FileCheck2 className="w-4 h-4" />
            <span>KRA Tax Voucher</span>
          </div>
          <p className="text-[10px] text-[#9CA3AF] leading-tight">Section 12 SHA-256 commercial receipt</p>
        </div>
      </div>
    </div>
  );
};

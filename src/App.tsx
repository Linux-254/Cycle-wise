import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { UnifiedSmartChat } from './components/UnifiedSmartChat';
import { EvidencePanel } from './components/EvidencePanel';
import { HackathonRubricModal } from './components/HackathonRubricModal';
import { JudgeFlowGuideModal } from './components/JudgeFlowGuideModal';
import { AiFeaturesMatrixModal } from './components/AiFeaturesMatrixModal';
import { SmeOnboardingModal } from './components/SmeOnboardingModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { BarterCartModal, CartItem } from './components/BarterCartModal';
import { HeroLandingBanner } from './components/HeroLandingBanner';
import { CyclewiseLogo } from './components/CyclewiseLogo';
import { DeterministicGraphEngine } from './engine/graphEngine';
import { SEEDED_SMES } from './engine/fixtures';
import { ExchangeCycle, SMEProfile } from './agent/types';
import {
  Sparkles,
  HelpCircle,
  Building,
  MapPin,
  CheckCircle2,
  Filter,
  ArrowRight,
  ShieldCheck,
  Bot,
  Store,
  ShoppingBag,
  Plus
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'chat' | 'directory' | 'evidence'>('chat');
  const [showRubricModal, setShowRubricModal] = useState(false);
  const [showJudgeGuideModal, setShowJudgeGuideModal] = useState(false);
  const [showAiFeaturesModal, setShowAiFeaturesModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<string>('all');

  // Barter Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'cart-init-1',
      shopName: 'GreenPack KE',
      location: 'Industrial Area',
      type: 'offer',
      title: '200 food-grade corrugated cartons',
      estimatedValue: 18000,
    },
    {
      id: 'cart-init-2',
      shopName: 'Amina Wholesale Foods',
      location: 'Eastleigh',
      type: 'need',
      title: 'Quarterly financial bookkeeping & KRA VAT ledger',
      estimatedValue: 18000,
    },
  ]);

  // Initialize engine & state
  const engine = useMemo(() => new DeterministicGraphEngine(), []);
  const [smes, setSmes] = useState<SMEProfile[]>(SEEDED_SMES);
  const smesMap = useMemo(() => {
    const map = new Map<string, SMEProfile>();
    smes.forEach((s) => map.set(s.id, s));
    return map;
  }, [smes]);

  const [cycles, setCycles] = useState<ExchangeCycle[]>([]);

  // Filtered SMEs by area
  const filteredSmes = useMemo(() => {
    if (selectedAreaFilter === 'all') return smes;
    return smes.filter((s) => s.location.toLowerCase().includes(selectedAreaFilter.toLowerCase()));
  }, [smes, selectedAreaFilter]);

  // Load initial graph cycles
  useEffect(() => {
    engine.findCycles(4).then((res) => {
      setCycles(res.cycles);
    });
  }, [engine]);

  const handleCommitCycle = (cycleId: string) => {
    setCycles((prev) =>
      prev.map((c) =>
        c.id === cycleId ? { ...c, status: 'Active' as const } : c
      )
    );
  };

  const handleResetDemo = () => {
    engine.resetFixture();
    setSmes(SEEDED_SMES);
    engine.findCycles(4).then((res) => {
      setCycles(res.cycles);
    });
  };

  const handleOnboardingComplete = (
    newSme: SMEProfile,
    newCycles: ExchangeCycle[]
  ) => {
    setSmes((prev) => [...prev.filter((s) => s.id !== newSme.id), newSme]);
    if (newCycles.length > 0) {
      setCycles(newCycles);
    }
    setCurrentTab('chat');
  };

  const handleAddSmeToCart = (sme: SMEProfile) => {
    const newItem: CartItem = {
      id: `cart-${sme.id}-${Date.now()}`,
      shopName: sme.name,
      location: sme.location,
      type: 'offer',
      title: sme.offer_summary,
      estimatedValue: 18000,
    };
    setCartItems((prev) => [...prev, newItem]);
    setShowCartModal(true);
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCheckoutCart = () => {
    setCurrentTab('chat');
  };

  return (
    <div className="cw-shell min-h-screen text-[#17201b] flex flex-col md:flex-row antialiased font-sans">
      {/* Desktop Sidebar */}
      <Sidebar
        currentTab={currentTab === 'chat' ? 'request' : currentTab === 'directory' ? 'network' : 'profile'}
        onSelectTab={(tab) => {
          if (tab === 'network') setCurrentTab('directory');
          else if (tab === 'profile') setCurrentTab('evidence');
          else setCurrentTab('chat');
        }}
        onResetDemo={handleResetDemo}
        onOpenGuide={() => setShowJudgeGuideModal(true)}
        onStartOnboarding={() => setShowOnboardingModal(true)}
      />

      {/* Main Container */}
      <div className="cw-stage flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        {/* Streamlined Premium Top Navigation Bar */}
        <header className="bg-[#0B132B]/95 text-white px-4 sm:px-6 py-3.5 border-b border-[#1C2B4E] sticky top-0 z-30 shadow-md backdrop-blur-md">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-2xl bg-[#132247] border border-[#233A6B] p-1 flex items-center justify-center shadow-md">
                <CyclewiseLogo size={26} variant="gold" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-white block leading-none">Cyclewise</span>
                <span className="text-[10px] text-[#34D399] font-medium flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping"></span>
                  Nairobi Barter Clearing House
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCartModal(true)}
                className="relative flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#132247] hover:bg-[#1C3260] text-[#F59E0B] font-bold text-xs border border-[#233A6B] transition-all shadow-xs"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span className="hidden sm:inline">Barter Basket</span>
                {cartItems.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#EF4444] text-white font-black text-[10px] shadow-xs">
                    {cartItems.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setShowOnboardingModal(true)}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#E7B84B] to-[#D97706] hover:brightness-110 text-[#0B132B] font-extrabold text-xs transition-all shadow-md active:scale-95"
              >
                <Store className="w-3.5 h-3.5 text-[#0B132B]" />
                <span>Register Shop</span>
              </button>

              <button
                onClick={() => setShowJudgeGuideModal(true)}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#132247] hover:bg-[#1C3260] text-[#34D399] font-semibold text-xs border border-[#233A6B] transition-all"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Guide (5 Steps)</span>
              </button>

              <button
                onClick={() => setShowAiFeaturesModal(true)}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#132247] hover:bg-[#1C3260] text-[#34D399] font-semibold text-xs border border-[#233A6B] transition-all"
              >
                <Bot className="w-3.5 h-3.5 text-[#10B981]" />
                <span>AI Features</span>
              </button>
            </div>
          </div>
        </header>

        {/* Minimal Nav Tabs for Desktop / Tablet */}
        <div className="hidden md:block bg-white/90 backdrop-blur-md border-b border-[#E2DDD3] px-4 py-2.5 sticky top-[57px] z-20 shadow-xs">
          <div className="max-w-4xl mx-auto flex items-center space-x-2 text-xs font-semibold">
            {[
              { id: 'chat', label: 'Smart Assistant & Swap Matcher' },
              { id: 'directory', label: 'Nairobi Shop Directory' },
              { id: 'evidence', label: 'Verified Shop Records' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl transition-all ${
                  currentTab === tab.id
                    ? 'bg-[#0B132B] text-[#F59E0B] font-extrabold shadow-md ring-1 ring-[#F59E0B]/30'
                    : 'bg-[#F9F7F1] text-[#4B5563] hover:bg-[#EFEBE0] hover:text-[#111827]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <main className="max-w-5xl w-full mx-auto px-4 pt-5 sm:px-6 sm:pt-8 flex-1 pb-20 md:pb-8 space-y-8">
          {/* Beautiful Hero Landing Banner */}
          <HeroLandingBanner
            onStartMatching={() => setCurrentTab('chat')}
            onOpenOnboarding={() => setShowOnboardingModal(true)}
            onOpenGuide={() => setShowJudgeGuideModal(true)}
          />

          {/* TAB 1: Unified Smart Assistant & Swap Matcher (All-In-One Flow) */}
          {currentTab === 'chat' && (
            <UnifiedSmartChat
              smesMap={smesMap}
              initialCycles={cycles}
              onCommitCycle={handleCommitCycle}
              onOpenGuide={() => setShowJudgeGuideModal(true)}
              onOpenOnboarding={() => setShowOnboardingModal(true)}
            />
          )}

          {/* TAB 2: Clean Nairobi Shop Directory */}
          {currentTab === 'directory' && (
            <div className="bg-white rounded-2xl border border-[#E2DDD3] p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0ECE1]">
                <div>
                  <h3 className="text-lg font-extrabold text-[#0B132B]">Verified Nairobi Shops ({filteredSmes.length})</h3>
                  <p className="text-xs text-[#6B7280] mt-0.5">Explore active surplus stock and trade needs in Nairobi</p>
                </div>

                {/* Area Filter */}
                <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                  <span className="text-[#6B7280] text-[11px] font-bold mr-1 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5 text-[#0B132B]" /> Area:
                  </span>
                  {[
                    { id: 'all', label: 'All Nairobi' },
                    { id: 'eastleigh', label: 'Eastleigh' },
                    { id: 'industrial', label: 'Industrial' },
                    { id: 'westlands', label: 'Westlands' },
                  ].map((area) => (
                    <button
                      key={area.id}
                      onClick={() => setSelectedAreaFilter(area.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        selectedAreaFilter === area.id
                          ? 'bg-[#0B132B] text-[#F59E0B] font-bold shadow-xs'
                          : 'bg-[#F9F7F1] text-[#4B5563] hover:bg-[#EFEBE0]'
                      }`}
                    >
                      {area.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shop Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSmes.map((sme) => (
                  <div
                    key={sme.id}
                    className="p-4 sm:p-5 rounded-2xl border border-[#E2DDD3] bg-[#FDFBF7] hover:bg-white hover:border-[#0B132B]/40 hover:shadow-md transition-all space-y-3.5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-extrabold text-sm text-[#0B132B] block">{sme.name}</span>
                        <div className="flex items-center space-x-1 text-xs text-[#6B7280] mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
                          <span>{sme.location}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white border border-[#E2DDD3] text-[#0B132B]">
                        {sme.sector}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-xl bg-white border border-[#EAE6DB] shadow-2xs">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#059669] block mb-0.5">Has Extra Surplus:</span>
                        <p className="font-semibold text-[#111827]">{sme.offer_summary}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-[#EAE6DB] shadow-2xs">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D97706] block mb-0.5">Urgent Need:</span>
                        <p className="font-semibold text-[#111827]">{sme.need_summary}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <button
                        onClick={() => handleAddSmeToCart(sme)}
                        className="px-3 py-1.5 rounded-xl bg-[#F4F1E8] hover:bg-[#0B132B] hover:text-[#F59E0B] border border-[#E2DDD3] text-[#0B132B] font-extrabold text-[11px] transition-all flex items-center space-x-1.5"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#059669]" />
                        <span>Add To Basket</span>
                      </button>

                      <button
                        onClick={() => setCurrentTab('chat')}
                        className="text-[11px] font-extrabold text-[#0B132B] hover:text-[#F59E0B] flex items-center gap-1 transition-colors"
                      >
                        <span>Trade Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Verified Shop Records */}
          {currentTab === 'evidence' && (
            <div className="max-w-4xl mx-auto">
              <EvidencePanel smes={smes} />
            </div>
          )}
        </main>
      </div>

      {/* Sticky Mobile Bottom Navigation Bar (md:hidden) */}
      <MobileBottomNav
        currentTab={currentTab}
        onSelectTab={(t) => setCurrentTab(t)}
        onOpenOnboarding={() => setShowOnboardingModal(true)}
        onOpenCart={() => setShowCartModal(true)}
        cartCount={cartItems.length}
      />

      {/* Modals */}
      <HackathonRubricModal
        isOpen={showRubricModal}
        onClose={() => setShowRubricModal(false)}
      />

      <JudgeFlowGuideModal
        isOpen={showJudgeGuideModal}
        onClose={() => setShowJudgeGuideModal(false)}
        onJumpToTab={() => setCurrentTab('chat')}
        onOpenOnboarding={() => setShowOnboardingModal(true)}
        onOpenAgentCommand={() => setCurrentTab('chat')}
      />

      <AiFeaturesMatrixModal
        isOpen={showAiFeaturesModal}
        onClose={() => setShowAiFeaturesModal(false)}
        onOpenCommandCenter={() => setCurrentTab('chat')}
        onOpenQna={() => setCurrentTab('chat')}
      />

      <SmeOnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
        engine={engine}
        onComplete={handleOnboardingComplete}
      />

      <BarterCartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onCheckoutCart={handleCheckoutCart}
      />
    </div>
  );
}

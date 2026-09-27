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
    <div className="min-h-screen bg-[#F7F5EF] text-[#17202A] flex flex-col md:flex-row antialiased">
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
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        {/* Streamlined Top Navigation Bar */}
        <header className="bg-[#121B2B] text-white px-4 py-3 border-b border-[#202E44] sticky top-0 z-30 shadow-xs">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E7B84B] to-[#C9972E] p-0.5 flex items-center justify-center text-[#121B2B]">
                <Sparkles className="w-4 h-4 text-[#121B2B]" />
              </div>
              <div>
                <span className="font-bold text-sm text-white block leading-tight">Cyclewise</span>
                <span className="text-[10px] text-[#85E2BD] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2E8B68] animate-pulse"></span>
                  Nairobi Barter Clearing House
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCartModal(true)}
                className="relative flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#1C2B42] hover:bg-[#283C5A] text-[#E7B84B] font-bold text-xs border border-[#2E4363] transition-all"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#E7B84B]" />
                <span className="hidden sm:inline">Barter Basket</span>
                {cartItems.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#DC2626] text-white font-bold text-[10px]">
                    {cartItems.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setShowOnboardingModal(true)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-[#E7B84B] hover:bg-[#D4A538] text-[#121B2B] font-bold text-xs transition-all shadow-xs"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Register Shop</span>
              </button>

              <button
                onClick={() => setShowJudgeGuideModal(true)}
                className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-[#1C2B42] hover:bg-[#283C5A] text-[#85E2BD] font-semibold text-xs border border-[#2E4363]"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#2E8B68]" />
                <span>Guide (5 Steps)</span>
              </button>

              <button
                onClick={() => setShowAiFeaturesModal(true)}
                className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-[#1C2B42] hover:bg-[#283C5A] text-[#85E2BD] font-semibold text-xs border border-[#2E4363]"
              >
                <Bot className="w-3.5 h-3.5 text-[#2E8B68]" />
                <span>AI Features</span>
              </button>
            </div>
          </div>
        </header>

        {/* Minimal Nav Tabs for Desktop / Tablet */}
        <div className="hidden md:block bg-white border-b border-[#E3E0D7] px-4 py-2 sticky top-[53px] z-20 shadow-2xs">
          <div className="max-w-4xl mx-auto flex items-center space-x-2 text-xs font-semibold">
            {[
              { id: 'chat', label: 'Smart Assistant & Matcher' },
              { id: 'directory', label: 'Nairobi Shop Directory' },
              { id: 'evidence', label: 'Verified Shop Records' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl transition-all ${
                  currentTab === tab.id
                    ? 'bg-[#121B2B] text-[#E7B84B] font-bold shadow-xs'
                    : 'bg-[#FAF9F5] text-[#68727D] hover:bg-[#EFECE4] hover:text-[#18243A]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <main className="max-w-4xl w-full mx-auto px-4 pt-4 sm:pt-5 flex-1 pb-20 md:pb-6">
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
            <div className="bg-white rounded-2xl border border-[#E3E0D7] p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EFECE4]">
                <div>
                  <h3 className="text-base font-bold text-[#18243A]">Verified Nairobi Shops ({filteredSmes.length})</h3>
                  <p className="text-xs text-[#68727D] mt-0.5">Explore active surplus stock and trade needs in Nairobi</p>
                </div>

                {/* Area Filter */}
                <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                  <span className="text-[#68727D] text-[11px] font-semibold mr-1 flex items-center gap-1">
                    <Filter className="w-3 h-3" /> Area:
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
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        selectedAreaFilter === area.id
                          ? 'bg-[#121B2B] text-[#E7B84B] font-bold shadow-xs'
                          : 'bg-[#FAF9F5] text-[#68727D] hover:bg-[#EFECE4]'
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
                    className="p-4 rounded-xl border border-[#E3E0D7] bg-[#FAF9F5] hover:bg-white transition-all space-y-3 shadow-2xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-bold text-sm text-[#18243A]">{sme.name}</span>
                        <div className="flex items-center space-x-1 text-xs text-[#68727D] mt-0.5">
                          <MapPin className="w-3 h-3 text-[#E7B84B]" />
                          <span>{sme.location}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-[#E3E0D7] text-[#18243A]">
                        {sme.sector}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="p-2.5 rounded-lg bg-white border border-[#EAE6DB]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E8B68] block">Has Extra:</span>
                        <p className="font-medium text-[#18243A]">{sme.offer_summary}</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-[#EAE6DB]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#D8783D] block">Needs:</span>
                        <p className="font-medium text-[#18243A]">{sme.need_summary}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <button
                        onClick={() => handleAddSmeToCart(sme)}
                        className="px-2.5 py-1 rounded-lg bg-[#FAF9F5] hover:bg-[#121B2B] hover:text-[#E7B84B] border border-[#E3E0D7] text-[#18243A] font-bold text-[11px] transition-all flex items-center space-x-1"
                      >
                        <Plus className="w-3 h-3 text-[#2E8B68]" />
                        <span>Add To Basket</span>
                      </button>

                      <button
                        onClick={() => setCurrentTab('chat')}
                        className="text-[11px] font-bold text-[#18243A] hover:text-[#E7B84B] flex items-center gap-1"
                      >
                        <span>Trade Now</span>
                        <ArrowRight className="w-3 h-3" />
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

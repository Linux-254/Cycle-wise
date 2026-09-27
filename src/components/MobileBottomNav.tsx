import React from 'react';
import {
  Sparkles,
  Store,
  ShieldCheck,
  PlusCircle,
  ShoppingBag
} from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: 'chat' | 'directory' | 'evidence';
  onSelectTab: (tab: 'chat' | 'directory' | 'evidence') => void;
  onOpenOnboarding: () => void;
  onOpenCart: () => void;
  cartCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenOnboarding,
  onOpenCart,
  cartCount,
}) => {
  return (
    <div className="cw-mobile-nav md:hidden fixed bottom-0 left-0 right-0 bg-[#121B2B] text-white border-t border-[#202E44] z-40 px-2 py-1.5 shadow-2xl backdrop-blur-md bg-opacity-95">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Tab 1: Trade Matcher */}
        <button
          onClick={() => onSelectTab('chat')}
          className={`flex flex-col items-center justify-center min-w-[60px] py-1 px-2 rounded-xl transition-all ${
            currentTab === 'chat'
              ? 'bg-[#E7B84B] text-[#121B2B] font-bold shadow-xs'
              : 'text-[#A0AEC0] hover:text-white'
          }`}
        >
          <Sparkles className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Matcher</span>
        </button>

        {/* Tab 2: Directory */}
        <button
          onClick={() => onSelectTab('directory')}
          className={`flex flex-col items-center justify-center min-w-[60px] py-1 px-2 rounded-xl transition-all ${
            currentTab === 'directory'
              ? 'bg-[#E7B84B] text-[#121B2B] font-bold shadow-xs'
              : 'text-[#A0AEC0] hover:text-white'
          }`}
        >
          <Store className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Shops</span>
        </button>

        {/* Center Primary Action: Register Shop */}
        <button
          onClick={onOpenOnboarding}
          className="flex flex-col items-center justify-center min-w-[64px] py-1 px-2 rounded-xl bg-gradient-to-r from-[#2E8B68] to-[#257356] text-white font-bold shadow-md hover:scale-105 transition-transform border border-[#85E2BD]/30"
        >
          <PlusCircle className="w-5 h-5 mb-0.5 text-[#85E2BD]" />
          <span className="text-[10px] tracking-tight">Register</span>
        </button>

        {/* Cart */}
        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center min-w-[60px] py-1 px-2 rounded-xl text-[#A0AEC0] hover:text-white transition-all"
        >
          <ShoppingBag className="w-5 h-5 mb-0.5 text-[#E7B84B]" />
          <span className="text-[10px] tracking-tight">Cart</span>
          {cartCount > 0 && (
            <span className="absolute top-0 right-3 bg-[#DC2626] text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>

        {/* Tab 3: Verified Records */}
        <button
          onClick={() => onSelectTab('evidence')}
          className={`flex flex-col items-center justify-center min-w-[60px] py-1 px-2 rounded-xl transition-all ${
            currentTab === 'evidence'
              ? 'bg-[#E7B84B] text-[#121B2B] font-bold shadow-xs'
              : 'text-[#A0AEC0] hover:text-white'
          }`}
        >
          <ShieldCheck className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Records</span>
        </button>
      </div>
    </div>
  );
};

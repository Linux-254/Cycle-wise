import React from 'react';
import { ClipboardCheck, GitMerge, LayoutDashboard, PlusCircle, ShoppingBag, Sparkles } from 'lucide-react';

type JourneyTab = 'overview' | 'request' | 'network' | 'review' | 'evidence';

interface MobileBottomNavProps {
  currentTab: JourneyTab;
  onSelectTab: (tab: JourneyTab) => void;
  onOpenOnboarding: () => void;
  onOpenCart: () => void;
  cartCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentTab, onSelectTab, onOpenOnboarding, onOpenCart, cartCount }) => (
  <div className="cw-mobile-nav md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[#202E44] bg-[#0d1511]/96 px-2 py-2 text-white shadow-2xl backdrop-blur-md">
    <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
      <button onClick={() => onSelectTab('overview')} className={`flex flex-col items-center justify-center rounded-2xl px-1 py-1.5 text-[10px] transition ${currentTab === 'overview' ? 'bg-[#d8a84e] font-extrabold text-[#0d1511]' : 'text-[#aab5ad]'}`}><LayoutDashboard className="mb-0.5 h-4 w-4" /><span>Home</span></button>
      <button onClick={() => onSelectTab('request')} className={`flex flex-col items-center justify-center rounded-2xl px-1 py-1.5 text-[10px] transition ${currentTab === 'request' ? 'bg-[#d8a84e] font-extrabold text-[#0d1511]' : 'text-[#aab5ad]'}`}><Sparkles className="mb-0.5 h-4 w-4" /><span>Request</span></button>
      <button onClick={onOpenOnboarding} className="flex flex-col items-center justify-center rounded-2xl bg-[#79c6a0] px-1 py-1.5 text-[10px] font-extrabold text-[#0d1511]"><PlusCircle className="mb-0.5 h-4 w-4" /><span>Add shop</span></button>
      <button onClick={() => onSelectTab('review')} className={`flex flex-col items-center justify-center rounded-2xl px-1 py-1.5 text-[10px] transition ${currentTab === 'review' ? 'bg-[#d8a84e] font-extrabold text-[#0d1511]' : 'text-[#aab5ad]'}`}><GitMerge className="mb-0.5 h-4 w-4" /><span>Review</span></button>
      <button onClick={onOpenCart} className="relative flex flex-col items-center justify-center rounded-2xl px-1 py-1.5 text-[10px] text-[#aab5ad] transition"><ShoppingBag className="mb-0.5 h-4 w-4 text-[#d8a84e]" /><span>Basket</span>{cartCount > 0 && <span className="absolute right-2 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#ef806c] text-[9px] font-black text-white">{cartCount}</span>}</button>
    </div>
  </div>
);

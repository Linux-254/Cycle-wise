import React from 'react';
import { Store } from 'lucide-react';

interface MobileHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  networkSmeCount: number;
  onStartOnboarding?: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ networkSmeCount, onStartOnboarding }) => {
  return (
    <header className="sticky top-0 z-30 bg-[#121B2B] text-white px-4 py-3 border-b border-[#202E44] shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E7B84B] to-[#C9972E] flex items-center justify-center text-[#121B2B] font-bold text-base shadow-xs shrink-0">
            <svg className="w-4 h-4 text-[#121B2B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M21 21v-5h-5" />
            </svg>
          </div>
          <div>
            <span className="font-bold tracking-tight text-white text-base">Cyclewise</span>
            <p className="text-[10px] text-[#8E9CAE]">Nairobi SME Barter Network</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onStartOnboarding && (
            <button
              onClick={onStartOnboarding}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#E7B84B] text-[#121B2B] font-bold text-xs hover:bg-[#d8a839] transition-all shadow-xs"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Onboard</span>
            </button>
          )}

          <div className="flex items-center space-x-1.5 bg-[#1C2B42] text-[#E7B84B] text-xs px-2.5 py-1.5 rounded-lg border border-[#2E4363]">
            <span className="w-2 h-2 rounded-full bg-[#2E8B68] animate-pulse"></span>
            <span className="font-medium text-[11px]">{networkSmeCount} SMEs Active</span>
          </div>
        </div>
      </div>
    </header>
  );
};

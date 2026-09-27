import React from 'react';
import { Home, PlusCircle, GitMerge, Clock, UserCheck, RefreshCw, Store, HelpCircle, Sparkles } from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onResetDemo: () => void;
  onStartOnboarding?: () => void;
  onOpenGuide?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onResetDemo,
  onOpenGuide,
}) => {
  const primaryLinks = [
    { id: 'request', label: 'Smart Assistant & Matcher', icon: Sparkles, isPrimary: true },
    { id: 'network', label: 'Nairobi Shop Directory', icon: Home, badge: 'Live' },
    { id: 'profile', label: 'Verified Shop Records', icon: UserCheck },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#121B2B] text-white shrink-0 border-r border-[#202E44] min-h-screen select-none">
      {/* Brand Header */}
      <div className="p-4 sm:p-5 border-b border-[#202E44]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E7B84B] to-[#C9972E] p-0.5 shadow-md flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-[#121B2B] rounded-[10px] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#E7B84B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M21 21v-5h-5" />
              </svg>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h1 className="font-bold text-base tracking-tight text-white leading-tight">Cyclewise</h1>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-[#2E8B68]/20 text-[#85E2BD] border border-[#2E8B68]/40">
                Live
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-3.5 space-y-2 flex-1 overflow-y-auto">
        {onOpenGuide && (
          <button
            onClick={onOpenGuide}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#162234] hover:bg-[#1E2E46] text-[#85E2BD] border border-[#233852] transition-all mb-2 text-left focus-visible:outline-hidden"
          >
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-[#2E8B68]" />
              <span>How It Works (Guide)</span>
            </div>
            <span className="text-[9px] text-[#8E9CAE]">5 Steps</span>
          </button>
        )}

        <div className="px-2 pt-2 text-[10px] font-bold uppercase tracking-wider text-[#687B95]">
          Navigation
        </div>

        <div className="space-y-1.5">
          {primaryLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentTab === link.id;

            if (link.isPrimary) {
              return (
                <button
                  key={link.id}
                  onClick={() => onSelectTab(link.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left focus-visible:outline-hidden shadow-xs ${
                    isActive
                      ? 'bg-[#E7B84B] text-[#121B2B] shadow-md'
                      : 'bg-[#E7B84B]/90 text-[#121B2B] hover:bg-[#E7B84B]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4 stroke-[2.5]" />
                    <span>{link.label}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-[#121B2B]/10 text-[#121B2B]">
                    Core
                  </span>
                </button>
              );
            }

            return (
              <button
                key={link.id}
                onClick={() => onSelectTab(link.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left focus-visible:outline-hidden ${
                  isActive
                    ? 'bg-[#1F2F47] text-white font-semibold border border-[#2E4363] shadow-xs'
                    : 'text-[#A0AEC0] hover:bg-[#18253A] hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#E7B84B]' : 'text-[#8E9CAE]'}`} />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md font-mono bg-[#18253A] text-[#8E9CAE]">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer Reset */}
      <div className="p-3.5 border-t border-[#202E44] bg-[#0E1522]">
        <button
          onClick={onResetDemo}
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-[#1C2B42] hover:bg-[#263A58] text-xs font-medium text-slate-300 hover:text-white transition-all border border-[#2A3F60]"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#E7B84B]" />
          <span>Reset Sample Data</span>
        </button>
      </div>
    </aside>
  );
};

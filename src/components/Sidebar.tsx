import React from 'react';
import { Home, PlusCircle, GitMerge, Clock, UserCheck, RefreshCw, Store, HelpCircle, Sparkles } from 'lucide-react';
import { CyclewiseLogo } from './CyclewiseLogo';

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
    <aside className="hidden md:flex flex-col w-64 bg-[#0B132B] text-white shrink-0 border-r border-[#1C2B4E] min-h-screen select-none shadow-xl">
      {/* Brand Header */}
      <div className="p-4 sm:p-5 border-b border-[#1C2B4E]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#132247] border border-[#233A6B] p-1.5 shadow-md flex items-center justify-center shrink-0">
            <CyclewiseLogo size={28} variant="gold" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h1 className="font-extrabold text-base tracking-tight text-white leading-tight">Cyclewise</h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30">
                Live
              </span>
            </div>
            <span className="text-[10px] text-[#9CA3AF] block font-medium">SME Barter House</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-3.5 space-y-2 flex-1 overflow-y-auto">
        {onOpenGuide && (
          <button
            onClick={onOpenGuide}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold bg-[#132247] hover:bg-[#1C3260] text-[#34D399] border border-[#233A6B] transition-all mb-2 text-left shadow-xs"
          >
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-[#10B981]" />
              <span>How It Works (Guide)</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#0B132B] text-[#9CA3AF]">5 Steps</span>
          </button>
        )}

        <div className="px-2 pt-2 text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280]">
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
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all text-left shadow-md ${
                    isActive
                      ? 'bg-gradient-to-r from-[#F59E0B] via-[#E7B84B] to-[#D97706] text-[#0B132B]'
                      : 'bg-[#F59E0B]/90 text-[#0B132B] hover:bg-[#F59E0B]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4 stroke-[2.5]" />
                    <span>{link.label}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-extrabold bg-[#0B132B]/15 text-[#0B132B]">
                    Core
                  </span>
                </button>
              );
            }

            return (
              <button
                key={link.id}
                onClick={() => onSelectTab(link.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left ${
                  isActive
                    ? 'bg-[#132247] text-[#F59E0B] border border-[#233A6B]'
                    : 'text-[#9CA3AF] hover:bg-[#132247]/50 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-[#10B981]/20 text-[#34D399]">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer controls */}
      <div className="p-3.5 border-t border-[#1C2B4E] space-y-2 text-xs">
        <button
          onClick={onResetDemo}
          className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 rounded-2xl text-[#9CA3AF] hover:text-white hover:bg-[#132247] transition-all font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Demo Network</span>
        </button>
      </div>
    </aside>
  );
};

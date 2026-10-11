import React from 'react';
import { Sliders, Scale, DollarSign, CheckSquare, History } from 'lucide-react';

export type TabType = 'config' | 'quantities' | 'costs' | 'shopping' | 'history';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  shoppingPendingCount: number;
  unpricedCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  shoppingPendingCount,
  unpricedCount,
}) => {
  const tabs = [
    {
      id: 'config' as TabType,
      label: 'Configurar',
      icon: Sliders,
    },
    {
      id: 'quantities' as TabType,
      label: 'Quantidades',
      icon: Scale,
    },
    {
      id: 'costs' as TabType,
      label: 'Custos',
      icon: DollarSign,
      badge: unpricedCount > 0 ? `${unpricedCount}` : undefined,
      badgeColor: 'bg-amber-500/80 text-black',
    },
    {
      id: 'shopping' as TabType,
      label: 'Compras',
      icon: CheckSquare,
      badge: shoppingPendingCount > 0 ? `${shoppingPendingCount}` : undefined,
      badgeColor: 'bg-orange-500 text-white',
    },
    {
      id: 'history' as TabType,
      label: 'Histórico',
      icon: History,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#16161A]/95 backdrop-blur-lg border-t border-zinc-800/90 pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center min-h-[48px] py-1 px-2.5 rounded-xl transition-all duration-200 select-none ${
                isActive
                  ? 'text-orange-400 font-bold scale-105'
                  : 'text-zinc-400 hover:text-zinc-200 active:scale-95'
              }`}
            >
              {/* Active pill background pill indicator - Android M3 style */}
              {isActive && (
                <span className="absolute inset-x-1 inset-y-0.5 bg-orange-500/15 rounded-xl border border-orange-500/30 -z-10 animate-fade-in" />
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 text-orange-500' : 'text-zinc-400'
                  }`}
                />
                {tab.badge && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center ${tab.badgeColor}`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className="text-[11px] mt-1 tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

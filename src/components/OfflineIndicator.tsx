import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 bg-zinc-900/95 border border-orange-500/40 text-zinc-200 text-xs px-3.5 py-1.5 rounded-full shadow-xl backdrop-blur-md flex items-center gap-2 animate-fade-in">
      <WifiOff className="w-3.5 h-3.5 text-orange-400" />
      <span>Modo Offline Ativo — Calculadora e dados 100% preservados</span>
    </div>
  );
};

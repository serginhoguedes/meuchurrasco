import React from 'react';
import { Flame, ShieldCheck, Share2, Smartphone, Monitor, CheckCircle, Code, Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
  onOpenStoryModal: () => void;
  onOpenTestsModal: () => void;
  onOpenAndroidCodeModal: () => void;
  onOpenInstallModal: () => void;
  isMobileFrame: boolean;
  onToggleFrame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenStoryModal,
  onOpenTestsModal,
  onOpenAndroidCodeModal,
  onOpenInstallModal,
  isMobileFrame,
  onToggleFrame,
}) => {
  const { isInstalled } = usePWAInstall();

  return (
    <header className="sticky top-0 z-30 bg-[#121214]/95 backdrop-blur-md border-b border-zinc-800/80 px-3 sm:px-4 py-2.5 sm:py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="font-extrabold text-sm sm:text-base md:text-lg tracking-tight text-white truncate">
                Churrasco Calculado
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full shrink-0">
                <ShieldCheck className="w-3 h-3" />
                100% Offline
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-zinc-400 truncate">
              Calculadora de carnes, bebidas e custos
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* In-App Install Button (Prominent) */}
          {!isInstalled && (
            <button
              onClick={onOpenInstallModal}
              className="flex items-center gap-1.5 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 text-white text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-xl shadow-md shadow-orange-600/30 transition active:scale-95 border border-orange-400/40"
              title="Instalar aplicativo no Android ou iPhone"
            >
              <Download className="w-3.5 h-3.5 text-white animate-bounce" />
              <span className="text-[11px] sm:text-xs">Instalar App</span>
            </button>
          )}

          {/* Stories Generator */}
          <button
            onClick={onOpenStoryModal}
            className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-xl border border-zinc-700/60 transition active:scale-95"
            title="Gerar Stories para Instagram"
          >
            <Share2 className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">Stories</span>
          </button>

          {/* Unit tests trigger */}
          <button
            onClick={onOpenTestsModal}
            className="hidden md:flex items-center gap-1 bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 text-xs font-medium px-2 sm:px-2.5 py-1.5 rounded-xl border border-zinc-700/60 transition active:scale-95"
            title="Verificar Testes Unitários de Regras de Negócio"
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Testes</span>
          </button>

          {/* Android Kotlin Code */}
          <button
            onClick={onOpenAndroidCodeModal}
            className="flex items-center gap-1 bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 text-xs font-medium px-2 sm:px-2.5 py-1.5 rounded-xl border border-zinc-700/60 transition active:scale-95"
            title="Código Fonte Android (Kotlin Jetpack Compose)"
          >
            <Code className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">APK</span>
          </button>

          {/* Mobile Shell Toggle */}
          <button
            onClick={onToggleFrame}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/60 transition"
            title={isMobileFrame ? 'Mudar para modo tela cheia' : 'Simular formato celular Android'}
          >
            {isMobileFrame ? (
              <Monitor className="w-4 h-4 text-zinc-400" />
            ) : (
              <Smartphone className="w-4 h-4 text-orange-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

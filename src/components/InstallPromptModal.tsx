import React, { useState } from 'react';
import {
  X,
  Download,
  Smartphone,
  Share,
  PlusSquare,
  CheckCircle2,
  Sparkles,
  WifiOff,
  Flame,
  ChevronRight,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallPromptModal: React.FC<InstallPromptModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [platformTab, setPlatformTab] = useState<'auto' | 'android' | 'ios'>(
    isIOS ? 'ios' : isAndroid ? 'android' : 'auto'
  );
  const [installedSuccess, setInstalledSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setInstalledSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    }
  };

  const activePlatform = platformTab === 'auto' ? (isIOS ? 'ios' : 'android') : platformTab;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#18181C] border border-zinc-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-fade-in my-auto">
        {/* Header do Modal com Ícone Bonito */}
        <div className="relative p-5 pb-4 border-b border-zinc-800/80 bg-gradient-to-b from-[#24130E] to-[#18181C]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3.5">
            <img
              src="/pwa-192x192.png"
              alt="Ícone Churrasco Calculado"
              className="w-16 h-16 rounded-2xl shadow-xl shadow-orange-600/30 border border-orange-500/40 object-cover"
            />
            <div>
              <div className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-400 bg-orange-500/15 border border-orange-500/30 px-2 py-0.5 rounded-full mb-1">
                <Flame className="w-3 h-3 text-orange-500" />
                Aplicativo Instalável
              </div>
              <h2 className="text-base font-extrabold text-white">
                Churrasco Calculado
              </h2>
              <p className="text-xs text-zinc-400">
                Instale no seu celular Android ou iPhone
              </p>
            </div>
          </div>
        </div>

        {/* Vantagens */}
        <div className="p-4 bg-[#141418] border-b border-zinc-800/60 grid grid-cols-2 gap-2 text-xs">
          <div className="bg-[#18181C] p-2.5 rounded-xl border border-zinc-800/70 flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[11px] text-zinc-300">100% Offline (sem sinal)</span>
          </div>
          <div className="bg-[#18181C] p-2.5 rounded-xl border border-zinc-800/70 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-orange-400 shrink-0" />
            <span className="text-[11px] text-zinc-300">Ícone nativo na tela</span>
          </div>
        </div>

        {/* Seletor de Sistema */}
        <div className="p-4 space-y-4">
          <div className="flex bg-[#121214] p-1 rounded-2xl border border-zinc-800">
            <button
              onClick={() => setPlatformTab('android')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
                activePlatform === 'android'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>Android</span>
            </button>
            <button
              onClick={() => setPlatformTab('ios')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
                activePlatform === 'ios'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>iPhone (iOS)</span>
            </button>
          </div>

          {/* Conteúdo Android */}
          {activePlatform === 'android' && (
            <div className="space-y-3">
              {installedSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-700 text-center animate-fade-in">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-white">Aplicativo Instalado com Sucesso!</p>
                  <p className="text-xs text-emerald-300 mt-1">
                    O ícone já foi adicionado à tela inicial do seu celular.
                  </p>
                </div>
              ) : isInstallable ? (
                <div className="space-y-3">
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Seu navegador suporta instalação direta em 1 toque:
                  </p>
                  <button
                    onClick={handleInstallClick}
                    className="w-full bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 hover:from-orange-500 text-white font-extrabold text-sm py-3.5 px-4 rounded-2xl shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer glow-ember"
                  >
                    <Download className="w-4 h-4" />
                    <span>INSTALAR NO ANDROID AGORA</span>
                  </button>
                </div>
              ) : (
                <div className="bg-[#121214] p-3.5 rounded-2xl border border-zinc-800 space-y-2.5 text-xs">
                  <p className="text-zinc-300 font-semibold">
                    Instalação pelo Google Chrome ou Samsung Internet:
                  </p>
                  <div className="space-y-2 text-zinc-400 text-[11px]">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 font-bold flex items-center justify-center shrink-0">1</span>
                      <p>Toque no menu de <strong className="text-white">três pontinhos (⋮)</strong> no canto superior direito do navegador.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 font-bold flex items-center justify-center shrink-0">2</span>
                      <p>Selecione a opção <strong className="text-white">&ldquo;Instalar aplicativo&rdquo;</strong> ou <strong className="text-white">&ldquo;Adicionar à tela inicial&rdquo;</strong>.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 font-bold flex items-center justify-center shrink-0">3</span>
                      <p>Confirme clicando em <strong className="text-white">&ldquo;Instalar&rdquo;</strong>. Pronto! Ele abrirá em tela cheia.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Conteúdo iPhone (iOS) */}
          {activePlatform === 'ios' && (
            <div className="bg-[#121214] p-4 rounded-2xl border border-zinc-800 space-y-3 text-xs">
              <p className="text-zinc-200 font-bold flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-orange-400" />
                Como instalar no iPhone (Safari):
              </p>

              <div className="space-y-2.5 text-zinc-300 text-[11px] leading-relaxed">
                <div className="flex items-start gap-2.5 bg-[#18181C] p-2.5 rounded-xl border border-zinc-800">
                  <div className="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center shrink-0">
                    <Share className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">1. Toque no botão Compartilhar</p>
                    <p className="text-zinc-400 text-[10px]">Ícone do quadrado com a seta para cima, na barra inferior do Safari.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-[#18181C] p-2.5 rounded-xl border border-zinc-800">
                  <div className="w-6 h-6 rounded-lg bg-orange-600/20 text-orange-400 font-bold flex items-center justify-center shrink-0">
                    <PlusSquare className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">2. Selecione &ldquo;Adicionar à Tela de Início&rdquo;</p>
                    <p className="text-zinc-400 text-[10px]">Role as opções para baixo até encontrar o ícone com símbolo (+).</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-[#18181C] p-2.5 rounded-xl border border-zinc-800">
                  <div className="w-6 h-6 rounded-lg bg-emerald-600/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">3. Toque em &ldquo;Adicionar&rdquo;</p>
                    <p className="text-zinc-400 text-[10px]">No canto superior direito. O ícone com brasa de churrasco aparecerá na sua tela!</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="p-3.5 bg-[#141418] border-t border-zinc-800/80 flex items-center justify-between">
          <span className="text-[10px] text-zinc-500">
            {isInstalled ? '✅ Aplicativo já instalado' : 'Tamanho: menos de 1 MB • Sem login'}
          </span>
          <button
            onClick={onClose}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold px-4 py-2 rounded-xl transition"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
};

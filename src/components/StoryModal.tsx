import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  Download,
  Share2,
  Instagram,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { ChurrascoConfig, CalculationResult, CostSummary } from '../types';
import { renderInstagramStory } from '../utils/storyGenerator';

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ChurrascoConfig;
  calculation: CalculationResult;
  costs: CostSummary;
}

export const StoryModal: React.FC<StoryModalProps> = ({
  isOpen,
  onClose,
  config,
  calculation,
  costs,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      renderInstagramStory(canvasRef.current, config, calculation, costs);
    }
  }, [isOpen, config, calculation, costs]);

  if (!isOpen) return null;

  const handleDownloadImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `churrasco-stories-${(config.eventName || 'evento').toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleShareStory = async () => {
    if (!canvasRef.current) return;
    setIsSharing(true);

    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) {
          handleDownloadImage();
          setIsSharing(false);
          return;
        }

        const file = new File([blob], 'churrasco-stories.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: `Churrasco: ${config.eventName}`,
              text: 'Resumo do nosso churrasco planejado no app Churrasco Calculado! 🔥🥩',
              files: [file],
            });
          } catch (e) {
            // User cancelled share
          }
        } else {
          // Fallback to downloading
          handleDownloadImage();
        }
        setIsSharing(false);
      }, 'image/png');
    } catch (e) {
      handleDownloadImage();
      setIsSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#18181C] border border-zinc-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-fade-in my-auto">
        {/* Header do Modal */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <Instagram className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">
                Stories do Instagram (9:16)
              </h3>
              <p className="text-[10px] text-zinc-400">Resumo visual de alta resolução (1080x1920)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pré-visualização do Canvas em formato 9:16 */}
        <div className="p-4 bg-[#121214] flex flex-col items-center justify-center">
          <div className="relative w-[240px] h-[426px] rounded-2xl overflow-hidden shadow-2xl border border-zinc-700">
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain"
            />
          </div>

          {downloadSuccess && (
            <div className="mt-3 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-1.5 animate-fade-in">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              Imagem salva no seu dispositivo!
            </div>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="p-4 bg-[#18181C] border-t border-zinc-800 space-y-2">
          <button
            onClick={handleShareStory}
            disabled={isSharing}
            className="w-full bg-gradient-to-r from-pink-600 via-rose-600 to-orange-600 hover:from-pink-500 hover:to-orange-500 active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition"
          >
            <Share2 className="w-4 h-4" />
            <span>Compartilhar nos Stories ou WhatsApp</span>
          </button>

          <button
            onClick={handleDownloadImage}
            className="w-full bg-zinc-800 hover:bg-zinc-700 active:scale-[0.99] text-zinc-200 font-bold text-xs sm:text-sm py-3 px-4 rounded-xl border border-zinc-700 flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4 text-orange-400" />
            <span>Baixar Imagem PNG em Alta Resolução</span>
          </button>
        </div>
      </div>
    </div>
  );
};

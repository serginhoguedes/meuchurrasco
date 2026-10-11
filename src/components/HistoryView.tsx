import React, { useState } from 'react';
import {
  History,
  BookmarkPlus,
  Trash2,
  Copy,
  ExternalLink,
  Calendar,
  Users,
  Beef,
  DollarSign,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { SavedEvent } from '../types';
import { formatCurrencyBRL } from '../utils/calculator';

interface HistoryViewProps {
  savedEvents: SavedEvent[];
  onOpenEvent: (event: SavedEvent) => void;
  onDuplicateEvent: (id: string) => void;
  onDeleteEvent: (id: string) => void;
  onSaveCurrentEvent: (name: string) => void;
  currentEventName: string;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  savedEvents,
  onOpenEvent,
  onDuplicateEvent,
  onDeleteEvent,
  onSaveCurrentEvent,
  currentEventName,
}) => {
  const [saveName, setSaveName] = useState(currentEventName || 'Meu Churrasco');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveName.trim()) return;
    onSaveCurrentEvent(saveName.trim());
    setShowSaveDialog(false);
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Banner de Histórico Local */}
      <div className="relative overflow-hidden rounded-3xl bg-[#18181C] p-5 border border-zinc-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
              Armazenamento Local 100% Offline
            </span>
          </div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <History className="w-5 h-5 text-orange-500" />
            Histórico de Churrascos Salvos
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Seus eventos ficam guardados com segurança na memória do próprio aparelho.
          </p>
        </div>

        <button
          onClick={() => setShowSaveDialog(true)}
          className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-orange-600/25 transition active:scale-95 shrink-0"
        >
          <BookmarkPlus className="w-4 h-4" />
          <span>Salvar Churrasco Atual</span>
        </button>
      </div>

      {/* Lista de Registros */}
      {savedEvents.length === 0 ? (
        <div className="bg-[#18181C] rounded-3xl p-8 border border-zinc-800/80 text-center">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 flex items-center justify-center mx-auto mb-3 text-zinc-500">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">Nenhum churrasco salvo ainda</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-4">
            Após configurar e calcular seu evento, clique em &ldquo;Salvar Churrasco Atual&rdquo; para guardá-lo e consultá-lo sempre que quiser.
          </p>
          <button
            onClick={() => setShowSaveDialog(true)}
            className="inline-flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold px-4 py-2 rounded-xl transition"
          >
            <BookmarkPlus className="w-4 h-4 text-orange-400" />
            Salvar agora
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {savedEvents.map((event) => {
            const totalPeople = (event.config.adults || 0) + (event.config.children || 0);

            return (
              <div
                key={event.id}
                className="bg-[#18181C] p-4 sm:p-5 rounded-3xl border border-zinc-800/80 hover:border-zinc-700 transition shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                      {event.name}
                    </h3>
                    <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        {formatDate(event.date)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        {event.config.durationHours}h
                      </span>
                      <span>•</span>
                      <span className="capitalize text-orange-400 font-semibold">
                        Perfil {event.config.profile}
                      </span>
                    </div>
                  </div>

                  {/* Badges de Métricas */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="bg-zinc-800/80 text-zinc-200 text-xs font-bold px-2.5 py-1 rounded-xl flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-orange-400" />
                      {totalPeople} pess.
                    </span>
                    <span className="bg-zinc-800/80 text-zinc-200 text-xs font-bold px-2.5 py-1 rounded-xl flex items-center gap-1">
                      <Beef className="w-3.5 h-3.5 text-red-400" />
                      {event.totalMeatKg} kg
                    </span>
                    <span className="bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 text-xs font-black px-2.5 py-1 rounded-xl">
                      {event.totalCostCalculated > 0
                        ? formatCurrencyBRL(event.totalCostCalculated)
                        : 'S/ preço'}
                    </span>
                  </div>
                </div>

                {/* Ações do Card */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800/60">
                  <button
                    onClick={() => onOpenEvent(event)}
                    className="flex items-center gap-1.5 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 text-xs font-bold px-3 py-1.5 rounded-xl border border-orange-500/40 transition active:scale-95"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Abrir Cálculo
                  </button>
                  <button
                    onClick={() => onDuplicateEvent(event.id)}
                    className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium px-2.5 py-1.5 rounded-xl border border-zinc-700/60 transition active:scale-95"
                    title="Duplicar evento"
                  >
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    Duplicar
                  </button>
                  <button
                    onClick={() => onDeleteEvent(event.id)}
                    className="flex items-center gap-1.5 bg-zinc-800 hover:bg-red-950/40 hover:text-red-400 text-zinc-400 text-xs font-medium px-2.5 py-1.5 rounded-xl border border-zinc-700/60 transition active:scale-95"
                    title="Excluir evento"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Salvar Evento */}
      {showSaveDialog && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18181C] border border-zinc-800 rounded-3xl p-5 max-w-sm w-full shadow-2xl animate-fade-in">
            <h3 className="text-base font-bold text-white mb-2">Salvar no Aparelho</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Dê um nome para identificar este churrasco no seu histórico local.
            </p>

            <form onSubmit={handleSaveSubmit} className="space-y-4">
              <input
                type="text"
                required
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="Ex: Aniversário do Rodrigo, Final do Campeonato..."
                className="w-full bg-[#121214] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowSaveDialog(false)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold py-2.5 rounded-xl text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-2.5 rounded-xl text-xs"
                >
                  Confirmar e Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

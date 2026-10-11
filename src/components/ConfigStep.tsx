import React from 'react';
import {
  Flame,
  Users,
  Baby,
  Clock,
  Sun,
  CloudSun,
  Beer,
  UtensilsCrossed,
  Sparkles,
  ArrowRight,
  History,
  ShoppingBag,
  BadgeDollarSign,
  Info,
  Download,
} from 'lucide-react';
import { ChurrascoConfig, ChurrascoProfile, ClimateType } from '../types';

interface ConfigStepProps {
  config: ChurrascoConfig;
  onChangeConfig: (updated: Partial<ChurrascoConfig>) => void;
  onCalculate: () => void;
  onGoToHistory: () => void;
  onGoToShopping: () => void;
  onOpenInstallModal?: () => void;
  totalMeatPreview: number;
}

export const ConfigStep: React.FC<ConfigStepProps> = ({
  config,
  onChangeConfig,
  onCalculate,
  onGoToHistory,
  onGoToShopping,
  onOpenInstallModal,
  totalMeatPreview,
}) => {
  const handleAdultsChange = (delta: number) => {
    const newVal = Math.max(0, config.adults + delta);
    onChangeConfig({ adults: newVal });
  };

  const handleChildrenChange = (delta: number) => {
    const newVal = Math.max(0, config.children + delta);
    onChangeConfig({ children: newVal });
  };

  const profiles: {
    id: ChurrascoProfile;
    title: string;
    badge: string;
    desc: string;
    color: string;
  }[] = [
    {
      id: 'economico',
      title: 'Econômico',
      badge: 'Custo-benefício',
      desc: 'Cortes bem balanceados: frango e linguiça ganham destaque, com carnes bovinas acessíveis.',
      color: 'border-emerald-600/60 bg-emerald-950/20 text-emerald-400',
    },
    {
      id: 'tradicional',
      title: 'Tradicional',
      badge: 'Mais pedido',
      desc: 'O clássico churrasco brasileiro: picanha, alcatra ou fraldinha, linguiça toscana e costelinha.',
      color: 'border-orange-500/80 bg-orange-950/30 text-orange-400',
    },
    {
      id: 'caprichado',
      title: 'Caprichado',
      badge: 'Fartura premium',
      desc: 'Mais carne por pessoa, cortes especiais (ancho, chorizo, picanha nobre) para ninguém botar defeito.',
      color: 'border-amber-500/70 bg-amber-950/30 text-amber-400',
    },
  ];

  const totalPeople = config.adults + config.children;

  return (
    <div className="space-y-6 pb-24">
      {/* Hero Banner Temático */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-[#1F100B] p-5 sm:p-6 border border-zinc-800 shadow-xl">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-semibold mb-2">
              <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
              Churrasco Sem Desperdício e Sem Faltar
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Calcule a quantidade exata para o seu evento
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-lg">
              Regras profissionais de churrasqueiro: carnes selecionadas, acompanhamentos, bebidas geladas e divisão transparente de custos.
            </p>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex sm:flex-col gap-2 shrink-0">
            {onOpenInstallModal && (
              <button
                onClick={onOpenInstallModal}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-md shadow-orange-600/30 transition active:scale-95"
              >
                <Download className="w-4 h-4 text-white" />
                Instalar
              </button>
            )}
            <button
              onClick={onGoToHistory}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium px-3 py-2 rounded-xl border border-zinc-700/60 transition active:scale-95"
            >
              <History className="w-4 h-4 text-orange-400" />
              Histórico
            </button>
            <button
              onClick={onGoToShopping}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium px-3 py-2 rounded-xl border border-zinc-700/60 transition active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              Lista
            </button>
          </div>
        </div>
      </div>

      {/* Nome do Evento (Opcional) */}
      <div className="bg-[#18181C] p-4 rounded-2xl border border-zinc-800/80">
        <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
          Nome do Evento (Opcional para salvar no histórico)
        </label>
        <input
          type="text"
          value={config.eventName}
          onChange={(e) => onChangeConfig({ eventName: e.target.value })}
          placeholder="Ex: Churrasco de Domingo, Níver do Marcos..."
          className="w-full bg-[#121214] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition"
        />
      </div>

      {/* Seção 1: Quantidade de Participantes */}
      <div className="bg-[#18181C] p-4 sm:p-5 rounded-3xl border border-zinc-800/80 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Convidados</h3>
              <p className="text-[11px] text-zinc-400">Adultos e crianças consomem porções diferentes</p>
            </div>
          </div>
          <span className="text-xs font-bold text-zinc-300 bg-zinc-800/80 px-2.5 py-1 rounded-full">
            Total: {totalPeople} {totalPeople === 1 ? 'pessoa' : 'pessoas'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Contador Adultos */}
          <div className="bg-[#121214] p-3.5 rounded-2xl border border-zinc-800 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-bold text-zinc-200">Adultos</span>
              </div>
              <span className="text-[11px] text-zinc-400">Consumo integral</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleAdultsChange(-1)}
                disabled={config.adults <= 0}
                className="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-90 text-white font-black text-lg flex items-center justify-center transition disabled:opacity-30 disabled:pointer-events-none"
              >
                -
              </button>
              <input
                type="number"
                min="0"
                value={config.adults}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  onChangeConfig({ adults: isNaN(val) ? 0 : Math.max(0, val) });
                }}
                className="w-12 text-center text-lg font-extrabold text-white bg-transparent focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleAdultsChange(1)}
                className="w-10 h-10 rounded-xl bg-orange-600 hover:bg-orange-500 active:scale-90 text-white font-black text-lg flex items-center justify-center transition shadow-md shadow-orange-600/30"
              >
                +
              </button>
            </div>
          </div>

          {/* Contador Crianças */}
          <div className="bg-[#121214] p-3.5 rounded-2xl border border-zinc-800 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <Baby className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-zinc-200">Crianças</span>
              </div>
              <span className="text-[11px] text-zinc-400">Até 11 anos (~50% carne)</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleChildrenChange(-1)}
                disabled={config.children <= 0}
                className="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-90 text-white font-black text-lg flex items-center justify-center transition disabled:opacity-30 disabled:pointer-events-none"
              >
                -
              </button>
              <input
                type="number"
                min="0"
                value={config.children}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  onChangeConfig({ children: isNaN(val) ? 0 : Math.max(0, val) });
                }}
                className="w-12 text-center text-lg font-extrabold text-white bg-transparent focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleChildrenChange(1)}
                className="w-10 h-10 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-90 text-white font-black text-lg flex items-center justify-center transition shadow-md shadow-amber-600/30"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {totalPeople === 0 && (
          <p className="text-xs text-amber-400 mt-2.5 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 shrink-0" />
            Adicione pelo menos 1 adulto ou criança para calcular as quantidades.
          </p>
        )}
      </div>

      {/* Seção 2: Duração do Churrasco */}
      <div className="bg-[#18181C] p-4 sm:p-5 rounded-3xl border border-zinc-800/80 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Duração Estimada</h3>
              <p className="text-[11px] text-zinc-400">Eventos mais longos demandam mais reposição e bebidas</p>
            </div>
          </div>
          <span className="text-base font-extrabold text-orange-400 bg-orange-950/40 border border-orange-500/30 px-3 py-1 rounded-xl">
            {config.durationHours} horas
          </span>
        </div>

        {/* Botões rápidos de duração */}
        <div className="grid grid-cols-4 gap-2 mt-3">
          {[2, 4, 6, 8].map((hours) => (
            <button
              key={hours}
              onClick={() => onChangeConfig({ durationHours: hours })}
              className={`py-2 rounded-xl text-xs font-bold transition ${
                config.durationHours === hours
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30 border border-orange-500'
                  : 'bg-[#121214] text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {hours}h {hours === 4 ? '(padrão)' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Seção 3: Perfil do Churrasco */}
      <div className="bg-[#18181C] p-4 sm:p-5 rounded-3xl border border-zinc-800/80 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Perfil do Evento</h3>
            <p className="text-[11px] text-zinc-400">Escolha o estilo de carne e quantidade desejada</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
          {profiles.map((p) => {
            const isSelected = config.profile === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onChangeConfig({ profile: p.id })}
                className={`p-3.5 rounded-2xl text-left border transition relative flex flex-col justify-between ${
                  isSelected
                    ? `${p.color} ring-2 ring-orange-500/40 bg-zinc-900/90`
                    : 'bg-[#121214] border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-white">{p.title}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                      {p.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed mt-1">{p.desc}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-semibold">
                  <span>Por adulto:</span>
                  <span className="text-orange-400">
                    {p.id === 'economico' ? '~370g' : p.id === 'tradicional' ? '~420g' : '~490g'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Seção 4: Ajustes de Acompanhamentos, Bebidas e Clima */}
      <div className="bg-[#18181C] p-4 sm:p-5 rounded-3xl border border-zinc-800/80 shadow-md space-y-4">
        <h3 className="text-sm font-bold text-white">Opções & Ambiente</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Toggle Acompanhamentos */}
          <div
            onClick={() => onChangeConfig({ hasSideDishes: !config.hasSideDishes })}
            className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
              config.hasSideDishes
                ? 'bg-orange-950/20 border-orange-500/60'
                : 'bg-[#121214] border-zinc-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${config.hasSideDishes ? 'bg-orange-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Acompanhamentos</p>
                <p className="text-[10px] text-zinc-400">Pão de alho, farofa, vinagrete, arroz</p>
              </div>
            </div>
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${config.hasSideDishes ? 'border-orange-500 bg-orange-500 text-white' : 'border-zinc-700 bg-zinc-800'}`}>
              {config.hasSideDishes ? '✓' : ''}
            </div>
          </div>

          {/* Toggle Bebidas Alcoólicas */}
          <div
            onClick={() => onChangeConfig({ hasAlcohol: !config.hasAlcohol })}
            className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
              config.hasAlcohol
                ? 'bg-amber-950/20 border-amber-500/60'
                : 'bg-[#121214] border-zinc-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${config.hasAlcohol ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                <Beer className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Bebidas Alcoólicas</p>
                <p className="text-[10px] text-zinc-400">Cerveja e fardos em lata</p>
              </div>
            </div>
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${config.hasAlcohol ? 'border-amber-500 bg-amber-500 text-black font-bold' : 'border-zinc-700 bg-zinc-800'}`}>
              {config.hasAlcohol ? '✓' : ''}
            </div>
          </div>

          {/* Clima: Ameno vs Quente */}
          <div className="p-3.5 rounded-2xl border border-zinc-800 bg-[#121214] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${config.climate === 'quente' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                {config.climate === 'quente' ? <Sun className="w-4 h-4" /> : <CloudSun className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-xs font-bold text-white">Clima do Evento</p>
                <p className="text-[10px] text-zinc-400">
                  {config.climate === 'quente' ? 'Calor (+35% líquidos & gelo)' : 'Ameno (consumo padrão)'}
                </p>
              </div>
            </div>

            <div className="flex bg-zinc-900 rounded-xl p-1 border border-zinc-800">
              <button
                type="button"
                onClick={() => onChangeConfig({ climate: 'ameno' as ClimateType })}
                className={`px-2 py-1 text-[10px] font-bold rounded-lg transition ${
                  config.climate === 'ameno' ? 'bg-zinc-700 text-white' : 'text-zinc-500'
                }`}
              >
                Ameno
              </button>
              <button
                type="button"
                onClick={() => onChangeConfig({ climate: 'quente' as ClimateType })}
                className={`px-2 py-1 text-[10px] font-bold rounded-lg transition ${
                  config.climate === 'quente' ? 'bg-orange-600 text-white' : 'text-zinc-500'
                }`}
              >
                Quente
              </button>
            </div>
          </div>
        </div>

        {/* Ajuste de % de bebedores caso tenha álcool */}
        {config.hasAlcohol && config.adults > 0 && (
          <div className="bg-[#121214] p-3 rounded-2xl border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Beer className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-zinc-300">
                  Quantos adultos bebem cerveja?
                </p>
                <p className="text-[10px] text-zinc-500">
                  {Math.round(config.adults * (config.drinkersPercent / 100))} de {config.adults} adultos ({config.drinkersPercent}%)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min="10"
                max="100"
                step="10"
                value={config.drinkersPercent}
                onChange={(e) => onChangeConfig({ drinkersPercent: Number(e.target.value) })}
                className="w-36 accent-amber-500 cursor-pointer"
              />
              <span className="text-xs font-bold text-amber-400 w-10 text-right">
                {config.drinkersPercent}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Resumo Dinâmico & Botão Principal */}
      <div className="bg-gradient-to-r from-orange-950/40 via-red-950/30 to-zinc-900 p-4 sm:p-5 rounded-3xl border border-orange-500/30 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
              Estimativa Preliminar
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-white">{totalMeatPreview} kg</span>
              <span className="text-xs text-zinc-400">de carne total recomendada</span>
            </div>
          </div>
          <p className="text-[11px] text-zinc-400 max-w-xs">
            Calculado para {totalPeople} participantes, ajustado para {config.durationHours}h e acompanhamentos.
          </p>
        </div>

        <button
          onClick={onCalculate}
          disabled={totalPeople === 0}
          className="w-full bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 hover:from-orange-500 hover:to-red-500 active:scale-[0.99] text-white font-extrabold text-base py-4 rounded-2xl shadow-xl shadow-orange-600/25 flex items-center justify-center gap-2 transition disabled:opacity-40 disabled:pointer-events-none cursor-pointer glow-ember"
        >
          <span>CALCULAR MEU CHURRASCO</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

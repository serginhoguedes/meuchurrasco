import React, { useState } from 'react';
import {
  DollarSign,
  Users,
  Beer,
  AlertCircle,
  Sparkles,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  Share2,
  TrendingUp,
} from 'lucide-react';
import { CalculatedItem, CostSummary, ChurrascoConfig } from '../types';
import { formatCurrencyBRL, MARKET_PRICE_SUGGESTIONS } from '../utils/calculator';

interface CostsViewProps {
  items: CalculatedItem[];
  costs: CostSummary;
  config: ChurrascoConfig;
  onUpdatePrice: (id: string, price: number | null) => void;
  onApplyMarketPrices: () => void;
  onClearPrices: () => void;
  onOpenStoryModal: () => void;
}

export const CostsView: React.FC<CostsViewProps> = ({
  items,
  costs,
  config,
  onUpdatePrice,
  onApplyMarketPrices,
  onClearPrices,
  onOpenStoryModal,
}) => {
  const [splitMode, setSplitMode] = useState<'adults' | 'all' | 'custom_drinkers'>('adults');
  const activeItems = items.filter((i) => i.included);

  const totalPeople = config.adults + config.children;
  const drinkersCount = Math.max(1, Math.round(config.adults * (config.drinkersPercent / 100)));
  const nonDrinkersCount = Math.max(0, config.adults - drinkersCount);

  return (
    <div className="space-y-6 pb-24">
      {/* Banner Principal de Custos */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-[#0F1E17] to-zinc-900 p-5 sm:p-6 border border-emerald-500/30 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Resumo Financeiro
              </span>
              <span className="text-xs text-zinc-400">
                {costs.itemsWithPrice} de {costs.itemsTotal} itens com preço
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {costs.totalCost > 0 ? formatCurrencyBRL(costs.totalCost) : 'R$ 0,00'}
              </span>
              <span className="text-xs font-semibold text-zinc-400">subtotal dos itens precificados</span>
            </div>

            <p className="text-xs text-zinc-400 mt-1">
              Simulação de rateio baseada estritamente nos preços que você informar abaixo.
            </p>
          </div>

          {/* Botões Rápidos de Ação nos Preços */}
          <div className="flex sm:flex-col gap-2 shrink-0">
            <button
              onClick={onApplyMarketPrices}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 text-xs font-bold px-3 py-2 rounded-xl border border-emerald-700/50 transition active:scale-95"
              title="Preencher automaticamente com valores médios estimados de mercado"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Sugerir Médias
            </button>
            <button
              onClick={onClearPrices}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs font-medium px-3 py-2 rounded-xl border border-zinc-700/60 transition active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Limpar Preços
            </button>
          </div>
        </div>

        {/* Alerta de Itens Não Informados */}
        {costs.unpricedItemsCount > 0 && (
          <div className="mt-4 pt-3.5 border-t border-zinc-800/80 flex items-center gap-2 text-xs text-amber-300/90">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Existem <strong>{costs.unpricedItemsCount} itens</strong> sem preço informado. Não inventamos preços de mercado; eles constam como &ldquo;Preço não informado&rdquo; até você preenchê-los.
            </span>
          </div>
        )}
      </div>

      {/* Cartões de Divisão da Conta / Simulações */}
      <div className="bg-[#18181C] p-4 sm:p-5 rounded-3xl border border-zinc-800/80 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Simulação de Divisão da Conta</h3>
              <p className="text-[11px] text-zinc-400">Escolha o modelo de rateio para o grupo</p>
            </div>
          </div>
        </div>

        {/* Abas dos Modelos de Rateio */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
          <button
            onClick={() => setSplitMode('adults')}
            className={`p-3 rounded-2xl border text-left transition ${
              splitMode === 'adults'
                ? 'bg-emerald-950/30 border-emerald-500/70 ring-1 ring-emerald-500/30 text-white'
                : 'bg-[#121214] border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <p className="text-xs font-bold">Apenas Adultos</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">Crianças são isentas da conta</p>
            <p className="text-base font-extrabold text-emerald-400 mt-2">
              {costs.totalCost > 0 ? formatCurrencyBRL(costs.costPerAdult) : '—'}
              <span className="text-[10px] text-zinc-500 font-normal"> / adulto</span>
            </p>
          </button>

          <button
            onClick={() => setSplitMode('all')}
            className={`p-3 rounded-2xl border text-left transition ${
              splitMode === 'all'
                ? 'bg-emerald-950/30 border-emerald-500/70 ring-1 ring-emerald-500/30 text-white'
                : 'bg-[#121214] border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <p className="text-xs font-bold">Igualitária (Todos)</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">Divide entre adultos e crianças</p>
            <p className="text-base font-extrabold text-emerald-400 mt-2">
              {costs.totalCost > 0 ? formatCurrencyBRL(costs.costPerPerson) : '—'}
              <span className="text-[10px] text-zinc-500 font-normal"> / pessoa</span>
            </p>
          </button>

          <button
            onClick={() => setSplitMode('custom_drinkers')}
            className={`p-3 rounded-2xl border text-left transition ${
              splitMode === 'custom_drinkers'
                ? 'bg-amber-950/30 border-amber-500/70 ring-1 ring-amber-500/30 text-white'
                : 'bg-[#121214] border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <p className="text-xs font-bold">Com/Sem Cerveja</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">Bebedores pagam a ceva</p>
            <p className="text-base font-extrabold text-amber-400 mt-2">
              {costs.totalCost > 0 ? formatCurrencyBRL(costs.costPerBeerDrinker) : '—'}
              <span className="text-[10px] text-zinc-500 font-normal"> / bebedor</span>
            </p>
          </button>
        </div>

        {/* Detalhe da Simulação Selecionada */}
        <div className="bg-[#121214] p-3.5 rounded-2xl border border-zinc-800 text-xs text-zinc-300">
          {splitMode === 'adults' && (
            <p>
              Dividindo o subtotal de <strong>{formatCurrencyBRL(costs.totalCost)}</strong> entre os <strong>{config.adults} adultos</strong> (as {config.children} crianças não entram no rateio financeiro).
            </p>
          )}
          {splitMode === 'all' && (
            <p>
              Dividindo igualmente o total entre todas as <strong>{totalPeople} pessoas</strong> ({config.adults} adultos e {config.children} crianças).
            </p>
          )}
          {splitMode === 'custom_drinkers' && (
            <div className="space-y-1">
              <p>
                🍻 <strong>{drinkersCount} adultos bebedores</strong> pagam a parte das carnes + a cerveja: <strong>{formatCurrencyBRL(costs.costPerBeerDrinker)}</strong> cada.
              </p>
              {nonDrinkersCount > 0 && (
                <p className="text-zinc-400">
                  🥤 <strong>{nonDrinkersCount} adultos que não bebem</strong> pagam apenas carnes e guarnições: <strong>{formatCurrencyBRL(Math.max(0, (costs.totalCost - (items.find(i => i.id === 'cerveja')?.quantity || 0) * (items.find(i => i.id === 'cerveja')?.pricePerUnit || 0)) / (config.adults || 1)))}</strong> cada.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lista de Preços Item por Item */}
      <div className="bg-[#18181C] p-4 sm:p-5 rounded-3xl border border-zinc-800/80 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Preços dos Produtos</h3>
            <p className="text-[11px] text-zinc-400">Digite o valor unitário que você pagou ou pretende pagar</p>
          </div>
        </div>

        <div className="space-y-3">
          {activeItems.map((item) => {
            const hasPrice = item.pricePerUnit !== null && item.pricePerUnit !== undefined && !isNaN(item.pricePerUnit) && item.pricePerUnit > 0;
            const qtyForCost = item.unit.includes('pct') || item.unit === 'latas' || item.unit.includes('saco') || item.unit === 'espetos'
              ? item.practicalQuantity
              : item.quantity;
            const subtotal = hasPrice ? qtyForCost * (item.pricePerUnit || 0) : null;

            return (
              <div
                key={item.id}
                className="bg-[#121214] p-3 sm:p-3.5 rounded-2xl border border-zinc-800/80 hover:border-zinc-700/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                    <span>Qtd: <strong>{item.quantity} {item.unit}</strong></span>
                    {item.practicalQuantity !== item.quantity && (
                      <span className="text-zinc-500">• (~{item.practicalQuantity} un. compra)</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-zinc-800/50">
                  {/* Input do Preço */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-zinc-400 font-semibold">R$</span>
                    <input
                      type="number"
                      step="0.10"
                      min="0"
                      placeholder="0,00"
                      value={item.pricePerUnit ?? ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? null : parseFloat(e.target.value);
                        onUpdatePrice(item.id, isNaN(val as number) ? null : val);
                      }}
                      className="w-24 bg-zinc-900 border border-zinc-700 rounded-xl px-2.5 py-1.5 text-sm text-right text-white font-bold focus:outline-none focus:border-emerald-500 transition"
                    />
                    <span className="text-[10px] text-zinc-500 w-12">
                      /{item.unit.replace('(cru)', '').trim()}
                    </span>
                  </div>

                  {/* Subtotal Calculado */}
                  <div className="text-right min-w-[85px]">
                    <span className="text-[10px] text-zinc-400 block">Subtotal</span>
                    <span
                      className={`text-xs font-black ${
                        hasPrice ? 'text-emerald-400' : 'text-zinc-500 italic'
                      }`}
                    >
                      {hasPrice ? formatCurrencyBRL(subtotal) : 'Não informado'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

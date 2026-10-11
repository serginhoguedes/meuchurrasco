import React from 'react';
import {
  Flame,
  Scale,
  Beef,
  UtensilsCrossed,
  Beer,
  Package,
  Info,
  DollarSign,
  CheckSquare,
  Sparkles,
  Layers,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { CalculatedItem, CalculationResult, CostSummary } from '../types';
import { formatCurrencyBRL } from '../utils/calculator';

interface QuantitiesViewProps {
  calculation: CalculationResult;
  costs: CostSummary;
  onToggleItem: (id: string) => void;
  onUpdateItemQuantity: (id: string, qty: number) => void;
  onGoToCosts: () => void;
  onGoToShopping: () => void;
  onOpenStoryModal: () => void;
}

export const QuantitiesView: React.FC<QuantitiesViewProps> = ({
  calculation,
  costs,
  onToggleItem,
  onUpdateItemQuantity,
  onGoToCosts,
  onGoToShopping,
  onOpenStoryModal,
}) => {
  const meatItems = calculation.items.filter((i) => i.category === 'carnes');
  const sideItems = calculation.items.filter((i) => i.category === 'acompanhamentos');
  const drinkItems = calculation.items.filter((i) => i.category === 'bebidas');
  const supplyItems = calculation.items.filter((i) => i.category === 'suprimentos');

  return (
    <div className="space-y-6 pb-24">
      {/* Banner Principal com Métricas de Destaque */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-[#1F120E] to-zinc-900 p-5 sm:p-6 border border-orange-500/30 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                Resultado do Churrasco
              </span>
              <span className="text-xs text-zinc-400">
                {calculation.summary.totalPeople} pessoas • {calculation.summary.effectiveAdults} adultos equiv.
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {calculation.totalMeatKg} kg
              </span>
              <span className="text-sm font-semibold text-orange-400">Total de Carnes</span>
            </div>

            <p className="text-xs text-zinc-400 mt-1">
              Média planejada: <strong className="text-zinc-200">~{calculation.meatPerAdultGrams}g</strong> por adulto e <strong className="text-zinc-200">~{calculation.meatPerChildGrams}g</strong> por criança.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-2.5 sm:w-64">
            <div className="bg-[#121214]/80 p-2.5 rounded-2xl border border-zinc-800">
              <p className="text-[10px] text-zinc-400">Custo Total</p>
              <p className="text-sm font-extrabold text-emerald-400">
                {costs.totalCost > 0 ? formatCurrencyBRL(costs.totalCost) : 'A calcular'}
              </p>
            </div>
            <div className="bg-[#121214]/80 p-2.5 rounded-2xl border border-zinc-800">
              <p className="text-[10px] text-zinc-400">Por Adulto</p>
              <p className="text-sm font-extrabold text-white">
                {costs.totalCost > 0 ? formatCurrencyBRL(costs.costPerAdult) : '—'}
              </p>
            </div>
          </div>
        </div>

        {/* Observação de Consumo Obrigatória */}
        <div className="mt-4 pt-3.5 border-t border-zinc-800/80 flex items-start gap-2 text-[11px] text-zinc-400">
          <Info className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-zinc-300">Observação importante:</strong> Estas quantidades não são regras universais rígidas. O consumo real varia conforme o apetite, a idade dos convidados e o clima do evento. Você pode ajustar qualquer item manualmente abaixo.
          </p>
        </div>
      </div>

      {/* Categoria 1: Carnes */}
      <div className="bg-[#18181C] p-4 sm:p-5 rounded-3xl border border-zinc-800/80 shadow-md">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
              <Beef className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Carnes & Cortes da Grelha</h3>
              <p className="text-[11px] text-zinc-400">Proporções ajustadas: bovina (50%), linguiça (20%), frango (15%), suína (15%)</p>
            </div>
          </div>
          <span className="text-xs font-bold text-orange-400 bg-orange-950/40 px-2.5 py-1 rounded-full border border-orange-500/30">
            {calculation.totalMeatKg} kg total
          </span>
        </div>

        <div className="space-y-2.5">
          {meatItems.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              onToggle={() => onToggleItem(item.id)}
              onUpdateQty={(q) => onUpdateItemQuantity(item.id, q)}
            />
          ))}
        </div>
      </div>

      {/* Categoria 2: Acompanhamentos */}
      <div className="bg-[#18181C] p-4 sm:p-5 rounded-3xl border border-zinc-800/80 shadow-md">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Acompanhamentos & Guarnições</h3>
              <p className="text-[11px] text-zinc-400">Comida que complementa e rende no prato</p>
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          {sideItems.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              onToggle={() => onToggleItem(item.id)}
              onUpdateQty={(q) => onUpdateItemQuantity(item.id, q)}
            />
          ))}
        </div>
      </div>

      {/* Categoria 3: Bebidas */}
      <div className="bg-[#18181C] p-4 sm:p-5 rounded-3xl border border-zinc-800/80 shadow-md">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Beer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Bebidas</h3>
              <p className="text-[11px] text-zinc-400">Água, refrigerantes e cerveja gelada</p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-500/30">
            {calculation.summary.drinksTotalLiters} L totais
          </span>
        </div>

        <div className="space-y-2.5">
          {drinkItems.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              onToggle={() => onToggleItem(item.id)}
              onUpdateQty={(q) => onUpdateItemQuantity(item.id, q)}
            />
          ))}
        </div>
      </div>

      {/* Categoria 4: Suprimentos (Carvão e Gelo) */}
      <div className="bg-[#18181C] p-4 sm:p-5 rounded-3xl border border-zinc-800/80 shadow-md">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-700/30 flex items-center justify-center text-zinc-300">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Materiais & Carvão</h3>
              <p className="text-[11px] text-zinc-400">Regra de ouro: ~1.1kg de carvão para cada kg de carne</p>
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          {supplyItems.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              onToggle={() => onToggleItem(item.id)}
              onUpdateQty={(q) => onUpdateItemQuantity(item.id, q)}
            />
          ))}
        </div>
      </div>

      {/* Ações Inferiores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <button
          onClick={onGoToCosts}
          className="bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-extrabold text-sm py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition"
        >
          <DollarSign className="w-4 h-4" />
          <span>Calcular Custos & Dividir Conta</span>
          <ChevronRight className="w-4 h-4 ml-auto" />
        </button>

        <button
          onClick={onGoToShopping}
          className="bg-zinc-800 hover:bg-zinc-700 active:scale-[0.99] text-zinc-200 font-bold text-sm py-3.5 px-4 rounded-2xl border border-zinc-700 flex items-center justify-center gap-2 transition"
        >
          <CheckSquare className="w-4 h-4 text-orange-400" />
          <span>Ver Lista de Compras</span>
          <ChevronRight className="w-4 h-4 ml-auto" />
        </button>
      </div>
    </div>
  );
};

interface ItemRowProps {
  item: CalculatedItem;
  onToggle: () => void;
  onUpdateQty: (qty: number) => void;
}

const ItemRow: React.FC<ItemRowProps> = ({ item, onToggle, onUpdateQty }) => {
  return (
    <div
      className={`p-3 sm:p-3.5 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
        item.included
          ? 'bg-[#121214] border-zinc-800 hover:border-zinc-700'
          : 'bg-[#121214]/40 border-zinc-900 opacity-50'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Toggle do item */}
        <button
          type="button"
          onClick={onToggle}
          className={`w-6 h-6 rounded-lg border flex items-center justify-center text-xs mt-0.5 transition ${
            item.included
              ? 'bg-orange-600 border-orange-500 text-white font-bold'
              : 'bg-zinc-800 border-zinc-700 text-zinc-500'
          }`}
          title={item.included ? 'Desativar este item' : 'Ativar este item'}
        >
          {item.included ? '✓' : ''}
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-zinc-100">{item.name}</span>
            {item.isOptional && (
              <span className="text-[10px] font-semibold text-amber-400 bg-amber-950/40 border border-amber-800/40 px-1.5 py-0.2 rounded">
                Opcional
              </span>
            )}
          </div>
          {item.note && (
            <p className="text-[11px] text-zinc-400 mt-0.5">{item.note}</p>
          )}
        </div>
      </div>

      {/* Quantidade calculada / ajustável */}
      <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-auto w-full sm:w-auto pt-1 sm:pt-0 border-t sm:border-0 border-zinc-800/50">
        <div className="text-right">
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              step={item.unit === 'kg' ? '0.1' : '1'}
              min="0"
              value={item.quantity}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val >= 0) {
                  onUpdateQty(val);
                }
              }}
              className="w-16 text-right font-extrabold text-sm sm:text-base text-white bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 focus:outline-none focus:border-orange-500"
            />
            <span className="text-xs font-semibold text-zinc-400">{item.unit}</span>
          </div>
          <span className="text-[10px] text-zinc-500 block">
            Compra: ~{item.practicalQuantity} {item.unit}
          </span>
        </div>
      </div>
    </div>
  );
};

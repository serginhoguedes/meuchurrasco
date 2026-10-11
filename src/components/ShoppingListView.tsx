import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Share2,
  Plus,
  Trash2,
  CheckCircle,
  Copy,
  Beef,
  UtensilsCrossed,
  Beer,
  Package,
} from 'lucide-react';
import { CalculatedItem, ChurrascoConfig, ItemCategory } from '../types';

interface ShoppingListViewProps {
  items: CalculatedItem[];
  config: ChurrascoConfig;
  onTogglePurchased: (id: string) => void;
  onAddCustomItem: (name: string, category: ItemCategory, quantity: number, unit: string) => void;
  onRemoveItem: (id: string) => void;
}

export const ShoppingListView: React.FC<ShoppingListViewProps> = ({
  items,
  config,
  onTogglePurchased,
  onAddCustomItem,
  onRemoveItem,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'purchased'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  // Formulário para item customizado
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<ItemCategory>('suprimentos');
  const [newItemQty, setNewItemQty] = useState('1');
  const [newItemUnit, setNewItemUnit] = useState('un');

  const activeItems = items.filter((i) => i.included);
  const purchasedCount = activeItems.filter((i) => i.purchased).length;
  const totalCount = activeItems.length;
  const progressPercent = totalCount > 0 ? Math.round((purchasedCount / totalCount) * 100) : 0;

  const filteredItems = activeItems.filter((item) => {
    if (filter === 'pending') return !item.purchased;
    if (filter === 'purchased') return item.purchased;
    return true;
  });

  const categories: { id: ItemCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'carnes', label: 'Carnes & Cortes', icon: Beef },
    { id: 'acompanhamentos', label: 'Acompanhamentos', icon: UtensilsCrossed },
    { id: 'bebidas', label: 'Bebidas', icon: Beer },
    { id: 'suprimentos', label: 'Suprimentos & Carvão', icon: Package },
  ];

  // Gerar texto formatado para compartilhar no WhatsApp / Android Share
  const handleShareText = async () => {
    let text = `🔥 *LISTA DE COMPRAS - ${config.eventName.toUpperCase() || 'CHURRASCO'}*\n`;
    text += `👥 ${config.adults} Adultos, ${config.children} Crianças • Duração: ${config.durationHours}h\n\n`;

    categories.forEach((cat) => {
      const catItems = activeItems.filter((i) => i.category === cat.id);
      if (catItems.length > 0) {
        text += `*${cat.label.toUpperCase()}*\n`;
        catItems.forEach((it) => {
          const status = it.purchased ? '✅' : '⬜';
          const qty = it.unit.includes('pct') || it.unit === 'latas' || it.unit.includes('saco')
            ? `${it.practicalQuantity} ${it.unit}`
            : `${it.quantity} ${it.unit}`;
          text += `${status} ${it.name}: ${qty}\n`;
        });
        text += '\n';
      }
    });

    text += `_Gerado pelo aplicativo Churrasco Calculado (100% Offline)_`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Lista de Compras - ${config.eventName}`,
          text: text,
        });
      } catch (err) {
        // Se cancelar ou der erro, copia para o clipboard
        copyToClipboard(text);
      }
    } else {
      copyToClipboard(text);
    }
  };

  const copyToClipboard = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const handleCreateCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const qty = parseFloat(newItemQty) || 1;
    onAddCustomItem(newItemName.trim(), newItemCategory, qty, newItemUnit.trim());
    setNewItemName('');
    setNewItemQty('1');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Banner de Progresso das Compras */}
      <div className="relative overflow-hidden rounded-3xl bg-[#18181C] p-5 border border-zinc-800 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-orange-500" />
              Checklist de Compras
            </h2>
            <p className="text-xs text-zinc-400">
              {purchasedCount} de {totalCount} itens no carrinho ({progressPercent}%)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold px-3 py-2 rounded-xl border border-zinc-700 transition active:scale-95"
            >
              <Plus className="w-4 h-4 text-orange-400" />
              <span>Adicionar</span>
            </button>
            <button
              onClick={handleShareText}
              className="flex items-center gap-1.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-md shadow-orange-600/25 transition active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>Compartilhar</span>
            </button>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="w-full bg-zinc-800 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-orange-500 to-emerald-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Toast de Cópia */}
        {copiedToast && (
          <div className="mt-3 p-2 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Lista copiada com sucesso! Pronta para colar no WhatsApp.
          </div>
        )}
      </div>

      {/* Filtros */}
      <div className="flex bg-[#121214] p-1 rounded-2xl border border-zinc-800 max-w-sm">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition ${
            filter === 'all' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Todos ({totalCount})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition ${
            filter === 'pending' ? 'bg-orange-600 text-white' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Pendentes ({totalCount - purchasedCount})
        </button>
        <button
          onClick={() => setFilter('purchased')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition ${
            filter === 'purchased' ? 'bg-emerald-600 text-white' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Comprados ({purchasedCount})
        </button>
      </div>

      {/* Lista Organizada por Categorias */}
      <div className="space-y-5">
        {categories.map((cat) => {
          const catItems = filteredItems.filter((i) => i.category === cat.id);
          if (catItems.length === 0) return null;
          const Icon = cat.icon;

          return (
            <div key={cat.id} className="bg-[#18181C] p-4 sm:p-5 rounded-3xl border border-zinc-800/80 shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                  {cat.label}
                </h3>
              </div>

              <div className="space-y-2">
                {catItems.map((item) => {
                  const isPurchased = !!item.purchased;
                  const isCustom = item.id.startsWith('custom_');

                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                        isPurchased
                          ? 'bg-[#121214]/50 border-zinc-900 opacity-60'
                          : 'bg-[#121214] border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => onTogglePurchased(item.id)}
                        className="flex items-center gap-3 text-left flex-1"
                      >
                        <div
                          className={`w-6 h-6 rounded-lg border flex items-center justify-center transition shrink-0 ${
                            isPurchased
                              ? 'bg-emerald-600 border-emerald-500 text-white'
                              : 'bg-zinc-800 border-zinc-700 text-transparent'
                          }`}
                        >
                          ✓
                        </div>
                        <div>
                          <span
                            className={`text-sm font-semibold transition ${
                              isPurchased ? 'line-through text-zinc-500' : 'text-zinc-100'
                            }`}
                          >
                            {item.name}
                          </span>
                          <span className="block text-[11px] text-orange-400 font-bold mt-0.5">
                            {item.quantity} {item.unit}
                            {item.practicalQuantity !== item.quantity && (
                              <span className="text-zinc-500 font-normal"> (Compra comercial: ~{item.practicalQuantity} {item.unit})</span>
                            )}
                          </span>
                        </div>
                      </button>

                      {isCustom && (
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="p-1.5 text-zinc-500 hover:text-red-400 transition"
                          title="Remover item personalizado"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Adicionar Item Personalizado */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18181C] border border-zinc-800 rounded-3xl p-5 max-w-sm w-full shadow-2xl animate-fade-in">
            <h3 className="text-base font-bold text-white mb-3">Adicionar à Lista de Compras</h3>
            <form onSubmit={handleCreateCustomItem} className="space-y-3">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Nome do Produto</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Copos descartáveis, Limão..."
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full bg-[#121214] border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Categoria</label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value as ItemCategory)}
                  className="w-full bg-[#121214] border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="carnes">Carnes</option>
                  <option value="acompanhamentos">Acompanhamentos</option>
                  <option value="bebidas">Bebidas</option>
                  <option value="suprimentos">Suprimentos / Descartáveis</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Quantidade</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.1"
                    required
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(e.target.value)}
                    className="w-full bg-[#121214] border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Unidade</label>
                  <input
                    type="text"
                    required
                    placeholder="un, kg, pct, cx"
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    className="w-full bg-[#121214] border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold py-2.5 rounded-xl text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-2.5 rounded-xl text-xs"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

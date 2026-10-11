import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  ChurrascoConfig,
  CalculatedItem,
  SavedEvent,
  ItemCategory,
} from './types';
import {
  DEFAULT_CONFIG,
  calculateChurrasco,
  calculateCosts,
  MARKET_PRICE_SUGGESTIONS,
} from './utils/calculator';
import {
  getSavedEvents,
  saveEventToHistory,
  duplicateSavedEvent,
  deleteSavedEvent,
  saveCurrentDraft,
  getStoredDraft,
} from './utils/storage';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { ConfigStep } from './components/ConfigStep';
import { QuantitiesView } from './components/QuantitiesView';
import { CostsView } from './components/CostsView';
import { ShoppingListView } from './components/ShoppingListView';
import { HistoryView } from './components/HistoryView';
import { StoryModal } from './components/StoryModal';
import { TestRunnerModal } from './components/TestRunnerModal';
import { AndroidCodeModal } from './components/AndroidCodeModal';
import { InstallPromptModal } from './components/InstallPromptModal';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  // Configuração principal
  const [config, setConfig] = useState<ChurrascoConfig>(() => {
    const savedDraft = getStoredDraft<{ config?: ChurrascoConfig }>();
    return savedDraft?.config || DEFAULT_CONFIG;
  });

  // Preços customizados informados pelo usuário: itemId -> preço (ou null se não informado)
  const [customPrices, setCustomPrices] = useState<Record<string, number | null>>(() => {
    const savedDraft = getStoredDraft<{ customPrices?: Record<string, number | null> }>();
    return savedDraft?.customPrices || {};
  });

  // Itens customizados inseridos na lista de compras pelo usuário
  const [customItems, setCustomItems] = useState<CalculatedItem[]>(() => {
    const savedDraft = getStoredDraft<{ customItems?: CalculatedItem[] }>();
    return savedDraft?.customItems || [];
  });

  // Itens desabilitados pelo usuário (id -> boolean)
  const [disabledItemIds, setDisabledItemIds] = useState<Set<string>>(new Set());

  // Sobrescrever quantidades calculadas se o usuário editar
  const [customQuantities, setCustomQuantities] = useState<Record<string, number>>({});

  // Itens marcados como comprados na lista de compras (id -> boolean)
  const [purchasedIds, setPurchasedIds] = useState<Set<string>>(() => {
    const savedDraft = getStoredDraft<{ purchasedIds?: string[] }>();
    return new Set(savedDraft?.purchasedIds || []);
  });

  // Aba ativa na navegação
  const [activeTab, setActiveTab] = useState<TabType>('config');

  // Histórico local
  const [savedEvents, setSavedEvents] = useState<SavedEvent[]>(() => getSavedEvents());

  // Estado dos Modais
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isTestsModalOpen, setIsTestsModalOpen] = useState(false);
  const [isAndroidCodeModalOpen, setIsAndroidCodeModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Formato celular Android vs Tela cheia
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  // 1. Cálculo dinâmico das quantidades e itens
  const calculationResult = useMemo(() => {
    const baseCalc = calculateChurrasco(config);

    // Mescla itens calculados com os preços, customizações e customItems
    const mergedItems: CalculatedItem[] = baseCalc.items.map((it) => {
      const userPrice = customPrices[it.id] !== undefined ? customPrices[it.id] : it.pricePerUnit;
      const isIncluded = disabledItemIds.has(it.id) ? false : it.included;
      const userQty = customQuantities[it.id] !== undefined ? customQuantities[it.id] : it.quantity;
      const isPurchased = purchasedIds.has(it.id);

      return {
        ...it,
        quantity: userQty,
        included: isIncluded,
        pricePerUnit: userPrice,
        purchased: isPurchased,
      };
    });

    // Anexa os itens customizados adicionados pelo usuário
    customItems.forEach((ci) => {
      const isPurchased = purchasedIds.has(ci.id);
      const userPrice = customPrices[ci.id] !== undefined ? customPrices[ci.id] : ci.pricePerUnit;
      mergedItems.push({
        ...ci,
        pricePerUnit: userPrice,
        purchased: isPurchased,
      });
    });

    return {
      ...baseCalc,
      items: mergedItems,
    };
  }, [config, customPrices, disabledItemIds, customQuantities, customItems, purchasedIds]);

  // 2. Cálculo dos custos financeiros
  const costSummary = useMemo(() => {
    return calculateCosts(
      calculationResult.items,
      config.adults,
      config.children,
      config.drinkersPercent
    );
  }, [calculationResult.items, config.adults, config.children, config.drinkersPercent]);

  // Salvar rascunho atual automaticamente no LocalStorage
  useEffect(() => {
    saveCurrentDraft({
      config,
      customPrices,
      customItems,
      purchasedIds: Array.from(purchasedIds),
    });
  }, [config, customPrices, customItems, purchasedIds]);

  // Handlers
  const handleConfigChange = (updated: Partial<ChurrascoConfig>) => {
    setConfig((prev) => ({ ...prev, ...updated }));
  };

  const handleCalculate = () => {
    // Efeito de confete festivo
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#FF5722', '#F59E0B', '#EF4444'],
      });
    } catch (e) {
      // Ignora caso canvas não esteja disponível
    }
    setActiveTab('quantities');
  };

  const handleToggleItem = (id: string) => {
    setDisabledItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleUpdateItemQuantity = (id: string, qty: number) => {
    setCustomQuantities((prev) => ({
      ...prev,
      [id]: qty,
    }));
  };

  const handleUpdatePrice = (id: string, price: number | null) => {
    setCustomPrices((prev) => ({
      ...prev,
      [id]: price,
    }));
  };

  const handleApplyMarketPrices = () => {
    const updated = { ...customPrices };
    calculationResult.items.forEach((item) => {
      if (MARKET_PRICE_SUGGESTIONS[item.id]) {
        updated[item.id] = MARKET_PRICE_SUGGESTIONS[item.id];
      }
    });
    setCustomPrices(updated);
  };

  const handleClearPrices = () => {
    setCustomPrices({});
  };

  const handleTogglePurchased = (id: string) => {
    setPurchasedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleAddCustomItem = (
    name: string,
    category: ItemCategory,
    quantity: number,
    unit: string
  ) => {
    const newItem: CalculatedItem = {
      id: 'custom_' + Date.now(),
      name,
      category,
      quantity,
      practicalQuantity: quantity,
      unit,
      pricePerUnit: null,
      included: true,
      purchased: false,
    };
    setCustomItems((prev) => [...prev, newItem]);
  };

  const handleRemoveCustomItem = (id: string) => {
    setCustomItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleSaveCurrentEvent = (name: string) => {
    const newEvent: SavedEvent = {
      id: 'event_' + Date.now(),
      name,
      date: new Date().toISOString(),
      config: { ...config, eventName: name },
      customPrices,
      customQuantities,
      purchasedItems: Array.from(purchasedIds),
      totalCostCalculated: costSummary.totalCost,
      totalMeatKg: calculationResult.totalMeatKg,
    };
    saveEventToHistory(newEvent);
    setSavedEvents(getSavedEvents());
    setActiveTab('history');
  };

  const handleOpenEvent = (event: SavedEvent) => {
    setConfig(event.config);
    if (event.customPrices) setCustomPrices(event.customPrices);
    if (event.customQuantities) setCustomQuantities(event.customQuantities);
    if (event.purchasedItems) setPurchasedIds(new Set(event.purchasedItems));
    setActiveTab('quantities');
  };

  const handleDuplicateEvent = (id: string) => {
    duplicateSavedEvent(id);
    setSavedEvents(getSavedEvents());
  };

  const handleDeleteEvent = (id: string) => {
    deleteSavedEvent(id);
    setSavedEvents(getSavedEvents());
  };

  const activeShoppingItems = calculationResult.items.filter((i) => i.included);
  const pendingShoppingCount = activeShoppingItems.filter((i) => !i.purchased).length;

  return (
    <div className="min-h-screen bg-[#121214] text-[#E4E4E7] flex flex-col items-center">
      {/* Indicador discreto de offline */}
      <OfflineIndicator />

      {/* Container Principal: Responsivo ou Shell Celular Android */}
      <div
        className={`w-full transition-all duration-300 flex flex-col min-h-screen ${
          isMobileFrame
            ? 'max-w-md my-0 sm:my-6 rounded-none sm:rounded-[40px] shadow-2xl border-0 sm:border-[8px] border-zinc-800 overflow-hidden bg-[#121214]'
            : 'max-w-3xl'
        }`}
      >
        {/* Barra de Status Android Simulada (quando em modo celular) */}
        {isMobileFrame && (
          <div className="bg-[#121214] px-6 pt-2 pb-1 flex items-center justify-between text-[11px] font-semibold text-zinc-400 select-none border-b border-zinc-900">
            <span>12:00</span>
            <div className="w-20 h-4 bg-zinc-900 rounded-full mx-auto" />
            <div className="flex items-center gap-1.5 text-[10px]">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* Top Header */}
        <Header
          onOpenStoryModal={() => setIsStoryModalOpen(true)}
          onOpenTestsModal={() => setIsTestsModalOpen(true)}
          onOpenAndroidCodeModal={() => setIsAndroidCodeModalOpen(true)}
          onOpenInstallModal={() => setIsInstallModalOpen(true)}
          isMobileFrame={isMobileFrame}
          onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
        />

        {/* Conteúdo Principal com base na Tab selecionada */}
        <main className="flex-1 px-3.5 sm:px-6 pt-3 sm:pt-6">
          {activeTab === 'config' && (
            <ConfigStep
              config={config}
              onChangeConfig={handleConfigChange}
              onCalculate={handleCalculate}
              onGoToHistory={() => setActiveTab('history')}
              onGoToShopping={() => setActiveTab('shopping')}
              onOpenInstallModal={() => setIsInstallModalOpen(true)}
              totalMeatPreview={calculationResult.totalMeatKg}
            />
          )}

          {activeTab === 'quantities' && (
            <QuantitiesView
              calculation={calculationResult}
              costs={costSummary}
              onToggleItem={handleToggleItem}
              onUpdateItemQuantity={handleUpdateItemQuantity}
              onGoToCosts={() => setActiveTab('costs')}
              onGoToShopping={() => setActiveTab('shopping')}
              onOpenStoryModal={() => setIsStoryModalOpen(true)}
            />
          )}

          {activeTab === 'costs' && (
            <CostsView
              items={calculationResult.items}
              costs={costSummary}
              config={config}
              onUpdatePrice={handleUpdatePrice}
              onApplyMarketPrices={handleApplyMarketPrices}
              onClearPrices={handleClearPrices}
              onOpenStoryModal={() => setIsStoryModalOpen(true)}
            />
          )}

          {activeTab === 'shopping' && (
            <ShoppingListView
              items={calculationResult.items}
              config={config}
              onTogglePurchased={handleTogglePurchased}
              onAddCustomItem={handleAddCustomItem}
              onRemoveItem={handleRemoveCustomItem}
            />
          )}

          {activeTab === 'history' && (
            <HistoryView
              savedEvents={savedEvents}
              onOpenEvent={handleOpenEvent}
              onDuplicateEvent={handleDuplicateEvent}
              onDeleteEvent={handleDeleteEvent}
              onSaveCurrentEvent={handleSaveCurrentEvent}
              currentEventName={config.eventName}
            />
          )}
        </main>

        {/* Bottom Navigation Bar */}
        <BottomNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          shoppingPendingCount={pendingShoppingCount}
          unpricedCount={costSummary.unpricedItemsCount}
        />
      </div>

      {/* Modais do Sistema */}
      <InstallPromptModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      <StoryModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        config={config}
        calculation={calculationResult}
        costs={costSummary}
      />

      <TestRunnerModal
        isOpen={isTestsModalOpen}
        onClose={() => setIsTestsModalOpen(false)}
      />

      <AndroidCodeModal
        isOpen={isAndroidCodeModalOpen}
        onClose={() => setIsAndroidCodeModalOpen(false)}
      />
    </div>
  );
}

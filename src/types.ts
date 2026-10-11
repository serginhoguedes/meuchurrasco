export type ChurrascoProfile = 'economico' | 'tradicional' | 'caprichado';
export type ClimateType = 'ameno' | 'quente';

export interface ChurrascoConfig {
  id?: string;
  eventName: string;
  adults: number;
  children: number;
  durationHours: number;
  profile: ChurrascoProfile;
  hasSideDishes: boolean; // Acompanhamentos
  hasAlcohol: boolean;    // Bebidas alcoólicas
  climate: ClimateType;   // Ambiente quente ou ameno
  drinkersPercent: number; // Porcentagem de adultos que bebem cerveja (0 a 100, default 80)
}

export type ItemCategory = 'carnes' | 'acompanhamentos' | 'bebidas' | 'suprimentos';

export interface CalculatedItem {
  id: string;
  name: string;
  category: ItemCategory;
  quantity: number;        // Valor numérico calculado
  unit: string;            // kg, un, l, pct, saco, latas
  practicalQuantity: number; // Valor prático arredondado para compra comercial
  pricePerUnit: number | null; // Preço unitário informado pelo usuário (R$) ou null se não informado
  note?: string;           // Dica prática (ex: "Aprox. 4 latas de 350ml por adulto")
  isOptional?: boolean;    // Se é opcional (ex: queijo coalho)
  included: boolean;       // Se está ativo no churrasco atual
  purchased?: boolean;     // Para a lista de compras
}

export interface CalculationResult {
  totalMeatKg: number;
  meatPerAdultGrams: number;
  meatPerChildGrams: number;
  items: CalculatedItem[];
  summary: {
    totalPeople: number;
    effectiveAdults: number;
    drinksTotalLiters: number;
    beerTotalLiters: number;
    charcoalKg: number;
  };
}

export interface CostSummary {
  itemsWithPrice: number;
  itemsTotal: number;
  totalCost: number;
  costPerPerson: number;       // Divisão igualitária (adultos + crianças)
  costPerAdult: number;        // Divisão apenas entre adultos
  costPerBeerDrinker: number;  // Divisão se bebedores pagarem a cerveja
  unpricedItemsCount: number;
}

export interface SavedEvent {
  id: string;
  name: string;
  date: string; // ISO string
  config: ChurrascoConfig;
  customPrices: Record<string, number | null>; // id -> price
  customQuantities?: Record<string, number>;    // id -> manual override
  purchasedItems?: string[];                    // ids of checked items
  totalCostCalculated: number;
  totalMeatKg: number;
}

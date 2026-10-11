import {
  ChurrascoConfig,
  CalculatedItem,
  CalculationResult,
  CostSummary,
} from '../types';

export const DEFAULT_CONFIG: ChurrascoConfig = {
  eventName: 'Churrasco com a Galera',
  adults: 10,
  children: 2,
  durationHours: 4,
  profile: 'tradicional',
  hasSideDishes: true,
  hasAlcohol: true,
  climate: 'ameno',
  drinkersPercent: 80,
};

/**
 * Calcula todas as quantidades de carnes, acompanhamentos, bebidas e carvão
 * baseado em regras culinárias consagradas para o churrasco brasileiro.
 */
export function calculateChurrasco(
  config: ChurrascoConfig,
  currentItems?: CalculatedItem[]
): CalculationResult {
  const adults = Math.max(0, config.adults || 0);
  const children = Math.max(0, config.children || 0);
  const duration = Math.max(1, Math.min(12, config.durationHours || 4));
  const totalPeople = adults + children;

  // 1. Fator base por perfil (gramas por adulto)
  let baseMeatAdultGrams = 420; // Tradicional
  if (config.profile === 'economico') {
    baseMeatAdultGrams = 370;
  } else if (config.profile === 'caprichado') {
    baseMeatAdultGrams = 490;
  }

  // Ajuste por acompanhamentos (reduz carne se houver fartura de acompanhamentos)
  if (config.hasSideDishes) {
    baseMeatAdultGrams *= 0.88; // -12% pois consome pão de alho, farofa, arroz
  } else {
    baseMeatAdultGrams *= 1.08; // Carne como prato principal exclusivo
  }

  // Ajuste suave por duração (base 4h): +7% por hora adicional, -6% por hora a menos
  const durationFactor = Math.max(0.75, Math.min(1.5, 1 + (duration - 4) * 0.07));
  const finalMeatPerAdultGrams = Math.round(baseMeatAdultGrams * durationFactor);
  const finalMeatPerChildGrams = Math.round(finalMeatPerAdultGrams * 0.5); // Criança consome metade

  // Total de carnes em kg (se 0 pessoas, resultado é 0)
  const totalMeatKg = totalPeople > 0
    ? Number((((adults * finalMeatPerAdultGrams) + (children * finalMeatPerChildGrams)) / 1000).toFixed(2))
    : 0;

  // Proporções exatas das carnes:
  // Bovina: 50%, Linguiça: 20%, Frango: 15%, Suína: 15% -> Soma exata = 100%
  const beefKg = Number((totalMeatKg * 0.50).toFixed(2));
  const sausageKg = Number((totalMeatKg * 0.20).toFixed(2));
  const chickenKg = Number((totalMeatKg * 0.15).toFixed(2));
  const porkKg = Number((totalMeatKg - (beefKg + sausageKg + chickenKg)).toFixed(2)); // Garante soma 100% sem dízimas

  // 2. Acompanhamentos
  // Pão de alho: ~1.5 por adulto, 1 por criança
  const garlicBreadUnits = config.hasSideDishes && totalPeople > 0
    ? Math.ceil((adults * 1.5) + (children * 1.0))
    : 0;
  const garlicBreadPacks = Math.ceil(garlicBreadUnits / 5); // Pacotes de 5 unidades comerciais

  // Farofa pronta: ~35g por pessoa
  const farofaKg = config.hasSideDishes && totalPeople > 0
    ? Number(((totalPeople * 35) / 1000).toFixed(2))
    : 0;
  const farofaPacks = Math.ceil(farofaKg / 0.5); // Pacotes de 500g

  // Arroz cru: ~40g por pessoa
  const riceKg = config.hasSideDishes && totalPeople > 0
    ? Number(((totalPeople * 40) / 1000).toFixed(2))
    : 0;

  // Vinagrete: ~45g por pessoa
  const vinaigretteKg = config.hasSideDishes && totalPeople > 0
    ? Number(((totalPeople * 45) / 1000).toFixed(2))
    : 0;

  // Queijo coalho (Opcional): ~1.2 espetos por pessoa
  const cheeseUnits = config.hasSideDishes && totalPeople > 0
    ? Math.ceil(totalPeople * 1.2)
    : 0;
  const cheesePacks = Math.ceil(cheeseUnits / 7); // Pacote padrão com 7 espetos

  // 3. Bebidas
  // Fator de calor: se quente, +35% de consumo de líquidos e cerveja
  const climateMultiplier = config.climate === 'quente' ? 1.35 : 1.0;

  // Água mineral (litros): 450ml por pessoa * clima
  const waterLiters = totalPeople > 0
    ? Number(((totalPeople * 0.45 * climateMultiplier)).toFixed(1))
    : 0;

  // Refrigerante / Sucos (litros): 550ml por pessoa * clima
  const sodaLiters = totalPeople > 0
    ? Number(((totalPeople * 0.55 * climateMultiplier)).toFixed(1))
    : 0;

  // Cerveja: Latas de 350ml
  // Base para bebedores: 4 latas por bebedor para 4 horas
  let beerCans = 0;
  let beerLiters = 0;
  if (config.hasAlcohol && adults > 0) {
    const drinkersCount = Math.max(1, Math.round(adults * (config.drinkersPercent / 100)));
    const cansPerDrinkerBase = 4 + (duration - 4) * 0.8;
    const finalCansPerDrinker = Math.ceil(cansPerDrinkerBase * (config.climate === 'quente' ? 1.25 : 1.0));
    beerCans = drinkersCount * finalCansPerDrinker;
    beerLiters = Number(((beerCans * 0.35)).toFixed(1));
  }

  // 4. Suprimentos e Carvão
  // Carvão: 1.1kg de carvão para cada 1kg de carne assada (mínimo 3kg para acender a brasa)
  const charcoalKgNeeded = totalMeatKg > 0 ? Math.max(3, Math.ceil(totalMeatKg * 1.1)) : 0;
  const charcoalBags = Math.ceil(charcoalKgNeeded / 5); // Sacos de 5kg ou 3kg
  const charcoalKgPractical = charcoalBags * 5;

  // Gelo: 1 saco de 5kg para cada 8 a 10 pessoas (duplica se calor ou duração longa)
  const iceBags = totalPeople > 0
    ? Math.max(1, Math.ceil((totalPeople / (config.climate === 'quente' ? 6 : 9)) * (duration > 5 ? 1.3 : 1.0)))
    : 0;

  // Montagem da lista de itens com suporte a preços pré-existentes ou preservados
  const existingPriceMap = new Map<string, number | null>();
  const existingIncludedMap = new Map<string, boolean>();
  const existingPurchasedMap = new Map<string, boolean>();

  if (currentItems) {
    currentItems.forEach((it) => {
      existingPriceMap.set(it.id, it.pricePerUnit);
      existingIncludedMap.set(it.id, it.included);
      existingPurchasedMap.set(it.id, it.purchased ?? false);
    });
  }

  const getPrice = (id: string): number | null => {
    return existingPriceMap.has(id) ? (existingPriceMap.get(id) ?? null) : null;
  };

  const getIncluded = (id: string, defaultVal: boolean): boolean => {
    return existingIncludedMap.has(id) ? (existingIncludedMap.get(id) ?? defaultVal) : defaultVal;
  };

  const getPurchased = (id: string): boolean => {
    return existingPurchasedMap.get(id) ?? false;
  };

  const items: CalculatedItem[] = [
    // Carnes
    {
      id: 'carne_bovina',
      name: 'Carne Bovina (Picanha / Alcatra / Fraldinha)',
      category: 'carnes',
      quantity: beefKg,
      unit: 'kg',
      practicalQuantity: Math.ceil(beefKg * 10) / 10,
      pricePerUnit: getPrice('carne_bovina'),
      note: '50% do total de carnes. Cortes nobres ou selecionados para a grelha.',
      included: getIncluded('carne_bovina', true),
      purchased: getPurchased('carne_bovina'),
    },
    {
      id: 'linguica',
      name: 'Linguiça Toscana / Pernil',
      category: 'carnes',
      quantity: sausageKg,
      unit: 'kg',
      practicalQuantity: Math.ceil(sausageKg * 10) / 10,
      pricePerUnit: getPrice('linguica'),
      note: '20% do total de carnes. Ideal para servir de entrada e petisco.',
      included: getIncluded('linguica', true),
      purchased: getPurchased('linguica'),
    },
    {
      id: 'frango',
      name: 'Frango (Meio da Asa / Coxinha / Sobrecoxa)',
      category: 'carnes',
      quantity: chickenKg,
      unit: 'kg',
      practicalQuantity: Math.ceil(chickenKg * 10) / 10,
      pricePerUnit: getPrice('frango'),
      note: '15% do total de carnes. Muito apreciado por crianças e adultos.',
      included: getIncluded('frango', true),
      purchased: getPurchased('frango'),
    },
    {
      id: 'carne_suina',
      name: 'Carne Suína (Costelinha / Lombo)',
      category: 'carnes',
      quantity: porkKg,
      unit: 'kg',
      practicalQuantity: Math.ceil(porkKg * 10) / 10,
      pricePerUnit: getPrice('carne_suina'),
      note: '15% do total de carnes. Costelinha marinada na brasa fica suculenta.',
      included: getIncluded('carne_suina', true),
      purchased: getPurchased('carne_suina'),
    },

    // Acompanhamentos
    {
      id: 'pao_alho',
      name: 'Pão de Alho Tradicional',
      category: 'acompanhamentos',
      quantity: garlicBreadUnits,
      unit: 'un (ou pct)',
      practicalQuantity: garlicBreadPacks,
      pricePerUnit: getPrice('pao_alho'),
      note: `${garlicBreadUnits} unidades (~${garlicBreadPacks} pacotes com 5 un).`,
      included: getIncluded('pao_alho', config.hasSideDishes),
      purchased: getPurchased('pao_alho'),
    },
    {
      id: 'farofa',
      name: 'Farofa Pronta Temperada',
      category: 'acompanhamentos',
      quantity: farofaKg,
      unit: 'kg',
      practicalQuantity: farofaPacks,
      pricePerUnit: getPrice('farofa'),
      note: `Aprox. ${farofaPacks} pacote(s) de 500g.`,
      included: getIncluded('farofa', config.hasSideDishes),
      purchased: getPurchased('farofa'),
    },
    {
      id: 'vinagrete',
      name: 'Vinagrete (Tomate, Cebola e Temperos)',
      category: 'acompanhamentos',
      quantity: vinaigretteKg,
      unit: 'kg',
      practicalQuantity: Math.ceil(vinaigretteKg * 10) / 10,
      pricePerUnit: getPrice('vinagrete'),
      note: 'Molho fresco com tomate picadinho, cebola, azeite e vinagre.',
      included: getIncluded('vinagrete', config.hasSideDishes),
      purchased: getPurchased('vinagrete'),
    },
    {
      id: 'arroz',
      name: 'Arroz Branco (grão cru)',
      category: 'acompanhamentos',
      quantity: riceKg,
      unit: 'kg',
      practicalQuantity: Math.max(1, Math.ceil(riceKg)),
      pricePerUnit: getPrice('arroz'),
      note: 'Rende o triplo após o cozimento (~120g cozido/pessoa).',
      included: getIncluded('arroz', config.hasSideDishes),
      purchased: getPurchased('arroz'),
    },
    {
      id: 'queijo_coalho',
      name: 'Queijo para Grelhar (Coalho)',
      category: 'acompanhamentos',
      quantity: cheeseUnits,
      unit: 'espetos',
      practicalQuantity: cheesePacks,
      pricePerUnit: getPrice('queijo_coalho'),
      note: 'Item opcional. Pacotes comerciais com 7 espetos.',
      isOptional: true,
      included: getIncluded('queijo_coalho', false), // Por padrão opcional
      purchased: getPurchased('queijo_coalho'),
    },

    // Bebidas
    {
      id: 'agua',
      name: 'Água Mineral (com ou sem gás)',
      category: 'bebidas',
      quantity: waterLiters,
      unit: 'litros',
      practicalQuantity: Math.ceil(waterLiters / 1.5) * 1.5, // Garrafas de 1.5L
      pricePerUnit: getPrice('agua'),
      note: `Equivalente a aprox. ${Math.ceil(waterLiters / 1.5)} garrafas de 1.5L.`,
      included: getIncluded('agua', true),
      purchased: getPurchased('agua'),
    },
    {
      id: 'refrigerante',
      name: 'Refrigerante e Sucos',
      category: 'bebidas',
      quantity: sodaLiters,
      unit: 'litros',
      practicalQuantity: Math.ceil(sodaLiters / 2) * 2, // Garrafas de 2L
      pricePerUnit: getPrice('refrigerante'),
      note: `Equivalente a aprox. ${Math.ceil(sodaLiters / 2)} garrafas pet de 2L.`,
      included: getIncluded('refrigerante', true),
      purchased: getPurchased('refrigerante'),
    },
  ];

  if (config.hasAlcohol) {
    items.push({
      id: 'cerveja',
      name: 'Cerveja (Latas 350ml / Packs)',
      category: 'bebidas',
      quantity: beerCans,
      unit: 'latas',
      practicalQuantity: Math.ceil(beerCans / 12) * 12, // Packs com 12 latas
      pricePerUnit: getPrice('cerveja'),
      note: `${beerCans} latas (~${Math.ceil(beerCans / 12)} fardos de 12 latas). Aprox. ${beerLiters}L no total.`,
      included: getIncluded('cerveja', true),
      purchased: getPurchased('cerveja'),
    });
  }

  // Suprimentos
  items.push(
    {
      id: 'carvao',
      name: 'Carvão Vegetal para Churrasco',
      category: 'suprimentos',
      quantity: charcoalKgNeeded,
      unit: 'kg',
      practicalQuantity: charcoalKgPractical,
      pricePerUnit: getPrice('carvao'),
      note: `${charcoalBags} saco(s) de 5kg. Regra: ~1.1kg de carvão por kg de carne assada.`,
      included: getIncluded('carvao', true),
      purchased: getPurchased('carvao'),
    },
    {
      id: 'gelo',
      name: 'Gelo em Cubos / Barra',
      category: 'suprimentos',
      quantity: iceBags * 5,
      unit: 'kg',
      practicalQuantity: iceBags,
      pricePerUnit: getPrice('gelo'),
      note: `${iceBags} saco(s) de 5kg para caixas térmicas e copos.`,
      included: getIncluded('gelo', true),
      purchased: getPurchased('gelo'),
    },
    {
      id: 'sal_grosso',
      name: 'Sal Grosso e Temperos Básicos',
      category: 'suprimentos',
      quantity: 1,
      unit: 'pct (1kg)',
      practicalQuantity: 1,
      pricePerUnit: getPrice('sal_grosso'),
      note: '1 pacote de 1kg rende para todo o churrasco.',
      included: getIncluded('sal_grosso', true),
      purchased: getPurchased('sal_grosso'),
    }
  );

  return {
    totalMeatKg,
    meatPerAdultGrams: finalMeatPerAdultGrams,
    meatPerChildGrams: finalMeatPerChildGrams,
    items,
    summary: {
      totalPeople,
      effectiveAdults: adults + (children * 0.5),
      drinksTotalLiters: Number((waterLiters + sodaLiters + beerLiters).toFixed(1)),
      beerTotalLiters: beerLiters,
      charcoalKg: charcoalKgPractical,
    },
  };
}

/**
 * Calcula os custos totais e as divisões da conta.
 * Regra: se algum preço não for informado (null ou undefined),
 * não inventa preço e calcula apenas os que foram preenchidos!
 */
export function calculateCosts(
  items: CalculatedItem[],
  adultsCount: number,
  childrenCount: number,
  drinkersPercent: number = 80
): CostSummary {
  const activeItems = items.filter((i) => i.included);
  let totalCost = 0;
  let itemsWithPrice = 0;
  let unpricedItemsCount = 0;
  let beerTotalCost = 0;

  activeItems.forEach((item) => {
    if (item.pricePerUnit !== null && item.pricePerUnit !== undefined && !isNaN(item.pricePerUnit) && item.pricePerUnit > 0) {
      itemsWithPrice++;
      // Usar a quantidade comercial/prática para itens por pacote/lata/saco, ou quantidade real para kg
      const qty = item.unit.includes('pct') || item.unit === 'latas' || item.unit.includes('saco') || item.unit === 'espetos'
        ? item.practicalQuantity
        : item.quantity;

      const itemCost = qty * item.pricePerUnit;
      totalCost += itemCost;

      if (item.id === 'cerveja') {
        beerTotalCost += itemCost;
      }
    } else {
      unpricedItemsCount++;
    }
  });

  const totalPeople = Math.max(0, adultsCount + childrenCount);
  const adults = Math.max(0, adultsCount);

  // Evitar divisão por zero rigorosamente
  const costPerPerson = totalPeople > 0 ? Number((totalCost / totalPeople).toFixed(2)) : 0;
  const costPerAdult = adults > 0 ? Number((totalCost / adults).toFixed(2)) : 0;

  // Bebedores de cerveja: se a cerveja for separada dos não bebedores
  const drinkersCount = Math.max(1, Math.round(adults * (drinkersPercent / 100)));
  const foodAndSuppliesCost = totalCost - beerTotalCost;
  const costPerNonDrinker = adults > 0 ? Number((foodAndSuppliesCost / adults).toFixed(2)) : 0;
  const costPerDrinker = drinkersCount > 0
    ? Number((costPerNonDrinker + (beerTotalCost / drinkersCount)).toFixed(2))
    : costPerAdult;

  return {
    itemsWithPrice,
    itemsTotal: activeItems.length,
    totalCost: Number(totalCost.toFixed(2)),
    costPerPerson,
    costPerAdult,
    costPerBeerDrinker: costPerDrinker,
    unpricedItemsCount,
  };
}

/**
 * Formata valores monetários brasileiros com segurança: "R$ 45,90"
 */
export function formatCurrencyBRL(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return 'Preço não informado';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Sugestões de preços médios de mercado de referência
 * (o usuário pode acionar com 1 toque se quiser preencher todos rapidamente)
 */
export const MARKET_PRICE_SUGGESTIONS: Record<string, number> = {
  carne_bovina: 49.90,     // R$/kg
  linguica: 24.90,         // R$/kg
  frango: 18.90,           // R$/kg
  carne_suina: 28.90,      // R$/kg
  pao_alho: 14.50,         // R$/pct
  farofa: 8.50,            // R$/pct
  vinagrete: 12.00,        // R$/kg
  arroz: 6.50,             // R$/kg
  queijo_coalho: 22.00,    // R$/pct
  agua: 4.50,              // R$/garrafa 1.5L
  refrigerante: 9.50,      // R$/garrafa 2L
  cerveja: 4.20,           // R$/lata
  carvao: 26.00,           // R$/saco 5kg
  gelo: 12.00,             // R$/saco 5kg
  sal_grosso: 4.00,        // R$/pct 1kg
};

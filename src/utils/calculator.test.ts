import { calculateChurrasco, calculateCosts, DEFAULT_CONFIG } from './calculator';
import { CalculatedItem, ChurrascoConfig } from '../types';

export interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

export function runCalculatorUnitTests(): TestResult[] {
  const results: TestResult[] = [];

  // Test 1: Cálculo de carnes com 10 adultos e 2 crianças (4 horas, tradicional, com acompanhamentos)
  try {
    const res = calculateChurrasco(DEFAULT_CONFIG);
    const expectedApproxMin = 3.5;
    const expectedApproxMax = 5.5;
    const passed = res.totalMeatKg >= expectedApproxMin && res.totalMeatKg <= expectedApproxMax;
    results.push({
      name: 'Cálculo de carnes tradicional (10 adultos, 2 crianças)',
      passed,
      message: `Total calculado: ${res.totalMeatKg} kg (Esperado entre ${expectedApproxMin} e ${expectedApproxMax} kg).`,
    });
  } catch (err: unknown) {
    results.push({
      name: 'Cálculo de carnes tradicional (10 adultos, 2 crianças)',
      passed: false,
      message: err instanceof Error ? err.message : String(err),
    });
  }

  // Test 2: Soma exata das proporções de carne deve ser 100% do total
  try {
    const res = calculateChurrasco(DEFAULT_CONFIG);
    const beef = res.items.find((i) => i.id === 'carne_bovina')?.quantity || 0;
    const sausage = res.items.find((i) => i.id === 'linguica')?.quantity || 0;
    const chicken = res.items.find((i) => i.id === 'frango')?.quantity || 0;
    const pork = res.items.find((i) => i.id === 'carne_suina')?.quantity || 0;
    const sum = Number((beef + sausage + chicken + pork).toFixed(2));
    const passed = Math.abs(sum - res.totalMeatKg) < 0.05;
    results.push({
      name: 'Proporções de carnes somam 100% (bovina 50%, linguiça 20%, frango 15%, suína 15%)',
      passed,
      message: `Soma das carnes: ${sum} kg vs Total: ${res.totalMeatKg} kg.`,
    });
  } catch (err: unknown) {
    results.push({
      name: 'Proporções de carnes somam 100%',
      passed: false,
      message: err instanceof Error ? err.message : String(err),
    });
  }

  // Test 3: Bebidas alcoólicas desativadas
  try {
    const noAlcoholConfig: ChurrascoConfig = { ...DEFAULT_CONFIG, hasAlcohol: false };
    const res = calculateChurrasco(noAlcoholConfig);
    const beerItem = res.items.find((i) => i.id === 'cerveja');
    const passed = beerItem === undefined;
    results.push({
      name: 'Exclusão de cerveja quando "hasAlcohol" é falso',
      passed,
      message: passed ? 'Cerveja não consta na lista quando desativada.' : 'Cerveja foi incluída indevidamente.',
    });
  } catch (err: unknown) {
    results.push({
      name: 'Exclusão de cerveja quando "hasAlcohol" é falso',
      passed: false,
      message: err instanceof Error ? err.message : String(err),
    });
  }

  // Test 4: Ajuste por clima quente (aumento de consumo de bebidas)
  try {
    const mild = calculateChurrasco({ ...DEFAULT_CONFIG, climate: 'ameno' });
    const hot = calculateChurrasco({ ...DEFAULT_CONFIG, climate: 'quente' });
    const waterMild = mild.items.find((i) => i.id === 'agua')?.quantity || 0;
    const waterHot = hot.items.find((i) => i.id === 'agua')?.quantity || 0;
    const passed = waterHot > waterMild;
    results.push({
      name: 'Ajuste de consumo para ambiente quente (mais líquidos e gelo)',
      passed,
      message: `Água no clima ameno: ${waterMild}L vs clima quente: ${waterHot}L.`,
    });
  } catch (err: unknown) {
    results.push({
      name: 'Ajuste de consumo para ambiente quente',
      passed: false,
      message: err instanceof Error ? err.message : String(err),
    });
  }

  // Test 5: Caso limite - zero crianças
  try {
    const noKidsConfig: ChurrascoConfig = { ...DEFAULT_CONFIG, adults: 5, children: 0 };
    const res = calculateChurrasco(noKidsConfig);
    const passed = !isNaN(res.totalMeatKg) && res.totalMeatKg > 0;
    results.push({
      name: 'Caso com zero crianças',
      passed,
      message: `Cálculo com 5 adultos e 0 crianças executou sem erros: ${res.totalMeatKg} kg de carne.`,
    });
  } catch (err: unknown) {
    results.push({
      name: 'Caso com zero crianças',
      passed: false,
      message: err instanceof Error ? err.message : String(err),
    });
  }

  // Test 6: Caso limite - zero adultos (apenas crianças)
  try {
    const onlyKidsConfig: ChurrascoConfig = { ...DEFAULT_CONFIG, adults: 0, children: 6 };
    const res = calculateChurrasco(onlyKidsConfig);
    const beerItem = res.items.find((i) => i.id === 'cerveja');
    const passed = !isNaN(res.totalMeatKg) && res.totalMeatKg > 0 && (beerItem?.quantity || 0) === 0;
    results.push({
      name: 'Caso com apenas crianças (zero adultos)',
      passed,
      message: `Cerveja é 0 e carne é calculada para as crianças: ${res.totalMeatKg} kg.`,
    });
  } catch (err: unknown) {
    results.push({
      name: 'Caso com apenas crianças',
      passed: false,
      message: err instanceof Error ? err.message : String(err),
    });
  }

  // Test 7: Custos e itens sem preço (não deve inventar valores e previne NaN)
  try {
    const sampleItems: CalculatedItem[] = [
      {
        id: 'carne_bovina',
        name: 'Carne Bovina',
        category: 'carnes',
        quantity: 2.0,
        unit: 'kg',
        practicalQuantity: 2.0,
        pricePerUnit: 50.0, // R$ 100,00
        included: true,
      },
      {
        id: 'linguica',
        name: 'Linguiça',
        category: 'carnes',
        quantity: 1.0,
        unit: 'kg',
        practicalQuantity: 1.0,
        pricePerUnit: null, // Sem preço!
        included: true,
      },
      {
        id: 'pao_alho',
        name: 'Pão de Alho',
        category: 'acompanhamentos',
        quantity: 2,
        unit: 'pct',
        practicalQuantity: 2,
        pricePerUnit: 15.0, // R$ 30,00
        included: true,
      },
    ];

    const costSummary = calculateCosts(sampleItems, 4, 1);
    const expectedTotal = 130.0; // 100 + 30
    const passed =
      Math.abs(costSummary.totalCost - expectedTotal) < 0.01 &&
      costSummary.unpricedItemsCount === 1 &&
      costSummary.costPerAdult === 32.5 && // 130 / 4
      costSummary.costPerPerson === 26.0; // 130 / 5

    results.push({
      name: 'Cálculo de custos com itens não precificados e rateio correto',
      passed,
      message: `Total R$ ${costSummary.totalCost} (Esperado R$ 130,00), 1 item sem preço, R$ ${costSummary.costPerAdult}/adulto.`,
    });
  } catch (err: unknown) {
    results.push({
      name: 'Cálculo de custos com itens não precificados',
      passed: false,
      message: err instanceof Error ? err.message : String(err),
    });
  }

  // Test 8: Prevenção rigorosa de divisão por zero na divisão de custos
  try {
    const sampleItems: CalculatedItem[] = [
      {
        id: 'carne_bovina',
        name: 'Carne Bovina',
        category: 'carnes',
        quantity: 2.0,
        unit: 'kg',
        practicalQuantity: 2.0,
        pricePerUnit: 50.0,
        included: true,
      },
    ];
    const zeroPeopleCost = calculateCosts(sampleItems, 0, 0);
    const passed =
      !isNaN(zeroPeopleCost.costPerPerson) &&
      !isNaN(zeroPeopleCost.costPerAdult) &&
      isFinite(zeroPeopleCost.costPerPerson) &&
      isFinite(zeroPeopleCost.costPerAdult);
    results.push({
      name: 'Prevenção de divisão por zero (0 adultos, 0 crianças)',
      passed,
      message: `Valores são números finitos e seguros (R$ ${zeroPeopleCost.costPerPerson}).`,
    });
  } catch (err: unknown) {
    results.push({
      name: 'Prevenção de divisão por zero',
      passed: false,
      message: err instanceof Error ? err.message : String(err),
    });
  }

  return results;
}

import { ChurrascoConfig, CalculationResult, CostSummary } from '../types';
import { formatCurrencyBRL } from './calculator';

export function renderInstagramStory(
  canvas: HTMLCanvasElement,
  config: ChurrascoConfig,
  calculation: CalculationResult,
  costs: CostSummary
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = 1080;
  const height = 1920;
  canvas.width = width;
  canvas.height = height;

  // 1. Fundo Gradiente Escuro Grafite & Brasa
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#101012');
  bgGrad.addColorStop(0.4, '#18181D');
  bgGrad.addColorStop(0.8, '#241410');
  bgGrad.addColorStop(1, '#120D0A');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Efeito de Brasa & Brasas Cintilantes (Sparks/Embers)
  ctx.save();
  for (let i = 0; i < 45; i++) {
    const x = Math.random() * width;
    const y = height - Math.random() * 850;
    const r = Math.random() * 4 + 1.5;
    const alpha = Math.random() * 0.7 + 0.2;
    const sparkGrad = ctx.createRadialGradient(x, y, 0, x, y, r * 2.5);
    sparkGrad.addColorStop(0, `rgba(255, 120, 40, ${alpha})`);
    sparkGrad.addColorStop(1, 'rgba(255, 50, 0, 0)');
    ctx.fillStyle = sparkGrad;
    ctx.beginPath();
    ctx.arc(x, y, r * 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Glow inferior de brasa
  const glowGrad = ctx.createRadialGradient(width / 2, height - 100, 50, width / 2, height - 100, 750);
  glowGrad.addColorStop(0, 'rgba(255, 87, 34, 0.35)');
  glowGrad.addColorStop(0.5, 'rgba(220, 38, 38, 0.15)');
  glowGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, height - 900, width, 900);

  // 3. Header & Badge
  let currentY = 140;

  // Badge do App
  ctx.fillStyle = 'rgba(255, 87, 34, 0.2)';
  roundRect(ctx, 340, currentY - 40, 400, 64, 32);
  ctx.fill();
  ctx.strokeStyle = '#FF5722';
  ctx.lineWidth = 2;
  roundRect(ctx, 340, currentY - 40, 400, 64, 32);
  ctx.stroke();

  ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#FF7043';
  ctx.textAlign = 'center';
  ctx.fillText('🔥 CHURRASCO CALCULADO', width / 2, currentY + 3);

  currentY += 90;

  // Nome do Evento
  ctx.font = '800 64px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(config.eventName || 'Churrasco com a Galera', width / 2, currentY);

  currentY += 60;

  // Detalhes dos Convidados
  ctx.font = '500 32px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#A1A1AA';
  const profileLabel = config.profile === 'caprichado' ? 'Caprichado 🥩' : config.profile === 'economico' ? 'Econômico 💰' : 'Tradicional 🥓';
  const subtitle = `${config.adults} Adultos • ${config.children} Crianças • ${config.durationHours}h • ${profileLabel}`;
  ctx.fillText(subtitle, width / 2, currentY);

  currentY += 80;

  // 4. Cards Principais (Grid de 2 colunas)
  const cardW = 440;
  const cardH = 210;
  const leftX = 80;
  const rightX = 560;

  // Card 1: Total de Carnes
  drawStoryCard(
    ctx,
    leftX,
    currentY,
    cardW,
    cardH,
    '🥩 TOTAL DE CARNES',
    `${calculation.totalMeatKg} kg`,
    `~${calculation.meatPerAdultGrams}g por adulto`,
    '#FF5722'
  );

  // Card 2: Bebidas Alcoólicas / Cerveja ou Refrigerante
  const beerItem = calculation.items.find((i) => i.id === 'cerveja');
  const drinksTitle = beerItem ? '🍺 CERVEJA ESTIMADA' : '🥤 BEBIDAS TOTAIS';
  const drinksVal = beerItem ? `${beerItem.quantity} latas` : `${calculation.summary.drinksTotalLiters} L`;
  const drinksSub = beerItem ? `~${calculation.summary.beerTotalLiters}L de ceva gelada` : 'Água e refrigerantes';
  drawStoryCard(
    ctx,
    rightX,
    currentY,
    cardW,
    cardH,
    drinksTitle,
    drinksVal,
    drinksSub,
    '#F59E0B'
  );

  currentY += cardH + 40;

  // Card 3: Carvão & Gelo
  const iceItem = calculation.items.find((i) => i.id === 'gelo');
  drawStoryCard(
    ctx,
    leftX,
    currentY,
    cardW,
    cardH,
    '🔥 CARVÃO & BRASA',
    `${calculation.summary.charcoalKg} kg`,
    `+ ${iceItem ? iceItem.practicalQuantity : 2} sacos de gelo`,
    '#EF4444'
  );

  // Card 4: Custo ou Rateio por Pessoa
  const costVal = costs.totalCost > 0 ? formatCurrencyBRL(costs.costPerAdult) : 'A definir';
  const costSub = costs.totalCost > 0 ? `Total: ${formatCurrencyBRL(costs.totalCost)}` : 'Custos calculáveis no app';
  drawStoryCard(
    ctx,
    rightX,
    currentY,
    cardW,
    cardH,
    '💰 VALOR POR ADULTO',
    costVal,
    costSub,
    '#10B981'
  );

  currentY += cardH + 60;

  // 5. Card de Destaque com o Mix de Carnes
  ctx.fillStyle = 'rgba(24, 24, 27, 0.85)';
  roundRect(ctx, leftX, currentY, 920, 390, 28);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 87, 34, 0.4)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, leftX, currentY, 920, 390, 28);
  ctx.stroke();

  // Header do Mix
  ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#FF7043';
  ctx.textAlign = 'left';
  ctx.fillText('🥩 PROPORÇÃO DAS CARNES SELECIONADAS', leftX + 40, currentY + 60);

  const meatItems = calculation.items.filter((i) => i.category === 'carnes');
  const meatYStart = currentY + 120;

  meatItems.forEach((meat, idx) => {
    const yPos = meatYStart + idx * 60;
    const percent = idx === 0 ? '50%' : idx === 1 ? '20%' : '15%';

    ctx.font = '600 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#F4F4F5';
    ctx.textAlign = 'left';
    ctx.fillText(`${meat.name.split('(')[0].trim()}`, leftX + 45, yPos);

    ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#FFA726';
    ctx.textAlign = 'right';
    ctx.fillText(`${meat.quantity} kg (${percent})`, leftX + 875, yPos);
  });

  currentY += 440;

  // 6. Acompanhamentos e extras rápidos
  ctx.fillStyle = 'rgba(24, 24, 27, 0.7)';
  roundRect(ctx, leftX, currentY, 920, 160, 24);
  ctx.fill();
  ctx.strokeStyle = 'rgba(63, 63, 70, 0.6)';
  ctx.lineWidth = 1;
  roundRect(ctx, leftX, currentY, 920, 160, 24);
  ctx.stroke();

  ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#A1A1AA';
  ctx.textAlign = 'center';
  const garlicBread = calculation.items.find((i) => i.id === 'pao_alho');
  const sidesText = `🥖 ${garlicBread ? garlicBread.quantity : 0} Pães de Alho  •  🥗 Vinagrete & Farofa  •  🧊 Gelo para conservação`;
  ctx.fillText(sidesText, width / 2, currentY + 65);

  ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#71717A';
  ctx.fillText('Planejado para não faltar nem sobrar comida.', width / 2, currentY + 110);

  // 7. Rodapé com branding do aplicativo
  ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#FF5722';
  ctx.textAlign = 'center';
  ctx.fillText('APP CHURRASCO CALCULADO', width / 2, height - 100);

  ctx.font = '400 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#71717A';
  ctx.fillText('100% Offline • Sem Cadastro • Cálculos Transparentes', width / 2, height - 65);
}

function drawStoryCard(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  value: string,
  sub: string,
  accentColor: string
) {
  ctx.fillStyle = 'rgba(24, 24, 27, 0.9)';
  roundRect(ctx, x, y, w, h, 24);
  ctx.fill();

  ctx.strokeStyle = 'rgba(63, 63, 70, 0.7)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, x, y, w, h, 24);
  ctx.stroke();

  // Borda colorida de acento superior
  ctx.fillStyle = accentColor;
  roundRect(ctx, x, y, w, 6, 3);
  ctx.fill();

  // Título
  ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = accentColor;
  ctx.textAlign = 'left';
  ctx.fillText(title, x + 30, y + 45);

  // Valor
  ctx.font = '800 48px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(value, x + 30, y + 115);

  // Subtítulo
  ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#A1A1AA';
  ctx.fillText(sub, x + 30, y + 165);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

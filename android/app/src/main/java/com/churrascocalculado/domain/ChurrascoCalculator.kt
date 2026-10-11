package com.churrascocalculado.domain

import kotlin.math.ceil
import kotlin.math.max
import kotlin.math.min
import kotlin.math.roundToInt

enum class ChurrascoProfile { ECONOMICO, TRADICIONAL, CAPRICHADO }
enum class ClimateType { AMENO, QUENTE }

data class ChurrascoConfig(
    val eventName: String = "Churrasco com a Galera",
    val adults: Int = 10,
    val children: Int = 2,
    val durationHours: Int = 4,
    val profile: ChurrascoProfile = ChurrascoProfile.TRADICIONAL,
    val hasSideDishes: Boolean = true,
    val hasAlcohol: Boolean = true,
    val climate: ClimateType = ClimateType.AMENO,
    val drinkersPercent: Int = 80
)

data class CalculatedItem(
    val id: String,
    val name: String,
    val category: String,
    val quantity: Double,
    val unit: String,
    val practicalQuantity: Double,
    val pricePerUnit: Double? = null,
    val note: String = "",
    val isOptional: Boolean = false,
    val isIncluded: Boolean = true
)

data class CalculationResult(
    val totalMeatKg: Double,
    val meatPerAdultGrams: Int,
    val meatPerChildGrams: Int,
    val items: List<CalculatedItem>
)

object ChurrascoCalculator {
    fun calculate(config: ChurrascoConfig): CalculationResult {
        val adults = max(0, config.adults)
        val children = max(0, config.children)
        val totalPeople = adults + children
        val duration = max(1, min(12, config.durationHours))

        // 1. Gramas base por adulto
        var baseAdultGrams = when (config.profile) {
            ChurrascoProfile.ECONOMICO -> 370.0
            ChurrascoProfile.TRADICIONAL -> 420.0
            ChurrascoProfile.CAPRICHADO -> 490.0
        }

        // Ajuste por acompanhamentos
        if (config.hasSideDishes) {
            baseAdultGrams *= 0.88
        } else {
            baseAdultGrams *= 1.08
        }

        // Fator por duração (base 4h)
        val durationFactor = max(0.75, min(1.5, 1.0 + (duration - 4) * 0.07))
        val finalMeatPerAdult = (baseAdultGrams * durationFactor).roundToInt()
        val finalMeatPerChild = (finalMeatPerAdult * 0.5).roundToInt()

        val totalMeatKg = if (totalPeople > 0) {
            ((adults * finalMeatPerAdult + children * finalMeatPerChild) / 1000.0)
        } else 0.0

        val roundedTotalMeatKg = (totalMeatKg * 100.0).roundToInt() / 100.0

        // Proporções exatas de carne: 50% bovina, 20% linguiça, 15% frango, 15% suína
        val beefKg = (roundedTotalMeatKg * 0.50 * 100.0).roundToInt() / 100.0
        val sausageKg = (roundedTotalMeatKg * 0.20 * 100.0).roundToInt() / 100.0
        val chickenKg = (roundedTotalMeatKg * 0.15 * 100.0).roundToInt() / 100.0
        val porkKg = max(0.0, ((roundedTotalMeatKg - (beefKg + sausageKg + chickenKg)) * 100.0).roundToInt() / 100.0)

        // Carvão: 1.1kg por kg de carne assada
        val charcoalKg = if (roundedTotalMeatKg > 0) max(3, ceil(roundedTotalMeatKg * 1.1).toInt()) else 0
        val charcoalBags = ceil(charcoalKg / 5.0).toInt()

        // Bebidas
        val climateMultiplier = if (config.climate == ClimateType.QUENTE) 1.35 else 1.0
        val waterLiters = if (totalPeople > 0) (totalPeople * 0.45 * climateMultiplier) else 0.0
        val sodaLiters = if (totalPeople > 0) (totalPeople * 0.55 * climateMultiplier) else 0.0

        val items = mutableListOf<CalculatedItem>()
        // Carnes
        items.add(CalculatedItem("bovina", "Carne Bovina (Picanha/Alcatra/Fraldinha)", "carnes", beefKg, "kg", beefKg, note = "50% do total de carnes"))
        items.add(CalculatedItem("linguica", "Linguiça Toscana / Pernil", "carnes", sausageKg, "kg", sausageKg, note = "20% do total"))
        items.add(CalculatedItem("frango", "Frango (Asa / Coxinha)", "carnes", chickenKg, "kg", chickenKg, note = "15% do total"))
        items.add(CalculatedItem("suina", "Carne Suína (Costelinha)", "carnes", porkKg, "kg", porkKg, note = "15% do total"))

        // Acompanhamentos
        if (config.hasSideDishes && totalPeople > 0) {
            val breadUnits = ceil(adults * 1.5 + children * 1.0).toInt()
            val breadPacks = ceil(breadUnits / 5.0).toInt()
            items.add(CalculatedItem("pao_alho", "Pão de Alho Tradicional", "acompanhamentos", breadUnits.toDouble(), "un", breadPacks.toDouble(), note = "$breadUnits unidades (~$breadPacks pct)"))
            items.add(CalculatedItem("farofa", "Farofa Pronta", "acompanhamentos", (totalPeople * 0.035), "kg", ceil((totalPeople * 0.035) / 0.5), note = "Pacotes de 500g"))
            items.add(CalculatedItem("vinagrete", "Vinagrete", "acompanhamentos", (totalPeople * 0.045), "kg", (totalPeople * 0.045)))
            items.add(CalculatedItem("arroz", "Arroz Branco", "acompanhamentos", (totalPeople * 0.040), "kg", max(1.0, ceil(totalPeople * 0.04))))
        }

        // Bebidas
        items.add(CalculatedItem("agua", "Água Mineral", "bebidas", waterLiters, "litros", ceil(waterLiters / 1.5) * 1.5))
        items.add(CalculatedItem("refrigerante", "Refrigerante e Sucos", "bebidas", sodaLiters, "litros", ceil(sodaLiters / 2.0) * 2.0))

        if (config.hasAlcohol && adults > 0) {
            val drinkers = max(1, (adults * (config.drinkersPercent / 100.0)).roundToInt())
            val cansPerDrinker = ceil((4.0 + (duration - 4) * 0.8) * (if (config.climate == ClimateType.QUENTE) 1.25 else 1.0)).toInt()
            val totalBeerCans = drinkers * cansPerDrinker
            items.add(CalculatedItem("cerveja", "Cerveja (Latas 350ml)", "bebidas", totalBeerCans.toDouble(), "latas", (ceil(totalBeerCans / 12.0) * 12).toDouble(), note = "$totalBeerCans latas (~${ceil(totalBeerCans / 12.0).toInt()} packs)"))
        }

        // Suprimentos
        items.add(CalculatedItem("carvao", "Carvão Vegetal", "suprimentos", charcoalKg.toDouble(), "kg", (charcoalBags * 5).toDouble(), note = "$charcoalBags sacos de 5kg"))
        val iceBags = max(1, ceil(totalPeople / (if (config.climate == ClimateType.QUENTE) 6.0 else 9.0)).toInt())
        items.add(CalculatedItem("gelo", "Gelo em Cubos", "suprimentos", (iceBags * 5).toDouble(), "kg", iceBags.toDouble(), note = "$iceBags sacos de 5kg"))

        return CalculationResult(
            totalMeatKg = roundedTotalMeatKg,
            meatPerAdultGrams = finalMeatPerAdult,
            meatPerChildGrams = finalMeatPerChild,
            items = items
        )
    }
}

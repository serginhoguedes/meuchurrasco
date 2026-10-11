package com.churrascocalculado

import com.churrascocalculado.domain.ChurrascoCalculator
import com.churrascocalculado.domain.ChurrascoConfig
import com.churrascocalculado.domain.ChurrascoProfile
import com.churrascocalculado.domain.ClimateType
import org.junit.Assert.*
import org.junit.Test

class ChurrascoCalculatorTest {

    @Test
    fun testMeatCalculationDefault() {
        val config = ChurrascoConfig(adults = 10, children = 2)
        val result = ChurrascoCalculator.calculate(config)

        assertTrue("Total de carne deve ser positivo", result.totalMeatKg > 0.0)
        assertTrue("Total de carne razoável para 10 adultos e 2 crianças", result.totalMeatKg in 3.5..5.5)
    }

    @Test
    fun testMeatProportionsSumUp() {
        val config = ChurrascoConfig(adults = 8, children = 3)
        val result = ChurrascoCalculator.calculate(config)

        val beef = result.items.find { it.id == "bovina" }?.quantity ?: 0.0
        val sausage = result.items.find { it.id == "linguica" }?.quantity ?: 0.0
        val chicken = result.items.find { it.id == "frango" }?.quantity ?: 0.0
        val pork = result.items.find { it.id == "suina" }?.quantity ?: 0.0

        val sum = beef + sausage + chicken + pork
        assertEquals(result.totalMeatKg, sum, 0.05)
    }

    @Test
    fun testNoAlcoholExcludesBeer() {
        val config = ChurrascoConfig(hasAlcohol = false)
        val result = ChurrascoCalculator.calculate(config)

        val beer = result.items.find { it.id == "cerveja" }
        assertNull("Cerveja deve ser nula quando hasAlcohol for falso", beer)
    }

    @Test
    fun testHotClimateIncreasesDrinks() {
        val mild = ChurrascoCalculator.calculate(ChurrascoConfig(climate = ClimateType.AMENO))
        val hot = ChurrascoCalculator.calculate(ChurrascoConfig(climate = ClimateType.QUENTE))

        val waterMild = mild.items.find { it.id == "agua" }?.quantity ?: 0.0
        val waterHot = hot.items.find { it.id == "agua" }?.quantity ?: 0.0

        assertTrue("Clima quente deve consumir mais água", waterHot > waterMild)
    }

    @Test
    fun testZeroChildrenDoesNotFail() {
        val config = ChurrascoConfig(adults = 5, children = 0)
        val result = ChurrascoCalculator.calculate(config)

        assertTrue(result.totalMeatKg > 0)
        assertEquals(5, config.adults)
    }
}

package com.churrascocalculado.ui

import androidx.lifecycle.ViewModel
import com.churrascocalculado.domain.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

data class UiState(
    val config: ChurrascoConfig = ChurrascoConfig(),
    val result: CalculationResult = ChurrascoCalculator.calculate(ChurrascoConfig()),
    val customPrices: Map<String, Double?> = emptyMap(),
    val purchasedIds: Set<String> = emptySet()
)

class ChurrascoViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(UiState())
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()

    fun updateAdults(count: Int) {
        _uiState.update { current ->
            val updatedConfig = current.config.copy(adults = maxOf(0, count))
            current.copy(
                config = updatedConfig,
                result = ChurrascoCalculator.calculate(updatedConfig)
            )
        }
    }

    fun updateChildren(count: Int) {
        _uiState.update { current ->
            val updatedConfig = current.config.copy(children = maxOf(0, count))
            current.copy(
                config = updatedConfig,
                result = ChurrascoCalculator.calculate(updatedConfig)
            )
        }
    }

    fun updateDuration(hours: Int) {
        _uiState.update { current ->
            val updatedConfig = current.config.copy(durationHours = maxOf(1, hours))
            current.copy(
                config = updatedConfig,
                result = ChurrascoCalculator.calculate(updatedConfig)
            )
        }
    }

    fun updateProfile(profile: ChurrascoProfile) {
        _uiState.update { current ->
            val updatedConfig = current.config.copy(profile = profile)
            current.copy(
                config = updatedConfig,
                result = ChurrascoCalculator.calculate(updatedConfig)
            )
        }
    }

    fun toggleSideDishes() {
        _uiState.update { current ->
            val updatedConfig = current.config.copy(hasSideDishes = !current.config.hasSideDishes)
            current.copy(
                config = updatedConfig,
                result = ChurrascoCalculator.calculate(updatedConfig)
            )
        }
    }

    fun toggleAlcohol() {
        _uiState.update { current ->
            val updatedConfig = current.config.copy(hasAlcohol = !current.config.hasAlcohol)
            current.copy(
                config = updatedConfig,
                result = ChurrascoCalculator.calculate(updatedConfig)
            )
        }
    }

    fun setClimate(climate: ClimateType) {
        _uiState.update { current ->
            val updatedConfig = current.config.copy(climate = climate)
            current.copy(
                config = updatedConfig,
                result = ChurrascoCalculator.calculate(updatedConfig)
            )
        }
    }

    fun updatePrice(itemId: String, price: Double?) {
        _uiState.update { current ->
            val updatedPrices = current.customPrices.toMutableMap()
            if (price != null && price > 0) {
                updatedPrices[itemId] = price
            } else {
                updatedPrices.remove(itemId)
            }
            current.copy(customPrices = updatedPrices)
        }
    }

    fun togglePurchased(itemId: String) {
        _uiState.update { current ->
            val updated = current.purchasedIds.toMutableSet()
            if (updated.contains(itemId)) updated.remove(itemId) else updated.add(itemId)
            current.copy(purchasedIds = updated)
        }
    }

    fun generateShareText(): String {
        val s = _uiState.value
        return """
            🔥 *Churrasco: ${s.config.eventName}*
            👥 ${s.config.adults} Adultos, ${s.config.children} Crianças (${s.config.durationHours}h)
            🥩 Total de Carne: ${s.result.totalMeatKg} kg
            
            Itens calculados:
            ${s.result.items.joinToString("\n") { "• ${it.name}: ${it.quantity} ${it.unit}" }}
            
            Calculado com precisão no app Churrasco Calculado (100% Offline)
        """.trimIndent()
    }
}

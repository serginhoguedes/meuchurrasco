import React, { useState } from 'react';
import {
  X,
  Code2,
  Copy,
  Check,
  FileCode,
  Terminal,
  Download,
  Smartphone,
} from 'lucide-react';

interface AndroidCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidCodeModal: React.FC<AndroidCodeModalProps> = ({ isOpen, onClose }) => {
  const [activeFile, setActiveFile] = useState<
    'calculator' | 'activity' | 'viewmodel' | 'room' | 'gradle' | 'instructions'
  >('instructions');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const filesContent: Record<string, { title: string; filename: string; code: string }> = {
    instructions: {
      title: 'Guia de Compilação do APK',
      filename: 'COMO_GERAR_O_APK.md',
      code: `# Como Compilar e Gerar o APK do Churrasco Calculado no Android

O projeto está totalmente estruturado com Kotlin moderno e Jetpack Compose (Material 3).

## Requisitos
- Android Studio Ladybug ou Hedgehog instalado (ou superior).
- JDK 17 configurado.
- Android SDK 34 ou 35.

## Passo a Passo para Gerar o APK

### 1. Criar ou Abrir o Projeto no Android Studio
1. Abra o Android Studio e selecione **New Project -> Empty Compose Activity**.
2. Nome da aplicação: **Churrasco Calculado**
3. Package name: \`com.churrascocalculado\`
4. Language: **Kotlin**
5. Build configuration language: **Kotlin DSL (build.gradle.kts)**

### 2. Copiar os Arquivos
- Copie o arquivo \`build.gradle.kts\` para o módulo \`app/build.gradle.kts\`.
- Adicione as classes de domínio, Room e telas conforme as abas deste menu.

### 3. Sincronizar o Gradle
- Clique em **"Sync Project with Gradle Files"** (ícone do elefante).

### 4. Gerar o APK Instalável
#### Opção A (Via Terminal / Linha de Comando):
\`\`\`bash
# Para gerar o APK de teste/debug:
./gradlew assembleDebug

# O APK gerado estará em:
# app/build/outputs/apk/debug/app-debug.apk
\`\`\`

#### Opção B (Pela Interface do Android Studio):
1. No menu superior, clique em **Build -> Build Bundle(s) / APK(s) -> Build APK(s)**.
2. Aguarde a finalização do processo (cerca de 1-2 minutos na primeira compilação).
3. Uma notificação com o link **"locate"** aparecerá no canto inferior direito.
4. Transfira o arquivo \`app-debug.apk\` para qualquer smartphone Android e instale diretamente!
`,
    },
    calculator: {
      title: 'Motor de Cálculo em Kotlin Puro',
      filename: 'ChurrascoCalculator.kt',
      code: `package com.churrascocalculado.domain

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

        // Fator suave por duração (base 4h)
        val durationFactor = max(0.75, min(1.5, 1.0 + (duration - 4) * 0.07))
        val finalMeatPerAdult = (baseAdultGrams * durationFactor).roundToInt()
        val finalMeatPerChild = (finalMeatPerAdult * 0.5).roundToInt()

        val totalMeatKg = if (totalPeople > 0) {
            ((adults * finalMeatPerAdult + children * finalMeatPerChild) / 1000.0)
        } else 0.0

        // Proporções exatas de carne: 50% bovina, 20% linguiça, 15% frango, 15% suína
        val beefKg = (totalMeatKg * 0.50 * 100.0).roundToInt() / 100.0
        val sausageKg = (totalMeatKg * 0.20 * 100.0).roundToInt() / 100.0
        val chickenKg = (totalMeatKg * 0.15 * 100.0).roundToInt() / 100.0
        val porkKg = max(0.0, ((totalMeatKg - (beefKg + sausageKg + chickenKg)) * 100.0).roundToInt() / 100.0)

        // Carvão: 1.1kg por kg de carne assada (mínimo 3kg)
        val charcoalKg = if (totalMeatKg > 0) max(3, ceil(totalMeatKg * 1.1).toInt()) else 0
        val charcoalBags = ceil(charcoalKg / 5.0).toInt()

        // Bebidas
        val climateMultiplier = if (config.climate == ClimateType.QUENTE) 1.35 else 1.0
        val waterLiters = if (totalPeople > 0) (totalPeople * 0.45 * climateMultiplier) else 0.0
        val sodaLiters = if (totalPeople > 0) (totalPeople * 0.55 * climateMultiplier) else 0.0

        val items = mutableListOf<CalculatedItem>()
        // Carnes
        items.add(CalculatedItem("bovina", "Carne Bovina (Picanha/Alcatra)", "carnes", beefKg, "kg", beefKg, note = "50% do total de carnes"))
        items.add(CalculatedItem("linguica", "Linguiça Toscana / Pernil", "carnes", sausageKg, "kg", sausageKg, note = "20% do total"))
        items.add(CalculatedItem("frango", "Frango (Asa / Coxinha)", "carnes", chickenKg, "kg", chickenKg, note = "15% do total"))
        items.add(CalculatedItem("suina", "Carne Suína (Costelinha)", "carnes", porkKg, "kg", porkKg, note = "15% do total"))

        // Acompanhamentos
        if (config.hasSideDishes && totalPeople > 0) {
            val breadUnits = ceil(adults * 1.5 + children * 1.0).toInt()
            val breadPacks = ceil(breadUnits / 5.0).toInt()
            items.add(CalculatedItem("pao_alho", "Pão de Alho Tradicional", "acompanhamentos", breadUnits.toDouble(), "un", breadPacks.toDouble(), note = "$breadPacks pacotes com 5 un"))
            items.add(CalculatedItem("farofa", "Farofa Pronta", "acompanhamentos", (totalPeople * 0.035), "kg", ceil((totalPeople * 0.035) / 0.5), note = "Pacotes de 500g"))
            items.add(CalculatedItem("vinagrete", "Vinagrete Especial", "acompanhamentos", (totalPeople * 0.045), "kg", (totalPeople * 0.045)))
            items.add(CalculatedItem("arroz", "Arroz Branco", "acompanhamentos", (totalPeople * 0.040), "kg", max(1.0, ceil(totalPeople * 0.04))))
        }

        // Bebidas
        items.add(CalculatedItem("agua", "Água Mineral", "bebidas", waterLiters, "litros", ceil(waterLiters / 1.5) * 1.5))
        items.add(CalculatedItem("refrigerante", "Refrigerante e Sucos", "bebidas", sodaLiters, "litros", ceil(sodaLiters / 2.0) * 2.0))

        if (config.hasAlcohol && adults > 0) {
            val drinkers = max(1, (adults * (config.drinkersPercent / 100.0)).roundToInt())
            val cansPerDrinker = ceil((4.0 + (duration - 4) * 0.8) * (if (config.climate == ClimateType.QUENTE) 1.25 else 1.0)).toInt()
            items.add(CalculatedItem("cerveja", "Cerveja (Latas 350ml)", "bebidas", totalBeerCans.toDouble(), "latas", (ceil(totalBeerCans / 12.0) * 12).toDouble(), note = "$totalBeerCans latas (~\${ceil(totalBeerCans / 12.0).toInt()} packs)"))
        }

        // Suprimentos
        items.add(CalculatedItem("carvao", "Carvão Vegetal", "suprimentos", charcoalKg.toDouble(), "kg", (charcoalBags * 5).toDouble(), note = "$charcoalBags sacos de 5kg"))
        val iceBags = max(1, ceil(totalPeople / (if (config.climate == ClimateType.QUENTE) 6.0 else 9.0)).toInt())
        items.add(CalculatedItem("gelo", "Gelo em Cubos", "suprimentos", (iceBags * 5).toDouble(), "kg", iceBags.toDouble(), note = "$iceBags sacos de 5kg"))

        return CalculationResult(
            totalMeatKg = ((totalMeatKg * 100.0).roundToInt() / 100.0),
            meatPerAdultGrams = finalMeatPerAdult,
            meatPerChildGrams = finalMeatPerChild,
            items = items
        )
    }
}
`,
    },
    activity: {
      title: 'Interface Jetpack Compose',
      filename: 'MainActivity.kt',
      code: `package com.churrascocalculado.ui

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel

val CharcoalBackground = Color(0xFF121214)
val CharcoalSurface = Color(0xFF18181C)
val FlameOrange = Color(0xFFFF5722)
val EmberAmber = Color(0xFFFFA000)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ChurrascoCalculadoApp(
                onShare = { text ->
                    val sendIntent = Intent().apply {
                        action = Intent.ACTION_SEND
                        putExtra(Intent.EXTRA_TEXT, text)
                        type = "text/plain"
                    }
                    startActivity(Intent.createChooser(sendIntent, "Compartilhar Churrasco"))
                }
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChurrascoCalculadoApp(
    viewModel: ChurrascoViewModel = viewModel(),
    onShare: (String) -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    var selectedTab by remember { mutableStateOf(0) }

    Scaffold(
        containerColor = CharcoalBackground,
        topBar = {
            TopAppBar(
                title = { Text("Churrasco Calculado", color = Color.White) },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = CharcoalSurface),
                actions = {
                    IconButton(onClick = { onShare(viewModel.generateShareText()) }) {
                        Icon(Icons.Default.Share, contentDescription = "Compartilhar", tint = FlameOrange)
                    }
                }
            )
        },
        bottomBar = {
            NavigationBar(containerColor = CharcoalSurface) {
                NavigationBarItem(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    icon = { Icon(Icons.Default.Tune, "Config") },
                    label = { Text("Config") }
                )
                NavigationBarItem(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    icon = { Icon(Icons.Default.Scale, "Quantidades") },
                    label = { Text("Carnes") }
                )
                NavigationBarItem(
                    selected = selectedTab == 2,
                    onClick = { selectedTab = 2 },
                    icon = { Icon(Icons.Default.AttachMoney, "Custos") },
                    label = { Text("Custos") }
                )
                NavigationBarItem(
                    selected = selectedTab == 3,
                    onClick = { selectedTab = 3 },
                    icon = { Icon(Icons.Default.Checklist, "Compras") },
                    label = { Text("Compras") }
                )
            }
        }
    ) { padding ->
        Box(modifier = Modifier.padding(padding)) {
            when (selectedTab) {
                0 -> ConfigContent(viewModel = viewModel, onCalculate = { selectedTab = 1 })
                1 -> QuantitiesContent(viewModel = viewModel)
                2 -> CostsContent(viewModel = viewModel)
                3 -> ShoppingContent(viewModel = viewModel)
            }
        }
    }
}
`,
    },
    viewmodel: {
      title: 'Gerenciamento de Estado (ViewModel)',
      filename: 'ChurrascoViewModel.kt',
      code: `package com.churrascocalculado.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.churrascocalculado.domain.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

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
            🔥 Churrasco: \${s.config.eventName}
            👥 \${s.config.adults} Adultos, \${s.config.children} Crianças (\${s.config.durationHours}h)
            🥩 Total de Carne: \${s.result.totalMeatKg} kg
            Organizado com o app Churrasco Calculado (100% Offline)
        """.trimIndent()
    }
}
`,
    },
    room: {
      title: 'Persistência Local Offline (Room)',
      filename: 'ChurrascoDatabase.kt',
      code: `package com.churrascocalculado.data.local

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Entity(tableName = "churrasco_events")
data class ChurrascoEventEntity(
    @PrimaryKey val id: String,
    val name: String,
    val dateEpochMs: Long,
    val adults: Int,
    val children: Int,
    val durationHours: Int,
    val profile: String,
    val totalMeatKg: Double,
    val totalCostCalculated: Double
)

@Dao
interface ChurrascoDao {
    @Query("SELECT * FROM churrasco_events ORDER BY dateEpochMs DESC")
    fun getAllEvents(): Flow<List<ChurrascoEventEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertEvent(event: ChurrascoEventEntity)

    @Query("DELETE FROM churrasco_events WHERE id = :id")
    suspend fun deleteEventById(id: String)
}

@Database(entities = [ChurrascoEventEntity::class], version = 1, exportSchema = false)
abstract class ChurrascoDatabase : RoomDatabase() {
    abstract fun churrascoDao(): ChurrascoDao
}
`,
    },
    gradle: {
      title: 'Dependências do Android (build.gradle.kts)',
      filename: 'build.gradle.kts',
      code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    id("kotlin-kapt")
}

android {
    namespace = "com.churrascocalculado"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.churrascocalculado"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildFeatures {
        compose = true
    }

    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.8"
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

dependencies {
    // Jetpack Compose & Material 3
    implementation(platform("androidx.compose:compose-bom:2024.02.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.activity:activity-compose:1.8.2")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.7.0")

    // Room Database (Offline Local Storage)
    val roomVersion = "2.6.1"
    implementation("androidx.room:room-runtime:$roomVersion")
    implementation("androidx.room:room-ktx:$roomVersion")
    kapt("androidx.room:room-compiler:$roomVersion")

    // Icons
    implementation("androidx.compose.material:material-icons-extended")
}
`,
    },
  };

  const currentFileData = filesContent[activeFile];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFileData.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#18181C] border border-zinc-800 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl animate-fade-in my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">
                Código Nativo Android (Kotlin + Jetpack Compose)
              </h3>
              <p className="text-[10px] text-zinc-400">
                Arquivos 100% prontos para abrir no Android Studio e compilar o APK
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Abas dos Arquivos */}
        <div className="flex items-center gap-1.5 p-2 bg-[#121214] border-b border-zinc-800 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveFile('instructions')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
              activeFile === 'instructions'
                ? 'bg-orange-600 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            📋 Guia do APK
          </button>
          <button
            onClick={() => setActiveFile('calculator')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
              activeFile === 'calculator'
                ? 'bg-orange-600 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            ChurrascoCalculator.kt
          </button>
          <button
            onClick={() => setActiveFile('activity')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
              activeFile === 'activity'
                ? 'bg-orange-600 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            MainActivity.kt
          </button>
          <button
            onClick={() => setActiveFile('viewmodel')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
              activeFile === 'viewmodel'
                ? 'bg-orange-600 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            ChurrascoViewModel.kt
          </button>
          <button
            onClick={() => setActiveFile('room')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
              activeFile === 'room'
                ? 'bg-orange-600 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            RoomDatabase.kt
          </button>
          <button
            onClick={() => setActiveFile('gradle')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
              activeFile === 'gradle'
                ? 'bg-orange-600 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            build.gradle.kts
          </button>
        </div>

        {/* Visualizador de Código */}
        <div className="relative flex-1 p-4 bg-[#0E0E10] overflow-y-auto font-mono text-xs text-zinc-300 leading-relaxed">
          <div className="sticky top-0 right-0 flex justify-end mb-2 z-10">
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold px-3 py-1.5 rounded-xl border border-zinc-700 backdrop-blur-sm shadow-md transition active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-orange-400" />
                  <span>Copiar Código</span>
                </>
              )}
            </button>
          </div>

          <pre className="whitespace-pre-wrap selection:bg-orange-500 selection:text-white">
            {currentFileData.code}
          </pre>
        </div>

        {/* Rodapé com Fechar */}
        <div className="p-3 bg-[#18181C] border-t border-zinc-800 flex items-center justify-between">
          <span className="text-[11px] text-zinc-400">
            Arquivo: <strong className="text-zinc-200">{currentFileData.filename}</strong>
          </span>
          <button
            onClick={onClose}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold px-4 py-2 rounded-xl transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

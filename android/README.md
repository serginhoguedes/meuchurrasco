# Churrasco Calculado - Projeto Nativo Android (Kotlin + Jetpack Compose)

Aplicativo Android nativo completo para cálculo de carnes, acompanhamentos, bebidas, carvão e rateio de custos de churrasco.

## Características Técnicas
- **100% Offline**: Sem APIs externas, sem login, sem dependência de internet.
- **Linguagem**: Kotlin 1.9+
- **Interface**: Jetpack Compose com Material Design 3.
- **Persistência Local**: Room Database para histórico de churrascos.
- **Arquitetura**: MVVM (Model-View-ViewModel) com StateFlow e Coroutines.
- **Tema**: Dark grafite com acentos em brasa/laranja (`#FF5722`).

---

## Estrutura do Projeto Android
\`\`\`
android/
├── build.gradle.kts
├── settings.gradle.kts
└── app/
    ├── build.gradle.kts
    └── src/
        ├── main/
        │   ├── AndroidManifest.xml
        │   └── java/com/churrascocalculado/
        │       ├── domain/
        │       │   └── ChurrascoCalculator.kt
        │       ├── data/local/
        │       │   └── ChurrascoDatabase.kt
        │       └── ui/
        │           ├── MainActivity.kt
        │           └── ChurrascoViewModel.kt
        └── test/
            └── java/com/churrascocalculado/
                └── ChurrascoCalculatorTest.kt
\`\`\`

---

## Como Abrir e Compilar no Android Studio

### Passo 1: Abrir o Android Studio
1. Inicie o Android Studio (versão Hedgehog, Iguana, Jellyfish, Ladybug ou superior).
2. Selecione **File -> Open...** e aponte para a pasta `android/`.

### Passo 2: Sincronização do Gradle
- Aguarde a indexação e o download das dependências do Jetpack Compose e Room.
- Se solicitado, certifique-se de estar usando o JDK 17 (File -> Settings/Preferences -> Build, Execution, Deployment -> Build Tools -> Gradle -> Gradle JDK).

### Passo 3: Executar Testes Unitários
No terminal do Android Studio ou na aba de testes:
\`\`\`bash
./gradlew testDebugUnitTest
\`\`\`

### Passo 4: Gerar o Arquivo APK Instalável
#### Gerar APK de Debug:
\`\`\`bash
./gradlew assembleDebug
\`\`\`
O APK gerado estará em:
\`app/build/outputs/apk/debug/app-debug.apk\`

#### Gerar APK de Release Assinado:
1. No menu superior: **Build -> Generate Signed Bundle / APK...**
2. Escolha **APK**, selecione ou crie seu keystore e clique em **Finish**.
3. Ou via terminal:
\`\`\`bash
./gradlew assembleRelease
\`\`\`
O APK estará em:
\`app/build/outputs/apk/release/app-release.apk\`

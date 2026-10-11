package com.churrascocalculado.ui

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.churrascocalculado.domain.ChurrascoProfile
import com.churrascocalculado.domain.ClimateType

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
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.LocalFireDepartment,
                            contentDescription = null,
                            tint = FlameOrange,
                            modifier = Modifier.size(24.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Churrasco Calculado",
                            fontWeight = FontWeight.Bold,
                            color = Color.White,
                            fontSize = 18.sp
                        )
                    }
                },
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
        Box(modifier = Modifier.padding(padding).fillMaxSize()) {
            when (selectedTab) {
                0 -> ConfigContent(viewModel = viewModel, onCalculate = { selectedTab = 1 })
                1 -> QuantitiesContent(viewModel = viewModel)
                2 -> CostsContent(viewModel = viewModel)
                3 -> ShoppingContent(viewModel = viewModel)
            }
        }
    }
}

@Composable
fun ConfigContent(viewModel: ChurrascoViewModel, onCalculate: () -> Unit) {
    val uiState by viewModel.uiState.collectAsState()

    LazyColumn(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = CharcoalSurface),
                shape = RoundedCornerShape(24.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Participantes", fontWeight = FontWeight.Bold, color = Color.White, fontSize = 16.sp)
                    Spacer(modifier = Modifier.height(12.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Adultos: ${uiState.config.adults}", color = Color.White)
                        Row {
                            Button(onClick = { viewModel.updateAdults(uiState.config.adults - 1) }) { Text("-") }
                            Spacer(modifier = Modifier.width(8.dp))
                            Button(onClick = { viewModel.updateAdults(uiState.config.adults + 1) }) { Text("+") }
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Crianças: ${uiState.config.children}", color = Color.White)
                        Row {
                            Button(onClick = { viewModel.updateChildren(uiState.config.children - 1) }) { Text("-") }
                            Spacer(modifier = Modifier.width(8.dp))
                            Button(onClick = { viewModel.updateChildren(uiState.config.children + 1) }) { Text("+") }
                        }
                    }
                }
            }
        }

        item {
            Button(
                onClick = onCalculate,
                colors = ButtonDefaults.buttonColors(containerColor = FlameOrange),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth().height(54.dp)
            ) {
                Text("CALCULAR MEU CHURRASCO", fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun QuantitiesContent(viewModel: ChurrascoViewModel) {
    val uiState by viewModel.uiState.collectAsState()

    LazyColumn(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = CharcoalSurface),
                shape = RoundedCornerShape(20.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Total de Carnes", color = Color.Gray, fontSize = 12.sp)
                    Text("${uiState.result.totalMeatKg} kg", color = FlameOrange, fontWeight = FontWeight.Black, fontSize = 28.sp)
                    Text("~${uiState.result.meatPerAdultGrams}g por adulto", color = Color.LightGray, fontSize = 12.sp)
                }
            }
        }

        items(uiState.result.items) { item ->
            Card(
                colors = CardDefaults.cardColors(containerColor = CharcoalSurface),
                shape = RoundedCornerShape(16.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth().padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(item.name, fontWeight = FontWeight.Bold, color = Color.White, fontSize = 14.sp)
                        if (item.note.isNotEmpty()) {
                            Text(item.note, color = Color.Gray, fontSize = 11.sp)
                        }
                    }
                    Text("${item.quantity} ${item.unit}", color = EmberAmber, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
fun CostsContent(viewModel: ChurrascoViewModel) {
    val uiState by viewModel.uiState.collectAsState()

    LazyColumn(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = CharcoalSurface),
                shape = RoundedCornerShape(20.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Resumo Financeiro", color = Color.Gray, fontSize = 12.sp)
                    Text("Informe os preços dos produtos para calcular o rateio.", color = Color.White, fontSize = 14.sp)
                }
            }
        }
    }
}

@Composable
fun ShoppingContent(viewModel: ChurrascoViewModel) {
    val uiState by viewModel.uiState.collectAsState()

    LazyColumn(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        items(uiState.result.items) { item ->
            val isChecked = uiState.purchasedIds.contains(item.id)
            Card(
                colors = CardDefaults.cardColors(containerColor = CharcoalSurface),
                shape = RoundedCornerShape(12.dp),
                onClick = { viewModel.togglePurchased(item.id) }
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth().padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Checkbox(
                        checked = isChecked,
                        onCheckedChange = { viewModel.togglePurchased(item.id) },
                        colors = CheckboxDefaults.colors(checkedColor = FlameOrange)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "${item.name} (${item.quantity} ${item.unit})",
                        color = if (isChecked) Color.Gray else Color.White
                    )
                }
            }
        }
    }
}

# BIA Scale App — Especificação Técnica Completa

> Documento de referência para Claude Code construir o app de bioimpedância.
> Baseado em análise completa do app OKOK (16 screenshots) + features diferenciais.

---

## Stack Tecnológico

| Camada | Tecnologia |
|--------|-----------|
| Framework | React Native + Expo (SDK 52+) |
| Linguagem | TypeScript strict |
| Navegação | expo-router (tabs) |
| BLE | react-native-ble-plx |
| DB Local | expo-sqlite |
| Estado | Zustand |
| Gráficos | Victory Native |
| OTA | EAS Update (expo-updates) |
| Ícones | MaterialCommunityIcons |

---

## Checklist de Implementação por Etapas

### Etapa 1 — Setup do Projeto
- [ ] `npx create-expo-app bia-scale --template tabs`
- [ ] Instalar dependências: react-native-ble-plx, expo-sqlite, victory-native, zustand, expo-updates, @expo/vector-icons
- [ ] Configurar expo-router com tabs: Detalhes, Histórico, Perfil
- [ ] Estrutura de pastas: src/{components, screens, lib, store, types, constants}
- [ ] Configurar app.config.ts com expo-updates (ver Etapa 10)
- [ ] Tema global (cores, fontes, espaçamentos — ver seção Tema)

### Etapa 2 — Modelo de Dados
- [ ] Schema SQLite (tabelas users + measurements)
- [ ] Zustand store com actions: addMeasurement, getHistory, updateUser
- [ ] Seed data com medição real do Alexandre (ver seção Dados de Exemplo)
- [ ] Migrations e init do banco

### Etapa 3 — Motor de Cálculos
- [ ] Implementar TODAS as 18 métricas com fórmulas científicas (ver seção Fórmulas)
- [ ] Classificações com ranges por sexo/idade (ver seção Classificações)
- [ ] Validar contra valores OKOK: seed deve produzir valores idênticos aos screenshots

### Etapa 4 — Tela Detalhes (Principal)
- [ ] Card de peso no topo com barra colorida (Baixo/Saudável/Alto/Obeso)
- [ ] Thresholds na barra: 59.94 / 80.68 / 96.88 para 180cm
- [ ] Badge "Obeso" com emoji 😐
- [ ] Delta com última medição: "-1.6 Comparado com a última vez (2026/02/23)"
- [ ] "Melhor peso de 30 dias" (ou "--" se sem dados)
- [ ] Lista vertical de 18 métricas com ícones, valores e badges coloridos
- [ ] Alternância fundo branco/#F8F9FA entre linhas
- [ ] Botão "Ir para configurações" no final da lista

### Etapa 5 — Tela Home (Dashboard)
- [ ] Header com avatar + nome + ícones (grid, refresh)
- [ ] Card principal: nome da balança, data/hora, peso grande, barra, delta
- [ ] Botão "História" no card
- [ ] Botão "Comece a pesar" (quando sem medição recente)
- [ ] Card "Jejum" com ilustração e "Comece o seu plano de jejum!"
- [ ] Card "PesoTendência" com mini-gráfico de linha e delta em kg
- [ ] Card "Beber água" com progresso e animação
- [ ] Card "Registro de calorias" com alvo e ícones de refeição
- [ ] Card "Cintura" (medida manual)
- [ ] FAB "+" central com bottom sheet: Peso, Beber água, Corpo
- [ ] Botão "Adicionar dispositivo" no bottom sheet
- [ ] Tab bar: Home (casa), "+" (FAB), Configurações (engrenagem)

### Etapa 6 — Tela Histórico
- [ ] Filtros de período: 7d, 30d, 90d, Todos
- [ ] Gráfico de linha (Victory Native) com evolução da métrica selecionada
- [ ] Seletor de métrica: Peso, Gordura%, IMC, Água%, Massa Muscular, Gordura Visceral, BMR
- [ ] Lista cronológica com deltas

### Etapa 7 — Tela Perfil/Configurações
- [ ] Header: "Olá, {nome}" + avatar + "OKOK Ajudou Você a Gerenciar o Peso por X Dias"
- [ ] "Meu perfil" com idade e altura visíveis (ex: 43 | 180cm)
- [ ] "Membro da família" (multi-perfil)
- [ ] "Lembrete de notificação"
- [ ] "Configurações de unidade/idioma"
- [ ] "Centro de Ajuda"
- [ ] "Feedback"
- [ ] "Estilo de tema" (com ícone 🔥)
- [ ] "Widget"
- [ ] Formulário do perfil: nome, data nascimento, altura, sexo, nível atividade (1-5)
- [ ] Meta de peso com projeção

### Etapa 8 — Módulo Beber Água
- [ ] Tela com copo animado (nível sobe ao adicionar)
- [ ] Setas ↑↓ para ajustar quantidade (padrão 50ml)
- [ ] Botão "Adicionar · Água"
- [ ] Carrossel de tipos de bebida com ícones:
  - Água, Água com gás, Café, Descafeinado
  - Leite, Leite de aveia, Leite de amêndoa, Leite de coco
  - Água de coco, Sopa, Iogurte
  - (alguns com cadeado VIP — no nosso app, todos liberados)
- [ ] Meta diária calculada: ~35ml × peso corporal (ex: 113.75kg → 2637ml target como no OKOK, que arredonda para 2637ml que é ~23.2ml/kg, provavelmente usa fórmula peso × 0.033 × 1000 = 3753ml ou tabela fixa)
- [ ] Calendário semanal com indicadores de consumo por dia
- [ ] Estatísticas: "X dias - Beber continuamente", "Y ml - Média da semana"
- [ ] Card na home mostrando progresso: "0ml / 2637ml — 0% · Restante 2637ml"
- [ ] Welcome screen: "Bem-vindo/a a usar a função de beber água"

### Etapa 9 — Módulo BLE (Conexão com Balança Chipsea)
- [ ] Protocolo Chipsea (ver seção BLE)
- [ ] Tela de medição com ícone Bluetooth animado
- [ ] Lista de dispositivos encontrados
- [ ] State machine: IDLE → SCANNING → CONNECTING → DISCOVERING → SUBSCRIBING → READING → DONE
- [ ] Mock mode para desenvolvimento sem hardware

### Etapa 10 — OTA Updates (EAS Update)
- [ ] Configurar expo-updates no app.config.ts
- [ ] eas.json com canais production/preview/development
- [ ] checkForOTAUpdate() no _layout.tsx raiz
- [ ] Runtime version policy: "fingerprint"

### Etapa 11 — Polish e Extras
- [ ] Export CSV com todas as 18 métricas + impedância raw
- [ ] Dark mode
- [ ] Animações de transição
- [ ] Card de proteína (feature diferencial — ver seção Proteína)
- [ ] Registro de calorias básico
- [ ] Jejum intermitente básico
- [ ] Medida de cintura (input manual)


---

## Referência Visual — Mapeamento dos Screenshots

| # | Arquivo | Conteúdo |
|---|---------|----------|
| 01 | WhatsApp_Image_..._48__1_.jpeg | Home bottom: PesoTendência, Beber água, Calorias, Cintura |
| 02 | WhatsApp_Image_..._48__2_.jpeg | VIP popup (ignorar — nosso app não tem paywall) |
| 03 | WhatsApp_Image_..._48__3_.jpeg | Tela Água: copo animado, Café, Leite aveia, Descafeinado |
| 04 | WhatsApp_Image_..._48.jpeg | Tela Configurações completa |
| 05 | WhatsApp_Image_..._49__1_.jpeg | Tela Água: Água de coco, Leite de coco, Leite, Iogurte |
| 06 | WhatsApp_Image_..._49__2_.jpeg | Tela Água: Água, Água com gás |
| 07 | WhatsApp_Image_..._49__3_.jpeg | Tela Água: calendário semanal, stats, welcome |
| 08 | WhatsApp_Image_..._49__4_.jpeg | Home + bottom sheet (Peso, Beber água, Corpo) |
| 09 | WhatsApp_Image_..._49.jpeg | Tela Água: Leite de amêndoa, Sopa |
| 10 | WhatsApp_Image_..._50__1_.jpeg | Home top: Jejum, PesoTendência, Beber água, Calorias |
| 11 | WhatsApp_Image_..._50__2_.jpeg | Dashboard principal: 113.75kg, barra, Obeso, delta |
| 12 | WhatsApp_Image_..._50__3_.jpeg | Métricas bottom: visceral, ossos, metabolismo, proteína, obesidade, idade metabólica, LBM |
| 13 | WhatsApp_Image_..._50.jpeg | Home scrolled: PesoTendência, Beber água welcome, Calorias, Cintura |
| 14 | WhatsApp_Image_..._51__1_.jpeg | Tela Detalhes top: peso, barra 59.94/80.68/96.88, IMC, Gordura, Massa muscular |
| 15 | WhatsApp_Image_..._51__2_.jpeg | Tela Detalhes (outro horário) — mesma estrutura |
| 16 | WhatsApp_Image_..._51.jpeg | Métricas completas: 18 itens com classificações |

---

## Tela Detalhes — Layout Exato (Screenshots 14, 15, 16)

### Card de Peso (Topo)

```
┌──────────────────────────────────────────┐
│ [Obeso 😐]                    [📷+]      │
│                                          │
│   113.75 Kg                              │
│   2026/02/24 09:40:32                    │
│                                          │
│   59.94      80.68      96.88            │
│ ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■●■■■       │
│ Baixo    Saudável    Alto    Obeso       │
│                                    [✏️]   │
├──────────────────────────────────────────┤
│ 🔄 Comparado com a última vez    -1.6    │
│    (2026/02/23)                          │
│ 🔥 Melhor peso de 30 dias       - -     │
└──────────────────────────────────────────┘
```


### Cálculo dos Thresholds da Barra

```typescript
// Baseado em BMI × height²
const height_m = height_cm / 100; // 1.80
const h2 = height_m * height_m;   // 3.24

const baixo_max    = 18.5 * h2;   // 59.94
const saudavel_max = 24.9 * h2;   // 80.68 (OKOK usa ~24.9)
const alto_max     = 29.9 * h2;   // 96.88 (OKOK usa ~29.9)
// Acima = Obeso
```

### Lista Completa de Métricas (18 itens — ordem exata do OKOK)

```
 #  | Métrica                              | Valor  | Classificação | Cor
----|--------------------------------------|--------|---------------|--------
 1  | Peso(Kg)                             | 113.75 | Obeso         | Vermelho
 2  | IMC                                  | 35.1   | Obeso         | Vermelho
 3  | Gordura(%)                           | 34.7   | Obeso         | Vermelho
 4  | Peso da gordura(Kg)                  | 39.5   | Obeso         | Vermelho
 5  | Percentual massa muscular esquel.(%) | 33.0   | Saudável      | Verde
 6  | Peso massa muscular esquelética(Kg)  | 37.5   | Saudável      | Verde
 7  | Registro de massa muscular(%)        | 61.5   | Excelente     | Verde
 8  | Peso da massa muscular(Kg)           | 70.0   | Excelente     | Verde
 9  | Água(%)                              | 48.8   | Baixo         | Azul
10  | Peso da água(Kg)                     | 55.5   | Baixo         | Azul
11  | Gordura visceral                     | 27.0   | Obeso         | Vermelho
12  | Ossos(Kg)                            | 4.0    | Excelente     | Verde
13  | Metabolismo                          | 2143.6 | Alto          | Ciano
14  | Proteína(%)                          | 12.8   | Baixo         | Azul
15  | Obesidade(%)                         | 62.5   | Grave         | Verm.Escuro
16  | Idade metabólica                     | 52.0   | (sem badge)   | —
17  | LBM(Kg)                              | 74.29  | (sem badge)   | —
18  | Idade real                           | 42     | (sem badge)   | —
19  | Altura(cm)                           | 180    | (sem badge)   | —
```

### Ícones por Métrica (MaterialCommunityIcons)

```typescript
const METRIC_ICONS: Record<string, string> = {
  'peso':                    'weight-kilogram',
  'imc':                     'human',
  'gordura_pct':             'water-percent',
  'peso_gordura':            'water',
  'massa_musc_esq_pct':      'arm-flex',
  'peso_massa_musc_esq':     'arm-flex-outline',
  'registro_massa_musc_pct': 'dumbbell',
  'peso_massa_muscular':     'dumbbell',
  'agua_pct':                'water-outline',
  'peso_agua':               'water-circle',
  'gordura_visceral':        'stomach',
  'ossos':                   'bone',
  'metabolismo':             'fire',
  'proteina_pct':            'target',
  'obesidade_pct':           'scale-bathroom',
  'idade_metabolica':        'account-clock',
  'lbm':                     'weight',
  'idade_real':              'cake-variant',
  'altura':                  'human-male-height',
};
```


---

## Fórmulas de Cálculo

### 1. IMC (BMI)
```
IMC = peso / (altura_m)²
Ex: 113.75 / 3.24 = 35.1
```

### 2. Gordura Corporal % — Deurenberg (1991)
```
Homem: (1.20 × IMC) + (0.23 × idade) - 10.8 - 5.4
Mulher: (1.20 × IMC) + (0.23 × idade) - 5.4

Ex homem 42 anos, IMC 35.1:
(1.20 × 35.1) + (0.23 × 42) - 10.8 - 5.4 = 42.12 + 9.66 - 16.2 = 35.58
OKOK mostra 34.7 — ajuste fino com impedância BIA
```

### 3. Peso da Gordura
```
peso_gordura = peso × (gordura_pct / 100)
Ex: 113.75 × 0.347 = 39.47 ≈ 39.5
```

### 4. Massa Magra (LBM) — Boer (1984)
```
Homem: (0.407 × peso) + (0.267 × altura_cm) - 19.2
Mulher: (0.252 × peso) + (0.473 × altura_cm) - 48.3

Ex: (0.407 × 113.75) + (0.267 × 180) - 19.2 = 46.30 + 48.06 - 19.2 = 75.16
OKOK mostra 74.29 — ajuste com impedância
```

### 5. Água Corporal % — Lee et al. (2001)
```
Homem: 28.35 + (0.197 × altura_cm) - (0.109 × peso)
       Resultado em litros, converter para % do peso total

OKOK mostra 48.8%
peso_agua = peso × (agua_pct / 100) = 113.75 × 0.488 = 55.51 ≈ 55.5
```

### 6. Massa Óssea — Behnke et al. (1963)
```
Homem: 0.0575 × LBM (se LBM > 75: 0.053 × LBM)
Mulher: 0.0525 × LBM (se LBM > 60: 0.048 × LBM)

Ex: ~0.054 × 74.29 ≈ 4.01 → 4.0
```

### 7. Metabolismo Basal (BMR) — Mifflin-St Jeor (1990)
```
Homem: (10 × peso) + (6.25 × altura_cm) - (5 × idade) + 5
Mulher: (10 × peso) + (6.25 × altura_cm) - (5 × idade) - 161

Ex: (10 × 113.75) + (6.25 × 180) - (5 × 42) + 5
  = 1137.5 + 1125 - 210 + 5 = 2057.5
OKOK mostra 2143.6 — usa LBM na fórmula Katch-McArdle:
BMR = 370 + (21.6 × LBM) = 370 + (21.6 × 74.29) = 370 + 1604.7 = 1974.7
Provavelmente mix das fórmulas + impedância → ajustar para bater 2143.6
```


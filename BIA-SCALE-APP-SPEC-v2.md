# BIA Scale App — Especificação Técnica Completa v2

> Documento de referência para Claude Code construir o app de bioimpedância.
> Baseado em análise completa do app OKOK (24 screenshots) + features diferenciais.
> **v2 — Atualizado com 8 screenshots novos: telas de Dispositivo, Informação da balança, Membro da família, e Configurações completo.**

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
- [ ] Configurar expo-router com tabs: Home, "+", Configurações
- [ ] Estrutura de pastas: src/{components, screens, lib, store, types, constants}
- [ ] Configurar app.config.ts com expo-updates (ver Etapa 10)
- [ ] Tema global (cores, fontes, espaçamentos — ver seção Tema)
### Etapa 2 — Modelo de Dados
- [ ] Schema SQLite (tabelas users + measurements + devices + water_intake + family_members)
- [ ] Zustand store com actions: addMeasurement, getHistory, updateUser, addDevice, removeDevice, addWaterIntake, addFamilyMember
- [ ] Seed data com medição real do Alexandre (ver seção Dados de Exemplo)
- [ ] Migrations e init do banco

### Etapa 3 — Motor de Cálculos
- [ ] Implementar TODAS as 19 métricas com fórmulas científicas (ver seção Fórmulas)
- [ ] Classificações com ranges por sexo/idade (ver seção Classificações)
- [ ] Validar contra valores OKOK: seed deve produzir valores idênticos aos screenshots

### Etapa 4 — Tela Detalhes (Principal)
- [ ] Header: "< Detalhes" com 3 ícones à direita (salvar 💾, foco ⊙, refresh ↻)
- [ ] Card de peso no topo com barra colorida (Baixo/Saudável/Alto/Obeso)
- [ ] Badge "Obeso 😐" (pill vermelha com emoji) no canto superior esquerdo do card
- [ ] Ícone de adicionar foto (📷+) no canto superior direito do card
- [ ] Peso em destaque: "113.75 Kg" com data "2026/02/24 09:40:32"
- [ ] Thresholds na barra: 59.94 / 80.68 / 96.88 para 180cm
- [ ] Ícone de editar (caneta azul ✏️) no canto inferior direito do card, abaixo da barra
- [ ] Delta com última medição: "-1.6 Comparado com a última vez (2026/02/23)"
- [ ] "Melhor peso de 30 dias" (ou "- -" se sem dados)
- [ ] Lista vertical de 19 métricas com ícones, valores e badges coloridos
- [ ] Alternância fundo branco/#F8F9FA entre linhas
- [ ] Botão "Ir para configurações" no final da lista (pill com borda, texto preto)
### Etapa 5 — Tela Home (Dashboard)
- [ ] Header com avatar + nome "xmontesino" + ícones (grid ⊞, refresh ↻)
- [ ] Ícone de balança conectada (olho 👁) ao lado do peso
- [ ] Card principal: nome da balança "Balança Bluetooth1", data/hora, peso grande, barra colorida (sem thresholds numéricos), badge "Obeso", delta "-1.6", "Melhor em 30 dias - -"
- [ ] Botão "História" (pill com borda) no canto superior direito do card
- [ ] Botão "Comece a pesar" (botão grande roxo/azul gradient)
- [ ] Card "Jejum" com ilustração (relógio com legumes) e "Bem-vindo/a Comece o seu plano de jejum!"
- [ ] Card "PesoTendência" com ícone 📈 azul, mini-gráfico de linha, delta "-1.5 Kg", "Mudanças recentes"
- [ ] Card "Beber água" com dois estados: welcome (ilustração bebidas) e active (0ml/2637ml, ícones quick-add 250/450)
- [ ] Card "Registro de calorias": "0 Cal", "Alvo 2073Cal", 4 ícones de refeição
- [ ] Card "Cintura" com ícone 📐 azul: "Sem dados"
- [ ] FAB "+" central abre bottom sheet: Peso, Beber água, Corpo (🔒 no OKOK, liberado no nosso) + "Adicionar dispositivo"
- [ ] Tab bar fixa: Home (🏠), "+" (FAB azul), Configurações (⚙️)

### Etapa 6 — Tela Histórico
- [ ] Filtros de período: 7d, 30d, 90d, Todos
- [ ] Gráfico de linha (Victory Native) com evolução da métrica selecionada
- [ ] Seletor de métrica: Peso, Gordura%, IMC, Água%, Massa Muscular, Gordura Visceral, BMR
- [ ] Lista cronológica com deltas

### Etapa 7 — Tela Perfil/Configurações
- [ ] Header gradiente: "Olá,{username}" + "OKOK Ajudou Você a Gerenciar o Peso por X Dias" + avatar circular
- [ ] **Grupo 1:** "Meu perfil" (👤 + 🎂 43 | 180cm >) + "Membro da família" (👥 >)
- [ ] **Grupo 2:** "Lembrete de notificação" (🔔 >) + "Configurações de unidade/idioma" (🌐 >)
- [ ] **Grupo 3:** "Centro de Ajuda" (❤️ >) + "Feedback" (😊 >)
- [ ] **Grupo 4:** "Estilo de tema" (👑 + 🔥 >) + "Widget" (⊞ >)
- [ ] **Grupo 5 (NOVO):** "Dispositivo" (📦 >) + "Definições" (ⓘ >)
- [ ] Formulário do perfil: nome, data nascimento, altura, sexo, nível atividade (1-5)
- [ ] Meta de peso com projeção
### Etapa 7.1 — Tela Dispositivo (NOVA)
- [ ] Header: "< Dispositivo" com botão "⊕" no canto superior direito
- [ ] Lista de dispositivos pareados: ícone balança, nome, MAC address, chevron >
- [ ] Empty state se nenhum dispositivo
- [ ] Botão "Adicionar dispositivo" fixo no bottom (pill gradient azul/roxo)
- [ ] Tocar no dispositivo navega para Informação da Balança

### Etapa 7.2 — Tela Informação da Balança (NOVA)
- [ ] Header: "< Informação da balança"
- [ ] Campos em cards: Nome (editável >), MAC (readonly), Fábrica, Telefone número, Endereço
- [ ] Botão "Não par" fixo no bottom (pill gradient azul/roxo) — despareia dispositivo

### Etapa 7.3 — Tela Membro da Família (NOVA)
- [ ] Header: "< Membro da família" com botão "⊕"
- [ ] Empty state: ilustração caixa + "Sem Membros da Família" + botão "Adicionar"
- [ ] Lista de membros com avatar, nome, idade, altura
- [ ] Formulário de adicionar: nome, data nascimento, altura, sexo
- [ ] Membro pode ser selecionado como perfil ativo

### Etapa 8 — Módulo Beber Água
- [ ] Header: "< Água"
- [ ] Copo animado grande (cyan/turquesa), nível sobe ao adicionar
- [ ] Setas ↑↓ dentro do copo (botões brancos circulares)
- [ ] Tooltip "Clique para experimentar" no primeiro uso
- [ ] Ícone garrafa d'água à direita do copo
- [ ] Display "50ml" com ícone editar ✏️
- [ ] Carrossel horizontal de bebidas (com seta > para paginar):
  - Água (SEM cadeado), Água com gás (🔒), Água com gás 2 (🔒), Água de coco (🔒)
  - Leite de coco (🔒), Leite (🔒), Iogurte (🔒)
  - Leite de amêndoa (🔒), Sopa (🔒), Leite de aveia (🔒)
  - Café (SEM cadeado), Descafeinado
  - (No nosso app: TODOS liberados)
- [ ] Botão "Adicionar · Água" fixo no bottom (pill gradient cyan)
- [ ] Tela calendário/stats: header com nome + mês, calendário semanal, "0ml"
- [ ] Welcome popup: ilustração + texto + botão "confirme"
- [ ] Stats: "X dias - Beber continuamente" | "Y ml - Média da semana"
- [ ] Meta diária: ~2637ml (verificar fórmula OKOK)

### Etapa 9 — Módulo BLE (Conexão com Balança Chipsea)
- [ ] Protocolo Chipsea (ver seção BLE)
- [ ] Tela de medição com ícone Bluetooth animado
- [ ] Lista de dispositivos encontrados
- [ ] State machine: IDLE → SCANNING → CONNECTING → DISCOVERING → SUBSCRIBING → READING → DONE
- [ ] Salvar dispositivo pareado: nome, MAC address
- [ ] Mock mode para desenvolvimento sem hardware
- [ ] Dados do dispositivo real: "Balança Bluetooth1", MAC "50:E4:52:A2:3E:4C"

### Etapa 10 — OTA Updates (EAS Update)
- [ ] Configurar expo-updates no app.config.ts
- [ ] eas.json com canais production/preview/development
- [ ] checkForOTAUpdate() no _layout.tsx raiz
- [ ] Runtime version policy: "fingerprint"

### Etapa 11 — Polish e Extras
- [ ] Export CSV com todas as 19 métricas + impedância raw
- [ ] Dark mode
- [ ] Animações de transição
- [ ] Card de proteína (feature diferencial)
- [ ] Registro de calorias básico
- [ ] Jejum intermitente básico
- [ ] Medida de cintura (input manual)
---

## Referência Visual — Mapeamento Completo dos 24 Screenshots

| # | Arquivo | Conteúdo |
|---|---------|----------|
| 01 | ...at 12.19.48 (1).jpeg | Home bottom: PesoTendência (-1.5 Kg), Beber água (0ml/2637ml, ícones 250/450), Calorias (0 Cal, Alvo 2073Cal), Cintura |
| 02 | ...at 12.19.48 (2).jpeg | VIP popup (ignorar — sem paywall) |
| 03 | ...at 12.19.48 (3).jpeg | Tela Água: copo, tooltip, Leite aveia, Leite amêndoa, Café, Descafeinado |
| 04 | ...at 12.19.48.jpeg | Configurações top: Olá + avatar + perfil + família + notif + idioma + ajuda + feedback + tema + widget |
| 05 | ...at 12.19.49 (1).jpeg | Tela Água: Água de coco, Leite coco, Leite, Iogurte |
| 06 | ...at 12.19.49 (2).jpeg | Tela Água: Água (selecionada), Água com gás (2), Água de coco |
| 07 | ...at 12.19.49 (3).jpeg | Tela Água: calendário semanal, welcome popup, stats |
| 08 | ...at 12.19.49 (4).jpeg | Home + bottom sheet (Peso, Beber água, Corpo 🔒, Adicionar dispositivo) |
| 09 | ...at 12.19.49.jpeg | Tela Água: Leite amêndoa, Sopa, Leite aveia |
| 10 | ...at 12.19.50 (1).jpeg | Home middle: Jejum, PesoTendência, Beber água welcome, Calorias |
| 11 | ...at 12.19.50 (2).jpeg | Home top: avatar xmontesino, card Balança Bluetooth1 113.75kg Obeso, Comece a pesar, Jejum |
| 12 | ...at 12.19.50 (3).jpeg | Métricas bottom: Gordura visceral → Altura + Ir para configurações |
| 13 | ...at 12.19.50.jpeg | Home scrolled: PesoTendência, Beber água welcome, Calorias, Cintura |
| 14 | ...at 12.19.51 (1).jpeg | Detalhes top: header 3 ícones, card peso Obeso 😐, barra 59.94/80.68/96.88, métricas |
| 15 | ...at 12.19.51 (2).jpeg | Detalhes top (9:46 "Evento") — mesma estrutura |
| 16 | ...at 12.19.51.jpeg | Métricas middle: Peso massa musc esquelética → Idade real |
| **17** | **...at 12.19.47.jpeg** | **🆕 Membro da família: empty state, "Sem Membros", botão Adicionar** |
| **18** | **...at 12.19.47 (1).jpeg** | **🆕 Info balança: Nome, MAC 50:E4:52:A2:3E:4C, Fábrica, Tel, End, Não par** |
| **19** | **...at 12.19.47 (2).jpeg** | **🆕 Dispositivo: Balança Bluetooth1 + MAC, Adicionar dispositivo** |
| **20** | **...at 12.19.47 (3).jpeg** | **🆕 Configurações scrolled: + Dispositivo + Definições** |
| **21** | **...at 11.19.33 (1).jpeg** | **🆕 Detalhes top (alta res)** |
| **22** | **...at 11.19.33.jpeg** | **🆕 Detalhes middle (alta res)** |
| **23** | **...at 11.19.32.jpeg** | **🆕 Detalhes bottom (alta res)** |
| **24** | **...at 11.19.33 (2).jpeg** | **🆕 Detalhes top (outro device 9:46)** |
---

## Tela Detalhes — Layout Exato

### Header
```
┌──────────────────────────────────────────┐
│ <   Detalhes              💾  ⊙  ↻      │
└──────────────────────────────────────────┘
```

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
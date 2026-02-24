# BIA Scale App — Especificação Técnica Completa v3

> Documento de referência para Claude Code construir o app de bioimpedância.
> Baseado em análise completa do app OKOK (24 screenshots verificados individualmente).
> **v3 — Atualizado com análise completa de TODOS os 24 prints + correções de layout.**

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
- [ ] Header: "< Detalhes" centralizado + 3 ícones à direita (💾 salvar, ⊙ foco, ↻ refresh)
- [ ] Card de peso no topo com fundo gradient azul claro
- [ ] Badge "Obeso 😐" (pill vermelha com emoji triste) no canto superior ESQUERDO do card
- [ ] Ícone de adicionar foto (📷+ quadrado com montanha) no canto superior DIREITO do card
- [ ] Peso em destaque: "113.75 Kg" com data "2026/02/24 09:40:32" abaixo
- [ ] Barra colorida horizontal com 4 seções: Azul(Baixo) → Verde(Saudável) → Amarelo(Alto) → Vermelho(Obeso)
- [ ] Thresholds na barra: 59.94 / 80.68 / 96.88 (para 180cm)
- [ ] Indicador circular (emoji triste) posicionado na barra de acordo com o peso
- [ ] Labels abaixo da barra: "Baixo    Saudável    Alto    Obeso"
- [ ] Ícone de editar (✏️ azul quadrado) no canto inferior DIREITO do card, abaixo da barra
- [ ] Seção delta: ícone ⏱ + "Comparado com a última vez (2026/02/23)" à esquerda, "-1.6" à direita
- [ ] Seção melhor: ícone 🔥 + "Melhor peso de 30 dias" à esquerda, "- -" à direita
- [ ] Lista vertical de 19 métricas (ver ordem exata abaixo)
- [ ] Cada métrica: ícone à esquerda, nome, valor numérico grande à direita, badge colorido abaixo do valor
- [ ] Alternância fundo branco / #F8F9FA entre linhas
- [ ] Botão "Ir para configurações" no final da lista (pill com borda preta, texto preto, centralizado)

#### Ordem exata das 19 métricas (confirmada por prints):
| # | Nome | Ícone | Valor Exemplo | Badge |
|---|------|-------|---------------|-------|
| 1 | Peso(Kg) | ⚖️ balança | 113.75 | Obeso 🔴 |
| 2 | IMC | 🐷 porquinho | 35.1 | Obeso 🔴 |
| 3 | Gordura(%) | 📉 gráfico descendo | 34.7 | Obeso 🔴 |
| 4 | Peso da gordura(Kg) | 📉 gráfico | 39.5 | Obeso 🔴 |
| 5 | Percentual da massa muscular esquelética(%) | 💪 músculo | 33.0 | Saudável 🟢 |
| 6 | Peso da massa muscular esquelética(Kg) | 💪 músculo flex | 37.5 | Saudável 🟢 |
| 7 | Registro de massa muscular(%) | 💪 ondas | 61.5 | Excelente 🟢 |
| 8 | Peso da massa muscular(Kg) | 💪 ondas | 70.0 | Excelente 🟢 |
| 9 | Água(%) | 💧 gota | 48.8 | Baixo 🔵 |
| 10 | Peso da água(Kg) | 💧 ondas | 55.5 | Baixo 🔵 |
| 11 | Gordura visceral | 🫃 barriga | 27.0 | Obeso 🔴 |
| 12 | Ossos(Kg) | 🦴 osso | 4.0 | Excelente 🟢 |
| 13 | Metabolismo | 🔥 fogo circular | 2143.6 | Alto 🔵 |
| 14 | Proteína(%) | ⊙ alvo circular | 12.8 | Baixo 🔵 |
| 15 | Obesidade(%) | 🚗 carro/escala | 62.5 | Grave 🔴 |
| 16 | Idade metabólica | 👥 pessoas | 52.0 | (sem badge) |
| 17 | LBM(Kg) | KG círculo | 74.29 | (sem badge) |
| 18 | Idade real | ⚗️ broto/planta | 42 | (sem badge) |
| 19 | Altura(cm) | 📏 régua | 180 | (sem badge) |

#### Cores dos badges:
- 🔴 Vermelho: Obeso, Grave
- 🟢 Verde: Saudável, Excelente
- 🔵 Cyan/Azul claro: Baixo, Alto
- Sem badge: métricas 16-19 (valores informativos)

### Etapa 5 — Tela Home (Dashboard)
- [ ] Header com avatar circular (azul com ícone pessoa) + nome "xmontesino" + ícones (⊞ grid, ↻ refresh)
- [ ] Badge ícone balança conectada (👁 olho) abaixo do avatar
- [ ] Card principal com fundo gradient azul claro:
  - "Balança Bluetooth1" (nome do device) à esquerda
  - Botão "História" (pill com borda, texto preto) no canto superior direito
  - Data/hora: "2026/02/24 09:40:32"
  - Ícone 👁 olho à esquerda do peso
  - Peso grande: "113.75 Kg"
  - Barra colorida horizontal SEM thresholds numéricos (azul/verde/amarelo/vermelho)
  - Badge "Obeso" (pill vermelho) à direita da barra
  - Delta: "-1.6" + "Comparado com a última vez" à esquerda
  - "- -" + "Melhor em 30 dias" à direita
- [ ] Botão "Comece a pesar" (pill gradient azul→roxo, texto branco, largura total)
- [ ] Card "Jejum": título "Jejum" + chevron >, subtítulo "Bem-vindo/a Comece o seu plano de jejum!", ilustração relógio com legumes (cenoura, cereja) à direita
- [ ] Card "PesoTendência": ícone 📈 azul circular, título "PesoTendência" + chevron >, delta "-1.5 Kg", "Mudanças recentes", mini-gráfico de linha (02/23→02/24)
- [ ] Card "Beber água" com DOIS estados:
  - Welcome: ilustração bebidas (café, champanhe, coca, coco, drink), texto "Bem-vindo/a a usar a função de beber água"
  - Active: "0ml" grande, "0% · Restante2637ml", 3 ícones: ⊕azul(add custom) + 250 + 450, ilustração gota d'água à direita
- [ ] Card "Registro de calorias" + chevron >: "0 Cal" grande, "Alvo 2073Cal", barra progresso, 4 ícones refeição (chef, garfo/faca, prato/cloche, emoji)
- [ ] Card "Cintura" + chevron >: ícone 📐 azul, "Sem dados", ilustração silhueta
- [ ] FAB "+" central (azul circular) abre bottom sheet:
  - Peso (ícone balança azul com +)
  - Beber água (ícone copo azul com +)
  - Corpo (ícone fita métrica com 🔒 laranja — no OKOK bloqueado, no nosso app LIBERADO)
  - "Adicionar dispositivo" (pill outline/borda, texto azul)
- [ ] Tab bar fixa: Home (🏠 preenchido), "+" (FAB azul circular), Configurações (⚙️ azul outline)

### Etapa 6 — Tela Histórico
- [ ] Filtros de período: 7d, 30d, 90d, Todos
- [ ] Gráfico de linha (Victory Native) com evolução da métrica selecionada
- [ ] Seletor de métrica: Peso, Gordura%, IMC, Água%, Massa Muscular, Gordura Visceral, BMR
- [ ] Lista cronológica com deltas

### Etapa 7 — Tela Perfil/Configurações
- [ ] Header gradient (rosa/laranja→branco): "Olá,xmontesino" (sem espaço após vírgula) + subtítulo "OKOK Ajudou Você a Gerenciar o Peso por X Dias" + avatar circular azul à direita
- [ ] Banner VIP laranja (ignorar no nosso app — sem paywall)
- [ ] **Grupo 1:** "Meu perfil" (👤 + 🎂 43 | 180cm >) + "Membro da família" (👥 >)
- [ ] **Grupo 2:** "Lembrete de notificação" (🔔 >) + "Configurações de unidade/idioma" (🌐 >)
- [ ] **Grupo 3:** "Centro de Ajuda" (❤️ >) + "Feedback" (😊 >)
- [ ] **Grupo 4:** "Estilo de tema" (👑 + 🔥 >) + "Widget" (⊞ >)
- [ ] **Grupo 5:** "Dispositivo" (📦 >) + "Definições" (ⓘ >)
- [ ] Cada grupo separado por espaço/background diferente (alternância branco/cinza claro)
- [ ] Tab bar visível no bottom: 🏠 + ➕azul + ⚙️azul
- [ ] Formulário do perfil: nome, data nascimento, altura, sexo, nível atividade (1-5)
- [ ] Meta de peso com projeção

### Etapa 7.1 — Tela Dispositivo
- [ ] Header: "< Dispositivo" centralizado + botão "⊕" no canto superior direito
- [ ] Card de dispositivo pareado: ícone balança (quadrado cinza com balança) à esquerda + nome "Balança Bluetooth1" + MAC "50:E4:52:A2:3E:4C" cinza + chevron > à direita
- [ ] Empty state se nenhum dispositivo
- [ ] Botão "Adicionar dispositivo" fixo no bottom (pill gradient azul→roxo, texto branco)
- [ ] Tocar no dispositivo navega para Informação da Balança

### Etapa 7.2 — Tela Informação da Balança
- [ ] Header: "< Informação da balança" centralizado
- [ ] Cards em lista vertical com fundo #F8F9FA:
  - Nome: "Balança Bluetooth1" + chevron > (editável)
  - MAC: "50:E4:52:A2:3E:4C" (readonly, sem chevron)
  - Fábrica: "/" (vazio/desconhecido)
  - Telefone número: "/" (vazio)
  - Endereço: "/" (vazio, campo multiline)
- [ ] Botão "Não par" fixo no bottom (pill gradient azul→roxo, texto branco) — despareia dispositivo

### Etapa 7.3 — Tela Membro da Família
- [ ] Header: "< Membro da família" centralizado + botão "⊕" no canto superior direito
- [ ] Empty state: ilustração caixa cinza aberta com laço + "Sem Membros da Família" texto cinza + botão "Adicionar" (pill gradient azul→roxo grande)
- [ ] Lista de membros com avatar, nome, idade, altura
- [ ] Formulário de adicionar: nome, data nascimento, altura, sexo
- [ ] Membro pode ser selecionado como perfil ativo

### Etapa 8 — Módulo Beber Água
- [ ] Header: "< Água" (voltar à esquerda, título centralizado)
- [ ] Copo animado grande (cyan/turquesa), nível sobe ao adicionar, fundo claro
- [ ] Setas ↑↓ dentro do copo (botões brancos circulares com chevron)
- [ ] Tooltip preto "Clique para experimentar" (balão com seta) no primeiro uso, aparece próximo ao bottom do copo
- [ ] Ícone garrafa d'água azul à direita do copo (fora do copo)
- [ ] Display "50ml" grande centralizado + ícone editar ✏️ ao lado
- [ ] Carrossel horizontal de bebidas (com seta > azul pill para paginar):
  - **Página 1:** Água (borda cyan, SEM cadeado) → Água com gás (🔒) → Água com gás 2 (🔒) → Água de coco (🔒 parcial)
  - **Página 2:** Água de coco (🔒) → Leite de coco (🔒) → Leite (🔒) → Iogurte (🔒)
  - **Página 3:** Leite de amêndoa (🔒) → Sopa (🔒) → Leite de aveia (🔒)
  - **Página 4:** Café (SEM cadeado) → Descafeinado
  - **(No nosso app: TODOS liberados, sem cadeados)**
- [ ] Cada bebida: ícone circular colorido + nome embaixo + badge 🔒 cinza no canto inferior direito (quando bloqueado)
- [ ] Bebida selecionada: borda cyan ao redor do ícone
- [ ] Botão "Adicionar · {nome bebida}" fixo no bottom (pill gradient cyan, texto branco)
- [ ] **Tela calendário/stats:** 
  - Header: nome do usuário + mês "2026/02" + ícones ⊙↻
  - Calendário semanal horizontal (dias 22-28, dia atual destacado cyan)
  - Cada dia com ícone gota abaixo
  - Display "0ml" grande centralizado
  - Welcome popup (modal): ilustração menino bebendo água + "Bem-vindo/a a usar a função de beber água" + "Defina um objetivo de consumo de água que se adeque a você, e ajudaremos você a desenvolver hábitos saudáveis de beber água" + botão "confirme" cyan pill
  - Stats no bottom: "X dias > Beber continuamente" | "Y ml > Média da semana"
- [ ] Meta diária: ~2637ml (fórmula baseada no peso/perfil)

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
| 01 | ...at 12.19.48 (1).jpeg | Home bottom: PesoTendência (-1.5Kg, gráfico), Beber água active (0ml, 0%·Restante2637ml, ⊕+250+450, gota), Calorias (0Cal, Alvo 2073Cal, 4 ícones), Cintura (Sem dados) |
| 02 | ...at 12.19.48 (2).jpeg | VIP popup (ignorar — sem paywall) |
| 03 | ...at 12.19.48 (3).jpeg | Tela Água: copo cyan, tooltip "Clique para experimentar", garrafa azul, 50ml✏️, carrossel pag4: Leite aveia(🔒), Leite amêndoa(🔒), Café(livre), Descafeinado |
| 04 | ...at 12.19.48.jpeg | Configurações top: "Olá,xmontesino" + avatar + banner VIP + grupos perfil/família/notif/idioma/ajuda/feedback/tema/widget |
| 05 | ...at 12.19.49 (1).jpeg | Tela Água carrossel pag2: Água de coco(🔒), Leite coco(🔒), Leite(🔒), Iogurte(🔒) |
| 06 | ...at 12.19.49 (2).jpeg | Tela Água carrossel pag1: Água (selecionada, borda cyan, livre), Água com gás(🔒), Água com gás 2(🔒), Água de coco(🔒) |
| 07 | ...at 12.19.49 (3).jpeg | Tela Água calendário: header nome+mês, semana 22-28 (24 cyan), 0ml, welcome popup "Bem-vindo/a", stats 0dia/0ml |
| 08 | ...at 12.19.49 (4).jpeg | Home + bottom sheet: Peso/Beber água/Corpo(🔒)/Adicionar dispositivo |
| 09 | ...at 12.19.49.jpeg | Tela Água carrossel pag3: Leite amêndoa(🔒), Sopa(🔒), Leite aveia(🔒) |
| 10 | ...at 12.19.50 (1).jpeg | Home middle: Jejum(relógio+legumes), PesoTendência, Beber água welcome(bebidas), Calorias |
| 11 | ...at 12.19.50 (2).jpeg | Home top completo: avatar+xmontesino+⊞↻, card Balança Bluetooth1, 113.75kg, barra sem números, Obeso, -1.6, Comece a pesar, Jejum, PesoTendência |
| 12 | ...at 12.19.50 (3).jpeg | Detalhes bottom: Gordura visceral→Altura + "Ir para configurações" |
| 13 | ...at 12.19.50.jpeg | Home scrolled: PesoTendência, Beber água welcome, Calorias, Cintura |
| 14 | ...at 12.19.51 (1).jpeg | Detalhes top: header "Detalhes" + 3 ícones, card peso Obeso😐, barra 59.94/80.68/96.88, métricas 1-5 |
| 15 | ...at 12.19.51 (2).jpeg | Detalhes top (device 9:46 "Evento") — mesma estrutura |
| 16 | ...at 12.19.51.jpeg | Detalhes middle: métricas 6-18 |
| 17 | ...at 12.19.47.jpeg | Membro da família: empty state, caixa cinza, "Sem Membros da Família", botão "Adicionar" gradient |
| 18 | ...at 12.19.47 (1).jpeg | Info balança: Nome "Balança Bluetooth1>", MAC 50:E4:52:A2:3E:4C, Fábrica/, Tel/, End/, "Não par" gradient |
| 19 | ...at 12.19.47 (2).jpeg | Dispositivo: card balança+MAC+chevron, "Adicionar dispositivo" gradient |
| 20 | ...at 12.19.47 (3).jpeg | Configurações scrolled: mesmos grupos + Dispositivo(📦) + Definições(ⓘ) no final |
| 21 | ...at 11.19.33 (1).jpeg | Detalhes top (alta resolução): confirmação layout e métricas 1-5 |
| 22 | ...at 11.19.33.jpeg | Detalhes middle (alta resolução): métricas 6-18 |
| 23 | ...at 11.19.32.jpeg | Detalhes bottom (alta resolução): métricas 11-19 + botão config |
| 24 | ...at 11.19.33 (2).jpeg | Detalhes top (alta res, outro device 9:46) |

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
│ ⏱ Comparado com a última vez    -1.6    │
│    (2026/02/23)                          │
│ 🔥 Melhor peso de 30 dias       - -     │
└──────────────────────────────────────────┘
```

### Home — Layout Exato
```
┌──────────────────────────────────────────┐
│ (avatar) xmontesino          ⊞  ↻       │
│   👁                                      │
├──────────────────────────────────────────┤
│ ┌─ Card gradient azul claro ───────────┐ │
│ │ Balança Bluetooth1      [História]   │ │
│ │ 2026/02/24 09:40:32                  │ │
│ │ 👁  113.75 Kg                        │ │
│ │ ████████████████████████  [Obeso]    │ │
│ │ -1.6                     - -         │ │
│ │ Comparado última vez  Melhor 30 dias │ │
│ └──────────────────────────────────────┘ │
│ ┌──────────────────────────────────────┐ │
│ │       Comece a pesar                 │ │
│ └──────────────────────────────────────┘ │
│ ┌─ Jejum ──────────────────────────────┐ │
│ │ Bem-vindo/a              🕐🥕🍒      │ │
│ │ Comece o seu plano                   │ │
│ │ de jejum!                            │ │
│ └──────────────────────────────────────┘ │
│ ┌─ PesoTendência ─────────────────────┐ │
│ │ 📈 PesoTendência          >         │ │
│ │ -1.5 Kg        ┌──────┐             │ │
│ │ Mudanças rec    │gráfico│ 02/23-02/24│ │
│ └──────────────────────────────────────┘ │
│ ┌─ Beber água ─────────────────────────┐ │
│ │ Beber água                  >        │ │
│ │ (welcome OU active state)            │ │
│ └──────────────────────────────────────┘ │
│ ┌─ Registro de calorias ──────────────┐ │
│ │ Registro de calorias         >       │ │
│ │ 0Cal   Alvo 2073Cal                 │ │
│ │ 🍳  🍴  🍽  😊                        │ │
│ └──────────────────────────────────────┘ │
│ ┌─ Cintura ────────────────────────────┐ │
│ │ 📐 Cintura                   >       │ │
│ │ Sem dados                            │ │
│ └──────────────────────────────────────┘ │
├──────────────────────────────────────────┤
│   🏠          ➕          ⚙️             │
└──────────────────────────────────────────┘
```

### Bottom Sheet (FAB "+")
```
┌──────────────────────────────────────────┐
│          ─── (drag handle)               │
│                                          │
│  🏋️+ Peso    🥤+ Beber     📏🔒 Corpo   │
│              água                        │
│                                          │
│  ┌──────────────────────────────────────┐│
│  │      Adicionar dispositivo           ││
│  └──────────────────────────────────────┘│
└──────────────────────────────────────────┘
```

### Configurações — Layout Exato
```
┌──────────────────────────────────────────┐
│ ┌─ Header gradient rosa/laranja ───────┐ │
│ │ Olá,xmontesino        (avatar azul)  │ │
│ │ OKOK Ajudou Você a                   │ │
│ │ Gerenciar o Peso por X Dias          │ │
│ └──────────────────────────────────────┘ │
│ [Banner VIP — ignorar no nosso app]     │
│ ┌──────────────────────────────────────┐ │
│ │ 👤 Meu perfil    🎂43 | 180cm  >    │ │
│ │ 👥 Membro da família            >    │ │
│ └──────────────────────────────────────┘ │
│ ┌──────────────────────────────────────┐ │
│ │ 🔔 Lembrete de notificação      >    │ │
│ │ 🌐 Config de unidade/idioma     >    │ │
│ └──────────────────────────────────────┘ │
│ ┌──────────────────────────────────────┐ │
│ │ ❤️ Centro de Ajuda              >    │ │
│ │ 😊 Feedback                     >    │ │
│ └──────────────────────────────────────┘ │
│ ┌──────────────────────────────────────┐ │
│ │ 👑 Estilo de tema          🔥  >    │ │
│ │ ⊞ Widget                        >    │ │
│ └──────────────────────────────────────┘ │
│ ┌──────────────────────────────────────┐ │
│ │ 📦 Dispositivo                  >    │ │
│ │ ⓘ Definições                    >    │ │
│ └──────────────────────────────────────┘ │
├──────────────────────────────────────────┤
│   🏠          ➕          ⚙️             │
└──────────────────────────────────────────┘
```

### Tela Água — Layout Exato
```
┌──────────────────────────────────────────┐
│ <                Água                    │
├──────────────────────────────────────────┤
│          ┌──────────────┐                │
│          │              │                │
│          │     ⬆️       │                │
│          │              │                │
│          │     ⬇️       │                │
│          │              │                │
│          │  ~~~~~~~~~~~~│       🧴       │
│          │  █████████████│               │
│          └──────────────┘                │
│              50ml ✏️                      │
│                                          │
│ (💧Água) (🥤Gás🔒) (🥤Gás2🔒) (🥥🔒) > │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │        Adicionar · Água              │ │
│ └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

### Tela Dispositivo — Layout Exato
```
┌──────────────────────────────────────────┐
│ <        Dispositivo              ⊕      │
├──────────────────────────────────────────┤
│ ┌──────────────────────────────────────┐ │
│ │ [⚖️]  Balança Bluetooth1       >    │ │
│ │       50:E4:52:A2:3E:4C             │ │
│ └──────────────────────────────────────┘ │
│                                          │
│                 ...                      │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │      Adicionar dispositivo           │ │
│ └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

### Tela Info Balança — Layout Exato
```
┌──────────────────────────────────────────┐
│ <    Informação da balança               │
├──────────────────────────────────────────┤
│ Nome            Balança Bluetooth1  >    │
│ MAC             50:E4:52:A2:3E:4C       │
│ Fábrica                          /      │
│ Telefone número                  /      │
│ Endereço                                │
│   /                                     │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │            Não par                   │ │
│ └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

### Tela Membro da Família — Layout Exato (Empty State)
```
┌──────────────────────────────────────────┐
│ <    Membro da família            ⊕      │
├──────────────────────────────────────────┤
│                                          │
│            📦 (caixa aberta)             │
│                                          │
│        Sem Membros da Família            │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │           Adicionar                  │ │
│ └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

---

## Dados de Exemplo (Seed) — Medição Real Alexandre

```json
{
  "user": {
    "name": "xmontesino",
    "birthdate": "1983-XX-XX",
    "age": 43,
    "height_cm": 180,
    "sex": "male",
    "activity_level": 3
  },
  "device": {
    "name": "Balança Bluetooth1",
    "mac": "50:E4:52:A2:3E:4C"
  },
  "measurement": {
    "datetime": "2026-02-24T09:40:32",
    "weight_kg": 113.75,
    "bmi": 35.1,
    "body_fat_pct": 34.7,
    "fat_weight_kg": 39.5,
    "skeletal_muscle_pct": 33.0,
    "skeletal_muscle_weight_kg": 37.5,
    "muscle_rate_pct": 61.5,
    "muscle_weight_kg": 70.0,
    "water_pct": 48.8,
    "water_weight_kg": 55.5,
    "visceral_fat": 27.0,
    "bone_weight_kg": 4.0,
    "bmr": 2143.6,
    "protein_pct": 12.8,
    "obesity_pct": 62.5,
    "metabolic_age": 52.0,
    "lbm_kg": 74.29,
    "real_age": 42,
    "height_cm": 180
  },
  "previous_measurement": {
    "date": "2026-02-23",
    "weight_delta": -1.6
  },
  "water_goal_ml": 2637,
  "calorie_goal": 2073,
  "weight_thresholds_180cm": {
    "underweight_max": 59.94,
    "healthy_max": 80.68,
    "overweight_max": 96.88
  }
}
```

---

## Tema e Cores

| Elemento | Cor |
|----------|-----|
| Fundo principal | #FFFFFF |
| Fundo alternado linhas | #F8F9FA |
| Card Detalhes fundo | gradient azul claro (#E8F0FE → #F0F4FF) |
| Card Home fundo | gradient azul claro similar |
| Barra peso - Baixo | #4A90D9 (azul) |
| Barra peso - Saudável | #4CAF50 (verde) |
| Barra peso - Alto | #FFC107 (amarelo) |
| Barra peso - Obeso | #F44336 (vermelho) |
| Badge Obeso/Grave | #F44336 texto vermelho |
| Badge Saudável/Excelente | #4CAF50 texto verde |
| Badge Baixo/Alto | #00BCD4 texto cyan |
| Botão gradient primário | azul→roxo (#5B7FFF → #8B5CF6) |
| Botão gradient Água | cyan (#00BCD4 → #26C6DA) |
| Botão outline | borda #333, fundo transparente |
| FAB central | #2196F3 (azul) |
| Tab bar ícones ativos | #2196F3 (azul) |
| Tab bar ícones inativos | #999 (cinza) |
| Header Config gradient | rosa/laranja (#FF9A9E → #FECFEF → branco) |
| Tooltip | #333 fundo preto, texto branco |
| Copo água | #00BCD4 / #E0F7FA |
| Texto principal | #1A1A1A |
| Texto secundário | #666666 |
| Texto desabilitado | #CCCCCC |

---

## Changelog v2 → v3

### Correções baseadas na análise completa dos 24 prints:

1. **Beber água - formato display**: Corrigido de "0ml/2637ml" para "0ml" + "0% · Restante2637ml"
2. **Beber água - ícones quick-add**: Detalhado como 3 ícones (⊕azul customizado + 250 + 450), não apenas "250/450"
3. **Home card - ícone olho**: Confirmado posição à ESQUERDA do peso (👁 113.75 Kg)
4. **Config header**: Formato exato "Olá,xmontesino" (sem espaço após vírgula)
5. **Config subtítulo**: Texto exato "OKOK Ajudou Você a Gerenciar o Peso por X Dias"
6. **Bottom sheet**: "Adicionar dispositivo" é pill OUTLINE (borda, não gradient)
7. **Carrossel água**: Ordem completa das 4 páginas documentada com status exato de cada 🔒
8. **Tela água stats**: Layout exato com calendário semanal + welcome popup + stats documentados
9. **19 métricas**: Tabela completa com ícones, valores e cores de badges
10. **Cores do tema**: Tabela completa de cores extraída dos prints
11. **Layouts ASCII**: Adicionados para Home, Config, Água, Dispositivo, Info Balança, Membro Família
12. **Seed data JSON**: Estruturado com todos os valores + thresholds + metas
13. **Referência visual**: Tabela atualizada com descrição detalhada de cada print

### Itens confirmados sem alteração:
- Stack tecnológico
- Etapas de implementação (ordem e escopo)
- Protocolo BLE Chipsea
- Fórmulas de cálculo
- Estrutura de navegação (tabs)

# Instrução para Claude Code — BIA Scale App

Leia o arquivo `C:\Users\xmont\Downloads\print_balanca\BIA-SCALE-APP-SPEC-v3.md` — essa é a especificação completa do app.

## Regras de execução:
1. Execute UMA etapa por vez (Etapa 1, depois Etapa 2, etc.)
2. Após completar cada etapa, PARE e me diga "Etapa X concluída. Devo prosseguir para Etapa Y?"
3. Teste cada etapa antes de avançar
4. Se der erro, corrija ANTES de avançar

## Comece pela Etapa 1 — Setup do Projeto:
- Crie o projeto com `npx create-expo-app bia-scale --template tabs`
- Instale todas as dependências listadas na spec
- Configure expo-router com as 3 tabs (Home, "+", Configurações)
- Crie a estrutura de pastas: src/{components, screens, lib, store, types, constants}
- Configure o tema global com as cores da seção "Tema e Cores" da spec

Após terminar a Etapa 1, me avise e aguarde confirmação para a Etapa 2.

# TaskList como Board de Projetos Dark

## Summary / Resumo
- Transformar a UI em uma tela escura estilo Figma "neo UI", onde cada projeto é uma coluna/box com borda neon sutil.
- Cada projeto terá várias tasks vinculadas, exibindo inicialmente apenas as 3 primeiras da pilha.
- Cada coluna terá ação de expandir/recolher tasks e botão próprio para adicionar task já vinculada ao projeto.
- O drag and drop reordenará apenas tasks dentro da pilha do mesmo projeto.
- Após os 5 passos principais, reforçar a responsividade para desktop, tablet, smartphones modernos e smartphones legados.

## Data Model / Modelo de dados
- Atualizar o `db.json` para ter `projects`, uma lista de projetos com `id`, `name`, `color` e `position`.
- Manter `tasks` com `id`, `title`, `cost`, `dueDate` e `position`, adicionando `projectId`.
- Criar um projeto padrão inicial e vincular todas as tasks atuais a ele.
- Manter o JSON Server em `http://localhost:5000`.

## Key Changes / Mudanças principais
- UI:
  - Criar um board responsivo com colunas de projeto.
  - Em desktop e tablet, mostrar colunas lado a lado com scroll horizontal quando necessário.
  - Em mobile, manter colunas com largura mínima confortável e rolagem horizontal do board.
  - Usar tema dark minimalista com fundo quase preto, cards grafite, texto cyan/verde e acentos por projeto.
  - Remover estilos inline e seletores globais vazando dos CSS Modules.

- Projetos:
  - Adicionar modal/form de criação de projeto com nome e cor.
  - Cada coluna deve mostrar título do projeto, contador de tasks, botão de adicionar task e botão de expandir/recolher.
  - Por padrão, mostrar 3 tasks por projeto; ao expandir, mostrar todas.

- Tasks:
  - Adaptar a criação de task para receber `projectId`.
  - Manter edição, exclusão e validação de duplicidade, restringindo duplicidade ao mesmo projeto.
  - Manter a regra visual de custo alto, usando acento/borda warning em vez de card amarelo sólido.

- Drag and drop:
  - Instalar `@dnd-kit/core`, `@dnd-kit/sortable` e `@dnd-kit/utilities`.
  - Implementar reorder somente dentro da coluna do projeto.
  - Ao soltar uma task, recalcular `position`, atualizar estado local e persistir via `PUT`.
  - Manter botões subir/descer como fallback acessível dentro de cada coluna.

## Responsive Coverage / Cobertura responsiva
- Após os 5 passos principais do plano, reforçar a responsividade do webapp para desktop, tablet, smartphones modernos e smartphones legados.
- Garantir que a página não tenha overflow horizontal global; quando houver muitas colunas, o scroll horizontal deve ficar restrito ao board.
- Ajustar espaçamentos, larguras de colunas, header, toolbar, cards de task, botões e modais para telas estreitas e telas com pouca altura.
- Breakpoints de referência:
  - Desktop amplo: `1440px`.
  - Tablet: `768px`.
  - Smartphone moderno: `390px`.
  - Smartphone legado: `320px`.
- Em smartphones legados, reduzir paddings, compactar cards e permitir que ações de task quebrem em múltiplas linhas sem sobreposição.

## Test Plan / Plano de testes
- Rodar `npm run lint` e `npm run build`.
- Validar com `npm run json-server` e `npm run dev`.
- Testar criação de projeto, criação de task, edição de task e exclusão de task por projeto.
- Confirmar que cada coluna mostra 3 tasks, expande e recolhe corretamente.
- Reordenar tasks por drag dentro de um projeto, recarregar a página e confirmar persistência.
- Testar responsividade em `1440px`, `768px`, `390px` e `320px`.
- Confirmar ausência de overflow horizontal da página e ausência de erros no console em todos os breakpoints.

## Assumptions / Premissas
- Projetos terão apenas nome e cor na primeira versão.
- Tasks não serão arrastadas entre projetos nesta etapa.
- A exclusão e edição de projetos ficam fora da v1, salvo se forem solicitadas antes da implementação.
- O novo arquivo será criado antes da implementação do código.
- O conteúdo é baseado no último plano aprovado na conversa, incluindo a etapa extra de responsividade solicitada depois da implementação inicial.

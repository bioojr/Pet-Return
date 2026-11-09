# RELATÓRIO TÉCNICO — PETRETURN

Inspeção realizada em 09/11/2026. Relatório destinado à continuidade por outra IA. Nenhum arquivo da implementação foi alterado nesta tarefa; foram executadas leituras, verificações configuradas e sondagens em memória. Build e TypeScript podem atualizar seus artefatos gerados. Este relatório é o único novo arquivo de documentação produzido nesta tarefa.

## 1. RESUMO

**Objetivo:** demonstrar um site que ajuda a reconhecer animais perdidos ou encontrados, com anúncios, busca e organização local. A aplicação atual não conecta pessoas de dispositivos diferentes nem publica anúncios na internet.

**Pasta:** `C:\Users\fabio.junior\Projetos\Privado\petreturn`. No Windows desta máquina, corresponde à pasta solicitada como `PetReturn`.

**Estado observado:** aplicação Next.js com oito páginas explícitas, rota dinâmica de detalhes, componentes de interface, regras de domínio e persistência local implementados. Há um servidor respondendo em `http://127.0.0.1:3000`. A checagem de tipos, os 12 testes de domínio, os testes HTTP e o build passaram novamente nesta inspeção.

**Comprovado por execução:** compilação de produção; tipos; regras puras de busca, cadastro, alteração, favoritos, exclusão, estados e serialização; respostas HTTP das URLs configuradas; disponibilidade dos sete SVGs; resposta 404 de uma rota desconhecida.

**Existe no código, mas não está comprovado ponta a ponta:** preenchimento e envio do formulário, navegação após salvar, edição pela interface, diálogos, botões de status, gravação real no localStorage, persistência depois de recarregar, comportamento de teclado e apresentação nos diferentes tamanhos de tela. Os testes atuais não montam componentes nem executam JavaScript em navegador.

**Incompleto:** validação e recuperação de dados podem ser reforçadas; há riscos de sobrescrita entre abas, parâmetros de URL não reativos e ordenação dos recentes. Há contraste insuficiente em alguns textos auxiliares. Não há teste automatizado de componentes ou de navegador, auditoria completa de acessibilidade ou confirmação visual da responsividade.

**Bloqueado:** a verificação visual/interativa por ferramentas desta sessão. O conector de navegador retornou `The browser access host is unavailable`. A tentativa alternativa de selecionar uma janela existente do Edge foi interrompida pelo controle de Computer Use porque não conseguiu identificar a URL atual com confiança suficiente para aplicar sua política. Nenhuma tela do PetReturn foi inspecionada por esse caminho. Não há bloqueador confirmado de tipos, testes de domínio ou build.

Banco, autenticação, uploads, publicação, contato real e serviços externos estão ausentes por decisão de escopo; não são funcionalidades concluídas nem falhas em relação à demonstração local solicitada.

## 2. TECNOLOGIAS

Versões efetivamente consultadas no ambiente e nos pacotes instalados:

- Node.js: **22.22.0**.
- npm: **11.12.1**.
- Next.js: **15.0.0**, versão exata declarada.
- React e React DOM: **19.0.0-rc-65a56d0e-20241020**, versões exatas declaradas.
- TypeScript: **5.9.3**, declarado como `^5`.
- Tailwind CSS: **3.4.19**, declarado como `^3.4.1`.
- PostCSS: **8.5.32**, declarado como `^8`.
- `@types/react`: **18.3.31**, declarado como `^18`.
- `@types/node`: **20.19.43**, declarado como `^20`.
- `@types/react-dom`: dependência declarada como `^18`.

Gerenciador: npm. Lockfile presente: `package-lock.json`, formato `lockfileVersion: 3`. Não há necessidade de instalar ferramentas para executar os testes existentes. Nenhuma dependência foi instalada durante esta inspeção.

Finalidade das dependências:

- `next`: App Router, roteamento, renderização, servidor local e build.
- `react` / `react-dom`: componentes, contexto, efeitos e atualização de interface.
- `typescript` / `@types/*`: checagem estática e tipos de ambiente. O teste de domínio também usa o compilador TypeScript em memória.
- `tailwindcss` / `postcss`: processamento das diretivas Tailwind e estilos. A apresentação é majoritariamente CSS próprio, não uma composição extensa de classes utilitárias.

Scripts exatos de `package.json`:

```text
dev       next dev --hostname 127.0.0.1
build     next build
start     next start --hostname 127.0.0.1
typecheck tsc --noEmit
test      node --test tests/domain.test.cjs
test:http node tests/http-smoke.cjs
```

Não existe script de lint separado, teste de navegador ou dependência direta de banco, cliente HTTP, biblioteca de formulários, kit de UI ou mecanismo de autenticação. O build imprime uma etapa de lint/tipos, mas isso não equivale a uma suíte ESLint própria configurada no projeto. React está em versão candidata e seus tipos estão na versão principal 18; isso é um risco de manutenção a avaliar, não um erro de compilação observado. Não foi feito levantamento externo de vulnerabilidades ou versões mais recentes.

## 3. ESTRUTURA

Árvore relevante, sem `.git`, `node_modules`, `.next`, `next-env.d.ts`, cache incremental e demais artefatos gerados:

```text
petreturn/
├── .gitignore
├── package.json
├── package-lock.json
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── tailwind.config.ts
├── README.md
├── PETRETURN_CONTEXT.md
├── RELATORIO_PETRETURN.md
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   ├── window.svg
│   └── illustrations/
│       ├── hero.svg
│       ├── dog-caramel.svg
│       ├── dog-white.svg
│       ├── dog-black.svg
│       ├── cat-orange.svg
│       ├── cat-gray.svg
│       └── rabbit.svg
├── src/
│   ├── lib/
│   │   └── pets.ts
│   ├── components/
│   │   ├── store.tsx
│   │   ├── ui.tsx
│   │   ├── screens.tsx
│   │   └── pet-form.tsx
│   └── app/
│       ├── layout.tsx
│       ├── globals.css
│       ├── page.tsx
│       ├── not-found.tsx
│       ├── icon.svg
│       ├── favicon.ico
│       ├── fonts/
│       │   ├── GeistVF.woff
│       │   └── GeistMonoVF.woff
│       ├── buscar/page.tsx
│       ├── cadastrar/page.tsx
│       ├── meus-anuncios/page.tsx
│       ├── favoritos/page.tsx
│       ├── ajuda/page.tsx
│       ├── como-funciona/page.tsx
│       └── pet/[id]/page.tsx
└── tests/
    ├── domain.test.cjs
    └── http-smoke.cjs
```

Responsabilidades:

- `src/lib/pets.ts`: tipos, listas de opções, oito exemplos, normalização, busca, datas, validação, decodificação de dados e operações puras de anúncios/favoritos.
- `store.tsx`: Provider cliente compartilhado, montagem inicial, sinal `ready`, leitura/gravação de localStorage e avisos. Não implementa sincronização entre abas.
- `ui.tsx`: logo, SVGs de ícones inline, cabeçalho, navegação, rodapé, aviso da demonstração, badges, cards, títulos e estados vazios.
- `screens.tsx`: Home, busca, detalhes, favoritos, Meus anúncios, confirmação e ajuda. Muitas telas estão concentradas neste arquivo, em linhas extensas.
- `pet-form.tsx`: seleção perdido/encontrado, formulário, validação e modo de edição por query string.
- `layout.tsx`: idioma `pt-BR`, metadados comuns, fonte local Geist, Provider e estrutura global.
- `globals.css`: estilos próprios, cores, grids, estados, foco, modal e media queries. Grande parte do CSS está compactada em poucas linhas longas.
- `app/**/page.tsx`: pequenos pontos de entrada, delegando às telas. Detalhes aguarda `params` no servidor e entrega o id ao componente cliente.
- `next.config.ts`: configuração padrão, sem opções adicionais relevantes.
- `tsconfig.json`: `strict: true`, `noEmit: true`, `skipLibCheck: true`, resolução `bundler`, alias `@/*` para `src/*` e plugin Next.
- `tailwind.config.ts`: varredura de `src/app`, `src/components` e `src/pages`; os tokens legados `background`/`foreground` apontam a variáveis não definidas no CSS atual, sem uso observado na aplicação.
- `postcss.config.mjs`: plugin Tailwind.
- `domain.test.cjs`: transpila apenas `pets.ts` para CommonJS em memória e testa suas funções usando o runner nativo do Node. Não importa nem monta o Provider ou as telas.
- `http-smoke.cjs`: usa `fetch` do Node para verificar respostas e pequenos marcadores HTML/SVG. Não é navegador.
- `README.md`: instruções operacionais; `PETRETURN_CONTEXT.md`: contexto da implementação e propostas futuras. São documentação, não evidência suficiente de funcionamento por si só.

Os cinco SVGs soltos em `public/` e a fonte mono são sobras do scaffold, sem referência nos componentes inspecionados. A fonte efetivamente configurada no layout é `GeistVF.woff`.

## 4. ROTAS E FUNCIONALIDADES

Nesta seção, “implementado” significa encontrado no código. A comprovação de execução é delimitada na seção 8; não interpretar a existência dos handlers como teste de integração aprovado.

### `/` — Home

- Arquivos: `src/app/page.tsx`; `Home` em `screens.tsx:8`; componentes globais em `ui.tsx` e `layout.tsx`.
- Implementado: hero solicitado, chamadas de cadastro/busca, formulário GET de busca rápida com `q` e `regiao`, entradas de perdido/encontrado, quatro cards, passos de uso, segurança e rodapé.
- Dados: `all` do Provider, isto é, anúncios locais seguidos dos exemplos; filtra ativos e usa `slice(0,4)`.
- Evidência: HTTP 200, HTML com textos do hero e componentes estáticos; build aprovado.
- Pendências: não houve teste dos cliques ou busca rápida no navegador. Os “recentes” não são ordenados explicitamente por `createdAt` ou ocorrência; editar também move um anúncio para o começo. A legenda diz “anúncios de exemplo” mesmo quando os quatro primeiros contêm anúncios locais; os cards individuais têm identificação correta de origem.

### `/buscar` — Busca de animais

- Arquivos: `src/app/buscar/page.tsx`; `Search` em `screens.tsx:19`; `filterPets` em `pets.ts:27`; `PetCard` em `ui.tsx`.
- Implementado: campos de texto e região, situação, espécie, porte e sexo; combinação automática; contagem; limpeza; estado vazio; cards.
- Dados: exemplos + locais, somente `state === "ativo"`.
- Evidência: regras puras testadas; HTTP 200. Leitura inicial de `q`, `regiao` e `status` existe em efeito de montagem.
- Limitações: filtragem inteiramente em memória, sem paginação, mapa ou consulta remota. Mudanças dos filtros não atualizam a URL. Mudanças de query string com a mesma tela montada podem não atualizar os campos; precisa reprodução no navegador. Os dois botões de limpeza têm efeitos diferentes sobre a URL: só o do painel chama `replaceState`.

### `/pet/[id]` — Detalhes

- Arquivos: `src/app/pet/[id]/page.tsx`; `Detail` em `screens.tsx:27`; componentes de `ui.tsx`.
- Implementado: espera `ready`, procura por id, mostra ilustração, situação, origem, características, descrição, região aproximada, data e favorito. Link de edição apenas para id local. Mostra mensagem de anúncio inexistente.
- Dados: `all` no cliente, incluindo pausados e reencontrados.
- Evidência: `/pet/exemplo-1` e `/pet/inexistente` retornaram HTTP 200; o código do tratamento de ausência foi lido. O teste de domínio verifica procura por id em um array, não a renderização desta tela.
- Limitações: o HTML inicial contém carregamento; os testes HTTP não comprovam que o cliente exibiu o animal ou a mensagem de ausência. Id inexistente não gera status HTTP 404; gera estado vazio cliente com HTTP 200. Não existe contato real, mapa ou compartilhamento. Um id local só existe no armazenamento da mesma origem/navegador.

### `/cadastrar` e `/cadastrar?status=perdido|encontrado` — Cadastro

- Arquivos: `src/app/cadastrar/page.tsx`; `PetForm` em `pet-form.tsx:12`; `validatePet` em `pets.ts:30`; Provider.
- Implementado: escolha da situação, características, região, ocorrência, seis ilustrações, erros por campo e foco no primeiro erro. Ao salvar, gera `local-${crypto.randomUUID()}`, mantém valores tratados com `trim`, grava pelo Provider e solicita navegação aos detalhes com `router.push`.
- Dados: estado do formulário, opções TypeScript e localStorage via Provider. Data inicial é a data local do dispositivo.
- Evidência: validação/domínio testados; URLs padrão e `?status=encontrado` responderam 200.
- Limitações: envio real, geração de UUID, redirecionamento e gravação no navegador não foram executados nesta inspeção. Não há upload nem pedido de contato. O validator não verifica todos os enums de forma independente; os selects limitam o caminho normal da interface. A descrição apenas orienta a não inserir dados pessoais: não existe detector ou bloqueador desse conteúdo.

### `/cadastrar?editar=ID` — Edição

- Arquivos: os mesmos do cadastro; inicialização em `pet-form.tsx:16` e montagem do registro em `:23`.
- Implementado: procura o id em `store.pets`, preenche os campos, salva por substituição do mesmo id, preservando `createdAt` e `state`. Id não local ou ausente produz estado vazio com link para Meus anúncios.
- Dados: somente registros locais; exemplos não são editáveis pela interface.
- Evidência: operação pura de edição sem duplicar id testada. Nenhum caso `?editar=...` está no smoke HTTP configurado; fluxo completo de edição não foi testado em navegador.
- Pendências: `initialized` impede nova inicialização dentro da mesma instância de componente; confirmar mudança de edição para novo cadastro sem sair da rota. `savePet` coloca a edição na primeira posição, alterando a ordem dos recentes.

### `/meus-anuncios`

- Arquivos: `src/app/meus-anuncios/page.tsx`; `MyListings` em `screens.tsx:41`; `Confirm` em `:46`.
- Implementado: lista somente locais; link para editar; pausa; reativação; marcação de reencontro; exclusão com diálogo; mensagens de resultado; estado vazio. Excluir também remove o id dos favoritos.
- Dados: `pets` do Provider. Não lista exemplos.
- Evidência: transições de estado e exclusão testadas em funções puras; HTTP 200.
- Limitações: diálogo, cancelamento, teclado e persistência via interface não foram executados. Reativar um reencontrado é permitido. Marcar reencontro não exige confirmação. Mensagem de sucesso de uma ação pode coexistir com aviso global de falha na gravação, porque a atualização em memória ocorre antes da tentativa de persistir.

### `/favoritos`

- Arquivos: `src/app/favoritos/page.tsx`; `Favorites` em `screens.tsx:36`; `PetCard` e Provider.
- Implementado: lista anúncios cujos ids estão em `favorites`, contagem, desfavoritar pelo card e estado vazio. Inclui pausados e reencontrados.
- Dados: favoritos locais + resolução dos ids contra `all`.
- Evidência: alternância, serialização e remoção em exclusão testadas no domínio; HTTP 200.
- Limitações: o teste não clica no coração nem recarrega o navegador. Ids de favoritos sem anúncio correspondente são invisíveis, mas não são eliminados na leitura; duplicações são removidas por `decodeData`.

### `/como-funciona` e `/ajuda`

- Arquivos: respectivos `page.tsx`; mesmo componente `Help` em `screens.tsx:52`, variando a abertura com `how`.
- Implementado: orientações de procura/devolução, segurança, gestão, limites e restauração da demonstração com confirmação. Restaurar substitui os dados locais por listas vazias; os exemplos continuam no código.
- Dados: conteúdo estático e estado local para diálogo/mensagem; ação de reset do Provider.
- Evidência: ambas respondem HTTP 200. O teste chamado de restauração serializa uma estrutura vazia e verifica que exemplos continuam disponíveis; não chama o diálogo nem o método `reset` do Provider.
- Limitações: conteúdo muito semelhante nas duas páginas; nenhuma integração com suporte, contatos ou atendimento real. Fluxo de confirmação/restauro não foi verificado no navegador.

### Rotas auxiliares e ausência de API

- `src/app/not-found.tsx`: tela para caminho desconhecido, usando `Empty`. `/caminho-inexistente` retornou HTTP 404 no smoke. `/_not-found` aparece no build como rota interna do Next, não como página de produto a divulgar.
- `src/app/icon.svg` e `favicon.ico`: recursos de ícone. O build lista `/icon.svg`.
- Nenhum `route.ts`, pasta de API, server action de gravação, middleware ou endpoint de negócio foi encontrado na árvore inspecionada.
- Todos os títulos de página compartilham os metadados do layout; não há metadados específicos por anúncio.

## 5. DADOS E PERSISTÊNCIA

### Modelos e fontes

`Pet` em `pets.ts:2` contém strings `id`, `name`, `species`, `breed`, `color`, `size`, `sex`, `description`, `city`, `neighborhood`, `date`, `illustration` e `createdAt`; mais os unions `status` e `state`. `PetStatus` aceita `perdido` ou `encontrado`. `PetFields` omite id, estado e criação. Espécie, porte, sexo e ilustração continuam tipados como `string`, embora existam listas de opções usadas na UI e em parte da leitura.

`LocalData = { pets: Pet[]; favorites: string[] }`. O estado do Provider adiciona `ready`, `warning`, `all` e operações de alteração. Não há proprietário, conta, contato, localização exata ou correspondência com outro anúncio.

Oito exemplos em `src/lib/pets.ts:7–17`, ids `exemplo-1` a `exemplo-8`, quatro perdidos e quatro encontrados. São quatro cães, três gatos e um coelho na categoria Outro, em quatro cidades ficticiamente utilizadas na demonstração. Datas fixas de 02 a 09/11/2026. Não são alimentados por banco ou relógio externo. Os exemplos são recompostos do código a cada carregamento, não gravados no localStorage.

### Chave e alterações

Única chave de aplicação observada: **`petreturn-v1`**, definida em `pets.ts:41`. Guarda um JSON com anúncios locais e ids favoritos; não tem um campo interno de versão nem migração.

- Montagem: `useEffect` de `store.tsx:12–17` chama `localStorage.getItem`, decodifica e só então marca `ready`.
- Cadastro/edição: `savePet` insere na frente e remove qualquer registro com o mesmo id da cópia anterior.
- Exclusão: `deletePet` remove anúncio e referência favorita.
- Favoritos: `toggleFavorite` alterna o id, sem duplicar na operação normal.
- Estado: a tela salva o objeto completo com novo `state`, usando o mesmo caminho de persistência da edição.
- Restauro: grava `{ pets: [], favorites: [] }` na chave. Não usa `localStorage.clear` nem afeta outras aplicações.
- Toda alteração chama `update` em `store.tsx:18`, atualiza React e tenta serializar/gravar o estado completo.

### Leitura inválida e indisponibilidade

`decodeData` aceita ausência da chave como listas vazias; usa `JSON.parse`, valida arrays, objetos de pet, ids locais únicos e strings de favoritos; deduplica os favoritos. `isPet` verifica tipos, prefixo local, enums e data ISO real. Não valida integralmente as regras de cadastro nem a validade de `createdAt`.

Erro de leitura ou JSON inválido é capturado pelo Provider, que mostra aviso e segue com dados vazios em memória. O conteúdo antigo não é sobrescrito só pela montagem. Entretanto, a próxima alteração bem-sucedida grava o estado em memória sobre a mesma chave; isso pode substituir dados parcialmente recuperáveis sem confirmação específica. Não há recuperação registro a registro, backup ou exportação.

Falha de gravação deixa a alteração disponível na sessão e mostra aviso de que ela não persistirá. Não há rollback, tentativa automática posterior ou retorno booleano de persistência para a tela chamadora. A gravação real indisponível/cheia não foi simulada em navegador nos testes existentes.

### Hidratação e perda de dados

O acesso a `window`/localStorage fica em efeitos ou handlers cliente, não na renderização do servidor. O estado inicial é determinístico e telas locais aguardam `ready`; isso reduz riscos de divergência inicial. A Home renderiza exemplos antes de carregar os locais e pode mudar após a montagem. Nenhum teste com captura de erros de hidratação foi executado; build aprovado não é prova suficiente de ausência desses erros.

Dados dependem de origem, protocolo, host e porta: `localhost` e `127.0.0.1` não compartilham localStorage. Limpeza de dados, navegação privada, outro perfil, outra porta/dispositivo ou armazenamento bloqueado afetam disponibilidade/duração. Sem exportação/importação, não há recuperação oferecida pelo produto.

Não há listener de evento `storage` nem releitura antes de gravar. Cada aba mantém seu snapshot e grava o JSON completo: alterações em abas diferentes podem se sobrescrever. Duas chamadas baseadas no mesmo render também podem usar estado antigo; isso é risco potencial do padrão atual, sem reprodução de corrida nesta sessão.

### Dependências externas

Não foi encontrado cliente de banco, Supabase, API externa de negócio, CDN de imagens/fontes, analytics ou autenticação no código da aplicação. Não há requisições `fetch` na aplicação; o uso observado está no teste HTTP. Os SVGs usam namespace XML padrão, o que não representa uma chamada a serviço remoto. O servidor Next continua necessário para servir a aplicação; não existe configuração de exportação estática completa.

## 6. INTERFACE

Paleta em `src/app/globals.css:5`: marrom `#78350f`, texto `#34291f`, branco, creme `#faf8f2`, amarelo `#eab308`, verde `#16a34a`, vermelho `#dc2626`; azul `#2563eb` aparece no foco e no link de limpeza. Badges e blocos usam variações de fundo e texto. Os tokens verde/vermelho não são a única fonte dessas cores: há valores literais espalhados pelo CSS.

Organização: CSS global próprio com nomes de classe, diretivas `@tailwind base/components/utilities`, grids, flex, fonte Geist local e poucos efeitos de hover. Não há CSS Modules ou design system separado. As linhas compactadas tornam edição e revisão difíceis.

Componentes reutilizáveis: `Icon`, `Logo`, `Header`, `Footer`, `StorageNotice`, `Badge`, `PetCard`, `Empty`, `PageHeading`, `Confirm` e `PetProvider`. O formulário compartilha cadastro e edição; suas funções auxiliares de campo ficam internas ao componente.

Responsividade implementada em media queries para 1500px ou mais, até 1100px, até 800px, até 600px e ajuste de hero entre 601–800px. Navegação troca para menu até 800px; grids mudam de colunas; detalhes/formulário empilham. Isso foi constatado no CSS, não visualmente. Não se pode garantir ausência de rolagem horizontal em todas as telas. **Nenhum tamanho de viewport foi efetivamente testado nesta inspeção.**

Acessibilidade presente no código: idioma, landmarks, labels, `fieldset/legend`, alternativas em imagens, ícones decorativos com `aria-hidden`, favoritos com nome acessível e `aria-pressed`, navegação com `aria-current`, menu com `aria-expanded`, mensagens de estado, erros vinculados, `aria-invalid`, foco no primeiro erro, link para pular ao conteúdo e `:focus-visible`. Há regra de redução de movimento.

`Confirm` utiliza `<dialog open aria-modal="true">`, foco inicial em Cancelar, Escape e contenção manual de Tab. Não usa `showModal()`, não torna o fundo `inert` e não bloqueia a rolagem do body. O retorno de foco é tentado na desmontagem; se o anúncio for excluído, o botão que abriu o diálogo também desaparece. Comportamento real com teclado/leitor de tela permanece sem teste.

Problemas concretos de apresentação: textos auxiliares têm 7–10px em vários breakpoints; `.example-caption` e `.footer-bottom` têm contraste calculado abaixo de 4,5:1 para texto normal. Ver seção 9. Não foi realizada auditoria completa de WCAG.

Imagens: sete SVGs locais com geometria embutida, seis opções de animais e uma composição de hero; ícones inline e ícone SVG da aplicação. Nenhum JPG/JPEG ou upload foi encontrado na interface. SVGs antigos do scaffold e favicon ICO permanecem no projeto. Não foi verificada autoria/licença por consulta externa.

Links/botões: os controles visíveis inspecionados têm `href` para rotas existentes ou handlers; não foram encontrados links `href="#"`, botões de contato fictício ou controles de login/upload sem implementação. Isso é inspeção de código, não comprovação de todos os cliques. Não há ação real de contato com outras pessoas; o texto explicita esse limite.

## 7. REGRAS DE NEGÓCIO

- Perdido exige nome após `trim`. Encontrado permite nome vazio e, ao salvar, recebe identificação automática baseada na espécie; raça é opcional para ambos.
- Cor, porte, sexo, cidade, bairro e descrição são obrigatórios na validação. Espécie tem valor inicial Cachorro e ilustração começa em cão caramelo; opções são definidas no TypeScript.
- Descrição deve ter pelo menos 20 caracteres após `trim` e no máximo 1.500 antes de salvar. Campos de texto usam `maxLength=90` na UI; o validator não reproduz esse limite para todos os campos.
- Data exige formato `AAAA-MM-DD`, calendário válido e valor não posterior à data local corrente. Não há limite inferior de ocorrência. A sondagem encontrou que `0000-01-01` é aceito como data tecnicamente válida.
- `noValidate` desativa a validação nativa do formulário; a submissão depende de `validatePet`. Essa função não valida independentemente o pertencimento de espécie/status/ilustração e demais enums às listas. O caminho usual dos selects/radios restringe as escolhas; dados manipulados são outro cenário.
- `status`: perdido/encontrado; `state`: ativo/pausado/reencontrado. São dimensões diferentes. Um reencontrado mantém seu status original nos dados, mas o badge mostra reencontro.
- Busca e recentes incluem só ativos. Meus anúncios inclui todos os estados locais. Detalhes/favoritos podem mostrar pausados e reencontrados. Reativar qualquer estado não ativo volta a ativo.
- Filtros são interseção de critérios. Status, espécie, porte e sexo comparam exatamente as opções; campos vazios não restringem.
- Texto aplica NFD, remove marcas diacríticas, converte para minúsculas e busca uma substring no conjunto nome, espécie, raça, cor, descrição, cidade e bairro. Não separa palavras para busca independente, não usa similaridade ou geolocalização.
- Região faz substring em cidade + bairro, também normalizada. Limpar filtros volta às opções vazias.
- Não há correspondência automática perdido/encontrado, pontuação de similaridade, comparação assistida, notificação ou validação de vínculo. A “conexão” é navegação humana entre cards e detalhes.
- Exemplos usam prefixo `exemplo-`; locais usam `local-`. A UI identifica a origem por prefixo e a gestão só usa `store.pets`. Exemplos podem ser favoritados, mas não editados, pausados ou excluídos pela interface. Não há separação em duas bases remotas nem autorização de usuário.

## 8. VERIFICAÇÃO REAL

Comandos executados novamente nesta tarefa, com as dependências já disponíveis. No PowerShell, `npm.cmd` evita a restrição que pode bloquear `npm.ps1`.

### `npm.cmd run typecheck`

- Executa `tsc --noEmit`.
- **Código de saída: 0.**
- Nenhum erro ou aviso foi emitido.
- Limite: não monta componentes, não valida estilo visual nem executa handlers.

### `npm.cmd test`

- Executa `node --test tests/domain.test.cjs`.
- **Código de saída: 0.** 12 testes, 12 aprovados, 0 falhas, nenhum ignorado.
- Cobertura executada: oito exemplos/arquivos SVG, acentos/caixa/espaços, combinação de filtros, nome condicional, campos e datas, salvamento/recuperação por id em array, edição, estados, favoritos, exclusão, rejeição de JSON/dados inválidos e estrutura vazia de restauração.
- Nenhum aviso foi emitido.
- Limite crucial: compila e testa somente funções de `pets.ts`; não há DOM, React montado, Provider, localStorage real, diálogo, `router.push` ou recarga de página. O nome do teste de “detalhes” não significa teste da rota de detalhes. O teste de “persistência” usa JSON em memória.

### `npm.cmd run build`

- Executa `next build`.
- **Código de saída: 0.** Compilação, tipos, geração estática e coleta de traces concluídas.
- Aviso apareceu duas vezes: `[webpack.cache.PackFileCacheStrategy] Caching failed for pack: Error: Unable to snapshot resolve dependencies`.
- O aviso não impediu o build; sua causa não foi investigada nesta tarefa. Não foi tratado como falha de aplicação.
- Saída listou `/`, `/ajuda`, `/buscar`, `/cadastrar`, `/como-funciona`, `/favoritos`, `/meus-anuncios`, `/icon.svg`, a página interna de ausência e `/pet/[id]` dinâmica. JS inicial compartilhado informado: aproximadamente 99,2 kB; telas do módulo de screens: aproximadamente 119 kB de primeira carga.

### `npm.cmd run test:http`

- Executa `node tests/http-smoke.cjs`.
- **Código de saída: 0**, nas duas execuções desta tarefa, inclusive após terminar o build.
- HTTP 200 verificado para `/`, `/buscar`, `/cadastrar`, `/cadastrar?status=encontrado`, `/meus-anuncios`, `/favoritos`, `/como-funciona`, `/ajuda`, `/pet/exemplo-1` e `/pet/inexistente`.
- Em cada resposta, verifica idioma e marcadores básicos; na Home, textos do hero. Verifica sete SVGs com conteúdo/tipo SVG e HTTP 404 para `/caminho-inexistente`.
- Sem erros ou avisos.
- Não executa JS cliente. Em detalhes pode estar verificando apenas o HTML de carregamento. Não testa cadastro/edição, exclusão, confirmação, favoritos ou persistência interativa.

### Sondagens adicionais somente em memória

Um comando `node -e` transpila o mesmo `pets.ts` e avalia fixtures derivadas de um exemplo, sem gravar dados de usuário. **Código de saída: 0.** Resultados observados:

- `isPet` aceitou registro local com nome, cidade e descrição vazios: `true`.
- `validatePet` não gerou erro ao receber espécie fora da lista: `true` para ausência de erros.
- Editar um registro com `createdAt` anterior colocou-o antes de outro mais novo.
- `validDate('0000-01-01')` retornou `true`.

Outro comando Node calculou luminância sRGB dos valores CSS: legenda `#979080` sobre branco = **3,17:1**; rodapé `#978e7f` sobre `#fbfaf7` = **3,10:1**. São cálculos dos estilos declarados, não uma medição de screenshot.

### Navegador e ambiente

Não houve teste bem-sucedido em navegador nesta tarefa. **Tamanhos testados: nenhum. Fluxos interativos verificados: nenhum.** A tentativa de inventário retornou indisponibilidade do browser host. A seleção alternativa de Edge via Computer Use foi bloqueada antes de inspecionar o site por falta de confiança na URL. Não houve bypass ou continuidade da automação de UI após esse bloqueio.

A consulta auxiliar `Get-NetTCPConnection -LocalPort 3000 -State Listen` recebeu acesso negado pelo ambiente; não foi necessária escalada porque HTTP confirmou que o servidor responde. O shell agrupado não devolveu falha global, apesar desse erro interno: não usar o código global desse comando como prova de inspeção de processo. O PID e o comando exato do processo servidor não foram confirmados nesta tarefa. A leitura inicial de `app/pet/[id]` usando wildcard falhou e foi refeita com `-LiteralPath`, obtendo o arquivo corretamente; isso não é defeito do produto.

Nenhuma ferramenta nova, navegador ou dependência foi instalada. Não foi executado `npm audit`, consulta de vulnerabilidades, teste de performance, teste de segurança ofensivo ou teste com leitor de tela.

## 9. PROBLEMAS E RISCOS

As prioridades abaixo consideram a demonstração local. “Confirmado por código” não significa reproduzido na interface; essa distinção é explicitada em cada item. Nenhum defeito confirmado impede o build atual.

### P1 — Alta — Verificação de interface ausente — lacuna confirmada

- Arquivos: `tests/domain.test.cjs:9`; `tests/http-smoke.cjs:3`; componentes cliente em `src/components/`.
- Evidência: testes importam só domínio ou fazem fetch de HTML; as duas vias de navegador desta sessão não produziram inspeção do site.
- Impacto: não é possível atestar a apresentação amanhã, acessibilidade interativa, foco, layout, navegação e persistência real após recarga.
- Correção sugerida: executar checklist manual no navegador disponível ao usuário ou numa sessão com automação funcional, em 360/390px, 768px e desktop 1280/1440px. Registrar cada fluxo e os erros de console. Os tamanhos são sugestões, não resultados já obtidos.

### P2 — Média — Dados inválidos podem ser substituídos após uma ação — caminho confirmado por código

- Arquivos: `store.tsx:9`, `:14–18`; `pets.ts:42–46`.
- Evidência: um único registro inválido faz a leitura inteira lançar erro; o catch mantém listas vazias. A próxima mutação grava o snapshot completo nessa mesma chave e pode limpar o aviso.
- Impacto: perda de registros ainda recuperáveis de um JSON parcialmente inválido, sem confirmação específica de substituição.
- Correção sugerida: preservar cópia recuperável, recuperar registros válidos e/ou impedir substituição até escolha explícita de descartar/restaurar. Não registrar dados pessoais em logs ao fazer isso.
- Não houve corrupção ou substituição de armazenamento real nesta tarefa.

### P3 — Média — Sobrescrita entre abas — risco estrutural confirmado, corrida não reproduzida

- Arquivos: `store.tsx:12–19`.
- Evidência: leitura única na montagem, ausência de evento `storage`, operações sobre `data` capturado e escrita do JSON inteiro.
- Impacto: aba antiga pode apagar da persistência um cadastro ou favorito criado por outra aba. Também há risco de atualizações derivadas do mesmo snapshot.
- Correção sugerida: sincronizar leitura/eventos e definir estratégia de conflito; utilizar atualização funcional para o estado React. Apenas usar updater funcional não resolve a concorrência entre abas.
- É limitação conhecida da arquitetura atual; não há teste de múltiplas abas.

### P4 — Média — Validação de leitura e de cadastro divergentes — confirmado por execução do domínio

- Arquivos: `pets.ts:20–24`, `:30–38`, `:42–46`; `pet-form.tsx:27–29`.
- Evidência: `isPet` aceita strings obrigatórias vazias; `validatePet` aceita espécie fora da lista. `createdAt` só precisa ser string. O formulário usa `noValidate`.
- Impacto: registros manipulados/legados podem ser aceitos na leitura, enquanto enum inválido vindo de caminho programático pode passar pelo cadastro e ser rejeitado depois de recarregar. Selects e radios limitam o fluxo normal, portanto não está demonstrado que um visitante comum consegue gerar esse caso sem manipulação.
- Correção sugerida: centralizar schema completo de domínio, validar enums, limites e campos obrigatórios de forma consistente, acrescentando testes para esses cenários. Não há necessidade de instalar biblioteca somente para isso.

### P5 — Média — Query string pode deixar tela com estado antigo — suspeita não reproduzida em navegador

- Arquivos: `screens.tsx:21`; `pet-form.tsx:16`.
- Evidência: Search lê `window.location.search` em efeito com dependências vazias. PetForm usa `initialized` para nunca reinicializar a mesma instância, mesmo se `editar`/`status` mudar.
- Impacto possível: ao navegar dentro da mesma rota, filtros antigos ou o anúncio anterior podem permanecer; “Criar anúncio” enquanto edita pode continuar no modo de edição.
- Correção sugerida: usar parâmetros reativos do App Router e definir reset por mudança de modo/id, sem apagar formulário inadvertidamente; confirmar antes em reprodução real.

### P6 — Média — Contraste de textos auxiliares insuficiente — confirmado por CSS e cálculo

- Arquivo: `src/app/globals.css:8`, seletores `.example-caption` e `.footer-bottom`; redução de fontes em `:13–14`.
- Evidência: contrastes declarados de 3,17:1 e 3,10:1, abaixo de 4,5:1 para texto normal; legenda e rodapé usam tamanhos pequenos. Cálculo executado nesta inspeção.
- Impacto: leitura difícil e falha do critério de contraste de texto normal nos usos com esses fundos. Isso não é uma auditoria completa de conformidade.
- Correção sugerida: escurecer os textos, revisar fontes de 7–10px e medir novamente; conferir zoom de 200% no navegador.

### P7 — Baixa — Recentes ordenados por última operação, não por criação — confirmado em memória

- Arquivos: `pets.ts:48`; `screens.tsx:13`; `store.tsx:19`.
- Evidência: `savePet` sempre prepende o registro e a Home apenas corta os quatro primeiros ativos; a sondagem colocou anúncio antigo editado antes de mais novo.
- Impacto: a seção de recentes pode apresentar uma edição como anúncio mais recente. Não está definido no produto se “recente” significa criação ou atualização.
- Correção sugerida: escolher o significado, ordenar explicitamente e, se necessário, adicionar `updatedAt` separado.

### P8 — Baixa — Limpar filtros tem comportamento inconsistente na URL — confirmado por handlers

- Arquivo: `screens.tsx:24`.
- Evidência: painel limpa estado + query string; botão no estado vazio limpa somente estado.
- Impacto: depois de limpar pelo estado vazio e recarregar, a busca original da URL volta.
- Correção sugerida: extrair uma função única de limpeza e usá-la nos dois locais. Reproduzir em UI antes de encerrar o ajuste.

### P9 — Média — Modal depende de gestão manual de foco — risco ainda sem teste de integração

- Arquivos: `screens.tsx:46–49`, `:43`; estilos em `globals.css:9`.
- Evidência: usa atributo `open`, sem `showModal`/`inert`; efeito retorna foco ao elemento anterior; excluir remove o card que continha o disparador. `onCancel` recebe closures novas a cada render da tela.
- Impacto possível: fundo acessível a tecnologia assistiva ou foco sem destino útil após excluir; uma renderização adicional pode reexecutar o efeito de foco. A contenção manual de Tab existe, portanto não concluir que não há contenção alguma.
- Correção sugerida: verificar com teclado/leitor de tela; preferir modal nativo completo ou controlar fundo e retorno para um alvo que sobreviva à exclusão.

### P10 — Baixa — Base e testes merecem manutenção — fatos confirmados, falha de runtime não comprovada

- Arquivos: `package.json:12–23`; `tests/domain.test.cjs:9–14`; `screens.tsx`; `globals.css`.
- Evidência: React RC com tipos 18; testes usam API interna `Module._compile`; telas/CSS compactados; não há teste de componentes ou lint separado. Build emitiu aviso de cache webpack duas vezes.
- Impacto: custo de manutenção, falsa sensação de cobertura e possíveis incompatibilidades futuras.
- Correção sugerida: após a demonstração, avaliar atualização compatível de runtime/tipos, melhorar formatação/organização e testar componentes. Investigar cache apenas se continuar afetando o trabalho. Não há vulnerabilidade específica confirmada por esta inspeção.

### Limites de escopo que não devem virar promessas

Sem comunicação entre pessoas, autenticação, banco, envio de fotos, mapa, correspondência automática, publicação ou recuperação em outro dispositivo. Nenhum desses serviços está “quase integrado”: são trabalhos futuros. A ausência deles é adequada ao escopo local, mas impede uso como plataforma real de reencontro.

## 10. COMO EXECUTAR

Na pasta do projeto, com Node e npm disponíveis:

```powershell
Set-Location C:\Users\fabio.junior\Projetos\Privado\petreturn
npm.cmd run dev
```

Para a versão de produção local:

```powershell
npm.cmd run build
npm.cmd start
```

Em checkout sem dependências, usar `npm.cmd ci` com o lockfile existente; isso é instrução para outro ambiente, não um comando executado nesta tarefa. As dependências já estão instaladas aqui. Não executar dev/start simultaneamente na mesma porta.

Endereço padrão: **http://127.0.0.1:3000**. Scripts limitam o bind a loopback. Porta alternativa para desenvolvimento: `npm.cmd run dev -- --port 3001`; isso muda a origem de armazenamento. Usar sempre a mesma URL na apresentação.

Variáveis exigidas pela aplicação: **nenhuma encontrada**. Variável opcional do teste HTTP: **`PETRETURN_URL`**. Não foram lidos nem reproduzidos conteúdos de arquivos `.env` ou credenciais.

**Servidor nesta inspeção:** já existia um respondendo na porta 3000, e continuou passando o smoke HTTP após o build. Não foi iniciado ou encerrado outro servidor nesta tarefa. A identidade do processo não foi comprovada pela consulta de rede, que recebeu acesso negado. Não confundir disponibilidade HTTP com teste do cliente.

### Reproduções recomendadas, ainda não executadas na interface

Usar perfil/origem de teste descartável para não perder anúncios reais do navegador. Os passos abaixo são propostas de reprodução, não verificações concluídas:

1. **Parâmetros/mode antigo:** criar um anúncio de teste; abrir sua edição; clicar no link global “Criar anúncio” sem passar por outra página; verificar se id, título e campos são de novo cadastro ou da edição anterior. Testar também mudança de `status` e voltar/avançar na mesma rota.
2. **Limpeza de URL:** abrir `/buscar?q=texto-sem-resultados`; clicar no botão de limpeza do estado vazio; recarregar e comparar com a limpeza do painel.
3. **Duas abas:** abrir a mesma origem em duas abas; criar anúncio numa; sem recarregar a outra, alterar um favorito; recarregar e conferir se o cadastro permaneceu.
4. **Dados parcialmente inválidos:** somente em ambiente descartável e com cópia anterior, preparar um JSON com um registro válido e um inválido; recarregar; observar aviso; realizar outra mutação e verificar se há preservação do conteúdo original. Não executar esse procedimento no navegador de apresentação sem backup.
5. **Recentes:** criar dois anúncios, editar o mais antigo e observar a ordem na Home. O comportamento da função já foi comprovado em memória.
6. **Modal:** percorrer com Tab/Shift+Tab, cancelar com Escape e confirmar exclusão; conferir destino do foco após remover o card e se o fundo fica acessível.

## 11. CONTINUIDADE

### Git

Há repositório. Último commit observado: **`84fbe29` — `Initial commit from Create Next App`**. Não foi criado commit nesta tarefa, e nenhuma alteração local existente foi descartada.

Estado antes de criar este relatório:

- Modificados rastreados: `README.md`, `package.json`, `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`.
- Não rastreados: `PETRETURN_CONTEXT.md`, `public/illustrations/`, `src/app/ajuda/`, `buscar/`, `cadastrar/`, `como-funciona/`, `favoritos/`, `icon.svg`, `meus-anuncios/`, `not-found.tsx`, `pet/`, `src/components/`, `src/lib/` e `tests/`.
- Este relatório passa a ser mais um arquivo não rastreado. O lockfile não apareceu modificado.

Essas diferenças correspondem ao trabalho local da aplicação sobre o scaffold. Outra IA deve preservar o conteúdo e não assumir que arquivos não rastreados são descartáveis.

### TODOs, mocks e atalhos

Não foram encontrados marcadores literais `TODO`, `FIXME` ou `HACK` no código de aplicação pesquisado. Isso não significa ausência de pendências.

Mocks/atalhos reais: oito exemplos hardcoded com datas fixas; SVG escolhido em vez de fotografia; estado no Provider; persistência por um JSON completo; origem inferida pelo prefixo do id; ausência de sync/backup/migração; conteúdo semelhante nas duas páginas de ajuda; todos os metadados no layout; telas e CSS concentrados em poucos arquivos; validação distribuída entre atributos HTML, funções e decoder. A integração com banco descrita em `PETRETURN_CONTEXT.md` é proposta futura, sem código implementado.

### Próximas ações para apresentar amanhã, em ordem

1. Abrir a versão local no navegador e executar o roteiro completo: encontrado sem nome, perdido sem nome com erro, cadastro válido, detalhes, recarga, favorito/recarga, edição/recarga, pausa/busca, reativação, reencontro, cancelar exclusão, excluir, cancelar/restaurar dados e id inexistente. Usar somente dados de teste e confirmar o aviso de demonstração.
2. Conferir celular, tablet e desktop, zoom, console, foco e ausência de overflow. Nenhum desses pontos está validado por esta inspeção.
3. Reproduzir e corrigir, se confirmados em UI, a atualização de parâmetros/modo e o comportamento de limpeza. Corrigir contraste e destino de foco após exclusão.
4. Proteger recuperação de dados inválidos e decidir se basta limitar a apresentação a uma aba ou se a sincronização precisa ser implementada já. Não esconder os limites de persistência.
5. Alinhar validação e decoder; acrescentar testes nos casos realmente alterados. Definir a ordem dos recentes.
6. Reexecutar tipos, testes, build e smoke depois de qualquer mudança. Fazer checkpoint Git com os arquivos locais preservados, quando isso for autorizado no trabalho seguinte.

### Pode ficar para depois da demonstração

Banco, autenticação, API, mídia, mapas, notificações, busca aproximada e correspondências; definição de contato seguro e moderação; sincronização multiusuário; migração consentida de dados locais; atualização de dependências e revisão de segurança antes de exposição pública; refatoração maior das telas/CSS e remoção de sobras do scaffold. Não publicar a demonstração sem nova autorização.

## RESUMO PARA ANÁLISE

O projeto compila e passa em **12 testes de domínio + smoke HTTP**, mas **não tem validação de interface, viewport ou localStorage real após recarga**. O bloqueio principal é a inspeção de navegador nesta sessão, não o build. Há riscos concretos de substituição de dados inválidos, sobrescrita entre abas, validação divergente e contraste; a reatividade dos parâmetros é suspeita prioritária para reproduzir.

Ler primeiro **`src/lib/pets.ts`**, **`src/components/store.tsx`**, **`src/components/pet-form.tsx`**, **`src/components/screens.tsx`** e os **dois arquivos de teste**; depois `ui.tsx`, `globals.css` e `package.json`. Não tratar handlers existentes ou os testes de JSON como prova de fluxo ponta a ponta. Nenhuma implementação foi corrigida nesta tarefa.

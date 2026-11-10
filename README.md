# PetReturn

Demonstração para apresentar a experiência de busca e cadastro de animais perdidos e encontrados. Next.js App Router, React, TypeScript e Tailwind CSS. Sem banco, autenticação, API externa de dados ou upload.

## Produção para apresentação

**https://pet-return.vercel.app** — site público, sem login para abrir.

Repositório: https://github.com/bioojr/Pet-Return, branch `main`. Projeto Vercel: `pet-return`, plano Hobby gratuito, framework Next.js, Node.js 22 e raiz do repositório. Instalação com `npm ci` e build com `npm run build`, também declarados em `vercel.json`. Os deployments usam o commit do GitHub; consulte o SHA nos metadados do deploy e no histórico da branch.

Os exemplos fictícios aparecem para todos. **Os anúncios e favoritos de cada visitante continuam somente no navegador dele.** O site público não compartilha anúncios locais entre pessoas. Dados do localhost, de outro domínio ou de outro dispositivo não migram automaticamente para a URL pública. O aviso de demonstração permanece em todas as páginas.

Verificação realizada em 09/11/2026: deploy de produção `READY`, acesso anônimo direto com HTTP 200 e sem redirecionamento para login, dez URLs, sete SVGs e página 404. TypeScript, 18 testes de domínio/persistência, build local e auditoria npm passaram. A ferramenta de navegador foi bloqueada por não conseguir verificar a URL atual; **cadastro, recarga, edição, favoritos, mobile/desktop e console no navegador não foram verificados interativamente**. Testes HTTP não substituem essa validação.

Versões de produção: Next.js `15.5.29`, React/React DOM `19.3.1`, tipos React/React DOM `19.3.0`, Tailwind `3.4.19`. O override do PostCSS interno do Next para `8.5.32` remove a versão transitiva vulnerável. `npm ci` e `npm audit` confirmaram a resolução sem vulnerabilidades conhecidas na data da verificação. Nenhum `--force` ou `--legacy-peer-deps` foi utilizado.

Fontes oficiais consultadas: [Next.js — correções de novembro de 2026](https://nextjs.org/blog/november-2026-security-release), [React 19.3.1](https://github.com/react/react/releases/tag/v19.3.1) e [aviso do PostCSS](https://github.com/postcss/postcss/security/advisories/GHSA-fxqj-rqcc-2cmp).

## Executar

Requer Node.js 20 ou superior e npm. As dependências já estão instaladas neste ambiente.

```sh
npm install
npm run dev
```

Abra http://127.0.0.1:3000. No PowerShell com scripts bloqueados, use `npm.cmd` em lugar de `npm`.

Para produção local:

```sh
npm run build
npm start
```

Esses comandos iniciam somente o servidor local, em `127.0.0.1`. Mantenha o mesmo endereço e porta para acessar os mesmos dados locais. Em caso de porta ocupada, `npm run dev -- --port 3001` inicia outra origem, com armazenamento separado.

## Verificações

```sh
npm run typecheck
npm test
npm run build
```

Os testes usam o runner nativo do Node e as regras TypeScript reais, compiladas em memória. Cobrem validação de cadastro, busca combinada sem acentos, identificação por id, edição, estados dos anúncios, favoritos, exclusão, serialização e recuperação de dados inválidos. Não substituem testes de interação em navegador.

Com o servidor iniciado, `npm run test:http` verifica dez URLs, os sete SVGs e a resposta 404 para uma rota desconhecida. Não executa JavaScript do cliente.

## Rotas e uso

- `/`: apresentação, busca rápida, anúncios recentes e orientações.
- `/buscar`: busca textual e filtros por situação, espécie, porte, sexo e região.
- `/pet/[id]`: detalhes, favorito e edição dos anúncios locais.
- `/cadastrar`: cadastro de perdido/encontrado e seleção de SVG.
- `/cadastrar?editar=ID`: edição de anúncio deste navegador.
- `/meus-anuncios`: editar, pausar, reativar, marcar reencontro e excluir com confirmação.
- `/favoritos`: anúncios salvos, inclusive pausados ou reencontrados.
- `/como-funciona` e `/ajuda`: orientações, limites e restauração com confirmação.

Os oito anúncios fictícios em `src/lib/pets.ts` são identificados como **Exemplo**. Os criados pelo visitante têm o selo **Seu anúncio**. Apenas anúncios ativos aparecem na busca e nos recentes. O link direto continua funcionando para pausados e reencontrados.

Os dados ficam na chave `petreturn-v1` do localStorage. O acesso ocorre após a montagem no cliente. Dados inválidos são preservados mesmo se novas ações forem realizadas; somente o restauro explícito permite substituí-los. Se a gravação falhar, um aviso informa que as mudanças são temporárias. As operações relêem o armazenamento e sincronizam outras abas pelo evento `storage`; usam Web Locks quando disponível para serializar gravações entre abas. Em navegadores sem Web Locks, não há garantia de exclusão mútua entre abas simultâneas. Restaurar a demonstração apaga somente os anúncios locais e favoritos do PetReturn, mantendo os oito exemplos.

Cadastro/edição e busca recebem parâmetros reativos do App Router. Trocar `editar` ou `status` remonta o formulário correto. Os dois botões de limpeza removem os filtros e os parâmetros da URL. A edição conserva a posição do anúncio, e os recentes são ordenados pela criação. A validação de enums, campos e limites é compartilhada com a leitura dos dados. Confirmações usam diálogo modal nativo com retorno de foco; o contraste das legendas foi ajustado preservando o visual.

## Estrutura

- `src/lib/pets.ts`: tipos, exemplos e regras de domínio.
- `src/components/store.tsx`: estado compartilhado e persistência local.
- `src/components/ui.tsx`: navegação, cards, estados vazios e componentes comuns.
- `src/components/screens.tsx`: telas e confirmação acessível.
- `src/components/pet-form.tsx`: formulário validado de cadastro e edição.
- `src/app`: rotas, layout, tipografia local e estilos responsivos.
- `public/illustrations`: SVGs originais locais, sem imagens externas.
- `tests/domain.test.cjs`: testes das regras utilizadas na aplicação.

## Limites

Nenhum anúncio local é enviado a outras pessoas. Não há autenticação, contatos, compartilhamento entre dispositivos, fotografias ou mapa. Limpar os dados do navegador remove seus anúncios. As ilustrações não representam fotografias reais. Não informe telefone, e-mail ou endereço residencial nas descrições. Falhas de armazenamento ou uso simultâneo em navegadores sem Web Locks podem limitar a persistência.

Não há variável de ambiente obrigatória para o produto. `PETRETURN_URL` é opcional no teste HTTP. Arquivos `.env*`, `.vercel`, dependências, builds, credenciais e temporários não devem ser versionados ou incluídos no upload de fonte; veja `.gitignore` e `.vercelignore`.

Veja `PETRETURN_CONTEXT.md` para o contexto técnico e a futura integração com banco.

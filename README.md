# PetReturn

Aplicação local para apresentar a experiência de busca e cadastro de animais perdidos e encontrados. Next.js App Router, React, TypeScript e Tailwind CSS. Nenhum banco, serviço externo, conta ou upload.

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

Os servidores escutam somente em `127.0.0.1`. Não há publicação. Mantenha o mesmo endereço e porta para acessar os mesmos dados locais. Em caso de porta ocupada, `npm run dev -- --port 3001` inicia outra origem, com armazenamento separado.

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

Os dados ficam na chave `petreturn-v1` do localStorage. O acesso ocorre após a montagem no cliente. Se a leitura falhar, há um aviso e a aplicação segue na sessão; dados inválidos não são sobrescritos automaticamente na montagem. Se a gravação falhar, um aviso informa que as mudanças são temporárias. Restaurar a demonstração apaga somente os anúncios locais e favoritos do PetReturn, mantendo os oito exemplos.

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

Nenhum anúncio é enviado a outras pessoas. Não há autenticação, contatos, compartilhamento entre dispositivos, fotografias, mapa ou sincronização entre abas. Limpar os dados do navegador remove seus anúncios. As ilustrações não representam fotografias reais. Não informe telefone, e-mail ou endereço residencial nas descrições.

Veja `PETRETURN_CONTEXT.md` para o contexto técnico e a futura integração com banco.

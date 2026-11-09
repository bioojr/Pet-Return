# Contexto do PetReturn

## Entrega de 9 de novembro de 2026

Projeto implementado sobre o scaffolding padrão disponível, sem aplicação ou design anterior a preservar. Mantidas as dependências já instaladas: Next.js 15.0.0, React 19 RC, TypeScript e Tailwind 3. Nenhuma dependência adicional foi instalada.

Identidade visual acolhedora: marrom #78350F, fundo branco e creme, amarelo #EAB308 nos detalhes, verde nos encontrados/sucessos, vermelho nos perdidos/erros e azul em links de filtros e foco. Fonte Geist incluída localmente. Seis ilustrações SVG de animais e uma composição SVG própria para o hero. Layouts específicos para celular, tablet e desktop.

## Implementado

Home completa; navegação mobile; busca rápida e busca combinada por status, espécie, porte, sexo e cidade/bairro; normalização de acentos e caixa; contagem e estado vazio; detalhes em rota dinâmica com tratamento de id inexistente; favoritos; cadastro e edição validados; gestão de anúncios com pausa, reativação, reencontro e exclusão com confirmação; páginas explicativas e restauração da demonstração com confirmação.

Nome é obrigatório para perdido e opcional para encontrado, com identificação automática no último caso. Campos obrigatórios, descrição com 20–1.500 caracteres e datas válidas sem futuro. A edição mantém o id, a data de criação e o estado do anúncio.

Oito exemplos imutáveis são separados de registros `local-*`. Dados locais e favoritos ficam no localStorage `petreturn-v1`, em uma única estrutura JSON. Não há acesso ao armazenamento no servidor nem durante o primeiro render. Estados locais dependentes do armazenamento aguardam a montagem. Leitura inválida e falha de gravação geram avisos recuperáveis. O restauro afeta somente a chave do PetReturn.

O estado `ativo` participa da busca e dos recentes; `pausado` e `reencontrado` permanecem em Meus anúncios, detalhes e favoritos. Reativar também pode reabrir um anúncio reencontrado. Excluir remove igualmente sua referência nos favoritos.

Componentes semânticos, labels associados, mensagens de erro por campo, indicação de foco, link de salto e diálogo de confirmação com foco inicial em Cancelar, contenção de Tab, Escape e retorno de foco. Sem dependências de imagens, fontes, serviços ou APIs externas para funcionar.

## Verificação

Testes de domínio executados com o runner nativo do Node: oito exemplos e seus arquivos SVG, busca sem acentos, combinação e limpeza de filtros, validação condicional do nome, campos obrigatórios, datas inválidas/futuras, cadastro e recuperação por id, edição sem duplicação, pausa/reativação/reencontro, favoritos, exclusão, restauração e recuperação de armazenamento malformado. Serialização e nova leitura verificam o formato persistido; não constituem teste de recarga em navegador.

TypeScript e build de produção passaram. Os doze testes de domínio passaram. A verificação HTTP também passou: dez URLs, os sete SVGs locais e uma rota 404. O browser host retornou `The browser access host is unavailable`; portanto, a interação real no navegador e a inspeção visual de tamanhos de tela não puderam ser executadas nesta sessão. Não alegar validação visual ou ponta a ponta.

## Integração futura com banco

1. Definir consentimento, moderação, retenção e política de dados antes de aceitar anúncios reais.
2. Criar repositório para anúncios e favoritos, mantendo as regras de domínio independentes da interface.
3. Modelar ids persistentes, proprietário, situação, ocorrência e datas de criação/atualização. Diferenciar estado do anúncio de perdido/encontrado.
4. Adicionar autenticação e autorização no servidor para gerenciamento; hoje não existe identidade ou segurança para uso multiusuário.
5. Validar no servidor, paginar a busca, limitar requisições e criar fluxo de denúncia/moderação.
6. Planejar comunicação protegida e verificação de vínculo; nenhum contato ou envio é simulado nesta entrega.
7. Adotar migração explícita dos dados locais, sem envio silencioso, e separar dados de exemplo de dados reais.
8. Atualizar as dependências de base antes de exposição pública e executar uma suíte de navegador em ambiente disponível.

Fotos, armazenamento de mídia, mapas, notificações e sincronização são decisões futuras. Nenhum backend, Supabase, banco, login, upload ou publicação foi implementado.

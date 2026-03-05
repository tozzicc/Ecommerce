# Planejamento do E-commerce (TASKS.md)

Este documento centraliza as tarefas de implementação da arquitetura baseando-se no `PRD.md`.

## 📦 1. Setup e Dependências
- [x] Inicializar projeto Next.js (App Router, Tailwind, TypeScript).
- [x] Instalar dependências essenciais: `prisma`, `stripe`, `zustand`, `zod`, `bcrypt` (ou equivalentes para auth).
- [ ] Instalar e configurar `shadcn/ui`.
- [x] Configurar `.env` usando a base fornecida (Banco, Stripe, Auth).
- [ ] Implementar Design Guidelines (Cores e tipografia no `globals.css`).

## 🗄️ 2. Banco de Dados e Prisma
- [x] Inicializar Prisma (`npx prisma init`).
- [x] Criar Schema (User, Product, Category, Order, OrderItem) e enumerações.
- [x] Rodar as migrations (`npx prisma migrate dev`).
- [x] Criar e executar script Seed (`seed.ts`) com produtos e categorias de exemplo.

## ⚙️ 3. Integração e Backend (APIs)
- [x] Implementar APIs de Produtos (Listagem, CRUD de Admin, Busca por slug).
- [x] Implement APIs de Categorias (CRUD COMPLETO).
- [ ] Implementar APIs do Carrinho.
- [/] Implementar API do Checkout (Stripe Checkout Session e Webhooks).
- [x] Implementar integração de Autenticação (Login, Registro, Sessão).
- [ ] Configuração de Middleware (Proteger rotas `/admin` e `/minha-conta`).

## 🛒 4. Frontend: Loja Pública
- [x] Layout principal (Header fixo branco com ícone do Carrinho, Footer limpo).
- [x] Página: Home (`/`).
- [x] Página: Catálogo de Produtos com Sidebar de filtros (`/produtos`).
- [x] Página: Detalhe do Produto (`/produtos/[slug]`).
- [x] Página: Carrinho completo com resumo de pedido (`/carrinho`).
- [ ] Páginas Auth: `/login`, `/cadastro` e Área do Cliente `/minha-conta`.

## 💳 5. Checkout (Stripe)
- [ ] Página de Revisão/Checkout.
- [ ] Criação de Session do Stripe e redirecionamento.
- [ ] Integração do Webhook para atualizar o status do pedido para `PAID`.
- [ ] Telas de sucesso e erro na compra (`/checkout/sucesso`, `/checkout/erro`).

## 🛡️ 6. Frontend: Painel Administrativo (/admin)
- [x] Layout exclusivo Admin (Fundo/Navbar Escuros - #111111, Logo + Badge "Admin", Botão "Ver Loja").
- [x] Arquitetura para que sub-rotas consumam apenas o layout de Admin.
- [x] Página: Dashboard (`/admin`) com métricas resumidas.
- [x] Página: Gestão de Produtos (`/admin/produtos` -> Listar e gerenciar produtos).
- [x] Página: Gestão de Pedidos (`/admin/pedidos` -> Atualização de status).

## 🚀 7. Testes e Auditoria Final
- [ ] Auditoria de Segurança (`security_scan.py`).
- [ ] Verificação de Lints (`lint_runner.py`).
- [ ] Teste Manual do fluxo E2E (Adicionar item > Login > Checkout Stripe).

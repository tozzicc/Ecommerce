## 1. Visão Geral do Projeto

### O que vamos construir?
Uma loja virtual completa e funcional com catálogo de produtos, carrinho de compras, checkout com pagamento via Stripe, autenticação de usuários e painel administrativo.

### Para quem?
- **Clientes:** Usuários que querem comprar produtos online
- **Admin:** Lojista que gerencia produtos, pedidos e estoque

### Stack Técnica
- **Frontend:** Next.js 14+ (App Router) + Tailwind CSS + shadcn/ui
- **Backend:** Next.js API Routes + Prisma ORM
- **Banco de Dados:** PostgreSQL (Docker local)
- **Pagamentos:** Stripe
- **Autenticação:** Better Auth (ou NextAuth)
- **Deploy:** Vercel
Idioma: Português (Brasil) - toda UI, textos, botões, mensagens e placeholders em PT-BR

## 2. Agentes do Kit 2.0 que serão utilizados

| Agente | Responsabilidade no Projeto |
|--------|-----------------------------|
| `@frontend-specialist` | UI/UX da loja, páginas, componentes |
| `@backend-specialist`	| APIs, lógica de negócio, integrações |
| `@database-architect`	| Schema do banco, migrations, queries |
| `@security-auditor`	| Auth, proteção de rotas, validações |
| `@test-engineer`	| Testes E2E do fluxo de compra |


## 3. Skills que serão ativadas automaticamente

```
@nextjs-react-expert      → Estrutura Next.js App Router
@tailwind-patterns        → Estilização responsiva
@frontend-design          → Design profissional da loja
@api-patterns             → REST APIs bem estruturadas
@database-design          → Schema otimizado
@prisma-expert            → ORM e migrations
@nodejs-best-practices    → Performance backend
@webapp-testing           → Testes do checkout
```

## 4. Funcionalidades por Módulo

### 4.1 Módulo: Catálogo de Produtos (Frontend)

**Páginas:**

- `/` - Home com produtos em destaque
- `/produtos` - Listagem com filtros (categoria, preço, busca)
- `/produtos/[slug]` - Página do produto individual

**Componentes:**

- `ProductCard` - Card do produto com imagem, nome, preço
- `ProductGrid` - Grid responsivo de produtos
- `ProductFilters` - Sidebar com filtros
- `ProductGallery` - Galeria de imagens do produto
- `AddToCartButton` - Botão adicionar ao carrinho

**Requisitos:**
- Imagens otimizadas com next/image
- Loading states e skeletons
- SEO otimizado (meta tags, structured data)
- Responsivo (mobile-first)

### 4.2 Módulo: Carrinho de Compras

**Funcionalidades:**

- Adicionar/remover produtos
- Alterar quantidade
- Calcular subtotal e total
- Persistir carrinho (localStorage + banco se logado)
- Drawer/sidebar do carrinho

**Componentes:**

- `CartDrawer` - Sidebar do carrinho
- `CartItem` - Item individual no carrinho
- `CartSummary` - Resumo com totais
- `CartIcon` - Ícone com contador no header

**Estado:**

- Usar Zustand ou Context API
- Sincronizar com banco quando usuário logar

### 4.3 Módulo: Autenticação

**Páginas:**
- `/login` - Login com email/senha
- `/cadastro` - Registro de novo usuário
- `/minha-conta` - Área do cliente

**Funcionalidades:**

- Login/Logout
- Registro com validação
- Recuperação de senha
- Proteção de rotas (middleware)
- Sessão persistente

**Segurança:**

- Hash de senhas (bcrypt)
- Tokens JWT ou sessions
- Rate limiting no login
- Validação de inputs (Zod)

### 4.4 Módulo: Checkout e Pagamentos

**Páginas:**
- `/checkout` - Formulário de checkout
- `/checkout/sucesso` - Confirmação do pedido
- `/checkout/erro` - Página de erro

**Fluxo:**
1. Usuário revisa carrinho
2. Preenche dados de entrega
3. Seleciona forma de pagamento
4. Stripe Checkout Session
5. Webhook confirma pagamento
6. Pedido criado no banco
7. Email de confirmação (opcional)

**Integração Stripe:**
- Checkout Session (hosted)
- Webhooks para confirmar pagamento
- Tratamento de erros

### 4.5 Módulo: Painel Administrativo

**Layout:**
- Navbar própria diferente da loja, com fundo escuro (#111111)
- Links na navbar: Dashboard, Produtos, Pedidos
- Nome da loja + badge "Admin" no canto esquerdo
- Botão "Ver Loja" para voltar ao site público
- Não usar a navbar da loja no admin

**Páginas:**
- /admin - Dashboard com métricas
- /admin/produtos - CRUD de produtos
- /admin/pedidos - Lista de pedidos
- /admin/pedidos/[id] - Detalhes do pedido

**Funcionalidades:**

- Dashboard: vendas do dia/semana/mês, pedidos pendentes
- Produtos: criar, editar, deletar, upload de imagens
- Pedidos: visualizar, atualizar status
- Proteção: apenas usuários admin

### 5. Schema do Banco de Dados (Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(CUSTOMER)
  orders    Order[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  CUSTOMER
  ADMIN
}

model Product {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String
  price       Decimal  @db.Decimal(10, 2)
  images      String[] 
  category    Category @relation(fields: [categoryId], references: [id])
  categoryId  String
  stock       Int      @default(0)
  active      Boolean  @default(true)
  orderItems  OrderItem[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Category {
  id       String    @id @default(cuid())
  name     String
  slug     String    @unique
  products Product[]
}

model Order {
  id              String      @id @default(cuid())
  user            User        @relation(fields: [userId], references: [id])
  userId          String
  items           OrderItem[]
  total           Decimal     @db.Decimal(10, 2)
  status          OrderStatus @default(PENDING)
  stripeSessionId String?
  shippingAddress Json
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}

enum OrderStatus {
  PENDING
  PAID
  SHIPPED
  DELIVERED
  CANCELLED
}

model OrderItem {
  id        String  @id @default(cuid())
  order     Order   @relation(fields: [orderId], references: [id])
  orderId   String
  product   Product @relation(fields: [productId], references: [id])
  productId String
  quantity  Int
  price     Decimal @db.Decimal(10, 2)
}
```

### 6. API Endpoints

### Produtos
```
GET    /api/products          → Lista produtos (com filtros)
GET    /api/products/[slug]   → Produto por slug
POST   /api/products          → Criar produto (admin)
PUT    /api/products/[id]     → Atualizar produto (admin)
DELETE /api/products/[id]     → Deletar produto (admin)
```

### Categorias
```
GET    /api/categories        → Lista categorias
```

### Carrinho
```
GET    /api/cart              → Carrinho do usuário
POST   /api/cart              → Adicionar item
PUT    /api/cart/[itemId]     → Atualizar quantidade
DELETE /api/cart/[itemId]     → Remover item
```

### Checkout
```
POST   /api/checkout          → Criar Stripe Session
POST   /api/webhooks/stripe   → Webhook do Stripe
```

### Pedidos
```
GET    /api/orders            → Pedidos do usuário
GET    /api/orders/[id]       → Detalhes do pedido
GET    /api/admin/orders      → Todos pedidos (admin)
PUT    /api/admin/orders/[id] → Atualizar status (admin)
```

### Auth
```
POST   /api/auth/register     → Registro
POST   /api/auth/login        → Login
POST   /api/auth/logout       → Logout
GET    /api/auth/me           → Usuário atual
```

## 7. Estrutura de Pastas

```
src/
├── app/
│   ├── (loja)/
│   │   ├── page.tsx                 # Home
│   │   ├── produtos/
│   │   │   ├── page.tsx             # Lista
│   │   │   └── [slug]/page.tsx      # Detalhe
│   │   ├── carrinho/page.tsx
│   │   ├── checkout/
│   │   │   ├── page.tsx
│   │   │   ├── sucesso/page.tsx
│   │   │   └── erro/page.tsx
│   │   ├── login/page.tsx
│   │   ├── cadastro/page.tsx
│   │   └── minha-conta/page.tsx
│   ├── admin/
│   │   ├── page.tsx                 # Dashboard
│   │   ├── produtos/page.tsx
│   │   └── pedidos/
│   │       ├── page.tsx
│   │       └── [id]/page.tsx
│   ├── api/
│   │   ├── products/
│   │   ├── categories/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── orders/
│   │   ├── admin/
│   │   ├── auth/
│   │   └── webhooks/
│   └── layout.tsx
├── components/
│   ├── ui/                          # shadcn/ui
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── AdminSidebar.tsx
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductFilters.tsx
│   │   └── ProductGallery.tsx
│   ├── cart/
│   │   ├── CartDrawer.tsx
│   │   ├── CartItem.tsx
│   │   └── CartSummary.tsx
│   └── checkout/
│       └── CheckoutForm.tsx
├── lib/
│   ├── prisma.ts
│   ├── stripe.ts
│   ├── auth.ts
│   └── utils.ts
├── stores/
│   └── cart-store.ts               # Zustand
└── types/
    └── index.ts
```

## 8. Variáveis de Ambiente

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce"

# Stripe
STRIPE_SECRET_KEY="sk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."

# Auth
AUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 9. Design Guidelines
```
Estilo: Clean e minimalista Referência: Apple Store, Vercel, Linear

Cores:

Background: #FFFFFF (branco)
Texto principal: #111111 (quase preto)
Texto secundário: #6B7280 (cinza)
Accent/CTA: #000000 (preto) com hover #333333
Sucesso: #22C55E (verde)
Erro: #EF4444 (vermelho)
Bordas: #E5E7EB (cinza claro)
Background secundário: #F9FAFB (cinza quase branco)
Tipografia:

Font: Inter (Google Fonts)
Títulos: bold, tracking-tight
Corpo: regular, 16px
Preços: semibold, text-lg
Princípios:

Muito espaço em branco
Imagens de produto grandes e centralizadas
Botões com cantos arredondados (rounded-lg)
Sombras sutis (shadow-sm)
Transições suaves (transition-all duration-200)
Cards com borda fina e hover sutil
Ícones Lucide React
Componentes visuais:

Header fixo com fundo branco e borda inferior sutil
Produto card com hover scale (scale-[1.02])
Badges de categoria em cinza claro com texto escuro
Botão "Adicionar ao carrinho" preto com texto branco
Toast notifications para ações do carrinho
```

## 10. Workflow de Execução
```
Usar o comando /orchestrate para execução multi-agente:
/orchestrate Criar e-commerce completo seguindo o PRD anexado
Sequência esperada:

@database-architect → Cria schema Prisma e migrations
@backend-specialist → Implementa APIs e integrações
@frontend-specialist → Cria páginas e componentes
@security-auditor → Configura auth e validações
@test-engineer → Testa fluxo de compra
```

## 11. Critérios de Aceite
```
 Usuário consegue navegar pelo catálogo
 Usuário consegue adicionar produtos ao carrinho
 Usuário consegue se cadastrar e fazer login
 Usuário consegue finalizar compra via Stripe
 Admin consegue gerenciar produtos
 Admin consegue visualizar pedidos
 App está responsivo (mobile/desktop)
 Deploy funcionando na Vercel
```

## 12. Fora do Escopo (v1)
```
Cupons de desconto
Múltiplos métodos de pagamento (só Stripe)
Cálculo de frete real
Sistema de reviews
Wishlist
Busca avançada com Algolia
Multi-idioma
PWA

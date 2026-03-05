import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // Create admin user
    const adminPassword = await hash("admin123", 12);
    const admin = await prisma.user.upsert({
        where: { email: "admin@loja.com" },
        update: {},
        create: {
            email: "admin@loja.com",
            name: "Administrador",
            password: adminPassword,
            role: "ADMIN",
        },
    });
    console.log(`✅ Admin created: ${admin.email}`);

    // Create customer user
    const customerPassword = await hash("cliente123", 12);
    const customer = await prisma.user.upsert({
        where: { email: "cliente@teste.com" },
        update: {},
        create: {
            email: "cliente@teste.com",
            name: "Cliente Teste",
            password: customerPassword,
            role: "CUSTOMER",
        },
    });
    console.log(`✅ Customer created: ${customer.email}`);

    // Create categories
    const categories = await Promise.all([
        prisma.category.upsert({
            where: { slug: "camisetas" },
            update: {},
            create: { name: "Camisetas", slug: "camisetas" },
        }),
        prisma.category.upsert({
            where: { slug: "calcas" },
            update: {},
            create: { name: "Calças", slug: "calcas" },
        }),
        prisma.category.upsert({
            where: { slug: "tenis" },
            update: {},
            create: { name: "Tênis", slug: "tenis" },
        }),
        prisma.category.upsert({
            where: { slug: "acessorios" },
            update: {},
            create: { name: "Acessórios", slug: "acessorios" },
        }),
    ]);
    console.log(`✅ ${categories.length} categories created`);

    // Create products
    const products = [
        {
            name: "Camiseta Básica Preta",
            slug: "camiseta-basica-preta",
            description:
                "Camiseta 100% algodão, corte regular, confortável para o dia a dia. Tecido macio e durável com acabamento premium.",
            price: 79.9,
            images: [
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
                "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800",
            ],
            categoryId: categories[0].id,
            stock: 50,
        },
        {
            name: "Camiseta Oversized Branca",
            slug: "camiseta-oversized-branca",
            description:
                "Camiseta oversized em algodão premium. Modelagem solta e moderna, perfeita para looks casuais e streetwear.",
            price: 99.9,
            images: [
                "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=800",
                "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800",
            ],
            categoryId: categories[0].id,
            stock: 35,
        },
        {
            name: "Camiseta Listrada Navy",
            slug: "camiseta-listrada-navy",
            description:
                "Camiseta com listras horizontais em azul marinho e branco. Estilo náutico atemporal com tecido de primeira qualidade.",
            price: 89.9,
            images: [
                "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800",
            ],
            categoryId: categories[0].id,
            stock: 25,
        },
        {
            name: "Calça Jeans Slim Escura",
            slug: "calca-jeans-slim-escura",
            description:
                "Calça jeans slim fit em denim escuro com elastano para conforto. Lavagem escura sofisticada, ideal para todas as ocasiões.",
            price: 189.9,
            images: [
                "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800",
                "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800",
            ],
            categoryId: categories[1].id,
            stock: 30,
        },
        {
            name: "Calça Cargo Bege",
            slug: "calca-cargo-bege",
            description:
                "Calça cargo em sarja de algodão. Bolsos laterais funcionais e cintura ajustável. Estilo utilitário com conforto.",
            price: 169.9,
            images: [
                "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800",
            ],
            categoryId: categories[1].id,
            stock: 20,
        },
        {
            name: "Calça Moletom Cinza",
            slug: "calca-moletom-cinza",
            description:
                "Calça de moletom em algodão fleece. Punhos na barra, bolsos laterais e cordão na cintura. Máximo conforto para o dia a dia.",
            price: 139.9,
            images: [
                "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800",
            ],
            categoryId: categories[1].id,
            stock: 40,
        },
        {
            name: "Tênis Runner Preto",
            slug: "tenis-runner-preto",
            description:
                "Tênis esportivo com solado em EVA e cabedal em mesh respirável. Perfeito para corridas leves e uso casual. Amortecimento premium.",
            price: 299.9,
            images: [
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
                "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800",
            ],
            categoryId: categories[2].id,
            stock: 15,
        },
        {
            name: "Tênis Casual Branco",
            slug: "tenis-casual-branco",
            description:
                "Tênis branco minimalista em couro sintético. Design clean e atemporal, combina com tudo. Sola de borracha flexível.",
            price: 249.9,
            images: [
                "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800",
            ],
            categoryId: categories[2].id,
            stock: 22,
        },
        {
            name: "Boné Aba Reta Preto",
            slug: "bone-aba-reta-preto",
            description:
                "Boné aba reta com fechamento em snapback. Tecido estruturado e bordado frontal discreto. Tamanho único ajustável.",
            price: 69.9,
            images: [
                "https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=800",
            ],
            categoryId: categories[3].id,
            stock: 60,
        },
        {
            name: "Mochila Urbana Cinza",
            slug: "mochila-urbana-cinza",
            description:
                "Mochila em nylon impermeável com compartimento para notebook de até 15 polegadas. Alças acolchoadas e múltiplos bolsos organizadores.",
            price: 199.9,
            images: [
                "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
            ],
            categoryId: categories[3].id,
            stock: 18,
        },
        {
            name: "Relógio Minimalista Preto",
            slug: "relogio-minimalista-preto",
            description:
                "Relógio com caixa de 40mm em aço inoxidável preto. Pulseira em couro genuíno. Mostrador limpo e elegante com movimento quartz.",
            price: 349.9,
            images: [
                "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800",
            ],
            categoryId: categories[3].id,
            stock: 10,
        },
        {
            name: "Óculos de Sol Aviador",
            slug: "oculos-sol-aviador",
            description:
                "Óculos de sol estilo aviador com armação dourada e lentes escuras com proteção UV400. Clássico e elegante.",
            price: 159.9,
            images: [
                "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800",
            ],
            categoryId: categories[3].id,
            stock: 28,
        },
    ];

    for (const product of products) {
        await prisma.product.upsert({
            where: { slug: product.slug },
            update: {},
            create: {
                name: product.name,
                slug: product.slug,
                description: product.description,
                price: product.price,
                images: product.images,
                categoryId: product.categoryId,
                stock: product.stock,
                active: true,
            },
        });
    }
    console.log(`✅ ${products.length} products created`);

    console.log("🎉 Seed completed!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

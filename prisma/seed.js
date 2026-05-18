const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

const imagePool = [
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200",
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200",
  "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200",
  "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=1200"
];

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

async function main() {
  await prisma.lead.deleteMany();
  await prisma.product.deleteMany();
  await prisma.project.deleteMany();
  await prisma.category.deleteMany();

  const categories = [
    { name: "Sofas", slug: "sofas", world: "FURNITURE" },
    { name: "Chairs", slug: "chairs", world: "FURNITURE" },
    { name: "Tables", slug: "tables", world: "FURNITURE" },
    { name: "Storage", slug: "storage", world: "FURNITURE" },
    { name: "Living", slug: "living", world: "INTERIOR" },
    { name: "Bedroom", slug: "bedroom", world: "INTERIOR" }
  ];

  const createdCategories = [];
  for (const category of categories) {
    createdCategories.push(await prisma.category.create({ data: category }));
  }

  const furnitureCategories = createdCategories.filter((c) => c.world === "FURNITURE");

  const productIds = [];
  for (let i = 0; i < 24; i += 1) {
    const name = `${faker.commerce.productAdjective()} ${faker.commerce.productMaterial()} ${faker.helpers.arrayElement(["Sofa", "Chair", "Table", "Console"])}`;
    const category = faker.helpers.arrayElement(furnitureCategories);
    const product = await prisma.product.create({
      data: {
        name,
        slug: `${slugify(name)}-${i + 1}`,
        categoryId: category.id,
        description: faker.commerce.productDescription(),
        photos: faker.helpers.arrayElements(imagePool, { min: 2, max: 4 }),
        price: Number(faker.commerce.price({ min: 12000, max: 150000 })),
        discount: faker.helpers.arrayElement([0, 0, 5, 10, 15, 20]),
        colors: faker.helpers.arrayElements(
          ["#1A1A2E", "#C9A84C", "#F5F0E8", "#5B4A3F", "#D9D4CC"],
          { min: 2, max: 4 }
        ),
        sizes: faker.helpers.arrayElements(["S", "M", "L", "XL"], { min: 1, max: 3 }),
        inStock: Math.random() < 0.85,
        featured: Math.random() < 0.3,
        relatedIds: [],
        createdAt: faker.date.recent({ days: 120 })
      }
    });
    productIds.push(product.id);
  }

  const products = await prisma.product.findMany();
  for (const product of products) {
    const related = faker.helpers
      .arrayElements(
        productIds.filter((id) => id !== product.id),
        { min: 3, max: 5 }
      )
      .slice(0, 4);
    await prisma.product.update({
      where: { id: product.id },
      data: { relatedIds: related }
    });
  }

  for (let i = 0; i < 10; i += 1) {
    const title = `${faker.location.city()} ${faker.helpers.arrayElement(["Loft", "Residence", "Studio", "Villa"])}`;
    await prisma.project.create({
      data: {
        title,
        slug: `${slugify(title)}-${i + 1}`,
        style: faker.helpers.arrayElement(["Modern", "Classic", "Minimalist", "Contemporary"]),
        beforePhoto: faker.helpers.arrayElement(imagePool),
        afterPhoto: faker.helpers.arrayElement(imagePool),
        description: faker.lorem.sentences(2),
        featured: Math.random() < 0.4
      }
    });
  }

  for (let i = 0; i < 40; i += 1) {
    await prisma.lead.create({
      data: {
        name: faker.person.fullName(),
        phone: faker.phone.number("##########"),
        email: faker.helpers.arrayElement([faker.internet.email(), null]),
        message: faker.helpers.arrayElement([faker.lorem.sentence(), null]),
        type: faker.helpers.arrayElement(["PRODUCT_ENQUIRY", "CONSULTATION"]),
        productId: faker.helpers.arrayElement([faker.helpers.arrayElement(productIds), null]),
        status: faker.helpers.arrayElement(["NEW", "CONTACTED", "CLOSED"]),
        createdAt: faker.date.recent({ days: 30 })
      }
    });
  }

  console.log("Seed complete: categories, products, projects, leads created.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

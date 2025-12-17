import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createMenuItem(
  restaurantId: string,
  name: string,
  type: "food" | "drink" | "extra",
  basePrice: number,
  optionGroups: {
    name: string;
    selection: "single" | "multiple";
    options: { name: string; priceDelta?: number }[];
  }[]
) {
  return prisma.menuItem.create({
    data: {
      restaurantId,
      name,
      type,
      basePrice,
      optionGroups: {
        create: optionGroups.map((g) => ({
          name: g.name,
          selection: g.selection,
          options: {
            create: g.options.map((o) => ({
              name: o.name,
              priceDelta: o.priceDelta ?? 0,
            })),
          },
        })),
      },
    },
  });
}

async function main() {
  const restaurant = await prisma.restaurant.upsert({
    where: { slug: "default" },
    update: {},
    create: { name: "Default Restaurant", slug: "default" },
  });

  // Food: Baguette/Breadless Box with meats, fillings, sauces
  await createMenuItem(restaurant.id, "Baguette", "food", 4.99, [
    {
      name: "Main",
      selection: "single",
      options: [
        { name: "Baguette", priceDelta: 0 },
        { name: "Breadless Box", priceDelta: 0 },
      ],
    },
    {
      name: "Meats",
      selection: "single",
      options: [
        { name: "Pork" },
        { name: "Turkey" },
        { name: "Beef" },
        { name: "Prime Sausage" },
        { name: "Local Thick Cut Bacon" },
        { name: "Meat Free Option - Fake Steak" },
      ],
    },
    {
      name: "Fillings",
      selection: "multiple",
      options: [
        { name: "Stuffing" },
        { name: "Cooked Onions" },
        { name: "Crispy Onions" },
        { name: "Crackling" },
        { name: "Meat Juices" },
        { name: "Cheese Sauce" },
        { name: "Curry Sauce" },
        { name: "Gravy" },
      ],
    },
    {
      name: "Sauces",
      selection: "single",
      options: [
        { name: "Flamin' Mo Hot Sauce" },
        { name: "Ketchup" },
        { name: "Mayonnaise" },
        { name: "Brown Sauce" },
        { name: "Apple Sauce" },
        { name: "Cranberry Sauce" },
        { name: "Creamed Horseradish" },
        { name: "BBQ Sauce" },
        { name: "Mustard" },
        { name: "Mint" },
      ],
    },
  ]);

  // Drinks (no options)
  await createMenuItem(restaurant.id, "Coke", "drink", 1.5, []);
  await createMenuItem(restaurant.id, "Water", "drink", 1.0, []);

  // Extras (no options)
  await createMenuItem(restaurant.id, "Chips", "extra", 2.0, []);
  await createMenuItem(restaurant.id, "Cookie", "extra", 1.25, []);

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
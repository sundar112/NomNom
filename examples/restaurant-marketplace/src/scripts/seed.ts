import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";
import {
  CreateInventoryLevelInput,
  CreateProductWorkflowInputDTO,
  ExecArgs,
} from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import { RESTAURANT_MODULE } from "../modules/restaurant";
import { CONTENT_MODULE } from "../modules/content";

/**
 * FoFood is a single general food-delivery restaurant carrying a broad menu
 * across multiple categories. Images are stable Unsplash photo URLs; the
 * storefront's next.config allows the images.unsplash.com domain.
 *
 * This seed is idempotent: it reuses any existing region / stock location /
 * shipping / publishable key, and only creates the food categories, products,
 * restaurant and links that don't already exist. Safe to re-run.
 */
const IMG = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;

const FOOD_PRODUCTS: Array<{
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
}> = [
  // Burgers
  {
    name: "Classic Cheeseburger",
    category: "Burgers",
    price: 8.5,
    image: IMG("1550547660-d9450f859349"),
    description:
      "A juicy beef patty with melted cheddar, fresh lettuce, tomato and our house sauce in a toasted brioche bun.",
  },
  {
    name: "Double Bacon Burger",
    category: "Burgers",
    price: 10.9,
    image: IMG("1568901346375-23c9450c58cd"),
    description:
      "Two flame-grilled beef patties stacked with crispy bacon, double cheese and smoky barbecue sauce.",
  },
  // Pizza
  {
    name: "Margherita Pizza",
    category: "Pizza",
    price: 9.0,
    image: IMG("1574071318508-1cdbab80d002"),
    description:
      "Wood-fired stone-baked pizza topped with San Marzano tomato, fresh mozzarella and basil.",
  },
  {
    name: "Pepperoni Pizza",
    category: "Pizza",
    price: 11.5,
    image: IMG("1513104890138-7c749659a591"),
    description:
      "Hand-stretched dough loaded with spicy pepperoni, mozzarella and a rich tomato base.",
  },
  // Pasta
  {
    name: "Spaghetti Bolognese",
    category: "Pasta",
    price: 10.0,
    image: IMG("1621996346565-e3dbc646d9a9"),
    description:
      "Al dente spaghetti tossed in a slow-cooked beef and tomato ragù, finished with parmesan.",
  },
  {
    name: "Creamy Carbonara",
    category: "Pasta",
    price: 10.5,
    image: IMG("1551183053-bf91a1d81141"),
    description:
      "Silky pasta in a classic carbonara sauce with pancetta, egg yolk and cracked black pepper.",
  },
  // Salads
  {
    name: "Caesar Salad",
    category: "Salads",
    price: 7.5,
    image: IMG("1546793665-c74683f339c1"),
    description:
      "Crisp romaine, garlic croutons and shaved parmesan tossed in a creamy Caesar dressing.",
  },
  {
    name: "Garden Greens Salad",
    category: "Salads",
    price: 6.9,
    image: IMG("1512621776951-a57141f2eefd"),
    description:
      "A fresh mix of seasonal greens, cherry tomatoes, cucumber and avocado with a light vinaigrette.",
  },
  // Desserts
  {
    name: "Chocolate Lava Cake",
    category: "Desserts",
    price: 5.5,
    image: IMG("1578985545062-69928b1d9587"),
    description:
      "A warm chocolate cake with a molten centre, served with a scoop of vanilla ice cream.",
  },
  {
    name: "Glazed Donut",
    category: "Desserts",
    price: 2.8,
    image: IMG("1551024601-bec78aea704b"),
    description:
      "A soft, pillowy donut finished with a glossy sweet glaze. The perfect everyday treat.",
  },
  // Drinks
  {
    name: "Fresh Orange Juice",
    category: "Drinks",
    price: 3.5,
    image: IMG("1600271886742-f049cd451bba"),
    description:
      "Freshly squeezed oranges served chilled — no added sugar, just pure juice.",
  },
  {
    name: "Berry Smoothie",
    category: "Drinks",
    price: 4.0,
    image: IMG("1505252585461-04db1eb84625"),
    description: "A refreshing blend of mixed berries and yoghurt, served cold.",
  },
  {
    name: "Iced Coffee",
    category: "Drinks",
    price: 3.8,
    image: IMG("1495474472287-4d71bcdd2085"),
    description: "Smooth cold-brew coffee over ice with a splash of milk.",
  },
];

const BLOG_POSTS: Array<{
  title: string;
  image: string;
  excerpt: string;
  author_name: string;
  author_avatar: string;
  published_at: string;
  content: string;
}> = [
  {
    title: "Fresh Food on Wheels: How Delivery Is Changing the Way We Eat",
    image: "/assets/img/article-1.jpg",
    excerpt:
      "From the kitchen to your door in minutes — a look at how on-demand food delivery is reshaping mealtimes.",
    author_name: "Trojan Fox",
    author_avatar: "/assets/img/avatar-1.png",
    published_at: "2026-05-28",
    content:
      '<p class="text-body-2-regular text-secondary-50">On-demand food delivery has transformed the way we think about meals. With a few taps, a freshly prepared burger, a wood-fired pizza or a crisp salad can be on its way to your door. At FoFood, every order is cooked to order and handed to a driver the moment it is ready.</p><p class="text-body-2-regular text-secondary-50 mt-6">Behind that simple experience is a carefully orchestrated journey: the restaurant accepts your order, the kitchen begins preparing, a driver claims the delivery and brings it to you — all tracked in real time.</p>',
  },
  {
    title: "Topping Recommendations Every Burger Lover Should Try",
    image: "/assets/img/article-2.jpg",
    excerpt:
      "Crispy bacon, melted cheddar, caramelised onions — the toppings that take a burger from good to unforgettable.",
    author_name: "Mia Roberts",
    author_avatar: "/assets/img/avatar-2.png",
    published_at: "2026-05-20",
    content:
      '<p class="text-body-2-regular text-secondary-50">A great burger is all about balance. Start with a quality patty, then build layers of flavour and texture: smoky bacon, sharp cheese, fresh greens and a sauce that ties it all together.</p><p class="text-body-2-regular text-secondary-50 mt-6">Our Double Bacon Burger is a customer favourite for exactly this reason — try it with a side of fresh orange juice.</p>',
  },
  {
    title: "The Secret to a Perfect Wood-Fired Pizza",
    image: "/assets/img/article-3.jpg",
    excerpt:
      "Great dough, San Marzano tomatoes and a blazing-hot oven — the fundamentals of a true Margherita.",
    author_name: "Luca Bianchi",
    author_avatar: "/assets/img/avatar-3.png",
    published_at: "2026-05-12",
    content:
      '<p class="text-body-2-regular text-secondary-50">The magic of a wood-fired pizza is in its simplicity. A well-rested dough, quality tomatoes and fresh mozzarella, finished in an oven hot enough to blister the crust in seconds.</p><p class="text-body-2-regular text-secondary-50 mt-6">Our Margherita keeps things classic, while the Pepperoni adds a spicy kick for those who like a little heat.</p>',
  },
  {
    title: "Eating Well on the Go: Salads That Actually Satisfy",
    image: "/assets/img/article-4.jpg",
    excerpt:
      "Fresh, filling and full of flavour — proof that a salad can be the highlight of your day.",
    author_name: "Sara Lin",
    author_avatar: "/assets/img/avatar-4.png",
    published_at: "2026-05-04",
    content:
      '<p class="text-body-2-regular text-secondary-50">A good salad is anything but boring. Crisp leaves, vibrant vegetables, a punchy dressing and the right toppings turn a simple bowl into a complete meal.</p><p class="text-body-2-regular text-secondary-50 mt-6">Our Caesar and Garden Greens salads are made fresh for every order — the perfect lighter choice.</p>',
  },
  {
    title: "Why Dessert Always Deserves a Spot in Your Order",
    image: "/assets/img/article-5.jpg",
    excerpt:
      "A warm chocolate lava cake or a glazed donut — the sweet ending every meal deserves.",
    author_name: "Trojan Fox",
    author_avatar: "/assets/img/avatar-1.png",
    published_at: "2026-04-26",
    content:
      '<p class="text-body-2-regular text-secondary-50">No meal is truly complete without something sweet. Whether it is a molten chocolate lava cake or a classic glazed donut, dessert is the moment to treat yourself.</p><p class="text-body-2-regular text-secondary-50 mt-6">Add one to your next FoFood order and finish on a high note.</p>',
  },
  {
    title: "Behind the Scenes: How Your Order Reaches Your Door",
    image: "/assets/img/article-6.jpg",
    excerpt:
      "From the kitchen to the driver to your doorstep — a peek at the journey of every FoFood order.",
    author_name: "Mia Roberts",
    author_avatar: "/assets/img/avatar-2.png",
    published_at: "2026-04-18",
    content:
      '<p class="text-body-2-regular text-secondary-50">Every FoFood order follows a clear journey. Once you place it, the restaurant is notified and a driver is assigned. The kitchen prepares your food, the driver picks it up, and you can follow each step in real time on the order tracking page.</p>',
  },
];

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);
  const regionModuleService = container.resolve(Modules.REGION) as any;
  const stockLocationModuleService = container.resolve(
    Modules.STOCK_LOCATION
  ) as any;
  const apiKeyModuleService = container.resolve(Modules.API_KEY) as any;
  const productModuleService = container.resolve(Modules.PRODUCT) as any;
  const restaurantModuleService = container.resolve(RESTAURANT_MODULE) as any;
  const contentModuleService = container.resolve(CONTENT_MODULE) as any;

  const countries = ["gb", "de", "dk", "se", "fr", "es", "it"];

  logger.info("Seeding store data...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [{ name: "Default Sales Channel" }],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_currencies: [
          { currency_code: "eur", is_default: true },
          { currency_code: "usd" },
        ],
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });

  logger.info("Seeding region data...");
  let [region] = await regionModuleService.listRegions({ name: "Europe" });
  if (!region) {
    const { result: regionResult } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "Europe",
            currency_code: "eur",
            countries,
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    });
    region = regionResult[0];

    logger.info("Seeding tax regions...");
    await createTaxRegionsWorkflow(container).run({
      input: countries.map((country_code) => ({
        country_code,
        provider_id: "tp_system",
      })),
    });
  }
  logger.info("Finished seeding regions.");

  logger.info("Seeding stock location data...");
  let [stockLocation] = await stockLocationModuleService.listStockLocations({
    name: "European Warehouse",
  });
  if (!stockLocation) {
    const { result: stockLocationResult } = await createStockLocationsWorkflow(
      container
    ).run({
      input: {
        locations: [
          {
            name: "European Warehouse",
            address: { city: "Copenhagen", country_code: "DK", address_1: "" },
          },
        ],
      },
    });
    stockLocation = stockLocationResult[0];

    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
      [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
    });

    await linkSalesChannelsToStockLocationWorkflow(container).run({
      input: { id: stockLocation.id, add: [defaultSalesChannel[0].id] },
    });
  }

  logger.info("Seeding fulfillment data...");
  let [shippingProfile] = await fulfillmentModuleService.listShippingProfiles({
    name: "Default",
  });
  if (!shippingProfile) {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: { data: [{ name: "Default", type: "default" }] },
      });
    shippingProfile = shippingProfileResult[0];
  }

  let [fulfillmentSet] = await fulfillmentModuleService.listFulfillmentSets({
    name: "European Warehouse delivery",
  });
  if (!fulfillmentSet) {
    fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
      name: "European Warehouse delivery",
      type: "shipping",
      service_zones: [
        {
          name: "Europe",
          geo_zones: countries.map((country_code) => ({
            country_code,
            type: "country",
          })),
        },
      ],
    });

    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
      [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
    });

    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: "Standard Shipping",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: fulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Standard",
            description: "Ship in 2-3 days.",
            code: "standard",
          },
          prices: [
            { currency_code: "usd", amount: 10 },
            { currency_code: "eur", amount: 10 },
            { region_id: region.id, amount: 10 },
          ],
          rules: [
            { attribute: "enabled_in_store", value: "true", operator: "eq" },
            { attribute: "is_return", value: "false", operator: "eq" },
          ],
        },
        {
          name: "Express Shipping",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: fulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Express",
            description: "Ship in 24 hours.",
            code: "express",
          },
          prices: [
            { currency_code: "usd", amount: 10 },
            { currency_code: "eur", amount: 10 },
            { region_id: region.id, amount: 10 },
          ],
          rules: [
            { attribute: "enabled_in_store", value: '"true"', operator: "eq" },
            { attribute: "is_return", value: "false", operator: "eq" },
          ],
        },
      ],
    });
  }
  logger.info("Finished seeding fulfillment data.");

  logger.info("Seeding publishable API key data...");
  let [publishableApiKey] = await apiKeyModuleService.listApiKeys({
    title: "Webshop",
    type: "publishable",
  });
  if (!publishableApiKey) {
    const { result: publishableApiKeyResult } = await createApiKeysWorkflow(
      container
    ).run({
      input: {
        api_keys: [{ title: "Webshop", type: "publishable", created_by: "" }],
      },
    });
    publishableApiKey = publishableApiKeyResult[0];

    await linkSalesChannelsToApiKeyWorkflow(container).run({
      input: { id: publishableApiKey.id, add: [defaultSalesChannel[0].id] },
    });
  }
  logger.info("Finished seeding publishable API key data.");

  logger.info("Seeding food categories...");
  const categoryNames = [
    "Burgers",
    "Pizza",
    "Pasta",
    "Salads",
    "Desserts",
    "Drinks",
  ];

  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
    filters: { name: categoryNames },
  });
  const existingCategoryNames = new Set(
    existingCategories.map((c: any) => c.name)
  );
  const categoriesToCreate = categoryNames.filter(
    (name) => !existingCategoryNames.has(name)
  );

  if (categoriesToCreate.length) {
    await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: categoriesToCreate.map((name) => ({
          name,
          is_active: true,
        })),
      },
    });
  }

  const { data: allCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
    filters: { name: categoryNames },
  });
  const categoryByName = new Map(
    allCategories.map((cat: any) => [cat.name, cat.id])
  );

  logger.info("Seeding food product data...");
  const allHandles = FOOD_PRODUCTS.map((f) => slugify(f.name));

  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
    filters: { handle: allHandles },
  });
  const existingHandles = new Set(existingProducts.map((p: any) => p.handle));

  const productsInput: CreateProductWorkflowInputDTO[] = FOOD_PRODUCTS.filter(
    (food) => !existingHandles.has(slugify(food.name))
  ).map((food) => ({
    title: food.name,
    handle: slugify(food.name),
    category_ids: [categoryByName.get(food.category)!],
    description: food.description,
    status: ProductStatus.PUBLISHED,
    shipping_profile_id: shippingProfile.id,
    weight: 200,
    images: [{ url: food.image }],
    thumbnail: food.image,
    options: [{ title: "Size", values: ["Regular"] }],
    variants: [
      {
        title: "Regular",
        sku: slugify(food.name).toUpperCase(),
        options: { Size: "Regular" },
        prices: [
          { amount: food.price, currency_code: "eur" },
          { amount: food.price, currency_code: "usd" },
        ],
      },
    ],
    sales_channels: [{ id: defaultSalesChannel[0].id }],
  }));

  if (productsInput.length) {
    await createProductsWorkflow(container).run({
      input: { products: productsInput },
    });
  }
  logger.info("Finished seeding food product data.");

  // Clean up any leftover products / categories from earlier seeds so the
  // admin catalog only contains the FoFood food menu.
  logger.info("Cleaning up non-food products and categories...");
  const foodHandleSet = new Set(allHandles);
  const { data: everyProduct } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
    pagination: { take: 1000, skip: 0 },
  });
  const staleProductIds = everyProduct
    .filter((p: any) => !foodHandleSet.has(p.handle))
    .map((p: any) => p.id);
  if (staleProductIds.length) {
    await productModuleService.deleteProducts(staleProductIds);
    logger.info(`Deleted ${staleProductIds.length} non-food product(s).`);
  }

  const foodCategorySet = new Set(categoryNames);
  const { data: everyCategory } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
    pagination: { take: 1000, skip: 0 },
  });
  const staleCategoryIds = everyCategory
    .filter((c: any) => !foodCategorySet.has(c.name))
    .map((c: any) => c.id);
  if (staleCategoryIds.length) {
    await productModuleService.deleteProductCategories(staleCategoryIds);
    logger.info(`Deleted ${staleCategoryIds.length} non-food category(ies).`);
  }

  logger.info("Seeding restaurant data...");
  const restaurantDetails = {
    name: "FoFood Kitchen",
    description:
      "Your favourite food, delivered fast — burgers, pizza, pasta, salads, desserts and drinks, all freshly made to order.",
    is_open: true,
    phone: "+45 12 34 56 78",
    email: "hello@fofood.com",
    address: "Food Street 1, Copenhagen, Denmark",
    image_url: IMG("1517248135467-4c7edcad34c4"),
  };

  let [restaurant] = await restaurantModuleService.listRestaurants({
    handle: "fofood",
  });
  if (!restaurant) {
    restaurant = await restaurantModuleService.createRestaurants({
      handle: "fofood",
      ...restaurantDetails,
    });
  } else {
    // Keep an existing restaurant up-to-date (name, image, open state)
    await restaurantModuleService.updateRestaurants({
      id: restaurant.id,
      ...restaurantDetails,
    });
  }

  // Reset the restaurant's menu to exactly the FoFood food products:
  // unlink anything currently linked, then link the food products only.
  const { data: allFoodProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
    filters: { handle: allHandles },
  });
  const { data: [restaurantWithProducts] } = await query.graph({
    entity: "restaurants",
    fields: ["id", "products.id"],
    filters: { id: restaurant.id },
  });
  const currentlyLinked = restaurantWithProducts?.products ?? [];

  await Promise.all(
    currentlyLinked.map((p: any) =>
      link.dismiss({
        [RESTAURANT_MODULE]: { restaurant_id: restaurant.id },
        [Modules.PRODUCT]: { product_id: p.id },
      })
    )
  );

  await Promise.all(
    allFoodProducts.map((product: any) =>
      link.create({
        [RESTAURANT_MODULE]: { restaurant_id: restaurant.id },
        [Modules.PRODUCT]: { product_id: product.id },
      })
    )
  );
  logger.info(
    `Restaurant menu reset: unlinked ${currentlyLinked.length}, linked ${allFoodProducts.length} food product(s).`
  );

  logger.info("Seeding inventory levels...");
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id", "location_levels.location_id"],
  });

  const inventoryLevels: CreateInventoryLevelInput[] = inventoryItems
    .filter(
      (item: any) =>
        !(item.location_levels ?? []).some(
          (lvl: any) => lvl.location_id === stockLocation.id
        )
    )
    .map((item: any) => ({
      location_id: stockLocation.id,
      stocked_quantity: 1000000,
      inventory_item_id: item.id,
    }));

  if (inventoryLevels.length) {
    await createInventoryLevelsWorkflow(container).run({
      input: { inventory_levels: inventoryLevels },
    });
  }
  logger.info("Finished seeding inventory levels data.");

  logger.info("Seeding blog posts...");
  const existingPosts = await contentModuleService.listPosts({});
  const existingPostHandles = new Set(
    existingPosts.map((p: any) => p.handle)
  );
  const postsToCreate = BLOG_POSTS.filter(
    (post) => !existingPostHandles.has(slugify(post.title))
  ).map((post) => ({
    title: post.title,
    handle: slugify(post.title),
    image: post.image,
    excerpt: post.excerpt,
    author_name: post.author_name,
    author_avatar: post.author_avatar,
    published_at: post.published_at,
    content: post.content,
  }));
  if (postsToCreate.length) {
    await contentModuleService.createPosts(postsToCreate);
  }
  logger.info(`Seeded ${postsToCreate.length} blog post(s).`);

  logger.info("========================================================");
  logger.info("Seed complete. Copy these into the storefront .env.local:");
  logger.info(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${publishableApiKey.token}`);
  logger.info(`NEXT_PUBLIC_MEDUSA_REGION_ID=${region.id}`);
  logger.info(`NEXT_PUBLIC_RESTAURANT_ID=${restaurant.id}`);
  logger.info("========================================================");
}

import Medusa from "@medusajs/js-sdk";

export const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
export const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";
export const REGION_ID = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID || "";
export const RESTAURANT_ID = process.env.NEXT_PUBLIC_RESTAURANT_ID || "";

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  publishableKey: PUBLISHABLE_KEY,
  auth: {
    type: "jwt",
  },
});

/* ---------------------- Lightweight server-side cache --------------------- */
/* The storefront is read-heavy and its data changes rarely, but the backend's
 * product-graph query is expensive (~2s per call). We memoize each result
 * in-process with a short TTL so repeated navigations — and the several
 * sections that need the same data on one page — reuse a single in-flight
 * fetch instead of each paying the full round-trip.
 *
 * (React's `cache()` would only dedupe within a single request, and isn't even
 * exported by the React 18.2 this app pins, so a tiny TTL memo is both more
 * effective and version-safe here.) */
const CACHE_TTL_MS = 60_000;

function memoize<T>(ttl = CACHE_TTL_MS): (fetcher: () => Promise<T>) => Promise<T> {
  let entry: { value: Promise<T>; expires: number } | null = null;
  return (fetcher) => {
    const now = Date.now();
    if (entry && entry.expires > now) return entry.value;
    const value = fetcher();
    entry = { value, expires: now + ttl };
    // If the fetch rejects, drop the cache so the next call retries cleanly.
    value.catch(() => {
      if (entry && entry.value === value) entry = null;
    });
    return value;
  };
}

/* ----------------------------- Domain types ----------------------------- */

export interface MenuItem {
  id: string;
  variantId: string;
  name: string;
  handle: string;
  description: string;
  image: string;
  images: string[];
  price: number;
  priceFormatted: string;
  currency: string;
  category: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  count: number;
  image: string;
  items: MenuItem[];
}

export interface Menu {
  restaurantId: string;
  restaurantName: string;
  isOpen: boolean;
  categories: MenuCategory[];
  items: MenuItem[];
}

/* ------------------------------- Helpers -------------------------------- */

export function formatPrice(amount: number, currency = "eur"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency.toUpperCase()}`;
  }
}

function toMenuItem(product: any): MenuItem {
  const variant = product?.variants?.[0];
  const price = variant?.calculated_price?.calculated_amount ?? 0;
  const currency =
    variant?.calculated_price?.currency_code ||
    variant?.calculated_price?.currency_code ||
    "eur";
  const images: string[] = (product?.images ?? [])
    .map((img: any) => img?.url)
    .filter(Boolean);
  const image = product?.thumbnail || images[0] || "";

  return {
    id: product.id,
    variantId: variant?.id ?? "",
    name: product.title,
    handle: product.handle,
    description: product.description ?? "",
    image,
    images: images.length ? images : image ? [image] : [],
    price,
    priceFormatted: formatPrice(price, currency),
    currency,
    category: product?.categories?.[0]?.name ?? "Other",
  };
}

/* ------------------------------ Restaurant ------------------------------ */

async function fetchRestaurant(): Promise<any | null> {
  const res = await sdk.client.fetch<{ restaurants: any[] }>("/restaurants", {
    query: { currency_code: "eur" },
  });
  const restaurants = res?.restaurants ?? [];
  if (!restaurants.length) return null;
  if (RESTAURANT_ID) {
    return restaurants.find((r) => r.id === RESTAURANT_ID) ?? restaurants[0];
  }
  return restaurants[0];
}

const menuCache = memoize<Menu>();

/** Returns the full menu (all categories + all items) for the storefront. */
export function getMenu(): Promise<Menu> {
  return menuCache(async () => {
  const restaurant = await fetchRestaurant();

  if (!restaurant) {
    return {
      restaurantId: "",
      restaurantName: "FoFood",
      isOpen: false,
      categories: [],
      items: [],
    };
  }

  const items: MenuItem[] = (restaurant.products ?? []).map(toMenuItem);

  const categoryMap = new Map<string, MenuCategory>();
  for (const item of items) {
    let cat = categoryMap.get(item.category);
    if (!cat) {
      cat = {
        id: item.category.toLowerCase(),
        name: item.category,
        count: 0,
        image: item.image,
        items: [],
      };
      categoryMap.set(item.category, cat);
    }
    cat.items.push(item);
    cat.count += 1;
  }

  return {
    restaurantId: restaurant.id,
    restaurantName: restaurant.name,
    isOpen: !!restaurant.is_open,
    categories: Array.from(categoryMap.values()),
    items,
  };
  });
}

/** Find a single menu item by its product handle. */
export async function getMenuItemByHandle(
  handle: string
): Promise<MenuItem | null> {
  const menu = await getMenu();
  return menu.items.find((item) => item.handle === handle) ?? null;
}

/* --------------------------------- Cart --------------------------------- */
/* These run client-side and hit the stock /store/* API (CORS-enabled for
 * the storefront). The active cart id is persisted in localStorage. */

export interface ShippingAddressInput {
  first_name: string;
  last_name: string;
  address_1: string;
  city: string;
  postal_code: string;
  country_code: string;
  phone?: string;
  province?: string;
}

export async function retrieveCart(cartId: string): Promise<any | null> {
  try {
    const { cart } = await sdk.store.cart.retrieve(cartId);
    return cart;
  } catch {
    return null;
  }
}

export async function createCart(): Promise<any> {
  const { cart } = await sdk.store.cart.create({ region_id: REGION_ID });
  return cart;
}

export async function addLineItem(
  cartId: string,
  variantId: string,
  quantity = 1
): Promise<any> {
  const { cart } = await sdk.store.cart.createLineItem(cartId, {
    variant_id: variantId,
    quantity,
  });
  return cart;
}

export async function updateLineItem(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<any> {
  const { cart } = await sdk.store.cart.updateLineItem(cartId, lineId, {
    quantity,
  });
  return cart;
}

export async function removeLineItem(
  cartId: string,
  lineId: string
): Promise<any | null> {
  await sdk.store.cart.deleteLineItem(cartId, lineId);
  return retrieveCart(cartId);
}

export async function updateCartContact(
  cartId: string,
  email: string,
  address: ShippingAddressInput
): Promise<any> {
  const { cart } = await sdk.store.cart.update(cartId, {
    email,
    shipping_address: address,
    billing_address: address,
  });
  return cart;
}

export async function listCartShippingOptions(cartId: string): Promise<any[]> {
  const res = await sdk.store.fulfillment.listCartOptions({ cart_id: cartId });
  return res?.shipping_options ?? [];
}

export async function addShippingMethod(
  cartId: string,
  optionId: string
): Promise<any> {
  const { cart } = await sdk.store.cart.addShippingMethod(cartId, {
    option_id: optionId,
  });
  return cart;
}

/* ------------------------------- Delivery ------------------------------- */

export async function createDelivery(
  cartId: string
): Promise<{ delivery: any; message: string }> {
  return sdk.client.fetch<{ delivery: any; message: string }>(
    "/store/deliveries",
    {
      method: "POST",
      body: { cart_id: cartId, restaurant_id: RESTAURANT_ID },
    }
  );
}

export async function getDelivery(id: string): Promise<{ delivery: any }> {
  return sdk.client.fetch<{ delivery: any }>(`/store/deliveries/${id}`);
}

/* --------------------------------- Blog --------------------------------- */

export interface BlogPost {
  id: string;
  title: string;
  handle: string;
  image: string | null;
  excerpt: string | null;
  author_name: string | null;
  author_avatar: string | null;
  published_at: string | null;
  content: string | null;
}

const blogPostsCache = memoize<BlogPost[]>();

export function getBlogPosts(): Promise<BlogPost[]> {
  return blogPostsCache(async () => {
    try {
      const res = await sdk.client.fetch<{ posts: BlogPost[] }>("/store/blog");
      return res?.posts ?? [];
    } catch {
      return [];
    }
  });
}

export async function getBlogPost(handle: string): Promise<BlogPost | null> {
  try {
    const res = await sdk.client.fetch<{ post: BlogPost }>(
      `/store/blog/${handle}`
    );
    return res?.post ?? null;
  } catch {
    return null;
  }
}

/* ------------------------------- Contact -------------------------------- */

export async function submitContactMessage(data: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  await sdk.client.fetch("/store/contact", {
    method: "POST",
    body: data,
  });
}

/* ------------------------------ Customer auth --------------------------- */

export interface Customer {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
}

export async function registerCustomer(data: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}): Promise<Customer> {
  // 1. Create an auth identity and get a registration token.
  await sdk.auth.register("customer", "emailpass", {
    email: data.email,
    password: data.password,
  });

  // 2. Create the customer profile (uses the registration token).
  const { customer } = await sdk.store.customer.create({
    email: data.email,
    first_name: data.first_name,
    last_name: data.last_name,
    phone: data.phone,
  });

  // 3. Exchange for a real session token so the user is logged in.
  await sdk.auth.login("customer", "emailpass", {
    email: data.email,
    password: data.password,
  });

  return customer as Customer;
}

export async function loginCustomer(
  email: string,
  password: string
): Promise<Customer> {
  await sdk.auth.login("customer", "emailpass", { email, password });
  const { customer } = await sdk.store.customer.retrieve();
  return customer as Customer;
}

export async function logoutCustomer(): Promise<void> {
  await sdk.auth.logout();
}

export async function getCurrentCustomer(): Promise<Customer | null> {
  try {
    const { customer } = await sdk.store.customer.retrieve();
    return (customer as Customer) ?? null;
  } catch {
    return null;
  }
}

/** Attach the active (guest) cart to the logged-in customer. Best-effort. */
export async function transferCartToCustomer(cartId: string): Promise<void> {
  try {
    await sdk.store.cart.transferCart(cartId);
  } catch {
    /* ignore — checkout still works as a guest order */
  }
}

export const DELIVERY_STATUS_LABELS: Record<string, string> = {
  pending: "Order placed — waiting for the restaurant to accept",
  restaurant_declined: "The restaurant declined your order",
  restaurant_accepted: "Restaurant accepted your order",
  pickup_claimed: "A driver has been assigned",
  restaurant_preparing: "Your food is being prepared",
  ready_for_pickup: "Your food is ready for pickup",
  in_transit: "Your order is on the way",
  delivered: "Delivered — enjoy your meal!",
};

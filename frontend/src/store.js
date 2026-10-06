export const WHATSAPP_DISPLAY = "+57 300 200 3146";
export const WHATSAPP_LINK = "https://wa.me/573002003146";

export function whatsappHref(text) {
  return `${WHATSAPP_LINK}?text=${encodeURIComponent(text)}`;
}

export function productSubtitle(product) {
  if (product.subtitle) return product.subtitle;
  const variant = product.variants?.[0];
  if (!variant) return product.sku;
  return [variant.capacity, variant.color].filter(Boolean).join(" · ");
}

export function isAvailable(product) {
  return Number(product.stock) > 0;
}

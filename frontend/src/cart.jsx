import { createContext, useContext, useMemo, useState } from "react";

const CART_KEY = "tecnoantioquia_cart";
const CartContext = createContext(null);

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => readCart());

  function persist(next) {
    setItems(next);
    localStorage.setItem(CART_KEY, JSON.stringify(next));
  }

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      add(product, quantity = 1) {
        const id = product._id;
        const existing = items.find((item) => item.productId === id);
        const next = existing
          ? items.map((item) =>
              item.productId === id ? { ...item, quantity: item.quantity + quantity } : item
            )
          : [...items, { productId: id, name: product.name, price: product.price, quantity, image: product.images?.[0] || "" }];
        persist(next);
      },
      setQuantity(productId, quantity) {
        persist(
          items
            .map((item) => (item.productId === productId ? { ...item, quantity } : item))
            .filter((item) => item.quantity > 0)
        );
      },
      remove(productId) {
        persist(items.filter((item) => item.productId !== productId));
      },
      clear() {
        persist([]);
      }
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}

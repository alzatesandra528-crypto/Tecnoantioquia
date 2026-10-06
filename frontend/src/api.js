const TOKEN_KEY = "tecnoantioquia_token";
const USER_KEY = "tecnoantioquia_user";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(path, { ...options, headers });
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || "Error de comunicación con el servidor.");
    error.status = response.status;
    error.payload = data;
    throw error;
  }
  return data;
}

export const money = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
});

export function profitOf(product, quantity = 1) {
  const sale = Number(product.price ?? product.unitPrice) || 0;
  const cost = Number(product.cost ?? product.unitCost) || 0;
  const amount = (sale - cost) * quantity;
  const percent = sale ? ((sale - cost) / sale) * 100 : 0;
  return { amount, percent };
}

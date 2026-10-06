import React from "react";
import ReactDOM from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App.jsx";
import { AuthProvider } from "./auth.jsx";
import { CartProvider } from "./cart.jsx";
import { SiteProvider } from "./site.jsx";
import "./index.css";

registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SiteProvider>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </SiteProvider>
  </React.StrictMode>
);

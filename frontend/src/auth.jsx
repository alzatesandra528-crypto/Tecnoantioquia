import { createContext, useContext, useMemo, useState } from "react";
import { clearSession, getToken, getUser, saveSession } from "./api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getUser());
  const [token, setToken] = useState(() => getToken());

  const value = useMemo(
    () => ({
      user,
      token,
      isLoggedIn: Boolean(token && user),
      login(nextToken, nextUser) {
        saveSession(nextToken, nextUser);
        setToken(nextToken);
        setUser(nextUser);
      },
      logout() {
        clearSession();
        setToken(null);
        setUser(null);
      }
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export function homeFor(role) {
  if (role === "admin" || role === "vendedor") return "/admin";
  return "/cuenta";
}

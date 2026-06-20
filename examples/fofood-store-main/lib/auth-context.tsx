"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Customer,
  getCurrentCustomer,
  loginCustomer,
  logoutCustomer,
  registerCustomer,
} from "./medusa";

interface AuthContextValue {
  customer: Customer | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setCustomer(await getCurrentCustomer());
      setLoading(false);
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const c = await loginCustomer(email, password);
    setCustomer(c);
  }, []);

  const register = useCallback(
    async (data: {
      email: string;
      password: string;
      first_name: string;
      last_name: string;
      phone?: string;
    }) => {
      const c = await registerCustomer(data);
      setCustomer(c);
    },
    []
  );

  const logout = useCallback(async () => {
    await logoutCustomer();
    setCustomer(null);
  }, []);

  return (
    <AuthContext.Provider value={{ customer, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

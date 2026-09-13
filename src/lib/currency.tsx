"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CurrencyCode = "EGP" | "USD" | "SAR" | "EUR";

export type Currency = {
  code: CurrencyCode;
  label: string;
  symbol: string;
  /** how many EGP make up one unit of this currency (approximate) */
  egpPerUnit: number;
};

export const CURRENCIES: Currency[] = [
  { code: "EGP", label: "جنيه مصري", symbol: "ج.م", egpPerUnit: 1 },
  { code: "USD", label: "دولار", symbol: "$", egpPerUnit: 49 },
  { code: "SAR", label: "ريال سعودي", symbol: "ر.س", egpPerUnit: 13.05 },
  { code: "EUR", label: "يورو", symbol: "€", egpPerUnit: 53 },
];

type CurrencyContextValue = {
  currency: Currency;
  setCurrencyCode: (code: CurrencyCode) => void;
  convert: (amountEGP: number) => number;
  format: (amountEGP: number) => { amount: string; symbol: string };
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);
const STORAGE_KEY = "qulub-rahima-currency";

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [code, setCode] = useState<CurrencyCode>("EGP");
  const [rates, setRates] = useState<Record<CurrencyCode, number>>({
    EGP: 1,
    USD: CURRENCIES.find((c) => c.code === "USD")!.egpPerUnit,
    SAR: CURRENCIES.find((c) => c.code === "SAR")!.egpPerUnit,
    EUR: CURRENCIES.find((c) => c.code === "EUR")!.egpPerUnit,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
      if (saved && CURRENCIES.some((c) => c.code === saved)) setCode(saved);
    } catch {
      // ignore inaccessible storage
    }
  }, []);

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((settings: { usdRate?: number; sarRate?: number; eurRate?: number } | null) => {
        if (!settings) return;
        setRates((prev) => ({
          ...prev,
          USD: typeof settings.usdRate === "number" ? settings.usdRate : prev.USD,
          SAR: typeof settings.sarRate === "number" ? settings.sarRate : prev.SAR,
          EUR: typeof settings.eurRate === "number" ? settings.eurRate : prev.EUR,
        }));
      })
      .catch(() => {
        // keep default rates if the request fails
      });
  }, []);

  const setCurrencyCode = (next: CurrencyCode) => {
    setCode(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore write failures
    }
  };

  const currency = useMemo(() => {
    const base = CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
    return { ...base, egpPerUnit: rates[base.code] };
  }, [code, rates]);

  const convert = (amountEGP: number) => amountEGP / currency.egpPerUnit;

  const format = (amountEGP: number) => {
    const value = convert(amountEGP);
    const rounded = Math.round(value);
    return { amount: rounded.toLocaleString("en-US"), symbol: currency.symbol };
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrencyCode, convert, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within a CurrencyProvider");
  return ctx;
}

/** Convenience hook: format one EGP amount into the active currency. */
export function usePrice(amountEGP: number) {
  const { format } = useCurrency();
  return format(amountEGP);
}

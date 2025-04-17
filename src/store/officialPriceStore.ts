import { create } from "zustand";
import { OfficialPrice } from "../types/officialPrice";

// 초기 더미 데이터
const initialPrices: OfficialPrice[] = [
  {
    region: "경기",
    date: "2025-02-12",
    king: 200,
    extraLarge: 190,
    large: 180,
    medium: 170,
    small: 160,
  },
  {
    region: "충청",
    date: "2025-02-12",
    king: 200,
    extraLarge: 190,
    large: 180,
    medium: 170,
    small: 160,
  },
  {
    region: "강원",
    date: "2025-02-12",
    king: 200,
    extraLarge: 190,
    large: 180,
    medium: 170,
    small: 160,
  },
];

interface OfficialPriceStore {
  prices: OfficialPrice[];
  setPrices: (prices: OfficialPrice[]) => void;
  addPrice: (price: OfficialPrice) => void;
  updatePrice: (price: OfficialPrice) => void;
  removePrice: (region: string, date: string) => void;
}

export const useOfficialPriceStore = create<OfficialPriceStore>((set) => ({
  prices: initialPrices,
  setPrices: (prices) => set({ prices }),
  addPrice: (price) => set((state) => ({ prices: [...state.prices, price] })),
  updatePrice: (price) =>
    set((state) => ({
      prices: state.prices.map((p) =>
        p.region === price.region && p.date === price.date ? price : p
      ),
    })),
  removePrice: (region, date) =>
    set((state) => ({
      prices: state.prices.filter(
        (p) => !(p.region === region && p.date === date)
      ),
    })),
}));

import { create } from "zustand";

export interface Stock {
  itemId: string;
  quantityEgg: number;
}

interface StockStore {
  stocks: Stock[];
  setStocks: (stocks: Stock[]) => void;
  addStock: (stock: Stock) => void;
  updateStock: (stock: Stock) => void;
  removeStock: (itemId: string, removeEgg?: number) => void;
  initStocks: (items: { id: string }[]) => void;
}

export const useStockStore = create<StockStore>((set) => ({
  stocks: [],
  setStocks: (stocks) => set({ stocks }),
  addStock: (stock) =>
    set((state) => {
      const existing = state.stocks.find((s) => s.itemId === stock.itemId);
      if (existing) {
        // 이미 있으면 수량만 더함
        return {
          stocks: state.stocks.map((s) =>
            s.itemId === stock.itemId
              ? { ...s, quantityEgg: s.quantityEgg + stock.quantityEgg }
              : s
          ),
        };
      }
      return { stocks: [...state.stocks, stock] };
    }),
  updateStock: (stock) =>
    set((state) => ({
      stocks: state.stocks.map((s) => (s.itemId === stock.itemId ? stock : s)),
    })),
  removeStock: (itemId, removeEgg) =>
    set((state) => ({
      stocks: state.stocks
        .map((s) =>
          s.itemId === itemId && removeEgg
            ? { ...s, quantityEgg: Math.max(s.quantityEgg - removeEgg, 0) }
            : s
        )
        .filter(
          (s) => s.itemId !== itemId || (removeEgg ? s.quantityEgg > 0 : false)
        ),
    })),
  initStocks: (items) =>
    set({ stocks: items.map((item) => ({ itemId: item.id, quantityEgg: 0 })) }),
}));

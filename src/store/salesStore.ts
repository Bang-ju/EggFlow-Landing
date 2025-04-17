import { create } from "zustand";
import { useItemStore } from "./itemStore";

export interface SaleItem {
  itemId: string;
  quantity: number;
  quantityEgg: number;
  price: number;
  amount: number;
  dc: number;
  palettes: number;
}

export interface Sale {
  id: string;
  date: string;
  customerId: string;
  manager: string;
  items: SaleItem[];
  totalAmount: number;
  memo?: string;
}

interface SalesStore {
  sales: Sale[];
  addSale: (sale: Omit<Sale, "items"> & { items?: SaleItem[] }) => void;
  updateSale: (sale: Sale) => void;
  removeSale: (id: string) => void;
  setSales: (sales: Sale[]) => void;
}

export const useSalesStore = create<SalesStore>((set) => ({
  sales: [],
  addSale: (sale) => {
    // itemStore에서 모든 item을 불러와서 items에 자동으로 추가
    const items =
      sale.items && sale.items.length > 0
        ? sale.items
        : useItemStore.getState().items.map((item) => ({
            itemId: item.id,
            quantityEgg: 0,
            price: item.price,
            amount: 0,
            dc: 0,
            palettes: 0,
            quantity: 0,
          }));
    set((state) => ({
      sales: [...state.sales, { ...sale, items }],
    }));
  },
  updateSale: (sale) =>
    set((state) => ({
      sales: state.sales.map((s) => (s.id === sale.id ? sale : s)),
    })),
  removeSale: (id) =>
    set((state) => ({
      sales: state.sales.filter((s) => s.id !== id),
    })),
  setSales: (sales) => set({ sales }),
}));

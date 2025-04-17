import { create } from "zustand";
import { useItemStore } from "./itemStore";
import type { Purchase, PurchaseItem } from "@/types/purchase";

interface PurchaseStore {
  purchases: Purchase[];
  addPurchase: (
    purchase: Omit<Purchase, "items"> & { items?: PurchaseItem[] }
  ) => void;
  updatePurchase: (purchase: Purchase) => void;
  removePurchase: (id: string) => void;
  setPurchases: (purchases: Purchase[]) => void;
}

export const usePurchaseStore = create<PurchaseStore>((set) => ({
  purchases: [],
  addPurchase: (purchase) => {
    const items: PurchaseItem[] =
      purchase.items && purchase.items.length > 0
        ? purchase.items
        : useItemStore.getState().items.map((item) => ({
            itemId: item.id,
            quantityBox: 0,
            quantityEgg: 0,
            quantityPlate: 0,
            price: item.price,
            amount: 0,
            dc: 0,
            palettes: 0,
            diff: 0,
          }));
    set((state) => ({
      purchases: [...state.purchases, { ...purchase, items }],
    }));
  },
  updatePurchase: (purchase) =>
    set((state) => ({
      purchases: state.purchases.map((p) =>
        p.id === purchase.id ? purchase : p
      ),
    })),
  removePurchase: (id) =>
    set((state) => ({
      purchases: state.purchases.filter((p) => p.id !== id),
    })),
  setPurchases: (purchases) => set({ purchases }),
}));

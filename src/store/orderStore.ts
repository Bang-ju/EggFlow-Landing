import { create } from "zustand";
import { useItemStore } from "./itemStore";
import type { Purchase, PurchaseItem } from "@/types/purchase";

interface OrderStore {
  orders: Purchase[];
  addOrder: (order: Purchase) => void;
  updateOrder: (order: Purchase) => void;
  removeOrder: (id: string) => void;
  setOrders: (orders: Purchase[]) => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  addOrder: (order) => {
    const items: PurchaseItem[] =
      order.items && order.items.length > 0
        ? order.items
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
      orders: [...state.orders, { ...order, items }],
    }));
  },
  updateOrder: (order) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === order.id ? order : o)),
    })),
  removeOrder: (id) =>
    set((state) => ({
      orders: state.orders.filter((o) => o.id !== id),
    })),
  setOrders: (orders) => set({ orders }),
}));

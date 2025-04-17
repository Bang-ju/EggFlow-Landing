import { create } from "zustand";
import { Item } from "../types/item";
import { usePriceStore } from "./priceStore";
import { useCustomerStore } from "./customerStore";
import { initialItems } from "./initialData";

interface ItemStore {
  items: Item[];
  setItems: (items: Item[]) => void;
  addItem: (item: Item) => void;
  updateItem: (item: Item) => void;
  removeItem: (id: string) => void;
}

export const useItemStore = create<ItemStore>((set, get) => ({
  items: initialItems,
  setItems: (items) => {
    set({ items });
    // 동기화
    const customers = useCustomerStore.getState().customers;
    usePriceStore.getState().syncWithItemsCustomers(items, customers);
  },
  addItem: (item) => {
    set((state) => ({ items: [...state.items, item] }));
    // 동기화
    const items = get().items.concat(item);
    const customers = useCustomerStore.getState().customers;
    usePriceStore.getState().syncWithItemsCustomers(items, customers);
  },
  updateItem: (item) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === item.id ? item : i)),
    })),
  removeItem: (id) => {
    set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
    // 동기화
    const items = get().items.filter((i) => i.id !== id);
    const customers = useCustomerStore.getState().customers;
    usePriceStore.getState().syncWithItemsCustomers(items, customers);
  },
}));

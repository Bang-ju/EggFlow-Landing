import { create } from "zustand";
import { Customer } from "../types/customer";
import { usePriceStore } from "./priceStore";
import { useItemStore } from "./itemStore";
import { initialCustomers } from "./initialData";

interface CustomerStore {
  customers: Customer[];
  setCustomers: (customers: Customer[]) => void;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customer: Customer) => void;
  removeCustomer: (id: number) => void;
}

export const useCustomerStore = create<CustomerStore>((set, get) => ({
  customers: initialCustomers,
  setCustomers: (customers) => {
    set({ customers });
    // 동기화
    const items = useItemStore.getState().items;
    usePriceStore.getState().syncWithItemsCustomers(items, customers);
  },
  addCustomer: (customer) => {
    set((state) => ({ customers: [...state.customers, customer] }));
    // 동기화
    const customers = get().customers.concat(customer);
    const items = useItemStore.getState().items;
    usePriceStore.getState().syncWithItemsCustomers(items, customers);
  },
  updateCustomer: (customer) =>
    set((state) => ({
      customers: state.customers.map((c) =>
        c.id === customer.id ? customer : c
      ),
    })),
  removeCustomer: (id) => {
    set((state) => ({ customers: state.customers.filter((c) => c.id !== id) }));
    // 동기화
    const customers = get().customers.filter((c) => c.id !== id);
    const items = useItemStore.getState().items;
    usePriceStore.getState().syncWithItemsCustomers(items, customers);
  },
}));

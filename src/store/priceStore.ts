import { create } from "zustand";
import { CustomerItemPrice } from "../types/price";
import { Item } from "../types/item";
import { Customer } from "../types/customer";
import { initialItems, initialCustomers } from "./initialData";

interface PriceStore {
  prices: CustomerItemPrice[];
  setPrices: (prices: CustomerItemPrice[]) => void;
  addPrice: (price: CustomerItemPrice) => void;
  updatePrice: (price: CustomerItemPrice) => void;
  removePrice: (customerId: string, itemId: string) => void;
  getPricesByCustomer: (customerId: string) => CustomerItemPrice[];
  syncWithItemsCustomers: (items: Item[], customers: Customer[]) => void;
}

function generateInitialPrices(
  items: Item[],
  customers: Customer[]
): CustomerItemPrice[] {
  const today = new Date().toISOString().slice(0, 10);
  const prices: CustomerItemPrice[] = [];
  for (const customer of customers) {
    for (const item of items) {
      prices.push({
        customerId: String(customer.id),
        itemId: String(item.id),
        basePrice: 0,
        dc: 0,
        finalPrice: 0,
        diff: 0,
        modified: today,
        created: today,
        priceInputType: "auto",
        manualPrice: undefined,
      });
    }
  }
  return prices;
}

const initialPrices: CustomerItemPrice[] = generateInitialPrices(
  initialItems,
  initialCustomers
);

export const usePriceStore = create<PriceStore>((set, get) => ({
  prices: initialPrices,
  setPrices: (prices) => set({ prices }),
  addPrice: (price) => set((state) => ({ prices: [...state.prices, price] })),
  updatePrice: (price) =>
    set((state) => ({
      prices: state.prices.map((p) =>
        String(p.customerId) === String(price.customerId) &&
        String(p.itemId) === String(price.itemId)
          ? price
          : p
      ),
    })),
  removePrice: (customerId, itemId) =>
    set((state) => ({
      prices: state.prices.filter(
        (p) =>
          !(
            String(p.customerId) === String(customerId) &&
            String(p.itemId) === String(itemId)
          )
      ),
    })),
  getPricesByCustomer: (customerId) =>
    get().prices.filter((p) => String(p.customerId) === String(customerId)),
  syncWithItemsCustomers: (items, customers) => {
    const prev = get().prices;
    const now: CustomerItemPrice[] = [];
    // 모든 조합 생성
    for (const customer of customers) {
      for (const item of items) {
        // 기존 데이터 유지
        const found = prev.find(
          (p) =>
            String(p.customerId) === String(customer.id) &&
            String(p.itemId) === String(item.id)
        );
        if (found) {
          now.push(found);
        } else {
          now.push({
            customerId: String(customer.id),
            itemId: String(item.id),
            basePrice: 0,
            dc: 0,
            finalPrice: 0,
            diff: 0,
            modified: new Date().toISOString().slice(0, 10),
            created: new Date().toISOString().slice(0, 10),
            priceInputType: "auto",
            manualPrice: undefined,
          });
        }
      }
    }
    set({ prices: now });
  },
}));

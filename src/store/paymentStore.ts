import { create } from "zustand";

export interface Payment {
  id: string;
  date: string;
  customerId: string;
  amount: number;
  method: string;
  memo?: string;
  saleId?: string;
}

interface PaymentStore {
  payments: Payment[];
  addPayment: (payment: Payment) => void;
  updatePayment: (payment: Payment) => void;
  removePayment: (id: string) => void;
  setPayments: (payments: Payment[]) => void;
}

export const usePaymentStore = create<PaymentStore>((set) => ({
  payments: [],
  addPayment: (payment) =>
    set((state) => ({ payments: [...state.payments, payment] })),
  updatePayment: (payment) =>
    set((state) => ({
      payments: state.payments.map((p) => (p.id === payment.id ? payment : p)),
    })),
  removePayment: (id) =>
    set((state) => ({ payments: state.payments.filter((p) => p.id !== id) })),
  setPayments: (payments) => set({ payments }),
}));

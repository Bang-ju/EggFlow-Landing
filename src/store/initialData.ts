import { Item } from "../types/item";
import { Customer } from "../types/customer";

export const initialItems: Item[] = [
  {
    id: "1",
    code: "A001",
    name: "일반 대란",
    spec: "대란",
    packaging: "일반포장",
    unit: 150,
    price: 0,
    priceDiff: 0,
    modifiedDate: "2024-06-01",
    createdDate: "2024-05-01",
    status: "판매중",
    notes: "",
    priceInputType: "auto",
    manualPrice: undefined,
  },
  {
    id: "2",
    code: "A002",
    name: "일반 중란",
    spec: "중란",
    packaging: "특수포장",
    unit: 150,
    price: 0,
    priceDiff: 0,
    modifiedDate: "2024-06-02",
    createdDate: "2024-05-02",
    status: "판매중",
    notes: "",
    priceInputType: "auto",
    manualPrice: undefined,
  },
];

export const initialCustomers: Customer[] = [
  {
    id: 1,
    name: "산들란",
    manager: "서장준",
    type: "매입",
    ceoName: "임유빈",
    businessNumber: "123-45-67890",
    phone: "010-1234-5678",
    address: "서울특별시 관악구",
    region: "경기",
    discount: 50,
    registrationDate: "2025-04-09",
    balance: 2500000,
    profit: 3000000,
    totalTransaction: 7000000,
  },
];

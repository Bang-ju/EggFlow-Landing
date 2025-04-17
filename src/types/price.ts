export interface CustomerItemPrice {
  customerId: string;
  itemId: string;
  basePrice: number; // 기본단가(공시가+포장비 등)
  dc: number; // 할인(숫자, 원 단위)
  finalPrice: number; // 최종단가(기본단가-DC)
  diff: number; // 단가-공시가 차이
  modified: string;
  created: string;
  priceInputType?: "auto" | "manual";
  manualPrice?: number;
}

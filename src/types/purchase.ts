export interface PurchaseItem {
  itemId: string;
  quantityBox: number; // 박스 수량
  quantityEgg: number; // 알 수
  quantityPlate: number; // 판 수(30알 기준)
  price: number; // 단가
  amount: number; // 금액
  dc: number; // DC
  palettes: number; // 파렛트 수
  diff?: number; // 단가-공시가 차이
}

export interface Purchase {
  id: string;
  date: string;
  customerId: string; // 거래처 id
  manager: string;
  items: PurchaseItem[];
  totalAmount: number;
  memo?: string;
}

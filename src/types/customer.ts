export interface Customer {
  id: number;
  name: string;
  manager: string;
  type: string; // 매입, 매출 등
  ceoName: string;
  businessNumber: string;
  phone: string;
  address: string;
  region: string; // 공시가 적용 지역
  discount: number; // DC
  registrationDate: string;
  balance: number; // 잔금
  profit: number; // 손익
  totalTransaction: number; // 총 거래액
}

export interface Item {
  id: string;
  code: string;
  name: string;
  spec: string;
  packaging: string;
  unit: number;
  price: number;
  priceDiff?: number;
  modifiedDate: string;
  createdDate: string;
  status?: "판매중" | "판매중지";
  notes?: string;
  priceInputType?: "auto" | "manual";
  manualPrice?: number;
}

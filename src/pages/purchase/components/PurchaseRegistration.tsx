import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  BlueButton,
  GreenButton,
  RedButton,
  GrayButton,
} from "@/components/ui/button";
import { OfficialPriceDialog } from "@/components/ui/OfficialPriceDialog";
import { DatePicker } from "@/components/ui/DatePicker";
import { usePurchaseStore } from "@/store/purchaseStore";
import { useCustomerStore } from "@/store/customerStore";
import { useItemStore } from "@/store/itemStore";
import { useOfficialPriceStore } from "@/store/officialPriceStore";
import type { Purchase, PurchaseItem } from "@/types/purchase";
import { Select } from "@/components/ui/select";

interface PurchaseRegistrationProps {
  purchase?: Purchase | null;
  onFormChange?: () => void;
  onNew?: () => void;
}

export const PurchaseRegistration: React.FC<PurchaseRegistrationProps> = ({
  purchase,
  onFormChange,
  onNew,
}) => {
  const [officialPriceOpen, setOfficialPriceOpen] = useState(false);

  // const addPayment = usePaymentStore((state) => state.addPayment);
  const items = useItemStore((state) => state.items);
  const customers = useCustomerStore((state) => state.customers);
  const officialPrices = useOfficialPriceStore((state) => state.prices);
  const addPurchase = usePurchaseStore((state) => state.addPurchase);
  const updatePurchase = usePurchaseStore((state) => state.updatePurchase);
  const removePurchase = usePurchaseStore((state) => state.removePurchase);
  const purchases = usePurchaseStore((state) => state.purchases);
  const [isNew, setIsNew] = useState(true);

  // form 상태는 실제 저장/입력 구현에서 사용 예정
  const [form, setForm] = useState<
    (Omit<Purchase, "items"> & { items: PurchaseItem[] }) | null
  >(null);

  // DC 일괄적용 입력 상태
  const [bulkDC, setBulkDC] = useState(0);

  useEffect(() => {
    if (purchase) {
      setForm(purchase);
    } else {
      setForm(null);
    }
  }, [purchase]);

  // 매출 등록 후 신규 버튼 클릭 시 상태 변경
  useEffect(() => {
    if (purchase) {
      setIsNew(false);
    }
  }, [purchase]);

  // 폼 입력 변경 핸들러
  const handleInputChange = (field: keyof Purchase, value: unknown) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
    if (onFormChange) onFormChange();
  };

  // 신규 버튼 클릭 시
  const handleNew = () => {
    if (onNew) onNew();
    setForm({
      id: String(purchases.length + 1),
      date: new Date().toISOString().split("T")[0],
      customerId: "",
      manager: "",
      items: items.map((item) => ({
        itemId: item.id,
        quantityBox: 0,
        quantityEgg: 0,
        quantityPlate: 0,
        price: 0,
        amount: 0,
        dc: 0,
        palettes: 0,
      })),
      totalAmount: 0,
      memo: "",
    });
    setIsNew(true);
    if (onFormChange) onFormChange();
  };

  // 저장 버튼 클릭 핸들러
  const handleSaveSale = () => {
    if (!form) return;
    // SaleItemWithInput[] → SaleItem[] 변환
    const items = form.items.map(
      ({
        itemId,
        quantityBox,
        quantityEgg,
        quantityPlate,
        price,
        amount,
        dc,
        palettes,
      }) => ({
        itemId,
        quantityBox,
        quantityEgg,
        quantityPlate,
        price,
        amount,
        dc,
        palettes,
      })
    );
    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

    const newPurchase = {
      ...form,
      items,
      totalAmount,
    };

    if (isNew) {
      addPurchase(newPurchase);
      setIsNew(false);
    } else {
      updatePurchase(newPurchase);
    }

    // 저장알림
    alert("저장되었습니다.");

    // 저장 후 폼 초기화(선택)
    // setForm(null);
  };

  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?") && form?.id) {
      removePurchase(form?.id);
      alert("삭제되었습니다.");
      setForm(null);
      setBulkDC(0);
    }
  };

  const selectedCustomer = customers.find(
    (c) => String(c.id) === form?.customerId
  );
  useEffect(() => {
    if (selectedCustomer) setBulkDC(selectedCustomer.discount || 0);
  }, [selectedCustomer]);

  return (
    <div className="flex flex-col gap-2 bg-white rounded-[4px] w-full">
      {/* 헤더 */}
      <div className="flex justify-between items-center p-2 pt-2 px-4">
        <div className="flex items-center">
          <h2 className="text-xl font-bold">매입 등록</h2>
        </div>
        <div className="flex gap-4">
          <GrayButton>액셀 다운로드</GrayButton>
          <GrayButton>인쇄</GrayButton>
          <GrayButton onClick={() => setOfficialPriceOpen(true)}>
            공시가 확인
          </GrayButton>
        </div>
      </div>
      {/* 폼 상단 */}
      <div className="flex flex-col gap-2 w-full  border-t border-b border-[#E5E7EB]">
        <div className="flex flex-wrap p-2 px-4">
          <div className="flex items-center gap-4 py-1.5">
            <span className="text-sm font-normal">거래일자</span>
            <DatePicker
              value={form?.date || new Date().toISOString().split("T")[0]}
              onChange={(val) => handleInputChange("date", val)}
            />
          </div>
          <div className="flex items-center gap-4 py-1.5 ml-4">
            <span className="text-sm font-normal">거래처</span>
            <Select
              options={customers.map((c) => ({
                value: String(c.id),
                label: c.name,
              }))}
              onChange={(val) => handleInputChange("customerId", val)}
              value={form?.customerId}
              placeholder="거래처"
              className="min-w-32"
            />
          </div>

          <div className="flex items-center gap-4 py-1.5 ml-4">
            <span className="text-sm font-normal">거래처DC</span>
            <div className="flex">
              <div className="flex justify-end items-center border border-[#E5E7EB] rounded-[4px] p-2 h-8 w-[80px]">
                <Input
                  type="number"
                  value={bulkDC}
                  onChange={(e) => setBulkDC(parseInt(e.target.value) || 0)}
                  className="text-sm text-[#262626] outline-none w-full text-right"
                />
              </div>
              <GreenButton
                onClick={() => {
                  setForm(
                    (prev) =>
                      prev && {
                        ...prev,
                        items: prev.items.map((item) => ({
                          ...item,
                          dc: bulkDC,
                        })),
                      }
                  );
                  if (onFormChange) onFormChange();
                }}
              >
                일괄 적용
              </GreenButton>
            </div>
          </div>
          {/* <div className="flex items-center gap-4 py-1.5 ml-4">
          <span className="text-sm font-normal">담당자</span>
          <Dropdown
            placeholder="담당자"
            options={[...new Set(customers.map((c) => c.manager))]}
            onChange={(val) => handleInputChange("manager", val)}
            value={form?.manager}
          />
        </div> */}
          <div className="ml-4 flex items-center gap-2">
            <span className="font-medium">공시가 적용지역</span>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={selectedCustomer?.region}
                placeholder="지역"
                className="w-16 text-center"
                readOnly
              />
            </div>
          </div>
        </div>
        {/*  단가 계산 공식 설명 */}
        <div className="flex flex-row items-center gap-2 pb-2 px-4 italic text-sm text-[#808080]">
          <span>* 단가 계산 공식: (공시가 - DC) × 단위</span>
        </div>
      </div>
      {/* 품목 테이블 */}
      <div className="px-4">
        <div className="border border-[#E5E7EB] overflow-x-auto">
          {/* 테이블 헤더 */}
          <div className="flex bg-[#F8FAFC] h-[38px]">
            <div className="flex justify-center items-center w-[110px] border-r border-[#E5E7EB] font-bold text-sm">
              품목코드
            </div>
            <div className="flex justify-center items-center w-[116px] border-r border-[#E5E7EB] font-bold text-sm">
              품목명
            </div>
            <div className="flex justify-center items-center w-[80px] border-r border-[#E5E7EB] font-bold text-sm">
              규격
            </div>
            <div className="flex justify-center items-center w-[80px] border-r border-[#E5E7EB] font-bold text-sm">
              포장
            </div>
            <div className="flex justify-center items-center w-[80px] border-r border-[#E5E7EB] font-bold text-sm">
              단위
            </div>
            <div className="flex justify-center items-center w-[80px] border-r border-[#E5E7EB] font-bold text-sm">
              DC
            </div>
            <div className="flex justify-center items-center w-[80px] border-r border-[#E5E7EB] font-bold text-sm">
              단가
            </div>
            <div className="flex justify-center items-center w-[128px] border-r border-[#E5E7EB] font-bold text-sm">
              단가-공시가 차이
            </div>
            <div className="flex justify-center items-center w-[90px] border-r border-[#E5E7EB] font-bold text-sm">
              수량(박스)
            </div>
            <div className="flex justify-center items-center w-[90px] border-r border-[#E5E7EB] font-bold text-sm">
              수량(알수)
            </div>
            <div className="flex justify-center items-center w-[90px] border-r border-[#E5E7EB] font-bold text-sm">
              수량(판수)
            </div>
            <div className="flex justify-center items-center w-[170px] border-r border-[#E5E7EB] font-bold text-sm">
              금액
            </div>
          </div>
          {/* 테이블 행 */}
          {form?.items.map((item, idx) => {
            const itemInfo = items.find((i) => i.id === item.itemId);
            const region = selectedCustomer?.region || "경기";
            // const dateStr = form?.date || "2025-02-12";
            const spec = itemInfo?.spec || "";
            const officialPriceObj = officialPrices.find(
              (p) => p.region === region
            );
            let officialPrice = 0;
            if (officialPriceObj) {
              if (spec.includes("왕")) officialPrice = officialPriceObj.king;
              else if (spec.includes("특"))
                officialPrice = officialPriceObj.extraLarge;
              else if (spec.includes("대"))
                officialPrice = officialPriceObj.large;
              else if (spec.includes("중"))
                officialPrice = officialPriceObj.medium;
              else if (spec.includes("소"))
                officialPrice = officialPriceObj.small;
            }
            const dc = item.dc;
            const units = Number(itemInfo?.unit) || 0;
            // 공식 요구대로 포장비는 제외하고 (공시가 - dc) * unit
            const unitPrice = (officialPrice - dc) * units;
            // 단가-공시가 차이
            const unitPriceDiff = unitPrice - officialPrice * units;
            const amount = item.quantityBox * unitPrice;
            if (amount !== item.amount) {
              setForm(
                (prev) =>
                  prev && {
                    ...prev,
                    items: prev.items.map((it, i) =>
                      i === idx ? { ...it, amount } : it
                    ),
                  }
              );
            }

            return (
              <div
                key={item.itemId}
                className="flex bg-[#F4F4F4] h-[38px] border-b border-border"
              >
                <div className="flex justify-end items-center w-[110px] border-r border-[#E5E7EB] text-sm text-[#808080] p-2">
                  {itemInfo?.code}
                </div>
                <div className="flex items-center w-[116px] border-r border-[#E5E7EB] text-sm text-[#808080] p-2">
                  {itemInfo?.name}
                </div>
                <div className="flex items-center w-[80px] border-r border-[#E5E7EB] text-sm text-[#808080] p-2">
                  {itemInfo?.spec}
                </div>
                <div className="flex items-center w-[80px] border-r border-[#E5E7EB] text-sm text-[#808080] p-2">
                  {itemInfo?.packaging}
                </div>
                <div className="flex justify-end items-center w-[80px] border-r border-[#E5E7EB] text-sm text-[#808080] p-2">
                  {itemInfo?.unit}
                </div>
                <div className="flex justify-end items-center w-[80px] border-r border-[#E5E7EB] text-sm bg-white">
                  <Input
                    className="w-full"
                    type="number"
                    value={item.dc}
                    onChange={(e) =>
                      setForm(
                        (prev) =>
                          prev && {
                            ...prev,
                            items: prev.items.map((it, i) =>
                              i === idx
                                ? { ...it, dc: parseInt(e.target.value) || 0 }
                                : it
                            ),
                          }
                      )
                    }
                  />
                </div>
                <div className="flex justify-end items-center w-[80px] border-r border-[#E5E7EB] text-sm p-2">
                  {unitPrice.toLocaleString()}
                </div>
                <div className="flex justify-end items-center w-[128px] border-r border-[#E5E7EB] text-sm text-[#808080] p-2">
                  {unitPriceDiff.toLocaleString()}
                </div>
                <div className="flex justify-end items-center w-[90px] border-r border-[#E5E7EB] text-sm bg-white">
                  <Input
                    className="w-full"
                    type="number"
                    value={item.quantityBox}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      const newEgg = val * units;
                      const newEggPalete = newEgg / 30;
                      const newAmount = newEgg * officialPrice;
                      setForm(
                        (prev) =>
                          prev && {
                            ...prev,
                            items: prev.items.map((it, i) =>
                              i === idx
                                ? {
                                    ...it,
                                    quantityBox: val,
                                    quantityEgg: newEgg,
                                    quantityPlate: newEggPalete,
                                    amount: newAmount,
                                  }
                                : it
                            ),
                          }
                      );
                    }}
                  />
                </div>
                <div className="flex justify-end items-center w-[90px] border-r border-[#E5E7EB] text-sm bg-white">
                  <Input
                    className="w-full"
                    type="number"
                    value={item.quantityEgg}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      const newEggBox = val / units;
                      const newEggPalete = val / (units * 30);
                      const newAmount = val * officialPrice;
                      setForm(
                        (prev) =>
                          prev && {
                            ...prev,
                            items: prev.items.map((it, i) =>
                              i === idx
                                ? {
                                    ...it,
                                    quantityEgg: val,
                                    quantityBox: newEggBox,
                                    quantityPlate: newEggPalete,
                                    amount: newAmount,
                                  }
                                : it
                            ),
                          }
                      );
                    }}
                  />
                </div>
                <div className="flex justify-end items-center w-[90px] border-r border-[#E5E7EB] text-sm bg-white">
                  <Input
                    className="w-full"
                    type="number"
                    value={item.quantityPlate}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      const newEgg = val * 30;
                      const newEggBox = newEgg / units;
                      const newAmount = newEgg * officialPrice;
                      setForm(
                        (prev) =>
                          prev && {
                            ...prev,
                            items: prev.items.map((it, i) =>
                              i === idx
                                ? {
                                    ...it,
                                    quantityPlate: val,
                                    quantityEgg: newEgg,
                                    quantityBox: newEggBox,
                                    amount: newAmount,
                                  }
                                : it
                            ),
                          }
                      );
                    }}
                  />
                </div>
                <div className="flex justify-end items-center w-[170px] border-r border-[#E5E7EB] text-sm p-2">
                  {item.amount.toLocaleString()}
                </div>
              </div>
            );
          })}
          {/* 합계 행 */}
          <div className="flex bg-[#F8FAFC] h-[38px]">
            <div className="flex items-center w-[754px] border-r border-[#E5E7EB] text-sm font-bold p-2">
              합계
            </div>
            <div className="flex justify-end items-center w-[90px] border-r border-[#E5E7EB] text-sm font-bold p-2">
              {form?.items.reduce((sum, item) => sum + item.quantityBox, 0)}
            </div>
            <div className="flex justify-end items-center w-[90px] border-r border-[#E5E7EB] text-sm font-bold p-2">
              {form?.items.reduce((sum, item) => sum + item.quantityEgg, 0)}
            </div>
            <div className="flex justify-end items-center w-[90px] border-r border-[#E5E7EB] text-sm font-bold p-2">
              {(
                (form?.items.reduce((sum, item) => sum + item.quantityEgg, 0) ||
                  0) / 30
              ).toLocaleString()}
            </div>
            <div className="flex justify-end items-center w-[170px] border-r border-[#E5E7EB] text-sm font-bold p-2">
              ₩{form?.totalAmount.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
      {/* 버튼 영역 */}
      <div className="flex justify-start gap-4 border-t border-[#E5E7EB] py-4 px-4">
        <div className="flex gap-4">
          <GreenButton onClick={handleNew}>신규</GreenButton>
          <BlueButton onClick={handleSaveSale}>저장</BlueButton>
          <RedButton onClick={handleDelete}>삭제</RedButton>
        </div>
      </div>
      <OfficialPriceDialog
        isOpen={officialPriceOpen}
        onClose={() => setOfficialPriceOpen(false)}
      />
    </div>
  );
};

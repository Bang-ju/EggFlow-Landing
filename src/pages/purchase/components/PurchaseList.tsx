import React, { useState } from "react";
import { usePurchaseStore } from "@/store/purchaseStore";
import { useCustomerStore } from "@/store/customerStore";
import { BlueButton, GrayButton } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/DatePicker";
import type { Purchase } from "@/types/purchase";

// 간단 드롭다운
const Dropdown = ({
  placeholder,
  options,
  onChange,
  value,
}: {
  placeholder: string;
  options: string[];
  onChange: (value: string) => void;
  value?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <div
        className="flex justify-between items-center border border-[#E5E7EB] rounded-[4px] p-2 h-8 w-[100px] cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm text-[#808080]">{value || placeholder}</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M7 10L12 15L17 10H7Z" fill="#1D1B20" />
        </svg>
      </div>
      {open && (
        <div className="absolute top-full left-0 w-full bg-white border border-[#E5E7EB] rounded-[4px] mt-1 z-10">
          {options.map((option) => (
            <div
              key={option}
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => {
                setOpen(false);
                onChange(option);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface PurchaseListProps {
  onSelectPurchase?: (purchase: Purchase) => void;
}

export const PurchaseList: React.FC<PurchaseListProps> = ({
  onSelectPurchase,
}) => {
  const purchases = usePurchaseStore((state) => state.purchases);
  const customers = useCustomerStore((state) => state.customers);

  // 검색/필터 상태
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [vendor, setVendor] = useState<string>("전체");
  // const [manager, setManager] = useState<string>("전체");

  // 필터링(기본: 전체)
  const filtered = purchases.filter((p) => {
    let ok = true;
    if (vendor !== "전체") {
      const c = customers.find((c) => c.id.toString() === p.customerId);
      if (!c || c.name !== vendor) ok = false;
    }
    // if (manager !== "전체" && p.manager !== manager) ok = false;
    // 날짜 필터(간단)
    if (startDate && p.date < startDate) ok = false;
    if (endDate && p.date > endDate) ok = false;
    return ok;
  });

  // 합계
  const totalEggs = filtered.reduce(
    (sum, p) => sum + p.items.reduce((s, i) => s + (i.quantityEgg || 0), 0),
    0
  );
  const totalBoxes = filtered.reduce(
    (sum, p) => sum + p.items.reduce((s, i) => s + (i.quantityBox || 0), 0),
    0
  );
  const totalAmount = filtered.reduce(
    (sum, p) => sum + (p.totalAmount || 0),
    0
  );

  return (
    <div className="flex flex-col gap-2 bg-white rounded-[4px] w-full">
      {/* 헤더 */}
      <div className="flex justify-between items-center p-2 pt-2 px-4">
        <div className="flex items-center">
          <h2 className="text-xl font-bold">매입 목록</h2>
        </div>
        <div className="flex gap-2">
          <GrayButton>액셀 다운로드</GrayButton>
          <GrayButton>인쇄</GrayButton>
        </div>
      </div>
      {/* 검색/필터 */}
      <div className="flex justify-between border-b border-t border-[#E5E7EB] p-2 px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 py-1.5">
            <span className="text-sm font-normal">거래일자</span>
            <div className="flex items-center gap-1">
              <DatePicker value={startDate} onChange={setStartDate} />
              <span className="text-sm">~</span>
              <DatePicker value={endDate} onChange={setEndDate} />
            </div>
          </div>
          <div className="flex items-center gap-4 py-1.5">
            <span className="text-sm font-normal">거래처</span>
            <Dropdown
              placeholder="전체"
              options={["전체", ...customers.map((c) => c.name)]}
              onChange={setVendor}
              value={vendor}
            />
          </div>
          {/* <div className="flex items-center gap-4 py-1.5">
            <span className="text-sm font-normal">담당자</span>
            <Dropdown
              placeholder="전체"
              options={[
                "전체",
                ...Array.from(new Set(customers.map((c) => c.manager))),
              ]}
              onChange={setManager}
              value={manager}
            />
          </div> */}
        </div>
        <div className="flex justify-end gap-2">
          <BlueButton className="px-4 py-2.5 rounded-[4px] text-sm">
            조회
          </BlueButton>
        </div>
      </div>
      {/* 매입 목록 테이블 */}
      <div className="px-4 py-4">
        <div className="border border-[#E5E7EB]">
          {/* 테이블 헤더 */}
          <div className="flex bg-[#F8FAFC] h-[38px]">
            <div className="flex justify-center items-center w-[110px] border-r border-[#E5E7EB] font-bold text-sm">
              연번
            </div>
            <div className="flex justify-center items-center w-[169px] border-r border-[#E5E7EB] font-bold text-sm">
              거래일자
            </div>
            <div className="flex justify-center items-center w-[260px] border-r border-[#E5E7EB] font-bold text-sm">
              거래처
            </div>
            {/* <div className="flex justify-center items-center w-[110px] border-r border-[#E5E7EB] font-bold text-sm">
              담당자
            </div> */}
            <div className="flex justify-center items-center w-[110px] border-r border-[#E5E7EB] font-bold text-sm">
              총 알 수
            </div>
            <div className="flex justify-center items-center w-[110px] border-r border-[#E5E7EB] font-bold text-sm">
              총 판 수
            </div>
            <div className="flex justify-center items-center w-[235px] border-r border-[#E5E7EB] font-bold text-sm">
              금액
            </div>
          </div>
          {/* 테이블 행 */}
          {filtered.map((p, idx) => {
            const customer = customers.find(
              (c) => c.id.toString() === p.customerId
            );
            return (
              <div
                key={p.id}
                className="flex bg-[#F4F4F4] h-[38px] cursor-pointer"
                onClick={() => onSelectPurchase && onSelectPurchase(p)}
              >
                <div className="flex justify-center items-center w-[110px] border-r border-[#E5E7EB] text-sm p-2">
                  {idx + 1}
                </div>
                <div className="flex justify-center items-center w-[169px] border-r border-[#E5E7EB] text-sm p-2">
                  {p.date}
                </div>
                <div className="flex justify-center items-center w-[260px] border-r border-[#E5E7EB] text-sm p-2">
                  {customer?.name || p.customerId}
                </div>
                {/* <div className="flex items-center w-[110px] border-r border-[#E5E7EB] text-sm p-2">
                  {p.manager}
                </div> */}
                <div className="flex justify-end items-center w-[110px] border-r border-[#E5E7EB] text-sm p-2">
                  {p.items
                    .reduce((sum, i) => sum + (i.quantityEgg || 0), 0)
                    .toLocaleString()}
                </div>
                <div className="flex justify-end items-center w-[110px] border-r border-[#E5E7EB] text-sm p-2">
                  {p.items.reduce((sum, i) => sum + (i.quantityPlate || 0), 0)}
                </div>
                <div className="flex justify-end items-center w-[235px] border-r border-[#E5E7EB] text-sm p-2">
                  ₩{p.totalAmount.toLocaleString()}
                </div>
              </div>
            );
          })}
          {/* 합계 행 */}
          <div className="flex bg-[#F8FAFC] h-[38px]">
            <div className="flex items-center w-[539px] border-r border-[#E5E7EB] text-sm font-bold p-2">
              합계
            </div>
            <div className="flex justify-end items-center w-[110px] border-r border-[#E5E7EB] text-sm font-bold p-2">
              {totalEggs.toLocaleString()}
            </div>
            <div className="flex justify-end items-center w-[110px] border-r border-[#E5E7EB] text-sm font-bold p-2">
              {totalBoxes}
            </div>
            <div className="flex justify-end items-center w-[235px] border-r border-[#E5E7EB] text-sm font-bold p-2">
              ₩{totalAmount.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

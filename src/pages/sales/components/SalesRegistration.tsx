import { useState, useEffect } from "react";
import { Select } from "@/components/ui/select";
import {
  BlueButton,
  RedButton,
  GreenButton,
  GrayButton,
} from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OfficialPriceDialog } from "@/components/ui/OfficialPriceDialog";
import { useSalesStore } from "@/store/salesStore";
import { useItemStore } from "@/store/itemStore";
import { calcUnitPrice } from "@/utils/calc";
import { useCustomerStore } from "@/store/customerStore";
import { useOfficialPriceStore } from "@/store/officialPriceStore";
import { usePackageStore } from "@/store/packageStore";
import PaymentModal from "@/components/PaymentModal";

// Sale 타입 import
import type { Sale } from "@/store/salesStore";
import { DatePicker } from "@/components/ui/DatePicker";

// SaleItem 확장 타입 (로컬 상태용)
type SaleItemWithInput = {
  itemId: string;
  quantityEgg: number;
  price: number;
  amount: number;
  quantity: number; // 입력: 수량
  palettes: number; // 입력: 파렛트
  dc: number; // 입력: DC
};

interface SalesRegistrationProps {
  sale: Sale | null;
  onFormChange?: () => void;
  onNew?: () => void;
}

// 매출 등록 컴포넌트
export const SalesRegistration = ({
  sale,
  onFormChange,
  onNew,
}: SalesRegistrationProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [officialPriceOpen, setOfficialPriceOpen] = useState(false);

  const items = useItemStore((state) => state.items);
  const customers = useCustomerStore((state) => state.customers);
  const updateCustomer = useCustomerStore((state) => state.updateCustomer);
  const officialPrices = useOfficialPriceStore((state) => state.prices);
  const packages = usePackageStore((state) => state.packages);
  const addSale = useSalesStore((state) => state.addSale);
  const updateSale = useSalesStore((state) => state.updateSale);
  const removeSale = useSalesStore((state) => state.removeSale);
  const sales = useSalesStore((state) => state.sales);
  const [isNew, setIsNew] = useState(true);

  // form 상태는 실제 저장/입력 구현에서 사용 예정
  const [form, setForm] = useState<
    (Omit<Sale, "items"> & { items: SaleItemWithInput[] }) | null
  >(null);
  // DC 일괄적용 입력 상태
  const [bulkDC, setBulkDC] = useState(0);

  useEffect(() => {
    if (sale) {
      setForm(sale);
    } else {
      setForm(null);
    }
  }, [sale]);

  // 매출 등록 후 신규 버튼 클릭 시 상태 변경
  useEffect(() => {
    if (sale) {
      setIsNew(false);
    }
  }, [sale]);

  // 폼 입력 변경 핸들러
  const handleInputChange = (field: keyof Sale, value: unknown) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
    if (onFormChange) onFormChange();
  };

  // 신규 버튼 클릭 시
  const handleNew = () => {
    if (onNew) onNew();
    setForm({
      id: String(sales.length + 1),
      date: new Date().toISOString().split("T")[0],
      customerId: "",
      manager: "",
      items: items.map((item) => ({
        itemId: item.id,
        quantityEgg: 0,
        price: item.price,
        amount: 0,
        quantity: 0,
        palettes: 0,
        dc: 0,
      })),
      totalAmount: 0,
      memo: "",
    });
    setIsNew(true);
    if (onFormChange) onFormChange();
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  // 저장 버튼 클릭 핸들러
  const handleSaveSale = () => {
    if (!form) return;
    if (!selectedCustomer) {
      alert("거래처를 선택해주세요.");
      return;
    }

    // SaleItemWithInput[] → SaleItem[] 변환
    const items = form.items.map(
      ({ itemId, quantityEgg, price, amount, dc, quantity, palettes }) => ({
        itemId,
        quantityEgg,
        price,
        amount,
        dc,
        quantity,
        palettes,
      })
    );
    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

    const newSale = {
      ...form,
      items,
      totalAmount,
    };

    if (isNew) {
      addSale(newSale);
      setIsNew(false);
    } else {
      updateSale(newSale);
    }

    updateCustomer({
      ...selectedCustomer,
      totalTransaction: selectedCustomer.totalTransaction + totalAmount,
    });

    // 저장알림
    alert("저장되었습니다.");

    // 저장 후 폼 초기화(선택)
    // setForm(null);
  };

  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?") && form?.id) {
      removeSale(form?.id);
      alert("삭제되었습니다.");
      setForm(null);
      setBulkDC(0);
    }
  };

  const selectedCustomer = customers.find(
    (c) => String(c.id) === String(form?.customerId)
  );
  useEffect(() => {
    if (selectedCustomer) setBulkDC(selectedCustomer.discount || 0);
  }, [selectedCustomer]);

  // 금액 동기화 useEffect
  useEffect(() => {
    if (!form) return;
    let changed = false;
    const newItems = form.items.map((item) => {
      const itemInfo = items.find((i) => i.id === item.itemId);
      const region = selectedCustomer?.region || "경기";
      const date = "2025-02-12"; // TODO: 실제 선택값 연동
      const spec = itemInfo?.spec || "";
      const officialPriceObj = officialPrices.find(
        (p) => p.region === region && p.date === date
      );
      let officialPrice = 0;
      if (officialPriceObj) {
        if (spec.includes("왕")) officialPrice = officialPriceObj.king;
        else if (spec.includes("특"))
          officialPrice = officialPriceObj.extraLarge;
        else if (spec.includes("대")) officialPrice = officialPriceObj.large;
        else if (spec.includes("중")) officialPrice = officialPriceObj.medium;
        else if (spec.includes("소")) officialPrice = officialPriceObj.small;
      }
      const packageCost = packages.find(
        (pkg) => pkg.name === itemInfo?.packaging
      )?.cost
        ? Number(packages.find((pkg) => pkg.name === itemInfo?.packaging)?.cost)
        : 0;
      const dc = item.dc;

      const units = Number(itemInfo?.unit) || 0;
      const unitPrice = calcUnitPrice({
        officialPrice,
        packageCost,
        dc,
        units,
      });
      const amount = item.quantity * unitPrice;
      if (amount !== item.amount) {
        changed = true;
        return { ...item, amount };
      }
      return item;
    });
    if (changed) {
      setForm((prev) => prev && { ...prev, items: newItems });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form?.items, items, selectedCustomer, officialPrices, packages]);

  return (
    <div className="flex flex-col gap-2 bg-white rounded-[4px] w-full">
      {/* 헤더 */}
      <div
        className="flex justify-between items-center p-2 pt-2 px-4 cursor-pointer"
        onClick={toggleOpen}
      >
        <div className="flex items-center">
          <h2 className="text-xl font-bold">매출 등록</h2>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transform ${
              isOpen ? "rotate-0" : "rotate-180"
            } transition-transform`}
          >
            <path d="M7 10L12 15L17 10H7Z" fill="#1D1B20" />
          </svg>
        </div>
        <div className="flex gap-4">
          <GrayButton onClick={(e) => e.stopPropagation()}>
            액셀 다운로드
          </GrayButton>
          <GrayButton onClick={(e) => e.stopPropagation()}>인쇄</GrayButton>
          <GrayButton
            onClick={(e) => {
              e.stopPropagation();
              setOfficialPriceOpen(true);
            }}
          >
            공시가 확인
          </GrayButton>
        </div>
      </div>

      {/* 콘텐츠 영역 - 접히는 부분 */}
      {isOpen && (
        <div>
          <div className="flex flex-col border-t border-b">
            {/* 거래 정보 입력 */}
            <div className="p-4 bg-white  flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">전표번호</span>
                <div className="min-w-24 text-gray-500">
                  <Input
                    type="text"
                    className="w-[100px] text-right"
                    value={form?.id || ""}
                    readOnly
                    onChange={(e) => handleInputChange("id", e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">거래일자</span>
                <div className="px-2 py-1 flex items-center">
                  <DatePicker
                    className="min-w-32"
                    value={form?.date || ""}
                    onChange={(value) => {
                      setForm((prev) =>
                        prev ? { ...prev, date: value } : prev
                      );
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium">거래처</span>
                <Select
                  options={customers.map((c) => ({
                    value: String(c.id),
                    label: c.name,
                  }))}
                  onChange={(value) => {
                    handleInputChange("customerId", value);
                    const customer = customers.find(
                      (c) => String(c.id) === value
                    );
                    if (customer) setBulkDC(customer.discount || 0);
                  }}
                  value={form?.customerId}
                  placeholder="거래처"
                  className="min-w-32"
                />
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium">거래처DC</span>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    className="w-20 sm:text-sm text-right"
                    value={bulkDC}
                    onChange={(e) => setBulkDC(Number(e.target.value))}
                  />
                  <GreenButton
                    className="px-3 py-2 text-sm"
                    onClick={() => {
                      setForm(
                        (prev) =>
                          prev && {
                            ...prev,
                            items: prev.items.map((it) => ({
                              ...it,
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
              {/* 공시가 적용지역 보여주기 */}
              <div className="flex items-center gap-2">
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
              {/* <div className="flex items-center gap-4">
              <span className="font-medium">담당자</span>
              <Select
                options={[
                  { value: "manager1", label: "서장준" },
                  { value: "manager2", label: "김철수" },
                ]}
                onChange={(value) => handleInputChange("manager", value)}
                placeholder="담당자"
                className="min-w-32"
              />
            </div> */}
              {/*  단가 계산 공식 설명 */}
            </div>
            <div className="flex flex-row items-center gap-2 pb-2 px-4 italic text-sm text-[#808080]">
              <span>* 단가 계산 공식: (공시가 - DC + 포장비) × 단위</span>
            </div>
          </div>

          {/* 품목 테이블 */}
          <div className="bg-white p-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                {/* 테이블 헤더 */}
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-2 min-w-20 text-center text-sm font-bold">
                      연번
                    </th>
                    <th className="border p-2 min-w-20 text-center text-sm font-bold">
                      품목코드
                    </th>
                    <th className="border p-2 min-w-20 text-center text-sm font-bold">
                      품목명
                    </th>
                    <th className="border p-2 min-w-20 text-center text-sm font-bold">
                      규격
                    </th>
                    <th className="border p-2 min-w-20 text-center text-sm font-bold">
                      포장
                    </th>
                    <th className="border p-2 min-w-20 text-center text-sm font-bold">
                      단위
                    </th>
                    <th className="border p-2 min-w-20 text-center text-sm font-bold">
                      DC
                    </th>
                    <th className="border p-2 min-w-20 text-center text-sm font-bold">
                      단가
                    </th>
                    <th className="border p-2 min-w-32 text-center text-sm font-bold">
                      단가-공시가 차이
                    </th>
                    <th className="border p-2 min-w-20 text-center text-sm font-bold">
                      파렛트
                    </th>
                    <th className="border p-2 min-w-20 text-center text-sm font-bold">
                      수량
                    </th>
                    <th className="border p-2 min-w-20 text-center text-sm font-bold">
                      수량(알수)
                    </th>
                    <th className="border p-2 min-w-20 text-center text-sm font-bold">
                      수량(판수)
                    </th>
                    <th className="border p-2 min-w-40 text-center text-sm font-bold">
                      금액
                    </th>
                  </tr>
                </thead>

                {/* 테이블 바디 */}
                <tbody>
                  {(form?.items || []).map((item) => {
                    const itemInfo = items.find((i) => i.id === item.itemId);
                    // 공시가: 거래처의 지역(region) 사용
                    const region = selectedCustomer?.region || "경기";
                    const date = "2025-02-12"; // TODO: 실제 선택값 연동
                    const spec = itemInfo?.spec || "";
                    const officialPriceObj = officialPrices.find(
                      (p) => p.region === region && p.date === date
                    );
                    let officialPrice = 0;
                    if (officialPriceObj) {
                      if (spec.includes("왕"))
                        officialPrice = officialPriceObj.king;
                      else if (spec.includes("특"))
                        officialPrice = officialPriceObj.extraLarge;
                      else if (spec.includes("대"))
                        officialPrice = officialPriceObj.large;
                      else if (spec.includes("중"))
                        officialPrice = officialPriceObj.medium;
                      else if (spec.includes("소"))
                        officialPrice = officialPriceObj.small;
                    }
                    // 포장비: 포장명 기준
                    const packageCost = packages.find(
                      (pkg) => pkg.name === itemInfo?.packaging
                    )?.cost
                      ? Number(
                          packages.find(
                            (pkg) => pkg.name === itemInfo?.packaging
                          )?.cost
                        )
                      : 0;
                    const dc = item.dc;
                    const units = Number(itemInfo?.unit) || 0;
                    const unitPrice = calcUnitPrice({
                      officialPrice,
                      packageCost,
                      dc,
                      units,
                    });
                    // amount 계산은 useEffect에서 동기화됨
                    const unitPriceDiff = unitPrice - officialPrice * units;
                    return (
                      <tr key={item.itemId} className="bg-gray-100 text-sm">
                        <td className="border p-2 text-center">
                          {/* idx + 1 제거 */}
                        </td>
                        <td className="border p-2 text-right">
                          {itemInfo?.code}
                        </td>
                        <td className="border p-2">{itemInfo?.name}</td>
                        <td className="border p-2">{itemInfo?.spec}</td>
                        <td className="border p-2">{itemInfo?.packaging}</td>
                        <td className="border p-2 text-right">
                          {itemInfo?.unit}
                        </td>
                        <td className="border bg-white text-right">
                          <Input
                            type="number"
                            className="w-full text-right border-none"
                            value={dc}
                            onChange={(e) => {
                              setForm(
                                (prev) =>
                                  prev && {
                                    ...prev,
                                    items: prev.items.map((it) =>
                                      it.itemId === item.itemId
                                        ? {
                                            ...it,
                                            dc: Number(e.target.value),
                                          }
                                        : it
                                    ),
                                  }
                              );
                              if (onFormChange) onFormChange();
                            }}
                          />
                        </td>
                        <td className="border p-2 text-right">
                          {unitPrice.toLocaleString()}
                        </td>
                        <td className="border p-2 text-right">
                          {unitPriceDiff.toLocaleString()}
                        </td>
                        <td className="border bg-white text-right">
                          <Input
                            type="number"
                            className="w-full text-right border-none"
                            value={item.palettes}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setForm(
                                (prev) =>
                                  prev && {
                                    ...prev,
                                    items: prev.items.map((it) =>
                                      it.itemId === item.itemId
                                        ? { ...it, palettes: val }
                                        : it
                                    ),
                                  }
                              );
                              if (onFormChange) onFormChange();
                            }}
                          />
                        </td>
                        <td className="border bg-white text-right">
                          <Input
                            type="number"
                            className="w-full text-right border-none"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              const newQuantityEgg = val * units;
                              const newAmount = val * unitPrice;
                              setForm(
                                (prev) =>
                                  prev && {
                                    ...prev,
                                    items: prev.items.map((it) =>
                                      it.itemId === item.itemId
                                        ? {
                                            ...it,
                                            quantity: val,
                                            quantityEgg: newQuantityEgg,
                                            amount: newAmount,
                                          }
                                        : it
                                    ),
                                  }
                              );
                              if (onFormChange) onFormChange();
                            }}
                          />
                        </td>
                        <td className="border p-2 text-right">
                          {item.quantityEgg.toLocaleString()}
                        </td>
                        <td className="border p-2 text-right">
                          {Math.floor(item.quantityEgg / 30).toLocaleString()}
                        </td>
                        <td className="border p-2 text-right">
                          {item.amount.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-gray-50 font-bold">
                    <td className="border p-2 text-center" colSpan={9}>
                      합계
                    </td>
                    <td className="border p-2 text-right">
                      {(
                        form?.items?.reduce(
                          (sum, item) => sum + item.palettes,
                          0
                        ) || 0
                      ).toLocaleString()}
                    </td>
                    <td className="border p-2 text-right"></td>
                    <td className="border p-2 text-right">
                      {(
                        form?.items?.reduce(
                          (sum, item) => sum + item.quantityEgg,
                          0
                        ) || 0
                      ).toLocaleString()}
                    </td>
                    <td className="border p-2 text-right">
                      {(
                        form?.items?.reduce(
                          (sum, item) =>
                            sum + Math.floor(item.quantityEgg / 30),
                          0
                        ) || 0
                      ).toLocaleString()}
                    </td>
                    <td className="border p-2 text-right">
                      ₩
                      {(
                        form?.items?.reduce(
                          (sum, item) => sum + item.amount,
                          0
                        ) || 0
                      ).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="flex justify-between gap-4 border-t border-[#E5E7EB] py-4 px-4">
            <div className="flex gap-4">
              <GreenButton onClick={handleNew}>신규</GreenButton>
              <BlueButton onClick={handleSaveSale}>저장</BlueButton>
              <RedButton onClick={handleDelete}>삭제</RedButton>
            </div>
            <GreenButton onClick={() => setShowPaymentModal(true)}>
              입금 등록
            </GreenButton>
          </div>
        </div>
      )}
      <PaymentModal
        saleId={sale?.id || form?.id || ""}
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
      />
      <OfficialPriceDialog
        isOpen={officialPriceOpen}
        onClose={() => setOfficialPriceOpen(false)}
      />
    </div>
  );
};

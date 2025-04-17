import React, { useState, useEffect } from "react";
import { GreenButton, GrayButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import PriceTable from "./PriceTable";
import { OfficialPriceDialog } from "@/components/ui/OfficialPriceDialog";
import { Dialog } from "@/components/layout/dialog";
import { useCustomerStore } from "../../store/customerStore";
import { usePriceStore } from "../../store/priceStore";
import { useItemStore } from "../../store/itemStore";
import { usePackageStore } from "../../store/packageStore";
import { useOfficialPriceStore } from "../../store/officialPriceStore";

interface PriceTableRow {
  itemName: string;
  spec: string;
  packaging: string;
  unit: string | number;
  basePrice: number;
  dc: number;
  finalPrice: number;
  diff: number;
  modified: string;
  created: string;
  itemId: string;
  customerId: string;
  priceInputType?: "auto" | "manual";
  manualPrice?: number;
}

const PricePage: React.FC = () => {
  const customers = useCustomerStore((state) => state.customers);
  const items = useItemStore((state) => state.items);
  const packages = usePackageStore((state) => state.packages);
  console.log(packages);
  const officialPrices = useOfficialPriceStore((state) => state.prices);
  const [filter, setFilter] = useState({
    customer: "",
    customerDC: "",
    region: "경기",
  });
  const [regionForApply, setRegionForApply] = useState(filter.region);
  const [officialPriceOpen, setOfficialPriceOpen] = useState(false);
  const [dialog, setDialog] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });
  const getPricesByCustomer = usePriceStore(
    (state) => state.getPricesByCustomer
  );
  const updatePrice = usePriceStore((state) => state.updatePrice);

  // 거래처 select 옵션 생성
  const customerOptions = [
    { label: "거래처", value: "" },
    ...customers.map((c) => ({ label: c.name, value: String(c.id) })),
  ];

  // 선택된 거래처의 품목별 단가 리스트 (CustomerItemPrice[])
  const customerId = filter.customer;
  const customerPrices = customerId
    ? getPricesByCustomer(String(customerId))
    : [];

  // 임시 입력값 상태 (itemId -> {dc, finalPrice})
  const [editMap, setEditMap] = useState<
    Record<string, { dc?: number; finalPrice?: number }>
  >({});

  // join: CustomerItemPrice + Item + Package + OfficialPrice
  const priceRows: PriceTableRow[] = customerPrices.map((price) => {
    const item = items.find((i) => i.id === price.itemId);
    const pkg = packages.find((p) => p.name === item?.packaging);
    const customer = customers.find((c) => String(c.id) === price.customerId);
    const region = customer?.region || filter.region;
    const regionPrices = officialPrices.filter((p) => p.region === region);
    let latest: (typeof regionPrices)[number] | undefined = undefined;
    if (regionPrices.length > 0) {
      latest = regionPrices.reduce((acc, cur) =>
        acc.date > cur.date ? acc : cur
      );
    }
    let official = 0;
    if (latest && item) {
      if (item.spec === "왕란") official = latest.king;
      else if (item.spec === "특란") official = latest.extraLarge;
      else if (item.spec === "대란") official = latest.large;
      else if (item.spec === "중란") official = latest.medium;
      else if (item.spec === "소란") official = latest.small;
    }
    const unit = Number(pkg?.unit || item?.unit || 1);
    const packagingCost = Number(pkg?.cost || 0);
    // 직접입력/자동 분기
    let dc = price.dc;
    let finalPrice = price.finalPrice;
    if (editMap[price.itemId]?.dc !== undefined)
      dc = editMap[price.itemId]!.dc!;
    if (editMap[price.itemId]?.finalPrice !== undefined)
      finalPrice = editMap[price.itemId]!.finalPrice!;
    if (price.priceInputType === "manual" && price.manualPrice !== undefined) {
      finalPrice = price.manualPrice;
      // 직접입력값이 최종단가 전체이므로, dc는 역산
      dc = official + packagingCost - finalPrice / unit;
    } else {
      console.log(official, dc, packagingCost, unit);
      // 자동계산: (공시가 - dc + 포장비) * 포장단위
      finalPrice = (official - dc + packagingCost) * unit;
    }
    // basePrice: (공시가 + 포장비) * 포장단위
    const basePrice = (official + packagingCost) * unit;
    return {
      itemName: item?.name || "",
      spec: item?.spec || "",
      packaging: pkg?.name || item?.packaging || "",
      unit,
      basePrice,
      dc,
      finalPrice,
      diff: finalPrice - basePrice,
      modified: price.modified,
      created: price.created,
      itemId: price.itemId,
      customerId: price.customerId,
      priceInputType: price.priceInputType,
      manualPrice: price.manualPrice,
    };
  });

  // DC/단가 변경 핸들러 (임시 상태에 저장)
  const handleChange = (
    itemId: string,
    field: "dc" | "finalPrice",
    value: number
  ) => {
    setEditMap((prev) => {
      const newEdit = { ...prev[itemId] };
      if (field === "dc") {
        newEdit.dc = value;
        newEdit.finalPrice = undefined;
      } else if (field === "finalPrice") {
        newEdit.finalPrice = value;
        newEdit.dc = undefined;
      }
      return {
        ...prev,
        [itemId]: newEdit,
      };
    });
  };

  // 저장 버튼 피드백 및 직접입력/자동 상태 반영
  const handleSave = () => {
    customerPrices.forEach((price) => {
      const edit = editMap[price.itemId];
      const item = items.find((i) => i.id === price.itemId);
      const pkg = packages.find((p) => p.name === item?.packaging);
      const region =
        customers.find((c) => String(c.id) === price.customerId)?.region ||
        filter.region;
      const regionPrices = officialPrices.filter((p) => p.region === region);
      let latest: (typeof regionPrices)[number] | undefined = undefined;
      if (regionPrices.length > 0) {
        latest = regionPrices.reduce((acc, cur) =>
          acc.date > cur.date ? acc : cur
        );
      }
      let official = 0;
      if (latest && item) {
        if (item.spec === "왕란") official = latest.king;
        else if (item.spec === "특란") official = latest.extraLarge;
        else if (item.spec === "대란") official = latest.large;
        else if (item.spec === "중란") official = latest.medium;
        else if (item.spec === "소란") official = latest.small;
      }
      const unit = Number(pkg?.unit || item?.unit || 1);
      const packagingCost = Number(pkg?.cost || 0);
      if (edit) {
        if (
          edit.finalPrice !== undefined &&
          edit.finalPrice !== null &&
          edit.finalPrice !== 0
        ) {
          // 최종단가 직접입력: dc 역산
          const newDC = official + packagingCost - edit.finalPrice / unit;
          updatePrice({
            ...price,
            priceInputType: "manual",
            manualPrice: edit.finalPrice,
            finalPrice: edit.finalPrice,
            dc: newDC,
          });
        } else if (edit.dc !== undefined && edit.dc !== null && edit.dc !== 0) {
          // DC 직접입력: (공시가 - dc + 포장비) * 포장단위
          const newFinal = (official - edit.dc + packagingCost) * unit;
          updatePrice({
            ...price,
            priceInputType: "manual",
            manualPrice: newFinal,
            finalPrice: newFinal,
            dc: edit.dc,
          });
        } else {
          // 자동계산
          const autoFinal = (official - price.dc + packagingCost) * unit;
          updatePrice({
            ...price,
            priceInputType: "auto",
            manualPrice: undefined,
            finalPrice: autoFinal,
            dc: price.dc,
          });
        }
      }
    });
    setEditMap({});
    setDialog({ open: true, message: "저장되었습니다." });
  };

  // 3. 일괄 적용 버튼: 거래처DC input 값을 모든 품목 DC에 일괄 적용
  const handleBulkApply = () => {
    if (!filter.customer) return;
    const dcValue = Number(filter.customerDC) || 0;
    customerPrices.forEach((price) => {
      const item = items.find((i) => i.id === price.itemId);
      const pkg = packages.find((p) => p.name === item?.packaging);
      const region =
        customers.find((c) => String(c.id) === price.customerId)?.region ||
        filter.region;
      const regionPrices = officialPrices.filter((p) => p.region === region);
      let latest: (typeof regionPrices)[number] | undefined = undefined;
      if (regionPrices.length > 0) {
        latest = regionPrices.reduce((acc, cur) =>
          acc.date > cur.date ? acc : cur
        );
      }
      let official = 0;
      if (latest && item) {
        if (item.spec === "왕란") official = latest.king;
        else if (item.spec === "특란") official = latest.extraLarge;
        else if (item.spec === "대란") official = latest.large;
        else if (item.spec === "중란") official = latest.medium;
        else if (item.spec === "소란") official = latest.small;
      }
      const unit = Number(pkg?.unit || item?.unit || 1);
      const packagingCost = Number(pkg?.cost || 0);
      const newFinal = (official - dcValue + packagingCost) * unit;
      updatePrice({
        ...price,
        priceInputType: "manual",
        manualPrice: newFinal,
        finalPrice: newFinal,
        dc: dcValue,
      });
    });
    setDialog({ open: true, message: "DC가 일괄 적용되었습니다." });
  };

  // 4. 공시가 일괄 적용 버튼: 선택 지역 최신 공시가로 basePrice/최종단가 일괄 적용
  const handleBulkApplyOfficial = () => {
    if (!filter.customer) return;
    setFilter((f) => ({ ...f, region: regionForApply }));
    const region = regionForApply;
    const regionPrices = officialPrices.filter((p) => p.region === region);
    let latest: (typeof regionPrices)[number] | undefined = undefined;
    if (regionPrices.length > 0) {
      latest = regionPrices.reduce((acc, cur) =>
        acc.date > cur.date ? acc : cur
      );
    }
    customerPrices.forEach((price) => {
      const item = items.find((i) => i.id === price.itemId);
      const pkg = packages.find((p) => p.name === item?.packaging);
      let official = 0;
      if (latest && item) {
        if (item.spec === "왕란") official = latest.king;
        else if (item.spec === "특란") official = latest.extraLarge;
        else if (item.spec === "대란") official = latest.large;
        else if (item.spec === "중란") official = latest.medium;
        else if (item.spec === "소란") official = latest.small;
      }
      // basePrice 계산: 공시가*단위 + 포장비
      const unit = Number(pkg?.unit || item?.unit || 1);
      const packagingCost = Number(pkg?.cost || 0);
      const basePrice = unit * Number(official) + packagingCost;
      const newPrice = {
        ...price,
        basePrice,
        finalPrice: basePrice - price.dc * unit,
      };
      updatePrice(newPrice);
    });
    setDialog({ open: true, message: "공시가가 일괄 적용되었습니다." });
  };

  // 공시가 적용 지역 옵션 생성
  const regionOptions = Array.from(
    new Set(officialPrices.map((p) => p.region))
  ).map((region) => ({ label: region, value: region }));
  if (
    regionOptions.length > 0 &&
    !regionOptions.find((r) => r.value === filter.region)
  ) {
    regionOptions.unshift({ label: "지역 선택", value: "" });
  }

  // 거래처 선택 시 DC 자동 반영
  useEffect(() => {
    if (!filter.customer) return;
    const customer = customers.find((c) => String(c.id) === filter.customer);
    if (customer) {
      setFilter((f) => ({ ...f, customerDC: String(customer.discount ?? "") }));
    }
  }, [filter.customer, customers]);

  return (
    <main className="flex-1 bg-white">
      <Dialog
        isOpen={dialog.open}
        setIsOpen={(open) => setDialog((d) => ({ ...d, open }))}
        title="알림"
      >
        <div>{dialog.message}</div>
      </Dialog>
      {/* 타이틀 + 버튼 묶음 */}
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-bold">거래처별 단가 관리</h1>
        <div className="flex gap-2">
          <GrayButton className="text-sm" onClick={() => {}}>
            액셀 다운로드
          </GrayButton>
          <GrayButton className="text-sm" onClick={() => {}}>
            인쇄
          </GrayButton>
          <GrayButton
            className="text-sm"
            onClick={() => setOfficialPriceOpen(true)}
          >
            공시가 확인
          </GrayButton>
        </div>
      </div>
      {/* 필터/검색 영역 */}
      <section className="bg-white p-4 border-t border-border flex gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">거래처</label>
          <Select
            options={customerOptions}
            value={filter.customer}
            onChange={(v) => setFilter((f) => ({ ...f, customer: v }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">거래처DC</label>
          <Input
            type="text"
            placeholder="50"
            value={filter.customerDC}
            onChange={(e) =>
              setFilter((f) => ({ ...f, customerDC: e.target.value }))
            }
          />
        </div>
        <GreenButton onClick={handleBulkApply}>일괄 적용</GreenButton>
        <div>
          <label className="block text-sm font-medium mb-1">
            공시가 적용 지역
          </label>
          <Select
            options={regionOptions}
            value={regionForApply}
            onChange={(v) => setRegionForApply(v)}
          />
        </div>
        <GreenButton onClick={handleBulkApplyOfficial}>
          공시가 일괄 적용
        </GreenButton>
      </section>
      {/* 저장 버튼 */}
      <div className="flex gap-2 p-4 border-t border-border">
        <GreenButton onClick={handleSave}>저장</GreenButton>
      </div>
      {/* 테이블 */}
      <PriceTable data={priceRows} onChange={handleChange} />
      <OfficialPriceDialog
        isOpen={officialPriceOpen}
        onClose={() => setOfficialPriceOpen(false)}
      />
    </main>
  );
};

export default PricePage;

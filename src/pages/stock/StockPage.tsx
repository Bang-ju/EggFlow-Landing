import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BlueButton,
  GreenButton,
  RedButton,
  GrayButton,
} from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useItemStore } from "@/store/itemStore";
import { useStockStore } from "@/store/stockStore";
import { useOfficialPriceStore } from "@/store/officialPriceStore";
import { usePackageStore } from "@/store/packageStore";

export const StockPage: React.FC = () => {
  const items = useItemStore((state) => state.items);
  const { stocks, addStock, updateStock, removeStock } = useStockStore();
  const officialPrices = useOfficialPriceStore((state) => state.prices);
  const packages = usePackageStore((state) => state.packages);

  // region은 임시로 '경기' 고정
  const region = "경기";
  // 최신 공시가
  const regionPrices = officialPrices.filter((p) => p.region === region);
  const latestOfficial = regionPrices.reduce(
    (acc, cur) => (acc.date > cur.date ? acc : cur),
    regionPrices[0]
  );

  // 다이얼로그 상태
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // 선택된 아이템과 수량 상태
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [quantityEgg, setQuantityEgg] = useState<string>("");
  const [quantityPlate, setQuantityPlate] = useState<string>("");

  // 재고 변경 다이얼로그 상태
  const [fromItemId, setFromItemId] = useState<string>("");
  const [toItemId, setToItemId] = useState<string>("");

  // 입력값 동기화: 알 <-> 판
  useEffect(() => {
    if (
      document.activeElement &&
      (document.activeElement as HTMLElement).getAttribute("name") ===
        "quantityPlate"
    ) {
      setQuantityEgg(
        quantityPlate ? String(Math.round(Number(quantityPlate) * 30)) : ""
      );
    } else {
      setQuantityPlate(
        quantityEgg ? (Number(quantityEgg) / 30).toFixed(1) : ""
      );
    }
  }, [quantityEgg, quantityPlate]);

  // 재고 추가 처리
  const handleAddStock = () => {
    if (!selectedItemId) return;
    addStock({
      itemId: selectedItemId,
      quantityEgg: Number(quantityEgg) || 0,
    });
    setAddDialogOpen(false);
    setSelectedItemId("");
    setQuantityEgg("");
    setQuantityPlate("");
  };

  // 재고 변경 처리 (한 품목에서 다른 품목으로 이동)
  const handleEditStock = () => {
    if (!fromItemId || !toItemId || fromItemId === toItemId) return;
    const moveEgg = Number(quantityEgg) || 0;
    // 기존 재고
    const fromStock = stocks.find((s) => s.itemId === fromItemId);
    const toStock = stocks.find((s) => s.itemId === toItemId);
    if (moveEgg > 0) {
      updateStock({
        itemId: fromItemId,
        quantityEgg: Math.max((fromStock?.quantityEgg || 0) - moveEgg, 0),
      });
      updateStock({
        itemId: toItemId,
        quantityEgg: (toStock?.quantityEgg || 0) + moveEgg,
      });
    }
    setEditDialogOpen(false);
    setFromItemId("");
    setToItemId("");
    setQuantityEgg("");
    setQuantityPlate("");
  };

  // 재고 삭제 처리 (알/판 단위로 삭제)
  const handleDeleteStock = () => {
    if (!stocks.length || !selectedItemId) return;
    const removeEgg = Number(quantityEgg) || 0;
    removeStock(selectedItemId, removeEgg);
    setDeleteDialogOpen(false);
    setSelectedItemId("");
    setQuantityEgg("");
    setQuantityPlate("");
  };

  // 테이블 렌더용: 모든 아이템을 보여주고, 재고 수량은 stocks에서 찾아서 표시
  const tableRows = items.map((item) => {
    const stock = stocks.find((s) => s.itemId === item.id);
    // 포장 정보
    const pkg = packages.find((p) => p.name === item.packaging);
    const unit = Number(pkg?.unit || item.unit || 1);
    const packagingCost = Number(pkg?.cost || 0);
    // 공시가(규격별)
    let official = 0;
    if (latestOfficial) {
      if (item.spec === "왕란") official = latestOfficial.king;
      else if (item.spec === "특란") official = latestOfficial.extraLarge;
      else if (item.spec === "대란") official = latestOfficial.large;
      else if (item.spec === "중란") official = latestOfficial.medium;
      else if (item.spec === "소란") official = latestOfficial.small;
    }
    // 단가 계산
    const price = (official + packagingCost) * unit;
    // 판 수 계산(항상 30으로 나눔)
    const plateCount = (stock?.quantityEgg || 0) / 30;
    // 총액 계산
    const totalPrice = ((stock?.quantityEgg || 0) / unit) * price;
    return {
      ...item,
      quantityEgg: stock?.quantityEgg || 0,
      quantityPlate: plateCount,
      price,
      totalPrice,
    };
  });

  // 합계
  const totalQuantityEgg = tableRows.reduce(
    (sum, row) => sum + row.quantityEgg,
    0
  );
  const totalQuantityPlate = tableRows.reduce(
    (sum, row) => sum + row.quantityPlate,
    0
  );
  const totalValue = tableRows.reduce((sum, row) => sum + row.totalPrice, 0);

  // 품목 옵션
  const itemOptions = items.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  return (
    <div className="rounded bg-white">
      <div className="flex justify-between items-center px-4">
        <h1 className="text-xl font-bold py-4">재고 목록</h1>
        <div className="flex flex-row gap-2">
          <GrayButton>액셀 다운로드</GrayButton>
          <GrayButton>인쇄</GrayButton>
        </div>
      </div>

      <div className="flex justify-start space-x-2 p-4 border-t border-border">
        <GreenButton onClick={() => setAddDialogOpen(true)}>
          재고 추가
        </GreenButton>
        <BlueButton onClick={() => setEditDialogOpen(true)}>
          재고 변경
        </BlueButton>
        <RedButton onClick={() => setDeleteDialogOpen(true)}>
          재고 삭제
        </RedButton>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto p-4 border-t border-border">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="border p-2 text-center w-12 text-sm font-bold">
                연번
              </th>
              <th className="border p-2 text-center w-20 text-sm font-bold">
                품목코드
              </th>
              <th className="border p-2 text-center w-32 text-sm font-bold">
                품목명
              </th>
              <th className="border p-2 text-center w-20 text-sm font-bold">
                규격
              </th>
              <th className="border p-2 text-center w-20 text-sm font-bold">
                포장
              </th>
              <th className="border p-2 text-center w-20 text-sm font-bold">
                단위
              </th>
              <th className="border p-2 text-center w-20 text-sm font-bold">
                단가
              </th>
              <th className="border p-2 text-center w-20 text-sm font-bold">
                수량(알)
              </th>
              <th className="border p-2 text-center w-20 text-sm font-bold">
                수량(판)
              </th>
              <th className="border p-2 text-center w-28 text-sm font-bold">
                총액
              </th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, index) => (
              <tr key={row.id} className={index % 2 === 1 ? "bg-slate-50" : ""}>
                <td className="border p-2 text-center text-sm">{index + 1}</td>
                <td className="border p-2 text-right text-sm">{row.code}</td>
                <td className="border p-2 text-sm">{row.name}</td>
                <td className="border p-2 text-sm">{row.spec}</td>
                <td className="border p-2 text-sm">{row.packaging}</td>
                <td className="border p-2 text-right text-sm">{row.unit}</td>
                <td className="border p-2 text-right text-sm">
                  {row.price.toLocaleString()}
                </td>
                <td className="border p-2 text-right text-sm">
                  {row.quantityEgg.toLocaleString()}
                </td>
                <td className="border p-2 text-right text-sm">
                  {row.quantityPlate.toFixed(1)}
                </td>
                <td className="border p-2 text-right text-sm">
                  ₩{row.totalPrice.toLocaleString()}
                </td>
              </tr>
            ))}
            <tr className="bg-slate-50 font-bold">
              <td className="border p-2 text-center text-sm" colSpan={7}>
                합계
              </td>
              <td className="border p-2 text-right text-sm">
                {totalQuantityEgg.toLocaleString()}
              </td>
              <td className="border p-2 text-right text-sm">
                {totalQuantityPlate.toLocaleString()}
              </td>
              <td className="border p-2 text-right text-sm">
                ₩{totalValue.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 재고 추가 다이얼로그 */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[750px]">
          <DialogHeader>
            <DialogTitle>재고 추가</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-row items-center gap-4">
              <label className="text-right text-sm whitespace-nowrap">
                품목 *
              </label>
              <div className="w-full">
                <Select
                  value={selectedItemId}
                  onChange={setSelectedItemId}
                  options={itemOptions}
                />
              </div>
            </div>
            <div className="flex flex-row items-center gap-4">
              <div className="flex flex-row items-center gap-4">
                <label className="text-right text-sm whitespace-nowrap">
                  추가 개수(알) *
                </label>
                <div className="w-full">
                  <Input
                    name="quantityEgg"
                    type="text"
                    value={quantityEgg}
                    onChange={(e) => setQuantityEgg(e.target.value)}
                    placeholder="변경 개수(알) 입력"
                  />
                </div>
              </div>
              <div className="flex flex-row items-center gap-4">
                <label className="text-right text-sm whitespace-nowrap">
                  추가 개수(판) *
                </label>
                <div className="w-full">
                  <Input
                    name="quantityPlate"
                    type="text"
                    value={quantityPlate}
                    onChange={(e) => setQuantityPlate(e.target.value)}
                    placeholder="변경 개수(판) 입력"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <GrayButton onClick={() => setAddDialogOpen(false)}>
              취소
            </GrayButton>
            <GreenButton onClick={handleAddStock}>저장</GreenButton>
          </div>
        </DialogContent>
      </Dialog>

      {/* 재고 변경/삭제 다이얼로그는 예시로 첫 번째 재고만 처리 */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[750px]">
          <DialogHeader>
            <DialogTitle>재고 변경 (이동)</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4">
            <div className="flex flex-row items-center gap-4">
              <div className="flex flex-row items-center gap-4">
                <label className="text-right text-sm whitespace-nowrap">
                  변경 전 품목 *
                </label>
                <div className="w-full">
                  <Select
                    value={fromItemId}
                    onChange={setFromItemId}
                    options={itemOptions}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <label className="text-right text-sm whitespace-nowrap">
                  변경 후 품목 *
                </label>
                <div className="w-full">
                  <Select
                    value={toItemId}
                    onChange={setToItemId}
                    options={itemOptions}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center gap-4">
              <div className="flex flex-row items-center gap-4">
                <label className="text-right text-sm whitespace-nowrap">
                  이동 개수(알) *
                </label>
                <div className="w-full">
                  <Input
                    name="quantityEgg"
                    type="text"
                    value={quantityEgg}
                    onChange={(e) => setQuantityEgg(e.target.value)}
                    placeholder="이동 개수(알) 입력"
                  />
                </div>
              </div>
              <div className="flex flex-row items-center gap-4">
                <label className="text-right text-sm whitespace-nowrap">
                  이동 개수(판)
                </label>
                <div className="w-full">
                  <Input
                    name="quantityPlate"
                    type="text"
                    value={quantityPlate}
                    onChange={(e) => setQuantityPlate(e.target.value)}
                    placeholder="자동 계산"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <GrayButton onClick={() => setEditDialogOpen(false)}>
              취소
            </GrayButton>
            <GreenButton onClick={handleEditStock}>저장</GreenButton>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[750px]">
          <DialogHeader>
            <DialogTitle>재고 삭제</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <label className="text-right text-sm whitespace-nowrap">
                품목 *
              </label>
              <div className="w-full">
                <Select
                  value={selectedItemId}
                  onChange={setSelectedItemId}
                  options={itemOptions}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <label className="text-right text-sm whitespace-nowrap">
                알 개수 *
              </label>
              <div className="w-full">
                <Input
                  name="quantityEgg"
                  type="text"
                  value={quantityEgg}
                  onChange={(e) => setQuantityEgg(e.target.value)}
                  placeholder="알 개수 입력"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <label className="text-right text-sm whitespace-nowrap">
                판 개수 *
              </label>
              <div className="w-full">
                <Input
                  name="quantityPlate"
                  type="text"
                  value={quantityPlate}
                  onChange={(e) => setQuantityPlate(e.target.value)}
                  placeholder="판 개수 입력"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <GrayButton onClick={() => setDeleteDialogOpen(false)}>
              취소
            </GrayButton>
            <RedButton onClick={handleDeleteStock}>삭제</RedButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

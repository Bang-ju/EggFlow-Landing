import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { BlueButton, GrayButton } from "@/components/ui/button";
import { usePackageStore } from "../../../store/packageStore";
import { useOfficialPriceStore } from "../../../store/officialPriceStore";
// import { Button } from '@/components/ui/button'; // 추후 Button 컴포넌트 사용
// import { Textarea } from '@/components/ui/textarea'; // 추후 Textarea 컴포넌트 사용
// import { Item } from './ItemTable'; // ItemTable에서 export하지 않으므로 제거

// Item 타입을 여기서 직접 정의합니다.
interface Item {
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
  // ItemDialog에서만 사용하는 상태 추가
  status?: "판매중" | "판매중지";
  notes?: string;
}

interface ItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  itemData?: Item | null;
  onSave: (
    item: Omit<Item, "id" | "modifiedDate" | "createdDate" | "priceDiff"> & {
      id?: string;
    }
  ) => void;
}

const ItemDialog: React.FC<ItemDialogProps> = ({
  isOpen,
  onClose,
  itemData,
  onSave,
}) => {
  // Form state management (basic example)
  const [formData, setFormData] = useState<Partial<Item>>(itemData || {});

  // zustand에서 포장 데이터 가져오기
  const packages = usePackageStore((state) => state.packages);
  const prices = useOfficialPriceStore((state) => state.prices);
  const packagingOptions = packages.map((pkg) => ({
    label: `${pkg.name} (${pkg.unit})`,
    value: pkg.name,
  }));
  packagingOptions.unshift({ label: "포장 선택", value: "" });

  React.useEffect(() => {
    // If itemData changes (e.g., opening dialog for editing), update form state
    setFormData(itemData || {});
  }, [itemData, isOpen]);

  // 단위, 규격, 포장 변경 시 자동 단가 계산
  React.useEffect(() => {
    const { unit, spec, packaging } = formData;
    if (!unit || !spec || !packaging) return;
    // 포장명으로만 매칭
    const pkgMatch = packages.find((pkg) => pkg.name === packaging);
    // region은 상품에 따로 없으므로, 가장 최근 공시가(region 상관없이 최신) 사용
    // 또는 필요시 region을 상품에 추가해서 연동 가능
    // 여기서는 모든 공시가 중에서 spec(규격)별 최신 가격 사용
    let latestPrice = undefined;
    let latestDate = "";
    for (const price of prices) {
      if (!latestDate || price.date > latestDate) {
        latestDate = price.date;
        latestPrice = price;
      }
    }
    let official = 0;
    if (latestPrice) {
      if (spec === "왕란") official = latestPrice.king;
      else if (spec === "특란") official = latestPrice.extraLarge;
      else if (spec === "대란") official = latestPrice.large;
      else if (spec === "중란") official = latestPrice.medium;
      else if (spec === "소란") official = latestPrice.small;
    }
    const packagingCost = pkgMatch ? Number(pkgMatch.cost) : 0;
    const calcPrice = Number(unit) * (Number(official) + Number(packagingCost));
    if (!isNaN(calcPrice) && calcPrice > 0) {
      setFormData((prev) => ({ ...prev, price: calcPrice }));
    }
  }, [formData.unit, formData.spec, formData.packaging, packages, prices]);

  // 포장 선택 시 단위 자동 반영
  React.useEffect(() => {
    const { packaging } = formData;
    if (!packaging) return;
    const pkgMatch = packages.find((pkg) => pkg.name === packaging);
    if (pkgMatch && Number(formData.unit) !== Number(pkgMatch.unit)) {
      setFormData((prev) => ({ ...prev, unit: Number(pkgMatch.unit) }));
    }
  }, [formData.packaging, packages]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value /*, type */ } = e.target; // type 변수 주석 처리
    // Handle checkbox type if added later
    // const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Validate form data more thoroughly
    if (
      !formData.code ||
      !formData.name ||
      !formData.spec ||
      !formData.packaging ||
      formData.unit === undefined ||
      formData.price === undefined ||
      !formData.status
    ) {
      alert("필수 필드를 모두 입력해주세요.");
      return;
    }
    console.log("Saving item:", formData);
    const saveData: Omit<
      Item,
      "id" | "modifiedDate" | "createdDate" | "priceDiff"
    > & { id?: string } = {
      code: formData.code,
      name: formData.name,
      spec: formData.spec,
      packaging: formData.packaging,
      unit: Number(formData.unit),
      price: Number(formData.price),
      status: formData.status,
      notes: formData.notes,
      ...(itemData?.id && { id: itemData.id }), // Include id if editing
    };
    onSave(saveData); // 사용하지 않는 오류 제거
    // onClose(); // Optionally close dialog after save, or handle in parent
  };

  if (!isOpen) return null;

  const dialogTitle = itemData ? "품목 수정" : "품목 등록";

  return (
    <div className="fixed inset-0 bg-gray-500/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">{dialogTitle}</h2>
        </div>

        {/* Body - Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-x-10 gap-y-4">
            {/* 품목 코드 */}
            <div className="space-y-1">
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700"
              >
                품목 코드 *
              </label>
              <Input
                id="code"
                name="code"
                type="text"
                required
                value={formData.code || ""}
                onChange={handleChange}
                className="w-full sm:text-sm"
              />
            </div>
            {/* 품목 명 */}
            <div className="space-y-1">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                품목 명 *
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name || ""}
                onChange={handleChange}
                className="w-full sm:text-sm"
              />
            </div>
            {/* 규격 */}
            <div className="space-y-1">
              <label
                htmlFor="spec"
                className="block text-sm font-medium text-gray-700"
              >
                규격 *
              </label>
              <Select
                value={formData.spec || ""}
                onChange={(value) =>
                  handleChange({
                    target: { name: "spec", value },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                className="w-full sm:text-sm"
                options={[
                  { label: "규격 선택", value: "" },
                  { label: "왕란", value: "왕란" },
                  { label: "특란", value: "특란" },
                  { label: "대란", value: "대란" },
                ]}
              />
            </div>
            {/* 포장 */}
            <div className="space-y-1">
              <label
                htmlFor="packaging"
                className="block text-sm font-medium text-gray-700"
              >
                포장 *
              </label>
              <Select
                value={formData.packaging || ""}
                onChange={(value) =>
                  handleChange({
                    target: { name: "packaging", value },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                className="w-full sm:text-sm"
                options={packagingOptions}
              />
            </div>
            {/* 단위 */}
            <div className="space-y-1">
              <label
                htmlFor="unit"
                className="block text-sm font-medium text-gray-700"
              >
                단위 *
              </label>
              <Input
                id="unit"
                name="unit"
                type="number"
                required
                value={formData.unit ?? ""}
                readOnly={true}
                className="w-full sm:text-sm"
              />
            </div>
            {/* 단가 */}
            <div className="space-y-1">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                단가 *
              </label>
              <Input
                id="price"
                name="price"
                type="number"
                required
                value={formData.price || ""}
                onChange={handleChange}
                className="w-full sm:text-sm"
              />
            </div>
            {/* 상태 */}
            <div className="space-y-1">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                상태 *
              </label>
              <Select
                value={formData.status || "판매중"}
                onChange={(value) =>
                  handleChange({
                    target: { name: "status", value },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                className="w-full sm:text-sm"
                options={[
                  { label: "판매중", value: "판매중" },
                  { label: "판매중지", value: "판매중지" },
                ]}
              />
            </div>
          </div>
          {/* 비고 */}
          <div className="space-y-1">
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700"
            >
              비고
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes || ""}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            ></textarea>
          </div>

          {/* Footer - Buttons */}
          <div className="pt-6 border-t border-gray-200 flex justify-end space-x-2">
            <GrayButton onClick={onClose}>취소</GrayButton>
            <BlueButton type="submit">저장</BlueButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemDialog;

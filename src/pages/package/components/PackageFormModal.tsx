import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input"; // 기본 가져오기 -> 명명된 가져오기로 변경
import { BlueButton, GrayButton } from "@/components/ui/button";

interface Package {
  id?: number; // 수정 시 필요
  name: string;
  unit: string;
  cost: string;
  remarks: string;
}

interface PackageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (packageData: Package) => void;
  initialData?: Package | null; // 수정 시 초기 데이터
}

const PackageFormModal: React.FC<PackageFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<Package>({
    name: "",
    unit: "",
    cost: "",
    remarks: "",
  });
  const isEditMode = !!initialData; // 초기 데이터가 있으면 수정 모드

  useEffect(() => {
    // 모달이 열릴 때 초기 데이터 설정
    if (isOpen && initialData) {
      setFormData(initialData);
    } else if (!isOpen) {
      // 모달이 닫힐 때 폼 초기화
      setFormData({ name: "", unit: "", cost: "", remarks: "" });
    }
  }, [isOpen, initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 간단한 유효성 검사 (필수 필드)
    if (!formData.name || !formData.unit || !formData.cost) {
      alert("포장명, 단위, 포장비는 필수 입력 항목입니다.");
      return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500/50 flex justify-center items-center z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-md mx-4">
        <form onSubmit={handleSubmit}>
          {/* 제목 영역 */}
          <div className="border-b px-6 py-4">
            <h3 className="text-lg font-semibold">
              {isEditMode ? "포장 수정" : "포장 등록"}
            </h3>
          </div>
          {/* 입력 필드 영역 */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <label htmlFor="name" className="text-sm font-medium text-right">
                포장명 *
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="포장명"
                className="col-span-2"
                required
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <label htmlFor="unit" className="text-sm font-medium text-right">
                단위 *
              </label>
              <Input
                type="text"
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="단위 (숫자)"
                className="col-span-2"
                required
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <label htmlFor="cost" className="text-sm font-medium text-right">
                포장비 *
              </label>
              <Input
                id="cost"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                placeholder="포장비 (숫자)"
                className="col-span-2"
                type="number" // 숫자만 입력 가능하도록
                required
              />
            </div>
            <div className="grid grid-cols-3 items-start gap-4">
              <label
                htmlFor="remarks"
                className="text-sm font-medium text-right mt-1.5"
              >
                비고
              </label>
              <textarea
                id="remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="비고"
                rows={3}
                className="col-span-2 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          {/* 버튼 영역 */}
          <div className="border-t px-6 py-4 flex justify-end space-x-2">
            <GrayButton onClick={onClose}>취소</GrayButton>
            <BlueButton type="submit">저장</BlueButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PackageFormModal;

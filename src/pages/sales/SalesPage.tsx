import React, { useState } from "react";
import { SalesRegistration } from "./components/SalesRegistration";
import { SalesList } from "./components/SalesList";
import type { Sale } from "@/store/salesStore";

export const SalesPage: React.FC = () => {
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // SalesList에서 매출 클릭 시
  const handleSelectSale = (sale: Sale) => {
    if (isEditing) {
      if (
        window.confirm(
          "정말 이 매출로 폼을 바꾸시겠습니까? 작성 중인 내용이 사라집니다."
        )
      ) {
        setSelectedSale(sale);
        setIsEditing(false);
      }
    } else {
      setSelectedSale(sale);
      setIsEditing(false);
    }
  };

  // SalesRegistration에서 입력값이 바뀌면
  const handleFormChange = () => {
    setIsEditing(true);
  };

  // 신규 버튼 클릭 시
  const handleNew = () => {
    setSelectedSale(null);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <SalesRegistration
        sale={selectedSale}
        onFormChange={handleFormChange}
        onNew={handleNew}
      />
      <SalesList onSelectSale={handleSelectSale} />
    </div>
  );
};

import { useState } from "react";
import { Dialog } from "../../components/layout/dialog";
import { PurchaseRegistration } from "./components/PurchaseRegistration";
import { PurchaseList } from "./components/PurchaseList";
import type { Purchase } from "@/types/purchase";

export const PurchasePage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);

  // 목록에서 매입 선택 시
  const handleSelectPurchase = (purchase: Purchase) => {
    if (isEditing) {
      if (
        window.confirm(
          "정말 이 매입으로 폼을 바꾸시겠습니까? 작성 중인 내용이 사라집니다."
        )
      ) {
        setSelectedPurchase(purchase);
        setIsEditing(false);
      }
    } else {
      setSelectedPurchase(purchase);
      setIsEditing(false);
    }
  };

  // 등록폼에서 입력값 변경 시
  const handleFormChange = () => {
    setIsEditing(true);
  };

  // 신규 버튼 클릭 시
  const handleNew = () => {
    setSelectedPurchase(null);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <PurchaseRegistration
        purchase={selectedPurchase}
        onFormChange={handleFormChange}
        onNew={handleNew}
      />
      <PurchaseList onSelectPurchase={handleSelectPurchase} />
      <Dialog isOpen={dialogOpen} setIsOpen={setDialogOpen} title="알림">
        <p>거래처를 선택해주세요.</p>
      </Dialog>
    </div>
  );
};

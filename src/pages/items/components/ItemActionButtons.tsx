import React from "react";
import {
  BlueButton,
  GrayButton,
  RedButton,
  GreenButton,
} from "@/components/ui/button";

// Props 타입 정의 추가
interface ItemActionButtonsProps {
  onNew: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ItemActionButtons: React.FC<ItemActionButtonsProps> = ({
  onNew,
  onEdit,
  onDelete,
}) => {
  // TODO: Add onClick handlers for each button
  return (
    <div className="bg-white p-4 border-t border-border flex justify-between items-center">
      <div className="flex space-x-2">
        {/* <Button variant="success" onClick={onNew}>신규</Button> */}
        <GreenButton onClick={onNew}>신규</GreenButton>
        {/* <Button onClick={onEdit}>수정</Button> */}
        <BlueButton onClick={onEdit}>수정</BlueButton>
        {/* <Button variant="destructive" onClick={onDelete}>삭제</Button> */}
        <RedButton onClick={onDelete}>삭제</RedButton>
      </div>
      <div className="flex space-x-2">
        {/* <Button variant="outline">액셀 다운로드</Button> */}
        <GrayButton>액셀 다운로드</GrayButton>
        {/* <Button variant="outline">인쇄</Button> */}
        <GrayButton>인쇄</GrayButton>
      </div>
    </div>
  );
};

export default ItemActionButtons;

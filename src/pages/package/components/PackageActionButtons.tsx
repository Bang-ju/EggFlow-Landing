import {
  BlueButton,
  GrayButton,
  GreenButton,
  RedButton,
} from "@/components/ui/button";
import React from "react";
// import Button from "@/components/ui/button"; // Button 컴포넌트 import 제거
// import Button from '@/components/ui/Button'; // 추후 생성 예정

interface PackageActionButtonsProps {
  onNewClick: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
  isEditDisabled: boolean;
  isDeleteDisabled: boolean;
}

const PackageActionButtons: React.FC<PackageActionButtonsProps> = ({
  onNewClick,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <div className="flex justify-between w-full">
      <div className="flex flex-row gap-2">
        {/* <Button variant="success" size="sm">
          신규
        </Button> */}
        <GreenButton onClick={onNewClick}>신규</GreenButton>
        {/* 기존 버튼 사용, text-sm 추가 */}
        {/* <Button variant="primary" size="sm">
          수정
        </Button> */}
        <BlueButton onClick={onEditClick}>수정</BlueButton>
        {/* 기존 버튼 사용, text-sm 추가 */}
        {/* <Button variant="danger" size="sm">
          삭제
        </Button> */}
        <RedButton onClick={onDeleteClick}>삭제</RedButton>
      </div>
      <div className="flex flex-row gap-2">
        {/* <Button variant="outline" size="sm">
          액셀 다운로드
        </Button> */}
        <GrayButton>액셀 다운로드</GrayButton>{" "}
        {/* 기존 버튼 사용, text-sm 추가 */}
        {/* <Button variant="outline" size="sm">
          인쇄
        </Button> */}
        <GrayButton>인쇄</GrayButton> {/* 기존 버튼 사용, text-sm 추가 */}
      </div>
    </div>
  );
};

export default PackageActionButtons;

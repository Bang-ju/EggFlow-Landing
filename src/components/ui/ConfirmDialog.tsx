import React from "react";
// import { Button } from '@/components/ui/button'; // 추후 Button 컴포넌트 사용

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "default" | "destructive"; // 버튼 스타일 변형 추가
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "확인",
  cancelText = "취소",
  confirmVariant = "default", // 기본값 설정
}) => {
  if (!isOpen) return null;

  const confirmButtonClasses =
    confirmVariant === "destructive"
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-blue-600 hover:bg-blue-700 text-white";

  return (
    <div className="fixed inset-0 bg-gray-500/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-sm text-gray-600">{message}</p>
        </div>

        {/* Footer - Buttons */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-2 rounded-b-lg">
          {/* <Button variant="outline" onClick={onClose}>{cancelText}</Button> */}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
          >
            {cancelText}
          </button>
          {/* <Button className={confirmButtonClasses} onClick={onConfirm}>{confirmText}</Button> */}
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-sm rounded ${confirmButtonClasses}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

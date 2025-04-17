import React from "react";

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: React.ReactNode; // 내용을 JSX로도 받을 수 있도록 ReactNode 사용
  confirmText?: string;
  cancelText?: string;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "확인",
  cancelText, // cancelText가 없으면 취소 버튼 숨김
}) => {
  if (!isOpen) return null;

  return (
    // 배경 오버레이
    <div className="fixed inset-0 bg-gray-500/50 flex justify-center items-center z-50">
      {/* 다이얼로그 컨테이너 */}
      <div className="bg-white rounded shadow-lg w-full max-w-sm mx-4">
        {/* 제목 영역 */}
        <div className="border-b px-6 py-4">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        {/* 내용 영역 */}
        <div className="px-6 py-4">
          {typeof description === "string" ? <p>{description}</p> : description}
        </div>
        {/* 버튼 영역 */}
        <div className="border-t px-6 py-4 flex justify-end space-x-2">
          {cancelText && (
            <button
              onClick={onClose}
              className="border border-gray-300 text-gray-700 px-4 py-1.5 rounded text-sm hover:bg-gray-100"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm}
            className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertDialog;

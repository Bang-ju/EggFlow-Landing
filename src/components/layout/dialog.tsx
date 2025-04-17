import { useEffect } from "react";
import { BlueButton } from "../ui/button";

interface DialogProps {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  title?: string;
}

export const Dialog = ({ children, isOpen, setIsOpen, title }: DialogProps) => {
  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-[#00000080] z-50"
      // onClick={handleClose}
    >
      <div
        className="bg-white rounded-[4px] flex flex-col min-w-[300px] max-w-[450px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-row justify-between bg-[#F8FAFC] border-b border-border p-4 rounded-t-[4px] font-bold">
          {title}
        </div>
        <div className="bg-white border-b border-border p-4">{children}</div>
        <div className="flex flex-row gap-4 p-4 bg-[#F8FAFC] rounded-b-[4px] justify-end">
          <div className="flex flex-row justify-between gap-2">
            {/* <GrayButton onClick={handleClose}>취소</GrayButton> */}
            <BlueButton onClick={handleClose}>확인</BlueButton>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect } from "react";

interface DialogProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const Dialog: React.FC<DialogProps> = ({
  children,
  open,
  onOpenChange,
}) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-[#00000080] z-50"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-white rounded-lg flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogContent: React.FC<DialogContentProps> = ({
  children,
  className = "",
}) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

interface DialogHeaderProps {
  children: React.ReactNode;
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({ children }) => {
  return <div className="mb-4">{children}</div>;
};

interface DialogTitleProps {
  children: React.ReactNode;
}

export const DialogTitle: React.FC<DialogTitleProps> = ({ children }) => {
  return <h2 className="text-xl font-bold">{children}</h2>;
};

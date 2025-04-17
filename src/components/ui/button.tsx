import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

const BlueButton = ({
  children,
  onClick,
  type = "button",
  className,
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`px-[14px] py-[8px] bg-[#2563EB] text-white rounded-[4px] cursor-pointer hover:bg-[#1E40AF] ${
        className || ""
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const RedButton = ({
  children,
  onClick,
  type = "button",
  className,
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`px-[14px] py-[8px] bg-[#DC2626] text-white rounded-[4px] cursor-pointer hover:bg-[#B91C1C] ${
        className || ""
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const GreenButton = ({
  children,
  onClick,
  type = "button",
  className,
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`px-[14px] py-[8px] bg-[#16A34A] text-white rounded-[4px] cursor-pointer hover:bg-[#15803D] ${
        className || ""
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const GrayButton = ({
  children,
  onClick,
  type = "button",
  className,
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`px-[14px] py-[8px] bg-white text-[#262626] rounded-[4px] cursor-pointer hover:bg-[#FAFAFA] border border-border ${
        className || ""
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
export { BlueButton, RedButton, GreenButton, GrayButton };

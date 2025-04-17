import React, { useState, useRef, useEffect } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "선택하세요",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<
    SelectOption | undefined
  >(options.find((option) => option.value === value));
  const selectRef = useRef<HTMLDivElement>(null);

  // 외부 클릭시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // value prop이 변경되면 선택된 옵션 업데이트
  useEffect(() => {
    setSelectedOption(options.find((option) => option.value === value));
  }, [value, options]);

  const handleOptionClick = (option: SelectOption) => {
    setSelectedOption(option);
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      <div
        className="flex items-center justify-between border border-gray-300 rounded-[4px] px-3 py-2 cursor-pointer bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={
            (selectedOption ? "text-gray-900" : "text-gray-500") + " text-sm"
          }
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-[4px] shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <li
              key={option.value}
              className={`px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm ${
                selectedOption?.value === option.value
                  ? "bg-blue-50 text-blue-500"
                  : ""
              }`}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

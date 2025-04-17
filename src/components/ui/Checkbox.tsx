import React from "react";

// type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
//   // 추가 props가 필요하면 여기에 정의합니다.
// };

// CheckboxProps를 React.ComponentPropsWithoutRef<'input'> 로 변경하여 ref를 제외한 모든 input 속성을 받도록 함
type CheckboxProps = Omit<React.ComponentPropsWithoutRef<"input">, "type"> & {
  // 추가 props 정의 가능
};

// React.forwardRef 사용하여 ref 전달 가능하도록 변경
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref} // 전달받은 ref 사용
        type="checkbox"
        className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${className}`}
        {...props}
      />
    );
  }
);

// displayName 추가 (React 개발 도구에서 식별 용이)
Checkbox.displayName = "Checkbox";

export default Checkbox;

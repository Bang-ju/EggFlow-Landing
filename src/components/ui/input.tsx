interface InputProps {
  type: string;
  placeholder?: string;
  value?: string | number;
  className?: string;
  active?: boolean;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  id?: string;
  required?: boolean;
}

export const Input = ({
  type,
  placeholder,
  value,
  onChange,
  className,
  active,
  name,
  readOnly = false,
  id,
  required,
}: InputProps) => {
  return (
    <input
      id={id}
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`px-3 py-2 border border-border rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
        active ? "border-blue-500" : ""
      } ${readOnly ? "bg-[#F4F4F4]" : "bg-white"} ${className || ""}`}
      readOnly={readOnly}
      required={required}
    />
  );
};

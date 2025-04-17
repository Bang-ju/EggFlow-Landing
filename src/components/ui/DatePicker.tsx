export const DatePicker = ({
  className,
  value,
  onChange,
}: {
  className?: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div
      className={`${className} flex items-center border border-border rounded-[4px] w-[140px] px-3 py-2`}
    >
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm text-[#262626] outline-none w-full"
      />
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
          stroke="#1E1E1E"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useId } from "react";

interface CustomToggleProps {
  label?: string;
  className?: string;
  required?: boolean;
  checked?: boolean;
  onChange?: (value: boolean) => void;
}

export default function CustomToggle({
  className = "",
  label,
  required,
  checked,
  onChange,
}: CustomToggleProps) {
  const id = useId();

  return (
    <div className={`flex items-center gap-1 mb-3 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="w-[250px] shrink-0 text-right text-sm text-gray-700"
        >
          {label}
          {required && (
            <span className="text-[#d15b47] inline-block ml-1">(*)</span>
          )}
        </label>
      )}

      <label
        htmlFor={id}
        className="relative inline-flex items-center cursor-pointer h-6 w-12 rounded-full overflow-hidden"
      >
        <input
          type="checkbox"
          id={id}
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
        />

        <span className="absolute inset-0 bg-[#888888] peer-checked:bg-[#ffb752] transition-colors duration-300 ease-in-out" />

        <span
          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow z-10
                     transition-all duration-300 ease-in-out
                     peer-checked:left-[26px]"
        />

        <div className="absolute top-0.5 left-0.5 w-5 h-5 flex items-center justify-center text-white">
          <FaCheck size={13} />
        </div>
        <div className="absolute top-0.5 left-[26px] w-5 h-5 flex items-center justify-center text-white">
          <IoClose size={15} />
        </div>
      </label>
    </div>
  );
}

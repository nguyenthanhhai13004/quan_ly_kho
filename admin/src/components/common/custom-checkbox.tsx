import { FaCheck } from "react-icons/fa";

interface CustomCheckboxProps {
  id?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export default function CustomCheckbox({
  id = "custom-checkbox",
  checked,
  onChange,
  label,
  className = "",
  disabled = false,
}: CustomCheckboxProps) {
  return (
    <div className="inline-flex items-center gap-2">
      <label className="flex items-center cursor-pointer relative">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`peer h-5 w-5 cursor-pointer transition-all appearance-none
                      shadow hover:shadow-md border border-slate-300
                      focus:border-[#ffb752] hover:border-[#ffb752]
                      disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        />
        <span
          className="absolute text-[#2b7dbc] opacity-0 peer-checked:opacity-100 
                         top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                         pointer-events-none"
        >
          <FaCheck size={14} />
        </span>
      </label>
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </div>
  );
}

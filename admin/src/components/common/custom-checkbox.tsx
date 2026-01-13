import { FaCheck } from "react-icons/fa";

interface CustomCheckboxProps {
  id?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  value?: string | number;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: React.ReactNode;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  containerClassName?: string;
  disabled?: boolean;
}


export default function CustomCheckbox({
  id,
  checked,
  defaultChecked,
  value,
  name,
  onChange,
  label,
  className = "",
  inputClassName = "",
  labelClassName = "",
  containerClassName = "",
  disabled = false,
}: CustomCheckboxProps) {
  const computedId = id || `checkbox-${Math.random()}`;

  return (
    <div className={`inline-flex items-center gap-2 ${containerClassName}`}>
      <label className={`flex items-center cursor-pointer relative ${labelClassName}`} htmlFor={computedId}>
        <input
          id={computedId}
          type="checkbox"
          name={name}
          value={value}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          disabled={disabled}
          className={`peer h-5 w-5 cursor-pointer transition-all appearance-none
            shadow hover:shadow-md border border-slate-300
            focus:border-[#ffb752] hover:border-[#ffb752]
            disabled:cursor-not-allowed disabled:opacity-50
            ${className} ${inputClassName}`}
        />

        <span
          className="absolute text-[#2b7dbc] opacity-0 peer-checked:opacity-100 
                     top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     pointer-events-none"
        >
          <FaCheck size={14} />
        </span>
      </label>

      {label && <div className="text-sm text-gray-700">{label}</div>}
    </div>
  );
}


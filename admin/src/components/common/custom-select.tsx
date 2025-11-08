import React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface CustomSelectProps extends React.InputHTMLAttributes<HTMLSelectElement>{
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  required?: boolean;
  options: { label: string; value: string | number }[];
  labelType?: "normal" | "top";
  multiple?: boolean;
  register?: UseFormRegisterReturn;
  error?: string;
  disabled?:boolean
}

export default function CustomSelect({
  label,
  placeholder,
  value,
  onChange,
  options,
  className = "",
  required = false,
  labelType = "normal",
  multiple = false,
  register,
  error,
  disabled,
  ...rest
}: CustomSelectProps) {
  return (
    <div className={`flex items-center relative gap-1 ${className}`}>
      {label &&
        (labelType == "top" ? (
          <label className="inline-block absolute text-xs bg-[#F5F4F9] text-black top-[-25%] px-1 z-10 left-1 rounded-t">
            {label}
            {required && (
              <span className="text-[#d15b47] inline-block ml-1">(*)</span>
            )}
          </label>
        ) : (
          <label className="text-right text-sm shrink-0 text-gray-700">
            {label}
            {required && (
              <span className="text-[#d15b47] inline-block ml-1">(*)</span>
            )}
          </label>
        ))}
      <select
        disabled={disabled}
        defaultValue=""
        value={value}
        multiple={multiple}
        onChange={onChange}
        required={required}
        className={` border border-gray-300 bg-[#F5F4F9] p-2 outline-none text-sm text-black cursor-pointer rounded
                   focus:border-[#2F7BFF] hover:border-gray-400 ${disabled ? "text-gray-300":""} ${className}`}
        {...register}
        {...rest}
      >
        {
          placeholder && (<option value="">{placeholder}</option>)
        }
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-400 ml-1">{error}</span>}
    </div>
  );
}

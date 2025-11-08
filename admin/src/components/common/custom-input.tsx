import React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  required?: boolean;
  icon?: React.ReactNode;
  register?: UseFormRegisterReturn;
  error?: string;
  labelType?: "normal" | "top";
  disabled?:boolean
}

export default function CustomInput({
  label,
  placeholder = "Nhập thông tin...",
  type = "text",
  value,
  onChange,
  required = false,
  className = "",
  icon,
  register,
  error,
  labelType = "normal",
  disabled,
  ...rest
}: CustomInputProps) {
  return (
    <div>
      <div className="flex items-center gap-1 relative">
        {label &&
          (labelType == "top" ? (
            <label className="inline-block rounded-2xl absolute text-xs bg-[#F5F4F9] text-gray-700 top-[-25%] px-2 z-10 left-0">
              {label}
              {required && (
                <span className="text-[#d15b47] inline-block ml-1">(*)</span>
              )}
            </label>
          ) : (
            <label className="text-sm shrink-0 text-gray-700">
              {label} :
              {required && (
                <span className="text-[#d15b47] inline-block ml-1">(*)</span>
              )}
            </label>
          ))}
        <div className="border border-gray-300 bg-[#F5F4F9] flex items-center w-full relative rounded-2xl">
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`w-full p-2 outline-none text-black text-sm
                   focus:border-[#ffb752] hover:border-gray-400 ${disabled && "text-gray-400"} ${className}`}
            disabled={disabled}
            {...register}
            {...rest}
          />
          {icon && <div className="ml-2 text-[#585858] pr-2">{icon}</div>}
        </div>
      </div>
      {error && <span className="text-xs text-red-400 ml-1">{error}</span>}
    </div>
  );
}

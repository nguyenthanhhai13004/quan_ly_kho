import React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface CustomTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  required?: boolean;
  register?: UseFormRegisterReturn;
  error?: string;
  labelType?: "normal" | "top";
  disabled?: boolean;
  rows?: number;
}

export default function CustomTextarea({
  label,
  placeholder = "Nhập nội dung...",
  value,
  onChange,
  required = false,
  className = "",
  register,
  error,
  labelType = "normal",
  disabled = false,
  rows = 4,
  ...rest
}: CustomTextareaProps) {
  return (
    <div>
      <div className="flex items-start gap-1 relative">
        {label &&
          (labelType === "top" ? (
            <label className="inline-block rounded-2xl absolute text-xs bg-[#F5F4F9] text-gray-700 top-[-10%] px-2 z-10 left-0">
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

        <div className="border border-gray-300 bg-[#F5F4F9] w-full relative rounded-2xl">
          <textarea
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            rows={rows}
            className={`w-full p-2 outline-none text-black text-sm resize-none 
              focus:border-[#ffb752] hover:border-gray-400 rounded-2xl 
              ${disabled && "text-gray-400"} ${className}`}
            disabled={disabled}
            {...register}
            {...rest}
          />
        </div>
      </div>
      {error && <span className="text-xs text-red-400 ml-1">{error}</span>}
    </div>
  );
}

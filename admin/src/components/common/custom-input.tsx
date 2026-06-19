import React, { forwardRef } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import CustomDatePicker from "./custom-date-picker";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  required?: boolean;
  icon?: React.ReactNode;
  register?: UseFormRegisterReturn;
  error?: string;
  labelType?: "normal" | "top";
  disabled?: boolean;
  width?: string | number;
  height?: string | number;
  containerClassName?: string;
  style?: React.CSSProperties;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  function CustomInput(
    {
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
      width,
      height,
      containerClassName = "",
      style,
      ...rest
    },
    ref
  ) {
    const isDate = type === "date";
    const inputClassName = `w-full p-2 outline-none text-black text-sm rounded-2xl bg-transparent ${disabled ? "text-gray-400" : ""} ${className}`;

    // Merge register and manual props if register is passed as a prop
    const mergedProps = register ? { ...register, ...rest } : rest;

    // Extract ref, onChange, onBlur from mergedProps or use direct props
    const finalRef = ref || (mergedProps as any).ref;
    const finalOnChange = onChange || (mergedProps as any).onChange;
    const finalOnBlur = (mergedProps as any).onBlur;
    const finalName = rest.name || mergedProps.name;

    return (
      <div className={containerClassName}>
        <div className="flex items-center gap-1 relative">
          {label &&
            (labelType === "top" ? (
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

          <div
            className="border border-gray-300 bg-[#F5F4F9] flex items-center relative rounded-2xl w-full"
            style={{
              width,
              height,
              minWidth: isDate ? (width ? undefined : "140px") : undefined,
              ...style,
            }}
          >
            {isDate ? (
              <CustomDatePicker
                ref={finalRef}
                value={value}
                onChange={finalOnChange}
                onBlur={finalOnBlur}
                disabled={disabled}
                name={finalName}
                className={inputClassName}
                placeholder="dd/mm/yyyy"
              />
            ) : (
              <input
                ref={finalRef}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={finalOnChange}
                className={inputClassName}
                disabled={disabled}
                {...mergedProps}
              />
            )}
          </div>
        </div>

        {error && <span className="text-xs text-red-400 ml-1">{error}</span>}
      </div>
    );
  }
);

export default CustomInput;
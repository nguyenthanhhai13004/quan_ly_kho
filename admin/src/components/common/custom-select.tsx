import React, { useEffect, useMemo, useRef, useState } from "react";
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
  customDropdown?: boolean;
  searchable?: boolean;
  maxMenuHeightClassName?: string;
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
  customDropdown = false,
  searchable = false,
  maxMenuHeightClassName = "max-h-64",
  ...rest
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(
    (opt) => String(opt.value) === String(value ?? ""),
  );
  const filteredOptions = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    if (!normalizedKeyword) return options;

    return options.filter((opt) =>
      opt.label.toLowerCase().includes(normalizedKeyword),
    );
  }, [keyword, options]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleOptionSelect = (nextValue: string | number) => {
    onChange?.({
      target: {
        value: String(nextValue),
        name: rest.name,
      },
    } as React.ChangeEvent<HTMLSelectElement>);
    setIsOpen(false);
    setKeyword("");
  };

  const shouldUseCustomDropdown =
    (customDropdown || searchable) && !register && !multiple;

  return (
    <div ref={wrapperRef} className="flex items-center relative gap-1 w-full">
      {label &&
        (labelType == "top" ? (
          <label className="inline-block absolute text-xs bg-[#F5F4F9] text-black top-[-10px] px-1 z-10 left-1 rounded-t">
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
      {shouldUseCustomDropdown ? (
        <div className="relative w-full">
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              if (!disabled) setIsOpen((prev) => !prev);
            }}
            className={`w-full border border-gray-300 bg-[#F5F4F9] p-2 outline-none text-left text-sm text-black cursor-pointer rounded-2xl
                   focus:border-[#2F7BFF] hover:border-gray-400 ${disabled ? "text-gray-300":""} ${className}`}
          >
            <span className={!selectedOption ? "text-gray-500" : ""}>
              {selectedOption?.label || placeholder || ""}
            </span>
          </button>

          {isOpen && (
            <div
              className={`absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-gray-200 bg-white text-sm shadow-lg`}
            >
              {searchable && (
                <div className="border-b border-gray-100 bg-white p-2">
                  <input
                    autoFocus
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.preventDefault();
                      if (e.key === "Escape") setIsOpen(false);
                    }}
                    className="w-full rounded-md border border-gray-200 px-2 py-1 outline-none focus:border-[#2F7BFF]"
                  />
                </div>
              )}
              <div className={`${maxMenuHeightClassName} overflow-y-auto py-1`}>
                {placeholder && (
                  <button
                    type="button"
                    className="block w-full px-3 py-2 text-left hover:bg-[#EEF4FF]"
                    onClick={() => handleOptionSelect("")}
                  >
                    {placeholder}
                  </button>
                )}
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      className={`block w-full px-3 py-2 text-left hover:bg-[#EEF4FF] ${
                        String(opt.value) === String(value ?? "")
                          ? "bg-[#DCEAFF] text-[#1F64D8]"
                          : ""
                      }`}
                      onClick={() => handleOptionSelect(opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-gray-500">Không có dữ liệu</div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <select
          disabled={disabled}
          defaultValue=""
          value={value}
          multiple={multiple}
          onChange={onChange}
          required={required}
          className={`w-full border border-gray-300 bg-[#F5F4F9] p-2 outline-none text-sm text-black cursor-pointer rounded-2xl
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
      )}
      {error && <span className="text-xs text-red-400 ml-1">{error}</span>}
    </div>
  );
}

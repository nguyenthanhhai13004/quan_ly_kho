import React, { type ReactNode } from "react";

export type Variant = "info" | "warming" | "danger" | "success" | "default";
type Size = "xs" | "sm" | "md" | "lg";

export interface ICustomButtonProps {
  label?: string;
  icon?: ReactNode;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  children?: ReactNode;
}

export default function CustomButton({
  label,
  icon,
  variant = "info",
  size = "xs",
  disabled = false,
  isLoading = false,
  onClick,
  className = "",
  type = "button",
  children,
}: ICustomButtonProps) {
  const base =
    "inline-flex items-center whitespace-nowrap border-b-1 border-gray-300 justify-center gap-1 font-medium rounded-xl transition-colors duration-200 focus:outline-none";
  const variantMap: Record<Variant, string> = {
    info: "bg-[#2F7BFF] text-white hover:bg-[#2F7BFF]/80",
    warming: "bg-[#FFAE43] text-white hover:bg-[#FFAE43]/80",
    danger: "bg-[#FF414B] text-white hover:bg-[#FF414B]/80",
    success: "bg-[#4BD670] text-white hover:bg-[#4BD670]/80",
    default:"bg-white text-[#AAADAD]"
  };
  const sizeMap: Record<Size, string> = {
    xs: "px-2 py-2 text-xs",
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-2 text-lg",
  };

  const busy = disabled || isLoading;

  const classes = `${base} relative ${variantMap[variant]} ${sizeMap[size]} ${
    busy ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
  } ${className}`.trim();

  return (
    <button
      type={type}
      onClick={busy ? undefined : onClick}
      disabled={busy}
      aria-busy={isLoading ? true : undefined}
      className={classes}
    >
      {isLoading ? (
        <span
          className="inline-block w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"
          aria-hidden="true"
        />
      ) : icon ? (
        <span className="w-4 h-4 flex items-center justify-center">{icon}</span>
      ) : null}

      <span>{label}</span>
      {children}
    </button>
  );
}

import { type ReactNode } from "react";
import type { Variant } from "./custom-button";

interface CustomIconProps {
  icon: ReactNode;
  label: string;
  className?: string;
  variant?: Variant;
  onClick?:(e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function CustomIcon({
  onClick,
  icon,
  label,
  className = "",
  variant = "default"
}: CustomIconProps) {
  const variantMap: Record<Variant, string> = {
    info: "text-[#2F7BFF]",
    warming: "text-[#FFAE43]",
    danger: "text-[#FF414B]",
    success: "text-[#4BD670]",
    default:"text-[#AAADAD]"
  };
  return (
    <div
      className={`relative group inline-flex flex-col items-center ${variantMap[variant]} ${className}`}
    >
      <button onClick={onClick} className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
        {icon}
      </button>

      <div
        className="
          absolute top-full mt-1 px-2 py-1 text-xs text-white bg-gray-800 rounded-md 
          opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 
          transition-all duration-200 pointer-events-none z-100 whitespace-nowrap
        "
      >
        {label}
      </div>
    </div>
  );
}

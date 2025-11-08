import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

interface SidebarItemProps {
  icon: ReactNode;
  path: string;
  label: string;
}

export default function SidebarItemCollapsed({
  icon,
  label,
  path,
}: SidebarItemProps) {
  return (
    <NavLink
      to={path}
      end
      className={({ isActive }) =>
        `relative group flex items-center justify-center w-10 h-10 rounded mb-2 transition-colors
        ${isActive ? "bg-white text-black" : "hover:bg-white/30 text-white"}`
      }
    >
      <div className="text-xl">{icon}</div>

      <div
        className="absolute left-full ml-2 opacity-0 group-hover:opacity-100
        bg-gray-900 text-white text-xs font-medium py-1 px-2 rounded shadow-md
        whitespace-nowrap transition-all duration-150"
      >
        {label}
      </div>
    </NavLink>
  );
}

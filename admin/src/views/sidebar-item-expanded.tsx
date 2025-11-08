import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

interface SidebarItemProps {
  icon: ReactNode;
  path: string;
  label: string;
}
export default function SidebarItemExpanded({
  icon,
  label,
  path,
}: SidebarItemProps) {
  return (
    <NavLink
      to={path}
      end
      className={({ isActive }) =>
        `flex gap-2 items-center p-2 rounded mb-1 transition-colors ${
          isActive
            ? "bg-white text-black"
            : "hover:bg-white/50 hover:text-black text-white"
        }`
      }
    >
      <div className="w-8 h-8 flex items-center justify-center">{icon}</div>
      <span className="inline-block">{label}</span>
    </NavLink>
  );
}


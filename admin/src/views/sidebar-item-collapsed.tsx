import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import type { SidebarChildItem } from "./sidebar-item-expanded";

interface SidebarItemProps {
  icon: ReactNode;
  path: string;
  label: string;
  children?: SidebarChildItem[];
}

export default function SidebarItemCollapsed({
  icon,
  label,
  path,
  children = [],
}: SidebarItemProps) {
  const hasChildren = children.length > 0;
  const isParentActive =
    location.pathname === path ||
    children.some((item) => location.pathname.startsWith(item.path));
  return (
    <>
      {hasChildren ? (
        <div
          className={`relative group flex items-center justify-center w-10 h-10 rounded mb-2 transition-colors
        ${isParentActive ? "bg-white text-black" : "hover:bg-white/30 text-white"}`}
        >
          <div className="text-xl">{icon}</div>
          <div
            className="absolute left-full ml-2 opacity-0 group-hover:opacity-100
        bg-black text-white text-xs font-medium py-2 px-3 shadow-lg top-0 z-100 border-l border-gray-500
        whitespace-nowrap transition-all duration-150"
          >
            <span className="pb-1 px-2 font-bold border-b border-gray-200 mb-3 inline-block">{label}</span>
            {children.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `px-2 py-1 rounded mb-1 block ${
                    isActive
                      ? "bg-white text-black"
                      : "text-white hover:bg-white/50 hover:text-black"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      ) : (
        <NavLink
          to={path}
          end
          className={({ isActive }) =>
            `relative group flex items-center justify-center w-10 h-10 rounded mb-2 transition-colors
        ${isActive || isParentActive ? "bg-white text-black" : "hover:bg-white/30 text-white"}`
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
      )}
    </>
  );
}

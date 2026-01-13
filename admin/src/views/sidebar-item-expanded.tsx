import { useState, type ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

export interface SidebarChildItem {
  label: string;
  path: string;
}

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  path?: string;
  children?: SidebarChildItem[];
  onNavigate?: () => void;
}

export default function SidebarItemExpanded({
  icon,
  label,
  path = "#",
  children = [],
  onNavigate,
}: SidebarItemProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const hasChildren = children.length > 0;

  const isParentActive =
    location.pathname === path ||
    children.some((item) => location.pathname.startsWith(item.path));

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isParentActive) setOpen(true);
  }, [isParentActive]);

  const handleParentClick = () => {
    navigate(path);
    onNavigate?.(); 
  };

  const handleChildClick = (childPath: string) => {
    navigate(childPath);
    onNavigate?.(); 
  };

  return (
    <div className="mb-1">
      {!hasChildren ? (
        <div
          onClick={handleParentClick}
          className={`flex gap-2 items-center p-2 rounded cursor-pointer transition-colors ${
            isParentActive
              ? "bg-white text-black"
              : "text-white hover:bg-white/50 hover:text-black"
          }`}
        >
          {icon}
          {label}
        </div>
      ) : (
        <div>
          <div
            onClick={() => setOpen(!open)}
            className={`flex justify-between gap-2 items-center p-2 rounded cursor-pointer transition-colors ${
              isParentActive
                ? "bg-white text-black"
                : "text-white hover:bg-white/50 hover:text-black"
            }`}
          >
            <div className="flex gap-2 items-center">
              {icon}
              {label}
            </div>

            {open ? <BiChevronUp /> : <BiChevronDown />}
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              open ? "max-h-[500px] opacity-100 mt-3" : "max-h-0 opacity-0 mt-0"
            }`}
          >
            <div className="flex flex-col ml-5 pl-5 border-l">
              {children.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleChildClick(item.path)}
                  className={`px-2 py-1 rounded mb-1 cursor-pointer transition-colors ${
                    location.pathname.startsWith(item.path)
                      ? "bg-white text-black"
                      : "text-white hover:bg-white/50 hover:text-black"
                  }`}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

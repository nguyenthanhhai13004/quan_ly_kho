import type React from "react";
import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  icon?: React.ReactNode;
  path: string;
}

interface CustomBreadcrumbsProps {
  breadcrumbs: BreadcrumbItem[];
}

export default function CustomBreadcrumbs({
  breadcrumbs,
}: CustomBreadcrumbsProps) {
  return (
    <div className="px-5 py-2 w-full bg-white border-b border-gray-300 mb-3 rounded">
      <div className="flex items-center gap-1 text-sm">
        {breadcrumbs.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            {item.icon && (
              <div className="text-black font-medium w-6 h-6 flex justify-start items-center">
                {item.icon}
              </div>
            )}
            <span
              className={`${item.path ? "text-black" : "text-[#585858]"}`}
            >
              {index === breadcrumbs.length - 1 ? (
                item.label
              ) : (
                <>
                  <Link className="hover:underline" to={item.path}>{item.label}</Link>{" "}
                  <span className="text-[#585858]">{">"}</span>
                </>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

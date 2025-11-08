import type React from "react";

type CustomStatisticPanelProps = {
  children: React.ReactNode;
  icon?: React.ReactNode;
  title: string;
  columns?: number;
};
export default function CustomStatisticPanel({
  children,
  title,
  columns = 2,
  icon,
}: CustomStatisticPanelProps) {
  return (
    <div className="border border-gray-300">
      <div className="px-2 py-1 flex items-center bg-gray-200">
        {icon && (
          <div className="h-5 w-5 flex items-center justify-center mr-2">
            {icon}
          </div>
        )}
        <h5 className="font-medium text-sm">{title}</h5>
      </div>
      <div className={`p-2 grid grid-cols-${columns} gap-2`}>{children}</div>
    </div>
  );
}

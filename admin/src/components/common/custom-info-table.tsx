import React from "react";

interface CustomInfoTableProps {
  data: { label: string; value: string | number | React.ReactNode }[];
  className?: string;
}

export default function CustomInfoTable({
  data,
  className,
}: CustomInfoTableProps) {
  return (
    <div
      className={`grid grid-cols-1 border border-gray-300 text-sm ${className || ""}`}
    >
      {data.map((item, idx) => (
        <div key={idx} className="flex border-b border border-gray-300">
          <span className="font-medium w-[33%] p-1 bg-gray-200">{item.label}</span>
          <span className="p-1 w-[67%]">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

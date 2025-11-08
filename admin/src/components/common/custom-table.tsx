import type React from "react";
import { useAppProvider } from "../../providers/app-providers";
import CustomPagination from "./custom-pagination";
import CustomIcon from "./custom-icon";
import { BiFilter } from "react-icons/bi";
import CustomDrawer from "./custom-drawer";
import clsx from "clsx";

interface CustomTableProps {
  columns: React.ReactNode[];
  data: React.ReactNode[][];
  maxHeight?: string;
  className?: string;
  striped?: boolean;
  width?: string | number;
  totalPages?: number;
  currentPage?: number;
  filter?: React.ReactNode;
  title?: string;
  onPageChange?: (page: number) => void;
  isOpenDrawer?: boolean;
  onDrawer?: () => void;
}
export default function CustomTable({
  columns,
  data,
  maxHeight = "800px",
  className = "",
  striped = false,
  width,
  totalPages = 1,
  filter,
  title,
  currentPage = 1,
  isOpenDrawer,
  onDrawer,
  onPageChange,
}: CustomTableProps) {
  const { toggle } = useAppProvider();
  const widthClass = width
    ? typeof width === "number"
      ? `lg:w-[${width}px]`
      : `lg:w-[${width}]`
    : !toggle
      ? "lg:w-[calc(100vw-250px-2.5rem)]"
      : "lg:w-[calc(100vw-50px-2.5rem)]";
  return (
    <div
      style={{ maxHeight}}
      className={clsx("overflow-auto p-3 pt-5 bg-white rounded-2xl",widthClass,"w-full")}
    >
      <div className="flex lg:justify-between items-center mb-3">
        {title && <h4 className="text-xl">{title}</h4>}
        <div className="gap-2 items-center">
          {onDrawer && (
            <CustomIcon
              onClick={onDrawer}
              className="lg:hidden inline-block"
              label="Bộ lọc"
              icon={<BiFilter />}
            />
          )}
          <div className="lg:flex hidden lg:flex-row flex-col gap-2 h-8 items-center mb-3">
            {filter}
          </div>
        </div>
      </div>
      <table
        className={`w-full border border-gray-300 bg-white border-collapse text-sm mb-3 ${className}`}
      >
        <thead className="bg-[#EDF9FD] text-sm">
          {columns.map((col, index) => (
            <th
              key={index}
              className="border border-gray-300 px-2 py-3 whitespace-nowrap"
            >
              <div className="flex gap-2 items-center text-black">
                <span>{col}</span>
              </div>
            </th>
          ))}
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              className={`${
                striped && rowIndex % 2 === 0 ? "bg-[#f5f5f5]" : ""
              }`}
              key={rowIndex}
            >
              {row.map((cell, colIndex) => (
                <td
                  key={colIndex}
                  className="border border-gray-300 px-2 py-1 whitespace-nowrap text-[#A0A0A0]"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && onPageChange && (
        <div className="flex justify-center">
          <CustomPagination
            currentPage={currentPage}
            onPageChange={onPageChange}
            totalPages={totalPages}
            maxVisible={5}
          />
        </div>
      )}
      <div>
        {onDrawer && isOpenDrawer && (
          <CustomDrawer
            className="lg:hidden block"
            onClose={onDrawer}
            open={isOpenDrawer}
          >
            <div className="lg:hidden grid grid-cols-2 gap-2 h-8 items-center mb-3">
              {filter}
            </div>
          </CustomDrawer>
        )}
      </div>
    </div>
  );
}

import type React from "react";
import { useAppProvider } from "../../providers/app-providers";
import CustomPagination from "./custom-pagination";
import CustomIcon from "./custom-icon";
import { BiFilter } from "react-icons/bi";
import CustomDrawer from "./custom-drawer";
import clsx from "clsx";
import CustomCheckbox from "./custom-checkbox";

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
  size?: "small" | "medium" | "large";
  showCheckbox?: boolean;
  checkboxHeader?: React.ReactNode;
  onCheckboxChange?: (checked: boolean, rowIndex: number, data?: any) => void;
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
  showCheckbox = false,
  checkboxHeader,
  size = "medium",
  onCheckboxChange,
}: CustomTableProps) {
  const { toggle } = useAppProvider();

  const sizeWidthMap: Record<string, string> = {
    small: "w-full thin-scroll",
    medium: "w-full",
    large: "w-full",
  };

  const widthClass = width
    ? typeof width === "number"
      ? `lg:w-[${width}px]`
      : `lg:w-[${width}]`
    : size
      ? sizeWidthMap[size] || sizeWidthMap.medium
      : !toggle
        ? "lg:w-[calc(100vw-250px-2.5rem)]"
        : "lg:w-[calc(100vw-50px-2.5rem)]";

  const sizePaddingMap: Record<string, string> = {
    small: "px-1 py-1 text-xs",
    medium: "px-2 py-2 text-sm",
    large: "px-4 py-3 text-base",
  };

  const cellClass = sizePaddingMap[size] || sizePaddingMap.medium;

  return (
    <div
      style={{ maxHeight }}
      className={clsx(
        "overflow-auto p-3 pt-5 bg-white rounded-2xl",
        `${size !== "small" && "min-h-[500px]"}`,
        widthClass,
        "w-full",
      )}
    >
      <div className="flex lg:justify-between items-center mb-5">
        {title && <h4 className="text-sm lg:inline-block hidden whitespace-nowrap mr-2">{title}</h4>}
        <div className="gap-2 items-center">
          {/* {onDrawer && (
            <CustomIcon
              onClick={onDrawer}
              className="lg:hidden inline-block"
              label="Bộ lọc"
              icon={<BiFilter />}
            />
          )} */}
          {filter && filter}
        </div>
      </div>

      {/* Table */}
      <table
        className={`w-full border border-gray-300 bg-white border-collapse mb-3 ${className}`}
      >
        <thead className="bg-[#EDF9FD]">
          <tr>
            {showCheckbox && (
              <th
                className={`border border-gray-300 whitespace-nowrap ${cellClass}`}
              >
                <div className="flex gap-2 items-center text-black">
                  {checkboxHeader || <input type="checkbox" />}
                </div>
              </th>
            )}
            {columns.map((col, index) => (
              <th
                key={index}
                className={`border border-gray-300 whitespace-nowrap ${cellClass}`}
              >
                <div className="flex gap-2 items-center text-black">
                  <span>{col}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && <p>Không có dữ liệu</p>}
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={striped && rowIndex % 2 === 0 ? "bg-[#f5f5f5]" : ""}
            >
              {showCheckbox && (
                <td
                  className={`border border-gray-300 whitespace-nowrap text-[#A0A0A0] ${cellClass}`}
                >
                  <CustomCheckbox
                    onChange={(e) => {
                      onCheckboxChange &&
                        onCheckboxChange(e.target.checked, rowIndex, row);
                    }}
                  />
                </td>
              )}
              {row.map((cell, colIndex) => (
                <td
                  key={colIndex}
                  className={`border border-gray-300 whitespace-nowrap text-[#A0A0A0] ${cellClass}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
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

      {/* Drawer for mobile filter */}
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
  );
}

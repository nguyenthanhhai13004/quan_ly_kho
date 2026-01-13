import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

interface CustomPaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  maxVisible?: number;
}

export default function CustomPagination({
  totalPages,
  currentPage,
  onPageChange,
  maxVisible = 5,
}: CustomPaginationProps) {
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  return (
    <div className="flex text-sm select-none">
      <div
        className={`hover:bg-gray-100 w-8 h-8 flex justify-center rounded items-center border mr-1 cursor-pointer
        ${currentPage === 1 ? "opacity-40 cursor-not-allowed bg-[#efefef] text-[#777777]" : "bg-white text-[#337ab7]"}`}
        onClick={() => goToPage(1)}
      >
        <MdKeyboardDoubleArrowLeft />
      </div>

      <div
        className={`hover:bg-gray-100 w-8 h-8 flex justify-center rounded items-center border mr-1 cursor-pointer
        ${currentPage === 1 ? "opacity-40 cursor-not-allowed bg-[#efefef] text-[#777777]" : "bg-white text-[#337ab7]"}`}
        onClick={() => goToPage(currentPage - 1)}
      >
        <MdKeyboardArrowLeft />
      </div>

      {pages.map((page) => (
        <div
          key={page}
          onClick={() => goToPage(page)}
          className={`w-8 h-8 flex justify-center rounded items-center border mr-1 cursor-pointer 
            ${
              page == currentPage
                ? "bg-[#337ab7] text-white"
                : "bg-white text-[#337ab7] hover:bg-gray-100"
            }`}
        >
          {page}
        </div>
      ))}

      {end < totalPages && (
        <>
          <div className="w-8 h-8 flex justify-center rounded items-center text-gray-500">
            …
          </div>
          <div
            onClick={() => goToPage(totalPages)}
            className="hover:bg-gray-100 w-8 h-8 flex justify-center items-center border mr-1 cursor-pointer bg-white text-[#337ab7]"
          >
            {totalPages}
          </div>
        </>
      )}

      <div
        className={`hover:bg-gray-100 w-8 h-8 flex justify-center rounded items-center border mr-1 cursor-pointer
        ${currentPage === totalPages ? "opacity-40 cursor-not-allowed bg-[#efefef] text-[#777777]" : "bg-white text-[#337ab7]"}`}
        onClick={() => goToPage(currentPage + 1)}
      >
        <MdKeyboardArrowRight />
      </div>

      <div
        className={`hover:bg-gray-100 w-8 h-8 flex justify-center rounded items-center border mr-1 cursor-pointer
        ${currentPage === totalPages ? "opacity-40 cursor-not-allowed bg-[#efefef] text-[#777777]" : "bg-white text-[#337ab7]"}`}
        onClick={() => goToPage(totalPages)}
      >
        <MdKeyboardDoubleArrowRight />
      </div>
    </div>
  );
}

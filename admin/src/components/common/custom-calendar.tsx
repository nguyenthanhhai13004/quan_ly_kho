// import { DayPicker } from "react-day-picker";
// import { format } from "date-fns";
// import { vi } from "date-fns/locale";
// import { useEffect, useRef, useState } from "react";
// import "react-day-picker/dist/style.css";
// import { createPortal } from "react-dom";

// interface CustomCalendarProps {
//   value?: string;
//   name?: string;
//   onChange: (value: string) => void;
//   onClose: () => void;
//   position: { top: number; left: number };
// }

// export default function CustomCalendar({
//   value,
//   onChange,
//   onClose,
//   position,
// }: CustomCalendarProps) {
//   const ref = useRef<HTMLDivElement>(null);

//   const parseDate = (v?: string) => {
//     if (!v) return undefined;
//     const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
//     if (!m) return undefined;
//     const [_, y, mm, dd] = m.map(Number);
//     return new Date(y, mm - 1, dd);
//   };

//   const selected = parseDate(value);
//   const [displayMonth, setDisplayMonth] = useState<Date>(
//     selected || new Date(),
//   );

//   useEffect(() => {
//     const handleClick = (e: MouseEvent) => {
//       if (ref.current && !ref.current.contains(e.target as Node)) {
//         onClose();
//       }
//     };
//     document.addEventListener("mousedown", handleClick);
//     return () => document.removeEventListener("mousedown", handleClick);
//   }, []);

//   const handleSelect = (d?: Date) => {
//     if (!d) return onChange("");
//     onChange(format(d, "yyyy-MM-dd"));
//     onClose();
//   };

//   const calendarUI = (
//     <div
//       ref={ref}
//       style={{
//         position: "absolute",
//         top: position.top,
//         left: position.left,
//       }}
//       className="z-[9999] bg-white shadow-2xl rounded-xl p-3 absolute"
//     >
//       <DayPicker
//         mode="single"
//         selected={selected}
//         onSelect={handleSelect}
//         locale={vi}
//         captionLayout="dropdown"
//         fromYear={1990}
//         toYear={2050}
//         month={displayMonth}
//         onMonthChange={setDisplayMonth}
//       />
//     </div>
//   );

//   return createPortal(calendarUI, document.body);
// }

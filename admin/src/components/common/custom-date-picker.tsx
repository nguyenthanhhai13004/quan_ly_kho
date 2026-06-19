import { useState, useRef, useEffect, useCallback, forwardRef } from "react";
import { createPortal } from "react-dom";
import dayjs from "dayjs";
import { IoCalendarOutline, IoChevronBack, IoChevronForward } from "react-icons/io5";

interface CustomDatePickerProps {
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  name?: string;
  className?: string;
  placeholder?: string;
}

const DAY_NAMES = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

function parseDate(val?: string | number): dayjs.Dayjs | null {
  if (!val) return null;
  const str = String(val);
  let d = dayjs(str, "YYYY-MM-DD", true);
  if (d.isValid()) return d;
  d = dayjs(str);
  if (d.isValid()) return d;
  return null;
}

const CustomDatePicker = forwardRef<HTMLInputElement, CustomDatePickerProps>(
  function CustomDatePicker(
    {
      value,
      onChange,
      onBlur,
      disabled = false,
      name = "",
      className = "",
      placeholder = "dd/mm/yyyy",
    },
    ref,
  ) {
    const selected = parseDate(value);
    const [isOpen, setIsOpen] = useState(false);
    const [textValue, setTextValue] = useState(selected ? selected.format("DD/MM/YYYY") : "");
    const [viewDate, setViewDate] = useState(selected || dayjs());
    const containerRef = useRef<HTMLDivElement>(null);
    const hiddenRef = useRef<HTMLInputElement>(null);
    const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });

    // Sync display text when value prop changes
    useEffect(() => {
      const d = parseDate(value);
      setTextValue(d ? d.format("DD/MM/YYYY") : "");
      if (d) setViewDate(d);
    }, [value]);

    const updatePosition = useCallback(() => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setPopupPos({ top: rect.bottom + window.scrollY + 4, left: rect.left + window.scrollX });
    }, []);

    useEffect(() => {
      if (!isOpen) return;
      updatePosition();
      const onScroll = () => updatePosition();
      window.addEventListener("scroll", onScroll, true);
      window.addEventListener("resize", onScroll);
      return () => {
        window.removeEventListener("scroll", onScroll, true);
        window.removeEventListener("resize", onScroll);
      };
    }, [isOpen, updatePosition]);

    useEffect(() => {
      const handler = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          const popups = document.querySelectorAll("[data-datepicker-popup]");
          for (const popup of popups) {
            if (popup.contains(e.target as Node)) return;
          }
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, []);

    const fireChange = useCallback(
      (isoStr: string) => {
        // Update hidden input and dispatch native event for react-hook-form
        if (hiddenRef.current) {
          const nativeSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value",
          )?.set;
          nativeSetter?.call(hiddenRef.current, isoStr);
          const nativeEvent = new Event("input", { bubbles: true });
          hiddenRef.current.dispatchEvent(nativeEvent);
        }

        if (!onChange) return;
        const evt = {
          target: { value: isoStr, name, type: "text" },
          currentTarget: { value: isoStr, name, type: "text" },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        onChange(evt);
      },
      [onChange, name],
    );

    const selectDay = (day: number) => {
      const d = viewDate.date(day);
      const iso = d.format("YYYY-MM-DD");
      setTextValue(d.format("DD/MM/YYYY"));
      fireChange(iso);
      setIsOpen(false);
    };

    const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setTextValue(raw);
      const parsed = dayjs(raw, "DD/MM/YYYY", true);
      if (parsed.isValid()) {
        fireChange(parsed.format("YYYY-MM-DD"));
        setViewDate(parsed);
      } else if (raw === "") {
        fireChange("");
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const parsed = dayjs(textValue, "DD/MM/YYYY", true);
      if (!parsed.isValid() && textValue !== "") {
        const d = parseDate(value || hiddenRef.current?.value);
        setTextValue(d ? d.format("DD/MM/YYYY") : "");
      }
      if (onBlur) {
        onBlur(e);
      }
    };

    const selectToday = () => {
      const t = dayjs();
      setViewDate(t);
      fireChange(t.format("YYYY-MM-DD"));
      setTextValue(t.format("DD/MM/YYYY"));
      setIsOpen(false);
    };

    const daysInMonth = viewDate.daysInMonth();
    const firstDay = viewDate.startOf("month").day();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const today = dayjs();

    // Merge refs: forward ref (for react-hook-form) + internal hiddenRef
    // Also intercept DOM element's value setter for perfect react-hook-form sync on reset/setValue
    const setRefs = useCallback(
      (el: HTMLInputElement | null) => {
        hiddenRef.current = el;
        if (el) {
          const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
          Object.defineProperty(el, "value", {
            get() {
              return descriptor?.get?.call(this);
            },
            set(val) {
              descriptor?.set?.call(this, val);
              const d = parseDate(val);
              setTextValue(d ? d.format("DD/MM/YYYY") : "");
              if (d) setViewDate(d);
            },
            configurable: true,
          });

          // If there is an initial value in the DOM, sync it immediately
          if (el.value) {
            const d = parseDate(el.value);
            if (d) {
              setTextValue(d.format("DD/MM/YYYY"));
              setViewDate(d);
            }
          }
        }
        if (typeof ref === "function") ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
      },
      [ref],
    );

    return (
      <div ref={containerRef} className="relative w-full flex items-center">
        {/* Hidden input for react-hook-form ref integration */}
        <input
          type="hidden"
          ref={setRefs}
          name={name}
          {...(value !== undefined ? { value: selected ? selected.format("YYYY-MM-DD") : "" } : { defaultValue: selected ? selected.format("YYYY-MM-DD") : "" })}
        />
        {/* Visible text input */}
        <input
          type="text"
          value={textValue}
          placeholder={placeholder}
          onChange={handleText}
          onBlur={handleBlur}
          onFocus={() => !disabled && setIsOpen(true)}
          disabled={disabled}
          className={`${className} pr-8`}
          autoComplete="off"
        />
        {!disabled && (
          <button
            type="button"
            onClick={() => { updatePosition(); setIsOpen(!isOpen); }}
            className="absolute right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
            tabIndex={-1}
          >
            <IoCalendarOutline size={18} />
          </button>
        )}
        {isOpen && !disabled &&
          createPortal(
            <div
              data-datepicker-popup
              className="absolute z-[9999] bg-white border border-gray-200 rounded-xl shadow-2xl p-3"
              style={{ top: popupPos.top, left: popupPos.left, width: 280 }}
            >
              <div className="flex items-center justify-between mb-2">
                <button type="button" onClick={() => setViewDate(viewDate.subtract(1, "month"))} className="p-1 hover:bg-gray-100 rounded-lg cursor-pointer">
                  <IoChevronBack size={16} />
                </button>
                <span className="text-sm font-semibold text-gray-700">
                  Tháng {viewDate.month() + 1}, {viewDate.year()}
                </span>
                <button type="button" onClick={() => setViewDate(viewDate.add(1, "month"))} className="p-1 hover:bg-gray-100 rounded-lg cursor-pointer">
                  <IoChevronForward size={16} />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-1">
                {DAY_NAMES.map((d) => (
                  <div key={d} className="text-xs text-center text-gray-400 font-medium py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: offset }).map((_, i) => (<div key={`e-${i}`} />))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const cur = viewDate.date(day);
                  const isSel = selected && cur.format("YYYY-MM-DD") === selected.format("YYYY-MM-DD");
                  const isToday = cur.format("YYYY-MM-DD") === today.format("YYYY-MM-DD");
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => selectDay(day)}
                      className={`text-sm p-1 rounded-lg text-center cursor-pointer transition-colors
                        ${isSel ? "bg-blue-600 text-white font-semibold" : isToday ? "bg-blue-50 text-blue-600 font-medium" : "hover:bg-gray-100 text-gray-700"}`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 pt-2 border-t border-gray-100 text-center">
                <button type="button" onClick={selectToday} className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
                  Hôm nay ({today.format("DD/MM/YYYY")})
                </button>
              </div>
            </div>,
            document.body,
          )}
      </div>
    );
  },
);

export default CustomDatePicker;

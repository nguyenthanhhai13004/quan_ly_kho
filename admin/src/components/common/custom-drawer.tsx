import { type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CgClose } from "react-icons/cg";

interface CustomDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  position?: "left" | "right";
  width?: string;
  className?: string;
  background?: string;
}

export default function CustomDrawer({
  open,
  onClose,
  title,
  children,
  position = "right",
  width = "w-[400px]",
  className = "",
  background = "bg-white",
}: CustomDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className={`${className}`}>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className={`fixed top-0 bottom-0 z-50 shadow-xl flex flex-col ${width} ${background} ${
              position === "right" ? "right-0" : "left-0"
            }`}
            initial={{ x: position === "right" ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: position === "right" ? "100%" : "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-base font-semibold">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <CgClose className="cursor-pointer" size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
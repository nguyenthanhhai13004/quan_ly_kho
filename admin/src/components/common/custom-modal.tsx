import { useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CgClose } from "react-icons/cg";

export interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  width?: string;
  height?: string;
}

export default function CustomModal({
  open,
  onClose,
  title,
  children,
  width = "max-w-md",
  height = "max-h-[70vh]",
}: CustomModalProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className={`relative bg-white rounded-2xl shadow-xl z-10 ${width} p-6 flex flex-col`}
            initial={{ y: 40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 250 }}
          >
            {title && (
              <div className="flex items-center justify-between mb-4 border-b pb-2">
                <h2 className="text-lg font-semibold">{title}</h2>
                <CgClose
                  className="cursor-pointer hover:text-red-500"
                  onClick={onClose}
                  size={20}
                />
              </div>
            )}

            {children && (
              <div
                className={`overflow-y-auto hidden-scrollbar ${height}`}
              >
                {children}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

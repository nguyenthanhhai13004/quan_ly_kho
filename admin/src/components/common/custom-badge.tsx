export interface CustomBadgeProps {
  label: string;
  status?: "success" | "warning" | "error" | "info" | "default";
  className?: string;
}

export default function CustomBadge({
  label,
  status = "default",
  className = "",
}: CustomBadgeProps) {
  const statusClasses: Record<string, string> = {
    success: "bg-[#C1FFF4] text-[#00997E]",
    warning: "bg-[#FFFBE4] text-[#FFBE66]",
    error: "bg-[#FFF4F9] text-[#FF414B]",
    info: "bg-[#2b7dbc] text-white",
    default: "bg-[#666666] text-white",
  };

  const circleClasses: Record<string, string> = {
    success: "bg-[#00997E]",
    warning: "bg-[#FFBE66]",
    error: "bg-[#FF414B]",
    info: "bg-white",
    default: "bg-white",
  };
  return (
    <span
      className={`px-3 py-1 text-xs rounded-full font-semibold inline-flex items-center justify-center gap-2 ${statusClasses[status]} ${className}`}
    >
      <div className={`w-2 h-2 rounded-full ${circleClasses[status]}`}></div>
      <span>{label}</span>
    </span>
  );
}

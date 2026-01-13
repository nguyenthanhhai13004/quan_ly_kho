
type AlertType = "success" | "error" | "warning" | "info";

interface CustomAlertProps {
  type?: AlertType;
  message?: string;
  className?: string;
}

export default function CustomAlert({
  type = "info",
  message = "",
  className = "",
}: CustomAlertProps) {

  const typeStyles: Record<AlertType, string> = {
    success: "bg-green-100 text-green-700 border-green-400",
    error: "bg-red-100 text-red-700 border-red-400",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-400",
    info: "bg-blue-100 text-blue-700 border-blue-400",
  };

  return (
    <div
      className={`border px-4 py-3 rounded flex items-start gap-2 ${typeStyles[type]} ${className}`}
      role="alert"
    >
      <div className="flex-1">{message}</div>
    </div>
  );
}

import type { Variant } from "./custom-button";
import CustomPercentCircle from "./custom-percent-circle";

type CustomStatisticCardProps = {
  type?: "sample" | "percent";
  icon?: React.ReactNode;
  variant?: Variant;
  name: string;
  description: React.ReactNode;
  percent?: number;
};
export default function CustomStatisticCard({
  type = "sample",
  variant = "info",
  icon,
  description,
  name,
  percent = 0,
}: CustomStatisticCardProps) {
  const variantMap: Record<Variant, string> = {
    info: "#2b7dbc",
    warming: "#ffb752",
    danger: "#d15b47",
    success: "#87b87f",
  };
  return (
    <div className="border border-dashed border-gray-300 px-3 py-2">
      {type === "sample" ? (
        <div
          className={`text-[${variantMap[variant]}] flex items-center gap-2`}
        >
          <div
            className={`h-10 w-10 rounded-full bg-[${variantMap[variant]}] shadow-xl flex items-center justify-center text-white`}
          >
            {icon}
          </div>
          <div className="h-15">
            <h5 className="mb-2 font-semibold text-xl text-shadow-2xs">
              {name}
            </h5>
            {description}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-[#2b7dbc]">
          <div className="h-15 w-15">
            <CustomPercentCircle percent={percent} />
          </div>
          <div className="h-15">
            <h5 className="mb-1 font-semibold">{name}</h5>
            {typeof description === "string" ? (
              <span className="text-sm text-[#555555] inline-block">
                {description}
              </span>
            ) : (
              description
            )}
          </div>
        </div>
      )}
    </div>
  );
}

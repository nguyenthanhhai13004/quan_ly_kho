interface CustomPercentCircleProps {
  percent: number;
}

export default function CustomPercentCircle({
  percent,
}: CustomPercentCircleProps) {
  const radius = 45;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="lightgray"
          strokeWidth={stroke}
          fill="transparent"
        />

        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#2b7dbc"
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>

      <span className="absolute text-xs font-bold text-[#2b7dbc]">
        {percent.toFixed(2)}%
      </span>
    </div>
  );
}

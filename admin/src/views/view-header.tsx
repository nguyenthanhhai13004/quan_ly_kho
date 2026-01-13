import { type ReactNode } from "react";

interface ViewHeaderProps {
  title: string;
  actions?: ReactNode[];
}

export default function ViewHeader({ title, actions = [] }: ViewHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-3">
      <h2 className="text-3xl font-semibold py-3">{title}</h2>

      {actions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {actions.map((action, index) => (
            <div key={index}>{action}</div>
          ))}
        </div>
      )}
    </div>
  );
}

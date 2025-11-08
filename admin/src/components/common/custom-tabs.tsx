import { useState, type ReactNode } from "react";
export interface ICustomTab {
  key: string;
  label: ReactNode | string;
  disabled?: boolean;
  content: ReactNode;
}

export interface ICustomTabsProps {
  tabs: ICustomTab[];
  defaultActive?: string;
}

export default function CustomTabs({ tabs, defaultActive }: ICustomTabsProps) {
  const [active, setActive] = useState(defaultActive || tabs[0]?.key);

  return (
    <div className="w-full">
      <div className="flex flex-wrap">
        {tabs.map((tab) => (
          <div
            key={tab.key}
            onClick={() => !tab.disabled && setActive(tab.key)}
            className={`relative px-3 py-2 flex gap-1 cursor-pointer border border-b-0 border-gray-300 text-sm font-medium 
              ${
                tab.disabled
                  ? "text-gray-400 bg-gray-200 cursor-not-allowed"
                  : active === tab.key
                    ? "bg-white text-[#2b7dbc] border-t-2 border-t-[#2b7dbc]"
                    : " text-[#585858] bg-[#f8f8f8]"
              }`}
          >
            <span>{tab.label}</span>
            {active === tab.key && (
              <div className="absolute -bottom-0.5 h-2 left-0 right-0 bg-white"></div>
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="px-5 py-3 bg-white border border-gray-300 h-[80vh] overflow-y-auto">
        {tabs.map((tab) => (
          <div
            key={tab.key}
            className={`animate-fadeIn ${tab.key === active ? "block" : "hidden"}`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}

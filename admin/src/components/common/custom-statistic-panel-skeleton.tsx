export default function CustomStatisticPanelSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-4 border border-gray-200 bg-white w-[50%] h-[200px]">
      <div className="flex gap-3">
        <div className="h-10 w-10 bg-gray-300"></div>
        <div>
          <div className="h-3 w-40 bg-gray-300 mb-2"></div>
          <div className="h-3 w-60 bg-gray-300"></div>
        </div>
      </div>
      <div className="h-3 w-full bg-gray-300"></div>
      <div className="h-3 w-5/6 bg-gray-300"></div>
      <div className="h-3 w-2/3 bg-gray-300"></div>
    </div>
  );
}

type CustomStatisticGroupProps = {
  title: React.ReactNode;
  columns?: number;
  children: React.ReactNode;
};

export default function CustomStatisticGroup({
  title,
  columns = 1,
  children,
}: CustomStatisticGroupProps) {
  return (
    <div>
      {typeof title === "string" ? (
        <h5 className="mb-3 font-medium">{title}</h5>
      ) : (
        title
      )}
      <div className={`grid grid-cols-${columns}`}>{children}</div>
    </div>
  );
}

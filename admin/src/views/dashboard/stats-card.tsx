
interface StatsCardProps {
    label:string;
    value:number
}
export default function StatsCard({label,value}:StatsCardProps) {
  return (
    <div className="bg-[#F8E38D] rounded-2xl shadow p-4 text-center">
      <h3 className="text-sm">{label}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

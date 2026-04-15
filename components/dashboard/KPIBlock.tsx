type KPIBlockProps = {
  label: string;
  value: number | string;
};

export default function KPIBlock({ label, value }: KPIBlockProps) {
  return (
    <div className="bg-[#111418] border border-white/5 rounded-lg px-4 py-3 shadow-sm">
      <p className="text-[11px] uppercase tracking-wide text-white/45 mb-1">
        {label}
      </p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}

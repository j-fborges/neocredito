interface SimilarityBarProps {
  value: number;
}

export default function SimilarityBar({ value }: SimilarityBarProps) {
  const getColor = (v: number) => {
    if (v >= 80) return "bg-green-500";
    if (v >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="flex items-end gap-2">
      <div className="flex-1 rounded-full h-4 overflow-hidden border-2 border-brand-blue-dark bg-white">
        <div
          className={`h-full rounded-full transition-all duration-500 border border-brand-blue-dark ${getColor(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xl leading-4 tracking-tighter font-bold font-mono text-brand-blue-dark min-w-16">
        {value}%
      </span>
    </div>
  );
}

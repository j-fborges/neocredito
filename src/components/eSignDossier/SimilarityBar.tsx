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
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getColor(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-sm font-medium text-gray-700 min-w-[4rem]">
        {value}%
      </span>
    </div>
  );
}

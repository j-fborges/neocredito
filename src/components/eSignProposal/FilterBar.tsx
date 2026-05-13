import { ESIGN_STATUS, type ESignStatus } from "../../types/signingProposal";

interface FilterBarProps {
  statusFilter: ESignStatus | null;
  onStatusChange: (status: ESignStatus | null) => void;
  inputValue: string;
  onInputChange: (value: string) => void;
}

export default function FilterBar({
  statusFilter,
  onStatusChange,
  inputValue,
  onInputChange,
}: FilterBarProps) {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as ESignStatus | "";
    onStatusChange(val || null);
  };

  return (
    <div className="flex gap-4 mb-6">
      <select
        className="border rounded px-3 py-2"
        value={statusFilter ?? ""}
        onChange={handleStatusChange}
      >
        <option value="">Todos os status</option>
        {Object.values(ESIGN_STATUS).map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Buscar por nome ou ID..."
        className="border rounded px-3 py-2 flex-1"
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
      />
    </div>
  );
}

import { ESIGN_STATUS, type ESignStatus } from "../../types/signingProposal";

interface StatusFilterSelectProps {
  value: ESignStatus | null;
  onChange: (status: ESignStatus | null) => void;
}

export default function StatusFilterSelect({
  value,
  onChange,
}: StatusFilterSelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as ESignStatus | "";
    onChange(val || null);
  };

  return (
    <select
      className="border rounded px-3 py-2"
      value={value ?? ""}
      onChange={handleChange}
      aria-label="Filtrar por status"
    >
      <option value="">Todos os status</option>
      {Object.values(ESIGN_STATUS).map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}

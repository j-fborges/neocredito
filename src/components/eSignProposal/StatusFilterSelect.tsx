import { messages as translations } from "../../i18n/pt-BR";
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
      className="rounded border border-gray-300 px-3 py-2 mr-4 bg-custom-gray text-brand-blue-dark cursor-pointer shadow-sm shadow-custom-shadow"
      value={value ?? ""}
      onChange={handleChange}
      aria-label={translations.proposal.filter.statusLabel}
    >
      <option value="">{translations.proposal.filter.allStatuses}</option>
      {Object.values(ESIGN_STATUS).map((s) => (
        <option key={s} value={s}>
          {translations.status[s]}
        </option>
      ))}
    </select>
  );
}

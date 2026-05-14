import { messages } from "../../i18n/pt-BR";
import type { ESignStatus } from "../../types/signingProposal";

import StatusFilterSelect from "./StatusFilterSelect";

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
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <StatusFilterSelect value={statusFilter} onChange={onStatusChange} />
      <input
        type="text"
        placeholder={messages.proposal.filter.searchPlaceholder}
        className="border rounded px-3 py-2 flex-1"
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
      />
    </div>
  );
}

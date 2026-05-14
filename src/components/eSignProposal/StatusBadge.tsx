import { messages } from "../../i18n/pt-BR";
import { ESIGN_STATUS, type ESignStatus } from "../../types/signingProposal";

const colorMap: Record<ESignStatus, string> = {
  [ESIGN_STATUS.AWAITING]: "bg-yellow-200 text-yellow-800",
  [ESIGN_STATUS.SIGNED]: "bg-green-200 text-green-800",
  [ESIGN_STATUS.REJECTED]: "bg-red-200 text-red-800",
  [ESIGN_STATUS.EXPIRED]: "bg-gray-200 text-gray-800",
};

interface StatusBadgeProps {
  status: ESignStatus;
  pulse?: boolean;
}

export default function StatusBadge({
  status,
  pulse = false,
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-block px-2 py-1 rounded text-sm font-medium ${colorMap[status]} ${
        pulse ? "animate-pulse" : ""
      }`}
    >
      {messages.status[status]}
    </span>
  );
}

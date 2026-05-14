import { messages } from "../../i18n/pt-BR";
import { ESIGN_STATUS, type ESignStatus } from "../../types/signingProposal";

const colorMap: Record<ESignStatus, string> = {
  [ESIGN_STATUS.AWAITING]: "bg-yellow-200 text-yellow-900",
  [ESIGN_STATUS.SIGNED]: "bg-green-300 text-brand-blue-dark",
  [ESIGN_STATUS.REJECTED]: "bg-red-200 text-red-900",
  [ESIGN_STATUS.EXPIRED]: "bg-gray-300 text-gray-900",
};

interface StatusBadgeProps {
  status: ESignStatus;
  pulse?: boolean;
  centralized?: boolean;
}

export default function StatusBadge({
  status,
  pulse = false,
  centralized = false,
}: StatusBadgeProps) {
  const label = pulse ? messages.status.JUST_SIGNED : messages.status[status];

  return (
    <div
      className={centralized ? "md:w-[150px] flex flex-row justify-center" : ""}
    >
      <span
        className={`inline-block px-2 py-1 rounded text-sm font-medium ${colorMap[status]} ${
          pulse ? "animate-pulse" : ""
        }`}
      >
        {label}
      </span>
    </div>
  );
}

import { messages as translations } from "../../i18n/pt-BR";
import { ESIGN_STATUS, type ESignStatus } from "../../types/signingProposal";

const colorMap: Record<ESignStatus, string> = {
  [ESIGN_STATUS.AWAITING]: "bg-yellow-200 text-yellow-800",
  [ESIGN_STATUS.SIGNED]: "bg-green-300 text-brand-blue-dark",
  [ESIGN_STATUS.REJECTED]: "bg-red-200 text-red-800",
  [ESIGN_STATUS.EXPIRED]: "bg-gray-300 text-gray-800",
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
  const label = pulse
    ? translations.status.JUST_SIGNED
    : translations.status[status];

  return (
    <span
      className={centralized ? "md:w-[150px] flex flex-row justify-center" : ""}
    >
      <span
        className={`inline-block px-2 py-1 rounded text-sm font-bold ${colorMap[status]} ${
          pulse ? "animate-pulse" : ""
        }`}
      >
        {label}
      </span>
    </span>
  );
}

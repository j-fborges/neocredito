import { messages } from "../../i18n/pt-BR";
import { DOSSIER_STATUS, type DossierStatus } from "../../types/eSignDossier";

const colorMap: Record<DossierStatus, string> = {
  [DOSSIER_STATUS.PENDING_VALIDATION]: "bg-yellow-200 text-yellow-800",
  [DOSSIER_STATUS.APPROVED_AWAITING_AUDIT]: "bg-green-200 text-green-800",
  [DOSSIER_STATUS.DISAPPROVED_PENDING]: "bg-red-200 text-red-800",
};

interface DossierStatusBadgeProps {
  status: DossierStatus;
}

export default function DossierStatusBadge({
  status,
}: DossierStatusBadgeProps) {
  return (
    <span
      className={`inline-block px-2 py-1 rounded text-sm font-medium ${colorMap[status]}`}
    >
      {messages.dossier.statusDossier[status]}
    </span>
  );
}

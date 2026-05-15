import { messages as translations } from "../../i18n/pt-BR";
import type { Dossier } from "../../types/eSignDossier";

import DossierStatusBadge from "./DossierStatusBadge";

interface DossierHeaderProps {
  dossier: Dossier;
}

export default function DossierHeader({ dossier }: DossierHeaderProps) {
  return (
    <div className="flex flex-col mb-0 sm:pt-2 gap border-l-4 border-brand-blue-dark pl-2 ml-1">
      <span className="text-lg font-bold font-mono uppercase">
        {translations.dossier.proposalNumber}: {dossier.proposalId}
      </span>
      <span className="text-lg text-brand-blue-dark flex items-center gap-2">
        <span className="uppercase font-mono font-bold text-lg">
          {translations.dossier.status}:
        </span>
        <DossierStatusBadge status={dossier.status} />
      </span>
    </div>
  );
}

import { useParams } from "react-router-dom";

import ActionButtons from "../components/eSignDossier/ActionButtons";
import DossierStatusBadge from "../components/eSignDossier/DossierStatusBadge";
import EvidenceSection from "../components/eSignDossier/EvidenceSection";
import MapSection from "../components/eSignDossier/MapSection";
import SignatoryDataSection from "../components/eSignDossier/SignatoryDataSection";
import { useDossierActions } from "../hooks/useDocierActions";
import { useDossierLoader } from "../hooks/useDocierLoader";
import { messages } from "../i18n/pt-BR";

export default function ESignDossierPanel() {
  const { id } = useParams<{ id: string }>();
  const { dossier, loading, error, actionInProgress } = useDossierLoader(id);
  const { handleApprove, handleDisapprove, canAct } = useDossierActions(
    id ?? "",
    dossier?.status ?? "",
    actionInProgress,
  );

  if (loading) return <div className="p-6">Carregando...</div>;
  if (error) return <div className="p-6 text-red-500">Erro: {error}</div>;
  if (!dossier) return <div className="p-6">Nenhum dossiê encontrado.</div>;

  return (
    <div className="flex flex-col md:flex-row h-full w-full">
      <main className="flex-1 w-full p-2 sm:p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1 w-full md:w-1/2 md:pr-4 md:border-r border-gray-200">
          <h1 className="leading-6 text-2xl pt-0 sm:pt-2 pl-1 font-bold mb-4 font-mono uppercase text-brand-blue-dark">
            {messages.dossier.title}
          </h1>

          <div className="flex flex-col mb-4 sm:pt-2 gap border-l-4 border-brand-blue-dark pl-2 ml-1">
            <span className="text-lg font-bold font-mono uppercase">
              {messages.dossier.proposalNumber}: {dossier.proposalId}
            </span>
            <span className="text-lg text-brand-blue-dark flex items-center gap-2">
              <span className="uppercase font-mono font-bold text-lg">
                {messages.dossier.status}:
              </span>
              <DossierStatusBadge status={dossier.status} />
            </span>
          </div>

          <hr className="border-brand-blue-dark/20 my-4" />

          <SignatoryDataSection signatory={dossier.signatory} />

          <hr className="border-brand-blue-dark/20 my-4" />

          <MapSection signatory={dossier.signatory} />
        </div>

        <div className="flex-1 w-full md:w-1/2 md:pl-4">
          <EvidenceSection
            selfieUrl={dossier.selfieUrl}
            documentUrl={dossier.documentUrl}
            facialSimilarity={dossier.facialSimilarity}
          />

          <hr className="border-brand-blue-dark/20 my-4" />

          <ActionButtons
            onApprove={handleApprove}
            onDisapprove={handleDisapprove}
            disabled={!canAct}
          />
        </div>
      </main>
    </div>
  );
}

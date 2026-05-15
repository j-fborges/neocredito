import { useParams } from "react-router-dom";

import DecisionSection from "../components/eSignDossier/DecisionSection";
import DossierHeader from "../components/eSignDossier/DossierHeader";
import MapSection from "../components/eSignDossier/MapSection";
import PhotographicEvidenceSection from "../components/eSignDossier/PhotographicEvidenceSection";
import SignatoryDataSection from "../components/eSignDossier/SignatoryDataSection";
import { useDossierLoader } from "../hooks/useDocierLoader";
import { messages } from "../i18n/pt-BR";

export default function ESignDossierPanel() {
  const { id } = useParams<{ id: string }>();
  const { dossier, loading, error } = useDossierLoader(id);

  if (loading) return <div className="p-6">{messages.dossier.loading}</div>;
  if (error)
    return (
      <div className="p-6 text-red-500">
        {messages.dossier.error} {error}
      </div>
    );
  if (!dossier) return <div className="p-6">{messages.dossier.notFound}</div>;

  return (
    <div className="flex flex-col md:flex-row h-full w-full">
      <main className="w-full p-4 pt-8 md:p-2 md:pt-8 lg:px-4 flex flex-col md:flex-row gap-4 md:gap-0">
        <div className="w-full md:w-1/2 md:pr-4 md:border-r border-gray-200">
          <h1 className="leading-6 text-2xl pt-0 sm:pt-2 pl-1 font-bold mb-4 font-mono uppercase text-brand-blue-dark">
            {messages.dossier.title}
          </h1>
          <DossierHeader dossier={dossier} />

          <hr className="border-brand-blue-dark/20 mb-4 mt-2" />
          <SignatoryDataSection signatory={dossier.signatory} />

          <hr className="border-brand-blue-dark/20 mb-4 mt-2" />
          <MapSection signatory={dossier.signatory} />
        </div>

        <div className="w-full md:w-1/2 md:pl-0 flex flex-col">
          <PhotographicEvidenceSection
            selfieUrl={dossier.selfieUrl}
            documentUrl={dossier.documentUrl}
            facialSimilarity={dossier.facialSimilarity}
          />

          <hr className="border-brand-blue-dark/20 mb-4 mt-2" />

          <DecisionSection />
        </div>
      </main>
    </div>
  );
}

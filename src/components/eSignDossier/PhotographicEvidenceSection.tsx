import { messages } from "../../i18n/pt-BR";

import EvidenceLightbox from "./EvidenceLightbox";
import SimilarityBar from "./SimilarityBar";

interface PhotographicEvidenceSectionProps {
  selfieUrl: string;
  documentUrl: string;
  facialSimilarity: number;
}

export default function PhotographicEvidenceSection({
  selfieUrl,
  documentUrl,
  facialSimilarity,
}: PhotographicEvidenceSectionProps) {
  return (
    <div className="md:px-6">
      <h3 className="text-lg font-semibold text-brand-blue-dark mb-4">
        Evidências Visuais
      </h3>
      <EvidenceLightbox
        images={[
          {
            src: selfieUrl,
            alt: "Selfie do assinante",
            label: messages.dossier.selfie,
          },
          {
            src: documentUrl,
            alt: "Documento do assinante",
            label: messages.dossier.document,
          },
        ]}
      />
      <hr className="border-brand-blue-dark/20 mb-4 mt-2" />

      <div className="mb-4 mt-6 mx-4">
        <p className="text-sm font-bold font-mono text-brand-blue-dark">
          {messages.dossier.facialSimilarity}:
        </p>
        <SimilarityBar value={facialSimilarity} />
      </div>
      <hr className="border-brand-blue-dark/20" />
    </div>
  );
}

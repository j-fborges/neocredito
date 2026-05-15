import { messages } from "../../i18n/pt-BR";

import EvidenceLightbox from "./EvidenceLightbox";
import SimilarityBar from "./SimilarityBar";

interface EvidenceSectionProps {
  selfieUrl: string;
  documentUrl: string;
  facialSimilarity: number;
}

export default function EvidenceSection({
  selfieUrl,
  documentUrl,
  facialSimilarity,
}: EvidenceSectionProps) {
  return (
    <div>
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
      <div className="mb-4 mt-6">
        <p className="text-sm font-medium text-gray-700 mb-2">
          {messages.dossier.facialSimilarity}:
        </p>
        <SimilarityBar value={facialSimilarity} />
      </div>
    </div>
  );
}

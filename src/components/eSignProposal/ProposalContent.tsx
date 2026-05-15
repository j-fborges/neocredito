import { messages as translations } from "../../i18n/pt-BR";
import type { SigningProposal } from "../../types/signingProposal";

import ProposalList from "./ProposalList";

interface ProposalContentProps {
  loading: boolean;
  error: string | null;
  itens: SigningProposal[];
  onRowClick: (proposal: SigningProposal) => void;
}

export default function ProposalContent({
  loading,
  error,
  itens,
  onRowClick,
}: ProposalContentProps) {
  if (loading) {
    return (
      <div role="status" aria-live="polite" className="py-4">
        <p>{translations.proposal.loading}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="py-4 text-red-500">
        <p>
          {translations.error.loading}: {error}
        </p>
      </div>
    );
  }

  if (itens.length === 0) {
    return (
      <section
        aria-label={translations.proposal.empty.title}
        className="py-16 text-center"
      >
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          {translations.proposal.empty.title}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {translations.proposal.empty.description}
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Lista de propostas">
      <div className="text-center pb-2 text-gray-500 flex lg:hidden">
        <p className="text-xs">
          {translations.proposal.detailPanel.emptyDescription}
        </p>
      </div>
      <ProposalList itens={itens} onRowClick={onRowClick} />
    </section>
  );
}

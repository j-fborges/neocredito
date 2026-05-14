import DetailsModal from "../components/eSignProposal/DetailsModal";
import FilterBar from "../components/eSignProposal/FilterBar";
import ProposalContent from "../components/eSignProposal/ProposalContent";
import { useProposalDetail } from "../hooks/useProposalDetail";
import { useProposalNotifications } from "../hooks/useProposalNotifications";
import { useProposalPolling } from "../hooks/useProposalPolling";
import { useProposalSearch } from "../hooks/useProposalSearch";
import { messages } from "../i18n/pt-BR";
import { useAppSelector } from "../store/hooks";
import { selectProposals } from "../store/SigningProposalSlice";

export default function CorbanPannel() {
  const { itens, loading, error, selectedProposal, detailLoading } =
    useAppSelector(selectProposals);

  const { statusFilter, inputValue, handleStatusChange, handleInputChange } =
    useProposalSearch();

  useProposalPolling();
  useProposalNotifications(itens);
  const { handleRowClick, handleCloseModal } = useProposalDetail();

  return (
    <main
      className="p-6 max-w-6xl mx-auto md:mx-5"
      aria-labelledby="corban-heading"
    >
      <h1
        id="corban-heading"
        className="text-2xl font-bold mb-4 font-mono uppercase text-brand-blue-dark"
      >
        {messages.proposal.title}
      </h1>
      <h2 className="text-xl mb-4 font-sans text-brand-blue-dark">
        {messages.proposal.subtitle}
      </h2>

      <FilterBar
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        inputValue={inputValue}
        onInputChange={handleInputChange}
      />

      <ProposalContent
        loading={loading}
        error={error}
        itens={itens}
        onRowClick={handleRowClick}
      />

      {selectedProposal && (
        <DetailsModal
          proposal={selectedProposal}
          loading={detailLoading}
          onClose={handleCloseModal}
        />
      )}
    </main>
  );
}

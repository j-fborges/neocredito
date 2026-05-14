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
      className="p-2 sm:p-6 max-w-6xl mx-auto sm:mx-5 min-h-full"
      aria-labelledby="corban-heading"
    >
      <h1
        id="corban-heading"
        className="leading-6 text-2xl pt-2 pl-1 sm:p-0 font-bold mb-4 font-mono uppercase text-brand-blue-dark"
      >
        {messages.proposal.title}
      </h1>
      <h2 className="leading-6 text-xl mb-4 font-sans pl-1 sm:p-0 text-brand-blue-dark">
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

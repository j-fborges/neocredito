import DetailsModal from "../components/eSignProposal/DetailsModal";
import FilterBar from "../components/eSignProposal/FilterBar";
import ProposalContent from "../components/eSignProposal/ProposalContent";
import ProposalDetailPanel from "../components/eSignProposal/ProposalDetailsPanel";
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
    <div className="flex flex-col md:flex-row h-full">
      <main
        className="flex-1 max-w-6xl lg:max-w-[60%] xl:max-w-[70%] mx-auto sm:mx-5 p-2"
        aria-labelledby="corban-heading"
      >
        <h1
          id="corban-heading"
          className="leading-6 text-2xl pt-0 sm:pt-2 pl-1 font-bold mb-4 font-mono uppercase text-brand-blue-dark"
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
      </main>

      <aside className="hidden lg:block w-full lg:max-w-[40%] xl:max-w-[30%] bg-custom-lightgray border-l border-gray-200">
        <ProposalDetailPanel
          proposal={selectedProposal}
          loading={detailLoading}
          onClose={handleCloseModal}
        />
      </aside>

      {selectedProposal && (
        <div className="lg:hidden">
          <DetailsModal
            proposal={selectedProposal}
            loading={detailLoading}
            onClose={handleCloseModal}
          />
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";

import DetailsModal from "../components/eSignProposal/DetailsModal";
import FilterBar from "../components/eSignProposal/FilterBar";
import ProposalContent from "../components/eSignProposal/ProposalContent";
import { useDebounce } from "../hooks/useDebounce";
import { messages } from "../i18n/pt-BR";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  clearSelection,
  fetchSigningProposals,
  selectProposals,
  setSelection,
  setStatusFilter,
} from "../store/SigningProposalSlice";
import type { ESignStatus, SigningProposal } from "../types/signingProposal";

export default function CorbanPannel() {
  const dispatch = useAppDispatch();
  const {
    itens,
    statusFilter,
    searchTerm,
    loading,
    error,
    selectedProposal,
    detailLoading,
  } = useAppSelector(selectProposals);

  const [inputValue, setInputValue] = useState(searchTerm);
  const debouncedSearch = useDebounce(inputValue, 300);

  useEffect(() => {
    dispatch(
      fetchSigningProposals({ status: statusFilter, search: debouncedSearch }),
    );
  }, [dispatch, statusFilter, debouncedSearch]);

  const handleStatusChange = (status: ESignStatus | null) => {
    dispatch(setStatusFilter(status));
  };
  const handleInputChange = (value: string) => {
    setInputValue(value);
  };
  const handleRowClick = (proposal: SigningProposal) => {
    dispatch(setSelection(proposal));
  };
  const handleCloseModal = () => {
    dispatch(clearSelection());
  };

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

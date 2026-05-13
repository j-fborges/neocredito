import { useEffect, useState } from "react";

import FilterBar from "../components/eSignProposal/FilterBar";
import ProposalContent from "../components/eSignProposal/ProposalContent";
import { useDebounce } from "../hooks/useDebounce";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchSigningProposals,
  selectProposals,
  setSelection,
  setStatusFilter,
} from "../store/SigningProposalSlice";
import type { ESignStatus, SigningProposal } from "../types/signingProposal";

export default function CorbanPannel() {
  const dispatch = useAppDispatch();
  const { itens, statusFilter, searchTerm, loading, error } =
    useAppSelector(selectProposals);

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

  return (
    <main
      className="p-6 max-w-6xl mx-auto md:mx-5"
      aria-labelledby="corban-heading"
    >
      <h1
        id="corban-heading"
        className="text-2xl font-bold mb-4 font-mono uppercase text-brand-blue-dark"
      >
        Painel de Acompanhamento do CORBAN
      </h1>

      <h2 className="text-xl mb-4 font-sans text-brand-blue-dark">
        Assinaturas Eletrônicas de Propostas em Operação:
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
  );
}

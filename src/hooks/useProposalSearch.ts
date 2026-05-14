import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchSigningProposals,
  selectProposals,
  setStatusFilter,
} from "../store/SigningProposalSlice";
import type { ESignStatus } from "../types/signingProposal";

import { useDebounce } from "./useDebounce";

export function useProposalSearch() {
  const dispatch = useAppDispatch();
  const { statusFilter, searchTerm } = useAppSelector(selectProposals);

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

  return {
    statusFilter,
    inputValue,
    handleStatusChange,
    handleInputChange,
  };
}

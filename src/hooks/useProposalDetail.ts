import { useCallback } from "react";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setSelection,
  clearSelection,
  notifyProposal,
  selectProposals,
} from "../store/SigningProposalSlice";
import type { SigningProposal } from "../types/signingProposal";

export function useProposalDetail() {
  const dispatch = useAppDispatch();
  const { selectedProposal } = useAppSelector(selectProposals);

  const handleRowClick = useCallback(
    (proposal: SigningProposal) => {
      dispatch(setSelection(proposal));
      if (
        proposal.notifiable &&
        proposal.status === "SIGNED" &&
        !proposal.notified
      ) {
        dispatch(notifyProposal(proposal.id));
      }
    },
    [dispatch],
  );

  const handleCloseModal = useCallback(() => {
    if (
      selectedProposal?.notifiable &&
      selectedProposal.status === "SIGNED" &&
      !selectedProposal.notified
    ) {
      dispatch(notifyProposal(selectedProposal.id));
    }
    dispatch(clearSelection());
  }, [dispatch, selectedProposal]);

  return { handleRowClick, handleCloseModal };
}

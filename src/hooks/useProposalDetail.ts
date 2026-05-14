import { useCallback } from "react";

import { useAppDispatch } from "../store/hooks";
import {
  setSelection,
  clearSelection,
  notifyProposal,
} from "../store/SigningProposalSlice";
import type { SigningProposal } from "../types/signingProposal";

export function useProposalDetail() {
  const dispatch = useAppDispatch();

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
    dispatch(clearSelection());
  }, [dispatch]);

  return { handleRowClick, handleCloseModal };
}

import { useState, useCallback } from "react";

import { approveDossier, disapproveDossier } from "../store/ESignDossierSlice";
import { useAppDispatch } from "../store/hooks";
import { addToast } from "../store/UiSlice";
import type { DossierState } from "../types/eSignDossier";

export function useDossierActions(
  proposalId: string,
  status: string,
  actionInProgress: DossierState["actionInProgress"],
) {
  const dispatch = useAppDispatch();

  const [showConfirm, setShowConfirm] = useState(false);
  const [showReason, setShowReason] = useState(false);

  const handleApprove = useCallback(() => {
    dispatch(approveDossier(proposalId))
      .unwrap()
      .then(() => {
        dispatch(
          addToast({ message: "Dossiê aprovado com sucesso", type: "success" }),
        );
      })
      .catch(() => {});
    setShowConfirm(false);
  }, [dispatch, proposalId]);

  const handleDisapprove = useCallback(
    (reason: string) => {
      dispatch(disapproveDossier({ proposalId, reason }))
        .unwrap()
        .then(() => {
          dispatch(addToast({ message: "Dossiê reprovado", type: "error" }));
        })
        .catch(() => {});
      setShowReason(false);
    },
    [dispatch, proposalId],
  );

  const canAct = status === "PENDING_VALIDATION" && !actionInProgress;

  const openApproveModal = () => setShowConfirm(true);
  const closeApproveModal = () => setShowConfirm(false);
  const openDisapproveModal = () => setShowReason(true);
  const closeDisapproveModal = () => setShowReason(false);

  return {
    handleApprove,
    handleDisapprove,
    showConfirm,
    showReason,
    openApproveModal,
    closeApproveModal,
    openDisapproveModal,
    closeDisapproveModal,
    canAct,
  };
}

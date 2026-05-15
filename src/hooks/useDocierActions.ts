import { useCallback } from "react";

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

  const handleApprove = useCallback(() => {
    dispatch(approveDossier(proposalId))
      .unwrap()
      .then(() => {
        dispatch(
          addToast({
            message: "Dossiê aprovado com sucesso",
            type: "success",
          }),
        );
      })
      .catch(() => {});
  }, [dispatch, proposalId]);

  const handleDisapprove = useCallback(
    (reason: string) => {
      dispatch(disapproveDossier({ proposalId, reason }))
        .unwrap()
        .then(() => {
          dispatch(addToast({ message: "Dossiê reprovado", type: "error" }));
        })
        .catch(() => {});
    },
    [dispatch, proposalId],
  );

  const canAct = status === "PENDING_VALIDATION" && !actionInProgress;

  return { handleApprove, handleDisapprove, canAct };
}

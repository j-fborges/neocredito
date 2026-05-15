import { useParams } from "react-router-dom";

import { useDossierActions } from "../../hooks/useDocierActions";
import { selectDossier } from "../../store/ESignDossierSlice";
import { useAppSelector } from "../../store/hooks";

import ActionButtons from "./ActionButtons";
import ApprovalModal from "./ApprovalModal";
import DisapprovalModal from "./DisapprovalModal";

export default function DecisionSection() {
  const { id } = useParams<{ id: string }>();
  const { data: dossier, actionInProgress } = useAppSelector(selectDossier);
  const {
    handleApprove,
    handleDisapprove,
    showConfirm,
    showReason,
    openApproveModal,
    closeApproveModal,
    openDisapproveModal,
    closeDisapproveModal,
    canAct,
  } = useDossierActions(id ?? "", dossier?.status ?? "", actionInProgress);

  return (
    <>
      <ActionButtons
        onApproveClick={openApproveModal}
        onDisapproveClick={openDisapproveModal}
        disabled={!canAct}
      />

      {showConfirm && (
        <ApprovalModal onConfirm={handleApprove} onCancel={closeApproveModal} />
      )}

      {showReason && (
        <DisapprovalModal
          onSubmit={handleDisapprove}
          onCancel={closeDisapproveModal}
        />
      )}
    </>
  );
}

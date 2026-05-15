import { X } from "lucide-react";

import { messages } from "../../i18n/pt-BR";
import {
  selectDossier,
  setDisapprovalDraft,
} from "../../store/ESignDossierSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

interface DisapprovalModalProps {
  onSubmit: (reason: string) => void;
  onCancel: () => void;
}

export default function DisapprovalModal({
  onSubmit,
  onCancel,
}: DisapprovalModalProps) {
  const dispatch = useAppDispatch();
  const { disapprovalDraft } = useAppSelector(selectDossier);
  const { disapprovalModal } = messages.dossier;

  const handleChange = (value: string) => {
    dispatch(setDisapprovalDraft(value));
  };

  const handleSubmit = () => {
    if (!disapprovalDraft.trim()) return;
    onSubmit(disapprovalDraft);
    dispatch(setDisapprovalDraft(""));
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-custom-lightgray rounded-lg p-6 max-w-md w-full border border-gray-300 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold font-mono uppercase text-brand-blue-dark">
            {disapprovalModal.title}
          </h3>
          <button
            className="text-gray-500 hover:text-black"
            onClick={handleCancel}
          >
            <X size={20} />
          </button>
        </div>
        <textarea
          value={disapprovalDraft}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={disapprovalModal.placeholder}
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 h-32 resize-none bg-white text-gray-800"
          autoFocus
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-400 rounded-lg hover:bg-gray-200 text-gray-700"
          >
            {disapprovalModal.cancel}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!disapprovalDraft.trim()}
            className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {disapprovalModal.submit}
          </button>
        </div>
      </div>
    </div>
  );
}

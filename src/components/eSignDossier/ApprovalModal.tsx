import { messages } from "../../i18n/pt-BR";

interface ApprovalModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ApprovalModal({
  onConfirm,
  onCancel,
}: ApprovalModalProps) {
  const { approvalModal: translations } = messages.dossier;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-custom-lightgray rounded-lg p-6 max-w-sm w-full border border-gray-300 shadow-lg">
        <h3 className="text-lg font-bold font-mono uppercase text-brand-blue-dark mb-4">
          {translations.title}
        </h3>
        <p className="text-gray-700 mb-6">{translations.message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-400 rounded-lg hover:bg-gray-200 text-gray-700"
          >
            {translations.cancel}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600"
          >
            {translations.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}

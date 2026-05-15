import { X } from "lucide-react";
import { useState } from "react";

interface ActionButtonsProps {
  onApprove: () => void;
  onDisapprove: (reason: string) => void;
  disabled: boolean;
}

export default function ActionButtons({
  onApprove,
  onDisapprove,
  disabled,
}: ActionButtonsProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showReason, setShowReason] = useState(false);
  const [reason, setReason] = useState("");

  const handleDisapprove = () => {
    if (!reason.trim()) return;
    onDisapprove(reason);
    setShowReason(false);
    setReason("");
  };

  return (
    <>
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => setShowConfirm(true)}
          disabled={disabled}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Aprovado
        </button>
        <button
          onClick={() => setShowReason(true)}
          disabled={disabled}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Reprovado
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirmar aprovação</h3>
            <p className="text-gray-600 mb-6">Deseja aprovar este dossiê?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onApprove();
                  setShowConfirm(false);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {showReason && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Motivo da reprovação</h3>
              <button
                onClick={() => setShowReason(false)}
                className="text-gray-500 hover:text-black"
              >
                <X size={20} />
              </button>
            </div>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Descreva o motivo..."
              className="w-full border rounded-lg p-3 mb-4 h-32 resize-none"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowReason(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleDisapprove}
                disabled={!reason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reprovar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

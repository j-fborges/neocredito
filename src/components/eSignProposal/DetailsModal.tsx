import { X } from "lucide-react";

import type { SigningProposal } from "../../types/signingProposal";

import ContactAttemptList from "./ContactAttemptList";
import StatusBadge from "./StatusBadge";

interface DetailsModalProps {
  proposal: SigningProposal | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
}

export default function DetailsModal({
  proposal,
  loading,
  error,
  onClose,
}: DetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Detalhes da Proposta</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black cursor-pointer"
            aria-label="Fechar modal"
          >
            <X size={24} />
          </button>
        </div>

        <hr className="border-gray-200 mb-4" />

        {loading && <p>Carregando...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {proposal && (
          <div className="space-y-4">
            <div>
              <p>
                <strong>ID:</strong> {proposal.id}
              </p>
              <p>
                <strong>Cliente:</strong> {proposal.customer.fullName}
              </p>
              <p>
                <strong>CPF:</strong> {proposal.customer.cpf}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <StatusBadge status={proposal.status} />
              </p>
            </div>

            <hr className="border-gray-200" />

            <div>
              <p>
                <strong>Link de Assinatura:</strong>{" "}
                <a
                  href={proposal.details.eSignLink}
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {proposal.details.eSignLink}
                </a>
              </p>
              <p>
                <strong>Data de Envio:</strong>{" "}
                {new Date(proposal.details.sentDate).toLocaleString("pt-BR")}
              </p>
            </div>

            <hr className="border-gray-200" />

            <div>
              <strong>Tentativas de Contato:</strong>
              <ContactAttemptList attempts={proposal.details.contactAttempts} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { X } from "lucide-react";

import { messages } from "../../i18n/pt-BR";
import type { SigningProposal } from "../../types/signingProposal";

import ContactAttemptList from "./ContactAttemptList";
import StatusBadge from "./StatusBadge";

interface DetailsModalProps {
  proposal: SigningProposal | null;
  loading: boolean;
  onClose: () => void;
}

export default function DetailsModal({
  proposal,
  loading,
  onClose,
}: DetailsModalProps) {
  const { modal: translations } = messages.proposal;
  const isNew =
    proposal?.notifiable && proposal.status === "SIGNED" && !proposal.notified;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-custom-lightgray rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-brand-blue-dark">
            {translations.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-brand-blue-dark cursor-pointer"
            aria-label={translations.close}
          >
            <X size={24} />
          </button>
        </div>
        <hr className="border-gray-200 mb-4" />

        {loading && <p>{messages.proposal.loading}</p>}

        {proposal && (
          <div className="space-y-4">
            <div>
              <p>
                <strong>ID:</strong> {proposal.id}
              </p>
              <p>
                <strong>{translations.client}:</strong>{" "}
                {proposal.customer.fullName}
              </p>
              <p>
                <strong>{translations.cpf}:</strong> {proposal.customer.cpf}
              </p>
              <p>
                <strong>{translations.status}:</strong>{" "}
                <StatusBadge status={proposal.status} pulse={isNew} />
              </p>
            </div>
            <hr className="border-gray-200" />
            <div>
              <p>
                <strong>{translations.link}:</strong>{" "}
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
                <strong>{translations.sentDate}:</strong>{" "}
                {new Date(proposal.details.sentDate).toLocaleString("pt-BR")}
              </p>
            </div>
            <hr className="border-gray-200" />
            <div>
              <strong>{translations.attempts}:</strong>
              <ContactAttemptList attempts={proposal.details.contactAttempts} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

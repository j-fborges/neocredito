import { messages } from "../../i18n/pt-BR";
import type { ContactAttempt as ContactAttemptType } from "../../types/signingProposal";

interface ContactAttemptProps {
  attempt: ContactAttemptType;
}

function formatDate(isoString: string) {
  return new Date(isoString).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ContactAttemptItem({ attempt }: ContactAttemptProps) {
  const { fields } = messages.proposal.modal;
  const mediumLabel = messages.contactMedium[attempt.medium];

  return (
    <li className="bg-gray-200 rounded-lg p-3">
      <dl className="space-y-1">
        <div className="text-sm text-gray-800">
          <dt className="font-medium inline">{fields.date}:</dt>
          <dd className="inline ml-1">{formatDate(attempt.date)}</dd>
        </div>
        <div className="text-sm text-gray-800">
          <dt className="font-medium inline">{fields.medium}:</dt>
          <dd className="inline ml-1">{mediumLabel}</dd>
        </div>
        <div className="text-sm text-gray-800">
          <dt className="font-medium inline">{fields.observation}:</dt>
          <dd className="inline ml-1">{attempt.observation || "—"}</dd>
        </div>
      </dl>
    </li>
  );
}

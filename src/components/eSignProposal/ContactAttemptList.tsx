import { messages } from "../../i18n/pt-BR";
import type { ContactAttempt as ContactAttemptType } from "../../types/signingProposal";

import ContactAttempt from "./ContactAttempt";

interface ContactAttemptListProps {
  attempts: ContactAttemptType[];
}

export default function ContactAttemptList({
  attempts,
}: ContactAttemptListProps) {
  if (attempts.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        {messages.proposal.modal.noAttempts}
      </p>
    );
  }

  return (
    <ul className="list-none space-y-2 mt-1">
      {attempts.map((attempt, idx) => (
        <ContactAttempt key={idx} attempt={attempt} />
      ))}
    </ul>
  );
}

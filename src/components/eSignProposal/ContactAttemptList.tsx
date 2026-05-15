import { messages as translations } from "../../i18n/pt-BR";
import type { ContactAttempt as ContactAttemptType } from "../../types/signingProposal";

import ContactAttemptItem from "./ContactAttemptItem";

interface ContactAttemptListProps {
  attempts: ContactAttemptType[];
}

export default function ContactAttemptList({
  attempts,
}: ContactAttemptListProps) {
  if (attempts.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        {translations.proposal.modal.noAttempts}
      </p>
    );
  }

  return (
    <ul className="list-none space-y-2 mt-1">
      {attempts.map((attempt, idx) => (
        <ContactAttemptItem key={idx} attempt={attempt} />
      ))}
    </ul>
  );
}
